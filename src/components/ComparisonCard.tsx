import { Scale, TrendingDown, TrendingUp } from 'lucide-react';

type ComparisonCardProps={
  nutrient: string;        // e.g. "Sugar"
  currentValue: string;    // e.g. "24g"
  comparisonText: string;  // e.g. "Equivalent to 6 sugar cubes"
  sentiment: 'positive' | 'negative' | 'neutral';
}

export const ComparisonCard = ({ nutrient, currentValue, comparisonText, sentiment }: ComparisonCardProps) => {
  // Map colors explicitly for safe Dark Mode support
  const colors = {
    positive: {
      bg: "bg-green-50/50 dark:bg-green-900/20",
      border: "border-green-100 dark:border-green-800",
      iconBg: "bg-white dark:bg-green-900/50",
      icon: "text-green-500 dark:text-green-400",
      text: "text-green-700 dark:text-green-300",
    },
    negative: {
      bg: "bg-red-50/50 dark:bg-red-900/20",
      border: "border-red-100 dark:border-red-800",
      iconBg: "bg-white dark:bg-red-900/50",
      icon: "text-red-500 dark:text-red-400",
      text: "text-red-700 dark:text-red-300",
    },
    neutral: {
      bg: "bg-blue-50/50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800",
      iconBg: "bg-white dark:bg-blue-900/50",
      icon: "text-blue-500 dark:text-blue-400",
      text: "text-blue-700 dark:text-blue-300",
    },
  };

  const theme = colors[sentiment];
  
  return (
    <div className={`p-4 rounded-xl mb-4 flex items-center gap-4 border ${theme.bg} ${theme.border} transition-colors duration-300`}>
      <div className={`p-3 rounded-full shadow-sm ${theme.iconBg} ${theme.icon}`}>
        {sentiment === 'positive' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <h4 className="font-bold text-gray-800 dark:text-gray-200">{nutrient}: {currentValue}</h4>
        </div>
        <p className={`text-sm font-medium mt-0.5 ${theme.text}`}>
          {comparisonText}
        </p>
      </div>
    </div>
  );
};