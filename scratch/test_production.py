import urllib.request
import json
import time

BASE = 'https://skylark-bi-prod.vercel.app'

def test_url(label, path, method='GET', body=None):
    url = BASE + path
    print(f"\n{'='*60}")
    print(f"TEST: {label}")
    print(f"URL:  {url}")
    try:
        if body:
            data = json.dumps(body).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json'
            })
        else:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        start = time.time()
        with urllib.request.urlopen(req, timeout=30) as resp:
            elapsed = time.time() - start
            content = resp.read().decode('utf-8')
            print(f"STATUS: {resp.status}")
            print(f"LATENCY: {elapsed:.2f}s")
            print(f"LENGTH: {len(content)} bytes")
            try:
                data = json.loads(content)
                print(f"JSON: {json.dumps(data, indent=2)[:500]}")
            except:
                if '<div id="root">' in content:
                    print("RESULT: HTML page with app content")
                else:
                    print(f"RESULT (first 300): {content[:300]}")
            return True
    except urllib.error.HTTPError as e:
        print(f"HTTP ERROR: {e.code}")
        print(f"BODY: {e.read().decode('utf-8')[:300]}")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

results = {}

# 1. Homepage
results['Homepage'] = test_url('Homepage loads', '/')

# 2. API Health
results['API Health'] = test_url('API Health', '/api/health')

# 3. Boards Status
results['Boards Status'] = test_url('Boards Status', '/api/boards/status')

# 4. Chat endpoint (POST)
results['Chat'] = test_url('Chat - Pipeline Health', '/api/chat', 
    body={"message": "How is our pipeline looking?"})

# 5. Action Center
results['Action Center'] = test_url('Action Center', '/api/action-center')

# 6. Scenario (GET with query params)
results['Scenario'] = test_url('Scenario', '/api/scenario?scenario_type=win_rate_change&delta_pct=10')

# 7. Leadership Update
results['Leadership'] = test_url('Leadership Update', '/api/leadership-update')

# 8. JS assets
print(f"\n{'='*60}")
print("TEST: Frontend JS Bundle")
import re
req = urllib.request.Request(BASE + '/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        match = re.search(r'src="(/assets/[^"]+\.js)"', html)
        if match:
            js_path = match.group(1)
            js_url = BASE + js_path
            req2 = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2) as resp2:
                js_data = resp2.read()
                print(f"JS Bundle: {js_path}")
                print(f"Size: {len(js_data)} bytes")
                print(f"Contains Skylark: {b'Skylark' in js_data}")
                results['JS Bundle'] = b'Skylark' in js_data and len(js_data) > 100000
        else:
            print("No JS bundle found in HTML")
            results['JS Bundle'] = False
except Exception as e:
    print(f"ERROR: {e}")
    results['JS Bundle'] = False

# 9. CSS assets
print(f"\n{'='*60}")
print("TEST: Frontend CSS Bundle")
req = urllib.request.Request(BASE + '/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        match = re.search(r'href="(/assets/[^"]+\.css)"', html)
        if match:
            css_path = match.group(1)
            css_url = BASE + css_path
            req2 = urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2) as resp2:
                css_data = resp2.read()
                print(f"CSS Bundle: {css_path}")
                print(f"Size: {len(css_data)} bytes")
                results['CSS Bundle'] = len(css_data) > 1000
        else:
            print("No CSS bundle found in HTML")
            results['CSS Bundle'] = False
except Exception as e:
    print(f"ERROR: {e}")
    results['CSS Bundle'] = False

# Summary
print(f"\n{'='*60}")
print("PRODUCTION VERIFICATION SUMMARY")
print(f"{'='*60}")
for test, passed in results.items():
    status = "PASS" if passed else "FAIL"
    print(f"  {test:20s} : {status}")
all_pass = all(results.values())
print(f"\nOVERALL: {'ALL PASS' if all_pass else 'FAILURES DETECTED'}")
