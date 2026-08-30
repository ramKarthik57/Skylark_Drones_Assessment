import React from 'react';
import { X } from 'lucide-react';

interface MetricLineageInfo {
  metricName: string;
  sourceDataset: string;
  filterApplied: string;
  recordsConsidered: string;
  formula: string;
  resultValue: string;
  qualityCaveat: string;
}

interface DataLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: MetricLineageInfo | null;
}

export const DataLineageModal: React.FC<DataLineageModalProps> = ({ isOpen, onClose, info }) => {
  if (!isOpen || !info) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e5e2d8] rounded-2xl w-full max-w-md p-6 text-[#191919] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#737373] hover:text-[#191919] hover:bg-[#f4f2eb] rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <h2 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
            Metric Lineage & Provenance
          </h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Audit trail for <strong className="text-[#191919] font-semibold">{info.metricName}</strong>
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="bg-[#f4f2eb] p-3 rounded-lg border border-[#e5e2d8]">
            <div className="text-[#737373] text-[10px] uppercase font-mono font-bold">Source Dataset</div>
            <div className="text-[#191919] font-mono text-[11px] mt-0.5">{info.sourceDataset}</div>
          </div>

          <div className="bg-[#f4f2eb] p-3 rounded-lg border border-[#e5e2d8]">
            <div className="text-[#737373] text-[10px] uppercase font-mono font-bold">Filter & Records</div>
            <div className="text-[#191919] text-[11px] mt-0.5">{info.filterApplied} ({info.recordsConsidered})</div>
          </div>

          <div className="bg-[#f4f2eb] p-3 rounded-lg border border-[#e5e2d8]">
            <div className="text-[#737373] text-[10px] uppercase font-mono font-bold">Formula</div>
            <div className="text-[#007a5a] font-mono text-[11px] mt-0.5 font-semibold">{info.formula}</div>
          </div>

          <div className="bg-[#f4f2eb] p-3 rounded-lg border border-[#e5e2d8]">
            <div className="text-[#737373] text-[10px] uppercase font-mono font-bold">Result & Caveats</div>
            <div className="text-[#191919] font-bold text-xs mt-0.5">{info.resultValue}</div>
            <p className="text-[11px] text-amber-800 font-mono mt-1 pt-1 border-t border-[#e5e2d8]">{info.qualityCaveat}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
