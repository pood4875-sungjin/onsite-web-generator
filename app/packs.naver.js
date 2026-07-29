/* packs.naver.js — MIDAS Design AX(네이버 스타일): 직각·라인·아이소메트릭 큐브 보고서 팩.
   출처: ~/Downloads/네이버스타일_02 2/ (네이버 스타일_02.dc.html 24장 + DESIGN-SYSTEM.md 실측 규칙).
   원본 캔버스 1920×1080 → 1280×720 렌더(모든 값 ×0.6667 환산 — export-pptx 96dpi 정합).

   시스템 핵심:
   - Pretendard 단일 서체, 극단 웨이트 대비(200↔700). 텍스트 최소 16px(원본 24px).
   - 챕터 컬러 5종(보라/블루/틸/그린/오렌지) — 간지·헤드라인·액센트 바에만, 챕터 밖 교차 사용 금지.
   - 그라데이션·둥근 모서리·이모지·사진 금지 → 아이소메트릭 큐브 SVG 라인 그래픽.
   - 카드 위계 = border-top: 강조 4px 챕터컬러 / 기본 2px Ink / 비활성 2px Rule.
   - **굵게** 마크업: title/summary/statement 텍스트에서 **단어** → 700 웨이트(핵심어 강조).

   데이터: { slides:[{type, ch?(1~5 챕터), ...}], style:'naver' }
   타입 11종: cover·statement·toc·divider·section·cards·split·stats·media·roadmap·closing
   window.renderNaverDeck(data, opts) → 자가완결 HTML(세로 스택). window.NAVER_STYLE 메타. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  /* 마크업 → 웨이트 대비: **굵게**(700) / __흐리게__(200 회색 — 표지 3톤 타이포용) */
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<span class="mut">$1</span>'); }
  function de(path) { return ' data-edit="' + path + '"'; }
  function kind(s, fb) { return esc(String(s.title || fb || s.type || 'Slide').replace(/\n/g, ' ').replace(/\*\*/g, '')); }

  /* 챕터 컬러 — 면(panel)/흰 배경 위 텍스트(text)/연한 배경(tint). g=시그니처 그린(기본) */
  var CH = {
    1: { p: '#A97BDE', t: '#9059C8', bg: '#F4F5F6' },
    2: { p: '#4FB4E9', t: '#2BA8E0', bg: '#F2F8FD' },
    3: { p: '#63C6C0', t: '#3FB8B0', bg: '#EEF7F6' },
    4: { p: '#00DE5A', t: '#00C752', bg: '#F1FBF4' },
    5: { p: '#FF6B4A', t: '#E8543A', bg: '#F4F5F6' },
    g: { p: '#00DE5A', t: '#00C752', bg: '#F1FBF4' }
  };
  function chOf(s) { return CH[s && s.ch] || CH.g; }
  function chVars(s) { var c = chOf(s); return ' style="--ch:' + c.p + ';--cht:' + c.t + ';--chbg:' + c.bg + '"'; }

  /* 아이콘 마크 — 모든 장 좌상단 계단형 3바(9×23 / 9×15 / 9×9, gap 5). onColor=컬러 면 위 */
  function mark(onColor) {
    var c = onColor ? ['#FFFFFF', 'rgba(255,255,255,.6)', 'rgba(255,255,255,.6)'] : ['#00DE5A', '#2C2D2E', '#C8C9CB'];
    return '<span class="nv-mark"><i style="height:23px;background:' + c[0] + '"></i><i style="height:15px;background:' + c[1] + '"></i><i style="height:9px;background:' + c[2] + '"></i></span>';
  }

  /* ---- 아이소메트릭 큐브 SVG — DESIGN-SYSTEM.md 공식 그대로 ----
     top: M cx cy-h L cx+w cy L cx cy+h L cx-w cy Z / left·right 측면. 챕터 컬러 라인 + #F4F5F6 배경 패널 위. */
  function cube(cx, cy, w, h, d, col, sw, fill) {
    var top = 'M' + cx + ' ' + (cy - h) + 'L' + (cx + w) + ' ' + cy + 'L' + cx + ' ' + (cy + h) + 'L' + (cx - w) + ' ' + cy + 'Z';
    var lf = 'M' + (cx - w) + ' ' + cy + 'L' + cx + ' ' + (cy + h) + 'L' + cx + ' ' + (cy + h + d) + 'L' + (cx - w) + ' ' + (cy + d) + 'Z';
    var rt = 'M' + (cx + w) + ' ' + cy + 'L' + cx + ' ' + (cy + h) + 'L' + cx + ' ' + (cy + h + d) + 'L' + (cx + w) + ' ' + (cy + d) + 'Z';
    var f = fill ? col : 'none';
    var a = '<path d="' + top + '" fill="' + (fill ? col : 'none') + '" fill-opacity="' + (fill ? '.18' : '0') + '" stroke="' + col + '" stroke-width="' + sw + '"/>';
    return a + '<path d="' + lf + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '"/>' +
      '<path d="' + rt + '" fill="' + f + '" fill-opacity="' + (fill ? '.3' : '0') + '" stroke="' + col + '" stroke-width="' + sw + '"/>';
  }
  function dashLine(x1, y1, x2, y2, col) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="1.2" stroke-dasharray="4 6" opacity=".55"/>'; }
  function node(x, y, col, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 4) + '" fill="' + col + '"/>'; }
  /* 모티프 — 표지=중앙 큐브+헥사곤 / scatter=흩어짐 / trio=분리 셋 / stack=적층 / pair=채운 쌍 / steps=상승 계단 / arrow=상승 화살표 */
  function iso(motif, col) {
    var g = '';
    if (motif === 'hex') {
      g = '<polygon points="200,30 320,95 320,205 200,270 80,205 80,95" fill="none" stroke="' + col + '" stroke-width="1.4" opacity=".5"/>' +
        cube(200, 130, 60, 34, 44, col, 2.4) +
        dashLine(80, 95, 140, 130, col) + dashLine(320, 205, 260, 164, col) +
        node(80, 95, col) + node(320, 205, col) + node(200, 270, col, 5);
    } else if (motif === 'scatter') {
      g = cube(120, 90, 38, 22, 28, col, 2.2) + cube(260, 70, 30, 17, 22, col, 1.6) +
        cube(210, 190, 46, 26, 34, col, 2.6, true) + cube(320, 170, 26, 15, 20, col, 1.4) +
        dashLine(150, 110, 190, 175, col) + dashLine(285, 90, 235, 170, col) + node(150, 110, col) + node(285, 90, col);
    } else if (motif === 'trio') {
      g = cube(110, 140, 40, 23, 30, col, 2.2) + cube(215, 105, 40, 23, 30, col, 2.2) + cube(305, 170, 40, 23, 30, col, 2.2) +
        dashLine(150, 155, 180, 122, col) + dashLine(250, 122, 272, 158, col) + node(215, 105, col) + node(110, 140, col) + node(305, 170, col);
    } else if (motif === 'stack') {
      g = cube(205, 205, 52, 30, 26, col, 2.2) + cube(205, 145, 52, 30, 26, col, 2.4) + cube(205, 85, 52, 30, 26, col, 2.6, true) +
        dashLine(120, 100, 150, 120, col) + dashLine(292, 100, 262, 120, col) + node(120, 100, col) + node(292, 100, col);
    } else if (motif === 'pair') {
      g = cube(150, 130, 48, 28, 36, col, 2.4, true) + cube(275, 165, 48, 28, 36, col, 2.4, true) +
        dashLine(190, 148, 235, 172, col) + node(150, 130, col) + node(275, 165, col);
    } else if (motif === 'steps') {
      g = cube(105, 215, 36, 21, 26, col, 1.8) + cube(195, 170, 36, 21, 26, col, 2.2) + cube(285, 125, 36, 21, 26, col, 2.6, true) +
        dashLine(135, 220, 165, 182, col) + dashLine(225, 178, 255, 138, col) +
        '<path d="M312 92 L330 74 M330 74 L316 74 M330 74 L330 88" stroke="' + col + '" stroke-width="2.2" fill="none"/>';
    } else { /* arrow — 채워진 큐브에서 우상단 상승 라인 + 진행방향 화살촉 + 작은 큐브(원본 클로징 모티프) */
      g = cube(120, 215, 46, 27, 34, col, 2.4, true) +
        '<line x1="150" y1="185" x2="296" y2="88" stroke="' + col + '" stroke-width="2.4"/>' +
        '<polygon points="310,78 296.7,97.7 286.7,82.7" fill="' + col + '"/>' +
        cube(255, 155, 26, 15, 20, col, 1.6) +
        node(150, 185, col);
    }
    return '<svg class="nv-iso" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
      '<g opacity=".25">' + dashLine(20, 260, 380, 260, col) + dashLine(40, 40, 40, 280, col) + '</g>' + g + '</svg>';
  }
  var CH_MOTIF = { 1: 'scatter', 2: 'trio', 3: 'stack', 4: 'pair', 5: 'steps' };

  /* 네비 스트립 — 우상단. 챕터 라벨은 덱의 divider 제목에서 파생(렌더 시 주입) */
  function navStrip(chapters, activeCh, pageNo) {
    if (!chapters.length) return '';
    var it = chapters.map(function (c) {
      var on = c.ch === activeCh;
      return '<span class="nv-nav-it' + (on ? ' on' : '') + '"' + (on ? ' style="color:' + chOf({ ch: c.ch }).t + '"' : '') + '>' + esc(c.label) + '</span>';
    }).join('<span class="nv-nav-sep">|</span>');
    return '<div class="nv-nav">' + it + (pageNo ? '<span class="nv-nav-pg">' + (pageNo < 10 ? '0' : '') + pageNo + '</span>' : '') + '</div>';
  }
  /* 하단 정리 블록 — SO WHAT 라벨(챕터컬러) + 문장(**핵심어** 700). 원본 05/07 */
  function summary(s, P) {
    if (!s.summary) return '';
    return '<div class="nv-sum"><span class="nv-label ch"' + de(P + '.summaryLabel') + '>' + esc(s.summaryLabel || 'SO WHAT') + '</span>' +
      '<p' + de(P + '.summary') + '>' + mb(s.summary) + '</p></div>';
  }
  /* 헤드라인 블록 — 위 짧은 챕터 바 + 2줄 타이틀(강조어 = 700+챕터컬러) */
  function headline(s, P) { return '<div class="nv-hlblk"><span class="nv-hlbar"></span><h2 class="nv-hl"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2></div>'; }
  /* 넘버 리스트 행 — 01(챕터컬러) + 굵은 소제목 + 설명 나란히. 원본 05/06 */
  function numRow(p, IP, i) {
    var no = '<span class="nl-no">' + (i < 9 ? '0' : '') + (i + 1) + '</span>';
    if (p.head) return '<div class="nl-row">' + no + '<p class="nl-head"' + de(IP + '.head') + '>' + ml(p.head) + '</p><p class="nl-text"' + de(IP + '.text') + '>' + ml(p.text || '') + '</p></div>';
    return '<div class="nl-row">' + no + '<p class="nl-text" style="grid-column:2/-1"' + de(IP + '.text') + '>' + ml(p.text || '') + '</p></div>';
  }
  function listCap(txt, path) { return txt ? '<div class="nl-cap"><span' + de(path) + '>' + esc(txt) + '</span></div>' : ''; }
  /* 라디얼 라인 그래픽 — 밴드 헤더 우측 장식(원본 07) */
  function radialSVG() {
    return '<svg class="cd-radial" viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">' +
      '<g stroke="rgba(255,255,255,.5)" fill="none">' +
      '<circle cx="250" cy="105" r="55" stroke-width="1.6"/><circle cx="250" cy="105" r="95" stroke-width="1" stroke-dasharray="4 6"/>' +
      '<circle cx="250" cy="105" r="140" stroke-width="1"/><line x1="60" y1="105" x2="320" y2="105" stroke-width="1"/>' +
      '<line x1="250" y1="-20" x2="250" y2="230" stroke-width="1" stroke-dasharray="4 6"/></g>' +
      '<circle cx="250" cy="105" r="22" fill="rgba(255,255,255,.85)"/><circle cx="155" cy="105" r="6" fill="rgba(255,255,255,.7)"/><circle cx="250" cy="10" r="5" fill="rgba(255,255,255,.6)"/></svg>';
  }
  /* 로드맵 라인 차트 — 점선 그리드 + 상승 커브 + 45° 마커 + 시점 라벨(원본 23) */
  function roadChart(steps, col) {
    var n = Math.max(steps.length, 2), W = 1150, H = 210;
    var pts = steps.map(function (st, i) {
      var x = 60 + i * (W - 140) / (n - 1), y = (H - 44) - i * (H - 92) / (n - 1);
      return { x: x, y: y, lab: ((st.when || '') + ' ' + (st.head || '')).trim() };
    });
    var grid = [0, 1, 2, 3].map(function (i) { var y = 26 + i * (H - 66) / 3; return '<line x1="30" y1="' + y + '" x2="' + (W - 30) + '" y2="' + y + '" stroke="#EBECED" stroke-dasharray="3 6"/>'; }).join('');
    /* 부드러운 S커브(Catmull-Rom→베지어) — 원본 23의 곡선 궤적 */
    var path = 'M' + pts[0].x + ' ' + pts[0].y;
    for (var ci = 0; ci < pts.length - 1; ci++) {
      var p0 = pts[Math.max(0, ci - 1)], p1 = pts[ci], p2 = pts[ci + 1], p3 = pts[Math.min(pts.length - 1, ci + 2)];
      path += 'C' + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + ' ' + (p1.y + (p2.y - p0.y) / 6).toFixed(1) + ',' +
        (p2.x - (p3.x - p1.x) / 6).toFixed(1) + ' ' + (p2.y - (p3.y - p1.y) / 6).toFixed(1) + ',' + p2.x + ' ' + p2.y;
    }
    var marks = pts.map(function (p, i) {
      return '<line x1="' + p.x + '" y1="24" x2="' + p.x + '" y2="' + (H - 26) + '" stroke="#EBECED"/>' +
        '<rect x="' + (p.x - 7) + '" y="' + (p.y - 7) + '" width="14" height="14" transform="rotate(45 ' + p.x + ' ' + p.y + ')" fill="' + col + '"/>' +
        '<text x="' + Math.min(p.x + 14, W - 260) + '" y="' + (p.y - 16) + '" font-size="16" font-weight="700" fill="#2C2D2E" font-family="Pretendard,sans-serif">' + esc(p.lab.slice(0, 26)) + '</text>';
    }).join('');
    return '<svg class="rm-chart" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">' + grid +
      '<path d="' + path + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>' + marks +
      '<line x1="30" y1="' + (H - 26) + '" x2="' + (W - 30) + '" y2="' + (H - 26) + '" stroke="#2C2D2E" stroke-width="1.4"/></svg>';
  }

  var R = {
    /* 표지 — 좌 나침반 그래픽 패널+그린 밴드 / 우 3단(라벨·날짜 / PROLOGUE+3톤 타이틀+바 / 규칙선+문서명·팀). 원본 01 */
    cover: function (s, P, ctx) {
      var col = '#00DE5A';
      var compass = '<svg class="nv-iso cp" viewBox="0 0 440 480" xmlns="http://www.w3.org/2000/svg">' +
        /* 상하 축 — 선이 내려오고 끝에 점(링 바로 밖) */
        '<line x1="220" y1="20" x2="220" y2="66" stroke="' + col + '" stroke-width="1.6"/><circle cx="220" cy="74" r="4" fill="' + col + '"/>' +
        '<circle cx="220" cy="406" r="4" fill="' + col + '"/><line x1="220" y1="414" x2="220" y2="460" stroke="' + col + '" stroke-width="1.6"/>' +
        /* 눈금 링(바깥 얇은 원 + 틱) */
        '<circle cx="220" cy="240" r="152" fill="none" stroke="' + col + '" stroke-width="1" opacity=".3"/>' +
        (function () { var t = ''; for (var i = 0; i < 60; i++) { var a = i * Math.PI / 30, mj = i % 5 === 0, r1 = mj ? 129 : 134, r2 = 145; t += '<line x1="' + (220 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (240 + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (220 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (240 + r2 * Math.sin(a)).toFixed(1) + '" stroke="' + col + '" stroke-width="' + (mj ? 1.4 : 1) + '" opacity="' + (mj ? '.55' : '.4') + '"/>'; } return t; })() +
        /* 안쪽 다이얼 */
        '<circle cx="220" cy="240" r="100" fill="none" stroke="' + col + '" stroke-width="2"/>' +
        /* 바늘 — 두 날이 같은 베이스 코너를 공유(중심 대칭, 45° 축) */
        '<polygon points="288,172 230,250 210,230" fill="' + col + '" opacity=".88"/>' +
        '<polygon points="152,308 210,230 230,250" fill="' + col + '" opacity=".32"/>' +
        '<circle cx="220" cy="240" r="15" fill="' + col + '"/><circle cx="220" cy="240" r="23" fill="none" stroke="' + col + '" stroke-width="1" opacity=".35"/></svg>';
      return '<section class="slide cv" data-kind="' + kind(s, 'Cover') + '"' + chVars(s) + '>' +
        '<div class="cv-l"><div class="cv-gfx">' + compass + '</div>' +
        '<div class="cv-band">' + mark(true) + (s.band ? '<p class="cv-bandtx"' + de(P + '.band') + '>' + mb(s.band) + '</p>' : '') + '</div></div>' +
        '<div class="cv-r"><div class="cv-top"><span class="nv-label"' + de(P + '.label') + '>' + esc(s.label || 'MIDAS DESIGN AX') + '</span>' +
        (s.date ? '<span class="nv-label"' + de(P + '.date') + '>' + esc(s.date) + '</span>' : '') + '</div>' +
        '<div class="cv-mid">' + (s.eyebrow ? '<span class="nv-label gr"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow) + '</span>' : '') +
        '<h1 class="cv-title"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1><span class="cv-bar"></span>' +
        (s.sub ? '<p class="cv-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') + '</div>' +
        '<div class="cv-foot rule"><span class="cv-doc"' + de(P + '.docLabel') + '>' + esc(s.docLabel || '') + '</span><span class="cv-team"' + de(P + '.team') + '>' + esc(s.team || '') + '</span></div></div></section>';
    },
    /* 풀블리드 대형 문장 — 그린 면 + 화이트, 하단 2열 미니 비교 블록. 원본 02 */
    statement: function (s, P, ctx) {
      var cols = (s.cols || []).map(function (cItem, i) {
        var IP = P + '.cols.' + i;
        return '<div class="st-col"><span class="st-ctag"' + de(IP + '.tag') + '>' + esc(cItem.tag || '') + '</span>' +
          '<p class="st-ctx"' + de(IP + '.text') + '>' + mb(cItem.text || '') + '</p></div>';
      }).join('');
      return '<section class="slide st" data-kind="' + kind(s, 'Statement') + '">' +
        '<div class="st-top">' + mark(true) + '<span class="st-pg">' + (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '') + '</span></div>' +
        '<h1 class="st-title"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
        (s.sub ? '<p class="st-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') +
        (cols ? '<div class="st-cols">' + cols + '</div>' : '<div class="st-fill"></div>') + '</section>';
    },
    /* 목차 — 풀폭 행: 대형 번호(챕터컬러 200)+영문 라벨(회색 700)+한 줄 설명(**강조**)+우측 페이지 범위. 원본 03 */
    toc: function (s, P, ctx) {
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, c = CH[i + 1] || CH.g;
        return '<div class="tc-row"><span class="tc-no" style="color:' + c.t + '"' + de(IP + '.no') + '>' + esc(it.no || ('0' + (i + 1))) + '</span>' +
          '<span class="tc-label"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          '<span class="tc-desc"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</span>' +
          (it.pages ? '<span class="tc-pages"' + de(IP + '.pages') + '>' + esc(it.pages) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide tc" data-kind="' + kind(s, 'Contents') + '">' +
        '<div class="tc-top">' + mark(false) + '<span class="st-pg" style="color:var(--ink)">' + (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '') + '</span></div>' +
        '<p class="tc-head"' + de(P + '.title') + '>' + ml(s.title || 'CONTENTS') + '</p>' +
        '<div class="tc-list">' + rows + '</div></section>';
    },
    /* 간지 — 좌 챕터컬러 패널(마크+NO+영문 49px/200)+그래픽 / 우 리드 33px+본문. 원본 04/09/12/16/22 */
    divider: function (s, P, ctx) {
      var c = chOf(s);
      return '<section class="slide dv" data-kind="' + kind(s, 'Divider') + '"' + chVars(s) + '>' +
        '<div class="dv-l"><div class="dv-panel">' + mark(true) +
        '<p class="dv-no"' + de(P + '.no') + '>' + esc(s.no || (s.ch ? '0' + s.ch : '')) + '</p>' +
        '<p class="dv-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</p></div>' +
        '<div class="dv-gfx">' + iso(CH_MOTIF[s.ch] || 'scatter', c.p) + '</div></div>' +
        '<div class="dv-r">' + navStrip(ctx.chapters, s.ch, ctx.no) +
        '<p class="dv-lead"' + de(P + '.lead') + '>' + mb(s.lead || '') + '</p>' +
        (s.text ? '<p class="dv-text"' + de(P + '.text') + '>' + ml(s.text) + '</p>' : '') + '</div></section>';
    },
    /* 본문 표준 — 넘버 리스트(01+굵은 소제목+설명) + 옵션 우측 풀하이트 패널(aside). 원본 05 실측 */
    section: function (s, P, ctx) {
      var body = '';
      if (s.points && s.points.length) body = listCap(s.listTitle, P + '.listTitle') +
        '<div class="nl-list">' + s.points.map(function (p, i) { return numRow(p, P + '.points.' + i, i); }).join('') + '</div>';
      else if (s.text) body = '<p class="nv-body lg"' + de(P + '.text') + '>' + ml(s.text) + '</p>';
      var aside = '';
      if (s.points2) {   // 2열 넘버 리스트(원본 08) — 우측 리스트는 챕터컬러 톤
        var p2 = '<div class="nl-list">' + s.points2.map(function (p, i) { return numRow(p, P + '.points2.' + i, i); }).join('') + '</div>';
        aside = '<div class="sc-col2 tone-ch">' + listCap(s.listTitle2, P + '.listTitle2') + p2 + '</div>';
      } else if (s.aside) {
        var ai = (s.aside.items || []).map(function (t, i) {
          return '<div class="as-row"><span class="nl-no w44">' + (i < 9 ? '0' : '') + (i + 1) + '</span><span class="as-val"' + de(P + '.aside.items.' + i) + '>' + ml(t) + '</span></div>';
        }).join('');
        aside = '<div class="sc-aside">' + listCap(s.aside.title, P + '.aside.title') + '<div class="nl-list">' + ai + '</div></div>';
      }
      return '<section class="slide sc' + (s.aside && !s.points2 ? ' has-aside' : '') + (s.points2 ? ' two-col' : '') + '" data-kind="' + kind(s, 'Section') + '"' + chVars(s) + '>' +
        (s.aside && !s.points2 ? '<span class="sc-bleed"></span>' : '') +
        '<div class="sc-in">' + navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="sc-cols"><div class="sc-main">' + body + summary(s, P) + '</div>' + aside + '</div></div></section>';
    },
    /* N열 카드 — 두 변형: 기본=border-top 위계(원본 11/15) / variant brand=캡+규칙선+컬러 대형 이름(원본 07).
       banner:true면 상단이 챕터컬러 밴드(흰 헤드라인+라디얼 그래픽) — 원본 07 상단 구조 */
    cards: function (s, P, ctx) {
      var items = s.cards || [], cols = Math.min(Math.max(+s.cols || items.length || 3, 2), 4);
      var brand = s.variant === 'brand';
      var cells = items.map(function (it, i) {
        var IP = P + '.cards.' + i;
        if (brand) {
          return '<div class="nv-card brand">' + listCap(it.tag || '', IP + '.tag') +
            '<p class="bd-head"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
            (it.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
        }
        if (s.variant === 'tile') {
          return '<div class="nv-card tile">' +
            (it.tag ? '<span class="nv-label ch"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
            '<p class="tile-head"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
            (it.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
        }
        var tone = it.tone === 'on' ? ' on' : it.tone === 'dim' ? ' dim' : '';
        return '<div class="nv-card' + tone + '">' +
          (it.tag ? '<span class="nv-label ch"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
          '<p class="nv-chead"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
          (it.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
      }).join('');
      var top = s.banner
        ? '<div class="cd-band">' + '<div class="cd-band-in">' + navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) + '</div>' + radialSVG() + '</div>'
        : navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P);
      return '<section class="slide cd' + (s.banner ? ' banded' : '') + '" data-kind="' + kind(s, 'Cards') + '"' + chVars(s) + '>' +
        top + '<div class="cd-grid c' + cols + '">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 좌 텍스트 / 우 패널(아이소 그래픽·리스트·수치). 원본 06/08/13 */
    split: function (s, P, ctx) {
      var pn = s.panel || {}, c = chOf(s), v = '';
      if (pn.kind === 'stat') v = '<div class="sp-stat"><p class="sp-num"' + de(P + '.panel.value') + '>' + esc(pn.value || '') + '</p><p class="sp-lab"' + de(P + '.panel.label') + '>' + ml(pn.label || '') + '</p></div>';
      else if (pn.kind === 'list') v = '<div class="sp-list">' + (pn.items || []).map(function (t, i) {
        return '<div class="sp-li"><span class="sp-tick" style="background:' + c.p + '"></span><span' + de(P + '.panel.items.' + i) + '>' + ml(t) + '</span></div>';
      }).join('') + '</div>';
      else if (pn.kind === 'question') v = '<div class="sp-q"><span class="nv-label wh"' + de(P + '.panel.label') + '>' + esc(pn.label || 'THE QUESTION') + '</span>' +
        '<p class="sp-qtx"' + de(P + '.panel.text') + '>' + mb(pn.text || '') + '</p></div>';
      else v = iso(pn.motif || CH_MOTIF[s.ch] || 'scatter', c.p);
      var body = '';
      if (s.points && s.points.length) body = listCap(s.listTitle, P + '.listTitle') +
        '<div class="nl-list">' + s.points.map(function (p, i) { return numRow(p, P + '.points.' + i, i); }).join('') + '</div>';
      else if (s.text) body = '<p class="nv-body"' + de(P + '.text') + '>' + ml(s.text) + '</p>';
      return '<section class="slide sp' + (s.side === 'left' ? ' v-left' : '') + '" data-kind="' + kind(s, 'Split') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="sp-cols"><div class="sp-txt">' + body + '</div><div class="nv-panel' + (pn.kind === 'question' ? ' q' : '') + '">' + v + '</div></div>' + summary(s, P) + '</section>';
    },
    /* 수치 — 좌 대형 수치 or 도넛 / 우 게이지 바·보조 항목. 원본 21 */
    stats: function (s, P, ctx) {
      var c = chOf(s), l = '';
      if (s.donut) {
        var pct = Math.max(0, Math.min(100, +s.donut.pct || 0));
        l = '<div class="stt-donut nv-donut" style="background:conic-gradient(' + c.p + ' 0 ' + pct + '%,#E4E5E7 ' + pct + '% 100%)"><div class="stt-hole"><p class="nv-big sm"' + de(P + '.donut.value') + '>' + esc(s.donut.value || (pct + '%')) + '</p>' +
          (s.donut.label ? '<p class="stt-dlab"' + de(P + '.donut.label') + '>' + esc(s.donut.label) + '</p>' : '') + '</div></div>';
      } else if (s.big) {
        l = '<div class="stt-big"><p class="nv-big"' + de(P + '.big.value') + '>' + esc(s.big.value || '') + '</p>' +
          (s.big.label ? '<p class="stt-blab"' + de(P + '.big.label') + '>' + ml(s.big.label) + '</p>' : '') + '</div>';
      }
      var bars = (s.bars || []).map(function (b, i) {
        var IP = P + '.bars.' + i, pct = Math.max(0, Math.min(100, +b.pct || 0)), on = b.on;
        return '<div class="stt-bar"><div class="stt-bmeta"><span class="stt-blabel"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span><span class="stt-bval"' + de(IP + '.value') + '>' + esc(b.value != null ? b.value : pct + '%') + '</span></div>' +
          '<div class="nv-gauge' + (on ? ' on' : '') + '"><i style="width:' + pct + '%;background:' + (on ? c.p : '#DFE1E3') + '"></i></div></div>';
      }).join('');
      return '<section class="slide stt" data-kind="' + kind(s, 'Stats') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="stt-cols"><div class="stt-l">' + l + '</div><div class="stt-r">' + bars + '</div></div>' + summary(s, P) + '</section>';
    },
    /* 이미지 증빙(데모·화면 캡처) — 헤드라인+큰 이미지 슬롯. 원본 18/19/20 */
    media: function (s, P, ctx) {
      var im = s.image || {};
      var v = im.src ? '<div class="p-media full" data-img="' + esc(P + '.image') + '"><img src="' + esc(im.src) + '" alt=""></div>'
        : '<div class="p-media ph full" data-img="' + esc(P + '.image') + '"><span' + de(P + '.image.label') + '>' + esc(im.label || 'ADD IMAGE') + '</span></div>';
      return '<section class="slide md" data-kind="' + kind(s, 'Media') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="md-body">' + v + (s.caption ? '<p class="md-cap"' + de(P + '.caption') + '>' + ml(s.caption) + '</p>' : '') + '</div>' + summary(s, P) + '</section>';
    },
    /* 로드맵 — 시기+단계 카드 3열, border-top 위계로 현재 강조. 원본 23 */
    roadmap: function (s, P, ctx) {
      var cells = (s.steps || []).map(function (st, i) {
        var IP = P + '.steps.' + i, tone = st.state === 'now' ? ' on' : st.state === 'next' ? ' dim' : '';
        return '<div class="nv-card rm' + tone + '"><span class="nv-label ch"' + de(IP + '.when') + '>' + esc(st.when || '') + '</span>' +
          '<p class="nv-chead"' + de(IP + '.head') + '>' + ml(st.head || '') + '</p>' +
          (st.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(st.text) + '</p>' : '') + '</div>';
      }).join('');
      var chart = (s.steps && s.steps.length >= 2 && s.chart !== false) ? '<div class="rm-chartwrap">' + roadChart(s.steps, chOf(s).p) + '</div>' : '';
      return '<section class="slide rm" data-kind="' + kind(s, 'Roadmap') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) + chart +
        '<div class="cd-grid rmg c' + Math.min((s.steps || []).length || 3, 4) + '">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 라인업 — 좌 다이아몬드 그래픽 + 우 리스트(활성=챕터컬러 굵은 언더라인, 비활성=회색). 원본 DRS 13 */
    lineup: function (s, P, ctx) {
      var c = chOf(s);
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, dim = it.state === 'dim';
        return '<div class="ln-row' + (dim ? ' dim' : '') + '"><div class="ln-head-row">' +
          '<p class="ln-head"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
          (it.tag ? '<span class="ln-tag"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') + '</div>' +
          '<span class="ln-rule"></span>' +
          (it.text ? '<p class="ln-text"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
      }).join('');
      /* 원본 13: 뱃지가 다이아 수평 중심선 좌측 끝에 겹쳐 앉고, 중심선이 마름모를 관통해
         우측 꼭짓점(점)에서 항목 수만큼 부챗살로 갈라져 리스트를 향한다. 리스트는 균등 칸(센터 정렬) */
      /* 부챗살은 두 컬럼을 가로지르는 오버레이 SVG — 각 항목 행의 세로 중앙(타이틀 라인)으로 정확히 향한다 */
      var fanN = Math.max((s.items || []).length, 2);
      var fanOv = '<svg class="ln-fan" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        (s.items || []).map(function (_, i) {
          var y = ((i + 0.5) * 100 / fanN).toFixed(1);
          return '<line x1="47.6" y1="50" x2="53.2" y2="' + y + '" stroke="' + c.p + '" stroke-width="1.3" vector-effect="non-scaling-stroke"/>';
        }).join('') + '</svg>';
      return '<section class="slide ln" data-kind="' + kind(s, 'Lineup') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + (s.title ? headline(s, P) : '') +
        '<div class="ln-cols">' + fanOv + '<div class="ln-gfx">' +
        '<svg class="nv-iso" viewBox="0 0 560 420" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="290,30 500,210 290,390 80,210" fill="' + c.p + '" fill-opacity=".08"/>' +
        '<polygon points="290,72 458,210 290,348 122,210" fill="none" stroke="' + c.p + '" stroke-width="1.4"/>' +
        '<line x1="0" y1="210" x2="552" y2="210" stroke="' + c.p + '" stroke-width="1.3"/>' +
        '<circle cx="552" cy="210" r="7" fill="' + c.p + '"/>' +
        '</svg>' +
        ((s.badge || s.name) ? '<div class="ln-badge">' + (s.badge ? '<span class="ln-bx"' + de(P + '.badge') + '>' + esc(s.badge) + '</span>' : '') + '<p class="ln-bname"' + de(P + '.name') + '>' + ml(s.name || '') + '</p></div>' : '') +
        '</div><div class="ln-list">' + rows + '</div></div>' +
        (s.note ? '<p class="ln-note"' + de(P + '.note') + '>' + esc(s.note) + '</p>' : summary(s, P)) + '</section>';
    },
    /* 분기 — 좌 리드 + 커넥터 + 우 항목들(라벨+굵은 규칙선+제목+설명). 원본 10 */
    branch: function (s, P, ctx) {
      var items = s.branches || [], c = chOf(s);
      var n = Math.max(items.length, 2), H = 420;
      // 각 행이 균등 높이(flex space-around)이므로 화살표는 각 칸의 세로 중앙으로
      var ys = items.map(function (_, i) { return Math.round((i + 0.5) * H / n); });
      var mid = H / 2;
      var conn = '<svg class="br-conn" viewBox="0 0 120 ' + H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
        '<line x1="0" y1="' + mid + '" x2="40" y2="' + mid + '" stroke="' + c.p + '" stroke-width="1.6"/>' +
        '<rect x="34" y="' + (mid - 6) + '" width="12" height="12" fill="' + c.p + '"/>' +
        '<line x1="40" y1="' + ys[0] + '" x2="40" y2="' + ys[ys.length - 1] + '" stroke="' + c.p + '" stroke-width="1.6"/>' +
        ys.map(function (y) { return '<line x1="40" y1="' + y + '" x2="106" y2="' + y + '" stroke="' + c.p + '" stroke-width="1.6"/><polygon points="118,' + y + ' 104,' + (y - 6) + ' 104,' + (y + 6) + '" fill="' + c.p + '"/>'; }).join('') + '</svg>';
      var lead = s.lead || {};
      var rows = items.map(function (it, i) {
        var IP = P + '.branches.' + i;
        return '<div class="br-row"><span class="nv-label ch"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span><span class="br-rule"></span>' +
          '<p class="br-head"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
          (it.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide br" data-kind="' + kind(s, 'Branch') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="br-cols"><div class="br-lead">' +
        (lead.label ? '<span class="nv-label ch"' + de(P + '.lead.label') + '>' + esc(lead.label) + '</span>' : '') +
        '<p class="br-leadtx"' + de(P + '.lead.text') + '>' + mb(lead.text || '') + '</p></div>' +
        conn + '<div class="br-list">' + rows + '</div></div>' + summary(s, P) + '</section>';
    },
    /* 단독 대형 수치 — 좌 설명 / 우 대형 넘버 2단(사용자 지시) */
    bigstat: function (s, P, ctx) {
      return '<section class="slide bs" data-kind="' + kind(s, 'Bigstat') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="bs-body">' +
        (s.caption ? '<p class="bs-cap"' + de(P + '.caption') + '>' + mb(s.caption) + '</p>' : '<span></span>') +
        '<p class="nv-big xl"' + de(P + '.value') + '>' + esc(s.value || '') + '</p>' +
        '</div>' + summary(s, P) + '</section>';
    },
    /* 수치 그리드 — KPI 2~4개 나열(카드 위계) */
    kpi: function (s, P, ctx) {
      var items = s.items || [], cols = Math.min(Math.max(+s.cols || items.length || 3, 2), 4);
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, tone = it.tone === 'on' ? ' on' : '';
        return '<div class="nv-card' + tone + '"><p class="kp-val"' + de(IP + '.value') + '>' + esc(it.value || '') + '</p>' +
          '<p class="nv-chead sm"' + de(IP + '.label') + '>' + esc(it.label || '') + '</p>' +
          (it.desc ? '<p class="nv-ctext"' + de(IP + '.desc') + '>' + ml(it.desc) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide kp" data-kind="' + kind(s, 'KPI') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="cd-grid c' + cols + '">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 표 — 1px 규칙선, 첫 열 500. 열 고정 데이터 */
    table: function (s, P, ctx) {
      var cols = s.columns || [];
      var head = '<div class="tb-row hd">' + cols.map(function (c, i) { return '<span class="nv-label"' + de(P + '.columns.' + i) + '>' + esc(c) + '</span>'; }).join('') + '</div>';
      var rows = (s.rows || []).map(function (r, ri) {
        return '<div class="tb-row">' + (r.cells || []).map(function (c, ci) { return '<span' + de(P + '.rows.' + ri + '.cells.' + ci) + '>' + ml(c) + '</span>'; }).join('') + '</div>';
      }).join('');
      return '<section class="slide tb" data-kind="' + kind(s, 'Table') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="tb-wrap" style="--tbc:' + Math.max(cols.length, 2) + '">' + head + rows + '</div>' + summary(s, P) + '</section>';
    },
    /* 타임라인 — 가로 축선 + 45° 마커(라인차트 마커 규칙) */
    timeline: function (s, P, ctx) {
      var items = s.items || [];
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, on = it.on || it.state === 'now';
        return '<div class="tl-cell' + (on ? ' on' : '') + '"><span class="tl-mark"></span>' +
          '<span class="nv-label' + (on ? ' ch' : '') + '"' + de(IP + '.when') + '>' + esc(it.when || '') + '</span>' +
          '<p class="nv-chead sm"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
          (it.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide tl" data-kind="' + kind(s, 'Timeline') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="tl-body"><div class="tl-grid" style="--tln:' + Math.max(items.length, 2) + '">' + cells + '</div></div>' + summary(s, P) + '</section>';
    },
    /* 프로세스 — 단계 → 화살표 흐름 */
    process: function (s, P, ctx) {
      var steps = s.steps || [], accI = s.accent == null ? -1 : +s.accent;
      var cells = steps.map(function (st, i) {
        var IP = P + '.steps.' + i, on = i === accI;
        return (i ? '<span class="pc-arrow">→</span>' : '') +
          '<div class="pc-step' + (on ? ' on' : '') + '">' +
          (st.tag ? '<span class="nv-label ch"' + de(IP + '.tag') + '>' + esc(st.tag) + '</span>' : '') +
          '<p class="nv-chead sm"' + de(IP + '.head') + '>' + ml(st.head || '') + '</p>' +
          (st.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(st.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide pc" data-kind="' + kind(s, 'Process') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="pc-flow">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 비교 — 좌/우 2패널(전/후, A vs B). tone on=챕터 강조 */
    compare: function (s, P, ctx) {
      var items = (s.items || []).slice(0, 2);
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, tone = it.tone === 'on' ? ' on' : it.tone === 'dim' ? ' dim' : (i === 1 ? ' on' : ' dim');
        var pts = (it.points || []).map(function (t, k) {
          return '<div class="sp-li flat"><span class="sp-tick"></span><span' + de(IP + '.points.' + k) + '>' + ml(t) + '</span></div>';
        }).join('');
        return '<div class="nv-card cmp' + tone + '"><p class="nv-chead"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' + pts + '</div>';
      }).join('<span class="cmp-vs">→</span>');
      return '<section class="slide cm" data-kind="' + kind(s, 'Compare') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="cmp-cols">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 인용 — 좌 챕터 바 + 대형 200웨이트 문장 */
    quote: function (s, P, ctx) {
      return '<section class="slide qt" data-kind="Quote"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) +
        '<div class="qt-body"><span class="qt-bar"></span><div>' +
        '<p class="qt-text"' + de(P + '.text') + '>' + mb(s.text || '') + '</p>' +
        (s.by ? '<p class="qt-by"' + de(P + '.by') + '>' + esc(s.by) + '</p>' : '') + '</div></div>' + summary(s, P) + '</section>';
    },
    /* 포지셔닝 — 3패널 중앙 강조(원본 14 "Web Generator 위치") */
    position: function (s, P, ctx) {
      var panels = (s.panels || []).slice(0, 3);
      var cells = panels.map(function (p2, i) {
        var IP = P + '.panels.' + i, on = p2.tone === 'on' || (p2.tone == null && i === 1);
        return '<div class="ps-panel' + (on ? ' on' : '') + '">' +
          (p2.tag ? '<span class="nv-label' + (on ? ' ch' : '') + '"' + de(IP + '.tag') + '>' + esc(p2.tag) + '</span>' : '') +
          '<p class="nv-chead"' + de(IP + '.head') + '>' + ml(p2.head || '') + '</p>' +
          (p2.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(p2.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide ps" data-kind="' + kind(s, 'Position') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="ps-cols">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 체크리스트 — 2열 그리드, 사각 체크 아이콘(직각 시스템) */
    checklist: function (s, P, ctx) {
      var items = (s.items || []).map(function (t, i) {
        return '<div class="ck-li"><span class="ck-icon"></span><span class="ck-tx"' + de(P + '.items.' + i) + '>' + ml(t) + '</span></div>';
      }).join('');
      var ckCols = +s.cols || ((s.items || []).length > 4 ? 2 : 1);   // 항목 적으면 1단
      return '<section class="slide ck" data-kind="' + kind(s, 'Checklist') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="ck-grid c' + ckCols + '">' + items + '</div>' + summary(s, P) + '</section>';
    },
    /* 클로징 — 좌 글로브 그래픽(눈금 링+점선 원+굵은 아크+지구본+축)+다크 밴드 / 우 대형 인사. 원본 24 */
    closing: function (s, P) {
      var col = '#00DE5A';
      var globe = '<svg class="nv-iso cp" viewBox="0 0 440 520" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="220" cy="260" r="185" fill="none" stroke="' + col + '" stroke-width="1" opacity=".28"/>' +
        (function () { var t = ''; for (var i = 0; i < 40; i++) { var a = i * Math.PI / 20; t += '<line x1="' + (220 + 172 * Math.cos(a)).toFixed(1) + '" y1="' + (260 + 172 * Math.sin(a)).toFixed(1) + '" x2="' + (220 + 185 * Math.cos(a)).toFixed(1) + '" y2="' + (260 + 185 * Math.sin(a)).toFixed(1) + '" stroke="' + col + '" stroke-width="1" opacity=".35"/>'; } return t; })() +
        '<circle cx="220" cy="260" r="130" fill="none" stroke="' + col + '" stroke-width="1" stroke-dasharray="3 7" opacity=".45"/>' +
        '<circle cx="220" cy="260" r="95" fill="none" stroke="' + col + '" stroke-width="14" stroke-dasharray="520 78" stroke-linecap="round" transform="rotate(-118 220 260)" opacity=".85"/>' +
        '<circle cx="220" cy="260" r="66" fill="none" stroke="' + col + '" stroke-width="1.6"/>' +
        '<ellipse cx="220" cy="260" rx="30" ry="66" fill="none" stroke="' + col + '" stroke-width="1.2" opacity=".7"/>' +
        '<ellipse cx="220" cy="260" rx="66" ry="21" fill="none" stroke="' + col + '" stroke-width="1.2" opacity=".6"/>' +
        '<line x1="220" y1="96" x2="220" y2="486" stroke="' + col + '" stroke-width="1.4"/>' +
        '<polygon points="220,82 212,100 228,100" fill="' + col + '"/>' +
        '<circle cx="220" cy="492" r="5" fill="' + col + '"/>' +
        '<line x1="44" y1="260" x2="74" y2="260" stroke="' + col + '" stroke-width="1.2" opacity=".6"/><line x1="366" y1="260" x2="396" y2="260" stroke="' + col + '" stroke-width="1.2" opacity=".6"/>' +
        '<circle cx="220" cy="260" r="11" fill="' + col + '"/></svg>';
      var metas = (s.contacts || []).map(function (m, i) {
        return '<div class="cv-meta"><span class="nv-label" style="color:rgba(255,255,255,.55)"' + de(P + '.contacts.' + i + '.k') + '>' + esc(m.k || '') + '</span><span class="cv-mv" style="color:#fff"' + de(P + '.contacts.' + i + '.v') + '>' + esc(m.v || '') + '</span></div>';
      }).join('');
      return '<section class="slide cl" data-kind="' + kind(s, 'Closing') + '">' +
        '<div class="cv-l"><div class="cv-gfx">' + globe + '</div>' +
        '<div class="cv-band dark">' + mark(true) + metas + '</div></div>' +
        '<div class="cv-r"><div class="cv-top"></div>' +
        '<div class="cv-mid"><h1 class="cv-title"' + de(P + '.title') + '>' + mb(s.title || 'Thank you') + '</h1><span class="cv-bar"></span>' +
        (s.sub ? '<p class="cv-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') + '</div><div class="cv-foot"></div></div></section>';
    }
  };

  function renderSlides(slides) {
    /* 네비 스트립용 챕터 목록 — divider 장에서 파생(ch 없으면 순서대로 부여) */
    var chapters = [];
    slides.forEach(function (s) {
      if (s.type === 'divider') { if (!s.ch) s.ch = Math.min(chapters.length + 1, 5); chapters.push({ ch: s.ch, label: String(s.title || '').replace(/\n/g, ' ').toUpperCase() }); }
    });
    /* 본문 장 ch 자동 상속 — 직전 divider의 챕터 */
    var cur = 0;
    slides.forEach(function (s) { if (s.type === 'divider') cur = s.ch; else if (s.ch == null && cur) s.ch = cur; });
    return slides.map(function (s, i) {
      var fn = R[s.type] || R.section;
      var html = '';
      try { html = fn(s, 'slides.' + i, { chapters: chapters, no: i + 1 }); }
      catch (e) { html = '<section class="slide sc" data-kind="Error"><h2 class="nv-hl">' + esc(s.type) + ' 렌더 오류</h2></section>'; }
      return html;
    }).join('\n');
  }

  /* 이동/숨김/굵기 상태 재적용 — honors 팩과 동일 계약(_pos/_hide/_fmt/_z/_ta/_fs/_tw) */
  var MV_SEL = '[data-edit], .s-imgwrap, .p-media, .nv-iso, .nv-mark, .cv-bar, .nv-donut, .nv-gauge, .sp-tick, .tl-mark, .tl-axis, .qt-bar, .pc-arrow, .cmp-vs';
  function stateScript(slides) {
    var st = (slides || []).map(function (s) { return { p: s._pos || {}, h: s._hide || {}, f: s._fmt || {}, z: s._z || {}, a: s._ta || {}, fs: s._fs || {}, w: s._tw || {} }; });
    var js = '(function(){var ST=' + JSON.stringify(st) + ';var SEL=' + JSON.stringify(MV_SEL) + ';' +
      'var sl=document.querySelectorAll(".ppt-stack > .slide, .vscale > .slide");' +
      'for(var i=0;i<sl.length;i++){var c=ST[i];if(!c)continue;var s=sl[i];var mv=s.querySelectorAll(SEL);' +
      'for(var k=0;k<mv.length;k++){var key="m"+k;mv[k].setAttribute("data-mvkey",key);' +
      'var p=c.p[key];if(p)mv[k].style.transform="translate("+p[0]+"px,"+p[1]+"px)";' +
      'var z=c.z[key];if(z!=null){mv[k].style.zIndex=z;if(getComputedStyle(mv[k]).position==="static")mv[k].style.position="relative";}' +
      'if(c.h[key])mv[k].style.display="none";}' +
      'var ed=s.querySelectorAll("[data-edit]");' +
      'for(var e2=0;e2<ed.length;e2++){var path=ed[e2].getAttribute("data-edit")||"";var rel=path.replace(/^slides\\.\\d+\\./,"");' +
      'var f=c.f[rel];if(f==="b")ed[e2].style.fontWeight=700;else if(f==="l")ed[e2].style.fontWeight=200;' +
      'var ta=c.a?c.a[rel]:0;if(ta)ed[e2].style.textAlign=ta==="c"?"center":ta==="r"?"right":"left";' +
      'var fz=c.fs[rel];if(fz)ed[e2].style.fontSize=fz+"px";' +
      'var tw=c.w[rel];if(tw){ed[e2].style.maxWidth="none";ed[e2].style.width=tw+"px";}}' +
      'var cd=s.querySelectorAll(".nv-card,.nv-row,.nl-row,.as-row,.ln-row,.br-row,.nv-panel,.sp-li,.stt-bar,.tc-row,.cv-meta,.pc-step,.tl-cell,.ps-panel,.tb-row");' +
      'for(var q3=0;q3<cd.length;q3++){var el3=cd[q3];if(el3.hasAttribute("data-mvkey"))continue;var ck="c"+q3;el3.setAttribute("data-mvkey",ck);' +
      'var p3=c.p[ck];if(p3)el3.style.transform="translate("+p3[0]+"px,"+p3[1]+"px)";' +
      'var z3=c.z[ck];if(z3!=null){el3.style.zIndex=z3;if(getComputedStyle(el3).position==="static")el3.style.position="relative";}' +
      'if(c.h[ck])el3.style.display="none";}' +
      '}' +
      'window.__clampSlide=function(s){if(!s)return;var els=s.querySelectorAll("[data-mvkey][data-edit]");' +
      'var sr=s.getBoundingClientRect();if(!sr.width)return;var k2=sr.width/(s.offsetWidth||sr.width);' +
      'for(var i2=0;i2<els.length;i2++){var el=els[i2],tf=el.style.transform||"";var mm=tf.match(/translate\\((-?[\\d.]+)px,\\s*(-?[\\d.]+)px\\)/);if(!mm)continue;' +
      'var dx=+mm[1],dy=+mm[2],er=el.getBoundingClientRect();var fy=(sr.top+8*k2-er.top)/k2,fx=(sr.left+8*k2-er.left)/k2,ch=false;' +
      'if(fy>0){dy+=fy;ch=true;}if(fx>0){dx+=fx;ch=true;}' +
      'if(ch)el.style.transform="translate("+dx+"px,"+dy+"px)";}};' +
      'var sls=document.querySelectorAll(".ppt-stack > .slide");for(var c2=0;c2<sls.length;c2++)window.__clampSlide(sls[c2]);' +
      '})();';
    return '<scr' + 'ipt>' + js + '</scr' + 'ipt>';
  }

  /* ---- CSS — DESIGN-SYSTEM.md 실측 ×0.6667. 직각·라인 기반: radius 0, 그라데이션·그림자 장식 없음 ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      ':root{--ink:#2C2D2E;--body:#58595B;--label:#9A9B9D;--muted:#8A8C8E;--rule:#E4E5E7;--surf:#F4F5F6;--grid:#EBECED;' +
      '--green:#00DE5A;--greent:#00C752;--greend:#00A344;--greenbg:#F1FBF4;--ch:#00DE5A;--cht:#00C752;--chbg:#F1FBF4;' +
      '--font:"Pretendard Variable",Pretendard,-apple-system,system-ui,sans-serif;' +
      '--slide-w:1280px;--slide-h:720px}' +
      '*{box-sizing:border-box}body{margin:0;background:#0a0a0e;font-family:var(--font);-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:#fff;color:var(--ink);' +
      'padding:29px 43px 37px 56px;word-break:keep-all;overflow-wrap:break-word;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.4);display:flex;flex-direction:column;gap:27px}' +
      '.slide [data-edit]{white-space:pre-wrap}' +
      '.slide b{font-weight:700}' +
      '.s-imgwrap{position:absolute;right:60px;top:150px;z-index:5}' +
      '.s-imgwrap img{display:block;max-width:420px;max-height:440px;object-fit:cover;-webkit-user-drag:none;user-select:none;pointer-events:none}' +
      /* 공통 프리미티브 */
      '.nv-mark{display:inline-flex;align-items:flex-end;gap:5px}.nv-mark i{display:block;width:9px}' +
      '.nv-label{font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--label)}' +
      '.nv-label.ch{color:var(--cht)}' +
      '.nv-nav{display:flex;align-items:baseline;gap:8px;justify-content:flex-end;font-size:13.5px;font-weight:400;color:var(--muted);white-space:nowrap;flex:none}' +
      '.nv-nav-it.on{font-weight:700}.nv-nav-sep{color:var(--muted);opacity:.6}.nv-nav-pg{color:var(--ink);font-weight:700;margin-left:10px}' +
      /* 헤드라인 블록 — 원본: 네비 아래 큰 여백(100→52), 바는 헤드라인 위 절대배치(140×4→93×3), 강조어=700+챕터컬러 */
      '.nv-hlblk{position:relative;margin-top:46px;flex:none}' +
      '.nv-hlbar{position:absolute;left:0;top:-21px;width:93px;height:3px;background:var(--ch)}' +
      '.nv-hl{font-size:40px;font-weight:200;line-height:1.26;letter-spacing:-.025em;margin:0;max-width:1060px}' +
      '.nv-hl b{font-weight:700;color:var(--cht)}' +
      /* SO WHAT 정리 블록 — 라벨(챕터컬러)+문장(마무리 **굵게**는 잉크) */
      '.nv-sum{margin-top:auto;display:flex;flex-direction:column;gap:9px;flex:none}' +
      '.nv-sum p{font-size:21px;font-weight:200;line-height:1.5;letter-spacing:-.01em;margin:0}.nv-sum b{font-weight:700;color:var(--ink)}' +
      /* 넘버 리스트 — 원본 05: 캡(2px 잉크 규칙선)+행(01 챕터컬러/소제목 500/설명 300) */
      '.nl-cap{padding-bottom:9px;border-bottom:2px solid var(--ink);font-size:16px;letter-spacing:.14em;font-weight:700;flex:none}' +
      '.nl-list{display:flex;flex-direction:column}' +
      '.nl-row{display:grid;grid-template-columns:48px 150px 1fr;gap:21px;align-items:center;padding:17px 0;border-top:1px solid var(--rule)}' +
      '.nl-row:first-child{border-top:0}' +
      '.nl-no{font-size:16px;letter-spacing:.12em;font-weight:700;color:var(--cht)}.nl-no.w44{width:29px}' +
      '.nl-head{font-size:23px;font-weight:500;margin:0}' +
      '.nl-text{font-size:17px;font-weight:300;color:var(--body);margin:0}' +
      /* 본문 우측 풀하이트 패널(aside) — 원본 05 우측 688px 서피스 bleed */
      '.sc-bleed{position:absolute;right:-13px;top:0;bottom:0;width:459px;background:var(--surf)}' +
      '.sc-in{position:relative;flex:1;display:flex;flex-direction:column;gap:27px;min-height:0}' +
      '.sc-cols{flex:1;display:grid;grid-template-columns:1fr;gap:64px;min-height:0}' +
      '.slide.sc.has-aside .sc-cols{grid-template-columns:1fr 371px}' +
      '.sc-main{display:flex;flex-direction:column;gap:20px;min-height:0}.sc-main .nv-sum{margin-top:auto}' +
      '.sc-aside{display:flex;flex-direction:column;gap:13px}' +
      '.as-row{display:flex;align-items:center;gap:19px;padding:17px 0;border-top:1px solid #DCDEE0}.as-row:first-child{border-top:0}' +
      '.as-val{font-size:23px;font-weight:200}' +
      /* 질문 컬러 패널 — 원본 06 우측 */
      '.nv-panel.q{background:var(--ch);display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:20px;padding:36px 38px}' +
      '.nv-label.wh{color:rgba(255,255,255,.85)}' +
      '.sp-qtx{font-size:31px;font-weight:200;line-height:1.45;letter-spacing:-.02em;color:#fff;margin:0}.sp-qtx b{font-weight:700;color:#fff}' +
      /* 밴드 헤더 — 원본 07 상단 챕터컬러 밴드(흰 헤드라인+라디얼 그래픽) */
      '.cd-band{position:relative;background:var(--ch);color:#fff;margin:-29px -43px 0 -56px;padding:29px 43px 40px 56px;flex:none;overflow:hidden}' +
      '.cd-band-in{position:relative;z-index:2}' +
      '.cd-band .nv-nav{color:rgba(255,255,255,.6)}.cd-band .nv-nav-it.on{color:#fff!important}.cd-band .nv-nav-pg{color:#fff}' +
      '.cd-band .nv-hlblk{margin-top:38px}.cd-band .nv-hl{color:#fff}.cd-band .nv-hl b{color:#fff}.cd-band .nv-hlbar{background:#fff}' +
      '.cd-radial{position:absolute;right:0;top:0;height:120%;z-index:1}' +
      '.slide.cd.banded .cd-grid{padding-top:34px}' +
      /* 브랜드 카드 — 캡+규칙선+컬러 대형 이름(원본 07: 44px 700→29px) */
      '.nv-card.brand{border-top:0;padding-top:0;gap:12px}' +
      '.bd-head{font-size:29px;font-weight:700;letter-spacing:-.02em;color:var(--cht);margin:0}' +
      /* 틴트 타일 카드 — 원본 15 "탑재물": 틴트 면+상단 4px 컬러 바+라벨/대형 이름 700/설명 300 강약 */
      '.nv-card.tile{border-top:4px solid var(--ch);background:var(--chbg);padding:24px 26px 28px;gap:12px}' +
      '.tile-head{font-size:29px;font-weight:700;letter-spacing:-.02em;margin:0}' +
      /* 로드맵 라인 차트 */
      '.rm-chartwrap{flex:1;display:flex;align-items:center;min-height:0}.rm-chart{width:100%;height:auto;max-height:230px}' +
      '.cd-grid.rmg{flex:none;align-content:start;padding:8px 0 0}' +
      /* 라인업 — 좌 다이아 그래픽+뱃지, 우 언더라인 리스트 */
      '.ln-cols{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:4.8%;align-items:stretch;min-height:0;position:relative}' +
      '.ln-fan{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
      '.ln-gfx{display:flex;flex-direction:column;gap:20px;justify-content:center}.ln-gfx .nv-iso{width:100%;max-height:78%}' +
      '.ln-badge{display:flex;align-items:center;gap:16px}' +
      '.ln-bx{background:var(--ch);color:#fff;font-weight:700;font-size:15px;letter-spacing:.06em;padding:15px 17px}' +
      '.ln-bname{font-size:25px;font-weight:700;letter-spacing:.02em;margin:0}' +
      '.ln-list{display:flex;flex-direction:column;justify-content:space-around;gap:0;height:100%}' +
      '.ln-row{display:flex;flex-direction:column;gap:9px;justify-content:center}' +
      '.ln-head-row{display:flex;align-items:baseline;gap:12px}' +
      '.ln-head{font-size:21px;font-weight:700;letter-spacing:.02em;margin:0}' +
      '.ln-tag{font-size:15px;font-weight:700;color:var(--cht)}' +
      '.ln-rule{display:block;height:4px;background:var(--ch)}' +
      '.ln-text{font-size:16px;font-weight:300;color:var(--body);margin:0}' +
      '.ln-row.dim .ln-head,.ln-row.dim .ln-tag,.ln-row.dim .ln-text{color:var(--muted)}' +
      '.ln-row.dim .ln-rule{height:3px;background:var(--rule)}' +
      /* 분기 — 좌 리드+커넥터+우 3항목 */
      '.br-cols{flex:1;display:grid;grid-template-columns:300px 80px 1fr;gap:22px;align-items:stretch;min-height:0}' +
      '.br-lead{display:flex;flex-direction:column;gap:12px;justify-content:center}' +
      '.br-leadtx{font-size:29px;font-weight:200;line-height:1.4;letter-spacing:-.02em;margin:0}.br-leadtx b{font-weight:700}' +
      '.br-conn{width:100%;height:100%}' +
      /* 행을 균등 칸으로(space-around) — 커넥터 화살표 y와 행 센터가 맞는다 */
      '.br-list{display:flex;flex-direction:column;justify-content:space-around;gap:0;height:100%}' +
      '.br-row{display:flex;flex-direction:column;gap:8px;justify-content:center}' +
      '.br-rule{display:block;height:3px;background:var(--ch)}' +
      '.br-head{font-size:23px;font-weight:700;margin:4px 0 0}' +
      '.nv-body{font-size:16px;font-weight:300;line-height:1.75;color:var(--body);margin:0;max-width:600px;text-wrap:pretty}' +
      '.nv-body.lg{font-size:18px;max-width:760px}' +
      '.nv-rows{display:flex;flex-direction:column;gap:22px;max-width:640px}' +
      '.nv-row{border-top:1px solid var(--rule);padding-top:14px}' +
      '.nv-rhead{font-size:23px;font-weight:700;letter-spacing:-.02em;margin:0 0 8px}' +
      '.nv-rtext{font-size:16px;font-weight:300;line-height:1.7;color:var(--body);margin:0}' +
      /* 표지·클로징 — 좌 440px 그래픽/밴드 + 우 3단 */
      '.slide.cv,.slide.cl{padding:0;display:grid;grid-template-columns:440px 1fr}' +
      '.cv-l{display:flex;flex-direction:column;background:var(--surf)}' +
      '.cv-gfx{flex:1;display:grid;place-items:center;padding:30px}.cv-gfx svg{width:88%;height:auto}' +
      '.cv-band{height:213px;flex:none;background:var(--green);padding:32px 37px;display:flex;flex-direction:column;justify-content:space-between}' +
      '.cv-band.dark{background:var(--ink)}' +
      '.cv-bandtx{font-size:17px;font-weight:500;line-height:1.5;color:#fff;margin:0;white-space:pre-wrap}' +
      '.cv-r{padding:43px 59px 36px 64px;display:flex;flex-direction:column;justify-content:space-between}' +
      '.cv-top{display:flex;justify-content:space-between;align-items:flex-start}' +
      '.cv-mid{display:flex;flex-direction:column;align-items:flex-start;gap:0}' +
      '.cv-mid .nv-label.gr{color:var(--greent);margin-bottom:22px}' +
      '.cv-title{font-size:60px;font-weight:200;line-height:1.15;letter-spacing:-.035em;margin:0}' +
      '.cv-title b{font-weight:700}.cv-title .mut{color:#A6A8AB;font-weight:200}' +
      '.mut{color:#A6A8AB;font-weight:200}' +
      '.cv-bar{display:block;width:93px;height:3px;background:var(--green);margin:34px 0 0}' +
      '.cv-sub{font-size:19px;font-weight:300;line-height:1.6;color:var(--body);margin:18px 0 0;max-width:520px}' +
      '.cv-foot{display:flex;gap:44px}' +
      '.cv-foot.rule{border-top:1px solid var(--rule);padding-top:18px;justify-content:space-between;align-items:baseline}' +
      '.cv-doc{font-size:18px;font-weight:400;color:var(--ink)}.cv-team{font-size:17px;font-weight:300;color:var(--muted)}' +
      '.cv-meta{display:flex;flex-direction:column;gap:5px}.cv-mv{font-size:17px;font-weight:500;color:var(--ink)}' +
      '.cv-band .nv-mark ~ .cv-bandtx b,.cv-bandtx b{font-weight:700;color:#fff}' +
      '.cv-gfx svg.cp{width:74%;max-height:100%}' +
      /* 풀블리드 문장 — 상단 마크+페이지, 대형 2줄, 본문, 하단 2열 미니 비교 블록(원본 02) */
      '.slide.st{background:var(--green);color:#fff;padding:37px 56px 56px 43px;gap:0}' +
      '.st-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:auto}' +
      '.st-pg{font-size:15px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.9)}' +
      '.st-title{font-size:75px;font-weight:200;line-height:1.1;letter-spacing:-.035em;margin:0;max-width:1100px}' +
      '.st-title b{font-weight:700}' +
      '.st-sub{font-size:19px;font-weight:300;line-height:1.65;color:rgba(255,255,255,.9);margin:30px 0 0;max-width:820px}' +
      '.st-cols{display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-top:48px}' +
      '.st-fill{height:56px}' +
      '.st-col{border-top:1px solid rgba(255,255,255,.65);padding-top:15px;display:flex;flex-direction:column;gap:9px}' +
      '.st-ctag{font-size:15px;font-weight:700;letter-spacing:.14em}' +
      '.st-ctx{font-size:21px;font-weight:300;margin:0}.st-ctx b{font-weight:700}' +
      /* 목차 — 풀폭 행(대형 번호 200/영문 라벨/설명/우측 페이지 범위). 원본 03 */
      '.slide.tc{padding:29px 56px 43px;gap:0}' +
      '.tc-top{display:flex;justify-content:space-between;align-items:flex-start}' +
      '.tc-head{font-size:26px;font-weight:700;letter-spacing:.04em;margin:20px 0 14px}' +
      '.tc-list{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;border-top:1px solid var(--rule)}' +
      '.tc-row{display:grid;grid-template-columns:82px 230px 1fr auto;gap:26px;align-items:center;padding:16px 0;border-bottom:1px solid var(--rule)}' +
      '.tc-row:last-child{border-bottom:0}' +
      '.tc-no{font-size:31px;font-weight:200;letter-spacing:.02em}' +
      '.tc-label{font-size:16px;font-weight:700;letter-spacing:.12em;color:var(--muted)}' +
      '.tc-desc{font-size:21px;font-weight:300;color:var(--ink)}.tc-desc b{font-weight:700}' +
      '.tc-pages{font-size:15px;font-weight:500;color:var(--muted);letter-spacing:.06em}' +
      /* 본문 2열 넘버 리스트(원본 08) — 우측 열은 챕터컬러 톤 */
      '.slide.sc.two-col .sc-cols{grid-template-columns:1fr 1fr;gap:56px}' +
      '.sc-col2{display:flex;flex-direction:column;gap:20px}' +
      '.sc-col2.tone-ch .nl-cap{border-bottom-color:var(--ch)}' +
      /* 간지 */
      '.slide.dv{padding:0;display:grid;grid-template-columns:397px 1fr}' +
      '.dv-l{display:flex;flex-direction:column}' +
      '.dv-panel{background:var(--ch);color:#fff;padding:23px 32px 35px;min-height:313px;display:flex;flex-direction:column;gap:14px}' +
      '.dv-no{font-size:16px;font-weight:700;letter-spacing:.12em;margin:26px 0 0}' +
      '.dv-title{font-size:49px;font-weight:200;line-height:1.05;letter-spacing:-.02em;margin:0;text-transform:uppercase;white-space:pre-wrap}' +
      '.dv-gfx{flex:1;background:var(--surf);display:grid;place-items:center;padding:20px}.dv-gfx svg{width:90%;height:auto}' +
      '.dv-r{padding:29px 37px 37px 56px;display:flex;flex-direction:column}' +
      '.dv-lead{font-size:33px;font-weight:200;line-height:1.3;letter-spacing:-.02em;margin:96px 0 0;max-width:700px}' +
      '.dv-lead b{font-weight:700;color:var(--cht)}' +
      '.dv-text{font-size:16px;font-weight:300;line-height:1.8;color:var(--body);margin:26px 0 0;max-width:620px;text-wrap:pretty}' +
      /* 카드 그리드 */
      '.sc-body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:18px 0}' +
      '.cd-grid{flex:1;display:grid;gap:32px;align-content:center;padding:22px 0}' +
      '.cd-grid.c2{grid-template-columns:1fr 1fr;gap:67px}.cd-grid.c3{grid-template-columns:repeat(3,1fr);gap:44px}.cd-grid.c4{grid-template-columns:repeat(4,1fr);gap:32px}' +
      '.nv-card{border-top:2px solid var(--ink);padding-top:18px;display:flex;flex-direction:column;gap:10px}' +
      '.nv-card.on{border-top:4px solid var(--ch);padding-top:16px}' +
      '.nv-card.dim{border-top-color:var(--rule)}.nv-card.dim .nv-chead{color:var(--muted)}.nv-card.dim .nv-ctext{color:var(--muted)}' +
      '.nv-chead{font-size:24px;font-weight:700;letter-spacing:-.02em;line-height:1.25;margin:0}' +
      '.nv-ctext{font-size:16px;font-weight:300;line-height:1.65;color:var(--body);margin:0}' +
      /* 스플릿 */
      '.sp-cols{flex:1;display:grid;grid-template-columns:1fr 470px;gap:48px;align-items:center;padding:16px 0}' +
      '.slide.sp.v-left .sp-cols{grid-template-columns:470px 1fr}' +
      '.slide.sp.v-left .sp-txt{order:2}.slide.sp.v-left .nv-panel{order:1}' +
      '.sp-txt{display:flex;flex-direction:column;gap:20px}' +
      '.nv-panel{background:var(--surf);align-self:stretch;display:grid;place-items:center;padding:26px}' +
      '.nv-panel svg{width:92%;height:auto}' +
      '.sp-list{display:flex;flex-direction:column;gap:16px;width:100%;padding:10px 14px}' +
      '.sp-li{display:flex;align-items:flex-start;gap:12px;font-size:17px;font-weight:400;line-height:1.5;background:#fff;padding:14px 18px}' +
      '.sp-tick{flex:none;width:9px;height:9px;margin-top:8px}' +
      '.sp-stat{text-align:center}.sp-num{font-size:73px;font-weight:700;letter-spacing:-.02em;color:var(--cht);margin:0}' +
      '.sp-lab{font-size:17px;font-weight:500;color:var(--body);margin:8px 0 0}' +
      /* 수치 */
      '.stt-cols{flex:1;display:grid;grid-template-columns:400px 1fr;gap:56px;align-items:center;padding:0 0 70px}' +
      '.stt-big .nv-big{font-size:100px;font-weight:700;letter-spacing:-.03em;color:var(--cht);margin:0;line-height:1}' +
      '.nv-big.sm{font-size:48px;font-weight:700;color:var(--ink);margin:0}' +
      '.stt-blab{font-size:19px;font-weight:500;color:var(--body);margin:12px 0 0;white-space:pre-wrap}' +
      '.nv-donut{width:293px;height:293px;border-radius:50%;display:grid;place-items:center;margin:0 auto}' +
      '.stt-hole{width:213px;height:213px;border-radius:50%;background:#fff;display:grid;place-content:center;text-align:center;gap:4px}' +
      '.stt-dlab{font-size:16px;font-weight:500;color:var(--muted);margin:0}' +
      '.stt-r{display:flex;flex-direction:column;gap:22px}' +
      '.stt-bmeta{display:flex;justify-content:space-between;margin-bottom:8px}' +
      '.stt-blabel{font-size:17px;font-weight:500}.stt-bval{font-size:17px;font-weight:700;color:var(--cht)}' +
      '.nv-gauge{height:5px;background:#E9EAEB}.nv-gauge.on{height:8px}.nv-gauge i{display:block;height:100%}' +
      /* 미디어 */
      '.md-body{flex:1;display:flex;flex-direction:column;gap:14px;padding:18px 0 0}' +
      '.p-media{background:var(--surf);overflow:hidden;display:grid;place-items:center}' +
      '.p-media.full{flex:1;width:100%}' +
      '.p-media img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.p-media.ph span{font-size:16px;font-weight:700;letter-spacing:.12em;color:var(--muted)}' +
      '.md-cap{font-size:16px;font-weight:300;color:var(--muted);margin:0}' +
      /* 클로징 우측 */
      '.slide.cl .cv-title{font-size:55px}' +
      /* 단독 대형 수치 */
      '.bs-body{flex:1;display:grid;grid-template-columns:1fr auto;gap:70px;align-items:center;padding:0 0 70px}' +
      '.nv-big.xl{font-size:147px;font-weight:700;letter-spacing:-.035em;line-height:.95;color:var(--cht);margin:0;text-align:right}' +
      '.bs-cap{font-size:21px;font-weight:200;line-height:1.55;color:var(--ink);margin:0;max-width:560px}.bs-cap b{font-weight:700;color:var(--cht)}' +
      /* KPI 그리드 */
      '.kp-val{font-size:44px;font-weight:700;letter-spacing:-.02em;color:var(--cht);margin:0;line-height:1}' +
      '.nv-chead.sm{font-size:19px}' +
      /* 표 */
      '.tb-wrap{flex:1;display:flex;flex-direction:column;justify-content:center;padding:16px 0}' +
      '.tb-row{display:grid;grid-template-columns:repeat(var(--tbc),1fr);gap:24px;padding:14px 4px;border-top:1px solid var(--rule);font-size:16px;font-weight:300;color:var(--body)}' +
      '.tb-row span:first-child{font-weight:500;color:var(--ink)}' +
      '.tb-row.hd{border-top:2px solid var(--ink)}.tb-row.hd span,.tb-row.hd .nv-label{font-weight:700;color:var(--label)}' +
      '.tb-row:last-child{border-bottom:1px solid var(--rule)}' +
      /* 타임라인 — 축선을 그리드 좌표계 안에(::before) 두고 마커 중심을 축선 위에 정확히 얹는다 */
      '.tl-body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:16px 0}' +
      '.tl-grid{position:relative;display:grid;grid-template-columns:repeat(var(--tln),1fr);gap:28px;padding-top:30px}' +
      '.tl-grid::before{content:"";position:absolute;left:2px;right:2px;top:8px;height:1px;background:var(--rule)}' +
      '.tl-cell{display:flex;flex-direction:column;gap:8px;position:relative}' +
      '.tl-mark{position:absolute;top:-27px;left:2px;width:11px;height:11px;background:#fff;border:2px solid var(--muted);transform:rotate(45deg)}' +
      '.tl-cell.on .tl-mark{background:var(--ch);border-color:var(--ch)}' +
      /* 프로세스 — 카드 상단 기준 정렬, 화살표는 소제목 라인에 맞춤 */
      '.pc-flow{flex:none;display:flex;align-items:flex-start;gap:18px;margin:auto 0;padding:0 0 70px}' +
      '.pc-step{flex:1;border-top:2px solid var(--ink);padding-top:16px;display:flex;flex-direction:column;gap:8px}' +
      '.pc-step.on{border-top:4px solid var(--ch);padding-top:14px}' +
      '.pc-arrow{font-size:26px;font-weight:200;color:var(--muted);flex:none;margin-top:16px}' +
      /* 비교 — 두 덩어리를 세로 중앙에, 내용 높이만큼만 */
      '.cmp-cols{flex:none;display:grid;grid-template-columns:1fr auto 1fr;gap:34px;align-items:center;margin:auto 0;padding:0 0 70px}' +
      '.nv-card.cmp{gap:14px}.nv-card.cmp .sp-li{padding:0;background:none;font-size:16px}' +
      '.sp-li.flat{background:none;padding:2px 0}' +
      '.nv-card.cmp .sp-tick{background:var(--ch)}.nv-card.cmp.dim .sp-tick{background:var(--muted)}' +
      '.cmp-vs{align-self:center;font-size:30px;font-weight:200;color:var(--muted)}' +
      /* 인용 */
      '.qt-body{flex:1;display:flex;align-items:center;gap:30px;padding:16px 40px}' +
      '.qt-bar{flex:none;width:4px;align-self:stretch;background:var(--ch);margin:20px 0}' +
      '.qt-text{font-size:37px;font-weight:200;line-height:1.4;letter-spacing:-.02em;margin:0;max-width:920px}.qt-text b{font-weight:700;color:var(--cht)}' +
      '.qt-by{font-size:17px;font-weight:500;color:var(--muted);margin:18px 0 0}' +
      /* 포지셔닝 — 중앙 강조 3패널, 세로 중앙·충분한 높이(비어 보임 방지) */
      '.ps-cols{flex:1;display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:26px;align-items:center;align-content:center;padding:16px 0}' +
      '.ps-panel{background:var(--surf);min-height:264px;padding:32px 32px;display:flex;flex-direction:column;gap:12px;justify-content:center}' +
      '.ps-panel.on{background:#fff;border:2px solid var(--ch);min-height:300px}' +
      '.ps-panel.on .nv-chead{font-size:29px;color:var(--cht)}' +
      '.ps-panel .nv-ctext{font-size:17px}' +
      /* 체크리스트 — 사각 체크 아이콘 + 넉넉한 행 */
      '.ck-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:20px 44px;align-content:center;padding:0 0 50px}' +
      '.ck-grid.c1{grid-template-columns:1fr;max-width:900px}' +
      '.ck-li{display:flex;align-items:center;gap:18px;background:var(--chbg);padding:22px 26px;font-size:19px;font-weight:400;line-height:1.5}' +
      '.ck-icon{flex:none;width:26px;height:26px;background:var(--ch);position:relative}' +
      '.ck-icon::after{content:"";position:absolute;left:50%;top:47%;width:7px;height:13px;border:2.5px solid #fff;border-top:0;border-left:0;transform:translate(-50%,-55%) rotate(45deg)}' +
      /* 발표 뷰어 등장 모션 */
      '@keyframes vfu{from{opacity:0}to{opacity:1}}';
  }

  function renderNaverDeck(data, opts) {
    data = data || {}; opts = opts || {};
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + '</style></head><body data-style="naver">' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + '</body></html>';
  }

  /* 발표 뷰어 — honors와 동일 UX(팩 자기완결 원칙상 사본). 순차 등장 유닛·카운트업만 naver 클래스로 교체 */
  function renderNaverViewer(data, opts) {
    data = data || {}; opts = opts || {};
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    var vcss =
      'html,body{height:100%}body{background:#0a0a0e;overflow:hidden}' +
      '.vwrap{position:fixed;inset:0;display:flex;justify-content:center;align-items:flex-start}' +
      '.vscale{width:var(--slide-w);height:var(--slide-h);position:relative;flex:none;transform-origin:top center}' +
      '.vscale .slide{position:absolute;inset:0;visibility:hidden;box-shadow:0 24px 80px rgba(0,0,0,.55)}' +
      '.vscale .slide.cur{visibility:visible}' +
      '.vbar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:9px 16px;border-radius:999px;background:rgba(10,10,14,.72);backdrop-filter:blur(10px);color:#fff;font-family:Pretendard,system-ui,sans-serif;font-size:13px;z-index:9;user-select:none}' +
      '.vbtn{border:none;background:rgba(255,255,255,.12);color:#fff;width:34px;height:34px;border-radius:999px;font-size:15px;cursor:pointer;line-height:1}' +
      '.vbtn:hover{background:rgba(255,255,255,.24)}.vbtn:disabled{opacity:.3;cursor:default}' +
      '.vcount{min-width:52px;text-align:center;font-variant-numeric:tabular-nums;opacity:.9}' +
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
      'setTimeout(function(){if(!document.fullscreenElement&&!pseudo)setPseudo(true);},600);}' +
      'function fit(){var bh=fs()?0:84;var area=innerHeight-bh;var sc=Math.min(innerWidth*0.97/1280,area/720)*(fs()?1:0.97);' +
      'var ty=Math.max(0,(area-720*sc)/2);' +
      'document.querySelector(".vbar").style.display=fs()?"none":"flex";' +
      'var v=document.querySelector(".vscale");v.style.transform="translateY("+ty+"px) scale("+sc+")";}' +
      'function show(i){var prev=n;n=Math.max(0,Math.min(s.length-1,i));if(n===prev)return;' +
      's.forEach(function(x,k){x.classList.toggle("cur",k===n)});' +
      'var cur=s[n];if(cur){' +
      'var us=cur.querySelectorAll(".nv-card,.nv-row,.nl-row,.as-row,.ln-row,.br-row,.tc-row,.sp-li,.stt-bar,.nv-panel,.nv-donut,.stt-big,.cv-meta,.nv-iso,.pc-step,.tl-cell,.ps-panel,.tb-row,.bs-body,.qt-body,.rm-chart");var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      'var cu=cur.querySelectorAll(".nv-big,.sp-num,.stt-bval");for(var w=0;w<cu.length;w++){(function(el){' +
      'var t=el.getAttribute("data-cv");if(t==null){t=el.textContent;el.setAttribute("data-cv",t);}' +
      'var m=t.match(/[\\d,.]+/);if(!m)return;var num=parseFloat(m[0].replace(/,/g,""));if(!isFinite(num))return;' +
      'var dec=(m[0].split(".")[1]||"").length;var cm=m[0].indexOf(",")>=0;var st=null,dur=850;' +
      'function fmt(v){var x=v.toFixed(dec);if(cm)x=x.replace(/\\B(?=(\\d{3})+(?!\\d))/g,",");return t.replace(m[0],x);}' +
      'function stp(ts){if(!st)st=ts;var p2=Math.min(1,(ts-st)/dur);p2=1-Math.pow(1-p2,3);el.textContent=fmt(num*p2);if(p2<1)requestAnimationFrame(stp);else el.textContent=t;}' +
      'requestAnimationFrame(stp);})(cu[w]);}' +
      '}' +
      'c.textContent=(n+1)+" / "+s.length;pb.disabled=n===0;nb.disabled=n===s.length-1;}' +
      'document.addEventListener("fullscreenchange",fit);' +
      'addEventListener("message",function(e){if(!e.data)return;if(e.data.pptFsKey)toggleFs();else if(e.data.pptFsUi!=null)setPseudo(!!e.data.pptFsUi);});' +
      'addEventListener("resize",fit);fit();show(' + (Math.max(0, Math.min(+opts.start || 0, slides.length - 1))) + ');' +
      'pb.onclick=function(e){e.stopPropagation();show(n-1)};nb.onclick=function(e){e.stopPropagation();show(n+1)};' +
      'var fbn=document.querySelector(".vfs");if(fbn)fbn.onclick=function(e){e.stopPropagation();toggleFs();};' +
      'document.addEventListener("click",function(e){if(e.target.closest(".vbar"))return;show(n+1)});' +
      'document.addEventListener("keydown",function(e){' +
      'if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" ")show(n+1);' +
      'else if(e.key==="ArrowLeft"||e.key==="PageUp")show(n-1);' +
      'else if(e.key==="f"||e.key==="F")toggleFs();' +
      'else if(e.key==="Escape"){if(document.fullscreenElement)return;if(pseudo){setPseudo(false);return}try{parent.postMessage({pptViewerClose:1},"*")}catch(x){}}});' +
      '})();';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + vcss + '</style></head><body data-style="naver">' +
      '<div class="vwrap"><div class="vscale">' + renderSlides(slides) + '</div></div>' + stateScript(slides) +
      '<div class="vbar"><button class="vbtn vprev">‹</button><span class="vcount">1 / ' + slides.length + '</span><button class="vbtn vnext">›</button><button class="vbtn vfs" title="전체화면 (F)">⛶</button></div>' +
      '<scr' + 'ipt>' + vjs + '</scr' + 'ipt></body></html>';
  }

  /* ---- 레이아웃 카탈로그 — "언제 쓰나"가 계약. AI가 브리프를 읽고 타입을 고른다 ---- */
  var CATALOG = [
    { type: 'cover', label: '표지', use: '첫 장. 좌측 그래픽+그린 밴드, 우측 타이틀. band=밴드 문구, meta=날짜·팀 크레딧', needs: ['title'], opt: ['sub', 'band', 'meta', 'eyebrow'], cap: { title: '~24자' } },
    { type: 'statement', label: '대형 문장', use: '그린 풀블리드에 문장 하나로 선언·전환. **단어**로 핵심어 굵게', needs: ['title'], opt: ['sub'], cap: { title: '~36자' } },
    { type: 'toc', label: '목차', use: '표지 다음 장. 챕터 리스트(번호는 챕터 컬러 자동). divider 제목과 1:1 일치', needs: ['items'], opt: ['title'], cap: { items: '3~5개' } },
    { type: 'divider', label: '간지', use: '챕터 시작 전환 장 — ch(1~5)가 컬러를 정한다. title=영문 대문자 챕터명, lead=핵심 한 문장(**강조** 가능)', needs: ['ch', 'title', 'lead'], opt: ['text', 'no'], cap: { title: '~16자', lead: '~50자' } },
    { type: 'section', label: '본문 표준', use: '넘버 리스트(01+소제목+설명)가 기본 장. listTitle=리스트 캡, aside=우측 서피스 패널(간단 항목 나열), summary=SO WHAT 정리', needs: ['title'], opt: ['listTitle', 'points', 'text', 'aside', 'summary'], cap: { points: '2~4개' } },
    { type: 'cards', label: 'N열 카드', use: '동급 항목 2~4개 비교·나열. tone:on=강조(챕터컬러 4px), dim=비활성. variant:"brand"=사례 카드(캡+컬러 대형 이름 — 기업·제품 사례), variant:"tile"=틴트 면 카드(구성 요소·산출물 나열), banner:true=상단 챕터컬러 밴드 헤더', needs: ['title', 'cards'], opt: ['cols', 'variant', 'banner', 'summary'], cap: { cards: '2~4개, head ~16자·text ~90자' } },
    { type: 'split', label: '좌우 분할', use: '넘버 리스트(좌)+패널(우) — panel.kind: iso(큐브 그래픽)|list(체크)|stat(대형 수치)|question(챕터컬러 면+큰 질문 문장, 문제 제기 장)', needs: ['title'], opt: ['listTitle', 'text', 'points', 'panel', 'side', 'summary'], cap: { points: '2~4개' } },
    { type: 'stats', label: '수치', use: '성과·지표 — 좌측 big(대형 수치) 또는 donut(구성비), 우측 bars(게이지 비교)', needs: ['title'], opt: ['big', 'donut', 'bars', 'summary'], cap: { bars: '2~4개' } },
    { type: 'media', label: '이미지 증빙', use: '제품 화면·데모·시연 캡처를 크게 보여줄 때 (이미지 슬롯)', needs: ['title'], opt: ['image', 'caption', 'summary'], cap: {} },
    { type: 'roadmap', label: '로드맵', use: '단계·일정 흐름 — steps의 state: done(완료)|now(현재 강조)|next(예정 흐림)', needs: ['title', 'steps'], opt: ['summary'], cap: { steps: '3~4개' } },
    { type: 'bigstat', label: '단독 대형 수치', use: '숫자 하나로 임팩트 — 성장률·규모·달성률', needs: ['title', 'value'], opt: ['caption', 'summary'], cap: { value: '~6자' } },
    { type: 'kpi', label: '수치 그리드', use: 'KPI 2~4개를 한 화면에 — 지표 요약. tone:on=강조', needs: ['title', 'items'], opt: ['cols', 'summary'], cap: { items: '2~4개' } },
    { type: 'table', label: '표', use: '열이 정해진 데이터 나열 — 거래·비교표·현황', needs: ['title', 'columns', 'rows'], opt: ['summary'], cap: { rows: '~5행', columns: '3~4열' } },
    { type: 'timeline', label: '타임라인', use: '시간 순서가 핵심일 때 — 연혁·마일스톤. on:true=현재 시점 강조', needs: ['title', 'items'], opt: ['summary'], cap: { items: '3~5개' } },
    { type: 'process', label: '프로세스', use: '입력→처리→출력 단계 흐름을 화살표로. accent=강조 스텝 인덱스', needs: ['title', 'steps'], opt: ['accent', 'summary'], cap: { steps: '3~4개' } },
    { type: 'compare', label: '비교', use: '전/후, A vs B 두 축 비교 — items 2개(기본: 첫째 dim, 둘째 챕터 강조)', needs: ['title', 'items'], opt: ['summary'], cap: { items: '2개, points 각 2~4개' } },
    { type: 'quote', label: '인용', use: '고객·전문가 발언, 선언적 메시지 하나를 크게', needs: ['text'], opt: ['by', 'summary'], cap: { text: '~80자' } },
    { type: 'position', label: '포지셔닝', use: '흐름 속 우리 위치 — 3패널 중앙 강조(전=좌, 우리=중앙, 후=우)', needs: ['title', 'panels'], opt: ['summary'], cap: { panels: '3개' } },
    { type: 'checklist', label: '체크리스트', use: '확인·완료 항목 나열 — 검증 결과, 제공 범위', needs: ['title', 'items'], opt: ['summary'], cap: { items: '4~8개' } },
    { type: 'lineup', label: '라인업', use: '제품·에이전트 라인업 — 좌 다이아 그래픽+뱃지, 우 리스트(state dim=후보·예정 흐림). 포트폴리오·구성 요소 소개', needs: ['items'], opt: ['title', 'badge', 'summary'], cap: { items: '3~4개' } },
    { type: 'branch', label: '분기', use: '하나가 여럿으로 갈라지는 구조 — 좌 리드 문장+커넥터+우 항목들. 조직·영역·대상 분류', needs: ['title', 'branches'], opt: ['lead', 'summary'], cap: { branches: '2~4개' } },
    { type: 'closing', label: '마무리', use: '마지막 장 — 인사+연락처', needs: ['title'], opt: ['sub', 'contacts'], cap: { contacts: '~3개' } },
  ];

  var DEFAULT_DECK = {
    style: 'naver',
    slides: [
      { type: 'cover', eyebrow: 'MIDAS DESIGN AX', title: '발표 제목을\n**입력하세요**', sub: '핵심 메시지를 한 줄로.', band: '프로젝트 설명을 입력하세요', meta: [{ k: 'DATE', v: '2026' }, { k: 'TEAM', v: 'AX' }] },
      { type: 'toc', title: 'CONTENTS', items: [{ label: '첫 번째 주제' }, { label: '두 번째 주제' }, { label: '세 번째 주제' }] },
      { type: 'divider', ch: 1, title: 'WHY NOW', lead: '왜 지금 이 이야기를 하는가 — **핵심 한 문장**' },
      { type: 'cards', title: '핵심 방향', cards: [{ head: '항목', text: '설명을 입력하세요.', tone: 'on' }, { head: '항목', text: '설명을 입력하세요.' }, { head: '항목', text: '설명을 입력하세요.' }] },
      { type: 'closing', title: 'Thank you', contacts: [{ k: 'EMAIL', v: '' }, { k: 'TEAM', v: '' }] },
    ],
  };

  var STARTERS = {
    cover: { type: 'cover', label: 'MIDAS DESIGN AX', date: '2026 · 07', eyebrow: 'PROLOGUE', title: 'The Machine\n**That Builds** __the Machine__', band: '자동차가 아니라,\n**자동차를 만드는 시스템**', docLabel: '디자인 AX 보고', team: 'ExD팀' },
    statement: { type: 'statement', title: 'The Machine\n**That Builds Design**', sub: '한 건씩 잘 만드는 것만으로는 회사 전체의 품질과 생산성을 바꾸기 어렵습니다.\n좋은 디자인이 반복적으로 생산되는 시스템 자체를 설계합니다.',
      cols: [{ tag: 'TESLA', text: '자동차 한 대 → **생산 시스템**' }, { tag: 'MIDAS', text: '디자인 결과물 → **디자인 에이전트**' }] },
    toc: { type: 'toc', title: 'CONTENTS', items: [
      { label: 'WHY NOW', desc: '누구나 만드는 시대, 차이는 **기준**에서 생깁니다', pages: '04 — 08' },
      { label: 'WHERE WE STAND', desc: 'AI가 함께 참조할 **기준**이 필요합니다', pages: '09 — 11' },
      { label: 'THE SYSTEM', desc: '기준을 담아 실행하는 **디자인 Agent**', pages: '12 — 15' }] },
    divider: { type: 'divider', ch: 1, title: 'SECTION', lead: '이 챕터의 핵심 한 문장' },
    section: { type: 'section', title: '‘만드는 것’은\n이제 **누구나 할 수 있는 일**이 되었습니다', listTitle: '그 결과 나타나는 변화',
      points: [{ head: '진입장벽 하락', text: '전문 도구를 익히지 않아도 결과가 나옵니다' }, { head: '경계 축소', text: '기획 · 제작 · 개발의 구분이 통합됩니다' }, { head: '결과물 증가', text: '만드는 속도와 양이 동시에 상승합니다' }],
      aside: { title: '자연어로 생성되는 것', items: ['UI', '이미지', '영상', '코드'] },
      summary: '생성은 누구나 가능해졌지만,\n**퀄리티는 모두 같지 않습니다.**' },
    cards: { type: 'cards', banner: true, variant: 'brand', title: '선도기업은 자사의 디자인 기준을\n**AI 시스템에 반영**하고 있습니다',
      cards: [{ tag: 'MCP · CODE CONNECT', head: 'Figma', text: '디자인 파일의 컴포넌트·스타일·변수를 생성 도구에 전달' }, { tag: 'FLUENT 2 · AGENT', head: 'Microsoft', text: '공통 기반 규정, 책임 있는 AI 루브릭 심사' }, { tag: 'GENSTUDIO · BRAND', head: 'Adobe', text: '브랜드 가이드 등록으로 생성물 자동 검증' }],
      summary: '기준을 시스템에 담는 것은 이미 **업계의 공통된 선택**입니다.' },
    split: { type: 'split', title: '‘만들었다’와\n**‘잘 만들었다’**는 다릅니다', listTitle: '기준 없는 생성 결과',
      points: [{ text: '화면마다 다른 완성도' }, { text: '불분명한 정보 구조와 시각 위계' }, { text: '사용성과 심미성의 불균형' }],
      panel: { kind: 'question', label: 'THE QUESTION', text: '무엇이 **좋은 결과**인지\n누가, 어떤 기준으로\n판단할 것인가?' } },
    stats: { type: 'stats', title: '수치 제목', big: { value: '00%', label: '지표 설명' }, bars: [{ label: '항목', pct: 70, on: true }, { label: '항목', pct: 40 }] },
    media: { type: 'media', title: '화면 제목', image: { label: 'ADD IMAGE' }, caption: '캡션' },
    roadmap: { type: 'roadmap', title: '로드맵', steps: [{ when: 'NOW', head: '단계', text: '설명', state: 'now' }, { when: 'NEXT', head: '단계', text: '설명', state: 'next' }, { when: 'LATER', head: '단계', text: '설명', state: 'next' }] },
    bigstat: { type: 'bigstat', title: '단독 대형 수치', value: '+32%', caption: '지표에 대한 **핵심 설명**을 입력하세요' },
    kpi: { type: 'kpi', title: '수치 그리드', items: [{ value: '00', label: '지표', tone: 'on' }, { value: '00', label: '지표' }, { value: '00', label: '지표' }] },
    table: { type: 'table', title: '표', columns: ['항목', '내용', '비고'], rows: [{ cells: ['내용', '내용', '내용'] }, { cells: ['내용', '내용', '내용'] }, { cells: ['내용', '내용', '내용'] }] },
    timeline: { type: 'timeline', title: '타임라인', items: [{ when: '2026 Q1', head: '단계', text: '설명' }, { when: '2026 Q2', head: '단계', text: '설명', on: true }, { when: '2026 Q3', head: '단계', text: '설명' }] },
    process: { type: 'process', title: '프로세스', accent: 1, steps: [{ head: '입력', text: '설명' }, { head: '처리', text: '설명', tag: '핵심' }, { head: '출력', text: '설명' }] },
    compare: { type: 'compare', title: '비교', items: [{ head: '이전', points: ['항목', '항목'], tone: 'dim' }, { head: '이후', points: ['항목', '항목'], tone: 'on' }] },
    quote: { type: 'quote', text: '인용문 또는 **핵심 선언**을 입력하세요', by: '— 이름 · 소속' },
    position: { type: 'position', title: '포지셔닝', panels: [{ tag: 'BEFORE', head: '이전 단계', text: '설명' }, { tag: 'OURS', head: '우리 위치', text: '설명', tone: 'on' }, { tag: 'AFTER', head: '다음 단계', text: '설명' }] },
    checklist: { type: 'checklist', title: '체크리스트', items: ['확인 항목을 입력하세요', '확인 항목을 입력하세요', '확인 항목을 입력하세요', '확인 항목을 입력하세요'] },
    lineup: { type: 'lineup', title: '디자인 에이전트 **라인업**', badge: 'DRS', name: 'DESIGN AGENT',
      items: [{ head: 'WEB GENERATOR', tag: '현재 프로토타입', text: '기획 입력 → 웹 생성 → 수정 · 출력' }, { head: 'MOTION WORKFLOW', tag: '일부 실사용', text: '반복 편집 · 자막 · 버전 · 포맷 제작' }, { head: 'VISUAL GENERATOR', tag: '후보', text: '행사 · 캠페인 · 상품 커뮤니케이션 자산', state: 'dim' }, { head: 'PRESENTATION AGENT', tag: '후보', text: '발표자료 초안 · 정리 · 행사 기준 검수', state: 'dim' }] },
    branch: { type: 'branch', title: '디자인 업무는\n**전사 전 영역**에 걸쳐 있습니다',
      lead: { label: '새로 필요한 것', text: '세 영역이 함께 참조할\n**기준과 자산**' },
      branches: [{ label: 'ExD팀', head: '전사 행사 · 기업 브랜드', text: '전사 브랜드 기준과 제작 방식을 축적' }, { label: '각 사업 추진실', head: '상품 MBM · 행사', text: '사업 특성에 맞춰 커뮤니케이션 자산을 제작' }, { label: '상품개발조직', head: '상품 UI · 사용자 경험', text: '상품 특성에 맞는 컴포넌트와 UI 체계를 운영' }] },
    closing: { type: 'closing', title: 'Thank you', contacts: [{ k: 'EMAIL', v: '' }, { k: 'TEAM', v: '' }] },
  };

  function naverTemplateDeck() {
    var k = 0;
    var slides = CATALOG.map(function (c) {
      var s = JSON.parse(JSON.stringify(STARTERS[c.type]));
      // 쇼케이스 가독성 — 본문류 장 제목을 타입 라벨로 + 챕터 컬러 5종 순환(오렌지까지 전부 보이게)
      if (['cover', 'statement', 'closing', 'toc'].indexOf(c.type) < 0) {
        if (s.title != null && c.type !== 'divider') s.title = c.label;
        s.ch = (k++ % 5) + 1;
      }
      return s;
    });
    if (slides[0]) { slides[0].title = '전체 템플릿'; slides[0].sub = '필요 없는 장은 지우고, 내용을 채워보세요'; }
    return { slides: slides, style: 'naver' };
  }

  var SCHEMA_DOC = CATALOG.map(function (c) {
    return c.type + '(' + c.label + '): ' + c.use + ' | 필수 ' + c.needs.join(',') + (c.opt ? ' | 선택 ' + c.opt.join(',') : '');
  }).join('\n');
  var FIELD_DOC =
    'cover:{label?(상단좌 문서 라벨),date?("2026 · 07"),eyebrow?("PROLOGUE"류),title(3톤: **굵게**·__회색 흐림__),sub?,band?(좌하단 그린 밴드 문구, **강조**),docLabel?(하단좌),team?(하단우)} | ' +
    'statement:{title(**굵게** 조합),sub?,cols?:[{tag(영문 라벨),text(**강조** — "A → **B**" 비유 비교)}](2개)} | ' +
    'toc:{title?,items:[{no?,label(영문 대문자 챕터명),desc(한 줄 메시지, **강조**),pages?:"04 — 08"}]} | ' +
    'divider:{ch:1~5,no?:"01",title(영문 대문자),lead,text?} | ' +
    'section:{ch?,title,listTitle?,points?:[{head?,text}],text?,points2?:[{head?,text}]+listTitle2?(2열 대비 리스트 — 좌 일반/우 챕터컬러),aside?:{title,items:[str]},summary?,summaryLabel?} | ' +
    'cards:{ch?,title,cols?:2~4,variant?:"brand"(사례 카드)|"tile"(틴트 면 카드),banner?:true(상단 컬러 밴드),cards:[{head,text?,tone?:"on|dim",tag?}],summary?} | ' +
    'split:{ch?,title,listTitle?,text?,points?:[{head?,text}],panel?:{kind:"iso|list|stat|question",items?:[str],value?,label?,text?},side?:"left",summary?} | ' +
    'stats:{ch?,title,big?:{value,label},donut?:{pct:0~100,value?,label?},bars?:[{label,pct:0~100,value?,on?:true}],summary?} | ' +
    'media:{ch?,title,image?:{label},caption?,summary?} | ' +
    'roadmap:{ch?,title,steps:[{when,head,text?,state?:"done|now|next"}],summary?} | ' +
    'bigstat:{ch?,title,value,caption?,summary?} | ' +
    'kpi:{ch?,title,cols?:2~4,items:[{value,label,desc?,tone?:"on"}],summary?} | ' +
    'table:{ch?,title,columns:[str],rows:[{cells:[str]}],summary?} | ' +
    'timeline:{ch?,title,items:[{when,head,text?,on?:true}],summary?} | ' +
    'process:{ch?,title,steps:[{head,text?,tag?}],accent?:강조인덱스,summary?} | ' +
    'compare:{ch?,title,items:[{head,points:[str],tone?:"on|dim"}](2개),summary?} | ' +
    'quote:{ch?,text,by?,summary?} | ' +
    'position:{ch?,title,panels:[{tag?,head,text?,tone?:"on"}](3개),summary?} | ' +
    'checklist:{ch?,title,items:[str],cols?:1~2,summary?} | ' +
    'lineup:{ch?,title?,badge?,name?(뱃지 옆 시스템명),items:[{head(영문 대문자),tag?,text,state?:"dim"(후보·예정)}],summary?} | ' +
    'branch:{ch?,title,lead?:{label,text},branches:[{label,head,text?}],summary?} | ' +
    'closing:{title,sub?,contacts?:[{k,v}]}' +
    '\n규칙: 챕터마다 divider(ch=1부터 순서대로)를 넣고, 그 챕터의 본문 장들은 ch 생략(자동 상속). ' +
    'title·lead·summary에서 **단어**로 핵심어만 굵게(과용 금지, 장당 1~2회). 이모지 금지.';

  /* 결정론 폴백 — AI 실패/미가용 시 브리프 키워드로 타입 선택 */
  function naverComposeDeck(brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || '제안 발표';
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 5);
    var slides = [{ type: 'cover', eyebrow: 'MIDAS DESIGN AX', title: title, sub: brief.message || '', band: brief.message || '', meta: [{ k: 'DATE', v: String(new Date().getFullYear()) }, { k: 'TEAM', v: brief.audience || '' }] }];
    if (outline.length > 1) slides.push({ type: 'toc', title: 'CONTENTS', items: outline.map(function (o) { return { label: o }; }) });
    var pick = function (sec) {
      if (/(로드맵|일정|계획|절차|단계)/.test(sec)) return { type: 'roadmap', title: sec, steps: [{ when: 'STEP 1', head: '단계', text: '설명', state: 'now' }, { when: 'STEP 2', head: '단계', text: '설명', state: 'next' }, { when: 'STEP 3', head: '단계', text: '설명', state: 'next' }] };
      if (/(성과|지표|실적|수치|트랙션)/.test(sec)) return { type: 'stats', title: sec, big: { value: '00%', label: '지표 설명' }, bars: [{ label: '항목', pct: 70, on: true }, { label: '항목', pct: 40 }] };
      if (/(데모|화면|시연|증빙)/.test(sec)) return { type: 'media', title: sec, image: { label: 'ADD IMAGE' } };
      return { type: 'cards', title: sec, cards: [{ head: '항목', text: '설명을 입력하세요.', tone: 'on' }, { head: '항목', text: '설명을 입력하세요.' }, { head: '항목', text: '설명을 입력하세요.' }] };
    };
    (outline.length ? outline : ['핵심 내용']).forEach(function (sec, si) {
      slides.push({ type: 'divider', ch: Math.min(si + 1, 5), title: sec.toUpperCase().slice(0, 16), lead: sec });
      slides.push(pick(sec));
    });
    slides.push({ type: 'closing', title: 'Thank you', contacts: [{ k: 'TEAM', v: brief.audience || '' }] });
    return { style: 'naver', slides: slides };
  }

  window.renderNaverDeck = renderNaverDeck;
  window.renderNaverViewer = renderNaverViewer;
  window.naverTemplateDeck = naverTemplateDeck;
  window.NAVER_SCHEMA_DOC = SCHEMA_DOC;
  window.NAVER_FIELD_DOC = FIELD_DOC;
  window.naverComposeDeck = naverComposeDeck;
  window.NAVER_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.NAVER_MV_SEL = MV_SEL;
  window.NAVER_DEFAULT_DECK = DEFAULT_DECK;
  window.NAVER_CATALOG = CATALOG;
  window.NAVER_STYLE = { id: 'naver', name: 'Design AX Line', desc: '직각·라인·아이소메트릭 · 챕터 컬러 · 16:9', swatch: 'linear-gradient(135deg,#FFFFFF 55%,#00DE5A 55%)' };
  window.NAVER_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.naverNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.section)); };
})();
