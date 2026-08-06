# mbm — Civil Blue (웹/랜딩)

1. **정체** — Figma 236:54126 실측(1920×7952). 화이트 GNB #FAFCFE·다크블루 히어로+교량 실사·챕터 지그재그 3(그라데이션 타이틀)·다크 선언·FAQ 아코디언·다크틸 CTA·신청 폼.
2. **상태** — 활성, 웹 피커 3종 중 하나. **시연 잠금** 있음.
3. **구성** — 고정 TEMPLATE(`renderMbmPage`): GNB(앵커 #about/#program/#info/#faq)→히어로(bg/mbm-hero.jpg)→카운트다운→챕터×3(이미지 슬롯, onerror 모형 폴백)→세션→일정·장소(구글맵)→선언→FAQ→폼(#apply)→푸터.
4. **데이터 계약** — compose-web 평면 스키마 + DEMO/DEMO_EN + TT(폼 라벨 포함 4언어 — LANG≠ko면 폼 라벨 기본값 주입).
5. **고정 요소(시연)** — `TCH` 필드별 양보: `navTitle`='MIDAS GEN NX Seminar 2026', `tagline`=언어별 확정 문구.
6. **특이 규칙·함정**
   - 히어로 `.wrap{width:100%}`(flex 부모 fit-content 밀림 방지), ≤960 `.mb-navcta{margin-left:auto}`
   - zh/ja: Noto 1순위 + `.mb-ht{font-weight:500}`
   - 그라데이션 타이틀은 챕터 순서 고정 팔레트(블루→틸→그린)
7. **배선** — axday와 동일 7곳 세트.

## 디자인 DNA (스타일 이식용)

- **무드**: 토목 엔지니어링 신뢰감 — 블루 계열 + 실사(교량) 히어로.
- **팔레트**: GNB #FAFCFE · 히어로 다크블루 #006BDE→#1E90F0 · 챕터 그라데이션 3종(블루 #165FCE→#448EFE / 틸 #007DA0→#00BDDE / 그린 #54BA0A→#6BE016)+틴트 지면(#E4EBF4/#F0F7F7/#EBF2E6) · 선언 #0C0D0D · CTA 다크틸 #065454→#071E21.
- **타이포**: 히어로 72px/라이트 300/자간 -4.4%(CJK 500). 챕터 타이틀은 그라데이션 텍스트. 강약 = 첫 줄 라이트·둘째 볼드 700.
- **모티프**: 지그재그 챕터(글+이미지 교차), 카운트다운, 카드 r12, FAQ 아코디언(열린 Q #1BB9CD).
