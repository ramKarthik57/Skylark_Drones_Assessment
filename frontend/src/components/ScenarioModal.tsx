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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1a0e38] border border-[#412275] rounded-3xl w-full max-w-lg p-6 md:p-8 text-white shadow-2xl shadow-purple-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900 border border-purple-700/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
              Executive Scenario Laboratory
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-semibold">
              WHAT-IF MODEL
            </span>
          </div>
          <p className="text-xs text-purple-300/70 mt-1">
            Explore deterministic commercial simulations without altering underlying production records
          </p>
        </div>

        <div className="space-y-4 mb-6 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">Simulation Strategy</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-[#130a2a] border border-[#412275] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-medium cursor-pointer"
            >
              <option value="probability_increase">Probability Uplift (+10% / +20% on open deals)</option>
              <option value="pipeline_conversion">Open Pipeline Conversion (% converted to Won)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-purple-300/80 mb-2">
              <span className="font-medium">Simulation Delta:</span>
              <span className="font-mono text-amber-300 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800">+{deltaPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={deltaPct}
              onChange={(e) => setDeltaPct(Number(e.target.value))}
              className="w-full accent-purple-500 bg-[#130a2a] cursor-pointer"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-xs text-white rounded-xl shadow-lg shadow-purple-950/50 border border-purple-400/40 transition-all cursor-pointer"
          >
            {loading ? "Calculating Deterministic Simulation..." : "Run Scenario Simulation"}
          </button>
        </div>

        {result && (
          <div className="bg-[#130a2a] rounded-2xl p-5 border border-[#412275] space-y-3 relative z-10 shadow-inner">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#2d1854]">
              <span className="text-purple-300/80 font-medium">{result.title || "Simulation Outcome"}</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {result.diff_formatted || `₹${(result.simulated_value / 10000000).toFixed(2)} Cr`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="bg-[#0d061f] p-3 rounded-xl border border-[#2d1854]">
                <div className="text-purple-400 text-[10px] uppercase font-mono">BASELINE FORECAST</div>
                <div className="text-xs font-bold text-white mt-1">{result.baseline_formatted || "₹26.46 Cr"}</div>
              </div>
              <div className="bg-[#0d061f] p-3 rounded-xl border border-[#2d1854]">
                <div className="text-purple-400 text-[10px] uppercase font-mono">SIMULATED VALUE</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">{result.scenario_formatted || `₹${(result.simulated_value / 10000000).toFixed(2)} Cr`}</div>
              </div>
            </div>

            <div className="text-xs text-purple-200/90 leading-relaxed pt-1">
              {result.explanation}
            </div>

            <div className="flex items-start gap-1.5 text-[10px] text-amber-300 font-mono pt-1 border-t border-[#2d1854]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{result.caveat || "Sensitivity modeling output — does not alter underlying CRM records."}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
