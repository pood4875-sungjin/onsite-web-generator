/* ============================================================
   core/packs/krds/layout.js — KRDS 레이아웃 (②층)
   컨테이너·그리드·브레이크포인트. KRDS 반응형 3-tier.
   ============================================================ */
export const layout = {
  container: '1200px',      // KRDS 데스크톱 콘텐츠 폭
  gutter: '24px',
  breakpoints: { sm: 600, md: 768, lg: 1024 },  // 모바일 / 태블릿 / 데스크톱
};

/** 레이아웃 base CSS — 컨테이너·반응형 유틸. .krds 스코프에서 동작. */
export function layoutCss() {
  const { container, breakpoints: bp } = layout;
  return `
  .krds{font-family:var(--font);color:var(--ink-2);line-height:var(--lh);background:var(--bg);-webkit-font-smoothing:antialiased}
  .krds *{box-sizing:border-box}
  .krds .container{max-width:${container};margin:0 auto;padding-left:24px;padding-right:24px}
  .krds .band{padding:72px 0}
  .krds .band--alt{background:var(--bg-2)}
  .krds .grid{display:grid;gap:24px}
  .krds .cols-3{grid-template-columns:repeat(3,1fr)}
  .krds .cols-2{grid-template-columns:repeat(2,1fr)}
  .krds .stack{display:flex;flex-direction:column}
  .krds h1,.krds h2,.krds h3{margin:0;line-height:var(--lh-tight);color:var(--ink);letter-spacing:-.01em}
  .krds p{margin:0}
  .krds a{color:inherit;text-decoration:none}
  /* 태블릿 이하 */
  @media (max-width:${bp.lg - 1}px){
    .krds .cols-3{grid-template-columns:repeat(2,1fr)}
    .krds .band{padding:56px 0}
  }
  /* 모바일 */
  @media (max-width:${bp.md - 1}px){
    .krds .cols-3,.krds .cols-2{grid-template-columns:1fr}
    .krds .band{padding:44px 0}
    .krds .hide-sm{display:none!important}
    .krds .container{padding-left:16px;padding-right:16px}
  }`;
}
