# packs.skmbm.js — SK MBM (구 Toss Green·내부 id: mbmtoss) (세미나·이벤트 랜딩)

## 1. 정체성
SK MBM 랜딩 콘텐츠 × toss.im 실측 스케일/모션 번안. 그린 포인트(#05D16E) · 다크그레이 히어로 · 다크그린 세션 존.
원본 시안: `packs.skmbm.sample.html` (실측 근거 주석 포함).

## 2. 계약
- `renderMbmtossPage(shared, {volume, motion})` → 완성 HTML 문서 반환 (volume 미사용, motion=false 시 전면 정적)
- `MBMTOSS_SECTION_SPEC` (template/fixed/labels) · `MBMTOSS_STYLE` (id: `mbmtoss`)
- 데이터: compose-web 평면 스키마. 팩 전용 필드 `zigs[]`(cap/title/desc)·`benefits[]`(cap/title/link)는 스키마 밖 — DEMO 폴백, 인라인 편집으로만 수정.

## 2.5 컬러 테마 5종 (theme 필드)
`shared.theme` = green(기본)·blue·purple·orange·red. 포인트/딥/민트/진한 텍스트/세션 존/카드 톤이 세트로 스왑.
CSS는 var(--brand) + color-mix 기반이라 팩 전체(버튼·칩·차트·지도 SVG·존 배경)가 한 번에 따라온다.

## 3. 디자인 베리에이션 (variants 필드)
`shared.variants = { 섹션: 변형명 }` — 미지정 시 기본형. 전체 사전 = docs/sections-skmbm.html — 피그마 "행사 랜딩 12블록" 정의 체계(Design Generator 484-83314)로 그룹핑된 82블록. 그룹 헤더에 피그마 정의(역할·반복·CTA·데이터 필드), 라이브 프레임(프레임 내 스크롤=실모션)·테마 5종 스위처·전체 페이지 모달.
- hero: video(기본·imgs.hero가 mp4/webm) / photo(jpg·png 자동) / **light**(흰 배경 타이포 온리·핀 없음·GNB 화이트 고정)
- about: count(기본 3열) / **dark**(잉크 밴드 대형 수치 — 배경 브레이크) / **chart**(좌 카피+우 바 차트, 마지막 항목 강조)
- areas: scrub(기본 핀) / **grid**(정적 2×2 파스텔 카드)
- narrative: blur(기본 핀) / **statement**(정적 센터 선언)
- session: dark(기본 존) / **timetable**(라이트 흰 카드 rows)
- event: cards(기본) / **list**(아이콘 리스트 2열·이미지 없음)
- faq: accordion(기본) / **cards**(2열 상시 노출)
- ctaband: gradient(기본) / **dark**(잉크 밴드)
- location: map(기본) / **simple**(지도 없는 센터 카드)

## 3.5 섹션 어휘 (movable 11 + 고정)
about(수치 3열 카운트업·stats 없으면 자동 숨김) · chips(칩 슬로건·features<2면 숨김) · areas(스텝 스크럽 340vh+파스텔 글래스 패널, features≤4)
· narrative(다크 블러 리빌 250vh, bannerText 줄 단위·숫자 자동 카운트업+민트 hl) · session(다크그린 존) · zig(지그재그 3)
· typeline(타이핑 스크럽 220vh — ghost→잉크 채움+캐럿) · event(혜택 카드 3) · location(지도 SVG — 역명은 eventPlace 둘째 줄 첫 어절 자동)
· faq(아코디언) · ctaband(흐르는 그라데이션+블롭). 고정: GNB·KV 핀 280vh(영상/실사)·apply 폼·footer·dock(플로팅 CTA, hiddenSections로 숨김).

## 4. 모션
핀 스크럽 4종(히어로 축소+블러/스텝/내러티브/타이핑) + 배경 존 전환(body 배경색, 판정선 78%, h.place 문법) + 리빌·카운트업·칩 팝·독.
reduced-motion과 motion:false 모두 → 핀 해제·완성 상태 정적(media 블록과 `html.nomo` 이중 출력, `mkStatic()`).

## 5. 자산
히어로 영상 `app/bg/mbmtoss-hero.mp4`(540p, 원본 96MB는 sources/video) + 포스터 `mbmtoss-hero3.jpg`.
세션 3·지그재그 3·이벤트 3종 `mbmtoss-*.jpg`. 이미지 슬롯: hero / session.N / zig.N / event.N (onerror 로컬→프로드→ph 2단 폴백).
imgs.hero에 .mp4/.webm URL이 오면 video, 그 외 img로 렌더.

## 6. 언어
TT 4언어(ko/en/ja/zh) — 고정 라벨·폼 필드·슬로건 프레임·스텝 패널 미니 UI(ko/en). DEMO/DEMO_EN 쌍.
CJK는 Noto Sans JP/SC 1순위 로드.

## 7. 함정
- KV 핀은 `body{overflow-x:clip}` 필수(hidden이면 크롬 sticky 파괴) — css()에 포함됨
- 타이핑 스크럽 초기화는 리스너 등록·즉시호출보다 먼저 와야 함(현재 순서 유지)
- 배경 존 마커(data-bg)는 narrative·session 두 곳 — 추가 시 판정선(0.78)과 궁합 확인
