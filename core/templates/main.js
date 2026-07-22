// 메인홈 페이지 타입의 섹션 구성. 순서 = 렌더 순서. tier = 볼륨에 따라 포함 여부.
export const mainTemplate = {
  pageType: 'main',
  sections: [
    { type: 'nav', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'feature', tier: 'mid' },
    { type: 'cta', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
};
