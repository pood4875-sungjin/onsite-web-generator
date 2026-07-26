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
  // edit: 스튜디오 data-edit 경로(옵션) — 버튼/링크는 a 태그라 링크 칩도 함께 동작
  button(label, { variant = 'primary', size = 'md', href = '#', edit = '' } = {}) {
    return `<a class="btn btn--${variant} btn--${size}" href="${esc(href)}"${edit ? ` data-edit="${esc(edit)}"` : ''}>${esc(label)}</a>`;
  },
  link(label, { href = '#', arrow = false, edit = '' } = {}) {
    return `<a class="lnk" href="${esc(href)}"${edit ? ` data-edit="${esc(edit)}"` : ''}>${esc(label)}${arrow ? '<span class="lnk__arw">→</span>' : ''}</a>`;
  },
  badge(label, { tone = 'brand' } = {}) {
    return `<span class="badge badge--${tone}">${esc(label)}</span>`;
  },
  eyebrow(label, { edit = '' } = {}) { return `<div class="eyebrow"${edit ? ` data-edit="${esc(edit)}"` : ''}>${esc(label)}</div>`; },
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
    const d = ctx.data;
    const nv = d && d.nav;
    const nl = (d && d.navLinks) || [];   // 편집 오버라이드(인덱스별) — 기본 메뉴 문구 유지
    const menu = (nv && nv.length)
      ? nv.map((it) => {
          const cur = it.active ? ' aria-current="page"' : '';
          if (it.children && it.children.length) {
            const sub = it.children.map((ch) => `<a class="nav__subitem" href="#" data-nav-page="${ch.id || ''}"${ch.active ? ' aria-current="page"' : ''}>${ctx.esc(ch.name)}</a>`).join('');
            return `<span class="nav__grp"><a href="#" data-nav-page="${it.id || ''}"${cur}>${ctx.esc(it.name)} ▾</a><span class="nav__sub">${sub}</span></span>`;
          }
          return `<a href="#" data-nav-page="${it.id || ''}"${cur}>${ctx.esc(it.name)}</a>`;
        }).join('')
      : (c.links || ['서비스', '기능', '이용안내', '고객지원']).map((l, i) => `<a href="#" data-edit="navLinks.${i}">${ctx.esc(nl[i] != null ? nl[i] : l)}</a>`).join('');
    return `
    <header class="nav">
      <div class="container nav__in">
        <a class="nav__brand" href="#" data-edit="productName">${name(ctx)}</a>
        <nav class="nav__menu hide-sm">${menu}</nav>
        <div class="nav__act">
          ${C.button(ctx.esc(d.navSecondaryCta || c.secondaryCta || '로그인'), { variant: 'ghost', size: 'sm', edit: 'navSecondaryCta' })}
          ${C.button(ctx.esc(d.primaryCta || c.primaryCta || '신청하기'), { variant: 'primary', size: 'sm', edit: 'primaryCta' })}
        </div>
      </div>
    </header>`;
  },

  hero(c, ctx) {
    const eyebrow = ctx.esc(ctx.data.heroEyebrow || c.eyebrow || '서비스 플랫폼');
    const title = ctx.esc(c.title || ctx.data.tagline || '필요한 서비스를\n한 곳에서 간편하게');
    const sub = ctx.esc(c.subcopy || ctx.data.subcopy || H);
    // 링크 라벨 편집 시 화살표 장식(→)이 textContent로 딸려 저장될 수 있어 렌더 시 제거
    const secondary = String(ctx.data.secondaryCta || c.secondaryCta || '이용안내 보기').replace(/\s*→\s*$/, '');
    return `
    <section class="band hero">
      <div class="container hero__grid">
        <div class="hero__copy rise">
          ${C.eyebrow(eyebrow, { edit: 'heroEyebrow' })}
          <h1 class="hero__title" data-edit="tagline">${title.replace(/\n/g, '<br>')}</h1>
          <p class="hero__sub" data-edit="subcopy">${sub}</p>
          <div class="hero__cta">
            ${C.button(ctx.esc(ctx.data.primaryCta || c.primaryCta || '서비스 신청'), { variant: 'primary', size: 'lg', edit: 'primaryCta' })}
            ${C.link(ctx.esc(secondary), { arrow: true, edit: 'secondaryCta' })}
          </div>
        </div>
        <div class="hero__visual rise" data-img="hero">
          ${(ctx.data.images && ctx.data.images.hero)
            ? `<img src="${ctx.esc(ctx.data.images.hero)}" alt="" style="width:100%;border-radius:16px;display:block">`
            : `<div class="mock">
            <div class="mock__bar"><i></i><i></i><i></i></div>
            <div class="mock__body">
              <span class="mock__ln mock__ln--t"></span>
              <span class="mock__ln"></span><span class="mock__ln" style="width:72%"></span>
              <div class="mock__row"><span></span><span></span></div>
            </div>
          </div>`}
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
          ${C.eyebrow(ctx.esc(ctx.data.featureEyebrow || c.eyebrow || 'FEATURES'), { edit: 'featureEyebrow' })}
          <h2 class="sec-title" data-edit="featureTitle">${ctx.esc(ctx.data.featureTitle || c.title || '핵심 기능')}</h2>
        </div>
        <div class="grid cols-3" style="margin-top:32px">
          ${items.map((it, i) => C.card(
            `${C.icon(ICONS[it.icon] || ICONS.check)}
             <h3 class="feat__t" data-edit="features.${i}.title">${ctx.esc(it.title)}</h3>
             <p class="feat__d" data-edit="features.${i}.desc">${ctx.esc(it.desc || H)}</p>`,
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
        ${items.map((s, i) => `<div class="stat__it rise"><div class="stat__v" data-edit="stats.${i}.value">${ctx.esc(s.value)}</div><div class="stat__l" data-edit="stats.${i}.label">${ctx.esc(s.label)}</div></div>`).join('')}
      </div>
    </section>`;
  },

  cta(c, ctx) {
    return `
    <section class="band band--alt cta">
      <div class="container cta__in rise">
        <h2 class="cta__t" data-edit="bannerText">${ctx.esc(c.title || '지금 바로 이용해 보세요')}</h2>
        <p class="cta__s" data-edit="subcopy">${ctx.esc(c.subcopy || ctx.data.subcopy || H)}</p>
        <div class="cta__act">
          ${C.button(ctx.esc(ctx.data.bannerCta || c.primaryCta || ctx.data.primaryCta || '서비스 신청'), { variant: 'primary', size: 'lg', edit: 'bannerCta' })}
          ${C.button(ctx.esc(ctx.data.bannerSecondaryCta || c.secondaryCta || '문의하기'), { variant: 'secondary', size: 'lg', edit: 'bannerSecondaryCta' })}
        </div>
      </div>
    </section>`;
  },

  footer(c, ctx) {
    const d = ctx.data;
    const ov = d.footerCols || [];   // 편집 오버라이드(인덱스별) — 기본 컬럼 문구 유지
    const cols = c.columns || [
      { h: '서비스', items: ['서비스 소개', '이용안내', '자주 묻는 질문'] },
      { h: '정보', items: ['공지사항', '자료실', '관련 사이트'] },
      { h: '기관', items: ['기관 소개', '개인정보처리방침', '이용약관'] },
    ];
    return `
    <footer class="ft">
      <div class="container ft__in">
        <div class="ft__brand" data-edit="productName">${name(ctx)}</div>
        <div class="ft__cols">
          ${cols.map((col, ci) => `<div><div class="ft__h" data-edit="footerCols.${ci}.h">${ctx.esc(ov[ci] && ov[ci].h != null ? ov[ci].h : col.h)}</div>${col.items.map((it, ii) => `<a class="ft__l" href="#" data-edit="footerCols.${ci}.items.${ii}">${ctx.esc(ov[ci] && ov[ci].items && ov[ci].items[ii] != null ? ov[ci].items[ii] : it)}</a>`).join('')}</div>`).join('')}
        </div>
      </div>
      <div class="container ft__copy" data-edit="footerCopyright">${d.footerCopyright ? ctx.esc(d.footerCopyright) : `© 2026 ${name(ctx)}. All rights reserved.`}</div>
    </footer>`;
  },
};

