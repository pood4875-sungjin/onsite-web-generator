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
/* 신규 섹션 공용 조형 — 서피스 카드 / 섹션 표제(가운데 h2, 텍스트는 호출부에서 esc) */
const card = (t) => `border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder}`;
const secHead = (path, txt) => `<div class="rise" style="max-width:680px;margin:0 auto 40px;text-align:center"><h2 data-edit="${path}" style="margin:0;font-size:32px;font-weight:700;letter-spacing:-.02em">${txt}</h2></div>`;
const inputCss = (t) => `padding:12px 14px;border-radius:10px;background:${t.bg};border:1px solid ${t.surfaceBorder};color:${t.text};font:inherit;font-size:15px;outline:none`;

export const SECTIONS = {
  gnb(d, t) {
    // d.nav = 사이트 메뉴트리 [{name, active, children:[{name, active}]}] (스튜디오 레일에서 주입)
    // 없으면 기본 플레이스홀더.
    let nav;
    if (d.nav && d.nav.length) {
      nav = d.nav.map((it, ni) => {
        const on = it.active ? `color:${t.text};font-weight:600` : '';
        const hasKids = it.children && it.children.length;
        const sub = hasKids
          ? `<div class="nsub" style="position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:8px;padding:6px;min-width:150px;border-radius:12px;background:${t.bg};border:1px solid ${t.surfaceBorder};box-shadow:0 12px 40px rgba(0,0,0,.4)">
              ${it.children.map((c, ci) => `<span data-nav-page="${c.id || ''}" data-edit="nav.${ni}.children.${ci}.name" style="display:block;padding:8px 12px;border-radius:8px;white-space:nowrap;cursor:pointer;${c.active ? `color:${t.text};font-weight:600` : ''}">${esc(c.name)}</span>`).join('')}
            </div>`
          : '';
        return `<div class="nvi" data-nav-page="${it.id || ''}" style="position:relative;cursor:pointer;${on}"><span data-edit="nav.${ni}.name">${esc(it.name)}</span>${hasKids ? ' ▾' : ''}${sub}</div>`;
      }).join('');
    } else {
      // 단일 사이트 폴백 메뉴 — navLinks.N 필드로 편집 가능(폴백=기존 문구)
      nav = ['기능', '가격', '문서', '고객사례'].map((m, i) => `<a data-edit="navLinks.${i}" style="color:inherit;text-decoration:none;cursor:pointer">${esc((d.navLinks && d.navLinks[i]) || m)}</a>`).join('');
    }
    return `
    <header style="position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:16px 32px;backdrop-filter:blur(20px);background:${t.bg}cc;border-bottom:1px solid ${t.surfaceBorder}">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:${t.ctaGradient}">${spark(t.accentText)}</div>
        <span data-edit="productName" style="font-weight:600">${name(d)}</span>
      </div>
      <nav style="display:flex;gap:28px;color:${t.textMuted};font-size:14px">${nav}</nav>
      <button data-edit="primaryCta" style="padding:8px 16px;${btnCta(t)};border-radius:999px;font-size:14px">${cta(d)}</button>
    </header>`;
  },

  hero(d, t, motion, o) {
    const v = o && o.variant; // 변형 분기 — 미구현 값은 아래 기본형(center)으로 폴백
    if (v === 'split') return DGV.heroSplit(d, t);
    if (v === 'screenshot') return DGV.heroScreenshot(d, t);
    if (v === 'stat') return DGV.heroStat(d, t);
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
        <span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:${t.accentSoft};border:1px solid ${t.surfaceBorder};color:${t.accent};font-size:12px;letter-spacing:.02em"><span style="width:6px;height:6px;border-radius:999px;background:${t.accent}"></span><span data-edit="heroBadge">${esc(d.heroBadge || 'Engine v2.0 · AX 웹 제너레이터')}</span></span>
        <h1 data-edit="tagline" style="margin:24px 0 0;font-size:54px;font-weight:700;line-height:1.08;letter-spacing:-.03em">${tagline}</h1>
        <p data-edit="subcopy" style="max-width:520px;margin:20px auto 0;color:${t.textMuted};font-size:18px;line-height:1.6">${subcopy}</p>
        <div style="margin-top:32px;display:flex;align-items:center;justify-content:center;gap:12px">
          <button data-edit="primaryCta" class="dg-arw" style="display:inline-flex;align-items:center;gap:8px;padding:13px 24px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}">${cta(d)}</button>
          <button data-edit="secondaryCta" style="padding:13px 24px;border-radius:12px;background:${t.surface};border:1px solid ${t.surfaceBorder};color:${t.text};font-weight:600;cursor:pointer">${esc(d.secondaryCta || '문서 보기')}</button>
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
        <div data-edit="featureEyebrow" style="color:${t.accent};font-size:13px;letter-spacing:.08em;text-transform:uppercase">${esc(d.featureEyebrow || 'Features')}</div>
        <h2 data-edit="featureTitle" style="margin:12px 0 0;font-size:34px;font-weight:700;letter-spacing:-.02em">${esc(d.featureTitle || '명료함과 성능을 위해 설계됨')}</h2>
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
        <button data-edit="bannerCta" class="dg-arw" style="position:relative;display:inline-flex;align-items:center;gap:8px;padding:14px 28px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}">${bannerCta}</button>
      </div>
    </section>`;
  },

  footer(d, t) {
    const links = (d.footerLinks && d.footerLinks.length) ? d.footerLinks : ['이용약관', '개인정보처리방침', '문의'];
    const copy = esc(d.footerCopyright || `© 2026 ${name(d)} Labs`);
    return `
    <footer style="position:relative;padding:40px 32px;border-top:1px solid ${t.surfaceBorder};color:${t.textMuted};font-size:14px">
      <div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px;color:${t.text}"><div style="display:grid;place-items:center;width:24px;height:24px;border-radius:6px;background:${t.ctaGradient}">${spark(t.accentText)}</div><span data-edit="productName" style="font-weight:600">${name(d)}</span></div>
        <div style="display:flex;gap:24px">${links.map((l, i) => `<a data-edit="footerLinks.${i}" style="color:inherit;text-decoration:none;cursor:pointer">${esc(l)}</a>`).join('')}</div>
        <span data-edit="footerCopyright">${copy}</span>
      </div>
    </footer>`;
  },

  /* ============================================================
     신규 섹션 — pagetypes.js 페이지 유형 계약(스캐폴드 필드명 = data-edit 경로).
     모두 팩 토큰(t.*)만 사용 → aether/violet/ember 자동 리스킨.
     ============================================================ */

  // 서브페이지 히어로 — 메인 hero보다 낮고, 대시보드 목업 없음
  pagehero(d, t) {
    return `
    <section style="position:relative;overflow:hidden;padding:72px 32px 48px;text-align:center;background:${t.heroGradient}">
      <div style="position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:440px;height:260px;border-radius:999px;filter:blur(90px);background:${t.glow};pointer-events:none"></div>
      <div class="rise" style="position:relative;max-width:640px;margin:0 auto">
        <span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:${t.accentSoft};border:1px solid ${t.surfaceBorder};color:${t.accent};font-size:12px;letter-spacing:.02em"><span style="width:6px;height:6px;border-radius:999px;background:${t.accent}"></span><span data-edit="heroBadge">${esc(d.heroBadge || d.productName || '제품명')}</span></span>
        <h1 data-edit="tagline" style="margin:20px 0 0;font-size:44px;font-weight:700;line-height:1.12;letter-spacing:-.03em">${esc(d.tagline || '페이지 제목')}</h1>
        <p data-edit="subcopy" style="max-width:480px;margin:16px auto 0;color:${t.textMuted};font-size:17px;line-height:1.6">${esc(d.subcopy || '이 페이지를 한 문장으로 소개하세요.')}</p>
      </div>
    </section>`;
  },

  // 개요 — 좌 텍스트 + 우 포인트 체크 카드 (overview{title,text,points[]})
  overview(d, t) {
    const o = d.overview || {};
    const points = (o.points && o.points.length ? o.points : ['핵심 가치 1', '핵심 가치 2', '핵심 가치 3']);
    return `
    <section style="position:relative;padding:64px 32px">
      <div class="rise" style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:40px;align-items:center">
        <div>
          <div data-edit="overviewEyebrow" style="color:${t.accent};font-size:13px;letter-spacing:.08em;text-transform:uppercase">${esc(d.overviewEyebrow || 'Overview')}</div>
          <h2 data-edit="overview.title" style="margin:12px 0 0;font-size:32px;font-weight:700;letter-spacing:-.02em">${esc(o.title || '개요 제목')}</h2>
          <p data-edit="overview.text" style="margin:16px 0 0;color:${t.textMuted};font-size:16px;line-height:1.7">${esc(o.text || '무엇을 해결하는지 두세 문장으로 소개하세요.')}</p>
        </div>
        <div style="padding:26px 28px;${card(t)}">
          ${points.map((p, i) => `<div style="display:flex;align-items:center;gap:10px;padding:11px 0${i ? `;border-top:1px solid ${t.surfaceBorder}` : ''}">
            <span style="display:grid;place-items:center;width:22px;height:22px;flex:none;border-radius:999px;background:${t.accentSoft};color:${t.accent};font-size:12px">✓</span>
            <span data-edit="overview.points.${i}" style="font-size:15px">${esc(p)}</span></div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  // 소개 — 좁은 글로우 카드 한 장 (intro{title,text})
  intro(d, t) {
    const o = d.intro || {};
    return `
    <section style="position:relative;padding:64px 32px">
      <div class="rise" style="position:relative;max-width:720px;margin:0 auto;overflow:hidden;padding:48px 40px;text-align:center;${card(t)}">
        <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:280px;height:160px;border-radius:999px;filter:blur(70px);background:${t.glow};opacity:.5;pointer-events:none"></div>
        <h2 data-edit="intro.title" style="position:relative;margin:0;font-size:28px;font-weight:700;letter-spacing:-.02em">${esc(o.title || '소개 제목')}</h2>
        <p data-edit="intro.text" style="position:relative;max-width:520px;margin:14px auto 0;color:${t.textMuted};font-size:16px;line-height:1.7">${esc(o.text || '목적과 기대효과를 소개하세요.')}</p>
      </div>
    </section>`;
  },

  // 상세 기능 교차 행 — 텍스트/이미지 지그재그 (featureRows[{title,desc,points[]}], 이미지 키 frowN)
  featurerows(d, t) {
    const rows = (d.featureRows && d.featureRows.length ? d.featureRows : [
      { title: '대표 기능 하나', desc: '이 기능이 사용자의 어떤 문제를 어떻게 푸는지 설명하세요.', points: ['포인트 1', '포인트 2'] },
      { title: '대표 기능 둘', desc: '두 번째 상세 기능 설명.', points: ['포인트 1', '포인트 2'] },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:56px">
        ${rows.map((r, i) => {
          const img = d.images && d.images['frow' + i];
          const media = img
            ? `<img data-img="frow${i}" src="${esc(img)}" alt="" style="width:100%;border-radius:${t.radius};border:1px solid ${t.surfaceBorder};box-shadow:0 12px 48px ${t.glow}">`
            : `<div data-img="frow${i}" style="position:relative;overflow:hidden;aspect-ratio:4/3;display:grid;place-items:center;${card(t)}">
                <div style="position:absolute;right:-40px;bottom:-40px;width:160px;height:160px;border-radius:999px;filter:blur(48px);background:${t.glow};opacity:.4;pointer-events:none"></div>
                <div style="display:grid;place-items:center;width:52px;height:52px;border-radius:14px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</div>
              </div>`;
          const pts = (r.points || []).map((p, pi) => `<li data-edit="featureRows.${i}.points.${pi}" style="margin:6px 0;color:${t.textMuted};font-size:14px">${esc(p)}</li>`).join('');
          return `<div class="rise" style="display:grid;grid-template-columns:repeat(2,1fr);gap:40px;align-items:center">
            <div style="order:${i % 2 ? 2 : 1}">
              <h3 data-edit="featureRows.${i}.title" style="margin:0;font-size:26px;font-weight:700;letter-spacing:-.02em">${esc(r.title)}</h3>
              <p data-edit="featureRows.${i}.desc" style="margin:12px 0 0;color:${t.textMuted};font-size:15px;line-height:1.7">${esc(r.desc)}</p>
              ${pts ? `<ul style="margin:16px 0 0;padding-left:18px">${pts}</ul>` : ''}
            </div>
            <div style="order:${i % 2 ? 1 : 2}">${media}</div>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  },

  // 화면 갤러리 — 3열 이미지 자리 + 캡션 (gallery[{label}], 이미지 키 galleryN)
  gallery(d, t) {
    const items = (d.gallery && d.gallery.length ? d.gallery : [{ label: 'SCREEN 1' }, { label: 'SCREEN 2' }, { label: 'SCREEN 3' }]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('galleryTitle', esc(d.galleryTitle || '화면 미리보기'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((g, i) => {
          const img = d.images && d.images['gallery' + i];
          return `<figure class="rise" style="margin:0">
            ${img
              ? `<img data-img="gallery${i}" src="${esc(img)}" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:${t.radius};border:1px solid ${t.surfaceBorder}">`
              : `<div data-img="gallery${i}" style="aspect-ratio:4/3;display:grid;place-items:center;${card(t)}">${spark(t.accent)}</div>`}
            <figcaption data-edit="gallery.${i}.label" style="margin-top:10px;text-align:center;color:${t.textMuted};font-size:13px;letter-spacing:.04em">${esc(g.label)}</figcaption>
          </figure>`;
        }).join('')}
      </div>
    </section>`;
  },

  // 비교표 — 우리(하이라이트) vs 기존 방식 (compare{them,rows[{k,us,them}]})
  compare(d, t) {
    const c = d.compare || {};
    const rows = (c.rows && c.rows.length ? c.rows : [{ k: '구축 시간', us: '몇 분', them: '몇 주' }, { k: '비용', us: '구독형', them: '고정 인건비' }, { k: '수정', us: '즉시 반영', them: '외주 왕복' }]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('compareTitle', esc(d.compareTitle || '무엇이 다른가요'))}
      <div class="rise" style="max-width:760px;margin:0 auto;overflow-x:auto;border-radius:${t.radius};border:1px solid ${t.surfaceBorder}">
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          <thead><tr style="background:${t.surface}">
            <th style="padding:16px 20px"></th>
            <th style="padding:16px 20px;text-align:left;color:${t.accent};font-weight:700"><span data-edit="productName">${name(d)}</span></th>
            <th data-edit="compare.them" style="padding:16px 20px;text-align:left;color:${t.textMuted};font-weight:600">${esc(c.them || '기존 방식')}</th>
          </tr></thead>
          <tbody>
            ${rows.map((r, i) => `<tr style="border-top:1px solid ${t.surfaceBorder}">
              <td data-edit="compare.rows.${i}.k" style="padding:14px 20px;color:${t.textMuted};font-size:13px">${esc(r.k)}</td>
              <td data-edit="compare.rows.${i}.us" style="padding:14px 20px;background:${t.accentSoft};font-weight:600">${esc(r.us)}</td>
              <td data-edit="compare.rows.${i}.them" style="padding:14px 20px;color:${t.textMuted}">${esc(r.them)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
  },

  // FAQ — details 아코디언 (faq[{q,a}])
  faq(d, t) {
    const items = (d.faq && d.faq.length ? d.faq : [
      { q: '어떤 서비스인가요?', a: '서비스를 한 문장으로 설명해주세요.' },
      { q: '도입까지 얼마나 걸리나요?', a: '보통 걸리는 기간과 절차를 안내하세요.' },
      { q: '요금은 어떻게 되나요?', a: '과금 방식을 안내하세요.' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('faqTitle', esc(d.faqTitle || '자주 묻는 질문'))}
      <div class="rise" style="max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:12px">
        ${items.map((f, i) => `<details${i === 0 ? ' open' : ''} style="overflow:hidden;${card(t)}">
          <summary style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 22px;cursor:pointer;font-weight:600;font-size:16px;list-style:none"><span data-edit="faq.${i}.q">${esc(f.q)}</span><span style="color:${t.accent};flex:none">+</span></summary>
          <p data-edit="faq.${i}.a" style="margin:0;padding:0 22px 18px;color:${t.textMuted};font-size:15px;line-height:1.7">${esc(f.a)}</p>
        </details>`).join('')}
      </div>
    </section>`;
  },

  // 고객 후기 — 3열 인용 카드 (testimonials[{text,by}])
  testimonial(d, t) {
    const items = (d.testimonials && d.testimonials.length ? d.testimonials : [
      { text: '도입 후 페이지 제작 시간이 크게 줄었어요.', by: '고객사 담당자' },
      { text: '스타일 팩 덕분에 브랜드 일관성이 지켜집니다.', by: '디자인 리드' },
      { text: '개발 없이도 페이지를 계속 다듬을 수 있어요.', by: '마케팅 매니저' },
    ]).slice(0, 3);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('testimonialTitle', esc(d.testimonialTitle || '먼저 써본 분들의 이야기'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((q, i) => `<figure class="rise" style="margin:0;display:flex;flex-direction:column;gap:14px;padding:24px;${card(t)}">
          <div style="color:${t.accent}">${spark(t.accent)}</div>
          <blockquote data-edit="testimonials.${i}.text" style="margin:0;font-size:15px;line-height:1.7">${esc(q.text)}</blockquote>
          <figcaption data-edit="testimonials.${i}.by" style="margin-top:auto;color:${t.textMuted};font-size:13px">${esc(q.by)}</figcaption>
        </figure>`).join('')}
      </div>
    </section>`;
  },

  // 요금 플랜 — 3열, 가운데(hot) 강조 (plans[{name,price,desc,points[],cta,hot}])
  pricing(d, t) {
    const plans = (d.plans && d.plans.length ? d.plans : [
      { name: '스타터', price: '무료', desc: '개인·소규모 팀', points: ['페이지 1개', '기본 스타일 팩'], cta: '무료로 시작' },
      { name: '프로', price: '월 29,000원', desc: '성장하는 팀', points: ['페이지 무제한', '전체 스타일 팩', 'AI 문구 생성'], cta: '프로 시작하기', hot: true },
      { name: '엔터프라이즈', price: '문의', desc: '맞춤 도입', points: ['전담 지원', '보안·SSO'], cta: '도입 문의' },
    ]).slice(0, 3);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('pricingTitle', esc(d.pricingTitle || '팀에 맞는 플랜을 고르세요'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:stretch">
        ${plans.map((p, i) => `<div class="rise" style="position:relative;display:flex;flex-direction:column;gap:14px;overflow:hidden;padding:28px 24px;${card(t)}${p.hot ? `;border-color:${t.accent};box-shadow:0 12px 48px ${t.glow}` : ''}">
          ${p.hot ? `<div style="position:absolute;inset:0;background:${t.heroGradient};pointer-events:none"></div><span data-edit="plans.${i}.badge" style="position:absolute;top:16px;right:16px;padding:3px 10px;border-radius:999px;background:${t.accentSoft};color:${t.accent};font-size:11px;letter-spacing:.04em">${esc(p.badge || '인기')}</span>` : ''}
          <div style="position:relative">
            <div data-edit="plans.${i}.name" style="font-weight:600;font-size:16px">${esc(p.name)}</div>
            <div data-edit="plans.${i}.price" style="margin-top:10px;font-size:30px;font-weight:700;letter-spacing:-.02em">${esc(p.price)}</div>
            <div data-edit="plans.${i}.desc" style="margin-top:6px;color:${t.textMuted};font-size:13px">${esc(p.desc)}</div>
          </div>
          <div style="position:relative;display:flex;flex-direction:column;gap:8px;padding-top:14px;border-top:1px solid ${t.surfaceBorder}">
            ${(p.points || []).map((pt2, pi) => `<div style="display:flex;align-items:center;gap:8px;font-size:14px;color:${t.textMuted}"><span style="color:${t.accent}">✓</span><span data-edit="plans.${i}.points.${pi}">${esc(pt2)}</span></div>`).join('')}
          </div>
          <button data-edit="plans.${i}.cta" style="position:relative;margin-top:auto;width:100%;padding:12px 0;font-size:14px;${p.hot ? btnCta(t) : `background:${t.surface};color:${t.text};font-weight:600;border:1px solid ${t.surfaceBorder};border-radius:12px;cursor:pointer`}">${esc(p.cta || d.primaryCta || '시작하기')}</button>
        </div>`).join('')}
      </div>
    </section>`;
  },

  // 문의 폼 — 정적 데모(제출 비활성) (form{title,sub,fields[],submit})
  form(d, t) {
    const f = d.form || {};
    const fields = (f.fields && f.fields.length ? f.fields : ['회사명', '담당자 이름', '이메일', '문의 내용']);
    return `
    <section style="position:relative;padding:64px 32px">
      <div class="rise" style="position:relative;max-width:560px;margin:0 auto;overflow:hidden;padding:40px;${card(t)}">
        <div style="position:absolute;top:-70px;right:-70px;width:220px;height:220px;border-radius:999px;filter:blur(70px);background:${t.glow};opacity:.35;pointer-events:none"></div>
        <h2 data-edit="form.title" style="position:relative;margin:0;font-size:28px;font-weight:700;letter-spacing:-.02em">${esc(f.title || '도입 문의')}</h2>
        <p data-edit="form.sub" style="position:relative;margin:10px 0 0;color:${t.textMuted};font-size:15px;line-height:1.6">${esc(f.sub || '남겨주시면 1영업일 안에 연락드립니다.')}</p>
        <form onsubmit="return false" style="position:relative;margin-top:28px;display:flex;flex-direction:column;gap:16px">
          ${fields.map((lb, i) => {
            const long = fields.length > 1 && i === fields.length - 1;
            return `<label style="display:flex;flex-direction:column;gap:6px;font-size:13px;color:${t.textMuted}"><span data-edit="form.fields.${i}">${esc(lb)}</span>${long ? `<textarea rows="4" style="${inputCss(t)};resize:vertical"></textarea>` : `<input type="text" style="${inputCss(t)}">`}</label>`;
          }).join('')}
          <button type="button" data-edit="form.submit" class="dg-arw" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;${btnCta(t)}">${esc(f.submit || '문의 보내기')}</button>
        </form>
      </div>
    </section>`;
  },

  // 안내 카드 — 3열 (infoCards[{title,text}])
  infocards(d, t) {
    const items = (d.infoCards && d.infoCards.length ? d.infoCards : [
      { title: '이메일', text: 'contact@example.com' },
      { title: '전화', text: '02-000-0000' },
      { title: '도입 절차', text: '문의 → 상담 → 견적 → 도입' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((c, i) => `<div class="rise" style="padding:24px;${card(t)}">
          <div style="display:grid;place-items:center;width:40px;height:40px;border-radius:10px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</div>
          <h3 data-edit="infoCards.${i}.title" style="margin:14px 0 0;font-size:16px;font-weight:600">${esc(c.title)}</h3>
          <p data-edit="infoCards.${i}.text" style="margin:6px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(c.text)}</p>
        </div>`).join('')}
      </div>
    </section>`;
  },

  // 문서 목록 — 2열 링크 카드 (docs[{title,desc}])
  doclist(d, t) {
    const items = (d.docs && d.docs.length ? d.docs : [
      { title: '시작하기', desc: '설치와 첫 설정' },
      { title: '핵심 기능', desc: '주요 기능 사용법' },
      { title: '관리자 가이드', desc: '권한·설정 관리' },
      { title: '자주 묻는 질문', desc: '문제 해결 모음' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('docsTitle', esc(d.docsTitle || '가이드 문서'))}
      <div style="max-width:760px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:14px">
        ${items.map((dc, i) => `<div class="rise" style="display:flex;align-items:flex-start;gap:14px;padding:20px 22px;${card(t)}">
          <span style="display:grid;place-items:center;width:40px;height:40px;flex:none;border-radius:10px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</span>
          <span style="flex:1;min-width:0">
            <a data-edit="docs.${i}.title" style="display:block;font-weight:600;font-size:16px;color:inherit;text-decoration:none;cursor:pointer">${esc(dc.title)}</a>
            <span data-edit="docs.${i}.desc" style="display:block;margin-top:4px;color:${t.textMuted};font-size:14px">${esc(dc.desc)}</span>
          </span>
          <span class="dg-arw" style="color:${t.accent};flex:none"></span>
        </div>`).join('')}
      </div>
    </section>`;
  },

  // 시작 절차 — 3열 번호 카드 (steps[{title,text}])
  steps(d, t) {
    const items = (d.steps && d.steps.length ? d.steps : [
      { title: '가입', text: '계정을 만듭니다.' },
      { title: '설정', text: '기본 정보를 입력합니다.' },
      { title: '시작', text: '첫 결과물을 만듭니다.' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('stepsTitle', esc(d.stepsTitle || '이렇게 시작하세요'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((s, i) => `<div class="rise" style="padding:24px;${card(t)}">
          <div style="display:grid;place-items:center;width:32px;height:32px;border-radius:999px;background:${t.ctaGradient};color:${t.accentText};font-weight:700;font-size:14px">${i + 1}</div>
          <h3 data-edit="steps.${i}.title" style="margin:14px 0 0;font-size:17px;font-weight:600">${esc(s.title)}</h3>
          <p data-edit="steps.${i}.text" style="margin:6px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(s.text)}</p>
        </div>`).join('')}
      </div>
    </section>`;
  },

  // 블로그 목록 — 3열 카드 (posts[{title,desc,date,tag}], 이미지 키 postN)
  bloglist(d, t) {
    const items = (d.posts && d.posts.length ? d.posts : [
      { title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' },
      { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' },
      { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((p, i) => {
          const img = d.images && d.images['post' + i];
          return `<div class="rise" style="display:flex;flex-direction:column;overflow:hidden;${card(t)}">
            ${img
              ? `<img data-img="post${i}" src="${esc(img)}" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-bottom:1px solid ${t.surfaceBorder}">`
              : `<div data-img="post${i}" style="aspect-ratio:16/9;display:grid;place-items:center;background:${t.accentSoft};border-bottom:1px solid ${t.surfaceBorder}">${spark(t.accent)}</div>`}
            <div style="display:flex;flex-direction:column;gap:8px;padding:20px">
              <div style="display:flex;align-items:center;gap:10px;font-size:12px"><span data-edit="posts.${i}.tag" style="padding:3px 10px;border-radius:999px;background:${t.accentSoft};color:${t.accent};letter-spacing:.04em">${esc(p.tag)}</span><span data-edit="posts.${i}.date" style="color:${t.textMuted}">${esc(p.date)}</span></div>
              <h3 style="margin:0;font-size:17px;font-weight:600;line-height:1.4"><a data-edit="posts.${i}.title" style="color:inherit;text-decoration:none;cursor:pointer">${esc(p.title)}</a></h3>
              <p data-edit="posts.${i}.desc" style="margin:0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(p.desc)}</p>
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  },

  // 아젠다 — 시간 축 타임라인 (agenda[{time,title,desc}])
  agenda(d, t) {
    const items = (d.agenda && d.agenda.length ? d.agenda : [
      { time: '14:00', title: '오프닝', desc: '환영 인사' },
      { time: '14:30', title: '세션 1', desc: '주제 발표' },
      { time: '15:30', title: '세션 2', desc: '사례 공유' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('agendaTitle', esc(d.agendaTitle || '프로그램'))}
      <div class="rise" style="max-width:720px;margin:0 auto;padding:8px 28px;${card(t)}">
        ${items.map((a, i) => `<div style="display:grid;grid-template-columns:88px 1fr;gap:20px;padding:18px 0${i ? `;border-top:1px solid ${t.surfaceBorder}` : ''}">
          <div data-edit="agenda.${i}.time" style="color:${t.accent};font-weight:700;font-size:15px">${esc(a.time)}</div>
          <div>
            <h3 data-edit="agenda.${i}.title" style="margin:0;font-size:17px;font-weight:600">${esc(a.title)}</h3>
            <p data-edit="agenda.${i}.desc" style="margin:6px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(a.desc)}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>`;
  },

  // 스피커 — 3열 프로필 카드 (speakers[{name,role,desc}], 이미지 키 speakerN)
  speakers(d, t) {
    const items = (d.speakers && d.speakers.length ? d.speakers : [
      { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
      { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
      { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('speakersTitle', esc(d.speakersTitle || '스피커'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((s, i) => {
          const img = d.images && d.images['speaker' + i];
          return `<div class="rise" style="padding:28px 24px;text-align:center;${card(t)}">
            ${img
              ? `<img data-img="speaker${i}" src="${esc(img)}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:999px;border:1px solid ${t.surfaceBorder};margin:0 auto;display:block">`
              : `<div data-img="speaker${i}" style="display:grid;place-items:center;width:72px;height:72px;margin:0 auto;border-radius:999px;background:${t.ctaGradient};color:${t.accentText};font-weight:700;font-size:22px">${spark(t.accentText)}</div>`}
            <h3 data-edit="speakers.${i}.name" style="margin:16px 0 0;font-size:17px;font-weight:600">${esc(s.name)}</h3>
            <div data-edit="speakers.${i}.role" style="margin-top:4px;color:${t.accent};font-size:13px">${esc(s.role)}</div>
            <p data-edit="speakers.${i}.desc" style="margin:10px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(s.desc)}</p>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  },

  // 안내 — 좌측 그라디언트 바 리스트 (notices[{title,text}])
  notice(d, t) {
    const items = (d.notices && d.notices.length ? d.notices : [
      { title: '참가 안내', text: '사전 등록 필수, 선착순 마감.' },
      { title: '주차 안내', text: '행사장 주차 지원 여부를 안내하세요.' },
      { title: '문의', text: 'event@example.com' },
    ]);
    return `
    <section style="position:relative;padding:64px 32px">
      ${secHead('noticeTitle', esc(d.noticeTitle || '참가 전 확인하세요'))}
      <div class="rise" style="max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:12px">
        ${items.map((n, i) => `<div style="display:flex;gap:14px;padding:18px 22px;${card(t)}">
          <span style="width:3px;flex:none;border-radius:999px;background:${t.ctaGradient}"></span>
          <div>
            <h3 data-edit="notices.${i}.title" style="margin:0;font-size:15px;font-weight:600">${esc(n.title)}</h3>
            <p data-edit="notices.${i}.text" style="margin:4px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(n.text)}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>`;
  },
};

/* ============================================================
   DGV — 섹션 표현 변형 렌더러 (pagetypes.js SECTION_VARIANTS 계약)
   기본형 코드는 SECTIONS에 그대로 두고 변형만 분기 구현.
   규칙: 토큰 t.* 만 사용(3팩 자동 리스킨) · data-edit 경로는 기본형과 동일 ·
   장식 화살표는 .dg-arw::after · 인용부호 등 장식은 data-edit 밖 ·
   마커 클래스 dgv-<섹션>-<변형> · lead=true면 섹션 표제 생략.
   ============================================================ */
const dgvDash = (t) => [0, 1, 2].map(() => `
      <div style="display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:10px;background:${t.accentSoft}">
        <div style="height:8px;width:66%;border-radius:999px;background:${t.accent};opacity:.7"></div>
        <div style="height:8px;width:100%;border-radius:999px;background:${t.surfaceBorder}"></div>
        <div style="height:8px;width:80%;border-radius:999px;background:${t.surfaceBorder}"></div>
        <div style="height:40px;border-radius:10px;background:${t.ctaGradient};opacity:.85;margin-top:8px"></div>
      </div>`).join('');
/* 브라우저 프레임 목업 — hero 변형 공용(images.hero 있으면 실제 이미지) */
const dgvMock = (d, t) => (d.images && d.images.hero)
  ? `<img data-img="hero" src="${esc(d.images.hero)}" alt="" style="display:block;width:100%;border-radius:${t.radius};box-shadow:0 20px 80px ${t.glow}">`
  : `<div data-img="hero" style="overflow:hidden;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder};box-shadow:0 20px 80px ${t.glow}">
      <div style="display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid ${t.surfaceBorder}">
        <span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span><span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span><span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span>
        <span style="margin-left:12px;font-size:12px;color:${t.textMuted}">${name(d).toLowerCase()}.app / console</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px">${dgvDash(t)}</div>
    </div>`;
const dgvBadge = (d, t) => `<span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:${t.accentSoft};border:1px solid ${t.surfaceBorder};color:${t.accent};font-size:12px;letter-spacing:.02em"><span style="width:6px;height:6px;border-radius:999px;background:${t.accent}"></span><span data-edit="heroBadge">${esc(d.heroBadge || 'Engine v2.0 · AX 웹 제너레이터')}</span></span>`;
const dgvHeroBtns = (d, t) => `<button data-edit="primaryCta" class="dg-arw" style="display:inline-flex;align-items:center;gap:8px;padding:13px 24px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}">${cta(d)}</button>
          <button data-edit="secondaryCta" style="padding:13px 24px;border-radius:12px;background:${t.surface};border:1px solid ${t.surfaceBorder};color:${t.text};font-weight:600;cursor:pointer">${esc(d.secondaryCta || '문서 보기')}</button>`;
/* features 변형 공용 표제 — 기본형 features의 표제와 동일 마크업 */
const dgvFeatHead = (d, t) => `<div class="rise" style="max-width:680px;margin:0 auto;text-align:center">
        <div data-edit="featureEyebrow" style="color:${t.accent};font-size:13px;letter-spacing:.08em;text-transform:uppercase">${esc(d.featureEyebrow || 'Features')}</div>
        <h2 data-edit="featureTitle" style="margin:12px 0 0;font-size:34px;font-weight:700;letter-spacing:-.02em">${esc(d.featureTitle || '명료함과 성능을 위해 설계됨')}</h2>
      </div>`;

export const DGV = {
  /* hero:split — 텍스트 좌 / 제품 화면 우 */
  heroSplit(d, t) {
    return `
    <section class="dgv-hero-split" style="position:relative;overflow:hidden;padding:88px 32px 64px;background:${t.heroGradient}">
      <div style="position:absolute;top:-80px;left:24%;width:520px;height:320px;border-radius:999px;filter:blur(100px);background:${t.glow};pointer-events:none"></div>
      <div class="rise" style="position:relative;max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:48px;align-items:center">
        <div>
          ${dgvBadge(d, t)}
          <h1 data-edit="tagline" style="margin:22px 0 0;font-size:46px;font-weight:700;line-height:1.1;letter-spacing:-.03em">${esc(d.tagline || '대화만으로 완성되는 인터페이스')}</h1>
          <p data-edit="subcopy" style="margin:18px 0 0;color:${t.textMuted};font-size:17px;line-height:1.65">${esc(d.subcopy || '기획을 대화로 입력하면, 선택한 스타일 팩으로 온브랜드 웹페이지를 아키텍처 수준의 정밀함으로 합성합니다.')}</p>
          <div style="margin-top:30px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">${dgvHeroBtns(d, t)}</div>
        </div>
        <div>${dgvMock(d, t)}</div>
      </div>
    </section>`;
  },

  /* hero:screenshot — 하단 대형 제품 화면 강조 */
  heroScreenshot(d, t) {
    return `
    <section class="dgv-hero-screenshot" style="position:relative;overflow:hidden;padding:72px 32px 56px;text-align:center;background:${t.heroGradient}">
      <div style="position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:520px;height:320px;border-radius:999px;filter:blur(100px);background:${t.glow};pointer-events:none"></div>
      <div class="rise" style="position:relative;max-width:640px;margin:0 auto">
        ${dgvBadge(d, t)}
        <h1 data-edit="tagline" style="margin:22px 0 0;font-size:44px;font-weight:700;line-height:1.1;letter-spacing:-.03em">${esc(d.tagline || '대화만으로 완성되는 인터페이스')}</h1>
        <p data-edit="subcopy" style="max-width:520px;margin:16px auto 0;color:${t.textMuted};font-size:17px;line-height:1.6">${esc(d.subcopy || '기획을 대화로 입력하면, 선택한 스타일 팩으로 온브랜드 웹페이지를 아키텍처 수준의 정밀함으로 합성합니다.')}</p>
        <div style="margin-top:28px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap">${dgvHeroBtns(d, t)}</div>
      </div>
      <div class="rise" style="position:relative;max-width:960px;margin:52px auto 0">${dgvMock(d, t)}</div>
    </section>`;
  },

  /* hero:stat — 숫자·성과 강조 타이포 (stats.N.* 필드 공유) */
  heroStat(d, t) {
    const stats = (d.stats && d.stats.length ? d.stats : PH_STATS).slice(0, 3);
    return `
    <section class="dgv-hero-stat" style="position:relative;overflow:hidden;padding:88px 32px 64px;text-align:center;background:${t.heroGradient}">
      <div style="position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:520px;height:320px;border-radius:999px;filter:blur(100px);background:${t.glow};pointer-events:none"></div>
      <div class="rise" style="position:relative;max-width:720px;margin:0 auto">
        ${dgvBadge(d, t)}
        <h1 data-edit="tagline" style="margin:24px 0 0;font-size:54px;font-weight:700;line-height:1.08;letter-spacing:-.03em">${esc(d.tagline || '대화만으로 완성되는 인터페이스')}</h1>
        <p data-edit="subcopy" style="max-width:520px;margin:20px auto 0;color:${t.textMuted};font-size:18px;line-height:1.6">${esc(d.subcopy || '기획을 대화로 입력하면, 선택한 스타일 팩으로 온브랜드 웹페이지를 아키텍처 수준의 정밀함으로 합성합니다.')}</p>
        <div style="margin-top:30px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap">${dgvHeroBtns(d, t)}</div>
      </div>
      <div class="rise" style="position:relative;max-width:760px;margin:52px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${stats.map((s, i) => `<div style="padding:18px 12px;border-top:1px solid ${t.surfaceBorder}">
          <div data-edit="stats.${i}.value" style="font-size:40px;font-weight:700;letter-spacing:-.02em;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(s.value)}</div>
          <div data-edit="stats.${i}.label" style="margin-top:4px;color:${t.textMuted};font-size:13px">${esc(s.label)}</div></div>`).join('')}
      </div>
    </section>`;
  },

  /* features:cards — 아이콘 없는 카드형(상단 액센트 바) */
  featuresCards(d, t, lead) {
    const features = (d.features && d.features.length ? d.features : PH_FEATURES).slice(0, 6);
    return `
    <section class="dgv-features-cards" style="position:relative;padding:64px 32px">
      ${lead ? '' : dgvFeatHead(d, t)}
      <div style="max-width:900px;margin:${lead ? '0' : '48px'} auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${features.map((f, i) => `<div class="rise" style="padding:26px 24px;${card(t)};border-top:2px solid ${t.accent}">
          <h3 data-edit="features.${i}.title" style="margin:0;font-size:18px;font-weight:600">${esc(f.title)}</h3>
          <p data-edit="features.${i}.desc" style="margin:10px 0 0;color:${t.textMuted};font-size:15px;line-height:1.6">${esc(f.desc)}</p></div>`).join('')}
      </div>
    </section>`;
  },

  /* features:bento — 대표 1(풀폭) + 보조 그리드 */
  featuresBento(d, t, lead) {
    const features = (d.features && d.features.length ? d.features : PH_FEATURES).slice(0, 6);
    return `
    <section class="dgv-features-bento" style="position:relative;padding:64px 32px">
      ${lead ? '' : dgvFeatHead(d, t)}
      <div style="max-width:900px;margin:${lead ? '0' : '48px'} auto 0;display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        ${features.map((f, i) => {
          const big = i === 0;
          return `<div class="rise" style="position:relative;overflow:hidden;padding:${big ? '36px 32px' : '24px'};${card(t)}${big ? `;grid-column:1/-1;border-color:${t.accent}` : ''}">
            ${big ? `<div style="position:absolute;right:-48px;top:-48px;width:200px;height:200px;border-radius:999px;filter:blur(56px);background:${t.glow};opacity:.45;pointer-events:none"></div>` : ''}
            <div style="position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</div>
            <h3 data-edit="features.${i}.title" style="position:relative;margin:16px 0 0;font-size:${big ? '24px' : '17px'};font-weight:600">${esc(f.title)}</h3>
            <p data-edit="features.${i}.desc" style="position:relative;margin:8px 0 0;${big ? 'max-width:520px;' : ''}color:${t.textMuted};font-size:15px;line-height:1.6">${esc(f.desc)}</p></div>`;
        }).join('')}
      </div>
    </section>`;
  },

  /* features:list — 아이콘 리스트(밀도형 2단) */
  featuresList(d, t, lead) {
    const features = (d.features && d.features.length ? d.features : PH_FEATURES).slice(0, 6);
    return `
    <section class="dgv-features-list" style="position:relative;padding:64px 32px">
      ${lead ? '' : dgvFeatHead(d, t)}
      <div style="max-width:760px;margin:${lead ? '0' : '40px'} auto 0;display:grid;grid-template-columns:repeat(2,1fr);gap:8px 32px">
        ${features.map((f, i) => `<div class="rise" style="display:flex;gap:14px;padding:16px 4px">
          <span style="display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:10px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</span>
          <span style="min-width:0">
            <span data-edit="features.${i}.title" style="display:block;font-weight:600;font-size:15px">${esc(f.title)}</span>
            <span data-edit="features.${i}.desc" style="display:block;margin-top:3px;color:${t.textMuted};font-size:14px;line-height:1.55">${esc(f.desc)}</span>
          </span>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* stats:kpi — 좌측 그라디언트 바 KPI 카드 */
  metricsKpi(d, t) {
    const stats = (d.stats && d.stats.length ? d.stats : PH_STATS).slice(0, 3);
    return `
    <section class="dgv-metrics-kpi" style="position:relative;padding:40px 32px">
      <div class="rise" style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${stats.map((s, i) => `<div style="position:relative;overflow:hidden;padding:24px;${card(t)}">
          <span style="position:absolute;left:0;top:0;bottom:0;width:3px;background:${t.ctaGradient}"></span>
          <div data-edit="stats.${i}.label" style="color:${t.textMuted};font-size:12px;letter-spacing:.06em;text-transform:uppercase">${esc(s.label)}</div>
          <div data-edit="stats.${i}.value" style="margin-top:8px;font-size:34px;font-weight:700;letter-spacing:-.02em;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(s.value)}</div>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* stats:big — 대형 숫자 하나 강조 + 보조 수치 행 */
  metricsBig(d, t) {
    const stats = (d.stats && d.stats.length ? d.stats : PH_STATS).slice(0, 3);
    const first = stats[0];
    const rest = stats.slice(1);
    return `
    <section class="dgv-metrics-big" style="position:relative;padding:56px 32px;text-align:center">
      <div class="rise" style="max-width:720px;margin:0 auto">
        <div data-edit="stats.0.value" style="font-size:84px;font-weight:700;letter-spacing:-.04em;line-height:1;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(first.value)}</div>
        <div data-edit="stats.0.label" style="margin-top:10px;color:${t.textMuted};font-size:15px">${esc(first.label)}</div>
        ${rest.length ? `<div style="margin-top:32px;display:inline-flex;flex-wrap:wrap;justify-content:center;gap:16px 40px;padding:16px 32px;border-top:1px solid ${t.surfaceBorder}">
          ${rest.map((s, i) => `<div><span data-edit="stats.${i + 1}.value" style="font-weight:700;font-size:20px">${esc(s.value)}</span><span data-edit="stats.${i + 1}.label" style="margin-left:8px;color:${t.textMuted};font-size:13px">${esc(s.label)}</span></div>`).join('')}
        </div>` : ''}
      </div>
    </section>`;
  },

  /* compare:beforeafter — 좌 기존 방식(✕) / 우 우리(✓, 하이라이트) 패널 */
  compareBeforeafter(d, t, lead) {
    const c = d.compare || {};
    const rows = (c.rows && c.rows.length ? c.rows : [{ k: '구축 시간', us: '몇 분', them: '몇 주' }, { k: '비용', us: '구독형', them: '고정 인건비' }, { k: '수정', us: '즉시 반영', them: '외주 왕복' }]);
    return `
    <section class="dgv-compare-beforeafter" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('compareTitle', esc(d.compareTitle || '무엇이 다른가요'))}
      <div class="rise" style="max-width:820px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        <div style="padding:26px 28px;${card(t)}">
          <div data-edit="compare.them" style="color:${t.textMuted};font-weight:600;font-size:14px;letter-spacing:.04em">${esc(c.them || '기존 방식')}</div>
          ${rows.map((r, i) => `<div style="display:flex;gap:10px;align-items:baseline;padding:12px 0;${i ? `border-top:1px solid ${t.surfaceBorder}` : 'margin-top:14px'}">
            <span style="color:${t.textMuted};flex:none">✕</span>
            <span style="min-width:0"><span style="display:block;color:${t.textMuted};font-size:12px">${esc(r.k)}</span><span data-edit="compare.rows.${i}.them" style="display:block;margin-top:2px;color:${t.textMuted};font-size:15px">${esc(r.them)}</span></span>
          </div>`).join('')}
        </div>
        <div style="position:relative;overflow:hidden;padding:26px 28px;${card(t)};border-color:${t.accent};box-shadow:0 12px 48px ${t.glow}">
          <div style="position:absolute;inset:0;background:${t.heroGradient};pointer-events:none"></div>
          <div style="position:relative;color:${t.accent};font-weight:700;font-size:14px;letter-spacing:.04em"><span data-edit="productName">${name(d)}</span></div>
          ${rows.map((r, i) => `<div style="position:relative;display:flex;gap:10px;align-items:baseline;padding:12px 0;${i ? `border-top:1px solid ${t.surfaceBorder}` : 'margin-top:14px'}">
            <span style="color:${t.accent};flex:none">✓</span>
            <span style="min-width:0"><span data-edit="compare.rows.${i}.k" style="display:block;color:${t.textMuted};font-size:12px">${esc(r.k)}</span><span data-edit="compare.rows.${i}.us" style="display:block;margin-top:2px;font-weight:600;font-size:15px">${esc(r.us)}</span></span>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  },

  /* compare:cards — 항목별 카드(우리 값 강조 + 하단 기존 방식) */
  compareCards(d, t, lead) {
    const c = d.compare || {};
    const rows = (c.rows && c.rows.length ? c.rows : [{ k: '구축 시간', us: '몇 분', them: '몇 주' }, { k: '비용', us: '구독형', them: '고정 인건비' }, { k: '수정', us: '즉시 반영', them: '외주 왕복' }]);
    return `
    <section class="dgv-compare-cards" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('compareTitle', esc(d.compareTitle || '무엇이 다른가요'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${rows.map((r, i) => `<div class="rise" style="padding:24px;${card(t)}">
          <div data-edit="compare.rows.${i}.k" style="color:${t.textMuted};font-size:13px">${esc(r.k)}</div>
          <div data-edit="compare.rows.${i}.us" style="margin-top:10px;font-size:22px;font-weight:700;letter-spacing:-.01em;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(r.us)}</div>
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid ${t.surfaceBorder};color:${t.textMuted};font-size:13px">${i ? `<span>${esc(c.them || '기존 방식')}</span>` : `<span data-edit="compare.them">${esc(c.them || '기존 방식')}</span>`} · <span data-edit="compare.rows.${i}.them">${esc(r.them)}</span></div>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* testimonial:single — 단일 대형 인용(인용부호는 data-edit 밖) */
  testimonialSingle(d, t, lead) {
    const items = (d.testimonials && d.testimonials.length ? d.testimonials : [
      { text: '도입 후 페이지 제작 시간이 크게 줄었어요.', by: '고객사 담당자' },
    ]);
    const q = items[0];
    return `
    <section class="dgv-testimonial-single" style="position:relative;padding:72px 32px;text-align:center">
      ${lead ? '' : secHead('testimonialTitle', esc(d.testimonialTitle || '먼저 써본 분들의 이야기'))}
      <figure class="rise" style="max-width:760px;margin:0 auto">
        <div style="display:inline-flex;gap:4px;color:${t.accent}">${spark(t.accent)}${spark(t.accent)}${spark(t.accent)}</div>
        <blockquote style="margin:20px 0 0;font-size:26px;font-weight:600;line-height:1.5;letter-spacing:-.01em">“<span data-edit="testimonials.0.text">${esc(q.text)}</span>”</blockquote>
        <figcaption data-edit="testimonials.0.by" style="margin-top:18px;color:${t.textMuted};font-size:14px">${esc(q.by)}</figcaption>
      </figure>
    </section>`;
  },

  /* testimonial:logos — 고객사(작성자) 로고 그리드 + 대표 인용 한 줄 */
  testimonialLogos(d, t, lead) {
    const items = (d.testimonials && d.testimonials.length ? d.testimonials : [
      { text: '도입 후 페이지 제작 시간이 크게 줄었어요.', by: '고객사 담당자' },
      { text: '스타일 팩 덕분에 브랜드 일관성이 지켜집니다.', by: '디자인 리드' },
      { text: '개발 없이도 페이지를 계속 다듬을 수 있어요.', by: '마케팅 매니저' },
    ]).slice(0, 6);
    return `
    <section class="dgv-testimonial-logos" style="position:relative;padding:64px 32px;text-align:center">
      ${lead ? '' : secHead('testimonialTitle', esc(d.testimonialTitle || '먼저 써본 분들의 이야기'))}
      <div class="rise" style="max-width:820px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        ${items.map((q, i) => `<div style="display:grid;place-items:center;padding:22px 16px;${card(t)}">
          <span data-edit="testimonials.${i}.by" style="color:${t.textMuted};font-weight:700;font-size:15px;letter-spacing:.06em">${esc(q.by)}</span>
        </div>`).join('')}
      </div>
      <p class="rise" style="max-width:560px;margin:28px auto 0;color:${t.textMuted};font-size:15px;line-height:1.7">“<span data-edit="testimonials.0.text">${esc(items[0].text)}</span>”</p>
    </section>`;
  },

  /* steps:vertical — 세로 타임라인 */
  stepsVertical(d, t, lead) {
    const items = (d.steps && d.steps.length ? d.steps : [
      { title: '가입', text: '계정을 만듭니다.' },
      { title: '설정', text: '기본 정보를 입력합니다.' },
      { title: '시작', text: '첫 결과물을 만듭니다.' },
    ]);
    return `
    <section class="dgv-steps-vertical" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('stepsTitle', esc(d.stepsTitle || '이렇게 시작하세요'))}
      <div class="rise" style="max-width:560px;margin:0 auto">
        ${items.map((s, i) => `<div style="position:relative;display:flex;gap:18px;padding-bottom:${i === items.length - 1 ? '0' : '28px'}">
          ${i === items.length - 1 ? '' : `<span style="position:absolute;left:15px;top:36px;bottom:4px;width:2px;background:${t.surfaceBorder}"></span>`}
          <span style="display:grid;place-items:center;width:32px;height:32px;flex:none;border-radius:999px;background:${t.ctaGradient};color:${t.accentText};font-weight:700;font-size:14px">${i + 1}</span>
          <div style="padding-top:4px">
            <h3 data-edit="steps.${i}.title" style="margin:0;font-size:17px;font-weight:600">${esc(s.title)}</h3>
            <p data-edit="steps.${i}.text" style="margin:6px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(s.text)}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* steps:cards — 고스트 넘버 카드 스텝 */
  stepsCards(d, t, lead) {
    const items = (d.steps && d.steps.length ? d.steps : [
      { title: '가입', text: '계정을 만듭니다.' },
      { title: '설정', text: '기본 정보를 입력합니다.' },
      { title: '시작', text: '첫 결과물을 만듭니다.' },
    ]);
    return `
    <section class="dgv-steps-cards" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('stepsTitle', esc(d.stepsTitle || '이렇게 시작하세요'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${items.map((s, i) => `<div class="rise" style="position:relative;overflow:hidden;padding:26px 24px;${card(t)}">
          <div style="position:absolute;right:12px;top:2px;font-size:64px;font-weight:700;letter-spacing:-.04em;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.22;pointer-events:none">${String(i + 1).padStart(2, '0')}</div>
          <div style="position:relative;color:${t.accent};font-size:12px;letter-spacing:.08em;text-transform:uppercase">Step ${i + 1}</div>
          <h3 data-edit="steps.${i}.title" style="position:relative;margin:10px 0 0;font-size:17px;font-weight:600">${esc(s.title)}</h3>
          <p data-edit="steps.${i}.text" style="position:relative;margin:6px 0 0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(s.text)}</p>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* faq:twocol — 2단 Q/A 그리드(아코디언 아님) */
  faqTwocol(d, t, lead) {
    const items = (d.faq && d.faq.length ? d.faq : [
      { q: '어떤 서비스인가요?', a: '서비스를 한 문장으로 설명해주세요.' },
      { q: '도입까지 얼마나 걸리나요?', a: '보통 걸리는 기간과 절차를 안내하세요.' },
      { q: '요금은 어떻게 되나요?', a: '과금 방식을 안내하세요.' },
    ]);
    return `
    <section class="dgv-faq-twocol" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('faqTitle', esc(d.faqTitle || '자주 묻는 질문'))}
      <div class="rise" style="max-width:860px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        ${items.map((f, i) => `<div style="padding:22px 24px;${card(t)}">
          <h3 style="display:flex;gap:10px;margin:0;font-size:16px;font-weight:600"><span style="color:${t.accent};flex:none">Q.</span><span data-edit="faq.${i}.q">${esc(f.q)}</span></h3>
          <p data-edit="faq.${i}.a" style="margin:10px 0 0;padding-left:26px;color:${t.textMuted};font-size:14px;line-height:1.7">${esc(f.a)}</p>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* form:split — 좌 설명 / 우 폼 (lead면 호출부에서 기본형으로 폴백 — 좌측 표제가 pagehero와 중복되므로) */
  formSplit(d, t) {
    const f = d.form || {};
    const fields = (f.fields && f.fields.length ? f.fields : ['회사명', '담당자 이름', '이메일', '문의 내용']);
    return `
    <section class="dgv-form-split" style="position:relative;padding:64px 32px">
      <div class="rise" style="max-width:940px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:48px;align-items:start">
        <div>
          <h2 data-edit="form.title" style="margin:0;font-size:32px;font-weight:700;letter-spacing:-.02em">${esc(f.title || '도입 문의')}</h2>
          <p data-edit="form.sub" style="margin:14px 0 0;color:${t.textMuted};font-size:16px;line-height:1.7">${esc(f.sub || '남겨주시면 1영업일 안에 연락드립니다.')}</p>
          <div style="margin-top:28px;height:2px;width:64px;border-radius:999px;background:${t.ctaGradient}"></div>
        </div>
        <div style="position:relative;overflow:hidden;padding:32px;${card(t)}">
          <div style="position:absolute;top:-70px;right:-70px;width:220px;height:220px;border-radius:999px;filter:blur(70px);background:${t.glow};opacity:.35;pointer-events:none"></div>
          <form onsubmit="return false" style="position:relative;display:flex;flex-direction:column;gap:16px">
            ${fields.map((lb, i) => {
              const long = fields.length > 1 && i === fields.length - 1;
              return `<label style="display:flex;flex-direction:column;gap:6px;font-size:13px;color:${t.textMuted}"><span data-edit="form.fields.${i}">${esc(lb)}</span>${long ? `<textarea rows="4" style="${inputCss(t)};resize:vertical"></textarea>` : `<input type="text" style="${inputCss(t)}">`}</label>`;
            }).join('')}
            <button type="button" data-edit="form.submit" class="dg-arw" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;${btnCta(t)}">${esc(f.submit || '문의 보내기')}</button>
          </form>
        </div>
      </div>
    </section>`;
  },

  /* cta:simple — 제목+버튼 미니멀(카드 없음) */
  bannerSimple(d, t) {
    return `
    <section class="dgv-banner-simple" style="position:relative;padding:72px 32px;text-align:center">
      <div class="rise" style="max-width:640px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:22px">
        <h2 data-edit="bannerText" style="margin:0;font-size:32px;font-weight:700;letter-spacing:-.02em">${esc(d.bannerText || '워크플로우를 진화시킬 준비가 되셨나요?')}</h2>
        <button data-edit="bannerCta" class="dg-arw" style="display:inline-flex;align-items:center;gap:8px;padding:14px 28px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}">${esc(d.bannerCta || d.primaryCta || '무료로 시작하기')}</button>
      </div>
    </section>`;
  },

  /* cta:cards — 2단 카드 CTA(주 전환 / 보조 문의 분리, 보조 필드 bannerText2·bannerCta2) */
  bannerCards(d, t) {
    return `
    <section class="dgv-banner-cards" style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        <div class="rise" style="position:relative;overflow:hidden;display:flex;flex-direction:column;gap:16px;padding:36px 32px;${card(t)};border-color:${t.accent}">
          <div style="position:absolute;inset:0;background:${t.heroGradient};pointer-events:none"></div>
          <div style="position:absolute;bottom:-60px;right:-40px;width:220px;height:160px;border-radius:999px;filter:blur(70px);background:${t.glow};opacity:.5;pointer-events:none"></div>
          <h3 data-edit="bannerText" style="position:relative;margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em">${esc(d.bannerText || '워크플로우를 진화시킬 준비가 되셨나요?')}</h3>
          <button data-edit="bannerCta" class="dg-arw" style="position:relative;align-self:flex-start;display:inline-flex;align-items:center;gap:8px;padding:12px 22px;${btnCta(t)};box-shadow:0 8px 40px ${t.glow}">${esc(d.bannerCta || d.primaryCta || '무료로 시작하기')}</button>
        </div>
        <div class="rise" style="display:flex;flex-direction:column;gap:16px;padding:36px 32px;${card(t)}">
          <h3 data-edit="bannerText2" style="margin:0;font-size:24px;font-weight:700;letter-spacing:-.02em">${esc(d.bannerText2 || '궁금한 점이 있나요?')}</h3>
          <button data-edit="bannerCta2" style="align-self:flex-start;padding:12px 22px;border-radius:12px;background:${t.surface};border:1px solid ${t.surfaceBorder};color:${t.text};font-weight:600;cursor:pointer">${esc(d.bannerCta2 || '도입 문의하기')}</button>
        </div>
      </div>
    </section>`;
  },

  /* bloglist:list — 썸네일 리스트 행 */
  bloglistList(d, t) {
    const items = (d.posts && d.posts.length ? d.posts : [
      { title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' },
      { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' },
      { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' },
    ]);
    return `
    <section class="dgv-bloglist-list" style="position:relative;padding:64px 32px">
      <div style="max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px">
        ${items.map((p, i) => {
          const img = d.images && d.images['post' + i];
          return `<div class="rise" style="display:flex;flex-wrap:wrap;gap:18px;overflow:hidden;padding:16px;${card(t)}">
            ${img
              ? `<img data-img="post${i}" src="${esc(img)}" alt="" style="width:168px;aspect-ratio:16/10;object-fit:cover;flex:none;border-radius:10px;border:1px solid ${t.surfaceBorder}">`
              : `<div data-img="post${i}" style="width:168px;aspect-ratio:16/10;flex:none;display:grid;place-items:center;border-radius:10px;background:${t.accentSoft}">${spark(t.accent)}</div>`}
            <div style="flex:1;min-width:220px;display:flex;flex-direction:column;gap:6px">
              <div style="display:flex;align-items:center;gap:10px;font-size:12px"><span data-edit="posts.${i}.tag" style="padding:3px 10px;border-radius:999px;background:${t.accentSoft};color:${t.accent};letter-spacing:.04em">${esc(p.tag)}</span><span data-edit="posts.${i}.date" style="color:${t.textMuted}">${esc(p.date)}</span></div>
              <h3 style="margin:0;font-size:17px;font-weight:600;line-height:1.4"><a data-edit="posts.${i}.title" style="color:inherit;text-decoration:none;cursor:pointer">${esc(p.title)}</a></h3>
              <p data-edit="posts.${i}.desc" style="margin:0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(p.desc)}</p>
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  },

  /* bloglist:featured — 대표 1(가로 카드) + 일반 2단 */
  bloglistFeatured(d, t) {
    const items = (d.posts && d.posts.length ? d.posts : [
      { title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' },
      { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' },
      { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' },
    ]);
    const f0 = items[0];
    const img0 = d.images && d.images.post0;
    const rest = items.slice(1);
    return `
    <section class="dgv-bloglist-featured" style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto">
        <div class="rise" style="display:grid;grid-template-columns:repeat(2,1fr);overflow:hidden;${card(t)}">
          ${img0
            ? `<img data-img="post0" src="${esc(img0)}" alt="" style="width:100%;height:100%;min-height:240px;object-fit:cover">`
            : `<div data-img="post0" style="min-height:240px;display:grid;place-items:center;background:${t.accentSoft}">${spark(t.accent)}</div>`}
          <div style="display:flex;flex-direction:column;justify-content:center;gap:10px;padding:32px">
            <div style="display:flex;align-items:center;gap:10px;font-size:12px"><span data-edit="posts.0.tag" style="padding:3px 10px;border-radius:999px;background:${t.accentSoft};color:${t.accent};letter-spacing:.04em">${esc(f0.tag)}</span><span data-edit="posts.0.date" style="color:${t.textMuted}">${esc(f0.date)}</span></div>
            <h3 style="margin:0;font-size:24px;font-weight:700;line-height:1.35;letter-spacing:-.01em"><a data-edit="posts.0.title" style="color:inherit;text-decoration:none;cursor:pointer">${esc(f0.title)}</a></h3>
            <p data-edit="posts.0.desc" style="margin:0;color:${t.textMuted};font-size:15px;line-height:1.65">${esc(f0.desc)}</p>
          </div>
        </div>
        ${rest.length ? `<div style="margin-top:16px;display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
          ${rest.map((p, ri) => {
            const i = ri + 1;
            const img = d.images && d.images['post' + i];
            return `<div class="rise" style="display:flex;flex-direction:column;overflow:hidden;${card(t)}">
              ${img
                ? `<img data-img="post${i}" src="${esc(img)}" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-bottom:1px solid ${t.surfaceBorder}">`
                : `<div data-img="post${i}" style="aspect-ratio:16/9;display:grid;place-items:center;background:${t.accentSoft};border-bottom:1px solid ${t.surfaceBorder}">${spark(t.accent)}</div>`}
              <div style="display:flex;flex-direction:column;gap:8px;padding:20px">
                <div style="display:flex;align-items:center;gap:10px;font-size:12px"><span data-edit="posts.${i}.tag" style="padding:3px 10px;border-radius:999px;background:${t.accentSoft};color:${t.accent};letter-spacing:.04em">${esc(p.tag)}</span><span data-edit="posts.${i}.date" style="color:${t.textMuted}">${esc(p.date)}</span></div>
                <h3 style="margin:0;font-size:17px;font-weight:600;line-height:1.4"><a data-edit="posts.${i}.title" style="color:inherit;text-decoration:none;cursor:pointer">${esc(p.title)}</a></h3>
                <p data-edit="posts.${i}.desc" style="margin:0;color:${t.textMuted};font-size:14px;line-height:1.6">${esc(p.desc)}</p>
              </div>
            </div>`;
          }).join('')}
        </div>` : ''}
      </div>
    </section>`;
  },

  /* gallery:mosaic — 대표 1장 크게 + 보조 스택 */
  galleryMosaic(d, t, lead) {
    const items = (d.gallery && d.gallery.length ? d.gallery : [{ label: 'SCREEN 1' }, { label: 'SCREEN 2' }, { label: 'SCREEN 3' }]);
    return `
    <section class="dgv-gallery-mosaic" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('galleryTitle', esc(d.galleryTitle || '화면 미리보기'))}
      <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        ${items.map((g, i) => {
          const img = d.images && d.images['gallery' + i];
          const big = i === 0 && items.length > 2;
          const media = img
            ? `<img data-img="gallery${i}" src="${esc(img)}" alt="" style="width:100%;${big ? 'flex:1;min-height:280px;' : 'aspect-ratio:16/10;'}object-fit:cover;border-radius:${t.radius};border:1px solid ${t.surfaceBorder}">`
            : `<div data-img="gallery${i}" style="${big ? 'flex:1;min-height:280px;' : 'aspect-ratio:16/10;'}display:grid;place-items:center;${card(t)}">${spark(t.accent)}</div>`;
          return `<figure class="rise" style="margin:0;display:flex;flex-direction:column;gap:10px${big ? `;grid-row:span ${Math.min(items.length - 1, 3)}` : ''}">
            ${media}
            <figcaption data-edit="gallery.${i}.label" style="text-align:center;color:${t.textMuted};font-size:13px;letter-spacing:.04em">${esc(g.label)}</figcaption>
          </figure>`;
        }).join('')}
      </div>
    </section>`;
  },

  /* featurerows:numbered — 그라디언트 대형 번호 + 제목 교차 */
  featurerowsNumbered(d, t) {
    const rows = (d.featureRows && d.featureRows.length ? d.featureRows : [
      { title: '대표 기능 하나', desc: '이 기능이 사용자의 어떤 문제를 어떻게 푸는지 설명하세요.', points: ['포인트 1', '포인트 2'] },
      { title: '대표 기능 둘', desc: '두 번째 상세 기능 설명.', points: ['포인트 1', '포인트 2'] },
    ]);
    return `
    <section class="dgv-featurerows-numbered" style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:48px">
        ${rows.map((r, i) => {
          const pts = (r.points || []).map((p, pi) => `<li data-edit="featureRows.${i}.points.${pi}" style="margin:6px 0;color:${t.textMuted};font-size:14px">${esc(p)}</li>`).join('');
          return `<div class="rise" style="display:grid;grid-template-columns:repeat(2,1fr);gap:40px;align-items:center">
            <div style="order:${i % 2 ? 2 : 1};text-align:center">
              <div style="font-size:96px;font-weight:700;letter-spacing:-.05em;line-height:1;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${String(i + 1).padStart(2, '0')}</div>
            </div>
            <div style="order:${i % 2 ? 1 : 2}">
              <h3 data-edit="featureRows.${i}.title" style="margin:0;font-size:26px;font-weight:700;letter-spacing:-.02em">${esc(r.title)}</h3>
              <p data-edit="featureRows.${i}.desc" style="margin:12px 0 0;color:${t.textMuted};font-size:15px;line-height:1.7">${esc(r.desc)}</p>
              ${pts ? `<ul style="margin:16px 0 0;padding-left:18px">${pts}</ul>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  },

  /* featurerows:checks — 텍스트 + 체크리스트 카드 교차 */
  featurerowsChecks(d, t) {
    const rows = (d.featureRows && d.featureRows.length ? d.featureRows : [
      { title: '대표 기능 하나', desc: '이 기능이 사용자의 어떤 문제를 어떻게 푸는지 설명하세요.', points: ['포인트 1', '포인트 2'] },
      { title: '대표 기능 둘', desc: '두 번째 상세 기능 설명.', points: ['포인트 1', '포인트 2'] },
    ]);
    return `
    <section class="dgv-featurerows-checks" style="position:relative;padding:64px 32px">
      <div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:56px">
        ${rows.map((r, i) => {
          const points = (r.points && r.points.length ? r.points : ['포인트 1', '포인트 2']);
          return `<div class="rise" style="display:grid;grid-template-columns:repeat(2,1fr);gap:40px;align-items:center">
            <div style="order:${i % 2 ? 2 : 1}">
              <h3 data-edit="featureRows.${i}.title" style="margin:0;font-size:26px;font-weight:700;letter-spacing:-.02em">${esc(r.title)}</h3>
              <p data-edit="featureRows.${i}.desc" style="margin:12px 0 0;color:${t.textMuted};font-size:15px;line-height:1.7">${esc(r.desc)}</p>
            </div>
            <div style="order:${i % 2 ? 1 : 2};padding:24px 28px;${card(t)}">
              ${points.map((p, pi) => `<div style="display:flex;align-items:center;gap:10px;padding:11px 0${pi ? `;border-top:1px solid ${t.surfaceBorder}` : ''}">
                <span style="display:grid;place-items:center;width:22px;height:22px;flex:none;border-radius:999px;background:${t.accentSoft};color:${t.accent};font-size:12px">✓</span>
                <span data-edit="featureRows.${i}.points.${pi}" style="font-size:15px">${esc(p)}</span></div>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>`;
  },

  /* agenda:table — 시간표 행 테이블 */
  agendaTable(d, t, lead) {
    const items = (d.agenda && d.agenda.length ? d.agenda : [
      { time: '14:00', title: '오프닝', desc: '환영 인사' },
      { time: '14:30', title: '세션 1', desc: '주제 발표' },
      { time: '15:30', title: '세션 2', desc: '사례 공유' },
    ]);
    const th = `padding:14px 20px;text-align:left;color:${t.textMuted};font-size:12px;letter-spacing:.06em;font-weight:600;text-transform:uppercase`;
    return `
    <section class="dgv-agenda-table" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('agendaTitle', esc(d.agendaTitle || '프로그램'))}
      <div class="rise" style="max-width:760px;margin:0 auto;overflow-x:auto;border-radius:${t.radius};border:1px solid ${t.surfaceBorder}">
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          <thead><tr style="background:${t.surface}">
            <th style="${th}">시간</th><th style="${th}">프로그램</th><th style="${th}">내용</th>
          </tr></thead>
          <tbody>
            ${items.map((a, i) => `<tr style="border-top:1px solid ${t.surfaceBorder}">
              <td data-edit="agenda.${i}.time" style="padding:14px 20px;color:${t.accent};font-weight:700;white-space:nowrap">${esc(a.time)}</td>
              <td data-edit="agenda.${i}.title" style="padding:14px 20px;font-weight:600">${esc(a.title)}</td>
              <td data-edit="agenda.${i}.desc" style="padding:14px 20px;color:${t.textMuted};font-size:14px">${esc(a.desc)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
  },

  /* doclist:list — 컴팩트 단일 컬럼 리스트 */
  doclistList(d, t, lead) {
    const items = (d.docs && d.docs.length ? d.docs : [
      { title: '시작하기', desc: '설치와 첫 설정' },
      { title: '핵심 기능', desc: '주요 기능 사용법' },
      { title: '관리자 가이드', desc: '권한·설정 관리' },
      { title: '자주 묻는 질문', desc: '문제 해결 모음' },
    ]);
    return `
    <section class="dgv-doclist-list" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('docsTitle', esc(d.docsTitle || '가이드 문서'))}
      <div class="rise" style="max-width:680px;margin:0 auto;overflow:hidden;${card(t)}">
        ${items.map((dc, i) => `<div style="display:flex;align-items:center;gap:14px;padding:16px 22px${i ? `;border-top:1px solid ${t.surfaceBorder}` : ''}">
          <span style="color:${t.accent};flex:none">${svg(ICONS[i % ICONS.length])}</span>
          <a data-edit="docs.${i}.title" style="font-weight:600;font-size:15px;color:inherit;text-decoration:none;cursor:pointer;white-space:nowrap">${esc(dc.title)}</a>
          <span data-edit="docs.${i}.desc" style="flex:1;min-width:0;color:${t.textMuted};font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(dc.desc)}</span>
          <span class="dg-arw" style="color:${t.accent};flex:none"></span>
        </div>`).join('')}
      </div>
    </section>`;
  },

  /* pricing:table — 요금 비교표(플랜=행) */
  pricingTable(d, t, lead) {
    const plans = (d.plans && d.plans.length ? d.plans : [
      { name: '스타터', price: '무료', desc: '개인·소규모 팀', points: ['페이지 1개', '기본 스타일 팩'], cta: '무료로 시작' },
      { name: '프로', price: '월 29,000원', desc: '성장하는 팀', points: ['페이지 무제한', '전체 스타일 팩', 'AI 문구 생성'], cta: '프로 시작하기', hot: true },
      { name: '엔터프라이즈', price: '문의', desc: '맞춤 도입', points: ['전담 지원', '보안·SSO'], cta: '도입 문의' },
    ]).slice(0, 3);
    const th = `padding:14px 20px;text-align:left;color:${t.textMuted};font-size:12px;letter-spacing:.06em;font-weight:600;text-transform:uppercase`;
    return `
    <section class="dgv-pricing-table" style="position:relative;padding:64px 32px">
      ${lead ? '' : secHead('pricingTitle', esc(d.pricingTitle || '팀에 맞는 플랜을 고르세요'))}
      <div class="rise" style="max-width:860px;margin:0 auto;overflow-x:auto;border-radius:${t.radius};border:1px solid ${t.surfaceBorder}">
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          <thead><tr style="background:${t.surface}">
            <th style="${th}">플랜</th><th style="${th}">가격</th><th style="${th}">구성</th><th style="${th}"></th>
          </tr></thead>
          <tbody>
            ${plans.map((p, i) => `<tr style="border-top:1px solid ${t.surfaceBorder}${p.hot ? `;background:${t.accentSoft}` : ''}">
              <td style="padding:16px 20px">
                <div style="display:flex;align-items:center;gap:8px"><span data-edit="plans.${i}.name" style="font-weight:600">${esc(p.name)}</span>${p.hot ? `<span data-edit="plans.${i}.badge" style="padding:2px 8px;border-radius:999px;background:${t.ctaGradient};color:${t.accentText};font-size:11px;font-weight:700">${esc(p.badge || '인기')}</span>` : ''}</div>
                <div data-edit="plans.${i}.desc" style="margin-top:4px;color:${t.textMuted};font-size:12px">${esc(p.desc)}</div>
              </td>
              <td data-edit="plans.${i}.price" style="padding:16px 20px;font-weight:700;white-space:nowrap">${esc(p.price)}</td>
              <td style="padding:16px 20px;color:${t.textMuted};font-size:13px">${(p.points || []).map((pt2, pi) => `<span data-edit="plans.${i}.points.${pi}">${esc(pt2)}</span>`).join(' · ')}</td>
              <td style="padding:16px 20px;text-align:right"><button data-edit="plans.${i}.cta" style="padding:9px 16px;font-size:13px;white-space:nowrap;${p.hot ? btnCta(t) : `background:${t.surface};color:${t.text};font-weight:600;border:1px solid ${t.surfaceBorder};border-radius:10px;cursor:pointer`}">${esc(p.cta || d.primaryCta || '시작하기')}</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>`;
  },
};
