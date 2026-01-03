import React from 'react';

type Suggestion = { title: string; reason?: string; link?: string };

type Props = {
  suggestions: Suggestion[];
};

export default function AlternativeSuggestionCard({ suggestions }: {suggestions : string[]}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-5 mb-5 overflow-hidden transition-colors duration-300">
      {/* soft background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/40 via-transparent to-transparent dark:from-emerald-900/20 pointer-events-none" />

      {/* header */}
      <div className="relative flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base tracking-tight">
          Alternative Suggestions
        </h4>
        <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition">
          View Product →
        </button>
      </div>

      {/* suggestions */}
      <div className="relative space-y-3">
        {suggestions.map((suggestion, i) => {
          const s = JSON.parse(suggestion);

          const handleOpen = (e?: React.MouseEvent) => {
            if (e) e.stopPropagation();
            const q = encodeURIComponent(`${s.title}${s.reason ? ' ' + s.reason : ''}`);
            const url = `https://www.google.com/search?q=${q}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          };

          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={handleOpen}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
              className="group p-4 rounded-xl bg-linear-to-r from-emerald-50 to-white dark:from-gray-700/50 dark:to-gray-800 border border-emerald-100 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 leading-snug">
                    {s.title}
                  </div>

                  {s.reason && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {s.reason}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group-hover:underline">
                  Open
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}