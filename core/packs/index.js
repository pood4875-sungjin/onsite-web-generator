/* ============================================================
   core/packs/index.js — 스타일팩 레지스트리 (계약 기반)
   각 팩 = 완전한 자기완결 DS (contract.js 구현). 팩을 하나하나 여기서 관리.
   ============================================================ */
import { renderPage, renderSectionsOnly, SECTION_TYPES } from './contract.js';
import { buildPageDoc } from '../template.js';
import { krdsPack } from './krds/pack.js';
import { darkglowPack } from './darkglow-pack.js';

export { renderPage, renderSectionsOnly, SECTION_TYPES };

export const PACKS = [krdsPack, darkglowPack];
export const PACK_BY_ID = Object.fromEntries(PACKS.map((p) => [p.meta.id, p]));

/** 데모/인스펙터용 표준 페이지 템플릿 (의미 섹션 순서 + 볼륨 티어) */
export const DEMO_TEMPLATE = {
  sections: [
    { type: 'nav', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'feature', tier: 'core' },
    { type: 'stat', tier: 'mid' },
    { type: 'cta', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
};

/** 데모 페이지doc 생성 (content 미지정 시 섹션 플레이스홀더 사용) */
export function buildDemoPageDoc({ volume = 'heavy', content = {}, sharedFacts = {} } = {}) {
  return buildPageDoc({ template: DEMO_TEMPLATE, volume, content, sharedFacts });
}

export default PACKS;
