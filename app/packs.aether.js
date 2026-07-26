/* packs.aether.js — "Aether Glass" 스타일 팩. classic <script src>.
   다크 글래스모피즘 몰입 + 네이버 그린(#03C75A) 포인트. Space Grotesk / DM Sans.
   출처: ui-ux-pro-max 디자인시스템(Immersive/Glassmorphism) + 21st GlassRefractionHero 시안을
   생성기 계약(바닐라)으로 포팅. framer→CSS keyframes + IntersectionObserver 리빌.
   window.renderAetherPage(shared, opts) → 자가완결 HTML. window.AETHER_STYLE 메타.
   페이지 유형 라우팅: data.pageType + window.PAGE_TYPES(pagetypes.js)가 있으면 그 구성으로 섹션을
   조립(tier→volume 필터는 기존 includesTier 재사용). 없으면 기존 TPL 그대로(하위호환).
   렌더러 없는 타입은 ALIAS(stats→stat 등) → SECTION_FALLBACK 순으로 대체, 끝까지 없으면 생략. */
(function () {
  var esc = window.esc || function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var includesTier = window.includesTier || function (v, t) { var V = { compact: 0, mid: 1, heavy: 2 }, T = { core: 0, mid: 1, rich: 2 }; return T[t] <= V[v]; };

  /* ── 토큰 ── */
  var T = {
    ink: '#0B1220', ink2: '#0F172A',
    green: '#03C75A', greenSoft: '#22C55E', greenLt: '#4ade80',
    text: '#E2E8F0', muted: 'rgba(226,232,240,0.62)',
    glassBg: 'rgba(255,255,255,0.06)', glassBd: 'rgba(255,255,255,0.12)',
    fontD: "'Space Grotesk','Pretendard',sans-serif", fontB: "'DM Sans','Pretendard',sans-serif",
  };

  /* ── 아이콘 (Lucide풍, 이모지 금지) ── */
  var ICONS = {
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
    layers: '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    quote: '<path d="M10 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3"/><path d="M20 7h-4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
  };
  function icon(name, size) { return '<svg width="' + (size || 24) + '" height="' + (size || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.bolt) + '</svg>'; }

  /* 그라디언트 타이틀(줄→단어 스태거) — hero/pagehero 공용 */
  function gradTitle(text) {
    return String(text).split('\n').map(function (line) {
      return '<span class="ag-hl">' + line.split(' ').map(function (w, i) { return '<span class="ag-w" style="--d:' + (i * 0.09) + 's">' + esc(w) + '</span>'; }).join(' ') + '</span>';
    }).join('');
  }
  /* 섹션 소제목 — path는 data 최상위 필드(덮어쓰기 가능), txt는 기본 문구 */
  function head(s, path, txt) {
    return '<div class="ag-head ag-head-sm rv"><h2 data-edit="' + path + '">' + esc(s[path] || txt) + '</h2></div>';
  }

  /* ── 섹션 렌더러 ── */
  function navLinks(shared) {
    var useNav = !!(shared.nav && shared.nav.length);
    var items = useNav ? shared.nav
      : (shared.footerLinks || []).map(function (t) { return { name: t }; });
    return items.slice(0, 5).map(function (l, i) {
      var href = l.pageId ? ('#' + l.pageId) : '#';
      var attr = l.pageId ? (' data-nav-page="' + esc(l.pageId) + '"') : '';
      var path = useNav ? ('nav.' + i + '.name') : ('footerLinks.' + i);
      return '<a href="' + href + '"' + attr + ' data-edit="' + path + '">' + esc(l.name) + '</a>';
    }).join('');
  }
  var S = {
    nav: function (s) {
      return '<header class="ag-nav"><div class="ag-nav-in glass">' +
        '<a class="ag-logo" href="#" data-edit="productName">' + esc(s.productName || 'Aether') + '</a>' +
        '<nav class="ag-links">' + navLinks(s) + '</nav>' +
        '<a class="ag-btn ag-btn-pri" href="#" data-edit="primaryCta">' + esc(s.primaryCta || '무료로 시작') + '</a>' +
        '</div></header>';
    },
    hero: function (s) {
      var img = (s.images && s.images.hero) ? s.images.hero : '';
      var title = gradTitle(s.tagline || '데이터가 결정으로 바뀌는 순간');
      var mstats = (s.mockStats && s.mockStats.length) ? s.mockStats
        : [{ label: '처리량', value: '2.4M/s' }, { label: '지연', value: '2.4ms' }, { label: '정확도', value: '99.9%' }];
      var mock = img
        ? '<div class="ag-mock rv"><div class="ag-mock-in glass"><img src="' + esc(img) + '" data-img="hero" alt=""></div></div>'
        : '<div class="ag-mock rv"><div class="ag-mock-in glass">' +
        '<div class="ag-mrow"><span class="ag-macc">' + icon('activity', 20) + '</span><b data-edit="mockTitle">' + esc(s.mockTitle || '실시간 대시보드') + '</b></div>' +
        '<div class="ag-mstats">' + mstats.map(function (k, i) { return '<div class="glass ag-mstat"><span data-edit="mockStats.' + i + '.label">' + esc(k.label) + '</span><b data-edit="mockStats.' + i + '.value">' + esc(k.value) + '</b></div>'; }).join('') + '</div>' +
        '<div class="ag-bars glass">' + [42, 68, 55, 88, 60, 74, 96].map(function (h, i) { return '<i style="--h:' + h + '%;--i:' + i + '"></i>'; }).join('') + '</div>' +
        '</div></div>';
      return '<section class="ag-hero"><div class="ag-aurora" aria-hidden="true"><div class="ag-a1"></div><div class="ag-a2"></div></div><div class="ag-grid-tx" aria-hidden="true"></div>' +
        '<div class="ag-hero-in">' +
        '<h1 class="ag-title" data-edit="tagline">' + title + '</h1>' +
        (s.subcopy ? '<p class="ag-sub" data-edit="subcopy">' + esc(s.subcopy) + '</p>' : '') +
        '<div class="ag-cta-row">' +
        '<a class="ag-btn ag-btn-pri ag-mag" href="#" data-edit="primaryCta">' + esc(s.primaryCta || '무료로 시작하기') + '</a>' +
        '<a class="ag-btn ag-btn-gh" href="#" data-edit="secondaryCta">' + esc(s.secondaryCta || '데모 살펴보기') + '</a>' +
        '</div>' + mock +
        '</div></section>';
    },
    feature: function (s) {
      var items = s.features || [];
      if (!items.length) {
        if (!s.pageType) return ''; /* 하위호환: 유형 없는 데이터는 기존처럼 생략 */
        items = [{ title: '빠른 구축', desc: '핵심 기능이 푸는 문제를 소개하세요.', icon: 'bolt' }, { title: '유연한 확장', desc: '팀과 데이터가 늘어도 그대로 갑니다.', icon: 'layers' }, { title: '안정과 보안', desc: '암호화와 감사 로그를 기본 제공합니다.', icon: 'shield' }];
      }
      return '<section class="ag-sec"><div class="ag-wrap">' +
        '<div class="ag-head rv"><p class="ag-eyebrow" data-edit="featureEyebrow">' + esc(s.featureEyebrow || ('Why ' + (s.productName || 'Aether'))) + '</p><h2 data-edit="featureTitle">' + esc(s.featureTitle || '복잡함은 숨기고, 인사이트만 남깁니다') + '</h2></div>' +
        '<div class="ag-cards">' + items.map(function (f, i) {
          return '<div class="ag-card glass rv" style="--d:' + (i * 0.1) + 's">' +
            '<div class="ag-ic glass">' + icon(f.icon || 'bolt') + '</div>' +
            '<h3 data-edit="features.' + i + '.title">' + esc(f.title) + '</h3><p data-edit="features.' + i + '.desc">' + esc(f.desc || '') + '</p></div>';
        }).join('') + '</div></div></section>';
    },
    stat: function (s) {
      var items = s.stats || [];
      if (!items.length) {
        if (!s.pageType) return '';
        items = [{ value: '99.9%', label: '가동률' }, { value: '2.4ms', label: '평균 지연' }, { value: '4,200+', label: '고객사' }];
      }
      return '<section class="ag-sec ag-stat-sec"><div class="ag-wrap ag-stats">' +
        items.map(function (st, i) { return '<div class="rv" style="--d:' + (i * 0.08) + 's"><div class="ag-stat-v" data-edit="stats.' + i + '.value">' + esc(st.value) + '</div><div class="ag-stat-l" data-edit="stats.' + i + '.label">' + esc(st.label) + '</div></div>'; }).join('') +
        '</div></section>';
    },
    showcase: function (s) {
      var pts = (s.showcasePoints && s.showcasePoints.length) ? s.showcasePoints : ['드래그 앤 드롭 파이프라인 빌더', '자동 이상탐지 & 알림', '예측 지표 & 시나리오 시뮬레이션'];
      var steps = (s.pipeline && s.pipeline.length) ? s.pipeline : [{ k: '수집 · Kafka', v: '2.4ms' }, { k: '변환 · dbt', v: '2.0ms' }, { k: '적재 · Warehouse', v: '1.6ms' }, { k: '예측 · ML', v: '1.2ms' }];
      return '<section class="ag-sec"><div class="ag-wrap ag-show">' +
        '<div class="rv ag-show-l"><p class="ag-eyebrow" data-edit="showcaseEyebrow">' + esc(s.showcaseEyebrow || 'Live Showcase') + '</p><h2 data-edit="showcaseTitle">' + esc(s.showcaseTitle || '한 화면에서 수집부터 예측까지') + '</h2>' +
        '<p class="ag-show-d" data-edit="showcaseDesc">' + esc(s.showcaseDesc || '스트림·배치·외부 API를 하나의 파이프라인으로. 이상 징후는 자동 감지되고, 예측 모델이 다음 지표를 미리 알려줍니다.') + '</p>' +
        '<ul class="ag-show-ul">' + pts.map(function (t, i) { return '<li><span class="ag-macc">' + icon('chart', 20) + '</span><span data-edit="showcasePoints.' + i + '">' + esc(t) + '</span></li>'; }).join('') + '</ul></div>' +
        '<div class="rv ag-show-r glass" style="--d:.12s"><div class="ag-show-h"><b data-edit="pipelineTitle">' + esc(s.pipelineTitle || '파이프라인 · prod') + '</b><span class="ag-run" data-edit="pipelineStatus">' + esc(s.pipelineStatus || 'running') + '</span></div>' +
        steps.map(function (st, i) { return '<div class="glass ag-step" style="--d:' + (0.1 + i * 0.08) + 's"><span data-edit="pipeline.' + i + '.k">' + esc(st.k) + '</span><i data-edit="pipeline.' + i + '.v">' + esc(st.v) + '</i></div>'; }).join('') +
        '</div></div></section>';
    },
    cta: function (s) {
      var txt = s.bannerText || (s.pageType ? '지금 바로 시작해보세요' : '');
      if (!txt) return '';
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-cta glass rv">' +
        '<div class="ag-cta-glow" aria-hidden="true"></div>' +
        '<h2 data-edit="bannerText">' + esc(txt) + '</h2>' +
        (s.subcopy ? '<p data-edit="subcopy">' + esc(s.subcopy) + '</p>' : '') +
        '<div class="ag-cta-row"><a class="ag-btn ag-btn-pri ag-mag" href="#" data-edit="bannerCta">' + esc(s.bannerCta || s.primaryCta || '무료로 시작하기') + '</a></div>' +
        '</div></div></section>';
    },
    footer: function (s) {
      var links = (s.footerLinks || []).map(function (t, i) { return '<a href="#" data-edit="footerLinks.' + i + '">' + esc(t) + '</a>'; }).join('');
      return '<footer class="ag-foot"><div class="ag-wrap ag-foot-in">' +
        '<span class="ag-logo" data-edit="productName">' + esc(s.productName || 'Aether') + '</span>' +
        '<div class="ag-foot-links">' + links + '</div>' +
        '<span class="ag-copy" data-edit="footerCopyright">' + esc(s.footerCopyright || '© 2026') + '</span>' +
        '</div></footer>';
    },

    /* ── 페이지 유형 섹션(pagetypes.js) — data-edit 경로 = pageScaffold 필드명 그대로 ── */
    pagehero: function (s) {
      var label = (s.pageType && window.PAGE_TYPES && window.PAGE_TYPES[s.pageType]) ? window.PAGE_TYPES[s.pageType].label : '';
      return '<section class="ag-phero"><div class="ag-aurora" aria-hidden="true"><div class="ag-a1"></div></div><div class="ag-grid-tx" aria-hidden="true"></div>' +
        '<div class="ag-phero-in rv">' +
        '<h1 class="ag-title ag-title-sm" data-edit="tagline">' + gradTitle(s.tagline || label || '페이지 제목') + '</h1>' +
        (s.subcopy ? '<p class="ag-sub" data-edit="subcopy">' + esc(s.subcopy) + '</p>' : '') +
        '</div></section>';
    },
    overview: function (s) {
      var o = s.overview || {};
      var pts = (o.points && o.points.length) ? o.points : ['핵심 가치 1', '핵심 가치 2', '핵심 가치 3'];
      return '<section class="ag-sec"><div class="ag-wrap ag-ov">' +
        '<div class="rv"><h2 data-edit="overview.title">' + esc(o.title || '한눈에 보는 개요') + '</h2>' +
        '<p class="ag-ov-t" data-edit="overview.text">' + esc(o.text || '무엇을 해결하는 제품인지 두세 문장으로 소개하세요.') + '</p></div>' +
        '<div class="ag-ov-card glass rv" style="--d:.12s">' + pts.map(function (t, i) {
          return '<div class="ag-pt"><span class="ag-macc">' + icon('check', 20) + '</span><span data-edit="overview.points.' + i + '">' + esc(t) + '</span></div>';
        }).join('') + '</div></div></section>';
    },
    intro: function (s) {
      var it = s.intro || {};
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-intro glass rv">' +
        '<h2 data-edit="intro.title">' + esc(it.title || '소개') + '</h2>' +
        '<p data-edit="intro.text">' + esc(it.text || '목적과 기대효과를 소개하세요.') + '</p>' +
        '</div></div></section>';
    },
    featurerows: function (s) {
      var rows = (s.featureRows && s.featureRows.length) ? s.featureRows : [
        { title: '대표 기능 하나', desc: '이 기능이 사용자의 어떤 문제를 어떻게 푸는지 설명하세요.', points: ['포인트 1', '포인트 2'] },
        { title: '대표 기능 둘', desc: '두 번째 상세 기능 설명.', points: ['포인트 1', '포인트 2'] },
      ];
      var ics = ['activity', 'layers', 'shield', 'chart'];
      return '<section class="ag-sec"><div class="ag-wrap ag-frows">' + rows.map(function (r, i) {
        var img = s.images && s.images['featureRows.' + i];
        return '<div class="ag-frow rv" style="--d:' + (i * 0.08) + 's">' +
          '<div><h3 data-edit="featureRows.' + i + '.title">' + esc(r.title) + '</h3>' +
          '<p data-edit="featureRows.' + i + '.desc">' + esc(r.desc || '') + '</p>' +
          ((r.points && r.points.length) ? '<ul class="ag-frow-ul">' + r.points.map(function (p, j) {
            return '<li class="ag-pt"><span class="ag-macc">' + icon('check', 18) + '</span><span data-edit="featureRows.' + i + '.points.' + j + '">' + esc(p) + '</span></li>';
          }).join('') + '</ul>' : '') + '</div>' +
          '<div class="ag-frow-vis glass" data-img="featureRows.' + i + '">' + (img ? '<img src="' + esc(img) + '" alt="">' : icon(ics[i % ics.length], 44)) + '</div>' +
          '</div>';
      }).join('') + '</div></section>';
    },
    gallery: function (s) {
      var items = (s.gallery && s.gallery.length) ? s.gallery : [{ label: 'SCREEN 1' }, { label: 'SCREEN 2' }, { label: 'SCREEN 3' }];
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'galleryTitle', '화면 미리보기') +
        '<div class="ag-gal">' + items.map(function (g, i) {
          var img = s.images && s.images['gallery.' + i];
          return '<figure class="ag-tile glass rv" style="--d:' + (i * 0.08) + 's" data-img="gallery.' + i + '">' +
            (img ? '<img src="' + esc(img) + '" alt="">' : '<span class="ag-tile-l" data-edit="gallery.' + i + '.label">' + esc(g.label || 'SCREEN') + '</span>') +
            '</figure>';
        }).join('') + '</div></div></section>';
    },
    compare: function (s) {
      var c = s.compare || {};
      var rows = (c.rows && c.rows.length) ? c.rows : [{ k: '구축 시간', us: '몇 분', them: '몇 주' }, { k: '비용', us: '구독형', them: '고정 인건비' }, { k: '수정', us: '즉시 반영', them: '외주 왕복' }];
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'compareTitle', '무엇이 다른가요') +
        '<div class="ag-cmp glass rv"><table><thead><tr><th></th>' +
        '<th class="us" data-edit="productName">' + esc(s.productName || 'Aether') + '</th>' +
        '<th data-edit="compare.them">' + esc(c.them || '기존 방식') + '</th></tr></thead><tbody>' +
        rows.map(function (r, i) {
          return '<tr><td data-edit="compare.rows.' + i + '.k">' + esc(r.k) + '</td><td class="us" data-edit="compare.rows.' + i + '.us">' + esc(r.us) + '</td><td data-edit="compare.rows.' + i + '.them">' + esc(r.them) + '</td></tr>';
        }).join('') + '</tbody></table></div></div></section>';
    },
    faq: function (s) {
      var items = (s.faq && s.faq.length) ? s.faq : [{ q: '어떤 서비스인가요?', a: '서비스를 한 문장으로 설명해주세요.' }, { q: '도입까지 얼마나 걸리나요?', a: '보통 걸리는 기간과 절차를 안내하세요.' }, { q: '요금은 어떻게 되나요?', a: '과금 방식을 안내하세요.' }];
      /* <details> 글래스 아코디언 — JS 무의존이라 새창 미리보기에서도 그대로 동작 */
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'faqTitle', '자주 묻는 질문') +
        '<div class="ag-faq">' + items.map(function (f, i) {
          return '<details class="ag-qa glass rv" style="--d:' + (i * 0.06) + 's"' + (i === 0 ? ' open' : '') + '>' +
            '<summary><span data-edit="faq.' + i + '.q">' + esc(f.q) + '</span><span class="ag-chev">' + icon('chev', 18) + '</span></summary>' +
            '<div class="ag-qa-a"><p data-edit="faq.' + i + '.a">' + esc(f.a || '') + '</p></div></details>';
        }).join('') + '</div></div></section>';
    },
    testimonial: function (s) {
      var items = (s.testimonials && s.testimonials.length) ? s.testimonials : [
        { text: '도입 후 리포트 준비 시간이 절반으로 줄었습니다.', by: '김OO · 데이터 팀장' },
        { text: '개발자 없이도 파이프라인을 직접 고칠 수 있어요.', by: '이OO · 프로덕트 매니저' },
        { text: '장애 알림이 빨라져 대응 속도가 완전히 달라졌습니다.', by: '박OO · 인프라 리드' },
      ];
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'testimonialTitle', '먼저 써본 팀들의 이야기') +
        '<div class="ag-quotes">' + items.map(function (q, i) {
          return '<figure class="ag-quote glass rv" style="--d:' + (i * 0.08) + 's"><span class="ag-macc">' + icon('quote', 22) + '</span>' +
            '<blockquote data-edit="testimonials.' + i + '.text">' + esc(q.text) + '</blockquote>' +
            '<figcaption class="ag-quote-by" data-edit="testimonials.' + i + '.by">' + esc(q.by || '') + '</figcaption></figure>';
        }).join('') + '</div></div></section>';
    },
    form: function (s) {
      var f = s.form || {};
      var fields = (f.fields && f.fields.length) ? f.fields : ['회사명', '담당자 이름', '이메일', '문의 내용'];
      /* 정적 데모 폼 — 제출 비활성(type=button, 핸들러 없음) */
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-form glass rv">' +
        '<h2 data-edit="form.title">' + esc(f.title || '도입 문의') + '</h2>' +
        '<p class="ag-form-sub" data-edit="form.sub">' + esc(f.sub || '남겨주시면 1영업일 안에 연락드립니다.') + '</p>' +
        fields.map(function (name, i) {
          var ta = /내용|메시지/.test(String(name));
          return '<div class="ag-fld"><label data-edit="form.fields.' + i + '">' + esc(name) + '</label>' + (ta ? '<textarea></textarea>' : '<input type="text">') + '</div>';
        }).join('') +
        '<button type="button" class="ag-btn ag-btn-pri" data-edit="form.submit">' + esc(f.submit || '문의 보내기') + '</button>' +
        '</div></div></section>';
    },
    infocards: function (s) {
      var items = (s.infoCards && s.infoCards.length) ? s.infoCards : [{ title: '이메일', text: 'contact@example.com' }, { title: '전화', text: '02-000-0000' }, { title: '도입 절차', text: '문의, 상담, 견적을 거쳐 도입까지 안내합니다.' }];
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-info">' + items.map(function (c, i) {
        return '<div class="ag-info-c glass rv" style="--d:' + (i * 0.08) + 's"><h3 data-edit="infoCards.' + i + '.title">' + esc(c.title) + '</h3><p data-edit="infoCards.' + i + '.text">' + esc(c.text || '') + '</p></div>';
      }).join('') + '</div></div></section>';
    },
    doclist: function (s) {
      var items = (s.docs && s.docs.length) ? s.docs : [{ title: '시작하기', desc: '설치와 첫 설정' }, { title: '핵심 기능', desc: '주요 기능 사용법' }, { title: '관리자 가이드', desc: '권한·설정 관리' }, { title: '자주 묻는 질문', desc: '문제 해결 모음' }];
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-docs">' + items.map(function (d, i) {
        return '<a class="ag-doc glass rv" href="#" style="--d:' + (i * 0.07) + 's"><span class="ag-ic glass">' + icon('file', 20) + '</span>' +
          '<div class="ag-doc-tx"><h3 data-edit="docs.' + i + '.title">' + esc(d.title) + '</h3><p data-edit="docs.' + i + '.desc">' + esc(d.desc || '') + '</p></div>' +
          '<span class="ag-doc-go">' + icon('arrow', 18) + '</span></a>';
      }).join('') + '</div></div></section>';
    },
    steps: function (s) {
      var items = (s.steps && s.steps.length) ? s.steps : [{ title: '가입', text: '계정을 만듭니다.' }, { title: '설정', text: '기본 정보를 입력합니다.' }, { title: '시작', text: '첫 결과물을 만듭니다.' }];
      /* 번호는 CSS 카운터로 생성(비편집 장식 텍스트를 DOM에 넣지 않기 위함) */
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'stepsTitle', '이렇게 시작하세요') +
        '<ol class="ag-stps">' + items.map(function (st, i) {
          return '<li class="ag-stp glass rv" style="--d:' + (i * 0.08) + 's"><h3 data-edit="steps.' + i + '.title">' + esc(st.title) + '</h3><p data-edit="steps.' + i + '.text">' + esc(st.text || '') + '</p></li>';
        }).join('') + '</ol></div></section>';
    },
    bloglist: function (s) {
      var items = (s.posts && s.posts.length) ? s.posts : [{ title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' }, { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' }, { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' }];
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-posts">' + items.map(function (p, i) {
        return '<a class="ag-post glass rv" href="#" style="--d:' + (i * 0.08) + 's">' +
          '<div class="ag-post-meta"><span class="ag-tag" data-edit="posts.' + i + '.tag">' + esc(p.tag || 'NEWS') + '</span><span class="ag-date" data-edit="posts.' + i + '.date">' + esc(p.date || '') + '</span></div>' +
          '<h3 data-edit="posts.' + i + '.title">' + esc(p.title) + '</h3><p data-edit="posts.' + i + '.desc">' + esc(p.desc || '') + '</p></a>';
      }).join('') + '</div></div></section>';
    },
    agenda: function (s) {
      var items = (s.agenda && s.agenda.length) ? s.agenda : [{ time: '14:00', title: '오프닝', desc: '환영 인사' }, { time: '14:30', title: '세션 1', desc: '주제 발표' }, { time: '15:30', title: '세션 2', desc: '사례 공유' }, { time: '16:30', title: '네트워킹', desc: '자유 교류' }];
      /* 글로우 도트 + 그린 그라디언트 스파인 타임라인 */
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'agendaTitle', '프로그램') +
        '<div class="ag-tl">' + items.map(function (a, i) {
          return '<div class="ag-tl-i rv" style="--d:' + (i * 0.08) + 's"><div class="ag-tl-c glass">' +
            '<span class="ag-tl-t" data-edit="agenda.' + i + '.time">' + esc(a.time || '') + '</span>' +
            '<h3 data-edit="agenda.' + i + '.title">' + esc(a.title) + '</h3>' +
            (a.desc ? '<p data-edit="agenda.' + i + '.desc">' + esc(a.desc) + '</p>' : '') +
            '</div></div>';
        }).join('') + '</div></div></section>';
    },
    speakers: function (s) {
      var items = (s.speakers && s.speakers.length) ? s.speakers : [{ name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }, { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }, { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }];
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'speakersTitle', '연사 소개') +
        '<div class="ag-spk">' + items.map(function (p, i) {
          var img = s.images && s.images['speakers.' + i];
          return '<div class="ag-spk-c glass rv" style="--d:' + (i * 0.08) + 's">' +
            '<span class="ag-ava glass" data-img="speakers.' + i + '">' + (img ? '<img src="' + esc(img) + '" alt="">' : icon('user', 30)) + '</span>' +
            '<h3 data-edit="speakers.' + i + '.name">' + esc(p.name) + '</h3>' +
            '<span class="ag-spk-r" data-edit="speakers.' + i + '.role">' + esc(p.role || '') + '</span>' +
            '<p data-edit="speakers.' + i + '.desc">' + esc(p.desc || '') + '</p></div>';
        }).join('') + '</div></div></section>';
    },
    notice: function (s) {
      var items = (s.notices && s.notices.length) ? s.notices : [{ title: '참가 안내', text: '사전 등록 필수, 선착순 마감.' }, { title: '주차 안내', text: '행사장 주차 지원 여부를 안내하세요.' }, { title: '문의', text: 'event@example.com' }];
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'noticeTitle', '안내 사항') +
        '<div class="ag-ntc">' + items.map(function (n, i) {
          return '<div class="ag-ntc-c glass rv" style="--d:' + (i * 0.08) + 's"><span class="ag-macc">' + icon('shield', 20) + '</span>' +
            '<div><h3 data-edit="notices.' + i + '.title">' + esc(n.title) + '</h3><p data-edit="notices.' + i + '.text">' + esc(n.text || '') + '</p></div></div>';
        }).join('') + '</div></div></section>';
    },
    pricing: function (s) {
      var items = (s.tiers && s.tiers.length) ? s.tiers : [
        { name: 'Starter', price: '₩0', per: '월 · 개인', features: ['기본 기능', '프로젝트 1개', '커뮤니티 지원'] },
        { name: 'Pro', price: '₩29,000', per: '월 · 팀', features: ['모든 기능', '무제한 프로젝트', '우선 지원'], featured: true },
        { name: 'Enterprise', price: '별도 문의', per: '연 · 맞춤 계약', features: ['전담 매니저', 'SSO·감사 로그', 'SLA 보장'] },
      ];
      var anyHot = items.some(function (x) { return x.featured; });
      return '<section class="ag-sec"><div class="ag-wrap">' + head(s, 'pricingTitle', '요금제') +
        '<div class="ag-plans">' + items.map(function (t, i) {
          var hot = t.featured || (!anyHot && items.length === 3 && i === 1);
          return '<div class="ag-plan glass rv' + (hot ? ' hot' : '') + '" style="--d:' + (i * 0.08) + 's">' +
            '<span class="ag-plan-n" data-edit="tiers.' + i + '.name">' + esc(t.name) + '</span>' +
            '<b class="ag-plan-p" data-edit="tiers.' + i + '.price">' + esc(t.price) + '</b>' +
            '<span class="ag-plan-per" data-edit="tiers.' + i + '.per">' + esc(t.per || '') + '</span>' +
            '<ul>' + (t.features || []).map(function (ft, j) {
              return '<li><span class="ag-macc">' + icon('check', 16) + '</span><span data-edit="tiers.' + i + '.features.' + j + '">' + esc(ft) + '</span></li>';
            }).join('') + '</ul>' +
            '<a class="ag-btn ' + (hot ? 'ag-btn-pri' : 'ag-btn-gh') + '" href="#" data-edit="tiers.' + i + '.cta">' + esc(t.cta || s.primaryCta || '시작하기') + '</a></div>';
        }).join('') + '</div></div></section>';
    },
  };

  /* 정식 어휘 ↔ 이 팩 렌더러 이름 매핑(pagetypes.js는 stats, 이 팩은 stat) */
  var ALIAS = { stats: 'stat', metrics: 'stat', banner: 'cta', quote: 'testimonial' };
  function rendererFor(type) {
    if (S[type]) return S[type];
    if (ALIAS[type] && S[ALIAS[type]]) return S[ALIAS[type]];
    var fb = (window.SECTION_FALLBACK && window.SECTION_FALLBACK[type]) || [];
    for (var i = 0; i < fb.length; i++) {
      var t = fb[i];
      if (S[t]) return S[t];
      if (ALIAS[t] && S[ALIAS[t]]) return S[ALIAS[t]];
    }
    return null; /* 끝까지 없으면 생략 — 깨지지 않는 게 우선 */
  }

  var TPL = [
    { type: 'nav', tier: 'core' }, { type: 'hero', tier: 'core' }, { type: 'feature', tier: 'core' },
    { type: 'showcase', tier: 'rich' }, { type: 'stat', tier: 'mid' }, { type: 'cta', tier: 'rich' }, { type: 'footer', tier: 'core' },
  ];

  /* pageType이 있고 pagetypes.js가 로드돼 있으면 그 구성, 아니면 기존 TPL(하위호환) */
  function pageTemplate(shared) {
    var pt = shared && shared.pageType;
    if (pt && window.PAGE_TYPES && window.PAGE_TYPES[pt] && window.PAGE_TYPES[pt].sections)
      return [{ type: 'nav', tier: 'core' }].concat(window.PAGE_TYPES[pt].sections, [{ type: 'footer', tier: 'core' }]);
    return TPL;
  }

  function visibleSections(shared, vol) {
    var tpl = pageTemplate(shared);
    var fixed = ['nav', 'footer'];
    var head = tpl.filter(function (s) { return s.type === 'nav'; });
    var foot = tpl.filter(function (s) { return s.type === 'footer'; });
    var body = tpl.filter(function (s) { return fixed.indexOf(s.type) < 0; });
    var hidden = shared.hiddenSections || [], shown = shared.shownSections || [];
    var vis = body.filter(function (s) { var def = includesTier(vol, s.tier); return def ? hidden.indexOf(s.type) < 0 : shown.indexOf(s.type) >= 0; });
    var order = shared.sectionOrder || [];
    if (order.length) { var by = {}; vis.forEach(function (s) { by[s.type] = s; }); var ord = []; order.forEach(function (t) { if (by[t]) ord.push(by[t]); }); vis.forEach(function (s) { if (order.indexOf(s.type) < 0) ord.push(s); }); vis = ord; }
    return head.concat(vis, foot);
  }

  function css(motion) {
    var anim = motion !== 'static';
    return '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap");' +
      'body{margin:0}' +
      '.aglass{background:' + T.ink + ';color:' + T.text + ';font-family:' + T.fontB + ';-webkit-font-smoothing:antialiased;overflow-x:hidden}' +
      '.aglass *{box-sizing:border-box}' +
      '.aglass h1,.aglass h2,.aglass h3{margin:0;font-family:' + T.fontD + ';color:#fff;line-height:1.15}' +
      '.aglass p{margin:0}.aglass a{color:inherit;text-decoration:none}' +
      '.glass{background:' + T.glassBg + ';border:1px solid ' + T.glassBd + ';-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}' +
      '.ag-wrap{max-width:1120px;margin:0 auto;padding:0 24px}' +
      /* 조립기가 섹션마다 <div data-section> 래퍼를 씌움 → .ag-sec는 항상 first-child라 padding-top:0이 전 섹션에 걸렸었다(여백 실종 버그). 페이지 첫 래퍼일 때만 0 */
      '.ag-sec{padding:112px 0}[data-section]:first-child > .ag-sec{padding-top:0}' +
      /* nav */
      '.ag-nav{position:fixed;top:16px;left:0;right:0;z-index:50;display:flex;justify-content:center;padding:0 16px}' +
      '.ag-nav-in{width:100%;max-width:880px;border-radius:999px;display:flex;align-items:center;gap:24px;padding:8px 8px 8px 20px}' +
      '.ag-logo{font-family:' + T.fontD + ';font-weight:700;color:#fff;font-size:18px;letter-spacing:-.02em}' +
      '.ag-links{display:flex;gap:22px;font-size:14px;color:' + T.muted + ';margin-left:4px}' +
      '.ag-links a:hover{color:#fff}' +
      '@media(max-width:720px){.ag-links{display:none}}' +
      '.ag-btn{cursor:pointer;font-weight:600;border-radius:999px;transition:all .25s;display:inline-block}' +
      '.ag-btn-pri{background:' + T.green + ';color:' + T.ink + ';padding:10px 20px;font-size:14px;box-shadow:0 0 30px rgba(3,199,90,.45)}' +
      '.ag-btn-pri:hover{filter:brightness(1.1)}' +
      '.ag-nav .ag-btn-pri{margin-left:auto}' +
      '.ag-btn-gh{padding:14px 28px;font-size:16px;background:' + T.glassBg + ';border:1px solid ' + T.glassBd + ';color:#d1fae5}' +
      '.ag-hero .ag-btn-pri{padding:15px 30px;font-size:17px}' +
      /* hero */
      '.ag-hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;text-align:center;padding:120px 0 60px}' +
      '.ag-aurora{position:absolute;inset:0}' +
      '.ag-a1,.ag-a2{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);border-radius:50%;filter:blur(120px)}' +
      '.ag-a1{width:min(1200px,130vw);height:min(1200px,130vw);opacity:.55;background:conic-gradient(from 0deg,#065F46,#03C75A,#16A34A,#03C75A,#065F46)' + (anim ? ';animation:ag-spin 44s linear infinite' : '') + '}' +
      '.ag-a2{width:min(820px,90vw);height:min(820px,90vw);opacity:.45;background:conic-gradient(from 120deg,transparent,#03C75A,transparent,#03C75A,transparent)' + (anim ? ';animation:ag-spin-r 34s linear infinite' : '') + '}' +
      '.ag-grid-tx{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.10) 1px,transparent 1px);background-size:24px 24px;-webkit-mask-image:radial-gradient(circle at 50% 40%,#000,transparent 72%);mask-image:radial-gradient(circle at 50% 40%,#000,transparent 72%)}' +
      '.ag-hero-in{position:relative;z-index:2;max-width:900px;padding:0 24px}' +
      '.ag-title{font-size:clamp(40px,7vw,76px);font-weight:700;letter-spacing:-.02em}' +
      /* 편집 중(contenteditable) 새로 입력한 글자도 그라디언트 유지 — .ag-w 밖 텍스트가 흰색으로 보이는 문제 방지 */
      '.ag-title[contenteditable="true"]{background:linear-gradient(135deg,#86efac,#4ade80 45%,#4ade80);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}' +
      '.ag-hl{display:block}' +
      '.ag-w{display:inline-block;background:linear-gradient(135deg,#86efac,#4ade80 45%,#4ade80);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 40px rgba(3,199,90,.35)' + (anim ? ';opacity:0;transform:translateY(40px);animation:ag-up .7s cubic-bezier(.2,.9,.3,1) forwards;animation-delay:var(--d)' : '') + '}' +
      '.ag-sub{margin:26px auto 0;max-width:640px;font-size:19px;line-height:1.7;color:' + T.muted + '}' +
      '.ag-cta-row{margin-top:34px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap}' +
      '.ag-mock{margin:56px auto 0;max-width:760px;perspective:1000px}' +
      '.ag-mock-in{border-radius:18px;padding:22px}' +
      '.ag-mock-in img{display:block;width:100%;border-radius:12px}' +
      '.ag-mrow{display:flex;align-items:center;gap:8px;color:#fff;font-family:' + T.fontD + ';margin-bottom:18px}.ag-macc{color:' + T.green + '}' +
      '.ag-mstats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}' +
      '.ag-mstat{border-radius:12px;padding:12px 14px}.ag-mstat span{display:block;font-size:11px;color:' + T.muted + '}.ag-mstat b{font-family:' + T.fontD + ';font-size:18px;color:#fff}' +
      '.ag-bars{border-radius:12px;padding:16px;height:150px;display:flex;align-items:flex-end;gap:8px}' +
      '.ag-bars i{flex:1;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#4ade80,#03C75A);height:' + (anim ? '0' : 'var(--h)') + (anim ? ';animation:ag-bar .7s ease forwards;animation-delay:calc(.2s + var(--i)*.06s)' : '') + '}' +
      /* sections */
      '.ag-eyebrow{color:' + T.green + ';font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}' +
      '.ag-head{text-align:center;max-width:640px;margin:0 auto 60px}.ag-head h2{font-size:clamp(28px,4vw,44px)}' +
      '.ag-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}' +
      '@media(max-width:820px){.ag-cards{grid-template-columns:1fr}}' +
      '.ag-card{border-radius:18px;padding:28px;transition:transform .3s cubic-bezier(.2,.9,.3,1),border-color .3s}.ag-card:hover{transform:translateY(-8px);border-color:rgba(3,199,90,.4)}.ag-card h3{font-size:20px;margin-bottom:8px}.ag-card p{color:' + T.muted + ';line-height:1.65;font-size:15px}' +
      '.ag-ic{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;color:' + T.green + ';margin-bottom:18px}' +
      /* showcase */
      '.ag-show{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}' +
      '@media(max-width:820px){.ag-show{grid-template-columns:1fr;gap:32px}}' +
      '.ag-show-l h2{font-size:clamp(26px,3.4vw,38px);margin-bottom:16px}.ag-show-d{color:' + T.muted + ';line-height:1.7;margin-bottom:24px}' +
      '.ag-show-ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px}' +
      '.ag-show-ul li{display:flex;align-items:center;gap:12px;color:rgba(226,232,240,.88)}.ag-macc{color:' + T.green + ';display:inline-flex}' +
      '.ag-show-r{border-radius:18px;padding:24px}' +
      '.ag-show-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;color:#fff;font-family:' + T.fontD + '}' +
      '.ag-run{font-size:12px;color:' + T.green + ';display:inline-flex;align-items:center;gap:6px}.ag-run:before{content:"";width:7px;height:7px;border-radius:50%;background:' + T.green + '}' +
      '.ag-step{border-radius:12px;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.ag-step:last-child{margin-bottom:0}.ag-step span{font-size:14px;color:rgba(226,232,240,.9)}.ag-step i{font-size:12px;color:' + T.muted + ';font-style:normal}' +
      '.ag-stat-sec{border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}' +
      '.ag-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:24px;text-align:center}' +
      '@media(max-width:720px){.ag-stats{grid-template-columns:repeat(2,1fr)}}' +
      '.ag-stat-v{font-family:' + T.fontD + ';font-size:clamp(30px,4vw,46px);font-weight:700;color:#fff}.ag-stat-l{margin-top:6px;font-size:14px;color:' + T.muted + '}' +
      '.ag-cta{position:relative;overflow:hidden;border-radius:26px;text-align:center;padding:64px 32px;max-width:900px;margin:0 auto}' +
      '.ag-cta h2{font-size:clamp(28px,4vw,46px);margin-bottom:18px}.ag-cta p{color:' + T.muted + ';max-width:520px;margin:0 auto 32px}' +
      '.ag-cta-glow{position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(3,199,90,.35),transparent 70%);filter:blur(60px)}' +
      '.ag-foot{border-top:1px solid rgba(255,255,255,.06);padding:44px 0}.ag-foot-in{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;color:' + T.muted + ';font-size:14px}' +
      '.ag-foot-links{display:flex;gap:22px}.ag-foot-links a:hover{color:#fff}' +
      /* ── 페이지 유형 섹션 ── */
      '.ag-head-sm{margin-bottom:44px}.ag-head-sm h2{font-size:clamp(24px,3.2vw,36px)}' +
      /* pagehero — 얕은 다크 히어로(서브페이지) */
      '.ag-phero{position:relative;overflow:hidden;text-align:center;padding:180px 24px 96px}' +
      '.ag-phero .ag-a1{opacity:.32}' +
      '.ag-phero-in{position:relative;z-index:2;max-width:820px;margin:0 auto}' +
      '.ag-title-sm{font-size:clamp(32px,5vw,54px)}' +
      '.ag-phero .ag-sub{margin-top:18px;font-size:17px}' +
      /* overview */
      '.ag-ov{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}' +
      '@media(max-width:820px){.ag-ov{grid-template-columns:1fr;gap:28px}}' +
      '.ag-ov h2{font-size:clamp(26px,3.4vw,38px);margin-bottom:16px}.ag-ov-t{color:' + T.muted + ';line-height:1.75}' +
      '.ag-ov-card{border-radius:18px;padding:28px;display:flex;flex-direction:column;gap:14px}' +
      '.ag-pt{display:flex;align-items:center;gap:12px;color:rgba(226,232,240,.9);font-size:15px}' +
      /* intro */
      '.ag-intro{max-width:680px;margin:0 auto;text-align:center;border-radius:22px;padding:48px 36px}' +
      '.ag-intro h2{font-size:clamp(24px,3vw,34px);margin-bottom:14px}.ag-intro p{color:' + T.muted + ';line-height:1.75}' +
      /* featurerows — 교차 2단 */
      '.ag-frows{display:flex;flex-direction:column;gap:64px}' +
      '.ag-frow{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}' +
      '.ag-frow:nth-child(even) .ag-frow-vis{order:-1}' +
      '@media(max-width:820px){.ag-frow{grid-template-columns:1fr;gap:24px}.ag-frow:nth-child(even) .ag-frow-vis{order:0}}' +
      '.ag-frow h3{font-size:clamp(22px,2.6vw,30px);margin-bottom:12px}.ag-frow>div>p{color:' + T.muted + ';line-height:1.7;margin-bottom:18px}' +
      '.ag-frow-ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}' +
      '.ag-frow-vis{border-radius:18px;min-height:260px;display:grid;place-items:center;color:' + T.green + ';overflow:hidden}' +
      '.ag-frow-vis img{display:block;width:100%;height:100%;object-fit:cover}' +
      /* gallery */
      '.ag-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}' +
      '@media(max-width:820px){.ag-gal{grid-template-columns:1fr}}' +
      '.ag-tile{margin:0;border-radius:16px;aspect-ratio:4/3;display:grid;place-items:center;overflow:hidden;transition:border-color .3s}.ag-tile:hover{border-color:rgba(3,199,90,.4)}' +
      '.ag-tile img{width:100%;height:100%;object-fit:cover}' +
      '.ag-tile-l{font-family:' + T.fontD + ';letter-spacing:.14em;font-size:13px;color:' + T.muted + '}' +
      /* compare */
      '.ag-cmp{border-radius:18px;padding:8px 24px;overflow-x:auto}' +
      '.ag-cmp table{width:100%;border-collapse:collapse;min-width:480px}' +
      '.ag-cmp th,.ag-cmp td{padding:16px 14px;text-align:left;border-bottom:1px solid rgba(255,255,255,.08);font-size:15px}' +
      '.ag-cmp tr:last-child td{border-bottom:none}' +
      '.ag-cmp th{font-family:' + T.fontD + ';color:#fff}.ag-cmp td{color:rgba(226,232,240,.85)}' +
      '.ag-cmp th.us{color:' + T.green + '}.ag-cmp td.us{color:' + T.greenLt + ';font-weight:600}' +
      /* faq — <details> 글래스 아코디언 */
      '.ag-faq{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:14px}' +
      '.ag-qa{border-radius:16px;padding:0 24px;transition:border-color .25s}.ag-qa[open]{border-color:rgba(3,199,90,.4)}' +
      '.ag-qa summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0;font-family:' + T.fontD + ';font-weight:600;color:#fff;font-size:16px}' +
      '.ag-qa summary::-webkit-details-marker{display:none}' +
      '.ag-chev{flex:none;display:inline-flex;color:' + T.green + ';transition:transform .25s}.ag-qa[open] .ag-chev{transform:rotate(180deg)}' +
      '.ag-qa-a{padding:0 0 20px;color:' + T.muted + ';line-height:1.7;font-size:15px}.ag-qa-a p{margin:0}' +
      /* testimonial */
      '.ag-quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}' +
      '@media(max-width:820px){.ag-quotes{grid-template-columns:1fr}}' +
      '.ag-quote{margin:0;border-radius:18px;padding:28px;display:flex;flex-direction:column;gap:14px}' +
      '.ag-quote blockquote{margin:0;color:rgba(226,232,240,.9);line-height:1.7;font-size:15px;flex:1}' +
      '.ag-quote-by{font-size:13px;color:' + T.muted + '}' +
      /* form — 정적 글래스 폼 */
      '.ag-form{max-width:560px;margin:0 auto;border-radius:22px;padding:40px 36px}' +
      '.ag-form h2{font-size:clamp(24px,3vw,32px);margin-bottom:8px;text-align:center}' +
      '.ag-form-sub{color:' + T.muted + ';text-align:center;margin-bottom:28px;font-size:15px}' +
      '.ag-fld{margin-bottom:18px}.ag-fld label{display:block;font-size:13px;font-weight:600;color:rgba(226,232,240,.85);margin-bottom:8px}' +
      '.ag-fld input,.ag-fld textarea{width:100%;border-radius:12px;border:1px solid ' + T.glassBd + ';background:rgba(255,255,255,.04);padding:12px 14px;color:#fff;font:inherit;font-size:14px;outline:none}' +
      '.ag-fld input:focus,.ag-fld textarea:focus{border-color:rgba(3,199,90,.5)}' +
      '.ag-fld textarea{min-height:110px;resize:vertical}' +
      '.ag-form .ag-btn-pri{width:100%;border:none;padding:14px;font-size:15px;margin-top:6px;font-family:inherit}' +
      /* infocards */
      '.ag-info{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}' +
      '@media(max-width:820px){.ag-info{grid-template-columns:1fr}}' +
      '.ag-info-c{border-radius:16px;padding:24px}.ag-info-c h3{font-size:14px;font-weight:600;letter-spacing:.06em;color:' + T.green + ';margin-bottom:8px}.ag-info-c p{color:rgba(226,232,240,.88);font-size:15px;line-height:1.6}' +
      /* doclist */
      '.ag-docs{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}' +
      '@media(max-width:720px){.ag-docs{grid-template-columns:1fr}}' +
      '.ag-doc{border-radius:16px;padding:24px;display:flex;gap:16px;align-items:flex-start;transition:transform .3s cubic-bezier(.2,.9,.3,1),border-color .3s}.ag-doc:hover{transform:translateY(-4px);border-color:rgba(3,199,90,.4)}' +
      '.ag-doc .ag-ic{margin:0;flex:none;width:42px;height:42px}' +
      '.ag-doc-tx{flex:1}.ag-doc h3{font-size:17px;margin-bottom:6px}.ag-doc p{color:' + T.muted + ';font-size:14px;line-height:1.6}' +
      '.ag-doc-go{color:' + T.muted + ';flex:none;align-self:center;display:inline-flex}.ag-doc:hover .ag-doc-go{color:' + T.green + '}' +
      /* steps — CSS 카운터 번호 배지 */
      '.ag-stps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;counter-reset:agstep}' +
      '@media(max-width:720px){.ag-stps{grid-template-columns:1fr}}' +
      '.ag-stp{border-radius:16px;padding:26px;counter-increment:agstep}' +
      '.ag-stp:before{content:counter(agstep,decimal-leading-zero);display:inline-block;font-family:' + T.fontD + ';font-weight:700;font-size:12px;letter-spacing:.1em;color:' + T.ink + ';background:' + T.green + ';border-radius:999px;padding:4px 10px;margin-bottom:14px;box-shadow:0 0 18px rgba(3,199,90,.45)}' +
      '.ag-stp h3{font-size:18px;margin-bottom:8px}.ag-stp p{color:' + T.muted + ';font-size:14px;line-height:1.65}' +
      /* bloglist */
      '.ag-posts{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}' +
      '@media(max-width:820px){.ag-posts{grid-template-columns:1fr}}' +
      '.ag-post{border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:12px;transition:transform .3s cubic-bezier(.2,.9,.3,1),border-color .3s}.ag-post:hover{transform:translateY(-4px);border-color:rgba(3,199,90,.4)}' +
      '.ag-post-meta{display:flex;align-items:center;gap:10px;font-size:12px}' +
      '.ag-tag{color:' + T.green + ';border:1px solid rgba(3,199,90,.35);border-radius:999px;padding:3px 10px;font-weight:600;letter-spacing:.08em}' +
      '.ag-date{color:' + T.muted + '}' +
      '.ag-post h3{font-size:18px;line-height:1.4}.ag-post p{color:' + T.muted + ';font-size:14px;line-height:1.65;flex:1}' +
      /* agenda — 글로우 타임라인 */
      '.ag-tl{max-width:640px;margin:0 auto;position:relative;padding-left:34px}' +
      '.ag-tl:before{content:"";position:absolute;left:7px;top:8px;bottom:8px;width:2px;background:linear-gradient(180deg,rgba(3,199,90,.65),rgba(3,199,90,.06))}' +
      '.ag-tl-i{position:relative;padding-bottom:24px}.ag-tl-i:last-child{padding-bottom:0}' +
      '.ag-tl-i:before{content:"";position:absolute;left:-33px;top:20px;width:14px;height:14px;border-radius:50%;background:' + T.ink + ';border:2px solid ' + T.green + ';box-shadow:0 0 16px rgba(3,199,90,.6)}' +
      '.ag-tl-c{border-radius:14px;padding:18px 20px}' +
      '.ag-tl-t{display:block;font-family:' + T.fontD + ';color:' + T.green + ';font-size:13px;font-weight:600;letter-spacing:.06em;margin-bottom:6px}' +
      '.ag-tl-c h3{font-size:17px;margin-bottom:6px}.ag-tl-c p{color:' + T.muted + ';font-size:14px;line-height:1.6}' +
      /* speakers */
      '.ag-spk{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}' +
      '@media(max-width:820px){.ag-spk{grid-template-columns:1fr}}' +
      '.ag-spk-c{border-radius:18px;padding:28px;text-align:center}' +
      '.ag-ava{width:76px;height:76px;border-radius:50%;margin:0 auto 16px;display:grid;place-items:center;color:' + T.green + ';overflow:hidden;border:1px solid rgba(3,199,90,.35);box-shadow:0 0 24px rgba(3,199,90,.25)}' +
      '.ag-ava img{width:100%;height:100%;object-fit:cover}' +
      '.ag-spk-c h3{font-size:17px}.ag-spk-r{display:block;font-size:13px;color:' + T.greenLt + ';margin:4px 0 10px}.ag-spk-c p{color:' + T.muted + ';font-size:14px;line-height:1.6}' +
      /* notice */
      '.ag-ntc{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}' +
      '@media(max-width:820px){.ag-ntc{grid-template-columns:1fr}}' +
      '.ag-ntc-c{border-radius:16px;padding:22px;display:flex;gap:14px;align-items:flex-start}' +
      '.ag-ntc-c .ag-macc{margin-top:2px;flex:none}' +
      '.ag-ntc-c h3{font-size:15px;margin-bottom:6px}.ag-ntc-c p{color:' + T.muted + ';font-size:14px;line-height:1.6}' +
      /* pricing */
      '.ag-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;align-items:stretch}' +
      '@media(max-width:820px){.ag-plans{grid-template-columns:1fr}}' +
      '.ag-plan{border-radius:20px;padding:32px 28px;display:flex;flex-direction:column}' +
      '.ag-plan.hot{border-color:rgba(3,199,90,.55);box-shadow:0 0 40px rgba(3,199,90,.18),inset 0 1px 0 rgba(255,255,255,.08)}' +
      '.ag-plan-n{font-family:' + T.fontD + ';font-size:14px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:' + T.muted + '}.ag-plan.hot .ag-plan-n{color:' + T.green + '}' +
      '.ag-plan-p{font-family:' + T.fontD + ';font-size:38px;font-weight:700;color:#fff;margin-top:14px}' +
      '.ag-plan-per{display:block;font-size:13px;color:' + T.muted + ';margin:4px 0 22px}' +
      '.ag-plan ul{list-style:none;padding:0;margin:0 0 26px;display:flex;flex-direction:column;gap:10px;flex:1}' +
      '.ag-plan li{display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(226,232,240,.88)}' +
      '.ag-plan .ag-btn{text-align:center;padding:12px;font-size:14px}' +
      /* reveal — 순수 CSS 엔트런스(JS 무의존, 항상 보임 + 스태거) */
      (anim ? '.rv{opacity:0;transform:translateY(24px);animation:ag-rv .7s cubic-bezier(.2,.9,.3,1) both;animation-delay:var(--d,.06s)}' : '.rv{opacity:1}') +
      '@keyframes ag-rv{to{opacity:1;transform:none}}' +
      '@keyframes ag-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}' +
      '@keyframes ag-spin-r{to{transform:translate(-50%,-50%) rotate(-360deg)}}' +
      '@keyframes ag-up{to{opacity:1;transform:none}}' +
      '@keyframes ag-bar{to{height:var(--h)}}' +
      '@media(prefers-reduced-motion:reduce){.ag-w,.ag-bars i,.ag-a1,.ag-a2,.rv{animation:none!important}.ag-w,.rv{opacity:1;transform:none}.ag-bars i{height:var(--h)}}';
  }

  // 리빌은 CSS로 처리(무의존). JS는 마그네틱 버튼 강화만(있으면 좋고, 없어도 무방).
  var REVEAL_JS = '<script>(function(){document.querySelectorAll(".ag-mag").forEach(function(b){b.addEventListener("mousemove",function(e){var r=b.getBoundingClientRect();b.style.transform="translate("+((e.clientX-r.left-r.width/2)*.3)+"px,"+((e.clientY-r.top-r.height/2)*.3)+"px)"});b.addEventListener("mouseleave",function(){b.style.transform=""})});})();<\/script>';

  function renderAetherPage(shared, opts) {
    shared = shared || {}; opts = opts || {};
    var vol = opts.volume || 'heavy';
    var motion = opts.motion || 'subtle';
    var secs = visibleSections(shared, vol);
    var body = secs.map(function (sec) {
      var fn = rendererFor(sec.type); if (!fn) return '';
      try { return '<div data-section="' + esc(sec.type) + '">' + fn(shared) + '</div>'; }
      catch (e) { console.error('[aether] section', sec.type, e); return ''; }
    }).join('');
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css(motion) + '</style></head><body><div class="aglass">' + body + '</div>' +
      (motion !== 'static' ? REVEAL_JS : '') + '</body></html>';
  }

  window.renderAetherPage = renderAetherPage;
  window.AETHER_STYLE = { id: 'aglass', name: 'Aether Glass', desc: '다크 글래스 · 네이버 그린', swatch: 'linear-gradient(135deg,#0B1220 0%,#03C75A 100%)' };
})();
