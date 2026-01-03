import React from 'react';
import { CheckCircle } from 'lucide-react';

type Props = {
  message: string;
  variant?: 'success' | 'info';
};

export default function HealthBadge({ message, variant = 'success' }: Props) {
  const isSuccess = variant === 'success';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 mb-4 border shadow-sm transition-colors duration-300
        ${isSuccess
          ? 'bg-linear-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 border-green-200 dark:border-green-800'
          : 'bg-linear-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-blue-200 dark:border-blue-800'}
      `}
    >
      {/* subtle glow */}
      <div
        className={`absolute inset-0 pointer-events-none
          ${isSuccess
            ? 'bg-green-200/10 dark:bg-green-400/10'
            : 'bg-blue-200/10 dark:bg-blue-400/10'}
        `}
      />

      {/* icon */}
      <div
        className={`relative flex items-center justify-center p-2.5 rounded-full
          ${isSuccess
            ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
            : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}
        `}
      >
        <CheckCircle className="w-6 h-6" />
      </div>

      {/* text */}
      <p
        className={`relative text-sm font-semibold leading-snug
          ${isSuccess ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'}
        `}
      >
        {message}
      </p>
    </div>
  );
}