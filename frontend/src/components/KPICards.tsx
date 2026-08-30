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
      source: '47 rated + 3 baseline'
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onOpenLineage && onOpenLineage(card.label)}
          className={`bg-gradient-to-b from-[#1c103c] to-[#130a2a] border rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-purple-400/60 shadow-lg shadow-purple-950/20 ${
            card.highlight 
              ? 'border-amber-500/60 bg-gradient-to-b from-amber-950/30 via-[#1c103c] to-[#130a2a]' 
              : 'border-[#2d1854] hover:shadow-purple-900/30'
          }`}
          title="Click to view metric data lineage & provenance"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider text-purple-300/80 uppercase">
                {card.label}
              </span>
              {card.highlight ? (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
              ) : (
                <span className="text-[9px] font-mono text-purple-400/60 px-1 py-0.2 rounded bg-purple-950/60 border border-purple-800/40">LINEAGE</span>
              )}
            </div>

            <div className="text-xl font-bold text-white tracking-tight">
              {card.value}
            </div>

            <div className="text-[11px] text-purple-200/80 mt-1 truncate">
              {card.context}
            </div>
          </div>

          <div className="text-[10px] text-purple-400/80 pt-2.5 mt-2.5 border-t border-[#2d1854] flex items-center justify-between font-mono">
            <span className="truncate">{card.source}</span>
            <span className="text-purple-400 font-bold text-xs">→</span>
          </div>
        </div>
      ))}
    </div>
  );
};
