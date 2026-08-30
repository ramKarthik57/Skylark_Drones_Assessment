import React from 'react';
import type { BIData } from '../types';

interface KPICardsProps {
  biData: BIData | null;
  onOpenLineage?: (metricName: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ biData, onOpenLineage }) => {
  if (!biData) return null;

  const { deals_summary, work_orders_summary } = biData;

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const cards = [
    {
      id: 'active_pipeline',
      label: 'ACTIVE PIPELINE',
      value: formatINR(deals_summary.open_pipeline_value),
      context: `${deals_summary.open_deal_count} open opportunities`,
      source: 'Deals Board (50 Open)'
    },
    {
      id: 'weighted_forecast',
      label: 'WEIGHTED FORECAST',
      value: formatINR(deals_summary.weighted_pipeline_value),
      context: 'Risk-adjusted by win probability',
      source: '12 rated + 38 baseline'
    },
    {
      id: 'win_rate',
      label: 'WIN RATE',
      value: `${deals_summary.win_rate}%`,
      context: `${deals_summary.won_deal_count} Won / ${deals_summary.dead_deal_count} Dead`,
      source: '290 decided deals'
    },
    {
      id: 'active_wos',
      label: 'ACTIVE WORK ORDERS',
      value: `${work_orders_summary.active_wo_count}`,
      context: `${work_orders_summary.ongoing_count} ongoing projects`,
      source: '175 Total Work Orders'
    },
    {
      id: 'delayed_wos',
      label: 'DELAYED PROJECTS',
      value: `${work_orders_summary.delayed_count}`,
      context: 'Execution delayed in tracker',
      source: 'Operations Tracker',
      highlight: work_orders_summary.delayed_count > 0
    },
    {
      id: 'receivables',
      label: 'RECEIVABLES',
      value: formatINR(work_orders_summary.total_receivable_value),
      context: `Billed: ${formatINR(work_orders_summary.total_billed_value)}`,
      source: 'Work Orders Tracker'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onOpenLineage && onOpenLineage(card.label)}
          className={`bg-[#141722] border rounded-md p-3 flex flex-col justify-between cursor-pointer transition-all hover:border-sky-700/60 ${
            card.highlight 
              ? 'border-amber-700/50 bg-[#191820]' 
              : 'border-[#1e2333] hover:border-[#282f44]'
          }`}
          title="Click to view metric data lineage & provenance"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium tracking-wider text-slate-400">
                {card.label}
              </span>
              {card.highlight ? (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              ) : (
                <span className="text-[9px] font-mono text-slate-600">LINEAGE</span>
              )}
            </div>

            <div className="text-lg font-semibold text-slate-100 tracking-tight">
              {card.value}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {card.context}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 mt-2 border-t border-[#1e2333] flex items-center justify-between">
            <span className="truncate">{card.source}</span>
            <span className="text-sky-500/70 text-[10px]">→</span>
          </div>
        </div>
      ))}
    </div>
  );
};
