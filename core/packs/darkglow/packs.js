/* ============================================================
   darkglow/packs.js — 다크 글로우 스타일 팩 (에테르/바이올렛/엠버)
   출처: 사용자 Figma Make "Chat-based Web Generator" packs.ts 포팅
   토큰 DNA = 색·그라디언트·글로우·라운드·폰트. 렌더러 고정, 팩만 교체 → 즉시 리스킨.
   ============================================================ */

/** @typedef {Object} DarkPack
 *  @property {string} id @property {string} name @property {string} desc @property {string} swatch
 *  @property {Object} tokens  bg,bgAccent,surface,surfaceBorder,text,textMuted,accent,accentSoft,
 *                             accentText,heroGradient,ctaGradient,glow,grid,radius,font
 */

export const DARK_PACKS = [
  {
    id: 'aether', name: '에테르', desc: '다크 · 시안 글로우',
    swatch: 'linear-gradient(135deg,#0a0e1a,#0e2a3a,#22d3ee)',
    tokens: {
      bg: '#070a12', bgAccent: 'rgba(34,211,238,0.10)',
      surface: 'rgba(255,255,255,0.035)', surfaceBorder: 'rgba(255,255,255,0.08)',
      text: '#eaf2ff', textMuted: '#8a97b0',
      accent: '#22d3ee', accentSoft: 'rgba(34,211,238,0.14)', accentText: '#04141a',
      heroGradient: 'radial-gradient(120% 90% at 50% -10%, rgba(34,211,238,0.20) 0%, rgba(56,189,248,0.08) 35%, rgba(7,10,18,0) 70%)',
      ctaGradient: 'linear-gradient(135deg,#22d3ee,#38bdf8,#818cf8)',
      glow: 'rgba(34,211,238,0.35)', grid: 'rgba(255,255,255,0.04)',
      radius: '16px', font: "'Inter','Pretendard',system-ui,sans-serif",
    },
  },
  {
    id: 'violet', name: '바이올렛', desc: '다크 · 네온 퍼플',
    swatch: 'linear-gradient(135deg,#0b0716,#3b0764,#a855f7)',
    tokens: {
      bg: '#0a0712', bgAccent: 'rgba(168,85,247,0.12)',
      surface: 'rgba(255,255,255,0.04)', surfaceBorder: 'rgba(255,255,255,0.09)',
      text: '#f3eeff', textMuted: '#9c8fbf',
      accent: '#c084fc', accentSoft: 'rgba(192,132,252,0.16)', accentText: '#160a26',
      heroGradient: 'radial-gradient(120% 90% at 50% -10%, rgba(168,85,247,0.24) 0%, rgba(217,70,239,0.10) 35%, rgba(10,7,18,0) 70%)',
      ctaGradient: 'linear-gradient(135deg,#a855f7,#d946ef,#f472b6)',
      glow: 'rgba(192,132,252,0.4)', grid: 'rgba(255,255,255,0.04)',
      radius: '16px', font: "'Inter','Pretendard',system-ui,sans-serif",
    },
  },
  {
    id: 'ember', name: '엠버', desc: '다크 · 앰버 글로우',
    swatch: 'linear-gradient(135deg,#100a06,#3a1e05,#fb923c)',
    tokens: {
      bg: '#0c0906', bgAccent: 'rgba(251,146,60,0.12)',
      surface: 'rgba(255,255,255,0.035)', surfaceBorder: 'rgba(255,255,255,0.08)',
      text: '#fef3e9', textMuted: '#b09585',
      accent: '#fb923c', accentSoft: 'rgba(251,146,60,0.15)', accentText: '#1a0f06',
      heroGradient: 'radial-gradient(120% 90% at 50% -10%, rgba(251,146,60,0.22) 0%, rgba(244,63,94,0.10) 35%, rgba(12,9,6,0) 70%)',
      ctaGradient: 'linear-gradient(135deg,#fb923c,#f43f5e,#e11d48)',
      glow: 'rgba(251,146,60,0.35)', grid: 'rgba(255,255,255,0.04)',
      radius: '16px', font: "'Inter','Pretendard',system-ui,sans-serif",
    },
  },
];

export const DARK_PACK_BY_ID = Object.fromEntries(DARK_PACKS.map((p) => [p.id, p]));
