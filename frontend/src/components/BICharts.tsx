import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';
import type { BIData } from '../types';

interface BIChartsProps {
  biData: BIData | null;
}

export const BICharts: React.FC<BIChartsProps> = ({ biData }) => {
  if (!biData) return null;

  const { deals_summary, work_orders_summary } = biData;

  // Format sector breakdown for Recharts (Value in Lakhs)
  const sectorData = deals_summary.sector_breakdown.slice(0, 6).map((s) => ({
    name: s.sector,
    Pipeline: Math.round(s.open_pipeline / 100000),
    'Won Revenue': Math.round(s.won_revenue / 100000)
  }));

  // Format stage breakdown
  const stageData = deals_summary.stage_breakdown.slice(0, 6).map((stg) => ({
    name: stg.stage,
    Deals: stg.count,
    Value: Math.round(stg.total_val / 100000)
  }));

  // Work Order Status breakdown
  const woStatusData = [
    { name: 'Ongoing', value: work_orders_summary.ongoing_count, color: '#06b6d4' },
    { name: 'Delayed', value: work_orders_summary.delayed_count, color: '#f59e0b' },
    { name: 'Completed', value: work_orders_summary.completed_count, color: '#10b981' },
    { name: 'On Hold', value: work_orders_summary.on_hold_count, color: '#64748b' }
  ].filter((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Chart 1: Sector Pipeline Breakdown */}
      <div className="glass-card rounded-xl p-4 flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Sector Pipeline & Won Revenue (₹ Lakhs)
          </h3>
          <p className="text-[11px] text-slate-400">Comparing active pipeline against closed revenue</p>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(value: any) => [`₹${value} L`, '']}
              />
              <Bar dataKey="Pipeline" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Won Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Deal Stages Distribution */}
      <div className="glass-card rounded-xl p-4 flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Sales Funnel Stage Distribution
          </h3>
          <p className="text-[11px] text-slate-400">Total opportunities across deal stages</p>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={90} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(value: any, name: any) => [name === 'Value' ? `₹${value} L` : value, String(name || '')]}
              />
              <Bar dataKey="Deals" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Work Order Execution Status */}
      <div className="glass-card rounded-xl p-4 flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Work Order Execution Breakdown
          </h3>
          <p className="text-[11px] text-slate-400">Operational status of project deliverables</p>
        </div>
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={woStatusData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {woStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(value: any) => [`${value} projects`, 'Count']}
              />
              <Legend
                verticalAlign="bottom"
                height={24}
                iconSize={8}
                formatter={(value) => <span className="text-[11px] text-slate-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
