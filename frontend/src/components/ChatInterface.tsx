import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowRight, BarChart2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
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

  const samplePrompts = [
    "How is our pipeline looking this quarter?",
    "Which sectors have the strongest pipeline?",
    "Show me our biggest active opportunities",
    "How many active and delayed work orders do we have?",
    "What are the biggest risks to converting our pipeline?",
    "How was the weighted forecast calculated?",
    "What is our EBITDA?"
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
        <div className="mt-3 pt-3 border-t border-[#1e2333] bg-[#090a0f]/60 p-3 rounded border border-[#1e2333]">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono text-slate-400 uppercase">
            <BarChart2 className="h-3 w-3 text-amber-400" />
            <span>{title}</span>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121a', borderColor: '#282f44', borderRadius: '4px', fontSize: '10px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Forecast Exposure / Value']}
                />
                <Bar dataKey="Value" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 2. Forecast Derivation Waterfall
    if (type === 'FORECAST_WATERFALL') {
      return (
        <div className="mt-3 pt-3 border-t border-[#1e2333] bg-[#090a0f]/60 p-3 rounded border border-[#1e2333]">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono text-slate-400 uppercase">
            <BarChart2 className="h-3 w-3 text-sky-400" />
            <span>{title}</span>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" vertical={false} />
                <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121a', borderColor: '#282f44', borderRadius: '4px', fontSize: '10px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Contribution']}
                />
                <Bar dataKey="Contribution" fill="#0284c7" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 3. Multi-Dimension Sector Comparison Chart
    if (type === 'SECTOR_COMPARISON') {
      return (
        <div className="mt-3 pt-3 border-t border-[#1e2333] bg-[#090a0f]/60 p-3 rounded border border-[#1e2333]">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono text-slate-400 uppercase">
            <BarChart2 className="h-3 w-3 text-sky-400" />
            <span>{title}</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" vertical={false} />
                <XAxis dataKey="sector" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121a', borderColor: '#282f44', borderRadius: '4px', fontSize: '10px' }}
                  formatter={(val: any, name: any) => [`₹${val} Cr`, name]}
                />
                <Bar dataKey="Pipeline" fill="#0284c7" name="Pipeline" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Billed" fill="#10b981" name="Billed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 4. Work Order Execution Status Donut
    if (type === 'EXECUTION_STATUS_DONUT') {
      return (
        <div className="mt-3 pt-3 border-t border-[#1e2333] bg-[#090a0f]/60 p-3 rounded border border-[#1e2333] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase mb-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>{title}</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              {data.map((item: any, i: number) => (
                <p key={i}>
                  • {item.name}: <strong style={{ color: item.color }}>{item.value}</strong>
                </p>
              ))}
            </div>
          </div>
          <div className="h-20 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={18} outerRadius={32} dataKey="value">
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
        <div className="mt-3 pt-3 border-t border-[#1e2333] bg-[#090a0f]/60 p-3 rounded border border-[#1e2333]">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono text-slate-400 uppercase">
            <BarChart2 className="h-3 w-3 text-rose-400" />
            <span>{title}</span>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 2, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121a', borderColor: '#282f44', borderRadius: '4px', fontSize: '10px' }}
                  formatter={(val: any, name: any) => [name === 'Share' ? `${val}%` : `₹${val} Cr`, name]}
                />
                <Bar dataKey="Value" fill="#f43f5e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 6. Risk Evidence Strength Bar Chart
    if (type === 'RISK_EVIDENCE_BAR') {
      return (
        <div className="mt-3 pt-3 border-t border-[#1e2333] bg-[#090a0f]/60 p-3 rounded border border-[#1e2333]">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono text-slate-400 uppercase">
            <AlertTriangle className="h-3 w-3 text-rose-400" />
            <span>{title}</span>
          </div>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 2, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e2333" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis type="category" dataKey="risk" stroke="#64748b" fontSize={9} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#10121a', borderColor: '#282f44', borderRadius: '4px', fontSize: '10px' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Financial Exposure']}
                />
                <Bar dataKey="Exposure" fill="#ef4444" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-[#10121a] rounded-lg border border-[#1e2333] flex flex-col h-[650px] overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3 border-b border-[#1e2333] bg-[#141722] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
            Ask Skylark Intelligence
          </h2>
          <p className="text-[11px] text-slate-500">Business intelligence grounded strictly in Deals & Work Orders tracker records</p>
        </div>
        <div className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-[#090a0f] border border-[#1e2333] flex items-center gap-1">
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
          <span>Evidence-First Grounding</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-md px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1e2333] text-slate-100 border border-[#282f44]'
                  : 'bg-[#141722] border border-[#1e2333] text-slate-200'
              }`}
            >
              {/* Message Header for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="text-[10px] text-slate-500 font-mono mb-2 pb-1.5 border-b border-[#1e2333] flex items-center justify-between">
                  <span className="text-sky-400 font-semibold">SKYLARK INTELLIGENCE</span>
                  <span>{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                {msg.text}
              </div>

              {/* Contextual Visual Chart if relevant */}
              {renderContextualChart(msg)}

              {/* Clarification Options */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1e2333] space-y-1.5">
                  <div className="text-amber-400 font-medium text-[11px] flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Select a focus area to refine analysis:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {msg.clarificationOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectSuggested(opt)}
                        className="text-left px-2.5 py-1.5 rounded bg-[#090a0f] hover:bg-[#1a1e2d] border border-[#1e2333] text-sky-300 text-[11px] transition-colors flex items-center justify-between group"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="h-3 w-3 text-slate-500 group-hover:text-sky-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Quality Caveats */}
              {msg.dataQualityNotes && msg.dataQualityNotes.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[#1e2333] text-[10px] text-amber-300/80 space-y-0.5">
                  <span className="font-medium text-amber-400">Data Quality Caveats:</span>
                  {msg.dataQualityNotes.map((note, idx) => (
                    <p key={idx} className="leading-normal">• {note}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-[#141722] rounded border border-[#1e2333] max-w-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
            <span className="text-[11px]">Analyzing dataset evidence & computing metrics…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Compact Chips */}
      <div className="px-4 py-2 border-t border-[#1e2333] bg-[#090a0f] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0 mr-1">Suggested:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggested(prompt)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#141722] hover:bg-[#1a1e2d] text-slate-300 hover:text-slate-100 border border-[#1e2333] shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Executive Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#1e2333] bg-[#141722]">
        <div className="flex items-center gap-2 bg-[#090a0f] border border-[#1e2333] focus-within:border-sky-700 rounded-md px-3 py-1.5 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pipeline, execution, risk, or data quality..."
            disabled={loading}
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-1 rounded text-slate-400 hover:text-sky-400 disabled:opacity-30 transition-colors"
            title="Send query"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
