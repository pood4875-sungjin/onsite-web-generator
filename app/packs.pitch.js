/* packs.pitch.js — Pitch(Creatable) PPT 디자인 시스템 팩. classic <script src>.
   출처: Figma "웹 제너레이터" > Creatable Investment Pitch Template(37장) + Infographic slides(20장).
   원본 캔버스는 1920×1080 → 덱은 1280×720으로 렌더한다(모든 값 ×0.6667).
   1280 고정 이유: export-pptx.js가 96dpi 고정(IN=1/96)이라 1280px=13.33in=16:9 슬라이드와 정확히 맞는다.

   데이터: { slides:[{type, bg?, ...}], style:'pitch' }
   슬라이드 타입 14종: statement·quote·split·grid·stats·bigstat·list·table·pricing·timeline·chart·matrix·gallery·closing
   window.renderPitchDeck(data, opts) → 자가완결 HTML(세로 스택). window.PITCH_STYLE 메타.
   레이아웃 카탈로그(window.PITCH_CATALOG)에 "언제 쓰나"가 붙어 있어 AI가 브리프를 읽고 타입을 고른다. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  function de(path) { return ' data-edit="' + path + '"'; }
  function kind(s, fb) { return esc(String(s.title || fb || s.type || 'Slide').replace(/\n/g, ' ')); }
  function bgClass(s) { var b = s.bg || 'white'; return ' bg-' + (({ white: 1, grey: 1, green: 1, dark: 1 })[b] ? b : 'white'); }

  /* 헤딩 블록 — 원본에서 좌측형(x=120,y=163)과 중앙형(x=378,y=163) 두 프리셋만 반복된다.
     eyebrow(대문자 18→12px) + title(76→50px)이 최소 계약. */
  function headBlock(s, P, align) {
    var a = align || s.align || 'left';
    return '<div class="p-head ' + (a === 'center' ? 'ctr' : '') + '">' +
      (s.eyebrow ? '<p class="p-eyebrow"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow) + '</p>' : '') +
      (s.title ? '<h2 class="p-title"' + de(P + '.title') + '>' + ml(s.title) + '</h2>' : '') +
      (s.lead ? '<p class="p-lead"' + de(P + '.lead') + '>' + ml(s.lead) + '</p>' : '') +
      '</div>';
  }
  // 이미지/목업 자리 — src 없으면 원본과 동일한 회색 플레이스홀더
  function media(m, P, cls) {
    m = m || {};
    if (m.src) return '<div class="p-media ' + (cls || '') + '"><img src="' + esc(m.src) + '" alt=""></div>';
    return '<div class="p-media ph ' + (cls || '') + '"><span' + de(P + '.label') + '>' + esc(m.label || '') + '</span></div>';
  }
  // 콜아웃 = 32 Bold 제목 + 20 Regular 본문 (인포그래픽 전 장표에서 반복되는 단일 프리미티브)
  function callout(c, P) {
    c = c || {};
    return '<div class="p-callout">' +
      (c.head ? '<p class="p-c-head"' + de(P + '.head') + '>' + esc(c.head) + '</p>' : '') +
      (c.text ? '<p class="p-c-text"' + de(P + '.text') + '>' + ml(c.text) + '</p>' : '') + '</div>';
  }

  var R = {
    /* 표지·미션·전환·섹션 구분 — 큰 문장 하나. 원본 01/02/06/26/28 */
    statement: function (s, P) {
      var pos = s.pos || 'bottom';   // bottom(표지) | center(미션·전환)
      return '<section class="slide st ' + pos + bgClass(s) + '" data-kind="' + kind(s, 'Statement') + '">' +
        '<div class="st-in">' +
        (s.eyebrow ? '<p class="p-eyebrow"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow) + '</p>' : '') +
        '<h1 class="st-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</h1>' +
        (s.sub ? '<p class="st-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') +
        '</div></section>';
    },
    /* 인용 — 고객·전문가 발언. 옵션으로 우하단 수치(리뷰 수 등). 원본 35/37 */
    quote: function (s, P) {
      var st = s.stat || null;
      return '<section class="slide qt' + bgClass(s) + '" data-kind="Quote">' +
        (s.image && s.image.src ? '<img class="qt-bgimg" src="' + esc(s.image.src) + '" alt="">' : '') +
        '<div class="qt-in"><p class="qt-text"' + de(P + '.text') + '>' + ml(s.text || '') + '</p>' +
        '<p class="qt-by"' + de(P + '.by') + '>' + esc(s.by || '') + '</p></div>' +
        (st ? '<div class="qt-stat">' + (st.stars ? '<span class="qt-stars">★★★★★</span>' : '') +
          '<p class="qt-num"' + de(P + '.stat.value') + '>' + esc(st.value || '') + '</p>' +
          '<p class="qt-lab"' + de(P + '.stat.label') + '>' + esc(st.label || '') + '</p></div>' : '') +
        '</section>';
    },
    /* 좌우 2분할 — 한쪽은 텍스트, 다른 쪽은 이미지·목업·컬러패널·차트.
       원본 03/07/09/16/11/33/36/22 (미러 포함) */
    split: function (s, P) {
      var side = s.side === 'left' ? 'left' : 'right';   // 비주얼이 어느 쪽인지
      var vis = s.visual || {};
      var v = '';
      if (vis.kind === 'panel') v = '<div class="sp-panel"></div>';
      else if (vis.kind === 'chart') v = '<div class="sp-chart">' + chartSVG(s.chart, P + '.chart') + '</div>';
      else v = media(vis, P + '.visual', 'full');
      var body = '';
      if (s.bullets && s.bullets.length) body += '<ul class="p-bullets">' + s.bullets.map(function (b, i) {
        return '<li><span class="p-tick"></span><span' + de(P + '.bullets.' + i) + '>' + ml(b) + '</span></li>';
      }).join('') + '</ul>';
      if (s.text) body += '<p class="p-body"' + de(P + '.text') + '>' + ml(s.text) + '</p>';
      if (s.stat) body += '<div class="sp-stat"><p class="sp-num"' + de(P + '.stat.value') + '>' + esc(s.stat.value || '') + '</p>' +
        '<p class="sp-lab"' + de(P + '.stat.label') + '>' + ml(s.stat.label || '') + '</p></div>';
      if (s.note) body += '<p class="p-note"' + de(P + '.note') + '>' + ml(s.note) + '</p>';
      return '<section class="slide sp v-' + side + bgClass(s) + '" data-kind="' + kind(s, 'Split') + '">' +
        '<div class="sp-txt">' + headBlock(s, P, 'left') + body + '</div>' +
        '<div class="sp-vis">' + v + '</div></section>';
    },
    /* 헤딩 + N열 반복 — 반복 단위가 아이콘박스/텍스트/카드/인물로 교체된다.
       원본 04/08/13/15/18/23/24/29/34 */
    grid: function (s, P) {
      var items = s.items || [], cols = s.cols || Math.min(items.length || 3, 4);
      var variant = s.variant || 'text';   // text | icon | card | person
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, inner = '';
        if (variant === 'card' || variant === 'person') inner += media(it.image || {}, IP + '.image', variant === 'person' ? 'sq' : 'card');
        if (variant === 'icon') inner += '<span class="p-tick lg"></span>';
        inner += '<p class="g-head"' + de(IP + '.head') + '>' + esc(it.head || '') + '</p>';
        if (it.role) inner += '<p class="g-role"' + de(IP + '.role') + '>' + esc(it.role) + '</p>';
        if (it.text) inner += '<p class="g-text"' + de(IP + '.text') + '>' + ml(it.text) + '</p>';
        return '<div class="g-cell ' + variant + '">' + inner + '</div>';
      }).join('');
      return '<section class="slide gd' + bgClass(s) + '" data-kind="' + kind(s, 'Grid') + '">' +
        headBlock(s, P) + '<div class="g-grid c' + cols + '">' + cells + '</div></section>';
    },
    /* 수치 그리드 2~6개 — 트랙션·성과. 원본 05/31/22 */
    stats: function (s, P) {
      var items = s.items || [];
      var cells = items.map(function (it, i) {
        return '<div class="s-cell"><p class="s-num"' + de(P + '.items.' + i + '.value') + '>' + esc(it.value || '') + '</p>' +
          '<p class="s-lab"' + de(P + '.items.' + i + '.label') + '>' + ml(it.label || '') + '</p></div>';
      }).join('');
      return '<section class="slide sg' + bgClass(s) + '" data-kind="' + kind(s, 'Stats') + '">' +
        headBlock(s, P) + '<div class="s-grid c' + (s.cols || Math.min(items.length || 3, 3)) + '">' + cells + '</div></section>';
    },
    /* 단일 대형 수치 — 하나의 숫자로 설득. 원본 03의 87%, 37의 2,829+ */
    bigstat: function (s, P) {
      return '<section class="slide bs' + bgClass(s) + '" data-kind="' + kind(s, 'Big stat') + '">' +
        headBlock(s, P) +
        '<div class="bs-in"><p class="bs-num"' + de(P + '.value') + '>' + esc(s.value || '') + '</p>' +
        '<p class="bs-cap"' + de(P + '.caption') + '>' + ml(s.caption || '') + '</p></div></section>';
    },
    /* 행 리스트 — 언론 보도·자료 링크처럼 제목+보조가 반복되는 줄. 원본 32 */
    list: function (s, P) {
      var rows = (s.rows || []).map(function (r, i) {
        var RP = P + '.rows.' + i;
        return '<div class="l-row"><span class="l-div"></span>' +
          '<p class="l-label"' + de(RP + '.label') + '>' + esc(r.label || '') + '</p>' +
          '<p class="l-sub"' + de(RP + '.sub') + '>' + esc(r.sub || '') + '</p>' +
          '<span class="l-arrow">↗</span></div>';
      }).join('');
      return '<section class="slide ls' + bgClass(s) + '" data-kind="' + kind(s, 'List') + '">' +
        headBlock(s, P) + '<div class="l-list">' + rows + '<span class="l-div l-last"></span></div></section>';
    },
    /* 표 — 파이프라인·비교표처럼 열/행이 있는 데이터. 원본 21 */
    table: function (s, P) {
      var cols = s.columns || [], rows = s.rows || [];
      var head = '<div class="t-row t-head">' + cols.map(function (c, i) {
        return '<span' + de(P + '.columns.' + i) + '>' + esc(c) + '</span>';
      }).join('') + '</div>';
      var body = rows.map(function (r, i) {
        return '<div class="t-row">' + (r.cells || []).map(function (c, j) {
          return '<span' + de(P + '.rows.' + i + '.cells.' + j) + '>' + esc(c) + '</span>';
        }).join('') + '</div>';
      }).join('');
      return '<section class="slide tb' + bgClass(s) + '" data-kind="' + kind(s, 'Table') + '">' +
        '<div class="tb-txt">' + headBlock(s, P, 'left') + (s.text ? '<p class="p-body"' + de(P + '.text') + '>' + ml(s.text) + '</p>' : '') + '</div>' +
        '<div class="t-panel">' + head + body + '</div></section>';
    },
    /* 요금 티어 — 플랜 비교. 원본 20 */
    pricing: function (s, P) {
      var tiers = (s.tiers || []).map(function (t, i) {
        var TP = P + '.tiers.' + i;
        return '<div class="pr-card' + (t.featured ? ' on' : '') + '">' +
          '<p class="pr-name"' + de(TP + '.name') + '>' + esc(t.name || '') + '</p><span class="pr-div"></span>' +
          '<p class="pr-price"' + de(TP + '.price') + '>' + esc(t.price || '') + '</p>' +
          '<p class="pr-per"' + de(TP + '.per') + '>' + esc(t.per || '') + '</p>' +
          '<ul class="pr-feats">' + (t.features || []).map(function (f, j) {
            return '<li><span class="p-tick"></span><span' + de(TP + '.features.' + j) + '>' + esc(f) + '</span></li>';
          }).join('') + '</ul></div>';
      }).join('');
      return '<section class="slide pr' + bgClass(s) + '" data-kind="' + kind(s, 'Pricing') + '">' +
        headBlock(s, P) + '<div class="pr-grid c' + ((s.tiers || []).length || 3) + '">' + tiers + '</div></section>';
    },
    /* 타임라인 — 로드맵·일정. 마일스톤이 축 위/아래로 교차 배치. 원본 17/18(인포) */
    timeline: function (s, P) {
      var items = s.items || [];
      var nodes = items.map(function (it, i) {
        var IP = P + '.items.' + i, up = (i % 2 === 0);
        return '<div class="tl-node ' + (up ? 'up' : 'dn') + '" style="left:' + (items.length > 1 ? (i / (items.length - 1)) * 100 : 50) + '%">' +
          '<span class="tl-dot"></span><span class="tl-lead"></span>' +
          '<div class="tl-cal"><p class="tl-when"' + de(IP + '.when') + '>' + esc(it.when || '') + '</p>' +
          '<p class="p-c-head"' + de(IP + '.head') + '>' + esc(it.head || '') + '</p>' +
          (it.text ? '<p class="p-c-text"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div></div>';
      }).join('');
      return '<section class="slide tl' + bgClass(s) + '" data-kind="' + kind(s, 'Timeline') + '">' +
        headBlock(s, P) + '<div class="tl-rail"><span class="tl-axis"></span>' + nodes + '</div></section>';
    },
    /* 차트 — 값 비교·추이·구성비. 실제 그리기는 공통 자산(window.Charts)에 위임 */
    chart: function (s, P) {
      return '<section class="slide ch' + bgClass(s) + '" data-kind="' + kind(s, 'Chart') + '">' +
        headBlock(s, P) + '<div class="ch-box">' + chartSVG(s.chart, P + '.chart') + '</div>' +
        (s.note ? '<p class="p-note"' + de(P + '.note') + '>' + ml(s.note) + '</p>' : '') + '</section>';
    },
    /* 2×2 매트릭스 — 포지셔닝·경쟁 지형. 원본 10 */
    matrix: function (s, P) {
      var pts = (s.points || []).map(function (p, i) {
        return '<div class="mx-pt" style="left:' + (+p.x || 50) + '%;top:' + (100 - (+p.y || 50)) + '%">' +
          '<span class="mx-dot"></span><span class="mx-lab"' + de(P + '.points.' + i + '.label') + '>' + esc(p.label || '') + '</span></div>';
      }).join('');
      return '<section class="slide mx' + bgClass(s) + '" data-kind="' + kind(s, 'Matrix') + '">' +
        headBlock(s, P) +
        '<div class="mx-box"><span class="mx-ax x"></span><span class="mx-ax y"></span>' + pts +
        '<span class="mx-axl top"' + de(P + '.axisY') + '>' + esc(s.axisY || '') + '</span>' +
        '<span class="mx-axl right"' + de(P + '.axisX') + '>' + esc(s.axisX || '') + '</span></div></section>';
    },
    /* 목업 N-업 — 제품 화면 나열. 원본 12/30 */
    gallery: function (s, P) {
      var items = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="gl-cell">' + media(it.image || it, IP + '.image', 'shot') +
          (it.head ? '<p class="g-head"' + de(IP + '.head') + '>' + esc(it.head) + '</p>' : '') +
          (it.text ? '<p class="g-text"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide gl' + bgClass(s) + '" data-kind="' + kind(s, 'Gallery') + '">' +
        headBlock(s, P, s.align || 'center') + '<div class="gl-grid c' + ((s.items || []).length || 3) + '">' + items + '</div></section>';
    },
    /* 마무리 — 인사 + 연락처. 원본 27 */
    closing: function (s, P) {
      var cs = (s.contacts || []).map(function (c, i) {
        return '<div class="cl-cell"><p class="cl-k"' + de(P + '.contacts.' + i + '.k') + '>' + esc(c.k || '') + '</p>' +
          '<p class="cl-v"' + de(P + '.contacts.' + i + '.v') + '>' + ml(c.v || '') + '</p></div>';
      }).join('');
      return '<section class="slide cl' + bgClass(s) + '" data-kind="Closing">' +
        '<h1 class="st-title"' + de(P + '.title') + '>' + ml(s.title || 'Thank you') + '</h1>' +
        '<div class="cl-grid">' + cs + '</div></section>';
    },
  };

  // 차트 렌더 — 공통 자산이 로드돼 있으면 위임, 없으면 빈 자리(팩만 단독 로드된 경우)
  function chartSVG(chart, P) {
    if (!chart) return '';
    if (window.Charts && typeof window.Charts.render === 'function') return window.Charts.render(chart, { path: P });
    return '<div class="ch-ph"></div>';
  }

  var MV_SEL = '[data-edit], .p-media, .qt-stars, .l-div, .tl-dot, .mx-dot, .p-tick';
  function stateScript(slides) {
    var st = (slides || []).map(function (s) { return { p: s._pos || {}, h: s._hide || {}, f: s._fmt || {}, z: s._z || {} }; });
    var js = '(function(){var ST=' + JSON.stringify(st) + ';var SEL=' + JSON.stringify(MV_SEL) + ';' +
      'var sl=document.querySelectorAll(".ppt-stack > .slide, .vscale > .slide");' +
      'for(var i=0;i<sl.length;i++){var c=ST[i];if(!c)continue;var s=sl[i];var mv=s.querySelectorAll(SEL);' +
      'for(var k=0;k<mv.length;k++){var key="m"+k;mv[k].setAttribute("data-mvkey",key);' +
      'var p=c.p[key];if(p)mv[k].style.transform="translate("+p[0]+"px,"+p[1]+"px)";' +
      'var z=c.z[key];if(z!=null){mv[k].style.zIndex=z;if(getComputedStyle(mv[k]).position==="static")mv[k].style.position="relative";}' +
      'if(c.h[key])mv[k].style.display="none";}' +
      'var ed=s.querySelectorAll("[data-edit]");' +
      'for(var e2=0;e2<ed.length;e2++){var path=ed[e2].getAttribute("data-edit")||"";var rel=path.replace(/^slides\\.\\d+\\./,"");' +
      'var f=c.f[rel];if(f==="b")ed[e2].style.fontWeight=700;else if(f==="l")ed[e2].style.fontWeight=300;}' +
      '}})();';
    return '<scr' + 'ipt>' + js + '</scr' + 'ipt>';
  }

  /* ---- CSS: Figma 값 ×0.6667 환산(1920→1280). 원본은 손배치라 여백 120/119/114, 갭 63/61/61로 어긋나 있어
     여백 80(=120), 거터 40(=60), 8배수로 정규화했다(시각차 없음, PPTX 좌표 안정). ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      ':root{' +
      /* 팔레트 — 원본 hex 그대로(그린 유지) */
      '--pg:#39B966;--pg2:#52B788;--pg3:#9CDCB2;--pg4:#498467;--pblue:#4677FF;' +
      '--ink:#181918;--paper:#fff;--grey:#F1F1F1;--line:#EEEEEE;--ph:#D9D9D9;' +
      '--font:"Pretendard",-apple-system,system-ui,sans-serif;' +
      /* 타이포 — 원본 140/76/28/24/18 → 93/50/19/16/12 */
      '--fs-huge:93px;--fs-title:50px;--fs-lead:19px;--fs-body:16px;--fs-over:12px;--fs-head:21px;' +
      '--slide-w:1280px;--slide-h:720px;--mg:80px;--gut:40px;--rad:13px}' +
      '*{box-sizing:border-box}body{margin:0;background:#0a0a0e;font-family:var(--font);-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:var(--paper);color:var(--ink);' +
      'padding:var(--mg);word-break:keep-all;overflow-wrap:break-word;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.4)}' +
      /* 배경 변형 — 원본은 흰색/연회색/그린 풀블리드 3종 */
      '.bg-grey{background:var(--grey)}.bg-green{background:var(--pg);color:#fff}.bg-dark{background:var(--ink);color:#fff}' +
      '.bg-green .p-eyebrow,.bg-dark .p-eyebrow{color:rgba(255,255,255,.8)}' +
      /* 헤딩 블록 */
      '.p-head{max-width:1000px}.p-head.ctr{margin:0 auto;text-align:center}' +
      '.p-eyebrow{font-size:var(--fs-over);font-weight:500;letter-spacing:.02em;text-transform:uppercase;margin:0 0 27px}' +
      '.p-title{font-size:var(--fs-title);font-weight:600;line-height:1.2;letter-spacing:-.03em;margin:0}' +
      '.p-lead{font-size:var(--fs-lead);font-weight:600;letter-spacing:-.02em;margin:16px 0 0}' +
      '.p-body{font-size:var(--fs-body);line-height:1.55;margin:24px 0 0;max-width:560px}' +
      '.p-note{font-size:var(--fs-body);opacity:.7;margin:24px 0 0}' +
      '.p-bullets{list-style:none;margin:32px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:20px 27px}' +
      '.p-bullets li{display:flex;gap:13px;font-size:var(--fs-body);line-height:1.5}' +
      '.p-tick{flex:none;width:22px;height:22px;border-radius:50%;background:var(--pg);position:relative}' +
      '.p-tick::after{content:"";position:absolute;left:7px;top:6px;width:6px;height:10px;border:2px solid #fff;border-top:0;border-left:0;transform:rotate(45deg)}' +
      '.p-tick.lg{width:30px;height:30px;margin-bottom:16px}.p-tick.lg::after{left:10px;top:8px;width:8px;height:13px}' +
      /* 미디어 자리 */
      '.p-media{border-radius:var(--rad);overflow:hidden;background:var(--ph);display:grid;place-items:center}' +
      '.p-media img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.p-media.ph span{font-size:var(--fs-over);letter-spacing:.02em;text-transform:uppercase;color:#7a7a7a}' +
      '.p-media.full{width:100%;height:100%}.p-media.card{width:100%;aspect-ratio:4/3;margin-bottom:20px}' +
      '.p-media.sq{width:100%;aspect-ratio:1/1;margin-bottom:20px}.p-media.shot{width:100%;aspect-ratio:5/4;margin-bottom:20px}' +
      '.p-callout .p-c-head{font-size:var(--fs-head);font-weight:700;margin:0}' +
      '.p-c-text{font-size:var(--fs-body);line-height:1.4;margin:13px 0 0}' +
      /* statement */
      '.st{display:flex}.st.bottom .st-in{margin-top:auto}.st.center{align-items:center}.st.center .st-in{margin:0 auto;text-align:center;max-width:900px}' +
      '.st-title{font-size:var(--fs-title);font-weight:600;line-height:1.2;letter-spacing:-.03em;margin:0}' +
      '.st-sub{font-size:var(--fs-lead);margin:24px 0 0;max-width:760px}' +
      '.st.center .st-sub{margin-left:auto;margin-right:auto}' +
      /* quote */
      '.qt{display:flex;flex-direction:column;justify-content:center}' +
      '.qt-bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}' +
      '.qt-in{position:relative;z-index:1;max-width:660px}' +
      '.qt-text{font-size:var(--fs-title);font-weight:600;line-height:1.2;letter-spacing:-.03em;margin:0}' +
      '.qt-by{font-size:var(--fs-lead);margin:18px 0 0;opacity:.85}' +
      '.qt-stat{position:absolute;right:var(--mg);bottom:var(--mg);z-index:1;text-align:left}' +
      '.qt-stars{font-size:20px;letter-spacing:2px}' +
      '.qt-num{font-size:var(--fs-huge);font-weight:600;letter-spacing:-.03em;line-height:1;margin:13px 0 8px}' +
      '.qt-lab{font-size:var(--fs-body);margin:0}' +
      /* split */
      '.sp{display:grid;grid-template-columns:1fr 1fr;gap:var(--gut);padding:0}' +
      '.sp .sp-txt{padding:var(--mg);display:flex;flex-direction:column;justify-content:center}' +
      '.sp .sp-vis{position:relative;overflow:hidden}' +
      '.sp.v-left{grid-template-areas:"vis txt"}.sp.v-left .sp-vis{grid-area:vis}.sp.v-left .sp-txt{grid-area:txt}' +
      '.sp-panel{width:100%;height:100%;background:var(--pg)}' +
      '.sp-chart{width:100%;height:100%;display:grid;place-items:center;padding:var(--gut)}' +
      '.sp .p-bullets{grid-template-columns:1fr 1fr}' +
      '.sp-stat{margin-top:32px}.sp-num{font-size:var(--fs-huge);font-weight:600;line-height:1;letter-spacing:-.03em;margin:0;color:var(--pg)}' +
      '.sp-lab{font-size:var(--fs-body);line-height:1.5;margin:13px 0 0;max-width:420px}' +
      /* grid */
      '.g-grid{display:grid;gap:27px var(--gut);margin-top:52px}' +
      '.g-grid.c2{grid-template-columns:repeat(2,1fr)}.g-grid.c3{grid-template-columns:repeat(3,1fr)}.g-grid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.g-cell.card,.g-cell.person{background:var(--paper);border-radius:var(--rad);padding:20px}' +
      '.bg-white .g-cell.card,.bg-white .g-cell.person{background:var(--grey)}' +
      '.g-head{font-size:var(--fs-head);font-weight:700;margin:0}' +
      '.g-role{font-size:var(--fs-over);text-transform:uppercase;letter-spacing:.02em;opacity:.7;margin:6px 0 0}' +
      '.g-text{font-size:var(--fs-body);line-height:1.5;margin:13px 0 0}' +
      /* stats */
      '.s-grid{display:grid;gap:40px var(--gut);margin-top:60px}' +
      '.s-grid.c2{grid-template-columns:repeat(2,1fr)}.s-grid.c3{grid-template-columns:repeat(3,1fr)}' +
      '.s-num{font-size:var(--fs-huge);font-weight:600;line-height:1;letter-spacing:-.03em;margin:0}' +
      '.s-lab{font-size:var(--fs-body);margin:12px 0 0}' +
      /* bigstat */
      '.bs-in{margin-top:60px;display:flex;align-items:baseline;gap:var(--gut)}' +
      '.bs-num{font-size:var(--fs-huge);font-weight:600;line-height:1;letter-spacing:-.03em;margin:0;color:var(--pg)}' +
      '.bg-green .bs-num{color:#fff}.bs-cap{font-size:var(--fs-body);line-height:1.5;margin:0;max-width:420px}' +
      /* list */
      '.l-list{margin-top:44px;position:relative}' +
      '.l-row{position:relative;display:grid;grid-template-columns:1fr auto 30px;align-items:center;gap:20px;padding:20px 4px}' +
      '.l-div{position:absolute;left:0;right:0;top:0;height:1px;background:var(--line)}.l-div.l-last{position:relative;display:block}' +
      '.l-label{font-size:var(--fs-head);font-weight:600;margin:0}.l-sub{font-size:var(--fs-body);opacity:.7;margin:0}' +
      '.l-arrow{font-size:18px;opacity:.6}' +
      /* table */
      '.tb{display:grid;grid-template-columns:1fr 1.6fr;gap:var(--gut)}' +
      '.tb .tb-txt{display:flex;flex-direction:column;justify-content:center}' +
      '.t-panel{align-self:center;background:var(--grey);border-radius:var(--rad);padding:27px 32px}' +
      '.bg-grey .t-panel{background:var(--paper)}' +
      '.t-row{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:20px;padding:16px 0;border-bottom:1px solid var(--line);font-size:var(--fs-body)}' +
      '.t-row:last-child{border-bottom:0}.t-head{font-size:var(--fs-over);text-transform:uppercase;letter-spacing:.02em;opacity:.6}' +
      /* pricing */
      '.pr-grid{display:grid;gap:var(--gut);margin-top:52px}.pr-grid.c2{grid-template-columns:repeat(2,1fr)}.pr-grid.c3{grid-template-columns:repeat(3,1fr)}' +
      '.pr-card{border:1px solid var(--line);border-radius:var(--rad);padding:27px}' +
      '.pr-card.on{border-color:var(--pg);box-shadow:inset 0 0 0 1px var(--pg)}' +
      '.pr-name{font-size:var(--fs-over);text-transform:uppercase;letter-spacing:.02em;margin:0}' +
      '.pr-div{display:block;height:1px;background:var(--line);margin:16px 0}' +
      '.pr-price{font-size:36px;font-weight:600;letter-spacing:-.02em;margin:0}' +
      '.pr-per{font-size:var(--fs-body);opacity:.65;margin:6px 0 20px}' +
      '.pr-feats{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:13px}' +
      '.pr-feats li{display:flex;gap:12px;font-size:var(--fs-body)}' +
      /* timeline */
      /* 좌우 100px 인셋 필수 — 양끝 노드의 콜아웃(폭 200, 중앙정렬)이 슬라이드 밖으로 잘린다 */
      '.tl-rail{position:relative;margin:120px 100px 0;height:300px}' +
      '.tl-axis{position:absolute;left:0;right:0;top:50%;height:3px;background:var(--pg2)}' +
      /* translateX(-50%)만으로 중앙정렬 — margin-left까지 주면 200px씩 밀려 축 밖으로 나간다 */
      '.tl-node{position:absolute;top:50%;transform:translateX(-50%);width:200px}' +
      '.tl-dot{position:absolute;left:50%;top:0;transform:translate(-50%,-50%);width:20px;height:20px;border-radius:50%;background:var(--pg)}' +
      '.tl-lead{position:absolute;left:50%;width:1px;background:var(--ink);opacity:.35}' +
      '.tl-node.up .tl-lead{bottom:10px;height:60px}.tl-node.dn .tl-lead{top:10px;height:60px}' +
      '.tl-cal{position:absolute;left:0;width:200px;text-align:center}' +
      '.tl-node.up .tl-cal{bottom:76px}.tl-node.dn .tl-cal{top:76px}' +
      '.tl-when{font-size:var(--fs-head);font-weight:700;color:var(--pg4);margin:0 0 8px}' +
      /* chart */
      '.ch-box{margin-top:44px;height:380px;display:grid;place-items:center}.ch-box svg{max-width:100%;max-height:100%}' +
      '.ch-ph{width:100%;height:100%;border-radius:var(--rad);background:var(--grey)}' +
      /* matrix */
      '.mx-box{position:relative;margin:52px auto 0;width:820px;height:380px}' +
      '.mx-ax{position:absolute;background:var(--ink);opacity:.5}' +
      '.mx-ax.x{left:0;right:0;top:50%;height:2px}.mx-ax.y{top:0;bottom:0;left:50%;width:2px}' +
      '.mx-axl{position:absolute;font-size:var(--fs-body);font-weight:600}' +
      '.mx-axl.top{top:-28px;left:50%;transform:translateX(-50%)}.mx-axl.right{right:-8px;top:calc(50% + 14px)}' +
      '.mx-pt{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:8px}' +
      '.mx-dot{width:14px;height:14px;border-radius:50%;background:var(--pg)}' +
      '.mx-lab{font-size:var(--fs-body);white-space:nowrap}' +
      /* gallery */
      '.gl-grid{display:grid;gap:var(--gut);margin-top:52px}.gl-grid.c2{grid-template-columns:repeat(2,1fr)}.gl-grid.c3{grid-template-columns:repeat(3,1fr)}' +
      /* closing */
      '.cl{background:var(--pg);color:#fff;display:flex;flex-direction:column;justify-content:flex-end}' +
      '.cl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gut);margin-top:52px}' +
      '.cl-k{font-size:var(--fs-over);text-transform:uppercase;letter-spacing:.02em;opacity:.75;margin:0 0 8px}' +
      '.cl-v{font-size:var(--fs-body);margin:0;line-height:1.5}';
  }

  function renderSlides(slides) {
    return (slides || []).map(function (s, i) {
      var fn = R[s.type] || R.statement, html = '';
      try { html = fn(s, 'slides.' + i); } catch (e) { return ''; }
      return html;
    }).join('\n');
  }

  function renderPitchDeck(data, opts) {
    data = data || {}; opts = opts || {};
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + (window.Charts && window.Charts.css ? window.Charts.css() : '') + '</style></head><body data-style="pitch">' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + '</body></html>';
  }

  /* ---- 레이아웃 카탈로그 — "언제 쓰나"가 계약의 일부.
     AI가 브리프를 읽고 섹션마다 타입을 고를 때 이 설명을 그대로 프롬프트에 넣는다. ---- */
  var CATALOG = [
    { type: 'statement', label: '대형 문장', use: '표지, 미션, 섹션 전환, 투자 요청처럼 문장 하나로 전환점을 만들 때', needs: ['title'], opt: ['eyebrow', 'sub', 'bg', 'pos'], cap: { title: '~40자' } },
    { type: 'quote', label: '인용', use: '고객·전문가 발언, 후기처럼 남의 말로 신뢰를 줄 때', needs: ['text', 'by'], opt: ['stat', 'image', 'bg'], cap: { text: '~90자' } },
    { type: 'split', label: '좌우 2분할', use: '설명과 시각자료를 나란히 — 문제 정의, 제품 화면, 경쟁 우위처럼 보여주며 설명할 때', needs: ['title'], opt: ['bullets', 'text', 'stat', 'visual', 'side'], cap: { bullets: '4개 · 각 ~50자' } },
    { type: 'grid', label: 'N열 반복', use: '동급 항목 3~4개를 나열 — 기능, 강점, 팀원, 경쟁사 카드', needs: ['title', 'items'], opt: ['variant(text|icon|card|person)', 'cols'], cap: { items: '2~4개', text: '~170자' } },
    { type: 'stats', label: '수치 그리드', use: '트랙션·성과 지표를 2~6개 한 화면에 모아 보여줄 때', needs: ['items'], opt: ['title', 'cols'], cap: { items: '2~6개' } },
    { type: 'bigstat', label: '단일 대형 수치', use: '숫자 하나로 임팩트를 줄 때 — 시장 규모, 점유율, 성장률', needs: ['value'], opt: ['title', 'caption'], cap: { value: '~6자' } },
    { type: 'list', label: '행 리스트', use: '언론 보도, 자료 링크, 항목+보조설명이 줄줄이 이어질 때', needs: ['rows'], opt: ['title'], cap: { rows: '3~6줄' } },
    { type: 'table', label: '표', use: '거래처·계약처럼 열이 정해진 데이터를 나열할 때', needs: ['columns', 'rows'], opt: ['title', 'text'], cap: { rows: '~5행', columns: '3열' } },
    { type: 'pricing', label: '요금 티어', use: '플랜·가격을 2~3개 비교할 때', needs: ['tiers'], opt: ['title'], cap: { tiers: '2~3개', features: '4개' } },
    { type: 'timeline', label: '타임라인', use: '로드맵, 도입 절차, 연혁처럼 시간 순서가 핵심일 때', needs: ['items'], opt: ['title'], cap: { items: '3~6개' } },
    { type: 'chart', label: '차트', use: '추이·비교·구성비를 그래프로 보여줄 때 (막대·라인·에어리어·도넛)', needs: ['chart'], opt: ['title', 'note'], cap: { series: '1~2계열', categories: '3~7개' } },
    { type: 'matrix', label: '2×2 매트릭스', use: '경쟁 지형, 포지셔닝처럼 두 축으로 자리를 잡아 보여줄 때', needs: ['points'], opt: ['title', 'axisX', 'axisY'], cap: { points: '3~6개' } },
    { type: 'gallery', label: '목업 나열', use: '제품 화면 2~3개를 나란히 보여줄 때', needs: ['items'], opt: ['title'], cap: { items: '2~3개' } },
    { type: 'closing', label: '마무리', use: '마지막 인사 + 연락처', needs: ['title'], opt: ['contacts'], cap: { contacts: '~3개' } },
  ];

  var DEFAULT_DECK = {
    style: 'pitch',
    slides: [
      { type: 'statement', bg: 'green', pos: 'bottom', eyebrow: 'PITCH DECK', title: '제목을 입력하세요' },
      { type: 'statement', bg: 'grey', pos: 'center', eyebrow: 'MISSION', title: '핵심 메시지 한 문장' },
      { type: 'grid', bg: 'white', variant: 'icon', eyebrow: 'SOLUTION', title: '무엇을 해결하나요', cols: 3,
        items: [{ head: '항목', text: '설명을 입력하세요.' }, { head: '항목', text: '설명을 입력하세요.' }, { head: '항목', text: '설명을 입력하세요.' }] },
      { type: 'stats', bg: 'grey', eyebrow: 'TRACTION', title: '성과', cols: 3,
        items: [{ value: '00', label: '지표' }, { value: '00', label: '지표' }, { value: '00', label: '지표' }] },
      { type: 'closing', title: 'Thank you', contacts: [{ k: 'EMAIL', v: '' }, { k: 'WEB', v: '' }] },
    ],
  };

  var STARTERS = {
    statement: { type: 'statement', bg: 'green', pos: 'bottom', eyebrow: 'SECTION', title: '문장을 입력' },
    quote: { type: 'quote', bg: 'grey', text: '인용문을 입력하세요.', by: '— 이름' },
    split: { type: 'split', bg: 'white', side: 'right', eyebrow: 'SUBHEADING', title: '제목', bullets: ['내용', '내용'], visual: { label: 'ADD IMAGE' } },
    grid: { type: 'grid', bg: 'white', variant: 'text', title: '제목', cols: 3, items: [{ head: '항목', text: '설명' }, { head: '항목', text: '설명' }, { head: '항목', text: '설명' }] },
    stats: { type: 'stats', bg: 'grey', title: '성과', cols: 3, items: [{ value: '00', label: '지표' }, { value: '00', label: '지표' }, { value: '00', label: '지표' }] },
    bigstat: { type: 'bigstat', bg: 'white', eyebrow: 'MARKET', title: '제목', value: '00%', caption: '설명을 입력하세요.' },
    list: { type: 'list', bg: 'white', title: '목록', rows: [{ label: '항목', sub: '보조 설명' }, { label: '항목', sub: '보조 설명' }] },
    table: { type: 'table', bg: 'white', title: '표', columns: ['항목', '값', '비고'], rows: [{ cells: ['내용', '내용', '내용'] }, { cells: ['내용', '내용', '내용'] }] },
    pricing: { type: 'pricing', bg: 'white', title: '요금제', tiers: [{ name: 'TIER 1', price: '$00', per: 'per month', features: ['기능', '기능'] }, { name: 'TIER 2', price: '$00', per: 'per month', features: ['기능', '기능'] }] },
    timeline: { type: 'timeline', bg: 'grey', title: '로드맵', items: [{ when: '2026 Q1', head: '단계', text: '설명' }, { when: '2026 Q2', head: '단계', text: '설명' }, { when: '2026 Q3', head: '단계', text: '설명' }] },
    chart: { type: 'chart', bg: 'white', title: '추이', chart: { type: 'bar', categories: ['1', '2', '3', '4'], series: [{ name: '값', values: [2, 4, 6, 9] }] } },
    matrix: { type: 'matrix', bg: 'grey', title: '포지셔닝', axisX: '가로축', axisY: '세로축', points: [{ x: 70, y: 75, label: '우리' }, { x: 35, y: 40, label: '경쟁사' }] },
    gallery: { type: 'gallery', bg: 'grey', align: 'center', title: '제품 화면', items: [{ image: { label: 'ADD SHOT' } }, { image: { label: 'ADD SHOT' } }, { image: { label: 'ADD SHOT' } }] },
    closing: { type: 'closing', title: 'Thank you', contacts: [{ k: 'EMAIL', v: '' }, { k: 'WEB', v: '' }] },
  };

  window.renderPitchDeck = renderPitchDeck;
  window.PITCH_MV_SEL = MV_SEL;
  window.PITCH_DEFAULT_DECK = DEFAULT_DECK;
  window.PITCH_CATALOG = CATALOG;
  window.PITCH_STYLE = { id: 'pitch', name: 'Creatable Pitch', desc: '피치덱 · 16:9 · 그린 미니멀', swatch: 'linear-gradient(135deg,#39B966,#181918)' };
  window.PITCH_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.pitchNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.statement)); };
})();
