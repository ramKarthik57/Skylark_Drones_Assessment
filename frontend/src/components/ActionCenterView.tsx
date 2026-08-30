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
      owner_suggestion: 'Suggested Role (not assigned in dataset): Sales Operations Lead'
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
      owner_suggestion: 'Suggested Role (not assigned in dataset): Project Delivery Lead'
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
      owner_suggestion: 'Suggested Role (not assigned in dataset): Finance Lead'
    }
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>🎯</span> Executive Action Directives
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Evidence-backed operational and commercial recovery actions prioritized by impact.
            </p>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
            {displayActions.length} Priority Actions
          </div>
        </div>
      </div>

      {/* Action Cards List */}
      {displayActions.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          No pending action directives identified.
        </div>
      ) : (
        <div className="space-y-4">
          {displayActions.map((act) => (
            <div 
              key={act.id} 
              className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded ${
                    act.urgency === 'HIGH' 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {act.urgency} URGENCY
                  </span>
                  <h3 className="text-base font-semibold text-slate-100">{act.title}</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">{act.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <span>📊</span> Ground Truth Evidence
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {act.evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <span>⚡</span> Business Impact & Directive
                  </div>
                  <p className="text-slate-300 mb-2">{act.impact}</p>
                  <p className="text-emerald-400 font-medium">{act.recommended_action}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <span>Suggested Role (not assigned in dataset): <strong className="text-slate-200">{act.owner_suggestion}</strong></span>
                </div>
                <span className="text-slate-500 font-mono">DETERMINISTIC ACTION ENGINE</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
