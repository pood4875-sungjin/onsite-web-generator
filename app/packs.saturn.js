/* packs.saturn.js — Saturn 블루 팩 (웹사이트/랜딩 공용). classic <script src>.
   출처: Figma "웹 제너레이터" 38:12 "Saturn Web UI Kit" 실측 —
   Heros(38:1039)·CTA(38:1511)·Footers(38:1589)·Forms(38:1467)·Pricings(38:903)·Tables(38:455)·
   Text(38:1553)·Testimonials(38:637)·Teams(38:1295)·Blog(38:1352)·Galleries(38:990).
   팩 = 자기완결 DS. 토큰(소스 그대로): #0F62FE 프라이머리 / #1D1D1D 헤딩 / #777 본문 / #D0D5DD 보더 1.8px /
   #FCFCFC·#F9F9F9 배경, General Sans, 라운드 8(버튼·인풋만 — 카드·이미지는 0 플랫), 컨테이너 1296(=1440-72×2),
   섹션 상하 128, 블록 갭 64/48/24/16/8, 컨트롤 높이 56.
   v1 섹션 = 생성기 계약 6종(nav·hero·feature·stat·cta·footer). hero=Hero 1(중앙 타이포+CTA 2+하단 이미지),
   nav=Navbar 3(중앙 메뉴), cta=CTA 1, footer=Footer 1. feature·stat은 킷에 전용 프레임이 없어
   킷의 타입 램프·아이콘 시트(38:5403)·컬러만으로 유도(새 값 발명 없음). */
