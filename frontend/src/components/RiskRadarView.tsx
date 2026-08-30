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
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#191919] tracking-wider uppercase font-mono">
            Executive Risk Radar
          </h2>
          <p className="text-xs text-[#737373] mt-1">
            Deterministic risk signals derived from Deals and Work Orders tracker records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs px-3 py-1 rounded bg-amber-50 text-[#d97706] border border-amber-200 font-semibold font-mono">
            {riskRadar.filter(r => r.severity === 'HIGH').length} High Severity
          </span>
          <span className="text-xs px-3 py-1 rounded bg-[#f4f2eb] text-[#595959] border border-[#dcd7cb] font-semibold font-mono">
            {riskRadar.filter(r => r.severity === 'MEDIUM').length} Medium Severity
          </span>
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskRadar.map((risk) => (
          <div
            key={risk.id}
            className={`bg-[#ffffff] rounded-2xl p-6 border flex flex-col justify-between shadow-xs transition-all ${
              risk.severity === 'HIGH' ? 'border-amber-300' : 'border-[#e5e2d8]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider font-semibold">
                  {risk.category}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                  risk.severity === 'HIGH' ? 'bg-amber-100 text-[#d97706] border border-amber-300' : 'bg-[#f4f2eb] text-[#595959] border border-[#dcd7cb]'
                }`}>
                  {risk.severity} SEVERITY
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#191919] mb-2.5">{risk.title}</h3>
              
              <div className="mb-3.5">
                <span className="text-[10px] font-bold text-[#737373] uppercase font-mono">Impact: </span>
                <span className="text-xs text-[#404040] leading-relaxed">{risk.impact}</span>
              </div>

              <div className="mb-4 bg-[#f4f2eb] p-4 rounded-xl text-xs border border-[#e5e2d8] space-y-1.5 font-mono">
                <div className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">
                  Ground-Truth Evidence
                </div>
                {risk.evidence.map((ev, idx) => (
                  <p key={idx} className="text-[#595959] leading-normal">• {ev}</p>
                ))}
              </div>
            </div>

            <div className="pt-3.5 border-t border-[#e5e2d8] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#737373] uppercase font-mono">Action Directive:</span>
                <p className="text-xs text-[#191919] mt-0.5 font-medium">{risk.action}</p>
              </div>
              <button
                onClick={() => onNavigateToAskAI(`How can we resolve the risk: ${risk.title}?`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007a5a] hover:bg-[#006046] text-white text-xs font-semibold shrink-0 ml-3 transition-colors cursor-pointer"
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
