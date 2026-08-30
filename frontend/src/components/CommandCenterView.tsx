import React from 'react';
import { AlertOctagon, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import type { BIData, RiskSignal } from '../types';
import { KPICards } from './KPICards';
import { BICharts } from './BICharts';
import { DataQualityBadge } from './DataQualityBadge';

interface CommandCenterProps {
  biData: BIData | null;
  riskRadar: RiskSignal[];
  dataQualityNotes: string[];
  onNavigateToAskAI: (initialQuestion?: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterProps> = ({
  biData,
  riskRadar,
  dataQualityNotes,
  onNavigateToAskAI
}) => {
  return (
    <div className="space-y-6">
      {/* Executive KPI Strip */}
      <KPICards biData={biData} />

      {/* Data Quality Warning Notes */}
      <DataQualityBadge notes={dataQualityNotes} />

      {/* What Leadership Should Know — Signal Cards */}
      <section className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">What Leadership Should Know</h2>
              <p className="text-xs text-slate-400">Evidence-backed operational & commercial signals generated from live data</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToAskAI("What should leadership focus on this week?")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium transition-colors"
          >
            <span>Ask AI Deep Dive</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskRadar.slice(0, 3).map((risk, idx) => (
            <div
              key={risk.id || idx}
              className={`glass-card rounded-xl p-4 flex flex-col justify-between border ${
                risk.severity === 'HIGH' ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    risk.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    0{idx + 1} {risk.category}
                  </span>
                  {risk.severity === 'HIGH' ? (
                    <AlertOctagon className="h-4 w-4 text-rose-400" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                  )}
                </div>

                <h3 className="text-xs font-bold text-white mb-1.5">{risk.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{risk.impact}</p>

                <div className="space-y-1 mb-3 bg-slate-900/60 p-2.5 rounded-lg text-[10px] text-slate-400 border border-slate-800">
                  <span className="font-semibold text-slate-300 uppercase">Evidence:</span>
                  {risk.evidence.map((ev, i) => (
                    <p key={i}>• {ev}</p>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 flex items-center justify-between">
                <span className="font-medium truncate">{risk.action}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Analytics Charts */}
      <BICharts biData={biData} />
    </div>
  );
};
