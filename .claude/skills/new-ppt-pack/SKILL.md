---
name: new-ppt-pack
description: 새 PPT 스타일팩(packs.X.js) 추가·포크 절차. 팩 계약, 배선 체크리스트(누락 시 조용히 안 나옴), AI 스키마 3곳, 검증 루틴, 반복 사고 목록. "새 PPT 팩", "PPT 스타일 추가", "팩 포크" 요청 시 사용.
---

# 새 PPT 스타일팩 추가

기존 팩 포크가 기본(naver·rams·machine·pastel 참조). 소스(PDF·Figma·사이트)가 있으면 **실측만** — 추측값 금지, 소스에 없는 건 만들지 않는다.

## 1. 팩 파일 계약 (`app/packs/ppt/packs.X.js`)

- 자기완결 IIFE, window 전역 export:
  `renderXDeck(data)` `renderXViewer(data,opts)` `xTemplateDeck()` `X_SCHEMA_DOC` `X_FIELD_DOC` `X_TYPE_LABEL` `X_CATALOG`(+ 팩별 MV_SEL 등 기존 팩 참조)
- 슬라이드 = `1280×720px` 고정, `.ppt-stack` 세로 스택. 뷰어 fit = `Math.min(w/1280,h/720)` scale
- 전 텍스트에 `data-edit="slides.N.필드경로"` — 필드 경로가 데이터 구조와 정확히 일치해야 편집이 저장됨
- 이미지: `aurl()` — BASE가 file://이면 프로드(`https://midas-drs.pages.dev/app/`)로 강제 + onerror 2단(프로드 재시도→제거)
- `lockDemo(slides, clang, touched)` 패턴(시연 고정 시): touched(사용자 편집)면 양보, 언어는 내용 비율로 판정
- CJK: `cjkHead(slides, clang)` — zh/ja면 Noto Sans SC/JP **1순위** 주입 + 라이트(300) 클래스 400으로

## 2. 배선 체크리스트 — 하나라도 빼먹으면 조용히 안 나옴

1. 스크립트 로드 **7페이지**: `index` `studio/studio`(각 라인 10 배열) `dashboard` `projects` `resources` `settings` `icons` — 경로는 `app/packs/ppt/packs.X.js`(studio는 `../` 접두)
2. `index.html` `PPT_VISIBLE` 배열(피커 노출) + FIRST_SAMPLES 필요 시
3. `studio.html` `packMode`(팩별 스튜디오 동작 규칙) + 팩 해석 체인 + `renderDeckFor` 분기 + 뷰어 분기(`renderXViewer`)
4. `dashboard/projects` `renderForStyle` + `styleName` + `PPT_PACKS`
5. `export-pptx.js` `TEXT_SEL`/`SHAPE_SEL`에 팩 클래스 추가(PPTX 추출 충실도)
6. AI 스키마 3곳: `proxy/worker.js` compose 분기(`X_SYSTEM`) · `llm.js` BYOK 분기+`X_ALLOWED` · `llm.js _parseEdit`
7. 워커 배포(`cd proxy && npx wrangler deploy`)

## 3. 워커 시스템 프롬프트

- `X_USE_DOC`(타입 언제 쓰나) + `X_FIELD_DOC`(필드 계약) + `X_SYSTEM`
- 지시문에 **한국어 예시 문구를 그대로 쓰지 말 것** — AI가 타이틀로 복사한다("보고 순서" 사고). 콘텐츠 중립·언어 중립으로
- title류는 "필수·빈 값 금지" 명시(비면 렌더가 휑해짐), 사례·수치는 "브리프/공식 정보에 있는 것만, 창작 금지"
- 시연 잠금이 필요하면 `X_SYSTEM_FREE`로 원본 보존 후 잠금본 교체

## 4. 검증 (전부 실측 — 추측 금지)

```bash
node --check app/packs/ppt/packs.X.js
# 워커 실호출 — 장수·타입 시퀀스·한글 누수 확인
curl -sS -X POST https://webgen-ppt-proxy.ksj0225.workers.dev/compose -H 'Content-Type: application/json' \
  -d '{"pack":"X","lang":"en","title":"...","plan":"...","volume":"standard"}'
```
- 브라우저 하네스: 레포 루트 `_verify.html`에 팩 로드 + `renderXDeck(실데이터)` → 렌더 확인 → **삭제**(pages 배포에 딸려감)
- KO/EN/JA/ZH 각 1회 렌더(폰트·폴백·굵기), 원본 소스와 눈대조

## 5. 반복 사고 목록

- 렌더러 `|| '한국어'` 폴백 → EN 덱에 한글 노출. `grep -r "|| '[가-힣]" app/packs/` 필수
- 뷰어는 시작 시 전 장 `display:none` — rect 기반 축소/맞춤 가드는 **숨김 장 스킵** 안 하면 rect=0을 오판해 폰트 뭉갬
- 자동 축소 래핑은 **넘친 장만** + 원본 flex 레이아웃 복제(무조건 래핑 시 커버 붕괴)
- `layout` 아닌 `data-edit` 경로 오타 → 편집 저장 안 됨
- 스트림 잘림: 잠금 팩 10장 미만이면 성공 처리 금지(재시도 로직이 llm.js·studio에 있음 — 새 잠금 팩은 두 곳 LOCK10에 추가)
