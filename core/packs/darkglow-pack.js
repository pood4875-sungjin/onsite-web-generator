/* ============================================================
   core/packs/darkglow-pack.js — 기존 darkglow를 계약으로 리프트한 어댑터
   darkglow는 이미 "팩이 자기 섹션 렌더+토큰+모션 소유" 형태 → 계약 검증용 레퍼런스 2.
   의미 섹션 타입(nav/feature/stat/cta) → darkglow 명칭(gnb/features/metrics/banner) 매핑.
   ============================================================ */
import { SECTIONS as DG } from '../darkglow/sections.js';
import { DARK_PACK_BY_ID } from './darkglow/packs.js';

const T = DARK_PACK_BY_ID.aether.tokens;
const TYPE_MAP = { nav: 'gnb', hero: 'hero', feature: 'features', stat: 'metrics', cta: 'banner', footer: 'footer' };

const sections = Object.fromEntries(
  Object.entries(TYPE_MAP).map(([semantic, dgName]) => [
    semantic,
    (content, ctx) => (DG[dgName] ? DG[dgName]({ ...ctx.data, ...content }, ctx.f, ctx.motion) : ''),
  ]),
);

export const darkglowPack = {
  meta: {
    id: 'darkglow',
    name: 'Dark Glow (에테르)',
    desc: '다크 · 시안 글로우 · 라운드 16 · rise 모션 · Inter/Pretendard',
    source: '사용자 Figma Make "Chat-based Web Generator" 포팅',
  },
  foundation: T,
  layout: { container: '1000px', breakpoints: { sm: 600, md: 768, lg: 1024 } },
  motion(level = 'subtle') {
    if (level === 'static') return { css: '', js: '' };
    const d = level === 'rich' ? 30 : 16;
    return {
      css: `.rise{opacity:0;transform:translateY(${d}px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
      .rise.in{opacity:1;transform:none}@media (prefers-reduced-motion:reduce){.rise{opacity:1;transform:none}}`,
      js: `<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-40px'});document.querySelectorAll('.rise').forEach(function(el){io.observe(el)});})();<\/script>`,
    };
  },
  components: {},
  sections,
  globalCss() {
    return `*{box-sizing:border-box}body{margin:0;background:${T.bg};color:${T.text};font-family:${T.font};-webkit-font-smoothing:antialiased}`;
  },
  docs: {
    swatchGroups: [{ label: 'Tokens', keys: ['bg', 'surface', 'text', 'textMuted', 'accent'] }],
    _flat: T,   // 인스펙터: darkglow는 CSS 변수 아닌 JS 토큰 → 별도 표기
  },
};

export default darkglowPack;
