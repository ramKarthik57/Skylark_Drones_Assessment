import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#10121a] border border-[#1e2333] rounded-lg w-full max-w-lg p-6 text-slate-100 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Executive Scenario Analysis
            </h2>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              SCENARIO NOT FORECAST
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Explore "what-if" commercial decisions without altering underlying production records
          </p>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Simulation Model</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-[#090a0f] border border-[#1e2333] rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-600"
            >
              <option value="probability_increase">Probability Uplift (+10% / +20% on open deals)</option>
              <option value="pipeline_conversion">Open Pipeline Conversion (% converted to Won)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span>Simulation Delta:</span>
              <span className="font-mono text-slate-200 font-semibold">+{deltaPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={deltaPct}
              onChange={(e) => setDeltaPct(Number(e.target.value))}
              className="w-full accent-sky-500 bg-[#090a0f]"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-2 bg-sky-700 hover:bg-sky-600 font-medium text-xs text-white rounded transition-colors"
          >
            {loading ? "Calculating Simulation..." : "Run Scenario Simulation"}
          </button>
        </div>

        {result && (
          <div className="bg-[#090a0f] border border-[#1e2333] rounded p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#1e2333] pb-2">
              <span className="font-medium text-slate-200 text-[11px]">{result.title}</span>
              <span className="text-emerald-400 font-mono font-semibold">{result.diff_formatted}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#141722] p-2.5 rounded border border-[#1e2333]">
                <div className="text-slate-500 text-[10px]">CURRENT FORECAST</div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">{result.baseline_formatted}</div>
              </div>
              <div className="bg-[#141722] p-2.5 rounded border border-[#1e2333]">
                <div className="text-slate-500 text-[10px]">SIMULATED VALUE</div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">{result.scenario_formatted}</div>
              </div>
            </div>

            <div className="flex items-start gap-1.5 text-[10px] text-slate-400 pt-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{result.caveat}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
