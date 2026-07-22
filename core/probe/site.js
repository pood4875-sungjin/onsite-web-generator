import { writeFileSync } from 'node:fs';
import { renderSite } from '../site-render.js';
import { DARK_PACKS } from '../packs/darkglow/packs.js';

const data = {
  productName: 'Onsite',
  tagline: '대화만으로 완성되는 웹페이지',
  subcopy: '기획을 대화로 입력하면, 선택한 스타일 팩으로 온브랜드 웹페이지를 즉시 합성합니다. 추론 없는 결정론적 조립.',
  primaryCta: '무료로 시작하기',
  features: [
    { title: '대화형 입력', desc: '스텝마다 질문에 답하면 슬롯이 채워집니다.' },
    { title: '스타일 팩', desc: '팩만 바꾸면 전체 사이트가 즉시 리스킨.' },
    { title: '즉시 다운로드', desc: '완성 즉시 자가포함 HTML로 내보냅니다.' },
  ],
  stats: [
    { value: '3분', label: '평균 생성 시간' },
    { value: '8종', label: '페이지 타입' },
    { value: '0원', label: 'MVP 운영비' },
  ],
  bannerText: '지금 바로 첫 페이지를 만들어보세요',
  bannerCta: '무료로 시작하기',
};

for (const pack of DARK_PACKS) {
  const html = renderSite(data, pack, 'subtle');
  writeFileSync(new URL(`./site-${pack.id}.html`, import.meta.url), html);
  console.log(`wrote core/probe/site-${pack.id}.html — ${pack.name}`);
}
