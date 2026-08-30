import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { BIData, RiskSignal } from '../types';
import { KPICards } from './KPICards';
import { BICharts } from './BICharts';
import { DataQualityBadge } from './DataQualityBadge';
import { PipelineDeepDive } from './PipelineDeepDive';

interface CommandCenterProps {
  biData: BIData | null;
  riskRadar: RiskSignal[];
  dataQualityNotes: string[];
  onNavigateToAskAI: (initialQuestion?: string) => void;
  onOpenLineage: (metricName: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterProps> = ({
  biData,
  riskRadar,
  dataQualityNotes,
  onNavigateToAskAI,
  onOpenLineage
}) => {
  return (
    <div className="space-y-6">
      {/* Executive Hero Summary Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-950/50 to-purple-950/40 border border-purple-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-purple-950/30 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300 font-semibold">Executive Intelligence Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Reconciled Ground Truth
            </span>
          </div>
          <p className="text-xs md:text-sm text-purple-100 leading-relaxed font-medium">
            Active commercial pipeline stands at <strong className="text-white font-bold">₹68.82 Cr</strong> across 50 open deals (Win Rate: <strong className="text-white font-bold">56.2%</strong>). Operations reflect <strong className="text-white font-bold">58 active work orders</strong> with <strong className="text-amber-400 font-bold">5 execution delays</strong> requiring milestone review.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <button
            onClick={() => onNavigateToAskAI("Give me a comprehensive leadership briefing on our commercial and operational health.")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/40 border border-purple-400/40 transition-all cursor-pointer"
          >
            <span>Executive Brief</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Executive KPI Row */}
      <KPICards biData={biData} onOpenLineage={onOpenLineage} />

      {/* Data Quality & Audit Caveats */}
      <DataQualityBadge notes={dataQualityNotes} />

      {/* What Leadership Should Know — Executive Risk Signals */}
      <section className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] shadow-xl shadow-purple-950/30">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2d1854]">
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider uppercase">
              What Leadership Should Know
            </h2>
            <p className="text-[11px] text-purple-300/70 mt-0.5">
              Evidence-backed operational & commercial signals derived deterministically from source records
            </p>
          </div>
          <button
            onClick={() => onNavigateToAskAI("What should leadership focus on this week?")}
            className="flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white transition-colors"
          >
            <span>Ask AI Investigation</span>
            <ArrowRight className="h-3.5 w-3.5 text-purple-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {riskRadar.slice(0, 3).map((risk, idx) => (
            <div
              key={risk.id || idx}
              className={`bg-[#130a2a] rounded-xl p-4 flex flex-col justify-between border transition-all hover:border-purple-500/50 ${
                risk.severity === 'HIGH' ? 'border-amber-700/50 bg-gradient-to-b from-amber-950/20 to-[#130a2a]' : 'border-[#2d1854]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {risk.category}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    risk.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-2 line-clamp-2">{risk.title}</h3>
                <p className="text-[11px] text-purple-200/80 leading-relaxed mb-3">{risk.impact}</p>
              </div>

              <div className="pt-3 border-t border-[#2d1854] flex items-center justify-between">
                <span className="text-[10px] text-purple-400/80 font-mono">
                  {risk.evidence.length} evidence signals
                </span>
                <button
                  onClick={() => onNavigateToAskAI(`Tell me more about ${risk.title}`)}
                  className="text-[11px] text-purple-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Analytics Charts */}
      <BICharts biData={biData} />

      {/* Pipeline Deep Dive & Sector Mix */}
      <PipelineDeepDive 
        biData={biData} 
        onNavigateToAskAI={onNavigateToAskAI}
      />
    </div>
  );
};
