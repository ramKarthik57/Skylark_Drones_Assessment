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
        <div className="mt-5 pt-3.5 border-t border-[#2d2d32] bg-[#18181b] p-4 rounded-xl border border-[#333338] shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#a1a1aa]">
            <BarChart2 className="h-4 w-4 text-[#d97706]" />
            <span className="font-semibold text-[#f4f4f5]">{title}</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#2d2d32" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202024', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Value / Forecast Contribution']}
                />
                <Bar dataKey="Value" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 2. Forecast Derivation Waterfall
    if (type === 'FORECAST_WATERFALL') {
      return (
        <div className="mt-5 pt-3.5 border-t border-[#2d2d32] bg-[#18181b] p-4 rounded-xl border border-[#333338] shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#a1a1aa]">
            <BarChart2 className="h-4 w-4 text-[#10b981]" />
            <span className="font-semibold text-[#f4f4f5]">{title}</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#2d2d32" vertical={false} />
                <XAxis dataKey="category" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202024', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Contribution']}
                />
                <Bar dataKey="Contribution" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 3. Multi-Dimension Sector Comparison Chart
    if (type === 'SECTOR_COMPARISON') {
      return (
        <div className="mt-5 pt-3.5 border-t border-[#2d2d32] bg-[#18181b] p-4 rounded-xl border border-[#333338] shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#a1a1aa]">
            <BarChart2 className="h-4 w-4 text-[#38bdf8]" />
            <span className="font-semibold text-[#f4f4f5]">{title}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#2d2d32" vertical={false} />
                <XAxis dataKey="sector" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202024', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }}
                  formatter={(val: any, name: any) => [`₹${val} Cr`, name]}
                />
                <Bar dataKey="Pipeline" fill="#0284c7" name="Pipeline" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Billed" fill="#10b981" name="Billed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 4. Work Order Execution Status Donut
    if (type === 'EXECUTION_STATUS_DONUT') {
      return (
        <div className="mt-5 pt-3.5 border-t border-[#2d2d32] bg-[#18181b] p-4 rounded-xl border border-[#333338] shadow-inner flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#a1a1aa] mb-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-[#f4f4f5]">{title}</span>
            </div>
            <div className="text-xs text-[#d4d4d8] space-y-1.5 font-medium">
              {data.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                  <strong style={{ color: item.color }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="h-28 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={26} outerRadius={44} dataKey="value">
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
        <div className="mt-5 pt-3.5 border-t border-[#2d2d32] bg-[#18181b] p-4 rounded-xl border border-[#333338] shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#a1a1aa]">
            <BarChart2 className="h-4 w-4 text-rose-400" />
            <span className="font-semibold text-[#f4f4f5]">{title}</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#2d2d32" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202024', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }}
                  formatter={(val: any, name: any) => [name === 'Share' ? `${val}%` : `₹${val} Cr`, name]}
                />
                <Bar dataKey="Value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 6. Risk Evidence Strength Bar Chart
    if (type === 'RISK_EVIDENCE_BAR') {
      return (
        <div className="mt-5 pt-3.5 border-t border-[#2d2d32] bg-[#18181b] p-4 rounded-xl border border-[#333338] shadow-inner">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#a1a1aa]">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span className="font-semibold text-[#f4f4f5]">{title}</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 15, left: 15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#2d2d32" horizontal={false} />
                <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="risk" stroke="#71717a" fontSize={11} tickLine={false} width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#202024', borderColor: '#3f3f46', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Financial Exposure']}
                />
                <Bar dataKey="Exposure" fill="#ef4444" radius={[0, 4, 4, 0]} />
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
      <div className="flex-1 overflow-y-auto px-2 md:px-6 py-6 space-y-7">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[94%] md:max-w-[88%] rounded-2xl px-6 py-5 text-sm leading-relaxed transition-all ${
                msg.sender === 'user'
                  ? 'bg-[#27272a] text-[#fafafa] border border-[#3f3f46] ml-12 shadow-sm'
                  : 'bg-[#202024] border border-[#2d2d32] text-[#f4f4f5] mr-6 shadow-sm'
              }`}
            >
              {/* Message Header for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="text-[11px] text-[#71717a] font-mono mb-3 pb-2.5 border-b border-[#2d2d32] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#d97706] font-semibold tracking-wide">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SKYLARK ANALYST</span>
                  </div>
                  <span className="text-[10px] text-[#71717a]">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content (Clean Professional Markdown without hashes) */}
              <div className="whitespace-pre-wrap font-sans text-sm space-y-3 leading-relaxed text-[#e4e4e7]">
                {msg.text}
              </div>

              {/* Contextual Visual Chart */}
              {renderContextualChart(msg)}

              {/* Clarification Refinements */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-[#2d2d32] space-y-2">
                  <div className="text-[#d97706] font-medium text-xs flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Select a dimension to refine the analysis:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {msg.clarificationOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectSuggested(opt)}
                        className="text-left px-3.5 py-2.5 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#2d2d32] text-[#fbbf24] text-xs transition-all flex items-center justify-between group"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#71717a] group-hover:text-[#fbbf24] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Data Quality & Evidence Drawer */}
              {msg.dataQualityNotes && msg.dataQualityNotes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#2d2d32]">
                  <button
                    onClick={() => toggleCaveat(msg.id)}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
                  >
                    <span>Dataset Caveats ({msg.dataQualityNotes.length})</span>
                    {expandedCaveats[msg.id] ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>

                  {expandedCaveats[msg.id] && (
                    <div className="mt-2.5 p-3 bg-[#18181b] rounded-xl border border-[#2d2d32] text-xs text-[#a1a1aa] space-y-1.5">
                      {msg.dataQualityNotes.map((note, idx) => (
                        <p key={idx} className="leading-relaxed text-[11px] text-[#fcd34d]">• {note}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-[#a1a1aa] text-xs py-3 px-4 bg-[#202024] rounded-2xl border border-[#2d2d32] max-w-sm shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#d97706] animate-ping" />
            <span className="text-xs">Analyzing board evidence & computing ground truth…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Horizontal Scroller */}
      <div className="px-2 md:px-0 py-2.5 border-t border-[#2d2d32] bg-[#18181b] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-[#71717a] uppercase font-mono shrink-0">Explore:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggested(prompt)}
            className="text-xs px-3.5 py-1.5 rounded-full bg-[#202024] hover:bg-[#27272a] text-[#d4d4d8] hover:text-white border border-[#2d2d32] hover:border-[#3f3f46] shrink-0 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Modern Conversational Input Box */}
      <div className="p-2 md:p-0 pt-2 border-t border-[#2d2d32] bg-[#18181b]">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-[#202024] border border-[#2d2d32] focus-within:border-[#d97706]/70 focus-within:ring-1 focus-within:ring-[#d97706]/30 rounded-2xl px-4 py-3.5 transition-all shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Skylark about pipeline health, weighted forecast, work orders, or risks..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="ml-2.5 p-2 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white disabled:opacity-20 disabled:hover:bg-[#d97706] transition-all shadow-sm"
              title="Send question"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-[#71717a] font-mono py-2">
          Grounded strictly in Monday.com Deals (344) & Work Orders (175) records
        </p>
      </div>
    </div>
  );
};

