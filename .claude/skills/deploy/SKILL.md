---
name: deploy
description: 배포 절차 + 프로드 스모크. 사이트(pages 수동)·워커 배포, 전파 대기, 자산 200 체크, file:// 사용자 리로드 안내. "배포해", "프로드 반영", "워커 올려" 요청 시 사용.
---

# 배포 (푸시 ≠ 배포)

GitHub 연동 없음 — push해도 아무것도 배포 안 됨. 커밋은 로컬까지, **push는 사용자가 명시 요청할 때만**.

## 명령

```bash
# 사이트 — 레포 루트에서 (하네스 _verify*.html 삭제 먼저! 같이 올라감)
npx wrangler pages deploy . --project-name=midas-drs --commit-dirty=true
# 워커
cd proxy && npx wrangler deploy
```

## 전파 창 주의 (실제 사고 났던 것)

워커 배포 직후 ~30초는 옛 버전이 응답할 수 있다. **배포 직후 테스트가 실패하면 원인 단정 전에 20~30초 후 재시도.** 같은 시간이 두 번 나오면(예: 21.5초 두 번) 옛 코드가 응답 중인 것.

## 프로드 스모크

```bash
for u in "app/studio/studio.html" "app/index.html" "app/llm.js" "packs/… packs.machine.js" "app/bg/gennx-1.jpg" "app/bg/dubai-hero.jpg"; do
  printf '%s ' "$u"; curl -sL -o /dev/null -w '%{http_code}\n' "https://midas-drs.pages.dev/$u"; done
```
- 코드 내용 확인: `curl -s "https://midas-drs.pages.dev/packs/… packs.X.js?v=$(date +%s)" | grep -c "핵심문자열"
- 실동작: Browser pane에서 프로드 studio 열어 콘솔 에러 0 + `window.LLM`/렌더 함수 직접 호출

## 클라 캐시

- 스크립트는 `?v=Date.now()` 캐시버스터 — 리로드마다 신선. **단 열려있는 탭은 리로드해야 함**
- 사용자는 file://로도 연다 — 로컬 디스크 수정 즉시 유효하나 역시 탭 강력 새로고침(⌘+Shift+R) 필요. 안내 문구에 항상 포함

## 워커 시크릿

API 키는 워커 secret에만. 클라이언트·레포에 키 절대 금지.
