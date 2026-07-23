/* AUTO-GENERATED classic 번들. 편집금지 */
(function(){
  var includesTier = window.includesTier || function(v,t){var V={compact:0,mid:1,heavy:2},T={core:0,mid:1,rich:2};return T[t]<=V[v]};

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
      try { return render(slotValues || {}, ctx); }
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


/* === core/packs/krds/foundation.js === */
/* ============================================================
   core/packs/krds/foundation.js — KRDS 파운데이션 (①층)
   출처: KRDS v1.0.0 Figma 실측 + KRDS 규약. 색은 CSS 변수로 노출.
   ============================================================ */

// 파운데이션 = CSS 변수 계약(팩 컴포넌트/섹션이 참조하는 SSOT)
const vars = {
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
function foundationCss(scope = ':root') {
  const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${scope}{\n${body}\n}`;
}

// ── 인스펙터 문서용 메타 ──
const swatchGroups = [
  { label: 'Brand', keys: ['--brand', '--brand-hover', '--brand-weak'] },
  { label: 'Ink', keys: ['--ink', '--ink-2', '--muted', '--soft'] },
  { label: 'Surface / Line', keys: ['--bg', '--bg-2', '--bg-3', '--line', '--line-2'] },
  { label: 'Signal', keys: ['--info', '--warn', '--danger', '--ok'] },
];
const typeRamp = [
  { name: 'display', varKey: '--fs-display', px: 44, weight: 700 },
  { name: 'heading1', varKey: '--fs-h1', px: 32, weight: 700 },
  { name: 'heading2', varKey: '--fs-h2', px: 24, weight: 700 },
  { name: 'heading3', varKey: '--fs-h3', px: 19, weight: 700 },
  { name: 'body', varKey: '--fs-body', px: 17, weight: 400 },
  { name: 'label', varKey: '--fs-label', px: 14, weight: 500 },
  { name: 'caption', varKey: '--fs-cap', px: 13, weight: 400 },
];
const spaceScale = [4, 8, 12, 16, 20, 24, 40, 64, 80];
const radiusScale = [
  { name: 'xs', v: 4 }, { name: 'sm', v: 6 }, { name: 'md', v: 8 }, { name: 'lg', v: 12 },
];
const shadowScale = [
  { name: 'shadow-1', v: 'var(--shadow-1)' }, { name: 'shadow-2', v: 'var(--shadow-2)' },
];


/* === core/packs/krds/layout.js === */
/* ============================================================
   core/packs/krds/layout.js — KRDS 레이아웃 (②층)
   컨테이너·그리드·브레이크포인트. KRDS 반응형 3-tier.
   ============================================================ */
const layout = {
  container: '1200px',      // KRDS 데스크톱 콘텐츠 폭
  gutter: '24px',
  breakpoints: { sm: 600, md: 768, lg: 1024 },  // 모바일 / 태블릿 / 데스크톱
};

/** 레이아웃 base CSS — 컨테이너·반응형 유틸. .krds 스코프에서 동작. */
function layoutCss() {
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


/* === core/packs/krds/motion.js === */
/* ============================================================
   core/packs/krds/motion.js — KRDS 모션 (⑤층)
   정부·공공 = 절제·기능적. 짧은 duration, ease-out, 은은한 등장.
   과한 글로우/패럴랙스 없음. reduced-motion 존중.
   ============================================================ */
function motion(level = 'subtle') {
  if (level === 'static') return { css: '', js: '' };
  const dist = level === 'rich' ? 16 : 10;
  const dur = level === 'rich' ? '.5s' : '.4s';
  return {
    css: `
    .krds .rise{opacity:0;transform:translateY(${dist}px);transition:opacity ${dur} ease-out,transform ${dur} ease-out}
    .krds .rise.in{opacity:1;transform:none}
    .krds .btn{transition:background .15s ease-out,border-color .15s ease-out}
    .krds .card{transition:border-color .15s ease-out,box-shadow .15s ease-out}
    @media (prefers-reduced-motion:reduce){.krds .rise{opacity:1;transform:none}}`,
    js: `<script>
    (function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-32px'});
    document.querySelectorAll('.krds .rise').forEach(function(el){io.observe(el)});})();
    <\/script>`,
  };
}


/* === core/packs/krds/components.js === */
/* ============================================================
   core/packs/krds/components.js — KRDS 컴포넌트 킷 (③층)
   1px 헤어라인 · radius 8 · 정부블루 · Pretendard GOV. 순수 HTML 문자열 헬퍼.
   .krds 스코프에서 componentsCss와 함께 동작.
   ============================================================ */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const components = {
  button(label, { variant = 'primary', size = 'md', href = '#' } = {}) {
    return `<a class="btn btn--${variant} btn--${size}" href="${esc(href)}">${esc(label)}</a>`;
  },
  link(label, { href = '#', arrow = false } = {}) {
    return `<a class="lnk" href="${esc(href)}">${esc(label)}${arrow ? '<span class="lnk__arw">→</span>' : ''}</a>`;
  },
  badge(label, { tone = 'brand' } = {}) {
    return `<span class="badge badge--${tone}">${esc(label)}</span>`;
  },
  eyebrow(label) { return `<div class="eyebrow">${esc(label)}</div>`; },
  card(inner, { pad = true } = {}) {
    return `<div class="card${pad ? ' card--pad' : ''}">${inner}</div>`;
  },
  // KRDS 시스템 아이콘(라인, 2px, currentColor)
  icon(path) { return `<svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`; },
};

const ICONS = {
  bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>',
  layers: '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>',
  sync: '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
};

/** 컴포넌트 base CSS (.krds 스코프) */
function componentsCss() {
  return `
  /* Button */
  .krds .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;
    font-weight:600;border-radius:var(--radius);border:var(--bw) solid transparent;cursor:pointer;
    text-decoration:none;white-space:nowrap}
  .krds .btn--md{font-size:var(--fs-body-sm);padding:11px 20px}
  .krds .btn--lg{font-size:var(--fs-body);padding:14px 26px}
  .krds .btn--sm{font-size:var(--fs-label);padding:8px 14px}
  .krds .btn--primary{background:var(--brand);color:var(--on-brand)}
  .krds .btn--primary:hover{background:var(--brand-hover)}
  .krds .btn--secondary{background:var(--bg);color:var(--brand);border-color:var(--brand)}
  .krds .btn--secondary:hover{background:var(--brand-weak)}
  .krds .btn--ghost{background:transparent;color:var(--ink-2);border-color:var(--line-2)}
  .krds .btn--ghost:hover{background:var(--bg-2)}
  /* Link */
  .krds .lnk{color:var(--brand);font-weight:600;display:inline-flex;align-items:center;gap:4px}
  .krds .lnk:hover{text-decoration:underline}
  .krds .lnk__arw{transition:transform .15s ease-out}
  .krds .lnk:hover .lnk__arw{transform:translateX(2px)}
  /* Badge */
  .krds .badge{display:inline-flex;align-items:center;font-size:var(--fs-cap);font-weight:600;
    padding:3px 9px;border-radius:999px;line-height:1.4}
  .krds .badge--brand{background:var(--brand-weak);color:var(--brand-hover)}
  .krds .badge--ok{background:var(--ok-bg);color:var(--ok)}
  .krds .badge--warn{background:var(--warn-bg);color:var(--warn)}
  .krds .badge--danger{background:var(--danger-bg);color:var(--danger)}
  /* Eyebrow */
  .krds .eyebrow{font-size:var(--fs-cap);font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--brand);margin-bottom:10px}
  /* Card — KRDS 헤어라인, 그림자 없음(hover 시 미세) */
  .krds .card{background:var(--bg);border:var(--bw) solid var(--line);border-radius:var(--radius-lg)}
  .krds .card--pad{padding:24px}
  .krds .card:hover{border-color:var(--line-2);box-shadow:var(--shadow-1)}
  .krds .ico{color:var(--brand);flex:none}`;
}

/** 인스펙터 컴포넌트 갤러리 명세 */
const gallery = [
  { name: 'Button', html: () => [
    components.button('Primary', { variant: 'primary', size: 'lg' }),
    components.button('Secondary', { variant: 'secondary', size: 'lg' }),
    components.button('Ghost', { variant: 'ghost', size: 'lg' }),
  ].join(' ') },
  { name: 'Link', html: () => [
    components.link('텍스트 링크', { arrow: true }),
    components.link('바로가기', { arrow: false }),
  ].join('&nbsp;&nbsp;&nbsp;') },
  { name: 'Badge', html: () => [
    components.badge('브랜드', { tone: 'brand' }),
    components.badge('완료', { tone: 'ok' }),
    components.badge('주의', { tone: 'warn' }),
    components.badge('오류', { tone: 'danger' }),
  ].join(' ') },
  { name: 'Card', html: () => components.card(
    `${components.icon(ICONS.bolt)}<h3 style="font-size:var(--fs-h3);margin:12px 0 6px">카드 제목</h3><p style="color:var(--muted);font-size:var(--fs-body-sm)">헤어라인 1px · radius 12 · 그림자 없음.</p>`),
  },
];

  var C = components;

/* === core/packs/krds/sections.js === */
/* ============================================================
   core/packs/krds/sections.js — KRDS 섹션 렌더러 (④층)
   정식 섹션 타입(nav·hero·feature·stat·cta·footer)을 KRDS 컴포넌트로 조립.
   각 render(content, ctx) → HTML 조각. .krds 스코프에서 렌더.
   ============================================================ */

const H = '설명 텍스트가 들어갑니다. 기획 내용에 맞춰 교체됩니다.';
const name = (ctx) => ctx.esc(ctx.data.productName || ctx.data.name || 'ONSITE');

const sections = {
  nav(c, ctx) {
    const links = c.links || ['서비스', '기능', '이용안내', '고객지원'];
    return `
    <header class="nav">
      <div class="container nav__in">
        <a class="nav__brand" href="#">${name(ctx)}</a>
        <nav class="nav__menu hide-sm">${links.map((l) => `<a href="#">${ctx.esc(l)}</a>`).join('')}</nav>
        <div class="nav__act">
          ${C.button(ctx.esc(c.secondaryCta || '로그인'), { variant: 'ghost', size: 'sm' })}
          ${C.button(ctx.esc(c.primaryCta || ctx.data.primaryCta || '신청하기'), { variant: 'primary', size: 'sm' })}
        </div>
      </div>
    </header>`;
  },

  hero(c, ctx) {
    const eyebrow = ctx.esc(c.eyebrow || '서비스 플랫폼');
    const title = ctx.esc(c.title || ctx.data.tagline || '필요한 서비스를\n한 곳에서 간편하게');
    const sub = ctx.esc(c.subcopy || ctx.data.subcopy || H);
    return `
    <section class="band hero">
      <div class="container hero__grid">
        <div class="hero__copy rise">
          ${C.eyebrow(eyebrow)}
          <h1 class="hero__title">${title.replace(/\n/g, '<br>')}</h1>
          <p class="hero__sub">${sub}</p>
          <div class="hero__cta">
            ${C.button(ctx.esc(c.primaryCta || ctx.data.primaryCta || '서비스 신청'), { variant: 'primary', size: 'lg' })}
            ${C.link(ctx.esc(c.secondaryCta || '이용안내 보기'), { arrow: true })}
          </div>
        </div>
        <div class="hero__visual rise" aria-hidden="true">
          <div class="mock">
            <div class="mock__bar"><i></i><i></i><i></i></div>
            <div class="mock__body">
              <span class="mock__ln mock__ln--t"></span>
              <span class="mock__ln"></span><span class="mock__ln" style="width:72%"></span>
              <div class="mock__row"><span></span><span></span></div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  },

  feature(c, ctx) {
    const items = (c.items && c.items.length ? c.items : [
      { icon: 'bolt', title: '빠른 처리', desc: H },
      { icon: 'shield', title: '안전한 인증', desc: H },
      { icon: 'sync', title: '실시간 연동', desc: H },
    ]);
    return `
    <section class="band band--alt">
      <div class="container">
        <div class="sec-head rise">
          ${C.eyebrow(ctx.esc(c.eyebrow || 'FEATURES'))}
          <h2 class="sec-title">${ctx.esc(c.title || '핵심 기능')}</h2>
        </div>
        <div class="grid cols-3" style="margin-top:32px">
          ${items.map((it) => C.card(
            `${C.icon(ICONS[it.icon] || ICONS.check)}
             <h3 class="feat__t">${ctx.esc(it.title)}</h3>
             <p class="feat__d">${ctx.esc(it.desc || H)}</p>`,
          ).replace('class="card', 'class="card rise')).join('')}
        </div>
      </div>
    </section>`;
  },

  stat(c, ctx) {
    const items = (c.items && c.items.length ? c.items : [
      { value: '2.4초', label: '평균 처리 시간' },
      { value: '99.9%', label: '서비스 가용성' },
      { value: '120만', label: '누적 이용자' },
    ]);
    return `
    <section class="band">
      <div class="container grid cols-3 stat">
        ${items.map((s) => `<div class="stat__it rise"><div class="stat__v">${ctx.esc(s.value)}</div><div class="stat__l">${ctx.esc(s.label)}</div></div>`).join('')}
      </div>
    </section>`;
  },

  cta(c, ctx) {
    return `
    <section class="band band--alt cta">
      <div class="container cta__in rise">
        <h2 class="cta__t">${ctx.esc(c.title || '지금 바로 이용해 보세요')}</h2>
        <p class="cta__s">${ctx.esc(c.subcopy || H)}</p>
        <div class="cta__act">
          ${C.button(ctx.esc(c.primaryCta || ctx.data.primaryCta || '서비스 신청'), { variant: 'primary', size: 'lg' })}
          ${C.button(ctx.esc(c.secondaryCta || '문의하기'), { variant: 'secondary', size: 'lg' })}
        </div>
      </div>
    </section>`;
  },

  footer(c, ctx) {
    const cols = c.columns || [
      { h: '서비스', items: ['서비스 소개', '이용안내', '자주 묻는 질문'] },
      { h: '정보', items: ['공지사항', '자료실', '관련 사이트'] },
      { h: '기관', items: ['기관 소개', '개인정보처리방침', '이용약관'] },
    ];
    return `
    <footer class="ft">
      <div class="container ft__in">
        <div class="ft__brand">${name(ctx)}</div>
        <div class="ft__cols">
          ${cols.map((col) => `<div><div class="ft__h">${ctx.esc(col.h)}</div>${col.items.map((i) => `<a class="ft__l" href="#">${ctx.esc(i)}</a>`).join('')}</div>`).join('')}
        </div>
      </div>
      <div class="container ft__copy">© 2026 ${name(ctx)}. All rights reserved.</div>
    </footer>`;
  },
};

