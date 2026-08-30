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
      <div className="bg-[#10121a] border border-[#1e2333] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Business Snapshot</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
              Reconciled Ground Truth
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            Commercial pipeline remains strong at <strong className="text-slate-100 font-semibold">₹68.82 Cr</strong> across 50 open deals (Win Rate: <strong className="text-slate-100">56.2%</strong>). Operations tracking reflects <strong className="text-slate-100">58 active work orders</strong> with <strong className="text-amber-400">5 execution delays</strong> requiring milestone intervention.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToAskAI("Give me a comprehensive leadership briefing on our commercial and operational health.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#141722] hover:bg-[#1a1e2d] text-sky-400 hover:text-sky-300 text-xs font-medium border border-[#1e2333] transition-colors"
          >
            <span>Executive Brief</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Executive KPI Row */}
      <KPICards biData={biData} onOpenLineage={onOpenLineage} />

      {/* Data Quality & Audit Caveats */}
      <DataQualityBadge notes={dataQualityNotes} />

      {/* What Leadership Should Know — Executive Risk Signals */}
      <section className="bg-[#10121a] rounded-lg p-5 border border-[#1e2333]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2333]">
          <div>
            <h2 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              What Leadership Should Know
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Evidence-backed operational & commercial signals derived deterministically from source records
            </p>
          </div>
          <button
            onClick={() => onNavigateToAskAI("What should leadership focus on this week?")}
            className="flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Ask AI Investigation</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {riskRadar.slice(0, 3).map((risk, idx) => (
            <div
              key={risk.id || idx}
              className={`bg-[#141722] rounded-md p-4 flex flex-col justify-between border ${
                risk.severity === 'HIGH' ? 'border-amber-700/40' : 'border-[#1e2333]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    0{idx + 1} {risk.category}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                    risk.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {risk.severity}
                  </span>
                </div>

                <h3 className="text-xs font-medium text-slate-100 mb-1.5">{risk.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{risk.impact}</p>

                <div className="space-y-1 mb-3 bg-[#090a0f] p-2.5 rounded text-[10px] text-slate-400 border border-[#1e2333]">
                  <span className="font-medium text-slate-300">Evidence:</span>
                  {risk.evidence.map((ev, i) => (
                    <p key={i} className="text-slate-400 leading-normal">• {ev}</p>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2333] text-[11px] text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium">Directive: </span>
                  <span>{risk.action}</span>
                </div>
                <button
                  onClick={() => onNavigateToAskAI(`How can we resolve the risk: ${risk.title}?`)}
                  className="text-sky-400 hover:text-sky-300 ml-2"
                >
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Analytics Charts */}
      <BICharts biData={biData} />

      {/* Pipeline Deep Dive Table & Sector Realization Matrix */}
      <PipelineDeepDive 
        biData={biData} 
        onNavigateToAskAI={onNavigateToAskAI}
      />
    </div>
  );
};
