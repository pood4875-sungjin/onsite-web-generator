/* packs.sfmi.js — "SFMI Report" PPT 팩 (디자인AX 보고 — SFMI/SFMI Multi 실측)
   소스: ~/Downloads/삼성화재_파스텔_01/디자인AX 보고 - SFMI(Multi).dc.html (1920×1080 → ×0.6667)
   시스템: 화이트/아이스 교대 지면 + 래디얼 시안 커버 + skewX(-38deg) 대시 + 원(circle) 모티프(그라데이션 원·벤·링 도넛·점선 후보 원)
   + 아웃라인 스트로크 대문자 간지 + 하단 풋라인(대시+문장). 챕터 컬러 5종은 Multi 팔레트(시안→틸→블루→코랄→딥블루).
   타이포: 국문 Pretendard 44px w200/600, 영문 Archivo 200↔500. 계약: naver/rams/pastel과 동일 타입 어휘. */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<span class="mut">$1</span>'); }
  function de(path) { return ' data-edit="' + path + '"'; }
  function noNum(t) { t = String(t == null ? '' : t); var m = t.trim(); return /^\d{1,2}\s*[.)·:]?$/.test(m) ? '' : t.replace(/^\s*\d{1,2}\s*[.)·:]\s+/, ''); }
  /* 타이틀 강약 폴백 — **가 없으면 멀티라인=마지막 줄, 한 줄=뒤 40% 어절 자동 볼드 */
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

  /* ---- 챕터 컬러 5종 (SFMI Multi 실측: 대시·오프너·원 그라데이션) ---- */
  var CH = [
    { m: '#55D0E4', l: '#9CE3F0', d: '#2476A6', ink: '#0A5B72', tx: '#0BA1B0' },
    { m: '#3EC6C2', l: '#8FE7E0', d: '#0A6E63', ink: '#0A5B4F', tx: '#0E9E8F' },
    { m: '#2EA3D4', l: '#9CE3F0', d: '#134E70', ink: '#123C55', tx: '#2476A6' },
    { m: '#FF6E7A', l: '#FFB2B8', d: '#C24C58', ink: '#8F3F2C', tx: '#E2606C' },
    { m: '#2476A6', l: '#8FC4E6', d: '#1A5F8C', ink: '#0F3F72', tx: '#2476A6' }
  ];
  var RADIAL = 'radial-gradient(120% 96% at 62% 104%, #E8F6FB 0%, #BEE6F2 26%, #7ECFE5 56%, #4FC6DF 82%, #3FB6D6 100%)';   // 커버·엔딩·하이라이트
  function chOf(ctx) {
    var idx = 0;
    if (ctx && ctx.chapters) for (var i = 0; i < ctx.chapters.length; i++) if (ctx.chapters[i].at <= ctx.no) idx = i + 1;
    return CH[Math.max(0, (idx - 1 + CH.length) % CH.length)];
  }
  function chv(c) { return '--cm:' + c.m + ';--cl:' + c.l + ';--cd:' + c.d + ';--cink:' + c.ink + ';--ctx:' + c.tx; }
  /* 본문 지면 교대 — 원본 리듬(흰/아이스 #F1FBFE) 재현: 짝수 장 아이스 */
  function tintOf(ctx) { return ctx && ctx.no % 2 === 0 ? ' tint' : ''; }
  /* 원 그라데이션 톤 사다리 — 마지막(on)=주→딥 화이트 */
  function crcTone(i, n, on) {
    if (on || i === n - 1) return 'background:linear-gradient(200deg,var(--cm) 0%,var(--cd) 100%);color:#fff';
    if (i === 0) return 'background:linear-gradient(200deg,color-mix(in srgb, var(--cl) 40%, #fff) 0%,var(--cl) 100%);color:var(--cink)';
    return 'background:linear-gradient(200deg,var(--cl) 0%,var(--cm) 100%);color:var(--cink)';
  }

  /* ---- 공통 조각 ---- */
  function dash(w) { return '<span class="sf-dash" style="width:' + (w || 17) + 'px"></span>'; }
  function runhead(s, P, ctx, white) {
    var ch = ctx && ctx.chapterOf ? ctx.chapterOf(ctx.no) : null;
    var di = ctx && ch ? (ctx.chapters.indexOf(ch) + 1) : 0;
    var left = s.kicker != null ? s.kicker : (ch ? 'Chapter ' + di + '. ' + ch.title + (s.tag ? ' · ' + s.tag : '') : (s.tag || ''));
    var pg = (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '');
    return '<div class="sf-run' + (white ? ' wh' : '') + '"><span class="sf-runl">' + dash() + '<i' + de(P + '.kicker') + '>' + esc(left) + '</i></span>' +
      '<span class="sf-runr">' + pg + '</span></div>';
  }
  function headline(s, P) {
    return '<h2 class="sf-hl"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>';
  }
  function sub(s, P) {
    return s.sub ? '<p class="sf-sub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '';
  }
  /* 하단 풋라인 — 보더탑 + 대시바 + 문장(**=500 잉크) */
  function footline(s, P) {
    if (!s.note) return '';
    return '<div class="sf-foot"><span class="sf-fdash"></span><span class="sf-ftx"' + de(P + '.note') + '>' + mb(s.note) + '</span></div>';
  }
  function label(t, P, cls) { return '<span class="sf-lab' + (cls ? ' ' + cls : '') + '"' + (P ? de(P) : '') + '>' + esc(t || '') + '</span>'; }
  function kind(s, d) { return esc(s.kindLabel || d); }
  function diagLine() { return '<svg class="sf-diag" viewBox="0 0 1280 720" preserveAspectRatio="none"><line x1="191" y1="587" x2="1080" y2="100" stroke="#FFFFFF" stroke-width="1.5" opacity=".4"/></svg>'; }

  /* ---- 타입 렌더러 ---- */
  var R = {
    /* 표지 — 래디얼 시안 + 사선 + skew 대시 로고 + Archivo 대형 2톤. 원본 01 */
    cover: function (s, P, ctx) {
      return '<section class="slide sf cv" data-kind="' + kind(s, 'Cover') + '" style="' + chv(CH[0]) + ';background:' + RADIAL + '">' + diagLine() +
        '<div class="sf-cvtop"><span class="sf-cvlogo">' + dash(20) + '<span class="tx"><i' + de(P + '.label') + '>' + esc(s.label || 'MIDAS Design AX') + '</i><em' + de(P + '.docLabel') + '>' + esc(s.docLabel || '') + '</em></span></span>' +
        '<span class="sf-cvpg"' + de(P + '.eyebrow') + '>' + esc(s.eyebrow || 'Prologue — 01') + '</span></div>' +
        '<div class="sp"></div>' +
        '<h1 class="sf-cvtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.band ? '<p class="sf-cvlead"' + de(P + '.band') + '>' + mb(s.band) + '</p>' : '') +
        '<div class="sp"></div>' +
        '<div class="sf-cvfoot"><span' + de(P + '.date') + '>' + esc(s.date || '') + '</span><span>MIDAS GROUP</span></div></section>';
    },
    /* 대형 선언 — 좌 리드(대시바) / 우 Archivo 대형 + 하단 보더탑 비교 2열. 원본 02 */
    statement: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cols.' + i;
        return '<div class="sf-stcol">' + label(c.tag, IP + '.tag', 'up') +
          '<span class="sf-sttx"' + de(IP + '.text') + '>' + mb(c.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide sf st tint" data-kind="' + kind(s, 'Statement') + '" style="' + chv(CH[0]) + '">' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'Starting Point' }, P, ctx) +
        '<div class="sf-stmid"><div class="sf-stl"><span class="sf-bar"></span>' +
        (s.sub ? '<p class="sf-stlead"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') + '</div>' +
        '<h1 class="sf-sttitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1></div>' +
        (cols ? '<div class="sf-stcols">' + cols + '</div>' : '') + '</section>';
    },
    /* 목차 — 2열, 챕터 헤더(대시+보더바텀)+페이지 행. 원본 03 */
    toc: function (s, P, ctx) {
      var items = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="sf-toc"><span class="sf-tochead">' + dash(13) + '<i' + de(IP + '.label') + '>' + esc(it.label || '') + '</i></span>' +
          '<div class="sf-tocrow"><span class="no"' + de(IP + '.pages') + '>' + esc(it.pages || (it.no || (i < 9 ? '0' : '') + (i + 1))) + '</span>' +
          '<span class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</span></div></div>';
      }).join('');
      return '<section class="slide sf tc" data-kind="' + kind(s, 'Contents') + '" style="' + chv(CH[0]) + '">' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'MIDAS Design AX — Report' }, P, ctx) +
        '<h2 class="sf-tctitle"' + de(P + '.title') + '>' + esc(s.title || 'Contents') + '</h2>' +
        '<div class="sf-tocgrid">' + items + '</div></section>';
    },
    /* 간지 — 좌 챕터 그라데이션 패널(번호+아웃라인 스트로크 대문자) / 우 국문 리드. 원본 04 */
    divider: function (s, P, ctx) {
      var idx = ctx && ctx.dividerIndex ? ctx.dividerIndex(ctx.no) : 0;
      var c = CH[idx % CH.length];
      var strokeTitle = esc(String(s.title || '').replace(/\*\*/g, '')).replace(/\n/g, '<br>');
      return '<section class="slide sf dv" data-kind="' + kind(s, 'Divider') + '" style="' + chv(c) + '">' +
        '<div class="sf-dvl" style="background:linear-gradient(200deg,' + c.l + ' 0%,' + c.m + ' 46%,' + c.d + ' 100%)">' +
        '<div class="sf-dvno"><b' + de(P + '.no') + '>' + esc(s.no || '0' + (idx + 1)) + '</b><i' + de(P + '.title') + '>' + strokeTitle.replace(/<br>/g, ' ') + '</i></div>' +
        '<span class="sf-dvstroke">' + strokeTitle + '</span></div>' +
        '<div class="sf-dvr">' + runhead({ kicker: 'Chapter ' + (idx + 1) }, P, ctx) +
        '<div class="sf-dvmid">' +
        (s.lead ? '<h2 class="sf-dvlead"' + de(P + '.lead') + '>' + mb(emph(s.lead)) + '</h2>' : '') +
        (s.text ? '<p class="sf-dvtx"' + de(P + '.text') + '>' + mb(s.text) + '</p>' : '') + '</div></div></section>';
    },
    /* 본문 표준 — N열 원 넘버(틴트 원, 마지막 그라데이션)+보더바텀 소제목+설명. 원본 09 */
    section: function (s, P, ctx) {
      var c = chOf(ctx), pts = (s.points || []).slice(0, 4);
      var body = pts.map(function (p, i) {
        var IP = P + '.points.' + i, on = i === pts.length - 1 && pts.length > 2;
        return '<div class="sf-num"><span class="sf-numc"' + (on ? ' style="background:linear-gradient(200deg,var(--cm) 0%,var(--cd) 100%);color:#fff"' : '') + '><i' + de(IP + '.no') + '>' + esc(p.no || '0' + (i + 1)) + '</i></span>' +
          '<span class="sf-numhead"' + de(IP + '.head') + '>' + esc(noNum(p.head) || '') + '</span>' +
          (p.text ? '<p class="sf-numtx"' + de(IP + '.text') + '>' + mb(p.text) + '</p>' : '') + '</div>';
      }).join('');
      if (!pts.length && s.text) body = '<p class="sf-body"' + de(P + '.text') + '>' + mb(s.text) + '</p>';
      return '<section class="slide sf sc' + tintOf(ctx) + '" data-kind="' + kind(s, 'Section') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-numgrid c' + Math.min(Math.max(pts.length, 1), 4) + '">' + body + '</div>' + footline(s, P) + '</section>';
    },
    /* N열 원 카드 — 그라데이션 원 + 아래 설명. 원본 06 */
    cards: function (s, P, ctx) {
      var c = chOf(ctx), n = (s.cards || []).length || 3;
      var cells = (s.cards || []).map(function (it, i) {
        var IP = P + '.cards.' + i;
        return '<div class="sf-crccard"><div class="sf-crc" style="' + crcTone(i, n, it.tone === 'dark') + '">' +
          '<span class="hd"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.tag ? '<span class="tg"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') + '</div>' +
          (it.text ? '<p class="sf-crctx"' + de(IP + '.text') + '>' + mb(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide sf cd' + tintOf(ctx) + '" data-kind="' + kind(s, 'Cards') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-crcgrid c' + Math.min(n, 4) + '">' + cells + '</div>' + footline(s, P) + '</section>';
    },
    /* 좌우 대비 — 흐린 리스트 vs 강조 리스트(skew 대시). 원본 07 우측부 */
    split: function (s, P, ctx) {
      var c = chOf(ctx);
      function half(h, HP, on) {
        h = h || {};
        var rows = (h.items || []).map(function (t, i) {
          return '<li class="' + (on ? 'on' : '') + '">' + (on ? dash(13) : '') + '<span' + de(HP + '.items.' + i) + '>' + mb(t) + '</span></li>';
        }).join('');
        return '<div class="sf-half">' + label(h.kicker, HP + '.kicker', on ? 'up acc' : 'up') +
          '<ul class="sf-list">' + rows + '</ul>' +
          (h.foot ? '<span class="sf-hfoot"' + de(HP + '.foot') + '>' + mb(h.foot) + '</span>' : '') + '</div>';
      }
      return '<section class="slide sf sp2' + tintOf(ctx) + '" data-kind="' + kind(s, 'Split') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) +
        (s.title ? headline(s, P) : '') +
        '<div class="sf-splitgrid">' + half(s.left, P + '.left', false) + half(s.right, P + '.right', true) + '</div>' + footline(s, P) + '</section>';
    },
    /* 수치 — 링 도넛 svg 그리드(on=대형 중앙). 원본 17 */
    stats: function (s, P, ctx) {
      var c = chOf(ctx);
      var barsArr = (s.bars || []).slice(0, 3);
      if (!barsArr.length && s.donut) barsArr = [{ label: s.donut.label || '', pct: s.donut.pct || 0, on: true, text: s.donut.caption || '' }];
      function ring(b, IP, on) {
        var sz = on ? 280 : 200, r = sz / 2 - (on ? 19 : 13), cx = sz / 2, circ = 2 * Math.PI * r;
        var pct = Math.max(0, Math.min(100, +b.pct || 0));
        return '<div class="sf-ring' + (on ? ' on' : '') + '"><svg class="sf-ringsvg" viewBox="0 0 ' + sz + ' ' + sz + '" style="width:' + sz + 'px;height:' + sz + 'px">' +
          '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + (on ? 'color-mix(in srgb, var(--cl) 40%, #fff)' : '#E4E9EC') + '" stroke-width="' + (on ? 19 : 13) + '"/>' +
          '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="var(--cm)" stroke-width="' + (on ? 19 : 13) + '" stroke-linecap="butt" stroke-dasharray="' + (circ * pct / 100).toFixed(1) + ' ' + circ.toFixed(1) + '" transform="rotate(-90 ' + cx + ' ' + cx + ')"/>' +
          '<text x="' + cx + '" y="' + (cx + (on ? 14 : 10)) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-weight="300" font-size="' + (on ? 49 : 35) + '" fill="#2C2E35"><tspan' + '>' + pct + '%</tspan></text></svg>' +
          '<span class="lb"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span>' +
          (b.text ? '<span class="tx"' + de(IP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }
      var onIdx = barsArr.findIndex(function (b) { return b.on; }); if (onIdx < 0) onIdx = Math.floor(barsArr.length / 2);
      var rings = barsArr.map(function (b, i) { return ring(b, P + '.bars.' + i, i === onIdx); }).join('');
      return '<section class="slide sf stt' + tintOf(ctx) + '" data-kind="' + kind(s, 'Stats') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-ringrow n' + barsArr.length + '">' + rings + '</div>' + footline(s, P) + '</section>';
    },
    /* 스펙 rows — 라벨 열 + 내용, on=그라데이션 풀행. 원본 14 */
    media: function (s, P, ctx) {
      var c = chOf(ctx);
      var rows = (s.specs || []).map(function (sp, i) {
        var IP = P + '.specs.' + i;
        return '<div class="sf-srow' + (sp.on ? ' on' : '') + '">' +
          '<span class="k"' + de(IP + '.label') + '>' + esc(sp.label || '') + '</span>' +
          '<span class="t"' + de(IP + '.text') + '>' + mb(sp.text || '') + '</span></div>';
      }).join('');
      var img = s.image ? '<div class="sf-imgcol"><div class="sf-imgph s-imgwrap" data-img="media"><span' + de(P + '.image.label') + '>' + esc(s.image.label || '이미지') + '</span></div>' +
        (s.caption ? '<span class="sf-cap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div>' : '';
      return '<section class="slide sf md' + tintOf(ctx) + '" data-kind="' + kind(s, 'Media') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-mdgrid' + (img ? ' hasimg' : '') + '"><div class="sf-srows">' + rows + '</div>' + img + '</div>' + footline(s, P) + '</section>';
    },
    /* 로드맵 — 상단 chevron 월 밴드 + 3열 Now/Next/Then. 원본 18 */
    roadmap: function (s, P, ctx) {
      var c = chOf(ctx);
      var chev = '';
      if (s.months && s.months.length) {
        var ms = s.months.slice(0, 5);
        var per = Math.ceil(ms.length / 3);
        var segs = [ms.slice(0, per), ms.slice(per, per * 2), ms.slice(per * 2)].filter(function (x) { return x.length; });
        chev = '<div class="sf-chevrow">' + segs.map(function (grp, gi) {
          var tone = gi === 0 ? 'background:linear-gradient(90deg,var(--ctx) 0%,var(--cm) 100%);color:#fff' : gi === 1 ? 'background:color-mix(in srgb, var(--cl) 55%, #fff);color:var(--cink)' : 'background:#DCE6EA;color:#6E7378';
          return '<div class="sf-chev" style="' + tone + '">' + grp.map(function (m) {
            var mi = s.months.indexOf(m), IP = P + '.months.' + mi;
            return '<span class="mi"><b' + de(IP + '.when') + '>' + esc(m.when || '') + '</b><i' + de(IP + '.text') + '>' + esc(m.text || '') + '</i></span>';
          }).join('') + '</div>';
        }).join('') + '</div>';
      }
      var steps = (s.steps || []).slice(0, 3).map(function (st, i) {
        var IP = P + '.steps.' + i, now = st.state === 'now' || i === 0;
        var lis = (st.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="sf-rmcol' + (now ? ' now' : '') + '">' + label(st.when || ['Now', 'Next', 'Then'][i], IP + '.when', 'up' + (now ? ' acc' : '')) +
          '<span class="sf-rmhead"' + de(IP + '.head') + '>' + esc(st.head || '') + '</span>' +
          '<ul class="sf-rmlist">' + lis + '</ul></div>';
      }).join('');
      return '<section class="slide sf rm' + tintOf(ctx) + '" data-kind="' + kind(s, 'Roadmap') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        chev + '<div class="sf-rmgrid">' + steps + '</div>' + footline(s, P) + '</section>';
    },
    /* 단일 대형 수치 — 대형 그라데이션 원 안 값. */
    bigstat: function (s, P, ctx) {
      var c = chOf(ctx);
      return '<section class="slide sf bs' + tintOf(ctx) + '" data-kind="' + kind(s, 'BigStat') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="sf-bsmid"><div class="sf-bscrc" style="background:linear-gradient(200deg,var(--cl) 0%,var(--cm) 48%,var(--cd) 100%)">' +
        '<span class="v"' + de(P + '.value') + '>' + esc(s.value || '') + '</span></div>' +
        (s.caption ? '<span class="sf-bscap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div>' + footline(s, P) + '</section>';
    },
    /* KPI — 미니 원(틴트, on=그라데이션) + 값. */
    kpi: function (s, P, ctx) {
      var c = chOf(ctx), n = (s.items || []).length || 3;
      var cells = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, on = it.tone === 'on';
        return '<div class="sf-kp"><span class="sf-kpc"' + (on ? ' style="background:linear-gradient(200deg,var(--cm) 0%,var(--cd) 100%);color:#fff"' : '') + '><i' + de(IP + '.value') + '>' + esc(it.value || '') + '</i></span>' +
          '<span class="lb"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          (it.desc ? '<span class="ds"' + de(IP + '.desc') + '>' + mb(it.desc) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide sf kp' + tintOf(ctx) + '" data-kind="' + kind(s, 'KPI') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-kpgrid c' + Math.min(n, 4) + '">' + cells + '</div>' + footline(s, P) + '</section>';
    },
    /* 표 — 보더바텀 rows. */
    table: function (s, P, ctx) {
      var c = chOf(ctx), nc = (s.columns || []).length || 3;
      var head = '<div class="sf-tbrow hd" style="--tbc:' + nc + '">' + (s.columns || []).map(function (cc, i) { return '<span' + de(P + '.columns.' + i) + '>' + esc(cc) + '</span>'; }).join('') + '</div>';
      var rows = (s.rows || []).map(function (r, ri) {
        return '<div class="sf-tbrow" style="--tbc:' + nc + '">' + (r.cells || []).map(function (cc, ci) { return '<span' + (ci === 0 ? ' class="f"' : '') + de(P + '.rows.' + ri + '.cells.' + ci) + '>' + mb(cc) + '</span>'; }).join('') + '</div>';
      }).join('');
      return '<section class="slide sf tb' + tintOf(ctx) + '" data-kind="' + kind(s, 'Table') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-tbl">' + head + rows + '</div>' + footline(s, P) + '</section>';
    },
    /* 타임라인 — when(Archivo 챕터색)+head+text rows. */
    timeline: function (s, P, ctx) {
      var c = chOf(ctx);
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="sf-trow' + (it.on ? ' on' : '') + '">' +
          '<span class="w"' + de(IP + '.when') + '>' + esc(it.when || '') + '</span>' +
          '<span class="h"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide sf tl' + tintOf(ctx) + '" data-kind="' + kind(s, 'Timeline') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-trows">' + rows + '</div>' + footline(s, P) + '</section>';
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
      return '<section class="slide sf ms" data-kind="' + kind(s, 'Milestone') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) +
        (phases ? '<div class="ms-phases">' + phases + '</div>' : '') +
        (s.caption ? '<span class="ms-cap"' + de(P + '.caption') + '>' + esc(s.caption) + '</span>' : '') +
        '<div class="ms-chart">' + gl + mbars + '</div>' + ax +
        (s.note ? '<p class="ms-note"' + de(P + '.note') + '>' + mb(s.note) + '</p>' : '') + '</section>';
    },
    /* 프로세스 — 원 소→대(그라데이션)→소 + 화살표. 원본 11 */
    process: function (s, P, ctx) {
      var c = chOf(ctx), steps = (s.steps || []).slice(0, 4);
      var accent = s.accent != null ? +s.accent : Math.floor(steps.length / 2);
      var cols = steps.map(function (st, i) {
        var IP = P + '.steps.' + i, on = i === accent;
        var crc = '<div class="sf-pcc' + (on ? ' on' : '') + '"' + (on ? ' style="background:linear-gradient(196deg,var(--cl) 0%,var(--cm) 42%,var(--cd) 100%)"' : '') + '>' +
          label(st.tag, IP + '.tag', on ? 'up wh' : 'up') +
          '<span class="hd"' + de(IP + '.head') + '>' + mb(noNum(st.head) || '') + '</span>' +
          (on && st.text ? '<span class="tx"' + de(IP + '.text') + '>' + mb(st.text) + '</span>' : '') + '</div>';
        var below = !on && st.text ? '<p class="sf-pctx"' + de(IP + '.text') + '>' + mb(st.text) + '</p>' : '';
        return '<div class="sf-pcol">' + crc + below + '</div>' + (i < steps.length - 1 ? '<span class="sf-arr">→</span>' : '');
      }).join('');
      return '<section class="slide sf pc' + tintOf(ctx) + '" data-kind="' + kind(s, 'Process') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-pcrow">' + cols + '</div>' + footline(s, P) + '</section>';
    },
    /* 비교 — Before(보더 원) → After(그라데이션 원). 원본 15 */
    compare: function (s, P, ctx) {
      var c = chOf(ctx);
      var cols = (s.items || []).slice(0, 2).map(function (it, i) {
        var IP = P + '.items.' + i, on = i === 1;
        var lis = (it.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="sf-cmpc' + (on ? ' on' : '') + '"' + (on ? ' style="background:linear-gradient(196deg,var(--cl) 0%,var(--cm) 48%,var(--cd) 100%)"' : '') + '>' +
          label(it.head || (i ? 'After' : 'Before'), IP + '.head', 'up' + (on ? ' wh' : '')) +
          '<ul>' + lis + '</ul></div>' + (i === 0 ? '<span class="sf-arr big">→</span>' : '');
      }).join('');
      return '<section class="slide sf cm' + tintOf(ctx) + '" data-kind="' + kind(s, 'Compare') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-cmprow">' + cols + '</div>' + footline(s, P) + '</section>';
    },
    /* 인용/질문 — 보더레프트 + 코랄 포인트 대형 질문. 원본 05 우측 확장 */
    quote: function (s, P, ctx) {
      var c = chOf(ctx);
      return '<section class="slide sf qt' + tintOf(ctx) + '" data-kind="' + kind(s, 'Quote') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) +
        '<div class="sf-qmid"><div class="sf-qbox">' + label(s.by || 'The Question', P + '.by', 'up q') +
        '<p class="sf-qtx"' + de(P + '.text') + '>' + mb(emph(s.text || '')) + '</p></div></div></section>';
    },
    /* 포지셔닝 — process 재사용 */
    position: function (s, P, ctx) {
      return R.process({ type: 'process', title: s.title, kicker: s.kicker, tag: s.tag, note: s.note, accent: s.accent != null ? s.accent : 1, kindLabel: s.kindLabel || 'Position', steps: (s.panels || []).map(function (p) { return { tag: p.tag, head: p.head, text: p.text }; }) }, P.replace(/\.panels\./, '.steps.'), ctx).replace(/data-edit="([^"]*)\.steps\./g, 'data-edit="$1.panels.');
    },
    /* 체크리스트 — 보더바텀 리스트, 5개 초과 2열. 원본 05 좌측 */
    checklist: function (s, P, ctx) {
      var c = chOf(ctx), items = s.items || [];
      var two = (s.cols === 2) || items.length > 5;
      var lis = items.map(function (t, i) {
        return '<li>' + dash(13) + '<span' + de(P + '.items.' + i) + '>' + mb(t) + '</span></li>';
      }).join('');
      return '<section class="slide sf ck' + tintOf(ctx) + '" data-kind="' + kind(s, 'Checklist') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<ul class="sf-list ckl' + (two ? ' two' : '') + '">' + lis + '</ul>' + footline(s, P) + '</section>';
    },
    /* 라인업 — 진행=대형 그라데이션 원+흰 뱃지, 후보=점선 보더 원. 원본 10 */
    lineup: function (s, P, ctx) {
      var c = chOf(ctx), items = (s.items || []).slice(0, 4);
      var lit = items.filter(function (x) { return x.state !== 'dim'; }).length, li2 = 0;
      var cells = items.map(function (it, i) {
        var IP = P + '.items.' + i, dim = it.state === 'dim';
        var crc = dim
          ? '<div class="sf-lnc dim"><span class="hd"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' + (it.badge ? label(it.badge, IP + '.badge', 'up dm') : '') + '</div>'
          : '<div class="sf-lnc" style="' + crcTone(li2++, Math.max(lit, 2), false).replace('color:var(--cink)', 'color:#fff') + '">' + label(it.tag, IP + '.tag', 'up wh') +
            '<span class="hd"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
            (it.badge ? '<span class="sf-lnbadge"' + de(IP + '.badge') + '>' + esc(it.badge) + '</span>' : '') + '</div>';
        return '<div class="sf-lncard' + (dim ? ' dim' : '') + '">' + crc +
          (it.text ? '<p class="sf-crctx' + (dim ? ' dm' : '') + '"' + de(IP + '.text') + '>' + mb(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide sf ln' + tintOf(ctx) + '" data-kind="' + kind(s, 'Lineup') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="sf-lnrow">' + cells + '</div>' + footline(s, P) + '</section>';
    },
    /* 갈래/조직 — 벤 3원(투명 겹침) + 우 리드 박스. 원본 08 */
    branch: function (s, P, ctx) {
      var c = chOf(ctx);
      var pos = [{ l: 100, t: 0 }, { l: 0, t: 172 }, { l: 199, t: 172 }];
      var op = ['.42', '.38', '.4'];
      var circles = (s.branches || []).slice(0, 3).map(function (b, i) {
        var IP = P + '.branches.' + i, p = pos[i] || pos[0];
        return '<div class="sf-venn" style="left:' + p.l + 'px;top:' + p.t + 'px;background:color-mix(in srgb, var(--cm) ' + Math.round(parseFloat(op[i]) * 100) + '%, transparent)">' +
          label(b.label, IP + '.label', 'up ink') +
          '<span class="hd"' + de(IP + '.head') + '>' + esc(b.head || '') + '</span>' +
          (b.text ? '<span class="tx"' + de(IP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }).join('');
      var lead = s.lead ? '<div class="sf-needbox">' + label(s.lead.label || 'Needed', P + '.lead.label', 'up acc') +
        '<span class="tx"' + de(P + '.lead.text') + '>' + mb(s.lead.text || '') + '</span></div>' : '';
      return '<section class="slide sf br' + tintOf(ctx) + '" data-kind="' + kind(s, 'Branch') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) +
        '<div class="sf-brgrid"><div class="sf-brl">' + headline(s, P) + sub(s, P) + lead + '</div>' +
        '<div class="sf-vennwrap">' + circles + '</div></div>' + footline(s, P) + '</section>';
    },
    /* 하이라이트/데모 — 래디얼 풀블리드 + Archivo 대형 2톤 + 원 번호 행. 원본 16 */
    highlight: function (s, P, ctx) {
      var c = chOf(ctx);
      var rows = (s.items || []).slice(0, 3).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="sf-hlrow' + (i === 0 ? ' fs' : '') + '">' +
          '<div class="hd"><span class="no' + (i === 0 ? ' fill' : '') + '"' + de(IP + '.no') + '>' + esc(it.no || '0' + (i + 1)) + '</span>' +
          '<span class="h"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span></div>' +
          (it.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide sf hl" data-kind="' + kind(s, 'Highlight') + '" style="' + chv(c) + ';background:' + RADIAL.replace('#3FB6D6', '#2476A6') + '">' +
        runhead(s, P, ctx, true) +
        '<div class="sf-hlmid"><h1 class="sf-hltitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        '<div class="sf-hlrows">' + rows + '</div></div>' +
        (s.footnote ? '<span class="sf-hlfn"' + de(P + '.footnote') + '>' + mb(s.footnote) + '</span>' : '') + '</section>';
    },
    /* 현황 보드 — 2톤 대형 타이틀 + 좌 원 2 + 우 보더레프트 리스트. 원본 13 */
    board: function (s, P, ctx) {
      var c = chOf(ctx);
      var cards = (s.cards || []).slice(0, 2).map(function (cd, i) {
        var IP = P + '.cards.' + i;
        return '<div class="sf-bocard"><div class="sf-bocrc" style="' + crcTone(i, 2, false).replace('color:var(--cink)', 'color:#fff') + '">' +
          label(cd.tag, IP + '.tag', 'up wh') +
          '<span class="hd"' + de(IP + '.head') + '>' + esc(noNum(cd.head) || '') + '</span></div>' +
          (cd.text ? '<p class="sf-crctx"' + de(IP + '.text') + '>' + mb(cd.text) + '</p>' : '') + '</div>';
      }).join('');
      var side = '';
      if (s.side) {
        var lis = (s.side.items || []).map(function (t, i) { return '<li' + de(P + '.side.items.' + i) + '>' + mb(t) + '</li>'; }).join('');
        var pills = (s.side.pills || []).map(function (t, i) { return '<span' + de(P + '.side.pills.' + i) + '>' + esc(t) + '</span>'; }).join('');
        side = '<div class="sf-boside">' + label(s.side.title, P + '.side.title', 'up acc') +
          '<ul>' + lis + '</ul>' + (pills ? '<div class="pl">' + pills + '</div>' : '') + '</div>';
      }
      return '<section class="slide sf bo' + tintOf(ctx) + '" data-kind="' + kind(s, 'Board') + '" style="' + chv(c) + '">' + runhead(s, P, ctx) +
        '<h2 class="sf-botitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>' +
        '<div class="sf-bogrid"><div class="sf-bocards">' + cards + '</div>' + side + '</div>' + footline(s, P) + '</section>';
    },
    /* 엔딩 — 커버 변형(래디얼+대형 2톤+리드+하단 메타). 원본 19 */
    closing: function (s, P, ctx) {
      return '<section class="slide sf cl" data-kind="' + kind(s, 'Closing') + '" style="' + chv(CH[0]) + ';background:' + RADIAL + '">' + diagLine() +
        '<div class="sf-cvtop"><span class="sf-cvlogo">' + dash(20) + '<span class="tx"><i>MIDAS Design AX</i><em' + de(P + '.label') + '>' + esc(s.label || 'From Prototype to System') + '</em></span></span>' +
        '<span class="sf-cvpg">Epilogue</span></div>' +
        '<div class="sp"></div>' +
        '<h1 class="sf-cltitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.sub ? '<p class="sf-cvlead"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') +
        '<div class="sp"></div>' +
        '<div class="sf-cvfoot"><span' + de(P + '.nextLabel') + '>' + mb(s.nextLabel || '') + '</span>' +
        (s.contacts && s.contacts.length ? '<span class="ct">' + s.contacts.map(function (ct, i) { return '<i' + de(P + '.contacts.' + i + '.v') + '>' + esc(ct.v || '') + '</i>'; }).join('') + '</span>' : '') +
        '</div></section>';
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
      catch (e) { html = '<section class="slide sf sc" data-kind="Error"><h2 class="sf-hl">' + esc(s.type) + ' 렌더 오류</h2></section>'; }
      return html;
    }).join('\n');
  }

  /* ---- 이동/숨김/굵기 상태 재적용 — 타 팩과 동일 계약 ---- */
  var MV_SEL = '[data-edit], .s-imgwrap, .sf-imgph, .sf-diag, .sf-dash, .sf-ringsvg, .sf-dvstroke';
  var UNIT_SEL = '.sf-num,.sf-crccard,.sf-half,.sf-ring,.sf-srow,.sf-trow,.sf-tbrow,.sf-rmcol,.sf-chev,.sf-kp,.sf-pcol,.sf-cmpc,.sf-lncard,.sf-venn,.sf-bocard,.sf-hlrow,.sf-toc,.sf-stcol,.sf-list li,.ms-bar,.ms-phase';
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

  /* ---- CSS — 실측 ×0.6667. 원형 모티프 + skew 대시 + 교대 지면 ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      '@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@200;300;400;500;600;700&display=swap");' +
      ':root{--ink:#2C2E35;--body:#43454B;--soft:#6E7378;--muted:#868581;--dim:#B5C4CB;--rule:#E4E9EC;--rule2:#C9DCE3;--ice:#F1FBFE;--slide-w:1280px;--slide-h:720px}' +
      '*{box-sizing:border-box;margin:0;word-break:keep-all}' +
      'body{background:#E9EDF0;font-family:Pretendard,"Pretendard Variable",-apple-system,"Apple SD Gothic Neo",sans-serif;-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:#fff;color:var(--ink);overflow:hidden;' +
      'display:flex;flex-direction:column;padding:48px 69px;font-family:Pretendard,"Pretendard Variable",sans-serif}' +
      '.slide.tint{background:var(--ice)}' +
      '.sp{flex:1;min-height:0}' +
      'b{font-weight:600}.mut{color:var(--dim)}' +
      '.sf-dash{display:inline-block;height:4px;background:var(--cm);transform:skewX(-38deg);flex:0 0 auto}' +
      /* 러닝헤드 */
      '.sf-run{display:flex;justify-content:space-between;align-items:baseline;flex:none;font-family:Archivo,Pretendard,sans-serif;font-size:13px;font-weight:500;letter-spacing:.03em;color:var(--muted)}' +
      '.sf-runl{display:inline-flex;align-items:center;gap:11px}' +
      '.sf-runr{font-variant-numeric:tabular-nums}' +
      '.sf-run.wh{color:#fff}.sf-run.wh .sf-dash{background:#fff}' +
      /* 헤드라인·본문·라벨 */
      '.sf-hl{margin-top:32px;font-size:48px;font-weight:200;line-height:1.22;letter-spacing:-.025em;white-space:pre-wrap;flex:none;max-width:90%}' +
      '.sf-hl b{font-weight:600}' +
      '.sf-sub{margin-top:9px;font-size:17px;font-weight:300;line-height:1.7;color:var(--muted);flex:none}' +
      '.sf-body{font-size:19px;font-weight:300;line-height:1.75;color:var(--soft)}' +
      '.sf-lab{font-family:Archivo,Pretendard,sans-serif;font-size:14px;font-weight:600;color:var(--muted)}' +
      '.sf-lab.up{letter-spacing:.12em;text-transform:uppercase}' +
      '.sf-lab.acc{color:var(--ctx)}.sf-lab.wh{color:#fff}.sf-lab.ink{color:var(--cink)}.sf-lab.dm{color:#5F7A87}.sf-lab.q{color:#FF6E7A}' +
      '.sf-cap{font-size:13px;color:var(--muted)}' +
      /* 풋라인 */
      '.sf-foot{margin-top:auto;flex:none;display:flex;align-items:center;gap:19px;padding-top:17px;border-top:1px solid var(--rule2)}' +
      '.sf-fdash{width:37px;height:1.5px;background:var(--cm);flex:0 0 auto}' +
      '.sf-ftx{font-size:22px;font-weight:200;color:var(--body)}.sf-ftx b{font-weight:500;color:var(--ink)}' +
      /* 표지·엔딩 */
      '.slide.cv,.slide.cl{color:#fff}' +
      '.sf-diag{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
      '.sf-cvtop{position:relative;display:flex;justify-content:space-between;align-items:flex-start;font-family:Archivo,Pretendard,sans-serif;font-size:16px;font-weight:500}' +
      '.sf-cvlogo{display:flex;align-items:flex-start;gap:12px}.sf-cvlogo .sf-dash{height:5px;margin-top:6px;background:#fff}' +
      '.sf-cvlogo .tx{display:flex;flex-direction:column;gap:3px}.sf-cvlogo em{font-style:normal;opacity:.72}' +
      '.sf-cvpg{font-weight:500}' +
      '.sf-cvtitle{position:relative;font-family:Archivo,Pretendard,sans-serif;font-size:96px;font-weight:200;line-height:1.02;letter-spacing:-.035em;color:#0F5F73;white-space:pre-wrap}' +
      '.sf-cvtitle b{font-weight:500;color:#fff}' +
      '.sf-cltitle{position:relative;font-family:Archivo,Pretendard,sans-serif;font-size:80px;font-weight:200;line-height:1.04;letter-spacing:-.035em;color:#0F5F73;white-space:pre-wrap}' +
      '.sf-cltitle b{font-weight:500;color:#fff}.sf-cltitle .mut{color:#0F5F73}' +
      '.sf-cvlead{position:relative;margin-top:32px;font-size:22px;font-weight:300;line-height:1.6;color:#0F5F73;max-width:36ch}' +
      '.sf-cvlead b{color:#fff;font-weight:600}' +
      '.sf-cvfoot{position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;font-family:Archivo,Pretendard,sans-serif;font-size:15px;letter-spacing:.02em}' +
      '.sf-cvfoot .ct{display:flex;flex-direction:column;gap:3px;text-align:right;font-size:13px;opacity:.92}.sf-cvfoot .ct i{font-style:normal}' +
      '.sf-cvfoot b{font-weight:600}' +
      /* 선언 */
      '.sf-stmid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:80px;padding:37px 0}' +
      '.sf-stl{display:flex;flex-direction:column;gap:20px}' +
      '.sf-bar{width:37px;height:2px;background:var(--cm)}' +
      '.sf-stlead{font-size:24px;font-weight:200;line-height:1.72;color:var(--body)}.sf-stlead b{color:var(--ink);font-weight:500}' +
      '.sf-sttitle{font-family:Archivo,Pretendard,sans-serif;font-size:70px;font-weight:200;line-height:1.04;letter-spacing:-.035em;text-align:right;white-space:pre-wrap}' +
      '.sf-sttitle b{font-weight:500;color:var(--ctx)}' +
      '.sf-stcols{display:grid;grid-template-columns:1fr 1fr;gap:64px;padding-top:19px;border-top:1px solid var(--rule2);flex:none}' +
      '.sf-stcol{display:flex;flex-direction:column;gap:5px}' +
      '.sf-sttx{font-size:21px;font-weight:200}.sf-sttx b{color:var(--ctx);font-weight:500}' +
      /* 목차 */
      '.sf-tctitle{margin-top:37px;font-family:Archivo,Pretendard,sans-serif;font-size:32px;font-weight:300;letter-spacing:-.01em}' +
      '.sf-tocgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:20px 80px;align-content:start;padding-top:32px}' +
      '.sf-toc{display:flex;flex-direction:column;gap:10px}' +
      '.sf-tochead{display:flex;align-items:center;gap:9px;font-size:19px;font-weight:600;padding-bottom:9px;border-bottom:1px solid var(--ink)}' +
      '.sf-tochead .sf-dash{height:3.5px}' +
      '.sf-tocrow{display:flex;gap:21px;font-size:17px;font-weight:300;color:var(--body)}' +
      '.sf-tocrow .no{width:44px;flex:0 0 auto;color:var(--muted);font-variant-numeric:tabular-nums}' +
      /* 간지 */
      '.slide.dv{flex-direction:row;padding:0;gap:0}' +
      '.sf-dvl{width:50%;flex:none;position:relative;overflow:hidden}' +
      '.sf-dvno{position:absolute;left:48px;top:48px;display:flex;flex-direction:column;gap:4px;color:#fff;font-family:Archivo,Pretendard,sans-serif;font-size:13px;font-weight:500}' +
      '.sf-dvno b{font-weight:500}.sf-dvno i{font-style:normal;opacity:.82}' +
      '.sf-dvstroke{position:absolute;left:37px;right:37px;bottom:37px;font-family:Archivo,Pretendard,sans-serif;font-size:110px;font-weight:600;line-height:.88;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:1.4px rgba(255,255,255,.72);text-transform:uppercase;white-space:pre-wrap}' +
      '.sf-dvr{flex:1;display:flex;flex-direction:column;padding:48px 69px 48px 59px;min-width:0}' +
      '.sf-dvmid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right;gap:23px}' +
      '.sf-dvlead{font-size:48px;font-weight:200;line-height:1.22;letter-spacing:-.025em;white-space:pre-wrap}.sf-dvlead b{font-weight:600}' +
      '.sf-dvtx{font-size:18px;font-weight:300;line-height:1.75;color:var(--soft);max-width:42ch}' +
      /* 본문 표준(원 넘버) */
      '.sf-numgrid{flex:1;min-height:0;display:grid;gap:32px;align-content:center;padding:24px 0}' +
      '.sf-numgrid.c1{grid-template-columns:1fr}.sf-numgrid.c2{grid-template-columns:1fr 1fr}.sf-numgrid.c3{grid-template-columns:repeat(3,1fr)}.sf-numgrid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.sf-num{display:flex;flex-direction:column;gap:15px}' +
      '.sf-numc{width:110px;height:110px;flex:0 0 auto;border-radius:50%;background:color-mix(in srgb, var(--cm) 18%, #fff);display:flex;align-items:center;justify-content:center;font-family:Archivo,sans-serif;font-size:41px;font-weight:300;color:var(--ctx)}' +
      '.sf-numc i{font-style:normal}' +
      '.sf-numhead{font-size:27px;font-weight:600;letter-spacing:-.015em;padding-bottom:12px;border-bottom:1px solid var(--rule2)}' +
      '.sf-numtx{font-size:18px;line-height:1.68;color:var(--body);font-weight:300}' +
      /* 원 카드 */
      '.sf-crcgrid{flex:1;min-height:0;display:grid;gap:37px;align-content:center;justify-items:center;padding:16px 0}' +
      '.sf-crcgrid.c2{grid-template-columns:1fr 1fr}.sf-crcgrid.c3{grid-template-columns:repeat(3,1fr)}.sf-crcgrid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.sf-crccard{display:flex;flex-direction:column;align-items:center;text-align:center;gap:15px}' +
      '.sf-crc{width:264px;height:264px;flex:0 0 auto;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:0 27px;text-align:center}' +
      '.sf-crcgrid.c4 .sf-crc{width:216px;height:216px}' +
      '.sf-crc .hd{font-family:Archivo,Pretendard,sans-serif;font-size:32px;font-weight:500;line-height:1.15}' +
      '.sf-crc .tg{font-family:Archivo,sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;opacity:.85}' +
      '.sf-crctx{font-size:17px;line-height:1.68;color:var(--body);font-weight:300;max-width:24ch}' +
      '.sf-crctx.dm{color:var(--soft)}' +
      /* 리스트·대비 */
      '.sf-list{list-style:none;display:flex;flex-direction:column}' +
      '.sf-list li{display:flex;align-items:center;gap:11px;padding:13px 0;border-bottom:1px solid var(--rule);font-size:19px;font-weight:300;color:var(--body)}' +
      '.sf-list li .sf-dash{height:3.5px}' +
      '.sf-list li.on{font-weight:600;color:var(--ink);border-bottom:1px solid var(--rule2)}' +
      '.sf-list.ckl{flex:1;min-height:0;justify-content:center;padding:16px 0}' +
      '.sf-list.ckl li{font-size:21px;padding:15px 0}' +
      '.sf-list.ckl.two{display:grid;grid-template-columns:1fr 1fr;column-gap:53px;align-content:center}' +
      '.sf-splitgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-content:center;padding:24px 0}' +
      '.sf-half{display:flex;flex-direction:column;gap:11px}' +
      '.sf-half .sf-list li{color:var(--muted)}' +
      '.sf-half .sf-list li.on{color:var(--ink)}' +
      '.sf-hfoot{font-size:14px;color:var(--muted)}' +
      /* 링 도넛 */
      '.sf-ringrow{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:53px;padding:16px 0}' +
      '.sf-ring{display:flex;flex-direction:column;align-items:center;text-align:center;gap:11px}' +
      '.sf-ring .lb{font-size:21px;font-weight:400;color:#5F6469}' +
      '.sf-ring.on .lb{font-size:26px;font-weight:600;color:var(--ink)}' +
      '.sf-ring .tx{font-size:15px;line-height:1.7;color:#9CA6AC;font-weight:300;max-width:26ch}' +
      '.sf-ring.on .tx{font-size:15px;color:var(--soft)}' +
      /* 스펙 rows */
      '.sf-mdgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr;align-content:center;padding:24px 0}' +
      '.sf-mdgrid.hasimg{grid-template-columns:1.35fr 1fr;gap:37px;align-items:center}' +
      '.sf-srows{display:flex;flex-direction:column}' +
      '.sf-srow{display:grid;grid-template-columns:167px 1fr;align-items:center;gap:29px;padding:15px 0;border-top:1px solid var(--rule)}' +
      '.sf-srow:last-child{border-bottom:1px solid var(--rule)}' +
      '.sf-srow .k{font-family:Archivo,sans-serif;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}' +
      '.sf-srow .t{font-size:19px;font-weight:300;color:var(--body)}' +
      '.sf-srow.on{border:0;background:linear-gradient(110deg,var(--cl) 0%,var(--cm) 55%,var(--cd) 100%);color:#fff;padding:23px 24px}' +
      '.sf-srow.on .k{color:#fff}.sf-srow.on .t{color:#fff;font-weight:500;font-size:21px}' +
      '.sf-imgph{border:1px solid var(--rule2);background:color-mix(in srgb, var(--cl) 14%, #fff);min-height:213px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px}' +
      '.sf-imgcol{display:flex;flex-direction:column;gap:9px}' +
      /* 로드맵 */
      '.sf-chevrow{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:13px;margin-top:27px;flex:none}' +
      '.sf-chev{height:60px;padding:0 35px 0 21px;display:flex;align-items:center;gap:21px;clip-path:polygon(0 0, calc(100% - 17px) 0, 100% 50%, calc(100% - 17px) 100%, 0 100%);font-size:16px;font-weight:500}' +
      '.sf-chev .mi{display:inline-flex;align-items:baseline;gap:7px}.sf-chev .mi b{font-weight:700}.sf-chev .mi i{font-style:normal;font-weight:500}' +
      '.sf-rmgrid{flex:1;min-height:0;display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:13px;align-content:start;padding-top:16px}' +
      '.sf-rmcol{display:flex;flex-direction:column;gap:13px;padding:16px 21px 0}' +
      '.sf-rmhead{font-size:34px;font-weight:600;letter-spacing:-.025em}' +
      '.sf-rmcol:not(.now) .sf-rmhead{font-size:27px;font-weight:300;color:#5F6469}' +
      '.sf-rmlist{list-style:none;display:flex;flex-direction:column;gap:10px;font-size:18px;line-height:1.5;color:var(--ink);font-weight:400;padding-top:8px}' +
      '.sf-rmcol:not(.now) .sf-rmlist{color:var(--soft);font-weight:300;font-size:17px}' +
      /* 대형 수치·KPI */
      '.sf-bsmid{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:48px;padding:16px 0}' +
      '.sf-bscrc{width:310px;height:310px;flex:0 0 auto;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center}' +
      '.sf-bscrc .v{font-family:Archivo,sans-serif;font-size:72px;font-weight:300;letter-spacing:-.03em}' +
      '.sf-bscap{font-size:22px;font-weight:300;color:var(--body);max-width:34ch;line-height:1.7}.sf-bscap b{font-weight:600;color:var(--ink)}' +
      '.sf-kpgrid{flex:1;min-height:0;display:grid;gap:32px;align-content:center;justify-items:center;padding:16px 0}' +
      '.sf-kpgrid.c2{grid-template-columns:1fr 1fr}.sf-kpgrid.c3{grid-template-columns:repeat(3,1fr)}.sf-kpgrid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.sf-kp{display:flex;flex-direction:column;align-items:center;text-align:center;gap:11px}' +
      '.sf-kpc{width:140px;height:140px;border-radius:50%;background:color-mix(in srgb, var(--cm) 18%, #fff);display:flex;align-items:center;justify-content:center;font-family:Archivo,sans-serif;font-size:33px;font-weight:400;color:var(--ctx)}' +
      '.sf-kpc i{font-style:normal}' +
      '.sf-kp .lb{font-size:19px;font-weight:500}' +
      '.sf-kp .ds{font-size:15px;color:var(--soft);font-weight:300}' +
      /* 표·타임라인 */
      '.sf-tbl{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;padding:16px 0}' +
      '.sf-tbrow{display:grid;grid-template-columns:repeat(var(--tbc),1fr);gap:19px;align-items:center;padding:17px 0;border-bottom:1px solid var(--rule);font-size:19px;font-weight:300;color:var(--body)}' +
      '.sf-tbrow .f{font-weight:500;color:var(--ink)}' +
      '.sf-tbrow.hd{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);padding:8px 0}' +
      '.sf-trows{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;padding:16px 0}' +
      '.sf-trow{display:grid;grid-template-columns:140px 213px 1fr;gap:27px;align-items:baseline;padding:15px 0;border-bottom:1px solid var(--rule)}' +
      '.sf-trow .w{font-family:Archivo,sans-serif;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ctx)}' +
      '.sf-trow .h{font-size:21px;font-weight:600}.sf-trow .t{font-size:18px;font-weight:300;color:var(--body)}' +
      '.sf-trow.on{background:color-mix(in srgb, var(--cl) 20%, #fff);padding:15px 15px;border-bottom:0}' +
      /* 프로세스(원) */
      '.sf-pcrow{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:24px;padding:16px 0}' +
      '.sf-pcol{display:flex;flex-direction:column;align-items:center;text-align:center;gap:13px}' +
      '.sf-pcc{width:182px;height:182px;border-radius:50%;border:1.5px solid #C0D5DE;background:#F7FBFD;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0 16px;text-align:center}' +
      '.sf-pcc .hd{font-size:24px;font-weight:300;line-height:1.18;color:#4A555C;white-space:pre-wrap}' +
      '.sf-pcc.on{width:308px;height:308px;border:0;color:#fff}' +
      '.sf-pcc.on .hd{font-size:45px;font-weight:600;line-height:1.06;letter-spacing:-.02em;color:#fff}' +
      '.sf-pcc.on .tx{font-size:17px;font-weight:500;line-height:1.55;max-width:22ch}' +
      '.sf-pctx{font-size:16px;line-height:1.6;color:var(--soft);font-weight:300;max-width:20ch}' +
      '.sf-arr{font-family:Archivo,sans-serif;font-size:29px;font-weight:200;color:#9CB4BE;flex:0 0 auto}' +
      '.sf-arr.big{font-size:35px;color:var(--cm)}' +
      /* 비교(원) */
      '.sf-cmprow{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:35px;padding:16px 0}' +
      '.sf-cmpc{width:330px;height:330px;flex:0 0 auto;border-radius:50%;border:1.5px solid #C0D5DE;background:#F7FBFD;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:19px;padding:0 30px;text-align:center}' +
      '.sf-cmpc ul{list-style:none;display:flex;flex-direction:column;gap:10px;font-size:18px;font-weight:300;color:var(--soft);white-space:nowrap}' +
      '.sf-cmpc.on{border:0;color:#fff}.sf-cmpc.on ul{color:#fff;font-weight:600;font-size:18px}' +
      /* 질문 */
      '.sf-qmid{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}' +
      '.sf-qbox{display:flex;flex-direction:column;align-items:flex-end;text-align:right;gap:19px;padding-left:37px;border-left:3px solid var(--cm)}' +
      '.sf-qtx{font-size:40px;font-weight:200;line-height:1.42;letter-spacing:-.02em;white-space:pre-wrap}' +
      '.sf-qtx b{font-weight:600;color:#FF6E7A}' +
      /* 라인업(원) */
      '.sf-lnrow{flex:1;min-height:0;display:grid;grid-template-columns:1.45fr 1.45fr 1fr 1fr;gap:21px;align-items:center;justify-items:center;padding:16px 0}' +
      '.sf-lncard{display:flex;flex-direction:column;align-items:center;text-align:center;gap:13px}' +
      '.sf-lnc{width:252px;height:252px;border-radius:50%;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:0 27px;text-align:center}' +
      '.sf-lnc .hd{font-size:26px;font-weight:600;line-height:1.16}' +
      '.sf-lnc.dim{width:140px;height:140px;border:2px dashed #7FA4B4;background:#F5FAFC;color:#3E4A50;gap:4px}' +
      '.sf-lnc.dim .hd{font-size:16px;font-weight:400;line-height:1.2}' +
      '.sf-lnbadge{display:inline-flex;padding:4px 11px;background:#fff;color:var(--cink);font-size:13px;font-weight:600}' +
      /* 벤(조직) */
      '.sf-brgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1.05fr;gap:53px;align-items:center;padding:16px 0}' +
      '.sf-brl{display:flex;flex-direction:column;gap:19px}.sf-brl .sf-hl{margin-top:0;max-width:100%}' +
      '.sf-needbox{display:flex;align-items:center;gap:13px;padding:15px 19px;background:var(--ice)}' +
      '.slide.tint .sf-needbox{background:#fff}' +
      '.sf-needbox .tx{font-size:18px;font-weight:500}.sf-needbox .tx b{color:var(--ctx)}' +
      '.sf-vennwrap{position:relative;width:455px;height:428px;justify-self:center}' +
      '.sf-venn{position:absolute;width:256px;height:256px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 27px;text-align:center}' +
      '.sf-venn .hd{font-size:19px;font-weight:600;color:var(--cink)}' +
      '.sf-venn .tx{font-size:14px;font-weight:300;color:var(--cink);opacity:.85}' +
      /* 하이라이트 */
      '.slide.hl{color:#fff}' +
      '.sf-hlmid{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:35px}' +
      '.sf-hltitle{font-family:Archivo,Pretendard,sans-serif;font-size:96px;font-weight:200;line-height:.98;letter-spacing:-.04em;color:#0F5F73;white-space:pre-wrap}' +
      '.sf-hltitle b{font-weight:500;color:#fff}' +
      '.sf-hlrows{display:grid;grid-template-columns:1.6fr 1fr;gap:48px}' +
      '.sf-hlrow{display:flex;flex-direction:column;gap:13px;padding-top:15px;border-top:1px solid rgba(255,255,255,.6)}' +
      '.sf-hlrow.fs{border-top:2px solid #fff}' +
      '.sf-hlrow .hd{display:flex;align-items:center;gap:15px}' +
      '.sf-hlrow .no{width:43px;height:43px;flex:0 0 auto;border-radius:50%;border:1.5px solid rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;font-family:Archivo,sans-serif;font-size:16px;font-weight:600}' +
      '.sf-hlrow .no.fill{background:#fff;color:var(--ctx);border:0}' +
      '.sf-hlrow .h{font-size:29px;font-weight:600;letter-spacing:-.02em}' +
      '.sf-hlrow .t{font-size:18px;font-weight:500;opacity:.92;line-height:1.55}' +
      '.sf-hlfn{position:relative;flex:none;align-self:flex-end;font-size:13px;opacity:.85;text-align:right;line-height:1.6}' +
      /* 보드 */
      '.sf-botitle{margin-top:32px;font-family:Archivo,Pretendard,sans-serif;font-size:53px;font-weight:200;line-height:1.12;letter-spacing:-.03em;white-space:pre-wrap;flex:none}' +
      '.sf-botitle b{font-weight:500}.sf-botitle .mut{color:var(--dim)}' +
      '.sf-bogrid{flex:1;min-height:0;display:grid;grid-template-columns:auto 1fr;gap:56px;align-items:center;padding:16px 0}' +
      '.sf-bocards{display:flex;gap:16px}' +
      '.sf-bocard{display:flex;flex-direction:column;align-items:center;text-align:center;gap:13px}' +
      '.sf-bocrc{width:260px;height:260px;border-radius:50%;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:0 27px;text-align:center}' +
      '.sf-bocrc .hd{font-size:25px;font-weight:600;line-height:1.16}' +
      '.sf-boside{display:flex;flex-direction:column;gap:15px;padding-left:43px;border-left:1px solid var(--rule)}' +
      '.sf-boside ul{list-style:none;display:flex;flex-direction:column;font-size:19px;font-weight:300;color:var(--body)}' +
      '.sf-boside li{padding:10px 0;border-bottom:1px solid var(--rule)}' +
      '.sf-boside .pl{display:flex;gap:21px;padding-top:11px;font-family:Archivo,Pretendard,sans-serif;font-size:15px;font-weight:600;letter-spacing:.04em;color:var(--ink)}' +
      /* 마일스톤 — 전 팩 공통 */
      '.slide.sf.ms{gap:19px}' +
      '.ms-phases{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:9px;flex:none;margin-top:11px}' +
      '.ms-phase{background:color-mix(in srgb, var(--cl) 20%, #fff);padding:15px 19px;display:flex;flex-direction:column;gap:6px}' +
      '.ms-ptag{align-self:flex-start;font-family:Archivo,sans-serif;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;background:#fff;color:var(--ctx)}' +
      '.ms-phase.on .ms-ptag{background:var(--cm);color:#fff}' +
      '.ms-phead{font-size:19px;font-weight:600;letter-spacing:-.02em}' +
      '.ms-ptext{font-size:13px;font-weight:300;color:var(--body);line-height:1.5}.ms-ptext b{color:var(--ctx);font-weight:600}' +
      '.ms-cap{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;color:var(--ctx);letter-spacing:.14em;text-transform:uppercase;flex:none}' +
      '.ms-chart{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:space-evenly;padding:4px 0 12px;overflow:hidden}' +
      '.ms-glines{position:absolute;inset:0;display:grid;grid-auto-flow:column;grid-auto-columns:1fr}' +
      '.ms-glines i{border-left:1px solid var(--rule)}' +
      '.ms-bar{position:relative;z-index:1;padding:9px 16px;display:flex;flex-direction:column;gap:2px;animation:vfu .5s both;color:#fff}' +
      '.ms-bar b{font-size:15.5px;font-weight:600;letter-spacing:-.01em}' +
      '.ms-bar span{font-size:13px;opacity:.85;font-weight:300}' +
      '.ms-axis{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;flex:none;border-top:1px solid var(--rule);padding-top:8px}' +
      '.ms-axis span{font-size:13px;color:var(--muted);text-align:center}' +
      '.ms-note{flex:none;font-size:17px;font-weight:300;border-left:3px solid var(--cm);padding:9px 0 9px 16px}.ms-note b{font-weight:600;color:var(--ctx)}' +
      '@keyframes vfu{from{opacity:0}to{opacity:1}}';
  }

  function renderSfmiDeck(data) {
    data = data || {};
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>' + css() + '</style></head><body>' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + '</body></html>';
  }

  /* ---- 발표 뷰어 (vjs 조작 스크립트 포함 필수) ---- */
  function renderSfmiViewer(data, opts) {
    data = data || {}; opts = opts || {};
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    var vcss =
      'html,body{height:100%}body{background:#0f141a;overflow:hidden}' +
      '.vwrap{position:fixed;inset:0;display:flex;justify-content:center;align-items:flex-start}' +
      '.vscale{width:var(--slide-w);height:var(--slide-h);position:relative;flex:none;transform-origin:top center}' +
      '.vscale .slide{position:absolute;inset:0;visibility:hidden;box-shadow:0 24px 80px rgba(0,0,0,.45)}' +
      '.vscale .slide.cur{visibility:visible}' +
      '.vbar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:9px 16px;border-radius:999px;background:rgba(15,20,26,.72);backdrop-filter:blur(10px);color:#fff;font-family:Pretendard,system-ui,sans-serif;font-size:13px;z-index:9;user-select:none}' +
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
      'var us=cur.querySelectorAll(' + JSON.stringify(UNIT_SEL + ',.sf-ringsvg,.sf-imgph,.sf-foot,.sf-chevrow') + ');var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      'var cu=cur.querySelectorAll(".sf-bscrc .v,.sf-kpc i");for(var w=0;w<cu.length;w++){(function(el){' +
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

  /* ---- 카탈로그("언제 쓰나") ---- */
  var CATALOG = [
    { type: 'cover', label: '표지', use: '첫 장 — 래디얼 시안 그라데이션·사선·Archivo 대형 2톤', needs: ['title'], opt: ['label', 'date', 'eyebrow', 'band', 'docLabel'] },
    { type: 'statement', label: '대형 선언', use: '표지 다음 선언 — 좌 리드/우 Archivo 대형+비교 2열', needs: ['title'], opt: ['sub', 'cols'] },
    { type: 'toc', label: '목차', use: '보고 순서 — 2열 챕터 블록(대시+보더바텀+페이지 행)', needs: ['items'], opt: ['title'] },
    { type: 'divider', label: '간지', use: '챕터 시작 — 좌 챕터 그라데이션+아웃라인 스트로크 영문/우 국문 리드', needs: ['title', 'lead'], opt: ['no', 'text'] },
    { type: 'section', label: '본문 표준', use: '핵심 논점 3~4개 — 원 넘버+보더바텀 소제목+설명', needs: ['title', 'points'], opt: ['tag', 'sub', 'note'], cap: { points: '3~4개' } },
    { type: 'cards', label: '원 카드', use: '동급 항목 2~4개 — 그라데이션 원+설명', needs: ['title', 'cards'], opt: ['tag', 'sub', 'note'], cap: { cards: '2~4개' } },
    { type: 'split', label: '좌우 대비', use: '흐린 리스트 vs 강조 리스트(활용 vs 설계)', needs: ['left', 'right'], opt: ['title', 'note'] },
    { type: 'stats', label: '링 수치', use: '링 도넛 1~3개 — 진척도·달성률(on=중앙 대형)', needs: ['title', 'bars'], opt: ['sub', 'note'], cap: { bars: '1~3개' } },
    { type: 'media', label: '스펙 rows', use: '구조·사양 행(라벨+내용, 핵심 행 그라데이션)+이미지 슬롯', needs: ['title', 'specs'], opt: ['image', 'caption', 'sub', 'note'] },
    { type: 'roadmap', label: '로드맵', use: '단계 계획 — 상단 chevron 월 밴드+Now/Next/Then 3열', needs: ['title', 'steps'], opt: ['months', 'sub', 'note'], cap: { steps: '3개' } },
    { type: 'bigstat', label: '대형 수치', use: '수치 하나로 임팩트 — 그라데이션 원 안 값', needs: ['title', 'value'], opt: ['caption', 'note'] },
    { type: 'kpi', label: 'KPI 원', use: '지표 2~4개 — 미니 원+값', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '2~4개' } },
    { type: 'table', label: '표', use: '열이 정해진 데이터 — 보더바텀 rows', needs: ['title', 'columns', 'rows'], opt: ['sub', 'note'] },
    { type: 'timeline', label: '타임라인', use: '시간순 이벤트 — when+제목+설명 행', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '3~5개' } },
    { type: 'milestone', label: '마일스톤', use: '기간 계획 간트 — 단계 카드+월축 계단 바, 일정·완료 기준 중심일 때', needs: ['title', 'bars', 'axis'], opt: ['phases', 'caption', 'note'] },
    { type: 'process', label: '프로세스', use: '단계 흐름 3~4개 — 원 소→대(그라데이션)→소+화살표', needs: ['title', 'steps'], opt: ['accent', 'sub', 'note'], cap: { steps: '3~4개' } },
    { type: 'compare', label: '비교', use: 'Before→After — 보더 원 vs 그라데이션 원', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '2개' } },
    { type: 'quote', label: '질문/인용', use: '핵심 질문 — 보더레프트+코랄 포인트 대형 문장', needs: ['text'], opt: ['by'] },
    { type: 'position', label: '포지셔닝', use: '흐름 3단계 중 우리 위치 — 중앙 대형 원', needs: ['title', 'panels'], opt: ['accent', 'note'], cap: { panels: '3개' } },
    { type: 'checklist', label: '체크리스트', use: '확인·항목 목록 — 대시+보더바텀 rows. 5개 초과 2열', needs: ['title', 'items'], opt: ['cols', 'sub', 'note'] },
    { type: 'lineup', label: '라인업', use: '제품·계획 라인업 4개 — 진행=그라데이션 원·후보=점선 원', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '4개' } },
    { type: 'branch', label: '갈래(벤)', use: '조직·영역 3갈래 벤다이어그램+공통 리드 박스', needs: ['title', 'branches'], opt: ['lead', 'sub', 'note'], cap: { branches: '3개' } },
    { type: 'highlight', label: '하이라이트', use: '데모·발표 안내 — 래디얼 풀블리드+대형 타이틀+원 번호 행', needs: ['title', 'items'], opt: ['footnote'], cap: { items: '2~3개' } },
    { type: 'board', label: '현황 보드', use: '진행 현황 — 2톤 대형 타이틀+원 2+보더레프트 리스트', needs: ['title', 'cards'], opt: ['side', 'note'], cap: { cards: '2개' } },
    { type: 'closing', label: '엔딩', use: '마지막 장 — 래디얼+Archivo 대형 2톤+다음 행동', needs: ['title'], opt: ['label', 'sub', 'nextLabel', 'contacts'] }
  ];

  var STARTERS = {
    cover: { type: 'cover', label: 'MIDAS Design AX', docLabel: 'Design Report 2026', eyebrow: 'Prologue — 01', date: '2026. 08', title: 'The Machine\nThat Builds\n**the Machine**', band: '자동차가 아니라, **자동차를 만드는 시스템**을 설계합니다' },
    statement: { type: 'statement', title: 'The Machine\nThat Builds\n**Design**', sub: '좋은 디자인을 한 번 만드는 일이 아니라, 좋은 디자인이 **반복해서 생산되는 시스템**을 설계하는 일입니다.', cols: [{ tag: 'TESLA', text: '자동차 한 대 **→ 생산 시스템**' }, { tag: 'MIDAS', text: '디자인 결과물 **→ 디자인 에이전트**' }] },
    toc: { type: 'toc', title: 'Contents', items: [{ label: 'Chapter 1. Why Now', desc: '누구나 만드는 시대의 차이', pages: '04' }, { label: 'Chapter 2. The System', desc: '기준을 담아 실행하는 구조', pages: '08' }, { label: "Chapter 3. What's Next", desc: '효과가 확인된 단계부터 확장', pages: '12' }] },
    divider: { type: 'divider', title: 'Everyone\nCan\nMake', lead: "'만드는 것'은 이제\n**누구나 할 수 있는 일**이 되었습니다", text: '자연어 입력만으로 UI와 이미지, 영상, 코드까지 생성됩니다. 도구를 다루는 능력은 더 이상 병목이 아닙니다.' },
    section: { type: 'section', title: '일원화되지 않으면\n**드러나는 네 가지**', points: [{ head: '기준의 분산', text: '기준이 조직별로 나뉘어 있어 서로 다를 수 있음' }, { head: '자산의 분산', text: '검증된 자산이 각 조직에 남아 바로 적용하지 못함' }, { head: '검수의 속도', text: '생성 결과는 늘어나지만 검수는 사람이 건건이 수행' }, { head: '학습의 부재', text: '결과물은 남지만 판단 기준은 축적되지 않음' }], note: '네 가지 모두 **기준을 한곳에 모으면** 해결됩니다.' },
    cards: { type: 'cards', title: '선도기업은 기준을\n**AI 시스템에 반영**하고 있습니다', cards: [{ head: 'Figma', tag: 'MCP · Code Connect', text: '디자인 파일의 컴포넌트·변수를 생성 도구에 전달' }, { head: 'Microsoft', tag: 'Fluent 2 · Agent', text: '공통 기반 규정, 루브릭 심사' }, { head: 'Adobe', tag: 'GenStudio · Brand', text: '브랜드 가이드 등록·자동 검증' }], note: '기준을 **시스템에 담는 방식**은 업계의 공통된 선택입니다.' },
    split: { type: 'split', title: 'AI 기술은 활용하고,\n**기준은 직접 설계합니다**', left: { kicker: '활용 — 공통 기술', items: ['기반 AI 모델', '생성 기술과 API', '기존 제작 도구'] }, right: { kicker: '설계 — 우리만의 기준', items: ['회사의 품질 기준', '조직별 디자인 자산', '조합 · 검수 · 승인 규칙'] }, note: '결과물의 **퀄리티와 일관성**은 우리 기준에서 나옵니다.' },
    stats: { type: 'stats', title: '지금 어디까지\n**와 있는가**', bars: [{ label: 'Platform · Flow', pct: 65, text: '시연 가능한 프로토타입' }, { label: 'Design Pack · 품질 체계', pct: 20, on: true, text: '결과의 퀄리티가 결정되는 영역' }, { label: '실업무 검증', pct: 10, text: '초기 검증 단계' }], note: '플랫폼이 아니라 **기준과 자산**이 퀄리티를 결정합니다.' },
    media: { type: 'media', title: '구조가 **작동하는 것**까지\n확인했습니다', specs: [{ label: 'Input', text: '기획 · 요구사항' }, { label: 'Engine', text: 'Generator — Page · Section · Variant 조합', on: true }, { label: 'Builder', text: 'Edit · Preview · Export' }, { label: 'Output', text: '수정 가능한 웹사이트' }], note: '현재 **이 구조가 작동하는 것**까지 확인했습니다.' },
    roadmap: { type: 'roadmap', title: '**세 단계**로 구분해\n진행합니다', months: [{ when: '8월', text: '기준 정의' }, { when: '9월', text: '2차 착수' }, { when: '10월', text: '테스트베드' }, { when: '11월', text: '적용' }, { when: '이후', text: '전사 연계 검토' }], steps: [{ when: 'Now', head: 'Prototype', items: ['Flow 안정화', 'Design Pack 제작', 'Demo 품질 확보'], state: 'now' }, { when: 'Next', head: 'Working Tool', items: ['실제 프로젝트 적용', '품질 비교', '2차 Agent 선정'] }, { when: 'Then', head: 'DRS', items: ['반복 사용 확인', 'Pack 확대', '전사 연계 검토'] }] },
    bigstat: { type: 'bigstat', title: '핵심 수치', value: '30%', caption: '**MVP 기준 진척도** — 구조 정의를 마치고 자산 구축 단계입니다', note: '수치의 **근거**를 함께 제시하세요.' },
    kpi: { type: 'kpi', title: '핵심 지표', items: [{ value: '65%', label: 'Platform' }, { value: '20%', label: 'Design Pack', tone: 'on' }, { value: '10%', label: '실업무 검증' }], note: '핵심 지표를 **한눈에** 정리합니다.' },
    table: { type: 'table', title: '표', columns: ['구분', '내용', '비고'], rows: [{ cells: ['첫 행', '내용', '—'] }, { cells: ['둘째 행', '내용', '—'] }] },
    timeline: { type: 'timeline', title: '진행 경과', items: [{ when: '2026. 06', head: '구조 설계', text: '핵심 구조와 계약 정의' }, { when: '2026. 07', head: '프로토타입', text: '생성 플로우 작동 확인', on: true }, { when: '2026. 08', head: '파일럿', text: '실무 적용 개시' }] },
    milestone: { type: 'milestone', title: '월별 **완료 기준**', phases: [{ tag: '현재', head: '준비', text: '기준 · 자산 정의' }, { tag: '다음', head: '적용', text: '실무 파일럿', on: true }], caption: '월별 완료 기준', bars: [{ label: '기준 정의', sub: '8월 — 자산 최초 정의', start: 1, span: 2 }, { label: '파일럿', sub: '9월 — 실무 적용', start: 2, span: 2 }, { label: '검증 · 확대', sub: '10월 — 품질 검증', start: 3, span: 2 }], axis: ['8월', '9월', '10월', '11월'] },
    process: { type: 'process', title: '하나의 결과물이 만들어지는\n**세 단계**', steps: [{ tag: '1단계', head: '기획\nAgent', text: '목적 · 요구사항 · 구조를 정의' }, { tag: '2단계', head: '디자인\nAgent', text: 'UX·UI 기준으로 화면을 구현' }, { tag: '3단계', head: '개발\nAgent', text: '코드 구현 · 배포' }], note: '같은 구조라도 **무엇을 탑재하느냐**에 따라 결과가 달라집니다.' },
    compare: { type: 'compare', title: '무엇이 **달라지는가**', items: [{ head: 'Before', items: ['담당자별 개인 파일 · 설정', '반복 설정을 매번 수작업', '버전이 바뀌면 재작업'] }, { head: 'After', items: ['공통 입력 규격', '표준 Workflow가 반복 처리', '자막 · 버전 · 포맷 자동 생성'] }], note: '반복 공정이 **표준 Workflow**로 바뀝니다.' },
    quote: { type: 'quote', text: '무엇이 **좋은 결과**인지\n누가, 어떤 기준으로\n판단할 것인가?', by: 'The Question' },
    position: { type: 'position', title: '흐름 속\n**우리 위치**', panels: [{ tag: '1 · 이전', head: '이전 단계', text: '설명' }, { tag: '2 · 우리', head: '**우리 위치**', text: '핵심 역할 설명' }, { tag: '3 · 다음', head: '다음 단계', text: '설명' }] },
    checklist: { type: 'checklist', title: '체크리스트', items: ['확인 항목을 입력하세요', '확인 항목을 입력하세요', '확인 항목을 입력하세요'] },
    lineup: { type: 'lineup', title: '업무별 구성\n**Line-up**', items: [{ tag: 'Product / Web', head: 'Web\nGenerator', badge: '현재 프로토타입', text: '기획 입력 → 생성 → 수정 · 출력' }, { tag: 'Motion', head: 'Motion\nWorkflow', badge: '일부 실사용', text: '반복 편집 · 버전 · 포맷 제작' }, { head: 'Visual\nGenerator', badge: '후보', state: 'dim', text: '행사 · 캠페인 자산' }, { head: 'Presentation\nAgent', badge: '후보', state: 'dim', text: '발표자료 초안 · 검수' }], note: '**효과와 반복성이 큰 순서**로 구체화합니다.' },
    branch: { type: 'branch', title: '디자인 업무는\n**전 영역**에 걸쳐 있습니다', branches: [{ label: 'ExD팀', head: '전사 행사 · 브랜드' }, { label: '사업 추진실', head: '상품 MBM · 행사' }, { label: '상품개발조직', head: '상품 UI · UX' }], lead: { label: 'Needed', text: '세 영역이 함께 참조할 **기준과 자산**' }, note: 'AI 도입으로 기준과 자산의 **일원화가 실질적 과제**가 되었습니다.' },
    highlight: { type: 'highlight', title: 'Live\n**Demo**', items: [{ head: 'AX Web Generator', text: '기획 입력 → 웹 생성 → Builder 수정 → Export' }, { head: 'Motion Workflow', text: '실작동 영상 재생' }], footnote: '' },
    board: { type: 'board', title: '__Running Today.__\n**Building Next.**', cards: [{ tag: '01', head: 'AX Web\nGenerator', text: '생성 Flow 작동 확인' }, { tag: '02', head: 'Motion\nWorkflow', text: '반복 공정 표준화' }], side: { title: '병행한 현업 — 최근 6개월', items: ['핵심 상품 UX · 화면 오픈', '전사 행사 · 사업 MBM', '영상 콘텐츠 제작'], pills: ['MIDAS WEEK', 'ONSITE UX·UI'] }, note: '진행 중인 **두 가지**를 순서대로 말씀드리겠습니다.' },
    closing: { type: 'closing', label: 'From Prototype to System', title: '__The Machine\nThat Builds Design__\n**has started running.**', sub: '첫 번째 디자인 Agent가 작동하는 것까지 확인했습니다. **기준과 자산을 담는 일**은 이제 시작입니다.', nextLabel: 'Standard', contacts: [{ v: 'Repeatable Quality' }] }
  };

  var SCHEMA_DOC = CATALOG.map(function (c) {
    return c.type + '(' + c.label + '): ' + c.use;
  }).join('\n');
  var FIELD_DOC =
    'cover:{label?(로고명),docLabel?(부제),eyebrow?("Prologue — 01"류),date?,title(Archivo 대형 \\n 2~3줄, **강조**=화이트 500),band?(리드, **강조**=화이트)} | ' +
    'statement:{title(영문 대형 \\n, **키워드**=포인트색),sub(좌측 리드, **강조**),cols?:[{tag,text("A **→ B**")}](2개)} | ' +
    'toc:{title?,items:[{label("Chapter 1. 제목"),desc(한 줄),pages?:"04"}](3~5개)} | ' +
    'divider:{no?:"01",title(영문 대문자 1~3단어 \\n 줄바꿈 — 아웃라인 스트로크로 크게),lead(국문 헤드라인, **강조**, \\n),text?(보조 2~3문장)} | ' +
    'section:{title,points:[{no?,head,text}](3~4개),tag?,sub?,note?(풋라인 문장, **강조**)} | ' +
    'cards:{title,cards:[{head(원 안 이름),tag?(원 안 라벨),text?(원 아래 설명),tone?:"dark"}](2~4개),sub?,note?} | ' +
    'split:{title?,left:{kicker,items:[str],foot?},right:{kicker,items:[str],foot?},note?} — 좌 흐림/우 강조 | ' +
    'stats:{title,bars:[{label,pct:0~100,on?:true(중앙 대형 링),text?}](1~3개),sub?,note?} — 링 도넛 | ' +
    'media:{title,specs:[{label(짧은 영문),text,on?:true(그라데이션 강조 행)}](3~5개),image?:{label},caption?,sub?,note?} | ' +
    'roadmap:{title,steps:[{when:"Now|Next|Then",head,items:[str],state?:"now"}](3개),months?:[{when:"8월",text}](4~5개 상단 chevron 밴드),sub?,note?} | ' +
    'bigstat:{title,value,caption?(**강조**),note?} | ' +
    'kpi:{title,items:[{value,label,desc?,tone?:"on"}](2~4개),sub?,note?} | ' +
    'table:{title,columns:[str],rows:[{cells:[str]}],sub?,note?} | ' +
    'timeline:{title,items:[{when,head,text?,on?:true}](3~5개),sub?,note?} | ' +
    'milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),caption?,bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[월 라벨 4~6],note?} | ' +
    'process:{title,steps:[{tag:"1단계"류,head(\\n 2줄 가능),text?}](3~4개),accent?:강조 인덱스(기본 중앙 — 대형 그라데이션 원),sub?,note?} | ' +
    'compare:{title,items:[{head:"Before|After",items:[str 3~4개 짧게]}](2개),sub?,note?} — 원 2개 | ' +
    'quote:{text(질문·인용, **강조**=코랄, \\n),by?(라벨)} | ' +
    'position:{title,panels:[{tag,head(**굵게**),text?}](3개),accent?,note?} | ' +
    'checklist:{title,items:[str],cols?:1~2,sub?,note?} | ' +
    'lineup:{title,items:[{tag?(분야),head(이름 \\n 2줄 가능),text,badge?(상태),state?:"dim"(후보=점선 원)}](4개),sub?,note?} | ' +
    'branch:{title,branches:[{label(조직명),head(역할),text?}](3개 — 벤다이어그램),lead?:{label,text(**굵게**)},sub?,note?} | ' +
    'highlight:{title(영문 대형 \\n, **강조**),items:[{no?,head,text?}](2~3개),footnote?} | ' +
    'board:{title(2톤: __흐림__+**강조**),cards:[{tag:"01",head(\\n 2줄 가능),text?}](2개 — 원),side?:{title,items:[str],pills?:[str]},note?} | ' +
    'closing:{label?,title(2톤: __흐림__ 줄+**강조** 줄, \\n),sub?(**강조**),nextLabel?,contacts?:[{v}]}' +
    '\n규칙: note=하단 풋라인 문장(장당 1개, **강조** 1회) — 본문 장엔 적극 넣는다. 챕터 컬러는 간지 순서 자동(시안→틸→블루→코랄→딥블루). ' +
    'divider.title은 영문 1~3단어(대문자 스트로크용) — 국문 메시지는 lead에. title은 의미 단위 \\n 줄바꿈. 이모지 금지.';

  var DEFAULT_DECK = {
    style: 'sfmi',
    slides: [
      STARTERS.cover, STARTERS.statement, STARTERS.toc,
      STARTERS.divider, STARTERS.cards, STARTERS.quote,
      { type: 'divider', title: 'The\nSystem', lead: '기준을 담아 실행하는\n**구조**' },
      STARTERS.branch, STARTERS.lineup, STARTERS.stats,
      { type: 'divider', title: "What's\nNext", lead: '효과가 확인된 단계부터\n**넓혀갑니다**' },
      STARTERS.roadmap, STARTERS.closing
    ]
  };

  function sfmiTemplateDeck() {
    var slides = CATALOG.map(function (c) {
      return JSON.parse(JSON.stringify(STARTERS[c.type]));
    });
    return { slides: slides, style: 'sfmi' };
  }

  /* ---- 결정론 폴백 ---- */
  function sfmiComposeDeck(brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || '보고';
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 5);
    var slides = [{ type: 'cover', label: 'MIDAS Design AX', eyebrow: 'Prologue — 01', title: title, band: brief.message || '', docLabel: brief.audience || '' }];
    if (outline.length > 1) slides.push({ type: 'toc', title: 'Contents', items: outline.map(function (o) { return { label: o, desc: '' }; }) });
    outline.forEach(function (o, i) {
      slides.push({ type: 'divider', title: o, lead: '' });
      slides.push(JSON.parse(JSON.stringify(i % 2 ? STARTERS.cards : STARTERS.section)));
    });
    slides.push(JSON.parse(JSON.stringify(STARTERS.closing)));
    return { slides: slides, style: 'sfmi' };
  }

  window.renderSfmiDeck = renderSfmiDeck;
  window.renderSfmiViewer = renderSfmiViewer;
  window.sfmiTemplateDeck = sfmiTemplateDeck;
  window.SFMI_SCHEMA_DOC = SCHEMA_DOC;
  window.SFMI_FIELD_DOC = FIELD_DOC;
  window.sfmiComposeDeck = sfmiComposeDeck;
  window.SFMI_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.SFMI_MV_SEL = MV_SEL;
  window.SFMI_DEFAULT_DECK = DEFAULT_DECK;
  window.SFMI_CATALOG = CATALOG;
  window.SFMI_STYLE = { id: 'sfmi', name: 'SFMI Report', desc: '래디얼 시안 · 원형 모티프 · 사선 대시 · 16:9', swatch: 'radial-gradient(120% 100% at 60% 100%,#E8F6FB 0%,#7ECFE5 55%,#3FB6D6 100%)' };
  window.SFMI_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.sfmiNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.section)); };
})();
