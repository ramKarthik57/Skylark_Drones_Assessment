import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { DataTrust } from '../types';

interface DataTrustProps {
  dataTrust: DataTrust | null;
}

export const DataTrustView: React.FC<DataTrustProps> = ({ dataTrust }) => {
  if (!dataTrust) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Trust Header */}
      <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-purple-950/30">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-700/50 shadow-inner">
            <ShieldCheck className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">
              Data Trust & Governance Center
            </h2>
            <p className="text-xs text-purple-300/70 mt-0.5">
              Multi-dimensional evaluation of source data completeness, coverage, and linkage integrity
            </p>
          </div>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-purple-950/90 border border-purple-700/60 text-purple-200 text-xs font-semibold">
          OVERALL CONFIDENCE: <span className="text-emerald-400 font-bold ml-1">{dataTrust.overall_confidence}</span>
        </div>
      </div>

      {/* Trust Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataTrust.dimensions.map((dim, idx) => (
          <div key={idx} className="bg-gradient-to-b from-[#1c103c] to-[#130a2a] rounded-2xl p-5 border border-[#2d1854] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{dim.name}</span>
                <span className="text-xs font-mono font-bold text-purple-300">{dim.score}%</span>
              </div>
              <p className="text-xs text-purple-200/70 mb-4 leading-relaxed">{dim.desc}</p>

              {/* Glowing Progress Bar */}
              <div className="w-full bg-[#0d061f] rounded-full h-2 overflow-hidden border border-[#2d1854] mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dim.score >= 80 ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm shadow-purple-500' : dim.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-red-500'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-purple-400/80 font-mono flex items-center justify-between pt-2.5 border-t border-[#2d1854]">
              <span>Coverage: {dim.score >= 80 ? 'High' : dim.score >= 50 ? 'Medium' : 'Low'}</span>
              <span>Deterministic</span>
            </div>
          </div>
        ))}
      </div>

      {/* Governance & Methodology Explanation */}
      <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] text-xs text-purple-200 space-y-4 shadow-xl shadow-purple-950/30">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Data Governance Methodology
        </h3>
        <p className="leading-relaxed text-purple-300/80 text-xs">
          Skylark Executive Intelligence evaluates dataset reliability using 5 deterministic dimensions computed directly from raw board records:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#130a2a] border border-[#2d1854]">
            <span className="font-bold text-white">Field Completeness ({dataTrust.completeness_score}%)</span>
            <p className="text-purple-300/70 mt-1">Ratio of required fields populated (Deal Name, Status, Value, Client).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#130a2a] border border-[#2d1854]">
            <span className="font-bold text-white">Date Coverage ({dataTrust.date_coverage_score}%)</span>
            <p className="text-purple-300/70 mt-1">Records with valid ISO timeline dates for quarterly forecasting.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#130a2a] border border-[#2d1854]">
            <span className="font-bold text-white">Probability Coverage ({dataTrust.probability_coverage_score}%)</span>
            <p className="text-purple-300/70 mt-1">47 rated open deals vs 3 unrated deals using 30% baseline modeling assumption.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#130a2a] border border-[#2d1854]">
            <span className="font-bold text-white">Sector Taxonomy ({dataTrust.sector_coverage_score}%)</span>
            <p className="text-purple-300/70 mt-1">Standardized 5-sector taxonomy applied across deals and work orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
