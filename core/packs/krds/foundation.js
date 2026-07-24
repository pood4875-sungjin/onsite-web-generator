/* ============================================================
   core/packs/krds/foundation.js — KRDS 파운데이션 (①층)
   출처: KRDS v1.0.0 Figma 실측 + KRDS 규약. 색은 CSS 변수로 노출.
   ============================================================ */

// 파운데이션 = CSS 변수 계약(팩 컴포넌트/섹션이 참조하는 SSOT)
export const vars = {
  // brand
  '--brand': '#256ef4', '--brand-hover': '#0b50d0', '--brand-weak': '#eaf2fe',
  // ink (텍스트 위계)
  '--ink': '#131416', '--ink-2': '#1e2124', '--muted': '#464c53', '--soft': '#6d7882',
  '--on-brand': '#ffffff',
  // surface / line
  '--bg': '#ffffff', '--bg-2': '#f4f5f6', '--bg-3': '#eef2f7',
  '--line': '#cdd1d5', '--line-2': '#b1b8be',
  // signal
  '--info': '#256ef4', '--info-bg': '#eaf2fe',
  '--warn': '#ff9200', '--warn-bg': '#fff3e2',
  '--danger': '#e53535', '--danger-bg': '#fdeaea',
  '--ok': '#00875a', '--ok-bg': '#e6f4ec',
  // radius (KRDS ladder)
  '--radius-xs': '4px', '--radius-sm': '6px', '--radius': '8px', '--radius-lg': '12px',
  // border
  '--bw': '1px',
  // type scale (KRDS font-size)
  '--fs-display': '44px', '--fs-h1': '32px', '--fs-h2': '24px', '--fs-h3': '19px',
  '--fs-body': '17px', '--fs-body-sm': '15px', '--fs-label': '14px', '--fs-cap': '13px',
  '--lh': '1.5', '--lh-tight': '1.3',
  // fonts (Pretendard GOV → Pretendard 폴백, 시각 동일)
  '--font': '"Pretendard GOV","Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,system-ui,"Apple SD Gothic Neo","Noto Sans KR",sans-serif',
  '--font-mono': '"SF Mono",ui-monospace,Menlo,Consolas,monospace',
  // shadow (KRDS는 절제 — elevated 표면만)
  '--shadow-1': '0 1px 2px rgba(19,20,22,.06)',
  '--shadow-2': '0 4px 16px rgba(19,20,22,.10)',
};

/** :root(또는 scope)에 파운데이션 변수 방출 */
export function foundationCss(scope = ':root') {
  const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${scope}{\n${body}\n}`;
}

// ── 인스펙터 문서용 메타 ──
export const swatchGroups = [
  { label: 'Brand', keys: ['--brand', '--brand-hover', '--brand-weak'] },
  { label: 'Ink', keys: ['--ink', '--ink-2', '--muted', '--soft'] },
  { label: 'Surface / Line', keys: ['--bg', '--bg-2', '--bg-3', '--line', '--line-2'] },
  { label: 'Signal', keys: ['--info', '--warn', '--danger', '--ok'] },
];
export const typeRamp = [
  { name: 'display', varKey: '--fs-display', px: 44, weight: 700 },
  { name: 'heading1', varKey: '--fs-h1', px: 32, weight: 700 },
  { name: 'heading2', varKey: '--fs-h2', px: 24, weight: 700 },
  { name: 'heading3', varKey: '--fs-h3', px: 19, weight: 700 },
  { name: 'body', varKey: '--fs-body', px: 17, weight: 400 },
  { name: 'label', varKey: '--fs-label', px: 14, weight: 500 },
  { name: 'caption', varKey: '--fs-cap', px: 13, weight: 400 },
];
export const spaceScale = [4, 8, 12, 16, 20, 24, 40, 64, 80];
export const radiusScale = [
  { name: 'xs', v: 4 }, { name: 'sm', v: 6 }, { name: 'md', v: 8 }, { name: 'lg', v: 12 },
];
export const shadowScale = [
  { name: 'shadow-1', v: 'var(--shadow-1)' }, { name: 'shadow-2', v: 'var(--shadow-2)' },
];
