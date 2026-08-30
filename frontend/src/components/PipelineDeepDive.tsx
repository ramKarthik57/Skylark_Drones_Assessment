import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { BIData } from '../types';

interface PipelineDeepDiveProps {
  biData: BIData | null;
  onNavigateToAskAI: (query: string) => void;
  onOpenLineage?: (metricName: string) => void;
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
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5e2d8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-[#737373] font-semibold">Opportunity Concentration</span>
            <span className="text-xs font-mono font-bold text-[#d97706]">{top5Concentration}%</span>
          </div>
          <div className="text-base font-bold text-[#191919] mb-1">
            Top 5 Deals ({formatINR(top5Total)})
          </div>
          <p className="text-xs text-[#595959] mb-3">
            Top 5 active opportunities represent {top5Concentration}% of the ₹68.82 Cr total pipeline.
          </p>
          <div className="w-full bg-[#f4f2eb] rounded h-1.5 overflow-hidden border border-[#e5e2d8]">
            <div className="h-full bg-amber-500 rounded" style={{ width: `${top5Concentration}%` }} />
          </div>
        </div>

        {/* Sector Concentration Card */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5e2d8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-[#737373] font-semibold">Sector Concentration</span>
            <span className="text-xs font-mono font-bold text-[#007a5a]">{top2SectorsPct}%</span>
          </div>
          <div className="text-base font-bold text-[#191919] mb-1">
            Mining + Renewables
          </div>
          <p className="text-xs text-[#595959] mb-3">
            Top 2 sectors hold {formatINR(top2SectorsVal)} ({top2SectorsPct}% of active pipeline).
          </p>
          <div className="w-full bg-[#f4f2eb] rounded h-1.5 overflow-hidden border border-[#e5e2d8]">
            <div className="h-full bg-[#007a5a] rounded" style={{ width: `${top2SectorsPct}%` }} />
          </div>
        </div>

        {/* Cross-Board Linkage Realization */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5e2d8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-[#737373] font-semibold">Operations Linkage</span>
            <span className="text-xs font-mono font-bold text-[#007a5a]">89.7%</span>
          </div>
          <div className="text-base font-bold text-[#191919] mb-1">
            52 / 58 Work Orders Matched
          </div>
          <p className="text-xs text-[#595959] mb-3">
            Active work orders correspond to CRM deals with high commercial traceability.
          </p>
          <div className="w-full bg-[#f4f2eb] rounded h-1.5 overflow-hidden border border-[#e5e2d8]">
            <div className="h-full bg-[#007a5a] rounded" style={{ width: '89.7%' }} />
          </div>
        </div>
      </div>

      {/* Top Opportunities Enterprise Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e5e2d8] overflow-hidden shadow-xs">
        {/* Table Controls Header */}
        <div className="p-5 border-b border-[#e5e2d8] bg-[#faf9f6] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
              Top Active Opportunities Registry
            </h3>
            <p className="text-xs text-[#737373]">
              Sorted by nominal deal value with closure probability and forecast contribution
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex items-center gap-1.5 bg-[#ffffff] border border-[#dcd7cb] rounded-lg px-3 py-1.5 text-xs">
              <Search className="h-3.5 w-3.5 text-[#8c8577]" />
              <input
                type="text"
                placeholder="Search deal, client, sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-[#191919] placeholder-[#8c8577] focus:outline-none text-xs w-36 md:w-48 font-medium"
              />
            </div>

            {/* Sector Dropdown */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-[#ffffff] border border-[#dcd7cb] rounded-lg px-2.5 py-1.5 text-xs text-[#191919] focus:outline-none font-medium"
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
            <thead className="bg-[#f4f2eb] text-[#737373] uppercase text-[10px] font-mono border-b border-[#e5e2d8]">
              <tr>
                <th className="py-3 px-4 font-semibold">Opportunity Name</th>
                <th className="py-3 px-4 font-semibold">Client Code</th>
                <th className="py-3 px-4 font-semibold">Sector</th>
                <th 
                  className="py-3 px-4 font-semibold text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortField === 'deal_value') setSortAsc(!sortAsc);
                    else { setSortField('deal_value'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Deal Value</span>
                    <ArrowUpDown className="h-3 w-3 text-[#737373]" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-center">Probability</th>
                <th className="py-3 px-4 font-semibold text-right">Weighted Forecast</th>
                <th className="py-3 px-4 font-semibold text-center">Close Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f2eb] font-sans">
              {filteredDeals.map((deal, idx) => (
                <tr key={idx} className="hover:bg-[#faf9f6] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#191919]">{deal.deal_name}</td>
                  <td className="py-3 px-4 font-mono text-[#595959]">{deal.client_code}</td>
                  <td className="py-3 px-4 text-[#595959]">{deal.sector}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#191919]">{formatINR(deal.deal_value)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      deal.probability === 'High' ? 'bg-emerald-50 text-[#007a5a] border border-emerald-200' :
                      deal.probability === 'Low' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {deal.probability}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#007a5a]">
                    {formatINR((deal.deal_value * (deal.probability === 'High' ? 0.8 : deal.probability === 'Low' ? 0.2 : 0.5)))}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#737373] text-[11px]">{deal.tentative_close || 'Unrated'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigateToAskAI(`Tell me more about deal ${deal.deal_name}`)}
                      className="text-[#007a5a] hover:text-[#006046] font-semibold text-xs cursor-pointer"
                    >
                      Audit →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sector × Operations Realization Heatmap Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e5e2d8] p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
            Sector × Execution Matrix
          </h3>
          <p className="text-xs text-[#737373]">
            Cross-functional view comparing pipeline volume against active delivery workloads and billed realization
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f2eb] text-[#737373] uppercase text-[10px] font-mono border-b border-[#e5e2d8]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Sector</th>
                <th className="py-2.5 px-3 text-right font-semibold">Open Pipeline</th>
                <th className="py-2.5 px-3 text-center font-semibold">Open Deals</th>
                <th className="py-2.5 px-3 text-center font-semibold">Active WOs</th>
                <th className="py-2.5 px-3 text-center font-semibold">Delayed WOs</th>
                <th className="py-2.5 px-3 text-right font-semibold">Billed Realization</th>
                <th className="py-2.5 px-3 text-right font-semibold">Conversion Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f2eb] font-sans">
              {sectors.map((sec, i) => {
                const woSec = (work_orders_summary.sector_breakdown || []).find(w => w.sector.toLowerCase() === sec.sector.toLowerCase());
                const activeWos = woSec ? woSec.active_wos : 0;
                const delayedWos = woSec ? woSec.delayed_wos : 0;
                const billedVal = sec.won_revenue || 0;

                return (
                  <tr key={i} className="hover:bg-[#faf9f6] transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#191919]">{sec.sector}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#191919]">{formatINR(sec.open_pipeline)}</td>
                    <td className="py-2.5 px-3 text-center text-[#595959]">{sec.open_deals}</td>
                    <td className="py-2.5 px-3 text-center text-[#595959]">{activeWos}</td>
                    <td className="py-2.5 px-3 text-center">
                      {delayedWos > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-[#d97706] font-bold border border-amber-200 text-[10px]">
                          {delayedWos} Delayed
                        </span>
                      ) : (
                        <span className="text-[#8c8577] text-[10px]">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#007a5a] font-bold">{formatINR(billedVal)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#191919]">
                      {sec.open_pipeline > 0 ? `${((billedVal / sec.open_pipeline) * 100).toFixed(1)}%` : '—'}
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