/* ============================================================
   KRDS 페이지유형 확장 섹션 (pagetypes.js 공용 계약)
   - data-edit 경로 = window.pageScaffold 필드명 그대로(overview.title, featureRows.i.desc …).
   - 섹션 제목 등 스캐폴드에 없는 문구는 평평한 신규 필드(galleryTitle 등)로 전수 편집.
   - 모션: CSS-only 등장(.krise) — 스크립트가 제거된 미리보기에서도 항상 보임.
     (html[data-motion="static"]이면 애니 off. 기존 .rise/IO 방식은 레거시 섹션에 유지)
   - 이미지 자리 = data-img(featureRow{i}·gallery{i}·speaker{i}), data.images[key]로 교체.
   ============================================================ */

/** 공통 섹션 헤딩(가운데) — 제목은 평평한 필드로 편집 */
const secHead = (ctx, field, fallback) =>
  `<div class="sec-head krise"><h2 class="sec-title" data-edit="${field}">${esc(ctx.data[field] || fallback)}</h2></div>`;

/** 히어로와 동일한 목업 플레이스홀더(텍스트 없음 — 장식문자·더미문구 금지) */
const mockHtml = () => `<div class="mock">
            <div class="mock__bar"><i></i><i></i><i></i></div>
            <div class="mock__body">
              <span class="mock__ln mock__ln--t"></span>
              <span class="mock__ln"></span><span class="mock__ln" style="width:72%"></span>
              <div class="mock__row"><span></span><span></span></div>
            </div>
          </div>`;

/** 체크리스트 — 항목별 data-edit 경로 프리픽스(예: overview.points) */
const klist = (pts, prefix) =>
  `<ul class="klist">${pts.map((p, i) => `<li>${C.icon(ICONS.check)}<span data-edit="${prefix}.${i}">${esc(p)}</span></li>`).join('')}</ul>`;

