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
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-[#007a5a] border border-emerald-200">
            <ShieldCheck className="h-6 w-6 text-[#007a5a]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#191919] tracking-wider uppercase font-mono">
              Data Trust & Governance Center
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Multi-dimensional evaluation of source data completeness, coverage, and linkage integrity
            </p>
          </div>
        </div>

        <div className="px-4 py-1.5 rounded-lg bg-[#f4f2eb] border border-[#dcd7cb] text-[#191919] text-xs font-semibold font-mono">
          OVERALL CONFIDENCE: <span className="text-[#007a5a] font-bold ml-1">{dataTrust.overall_confidence}</span>
        </div>
      </div>

      {/* Trust Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataTrust.dimensions.map((dim, idx) => (
          <div key={idx} className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5e2d8] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#191919]">{dim.name}</span>
                <span className="text-xs font-mono font-bold text-[#007a5a]">{dim.score}%</span>
              </div>
              <p className="text-xs text-[#595959] mb-4 leading-relaxed">{dim.desc}</p>

              {/* Progress Bar */}
              <div className="w-full bg-[#f4f2eb] rounded-full h-2 overflow-hidden border border-[#e5e2d8] mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    dim.score >= 80 ? 'bg-[#007a5a]' : dim.score >= 50 ? 'bg-[#d97706]' : 'bg-rose-500'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-[#737373] font-mono flex items-center justify-between pt-2.5 border-t border-[#f4f2eb]">
              <span>Coverage: {dim.score >= 80 ? 'High' : dim.score >= 50 ? 'Medium' : 'Low'}</span>
              <span>Deterministic</span>
            </div>
          </div>
        ))}
      </div>

      {/* Governance & Methodology Explanation */}
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] text-xs text-[#404040] space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
          Data Governance Methodology
        </h3>
        <p className="leading-relaxed text-[#595959] text-xs">
          Skylark Executive Intelligence evaluates dataset reliability using 5 deterministic dimensions computed directly from raw board records:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#f4f2eb] border border-[#e5e2d8]">
            <span className="font-bold text-[#191919]">Field Completeness ({dataTrust.completeness_score}%)</span>
            <p className="text-[#595959] mt-1">Ratio of required fields populated (Deal Name, Status, Value, Client).</p>
          </div>
          <div className="p-4 rounded-xl bg-[#f4f2eb] border border-[#e5e2d8]">
            <span className="font-bold text-[#191919]">Date Coverage ({dataTrust.date_coverage_score}%)</span>
            <p className="text-[#595959] mt-1">Records with valid ISO timeline dates for quarterly forecasting.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#f4f2eb] border border-[#e5e2d8]">
            <span className="font-bold text-[#191919]">Probability Coverage ({dataTrust.probability_coverage_score}%)</span>
            <p className="text-[#595959] mt-1">47 rated open deals vs 3 unrated deals using 30% baseline modeling assumption.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#f4f2eb] border border-[#e5e2d8]">
            <span className="font-bold text-[#191919]">Sector Taxonomy ({dataTrust.sector_coverage_score}%)</span>
            <p className="text-[#595959] mt-1">Standardized 5-sector taxonomy applied across deals and work orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
