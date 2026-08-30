import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { RiskSignal } from '../types';

interface RiskRadarProps {
  riskRadar: RiskSignal[];
  onNavigateToAskAI: (question: string) => void;
}

export const RiskRadarView: React.FC<RiskRadarProps> = ({ riskRadar, onNavigateToAskAI }) => {
  return (
    <div className="space-y-5">
      {/* Risk Radar Header */}
      <div className="bg-[#10121a] rounded-lg p-5 border border-[#1e2333] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
            Executive Risk Radar
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Deterministic risk signals derived from Deals and Work Orders tracker records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium">
            {riskRadar.filter(r => r.severity === 'HIGH').length} High Severity
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {riskRadar.filter(r => r.severity === 'MEDIUM').length} Medium Severity
          </span>
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {riskRadar.map((risk) => (
          <div
            key={risk.id}
            className={`bg-[#141722] rounded-lg p-5 border flex flex-col justify-between ${
              risk.severity === 'HIGH' ? 'border-amber-700/40' : 'border-[#1e2333]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {risk.category}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                  risk.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {risk.severity} SEVERITY
                </span>
              </div>

              <h3 className="text-sm font-medium text-slate-100 mb-2">{risk.title}</h3>
              
              <div className="mb-3">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Impact: </span>
                <span className="text-xs text-slate-300 leading-relaxed">{risk.impact}</span>
              </div>

              <div className="mb-4 bg-[#090a0f] p-3 rounded text-[11px] border border-[#1e2333] space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase">
                  Ground-Truth Evidence
                </div>
                {risk.evidence.map((ev, idx) => (
                  <p key={idx} className="text-slate-300">• {ev}</p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e2333] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Action Directive:</span>
                <p className="text-xs text-slate-200 mt-0.5">{risk.action}</p>
              </div>
              <button
                onClick={() => onNavigateToAskAI(`How can we resolve the risk: ${risk.title}?`)}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium shrink-0 ml-3 transition-colors"
                title="Investigate with AI"
              >
                <span>Investigate</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
