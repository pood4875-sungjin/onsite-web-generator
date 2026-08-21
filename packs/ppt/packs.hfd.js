/* packs.hfd.js — "Happy Family Day" PPT 팩 (MIDAS 사내 행사 안내 — 대표 전달용)
   소스: Figma ghk4kt84QwHGLL2vbe4ivB 502-402 실측(2026-08-21) — 표지 4컬러(메인 그린 + 서브 틸·시안·인디고).
   시스템: 상/하 2밴드 + 좌측 대형 화이트 오버레이 원 + 우하단 액센트 원. 내지는 화이트 지면 + 동일 기하 장식.
   테마: data.theme(green|teal|cyan|indigo) + 렌더 상단 컬러칩(미리보기 전환, 인쇄 시 숨김).
   타이포: Pretendard(표지 700 — 원본 라운드 벡터 타이포의 볼드 대체). 로고는 MIDAS 워드마크 텍스트 대체.
   계약: window.renderHfdDeck(data)·renderHfdViewer·hfdTemplateDeck·hfdComposeDeck·HFD_* — pastel 포크, 12타입. */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  function mb(s) { return ml(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<span class="mut">$1</span>'); }
  function de(path) { return ' data-edit="' + path + '"'; }
  function noNum(t) { t = String(t == null ? '' : t); var m = t.trim(); return /^\d{1,2}\s*[.)·:]?$/.test(m) ? '' : t.replace(/^\s*\d{1,2}\s*[.)·:]\s+/, ''); }

  /* ---- 테마 4종 — Figma 공식 컬러 스타일(사용자 제공 패널) 우선, 미공개 값만 표지 픽셀 실측 ----
     공식: FFFFFF · 16848A · 1D2A85 · 30A7BF · 3A6BE1 · 216254 · 309479 · 67C68E */
  var THEMES = {
    green:  { t: '#309479', b: '#216254', a: '#1B985E', tn: '#E7F3EC', dp: '#123D31', name: 'Green' },   /* a=우하원 실측(공식 67C68E는 라이트 그린 — 칩·보조) */
    teal:   { t: '#16848A', b: '#30A7BF', a: '#2CCFDD', tn: '#E7F4F6', dp: '#0B4A4E', name: 'Teal' },
    cyan:   { t: '#0097FF', b: '#1F5BD0', a: '#1D2A85', tn: '#E6F3FE', dp: '#1D2A85', name: 'Blue' },
    indigo: { t: '#3A6BE1', b: '#2843A9', a: '#1D2A85', tn: '#EAEFFC', dp: '#1D2A85', name: 'Indigo' }
  };
  function themeOf(data) { return THEMES[data && data.theme] ? data.theme : 'green'; }

  /* ---- 공통 조각 ---- */
  function runhead(s, P, ctx, white) {
    var pg = (ctx && ctx.no < 10 ? '0' : '') + (ctx ? ctx.no : '');
    return '<div class="hf-run' + (white ? ' wh' : '') + '"><span class="hf-runl"' + de(P + '.kicker') + '>' + esc(s.kicker != null ? s.kicker : 'MIDAS Happy Family Day') + '</span>' +
      '<span class="hf-runr">' + pg + '</span></div>';
  }
  function headline(s, P) {
    return '<h2 class="hf-hl"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>';
  }
  function sub(s, P) {
    return s.sub ? '<p class="hf-sub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '';
  }
  /* 하단 밴드 노트 — 표지 밴드 언어의 내지 버전 */
  function footband(s, P) {
    if (!s.note) return '';
    return '<div class="hf-key"><span class="hf-klab">Info</span><span class="hf-ktx"' + de(P + '.note') + '>' + mb(s.note) + '</span></div>';
  }
  /* 원 장식 — 내지 우하단 은은한 원호(틴트) */
  function deco() { return '<span class="hf-deco"></span>'; }
  /* MIDAS 워드마크 — Figma 464:181 실물(투명 PNG 내장, 자기완결) */
  var LOGO_URI = 'data:image/png;base64,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';
  function logo() { return '<img class="hf-logo" src="' + LOGO_URI + '" alt="MIDAS">'; }
  function kind(s, d) { return esc(s.kindLabel || d); }

  /* ---- 타입 렌더러 ---- */
  var R = {
    /* 표지 — 실측: 2밴드 + 좌측 화이트 오버레이 원 + 우하단 액센트 원 + 좌상 타이포 + 좌하 로고 */
    cover: function (s, P, ctx) {
      return '<section class="slide hf cv" data-kind="' + kind(s, 'Cover') + '">' +
        '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>' +
        '<div class="hf-cvin">' +
        '<h1 class="hf-cvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
        '<span class="hf-cvsub"' + de(P + '.sub') + '>' + esc(s.sub || '') + '</span>' +
        (s.date ? '<span class="hf-cvdate"' + de(P + '.date') + '>' + esc(s.date) + '</span>' : '') +
        '</div>' + logo() + '</section>';
    },
    /* 인사말/선언 — 화이트 지면 + 상단 원호 + 큰 문장 */
    greeting: function (s, P, ctx) {
      return '<section class="slide hf gr" data-kind="' + kind(s, 'Greeting') + '">' + runhead(s, P, ctx) +
        '<div class="hf-grmid"><span class="hf-lab"' + de(P + '.label') + '>' + esc(s.label || 'Greeting') + '</span>' +
        '<p class="hf-grtx"' + de(P + '.text') + '>' + mb(s.text || '') + '</p>' +
        (s.by ? '<span class="hf-grby"' + de(P + '.by') + '>' + esc(s.by) + '</span>' : '') + '</div>' + deco() + '</section>';
    },
    /* 목차 — 아젠다형 풀폭 행 리스트(번호·파트명·설명·페이지 한 행, 톤 사다리, 여백 최소) */
    toc: function (s, P, ctx) {
      var items = (s.items || []).slice(0, 5);
      var rows = items.map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="hf-tocrow">' +
          '<span class="hf-tocno"' + de(IP + '.no') + '>' + esc(it.no || '0' + (i + 1)) + '</span>' +
          '<span class="hf-toclab"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          (it.desc ? '<span class="hf-tocdesc"' + de(IP + '.desc') + '>' + mb(it.desc) + '</span>' : '') +
          (it.pages ? '<span class="hf-tocpg"' + de(IP + '.pages') + '>' + esc(it.pages) + '</span>' : '') +
          '<span class="hf-tocarr">→</span></div>';
      }).join('');
      return '<section class="slide hf tc" data-kind="' + kind(s, 'Contents') + '">' + runhead(s, P, ctx) +
        headline({ title: s.title || 'Contents' }, P) +
        '<div class="hf-tocrows">' + rows + '</div></section>';
    },
    /* 간지 — 표지 기하 재사용 + 챕터 번호/타이틀 */
    divider: function (s, P, ctx) {
      var idx = ctx && ctx.dividerIndex ? ctx.dividerIndex(ctx.no) : 0;
      return '<section class="slide hf dv" data-kind="' + kind(s, 'Divider') + '">' +
        '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>' +
        runhead(s, P, ctx, true) +
        '<div class="hf-dvmid">' +
        '<h1 class="hf-dvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
        (s.lead ? '<p class="hf-dvlead"' + de(P + '.lead') + '>' + mb(s.lead) + '</p>' : '') + '</div>' + logo() + '</section>';
    },
    /* 본문 표준 — 포인트 2~4개(번호+보더탑) */
    section: function (s, P, ctx) {
      var pts = (s.points || []).slice(0, 4);
      var body = pts.map(function (p, i) {
        var IP = P + '.points.' + i;
        return '<div class="hf-num"><span class="hf-numno"' + de(IP + '.no') + '>' + esc(p.no || '0' + (i + 1)) + '</span>' +
          '<span class="hf-numhead"' + de(IP + '.head') + '>' + esc(noNum(p.head) || '') + '</span>' +
          (p.text ? '<p class="hf-numtx"' + de(IP + '.text') + '>' + mb(p.text) + '</p>' : '') + '</div>';
      }).join('');
      if (!pts.length && s.text) body = '<p class="hf-body"' + de(P + '.text') + '>' + mb(s.text) + '</p>';
      return '<section class="slide hf sc" data-kind="' + kind(s, 'Section') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-numgrid c' + Math.min(Math.max(pts.length, 1), 4) + '">' + body + '</div>' + deco() + '</section>';
    },
    /* N열 카드 — 라운드 없는 톤 카드(첫 장=틴트, 마지막=딥 화이트 텍스트) */
    cards: function (s, P, ctx) {
      var n = (s.cards || []).length || 3;
      var si = P.split('.')[1];
      var cells = (s.cards || []).map(function (it, i) {
        var IP = P + '.cards.' + i, on = it.tone === 'dark' || i === n - 1;
        /* 이미지 슬롯 — it.img(truthy)면 슬롯 노출, 업로드는 data.images['card-슬라이드-i'] */
        var ik = 'card-' + si + '-' + i, src = ctx.images && ctx.images[ik];
        var im = src ? '<img class="hf-cimg s-imgwrap" data-img="' + ik + '" src="' + esc(src) + '">' :
          (it.img ? '<div class="hf-imgph cell s-imgwrap" data-img="' + ik + '"><span>' + esc(typeof it.img === 'string' ? it.img : '이미지') + '</span></div>' : '');
        return '<div class="hf-cell' + (on ? ' on' : '') + '">' + im +
          (it.tag ? '<span class="hf-lab in"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
          '<span class="hf-cellhead"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<p class="hf-celltx"' + de(IP + '.text') + '>' + mb(it.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf cd" data-kind="' + kind(s, 'Cards') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-grid c' + Math.min(n, 4) + '">' + cells + '</div>' + '</section>';
    },
    /* 타임라인 — 당일 일정(시간+제목+설명, on=틴트 강조) */
    timeline: function (s, P, ctx) {
      var rows = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="hf-trow' + (it.on ? ' on' : '') + '">' +
          '<span class="w"' + de(IP + '.when') + '>' + esc(it.when || '') + '</span>' +
          '<span class="h"' + de(IP + '.head') + '>' + esc(noNum(it.head) || '') + '</span>' +
          (it.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf tl" data-kind="' + kind(s, 'Timeline') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-trows">' + rows + '</div>' + deco() + '</section>';
    },
    /* 표 — 장소·대상·문의 등 정보 표 */
    table: function (s, P, ctx) {
      var nc = (s.columns || []).length || 3;
      /* 첫 열(구분)은 좁게, 둘째 열(내용)에 무게 — 균등 1fr이면 첫 열이 휑해짐 */
      var tct = '150px' + (nc > 1 ? ' 1.5fr' : '') + (nc > 2 ? ' repeat(' + (nc - 2) + ',1fr)' : '');
      var head = '<div class="hf-tbrow hd" style="grid-template-columns:' + tct + '">' + (s.columns || []).map(function (cc, i) { return '<span' + de(P + '.columns.' + i) + '>' + esc(cc) + '</span>'; }).join('') + '</div>';
      var rows = (s.rows || []).map(function (r, ri) {
        return '<div class="hf-tbrow" style="grid-template-columns:' + tct + '">' + (r.cells || []).map(function (cc, ci) { return '<span' + (ci === 0 ? ' class="f"' : '') + de(P + '.rows.' + ri + '.cells.' + ci) + '>' + mb(cc) + '</span>'; }).join('') + '</div>';
      }).join('');
      return '<section class="slide hf tb" data-kind="' + kind(s, 'Table') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-tbl">' + head + rows + '</div>' + deco() + '</section>';
    },
    /* 체크리스트 — 준비물·유의사항 */
    checklist: function (s, P, ctx) {
      var items = s.items || [];
      var two = (s.cols === 2) || items.length > 5;
      var lis = items.map(function (t, i) {
        return '<li><span class="hf-dot"></span><span' + de(P + '.items.' + i) + '>' + mb(t) + '</span></li>';
      }).join('');
      return '<section class="slide hf ck" data-kind="' + kind(s, 'Checklist') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<ul class="hf-list' + (two ? ' two' : '') + '">' + lis + '</ul>' + deco() + '</section>';
    },
    /* 안내 rows — 오시는 길·운영 정보(라벨+내용, on=밴드 강조) + 이미지 슬롯 */
    media: function (s, P, ctx) {
      var rows = (s.specs || []).map(function (sp, i) {
        var IP = P + '.specs.' + i;
        return '<div class="hf-srow' + (sp.on ? ' on' : '') + '">' +
          '<span class="k"' + de(IP + '.label') + '>' + esc(sp.label || '') + '</span>' +
          '<span class="t"' + de(IP + '.text') + '>' + mb(sp.text || '') + '</span></div>';
      }).join('');
      var msrc = ctx.images && ctx.images.media;
      var img = s.image ? '<div class="hf-imgcol">' +
        (msrc ? '<img class="hf-mimg s-imgwrap" data-img="media" src="' + esc(msrc) + '">' :
          '<div class="hf-imgph s-imgwrap" data-img="media"><span' + de(P + '.image.label') + '>' + esc(s.image.label || '이미지') + '</span></div>') +
        (s.caption ? '<span class="hf-cap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div>' : '';
      return '<section class="slide hf md" data-kind="' + kind(s, 'Media') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-mdgrid' + (img ? ' hasimg' : '') + '"><div class="hf-srows">' + rows + '</div>' + img + '</div>' + '</section>';
    },
    /* 수치 — 좌 대형 % 카드 + 우 진행바 rows (pastel stats 구성 번안) */
    stats: function (s, P, ctx) {
      var big = '';
      if (s.donut) {
        big = '<div class="hf-stbig">' +
          (s.donut.label ? '<span class="hf-lab"' + de(P + '.donut.label') + '>' + esc(s.donut.label) + '</span>' : '') +
          '<span class="hf-stnum"><i' + de(P + '.donut.pct') + '>' + esc(String(s.donut.pct != null ? s.donut.pct : 0)) + '</i><em>%</em></span>' +
          (s.donut.caption ? '<span class="hf-stcap"' + de(P + '.donut.caption') + '>' + mb(s.donut.caption) + '</span>' : '') + '</div>';
      }
      var rows = (s.bars || []).map(function (b, i) {
        var IP = P + '.bars.' + i, pct = Math.max(0, Math.min(100, +b.pct || 0));
        return '<div class="hf-brow' + (b.on ? ' on' : '') + '">' +
          '<div class="hd"><span class="l"' + de(IP + '.label') + '>' + esc(b.label || '') + '</span><span class="v"' + de(IP + '.value') + '>' + esc(b.value || pct + '%') + '</span></div>' +
          '<div class="tr"><i style="width:' + pct + '%"></i></div>' +
          (b.text ? '<span class="tx"' + de(IP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf stt" data-kind="' + kind(s, 'Stats') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-stgrid' + (big ? '' : ' solo') + '">' + big + '<div class="hf-brows">' + rows + '</div></div>' + deco() + '</section>';
    },
    /* KPI — 값 카드 톤 사다리(마지막·tone:on = 딥) */
    kpi: function (s, P, ctx) {
      var n = (s.items || []).length || 3;
      var cells = (s.items || []).map(function (it, i) {
        var IP = P + '.items.' + i, on = it.tone === 'on' || i === n - 1;
        return '<div class="hf-cell kp' + (on ? ' on' : '') + '">' +
          '<span class="hf-kpval"' + de(IP + '.value') + '>' + esc(it.value || '') + '</span>' +
          '<span class="hf-lab in"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          (it.desc ? '<p class="hf-celltx"' + de(IP + '.desc') + '>' + mb(it.desc) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf kp" data-kind="' + kind(s, 'KPI') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-grid c' + Math.min(n, 4) + '">' + cells + '</div>' + deco() + '</section>';
    },
    /* 프로세스 — 단계 카드 + 화살표, accent(기본 중앙) 딥 강조 */
    process: function (s, P, ctx) {
      var steps = (s.steps || []).slice(0, 4);
      var accent = s.accent != null ? +s.accent : Math.floor(steps.length / 2);
      var cols = steps.map(function (st, i) {
        var IP = P + '.steps.' + i, on = i === accent;
        return (i ? '<span class="hf-parr">→</span>' : '') +
          '<div class="hf-pstep' + (on ? ' on' : '') + '">' +
          '<span class="hf-lab' + (on ? ' wh' : '') + '"' + de(IP + '.tag') + '>' + esc(st.tag || '') + '</span>' +
          '<span class="hf-phead"' + de(IP + '.head') + '>' + mb(noNum(st.head) || '') + '</span>' +
          (st.text ? '<p class="hf-ptx"' + de(IP + '.text') + '>' + mb(st.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf pc" data-kind="' + kind(s, 'Process') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-procrow">' + cols + '</div>' + deco() + '</section>';
    },
    /* 비교 — Before(틴트)/After(딥) 라운드 카드 2 */
    compare: function (s, P, ctx) {
      var cols = (s.items || []).slice(0, 2).map(function (it, i) {
        var IP = P + '.items.' + i, on = i === 1;
        var lis = (it.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="hf-cmp' + (on ? ' on' : '') + '">' +
          '<span class="hf-lab' + (on ? ' wh' : '') + '"' + de(IP + '.head') + '>' + esc(it.head || (i ? 'After' : 'Before')) + '</span>' +
          '<ul>' + lis + '</ul></div>';
      }).join('');
      return '<section class="slide hf cm" data-kind="' + kind(s, 'Compare') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-cmpgrid">' + cols + '</div>' + deco() + '</section>';
    },
    /* 로드맵 — Now/Next/Then 라운드 카드 3 */
    roadmap: function (s, P, ctx) {
      var steps = (s.steps || []).slice(0, 3).map(function (st, i) {
        var IP = P + '.steps.' + i, now = st.state === 'now' || i === 0;
        var lis = (st.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="hf-rmcol' + (now ? ' now' : '') + '">' +
          '<span class="hf-lab' + (now ? ' wh' : '') + '"' + de(IP + '.when') + '>' + esc(st.when || ['Now', 'Next', 'Then'][i]) + '</span>' +
          '<span class="hf-rmhead"' + de(IP + '.head') + '>' + esc(st.head || '') + '</span>' +
          '<ul class="hf-rmlist">' + lis + '</ul></div>';
      }).join('');
      return '<section class="slide hf rm" data-kind="' + kind(s, 'Roadmap') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-rmgrid">' + steps + '</div>' + deco() + '</section>';
    },
    /* 마일스톤(간트) — 전 팩 공통 계약, HFD 톤·라운드 바 */
    milestone: function (s, P, ctx) {
      var N = (s.axis || []).length || 5;
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
        var n = barsArr.length, pct = n > 1 ? Math.round(90 - 62 * i / (n - 1)) : 90;
        return '<div class="ms-bar" style="margin-left:' + ((st - 1) / N * 100).toFixed(2) + '%;width:' + (sp / N * 100).toFixed(2) + '%;background:color-mix(in srgb, var(--t) ' + pct + '%, #fff)">' +
          '<b' + de(IP + '.label') + '>' + esc(b.label || '') + '</b>' +
          (b.sub ? '<span' + de(IP + '.sub') + '>' + esc(b.sub) + '</span>' : '') + '</div>';
      }).join('');
      var gl = '<div class="ms-glines">' + new Array(N + 1).join('<i></i>') + '</div>';
      var ax = '<div class="ms-axis">' + (s.axis || []).map(function (a, i) { return '<span' + de(P + '.axis.' + i) + '>' + esc(a) + '</span>'; }).join('') + '</div>';
      return '<section class="slide hf ms" data-kind="' + kind(s, 'Milestone') + '">' + runhead(s, P, ctx) + headline(s, P) +
        (phases ? '<div class="ms-phases">' + phases + '</div>' : '') +
        '<div class="ms-chart">' + gl + mbars + '</div>' + ax + '</section>';
    },
    /* 좌우 대비 — 흐림 패널 vs 강조 패널 */
    split: function (s, P, ctx) {
      function half(h, HP, on) {
        h = h || {};
        var rows = (h.items || []).map(function (t, i) {
          return '<li>' + (on ? '<span class="hf-dot"></span>' : '<span class="hf-dot dim"></span>') + '<span' + de(HP + '.items.' + i) + '>' + mb(t) + '</span></li>';
        }).join('');
        return '<div class="hf-half' + (on ? ' on' : '') + '">' +
          '<span class="hf-lab"' + de(HP + '.kicker') + '>' + esc(h.kicker || '') + '</span>' +
          '<ul>' + rows + '</ul></div>';
      }
      return '<section class="slide hf sp2" data-kind="' + kind(s, 'Split') + '">' + runhead(s, P, ctx) +
        (s.title ? headline(s, P) : '') + sub(s, P) +
        '<div class="hf-splitgrid">' + half(s.left, P + '.left', false) + half(s.right, P + '.right', true) + '</div>' + deco() + '</section>';
    },
    /* 대형 수치 — 센터 임팩트 */
    bigstat: function (s, P, ctx) {
      return '<section class="slide hf bs" data-kind="' + kind(s, 'BigStat') + '">' + runhead(s, P, ctx) + headline(s, P) +
        '<div class="hf-bsmid"><span class="hf-bsval"' + de(P + '.value') + '>' + esc(s.value || '') + '</span>' +
        (s.caption ? '<span class="hf-bscap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div>' + deco() + '</section>';
    },
    /* 인용/슬로건 — 풀블리드 딥 밴드 + 원 장식 + 대형 문장 */
    quote: function (s, P, ctx) {
      return '<section class="slide hf qt" data-kind="' + kind(s, 'Quote') + '">' +
        '<span class="hf-circ q"></span><span class="hf-arc q"></span>' +
        runhead(s, P, ctx, true) +
        '<div class="hf-qmid"><p class="hf-qtx"' + de(P + '.text') + '>' + mb(s.text || '') + '</p>' +
        (s.by ? '<span class="hf-qby"' + de(P + '.by') + '>' + esc(s.by) + '</span>' : '') + '</div>' + logo() + '</section>';
    },
    /* 포토 앨범 — 2024 템플릿 실측(290-3346/3384/3658 계열) 3변형
       wide(기본)=풀폭 사진+하단 캡션 밴드 · grid=사진 3열+캡션 밴드 · frame=표지 기하 위 센터 화이트 프레임 */
    photos: function (s, P, ctx) {
      var v = s.variant === 'grid' || s.variant === 'frame' || s.variant === 'side' ? s.variant : 'wide';
      var si = P.split('.')[1];
      /* 이미지 슬롯 — 슬라이드별 키(photos-슬라이드-i)로 업로드 이미지 실렌더(키 충돌 방지) */
      function slot(i, it) {
        var ik = 'photos-' + si + '-' + i, src = ctx.images && ctx.images[ik];
        if (src) return '<img class="hf-abimg s-imgwrap" data-img="' + ik + '" src="' + esc(src) + '">';
        return '<div class="hf-imgph s-imgwrap" data-img="' + ik + '"><span' + de(P + '.items.' + i + '.label') + '>' + esc((it || {}).label || '사진') + '</span></div>';
      }
      if (v === 'side') {
        /* 2024 덱(TFt0 39-55) 사이드 캡션 레이아웃 — 좌 캡션 컬럼 + 우 대형 화이트 사진 패널 */
        var it0 = (s.items && s.items[0]) || {};
        return '<section class="slide hf ab sd" data-kind="' + kind(s, 'Photos') + '">' +
          '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>' +
          '<div class="hf-sdcap">' +
          '<span class="hf-abyear"' + de(P + '.year') + '>' + esc(s.year || '') + '</span>' +
          '<span class="hf-sdtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span>' +
          (s.caption ? '<span class="hf-sdtx"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') +
          (s.foot ? '<span class="hf-sdfoot"' + de(P + '.foot') + '>' + esc(s.foot) + '</span>' : '') + '</div>' +
          '<div class="hf-sdpanel">' + slot(0, it0) + '</div>' +
          '</section>';
      }
      var items = (s.items || []).slice(0, v === 'grid' ? 3 : 1);
      if (!items.length) items = [{}];
      /* 하단 캡션 밴드 — 좌 연도 칩 · 센터 타이틀 2줄 · 우측 캡션 줄들 · 우하단 소라벨 */
      var band = '<div class="hf-abband">' +
        '<span class="hf-abyear"' + de(P + '.year') + '>' + esc(s.year || '') + '</span>' +
        '<span class="hf-abtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span>' +
        '<span class="hf-abcap"' + de(P + '.caption') + '>' + mb(s.caption || '') + '</span>' +
        (s.foot ? '<span class="hf-abfoot"' + de(P + '.foot') + '>' + esc(s.foot) + '</span>' : '') +
        '<span class="hf-abarc"></span></div>';
      if (v === 'frame') {
        return '<section class="slide hf ab fr" data-kind="' + kind(s, 'Photos') + '">' +
          '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>' +
          '<div class="hf-abframe">' + slot(0, items[0]) + '</div>' +
          '<div class="hf-abfr-cap"><span class="hf-abyear iv"' + de(P + '.year') + '>' + esc(s.year || '') + '</span>' +
          '<span class="hf-abtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span></div></section>';
      }
      if (v === 'grid') {
        /* 배경 기하 테두리 + 중앙 화이트 패널 + 카드 3~4 (하단 밴드 없음) */
        return '<section class="slide hf ab gd" data-kind="' + kind(s, 'Photos') + '">' +
          '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>' +
          '<div class="hf-abpanel">' +
          '<div class="hf-abphead"><span class="hf-abyear pv"' + de(P + '.year') + '>' + esc(s.year || '') + '</span>' +
          '<span class="hf-abptitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span></div>' +
          '<div class="hf-abgrid">' + items.map(function (it, i) { return slot(i, it); }).join('') + '</div>' +
          '</div></section>';
      }
      var media = '<div class="hf-abwide">' + slot(0, items[0]) + '</div>';
      return '<section class="slide hf ab" data-kind="' + kind(s, 'Photos') + '">' + media + band + '</section>';
    },
    /* 한 단어 — 대형 타이포 임팩트(감사·환영) */
    word: function (s, P, ctx) {
      return '<section class="slide hf wd" data-kind="' + kind(s, 'Word') + '">' + runhead(s, P, ctx) +
        '<div class="hf-wdmid"><span class="hf-word"' + de(P + '.text') + '>' + mb(s.text || '') + '</span>' +
        (s.caption ? '<span class="hf-wdcap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div></section>';
    },
    /* 스테이트먼트 — 타이틀+서브 중앙 대형 */
    statement: function (s, P, ctx) {
      return '<section class="slide hf st2" data-kind="' + kind(s, 'Statement') + '">' + runhead(s, P, ctx) +
        '<div class="hf-stmid"><h2 class="hf-sttitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>' +
        (s.sub ? '<p class="hf-stsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') + '</div></section>';
    },
    /* 이미지 히어로 — 풀블리드 배경 이미지(업로드) + 중앙 텍스트 */
    hero: function (s, P, ctx) {
      var si = P.split('.')[1], ik = 'hero-' + si, src = ctx.images && ctx.images[ik];
      var bg = src ? '<img class="hf-herobg s-imgwrap" data-img="' + ik + '" src="' + esc(src) + '">' :
        '<div class="hf-herobg ph s-imgwrap" data-img="' + ik + '"><span>배경 이미지</span></div>';
      return '<section class="slide hf hr" data-kind="' + kind(s, 'Hero') + '">' + bg + '<span class="hf-heroov"></span>' +
        '<div class="hf-heromid"><h2 class="hf-herotitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>' +
        (s.sub ? '<p class="hf-herosub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') + '</div></section>';
    },
    /* 엔딩 — 표지 기하 + 마무리 문장 */
    closing: function (s, P, ctx) {
      return '<section class="slide hf cl" data-kind="' + kind(s, 'Closing') + '">' +
        '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>' +
        '<div class="hf-cvin">' +
        '<h1 class="hf-cvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
        (s.sub ? '<span class="hf-cvsub"' + de(P + '.sub') + '>' + esc(s.sub) + '</span>' : '') +
        (s.contact ? '<span class="hf-cvdate"' + de(P + '.contact') + '>' + esc(s.contact) + '</span>' : '') +
        '</div>' + logo() + '</section>';
    }
  };

  /* 본문 장 기본 프레임 — 2024 덱 레이아웃: 기하 테두리 + 중앙 화이트 라운드 패널 (frame:false로 해제) */
  var FRAMED = { greeting: 1, toc: 1, section: 1, cards: 1, timeline: 1, table: 1, checklist: 1, media: 1, stats: 1, kpi: 1, process: 1, compare: 1, roadmap: 1, milestone: 1, split: 1, bigstat: 1, word: 1, statement: 1 };
  var GEO = '<span class="hf-bandT"></span><span class="hf-bandB"></span><span class="hf-circ"></span><span class="hf-arc"></span>';
  function frameWrap(html) {
    return html
      .replace(/^<section class="slide hf ([^"]*)"/, '<section class="slide hf $1 frm"')
      .replace(/^(<section[^>]*>)/, '$1' + GEO + '<div class="hf-frpanel">')
      .replace(/<\/section>$/, '</div></section>');
  }
  function renderSlides(slides, images) {
    var divAt = [];
    slides.forEach(function (s, i) { if (s.type === 'divider') divAt.push(i + 1); });
    function dividerIndex(no) { return Math.max(0, divAt.indexOf(no)); }
    var total = slides.length;
    return slides.map(function (s, i) {
      var fn = R[s.type] || R.section;
      var html = '';
      try { html = fn(s, 'slides.' + i, { dividerIndex: dividerIndex, no: i + 1, total: total, images: images || {} }); }
      catch (e) { html = '<section class="slide hf sc" data-kind="Error"><h2 class="hf-hl">' + esc(s.type) + ' 렌더 오류</h2></section>'; }
      if (FRAMED[s.type] && s.frame !== false) html = frameWrap(html);
      return html;
    }).join('\n');
  }

  /* ---- 이동/숨김/굵기 상태 재적용 — 타 팩 공통 계약(_pos/_hide/_fmt/_z/_ta/_fs/_tw) ---- */
  var MV_SEL = '[data-edit], .s-imgwrap, .hf-imgph, .hf-logo, .hf-deco, .hf-arc, .hf-circ';
  var UNIT_SEL = '.hf-cell,.hf-num,.hf-trow,.hf-tbrow,.hf-srow,.hf-toccol,.hf-phcell,.hf-list li';
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
      'var f=c.f[rel];if(f==="b")ed[e2].style.fontWeight=700;else if(f==="l")ed[e2].style.fontWeight=300;' +
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

  /* ---- 컬러칩 — 렌더 상단 고정, 클릭 시 body[data-th] 스왑. 인쇄 시 숨김 ---- */
  function chipScript(cur) {
    var js = '(function(){var bar=document.getElementById("hfchips");if(!bar)return;' +
      'bar.addEventListener("click",function(e){var s=e.target.closest("[data-th]");if(!s)return;' +
      'document.body.setAttribute("data-th",s.getAttribute("data-th"));' +
      'var all=bar.querySelectorAll("[data-th]");for(var i=0;i<all.length;i++)all[i].classList.toggle("on",all[i]===s);});' +
      '})();';
    var chips = Object.keys(THEMES).map(function (k) {
      var th = THEMES[k];
      return '<span data-th="' + k + '"' + (k === cur ? ' class="on"' : '') + ' title="' + th.name + '" style="background:linear-gradient(135deg,' + th.t + ' 0%,' + th.b + ' 60%,' + th.a + ' 100%)"></span>';
    }).join('');
    return '<div class="hf-chips" id="hfchips"><i>Color</i>' + chips + '</div><scr' + 'ipt>' + js + '</scr' + 'ipt>';
  }

  /* ---- CSS ---- */
  function css() {
    var thRules = Object.keys(THEMES).map(function (k) {
      var th = THEMES[k];
      return 'body[data-th="' + k + '"]{--t:' + th.t + ';--b:' + th.b + ';--a:' + th.a + ';--tn:' + th.tn + ';--dp:' + th.dp + '}';
    }).join('');
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      ':root{--ink:#17211C;--body:#4E5B55;--muted:#8B968F;--rule:#E5EAE7;--slide-w:1280px;--slide-h:720px}' +
      thRules +
      '*{box-sizing:border-box;margin:0;word-break:keep-all}' +
      /* ul 기본 들여쓰기 제거 — 리스트 좌정렬(라벨·제목과 같은 축) */
      'ul,ol{padding:0}' +
      'body{background:#E9EDEB;font-family:Pretendard,"Pretendard Variable",-apple-system,"Apple SD Gothic Neo",sans-serif;-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:#fff;color:var(--ink);overflow:hidden;' +
      'display:flex;flex-direction:column;padding:52px 64px;font-family:Pretendard,"Pretendard Variable",sans-serif}' +
      'b{font-weight:700}.mut{color:var(--muted)}' +
      /* 컬러칩 */
      '.hf-chips{position:fixed;top:14px;right:16px;z-index:40;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);padding:8px 11px;box-shadow:0 4px 18px rgba(10,20,15,.16);border-radius:12px}' +
      '.hf-chips i{font-style:normal;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-right:2px}' +
      '.hf-chips span{width:20px;height:20px;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(10,20,15,.12);border-radius:6px}' +
      '.hf-chips span.on{box-shadow:0 0 0 2px #17211C}' +
      '@media print{.hf-chips{display:none}}' +
      /* 러닝헤드 */
      '.hf-run{display:flex;justify-content:space-between;align-items:baseline;flex:none;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t)}' +
      '.hf-runr{color:var(--muted);font-variant-numeric:tabular-nums}' +
      '.hf-run.wh{position:relative;z-index:3;color:#fff}.hf-run.wh .hf-runr{color:rgba(255,255,255,.75)}' +
      /* 헤드라인 */
      '.hf-hl{margin-top:26px;font-size:38px;font-weight:700;line-height:1.28;letter-spacing:-.02em;white-space:pre-wrap;flex:none;max-width:88%}' +
      '.hf-sub{margin-top:10px;font-size:16px;color:var(--muted);flex:none}' +
      '.hf-lab{font-size:12.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--t)}' +
      '.hf-lab.in{color:inherit;opacity:.85}' +
      '.hf-lab.wh{color:#fff}' +
      '.hf-cap{font-size:14px;color:var(--muted)}' +
      '.hf-body{font-size:19px;line-height:1.7;color:var(--body)}' +
      /* 본문 프레임 — 기하 테두리 + 중앙 화이트 패널 */
      '.slide.hf.frm{padding:36px}' +
      '.hf-frpanel{position:relative;z-index:2;flex:1;min-height:0;background:#fff;padding:44px 52px;display:flex;flex-direction:column;overflow:hidden}' +
      '.slide.hf.ms .hf-frpanel{gap:16px}' +
      /* 프레임 장에선 틴트 원 숨김 — 화이트 패널 안에서 콘텐츠와 겹침 */
      '.slide.hf.frm .hf-deco{display:none}' +
      /* 기하 장식 — 표지 실측 */
      '.hf-bandT,.hf-bandB{position:absolute;left:0;right:0;height:50%;z-index:0}' +
      '.hf-bandT{top:0;background:var(--t)}.hf-bandB{bottom:0;background:var(--b)}' +
      '.hf-circ{position:absolute;width:1350px;height:1350px;border-radius:50%;background:rgba(255,255,255,.14);left:-620px;top:-315px;z-index:1;pointer-events:none}' +
      '.hf-arc{position:absolute;width:640px;height:640px;border-radius:50%;background:var(--a);right:-330px;bottom:-360px;z-index:1;pointer-events:none}' +
      '.hf-deco{position:absolute;width:520px;height:520px;border-radius:50%;background:var(--tn);right:-230px;bottom:-260px;z-index:0;pointer-events:none}' +
      '.hf-logo{position:absolute;left:64px;bottom:44px;z-index:3;width:108px;height:auto}' +
      /* 표지·엔딩 */
      '.slide.cv,.slide.cl,.slide.dv,.slide.qt{padding:52px 64px;color:#fff}' +
      '.hf-cvin{position:relative;z-index:3;display:flex;flex-direction:column;margin-top:36px}' +
      '.hf-cvtitle{font-size:56px;font-weight:800;line-height:1.16;letter-spacing:-.02em;white-space:pre-wrap}' +
      '.hf-cvsub{margin-top:22px;font-size:16px;font-weight:500;opacity:.92}' +
      '.hf-cvdate{margin-top:8px;font-size:14px;font-weight:500;opacity:.72}' +
      /* 간지 */
      '.hf-dvmid{position:relative;z-index:3;flex:none;display:flex;flex-direction:column;justify-content:flex-start;gap:14px;margin-top:40px}' +
      '.hf-dvno{font-size:20px;font-weight:800;letter-spacing:.1em;opacity:.85}' +
      '.hf-dvtitle{font-size:64px;font-weight:800;line-height:1.12;letter-spacing:-.02em;white-space:pre-wrap}' +
      '.hf-dvlead{font-size:20px;font-weight:400;line-height:1.6;max-width:44ch;opacity:.94}' +
      /* 인사말 */
      '.hf-grmid{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:24px}' +
      '.hf-grtx{font-size:34px;font-weight:600;line-height:1.66;letter-spacing:-.01em;white-space:pre-wrap;max-width:88%}' +
      '.hf-grtx b{color:var(--t)}' +
      '.hf-grby{font-size:16px;font-weight:700;color:var(--body)}' +
      /* 목차 — 아젠다형 행 리스트 */
      /* 전 행 동일 톤 — 옅은 틴트 배경+검정 텍스트, 5행까지(피드백 반영) */
      '.hf-tocrows{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px;margin-top:30px}' +
      '.hf-tocrow{flex:1;min-height:0;background:var(--tn);color:var(--ink);display:flex;align-items:center;gap:34px;padding:0 40px;border-radius:14px}' +
      '.hf-tocno{flex:0 0 76px;font-size:42px;font-weight:800;line-height:1;color:var(--t)}' +
      '.hf-toclab{flex:0 0 220px;font-size:25px;font-weight:800;letter-spacing:-.01em}' +
      '.hf-tocdesc{flex:1;font-size:16.5px;line-height:1.5;color:var(--body)}' +
      '.hf-tocpg{flex:0 0 auto;font-size:14px;font-weight:700;letter-spacing:.1em;color:var(--muted);font-variant-numeric:tabular-nums}' +
      '.hf-tocarr{flex:0 0 auto;font-size:22px;color:var(--t)}' +
      /* 본문 표준 */
      '.hf-numgrid{flex:1;min-height:0;display:grid;gap:2px;align-content:center;padding:20px 0}' +
      '.hf-numgrid.c1{grid-template-columns:1fr}.hf-numgrid.c2{grid-template-columns:1fr 1fr}.hf-numgrid.c3{grid-template-columns:repeat(3,1fr)}.hf-numgrid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.hf-num{position:relative;z-index:2;display:flex;flex-direction:column;gap:12px;background:var(--tn);padding:30px 26px;min-height:250px;border-radius:16px}' +
      '.hf-numno{font-size:38px;font-weight:800;line-height:1;color:var(--t)}' +
      '.hf-numhead{font-size:23px;font-weight:700;margin-top:auto}' +
      '.hf-numtx{font-size:16px;line-height:1.6;color:var(--body)}' +
      /* 카드 */
      '.hf-grid{flex:1;min-height:0;display:grid;gap:16px;align-content:center;padding:20px 0}' +
      '.hf-grid.c2{grid-template-columns:1fr 1fr}.hf-grid.c3{grid-template-columns:repeat(3,1fr)}.hf-grid.c4{grid-template-columns:repeat(4,1fr)}' +
      '.hf-cell{background:var(--tn);padding:28px 26px;display:flex;flex-direction:column;gap:10px;min-height:190px;border-radius:16px}' +
      '.hf-cell.on{background:var(--b);color:#fff}.hf-cell.on .hf-lab.in{opacity:.95}' +
      /* 카드 이미지 — 셀 상단 풀블리드(여백 없음), 업로드=hf-cimg, 미업로드=hf-imgph.cell 슬롯 */
      '.hf-cell{overflow:hidden}' +
      '.hf-cimg{width:calc(100% + 52px);height:170px;object-fit:cover;border-radius:0;margin:-28px -26px 12px;display:block;flex:0 0 auto}' +
      '.hf-imgph.cell{min-height:0;height:170px;width:calc(100% + 52px);margin:-28px -26px 12px;border-radius:0;background:rgba(0,0,0,.045);flex:0 0 auto}' +
      '.hf-cell.on .hf-imgph.cell{background:rgba(255,255,255,.16);color:rgba(255,255,255,.8)}' +
      '.hf-cellhead{font-size:24px;font-weight:700;letter-spacing:-.01em;line-height:1.3}' +
      '.hf-celltx{font-size:15.5px;line-height:1.6;opacity:.92;margin-top:auto}' +
      /* 타임라인 */
      '.hf-trows{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;padding:14px 0;position:relative;z-index:2}' +
      /* 행 전부 동일 톤 — 중간에 면(틴트 밴드) 끼우면 표가 어긋나 보임(피드백 반영) */
      '.hf-trow{display:grid;grid-template-columns:130px 300px 1fr;gap:26px;align-items:baseline;padding:19px 2px;border-bottom:1px solid var(--rule)}' +
      '.hf-trow:first-child{border-top:2px solid var(--t)}' +
      '.hf-trow .w{font-size:17px;font-weight:800;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-trow .h{font-size:20px;font-weight:700}.hf-trow .t{font-size:16px;color:var(--muted)}' +
      /* 표 */
      '.hf-tbl{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;flex-direction:column;padding:14px 0;position:relative;z-index:2}' +
      '.hf-tbrow{display:grid;gap:24px;align-items:center;padding:18px 2px;border-bottom:1px solid var(--rule);font-size:17.5px;color:var(--body)}' +
      '.hf-tbrow .f{font-weight:800;color:var(--t)}' +
      '.hf-tbrow.hd{font-size:12.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);padding:10px 2px;border-bottom:2px solid var(--t)}' +
      /* 체크리스트 */
      /* 행이 패널 높이를 나눠 갖게 — 위아래 빈틈 제거(피드백 반영) */
      '.hf-list{list-style:none;flex:1;min-height:0;display:flex;flex-direction:column;padding:14px 0;position:relative;z-index:2}' +
      '.hf-list li{flex:1;min-height:0;display:flex;align-items:center;gap:16px;padding:10px 2px;border-bottom:1px solid var(--rule);font-size:20px;color:var(--ink)}' +
      '.hf-list li:first-child{border-top:2px solid var(--t)}.hf-list li:last-child{border-bottom:0}' +
      '.hf-list.two{display:grid;grid-template-columns:1fr 1fr;column-gap:52px;grid-auto-rows:1fr}' +
      '.hf-list.two li:nth-child(2){border-top:2px solid var(--t)}' +
      '.hf-dot{width:10px;height:10px;border-radius:50%;background:var(--a);flex:0 0 auto}' +
      /* 안내 rows */
      '.hf-mdgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr;align-content:center;padding:20px 0}' +
      /* 우측 이미지 크게 — 컬럼 절반 차지, 세로 풀 스트레치(피드백 반영) */
      '.hf-mdgrid.hasimg{grid-template-columns:1fr 1.05fr;gap:40px;align-items:stretch;align-content:stretch}' +
      '.hf-mdgrid.hasimg .hf-srows{align-self:center}' +
      '.hf-mdgrid.hasimg .hf-imgcol{min-height:0}' +
      '.hf-mdgrid.hasimg .hf-imgph{flex:1;min-height:0}' +
      '.hf-mdgrid.hasimg .hf-mimg{flex:1;min-height:0;max-height:none;height:100%;object-fit:cover}' +
      /* 필 밴드 대신 플레인 행 — 심플 지시 반영 */
      '.hf-srows{display:flex;flex-direction:column}' +
      '.hf-srow{display:flex;align-items:baseline;gap:28px;padding:19px 2px;border-bottom:1px solid var(--rule)}' +
      '.hf-srow:first-child{border-top:2px solid var(--t)}' +
      '.hf-srow .k{width:130px;flex:0 0 auto;font-size:12.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--t)}' +
      '.hf-srow .t{font-size:18px;color:var(--ink)}' +
      '.hf-mimg{width:100%;max-height:420px;object-fit:cover;border-radius:14px;display:block}' +
      '.hf-imgph{background:var(--tn);min-height:210px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px;border-radius:12px}' +
      /* 업로드 이미지 공통 — 슬롯 자리를 그대로 채움 */
      '.hf-abimg{display:block;object-fit:cover;min-height:0;border-radius:14px}' +
      '.hf-abwide .hf-abimg,.hf-abframe .hf-abimg,.hf-sdpanel .hf-abimg{flex:1;width:100%}' +
      '.hf-abframe .hf-abimg{border-radius:0}' +
      '.hf-sdpanel .hf-abimg{border-radius:12px}' +
      '.hf-abgrid .hf-abimg{width:100%;height:100%;border-radius:14px}' +
      '.hf-imgcol{display:flex;flex-direction:column;gap:9px}' +
      /* 포토 앨범 — 2024 템플릿 실측: 사진 존 + 하단 캡션 밴드 */
      '.slide.ab{padding:0}' +
      '.hf-abwide{flex:1;min-height:0;margin:36px 44px 0;display:flex}' +
      '.hf-abwide .hf-imgph{flex:1;min-height:0;border-radius:14px}' +
      '.slide.ab.sd{flex-direction:row;gap:34px;padding:36px;align-items:stretch}' +
      '.hf-sdcap{position:relative;z-index:2;flex:0 0 270px;display:flex;flex-direction:column;justify-content:center;gap:16px;color:#fff;padding:10px 0}' +
      '.hf-sdcap .hf-abyear{align-self:flex-start}' +
      '.hf-sdtitle{font-size:29px;font-weight:800;line-height:1.4;letter-spacing:-.01em;white-space:pre-wrap}' +
      '.hf-sdtx{font-size:14px;line-height:1.7;opacity:.92;white-space:pre-wrap;border-top:1px solid rgba(255,255,255,.5);padding-top:14px}' +
      '.hf-sdfoot{margin-top:auto;font-size:11.5px;opacity:.75}' +
      '.hf-sdpanel{position:relative;z-index:2;flex:1;min-width:0;background:#fff;padding:14px;display:flex}' +
      '.hf-sdpanel .hf-imgph{flex:1;min-height:0}' +
      '.slide.ab.gd{padding:36px}' +
      '.hf-abpanel{position:relative;z-index:2;flex:1;min-height:0;background:#fff;padding:34px 38px;display:flex;flex-direction:column;gap:22px}' +
      /* 칩은 좌측 고정, 타이틀은 패널 정중앙(피드백 반영) */
      '.hf-abphead{flex:none;position:relative;display:flex;align-items:center;justify-content:center;min-height:56px}' +
      '.hf-abphead .hf-abyear{position:absolute;left:0;top:50%;transform:translateY(-50%)}' +
      '.hf-abyear.pv{color:var(--t);border-color:var(--t)}' +
      '.hf-abptitle{font-size:24px;font-weight:800;letter-spacing:-.01em;color:var(--ink);white-space:pre-wrap;text-align:center}' +
      '.hf-abgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}' +
      '.hf-abgrid .hf-imgph{min-height:0;border-radius:14px}' +
      '.hf-abband{flex:none;height:206px;margin:30px 44px 36px;position:relative;background:var(--t);color:#fff;display:flex;align-items:center;gap:40px;padding:0 74px 0 54px;overflow:hidden;border-radius:16px}' +
      '.hf-abband .hf-abarc{position:absolute;width:360px;height:360px;border-radius:50%;background:rgba(255,255,255,.12);right:-170px;top:-30px;pointer-events:none}' +
      '.hf-abyear{flex:0 0 auto;font-size:14px;font-weight:700;padding:7px 18px;border:1.5px solid rgba(255,255,255,.8);border-radius:999px!important}' +
      '.hf-abyear:empty{display:none}' +
      '.hf-abyear.iv{border-color:rgba(255,255,255,.85)}' +
      '.hf-abtitle{flex:1;text-align:center;font-size:27px;font-weight:800;line-height:1.4;letter-spacing:-.01em;white-space:pre-wrap;position:relative;z-index:1}' +
      '.hf-abcap{flex:0 0 auto;max-width:236px;font-size:13.5px;line-height:1.7;opacity:.92;white-space:pre-wrap;position:relative;z-index:1;border-top:1px solid rgba(255,255,255,.55);padding-top:12px}' +
      '.hf-abcap:empty{display:none}' +
      '.hf-abfoot{position:absolute;right:22px;bottom:14px;font-size:11.5px;opacity:.75;z-index:1}' +
      /* frame = 대형 이미지 케이스(피드백 반영) — 여백 36px 균일, 프레임 풀폭 */
      '.slide.ab.fr{padding:36px}' +
      '.hf-abframe{position:relative;z-index:2;flex:1;min-height:0;margin:0;background:#fff;padding:14px;display:flex}' +
      '.hf-abframe .hf-imgph{flex:1;min-height:0}' +
      '.hf-abfr-cap{position:relative;z-index:2;flex:none;display:flex;align-items:center;justify-content:center;gap:18px;padding:20px 0 0;color:#fff}' +
      '.hf-abfr-cap .hf-abtitle{flex:0 1 auto;font-size:22px}' +
      /* 수치 */
      /* 수치 — 카드 박스 없이 플레인(심플 지시 반영): 좌 대형 수치, 우 슬림 바 */
      '.hf-stgrid{flex:1;min-height:0;display:grid;grid-template-columns:0.9fr 1.1fr;gap:56px;align-items:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-stgrid.solo{grid-template-columns:1fr}' +
      '.hf-stbig{display:flex;flex-direction:column;gap:8px}' +
      '.hf-stnum{font-size:116px;font-weight:800;line-height:1;letter-spacing:-.04em;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-stnum i{font-style:normal}.hf-stnum em{font-style:normal;font-size:44px;font-weight:700}' +
      '.hf-stcap{font-size:15px;color:var(--muted);margin-top:6px}' +
      '.hf-brows{display:flex;flex-direction:column;gap:22px}' +
      '.hf-brow{display:flex;flex-direction:column;gap:8px}' +
      '.hf-brow .hd{display:flex;justify-content:space-between;align-items:baseline}' +
      '.hf-brow .l{font-size:17px;font-weight:700}.hf-brow .v{font-size:19px;font-weight:800;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-brow .tr{height:8px;background:var(--tn);border-radius:999px;overflow:hidden}' +
      '.hf-brow .tr i{display:block;height:100%;background:var(--t);border-radius:999px}' +
      '.hf-brow .tx{font-size:13.5px;color:var(--muted)}' +
      /* KPI */
      /* KPI 카드 — 콘텐츠 세로 중앙, 아래 빈 공간 제거(피드백 반영) */
      '.hf-cell.kp{min-height:190px;justify-content:center;gap:12px}' +
      '.hf-cell.kp.on{background:var(--b);color:#fff}.hf-cell.kp.on .hf-lab.in{opacity:.95}' +
      '.hf-kpval{font-size:52px;font-weight:800;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}' +
      '.hf-cell.kp:not(.on) .hf-kpval{color:var(--t)}' +
      /* 프로세스 */
      /* 카드가 패널 높이만큼 늘어나 가운데가 텅 비던 문제 — 콘텐츠 허그 + 세로 중앙 */
      '.hf-procrow{flex:1;min-height:0;display:flex;align-items:center;gap:14px;padding:20px 0;position:relative;z-index:2}' +
      '.hf-parr{font-size:24px;font-weight:700;color:var(--t);flex:0 0 auto}' +
      '.hf-pstep{flex:1;background:var(--tn);border-radius:16px;padding:30px 28px;display:flex;flex-direction:column;gap:11px;min-height:200px}' +
      '.hf-pstep.on{background:var(--t);color:#fff}' +
      '.hf-phead{font-size:24px;font-weight:800;letter-spacing:-.01em;line-height:1.3;white-space:pre-wrap}' +
      '.hf-ptx{font-size:15px;line-height:1.6;color:var(--body)}' +
      '.hf-pstep.on .hf-ptx{color:#fff;opacity:.94}' +
      /* 비교 */
      /* 비교 — 라벨+문장 플레인(표 아님, 피드백 반영). 좌정렬 한 축 */
      '.hf-cmpgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:16px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-cmp{background:var(--tn);border-radius:16px;padding:32px 34px;display:flex;flex-direction:column;gap:20px;min-height:240px}' +
      '.hf-cmp ul{list-style:none;display:flex;flex-direction:column;gap:14px;font-size:18px;line-height:1.6;color:var(--body)}' +
      '.hf-cmp.on{background:var(--b);color:#fff}.hf-cmp.on ul{color:#fff;font-weight:600}' +
      /* 로드맵 */
      '.hf-rmgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-rmcol{background:var(--tn);border-radius:16px;padding:28px 26px;display:flex;flex-direction:column;gap:14px;min-height:250px}' +
      '.hf-rmcol.now{background:var(--t);color:#fff}' +
      '.hf-rmhead{font-size:23px;font-weight:800;letter-spacing:-.01em}' +
      '.hf-rmlist{list-style:none;display:flex;flex-direction:column;gap:8px;font-size:15.5px;line-height:1.55;color:var(--body)}' +
      '.hf-rmcol.now .hf-rmlist{color:#fff;opacity:.95}' +
      /* 마일스톤 — 전 팩 공통 */
      '.slide.hf.ms{gap:16px}' +
      '.ms-phases{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:8px;flex:none;margin-top:14px}' +
      '.ms-phase{background:var(--tn);border-radius:12px;padding:14px 18px;display:flex;flex-direction:column;gap:6px}' +
      '.ms-ptag{align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:4px 11px;background:#fff;color:var(--t);border-radius:999px}' +
      '.ms-phase.on .ms-ptag{background:var(--t);color:#fff}' +
      '.ms-phead{font-size:18px;font-weight:800;letter-spacing:-.01em}' +
      '.ms-ptext{font-size:13px;color:var(--body);line-height:1.5}' +
      '.ms-chart{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:space-evenly;padding:6px 0 12px;overflow:hidden}' +
      '.ms-glines{position:absolute;inset:0;display:grid;grid-auto-flow:column;grid-auto-columns:1fr}' +
      '.ms-glines i{border-left:1px dashed var(--rule)}' +
      '.ms-bar{position:relative;z-index:1;padding:10px 18px;display:flex;flex-direction:column;gap:2px;color:#fff;border-radius:999px}' +
      '.ms-bar b{font-size:15px;font-weight:800;letter-spacing:-.01em}' +
      '.ms-bar span{font-size:12.5px;opacity:.9}' +
      '.ms-axis{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;flex:none;border-top:1px solid var(--rule);padding-top:8px}' +
      '.ms-axis span{font-size:13px;color:var(--muted);text-align:center}' +
      /* 좌우 대비 */
      '.hf-splitgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:14px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-half{border:1.5px solid var(--rule);border-radius:16px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-height:240px}' +
      '.hf-half ul{list-style:none;display:flex;flex-direction:column;gap:12px;font-size:17px;color:var(--muted)}' +
      '.hf-half ul li{display:flex;align-items:center;gap:12px}' +
      '.hf-half .hf-dot.dim{background:var(--rule)}' +
      '.hf-half.on{border:0;background:var(--tn);color:var(--ink)}.hf-half.on ul{color:var(--ink);font-weight:600}' +
      /* 한 단어 — 대형 타이포 중앙 */
      '.hf-wdmid{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;z-index:2}' +
      '.hf-word{font-size:150px;font-weight:800;line-height:1.15;letter-spacing:-.03em;color:var(--t);white-space:pre-wrap;text-align:center}' +
      '.hf-word b{color:var(--b)}' +
      '.hf-wdcap{font-size:18px;color:var(--muted)}' +
      /* 스테이트먼트 — 타이틀+서브 중앙 대형 */
      '.hf-stmid{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;z-index:2;text-align:center}' +
      '.hf-sttitle{font-size:56px;font-weight:800;line-height:1.32;letter-spacing:-.02em;white-space:pre-wrap}' +
      '.hf-sttitle b{color:var(--t)}' +
      '.hf-stsub{font-size:20px;line-height:1.6;color:var(--muted);white-space:pre-wrap}' +
      /* 이미지 히어로 — 풀블리드 배경+중앙 텍스트 */
      '.slide.hf.hr{padding:0;position:relative;display:flex;align-items:center;justify-content:center;color:#fff}' +
      '.hf-herobg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:0;min-height:0}' +
      '.hf-herobg.ph{display:flex;align-items:center;justify-content:center;background:linear-gradient(155deg,var(--t),var(--b) 72%);color:rgba(255,255,255,.55);font-size:14px}' +
      '.hf-heroov{position:absolute;inset:0;background:rgba(8,22,16,.34);pointer-events:none}' +
      '.hf-heromid{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center}' +
      '.hf-herotitle{font-size:62px;font-weight:800;line-height:1.25;letter-spacing:-.02em;white-space:pre-wrap}' +
      '.hf-herosub{font-size:20px;line-height:1.6;color:rgba(255,255,255,.92);white-space:pre-wrap}' +
      /* 대형 수치 */
      '.hf-bsmid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;position:relative;z-index:2}' +
      '.hf-bsval{font-size:132px;font-weight:800;line-height:1;letter-spacing:-.04em;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-bscap{font-size:20px;line-height:1.6;color:var(--body);max-width:44ch}' +
      /* 인용 — 풀블리드 딥 */
      '.slide.qt{background:var(--b)}' +
      '.hf-circ.q{background:rgba(255,255,255,.1)}' +
      '.hf-arc.q{opacity:.9}' +
      '.hf-qmid{position:relative;z-index:3;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:22px}' +
      '.hf-qtx{font-size:42px;font-weight:700;line-height:1.42;letter-spacing:-.015em;white-space:pre-wrap;max-width:86%}' +
      '.hf-qby{font-size:16px;font-weight:600;opacity:.85}' +
      /* 하단 밴드 노트 */
      '.hf-key{margin:0 -64px -52px;margin-top:auto;padding:20px 64px;flex:none;display:flex;align-items:center;gap:30px;color:#fff;position:relative;z-index:2;' +
      'background:linear-gradient(96deg,var(--t) 0%,var(--b) 100%)}' +
      '.hf-klab{font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;opacity:.9;flex:0 0 auto}' +
      '.hf-ktx{font-size:20px;font-weight:400;line-height:1.4}.hf-ktx b{font-weight:700}' +
      '@keyframes vfu{from{opacity:0}to{opacity:1}}';
  }

  function renderHfdDeck(data) {
    data = data || {};
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    var th = themeOf(data);
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>' + css() + '</style></head><body data-th="' + th + '">' +
      '<div class="ppt-stack">' + renderSlides(slides, data.images) + '</div>' + chipScript(th) + stateScript(slides) + '</body></html>';
  }

  /* ---- 발표 뷰어 ---- */
  function renderHfdViewer(data, opts) {
    data = data || {}; opts = opts || {};
    var slides = (data.slides && data.slides.length) ? JSON.parse(JSON.stringify(data.slides)) : JSON.parse(JSON.stringify(DEFAULT_DECK.slides));
    var th = themeOf(data);
    var vcss =
      'html,body{height:100%}body{background:#0f1512;overflow:hidden}' +
      '.vwrap{position:fixed;inset:0;display:flex;justify-content:center;align-items:flex-start}' +
      '.vscale{width:var(--slide-w);height:var(--slide-h);position:relative;flex:none;transform-origin:top center}' +
      '.vscale .slide{position:absolute;inset:0;visibility:hidden;box-shadow:0 24px 80px rgba(0,0,0,.45)}' +
      '.vscale .slide.cur{visibility:visible}' +
      '.vbar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:9px 16px;border-radius:999px;background:rgba(15,21,18,.72);backdrop-filter:blur(10px);color:#fff;font-family:Pretendard,system-ui,sans-serif;font-size:13px;z-index:9;user-select:none}' +
      '.vbtn{border:none;background:rgba(255,255,255,.12);color:#fff;width:34px;height:34px;border-radius:999px;font-size:15px;cursor:pointer;line-height:1}' +
      '.vbtn:hover{background:rgba(255,255,255,.24)}.vbtn:disabled{opacity:.3;cursor:default}' +
      '.vcount{min-width:52px;text-align:center;font-variant-numeric:tabular-nums;opacity:.9}' +
      'body.pfs .vbar{display:none!important}' +
      '.hf-chips{top:14px;right:16px}';
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
      'var us=cur.querySelectorAll(' + JSON.stringify(UNIT_SEL + ',.hf-imgph,.hf-key,.hf-cvin,.hf-dvmid,.hf-qmid,.hf-grmid') + ');var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      '}' +
      'c.textContent=(n+1)+" / "+s.length;pb.disabled=n===0;nb.disabled=n===s.length-1;}' +
      'document.addEventListener("fullscreenchange",fit);' +
      'addEventListener("message",function(e){if(!e.data)return;if(e.data.pptFsKey)toggleFs();else if(e.data.pptFsUi!=null)setPseudo(!!e.data.pptFsUi);});' +
      'addEventListener("resize",fit);fit();show(' + (Math.max(0, Math.min(+opts.start || 0, slides.length - 1))) + ');' +
      'pb.onclick=function(e){e.stopPropagation();show(n-1)};nb.onclick=function(e){e.stopPropagation();show(n+1)};' +
      'var fbn=document.querySelector(".vfs");if(fbn)fbn.onclick=function(e){e.stopPropagation();toggleFs();};' +
      'document.addEventListener("click",function(e){if(e.target.closest(".vbar")||e.target.closest(".hf-chips"))return;show(n+1)});' +
      'document.addEventListener("keydown",function(e){' +
      'if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" ")show(n+1);' +
      'else if(e.key==="ArrowLeft"||e.key==="PageUp")show(n-1);' +
      'else if(e.key==="f"||e.key==="F")toggleFs();' +
      'else if(e.key==="Escape"&&!document.fullscreenElement)setPseudo(false);});' +
      '})();';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>' + css() + vcss + '</style></head><body data-th="' + th + '">' +
      '<div class="vwrap"><div class="vscale">' + renderSlides(slides, data.images) + '</div></div>' +
      '<div class="vbar"><button class="vbtn vprev">‹</button><span class="vcount"></span><button class="vbtn vnext">›</button><button class="vbtn vfs">⛶</button></div>' +
      chipScript(th) + stateScript(slides) +
      '<scr' + 'ipt>' + vjs + '</scr' + 'ipt></body></html>';
  }

  /* ---- 카탈로그("언제 쓰나") ---- */
  var CATALOG = [
    { type: 'cover', label: '표지', use: '첫 장 — 2밴드+원 기하, 행사명·서브·날짜', needs: ['title'], opt: ['sub', 'date'] },
    { type: 'greeting', label: '인사말', use: '대표·주최 인사 문장 한 단락', needs: ['text'], opt: ['label', 'by'] },
    { type: 'toc', label: '목차', use: '안내 순서 — 컬러 밴드 컬럼 2~4', needs: ['items'], opt: ['title'], cap: { items: '2~4개' } },
    { type: 'divider', label: '간지', use: '파트 시작 — 표지 기하+번호+타이틀', needs: ['title'], opt: ['no', 'lead'] },
    { type: 'section', label: '본문 표준', use: '핵심 안내 2~4개 — 번호+보더탑 소제목', needs: ['title', 'points'], opt: ['sub', 'note'], cap: { points: '2~4개' } },
    { type: 'cards', label: 'N열 카드', use: '프로그램·혜택 카드 2~4 — 틴트/딥 셀', needs: ['title', 'cards'], opt: ['sub', 'note'], cap: { cards: '2~4개' } },
    { type: 'timeline', label: '일정', use: '당일 시간표 — 시간+제목+설명 행', needs: ['title', 'items'], opt: ['sub', 'note'], cap: { items: '3~6개' } },
    { type: 'table', label: '표', use: '장소·대상·문의 등 정보 표', needs: ['title', 'columns', 'rows'], opt: ['sub', 'note'] },
    { type: 'checklist', label: '체크리스트', use: '준비물·유의사항 — 도트 리스트, 5개 초과 시 2열', needs: ['title', 'items'], opt: ['cols', 'sub', 'note'] },
    { type: 'media', label: '안내 rows', use: '오시는 길·운영 정보(라벨+내용, 핵심 행 강조)+이미지 슬롯', needs: ['title', 'specs'], opt: ['image', 'caption', 'sub', 'note'] },
    { type: 'photos', label: '포토 앨범', use: '행사 사진 장 — wide(풀폭 1장+캡션 밴드)/grid(패널 안 3장)/frame(기하 위 화이트 프레임)/side(좌 캡션 컬럼+우 대형 패널)', needs: ['title', 'items'], opt: ['variant', 'year', 'caption', 'foot'], cap: { items: 'wide·frame 1개, grid 3개' } },
    { type: 'stats', label: '수치', use: '참여·달성 수치 — 좌 대형 % 카드+우 진행바', needs: ['title'], opt: ['donut', 'bars', 'sub'] },
    { type: 'kpi', label: 'KPI 카드', use: '핵심 지표 2~4개 — 값+라벨 라운드 카드', needs: ['title', 'items'], opt: ['sub'], cap: { items: '2~4개' } },
    { type: 'process', label: '프로세스', use: '신청·입장 등 단계 흐름 3~4 — 화살표 연결, 중앙 강조', needs: ['title', 'steps'], opt: ['accent', 'sub'], cap: { steps: '3~4개' } },
    { type: 'compare', label: '비교', use: '작년/올해·Before/After — 틴트 vs 딥 카드', needs: ['title', 'items'], opt: ['sub'], cap: { items: '2개' } },
    { type: 'roadmap', label: '로드맵', use: '준비 일정 Now/Next/Then 3열 카드', needs: ['title', 'steps'], opt: ['sub'], cap: { steps: '3개' } },
    { type: 'milestone', label: '마일스톤', use: '기간 준비 계획 간트 — 단계 카드+월축 라운드 바', needs: ['title', 'bars', 'axis'], opt: ['phases'] },
    { type: 'split', label: '좌우 대비', use: '회사 준비 vs 참여자 준비 등 두 축 대비 리스트', needs: ['left', 'right'], opt: ['title', 'sub'] },
    { type: 'bigstat', label: '대형 수치', use: '수치 하나로 임팩트 — 대형 숫자+캡션', needs: ['title', 'value'], opt: ['caption'] },
    { type: 'word', label: '한 단어', use: '한 단어 임팩트 — 대형 타이포 중앙(감사·환영)', needs: ['text'], opt: ['caption'] },
    { type: 'statement', label: '스테이트먼트', use: '타이틀+서브 문장 중앙 대형 — 메시지 전달 장', needs: ['title'], opt: ['sub'] },
    { type: 'hero', label: '이미지 히어로', use: '풀블리드 배경 이미지+중앙 텍스트(이미지는 업로드)', needs: ['title'], opt: ['sub'] },
    { type: 'quote', label: '슬로건', use: '행사 슬로건·메시지 — 풀블리드 딥 밴드', needs: ['text'], opt: ['by'] },
    { type: 'closing', label: '엔딩', use: '마지막 장 — 표지 기하+마무리 인사·문의처', needs: ['title'], opt: ['sub', 'contact'] }
  ];

  var STARTERS = {
    cover: { type: 'cover', title: 'MIDAS\nHappy Family Day', sub: '마이다스 해피패밀리데이', date: '2026. 05. 22 (금)' },
    greeting: { type: 'greeting', label: 'Greeting', text: '가족과 함께하는 하루,\n**해피 패밀리 데이**에 여러분을 초대합니다.\n일 년에 단 하루, 회사가 가족의 놀이터가 됩니다.', by: '마이다스아이티' },
    toc: { type: 'toc', title: '안내 순서', items: [{ label: '행사 개요', desc: '취지와 한눈에 보기', pages: '03 — 05' }, { label: '프로그램', desc: '당일 일정과 체험 부스', pages: '06 — 09' }, { label: '참여 안내', desc: '준비물·오시는 길', pages: '10 — 12' }] },
    divider: { type: 'divider', no: '01', title: '행사 개요', lead: '해피 패밀리 데이가 준비한 하루를 소개합니다' },
    section: { type: 'section', title: '이런 하루를\n준비했습니다', points: [{ head: '가족 초청', text: '임직원 가족을 회사로 초대해 일터를 소개합니다' }, { head: '체험 프로그램', text: '아이와 함께하는 만들기·놀이 부스를 운영합니다' }, { head: '기념 선물', text: '참여 가족 모두에게 기념 선물을 드립니다' }] },
    cards: { type: 'cards', title: '프로그램\n하이라이트', cards: [{ tag: 'Booth', head: '패밀리 포토존', text: '가족 사진 촬영과 즉석 인화', img: true }, { tag: 'Play', head: '키즈 플레이존', text: '연령별 놀이·만들기 체험', img: true }, { tag: 'Gift', head: '경품 추첨', text: '전 가족 대상 경품 이벤트', img: true }] },
    timeline: { type: 'timeline', title: '당일 일정', items: [{ when: '13:00', head: '등록 · 웰컴 키트', text: '로비에서 가족 확인 후 입장' }, { when: '13:30', head: '환영 인사', text: '대표 인사 및 행사 안내' }, { when: '14:00', head: '체험 부스 운영', text: '포토존·플레이존·만들기 부스' }, { when: '16:30', head: '경품 추첨 · 마무리', text: '기념 선물 증정' }] },
    table: { type: 'table', title: '행사 정보', columns: ['구분', '내용', '비고'], rows: [{ cells: ['일시', '2026. 05. 22 (금) 13:00 - 17:00', '—'] }, { cells: ['장소', '판교 사옥 1층 로비 · 대강당', '주차 지원'] }, { cells: ['대상', '전 임직원 및 가족', '사전 신청'] }] },
    checklist: { type: 'checklist', title: '참여 전\n확인해 주세요', items: ['사전 신청 후 확정 문자를 확인해 주세요', '어린이는 보호자와 동반 입장합니다', '주차권은 등록 데스크에서 배부합니다', '편한 복장으로 참여해 주세요'] },
    media: { type: 'media', title: '오시는 길', specs: [{ label: 'Address', text: '경기 성남시 분당구 판교로 000' }, { label: 'Subway', text: '판교역 4번 출구 도보 10분' }, { label: 'Parking', text: '사옥 지하주차장 이용(등록 시 주차권 배부)' }], caption: '', image: { label: '약도 이미지' } },
    photos: { type: 'photos', variant: 'wide', year: '2026년', title: '5월에 함께한\n해피 패밀리 데이', caption: '가족과 함께한 하루의 기록.\n포토존과 체험 부스의 순간들을\n사진으로 남겼습니다.', foot: 'MIDAS', items: [{ label: '대표 사진' }] },
    stats: { type: 'stats', title: '지금까지\n이만큼 모였어요', donut: { pct: 88, label: '사전 신청률', caption: '신청 마감 D-7 기준' }, bars: [{ label: '신청 완료 가족', pct: 88, value: '106가족' }, { label: '가족 동반 참여', pct: 64 }, { label: '첫 참여 가족', pct: 41 }] },
    kpi: { type: 'kpi', title: '한눈에 보는\n올해 준비', items: [{ value: '120', label: '초청 가족' }, { value: '12', label: '체험 부스' }, { value: '4.8', label: '작년 만족도', tone: 'on' }] },
    process: { type: 'process', title: '참여는\n세 단계면 끝나요', steps: [{ tag: 'STEP 1', head: '사전 신청', text: '사내 공지 링크에서 가족 인원 입력' }, { tag: 'STEP 2', head: '확정 안내', text: '문자로 확정·주차 안내를 받아요' }, { tag: 'STEP 3', head: '당일 입장', text: '로비 등록 데스크에서 웰컴 키트 수령' }] },
    compare: { type: 'compare', title: '올해는\n이렇게 달라져요', items: [{ head: '작년', items: ['오후 반일 운영', '체험 부스 6개', '기념품 공통 1종'] }, { head: '올해', items: ['하루 종일 운영', '체험 부스 12개로 확대', '연령별 맞춤 기념품'] }] },
    roadmap: { type: 'roadmap', title: '행사까지\n준비 일정', steps: [{ when: 'Now', head: '신청 접수', items: ['사내 공지 오픈', '가족 인원 조사'], state: 'now' }, { when: 'Next', head: '부스 확정', items: ['체험 프로그램 확정', '운영 인력 배정'] }, { when: 'Then', head: '행사 당일', items: ['등록·웰컴 키트', '체험·경품 추첨'] }] },
    milestone: { type: 'milestone', title: '월별 준비 계획', phases: [{ tag: '현재', head: '신청 접수', text: '사내 공지·가족 조사' }, { tag: '다음', head: '운영 준비', text: '부스·키트 제작', on: true }], bars: [{ label: '신청 접수', sub: '4월 — 사내 공지', start: 1, span: 2 }, { label: '부스·키트 준비', sub: '4~5월 — 제작·배정', start: 2, span: 2 }, { label: '행사 운영', sub: '5월 — 당일 운영·기록', start: 3, span: 2 }], axis: ['4월 초', '4월 말', '5월 초', '5월 말'] },
    split: { type: 'split', title: '준비는 회사가,\n가족은 오시기만 하면 돼요', left: { kicker: '회사가 준비해요', items: ['체험 부스·기념 선물', '가족 식사와 간식', '주차·안전 요원'] }, right: { kicker: '가족은 이것만', items: ['사전 신청 1분', '편한 복장', '즐길 마음'] } },
    bigstat: { type: 'bigstat', title: '올해 초청 규모', value: '120가족', caption: '작년보다 **40가족 더** — 전 임직원 가족 모두를 초대합니다' },
    word: { type: 'word', text: '고마워요', caption: '함께해 준 모든 가족에게 전하는 마음' },
    statement: { type: 'statement', title: '하루의 즐거움이\n일 년의 힘이 됩니다', sub: '가족과 함께하는 해피 패밀리 데이' },
    hero: { type: 'hero', title: 'HAPPY\nFAMILY DAY', sub: '2026. 05. 22 FRI · 판교 사옥' },
    quote: { type: 'quote', text: '일하는 자리가\n**가족의 자랑**이 되도록.', by: 'Happy Family Day' },
    closing: { type: 'closing', title: '5월 22일,\n가족과 함께 만나요', sub: '마이다스 해피패밀리데이', contact: '문의 · 피플팀' }
  };

  var SCHEMA_DOC = CATALOG.map(function (c) { return c.type + '(' + c.label + '): ' + c.use; }).join('\n');
  var FIELD_DOC =
    'cover:{title(행사명, \\n 2줄),sub?(국문 부제),date?(일시)} | ' +
    'greeting:{label?,text(인사 문장, **강조**, \\n 줄바꿈),by?(주최명)} | ' +
    'toc:{title?,items:[{no?,label(파트명),desc?(한 줄),pages?}](2~4개)} | ' +
    'divider:{no?:"01",title(파트 제목),lead?(한 문장)} | ' +
    'section:{title(\\n 2줄 가능),points:[{no?,head,text}](2~4개),sub?} | ' +
    'cards:{title,cards:[{tag?,head,text?,tone?:"dark"(딥 셀)}](2~4개),sub?} | ' +
    'timeline:{title,items:[{when:"13:00",head,text?,on?:true(틴트 강조)}](3~6개),sub?} | ' +
    'table:{title,columns:[str],rows:[{cells:[str]}],sub?} | ' +
    'checklist:{title,items:[str],cols?:1~2,sub?} | ' +
    'media:{title,specs:[{label(짧은 영문),text,on?:true(딥 강조 행)}](3~5개),image?:{label},caption?,sub?} | ' +
    'photos:{variant?:"wide|grid|frame|side"(기본 wide),year?(연도 칩 "2026년"),title(캡션 밴드 타이틀 \\n 2줄),caption?(우측 캡션 \\n 2~3줄),foot?(우하단 소라벨),items:[{label}](wide·frame 1개, grid 3개)} | ' +
    'stats:{title,donut?:{pct:0~100,label?,caption?},bars?:[{label,pct:0~100,value?,on?:true(틴트 강조 행),text?}](2~4개),sub?} | ' +
    'kpi:{title,items:[{value,label,desc?,tone?:"on"(딥 카드)}](2~4개),sub?} | ' +
    'process:{title,steps:[{tag:"STEP 1"류,head,text?}](3~4개),accent?:강조 인덱스(기본 중앙),sub?} | ' +
    'compare:{title,items:[{head:"작년|올해"류,items:[str]}](2개),sub?} | ' +
    'roadmap:{title,steps:[{when:"Now|Next|Then",head,items:[str],state?:"now"}](3개),sub?} | ' +
    'milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[구간 라벨 4~6]} | ' +
    'split:{title?,left:{kicker,items:[str]},right:{kicker,items:[str]},sub?} — 좌 흐림/우 강조 | ' +
    'bigstat:{title,value,caption?(**강조**)} | ' +
    'word:{text(2~6자 대형 단어),caption?(한 줄)} | ' +
    'statement:{title(중앙 대형 문장, \\n 2줄),sub?(한 줄)} | ' +
    'hero:{title(중앙 대형, \\n 2줄),sub?(한 줄)}(배경 이미지는 사용자 업로드 — 창작 금지) | ' +
    'quote:{text(슬로건, **강조**, \\n 줄바꿈),by?} | ' +
    'closing:{title(마무리 인사, \\n 2줄),sub?,contact?(문의처)}' +
    '\n규칙: 행사 안내 톤 — 따뜻하고 간결한 한국어. 일정·장소·대상은 브리프에 있는 것만 쓰고 창작 금지. ' +
    'title은 의미 단위 \\n 줄바꿈. 이모지 금지. theme 필드(green|teal|cyan|indigo)는 덱 루트에 1개.';

  var DEFAULT_DECK = {
    style: 'hfd', theme: 'green',
    slides: [
      STARTERS.cover, STARTERS.greeting, STARTERS.toc,
      STARTERS.divider, STARTERS.section, STARTERS.quote,
      { type: 'divider', no: '02', title: '프로그램', lead: '당일 일정과 체험 부스를 안내합니다' },
      STARTERS.timeline, STARTERS.cards, STARTERS.photos,
      { type: 'photos', variant: 'grid', year: '2026년', title: '체험 부스 미리 보기', caption: '포토존 · 플레이존 · 만들기 부스.\n연령별 프로그램을 준비했습니다.', foot: 'MIDAS', items: [{ label: '포토존' }, { label: '플레이존' }, { label: '만들기 부스' }] },
      { type: 'photos', variant: 'frame', year: '2026년', title: '올해의 한 컷', items: [{ label: '대표 사진' }] },
      { type: 'divider', no: '03', title: '참여 안내', lead: '준비물과 오시는 길을 확인해 주세요' },
      STARTERS.table, STARTERS.checklist, STARTERS.media,
      STARTERS.closing
    ]
  };

  function hfdTemplateDeck() {
    var slides = CATALOG.map(function (c) { return JSON.parse(JSON.stringify(STARTERS[c.type])); });
    return { slides: slides, style: 'hfd', theme: 'green' };
  }

  /* ---- 결정론 폴백 — AI 실패 시 브리프 키워드로 조립 ---- */
  function hfdComposeDeck(brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || 'Happy Family Day';
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 4);
    var slides = [{ type: 'cover', title: title, sub: brief.message || '', date: brief.date || '' }];
    if (outline.length > 1) slides.push({ type: 'toc', title: '안내 순서', items: outline.map(function (o) { return { label: o, desc: '' }; }) });
    outline.forEach(function (o, i) {
      slides.push({ type: 'divider', no: '0' + (i + 1), title: o, lead: '' });
      slides.push(JSON.parse(JSON.stringify(i % 2 ? STARTERS.cards : STARTERS.section)));
    });
    slides.push(JSON.parse(JSON.stringify(STARTERS.closing)));
    return { slides: slides, style: 'hfd', theme: 'green' };
  }

  window.renderHfdDeck = renderHfdDeck;
  window.renderHfdViewer = renderHfdViewer;
  window.hfdTemplateDeck = hfdTemplateDeck;
  window.HFD_SCHEMA_DOC = SCHEMA_DOC;
  window.HFD_FIELD_DOC = FIELD_DOC;
  window.hfdComposeDeck = hfdComposeDeck;
  window.HFD_TYPE_LABEL = CATALOG.reduce(function (m, c) { m[c.type] = c.label; return m; }, {});
  window.HFD_MV_SEL = MV_SEL;
  window.HFD_DEFAULT_DECK = DEFAULT_DECK;
  window.HFD_CATALOG = CATALOG;
  window.HFD_THEMES = THEMES;
  window.HFD_STYLE = { id: 'hfd', name: 'Happy Family Day', desc: '2밴드+원 기하 · 컬러 4종 선택 · 행사 안내 13타입 · 16:9', swatch: 'linear-gradient(135deg,#3D8A6B 0%,#216254 45%,#1B985E 100%)' };
  window.HFD_SLIDE_TYPES = CATALOG.map(function (c) { return { type: c.type, label: c.label }; });
  window.hfdNewSlide = function (type) { return JSON.parse(JSON.stringify(STARTERS[type] || STARTERS.section)); };
})();
