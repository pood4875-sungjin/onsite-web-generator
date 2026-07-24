# MIDAS Web Generator

대화형 스튜디오로 **랜딩페이지 · 웹사이트 · 이메일(eDM) · PPT**를 생성·편집하는 빌드리스 정적 웹앱.
스타일 팩(다크글로우·KRDS·MIDAS AX·Aether Glass·eDM·PPT)을 갈아끼우는 구조.

> KR4 — AX 디자인 제너레이터 · 상세: [docs/PRD.md](docs/PRD.md)

## 실행

```bash
python3 serve.py          # http://127.0.0.1:4788 (포트 중복 주의 — localhost는 IPv6로 딴 서버 붙을 수 있음)
# 또는 빌드 후 app/index.html 더블클릭(file://)
```

## 빌드 (편집 후)

```bash
node build.cjs        # core/* + app/store.js·theme.js → app/bundle.js (classic 스크립트)
node build-icons.cjs  # assets/icons → app/icons.js
node build-edm.cjs    # assets/edm/promo01 → app/edm/promo01.js (이미지 data-URI 인라인)
node --test test/     # esc·volume 단위 테스트
```

## 구조

```
app/                      라이브 앱 (전부 정적 — 백엔드 없음)
├─ index.html             생성 흐름 (종류 → 정보 → 스타일/브리프)
├─ dashboard/projects/resources/settings.html   셸 페이지 (shell.js SNB)
├─ studio/studio.html     스튜디오 — 채팅 생성 + 편집 (packMode가 타입별 규칙 단일 진실)
├─ store.js               IndexedDB 저장 (storeReady/storeFlush — 이동 전 flush 필수)
├─ packs.*.js             스타일 팩: krds·midas·aether(aglass)·edm·ppt
├─ llm.js                 BYOK LLM (사용자 API 키 → api.anthropic.com 직접 호출, PPT 내용 생성)
├─ export-pptx.js         PPT → .pptx (PptxGenJS)
├─ edm/promo01.js         eDM 템플릿 (build-edm.cjs 산출물)
└─ bundle.js              build.cjs 산출물 — 직접 편집 금지
core/                     번들 소스 + 팩 계약
├─ darkglow/              다크글로우 렌더러 (renderComposed)
├─ packs/contract.js      스타일팩 계약 (키스톤) · krds/·midas/ 팩 소스 · _template/ 새 팩 템플릿
└─ esc.js · volume.js · template.js
tools/pack-inspector.html 팩 계약 검사기
assets/                   빌드 입력 (아이콘·eDM 이미지)
docs/                     PRD·DS·팩 저작 가이드
```

## 데이터·저장

- 프로젝트: IndexedDB `onsite-webgen` (오리진별 — `localhost` ≠ `127.0.0.1` 주의)
- **변이 후 페이지 이동 전 `await storeFlush()`** — 안 하면 쓰기 경합으로 간헐 유실
- AI 키(BYOK): `localStorage`(이 브라우저에만) — 설정 → AI 생성에서 등록, 없으면 결정론 조립 폴백

## 타입별 스튜디오 규칙 — `packMode(stylePack)` (studio.html)

| 팩 | 흐름 | persist | 디바이스 | 특수 |
|---|---|---|---|---|
| 웹/랜딩 (darkglow·krds·midas·aglass) | 생성 채팅 | fields | 반응형 토글 | 섹션 리오더·스타일 교체 |
| edm | 편집전용 | raw(DOM 되쓰기) | 고정(760px) | 템플릿 시작 |
| ppt | 편집전용 | fields | 고정(16:9) | 슬라이드 패널·브리프 생성·.pptx |
