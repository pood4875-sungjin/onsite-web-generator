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
