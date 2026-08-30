import React from 'react';
import { Activity, Database, FileText, RefreshCw, LayoutDashboard, MessageSquare, ShieldAlert, ShieldCheck, Sliders, CheckSquare } from 'lucide-react';
import type { BoardStatus } from '../types';

interface HeaderProps {
  status: BoardStatus | null;
  activeTab: 'command_center' | 'ask_ai' | 'risk_radar' | 'data_trust' | 'action_center';
  onTabChange: (tab: 'command_center' | 'ask_ai' | 'risk_radar' | 'data_trust' | 'action_center') => void;
  onOpenLeadershipModal: () => void;
  onOpenScenarioModal: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  activeTab,
  onTabChange,
  onOpenLeadershipModal,
  onOpenScenarioModal,
  onRefresh,
  loading
}) => {
  const isLive = status?.connected_live_monday;

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 py-3 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">Skylark Executive Intelligence</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                RAM KARTHIK EDITION
              </span>
            </div>
            <p className="text-xs text-slate-400">Turn messy operational data into decisions leadership can trust</p>
          </div>
        </div>

        {/* Executive Workspace Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onTabChange('command_center')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'command_center' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onTabChange('ask_ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ask_ai' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={() => onTabChange('risk_radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'risk_radar' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Risk Radar</span>
            {status && status.risk_radar_count > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => onTabChange('action_center')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'action_center' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Actions</span>
          </button>

          <button
            onClick={() => onTabChange('data_trust')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'data_trust' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Trust</span>
          </button>
        </nav>

        {/* Status Badges & Quick Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Connection Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            isLive 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}>
            <Database className="h-3.5 w-3.5" />
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>
                {isLive ? '● LIVE — Monday.com' : '● DEMO — Mock Data'}
              </span>
            </div>
          </div>

          {/* Scenario Modal Trigger Button */}
          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-xs border border-emerald-500/30 transition-all"
            title="Executive Scenario What-If Simulation"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Scenario</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
            title="Refresh Board Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Leadership Update Button */}
          <button
            onClick={onOpenLeadershipModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4" />
            <span>Leadership Brief</span>
          </button>
        </div>
      </div>
    </header>
  );
};
