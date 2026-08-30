import { useState, useEffect } from 'react';
import { 
  MessageSquarePlus, 
  LayoutDashboard,
  Database, 
  Info, 
  Sparkles,
  FileText,
  ChevronRight,
  ShieldAlert,
  CheckSquare,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { CommandCenterView } from './components/CommandCenterView';
import { RiskRadarView } from './components/RiskRadarView';
import { ActionCenterView } from './components/ActionCenterView';
import { DataTrustView } from './components/DataTrustView';
import { ScenarioModal } from './components/ScenarioModal';
import { LeadershipModal } from './components/LeadershipModal';
import { DataLineageModal } from './components/DataLineageModal';
import { fetchBoardStatus, sendChatMessage, fetchLeadershipUpdate, generateLocalChatResponse } from './services/api';
import type { BoardStatus, BIData, ChatMessage, LeadershipUpdate, RiskSignal, DataTrust } from './types';

export function App() {
  const [activeNav, setActiveNav] = useState<'overview' | 'chat' | 'risks' | 'actions' | 'trust' | 'data' | 'about'>('chat');
  const [boardStatus, setBoardStatus] = useState<BoardStatus | null>(null);
  const [biData, setBIData] = useState<BIData | null>(null);
  const [riskRadar, setRiskRadar] = useState<RiskSignal[]>([]);
  const [dataTrust, setDataTrust] = useState<DataTrust | null>(null);
  const [dataQualityNotes, setDataQualityNotes] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [leadershipModalOpen, setLeadershipModalOpen] = useState(false);
  const [leadershipData, setLeadershipData] = useState<LeadershipUpdate | null>(null);
  const [leadershipLoading, setLeadershipLoading] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);
  const [selectedLineageInfo, setSelectedLineageInfo] = useState<any>(null);

  // Load initial board status and conversation setup
  const loadStatusAndInitialData = async () => {
    setLoading(true);
    try {
      const status = await fetchBoardStatus();
      setBoardStatus(status);
      if (status.risk_radar) setRiskRadar(status.risk_radar);
      if (status.data_trust) setDataTrust(status.data_trust);

      // Perform initial query for baseline metrics
      const initRes = await sendChatMessage('How is our pipeline looking this quarter?');
      if (initRes.bi_data) setBIData(initRes.bi_data);
      if (initRes.risk_radar) setRiskRadar(initRes.risk_radar);
      if (initRes.data_trust) setDataTrust(initRes.data_trust);
      if (initRes.data_quality_notes) setDataQualityNotes(initRes.data_quality_notes);

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
    <div className="h-screen w-full bg-[#0b0517] text-[#f8fafc] flex overflow-hidden font-sans">
      {/* 1. Skylark Conversational Workspace Left Sidebar */}
      <aside className="w-64 bg-[#130a2a]/95 border-r border-[#2d1854] flex flex-col justify-between shrink-0 select-none backdrop-blur-xl">
        {/* Brand & New Chat */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-lg shadow-purple-900/40 border border-purple-400/30">
                SK
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Skylark</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-normal border border-purple-500/30">AI</span>
                </h1>
                <p className="text-[10px] text-purple-300/70 font-mono">Executive Intelligence</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/30 hover:border-purple-400 text-white text-xs font-semibold transition-all shadow-md shadow-purple-950/50 group"
          >
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4 text-purple-300 group-hover:text-white transition-colors" />
              <span>New Analysis</span>
            </div>
            <span className="text-[10px] text-purple-300/80 font-mono bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700/50">⌘N</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] uppercase font-mono tracking-wider text-purple-300/60 px-3 py-1.5 font-semibold">
            Intelligence Suite
          </div>

          <button
            onClick={() => setActiveNav('overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'overview'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4 text-purple-400" />
              <span>Executive Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNav('chat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'chat'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-fuchsia-400" />
              <span>Conversational BI</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">Agent</span>
          </button>

          <button
            onClick={() => setActiveNav('risks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'risks'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Risk Radar</span>
            </div>
            {riskRadar.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/60">
                {riskRadar.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('actions')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'actions'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="h-4 w-4 text-emerald-400" />
              <span>Action Directives</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
              3 Directives
            </span>
          </button>

          <button
            onClick={() => setActiveNav('trust')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'trust'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>Data Trust Center</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNav('data')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'data'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="h-4 w-4 text-indigo-300" />
              <span>Data Governance</span>
            </div>
            {boardStatus && (
              <span className="text-[10px] font-mono text-purple-300/80">{boardStatus.deals_count + boardStatus.work_orders_count} rows</span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('about')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === 'about'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white border border-purple-500/50 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-purple-300" />
              <span>Formulas & Methodology</span>
            </div>
          </button>

          {/* Quick Leadership Brief & Scenario Lab Commands */}
          <div className="pt-3 mt-2 border-t border-[#2d1854] space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-purple-300/60 px-3 py-1 font-semibold">
              Executive Modals
            </div>
            <button
              onClick={() => setScenarioModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-purple-200 hover:text-white hover:bg-purple-950/60 border border-purple-800/40 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="h-3.5 w-3.5 text-fuchsia-400" />
                <span>Scenario Simulation</span>
              </div>
              <ChevronRight className="h-3 w-3 text-purple-400" />
            </button>
            <button
              onClick={handleOpenLeadership}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-purple-200 hover:text-white hover:bg-purple-950/60 border border-purple-800/40 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>Executive Briefing</span>
              </div>
              <ChevronRight className="h-3 w-3 text-purple-400" />
            </button>
          </div>
        </div>

        {/* Source Connection Badge */}
        <div className="p-3.5 border-t border-[#2d1854] bg-[#0d061f]/80">
          <div className="flex items-center justify-between text-[11px] text-purple-200">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400 shadow-sm shadow-amber-400/50'}`} />
              <span className="font-medium">{boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'Live Monday.com' : 'Assignment dataset snapshot'}</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300/80 bg-purple-950/90 px-1.5 py-0.5 rounded border border-purple-800/60">
              {boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'Live API' : 'Reconciled'}
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Experience */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0b0517]">
        {/* Top Minimal Bar */}
        <header className="h-14 border-b border-[#2d1854] bg-[#130a2a]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xs md:text-sm font-semibold text-white tracking-tight">
              {activeNav === 'overview' && 'Executive Overview & Reconciled Metrics'}
              {activeNav === 'chat' && 'Executive Decision Intelligence'}
              {activeNav === 'risks' && 'Executive Risk Radar & Vulnerability Assessment'}
              {activeNav === 'actions' && 'Action Center: Priority Recovery Directives'}
              {activeNav === 'trust' && 'Data Trust & Completeness Center'}
              {activeNav === 'data' && 'Reconciled Data & Provenance'}
              {activeNav === 'about' && 'System Architecture & Mathematical Derivations'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-purple-200">
            {biData && (
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">Pipeline: <span className="text-white font-bold">₹68.82 Cr</span></div>
                <div className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">Weighted: <span className="text-amber-400 font-bold">₹26.46 Cr</span></div>
                <div className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800/50">WOs: <span className="text-emerald-400 font-bold">58 Active</span></div>
              </div>
            )}
          </div>
        </header>

        {/* View Switcher */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col">
          {activeNav === 'overview' && (
            <div className="flex-1 overflow-y-auto">
              <CommandCenterView
                biData={biData}
                riskRadar={riskRadar}
                dataQualityNotes={dataQualityNotes}
                onNavigateToAskAI={(q) => {
                  setActiveNav('chat');
                  if (q) handleSendMessage(q);
                }}
                onOpenLineage={handleOpenLineage}
              />
            </div>
          )}

          {activeNav === 'chat' && (
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              onSelectSuggested={handleSendMessage}
            />
          )}

          {activeNav === 'risks' && (
            <div className="flex-1 overflow-y-auto">
              <RiskRadarView
                riskRadar={riskRadar}
                onNavigateToAskAI={(q) => {
                  setActiveNav('chat');
                  if (q) handleSendMessage(q);
                }}
              />
            </div>
          )}

          {activeNav === 'actions' && (
            <div className="flex-1 overflow-y-auto">
              <ActionCenterView />
            </div>
          )}

          {activeNav === 'trust' && (
            <div className="flex-1 overflow-y-auto">
              <DataTrustView dataTrust={dataTrust} />
            </div>
          )}

          {activeNav === 'data' && (
            <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] shadow-xl shadow-purple-950/30">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Dataset Architecture & Audit Summary
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Skylark Executive Intelligence operates on two primary boards from Monday.com: the <strong>Deals Funnel</strong> (344 total records, 50 open deals) and the <strong>Work Orders Tracker</strong> (175 total records, 58 active projects).
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-[#130a2a] rounded-xl border border-[#2d1854]">
                    <div className="text-[10px] text-purple-300/70 uppercase font-mono">Total Deals</div>
                    <div className="text-base font-bold text-white mt-0.5">344 Records</div>
                    <div className="text-[11px] text-purple-300/80 mt-1">50 Open • 163 Won • 127 Dead</div>
                  </div>
                  <div className="p-4 bg-[#130a2a] rounded-xl border border-[#2d1854]">
                    <div className="text-[10px] text-purple-300/70 uppercase font-mono">Total Work Orders</div>
                    <div className="text-base font-bold text-white mt-0.5">175 Records</div>
                    <div className="text-[11px] text-purple-300/80 mt-1">117 Completed • 53 Ongoing • 5 Delayed</div>
                  </div>
                  <div className="p-4 bg-[#130a2a] rounded-xl border border-[#2d1854]">
                    <div className="text-[10px] text-purple-300/70 uppercase font-mono">Cross-Board Match Rate</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">89.7% Linked</div>
                    <div className="text-[11px] text-purple-300/80 mt-1">52 of 58 deal names verified 1:1</div>
                  </div>
                </div>
              </div>

              {/* Data Trust & Quality Dimensions */}
              {dataTrust && (
                <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] space-y-4 shadow-xl shadow-purple-950/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Data Trust & Governance Dimensions
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">{dataTrust.overall_confidence}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataTrust.dimensions.map((dim, idx) => (
                      <div key={idx} className="p-4 bg-[#130a2a] rounded-xl border border-[#2d1854]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-200">{dim.name}</span>
                          <span className="text-xs font-mono font-bold text-purple-300">{dim.score}%</span>
                        </div>
                        <p className="text-[11px] text-purple-300/70">{dim.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeNav === 'about' && (
            <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] space-y-3 shadow-xl shadow-purple-950/30">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  About Skylark Executive Intelligence
                </h3>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  This system was designed as a production-grade Executive Decision Intelligence agent for Skylark Drones. It transforms messy, unnormalized CRM and operational project tracker exports into deterministic executive intelligence without arithmetic hallucination.
                </p>
                <div className="pt-2 text-xs text-purple-300/80 space-y-2">
                  <p>• <strong>Deterministic Grounding:</strong> The LLM synthesizes natural language, but arithmetic, rankings, and filters are calculated deterministically by the BI engine.</p>
                  <p>• <strong>Messy Data Resilience:</strong> Automatically normalizes erratic dates, currency typos, duplicate names, and missing close dates.</p>
                  <p>• <strong>Evidence-First Philosophy:</strong> Every claim clearly distinguishes source facts, derived metrics, modeling assumptions, and dataset limitations.</p>
                </div>
              </div>

              <div className="bg-[#1a0e38] rounded-2xl p-6 border border-[#2d1854] space-y-3 shadow-xl shadow-purple-950/30">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Mathematical Formulas & Ground Truth
                </h3>
                <div className="space-y-2 text-xs font-mono text-purple-200">
                  <div 
                    onClick={() => handleOpenLineage('Weighted Risk-Adjusted Forecast')}
                    className="p-3.5 bg-[#130a2a] hover:bg-[#24134d] cursor-pointer rounded-xl border border-[#2d1854] transition-colors"
                  >
                    <div className="text-purple-400 text-[10px] uppercase flex items-center justify-between">
                      <span>Weighted Forecast</span>
                      <span className="text-amber-400 font-sans text-[10px]">Inspect Lineage →</span>
                    </div>
                    <div className="mt-1 font-bold text-white">Weighted Forecast = ∑ (Deal Value × Probability)</div>
                    <div className="text-[11px] text-purple-300/70 mt-1">High (80%): ₹13.35 Cr + Low (20%): ₹8.39 Cr + Med (50%): ₹4.16 Cr + Baseline (30%): ₹0.56 Cr = ₹26.46 Cr</div>
                  </div>
                  <div className="p-3.5 bg-[#130a2a] rounded-xl border border-[#2d1854]">
                    <div className="text-purple-400 text-[10px] uppercase">Billing Realization Rate</div>
                    <div className="mt-1 font-bold text-white">Realization = (Billed Value / Contract Value) × 100</div>
                    <div className="text-[11px] text-purple-300/70 mt-1">₹10.74 Cr Billed / ₹21.06 Cr Contracted = 51.0% Realization</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Lab Modal */}
      <ScenarioModal
        isOpen={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
      />

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

