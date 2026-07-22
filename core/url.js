// 허용 스킴만 통과. javascript:/data:/vbscript: 등 차단.
// 상대경로·앵커·쿼리·프로토콜상대·스킴없음 = 통과. http/https/mailto/tel 통과. 그 외 스킴 = '' 반환.
const ALLOWED = new Set(['http', 'https', 'mailto', 'tel']);
export function safeUrl(v) {
  if (v === null || v === undefined) return '';
  const s = String(v).trim();
  if (s === '') return '';
  if (/^(\/|\.|#|\?)/.test(s)) return s;      // relative / anchor / query / //protocol-relative
  const m = s.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (!m) return s;                            // no scheme → relative
  return ALLOWED.has(m[1].toLowerCase()) ? s : '';
}