/** 섹션 전용 CSS (.krds 스코프) */
function sectionsCss() {
  return `
  /* nav */
  .krds .nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:var(--bw) solid var(--line)}
  .krds .nav__in{display:flex;align-items:center;justify-content:space-between;height:64px}
  .krds .nav__brand{font-size:var(--fs-h3);font-weight:800;color:var(--ink);letter-spacing:-.02em}
  .krds .nav__menu{display:flex;gap:28px;font-size:var(--fs-body-sm);font-weight:600;color:var(--muted)}
  .krds .nav__menu a:hover{color:var(--brand)}
  .krds .nav__act{display:flex;gap:8px}
  /* hero */
  .krds .hero{position:relative;overflow:hidden}
  .krds .hero::before{content:"";position:absolute;inset:0 0 auto 0;height:460px;pointer-events:none;
    background:radial-gradient(70% 120% at 78% -10%, color-mix(in srgb, var(--brand) 12%, transparent), transparent 70%)}
  .krds .hero > .container{position:relative;z-index:1}
  .krds .hero__grid{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}
  .krds .hero__title{font-size:var(--fs-display);font-weight:800;letter-spacing:-.03em}
  .krds .hero__sub{margin-top:18px;font-size:var(--fs-h3);color:var(--muted);max-width:30em}
  .krds .hero__cta{margin-top:32px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}
  .krds .mock{background:var(--bg);border:var(--bw) solid var(--line);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-2)}
  .krds .mock__bar{display:flex;gap:6px;padding:12px 14px;border-bottom:var(--bw) solid var(--line);background:var(--bg-2)}
  .krds .mock__bar i{width:10px;height:10px;border-radius:999px;background:var(--line-2)}
  .krds .mock__body{padding:22px;display:flex;flex-direction:column;gap:12px}
  .krds .mock__ln{height:12px;border-radius:6px;background:var(--bg-3);width:100%}
  .krds .mock__ln--t{width:52%;height:16px;background:var(--brand-weak)}
  .krds .mock__row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px}
  .krds .mock__row span{height:64px;border-radius:var(--radius);background:var(--bg-2);border:var(--bw) solid var(--line)}
  /* section head */
  .krds .sec-head{text-align:center}
  .krds .sec-title{font-size:var(--fs-h1);font-weight:800}
  .krds .feat__t{font-size:var(--fs-h3);margin:14px 0 6px;font-weight:700}
  .krds .feat__d{color:var(--muted);font-size:var(--fs-body-sm)}
  /* stat */
  .krds .stat{text-align:center}
  .krds .stat__v{font-size:var(--fs-display);font-weight:800;color:var(--brand);letter-spacing:-.03em}
  .krds .stat__l{margin-top:6px;color:var(--muted);font-size:var(--fs-body-sm)}
  /* cta */
  .krds .cta__in{text-align:center;max-width:640px;margin-inline:auto}
  .krds .cta__t{font-size:var(--fs-h1);font-weight:800}
  .krds .cta__s{margin-top:12px;color:var(--muted);font-size:var(--fs-h3)}
  .krds .cta__act{margin-top:28px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  /* footer */
  .krds .ft{border-top:var(--bw) solid var(--line);padding:56px 0 32px;background:var(--bg)}
  .krds .ft__in{display:flex;justify-content:space-between;gap:40px;flex-wrap:wrap}
  .krds .ft__brand{font-size:var(--fs-h3);font-weight:800;color:var(--ink)}
  .krds .ft__cols{display:flex;gap:56px;flex-wrap:wrap}
  .krds .ft__h{font-size:var(--fs-label);font-weight:700;color:var(--ink);margin-bottom:12px}
  .krds .ft__l{display:block;color:var(--muted);font-size:var(--fs-body-sm);margin:8px 0}
  .krds .ft__l:hover{color:var(--brand)}
  .krds .ft__copy{margin-top:40px;padding-top:20px;border-top:var(--bw) solid var(--line);color:var(--soft);font-size:var(--fs-cap)}
  @media (max-width:1023px){ .krds .hero__grid{grid-template-columns:1fr;gap:36px} .krds .hero__visual{order:-1} }
  @media (max-width:767px){ .krds .hero__title{font-size:34px} .krds .hero__sub,.krds .cta__s{font-size:var(--fs-body)} .krds .stat__v{font-size:34px} }`;
}


