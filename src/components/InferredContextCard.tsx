import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Edit3, CheckCircle2, X, Save } from 'lucide-react';
import { cn } from "@/lib/utils"; 

type InferredContextProps = {
  inferredLabel: string;
  confidence?: number;
  onConfirm: (finalContext: string) => void; // UPDATED: Returns the string
  onDismiss?: () => void;
  isVisible: boolean;
};

export default function InferredContextCard({
  inferredLabel,
  confidence = 85,
  onConfirm,
  onDismiss,
  isVisible
}: InferredContextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(inferredLabel);
  const [status, setStatus] = useState<'idle' | 'confirmed'>('idle');
  const [shouldRender, setShouldRender] = useState(isVisible);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentLabel(inferredLabel);
  }, [inferredLabel]);

  useEffect(() => {
    if (isVisible) setShouldRender(true);
    else setTimeout(() => setShouldRender(false), 500);
  }, [isVisible]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (!shouldRender) return null;

  const handleConfirm = () => {
    setStatus('confirmed');
    // Pass the final label back to the parent
    if (onConfirm) setTimeout(() => onConfirm(currentLabel), 800); 
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save mode
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  return (
    <div className={cn(
      "w-full max-w-md mx-auto mb-3 overflow-hidden rounded-2xl border transition-all duration-500 ease-out z-10",
      "bg-white/90 border-emerald-100 shadow-lg shadow-emerald-500/10 backdrop-blur-md",
      "dark:bg-gray-800/95 dark:border-gray-700 dark:shadow-black/30",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
    )}>
      
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles size={10} className={status === 'confirmed' ? "animate-ping" : "animate-pulse"} />
            AI Context Detection
          </div>
          {onDismiss && (
            <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 transition-colors"><X size={14} /></button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex items-baseline gap-2 mb-3">
           <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Detected:</span>
           
           {isEditing ? (
             <input 
               ref={inputRef}
               value={currentLabel}
               onChange={(e) => setCurrentLabel(e.target.value)}
               className="flex-1 bg-transparent border-b border-emerald-500 text-md font-bold text-gray-900 dark:text-white focus:outline-none pb-1"
             />
           ) : (
             <h3 className="text-md font-bold text-gray-900 dark:text-white leading-tight truncate">
                {currentLabel}
             </h3>
           )}
        </div>

        {/* Interaction Area */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug flex-1">
            {isEditing ? " refine the context..." : "Is this context correct?"}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {isEditing ? <><Save size={12}/> Save</> : <><Edit3 size={12}/> Edit</>}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={status === 'confirmed' || isEditing}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300",
                status === 'confirmed'
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
              )}
            >
              {status === 'confirmed' ? <><CheckCircle2 size={12} /> Confirmed</> : "Yes, correct"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}