"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title?: string;
  explanation?: string;
};

export default function ScienceExplainer({
  title = "Why this matters",
  explanation,
}: Props) {
  if (
    typeof explanation !== "string" ||
    explanation.trim().length < 30 || 
    typeof title !== "string" ||
    title.trim().length === 0
  ) {
    return null;
  }

  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md mb-5 overflow-hidden transition-colors duration-300">
      {/* soft background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50/40 via-transparent to-transparent dark:from-indigo-900/20 pointer-events-none" />

      <button
        onClick={() => setOpen((s) => !s)}
        className="relative w-full flex justify-between items-center px-4 py-4 text-left"
        aria-expanded={open}
      >
        <div>
          <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm tracking-tight">
            {title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Tap to learn more
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`relative px-4 transition-all duration-500 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}