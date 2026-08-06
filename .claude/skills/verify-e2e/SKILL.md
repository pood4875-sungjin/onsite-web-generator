---
name: verify-e2e
description: 실측 검증 루틴 — 워커 curl E2E(compose/compose-web/translate/intake), 브라우저 하네스 규약, 4언어 매트릭스, 한글 누수·장수·이미지 필드 검사. "검증해", "E2E 돌려", "확인해봐", 수정 후 자가검증에 사용.
---

# 실측 검증 루틴

원칙: **추측 금지**. 서버는 curl 실호출, 렌더는 브라우저 하네스. "될 것"이라는 말은 검증 후에만.

## 워커 E2E (curl)

```bash
W=https://webgen-ppt-proxy.ksj0225.workers.dev
# PPT 생성 (팩·언어 바꿔가며)
curl -sS -X POST $W/compose -H 'Content-Type: application/json' \
  -d '{"pack":"machine","lang":"en","title":"...","plan":"...","volume":"standard"}'
# 스트리밍 검사(잘림 의심 시): -N + "stream":true → content_block_delta 조립 후 장수 확인
# 웹 생성
curl -sS -X POST $W/compose-web -d '{"plan":"...","kind":"single","lang":"en"}' -H 'Content-Type: application/json'
# 번역(슬라이드 3장 청크 / 사이트 통짜 둘 다)
curl -sS -X POST $W/translate -d '{"payload":{...},"to":"ko"}' -H 'Content-Type: application/json'
# 인테이크(속도 측정은 time 붙여서 — 기준: 인테이크 ~4초, 번역 청크 ~4초)
```

응답 = `{text}` 안에 ```json 펜스. 파싱:
```python
m = re.search(r'```json\s*(.*?)```', raw, re.S) or re.search(r'(\{.*\})', raw, re.S)
```

## 검사 항목

- **장수·타입 시퀀스**: 잠금 팩 = 정확히 10장, 지정 순서
- **한글 누수**(EN/JA/ZH): `re.search(r'[가-힣]', json.dumps(slide, ensure_ascii=False))` — 인명 원문은 예외
- **이미지 필드**: img 값이 파일명 그대로인지(fixBrand 오염·URL화 안 됐는지)
- **title 빈 값**: 렌더 휑함의 주범

## 브라우저 하네스 규약

- 레포 루트 `_verify*.html` — 팩 스크립트 로드 + `window.__r = renderX(...)` → Browser pane에서 열어 JS로 검사
- 서버: `.claude/launch.json`의 webgen-verify(포트 4612)
- 문자열 검사 함정: mixT/emph가 문장 중간에 `<b>` 삽입 — 매칭 실패 시 `textContent`로 재검
- **끝나면 하네스 삭제**(pages 배포에 딸려 올라감)

## 4언어 매트릭스 (로컬라이징 수정 시)

KO·EN·JA·ZH × {본문·썸네일(solo)·뷰어} — 언어 어긋남은 `_clang` 미동봉 경로가 주범.
`grep "|| '[가-힣]" app/packs.*.js` = 하드코딩 폴백 검사.

## JS 문법

수정한 모든 `.js`: `node --check`. studio.html 인라인 JS는 하네스 실행으로 대체.
