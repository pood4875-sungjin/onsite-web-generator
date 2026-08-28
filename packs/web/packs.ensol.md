# packs.ensol.js — Ensol Release (제품 릴리즈 이벤트 랜딩)

## 1. 정체성
CIVIL NX 2026 릴리즈 웨비나 씨드의 팩화. 블루 그라데이션(#3186ff→#346bf0→#4ea0ff) · 다크 #040308 · 각진 버튼(라운드 0) · 영상 히어로 핀 스크럽 · 좌측 snav 도트.
원본 시안: `packs.ensol.sample.html` · 베리에이션 카탈로그: `docs/sections-ensol.html`(25블록).

## 2. 계약
- `renderEnsolPage(shared, {volume, motion})` → 완성 HTML 문서 반환 (volume 미사용, motion=false 시 nomo 정적)
- `ENSOL_SECTION_SPEC` (template/fixed/labels) · `ENSOL_STYLE` (id: `ensol`)
- 데이터: compose-web 평면 스키마(productName·tagline·navTitle·navLinks·primaryCta·secondaryCta·eventDate·bannerText·features[3]·agenda[5]·faq·ctaTitle·ctaSub·footerCopyright).
- 팩 전용 필드(스키마 밖 — DEMO 폴백, 인라인 편집으로만 수정): `kvNote`·`whyEyebrow`·`answerTitle`·`skillTitle`·`skills[5]`(tab/title/desc/badge)·`featureTitle`·`featureSub`·`fitems[3]`·`regTitle`·`formCta`·`doneTitle`·`doneText`·`dockText`·`footerBrand`.
- agenda 항목 확장 필드: `txt`(드로어 본문)·`pts[]`(포인트)·`img|vid`(드로어 미디어) — 리스트 li의 data-속성으로 실려 드로어가 DOM에서 읽음.

## 3. 타이틀 문법
줄 단위: 첫 줄 `.lw`(500) → 이후 `.hw`(700). `**마커**` = 블루 그라데이션 `.gt`.
적용 필드: answerTitle·skillTitle·featureTitle·agendaTitle·regTitle·ctaTitle + bannerText(KV 미션 멘트 줄들).
섹션 타이틀 `clamp(44px,4.8vw,84px)` — 대형 모니터 반응. GNB·footer 내용은 max 1920 컨테인.

## 3.5 섹션 어휘 (movable 7 + 고정)
answer(오버랩 그래픽 카드 3 — features) · skill(자동재생 탭 5 — skills, 6초 프로그레스·모바일 아코디언 전환)
· feature(좌 sticky 타이틀 + 우 카드 3 — fitems) · agenda(다크 리스트 + 우측 드로어 + Prev/Next)
· register(블루 그라 배경 + 플로팅 라벨 폼 7필드 + 제출 시 done 전환) · faq(아코디언) · free(데이터 웨이브 캔버스 CTA).
고정: GNB(투명→글래스) · KV 핀(220vh 스크럽 + answer 실높이 오버랩) · footer · dock(플로팅 바, hiddenSections로 숨김).
answer를 숨기면 KV는 100vh 정적 히어로로 강등(오버랩 대상 부재).

## 4. 모션
KV 스크럽(타이포 페이드 22~38% → 배경 블러+오버레이 28~52% → 미션 멘트 40~54%) — `fitOverlap()`이 KV 높이를
`220vh + answer 실높이`로 동적 계산(화면 세로가 answer보다 커도 영상 누출·여백 증가 없음. 호출은 반드시 kv 참조 확보 뒤).
+ 타이틀 글자/단어 스태거 · 카드 3 오버랩 등장(0/.45/.9s) · 탭 자동재생 · 드로어 슬라이드 · 웨이브 캔버스(마우스 융기·IO로 뷰포트 밖 정지).
부트는 `ensolBoot.toString()` 직렬화 주입 — **함수 안 주석은 영문만**(EN 렌더 한국어 0 검증에 걸림).
motion=false → `html.nomo`: 핀·오버랩 해제, 전부 표시, sub2·독·웨이브·프로그레스 제거. 탭 클릭 전환은 버튼 인라인 폴백으로 nomo에서도 동작.

## 5. 자산
히어로 영상 `app/bg/ensol-hero.mp4`(로컬. 씨드의 원격 vod 88MB는 팩에서 미사용 — 외부망 차단·행 방지).
카드 `ensol-kv2/3/4.avif` · 탭 `ensol-skill1~5.jpg` · 피처 `mbmtoss-hero3/session/network.jpg`(공유).
이미지 슬롯: hero / answer1~3 / skill1~5 / feat1~3 (onerror 로컬→프로드 2단 폴백). imgs.hero에 .mp4/.webm이면 video.

## 6. 언어
TT 4언어(ko/en/ja/zh) — 폼 7필드 라벨·FAQ 헤더·드로어 Prev/Next/닫기. DEMO(KO 번역)/DEMO_EN(씨드 원문) 쌍.
CJK는 Noto Sans JP/SC 1순위 로드.

## 7. 함정
- KV 핀은 `body{overflow-x:clip}` 필수 — css()에 포함
- `fitOverlap()` 최초 호출은 kv 셀렉트 뒤(앞이면 TypeError로 부트 전체 사망 — 씨드에서 실사고)
- 드로어 콘텐츠는 li data-속성 경유라 agenda 편집(title/by/time)은 리스트에서, txt/pts는 데이터로만
- 좌측 snav 도트는 `data-snav` 섹션 자동 수집 — 섹션 추가 시 속성만 붙이면 도트 따라옴(다크 구간은 `data-dark`)
