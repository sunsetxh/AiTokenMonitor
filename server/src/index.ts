/**
 * Token Monitor Proxy Server
 * Handles CORS proxy for AI platform APIs
 * Stores credentials and usage data in SQLite
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/monitor.db');

// Initialize SQLite database
console.log('Database path:', DB_PATH);
const db = new Database(DB_PATH);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS credentials (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    credential TEXT NOT NULL,
    limit_type TEXT DEFAULT 'monthly',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS usage_records (
    id TEXT PRIMARY KEY,
    platform_account_id TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    tokens_remaining INTEGER NOT NULL,
    quota_total INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    next_reset_time TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS threshold_configs (
    id TEXT PRIMARY KEY,
    platform_account_id TEXT NOT NULL UNIQUE,
    warning_percent INTEGER DEFAULT 70,
    critical_percent INTEGER DEFAULT 90,
    notifications_enabled INTEGER DEFAULT 1,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Enable CORS for all origins
app.use(cors({
  origin: true,
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// ============ Credentials API ============

// Get all credentials
app.get('/api/credentials', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, platform, label, limit_type, created_at, updated_at FROM credentials');
    const rows = stmt.all();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error getting credentials:', error);
    res.status(500).json({ success: false, error: 'Failed to get credentials' });
  }
});

// Get single credential
app.get('/api/credentials/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM credentials WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Credential not found' });
    }
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error getting credential:', error);
    res.status(500).json({ success: false, error: 'Failed to get credential' });
  }
});

// Add credential
app.post('/api/credentials', (req, res) => {
  try {
    const { platform, label, credential, limitType } = req.body;
    if (!platform || !label || !credential) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO credentials (id, platform, label, credential, limit_type)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, platform, label, credential, limitType || 'monthly');

    res.json({ success: true, data: { id, platform, label, limitType: limitType || 'monthly' } });
  } catch (error) {
    console.error('Error adding credential:', error);
    res.status(500).json({ success: false, error: 'Failed to add credential' });
  }
});

// Update credential
app.put('/api/credentials/:id', (req, res) => {
  try {
    const { label, credential, limitType } = req.body;
    const updates: string[] = [];
    const values: any[] = [];

    if (label) {
      updates.push('label = ?');
      values.push(label);
    }
    if (credential) {
      updates.push('credential = ?');
      values.push(credential);
    }
    if (limitType) {
      updates.push('limit_type = ?');
      values.push(limitType);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    const stmt = db.prepare(`UPDATE credentials SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating credential:', error);
    res.status(500).json({ success: false, error: 'Failed to update credential' });
  }
});

// Delete credential
app.delete('/api/credentials/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM credentials WHERE id = ?');
    stmt.run(req.params.id);

    // Also delete related records
    db.prepare('DELETE FROM usage_records WHERE platform_account_id = ?').run(req.params.id);
    db.prepare('DELETE FROM threshold_configs WHERE platform_account_id = ?').run(req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ success: false, error: 'Failed to delete credential' });
  }
});

// ============ Usage Records API ============

// Get latest usage for all accounts (must be before :platformAccountId route)
app.get('/api/usage/latest', (req, res) => {
  try {
    // First, get all records
    const allStmt = db.prepare('SELECT * FROM usage_records');
    const allRows = allStmt.all();
    console.log('[GET /api/usage/latest] Total records:', allRows.length);

    if (allRows.length === 0) {
      return res.json({ success: true, data: {} });
    }

    const stmt = db.prepare(`
      SELECT u.* FROM usage_records u
      INNER JOIN (
        SELECT platform_account_id, MAX(timestamp) as max_timestamp
        FROM usage_records
        GROUP BY platform_account_id
      ) latest ON u.platform_account_id = latest.platform_account_id AND u.timestamp = latest.max_timestamp
    `);
    const rows = stmt.all();
    console.log('[GET /api/usage/latest] Found rows:', rows.length);

    // Convert to map
    const map: Record<string, any> = {};
    for (const row of rows) {
      map[row.platform_account_id] = row;
    }

    res.json({ success: true, data: map });
  } catch (error) {
    console.error('Error getting latest usage:', error);
    res.status(500).json({ success: false, error: 'Failed to get latest usage' });
  }
});

// Save usage record
app.post('/api/usage', (req, res) => {
  try {
    const { platformAccountId, tokensUsed, tokensRemaining, quotaTotal, timestamp, nextResetTime } = req.body;
    if (!platformAccountId || tokensUsed === undefined || tokensRemaining === undefined || !quotaTotal || !timestamp) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO usage_records (id, platform_account_id, tokens_used, tokens_remaining, quota_total, timestamp, next_reset_time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, platformAccountId, tokensUsed, tokensRemaining, quotaTotal, timestamp, nextResetTime || null);

    res.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error saving usage record:', error);
    res.status(500).json({ success: false, error: 'Failed to save usage record' });
  }
});

// Get usage records for an account (must be after /latest)
app.get('/api/usage/:platformAccountId', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM usage_records
      WHERE platform_account_id = ?
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    const rows = stmt.all(req.params.platformAccountId);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error getting usage records:', error);
    res.status(500).json({ success: false, error: 'Failed to get usage records' });
  }
});

// ============ Threshold Config API ============

// Get threshold config
app.get('/api/thresholds/:platformAccountId', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM threshold_configs WHERE platform_account_id = ?');
    const row = stmt.get(req.params.platformAccountId);
    res.json({ success: true, data: row || null });
  } catch (error) {
    console.error('Error getting threshold:', error);
    res.status(500).json({ success: false, error: 'Failed to get threshold' });
  }
});

// Save threshold config
app.post('/api/thresholds', (req, res) => {
  try {
    const { platformAccountId, warningPercent, criticalPercent, notificationsEnabled } = req.body;
    if (!platformAccountId) {
      return res.status(400).json({ success: false, error: 'Missing platformAccountId' });
    }

    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO threshold_configs (id, platform_account_id, warning_percent, critical_percent, notifications_enabled, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    stmt.run(id, platformAccountId, warningPercent || 70, criticalPercent || 90, notificationsEnabled ? 1 : 0);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving threshold:', error);
    res.status(500).json({ success: false, error: 'Failed to save threshold' });
  }
});

// ============ Proxy Endpoints ============

// Proxy endpoint for Zai API
app.all('/api/zai/*', async (req, res) => {
  const path = req.params[0];
  const baseUrl = 'https://api.z.ai';

  try {
    const response = await fetch(`${baseUrl}/${path}?${new URLSearchParams(req.query as Record<string, string>)}`, {
      method: req.method,
      headers: {
        'Authorization': req.headers.authorization || '',
        'Accept-Language': 'en-US,en',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
});

// Proxy endpoint for MiniMax API
app.all('/api/minimax/*', async (req, res) => {
  const path = req.params[0];
  const baseUrl = 'https://www.minimaxi.com';

  try {
    const response = await fetch(`${baseUrl}/${path}?${new URLSearchParams(req.query as Record<string, string>)}`, {
      method: req.method,
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('MiniMax proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from frontend build in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  // Simple approach: look in server/dist relative to current working directory
  const frontendPath = path.resolve(process.cwd(), 'server/dist');
  console.log('Frontend path:', frontendPath);

  app.use(express.static(frontendPath));

  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Start server
const server = createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`   Database: ${DB_PATH}`);
  console.log(`   Zai API proxy: http://0.0.0.0:${PORT}/api/zai/`);
  console.log(`   MiniMax API proxy: http://0.0.0.0:${PORT}/api/minimax/`);
});
