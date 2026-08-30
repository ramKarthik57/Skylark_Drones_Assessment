from typing import Dict, Any, List

def run_scenario_simulation(deals: List[Dict[str, Any]], work_orders: List[Dict[str, Any]], scenario_type: str, delta_pct: float = 0.0) -> Dict[str, Any]:
    """
    Executes a 100% deterministic what-if scenario simulation on normalized data.
    """
    open_deals = [d for d in deals if d.get("deal_stage") == "Open"]
    baseline_open_val = sum(d.get("deal_value") or 0 for d in open_deals)
    
    # Calculate baseline weighted pipeline
    def get_weighted(d):
        val = d.get("deal_value") or 0
        prob = d.get("probability_num")
        if prob is not None:
            return val * (prob / 100.0)
        return val * 0.20 # baseline default
        
    baseline_weighted_val = sum(get_weighted(d) for d in open_deals)

    if scenario_type == "probability_increase":
        # Shift win probability by delta_pct (e.g. +10%)
        scenario_weighted_val = 0.0
        for d in open_deals:
            val = d.get("deal_value") or 0
            base_prob = d.get("probability_num") if d.get("probability_num") is not None else 20.0
            new_prob = min(100.0, base_prob + delta_pct)
            scenario_weighted_val += val * (new_prob / 100.0)
            
        diff_val = scenario_weighted_val - baseline_weighted_val
        diff_pct = round((diff_val / baseline_weighted_val) * 100.0, 1) if baseline_weighted_val > 0 else 0.0

        return {
            "scenario_type": "probability_increase",
            "title": f"Probability Uplift (+{delta_pct}%)",
            "baseline_value": round(baseline_weighted_val, 2),
            "scenario_value": round(scenario_weighted_val, 2),
            "absolute_change": round(diff_val, 2),
            "percentage_change": diff_pct,
            "baseline_formatted": f"₹{round(baseline_weighted_val/10000000, 2)} Cr",
            "scenario_formatted": f"₹{round(scenario_weighted_val/10000000, 2)} Cr",
            "diff_formatted": f"+₹{round(diff_val/10000000, 2)} Cr ({diff_pct}%)",
            "caveat": "SCENARIO SIMULATION — Deterministic calculation based on hypothetical closure probability shift."
        }

    elif scenario_type == "pipeline_conversion":
        # Convert delta_pct of open pipeline into Won deals (e.g., 20% conversion)
        converted_val = baseline_open_val * (delta_pct / 100.0)
        remaining_open = baseline_open_val - converted_val
        
        return {
            "scenario_type": "pipeline_conversion",
            "title": f"Open Pipeline Conversion ({delta_pct}% converted to Won)",
            "baseline_value": round(baseline_open_val, 2),
            "scenario_value": round(converted_val, 2),
            "absolute_change": round(converted_val, 2),
            "percentage_change": delta_pct,
            "baseline_formatted": f"₹{round(baseline_open_val/10000000, 2)} Cr open pipeline",
            "scenario_formatted": f"₹{round(converted_val/10000000, 2)} Cr new won revenue",
            "diff_formatted": f"₹{round(remaining_open/10000000, 2)} Cr remaining open pipeline",
            "caveat": "SCENARIO SIMULATION — Assumes successful commercial close of target open pipeline fraction."
        }

    return {
        "scenario_type": "unknown",
        "title": "Baseline Scenario",
        "baseline_value": round(baseline_open_val, 2),
        "scenario_value": round(baseline_open_val, 2),
        "absolute_change": 0.0,
        "percentage_change": 0.0,
        "baseline_formatted": f"₹{round(baseline_open_val/10000000, 2)} Cr",
        "scenario_formatted": f"₹{round(baseline_open_val/10000000, 2)} Cr",
        "diff_formatted": "₹0 Cr (0%)",
        "caveat": "No scenario delta applied."
    }
