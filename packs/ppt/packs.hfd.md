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

**이미지 계약**: 업로드 이미지는 덱 루트 `data.images{키:dataURL}` — media=`images.media`, 카드=`images['card-슬라이드idx-카드idx']`, 포토=`images['photos-슬라이드idx-i']`, 히어로=`images['hero-슬라이드idx']`. 렌더러가 있으면 `<img>`, 없으면 `.hf-imgph` 슬롯(클릭 업로드). 카드 이미지는 셀 상단 풀블리드(여백 0).

**+3타입(2026-08-21)**: word(한 단어 대형 타이포) · statement(타이틀+서브 중앙) · hero(풀블리드 배경 이미지+중앙 텍스트, 비프레임). photos frame 변형=대형 이미지 케이스(풀폭 프레임).

**+4타입·변형 3종(2026-08-21 저녁, 카카오 밸류업 자료 이식)**: matrix(좌 이니셜+그룹 패널, ESG형 고밀도) · triple(헤더 밴드 3열 보드) · quad(사분면+중앙 원 허브) · org(계층 구조도) / toc `variant:"panel"`(좌 컬러면+우 라운드 패널 CONTENTS) · kpi `variant:"badge"`(넘버 뱃지+대형 수치) · chart `variant:"waterfall"`(계단 누적+total+vs·GAP 칩 — 바는 absolute, margin%는 폭 기준이라 금지).

**+9타입(2026-08-21, 카카오 인적분할 IR 52p 레이아웃 이식)**: duo(수치 2패널+칩, p32·43) · flow(전환 구조도 전→후, p5) · hsteps(가로 노드 타임라인, p8) · profile(뱃지+딥 헤더+포커스 카드 2~3열, p6·27) · band(딥 밴드 선언+하단 카드 3~5, p26) · halfimg(좌 딥 패널+우 절반 이미지 `images['half-i']`, 비프레임, p25·35) · chart(막대+코멘트, 수치 실측만, p12) · cycle(상하 아크+중앙 허브 순환, 이중 중대성 다이어그램) · dash(미니 차트 카드—bars/donut/area—+스탯 스트립). 실전 검증 덱 = `docs/deck-kakao-hfd.html`(29장, 러닝헤드 kicker 치환+로고 숨김 후처리 예시 포함).

**+2026 필(pill) 기하 13종(2026-08-24, Figma 538:2 G/M 30프레임 실측)**: 신규 타입 agenda(잉크 패널 발표 순서, 뱃지 블루 --bdg)·sidebar(+num 변형)·screen(우 대형 이미지 패널, images['screen-i'])·note(+band)·circles(겹침 원 2~3, mix-blend multiply) / 변형 cover pill·pill2, divider pill·pill2, photos quad(4이미지)·frame3(3이미지), statement frame(비프레임 예외). 테마 확장톤 7종(--sg/--p1/--p2/--md/--cg/--dt/--ik2) = THEMES2: green·teal 실측, cyan·indigo는 HLS 오프셋 유도(md=b L+.13 등 — green 재현 검증). 원호는 **타원 코너 사각**(border-radius x/y)으로 — 원+클립은 PPTX에서 클립 무시로 통째 삐져나옴. 프레임 보더도 스팬(.hp-stframe) 분리(섹션 border는 DOM 워커 미추출). 워드마크=hpWm() 텍스트 2줄.

**PPTX 폰트 이식성(2026-08-24 사용자 실측 반영)**: 수신 환경에 Pretendard SemiBold·Regular만 있는 경우 흔함(Bold 없음) — export-pptx faceOf()가 Pretendard 계열은 합성 bold 금지, weight≥600→페이스명 'Pretendard SemiBold'/그 외 'Pretendard'로 내보냄. 런 병합 판정에 fontFace 포함(빠뜨리면 굵은 런 소실).

2026-08-21 피드백 반영: 프레임 장 틴트 원(`.hf-deco`) 숨김(콘텐츠 겹침), 전역 `ul{padding:0}`(리스트 좌정렬), `.hf-lab.wh` 화이트(로드맵 NOW·프로세스 STEP 라벨 안 보이던 버그), toc 전 행 옅은 틴트+검정(5행), 카드 gap 16px, stats/media/timeline 강조 박스 제거(심플), checklist 행이 패널 높이 분할, media 우측 이미지 컬럼 확대·스트레치, kpi 콘텐츠 중앙, process 카드 허그, compare 플레인 문장, photos grid 타이틀 패널 중앙.

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
- studio에는 팩 렌더 체인이 **두 곳**: `renderDeckFor`(라이브 생성·썸네일·HTML 내보내기)와 뷰어/미리보기 체인. 한쪽만 배선하면 라이브 생성이 레거시 ppt 렌더러로 떨어져 "스타일 안 나옴"(2026-08-21 실사고 — renderDeckFor 누락).
- **덱 루트 필드는 renderDeckFor payload에 명시 동봉해야 한다** — payload는 data 전체가 아니라 조립 객체라 `theme`·`images` 같은 루트 필드를 빼먹으면 썸네일·라이브만 기본 테마/빈 이미지로 갈라진다(2026-08-21 실사고 — 컬러칩 저장은 됐는데 좌측 레일만 그린 고정). 뷰어(openPreview)는 data 원본을 통째로 넘겨서 무사했음.
