/**
 * About Page
 * Documentation links and app information
 */

import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          关于 AI Token Monitor
        </h1>
        <Link
          to="/"
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          返回仪表盘
        </Link>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          应用信息
        </h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium text-gray-900 dark:text-white">版本：</span>
            1.0.0
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-white">功能：</span>
            多平台 AI Token 使用量监控工具
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-white">支持平台：</span>
            Ark、Zai、Claude、MiniMax
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          主要功能
        </h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>实时监控各平台 API Token 使用量</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>支持多个账户管理</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>自定义阈值告警（警告/危险）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>历史使用趋势图表分析</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>数据本地存储，保护隐私</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>支持数据导出备份</span>
          </li>
        </ul>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          键盘快捷键
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">刷新数据</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
              R
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">凭证管理</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
              C
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">使用趋势</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
              T
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">首页</span>
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
              H
            </kbd>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          快速导航
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            仪表盘
          </Link>
          <Link
            to="/credentials"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            凭证管理
          </Link>
          <Link
            to="/trends"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            使用趋势
          </Link>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              隐私保护
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              所有数据均存储在本地浏览器中，不会上传到任何服务器。
              您的 API 凭证经过加密处理，确保安全。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
