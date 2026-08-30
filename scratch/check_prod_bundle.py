import urllib.request
import re

url = 'https://skylark-bi-prod.vercel.app/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')
    print('HTML Content:\n', html)
    
    match = re.search(r'src="([^"]+)"', html)
    if match:
        js_path = match.group(1)
        js_url = 'https://skylark-bi-prod.vercel.app' + js_path
        print('\nFetching actual JS URL:', js_url)
        req_js = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_js) as resp_js:
            print('JS Status:', resp_js.status)
            js_data = resp_js.read()
            print('Actual JS Length:', len(js_data))
            print('Contains Skylark:', b'Skylark' in js_data)
            print('Contains Welcome to Skylark:', b'Welcome to Skylark' in js_data)
            print('Contains local chat fallback:', b'generateLocalChatResponse' in js_data or b'Action Center Role Governance' in js_data)
