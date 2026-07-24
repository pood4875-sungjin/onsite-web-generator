/* packs.aether.js — "Aether Glass" 스타일 팩. classic <script src>.
   다크 글래스모피즘 몰입 + 네이버 그린(#03C75A) 포인트. Space Grotesk / DM Sans.
   출처: ui-ux-pro-max 디자인시스템(Immersive/Glassmorphism) + 21st GlassRefractionHero 시안을
   생성기 계약(바닐라)으로 포팅. framer→CSS keyframes + IntersectionObserver 리빌.
   window.renderAetherPage(shared, opts) → 자가완결 HTML. window.AETHER_STYLE 메타. */
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
  };
  function icon(name, size) { return '<svg width="' + (size || 24) + '" height="' + (size || 24) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.bolt) + '</svg>'; }

  /* ── 섹션 렌더러 ── */
  function navLinks(shared) {
    var items = (shared.nav && shared.nav.length) ? shared.nav
      : (shared.footerLinks || []).map(function (t) { return { name: t }; });
    return items.slice(0, 5).map(function (l) {
      var href = l.pageId ? ('#' + l.pageId) : '#';
      var attr = l.pageId ? (' data-nav-page="' + esc(l.pageId) + '"') : '';
      return '<a href="' + href + '"' + attr + '>' + esc(l.name) + '</a>';
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
      var words = String(s.tagline || '데이터가 결정으로 바뀌는 순간').split('\n');
      var title = words.map(function (line) {
        return '<span class="ag-hl">' + line.split(' ').map(function (w, i) { return '<span class="ag-w" style="--d:' + (i * 0.09) + 's">' + esc(w) + '</span>'; }).join(' ') + '</span>';
      }).join('');
      var mock = img
        ? '<div class="ag-mock rv"><div class="ag-mock-in glass"><img src="' + esc(img) + '" data-img="hero" alt=""></div></div>'
        : '<div class="ag-mock rv"><div class="ag-mock-in glass">' +
        '<div class="ag-mrow"><span class="ag-macc">' + icon('activity', 20) + '</span><b>실시간 대시보드</b></div>' +
        '<div class="ag-mstats">' + [['처리량', '2.4M/s'], ['지연', '2.4ms'], ['정확도', '99.9%']].map(function (k) { return '<div class="glass ag-mstat"><span>' + k[0] + '</span><b>' + k[1] + '</b></div>'; }).join('') + '</div>' +
        '<div class="ag-bars glass">' + [42, 68, 55, 88, 60, 74, 96].map(function (h, i) { return '<i style="--h:' + h + '%;--i:' + i + '"></i>'; }).join('') + '</div>' +
        '</div></div>';
      return '<section class="ag-hero"><div class="ag-aurora" aria-hidden="true"><div class="ag-a1"></div><div class="ag-a2"></div></div><div class="ag-grid-tx" aria-hidden="true"></div>' +
        '<div class="ag-hero-in">' +
        '<h1 class="ag-title" data-edit="tagline">' + title + '</h1>' +
        (s.subcopy ? '<p class="ag-sub" data-edit="subcopy">' + esc(s.subcopy) + '</p>' : '') +
        '<div class="ag-cta-row">' +
        '<a class="ag-btn ag-btn-pri ag-mag" href="#" data-edit="primaryCta">' + esc(s.primaryCta || '무료로 시작하기') + '</a>' +
        '<a class="ag-btn ag-btn-gh" href="#">데모 살펴보기</a>' +
        '</div>' + mock +
        '</div></section>';
    },
    feature: function (s) {
      var items = s.features || [];
      if (!items.length) return '';
      return '<section class="ag-sec"><div class="ag-wrap">' +
        '<div class="ag-head rv"><p class="ag-eyebrow">Why ' + esc(s.productName || 'Aether') + '</p><h2 data-edit="featureTitle">' + esc(s.featureTitle || '복잡함은 숨기고, 인사이트만 남깁니다') + '</h2></div>' +
        '<div class="ag-cards">' + items.map(function (f, i) {
          return '<div class="ag-card glass rv" style="--d:' + (i * 0.1) + 's">' +
            '<div class="ag-ic glass">' + icon(f.icon || 'bolt') + '</div>' +
            '<h3 data-edit="features.' + i + '.title">' + esc(f.title) + '</h3><p data-edit="features.' + i + '.desc">' + esc(f.desc || '') + '</p></div>';
        }).join('') + '</div></div></section>';
    },
    stat: function (s) {
      var items = s.stats || [];
      if (!items.length) return '';
      return '<section class="ag-sec ag-stat-sec"><div class="ag-wrap ag-stats">' +
        items.map(function (st, i) { return '<div class="rv" style="--d:' + (i * 0.08) + 's"><div class="ag-stat-v" data-edit="stats.' + i + '.value">' + esc(st.value) + '</div><div class="ag-stat-l" data-edit="stats.' + i + '.label">' + esc(st.label) + '</div></div>'; }).join('') +
        '</div></section>';
    },
    showcase: function (s) {
      var pts = (s.showcasePoints && s.showcasePoints.length) ? s.showcasePoints : ['드래그 앤 드롭 파이프라인 빌더', '자동 이상탐지 & 알림', '예측 지표 & 시나리오 시뮬레이션'];
      var steps = (s.pipeline && s.pipeline.length) ? s.pipeline : [{ k: '수집 · Kafka', v: '2.4ms' }, { k: '변환 · dbt', v: '2.0ms' }, { k: '적재 · Warehouse', v: '1.6ms' }, { k: '예측 · ML', v: '1.2ms' }];
      return '<section class="ag-sec"><div class="ag-wrap ag-show">' +
        '<div class="rv ag-show-l"><p class="ag-eyebrow">Live Showcase</p><h2 data-edit="showcaseTitle">' + esc(s.showcaseTitle || '한 화면에서 수집부터 예측까지') + '</h2>' +
        '<p class="ag-show-d" data-edit="showcaseDesc">' + esc(s.showcaseDesc || '스트림·배치·외부 API를 하나의 파이프라인으로. 이상 징후는 자동 감지되고, 예측 모델이 다음 지표를 미리 알려줍니다.') + '</p>' +
        '<ul class="ag-show-ul">' + pts.map(function (t, i) { return '<li><span class="ag-macc">' + icon('chart', 20) + '</span><span data-edit="showcasePoints.' + i + '">' + esc(t) + '</span></li>'; }).join('') + '</ul></div>' +
        '<div class="rv ag-show-r glass" style="--d:.12s"><div class="ag-show-h"><b>파이프라인 · prod</b><span class="ag-run">running</span></div>' +
        steps.map(function (st, i) { return '<div class="glass ag-step" style="--d:' + (0.1 + i * 0.08) + 's"><span data-edit="pipeline.' + i + '.k">' + esc(st.k) + '</span><i data-edit="pipeline.' + i + '.v">' + esc(st.v) + '</i></div>'; }).join('') +
        '</div></div></section>';
    },
    cta: function (s) {
      if (!s.bannerText) return '';
      return '<section class="ag-sec"><div class="ag-wrap"><div class="ag-cta glass rv">' +
        '<div class="ag-cta-glow" aria-hidden="true"></div>' +
        '<h2 data-edit="bannerText">' + esc(s.bannerText) + '</h2>' +
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
  };

  var TPL = [
    { type: 'nav', tier: 'core' }, { type: 'hero', tier: 'core' }, { type: 'feature', tier: 'core' },
    { type: 'showcase', tier: 'rich' }, { type: 'stat', tier: 'mid' }, { type: 'cta', tier: 'rich' }, { type: 'footer', tier: 'core' },
  ];

  function visibleSections(shared, vol) {
    var fixed = ['nav', 'footer'];
    var head = TPL.filter(function (s) { return s.type === 'nav'; });
    var foot = TPL.filter(function (s) { return s.type === 'footer'; });
    var body = TPL.filter(function (s) { return fixed.indexOf(s.type) < 0; });
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
      '.ag-sec{padding:112px 0}.ag-sec:first-child{padding-top:0}' +
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
      '.ag-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}' +
      '@media(max-width:720px){.ag-stats{grid-template-columns:repeat(2,1fr)}}' +
      '.ag-stat-v{font-family:' + T.fontD + ';font-size:clamp(30px,4vw,46px);font-weight:700;color:#fff}.ag-stat-l{margin-top:6px;font-size:14px;color:' + T.muted + '}' +
      '.ag-cta{position:relative;overflow:hidden;border-radius:26px;text-align:center;padding:64px 32px;max-width:900px;margin:0 auto}' +
      '.ag-cta h2{font-size:clamp(28px,4vw,46px);margin-bottom:18px}.ag-cta p{color:' + T.muted + ';max-width:520px;margin:0 auto 32px}' +
      '.ag-cta-glow{position:absolute;top:-120px;left:50%;transform:translateX(-50%);width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(3,199,90,.35),transparent 70%);filter:blur(60px)}' +
      '.ag-foot{border-top:1px solid rgba(255,255,255,.06);padding:44px 0}.ag-foot-in{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;color:' + T.muted + ';font-size:14px}' +
      '.ag-foot-links{display:flex;gap:22px}.ag-foot-links a:hover{color:#fff}' +
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
      var fn = S[sec.type]; if (!fn) return '';
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
