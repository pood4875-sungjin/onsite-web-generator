/* proxy/worker.js — PPT AI 생성 프록시 (Cloudflare Workers)
   목적: 관리자 API 키 1개를 서버에 숨기고 팀 전체가 사용. 클라이언트엔 키 없음.
   남용 방지:
   - PPT 브리프 전용(프롬프트 서버 조립) — 범용 LLM 중계로 못 씀
   - 모델 서버 고정(Sonnet 5), max_tokens 상한
   - IP당 일일 호출 제한(KV) — DAILY_LIMIT
   - 최후 안전망: Anthropic 콘솔의 월 지출 한도(Spend Limit) ← 콘솔에서 별도 설정 필수
   배포: proxy/README.md 참조. 시크릿: wrangler secret put ANTHROPIC_API_KEY */

const MODEL = 'claude-sonnet-5';   // 서버 고정 — 클라이언트가 못 바꿈
const MAX_TOKENS = 4000;
const DAILY_LIMIT = 999;           // 임시 해제(혼자 사용 중). 팀 배포 시 9로 복원할 것

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};
const json = (obj, status) => new Response(JSON.stringify(obj), {
  status: status || 200, headers: { 'content-type': 'application/json', ...CORS },
});

const SCHEMA_DOC =
  'cover:{title,subtitle,eyebrow?,meta?:[{k,v}]} | ' +
  'agenda:{title,items:[문자열]} | ' +
  'rows:{title,index?,rows:[{num,label,desc}]} | ' +
  'cols:{title,index?,cols:[{sub,items?:[문자열],text?}]} | ' +
  'bigstat:{title,index?,big,sides:[{sub,text}]} | ' +
  'statement:{title,index?,text,cols?} | ' +
  'closing:{title,sub?,contacts?:[{k,v}]}';

const SYSTEM =
  '너는 시니어 발표 장표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"slides":[ ... ]}\n' +
  '슬라이드 타입과 필드: ' + SCHEMA_DOC + '\n' +
  '규칙: 첫 장은 cover, 항목 2개 이상이면 두번째는 agenda, 마지막은 closing. ' +
  '목차 항목마다 본문 슬라이드(rows/cols/bigstat/statement) 1장 이상을 실제 내용으로 채운다(플레이스홀더 금지). ' +
  '레이아웃은 내용 성격에 맞게 다양하게. 수치는 맥락상 그럴듯하게. 총 6~12장.';

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const url = new URL(req.url);
    if (req.method !== 'POST' || url.pathname !== '/compose') return json({ error: 'NOT_FOUND' }, 404);

    // ---- IP당 일일 제한 (KV) ----
    const ip = req.headers.get('cf-connecting-ip') || 'unknown';
    const day = new Date().toISOString().slice(0, 10);
    const rlKey = `rl:${ip}:${day}`;
    let used = 0;
    try { used = parseInt(await env.RATE_KV.get(rlKey), 10) || 0; } catch (e) {}
    if (used >= DAILY_LIMIT) return json({ error: 'LIMIT', message: `오늘 사용 한도(${DAILY_LIMIT}회)를 모두 썼어요. 내일 다시 시도해주세요.` }, 429);

    // ---- 브리프 검증 (전용 엔드포인트 — 임의 프롬프트 불가) ----
    let brief;
    try { brief = await req.json(); } catch (e) { return json({ error: 'BAD_REQUEST' }, 400); }
    const clip = (s, n) => String(s == null ? '' : s).slice(0, n);
    const safe = {
      title: clip(brief.title, 200),
      message: clip(brief.message, 500),
      audience: clip(brief.audience, 200),
      outline: (Array.isArray(brief.outline) ? brief.outline : []).slice(0, 8).map((s) => clip(s, 120)),
    };
    if (!safe.title && !safe.message && !safe.outline.length) return json({ error: 'EMPTY_BRIEF' }, 400);

    // ---- Anthropic 호출 (키·모델·토큰 전부 서버 통제) ----
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM,
        messages: [{ role: 'user', content: '브리프:\n' + JSON.stringify(safe, null, 2) }],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return json({ error: 'UPSTREAM', status: res.status, detail: t.slice(0, 300) }, 502);
    }
    const data = await res.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');

    // 성공한 호출만 카운트 (TTL 하루+1h)
    try { await env.RATE_KV.put(rlKey, String(used + 1), { expirationTtl: 90000 }); } catch (e) {}

    return json({ text, remaining: DAILY_LIMIT - used - 1 });
  },
};
