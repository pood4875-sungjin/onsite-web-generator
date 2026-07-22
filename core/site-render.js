/* ============================================================
   site-render.js — 다크글로우 랜딩 렌더러 (결정론, 순수)
   출처: 사용자 Figma Make PreviewPanel.tsx 포팅 (React → 바닐라 문자열)
   renderSite(data, pack, motion) -> 자가포함 HTML 1파일
   섹션: GNB → HERO(글로우+대시보드목업) → 지표 → 기능 → 배너CTA → 푸터
   ============================================================ */
import { esc } from './esc.js';
import { safeUrl } from './url.js';

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
  '<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>',                                 // zap
  '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>', // layers
  '<circle cx="12" cy="12" r="2"/><path d="M5 12a7 7 0 0 1 14 0M8.5 12a3.5 3.5 0 0 1 7 0"/>', // radio
];
const svg = (p) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const spark = (c) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="${c}"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z"/></svg>`;

export function renderSite(data = {}, pack, motion = 'subtle') {
  const t = pack.tokens;
  const name = esc(data.productName || '제품명');
  const tagline = esc(data.tagline || '대화만으로 완성되는 인터페이스');
  const subcopy = esc(data.subcopy || '기획을 대화로 입력하면, 선택한 스타일 팩으로 온브랜드 웹페이지를 아키텍처 수준의 정밀함으로 합성합니다.');
  const cta = esc(data.primaryCta || '무료로 시작하기');
  const features = (data.features && data.features.length ? data.features : PH_FEATURES);
  const stats = (data.stats && data.stats.length ? data.stats : PH_STATS);
  const bannerText = esc(data.bannerText || '워크플로우를 진화시킬 준비가 되셨나요?');
  const bannerCta = esc(data.bannerCta || data.primaryCta || '무료로 시작하기');

  const btnCta = `background:${t.ctaGradient};color:${t.accentText};font-weight:700;border:none;border-radius:12px;cursor:pointer`;
  const glowShadow = `0 8px 40px ${t.glow}`;

  const gnb = `
  <header style="position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;
    padding:16px 32px;backdrop-filter:blur(20px);background:${t.bg}cc;border-bottom:1px solid ${t.surfaceBorder}">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:${t.ctaGradient}">${spark(t.accentText)}</div>
      <span style="font-weight:600">${name}</span>
    </div>
    <nav style="display:flex;gap:28px;color:${t.textMuted};font-size:14px">
      <span>기능</span><span>가격</span><span>문서</span><span>고객사례</span>
    </nav>
    <button style="padding:8px 16px;${btnCta};border-radius:999px;font-size:14px">${cta}</button>
  </header>`;

  const dashCards = [0, 1, 2].map(() => `
    <div style="display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:10px;background:${t.accentSoft}">
      <div style="height:8px;width:66%;border-radius:999px;background:${t.accent};opacity:.7"></div>
      <div style="height:8px;width:100%;border-radius:999px;background:${t.surfaceBorder}"></div>
      <div style="height:8px;width:80%;border-radius:999px;background:${t.surfaceBorder}"></div>
      <div style="height:40px;border-radius:10px;background:${t.ctaGradient};opacity:.85;margin-top:8px"></div>
    </div>`).join('');

  const hero = `
  <section style="position:relative;overflow:hidden;padding:80px 32px 40px;text-align:center;background:${t.heroGradient}">
    <div style="position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:520px;height:320px;border-radius:999px;filter:blur(100px);background:${t.glow};pointer-events:none"></div>
    <div class="rise" style="position:relative;max-width:680px;margin:0 auto">
      <span style="display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;background:${t.accentSoft};border:1px solid ${t.surfaceBorder};color:${t.accent};font-size:12px;letter-spacing:.02em">
        <span style="width:6px;height:6px;border-radius:999px;background:${t.accent}"></span>Engine v2.0 · AX 웹 제너레이터</span>
      <h1 style="margin:24px 0 0;font-size:54px;font-weight:700;line-height:1.08;letter-spacing:-.03em">${tagline}</h1>
      <p style="max-width:520px;margin:20px auto 0;color:${t.textMuted};font-size:18px;line-height:1.6">${subcopy}</p>
      <div style="margin-top:32px;display:flex;align-items:center;justify-content:center;gap:12px">
        <button style="display:inline-flex;align-items:center;gap:8px;padding:13px 24px;${btnCta};box-shadow:${glowShadow}">${cta} →</button>
        <button style="padding:13px 24px;border-radius:12px;background:${t.surface};border:1px solid ${t.surfaceBorder};color:${t.text};font-weight:600;cursor:pointer">문서 보기</button>
      </div>
    </div>
    <div class="rise" style="position:relative;max-width:760px;margin:56px auto 0;overflow:hidden;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder};box-shadow:0 20px 80px ${t.glow}">
      <div style="display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid ${t.surfaceBorder}">
        <span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span>
        <span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span>
        <span style="width:10px;height:10px;border-radius:999px;background:${t.surfaceBorder}"></span>
        <span style="margin-left:12px;font-size:12px;color:${t.textMuted}">${name.toLowerCase()}.app / console</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:20px">${dashCards}</div>
    </div>
  </section>`;

  const metrics = `
  <section style="position:relative;padding:40px 32px">
    <div class="rise" style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;overflow:hidden;border-radius:${t.radius};background:${t.surfaceBorder};border:1px solid ${t.surfaceBorder}">
      ${stats.slice(0, 3).map((s) => `
      <div style="padding:28px 24px;text-align:center;background:${t.bg}">
        <div style="font-size:36px;font-weight:700;letter-spacing:-.02em;background-image:${t.ctaGradient};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(s.value)}</div>
        <div style="margin-top:6px;color:${t.textMuted};font-size:13px">${esc(s.label)}</div>
      </div>`).join('')}
    </div>
  </section>`;

  const feats = `
  <section style="position:relative;padding:64px 32px">
    <div class="rise" style="max-width:680px;margin:0 auto;text-align:center">
      <div style="color:${t.accent};font-size:13px;letter-spacing:.08em;text-transform:uppercase">Features</div>
      <h2 style="margin:12px 0 0;font-size:34px;font-weight:700;letter-spacing:-.02em">명료함과 성능을 위해 설계됨</h2>
    </div>
    <div style="max-width:900px;margin:48px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      ${features.slice(0, 6).map((f, i) => `
      <div class="rise" style="position:relative;overflow:hidden;padding:24px;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder}">
        <div style="position:absolute;right:-32px;top:-32px;width:96px;height:96px;border-radius:999px;filter:blur(32px);background:${t.glow};opacity:.35;pointer-events:none"></div>
        <div style="position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:${t.accentSoft};color:${t.accent}">${svg(ICONS[i % ICONS.length])}</div>
        <h3 style="position:relative;margin:16px 0 0;font-size:18px;font-weight:600">${esc(f.title)}</h3>
        <p style="position:relative;margin:8px 0 0;color:${t.textMuted};font-size:15px;line-height:1.6">${esc(f.desc)}</p>
      </div>`).join('')}
    </div>
  </section>`;

  const banner = `
  <section style="position:relative;padding:64px 32px">
    <div class="rise" style="position:relative;max-width:900px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:20px;overflow:hidden;padding:64px 40px;text-align:center;border-radius:${t.radius};background:${t.surface};border:1px solid ${t.surfaceBorder}">
      <div style="position:absolute;inset:0;background:${t.heroGradient};pointer-events:none"></div>
      <div style="position:absolute;bottom:-80px;left:50%;transform:translateX(-50%);width:384px;height:256px;border-radius:999px;filter:blur(90px);background:${t.glow};pointer-events:none"></div>
      <h2 style="position:relative;font-size:36px;font-weight:700;letter-spacing:-.02em">${bannerText}</h2>
      <button style="position:relative;display:inline-flex;align-items:center;gap:8px;padding:14px 28px;${btnCta};box-shadow:${glowShadow}">${bannerCta} →</button>
    </div>
  </section>`;

  const footer = `
  <footer style="position:relative;padding:40px 32px;border-top:1px solid ${t.surfaceBorder};color:${t.textMuted};font-size:14px">
    <div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:8px;color:${t.text}">
        <div style="display:grid;place-items:center;width:24px;height:24px;border-radius:6px;background:${t.ctaGradient}">${spark(t.accentText)}</div>
        <span style="font-weight:600">${name}</span>
      </div>
      <div style="display:flex;gap:24px"><span>이용약관</span><span>개인정보처리방침</span><span>문의</span></div>
      <span>© 2026 ${name} Labs</span>
    </div>
  </footer>`;

  const gridBg = `
  <div style="position:absolute;inset:0;pointer-events:none;
    background-image:linear-gradient(${t.grid} 1px,transparent 1px),linear-gradient(90deg,${t.grid} 1px,transparent 1px);
    background-size:56px 56px;
    -webkit-mask-image:radial-gradient(120% 60% at 50% 0%,#000 30%,transparent 80%);
    mask-image:radial-gradient(120% 60% at 50% 0%,#000 30%,transparent 80%)"></div>`;

  const motionCss = motion === 'static' ? '' : `
    .rise{opacity:0;transform:translateY(${motion === 'rich' ? '30' : '16'}px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
    .rise.in{opacity:1;transform:none}
    @media (prefers-reduced-motion:reduce){.rise{opacity:1;transform:none}}`;
  const motionJs = motion === 'static' ? '' : `
    <script>
    const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-40px'});
    document.querySelectorAll('.rise').forEach((el,i)=>{${motion === 'rich' ? "el.style.transitionDelay=(i*0.06)+'s';" : ''}io.observe(el)});
    <\/script>`;

  return `<!doctype html>
<html lang="ko" data-motion="${esc(motion)}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>
<style>
  *{box-sizing:border-box} body{margin:0;background:${t.bg};color:${t.text};font-family:${t.font};-webkit-font-smoothing:antialiased}
  ${motionCss}
</style>
</head>
<body>
<div style="position:relative;min-height:100vh;overflow-x:hidden">
${gridBg}
<div style="position:relative">
${gnb}${hero}${metrics}${feats}${banner}${footer}
</div>
</div>
${motionJs}
</body>
</html>`;
}
