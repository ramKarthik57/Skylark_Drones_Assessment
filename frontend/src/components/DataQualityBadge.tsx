import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface DataQualityBadgeProps {
  notes: string[];
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({ notes }) => {
  const [expanded, setExpanded] = useState(false);

  if (!notes || notes.length === 0) return null;

  return (
    <div className="mb-4 rounded-xl bg-amber-950/20 border border-amber-500/30 p-3 text-xs text-amber-200">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Data Quality & Audit Caveats ({notes.length} issues flagged)</span>
        </div>
        <button className="text-amber-400 hover:text-amber-300">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <ul className="mt-2.5 space-y-1.5 pl-6 list-disc border-t border-amber-500/20 pt-2 text-[11px] text-amber-300/90">
          {notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
