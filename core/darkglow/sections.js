/* ============================================================
   darkglow/sections.js — 다크글로우 섹션 렌더 함수 (조립 단위)
   각 섹션: render(data, t, motion) -> HTML 조각 (.rise = 스크롤 등장)
   site-render.js의 모놀리식 페이지를 조립 가능한 섹션으로 분해.
   ============================================================ */
import { esc } from '../esc.js';

const PH_FEATURES = [
  { title: '아토믹 생성', desc: '정해진 부품을 규칙대로 조립 — 추론 없는 결정론적 출력.' },
  { title: '시맨틱 인텔리전스', desc: '슬롯에 값만 채우면 섹션이 온브랜드로 즉시 합성됩니다.' },
  { title: '실시간 동기화', desc: '스타일 팩을 바꾸면 전체 사이트가 즉시 리스킨됩니다.' },
];
const PH_STATS = [
  { value: '2.4ms', label: '렌더 지연시간' },
  { value: '8종', label: '페이지 타입' },
  { value: '99.9%', label: '온브랜드 일관성' },
];
const ICONS = [
  '<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>',
  '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>',
  '<circle cx="12" cy="12" r="2"/><path d="M5 12a7 7 0 0 1 14 0M8.5 12a3.5 3.5 0 0 1 7 0"/>',
];
const svg = (p) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const spark = (c) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="${c}"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z"/></svg>`;

const name = (d) => esc(d.productName || '제품명');
const cta = (d) => esc(d.primaryCta || '무료로 시작하기');
const btnCta = (t) => `background:${t.ctaGradient};color:${t.accentText};font-weight:700;border:none;border-radius:12px;cursor:pointer`;

