/* ============================================================
   core/packs/krds/sections.js — KRDS 섹션 렌더러 (④층)
   정식 섹션 타입(nav·hero·feature·stat·cta·footer)을 KRDS 컴포넌트로 조립.
   각 render(content, ctx) → HTML 조각. .krds 스코프에서 렌더.
   ============================================================ */
import { components as C, ICONS } from './components.js';

const H = '설명 텍스트가 들어갑니다. 기획 내용에 맞춰 교체됩니다.';
const name = (ctx) => ctx.esc(ctx.data.productName || ctx.data.name || 'ONSITE');

export const sections = {
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
export function sectionsCss() {
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
