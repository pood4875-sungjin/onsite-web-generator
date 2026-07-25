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
};

export const PAGE_TYPE_LABEL = { main: '메인홈', features: '제품 기능소개', pricing: '요금 비교', landing: '랜딩' };
