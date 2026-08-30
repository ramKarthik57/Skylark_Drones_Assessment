import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
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
    "Are we selling faster than we can execute?",
    "How are we doing?"
  ];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[650px] shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide uppercase">Conversational BI Assistant</h2>
            <p className="text-[10px] text-slate-400">Ask natural language business questions</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/40">
          <Sparkles className="h-3 w-3" />
          <span>Intent & Entity Router Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              {/* Clarification Options */}
              {msg.clarificationOptions && msg.clarificationOptions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Please choose a focus area to refine analysis:</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {msg.clarificationOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectSuggested(opt)}
                        className="text-left px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/60 hover:border-cyan-500/40 border border-slate-700 text-cyan-300 text-[11px] transition-all flex items-center justify-between group"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Quality Caveats in Message */}
              {msg.dataQualityNotes && msg.dataQualityNotes.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-amber-300/90 space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Data Quality Notes:
                  </div>
                  {msg.dataQualityNotes.map((note, idx) => (
                    <p key={idx}>• {note}</p>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs italic animate-pulse">
            <div className="h-8 w-8 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <span>Querying Monday.com GraphQL API & computing BI analytics...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Examples:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggested(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-900/90 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about sales pipeline, work orders, sector revenue, or risks..."
          disabled={loading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
