import React from 'react';
import { Info } from 'lucide-react';

type Item = { label: string; value: string; status?: 'good' | 'bad' };
type Props = { items: Item[] };

export default function IngredientTable({ items }: {items : string[]}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden mb-5 transition-colors duration-300">
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-50/40 via-transparent to-transparent dark:from-gray-700/20 pointer-events-none" />

      {/* header */}
      <div className="relative bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm tracking-tight">
          Nutritional Breakdown
        </span>
        <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* rows */}
      <div className="relative divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((i, idx) => {
          const item=JSON.parse(i);
          return (
            <div
            key={idx}
            className="flex justify-between items-center px-4 py-3 hover:bg-gray-50/60 dark:hover:bg-gray-700/60 transition-colors"
          >
            <span className="text-gray-800 dark:text-gray-300 font-medium">
              {item.label}
            </span>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {item.value}
              </span>

              {item.status === 'bad' && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              )}

              {item.status === 'good' && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
              )}
            </div>
          </div>
          )
      })}
      </div>
    </div>
  );
}