/**
 * Error Message Component
 * Displays error with optional retry action
 */

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({ title = '错误', message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-start">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400 dark:text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{title}</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
        </div>

        {/* Actions */}
        {(onRetry || onDismiss) && (
          <div className="ml-4 flex flex-shrink-0 gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
              >
                重试
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-200 dark:hover:bg-red-900/30"
              >
                关闭
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Inline error message for smaller spaces
 */
export function InlineError({ message }: { message: string }) {
  return (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}
