import { Factory, Leaf, TestTube } from 'lucide-react';

type ProcessingMeterProps={
  level: 1 | 2 | 3 | 4; // 1 = Unprocessed, 4 = Ultra-processed
  title: string;        // e.g., "NOVA Group 4"
  description: string;  // e.g., "Industrial formulation with 5+ additives."
}

export const ProcessingMeter = ({ level, title, description }: ProcessingMeterProps) => {
  const levels = [
    { color: 'bg-green-500', label: 'Natural' },
    { color: 'bg-yellow-400', label: 'Culinary' },
    { color: 'bg-orange-500', label: 'Processed' },
    { color: 'bg-red-500', label: 'Ultra' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          {level === 1 ? <Leaf size={18} className="text-green-500"/> : 
           level === 4 ? <Factory size={18} className="text-red-500"/> :
           <TestTube size={18} className="text-orange-500"/>}
          Processing Level
        </h3>
        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">NOVA {level}</span>
      </div>

      {/* The Meter Bar */}
      <div className="flex gap-1 h-3 mb-3">
        {levels.map((l, i) => (
          <div 
            key={i}
            className={`flex-1 rounded-full transition-all duration-500 ${
              i + 1 === level ? l.color : 'bg-gray-100 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Description */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};