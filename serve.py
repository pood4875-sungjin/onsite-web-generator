#!/usr/bin/env python3
"""로컬 개발 서버 — 캐시 끔(항상 최신 파일). 실행: python3 serve.py [포트]
   포트(자리)가 이미 사용 중이면 다음 빈 자리를 자동으로 잡아서 주소를 알려준다."""
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
    srv = None
    for port in range(PORT, PORT + 20):
        try:
            srv = HTTPServer(("", port), NoCache)
            break
        except OSError:
            print(f"※ {port}번 자리는 이미 사용 중이라 다음 번호로 넘어갑니다")
    if srv is None:
        print("빈 자리를 못 찾았어요. python3 serve.py 5000 처럼 다른 번호를 직접 지정해 보세요.")
        sys.exit(1)
    port = srv.server_address[1]
    print("MIDAS Web Generator가 켜졌습니다!")
    print(f"→ 브라우저에서 이 주소를 여세요:  http://localhost:{port}/app/index.html")
    print("(이 창은 그대로 켜 두세요 — 멈춘 것처럼 보여도 정상입니다. 끄기: Ctrl+C)")
    srv.serve_forever()
