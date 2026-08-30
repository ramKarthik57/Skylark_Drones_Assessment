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
      <div className="bg-[#ffffff] border border-[#e5e2d8] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373] font-semibold">Executive Intelligence Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-[#007a5a] border border-emerald-200 font-medium">
              Reconciled Ground Truth
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#404040] leading-relaxed">
            Active commercial pipeline stands at <strong className="text-[#191919] font-bold">₹68.82 Cr</strong> across 50 open deals (Win Rate: <strong className="text-[#191919] font-bold">56.2%</strong>). Operations reflect <strong className="text-[#191919] font-bold">58 active work orders</strong> with <strong className="text-[#d97706] font-bold">5 execution delays</strong> requiring milestone review.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToAskAI("Give me a comprehensive leadership briefing on our commercial and operational health.")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#007a5a] hover:bg-[#006046] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
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
      <section className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e5e2d8]">
          <div>
            <h2 className="text-xs font-bold text-[#191919] tracking-wider uppercase font-mono">
              What Leadership Should Know
            </h2>
            <p className="text-[11px] text-[#737373] mt-0.5">
              Evidence-backed operational & commercial signals derived deterministically from source records
            </p>
          </div>
          <button
            onClick={() => onNavigateToAskAI("What should leadership focus on this week?")}
            className="flex items-center gap-1.5 text-xs font-medium text-[#007a5a] hover:text-[#006046] transition-colors cursor-pointer"
          >
            <span>Ask AI Investigation</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#007a5a]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskRadar.slice(0, 3).map((risk, idx) => (
            <div
              key={risk.id || idx}
              className={`bg-[#f4f2eb] rounded-xl p-4 flex flex-col justify-between border transition-all hover:border-[#007a5a]/50 ${
                risk.severity === 'HIGH' ? 'border-amber-300 bg-amber-50/40' : 'border-[#e5e2d8]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider font-semibold">
                    {risk.category}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    risk.severity === 'HIGH' ? 'bg-amber-100 text-[#d97706] border border-amber-300' : 'bg-[#e5e2d8] text-[#595959]'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#191919] mb-2 line-clamp-2">{risk.title}</h3>
                <p className="text-[11px] text-[#595959] leading-relaxed mb-3">{risk.impact}</p>
              </div>

              <div className="pt-3 border-t border-[#e5e2d8] flex items-center justify-between">
                <span className="text-[10px] text-[#737373] font-mono">
                  {risk.evidence.length} evidence signals
                </span>
                <button
                  onClick={() => onNavigateToAskAI(`Tell me more about ${risk.title}`)}
                  className="text-[11px] text-[#007a5a] hover:text-[#006046] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Visualizations & Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BICharts biData={biData} onOpenLineage={onOpenLineage} />
        <PipelineDeepDive biData={biData} onNavigateToAskAI={onNavigateToAskAI} onOpenLineage={onOpenLineage} />
      </div>
    </div>
  );
};
