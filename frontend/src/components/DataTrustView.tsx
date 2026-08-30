import React from 'react';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import type { DataTrust } from '../types';

interface DataTrustProps {
  dataTrust: DataTrust | null;
}

export const DataTrustView: React.FC<DataTrustProps> = ({ dataTrust }) => {
  if (!dataTrust) return null;

  return (
    <div className="space-y-6">
      {/* Trust Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Data Trust Center</h2>
            <p className="text-xs text-slate-400">Can leadership trust these metrics? Multi-dimensional dataset evaluation score</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>{dataTrust.overall_confidence}</span>
          </div>
        </div>
      </div>

      {/* Trust Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataTrust.dimensions.map((dim, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">{dim.name}</span>
                <span className="text-sm font-extrabold text-cyan-400">{dim.score}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">{dim.desc}</p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mb-2">
                <div
                  className={`h-full rounded-full ${
                    dim.score >= 80 ? 'bg-cyan-500' : dim.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span>Rating: {dim.score >= 80 ? 'High' : dim.score >= 50 ? 'Medium' : 'Low'}</span>
              <span>Monday.com Real-Time Calculation</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transparency Methodology Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-xs text-slate-300 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400" /> Deterministic Trust Methodology
        </h3>
        <p className="leading-relaxed text-slate-400">
          Unlike generic black-box "AI confidence scores", Skylark Executive Intelligence evaluates data trust using 5 mathematical dataset dimensions directly calculated from Monday.com records:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong>Field Completeness ({dataTrust.completeness_score}%)</strong>: Ratio of fully populated required fields (Deal Name, Status, Value, Client Code).</li>
          <li><strong>Date Normalized Coverage ({dataTrust.date_coverage_score}%)</strong>: Percentage of records with valid ISO timeline dates for quarterly forecasting.</li>
          <li><strong>Probability Forecast Coverage ({dataTrust.probability_coverage_score}%)</strong>: Open deals with explicit win probability ratings vs unrated deals using baseline 30%.</li>
          <li><strong>Sector Taxonomy Mapping ({dataTrust.sector_coverage_score}%)</strong>: Percentage of deals/work orders classified into primary industry sectors.</li>
          <li><strong>Cross-Board Linkage Confidence ({dataTrust.cross_board_match_score}%)</strong>: Percentage of work order deal names matched 1:1 with Deals board entries (52/58 matched).</li>
        </ul>
      </div>
    </div>
  );
};
