import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { BIData } from '../types';

interface PipelineDeepDiveProps {
  biData: BIData | null;
  onNavigateToAskAI: (query: string) => void;
}

export const PipelineDeepDive: React.FC<PipelineDeepDiveProps> = ({
  biData,
  onNavigateToAskAI
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'deal_value' | 'deal_name'>('deal_value');
  const [sortAsc, setSortAsc] = useState(false);

  if (!biData) return null;

  const { deals_summary, work_orders_summary } = biData;
  const topDeals = deals_summary.top_opportunities || [];

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  // Top 5 Concentration Calculation
  const top5Total = topDeals.slice(0, 5).reduce((acc, d) => acc + (d.deal_value || 0), 0);
  const totalPipeline = deals_summary.open_pipeline_value || 1;
  const top5Concentration = Math.round((top5Total / totalPipeline) * 100);

  // Top 2 Sectors Concentration
  const sectors = deals_summary.sector_breakdown || [];
  const top2SectorsVal = sectors.slice(0, 2).reduce((acc, s) => acc + s.open_pipeline, 0);
  const top2SectorsPct = Math.round((top2SectorsVal / totalPipeline) * 100);

  // Filtered Top Deals
  const filteredDeals = topDeals.filter(d => {
    const matchesSearch = d.deal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.client_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || d.sector.toLowerCase() === sectorFilter.toLowerCase();
    return matchesSearch && matchesSector;
  }).sort((a, b) => {
    if (sortField === 'deal_value') {
      return sortAsc ? a.deal_value - b.deal_value : b.deal_value - a.deal_value;
    } else {
      return sortAsc ? a.deal_name.localeCompare(b.deal_name) : b.deal_name.localeCompare(a.deal_name);
    }
  });

  return (
    <div className="space-y-5">
      {/* Pipeline Concentration Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Top 5 Concentration Card */}
        <div className="bg-[#10121a] rounded-lg p-4 border border-[#1e2333]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-slate-400">Opportunity Concentration</span>
            <span className="text-xs font-mono font-bold text-amber-400">{top5Concentration}%</span>
          </div>
          <div className="text-base font-semibold text-slate-100 mb-1">
            Top 5 Deals ({formatINR(top5Total)})
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Top 5 active opportunities represent {top5Concentration}% of the ₹68.82 Cr total pipeline.
          </p>
          <div className="w-full bg-[#090a0f] rounded h-1.5 overflow-hidden border border-[#1e2333]">
            <div className="h-full bg-amber-500 rounded" style={{ width: `${top5Concentration}%` }} />
          </div>
        </div>

        {/* Sector Concentration Card */}
        <div className="bg-[#10121a] rounded-lg p-4 border border-[#1e2333]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-slate-400">Sector Concentration</span>
            <span className="text-xs font-mono font-bold text-sky-400">{top2SectorsPct}%</span>
          </div>
          <div className="text-base font-semibold text-slate-100 mb-1">
            Mining + Renewables
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Top 2 sectors hold {formatINR(top2SectorsVal)} ({top2SectorsPct}% of active pipeline).
          </p>
          <div className="w-full bg-[#090a0f] rounded h-1.5 overflow-hidden border border-[#1e2333]">
            <div className="h-full bg-sky-500 rounded" style={{ width: `${top2SectorsPct}%` }} />
          </div>
        </div>

        {/* Cross-Board Linkage Realization */}
        <div className="bg-[#10121a] rounded-lg p-4 border border-[#1e2333]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-slate-400">Operations Linkage</span>
            <span className="text-xs font-mono font-bold text-emerald-400">89.7%</span>
          </div>
          <div className="text-base font-semibold text-slate-100 mb-1">
            52 / 58 Work Orders Matched
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Active work orders correspond to CRM deals with high commercial traceability.
          </p>
          <div className="w-full bg-[#090a0f] rounded h-1.5 overflow-hidden border border-[#1e2333]">
            <div className="h-full bg-emerald-500 rounded" style={{ width: '89.7%' }} />
          </div>
        </div>
      </div>

      {/* Top Opportunities Enterprise Table */}
      <div className="bg-[#10121a] rounded-lg border border-[#1e2333] overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-4 border-b border-[#1e2333] bg-[#141722] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Top Active Opportunities Registry
            </h3>
            <p className="text-[11px] text-slate-500">
              Sorted by nominal deal value with closure probability and forecast contribution
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex items-center gap-1.5 bg-[#090a0f] border border-[#1e2333] rounded px-2.5 py-1 text-xs">
              <Search className="h-3 w-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search deal, client, sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-[11px] w-36 md:w-48"
              />
            </div>

            {/* Sector Dropdown */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-[#090a0f] border border-[#1e2333] rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Sectors</option>
              <option value="Mining">Mining</option>
              <option value="Renewables">Renewables</option>
              <option value="Railways">Railways</option>
              <option value="Powerline">Powerline</option>
              <option value="Construction">Construction</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090a0f] text-slate-400 uppercase text-[10px] font-mono border-b border-[#1e2333]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Opportunity Name</th>
                <th className="py-2.5 px-4 font-semibold">Client Code</th>
                <th className="py-2.5 px-4 font-semibold">Sector</th>
                <th 
                  className="py-2.5 px-4 font-semibold text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortField === 'deal_value') setSortAsc(!sortAsc);
                    else { setSortField('deal_value'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Deal Value</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-2.5 px-4 font-semibold text-center">Probability</th>
                <th className="py-2.5 px-4 font-semibold text-right">Weighted Forecast</th>
                <th className="py-2.5 px-4 font-semibold text-center">Close Date</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2333] text-[11px]">
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No active opportunities match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((deal, idx) => {
                  const probStr = String(deal.probability || '').toLowerCase();
                  let weightFactor = 0.3;
                  if (probStr === 'high') weightFactor = 0.8;
                  else if (probStr === 'medium') weightFactor = 0.5;
                  else if (probStr === 'low') weightFactor = 0.2;
                  else if (probStr.includes('80')) weightFactor = 0.8;
                  else if (probStr.includes('50')) weightFactor = 0.5;
                  else if (probStr.includes('20')) weightFactor = 0.2;

                  const weightedVal = deal.deal_value * weightFactor;

                  return (
                    <tr key={idx} className="hover:bg-[#141722] transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-100">
                        {deal.deal_name}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                        {deal.client_code}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-1.5 py-0.5 rounded bg-[#141722] border border-[#1e2333] text-[10px]">
                          {deal.sector}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-100">
                        {formatINR(deal.deal_value)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          weightFactor === 0.8 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : weightFactor === 0.5 
                            ? 'bg-sky-950 text-sky-300 border border-sky-800' 
                            : weightFactor === 0.2
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {deal.probability || 'Unrated (30% Baseline)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {formatINR(weightedVal)}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[10px]">
                        {deal.tentative_close && deal.tentative_close !== 'N/A' 
                          ? deal.tentative_close 
                          : <span className="text-amber-500/80">Missing (Risk)</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onNavigateToAskAI(`What is the background and risk analysis for opportunity: ${deal.deal_name}?`)}
                          className="text-sky-400 hover:text-sky-300 text-[10px] font-medium"
                        >
                          Deep Dive →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sector × Operations Realization Heatmap Table */}
      <div className="bg-[#10121a] rounded-lg border border-[#1e2333] p-4">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Sector × Execution Matrix
          </h3>
          <p className="text-[11px] text-slate-500">
            Cross-functional view comparing pipeline volume against active delivery workloads and billed realization
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090a0f] text-slate-400 uppercase text-[10px] font-mono border-b border-[#1e2333]">
              <tr>
                <th className="py-2 px-3">Sector</th>
                <th className="py-2 px-3 text-right">Open Pipeline</th>
                <th className="py-2 px-3 text-center">Open Deals</th>
                <th className="py-2 px-3 text-center">Active WOs</th>
                <th className="py-2 px-3 text-center">Delayed WOs</th>
                <th className="py-2 px-3 text-right">Billed Realization</th>
                <th className="py-2 px-3 text-right">Conversion Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2333] text-[11px]">
              {sectors.map((sec, i) => {
                const woSec = (work_orders_summary.sector_breakdown || []).find(w => w.sector.toLowerCase() === sec.sector.toLowerCase());
                const activeWos = woSec ? woSec.active_wos : 0;
                const delayedWos = woSec ? woSec.delayed_wos : 0;
                const billedVal = sec.won_revenue || 0;

                return (
                  <tr key={i} className="hover:bg-[#141722] transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{sec.sector}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-100">{formatINR(sec.open_pipeline)}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">{sec.open_deals}</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">{activeWos}</td>
                    <td className="py-2.5 px-3 text-center">
                      {delayedWos > 0 ? (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800 text-[10px]">
                          {delayedWos} Delayed
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{formatINR(billedVal)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      {sec.open_pipeline > 0 ? `${Math.round((billedVal / sec.open_pipeline) * 100)}%` : '0%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