/* === core/packs/krds/pack.js === */
/* ============================================================
   core/packs/krds/pack.js — KRDS 풀 스타일팩 (계약 구현체)
   대한민국 정부 디자인 시스템 v1.0.0. 파운데이션~모션 전 층 자기완결.
   출처: KRDS v1.0.0 (Community) Figma OILUy443EILgdjCdB0nIDY (실측 + 규약).
   ============================================================ */

const krdsPack = {
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



  var DEMO_TEMPLATE={ sections:[{type:"nav",tier:"core"},{type:"hero",tier:"core"},{type:"feature",tier:"core"},{type:"stat",tier:"mid"},{type:"cta",tier:"rich"},{type:"footer",tier:"core"}] };
  window.KRDS_PACK=krdsPack; window.KRDS_STYLE={id:"krds",name:"밝은 신뢰 블루",desc:"라이트 · 선명한 블루",swatch:"linear-gradient(135deg,#256ef4,#0b50d0)"};
  window.renderKrdsPage=function(shared,opts){opts=opts||{};shared=shared||{};var content={};
    if(shared.features&&shared.features.length)content.feature={eyebrow:"FEATURES",title:"핵심 기능",items:shared.features.map(function(f){return{icon:f.icon||"check",title:f.title,desc:f.desc}})};
    if(shared.stats&&shared.stats.length)content.stat={items:shared.stats.map(function(s){return{value:s.value,label:s.label}})};
    if(shared.bannerText)content.cta={title:shared.bannerText,primaryCta:shared.bannerCta||shared.primaryCta,subcopy:shared.subcopy};
    return renderPage(buildPageDoc({template:DEMO_TEMPLATE,volume:opts.volume||"heavy",content:content,sharedFacts:shared}),krdsPack,{motion:opts.motion||"subtle"});};
})();
