/* packs.saturn.js — Saturn 블루 팩 (웹사이트/랜딩 공용). classic <script src>.
   출처: Figma "웹 제너레이터" 38:12 "Saturn Web UI Kit" 실측 —
   Heros(38:1039)·CTA(38:1511)·Footers(38:1589)·Forms(38:1467)·Pricings(38:903)·Tables(38:455)·
   Text(38:1553)·Testimonials(38:637)·Teams(38:1295)·Blog(38:1352)·Galleries(38:990).
   팩 = 자기완결 DS. 토큰(소스 그대로): #0F62FE 프라이머리 / #1D1D1D 헤딩 / #777 본문 / #D0D5DD 보더 1.8px /
   #FCFCFC·#F9F9F9 배경, General Sans, 라운드 8(버튼·인풋만 — 카드·이미지는 0 플랫), 컨테이너 1296(=1440-72×2),
   섹션 상하 128, 블록 갭 64/48/24/16/8, 컨트롤 높이 56.
   v1 섹션 = 생성기 계약 6종(nav·hero·feature·stat·cta·footer). hero=Hero 1(중앙 타이포+CTA 2+하단 이미지),
   nav=Navbar 3(중앙 메뉴), cta=CTA 1, footer=Footer 1. feature·stat은 킷에 전용 프레임이 없어
   킷의 타입 램프·아이콘 시트(38:5403)·컬러만으로 유도(새 값 발명 없음).
   v2 = pagetypes.js(PAGE_TYPES) 공용 어휘 렌더러 확장: pagehero·overview·intro·featurerows·gallery·
   compare·faq·testimonial(킷 Testimonial 5 — 블루 카드)·pricing(킷 Pricing — #F9F9F9 카드, 추천=버튼만 채움)·
   form(킷 Forms — 인풋 56 #F9F9F9, 제출 비활성)·infocards·doclist·steps·bloglist(킷 Blog 3 — 칩 라운드 32)·
   agenda·speakers·notice. 별칭: stats→stat, showcase→gallery, quote→testimonial, metrics→stat, banner→cta.
   renderSaturnPage: data.pageType + window.PAGE_TYPES 있으면 유형 구성표(tier→volume)로, 없으면 기존 TEMPLATE(하위호환). */
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
    check: '<path d="m5 12 5 5 9-10"/>',
    quote: '<path d="M4 11h5v5H4v-5c0-3 1.5-5 4-6"/><path d="M14 11h5v5h-5v-5c0-3 1.5-5 4-6"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  };
  var FEAT_ICONS = [IC.bolt, IC.layers, IC.shield];

  /* 섹션 공통 머리(아이브로 + 56px 헤딩) — 킷 Text 섹션 타이포 그대로. 키는 최상위 평면 경로 */
  function shead(d, ebKey, ebDef, tKey, tDef) {
    return '<p class="eyebrow up"' + de(ebKey) + '>' + esc(d[ebKey] || ebDef) + '</p>' +
      '<h2 class="s-h2 up d1"' + de(tKey) + '>' + esc(d[tKey] || tDef) + '</h2>';
  }
  /* 체크 불릿 리스트(장식문자 대신 스트로크 아이콘) — base='overview.points' 식 경로 */
  function points(list, base) {
    if (!list || !list.length) return '';
    return '<ul class="s-points">' + list.map(function (p, i) {
      return '<li><i>' + icon(IC.check, 20) + '</i><span' + de(base + '.' + i) + '>' + esc(p) + '</span></li>';
    }).join('') + '</ul>';
  }

  /* ---- 섹션 렌더러 — 편집 훅(data-edit)은 생성기 공용 계약 경로 ---- */
  var sections = {
    /* Navbar 3 (38:1050 내장): 로고 좌 — 메뉴 중앙 — Login/Sign up 우. 높이 104(패딩 24) */
    nav: function (c, ctx) {
      var d = ctx.data;
      var menu = (d.nav && d.nav.length ? d.nav.map(function (it, i) { return '<a data-nav-page="' + (it.id || '') + '"' + (it.active ? ' class="on"' : '') + de('nav.' + i + '.name') + '>' + esc(it.name) + '</a>'; })
        : ['기능', '가격', '고객사례', '문의'].map(function (m, i) { return '<a' + de('navLinks.' + i) + '>' + esc((d.navLinks && d.navLinks[i]) || m) + '</a>'; })).join('');
      return '<header class="s-nav"><div class="wrap s-nav-in">' +
        '<span class="s-logo"><i>' + icon(IC.spark, 20) + '</i><b' + de('productName') + '>' + esc(d.productName || '제품명') + '</b></span>' +
        '<nav class="s-menu">' + menu + '</nav>' +
        '<span class="s-nav-r"><button class="btn btn--txt"' + de('loginLabel') + '>' + esc(d.loginLabel || 'Login') + '</button>' +
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
        '<p class="eyebrow up"' + de('bannerEyebrow') + '>' + esc(d.bannerEyebrow || 'GET STARTED') + '</p>' +
        '<h2 class="s-h2 up d1"' + de('bannerText') + '>' + esc(d.bannerText || '지금 시작해보세요') + '</h2>' +
        '<p class="s-cta-s up d2"' + de('subcopy') + '>' + esc(d.subcopy || '') + '</p>' +
        '<div class="up d3"><button class="btn btn--pri"' + de('bannerCta') + '>' + esc(d.bannerCta || d.primaryCta || '시작하기') + '</button></div>' +
        '</div></section>';
    },
    /* ---- v2: pagetypes.js 공용 어휘 — 조형은 킷 정찰 스펙(플랫·보더 1.8·라운드 0) ---- */
    /* 서브페이지 히어로 — Hero 1 축소형: 아이브로 + 56px 헤딩 + 부제, 이미지 없음 */
    pagehero: function (c, ctx) {
      var d = ctx.data;
      var lb = (typeof window !== 'undefined' && window.PAGE_TYPES && d.pageType && window.PAGE_TYPES[d.pageType]) ? window.PAGE_TYPES[d.pageType].label : '';
      return '<section class="s-phero"><div class="wrap">' +
        '<p class="eyebrow up"' + de('pageEyebrow') + '>' + esc(d.pageEyebrow || d.productName || 'ABOUT') + '</p>' +
        '<h1 class="s-phero-t up d1"' + de('tagline') + '>' + esc(d.tagline || lb || '페이지 제목') + '</h1>' +
        '<p class="s-phero-s up d2"' + de('subcopy') + '>' + esc(d.subcopy || '이 페이지의 핵심을 한 줄로 소개하세요.') + '</p>' +
        '</div></section>';
    },
    /* 개요 — 킷 Text 섹션 2분할(제목 좌 / 본문+체크 포인트 우) */
    overview: function (c, ctx) {
      var d = ctx.data, ov = d.overview || {};
      return '<section class="band band--alt"><div class="wrap s-grid cols2 s-split">' +
        '<div><p class="eyebrow up"' + de('overviewEyebrow') + '>' + esc(d.overviewEyebrow || 'OVERVIEW') + '</p>' +
        '<h2 class="s-h2 up d1"' + de('overview.title') + '>' + esc(ov.title || '제품 개요') + '</h2></div>' +
        '<div class="up d2"><p class="s-lead"' + de('overview.text') + '>' + esc(ov.text || '무엇을 해결하는 제품인지 두세 문장으로 소개하세요.') + '</p>' +
        points(ov.points, 'overview.points') + '</div></div></section>';
    },
    /* 소개 — 센터 텍스트 섹션 */
    intro: function (c, ctx) {
      var d = ctx.data, it = d.intro || {};
      return '<section class="band"><div class="wrap s-center">' +
        '<p class="eyebrow up"' + de('introEyebrow') + '>' + esc(d.introEyebrow || 'ABOUT') + '</p>' +
        '<h2 class="s-h2 up d1"' + de('intro.title') + '>' + esc(it.title || '소개') + '</h2>' +
        '<p class="s-lead up d2"' + de('intro.text') + '>' + esc(it.text || '목적과 기대효과를 소개하세요.') + '</p>' +
        '</div></section>';
    },
    /* 상세 기능 교차 행 — 텍스트/이미지 2분할, 홀수 행 반전 */
    featurerows: function (c, ctx) {
      var d = ctx.data;
      var rows = (d.featureRows && d.featureRows.length ? d.featureRows : [
        { title: '대표 기능 하나', desc: '이 기능이 사용자의 어떤 문제를 어떻게 푸는지 설명하세요.', points: ['포인트 1', '포인트 2'] },
        { title: '대표 기능 둘', desc: '두 번째 상세 기능 설명.', points: ['포인트 1', '포인트 2'] },
      ]);
      var html = rows.map(function (r, i) {
        var key = 'featureRow' + i;
        var img = (d.images && d.images[key])
          ? '<img class="s-frow-img" src="' + esc(d.images[key]) + '" alt="" data-img="' + key + '">'
          : '<div class="s-frow-img ph" data-img="' + key + '"><span>FEATURE ' + (i + 1) + '</span></div>';
        return '<div class="s-frow up' + (i % 2 ? ' s-frow--rev' : '') + '">' +
          '<div class="s-frow-tx"><h3' + de('featureRows.' + i + '.title') + '>' + esc(r.title || '') + '</h3>' +
          '<p' + de('featureRows.' + i + '.desc') + '>' + esc(r.desc || '') + '</p>' +
          points(r.points, 'featureRows.' + i + '.points') + '</div>' + img + '</div>';
      }).join('');
      return '<section class="band"><div class="wrap s-frows">' + html + '</div></section>';
    },
    /* 갤러리 — 킷 Galleries: 갭 16 모자이크(첫 장 2칸), 이미지 라운드 0 */
    gallery: function (c, ctx) {
      var d = ctx.data;
      var items = (d.gallery && d.gallery.length ? d.gallery : [{ label: 'SCREEN 1' }, { label: 'SCREEN 2' }, { label: 'SCREEN 3' }]);
      var cells = items.map(function (g, i) {
        var key = 'gallery' + i;
        if (d.images && d.images[key]) return '<figure class="s-gal-it up d' + Math.min(i + 1, 3) + '"><img src="' + esc(d.images[key]) + '" alt="" data-img="' + key + '"></figure>';
        return '<figure class="s-gal-it ph up d' + Math.min(i + 1, 3) + '" data-img="' + key + '"><span' + de('gallery.' + i + '.label') + '>' + esc(g.label || 'SCREEN') + '</span></figure>';
      }).join('');
      return '<section class="band band--alt"><div class="wrap">' +
        shead(d, 'galleryEyebrow', 'GALLERY', 'galleryTitle', '화면 미리보기') +
        '<div class="s-gal">' + cells + '</div></div></section>';
    },
    /* 비교 표 — 킷 Tables: 셀 그리드 1.8px, 행 96, 우리 열 블루 강조 */
    compare: function (c, ctx) {
      var d = ctx.data, cp = d.compare || {};
      var rows = (cp.rows && cp.rows.length ? cp.rows : [{ k: '구축 시간', us: '몇 분', them: '몇 주' }, { k: '비용', us: '구독형', them: '고정 인건비' }, { k: '수정', us: '즉시 반영', them: '외주 왕복' }]);
      var body = rows.map(function (r, i) {
        return '<tr><th' + de('compare.rows.' + i + '.k') + '>' + esc(r.k || '') + '</th>' +
          '<td class="us"' + de('compare.rows.' + i + '.us') + '>' + esc(r.us || '') + '</td>' +
          '<td' + de('compare.rows.' + i + '.them') + '>' + esc(r.them || '') + '</td></tr>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'compareEyebrow', 'COMPARE', 'compareTitle', '무엇이 다른가요') +
        '<div class="s-tblw up d2"><table class="s-tbl"><thead><tr><th></th>' +
        '<th class="us"' + de('productName') + '>' + esc(d.productName || '우리 제품') + '</th>' +
        '<th' + de('compare.them') + '>' + esc(cp.them || '기존 방식') + '</th></tr></thead>' +
        '<tbody>' + body + '</tbody></table></div></div></section>';
    },
    /* FAQ — 1.8px 라인 리스트(정적 전개 — 빈 화면 없이 완성 렌더 원칙) */
    faq: function (c, ctx) {
      var d = ctx.data;
      var items = (d.faq && d.faq.length ? d.faq : [
        { q: '어떤 서비스인가요?', a: '서비스를 한 문장으로 설명해주세요.' },
        { q: '도입까지 얼마나 걸리나요?', a: '보통 걸리는 기간과 절차를 안내하세요.' },
        { q: '요금은 어떻게 되나요?', a: '과금 방식을 안내하세요.' },
      ]);
      var list = items.map(function (f, i) {
        return '<div class="s-qa up d' + Math.min(i + 1, 3) + '"><h3' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</h3>' +
          '<p' + de('faq.' + i + '.a') + '>' + esc(f.a || '') + '</p></div>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'faqEyebrow', 'FAQ', 'faqTitle', '자주 묻는 질문') +
        '<div class="s-faq">' + list + '</div></div></section>';
    },
    /* 고객 후기 — 킷 Testimonial 5: 블루(#0F62FE) 카드 3장, 별점 없음, 라운드 0 */
    testimonial: function (c, ctx) {
      var d = ctx.data;
      var items = (d.testimonials && d.testimonials.length ? d.testimonials : [
        { text: '도입 후 반복 업무 시간이 크게 줄었어요.', by: '고객 이름 · 회사' },
        { text: '팀 전체가 같은 화면을 보며 일하게 됐습니다.', by: '고객 이름 · 회사' },
        { text: '지원이 빨라서 믿고 쓰고 있어요.', by: '고객 이름 · 회사' },
      ]);
      var cards = items.map(function (t, i) {
        return '<figure class="s-tst up d' + Math.min(i + 1, 3) + '"><i>' + icon(IC.quote) + '</i>' +
          '<blockquote' + de('testimonials.' + i + '.text') + '>' + esc(t.text || '') + '</blockquote>' +
          '<figcaption' + de('testimonials.' + i + '.by') + '>' + esc(t.by || '') + '</figcaption></figure>';
      }).join('');
      return '<section class="band band--alt"><div class="wrap">' +
        shead(d, 'testimonialEyebrow', 'TESTIMONIALS', 'testimonialTitle', '고객이 말합니다') +
        '<div class="s-grid cols3 s-tsts">' + cards + '</div></div></section>';
    },
    /* 요금제 — 킷 Pricing: 카드 bg #F9F9F9 보더 1.8 라운드 0, 추천 플랜은 버튼만 채움 */
    pricing: function (c, ctx) {
      var d = ctx.data;
      var plans = (d.plans && d.plans.length ? d.plans : [
        { name: 'Starter', price: '무료', per: '', desc: '개인과 소규모 팀', points: ['기본 기능', '프로젝트 1개'], cta: '시작하기' },
        { name: 'Pro', price: '29,000원', per: '월', desc: '성장하는 팀', points: ['모든 기능', '무제한 프로젝트', '우선 지원'], cta: '시작하기', featured: true },
        { name: 'Enterprise', price: '문의', per: '', desc: '대규모 조직', points: ['전담 지원', '보안 옵션', '맞춤 계약'], cta: '문의하기' },
      ]);
      var cards = plans.map(function (p, i) {
        return '<div class="s-plan up d' + Math.min(i + 1, 3) + '">' +
          '<b' + de('plans.' + i + '.name') + '>' + esc(p.name || '') + '</b>' +
          '<p class="s-plan-d"' + de('plans.' + i + '.desc') + '>' + esc(p.desc || '') + '</p>' +
          '<div class="s-price"><strong' + de('plans.' + i + '.price') + '>' + esc(p.price || '') + '</strong>' +
          (p.per ? '<span' + de('plans.' + i + '.per') + '>' + esc(p.per) + '</span>' : '') + '</div>' +
          points(p.points, 'plans.' + i + '.points') +
          '<button class="btn ' + (p.featured ? 'btn--pri' : 'btn--out') + '"' + de('plans.' + i + '.cta') + '>' + esc(p.cta || '시작하기') + '</button></div>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'pricingEyebrow', 'PRICING', 'pricingTitle', '요금제') +
        '<div class="s-grid cols3 s-plans">' + cards + '</div></div></section>';
    },
    /* 문의 폼 — 킷 Forms: 인풋 높이 56 bg #F9F9F9 라운드 8, 레이블 14/16. 정적 데모(제출 비활성) */
    form: function (c, ctx) {
      var d = ctx.data, f = d.form || {};
      var fields = (f.fields && f.fields.length ? f.fields : ['회사명', '담당자 이름', '이메일', '문의 내용']);
      var rows = fields.map(function (label, i) {
        var ta = /내용|메시지|요청|소개/.test(String(label));
        return '<div class="s-field"><label' + de('form.fields.' + i) + '>' + esc(label) + '</label>' +
          (ta ? '<textarea rows="5"></textarea>' : '<input type="text">') + '</div>';
      }).join('');
      return '<section class="band"><div class="wrap s-formw">' +
        '<p class="eyebrow up"' + de('formEyebrow') + '>' + esc(d.formEyebrow || 'CONTACT') + '</p>' +
        '<h2 class="s-h2 up d1"' + de('form.title') + '>' + esc(f.title || '문의하기') + '</h2>' +
        '<p class="s-lead up d2"' + de('form.sub') + '>' + esc(f.sub || '남겨주시면 1영업일 안에 연락드립니다.') + '</p>' +
        '<div class="s-form up d3">' + rows +
        '<button class="btn btn--pri" type="button" disabled' + de('form.submit') + '>' + esc(f.submit || '문의 보내기') + '</button></div>' +
        '</div></section>';
    },
    /* 안내 카드 3열 — 플랫 보더 카드(연락처·절차 등) */
    infocards: function (c, ctx) {
      var d = ctx.data;
      var items = (d.infoCards && d.infoCards.length ? d.infoCards : [
        { title: '이메일', text: 'contact@example.com' }, { title: '전화', text: '02-000-0000' }, { title: '도입 절차', text: '문의 후 상담과 견적을 거쳐 도입합니다.' },
      ]);
      var cells = items.map(function (t, i) {
        return '<div class="s-card up d' + Math.min(i + 1, 3) + '"><b' + de('infoCards.' + i + '.title') + '>' + esc(t.title || '') + '</b>' +
          '<p' + de('infoCards.' + i + '.text') + '>' + esc(t.text || '') + '</p></div>';
      }).join('');
      return '<section class="band band--alt"><div class="wrap"><div class="s-grid cols3 mt0">' + cells + '</div></div></section>';
    },
    /* 가이드 문서 목록 — 아이콘 + 제목 링크 + 설명, 2열 */
    doclist: function (c, ctx) {
      var d = ctx.data;
      var docs = (d.docs && d.docs.length ? d.docs : [
        { title: '시작하기', desc: '설치와 첫 설정' }, { title: '핵심 기능', desc: '주요 기능 사용법' },
        { title: '관리자 가이드', desc: '권한과 설정 관리' }, { title: '자주 묻는 질문', desc: '문제 해결 모음' },
      ]);
      var cells = docs.map(function (t, i) {
        return '<div class="s-doc up d' + Math.min(i + 1, 3) + '"><span class="s-fic">' + icon(IC.doc) + '</span>' +
          '<div><a' + de('docs.' + i + '.title') + '>' + esc(t.title || '') + '</a>' +
          '<p' + de('docs.' + i + '.desc') + '>' + esc(t.desc || '') + '</p></div></div>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'docsEyebrow', 'DOCS', 'docsTitle', '가이드 문서') +
        '<div class="s-grid cols2 s-docs">' + cells + '</div></div></section>';
    },
    /* 시작 절차 — 번호(48px 블루) 3열 */
    steps: function (c, ctx) {
      var d = ctx.data;
      var items = (d.steps && d.steps.length ? d.steps : [
        { title: '가입', text: '계정을 만듭니다.' }, { title: '설정', text: '기본 정보를 입력합니다.' }, { title: '시작', text: '첫 결과물을 만듭니다.' },
      ]);
      var cells = items.map(function (s, i) {
        return '<div class="s-step up d' + Math.min(i + 1, 3) + '"><b>' + (i + 1 < 10 ? '0' + (i + 1) : (i + 1)) + '</b>' +
          '<h3' + de('steps.' + i + '.title') + '>' + esc(s.title || '') + '</h3>' +
          '<p' + de('steps.' + i + '.text') + '>' + esc(s.text || '') + '</p></div>';
      }).join('');
      return '<section class="band band--alt"><div class="wrap">' +
        shead(d, 'stepsEyebrow', 'STEPS', 'stepsTitle', '시작 절차') +
        '<div class="s-grid cols3">' + cells + '</div></div></section>';
    },
    /* 블로그 카드 — 킷 Blog 3: 썸네일 + 칩(라운드 32) + 날짜 + 제목 링크 */
    bloglist: function (c, ctx) {
      var d = ctx.data;
      var items = (d.posts && d.posts.length ? d.posts : [
        { title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' },
        { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' },
        { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' },
      ]);
      var cells = items.map(function (p, i) {
        var key = 'post' + i;
        var img = (d.images && d.images[key])
          ? '<img class="s-post-img" src="' + esc(d.images[key]) + '" alt="" data-img="' + key + '">'
          : '<div class="s-post-img ph" data-img="' + key + '"><span>THUMBNAIL</span></div>';
        return '<article class="s-post up d' + Math.min(i + 1, 3) + '">' + img +
          '<div class="s-post-m"><span class="s-chip"' + de('posts.' + i + '.tag') + '>' + esc(p.tag || 'NEWS') + '</span>' +
          '<time' + de('posts.' + i + '.date') + '>' + esc(p.date || '') + '</time></div>' +
          '<a class="s-post-t"' + de('posts.' + i + '.title') + '>' + esc(p.title || '') + '</a>' +
          '<p' + de('posts.' + i + '.desc') + '>' + esc(p.desc || '') + '</p></article>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'blogEyebrow', 'BLOG', 'blogTitle', '소식') +
        '<div class="s-grid cols3">' + cells + '</div></div></section>';
    },
    /* 아젠다 — 시간(블루) + 제목/설명, 1.8px 라인 행 */
    agenda: function (c, ctx) {
      var d = ctx.data;
      var items = (d.agenda && d.agenda.length ? d.agenda : [
        { time: '14:00', title: '오프닝', desc: '환영 인사' }, { time: '14:30', title: '세션 1', desc: '주제 발표' },
        { time: '15:30', title: '세션 2', desc: '사례 공유' }, { time: '16:30', title: '네트워킹', desc: '자유 교류' },
      ]);
      var rows = items.map(function (a, i) {
        return '<div class="s-ag up d' + Math.min(i + 1, 3) + '"><time' + de('agenda.' + i + '.time') + '>' + esc(a.time || '') + '</time>' +
          '<div><h3' + de('agenda.' + i + '.title') + '>' + esc(a.title || '') + '</h3>' +
          '<p' + de('agenda.' + i + '.desc') + '>' + esc(a.desc || '') + '</p></div></div>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'agendaEyebrow', 'AGENDA', 'agendaTitle', '프로그램') +
        '<div class="s-agl">' + rows + '</div></div></section>';
    },
    /* 연사 — 킷 Teams 유도: 정방형 사진(라운드 0 플랫) + 이름/소속/한 줄 */
    speakers: function (c, ctx) {
      var d = ctx.data;
      var items = (d.speakers && d.speakers.length ? d.speakers : [
        { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }, { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }, { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' },
      ]);
      var cells = items.map(function (s, i) {
        var key = 'speaker' + i;
        var img = (d.images && d.images[key])
          ? '<img class="s-spk-img" src="' + esc(d.images[key]) + '" alt="" data-img="' + key + '">'
          : '<div class="s-spk-img ph" data-img="' + key + '"><span>PHOTO</span></div>';
        return '<div class="s-spk up d' + Math.min(i + 1, 3) + '">' + img +
          '<b' + de('speakers.' + i + '.name') + '>' + esc(s.name || '') + '</b>' +
          '<span class="s-spk-r"' + de('speakers.' + i + '.role') + '>' + esc(s.role || '') + '</span>' +
          '<p' + de('speakers.' + i + '.desc') + '>' + esc(s.desc || '') + '</p></div>';
      }).join('');
      return '<section class="band band--alt"><div class="wrap">' +
        shead(d, 'speakersEyebrow', 'SPEAKERS', 'speakersTitle', '연사 소개') +
        '<div class="s-grid cols3">' + cells + '</div></div></section>';
    },
    /* 참가 안내 — 플랫 보더 카드 3열 + 섹션 머리 */
    notice: function (c, ctx) {
      var d = ctx.data;
      var items = (d.notices && d.notices.length ? d.notices : [
        { title: '참가 안내', text: '사전 등록 필수, 선착순 마감.' }, { title: '주차 안내', text: '행사장 주차 지원 여부를 안내하세요.' }, { title: '문의', text: 'event@example.com' },
      ]);
      var cells = items.map(function (t, i) {
        return '<div class="s-card up d' + Math.min(i + 1, 3) + '"><b' + de('notices.' + i + '.title') + '>' + esc(t.title || '') + '</b>' +
          '<p' + de('notices.' + i + '.text') + '>' + esc(t.text || '') + '</p></div>';
      }).join('');
      return '<section class="band"><div class="wrap">' +
        shead(d, 'noticeEyebrow', 'NOTICE', 'noticeTitle', '안내') +
        '<div class="s-grid cols3">' + cells + '</div></div></section>';
    },
    /* Footer 1 (38:1600): 로고 컬럼(389) + 링크 3컬럼 + 저작권. py 64, 링크 18/24 SB #777 */
    footer: function (c, ctx) {
      var d = ctx.data;
      var links = (d.footerLinks && d.footerLinks.length ? d.footerLinks : ['이용약관', '개인정보처리방침', '고객센터']);
      var prodLinks = (d.footerProductLinks && d.footerProductLinks.length ? d.footerProductLinks : ['기능', '가격', '업데이트']);
      var compLinks = (d.footerCompanyLinks && d.footerCompanyLinks.length ? d.footerCompanyLinks : ['소개', '블로그', '채용']);
      var col = function (h, hPath, ls, base) {
        return '<div class="s-fcol"><b' + de(hPath) + '>' + esc(h) + '</b>' + ls.map(function (l, i) { return '<a' + de(base ? base + '.' + (i) : '') + '>' + esc(l) + '</a>'; }).join('') + '</div>';
      };
      return '<footer class="s-foot"><div class="wrap">' +
        '<div class="s-foot-top">' +
        '<span class="s-logo"><i>' + icon(IC.spark, 20) + '</i><b' + de('productName') + '>' + esc(d.productName || '제품명') + '</b></span>' +
        col(d.footerNavTitle || 'NAVIGATION', 'footerNavTitle', links, 'footerLinks') +
        col(d.footerProductTitle || 'PRODUCT', 'footerProductTitle', prodLinks, 'footerProductLinks') +
        col(d.footerCompanyTitle || 'COMPANY', 'footerCompanyTitle', compLinks, 'footerCompanyLinks') +
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
      /* v2 공통 — 플레이스홀더·리드문·체크 리스트·센터 정렬 */
      '.sat .ph{background:var(--bg-2);border:var(--bw) solid var(--line);display:grid;place-items:center}',
      '.sat .ph>span{font-size:14px;letter-spacing:.08em;color:var(--soft)}',
      '.sat .mt0{margin-top:0}',
      '.sat .s-lead{font-size:var(--fs-body);line-height:32px;font-weight:500;color:var(--body)}',
      '.sat .s-center{text-align:center}.sat .s-center .s-h2{margin-left:auto;margin-right:auto}.sat .s-center .s-lead{max-width:842px;margin:24px auto 0}',
      '.sat .s-points{list-style:none;margin:24px 0 0;padding:0;display:flex;flex-direction:column;gap:16px}',
      '.sat .s-points li{display:flex;gap:12px;align-items:flex-start;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      '.sat .s-points li i{display:grid;place-items:center;width:24px;height:24px;color:var(--brand);flex:none}',
      /* pagehero */
      '.sat .s-phero{padding:128px 0;text-align:center}',
      '.sat .s-phero-t{font-size:var(--fs-h56);line-height:64px;font-weight:600;max-width:842px;margin:24px auto 0}',
      '.sat .s-phero-s{font-size:var(--fs-body);line-height:32px;font-weight:500;color:var(--body);max-width:843px;margin:24px auto 0}',
      /* overview(2분할) */
      '.sat .s-split{margin-top:0;align-items:start}',
      /* featurerows */
      '.sat .s-frows{display:flex;flex-direction:column;gap:128px}',
      '.sat .s-frow{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}',
      '.sat .s-frow--rev .s-frow-tx{order:2}',
      '.sat .s-frow-tx h3{font-size:var(--fs-h32);line-height:40px;font-weight:600}',
      '.sat .s-frow-tx>p{margin-top:16px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      '.sat .s-frow-img{width:100%;height:420px;object-fit:cover;display:block}',
      /* gallery — 갭 16 모자이크 */
      '.sat .s-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:64px}',
      '.sat .s-gal-it{margin:0;height:360px}',
      '.sat .s-gal-it:first-child{grid-column:span 2}',
      '.sat .s-gal-it img{width:100%;height:100%;object-fit:cover;display:block}',
      /* compare 표 — 셀 그리드 1.8px, 행 96 */
      '.sat .s-tblw{margin-top:64px;overflow-x:auto}',
      '.sat .s-tbl{width:100%;border-collapse:collapse;border:var(--bw) solid var(--line)}',
      '.sat .s-tbl th,.sat .s-tbl td{border:var(--bw) solid var(--line);height:96px;padding:16px 32px;text-align:left;font-size:var(--fs-sm);line-height:24px;vertical-align:middle}',
      '.sat .s-tbl thead th{font-weight:600;color:var(--ink);background:var(--bg-2)}',
      '.sat .s-tbl tbody th{font-weight:600;color:var(--ink);width:28%}',
      '.sat .s-tbl td{font-weight:500;color:var(--body)}',
      '.sat .s-tbl .us{color:var(--brand);font-weight:600}',
      /* faq */
      '.sat .s-faq{margin-top:64px;border-top:var(--bw) solid var(--line)}',
      '.sat .s-qa{padding:32px 0;border-bottom:var(--bw) solid var(--line)}',
      '.sat .s-qa h3{font-size:var(--fs-h24);line-height:32px;font-weight:600}',
      '.sat .s-qa p{margin-top:16px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body);max-width:842px}',
      /* testimonial — 블루 카드 */
      '.sat .s-tsts{gap:32px}',
      '.sat .s-tst{margin:0;background:var(--brand);color:var(--bg);padding:48px 32px;display:flex;flex-direction:column;gap:24px}',
      '.sat .s-tst i{display:block;opacity:.7}',
      '.sat .s-tst blockquote{margin:0;font-size:var(--fs-body);line-height:32px;font-weight:500;flex:1}',
      '.sat .s-tst figcaption{font-size:var(--fs-sm);line-height:24px;font-weight:600;opacity:.85}',
      /* pricing — #F9F9F9 카드, 라운드 0, 추천=버튼만 채움 */
      '.sat .s-plans{gap:32px;align-items:stretch}',
      '.sat .s-plan{background:var(--bg-2);border:var(--bw) solid var(--line);padding:48px 32px;display:flex;flex-direction:column}',
      '.sat .s-plan>b{font-size:var(--fs-h24);line-height:32px;font-weight:600}',
      '.sat .s-plan-d{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      '.sat .s-price{margin-top:24px;display:flex;align-items:baseline;gap:8px}',
      '.sat .s-price strong{font-size:var(--fs-h48);line-height:56px;font-weight:600}',
      '.sat .s-price span{font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      '.sat .s-price span::before{content:"/ "}',
      '.sat .s-plan .s-points{flex:1}',
      '.sat .s-plan .btn{margin-top:32px;width:100%}',
      /* form — 인풋 56 bg-2 라운드 8, 레이블 14/16 */
      '.sat .s-formw{max-width:640px;margin:0 auto;text-align:center}',
      '.sat .s-form{margin-top:48px;display:flex;flex-direction:column;gap:24px;text-align:left}',
      '.sat .s-field{display:flex;flex-direction:column;gap:8px}',
      '.sat .s-field label{font-size:14px;line-height:16px;font-weight:500;color:var(--ink)}',
      '.sat .s-field input,.sat .s-field textarea{height:var(--ctl);padding:12px 16px;border:var(--bw) solid var(--line);border-radius:var(--r);background:var(--bg-2);font-family:inherit;font-size:var(--fs-sm);line-height:24px;color:var(--ink)}',
      '.sat .s-field textarea{height:auto;min-height:140px;resize:vertical}',
      '.sat .s-field input:focus,.sat .s-field textarea:focus{outline:none;border-color:var(--brand)}',
      '.sat .s-form .btn[disabled]{cursor:default}',
      /* infocards·notice 카드 */
      '.sat .s-card{background:var(--bg);border:var(--bw) solid var(--line);padding:32px}',
      '.sat .s-card b{display:block;font-size:var(--fs-h24);line-height:32px;font-weight:600}',
      '.sat .s-card p{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* doclist */
      '.sat .s-docs{gap:32px}',
      '.sat .s-doc{display:flex;gap:24px;align-items:flex-start;background:var(--bg);border:var(--bw) solid var(--line);padding:32px}',
      '.sat .s-doc .s-fic{flex:none}',
      '.sat .s-doc a{display:block;font-size:var(--fs-h24);line-height:32px;font-weight:600;color:var(--ink);cursor:pointer}',
      '.sat .s-doc p{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* steps */
      '.sat .s-step b{display:block;font-size:var(--fs-h48);line-height:56px;font-weight:600;color:var(--brand)}',
      '.sat .s-step h3{margin-top:16px;font-size:var(--fs-h24);line-height:32px;font-weight:600}',
      '.sat .s-step p{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* bloglist — 칩 라운드 32 */
      '.sat .s-post-img{width:100%;height:260px;object-fit:cover;display:block}',
      '.sat .s-post-m{display:flex;align-items:center;gap:16px;margin-top:24px}',
      '.sat .s-chip{display:inline-flex;align-items:center;height:32px;padding:0 16px;border-radius:32px;background:var(--brand-weak);color:var(--brand);font-size:14px;line-height:16px;font-weight:600;letter-spacing:.04em}',
      '.sat .s-post time{font-size:14px;line-height:16px;font-weight:500;color:var(--soft)}',
      '.sat .s-post-t{display:block;margin-top:16px;font-size:var(--fs-h24);line-height:32px;font-weight:600;color:var(--ink);cursor:pointer}',
      '.sat .s-post>p{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* agenda */
      '.sat .s-agl{margin-top:64px;border-top:var(--bw) solid var(--line)}',
      '.sat .s-ag{display:grid;grid-template-columns:160px 1fr;gap:32px;padding:32px 0;border-bottom:var(--bw) solid var(--line)}',
      '.sat .s-ag time{font-size:var(--fs-h24);line-height:32px;font-weight:600;color:var(--brand)}',
      '.sat .s-ag h3{font-size:var(--fs-h24);line-height:32px;font-weight:600}',
      '.sat .s-ag p{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* speakers */
      '.sat .s-spk-img{width:100%;aspect-ratio:1;object-fit:cover;display:block}',
      '.sat .s-spk b{display:block;margin-top:24px;font-size:var(--fs-h24);line-height:32px;font-weight:600}',
      '.sat .s-spk-r{display:block;margin-top:4px;font-size:var(--fs-sm);line-height:24px;font-weight:600;color:var(--brand)}',
      '.sat .s-spk p{margin-top:8px;font-size:var(--fs-sm);line-height:24px;font-weight:500;color:var(--body)}',
      /* footer */
      '.sat .s-foot{background:var(--bg);border-top:var(--bw) solid var(--line);padding:64px 0}',
      '.sat .s-foot-top{display:grid;grid-template-columns:389px 1fr 1fr 1fr;gap:64px}',
      '.sat .s-fcol{display:flex;flex-direction:column;gap:24px}',
      '.sat .s-fcol b{font-size:18px;line-height:24px;font-weight:600;text-transform:uppercase;letter-spacing:.02em}',
      '.sat .s-fcol a{font-size:18px;line-height:24px;font-weight:600;color:var(--body);cursor:pointer}',
      '.sat .s-copy{margin-top:64px;font-size:18px;line-height:24px;font-weight:500;color:var(--body)}',
      '@media (max-width:' + (layout.breakpoints.lg - 1) + 'px){.sat .s-hero-t{font-size:44px;line-height:1.2}.sat .s-h2{font-size:36px;line-height:1.2}.sat .s-hero-img{height:auto;min-height:320px;margin-top:64px}.sat .s-menu{display:none}.sat .s-foot-top{grid-template-columns:1fr 1fr;gap:40px}.sat .s-phero-t{font-size:40px;line-height:1.2}.sat .s-frows{gap:88px}.sat .s-frow{grid-template-columns:1fr;gap:32px}.sat .s-frow--rev .s-frow-tx{order:0}.sat .s-frow-img{height:320px}.sat .s-gal{grid-template-columns:1fr}.sat .s-gal-it:first-child{grid-column:auto}.sat .s-gal-it{height:280px}.sat .s-ag{grid-template-columns:96px 1fr;gap:16px}.sat .s-price strong{font-size:40px;line-height:1.2}}',
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

  /* PAGE_TYPES 정식 어휘 → 이 팩 렌더러 별칭. 그다음 SECTION_FALLBACK 순서로 대체(끝까지 없으면 생략). */
  var ALIAS = { stats: 'stat', showcase: 'gallery', quote: 'testimonial', metrics: 'stat', banner: 'cta' };
  function resolveType(t) {
    if (sections[t]) return t;
    if (ALIAS[t] && sections[ALIAS[t]]) return ALIAS[t];
    var fb = ((typeof window !== 'undefined' && window.SECTION_FALLBACK) || {})[t] || [];
    for (var i = 0; i < fb.length; i++) {
      var f = fb[i];
      if (sections[f]) return f;
      if (ALIAS[f] && sections[ALIAS[f]]) return ALIAS[f];
    }
    return null;
  }

  window.SATURN_PACK = saturnPack;
  window.SATURN_STYLE = { id: 'saturn', name: 'Saturn 블루', desc: '라이트 · 클린 블루 · 플랫', swatch: 'linear-gradient(135deg,#0F62FE,#CFE0FF)' };
  window.SATURN_SECTION_SPEC = {
    template: TEMPLATE, fixed: ['nav', 'footer'],
    labels: {
      hero: '히어로', feature: '기능', stat: '지표', cta: 'CTA',
      pagehero: '페이지 머리', overview: '개요', intro: '소개', featurerows: '상세 기능', gallery: '갤러리',
      compare: '비교', faq: 'FAQ', testimonial: '고객 후기', pricing: '요금제', form: '문의 폼',
      infocards: '안내 카드', doclist: '문서 목록', steps: '절차', bloglist: '블로그', agenda: '아젠다',
      speakers: '연사', notice: '안내',
    },
  };
  window.renderSaturnPage = function (shared, opts) {
    opts = opts || {}; shared = shared || {}; var content = {};
    var vol = opts.volume || 'heavy';
    // pageType 라우팅 — data.pageType + window.PAGE_TYPES(미로드면 기존 동작) 있으면 유형 구성표 사용
    var pt = shared.pageType;
    var ptDef = (pt && typeof window !== 'undefined' && window.PAGE_TYPES && window.PAGE_TYPES[pt]) ? window.PAGE_TYPES[pt] : null;
    var head, foot, bodyTpl;
    if (ptDef) {
      head = [{ type: 'nav', tier: 'core' }]; foot = [{ type: 'footer', tier: 'core' }];
      bodyTpl = ptDef.sections.slice();
    } else { // 하위호환 — 기존 TEMPLATE 그대로
      head = TEMPLATE.filter(function (s) { return s.type === 'nav'; });
      foot = TEMPLATE.filter(function (s) { return s.type === 'footer'; });
      bodyTpl = TEMPLATE.filter(function (s) { return s.type !== 'nav' && s.type !== 'footer'; });
    }
    // 섹션 가시성/순서 계약 (checklist §5) — nav/footer 고정. 판정은 정식 타입명 기준
    var hidden = shared.hiddenSections || [], shown = shared.shownSections || [];
    var vis = bodyTpl.filter(function (s) { var def = includesTier(vol, s.tier); return def ? hidden.indexOf(s.type) < 0 : shown.indexOf(s.type) >= 0; });
    var order = shared.sectionOrder || [];
    if (order.length) { var by = {}; vis.forEach(function (s) { by[s.type] = s; }); var ord = []; order.forEach(function (t) { if (by[t]) ord.push(by[t]); }); vis.forEach(function (s) { if (order.indexOf(s.type) < 0) ord.push(s); }); vis = ord; }
    // 렌더러 해석 — 별칭 → SECTION_FALLBACK 순서. 끝까지 없으면 생략(깨지지 않는 게 우선)
    var body = [];
    vis.forEach(function (s) { var r = ptDef ? resolveType(s.type) : s.type; if (r && sections[r]) body.push({ type: r, tier: s.tier }); });
    return renderPage(buildDoc(head.concat(body, foot), content, shared), { motion: opts.motion || 'subtle' });
  };
})();
