/* ============================================================
   core/packs/krds/pack.js — KRDS 스타일 팩
   섹션 렌더러(styles/sections.css + sections/registry.js) 세계용 출력 팩.
   렌더러 고정, 이 팩의 :root 오버라이드만 주입 → 전체 KRDS 리스킨.
   ============================================================ */
import { vars, swatchGroups, typeRamp, spaceScale, radiusScale } from './tokens.js';

/** :root 변수 오버라이드 CSS 문자열. scope 바꾸면 부분 적용 가능. */
export function tokensCss(scope = ':root') {
  const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${scope}{\n${body}\n}`;
}

export const krdsPack = {
  meta: {
    id: 'krds',
    name: 'KRDS',
    desc: '대한민국 정부 디자인 시스템 v1.0.0 — 공공·정식, 정부블루 #256ef4, 저-radius 헤어라인',
    source: 'KRDS v1.0.0 (Community) · Figma OILUy443EILgdjCdB0nIDY',
    world: 'sections',           // sections.css 변수 계약 세계 (vs darkglow)
    motionDefault: 'subtle',
  },
  vars,
  tokensCss,
  // 섹션 × variant — 정부·정식 톤. 미지정 카테고리는 인스펙터가 첫 variant로 폴백.
  variantMap: {
    nav: 'solid',
    cta: 'support',
    footer: 'sitemap',
  },
  // 인스펙터 표시용 부가 데이터
  swatchGroups,
  typeRamp,
  spaceScale,
  radiusScale,
};

export default krdsPack;
