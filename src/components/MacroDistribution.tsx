import { Flame } from 'lucide-react';

type MacroDistributionProps={
  carbs: number;   // percentage (0-100)
  protein: number; // percentage
  fat: number;     // percentage
  calories: number; // Total calories
}

export const MacroDistribution = ({ carbs, protein, fat, calories }: MacroDistributionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 dark:text-gray-200">Energy Source</h3>
        <div className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
          <Flame size={14} fill="currentColor" />
          <span className="text-xs font-bold">{calories} kcal</span>
        </div>
      </div>

      {/* Stacked Bar */}
      <div className="flex h-4 w-full rounded-full overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
        <div style={{ width: `${protein}%` }} className="bg-emerald-400" />
        <div style={{ width: `${fat}%` }} className="bg-yellow-400" />
        <div style={{ width: `${carbs}%` }} className="bg-blue-400" />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">Protein</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{protein}%</span>
        </div>
        <div className="flex flex-col border-l border-r border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">Fat</span>
          <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{fat}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">Carbs</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{carbs}%</span>
        </div>
      </div>
    </div>
  );
};