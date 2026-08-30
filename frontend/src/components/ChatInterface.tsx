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

    // Strict Data Consistency Assertion: Verify chart data points appear in msg.text
    if (Array.isArray(data) && data.length > 0) {
      const textLower = msg.text.toLowerCase();
      // Check if primary entities exist in text (e.g. for opportunity bars, verify deal name is in text)
      if (type === 'TOP_OPPORTUNITY_BAR') {
        const topEntity = String(data[0]?.name || '').toLowerCase();
        if (topEntity && !textLower.includes(topEntity) && !textLower.includes(topEntity.split(' ')[0])) {
          console.warn(`[BI Data Integrity] Visualization entity '${data[0]?.name}' not found in narrative text. Suppressing chart to prevent hallucination mismatch.`);
          return null;
        }
      }
    }

    // 1. Top Opportunity / Forecast Exposure Horizontal/Vertical Bar Chart
    if (type === 'TOP_OPPORTUNITY_BAR') {
      return (
        <div className="mt-5 pt-4 border-t border-[#e5e2d8] bg-[#f4f2eb] p-5 rounded-2xl border border-[#dcd7cb] shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#191919]">
            <BarChart2 className="h-4 w-4 text-[#007a5a]" />
            <span className="font-bold">{title}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e2d8" vertical={false} />
                <XAxis dataKey="name" stroke="#8c8577" fontSize={11} tickLine={false} />
                <YAxis stroke="#8c8577" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dcd7cb', borderRadius: '8px', fontSize: '12px', color: '#191919' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Value / Forecast Contribution']}
                />
                <Bar dataKey="Value" fill="#007a5a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 2. Forecast Derivation Waterfall
    if (type === 'FORECAST_WATERFALL') {
      return (
        <div className="mt-5 pt-4 border-t border-[#e5e2d8] bg-[#f4f2eb] p-5 rounded-2xl border border-[#dcd7cb] shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#191919]">
            <BarChart2 className="h-4 w-4 text-[#007a5a]" />
            <span className="font-bold">{title}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e2d8" vertical={false} />
                <XAxis dataKey="category" stroke="#8c8577" fontSize={11} tickLine={false} />
                <YAxis stroke="#8c8577" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dcd7cb', borderRadius: '8px', fontSize: '12px', color: '#191919' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Contribution']}
                />
                <Bar dataKey="Contribution" fill="#007a5a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 3. Multi-Dimension Sector Comparison Chart
    if (type === 'SECTOR_COMPARISON') {
      return (
        <div className="mt-5 pt-4 border-t border-[#e5e2d8] bg-[#f4f2eb] p-5 rounded-2xl border border-[#dcd7cb] shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#191919]">
            <BarChart2 className="h-4 w-4 text-[#007a5a]" />
            <span className="font-bold">{title}</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e2d8" vertical={false} />
                <XAxis dataKey="sector" stroke="#8c8577" fontSize={11} tickLine={false} />
                <YAxis stroke="#8c8577" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dcd7cb', borderRadius: '8px', fontSize: '12px', color: '#191919' }}
                  formatter={(val: any, name: any) => [`₹${val} Cr`, name]}
                />
                <Bar dataKey="Pipeline" fill="#191919" name="Pipeline" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Billed" fill="#007a5a" name="Billed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 4. Work Order Execution Status Donut
    if (type === 'EXECUTION_STATUS_DONUT') {
      return (
        <div className="mt-5 pt-4 border-t border-[#e5e2d8] bg-[#f4f2eb] p-5 rounded-2xl border border-[#dcd7cb] shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#191919] mb-2.5">
              <ShieldCheck className="h-4 w-4 text-[#007a5a]" />
              <span className="font-bold">{title}</span>
            </div>
            <div className="text-xs text-[#595959] space-y-1.5 font-medium">
              {data.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                  <strong className="text-[#191919]">{item.value}</strong>
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
        <div className="mt-5 pt-4 border-t border-[#e5e2d8] bg-[#f4f2eb] p-5 rounded-2xl border border-[#dcd7cb] shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#191919]">
            <BarChart2 className="h-4 w-4 text-[#d97706]" />
            <span className="font-bold">{title}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 15, left: -15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e2d8" vertical={false} />
                <XAxis dataKey="name" stroke="#8c8577" fontSize={11} tickLine={false} />
                <YAxis stroke="#8c8577" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dcd7cb', borderRadius: '8px', fontSize: '12px', color: '#191919' }}
                  formatter={(val: any, name: any) => [name === 'Share' ? `${val}%` : `₹${val} Cr`, name]}
                />
                <Bar dataKey="Value" fill="#007a5a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    // 6. Risk Evidence Strength Bar Chart
    if (type === 'RISK_EVIDENCE_BAR') {
      return (
        <div className="mt-5 pt-4 border-t border-[#e5e2d8] bg-[#f4f2eb] p-5 rounded-2xl border border-[#dcd7cb] shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#191919]">
            <AlertTriangle className="h-4 w-4 text-[#d97706]" />
            <span className="font-bold">{title}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 15, left: 15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e5e2d8" horizontal={false} />
                <XAxis type="number" stroke="#8c8577" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="risk" stroke="#191919" fontSize={11} tickLine={false} width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dcd7cb', borderRadius: '8px', fontSize: '12px', color: '#191919' }}
                  formatter={(val: any) => [`₹${val} Cr`, 'Financial Exposure']}
                />
                <Bar dataKey="Exposure" fill="#d97706" radius={[0, 3, 3, 0]} />
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
      <div className="flex-1 overflow-y-auto px-2 md:px-6 py-6 space-y-7 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[94%] md:max-w-[88%] rounded-2xl px-7 py-6 text-sm leading-relaxed transition-all ${
                msg.sender === 'user'
                  ? 'bg-[#191919] text-[#ffffff] ml-12 shadow-sm font-medium'
                  : 'bg-[#ffffff] border border-[#e5e2d8] text-[#191919] mr-6 shadow-xs'
              }`}
            >
              {/* Message Header for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="text-[11px] text-[#737373] font-mono mb-3 pb-2.5 border-b border-[#f4f2eb] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#007a5a] font-bold tracking-wide">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>SKYLARK ANALYST</span>
                  </div>
                  <span className="text-[10px] text-[#8c8577]">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content (Clean Editorial Format) */}
              <div className="whitespace-pre-wrap font-sans text-[15px] space-y-3 leading-relaxed text-[#262626]">
                {msg.text}
              </div>

              {/* Contextual Visual Chart */}
              {renderContextualChart(msg)}

              {/* Clarification Refinements */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#e5e2d8] space-y-2">
                  <div className="text-[#007a5a] font-bold text-xs flex items-center gap-1.5 font-mono">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Select a dimension to refine the analysis:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.clarificationOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectSuggested(opt)}
                        className="text-left px-4 py-2.5 rounded-lg bg-[#f4f2eb] hover:bg-[#eae7dc] border border-[#dcd7cb] text-[#191919] text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#737373] group-hover:text-[#191919] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Data Quality & Evidence Drawer */}
              {msg.dataQualityNotes && msg.dataQualityNotes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#e5e2d8]">
                  <button
                    onClick={() => toggleCaveat(msg.id)}
                    className="flex items-center gap-1.5 text-[11px] font-mono text-[#737373] hover:text-[#191919] transition-colors cursor-pointer"
                  >
                    <span>Dataset Caveats ({msg.dataQualityNotes.length})</span>
                    {expandedCaveats[msg.id] ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>

                  {expandedCaveats[msg.id] && (
                    <div className="mt-2.5 p-3.5 bg-[#f4f2eb] rounded-lg border border-[#e5e2d8] text-xs text-[#595959] space-y-1.5">
                      {msg.dataQualityNotes.map((note, idx) => (
                        <p key={idx} className="leading-relaxed text-[11px] text-amber-900 font-mono">• {note}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-[#595959] text-xs py-3 px-4 bg-[#ffffff] rounded-xl border border-[#e5e2d8] max-w-sm shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#007a5a] animate-ping" />
            <span className="text-xs font-medium">Analyzing board evidence & computing ground truth…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Horizontal Scroller */}
      <div className="px-2 md:px-0 py-3 border-t border-[#e5e2d8] bg-[#faf9f6] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-[#737373] uppercase font-mono font-bold shrink-0">Explore:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggested(prompt)}
            className="text-xs px-3.5 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#eae7dc] text-[#404040] hover:text-[#191919] border border-[#dcd7cb] shrink-0 transition-all font-medium cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Modern Conversational Input Box */}
      <div className="p-2 md:p-0 pt-2 border-t border-[#e5e2d8] bg-[#faf9f6]">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-[#ffffff] border border-[#dcd7cb] focus-within:border-[#007a5a] focus-within:ring-2 focus-within:ring-[#007a5a]/20 rounded-2xl px-5 py-4 transition-all shadow-xs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Skylark about pipeline health, weighted forecast, work orders, or risks..."
              disabled={loading}
              className="flex-1 bg-transparent text-sm text-[#191919] placeholder-[#8c8577] focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="ml-3 p-2 rounded-xl bg-[#007a5a] hover:bg-[#006046] text-white disabled:opacity-20 transition-all shadow-xs cursor-pointer"
              title="Send question"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-[#8c8577] font-mono py-2">
          Grounded strictly in Monday.com Deals (344) & Work Orders (175) records
        </p>
      </div>
    </div>
  );
};

