/* packs.rams.js — "Rams Report" PPT 스타일 팩 (MIDAS Design AX 보고 스타일)
   소스: ~/Downloads/Rams System Icons deck (Rams Report Template.dc.html 24장 + PDF) 실측 ×0.6667.
   시스템: 웜그레이(#F5F5F3) 바탕 + 흰 라운드 카드(r19) + 다크 패널(#0A0A0A) + 버밀리언 단일 액센트(#FF4D00).
   타이포 = Pretendard, 대형 200 ↔ 강조 600(700 아님·원본 관행), 러닝헤드 + NN/총수 페이지.
   간지 = 다크/오렌지 풀블리드 교대 + 하단 큐브 진행 인디케이터. 그래픽 = 아이소메트릭 와이어 큐브.
   계약: window.renderRamsDeck(data)·renderRamsViewer·ramsTemplateDeck·ramsComposeDeck·RAMS_* — naver 팩과 동일 타입 어휘. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  /* **굵게**(w600) / __흐림__(회색 200) 마크업 */
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<span class="mut">$1</span>'); }
  /* 이중 번호 방어 — 번호는 렌더러가 자동 부여하므로, AI가 head/label에 또 쓴 번호를 걷어낸다
     (순수 숫자면 제거, "01. 제목"형 선행 번호는 프리픽스만 제거) */
  function noNum(t) { t = String(t == null ? '' : t); var m = t.trim(); return /^\d{1,2}\s*[.)·:]?$/.test(m) ? '' : t.replace(/^\s*\d{1,2}\s*[.)·:]\s+/, ''); }
  function de(path) { return ' data-edit="' + path + '"'; }

  var ACC = '#FF4D00', INK = '#0A0A0A', PAPER = '#F5F5F3';

  /* ---- 화면 비율(계약 v1) — data._ratio → 캔버스 px + 문서 루트 data-ratio 슬러그.
     필드가 없으면 16:9로 간주(구 프로젝트 하위호환). 리터럴 캔버스 값은 이 표에서만 나온다. ---- */
  var RATIOS = {
    '16:9': { slug: 'r169', w: 1280, h: 720 },
    '4:3': { slug: 'r43', w: 1280, h: 960 },
    '3.8:1': { slug: 'r381', w: 2736, h: 720 }
  };
  function canvasOf(data) { return RATIOS[(data && data._ratio) || '16:9'] || RATIOS['16:9']; }

  /* ---- 아이소메트릭 와이어 큐브 (원본 표지·엔딩 그래픽) ----
     iso 투영: x' = (x-y)*cos30, y' = (x+y)*sin30 - z. 그리드 바닥 + 와이어 큐브 + 액센트 큐브. */
  function isoPt(x, y, z) { var c = 0.866, s = 0.5; return [(x - y) * c, (x + y) * s - z]; }
  function cubeEdges(cx, cy, x, y, z, s, col, sw, op) {
    var v = [], i;
    var cs = [[0,0,0],[s,0,0],[s,s,0],[0,s,0],[0,0,s],[s,0,s],[s,s,s],[0,s,s]];
    for (i = 0; i < 8; i++) { var p = isoPt(x + cs[i][0], y + cs[i][1], z + cs[i][2]); v.push([cx + p[0], cy - p[1]]); }
    var E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    return E.map(function (e) { return '<line x1="' + v[e[0]][0].toFixed(1) + '" y1="' + v[e[0]][1].toFixed(1) + '" x2="' + v[e[1]][0].toFixed(1) + '" y2="' + v[e[1]][1].toFixed(1) + '" stroke="' + col + '" stroke-width="' + sw + '" opacity="' + op + '"/>'; }).join('');
  }
  function isoGridCube() {   // 표지 — 그리드 평면 + 큰 와이어 큐브 + 안쪽 액센트 큐브
    var g = '', i;
    for (i = 0; i <= 6; i++) {
      var a = isoPt(i * 40, 0, 0), b = isoPt(i * 40, 240, 0), c2 = isoPt(0, i * 40, 0), d = isoPt(240, i * 40, 0);
      g += '<line x1="' + (160 + a[0]) + '" y1="' + (230 - a[1]) + '" x2="' + (160 + b[0]) + '" y2="' + (230 - b[1]) + '" stroke="#43434A" stroke-width="0.8" opacity=".5"/>';
      g += '<line x1="' + (160 + c2[0]) + '" y1="' + (230 - c2[1]) + '" x2="' + (160 + d[0]) + '" y2="' + (230 - d[1]) + '" stroke="#43434A" stroke-width="0.8" opacity=".5"/>';
    }
    return '<svg class="rs-cube" viewBox="-56 -18 432 376" xmlns="http://www.w3.org/2000/svg">' + g +
      cubeEdges(160, 230, 40, 40, 0, 160, '#8A8A90', 1.1, '.8') +
      '<circle cx="160" cy="70" r="3" fill="#8A8A90"/><circle cx="299" cy="150" r="3" fill="#8A8A90"/><circle cx="21" cy="150" r="3" fill="#8A8A90"/>' +
      cubeEdges(160, 205, 90, 90, 30, 60, ACC, 2, '1') + '</svg>';
  }
  function isoCluster() {   // 엔딩 — 큐브 군집(뒤 와이어 2 + 앞 액센트 1)
    var g = '', i;
    for (i = 0; i <= 7; i++) {
      var a = isoPt(i * 40, 0, 0), b = isoPt(i * 40, 280, 0), c2 = isoPt(0, i * 40, 0), d = isoPt(280, i * 40, 0);
      g += '<line x1="' + (200 + a[0]) + '" y1="' + (250 - a[1]) + '" x2="' + (200 + b[0]) + '" y2="' + (250 - b[1]) + '" stroke="#43434A" stroke-width="0.8" opacity=".45"/>';
      g += '<line x1="' + (200 + c2[0]) + '" y1="' + (250 - c2[1]) + '" x2="' + (200 + d[0]) + '" y2="' + (250 - d[1]) + '" stroke="#43434A" stroke-width="0.8" opacity=".45"/>';
    }
    return '<svg class="rs-cube" viewBox="-51 -38 502 351" xmlns="http://www.w3.org/2000/svg">' + g +
      cubeEdges(140, 240, 20, 120, 0, 90, '#6A6A70', 1, '.7') +
      cubeEdges(255, 245, 110, 30, 0, 130, '#8A8A90', 1.1, '.85') +
      cubeEdges(255, 228, 150, 70, 40, 50, ACC, 2, '1') + '</svg>';
  }
  function cubeIcon(on) {   // 간지 하단 진행 인디케이터의 작은 큐브
    return '<svg class="rs-ind" viewBox="0 0 22 24" xmlns="http://www.w3.org/2000/svg">' +
      cubeEdges(11, 18, 0, 0, 0, 9, on ? ACC : 'currentColor', on ? 1.6 : 1.1, on ? '1' : '.5') + '</svg>';
  }
  function playIcon() { return '<span class="rs-play"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5.5v13l11-6.5z" fill="' + ACC + '"/></svg></span>'; }

  /* ---- 공통 조각 ---- */
  function logo(s, P) {
    return '<span class="rs-logo"><i></i><em' + de(P + '.label') + '>' + esc(s.label || 'MIDAS Design AX') + '</em></span>';
  }
  /* 러닝헤드 — 좌 "챕터명 · 킥커" / 우 NN/총수. dark=다크·액센트 면 위 */
  function runhead(s, P, ctx, dark) {
    var ch = ctx && ctx.chapterOf ? ctx.chapterOf(ctx.no) : null;
    var left = s.kicker != null ? s.kicker : (ch ? ch.title + (s.tag ? ' · ' + s.tag : '') : (s.tag || ''));
    var pg = (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '');
    return '<div class="rs-run' + (dark ? ' dk' : '') + '"><span class="rs-runl"' + de(P + '.kicker') + '>' + esc(left) + '</span>' +
      '<span class="rs-runr"><b>' + pg + '</b>/' + (ctx ? ctx.total : '') + '</span></div>';
  }
  /* 타이틀 강약 폴백 — 문장형 title에 **가 없으면 꼬리를 자동 볼드(하우스 스타일: 라이트 도입 + 굵은 핵심).
     멀티라인=마지막 줄 전체, 한 줄=뒤쪽 40% 어절. AI가 넣은 **는 그대로 존중 */
  function emph(t) {
    t = String(t == null ? '' : t);
    if (!t || t.indexOf('**') !== -1) return t;
    var lines = t.split('\n');
    if (lines.length > 1) {
      lines[lines.length - 1] = '**' + lines[lines.length - 1] + '**';
      return lines.join('\n');
    }
    var ws = t.split(' ');
    if (ws.length < 3) return t;
    var k = Math.max(1, Math.ceil(ws.length * 0.4));
    return ws.slice(0, ws.length - k).join(' ') + ' **' + ws.slice(ws.length - k).join(' ') + '**';
  }
  function headline(s, P, big) {
    return '<h2 class="rs-hl' + (big ? ' lg' : '') + '"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>';
  }
  /* 하단 마무리 문장 — **강조**=액센트 600 (원본 SO WHAT 대응) */
  function note(s, P) {
    return s.note ? '<p class="rs-note"' + de(P + '.note') + '>' + mb(s.note) + '</p>' : '';
  }
  function kind(s, d) { return esc(s.kindLabel || d); }
  function numRow(p, IP, i) {
    return '<div class="rs-row"><span class="rs-no"' + de(IP + '.no') + '>' + esc(p.no || ('0' + (i + 1))) + '</span>' +
      (noNum(p.head) ? '<span class="rs-rhead"' + de(IP + '.head') + '>' + esc(noNum(p.head)) + '</span>' : '') +
      '<span class="rs-rtext"' + de(IP + '.text') + '>' + mb(p.text || '') + '</span></div>';
  }
  var CLANG = 'ko';   /* 산출물 언어(data._clang) — renderRamsDeck/Viewer에서 갱신 */
  function lf(ko, en, ja, zh) { return CLANG === 'ko' ? ko : CLANG === 'ja' ? (ja || en) : CLANG === 'zh' ? (zh || en) : en; }
  function imgPh(label, P) {
    return '<div class="rs-imgph" data-img="slot"><span>' + esc(label || lf('이미지를 여기에 놓으세요', 'Drop an image here', '画像をここに', '将图片拖到此处')) + '</span></div>';
  }

  /* ---- 타입 렌더러 ---- */
  var R = {
    /* 표지 — 다크 + 로고/날짜, PROLOGUE + 3톤 대형 타이틀 + 아이소 큐브, 하단 밴드/문서명. 원본 01 */
    cover: function (s, P, ctx) {
      return '<section class="slide rs cv dk" data-kind="' + kind(s, 'Cover') + '">' +
        '<div class="rs-cvtop">' + logo(s, P) + '<span class="rs-cvdate"' + de(P + '.date') + '>' + esc(s.date || '') + '</span></div>' +
        '<div class="rs-cvmid"><div class="rs-cvtx">' +
        (s.eyebrow ? '<span class="rs-eyebrow"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow) + '</span>' : '') +
        '<h1 class="rs-cvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1></div>' +
        '<div class="rs-cvgfx">' + isoGridCube() + '</div></div>' +
        '<div class="rs-cvfoot"><span' + de(P + '.band') + '>' + mb(s.band || '') + '</span><span' + de(P + '.docLabel') + '>' + esc(s.docLabel || '') + '</span></div></section>';
    },
    /* 대형 선언 — 라이트, 타이틀+본문+비교 카드 2개(흰/다크). 원본 02 */
    statement: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cols.' + i;
        return '<div class="rs-card stc' + (i === 1 ? ' dk' : '') + '"><span class="rs-tag' + (i === 1 ? ' acc' : '') + '"' + de(IP + '.tag') + '>' + esc(c.tag || '') + '</span>' +
          '<span class="rs-sttx"' + de(IP + '.text') + '>' + mb(c.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide rs st" data-kind="' + kind(s, 'Statement') + '">' + runhead({ kicker: s.kicker != null ? s.kicker : 'Statement' }, P, ctx) +
        '<div class="rs-stmid"><h1 class="rs-sttitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.sub ? '<p class="rs-stsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') + '</div>' +
        (cols ? '<div class="rs-stcols">' + cols + '</div>' : '') + '</section>';
    },
    /* 목차 — 흰 라운드 카드 행: 번호(첫 액센트)+영문 라벨+메시지+페이지. 원본 03 */
    toc: function (s, P, ctx) {
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="rs-trow"><span class="rs-tno' + (i === 0 ? ' acc' : '') + '"' + de(IP + '.no') + '>' + esc(it.no || ('0' + (i + 1))) + '</span>' +
          '<span class="rs-tlabel"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          '<span class="rs-tdesc"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</span>' +
          (it.pages ? '<span class="rs-tpages"' + de(IP + '.pages') + '>' + esc(it.pages) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide rs tc" data-kind="' + kind(s, 'Contents') + '">' + runhead({ kicker: s.kicker != null ? s.kicker : 'Contents' }, P, ctx) +
        '<p class="rs-tchead"' + de(P + '.title') + '>' + ml(s.title || lf('보고 순서', 'Contents', '目次', '目录')) + '</p>' +
        '<div class="rs-tlist">' + rows + '</div></section>';
    },
    /* 간지 — 다크/액센트 풀블리드 교대 + 대형 2줄 + 서브 + 큐브 진행 인디케이터. 원본 04·09·12·16·22 */
    divider: function (s, P, ctx) {
      var idx = ctx.dividerIndex(ctx.no), total = ctx.chapters.length || 1;
      var acc = s.bg ? s.bg === 'accent' : idx % 2 === 1;   // 기본 교대: 다크→오렌지→다크…
      var cubes = ''; for (var i = 0; i < Math.max(total, 1); i++) cubes += cubeIcon(i === idx);
      return '<section class="slide rs dv ' + (acc ? 'ac' : 'dk') + '" data-kind="' + kind(s, 'Divider') + '">' +
        runhead({ kicker: 'Chapter ' + (s.no || (idx < 9 ? '0' : '') + (idx + 1)) }, P, ctx, true) +
        '<div class="rs-dvmid"><h1 class="rs-dvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
        (s.lead ? '<p class="rs-dvlead"' + de(P + '.lead') + '>' + mb(s.lead) + '</p>' : '') + '</div>' +
        '<div class="rs-dvind">' + cubes + '</div></section>';
    },
    /* 본문 표준 — 대형 번호 규칙선 행(01 액센트 200 + 굵은 소제목 + 흐린 설명) + 마무리. 원본 11 */
    section: function (s, P, ctx) {
      var body = '';
      if (s.points && s.points.length) body = '<div class="rs-list">' + s.points.map(function (p, i) { return numRow(p, P + '.points.' + i, i); }).join('') + '</div>';
      else if (s.text) body = '<p class="rs-body"' + de(P + '.text') + '>' + mb(s.text) + '</p>';
      return '<section class="slide rs sc" data-kind="' + kind(s, 'Section') + '">' + runhead(s, P, ctx) + headline(s, P) + body + note(s, P) + '</section>';
    },
    /* N열 카드 — 흰 라운드 카드(번호 액센트) + 옵션 다크 패널(라벨+칩+마무리). 원본 05 */
    cards: function (s, P, ctx) {
      var cells = (s.cards || []).map(function (it, i) {
        var IP = P + '.cards.' + i, dk = it.tone === 'dark';
        return '<div class="rs-card cd' + (dk ? ' dk' : '') + '">' +
          '<span class="rs-tag' + (dk ? '' : ' acc') + '"' + de(IP + '.tag') + '>' + esc(it.tag || (i < 9 ? '0' : '') + (i + 1)) + '</span>' +
          '<div class="rs-cdbody"><span class="rs-cdhead"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<span class="rs-cdtext"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div></div>';
      }).join('');
      var n = ((s.cards || []).length || 3);
      return '<section class="slide rs cd" data-kind="' + kind(s, 'Cards') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-grid c' + Math.min(n, 4) + '">' + cells + '</div>' + note(s, P) + '</section>';
    },
    /* 좌우 반반 대비 — 라이트/다크 하프 (활용 vs 설계). 원본 08 */
    split: function (s, P, ctx) {
      function half(h, HP, dark) {
        h = h || {};
        var rows = (h.items || []).map(function (t, i) { return '<span class="rs-srow"' + de(HP + '.items.' + i) + '>' + mb(t) + '</span>'; }).join('');
        return '<div class="rs-half' + (dark ? ' dk' : '') + '">' +
          (dark ? '<div class="rs-run dk sp"><span class="rs-runl acc"' + de(HP + '.kicker') + '>' + esc(h.kicker || '') + '</span><span class="rs-runr"><b>' + ((ctx.no < 10 ? '0' : '') + ctx.no) + '</b>/' + ctx.total + '</span></div>'
                : '<span class="rs-runl"' + de(HP + '.kicker') + '>' + esc(h.kicker || '') + '</span>') +
          '<h2 class="rs-hhl"' + de(HP + '.title') + '>' + mb(h.title || '') + '</h2>' +
          '<div class="rs-srows">' + rows + '</div>' +
          (h.foot ? '<span class="rs-hfoot' + (dark ? ' acc' : '') + '"' + de(HP + '.foot') + '>' + esc(h.foot) + '</span>' : '') + '</div>';
      }
      return '<section class="slide rs sp" data-kind="' + kind(s, 'Split') + '">' + half(s.left, P + '.left', false) + half(s.right, P + '.right', true) + '</section>';
    },
    /* 수치 — 좌 다크 도넛 카드 + 우 게이지 카드 행(강조 행=다크). 원본 21 */
    stats: function (s, P, ctx) {
      var l = '';
      if (s.donut) {
        var pct = Math.max(0, Math.min(100, +s.donut.pct || 0));
        l = '<div class="rs-card dn dk"><div class="rs-donut" style="--gp:' + pct + '%;--gcol:#FF4D00;--gtrack:#2C2C2E;background:conic-gradient(' + ACC + ' 0 ' + pct + '%,#2C2C2E ' + pct + '% 100%)"><span class="rs-hole">' +
          (s.donut.caption ? '<i' + de(P + '.donut.caption') + '>' + esc(s.donut.caption) + '</i>' : '') +
          '<b' + de(P + '.donut.value') + '>' + esc(s.donut.value || (pct + '%')) + '</b>' +
          (s.donut.label ? '<em' + de(P + '.donut.label') + '>' + esc(s.donut.label) + '</em>' : '') + '</span></div></div>';
      }
      var bars = (s.bars || []).map(function (b, i) {
        var IP = P + '.bars.' + i, pct = Math.max(0, Math.min(100, +b.pct || 0)), on = b.on;
        return '<div class="rs-card bar' + (on ? ' dk' : '') + '"><div class="rs-bmeta"><span class="rs-bhead"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span>' +
          '<span class="rs-bval"' + de(IP + '.value') + '>' + esc(b.value != null ? b.value : pct + '%') + '</span></div>' +
          '<span class="rs-gauge"><i style="width:' + pct + '%;animation-delay:' + (0.15 + i * 0.12).toFixed(2) + 's"></i></span>' +
          (b.text ? '<span class="rs-btext"' + (on ? ' style="color:' + ACC + '"' : '') + de(IP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide rs stt" data-kind="' + kind(s, 'Stats') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-sttcols' + (l ? '' : ' nod') + '">' + l + '<div class="rs-bars">' + bars + '</div></div>' + note(s, P) + '</section>';
    },
    /* 이미지 증빙(Proof) — 좌 스펙 행(라벨+텍스트, 중간 다크 하이라이트) + 우 이미지 슬롯. 원본 18 */
    media: function (s, P, ctx) {
      var rows = (s.specs || []).map(function (r, i) {
        var IP = P + '.specs.' + i;
        if (r.on) {
          var lines = String(r.text || '').split('\n').map(function (t, j) { return '<span' + (j === 0 ? de(IP + '.text') : '') + '>' + mb(t) + '</span>'; }).join('');
          return '<div class="rs-spec on"><i class="acc"' + de(IP + '.label') + '>' + esc(r.label || '') + '</i>' + lines + '</div>';
        }
        return '<div class="rs-spec"><i' + de(IP + '.label') + '>' + esc(r.label || '') + '</i><span' + de(IP + '.text') + '>' + mb(r.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide rs md" data-kind="' + kind(s, 'Media') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-mdcols"><div class="rs-specs">' + rows + '</div>' +
        '<div class="rs-mdimg"><div class="rs-imgwrap">' + imgPh(s.image && s.image.label, P) +
        '<img class="rs-mdphoto" loading="lazy" alt="" src="https://midas-drs.pages.dev/app/bg/gennx-1.jpg" onerror="this.remove()"></div>' +
        (s.caption ? '<span class="rs-cap"' + de(P + '.caption') + '>' + esc(s.caption) + '</span>' : '') + '</div></div></section>';
    },
    /* 로드맵 — 상단 월별 진행 바 + Now/Next/Then 카드. 원본 23 */
    roadmap: function (s, P, ctx) {
      var months = (s.months || []).map(function (m, i) {
        var IP = P + '.months.' + i;
        return '<div class="rs-mcol"><span class="rs-mlab"' + de(IP + '.when') + '>' + esc(m.when || '') + '</span>' +
          '<span class="rs-mbar' + (i === 0 ? ' on' : i === 1 ? ' half' : '') + '"></span>' +
          '<span class="rs-mtx"' + de(IP + '.text') + '>' + esc(m.text || '') + '</span></div>';
      }).join('');
      var cards = (s.steps || []).map(function (st, i) {
        var IP = P + '.steps.' + i, cls = st.state === 'now' || (!st.state && i === 0) ? ' dk' : st.state === 'later' ? ' dim' : '';
        var items = (st.items || []).map(function (t, j) { return '<span' + de(IP + '.items.' + j) + '>' + mb(t) + '</span>'; }).join('');
        return '<div class="rs-card rm' + cls + '"><span class="rs-tag' + (cls === ' dk' ? ' acc' : '') + '"' + de(IP + '.when') + '>' + esc(st.when || '') + '</span>' +
          '<span class="rs-rmhead"' + de(IP + '.head') + '>' + esc(st.head || '') + '</span>' +
          '<div class="rs-rmitems">' + items + '</div></div>';
      }).join('');
      return '<section class="slide rs rm" data-kind="' + kind(s, 'Roadmap') + '">' + runhead(s, P, ctx) + headline(s, P) +
        (months ? '<div class="rs-months">' + months + '</div>' : '') +
        '<div class="rs-grid c' + Math.min((s.steps || []).length || 3, 4) + '">' + cards + '</div>' + note(s, P) + '</section>';
    },
    /* 단독 대형 수치 — 좌 설명 / 우 초대형 숫자(액센트) */
    bigstat: function (s, P, ctx) {
      return '<section class="slide rs bs" data-kind="' + kind(s, 'BigStat') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-bsbody"><p class="rs-bscap"' + de(P + '.caption') + '>' + mb(s.caption || '') + '</p>' +
        '<p class="rs-bsnum"' + de(P + '.value') + '>' + esc(s.value || '') + '</p></div>' + note(s, P) + '</section>';
    },
    /* 수치 그리드 — 흰 카드 N열(값 200 대형 + 라벨) */
    kpi: function (s, P, ctx) {
      var cells = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, on = it.tone === 'on';
        return '<div class="rs-card kp' + (on ? ' dk' : '') + '"><span class="rs-kpval' + (on ? ' acc' : '') + '"' + de(IP + '.value') + '>' + esc(it.value || '') + '</span>' +
          '<div class="rs-cdbody"><span class="rs-cdhead"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          (it.desc ? '<span class="rs-cdtext"' + de(IP + '.desc') + '>' + mb(it.desc) + '</span>' : '') + '</div></div>';
      }).join('');
      return '<section class="slide rs kp" data-kind="' + kind(s, 'KPI') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-grid c' + Math.min((s.items || []).length || 3, 4) + '">' + cells + '</div>' + note(s, P) + '</section>';
    },
    /* 표 — 흰 카드 안 행 */
    table: function (s, P, ctx) {
      var head = '<div class="rs-tbrow hd" style="--tbc:' + ((s.columns || []).length || 3) + '">' + (s.columns || []).map(function (c, i) { return '<span' + de(P + '.columns.' + i) + '>' + esc(c) + '</span>'; }).join('') + '</div>';
      var rows = (s.rows || []).map(function (r, ri) {
        return '<div class="rs-tbrow" style="--tbc:' + ((s.columns || []).length || 3) + '">' + (r.cells || []).map(function (c, ci) { return '<span' + de(P + '.rows.' + ri + '.cells.' + ci) + '>' + mb(c) + '</span>'; }).join('') + '</div>';
      }).join('');
      return '<section class="slide rs tb" data-kind="' + kind(s, 'Table') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-card tbl">' + head + rows + '</div>' + note(s, P) + '</section>';
    },
    /* 타임라인 — 월별 진행 바(로드맵 상단 패턴 확장) */
    /* 마일스톤(간트) — 단계 카드 2~3 + 월축 계단 바(짙은→옅은 톤). 전 팩 공통 계약 */
    milestone: function (s, P, ctx) {
      var N = (s.axis || []).length || 5;
      var phases = (s.phases || []).map(function (p, i) {
        var IP = P + '.phases.' + i;
        return '<div class="ms-phase' + (p.on ? ' on' : '') + '"><span class="ms-ptag"' + de(IP + '.tag') + '>' + esc(p.tag || '') + '</span>' +
          '<span class="ms-phead"' + de(IP + '.head') + '>' + esc(p.head || '') + '</span>' +
          (p.text ? '<span class="ms-ptext"' + de(IP + '.text') + '>' + mb(p.text) + '</span>' : '') + '</div>';
      }).join('');
      var barsArr = s.bars || [];
      var bars = barsArr.map(function (b, i) {
        var IP = P + '.bars.' + i;
        var st = Math.max(1, Math.min(N, +b.start || i + 1)), sp = Math.max(1, Math.min(N - st + 1, +b.span || 2));
        var n = barsArr.length, pct = n > 1 ? Math.round(88 - 68 * i / (n - 1)) : 88;
        return '<div class="ms-bar" style="margin-left:' + ((st - 1) / N * 100).toFixed(2) + '%;width:' + (sp / N * 100).toFixed(2) + '%;background:color-mix(in srgb, #FF4D00 ' + pct + '%, #fff);animation-delay:' + (0.1 + i * 0.12).toFixed(2) + 's">' +
          '<b' + de(IP + '.label') + '>' + esc(b.label || '') + '</b>' +
          (b.sub ? '<span' + de(IP + '.sub') + '>' + esc(b.sub) + '</span>' : '') + '</div>';
      }).join('');
      var gl = '<div class="ms-glines">' + new Array(N + 1).join('<i></i>') + '</div>';
      var ax = '<div class="ms-axis">' + (s.axis || []).map(function (a, i) { return '<span' + de(P + '.axis.' + i) + '>' + esc(a) + '</span>'; }).join('') + '</div>';
      return '<section class="slide rs ms" data-kind="' + kind(s, 'Milestone') + '">' + runhead(s, P, ctx) + headline(s, P) +
        (phases ? '<div class="ms-phases">' + phases + '</div>' : '') +
        (s.caption ? '<span class="ms-cap"' + de(P + '.caption') + '>' + esc(s.caption) + '</span>' : '') +
        '<div class="ms-chart">' + gl + bars + '</div>' + ax +
        (s.note ? '<p class="ms-note"' + de(P + '.note') + '>' + mb(s.note) + '</p>' : '') + '</section>';
    },
    timeline: function (s, P, ctx) {
      var cols = (s.items || []).map(function (m, i) {
        var IP = P + '.items.' + i;
        return '<div class="rs-mcol tl"><span class="rs-mlab' + (m.on ? ' acc' : '') + '"' + de(IP + '.when') + '>' + esc(m.when || '') + '</span>' +
          '<span class="rs-mbar' + (m.on ? ' on' : '') + '"></span>' +
          '<span class="rs-mhead"' + de(IP + '.head') + '>' + esc(m.head || '') + '</span>' +
          (m.text ? '<span class="rs-mtx"' + de(IP + '.text') + '>' + mb(m.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide rs tl" data-kind="' + kind(s, 'Timeline') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-months tall">' + cols + '</div>' + note(s, P) + '</section>';
    },
    /* 프로세스 — 단계 카드, 중앙(또는 accent 인덱스) 액센트 풀 카드. 원본 14 */
    process: function (s, P, ctx) {
      var n = (s.steps || []).length || 3, accI = s.accent != null ? +s.accent : Math.floor(n / 2);
      var cells = (s.steps || []).map(function (st, i) {
        var IP = P + '.steps.' + i, on = i === accI;
        return '<div class="rs-card pc' + (on ? ' ac' : '') + '"><span class="rs-tag' + (on ? '' : ' mut') + '"' + de(IP + '.tag') + '>' + esc(st.tag || (i + 1) + ' · 단계') + '</span>' +
          '<div class="rs-cdbody"><span class="rs-pchead"' + de(IP + '.head') + '>' + mb(st.head || '') + '</span>' +
          (st.text ? '<span class="rs-cdtext' + (on ? ' wh' : '') + '"' + de(IP + '.text') + '>' + mb(st.text) + '</span>' : '') + '</div></div>';
      }).join('');
      return '<section class="slide rs pc" data-kind="' + kind(s, 'Process') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-grid c' + Math.min(n, 4) + '">' + cells + '</div>' + note(s, P) + '</section>';
    },
    /* 비교 — Before(옅음)/After(다크) + 옵션 이미지 슬롯 3열. 원본 19 */
    compare: function (s, P, ctx) {
      function pane(p, PP, cls) {
        p = p || {};
        var rows = (p.items || []).map(function (t, i) { return '<span' + de(PP + '.items.' + i) + '>' + mb(t) + '</span>'; }).join('');
        return '<div class="rs-card cmp ' + cls + '"><span class="rs-tag' + (cls === 'af' ? ' acc' : ' soft') + '"' + de(PP + '.head') + '>' + esc(p.head || '') + '</span>' +
          '<div class="rs-cmrows">' + rows + '</div></div>';
      }
      var img = s.image ? '<div class="rs-card cmp im">' + imgPh(s.image.label, P) + (s.caption ? '<span class="rs-cap"' + de(P + '.caption') + '>' + esc(s.caption) + '</span>' : '') + '</div>' : '';
      var items = (s.items || []);
      return '<section class="slide rs cm" data-kind="' + kind(s, 'Compare') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-grid c' + (img ? 3 : 2) + '">' + pane(items[0], P + '.items.0', 'bf') + pane(items[1], P + '.items.1', 'af') + img + '</div>' + note(s, P) + '</section>';
    },
    /* 인용 — 대형 문장 하나 */
    quote: function (s, P, ctx) {
      return '<section class="slide rs qt" data-kind="' + kind(s, 'Quote') + '">' + runhead(s, P, ctx) +
        '<div class="rs-qtbody"><span class="rs-qbar"></span><p class="rs-qtx"' + de(P + '.text') + '>' + mb(s.text || '') + '</p>' +
        (s.by ? '<span class="rs-qby"' + de(P + '.by') + '>' + esc(s.by) + '</span>' : '') + '</div></section>';
    },
    /* 포지셔닝 — 프로세스와 동일 골격(3카드 중앙 액센트) */
    position: function (s, P, ctx) {
      return R.process({ type: 'process', title: s.title, kicker: s.kicker, tag: s.tag, note: s.note, accent: s.accent != null ? s.accent : 1, kindLabel: s.kindLabel || 'Position', steps: (s.panels || []).map(function (p) { return { tag: p.tag, head: p.head, text: p.text }; }) }, P.replace(/\.panels\./, '.steps.'), ctx).replace(/data-edit="([^"]*)\.steps\./g, 'data-edit="$1.panels.');
    },
    /* 체크리스트 — 흰 카드 행 + 액센트 체크 원. 양 많으면 2열 */
    checklist: function (s, P, ctx) {
      var items = s.items || [], two = s.cols === 2 || (s.cols == null && items.length > 4);
      var lis = items.map(function (t, i) {
        return '<div class="rs-card ck"><span class="rs-ckic"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M4 12.5 10 18 20 6.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg></span>' +
          '<span class="rs-cktx"' + de(P + '.items.' + i) + '>' + mb(t) + '</span></div>';
      }).join('');
      return '<section class="slide rs ck" data-kind="' + kind(s, 'Checklist') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-cklist' + (two ? ' two' : '') + '">' + lis + '</div>' + note(s, P) + '</section>';
    },
    /* 라인업 — 2×2 카드(첫 카드 다크+액센트 뱃지, 상태 뱃지 pill). 원본 13 */
    lineup: function (s, P, ctx) {
      var cells = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, dim = it.state === 'dim';
        var cls = i === 0 ? ' dk' : dim ? ' dim' : '';
        return '<div class="rs-card ln' + cls + '"><div class="rs-lntop"><span class="rs-lnkick"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          (it.badge ? '<span class="rs-badge' + (i === 0 ? ' acc' : dim ? '' : ' soft') + '"' + de(IP + '.badge') + '>' + esc(it.badge) + '</span>' : '') + '</div>' +
          '<div class="rs-cdbody"><span class="rs-lnhead"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<span class="rs-cdtext"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div></div>';
      }).join('');
      return '<section class="slide rs ln" data-kind="' + kind(s, 'Lineup') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-grid two">' + cells + '</div>' + note(s, P) + '</section>';
    },
    /* 분기/조직 — 좌 다크 리드 카드 + 우 카드 행(이름·역할·설명). 원본 10 */
    branch: function (s, P, ctx) {
      var lead = s.lead ? '<div class="rs-card brl dk"><span class="rs-tag acc"' + de(P + '.lead.label') + '>' + esc(s.lead.label || '') + '</span>' +
        '<p class="rs-brltx"' + de(P + '.lead.text') + '>' + mb(s.lead.text || '') + '</p>' +
        (s.lead.foot ? '<span class="rs-brfoot"' + de(P + '.lead.foot') + '>' + mb(s.lead.foot) + '</span>' : '') + '</div>' : '';
      var rows = (s.branches || []).map(function (b, i) {
        var IP = P + '.branches.' + i;
        return '<div class="rs-card brr"><span class="rs-brname"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span>' +
          '<span class="rs-brhead"' + de(IP + '.head') + '>' + esc(b.head || '') + '</span>' +
          '<span class="rs-brtext"' + de(IP + '.text') + '>' + mb(b.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide rs br" data-kind="' + kind(s, 'Branch') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-brcols">' + lead + '<div class="rs-brrows">' + rows + '</div></div>' + note(s, P) + '</section>';
    },
    /* 하이라이트/데모 — 액센트 풀블리드 + 재생 행 리스트. 원본 20 */
    highlight: function (s, P, ctx) {
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="rs-hlrow"><span class="rs-hlno"' + de(IP + '.no') + '>' + esc(it.no || ('0' + (i + 1))) + '</span>' +
          '<div class="rs-hltx"><span class="rs-hlhead"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<span class="rs-hlsub"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>' + playIcon() + '</div>';
      }).join('');
      return '<section class="slide rs hl ac" data-kind="' + kind(s, 'Highlight') + '">' + runhead(s, P, ctx, true) + headline(s, P) +
        '<div class="rs-hllist">' + rows + '</div>' +
        '<div class="rs-hlfoot">' + (s.note ? '<span' + de(P + '.note') + '>' + mb(s.note) + '</span>' : '<span></span>') +
        (s.footnote ? '<span class="rs-hlfn"' + de(P + '.footnote') + '>' + ml(s.footnote) + '</span>' : '') + '</div></section>';
    },
    /* 현황 보드 — 카드 2 + 다크 사이드(리스트+뱃지 pill). 원본 17 */
    board: function (s, P, ctx) {
      var cards = (s.cards || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cards.' + i;
        return '<div class="rs-card bd"><span class="rs-tag acc"' + de(IP + '.tag') + '>' + esc(c.tag || '') + '</span>' +
          '<div class="rs-cdbody"><span class="rs-bdhead"' + de(IP + '.head') + '>' + esc(c.head || '') + '</span>' +
          (c.text ? '<span class="rs-cdtext"' + de(IP + '.text') + '>' + mb(c.text) + '</span>' : '') + '</div></div>';
      }).join('');
      var side = '';
      if (s.side) {
        var items = (s.side.items || []).map(function (t, i) { return '<span' + de(P + '.side.items.' + i) + '>' + mb(t) + '</span>'; }).join('');
        var pills = (s.side.pills || []).map(function (t, i) { return '<span class="rs-chip"' + de(P + '.side.pills.' + i) + '>' + esc(t) + '</span>'; }).join('');
        side = '<div class="rs-card bds dk"><span class="rs-tag mut"' + de(P + '.side.title') + '>' + esc(s.side.title || '') + '</span>' +
          '<div class="rs-bdrows">' + items + '</div>' + (pills ? '<div class="rs-chips">' + pills + '</div>' : '') + '</div>';
      }
      return '<section class="slide rs bd" data-kind="' + kind(s, 'Board') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="rs-grid c2' + (side ? ' hasp' : '') + '">' + cards + side + '</div>' + note(s, P) + '</section>';
    },
    /* 클로징 — 다크, 타이틀(마지막 줄 강조)+본문+큐브 군집+Next. 원본 24 */
    closing: function (s, P, ctx) {
      var metas = (s.contacts || []).map(function (m, i) {
        var IP = P + '.contacts.' + i;
        return '<span' + de(IP + '.v') + '>' + esc((m.k ? m.k + ' · ' : '') + (m.v || m.k || '')) + '</span>';
      }).join('');
      return '<section class="slide rs cl dk" data-kind="' + kind(s, 'Closing') + '">' +
        '<div class="rs-cvtop">' + logo(s, P) + '<span class="rs-runr"><b>' + ((ctx.no < 10 ? '0' : '') + ctx.no) + '</b>/' + ctx.total + '</span></div>' +
        '<div class="rs-clmid"><div class="rs-cltx"><h1 class="rs-cltitle"' + de(P + '.title') + '>' + mb(s.title || 'Thank you') + '</h1>' +
        (s.sub ? '<p class="rs-clsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') + '</div>' +
        '<div class="rs-clgfx">' + isoCluster() + '</div></div>' +
        '<div class="rs-clfoot"><span class="rs-eyebrow"' + de(P + '.nextLabel') + '>' + esc(s.nextLabel || 'Next') + '</span>' +
        '<span class="rs-clmeta">' + metas + '</span></div></section>';
    }
  };

  /* ---- 덱 렌더 — 챕터(간지) 파생: 러닝헤드·페이지 번호·큐브 인디케이터 ---- */
  function renderSlides(slides) {
    var chapters = [], divAt = [];
    slides.forEach(function (s, i) { if (s.type === 'divider') { chapters.push({ title: String(s.title || '').replace(/\n/g, ' ').replace(/\*\*/g, ''), at: i + 1 }); divAt.push(i + 1); } });
    function chapterOf(no) { var c = null; for (var i = 0; i < chapters.length; i++) if (chapters[i].at < no) c = chapters[i]; return c; }
    function dividerIndex(no) { return Math.max(0, divAt.indexOf(no)); }
    var total = slides.length;
    return slides.map(function (s, i) {
      var fn = R[s.type] || R.section;
      var html = '';
      try { html = fn(s, 'slides.' + i, { chapters: chapters, chapterOf: chapterOf, dividerIndex: dividerIndex, no: i + 1, total: total }); }
      catch (e) { html = '<section class="slide rs sc" data-kind="Error"><h2 class="rs-hl">' + esc(s.type) + ' 렌더 오류</h2></section>'; }
      return html;
    }).join('\n');
  }

  /* ---- 이동/숨김/굵기 상태 재적용 — 타 팩과 동일 계약(_pos/_hide/_fmt/_z/_ta/_fs/_tw) ---- */
  var MV_SEL = '[data-edit], .s-imgwrap, .rs-cube, .rs-logo, .rs-donut, .rs-gauge, .rs-imgph, .rs-play, .rs-ind, .rs-qbar';
  var UNIT_SEL = '.rs-card,.rs-row,.rs-trow,.rs-srow,.rs-spec,.rs-mcol,.rs-hlrow,.rs-tbrow,.rs-chip,.ms-bar,.ms-phase';
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
      'var f=c.f[rel];if(f==="b")ed[e2].style.fontWeight=600;else if(f==="l")ed[e2].style.fontWeight=300;' +
      'var ta=c.a?c.a[rel]:0;if(ta)ed[e2].style.textAlign=ta==="c"?"center":ta==="r"?"right":"left";' +
      'var fz=c.fs[rel];if(fz)ed[e2].style.fontSize=fz+"px";' +
      'var tw=c.w[rel];if(tw){ed[e2].style.maxWidth="none";ed[e2].style.width=tw+"px";}}' +
      'var cd=s.querySelectorAll(' + JSON.stringify(UNIT_SEL) + ');' +
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
      /* 내용 과다 장 자동 축소 — 넘친 장만 래퍼(.rs-fit)로 감싸 scale(k), 하한 0.6.
         무조건 래핑하면 표지·간지의 space-between 2단 구성이 무너지므로 넘친 장만 개입하고,
         래퍼는 슬라이드의 계산된 flex 구성을 그대로 복제한다. 판정 기준은 실측 clientHeight
         (= --slide-h에서 파생) — 비율이 바뀌어도 하드코딩 없이 따라간다. */
      'window.__fitSlide=function(s){if(!s)return;var cs=getComputedStyle(s);var w=s.querySelector(":scope > .rs-fit");' +
      'if(!w){if(s.scrollHeight<=s.clientHeight+2)return;' +
      'w=document.createElement("div");w.className="rs-fit";' +
      'w.style.cssText="transform-origin:top left;flex:1 1 auto;min-height:0;display:"+cs.display+";flex-direction:"+cs.flexDirection+";gap:"+cs.gap+";align-items:"+cs.alignItems+";justify-content:"+cs.justifyContent+";grid-template-columns:"+cs.gridTemplateColumns+";grid-template-rows:"+cs.gridTemplateRows+";";' +   /* 그리드 장(3.8:1 statement)도 래핑 후 배치 유지 */
      'while(s.firstChild)w.appendChild(s.firstChild);s.appendChild(w);}' +
      'w.style.transform="";w.style.width="";' +
      'var avail=s.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);' +
      'var need=w.scrollHeight;if(need>avail+2){var k=Math.max(0.6,avail/need);var bw=w.clientWidth;w.style.width=(bw/k)+"px";w.style.transform="scale("+k+")";}};' +
      'var fitAll=function(){var ss=document.querySelectorAll(".ppt-stack > .slide, .vscale > .slide");for(var f2=0;f2<ss.length;f2++)window.__fitSlide(ss[f2]);};' +
      'fitAll();window.addEventListener("load",fitAll);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitAll);' +
      '})();';
    return '<scr' + 'ipt>' + js + '</scr' + 'ipt>';
  }

  /* ---- CSS — 실측 ×0.6667. 라운드 카드 + 웜그레이 + 단일 액센트 ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      ':root{--acc:#FF4D00;--ink:#0A0A0A;--paper:#F5F5F3;--card:#FFFFFF;--dcard:#1C1C1E;--body:#4E4E52;--muted:#6E6E73;--label:#8A8A8E;--faint:#A1A1A6;--rule:#DEDCD6;--drule:#2C2C2E;--soft:#EAEAE7;--tint:#FFE9E0;' +
      '--slide-w:1280px;--slide-h:720px}' +
      '*{box-sizing:border-box;margin:0;word-break:keep-all}' +
      'body{background:#101014;font-family:Pretendard,"Pretendard Variable",-apple-system,"Apple SD Gothic Neo",sans-serif;-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:var(--paper);color:var(--ink);overflow:hidden;' +
      'display:flex;flex-direction:column;gap:30px;padding:48px 75px 50px;font-family:Pretendard,"Pretendard Variable",sans-serif}' +
      '.slide.dk{background:#0A0A0A;color:#F5F5F3}.slide.ac{background:var(--acc);color:#fff}' +
      'b{font-weight:600}.mut{color:var(--muted);font-weight:300}' +
      /* 러닝헤드 */
      '.rs-run{display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:500;color:var(--label);flex:none}' +
      '.rs-runl{font-weight:500}.rs-runl.acc{color:var(--acc)}' +
      '.rs-runr{font-weight:400;color:var(--faint)}.rs-runr b{font-weight:500;color:var(--ink)}' +
      '.slide.dk .rs-runr b,.slide.ac .rs-runr b{color:#fff}.slide.ac .rs-run{color:rgba(255,255,255,.72)}.slide.ac .rs-runr{color:rgba(255,255,255,.6)}' +
      /* 헤드라인·마무리 */
      '.rs-hl{font-size:48px;font-weight:300;line-height:1.16;letter-spacing:-.03em;flex:none;white-space:pre-wrap}' +
      '.rs-hl b{font-weight:600}.slide.ac .rs-hl b{color:#fff}' +
      '.rs-note{font-size:24px;font-weight:300;letter-spacing:-.02em;margin-top:auto;flex:none}' +
      '.rs-note b{font-weight:600;color:var(--acc)}.slide.ac .rs-note b,.slide.dk .rs-note b{color:var(--acc)}' +
      '.rs-tag{font-size:17px;font-weight:600;letter-spacing:.01em}.rs-tag.acc{color:var(--acc)}.rs-tag.mut{color:var(--label);font-weight:500}.rs-tag.soft{color:var(--label)}' +
      /* 카드 공통 */
      '.rs-card{background:var(--card);border-radius:19px;padding:21px 27px;display:flex;flex-direction:column;justify-content:flex-start;gap:14px;min-height:0}' +
      /* 이미지 없는 카드의 빈 벽 방지 — 태그는 위, 본문은 세로 중앙(위아래 여백 균등 흡수) */
      '.rs-card>.rs-cdbody{margin:auto 0}' +
      '.rs-card.stc,.rs-card.rm,.rs-card.dn,.rs-card.bar{justify-content:space-between}' +
      '.rs-card.bds .rs-bdrows{margin:auto 0}' +
      '.rs-card.dk{background:var(--ink);color:#F5F5F3}.rs-card.dim{background:var(--soft);color:var(--muted)}' +
      '.rs-cdbody{display:flex;flex-direction:column;gap:10px}' +
      '.rs-cdhead{font-size:25px;font-weight:500;letter-spacing:-.02em}' +
      '.rs-cdtext{font-size:17px;font-weight:300;line-height:1.55;color:var(--muted)}' +
      '.rs-card.dk .rs-cdtext{color:#8A8A8E}.rs-card.dim .rs-cdhead{font-weight:400}' +
      /* 카드 = 콘텐츠 높이(꽉 채우기 금지) — 빈 공간은 카드 안이 아니라 바탕으로. 최소 높이로 우표화 방지 */
      '.rs-grid{flex:0 1 auto;margin:auto 0;min-height:0;display:grid;gap:13px;align-items:stretch}' +
      '.rs-grid>.rs-card{min-height:186px}' +
      '.rs-grid.c2{grid-template-columns:1fr 1fr}.rs-grid.c3{grid-template-columns:repeat(3,1fr)}.rs-grid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.rs-grid.two{grid-template-columns:1fr 1fr;grid-auto-rows:auto}' +
      '.rs-grid.hasp{grid-template-columns:repeat(auto-fit,minmax(0,1fr)) }.rs-grid.c3.hasp{grid-template-columns:1fr 1fr 1fr 347px}.rs-grid.c2.hasp{grid-template-columns:1fr 1fr 347px}' +
      /* 표지 */
      '.slide.cv{padding:53px 75px;justify-content:space-between;gap:0}' +
      '.rs-cvtop{display:flex;justify-content:space-between;align-items:center;flex:none}' +
      '.rs-logo{display:inline-flex;align-items:center;gap:11px}.rs-logo i{width:12px;height:12px;border-radius:50%;background:var(--acc)}' +
      '.rs-logo em{font-style:normal;font-size:17px;font-weight:500}' +
      '.rs-cvdate{font-size:17px;font-weight:400;color:#8A8A8E}' +
      '.rs-cvmid{display:grid;grid-template-columns:1fr 307px;gap:53px;align-items:center;flex:1;min-height:0}' +
      '.rs-cvtx{display:flex;flex-direction:column;gap:27px}' +
      '.rs-eyebrow{font-size:17px;font-weight:600;color:var(--acc);letter-spacing:.04em}' +
      '.rs-cvtitle{font-size:88px;font-weight:300;line-height:1.04;letter-spacing:-.045em;white-space:pre-wrap}' +
      '.rs-cvtitle b{font-weight:600}.rs-cvtitle .mut{color:#6E6E73;font-weight:300}' +
      '.rs-cvgfx{display:flex;align-items:center;justify-content:center}.rs-cvgfx svg{width:100%;height:auto}' +
      '.rs-cvfoot{display:flex;justify-content:space-between;align-items:flex-end;font-size:20px;font-weight:300;color:#8A8A8E;flex:none}' +
      '.rs-cvfoot b{font-weight:500;color:#F5F5F3}' +
      /* 선언 */
      '.rs-stmid{flex:1;display:flex;flex-direction:column;justify-content:center;gap:29px;min-height:0}' +
      '.rs-sttitle{font-size:70px;font-weight:300;line-height:1.06;letter-spacing:-.045em;white-space:pre-wrap}.rs-sttitle b{font-weight:600}' +
      '.rs-stsub{font-size:21px;font-weight:300;line-height:1.65;color:var(--body);max-width:900px;text-wrap:pretty}' +
      '.rs-stcols{display:grid;grid-template-columns:1fr 1fr;gap:21px;flex:none}' +
      '.rs-card.stc{padding:32px 35px;gap:13px;justify-content:flex-start}' +
      '.rs-card.stc .rs-tag{color:var(--label)}.rs-card.stc .rs-tag.acc{color:var(--acc)}' +
      '.rs-sttx{font-size:25px;font-weight:300;letter-spacing:-.02em}.rs-sttx b{font-weight:600}' +
      /* 목차 */
      '.rs-tchead{font-size:51px;font-weight:300;letter-spacing:-.04em;flex:none}' +
      '.rs-tlist{flex:1;min-height:0;display:flex;flex-direction:column;gap:9px}' +
      '.rs-trow{flex:1;background:var(--card);border-radius:16px;padding:0 35px;display:flex;align-items:center;gap:37px;min-height:0}' +
      '.rs-tno{width:43px;flex:none;font-size:20px;font-weight:600;color:var(--faint)}.rs-tno.acc{color:var(--acc)}' +
      '.rs-tlabel{width:220px;flex:none;font-size:19px;font-weight:500;color:var(--label)}' +
      '.rs-tdesc{flex:1;font-size:24px;font-weight:300;letter-spacing:-.02em}.rs-tdesc b{font-weight:600}' +
      '.rs-tpages{font-size:17px;color:var(--faint)}' +
      /* 간지 */
      '.slide.dv{padding:53px 75px;justify-content:space-between;gap:0}' +
      '.rs-dvmid{display:flex;flex-direction:column;gap:27px}' +
      '.rs-dvtitle{font-size:100px;font-weight:300;line-height:.98;letter-spacing:-.05em;white-space:pre-wrap}.rs-dvtitle b{font-weight:600}' +
      '.rs-dvlead{font-size:27px;font-weight:300;letter-spacing:-.02em}' +
      '.slide.ac .rs-dvlead{color:rgba(255,255,255,.88)}.slide.ac .rs-dvlead b{color:#fff}' +
      '.slide.dv.dk .rs-dvlead{color:#8A8A8E}.slide.dv.dk .rs-dvlead b{color:#F5F5F3;font-weight:600}' +
      '.rs-dvind{display:flex;gap:6px;align-items:center;flex:none}.rs-ind{width:15px;height:16px;color:currentColor;opacity:.9}' +
      '.slide.ac .rs-ind line{stroke:#fff}.slide.ac .rs-ind:first-child line,{}' +
      /* 본문 넘버 행 */
      '.rs-list{flex:1;min-height:0;display:flex;flex-direction:column}' +
      '.rs-row{flex:1;display:flex;align-items:center;gap:37px;border-top:1px solid var(--rule);min-height:0}' +
      '.rs-row:last-child{border-bottom:1px solid var(--rule)}' +
      '.rs-no{width:80px;flex:none;font-size:43px;font-weight:300;line-height:1;letter-spacing:-.04em;color:var(--acc)}' +
      '.rs-rhead{width:280px;flex:none;font-size:28px;font-weight:500;letter-spacing:-.025em}' +
      '.rs-rtext{flex:1;font-size:20px;font-weight:300;color:var(--muted)}' +
      '.rs-body{flex:1;font-size:23px;font-weight:300;line-height:1.75;color:var(--body);max-width:900px}' +
      /* 카드 패널(칩) */
      '.rs-chips{display:flex;flex-wrap:wrap;gap:9px}' +
      '.rs-chip{padding:11px 21px;border-radius:999px;background:var(--dcard);color:#F5F5F3;font-size:21px;font-weight:400}' +
      '.rs-chip.acc{background:var(--acc);color:#fff;font-weight:500}' +
      /* 좌우 반반 */
      '.slide.sp{flex-direction:row;padding:0;gap:0}' +
      '.rs-half{flex:1;padding:53px 59px 53px 75px;display:flex;flex-direction:column;gap:32px;background:var(--paper)}' +
      '.rs-half.dk{background:#0A0A0A;color:#F5F5F3;padding:53px 75px 53px 59px}' +
      '.rs-half>.rs-runl{font-size:17px;font-weight:500;color:var(--label);flex:none}' +
      '.rs-run.sp{margin:0}' +
      '.rs-hhl{font-size:43px;font-weight:300;line-height:1.14;letter-spacing:-.04em;white-space:pre-wrap}.rs-hhl b{font-weight:600}' +
      '.rs-srows{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}' +
      '.rs-srow{padding:17px 0;border-top:1px solid var(--rule);font-size:23px;font-weight:300;color:var(--body)}' +
      '.rs-srow:last-child{border-bottom:1px solid var(--rule)}' +
      '.rs-half.dk .rs-srow{border-color:var(--drule);color:#F5F5F3;font-weight:500}' +
      '.rs-half.dk .rs-runr b{color:#F5F5F3}' +
      '.rs-hfoot{font-size:17px;font-weight:400;color:var(--label);flex:none}.rs-hfoot.acc{color:var(--acc);font-weight:500}' +
      /* 수치 */
      '.rs-sttcols{flex:1;min-height:0;display:grid;grid-template-columns:307px 1fr;gap:13px}.rs-sttcols.nod{grid-template-columns:1fr}' +
      '.rs-card.dn{align-items:center;justify-content:center}' +
      '@property --gp{syntax:"<percentage>";inherits:false;initial-value:0%}' +
      '.rs-donut{width:220px;height:220px;border-radius:50%;display:grid;place-items:center;' +
      'background:conic-gradient(var(--acc) 0 var(--gp),#2C2C2E var(--gp) 100%)!important;animation:rsdf 1.1s .1s cubic-bezier(.3,.6,.3,1) both}' +
      '@keyframes rsdf{from{--gp:0%}}' +
      '.rs-hole{width:164px;height:164px;border-radius:50%;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center}' +
      '.rs-hole i{font-style:normal;font-size:12px;color:#8A8A8E}.rs-hole b{font-size:43px;font-weight:300;letter-spacing:-.03em}.rs-hole b:after{content:""}.rs-hole em{font-style:normal;font-size:13px;color:#8A8A8E}' +
      '.rs-bars{display:flex;flex-direction:column;gap:9px;min-height:0}' +
      '.rs-card.bar{flex:1;padding:19px 33px;justify-content:center;gap:9px}' +
      '.rs-bmeta{display:flex;justify-content:space-between;align-items:baseline}' +
      '.rs-bhead{font-size:22px;font-weight:500;letter-spacing:-.02em}' +
      '.rs-bval{font-size:25px;font-weight:600;color:var(--acc)}' +
      '.rs-gauge{display:block;height:4px;border-radius:999px;background:var(--soft)}' +
      '.rs-card.bar.dk .rs-gauge{background:#2C2C2E}' +
      '.rs-gauge i{display:block;height:100%;border-radius:999px;background:var(--acc);animation:rsgf .9s cubic-bezier(.2,.7,.3,1) both}' +
      '@keyframes rsgf{from{width:0}}' +
      '.rs-btext{font-size:15px;font-weight:300;color:var(--label)}' +
      /* 이미지 증빙 */
      '.rs-mdcols{flex:1;min-height:0;display:grid;grid-template-columns:420px 1fr;gap:27px}' +
      '.rs-specs{display:flex;flex-direction:column;justify-content:center;min-height:0}' +
      '.rs-spec{display:flex;gap:19px;align-items:baseline;padding:15px 0;border-top:1px solid var(--rule)}' +
      '.rs-spec:last-child{border-bottom:1px solid var(--rule)}' +
      '.rs-spec i{font-style:normal;width:90px;flex:none;font-size:15px;font-weight:500;color:var(--label)}' +
      '.rs-spec span{font-size:19px;font-weight:400}' +
      '.rs-spec.on{background:var(--ink);color:#F5F5F3;border-radius:16px;border:0;padding:19px 25px;margin:8px 0;flex-direction:column;gap:7px;align-items:flex-start}' +
      '.rs-spec.on i.acc{color:var(--acc);width:auto}' +
      '.rs-spec.on span{font-size:19px;font-weight:500}.rs-spec.on span b{font-weight:600}' +
      '.rs-mdimg{display:flex;flex-direction:column;gap:8px;min-height:0}' +
      '.rs-imgph{flex:1;min-height:0;border:1.5px dashed #C9C7C1;border-radius:19px;background:var(--soft);display:grid;place-items:center}' +
      '.rs-imgwrap{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}' +
      '.rs-mdphoto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:19px}' +
      '.rs-imgph span{font-size:14px;color:var(--faint)}' +
      '.rs-cap{font-size:14px;color:var(--faint);text-align:right}' +
      /* 로드맵·타임라인 */
      '.rs-months{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:19px;flex:none}' +
      '.rs-months.tall{flex:1;align-content:center}' +
      '.rs-mcol{display:flex;flex-direction:column;gap:9px}' +
      '.rs-mlab{font-size:17px;font-weight:600}.rs-mlab.acc{color:var(--acc)}' +
      '.rs-mbar{display:block;height:3px;border-radius:999px;background:#D8D6D0}' +
      '.rs-mbar.on{background:var(--acc)}.rs-mbar.half{background:linear-gradient(90deg,var(--acc) 55%,#D8D6D0 55%)}' +
      '.rs-mhead{font-size:23px;font-weight:500;margin-top:8px}' +
      '.rs-mtx{font-size:15px;font-weight:300;color:var(--label);line-height:1.5}' +
      '.rs-card.rm{gap:17px;justify-content:flex-start}' +
      '.rs-rmhead{font-size:29px;font-weight:500;letter-spacing:-.02em}' +
      '.rs-rmitems{display:flex;flex-direction:column;gap:8px;font-size:17px;font-weight:300;color:var(--muted);margin-top:auto}' +
      '.rs-card.rm.dk .rs-rmitems{color:#A1A1A6}.rs-card.rm.dim .rs-rmhead{color:var(--muted)}' +
      /* 대형 수치 */
      '.rs-bsbody{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:40px}' +
      '.rs-bscap{font-size:25px;font-weight:300;line-height:1.6;color:var(--body)}.rs-bscap b{font-weight:600}' +
      '.rs-bsnum{font-size:120px;font-weight:300;letter-spacing:-.05em;color:var(--acc);text-align:right;font-variant-numeric:tabular-nums}' +
      '.rs-kpval{font-size:47px;font-weight:300;letter-spacing:-.04em}.rs-kpval.acc{color:var(--acc)}' +
      /* 표 */
      '.rs-card.tbl{flex:0 1 auto;min-height:0;margin:auto 0;padding:9px 35px;justify-content:flex-start}' +
      '.rs-tbrow{flex:0 1 auto;min-height:0;display:grid;grid-template-columns:repeat(var(--tbc),1fr);gap:19px;align-items:center;padding:23px 0;border-top:1px solid var(--rule);font-size:18px;font-weight:400}' +
      '.rs-tbrow.hd{flex:0 0 auto;padding:12px 0 10px}' +
      '.rs-tbrow:first-child{border-top:0}' +
      '.rs-tbrow.hd{font-size:14px;font-weight:600;color:var(--label);letter-spacing:.04em}' +
      /* 프로세스 */
      '.rs-card.pc.ac{background:var(--acc);color:#fff}' +
      '.rs-card.pc.ac .rs-tag{color:#fff}' +
      '.rs-pchead{font-size:31px;font-weight:300;letter-spacing:-.02em}.rs-pchead b{font-weight:600}' +
      '.rs-cdtext.wh{color:rgba(255,255,255,.85)}' +
      /* 비교 */
      '.rs-card.cmp.bf{background:var(--soft)}' +
      '.rs-card.cmp.af{background:var(--ink);color:#F5F5F3}' +
      '.rs-cmrows{display:flex;flex-direction:column;gap:13px;font-size:18px;font-weight:300;color:var(--muted);margin-top:6px}' +
      '.rs-card.cmp.af .rs-cmrows{color:#F5F5F3;font-weight:400}' +
      '.rs-card.cmp.im{padding:9px;background:transparent;border:0}' +
      /* 인용 */
      '.rs-qtbody{flex:1;display:flex;flex-direction:column;justify-content:center;gap:21px;max-width:880px}' +
      '.rs-qbar{width:56px;height:4px;border-radius:999px;background:var(--acc)}' +
      '.rs-qtx{font-size:37px;font-weight:300;line-height:1.5;letter-spacing:-.02em}.rs-qtx b{font-weight:600}' +
      '.rs-qby{font-size:17px;color:var(--label)}' +
      /* 체크리스트 */
      '.rs-cklist{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;gap:9px}' +
      '.rs-cklist.two{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:auto}' +
      '.rs-card.ck{flex:0 0 auto;flex-direction:row;align-items:center;gap:17px;padding:23px 27px;justify-content:flex-start}' +
      '.rs-ckic{width:27px;height:27px;flex:none;border-radius:999px;background:var(--acc);display:grid;place-items:center}' +
      '.rs-cktx{font-size:23px;font-weight:400}' +
      /* 라인업 */
      '.rs-lntop{display:flex;justify-content:space-between;align-items:center;gap:10px}' +
      '.rs-lnkick{font-size:15px;font-weight:500;color:var(--label)}' +
      '.rs-badge{padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:600;background:var(--soft);color:var(--faint)}' +
      '.rs-badge.acc{background:var(--acc);color:#fff}.rs-badge.soft{background:var(--tint);color:var(--acc)}' +
      '.rs-lnhead{font-size:29px;font-weight:600;letter-spacing:-.02em}' +
      '.rs-card.ln.dim .rs-lnhead{font-weight:400;color:var(--muted)}' +
      /* 분기 */
      '.rs-brcols{flex:1;min-height:0;display:grid;grid-template-columns:347px 1fr;gap:13px}' +
      '.rs-card.brl{justify-content:space-between}' +
      '.rs-brltx{font-size:27px;font-weight:300;line-height:1.5}.rs-brltx b{font-weight:600}' +
      '.rs-brfoot{font-size:16px;font-weight:300;color:#8A8A8E;line-height:1.6}.rs-brfoot b{font-weight:500;color:#F5F5F3}' +
      '.rs-brrows{display:flex;flex-direction:column;gap:9px;min-height:0}' +
      '.rs-card.brr{flex:1;flex-direction:row;align-items:center;gap:27px;padding:15px 33px}' +
      '.rs-brname{width:150px;flex:none;font-size:22px;font-weight:600}' +
      '.rs-brhead{width:250px;flex:none;font-size:20px;font-weight:500}' +
      '.rs-brtext{flex:1;font-size:16px;font-weight:300;color:var(--label)}' +
      /* 하이라이트/데모 */
      '.slide.hl .rs-hl{color:#fff;font-size:43px}' +
      '.rs-hllist{flex:1;min-height:0;display:flex;flex-direction:column;gap:13px;justify-content:center}' +
      '.rs-hlrow{background:rgba(255,255,255,.14);border-radius:19px;padding:19px 33px;display:flex;align-items:center;gap:27px}' +
      '.rs-hlno{font-size:20px;font-weight:600;color:#fff;width:37px;flex:none}' +
      '.rs-hltx{flex:1;display:flex;flex-direction:column;gap:4px}' +
      '.rs-hlhead{font-size:27px;font-weight:600;color:#fff}' +
      '.rs-hlsub{font-size:17px;font-weight:300;color:rgba(255,255,255,.85)}' +
      '.rs-play{width:40px;height:40px;flex:none;border-radius:999px;background:#fff;display:grid;place-items:center}' +
      '.rs-hlfoot{display:flex;justify-content:space-between;align-items:flex-end;flex:none;font-size:20px;font-weight:300;color:#fff}' +
      '.rs-hlfoot b{font-weight:600}' +
      '.rs-hlfn{font-size:13px;font-weight:400;color:rgba(255,255,255,.8);text-align:right;white-space:pre-wrap;line-height:1.7}' +
      /* 보드 */
      '.rs-bdhead{font-size:29px;font-weight:600;letter-spacing:-.02em}' +
      '.rs-bdrows{display:flex;flex-direction:column;gap:11px;font-size:17px;font-weight:300;color:#A1A1A6;line-height:1.6}' +
      '.rs-card.bds{justify-content:space-between}' +
      '.rs-card.bds .rs-chip{font-size:14px;padding:9px 17px;background:#1C1C1E}' +
      /* 클로징 */
      '.slide.cl{padding:53px 75px;justify-content:space-between;gap:0}' +
      '.rs-clmid{display:grid;grid-template-columns:1fr 400px;gap:53px;align-items:center;flex:1;min-height:0}' +
      '.rs-cltx{display:flex;flex-direction:column;gap:23px}' +
      '.rs-cltitle{font-size:52px;font-weight:300;line-height:1.28;letter-spacing:-.035em;white-space:pre-wrap}.rs-cltitle b{font-weight:600}' +
      '.rs-clsub{font-size:20px;font-weight:300;line-height:1.7;color:#8A8A8E;max-width:560px}.rs-clsub b{font-weight:500;color:var(--acc)}' +
      '.rs-clgfx svg{width:100%;height:auto}' +
      '.rs-clfoot{display:flex;justify-content:space-between;align-items:flex-end;flex:none}' +
      '.rs-clmeta{display:flex;flex-direction:column;gap:4px;font-size:14px;color:#8A8A8E;text-align:right}' +
      /* 로드맵 라인 그리기·등장 */
            '.ms-phases{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:13px;flex:none}' +
      '.ms-phase{background:var(--card);border-radius:16px;padding:15px 19px;display:flex;flex-direction:column;gap:6px}' +
      '.ms-ptag{align-self:flex-start;font-size:12px;font-weight:700;padding:4px 10px;background:var(--tint);color:var(--acc);border-radius:2px}' +
      '.ms-phase.on .ms-ptag{background:var(--ink);color:#fff}' +
      '.ms-phead{font-size:19px;font-weight:700;letter-spacing:-.02em}' +
      '.ms-ptext{font-size:13px;font-weight:400;color:var(--muted);line-height:1.5}.ms-ptext b{color:var(--acc);font-weight:700}' +
      '.ms-cap{font-size:13px;font-weight:700;color:var(--acc);letter-spacing:.06em;flex:none}' +
      '.slide.rs.ms{gap:19px}' +
      '.ms-chart{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:space-evenly;padding:4px 0 12px;overflow:hidden}' +
      '.ms-glines{position:absolute;inset:0;display:grid;grid-auto-flow:column;grid-auto-columns:1fr}' +
      '.ms-glines i{border-left:1px solid var(--rule)}' +
      '.ms-bar{position:relative;z-index:1;border-radius:8px;padding:9px 16px;display:flex;flex-direction:column;gap:2px;animation:vfu .5s both}' +
      '.ms-bar b{font-size:15.5px;font-weight:700;letter-spacing:-.01em}' +
      '.ms-bar span{font-size:13px;opacity:.62}' +
      '.ms-axis{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;flex:none;border-top:1px solid var(--rule);padding-top:8px}' +
      '.ms-axis span{font-size:13px;color:var(--muted);text-align:center}' +
      '.ms-note{flex:none;font-size:17px;font-weight:400;border-left:3px solid var(--acc);padding:9px 0 9px 16px}.ms-note b{font-weight:700;color:var(--acc)}' +
      '@keyframes vfu{from{opacity:0}to{opacity:1}}' +
      ratioCss();
  }

  /* ---- 화면 비율 오버라이드 (계약 v1) ----
     액자(--slide-w/--slide-h)만 바꿔도 내부는 전부 절대 px라 그대로 남는다 → "깨지는 것만" 스코프 오버라이드.
     4:3   = 폭 동일 · 세로 +240px → 늘어난 세로를 카드 높이·행 간격·여백에 배분(폰트는 폭 제약이 같아 소폭만).
     3.8:1 = 세로 동일 · 가로 +1456px → 본문 폰트는 유지(세로 예산이 그대로라 키우면 넘침), 가로는
             좌우 여백·고정 열 폭·다열화로 쓰고 글줄 길이는 max-width로 끊는다. */
  function ratioCss() {
    return '[data-ratio="r43"]{--slide-w:1280px;--slide-h:960px}[data-ratio="r381"]{--slide-w:2736px;--slide-h:720px}' +

      /* ===== 4:3 — 1280×960 ===== */
      '[data-ratio="r43"] .slide{padding:60px 75px 64px;gap:38px}' +                       /* 상하 98→124px·블록 간격 30→38px: 세로 증가분의 1/4을 여백으로 */
      '[data-ratio="r43"] .slide.cv,[data-ratio="r43"] .slide.dv,[data-ratio="r43"] .slide.cl{padding:68px 75px;gap:0}' +   /* 풀블리드 장은 자체 패딩·gap:0 유지(위 규칙이 덮지 않게 재선언) */
      '[data-ratio="r43"] .slide.sp{padding:0;gap:0}' +                                    /* 좌우 반반 장은 하프가 패딩을 갖는다 — 슬라이드 패딩 0 복구 */
      '[data-ratio="r43"] .slide.rs.ms{gap:26px}' +                                        /* 간트 장 전용 간격도 같은 비율로 */
      '[data-ratio="r43"] .rs-hl{font-size:52px}' +                                        /* 헤드라인 48→52: 폭은 그대로라 줄바꿈 위험 낮고 세로 여유는 충분 */
      '[data-ratio="r43"] .rs-grid{gap:18px}' +                                            /* 카드 간격 13→18 */
      '[data-ratio="r43"] .rs-grid>.rs-card{min-height:252px}' +                            /* 세로 흡수의 핵심 — 186 그대로면 카드가 넓적해지고 아래가 빈다 */
      '[data-ratio="r43"] .rs-grid.c4{grid-template-columns:repeat(2,1fr)}' +               /* 4열은 1280 폭에서 열당 265px로 좁다 — 세로 여유를 써 2×2로 */
      '[data-ratio="r43"] .rs-card{padding:25px 29px}' +                                    /* 카드가 커진 만큼 내부 여백도 */
      '[data-ratio="r43"] .rs-card.stc{padding:38px 35px}' +                                /* 선언 카드는 2개뿐이라 세로를 더 받는다 */
      '[data-ratio="r43"] .rs-tlist,[data-ratio="r43"] .rs-brrows,[data-ratio="r43"] .rs-bars,[data-ratio="r43"] .rs-cklist{gap:13px}' +   /* 행 리스트 간격 9→13 */
      '[data-ratio="r43"] .rs-card.ck{padding:31px 27px}' +                                 /* 체크 카드는 flex:0 0 auto 고정 높이 — 패딩으로 세로를 흡수 */
      '[data-ratio="r43"] .rs-srow{padding:24px 0}' +                                       /* split 행도 고정 높이 — 17→24 */
      '[data-ratio="r43"] .rs-half{padding:68px 59px 68px 75px}[data-ratio="r43"] .rs-half.dk{padding:68px 75px 68px 59px}' +   /* 하프 상하 패딩 53→68 */
      '[data-ratio="r43"] .rs-tbrow{padding:30px 0}' +                                      /* 표 행 높이 23→30 */
      '[data-ratio="r43"] .rs-hllist{gap:18px}[data-ratio="r43"] .rs-hlrow{padding:26px 33px}' +   /* 하이라이트 행도 고정 높이 */
      '[data-ratio="r43"] .rs-sttcols{grid-template-columns:360px 1fr}' +                   /* 도넛을 키우려면 좌열도 함께(307→360) */
      '[data-ratio="r43"] .rs-donut{width:262px;height:262px}[data-ratio="r43"] .rs-hole{width:196px;height:196px}' +   /* 카드가 세로로 길어져 220px 원이 작아 보인다 */
      '[data-ratio="r43"] .rs-cvmid{grid-template-columns:1fr 400px}[data-ratio="r43"] .rs-cvtitle{font-size:96px}' +   /* 표지: 큐브 그래픽·타이틀이 세로 대비 작아 보임 */
      '[data-ratio="r43"] .rs-clmid{grid-template-columns:1fr 480px}' +                     /* 클로징 큐브 군집도 동일 이유 */
      '[data-ratio="r43"] .rs-bsnum{font-size:140px}' +                                     /* 대형 수치는 좌우 배치 유지(폭이 같아 상하 스택은 우측이 비어 더 나쁘다) — 세로 여유만큼 체급만 상향 */

      /* ===== 3.8:1 — 2736×720 ===== */
      '[data-ratio="r381"] .slide{padding:48px 160px 50px}' +                               /* 좌우 75px은 2736 폭에서 2.7% — 캔버스 비례로 160px */
      '[data-ratio="r381"] .slide.cv,[data-ratio="r381"] .slide.dv,[data-ratio="r381"] .slide.cl{padding:53px 160px;gap:0}' +
      '[data-ratio="r381"] .slide.sp{padding:0;gap:0}' +
      '[data-ratio="r381"] .rs-grid{gap:24px}' +                                            /* 카드가 2~3배 넓어져 13px 간격은 붙어 보인다 */
      '[data-ratio="r381"] .rs-grid>.rs-card{min-height:280px}' +                            /* 카드 폭이 790px가 되면 186px 높이는 띠처럼 납작하다 — 남는 세로(186px)를 카드에 */
      '[data-ratio="r381"] .rs-grid.two>.rs-card{min-height:186px}' +                        /* 단 2행 그리드(라인업)는 원래 높이 유지 — 2×280은 720 예산을 넘긴다 */
      '[data-ratio="r381"] .rs-card{border-radius:24px;padding:23px 40px}' +                /* 넓은 카드에 맞춘 라운드·좌우 패딩(19px 라운드는 초와이드에서 각져 보인다) */
      '[data-ratio="r381"] .rs-cdtext,[data-ratio="r381"] .rs-cmrows,[data-ratio="r381"] .rs-rmitems,[data-ratio="r381"] .rs-bdrows{max-width:760px}' +   /* 카드 폭이 1000px를 넘으면 한 줄이 읽기 한계를 넘는다 */
      '[data-ratio="r381"] .rs-hl,[data-ratio="r381"] .rs-note{max-width:1800px}' +          /* 헤드라인·마무리 문장 글줄 길이 제한(좌측 정렬 유지) */
      '[data-ratio="r381"] .rs-body{max-width:1200px}[data-ratio="r381"] .rs-stsub{max-width:1300px}' +
      '[data-ratio="r381"] .rs-sttcols{grid-template-columns:420px 1fr}' +
      '[data-ratio="r381"] .rs-bars{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:13px}' +   /* 게이지 행이 2000px면 라벨↔값이 멀어 읽기가 끊긴다 — 2열 */
      '[data-ratio="r381"] .rs-card.bar:last-child:nth-child(odd){grid-column:1/-1}' +       /* 홀수 개(3개)면 마지막 게이지를 전폭으로 — 우하단 빈 칸 제거 */
      '[data-ratio="r381"] .rs-donut{width:280px;height:280px}[data-ratio="r381"] .rs-hole{width:208px;height:208px}' +   /* 도넛은 이 장의 좌측 앵커 — 420px 카드 안에서 220px은 헐렁하다 */
      '[data-ratio="r381"] .rs-mdcols{grid-template-columns:620px 1fr}' +                    /* 이미지가 2000px까지 늘어나면 object-fit:cover 크롭이 심하다 — 스펙 열을 넓혀 완화 */
      '[data-ratio="r381"] .rs-brcols{grid-template-columns:520px 1fr}[data-ratio="r381"] .rs-brname{width:220px}[data-ratio="r381"] .rs-brhead{width:340px}' +
      '[data-ratio="r381"] .rs-grid.c3.hasp{grid-template-columns:1fr 1fr 1fr 560px}[data-ratio="r381"] .rs-grid.c2.hasp{grid-template-columns:1fr 1fr 560px}' +   /* 보드 사이드 패널 347px은 초와이드에서 실오라기 */

      /* --- 초광폭 정돈 ① 리스트를 "긴 띠"에서 "칸"으로 — 2400px 한 줄 행은 번호↔설명이 멀어 읽기가 끊기고 우측이 방치돼 보인다 --- */
      '[data-ratio="r381"] .rs-list{display:grid;grid-template-columns:1fr 1fr;column-gap:110px;grid-auto-rows:1fr}' +   /* 번호 행 2열 — 칸당 1150px로 16:9 행 비례에 근접 */
      '[data-ratio="r381"] .rs-row{gap:32px}[data-ratio="r381"] .rs-row:last-child{border-bottom:0}' +   /* 2열에선 마지막 칸만 밑줄이 생겨 비대칭 — 상단 규칙선만 남긴다 */
      '[data-ratio="r381"] .rs-row:last-child:nth-child(odd){grid-column:1/-1}' +            /* 홀수 개(3개 등)면 마지막 행을 전폭으로 — 우하단이 빈 칸으로 남지 않는다 */
      '[data-ratio="r381"] .rs-no{width:110px;font-size:56px}' +                             /* 대형 번호는 디스플레이 요소 — 각 칸의 좌측 앵커로 키운다 */
      '[data-ratio="r381"] .rs-rhead{width:300px}[data-ratio="r381"] .rs-rtext{max-width:none}' +
      '[data-ratio="r381"] .rs-tlist{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:24px}' +   /* 목차: 전폭 띠 3개 → 세로 카드 N개(장 수만큼 반복) — 초광폭에서 우측 여백이 사라진다 */
      '[data-ratio="r381"] .rs-trow{flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:18px;padding:44px 46px;border-radius:24px}' +
      '[data-ratio="r381"] .rs-tno{width:auto;font-size:32px}[data-ratio="r381"] .rs-tlabel{width:auto}' +
      '[data-ratio="r381"] .rs-tdesc{flex:none;max-width:none}[data-ratio="r381"] .rs-tpages{margin-top:auto}' +   /* 페이지 수는 카드 하단에 고정 — 카드 세로를 끝까지 쓰는 두 번째 앵커 */
      '[data-ratio="r381"] .rs-cklist{display:grid;grid-template-columns:repeat(auto-fit,minmax(560px,1fr));gap:16px}' +   /* 항목 수 적응 — auto-fit이 빈 트랙을 접어 3개면 3열, 4개면 4열(빈 칸 없음) */
      '[data-ratio="r381"] .rs-cklist.two{grid-template-columns:repeat(3,1fr)}' +            /* 5개 이상은 3열 고정(6개=2행 정렬) */
      '[data-ratio="r381"] .rs-card.ck{padding:34px 38px;gap:22px;min-height:150px}[data-ratio="r381"] .rs-ckic{width:34px;height:34px}' +   /* 체크 카드는 고정 높이 — 카드·체크 원을 캔버스 비례로 키워 100px 띠가 넓은 화면에 뜨는 것 방지 */

      /* --- 초광폭 정돈 ② 텍스트 희소 장표는 양극 구성(좌 텍스트 앵커 + 우 시각/수치 앵커) --- */
      '[data-ratio="r381"] .slide.st:has(>.rs-stcols){display:grid;grid-template-columns:1.15fr 1fr;grid-template-rows:auto 1fr;column-gap:130px;row-gap:30px}' +
      '[data-ratio="r381"] .slide.st>.rs-run{grid-column:1/-1}' +
      '[data-ratio="r381"] .slide.st>.rs-stmid{grid-column:1;grid-row:2}' +
      '[data-ratio="r381"] .slide.st>.rs-stcols{grid-column:2;grid-row:2;grid-template-columns:1fr;align-content:center;gap:28px}' +   /* 선언: 대형 타이틀(좌) ↔ 비교 카드 2장 세로 스택(우) — 하단 전폭 띠보다 초광폭에서 균형이 잡힌다 */
      '[data-ratio="r381"] .rs-qtbody{max-width:none}[data-ratio="r381"] .rs-qtx{font-size:88px;max-width:1950px}' +   /* 인용은 디스플레이 타이포 — 46px은 2736 캔버스에서 메모처럼 읽힌다. 글줄만 1950px로 제한 */
      '[data-ratio="r381"] .rs-card.stc{padding:40px 46px;gap:16px}' +                       /* 선언 비교 카드가 우측 기둥이 되려면 두께가 필요(23px 패딩은 띠) */
      '[data-ratio="r381"] .rs-qbar{width:140px;height:6px}' +                               /* 액센트 바도 같은 비례로(기존 자산 확대) */
      '[data-ratio="r381"] .rs-qby{align-self:flex-end;font-size:20px}' +                    /* 출처를 우측 끝으로 — 인용문(좌)과 짝을 이루는 우측 앵커 */
      '[data-ratio="r381"] .rs-bsnum{font-size:220px}[data-ratio="r381"] .rs-bscap{max-width:900px}' +   /* 단독 수치는 이 장의 유일한 주인공 — 120px은 초광폭에서 존재감이 사라진다 */
      '[data-ratio="r381"] .rs-dvind{align-self:flex-end;gap:16px}[data-ratio="r381"] .rs-ind{width:34px;height:36px}' +   /* 간지: 큐브 진행 인디케이터를 우하단으로 + 확대 — 좌상단 대형 타이틀과 대각 균형 */
      '[data-ratio="r381"] .rs-card.tbl{max-width:2000px}' +                                 /* 표 칸이 800px씩 벌어지면 값이 흩어진다 — 카드 폭 상한(좌측 정렬 유지) */
      '[data-ratio="r381"] .rs-tbrow{padding:26px 0}' +
      '[data-ratio="r381"] .rs-play{width:56px;height:56px}[data-ratio="r381"] .rs-play svg{width:26px;height:26px}' +   /* 하이라이트 행의 우측 재생 버튼 = 행마다의 우측 앵커. 40px은 2400px 행에서 점 */
      '[data-ratio="r381"] .rs-months{gap:32px}[data-ratio="r381"] .rs-mbar{height:5px}' +   /* 3px 진행 바는 2736 폭에서 실선처럼 사라진다 */
      '[data-ratio="r381"] .rs-srow{padding:22px 0}' +

      /* --- 초광폭 정돈 ③ 디스플레이 타이포·시각 앵커 재보정(본문·카드·리스트 폰트는 불변) --- */
      '[data-ratio="r381"] .rs-cvmid{grid-template-columns:1fr 620px;gap:130px}[data-ratio="r381"] .rs-clmid{grid-template-columns:1fr 760px;gap:130px}' +   /* 표지·클로징의 큐브(시각 앵커)를 키워 텍스트와 무게를 맞춘다 */
      '[data-ratio="r381"] .rs-cvtitle{font-size:140px}[data-ratio="r381"] .rs-dvtitle{font-size:160px}' +
      '[data-ratio="r381"] .rs-sttitle{font-size:92px}[data-ratio="r381"] .rs-cltitle{font-size:88px}' +
      '[data-ratio="r381"] .rs-clsub{max-width:900px}' +                                    /* 클로징 본문 560px 상한이 좌측 기둥을 가늘게 만들어 중앙이 비었다(폰트는 그대로, 폭만) */
      '[data-ratio="r381"] .rs-hhl{font-size:60px}[data-ratio="r381"] .slide.hl .rs-hl{font-size:64px}';
  }

  /* [시연 잠금] 표지·선언·클로징 문구 고정 — 누가 언제 뽑아도 동일(언어별, 편집·생성값보다 우선) */

  /* zh·ja 폰트 주입 — Pretendard엔 한자·가나 글리프가 없어 글자별 시스템 폰트가 섞여(굵기 들쭉날쭉) 보인다.
     덱 내용으로 언어를 판정해 Noto Sans SC/JP를 뒤에 덧붙인다(뒤 선언이 이겨서 폰트 통일). */
  function cjkHead(slides, clang) {
    var t = ''; try { t = JSON.stringify(slides); } catch (e) {}
    var ja = (t.match(/[\u3040-\u30ff]/g) || []).length, ko = (t.match(/[가-힣]/g) || []).length,
        zh = (t.match(/[\u4e00-\u9fff]/g) || []).length;
    var L = ja > 10 && ja >= ko ? 'ja' : (zh > 10 && zh > ko ? 'zh' : (({ ja: 1, zh: 1 })[clang] && ko < 5 ? clang : ''));
    if (!L) return '';
    var fam = L === 'ja' ? 'Noto Sans JP' : 'Noto Sans SC';
    return '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link href="https://fonts.googleapis.com/css2?family=' + fam.replace(/ /g, '+') + ':wght@300..900&display=swap" rel="stylesheet">' +
      '<style>body,.slide,.slide *{font-family:"' + fam + '","Pretendard Variable",Pretendard,-apple-system,sans-serif}.mut,.rs-bdrows,.rs-body,.rs-brfoot,.rs-brltx,.rs-brtext,.rs-bscap,.rs-bsnum,.rs-btext,.rs-cdtext,.rs-clsub,.rs-cltitle,.rs-cmrows,.rs-cvfoot,.rs-cvtitle,.rs-dvlead,.rs-dvtitle,.rs-hhl,.rs-hl,.rs-hlfoot,.rs-hlsub,.rs-kpval,.rs-mtx,.rs-no,.rs-note,.rs-pchead,.rs-qtx,.rs-rmitems,.rs-rtext,.rs-srow,.rs-stsub,.rs-sttitle,.rs-sttx,.rs-tchead,.rs-tdesc{font-weight:400}</style>';   /* 한자·가나는 300이 실낱 — 라이트 계열만 400으로 */
  }
  function lockDemo(slides, clang, touched) {
    if (touched) return slides;   /* 사용자가 손댄 덱(채팅 수정)은 잠금이 양보 */
    // 언어는 "내용"이 진실 — 기록(_clang)은 재생성·구버전에서 어긋난 채 남을 수 있어 보조로만 쓴다.
    // 비율 판정이라 EN 덱에 남는 한국어 인명 몇 자에는 안 속는다. 신호가 약할 때만 기록/기본값.
    var L = (function (o) {
      var t = ''; try { t = JSON.stringify(o); } catch (e) {}
      var ko = (t.match(/[가-힣]/g) || []).length, ja = (t.match(/[\u3040-\u30ff]/g) || []).length,
          zh = (t.match(/[\u4e00-\u9fff]/g) || []).length, la = (t.match(/[A-Za-z]/g) || []).length;
      if (ja > 10 && ja >= ko) return 'ja';
      if (ko > 5 && ko > la * 0.15) return 'ko';
      if (zh > 10 && zh > la * 0.15) return 'zh';
      if (la >= 30) return 'en';
      return ({ en: 1, ja: 1, zh: 1, ko: 1 })[clang] ? clang : 'ko';
    })(slides);
    var CV = {
      ko: { t: '**MIDAS GEN NX**\n__차세대__\n**구조설계 플랫폼**', b: '모델링부터 **API 자동화**까지, 하나의 플랫폼', c: '**차세대 구조설계를**\n__직접 경험하세요__\n**MIDAS GEN NX**' },
      en: { t: '**MIDAS GEN NX**\n__The Next Generation__\n**Structural Design Platform**', b: 'One platform, from modelling to **API automation**', c: '**Experience the Next Generation**\n__of Structural Design__\n**MIDAS GEN NX**' },
      ja: { t: '**MIDAS GEN NX**\n__次世代の__\n**構造設計プラットフォーム**', b: 'モデリングから**API自動化**まで、ひとつのプラットフォーム', c: '**次世代の構造設計を**\n__この目で__\n**MIDAS GEN NX**' },
      zh: { t: '**MIDAS GEN NX**\n__新一代__\n**结构设计平台**', b: '从建模到**API自动化**，一个平台', c: '**亲身体验**\n__新一代结构设计__\n**MIDAS GEN NX**' },
    }[L];
    return slides.map(function (s) {
      if (!s || s._touched) return s;   /* null·인라인 편집 장은 그대로 */
      if (s.type === 'cover') return Object.assign({}, s, { title: CV.t, band: CV.b });
      if (s.type === 'statement') return Object.assign({}, s, { title: 'MIDAS GEN NX × API × AI' });
      if (s.type === 'closing') return Object.assign({}, s, { title: CV.c });
      return s;
    });
  }

  function renderRamsDeck(data) {
    data = data || {};
    CLANG = data._clang || 'ko';
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    // [시연 잠금 해제] 재잠금 시: slides = lockDemo(slides, data._clang, data._userTouched);
    var cv = canvasOf(data);   /* 비율 계약 v1 — 루트 data-ratio가 --slide-w/h와 오버라이드 스코프를 동시에 켠다 */
    return '<!doctype html><html lang="ko" data-ratio="' + cv.slug + '"><head><meta charset="utf-8"><style>' + css() + '</style></head><body>' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + cjkHead(slides, data._clang) + '</body></html>';
  }

  /* ---- 발표 뷰어 ---- */
  function renderRamsViewer(data, opts) {
    data = data || {}; opts = opts || {};
    CLANG = data._clang || 'ko';
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    // [시연 잠금 해제] 재잠금 시: slides = lockDemo(slides, data._clang, data._userTouched);
    var cv = canvasOf(data);   /* 비율 계약 v1 — 뷰어도 같은 캔버스로 */
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
      'function fit(){var CW=' + cv.w + ',CH=' + cv.h + ';' +   /* 캔버스는 비율 계약에서 — 뷰어 축소율에 1280/720 리터럴 금지 */
      'var bh=fs()?0:84;var area=innerHeight-bh;var sc=Math.min(innerWidth*0.97/CW,area/CH)*(fs()?1:0.97);' +
      'var ty=Math.max(0,(area-CH*sc)/2);' +
      'document.querySelector(".vbar").style.display=fs()?"none":"flex";' +
      'var v=document.querySelector(".vscale");v.style.transform="translateY("+ty+"px) scale("+sc+")";}' +
      'function show(i){var prev=n;n=Math.max(0,Math.min(s.length-1,i));if(n===prev)return;' +
      's.forEach(function(x,k){x.classList.toggle("cur",k===n)});' +
      'var cur=s[n];if(cur){' +
      'var us=cur.querySelectorAll(' + JSON.stringify(UNIT_SEL + ',.rs-cube,.rs-donut,.rs-imgph') + ');var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      'var cu=cur.querySelectorAll(".rs-bsnum,.rs-kpval,.rs-bval,.rs-hole b");for(var w=0;w<cu.length;w++){(function(el){' +
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
      'else if(e.key==="Escape"&&!document.fullscreenElement)setPseudo(false);});' +
      '})();';
    return '<!doctype html><html lang="ko" data-ratio="' + cv.slug + '"><head><meta charset="utf-8"><style>' + css() + vcss + '</style></head><body>' +
      '<div class="vwrap"><div class="vscale">' + renderSlides(slides) + '</div></div>' +
      '<div class="vbar"><button class="vbtn vprev">‹</button><span class="vcount"></span><button class="vbtn vnext">›</button><button class="vbtn vfs">⛶</button></div>' +
      stateScript(slides) +
      '<scr' + 'ipt>' + vjs + '</scr' + 'ipt>' + cjkHead(slides, data._clang) + '</body></html>';
  }

  /* ---- 카탈로그("언제 쓰나") — AI 타입 선택 기준. naver 팩과 동일 어휘 ---- */
  var CATALOG = [
    { type: 'cover', label: '표지', use: '첫 장 — 로고·날짜·대형 3톤 타이틀·아이소 큐브 그래픽', needs: ['title'], opt: ['label', 'date', 'eyebrow', 'band', 'docLabel'] },
    { type: 'statement', label: '대형 선언', use: '표지 다음 선언·전환 — 대형 타이틀+본문+비교 카드 2개(흰/다크)', needs: ['title'], opt: ['sub', 'cols'] },
    { type: 'toc', label: '목차', use: '표지·선언 다음 장. 카드 행 리스트(divider 제목과 1:1 일치)', needs: ['items'], opt: ['title'], cap: { items: '3~5개' } },
    { type: 'divider', label: '간지', use: '챕터 시작 전환 장 — 다크/오렌지 풀블리드 자동 교대(bg로 지정 가능), 큐브 진행 인디케이터', needs: ['title', 'lead'], opt: ['no', 'bg'], cap: { title: '영문 2줄 ~16자', lead: '~60자' } },
    { type: 'section', label: '본문 넘버 행', use: '핵심 항목 3~4개 — 대형 번호+굵은 소제목+흐린 설명 규칙선 행', needs: ['title', 'points'], opt: ['tag', 'note'], cap: { points: '3~4개' } },
    { type: 'cards', label: 'N열 카드', use: '동급 항목 2~4개 — 흰 라운드 카드(번호 자동)', needs: ['title', 'cards'], opt: ['tag', 'note'], cap: { cards: '2~4개' } },
    { type: 'split', label: '좌우 대비', use: '반반 대비(라이트 vs 다크) — 활용/설계, 남/우리 구도', needs: ['left', 'right'], opt: [] },
    { type: 'stats', label: '수치', use: '도넛(다크 카드)+게이지 카드 행 — 진행률·지표 비교', needs: ['title'], opt: ['donut', 'bars', 'note'] },
    { type: 'media', label: '이미지 증빙', use: '스펙 시트(좌 라벨+행, 중간 다크 강조)+우 이미지 슬롯 — 데모·프로토타입 증빙', needs: ['title', 'specs'], opt: ['image', 'caption', 'tag'] },
    { type: 'roadmap', label: '로드맵', use: '월별 진행 바+Now/Next/Then 카드 — 단계별 계획', needs: ['title', 'steps'], opt: ['months', 'note'], cap: { steps: '3개' } },
    { type: 'bigstat', label: '단독 대형 수치', use: '숫자 하나로 임팩트 — 좌 설명/우 초대형 액센트 숫자', needs: ['title', 'value'], opt: ['caption', 'note'] },
    { type: 'kpi', label: '수치 그리드', use: '지표 2~4개 카드 요약(tone:on=다크 강조)', needs: ['title', 'items'], opt: ['note'], cap: { items: '2~4개' } },
    { type: 'table', label: '표', use: '열 고정 데이터 나열', needs: ['title', 'columns', 'rows'], opt: ['note'] },
    { type: 'milestone', label: '마일스톤', use: '기간 계획을 간트 바로 — 상단 단계 카드+월축 계단 바(현재→미래로 옅어짐). 일정·완료 기준 중심일 때 로드맵 대신', needs: ['title', 'bars', 'axis'], opt: ['phases', 'caption', 'note'], cap: { bars: '3~5개', axis: '4~6개' } },
    { type: 'timeline', label: '타임라인', use: '기간 진행 바 열(on=현재 액센트) — 연혁·월별 마일스톤', needs: ['title', 'items'], opt: ['note'], cap: { items: '3~5개' } },
    { type: 'process', label: '프로세스', use: '단계 카드 3~4개, 담당 구간=액센트 풀 카드(accent 인덱스)', needs: ['title', 'steps'], opt: ['accent', 'note'], cap: { steps: '3~4개' } },
    { type: 'compare', label: '비교', use: 'Before(옅음)/After(다크) 패널+옵션 이미지 — 전환 효과', needs: ['title', 'items'], opt: ['image', 'caption', 'note'], cap: { items: '2개' } },
    { type: 'quote', label: '인용', use: '발언·선언 하나를 크게', needs: ['text'], opt: ['by'] },
    { type: 'position', label: '포지셔닝', use: '흐름 3단계 중 우리 위치 — 중앙 액센트 카드', needs: ['title', 'panels'], opt: ['accent', 'note'], cap: { panels: '3개' } },
    { type: 'checklist', label: '체크리스트', use: '확인·완료 항목(액센트 체크 원). 4개 이하 1열·많으면 2열 자동', needs: ['title', 'items'], opt: ['cols', 'note'] },
    { type: 'lineup', label: '라인업', use: '제품·에이전트 구성 2×2 카드 — 첫 카드 다크+액센트 뱃지, state:dim=후보', needs: ['title', 'items'], opt: ['note'], cap: { items: '4개' } },
    { type: 'branch', label: '분기/조직', use: '좌 다크 리드 카드+우 카드 행(이름·역할·설명) — 조직·영역 분류', needs: ['title', 'branches'], opt: ['lead', 'note'], cap: { branches: '3개' } },
    { type: 'highlight', label: '하이라이트/데모', use: '오렌지 풀블리드+재생 행 — 라이브 데모·핵심 안내 임팩트 장', needs: ['title', 'items'], opt: ['note', 'footnote'], cap: { items: '2~3개' } },
    { type: 'board', label: '현황 보드', use: '진행 중 작업 요약 — 카드 2+다크 사이드(리스트+뱃지 칩)', needs: ['title', 'cards'], opt: ['side', 'note'], cap: { cards: '2개' } },
    { type: 'closing', label: '마무리', use: '마지막 장 — 다크, 다음 행동(Next)+연락 메타+큐브 군집', needs: ['title'], opt: ['sub', 'nextLabel', 'contacts'] }
  ];

  var STARTERS = {
    cover: { type: 'cover', label: 'MIDAS Design AX', date: '2026. 08', eyebrow: 'PROLOGUE', title: 'The Machine\n**That Builds**\n__the Machine__', band: '자동차가 아니라, **자동차를 만드는 시스템**', docLabel: '디자인 AX 보고' },
    statement: { type: 'statement', title: 'The Machine\n**That Builds Design**', sub: '한 건씩 잘 만드는 것만으로는 회사 전체의 품질과 생산성을 바꾸기 어렵습니다. 좋은 디자인이 반복적으로 생산되는 시스템 자체를 설계합니다.', cols: [{ tag: 'Tesla', text: '자동차 한 대 → **생산 시스템**' }, { tag: 'MIDAS', text: '디자인 결과물 → **디자인 에이전트**' }] },
    toc: { type: 'toc', title: '보고 순서', items: [{ label: 'Why Now', desc: '누구나 만드는 시대, 차이는 **기준**에서 생깁니다', pages: '04—08' }, { label: 'Where We Stand', desc: 'AI가 함께 참조할 **기준**이 필요합니다', pages: '09—11' }, { label: "What's Next", desc: '효과가 확인된 단계부터 **넓혀갑니다**', pages: '12—14' }] },
    divider: { type: 'divider', title: 'Everyone\n**Can Build**', lead: '생성은 누구나 가능해졌지만, **퀄리티는 같지 않습니다**' },
    section: { type: 'section', title: '기준과 자산이 일원화되지 않으면\nAI 환경에서 **드러나는 네 가지**', points: [{ head: '기준의 분산', text: '기준이 조직별로 나뉘어 있어 서로 다를 수 있음' }, { head: '자산의 분산', text: '검증된 자산이 각 조직에 남아 생성에 바로 적용하지 못함' }, { head: '검수의 속도', text: '생성 결과는 늘어나지만 검수는 사람이 건건이 수행' }], note: '모두 **기준을 한곳에 모아 시스템에 담으면** 해결됩니다.' },
    cards: { type: 'cards', title: "'만드는 것'은 이제\n**누구나 할 수 있는 일**이 되었습니다", cards: [{ head: '진입장벽 하락', text: '전문 도구를 익히지 않아도 결과가 나옵니다' }, { head: '경계 축소', text: '기획 · 제작 · 개발의 구분이 통합됩니다' }, { head: '결과물 증가', text: '만드는 속도와 양이 동시에 상승합니다' }], note: '생성은 누구나 가능해졌지만, **퀄리티는 모두 같지 않습니다.**' },
    split: { type: 'split', left: { kicker: '활용', title: 'AI 기반 기술은\n**활용합니다**', items: ['기반 AI 모델', '생성 기술과 API', '기존 제작 도구'], foot: '누구나 같은 것을 쓸 수 있는 영역' }, right: { kicker: '설계 — 우리만의 기준', title: '퀄리티 차이는\n**직접 설계합니다**', items: ['회사의 품질 기준', '조합 · 검수 · 승인 규칙', '사용 결과의 축적 · 학습'], foot: '퀄리티와 일관성이 결정되는 영역' } },
    stats: { type: 'stats', title: '현재 수준', donut: { pct: 30, value: '30%', caption: '자체 평가', label: '전체 진척' }, bars: [{ label: '플랫폼 · 플로우', pct: 65 }, { label: '품질 체계', pct: 20, on: true, text: '결과 퀄리티가 결정되는 영역 — 가장 많은 시간이 필요합니다' }, { label: '실업무 검증', pct: 10 }] },
    media: { type: 'media', title: 'Proof 01\n**작동 증빙**', specs: [{ label: 'Input', text: '기획 · 요구사항' }, { label: '핵심', text: '생성 — 조립 · 수정 · 출력', on: true }, { label: 'Output', text: '수정 가능한 결과물' }], image: { label: '실제 화면 캡처를 여기에 놓으세요' }, caption: '2026. 07 기준 프로토타입 캡처' },
    roadmap: { type: 'roadmap', title: '하반기부터\n**세 단계**로 진행합니다', months: [{ when: '8월', text: '안정화' }, { when: '9월', text: '착수' }, { when: '10월', text: '테스트베드' }, { when: '11월', text: '적용' }], steps: [{ when: 'Now', head: 'Prototype', state: 'now', items: ['플로우 안정화', '핵심 구성'] }, { when: 'Next', head: 'Working Tool', items: ['실제 적용', '기준 개선'] }, { when: 'Then', head: '확장', state: 'later', items: ['반복 사용 확인', '전사 연계 검토'] }] },
    bigstat: { type: 'bigstat', title: '단독 대형 수치', value: '64%', caption: '핵심 지표에 대한 설명이 들어갑니다.\n**강조 구절**로 마무리.' },
    kpi: { type: 'kpi', title: '수치 그리드', items: [{ value: '92%', label: '만족도' }, { value: '120명', label: '활성 사용자', tone: 'on' }, { value: '4.6/5', label: '평점' }] },
    table: { type: 'table', title: '표', columns: ['항목', '내용', '비고'], rows: [{ cells: ['첫 행', '내용', '—'] }, { cells: ['둘째 행', '내용', '—'] }] },
    milestone: { type: 'milestone', title: '현재부터 2027 상반기까지 세 단계로 진행합니다',
      phases: [{ tag: '현재', head: '생성기 고도화', text: '**제작 완료** · 고도화 진행', on: true }, { tag: '2026 하반기', head: 'Design Pack 탑재', text: '시범 적용 · 전사 확산' }, { tag: '2027 상반기', head: '전사 AI Production', text: '공유 · 활용 구조 완성' }],
      caption: '2026 하반기 월별 완료 기준',
      bars: [{ label: 'MVP + Design Pack v1 구축', sub: '8월 — 기준 · 자산 최초 정의', start: 1, span: 2 }, { label: '실무 파일럿 시작', sub: '9월 — 실무 적용 개시', start: 2, span: 2 }, { label: '실제 프로젝트 적용 · 품질 검증', sub: '10월 — 품질 기준 검증', start: 3, span: 2 }, { label: 'v2 + 2차 착수', sub: '11월 — 확장 단계', start: 4, span: 2 }],
      axis: ['8월', '9월', '10월', '11월', '12월'],
      note: '다음 단계 진행을 위해 **자산화 서버 구축** 검토가 필요합니다.' },
    timeline: { type: 'timeline', title: '타임라인', items: [{ when: '8월', head: '준비', text: '설명' }, { when: '9월', head: '실행', on: true, text: '설명' }, { when: '10월', head: '확산', text: '설명' }] },
    process: { type: 'process', title: '우리는\n**디자인 단계**를 담당합니다', steps: [{ tag: '1 · 기획', head: '기획\nAgent', text: '목적 · 요구사항 · 구조를 정의' }, { tag: '2 · 디자인', head: '디자인\n**Agent**', text: 'UX · UI 기준으로 화면과 시각 결과물을 구현' }, { tag: '3 · 개발', head: '개발\nAgent', text: '코드 구현 · 배포' }], note: '같은 구조라도 **무엇을 탑재하느냐**에 따라 결과는 달라집니다.' },
    compare: { type: 'compare', title: '전환 효과', items: [{ head: 'Before', items: ['담당자별 개인 파일 · 설정', '반복 설정을 매번 수작업', '버전이 바뀌면 재작업'] }, { head: 'After', items: ['공통 입력 규격', '표준 공정이 반복 처리', '결과 확인 후 출력'] }], image: { label: '실행 화면 캡처' }, caption: '일부 실사용 중' },
    quote: { type: 'quote', text: '한 문장으로 각인시키고 싶은\n**핵심 메시지**를 적습니다', by: '출처 · 발화자' },
    position: { type: 'position', title: '흐름 속\n**우리 위치**', panels: [{ tag: '1 · 이전', head: '이전 단계', text: '설명' }, { tag: '2 · 우리', head: '**우리 위치**', text: '핵심 역할 설명' }, { tag: '3 · 다음', head: '다음 단계', text: '설명' }] },
    checklist: { type: 'checklist', title: '체크리스트', items: ['확인 항목을 입력하세요', '확인 항목을 입력하세요', '확인 항목을 입력하세요'] },
    lineup: { type: 'lineup', title: '업무별 구성\n**Line-up**', items: [{ tag: 'Product / Web', head: 'Web Generator', text: '기획 입력 → 생성 → 수정 · 출력', badge: '현재 프로토타입' }, { tag: 'Motion', head: 'Motion Workflow', text: '반복 편집 · 버전 · 포맷 제작', badge: '일부 실사용' }, { tag: 'Visual / BX', head: 'Visual Generator', text: '행사 · 캠페인 커뮤니케이션 자산', state: 'dim', badge: '후보' }, { tag: 'Presentation', head: 'Presentation Agent', text: '발표자료 초안 · 정리 · 기준 검수', state: 'dim', badge: '후보' }], note: '현업에서 **효과와 반복성이 큰 순서**로 구체화합니다.' },
    branch: { type: 'branch', title: '업무는\n**전 영역**에 걸쳐 있습니다', lead: { label: '새로 필요한 것', text: '세 영역이 함께 참조할\n**기준과 자산**', foot: '조직을 합치자는 이야기가 아니라,\n**기준의 위치**에 대한 이야기입니다.' }, branches: [{ label: 'ExD팀', head: '전사 행사 · 기업 브랜드', text: '전사 브랜드 기준을 축적' }, { label: '사업 추진실', head: '상품 MBM · 행사', text: '사업 특성에 맞춘 자산 제작' }, { label: '상품개발조직', head: '상품 UI · 사용자 경험', text: '상품별 UI 체계를 운영' }] },
    highlight: { type: 'highlight', title: '두 가지를\n**Live Demo**로 보여드립니다', items: [{ head: 'AX Web Generator', text: '기획 입력 → 생성 → 수정 → Export' }, { head: 'Motion Workflow', text: '실작동 영상 재생' }], note: '완성된 서비스가 아니라, **작동을 확인하는 프로토타입**입니다.', footnote: '3분 이내 · 입력 데이터 고정\n녹화 영상 백업 준비' },
    board: { type: 'board', title: 'Running Today.\n**Building Next.**', cards: [{ tag: '01 · Product / Web', head: 'AX Web Generator', text: '생성 플로우 작동 확인, 기준과 자산은 제작 단계' }, { tag: '02 · Motion', head: 'Motion Workflow', text: '반복 편집 공정을 표준 워크플로우로 전환' }], side: { title: '병행한 현업 — 최근 6개월', items: ['핵심 상품 UX · 화면 제작', '전사 행사 · 사업 MBM', '영상 콘텐츠 제작'], pills: ['MIDAS WEEK', 'ONSITE UX·UI'] } },
    closing: { type: 'closing', label: 'MIDAS Design AX', title: 'The Machine That\nBuilds Design\n**has started running.**', sub: '첫 번째 에이전트가 작동하는 것까지 확인했습니다. 기준과 자산을 담는 일은 이제 시작입니다. **기준을 담는 만큼 결과가 달라집니다.**', nextLabel: 'Next', contacts: [{ k: '', v: 'Design Pack 제작 · 2차 Agent 선정' }, { k: '', v: '파일럿 테스트 · 적용 프로젝트 확정' }] }
  };

  var SCHEMA_DOC = CATALOG.map(function (c) {
    return c.type + '(' + c.label + '): ' + c.use;
  }).join('\n');
  var FIELD_DOC =
    'cover:{label?(로고 옆 이름),date?,eyebrow?("PROLOGUE"류),title(3톤: **굵게**·__회색 흐림__, \\n 2~3줄),band?(하단 좌 비유 문구, **강조**),docLabel?(하단 우)} | ' +
    'statement:{title(**굵게** 조합),sub?,cols?:[{tag,text("A → **B**" 비교)}](2개 — 둘째=다크 카드)} | ' +
    'toc:{title?,items:[{no?,label(영문 챕터명),desc(한 줄, **강조**),pages?:"04—08"}]} | ' +
    'divider:{no?:"01",title(영문 2줄 \\n, 둘째 줄 **굵게**),lead(한 문장, **강조**),bg?:"dark|accent"(생략 시 자동 교대)} | ' +
    'section:{title,points:[{head,text}](3~4개),tag?(러닝헤드 보조),note?(마무리, **강조**=액센트)} | ' +
    'cards:{title,cards:[{head,text?,tag?,tone?:"dark"}](2~4개),note?} | ' +
    'split:{left:{kicker,title(**굵게**),items:[str],foot?},right:{kicker,title(**굵게**),items:[str],foot?}} — 좌 라이트/우 다크 대비 | ' +
    'stats:{title,donut?:{pct:0~100,value?,caption?,label?},bars?:[{label,pct:0~100,value?,on?:true(다크 강조 행),text?}],note?} | ' +
    'media:{title,specs:[{label,text,on?:true(다크 강조 행)}],image?:{label},caption?} | ' +
    'roadmap:{title,months?:[{when,text}](4개 진행 바),steps:[{when:"Now|Next|Then",head,items:[str],state?:"now|later"}](3개),note?} | ' +
    'bigstat:{title,value,caption?(**강조**),note?} | ' +
    'kpi:{title,items:[{value,label,desc?,tone?:"on"}](2~4개),note?} | ' +
    'table:{title,columns:[str],rows:[{cells:[str]}],note?} | ' +
    'milestone:{title,phases?:[{tag:"현재|2026 하반기"류,head,text?(**강조**),on?:true(현재)}](2~3 상단 단계 카드),caption?("월별 완료 기준"류),bars:[{label,sub?("8월 — 기준"류),start:시작 칸 1~축개수,span:칸 수}](3~5개 시간순 계단),axis:[월·분기 라벨 4~6개],note?(**강조**)} | ' +
    'timeline:{title,items:[{when,head,text?,on?:true}](3~5개),note?} | ' +
    'process:{title,steps:[{tag:"1 · 기획"류,head(\\n 2줄 가능·**굵게**),text?}](3~4개),accent?:강조 인덱스(기본 중앙),note?} | ' +
    'compare:{title,items:[{head:"Before|After",items:[str]}](2개),image?:{label},caption?,note?} | ' +
    'quote:{text(**강조**),by?} | ' +
    'position:{title,panels:[{tag,head(**굵게**),text?}](3개),accent?,note?} | ' +
    'checklist:{title,items:[str],cols?:1~2,note?} | ' +
    'lineup:{title,items:[{tag(분야),head(이름),text,badge?(상태 라벨),state?:"dim"(후보)}](4개 — 첫 항목=현재·다크),note?} | ' +
    'branch:{title,lead?:{label,text(**굵게**),foot?},branches:[{label(조직명),head(역할),text}](3개),note?} | ' +
    'highlight:{title(**굵게**),items:[{no?,head,text?}](2~3개 재생 행),note?(**강조**),footnote?(우하단 2줄)} | ' +
    'board:{title(**굵게**),cards:[{tag:"01 · 분야",head,text?}](2개),side?:{title,items:[str],pills?:[str]},note?} | ' +
    'closing:{label?,title(마지막 줄 **굵게**),sub?(**강조**=액센트),nextLabel?,contacts?:[{k?,v}](우하단 2줄)}' +
    '\n규칙: 액센트는 오렌지 하나 — 강조 남발 금지(장당 **강조** 1~2회). 간지 bg는 자동 교대(다크→오렌지). ' +
    'title은 의미 단위 \\n 줄바꿈. 이모지 금지.';

  var DEFAULT_DECK = {
    style: 'rams',
    slides: [
      STARTERS.cover, STARTERS.statement,
      { type: 'toc', title: '보고 순서', items: [{ label: 'Why Now', desc: '누구나 만드는 시대, 차이는 **기준**에서 생깁니다' }, { label: 'The System', desc: '기준을 담아 실행하는 **시스템**' }, { label: "What's Next", desc: '효과가 확인된 단계부터 **넓혀갑니다**' }] },
      STARTERS.divider, STARTERS.cards, STARTERS.section,
      { type: 'divider', title: 'The\n**System**', lead: '기준을 담아 실행하는 구조' },
      STARTERS.split, STARTERS.lineup, STARTERS.stats,
      { type: 'divider', title: 'Step\n**by Step**', lead: '일정만으로 확대하지 않고 **효과가 확인된 단계**부터 넓힙니다' },
      STARTERS.roadmap, STARTERS.closing
    ]
  };

  function ramsTemplateDeck() {
    var slides = CATALOG.map(function (c) {
      var s = JSON.parse(JSON.stringify(STARTERS[c.type]));
      return s;
    });
    if (slides[0]) { slides[0].title = '전체\n**템플릿**'; }
    return { slides: slides, style: 'rams' };
  }

  /* ---- 결정론 폴백 — AI 실패 시 브리프 키워드로 조립 ---- */
  function ramsComposeDeck(brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || (brief.lang && brief.lang !== 'ko' ? 'Untitled Deck' : '보고');
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 5);
    var slides = [{ type: 'cover', label: 'MIDAS Design AX', eyebrow: 'REPORT', title: title, band: brief.message || '', docLabel: brief.audience || '' }];
    if (outline.length > 1) slides.push({ type: 'toc', title: '보고 순서', items: outline.map(function (o) { return { label: o, desc: '' }; }) });
    outline.forEach(function (o, i) {
      slides.push({ type: 'divider', title: o, lead: '' });
      slides.push(JSON.parse(JSON.stringify(i % 2 ? STARTERS.cards : STARTERS.section)));
    });
    slides.push(JSON.parse(JSON.stringify(STARTERS.closing)));
    return { slides: slides, style: 'rams' };
  }

  window.renderRamsDeck = renderRamsDeck;
  window.renderRamsViewer = renderRamsViewer;
  window.ramsTemplateDeck = ramsTemplateDeck;
  window.RAMS_SCHEMA_DOC = SCHEMA_DOC;
  window.RAMS_FIELD_DOC = FIELD_DOC;
  window.ramsComposeDeck = ramsComposeDeck;
  window.RAMS_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.RAMS_MV_SEL = MV_SEL;
  window.RAMS_DEFAULT_DECK = DEFAULT_DECK;
  window.RAMS_CATALOG = CATALOG;
  window.RAMS_STYLE = { id: 'rams', name: 'Modern', desc: '웜그레이 · 라운드 카드 · 버밀리언 액센트 · 비율 선택', swatch: 'linear-gradient(135deg,#F5F5F3 55%,#FF4D00 55%)' };
  window.RAMS_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.ramsNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.section)); };
})();
