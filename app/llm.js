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

  // 브리프 → 덱 JSON (LLM 생성). 세부 문구까지 채움.
  async function composeDeck(brief) {
    brief = brief || {};
    // 프록시 모드: 서버가 프롬프트 조립·모델 고정·일일 제한 적용. 키 불필요.
    if (usingProxy()) {
      var pres = await fetch(proxyUrl() + '/compose', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: brief.title || '', message: brief.message || '', audience: brief.audience || '', purpose: brief.purpose || '', plan: brief.plan || '', outline: brief.outline || [] }),
      });
      var pj = null; try { pj = await pres.json(); } catch (e) {}
      if (!pres.ok) throw new Error((pj && (pj.message || pj.error)) || ('HTTP ' + pres.status));
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
      '레이아웃은 내용 성격에 맞게 다양하게. 수치는 plan에 있으면 그 값, 없으면 맥락상 그럴듯하게. 총 6~12장.';
    var user = '브리프:\n' + JSON.stringify({
      title: brief.title || '', message: brief.message || '', audience: brief.audience || '',
      purpose: brief.purpose || '', plan: brief.plan || '',
      outline: (brief.outline || []),
    }, null, 2);
    var txt = await messages({ system: sys, user: user, maxTokens: 4000 });
    var deck = parseDeck(txt);
    deck.style = brief.style || deck.style || 'ax';
    deck.accent = deck.accent || 'blue';
    return deck;
  }

  // 채팅 내용수정: {slides, instruction} → {ops:[{i,slide}], message}. 디자인/구조 요청은 ops 없이 안내 메시지.
  async function editDeck(slides, instruction) {
    if (usingProxy()) {
      var r = await fetch(proxyUrl() + '/edit', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slides: slides, instruction: instruction }),
      });
      var j = null; try { j = await r.json(); } catch (e) {}
      if (!r.ok) throw new Error((j && (j.message || j.error)) || ('HTTP ' + r.status));
      return _parseEdit(j.text);
    }
    var sys =
      '너는 프레젠테이션 내용 편집자다. 현재 덱과 사용자 지시를 받아 내용만 수정한다.\n' +
      '반드시 유효한 JSON 하나만 출력: {"ops":[{"i":<0기준 인덱스>,"slide":{...전체...}}],"message":"<한 줄 요약>"}\n' +
      '슬라이드 스키마: ' + SCHEMA_DOC + '\n' +
      '지시와 관련된 슬라이드만 ops에. 디자인(색·폰트·배치) 요청은 ops 빈 배열 + "디자인은 스타일 팩에서 일괄 관리돼요" 안내. ' +
      '순서·추가·삭제 요청은 ops 빈 배열 + "왼쪽 슬라이드 목록에서 드래그/버튼으로 하세요" 안내. 무관한 요청은 정중히 유도.';
    var txt = await messages({ system: sys, user: '현재 덱:\n' + JSON.stringify(slides) + '\n\n사용자 지시:\n' + instruction, maxTokens: 4000 });
    return _parseEdit(txt);
  }
  function _parseEdit(txt) {
    var s = String(txt || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var i = s.indexOf('{'), j = s.lastIndexOf('}');
    if (i < 0 || j < 0) throw new Error('BAD_JSON');
    var obj = JSON.parse(s.slice(i, j + 1));
    var ops = (Array.isArray(obj.ops) ? obj.ops : []).filter(function (o) { return o && typeof o.i === 'number' && o.slide && ALLOWED[o.slide.type]; });
    return { ops: ops, message: String(obj.message || '') };
  }

  window.LLM = {
    editDeck: editDeck,
    MODELS: MODELS, DEFAULT_MODEL: DEFAULT_MODEL,
    getKey: getKey, setKey: setKey, getModel: getModel, setModel: setModel,
    hasKey: hasKey, maskKey: maskKey, messages: messages, composeDeck: composeDeck, parseDeck: parseDeck,
    proxyUrl: proxyUrl, usingProxy: usingProxy, aiAvailable: aiAvailable,
  };
})();
