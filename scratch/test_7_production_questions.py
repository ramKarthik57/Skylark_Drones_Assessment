import urllib.request
import json
import time
import sys
import io

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = 'https://skylark-bi-prod.vercel.app'

questions = [
    {
        "id": "Q1",
        "q": "How is our pipeline looking this quarter?",
        "expected_metrics": ["68.82", "50", "26.46"],
        "forbidden_phrases": ["connected to your monday", "12 rated", "38 unrated"]
    },
    {
        "id": "Q2",
        "q": "How was the weighted forecast calculated?",
        "expected_metrics": ["68.82", "26.46", "47"],
        "forbidden_phrases": ["12 open deals", "38 unrated"]
    },
    {
        "id": "Q3",
        "q": "Show me our biggest active opportunities.",
        "expected_metrics": ["Coal India", "15.00", "Adani Solar", "12.50", "47.00"],
        "forbidden_phrases": []
    },
    {
        "id": "Q4",
        "q": "Which sectors have the strongest pipeline?",
        "expected_metrics": ["Mining", "24.15", "Renewables", "18.40"],
        "forbidden_phrases": []
    },
    {
        "id": "Q5",
        "q": "How many active and delayed work orders do we have?",
        "expected_metrics": ["58", "53", "5"],
        "forbidden_phrases": []
    },
    {
        "id": "Q6",
        "q": "What are the biggest risks to converting our pipeline?",
        "expected_metrics": ["Coal India", "15.00", "Adani", "49"],
        "forbidden_phrases": []
    },
    {
        "id": "Q7",
        "q": "What is our EBITDA?",
        "expected_metrics": ["unsupported", "not tracked", "data unavailability", "ebitda"],
        "forbidden_phrases": ["₹", "pipeline"]
    }
]

print("=" * 75)
print("AUDITING 7 PRODUCTION AI QUESTIONS ON LIVE DEPLOYMENT")
print(f"Target: {BASE}")
print("=" * 75)

all_passed = True

for item in questions:
    qid = item["id"]
    query = item["q"]
    print(f"\n--- {qid}: \"{query}\" ---")
    
    payload = json.dumps({"message": query}).encode('utf-8')
    req = urllib.request.Request(
        f"{BASE}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
    )
    
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            latency = time.time() - t0
            raw = resp.read().decode('utf-8')
            res = json.loads(raw)
            text = res.get('text', '')
            
            print(f"Latency: {latency:.2f}s | Status: 200 OK")
            print(f"Answer snippet: {text[:250]}...")
            
            # Validation checks
            passed = True
            missing_metrics = []
            for m in item["expected_metrics"]:
                if m.lower() not in text.lower():
                    missing_metrics.append(m)
                    passed = False
            
            found_forbidden = []
            for f in item["forbidden_phrases"]:
                if f.lower() in text.lower():
                    found_forbidden.append(f)
                    passed = False
            
            if passed:
                print(f"Result: [PASS]")
            else:
                all_passed = False
                print(f"Result: [FAIL]")
                if missing_metrics:
                    print(f"  Missing expected metrics: {missing_metrics}")
                if found_forbidden:
                    print(f"  Contains forbidden phrasing: {found_forbidden}")
                    
    except Exception as e:
        all_passed = False
        print(f"Error executing {qid}: {e}")

print("\n" + "=" * 75)
print(f"FINAL AUDIT RESULT: {'ALL 7 QUESTIONS PASSED' if all_passed else 'SOME QUESTIONS FAILED'}")
print("=" * 75)
