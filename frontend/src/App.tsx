import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandCenterView } from './components/CommandCenterView';
import { ChatInterface } from './components/ChatInterface';
import { RiskRadarView } from './components/RiskRadarView';
import { DataTrustView } from './components/DataTrustView';
import { ActionCenterView } from './components/ActionCenterView';
import { ScenarioModal } from './components/ScenarioModal';
import { LeadershipModal } from './components/LeadershipModal';
import { DataLineageModal } from './components/DataLineageModal';
import { CommandPalette } from './components/CommandPalette';
import { fetchBoardStatus, sendChatMessage, fetchLeadershipUpdate, generateLocalChatResponse } from './services/api';
import type { BoardStatus, BIData, ChatMessage, LeadershipUpdate, RiskSignal, DataTrust, ActionItem } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'command_center' | 'ask_ai' | 'risk_radar' | 'data_trust' | 'action_center'>('command_center');
  const [boardStatus, setBoardStatus] = useState<BoardStatus | null>(null);
  const [biData, setBIData] = useState<BIData | null>(null);
  const [riskRadar, setRiskRadar] = useState<RiskSignal[]>([]);
  const [dataTrust, setDataTrust] = useState<DataTrust | null>(null);
  const [actionCenter, setActionCenter] = useState<ActionItem[]>([]);
  const [dataQualityNotes, setDataQualityNotes] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [leadershipModalOpen, setLeadershipModalOpen] = useState(false);
  const [leadershipData, setLeadershipData] = useState<LeadershipUpdate | null>(null);
  const [leadershipLoading, setLeadershipLoading] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [lineageModalOpen, setLineageModalOpen] = useState(false);
  const [selectedLineageInfo, setSelectedLineageInfo] = useState<any>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K for palette)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Load initial board status and initial conversation greeting
  const loadStatusAndInitialData = async () => {
    setLoading(true);
    try {
      const status = await fetchBoardStatus();
      setBoardStatus(status);
      if (status.risk_radar) setRiskRadar(status.risk_radar);
      if (status.data_trust) setDataTrust(status.data_trust);
      if (status.action_center) setActionCenter(status.action_center);

      // Perform initial system query to populate initial Dashboard BI data & metrics
      const initRes = await sendChatMessage('How is our pipeline looking this quarter?');
      if (initRes.bi_data) setBIData(initRes.bi_data);
      if (initRes.risk_radar) setRiskRadar(initRes.risk_radar);
      if (initRes.data_trust) setDataTrust(initRes.data_trust);
      if (initRes.data_quality_notes) setDataQualityNotes(initRes.data_quality_notes);

      const isLive = status.connected_live_monday && !status.is_mock_data;
      const welcomeSource = isLive
        ? "I’m connected to your live Monday.com Deals & Work Orders boards."
        : "I’m using the assignment dataset snapshot.";

      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Welcome to **Skylark Executive Intelligence**. ${welcomeSource} Ask me any executive question about pipeline health, sector revenue, operational workloads, or delayed projects.`,
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
      if (res.risk_radar) setRiskRadar(res.risk_radar);
      if (res.data_trust) setDataTrust(res.data_trust);
      if (res.data_quality_notes) setDataQualityNotes(res.data_quality_notes);

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString(),
        intent: res.intent,
        biData: res.bi_data,
        riskRadar: res.risk_radar,
        dataTrust: res.data_trust,
        dataQualityNotes: res.data_quality_notes,
        clarificationOptions: res.clarification_needed ? res.clarification_options : undefined,
        suggestedQuestions: res.suggested_questions
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error in chat request, synthesizing local grounded response:', err);
      const fallbackRes = generateLocalChatResponse(text);
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallbackRes.text,
        timestamp: new Date().toLocaleTimeString(),
        intent: fallbackRes.intent,
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

  const handleNavigateToAskAI = (question?: string) => {
    setActiveTab('ask_ai');
    if (question) {
      handleSendMessage(question);
    }
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
    } else if (metricName.includes('WIN RATE')) {
      info = {
        metricName: 'Closed Win Rate',
        sourceDataset: 'Deals Funnel Dataset (344 Total Valid Records)',
        filterApplied: 'deal_status IN ("Won", "Dead")',
        recordsConsidered: '290 Decided Deals (163 Won, 127 Dead)',
        formula: '(Won Deals / (Won Deals + Dead Deals)) × 100',
        resultValue: '56.2%',
        qualityCaveat: '4 On Hold deals excluded from win rate denominator.'
      };
    } else if (metricName.includes('WORK ORDER') || metricName.includes('DELAYED')) {
      info = {
        metricName: 'Active & Delayed Work Orders',
        sourceDataset: 'Work Orders Dataset (175 Total Records)',
        filterApplied: 'execution_status IN ("Ongoing", "Delayed")',
        recordsConsidered: '58 Active Work Orders (53 Ongoing, 5 Execution Delayed)',
        formula: 'Count of Active Project Records',
        resultValue: '58 Active (5 Delayed)',
        qualityCaveat: '117 Completed work orders excluded from active workload.'
      };
    } else if (metricName.includes('RECEIVABLE')) {
      info = {
        metricName: 'Total Outstanding Receivables',
        sourceDataset: 'Work Orders Dataset (175 Total Records)',
        filterApplied: 'All Work Orders with amount_receivable > 0',
        recordsConsidered: '175 Work Orders',
        formula: 'Σ (amount_receivable)',
        resultValue: '₹3.63 Cr',
        qualityCaveat: 'Total Contract Value: ₹21.06 Cr | Total Billed: ₹10.74 Cr.'
      };
    }

    setSelectedLineageInfo(info);
    setLineageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans">
      {/* App Header */}
      <Header
        status={boardStatus}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLeadershipModal={handleOpenLeadership}
        onOpenScenarioModal={() => setScenarioModalOpen(true)}
        onRefresh={loadStatusAndInitialData}
        loading={loading}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5">
        {activeTab === 'command_center' && (
          <CommandCenterView
            biData={biData}
            riskRadar={riskRadar}
            dataQualityNotes={dataQualityNotes}
            onNavigateToAskAI={handleNavigateToAskAI}
            onOpenLineage={handleOpenLineage}
          />
        )}

        {activeTab === 'ask_ai' && (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            onSelectSuggested={handleSendMessage}
          />
        )}

        {activeTab === 'risk_radar' && (
          <RiskRadarView
            riskRadar={riskRadar}
            onNavigateToAskAI={handleNavigateToAskAI}
          />
        )}

        {activeTab === 'action_center' && (
          <ActionCenterView actions={actionCenter} />
        )}

        {activeTab === 'data_trust' && (
          <DataTrustView dataTrust={dataTrust} />
        )}
      </main>

      {/* Scenario Analysis Modal */}
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

      {/* Keyboard Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(tab) => { setActiveTab(tab); setCommandPaletteOpen(false); }}
        onOpenLeadership={handleOpenLeadership}
        onOpenScenario={() => setScenarioModalOpen(true)}
      />

      {/* Enterprise Status Footer */}
      <footer className="border-t border-[#1e2333] py-3 px-4 max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span>Skylark Executive Intelligence</span>
          <span>•</span>
          <span>Data: Monday.com Snapshot</span>
          <span>•</span>
          <span>Engineered by Ram Karthik</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#141722] border border-[#1e2333] text-slate-400">Ctrl+K</kbd>
          <span>for Command Palette</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
