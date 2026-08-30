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
          className={`bg-[#ffffff] border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all hover:border-[#007a5a] shadow-xs ${
            card.highlight 
              ? 'border-amber-300 bg-amber-50/30' 
              : 'border-[#e5e2d8]'
          }`}
          title="Click to view metric data lineage & provenance"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#737373] font-semibold">
                {card.label}
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${card.highlight ? 'bg-amber-500' : 'bg-[#007a5a]'}`} />
            </div>

            <div className="text-xl font-bold text-[#191919] tracking-tight font-sans">
              {card.value}
            </div>

            <div className="text-[11px] text-[#595959] mt-1 font-medium leading-tight line-clamp-1">
              {card.context}
            </div>
          </div>

          <div className="pt-2.5 mt-2 border-t border-[#f4f2eb] flex items-center justify-between text-[10px] text-[#737373] font-mono">
            <span className="truncate">{card.source}</span>
            <span className="text-[#007a5a] font-sans font-semibold">Lineage →</span>
          </div>
        </div>
      ))}
    </div>
  );
};
