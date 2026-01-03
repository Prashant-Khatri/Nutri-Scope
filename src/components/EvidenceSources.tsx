"use client";

import { ShieldCheck, ExternalLink, Info } from "lucide-react";

export type EvidenceSource = {
  title: string;
  authority: "WHO" | "FDA" | "ICMR" | "NIH" | "Peer-Reviewed";
  description: string;
  confidence: number;
  url?: string;
};

interface EvidenceSourcesProps {
  sources?: (EvidenceSource | string)[];
}

// Updated Map with Dark Mode Support
const authorityColorMap: Record<EvidenceSource["authority"], string> = {
  WHO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  FDA: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  ICMR: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  NIH: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  "Peer-Reviewed": "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
};

export default function EvidenceSources({ sources }: EvidenceSourcesProps) {
  if (!Array.isArray(sources)) return null;

  const normalizedSources = sources
    .map((src) => {
      if (typeof src === "string") {
        try { return JSON.parse(src); } catch { return null; }
      }
      return src;
    })
    .filter(Boolean);

  const validSources = normalizedSources.filter(
    (src): src is EvidenceSource =>
      typeof src.title === "string" &&
      typeof src.description === "string" &&
      typeof src.confidence === "number" &&
      src.confidence >= 0 &&
      src.confidence <= 100 &&
      typeof src.authority === "string" &&
      src.authority in authorityColorMap
  );

  if (validSources.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 space-y-3 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={18} />
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
          Evidence & Sources
        </h3>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Info size={12} />
          Trust Layer
        </span>
      </div>

      <div className="space-y-3">
        {validSources.map((src, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-100 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {src.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {src.description}
                </p>
              </div>

              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${authorityColorMap[src.authority]}`}
              >
                {src.authority}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Confidence:{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {src.confidence}%
                </span>
              </div>

              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 hover:underline"
                >
                  View source
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}