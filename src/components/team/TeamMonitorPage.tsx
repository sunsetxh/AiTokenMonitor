/**
 * Team Monitor Page
 * Visualize Claude Code agent team messages
 */

import { useState, useEffect } from 'react';

interface TeamMessage {
  from: string;
  text: string;
  summary?: string;
  timestamp: string;
  color: string;
  read: boolean;
}

interface TeamConfig {
  name: string;
  description?: string;
  createdAt: number;
  leadAgentId: string;
  members: Array<{
    name: string;
    model: string;
    agentType?: string;
    color?: string;
  }>;
}

interface Team {
  name: string;
  config: TeamConfig;
  inboxes: Record<string, TeamMessage[]>;
}

const colorMap: Record<string, { bg: string; text: string; border: string; solid: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', solid: 'bg-blue-500' },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800', solid: 'bg-green-500' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800', solid: 'bg-red-500' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800', solid: 'bg-yellow-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', solid: 'bg-purple-500' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800', solid: 'bg-pink-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800', solid: 'bg-orange-500' },
};

export function TeamMonitorPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data.teams || []);

      if (!selectedTeam && data.teams?.length > 0) {
        setSelectedTeam(data.teams[0].name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    if (autoRefresh) {
      const interval = setInterval(fetchTeams, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    setSelectedMember(null);
  }, [selectedTeam]);

  const currentTeam = teams.find(t => t.name === selectedTeam);
  const config = currentTeam?.config;
  const inboxes = currentTeam?.inboxes || {};

  const allMessages = Object.entries(inboxes).flatMap(([inbox, msgs]) =>
    msgs
      .filter(m => !selectedMember || m.from === selectedMember || inbox === selectedMember)
      .map(m => ({ ...m, inbox }))
  );
  const unreadCount = allMessages.filter(m => !m.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return '$(minutes)分钟前';
    if (hours < 24) return '$(hours)小时前';
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const formatFullTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isProtocolMessage = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return parsed.type !== undefined;
    } catch {
      return false;
    }
  };

  const getProtocolType = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return parsed.type || 'unknown';
    } catch {
      return null;
    }
  };

  const getProtocolLabel = (type: string) => {
    const labels: Record<string, string> = {
      idle_notification: '空闲',
      shutdown_request: '关闭请求',
      shutdown_approved: '同意关闭',
      task_assignment: '任务分配',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary-200 border-t-primary-600"></div>
          <p className="text-gray-500 dark:text-gray-400">加载团队数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">加载失败</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">暂无团队</h2>
          <p className="text-gray-600 dark:text-gray-400">请先创建一个 Claude Code 团队</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>👥</span>
            <span>团队监控</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">实时查看 Agent 团队通信</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              {unreadCount} 条未读
            </span>
          )}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={'px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (
              autoRefresh
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            )}
          >
            {autoRefresh ? '🔄 自动刷新' : '⏸ 已暂停'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择团队
            </label>
            <div className="flex flex-wrap gap-2">
              {teams.map((team) => (
                <button
                  key={team.name}
                  onClick={() => setSelectedTeam(team.name)}
                  className={'px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (
                    selectedTeam === team.name
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>

          {config && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                筛选成员
                {selectedMember && (
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="ml-2 text-xs text-primary-600 hover:text-primary-700"
                  >
                    清除筛选
                  </button>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMember(null)}
                  className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-all ' + (
                    !selectedMember
                      ? 'bg-gray-800 text-white dark:bg-gray-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  全部成员
                </button>
                {config.members.map((member) => {
                  const colors = colorMap[member.color || 'blue'] || colorMap.blue;
                  const isSelected = selectedMember === member.name;
                  return (
                    <button
                      key={member.name}
                      onClick={() => setSelectedMember(member.name)}
                      className={'px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ' + (
                        isSelected
                          ? colors.solid + ' text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      <span className="w-2 h-2 rounded-full bg-current opacity-80"></span>
                      <span>{member.name}</span>
                      {member.agentType === 'team-lead' && <span>👑</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {config && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {config.description || config.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {config.members.map((member) => {
              const isLead = member.agentType === 'team-lead';
              return (
                <span
                  key={member.name}
                  className={'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ' + (
                    isLead
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  )}
                >
                  <span className="font-medium">{member.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">· {member.model}</span>
                  {isLead && <span className="text-xs">👑</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {allMessages.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">消息时间线</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  共 {allMessages.length} 条消息
                  {selectedMember && ' · 筛选: ' + selectedMember}
                </p>
              </div>
              {selectedMember && (
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  显示全部
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[...allMessages].reverse().map((msg, idx) => {
              const colors = colorMap[msg.color] || colorMap.blue;
              const isProtocol = isProtocolMessage(msg.text);
              const protocolType = isProtocol ? getProtocolType(msg.text) : null;

              return (
                <div
                  key={idx}
                  className={'px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ' + (!msg.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : '')}
                >
                  <div className="flex gap-4">
                    <div className={'w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ' + (
                      msg.color === 'blue' ? 'bg-blue-500' :
                      msg.color === 'green' ? 'bg-green-500' :
                      msg.color === 'red' ? 'bg-red-500' :
                      msg.color === 'yellow' ? 'bg-yellow-500' :
                      msg.color === 'purple' ? 'bg-purple-500' :
                      'bg-gray-500'
                    )}>
                      {msg.from.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{msg.from}</span>
                          {isProtocol && protocolType && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                              {getProtocolLabel(protocolType)}
                            </span>
                          )}
                          {!msg.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <time
                          className="text-xs text-gray-500 dark:text-gray-400"
                          title={formatFullTime(msg.timestamp)}
                        >
                          {formatTimestamp(msg.timestamp)}
                        </time>
                      </div>

                      <div className={'text-sm ' + colors.text + ' rounded-lg p-3 ' + (
                        isProtocol
                          ? 'bg-gray-100 dark:bg-gray-800 font-mono text-xs'
                          : colors.bg + ' ' + colors.border + ' border'
                      )}>
                        {isProtocol ? (
                          <span className="break-all">{msg.text}</span>
                        ) : msg.summary ? (
                          <div>
                            <p className="font-medium">{msg.summary}</p>
                            {msg.text !== msg.summary && (
                              <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">{msg.text}</p>
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        )}
                      </div>

                      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        → {msg.inbox}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-gray-500 dark:text-gray-400">
            {selectedMember ? selectedMember + ' 暂无消息' : '暂无消息'}
          </p>
        </div>
      )}
    </div>
  );
}
