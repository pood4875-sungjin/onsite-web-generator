/* packs.ppt.js — PPT(슬라이드) 팩. classic <script src>.
   출처: ~/ppt-template (render.js·tokens.css·deck.css) 포팅. 16:9(1280×720) 장표.
   데이터: { slides:[{type, ...}], style:'ax'|'grey'|'navy'|'ember'|'slidy', accent:'blue'|'orange'|'emerald' }
   슬라이드 타입: cover·agenda·rows·cols·bigstat·divider·statement·closing.
   window.renderPptDeck(data, opts) → 자가완결 HTML(스튜디오 프리뷰용 세로 스택). window.PPT_STYLE 메타. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  function kind(s, fb) { return esc((s.title || fb || s.type || 'Slide').replace(/\n/g, ' ')); }
  function de(path) { return ' data-edit="' + path + '"'; }   // slides.i.<path> 편집 훅
  function head(s, P) { return '<div class="s-head"><h2 class="s-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</h2><span class="s-index">' + esc(s.index || '') + '</span></div>'; }
  function colsBlock(cols, P) {
    var n = cols.length, cls = n <= 2 ? 'cols2' : 'cols3';
    return '<div class="' + cls + '">' + cols.map(function (c, j) {
      var CP = P + '.' + j;
      var inner = '<h3 class="block-sub"' + de(CP + '.sub') + '>' + esc(c.sub || '') + '</h3>';
      if (c.items && c.items.length) inner += '<ul class="block-list">' + c.items.map(function (li, k) { return '<li' + de(CP + '.items.' + k) + '>' + ml(li) + '</li>'; }).join('') + '</ul>';
      if (c.text) inner += '<p class="block-p"' + de(CP + '.text') + '>' + ml(c.text) + '</p>';
      return '<div>' + inner + '</div>';
    }).join('') + '</div>';
  }
  var R = {
    cover: function (s, P) {
      var meta = (s.meta || []);
      var cells = meta.map(function (m, i) { var sp = (meta.length > 1 && i === meta.length - 1) ? ' class="spacer"' : ''; return '<div' + sp + '><p class="meta-k">' + esc(m.k) + '</p><p class="meta-v">' + esc(m.v) + '</p></div>'; }).join('');
      return '<section class="slide dark cover" data-kind="Cover"><div class="cover-meta">' + cells + '</div><div class="cover-foot"><div>' +
        (s.eyebrow ? '<p class="meta-k" style="margin-bottom:18px;letter-spacing:.14em">' + esc(s.eyebrow) + '</p>' : '') +
        '<h1 class="cover-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</h1>' +
        (s.subtitle ? '<p class="block-p"' + de(P + '.subtitle') + ' style="color:var(--muted-alt);margin-top:24px;max-width:600px">' + esc(s.subtitle) + '</p>' : '') +
        '</div><div class="cover-arrow">→</div></div></section>';
    },
    agenda: function (s, P) {
      var items = s.items || [];
      return '<section class="slide" data-kind="Agenda"><div class="agenda"><div class="agenda-title">' + esc(s.title || 'Agenda') + '</div><div class="agenda-list">' +
        items.map(function (it, i) { return '<div class="agenda-row"><p class="agenda-label"' + de(P + '.items.' + i) + '>' + esc(it) + '</p><span class="agenda-badge">' + pad2(i + 1) + '</span></div>'; }).join('') + '</div></div></section>';
    },
    rows: function (s, P) {
      var rows = (s.rows || []).map(function (r, j) { return '<div class="row"><span class="row-num">' + esc(r.num || '') + '</span><h3 class="row-label"' + de(P + '.rows.' + j + '.label') + '>' + esc(r.label || '') + '</h3><p class="row-desc"' + de(P + '.rows.' + j + '.desc') + '>' + ml(r.desc || '') + '</p></div>'; }).join('');
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body"><div class="rows">' + rows + '</div></div></section>';
    },
    cols: function (s, P) { return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body">' + colsBlock(s.cols || [], P + '.cols') + '</div></section>'; },
    bigstat: function (s, P) {
      var sides = (s.sides || []).map(function (x, j) { return '<div><h3 class="block-sub"' + de(P + '.sides.' + j + '.sub') + '>' + esc(x.sub || '') + '</h3><p class="block-p"' + de(P + '.sides.' + j + '.text') + '>' + ml(x.text || '') + '</p></div>'; }).join('');
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body"><div class="bigstat"><p class="bignum"' + de(P + '.big') + '>' + ml(s.big || '') + '</p><div class="bigstat-side">' + sides + '</div></div></div></section>';
    },
    divider: function (s, P) {
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '"><div class="s-head"><h2 class="s-title"' + de(P + '.title') + ' style="font-size:128px;line-height:.9">' + ml(s.title || '') + '</h2><span class="s-index">' + esc(s.index || '') + '</span></div><div class="s-body" style="margin-top:40px"><p class="block-p"' + de(P + '.sub') + ' style="font-size:22px;' + (s.dark ? 'color:var(--on-alt-soft)' : '') + '">' + ml(s.sub || '') + '</p></div></section>';
    },
    statement: function (s, P) {
      var c = (s.cols && s.cols.length) ? colsBlock(s.cols, P + '.cols') : '';
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body"><p class="block-p"' + de(P + '.text') + ' style="font-size:26px;line-height:1.5;max-width:900px;margin-bottom:36px;' + (s.dark ? 'color:var(--on-alt-soft)' : '') + '">' + ml(s.text || '') + '</p>' + c + '</div></section>';
    },
    closing: function (s, P) {
      var contacts = s.contacts || [], fills = [0, 2, 4], cells = '';
      for (var i = 0; i < 6; i++) { var ci = fills.indexOf(i); if (ci > -1 && contacts[ci]) cells += '<div class="contact-cell fill"><p class="contact-k">' + esc(contacts[ci].k) + '</p><p class="contact-v">' + esc(contacts[ci].v) + '</p></div>'; else cells += '<div class="contact-cell"></div>'; }
      return '<section class="slide dark contact" data-kind="Closing"><div class="contact-grid">' + cells + '</div><div class="contact-foot">' + (s.sub ? '<p class="contact-email">' + esc(s.sub) + '</p>' : '') + '<h2 class="contact-title"' + de(P + '.title') + '>' + ml(s.title || 'Thank you') + '</h2></div></section>';
    },
  };
  function renderSlides(slides) { return (slides || []).map(function (s, i) { var fn = R[s.type] || R.rows; try { return fn(s, 'slides.' + i); } catch (e) { return ''; } }).join('\n'); }

  /* ---- CSS: ppt-template tokens+deck 포팅 (뷰어 크롬 제거, 세로 스택) ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Anonymous+Pro:wght@400;700&display=swap');" +
      /* 스타일 토큰 (기본 GREY) */
      ':root{--surf:#fff;--on-surf:#020212;--muted:#8a8a93;--line:rgba(2,2,18,.14);--surf-alt:#020212;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.82);--muted-alt:rgba(255,255,255,.62);--line-alt:rgba(255,255,255,.16);--font-disp:"Bricolage Grotesque","Pretendard",system-ui,sans-serif;--font-num:"Anonymous Pro",ui-monospace,monospace;--rad:0px;--card-bg:transparent;--card-bd:transparent;--card-pad:0px;--card-bg-alt:transparent;--card-bd-alt:transparent;--title-weight:400;--cover-weight:600;--label-weight:400;--slide-w:1280px;--slide-h:720px;--margin:60px;--ease:cubic-bezier(.22,1,.36,1)}' +
      '[data-style="ax"]{--surf:#fff;--on-surf:#0b0b0f;--muted:#5b5b62;--line:rgba(11,11,20,.10);--surf-alt:#0b1f3a;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.86);--muted-alt:rgba(255,255,255,.66);--line-alt:rgba(255,255,255,.18);--font-disp:"Pretendard",system-ui,sans-serif;--font-num:"Pretendard",system-ui,sans-serif;--rad:18px;--card-bg:#f7f8fa;--card-bd:rgba(11,11,20,.08);--card-pad:20px 26px;--card-bg-alt:rgba(255,255,255,.05);--card-bd-alt:rgba(255,255,255,.14);--title-weight:800;--cover-weight:800;--label-weight:700;--accent:#2f93e3}' +
      '[data-style="navy"]{--surf:#141a28;--on-surf:#fff;--muted:#6e7885;--line:rgba(255,255,255,.12);--surf-alt:#0f1420;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.72);--muted-alt:#6e7885;--line-alt:rgba(255,255,255,.12);--font-disp:"Helvetica Neue",Arial,"Pretendard",system-ui,sans-serif;--font-num:"Anonymous Pro",ui-monospace,monospace;--rad:14px;--card-bg:rgba(255,255,255,.04);--card-bd:rgba(255,255,255,.10);--card-pad:24px 26px;--card-bg-alt:rgba(255,255,255,.05);--card-bd-alt:rgba(255,255,255,.12);--title-weight:800;--cover-weight:800;--label-weight:700;--accent:#2f6dff}' +
      '[data-style="navy"] .slide,[data-style="navy"] .slide.dark{background-color:var(--surf-alt);background-image:radial-gradient(820px 540px at 86% 14%,rgba(47,109,255,.34) 0%,transparent 60%)}[data-style="navy"] .s-index{color:var(--accent)}' +
      '[data-style="ember"]{--surf:#fff;--on-surf:#141414;--muted:#8a8a8a;--line:rgba(20,20,20,.12);--surf-alt:#171311;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.8);--muted-alt:rgba(255,255,255,.66);--line-alt:rgba(255,255,255,.16);--font-disp:"Helvetica Neue",Arial,"Pretendard",system-ui,sans-serif;--font-num:"Anonymous Pro",ui-monospace,monospace;--rad:0px;--title-weight:800;--cover-weight:800;--label-weight:700;--accent:#ff4327}' +
      '[data-style="ember"] .slide.dark{background-color:var(--surf-alt);background-image:radial-gradient(900px 600px at 80% 30%,rgba(255,67,39,.45) 0%,transparent 60%)}[data-style="ember"] .slide.cover{background:linear-gradient(135deg,#ff4d12 0%,#e23a0f 55%,#c22e0c 100%);color:#fff}[data-style="ember"] .s-index,[data-style="ember"] .row-num,[data-style="ember"] .bignum{color:var(--accent)}' +
      '[data-accent="orange"]{--accent:#f2682a}[data-accent="emerald"]{--accent:#15b8c4}[data-accent="blue"]{--accent:#2f93e3}' +
      /* 세로 스택 레이아웃 (뷰어 대신) */
      '*{box-sizing:border-box}body{margin:0;background:#0a0a0e;font-family:var(--font-disp);-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:var(--surf);color:var(--on-surf);padding:var(--margin);word-break:keep-all;overflow-wrap:break-word;box-shadow:0 12px 40px rgba(0,0,0,.4);overflow:hidden}' +
      '.slide.dark{background:var(--surf-alt);color:var(--on-alt)}.slide.dark .s-index{color:var(--accent,var(--on-alt))}.slide.dark .row-desc,.slide.dark .muted,.slide.dark .meta-k,.slide.dark .contact-email{color:var(--muted-alt)}.slide.dark .block-list li,.slide.dark .block-p{color:var(--on-alt-soft)}.slide.dark .agenda-row{border-color:var(--line-alt)}.slide.dark .row{background:var(--card-bg-alt);border-color:var(--card-bd-alt)}' +
      '.s-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}.s-title{font-family:var(--font-disp);font-weight:var(--title-weight);font-size:72px;line-height:.98;letter-spacing:-.02em;margin:0;max-width:70%}.s-index{font-family:var(--font-num);font-size:54px;line-height:1;letter-spacing:-.02em;color:var(--accent,currentColor);white-space:nowrap;margin-top:6px}.s-body{margin-top:64px}' +
      '.rows{display:flex;flex-direction:column;gap:40px}.row{display:grid;grid-template-columns:150px 1fr 340px;gap:40px;align-items:start;background:var(--card-bg);border:1px solid var(--card-bd);border-radius:var(--rad);padding:var(--card-pad)}.row-num{font-family:var(--font-num);font-size:34px;color:var(--accent,currentColor)}.row-label{font-family:var(--font-disp);font-weight:var(--label-weight);font-size:34px;line-height:1;margin:0}.row-desc{font-weight:300;font-size:16px;line-height:1.55;color:var(--muted);margin:0}' +
      '.cols2{display:grid;grid-template-columns:1fr 1fr;gap:56px}.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}.cols2>div,.cols3>div{background:var(--card-bg);border:1px solid var(--card-bd);border-radius:var(--rad);padding:var(--card-pad)}.block-sub{font-family:var(--font-disp);font-weight:500;font-size:26px;margin:0 0 18px}.block-list{display:flex;flex-direction:column;gap:14px;margin:0;padding:0}.block-list li{list-style:none;font-weight:300;font-size:16px;line-height:1.55;color:var(--on-surf)}.block-p{font-weight:300;font-size:16px;line-height:1.6;color:var(--on-surf);margin:0;max-width:540px}' +
      '.cover{display:flex;flex-direction:column;justify-content:space-between}.cover-meta{display:flex;gap:56px}.cover-meta .spacer{margin-left:auto;text-align:right}.meta-k{font-size:13px;color:var(--muted-alt);margin:0 0 6px}.meta-v{font-size:14px;font-weight:600;color:var(--on-alt);margin:0}.cover-foot{display:flex;align-items:flex-end;justify-content:space-between}.cover-title{font-family:var(--font-disp);font-weight:var(--cover-weight);font-size:118px;line-height:.9;letter-spacing:-.02em;margin:0}.cover-arrow{width:84px;height:84px;flex:none;display:grid;place-items:center;background:#fff;color:var(--surf-alt);font-size:30px;border-radius:var(--rad)}' +
      '.agenda{display:grid;grid-template-columns:130px 1fr;gap:24px;height:100%}.agenda-title{font-family:var(--font-disp);font-weight:var(--cover-weight);font-size:64px;writing-mode:vertical-rl;transform:rotate(180deg);align-self:center}.agenda-list{display:flex;flex-direction:column;justify-content:center}.agenda-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 6px;border-top:1px solid var(--line)}.agenda-row:last-child{border-bottom:1px solid var(--line)}.agenda-label{font-family:var(--font-disp);font-weight:600;font-size:28px;margin:0}.agenda-badge{width:64px;height:64px;flex:none;display:grid;place-items:center;background:var(--accent,var(--surf-alt));color:#fff;font-family:var(--font-num);font-size:22px;border-radius:var(--rad)}' +
      '.bigstat{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}.bignum{font-family:var(--font-disp);font-weight:var(--title-weight);font-size:104px;line-height:.92;letter-spacing:-.02em;margin:0;color:var(--accent,currentColor)}.bigstat-side{display:flex;flex-direction:column;gap:44px}' +
      '.contact{display:flex;flex-direction:column;justify-content:space-between;height:100%}.contact-grid{position:absolute;top:0;right:0;width:600px;height:420px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr)}.contact-cell{display:grid;place-content:center;padding:28px}.contact-cell.fill{background:var(--surf);color:var(--on-surf)}.contact-k{font-size:13px;color:var(--muted);margin:0 0 6px}.contact-v{font-size:15px;font-weight:600;margin:0}.contact-foot{margin-top:auto}.contact-email{font-size:14px;color:var(--muted-alt);margin:0 0 14px}.contact-title{font-family:var(--font-disp);font-weight:var(--cover-weight);font-size:92px;line-height:.92;letter-spacing:-.02em;margin:0}';
  }

  function renderPptDeck(data, opts) {
    data = data || {}; opts = opts || {};
    var style = data.style || 'ax', accent = data.accent || '';
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + '</style></head><body data-style="' + esc(style) + '"' + (accent ? ' data-accent="' + esc(accent) + '"' : '') + '>' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div></body></html>';
  }

  /* ---- 스타터 덱 (결정론적 · 슬롯 채움) ---- */
  var DEFAULT_DECK = { style: 'ax', accent: 'blue', slides: [
    { type: 'cover', eyebrow: 'MIDAS AX', title: '제안 발표\n프로젝트 개요', subtitle: '핵심 메시지를 한 줄로.', meta: [{ k: 'DATE', v: '2026' }, { k: 'TEAM', v: 'AX' }] },
    { type: 'agenda', title: 'Agenda', items: ['배경과 문제', '해결 방향', '핵심 기능', '기대 효과', '다음 단계'] },
    { type: 'rows', title: '핵심 방향', index: '01', rows: [
      { num: '01', label: '문제 정의', desc: '지금 무엇이 불편한가.' },
      { num: '02', label: '해결 접근', desc: '어떻게 풀 것인가.' },
      { num: '03', label: '차별점', desc: '왜 우리가 더 낫나.' } ] },
    { type: 'bigstat', title: '기대 효과', index: '02', big: '40%', sides: [{ sub: '생산성', text: '반복 작업 자동화로 시간 절감.' }, { sub: '일관성', text: '토큰 기반으로 품질 균일.' }] },
    { type: 'closing', title: 'Thank you', sub: 'contact@midasit.com', contacts: [{ k: 'EMAIL', v: 'contact@midasit.com' }, { k: 'WEB', v: 'midasit.com' }, { k: 'TEAM', v: 'MIDAS AX' }] },
  ] };

  window.renderPptDeck = renderPptDeck;
  window.PPT_DEFAULT_DECK = DEFAULT_DECK;
  window.PPT_STYLE = { id: 'ppt', name: 'PPT', desc: '슬라이드 · 16:9 · MIDAS AX', swatch: 'linear-gradient(135deg,#0b1f3a,#2f93e3)' };
  window.PPT_STYLES = [
    { id: 'ax', name: 'MIDAS AX', swatch: 'linear-gradient(135deg,#0b1f3a,#2f93e3)' },
    { id: 'grey', name: 'Grey', swatch: 'linear-gradient(135deg,#f2f2f2,#020212)' },
    { id: 'navy', name: 'Navy Glow', swatch: 'linear-gradient(135deg,#0f1420,#2f6dff)' },
    { id: 'ember', name: 'Ember', swatch: 'linear-gradient(135deg,#171311,#ff4327)' },
  ];

  /* ---- 슬라이드 추가용: 타입 목록 + 기본 슬라이드 팩토리 (스튜디오 슬라이드 패널에서 사용) ---- */
  window.PPT_SLIDE_TYPES = [
    { type: 'cover', label: '표지' },
    { type: 'agenda', label: '목차' },
    { type: 'rows', label: '목록형' },
    { type: 'cols', label: '단 비교' },
    { type: 'bigstat', label: '핵심 수치' },
    { type: 'statement', label: '선언·메시지' },
    { type: 'divider', label: '구분·섹션' },
    { type: 'closing', label: '마무리' },
  ];
  window.PPT_TYPE_LABEL = window.PPT_SLIDE_TYPES.reduce(function (m, x) { m[x.type] = x.label; return m; }, {});
  var _SLIDE_STARTERS = {
    cover: { type: 'cover', eyebrow: '', title: '제목을 입력', subtitle: '부제목을 입력', meta: [{ k: 'DATE', v: '2026' }, { k: 'TEAM', v: '' }] },
    agenda: { type: 'agenda', title: 'Agenda', items: ['항목 1', '항목 2', '항목 3'] },
    rows: { type: 'rows', title: '제목', index: '', rows: [{ num: '01', label: '항목', desc: '설명' }, { num: '02', label: '항목', desc: '설명' }] },
    cols: { type: 'cols', title: '제목', index: '', cols: [{ sub: '소제목', items: ['내용'] }, { sub: '소제목', items: ['내용'] }] },
    bigstat: { type: 'bigstat', title: '제목', index: '', big: '00%', sides: [{ sub: '라벨', text: '설명' }, { sub: '라벨', text: '설명' }] },
    statement: { type: 'statement', title: '제목', index: '', text: '핵심 메시지를 입력하세요.', cols: [] },
    divider: { type: 'divider', title: '섹션', index: '', sub: '부연 설명' },
    closing: { type: 'closing', title: 'Thank you', sub: 'contact@example.com', contacts: [{ k: 'EMAIL', v: '' }, { k: 'WEB', v: '' }] },
  };
  window.pptNewSlide = function (type) { return JSON.parse(JSON.stringify(_SLIDE_STARTERS[type] || _SLIDE_STARTERS.rows)); };
})();
