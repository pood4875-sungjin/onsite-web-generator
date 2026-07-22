#!/usr/bin/env python3
"""로컬 개발 서버 — 캐시 끔(항상 최신 파일). 실행: python3 serve.py [포트]"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4788

class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    print(f"MIDAS Web Generator — http://localhost:{PORT}/app/index.html  (Ctrl+C to stop, no-cache)")
    HTTPServer(("", PORT), NoCache).serve_forever()
