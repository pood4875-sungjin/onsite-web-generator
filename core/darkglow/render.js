/* ============================================================
   darkglow/render.js — 조립 렌더러 (다크글로우)
   renderComposed(data, pack, motion, pageType, volume) -> 자가포함 HTML 1파일
   pageType → 템플릿(섹션 순서), volume → 티어 필터. 선택이 출력에 반영됨.
   ============================================================ */
import { esc } from '../esc.js';
import { includesTier } from '../volume.js';
import { SECTIONS } from './sections.js';
import { DG_TEMPLATES } from './templates.js';

export function renderComposed(data = {}, pack, motion = 'subtle', pageType = 'main', volume = 'heavy') {
  const t = pack.tokens;
  const template = DG_TEMPLATES[pageType] || DG_TEMPLATES.main;
  let types = template.filter((s) => includesTier(volume, s.tier)).map((s) => s.type);

  // 커스텀 섹션 순서 (편집모드) — gnb 최상단·footer 최하단 고정, body 섹션만 재정렬
  if (data.sectionOrder && data.sectionOrder.length) {
    const head = types.includes('gnb') ? ['gnb'] : [];
    const foot = types.includes('footer') ? ['footer'] : [];
    const movable = types.filter((x) => x !== 'gnb' && x !== 'footer');
    const ordered = data.sectionOrder.filter((x) => movable.includes(x));
    const rest = movable.filter((x) => !ordered.includes(x));
    types = [...head, ...ordered, ...rest, ...foot];
  }

  const body = types
    .map((type) => (SECTIONS[type] ? `<div data-section="${type}">${SECTIONS[type](data, t, motion)}</div>` : ''))
    .join('\n');

  const gridBg = `<div style="position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(${t.grid} 1px,transparent 1px),linear-gradient(90deg,${t.grid} 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(120% 60% at 50% 0%,#000 30%,transparent 80%);mask-image:radial-gradient(120% 60% at 50% 0%,#000 30%,transparent 80%)"></div>`;

  const motionCss = motion === 'static' ? '' : `
    .rise{opacity:0;transform:translateY(${motion === 'rich' ? '30' : '16'}px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
    .rise.in{opacity:1;transform:none}
    @media (prefers-reduced-motion:reduce){.rise{opacity:1;transform:none}}`;
  const motionJs = motion === 'static' ? '' : `<script>
    const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-40px'});
    document.querySelectorAll('.rise').forEach((el,i)=>{${motion === 'rich' ? "el.style.transitionDelay=(i*0.06)+'s';" : ''}io.observe(el)});
    <\/script>`;

  return `<!doctype html>
<html lang="ko" data-motion="${esc(motion)}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(data.productName || '제품명')}</title>
<style>
  *{box-sizing:border-box} body{margin:0;background:${t.bg};color:${t.text};font-family:${t.font};-webkit-font-smoothing:antialiased}
  .nvi:hover{color:${t.text}} .nsub{display:none} .nvi:hover .nsub{display:block}
  ${motionCss}
</style>
</head>
<body>
<div style="position:relative;min-height:100vh;overflow-x:hidden">
${gridBg}
<div style="position:relative">${body}</div>
</div>
${motionJs}
</body>
</html>`;
}
