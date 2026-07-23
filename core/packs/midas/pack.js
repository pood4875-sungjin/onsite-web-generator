/* ============================================================
   core/packs/midas/pack.js — MIDAS AX 스타일 팩 (계약 구현체)
   출처: MIDAS AX Design System (pood4875-sungjin.github.io/MIDAS-AX-Design-System)
   css/tokens.css 실측. 무드 = 모노크롬 · 라이트 · Poppins 디스플레이 · 다크 primary 버튼 · 소프트 광원.
   표준: core/packs/spec.js (validatePack 통과). 규칙: 소스 실측만.
   ※ 표시(*)는 소스 미정의 → 무드 맞춰 파생.
   ============================================================ */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ── ① 파운데이션 (tokens.css 실측 매핑) ──
const vars = {
  // brand = primary action = inverse(다크 버튼). 모노크롬 → 채도색 없음
  '--brand': '#1b1c1e',            // color-inverse-background
  '--brand-hover': '#000000',       // *darken
  '--brand-weak': 'rgba(112,115,124,0.08)', // color-fill-normal
  '--on-brand': '#f7f7f8',          // color-inverse-label
  // ink (라벨 위계)
  '--ink': '#171719',               // label-strong
  '--ink-2': 'rgba(46,47,51,0.88)', // label-neutral
  '--muted': 'rgba(55,56,60,0.61)', // label-alternative
  '--soft': 'rgba(55,56,60,0.28)',  // label-assistive
  // surface / line
  '--bg': '#ffffff',                // background
  '--bg-2': '#f7f7f8',              // surface-subtle
  '--bg-3': 'rgba(112,115,124,0.08)',
  '--line': '#eaebec',              // line-solid
  '--line-2': 'rgba(112,115,124,0.16)', // line-subtle
  // signal
  '--info': '#171719', '--info-bg': '#f7f7f8',       // 모노크롬 = 중립
  '--warn': '#ff8a00', '--warn-bg': '#fff3e2',        // *파생(소스는 +/−만)
  '--danger': '#ff4242', '--danger-bg': '#ffecec',    // status-negative
  '--ok': '#00bf40', '--ok-bg': '#e6f8ec',            // status-positive
  // radius (source 8/12/24)
  '--radius-xs': '8px', '--radius-sm': '8px', '--radius': '12px', '--radius-lg': '24px',
  '--bw': '1px',
  // type (*파생 램프 — 무드 맞춤. display=Poppins)
  '--fs-display': '64px', '--fs-h1': '40px', '--fs-h2': '28px', '--fs-h3': '20px',
  '--fs-body': '16px', '--fs-body-sm': '14px', '--fs-label': '13px', '--fs-cap': '12px',
  '--lh': '1.5', '--lh-tight': '1.15',
  // fonts
  '--font': '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  '--font-display': '"Poppins","Pretendard Variable",Pretendard,sans-serif',
  '--font-mono': '"SF Mono",ui-monospace,Menlo,Consolas,monospace',
  // shadow (*파생 — 소프트)
  '--shadow-1': '0 1px 2px rgba(23,23,25,.05)',
  '--shadow-2': '0 12px 40px rgba(23,23,25,.10)',
};
const foundationCss = (scope = ':root') => `${scope}{\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

// ── ② 레이아웃 (source: container 1400, space 8~60, gnb 72) ──
const layout = { container: '1120px', gutter: '24px', breakpoints: { sm: 600, md: 768, lg: 1024 } };
const layoutCss = () => `
  .midas{font-family:var(--font);color:var(--ink-2);line-height:var(--lh);background:var(--bg);-webkit-font-smoothing:antialiased}
  .midas *{box-sizing:border-box}
  .midas .container{max-width:${layout.container};margin:0 auto;padding:0 24px}
  .midas .band{padding:80px 0}
  .midas .band--alt{background:var(--bg-2)}
  .midas .grid{display:grid;gap:24px}.midas .cols-3{grid-template-columns:repeat(3,1fr)}
  .midas h1,.midas h2,.midas h3{margin:0;color:var(--ink);line-height:var(--lh-tight);letter-spacing:-.02em}
  .midas p{margin:0}.midas a{color:inherit;text-decoration:none}
  @media (max-width:1023px){.midas .cols-3{grid-template-columns:repeat(2,1fr)}.midas .band{padding:60px 0}}
  @media (max-width:767px){.midas .cols-3{grid-template-columns:1fr}.midas .band{padding:48px 0}.midas .hide-sm{display:none!important}.midas .container{padding:0 16px}}`;

// ── ③ 모션 (source: 240ms, emphasized cubic-bezier(.22,1,.36,1)) ──
const motion = (level = 'subtle') => level === 'static' ? { css: '', js: '' } : {
  css: `.midas .rise{opacity:0;transform:translateY(${level === 'rich' ? 20 : 12}px);transition:opacity .4s cubic-bezier(.22,1,.36,1),transform .4s cubic-bezier(.22,1,.36,1)}
  .midas .rise.in{opacity:1;transform:none}
  .midas .btn{transition:background .24s cubic-bezier(.33,1,.68,1),opacity .24s}
  @media (prefers-reduced-motion:reduce){.midas .rise{opacity:1;transform:none}}`,
  js: `<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-32px'});document.querySelectorAll('.midas .rise').forEach(function(el){io.observe(el)});})();<\/script>`,
};

