/* ============================================================
   core/packs/_template/pack.js — 새 팩 스캐폴드 (복사해서 채우기)
   사용법: 이 폴더를 core/packs/<your-id>/ 로 복사 → 아래 TODO 채움 → index.js 등록.
   표준: core/packs/spec.js (validatePack로 검사). 규칙: 소스 실측만, 추측값 금지.
   레퍼런스 구현: core/packs/krds/*.
   ============================================================ */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ── ① 파운데이션: 표준 토큰 키셋(spec.TOKEN_KEYS) 전부 채운다. 아래는 중립 플레이스홀더. ── */
const vars = {
  '--brand': '#3b5bdb', '--brand-hover': '#2f49b0', '--brand-weak': '#eef1fc', '--on-brand': '#ffffff', // TODO 소스 실측
  '--ink': '#111318', '--ink-2': '#20242b', '--muted': '#565d68', '--soft': '#828a95',
  '--bg': '#ffffff', '--bg-2': '#f5f6f8', '--line': '#dfe3e8', '--line-2': '#c4cad2',
  '--info': '#3b5bdb', '--info-bg': '#eef1fc', '--warn': '#e8890c', '--warn-bg': '#fdf1df',
  '--danger': '#d93838', '--danger-bg': '#fbe9e9', '--ok': '#1a9d5a', '--ok-bg': '#e6f5ed',
  '--radius-xs': '4px', '--radius-sm': '6px', '--radius': '10px', '--radius-lg': '14px', // TODO 무드에 맞게
  '--bw': '1px',
  '--fs-display': '48px', '--fs-h1': '32px', '--fs-h2': '24px', '--fs-h3': '19px',
  '--fs-body': '16px', '--fs-body-sm': '14px', '--fs-label': '13px', '--fs-cap': '12px',
  '--lh': '1.55', '--lh-tight': '1.2',
  '--font': 'system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif', // TODO 팩 폰트
  '--font-mono': 'ui-monospace,Menlo,Consolas,monospace',
  '--shadow-1': '0 1px 2px rgba(0,0,0,.06)', '--shadow-2': '0 6px 24px rgba(0,0,0,.10)',
};
const foundationCss = (scope = ':root') => `${scope}{\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

/* ── ② 레이아웃: container + breakpoints 필수 ── */
const layout = { container: '1120px', gutter: '24px', breakpoints: { sm: 600, md: 768, lg: 1024 } };
const layoutCss = () => `
  .pk{font-family:var(--font);color:var(--ink-2);line-height:var(--lh);background:var(--bg)}
  .pk *{box-sizing:border-box}
  .pk .container{max-width:${layout.container};margin:0 auto;padding:0 24px}
  .pk .band{padding:64px 0}.pk .band--alt{background:var(--bg-2)}
  .pk .grid{display:grid;gap:24px}.pk .cols-3{grid-template-columns:repeat(3,1fr)}
  .pk h1,.pk h2,.pk h3{margin:0;color:var(--ink);line-height:var(--lh-tight)}.pk p{margin:0}.pk a{color:inherit;text-decoration:none}
  @media (max-width:1023px){.pk .cols-3{grid-template-columns:repeat(2,1fr)}}
  @media (max-width:767px){.pk .cols-3{grid-template-columns:1fr}.pk .hide-sm{display:none!important}}`;

/* ── ③ 모션: static/subtle/rich ── */
const motion = (level = 'subtle') => level === 'static' ? { css: '', js: '' } : {
  css: `.pk .rise{opacity:0;transform:translateY(12px);transition:opacity .4s ease-out,transform .4s ease-out}.pk .rise.in{opacity:1;transform:none}@media (prefers-reduced-motion:reduce){.pk .rise{opacity:1;transform:none}}`,
  js: `<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})});document.querySelectorAll('.pk .rise').forEach(function(el){io.observe(el)})})();<\/script>`,
};

/* ── ④ 컴포넌트: 최소 button/link/badge/card (spec.REQUIRED_COMPONENTS) ── */
const components = {
  button: (l, { variant = 'primary', size = 'md', href = '#' } = {}) => `<a class="btn btn--${variant} btn--${size}" href="${esc(href)}">${esc(l)}</a>`,
  link: (l, { href = '#', arrow = false } = {}) => `<a class="lnk" href="${esc(href)}">${esc(l)}${arrow ? ' →' : ''}</a>`,
  badge: (l, { tone = 'brand' } = {}) => `<span class="badge badge--${tone}">${esc(l)}</span>`,
  card: (inner, { pad = true } = {}) => `<div class="card${pad ? ' card--pad' : ''}">${inner}</div>`,
};
const componentsCss = () => `
  .pk .btn{display:inline-flex;align-items:center;gap:6px;font-weight:600;border-radius:var(--radius);border:var(--bw) solid transparent;cursor:pointer}
  .pk .btn--md{font-size:var(--fs-body-sm);padding:11px 20px}.pk .btn--lg{font-size:var(--fs-body);padding:14px 24px}.pk .btn--sm{font-size:var(--fs-label);padding:8px 14px}
  .pk .btn--primary{background:var(--brand);color:var(--on-brand)}.pk .btn--primary:hover{background:var(--brand-hover)}
  .pk .btn--secondary{background:var(--bg);color:var(--brand);border-color:var(--brand)}
  .pk .btn--ghost{background:transparent;color:var(--ink-2);border-color:var(--line-2)}
  .pk .lnk{color:var(--brand);font-weight:600}.pk .lnk:hover{text-decoration:underline}
  .pk .badge{display:inline-flex;font-size:var(--fs-cap);font-weight:600;padding:3px 9px;border-radius:999px;background:var(--brand-weak);color:var(--brand-hover)}
  .pk .card{background:var(--bg);border:var(--bw) solid var(--line);border-radius:var(--radius-lg)}.pk .card--pad{padding:24px}`;

/* ── ⑤ 섹션: spec.SECTION_SLOTS 슬롯을 읽어 렌더. 6타입 전부 필수. ── */
const S = components;
const name = (ctx) => esc(ctx.data.productName || ctx.data.name || 'BRAND');
const PH = '설명 텍스트가 들어갑니다.';
const sections = {
  nav: (c, ctx) => `<header class="nav"><div class="container nav__in"><a class="nav__brand" href="#">${name(ctx)}</a>
    <nav class="nav__menu hide-sm">${(c.links || ['메뉴1', '메뉴2', '메뉴3']).map((l) => `<a href="#">${esc(l)}</a>`).join('')}</nav>
    <div>${S.button(esc(c.primaryCta || '시작'), { size: 'sm' })}</div></div></header>`,
  hero: (c, ctx) => `<section class="band hero"><div class="container"><div class="rise">
    <span class="badge">${esc(c.eyebrow || 'EYEBROW')}</span>
    <h1 class="hero__t">${esc(c.title || '헤드라인')}</h1><p class="hero__s">${esc(c.subcopy || PH)}</p>
    <div class="hero__cta">${S.button(esc(c.primaryCta || '시작하기'), { size: 'lg' })} ${S.link(esc(c.secondaryCta || '더보기'), { arrow: true })}</div></div></div></section>`,
  feature: (c, ctx) => `<section class="band band--alt"><div class="container">
    <span class="badge">${esc(c.eyebrow || 'FEATURES')}</span><h2 class="sec__t">${esc(c.title || '기능')}</h2>
    <div class="grid cols-3" style="margin-top:28px">${(c.items || [{}, {}, {}]).map((it) => S.card(`<h3>${esc(it.title || '기능')}</h3><p style="color:var(--muted);font-size:var(--fs-body-sm);margin-top:6px">${esc(it.desc || PH)}</p>`)).join('')}</div></div></section>`,
  stat: (c, ctx) => `<section class="band"><div class="container grid cols-3" style="text-align:center">${(c.items || [{ value: '00', label: '지표' }, { value: '00', label: '지표' }, { value: '00', label: '지표' }]).map((s) => `<div class="rise"><div class="stat__v">${esc(s.value)}</div><div style="color:var(--muted)">${esc(s.label)}</div></div>`).join('')}</div></section>`,
  cta: (c, ctx) => `<section class="band band--alt" style="text-align:center"><div class="container rise"><h2 class="sec__t">${esc(c.title || 'CTA 제목')}</h2><p style="color:var(--muted);margin-top:10px">${esc(c.subcopy || PH)}</p><div style="margin-top:24px">${S.button(esc(c.primaryCta || '시작하기'), { size: 'lg' })} ${S.button(esc(c.secondaryCta || '문의'), { variant: 'secondary', size: 'lg' })}</div></div></section>`,
  footer: (c, ctx) => `<footer class="ft"><div class="container" style="display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap"><div class="nav__brand">${name(ctx)}</div>
    <div style="display:flex;gap:48px;flex-wrap:wrap">${(c.columns || [{ h: '메뉴', items: ['항목', '항목'] }]).map((col) => `<div><div style="font-weight:700;margin-bottom:10px">${esc(col.h)}</div>${col.items.map((i) => `<a href="#" style="display:block;color:var(--muted);margin:7px 0">${esc(i)}</a>`).join('')}</div>`).join('')}</div></div>
    <div class="container" style="margin-top:32px;color:var(--soft);font-size:var(--fs-cap)">© 2026 ${name(ctx)}</div></footer>`,
};
const sectionsCss = () => `
  .pk .nav{border-bottom:var(--bw) solid var(--line)}.pk .nav__in{display:flex;align-items:center;justify-content:space-between;height:64px}
  .pk .nav__brand{font-size:var(--fs-h3);font-weight:800;color:var(--ink)}.pk .nav__menu{display:flex;gap:24px;color:var(--muted);font-weight:600;font-size:var(--fs-body-sm)}
  .pk .hero__t{font-size:var(--fs-display);font-weight:800;margin-top:14px}.pk .hero__s{margin-top:16px;font-size:var(--fs-h3);color:var(--muted)}.pk .hero__cta{margin-top:28px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
  .pk .sec__t{font-size:var(--fs-h1);font-weight:800;margin-top:12px}.pk .stat__v{font-size:var(--fs-display);font-weight:800;color:var(--brand)}
  .pk .ft{border-top:var(--bw) solid var(--line);padding:48px 0 28px}`;

/* ── ⑥ 팩 조립 ── */
export const templatePack = {
  meta: { id: 'template', name: '_Template', desc: '새 팩 스캐폴드 — 복사해서 채우기', source: '' }, // TODO
  rootClass: 'pk',
  foundation: vars,
  layout,
  motion,
  components,
  sections,
  globalCss: () => [foundationCss(':root'), 'body{margin:0;background:var(--bg)}', layoutCss(), componentsCss(), sectionsCss()].join('\n'),
  docs: {
    swatchGroups: [
      { label: 'Brand', keys: ['--brand', '--brand-hover', '--brand-weak'] },
      { label: 'Ink', keys: ['--ink', '--ink-2', '--muted', '--soft'] },
      { label: 'Surface / Line', keys: ['--bg', '--bg-2', '--line', '--line-2'] },
      { label: 'Signal', keys: ['--info', '--warn', '--danger', '--ok'] },
    ],
    typeRamp: [
      { name: 'display', px: 48, weight: 800 }, { name: 'heading1', px: 32, weight: 800 },
      { name: 'heading3', px: 19, weight: 700 }, { name: 'body', px: 16, weight: 400 },
    ],
    spaceScale: [4, 8, 12, 16, 24, 32, 48, 64],
    radiusScale: [{ name: 'xs', v: 4 }, { name: 'sm', v: 6 }, { name: 'md', v: 10 }, { name: 'lg', v: 14 }],
  },
};

export default templatePack;
