// 볼륨 = 페이지가 보여줄 깊이. 섹션 tier가 볼륨 임계값 이하면 포함.
export const VOLUMES = ['compact', 'mid', 'heavy'];
export const TIERS = ['core', 'mid', 'rich'];

const VOLUME_LEVEL = { compact: 0, mid: 1, heavy: 2 };
const TIER_LEVEL = { core: 0, mid: 1, rich: 2 };

export function includesTier(volume, tier) {
  const v = VOLUME_LEVEL[volume];
  const t = TIER_LEVEL[tier];
  if (v === undefined || t === undefined) return false;
  return t <= v;
}
