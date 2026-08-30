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
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#10121a] border border-[#1e2333] rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              Executive Action Directives
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Evidence-backed operational and commercial recovery actions prioritized by impact
            </p>
          </div>
          <div className="px-2.5 py-0.5 bg-[#141722] border border-[#1e2333] rounded text-slate-300 text-xs font-medium">
            {displayActions.length} Action Items
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {displayActions.map((act) => (
          <div 
            key={act.id} 
            className="bg-[#141722] border border-[#1e2333] rounded-lg p-5 space-y-3.5 hover:border-[#282f44] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                  act.urgency === 'HIGH' 
                    ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {act.urgency} PRIORITY
                </span>
                <h3 className="text-sm font-medium text-slate-100">{act.title}</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{act.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#090a0f] p-3 rounded border border-[#1e2333]">
                <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1">
                  Ground Truth Evidence
                </div>
                <ul className="text-slate-300 space-y-1 text-[11px]">
                  {act.evidence.map((ev, i) => (
                    <li key={i}>• {ev}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#090a0f] p-3 rounded border border-[#1e2333]">
                <div className="text-[10px] text-slate-400 font-semibold uppercase mb-1">
                  Impact & Directive
                </div>
                <p className="text-slate-400 mb-1.5 text-[11px]">{act.impact}</p>
                <p className="text-slate-200 font-medium text-[11px]">{act.recommended_action}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1e2333] flex items-center justify-between text-[11px] text-slate-400">
              <div>
                <span>Suggested Role (not assigned in source data): </span>
                <strong className="text-slate-200 font-medium">{act.owner_suggestion}</strong>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">DETERMINISTIC ENGINE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
