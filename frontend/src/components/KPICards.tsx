import React from 'react';
import { DollarSign, TrendingUp, AlertOctagon, CheckCircle2, PieChart, Briefcase } from 'lucide-react';
import type { BIData } from '../types';

interface KPICardsProps {
  biData: BIData | null;
}

export const KPICards: React.FC<KPICardsProps> = ({ biData }) => {
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
      title: 'Active Sales Pipeline',
      value: formatINR(deals_summary.open_pipeline_value),
      subtitle: `${deals_summary.open_deal_count} active opportunities`,
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Deals Board'
    },
    {
      title: 'Weighted Pipeline',
      value: formatINR(deals_summary.weighted_pipeline_value),
      subtitle: 'Adjusted by win probability',
      icon: TrendingUp,
      color: 'from-cyan-500 to-emerald-500',
      badge: 'Forecast'
    },
    {
      title: 'Closed Win Rate',
      value: `${deals_summary.win_rate}%`,
      subtitle: `${deals_summary.won_deal_count} Won / ${deals_summary.dead_deal_count} Dead`,
      icon: PieChart,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Conversion'
    },
    {
      title: 'Active Work Orders',
      value: `${work_orders_summary.active_wo_count}`,
      subtitle: `${work_orders_summary.ongoing_count} Ongoing projects`,
      icon: Briefcase,
      color: 'from-purple-500 to-indigo-500',
      badge: 'Execution'
    },
    {
      title: 'Delayed Work Orders',
      value: `${work_orders_summary.delayed_count}`,
      subtitle: 'Execution bottlenecks flagged',
      icon: AlertOctagon,
      color: 'from-amber-500 to-rose-500',
      badge: 'Action Needed',
      warning: work_orders_summary.delayed_count > 0
    },
    {
      title: 'Total Billed Value',
      value: formatINR(work_orders_summary.total_billed_value),
      subtitle: `${work_orders_summary.billing_completion_rate}% contract billed`,
      icon: CheckCircle2,
      color: 'from-teal-500 to-cyan-500',
      badge: 'Finance'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden ${
              card.warning ? 'border-amber-500/40 bg-amber-950/20' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-sm`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div>
              <div className="text-lg font-bold text-white tracking-tight leading-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
