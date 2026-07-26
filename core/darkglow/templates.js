/* 다크글로우 페이지 템플릿 — pageType → 섹션 순서 + 볼륨 티어.
   티어: core(항상) · mid(중간+) · rich(헤비만). gnb/footer는 항상 core. */
export const DG_TEMPLATES = {
  main: [ // 메인홈
    { type: 'gnb', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'features', tier: 'core' },
    { type: 'metrics', tier: 'mid' },
    { type: 'banner', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
  features: [ // 제품 기능소개
    { type: 'gnb', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'features', tier: 'core' },
    { type: 'metrics', tier: 'mid' },
    { type: 'banner', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
  pricing: [ // 요금 비교
    { type: 'gnb', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'metrics', tier: 'core' },
    { type: 'features', tier: 'mid' },
    { type: 'banner', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
  landing: [ // 랜딩 (짧음) — metrics는 mid+: 지표 입력을 받는 플로우와 일치시킴(사회적 증거 행)
    { type: 'gnb', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'features', tier: 'mid' },
    { type: 'metrics', tier: 'mid' },
    { type: 'banner', tier: 'core' },
    { type: 'footer', tier: 'core' },
  ],
  /* ---- 신규 6유형 — pagetypes.js PAGE_TYPES의 sections(정식 어휘)를 이 팩 내부 이름으로
     매핑(cta→banner · feature→features · stats→metrics)하고 gnb/footer core로 감쌈.
     기존 4유형(main/features/pricing/landing)은 하위호환을 위해 그대로 둔다.
     lead:1 = 페이지 대표 콘텐츠 섹션(pagetypes.js 계약) — pagehero가 표제를 대신하므로
     섹션 자체 표제(아이브로·헤딩·서브) 생략하고 바로 콘텐츠 렌더(중복 방지). ---- */
  product: [ // 제품소개 — 개요→상세 교차→화면→비교
    { type: 'gnb', tier: 'core' },
    { type: 'pagehero', tier: 'core' },
    { type: 'overview', tier: 'core' },
    { type: 'featurerows', tier: 'core' },
    { type: 'gallery', tier: 'mid' },
    { type: 'compare', tier: 'rich' },
    { type: 'banner', tier: 'core' },
    { type: 'footer', tier: 'core' },
  ],
  faq: [ // FAQ — 질문 + 추가 문의 유도
    { type: 'gnb', tier: 'core' },
    { type: 'pagehero', tier: 'core' },
    { type: 'faq', tier: 'core', lead: 1 },
    { type: 'infocards', tier: 'mid' },
    { type: 'banner', tier: 'core' },
    { type: 'footer', tier: 'core' },
  ],
  contact: [ // 도입문의 — 정적 폼 + 연락처/절차
    { type: 'gnb', tier: 'core' },
    { type: 'pagehero', tier: 'core' },
    { type: 'form', tier: 'core', lead: 1 },
    { type: 'infocards', tier: 'mid' },
    { type: 'footer', tier: 'core' },
  ],
  manual: [ // 메뉴얼 — 문서 카테고리 + 시작 절차
    { type: 'gnb', tier: 'core' },
    { type: 'pagehero', tier: 'core' },
    { type: 'doclist', tier: 'core', lead: 1 },
    { type: 'steps', tier: 'mid' },
    { type: 'banner', tier: 'core' },
    { type: 'footer', tier: 'core' },
  ],
  blog: [ // 블로그 — 소식 카드 목록
    { type: 'gnb', tier: 'core' },
    { type: 'pagehero', tier: 'core' },
    { type: 'bloglist', tier: 'core', lead: 1 },
    { type: 'banner', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
  event: [ // 이벤트 — 개요→소개→아젠다→스피커→안내→신청
    { type: 'gnb', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'overview', tier: 'core' },
    { type: 'intro', tier: 'mid' },
    { type: 'agenda', tier: 'core' },
    { type: 'speakers', tier: 'core' },
    { type: 'notice', tier: 'mid' },
    { type: 'banner', tier: 'core' },
    { type: 'footer', tier: 'core' },
  ],
};

/* 페이지 유형 라벨 — pagetypes.js PAGE_TYPES의 label과 동일(10종) */
export const PAGE_TYPE_LABEL = {
  main: '메인홈', product: '제품소개', features: '기능소개', pricing: '요금', faq: 'FAQ',
  contact: '도입문의', manual: '메뉴얼', blog: '블로그', landing: '제품 랜딩', event: '이벤트',
};
