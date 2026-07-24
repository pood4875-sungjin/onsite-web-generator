/* ============================================================
   core/packs/spec.js — 팩 저작 표준 (기계가 검사 가능한 계약)
   모든 새 팩은 이 표준을 따른다. KRDS = 레퍼런스 구현.
   ① 표준 토큰 키셋  ② 섹션 콘텐츠 슬롯  ③ 필수 컴포넌트  + validatePack()
   근거 규칙: 소스 실측만, 추측값 금지(온사이트 충실도 규칙).
   ============================================================ */

/** ① 표준 토큰 키셋 — 모든 팩 foundation이 반드시 채우는 semantic CSS 변수. */
export const TOKEN_KEYS = {
  color: [
    '--brand', '--brand-hover', '--brand-weak', '--on-brand',
    '--ink', '--ink-2', '--muted', '--soft',
    '--bg', '--bg-2', '--line', '--line-2',
    '--info', '--info-bg', '--warn', '--warn-bg',
    '--danger', '--danger-bg', '--ok', '--ok-bg',
  ],
  radius: ['--radius-xs', '--radius-sm', '--radius', '--radius-lg'],
  border: ['--bw'],
  type: ['--fs-display', '--fs-h1', '--fs-h2', '--fs-h3', '--fs-body', '--fs-body-sm', '--fs-label', '--fs-cap', '--lh', '--lh-tight'],
  font: ['--font', '--font-mono'],
  shadow: ['--shadow-1', '--shadow-2'],
};
export const ALL_TOKEN_KEYS = Object.values(TOKEN_KEYS).flat();

/** ② 섹션 타입별 표준 콘텐츠 슬롯 — 생성기 ↔ 팩 계약. 팩은 이 슬롯을 읽어 렌더. */
export const SECTION_SLOTS = {
  nav:     { links: 'string[]', primaryCta: 'string', secondaryCta: 'string' },
  hero:    { eyebrow: 'string', title: 'string', subcopy: 'string', primaryCta: 'string', secondaryCta: 'string' },
  feature: { eyebrow: 'string', title: 'string', items: '{icon,title,desc}[]' },
  stat:    { items: '{value,label}[]' },
  cta:     { title: 'string', subcopy: 'string', primaryCta: 'string', secondaryCta: 'string' },
  footer:  { columns: '{h,items[]}[]' },
};
export const SECTION_TYPES = Object.keys(SECTION_SLOTS);

/** ③ 필수 컴포넌트 킷 — 섹션 조립에 쓰는 최소 단위. */
export const REQUIRED_COMPONENTS = ['button', 'link', 'badge', 'card'];

/** 팩이 표준을 지키는지 검사. { ok, errors[], warnings[] } 반환. */
export function validatePack(pack) {
  const errors = [];
  const warnings = [];
  const id = pack?.meta?.id || '(no id)';

  if (!pack?.meta?.id) errors.push('meta.id 없음');
  if (!pack?.rootClass) warnings.push('rootClass 없음(팩 CSS 격리 권장)');
  if (typeof pack?.globalCss !== 'function') errors.push('globalCss() 없음');
  if (typeof pack?.motion !== 'function') errors.push('motion(level) 없음');
  if (!pack?.layout?.breakpoints) errors.push('layout.breakpoints 없음');

  // ① 토큰 키셋
  const f = pack?.foundation || {};
  const missingTok = ALL_TOKEN_KEYS.filter((k) => !(k in f));
  if (missingTok.length) errors.push(`토큰 누락(${missingTok.length}): ${missingTok.join(', ')}`);

  // ② 섹션 타입 전부 구현
  const sec = pack?.sections || {};
  const missingSec = SECTION_TYPES.filter((t) => typeof sec[t] !== 'function');
  if (missingSec.length) errors.push(`섹션 렌더러 누락: ${missingSec.join(', ')}`);

  // ③ 필수 컴포넌트
  const comp = pack?.components || {};
  const missingComp = REQUIRED_COMPONENTS.filter((c) => typeof comp[c] !== 'function');
  if (missingComp.length) warnings.push(`컴포넌트 누락: ${missingComp.join(', ')}`);

  return { id, ok: errors.length === 0, errors, warnings };
}
