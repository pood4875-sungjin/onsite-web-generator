/* ============================================================
   core/packs/index.js — 출력 스타일 팩 레지스트리 (섹션 세계)
   styles/sections.css 변수 계약 + sections/registry.js 렌더러를 쓰는 팩 목록.
   팩 = :root 변수 오버라이드(vars) + variantMap. 팩을 하나하나 여기서 관리.
   (darkglow는 별도 인라인 렌더 세계 → 여기 대상 아님.)
   ============================================================ */
import { krdsPack } from './krds/pack.js';

// 하우스 기본 = styles/sections.css :root 그대로 (오버라이드 없음).
export const wantedHousePack = {
  meta: {
    id: 'wanted',
    name: 'Wanted House (기본)',
    desc: '기본 출력 DS — Wanted 비주얼 언어. sections.css :root 원본, 오버라이드 없음.',
    world: 'sections',
    motionDefault: 'subtle',
  },
  vars: null,                 // null = 오버라이드 안 함 → 렌더러 기본값
  tokensCss: () => '',
  variantMap: {},
};

export const SECTION_PACKS = [wantedHousePack, krdsPack];
export const PACK_BY_ID = Object.fromEntries(SECTION_PACKS.map((p) => [p.meta.id, p]));

export default SECTION_PACKS;
