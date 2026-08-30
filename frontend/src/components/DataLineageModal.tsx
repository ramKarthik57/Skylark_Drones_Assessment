import React from 'react';
import { X, Database, Filter, Calculator, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-400 mb-1">
          <Database className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-100">Metric Data Lineage & Provenance</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          100% deterministic calculation audit trail for <strong className="text-slate-200">{info.metricName}</strong>.
        </p>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <Database className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <div className="text-slate-400 font-semibold">Source Dataset</div>
              <div className="text-slate-200 font-mono mt-0.5">{info.sourceDataset}</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <Filter className="w-4 h-4 text-purple-400 mt-0.5" />
            <div>
              <div className="text-slate-400 font-semibold">Applied Filter & Records</div>
              <div className="text-slate-200 mt-0.5">{info.filterApplied} ({info.recordsConsidered})</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <Calculator className="w-4 h-4 text-emerald-400 mt-0.5" />
            <div>
              <div className="text-slate-400 font-semibold">Formula</div>
              <div className="text-emerald-300 font-mono mt-0.5">{info.formula}</div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5" />
            <div>
              <div className="text-slate-400 font-semibold">Result Value & Caveats</div>
              <div className="text-slate-100 font-bold text-sm mt-0.5">{info.resultValue}</div>
              <div className="text-slate-400 text-[11px] mt-1">{info.qualityCaveat}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
          >
            Close Provenance Audit
          </button>
        </div>
      </div>
    </div>
  );
};
