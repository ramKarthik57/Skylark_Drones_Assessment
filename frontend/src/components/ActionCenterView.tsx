import React from 'react';
import type { ActionItem } from '../types';

interface ActionCenterViewProps {
  actions?: ActionItem[];
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({ actions = [] }) => {
  const defaultActions: ActionItem[] = [
    {
      id: 'ACT-01',
      title: 'Audit & Mandate Close Dates for 49 Open Deals',
      urgency: 'HIGH',
      priority: 'HIGH',
      evidence: [
        '49 of 50 open deals (98.0%) lack explicit tentative close dates.',
        '₹67.32 Cr open pipeline currently unallocated to close quarters.'
      ],
      impact: 'Eliminates quarterly revenue timing ambiguity and reduces weighted forecast variance.',
      recommended_action: 'Sales Leadership to mandate close date entry for top open deals; no completion deadline specified in source data.',
      owner_suggestion: 'Sales Operations Lead'
    },
    {
      id: 'ACT-02',
      title: 'Review 5 Execution Delayed Work Orders',
      urgency: 'HIGH',
      priority: 'HIGH',
      evidence: [
        '5 active work orders (8.6%) flagged Execution Delayed in tracker records.',
        'Total contract value affected: ₹1.85 Cr | Billed to date: ₹0.60 Cr.'
      ],
      impact: 'Affects ₹1.85 Cr contract value and ₹1.25 Cr unbilled realization gap.',
      recommended_action: 'Review tracker records for the 5 delayed work orders to identify recorded operational blockers.',
      owner_suggestion: 'Project Delivery Lead'
    },
    {
      id: 'ACT-03',
      title: 'Accelerate Collections on ₹3.63 Cr Outstanding Receivables',
      urgency: 'MEDIUM',
      priority: 'MEDIUM',
      evidence: [
        'Total uncollected receivables stand at ₹3.63 Cr across active and completed projects.',
        'Contracted value billed to date: ₹10.74 Cr out of ₹21.06 Cr total.'
      ],
      impact: 'Improves working capital and cash conversion ratio.',
      recommended_action: 'Finance team to prioritize collections follow-up on outstanding invoices.',
      owner_suggestion: 'Finance Lead'
    }
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#1a0e38] border border-[#2d1854] rounded-2xl p-6 shadow-xl shadow-purple-950/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">
              Executive Action Directives
            </h2>
            <p className="text-xs text-purple-300/70 mt-1">
              Evidence-backed operational and commercial recovery actions prioritized by impact
            </p>
          </div>
          <div className="px-3 py-1 bg-purple-950/80 border border-purple-700/50 rounded-full text-purple-300 text-xs font-semibold">
            {displayActions.length} Action Items
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {displayActions.map((act) => (
          <div 
            key={act.id} 
            className="bg-gradient-to-b from-[#1c103c] to-[#130a2a] border border-[#2d1854] rounded-2xl p-6 space-y-4 hover:border-purple-500/60 shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/60">
                  {act.id}
                </span>
                <h3 className="text-sm font-bold text-white">{act.title}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                act.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
              }`}>
                {act.priority} PRIORITY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0d061f] p-3.5 rounded-xl border border-[#2d1854] space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Ground Truth Evidence</span>
                {act.evidence.map((ev, idx) => (
                  <p key={idx} className="text-purple-200/90 leading-normal">• {ev}</p>
                ))}
              </div>
              <div className="bg-[#0d061f] p-3.5 rounded-xl border border-[#2d1854] space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Strategic Impact</span>
                <p className="text-purple-200/90 leading-relaxed">{act.impact}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2d1854] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-purple-400/80 uppercase">Recommended Directive:</span>
                <p className="text-white mt-0.5 font-medium">{act.recommended_action}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] text-purple-400 font-mono">OWNER:</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-950 text-purple-200 border border-purple-700/60">
                  {act.owner_suggestion}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
