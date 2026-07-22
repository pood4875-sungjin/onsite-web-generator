// 각 섹션 폼에 어떤 입력을 띄울지 정의. kind: 'text'=한 줄, 'lines'=여러 줄(줄당 항목, | 로 필드 구분).
export const SHARED_FIELDS = [
  { key: 'productName', label: '제품명', kind: 'text', placeholder: '예: ONSITE' },
];

export const FIELD_SPECS = {
  nav: [
    { key: 'links', label: '메뉴 (한 줄에 하나: 라벨|링크)', kind: 'lines', placeholder: '제품|#\n요금|#' },
    { key: 'ctaLabel', label: '버튼 텍스트', kind: 'text', placeholder: '무료로 시작' },
    { key: 'ctaHref', label: '버튼 링크', kind: 'text', placeholder: '/start' },
  ],
  hero: [
    { key: 'eyebrow', label: '작은 라벨', kind: 'text', placeholder: '현장 업무 플랫폼' },
    { key: 'title', label: '큰 제목', kind: 'text', placeholder: '현장의 모든 일, 하나로' },
    { key: 'lead', label: '설명', kind: 'text', placeholder: '한 줄 소개' },
    { key: 'ctaLabel', label: '주 버튼', kind: 'text', placeholder: '무료로 시작하기' },
    { key: 'ctaHref', label: '주 버튼 링크', kind: 'text', placeholder: '/start' },
  ],
  feature: [
    { key: 'heading', label: '섹션 제목', kind: 'text', placeholder: '현장에 필요한 모든 것' },
    { key: 'items', label: '기능들 (한 줄에 하나: 제목|설명)', kind: 'lines', placeholder: '실시간 메시지|읽음 확인까지\n일정 관리|팀 일정 공유' },
  ],
  cta: [
    { key: 'heading', label: '제목', kind: 'text', placeholder: '지금 시작하세요' },
    { key: 'sub', label: '보조 문구', kind: 'text', placeholder: '설치 없이 웹에서' },
    { key: 'buttonLabel', label: '버튼', kind: 'text', placeholder: '도입 문의하기' },
    { key: 'buttonHref', label: '버튼 링크', kind: 'text', placeholder: '/contact' },
  ],
  footer: [
    { key: 'columns', label: '컬럼 (한 줄에 하나: 컬럼제목|링크라벨|링크주소)', kind: 'lines', placeholder: '제품|기능|#\n회사|소개|#' },
  ],
};
