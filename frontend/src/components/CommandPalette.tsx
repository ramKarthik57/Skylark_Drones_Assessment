import React, { useEffect, useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  MessageSquare, 
  ShieldAlert, 
  CheckSquare, 
  ShieldCheck, 
  Sliders, 
  FileText, 
  X,
  CornerDownLeft
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'command_center' | 'ask_ai' | 'risk_radar' | 'data_trust' | 'action_center') => void;
  onOpenLeadership: () => void;
  onOpenScenario: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenLeadership,
  onOpenScenario
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    {
      id: 'nav_overview',
      title: 'Go to Executive Overview',
      subtitle: 'KPIs, Sector Breakdown, Pipeline Health',
      icon: LayoutDashboard,
      shortcut: 'G O',
      action: () => { onNavigate('command_center'); onClose(); }
    },
    {
      id: 'nav_ai',
      title: 'Ask AI Analyst',
      subtitle: 'Natural language queries grounded in Deals & Work Orders',
      icon: MessageSquare,
      shortcut: 'G A',
      action: () => { onNavigate('ask_ai'); onClose(); }
    },
    {
      id: 'nav_risk',
      title: 'Open Risk Radar Matrix',
      subtitle: 'Deterministic forecast & execution risk signals',
      icon: ShieldAlert,
      shortcut: 'G R',
      action: () => { onNavigate('risk_radar'); onClose(); }
    },
    {
      id: 'nav_actions',
      title: 'Open Action Center Queue',
      subtitle: 'Evidence-backed prioritized recovery directives',
      icon: CheckSquare,
      shortcut: 'G C',
      action: () => { onNavigate('action_center'); onClose(); }
    },
    {
      id: 'nav_trust',
      title: 'Open Data Trust Center',
      subtitle: '5-dimensional dataset completeness & governance audit',
      icon: ShieldCheck,
      shortcut: 'G T',
      action: () => { onNavigate('data_trust'); onClose(); }
    },
    {
      id: 'open_scenario',
      title: 'Open Scenario Lab',
      subtitle: 'What-if simulation on probability & conversion',
      icon: Sliders,
      shortcut: 'S L',
      action: () => { onOpenScenario(); onClose(); }
    },
    {
      id: 'open_leadership',
      title: 'Generate Leadership Brief',
      subtitle: 'Formal executive memo for founders & strategy leaders',
      icon: FileText,
      shortcut: 'L B',
      action: () => { onOpenLeadership(); onClose(); }
    }
  ];

  const filtered = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-start justify-center pt-24 p-4">
      <div className="bg-[#10121a] border border-[#1e2333] rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-100">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#1e2333]">
          <Search className="h-4 w-4 text-slate-500 mr-2.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to screen..."
            autoFocus
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-[#1a1e2d] text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-medium">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                    <span className="px-1.5 py-0.2 rounded bg-[#090a0f] border border-[#1e2333]">{item.shortcut}</span>
                    {isSelected && <CornerDownLeft className="h-3 w-3 text-sky-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1e2333] bg-[#090a0f] text-[10px] text-slate-500 flex items-center justify-between">
          <span>Navigate with <kbd className="text-slate-400">↑</kbd> <kbd className="text-slate-400">↓</kbd></span>
          <span>Select with <kbd className="text-slate-400">↵</kbd></span>
          <span>Close with <kbd className="text-slate-400">esc</kbd></span>
        </div>
      </div>
    </div>
  );
};
