import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { DataTrust } from '../types';

interface DataTrustProps {
  dataTrust: DataTrust | null;
}

export const DataTrustView: React.FC<DataTrustProps> = ({ dataTrust }) => {
  if (!dataTrust) return null;

  return (
    <div className="space-y-5">
      {/* Trust Header */}
      <div className="bg-[#10121a] rounded-lg p-5 border border-[#1e2333] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#141722] text-slate-300 border border-[#1e2333]">
            <ShieldCheck className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              Data Trust Center
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Multi-dimensional evaluation of source data completeness, coverage, and linkage integrity
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded bg-[#141722] border border-[#1e2333] text-slate-200 text-xs font-medium">
          OVERALL: <span className="text-emerald-400 font-semibold">{dataTrust.overall_confidence}</span>
        </div>
      </div>

      {/* Trust Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {dataTrust.dimensions.map((dim, idx) => (
          <div key={idx} className="bg-[#141722] rounded-lg p-4 border border-[#1e2333] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-200">{dim.name}</span>
                <span className="text-xs font-mono font-bold text-slate-100">{dim.score}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">{dim.desc}</p>

              {/* Minimal Progress Bar */}
              <div className="w-full bg-[#090a0f] rounded h-1.5 overflow-hidden border border-[#1e2333] mb-2">
                <div
                  className={`h-full rounded ${
                    dim.score >= 80 ? 'bg-sky-600' : dim.score >= 50 ? 'bg-amber-600' : 'bg-rose-600'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-2 border-t border-[#1e2333]">
              <span>Coverage: {dim.score >= 80 ? 'High' : dim.score >= 50 ? 'Medium' : 'Low'}</span>
              <span>Deterministic</span>
            </div>
          </div>
        ))}
      </div>

      {/* Governance & Methodology Explanation */}
      <div className="bg-[#10121a] rounded-lg p-5 border border-[#1e2333] text-xs text-slate-300 space-y-3">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          Data Governance Methodology
        </h3>
        <p className="leading-relaxed text-slate-400 text-[11px]">
          Skylark Executive Intelligence evaluates dataset reliability using 5 deterministic dimensions computed directly from raw board records:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="p-2.5 rounded bg-[#090a0f] border border-[#1e2333]">
            <span className="font-semibold text-slate-200">Field Completeness ({dataTrust.completeness_score}%)</span>
            <p className="text-slate-400 mt-0.5">Ratio of required fields populated (Deal Name, Status, Value, Client).</p>
          </div>
          <div className="p-2.5 rounded bg-[#090a0f] border border-[#1e2333]">
            <span className="font-semibold text-slate-200">Date Coverage ({dataTrust.date_coverage_score}%)</span>
            <p className="text-slate-400 mt-0.5">Records with valid ISO timeline dates for quarterly forecasting.</p>
          </div>
          <div className="p-2.5 rounded bg-[#090a0f] border border-[#1e2333]">
            <span className="font-semibold text-slate-200">Probability Coverage ({dataTrust.probability_coverage_score}%)</span>
            <p className="text-slate-400 mt-0.5">47 rated open deals vs 3 unrated deals using 30% baseline modeling assumption.</p>
          </div>
          <div className="p-2.5 rounded bg-[#090a0f] border border-[#1e2333]">
            <span className="font-semibold text-slate-200">Sector Taxonomy ({dataTrust.sector_coverage_score}%)</span>
            <p className="text-slate-400 mt-0.5">Standardized 5-sector taxonomy applied across deals and work orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
