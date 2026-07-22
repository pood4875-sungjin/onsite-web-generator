/* ============================================================
   core/packs/krds/tokens.js — KRDS 출력 팩 토큰 (SSOT)
   출처: KRDS v1.0.0 (Community) Figma — fileKey OILUy443EILgdjCdB0nIDY
   Figma 바인딩 변수 실측 추출값. 섹션 변수 계약(styles/sections.css :root)을 덮어씀.
   정체성 = 정부·공공, Pretendard GOV, 정부블루 #256ef4, 각진 저-radius, 1px 헤어라인.
   ============================================================ */

// 섹션이 소비하는 CSS 변수 계약 → KRDS 값. (styles/sections.css :root 참조)
export const vars = {
  // brand — 정부 상징 블루 (border/primary), hover = text/primary 다크닝
  '--brand': '#256ef4',
  '--brand-hover': '#0b50d0',
  // ink (텍스트 위계) — bolder / basic / subtle / mid
  '--ink': '#131416',       // color/text/bolder
  '--ink-2': '#1e2124',     // color/text/basic
  '--muted': '#464c53',     // color/text/subtle
  '--soft': '#6d7882',      // mid gray (subtle↔divider 사이)
  // surface / line
  '--bg': '#ffffff',        // color/background/white
  '--bg-2': '#f4f5f6',      // gray-5 surface (alt band)
  '--line': '#cdd1d5',      // color/divider/gray-light (헤어라인)
  '--line-2': '#b1b8be',    // color/border/gray
  // signal (KRDS system)
  '--info': '#256ef4', '--info-bg': '#eaf2fe',
  '--warn': '#ff9200', '--warn-bg': '#fff3e2',
  '--danger': '#e53535', '--danger-bg': '#fdeaea',
  '--ok': '#00875a', '--ok-bg': '#e6f4ec',
  // 형태 — KRDS radius ladder (저-radius, 정식 톤)
  '--radius': '8px',        // radius/medium4
  '--radius-sm': '4px',     // radius/small2
  // 폰트 — Pretendard GOV (오프라인/CDN 미보유 시 Pretendard 폴백, 시각 동일)
  '--font-sans': '"Pretendard GOV","Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Noto Sans KR",sans-serif',
  '--font-display': '"Pretendard GOV","Pretendard Variable",Pretendard,system-ui,sans-serif',
  '--font-mono': '"SF Mono",ui-monospace,Menlo,Consolas,monospace',
};

// 인스펙터 스와치 패널용 그룹 (표시 순서/라벨)
export const swatchGroups = [
  { label: 'Brand', keys: ['--brand', '--brand-hover'] },
  { label: 'Ink (텍스트)', keys: ['--ink', '--ink-2', '--muted', '--soft'] },
  { label: 'Surface / Line', keys: ['--bg', '--bg-2', '--line', '--line-2'] },
  { label: 'Signal', keys: ['--info', '--info-bg', '--warn', '--warn-bg', '--danger', '--danger-bg', '--ok', '--ok-bg'] },
];

// KRDS 타입 램프 (font-size/*, lineHeight 1.5) — Pretendard GOV
export const typeRamp = [
  { name: 'display / medium', size: 44, weight: 700 },
  { name: 'heading / medium', size: 24, weight: 700 },
  { name: 'title (nav) / medium', size: 24, weight: 700 },
  { name: 'body / large', size: 19, weight: 400 },
  { name: 'body / medium', size: 17, weight: 400 },
  { name: 'label / medium', size: 17, weight: 400 },
  { name: 'depth / medium', size: 17, weight: 400 },
];

// KRDS 스페이싱 (gap/padding 실측)
export const spaceScale = [4, 8, 12, 16, 20, 24, 40, 64, 80];

// KRDS radius ladder
export const radiusScale = [
  { name: 'small2', v: 4 }, { name: 'medium2', v: 6 },
  { name: 'medium4', v: 8 }, { name: 'xlarge2', v: 12 },
];
