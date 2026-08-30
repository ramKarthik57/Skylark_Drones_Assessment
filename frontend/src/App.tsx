import { useState, useEffect } from 'react';
import { 
  MessageSquarePlus, 
  Database, 
  Info, 
  Sparkles,
  FileText,
  ChevronRight
} from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { LeadershipModal } from './components/LeadershipModal';
import { DataLineageModal } from './components/DataLineageModal';
import { fetchBoardStatus, sendChatMessage, fetchLeadershipUpdate, generateLocalChatResponse } from './services/api';
import type { BoardStatus, BIData, ChatMessage, LeadershipUpdate, DataTrust } from './types';

export function App() {
  const [activeNav, setActiveNav] = useState<'chat' | 'data' | 'about'>('chat');
  const [boardStatus, setBoardStatus] = useState<BoardStatus | null>(null);
  const [biData, setBIData] = useState<BIData | null>(null);
  const [dataTrust, setDataTrust] = useState<DataTrust | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [leadershipModalOpen, setLeadershipModalOpen] = useState(false);
  const [leadershipData, setLeadershipData] = useState<LeadershipUpdate | null>(null);
  const [leadershipLoading, setLeadershipLoading] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);
  const [selectedLineageInfo, setSelectedLineageInfo] = useState<any>(null);

  // Load initial board status and conversation setup
  const loadStatusAndInitialData = async () => {
    setLoading(true);
    try {
      const status = await fetchBoardStatus();
      setBoardStatus(status);
      if (status.data_trust) setDataTrust(status.data_trust);

      // Perform initial query for baseline metrics
      const initRes = await sendChatMessage('How is our pipeline looking this quarter?');
      if (initRes.bi_data) setBIData(initRes.bi_data);
      if (initRes.data_trust) setDataTrust(initRes.data_trust);

      const isLive = status.connected_live_monday && !status.is_mock_data;
      const welcomeSource = isLive
        ? "Connected live to Monday.com Deals & Work Orders boards."
        : "Reconciled against the canonical Monday.com dataset snapshot.";

      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Welcome to **Skylark Executive Intelligence**.\n\n${welcomeSource}\n\nAsk me any question regarding active commercial pipeline, forecast calculations, sector performance, work order execution status, or data quality caveats.`,
          timestamp: new Date().toLocaleTimeString(),
          biData: initRes.bi_data,
          dataQualityNotes: initRes.data_quality_notes
        }
      ]);
    } catch (err) {
      console.error('Error loading initial board status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatusAndInitialData();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (activeNav !== 'chat') {
      setActiveNav('chat');
    }
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage(text);
      if (res.bi_data) setBIData(res.bi_data);
      if (res.data_trust) setDataTrust(res.data_trust);

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString(),
        intent: res.intent,
        operation: res.operation,
        entity: res.entity,
        granularity: res.granularity,
        visualization: res.visualization,
        biData: res.bi_data,
        riskRadar: res.risk_radar,
        dataTrust: res.data_trust,
        dataQualityNotes: res.data_quality_notes,
        clarificationOptions: res.clarification_needed ? res.clarification_options : undefined,
        suggestedQuestions: res.suggested_questions
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error in chat request, generating offline response:', err);
      const fallbackRes = generateLocalChatResponse(text);
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackRes.text,
        timestamp: new Date().toLocaleTimeString(),
        intent: fallbackRes.intent,
        visualization: fallbackRes.visualization,
        biData: fallbackRes.bi_data,
        riskRadar: fallbackRes.risk_radar,
        dataTrust: fallbackRes.data_trust,
        dataQualityNotes: fallbackRes.data_quality_notes,
        clarificationOptions: fallbackRes.clarification_needed ? fallbackRes.clarification_options : undefined,
        suggestedQuestions: fallbackRes.suggested_questions
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveNav('chat');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "New session started. How can I assist you with Skylark's pipeline, revenue forecast, or operational work orders today?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleOpenLeadership = async () => {
    setLeadershipModalOpen(true);
    setLeadershipLoading(true);
    try {
      const data = await fetchLeadershipUpdate();
      setLeadershipData(data);
    } catch (err) {
      console.error('Error generating leadership update:', err);
    } finally {
      setLeadershipLoading(false);
    }
  };

  const handleOpenLineage = (metricName: string) => {
    let info = {
      metricName,
      sourceDataset: 'Deals Funnel Dataset (344 Total Valid Records)',
      filterApplied: 'deal_status = "Open"',
      recordsConsidered: '50 Records (Including 1 Tanjiro normalized record)',
      formula: 'Σ (deal_value)',
      resultValue: '₹68.82 Cr',
      qualityCaveat: '49 of 50 open deals lack tentative close dates; 47 open deals have explicit probabilities (94.0%).'
    };

    if (metricName.includes('WEIGHTED') || metricName.includes('FORECAST')) {
      info = {
        metricName: 'Weighted Risk-Adjusted Forecast',
        sourceDataset: 'Deals Funnel Dataset (344 Total Valid Records)',
        filterApplied: 'deal_status = "Open"',
        recordsConsidered: '50 Open Deals (47 Rated: 18 High, 18 Med, 11 Low + 3 Baseline)',
        formula: '∑ (Deal Value × Explicit Win Probability) + ∑ (Deal Value × 30% Modeling Baseline)',
        resultValue: '₹26.46 Cr',
        qualityCaveat: 'Explicit probabilities applied: High 80%, Medium 50%, Low 20%. Unrated deals (Sasuke, Krillin, Tanjiro) use 30% baseline.'
      };
    }

    setSelectedLineageInfo(info);
    setLineageModalOpen(true);
  };

  return (
    <div className="h-screen w-full bg-[#0b0d13] text-slate-100 flex overflow-hidden font-sans">
      {/* 1. Skylark Conversational Workspace Left Sidebar */}
      <aside className="w-64 bg-[#0e1118] border-r border-[#1a1f2c] flex flex-col justify-between shrink-0 select-none">
        {/* Brand & New Chat */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs tracking-wider">
                SK
              </div>
              <div>
                <h1 className="text-xs font-semibold text-slate-100 tracking-tight">Skylark</h1>
                <p className="text-[10px] text-slate-500 font-mono">Executive Intelligence</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#151924] hover:bg-[#1c2230] border border-[#232a3b] text-slate-200 hover:text-white text-xs font-medium transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="h-3.5 w-3.5 text-sky-400" />
              <span>New Analysis</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">⌘N</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 py-1.5">
            Workspace
          </div>

          <button
            onClick={() => setActiveNav('chat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              activeNav === 'chat'
                ? 'bg-[#181d2a] text-slate-100 border border-[#262f45]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121520]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Conversational BI</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNav('data')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              activeNav === 'data'
                ? 'bg-[#181d2a] text-slate-100 border border-[#262f45]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121520]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Data & Governance</span>
            </div>
            {boardStatus && (
              <span className="text-[10px] font-mono text-slate-500">{boardStatus.deals_count + boardStatus.work_orders_count} rows</span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('about')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              activeNav === 'about'
                ? 'bg-[#181d2a] text-slate-100 border border-[#262f45]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121520]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span>System & Methodology</span>
            </div>
          </button>

          {/* Quick Leadership Brief Command */}
          <div className="pt-4 mt-2 border-t border-[#1a1f2c]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-3 py-1.5">
              Actions
            </div>
            <button
              onClick={handleOpenLeadership}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-[#121520] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>Executive Briefing</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Source Connection Badge */}
        <div className="p-3 border-t border-[#1a1f2c] bg-[#0b0d13]/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Monday.com</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'Live API' : 'Snapshot'}
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Experience */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Minimal Bar */}
        <header className="h-12 border-b border-[#1a1f2c] bg-[#0b0d13] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-medium text-slate-200">
              {activeNav === 'chat' && 'Executive Decision Intelligence'}
              {activeNav === 'data' && 'Reconciled Data & Provenance'}
              {activeNav === 'about' && 'System Architecture & Mathematical Derivations'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            {biData && (
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <div>Pipeline: <span className="text-slate-200 font-semibold">₹68.82 Cr</span></div>
                <div>Weighted: <span className="text-sky-400 font-semibold">₹26.46 Cr</span></div>
                <div>WOs: <span className="text-slate-200 font-semibold">58 Active</span></div>
              </div>
            )}
          </div>
        </header>

        {/* View Switcher */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col">
          {activeNav === 'chat' && (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              onSelectSuggested={handleSendMessage}
            />
          )}

          {activeNav === 'data' && (
            <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-[#10131c] rounded-lg p-5 border border-[#1a1f2c]">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Dataset Architecture & Audit Summary
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Skylark Executive Intelligence operates on two primary boards from Monday.com: the <strong>Deals Funnel</strong> (344 total records, 50 open deals) and the <strong>Work Orders Tracker</strong> (175 total records, 58 active projects).
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#0b0d13] rounded border border-[#1a1f2c]">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Total Deals</div>
                    <div className="text-sm font-bold text-slate-100 mt-0.5">344 Records</div>
                    <div className="text-[10px] text-slate-400 mt-1">50 Open • 163 Won • 127 Dead</div>
                  </div>
                  <div className="p-3 bg-[#0b0d13] rounded border border-[#1a1f2c]">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Total Work Orders</div>
                    <div className="text-sm font-bold text-slate-100 mt-0.5">175 Records</div>
                    <div className="text-[10px] text-slate-400 mt-1">117 Completed • 53 Ongoing • 5 Delayed</div>
                  </div>
                  <div className="p-3 bg-[#0b0d13] rounded border border-[#1a1f2c]">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Cross-Board Match Rate</div>
                    <div className="text-sm font-bold text-sky-400 mt-0.5">89.7% Linked</div>
                    <div className="text-[10px] text-slate-400 mt-1">52 of 58 deal names verified 1:1</div>
                  </div>
                </div>
              </div>

              {/* Data Trust & Quality Dimensions */}
              {dataTrust && (
                <div className="bg-[#10131c] rounded-lg p-5 border border-[#1a1f2c] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Data Trust & Governance Dimensions
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400">{dataTrust.overall_confidence}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataTrust.dimensions.map((dim, idx) => (
                      <div key={idx} className="p-3 bg-[#0b0d13] rounded border border-[#1a1f2c]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-300">{dim.name}</span>
                          <span className="text-xs font-mono font-bold text-sky-400">{dim.score}%</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{dim.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeNav === 'about' && (
            <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-[#10131c] rounded-lg p-5 border border-[#1a1f2c] space-y-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  About Skylark Executive Intelligence
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This system was designed as a production-grade Executive Decision Intelligence agent for Skylark Drones. It transforms messy, unnormalized CRM and operational project tracker exports into deterministic executive intelligence without arithmetic hallucination.
                </p>
                <div className="pt-2 text-xs text-slate-400 space-y-2">
                  <p>• <strong>Deterministic Grounding:</strong> The LLM synthesizes natural language, but arithmetic, rankings, and filters are calculated deterministically by the BI engine.</p>
                  <p>• <strong>Messy Data Resilience:</strong> Automatically normalizes erratic dates, currency typos, duplicate names, and missing close dates.</p>
                  <p>• <strong>Evidence-First Philosophy:</strong> Every claim clearly distinguishes source facts, derived metrics, modeling assumptions, and dataset limitations.</p>
                </div>
              </div>

              <div className="bg-[#10131c] rounded-lg p-5 border border-[#1a1f2c] space-y-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Mathematical Formulas & Ground Truth
                </h3>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div 
                    onClick={() => handleOpenLineage('Weighted Risk-Adjusted Forecast')}
                    className="p-2.5 bg-[#0b0d13] hover:bg-[#141824] cursor-pointer rounded border border-[#1a1f2c] transition-colors"
                  >
                    <div className="text-slate-500 text-[10px] uppercase flex items-center justify-between">
                      <span>Weighted Forecast</span>
                      <span className="text-sky-400 font-sans text-[10px]">Inspect Lineage →</span>
                    </div>
                    <div className="mt-1">Weighted Forecast = ∑ (Deal Value × Probability)</div>
                    <div className="text-[11px] text-slate-400 mt-1">High (80%): ₹13.35 Cr + Low (20%): ₹8.39 Cr + Med (50%): ₹4.16 Cr + Baseline (30%): ₹0.56 Cr = ₹26.46 Cr</div>
                  </div>
                  <div className="p-2.5 bg-[#0b0d13] rounded border border-[#1a1f2c]">
                    <div className="text-slate-500 text-[10px] uppercase">Billing Realization Rate</div>
                    <div className="mt-1">Realization = (Billed Value / Contract Value) × 100</div>
                    <div className="text-[11px] text-slate-400 mt-1">₹10.74 Cr Billed / ₹21.06 Cr Contracted = 51.0% Realization</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leadership Update Modal */}
      <LeadershipModal
        isOpen={leadershipModalOpen}
        onClose={() => setLeadershipModalOpen(false)}
        updateData={leadershipData}
        loading={leadershipLoading}
      />

      {/* Metric Data Lineage Audit Modal */}
      <DataLineageModal
        isOpen={lineageModalOpen}
        onClose={() => setLineageModalOpen(false)}
        info={selectedLineageInfo}
      />
    </div>
  );
}

export default App;

