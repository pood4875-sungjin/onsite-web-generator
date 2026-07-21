// 토큰 = 단일 소스(객체). CSS 변수 문자열은 여기서 파생.
export const tokens = {
  '--accent': '#0066FF',
  '--ink': '#16181d',
  '--ink-2': '#5b6270',
  '--bg': '#ffffff',
  '--bg-2': '#f5f7fa',
  '--line': '#e6e9ef',
  '--radius': '12px',
  '--fs-h1': '44px',
  '--fs-h2': '30px',
  '--fs-body': '16px',
  '--sp-2': '8px',
  '--sp-4': '16px',
  '--sp-6': '24px',
  '--container': '1120px',
};

export function tokensCss() {
  const body = Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `:root{\n${body}\n}`;
}
