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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e5e2d8] rounded-2xl w-full max-w-lg p-6 md:p-8 text-[#191919] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[#737373] hover:text-[#191919] hover:bg-[#f4f2eb] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm md:text-base font-bold text-[#191919] uppercase tracking-wider font-mono">
              Executive Scenario Laboratory
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-[#d97706] border border-amber-200 font-mono font-semibold">
              WHAT-IF MODEL
            </span>
          </div>
          <p className="text-xs text-[#737373] mt-1">
            Explore deterministic commercial simulations without altering underlying production records
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1.5 font-mono uppercase">Simulation Strategy</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-[#f4f2eb] border border-[#dcd7cb] rounded-lg px-4 py-2.5 text-xs text-[#191919] focus:outline-none font-medium cursor-pointer"
            >
              <option value="probability_increase">Probability Uplift (+10% / +20% on open deals)</option>
              <option value="pipeline_conversion">Open Pipeline Conversion (% converted to Won)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-[#595959] mb-2 font-mono">
              <span>Simulation Delta Parameter</span>
              <span className="font-bold text-[#007a5a]">+{deltaPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={deltaPct}
              onChange={(e) => setDeltaPct(Number(e.target.value))}
              className="w-full accent-[#007a5a] bg-[#e5e2d8] cursor-pointer"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-3 bg-[#007a5a] hover:bg-[#006046] font-bold text-xs text-white rounded-lg shadow-xs transition-all cursor-pointer"
          >
            {loading ? "Calculating Deterministic Simulation..." : "Run Scenario Simulation"}
          </button>
        </div>

        {result && (
          <div className="bg-[#f4f2eb] rounded-xl p-5 border border-[#e5e2d8] space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#e5e2d8]">
              <span className="text-[#191919] font-bold">{result.title || "Simulation Outcome"}</span>
              <span className="font-mono font-bold text-[#007a5a] text-sm">
                {result.diff_formatted || `₹${(result.simulated_value / 10000000).toFixed(2)} Cr`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="bg-[#ffffff] p-3 rounded-lg border border-[#e5e2d8]">
                <div className="text-[#737373] text-[10px] uppercase font-mono">BASELINE FORECAST</div>
                <div className="text-xs font-bold text-[#191919] mt-1">{result.baseline_formatted || "₹26.46 Cr"}</div>
              </div>
              <div className="bg-[#ffffff] p-3 rounded-lg border border-[#e5e2d8]">
                <div className="text-[#737373] text-[10px] uppercase font-mono">SIMULATED VALUE</div>
                <div className="text-xs font-bold text-[#007a5a] mt-1">{result.scenario_formatted || `₹${(result.simulated_value / 10000000).toFixed(2)} Cr`}</div>
              </div>
            </div>

            <div className="text-xs text-[#404040] leading-relaxed pt-1">
              {result.explanation}
            </div>

            <div className="flex items-start gap-1.5 text-[10px] text-amber-800 font-mono pt-1 border-t border-[#e5e2d8]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#d97706]" />
              <span>{result.caveat || "Sensitivity modeling output — does not alter underlying CRM records."}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
