import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface DataQualityBadgeProps {
  notes: string[];
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({ notes }) => {
  const [expanded, setExpanded] = useState(false);

  if (!notes || notes.length === 0) return null;

  return (
    <div className="rounded bg-[#191820] border border-amber-800/40 p-2.5 text-xs text-amber-200">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px]">Data Quality & Audit Caveats ({notes.length} issues flagged)</span>
        </div>
        <button className="text-amber-400 hover:text-amber-300">
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <ul className="mt-2 space-y-1 pl-5 list-disc border-t border-amber-900/40 pt-2 text-[11px] text-amber-300/80">
          {notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
