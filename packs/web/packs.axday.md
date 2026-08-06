# axday — Ensol MBM (웹/랜딩)

1. **정체** — h.place AX Day 실측. 화이트+잉크 #030712, 오렌지 임팩트 #FF5500, pill 버튼, 다크 세션 카드, 미니멀 FAQ, 신청 폼.
2. **상태** — 활성, 웹 피커 3종 중 하나. **시연 잠금** 있음.
3. **구성** — 고정 TEMPLATE 자기조립(`renderAxdayPage(shared,{volume,motion})`): GNB(앵커+우측 신청 pill)→히어로(eyebrow+타이틀+두바이 사진)→기능 3→세션→일정·장소(구글맵)→FAQ→신청 폼→푸터. 섹션 컨트롤(data-section, tier=core/mid/rich).
4. **데이터 계약** — compose-web 평면 스키마 + `DEMO`/`DEMO_EN` 폴백 쌍 + TT 라벨 4언어.
5. **고정 요소(시연)** — `TCH=shared._touched` 필드별 양보:
   - GNB `productName`·`eyebrow` = 'MIDAS GEN NX Seminar 2026'
   - `tagline` = 언어별 확정 문구(EN 'Meet the Next Generation of\nStructural Design Workflow')
   - 히어로 사진 = `bg/dubai-hero.jpg`, 중간 사진 = `PIN_MID` 시퀀스(렌더마다 `_pinI` 리셋)
6. **특이 규칙·함정**
   - mixT: 첫 줄 라이트·둘째 볼드(b=700), CJK 글자 분할+구두점 스냅
   - zh/ja: Noto **1순위** + `.ax-ht{font-weight:500}`(300은 한자 실낱)
   - `.ax-ph`엔 'ph' 클래스 같이 붙여야 높이 적용 / 카운트다운 무효·지남=D-12 폴백
   - 이미지 onerror 2단(로컬→프로드→제거), BASE는 packs/ 폴더 strip
7. **배선** — 로드 7페이지 / index STYLES·recStyles·styleThumb / studio 해석·renderWith·sectionSpec / dashboard·projects / worker compose-web(WEB_SYSTEM)
