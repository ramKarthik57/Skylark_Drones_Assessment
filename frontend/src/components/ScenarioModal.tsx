import React, { useState } from 'react';
import { X, Sliders, AlertCircle } from 'lucide-react';
import { fetchScenarioSimulation } from '../services/api';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({ isOpen, onClose }) => {
  const [scenarioType, setScenarioType] = useState<string>('probability_increase');
  const [deltaPct, setDeltaPct] = useState<number>(10);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchScenarioSimulation(scenarioType, deltaPct);
      setResult(data);
    } catch (err) {
      console.error("Scenario simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-400 mb-1">
          <Sliders className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-100">Executive Scenario Analysis</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Run 100% deterministic what-if simulations on live deals without altering production underlying records.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Scenario Type</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="probability_increase">Probability Uplift (+10% / +20% on open deals)</option>
              <option value="pipeline_conversion">Open Pipeline Conversion (% converted to Won)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
              <span>Shift Delta: <strong>+{deltaPct}%</strong></span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={deltaPct}
              onChange={(e) => setDeltaPct(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-semibold text-xs text-slate-950 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Calculating Deterministic Simulation..." : "Run Scenario Simulation"}
          </button>
        </div>

        {result && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-200">{result.title}</span>
              <span className="text-emerald-400 font-mono font-bold">{result.diff_formatted}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">BASELINE</div>
                <div className="text-sm font-semibold text-slate-300">{result.baseline_formatted}</div>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400 text-[10px]">SCENARIO RESULT</div>
                <div className="text-sm font-bold text-emerald-400">{result.scenario_formatted}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{result.caveat}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
