/* llm.js — BYOK(사용자 키) LLM 클라이언트. classic <script src>.
   백엔드 없는 정적 앱: 사용자가 자신의 Anthropic API 키를 설정에 입력→localStorage(이 브라우저에만) 저장.
   브라우저에서 api.anthropic.com 직접 호출(anthropic-dangerous-direct-browser-access 헤더로 CORS 허용).
   키는 서버로 전송되지 않으며 이 기기 로컬에만 존재. window.LLM 노출. */
(function () {
  /* 팀 공용 프록시(관리자 키 1개, proxy/README.md로 배포) 주소.
     채우면 전원 프록시 모드(개별 키 불필요·모델 서버 고정·일일 제한 서버 적용).
     비우면 BYOK(각자 키) 모드. 로컬 테스트: localStorage 'onsite-ai-proxy'로 오버라이드 가능. */
  var PROXY_URL = 'https://webgen-ppt-proxy.ksj0225.workers.dev';

  var KEY_LS = 'onsite-ai-key', MODEL_LS = 'onsite-ai-model', PROXY_LS = 'onsite-ai-proxy';
  var DEFAULT_MODEL = 'claude-sonnet-5';
  var MODELS = [
    { id: 'claude-sonnet-5', name: 'Sonnet 5 · 균형(권장)' },
    { id: 'claude-opus-4-8', name: 'Opus 4.8 · 최고품질' },
    { id: 'claude-haiku-4-5-20251001', name: 'Haiku 4.5 · 빠름·저렴' },
  ];

  function getKey() { try { return localStorage.getItem(KEY_LS) || ''; } catch (e) { return ''; } }
  function setKey(v) { try { v ? localStorage.setItem(KEY_LS, v) : localStorage.removeItem(KEY_LS); } catch (e) {} }
  function getModel() { try { return localStorage.getItem(MODEL_LS) || DEFAULT_MODEL; } catch (e) { return DEFAULT_MODEL; } }
  function setModel(v) { try { v ? localStorage.setItem(MODEL_LS, v) : localStorage.removeItem(MODEL_LS); } catch (e) {} }
  function hasKey() { return !!getKey(); }
  function maskKey(k) { k = k || getKey(); if (!k) return ''; return k.length <= 12 ? '••••' : k.slice(0, 7) + '…' + k.slice(-4); }
  function proxyUrl() { var o = ''; try { o = localStorage.getItem(PROXY_LS) || ''; } catch (e) {} return (o || PROXY_URL || '').replace(/\/$/, ''); }
  function usingProxy() { return !!proxyUrl(); }
  // AI 사용 가능? 프록시(팀 공용) 또는 개인 키
  function aiAvailable() { return usingProxy() || hasKey(); }

  // 저수준: 단일 유저 메시지 + 시스템 프롬프트 → 텍스트 응답
  async function messages(opts) {
    opts = opts || {};
    var key = getKey();
    if (!key) throw new Error('NO_KEY');
    var res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: getModel(),
        max_tokens: opts.maxTokens || 4000,
        system: opts.system || '',
        messages: [{ role: 'user', content: opts.user || '' }],
      }),
    });
    if (!res.ok) {
      var t = ''; try { t = await res.text(); } catch (e) {}
      var msg = 'HTTP ' + res.status;
      try { var j = JSON.parse(t); if (j && j.error && j.error.message) msg += ' · ' + j.error.message; } catch (e) { if (t) msg += ' · ' + t.slice(0, 160); }
      throw new Error(msg);
    }
    var data = await res.json();
    return (data.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
  }

  var ALLOWED = { cover: 1, agenda: 1, rows: 1, cols: 1, bigstat: 1, statement: 1, closing: 1 };
  var SCHEMA_DOC =
    'cover:{title,subtitle,eyebrow?,meta?:[{k,v}]} | ' +
    'agenda:{title,items:[문자열]} | ' +
    'rows:{title,index?,rows:[{num,label,desc}]} | ' +
    'cols:{title,index?,cols:[{sub,items?:[문자열],text?}]} | ' +
    'bigstat:{title,index?,big,sides:[{sub,text}]} | ' +
    'statement:{title,index?,text,cols?} | ' +
    'closing:{title,sub?,contacts?:[{k,v}]}';

  // 응답 텍스트에서 JSON 덱 추출+검증. 실패 시 throw → 호출측 결정론 폴백.
  function parseDeck(txt) {
    var s = String(txt || '').trim();
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/,'').trim();  // 코드펜스 제거
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    if (i < 0 || j < 0) throw new Error('BAD_JSON');
    var obj = JSON.parse(s.slice(i, j + 1));
    var slides = obj.slides || obj.deck || [];
    if (!Array.isArray(slides) || !slides.length) throw new Error('NO_SLIDES');
    slides = slides.filter(function (sl) { return sl && ALLOWED[sl.type]; });
    if (!slides.length) throw new Error('NO_VALID_SLIDES');
    return { slides: slides, style: obj.style, accent: obj.accent };
  }

  /* 프록시 에러 → 사용자용 한국어 메시지. LIMIT는 서버가 message를 주고,
     UPSTREAM(Anthropic 거부 — 주로 경유 데이터센터 지역 차단)은 코드만 와서 여기서 번역. */
  function _proxyErrMsg(j, status) {
    if (j && j.message) return j.message;
    if (j && j.error === 'UPSTREAM') return 'AI 서버 연결이 잠시 거부됐어요. 다시 시도해주세요.';
    return (j && j.error) || ('HTTP ' + status);
  }

  // 브리프 → 덱 JSON (LLM 생성). 세부 문구까지 채움.
  async function composeDeck(brief) {
    brief = brief || {};
    // 프록시 모드: 서버가 프롬프트 조립·모델 고정·일일 제한 적용. 키 불필요.
    if (usingProxy()) {
      var pres = await fetch(proxyUrl() + '/compose', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: brief.title || '', message: brief.message || '', audience: brief.audience || '', purpose: brief.purpose || '', plan: brief.plan || '', length: brief.length || '', outline: brief.outline || [] }),
      });
      var pj = null; try { pj = await pres.json(); } catch (e) {}
      if (!pres.ok) throw new Error(_proxyErrMsg(pj, pres.status));
      var pdeck = parseDeck(pj.text);
      pdeck.style = brief.style || pdeck.style || 'ax';
      pdeck.accent = pdeck.accent || 'blue';
      return pdeck;
    }
    var sys =
      '너는 시니어 발표 장표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
      '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
      '형식: {"slides":[ ... ]}\n' +
      '슬라이드 타입과 필드: ' + SCHEMA_DOC + '\n' +
      '규칙: 첫 장은 cover, 본문이 2섹션 이상이면 두번째는 agenda, 마지막은 closing. ' +
      'plan(자유 기획 텍스트)에 목차·순서가 보이면 그대로 따르고, 없으면 주제·목적·청중에 맞는 논리적 목차를 직접 구성. ' +
      'plan의 구체 정보(수치·기능·일정)는 반드시 반영. 섹션마다 본문 슬라이드(rows/cols/bigstat/statement) 1장 이상 실제 내용으로(플레이스홀더 금지). ' +
      '레이아웃은 내용 성격에 맞게 다양하게. 수치는 plan에 있으면 그 값, 없으면 맥락상 그럴듯하게. ' +
      '총 장수는 length를 따른다: short=5~8장, std=10~15장, deep=20~24장, 없으면 6~12장.';
    var user = '브리프:\n' + JSON.stringify({
      title: brief.title || '', message: brief.message || '', audience: brief.audience || '',
      purpose: brief.purpose || '', plan: brief.plan || '', length: brief.length || '',
      outline: (brief.outline || []),
    }, null, 2);
    var txt = await messages({ system: sys, user: user, maxTokens: 4000 });
    var deck = parseDeck(txt);
    deck.style = brief.style || deck.style || 'ax';
    deck.accent = deck.accent || 'blue';
    return deck;
  }

  /* 실측 소요시간 기록 — '보통 N초'를 추정이 아니라 이 기기 실측(최근 10회 중앙값×1.4, 5초 올림)으로 표시.
     기록 없으면 null → UI는 시간 약속을 하지 않음. */
  function recordDur(kind, ms) { try { var k = 'onsite-ai-durs-' + kind; var a = JSON.parse(localStorage.getItem(k)) || []; a.push(Math.round(ms / 1000)); if (a.length > 10) a = a.slice(-10); localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
  function estimateDur(kind) { try { var a = JSON.parse(localStorage.getItem('onsite-ai-durs-' + kind)) || []; if (!a.length) return null; a = a.slice().sort(function (x, y) { return x - y; }); var med = a[Math.floor(a.length / 2)]; return Math.max(10, Math.ceil(med * 1.4 / 5) * 5); } catch (e) { return null; } }

  // 채팅 내용수정: {slides, instruction} → {slides|null, message}. 디자인 요청은 slides 없이 안내 메시지.
  async function editDeck(slides, instruction) {
    if (usingProxy()) {
      var r = await fetch(proxyUrl() + '/edit', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slides: slides, instruction: instruction }),
      });
      var j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok) throw new Error(_proxyErrMsg(j, r.status));
      return _parseEdit(j.text);
    }
    var sys =
      '너는 프레젠테이션 편집자다. 현재 덱과 사용자 지시를 받아 덱을 수정한다.\n' +
      '반드시 유효한 JSON 하나만 출력: {"slides":[...수정 후 전체 배열...],"message":"<한 줄 요약>"}\n' +
      '슬라이드 스키마: ' + SCHEMA_DOC + '\n' +
      '문구·수치·톤 수정, 추가·분할·삭제·순서 변경 전부 가능. 무관한 슬라이드는 원본 그대로 복사. ' +
      '새 슬라이드는 실제 내용으로(플레이스홀더 금지), 덱 1~24장. ' +
      '디자인(색·폰트·배치) 요청만 slides null + "디자인은 스타일 팩에서 일괄 관리돼요" 안내. 무관한 요청은 정중히 유도.';
    var txt = await messages({ system: sys, user: '현재 덱:\n' + JSON.stringify(slides) + '\n\n사용자 지시:\n' + instruction, maxTokens: 6000 });
    return _parseEdit(txt);
  }
  /* 인테이크 되묻기 — 브리프에서 이름/제품명 추출 + 부족 정보 질문 0~2개.
     실패해도 흐름을 막지 않도록 호출측에서 catch → 질문 없이 진행. */
  var INTAKE_SYSTEM =
    '너는 제작 브리프를 접수하는 시니어 PM이다. 사용자의 자유 브리프를 읽고 JSON 하나만 출력한다.\n' +
    '형식: {"name":str|null,"product":str|null,"questions":[{"key":str,"q":str}]}\n' +
    '규칙: name/product는 브리프에서 추출 가능할 때만. questions는 결과물 품질에 정말 필요한데 빠진 것만 최대 2개, ' +
    '충분하면 []. 이미 있는 건 다시 묻지 않기. 디자인 취향 금지. q는 한국어 존댓말 한 문장.';
  async function intake(brief) {
    brief = brief || {};
    var txt;
    if (usingProxy()) {
      var r = await fetch(proxyUrl() + '/intake', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: brief.kind || '', plan: brief.plan || '' }),
      });
      var j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok) throw new Error(_proxyErrMsg(j, r.status));
      txt = j.text;
    } else {
      txt = await messages({ system: INTAKE_SYSTEM, user: '브리프(kind=' + (brief.kind || '') + '):\n' + (brief.plan || ''), maxTokens: 500 });
    }
    var s = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var i = s.indexOf('{'), k = s.lastIndexOf('}');
    if (i < 0 || k < 0) throw new Error('BAD_JSON');
    var o = JSON.parse(s.slice(i, k + 1));
    var qs = (Array.isArray(o.questions) ? o.questions : []).map(function (x) { return x && { key: String(x.key || ''), q: String(x.q || '').trim() }; }).filter(function (x) { return x && x.q; }).slice(0, 2);
    return { name: (typeof o.name === 'string' && o.name.trim()) || '', product: (typeof o.product === 'string' && o.product.trim()) || '', questions: qs };
  }

  /* 웹(랜딩/웹사이트) 초안 — 브리프 → 사이트 콘텐츠 필드. 근거 없는 항목은 null로 와서
     스튜디오가 후속 질문으로 채움. 실패 시 throw → 호출측이 기존 대화 플로우로 폴백. */
  var WEB_SYSTEM =
    '너는 시니어 웹 카피라이터 겸 콘텐츠 기획자다. 브리프로 제품 소개 페이지의 콘텐츠 초안을 만든다.\n' +
    '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
    '형식: {"productName":str,"tagline":str,"subcopy":str,"primaryCta":str,' +
    '"features":[{"title":str,"desc":str}]|null,"stats":[{"value":str,"label":str}]|null,' +
    '"bannerText":str|null,"bannerCta":str|null,"footerLinks":[str]|null,"footerCopyright":str|null}\n' +
    '규칙: 브리프에서 파악되는 내용만. 카피는 브리프 기반 창작 허용. stats는 실제 수치 있을 때만(지어내기 금지). ' +
    'features는 뽑을 수 있으면 정확히 3개. 문구는 lang 언어로. tagline 12자 내외, subcopy 1~2문장.';
  async function composeSite(brief) {
    brief = brief || {};
    var payload = { product: brief.product || '', name: brief.name || '', purpose: brief.purpose || '', plan: brief.plan || '', kind: brief.kind || 'single', lang: brief.lang || 'ko' };
    var txt;
    if (usingProxy()) {
      var r = await fetch(proxyUrl() + '/compose-web', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
      });
      var j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok) throw new Error(_proxyErrMsg(j, r.status));
      txt = j.text;
    } else {
      txt = await messages({ system: WEB_SYSTEM, user: '브리프:\n' + JSON.stringify(payload, null, 2), maxTokens: 2000 });
    }
    return _parseSite(txt);
  }
  // 검증+정규화: 문자열 필드는 문자열로, 배열 필드는 유효 항목만. 비었으면 null 유지.
  function _parseSite(txt) {
    var s = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    if (i < 0 || j < 0) throw new Error('BAD_JSON');
    var o = JSON.parse(s.slice(i, j + 1));
    var str = function (v) { return (typeof v === 'string' && v.trim()) ? v.trim() : ''; };
    var out = {
      productName: str(o.productName), tagline: str(o.tagline), subcopy: str(o.subcopy), primaryCta: str(o.primaryCta),
      bannerText: str(o.bannerText), bannerCta: str(o.bannerCta), footerCopyright: str(o.footerCopyright),
      features: null, stats: null, footerLinks: null,
    };
    if (Array.isArray(o.features)) {
      var f = o.features.map(function (x) { return x && { title: str(x.title), desc: str(x.desc) }; }).filter(function (x) { return x && x.title; }).slice(0, 6);
      if (f.length) out.features = f;
    }
    if (Array.isArray(o.stats)) {
      var st = o.stats.map(function (x) { return x && { value: str(x.value), label: str(x.label) }; }).filter(function (x) { return x && x.value; }).slice(0, 6);
      if (st.length) out.stats = st;
    }
    if (Array.isArray(o.footerLinks)) {
      var fl = o.footerLinks.map(function (x) { return str(x); }).filter(Boolean).slice(0, 8);
      if (fl.length) out.footerLinks = fl;
    }
    if (!out.productName && !out.tagline && !out.features) throw new Error('EMPTY_DRAFT');
    return out;
  }

  function _parseEdit(txt) {
    var s = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    if (i < 0 || j < 0) throw new Error('BAD_JSON');
    var obj = JSON.parse(s.slice(i, j + 1));
    var slides = Array.isArray(obj.slides) ? obj.slides.filter(function (sl) { return sl && ALLOWED[sl.type]; }).slice(0, 24) : null;
    if (slides && !slides.length) slides = null;   // 전부 무효 타입이면 무변경 취급
    return { slides: slides, message: String(obj.message || '') };
  }

  window.LLM = {
    editDeck: editDeck, recordDur: recordDur, estimateDur: estimateDur,
    MODELS: MODELS, DEFAULT_MODEL: DEFAULT_MODEL,
    getKey: getKey, setKey: setKey, getModel: getModel, setModel: setModel,
    hasKey: hasKey, maskKey: maskKey, messages: messages, composeDeck: composeDeck, composeSite: composeSite, intake: intake, parseDeck: parseDeck,
    proxyUrl: proxyUrl, usingProxy: usingProxy, aiAvailable: aiAvailable,
  };
})();
