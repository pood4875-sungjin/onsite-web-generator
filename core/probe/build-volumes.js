import { writeFileSync } from 'node:fs';
import { buildPageDoc } from '../template.js';
import { mainTemplate } from '../templates/main.js';
import { renderDocument } from '../renderer.js';
import { samplePack } from '../packs/sample/pack.js';

const sharedFacts = { productName: 'ONSITE' };
const content = {
  meta: { title: '온사이트 — 볼륨 데모' },
  nav: { links: [{ label: '제품', href: '#' }, { label: '요금', href: '#' }],
         cta: { label: '무료로 시작', href: '/start' } },
  hero: { eyebrow: '현장 업무 플랫폼', title: '현장의 모든 일, 하나로 연결됩니다',
          lead: '메시지·일정·문서를 한 곳에서.',
          ctas: [{ label: '무료로 시작하기', href: '/start' }] },
  feature: { eyebrow: 'Features', heading: '현장에 필요한 모든 것',
    items: [
      { title: '실시간 메시지', desc: '읽음 확인까지.' },
      { title: '일정 관리', desc: '팀 일정 공유.' },
      { title: '문서 보관', desc: '안전하게.' },
    ] },
  cta: { heading: '지금 바로 시작하세요', sub: '설치 없이 웹에서.',
         button: { label: '도입 문의하기', href: '/contact' } },
  footer: { columns: [
    { title: '제품', links: [{ label: '기능', href: '#' }] },
    { title: '회사', links: [{ label: '소개', href: '#' }] },
  ] },
};

for (const volume of ['compact', 'heavy']) {
  const doc = buildPageDoc({ template: mainTemplate, volume, content, sharedFacts });
  const html = renderDocument(doc, samplePack);
  writeFileSync(new URL(`./out-${volume}.html`, import.meta.url), html);
  console.log(`wrote core/probe/out-${volume}.html — ${doc.sections.length} sections`);
}
