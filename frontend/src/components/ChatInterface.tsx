import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ArrowRight, 
  BarChart2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import type { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  loading: boolean;
  onSelectSuggested: (question: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  loading,
  onSelectSuggested
}) => {
  const [input, setInput] = useState('');
  const [expandedCaveats, setExpandedCaveats] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const toggleCaveat = (msgId: string) => {
    setExpandedCaveats(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const samplePrompts = [
    "How is our pipeline looking this quarter?",
    "Which sectors have the strongest pipeline?",
    "Show me our biggest active opportunities",
    "How many active and delayed work orders do we have?",
    "Which deal contributes the most to weighted forecast?",
    "How was the weighted forecast calculated?",
    "What can we conclude and what is unsupported?",
    "Compare Mining and Renewables"
  ];

  // Helper to render contextual charts based strictly on the formal VisualizationSpec
  const renderContextualChart = (msg: ChatMessage) => {
    if (!msg.visualization || !msg.visualization.type || msg.visualization.type === 'NONE') {
      return null;
    }

    const { type, title, data } = msg.visualization;

    // 1. Top Opportunity / Forecast Exposure Horizontal/Vertical Bar Chart
    if (type === 'TOP_OPPORTUNITY_BAR') {
      return (
        <div className="mt-4 pt-3 border-t border-[#1f2536] bg-[#0c0e15] p-3.5 rounded-lg border border-[#1f2536]">
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono text-slate-400">
            <BarChart2 className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">{title}</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f2536" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10131d', borderColor: '#2b334a', borderRadius: '6px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Value / Forecast Contribution']}
                />
                <Bar dataKey="Value" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 2. Forecast Derivation Waterfall
    if (type === 'FORECAST_WATERFALL') {
      return (
        <div className="mt-4 pt-3 border-t border-[#1f2536] bg-[#0c0e15] p-3.5 rounded-lg border border-[#1f2536]">
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono text-slate-400">
            <BarChart2 className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-semibold text-slate-300">{title}</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f2536" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10131d', borderColor: '#2b334a', borderRadius: '6px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Contribution']}
                />
                <Bar dataKey="Contribution" fill="#0284c7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 3. Multi-Dimension Sector Comparison Chart
    if (type === 'SECTOR_COMPARISON') {
      return (
        <div className="mt-4 pt-3 border-t border-[#1f2536] bg-[#0c0e15] p-3.5 rounded-lg border border-[#1f2536]">
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono text-slate-400">
            <BarChart2 className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-semibold text-slate-300">{title}</span>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f2536" vertical={false} />
                <XAxis dataKey="sector" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10131d', borderColor: '#2b334a', borderRadius: '6px', fontSize: '11px' }}
                  formatter={(val: any, name: any) => [`₹${val} Cr`, name]}
                />
                <Bar dataKey="Pipeline" fill="#0284c7" name="Pipeline" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Billed" fill="#10b981" name="Billed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 4. Work Order Execution Status Donut
    if (type === 'EXECUTION_STATUS_DONUT') {
      return (
        <div className="mt-4 pt-3 border-t border-[#1f2536] bg-[#0c0e15] p-3.5 rounded-lg border border-[#1f2536] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-300">{title}</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              {data.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                  <strong style={{ color: item.color }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="h-24 w-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={22} outerRadius={38} dataKey="value">
                  {data.map((e: any, idx: number) => <Cell key={idx} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 5. Concentration Pareto Chart
    if (type === 'CONCENTRATION_PARETO') {
      return (
        <div className="mt-4 pt-3 border-t border-[#1f2536] bg-[#0c0e15] p-3.5 rounded-lg border border-[#1f2536]">
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono text-slate-400">
            <BarChart2 className="h-3.5 w-3.5 text-rose-400" />
            <span className="font-semibold text-slate-300">{title}</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f2536" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10131d', borderColor: '#2b334a', borderRadius: '6px', fontSize: '11px' }}
                  formatter={(val: any, name: any) => [name === 'Share' ? `${val}%` : `₹${val} Cr`, name]}
                />
                <Bar dataKey="Value" fill="#f43f5e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 6. Risk Evidence Strength Bar Chart
    if (type === 'RISK_EVIDENCE_BAR') {
      return (
        <div className="mt-4 pt-3 border-t border-[#1f2536] bg-[#0c0e15] p-3.5 rounded-lg border border-[#1f2536]">
          <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-mono text-slate-400">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span className="font-semibold text-slate-300">{title}</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 2, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1f2536" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="risk" stroke="#64748b" fontSize={10} tickLine={false} width={140} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10131d', borderColor: '#2b334a', borderRadius: '6px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Financial Exposure']}
                />
                <Bar dataKey="Exposure" fill="#ef4444" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl w-full mx-auto overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[92%] md:max-w-[85%] rounded-xl px-5 py-4 text-sm leading-relaxed transition-all ${
                msg.sender === 'user'
                  ? 'bg-[#181f30] text-slate-100 border border-[#2a3652] ml-12 shadow-sm'
                  : 'bg-[#121520] border border-[#1d2334] text-slate-200 mr-8 shadow-sm'
              }`}
            >
              {/* Message Header for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="text-[11px] text-slate-400 font-mono mb-3 pb-2 border-b border-[#1f2536] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sky-400 font-semibold tracking-wide">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SKYLARK ANALYST</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content (Clean Professional Markdown without hashes) */}
              <div className="whitespace-pre-wrap font-sans text-sm space-y-3 leading-relaxed text-slate-200">
                {msg.text}
              </div>

              {/* Contextual Visual Chart */}
              {renderContextualChart(msg)}

              {/* Clarification Refinements */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1f2536] space-y-2">
                  <div className="text-amber-400 font-medium text-xs flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Select a dimension to refine the analysis:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {msg.clarificationOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectSuggested(opt)}
                        className="text-left px-3 py-2 rounded-lg bg-[#0c0e15] hover:bg-[#161a27] border border-[#1f2536] text-sky-300 text-xs transition-colors flex items-center justify-between group"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Data Quality & Evidence Drawer */}
              {msg.dataQualityNotes && msg.dataQualityNotes.length > 0 && (
                <div className="mt-3.5 pt-2.5 border-t border-[#1f2536]">
                  <button
                    onClick={() => toggleCaveat(msg.id)}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span>Dataset Caveats ({msg.dataQualityNotes.length})</span>
                    {expandedCaveats[msg.id] ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>

                  {expandedCaveats[msg.id] && (
                    <div className="mt-2 p-2.5 bg-[#090b10] rounded border border-[#1a1f2c] text-xs text-slate-400 space-y-1">
                      {msg.dataQualityNotes.map((note, idx) => (
                        <p key={idx} className="leading-relaxed text-[11px] text-amber-300/80">• {note}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2.5 px-4 bg-[#121520] rounded-xl border border-[#1d2334] max-w-sm">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-xs">Analyzing board evidence & computing ground truth…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Horizontal Scroller */}
      <div className="px-2 md:px-0 py-2 border-t border-[#1a1f2c] bg-[#0b0d13] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0">Explore:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggested(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-[#121520] hover:bg-[#181d2a] text-slate-300 hover:text-white border border-[#1f2536] shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Modern Conversational Input Box */}
      <div className="p-2 md:p-0 pt-2 border-t border-[#1a1f2c] bg-[#0b0d13]">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-[#121520] border border-[#232a3b] focus-within:border-sky-600/70 focus-within:ring-1 focus-within:ring-sky-600/30 rounded-xl px-4 py-3 transition-all shadow-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Skylark about pipeline health, weighted forecast, work orders, or risks..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="ml-2 p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-20 disabled:hover:bg-sky-600 transition-colors shadow-sm"
              title="Send question"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-slate-600 font-mono py-1.5">
          Grounded strictly in Monday.com Deals (344) & Work Orders (175) records
        </p>
      </div>
    </div>
  );
};