// ── ④ 컴포넌트 (source: pill 버튼 999px, 모노크롬) ──
const components = {
  button(l, { variant = 'primary', size = 'md', href = '#' } = {}) { return `<a class="btn btn--${variant} btn--${size}" href="${esc(href)}">${esc(l)}</a>`; },
  link(l, { href = '#', arrow = false } = {}) { return `<a class="lnk" href="${esc(href)}">${esc(l)}${arrow ? '<span class="arw">→</span>' : ''}</a>`; },
  badge(l, { tone = 'brand' } = {}) { return `<span class="badge badge--${tone}">${esc(l)}</span>`; },
  card(inner, { pad = true } = {}) { return `<div class="card${pad ? ' card--pad' : ''}">${inner}</div>`; },
  icon(path) { return `<svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`; },
};
const ICONS = { bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>', layers: '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4"/>', sync: '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>', check: '<path d="M20 6 9 17l-5-5"/>' };
const componentsCss = () => `
  .midas .btn{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-weight:600;border-radius:999px;border:var(--bw) solid transparent;cursor:pointer;white-space:nowrap}
  .midas .btn--md{font-size:var(--fs-body-sm);padding:11px 22px}.midas .btn--lg{font-size:var(--fs-body);padding:14px 28px}.midas .btn--sm{font-size:var(--fs-label);padding:8px 16px}
  .midas .btn--primary{background:var(--brand);color:var(--on-brand)}.midas .btn--primary:hover{background:var(--brand-hover)}
  .midas .btn--secondary{background:var(--brand-weak);color:var(--ink)}.midas .btn--secondary:hover{background:var(--bg-3)}
  .midas .btn--ghost{background:transparent;color:var(--ink-2);border-color:var(--line)}.midas .btn--ghost:hover{background:var(--bg-2)}
  .midas .lnk{color:var(--ink);font-weight:600;display:inline-flex;align-items:center;gap:5px}.midas .lnk:hover{color:var(--ink-2)}
  .midas .arw{transition:transform .24s}.midas .lnk:hover .arw{transform:translateX(3px)}
  .midas .badge{display:inline-flex;font-size:var(--fs-cap);font-weight:600;padding:4px 11px;border-radius:999px;background:var(--brand-weak);color:var(--ink-2)}
  .midas .badge--ok{background:var(--ok-bg);color:var(--ok)}.midas .badge--danger{background:var(--danger-bg);color:var(--danger)}
  .midas .card{background:var(--bg);border:var(--bw) solid var(--line);border-radius:var(--radius-lg);transition:box-shadow .24s,border-color .24s}
  .midas .card--pad{padding:28px}.midas .card:hover{box-shadow:var(--shadow-2)}
  .midas .ico{color:var(--ink)}`;

// ── ⑤ 섹션 (표준 슬롯) ──
const C = components;
const name = (ctx) => esc(ctx.data.productName || ctx.data.name || 'MIDAS');
const PH = '설명 텍스트가 들어갑니다. 기획 내용에 맞춰 교체됩니다.';
const sections = {
  nav: (c, ctx) => `<header class="nav"><div class="container nav__in">
    <a class="nav__brand" href="#">${name(ctx)}</a>
    <nav class="nav__menu hide-sm">${(c.links || ['제품', '기능', '문서', '문의']).map((l) => `<a href="#">${esc(l)}</a>`).join('')}</nav>
    <div class="nav__act">${C.button(esc(c.secondaryCta || '로그인'), { variant: 'ghost', size: 'sm' })}${C.button(esc(c.primaryCta || ctx.data.primaryCta || '시작하기'), { variant: 'primary', size: 'sm' })}</div></div></header>`,
  hero: (c, ctx) => `<section class="band hero"><div class="hero__glow" aria-hidden="true"></div><div class="container hero__in rise">
    <div class="eyebrow">${esc(c.eyebrow || 'AX PLATFORM')}</div>
    <h1 class="hero__t">${esc(c.title || ctx.data.tagline || '지능형 인터페이스를\n가장 우아하게').replace(/\n/g, '<br>')}</h1>
    <p class="hero__s">${esc(c.subcopy || ctx.data.subcopy || PH)}</p>
    <div class="hero__cta">${C.button(esc(c.primaryCta || ctx.data.primaryCta || '무료로 시작'), { variant: 'primary', size: 'lg' })}${C.link(esc(c.secondaryCta || '문서 보기'), { arrow: true })}</div></div></section>`,
  feature: (c, ctx) => `<section class="band"><div class="container">
    <div class="sec-head rise"><div class="eyebrow">${esc(c.eyebrow || 'FEATURES')}</div><h2 class="sec-title">${esc(c.title || '핵심 기능')}</h2></div>
    <div class="grid cols-3" style="margin-top:40px">${(c.items || [{ title: '아토믹 생성', desc: PH }, { title: '시맨틱 조립', desc: PH }, { title: '실시간 동기화', desc: PH }]).map((it) => C.card(`${C.icon(ICONS[it.icon] || ICONS.bolt)}<h3 class="feat__t">${esc(it.title)}</h3><p class="feat__d">${esc(it.desc || PH)}</p>`).replace('class="card', 'class="card rise')).join('')}</div></div></section>`,
  stat: (c, ctx) => `<section class="band band--alt"><div class="container grid cols-3 stat">${(c.items || [{ value: '2.4ms', label: '렌더 지연' }, { value: '8종', label: '페이지 타입' }, { value: '99.9%', label: '일관성' }]).map((s) => `<div class="stat__it rise"><div class="stat__v">${esc(s.value)}</div><div class="stat__l">${esc(s.label)}</div></div>`).join('')}</div></section>`,
  cta: (c, ctx) => `<section class="band cta"><div class="cta__glow" aria-hidden="true"></div><div class="container cta__in rise"><h2 class="cta__t">${esc(c.title || '지금 시작해 보세요')}</h2><p class="cta__s">${esc(c.subcopy || PH)}</p><div class="cta__act">${C.button(esc(c.primaryCta || ctx.data.primaryCta || '무료로 시작'), { variant: 'inverse', size: 'lg' })}${C.button(esc(c.secondaryCta || '문의하기'), { variant: 'ghostinv', size: 'lg' })}</div></div></section>`,
  footer: (c, ctx) => `<footer class="ft"><div class="container ft__in"><div class="ft__brand">${name(ctx)}</div>
    <div class="ft__cols">${(c.columns || [{ h: '제품', items: ['기능', '문서', '가격'] }, { h: '리소스', items: ['블로그', '가이드', '고객사례'] }, { h: '회사', items: ['소개', '채용', '약관'] }]).map((col) => `<div><div class="ft__h">${esc(col.h)}</div>${col.items.map((i) => `<a class="ft__l" href="#">${esc(i)}</a>`).join('')}</div>`).join('')}</div></div>
    <div class="container ft__copy">© 2026 ${name(ctx)}</div></footer>`,
};
const sectionsCss = () => `
  .midas .eyebrow{font-family:var(--font-display);font-size:var(--fs-cap);font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
  .midas .nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.72);backdrop-filter:blur(16px);border-bottom:var(--bw) solid var(--line)}
  .midas .nav__in{display:flex;align-items:center;justify-content:space-between;height:72px}
  .midas .nav__brand{font-family:var(--font-display);font-size:20px;font-weight:600;color:var(--ink);letter-spacing:-.01em}
  .midas .nav__menu{display:flex;gap:30px;font-size:var(--fs-body-sm);font-weight:500;color:var(--muted)}.midas .nav__menu a:hover{color:var(--ink)}
  .midas .nav__act{display:flex;gap:8px}
  .midas .hero{position:relative;overflow:hidden;text-align:center;padding:120px 0 96px}
  .midas .hero__glow{position:absolute;top:-40%;right:-8%;width:56%;height:150%;pointer-events:none;filter:blur(70px);
    background:radial-gradient(closest-side, rgba(23,23,25,.09), transparent 72%);
    animation:midas-float 24s ease-in-out infinite}
  .midas .hero__glow::after{content:"";position:absolute;left:-70%;bottom:-30%;width:70%;height:90%;
    background:radial-gradient(closest-side, rgba(112,115,124,.10), transparent 70%);
    animation:midas-float 30s ease-in-out infinite reverse}
  @keyframes midas-float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-24px,18px) scale(1.08)}}
  @media (prefers-reduced-motion:reduce){.midas .hero__glow,.midas .hero__glow::after{animation:none}}
  .midas .hero__in{position:relative;max-width:760px;margin:0 auto}
  .midas .hero__t{font-family:var(--font-display);font-size:var(--fs-display);font-weight:600;letter-spacing:-.03em}
  .midas .hero__s{margin:22px auto 0;font-size:var(--fs-h3);color:var(--muted);max-width:34em}
  .midas .hero__cta{margin-top:36px;display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap}
  .midas .sec-head{text-align:center}.midas .sec-title{font-family:var(--font-display);font-size:var(--fs-h1);font-weight:600}
  .midas .feat__t{font-family:var(--font-display);font-size:var(--fs-h3);margin:16px 0 8px;font-weight:600;color:var(--ink)}
  .midas .feat__d{color:var(--muted);font-size:var(--fs-body-sm)}
  .midas .stat{text-align:center}.midas .stat__v{font-family:var(--font-display);font-size:var(--fs-display);font-weight:600;color:var(--ink);letter-spacing:-.03em}.midas .stat__l{margin-top:8px;color:var(--muted)}
  /* CTA — inverse(다크) 밴드 = MIDAS 시그니처 */
  .midas .cta{position:relative;overflow:hidden;background:var(--brand);color:var(--on-brand);text-align:center}
  .midas .cta__glow{position:absolute;inset:0;background:radial-gradient(120% 100% at 50% 0%,rgba(247,247,248,.12),transparent 60%);pointer-events:none}
  .midas .cta__in{position:relative;max-width:640px;margin:0 auto}
  .midas .cta__t{font-family:var(--font-display);font-size:var(--fs-h1);font-weight:600;color:var(--on-brand)}
  .midas .cta__s{margin-top:14px;color:rgba(247,247,248,.7);font-size:var(--fs-h3)}
  .midas .cta__act{margin-top:32px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .midas .btn--inverse{background:var(--on-brand);color:var(--ink)}.midas .btn--inverse:hover{opacity:.9}
  .midas .btn--ghostinv{background:transparent;color:var(--on-brand);border-color:rgba(247,247,248,.28)}.midas .btn--ghostinv:hover{background:rgba(247,247,248,.1)}
  .midas .ft{border-top:var(--bw) solid var(--line);padding:64px 0 36px;background:var(--bg)}
  .midas .ft__in{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap}
  .midas .ft__brand{font-family:var(--font-display);font-size:20px;font-weight:600;color:var(--ink)}
  .midas .ft__cols{display:flex;gap:60px;flex-wrap:wrap}.midas .ft__h{font-size:var(--fs-label);font-weight:600;color:var(--ink);margin-bottom:14px}
  .midas .ft__l{display:block;color:var(--muted);font-size:var(--fs-body-sm);margin:9px 0}.midas .ft__l:hover{color:var(--ink)}
  .midas .ft__copy{margin-top:44px;padding-top:24px;border-top:var(--bw) solid var(--line);color:var(--soft);font-size:var(--fs-cap)}
  @media (max-width:767px){.midas .hero{padding:80px 0 64px}.midas .hero__t{font-size:40px}.midas .hero__s,.midas .cta__s{font-size:var(--fs-body)}.midas .stat__v{font-size:40px}}`;

// ── ⑥ 팩 조립 ──
export const midasPack = {
  meta: {
    id: 'midas',
    name: 'MIDAS AX',
    desc: '모노크롬 · 라이트 · Poppins 디스플레이 · 다크 primary · 소프트 광원',
    source: 'MIDAS AX Design System · pood4875-sungjin.github.io/MIDAS-AX-Design-System (css/tokens.css 실측)',
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
      { name: 'display (Poppins)', px: 64, weight: 600 }, { name: 'heading1', px: 40, weight: 600 },
      { name: 'heading3', px: 20, weight: 600 }, { name: 'body', px: 16, weight: 400 }, { name: 'caption', px: 12, weight: 400 },
    ],
    spaceScale: [8, 12, 16, 24, 40, 60],
    radiusScale: [{ name: 'sm', v: 8 }, { name: 'md', v: 12 }, { name: 'lg', v: 24 }],
  },
};

export default midasPack;
