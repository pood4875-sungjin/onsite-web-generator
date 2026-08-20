# packs.mbmtoss.js — Toss Green (세미나·이벤트 랜딩)

## 1. 정체성
SK MBM 랜딩 콘텐츠 × toss.im 실측 스케일/모션 번안. 그린 포인트(#05D16E) · 다크그레이 히어로 · 다크그린 세션 존.
원본 시안: `packs.mbmtoss.sample.html` (실측 근거 주석 포함).

## 2. 계약
- `renderMbmtossPage(shared, {volume, motion})` → 완성 HTML 문서 반환 (volume 미사용, motion=false 시 전면 정적)
- `MBMTOSS_SECTION_SPEC` (template/fixed/labels) · `MBMTOSS_STYLE` (id: `mbmtoss`)
- 데이터: compose-web 평면 스키마. 팩 전용 필드 `zigs[]`(cap/title/desc)·`benefits[]`(cap/title/link)는 스키마 밖 — DEMO 폴백, 인라인 편집으로만 수정.

## 3. 섹션 어휘 (movable 11 + 고정)
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
