export const samplePage = {
  meta: { title: '온사이트 — 현장 업무 플랫폼' },
  sharedFacts: { productName: 'ONSITE' },
  sections: [
    { type: 'nav', slotValues: { links: [
      { label: '제품', href: '#' }, { label: '기능', href: '#' }, { label: '요금', href: '#' },
    ], cta: { label: '무료로 시작', href: '/start' } } },
    { type: 'hero', slotValues: {
      eyebrow: '현장 업무 플랫폼',
      title: '현장의 모든 일, 하나로 연결됩니다',
      lead: '메시지·일정·문서를 한 곳에서. 현장과 본사가 실시간으로 이어집니다.',
      ctas: [{ label: '무료로 시작하기', href: '/start' }, { label: '도입 문의', href: '/contact' }],
    } },
    { type: 'feature', slotValues: {
      eyebrow: 'Features', heading: '현장에 필요한 모든 것',
      items: [
        { title: '실시간 메시지', desc: '읽음 확인까지 한눈에.' },
        { title: '일정 관리', desc: '팀 일정을 공유하고 알림.' },
        { title: '문서 보관', desc: '현장 문서를 안전하게.' },
        { title: '권한 관리', desc: '역할별 접근 제어.' },
      ],
    } },
    { type: 'cta', slotValues: {
      heading: '지금 바로 시작하세요',
      sub: '설치 없이 웹에서 바로.',
      button: { label: '도입 문의하기', href: '/contact' },
    } },
    { type: 'footer', slotValues: { columns: [
      { title: '제품', links: [{ label: '기능', href: '#' }, { label: '요금', href: '#' }] },
      { title: '회사', links: [{ label: '소개', href: '#' }, { label: '채용', href: '#' }] },
    ] } },
  ],
};
