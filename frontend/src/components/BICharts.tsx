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

  // Sector breakdown (Value in ₹ Lakhs)
  const sectorData = deals_summary.sector_breakdown.slice(0, 6).map((s) => ({
    name: s.sector,
    Pipeline: Math.round(s.open_pipeline / 100000),
    'Won Revenue': Math.round(s.won_revenue / 100000)
  }));

  // Stage breakdown
  const stageData = deals_summary.stage_breakdown.slice(0, 6).map((stg) => ({
    name: stg.stage,
    Deals: stg.count,
    Value: Math.round(stg.total_val / 100000)
  }));

  // Work Order Status breakdown
  const woStatusData = [
    { name: 'Ongoing', value: work_orders_summary.ongoing_count, color: '#0284c7' },
    { name: 'Delayed', value: work_orders_summary.delayed_count, color: '#f59e0b' },
    { name: 'Completed', value: work_orders_summary.completed_count, color: '#10b981' },
    { name: 'On Hold', value: work_orders_summary.on_hold_count, color: '#64748b' }
  ].filter((item) => item.value > 0);

  const customTooltipStyle = {
    backgroundColor: '#10121a',
    borderColor: '#282f44',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#f1f5f9'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
      {/* Chart 1: Sector Pipeline vs Won Revenue */}
      <div className="bg-[#10121a] rounded-lg p-4 border border-[#1e2333] flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Sector Pipeline vs Won Revenue
          </h3>
          <p className="text-[11px] text-slate-500">Values in ₹ Lakhs</p>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={customTooltipStyle}
                formatter={(value: any) => [`₹${value} L`, '']}
              />
              <Bar dataKey="Pipeline" fill="#0284c7" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Won Revenue" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Sales Funnel Stage Distribution */}
      <div className="bg-[#10121a] rounded-lg p-4 border border-[#1e2333] flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Sales Funnel Stage Distribution
          </h3>
          <p className="text-[11px] text-slate-500">Deal count across lifecycle stages</p>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} width={80} tickLine={false} />
              <Tooltip
                contentStyle={customTooltipStyle}
                formatter={(value: any, name: any) => [name === 'Value' ? `₹${value} L` : value, String(name || '')]}
              />
              <Bar dataKey="Deals" fill="#475569" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Work Order Operational Breakdown */}
      <div className="bg-[#10121a] rounded-lg p-4 border border-[#1e2333] flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Work Order Status Breakdown
          </h3>
          <p className="text-[11px] text-slate-500">175 total records (117 completed)</p>
        </div>
        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={woStatusData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
              >
                {woStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={customTooltipStyle}
                formatter={(value: any) => [`${value} projects`, 'Count']}
              />
              <Legend
                verticalAlign="bottom"
                height={20}
                iconSize={6}
                formatter={(value) => <span className="text-[10px] text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
