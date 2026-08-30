import React from 'react';
import { FileText, RefreshCw, LayoutDashboard, MessageSquare, ShieldAlert, ShieldCheck, Sliders, CheckSquare } from 'lucide-react';
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
  return (
    <header className="sticky top-0 z-30 bg-[#10121a] border-b border-[#1e2333] py-2.5 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-[#1e2333] border border-[#282f44] flex items-center justify-center text-sky-400 font-bold text-xs">
            SK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm text-slate-100 tracking-tight">Skylark Executive Intelligence</h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium border border-slate-700">
                v3
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Decision Intelligence Platform • Engineered by Ram Karthik</p>
          </div>
        </div>

        {/* Executive Workspace Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#090a0f] p-1 rounded-md border border-[#1e2333] text-xs">
          <button
            onClick={() => onTabChange('command_center')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'command_center' 
                ? 'bg-[#1a1e2d] text-slate-100 border border-[#282f44]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onTabChange('ask_ai')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'ask_ai' 
                ? 'bg-[#1a1e2d] text-slate-100 border border-[#282f44]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={() => onTabChange('risk_radar')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'risk_radar' 
                ? 'bg-[#1a1e2d] text-slate-100 border border-[#282f44]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Risk Radar</span>
            {status && status.risk_radar_count > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => onTabChange('action_center')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'action_center' 
                ? 'bg-[#1a1e2d] text-slate-100 border border-[#282f44]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Actions</span>
          </button>

          <button
            onClick={() => onTabChange('data_trust')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
              activeTab === 'data_trust' 
                ? 'bg-[#1a1e2d] text-slate-100 border border-[#282f44]' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Trust</span>
          </button>
        </nav>

        {/* Status & Quick Action Controls */}
        {/* Status & Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141722] hover:bg-[#1a1e2d] text-slate-300 hover:text-slate-100 text-xs font-medium border border-[#1e2333] transition-colors disabled:opacity-40"
            title="Sync Latest Board Data"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          {/* Scenario Trigger */}
          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141722] hover:bg-[#1a1e2d] text-slate-300 hover:text-slate-100 font-medium text-xs border border-[#1e2333] transition-colors"
            title="Executive Scenario What-If Simulation"
          >
            <Sliders className="h-3 w-3 text-sky-400" />
            <span>Scenario Lab</span>
          </button>

          {/* Leadership Brief Button */}
          <button
            onClick={onOpenLeadershipModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <FileText className="h-3 w-3" />
            <span>Leadership Brief</span>
          </button>
        </div>
      </div>
    </header>
  );
};
