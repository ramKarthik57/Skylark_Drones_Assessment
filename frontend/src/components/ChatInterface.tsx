import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowRight } from 'lucide-react';
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
    "How many active & delayed work orders do we have?",
    "What should leadership focus on this week?",
    "What are our biggest risks?"
  ];

  return (
    <div className="bg-[#10121a] rounded-lg border border-[#1e2333] flex flex-col h-[650px] overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3 border-b border-[#1e2333] bg-[#141722] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
            Ask Skylark
          </h2>
          <p className="text-[11px] text-slate-500">Business intelligence grounded strictly in Deals & Work Orders tracker records</p>
        </div>
        <div className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-[#090a0f] border border-[#1e2333]">
          Evidence-First Routing
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
                  <span>SKYLARK INTELLIGENCE</span>
                  <span>{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                {msg.text}
              </div>

              {/* Clarification Options */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1e2333] space-y-1.5">
                  <div className="text-amber-400 font-medium text-[11px]">
                    Select a focus area to refine analysis:
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
