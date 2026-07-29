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
  /* **강조** 마크업 → <b>. 이 시스템의 200↔700 대비 표현 수단(편집 시 마크업은 평문화됨 — 굵기툴바로 재지정) */
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); }
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
    } else { /* arrow */
      g = cube(160, 175, 46, 27, 34, col, 2.4, true) + cube(265, 120, 34, 20, 26, col, 1.8) +
        '<path d="M200 150 L300 70" stroke="' + col + '" stroke-width="2" fill="none"/>' +
        '<polygon points="300,70 284,72 294,86" fill="' + col + '"/>' + node(200, 150, col);
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
  /* 하단 정리 문장 — 본문 장 공통(2px Ink 규칙선 위 19px/200, **핵심어** 700+챕터컬러) */
  function summary(s, P) {
    if (!s.summary) return '';
    return '<div class="nv-sum"><p' + de(P + '.summary') + '>' + mb(s.summary).replace(/<b>/g, '<b class="chb">') + '</p></div>';
  }
  function headline(s, P) { return '<h2 class="nv-hl"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>'; }

  var R = {
    /* 표지 — 좌 그래픽 패널+컬러 밴드 / 우 메타·타이틀·크레딧 3단. 원본 01 */
    cover: function (s, P, ctx) {
      var metas = (s.meta || []).map(function (m, i) {
        return '<div class="cv-meta"><span class="nv-label"' + de(P + '.meta.' + i + '.k') + '>' + esc(m.k || '') + '</span><span class="cv-mv"' + de(P + '.meta.' + i + '.v') + '>' + esc(m.v || '') + '</span></div>';
      }).join('');
      return '<section class="slide cv" data-kind="' + kind(s, 'Cover') + '"' + chVars(s) + '>' +
        '<div class="cv-l"><div class="cv-gfx">' + iso('hex', '#00DE5A') + '</div>' +
        '<div class="cv-band">' + mark(true) + (s.band ? '<p class="cv-bandtx"' + de(P + '.band') + '>' + ml(s.band) + '</p>' : '') + '</div></div>' +
        '<div class="cv-r"><div class="cv-top">' + (s.eyebrow ? '<span class="nv-label"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow) + '</span>' : mark(false)) + '</div>' +
        '<div class="cv-mid"><h1 class="cv-title"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1><span class="cv-bar"></span>' +
        (s.sub ? '<p class="cv-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') + '</div>' +
        '<div class="cv-foot">' + metas + '</div></div></section>';
    },
    /* 풀블리드 대형 문장 — 그린 면 + 화이트 텍스트. 원본 02 */
    statement: function (s, P) {
      return '<section class="slide st" data-kind="' + kind(s, 'Statement') + '">' +
        '<div class="st-top">' + mark(true) + '</div>' +
        '<h1 class="st-title"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
        (s.sub ? '<p class="st-sub"' + de(P + '.sub') + '>' + ml(s.sub) + '</p>' : '') + '</section>';
    },
    /* 목차 — 챕터 번호+라벨 리스트, 번호는 각 챕터 컬러. 원본 03 */
    toc: function (s, P) {
      var rows = (s.items || []).map(function (it, i) {
        var c = CH[i + 1] || CH.g;
        return '<div class="tc-row"><span class="tc-no" style="color:' + c.t + '"' + de(P + '.items.' + i + '.no') + '>' + esc(it.no || ('0' + (i + 1))) + '</span>' +
          '<span class="tc-label"' + de(P + '.items.' + i + '.label') + '>' + esc(it.label || '') + '</span>' +
          (it.desc ? '<span class="tc-desc"' + de(P + '.items.' + i + '.desc') + '>' + esc(it.desc) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide tc" data-kind="' + kind(s, 'Contents') + '">' +
        '<div class="tc-l">' + mark(false) + '<p class="tc-head"' + de(P + '.title') + '>' + ml(s.title || 'CONTENTS') + '</p></div>' +
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
    /* 본문 표준 — 네비→헤드라인 41px→내용 행→하단 정리 문장. 원본 05/10 계열 */
    section: function (s, P, ctx) {
      var body = '';
      if (s.points && s.points.length) body = '<div class="nv-rows">' + s.points.map(function (p, i) {
        var IP = P + '.points.' + i;
        return '<div class="nv-row">' + (p.head ? '<p class="nv-rhead"' + de(IP + '.head') + '>' + esc(p.head) + '</p>' : '') +
          '<p class="nv-rtext"' + de(IP + '.text') + '>' + ml(p.text || '') + '</p></div>';
      }).join('') + '</div>';
      else if (s.text) body = '<p class="nv-body lg"' + de(P + '.text') + '>' + ml(s.text) + '</p>';
      return '<section class="slide sc" data-kind="' + kind(s, 'Section') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="sc-body">' + body + '</div>' + summary(s, P) + '</section>';
    },
    /* N열 카드 — border-top 위계(강조 4px 챕터컬러/기본 2px Ink/비활성 2px Rule). 원본 07/11/15/23 */
    cards: function (s, P, ctx) {
      var items = s.cards || [], cols = Math.min(Math.max(+s.cols || items.length || 3, 2), 4);
      var cells = items.map(function (it, i) {
        var IP = P + '.cards.' + i, tone = it.tone === 'on' ? ' on' : it.tone === 'dim' ? ' dim' : '';
        return '<div class="nv-card' + tone + '">' +
          (it.tag ? '<span class="nv-label ch"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
          '<p class="nv-chead"' + de(IP + '.head') + '>' + ml(it.head || '') + '</p>' +
          (it.text ? '<p class="nv-ctext"' + de(IP + '.text') + '>' + ml(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide cd" data-kind="' + kind(s, 'Cards') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="cd-grid c' + cols + '">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 좌 텍스트 / 우 패널(아이소 그래픽·리스트·수치). 원본 06/08/13 */
    split: function (s, P, ctx) {
      var pn = s.panel || {}, c = chOf(s), v = '';
      if (pn.kind === 'stat') v = '<div class="sp-stat"><p class="sp-num"' + de(P + '.panel.value') + '>' + esc(pn.value || '') + '</p><p class="sp-lab"' + de(P + '.panel.label') + '>' + ml(pn.label || '') + '</p></div>';
      else if (pn.kind === 'list') v = '<div class="sp-list">' + (pn.items || []).map(function (t, i) {
        return '<div class="sp-li"><span class="sp-tick" style="background:' + c.p + '"></span><span' + de(P + '.panel.items.' + i) + '>' + ml(t) + '</span></div>';
      }).join('') + '</div>';
      else v = iso(pn.motif || CH_MOTIF[s.ch] || 'scatter', c.p);
      var body = '';
      if (s.points && s.points.length) body = s.points.map(function (p, i) {
        var IP = P + '.points.' + i;
        return '<div class="nv-row">' + (p.head ? '<p class="nv-rhead"' + de(IP + '.head') + '>' + esc(p.head) + '</p>' : '') + '<p class="nv-rtext"' + de(IP + '.text') + '>' + ml(p.text || '') + '</p></div>';
      }).join('');
      else if (s.text) body = '<p class="nv-body"' + de(P + '.text') + '>' + ml(s.text) + '</p>';
      return '<section class="slide sp' + (s.side === 'left' ? ' v-left' : '') + '" data-kind="' + kind(s, 'Split') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="sp-cols"><div class="sp-txt">' + body + '</div><div class="nv-panel">' + v + '</div></div>' + summary(s, P) + '</section>';
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
      return '<section class="slide rm" data-kind="' + kind(s, 'Roadmap') + '"' + chVars(s) + '>' +
        navStrip(ctx.chapters, s.ch, ctx.no) + headline(s, P) +
        '<div class="cd-grid c' + Math.min((s.steps || []).length || 3, 4) + '">' + cells + '</div>' + summary(s, P) + '</section>';
    },
    /* 클로징 — 좌 그래픽+다크 밴드 / 우 대형 인사+연락처. 원본 24 */
    closing: function (s, P) {
      var metas = (s.contacts || []).map(function (m, i) {
        return '<div class="cv-meta"><span class="nv-label" style="color:rgba(255,255,255,.55)"' + de(P + '.contacts.' + i + '.k') + '>' + esc(m.k || '') + '</span><span class="cv-mv" style="color:#fff"' + de(P + '.contacts.' + i + '.v') + '>' + esc(m.v || '') + '</span></div>';
      }).join('');
      return '<section class="slide cl" data-kind="' + kind(s, 'Closing') + '">' +
        '<div class="cv-l"><div class="cv-gfx">' + iso('arrow', '#00DE5A') + '</div>' +
        '<div class="cv-band dark">' + mark(true) + metas + '</div></div>' +
        '<div class="cv-r"><div class="cv-top">' + mark(false) + '</div>' +
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
  var MV_SEL = '[data-edit], .s-imgwrap, .p-media, .nv-iso, .nv-mark, .cv-bar, .nv-donut, .nv-gauge, .sp-tick';
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
      'var cd=s.querySelectorAll(".nv-card,.nv-row,.nv-panel,.sp-li,.stt-bar,.tc-row,.cv-meta");' +
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
      'padding:29px 43px 37px;word-break:keep-all;overflow-wrap:break-word;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.4);display:flex;flex-direction:column}' +
      '.slide [data-edit]{white-space:pre-wrap}' +
      '.slide b{font-weight:700}' +
      '.s-imgwrap{position:absolute;right:60px;top:150px;z-index:5}' +
      '.s-imgwrap img{display:block;max-width:420px;max-height:440px;object-fit:cover;-webkit-user-drag:none;user-select:none;pointer-events:none}' +
      /* 공통 프리미티브 */
      '.nv-mark{display:inline-flex;align-items:flex-end;gap:5px}.nv-mark i{display:block;width:9px}' +
      '.nv-label{font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--label)}' +
      '.nv-label.ch{color:var(--cht)}' +
      '.nv-nav{display:flex;align-items:baseline;gap:9px;justify-content:flex-end;font-size:16px;font-weight:500;color:var(--muted);white-space:nowrap;margin-bottom:10px}' +
      '.nv-nav-it.on{font-weight:700}.nv-nav-sep{color:var(--rule)}.nv-nav-pg{color:var(--ink);font-weight:700;margin-left:8px}' +
      '.nv-hl{font-size:41px;font-weight:200;line-height:1.1;letter-spacing:-.025em;margin:6px 0 0;max-width:1000px}' +
      '.nv-hl b{font-weight:700}' +
      '.nv-sum{margin-top:auto;border-top:2px solid var(--ink);padding-top:17px}' +
      '.nv-sum p{font-size:19px;font-weight:200;line-height:1.45;margin:0}.nv-sum b.chb{font-weight:700;color:var(--cht)}' +
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
      '.cv-r{padding:43px 59px 43px 64px;display:flex;flex-direction:column;justify-content:space-between}' +
      '.cv-title{font-size:67px;font-weight:200;line-height:1.04;letter-spacing:-.035em;margin:0}' +
      '.cv-title b{font-weight:700}' +
      '.cv-bar{display:block;width:93px;height:3px;background:var(--green);margin:22px 0 0}' +
      '.cv-sub{font-size:19px;font-weight:300;line-height:1.6;color:var(--body);margin:18px 0 0;max-width:520px}' +
      '.cv-foot{display:flex;gap:44px}' +
      '.cv-meta{display:flex;flex-direction:column;gap:5px}.cv-mv{font-size:17px;font-weight:500;color:var(--ink)}' +
      /* 풀블리드 문장 */
      '.slide.st{background:var(--green);color:#fff;padding:37px 43px 45px}' +
      '.st-top{margin-bottom:auto}' +
      '.st-title{font-size:79px;font-weight:200;line-height:1.06;letter-spacing:-.035em;margin:0;max-width:1100px}' +
      '.st-title b{font-weight:700}' +
      '.st-sub{font-size:20px;font-weight:300;line-height:1.55;color:rgba(255,255,255,.85);margin:20px 0 0;max-width:700px}' +
      /* 목차 */
      '.slide.tc{flex-direction:row;gap:60px;padding:43px 56px}' +
      '.tc-l{width:300px;flex:none;display:flex;flex-direction:column;gap:22px}' +
      '.tc-head{font-size:44px;font-weight:200;letter-spacing:-.02em;margin:0}' +
      '.tc-list{flex:1;display:flex;flex-direction:column;justify-content:center}' +
      '.tc-row{display:flex;align-items:baseline;gap:22px;padding:17px 4px;border-top:1px solid var(--rule)}' +
      '.tc-row:last-child{border-bottom:1px solid var(--rule)}' +
      '.tc-no{font-size:24px;font-weight:700;letter-spacing:.02em;min-width:44px}' +
      '.tc-label{font-size:26px;font-weight:500;letter-spacing:-.01em}' +
      '.tc-desc{font-size:16px;font-weight:300;color:var(--muted);margin-left:auto;text-align:right}' +
      /* 간지 */
      '.slide.dv{padding:0;display:grid;grid-template-columns:397px 1fr}' +
      '.dv-l{display:flex;flex-direction:column}' +
      '.dv-panel{background:var(--ch);color:#fff;padding:23px 32px 35px;display:flex;flex-direction:column;gap:14px}' +
      '.dv-no{font-size:16px;font-weight:700;letter-spacing:.12em;margin:16px 0 0}' +
      '.dv-title{font-size:49px;font-weight:200;line-height:1.05;letter-spacing:-.02em;margin:0;text-transform:uppercase;white-space:pre-wrap}' +
      '.dv-gfx{flex:1;background:var(--surf);display:grid;place-items:center;padding:24px}.dv-gfx svg{width:82%;height:auto}' +
      '.dv-r{padding:29px 37px 37px 56px;display:flex;flex-direction:column}' +
      '.dv-lead{font-size:33px;font-weight:200;line-height:1.3;letter-spacing:-.02em;margin:40px 0 0;max-width:700px}' +
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
      '.stt-cols{flex:1;display:grid;grid-template-columns:400px 1fr;gap:56px;align-items:center;padding:14px 0}' +
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
      'var us=cur.querySelectorAll(".nv-card,.nv-row,.tc-row,.sp-li,.stt-bar,.nv-panel,.nv-donut,.stt-big,.cv-meta,.nv-iso");var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
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
    { type: 'section', label: '본문 표준', use: '헤드라인+설명 행. 개념 설명·배경·맥락 전달의 기본 장. summary=하단 정리 문장', needs: ['title'], opt: ['points', 'text', 'summary'], cap: { points: '2~3개' } },
    { type: 'cards', label: 'N열 카드', use: '동급 항목 2~4개 비교·나열 — 기능, 사례, 옵션. tone:on=강조(챕터컬러 4px), dim=비활성', needs: ['title', 'cards'], opt: ['cols', 'summary'], cap: { cards: '2~4개, head ~16자·text ~90자' } },
    { type: 'split', label: '좌우 분할', use: '설명(좌)+시각물(우) — panel.kind: iso(큐브 그래픽)|list(체크 리스트)|stat(대형 수치)', needs: ['title'], opt: ['text', 'points', 'panel', 'side', 'summary'], cap: { points: '2~3개' } },
    { type: 'stats', label: '수치', use: '성과·지표 — 좌측 big(대형 수치) 또는 donut(구성비), 우측 bars(게이지 비교)', needs: ['title'], opt: ['big', 'donut', 'bars', 'summary'], cap: { bars: '2~4개' } },
    { type: 'media', label: '이미지 증빙', use: '제품 화면·데모·시연 캡처를 크게 보여줄 때 (이미지 슬롯)', needs: ['title'], opt: ['image', 'caption', 'summary'], cap: {} },
    { type: 'roadmap', label: '로드맵', use: '단계·일정 흐름 — steps의 state: done(완료)|now(현재 강조)|next(예정 흐림)', needs: ['title', 'steps'], opt: ['summary'], cap: { steps: '3~4개' } },
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
    cover: { type: 'cover', eyebrow: 'MIDAS DESIGN AX', title: '발표 제목', sub: '부제를 입력하세요', band: '프로젝트 설명', meta: [{ k: 'DATE', v: '2026' }, { k: 'TEAM', v: 'AX' }] },
    statement: { type: 'statement', title: '핵심 선언을 **입력하세요**', sub: '보조 설명' },
    toc: { type: 'toc', title: 'CONTENTS', items: [{ label: '첫 번째 주제' }, { label: '두 번째 주제' }, { label: '세 번째 주제' }] },
    divider: { type: 'divider', ch: 1, title: 'SECTION', lead: '이 챕터의 핵심 한 문장' },
    section: { type: 'section', title: '본문 제목', points: [{ head: '소제목', text: '설명을 입력하세요.' }, { head: '소제목', text: '설명을 입력하세요.' }], summary: '하단 **정리 문장**을 입력하세요' },
    cards: { type: 'cards', title: '카드 제목', cards: [{ head: '항목', text: '설명', tone: 'on' }, { head: '항목', text: '설명' }, { head: '항목', text: '설명' }] },
    split: { type: 'split', title: '분할 제목', text: '설명을 입력하세요.', panel: { kind: 'iso' } },
    stats: { type: 'stats', title: '수치 제목', big: { value: '00%', label: '지표 설명' }, bars: [{ label: '항목', pct: 70, on: true }, { label: '항목', pct: 40 }] },
    media: { type: 'media', title: '화면 제목', image: { label: 'ADD IMAGE' }, caption: '캡션' },
    roadmap: { type: 'roadmap', title: '로드맵', steps: [{ when: 'NOW', head: '단계', text: '설명', state: 'now' }, { when: 'NEXT', head: '단계', text: '설명', state: 'next' }, { when: 'LATER', head: '단계', text: '설명', state: 'next' }] },
    closing: { type: 'closing', title: 'Thank you', contacts: [{ k: 'EMAIL', v: '' }, { k: 'TEAM', v: '' }] },
  };

  function naverTemplateDeck() {
    var slides = CATALOG.map(function (c) { return JSON.parse(JSON.stringify(STARTERS[c.type])); });
    if (slides[0]) { slides[0].title = '전체 템플릿'; slides[0].sub = '필요 없는 장은 지우고, 내용을 채워보세요'; }
    return { slides: slides, style: 'naver' };
  }

  var SCHEMA_DOC = CATALOG.map(function (c) {
    return c.type + '(' + c.label + '): ' + c.use + ' | 필수 ' + c.needs.join(',') + (c.opt ? ' | 선택 ' + c.opt.join(',') : '');
  }).join('\n');
  var FIELD_DOC =
    'cover:{eyebrow?,title,sub?,band?,meta?:[{k,v}]} | ' +
    'statement:{title,sub?} | ' +
    'toc:{title?,items:[{label,desc?}]} | ' +
    'divider:{ch:1~5,no?:"01",title(영문 대문자),lead,text?} | ' +
    'section:{ch?,title,points?:[{head?,text}],text?,summary?} | ' +
    'cards:{ch?,title,cols?:2~4,cards:[{head,text?,tone?:"on|dim",tag?}],summary?} | ' +
    'split:{ch?,title,text?,points?:[{head?,text}],panel?:{kind:"iso|list|stat",items?:[str],value?,label?},side?:"left",summary?} | ' +
    'stats:{ch?,title,big?:{value,label},donut?:{pct:0~100,value?,label?},bars?:[{label,pct:0~100,value?,on?:true}],summary?} | ' +
    'media:{ch?,title,image?:{label},caption?,summary?} | ' +
    'roadmap:{ch?,title,steps:[{when,head,text?,state?:"done|now|next"}],summary?} | ' +
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
