/* AUTO-GENERATED classic 번들. 편집금지 */
(function(){
  var includesTier=window.includesTier||function(v,t){var V={compact:0,mid:1,heavy:2},T={core:0,mid:1,rich:2};return T[t]<=V[v]};

/* === core/packs/contract.js === */
/* ============================================================
   core/packs/contract.js — 스타일팩 계약 (키스톤)
   생성기 = 얇은 오케스트레이터. 팩 = 완전한 자기완결 DS.
   경계 = 의미 콘텐츠 스키마: page = 섹션 순서 × {type, content}.
   생성기는 픽셀 0. 팩이 파운데이션·레이아웃·브레이크포인트·컴포넌트·섹션·모션 전부 소유.
   ============================================================ */

/** 정식 섹션 타입(의미 단위). 팩은 이 타입들의 렌더러를 구현한다. */
const SECTION_TYPES = ['nav', 'hero', 'feature', 'stat', 'cta', 'footer'];

/**
 * @typedef {Object} Pack
 * @property {{id:string,name:string,desc:string,source?:string}} meta
 * @property {Object} foundation                 색·타입·space·radius·shadow 토큰
 * @property {{container:string,breakpoints:{sm:number,md:number,lg:number}}} layout
 * @property {(level:'static'|'subtle'|'rich')=>{css:string,js:string}} motion
 * @property {Object} components                 button/link/badge/card/nav … 헬퍼
 * @property {Object.<string,(content:Object,ctx:RenderCtx)=>string>} sections
 * @property {(ctx:RenderCtx)=>string} globalCss 파운데이션+레이아웃+base CSS
 */
/**
 * @typedef {Object} RenderCtx
 * @property {Object} f           foundation
 * @property {Object} layout
 * @property {string} motion      level
 * @property {Object} components
 * @property {Object} data        원본 page meta/sharedFacts (제품명 등 공용)
 * @property {Function} esc
 */

/**
 * 페이지 조립. pageDoc = { meta, sharedFacts, sections:[{type, slotValues}] }
 * (core/template.js buildPageDoc 산출물) → 자가포함 HTML 1파일.
 */
function renderPage(pageDoc = {}, pack, { motion = 'subtle' } = {}) {
  const data = { ...(pageDoc.sharedFacts || {}), ...(pageDoc.meta || {}) };
  const ctx = {
    f: pack.foundation,
    layout: pack.layout,
    motion,
    components: pack.components,
    data,
    esc,
  };

  const body = (pageDoc.sections || [])
    .map(({ type, slotValues }) => {
      const render = pack.sections && pack.sections[type];
      if (!render) { console.warn(`[pack ${pack.meta?.id}] no section renderer: ${type}`); return ''; }
      try { return `<div data-section="${esc(type)}">${render(slotValues || {}, ctx)}</div>`; }
      catch (e) { console.error(`[pack ${pack.meta?.id}] section '${type}' failed`, e); return ''; }
    })
    .join('\n');

  const mo = (pack.motion ? pack.motion(motion) : { css: '', js: '' });
  const title = esc(data.productName || data.name || '제품');
  const rc = pack.rootClass ? ` class="${esc(pack.rootClass)}"` : '';

  return `<!doctype html>
<html lang="ko" data-pack="${esc(pack.meta?.id || '')}" data-motion="${esc(motion)}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${pack.globalCss ? pack.globalCss(ctx) : ''}
${mo.css || ''}
</style>
</head>
<body>
<div${rc}>
${body}
</div>
${mo.js || ''}
</body>
</html>`;
}

/** 섹션 조각만 조립(인스펙터 프리뷰용) — 페이지 셸 없이 body 조각들 반환. */
function renderSectionsOnly(pageDoc, pack, { motion = 'subtle' } = {}) {
  const data = { ...(pageDoc.sharedFacts || {}), ...(pageDoc.meta || {}) };
  const ctx = { f: pack.foundation, layout: pack.layout, motion, components: pack.components, data, esc };
  return (pageDoc.sections || []).map(({ type, slotValues }) => {
    const r = pack.sections && pack.sections[type];
    if (!r) return { type, html: `<!-- no renderer: ${type} -->` };
    try { return { type, html: r(slotValues || {}, ctx) }; }
    catch (e) { return { type, html: `<!-- ${type} failed: ${e.message} -->` }; }
  });
}


/* === core/template.js === */

function buildPageDoc({ template, volume, content = {}, sharedFacts = {} }) {
  const sections = template.sections
    .filter((s) => includesTier(volume, s.tier))
    .map((s) => ({ type: s.type, slotValues: content[s.type] || {} }));
  return {
    meta: content.meta || {},
    sharedFacts,
    sections,
  };
}


/* === core/packs/midas/pack.js === */
/* ============================================================
   core/packs/midas/pack.js — MIDAS AX 스타일 팩 (계약 구현체)
   출처: MIDAS AX Design System (pood4875-sungjin.github.io/MIDAS-AX-Design-System)
   실측: css/tokens.css · base.css · layout.css · components.css + index.html 구조.
   사이트 그대로 재현 — 부유 그라디언트 광원(실제 PNG)+float 모션, GNB, hero(Poppins 72·글자 wave),
   p-card 그리드, btn-pill(hover 반전), footer. 모노크롬 라이트.
   표준: core/packs/spec.js (validatePack 통과).
   ============================================================ */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SITE = 'https://pood4875-sungjin.github.io/MIDAS-AX-Design-System/assets/images';

// ── ① 파운데이션 (tokens.css 실측) ──
const vars = {
  '--brand': '#1b1c1e', '--brand-hover': '#000000', '--brand-weak': 'rgba(112,115,124,0.08)', '--on-brand': '#f7f7f8',
  '--ink': '#171719', '--ink-2': 'rgba(46,47,51,0.88)', '--muted': 'rgba(55,56,60,0.61)', '--soft': 'rgba(55,56,60,0.28)',
  '--bg': '#ffffff', '--bg-2': '#f7f7f8', '--bg-3': 'rgba(112,115,124,0.08)',
  '--line': '#eaebec', '--line-2': 'rgba(112,115,124,0.16)',
  '--info': '#171719', '--info-bg': '#f7f7f8',
  '--warn': '#ff8a00', '--warn-bg': '#fff3e2',
  '--danger': '#ff4242', '--danger-bg': '#ffecec',
  '--ok': '#00bf40', '--ok-bg': '#e6f8ec',
  '--radius-xs': '8px', '--radius-sm': '8px', '--radius': '12px', '--radius-lg': '24px',
  '--bw': '1px',
  '--fs-display': '72px', '--fs-h1': '36px', '--fs-h2': '28px', '--fs-h3': '24px',
  '--fs-body': '16px', '--fs-body-sm': '15px', '--fs-label': '14px', '--fs-cap': '12px',
  '--lh': '1.6', '--lh-tight': '1.15',
  '--font': '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  '--font-display': '"Poppins","Pretendard Variable",Pretendard,sans-serif',
  '--font-mono': '"SF Mono",ui-monospace,Menlo,Consolas,monospace',
  '--shadow-1': '0 1px 2px rgba(23,23,25,.05)', '--shadow-2': '0 12px 40px rgba(23,23,25,.10)',
};
const foundationCss = (scope = ':root') => `${scope}{\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

// ── ② 레이아웃 (source: container 1400, section+section 160) ──
const layout = { container: '1200px', gutter: '40px', breakpoints: { sm: 600, md: 768, lg: 1024 } };
const layoutCss = () => `
  .midas{position:relative;overflow:hidden;isolation:isolate;font-family:var(--font);color:var(--ink-2);line-height:var(--lh);background:var(--bg);-webkit-font-smoothing:antialiased}
  .midas *{box-sizing:border-box}
  .midas .container{max-width:${layout.container};margin:0 auto;padding:0 40px;position:relative;z-index:1}
  .midas .section{padding:0 0 0}
  .midas .section + .section{padding-top:120px}
  .midas .grid{display:grid;gap:32px}.midas .card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
  .midas h1,.midas h2,.midas h3{margin:0;color:var(--ink);line-height:var(--lh-tight)}
  .midas p{margin:0}.midas a{color:inherit;text-decoration:none}
  @media (max-width:1023px){.midas .card-grid{grid-template-columns:repeat(2,1fr)}}
  @media (max-width:767px){.midas .card-grid{grid-template-columns:1fr}.midas .container{padding:0 24px}.midas .hide-sm{display:none!important}}`;

// ── ③ 모션 (source: page-gradient float + hero char-wave + reveal) ──
const motion = (level = 'subtle') => level === 'static' ? { css: '', js: '' } : {
  css: `
  /* 부유 그라디언트 광원 (source page-gradient-float) */
  @keyframes midas-pg{0%{transform:translateX(0) rotate(0) scale(1)}25%{transform:translateX(60px) rotate(90deg) scale(1.1)}50%{transform:translateX(0) rotate(180deg) scale(1)}75%{transform:translateX(-60px) rotate(270deg) scale(1.1)}100%{transform:translateX(0) rotate(360deg) scale(1)}}
  /* hero 글자 wave (source hero-char-wave) */
  @keyframes midas-wave{to{opacity:1;transform:none}}
  .midas .rise{opacity:0;transform:translateY(16px);transition:opacity 1.2s cubic-bezier(.22,1,.36,1),transform 1.2s cubic-bezier(.22,1,.36,1)}
  .midas .rise.in{opacity:1;transform:none}
  @media (prefers-reduced-motion:reduce){.midas .pg__img{animation:none!important}.midas .rise{opacity:1;transform:none}}`,
  js: `<script>(function(){
    var el=document.querySelector('.midas .hero__t');
    if(el){var i=0,out='';el.childNodes.forEach(function(n){
      if(n.nodeType===3){out+=n.textContent.split('').map(function(ch){return ch===' '?' ':'<span class="ch" style="--ci:'+(i++)+'">'+ch+'</span>';}).join('');}
      else{out+=(n.outerHTML||'');}});el.innerHTML=out;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-40px'});
    document.querySelectorAll('.midas .rise').forEach(function(x){io.observe(x)});
  })();<\/script>`,
};

// ── ④ 컴포넌트 (source: btn-pill hover 반전, p-card) ──
const components = {
  button(l, { variant = 'primary', size = 'lg', href = '#' } = {}) { return `<a class="btn-pill btn-pill--${variant} btn-pill--${size}" href="${esc(href)}">${esc(l)}</a>`; },
  link(l, { href = '#', arrow = false } = {}) { return `<a class="lnk" href="${esc(href)}">${esc(l)}${arrow ? '<span class="arw">→</span>' : ''}</a>`; },
  badge(l) { return `<span class="badge">${esc(l)}</span>`; },
  card(inner) { return `<div class="p-card">${inner}</div>`; },
  icon(path) { return `<svg class="ico" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`; },
};
const ICONS = { bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>', layers: '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4"/>', sync: '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>', check: '<path d="M20 6 9 17l-5-5"/>' };
const componentsCss = () => `
  /* btn-pill (source: fill-normal → hover inverse) */
  .midas .btn-pill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--brand-weak);color:var(--ink);font-family:inherit;font-weight:600;border:0;cursor:pointer;white-space:nowrap;transition:background .25s cubic-bezier(.33,1,.68,1),color .25s}
  .midas .btn-pill--lg{padding:16px 24px;font-size:16px;letter-spacing:.091px}
  .midas .btn-pill--md{padding:14px 22px;font-size:13px}.midas .btn-pill--sm{padding:10px 18px;font-size:12px}
  .midas .btn-pill:hover,.midas .btn-pill--primary:hover{background:var(--brand);color:var(--on-brand)}
  .midas .btn-pill--ghost{background:transparent;border:var(--bw) solid var(--line)}
  .midas .lnk{color:var(--ink);font-weight:600;display:inline-flex;align-items:center;gap:5px}.midas .lnk:hover{opacity:.7}
  .midas .arw{transition:transform .25s}.midas .lnk:hover .arw{transform:translateX(3px)}
  .midas .badge{display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:var(--brand-weak);color:var(--muted);font-size:11px;font-weight:600;letter-spacing:.34px}
  /* p-card (source: media aspect 445/297 radius-lg, icon scale hover) */
  .midas .p-card{display:flex;flex-direction:column}
  .midas .p-card__media{aspect-ratio:445/297;border-radius:var(--radius-lg);display:grid;place-items:center;overflow:hidden;background:rgba(244,244,249,.5);border:var(--bw) solid rgba(239,239,245,.5)}
  .midas .p-card__media .ico{color:var(--ink);transition:transform .5s cubic-bezier(.33,1,.68,1)}
  .midas .p-card:hover .p-card__media .ico{transform:scale(1.12)}
  .midas .p-card__body{padding:20px 6px 0}
  .midas .p-card__title{font-family:var(--font-display);font-size:24px;line-height:26px;font-weight:600;letter-spacing:-.04px;color:var(--ink)}
  .midas .p-card__desc{margin-top:10px;font-size:var(--fs-body);line-height:1.6;color:var(--muted)}`;

// ── ⑤ 섹션 (source 구조: gnb / hero / section+card-grid / footer) ──
const C = components;
const name = (ctx) => esc(ctx.data.productName || ctx.data.name || 'MIDAS AX');
const PH = '설명 텍스트가 들어갑니다. 기획 내용에 맞춰 교체됩니다.';
const sparkle = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.3L20 10l-6.1 1.7L12 18l-1.9-6.3L4 10l6.1-1.7Z"/></svg>';
const sections = {
  nav: (c, ctx) => `
    <div class="pg pg--top" aria-hidden="true"><img class="pg__img" src="${SITE}/hero-gradient-v2.png" alt=""></div>
    <div class="pg pg--bottom" aria-hidden="true"><img class="pg__img" src="${SITE}/hero-gradient-bottom.png" alt=""></div>
    <header class="gnb"><div class="gnb__inner">
      <a class="gnb__logo" href="#">${sparkle}<span data-edit="productName">${name(ctx)}</span></a>
      <nav class="gnb__nav hide-sm">${(c.links || ['Get Started', 'Foundation', 'Components', 'Pattern']).map((l, i) => `<a href="#"${i === 0 ? ' aria-current="page"' : ''}>${esc(l)}</a>`).join('')}</nav>
      <a class="btn-pill btn-pill--md" href="#">${esc(c.primaryCta || ctx.data.primaryCta || '시작하기')}</a>
    </div></header>`,
  hero: (c, ctx) => `
    <section class="hero"><div class="hero__content">
      <h1 class="hero__t" data-edit="tagline">${esc(c.title || ctx.data.tagline || 'Design Once.\nScale with AX.').replace(/\n/g, '<br>')}</h1>
      <p class="hero__lead rise" data-edit="subcopy">${esc(c.subcopy || ctx.data.subcopy || '사람과 AX가 함께 활용할 수 있도록\n패턴·정책·구조까지 연결된 시스템.').replace(/\n/g, '<br>')}</p>
      <div class="hero__cta rise">${C.button(esc(c.primaryCta || ctx.data.primaryCta || '바로가기'), { variant: 'primary', size: 'lg' })}${c.secondaryCta ? C.link(esc(c.secondaryCta), { arrow: true }) : ''}</div>
    </div></section>`,
  feature: (c, ctx) => `
    <section class="container section"><div class="rise">${c.eyebrow ? `<div class="badge">${esc(c.eyebrow)}</div>` : ''}<h2 class="sec-title">${esc(c.title || '핵심 기능')}</h2></div>
      <div class="card-grid" style="margin-top:40px">${(c.items || [{ icon: 'layers', title: 'Design Once', desc: PH }, { icon: 'sync', title: 'Scale with AX', desc: PH }, { icon: 'bolt', title: 'Connected System', desc: PH }]).map((it, i) => `<div class="p-card rise"><div class="p-card__media">${C.icon(ICONS[it.icon] || ICONS.check)}</div><div class="p-card__body"><h3 class="p-card__title" data-edit="features.${i}.title">${esc(it.title)}</h3><p class="p-card__desc" data-edit="features.${i}.desc">${esc(it.desc || PH)}</p></div></div>`).join('')}</div></section>`,
  stat: (c, ctx) => `
    <section class="container section"><div class="card-grid stat">${(c.items || [{ value: '2.4ms', label: '렌더 지연' }, { value: '8종', label: '페이지 타입' }, { value: '99.9%', label: '일관성' }]).map((s, i) => `<div class="stat__it rise"><div class="stat__v" data-edit="stats.${i}.value">${esc(s.value)}</div><div class="stat__l" data-edit="stats.${i}.label">${esc(s.label)}</div></div>`).join('')}</div></section>`,
  cta: (c, ctx) => `
    <section class="container section cta"><div class="cta__in rise"><h2 class="cta__t" data-edit="bannerText">${esc(c.title || '지금 시작해 보세요')}</h2><p class="cta__s">${esc(c.subcopy || PH)}</p>
      <div class="cta__act">${C.button(esc(c.primaryCta || ctx.data.primaryCta || '바로가기'), { variant: 'primary', size: 'lg' })}${c.secondaryCta ? C.button(esc(c.secondaryCta), { variant: 'ghost', size: 'lg' }) : ''}</div></div></section>`,
  footer: (c, ctx) => `
    <footer class="footer"><div class="footer__inner">
      <div class="footer__l"><a class="gnb__logo" href="#">${sparkle}<span data-edit="productName">${name(ctx)}</span></a><span class="badge">AX Design System</span></div>
      <div class="footer__links">${(c.columns ? c.columns.flatMap((col) => col.items) : ['이용약관', '개인정보', '문의']).map((l) => `<a href="#">${esc(l)}</a>`).join('')}<span class="footer__copy">© 2026 ${name(ctx)}</span></div>
    </div></footer>`,
};
const sectionsCss = () => `
  /* 부유 광원 (source page-gradient, blur 100, float) */
  .midas .pg{position:absolute;pointer-events:none;overflow:hidden;filter:blur(100px);z-index:0}
  .midas .pg__img{display:block;width:100%;height:100%;object-fit:fill;transform-origin:center;animation:midas-pg 22s linear infinite;will-change:transform}
  .midas .pg--top{top:calc(-26/1920*100vw);right:0;width:calc(904/1920*100vw);height:calc(1088/1920*100vw)}
  .midas .pg--bottom{bottom:0;left:calc(485/1920*100vw);width:calc(485/1920*100vw);height:calc(1088/1920*100vw);opacity:.12}
  .midas .pg--bottom .pg__img{animation-duration:30s;animation-direction:reverse}
  /* GNB (source) */
  .midas .gnb{position:sticky;top:0;z-index:100;height:72px}
  .midas .gnb__inner{display:flex;align-items:center;justify-content:space-between;height:100%;max-width:${layout.container};margin:0 auto;padding:0 40px}
  .midas .gnb__logo{display:inline-flex;align-items:center;gap:4px;font-family:var(--font-display);font-size:20px;font-weight:600;letter-spacing:-.8px;color:var(--ink)}
  .midas .gnb__logo svg{color:var(--ink)}
  .midas .gnb__nav{display:flex;align-items:center;gap:16px}
  .midas .gnb__nav a{padding:12px 10px;font-size:15px;font-weight:600;letter-spacing:.144px;color:var(--muted);white-space:nowrap;transition:color .2s}
  .midas .gnb__nav a:hover,.midas .gnb__nav a[aria-current="page"]{color:var(--ink)}
  /* Hero (source: Poppins 72/-4, padding 240, char wave) */
  .midas .hero{position:relative;padding:200px 0 160px;text-align:center}
  .midas .hero__content{max-width:${layout.container};margin:0 auto;padding:0 40px}
  .midas .hero__t{font-family:var(--font-display);font-size:var(--fs-display);font-weight:500;line-height:1.15;letter-spacing:-4px;color:var(--ink)}
  .midas .hero__t .ch{display:inline-block;opacity:0;transform:translateY(20px);animation:midas-wave 1.21s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(var(--ci,0)*26ms + 110ms)}
  .midas .hero__lead{margin:28px auto 0;font-size:20px;line-height:1.6;color:var(--muted);max-width:36em}
  .midas .hero__cta{margin-top:40px;display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap}
  /* section titles */
  .midas .sec-title{font-family:var(--font-display);font-size:var(--fs-h1);font-weight:600;letter-spacing:-.97px;text-align:center}
  .midas .badge{margin-bottom:16px}
  .midas .section > .rise{text-align:center}
  /* stat */
  .midas .stat{text-align:center}.midas .stat__v{font-family:var(--font-display);font-size:56px;font-weight:600;color:var(--ink);letter-spacing:-2px}.midas .stat__l{margin-top:8px;color:var(--muted)}
  /* cta */
  .midas .cta__in{text-align:center;max-width:640px;margin:0 auto}
  .midas .cta__t{font-family:var(--font-display);font-size:var(--fs-h1);font-weight:600;letter-spacing:-.97px}
  .midas .cta__s{margin-top:14px;color:var(--muted);font-size:20px}
  .midas .cta__act{margin-top:32px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  /* Footer (source: border-top fill, margin-top 200, inner flex 80h) */
  .midas .footer{border-top:var(--bw) solid var(--brand-weak);margin-top:160px}
  .midas .footer__inner{display:flex;align-items:center;justify-content:space-between;min-height:80px;max-width:${layout.container};margin:0 auto;padding:20px 40px;color:var(--muted);font-size:14px;flex-wrap:wrap;gap:16px}
  .midas .footer__l{display:flex;align-items:center;gap:12px}
  .midas .footer__links{display:flex;align-items:center;gap:20px;flex-wrap:wrap}.midas .footer__links a:hover{color:var(--ink)}
  .midas .footer__copy{color:var(--soft);font-size:var(--fs-cap)}
  @media (max-width:767px){.midas .hero{padding:120px 0 96px}.midas .hero__t{font-size:40px;letter-spacing:-2px}.midas .hero__lead,.midas .cta__s{font-size:16px}.midas .stat__v{font-size:36px}.midas .section + .section{padding-top:72px}}`;

// ── ⑥ 팩 조립 ──
const midasPack = {
  meta: {
    id: 'midas',
    name: 'MIDAS AX',
    desc: '모노크롬 · 라이트 · Poppins · 부유 광원 + 글자 wave 모션 (MIDAS AX DS 그대로)',
    source: 'MIDAS AX Design System · pood4875-sungjin.github.io/MIDAS-AX-Design-System (tokens/base/layout/components.css 실측)',
  },
  rootClass: 'midas',
  foundation: vars,
  layout,
  motion,
  components,
  sections,
  globalCss() {
    return [
      '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");',
      '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap");',
      foundationCss(':root'),
      'body{margin:0;background:var(--bg)}',
      layoutCss(), componentsCss(), sectionsCss(),
    ].join('\n');
  },
  docs: {
    swatchGroups: [
      { label: 'Brand (inverse)', keys: ['--brand', '--brand-hover', '--brand-weak', '--on-brand'] },
      { label: 'Ink', keys: ['--ink', '--ink-2', '--muted', '--soft'] },
      { label: 'Surface / Line', keys: ['--bg', '--bg-2', '--bg-3', '--line', '--line-2'] },
      { label: 'Signal', keys: ['--ok', '--danger', '--warn', '--info'] },
    ],
    typeRamp: [
      { name: 'display (Poppins)', px: 72, weight: 500 }, { name: 'heading1', px: 36, weight: 600 },
      { name: 'heading3', px: 24, weight: 600 }, { name: 'body', px: 16, weight: 400 }, { name: 'caption', px: 12, weight: 400 },
    ],
    spaceScale: [8, 12, 16, 24, 40, 60],
    radiusScale: [{ name: 'sm', v: 8 }, { name: 'md', v: 12 }, { name: 'lg', v: 24 }],
  },
};



  var DEMO_TEMPLATE={sections:[{type:"nav",tier:"core"},{type:"hero",tier:"core"},{type:"feature",tier:"core"},{type:"stat",tier:"mid"},{type:"cta",tier:"rich"},{type:"footer",tier:"core"}]};
  window.MIDAS_PACK=midasPack; window.MIDAS_STYLE={id:"midas",name:"MIDAS AX",desc:"모노크롬 · 라이트 · Poppins",swatch:"linear-gradient(135deg,#e9eaec 0%,#1b1c1e 100%)"};
  window.MIDAS_SECTION_SPEC={ template:DEMO_TEMPLATE.sections, fixed:["nav","footer"], labels:{hero:"히어로",feature:"기능",stat:"지표",cta:"CTA"} };
  window.renderMidasPage=function(shared,opts){opts=opts||{};shared=shared||{};var content={};
    if(shared.features&&shared.features.length)content.feature={eyebrow:"FEATURES",title:"핵심 기능",items:shared.features.map(function(f){return{icon:f.icon||"bolt",title:f.title,desc:f.desc}})};
    if(shared.stats&&shared.stats.length)content.stat={items:shared.stats.map(function(s){return{value:s.value,label:s.label}})};
    if(shared.bannerText)content.cta={title:shared.bannerText,primaryCta:shared.bannerCta||shared.primaryCta,subcopy:shared.subcopy};
    // 섹션 순서/숨김/추가 반영 (nav 최상단·footer 최하단 고정)
    var vol=opts.volume||"heavy", tpl=DEMO_TEMPLATE.sections, fixedT=window.MIDAS_SECTION_SPEC.fixed;
    var head=tpl.filter(function(s){return s.type==="nav"}), foot=tpl.filter(function(s){return s.type==="footer"});
    var bodyTpl=tpl.filter(function(s){return fixedT.indexOf(s.type)<0});
    var hidden=shared.hiddenSections||[], shown=shared.shownSections||[];
    var vis=bodyTpl.filter(function(s){var def=includesTier(vol,s.tier);return def?hidden.indexOf(s.type)<0:shown.indexOf(s.type)>=0;});
    var order=shared.sectionOrder||[];
    if(order.length){ var by={}; vis.forEach(function(s){by[s.type]=s}); var ord=[]; order.forEach(function(t){if(by[t])ord.push(by[t])}); vis.forEach(function(s){if(order.indexOf(s.type)<0)ord.push(s)}); vis=ord; }
    var effTpl={ sections: head.concat(vis, foot) };
    return renderPage(buildPageDoc({template:effTpl,volume:"heavy",content:content,sharedFacts:shared}),midasPack,{motion:opts.motion||"subtle"});};
})();
