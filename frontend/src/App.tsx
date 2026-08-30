import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandCenterView } from './components/CommandCenterView';
import { ChatInterface } from './components/ChatInterface';
import { RiskRadarView } from './components/RiskRadarView';
import { DataTrustView } from './components/DataTrustView';
import { ActionCenterView } from './components/ActionCenterView';
import { ScenarioModal } from './components/ScenarioModal';
import { LeadershipModal } from './components/LeadershipModal';
import { fetchBoardStatus, sendChatMessage, fetchLeadershipUpdate } from './services/api';
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

      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Welcome to **Skylark Executive Intelligence**. I am connected to your **Monday.com Deals** & **Work Orders** boards. Ask me any executive question about pipeline health, sector revenue, operational workloads, or delayed projects!`,
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
      console.error('Error in chat request:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: '⚠️ I encountered an issue retrieving data from Monday.com API. Please check your network or try again.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'command_center' && (
          <CommandCenterView
            biData={biData}
            riskRadar={riskRadar}
            dataQualityNotes={dataQualityNotes}
            onNavigateToAskAI={handleNavigateToAskAI}
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

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Skylark Executive Intelligence • Engineered by Ram Karthik • Decisions leadership can trust
      </footer>
    </div>
  );
}

export default App;
