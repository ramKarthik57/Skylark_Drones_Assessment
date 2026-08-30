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
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#10121a] border border-[#1e2333] rounded-lg w-full max-w-md p-5 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-100 uppercase tracking-wider">
            Metric Lineage & Provenance
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Audit trail for <strong className="text-slate-300 font-medium">{info.metricName}</strong>
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="bg-[#090a0f] p-2.5 rounded border border-[#1e2333]">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Source Dataset</div>
            <div className="text-slate-200 font-mono text-[11px] mt-0.5">{info.sourceDataset}</div>
          </div>

          <div className="bg-[#090a0f] p-2.5 rounded border border-[#1e2333]">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Filter & Records</div>
            <div className="text-slate-200 text-[11px] mt-0.5">{info.filterApplied} ({info.recordsConsidered})</div>
          </div>

          <div className="bg-[#090a0f] p-2.5 rounded border border-[#1e2333]">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Formula</div>
            <div className="text-sky-300 font-mono text-[11px] mt-0.5">{info.formula}</div>
          </div>

          <div className="bg-[#090a0f] p-2.5 rounded border border-[#1e2333]">
            <div className="text-slate-500 text-[10px] uppercase font-semibold">Result & Caveats</div>
            <div className="text-slate-100 font-bold text-xs mt-0.5">{info.resultValue}</div>
            <div className="text-slate-400 text-[10px] mt-1">{info.qualityCaveat}</div>
          </div>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#141722] hover:bg-[#1a1e2d] text-xs font-medium text-slate-300 border border-[#1e2333] rounded transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
