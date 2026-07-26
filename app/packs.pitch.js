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
      // badge=아웃라인 필, bottomImage=하단 풀블리드 이미지 밴드 (EcoTransit 커버/클로징 39:53628/53510)
      var bimg = s.bottomImage ? '<div class="st-bimg">' + media(s.bottomImage, P + '.bottomImage', 'full') + '</div>' : '';
      // Q&A 장은 표지와 동일한 타이틀 크기(87px) — 사용자 규칙
      var qna = /^\s*Q\s*&?\s*A\s*$/i.test(String(s.title || '').trim()) ? ' qna' : '';
      return '<section class="slide st ' + pos + qna + (bimg ? ' has-bimg' : '') + bgClass(s) + '" data-kind="' + kind(s, 'Statement') + '">' +
        '<div class="st-in">' +
        (s.badge ? '<p class="st-badge"' + de(P + '.badge') + '>' + esc(s.badge) + '</p>' : '') +
        (s.eyebrow ? '<p class="p-eyebrow"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow) + '</p>' : '') +
        '<h1 class="st-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</h1>' +
        (s.sub ? '<p class="st-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') +
        '</div>' + bimg + '</section>';
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
      var variant = s.variant || 'text';   // text | icon | card | person | num(번호 카드 — EcoTransit 39:53589/53573/53517)
      var accIdx = s.accent == null ? 0 : +s.accent;   // num 변형: 강조 카드 인덱스
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, inner = '';
        if (variant === 'num') {
          if (it.image) return '<div class="g-cell num img">' + media(it.image, IP + '.image', 'full') + '</div>';   // 셀 하나를 이미지 타일로
          var on = i === accIdx;
          return '<div class="g-cell num' + (on ? ' on' : '') + '">' + (on ? '<span class="g-arrow">↗</span>' : '') +
            '<span class="l-num">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
            (it.head ? '<p class="g-head"' + de(IP + '.head') + '>' + esc(it.head) + '</p>' : '') +
            '<p class="g-text"' + de(IP + '.text') + '>' + ml(it.text || '') + '</p></div>';
        }
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
    /* 넘버드 카드 리스트 — 항목을 라운드 카드 행으로(큰 번호 + 라벨/굵은 설명), 첫 행 액센트.
       image 주면 좌측 이미지 슬롯. 원본 EcoTransit 39:53607(2×2)/53556(4행)/53536(5행 슬림) — 색은 pitch 토큰 */
    list: function (s, P) {
      var rowsArr = s.rows || [];
      var acc = s.accent == null ? 0 : +s.accent;   // 강조 행 인덱스(기본 첫 행)
      var rows = rowsArr.map(function (r, i) {
        var RP = P + '.rows.' + i;
        return '<div class="l-cardrow' + (i === acc ? ' on' : '') + '">' +
          '<span class="l-num">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
          '<p class="l-body"><span' + de(RP + '.label') + '>' + esc(r.label || '') + '</span>' +
          (r.sub ? ' <b' + de(RP + '.sub') + '>' + esc(r.sub) + '</b>' : '') + '</p></div>';
      }).join('');
      var img = s.image ? '<div class="l-media">' + media(s.image, P + '.image', 'full') + '</div>' : '';
      return '<section class="slide ls' + (img ? ' with-img' : '') + bgClass(s) + '" data-kind="' + kind(s, 'List') + '">' +
        headBlock(s, P) + '<div class="l-wrap">' + img +
        '<div class="l-cards' + (rowsArr.length >= 5 ? ' n5' : '') + '">' + rows + '</div></div></section>';
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

  /* 모든 시각 개체가 "낱개" 선택/이동/숨김 단위 — 텍스트([data-edit]) + 이미지 + 차트 내부 요소(막대·조각·라벨) + 선·점 장식.
     컨테이너(카드·셀·패널)는 단위로 안 잡는다 — 묶여 선택되는 그룹핑 금지(사용자 요구). 묶고 싶으면 다중선택→그룹.
     주의: 셀렉터 추가/순서 변경은 기존 덱의 _pos 키(m0…)를 밀 수 있다. */
  var MV_SEL = '[data-edit], .s-imgwrap, .p-media, ' +
    'svg.cht rect, svg.cht path, svg.cht circle, svg.cht ellipse, svg.cht line, svg.cht polygon, svg.cht text, .ch-ph, ' +
    '.qt-stars, .l-num, .g-arrow, .st-bimg, .tl-dot, .tl-axis, .tl-lead, .pr-div, .mx-dot, .mx-ax, .p-tick';
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
      /* 첨부 이미지 블록 — ppt 팩과 동일 계약(이동/숨김/리사이즈 대상) */
      '.s-imgwrap{position:absolute;right:60px;top:150px;z-index:5}' +
      '.s-imgwrap img{display:block;max-width:420px;max-height:440px;border-radius:var(--rad);object-fit:cover;-webkit-user-drag:none;user-select:none;pointer-events:none}' +
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
      '.st{display:flex}.st.center{align-items:center}.st.center .st-in{margin:0 auto;text-align:center;max-width:900px}' +
      /* 표지(bottom) — 원본 31:1462 그대로: 블록 top 477@1080(→318, 패딩 80 제외 238), 타이틀 130px@1920(→87px)·행간 1.16·자간 -3%, 아이브로 18px(→12px)·간격 26px(→17px) */
      '.st.bottom .st-in{margin-top:238px}' +
      '.st.bottom .p-eyebrow{font-size:12px;font-weight:500;margin:0 0 17px}' +
      '.st.bottom .st-title{font-size:87px;line-height:1.16;letter-spacing:-.03em;font-weight:600}' +
      /* Q&A·클로징 타이틀 = 표지와 동일 크기 — 사용자 규칙 */
      '.st.qna .st-title,.cl .st-title{font-size:87px;line-height:1.16;letter-spacing:-.03em;font-weight:600}' +
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
      /* 넘버드 카드 리스트 — 라운드 20 카드 행, 큰 번호 43px(Regular), 첫 행 그린 액센트. 1920→1280 환산 */
      '.l-wrap{margin-top:40px;display:grid;gap:30px;align-items:stretch}' +
      '.ls.with-img .l-wrap{grid-template-columns:450px 1fr}' +
      '.l-media .p-media{height:100%;min-height:320px}' +
      '.l-cards{display:flex;flex-direction:column;gap:20px;justify-content:center}' +
      '.l-cardrow{display:flex;align-items:center;gap:36px;background:var(--grey);border-radius:20px;padding:24px 34px}' +
      '.l-cardrow.on{background:var(--pg);color:#fff}' +
      '.bg-grey .l-cardrow{background:var(--paper)}.bg-grey .l-cardrow.on{background:var(--pg)}' +
      '.l-num{font-size:43px;font-weight:400;line-height:1;flex:none;letter-spacing:-.02em;min-width:64px}' +
      '.l-body{margin:0;font-size:var(--fs-body);line-height:1.5}.l-body b{font-weight:700}' +
      '.l-cards.n5{gap:14px}.l-cards.n5 .l-cardrow{padding:14px 28px}' +
      /* grid num 변형 — 세로 번호 카드(라운드 20), 강조 카드 우상단 화살표, 이미지 타일 셀 */
      '.g-cell.num{position:relative;background:var(--grey);border-radius:20px;padding:32px 33px;min-height:300px;display:flex;flex-direction:column}' +
      '.g-cell.num.on{background:var(--pg);color:#fff}' +
      '.bg-grey .g-cell.num{background:var(--paper)}.bg-grey .g-cell.num.on{background:var(--pg)}' +
      '.g-cell.num .l-num{margin-bottom:36px}' +
      '.g-cell.num .g-text{margin-top:0;max-width:220px}' +
      '.g-cell.num.img{padding:0;overflow:hidden}.g-cell.num.img .p-media{width:100%;height:100%;border-radius:0}' +
      '.g-arrow{position:absolute;right:25px;top:28px;font-size:28px;line-height:1}' +
      /* statement 확장 — 아웃라인 배지 필 + 하단 풀블리드 이미지 밴드 */
      '.st-badge{display:inline-block;border:1px solid currentColor;border-radius:33px;padding:10px 33px;font-size:20px;margin:0 0 27px;width:fit-content}' +
      '.st-bimg{position:absolute;left:0;right:0;bottom:0;height:360px}.st-bimg .p-media{width:100%;height:100%;border-radius:0}' +
      '.st.has-bimg .st-in{margin-top:64px}.st.bottom.has-bimg .st-in{margin-top:64px}' +
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
      // 슬라이드 첨부 이미지(s.imgs[], 구버전 s.img 단일도 수용) — ppt 팩과 동일 계약(.s-imgwrap ∈ MV_SEL, PPTX 추출 대상)
      var imgs = (s.imgs && s.imgs.length) ? s.imgs : ((s.img && s.img.src) ? [s.img] : []);
      if (imgs.length) {
        var ih = imgs.map(function (im, k) {
          if (!im || !im.src) return '';
          var ist = '';
          if (im.w) ist += 'width:' + (+im.w) + 'px;max-width:none;';
          if (im.h) ist += 'height:' + (+im.h) + 'px;max-height:none;';
          // 계단 배치로 겹침 방지(이후 드래그로 자유 이동). 리사이즈하면 좌상단 고정(l/t 저장)으로 전환
          var pos = 'top:' + (im.t != null ? +im.t : (150 + k * 34)) + 'px;' +
            (im.l != null ? 'left:' + (+im.l) + 'px;right:auto' : 'right:' + (60 + k * 34) + 'px');
          return '<div class="s-imgwrap" data-imgi="' + k + '" style="' + pos + '"><img class="s-img" src="' + esc(im.src) + '"' + (ist ? ' style="' + ist + '"' : '') + ' alt=""></div>';
        }).join('');
        html = html.replace(/<\/section>\s*$/, ih + '</section>');
      }
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

  /* ---- 발표 뷰어 — 한 장씩 ←→/클릭 넘김, F 전체화면. ppt 팩 뷰어와 동일 UX(팩 자기완결 원칙상 사본) ---- */
  function renderPitchViewer(data) {
    data = data || {};
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    var vcss =
      'html,body{height:100%}body{background:#0a0a0e;overflow:hidden}' +
      '.vwrap{position:fixed;inset:0;display:flex;justify-content:center;align-items:flex-start}' +
      '.vscale{width:var(--slide-w);height:var(--slide-h);position:relative;flex:none;transform-origin:top center}' +
      '.vscale .slide{position:absolute;inset:0;display:none;box-shadow:0 24px 80px rgba(0,0,0,.55)}' +
      /* 기본 block, 슬라이드 자체가 flex인 타입(statement/quote/closing)만 flex 복원 */
      '.vscale .slide.cur{display:block}' +
      '.vscale .slide.cur.st,.vscale .slide.cur.qt,.vscale .slide.cur.cl{display:flex}' +
      '.vbar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:9px 16px;border-radius:999px;background:rgba(10,10,14,.72);backdrop-filter:blur(10px);color:#fff;font-family:Pretendard,system-ui,sans-serif;font-size:13px;z-index:9;user-select:none}' +
      '.vbtn{border:none;background:rgba(255,255,255,.12);color:#fff;width:34px;height:34px;border-radius:999px;font-size:15px;cursor:pointer;line-height:1}' +
      '.vbtn:hover{background:rgba(255,255,255,.24)}.vbtn:disabled{opacity:.3;cursor:default}' +
      '.vcount{min-width:52px;text-align:center;font-variant-numeric:tabular-nums;opacity:.9}' +
      /* 발표 모션 — 장 자체는 즉시 표시, 내용 요소만 순차 등장(요소는 opacity만 — 블록 _pos 오프셋 보존) */
      '@keyframes vfu{from{opacity:0}to{opacity:1}}' +
      'body.pfs .vbar{display:none!important}';
    var vjs =
      '(function(){var s=[].slice.call(document.querySelectorAll(".vscale .slide")),n=-1;' +
      'var c=document.querySelector(".vcount"),pb=document.querySelector(".vprev"),nb=document.querySelector(".vnext");' +
      'var pseudo=false;' +
      'function fs(){return !!document.fullscreenElement||pseudo}' +
      'function setPseudo(v){pseudo=v;document.body.classList.toggle("pfs",v);fit();try{parent.postMessage({pptViewerPseudoFs:v?1:0},"*")}catch(x){}}' +
      'function toggleFs(){if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen();return}' +
      'if(pseudo){setPseudo(false);return}' +
      'var de2=document.documentElement,rq=de2.requestFullscreen||de2.webkitRequestFullscreen;' +
      'var p=null;try{p=rq&&rq.call(de2)}catch(e){}' +
      'if(p&&p.then)p.then(null,function(){});' +
      // 일부 환경은 프라미스가 영영 안 끝난다(성공도 거부도 없음) — 600ms 안에 전체화면이 안 잡히면 유사 전체화면 폴백
      'setTimeout(function(){if(!document.fullscreenElement&&!pseudo)setPseudo(true);},600);}' +
      'function fit(){var bh=fs()?0:84;var area=innerHeight-bh;var sc=Math.min(innerWidth*0.97/1280,area/720)*(fs()?1:0.97);' +
      'var ty=Math.max(0,(area-720*sc)/2);' +
      'document.querySelector(".vbar").style.display=fs()?"none":"flex";' +
      'var v=document.querySelector(".vscale");v.style.transform="translateY("+ty+"px) scale("+sc+")";}' +
      'function show(i){var prev=n;n=Math.max(0,Math.min(s.length-1,i));if(n===prev)return;' +
      's.forEach(function(x,k){x.classList.toggle("cur",k===n)});' +
      'var cur=s[n];if(cur){' +
      // 타이틀·아이브로·리드 같은 헤딩 블록(slides.N.title 등 최상위 텍스트)은 즉시 표시 — 하위 내용·그래프만 순차 등장
      'var us=cur.querySelectorAll("[data-mvkey]");var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'var de=u.getAttribute("data-edit")||"";if(/^slides\\.\\d+\\.(title|eyebrow|sub|subtitle|lead|note|text)$/.test(de)){u.style.animation="";continue;}' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}}' +
      'c.textContent=(n+1)+" / "+s.length;pb.disabled=n===0;nb.disabled=n===s.length-1;}' +
      'document.addEventListener("fullscreenchange",fit);' +
      'addEventListener("message",function(e){if(!e.data)return;if(e.data.pptFsKey)toggleFs();else if(e.data.pptFsUi!=null)setPseudo(!!e.data.pptFsUi);});' +
      'addEventListener("resize",fit);fit();show(0);' +
      'pb.onclick=function(e){e.stopPropagation();show(n-1)};nb.onclick=function(e){e.stopPropagation();show(n+1)};' +
      'var fbn=document.querySelector(".vfs");if(fbn)fbn.onclick=function(e){e.stopPropagation();toggleFs();};' +   // 버튼 클릭=확실한 사용자 제스처 → 네이티브 전체화면 보장

      'document.addEventListener("click",function(e){if(e.target.closest(".vbar"))return;show(n+1)});' +
      'document.addEventListener("keydown",function(e){' +
      'if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" ")show(n+1);' +
      'else if(e.key==="ArrowLeft"||e.key==="PageUp")show(n-1);' +
      'else if(e.key==="f"||e.key==="F")toggleFs();' +
      'else if(e.key==="Escape"){if(document.fullscreenElement)return;if(pseudo){setPseudo(false);return}try{parent.postMessage({pptViewerClose:1},"*")}catch(x){}}});' +
      '})();';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + (window.Charts && window.Charts.css ? window.Charts.css() : '') + vcss + '</style></head><body data-style="pitch">' +
      '<div class="vwrap"><div class="vscale">' + renderSlides(slides) + '</div></div>' + stateScript(slides) +
      '<div class="vbar"><button class="vbtn vprev">‹</button><span class="vcount">1 / ' + slides.length + '</span><button class="vbtn vnext">›</button><button class="vbtn vfs" title="\uc804\uccb4\ud654\uba74 (F)">\u26f6</button></div>' +
      '<scr' + 'ipt>' + vjs + '</scr' + 'ipt></body></html>';
  }

  /* ---- 레이아웃 카탈로그 — "언제 쓰나"가 계약의 일부.
     AI가 브리프를 읽고 섹션마다 타입을 고를 때 이 설명을 그대로 프롬프트에 넣는다. ---- */
  var CATALOG = [
    { type: 'statement', label: '대형 문장', use: '표지, 미션, 섹션 전환, 투자 요청처럼 문장 하나로 전환점을 만들 때. badge(아웃라인 필)와 bottomImage(하단 풀블리드 이미지)로 커버·클로징 연출 가능', needs: ['title'], opt: ['eyebrow', 'badge', 'sub', 'bg', 'pos', 'bottomImage'], cap: { title: '~40자' } },
    { type: 'quote', label: '인용', use: '고객·전문가 발언, 후기처럼 남의 말로 신뢰를 줄 때', needs: ['text', 'by'], opt: ['stat', 'image', 'bg'], cap: { text: '~90자' } },
    { type: 'split', label: '좌우 2분할', use: '설명과 시각자료를 나란히 — 문제 정의, 제품 화면, 경쟁 우위처럼 보여주며 설명할 때', needs: ['title'], opt: ['bullets', 'text', 'stat', 'visual', 'side'], cap: { bullets: '4개 · 각 ~50자' } },
    { type: 'grid', label: 'N열 반복', use: '동급 항목 3~4개를 나열 — 기능, 강점, 팀원, 경쟁사 카드. variant num=큰 번호 카드(비전·기회·차별점, 첫 카드 강조+화살표), 항목에 image를 주면 그 셀은 이미지 타일', needs: ['title', 'items'], opt: ['variant(text|icon|card|person|num)', 'cols', 'accent'], cap: { items: '2~4개', text: '~170자' } },
    { type: 'stats', label: '수치 그리드', use: '트랙션·성과 지표를 2~6개 한 화면에 모아 보여줄 때', needs: ['items'], opt: ['title', 'cols'], cap: { items: '2~6개' } },
    { type: 'bigstat', label: '단일 대형 수치', use: '숫자 하나로 임팩트를 줄 때 — 시장 규모, 점유율, 성장률', needs: ['value'], opt: ['title', 'caption'], cap: { value: '~6자' } },
    { type: 'list', label: '넘버드 카드 리스트', use: '해결책·핵심 기능·문제점을 번호 카드 행으로 나열(첫 행 강조). image를 주면 좌측 이미지+우측 카드 리스트', needs: ['rows'], opt: ['title', 'image', 'accent'], cap: { rows: '2~5줄, 각 label ~20자 + sub ~60자' } },
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

  /* 빈 브리프 → 전 타입 쇼케이스 덱 — 템플릿 라이브러리를 한 장씩 훑어보고 골라 쓰게 */
  function pitchTemplateDeck() {
    var slides = CATALOG.map(function (c) {
      var s = JSON.parse(JSON.stringify(STARTERS[c.type] || STARTERS.statement));
      if (s.title != null && c.type !== 'statement' && c.type !== 'closing') s.title = c.label;   // 장마다 타입 이름을 제목으로 — 뭐가 뭔지 보이게
      return s;
    });
    if (slides[0]) { slides[0].eyebrow = 'PITCH DECK'; slides[0].title = '전체 템플릿'; slides[0].sub = '필요 없는 장은 지우고, 내용을 채워보세요'; }
    return { slides: slides, style: 'pitch' };
  }

  /* AI 프롬프트용 스키마 문서 — 카탈로그의 "언제 쓰나"를 그대로 실어
     브리프 내용에 따라 장표 타입을 고르게 한다(순환 배치 금지). */
  var SCHEMA_DOC = CATALOG.map(function (c) {
    return c.type + '(' + c.label + '): ' + c.use + ' | 필수 ' + c.needs.join(',') + (c.opt ? ' | 선택 ' + c.opt.join(',') : '');
  }).join('\n');
  var FIELD_DOC =
    'statement:{bg:"green|grey|white",pos:"bottom|center",eyebrow?,badge?(아웃라인 필 텍스트),title,sub?,bottomImage?:{label}} | ' +
    'quote:{text,by,stat?:{value,label,stars?:true},bg?} | ' +
    'split:{eyebrow?,title,bullets?:[str],text?,stat?:{value,label},visual?:{label}|{kind:"panel"},side:"left|right",bg?} | ' +
    'grid:{eyebrow?,title,variant:"text|icon|card|person|num",cols:2~4,items:[{head?,role?,text,image?:{label}}],accent?:강조인덱스,bg?} | ' +
    'stats:{eyebrow?,title,cols:2~3,items:[{value,label}],bg?} | ' +
    'bigstat:{eyebrow?,title,value,caption,bg?} | ' +
    'list:{title,rows:[{label,sub}],image?:{label},accent?:강조행인덱스,bg?} | ' +
    'table:{eyebrow?,title,text?,columns:[str],rows:[{cells:[str]}],bg?} | ' +
    'pricing:{title,tiers:[{name,price,per,features:[str],featured?:true}],bg?} | ' +
    'timeline:{title,items:[{when,head,text}],bg?} | ' +
    'chart:{eyebrow?,title,note?,chart:{type:"bar|area|line|donut|pie|bubble|concentric|arc|pyramid|venn|gauge|ring",categories:[str],series:[{name,values:[숫자]}],max?:숫자(gauge·ring 상한),emphasis?:인덱스,format?:{prefix,suffix}},bg?} | ' +
    'matrix:{title,axisX,axisY,points:[{x:0~100,y:0~100,label}],bg?} | ' +
    'gallery:{title,items:[{head?,text?,image?:{label}}],bg?} | ' +
    'closing:{title,contacts:[{k,v}]}';

  /* 결정론 폴백 — AI 실패/미가용 시. 내용 키워드로 장표 타입을 고른다(순환 배치가 아니라). */
  function pitchComposeDeck(brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || '제안 발표';
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 8);
    var slides = [{ type: 'statement', bg: 'green', pos: 'bottom', eyebrow: 'PITCH DECK', title: title, sub: brief.message || '' }];
    var pick = function (sec) {
      // 섹션 제목의 키워드 → 어울리는 장표. 매칭 없으면 grid(가장 범용).
      if (/(로드맵|일정|계획|연혁|절차|단계)/.test(sec)) return { type: 'timeline', bg: 'grey', title: sec, items: [{ when: 'STEP 1', head: '단계', text: '설명을 입력하세요.' }, { when: 'STEP 2', head: '단계', text: '설명을 입력하세요.' }, { when: 'STEP 3', head: '단계', text: '설명을 입력하세요.' }] };
      if (/(성과|지표|트랙션|실적|수치)/.test(sec)) return { type: 'stats', bg: 'grey', title: sec, cols: 3, items: [{ value: '00', label: '지표' }, { value: '00', label: '지표' }, { value: '00', label: '지표' }] };
      if (/(시장|규모|TAM|점유)/i.test(sec)) return { type: 'bigstat', bg: 'white', eyebrow: 'MARKET', title: sec, value: '00%', caption: '설명을 입력하세요.' };
      if (/(요금|가격|플랜|과금)/.test(sec)) return { type: 'pricing', bg: 'white', title: sec, tiers: [{ name: 'TIER 1', price: '$00', per: 'per month', features: ['기능', '기능'] }, { name: 'TIER 2', price: '$00', per: 'per month', features: ['기능', '기능'] }] };
      if (/(추이|성장|매출|그래프|차트)/.test(sec)) return { type: 'chart', bg: 'white', title: sec, chart: { type: 'bar', categories: ['1', '2', '3', '4'], series: [{ name: '값', values: [2, 4, 6, 9] }] } };
      if (/(경쟁|포지셔닝|차별)/.test(sec)) return { type: 'matrix', bg: 'grey', title: sec, axisX: '가로축', axisY: '세로축', points: [{ x: 72, y: 76, label: '우리' }, { x: 34, y: 42, label: '경쟁사' }] };
      if (/(팀|조직|멤버|어드바이저)/.test(sec)) return { type: 'grid', bg: 'white', variant: 'person', title: sec, cols: 4, items: [{ head: '이름', role: 'ROLE', text: '소개' }, { head: '이름', role: 'ROLE', text: '소개' }, { head: '이름', role: 'ROLE', text: '소개' }, { head: '이름', role: 'ROLE', text: '소개' }] };
      if (/(고객|후기|사례|보이스)/.test(sec)) return { type: 'quote', bg: 'green', text: '인용문을 입력하세요.', by: '— 이름' };
      return { type: 'grid', bg: 'white', variant: 'text', title: sec, cols: 3, items: [{ head: '항목', text: '설명을 입력하세요.' }, { head: '항목', text: '설명을 입력하세요.' }, { head: '항목', text: '설명을 입력하세요.' }] };
    };
    (outline.length ? outline : ['핵심 내용']).forEach(function (sec) { slides.push(pick(sec)); });
    slides.push({ type: 'closing', title: 'Thank you', contacts: [{ k: 'TEAM', v: brief.audience || '' }] });
    return { style: 'pitch', slides: slides };
  }

  window.renderPitchDeck = renderPitchDeck;
  window.renderPitchViewer = renderPitchViewer;
  window.pitchTemplateDeck = pitchTemplateDeck;
  window.PITCH_SCHEMA_DOC = SCHEMA_DOC;
  window.PITCH_FIELD_DOC = FIELD_DOC;
  window.pitchComposeDeck = pitchComposeDeck;
  window.PITCH_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.PITCH_MV_SEL = MV_SEL;
  window.PITCH_DEFAULT_DECK = DEFAULT_DECK;
  window.PITCH_CATALOG = CATALOG;
  window.PITCH_STYLE = { id: 'pitch', name: 'Creatable Pitch', desc: '피치덱 · 16:9 · 그린 미니멀', swatch: 'linear-gradient(135deg,#39B966,#181918)' };
  window.PITCH_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.pitchNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.statement)); };
})();
