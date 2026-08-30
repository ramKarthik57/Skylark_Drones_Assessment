import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { RiskSignal } from '../types';

interface RiskRadarProps {
  riskRadar: RiskSignal[];
  onNavigateToAskAI: (question: string) => void;
}

export const RiskRadarView: React.FC<RiskRadarProps> = ({ riskRadar, onNavigateToAskAI }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Risk Radar Header */}
      <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-purple-950/30">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wider uppercase">
            Executive Risk Radar
          </h2>
          <p className="text-xs text-purple-300/70 mt-1">
            Deterministic risk signals derived from Deals and Work Orders tracker records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm">
            {riskRadar.filter(r => r.severity === 'HIGH').length} High Severity
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/40 font-semibold">
            {riskRadar.filter(r => r.severity === 'MEDIUM').length} Medium Severity
          </span>
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskRadar.map((risk) => (
          <div
            key={risk.id}
            className={`bg-gradient-to-b from-[#1c103c] to-[#130a2a] rounded-2xl p-6 border flex flex-col justify-between shadow-lg transition-all duration-300 hover:border-purple-500/60 ${
              risk.severity === 'HIGH' ? 'border-amber-600/50 from-amber-950/20' : 'border-[#2d1854]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                  {risk.category}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  risk.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
                }`}>
                  {risk.severity} SEVERITY
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2.5">{risk.title}</h3>
              
              <div className="mb-3.5">
                <span className="text-[10px] font-bold text-purple-300/80 uppercase">Impact: </span>
                <span className="text-xs text-purple-200/90 leading-relaxed">{risk.impact}</span>
              </div>

              <div className="mb-4 bg-[#0d061f] p-3.5 rounded-xl text-xs border border-[#2d1854] space-y-1.5">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Ground-Truth Evidence
                </div>
                {risk.evidence.map((ev, idx) => (
                  <p key={idx} className="text-purple-200/90 leading-normal">• {ev}</p>
                ))}
              </div>
            </div>

            <div className="pt-3.5 border-t border-[#2d1854] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400/80 uppercase">Action Directive:</span>
                <p className="text-xs text-slate-200 mt-0.5">{risk.action}</p>
              </div>
              <button
                onClick={() => onNavigateToAskAI(`How can we resolve the risk: ${risk.title}?`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 hover:text-white text-xs font-semibold shrink-0 ml-3 transition-colors border border-purple-800/60"
                title="Investigate with AI"
              >
                <span>Investigate</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
