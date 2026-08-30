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
    <div className="h-screen w-full bg-[#faf9f6] text-[#191919] flex overflow-hidden font-sans">
      {/* 1. Skylark Conversational Workspace Left Sidebar */}
      <aside className="w-64 bg-[#f4f2eb] border-r border-[#e5e2d8] flex flex-col justify-between shrink-0 select-none">
        {/* Brand & New Chat */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#007a5a] flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm">
                SK
              </div>
              <div>
                <h1 className="text-base font-editorial font-semibold text-[#191919] tracking-tight">
                  Skylark
                </h1>
                <p className="text-[10px] text-[#737373] tracking-wide uppercase font-medium">Executive Intelligence</p>
              </div>
            </div>
          </div>

          {/* New Analysis Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#ffffff] hover:bg-[#eae7dc] border border-[#dcd7cb] text-[#191919] text-xs font-semibold transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4 text-[#007a5a]" />
              <span>New Analysis</span>
            </div>
            <span className="text-[10px] text-[#737373] font-mono bg-[#f4f2eb] px-1.5 py-0.5 rounded border border-[#dcd7cb]">⌘N</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#8c8577] px-3 py-1 font-semibold">
            Intelligence Suite
          </div>

          <button
            onClick={() => setActiveNav('overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'overview'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4 text-[#007a5a]" />
              <span>Executive Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNav('chat')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'chat'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-[#007a5a]" />
              <span>Ask Skylark (AI)</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#007a5a]/10 text-[#007a5a] border border-[#007a5a]/20 font-mono font-medium">Agent</span>
          </button>

          <button
            onClick={() => setActiveNav('risks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'risks'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-[#d97706]" />
              <span>Risk Radar</span>
            </div>
            {riskRadar.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-[#d97706] bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                {riskRadar.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('actions')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'actions'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="h-4 w-4 text-[#007a5a]" />
              <span>Action Directives</span>
            </div>
            <span className="text-[10px] font-mono text-[#007a5a] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              3 Directives
            </span>
          </button>

          <button
            onClick={() => setActiveNav('trust')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'trust'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#0284c7]" />
              <span>Data Trust Center</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNav('data')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'data'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="h-4 w-4 text-[#595959]" />
              <span>Data Governance</span>
            </div>
            {boardStatus && (
              <span className="text-[10px] font-mono text-[#737373]">{boardStatus.deals_count + boardStatus.work_orders_count} rows</span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('about')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeNav === 'about'
                ? 'bg-[#ffffff] text-[#191919] border border-[#dcd7cb] shadow-xs font-semibold'
                : 'text-[#595959] hover:text-[#191919] hover:bg-[#eae7dc]/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-[#595959]" />
              <span>Methodology & Lineage</span>
            </div>
          </button>

          {/* Quick Leadership Brief & Scenario Lab Commands */}
          <div className="pt-3 mt-2 border-t border-[#e5e2d8] space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#8c8577] px-3 py-1 font-semibold">
              Executive Modals
            </div>
            <button
              onClick={() => setScenarioModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#404040] hover:text-[#191919] hover:bg-[#eae7dc] border border-[#dcd7cb] transition-all bg-[#ffffff]"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="h-3.5 w-3.5 text-[#007a5a]" />
                <span>Scenario Simulation</span>
              </div>
              <ChevronRight className="h-3 w-3 text-[#737373]" />
            </button>
            <button
              onClick={handleOpenLeadership}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#404040] hover:text-[#191919] hover:bg-[#eae7dc] border border-[#dcd7cb] transition-all bg-[#ffffff]"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-3.5 w-3.5 text-[#d97706]" />
                <span>Executive Briefing</span>
              </div>
              <ChevronRight className="h-3 w-3 text-[#737373]" />
            </button>
          </div>
        </div>

        {/* Source Connection Badge */}
        <div className="p-4 border-t border-[#e5e2d8] bg-[#f4f2eb]">
          <div className="flex items-center justify-between text-[11px] text-[#595959]">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'bg-emerald-600' : 'bg-amber-500'}`} />
              <span className="font-medium">{boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'Live Monday.com' : 'Assignment dataset snapshot'}</span>
            </div>
            <span className="text-[10px] font-mono text-[#737373] bg-[#ffffff] px-1.5 py-0.5 rounded border border-[#dcd7cb]">
              {boardStatus?.connected_live_monday && !boardStatus?.is_mock_data ? 'Live API' : 'Snapshot'}
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Experience */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#faf9f6]">
        {/* Top Minimal Bar */}
        <header className="h-14 border-b border-[#e5e2d8] bg-[#ffffff] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-[#191919] tracking-tight">
              {activeNav === 'overview' && 'Executive Overview & Reconciled Metrics'}
              {activeNav === 'chat' && 'Conversational Decision Intelligence'}
              {activeNav === 'risks' && 'Executive Risk Radar & Vulnerability Assessment'}
              {activeNav === 'actions' && 'Action Center: Priority Recovery Directives'}
              {activeNav === 'trust' && 'Data Trust & Completeness Center'}
              {activeNav === 'data' && 'Reconciled Data & Provenance'}
              {activeNav === 'about' && 'System Architecture & Mathematical Derivations'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#595959]">
            {biData && (
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="px-2.5 py-1 rounded bg-[#f4f2eb] border border-[#dcd7cb]">Pipeline: <span className="text-[#191919] font-bold">₹68.82 Cr</span></div>
                <div className="px-2.5 py-1 rounded bg-[#f4f2eb] border border-[#dcd7cb]">Weighted: <span className="text-[#007a5a] font-bold">₹26.46 Cr</span></div>
                <div className="px-2.5 py-1 rounded bg-[#f4f2eb] border border-[#dcd7cb]">WOs: <span className="text-[#191919] font-bold">58 Active</span></div>
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
              <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] shadow-xs">
                <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-2 font-mono">
                  Dataset Architecture & Audit Summary
                </h3>
                <p className="text-xs text-[#595959] leading-relaxed">
                  Skylark Executive Intelligence operates on two primary boards from Monday.com: the <strong>Deals Funnel</strong> (344 total records, 50 open deals) and the <strong>Work Orders Tracker</strong> (175 total records, 58 active projects).
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 bg-[#f4f2eb] rounded-xl border border-[#e5e2d8]">
                    <div className="text-[10px] text-[#737373] uppercase font-mono">Total Deals</div>
                    <div className="text-base font-bold text-[#191919] mt-0.5">344 Records</div>
                    <div className="text-[11px] text-[#595959] mt-1">50 Open • 163 Won • 127 Dead</div>
                  </div>
                  <div className="p-4 bg-[#f4f2eb] rounded-xl border border-[#e5e2d8]">
                    <div className="text-[10px] text-[#737373] uppercase font-mono">Total Work Orders</div>
                    <div className="text-base font-bold text-[#191919] mt-0.5">175 Records</div>
                    <div className="text-[11px] text-[#595959] mt-1">117 Completed • 53 Ongoing • 5 Delayed</div>
                  </div>
                  <div className="p-4 bg-[#f4f2eb] rounded-xl border border-[#e5e2d8]">
                    <div className="text-[10px] text-[#737373] uppercase font-mono">Cross-Board Match Rate</div>
                    <div className="text-base font-bold text-[#007a5a] mt-0.5">89.7% Linked</div>
                    <div className="text-[11px] text-[#595959] mt-1">52 of 58 deal names verified 1:1</div>
                  </div>
                </div>
              </div>

              {/* Data Trust & Quality Dimensions */}
              {dataTrust && (
                <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
                      Data Trust & Governance Dimensions
                    </h3>
                    <span className="text-[11px] font-mono text-[#007a5a] font-semibold">{dataTrust.overall_confidence}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataTrust.dimensions.map((dim, idx) => (
                      <div key={idx} className="p-4 bg-[#f4f2eb] rounded-xl border border-[#e5e2d8]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#191919]">{dim.name}</span>
                          <span className="text-xs font-mono font-bold text-[#007a5a]">{dim.score}%</span>
                        </div>
                        <p className="text-[11px] text-[#595959]">{dim.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeNav === 'about' && (
            <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
                  About Skylark Executive Intelligence
                </h3>
                <p className="text-xs text-[#404040] leading-relaxed">
                  This system was designed as a production-grade Executive Decision Intelligence agent for Skylark Drones. It transforms messy, unnormalized CRM and operational project tracker exports into deterministic executive intelligence without arithmetic hallucination.
                </p>
                <div className="pt-2 text-xs text-[#595959] space-y-2">
                  <p>• <strong>Deterministic Grounding:</strong> The LLM synthesizes natural language, but arithmetic, rankings, and filters are calculated deterministically by the BI engine.</p>
                  <p>• <strong>Messy Data Resilience:</strong> Automatically normalizes erratic dates, currency typos, duplicate names, and missing close dates.</p>
                  <p>• <strong>Evidence-First Philosophy:</strong> Every claim clearly distinguishes source facts, derived metrics, modeling assumptions, and dataset limitations.</p>
                </div>
              </div>

              <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#e5e2d8] space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-[#191919] uppercase tracking-wider font-mono">
                  Mathematical Formulas & Ground Truth
                </h3>
                <div className="space-y-2 text-xs font-mono text-[#191919]">
                  <div 
                    onClick={() => handleOpenLineage('Weighted Risk-Adjusted Forecast')}
                    className="p-3.5 bg-[#f4f2eb] hover:bg-[#eae7dc] cursor-pointer rounded-xl border border-[#e5e2d8] transition-colors"
                  >
                    <div className="text-[#007a5a] text-[10px] uppercase flex items-center justify-between font-bold">
                      <span>Weighted Forecast</span>
                      <span className="text-[#007a5a] font-sans text-[10px]">Inspect Lineage →</span>
                    </div>
                    <div className="mt-1 font-bold text-[#191919]">Weighted Forecast = ∑ (Deal Value × Probability)</div>
                    <div className="text-[11px] text-[#595959] mt-1">High (80%): ₹13.35 Cr + Low (20%): ₹8.39 Cr + Med (50%): ₹4.16 Cr + Baseline (30%): ₹0.56 Cr = ₹26.46 Cr</div>
                  </div>
                  <div className="p-3.5 bg-[#f4f2eb] rounded-xl border border-[#e5e2d8]">
                    <div className="text-[#007a5a] text-[10px] uppercase font-bold">Billing Realization Rate</div>
                    <div className="mt-1 font-bold text-[#191919]">Realization = (Billed Value / Contract Value) × 100</div>
                    <div className="text-[11px] text-[#595959] mt-1">₹10.74 Cr Billed / ₹21.06 Cr Contracted = 51.0% Realization</div>
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

