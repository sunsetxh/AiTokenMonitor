import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { LoadingSpinner } from './components/common/LoadingSpinner'

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('./components/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const CredentialsPage = lazy(() => import('./components/credentials/CredentialsPage').then(m => ({ default: m.CredentialsPage })))
const TrendsPage = lazy(() => import('./components/trends/TrendsPage').then(m => ({ default: m.TrendsPage })))
const AboutPage = lazy(() => import('./components/about/AboutPage').then(m => ({ default: m.AboutPage })))
const TeamMonitorPage = lazy(() => import('./components/team/TeamMonitorPage').then(m => ({ default: m.TeamMonitorPage })))

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Token Monitor
            </h1>
            <nav className="flex items-center gap-4">
              <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </a>
              <a href="/credentials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Credentials
              </a>
              <a href="/trends" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Trends
              </a>
              <a href="/team" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Teams
              </a>
              <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                About
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="flex justify-center py-12"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/team" element={<TeamMonitorPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
