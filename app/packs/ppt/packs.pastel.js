/* packs.pastel.js — "Pastel Gradient" PPT 팩 (디자인AX 보고 — Gradient Goods 실측)
   소스: ~/Downloads/삼성화재_파스텔_01/디자인AX 보고 - Pastel.dc.html (1920×1080 → ×0.6667)
   시스템: 화이트 지면 + 챕터 컬러 5종(주·라이트·딥) 그라데이션 셀 + 하단 풀블리드 키밴드(KEY).
   타이포: 국문 Pretendard(헤드 43px w200·강조 600), 영문/숫자 Archivo(w200↔500). 리스트 보더바텀, gap 2px.
   계약: window.renderPastelDeck(data)·renderPastelViewer·pastelTemplateDeck·pastelComposeDeck·PASTEL_* — naver/rams와 동일 타입 어휘. */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<span class="mut">$1</span>'); }
  function de(path) { return ' data-edit="' + path + '"'; }
  function noNum(t) { t = String(t == null ? '' : t); var m = t.trim(); return /^\d{1,2}\s*[.)·:]?$/.test(m) ? '' : t.replace(/^\s*\d{1,2}\s*[.)·:]\s+/, ''); }
  /* 타이틀 강약 폴백 — **가 없으면 멀티라인=마지막 줄, 한 줄=뒤 40% 어절 자동 볼드 (하우스 스타일: 라이트 도입+굵은 핵심) */
  function emph(t) {
    t = String(t == null ? '' : t);
    if (!t || t.indexOf('**') !== -1) return t;
    var lines = t.split('\n');
    if (lines.length > 1) { lines[lines.length - 1] = '**' + lines[lines.length - 1] + '**'; return lines.join('\n'); }
    var ws = t.split(' ');
    if (ws.length < 3) return t;
    var k = Math.max(1, Math.ceil(ws.length * 0.4));
    return ws.slice(0, ws.length - k).join(' ') + ' **' + ws.slice(ws.length - k).join(' ') + '**';
  }

  /* ---- 챕터 컬러 5종 (design-guide.md 표 + 실측 딥톤) ---- */
  var CH = [
    { m: '#0F7FC7', l: '#8CD4F5', l2: '#BFE6FA', d: '#0B4C87', nd: '#0B5A93', name: 'Blue' },
    { m: '#0E9E8F', l: '#7FE0C4', l2: '#C9EFE6', d: '#0A6E63', nd: '#0A6E63', name: 'Teal' },
    { m: '#3FA83F', l: '#C6EC63', l2: '#DCF2B4', d: '#2C6E2A', nd: '#2C6E2A', name: 'Green' },
    { m: '#F0546B', l: '#FFB27A', l2: '#FFD9BC', d: '#B5384F', nd: '#8F3F2C', name: 'Coral' },
    { m: '#12569E', l: '#8CCBF2', l2: '#CFE6F8', d: '#0F3F72', nd: '#0F4C8C', name: 'Deep' }
  ];
  var BRAND = 'linear-gradient(150deg,#0F7FC7 0%,#12B3A6 48%,#5FCB55 100%)';   // 표지 대형 번호·선언 키워드
  function chOf(ctx) {   // 직전 divider 순번 → 챕터 컬러 (표지/선언/목차 전 = 1번)
    var idx = 0;
    if (ctx && ctx.chapters) for (var i = 0; i < ctx.chapters.length; i++) if (ctx.chapters[i].at <= ctx.no) idx = i + 1;
    return CH[Math.max(0, (idx - 1 + CH.length) % CH.length)];
  }
  function chv(c) { return '--cm:' + c.m + ';--cl:' + c.l + ';--cl2:' + c.l2 + ';--cd:' + c.d + ';--cn:' + c.nd; }
  /* 그라데이션 셀 톤 사다리 — i/n 위치에 따라 라이트→주색→딥. 마지막(또는 on)=주→딥 화이트 텍스트 */
  function cellTone(i, n, on) {
    if (on || i === n - 1) return 'background:linear-gradient(180deg,var(--cm) 0%,var(--cd) 100%);color:#fff';
    if (n > 2 && i === n - 2) return 'background:linear-gradient(180deg,var(--cl) 0%,var(--cm) 100%);color:#fff';
    if (i === 0) return 'background:linear-gradient(180deg,var(--cl2) 0%,var(--cl) 100%);color:var(--cd)';
    return 'background:linear-gradient(180deg,var(--cl) 0%,var(--cm) 100%);color:#fff';
  }

  /* ---- 공통 조각 ---- */
  function runhead(s, P, ctx, white) {
    var ch = ctx && ctx.chapterOf ? ctx.chapterOf(ctx.no) : null;
    var di = ctx && ch ? (ctx.chapters.indexOf(ch) + 1) : 0;
    var left = s.kicker != null ? s.kicker : (ch ? 'Chapter 0' + di + ' — ' + ch.title + (s.tag ? ' · ' + s.tag : '') : (s.tag || ''));
    var pg = (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '');
    return '<div class="pg-run' + (white ? ' wh' : '') + '"><span class="pg-runl"' + de(P + '.kicker') + '>' + esc(left) + '</span>' +
      '<span class="pg-runr">' + pg + '</span></div>';
  }
  function headline(s, P) {
    return '<h2 class="pg-hl"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>';
  }
  function sub(s, P) {
    return s.sub ? '<p class="pg-sub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '';
  }
  /* 하단 풀블리드 키밴드 — KEY 라벨 + 문장(**강조** 600) + 옵션 우측 소주(sideNote 없음 → note만) */
  function keyband(s, P) {
    if (!s.note) return '';
    return '<div class="pg-key"><span class="pg-klab">Key</span><span class="pg-ktx"' + de(P + '.note') + '>' + mb(s.note) + '</span></div>';
  }
  function label(t, P, cls) { return '<span class="pg-lab' + (cls ? ' ' + cls : '') + '"' + (P ? de(P) : '') + '>' + esc(t || '') + '</span>'; }
  function kind(s, d) { return esc(s.kindLabel || d); }
  /* 표지·엔딩 우측 — 5색 세로 그라데이션 바(엇갈림) */
  function bars(bottom) {
    var mg = bottom ? ['margin-bottom:115px', 'margin-bottom:43px', 'margin-bottom:152px', 'margin-bottom:75px', ''] : ['', 'margin-top:88px', 'margin-top:37px', 'margin-top:136px', 'margin-top:64px'];
    return '<div class="pg-cvbars">' + CH.map(function (c, i) {
      return '<span style="background:linear-gradient(180deg,' + c.l + ' 0%,' + c.m + ' 100%);' + mg[i] + '"></span>';
    }).join('') + '</div>';
  }

  /* ---- 타입 렌더러 (naver/rams 동일 필드 계약) ---- */
  var R = {
    /* 표지 — 좌 텍스트(그라데이션 대형 번호·Archivo 타이틀·리드) + 우 5색 바. 원본 01 */
    cover: function (s, P, ctx) {
      return '<section class="slide pg cv" data-kind="' + kind(s, 'Cover') + '" style="' + chv(CH[0]) + '">' +
        '<div class="pg-cvl">' +
        '<div class="pg-run"><span class="pg-runl mut"' + de(P + '.label') + '>' + esc(s.label || 'MIDAS Design AX') + '</span><span class="pg-runr">01</span></div>' +
        '<div class="sp"></div>' +
        '<span class="pg-cvnum">01</span>' +
        '<h1 class="pg-cvtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.band ? '<p class="pg-cvlead"' + de(P + '.band') + '>' + mb(s.band) + '</p>' : '') +
        '<div class="sp"></div>' +
        '<div class="pg-cvfoot"><span class="a"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow || 'Small System, Big Change') + '</span>' +
        (s.docLabel ? '<span class="b"' + de(P + '.docLabel') + '>' + esc(s.docLabel) + '</span>' : '') +
        (s.date ? '<span class="b"' + de(P + '.date') + '>' + esc(s.date) + '</span>' : '') + '</div>' +
        '</div>' + bars(false) + '</section>';
    },
    /* 대형 선언 — Archivo 대형 + 그라데이션 키워드 + 하단 비교 카드 2. 원본 02 */
    statement: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cols.' + i, cc = CH[i % CH.length];
        return '<div class="pg-stcard" style="background:linear-gradient(150deg,' + cc.l + ' 0%,' + cc.m + ' 100%)">' +
          '<span class="pg-lab wh"' + de(IP + '.tag') + '>' + esc(c.tag || '') + '</span>' +
          '<span class="pg-sttx"' + de(IP + '.text') + '>' + mb(c.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide pg st" data-kind="' + kind(s, 'Statement') + '" style="' + chv(CH[0]) + '">' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'Starting Point' }, P, ctx) +
        '<div class="sp"></div>' +
        '<h1 class="pg-sttitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.sub ? '<p class="pg-stsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') +
        '<div class="sp"></div>' +
        (cols ? '<div class="pg-stcols">' + cols + '</div>' : '') + '</section>';
    },
    /* 목차 — N열 그라데이션 컬럼(대형 번호 딥톤·영문 라벨·메시지·페이지). 원본 03 */
    toc: function (s, P, ctx) {
      var items = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, cc = CH[i % CH.length];
        return '<div class="pg-toccol" style="background:linear-gradient(180deg,' + cc.l + ' 0%,' + cc.m + ' 100%)">' +
          '<span class="pg-tocno" style="color:' + cc.nd + '"' + de(IP + '.no') + '>' + esc(it.no || (i < 9 ? '0' : '') + (i + 1)) + '</span>' +
          '<div class="sp"></div><div class="pg-tocbot">' +
          '<span class="pg-lab wh"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          '<span class="pg-tocdesc"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</span>' +
          (it.pages ? '<span class="pg-tocpg"' + de(IP + '.pages') + '>' + esc(it.pages) + '</span>' : '') +
          '</div></div>';
      }).join('');
      return '<section class="slide pg tc" data-kind="' + kind(s, 'Contents') + '" style="' + chv(CH[0]) + '">' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'Contents' }, P, ctx) +
        '<div class="pg-tocgrid c' + Math.min((s.items || []).length || 5, 5) + '">' + items + '</div></section>';
    },
    /* 간지 — 풀블리드 챕터 그라데이션 + 대형 Archivo 2톤 + 리드. 원본 16(Live Demo) 풀컬러 패턴 */
    divider: function (s, P, ctx) {
      var idx = ctx && ctx.dividerIndex ? ctx.dividerIndex(ctx.no) : 0;
      var c = CH[idx % CH.length];
      return '<section class="slide pg dv" data-kind="' + kind(s, 'Divider') + '" style="' + chv(c) + ';background:linear-gradient(150deg,' + c.l + ' 0%,' + c.m + ' 52%,' + c.d + ' 100%)">' +
        runhead({ kicker: 'Chapter ' + (s.no || (idx < 9 ? '0' : '') + (idx + 1)) }, P, ctx, true) +
        '<div class="pg-dvmid"><h1 class="pg-dvtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.lead ? '<p class="pg-dvlead"' + de(P + '.lead') + '>' + mb(s.lead) + '</p>' : '') + '</div>' +
        '<div class="pg-dvft"><span class="pg-lab wh">MIDAS Design AX</span></div></section>';
    },
    /* 본문 표준 — N열 대형 번호(챕터색)+보더탑+소제목+설명. 원본 09 */
    section: function (s, P, ctx) {
      var c = chOf(ctx);
      var pts = (s.points || []).slice(0, 4);
      var body = pts.map(function (p, i) {
        var IP = P + '.points.' + i;
        return '<div class="pg-num"><span class="pg-numno"' + de(IP + '.no') + '>' + esc(p.no || '0' + (i + 1)) + '</span>' +
          '<span class="pg-numhead"' + de(IP + '.head') + '>' + esc(noNum(p.head) || '') + '</span>' +
          (p.text ? '<p class="pg-numtx"' + de(IP + '.text') + '>' + mb(p.text) + '</p>' : '') + '</div>';
      }).join('');
      if (!pts.length && s.text) body = '<p class="pg-body"' + de(P + '.text') + '>' + mb(s.text) + '</p>';
      return '<section class="slide pg sc kb" data-kind="' + kind(s, 'Section') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-numgrid c' + Math.min(Math.max(pts.length, 1), 4) + '">' + body + '</div>' + keyband(s, P) + '</section>';
    },
    /* N열 그라데이션 카드 — 톤 사다리(라이트→주→딥, 마지막 화이트). 원본 06/08 */
    cards: function (s, P, ctx) {
      var c = chOf(ctx), n = (s.cards || []).length || 3;
      var cells = (s.cards || []).map(function (it, i) {
        var IP = P + '.cards.' + i;
        return '<div class="pg-cell" style="' + cellTone(i, n, it.tone === 'dark') + '">' +
          (it.tag ? '<span class="pg-lab in"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
          '<span class="pg-cellhead"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<p class="pg-celltx"' + de(IP + '.text') + '>' + mb(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg cd kb" data-kind="' + kind(s, 'Cards') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-grid c' + Math.min(n, 4) + '">' + cells + '</div>' + keyband(s, P) + '</section>';
    },
    /* 좌우 대비 — 흐린 리스트 vs 강조 리스트(대시바). 원본 07 */
    split: function (s, P, ctx) {
      var c = chOf(ctx);
      function half(h, HP, on) {
        h = h || {};
        var rows = (h.items || []).map(function (t, i) {
          return '<li class="' + (on ? 'on' : '') + '">' + (on ? '<span class="pg-dash"></span>' : '') + '<span' + de(HP + '.items.' + i) + '>' + mb(t) + '</span></li>';
        }).join('');
        return '<div class="pg-half">' +
          '<span class="pg-lab' + (on ? ' acc bd' : ' bd0') + '"' + de(HP + '.kicker') + '>' + esc(h.kicker || '') + '</span>' +
          '<ul class="pg-list">' + rows + '</ul>' +
          (h.foot ? '<span class="pg-foot"' + de(HP + '.foot') + '>' + mb(h.foot) + '</span>' : '') + '</div>';
      }
      return '<section class="slide pg sp2 kb" data-kind="' + kind(s, 'Split') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) +
        (s.title ? headline(s, P) : '') +
        '<div class="pg-splitgrid">' + half(s.left, P + '.left', false) + half(s.right, P + '.right', true) + '</div>' + keyband(s, P) + '</section>';
    },
    /* 수치 — 좌 대형 그라데이션 %(donut.pct) + 우 진행바 rows(on=틴트 박스). 원본 17 */
    stats: function (s, P, ctx) {
      var c = chOf(ctx);
      var big = '';
      if (s.donut) {
        big = '<div class="pg-bigcol">' + (s.donut.label ? label(s.donut.label, P + '.donut.label') : '') +
          '<span class="pg-bignum">' + '<i' + de(P + '.donut.pct') + '>' + esc(String(s.donut.pct != null ? s.donut.pct : 0)) + '</i><em>%</em></span>' +
          (s.donut.caption ? '<span class="pg-bigcap"' + de(P + '.donut.caption') + '>' + mb(s.donut.caption) + '</span>' : '') + '</div>';
      }
      var rows = (s.bars || []).map(function (b, i) {
        var IP = P + '.bars.' + i, pct = Math.max(0, Math.min(100, +b.pct || 0));
        return '<div class="pg-brow' + (b.on ? ' on' : '') + '">' +
          '<div class="hd"><span class="l"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span><span class="v"' + de(IP + '.value') + '>' + esc(b.value || pct + '%') + '</span></div>' +
          '<div class="tr"><i style="width:' + pct + '%"></i></div>' +
          (b.text ? '<span class="tx"' + de(IP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg stt kb" data-kind="' + kind(s, 'Stats') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-statgrid' + (big ? '' : ' solo') + '">' + big + '<div class="pg-bars">' + rows + '</div></div>' + keyband(s, P) + '</section>';
    },
    /* 스펙 rows — 라벨 열 + 내용, on=그라데이션 풀행. 원본 14 구조 + 이미지 슬롯 옵션 */
    media: function (s, P, ctx) {
      var c = chOf(ctx);
      var rows = (s.specs || []).map(function (sp, i) {
        var IP = P + '.specs.' + i;
        return '<div class="pg-srow' + (sp.on ? ' on' : '') + '">' +
          '<span class="k"' + de(IP + '.label') + '>' + esc(sp.label || '') + '</span>' +
          '<span class="t"' + de(IP + '.text') + '>' + mb(sp.text || '') + '</span></div>';
      }).join('');
      var img = s.image ? '<div class="pg-imgcol"><div class="pg-imgph s-imgwrap" data-img="media"><span' + de(P + '.image.label') + '>' + esc(s.image.label || '이미지') + '</span></div>' +
        (s.caption ? '<span class="pg-cap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div>' : '';
      return '<section class="slide pg md kb" data-kind="' + kind(s, 'Media') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-mdgrid' + (img ? ' hasimg' : '') + '"><div class="pg-srows">' + rows + '</div>' + img + '</div>' + keyband(s, P) + '</section>';
    },
    /* 로드맵 — Now/Next/Then 3열(첫 열 그라데이션) + 하단 월별 타임라인 밴드. 원본 18 */
    roadmap: function (s, P, ctx) {
      var c = chOf(ctx);
      var steps = (s.steps || []).slice(0, 3).map(function (st, i) {
        var IP = P + '.steps.' + i, now = st.state === 'now' || i === 0;
        var lis = (st.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="pg-rmcol' + (now ? ' now' : '') + '"' + (now ? ' style="background:linear-gradient(180deg,' + c.l + ' 0%,' + c.m + ' 100%)"' : '') + '>' +
          '<span class="pg-lab' + (now ? ' dp' : '') + '"' + de(IP + '.when') + '>' + esc(st.when || ['Now', 'Next', 'Then'][i]) + '</span>' +
          '<span class="pg-rmhead"' + de(IP + '.head') + '>' + esc(st.head || '') + '</span>' +
          '<ul class="pg-rmlist">' + lis + '</ul></div>';
      }).join('');
      var band = '';
      if (s.months && s.months.length) {
        band = '<div class="pg-key tb">' + s.months.map(function (m, i) {
          var IP = P + '.months.' + i;
          return '<span class="mi"><b' + de(IP + '.when') + '>' + esc(m.when || '') + '</b><i' + de(IP + '.text') + '>' + esc(m.text || '') + '</i></span>';
        }).join('') + '</div>';
      } else band = keyband(s, P);
      return '<section class="slide pg rm kb" data-kind="' + kind(s, 'Roadmap') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-rmgrid">' + steps + '</div>' + band + '</section>';
    },
    /* 단일 대형 수치 — 그라데이션 클립 숫자. 원본 17 좌측 확장 */
    bigstat: function (s, P, ctx) {
      var c = chOf(ctx);
      return '<section class="slide pg bs kb" data-kind="' + kind(s, 'BigStat') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="pg-bsmid"><span class="pg-bsval"' + de(P + '.value') + '>' + esc(s.value || '') + '</span>' +
        (s.caption ? '<span class="pg-bscap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div>' + keyband(s, P) + '</section>';
    },
    /* KPI — N열 값 카드(그라데이션 톤 사다리). */
    kpi: function (s, P, ctx) {
      var c = chOf(ctx), n = (s.items || []).length || 3;
      var cells = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="pg-cell kp" style="' + cellTone(i, n, it.tone === 'on') + '">' +
          '<span class="pg-kpval"' + de(IP + '.value') + '>' + esc(it.value || '') + '</span>' +
          '<span class="pg-lab in"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          (it.desc ? '<p class="pg-celltx"' + de(IP + '.desc') + '>' + mb(it.desc) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg kp kb" data-kind="' + kind(s, 'KPI') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-grid c' + Math.min(n, 4) + '">' + cells + '</div>' + keyband(s, P) + '</section>';
    },
    /* 표 — 헤더 라벨 + 보더바텀 rows. */
    table: function (s, P, ctx) {
      var c = chOf(ctx), nc = (s.columns || []).length || 3;
      var head = '<div class="pg-tbrow hd" style="--tbc:' + nc + '">' + (s.columns || []).map(function (cc, i) { return '<span' + de(P + '.columns.' + i) + '>' + esc(cc) + '</span>'; }).join('') + '</div>';
      var rows = (s.rows || []).map(function (r, ri) {
        return '<div class="pg-tbrow" style="--tbc:' + nc + '">' + (r.cells || []).map(function (cc, ci) { return '<span' + (ci === 0 ? ' class="f"' : '') + de(P + '.rows.' + ri + '.cells.' + ci) + '>' + mb(cc) + '</span>'; }).join('') + '</div>';
      }).join('');
      return '<section class="slide pg tb kb" data-kind="' + kind(s, 'Table') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-tbl">' + head + rows + '</div>' + keyband(s, P) + '</section>';
    },
    /* 타임라인 — when(Archivo 챕터색)+head+text rows, on=틴트. */
    timeline: function (s, P, ctx) {
      var c = chOf(ctx);
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="pg-trow' + (it.on ? ' on' : '') + '">' +
          '<span class="w"' + de(IP + '.when') + '>' + esc(it.when || '') + '</span>' +
          '<span class="h"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg tl kb" data-kind="' + kind(s, 'Timeline') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-trows">' + rows + '</div>' + keyband(s, P) + '</section>';
    },
    /* 마일스톤(간트) — 전 팩 공통 계약. 베이스=챕터 주색 */
    milestone: function (s, P, ctx) {
      var c = chOf(ctx), N = (s.axis || []).length || 5;
      var phases = (s.phases || []).map(function (p, i) {
        var IP = P + '.phases.' + i;
        return '<div class="ms-phase' + (p.on ? ' on' : '') + '"><span class="ms-ptag"' + de(IP + '.tag') + '>' + esc(p.tag || '') + '</span>' +
          '<span class="ms-phead"' + de(IP + '.head') + '>' + esc(p.head || '') + '</span>' +
          (p.text ? '<span class="ms-ptext"' + de(IP + '.text') + '>' + mb(p.text) + '</span>' : '') + '</div>';
      }).join('');
      var barsArr = s.bars || [];
      var mbars = barsArr.map(function (b, i) {
        var IP = P + '.bars.' + i;
        var st = Math.max(1, Math.min(N, +b.start || i + 1)), sp = Math.max(1, Math.min(N - st + 1, +b.span || 2));
        var n = barsArr.length, pct = n > 1 ? Math.round(88 - 68 * i / (n - 1)) : 88;
        return '<div class="ms-bar" style="margin-left:' + ((st - 1) / N * 100).toFixed(2) + '%;width:' + (sp / N * 100).toFixed(2) + '%;background:color-mix(in srgb, ' + c.m + ' ' + pct + '%, #fff);animation-delay:' + (0.1 + i * 0.12).toFixed(2) + 's">' +
          '<b' + de(IP + '.label') + '>' + esc(b.label || '') + '</b>' +
          (b.sub ? '<span' + de(IP + '.sub') + '>' + esc(b.sub) + '</span>' : '') + '</div>';
      }).join('');
      var gl = '<div class="ms-glines">' + new Array(N + 1).join('<i></i>') + '</div>';
      var ax = '<div class="ms-axis">' + (s.axis || []).map(function (a, i) { return '<span' + de(P + '.axis.' + i) + '>' + esc(a) + '</span>'; }).join('') + '</div>';
      return '<section class="slide pg ms" data-kind="' + kind(s, 'Milestone') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) +
        (phases ? '<div class="ms-phases">' + phases + '</div>' : '') +
        (s.caption ? '<span class="ms-cap"' + de(P + '.caption') + '>' + esc(s.caption) + '</span>' : '') +
        '<div class="ms-chart">' + gl + mbars + '</div>' + ax +
        (s.note ? '<p class="ms-note"' + de(P + '.note') + '>' + mb(s.note) + '</p>' : '') + '</section>';
    },
    /* 프로세스 — 3열(1/1.3/1) 중앙 그라데이션 강조. 원본 11 */
    process: function (s, P, ctx) {
      var c = chOf(ctx), steps = (s.steps || []).slice(0, 4);
      var accent = s.accent != null ? +s.accent : Math.floor(steps.length / 2);
      var cols = steps.map(function (st, i) {
        var IP = P + '.steps.' + i, on = i === accent;
        return '<div class="pg-step' + (on ? ' on' : '') + '"' + (on ? ' style="background:linear-gradient(160deg,' + c.l + ' 0%,' + c.m + ' 100%)"' : '') + '>' +
          '<span class="pg-lab' + (on ? ' wh' : '') + '"' + de(IP + '.tag') + '>' + esc(st.tag || '') + '</span>' +
          '<span class="pg-stephead"' + de(IP + '.head') + '>' + mb(noNum(st.head) || '') + '</span>' +
          (st.text ? '<p class="pg-steptx"' + de(IP + '.text') + '>' + mb(st.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg pc kb" data-kind="' + kind(s, 'Process') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-procgrid n' + steps.length + ' a' + accent + '">' + cols + '</div>' + keyband(s, P) + '</section>';
    },
    /* 비교 — Before(보더·흐림) / After(그라데이션·강조). 원본 15 */
    compare: function (s, P, ctx) {
      var c = chOf(ctx);
      var cols = (s.items || []).slice(0, 2).map(function (it, i) {
        var IP = P + '.items.' + i, on = i === 1;
        var lis = (it.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="pg-cmp' + (on ? ' on' : '') + '"' + (on ? ' style="background:linear-gradient(160deg,' + c.l + ' 0%,' + c.m + ' 100%)"' : '') + '>' +
          '<span class="pg-lab' + (on ? ' wh' : '') + '"' + de(IP + '.head') + '>' + esc(it.head || (i ? 'After' : 'Before')) + '</span>' +
          '<ul>' + lis + '</ul></div>';
      }).join('');
      return '<section class="slide pg cm kb" data-kind="' + kind(s, 'Compare') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-cmpgrid">' + cols + '</div>' + keyband(s, P) + '</section>';
    },
    /* 인용/질문 — 풀블리드 챕터 그라데이션 Q 패널. 원본 05 우측 */
    quote: function (s, P, ctx) {
      var c = chOf(ctx);
      return '<section class="slide pg qt" data-kind="' + kind(s, 'Quote') + '" style="' + chv(c) + ';background:linear-gradient(178deg,' + c.l + ' 0%,' + c.m + ' 55%,' + c.d + ' 100%)">' +
        runhead(s, P, ctx, true) +
        '<div class="pg-qtop"><span class="pg-qmark">Q</span><span class="pg-lab wh"' + de(P + '.by') + '>' + esc(s.by || 'The Question') + '</span></div>' +
        '<div class="sp"></div>' +
        '<p class="pg-qtx"' + de(P + '.text') + '>' + mb(emph(s.text || '')) + '</p>' +
        '<div class="sp"></div>' +
        '<span class="pg-lab wh">MIDAS Design AX</span></section>';
    },
    /* 포지셔닝 — process 재사용(패널 3, 중앙 강조) */
    position: function (s, P, ctx) {
      return R.process({ type: 'process', title: s.title, kicker: s.kicker, tag: s.tag, note: s.note, accent: s.accent != null ? s.accent : 1, kindLabel: s.kindLabel || 'Position', steps: (s.panels || []).map(function (p) { return { tag: p.tag, head: p.head, text: p.text }; }) }, P.replace(/\.panels\./, '.steps.'), ctx).replace(/data-edit="([^"]*)\.steps\./g, 'data-edit="$1.panels.');
    },
    /* 체크리스트 — 대시바 + 보더바텀 rows. 원본 04 리스트 */
    checklist: function (s, P, ctx) {
      var c = chOf(ctx), items = s.items || [];
      var two = (s.cols === 2) || items.length > 5;
      var lis = items.map(function (t, i) {
        return '<li><span class="pg-dash"></span><span' + de(P + '.items.' + i) + '>' + mb(t) + '</span></li>';
      }).join('');
      return '<section class="slide pg ck kb" data-kind="' + kind(s, 'Checklist') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<ul class="pg-list ckl' + (two ? ' two' : '') + '">' + lis + '</ul>' + keyband(s, P) + '</section>';
    },
    /* 라인업 — N열: 진행 항목=그라데이션, 후보(dim)=보더 카드. 원본 10 */
    lineup: function (s, P, ctx) {
      var c = chOf(ctx), items = (s.items || []).slice(0, 4);
      var lit = items.filter(function (x) { return x.state !== 'dim'; }).length;
      var li2 = 0;
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, dim = it.state === 'dim';
        var tone = dim ? 'border:1px solid var(--rule);color:var(--ink)' : cellTone(li2++, Math.max(lit, 2), false);
        return '<div class="pg-cell ln" style="' + tone + '">' +
          '<span class="pg-lab' + (dim ? ' mut' : ' in') + '"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          '<span class="pg-cellhead' + (dim ? ' thin' : '') + '"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.badge ? '<span class="pg-badge' + (dim ? ' mut' : '') + '"' + de(IP + '.badge') + '>' + esc(it.badge) + '</span>' : '') +
          (it.text ? '<p class="pg-celltx"' + de(IP + '.text') + '>' + mb(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg ln kb" data-kind="' + kind(s, 'Lineup') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-grid c' + Math.min(items.length || 4, 4) + '">' + cells + '</div>' + keyband(s, P) + '</section>';
    },
    /* 조직/갈래 — 3열 그라데이션 + 하단 보더 박스 리드. 원본 08 */
    branch: function (s, P, ctx) {
      var c = chOf(ctx), n = (s.branches || []).length || 3;
      var cols = (s.branches || []).map(function (b, i) {
        var IP = P + '.branches.' + i;
        return '<div class="pg-cell" style="' + cellTone(i, n, false) + '">' +
          '<span class="pg-lab in"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span>' +
          '<span class="pg-cellhead"' + de(IP + '.head') + '>' + esc(b.head || '') + '</span>' +
          (b.text ? '<p class="pg-celltx"' + de(IP + '.text') + '>' + mb(b.text) + '</p>' : '') + '</div>';
      }).join('');
      var lead = s.lead ? '<div class="pg-leadbox"><span class="pg-lab acc"' + de(P + '.lead.label') + '>' + esc(s.lead.label || '') + '</span>' +
        '<span class="tx"' + de(P + '.lead.text') + '>' + mb(s.lead.text || '') + '</span></div>' : '';
      return '<section class="slide pg br kb" data-kind="' + kind(s, 'Branch') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="pg-brmid"><div class="pg-grid c' + Math.min(n, 3) + '">' + cols + '</div>' + lead + '</div>' + keyband(s, P) + '</section>';
    },
    /* 하이라이트/데모 — 풀블리드 그라데이션 + 대형 타이틀 + 단계 행(보더탑). 원본 16 */
    highlight: function (s, P, ctx) {
      var c = chOf(ctx);
      var rows = (s.items || []).slice(0, 3).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="pg-hlrow' + (i === 0 ? ' fs' : '') + '">' +
          '<div class="hd"><span class="no"' + de(IP + '.no') + '>' + esc(it.no || '0' + (i + 1)) + '</span>' +
          '<span class="h"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span></div>' +
          (it.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide pg hl" data-kind="' + kind(s, 'Highlight') + '" style="' + chv(c) + ';background:linear-gradient(150deg,' + c.l + ' 0%,' + c.m + ' 45%,' + c.d + ' 100%)">' +
        runhead(s, P, ctx, true) +
        '<div class="pg-hlmid"><h1 class="pg-hltitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        '<div class="pg-hlrows">' + rows + '</div></div>' +
        (s.footnote ? '<span class="pg-hlfn"' + de(P + '.footnote') + '>' + mb(s.footnote) + '</span>' : '') + '</section>';
    },
    /* 현황 보드 — 2톤 대형 타이틀 + 좌 카드 2 + 우 사이드 리스트. 원본 13 */
    board: function (s, P, ctx) {
      var c = chOf(ctx);
      var cards = (s.cards || []).slice(0, 2).map(function (cd, i) {
        var IP = P + '.cards.' + i;
        return '<div class="pg-cell bd2" style="' + cellTone(i, 2, false) + '">' +
          '<span class="pg-lab in"' + de(IP + '.tag') + '>' + esc(cd.tag || '') + '</span>' +
          '<span class="pg-cellhead"' + de(IP + '.head') + '>' + esc(noNum(cd.head) || '') + '</span>' +
          (cd.text ? '<p class="pg-celltx"' + de(IP + '.text') + '>' + mb(cd.text) + '</p>' : '') + '</div>';
      }).join('');
      var side = '';
      if (s.side) {
        var lis = (s.side.items || []).map(function (t, i) { return '<li' + de(P + '.side.items.' + i) + '>' + mb(t) + '</li>'; }).join('');
        var pills = (s.side.pills || []).map(function (t, i) { return '<span' + de(P + '.side.pills.' + i) + '>' + esc(t) + '</span>'; }).join('');
        side = '<div class="pg-side">' + label(s.side.title, P + '.side.title', 'mut') +
          '<ul>' + lis + '</ul>' + (pills ? '<div class="pl">' + pills + '</div>' : '') + '</div>';
      }
      return '<section class="slide pg bo kb" data-kind="' + kind(s, 'Board') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) +
        '<h2 class="pg-bdtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>' +
        '<div class="pg-bdgrid"><div class="pg-bdcards">' + cards + '</div>' + side + '</div>' + keyband(s, P) + '</section>';
    },
    /* 엔딩 — 좌 dim+강조 대형 + 마무리 보더탑 + 우 5색 바(하단 정렬). 원본 19 */
    closing: function (s, P, ctx) {
      var c = CH[4];
      return '<section class="slide pg cl" data-kind="' + kind(s, 'Closing') + '" style="' + chv(c) + '">' +
        '<div class="pg-cll">' +
        runhead({ kicker: s.label != null ? s.label : 'From Prototype to System' }, P, ctx) +
        '<div class="sp"></div>' +
        '<h1 class="pg-cltitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.sub ? '<p class="pg-clsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') +
        '<div class="sp"></div>' +
        '<div class="pg-clfoot"><span class="big"' + de(P + '.nextLabel') + '>' + mb(s.nextLabel || '') + '</span>' +
        (s.contacts && s.contacts.length ? '<span class="ct">' + s.contacts.map(function (ct, i) { return '<i' + de(P + '.contacts.' + i + '.v') + '>' + esc(ct.v || '') + '</i>'; }).join('') + '</span>' : '') +
        '</div></div>' + bars(true) + '</section>';
    }
  };

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
      catch (e) { html = '<section class="slide pg sc" data-kind="Error"><h2 class="pg-hl">' + esc(s.type) + ' 렌더 오류</h2></section>'; }
      return html;
    }).join('\n');
  }

  /* ---- 이동/숨김/굵기 상태 재적용 — 타 팩과 동일 계약(_pos/_hide/_fmt/_z/_ta/_fs/_tw) ---- */
  var MV_SEL = '[data-edit], .s-imgwrap, .pg-cvbars, .pg-imgph, .pg-qmark, .pg-dash';
  var UNIT_SEL = '.pg-cell,.pg-num,.pg-step,.pg-cmp,.pg-brow,.pg-srow,.pg-trow,.pg-tbrow,.pg-hlrow,.pg-rmcol,.pg-toccol,.pg-stcard,.pg-list li,.ms-bar,.ms-phase';
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
      '})();';
    return '<scr' + 'ipt>' + js + '</scr' + 'ipt>';
  }

  /* ---- CSS — 실측 ×0.6667. 화이트 + 그라데이션 셀 + 키밴드 ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      '@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@200;300;400;500;600&display=swap");' +
      ':root{--ink:#14181B;--body:#5A6167;--muted:#9AA1A7;--dim:#C6CCD1;--rule:#E6EBEE;--rule2:#F0F3F5;--slide-w:1280px;--slide-h:720px}' +
      '*{box-sizing:border-box;margin:0;word-break:keep-all}' +
      'body{background:#E9EDF0;font-family:Pretendard,"Pretendard Variable",-apple-system,"Apple SD Gothic Neo",sans-serif;-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:#fff;color:var(--ink);overflow:hidden;' +
      'display:flex;flex-direction:column;padding:53px 69px;font-family:Pretendard,"Pretendard Variable",sans-serif}' +
      '.slide.kb{padding-bottom:0}' +
      '.sp{flex:1;min-height:0}' +
      'b{font-weight:600}.mut{color:var(--muted)}' +
      '.ar,.pg-run,.pg-lab,.pg-runr,.pg-cvnum,.pg-tocno,.pg-numno,.pg-kpval,.pg-bsval,.pg-bignum,.pg-qmark,.pg-badge{font-family:Archivo,Pretendard,sans-serif}' +
      /* 러닝헤드 */
      '.pg-run{display:flex;justify-content:space-between;align-items:baseline;flex:none;font-family:Archivo,sans-serif;font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--cm)}' +
      '.pg-run .pg-runl.mut{color:var(--muted)}' +
      '.pg-runr{color:var(--muted);font-weight:600}' +
      '.pg-run.wh{color:#fff}.pg-run.wh .pg-runr{color:rgba(255,255,255,.8)}' +
      /* 헤드라인·본문 */
      '.pg-hl{margin-top:30px;font-size:43px;font-weight:200;line-height:1.2;letter-spacing:-.03em;white-space:pre-wrap;flex:none;max-width:88%}' +
      '.pg-hl b{font-weight:600}' +
      '.pg-sub{margin-top:10px;font-size:16px;letter-spacing:.02em;color:var(--muted);flex:none}' +
      '.pg-body{font-size:19px;font-weight:300;line-height:1.66;color:var(--body)}' +
      '.pg-lab{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}' +
      '.pg-lab.wh{color:#fff}.pg-lab.in{color:inherit;opacity:.92}.pg-lab.acc{color:var(--cm)}.pg-lab.dp{color:var(--cd)}' +
      '.pg-lab.bd{color:var(--cm);padding-bottom:11px;border-bottom:2px solid var(--cm)}' +
      '.pg-lab.bd0{padding-bottom:11px;border-bottom:1px solid var(--rule)}' +
      '.pg-cap{font-size:14px;color:var(--muted)}' +
      '.pg-dash{width:13px;height:2px;background:var(--cm);flex:0 0 auto}' +
      /* 키밴드 */
      '.pg-key{margin:0 -69px;margin-top:auto;padding:23px 69px;flex:none;display:flex;align-items:center;gap:37px;color:#fff;' +
      'background:linear-gradient(96deg,var(--cl) 0%,var(--cm) 58%,var(--cd) 100%)}' +
      '.pg-klab{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;opacity:.9;flex:0 0 auto}' +
      '.pg-ktx{font-size:23px;font-weight:200;line-height:1.35}.pg-ktx b{font-weight:600}' +
      '.pg-key.tb{justify-content:space-between;gap:21px;padding:20px 69px;font-size:15px}' +
      '.pg-key.tb .mi{display:flex;align-items:baseline;gap:9px}.pg-key.tb .mi b{font-weight:600}.pg-key.tb .mi i{font-style:normal;opacity:.92;font-weight:300}' +
      /* 그리드·셀 */
      '.pg-grid{flex:1;min-height:0;display:grid;gap:2px;align-content:center;padding:24px 0}' +
      '.pg-grid.c2{grid-template-columns:1fr 1fr}.pg-grid.c3{grid-template-columns:repeat(3,1fr)}.pg-grid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.pg-cell{padding:27px 23px;display:flex;flex-direction:column;gap:9px;min-height:150px}' +
      '.pg-cellhead{font-size:25px;font-weight:600;letter-spacing:-.02em;line-height:1.2}.pg-cellhead.thin{font-weight:200}' +
      '.pg-celltx{font-size:16px;line-height:1.6;font-weight:300;opacity:.94;margin-top:auto}' +
      '.pg-badge{font-size:13px;font-weight:600}.pg-badge.mut{color:var(--muted);font-weight:400}' +
      /* 표지 */
      '.slide.cv,.slide.cl{flex-direction:row;padding:0;gap:0}' +
      '.pg-cvl,.pg-cll{flex:1;display:flex;flex-direction:column;padding:53px 48px 53px 69px;min-width:0}' +
      '.pg-cvnum{font-size:100px;font-weight:200;line-height:1;background:' + BRAND + ';-webkit-background-clip:text;background-clip:text;color:transparent}' +
      '.pg-cvtitle{margin-top:19px;font-family:Archivo,Pretendard,sans-serif;font-size:52px;font-weight:200;line-height:1.1;letter-spacing:-.03em;white-space:pre-wrap}' +
      '.pg-cvtitle b{font-weight:500}' +
      '.pg-cvlead{margin-top:29px;font-size:17px;font-weight:300;line-height:1.66;color:var(--body);max-width:30ch}' +
      '.pg-cvlead b{color:var(--ink);font-weight:600}' +
      '.pg-cvfoot{display:flex;flex-direction:column;gap:5px}' +
      '.pg-cvfoot .a{font-family:Archivo,sans-serif;font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}' +
      '.pg-cvfoot .b{font-size:13px;letter-spacing:.02em;color:var(--muted)}' +
      '.pg-cvbars{width:33.5%;flex:none;display:grid;grid-template-columns:repeat(5,1fr);align-items:stretch;background:#fff}' +
      '.pg-cvbars span{display:block}' +
      /* 선언 */
      '.pg-sttitle{font-family:Archivo,Pretendard,sans-serif;font-size:63px;font-weight:200;line-height:1.08;letter-spacing:-.035em;white-space:pre-wrap;flex:none}' +
      '.pg-sttitle b{font-weight:500;background:linear-gradient(96deg,#0F7FC7 0%,#12B3A6 52%,#5FCB55 100%);-webkit-background-clip:text;background-clip:text;color:transparent}' +
      '.pg-stsub{margin-top:32px;font-size:23px;font-weight:200;line-height:1.66;color:var(--body);max-width:40ch;flex:none}' +
      '.pg-stsub b{color:var(--ink);font-weight:600}' +
      '.pg-stcols{display:grid;grid-template-columns:1fr 1fr;gap:2px;flex:none}' +
      '.pg-stcard{color:#fff;padding:29px 32px;display:flex;flex-direction:column;gap:9px;min-height:130px}' +
      '.pg-sttx{font-size:24px;font-weight:200;line-height:1.4}.pg-sttx b{font-weight:600}' +
      /* 목차 */
      '.pg-tocgrid{flex:1;min-height:0;display:grid;gap:2px;padding-top:37px}' +
      '.pg-tocgrid.c3{grid-template-columns:repeat(3,1fr)}.pg-tocgrid.c4{grid-template-columns:repeat(4,1fr)}.pg-tocgrid.c5{grid-template-columns:repeat(5,1fr)}' +
      '.pg-toccol{color:#fff;padding:29px 23px;display:flex;flex-direction:column}' +
      '.pg-tocno{font-size:55px;font-weight:200;line-height:1}' +
      '.pg-tocbot{display:flex;flex-direction:column;gap:7px}' +
      '.pg-tocdesc{font-size:19px;font-weight:300;line-height:1.5}.pg-tocdesc b{font-weight:600}' +
      '.pg-tocpg{font-family:Archivo,sans-serif;font-size:13px;letter-spacing:.1em;margin-top:4px}' +
      /* 간지 */
      '.slide.dv{color:#fff}' +
      '.pg-dvmid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:24px}' +
      '.pg-dvtitle{font-family:Archivo,Pretendard,sans-serif;font-size:84px;font-weight:200;line-height:1.0;letter-spacing:-.04em;white-space:pre-wrap}' +
      '.pg-dvtitle b{font-weight:500}' +
      '.pg-dvlead{font-size:23px;font-weight:300;line-height:1.6;max-width:44ch;opacity:.95}.pg-dvlead b{font-weight:600}' +
      '.pg-dvft{flex:none;display:flex;justify-content:flex-end;opacity:.85}' +
      /* 본문 표준(번호 카드) */
      '.pg-numgrid{flex:1;min-height:0;display:grid;gap:29px;align-content:center;padding:24px 0}' +
      '.pg-numgrid.c1{grid-template-columns:1fr}.pg-numgrid.c2{grid-template-columns:1fr 1fr}.pg-numgrid.c3{grid-template-columns:repeat(3,1fr)}.pg-numgrid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.pg-num{display:flex;flex-direction:column;gap:12px}' +
      '.pg-numno{font-size:51px;font-weight:200;line-height:1;letter-spacing:-.04em;color:var(--cm)}' +
      '.pg-numhead{font-size:25px;font-weight:600;padding-top:12px;border-top:2px solid var(--cm)}' +
      '.pg-numtx{font-size:17px;line-height:1.6;color:var(--body);font-weight:300}' +
      /* 리스트(대시)·체크리스트 */
      '.pg-list{list-style:none;display:flex;flex-direction:column}' +
      '.pg-list li{display:flex;align-items:center;gap:16px;padding:13px 0;border-bottom:1px solid var(--rule);font-size:19px;font-weight:300;color:var(--body)}' +
      '.pg-list li.on{font-weight:500;color:var(--ink)}' +
      '.pg-list.ckl{flex:1;min-height:0;justify-content:center;padding:16px 0}' +
      '.pg-list.ckl li{font-size:21px;padding:15px 0}' +
      '.pg-list.ckl.two{display:grid;grid-template-columns:1fr 1fr;column-gap:53px;align-content:center}' +
      /* 좌우 대비 */
      '.pg-splitgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:53px;align-content:center;padding:24px 0}' +
      '.pg-half{display:flex;flex-direction:column;gap:12px}' +
      '.pg-half .pg-list li{font-size:20px;padding:13px 0;border-bottom:1px solid var(--rule2);color:#8C949A;font-weight:200}' +
      '.pg-half .pg-list li.on{border-bottom:1px solid var(--rule);color:var(--ink);font-weight:500}' +
      '.pg-foot{font-size:15px;color:var(--muted)}' +
      /* 수치 */
      '.pg-statgrid{flex:1;min-height:0;display:grid;grid-template-columns:0.72fr 1.28fr;gap:53px;align-items:center;padding:24px 0}' +
      '.pg-statgrid.solo{grid-template-columns:1fr}' +
      '.pg-bigcol{display:flex;flex-direction:column;gap:5px}' +
      '.pg-bignum{font-size:120px;font-weight:200;line-height:.9;letter-spacing:-.06em;background:linear-gradient(150deg,var(--cl) 0%,var(--cm) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}' +
      '.pg-bignum i{font-style:normal}.pg-bignum em{font-style:normal;font-size:51px;font-weight:300}' +
      '.pg-bigcap{font-size:15px;color:var(--muted);margin-top:8px}' +
      '.pg-bars{display:flex;flex-direction:column;gap:17px}' +
      '.pg-brow{display:flex;flex-direction:column;gap:7px}' +
      '.pg-brow .hd{display:flex;justify-content:space-between;align-items:baseline}' +
      '.pg-brow .l{font-size:18px;font-weight:500}.pg-brow .v{font-size:20px;font-weight:600;color:var(--cm)}' +
      '.pg-brow .tr{height:7px;background:var(--rule2)}.pg-brow .tr i{display:block;height:100%;background:linear-gradient(90deg,var(--cl) 0%,var(--cm) 100%)}' +
      '.pg-brow .tx{font-size:14px;color:var(--muted)}' +
      '.pg-brow.on{padding:17px 20px;background:color-mix(in srgb, var(--cl) 22%, #fff)}' +
      '.pg-brow.on .l{font-size:21px;font-weight:600}.pg-brow.on .v{font-size:28px}.pg-brow.on .tr{height:9px;background:color-mix(in srgb, var(--cl) 45%, #fff)}' +
      '.pg-brow.on .tx{color:var(--body);font-size:15px}' +
      /* 스펙 rows */
      '.pg-mdgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr;align-content:center;padding:24px 0}' +
      '.pg-mdgrid.hasimg{grid-template-columns:1.35fr 1fr;gap:37px;align-items:center}' +
      '.pg-srows{display:flex;flex-direction:column;gap:2px}' +
      '.pg-srow{display:flex;align-items:center;gap:32px;padding:17px 24px;border:1px solid var(--rule)}' +
      '.pg-srow .k{width:167px;flex:0 0 auto;font-family:Archivo,sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}' +
      '.pg-srow .t{font-size:19px;font-weight:300;color:var(--body)}' +
      '.pg-srow.on{border:0;background:linear-gradient(120deg,var(--cl) 0%,var(--cm) 100%);color:#fff;padding:25px 24px}' +
      '.pg-srow.on .k{color:#fff}.pg-srow.on .t{color:#fff;font-weight:500;font-size:21px}' +
      '.pg-imgph{border:1px solid var(--rule);background:color-mix(in srgb, var(--cl) 14%, #fff);min-height:213px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px}' +
      '.pg-imgcol{display:flex;flex-direction:column;gap:9px}' +
      /* 로드맵 */
      '.pg-rmgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);gap:2px;align-content:center;padding:24px 0}' +
      '.pg-rmcol{border:1px solid var(--rule);padding:29px 27px;display:flex;flex-direction:column;gap:15px}' +
      '.pg-rmcol.now{border:0;color:#fff}' +
      '.pg-rmcol.now .pg-lab.dp{color:var(--cd)}' +
      '.pg-rmhead{font-size:28px;font-weight:600;letter-spacing:-.02em}.pg-rmcol:not(.now) .pg-rmhead{font-weight:200}' +
      '.pg-rmcol.now .pg-rmhead{color:var(--cd)}' +
      '.pg-rmlist{list-style:none;display:flex;flex-direction:column;gap:8px;font-size:17px;line-height:1.5;font-weight:300}' +
      '.pg-rmcol:not(.now) .pg-rmlist{color:var(--body)}' +
      /* 대형 수치 */
      '.pg-bsmid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:16px 0}' +
      '.pg-bsval{font-size:147px;font-weight:200;line-height:.95;letter-spacing:-.06em;background:linear-gradient(150deg,var(--cl) 0%,var(--cm) 60%,var(--cd) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums}' +
      '.pg-bscap{font-size:21px;font-weight:300;color:var(--body);max-width:44ch;line-height:1.6}.pg-bscap b{font-weight:600;color:var(--ink)}' +
      '.pg-kpval{font-size:41px;font-weight:200;letter-spacing:-.03em}' +
      /* 표 */
      '.pg-tbl{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;padding:16px 0}' +
      '.pg-tbrow{display:grid;grid-template-columns:repeat(var(--tbc),1fr);gap:19px;align-items:center;padding:16px 0;border-bottom:1px solid var(--rule);font-size:18px;font-weight:300;color:var(--body)}' +
      '.pg-tbrow .f{font-weight:500;color:var(--ink)}' +
      '.pg-tbrow.hd{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);padding:9px 0}' +
      /* 타임라인 */
      '.pg-trows{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;padding:16px 0}' +
      '.pg-trow{display:grid;grid-template-columns:147px 220px 1fr;gap:27px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--rule)}' +
      '.pg-trow .w{font-family:Archivo,sans-serif;font-size:14px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--cm)}' +
      '.pg-trow .h{font-size:21px;font-weight:600}.pg-trow .t{font-size:17px;font-weight:300;color:var(--body)}' +
      '.pg-trow.on{background:color-mix(in srgb, var(--cl) 18%, #fff);padding:16px 16px;border-bottom:0}' +
      /* 프로세스 */
      '.pg-procgrid{flex:1;min-height:0;display:grid;gap:2px;align-content:center;padding:24px 0}' +
      '.pg-procgrid.n2{grid-template-columns:1fr 1fr}.pg-procgrid.n3{grid-template-columns:1fr 1.3fr 1fr}.pg-procgrid.n4{grid-template-columns:repeat(4,1fr)}' +
      '.pg-procgrid.n3.a0{grid-template-columns:1.3fr 1fr 1fr}.pg-procgrid.n3.a2{grid-template-columns:1fr 1fr 1.3fr}' +
      '.pg-step{border:1px solid var(--rule);padding:27px 24px;display:flex;flex-direction:column;gap:13px;min-height:180px}' +
      '.pg-step.on{border:0;color:#fff}' +
      '.pg-stephead{font-size:35px;font-weight:200;letter-spacing:-.02em;line-height:1.12;white-space:pre-wrap}' +
      '.pg-step.on .pg-stephead{font-weight:600;font-size:40px}' +
      '.pg-steptx{margin-top:auto;font-size:17px;line-height:1.6;color:var(--body);font-weight:300}' +
      '.pg-step.on .pg-steptx{color:#fff;font-weight:500;font-size:18px}' +
      /* 비교 */
      '.pg-cmpgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:2px;align-content:center;padding:24px 0}' +
      '.pg-cmp{border:1px solid var(--rule);padding:29px 27px;display:flex;flex-direction:column;gap:15px;min-height:200px}' +
      '.pg-cmp ul{list-style:none;display:flex;flex-direction:column;gap:9px;font-size:19px;font-weight:200;color:var(--muted)}' +
      '.pg-cmp.on{border:0;color:#fff}.pg-cmp.on ul{color:#fff;font-weight:500}' +
      /* 인용/질문 */
      '.slide.qt{color:#fff}' +
      '.pg-qtop{margin-top:24px;display:flex;flex-direction:column;gap:7px}' +
      '.pg-qmark{font-size:55px;font-weight:200;line-height:1}' +
      '.pg-qtx{font-size:39px;font-weight:200;line-height:1.34;letter-spacing:-.03em;white-space:pre-wrap;max-width:80%}' +
      '.pg-qtx b{font-weight:600}' +
      /* 하이라이트 */
      '.slide.hl{color:#fff}' +
      '.pg-hlmid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:37px}' +
      '.pg-hltitle{font-family:Archivo,Pretendard,sans-serif;font-size:84px;font-weight:200;line-height:.98;letter-spacing:-.045em;white-space:pre-wrap}' +
      '.pg-hltitle b{font-weight:500}' +
      '.pg-hlrows{display:grid;grid-template-columns:1.5fr 1fr;gap:48px}' +
      '.pg-hlrow{display:flex;flex-direction:column;gap:13px;padding-top:16px;border-top:1px solid rgba(255,255,255,.6)}' +
      '.pg-hlrow.fs{border-top:2px solid #fff}' +
      '.pg-hlrow .hd{display:flex;align-items:center;gap:13px}' +
      '.pg-hlrow .no{font-family:Archivo,sans-serif;font-size:13px;font-weight:600;letter-spacing:.16em}' +
      '.pg-hlrow .h{font-size:25px;font-weight:600;letter-spacing:-.02em}' +
      '.pg-hlrow .t{font-size:17px;font-weight:500;opacity:.92;line-height:1.55}' +
      '.pg-hlfn{flex:none;align-self:flex-end;font-size:13px;opacity:.85;text-align:right;line-height:1.6}' +
      /* 보드 */
      '.pg-bdtitle{margin-top:30px;font-family:Archivo,Pretendard,sans-serif;font-size:57px;font-weight:200;line-height:1.1;letter-spacing:-.035em;white-space:pre-wrap;flex:none}' +
      '.pg-bdtitle b{font-weight:500}.pg-bdtitle .mut{color:var(--dim)}' +
      '.pg-bdgrid{flex:1;min-height:0;display:grid;grid-template-columns:1.45fr 1fr;gap:48px;align-content:center;padding:24px 0}' +
      '.pg-bdcards{display:grid;grid-template-columns:1fr 1fr;gap:2px}' +
      '.pg-cell.bd2{min-height:140px}' +
      '.pg-side{display:flex;flex-direction:column;gap:13px;padding-top:16px;border-top:1px solid var(--rule)}' +
      '.pg-side ul{list-style:none;display:flex;flex-direction:column;gap:8px;font-size:17px;font-weight:200;color:var(--body)}' +
      '.pg-side .pl{display:flex;flex-direction:column;gap:4px;padding-top:12px;border-top:1px solid var(--rule);font-size:17px;color:var(--ink)}' +
      /* 갈래 */
      '.pg-brmid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:24px;padding:24px 0}' +
      '.pg-brmid .pg-grid{flex:none;padding:0}' +
      '.pg-leadbox{display:flex;align-items:center;gap:24px;padding:20px 27px;border:1px solid color-mix(in srgb, var(--cm) 30%, #fff)}' +
      '.pg-leadbox .tx{font-size:21px;font-weight:500}.pg-leadbox .tx b{color:var(--cm)}' +
      /* 엔딩 */
      '.pg-cltitle{font-family:Archivo,Pretendard,sans-serif;font-size:56px;font-weight:200;line-height:1.08;letter-spacing:-.035em;white-space:pre-wrap}' +
      '.pg-cltitle .mut{color:var(--dim)}.pg-cltitle b{font-weight:500;color:var(--ink)}' +
      '.pg-clsub{margin-top:29px;font-size:18px;font-weight:200;line-height:1.66;color:var(--body);max-width:46ch}' +
      '.pg-clfoot{display:flex;justify-content:space-between;align-items:flex-end;gap:37px;padding-top:19px;border-top:1px solid var(--rule)}' +
      '.pg-clfoot .big{font-size:24px;font-weight:200;max-width:24ch;line-height:1.32}.pg-clfoot .big b{font-weight:600;color:var(--cm)}' +
      '.pg-clfoot .ct{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--muted);text-align:right;line-height:1.6}' +
      '.pg-clfoot .ct i{font-style:normal}' +
      '.slide.cl .pg-cvbars span{display:block}' +
      /* 마일스톤 — 전 팩 공통 */
      '.slide.pg.ms{gap:19px}' +
      '.ms-phases{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:9px;flex:none;margin-top:11px}' +
      '.ms-phase{background:color-mix(in srgb, var(--cl) 16%, #fff);padding:15px 19px;display:flex;flex-direction:column;gap:6px}' +
      '.ms-ptag{align-self:flex-start;font-family:Archivo,sans-serif;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;background:#fff;color:var(--cm)}' +
      '.ms-phase.on .ms-ptag{background:var(--cm);color:#fff}' +
      '.ms-phead{font-size:19px;font-weight:600;letter-spacing:-.02em}' +
      '.ms-ptext{font-size:13px;font-weight:300;color:var(--body);line-height:1.5}.ms-ptext b{color:var(--cm);font-weight:600}' +
      '.ms-cap{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;color:var(--cm);letter-spacing:.14em;text-transform:uppercase;flex:none}' +
      '.ms-chart{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:space-evenly;padding:4px 0 12px;overflow:hidden}' +
      '.ms-glines{position:absolute;inset:0;display:grid;grid-auto-flow:column;grid-auto-columns:1fr}' +
      '.ms-glines i{border-left:1px solid var(--rule)}' +
      '.ms-bar{position:relative;z-index:1;padding:9px 16px;display:flex;flex-direction:column;gap:2px;animation:vfu .5s both;color:#fff}' +
      '.ms-bar b{font-size:15.5px;font-weight:600;letter-spacing:-.01em}' +
      '.ms-bar span{font-size:13px;opacity:.85;font-weight:300}' +
      '.ms-axis{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;flex:none;border-top:1px solid var(--rule);padding-top:8px}' +
      '.ms-axis span{font-size:13px;color:var(--muted);text-align:center}' +
      '.ms-note{flex:none;font-size:17px;font-weight:300;border-left:3px solid var(--cm);padding:9px 0 9px 16px}.ms-note b{font-weight:600;color:var(--cm)}' +
      '@keyframes vfu{from{opacity:0}to{opacity:1}}';
  }

  function renderPastelDeck(data) {
    data = data || {};
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>' + css() + '</style></head><body>' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + '</body></html>';
  }

  /* ---- 발표 뷰어 (vjs 조작 스크립트 포함 필수) ---- */
  function renderPastelViewer(data, opts) {
    data = data || {}; opts = opts || {};
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    var vcss =
      'html,body{height:100%}body{background:#10141a;overflow:hidden}' +
      '.vwrap{position:fixed;inset:0;display:flex;justify-content:center;align-items:flex-start}' +
      '.vscale{width:var(--slide-w);height:var(--slide-h);position:relative;flex:none;transform-origin:top center}' +
      '.vscale .slide{position:absolute;inset:0;visibility:hidden;box-shadow:0 24px 80px rgba(0,0,0,.45)}' +
      '.vscale .slide.cur{visibility:visible}' +
      '.vbar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:9px 16px;border-radius:999px;background:rgba(16,20,26,.72);backdrop-filter:blur(10px);color:#fff;font-family:Pretendard,system-ui,sans-serif;font-size:13px;z-index:9;user-select:none}' +
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
      'var us=cur.querySelectorAll(' + JSON.stringify(UNIT_SEL + ',.pg-cvbars,.pg-imgph,.pg-key') + ');var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      'var cu=cur.querySelectorAll(".pg-bsval,.pg-kpval,.pg-bignum i");for(var w=0;w<cu.length;w++){(function(el){' +
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
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>' + css() + vcss + '</style></head><body>' +
      '<div class="vwrap"><div class="vscale">' + renderSlides(slides) + '</div></div>' +
      '<div class="vbar"><button class="vbtn vprev">‹</button><span class="vcount"></span><button class="vbtn vnext">›</button><button class="vbtn vfs">⛶</button></div>' +
      stateScript(slides) +
      '<scr' + 'ipt>' + vjs + '</scr' + 'ipt></body></html>';
  }

  /* ---- 카탈로그("언제 쓰나") — AI 타입 선택 기준. naver/rams와 동일 어휘 ---- */
  var CATALOG = [
    { type: 'cover', label: '표지', use: '첫 장 — 그라데이션 대형 번호·Archivo 타이틀·5색 바', needs: ['title'], opt: ['label', 'date', 'eyebrow', 'band', 'docLabel'] },
    { type: 'statement', label: '대형 선언', use: '표지 다음 선언 — 대형 영문+그라데이션 키워드+비교 카드 2', needs: ['title'], opt: ['sub', 'cols'] },
    { type: 'toc', label: '목차', use: '보고 순서 — 챕터별 그라데이션 컬럼(번호·영문 라벨·메시지)', needs: ['items'], opt: ['title'] },
    { type: 'divider', label: '간지', use: '챕터 시작 — 풀블리드 챕터 그라데이션+대형 타이틀', needs: ['title'], opt: ['no', 'lead'] },
    { type: 'section', label: '본문 표준', use: '핵심 논점 3~4개 — 대형 번호+보더탑 소제목+설명', needs: ['title', 'points'], opt: ['tag', 'sub', 'note'], cap: { points: '3~4개' } },
    { type: 'cards', label: 'N열 카드', use: '동급 항목 2~4개 — 그라데이션 톤 사다리 셀', needs: ['title', 'cards'], opt: ['tag', 'sub', 'note'], cap: { cards: '2~4개' } },
    { type: 'split', label: '좌우 대비', use: '흐린 리스트 vs 강조 리스트(활용 vs 설계 대비)', needs: ['left', 'right'], opt: ['title', 'note'] },
    { type: 'stats', label: '수치', use: '대형 그라데이션 %+진행바 — 진척도·달성률', needs: ['title'], opt: ['donut', 'bars', 'sub', 'note'] },
    { type: 'media', label: '스펙 rows', use: '구조·사양 행(라벨+내용, 핵심 행 그라데이션 강조)+이미지 슬롯', needs: ['title', 'specs'], opt: ['image', 'caption', 'sub', 'note'] },
    { type: 'roadmap', label: '로드맵', use: '단계 계획 — Now/Next/Then 3열+월별 타임라인 밴드', needs: ['title', 'steps'], opt: ['months', 'sub', 'note'], cap: { steps: '3개' } },
    { type: 'bigstat', label: '대형 수치', use: '수치 하나로 임팩트 — 그라데이션 클립 숫자', needs: ['title', 'value'], opt: ['caption', 'note'] },
    { type: 'kpi', label: 'KPI 셀', use: '지표 2~4개 — 값+라벨 그라데이션 셀', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '2~4개' } },
    { type: 'table', label: '표', use: '열이 정해진 데이터 — 보더바텀 rows', needs: ['title', 'columns', 'rows'], opt: ['sub', 'note'] },
    { type: 'timeline', label: '타임라인', use: '시간순 이벤트 — when+제목+설명 행', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '3~5개' } },
    { type: 'milestone', label: '마일스톤', use: '기간 계획 간트 — 단계 카드+월축 계단 바. 일정·완료 기준 중심일 때', needs: ['title', 'bars', 'axis'], opt: ['phases', 'caption', 'note'] },
    { type: 'process', label: '프로세스', use: '단계 흐름 3~4개 — 중앙(또는 지정) 그라데이션 강조', needs: ['title', 'steps'], opt: ['accent', 'sub', 'note'], cap: { steps: '3~4개' } },
    { type: 'compare', label: '비교', use: 'Before/After — 보더 vs 그라데이션 카드', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '2개' } },
    { type: 'quote', label: '질문/인용', use: '핵심 질문·인용 — 풀블리드 그라데이션 Q 패널', needs: ['text'], opt: ['by'] },
    { type: 'position', label: '포지셔닝', use: '흐름 3단계 중 우리 위치 — 중앙 그라데이션 카드', needs: ['title', 'panels'], opt: ['accent', 'note'], cap: { panels: '3개' } },
    { type: 'checklist', label: '체크리스트', use: '확인·항목 목록 — 대시바+보더바텀 rows. 5개 초과 시 2열', needs: ['title', 'items'], opt: ['cols', 'sub', 'note'] },
    { type: 'lineup', label: '라인업', use: '제품·계획 라인업 4개 — 진행=그라데이션·후보=보더', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '4개' } },
    { type: 'branch', label: '갈래', use: '조직·영역 3갈래+공통 리드 박스', needs: ['title', 'branches'], opt: ['lead', 'sub', 'note'], cap: { branches: '3개' } },
    { type: 'highlight', label: '하이라이트', use: '데모·발표 안내 — 풀블리드 그라데이션+대형 타이틀+단계 행', needs: ['title', 'items'], opt: ['footnote'], cap: { items: '2~3개' } },
    { type: 'board', label: '현황 보드', use: '진행 현황 — 2톤 대형 타이틀+카드 2+사이드 리스트', needs: ['title', 'cards'], opt: ['side', 'note'], cap: { cards: '2개' } },
    { type: 'closing', label: '엔딩', use: '마지막 장 — dim+강조 대형 타이틀+다음 행동+5색 바', needs: ['title'], opt: ['label', 'sub', 'nextLabel', 'contacts'] }
  ];

  var STARTERS = {
    cover: { type: 'cover', label: 'MIDAS Design AX', eyebrow: 'Small System, Big Change', date: '2026. 08', title: 'The Machine\nThat Builds\n**the Machine**', band: '자동차가 아니라, **자동차를 만드는 시스템**을 설계합니다', docLabel: '디자인 AX 보고' },
    statement: { type: 'statement', title: 'The Machine That Builds\n**Design**', sub: '좋은 디자인을 한 번 만드는 일이 아니라, 좋은 디자인이 **반복해서 생산되는 시스템**을 설계하는 일입니다.', cols: [{ tag: 'TESLA', text: '자동차 한 대 **→ 생산 시스템**' }, { tag: 'MIDAS', text: '디자인 결과물 **→ 디자인 에이전트**' }] },
    toc: { type: 'toc', title: '보고 순서', items: [{ label: 'Why Now', desc: '누구나 만드는 시대,\n차이는 **기준**에서 생깁니다', pages: '04 — 07' }, { label: 'The System', desc: '기준을 담아 실행하는\n**시스템**', pages: '08 — 11' }, { label: "What's Next", desc: '효과가 확인된\n단계부터 **넓혀갑니다**', pages: '12 — 14' }] },
    divider: { type: 'divider', title: 'Why\n**Now**', lead: '누구나 만드는 시대 — 차이는 **기준**에서 생깁니다' },
    section: { type: 'section', title: '일원화되지 않으면\n**드러나는 네 가지**', points: [{ head: '기준의 분산', text: '기준이 조직별로 나뉘어 있어 서로 다를 수 있음' }, { head: '자산의 분산', text: '검증된 자산이 각 조직에 남아 생성에 바로 적용하지 못함' }, { head: '검수의 속도', text: '생성 결과는 늘어나지만 검수는 사람이 건건이 수행' }], note: '네 가지 모두 **기준을 한곳에 모으면** 해결됩니다.' },
    cards: { type: 'cards', title: "'만드는 것'은 이제\n**누구나 할 수 있는 일**이 되었습니다", cards: [{ head: '진입장벽 하락', text: '전문 도구를 익히지 않아도 결과가 나옵니다' }, { head: '경계 축소', text: '기획 · 제작 · 개발의 구분이 통합됩니다' }, { head: '결과물 증가', text: '만드는 속도와 양이 동시에 상승합니다' }], note: '생성은 누구나 가능해졌지만, **퀄리티는 모두 같지 않습니다.**' },
    split: { type: 'split', title: 'AI 기술은 활용하고,\n**기준은 직접 설계합니다**', left: { kicker: '활용 — AI 기반 기술', items: ['기반 AI 모델', '생성 기술과 API', '기존 제작 도구'] }, right: { kicker: '설계 — 우리만의 기준', items: ['회사의 품질 기준', '조직별 디자인 자산', '조합 · 검수 · 승인 규칙'] }, note: '결과물의 **퀄리티와 일관성**은 우리 기준에서 나옵니다.' },
    stats: { type: 'stats', title: '지금 어디까지\n**와 있는가**', donut: { pct: 30, label: 'MVP 기준', caption: '전체 진척도' }, bars: [{ label: 'Platform · Flow', pct: 65, text: '시연 가능한 프로토타입' }, { label: 'Design Pack · 품질 체계', pct: 20, on: true, text: '구조 정의 완료 · 자산 구축 단계' }, { label: '실업무 검증', pct: 10, text: '초기 검증 단계' }], note: '플랫폼이 아니라 **기준과 자산**이 퀄리티를 결정합니다.' },
    media: { type: 'media', title: '구조가 **작동하는 것**까지\n확인했습니다', specs: [{ label: 'Input', text: '기획 · 요구사항' }, { label: 'Engine', text: 'Generator — Page · Section · Variant 조합', on: true }, { label: 'Builder', text: 'Edit · Preview · Export' }, { label: 'Output', text: '수정 가능한 웹사이트' }], note: '현재 **이 구조가 작동하는 것**까지 확인했습니다.' },
    roadmap: { type: 'roadmap', title: '효과가 확인된 단계부터\n**넓혀갑니다**', steps: [{ when: 'Now', head: 'Prototype', items: ['Flow 안정화', 'Design Pack 제작', 'Demo 품질 확보'], state: 'now' }, { when: 'Next', head: 'Working Tool', items: ['실제 프로젝트 적용', '품질 기준 검증', '2차 Agent 선정'] }, { when: 'Then', head: 'System', items: ['반복 사용 확인', 'Pack 확대', '전사 연계 검토'] }], months: [{ when: '8월', text: '기준 · 자산 정의' }, { when: '9월', text: '실무 파일럿' }, { when: '10월', text: '품질 검증' }, { when: '11월', text: '적용 확대' }] },
    bigstat: { type: 'bigstat', title: '핵심 수치', value: '30%', caption: '**MVP 기준 진척도** — 구조 정의를 마치고 자산 구축 단계입니다', note: '수치의 **근거**를 함께 제시하세요.' },
    kpi: { type: 'kpi', title: '핵심 지표', items: [{ value: '65%', label: 'Platform' }, { value: '20%', label: 'Design Pack', tone: 'on' }, { value: '10%', label: '실업무 검증' }], note: '핵심 지표를 **한눈에** 정리합니다.' },
    table: { type: 'table', title: '표', columns: ['구분', '내용', '비고'], rows: [{ cells: ['첫 행', '내용', '—'] }, { cells: ['둘째 행', '내용', '—'] }] },
    timeline: { type: 'timeline', title: '진행 경과', items: [{ when: '2026. 06', head: '구조 설계', text: '핵심 구조와 계약 정의' }, { when: '2026. 07', head: '프로토타입', text: '생성 플로우 작동 확인', on: true }, { when: '2026. 08', head: '파일럿', text: '실무 적용 개시' }] },
    milestone: { type: 'milestone', title: '월별 **완료 기준**', phases: [{ tag: '현재', head: '준비', text: '기준 · 자산 정의' }, { tag: '다음', head: '적용', text: '실무 파일럿', on: true }], caption: '월별 완료 기준', bars: [{ label: '기준 정의', sub: '8월 — 자산 최초 정의', start: 1, span: 2 }, { label: '파일럿', sub: '9월 — 실무 적용', start: 2, span: 2 }, { label: '검증 · 확대', sub: '10월 — 품질 검증', start: 3, span: 2 }], axis: ['8월', '9월', '10월', '11월'] },
    process: { type: 'process', title: '하나의 결과물이 만들어지는\n**세 단계**', steps: [{ tag: '1단계 · 기획', head: '기획\nAgent', text: '목적 · 요구사항 · 구조를 정의' }, { tag: '2단계 · 디자인', head: '디자인\nAgent', text: 'UX·UI 기준으로 화면을 구현' }, { tag: '3단계 · 개발', head: '개발\nAgent', text: '코드 구현 · 배포' }], note: '같은 구조라도 **무엇을 탑재하느냐**에 따라 결과가 달라집니다.' },
    compare: { type: 'compare', title: '무엇이 **달라지는가**', items: [{ head: 'Before', items: ['담당자별 개인 파일 · 설정', '반복 설정을 매번 수작업', '버전이 바뀌면 재작업'] }, { head: 'After', items: ['공통 입력 규격', '표준 Workflow가 반복 처리', '자막 · 버전 · 포맷 자동 생성'] }], note: '반복 공정이 **표준 Workflow**로 바뀝니다.' },
    quote: { type: 'quote', text: '무엇이 **좋은 결과**인지\n누가, 어떤 기준으로\n판단할 것인가?', by: 'The Question' },
    position: { type: 'position', title: '흐름 속\n**우리 위치**', panels: [{ tag: '1 · 이전', head: '이전 단계', text: '설명' }, { tag: '2 · 우리', head: '**우리 위치**', text: '핵심 역할 설명' }, { tag: '3 · 다음', head: '다음 단계', text: '설명' }] },
    checklist: { type: 'checklist', title: '체크리스트', items: ['확인 항목을 입력하세요', '확인 항목을 입력하세요', '확인 항목을 입력하세요'] },
    lineup: { type: 'lineup', title: '업무별 구성\n**Line-up**', items: [{ tag: 'Product / Web', head: 'Web Generator', badge: '현재 프로토타입', text: '기획 입력 → 생성 → 수정 · 출력' }, { tag: 'Motion', head: 'Motion Workflow', badge: '일부 실사용', text: '반복 편집 · 버전 · 포맷 제작' }, { tag: 'Visual / BX', head: 'Visual Generator', badge: '후보', state: 'dim', text: '행사 · 캠페인 자산' }, { tag: 'Presentation', head: 'Presentation Agent', badge: '후보', state: 'dim', text: '발표자료 초안 · 검수' }], note: '**효과와 반복성이 큰 순서**로 구체화합니다.' },
    branch: { type: 'branch', title: '디자인 업무는\n**전 영역**에 걸쳐 있습니다', branches: [{ label: 'ExD팀', head: '전사 행사 · 브랜드', text: '전사 기준과 제작 방식 축적' }, { label: '사업 추진실', head: '상품 MBM · 행사', text: '사업 특성에 맞춘 자산 제작' }, { label: '상품개발조직', head: '상품 UI · UX', text: '컴포넌트와 UI 체계 운영' }], lead: { label: '새로 필요한 것', text: '세 영역이 함께 참조할 **기준과 자산**' }, note: 'AI 도입으로 기준과 자산의 **일원화가 실질적 과제**가 되었습니다.' },
    highlight: { type: 'highlight', title: 'Live\n**Demo**', items: [{ head: 'AX Web Generator', text: '기획 입력 → 웹 생성 → Builder 수정 → Export' }, { head: 'Motion Workflow', text: '실작동 영상 재생' }], footnote: '' },
    board: { type: 'board', title: '__Running Today.__\n**Building Next.**', cards: [{ tag: '01 · Product / Web', head: 'AX Web Generator', text: '생성 플로우 작동 확인' }, { tag: '02 · Motion', head: 'Motion Workflow', text: '반복 공정 표준화' }], side: { title: '병행한 현업 — 최근 6개월', items: ['핵심 상품 UX · 화면 제작', '전사 행사 · 사업 MBM', '영상 콘텐츠 제작'], pills: ['MIDAS WEEK', 'ONSITE UX·UI'] }, note: '진행 중인 **두 가지**를 순서대로 말씀드리겠습니다.' },
    closing: { type: 'closing', label: 'From Prototype to System', title: '__The Machine That Builds Design__\n**has started running.**', sub: '첫 번째 에이전트가 작동하는 것까지 확인했습니다. 기준과 자산을 담는 일은 이제 시작입니다.', nextLabel: '기준을 담는 만큼 **결과가 달라집니다**', contacts: [{ v: 'Design Pack 제작 · 2차 Agent 선정' }, { v: '파일럿 테스트 · 적용 프로젝트 확정' }] }
  };

  var SCHEMA_DOC = CATALOG.map(function (c) {
    return c.type + '(' + c.label + '): ' + c.use;
  }).join('\n');
  var FIELD_DOC =
    'cover:{label?(좌상 로고명),date?,eyebrow?(하단 영문 밴드),title(**강조**=500, \\n 2~3줄),band?(리드 문장, **강조**),docLabel?(하단 문서명)} | ' +
    'statement:{title(영문 대형, **키워드**=그라데이션),sub?(**강조**),cols?:[{tag,text("A **→ B**")}](2개)} | ' +
    'toc:{title?,items:[{no?,label(영문 챕터명),desc(한 줄 메시지, **강조**, \\n 가능),pages?:"04 — 07"}](3~5개)} | ' +
    'divider:{no?:"01",title(영문 2줄 \\n, 둘째 줄 **굵게**),lead(한 문장, **강조**)} | ' +
    'section:{title,points:[{no?,head,text}](3~4개),tag?,sub?(보조 리드),note?(키밴드 문장, **강조**)} | ' +
    'cards:{title,cards:[{head,text?,tag?,tone?:"dark"(강조 셀)}](2~4개),sub?,note?} | ' +
    'split:{title?,left:{kicker,items:[str],foot?},right:{kicker,items:[str],foot?},note?} — 좌 흐림/우 강조 | ' +
    'stats:{title,donut?:{pct:0~100,label?,caption?},bars?:[{label,pct:0~100,value?,on?:true(강조 행),text?}],sub?,note?} | ' +
    'media:{title,specs:[{label(짧은 영문),text,on?:true(그라데이션 강조 행)}](3~5개),image?:{label},caption?,sub?,note?} | ' +
    'roadmap:{title,steps:[{when:"Now|Next|Then",head,items:[str],state?:"now"}](3개),months?:[{when:"8월",text}](4~5개 하단 밴드),sub?,note?} | ' +
    'bigstat:{title,value,caption?(**강조**),note?} | ' +
    'kpi:{title,items:[{value,label,desc?,tone?:"on"}](2~4개),sub?,note?} | ' +
    'table:{title,columns:[str],rows:[{cells:[str]}],sub?,note?} | ' +
    'timeline:{title,items:[{when,head,text?,on?:true}](3~5개),sub?,note?} | ' +
    'milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | ' +
    'process:{title,steps:[{tag:"1단계 · 기획"류,head(\\n 2줄 가능),text?}](3~4개),accent?:강조 인덱스(기본 중앙),sub?,note?} | ' +
    'compare:{title,items:[{head:"Before|After",items:[str]}](2개),sub?,note?} | ' +
    'quote:{text(질문·인용, **강조**, \\n 줄바꿈),by?(라벨)} | ' +
    'position:{title,panels:[{tag,head(**굵게**),text?}](3개),accent?,note?} | ' +
    'checklist:{title,items:[str],cols?:1~2,sub?,note?} | ' +
    'lineup:{title,items:[{tag(분야),head(이름),text,badge?(상태),state?:"dim"(후보)}](4개),sub?,note?} | ' +
    'branch:{title,branches:[{label(조직명),head(역할),text}](3개),lead?:{label,text(**굵게**)},sub?,note?} | ' +
    'highlight:{title(영문 대형 \\n, **강조**),items:[{no?,head,text?}](2~3개),footnote?} | ' +
    'board:{title(2톤: __흐림__+**강조**),cards:[{tag:"01 · 분야",head,text?}](2개),side?:{title,items:[str],pills?:[str]},note?} | ' +
    'closing:{label?,title(2톤: __흐림__ 줄+**강조** 줄),sub?,nextLabel?(**강조**=챕터색),contacts?:[{v}](우하단 2줄)}' +
    '\n규칙: note=하단 키밴드 문장(장당 1개, **강조** 1회) — 본문 장엔 적극 넣는다. 챕터 컬러는 간지 순서로 자동(블루→틸→그린→코랄→딥블루). ' +
    'title은 의미 단위 \\n 줄바꿈. 이모지 금지.';

  var DEFAULT_DECK = {
    style: 'pastel',
    slides: [
      STARTERS.cover, STARTERS.statement, STARTERS.toc,
      STARTERS.divider, STARTERS.cards, STARTERS.quote,
      { type: 'divider', title: 'The\n**System**', lead: '기준을 담아 실행하는 구조' },
      STARTERS.branch, STARTERS.lineup, STARTERS.stats,
      { type: 'divider', title: "What's\n**Next**", lead: '효과가 확인된 단계부터 **넓혀갑니다**' },
      STARTERS.roadmap, STARTERS.closing
    ]
  };

  function pastelTemplateDeck() {
    var slides = CATALOG.map(function (c) {
      return JSON.parse(JSON.stringify(STARTERS[c.type]));
    });
    return { slides: slides, style: 'pastel' };
  }

  /* ---- 결정론 폴백 — AI 실패 시 브리프 키워드로 조립 ---- */
  function pastelComposeDeck(brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || '보고';
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 5);
    var slides = [{ type: 'cover', label: 'MIDAS Design AX', eyebrow: 'REPORT', title: title, band: brief.message || '', docLabel: brief.audience || '' }];
    if (outline.length > 1) slides.push({ type: 'toc', title: '보고 순서', items: outline.map(function (o) { return { label: o, desc: '' }; }) });
    outline.forEach(function (o, i) {
      slides.push({ type: 'divider', title: o, lead: '' });
      slides.push(JSON.parse(JSON.stringify(i % 2 ? STARTERS.cards : STARTERS.section)));
    });
    slides.push(JSON.parse(JSON.stringify(STARTERS.closing)));
    return { slides: slides, style: 'pastel' };
  }

  window.renderPastelDeck = renderPastelDeck;
  window.renderPastelViewer = renderPastelViewer;
  window.pastelTemplateDeck = pastelTemplateDeck;
  window.PASTEL_SCHEMA_DOC = SCHEMA_DOC;
  window.PASTEL_FIELD_DOC = FIELD_DOC;
  window.pastelComposeDeck = pastelComposeDeck;
  window.PASTEL_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.PASTEL_MV_SEL = MV_SEL;
  window.PASTEL_DEFAULT_DECK = DEFAULT_DECK;
  window.PASTEL_CATALOG = CATALOG;
  window.PASTEL_STYLE = { id: 'pastel', name: 'Pastel Gradient', desc: '화이트 · 챕터 그라데이션 · 키밴드 · 16:9', swatch: 'linear-gradient(135deg,#8CD4F5 0%,#0F7FC7 35%,#0E9E8F 60%,#F0546B 100%)' };
  window.PASTEL_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.pastelNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.section)); };
})();
