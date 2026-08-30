import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

# Vercel ASGI Wrapper to fix internal rewrites
async def vercel_app(scope, receive, send):
    if scope["type"] in ("http", "websocket"):
        # Vercel rewrites /api/health to /api/index.py
        # But we want FastAPI to see /api/health
        # The original path is usually in the x-invoke-path header
        headers = dict(scope.get("headers", []))
        original_path = None
        for k, v in headers.items():
            if k.lower() == b'x-now-route-matches':
                pass # sometimes useful
            if k.lower() == b'x-invoke-path':
                original_path = v.decode('utf-8')
        
        # Or just use raw_path if it differs
        raw_path = scope.get("raw_path", b"").decode('utf-8')
        if original_path and original_path.startswith("/api"):
            scope["path"] = original_path
        elif scope["path"] == "/api/index.py":
            # Just default to something if we can't figure it out, but wait:
            # Let's just use raw_path if it hasn't been mangled by Vercel's ASGI
            if raw_path and raw_path.startswith("/api") and not "index.py" in raw_path:
                scope["path"] = raw_path

    await app(scope, receive, send)

# Tell Vercel to use the wrapper
app = vercel_app
