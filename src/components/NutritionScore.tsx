import React from 'react';

type Props = {
  score: number; // 0-100
  subtitle?: string;
  feedback?: string;
};

export const NutritionScore = ({ 
  score, 
  subtitle = "A quick heuristic of overall healthiness", 
  feedback 
}: Props) => {
  
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  
  // Color logic
  const color = normalized >= 75 ? 'bg-emerald-400' : normalized >= 50 ? 'bg-amber-400' : 'bg-red-400';
  const dotColor = normalized >= 75 ? 'text-emerald-500' : normalized >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-4 mb-4 transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Nutrition Score</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{normalized}/100</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-3">
        <div 
          className={`h-3 ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${normalized}%` }}
        />
      </div>

      {/* Feedback (if exists) */}
      {feedback && (
        <div className="flex items-start gap-2 mt-2">
          <span className={`text-xl leading-none ${dotColor}`}>•</span>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
};