(function () {
  var includesTier = window.includesTier || function (v, t) { var V = { compact: 0, mid: 1, heavy: 2 }, T = { core: 0, mid: 1, rich: 2 }; return T[t] <= V[v]; };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }

  /* ---- 파운데이션 (소스 스타일명 그대로) ---- */
  var VARS = {
    '--brand': '#0F62FE',          // Primary Element / CTA Enabled
    '--brand-hover': '#0052EB',    // CTA Hovered
    '--brand-weak': '#CFE0FF',     // Primary Element 20%
    '--ink': '#1D1D1D',            // Headings
    '--body': '#777777',           // Body Text
    '--soft': '#A0A0A0',           // Body Text Off
    '--line': '#D0D5DD',           // Contorns
    '--bg': '#FCFCFC',             // Primary BG / Elements White
    '--bg-2': '#F9F9F9',           // Secondary BG
    '--ok': '#009C10',             // Chip Success
    '--bw': '1.8px',               // 보더 두께 전역
    '--r': '8px',                  // 라운드 — 버튼·인풋·칩만(카드·이미지 0)
    '--ctl': '56px',               // 컨트롤 높이(버튼·인풋)
    '--font': '"General Sans","Pretendard Variable",Pretendard,-apple-system,system-ui,sans-serif',
    /* 타입 램프 (Semibold=600 헤딩 / Medium=500 본문) */
    '--fs-h64': '64px', '--fs-h56': '56px', '--fs-h48': '48px', '--fs-h40': '40px', '--fs-h32': '32px', '--fs-h24': '24px',
    '--fs-body': '22px', '--fs-sm': '18px', '--fs-xs': '14px',
  };
  function foundationCss() {
    return ':root{\n' + Object.keys(VARS).map(function (k) { return '  ' + k + ':' + VARS[k] + ';'; }).join('\n') + '\n}';
  }

  var layout = { container: '1296px', breakpoints: { md: 768, lg: 1080 } };

  function layoutCss() {
    return [
      '.sat{font-family:var(--font);color:var(--ink);background:var(--bg);line-height:1.5;-webkit-font-smoothing:antialiased}',
      '.sat *{box-sizing:border-box}',
      '.sat .wrap{max-width:' + layout.container + ';margin:0 auto;padding:0 72px}',
      '.sat .band{padding:128px 0}',
      '.sat .band--alt{background:var(--bg-2)}',
      '.sat h1,.sat h2,.sat h3{margin:0;color:var(--ink);letter-spacing:0}',
      '.sat p{margin:0}',
      '.sat a{color:inherit;text-decoration:none}',
      /* 컨트롤 — 소스: 높이 56, 패딩 32×12, 라운드 8, 텍스트 18/32 Semibold */
      '.sat .btn{display:inline-flex;align-items:center;justify-content:center;height:var(--ctl);padding:12px 32px;border-radius:var(--r);font-family:inherit;font-size:18px;line-height:32px;font-weight:600;cursor:pointer;border:none;white-space:nowrap}',
      '.sat .btn--pri{background:var(--brand);color:var(--bg)}.sat .btn--pri:hover{background:var(--brand-hover)}',
      '.sat .btn--out{background:transparent;color:var(--ink);border:var(--bw) solid var(--line)}',
      '.sat .btn--txt{background:none;border:none;color:var(--ink);padding:12px 16px}',
      '.sat .eyebrow{font-size:18px;line-height:24px;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--brand)}',
      '@media (max-width:' + (layout.breakpoints.lg - 1) + 'px){.sat .wrap{padding:0 32px}.sat .band{padding:88px 0}}',
      '@media (max-width:' + (layout.breakpoints.md - 1) + 'px){.sat .wrap{padding:0 20px}.sat .band{padding:64px 0}.sat .cols3,.sat .cols2{grid-template-columns:1fr!important}}',
    ].join('\n');
  }

  /* ---- 모션 — 순수 CSS 엔트런스(스크립트 제거된 새창 미리보기에서도 생존). static=off ---- */
  function motion(level) {
    if (level === 'static') return { css: '', js: '' };
    var d = level === 'rich' ? '26px' : '16px';
    return {
      css: [
        '.sat .up{opacity:0;transform:translateY(' + d + ');animation:satUp .7s cubic-bezier(.22,1,.36,1) both}',
        '.sat .up.d1{animation-delay:.08s}.sat .up.d2{animation-delay:.16s}.sat .up.d3{animation-delay:.24s}',
        '@keyframes satUp{to{opacity:1;transform:none}}',
        '@media (prefers-reduced-motion:reduce){.sat .up{animation:none;opacity:1;transform:none}}',
      ].join('\n'), js: '',
    };
  }

  /* ---- 아이콘 (Navigation 시트 38:5403 계열 — 24px 스트로크) ---- */
  function icon(p, sz) { return '<svg viewBox="0 0 24 24" width="' + (sz || 24) + '" height="' + (sz || 24) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var IC = {
    spark: '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    shield: '<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z"/>',
  };
  var FEAT_ICONS = [IC.bolt, IC.layers, IC.shield];

  /* ---- 섹션 렌더러 — 편집 훅(data-edit)은 생성기 공용 계약 경로 ---- */
  var sections = {
    /* Navbar 3 (38:1050 내장): 로고 좌 — 메뉴 중앙 — Login/Sign up 우. 높이 104(패딩 24) */
    nav: function (c, ctx) {
      var d = ctx.data;
      var menu = (d.nav && d.nav.length ? d.nav.map(function (it) { return '<a data-nav-page="' + (it.id || '') + '"' + (it.active ? ' class="on"' : '') + '>' + esc(it.name) + '</a>'; })
        : ['기능', '가격', '고객사례', '문의'].map(function (m) { return '<a>' + m + '</a>'; })).join('');
      return '<header class="s-nav"><div class="wrap s-nav-in">' +
        '<span class="s-logo"><i>' + icon(IC.spark, 20) + '</i><b' + de('productName') + '>' + esc(d.productName || '제품명') + '</b></span>' +
        '<nav class="s-menu">' + menu + '</nav>' +
        '<span class="s-nav-r"><button class="btn btn--txt">Login</button>' +
        '<button class="btn btn--pri"' + de('primaryCta') + '>' + esc(d.primaryCta || '시작하기') + '</button></span>' +
        '</div></header>';
    },
    /* Hero 1 (38:1050): 중앙 타이포(64/72, 폭 842) → 부제(22/32, #777) → CTA 2 → 풀폭 이미지 1296×640 */
    hero: function (c, ctx) {
      var d = ctx.data;
      var img = (d.images && d.images.hero)
        ? '<img class="s-hero-img up d3" src="' + esc(d.images.hero) + '" alt="" data-img="hero">'
        : '<div class="s-hero-img ph up d3" data-img="hero"><span>PRODUCT SCREENSHOT</span></div>';
      return '<section class="s-hero"><div class="wrap">' +
        '<h1 class="s-hero-t up"' + de('tagline') + '>' + esc(d.tagline || '더 나은 제품의 시작') + '</h1>' +
        '<p class="s-hero-s up d1"' + de('subcopy') + '>' + esc(d.subcopy || '한 줄 설명이 들어갑니다.') + '</p>' +
        '<div class="s-hero-cta up d2">' +
        '<button class="btn btn--pri"' + de('primaryCta') + '>' + esc(d.primaryCta || '무료로 시작하기') + '</button>' +
        '<button class="btn btn--out"' + de('secondaryCta') + '>' + esc(d.secondaryCta || '더 알아보기') + '</button></div>' +
        img + '</div></section>';
    },
    /* 기능 3열 — 킷 타입 램프(24/32 SB + 18/24 M)·아이콘 시트·Primary 20% 원형으로 구성. 카드 라운드 0 플랫 기조 */
    feature: function (c, ctx) {
      var d = ctx.data;
      var items = (d.features && d.features.length ? d.features : [{ title: '기능', desc: '설명' }, { title: '기능', desc: '설명' }, { title: '기능', desc: '설명' }]);
      var cells = items.map(function (f, i) {
        return '<div class="s-feat up d' + Math.min(i + 1, 3) + '"><span class="s-fic">' + icon(FEAT_ICONS[i % FEAT_ICONS.length]) + '</span>' +
          '<h3' + de('features.' + i + '.title') + '>' + esc(f.title || '') + '</h3>' +
          '<p' + de('features.' + i + '.desc') + '>' + esc(f.desc || '') + '</p></div>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        '<p class="eyebrow up"' + de('featureEyebrow') + '>' + esc(d.featureEyebrow || 'FEATURES') + '</p>' +
        '<h2 class="s-h2 up d1"' + de('featureTitle') + '>' + esc(d.featureTitle || '핵심 기능') + '</h2>' +
        '<div class="s-grid cols3">' + cells + '</div></div></section>';
    },
    /* 지표 — 48/56 SB 블루 수치 + 18/24 라벨 (킷 프라이싱 가격 타이포에서 유도) */
    stat: function (c, ctx) {
      var d = ctx.data;
      var items = (d.stats && d.stats.length ? d.stats : [{ value: '00', label: '지표' }]);
      var cells = items.map(function (s, i) {
        return '<div class="s-stat up d' + Math.min(i + 1, 3) + '"><b' + de('stats.' + i + '.value') + '>' + esc(s.value || '') + '</b>' +
          '<span' + de('stats.' + i + '.label') + '>' + esc(s.label || '') + '</span></div>';
      }).join('');
      return '<section class="band band--alt"><div class="wrap"><div class="s-grid cols3 s-stats">' + cells + '</div></div></section>';
    },
    /* CTA 1 (38:1522): 센터 — ATTENTION 아이라인 + 56/64 헤딩 + 본문(842) + 버튼 1. 블록 갭 48/24 */
    cta: function (c, ctx) {
      var d = ctx.data;
      return '<section class="band"><div class="wrap s-cta">' +
        '<p class="eyebrow up">GET STARTED</p>' +
        '<h2 class="s-h2 up d1"' + de('bannerText') + '>' + esc(d.bannerText || '지금 시작해보세요') + '</h2>' +
        '<p class="s-cta-s up d2"' + de('subcopy') + '>' + esc(d.subcopy || '') + '</p>' +
        '<div class="up d3"><button class="btn btn--pri"' + de('bannerCta') + '>' + esc(d.bannerCta || d.primaryCta || '시작하기') + '</button></div>' +
        '</div></section>';
    },
    /* Footer 1 (38:1600): 로고 컬럼(389) + 링크 3컬럼 + 저작권. py 64, 링크 18/24 SB #777 */
    footer: function (c, ctx) {
      var d = ctx.data;
      var links = (d.footerLinks && d.footerLinks.length ? d.footerLinks : ['이용약관', '개인정보처리방침', '고객센터']);
      var col = function (h, ls, base) {
        return '<div class="s-fcol"><b>' + h + '</b>' + ls.map(function (l, i) { return '<a' + de(base ? base + '.' + (i) : '') + '>' + esc(l) + '</a>'; }).join('') + '</div>';
      };
      return '<footer class="s-foot"><div class="wrap">' +
        '<div class="s-foot-top">' +
        '<span class="s-logo"><i>' + icon(IC.spark, 20) + '</i><b' + de('productName') + '>' + esc(d.productName || '제품명') + '</b></span>' +
        col('NAVIGATION', links, 'footerLinks') +
        col('PRODUCT', ['기능', '가격', '업데이트']) +
        col('COMPANY', ['소개', '블로그', '채용']) +
        '</div>' +
        '<p class="s-copy"' + de('footerCopyright') + '>' + esc(d.footerCopyright || ('© ' + (d.productName || '') + '. All rights reserved')) + '</p>' +
        '</div></footer>';
    },
  };

  function sectionsCss() {
    return [
      /* nav */
      '.sat .s-nav{background:var(--bg);border-bottom:var(--bw) solid var(--line)}',
      '.sat .s-nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:24px;padding-bottom:24px}',
      '.sat .s-logo{display:inline-flex;align-items:center;gap:8px}',
      '.sat .s-logo i{display:grid;place-items:center;width:32px;height:32px;border-radius:var(--r);background:var(--brand);color:var(--bg)}',
      '.sat .s-logo b{font-size:24px;line-height:32px;font-weight:500}',
      '.sat .s-menu{display:flex;gap:8px}',
      '.sat .s-menu a{padding:12px 16px;font-size:18px;line-height:24px;font-weight:500;color:var(--body);cursor:pointer}',
      '.sat .s-menu a.on,.sat .s-menu a:hover{color:var(--ink)}',
      '.sat .s-nav-r{display:inline-flex;align-items:center;gap:16px}',
      /* hero — 수직 리듬: 내비 128 아래 제목 → 24 부제 → 48 CTA → 128 이미지 */
      '.sat .s-hero{padding:128px 0;text-align:center}',
      '.sat .s-hero-t{font-size:var(--fs-h64);line-height:72px;font-weight:600;max-width:842px;margin:0 auto}',
      '.sat .s-hero-s{font-size:var(--fs-body);line-height:32px;font-weight:500;color:var(--body);max-width:843px;margin:24px auto 0}',
      '.sat .s-hero-cta{display:flex;gap:16px;justify-content:center;margin-top:48px}',
      '.sat .s-hero-img{width:100%;height:640px;margin-top:128px;object-fit:cover;display:block}',
      '.sat .s-hero-img.ph{background:var(--bg-2);border:var(--bw) solid var(--line);display:grid;place-items:center}',
      '.sat .s-hero-img.ph span{font-size:14px;letter-spacing:.08em;color:var(--soft)}',
      /* 공통 헤딩 */
      '.sat .s-h2{font-size:var(--fs-h56);line-height:64px;font-weight:600;margin-top:24px;max-width:842px}',
      '.sat .s-grid{display:grid;gap:64px;margin-top:64px}',
      '.sat .cols3{grid-template-columns:repeat(3,1fr)}.sat .cols2{grid-template-columns:repeat(2,1fr)}',
      /* feature */
      '.sat .s-fic{display:grid;place-items:center;width:56px;height:56px;border-radius:var(--r);background:var(--brand-weak);color:var(--brand)}',
      '.sat .s-feat h3{font-size:var(--fs-h24);line-height:32px;font-weight:600;margin-top:24px}',
      '.sat .s-feat p{font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body);margin-top:8px}',
      /* stat */
      '.sat .s-stats{margin-top:0;text-align:center}',
      '.sat .s-stat b{display:block;font-size:var(--fs-h48);line-height:56px;font-weight:600;color:var(--brand)}',
      '.sat .s-stat span{display:block;margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* cta */
      '.sat .s-cta{text-align:center;display:flex;flex-direction:column;align-items:center}',
      '.sat .s-cta .s-h2{margin-left:auto;margin-right:auto}',
      '.sat .s-cta-s{font-size:var(--fs-body);line-height:32px;font-weight:500;color:var(--body);max-width:842px;margin-top:24px}',
      '.sat .s-cta .btn{margin-top:48px}',
      /* footer */
      '.sat .s-foot{background:var(--bg);border-top:var(--bw) solid var(--line);padding:64px 0}',
      '.sat .s-foot-top{display:grid;grid-template-columns:389px 1fr 1fr 1fr;gap:64px}',
      '.sat .s-fcol{display:flex;flex-direction:column;gap:24px}',
      '.sat .s-fcol b{font-size:18px;line-height:24px;font-weight:600;text-transform:uppercase;letter-spacing:.02em}',
      '.sat .s-fcol a{font-size:18px;line-height:24px;font-weight:600;color:var(--body);cursor:pointer}',
      '.sat .s-copy{margin-top:64px;font-size:18px;line-height:24px;font-weight:500;color:var(--body)}',
      '@media (max-width:' + (layout.breakpoints.lg - 1) + 'px){.sat .s-hero-t{font-size:44px;line-height:1.2}.sat .s-h2{font-size:36px;line-height:1.2}.sat .s-hero-img{height:auto;min-height:320px;margin-top:64px}.sat .s-menu{display:none}.sat .s-foot-top{grid-template-columns:1fr 1fr;gap:40px}}',
    ].join('\n');
  }

  var saturnPack = {
    meta: { id: 'saturn', name: 'Saturn 블루', desc: '라이트 · 클린 블루 · General Sans', source: 'Figma 38:12 Saturn Web UI Kit' },
    foundation: VARS, layout: layout, motion: motion, components: {}, sections: sections,
    rootClass: 'sat',
    globalCss: function () {
      return [
        '@import url("https://api.fontshare.com/v2/css?f[]=general-sans@500,600&display=swap");',
        '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");',
        foundationCss(), 'body{margin:0;background:var(--bg)}', layoutCss(), sectionsCss(),
      ].join('\n');
    },
  };

  /* ---- 조립 (krds와 동일 계약 — 얇은 인라인 사본) ---- */
  function buildDoc(tpl, content, shared) {
    return { meta: {}, sharedFacts: shared, sections: tpl.map(function (s) { return { type: s.type, slotValues: content[s.type] || {} }; }) };
  }
  function renderPage(doc, opts) {
    var data = Object.assign({}, doc.sharedFacts || {});
    var ctx = { f: VARS, layout: layout, motion: opts.motion, components: {}, data: data, esc: esc };
    var body = doc.sections.map(function (s) {
      var r = sections[s.type]; if (!r) return '';
      try { return '<div data-section="' + esc(s.type) + '">' + r(s.slotValues || {}, ctx) + '</div>'; } catch (e) { return ''; }
    }).join('\n');
    var mo = motion(opts.motion || 'subtle');
    return '<!doctype html><html lang="ko" data-pack="saturn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' + esc(data.productName || '제품') + '</title><style>' + saturnPack.globalCss() + '\n' + (mo.css || '') + '</style></head>' +
      '<body><div class="sat">' + body + '</div></body></html>';
  }

  var TEMPLATE = [
    { type: 'nav', tier: 'core' }, { type: 'hero', tier: 'core' }, { type: 'feature', tier: 'core' },
    { type: 'stat', tier: 'mid' }, { type: 'cta', tier: 'rich' }, { type: 'footer', tier: 'core' },
  ];

  window.SATURN_PACK = saturnPack;
  window.SATURN_STYLE = { id: 'saturn', name: 'Saturn 블루', desc: '라이트 · 클린 블루 · 플랫', swatch: 'linear-gradient(135deg,#0F62FE,#CFE0FF)' };
  window.SATURN_SECTION_SPEC = { template: TEMPLATE, fixed: ['nav', 'footer'], labels: { hero: '히어로', feature: '기능', stat: '지표', cta: 'CTA' } };
  window.renderSaturnPage = function (shared, opts) {
    opts = opts || {}; shared = shared || {}; var content = {};
    // 섹션 가시성/순서 계약 (checklist §5) — nav/footer 고정
    var vol = opts.volume || 'heavy';
    var head = TEMPLATE.filter(function (s) { return s.type === 'nav'; });
    var foot = TEMPLATE.filter(function (s) { return s.type === 'footer'; });
    var bodyTpl = TEMPLATE.filter(function (s) { return s.type !== 'nav' && s.type !== 'footer'; });
    var hidden = shared.hiddenSections || [], shown = shared.shownSections || [];
    var vis = bodyTpl.filter(function (s) { var def = includesTier(vol, s.tier); return def ? hidden.indexOf(s.type) < 0 : shown.indexOf(s.type) >= 0; });
    var order = shared.sectionOrder || [];
    if (order.length) { var by = {}; vis.forEach(function (s) { by[s.type] = s; }); var ord = []; order.forEach(function (t) { if (by[t]) ord.push(by[t]); }); vis.forEach(function (s) { if (order.indexOf(s.type) < 0) ord.push(s); }); vis = ord; }
    return renderPage(buildDoc(head.concat(vis, foot), content, shared), { motion: opts.motion || 'subtle' });
  };
})();
