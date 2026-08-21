# packs.hfd.js — Happy Family Day (사내 행사 안내)

## 1. 정체성
MIDAS 해피 패밀리 데이 사내 행사 안내 덱 — 대표 전달용(받아서 바로 편집·인쇄 가능해야 함).
소스: Figma `ghk4kt84QwHGLL2vbe4ivB` 502-402 실측(2026-08-21). 표지 = 상/하 2밴드 + 좌측 대형 화이트 오버레이 원(rgba 255,255,255,.14) + 우하단 액센트 원. 내지 = 화이트 지면 + 동일 기하 장식(우하단 틴트 원·하단 밴드).

## 2. 계약
- `renderHfdDeck(data)` · `renderHfdViewer(data,opts)` · `hfdTemplateDeck()` · `hfdComposeDeck(brief)` · `HFD_SCHEMA_DOC/FIELD_DOC/TYPE_LABEL/CATALOG/MV_SEL/DEFAULT_DECK/STYLE/SLIDE_TYPES/THEMES` · `hfdNewSlide(type)`
- 슬라이드 1280×720, `.ppt-stack`, 전 텍스트 `data-edit`. 상태키 공통 계약(_pos/_hide/_fmt/_z/_ta/_fs/_tw) + `__clampSlide`.

## 3. 컬러 테마 4종 (표지 픽셀 실측)
`data.theme` = green(기본 #3D8A6B/#216254/#1B985E) · teal(#16848A/#2699AA/#2CCFDD) · cyan(#0097FF/#1F5BD0/#0321CB) · indigo(#3A6BE1/#2843A9/#090E8B).
CSS는 `body[data-th]` 변수 세트(--t/--b/--a/--tn/--dp) — **렌더 우상단 컬러칩**으로 즉시 전환(미리보기, `@media print` 숨김). AI는 덱 루트 `theme` 1개 출력.

## 4. 타입 13종 (독자 어휘 — HFD_ALLOWED)
cover · greeting(인사말) · toc(2~4 밴드 컬럼) · divider · section(2~4 포인트) · cards(2~4, 마지막/tone:dark=딥 셀, `img:true`면 셀 상단 이미지 슬롯) · timeline(당일 일정 — 행 전부 동일 톤, 강조 밴드 없음) · table(첫 열 150px·둘째 열 1.5fr) · checklist(5개 초과 2열) · media(안내 rows 플레인 헤어라인+이미지 슬롯) · photos(2~3) · quote(풀블리드 딥) · closing.

**이미지 계약**: 업로드 이미지는 덱 루트 `data.images{키:dataURL}` — media=`images.media`, 카드=`images['card-슬라이드idx-카드idx']`. 렌더러가 있으면 `<img>`, 없으면 `.hf-imgph` 슬롯(클릭 업로드). 2026-08-21 피드백 반영: 프레임 장 틴트 원(`.hf-deco`) 숨김(콘텐츠 겹침), 카드 gap 16px, stats/media/timeline 강조 박스 제거(심플), process 카드 허그(빈 공간 제거), compare 항목 헤어라인 행.

## 5. 배선 (pastel 풋프린트와 동일)
- 로드 4페이지: index·studio(../../)·dashboard·projects (settings/resources/icons는 pastel도 미로드 — 동일)
- index: PPT_VISIBLE·피커 테이블·packKind·compose 폴백 / studio: renderDeckFor·packMode(editOnly 체인)·payload style·renderWith·slide types·packById·PK맵·템플릿 폴백·뷰어(renderHfdViewer)·해석 체인
- dashboard/projects: renderForStyle·styleName·PPT_PACKS / export-pptx: TEXT_SEL(hf-*)·SHAPE_SEL(밴드·원·셀)
- AI 3곳: worker `HFD_SYSTEM`(compose)+`HFD_FIELD_DOC`(edit) / llm.js BYOK 분기+`HFD_ALLOWED` / parseDeck이 루트 `theme` 보존
- **워커 배포 필요**: `cd proxy && npx wrangler deploy` (로컬 코드만 반영된 상태)

## 6. 타이포·로고 대체
원본 표지 타이포·MIDAS 로고는 벡터(전용체) — Pretendard 700/800 + 이탤릭 워드마크 텍스트로 대체. 실로고 이미지가 필요하면 app/bg에 자산 추가 후 cover/logo() 교체.

## 7. 함정
- CJK(ja/zh) 폰트 주입(cjkHead) 미구현 — 국문 사내 행사 전제. 다국어 확장 시 naver 팩 패턴 이식.
- 컬러칩은 body[data-th]만 바꾼다 — 데이터(theme 필드)는 안 바뀜. 저장 컬러를 바꾸려면 채팅/인라인으로 theme 수정.
- studio.html 배선을 perl로 하지 말 것 — `||` 체인이 구분자와 충돌해 파일 전체가 깨진 사고(2026-08-21, git checkout으로 복구). Edit 도구로만.
