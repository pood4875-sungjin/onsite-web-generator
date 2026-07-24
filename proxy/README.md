# PPT AI 프록시 (Cloudflare Workers)

관리자 API 키 **1개**를 서버에 숨기고 팀 전체가 AI 생성을 쓰게 하는 프록시.
클라이언트(브라우저)엔 키가 절대 내려가지 않음.

## 정책 (worker.js 상단 상수)

| 항목 | 값 | 위치 |
|---|---|---|
| 모델 | `claude-sonnet-5` 고정 | `MODEL` |
| 일일 제한 | IP당 **9회** (10회 미만) | `DAILY_LIMIT` |
| 토큰 상한 | 4000 | `MAX_TOKENS` |
| 월 지출 한도 | **콘솔에서 직접 설정(필수)** | 아래 §지출 한도 |

남용 방지: PPT 브리프 전용 엔드포인트(`POST /compose`) — 프롬프트를 서버가 조립하므로
주소가 유출돼도 범용 Claude 중계로 쓸 수 없음. 브리프 필드 길이도 서버에서 자름.

## 배포 (1회, ~10분)

```bash
cd proxy
npm i -g wrangler                      # 없으면
npx wrangler login                     # Cloudflare 계정 (무료 티어면 충분)

# 1) 레이트리밋 KV 생성 → 출력된 id를 wrangler.toml의 <KV_NAMESPACE_ID_붙여넣기>에 넣기
npx wrangler kv namespace create RATE_KV

# 2) API 키를 시크릿으로 (코드·저장소에 절대 안 남음)
npx wrangler secret put ANTHROPIC_API_KEY   # 프롬프트 뜨면 sk-ant-… 붙여넣기

# 3) 배포 → https://webgen-ppt-proxy.<계정>.workers.dev 주소 출력
npx wrangler deploy
```

## 앱 연결

배포 주소를 `app/llm.js` 상단에 붙여넣기:

```js
var PROXY_URL = 'https://webgen-ppt-proxy.<계정>.workers.dev';
```

이후 모든 사용자: 설정·키 없이 PPT 브리프에서 바로 "AI로 내용까지 채우기" 사용 가능.
(PROXY_URL이 비어 있으면 기존 BYOK — 각자 키 — 모드로 동작.)

## 지출 한도 (필수 — 최후 안전망)

1. https://console.anthropic.com → **Settings → Billing(또는 Limits)**
2. **Monthly spend limit** 설정 (예: $20) → 초과 시 API가 자동 차단됨
3. 알림 임계값(예: 50%/90%)도 함께 설정 권장

비용 감각: Sonnet 5 기준 덱 1회 ≈ 50~100원. 하루 9회 × 20명 풀가동해도 월 $20~40 선.

## 동작 확인

```bash
curl -X POST https://<배포주소>/compose \
  -H 'content-type: application/json' \
  -d '{"title":"테스트 발표","outline":["배경","결론"]}'
# → {"text":"{\"slides\":[...]}", "remaining":8}
# 10회째부터 → 429 {"error":"LIMIT", ...}
```
