import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';

type QuickVerdictProps={
    status: 'safe' | 'caution' | 'avoid';
    title: string;
    explanation: string;
    nuanceTag?: string;
}

export const QuickVerdict = ({ status, title, explanation, nuanceTag } : QuickVerdictProps) => {
  // Config based on status: 'safe', 'caution', 'avoid'
  const styles = {
    safe: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800",
      icon: <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      text: "text-emerald-900 dark:text-emerald-100",
      accent: "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    },
    caution: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-800",
      icon: <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      text: "text-amber-900 dark:text-amber-100",
      accent: "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    },
    avoid: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30 border-rose-200 dark:border-rose-800",
      icon: <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      text: "text-rose-900 dark:text-rose-100",
      accent: "bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
    }
  };

  const currentStyle = styles[status] || styles.caution;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${currentStyle.bg} transition-all hover:shadow-md duration-300`}>
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 bg-white/60 dark:bg-black/20 rounded-full backdrop-blur-sm">
          {currentStyle.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className={`font-bold text-lg ${currentStyle.text}`}>
              {title}
            </h3>
            {nuanceTag && (
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${currentStyle.accent}`}>
                {nuanceTag}
              </span>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed opacity-90">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
};