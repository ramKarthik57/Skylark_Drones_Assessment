import React from 'react';
import type { ActionItem } from '../types';
import { AlertTriangle, CheckCircle, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

interface ActionCenterViewProps {
  actions?: ActionItem[];
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({ actions = [] }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" /> Executive Action Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Prioritized operational recovery actions and revenue-acceleration directives calculated from live ground-truth metrics.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
            {actions.length} Action Directives
          </span>
        </div>

        {actions.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium">All operational metrics within standard executive threshold.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {actions.map((act) => {
              const isImmediate = act.urgency === 'IMMEDIATE';
              const badgeStyle = isImmediate
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : act.urgency === 'HIGH'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

              return (
                <div
                  key={act.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${badgeStyle}`}>
                        {act.urgency} URGENCY
                      </span>
                      <h3 className="text-base font-semibold text-slate-100">{act.title}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Ground-Truth Evidence
                      </div>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {act.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" /> Business Impact & Directive
                      </div>
                      <p className="text-slate-300 mb-2">{act.impact}</p>
                      <p className="text-emerald-300 font-medium">{act.recommended_action}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Suggested Owner: <strong className="text-slate-200">{act.owner_suggestion}</strong></span>
                    </div>
                    <span className="text-slate-500 font-mono">DETERMINISTIC ACTION ENGINE</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
