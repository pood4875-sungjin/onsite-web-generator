# orbit — Global MBM (웹/랜딩)

1. **정체** — Wanted global-company 참고. 다크 네이비·멀티컬러 그라데이션(#0091FF/#717EFF/#FF8EBD)·**WebGL 리얼맵 지구**(Natural Earth 래스터 텍스처+도시 핑)·스탯 카운트업·CTA 그라데이션 팬.
2. **상태** — 활성, 웹 피커 3종 중 하나. **시연 잠금** 있음.
3. **구성** — 고정 TEMPLATE(`renderOrbitPage`): GNB→히어로(지구본+카운트다운)→세션 리스트→스탯(80px 카운트업)→일정·장소(구글맵)→FAQ→CTA→푸터.
4. **데이터 계약** — compose-web 평면 스키마 + DEMO/DEMO_EN + TT 4언어.
5. **고정 요소(시연)** — `TCH` 필드별 양보: `navTitle`='MIDAS GEN NX Seminar 2026', `tagline`=언어별 확정 문구.
6. **특이 규칙·함정**
   - 지구 캔버스: **absolute+inset은 canvas(replaced)에 크기 미적용 → width/height 95% 명시**. WebGL 실패=CSS 폴백, motion off=정지 1프레임, 캡 1536
   - 텍스처는 경도 언랩 스캔라인(안티메리디안 가로 띠 방지)
   - 타이틀 마진: `.ob-slist/.ob-info/.ob-qs`의 `margin` **쇼트핸드 자체에 60px auto**(후행 쇼트핸드가 `.ob-tt+*`를 덮는 사고)
   - 스탯 카운트업은 접두/콤마/소수 보존, 종료 시 원문 복원
   - zh/ja: Noto 1순위 + `.ob-ht{font-weight:500}`
7. **배선** — axday와 동일 7곳 세트.
