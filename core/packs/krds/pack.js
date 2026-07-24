/* ============================================================
   core/packs/krds/pack.js — KRDS 풀 스타일팩 (계약 구현체)
   대한민국 정부 디자인 시스템 v1.0.0. 파운데이션~모션 전 층 자기완결.
   출처: KRDS v1.0.0 (Community) Figma OILUy443EILgdjCdB0nIDY (실측 + 규약).
   ============================================================ */
import { vars, foundationCss, swatchGroups, typeRamp, spaceScale, radiusScale, shadowScale } from './foundation.js';
import { layout, layoutCss } from './layout.js';
import { motion } from './motion.js';
import { components, componentsCss, gallery } from './components.js';
import { sections, sectionsCss } from './sections.js';

export const krdsPack = {
  meta: {
    id: 'krds',
    name: 'KRDS',
    desc: '밝은 신뢰 블루 — 라이트, 선명한 블루 강조 #256ef4, 저-radius 1px 헤어라인, Pretendard',
    source: 'KRDS v1.0.0 (Community) · Figma OILUy443EILgdjCdB0nIDY',
  },
  rootClass: 'krds',           // renderPage가 body를 이 클래스로 래핑 → 스코프 CSS
  foundation: vars,
  layout,
  motion,
  components,
  sections,

  /** 파운데이션 + 레이아웃 + 컴포넌트 + 섹션 base CSS 전부 방출 */
  globalCss(/* ctx */) {
    return [
      // 폰트 (Pretendard GOV 미보유 시 Pretendard 폴백)
      '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css");',
      foundationCss(':root'),
      'body{margin:0;background:var(--bg)}',
      layoutCss(),
      componentsCss(),
      sectionsCss(),
    ].join('\n');
  },

  // 인스펙터 문서용
  docs: { swatchGroups, typeRamp, spaceScale, radiusScale, shadowScale, gallery },
};

export default krdsPack;
