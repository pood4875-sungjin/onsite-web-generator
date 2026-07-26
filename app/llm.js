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
  // UI 언어 — 되묻기 질문·수정 결과 메시지를 이 언어로 받는다(초안 콘텐츠 언어는 brief.lang)
  function uiLang() { try { return (window.I18N ? I18N.getLang() : localStorage.getItem('midas-lang')) || 'ko'; } catch (e) { return 'ko'; } }
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

  /* LLM 출력 JSON 자가수리 — 모델이 가끔 따옴표 누락·끝 쉼표를 낸다(실측: "],side": ).
     정상 파스 실패 시에만 적용하므로 본문 오탐 리스크는 실패 케이스로 한정. */
  function _repairText(raw) {
    return raw
      .replace(/([{,\[]\s*)([A-Za-z_][A-Za-z0-9_]*)"\s*:/g, '$1"$2":')   // 여는 따옴표 누락: ,side":
      .replace(/"([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '"$1":')                 // 닫는 따옴표 누락: "side:
      .replace(/,\s*([}\]])/g, '$1');                                      // 끝 쉼표
  }
  function _repairParse(raw) {
    try { return JSON.parse(raw); } catch (e0) {}
    try { return JSON.parse(_repairText(raw)); } catch (e1) {}
    return null;
  }
  /* 최후 샐비지 — slides 배열에서 완전한 슬라이드 객체만 문자열 스캔으로 건져냄.
     한 장이 깨지거나 max_tokens로 뒤가 잘려도 나머지는 살린다.
     따옴표 누락이 스캐너의 문자열 짝을 꼬이게 하므로 스캔 전에 텍스트 교정 먼저. */
  function _salvageSlides(s) {
    s = _repairText(s);
    var m = s.indexOf('"slides"'); if (m < 0) return null;
    var a = s.indexOf('[', m); if (a < 0) return null;
    var out = [], depth = 0, inS = false, esc = false, start = -1;
    for (var i = a + 1; i < s.length; i++) {
      var c = s[i];
      if (inS) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inS = false; continue; }
      if (c === '"') { inS = true; continue; }
      if (c === '{') { if (depth === 0) start = i; depth++; }
      else if (c === '}') { depth--; if (depth === 0 && start >= 0) { var one = _repairParse(s.slice(start, i + 1)); if (one) out.push(one); start = -1; } }
      else if (c === ']' && depth === 0) break;
    }
    return out.length ? out : null;
  }

  /* 덱 순서 규칙 강제 — Q&A(statement)와 closing은 무조건 마지막(Q&A → closing 순).
     AI가 중간에 끼워도 여기서 결정론으로 재배치. 나머지 순서는 그대로 보존. */
  function _endOrder(slides) {
    var main = [], qna = [], close = [];
    slides.forEach(function (sl) {
      if (sl.type === 'closing') close.push(sl);
      else if (sl.type === 'statement' && /^\s*Q\s*&?\s*A\s*$/i.test(String(sl.title || '').trim())) qna.push(sl);
      else main.push(sl);
    });
    return main.concat(qna, close);
  }

  // 응답 텍스트에서 JSON 덱 추출+검증. 실패 시 throw → 호출측 결정론 폴백.
  // pitch 팩 허용 타입 — packs.pitch.js CATALOG와 동일 목록
  var PITCH_ALLOWED = { statement: 1, quote: 1, split: 1, grid: 1, stats: 1, bigstat: 1, list: 1, table: 1, pricing: 1, timeline: 1, chart: 1, matrix: 1, gallery: 1, closing: 1 };
  // honors 팩 = pitch 타입 + toc(목차)·divider(간지)
  var HONORS_ALLOWED = Object.assign({ toc: 1, divider: 1 }, PITCH_ALLOWED);
  function allowedFor(pack) { return pack === 'honors' ? HONORS_ALLOWED : pack === 'pitch' ? PITCH_ALLOWED : ALLOWED; }
  function parseDeck(txt, pack) {
    var s = String(txt || '').trim();
    s = s.replace(/^```(?:json)?/i, '').replace(/```$/,'').trim();  // 코드펜스 제거
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    if (i < 0 || j < 0) throw new Error('BAD_JSON');
    var obj = _repairParse(s.slice(i, j + 1));
    if (!obj) { var sv = _salvageSlides(s); if (sv) obj = { slides: sv }; }
    if (!obj) throw new Error('BAD_JSON');
    var slides = obj.slides || obj.deck || [];
    if (!Array.isArray(slides) || !slides.length) throw new Error('NO_SLIDES');
    var ok = allowedFor(pack);
    slides = _endOrder(slides.filter(function (sl) { return sl && ok[sl.type]; }));
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
        body: JSON.stringify({ title: brief.title || '', message: brief.message || '', audience: brief.audience || '', purpose: brief.purpose || '', plan: brief.plan || '', length: brief.length || '', outline: brief.outline || [], pack: brief.pack || '' }),
      });
      var pj = null; try { pj = await pres.json(); } catch (e) {}
      if (!pres.ok) throw new Error(_proxyErrMsg(pj, pres.status));
      var pdeck = parseDeck(pj.text, brief.pack);
      pdeck.style = brief.style || pdeck.style || 'ax';
      pdeck.accent = pdeck.accent || 'blue';
      return pdeck;
    }
    // BYOK 직접 호출 — honors 팩: pitch 레이아웃 + 목차/간지 규칙
    if (brief.pack === 'honors' && window.HONORS_SCHEMA_DOC) {
      var hsys =
        '너는 시니어 발표 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
        '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지. 형식: {"slides":[...]}\n' +
        '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + window.HONORS_SCHEMA_DOC + '\n' +
        '각 타입의 필드: ' + window.HONORS_FIELD_DOC + '\n' +
        '규칙: 1장 statement(pos bottom). 2장 toc(items=섹션 제목들). ' +
        '각 섹션 시작마다 divider(no "01"…, title=toc 항목과 동일, v는 1→2→3 순환). ' +
        '수치는 stats/bigstat/chart로 시각화(값은 plan의 실제 수치). 마지막 closing. ' +
        '총 장수: short=5~8, std=10~15, deep=20~24, 없으면 6~12(목차·간지 포함).';
      var htxt = await messages({ system: hsys, user: '브리프:\n' + JSON.stringify({ title: brief.title || '', message: brief.message || '', audience: brief.audience || '', plan: brief.plan || '', length: brief.length || '', outline: brief.outline || [] }, null, 2), maxTokens: 4000 });
      var hd = parseDeck(htxt, 'honors'); hd.style = 'honors'; return hd;
    }
    // BYOK 직접 호출 — pitch 팩이면 카탈로그 기반 프롬프트(팩이 노출한 문서 사용)
    if (brief.pack === 'pitch' && window.PITCH_SCHEMA_DOC) {
      var psys =
        '너는 시니어 피치덱 기획자다. 브리프로 한국어 프레젠테이션 슬라이드 덱을 설계한다.\n' +
        '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지. 형식: {"slides":[...]}\n' +
        '슬라이드 타입은 내용 성격에 맞춰 아래 "언제 쓰나"로 고른다(같은 타입만 반복 금지):\n' + window.PITCH_SCHEMA_DOC + '\n' +
        '각 타입의 필드: ' + window.PITCH_FIELD_DOC + '\n' +
        '규칙: 첫 장 statement(bg green), 마지막 closing. 수치는 stats/bigstat/chart로 시각화(값은 plan의 실제 수치). ' +
        'bg는 white/grey 교대, green은 전환점 1~3장. 총 장수: short=5~8, std=10~15, deep=20~24, 없으면 6~12.';
      var ptxt = await messages({ system: psys, user: '브리프:\n' + JSON.stringify({ title: brief.title || '', message: brief.message || '', audience: brief.audience || '', plan: brief.plan || '', length: brief.length || '', outline: brief.outline || [] }, null, 2), maxTokens: 4000 });
      var pd = parseDeck(ptxt, 'pitch'); pd.style = 'pitch'; return pd;
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
  async function editDeck(slides, instruction, pack) {
    if (usingProxy()) {
      var r = await fetch(proxyUrl() + '/edit', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slides: slides, instruction: instruction, lang: uiLang(), pack: pack || '' }),
      });
      var j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok) throw new Error(_proxyErrMsg(j, r.status));
      return _parseEdit(j.text, pack);
    }
    var sys =
      '너는 프레젠테이션 편집자다. 현재 덱과 사용자 지시를 받아 덱을 수정한다.\n' +
      '반드시 유효한 JSON 하나만 출력: {"slides":[...수정 후 전체 배열...],"message":"<한 줄 요약>"}\n' +
      '슬라이드 스키마: ' + (pack === 'honors' && window.HONORS_FIELD_DOC ? window.HONORS_FIELD_DOC : pack === 'pitch' && window.PITCH_FIELD_DOC ? window.PITCH_FIELD_DOC : SCHEMA_DOC) + '\n' +
      '문구·수치·톤 수정, 추가·분할·삭제·순서 변경 전부 가능. 무관한 슬라이드는 원본 그대로 복사. ' +
      '새 슬라이드는 실제 내용으로(플레이스홀더 금지), 덱 1~24장. ' +
      '디자인(색·폰트·배치) 요청만 slides null + "디자인은 스타일 팩에서 일괄 관리돼요" 안내. 무관한 요청은 정중히 유도.';
    var txt = await messages({ system: sys, user: '현재 덱:\n' + JSON.stringify(slides) + '\n\n사용자 지시:\n' + instruction, maxTokens: 6000 });
    return _parseEdit(txt, pack);
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
        body: JSON.stringify({ kind: brief.kind || '', plan: brief.plan || '', lang: uiLang() }),
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
    var o = _repairParse(s.slice(i, k + 1)) || {};
    var qs = (Array.isArray(o.questions) ? o.questions : []).map(function (x) { return x && { key: String(x.key || ''), q: String(x.q || '').trim() }; }).filter(function (x) { return x && x.q; }).slice(0, 2);
    return { name: (typeof o.name === 'string' && o.name.trim()) || '', product: (typeof o.product === 'string' && o.product.trim()) || '', questions: qs };
  }

  /* 웹(랜딩/웹사이트) 초안 — 모든 필드를 채워 완성된 페이지로. 근거 없는 항목은
     그럴듯한 예시 + assumed 목록 표시 → 스튜디오가 "임의로 채운 부분" 안내. */
  var WEB_SYSTEM =
    '너는 시니어 웹 카피라이터 겸 콘텐츠 기획자다. 브리프로 제품 소개 페이지의 콘텐츠 초안을 만든다.\n' +
    '반드시 유효한 JSON 하나만 출력한다. 코드펜스·주석·설명 문장 금지.\n' +
    '형식: {"productName":str,"tagline":str,"subcopy":str,"primaryCta":str,' +
    '"features":[{"title":str,"desc":str}],"stats":[{"value":str,"label":str}],' +
    '"bannerText":str,"bannerCta":str,"footerLinks":[str],"footerCopyright":str,"assumed":[str],' +
    '"pages":[{"name":str,"type":"features"|"pricing"|"landing","tagline":str,"subcopy":str,"features":[{"title":str,"desc":str}]}]}\n' +
    '규칙: pages는 kind=multi이고 브리프에 메뉴·페이지 구성(IA)이 있을 때만 채운다(메인홈 제외, 최대 6개, 각 features 3개). ' +
    'IA 언급이 없거나 single이면 []. productName은 브리프의 실제 제품명을 쓰고, 지어냈다면 assumed에 넣는다. 모든 필드를 빠짐없이 채운다. 브리프 근거 없는 항목은 맥락에 맞는 그럴듯한 예시로 채우고 ' +
    '그 필드명을 assumed에 넣는다(지어낸 수치 stats는 반드시, 단 브리프의 실제 수치를 쓴 필드는 제외). features 3개, stats 3개, ' +
    'footerLinks 표준 3개. 문구는 lang 언어로. tagline 12자 내외, subcopy 1~2문장.';
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
    var o = _repairParse(s.slice(i, j + 1));
    if (!o) throw new Error('BAD_JSON');
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
    // IA(하위 페이지 목록) — 브리프에 메뉴 구성이 있을 때만 채워짐. 없으면 빈 배열.
    var PT = { features: 1, pricing: 1, landing: 1 };   // 이 3개만 전용 템플릿이 있음
    out.pages = (Array.isArray(o.pages) ? o.pages : []).map(function (x) {
      if (!x || !str(x.name)) return null;
      var pf = (Array.isArray(x.features) ? x.features : []).map(function (c) { return c && { title: str(c.title), desc: str(c.desc) }; }).filter(function (c) { return c && c.title; }).slice(0, 4);
      return { name: str(x.name).slice(0, 20), type: PT[x.type] ? x.type : 'features', tagline: str(x.tagline), subcopy: str(x.subcopy), features: pf };
    }).filter(Boolean).slice(0, 6);
    // 임의로 채운(브리프 근거 없는) 필드명 — 스튜디오 안내용
    out.assumed = (Array.isArray(o.assumed) ? o.assumed : []).map(function (x) { return str(x); }).filter(Boolean);
    if (!out.productName && !out.tagline && !out.features) throw new Error('EMPTY_DRAFT');
    return out;
  }

  function _parseEdit(txt, pack) {
    var s = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    if (i < 0 || j < 0) throw new Error('BAD_JSON');
    var obj = _repairParse(s.slice(i, j + 1));
    if (!obj) { var sv = _salvageSlides(s); if (sv) obj = { slides: sv, message: '' }; }
    if (!obj) throw new Error('BAD_JSON');
    var ok = allowedFor(pack);   // 팩별 허용 타입 — 안 갈리면 pitch 장이 전부 걸러져 덱이 쪼그라든다
    var slides = Array.isArray(obj.slides) ? _endOrder(obj.slides.filter(function (sl) { return sl && ok[sl.type]; }).slice(0, 24)) : null;
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
