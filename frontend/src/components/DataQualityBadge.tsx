import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface DataQualityBadgeProps {
  notes: string[];
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({ notes }) => {
  const [expanded, setExpanded] = useState(false);

  if (!notes || notes.length === 0) return null;

  return (
    <div className="rounded-xl bg-amber-50/50 border border-amber-200 p-3 text-xs text-amber-900 shadow-xs mb-6">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-[#d97706] shrink-0" />
          <span className="text-xs font-semibold text-amber-900">Data Quality & Dataset Caveats ({notes.length} issues flagged)</span>
        </div>
        <button className="text-amber-700 hover:text-amber-900 cursor-pointer">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <ul className="mt-2.5 space-y-1.5 pl-5 list-disc border-t border-amber-200/60 pt-2.5 text-xs text-amber-800 font-mono">
          {notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
