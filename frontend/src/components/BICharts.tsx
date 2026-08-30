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
  CartesianGrid
} from 'recharts';
import type { BIData } from '../types';

interface BIChartsProps {
  biData: BIData | null;
  onOpenLineage?: (metricName: string) => void;
}

export const BICharts: React.FC<BIChartsProps> = ({ biData }) => {
  if (!biData) return null;

  const { deals_summary, work_orders_summary } = biData;

  // Sector breakdown (Value in ₹ Lakhs)
  const sectorData = (deals_summary.sector_breakdown || [])
    .filter(s => s.sector && s.sector !== 'Sector/Service' && (s.open_pipeline > 0 || s.won_revenue > 0))
    .slice(0, 6)
    .map((s) => ({
      name: s.sector,
      Pipeline: Math.round(s.open_pipeline / 100000),
      'Won Revenue': Math.round(s.won_revenue / 100000)
    }));

  // Work Order Status breakdown
  const woStatusData = [
    { name: 'Completed', value: work_orders_summary.completed_count, color: '#007a5a' },
    { name: 'Ongoing', value: work_orders_summary.ongoing_count, color: '#191919' },
    { name: 'Delayed', value: work_orders_summary.delayed_count, color: '#d97706' },
    { name: 'On Hold', value: work_orders_summary.on_hold_count, color: '#8c8577' }
  ].filter((item) => item.value > 0);

  const customTooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#dcd7cb',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#191919',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  return (
    <div className="space-y-6">
      {/* Chart 1: Sector Pipeline vs Won Revenue */}
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] flex flex-col justify-between shadow-xs">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
            Sector Pipeline vs Won Revenue
          </h3>
          <p className="text-xs text-[#737373]">Values in ₹ Lakhs across top commercial sectors</p>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f4f2eb" vertical={false} />
              <XAxis dataKey="name" stroke="#8c8577" fontSize={11} interval={0} angle={-20} textAnchor="end" />
              <YAxis stroke="#8c8577" fontSize={11} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(val: any) => [`₹${val} L`, '']} />
              <Bar dataKey="Pipeline" fill="#007a5a" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Won Revenue" fill="#191919" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Work Order Execution Status */}
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] flex flex-col justify-between shadow-xs">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
            Work Order Status Distribution
          </h3>
          <p className="text-xs text-[#737373]">Total active & completed project execution count (175 total)</p>
        </div>
        <div className="h-48 w-full flex items-center justify-between">
          <div className="space-y-2 text-xs text-[#404040]">
            {woStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-[#191919]">{item.name}:</span>
                <span className="font-mono font-bold">{item.value} projects</span>
              </div>
            ))}
          </div>
          <div className="h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={woStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                  {woStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
