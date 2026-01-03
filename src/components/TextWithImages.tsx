"use client";
import { ImageIcon } from "lucide-react";

export const TextWithImages = ({ text }: { text: string }) => {
  if (!text) return null;
  const parts = text.split(/(\))/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("[Image of") && part.endsWith("]")) {
          const query = part.replace("", "");
          return (
            <span key={i} className="block my-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl overflow-hidden transition-all hover:shadow-md">
               <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                 <ImageIcon size={14} /> AI Visual Concept
               </span>
               <img 
                 src={`https://placehold.co/600x300/e0e7ff/4f46e5?text=${encodeURIComponent(query)}&font=roboto`} 
                 alt={query}
                 className="w-full h-auto rounded-lg shadow-sm object-cover"
               />
               <span className="block text-center text-[10px] text-gray-400 dark:text-gray-500 mt-2 italic">
                 Visualizing: {query}
               </span>
            </span>
          );
        }
        return <span key={i} className="leading-relaxed">{part}</span>;
      })}
    </span>
  );
};