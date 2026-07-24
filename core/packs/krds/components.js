/* ============================================================
   core/packs/krds/components.js — KRDS 컴포넌트 킷 (③층)
   1px 헤어라인 · radius 8 · 정부블루 · Pretendard GOV. 순수 HTML 문자열 헬퍼.
   .krds 스코프에서 componentsCss와 함께 동작.
   ============================================================ */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const components = {
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

export const ICONS = {
  bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>',
  layers: '<path d="M3 7l9-4 9 4-9 4-9-4Z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/>',
  sync: '<path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
};

/** 컴포넌트 base CSS (.krds 스코프) */
export function componentsCss() {
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
export const gallery = [
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
