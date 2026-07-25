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
  '규칙: 첫 장은 cover, 본문이 2섹션 이상이면 두번째는 agenda, 마지막은 closing. ' +
  '브리프의 plan(자유 기획 텍스트)을 해석해 구조를 잡는다 — plan에 목차·순서가 보이면 그대로 따르고, ' +
  '없으면 주제·목적·청중에 맞는 논리적 목차를 직접 구성한다. plan의 구체 정보(수치·기능·일정 등)는 반드시 슬라이드에 반영. ' +
  '섹션마다 본문 슬라이드(rows/cols/bigstat/statement) 1장 이상을 실제 내용으로 채운다(플레이스홀더 금지). ' +
  '레이아웃은 내용 성격에 맞게 다양하게. 수치는 plan에 있으면 그 값, 없으면 맥락상 그럴듯하게. ' +
  '총 장수는 length를 따른다: short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.';

/* 웹(랜딩/웹사이트) 초안 — 브리프에 근거 있는 것만 채우고, 없는 건 null.
   null 필드는 스튜디오 채팅이 후속 질문으로 받아 채움(추측 수치 금지 원칙). */
const WEB_SYSTEM =
  '너는 시니어 웹 카피라이터 겸 콘텐츠 기획자다. 브리프로 제품 소개 페이지의 콘텐츠 초안을 만든다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
  '형식: {"productName":str,"tagline":str,"subcopy":str,"primaryCta":str,' +
  '"features":[{"title":str,"desc":str}]|null,"stats":[{"value":str,"label":str}]|null,' +
  '"bannerText":str|null,"bannerCta":str|null,"footerLinks":[str]|null,"footerCopyright":str|null}\n' +
  '규칙:\n' +
  '- 브리프(특히 plan 자유 텍스트)에서 파악되는 내용만 쓴다. 카피(태그라인·소개문·CTA·배너 문구)는 브리프 내용 기반 창작 허용.\n' +
  '- 수치가 필요한 stats는 plan에 실제 수치가 있을 때만 채운다. 없으면 null — 절대 지어내지 마라.\n' +
  '- features는 plan에서 기능·강점을 뽑을 수 있으면 정확히 3개(제목 2~6단어+한 줄 설명). 못 뽑으면 null.\n' +
  '- footerLinks/footerCopyright는 브리프에 관련 정보 있을 때만. 없으면 null.\n' +
  '- 문구는 lang 값의 언어로(ko=한국어, en=영어). 톤은 간결·자신감, 과장 금지.\n' +
  '- tagline은 12자 내외 한 줄, subcopy는 1~2문장.';

/* 인테이크 되묻기 — 브리프를 읽고 "생성 품질에 정말 필요한데 빠진 정보"만 0~2개 질문.
   이름/제품명도 브리프에서 추출(따로 폼으로 안 물음). 질문 없으면 빈 배열. */
const INTAKE_SYSTEM =
  '너는 제작 브리프를 접수하는 시니어 PM이다. 사용자의 자유 브리프를 읽고,\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·설명 금지.\n' +
  '형식: {"name":str|null,"product":str|null,"questions":[{"key":str,"q":str}]}\n' +
  '규칙:\n' +
  '- name=프로젝트/페이지 이름 후보, product=제품·서비스명. 브리프에서 추출 가능할 때만, 없으면 null.\n' +
  '- questions는 결과물 품질에 정말 필요한데 브리프에 없는 것만 최대 2개. 브리프가 충분하면 빈 배열 [].\n' +
  '- 좋은 질문 예: 대상 고객이 누구인지(kind=web), 청중·발표 목적(kind=ppt), 강조할 수치가 있는지.\n' +
  '- 브리프에 이미 있는 걸 다시 묻지 마라. 디자인 취향은 묻지 마라(스타일은 따로 고름).\n' +
  '- q는 한국어 존댓말 한 문장, 짧게. key는 영문 스네이크(예: target_audience).';

