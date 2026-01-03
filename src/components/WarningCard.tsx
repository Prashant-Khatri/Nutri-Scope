import React from 'react';
import { AlertTriangle } from 'lucide-react';

type Props = {
  title: string;
  severity?: 'low' | 'medium' | 'high';
  reasoning?: string;
  source?: string;
};

export default function WarningCard({ title, severity = 'medium', reasoning, source }: Props) {
  const isHigh = severity === 'high';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-l-8 p-5 shadow-md mb-5 transition-all duration-300
        ${isHigh
          ? 'bg-linear-to-r from-red-50 to-white dark:from-red-900/40 dark:to-gray-800 border-red-500'
          : 'bg-linear-to-r from-amber-50 to-white dark:from-amber-900/40 dark:to-gray-800 border-amber-500'}
      `}
    >
      {/* subtle alert glow */}
      <div
        className={`absolute inset-0 pointer-events-none
          ${isHigh ? 'bg-red-200/10 dark:bg-red-900/20' : 'bg-amber-200/10 dark:bg-amber-900/20'}
        `}
      />

      <div className="relative flex items-start gap-4">
        {/* icon */}
        <div
          className={`flex items-center justify-center rounded-full p-2
            ${isHigh ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'}
          `}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* content */}
        <div className="flex-1">
          <h3
            className={`font-bold text-base leading-snug
              ${isHigh ? 'text-red-800 dark:text-red-200' : 'text-amber-800 dark:text-amber-200'}
            `}
          >
            {title}
          </h3>

          {reasoning && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
              {reasoning}
            </p>
          )}

          {source && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
              Source: {source}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}