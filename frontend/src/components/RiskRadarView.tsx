import React from 'react';
import { ShieldAlert, AlertOctagon, Info, ArrowRight } from 'lucide-react';
import type { RiskSignal } from '../types';

interface RiskRadarProps {
  riskRadar: RiskSignal[];
  onNavigateToAskAI: (question: string) => void;
}

export const RiskRadarView: React.FC<RiskRadarProps> = ({ riskRadar, onNavigateToAskAI }) => {
  return (
    <div className="space-y-6">
      {/* Risk Radar Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Executive Risk Radar</h2>
            <p className="text-xs text-slate-400">Deterministic risk signals derived from Monday.com operational & commercial data</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
            {riskRadar.filter(r => r.severity === 'HIGH').length} High Risks
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
            {riskRadar.filter(r => r.severity === 'MEDIUM').length} Medium Risks
          </span>
        </div>
      </div>

      {/* Risk Signal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskRadar.map((risk) => (
          <div
            key={risk.id}
            className={`glass-card rounded-2xl p-5 border flex flex-col justify-between ${
              risk.severity === 'HIGH' ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  risk.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {risk.category} • {risk.severity} SEVERITY
                </span>
                {risk.severity === 'HIGH' ? <AlertOctagon className="h-5 w-5 text-rose-400" /> : <ShieldAlert className="h-5 w-5 text-amber-400" />}
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{risk.title}</h3>
              
              <div className="mb-4">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase mb-1">Business Impact:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{risk.impact}</p>
              </div>

              <div className="mb-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <h4 className="text-[11px] font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-cyan-400" /> Ground-Truth Evidence:
                </h4>
                {risk.evidence.map((ev, idx) => (
                  <p key={idx} className="text-[11px] text-slate-300">• {ev}</p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Recommended Action:</span>
                <p className="text-xs text-cyan-300 font-medium">{risk.action}</p>
              </div>
              <button
                onClick={() => onNavigateToAskAI(`How can we resolve the risk: ${risk.title}?`)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors shrink-0"
                title="Investigate with AI"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