export const SECTIONS = {
  gnb(d, t) {
    // d.nav = 사이트 메뉴트리 [{name, active, children:[{name, active}]}] (스튜디오 레일에서 주입)
    // 없으면 기본 플레이스홀더.
    let nav;
    if (d.nav && d.nav.length) {
      nav = d.nav.map((it) => {
        const on = it.active ? `color:${t.text};font-weight:600` : '';
        const hasKids = it.children && it.children.length;
        const sub = hasKids
          ? `<div class="nsub" style="position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:8px;padding:6px;min-width:150px;border-radius:12px;background:${t.bg};border:1px solid ${t.surfaceBorder};box-shadow:0 12px 40px rgba(0,0,0,.4)">
              ${it.children.map((c) => `<span style="display:block;padding:8px 12px;border-radius:8px;white-space:nowrap;${c.active ? `color:${t.text};font-weight:600` : ''}">${esc(c.name)}</span>`).join('')}
            </div>`
          : '';
        return `<div class="nvi" style="position:relative;cursor:pointer;${on}">${esc(it.name)}${hasKids ? ' ▾' : ''}${sub}</div>`;
      }).join('');
    } else {
      nav = `<span>기능</span><span>가격</span><span>문서</span><span>고객사례</span>`;
    }
    return `
    <header style="position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:16px 32px;backdrop-filter:blur(20px);background:${t.bg}cc;border-bottom:1px solid ${t.surfaceBorder}">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:${t.ctaGradient}">${spark(t.accentText)}</div>
        <span data-edit="productName" style="font-weight:600">${name(d)}</span>
      </div>
      <nav style="display:flex;gap:28px;color:${t.textMuted};font-size:14px">${nav}</nav>
      <button style="padding:8px 16px;${btnCta(t)};border-radius:999px;font-size:14px">${cta(d)}</button>
    </header>`;
  },

  hero(d, t) {
    const tagline = esc(d.tagline || '대화만으로 완성되는 인터페이스');
    const subcopy = esc(d.subcopy || '기획을 대화로 입력하면, 선택한 스타일 팩으로 온브랜드 웹페이지를 아키텍처 수준의 정밀함으로 합성합니다.');
    const dash = [0, 1, 2].map(() => `
      <div style="display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:10px;background:${t.accentSoft}">
        <div style="height:8px;width:66%;border-radius:999px;background:${t.accent};opacity:.7"></div>
        <div style="height:8px;width:100%;border-radius:999px;background:${t.surfaceBorder}"></div>
        <div style="height:8px;width:80%;border-radius:999px;background:${t.surfaceBorder}"></div>
        <div style="height:40px;border-radius:10px;background:${t.ctaGradient};opacity:.85;margin-top:8px"></div>
      </div>`).join('');
    return `
    <section style="position:relative;overflow:hidden;padding:80px 32px 40px;text-align:center;background:${t.heroGradient}">
      <div style="position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:520px;height:320px;border-radius:999px;filter:blur(100px);background:${t.glow};pointer-events:none"></div>
      <div class="rise" style="position:relative;max-width:680px;margin:0 auto">
        <span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:${t.accentSoft};border:1px solid ${t.surfaceBorder};color:${t.accent};font-size:12px;letter-spacing:.02em"><span style="width:6px;height:6px;border-radius:999px;background:${t.accent}"></span>Engine v2.0 · AX 웹 제너레이터</span>
        <h1 data-edit="tagline" style="margin:24px 0 0;font-size:54px;font-weight:700;line-height:1.08;letter-spacing:-.03em">${tagline}</h1>
        <p data-edit="subcopy" style="max-width:520px;margin:20px auto 0;color:${t.textMuted};font-size:18px;line-height:1.6">${subcopy}</p>
        <div style="margin-top:32px;display:flex;align-items:center;justify-content:center;gap:12px">
          <button style="display:inline-flex;align-items:center;gap:8px;padding:13px 24px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}"><span data-edit="primaryCta">${cta(d)}</span> →</button>
          <button style="padding:13px 24px;border-radius:12px;background:${t.surface};border:1px solid ${t.surfaceBorder};color:${t.text};font-weight:600;cursor:pointer">문서 보기</button>
        </div>
      </div>
      ${(d.images && d.images.hero)
        ? `<img class="rise" data-img="hero" src="${esc(d.images.hero)}" alt="" style="display:block;position:relative;max-width:760px;width:100%;margin:56px auto 0;border-radius:${t.radius};box-shadow:0 20px 80px ${t.glow}">`
        : `<div class="rise" data-img="hero" style="position:relative;max-width:760px;margin:56px auto 0;overflow:hidden;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder};box-shadow:0 20px 80px ${t.glow}">
        <div style="display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid ${t.surfaceBorder}">
          <span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span><span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span><span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span>
          <span style="margin-left:12px;font-size:12px;color:${t.textMuted}">${name(d).toLowerCase()}.app / console</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px">${dash}</div>
      </div>`}
    </section>`;
  },

  metrics(d, t) {
    const stats = (d.stats && d.stats.length ? d.stats : PH_STATS).slice(0, 3);
    return `
    <section style="position:relative;padding:40px 32px">
      <div class="rise" style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;overflow:hidden;border-radius:${t.radius};background:${t.surfaceBorder};border:1px solid ${t.surfaceBorder}">
        ${stats.map((s, i) => `<div style="padding:28px 24px;text-align:center;background:${t.bg}">
          <div data-edit="stats.${i}.value" style="font-size:36px;font-weight:700;letter-spacing:-.02em;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(s.value)}</div>
          <div data-edit="stats.${i}.label" style="margin-top:6px;color:${t.textMuted};font-size:13px">${esc(s.label)}</div></div>`).join('')}
      </div>
    </section>`;
  },

  features(d, t) {
    const features = (d.features && d.features.length ? d.features : PH_FEATURES).slice(0, 6);
    return `
    <section style="position:relative;padding:64px 32px">
      <div class="rise" style="max-width:680px;margin:0 auto;text-align:center">
        <div style="color:${t.accent};font-size:13px;letter-spacing:.08em;text-transform:uppercase">Features</div>
        <h2 style="margin:12px 0 0;font-size:34px;font-weight:700;letter-spacing:-.02em">명료함과 성능을 위해 설계됨</h2>
      </div>
      <div style="max-width:900px;margin:48px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${features.map((f, i) => `<div class="rise" style="position:relative;overflow:hidden;padding:24px;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder}">
          <div style="position:absolute;right:-32px;top:-32px;width:96px;height:96px;border-radius:999px;filter:blur(32px);background:${t.glow};opacity:.35;pointer-events:none"></div>
          <div style="position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</div>
          <h3 data-edit="features.${i}.title" style="position:relative;margin:16px 0 0;font-size:18px;font-weight:600">${esc(f.title)}</h3>
          <p data-edit="features.${i}.desc" style="position:relative;margin:8px 0 0;color:${t.textMuted};font-size:15px;line-height:1.6">${esc(f.desc)}</p></div>`).join('')}
      </div>
    </section>`;
  },

  banner(d, t) {
    const bannerText = esc(d.bannerText || '워크플로우를 진화시킬 준비가 되셨나요?');
    const bannerCta = esc(d.bannerCta || d.primaryCta || '무료로 시작하기');
    return `
    <section style="position:relative;padding:64px 32px">
      <div class="rise" style="position:relative;max-width:900px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:20px;overflow:hidden;padding:64px 40px;text-align:center;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder}">
        <div style="position:absolute;inset:0;background:${t.heroGradient};pointer-events:none"></div>
        <div style="position:absolute;bottom:-80px;left:50%;transform:translateX(-50%);width:384px;height:256px;border-radius:999px;filter:blur(90px);background:${t.glow};pointer-events:none"></div>
        <h2 data-edit="bannerText" style="position:relative;font-size:36px;font-weight:700;letter-spacing:-.02em">${bannerText}</h2>
        <button style="position:relative;display:inline-flex;align-items:center;gap:8px;padding:14px 28px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}">${bannerCta} →</button>
      </div>
    </section>`;
  },

  footer(d, t) {
    const links = (d.footerLinks && d.footerLinks.length) ? d.footerLinks : ['이용약관', '개인정보처리방침', '문의'];
    const copy = esc(d.footerCopyright || `© 2026 ${name(d)} Labs`);
    return `
    <footer style="position:relative;padding:40px 32px;border-top:1px solid ${t.surfaceBorder};color:${t.textMuted};font-size:14px">
      <div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px;color:${t.text}"><div style="display:grid;place-items:center;width:24px;height:24px;border-radius:6px;background:${t.ctaGradient}">${spark(t.accentText)}</div><span style="font-weight:600">${name(d)}</span></div>
        <div style="display:flex;gap:24px">${links.map((l, i) => `<span data-edit="footerLinks.${i}">${esc(l)}</span>`).join('')}</div>
        <span data-edit="footerCopyright">${copy}</span>
      </div>
    </footer>`;
  },
};
