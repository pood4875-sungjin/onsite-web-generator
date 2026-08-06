/* packs.machine.js — "AX Machine" PPT 팩 (네이버스타일 (3).pdf 실측 — The Machine That Builds Design)
   소스: ~/Downloads/네이버스타일 (3).pdf 19장 (1000pt → 1280×720, ×1.28)
   시스템: 다크(#14181F)·화이트 교대 지면 + 네이버그린(#40C057) 단일 액센트 + 사진 배경 커버/엔딩(assets/mx-cover·mx-closing)
   + 영문 빅타이포 2~3톤(화이트 300/800 + 딤) + 그린 캡션 트래킹 + 풋라인(보더탑+문장)
   + 진행률 게이지·로드맵 타임라인·그린 틴트 밴드. 프리픽스 nx- (mx-는 밀스톤 공용과 충돌).
   마크업: **볼드**, __뮤트(딤)__ — 인용·풋라인의 **는 그린. */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<span class="mut">$1</span>'); }
  function de(path) { return ' data-edit="' + path + '"'; }
  function noNum(t) { t = String(t == null ? '' : t); var m = t.trim(); return /^\d{1,2}\s*[.)·:]?$/.test(m) ? '' : t.replace(/^\s*\d{1,2}\s*[.)·:]\s+/, ''); }
  /* 타이틀 강약 폴백 — **없으면 멀티라인=마지막 줄, 한 줄=뒤 40% 어절 볼드 */
  function emph(t) {
    t = String(t == null ? '' : t);
    if (!t || t.indexOf('**') !== -1 || t.indexOf('__') !== -1) return t;
    var lines = t.split('\n');
    if (lines.length > 1) { lines[lines.length - 1] = '**' + lines[lines.length - 1] + '**'; return lines.join('\n'); }
    var ws = t.split(' ');
    if (ws.length < 3) return t;
    var k = Math.max(1, Math.ceil(ws.length * 0.4));
    return ws.slice(0, ws.length - k).join(' ') + ' **' + ws.slice(ws.length - k).join(' ') + '**';
  }

  var GREEN = '#FF5500'   /* [시연] 포인트 = 주황 */, INK = '#14181F';
  var PROD = 'https://midas-drs.pages.dev/app/';
  var BASE = (function () { try { var sc = document.currentScript && document.currentScript.src || ''; return sc ? sc.slice(0, sc.lastIndexOf('/') + 1) : ''; } catch (e) { return ''; } })();
  BASE = BASE.replace(/packs\/(ppt|web|edm)\/$/, 'app/');   /* 팩=루트 packs/ — 자산은 app/bg 기준 */
  /* file:// 스튜디오는 srcdoc iframe에서 로컬 이미지 로드가 막힐 수 있어 프로드 자산으로 강제 */
  if (!BASE || BASE.indexOf('file:') === 0) BASE = PROD;
  function aurl(f) { return BASE + 'bg/' + f; }

  /* ---- 공통 조각 ---- */
  function runhead(s, P, ctx, mode) { /* mode: '', 'dk'(다크), 'gr'(그린 지면) */
    var pg = (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '');
    var kick = s.kicker != null ? s.kicker : '';
    return '<div class="nx-run ' + (mode || '') + '"><span class="nx-runl"' + de(P + '.kicker') + '>' + esc(kick) + '</span><span class="nx-runr">' + pg + '</span></div>';
  }
  function headline(s, P, big) {
    return '<h2 class="nx-hl' + (big ? ' big' : '') + '"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>';
  }
  function sub(s, P) { return s.sub ? '<p class="nx-sub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : ''; }
  /* 풋라인 — 보더탑 + 문장 (**=그린 700). noteR 있으면 우측 보조 캡션 */
  function footline(s, P, dk) {
    if (!s.note && !s.noteR) return '';
    return '<div class="nx-foot' + (dk ? ' dk' : '') + '">' +
      (s.note ? '<span class="nx-ftx"' + de(P + '.note') + '>' + mb(s.note) + '</span>' : '<span></span>') +
      (s.noteR ? '<span class="nx-ftr"' + de(P + '.noteR') + '>' + mb(s.noteR) + '</span>' : '') + '</div>';
  }
  function kind(s, d) { return esc(s.kindLabel || d); }
  function dash() { return '<span class="nx-dash"></span>'; }

  /* ---- 타입 렌더러 ---- */
  var R = {
    /* 표지 — 다크 사진 배경 + 3톤 대형 타이틀 + 그린 대시 캡션. 원본 01 */
    cover: function (s, P, ctx) {
      return '<section class="slide nx cv" data-kind="' + kind(s, 'Cover') + '">' +
        '<div class="nx-photo" style="background-image:url(' + aurl('machine-cover.jpg') + ')"></div><div class="nx-shade"></div>' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'PROLOGUE' }, P, { no: 1 }, 'dk') +
        '<div class="sp"></div>' +
        '<h1 class="nx-cvtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.band ? '<div class="nx-cvlead">' + dash() + '<span' + de(P + '.band') + '>' + mb(s.band) + '</span></div>' : '') +
        '<div class="sp"></div>' +
        '<div class="nx-cvfoot"><span' + de(P + '.label') + '>' + esc(s.label || 'MIDAS DESIGN AX') + '</span><span' + de(P + '.date') + '>' + esc(s.date || '') + '</span></div></section>';
    },
    /* 그린 선언 — 풀블리드 그린 + 대형 화이트 + 하단 2열 미니 비교. 원본 02 */
    statement: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cols.' + i;
        return '<div class="nx-stcol"><span class="tg"' + de(IP + '.tag') + '>' + esc(c.tag || '') + '</span><span class="ln"></span>' +
          '<span class="tx"' + de(IP + '.text') + '>' + mb(c.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx st" data-kind="' + kind(s, 'Statement') + '">' +
        runhead(s, P, ctx, 'gr') +
        '<div class="sp"></div>' +
        '<h1 class="nx-sttitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (cols ? '<div class="nx-stcols">' + cols + '</div>' : '') + '<div class="sp s"></div></section>';
    },
    /* 목차 — 다크 5행(번호 그린·챕터·설명·페이지 범위). 원본 03 */
    toc: function (s, P, ctx) {
      var items = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="nx-tocrow"><span class="no"' + de(IP + '.no') + '>' + esc(it.no || ('0' + (i + 1))) + '</span>' +
          '<span class="ch' + (it.on ? ' on' : '') + '"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          '<span class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</span>' +
          '<span class="pg"' + de(IP + '.pages') + '>' + esc(it.pages || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx tc" data-kind="' + kind(s, 'Contents') + '">' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'CONTENTS' }, P, ctx, 'dk') +
        '<h2 class="nx-tctitle"' + de(P + '.title') + '>' + esc(String(s.title || 'Contents').replace(/\*\*/g, '')) + '</h2>' +
        '<div class="nx-toclist">' + items + '</div></section>';
    },
    /* 2열 리스트 — 좌/우 톤 지정(num·dim·dash·bold). 원본 04·07 */
    twocol: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cols.' + i;
        var tone = c.tone || (i === 0 ? 'num' : 'dash');
        var items = (c.items || []).map(function (it, j) {
          var t = typeof it === 'string' ? it : (it.text || '');
          var pre = tone === 'num' ? '<i>' + (j < 9 ? '0' : '') + (j + 1) + '</i>' : (tone === 'dash' ? '<i>—</i>' : '');
          return '<li>' + pre + '<span' + de(IP + '.items.' + j) + '>' + mb(noNum(t)) + '</span></li>';
        }).join('');
        return '<div class="nx-2col ' + tone + (c.green ? ' grn' : '') + '"><span class="hd"' + de(IP + '.tag') + '>' + esc(c.tag || '') + '</span>' +
          '<ul>' + items + '</ul></div>';
      }).join('');
      return '<section class="slide nx c2" data-kind="' + kind(s, 'List') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-2grid">' + cols + '</div>' + footline(s, P) + '</section>';
    },
    /* 리스트 + 세로바 인용 — 우측 그린 바 + 큰 질문(**=그린). 원본 05 */
    quote: function (s, P, ctx) {
      var items = (s.items || []).map(function (it, i) {
        var t = typeof it === 'string' ? it : (it.text || '');
        return '<li' + de(P + '.items.' + i) + '>' + mb(noNum(t)) + '</li>';
      }).join('');
      return '<section class="slide nx qt" data-kind="' + kind(s, 'Quote') + '">' +
        runhead(s, P, ctx) + headline(s, P) +
        '<div class="nx-qgrid"><div class="nx-qlist"><span class="hd"' + de(P + '.tag') + '>' + esc(s.tag || '') + '</span><ul>' + items + '</ul></div>' +
        '<div class="nx-qbar"></div>' +
        '<p class="nx-qtx"' + de(P + '.quote') + '>' + mb(s.quote || '') + '</p></div>' + footline(s, P) + '</section>';
    },
    /* 레퍼런스 카드 3열 — 굵은 그린 라인 + 영문 타이틀 + 그린 캡션 + 출처. 원본 06 */
    refcards: function (s, P, ctx) {
      var items = (s.items || []).slice(0, 4).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="nx-ref"><span class="ln"></span><b class="tt"' + de(IP + '.title') + '>' + esc(noNum(it.title || '')) + '</b>' +
          '<span class="cp"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          '<p class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</p></div>';
      }).join('');
      return '<section class="slide nx rf" data-kind="' + kind(s, 'Reference') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-refgrid n' + Math.min(4, Math.max(2, (s.items || []).length)) + '">' + items + '</div>' +
        (s.source ? '<p class="nx-src"' + de(P + '.source') + '>' + mb(s.source) + '</p>' : '') + '</section>';
    },
    /* 라인 카드 3~4열 + 그린 틴트 밴드. 원본 08·12 */
    linecards: function (s, P, ctx) {
      var n = Math.min(4, Math.max(2, (s.items || []).length));
      var items = (s.items || []).slice(0, 4).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="nx-lc"><span class="ln"></span><span class="cp"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          '<b class="tt"' + de(IP + '.title') + '>' + ml(noNum(it.title || '')) + '</b>' +
          (it.desc ? '<p class="ds"' + de(IP + '.desc') + '>' + mb(it.desc) + '</p>' : '') + '</div>';
      }).join('');
      var band = s.band ? '<div class="nx-band">' + (s.bandTag ? '<span class="bt"' + de(P + '.bandTag') + '>' + esc(s.bandTag) + '</span>' : '') +
        '<span class="bx"' + de(P + '.band') + '>' + mb(s.band) + '</span></div>' : '';
      return '<section class="slide nx lc' + n + '" data-kind="' + kind(s, 'Cards') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-lcgrid n' + n + '">' + items + '</div>' + band + footline(s, P) + '</section>';
    },
    /* 빅넘버 4열 — 대형 그린 숫자 + 라인 + 타이틀 + 설명. 원본 09 */
    bignum: function (s, P, ctx) {
      var items = (s.items || []).slice(0, 4).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="nx-bn"><span class="no"' + de(IP + '.no') + '>' + esc(it.no || ('0' + (i + 1))) + '</span><span class="ln"></span>' +
          '<b class="tt"' + de(IP + '.title') + '>' + esc(noNum(it.title || '')) + '</b>' +
          '<p class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</p></div>';
      }).join('');
      return '<section class="slide nx bn" data-kind="' + kind(s, 'Numbers') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-bngrid">' + items + '</div>' + footline(s, P) + '</section>';
    },
    /* 어젠다 상태 카드 4열 — on=그린 굵은 라인·상태 캡션 / off=회색. 원본 10 */
    agenda: function (s, P, ctx) {
      var items = (s.items || []).slice(0, 4).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="nx-ag' + (it.on ? ' on' : '') + '"><span class="ln"></span><span class="cp"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          '<b class="tt"' + de(IP + '.title') + '>' + ml(noNum(it.title || '')) + '</b>' +
          (it.state ? '<span class="stt"' + de(IP + '.state') + '>' + esc(it.state) + '</span>' : '') +
          '<p class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</p></div>';
      }).join('');
      return '<section class="slide nx ag" data-kind="' + kind(s, 'Agenda') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-aggrid">' + items + '</div>' + footline(s, P) + '</section>';
    },
    /* 3스텝 프로세스 — 중앙 그린 필 강조. 원본 11 */
    process: function (s, P, ctx) {
      var items = (s.items || []).slice(0, 3).map(function (it, i) {
        var IP = P + '.items.' + i;
        var on = it.on != null ? !!it.on : i === 1;
        return '<div class="nx-pc' + (on ? ' on' : '') + '"><span class="cp"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          '<b class="tt"' + de(IP + '.title') + '>' + ml(noNum(it.title || '')) + '</b>' +
          '<p class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</p></div>';
      }).join('');
      return '<section class="slide nx pr" data-kind="' + kind(s, 'Process') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-prlab"><span class="cp"' + de(P + '.tag') + '>' + esc(s.tag || '') + '</span><span class="ln"></span>' +
        (s.tagR ? '<span class="cr"' + de(P + '.tagR') + '>' + esc(s.tagR) + '</span>' : '') + '</div>' +
        '<div class="nx-prgrid">' + items + '</div>' + footline(s, P) + '</section>';
    },
    /* 다크 섹션 히어로 — 초대형 2톤 + 좌 리드/미니 2열 + 우 리스트. 원본 13 */
    darkhero: function (s, P, ctx) {
      var mini = (s.items || []).slice(0, 2).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="nx-dhmini"><span class="cp"' + de(IP + '.tag') + '>' + esc(it.tag || '') + '</span>' +
          '<b class="tt"' + de(IP + '.title') + '>' + esc(noNum(it.title || '')) + '</b>' +
          '<p class="ds"' + de(IP + '.desc') + '>' + mb(it.desc || '') + '</p></div>';
      }).join('');
      var side = (s.side || []).map(function (t, i) { return '<li' + de(P + '.side.' + i) + '>' + mb(t) + '</li>'; }).join('');
      return '<section class="slide nx dh" data-kind="' + kind(s, 'Section') + '">' +
        runhead(s, P, ctx, 'dk') +
        '<h1 class="nx-dhtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        '<div class="nx-dhgrid"><div class="nx-dhl"><span class="ln"></span><span class="cp"' + de(P + '.tag') + '>' + esc(s.tag || '') + '</span>' +
        (s.sub ? '<p class="ld"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') +
        (mini ? '<div class="nx-dhminis">' + mini + '</div>' : '') + '</div>' +
        '<div class="nx-dhr">' + (s.sideTag ? '<span class="cp"' + de(P + '.sideTag') + '>' + esc(s.sideTag) + '</span>' : '') +
        '<ul>' + side + '</ul></div></div>' + footline(s, P, 1) + '</section>';
    },
    /* 다크 스펙 시트 — 레일 캡션 행 + 그린 필 밴드. 원본 14 */
    /* 제품 실스크린샷 장 — 좌 rows(첫 행 다크 강조)/우 공식 UI 캡처(bg/gennx-*.jpg) */
    shot: function (s, P, ctx) {
      var rows = (s.rows || []).map(function (r, i) {
        var IP = P + '.rows.' + i;
        return '<div class="nx-shrow' + (i === 0 ? ' on' : '') + '"><i' + de(IP + '.tag') + '>' + esc(r.tag || '') + '</i><span' + de(IP + '.text') + '>' + mb(r.text || '') + '</span></div>';
      }).join('');
      /* 과거 fixBrand 오염("MIDAS GEN NX-1.jpg") 자가치유 → gennx-1.jpg */
      var img = String(s.img || 'gennx-1.jpg').replace(/MIDAS\s*GEN\s*NX(?=-\d)/i, 'gennx').replace(/[^a-zA-Z0-9._-]/g, '');
      return '<section class="slide nx sh" data-kind="' + kind(s, 'Product') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="nx-shgrid"><div class="nx-shrows">' + rows + '</div>' +
        '<figure class="nx-shimg"><img loading="lazy" alt="" src="' + aurl(img) + '" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + PROD + 'bg/' + img + '\';}else{this.closest(\'figure\').style.display=\'none\';}">' +
        (s.caption ? '<figcaption' + de(P + '.caption') + '>' + esc(s.caption) + '</figcaption>' : '') + '</figure></div>' + footline(s, P) + '</section>';
    },
    spec: function (s, P, ctx) {
      var rows = (s.rows || []).map(function (r, i) {
        var IP = P + '.rows.' + i;
        if (r.on) return '<div class="nx-sprow on"><span class="rl"' + de(IP + '.tag') + '>' + esc(r.tag || '') + '</span><span class="tx"' + de(IP + '.text') + '>' + mb(r.text || '') + '</span></div>';
        return '<div class="nx-sprow' + (r.green ? ' grn' : '') + '"><span class="rl"' + de(IP + '.tag') + '>' + esc(r.tag || '') + '</span><span class="tx"' + de(IP + '.text') + '>' + mb(r.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx sp2" data-kind="' + kind(s, 'Spec') + '">' +
        runhead(s, P, ctx, 'dk') +
        '<h2 class="nx-dktitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>' +
        '<div class="nx-spgrid">' + rows + '</div>' + footline(s, P, 1) + '</section>';
    },
    /* 다크 BEFORE/AFTER. 원본 15 */
    beforeafter: function (s, P, ctx) {
      function col(c, i, on) {
        var IP = P + '.cols.' + i;
        var items = (c.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="nx-ba' + (on ? ' on' : '') + '"><span class="ln"></span><span class="cp"' + de(IP + '.tag') + '>' + esc(c.tag || (on ? 'AFTER' : 'BEFORE')) + '</span><ul>' + items + '</ul></div>';
      }
      var cols = (s.cols || []).slice(0, 2);
      return '<section class="slide nx ba2" data-kind="' + kind(s, 'Before·After') + '">' +
        runhead(s, P, ctx, 'dk') +
        '<h2 class="nx-dktitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>' +
        '<div class="nx-bagrid">' + (cols[0] ? col(cols[0], 0, false) : '') + (cols[1] ? col(cols[1], 1, true) : '') + '</div>' +
        footline(s, P, 1) + '</section>';
    },
    /* 그린 데모 간지 — Live Demo + 2열 플로우. 원본 16 */
    demo: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cols.' + i;
        return '<div class="nx-dmcol"><span class="ln"></span><span class="hd"><i>' + '0' + (i + 1) + '</i><b' + de(IP + '.title') + '>' + esc(noNum(c.title || '')) + '</b></span>' +
          '<span class="tx"' + de(IP + '.text') + '>' + mb(c.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx dm" data-kind="' + kind(s, 'Demo') + '">' +
        runhead(s, P, ctx, 'gr') +
        '<div class="sp"></div>' +
        '<h1 class="nx-dmtitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        '<div class="nx-dmcols">' + cols + '</div><div class="sp s"></div></section>';
    },
    /* 다크 진행률 — 좌 대형 % + 우 게이지 rows(하이라이트 박스). 원본 17 */
    progress: function (s, P, ctx) {
      var rows = (s.rows || []).slice(0, 4).map(function (r, i) {
        var IP = P + '.rows.' + i;
        var pct = Math.max(0, Math.min(100, parseFloat(r.pct) || 0));
        var inner = '<div class="hd"><b class="tt"' + de(IP + '.label') + '>' + mb(r.label || '') + '</b><span class="pc"' + de(IP + '.pct') + '>' + esc(String(r.pct || 0)) + '%</span></div>' +
          '<div class="nx-track"><span class="nx-fill" style="width:' + pct + '%"></span></div>' +
          (r.cap ? '<p class="cp"' + de(IP + '.cap') + '>' + mb(r.cap) + '</p>' : '') +
          (r.cap2 ? '<p class="cp2"' + de(IP + '.cap2') + '>' + mb(r.cap2) + '</p>' : '');
        return r.on ? '<div class="nx-prow on">' + inner + '</div>' : '<div class="nx-prow">' + inner + '</div>';
      }).join('');
      return '<section class="slide nx pg2" data-kind="' + kind(s, 'Progress') + '">' +
        runhead(s, P, ctx, 'dk') +
        '<h2 class="nx-dktitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>' + (s.sub ? '<p class="nx-dksub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') +
        '<div class="nx-pggrid"><div class="nx-pgl"><span class="cp"' + de(P + '.bigLabel') + '>' + esc(s.bigLabel || '') + '</span>' +
        '<span class="big"><b' + de(P + '.big') + '>' + esc(String(s.big != null ? s.big : 0)) + '</b><i>%</i></span></div>' +
        '<div class="nx-pgr">' + rows + '</div></div></section>';
    },
    /* 차트 — 추이·비교 그래프. 그리기는 공통 자산(window.Charts)에 위임, 색은 machine 토큰 상속 */
    chart: function (s, P, ctx) {
      var dk = !!s.dark;
      var ch = (s.chart && window.Charts && window.Charts.render) ? window.Charts.render(s.chart, { path: P + '.chart' }) : '';
      var side = (s.stats || []).slice(0, 3).map(function (k, i) {
        var IP = P + '.stats.' + i;
        return '<div class="nx-chk' + (k.on ? ' on' : '') + '"><b' + de(IP + '.value') + '>' + esc(k.value || '') + '</b><span' + de(IP + '.label') + '>' + mb(k.label || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx chx' + (dk ? ' dk2' : '') + '" data-kind="' + kind(s, 'Chart') + '">' +
        runhead(s, P, ctx, dk ? 'dk' : '') +
        (dk ? '<h2 class="nx-dktitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h2>' +
          (s.sub ? '<p class="nx-dksub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '')
          : headline(s, P) + sub(s, P)) +
        '<div class="nx-chgrid' + (side ? '' : ' solo') + '"><div class="nx-chbox">' + ch + '</div>' +
        (side ? '<div class="nx-chside">' + side + '</div>' : '') + '</div>' +
        footline(s, P, dk) + '</section>';
    },
    /* 로드맵 — NOW/NEXT/THEN 3열 + 하단 타임라인 바. 원본 18 */
    roadmap: function (s, P, ctx) {
      var cols = (s.items || []).slice(0, 3).map(function (it, i) {
        var IP = P + '.items.' + i;
        var lis = (it.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        var tone = i === 0 ? 'now' : (i === 1 ? 'next' : 'then');
        return '<div class="nx-rm ' + tone + '"><span class="ln"></span><span class="cp"' + de(IP + '.tag') + '>' + esc(it.tag || ['NOW', 'NEXT', 'THEN'][i]) + '</span>' +
          '<b class="tt"' + de(IP + '.title') + '>' + ml(noNum(it.title || '')) + '</b><ul>' + lis + '</ul></div>';
      }).join('');
      var tl = (s.timeline || []).map(function (t, i) {
        var IP = P + '.timeline.' + i;
        return '<div class="nx-tlc' + (t.dim ? ' dim' : '') + '"><b' + de(IP + '.label') + '>' + esc(t.label || '') + '</b><span' + de(IP + '.text') + '>' + mb(t.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx rm2" data-kind="' + kind(s, 'Roadmap') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="nx-rmgrid">' + cols + '</div>' +
        (tl ? '<div class="nx-tl">' + tl + '</div>' : '') + '</section>';
    },
    /* 엔딩 — 다크 사진 + 딤/볼드 타이틀 + 하단 보더 2열. 원본 19 */
    closing: function (s, P, ctx) {
      return '<section class="slide nx cl" data-kind="' + kind(s, 'Closing') + '">' +
        '<div class="nx-photo" style="background-image:url(' + aurl('machine-closing.jpg') + ')"></div><div class="nx-shade cl"></div>' +
        runhead({ kicker: s.kicker != null ? s.kicker : 'FROM PROTOTYPE TO SYSTEM' }, P, ctx, 'dk') +
        '<div class="sp"></div>' +
        '<h1 class="nx-cltitle"' + de(P + '.title') + '>' + mb(emph(s.title || '')) + '</h1>' +
        (s.band ? '<div class="nx-cvlead">' + dash() + '<span' + de(P + '.band') + '>' + mb(s.band) + '</span></div>' : '') +
        '<div class="sp"></div>' +
        '<div class="nx-clfoot">' + (s.note ? '<span class="l"' + de(P + '.note') + '>' + mb(s.note) + '</span>' : '<span></span>') +
        (s.noteR ? '<span class="r"' + de(P + '.noteR') + '>' + mb(s.noteR) + '</span>' : '') + '</div></section>';
    },
    /* 밀스톤 간트 — 공통 ms-* (그린 팔레트) */
    milestone: function (s, P, ctx) {
      var months = s.months && s.months.length ? s.months : ['1월', '2월', '3월', '4월', '5월', '6월'];
      var rows = (s.rows || []).slice(0, 6);
      var unit = 100 / months.length;
      var head = months.map(function (m, i) { return '<span class="ms-m"' + de(P + '.months.' + i) + '>' + esc(m) + '</span>'; }).join('');
      var body = rows.map(function (r, i) {
        var IP = P + '.rows.' + i;
        var st = Math.max(0, Math.min(months.length - 0.5, parseFloat(r.start) || 0));
        var lenMax = months.length - st;
        var lnRaw = parseFloat(r.len); if (!(lnRaw > 0)) lnRaw = 1;
        var ln = Math.max(0.5, Math.min(lenMax, lnRaw));
        var lab = '<span class="ms-lab"' + de(IP + '.label') + '>' + esc(noNum(r.label || '')) + '</span>';
        var bar = '<div class="ms-lane"><span class="ms-bar' + (r.on ? ' on' : '') + '" style="left:' + (st * unit) + '%;width:' + (ln * unit) + '%">' +
          (r.tag ? '<i' + de(IP + '.tag') + '>' + esc(r.tag) + '</i>' : '') + '</span></div>';
        return '<div class="ms-row">' + lab + bar + '</div>';
      }).join('');
      var phases = (s.phases || []).slice(0, 4).map(function (p, i) {
        var IP = P + '.phases.' + i;
        return '<div class="ms-phase"><b' + de(IP + '.label') + '>' + esc(p.label || '') + '</b><span' + de(IP + '.text') + '>' + mb(p.text || '') + '</span></div>';
      }).join('');
      return '<section class="slide nx ms" data-kind="' + kind(s, 'Milestone') + '">' +
        runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="ms-chart"><div class="ms-head">' + head + '</div><div class="ms-body">' + body + '</div></div>' +
        (phases ? '<div class="ms-phases">' + phases + '</div>' : '') + footline(s, P) + '</section>';
    }
  };

  /* ---- CSS ---- */
  var CSS = [
    '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");',
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{background:#0F1217}',
    '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:28px;padding:28px 0}',
    '.slide{position:relative;width:1280px;height:720px;flex:0 0 auto;overflow:hidden;background:#fff;color:#14181F;',
    " font-family:'Pretendard Variable',Pretendard,-apple-system,sans-serif;display:flex;flex-direction:column;padding:44px 80px 50px;isolation:isolate}",
    '.slide .sp{flex:1 1 0}.slide .sp.s{flex:.55}',
    'b{font-weight:800}.mut{color:#575C64;font-weight:300}',
    /* 러닝 헤더 */
    '.nx-run{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #E4E6E8;padding-bottom:13px;margin-bottom:6px}',
    '.nx-runl{font-size:12px;font-weight:800;letter-spacing:.2em;color:' + GREEN + ';text-transform:uppercase}',
    '.nx-runr{font-size:12px;letter-spacing:.14em;color:#9AA0A6}',
    '.nx-run.dk{border-color:rgba(255,255,255,.13)}.nx-run.dk .nx-runr{color:#6D6F74}',
    '.nx-run.gr{border-color:rgba(20,24,31,.28)}.nx-run.gr .nx-runl{color:' + INK + '}.nx-run.gr .nx-runr{color:rgba(20,24,31,.55)}',
    /* 타이틀·서브·풋라인 */
    '.nx-hl{font-size:44px;line-height:1.32;font-weight:300;letter-spacing:-.015em;margin-top:26px}.nx-hl.big{font-size:50px}',
    '.nx-sub{font-size:16px;color:#6D6F74;margin-top:12px;font-weight:400}',
    '.nx-foot{margin-top:auto;border-top:1.5px solid #14181F;padding-top:16px;display:flex;justify-content:space-between;align-items:baseline;gap:24px}',
    '.nx-foot .nx-ftx{font-size:17.5px;font-weight:400;color:#33363B}.nx-foot .nx-ftx b{color:' + GREEN + ';font-weight:800}',
    '.nx-foot .nx-ftr{font-size:12.5px;color:#9AA0A6;white-space:nowrap}',
    '.nx-foot.dk{border-top-color:rgba(255,255,255,.22)}.nx-foot.dk .nx-ftx{color:#C9CDD2}.nx-foot.dk .nx-ftx b{color:' + GREEN + '}',
    '.nx-dash{display:inline-block;width:58px;height:4px;background:' + GREEN + ';flex:0 0 auto}',
    /* 다크 공통 */
    '.slide.tc,.slide.dh,.slide.sp2,.slide.ba2,.slide.pg2{background:#14181F;color:#fff}',
    '.nx-dktitle{font-size:48px;font-weight:300;letter-spacing:-.01em;line-height:1.25;margin-top:30px;color:#575C64}.nx-dktitle b{color:#fff}',
    '.nx-dksub{font-size:15.5px;color:#8B9097;margin-top:12px}.nx-dksub b{color:' + GREEN + ';font-weight:700}',
    /* 표지·엔딩 */
    '.slide.cv,.slide.cl{background:#0D1015;color:#fff}',
    '.nx-photo{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.9;z-index:-2}',
    '.nx-shgrid{flex:1;display:grid;grid-template-columns:0.92fr 1.08fr;gap:42px;min-height:0;align-items:stretch}',
    '.nx-shrows{display:flex;flex-direction:column;justify-content:center}',
    '.nx-shrow{display:grid;grid-template-columns:128px 1fr;gap:18px;padding:19px 0;border-bottom:1px solid #E5E7EA;align-items:baseline}',
    '.nx-shrow i{font-style:normal;font-size:12.5px;font-weight:700;letter-spacing:.08em;color:#8A8F98;text-transform:uppercase}',
    '.nx-shrow span{font-size:16.5px;line-height:1.5;color:#30343B}',
    '.nx-shrow.on{background:#0B0E16;border-radius:14px;padding:19px 22px;border-bottom:0;margin-bottom:6px}',
    '.nx-shrow.on i{color:#FF5500}.nx-shrow.on span{color:#fff;font-weight:600}',
    '.nx-shimg{margin:0;display:flex;flex-direction:column;min-height:0}',
    '.nx-shimg img{flex:1;min-height:0;width:100%;object-fit:cover;border-radius:16px;background:#0B0E16}',
    '.nx-shimg figcaption{margin-top:10px;font-size:12.5px;color:#8A8F98}',
    '.nx-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,13,18,.92) 0%,rgba(10,13,18,.55) 46%,rgba(10,13,18,.28) 100%);z-index:-1}',
    '.nx-shade.cl{background:linear-gradient(180deg,rgba(10,13,18,.62) 0%,rgba(10,13,18,.4) 45%,rgba(10,13,18,.86) 100%)}',
    '.nx-cvtitle{font-size:64px;line-height:1.16;font-weight:300;letter-spacing:-.02em;color:#E7E9EC}.nx-cvtitle b{font-weight:800;color:#fff}.nx-cvtitle .mut{color:rgba(231,233,236,.34);font-weight:300}',
    '.nx-cvlead{display:flex;align-items:center;gap:22px;margin-top:34px}.nx-cvlead span{font-size:15.5px;letter-spacing:.06em;color:#C9CDD2}.nx-cvlead b{color:#fff;font-weight:700}',
    '.nx-cvfoot{display:flex;justify-content:space-between;font-size:12px;letter-spacing:.22em;color:#8B9097;text-transform:uppercase}',
    '.nx-cltitle{font-size:58px;line-height:1.3;font-weight:300;color:rgba(231,233,236,.42)}.nx-cltitle b{font-weight:800;color:#fff}',
    '.nx-clfoot{border-top:1px solid rgba(255,255,255,.22);padding-top:18px;display:flex;justify-content:space-between;align-items:flex-end;gap:30px}',
    '.nx-clfoot .l{font-size:18px;color:#E7E9EC}.nx-clfoot .l b{color:' + GREEN + ';font-weight:800}',
    '.nx-clfoot .r{font-size:12.5px;line-height:1.7;color:#8B9097;text-align:right;white-space:pre-line}',
    /* 그린 지면(선언·데모) */
    '.slide.st,.slide.dm{background:' + GREEN + ';color:#fff}',
    '.nx-sttitle{font-size:72px;line-height:1.16;font-weight:300;letter-spacing:-.02em}.nx-sttitle b{font-weight:800}',
    '.nx-stcols{display:grid;grid-template-columns:1fr 1fr;gap:64px;margin-top:44px;max-width:900px}',
    '.nx-stcol{display:flex;flex-direction:column}.nx-stcol .tg{font-size:11.5px;letter-spacing:.2em;font-weight:700;color:rgba(255,255,255,.82);text-transform:uppercase}',
    '.nx-stcol .ln{height:1px;background:rgba(255,255,255,.75);margin:9px 0 12px}',
    '.nx-stcol .tx{font-size:19px;font-weight:400}.nx-stcol .tx b{font-weight:800}',
    /* 목차 */
    '.nx-tctitle{font-size:50px;font-weight:800;margin-top:26px}',
    '.nx-toclist{margin-top:34px;border-top:1px solid #262B33}',
    '.nx-tocrow{display:grid;grid-template-columns:52px 176px 1fr auto;align-items:baseline;gap:18px;padding:18.5px 0;border-bottom:1px solid #262B33}',
    '.nx-tocrow .no{font-size:13px;font-weight:800;color:' + GREEN + ';letter-spacing:.1em}',
    '.nx-tocrow .ch{font-size:12.5px;font-weight:800;letter-spacing:.18em;color:#8B9097;text-transform:uppercase}.nx-tocrow .ch.on{color:' + GREEN + '}',
    '.nx-tocrow .ds{font-size:20px;font-weight:300;color:#E7E9EC}.nx-tocrow .ds b{font-weight:800;color:#fff}',
    '.nx-tocrow .pg{font-size:12.5px;color:#6D6F74;letter-spacing:.1em}',
    /* 2열 리스트 */
    '.nx-2grid{display:grid;grid-template-columns:1fr 1fr;gap:76px;margin-top:36px}',
    '.nx-2col .hd{display:block;font-size:12px;letter-spacing:.22em;font-weight:700;color:#6D6F74;border-bottom:1.5px solid #14181F;padding-bottom:10px}',
    '.nx-2col.grn .hd{color:' + GREEN + ';border-bottom-color:' + GREEN + '}',
    '.nx-2col ul{list-style:none}',
    '.nx-2col li{display:flex;align-items:baseline;gap:16px;border-bottom:1px solid #E4E6E8;padding:15px 2px}',
    '.nx-2col li i{font-style:normal;font-size:11.5px;font-weight:700;letter-spacing:.08em;color:#9AA0A6;flex:0 0 auto}',
    '.nx-2col.grn li i{color:' + GREEN + '}',
    '.nx-2col.num li span{font-size:22px;font-weight:400}',
    '.nx-2col.dash li span{font-size:16.5px;color:#33363B}',
    '.nx-2col.dim li span{font-size:17px;color:#9AA0A6}',
    '.nx-2col.bold li span{font-size:17px;font-weight:700;color:#14181F}',
    '.nx-2col li b{font-weight:800}',
    /* 인용 */
    '.nx-qgrid{display:grid;grid-template-columns:1fr 4px 1fr;gap:44px;margin-top:44px;align-items:start}',
    '.nx-qlist .hd{display:block;font-size:11.5px;letter-spacing:.2em;font-weight:700;color:#6D6F74;margin-bottom:4px}',
    '.nx-qlist ul{list-style:none}.nx-qlist li{font-size:16px;color:#33363B;border-bottom:1px solid #E4E6E8;padding:12.5px 2px}',
    '.nx-qbar{width:4px;background:' + GREEN + ';height:100%;min-height:190px;margin-top:14px}',
    '.nx-qtx{font-size:32px;line-height:1.5;font-weight:300;margin-top:8px}.nx-qtx b{color:' + GREEN + ';font-weight:800}',
    /* 레퍼런스 카드 */
    '.nx-refgrid{display:grid;gap:52px;margin:auto 0}.nx-refgrid.n3{grid-template-columns:repeat(3,1fr)}.nx-refgrid.n2{grid-template-columns:repeat(2,1fr)}.nx-refgrid.n4{grid-template-columns:repeat(4,1fr)}',
    '.nx-ref .ln{display:block;height:3.5px;background:' + GREEN + '}',
    '.nx-ref .tt{display:block;font-size:26px;margin-top:20px;letter-spacing:-.01em}',
    '.nx-ref .cp{display:block;font-size:11.5px;font-weight:800;letter-spacing:.16em;color:' + GREEN + ';margin-top:10px;text-transform:uppercase}',
    '.nx-ref .ds{font-size:15px;line-height:1.75;color:#4E5157;margin-top:13px}',
    '.nx-src{margin-top:auto;font-size:11.5px;line-height:1.7;color:#9AA0A6}',
    /* 라인 카드 + 밴드 */
    '.nx-lcgrid{display:grid;gap:44px;margin-top:44px}.nx-lcgrid.n3{grid-template-columns:repeat(3,1fr)}.nx-lcgrid.n4{grid-template-columns:repeat(4,1fr)}.nx-lcgrid.n2{grid-template-columns:repeat(2,1fr)}',
    '.nx-lc .ln{display:block;height:3.5px;background:' + GREEN + '}',
    '.nx-lc .cp{display:block;font-size:11.5px;font-weight:700;letter-spacing:.16em;color:#6D6F74;margin-top:14px;text-transform:uppercase}',
    '.nx-lc .tt{display:block;font-size:21px;margin-top:7px;line-height:1.35}',
    '.nx-lc .ds{font-size:14.5px;line-height:1.7;color:#4E5157;margin-top:9px}',
    '.nx-band{margin-top:36px;background:#EBFBEE;padding:17px 26px;display:flex;align-items:baseline;gap:22px}',
    '.nx-band .bt{font-size:11.5px;font-weight:800;letter-spacing:.14em;color:' + GREEN + ';white-space:nowrap}',
    '.nx-band .bx{font-size:17px;color:#14181F}.nx-band .bx b{font-weight:800}',
    ''
  ].join('\n');

  CSS += [
    '',
    '.nx-bngrid{display:grid;grid-template-columns:repeat(4,1fr);gap:44px;margin:auto 0}',
    '.nx-bn .no{font-size:58px;font-weight:200;color:' + GREEN + ';letter-spacing:-.02em}',
    '.nx-bn .ln{display:block;height:1.5px;background:#14181F;margin:16px 0 14px}',
    '.nx-bn .tt{display:block;font-size:21px}',
    '.nx-bn .ds{font-size:15.5px;line-height:1.7;color:#6D6F74;margin-top:8px}',
    /* 어젠다 상태 카드 */
    '.nx-aggrid{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;margin-top:52px}',
    '.nx-ag .ln{display:block;height:1.5px;background:#C6C9CD}',
    '.nx-ag.on .ln{height:3.5px;background:' + GREEN + '}',
    '.nx-ag .cp{display:block;font-size:11px;font-weight:700;letter-spacing:.16em;color:#9AA0A6;margin-top:13px;text-transform:uppercase}',
    '.nx-ag .tt{display:block;font-size:22px;margin-top:7px;line-height:1.3;font-weight:800;color:#14181F}',
    '.nx-ag:not(.on) .tt{font-weight:400;color:#33363B}',
    '.nx-ag .stt{display:block;font-size:12px;font-weight:700;color:' + GREEN + ';margin-top:9px}',
    '.nx-ag:not(.on) .stt{color:#9AA0A6;font-weight:400}',
    '.nx-ag .ds{font-size:14px;line-height:1.65;color:#4E5157;margin-top:8px}',
    /* 프로세스 */
    '.nx-prlab{display:flex;align-items:center;gap:16px;margin-top:40px}',
    '.nx-prlab .cp{font-size:11.5px;font-weight:800;letter-spacing:.2em;color:#33363B;white-space:nowrap}',
    '.nx-prlab .ln{flex:1;height:1px;background:#C6C9CD}',
    '.nx-prlab .cr{font-size:12px;color:#9AA0A6;white-space:nowrap}',
    '.nx-prgrid{display:grid;grid-template-columns:1fr 1.25fr 1fr;gap:34px;margin-top:26px;align-items:stretch}',
    '.nx-pc{padding:26px 0 0;border-top:1.5px solid #C6C9CD}',
    '.nx-pc .cp{display:block;font-size:11px;font-weight:700;letter-spacing:.16em;color:#6D6F74;text-transform:uppercase}',
    '.nx-pc .tt{display:block;font-size:28px;font-weight:300;line-height:1.3;margin-top:12px}',
    '.nx-pc .ds{font-size:14px;color:#6D6F74;margin-top:16px}',
    '.nx-pc.on{background:' + GREEN + ';color:#fff;border-top:none;padding:30px 28px;margin:-14px 0}',
    '.nx-pc.on .cp{color:rgba(255,255,255,.85)}',
    '.nx-pc.on .tt{font-weight:800;font-size:33px}',
    '.nx-pc.on .ds{color:#fff;font-weight:500;margin-top:20px}',
    /* 다크 히어로 */
    '.nx-dhtitle{font-size:60px;font-weight:800;letter-spacing:-.015em;margin-top:34px;color:#fff}.nx-dhtitle .mut{color:#575C64;font-weight:300}',
    '.nx-dhgrid{display:grid;grid-template-columns:1.35fr 1fr;gap:70px;margin-top:44px;align-items:start}',
    '.nx-dhl .ln{display:block;height:3.5px;background:' + GREEN + ';width:100%}',
    '.nx-dhl .cp{display:block;font-size:11.5px;font-weight:800;letter-spacing:.2em;color:' + GREEN + ';margin-top:16px;text-transform:uppercase}',
    '.nx-dhl .ld{font-size:27px;font-weight:300;line-height:1.45;margin-top:11px;color:#E7E9EC}.nx-dhl .ld b{font-weight:800;color:#fff}',
    '.nx-dhminis{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:26px;border-top:1px solid #262B33;padding-top:18px}',
    '.nx-dhmini .cp{display:block;font-size:10.5px;font-weight:800;letter-spacing:.16em;color:' + GREEN + ';text-transform:uppercase}',
    '.nx-dhmini .tt{display:block;font-size:17.5px;color:#fff;margin-top:6px}',
    '.nx-dhmini .ds{font-size:13px;color:#8B9097;margin-top:5px;line-height:1.6}',
    '.nx-dhr .cp{display:block;font-size:11px;font-weight:700;letter-spacing:.18em;color:#6D6F74;margin-bottom:6px;text-transform:uppercase}',
    '.nx-dhr ul{list-style:none}',
    '.nx-dhr li{font-size:14.5px;color:#C9CDD2;padding:7.5px 0;font-weight:300}',
    '.nx-dhr li b{color:#fff;font-weight:800}',
    /* 스펙 시트 */
    '.nx-spgrid{margin-top:46px;border-top:1px solid #262B33}',
    '.nx-sprow{display:grid;grid-template-columns:168px 1fr;align-items:center;gap:26px;padding:19px 0;border-bottom:1px solid #262B33}',
    '.nx-sprow .rl{font-size:11.5px;font-weight:800;letter-spacing:.2em;color:#6D6F74;text-transform:uppercase}',
    '.nx-sprow.grn .rl{color:' + GREEN + '}',
    '.nx-sprow .tx{font-size:17px;color:#E7E9EC;font-weight:300}.nx-sprow .tx b{font-weight:800;color:#fff}',
    '.nx-sprow.on{background:' + GREEN + ';border-bottom:none;padding:22px 26px;margin:6px 0}',
    '.nx-sprow.on .rl{color:#fff}',
    '.nx-sprow.on .tx{font-size:18.5px;color:#fff;font-weight:500;line-height:1.6}.nx-sprow.on .tx b{color:#fff}',
    /* BEFORE/AFTER */
    '.nx-bagrid{display:grid;grid-template-columns:1fr 1fr;gap:64px;margin-top:56px}',
    '.nx-ba .ln{display:block;height:1px;background:#4A4F57}',
    '.nx-ba.on .ln{height:3.5px;background:' + GREEN + '}',
    '.nx-ba .cp{display:block;font-size:11.5px;font-weight:800;letter-spacing:.2em;color:#6D6F74;margin-top:15px;text-transform:uppercase}',
    '.nx-ba.on .cp{color:' + GREEN + '}',
    '.nx-ba ul{list-style:none;margin-top:10px}',
    '.nx-ba li{font-size:15.5px;color:#7A7F87;padding:8px 0;font-weight:300}',
    '.nx-ba.on li{font-size:17px;color:#fff;font-weight:500}',
    /* 데모 간지 */
    '.nx-dmtitle{font-size:78px;font-weight:300;letter-spacing:-.02em}.nx-dmtitle b{font-weight:800}',
    '.nx-dmcols{display:grid;grid-template-columns:1.5fr 1fr;gap:60px;margin-top:52px}',
    '.nx-dmcol .ln{display:block;height:2px;background:#fff}',
    '.nx-dmcol .hd{display:flex;align-items:baseline;gap:12px;margin-top:15px}',
    '.nx-dmcol .hd i{font-style:normal;font-size:11.5px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.8)}',
    '.nx-dmcol .hd b{font-size:21px;font-weight:800}',
    '.nx-dmcol .tx{display:block;font-size:15.5px;margin-top:12px;color:rgba(255,255,255,.95)}',
    /* 진행률 */
    '.nx-pggrid{display:grid;grid-template-columns:1fr 1.6fr;gap:80px;margin-top:44px;align-items:center}',
    '.nx-pgl .cp{display:block;font-size:11.5px;font-weight:700;letter-spacing:.22em;color:#8B9097;text-transform:uppercase}',
    '.nx-pgl .big{display:flex;align-items:baseline;margin-top:10px}',
    '.nx-pgl .big b{font-size:126px;font-weight:200;color:' + GREEN + ';letter-spacing:-.03em;line-height:1}',
    '.nx-pgl .big i{font-style:normal;font-size:34px;font-weight:300;color:' + GREEN + '}',
    '.nx-prow{padding:13px 0}',
    '.nx-prow .hd{display:flex;justify-content:space-between;align-items:baseline;gap:20px}',
    '.nx-prow .tt{font-size:17px;color:#fff;font-weight:700}',
    '.nx-prow .pc{font-size:18px;font-weight:800;color:' + GREEN + '}',
    '.nx-track{height:6px;background:#30343A;border-radius:3px;margin-top:9px;overflow:hidden}',
    '.nx-fill{display:block;height:100%;background:' + GREEN + ';border-radius:3px}',
    '.nx-prow .cp{font-size:12.5px;color:#6D6F74;margin-top:8px}',
    '.nx-prow .cp2{font-size:12.5px;color:' + GREEN + ';font-weight:700;margin-top:4px}',
    '.nx-prow.on{background:#182924;border:1px solid rgba(255,85,0,.45);border-radius:4px;padding:16px 20px;margin:8px 0}',
    '.nx-prow.on .tt{font-size:18.5px}',
    /* 로드맵 */
    '.nx-rmgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:52px;margin-top:48px}',
    '.nx-rm .ln{display:block;height:1px;background:#C6C9CD}',
    '.nx-rm.now .ln{height:3.5px;background:' + GREEN + '}',
    '.nx-rm.next .ln{height:2px;background:#14181F}',
    '.nx-rm .cp{display:block;font-size:11.5px;font-weight:800;letter-spacing:.2em;color:#9AA0A6;margin-top:14px;text-transform:uppercase}',
    '.nx-rm.now .cp{color:' + GREEN + '}.nx-rm.next .cp{color:#33363B}',
    '.nx-rm .tt{display:block;font-size:28px;font-weight:300;margin-top:5px}.nx-rm.now .tt{font-weight:800}',
    '.nx-rm ul{list-style:none;margin-top:16px}',
    '.nx-rm li{font-size:14.5px;color:#4E5157;padding:6.5px 0}',
    '.nx-rm li b{color:' + GREEN + ';font-weight:800}',
    '.nx-tl{margin-top:auto;border-top:2px solid #14181F;padding-top:15px;display:flex;gap:34px;align-items:baseline}',
    '.nx-tlc{display:flex;gap:8px;align-items:baseline}',
    '.nx-tlc b{font-size:14.5px;font-weight:800;color:' + GREEN + ';white-space:nowrap}',
    '.nx-tlc span{font-size:14px;color:#33363B;white-space:nowrap}',
    '.nx-tlc.dim b{color:#9AA0A6}.nx-tlc.dim span{color:#9AA0A6}',
    /* 밀스톤 (공통 ms-*) */
    '.slide.nx.ms{gap:0}',
    '.ms-chart{margin-top:34px;border:1px solid #E4E6E8;border-radius:6px;overflow:hidden}',
    '.ms-head{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;border-bottom:1px solid #E4E6E8;background:#F7F8F9}',
    '.ms-m{font-size:11px;font-weight:700;letter-spacing:.08em;color:#6D6F74;padding:10px 14px;border-left:1px solid #E4E6E8}.ms-m:first-child{border-left:none}',
    '.ms-row{display:grid;grid-template-columns:150px 1fr;align-items:center;border-bottom:1px solid #EFF1F2}.ms-row:last-child{border-bottom:none}',
    '.ms-lab{font-size:12.5px;font-weight:700;color:#14181F;padding:13px 14px;border-right:1px solid #EFF1F2}',
    '.ms-lane{position:relative;height:40px}',
    '.ms-bar{position:absolute;top:9px;height:22px;background:#DDF3E1;border-radius:11px;display:flex;align-items:center;padding:0 11px}',
    '.ms-bar.on{background:' + GREEN + '}',
    '.ms-bar i{font-style:normal;font-size:10.5px;font-weight:700;color:#1D7A32;white-space:nowrap}',
    '.ms-bar.on i{color:#fff}',
    '.ms-phases{display:grid;grid-auto-flow:column;gap:26px;margin-top:18px}',
    '.ms-phase b{font-size:12px;color:' + GREEN + ';font-weight:800}',
    '.ms-phase span{display:block;font-size:11.5px;color:#6D6F74;margin-top:3px}',
    /* 차트 (chx) — 그리기는 charts.js, 색은 토큰 오버라이드로 그린 상속 */
    '.slide.nx.chx.dk2{background:#14181F;color:#fff}',
    '.nx-chgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 300px;gap:48px;align-items:center;margin-top:14px}',
    '.nx-chgrid.solo{grid-template-columns:1fr}',
    '.nx-chbox{height:100%;max-height:420px;display:grid;place-items:center;min-width:0;' +
    '--pg:' + GREEN + ';--pg2:#69DB7C;--pg3:#A6ADB4;--pg4:#4B5158;--pblue:#2F9E44;--ink:#14181F;--grey:#EDEFF2;--line:#fff;--font:"Pretendard",system-ui,sans-serif}',
    '.nx-chbox svg{max-width:100%;max-height:100%;overflow:visible}',
    '.nx-chbox .cht-v{font-size:26px;font-weight:700}.nx-chbox .cht-c{font-size:17px;font-weight:500}',
    '.slide.nx.chx.dk2 .nx-chbox{--ink:#fff;--grey:#262B33;--line:#14181F;--pg3:#6D6F74;--pg4:#575C64}',
    '.nx-chside{display:flex;flex-direction:column;gap:20px}',
    '.nx-chk{border-top:1.5px solid #E4E6E8;padding-top:13px;display:flex;flex-direction:column;gap:5px}',
    '.nx-chk b{font-size:46px;font-weight:800;letter-spacing:-.02em;color:#14181F;line-height:1}',
    '.nx-chk.on b{color:#2F9E44}',
    '.nx-chk span{font-size:16.5px;color:#6D6F74;font-weight:500;line-height:1.45}',
    '.slide.nx.chx.dk2 .nx-chk{border-color:rgba(255,255,255,.14)}',
    '.slide.nx.chx.dk2 .nx-chk b{color:#fff}.slide.nx.chx.dk2 .nx-chk.on b{color:' + GREEN + '}',
    /* 편집 훅 */
    '[data-edit]{cursor:default}'
  ].join('\n');

  /* ---- 상태 재적용 스크립트 (공통 계약) ---- */
  var MV_SEL = '[data-edit], .nx-photo, .nx-qbar, .nx-track, .nx-dash';
  var UNIT_SEL = '.nx-2col,.nx-stcol,.nx-tocrow,.nx-ref,.nx-lc,.nx-bn,.nx-ag,.nx-pc,.nx-dhmini,.nx-sprow,.nx-ba,.nx-dmcol,.nx-prow,.nx-rm,.nx-tlc,.nx-qlist li,.ms-bar,.ms-phase,.nx-chbox,.nx-chk';
  function stateScript(slides) {
    var st = slides.map(function (s) { return { _pos: s._pos || null, _hide: s._hide || null, _fmt: s._fmt || null, _z: s._z || null, _ta: s._ta || null, _fs: s._fs || null, _tw: s._tw || null }; });
    var js = '(function(){var ST=' + JSON.stringify(st) + ';var SEL=' + JSON.stringify(MV_SEL) + ';' +
      'var slides=document.querySelectorAll(".ppt-stack > .slide");' +
      'for(var i=0;i<slides.length;i++){(function(s,d){if(!d)return;' +
      'var mv={};var all=s.querySelectorAll("[data-edit]");for(var a=0;a<all.length;a++){var el=all[a];var key=el.getAttribute("data-edit").replace(/^slides\\.\\d+\\./,"");el.setAttribute("data-mvkey",key);mv[key]=el;}' +
      'var cd=s.querySelectorAll(' + JSON.stringify(UNIT_SEL) + ');' +
      'for(var c=0;c<cd.length;c++){var u=cd[c];if(!u.getAttribute("data-mvkey")){var f=u.querySelector("[data-mvkey]");if(f)u.setAttribute("data-mvkey","blk:"+f.getAttribute("data-mvkey"));}}' +
      'if(d._hide)for(var k in d._hide){if(d._hide[k]){var e2=s.querySelector(\'[data-mvkey="\'+k+\'"]\');if(e2)e2.style.display="none";}}' +
      'if(d._fmt)for(var k2 in d._fmt){var e3=s.querySelector(\'[data-mvkey="\'+k2+\'"]\');if(e3)e3.style.fontWeight=d._fmt[k2]==="b"?700:d._fmt[k2]==="l"?300:"";}' +
      'if(d._ta)for(var k5 in d._ta){var e6=s.querySelector(\'[data-mvkey="\'+k5+\'"]\');if(e6&&d._ta[k5])e6.style.textAlign=d._ta[k5]==="l"?"left":d._ta[k5]==="c"?"center":"right";}' +
      'if(d._fs)for(var k6 in d._fs){var e7=s.querySelector(\'[data-mvkey="\'+k6+\'"]\');if(e7&&d._fs[k6])e7.style.fontSize=d._fs[k6]+"px";}' +
      'if(d._tw)for(var k7 in d._tw){var e8=s.querySelector(\'[data-mvkey="\'+k7+\'"]\');if(e8&&d._tw[k7]){e8.style.display="inline-block";e8.style.width=d._tw[k7]+"px";}}' +
      'if(d._pos)for(var k3 in d._pos){var e4=s.querySelector(\'[data-mvkey="\'+k3+\'"]\');if(e4){var p=d._pos[k3];e4.style.position="relative";e4.style.left=(p.x||0)+"px";e4.style.top=(p.y||0)+"px";}}' +
      'if(d._z)for(var k4 in d._z){var e5=s.querySelector(\'[data-mvkey="\'+k4+\'"]\');if(e5)e5.style.zIndex=d._z[k4];}' +
      '})(slides[i],ST[i]);}' +
      'window.__clampSlide=function(s){if(!s)return;var els=s.querySelectorAll("[data-mvkey][data-edit]");' +
      'for(var i2=0;i2<els.length;i2++){var el=els[i2];var r=el.getBoundingClientRect();var sr=s.getBoundingClientRect();' +
      'if(r.width&&(r.right>sr.right-8||r.bottom>sr.bottom-4)){var fs=parseFloat(getComputedStyle(el).fontSize);if(fs>11)el.style.fontSize=Math.max(11,fs*Math.min((sr.right-8-r.left)/r.width,(sr.bottom-4-r.top)/r.height))+"px";}}};' +
      'var sls=document.querySelectorAll(".ppt-stack > .slide");for(var c2=0;c2<sls.length;c2++)window.__clampSlide(sls[c2]);' +
      // 커버 타이틀 과장문 방어 — 슬라이드 하단 침범 시 폰트 단계 축소
      // 뷰어는 시작 시 전 장 display:none → rect 0으로 오판해 최소치까지 줄어들던 버그: 숨김 장은 건너뜀
      'document.querySelectorAll(".nx-cvtitle").forEach(function(t){var sl=t.closest(".slide");if(!sl||!sl.getBoundingClientRect().height)return;' +
      'var fs=parseFloat(getComputedStyle(t).fontSize);var guard=0;' +
      'while(guard++<12&&fs>26&&t.getBoundingClientRect().bottom>sl.getBoundingClientRect().bottom-70){fs-=4;t.style.fontSize=fs+"px";}});' +
      '})();';
    return '<script>' + js + '<\/script>';
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
      '<style>body,.slide,.slide *{font-family:"' + fam + '","Pretendard Variable",Pretendard,-apple-system,sans-serif}.ds,.ld,.mut,.nx-cltitle,.nx-cvtitle,.nx-dktitle,.nx-dmtitle,.nx-hl,.nx-qtx,.nx-sttitle,.tt,.tx{font-weight:400}</style>';   /* 한자·가나는 300이 실낱 — 라이트 계열만 400으로 */
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

  /* ---- 덱 렌더 ---- */
  function renderSlides(slides) {
    var chapters = [];
    slides.forEach(function (s, i) { if (s.type === 'darkhero' || s.type === 'statement') chapters.push({ at: i + 1, title: (s.title || '').replace(/\*\*|__/g, '') }); });
    var ctxBase = {
      chapters: chapters,
      chapterOf: function (no) { var cur = null; chapters.forEach(function (c) { if (c.at <= no) cur = c; }); return cur; },
      dividerIndex: function (no) { var k = 0; chapters.forEach(function (c, i2) { if (c.at <= no) k = i2; }); return k; }
    };
    return slides.map(function (s, i) {
      var fn = R[s.type] || R.twocol;
      var ctx = Object.create(ctxBase); ctx.no = i + 1;
      return fn(s, 'slides.' + i, ctx);
    }).join('');
  }

  function chcss() { return (window.Charts && window.Charts.css) ? window.Charts.css() : ''; }

  function renderMachineDeck(data) {
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    slides = lockDemo(slides, data._clang, data._userTouched);
    return '<!doctype html><html><head><meta charset="utf-8"><style>' + chcss() + CSS + '</style></head><body>' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + cjkHead(slides, data._clang) + '</body></html>';
  }

  /* ---- 발표 뷰어 ---- */
  function renderMachineViewer(data) {
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    slides = lockDemo(slides, data._clang, data._userTouched);
    var vjs = '(function(){var i=0;var sl=document.querySelectorAll(".ppt-stack > .slide");var n=sl.length;' +
      'function fit(){var w=innerWidth,h=innerHeight;var k=Math.min(w/1280,h/720);document.querySelector(".ppt-stack").style.transform="scale("+k+")";}' +
      'function show(x){i=Math.max(0,Math.min(n-1,x));for(var a=0;a<n;a++){sl[a].style.display=a===i?"flex":"none";}' +
      'var cur=sl[i];cur.classList.remove("vin");void cur.offsetWidth;cur.classList.add("vin");' +
      'var us=cur.querySelectorAll(' + JSON.stringify(UNIT_SEL + ',.nx-hl,.nx-cvtitle,.nx-sttitle,.nx-dhtitle,.nx-dktitle,.nx-dmtitle,.nx-cltitle,.nx-tctitle,.nx-foot,.nx-band,.nx-tl,.nx-src') + ');var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vSlideUp .5s "+(q2*0.045)+"s cubic-bezier(.2,.7,.2,1) both";q2++;}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      'var pg=document.getElementById("vpg");if(pg)pg.textContent=(i+1)+" / "+n;}' +
      'addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key===" "||e.key==="PageDown")show(i+1);' +
      'if(e.key==="ArrowLeft"||e.key==="PageUp")show(i-1);if(e.key==="Home")show(0);if(e.key==="End")show(n-1);});' +
      'addEventListener("click",function(e){if(e.clientX>innerWidth/2)show(i+1);else show(i-1);});' +
      'addEventListener("resize",fit);fit();show(0);})();';
    return '<!doctype html><html><head><meta charset="utf-8"><style>' + chcss() + CSS +
      '\nhtml,body{background:#0A0D12;height:100%;overflow:hidden}' +
      '.ppt-stack{position:absolute;left:50%;top:50%;margin:-360px 0 0 -640px;width:1280px;height:720px;padding:0;gap:0;transform-origin:center center}' +
      '.ppt-stack > .slide{display:none}' +
      '@keyframes vSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
      '#vpg{position:fixed;right:18px;bottom:14px;color:rgba(255,255,255,.5);font:12px/1 Pretendard,sans-serif;z-index:9}' +
      '</style></head><body><div class="ppt-stack">' + renderSlides(slides) + '</div><div id="vpg"></div>' +
      stateScript(slides) + '<script>' + vjs + '<\/script>' + cjkHead(slides, data._clang) + '</body></html>';
  }

  /* ---- 카탈로그 ---- */
  var CATALOG = [
    { type: 'cover', label: '표지(다크 포토)', use: '발표 시작. title(3톤: **볼드**·__딤__)·band(대시 캡션)·kicker·date' },
    { type: 'statement', label: '그린 선언', use: '핵심 선언. title 대형 + cols[2]{tag,text} 미니 비교' },
    { type: 'toc', label: '목차(다크)', use: 'items[]{no,label(영문 챕터),desc(**강조),pages,on} 5행 내외' },
    { type: 'twocol', label: '2열 리스트', use: '대비·나열. cols[2]{tag,tone:num|dash|dim|bold,green,items[]} + note 풋라인' },
    { type: 'quote', label: '리스트+인용', use: '좌 items[] 리스트, 우 quote(**=그린) 큰 질문/주장' },
    { type: 'refcards', label: '레퍼런스 3열', use: '사례·근거. items[]{title(영문),tag(그린캡션),desc} + source 출처' },
    { type: 'linecards', label: '라인 카드', use: '3~4열 개념 카드. items[]{tag,title,desc} + band/bandTag 틴트 밴드 + note' },
    { type: 'bignum', label: '빅넘버 4열', use: '핵심 N가지. items[]{no,title,desc} + note' },
    { type: 'agenda', label: '어젠다 상태', use: '항목별 상태. items[]{tag,title,state,desc,on(그린 강조)} + note·noteR' },
    { type: 'process', label: '3스텝 강조', use: '단계 중 하나 강조. tag(라벨)·tagR + items[3]{tag,title,desc,on} + note' },
    { type: 'darkhero', label: '다크 히어로', use: '섹션 전환. title(**·__)·tag·sub·items[2]{tag,title,desc}·sideTag·side[](우측 리스트, **=화이트)' },
    { type: 'spec', label: '스펙 시트(다크)', use: '구조 설명. rows[]{tag(레일),text,on(그린 밴드),green} + note·noteR' },
    { type: 'beforeafter', label: '비포·애프터(다크)', use: 'cols[2]{tag,items[]} 좌 딤/우 그린 + note' },
    { type: 'demo', label: '데모 간지(그린)', use: '시연·전환. title 대형 + cols[2]{title,text(→ 플로우)}' },
    { type: 'progress', label: '진행률(다크)', use: '현황 보고. bigLabel·big(%) + rows[]{label,pct,cap,cap2,on(하이라이트)}' },
    { type: 'roadmap', label: '로드맵 3열', use: 'items[3]{tag(NOW·NEXT·THEN),title,items[](**=그린)} + timeline[]{label(월),text,dim}' },
    { type: 'closing', label: '엔딩(다크 포토)', use: '마무리. title(__딤·**볼드)·band·note(**=그린)·noteR(우측 2줄)' },
    { type: 'milestone', label: '밀스톤 간트', use: '일정. months[]·rows[]{label,start,len,tag,on}·phases[]{label,text}' },
    { type: 'chart', label: '차트(추이·비교)', use: '우상향 추이·값 비교를 그래프로. chart{type:area|line|bar|donut|gauge|ring,categories,series} + stats[≤3] 우측 KPI + dark 다크 변형' }
  ];

  /* ---- 원본 19장 그대로 (기본 덱) ---- */
  var DEFAULT_DECK = {
    title: 'The Machine That Builds Design',
    slides: [
      { type: 'cover', kicker: 'PROLOGUE', title: 'The Machine\n**That Builds** __the Machine__', band: 'Tesla — 자동차가 아니라, 자동차를 만드는 시스템', label: 'MIDAS DESIGN AX', date: '2026. 07' },
      { type: 'statement', kicker: 'MIDAS DESIGN AX — 출발점', title: 'The Machine\n**That Builds Design**', cols: [ { tag: 'TESLA', text: '자동차 한 대 → **생산 시스템**' }, { tag: 'MIDAS', text: '디자인 결과물 → **디자인 에이전트**' } ] },
      { type: 'toc', kicker: 'CONTENTS', title: 'Contents', items: [
        { no: '01', label: 'WHY NOW', desc: '누구나 만드는 시대, 차이는 **기준**에서 생깁니다', pages: '04 — 07' },
        { no: '02', label: 'WHERE WE STAND', desc: 'AI가 함께 참조할 **기준**이 필요합니다', pages: '08 — 09' },
        { no: '03', label: 'THE SYSTEM', desc: '기준을 담아 실행하는 **디자인 Agent, DRS**', pages: '10 — 12', on: true },
        { no: '04', label: 'IN PROGRESS', desc: '진행 중인 두 가지와 **시연**', pages: '13 — 17', on: true },
        { no: '05', label: "WHAT'S NEXT", desc: '효과가 확인된 단계부터 **넓혀갑니다**', pages: '18 — 19' } ] },
      { type: 'twocol', kicker: '01 — WHY NOW', title: "'만드는 것'은 이제\n**누구나 할 수 있는 일**이 되었습니다",
        cols: [ { tag: '자연어 입력으로 생성되는 것', tone: 'num', items: ['UI', '이미지', '영상', '코드'] },
                { tag: '그 결과 나타나는 변화', tone: 'dash', green: true, items: ['전문 도구의 진입장벽 하락', '기획·제작·개발 경계 축소', '결과물을 만드는 속도 향상', '생성 결과의 급격한 증가'] } ],
        note: '그 결과 생성은 누구나 가능해졌지만, **결과물 퀄리티**는 모두 같지 않습니다.' },
      { type: 'quote', kicker: '01 — WHY NOW', title: "'만들었다'와 **'잘 만들었다'**는 다릅니다", tag: '기준 없는 생성 결과',
        items: ['화면마다 다른 완성도', '불분명한 정보 구조와 시각 위계', '사용성과 심미성의 불균형', '상품·조직별 품질 편차', '회사가 지향하는 이미지와의 불일치', '수정할수록 무너지는 일관성'],
        quote: '무엇이 **좋은 결과**인지\n누가, 어떤 기준으로\n판단할 것인가?' },
      { type: 'refcards', kicker: '01 — WHY NOW', title: '선도기업은 자사의 디자인 기준을\n**AI 시스템에 반영**하고 있습니다',
        items: [ { title: 'Figma', tag: 'MCP SERVER · CODE CONNECT', desc: '디자인 파일의 컴포넌트·스타일·변수를 생성 도구에 전달하고, 코드베이스를 스캔해 토큰·네이밍 규칙을 문서로 자동 생성' },
                 { title: 'Microsoft', tag: 'FLUENT 2 · AGENT GUIDELINES', desc: 'Fluent UI를 에이전트 화면의 공통 기반으로 규정하고, 책임 있는 AI 항목을 0~3점 루브릭으로 심사' },
                 { title: 'Adobe', tag: 'GENSTUDIO · BRAND INTELLIGENCE', desc: '브랜드 가이드를 등록해 생성물을 자동 검증하고, 승인·반려 이력을 다시 학습에 반영' } ],
        source: '출처 · Figma Blog "Design Systems and AI: Why MCP Servers Are the Unlock" / Microsoft Learn "Human-centered Design for Agents", Fluent 2 "Responsible AI" / Adobe "GenStudio Brand Compliance", 2026.04\nBrand Intelligence 발표 (2026. 07 확인)' },
      { type: 'twocol', kicker: '01 — WHY NOW', title: 'AI 기반 기술은 활용하고,\n**퀄리티 차이를 만드는 방식은 직접** 설계합니다',
        cols: [ { tag: '활용 — AI 기반 기술', tone: 'dim', items: ['기반 AI 모델', '생성 기술과 API', '기존 제작 도구', '오픈소스·개발 프레임워크'] },
                { tag: '설계 — 마이다스만의 기준', tone: 'bold', green: true, items: ['회사의 품질 기준', '상품·조직별 디자인 자산', '조합·검수·승인 규칙', '사용 결과의 축적·학습·진화'] } ],
        note: '결과물의 **퀄리티와 일관성**은 마이다스만의 기준에서 나옵니다.' },
      { type: 'linecards', kicker: '02 — WHERE WE STAND', title: '마이다스의 디자인 업무는\n**전사 전 영역**에 걸쳐 있습니다',
        items: [ { tag: 'EXD팀', title: '전사 행사 · 기업 브랜드', desc: '전사 브랜드 기준과 제작 방식을 축적' },
                 { tag: '각 사업 추진실', title: '상품 MBM · 행사', desc: '사업 특성에 맞춰 커뮤니케이션 자산을 제작' },
                 { tag: '상품개발조직', title: '상품 UI · 사용자 경험', desc: '상품 특성에 맞는 컴포넌트와 UI 체계를 운영' } ],
        bandTag: 'AI 환경에서 새로 필요한 것', band: '세 영역이 함께 참조할 수 있는 형태의 기준과 자산',
        note: 'AI 도입으로 기준과 자산의 **일원화가 실질적 과제**가 되었습니다.' },
      { type: 'bignum', kicker: '02 — WHERE WE STAND', title: '기준과 자산이 일원화되지 않으면\n**AI 환경에서 드러나는 네 가지**',
        items: [ { no: '01', title: '기준의 분산', desc: '기준이 조직별로 나뉘어 있어 서로 다를 수 있음' },
                 { no: '02', title: '자산의 분산', desc: '검증된 자산이 각 조직에 남아 생성에 바로 적용하지 못함' },
                 { no: '03', title: '검수의 속도', desc: 'AI 생성 결과는 늘어나지만 검수는 사람이 건건이 수행' },
                 { no: '04', title: '학습의 부재', desc: '결과물은 남지만 판단 기준은 한곳에 축적되지 않음' } ],
        note: '네 가지 모두 **기준을 한곳에 모아 시스템에 담으면** 해결됩니다.' },
      { type: 'agenda', kicker: '03 — THE SYSTEM', title: '기준을 담아 실행하는 것이\n**디자인 Agent**입니다', sub: '디자인 업무별 Agent의 집합 — DRS, Design Resource System',
        items: [ { tag: 'PRODUCT / WEB', title: 'Web\nGenerator', state: '현재 프로토타입', desc: '기획 입력 → 웹 생성 → 수정 · 출력', on: true },
                 { tag: 'MOTION', title: 'Motion\nWorkflow', state: '일부 실사용', desc: '반복 편집 · 자막 · 버전 · 포맷 제작', on: true },
                 { tag: 'VISUAL / BX', title: 'Visual\nGenerator', state: '후보', desc: '행사 · 캠페인 · 상품 커뮤니케이션 자산' },
                 { tag: 'PRESENTATION', title: 'Presentation\nAgent', state: '후보', desc: '발표자료 초안 · 정리 · 행사 기준 검수' } ],
        note: '이 중 지금 만들고 있는 것이 **Web Generator**입니다.', noteR: '현업에서 효과와 반복성이 큰 순서로 구체화' },
      { type: 'process', kicker: '03 — THE SYSTEM', title: 'Web Generator는 **디자인 단계**를 담당합니다',
        tag: 'DESIGN PRODUCTION LINE', tagR: '하나의 웹 결과물이 만들어지는 세 단계',
        items: [ { tag: '1단계 · 기획', title: '기획\nAgent', desc: '목적 · 요구사항 · 구조를 정의' },
                 { tag: '2단계 · 디자인', title: '디자인\nAgent', desc: 'UX·UI 기준으로 화면과 시각 결과물을 구현', on: true },
                 { tag: '3단계 · 개발', title: '개발\nAgent', desc: '코드 구현 · 배포' } ],
        note: '같은 구조라도 **무엇을 탑재하느냐**에 따라 결과는 달라집니다.' },
      { type: 'linecards', kicker: '03 — THE SYSTEM', title: '각 Agent에는 **마이다스의 기준과 자산**이 탑재됩니다', sub: '현재까지 정의한 항목 — 실제 적용 과정에서 계속 추가됩니다',
        items: [ { tag: '기준 문서', title: 'DS.md', desc: '마이다스의 디자인 기준을 Agent가 읽을 수 있는 문서로 정의' },
                 { tag: '자산', title: 'Pattern', desc: '검증된 컴포넌트 · 레이아웃 패턴과 조합 규칙' },
                 { tag: '판단', title: 'Principle', desc: '무엇이 좋은 결과인지 판단하는 디자인 원칙' },
                 { tag: '검수', title: 'Review Rule', desc: '생성 결과를 검수하고 승인하는 기준' } ],
        note: '이것이 **마이다스의 디자인을 만드는 재료**입니다.' },
      { type: 'darkhero', kicker: '04 — IN PROGRESS', title: '**Running Today.** __Building Next.__',
        tag: 'AGENT 제작 · 테스트', sub: '반복되는 공정을 대상으로\n**Agent를 만들고 테스트**했습니다',
        items: [ { tag: '01 · PRODUCT / WEB', title: 'AX Web Generator', desc: '생성 Flow 작동 확인, 기준과 자산은 제작 단계' },
                 { tag: '02 · MOTION', title: 'Motion Workflow', desc: '반복 편집 공정을 표준 Workflow로 전환' } ],
        sideTag: '병행한 현업 — 최근 6개월', side: ['핵심 상품 UX · 화면 제작 및 오픈', '전사 행사 · 사업 MBM', '영상 콘텐츠 제작', '상품 · 서비스 커뮤니케이션', '**MIDAS WEEK**', '**MIDAS ONSITE UX·UI**'],
        note: '진행 중인 **두 가지**를 순서대로 말씀드리겠습니다.' },
      { type: 'spec', kicker: '04 — IN PROGRESS · 01', title: '__Proof 01 —__ **AX Web Generator**',
        rows: [ { tag: 'INPUT', text: '기획 · 요구사항 __(현재는 임시 Planning Workflow)__' },
                { tag: 'AX WEB GENERATOR', text: 'Generator — Page · Section · Variant 조합\nDesign Pack — 앞서 말씀드린 기준과 자산이 담기는 단위', on: true },
                { tag: 'BUILDER', text: '**Edit · Preview · Export**', green: true },
                { tag: 'OUTPUT', text: '수정 가능한 웹사이트' } ],
        note: '현재 **이 구조가 작동하는 것**까지 확인했습니다.', noteR: 'Design Pack에 담길 기준과 자산은 제작 단계' },
      { type: 'beforeafter', kicker: '04 — IN PROGRESS · 02', title: '__Proof 02 —__ **Motion Workflow**',
        cols: [ { tag: 'BEFORE', items: ['담당자별 개인 파일 · 설정', '반복 설정을 매번 수작업', '포맷 변환을 건별로 처리', '버전이 바뀌면 재작업'] },
                { tag: 'AFTER', items: ['공통 입력 규격', '표준 Workflow가 반복 공정 처리', '자막 · 버전 · 포맷 자동 생성', '결과 확인 후 출력'] } ],
        note: '두 가지를 **시연으로 보여드리겠습니다.**' },
      { type: 'demo', kicker: '04 — IN PROGRESS · DEMO', title: 'Live **Demo**',
        cols: [ { title: 'AX Web Generator', text: '기획 · 요구사항 입력 → 웹 생성 → Builder에서 수정 → Export' },
                { title: 'Motion Workflow', text: '실작동 영상 재생' } ] },
      { type: 'progress', kicker: '04 — IN PROGRESS · STATUS', title: '__Where__ **We Are.**', sub: '플랫폼은 작동을 확인했고, 이제 **Design Pack**에 집중해야 하는 단계입니다',
        bigLabel: 'WEB GENERATOR MVP 기준', big: 30,
        rows: [ { label: 'Platform · Flow', pct: 65, cap: '시연 가능한 Working Prototype · Generator·Builder 기본 구조' },
                { label: 'Design Pack · 품질 체계', pct: 20, cap: '구조 정의 완료 · 실제 자산 구축 단계', cap2: '결과의 퀄리티가 결정되는 영역 — 앞으로 가장 많은 시간이 필요합니다', on: true },
                { label: '실업무 검증', pct: 10, cap: '초기 검증 단계 · 전사 연계는 실효성 확인 후 협의' } ] },
      { type: 'roadmap', kicker: "05 — WHAT'S NEXT", title: '2026 하반기부터 본격적으로\n**세 단계로 구분해 진행**하고 있습니다',
        items: [ { tag: 'NOW', title: 'Prototype', items: ['Web Generator Flow 안정화', 'Design Pack 제작', '핵심 Page·Section 구성', 'Demo 품질 확보'] },
                 { tag: 'NEXT', title: 'Working Tool', items: ['실제 상품 또는 사이트에 적용', '제작 시간·수정 횟수·품질 비교', 'Design Pack·검수 기준 개선', '**2차 디자인 Agent 선정 · 착수**'] },
                 { tag: 'THEN', title: 'DRS', items: ['반복 사용 가능성 확인', '추가 Design Pack 확대', 'Agent Line-up 확장', '전사 체계와의 연계 검토'] } ],
        timeline: [ { label: '8월', text: 'Prototype · Design Pack 안정화' }, { label: '9월', text: '2차 Agent 선정 · 착수' }, { label: '10월', text: '테스트베드' }, { label: '11월', text: '실제 프로젝트 적용' }, { label: '이후', text: '전사 체계 연계 검토', dim: true } ] },
      { type: 'closing', kicker: 'FROM PROTOTYPE TO SYSTEM', title: '__The Machine That Builds Design__\n**has started running.**',
        band: '첫 번째 디자인 Agent가 작동하는 것까지 확인했습니다. 마이다스의 기준과 자산을 담는 일은 이제 시작입니다.',
        note: '기준을 담는 만큼 **결과가 달라집니다**', noteR: 'Design Pack 제작 · 2차 Agent 선정\n파일럿 테스트 · 적용 프로젝트 확정' }
    ]
  };

  var STARTERS = {};
  DEFAULT_DECK.slides.forEach(function (s) { if (!STARTERS[s.type]) STARTERS[s.type] = JSON.parse(JSON.stringify(s)); });
  STARTERS.milestone = { type: 'milestone', kicker: 'PLAN', title: '분기 **핵심 일정**', months: ['8월', '9월', '10월', '11월', '12월'],
    rows: [ { label: 'Prototype', start: 0, len: 1.5, tag: '안정화', on: true }, { label: '2차 Agent', start: 1, len: 2, tag: '선정·착수' }, { label: '테스트베드', start: 2, len: 1.5 }, { label: '실전 적용', start: 3, len: 2, tag: '프로젝트' } ],
    phases: [ { label: '8월', text: 'Design Pack 안정화' }, { label: '10월', text: '테스트베드' }, { label: '11월', text: '실제 적용' } ],
    note: '효과가 확인된 단계부터 **넓혀갑니다**' };
  STARTERS.chart = { type: 'chart', kicker: 'DATA', title: '지표는 **우상향**하고 있습니다',
    chart: { type: 'area', categories: ['1월', '2월', '3월', '4월', '5월'], series: [{ name: '누적', values: [12, 19, 27, 38, 52] }] },
    stats: [ { value: '52', label: '누적 지표', on: true }, { value: '+33%', label: '월 평균 성장' } ],
    note: '핵심 지표가 **꾸준히 상승**하고 있습니다' };

  var SCHEMA_DOC = CATALOG.map(function (c) { return '- ' + c.type + ' (' + c.label + '): ' + c.use; }).join('\n');
  var FIELD_DOC =
    '공통: kicker(러닝헤더 좌측 캡션), title(**볼드**·__딤/뮤트__ 마크업), sub, note(풋라인·**=그린), noteR(풋라인 우측 캡션), kindLabel\n' +
    'cover/closing: band(대시 옆 캡션), label(좌하단), date(우하단)\n' +
    'statement/demo: cols[2]{tag,text|title,text}\n' +
    'toc: items[]{no,label,desc,pages,on}\n' +
    'twocol: cols[2]{tag,tone(num|dash|dim|bold),green(캡션 그린),items[문자열]}\n' +
    'quote: tag(좌 리스트 라벨), items[문자열], quote(**=그린)\n' +
    'refcards: items[]{title,tag,desc}, source(출처 미주)\n' +
    'linecards: items[3~4]{tag,title,desc}, bandTag, band(틴트 밴드 문장)\n' +
    'bignum: items[4]{no,title,desc}\n' +
    'agenda: items[4]{tag,title(\\n 줄바꿈),state(상태 캡션),desc,on}\n' +
    'process: tag(좌 라벨), tagR(우 캡션), items[3]{tag,title,desc,on(중앙 강조)}\n' +
    'darkhero: tag,sub(**=화이트),items[2]{tag,title,desc},sideTag,side[문자열,**=화이트]\n' +
    'spec: rows[]{tag(레일 캡션),text,on(그린 필 밴드),green(레일만 그린)}\n' +
    'beforeafter: cols[2]{tag,items[]}\n' +
    'progress: bigLabel,big(숫자),rows[≤4]{label,pct(0-100),cap,cap2(그린 캡션),on(하이라이트 박스)}\n' +
    'roadmap: items[3]{tag,title,items[]}, timeline[]{label(월),text,dim}\n' +
    'milestone: months[],rows[]{label,start,len,tag,on},phases[]{label,text}\n' +
    'chart: chart{type:"area|line|bar|donut|gauge|ring",categories:[문자열],series:[{name,values:[숫자]}],max?(gauge·ring 상한),format?:{prefix,suffix}}, stats[≤3]{value,label,on(그린 강조)}, dark(true=다크 지면)';

  function machineTemplateDeck() {
    var slides = CATALOG.map(function (c) { return JSON.parse(JSON.stringify(STARTERS[c.type])); });
    return { title: DEFAULT_DECK.title, slides: slides };
  }
  function machineComposeDeck(brief) {
    var d = JSON.parse(JSON.stringify(DEFAULT_DECK));
    if (brief && brief.title) {
      d.title = brief.title;
      d.slides[0].title = brief.title;
      d.slides[0].band = brief.summary || d.slides[0].band;
    }
    return d;
  }

  window.renderMachineDeck = renderMachineDeck;
  window.renderMachineViewer = renderMachineViewer;
  window.machineTemplateDeck = machineTemplateDeck;
  window.MACHINE_SCHEMA_DOC = SCHEMA_DOC;
  window.MACHINE_FIELD_DOC = FIELD_DOC;
  window.machineComposeDeck = machineComposeDeck;
  window.MACHINE_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.MACHINE_MV_SEL = MV_SEL;
  window.MACHINE_DEFAULT_DECK = DEFAULT_DECK;
  window.MACHINE_CATALOG = CATALOG;
  window.MACHINE_STYLE = { id: 'machine', name: 'AX Machine', desc: '다크·네이버그린 · 영문 빅타이포 · 포토 커버 · 16:9', swatch: 'linear-gradient(135deg,#14181F 0%,#14181F 55%,#40C057 100%)' };
  window.MACHINE_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.machineNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.twocol)); };
})();