/* 내용 수정(채팅) — 전체 slides 교체 계약. 내용·구조(추가/분할/삭제/순서) 전부 허용, 디자인만 거절 */
const EDIT_SYSTEM =
  '너는 프레젠테이션 편집자다. 현재 덱(slides 배열)과 사용자 지시를 받아 덱을 수정한다.\n' +
  '반드시 유효한 JSON 하나만 출력한다. 코드펜스·설명 문장 금지.\n' +
  '형식: {"slides":[...수정 후 전체 슬라이드 배열...],"message":"<사용자에게 보여줄 한 줄 요약>"}\n' +
  '슬라이드 스키마: ' + SCHEMA_DOC + '\n' +
  '할 수 있는 것: 문구·수치·톤 수정, 슬라이드 추가·분할·삭제·순서 변경, 한 장을 여러 장으로 상세화 — 전부 가능. 지시대로 실행하라.\n' +
  '규칙:\n' +
  '- 지시와 무관한 슬라이드는 원본 그대로 복사해 유지(임의 수정 금지).\n' +
  '- 새로 만드는 슬라이드는 실제 내용으로 채운다(플레이스홀더 금지). 기존 덱의 맥락·톤을 따른다.\n' +
  '- 덱은 1~24장.\n' +
  '- 디자인(색·폰트·크기·배치·테마) 요청만 예외: slides를 null로 하고 message에 "디자인은 스타일 팩에서 일괄 관리돼요. 내용·구성 수정을 말씀해주세요." 취지로 안내.\n' +
  '- 발표와 무관한 요청이면 slides null + 정중히 수정 요청을 유도.\n' +
  '- message는 한국어 한두 문장, 무엇을 했는지 구체적으로.';

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    const url = new URL(req.url);
    const route = url.pathname;
    const ROUTES = ['/compose', '/edit', '/compose-web', '/intake'];
    if (req.method !== 'POST' || ROUTES.indexOf(route) < 0) return json({ error: 'NOT_FOUND' }, 404);

    // ---- IP당 일일 제한 (KV) ----
    const ip = req.headers.get('cf-connecting-ip') || 'unknown';
    const day = new Date().toISOString().slice(0, 10);
    const rlKey = `rl:${ip}:${day}`;
    let used = 0;
    try { used = parseInt(await env.RATE_KV.get(rlKey), 10) || 0; } catch (e) {}
    if (used >= DAILY_LIMIT) return json({ error: 'LIMIT', message: `오늘 사용 한도(${DAILY_LIMIT}회)를 모두 썼어요. 내일 다시 시도해주세요.` }, 429);

    // ---- 입력 검증 (전용 엔드포인트 — 임의 프롬프트 불가) ----
    let body;
    try { body = await req.json(); } catch (e) { return json({ error: 'BAD_REQUEST' }, 400); }
    const clip = (s, n) => String(s == null ? '' : s).slice(0, n);

    let system, userMsg;
    if (route === '/compose') {
      const safe = {
        title: clip(body.title, 200),
        message: clip(body.message, 500),
        audience: clip(body.audience, 200),
        purpose: clip(body.purpose, 300),
        plan: clip(body.plan, 6000),   // 자유 기획 텍스트 — 목차·수치·요구 전부 여기 담김
        length: clip(body.length, 10), // short|std|deep → 목표 장수
        outline: (Array.isArray(body.outline) ? body.outline : []).slice(0, 8).map((s) => clip(s, 120)),
      };
      if (!safe.title && !safe.message && !safe.plan && !safe.outline.length) return json({ error: 'EMPTY_BRIEF' }, 400);
      system = SYSTEM;
      userMsg = '브리프:\n' + JSON.stringify(safe, null, 2);
    } else if (route === '/intake') {
      const safe = { kind: clip(body.kind, 10), plan: clip(body.plan, 6000) };
      if (!safe.plan) return json({ error: 'EMPTY_BRIEF' }, 400);
      system = INTAKE_SYSTEM;
      userMsg = '브리프(kind=' + safe.kind + '):\n' + safe.plan;
    } else if (route === '/compose-web') {
      const safe = {
        product: clip(body.product, 100),
        name: clip(body.name, 200),
        purpose: clip(body.purpose, 300),
        plan: clip(body.plan, 6000),   // 자유 소개/기획 텍스트
        kind: clip(body.kind, 10),     // single|multi
        lang: clip(body.lang, 5) || 'ko',
      };
      if (!safe.plan && !safe.product && !safe.name) return json({ error: 'EMPTY_BRIEF' }, 400);
      system = WEB_SYSTEM;
      userMsg = '브리프:\n' + JSON.stringify(safe, null, 2);
    } else { // /edit
      const slides = Array.isArray(body.slides) ? body.slides.slice(0, 24) : [];
      const instruction = clip(body.instruction, 800);
      if (!slides.length || !instruction) return json({ error: 'BAD_REQUEST' }, 400);
      system = EDIT_SYSTEM;
      userMsg = '현재 덱:\n' + clip(JSON.stringify(slides), 24000) + '\n\n사용자 지시:\n' + instruction;
    }

    // ---- Anthropic 호출 (키·모델·토큰 전부 서버 통제) ----
    // Anthropic은 홍콩 등 미지원 지역 IP를 403으로 차단하는데, 이 워커가 HKG 콜로에서
    // 실행되면 그 IP로 나가 실패한다. AI_GATEWAY 변수가 있으면 Cloudflare AI Gateway
    // (중앙 인프라 경유 — 지역 차단 안 걸림)를 통해 호출한다. wrangler.toml [vars] 참조.
    const ACCOUNT_ID = '96adc93fc6d5c8f28f6d11a7550c698d';
    const apiUrl = env.AI_GATEWAY
      ? `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${env.AI_GATEWAY}/anthropic/v1/messages`
      : 'https://api.anthropic.com/v1/messages';
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL, max_tokens: route === '/edit' ? 6000 : route === '/compose-web' ? 2000 : route === '/intake' ? 500 : MAX_TOKENS,   // edit는 전체 덱 반환이라 여유, 웹 초안·인테이크는 짧음
        system: system,
        messages: [{ role: 'user', content: userMsg }],
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
