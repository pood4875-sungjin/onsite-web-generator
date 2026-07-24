/* packs.edm.js — eDM(이메일 디자인) 렌더러. classic <script src>.
   웹페이지 팩(midas/krds/darkglow)과 성격이 다름:
   - 760px 단일 컬럼, 테이블 기반(이메일 클라이언트 호환), 인라인 친화 CSS.
   - 페이지 data 형태: { sections:[{type, ...content}], theme? }.
   - window.renderEdmPage(data, opts) → 자가완결 HTML 1파일.

   ⚠ 토큰값(색·간격·타이포)은 PROVISIONAL. Figma(file jAUrIhfb6Kiw1BpRfKlFx8) 열리면
   섹션별 실측으로 교정. 각 섹션 렌더러 상단에 대응 Figma 컴포넌트명 표기.
   충실도 규칙: 아직 실측 안 한 값은 지어낸 base일 뿐 — "그대로" 아님. */
(function () {
  var esc = window.esc || function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---- eDM 디자인 토큰 (PROVISIONAL — Figma 교정 대상) ---- */
  var T = {
    w: 760,                 // eDM 폭 (Figma 프레임 폭)
    ink: '#17181A',         // 본문 텍스트
    sub: '#5B6066',         // 보조 텍스트
    line: '#E4E7EC',        // 구분선
    bg: '#FFFFFF',          // 카드 배경
    canvas: '#F2F4F7',      // 바깥 배경
    brand: '#6D3BF5',       // 포인트(플랫폼 primary 계열)
    brandInk: '#FFFFFF',
    soft: '#F5F3FF',        // 브랜드 옅은 배경
    radius: 16,
    font: "-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',Roboto,'Helvetica Neue',Arial,sans-serif",
  };

  function px(n) { return n + 'px'; }
  function esc0(v) { return esc(v == null ? '' : v); }

  /* 공용 헬퍼 --------------------------------------------------- */
  function btn(label, href, opt) {
    opt = opt || {};
    var bg = opt.ghost ? 'transparent' : T.brand;
    var fg = opt.ghost ? T.brand : T.brandInk;
    var bd = opt.ghost ? ('1px solid ' + T.brand) : '1px solid ' + T.brand;
    return '<a href="' + esc0(href || '#') + '" class="edm-btn" style="display:inline-block;background:' + bg + ';color:' + fg +
      ';border:' + bd + ';border-radius:10px;padding:14px 28px;font-weight:700;font-size:15px;text-decoration:none;line-height:1;">' +
      esc0(label) + '</a>';
  }
  function pad(inner, p) { return '<div style="padding:' + (p || '40px 48px') + '">' + inner + '</div>'; }
  function eyebrow(t) { return t ? '<div style="font-size:12px;font-weight:700;letter-spacing:.08em;color:' + T.brand + ';text-transform:uppercase;margin-bottom:12px">' + esc0(t) + '</div>' : ''; }
  function h(t, size) { return '<div data-edit style="font-size:' + (size || 26) + 'px;font-weight:800;line-height:1.32;color:' + T.ink + ';margin:0 0 12px;white-space:pre-line">' + esc0(t) + '</div>'; }
  function p(t) { return t ? '<div data-edit style="font-size:15px;line-height:1.7;color:' + T.sub + ';margin:0;white-space:pre-line">' + esc0(t) + '</div>' : ''; }

  /* ---- 섹션 레지스트리 ---------------------------------------
     Figma 컴포넌트 대응: hero=Hero_edm, overview=Overview_edm(01~08),
     promotion=Promotion_eDM(01~09), step=Step_eDM, contact=Contact_eDM(01~03),
     btn=BTN_eDM, strip=Strip Banner, notice=Notice_eDM, event=Event_eDM,
     speakers=Speakers_eDM, agenda=Agenda_eDM, table=Table_eDM, location=Location_eDM. */
  var S = {};

  // Hero_edm ------------------------------------------------------
  S.hero = function (c) {
    var img = c.image ? '<img src="' + esc0(c.image) + '" data-img="hero" alt="" style="display:block;width:100%;height:auto;border:0">' : '';
    return '<tr><td style="background:' + (c.bg || T.brand) + ';color:#fff">' +
      img +
      '<div style="padding:44px 48px">' +
      (c.eyebrow ? '<div style="font-size:12px;font-weight:700;letter-spacing:.08em;opacity:.85;margin-bottom:12px">' + esc0(c.eyebrow) + '</div>' : '') +
      '<div data-edit style="font-size:30px;font-weight:800;line-height:1.3;margin:0 0 12px;white-space:pre-line">' + esc0(c.title) + '</div>' +
      (c.subcopy ? '<div data-edit style="font-size:15px;line-height:1.7;opacity:.9;white-space:pre-line">' + esc0(c.subcopy) + '</div>' : '') +
      (c.cta ? '<div style="margin-top:24px">' + btn(c.cta, c.ctaHref, { ghost: false }) + '</div>' : '') +
      '</div></td></tr>';
  };

  // Overview_edm (01~08) — 제목+본문(+이미지) 정보 블록 --------
  S.overview = function (c) {
    var img = c.image ? '<img src="' + esc0(c.image) + '" alt="" style="display:block;width:100%;height:auto;border-radius:12px;margin:20px 0 0;border:0">' : '';
    var imgTop = (c.imagePos === 'top' && c.image) ? '<img src="' + esc0(c.image) + '" alt="" style="display:block;width:100%;height:auto;border-radius:12px;margin:0 0 20px;border:0">' : '';
    return '<tr><td>' + pad(imgTop + eyebrow(c.eyebrow) + h(c.title) + p(c.body) + (c.imagePos === 'top' ? '' : img)) + '</td></tr>';
  };

  // Promotion_eDM (01~09) — 혜택/카드 그리드 --------------------
  S.promotion = function (c) {
    var items = (c.items || []).map(function (it) {
      return '<td style="width:33.33%;vertical-align:top;padding:0 8px">' +
        '<div style="background:' + T.soft + ';border-radius:12px;padding:22px 20px;height:100%">' +
        (it.value ? '<div data-edit style="font-size:24px;font-weight:800;color:' + T.brand + ';margin-bottom:6px">' + esc0(it.value) + '</div>' : '') +
        '<div data-edit style="font-size:15px;font-weight:700;color:' + T.ink + ';margin-bottom:4px">' + esc0(it.title) + '</div>' +
        (it.desc ? '<div data-edit style="font-size:13px;line-height:1.6;color:' + T.sub + '">' + esc0(it.desc) + '</div>' : '') +
        '</div></td>';
    }).join('');
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) + p(c.body) +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-collapse:separate;border-spacing:8px 0"><tr>' + items + '</tr></table>') + '</td></tr>';
  };

  // Step_eDM — 번호 단계 리스트 --------------------------------
  S.step = function (c) {
    var rows = (c.steps || []).map(function (st, i) {
      return '<tr><td style="width:44px;vertical-align:top;padding:0 0 20px">' +
        '<div style="width:32px;height:32px;border-radius:50%;background:' + T.brand + ';color:#fff;font-weight:800;font-size:14px;text-align:center;line-height:32px">' + (i + 1) + '</div></td>' +
        '<td style="vertical-align:top;padding:0 0 20px 12px">' +
        '<div data-edit style="font-size:16px;font-weight:700;color:' + T.ink + ';margin-bottom:4px">' + esc0(st.title) + '</div>' +
        (st.desc ? '<div data-edit style="font-size:14px;line-height:1.6;color:' + T.sub + '">' + esc0(st.desc) + '</div>' : '') +
        '</td></tr>';
    }).join('');
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">' + rows + '</table>') + '</td></tr>';
  };

  // BTN_eDM — CTA 블록 -----------------------------------------
  S.btn = function (c) {
    return '<tr><td style="text-align:center">' + pad((c.title ? h(c.title, 22) : '') + p(c.body) +
      '<div style="margin-top:' + (c.title || c.body ? '20px' : '0') + '">' + btn(c.label || '자세히 보기', c.href) + '</div>', '36px 48px') + '</td></tr>';
  };

  // Strip Banner — 얇은 강조 띠 --------------------------------
  S.strip = function (c) {
    return '<tr><td style="background:' + (c.bg || T.ink) + ';color:#fff;text-align:center">' +
      '<div style="padding:20px 48px;font-size:15px;font-weight:700">' + esc0(c.text) +
      (c.cta ? ' &nbsp;<a href="' + esc0(c.href || '#') + '" style="color:#fff;text-decoration:underline">' + esc0(c.cta) + '</a>' : '') +
      '</div></td></tr>';
  };

  // Notice_eDM — 안내/유의사항 -------------------------------
  S.notice = function (c) {
    var lis = (c.items || []).map(function (t) { return '<li data-edit style="font-size:13px;line-height:1.7;color:' + T.sub + '">' + esc0(t) + '</li>'; }).join('');
    return '<tr><td>' + pad('<div style="background:' + T.canvas + ';border-radius:12px;padding:22px 24px">' +
      (c.title ? '<div style="font-size:14px;font-weight:700;color:' + T.ink + ';margin-bottom:10px">' + esc0(c.title) + '</div>' : '') +
      '<ul style="margin:0;padding-left:18px">' + lis + '</ul></div>') + '</td></tr>';
  };

  // Contact_eDM (01~03) — 문의/푸터 ---------------------------
  S.contact = function (c) {
    var links = (c.links || []).map(function (l) { return '<a href="#" style="color:' + T.sub + ';text-decoration:none;font-size:13px;margin:0 8px">' + esc0(l) + '</a>'; }).join('<span style="color:' + T.line + '">|</span>');
    return '<tr><td style="background:' + T.canvas + '">' + pad(
      (c.brand ? '<div style="font-size:16px;font-weight:800;color:' + T.ink + ';margin-bottom:8px">' + esc0(c.brand) + '</div>' : '') +
      (c.body ? '<div style="font-size:13px;line-height:1.7;color:' + T.sub + '">' + esc0(c.body) + '</div>' : '') +
      (links ? '<div style="margin-top:14px">' + links + '</div>' : '') +
      (c.copyright ? '<div style="margin-top:16px;font-size:12px;color:' + T.sub + '">' + esc0(c.copyright) + '</div>' : ''), '32px 48px') + '</td></tr>';
  };

  // Event_eDM — 일시·장소 요약 카드 ---------------------------
  S.event = function (c) {
    var rows = (c.rows || []).map(function (r) {
      return '<tr><td style="width:88px;vertical-align:top;padding:8px 0;font-size:13px;font-weight:700;color:' + T.brand + '">' + esc0(r.k) + '</td>' +
        '<td style="vertical-align:top;padding:8px 0;font-size:14px;color:' + T.ink + '" data-edit>' + esc0(r.v) + '</td></tr>';
    }).join('');
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border-top:1px solid ' + T.line + '">' + rows + '</table>') + '</td></tr>';
  };

  // Speakers_eDM — 연사 그리드 --------------------------------
  S.speakers = function (c) {
    var items = (c.people || []).map(function (pn) {
      return '<td style="width:50%;vertical-align:top;padding:8px">' +
        '<div style="background:' + T.canvas + ';border-radius:12px;padding:18px;text-align:center">' +
        (pn.image ? '<img src="' + esc0(pn.image) + '" alt="" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:0;margin:0 auto 10px;display:block">' : '') +
        '<div data-edit style="font-size:15px;font-weight:700;color:' + T.ink + '">' + esc0(pn.name) + '</div>' +
        (pn.role ? '<div data-edit style="font-size:12px;color:' + T.sub + ';margin-top:2px">' + esc0(pn.role) + '</div>' : '') +
        '</div></td>';
    });
    var rows = '';
    for (var i = 0; i < items.length; i += 2) rows += '<tr>' + items[i] + (items[i + 1] || '<td style="width:50%"></td>') + '</tr>';
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-collapse:separate;border-spacing:8px">' + rows + '</table>') + '</td></tr>';
  };

  // Agenda_eDM — 시간표 ---------------------------------------
  S.agenda = function (c) {
    var rows = (c.rows || []).map(function (r) {
      return '<tr><td style="width:110px;vertical-align:top;padding:12px 0;border-bottom:1px solid ' + T.line + ';font-size:13px;font-weight:700;color:' + T.brand + '">' + esc0(r.time) + '</td>' +
        '<td style="vertical-align:top;padding:12px 0;border-bottom:1px solid ' + T.line + ';font-size:14px;color:' + T.ink + '" data-edit>' + esc0(r.title) + (r.desc ? '<div style="font-size:12px;color:' + T.sub + ';margin-top:2px">' + esc0(r.desc) + '</div>' : '') + '</td></tr>';
    }).join('');
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">' + rows + '</table>') + '</td></tr>';
  };

  // Table_eDM — 비교/스펙 표 ----------------------------------
  S.table = function (c) {
    var head = (c.head || []).map(function (t) { return '<th style="text-align:left;padding:12px 14px;background:' + T.soft + ';font-size:13px;font-weight:800;color:' + T.ink + '">' + esc0(t) + '</th>'; }).join('');
    var body = (c.rows || []).map(function (r) {
      return '<tr>' + r.map(function (cell, i) { return '<td style="padding:12px 14px;border-bottom:1px solid ' + T.line + ';font-size:13px;color:' + (i === 0 ? T.ink : T.sub) + (i === 0 ? ';font-weight:700' : '') + '" data-edit>' + esc0(cell) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border:1px solid ' + T.line + ';border-radius:12px;overflow:hidden"><tr>' + head + '</tr>' + body + '</table>') + '</td></tr>';
  };

  // Location_eDM — 오시는 길 ----------------------------------
  S.location = function (c) {
    return '<tr><td>' + pad(eyebrow(c.eyebrow) + h(c.title) +
      (c.map ? '<img src="' + esc0(c.map) + '" alt="" style="display:block;width:100%;height:auto;border-radius:12px;margin:0 0 14px;border:0">' : '') +
      (c.address ? '<div data-edit style="font-size:14px;color:' + T.ink + ';font-weight:600">' + esc0(c.address) + '</div>' : '') +
      (c.detail ? '<div data-edit style="font-size:13px;color:' + T.sub + ';margin-top:4px;white-space:pre-line">' + esc0(c.detail) + '</div>' : '')) + '</td></tr>';
  };

  // raw — Figma 실측 프래그먼트 그대로 통과(그대로 구현용). c.html = <tr>...</tr> 또는 콘텐츠.
  S.raw = function (c) { return c.html || ''; };

  /* ---- 조립 -------------------------------------------------- */
  function renderEdmPage(data, opts) {
    data = data || {}; opts = opts || {};
    var body = (data.sections || []).map(function (sec) {
      var fn = S[sec.type];
      if (!fn) { console.warn('[edm] no section:', sec.type); return ''; }
      // 유효 HTML: table 직계 자식은 tbody. 각 섹션 = 하나의 tbody.
      try { return '<tbody data-section="' + esc0(sec.type) + '">' + fn(sec) + '</tbody>'; }
      catch (e) { console.error('[edm] section failed', sec.type, e); return ''; }
    }).join('');

    // bare = 엣지-투-엣지 플랫(그대로 구현 템플릿용): 라운드/보더/캔버스 패딩 제거
    var bare = !!data.bare;
    var shellStyle = 'width:' + T.w + 'px;max-width:100%;background:' + T.bg +
      (bare ? '' : ';border-radius:' + T.radius + 'px;overflow:hidden;border:1px solid ' + T.line + '');
    var outerPad = bare ? '0' : '24px 0';

    return '<!doctype html><html lang="ko"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css">' +
      '<style>@font-face{font-family:\'Gmarket Sans\';font-weight:700;src:url(https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff) format(\'woff\')}' +
      'body{margin:0;background:' + (bare ? T.bg : T.canvas) + ';font-family:' + T.font + '} .edm-btn:hover{opacity:.92} img{max-width:100%} table{border-collapse:collapse}' +
      '@media (max-width:620px){.edm-shell{width:100%!important}}</style></head>' +
      '<body><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + (bare ? T.bg : T.canvas) + '"><tr><td align="center" style="padding:' + outerPad + '">' +
      '<table role="presentation" class="edm-shell" width="' + T.w + '" cellpadding="0" cellspacing="0" style="' + shellStyle + '">' +
      body +
      '</table></td></tr></table></body></html>';
  }

  window.renderEdmPage = renderEdmPage;
  window.EDM_SECTIONS = S;
  window.EDM_TOKENS = T;
})();
