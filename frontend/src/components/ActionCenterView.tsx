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
      <div className="bg-[#ffffff] border border-[#e5e2d8] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#191919] tracking-wider uppercase font-mono">
              Executive Action Directives
            </h2>
            <p className="text-xs text-[#737373] mt-1">
              Evidence-backed operational and commercial recovery actions prioritized by impact
            </p>
          </div>
          <div className="px-3 py-1 bg-[#f4f2eb] border border-[#dcd7cb] rounded text-[#191919] text-xs font-semibold font-mono">
            {displayActions.length} Action Items
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {displayActions.map((act) => (
          <div 
            key={act.id} 
            className="bg-[#ffffff] border border-[#e5e2d8] rounded-2xl p-6 space-y-4 hover:border-[#007a5a] shadow-xs transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-white bg-[#007a5a] px-2.5 py-1 rounded">
                  {act.id}
                </span>
                <h3 className="text-sm font-bold text-[#191919]">{act.title}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded font-mono ${
                act.urgency === 'HIGH' ? 'bg-amber-100 text-[#d97706] border border-amber-300' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {act.urgency} URGENCY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#f4f2eb] p-4 rounded-xl border border-[#e5e2d8]">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#737373] font-bold mb-1.5">
                  GROUND-TRUTH EVIDENCE
                </div>
                <ul className="space-y-1 text-[#595959] font-mono">
                  {act.evidence.map((ev, i) => (
                    <li key={i}>• {ev}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#f4f2eb] p-4 rounded-xl border border-[#e5e2d8]">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#737373] font-bold mb-1.5">
                  STRATEGIC IMPACT
                </div>
                <p className="text-[#404040] leading-relaxed">{act.impact}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e5e2d8] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
              <div className="text-[#404040]">
                <strong className="text-[#191919]">Directive:</strong> {act.recommended_action}
              </div>
              <div className="text-[#737373] shrink-0 font-mono text-[11px]">
                Owner: <span className="font-semibold text-[#007a5a]">{act.owner_suggestion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