Object.assign(sections, {
  /* 서브페이지 헤더 — 회색 밴드·좌정렬(공공 정보 페이지의 명료한 위계) */
  pagehero(c, ctx) {
    const d = ctx.data;
    const ptLabel = (typeof window !== 'undefined' && window.PAGE_TYPES && window.PAGE_TYPES[d.pageType] && window.PAGE_TYPES[d.pageType].label) || '';
    const title = d.pageTitle || c.title || ptLabel || d.tagline || '페이지 제목';
    return `
    <section class="phero">
      <div class="container krise">
        ${C.eyebrow(d.pageEyebrow || c.eyebrow || '안내', { edit: 'pageEyebrow' })}
        <h1 class="phero__t" data-edit="pageTitle">${esc(title)}</h1>
        <p class="phero__s" data-edit="pageSub">${esc(d.pageSub || c.subcopy || d.subcopy || H)}</p>
      </div>
    </section>`;
  },

  /* 개요 — 좌 설명 / 우 핵심 포인트 카드 */
  overview(c, ctx) {
    const o = ctx.data.overview || c || {};
    const pts = (o.points && o.points.length ? o.points : ['핵심 가치 1', '핵심 가치 2', '핵심 가치 3']);
    return `
    <section class="band">
      <div class="container ov">
        <div class="krise">
          <h2 class="ov__t" data-edit="overview.title">${esc(o.title || '서비스 개요')}</h2>
          <p class="ov__x" data-edit="overview.text">${esc(o.text || H)}</p>
        </div>
        <div class="card card--pad krise">${klist(pts, 'overview.points')}</div>
      </div>
    </section>`;
  },

  /* 소개 — 가운데 정렬 짧은 리드 문단 */
  intro(c, ctx) {
    const o = ctx.data.intro || c || {};
    return `
    <section class="band band--alt">
      <div class="container intro__in krise">
        <h2 class="sec-title" data-edit="intro.title">${esc(o.title || '소개')}</h2>
        <p class="intro__x" data-edit="intro.text">${esc(o.text || H)}</p>
      </div>
    </section>`;
  },

  /* 상세 기능 교차 행 — 텍스트/비주얼 지그재그 */
  featurerows(c, ctx) {
    const rows = (ctx.data.featureRows && ctx.data.featureRows.length ? ctx.data.featureRows :
      (c.rows && c.rows.length ? c.rows : [
        { title: '대표 기능 하나', desc: H, points: ['포인트 1', '포인트 2'] },
        { title: '대표 기능 둘', desc: H, points: ['포인트 1', '포인트 2'] },
      ]));
    const imgs = ctx.data.images || {};
    return `
    <section class="band">
      <div class="container">
        ${rows.map((r, i) => `
        <div class="frow krise">
          <div class="frow__tx">
            <h3 class="frow__t" data-edit="featureRows.${i}.title">${esc(r.title)}</h3>
            <p class="frow__d" data-edit="featureRows.${i}.desc">${esc(r.desc || H)}</p>
            ${r.points && r.points.length ? `<div class="frow__pts">${klist(r.points, `featureRows.${i}.points`)}</div>` : ''}
          </div>
          <div class="frow__vis" data-img="featureRow${i}">
            ${imgs['featureRow' + i] ? `<img src="${esc(imgs['featureRow' + i])}" alt="">` : mockHtml()}
          </div>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* 화면 갤러리 */
  gallery(c, ctx) {
    const items = (ctx.data.gallery && ctx.data.gallery.length ? ctx.data.gallery :
      (c.items && c.items.length ? c.items : [{ label: 'SCREEN 1' }, { label: 'SCREEN 2' }, { label: 'SCREEN 3' }]));
    const imgs = ctx.data.images || {};
    return `
    <section class="band band--alt">
      <div class="container">
        ${secHead(ctx, 'galleryTitle', '주요 화면')}
        <div class="grid cols-3" style="margin-top:32px">
          ${items.map((g, i) => `
          <figure class="gal krise">
            <div class="kph" data-img="gallery${i}">${imgs['gallery' + i] ? `<img src="${esc(imgs['gallery' + i])}" alt="">` : ''}</div>
            <figcaption class="gal__c" data-edit="gallery.${i}.label">${esc(g.label || '화면')}</figcaption>
          </figure>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 비교표 — 자사 열 강조 */
  compare(c, ctx) {
    const cp = ctx.data.compare || c || {};
    const rows = (cp.rows && cp.rows.length ? cp.rows : [
      { k: '구축 시간', us: '몇 분', them: '몇 주' },
      { k: '비용', us: '구독형', them: '고정 인건비' },
      { k: '수정', us: '즉시 반영', them: '외주 왕복' },
    ]);
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'compareTitle', '무엇이 다른가요')}
        <div class="cmpwrap krise" style="margin-top:32px">
          <table class="cmp">
            <thead><tr>
              <th scope="col" data-edit="compareColLabel">${esc(ctx.data.compareColLabel || '항목')}</th>
              <th scope="col" class="cmp__us" data-edit="productName">${name(ctx)}</th>
              <th scope="col" data-edit="compare.them">${esc(cp.them || '기존 방식')}</th>
            </tr></thead>
            <tbody>
              ${rows.map((r, i) => `<tr>
                <th scope="row" data-edit="compare.rows.${i}.k">${esc(r.k)}</th>
                <td class="cmp__us" data-edit="compare.rows.${i}.us">${esc(r.us)}</td>
                <td data-edit="compare.rows.${i}.them">${esc(r.them)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
  },

  /* FAQ — 네이티브 details 아코디언(JS 불필요), +표시는 CSS ::after */
  faq(c, ctx) {
    const items = (ctx.data.faq && ctx.data.faq.length ? ctx.data.faq :
      (c.items && c.items.length ? c.items : [
        { q: '어떤 서비스인가요?', a: '서비스를 한 문장으로 설명해주세요.' },
        { q: '이용까지 얼마나 걸리나요?', a: '보통 걸리는 기간과 절차를 안내하세요.' },
        { q: '비용은 어떻게 되나요?', a: '과금 방식을 안내하세요.' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'faqTitle', '자주 묻는 질문')}
        <div class="faq krise" style="margin-top:24px">
          ${items.map((f, i) => `
          <details class="faq__it"${i === 0 ? ' open' : ''}>
            <summary class="faq__q"><span data-edit="faq.${i}.q">${esc(f.q)}</span></summary>
            <p class="faq__a" data-edit="faq.${i}.a">${esc(f.a)}</p>
          </details>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 이용자 후기 — 따옴표는 CSS ::before(장식문자 텍스트 금지) */
  testimonial(c, ctx) {
    const items = (ctx.data.testimonials && ctx.data.testimonials.length ? ctx.data.testimonials :
      (c.items && c.items.length ? c.items : [
        { text: '도입 후 처리 시간이 절반으로 줄었습니다.', by: '이용 기관 담당자' },
        { text: '안내가 명확해서 처음 이용에도 어렵지 않았습니다.', by: '서비스 이용자' },
        { text: '운영 부담이 줄어 본연의 업무에 집중하게 됐습니다.', by: '운영 부서 담당자' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'testimonialTitle', '이용자 후기')}
        <div class="tsm-grid" style="margin-top:32px">
          ${items.map((t, i) => `
          <div class="card card--pad krise">
            <p class="tsm__x" data-edit="testimonials.${i}.text">${esc(t.text)}</p>
            <div class="tsm__by" data-edit="testimonials.${i}.by">${esc(t.by || '')}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 신청 폼 — 정적 데모(제출 비활성: type=button + aria-disabled) */
  form(c, ctx) {
    const fm = ctx.data.form || c || {};
    const fields = (fm.fields && fm.fields.length ? fm.fields : ['회사명', '담당자 이름', '이메일', '문의 내용']);
    return `
    <section class="band band--alt">
      <div class="container kform">
        <div class="card kform__card krise">
          <h2 class="kform__t" data-edit="form.title">${esc(fm.title || '신청하기')}</h2>
          <p class="kform__s" data-edit="form.sub">${esc(fm.sub || '남겨주시면 순서대로 안내해 드립니다.')}</p>
          ${fields.map((f, i) => {
            const long = /내용|사유|메시지|요청/.test(String(f));
            const ctrl = long
              ? `<textarea class="kform__in" id="kf${i}" rows="4" placeholder="내용을 입력해 주세요"></textarea>`
              : `<input class="kform__in" id="kf${i}" type="text" placeholder="입력해 주세요">`;
            return `<div class="kform__row"><label class="kform__l" for="kf${i}" data-edit="form.fields.${i}">${esc(f)}</label>${ctrl}</div>`;
          }).join('')}
          <button type="button" class="btn btn--primary btn--lg kform__btn" aria-disabled="true" data-edit="form.submit">${esc(fm.submit || '신청하기')}</button>
          <p class="kform__note" data-edit="formNote">${esc(ctx.data.formNote || '데모 화면으로, 실제 제출은 동작하지 않습니다.')}</p>
        </div>
      </div>
    </section>`;
  },

  /* 안내 카드 3열 */
  infocards(c, ctx) {
    const items = (ctx.data.infoCards && ctx.data.infoCards.length ? ctx.data.infoCards :
      (c.items && c.items.length ? c.items : [
        { title: '이메일', text: 'contact@example.com' },
        { title: '전화', text: '02-000-0000' },
        { title: '이용 절차', text: '신청 후 확인을 거쳐 처리 결과를 안내합니다.' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'infocardsTitle', '이용 안내')}
        <div class="grid cols-3" style="margin-top:32px">
          ${items.map((it, i) => `
          <div class="card card--pad krise">
            <h3 class="ifc__t" data-edit="infoCards.${i}.title">${esc(it.title)}</h3>
            <p class="ifc__x" data-edit="infoCards.${i}.text">${esc(it.text || '')}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 안내/민원 목록 — 헤어라인 행 + 우측 바로가기(화살표는 CSS ::after) */
  doclist(c, ctx) {
    const docs = (ctx.data.docs && ctx.data.docs.length ? ctx.data.docs :
      (c.items && c.items.length ? c.items : [
        { title: '시작하기', desc: '설치와 첫 설정' },
        { title: '핵심 기능', desc: '주요 기능 사용법' },
        { title: '관리자 가이드', desc: '권한·설정 관리' },
        { title: '자주 묻는 질문', desc: '문제 해결 모음' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'doclistTitle', '안내 자료')}
        <div class="doclist krise" style="margin-top:24px">
          ${docs.map((dc, i) => `
          <div class="doc">
            <div>
              <h3 class="doc__t" data-edit="docs.${i}.title">${esc(dc.title)}</h3>
              <p class="doc__d" data-edit="docs.${i}.desc">${esc(dc.desc || '')}</p>
            </div>
            <a class="doc__go" href="#" data-edit="docs.${i}.link">${esc(dc.link || '자세히 보기')}</a>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 이용 절차 — 번호 스텝(번호는 인덱스 파생·비편집) */
  steps(c, ctx) {
    const st = (ctx.data.steps && ctx.data.steps.length ? ctx.data.steps :
      (c.items && c.items.length ? c.items : [
        { title: '가입', text: '계정을 만듭니다.' },
        { title: '설정', text: '기본 정보를 입력합니다.' },
        { title: '시작', text: '첫 결과물을 만듭니다.' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'stepsTitle', '이용 절차')}
        <div class="grid cols-3" style="margin-top:32px">
          ${st.map((s, i) => `
          <div class="card card--pad stp__it krise">
            <span class="stp__n" aria-hidden="true">${i + 1}</span>
            <h3 class="stp__t" data-edit="steps.${i}.title">${esc(s.title)}</h3>
            <p class="stp__x" data-edit="steps.${i}.text">${esc(s.text || '')}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 소식/공지 목록 */
  bloglist(c, ctx) {
    const posts = (ctx.data.posts && ctx.data.posts.length ? ctx.data.posts :
      (c.items && c.items.length ? c.items : [
        { title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' },
        { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' },
        { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'bloglistTitle', '소식')}
        <div class="postlist krise" style="margin-top:24px">
          ${posts.map((p, i) => `
          <article class="post">
            <div class="post__hd">
              <span class="badge badge--brand" data-edit="posts.${i}.tag">${esc(p.tag || 'NEWS')}</span>
              <h3 class="post__t" data-edit="posts.${i}.title">${esc(p.title)}</h3>
              <span class="post__dt" data-edit="posts.${i}.date">${esc(p.date || '')}</span>
            </div>
            <p class="post__d" data-edit="posts.${i}.desc">${esc(p.desc || '')}</p>
          </article>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 행사 프로그램 — 시간 + 타임라인 도트 */
  agenda(c, ctx) {
    const ag = (ctx.data.agenda && ctx.data.agenda.length ? ctx.data.agenda :
      (c.items && c.items.length ? c.items : [
        { time: '14:00', title: '오프닝', desc: '환영 인사' },
        { time: '14:30', title: '세션 1', desc: '주제 발표' },
        { time: '15:30', title: '세션 2', desc: '사례 공유' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'agendaTitle', '프로그램')}
        <div class="agd krise" style="margin-top:32px">
          ${ag.map((a, i) => `
          <div class="agd__it">
            <div class="agd__tm" data-edit="agenda.${i}.time">${esc(a.time)}</div>
            <div class="agd__bd">
              <h3 class="agd__t" data-edit="agenda.${i}.title">${esc(a.title)}</h3>
              <p class="agd__d" data-edit="agenda.${i}.desc">${esc(a.desc || '')}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 연사 소개 — 아바타 이미지 자리(data-img="speaker{i}") */
  speakers(c, ctx) {
    const sp = (ctx.data.speakers && ctx.data.speakers.length ? ctx.data.speakers :
      (c.items && c.items.length ? c.items : [
        { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
        { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
        { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
      ]));
    const imgs = ctx.data.images || {};
    return `
    <section class="band band--alt">
      <div class="container">
        ${secHead(ctx, 'speakersTitle', '연사 소개')}
        <div class="grid cols-3" style="margin-top:32px">
          ${sp.map((s, i) => `
          <div class="card card--pad krise">
            <div class="spk__av" data-img="speaker${i}">${imgs['speaker' + i] ? `<img src="${esc(imgs['speaker' + i])}" alt="">` : ''}</div>
            <h3 class="spk__n" data-edit="speakers.${i}.name">${esc(s.name)}</h3>
            <div class="spk__r" data-edit="speakers.${i}.role">${esc(s.role || '')}</div>
            <p class="spk__d" data-edit="speakers.${i}.desc">${esc(s.desc || '')}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 참가/이용 안내 — 브랜드 키라인 카드 */
  notice(c, ctx) {
    const ns = (ctx.data.notices && ctx.data.notices.length ? ctx.data.notices :
      (c.items && c.items.length ? c.items : [
        { title: '참가 안내', text: '사전 등록 필수, 선착순 마감.' },
        { title: '오시는 길', text: '장소와 교통편을 안내하세요.' },
        { title: '문의', text: 'event@example.com' },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'noticeTitle', '안내 사항')}
        <div class="grid cols-3" style="margin-top:32px">
          ${ns.map((n, i) => `
          <div class="card card--pad ntc krise">
            <h3 class="ntc__t" data-edit="notices.${i}.title">${esc(n.title)}</h3>
            <p class="ntc__x" data-edit="notices.${i}.text">${esc(n.text || '')}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* 요금/수수료 안내 — 절제된 플랜 카드(공공: 수수료·이용료 안내 톤) */
  pricing(c, ctx) {
    const plans = (ctx.data.plans && ctx.data.plans.length ? ctx.data.plans :
      (c.plans && c.plans.length ? c.plans : [
        { name: '기본', price: '무료', desc: '개인·소규모 이용', points: ['핵심 기능', '기본 지원'] },
        { name: '표준', price: '월 9,900원', desc: '팀·기관 표준', points: ['모든 기본 기능', '우선 지원', '사용량 확장'], featured: true },
        { name: '기관', price: '별도 협의', desc: '대규모·맞춤 도입', points: ['전용 지원', '보안 검토', '맞춤 계약'] },
      ]));
    return `
    <section class="band">
      <div class="container">
        ${secHead(ctx, 'pricingTitle', '이용 요금 안내')}
        <div class="grid cols-3 prc" style="margin-top:32px">
          ${plans.map((p, i) => `
          <div class="card card--pad prc__it${p.featured ? ' prc__it--hot' : ''} krise">
            <div class="prc__hd">
              <h3 class="prc__n" data-edit="plans.${i}.name">${esc(p.name)}</h3>
              ${p.featured ? `<span class="badge badge--brand" data-edit="plans.${i}.flag">${esc(p.flag || '추천')}</span>` : ''}
            </div>
            <div class="prc__p" data-edit="plans.${i}.price">${esc(p.price)}</div>
            <p class="prc__d" data-edit="plans.${i}.desc">${esc(p.desc || '')}</p>
            ${p.points && p.points.length ? `<div class="prc__pts">${klist(p.points, `plans.${i}.points`)}</div>` : ''}
            ${C.button(p.cta || '신청하기', { variant: p.featured ? 'primary' : 'secondary', size: 'md', edit: `plans.${i}.cta` })}
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },
});

/* pagetypes.js 어휘 별칭 — 기존 렌더러 재사용 */
sections.stats = sections.stat;         // pagetypes 'stats' → KRDS 'stat'
sections.metrics = sections.stat;       // SECTION_FALLBACK 대체 어휘
sections.showcase = sections.gallery;   // 메인홈 rich 쇼케이스 = 갤러리
sections.quote = sections.testimonial;  // testimonial 폴백 어휘
sections.banner = sections.cta;         // cta 폴백 어휘

/** 확장 섹션 CSS (.krds 스코프) — 기존 밴드/카드/헤어라인 문법 유지 */
function pageSectionsCss() {
  return `
  /* CSS-only 등장 모션 — 스크립트 제거 미리보기에서도 항상 보임 */
  .krds .krise{animation:kRise .5s ease-out both}
  @keyframes kRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  html[data-motion="static"] .krds .krise{animation:none}
  @media (prefers-reduced-motion:reduce){.krds .krise{animation:none}}
  /* pagehero */
  .krds .phero{background:var(--bg-2);border-bottom:var(--bw) solid var(--line);padding:64px 0}
  .krds .phero__t{font-size:var(--fs-h1);font-weight:800;letter-spacing:-.02em}
  .krds .phero__s{margin-top:12px;color:var(--muted);font-size:var(--fs-h3);max-width:36em}
  /* 공통: 체크리스트·이미지 자리 */
  .krds .klist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
  .krds .klist li{display:flex;gap:10px;align-items:flex-start;font-size:var(--fs-body)}
  .krds .klist .ico{width:20px;height:20px;margin-top:2px}
  .krds .kph{aspect-ratio:16/10;display:block;background:var(--bg-3);border:var(--bw) solid var(--line);border-radius:var(--radius-lg);overflow:hidden}
  .krds .kph img{width:100%;height:100%;object-fit:cover;display:block}
  /* overview */
  .krds .ov{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:start}
  .krds .ov__t{font-size:var(--fs-h1);font-weight:800}
  .krds .ov__x{margin-top:16px;color:var(--muted)}
  /* intro */
  .krds .intro__in{max-width:640px;margin-inline:auto;text-align:center}
  .krds .intro__x{margin-top:14px;color:var(--muted);font-size:var(--fs-h3)}
  /* featurerows */
  .krds .frow{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;padding:36px 0}
  .krds .frow+.frow{border-top:var(--bw) solid var(--line)}
  .krds .frow:nth-child(even) .frow__vis{order:-1}
  .krds .frow__t{font-size:var(--fs-h2);font-weight:700}
  .krds .frow__d{margin-top:10px;color:var(--muted)}
  .krds .frow__pts{margin-top:16px}
  .krds .frow__vis img{width:100%;border-radius:var(--radius-lg);display:block;border:var(--bw) solid var(--line)}
  /* gallery */
  .krds .gal{margin:0}
  .krds .gal__c{margin-top:10px;text-align:center;color:var(--soft);font-size:var(--fs-cap);font-weight:600;letter-spacing:.04em}
  /* compare */
  .krds .cmpwrap{overflow-x:auto}
  .krds .cmp{width:100%;min-width:560px;border-collapse:separate;border-spacing:0;border:var(--bw) solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg)}
  .krds .cmp th,.krds .cmp td{padding:14px 18px;text-align:left;font-size:var(--fs-body-sm);border-top:var(--bw) solid var(--line)}
  .krds .cmp thead th{border-top:0;background:var(--bg-2);font-weight:700;color:var(--ink)}
  .krds .cmp tbody th{font-weight:600;color:var(--muted)}
  .krds .cmp .cmp__us{background:var(--brand-weak);color:var(--brand-hover);font-weight:700}
  /* faq */
  .krds .faq{max-width:760px;margin-inline:auto}
  .krds .faq__it{border-bottom:var(--bw) solid var(--line)}
  .krds .faq__it:first-of-type{border-top:var(--bw) solid var(--line)}
  .krds .faq__q{list-style:none;cursor:pointer;display:block;position:relative;padding:18px 36px 18px 2px;font-weight:700;font-size:var(--fs-body);color:var(--ink)}
  .krds .faq__q::-webkit-details-marker{display:none}
  .krds .faq__q::after{content:"+";position:absolute;right:8px;top:50%;transform:translateY(-50%);color:var(--brand);font-size:22px;font-weight:400;transition:transform .15s ease-out}
  .krds .faq__it[open] .faq__q::after{transform:translateY(-50%) rotate(45deg)}
  .krds .faq__a{padding:0 2px 20px;color:var(--muted);max-width:60em}
  /* testimonial */
  .krds .tsm-grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
  .krds .tsm__x::before{content:"\\201C";display:block;font-size:32px;line-height:1;color:var(--brand);font-weight:700;margin-bottom:8px}
  .krds .tsm__by{margin-top:14px;color:var(--soft);font-size:var(--fs-label);font-weight:600}
  /* form */
  .krds .kform{max-width:600px;margin-inline:auto}
  .krds .kform__card{padding:32px}
  .krds .kform__t{font-size:var(--fs-h2);font-weight:700}
  .krds .kform__s{margin-top:8px;color:var(--muted);font-size:var(--fs-body-sm)}
  .krds .kform__row{margin-top:18px}
  .krds .kform__l{display:block;font-size:var(--fs-label);font-weight:700;color:var(--ink);margin-bottom:6px}
  .krds .kform__in{width:100%;padding:12px 14px;border:var(--bw) solid var(--line-2);border-radius:var(--radius);font:inherit;font-size:var(--fs-body-sm);color:var(--ink-2);background:var(--bg)}
  .krds .kform__in:focus{outline:2px solid var(--brand);outline-offset:0;border-color:var(--brand)}
  .krds textarea.kform__in{resize:vertical}
  .krds .kform__btn{width:100%;margin-top:24px}
  .krds .kform__note{margin-top:12px;text-align:center;color:var(--soft);font-size:var(--fs-cap)}
  /* infocards / notice */
  .krds .ifc__t,.krds .ntc__t{font-size:var(--fs-h3);font-weight:700}
  .krds .ifc__x,.krds .ntc__x{margin-top:8px;color:var(--muted);font-size:var(--fs-body-sm)}
  .krds .ntc{border-left:3px solid var(--brand)}
  /* doclist */
  .krds .doclist{border-top:var(--bw) solid var(--line)}
  .krds .doc{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 4px;border-bottom:var(--bw) solid var(--line)}
  .krds .doc__t{font-size:var(--fs-h3);font-weight:700}
  .krds .doc__d{margin-top:4px;color:var(--muted);font-size:var(--fs-body-sm)}
  .krds .doc__go{color:var(--brand);font-weight:600;white-space:nowrap;flex:none}
  .krds .doc__go::after{content:"\\2192";margin-left:4px;display:inline-block;transition:transform .15s ease-out}
  .krds .doc:hover .doc__go::after{transform:translateX(2px)}
  /* steps */
  .krds .stp__n{display:inline-flex;width:36px;height:36px;border-radius:999px;background:var(--brand);color:var(--on-brand);align-items:center;justify-content:center;font-weight:700;font-size:var(--fs-body-sm)}
  .krds .stp__t{margin-top:14px;font-size:var(--fs-h3);font-weight:700}
  .krds .stp__x{margin-top:6px;color:var(--muted);font-size:var(--fs-body-sm)}
  /* bloglist */
  .krds .postlist{border-top:var(--bw) solid var(--line)}
  .krds .post{padding:22px 4px;border-bottom:var(--bw) solid var(--line)}
  .krds .post__hd{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .krds .post__t{font-size:var(--fs-h3);font-weight:700}
  .krds .post__dt{margin-left:auto;color:var(--soft);font-size:var(--fs-cap)}
  .krds .post__d{margin-top:6px;color:var(--muted);font-size:var(--fs-body-sm);max-width:60em}
  /* agenda */
  .krds .agd{max-width:720px;margin-inline:auto}
  .krds .agd__it{display:grid;grid-template-columns:84px 1fr;gap:20px}
  .krds .agd__tm{font-weight:700;color:var(--brand);font-size:var(--fs-body-sm);font-variant-numeric:tabular-nums;padding-top:2px}
  .krds .agd__bd{position:relative;padding:0 0 28px 24px}
  .krds .agd__bd::before{content:"";position:absolute;left:0;top:6px;width:10px;height:10px;border-radius:999px;background:var(--brand)}
  .krds .agd__bd::after{content:"";position:absolute;left:4px;top:22px;bottom:4px;width:2px;background:var(--line)}
  .krds .agd__it:last-child .agd__bd{padding-bottom:0}
  .krds .agd__it:last-child .agd__bd::after{display:none}
  .krds .agd__t{font-size:var(--fs-h3);font-weight:700}
  .krds .agd__d{margin-top:4px;color:var(--muted);font-size:var(--fs-body-sm)}
  /* speakers */
  .krds .spk__av{width:72px;height:72px;border-radius:999px;background:var(--bg-3);border:var(--bw) solid var(--line);overflow:hidden;margin-bottom:16px}
  .krds .spk__av img{width:100%;height:100%;object-fit:cover;display:block}
  .krds .spk__n{font-size:var(--fs-h3);font-weight:700}
  .krds .spk__r{margin-top:4px;color:var(--brand);font-size:var(--fs-label);font-weight:600}
  .krds .spk__d{margin-top:8px;color:var(--muted);font-size:var(--fs-body-sm)}
  /* pricing */
  .krds .prc{align-items:stretch}
  .krds .prc__it{display:flex;flex-direction:column}
  .krds .prc__hd{display:flex;align-items:center;gap:8px}
  .krds .prc__n{font-size:var(--fs-h3);font-weight:700}
  .krds .prc__p{margin-top:12px;font-size:var(--fs-h1);font-weight:800;letter-spacing:-.02em;color:var(--ink)}
  .krds .prc__d{margin-top:6px;color:var(--muted);font-size:var(--fs-body-sm)}
  .krds .prc__pts{margin-top:18px;margin-bottom:22px}
  .krds .prc__it .btn{margin-top:auto;justify-content:center}
  .krds .prc__it--hot{border-color:var(--brand);box-shadow:var(--shadow-2)}
  /* responsive */
  @media (max-width:1023px){
    .krds .ov{grid-template-columns:1fr;gap:28px}
  }
  @media (max-width:767px){
    .krds .phero{padding:44px 0}
    .krds .phero__t{font-size:26px}
    .krds .phero__s{font-size:var(--fs-body)}
    .krds .frow{grid-template-columns:1fr;gap:24px;padding:28px 0}
    .krds .frow:nth-child(even) .frow__vis{order:0}
    .krds .intro__x{font-size:var(--fs-body)}
    .krds .agd__it{grid-template-columns:64px 1fr;gap:12px}
    .krds .post__dt{margin-left:0;width:100%}
    .krds .kform__card{padding:24px 20px}
  }`;
}

/** 섹션 전용 CSS (.krds 스코프) */
function sectionsCss() {
  return `
  /* nav */
  .krds .nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:var(--bw) solid var(--line)}
  .krds .nav__in{display:flex;align-items:center;justify-content:space-between;height:64px}
  .krds .nav__brand{font-size:var(--fs-h3);font-weight:800;color:var(--ink);letter-spacing:-.02em}
  .krds .nav__menu{display:flex;align-items:center;gap:28px;font-size:var(--fs-body-sm);font-weight:600;color:var(--muted)}
  .krds .nav__menu a:hover,.krds .nav__menu a[aria-current="page"]{color:var(--brand)}
  .krds .nav__grp{position:relative;display:inline-flex}
  .krds .nav__sub{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(4px);display:none;flex-direction:column;min-width:170px;padding:6px;background:#fff;border:var(--bw) solid var(--line);border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.1);z-index:40}
  .krds .nav__grp:hover .nav__sub{display:flex}
  .krds .nav__subitem{padding:9px 12px;font-size:var(--fs-body-sm);font-weight:600;border-radius:8px;color:var(--muted)}
  .krds .nav__subitem:hover,.krds .nav__subitem[aria-current="page"]{color:var(--brand);background:var(--brand-weak,#eef3ff)}
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
      pageSectionsCss(),
    ].join('\n');
  },

  // 인스펙터 문서용
  docs: { swatchGroups, typeRamp, spaceScale, radiusScale, shadowScale, gallery },
};



  var DEMO_TEMPLATE={ sections:[{type:"nav",tier:"core"},{type:"hero",tier:"core"},{type:"feature",tier:"core"},{type:"stat",tier:"mid"},{type:"cta",tier:"rich"},{type:"footer",tier:"core"}] };
  window.KRDS_PACK=krdsPack; window.KRDS_STYLE={id:"krds",name:"밝은 신뢰 블루",desc:"라이트 · 선명한 블루",swatch:"linear-gradient(135deg,#256ef4,#0b50d0)"};
  // 스튜디오 편집모드(섹션 순서/숨김)용 섹션 스펙 — nav/footer 고정, body=hero/feature/stat/cta
  window.KRDS_SECTION_SPEC={ template:DEMO_TEMPLATE.sections, fixed:["nav","footer"], labels:{hero:"히어로",feature:"기능",stat:"지표",cta:"CTA",pagehero:"페이지 헤더",overview:"개요",intro:"소개",featurerows:"기능 상세",gallery:"갤러리",compare:"비교",faq:"FAQ",testimonial:"후기",form:"신청 폼",infocards:"안내 카드",doclist:"안내 목록",steps:"이용 절차",bloglist:"소식",agenda:"프로그램",speakers:"연사",notice:"안내",pricing:"요금"} };
  window.renderKrdsPage=function(shared,opts){opts=opts||{};shared=shared||{};var content={};
    if(shared.features&&shared.features.length)content.feature={eyebrow:"FEATURES",title:"핵심 기능",items:shared.features.map(function(f){return{icon:f.icon||"check",title:f.title,desc:f.desc}})};
    if(shared.stats&&shared.stats.length)content.stat={items:shared.stats.map(function(s){return{value:s.value,label:s.label}})};
    if(shared.bannerText)content.cta={title:shared.bannerText,primaryCta:shared.bannerCta||shared.primaryCta,subcopy:shared.subcopy};
    var vol=opts.volume||"heavy";
    // ── 페이지유형 라우팅(pagetypes.js 계약) ─────────────────────────
    // data.pageType이 있고 window.PAGE_TYPES가 로드된 경우에만 유형별 구성으로 렌더.
    // 둘 중 하나라도 없으면 아래 기존 경로 그대로(하위호환 — 출력 불변).
    var PTreg=(typeof window!=="undefined"&&window.PAGE_TYPES)||null;
    var ptDef=PTreg&&shared.pageType&&PTreg[shared.pageType];
    if(ptDef){
      var FB=(typeof window!=="undefined"&&window.SECTION_FALLBACK)||{};
      var ALIAS={stats:"stat",metrics:"stat",quote:"testimonial",banner:"cta",showcase:"gallery"};
      var body2=[];
      (ptDef.sections||[]).forEach(function(s){
        var t=ALIAS[s.type]||s.type;
        if(!krdsPack.sections[t]){
          // 미구현 타입 → SECTION_FALLBACK 순서로 대체(끝까지 없으면 생략 — 깨지지 않는 게 우선)
          var alts=(FB[s.type]||[]).map(function(x){return ALIAS[x]||x});
          t=null;
          for(var i2=0;i2<alts.length;i2++){ if(krdsPack.sections[alts[i2]]){t=alts[i2];break} }
          if(!t) return;
        }
        body2.push({type:t,tier:s.tier||"core"});
      });
      var hid2=shared.hiddenSections||[], shw2=shared.shownSections||[];
      var vis2=body2.filter(function(s){var def=includesTier(vol,s.tier);return def?hid2.indexOf(s.type)<0:shw2.indexOf(s.type)>=0;});
      var ord2=shared.sectionOrder||[];
      if(ord2.length){ var by2={}; vis2.forEach(function(s){if(!by2[s.type])by2[s.type]=s}); var o2=[]; ord2.forEach(function(t2){if(by2[t2]){o2.push(by2[t2]);delete by2[t2]}}); vis2.forEach(function(s){if(o2.indexOf(s)<0)o2.push(s)}); vis2=o2; }
      var effTpl2={sections:[{type:"nav",tier:"core"}].concat(vis2,[{type:"footer",tier:"core"}])};
      return renderPage(buildPageDoc({template:effTpl2,volume:"heavy",content:content,sharedFacts:shared}),krdsPack,{motion:opts.motion||"subtle"});
    }
    // ── 기존 경로(하위호환) — 섹션 순서/숨김/추가 반영 (nav 최상단·footer 최하단 고정)
    var tpl=DEMO_TEMPLATE.sections, fixedT=window.KRDS_SECTION_SPEC.fixed;
    var head=tpl.filter(function(s){return s.type==="nav"});
    var foot=tpl.filter(function(s){return s.type==="footer"});
    var bodyTpl=tpl.filter(function(s){return fixedT.indexOf(s.type)<0});
    var hidden=shared.hiddenSections||[], shown=shared.shownSections||[];
    var vis=bodyTpl.filter(function(s){var def=includesTier(vol,s.tier); return def?hidden.indexOf(s.type)<0:shown.indexOf(s.type)>=0;});
    var order=shared.sectionOrder||[];
    if(order.length){ var by={}; vis.forEach(function(s){by[s.type]=s}); var ord=[]; order.forEach(function(t){if(by[t])ord.push(by[t])}); vis.forEach(function(s){if(order.indexOf(s.type)<0)ord.push(s)}); vis=ord; }
    var effTpl={ sections: head.concat(vis, foot) };
    // 이미 가시성 반영했으니 buildPageDoc의 tier 필터는 통과되게 volume=heavy
    return renderPage(buildPageDoc({template:effTpl,volume:"heavy",content:content,sharedFacts:shared}),krdsPack,{motion:opts.motion||"subtle"});};
})();
