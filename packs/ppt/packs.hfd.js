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
  /* 2026 필(pill) 기하 확장톤 — Figma 538:2 실측(green·teal), cyan·indigo는 같은 HLS 오프셋 유도
     (md=b L+.13 / dt=b L+.07 / ik2=b L.11 — green 실측 재현 검증됨: #32947F≈#309479 등).
     sg=상단 세이지, p1=라이트 필, p2=브라이트 필, md=사이드바·밴드, cg=원형 수치, dt=간지 딥, ik2=아젠다 패널 잉크 */
  var THEMES2 = {
    green:  { sg: '#5BB694', p1: '#78CCA9', p2: '#23B67A', md: '#309479', cg: '#67C68E', dt: '#2B7F6D', ik2: '#063225' },
    teal:   { sg: '#1CA8A8', p1: '#54D7E1', p2: '#27C7C9', md: '#30A7BF', cg: '#37BCC8', dt: '#2A97AC', ik2: '#04333D' },
    cyan:   { sg: '#4DB6FF', p1: '#80CBFF', p2: '#3A98D9', md: '#4D80E4', cg: '#66DDFF', dt: '#326DE0', ik2: '#001338' },
    indigo: { sg: '#7C9DEB', p1: '#A6BDF5', p2: '#517BDE', md: '#4160D2', cg: '#8EBEF3', dt: '#2F4EC6', ik2: '#030D35' }
  };
  var BDG_BLUE = '#1652C5';   // 아젠다 파트 뱃지 텍스트(실측, 전 컬러웨이 공통 액센트)
  function themeOf(data) { return THEMES[data && data.theme] ? data.theme : 'green'; }

  /* ---- 공통 조각 ---- */
  function runhead(s, P, ctx, white) {
    /* 페이지 넘버 제거(사용자 지시) — 러닝헤드는 킥커만 */
    return '<div class="hf-run' + (white ? ' wh' : '') + '"><span class="hf-runl"' + de(P + '.kicker') + '>' + esc(s.kicker != null ? s.kicker : 'MIDAS Happy Family Day') + '</span></div>';
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
  /* 2026 필 기하 공통 조각 — 워드마크 2줄 텍스트 로고(우상/센터), 커버 배경 레이어(스샷 원호 실측 재현) */
  function hpWm(pos) { return '<div class="hp-wm' + (pos ? ' ' + pos : '') + '"><b>MIDAS</b><span>Happy Family Day</span></div>'; }
  function hpCoverBg() {
    /* 상/하 존 = 인라인 SVG 2장 — 원 파라미터는 Figma 렌더 경계 3점 원피팅 실측(세이지 c(18,343) R716 ·
       딥틸 c(-16,332) R753 · 브라이트 c(1354,854) R447, 수평 경계 y360). SVG 뷰포트가 클립을 담당하므로
       화면·PPTX(전 SVG 래스터) 모두 삐짐 없이 정확하다. fill=CSS 변수 → 테마 칩 대응. */
    return '<svg class="hp-cvz t" viewBox="0 0 1280 360"><rect width="1280" height="360"/><circle cx="18" cy="343" r="716"/></svg>' +
      '<svg class="hp-cvz b" viewBox="0 0 1280 360"><rect width="1280" height="360"/><circle class="cdt" cx="-16" cy="-28" r="753"/><circle class="ca" cx="1354" cy="494" r="447"/></svg>';
  }

  /* ---- 타입 렌더러 ---- */
  var R = {
    /* 표지 — 실측: 2밴드 + 좌측 화이트 오버레이 원 + 우하단 액센트 원 + 좌상 타이포 + 좌하 로고 */
    cover: function (s, P, ctx) {
      /* pill 변형 — 2026 필 기하 표지(Figma 538:2 G-01/G-02 실측): pill=타이틀 좌중, pill2=타이틀 좌상 */
      if (s.variant === 'pill' || s.variant === 'pill2') {
        var up = s.variant === 'pill2';
        return '<section class="slide hf hp-cv' + (up ? ' up' : '') + '" data-kind="' + kind(s, 'Cover') + '">' + hpCoverBg() +
          (up ? '' : '<span class="hp-cvkick"' + de(P + '.kicker') + '>' + esc(s.kicker != null ? s.kicker : (s.sub || '')) + '</span>') +
          hpWm() +
          '<h1 class="hp-cvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
          logo() + '</section>';
      }
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
      var items = (s.items || []).slice(0, 6);
      /* panel 변형 — 좌 컬러면 대형 타이틀+좌하 문서명, 우 대형 라운드 화이트 패널 목차 (카카오 CONTENTS 번안) */
      if (s.variant === 'panel') {
        var prows = items.map(function (it, i) {
          var IP = P + '.items.' + i;
          return '<div class="hf-tcprow">' +
            '<span class="no"' + de(IP + '.no') + '>' + esc(it.no || String(i + 1)) + '</span>' +
            '<span class="lb"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
            (it.desc ? '<span class="ds"' + de(IP + '.desc') + '>' + mb(it.desc) + '</span>' : '') + '</div>';
        }).join('');
        return '<section class="slide hf tc pv" data-kind="' + kind(s, 'Contents') + '">' +
          '<span class="hf-tcblob"></span>' +
          '<h2 class="hf-tcbig"' + de(P + '.title') + '>' + mb(s.title || 'CONTENTS') + '</h2>' +
          (s.foot ? '<div class="hf-tcdeck"' + de(P + '.foot') + '>' + mb(s.foot) + '</div>' : '') +
          '<div class="hf-tcplist">' + prows + '</div></section>';
      }
      items = items.slice(0, 5);
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
      /* pill 변형 — 2026 필 기하 간지(538:2 G-간지1/2 실측): pill=상하 2필, pill2=3필 스택+타원 오버레이 */
      if (s.variant === 'pill' || s.variant === 'pill2') {
        var pills = s.variant === 'pill2'
          ? '<span class="hp-dv2a"></span><span class="hp-dv2b"></span><span class="hp-dv2c"></span>' +
            /* 우측 대형 원 "바깥"만 어둡게 — evenodd 구멍 SVG(마스크 금지: PPTX는 SVG 통째 래스터라 안전) */
            '<svg class="hp-dv2o" viewBox="0 0 1280 720"><path fill-rule="evenodd" d="M0 0h1280v720H0zM-283 362a714 714 0 1 0 1428 0a714 714 0 1 0 -1428 0z"/></svg>'
          : '<span class="hp-dvp1"></span><span class="hp-dvp2"></span>';
        return '<section class="slide hf hp-dv" data-kind="' + kind(s, 'Divider') + '">' + pills +
          '<h1 class="hp-dvtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h1>' +
          logo() + '</section>';
      }
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
      /* 관용 폴백 — bars 없이 items:[{value,label,percent}]로 오면 바로 변환 */
      if (!s.bars && !s.donut && s.items) {
        s = JSON.parse(JSON.stringify(s));
        s.bars = (s.items || []).map(function (it) {
          var num = parseFloat(it.value);
          return { label: it.label || '', pct: isNaN(num) ? 0 : Math.max(0, Math.min(100, num)), value: String(it.value) + (it.percent ? '%' : ''), text: it.desc };
        });
      }
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
      /* 관용 폴백 — AI가 타 팩 형태(cards:[{tag,head,text}])로 내도 수용 */
      var arr = s.items || s.cards || [], key = s.items ? 'items' : 'cards';
      var n = arr.length || 3;
      /* badge 변형 — 상단 넘버 뱃지+라벨+대형 수치(숫자=액센트, 단위=잉크) 센터 카드 (카카오 Financial Target 번안) */
      if (s.variant === 'badge') {
        var bcells = arr.map(function (it, i) {
          var IP = P + '.' + key + '.' + i;
          var v = String(it.value != null ? it.value : it.head || ''), lb = it.label != null ? it.label : it.tag;
          var m2 = v.match(/^([\d.,]+)([\s\S]*)$/);
          var vh = m2 ? '<i>' + esc(m2[1]) + '</i><em>' + esc(m2[2]) + '</em>' : '<i>' + esc(v) + '</i>';
          return '<div class="hf-kbcard">' +
            '<span class="hf-kbno">' + (i + 1) + '</span>' +
            '<span class="hf-kblab"' + de(IP + (it.label != null ? '.label' : '.tag')) + '>' + esc(lb || '') + '</span>' +
            '<span class="hf-kbval"' + de(IP + (it.value != null ? '.value' : '.head')) + '>' + vh + '</span></div>';
        }).join('');
        return '<section class="slide hf kp" data-kind="' + kind(s, 'KPI') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
          '<div class="hf-kbgrid" style="--kbc:' + Math.min(n, 4) + '">' + bcells + '</div>' + deco() + '</section>';
      }
      var cells = arr.map(function (it, i) {
        var IP = P + '.' + key + '.' + i, on = it.tone === 'on' || i === n - 1;
        var v = it.value != null ? it.value : it.head, lb = it.label != null ? it.label : it.tag, dc = it.desc != null ? it.desc : it.text;
        return '<div class="hf-cell kp' + (on ? ' on' : '') + '">' +
          '<span class="hf-kpval"' + de(IP + (it.value != null ? '.value' : '.head')) + '>' + esc(v || '') + '</span>' +
          '<span class="hf-lab in"' + de(IP + (it.label != null ? '.label' : '.tag')) + '>' + esc(lb || '') + '</span>' +
          (dc ? '<p class="hf-celltx"' + de(IP + (it.desc != null ? '.desc' : '.text')) + '>' + mb(dc) + '</p>' : '') + '</div>';
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
        /* 옅은 바(틴트 55% 미만)는 화이트 텍스트 대비가 무너짐 — 잉크 텍스트로 전환 */
        return '<div class="ms-bar' + (pct < 55 ? ' lt' : '') + '" style="margin-left:' + ((st - 1) / N * 100).toFixed(2) + '%;width:' + (sp / N * 100).toFixed(2) + '%;background:color-mix(in srgb, var(--t) ' + pct + '%, #fff)">' +
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
      var v = s.variant === 'grid' || s.variant === 'frame' || s.variant === 'side' || s.variant === 'quad' || s.variant === 'frame3' ? s.variant : 'wide';
      var si = P.split('.')[1];
      /* 이미지 슬롯 — 슬라이드별 키(photos-슬라이드-i)로 업로드 이미지 실렌더(키 충돌 방지) */
      function slot(i, it) {
        var ik = 'photos-' + si + '-' + i, src = ctx.images && ctx.images[ik];
        if (src) return '<img class="hf-abimg s-imgwrap" data-img="' + ik + '" src="' + esc(src) + '">';
        return '<div class="hf-imgph s-imgwrap" data-img="' + ik + '"><span' + de(P + '.items.' + i + '.label') + '>' + esc((it || {}).label || '사진') + '</span></div>';
      }
      if (v === 'quad') {
        /* 2026 필 — 좌 그린 사이드바 + 우 2×2 사진(도트 캡션+십자 구분선) (538:2 G-06 실측) */
        var qs = (s.items || []).slice(0, 4); while (qs.length < 4) qs.push({});
        return '<section class="slide hf hp-pq" data-kind="' + kind(s, 'Photos') + '">' +
          '<div class="hp-sbbar"><span class="hp-sbtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span></div>' +
          '<div class="hp-pqgrid"><span class="hp-pqv"></span><span class="hp-pqh"></span>' +
          qs.map(function (it, i) {
            return '<div class="hp-pqcell"><div class="hp-pqcap"><i></i><span' + de(P + '.items.' + i + '.caption') + '>' + esc(it.caption || '') + '</span></div>' + slot(i, it) + '</div>';
          }).join('') + '</div></section>';
      }
      if (v === 'frame3') {
        /* 2026 필 — 딥 그린 지면 + 화이트 프레임 사진 3 + 하단 좌 뱃지·타이틀/중앙 리스트 (538:2 G-09 실측) */
        var f3 = (s.items || []).slice(0, 3); while (f3.length < 3) f3.push({});
        return '<section class="slide hf hp-f3" data-kind="' + kind(s, 'Photos') + '">' +
          '<span class="hp-f3sg"></span>' +
          '<div class="hp-f3row">' + f3.map(function (it, i) { return '<div class="hp-f3fr">' + slot(i, it) + '</div>'; }).join('') + '</div>' +
          '<div class="hp-f3foot">' +
          '<div class="hp-f3l">' + (s.year ? '<span class="hp-pill"' + de(P + '.year') + '>' + esc(s.year) + '</span>' : '') +
          '<span class="hp-f3title"' + de(P + '.title') + '>' + mb(s.title || '') + '</span><span class="hp-f3rule"></span></div>' +
          (s.caption ? '<div class="hp-f3cap"><span class="hp-f3rule top"></span><p' + de(P + '.caption') + '>' + mb(s.caption) + '</p></div>' : '') +
          '</div></section>';
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
    /* 대형 수치 2패널 — 값+라벨+칩 (카카오 IR p32·43 번안) */
    duo: function (s, P, ctx) {
      var cells = (s.items || []).slice(0, 2).map(function (it, i) {
        var IP = P + '.items.' + i, on = it.tone === 'on' || i === 1;
        var chips = (it.chips || []).map(function (c, j) {
          return '<span class="hf-duochip"' + de(IP + '.chips.' + j) + '>' + mb(c) + '</span>';
        }).join('');
        return '<div class="hf-duo' + (on ? ' on' : '') + '">' +
          '<span class="hf-lab' + (on ? ' wh' : '') + '"' + de(IP + '.label') + '>' + esc(it.label || '') + '</span>' +
          '<span class="hf-duoval"' + de(IP + '.value') + '>' + esc(it.value || '') + '</span>' +
          (it.text ? '<p class="hf-duotx"' + de(IP + '.text') + '>' + mb(it.text) + '</p>' : '') +
          (chips ? '<div class="hf-duochips">' + chips + '</div>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf du" data-kind="' + kind(s, 'Duo') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-duogrid">' + cells + '</div></section>';
    },
    /* 전환 구조도 — 전(중립) → 후(틴트·딥) 패널 (카카오 IR p5 번안) */
    flow: function (s, P, ctx) {
      function col(c, CP, cls) {
        c = c || {};
        var rows = (c.items || []).map(function (r, j) {
          var RP = CP + '.items.' + j;
          if (typeof r === 'string') return '<div class="hf-flowrow"><span' + de(RP) + '>' + mb(r) + '</span></div>';
          return '<div class="hf-flowrow"><b' + de(RP + '.k') + '>' + esc(r.k || '') + '</b><span' + de(RP + '.v') + '>' + mb(r.v || '') + '</span></div>';
        }).join('');
        return '<div class="hf-flowcol' + cls + '">' +
          '<span class="hf-flowhead"' + de(CP + '.head') + '>' + esc(c.head || '') + '</span>' + rows +
          (c.foot ? '<span class="hf-flowft"' + de(CP + '.foot') + '>' + mb(c.foot) + '</span>' : '') + '</div>';
      }
      var tos = (s.to || []).slice(0, 2).map(function (c, i) {
        return col(c, P + '.to.' + i, c.tone === 'on' ? ' on' : '');
      }).join('');
      return '<section class="slide hf fl" data-kind="' + kind(s, 'Flow') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-flowgrid">' + col(s.from, P + '.from', ' from') +
        '<span class="hf-flowarr">→</span>' + tos + '</div>' +
        (s.foot ? '<p class="hf-flowfoot"' + de(P + '.foot') + '>' + mb(s.foot) + '</p>' : '') + '</section>';
    },
    /* 가로 노드 타임라인 — 도트+라인 4~6단계 (카카오 IR p8 번안) */
    hsteps: function (s, P, ctx) {
      var steps = (s.steps || []).slice(0, 6).map(function (st, i) {
        var IP = P + '.steps.' + i;
        return '<div class="hf-hstep"><span class="hf-hsln"></span><span class="hf-hsdot"></span>' +
          '<span class="hf-hswhen"' + de(IP + '.when') + '>' + esc(st.when || '') + '</span>' +
          '<span class="hf-hshead"' + de(IP + '.head') + '>' + mb(st.head || '') + '</span>' +
          (st.text ? '<p class="hf-hstx"' + de(IP + '.text') + '>' + mb(st.text) + '</p>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf hs" data-kind="' + kind(s, 'HSteps') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-hsrow">' + steps + '</div></section>';
    },
    /* 프로필 카드 — 뱃지+딥 헤더+리스트+포커스 박스 2~3열 (카카오 IR p27 번안) */
    profile: function (s, P, ctx) {
      var n = Math.min(Math.max((s.cards || []).length, 2), 3);
      var cells = (s.cards || []).slice(0, 3).map(function (c, i) {
        var IP = P + '.cards.' + i;
        var pts = (c.points || []).map(function (t, j) {
          return '<li><span class="hf-dot"></span><span' + de(IP + '.points.' + j) + '>' + mb(t) + '</span></li>';
        }).join('');
        var fc = '';
        if (c.focus) {
          fc = '<div class="hf-pffocus"><span class="fl"' + de(IP + '.focus.label') + '>' + esc(c.focus.label || '') + '</span>' +
            (c.focus.items || []).map(function (t, j) { return '<li' + de(IP + '.focus.items.' + j) + '>' + mb(t) + '</li>'; }).join('') + '</div>';
        }
        return '<div class="hf-pfcard">' +
          (c.badge ? '<span class="hf-pfbadge"' + de(IP + '.badge') + '>' + esc(c.badge) + '</span>' : '') +
          '<div class="hf-pfhead">' +
          (c.kicker ? '<span class="hf-pfkick"' + de(IP + '.kicker') + '>' + esc(c.kicker) + '</span>' : '') +
          '<span class="hf-pfname"' + de(IP + '.head') + '>' + mb(c.head || '') + '</span></div>' +
          '<ul class="hf-pfbody">' + pts + '</ul>' + fc +
          (c.foot ? '<div class="hf-pffoot"' + de(IP + '.foot') + '>' + mb(c.foot) + '</div>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf pf" data-kind="' + kind(s, 'Profile') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-pfgrid" style="--pfc:' + n + '">' + cells + '</div></section>';
    },
    /* 와이드 밴드 — 딥 밴드(타이틀+포인트 2~3)+하단 카드 3~5 (카카오 IR p26 번안) */
    band: function (s, P, ctx) {
      var pts = (s.points || []).slice(0, 3).map(function (p, i) {
        var IP = P + '.points.' + i;
        return '<div class="hf-bdpt"><span class="h"' + de(IP + '.head') + '>' + esc(p.head || '') + '</span>' +
          (p.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(p.text) + '</span>' : '') + '</div>';
      }).join('');
      var n = Math.min(Math.max((s.cards || []).length, 3), 5);
      var cards = (s.cards || []).slice(0, 5).map(function (c, i) {
        var IP = P + '.cards.' + i;
        return '<div class="hf-bdcard' + (c.tone === 'on' ? ' on' : '') + '">' +
          '<span class="h"' + de(IP + '.head') + '>' + esc(c.head || '') + '</span>' +
          (c.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(c.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf bd" data-kind="' + kind(s, 'Band') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-bdwrap"><div class="hf-bdband"><span class="hf-bdtitle"' + de(P + '.lead') + '>' + mb(s.lead || '') + '</span>' +
        '<div class="hf-bdpts">' + pts + '</div></div>' +
        '<div class="hf-bdgrid" style="--bdc:' + n + '">' + cards + '</div></div></section>';
    },
    /* 하프 이미지 — 좌 딥 텍스트 패널+우 절반 이미지 (카카오 IR p25·35 번안) */
    halfimg: function (s, P, ctx) {
      var si = P.split('.')[1], ik = 'half-' + si, src = ctx.images && ctx.images[ik];
      var img = src ? '<img class="s-imgwrap" data-img="' + ik + '" src="' + esc(src) + '">' :
        '<div class="ph s-imgwrap" data-img="' + ik + '"><span>이미지</span></div>';
      return '<section class="slide hf hi" data-kind="' + kind(s, 'HalfImg') + '">' +
        '<div class="hf-hipanel">' +
        '<h2 class="hf-hihead"' + de(P + '.head') + '>' + mb(s.head || '') + '</h2>' +
        (s.lead ? '<span class="hf-hilead"' + de(P + '.lead') + '>' + mb(s.lead) + '</span>' : '') +
        (s.text ? '<p class="hf-hitx"' + de(P + '.text') + '>' + mb(s.text) + '</p>' : '') + '</div>' +
        '<div class="hf-hiimg">' + img + '</div></section>';
    },
    /* 차트 — 좌 막대(값 실측만)+우 코멘트 리스트 (카카오 IR p12·45 번안) */
    chart: function (s, P, ctx) {
      /* waterfall 변형 — 계단 누적 바 + 합계 딥 바 + 비교 컬럼(GAP 칩) (카카오 SOTP 번안) */
      if (s.variant === 'waterfall') {
        var wb = (s.bars || []).slice(0, 9), cum = 0, steps = [];
        wb.forEach(function (b) { steps.push({ x: b.x, v: +b.v || 0, off: cum, lb: b.label }); cum += (+b.v || 0); });
        var tv = s.total && +s.total.v ? +s.total.v : cum;
        var vv = s.vs && +s.vs.v ? +s.vs.v : 0;
        var wmax = Math.max(cum, tv, vv, 1);
        function wp(v) { return Math.round(v / wmax * 100); }
        var wcols = steps.map(function (b, i) {
          var IP = P + '.bars.' + i, h = Math.max(2, wp(b.v));
          return '<div class="hf-wfcol"><span class="tr"><i style="height:' + h + '%;bottom:' + wp(b.off) + '%"></i>' +
            '<span class="v" style="bottom:calc(' + wp(b.off + b.v) + '% + 6px)"' + de(IP + '.label') + '>' + esc(b.lb != null ? b.lb : String(b.v)) + '</span></span>' +
            '<span class="x"' + de(IP + '.x') + '>' + esc(b.x || '') + '</span></div>';
        }).join('');
        if (s.total) {
          wcols += '<div class="hf-wfcol tt"><span class="tr"><i style="height:' + wp(tv) + '%;bottom:0"></i>' +
            '<span class="v in" style="bottom:calc(' + wp(tv) + '% / 2)"' + de(P + '.total.label') + '>' + esc(s.total.label != null ? s.total.label : String(tv)) + '</span></span>' +
            '<span class="x"' + de(P + '.total.x') + '>' + esc(s.total.x || '') + '</span></div>';
        }
        if (s.vs) {
          var gy = wp(vv) + Math.round((wp(tv) - wp(vv)) / 2);
          wcols += '<div class="hf-wfcol vs"><span class="tr"><span class="vsbg"></span><i style="height:' + wp(vv) + '%;bottom:0"></i>' +
            '<span class="v" style="bottom:calc(' + wp(vv) + '% + 6px)"' + de(P + '.vs.label') + '>' + esc(s.vs.label != null ? s.vs.label : String(vv)) + '</span>' +
            (s.vs.gap ? '<span class="gap" style="bottom:' + gy + '%"' + de(P + '.vs.gap') + '>' + mb(s.vs.gap) + '</span>' : '') + '</span>' +
            '<span class="x"' + de(P + '.vs.x') + '>' + esc(s.vs.x || '') + '</span></div>';
        }
        return '<section class="slide hf cn wf" data-kind="' + kind(s, 'Waterfall') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
          '<div class="hf-wfwrap">' + wcols + '</div>' +
          (s.unit ? '<span class="hf-cnunit"' + de(P + '.unit') + '>' + esc(s.unit) + '</span>' : '') + '</section>';
      }
      var bars = s.bars || [], max = 0;
      bars.forEach(function (b) { if (+b.v > max) max = +b.v; });
      var bs = bars.slice(0, 8).map(function (b, i) {
        var IP = P + '.bars.' + i, h = max ? Math.max(6, Math.round((+b.v || 0) / max * 100)) : 0;
        /* 값 라벨은 바 위에 absolute — 라벨이 트랙 높이를 깎아 바 비율이 왜곡되는 것 방지 */
        return '<div class="hf-cnbar' + (b.on ? ' on' : '') + '"><span class="tr">' +
          '<i style="height:' + h + '%"></i>' +
          '<span class="v" style="bottom:calc(' + h + '% + 7px)"' + de(IP + '.label') + '>' + esc(b.label != null ? b.label : String(b.v)) + '</span></span>' +
          '<span class="x"' + de(IP + '.x') + '>' + esc(b.x || '') + '</span></div>';
      }).join('');
      var notes = (s.notes || []).slice(0, 4).map(function (nt, i) {
        var IP = P + '.notes.' + i;
        return '<div class="hf-cnnote"><span class="h"' + de(IP + '.head') + '>' + mb(nt.head || '') + '</span>' +
          (nt.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(nt.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf cn" data-kind="' + kind(s, 'Chart') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-cngrid"><div class="hf-cnchart">' +
        (s.badge ? '<span class="hf-cnbadge"' + de(P + '.badge') + '>' + mb(s.badge) + '</span>' : '') +
        '<div class="hf-cnbars">' + bs + '</div>' +
        (s.unit ? '<span class="hf-cnunit"' + de(P + '.unit') + '>' + esc(s.unit) + '</span>' : '') + '</div>' +
        '<div class="hf-cnnotes">' + notes + '</div></div></section>';
    },
    /* 라인업 — 태그+이름+설명+상태 뱃지 행 3~5, 첫 강조·후보 dim (naver lineup 번안) */
    lineup: function (s, P, ctx) {
      var rows = (s.items || []).slice(0, 5).map(function (it, i) {
        var IP = P + '.items.' + i;
        var on = it.state === 'on' || (i === 0 && it.state !== 'dim');
        return '<div class="hf-lnrow' + (on ? ' on' : '') + (it.state === 'dim' ? ' dim' : '') + '">' +
          (it.tag ? '<span class="hf-lntag"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
          '<span class="hf-lnhead"' + de(IP + '.head') + '>' + esc(it.head || '') + '</span>' +
          (it.text ? '<span class="hf-lntx"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') +
          (it.badge ? '<span class="hf-lnbadge"' + de(IP + '.badge') + '>' + esc(it.badge) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf ln" data-kind="' + kind(s, 'Lineup') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-lnrows">' + rows + '</div></section>';
    },
    /* 분기 구조 — 상단 리드 박스 → 하위 카드 2~4 (naver branch 번안) */
    branch: function (s, P, ctx) {
      var lead = s.lead || {};
      var n = Math.min(Math.max((s.branches || []).length, 2), 4);
      var cards = (s.branches || []).slice(0, 4).map(function (b, i) {
        var IP = P + '.branches.' + i;
        return '<div class="hf-bncard">' +
          (b.label ? '<span class="l"' + de(IP + '.label') + '>' + esc(b.label) + '</span>' : '') +
          '<span class="h"' + de(IP + '.head') + '>' + esc(b.head || '') + '</span>' +
          (b.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf bn" data-kind="' + kind(s, 'Branch') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-bnwrap"><div class="hf-bnlead">' +
        (lead.label ? '<span class="l"' + de(P + '.lead.label') + '>' + esc(lead.label) + '</span>' : '') +
        '<span class="t"' + de(P + '.lead.text') + '>' + mb(lead.text || '') + '</span></div>' +
        '<span class="hf-bnstem"></span><span class="hf-bnbar" style="--bnc:' + n + '"></span>' +
        '<div class="hf-bngrid" style="--bnc:' + n + '">' + cards + '</div></div></section>';
    },
    /* 하이라이트 — 대형 번호 재생 행 2~3 (naver highlight 번안) */
    highlight: function (s, P, ctx) {
      var rows = (s.items || []).slice(0, 3).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="hf-hlrow">' +
          '<span class="hf-hlno"' + de(IP + '.no') + '>' + esc(it.no || '0' + (i + 1)) + '</span>' +
          '<span class="hf-hlhead"' + de(IP + '.head') + '>' + mb(it.head || '') + '</span>' +
          (it.text ? '<span class="hf-hltx"' + de(IP + '.text') + '>' + mb(it.text) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf hl" data-kind="' + kind(s, 'Highlight') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-hlrows">' + rows + '</div>' +
        (s.footnote ? '<p class="hf-hlfn"' + de(P + '.footnote') + '>' + mb(s.footnote) + '</p>' : '') + '</section>';
    },
    /* 보드 — 좌 카드 2 스택 + 우 딥 사이드 패널(리스트+필) (naver board 번안) */
    board: function (s, P, ctx) {
      var cards = (s.cards || []).slice(0, 2).map(function (c, i) {
        var IP = P + '.cards.' + i;
        return '<div class="hf-bocard">' +
          (c.tag ? '<span class="tg"' + de(IP + '.tag') + '>' + esc(c.tag) + '</span>' : '') +
          '<span class="h"' + de(IP + '.head') + '>' + mb(c.head || '') + '</span>' +
          (c.text ? '<span class="t"' + de(IP + '.text') + '>' + mb(c.text) + '</span>' : '') + '</div>';
      }).join('');
      var side = '';
      if (s.side) {
        var lis = (s.side.items || []).map(function (t, j) { return '<li><span class="hf-dot"></span><span' + de(P + '.side.items.' + j) + '>' + mb(t) + '</span></li>'; }).join('');
        var pills = (s.side.pills || []).map(function (t, j) { return '<span class="pill"' + de(P + '.side.pills.' + j) + '>' + esc(t) + '</span>'; }).join('');
        side = '<div class="hf-boside">' +
          (s.side.title ? '<span class="st"' + de(P + '.side.title') + '>' + esc(s.side.title) + '</span>' : '') +
          (lis ? '<ul>' + lis + '</ul>' : '') +
          (pills ? '<div class="pills">' + pills + '</div>' : '') + '</div>';
      }
      return '<section class="slide hf bo" data-kind="' + kind(s, 'Board') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-bogrid' + (side ? '' : ' solo') + '"><div class="hf-bomain">' + cards + '</div>' + side + '</div></section>';
    },
    /* 번호 카드 리스트 — 번호 원+라벨+보조 행 2~5, 첫 행 강조 (pitch list 번안) */
    list: function (s, P, ctx) {
      var rows = (s.rows || []).slice(0, 5).map(function (r, i) {
        var IP = P + '.rows.' + i, on = i === (s.accent != null ? +s.accent : 0);
        return '<div class="hf-lsrow' + (on ? ' on' : '') + '">' +
          '<span class="hf-lsno">' + (i + 1) + '</span>' +
          '<span class="hf-lslabel"' + de(IP + '.label') + '>' + esc(r.label || '') + '</span>' +
          (r.sub ? '<span class="hf-lssub"' + de(IP + '.sub') + '>' + mb(r.sub) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf ls" data-kind="' + kind(s, 'List') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-lsrows">' + rows + '</div></section>';
    },
    /* 매트릭스 — 좌 대형 이니셜 컬럼 + 우 틴트 그룹 패널 행 2~3 (ESG 경영 장 번안, 고밀도) */
    matrix: function (s, P, ctx) {
      var rows = (s.rows || []).slice(0, 3).map(function (r, i) {
        var IP = P + '.rows.' + i;
        var groups = (r.groups || []).slice(0, 3).map(function (g, j) {
          var GP = IP + '.groups.' + j;
          var lis = (g.items || []).map(function (t, k) { return '<li' + de(GP + '.items.' + k) + '>' + mb(t) + '</li>'; }).join('');
          return '<div class="hf-mxgroup"><span class="h"' + de(GP + '.head') + '>' + esc(g.head || '') + '</span><ul>' + lis + '</ul></div>';
        }).join('');
        return '<div class="hf-mxrow"><div class="hf-mxside">' +
          '<span class="hf-mxtag"' + de(IP + '.tag') + '>' + esc(r.tag || '') + '</span>' +
          '<span class="hf-mxlab"' + de(IP + '.label') + '>' + esc(r.label || '') + '</span>' +
          (r.sub ? '<span class="hf-mxsub"' + de(IP + '.sub') + '>' + esc(r.sub) + '</span>' : '') + '</div>' +
          '<div class="hf-mxpanel">' + groups + '</div></div>';
      }).join('');
      return '<section class="slide hf mx" data-kind="' + kind(s, 'Matrix') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-mxrows">' + rows + '</div></section>';
    },
    /* 3분할 보드 — 열마다 헤더 밴드+리드+리스트, 마지막 열 강조 (주주환원 분석 장 번안) */
    triple: function (s, P, ctx) {
      var cols = (s.cols || []).slice(0, 3).map(function (c, i) {
        var IP = P + '.cols.' + i, on = c.tone === 'on' || i === (s.cols || []).length - 1;
        var lis = (c.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="hf-t3col' + (on ? ' on' : '') + '">' +
          '<span class="hf-t3head"' + de(IP + '.head') + '>' + esc(c.head || '') + '</span>' +
          '<div class="hf-t3body">' +
          (c.lead ? '<p class="hf-t3lead"' + de(IP + '.lead') + '>' + mb(c.lead) + '</p>' : '') +
          (lis ? '<ul>' + lis + '</ul>' : '') +
          (c.foot ? '<p class="hf-t3foot"' + de(IP + '.foot') + '>' + mb(c.foot) + '</p>' : '') + '</div></div>';
      }).join('');
      return '<section class="slide hf t3" data-kind="' + kind(s, 'Triple') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-t3grid">' + cols + '</div></section>';
    },
    /* 4분할 — 사분면 4블록 + 중앙 원 허브 + 배경 링 (주주 소통 장 번안) */
    quad: function (s, P, ctx) {
      var cells = (s.cells || []).slice(0, 4).map(function (c, i) {
        var IP = P + '.cells.' + i;
        var lis = (c.items || []).map(function (t, j) { return '<li' + de(IP + '.items.' + j) + '>' + mb(t) + '</li>'; }).join('');
        return '<div class="hf-qdcell q' + i + '"><span class="h"' + de(IP + '.head') + '>' + esc(c.head || '') + '</span>' +
          '<ul>' + lis + '</ul></div>';
      }).join('');
      var ctr = s.center || {};
      return '<section class="slide hf qd" data-kind="' + kind(s, 'Quad') + '">' + runhead(s, P, ctx) +
        (s.title ? headline(s, P) : '') +
        '<div class="hf-qdwrap"><span class="hf-qdring"></span><span class="hf-qdx"></span><span class="hf-qdy"></span>' +
        '<div class="hf-qdgrid">' + cells + '</div>' +
        '<div class="hf-qdcore">' +
        (ctr.label ? '<span class="l"' + de(P + '.center.label') + '>' + mb(ctr.label) + '</span>' : '') +
        (ctr.head ? '<span class="h"' + de(P + '.center.head') + '>' + esc(ctr.head) + '</span>' : '') + '</div></div></section>';
    },
    /* 계층 구조도 — 상단 조직 박스(풀폭 밴드+칩)+커넥터+하단 조직 박스 (카카오AI 조직도 번안) */
    org: function (s, P, ctx) {
      function box(o, OP, top) {
        o = o || {};
        var chips = (o.items || []).slice(0, 4).map(function (t, j) {
          return '<span class="hf-ogchip"' + de(OP + '.items.' + j) + '>' + esc(t) + '</span>';
        }).join('');
        return '<div class="hf-ogbox' + (top ? ' top' : '') + '">' +
          '<span class="hf-oghead"' + de(OP + '.head') + '>' + esc(o.head || '') + (o.cap ? '<i' + de(OP + '.cap') + '>' + esc(o.cap) + '</i>' : '') + '</span>' +
          (o.label ? '<span class="hf-oglab"' + de(OP + '.label') + '>' + esc(o.label) + '</span>' : '') +
          (o.band ? '<span class="hf-ogband"' + de(OP + '.band') + '>' + esc(o.band) + '</span>' : '') +
          '<div class="hf-ogrow">' + chips + '</div></div>';
      }
      return '<section class="slide hf og" data-kind="' + kind(s, 'Org') + '">' + runhead(s, P, ctx) +
        (s.title ? headline(s, P) : '') +
        '<div class="hf-ogwrap">' + box(s.top, P + '.top', true) +
        '<span class="hf-ogline"><span class="hf-ogdot"></span></span>' + box(s.bottom, P + '.bottom', false) + '</div></section>';
    },
    /* 순환 다이어그램 — 상하 아크+중앙 허브+상하 설명 (이중 중대성 다이어그램 번안) */
    cycle: function (s, P, ctx) {
      function blk(b, BP, cls) {
        b = b || {};
        return '<div class="hf-cyblk ' + cls + '">' +
          '<span class="h"' + de(BP + '.head') + '>' + esc(b.head || '') + '</span>' +
          (b.text ? '<span class="t"' + de(BP + '.text') + '>' + mb(b.text) + '</span>' : '') + '</div>';
      }
      return '<section class="slide hf cy" data-kind="' + kind(s, 'Cycle') + '">' + runhead(s, P, ctx) +
        (s.title ? headline(s, P) : '') +
        '<div class="hf-cywrap"><div class="hf-cyring">' +
        '<span class="hf-cyarc top"></span><span class="hf-cyarc bot"></span>' +
        (s.topLabel ? '<span class="hf-cylab top"' + de(P + '.topLabel') + '>' + esc(s.topLabel) + '</span>' : '') +
        (s.bottomLabel ? '<span class="hf-cylab bot"' + de(P + '.bottomLabel') + '>' + esc(s.bottomLabel) + '</span>' : '') +
        blk(s.top, P + '.top', 'tp') + blk(s.bottom, P + '.bottom', 'bt') +
        /* 좌우도 상하와 같은 블록 지원 — 문자열이면 짧은 라벨, 객체면 head+text */
        (s.left ? (typeof s.left === 'object' ? blk(s.left, P + '.left', 'lf') : '<span class="hf-cyside l"' + de(P + '.left') + '>' + esc(s.left) + '</span>') : '') +
        (s.right ? (typeof s.right === 'object' ? blk(s.right, P + '.right', 'rt') : '<span class="hf-cyside r"' + de(P + '.right') + '>' + esc(s.right) + '</span>') : '') +
        '<span class="hf-cycore"' + de(P + '.center') + '>' + mb(s.center || '') + '</span>' +
        '</div></div></section>';
    },
    /* 지표 대시보드 — 미니 차트 카드 3~4 + 하단 스탯 스트립 (지표 하이라이트 장 번안) */
    dash: function (s, P, ctx) {
      var n = Math.min(Math.max((s.cards || []).length, 3), 4);
      function mini(c, IP) {
        var ch = c.chart || {};
        if (ch.kind === 'donut') {
          var pct = Math.max(0, Math.min(100, +ch.pct || 0));
          return '<div class="hf-dmini dn"><i style="background:conic-gradient(var(--t) 0 ' + pct + '%,#E3E8E5 0)"></i><span>' + pct + '%</span></div>';
        }
        if (ch.kind === 'gauge') {
          var gp = Math.max(0, Math.min(100, +ch.pct || 0));
          return '<div class="hf-dmini gg"><i style="background:conic-gradient(from 270deg,var(--t) 0 ' + (gp / 2) + '%,#E3E8E5 ' + (gp / 2) + '% 50%,transparent 50%)"></i><span>' + gp + '%</span></div>';
        }
        if (ch.kind === 'area') {
          var vs = (ch.v || []).map(Number), mx = Math.max.apply(null, vs.concat([1]));
          var pts = vs.map(function (v, i) { return (vs.length > 1 ? Math.round(i / (vs.length - 1) * 100) : 100) + '% ' + (100 - Math.round(v / mx * 92)) + '%'; });
          return '<div class="hf-dmini ar"><i style="clip-path:polygon(0 100%,' + pts.join(',') + ',100% 100%)"></i></div>';
        }
        var bs = (ch.v || []).map(Number), bmx = Math.max.apply(null, bs.concat([1]));
        return '<div class="hf-dmini br">' + bs.map(function (v, i) {
          return '<i class="' + (i === bs.length - 1 ? 'on' : '') + '" style="height:' + Math.max(8, Math.round(v / bmx * 100)) + '%"></i>';
        }).join('') + '</div>';
      }
      var cells = (s.cards || []).slice(0, 4).map(function (c, i) {
        var IP = P + '.cards.' + i;
        return '<div class="hf-dcard">' +
          '<span class="hf-lab"' + de(IP + '.label') + '>' + esc(c.label || '') + '</span>' +
          '<span class="hf-dval"' + de(IP + '.value') + '><i>' + esc(c.value || '') + '</i>' + (c.unit ? '<em' + de(IP + '.unit') + '>' + esc(c.unit) + '</em>' : '') + '</span>' +
          (c.chart ? mini(c, IP) : '') +
          (c.text ? '<span class="hf-dtx"' + de(IP + '.text') + '>' + mb(c.text) + '</span>' : '') + '</div>';
      }).join('');
      var strip = (s.strip || []).slice(0, 3).map(function (st, i) {
        var IP = P + '.strip.' + i;
        return '<div class="hf-dstat"><span class="l"' + de(IP + '.label') + '>' + mb(st.label || '') + '</span>' +
          '<span class="v"' + de(IP + '.value') + '>' + esc(st.value || '') + '</span></div>';
      }).join('');
      return '<section class="slide hf da" data-kind="' + kind(s, 'Dash') + '">' + runhead(s, P, ctx) + headline(s, P) + sub(s, P) +
        '<div class="hf-dwrap"><div class="hf-dgrid" style="--dac:' + n + '">' + cells + '</div>' +
        (strip ? '<div class="hf-dstrip">' + strip + '</div>' : '') + '</div></section>';
    },
    /* 한 단어 — 대형 타이포 임팩트(감사·환영) */
    word: function (s, P, ctx) {
      return '<section class="slide hf wd" data-kind="' + kind(s, 'Word') + '">' + runhead(s, P, ctx) +
        '<div class="hf-wdmid"><span class="hf-word"' + de(P + '.text') + '>' + mb(s.text || '') + '</span>' +
        (s.caption ? '<span class="hf-wdcap"' + de(P + '.caption') + '>' + mb(s.caption) + '</span>' : '') + '</div></section>';
    },
    /* 스테이트먼트 — 타이틀+서브 중앙 대형 */
    statement: function (s, P, ctx) {
      /* frame 변형 — 2026 필: 그린 프레임 보더 + 센터 타이틀·헤어라인·센터 문단 (538:2 G-07 실측) */
      if (s.variant === 'frame') {
        return '<section class="slide hf hp-st" data-kind="' + kind(s, 'Statement') + '">' +
          '<span class="hp-stframe"></span>' +
          '<div class="hp-stin">' +
          '<h2 class="hp-sttitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>' +
          (s.sub ? '<p class="hp-stsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') +
          '<span class="hp-strule"></span>' +
          (s.text ? '<p class="hp-sttx"' + de(P + '.text') + '>' + mb(s.text) + '</p>' : '') +
          '</div></section>';
      }
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
    /* 2026 필 — 발표 아젠다: 미니 커버 기하+센터 워드마크+잉크 패널(뱃지|제목|발표자 행) (538:2 G-03 실측) */
    agenda: function (s, P, ctx) {
      var rows = (s.rows || []).slice(0, 4).map(function (r, i) {
        var IP = P + '.rows.' + i;
        return '<div class="hp-agrow">' +
          '<span class="hp-agbdg">' + (r.part ? '<b' + de(IP + '.part') + '>' + esc(r.part) + '</b>' : '') + '</span>' +
          '<span class="hp-aghead"' + de(IP + '.head') + '>' + mb(r.head || '') + '</span>' +
          (r.who ? '<span class="hp-agwho"' + de(IP + '.who') + '>' + mb(r.who) + '</span>' : '<span class="hp-agwho"></span>') +
          '</div>';
      }).join('');
      return '<section class="slide hf hp-ag" data-kind="' + kind(s, 'Agenda') + '">' + hpCoverBg() + hpWm('ct') +
        '<div class="hp-agpanel">' +
        '<span class="hp-aglab"' + de(P + '.title') + '>' + esc(s.title || 'AGENDA') + '</span>' +
        '<div class="hp-agrows">' + rows + '</div></div></section>';
    },
    /* 2026 필 — 좌 컬러 사이드바+우 본문(리드+문단), num 변형=사이드바 절반+대형 숫자 (538:2 G-04/G-05 실측) */
    sidebar: function (s, P, ctx) {
      var num = s.variant === 'num';
      return '<section class="slide hf hp-sb' + (num ? ' nm' : '') + '" data-kind="' + kind(s, 'Section') + '">' +
        '<div class="hp-sbbar"><span class="hp-sbtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span>' +
        (num ? '<span class="hp-sbno"' + de(P + '.no') + '>' + esc(s.no || '1') + '</span>' : '') + '</div>' +
        '<div class="hp-sbbody">' +
        (s.lead ? '<p class="hp-sblead"' + de(P + '.lead') + '>' + mb(s.lead) + '</p>' : '') +
        (s.text ? '<p class="hp-sbtx"' + de(P + '.text') + '>' + mb(s.text) + '</p>' : '') +
        '</div></section>';
    },
    /* 2026 필 — 딥 지면+좌 뱃지·타이틀·리스트+우 대형 스크린 패널(이미지 슬롯) (538:2 G-08 실측) */
    screen: function (s, P, ctx) {
      var si = P.split('.')[1], ik = 'screen-' + si, src = ctx.images && ctx.images[ik];
      var img = src ? '<img class="hf-abimg s-imgwrap" data-img="' + ik + '" src="' + esc(src) + '">' :
        '<div class="hf-imgph iv s-imgwrap" data-img="' + ik + '"><span>스크린 이미지</span></div>';
      var lis = (s.points || []).slice(0, 5).map(function (p, i) {
        return '<li' + de(P + '.points.' + i) + '>' + mb(p) + '</li>';
      }).join('');
      return '<section class="slide hf hp-scr" data-kind="' + kind(s, 'Screen') + '">' +
        '<span class="hp-scrbg1"></span><span class="hp-scrbg2"></span>' +
        '<div class="hp-scrl">' +
        (s.year ? '<span class="hp-pill iv"' + de(P + '.year') + '>' + esc(s.year) + '</span>' : '') +
        '<span class="hp-scrtitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</span>' +
        '<span class="hp-scrrule"></span>' +
        (lis ? '<ul class="hp-scrlist">' + lis + '</ul>' : '') + '</div>' +
        '<div class="hp-scrpanel">' + img + '</div></section>';
    },
    /* 2026 필 — 노트: 타이틀+풀폭 헤어라인+좌 소제목/우 문단, band 변형=상단 밴드 (538:2 G-10/G-12 실측) */
    note: function (s, P, ctx) {
      return '<section class="slide hf hp-nt' + (s.variant === 'band' ? ' bd' : '') + '" data-kind="' + kind(s, 'Note') + '">' +
        '<span class="hp-ntedge"></span>' +
        '<h2 class="hp-nttitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>' +
        '<span class="hp-ntrule"></span>' +
        '<div class="hp-ntgrid">' +
        '<span class="hp-nthead"' + de(P + '.head') + '>' + mb(s.head || '') + '</span>' +
        '<p class="hp-nttx"' + de(P + '.text') + '>' + mb(s.text || '') + '</p>' +
        '</div></section>';
    },
    /* 2026 필 — 원형 수치 2~3: 상단 밴드+센터 타이틀+겹침 원(태그·값·라벨) (538:2 G-11 실측) */
    circles: function (s, P, ctx) {
      var cs2 = (s.items || []).slice(0, 3).map(function (it, i) {
        var IP = P + '.items.' + i;
        return '<div class="hp-cc">' +
          (it.tag ? '<span class="tg"' + de(IP + '.tag') + '>' + esc(it.tag) + '</span>' : '') +
          '<span class="vl"' + de(IP + '.value') + '>' + esc(it.value || '') + '</span>' +
          (it.label ? '<span class="lb"' + de(IP + '.label') + '>' + esc(it.label) + '</span>' : '') + '</div>';
      }).join('');
      return '<section class="slide hf hp-ccs" data-kind="' + kind(s, 'Circles') + '">' +
        '<span class="hp-ntedge bdtop"></span>' +
        '<div class="hp-cchead"><h2 class="hp-cctitle"' + de(P + '.title') + '>' + mb(s.title || '') + '</h2>' +
        (s.sub ? '<p class="hp-ccsub"' + de(P + '.sub') + '>' + mb(s.sub) + '</p>' : '') + '</div>' +
        '<div class="hp-ccrow">' + cs2 + '</div></section>';
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
  var FRAMED = { greeting: 1, toc: 1, section: 1, cards: 1, timeline: 1, table: 1, checklist: 1, media: 1, stats: 1, kpi: 1, process: 1, compare: 1, roadmap: 1, milestone: 1, split: 1, bigstat: 1, word: 1, statement: 1, duo: 1, flow: 1, hsteps: 1, profile: 1, band: 1, chart: 1, cycle: 1, dash: 1, matrix: 1, triple: 1, quad: 1, org: 1, lineup: 1, branch: 1, highlight: 1, board: 1, list: 1 };
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
      /* toc panel 변형은 자체 풀블리드 — 프레임 미적용 */
      if (FRAMED[s.type] && s.frame !== false && !(s.type === 'toc' && s.variant === 'panel') && !(s.type === 'statement' && s.variant === 'frame')) html = frameWrap(html);
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
      'var all=bar.querySelectorAll("[data-th]");for(var i=0;i<all.length;i++)all[i].classList.toggle("on",all[i]===s);' +
      /* 스튜디오에 테마 저장 요청 — 덱 데이터(theme)가 바뀌어 썸네일·뷰어·PPTX/HTML 추출까지 일괄 반영 */
      'try{parent.postMessage({hfdTheme:s.getAttribute("data-th")},"*")}catch(x){}});' +
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
      var th = THEMES[k], t2 = THEMES2[k];
      return 'body[data-th="' + k + '"]{--t:' + th.t + ';--b:' + th.b + ';--a:' + th.a + ';--tn:' + th.tn + ';--dp:' + th.dp +
        ';--sg:' + t2.sg + ';--p1:' + t2.p1 + ';--p2:' + t2.p2 + ';--md:' + t2.md + ';--cg:' + t2.cg + ';--dt:' + t2.dt + ';--ik2:' + t2.ik2 + ';--bdg:' + BDG_BLUE + '}';
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
      '.hf-run.wh{position:relative;z-index:3;color:#fff}' +
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
      '.hf-tocrows{flex:1;min-height:0;display:flex;flex-direction:column;gap:16px;margin-top:30px}' +
      '.hf-tocrow{flex:1;min-height:0;background:var(--tn);color:var(--ink);display:flex;align-items:center;gap:34px;padding:0 40px;border-radius:14px}' +
      '.hf-tocno{flex:0 0 76px;font-size:42px;font-weight:800;line-height:1;color:var(--t)}' +
      '.hf-toclab{flex:0 0 220px;font-size:25px;font-weight:800;letter-spacing:-.01em}' +
      '.hf-tocdesc{flex:1;font-size:16.5px;line-height:1.5;color:var(--body)}' +
      '.hf-tocpg{flex:0 0 auto;font-size:14px;font-weight:700;letter-spacing:.1em;color:var(--muted);font-variant-numeric:tabular-nums}' +
      '.hf-tocarr{flex:0 0 auto;font-size:22px;color:var(--t)}' +
      /* 본문 표준 */
      '.hf-numgrid{flex:1;min-height:0;display:grid;gap:16px;align-content:center;padding:20px 0}' +
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
      '.hf-abwide{flex:1;min-height:0;margin:36px 36px 0;display:flex}' +
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
      '.hf-abband{flex:none;height:206px;margin:30px 36px 36px;position:relative;background:var(--t);color:#fff;display:flex;align-items:center;gap:40px;padding:0 74px 0 54px;overflow:hidden;border-radius:16px}' +
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
      '.hf-procrow{flex:1;min-height:0;display:flex;align-items:center;gap:16px;padding:20px 0;position:relative;z-index:2}' +
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
      '.hf-rmgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
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
      '.ms-bar.lt{color:var(--ink)}.ms-bar.lt span{opacity:.75}' +
      '.ms-axis{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;flex:none;border-top:1px solid var(--rule);padding-top:8px}' +
      '.ms-axis span{font-size:13px;color:var(--muted);text-align:center}' +
      /* 좌우 대비 */
      '.hf-splitgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:16px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-half{border:1.5px solid var(--rule);border-radius:16px;padding:28px 26px;display:flex;flex-direction:column;gap:16px;min-height:240px}' +
      '.hf-half ul{list-style:none;display:flex;flex-direction:column;gap:12px;font-size:17px;color:var(--muted)}' +
      '.hf-half ul li{display:flex;align-items:center;gap:12px}' +
      '.hf-half .hf-dot.dim{background:var(--rule)}' +
      '.hf-half.on{border:0;background:var(--tn);color:var(--ink)}.hf-half.on ul{color:var(--ink);font-weight:600}' +
      /* 대형 수치 2패널 (duo) */
      '.hf-duogrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:16px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-duo{background:var(--tn);border-radius:16px;padding:36px 38px;display:flex;flex-direction:column;gap:10px;justify-content:center;min-height:300px}' +
      '.hf-duoval{font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1.1;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-duotx{font-size:15.5px;line-height:1.6;color:var(--body)}' +
      '.hf-duochips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}' +
      '.hf-duochip{font-size:13px;font-weight:600;background:#fff;border-radius:999px;padding:8px 15px;color:var(--ink)}' +
      '.hf-duo.on{background:var(--b);color:#fff}.hf-duo.on .hf-duoval{color:#fff}' +
      '.hf-duo.on .hf-duotx{color:#fff;opacity:.92}.hf-duo.on .hf-duochip{background:rgba(255,255,255,.16);color:#fff}' +
      /* 전환 구조도 (flow) */
      /* 콘텐츠 허그+세로 중앙 — 행 적을 때 패널 절반이 빈 틴트로 남는 것 방지 */
      '.hf-flowgrid{flex:0 1 auto;min-height:0;margin:auto 0;display:flex;align-items:stretch;gap:0;padding:16px 0 8px;position:relative;z-index:2}' +
      '.hf-flowcol{flex:1;min-width:0;background:var(--tn);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:7px}' +
      '.hf-flowcol.from{background:#EFF1F0}' +
      '.hf-flowcol + .hf-flowcol{margin-left:12px}' +
      '.hf-flowhead{font-size:15.5px;font-weight:800;text-align:center;color:#fff;background:var(--dp);border-radius:10px;padding:11px;margin-bottom:4px}' +
      '.hf-flowcol.from .hf-flowhead{background:#3A423E}' +
      '.hf-flowcol.on .hf-flowhead{background:var(--t)}' +
      '.hf-flowrow{background:#fff;border-radius:10px;padding:11px 14px;font-size:13.5px;line-height:1.45;display:flex;gap:10px;align-items:baseline}' +
      '.hf-flowrow b{color:var(--ink);flex:0 0 auto}.hf-flowrow span{color:var(--muted)}' +
      '.hf-flowft{font-size:12px;color:var(--muted);margin-top:auto;padding-top:6px}' +
      '.hf-flowarr{flex:0 0 auto;align-self:center;font-size:28px;font-weight:700;color:var(--t);padding:0 16px}' +
      '.hf-flowfoot{flex:none;text-align:center;font-size:14px;color:var(--muted);padding-bottom:4px}' +
      /* 가로 노드 타임라인 (hsteps) */
      '.hf-hsrow{flex:0 1 auto;margin:auto 0;display:flex;gap:22px;padding:24px 0;position:relative;z-index:2;align-items:flex-start}' +
      /* 노드 콘텐츠 센터 정렬 — 도트 중앙, 라인은 도트 중심끼리 연결(피드백 반영) */
      '.hf-hstep{flex:1;min-width:0;position:relative;padding-top:30px;text-align:center}' +
      /* 라인·도트는 실제 span(hf-hsln/hf-hsdot) — 의사요소는 PPTX DOM 워커가 못 집어 추출에서 사라진다 */
      '.hf-hsln{position:absolute;left:calc(50% + 14px);right:calc(-50% - 8px);top:5px;height:2px;background:var(--tn)}' +
      '.hf-hstep:last-child .hf-hsln{display:none}' +
      '.hf-hsdot{position:absolute;left:50%;transform:translateX(-50%);top:0;width:12px;height:12px;border-radius:50%;background:var(--t)}' +
      '.hf-hswhen{font-size:15px;font-weight:800;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-hshead{display:block;font-size:17.5px;font-weight:700;margin-top:5px;line-height:1.35;white-space:pre-wrap}' +
      '.hf-hstx{font-size:13.5px;line-height:1.5;color:var(--muted);margin-top:5px}' +
      /* 프로필 카드 (profile) */
      '.hf-pfgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(var(--pfc),1fr);gap:16px;align-content:center;padding:22px 0 10px;position:relative;z-index:2}' +
      '.hf-pfcard{position:relative;border:1.5px solid var(--rule);border-radius:16px;display:flex;flex-direction:column;background:#fff}' +
      '.hf-pfbadge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);z-index:2;background:var(--t);color:#fff;border-radius:999px;padding:7px 16px;font-size:12.5px;font-weight:800;white-space:nowrap}' +
      '.hf-pfhead{background:var(--dp);color:#fff;border-radius:14px 14px 0 0;padding:24px 20px 16px;display:flex;flex-direction:column;gap:4px;text-align:center}' +
      '.hf-pfkick{font-size:11.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.8}' +
      '.hf-pfname{font-size:19px;font-weight:800;line-height:1.3;white-space:pre-wrap}' +
      '.hf-pfbody{list-style:none;padding:16px 20px;display:flex;flex-direction:column;gap:8px;flex:1}' +
      '.hf-pfbody li{display:flex;gap:9px;align-items:baseline;font-size:13.5px;line-height:1.5;color:var(--body)}' +
      '.hf-pfbody .hf-dot{width:7px;height:7px;position:relative;top:-1px}' +
      '.hf-pffocus{list-style:none;background:var(--tn);border-radius:12px;padding:13px 16px;margin:0 14px 14px;display:flex;flex-direction:column;gap:5px}' +
      '.hf-pffocus .fl{font-size:11.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--t)}' +
      '.hf-pffocus li{font-size:13px;line-height:1.5;color:var(--body);list-style:none}' +
      '.hf-pffoot{border-top:1px solid var(--rule);padding:12px 20px;font-size:12.5px;line-height:1.5;color:var(--muted)}' +
      /* 와이드 밴드 (band) */
      '.hf-bdwrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:14px 0;position:relative;z-index:2}' +
      '.hf-bdband{background:var(--dp);color:#fff;border-radius:16px;padding:30px 34px;display:flex;gap:28px;align-items:center}' +
      '.hf-bdtitle{flex:0 0 300px;font-size:29px;font-weight:800;line-height:1.3;letter-spacing:-.01em;white-space:pre-wrap}' +
      '.hf-bdpts{flex:1;display:flex}' +
      '.hf-bdpt{flex:1;min-width:0;padding:2px 22px;border-left:1px solid rgba(255,255,255,.28);display:flex;flex-direction:column;gap:6px}' +
      '.hf-bdpt .h{font-size:15.5px;font-weight:800}' +
      '.hf-bdpt .t{font-size:13px;line-height:1.55;color:rgba(255,255,255,.85)}' +
      '.hf-bdgrid{display:grid;grid-template-columns:repeat(var(--bdc),1fr);gap:16px}' +
      '.hf-bdcard{background:var(--tn);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:8px;min-height:150px}' +
      '.hf-bdcard .h{font-size:16.5px;font-weight:800;line-height:1.35}' +
      '.hf-bdcard .t{font-size:13px;line-height:1.5;color:var(--body)}' +
      '.hf-bdcard.on{background:var(--t);color:#fff}.hf-bdcard.on .t{color:#fff;opacity:.92}' +
      /* 하프 이미지 (halfimg) — 좌 딥 패널+우 절반 이미지 */
      '.slide.hf.hi{padding:0;flex-direction:row}' +
      '.hf-hipanel{flex:0 0 46%;min-width:0;background:var(--dp);color:#fff;padding:70px 62px;display:flex;flex-direction:column;justify-content:center;gap:22px}' +
      '.hf-hihead{font-size:46px;font-weight:800;line-height:1.18;letter-spacing:-.02em;white-space:pre-wrap}' +
      '.hf-hilead{font-size:17px;font-weight:700;color:var(--tn);white-space:pre-wrap}' +
      '.hf-hitx{font-size:15px;line-height:1.85;color:rgba(255,255,255,.88);white-space:pre-wrap}' +
      '.hf-hiimg{flex:1;min-width:0;position:relative}' +
      '.hf-hiimg img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.hf-hiimg .ph{width:100%;height:100%;background:var(--tn);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px}' +
      /* 차트+코멘트 (chart) */
      '.hf-cngrid{flex:1;min-height:0;display:grid;grid-template-columns:1.05fr 1fr;gap:44px;align-items:stretch;padding:14px 0;position:relative;z-index:2}' +
      '.hf-cnchart{background:var(--tn);border-radius:16px;padding:24px 26px 18px;display:flex;flex-direction:column;min-height:0}' +
      '.hf-cnbadge{align-self:flex-start;background:#fff;border-radius:999px;padding:8px 16px;font-size:13.5px;font-weight:800;color:var(--t)}' +
      '.hf-cnbars{flex:1;min-height:0;display:flex;align-items:stretch;gap:14px;padding-top:34px}' +
      '.hf-cnbar{flex:1;min-width:0;display:flex;flex-direction:column}' +
      '.hf-cnbar .tr{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:flex-end}' +
      '.hf-cnbar .v{position:absolute;left:0;right:0;font-size:12.5px;font-weight:800;text-align:center;color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}' +
      '.hf-cnbar i{display:block;background:color-mix(in srgb,var(--t) 42%,#fff);border-radius:8px 8px 0 0}' +
      '.hf-cnbar.on i{background:var(--t)}' +
      '.hf-cnbar .x{flex:none;font-size:11.5px;text-align:center;color:var(--muted);padding-top:7px;border-top:1px solid var(--rule)}' +
      '.hf-cnunit{font-size:11.5px;color:var(--muted);margin-top:8px}' +
      '.hf-cnnotes{display:flex;flex-direction:column;justify-content:center}' +
      '.hf-cnnote{padding:16px 2px;border-bottom:1px solid var(--rule);display:flex;flex-direction:column;gap:5px}' +
      '.hf-cnnote:first-child{border-top:2px solid var(--t)}' +
      '.hf-cnnote .h{font-size:16.5px;font-weight:800;line-height:1.4}' +
      '.hf-cnnote .t{font-size:14px;line-height:1.55;color:var(--body)}' +
      /* 목차 panel 변형 — 좌 컬러면+우 라운드 화이트 패널 */
      '.slide.hf.tc.pv{display:block;background:var(--t);color:#fff;padding:64px 72px;position:relative;overflow:hidden}' +
      '.hf-tcblob{position:absolute;top:-150px;bottom:-150px;right:-190px;width:760px;background:#fff;border-radius:380px}' +
      '.hf-tcbig{position:relative;z-index:1;font-size:62px;font-weight:800;letter-spacing:-.01em;line-height:1.12;white-space:pre-wrap}' +
      '.hf-tcdeck{position:absolute;z-index:1;left:72px;bottom:60px;font-size:19px;font-weight:800;line-height:1.5;white-space:pre-wrap}' +
      '.hf-tcplist{position:absolute;z-index:1;top:50%;right:96px;transform:translateY(-50%);width:440px;display:flex;flex-direction:column;color:var(--ink)}' +
      '.hf-tcprow{display:flex;align-items:baseline;gap:20px;padding:19px 2px;border-bottom:1px solid var(--rule)}' +
      '.hf-tcprow:last-child{border-bottom:0}' +
      '.hf-tcprow .no{flex:0 0 24px;font-size:15px;font-weight:800;color:var(--t)}' +
      '.hf-tcprow .lb{flex:0 0 150px;font-size:20px;font-weight:800}' +
      '.hf-tcprow .ds{flex:1;font-size:13.5px;color:var(--muted)}' +
      /* KPI badge 변형 — 넘버 뱃지+라벨+대형 수치 센터 카드 */
      '.hf-kbgrid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(var(--kbc),1fr);gap:16px;align-content:center;padding:20px 0;position:relative;z-index:2}' +
      '.hf-kbcard{background:linear-gradient(180deg,var(--tn),color-mix(in srgb,var(--tn) 35%,#fff));border-radius:18px;padding:44px 24px 52px;display:flex;flex-direction:column;align-items:center;gap:12px;min-height:300px}' +
      '.hf-kbno{width:34px;height:34px;border-radius:11px;background:var(--dp);color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800}' +
      '.hf-kblab{font-size:16px;font-weight:800}' +
      '.hf-kbval{margin-top:auto;margin-bottom:auto;display:flex;align-items:baseline;gap:2px}' +
      '.hf-kbval i{font-style:normal;font-size:72px;font-weight:800;letter-spacing:-.03em;color:var(--t);font-variant-numeric:tabular-nums}' +
      '.hf-kbval em{font-style:normal;font-size:30px;font-weight:800;color:var(--ink)}' +
      /* 워터폴 (chart variant) */
      '.hf-wfwrap{flex:1;min-height:0;display:flex;align-items:stretch;gap:10px;padding:34px 0 6px;position:relative;z-index:2}' +
      '.hf-wfcol{flex:1;min-width:0;display:flex;flex-direction:column}' +
      '.hf-wfcol .tr{flex:1;min-height:0;position:relative;display:flex;flex-direction:column;justify-content:flex-end}' +
      /* 바는 absolute — margin %가 폭 기준으로 계산돼 계단 오프셋이 틀어지는 것 방지 */
      '.hf-wfcol .tr i{position:absolute;left:0;right:0;background:color-mix(in srgb,var(--t) 26%,#fff);border-radius:6px}' +
      '.hf-wfcol .v{position:absolute;left:-8px;right:-8px;text-align:center;font-size:12px;font-weight:800;color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}' +
      '.hf-wfcol .x{flex:none;font-size:11px;text-align:center;color:var(--muted);padding-top:7px;border-top:1px solid var(--rule);min-height:34px;line-height:1.35}' +
      '.hf-wfcol.tt .tr i{background:var(--dp);border-radius:8px 8px 0 0}' +
      '.hf-wfcol.tt .v.in{color:#fff;font-size:16px}' +
      '.hf-wfcol.vs .vsbg{position:absolute;inset:-30px -5px 0;background:var(--tn);border-radius:12px}' +
      '.hf-wfcol.vs .tr i{position:relative;background:var(--t);border-radius:8px 8px 0 0}' +
      '.hf-wfcol.vs .v{z-index:1}' +
      '.hf-wfcol.vs .gap{position:absolute;left:50%;transform:translate(-50%,50%);z-index:2;background:#fff;border-radius:999px;padding:9px 14px;font-size:12.5px;font-weight:800;color:var(--t);box-shadow:0 6px 18px rgba(10,30,20,.12);white-space:nowrap}' +
      /* 라인업 (lineup) */
      '.hf-lnrows{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px;justify-content:center;padding:14px 0;position:relative;z-index:2}' +
      '.hf-lnrow{display:flex;align-items:center;gap:26px;background:var(--tn);border-radius:14px;padding:22px 30px}' +
      '.hf-lnrow.on{background:var(--b);color:#fff}' +
      '.hf-lnrow.dim{background:#F0F2F1;opacity:.65}' +
      '.hf-lntag{flex:0 0 92px;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--t)}' +
      '.hf-lnrow.on .hf-lntag{color:#fff;opacity:.85}' +
      '.hf-lnhead{flex:0 0 220px;font-size:19px;font-weight:800}' +
      '.hf-lntx{flex:1;min-width:0;font-size:14px;line-height:1.5;color:var(--body)}' +
      '.hf-lnrow.on .hf-lntx{color:#fff;opacity:.92}' +
      '.hf-lnbadge{flex:none;background:#fff;border-radius:999px;padding:8px 16px;font-size:12.5px;font-weight:800;color:var(--t)}' +
      '.hf-lnrow.on .hf-lnbadge{background:rgba(255,255,255,.16);color:#fff}' +
      /* 분기 구조 (branch) */
      '.hf-bnwrap{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 0;position:relative;z-index:2}' +
      '.hf-bnlead{background:var(--dp);color:#fff;border-radius:14px;padding:20px 40px;display:flex;flex-direction:column;gap:5px;text-align:center;max-width:640px}' +
      '.hf-bnlead .l{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.8}' +
      '.hf-bnlead .t{font-size:18px;font-weight:800;line-height:1.4;white-space:pre-wrap}' +
      '.hf-bnstem{width:2px;height:22px;background:var(--rule)}' +
      /* 가로 분기선 폭 = 첫 카드 중심 ~ 끝 카드 중심 */
      '.hf-bnbar{width:calc(100% - (100% - 16px*(var(--bnc) - 1))/var(--bnc));height:2px;background:var(--rule)}' +
      '.hf-bngrid{width:100%;display:grid;grid-template-columns:repeat(var(--bnc),1fr);gap:16px}' +
      '.hf-bncard{position:relative;background:var(--tn);border-radius:14px;padding:26px 24px;display:flex;flex-direction:column;gap:8px;text-align:center;margin-top:20px}' +
      '.hf-bncard::before{content:"";position:absolute;top:-22px;left:50%;width:2px;height:22px;background:var(--rule)}' +
      '.hf-bncard .l{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--t)}' +
      '.hf-bncard .h{font-size:18px;font-weight:800}' +
      '.hf-bncard .t{font-size:13.5px;line-height:1.55;color:var(--body)}' +
      /* 하이라이트 (highlight) */
      /* 행이 잔여 높이를 나눠 갖는다 — 고정 패딩으로 패널을 넘쳐 타이틀을 침범하지 않게 */
      '.hf-hlrows{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;z-index:2;margin-top:16px}' +
      '.hf-hlrow{flex:1 1 0;min-height:0;display:flex;align-items:center;gap:34px;padding:12px 2px;border-bottom:1px solid var(--rule)}' +
      '.hf-hlrow:first-child{border-top:2px solid var(--t)}.hf-hlrow:last-child{border-bottom:0}' +
      '.hf-hlno{flex:0 0 92px;font-size:56px;font-weight:800;line-height:1;color:color-mix(in srgb,var(--t) 32%,#fff);font-variant-numeric:tabular-nums}' +
      '.hf-hlhead{flex:0 0 350px;font-size:26px;font-weight:800;line-height:1.3;letter-spacing:-.01em;white-space:pre-wrap}' +
      '.hf-hltx{flex:1;min-width:0;font-size:15px;line-height:1.6;color:var(--body)}' +
      '.hf-hlfn{flex:none;text-align:right;font-size:12.5px;line-height:1.5;color:var(--muted);white-space:pre-wrap;padding-top:10px;position:relative;z-index:2}' +
      /* 보드 (board) */
      '.hf-bogrid{flex:1;min-height:0;display:grid;grid-template-columns:1.5fr 1fr;gap:16px;padding:14px 0;position:relative;z-index:2}' +
      '.hf-bogrid.solo{grid-template-columns:1fr}' +
      '.hf-bomain{display:flex;flex-direction:column;gap:16px;min-height:0}' +
      '.hf-bocard{flex:1;min-height:0;background:var(--tn);border-radius:16px;padding:26px 32px;display:flex;flex-direction:column;gap:8px;justify-content:center}' +
      '.hf-bocard .tg{font-size:12.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--t)}' +
      '.hf-bocard .h{font-size:23px;font-weight:800;line-height:1.3;white-space:pre-wrap}' +
      '.hf-bocard .t{font-size:14.5px;line-height:1.6;color:var(--body)}' +
      '.hf-boside{background:var(--dp);color:#fff;border-radius:16px;padding:30px 32px;display:flex;flex-direction:column;gap:16px}' +
      '.hf-boside .st{font-size:17px;font-weight:800}' +
      '.hf-boside ul{list-style:none;display:flex;flex-direction:column;gap:10px}' +
      '.hf-boside li{display:flex;gap:10px;align-items:baseline;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.9)}' +
      '.hf-boside .hf-dot{width:7px;height:7px;background:var(--tn);position:relative;top:-1px}' +
      '.hf-boside .pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}' +
      '.hf-boside .pill{background:rgba(255,255,255,.14);border-radius:999px;padding:8px 14px;font-size:12.5px;font-weight:700}' +
      /* 번호 카드 리스트 (list) */
      '.hf-lsrows{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px;justify-content:center;padding:14px 0;position:relative;z-index:2}' +
      '.hf-lsrow{display:flex;align-items:center;gap:24px;background:#fff;border:1.5px solid var(--rule);border-radius:14px;padding:19px 28px}' +
      '.hf-lsrow.on{background:var(--tn);border-color:transparent}' +
      '.hf-lsno{flex:none;width:38px;height:38px;border-radius:50%;background:var(--tn);color:var(--t);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800}' +
      '.hf-lsrow.on .hf-lsno{background:var(--t);color:#fff}' +
      '.hf-lslabel{flex:0 0 300px;font-size:18px;font-weight:800}' +
      '.hf-lssub{flex:1;min-width:0;font-size:14px;line-height:1.5;color:var(--body)}' +
      /* 매트릭스 (matrix) */
      '.hf-mxrows{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:12px 0;position:relative;z-index:2}' +
      '.hf-mxrow{flex:0 1 auto;min-height:0;display:flex;gap:24px;align-items:stretch}' +
      '.hf-mxside{flex:0 0 148px;display:flex;flex-direction:column;gap:3px;padding-top:4px}' +
      '.hf-mxtag{font-size:42px;font-weight:800;color:var(--t);line-height:1.05}' +
      '.hf-mxlab{font-size:15px;font-weight:800}' +
      '.hf-mxsub{font-size:12.5px;color:var(--muted)}' +
      '.hf-mxpanel{flex:1;min-width:0;background:var(--tn);border-radius:14px;padding:18px 24px;display:flex}' +
      '.hf-mxgroup{flex:1;min-width:0;padding:0 20px;display:flex;flex-direction:column;gap:8px}' +
      '.hf-mxgroup:first-child{padding-left:0}' +
      '.hf-mxgroup + .hf-mxgroup{border-left:1px solid rgba(0,0,0,.08)}' +
      '.hf-mxgroup .h{font-size:14.5px;font-weight:800;color:var(--t)}' +
      '.hf-mxgroup ul{list-style:none;display:flex;flex-direction:column;gap:5px}' +
      '.hf-mxgroup li{font-size:12.5px;line-height:1.55;color:var(--body);padding-left:11px;position:relative}' +
      '.hf-mxgroup li::before{content:"";position:absolute;left:0;top:8px;width:4px;height:4px;border-radius:50%;background:var(--t)}' +
      /* 3분할 보드 (triple) */
      '.hf-t3grid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1.5px solid var(--rule);border-radius:16px;overflow:hidden;margin:16px 0;position:relative;z-index:2}' +
      '.hf-t3col{display:flex;flex-direction:column;min-width:0}' +
      '.hf-t3col + .hf-t3col{border-left:1.5px solid var(--rule)}' +
      /* 타이포 확대 + 전체 센터 정렬(피드백 반영) */
      '.hf-t3head{flex:none;text-align:center;font-size:20px;font-weight:800;padding:17px;background:var(--tn)}' +
      '.hf-t3col.on .hf-t3head{background:var(--t);color:#fff}' +
      '.hf-t3col.on .hf-t3body{background:color-mix(in srgb,var(--tn) 55%,#fff)}' +
      '.hf-t3body{flex:1;min-height:0;padding:26px 26px;display:flex;flex-direction:column;gap:20px;justify-content:center;text-align:center}' +
      '.hf-t3lead{font-size:19px;line-height:1.6;font-weight:700}' +
      '.hf-t3lead b{color:var(--t)}' +
      '.hf-t3body ul{list-style:none;display:flex;flex-direction:column;gap:11px}' +
      '.hf-t3body li{font-size:15.5px;line-height:1.55;color:var(--body)}' +
      '.hf-t3body li::before{content:"·  ";color:var(--t);font-weight:800}' +
      '.hf-t3foot{font-size:15px;font-weight:700;color:var(--t)}' +
      /* 4분할 (quad) */
      '.hf-qdwrap{flex:1;min-height:0;position:relative;display:flex;z-index:2}' +
      /* 글로우 헤일로 + 그라데이션 도넛 링 — 콘텐츠는 원을 중심으로 모임(피드백 반영) */
      '.hf-qdwrap::before{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--t) 16%,#fff) 0%,rgba(255,255,255,0) 68%)}' +
      '.hf-qdring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:360px;height:360px;border-radius:50%;background:linear-gradient(145deg,color-mix(in srgb,var(--t) 44%,#fff),var(--tn) 55%,color-mix(in srgb,var(--t) 26%,#fff));-webkit-mask:radial-gradient(circle,transparent 116px,#000 117px);mask:radial-gradient(circle,transparent 116px,#000 117px)}' +
      '.hf-qdx{position:absolute;left:50%;top:50%;width:400px;height:12px;transform:translate(-50%,-50%);background:#fff}' +
      '.hf-qdy{position:absolute;left:50%;top:50%;width:12px;height:400px;transform:translate(-50%,-50%);background:#fff}' +
      '.hf-qdgrid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;column-gap:450px;row-gap:26px;padding:6px 10px}' +
      '.hf-qdcell{display:flex;flex-direction:column;gap:10px;min-width:0;justify-content:center}' +
      '.hf-qdcell .h{font-size:21px;font-weight:800}' +
      '.hf-qdcell ul{list-style:none;display:flex;flex-direction:column;gap:7px}' +
      '.hf-qdcell li{font-size:14px;line-height:1.55;color:var(--body)}' +
      '.hf-qdcell li::before{content:"·  ";color:var(--t);font-weight:800}' +
      /* 좌 열은 원 쪽(우측·우정렬), 우 열은 원 바로 옆(좌측) — 내용이 원을 향해 모인다 */
      '.hf-qdcell.q0,.hf-qdcell.q2{align-items:flex-end;text-align:right}' +
      '.hf-qdcell.q1,.hf-qdcell.q3{align-items:flex-start;text-align:left}' +
      '.hf-qdcore{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:206px;height:206px;background:#fff;border-radius:36%;box-shadow:0 12px 34px rgba(10,30,20,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;padding:20px}' +
      '.hf-qdcore .l{font-size:15px;font-weight:700;line-height:1.4;white-space:pre-wrap}' +
      '.hf-qdcore .h{font-size:23px;font-weight:800;color:var(--t)}' +
      /* 계층 구조도 (org) */
      '.hf-ogwrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:10px 0;position:relative;z-index:2}' +
      '.hf-ogbox{border:1.5px solid var(--rule);border-radius:16px;padding:0 0 22px;display:flex;flex-direction:column;overflow:hidden}' +
      '.hf-ogbox.top{border-color:var(--t)}' +
      '.hf-oghead{text-align:center;font-size:19px;font-weight:800;padding:14px;background:var(--tn)}' +
      '.hf-ogbox:not(.top) .hf-oghead{background:#F0F2F1}' +
      '.hf-oghead i{font-style:normal;font-size:13px;font-weight:700;color:var(--muted);margin-left:4px}' +
      '.hf-oglab{font-size:12.5px;font-weight:800;letter-spacing:.08em;color:var(--muted);padding:14px 26px 0}' +
      '.hf-ogband{margin:10px 26px 0;background:var(--dp);color:#fff;border-radius:10px;text-align:center;font-size:15.5px;font-weight:800;padding:12px}' +
      '.hf-ogrow{display:flex;gap:12px;padding:12px 26px 0}' +
      '.hf-ogchip{flex:1;min-width:0;text-align:center;background:var(--tn);border-radius:10px;padding:13px 8px;font-size:14px;font-weight:700}' +
      '.hf-ogbox:not(.top) .hf-ogchip{background:#fff;border:1px solid var(--rule)}' +
      '.hf-ogline{align-self:center;width:2px;height:34px;background:var(--b);position:relative}' +
      '.hf-ogdot{position:absolute;left:50%;bottom:-4px;transform:translateX(-50%);width:9px;height:9px;border-radius:50%;background:var(--b)}' +
      /* 순환 다이어그램 (cycle) */
      '.hf-cywrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;position:relative;z-index:2}' +
      '.hf-cyring{position:relative;width:520px;height:520px;background:var(--tn);border-radius:50%;flex:0 0 auto}' +
      '.hf-cyarc{position:absolute;inset:16px;border:2.5px solid var(--t);border-radius:50%;pointer-events:none}' +
      '.hf-cyarc.top{clip-path:inset(0 0 52% 0)}' +
      '.hf-cyarc.bot{border-color:var(--b);clip-path:inset(52% 0 0 0)}' +
      '.hf-cylab{position:absolute;left:50%;transform:translateX(-50%);font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:#fff;border-radius:999px;padding:7px 16px;white-space:nowrap}' +
      '.hf-cylab.top{top:-8px;color:var(--t)}' +
      '.hf-cylab.bot{bottom:-8px;color:var(--b)}' +
      '.hf-cyblk{position:absolute;left:50%;transform:translateX(-50%);width:70%;display:flex;flex-direction:column;gap:7px;text-align:center}' +
      '.hf-cyblk.tp{top:13%}' +
      '.hf-cyblk.bt{bottom:13%}' +
      '.hf-cyblk.lf{left:4%;right:auto;top:50%;transform:translateY(-50%);width:27%}' +
      '.hf-cyblk.rt{left:auto;right:4%;top:50%;transform:translateY(-50%);width:27%}' +
      '.hf-cyblk .h{font-size:18px;font-weight:800}' +
      '.hf-cyblk .t{font-size:13px;line-height:1.55;color:var(--body)}' +
      '.hf-cyside{position:absolute;top:50%;transform:translateY(-50%);font-size:14.5px;font-weight:800;white-space:pre-wrap;text-align:center;max-width:140px;line-height:1.4}' +
      '.hf-cyside.l{left:5%;color:var(--t)}' +
      '.hf-cyside.r{right:5%;color:var(--b)}' +
      '.hf-cycore{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:150px;height:150px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-size:17px;font-weight:800;line-height:1.35;box-shadow:0 10px 30px rgba(10,30,20,.08);padding:16px;white-space:pre-wrap}' +
      /* 지표 대시보드 (dash) */
      '.hf-dwrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;padding:14px 0;position:relative;z-index:2}' +
      '.hf-dgrid{display:grid;grid-template-columns:repeat(var(--dac),1fr);gap:16px}' +
      '.hf-dcard{background:var(--tn);border-radius:14px;padding:20px 20px 16px;display:flex;flex-direction:column;gap:10px;min-height:230px}' +
      '.hf-dval{display:flex;align-items:baseline;gap:4px}' +
      '.hf-dval i{font-style:normal;font-size:40px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}' +
      '.hf-dval em{font-style:normal;font-size:15px;font-weight:700;color:var(--muted)}' +
      '.hf-dtx{font-size:12.5px;color:var(--muted);line-height:1.5}' +
      '.hf-dmini{flex:1;min-height:0;display:flex;align-items:flex-end;gap:8px;margin-top:auto}' +
      '.hf-dmini.br i{flex:1;display:block;background:color-mix(in srgb,var(--t) 35%,#fff);border-radius:6px 6px 0 0}' +
      '.hf-dmini.br i.on{background:var(--t)}' +
      '.hf-dmini.dn{align-items:center;justify-content:center;position:relative}' +
      '.hf-dmini.dn i{width:104px;height:104px;border-radius:50%;display:block;-webkit-mask:radial-gradient(circle,transparent 34px,#000 35px);mask:radial-gradient(circle,transparent 34px,#000 35px)}' +
      '.hf-dmini.dn span{position:absolute;font-size:16px;font-weight:800;color:var(--t)}' +
      '.hf-dmini.ar i{flex:1;height:100%;display:block;background:linear-gradient(180deg,var(--t),color-mix(in srgb,var(--t) 18%,#fff))}' +
      /* 반원 게이지 */
      '.hf-dmini.gg{align-items:flex-end;justify-content:center;position:relative;overflow:hidden}' +
      '.hf-dmini.gg i{width:130px;height:130px;display:block;border-radius:50%;margin-bottom:-65px;-webkit-mask:radial-gradient(circle,transparent 40px,#000 41px);mask:radial-gradient(circle,transparent 40px,#000 41px)}' +
      '.hf-dmini.gg span{position:absolute;bottom:2px;left:50%;transform:translateX(-50%);font-size:16px;font-weight:800;color:var(--t)}' +
      '.hf-dstrip{background:var(--tn);border-radius:14px;padding:20px 28px;display:flex;align-items:center;gap:0}' +
      '.hf-dstat{flex:1;display:flex;flex-direction:column;gap:5px;align-items:center;text-align:center}' +
      '.hf-dstat + .hf-dstat{border-left:1px solid var(--rule)}' +
      '.hf-dstat .l{font-size:13px;font-weight:600;color:var(--body)}' +
      '.hf-dstat .v{font-size:30px;font-weight:800;color:var(--t);font-variant-numeric:tabular-nums}' +
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
      /* 플레이스홀더 라벨은 좌하단 구석 — 중앙 텍스트와 겹침 방지 */
      '.hf-herobg.ph{display:flex;align-items:flex-end;justify-content:flex-start;padding:24px 30px;background:linear-gradient(155deg,var(--t),var(--b) 72%);color:rgba(255,255,255,.55);font-size:14px}' +
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
      /* ---- 2026 필(pill) 기하 신규 스타일 (Figma 538:2 실측, 1920×1080→2/3 환산) ---- */
      /* 워드마크 2줄 텍스트 로고 */
      '.hp-wm{position:absolute;right:54px;top:52px;z-index:5;color:#fff;line-height:1.16;text-align:left}' +
      '.hp-wm b{display:block;font-size:27px;font-weight:800;letter-spacing:-.01em}' +
      '.hp-wm span{display:block;font-size:29px;font-weight:800;letter-spacing:-.01em}' +
      '.hp-wm.ct{right:auto;left:50%;transform:translateX(-50%);top:38px;text-align:center}' +
      /* 커버 배경 레이어 — 원호는 스샷 3점 실측으로 푼 원(중심·반경) */
      '.hp-cv,.hp-ag{background:var(--t)}' +
      '.hp-cvz{position:absolute;left:0;width:1280px;height:360px;z-index:1}' +
      '.hp-cvz.t{top:0}.hp-cvz.b{top:360px}' +
      '.hp-cvz.t rect{fill:var(--t)}.hp-cvz.t circle{fill:var(--sg)}' +
      '.hp-cvz.b rect{fill:var(--b)}.hp-cvz.b .cdt{fill:var(--dt)}.hp-cvz.b .ca{fill:var(--a)}' +
      '.hp-cvkick{position:absolute;left:59px;top:52px;z-index:5;color:#fff;font-size:24px;font-weight:600;letter-spacing:-.01em}' +
      '.hp-cvtitle{position:absolute;left:59px;top:267px;z-index:5;color:#fff;font-size:80px;font-weight:800;line-height:1.16;letter-spacing:-.015em;white-space:pre-wrap;max-width:920px}' +
      '.hp-cv.up .hp-cvtitle{top:48px;font-size:55px}' +
      '.hp-cv .hf-logo,.hp-dv .hf-logo{left:59px;bottom:59px}' +
      /* 간지 pill — 딥 지면+상하 2필 / pill2=3필 스택+타원 오버레이 */
      '.hp-dv{background:var(--dt)}' +
      /* 캡슐(스타디움) 실측 — 상단 c(777,34) R316·하단 c(769,665) R314, y350에서 맞닿음(갭 없음).
         위/아래·우측은 슬라이드 밖으로 흘려 PPTX roundRect(4코너 균일)에서도 보이는 면이 원본과 같다 */
      '.hp-dvp1{position:absolute;left:461px;right:-320px;top:-282px;height:632px;background:var(--p1);border-radius:316px}' +
      '.hp-dvp2{position:absolute;left:455px;right:-320px;top:351px;height:628px;background:var(--p2);border-radius:314px}' +
      /* pill2 실측 — 캡슐 3개(좌 라운드 원 c(742,55)·c(853,365)·c(744,675), R≈156) + 우측 대형 원(c(431,362) R714) 밖 어둡게 */
      '.hp-dv2a{position:absolute;left:586px;right:-160px;top:-101px;height:312px;background:var(--sg);border-radius:156px}' +
      '.hp-dv2b{position:absolute;left:697px;right:-160px;top:209px;height:312px;background:var(--p1);border-radius:156px}' +
      '.hp-dv2c{position:absolute;left:587px;right:-160px;top:518px;height:314px;background:var(--sg);border-radius:157px}' +
      '.hp-dv2o{position:absolute;inset:0;width:1280px;height:720px}' +
      '.hp-dv2o path{fill:rgba(4,36,26,.16)}' +
      '.hp-dvtitle{position:absolute;left:59px;top:48px;z-index:5;color:#fff;font-size:48px;font-weight:800;line-height:1.25;letter-spacing:-.02em;white-space:pre-wrap;max-width:340px}' +
      /* 아젠다 — 미니 커버 기하(하단 밴드 md)+잉크 패널 */
      '.hp-ag .hp-cvz.b rect{fill:var(--md)}' +
      '.hp-agpanel{position:absolute;left:173px;top:185px;width:933px;height:449px;z-index:5;background:linear-gradient(135deg,color-mix(in srgb,var(--ik2) 82%,var(--t)),var(--ik2));border-radius:4px;padding:36px 100px 30px 100px;display:flex;flex-direction:column}' +
      '.hp-aglab{text-align:center;color:#fff;font-size:19px;font-weight:800;letter-spacing:.08em;flex:0 0 auto}' +
      '.hp-agrows{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;margin-top:8px}' +
      '.hp-agrow{display:flex;align-items:flex-start;gap:26px;padding:20px 0;border-bottom:1px solid rgba(255,255,255,.28)}' +
      '.hp-agrow:last-child{border-bottom:none}' +
      '.hp-agbdg{flex:0 0 56px}' +
      '.hp-agbdg b{display:inline-block;background:#fff;color:var(--bdg);font-size:14px;font-weight:800;border-radius:6px;padding:4px 11px}' +
      '.hp-aghead{flex:1;min-width:0;color:#fff;font-size:18px;font-weight:700;line-height:1.5}' +
      '.hp-agwho{flex:0 0 auto;max-width:330px;color:#fff;font-size:17px;font-weight:500;line-height:1.75;text-align:left;white-space:pre-wrap}' +
      /* 사이드바 — 좌 md 바+우 본문, num 변형=절반 바+대형 숫자 */
      '.hp-sb,.hp-nt,.hp-ccs,.hp-st,.hp-pq{background:#fff}' +
      '.hp-sbbar{position:absolute;left:0;top:0;bottom:0;width:233px;background:var(--md);z-index:2;padding:52px 40px}' +
      '.hp-sb.nm .hp-sbbar{width:614px;padding:49px 49px}' +
      '.hp-sbtitle{display:block;color:#fff;font-size:30px;font-weight:800;line-height:1.34;letter-spacing:-.01em;white-space:pre-wrap}' +
      '.hp-sb.nm .hp-sbtitle{font-size:38px}' +
      '.hp-sbno{position:absolute;left:33px;bottom:-36px;color:#fff;font-size:186px;font-weight:200;line-height:1}' +
      '.hp-sbbody{position:absolute;left:392px;right:64px;top:0;bottom:0;z-index:2;padding-top:108px}' +
      '.hp-sb.nm .hp-sbbody{left:717px}' +
      '.hp-sblead{font-size:21px;font-weight:800;line-height:1.5;color:var(--ink);white-space:pre-wrap}' +
      '.hp-sbtx{margin-top:44px;font-size:16px;line-height:1.85;color:var(--body);white-space:pre-wrap}' +
      /* 포토 쿼드 — 사이드바+2×2 도트 캡션+십자 구분선 */
      '.hp-pqgrid{position:absolute;left:233px;right:0;top:0;bottom:0;z-index:2;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;padding:34px 40px}' +
      '.hp-pqv{position:absolute;left:50%;top:54px;bottom:54px;width:1px;background:var(--rule)}' +
      '.hp-pqh{position:absolute;top:50%;left:40px;right:40px;height:1px;background:var(--rule)}' +
      '.hp-pqcell{min-width:0;min-height:0;display:flex;flex-direction:column;gap:12px;padding:14px 24px}' +
      '.hp-pqcap{display:flex;align-items:center;gap:10px}' +
      '.hp-pqcap i{width:16px;height:16px;border-radius:50%;background:var(--bdg);flex:0 0 auto}' +
      '.hp-pqcap span{font-size:14px;font-weight:600;color:var(--ink)}' +
      '.hp-pqcell .hf-imgph,.hp-pqcell .hf-abimg{flex:1;min-height:0;width:100%;object-fit:cover;border-radius:0}' +
      /* 스테이트먼트 frame — md 보더 프레임+센터 구성 */
      /* 프레임 보더는 별도 스팬 — 섹션 자체 border는 PPTX DOM 워커가 도형으로 못 집는다 */
      '.hp-stframe{position:absolute;inset:0;border:44px solid var(--md)}' +
      '.hp-stin{position:absolute;inset:44px;display:flex;flex-direction:column;align-items:center;padding:120px 64px 0}' +
      '.hp-sttitle{font-size:25px;font-weight:800;letter-spacing:-.01em;text-align:center;white-space:pre-wrap}' +
      '.hp-stsub{margin-top:14px;font-size:13px;color:var(--muted);text-align:center}' +
      '.hp-strule{display:block;width:100%;height:1px;background:var(--rule);margin-top:66px}' +
      '.hp-sttx{margin-top:78px;font-size:16px;line-height:2.28;color:var(--body);text-align:center;white-space:pre-wrap}' +
      /* 스크린 — 딥 지면+우 대형 패널 */
      '.hp-scr{background:var(--dt)}' +
      '.hp-scrbg1{position:absolute;left:588px;right:0;top:0;height:210px;background:rgba(255,255,255,.10);border-radius:0 0 0 120px}' +
      '.hp-scrbg2{position:absolute;left:1032px;top:200px;width:560px;height:700px;border-radius:50%;background:rgba(255,255,255,.08)}' +
      '.hp-pill{display:inline-block;border:2px solid var(--ink);border-radius:999px;font-size:18px;font-weight:700;padding:7px 18px;color:var(--ink)}' +
      '.hp-pill.iv{border-color:#fff;color:#fff}' +
      '.hp-scrl{position:absolute;left:53px;top:37px;bottom:37px;width:250px;z-index:3;display:flex;flex-direction:column;align-items:flex-start}' +
      '.hp-scrtitle{margin-top:56px;color:#fff;font-size:30px;font-weight:800;line-height:1.4;letter-spacing:-.01em;white-space:pre-wrap}' +
      '.hp-scrrule{display:block;width:126px;height:2px;background:rgba(255,255,255,.55);margin-top:36px}' +
      '.hp-scrlist{margin-top:28px;list-style:none;color:#fff;font-size:15px;line-height:2.2;font-weight:500}' +
      '.hp-scrpanel{position:absolute;left:362px;right:50px;top:56px;bottom:60px;z-index:3;background:var(--tn);overflow:hidden}' +
      '.hp-scrpanel .hf-abimg{width:100%;height:100%;object-fit:cover}' +
      '.hp-scrpanel .hf-imgph{width:100%;height:100%;border-radius:0}' +
      /* 노트 — 좌 엣지바/상단 밴드+타이틀+헤어라인+좌 소제목·우 문단 */
      '.hp-ntedge{position:absolute;left:0;top:0;bottom:0;width:17px;background:var(--md)}' +
      '.hp-nt.bd .hp-ntedge,.hp-ntedge.bdtop{left:0;right:0;top:0;bottom:auto;width:auto;height:25px}' +
      '.hp-nttitle{position:absolute;left:80px;top:80px;font-size:23px;font-weight:800;letter-spacing:-.01em}' +
      '.hp-ntrule{position:absolute;left:80px;right:80px;top:158px;height:1px;background:#9AA5A0}' +
      '.hp-ntgrid{position:absolute;left:80px;right:80px;top:200px;display:flex;gap:60px}' +
      '.hp-nthead{flex:0 0 255px;font-size:16px;font-weight:700;color:var(--ink);white-space:pre-wrap}' +
      '.hp-nttx{flex:1;min-width:0;font-size:16px;line-height:1.85;color:var(--body);white-space:pre-wrap}' +
      /* 원형 수치 — 겹침 원 2~3 */
      '.hp-cchead{position:absolute;left:0;right:0;top:68px;text-align:center}' +
      '.hp-cctitle{font-size:23px;font-weight:800;letter-spacing:-.01em}' +
      '.hp-ccsub{margin-top:12px;font-size:13px;color:var(--muted)}' +
      '.hp-ccrow{position:absolute;left:0;right:0;top:241px;display:flex;justify-content:center}' +
      '.hp-cc{width:347px;height:347px;border-radius:50%;background:var(--cg);flex:0 0 auto;margin:0 -14px;mix-blend-mode:multiply;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;color:#fff}' +
      '.hp-cc .tg{font-size:16px;font-weight:700}' +
      '.hp-cc .vl{font-size:52px;font-weight:800;letter-spacing:-.01em}' +
      '.hp-cc .lb{font-size:16px;font-weight:500}' +
      /* 포토 frame3 */
      '.hp-f3{background:var(--t)}' +
      '.hp-f3sg{position:absolute;right:-540px;top:-480px;width:1400px;height:1400px;border-radius:50%;background:var(--sg)}' +
      '.hp-f3row{position:absolute;left:44px;right:44px;top:46px;height:304px;z-index:2;display:flex;gap:32px}' +
      '.hp-f3fr{flex:1;min-width:0;background:#fff;padding:0}' +
      '.hp-f3fr .hf-abimg{width:100%;height:100%;object-fit:cover}' +
      '.hp-f3fr .hf-imgph{width:100%;height:100%;border-radius:0}' +
      '.hp-f3foot{position:absolute;left:44px;right:44px;top:432px;bottom:44px;z-index:2;display:flex;gap:60px}' +
      '.hp-f3l{flex:0 0 320px;display:flex;flex-direction:column;align-items:flex-start;gap:26px;position:relative}' +
      '.hp-f3l .hp-pill{border-color:#fff;color:#fff}' +
      '.hp-f3title{color:#fff;font-size:30px;font-weight:800;line-height:1.35;white-space:pre-wrap}' +
      '.hp-f3rule{position:absolute;left:0;right:0;bottom:0;height:1px;background:rgba(255,255,255,.7)}' +
      '.hp-f3rule.top{bottom:auto;top:0}' +
      '.hp-f3cap{flex:1;min-width:0;position:relative;padding-top:26px}' +
      '.hp-f3cap p{color:#fff;font-size:15px;line-height:2;white-space:pre-wrap}' +
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
    { type: 'duo', label: '수치 2패널', use: '대형 수치·문구 두 개 나란히 — 값+라벨+구성 칩', needs: ['title', 'items'], opt: ['sub'], cap: { items: '2개' } },
    { type: 'flow', label: '전환 구조도', use: '전 → 후 변화 구조 — 좌 이전 패널, 화살표, 우 이후 패널 1~2', needs: ['title', 'from', 'to'], opt: ['sub', 'foot'] },
    { type: 'hsteps', label: '가로 단계', use: '일정·절차를 가로 노드 4~6개로 — 도트+라인+날짜', needs: ['title', 'steps'], opt: ['sub'], cap: { steps: '4~6개' } },
    { type: 'profile', label: '프로필 카드', use: '팀·부스·조직 소개 2~3열 — 뱃지+딥 헤더+리스트+포커스 박스', needs: ['title', 'cards'], opt: ['sub'], cap: { cards: '2~3개' } },
    { type: 'band', label: '와이드 밴드', use: '딥 밴드(선언+포인트 2~3)+하단 카드 3~5 — 개요 한 장 요약', needs: ['title', 'lead', 'cards'], opt: ['points', 'sub'], cap: { cards: '3~5개' } },
    { type: 'halfimg', label: '하프 이미지', use: '좌 딥 텍스트 패널+우 절반 이미지(업로드) — 브랜드·인사 선언 장', needs: ['head'], opt: ['lead', 'text'] },
    { type: 'chart', label: '차트+노트', use: '좌 막대 차트+우 코멘트 리스트 — 추이·실적(수치는 실측만)', needs: ['title', 'bars'], opt: ['notes', 'badge', 'unit', 'sub'], cap: { bars: '3~8개' } },
    { type: 'cycle', label: '순환 다이어그램', use: '상하 아크+중앙 허브 — 주고받는 관계·선순환 구조', needs: ['center', 'top', 'bottom'], opt: ['title', 'left', 'right', 'topLabel', 'bottomLabel'] },
    { type: 'matrix', label: '매트릭스', use: '좌 대형 이니셜+우 그룹 패널 행 2~3 — 내용 많은 분류 정리(ESG형)', needs: ['title', 'rows'], opt: ['sub'], cap: { rows: '2~3개' } },
    { type: 'triple', label: '3분할 보드', use: '헤더 밴드 3열 — 열마다 리드+리스트, 마지막 열 강조', needs: ['title', 'cols'], opt: ['sub'], cap: { cols: '3개' } },
    { type: 'quad', label: '4분할', use: '사분면 4블록+중앙 원 허브 — 영역별 실행 항목', needs: ['center', 'cells'], opt: ['title'], cap: { cells: '4개' } },
    { type: 'org', label: '구조도', use: '상단 조직 박스(밴드+칩)+커넥터+하단 조직 박스 — 계층 구조', needs: ['top', 'bottom'], opt: ['title'] },
    { type: 'lineup', label: '라인업', use: '프로그램·연사·부스 라인업 행 3~5 — 태그+이름+설명+상태 뱃지, 첫 강조', needs: ['title', 'items'], opt: ['sub'], cap: { items: '3~5개' } },
    { type: 'branch', label: '분기 구조', use: '상단 리드 → 하위 카드 2~4 분기 — 조직·역할 갈래', needs: ['lead', 'branches'], opt: ['title', 'sub'], cap: { branches: '2~4개' } },
    { type: 'highlight', label: '하이라이트', use: '대형 번호 재생 행 2~3 — 핵심 포인트 임팩트', needs: ['title', 'items'], opt: ['footnote', 'sub'], cap: { items: '2~3개' } },
    { type: 'board', label: '보드', use: '좌 카드 2 스택+우 딥 사이드(리스트+필) — 두 축+요약', needs: ['title', 'cards'], opt: ['side', 'sub'], cap: { cards: '2개' } },
    { type: 'list', label: '번호 리스트', use: '번호 원 카드 행 2~5 — 절차·핵심 포인트, 첫 행 강조', needs: ['title', 'rows'], opt: ['accent', 'sub'], cap: { rows: '2~5개' } },
    { type: 'dash', label: '지표 대시보드', use: '미니 차트(막대·도넛·에어리어) 카드 3~4+하단 스탯 스트립', needs: ['title', 'cards'], opt: ['strip', 'sub'], cap: { cards: '3~4개' } },
    { type: 'word', label: '한 단어', use: '한 단어 임팩트 — 대형 타이포 중앙(감사·환영)', needs: ['text'], opt: ['caption'] },
    { type: 'statement', label: '스테이트먼트', use: '타이틀+서브 문장 중앙 대형 — 메시지 전달 장', needs: ['title'], opt: ['sub'] },
    { type: 'hero', label: '이미지 히어로', use: '풀블리드 배경 이미지+중앙 텍스트(이미지는 업로드)', needs: ['title'], opt: ['sub'] },
    { type: 'quote', label: '슬로건', use: '행사 슬로건·메시지 — 풀블리드 딥 밴드', needs: ['text'], opt: ['by'] },
    { type: 'agenda', label: '아젠다', use: '발표 순서 — 잉크 패널에 파트 뱃지|제목|발표자 행 2~4(2026 필 기하)', needs: ['rows'], opt: ['title'], cap: { rows: '2~4개' } },
    { type: 'sidebar', label: '사이드바 본문', use: '좌 컬러 사이드바 제목+우 리드·문단 — 서술형 본문(num 변형=절반 바+대형 숫자)', needs: ['title', 'text'], opt: ['lead', 'variant', 'no'] },
    { type: 'screen', label: '스크린 패널', use: '딥 지면+좌 연도 뱃지·타이틀·리스트+우 대형 이미지 패널(업로드)', needs: ['title'], opt: ['year', 'points'] },
    { type: 'note', label: '노트', use: '타이틀+풀폭 헤어라인+좌 소제목·우 문단 — 담백한 텍스트 장(band 변형=상단 밴드)', needs: ['title', 'text'], opt: ['head', 'variant'] },
    { type: 'circles', label: '원형 수치', use: '겹침 원 2~3에 태그·대형 수치·라벨 — 목표·성과 강조(수치는 실측만)', needs: ['title', 'items'], opt: ['sub'], cap: { items: '2~3개' } },
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
    duo: { type: 'duo', title: '올해 목표\n두 가지', items: [
      { value: '120가족', label: '초청 규모', text: '전 임직원 가족 모두를 초대합니다', chips: ['전 임직원', '가족 동반', '사전 신청'] },
      { value: '부스 12개', label: '체험 프로그램', text: '연령별 만들기·놀이 부스로 확대', chips: ['포토존', '플레이존', '만들기'], tone: 'on' }
    ] },
    flow: { type: 'flow', title: '올해 운영,\n이렇게 바뀌어요', from: { head: '작년', items: [{ k: '운영', v: '오후 반일' }, { k: '부스', v: '체험 부스 6개' }, { k: '기념품', v: '공통 1종' }] }, to: [
      { head: '올해', items: [{ k: '운영', v: '하루 종일' }, { k: '부스', v: '체험 부스 12개' }, { k: '기념품', v: '연령별 맞춤' }], tone: 'on' }
    ] },
    hsteps: { type: 'hsteps', title: '당일 흐름\n한눈에', steps: [
      { when: '13:00', head: '등록', text: '로비에서 웰컴 키트 수령' },
      { when: '13:30', head: '환영 인사', text: '대표 인사 및 행사 안내' },
      { when: '14:00', head: '체험 부스', text: '포토존·플레이존·만들기' },
      { when: '16:30', head: '경품 추첨', text: '기념 선물 증정' }
    ] },
    profile: { type: 'profile', title: '체험 부스\n소개', cards: [
      { badge: '인기 1위', kicker: 'Booth', head: '패밀리 포토존', points: ['가족 사진 촬영과 즉석 인화', '소품·의상 대여'], focus: { label: 'Tip', items: ['오후 2시 이전이 한산해요'] } },
      { kicker: 'Play', head: '키즈 플레이존', points: ['연령별 놀이 공간', '안전 요원 상주'], focus: { label: 'Tip', items: ['5세 미만은 보호자 동반'] } },
      { kicker: 'Craft', head: '만들기 부스', points: ['가족 공예 체험', '완성품은 집으로'], focus: { label: 'Tip', items: ['회차별 선착순 운영'] } }
    ] },
    band: { type: 'band', title: '프로그램\n한눈에', lead: '가족과 함께하는\n하루를 준비했습니다', points: [
      { head: '가족 초청', text: '임직원 가족을 회사로 초대해 일터를 소개합니다' },
      { head: '체험 프로그램', text: '아이와 함께하는 만들기·놀이 부스' },
      { head: '기념 선물', text: '참여 가족 모두에게 증정' }
    ], cards: [
      { head: '포토존', text: '가족 사진 촬영' }, { head: '플레이존', text: '연령별 놀이' }, { head: '만들기 부스', text: '가족 공예' }, { head: '경품 추첨', text: '전 가족 대상', tone: 'on' }
    ] },
    halfimg: { type: 'halfimg', head: 'HAPPY\nFAMILY DAY', lead: '가족과 함께하는 하루', text: '일 년에 단 하루,\n회사가 가족의 놀이터가 됩니다.\n\n2026년 5월 22일 금요일,\n판교 사옥에서 만나요.' },
    chart: { type: 'chart', title: '참여 가족,\n해마다 늘고 있어요', badge: '3년 연속 증가', unit: '단위 : 가족', bars: [
      { x: '2023', v: 74 }, { x: '2024', v: 92 }, { x: '2025', v: 106, on: true }
    ], notes: [
      { head: '재참여 92%', text: '작년 참여 가족 대부분이 다시 신청했어요' },
      { head: '첫 참여 증가', text: '동료 추천으로 새로 신청한 가족이 늘었어요' }
    ] },
    cycle: { type: 'cycle', center: '해피\n패밀리 데이', topLabel: '회사가 가족에게', bottomLabel: '가족이 회사에게',
      top: { head: '하루의 초대', text: '체험 부스와 기념 선물,\n일터를 여는 하루' },
      bottom: { head: '이해와 응원', text: '가족의 응원이\n일할 힘이 됩니다' },
      left: { head: '가족', text: '함께 즐기는 하루' },
      right: { head: '회사', text: '일터를 여는 초대' } },
    dash: { type: 'dash', title: '한눈에 보는\n작년 성과', cards: [
      { label: '참여 가족', value: '106', unit: '가족', chart: { kind: 'bars', v: [74, 92, 106] } },
      { label: '만족도', value: '4.8', unit: '/ 5점', chart: { kind: 'donut', pct: 96 } },
      { label: '체험 부스 이용', value: '1,200', unit: '회+', chart: { kind: 'area', v: [3, 5, 8, 12] } }
    ], strip: [
      { label: '재참여 의사', value: '92%' }, { label: '추천 의향', value: '89%' }
    ] },
    matrix: { type: 'matrix', title: '영역별 준비\n한눈에', rows: [
      { tag: '준비', label: 'Before', sub: '행사 전', groups: [
        { head: '신청·확정', items: ['사내 공지와 가족 인원 조사', '문자로 확정·주차 안내'] },
        { head: '제작', items: ['웰컴 키트·기념 선물 제작', '부스 시설과 안전 점검'] }
      ] },
      { tag: '당일', label: 'Day', sub: '행사 운영', groups: [
        { head: '운영', items: ['등록 데스크와 웰컴 키트 배부', '체험 부스 3종 운영'] },
        { head: '안전', items: ['안전 요원 상주', '연령별 보호자 동반 안내'] }
      ] },
      { tag: '이후', label: 'After', sub: '행사 후', groups: [
        { head: '기록', items: ['현장 사진 공유', '만족도 조사'] },
        { head: '다음 준비', items: ['피드백 반영', '내년 계획 수립'] }
      ] }
    ] },
    triple: { type: 'triple', title: '운영 원칙\n세 가지', cols: [
      { head: '가족 초청', lead: '임직원 가족을 회사로 초대해\n**일터를 소개**합니다', items: ['전 임직원 대상', '사전 신청제'] },
      { head: '체험 프로그램', lead: '아이와 함께하는\n**만들기·놀이** 부스', items: ['연령별 프로그램', '안전 요원 상주'] },
      { head: '기념 선물', lead: '참여 가족 모두에게\n**기념 선물** 증정', items: ['연령별 맞춤 구성', '경품 추첨 이벤트'], tone: 'on' }
    ] },
    quad: { type: 'quad', center: { label: '가족과 함께하는', head: '하루' }, cells: [
      { head: '포토존', items: ['가족 사진 촬영과 즉석 인화', '소품·의상 대여'] },
      { head: '플레이존', items: ['연령별 놀이 공간', '안전 요원 상주'] },
      { head: '만들기 부스', items: ['가족 공예 체험', '완성품은 집으로'] },
      { head: '경품 추첨', items: ['전 가족 대상 이벤트', '기념 선물 증정'] }
    ] },
    org: { type: 'org', title: '행사 운영 조직', top: { head: '해피 패밀리 데이', cap: '운영본부', label: '운영 부문', band: '피플팀', items: ['등록·안내', '체험 부스', '안전 관리', '기념 선물'] }, bottom: { head: '지원 조직', items: ['총무팀', '홍보팀', '보안팀'] } },
    lineup: { type: 'lineup', title: '체험 부스\n라인업', items: [
      { tag: 'Booth', head: '패밀리 포토존', text: '가족 사진 촬영과 즉석 인화', badge: '인기 1위' },
      { tag: 'Play', head: '키즈 플레이존', text: '연령별 놀이 공간, 안전 요원 상주', badge: '상시 운영' },
      { tag: 'Craft', head: '만들기 부스', text: '가족 공예 체험, 완성품은 집으로', badge: '회차제' },
      { tag: 'Gift', head: '경품 추첨', text: '전 가족 대상 이벤트', badge: '16:30', state: 'dim' }
    ] },
    branch: { type: 'branch', title: '운영 조직', lead: { label: '운영본부', text: '해피 패밀리 데이 · 피플팀' }, branches: [
      { label: 'Zone A', head: '등록·안내', text: '로비 등록 데스크와 웰컴 키트' },
      { label: 'Zone B', head: '체험 부스', text: '포토존·플레이존·만들기 부스' },
      { label: 'Zone C', head: '안전·지원', text: '안전 요원과 주차·시설 지원' }
    ] },
    highlight: { type: 'highlight', title: '올해의\n세 가지 변화', items: [
      { head: '하루 종일\n운영', text: '오후 반일에서 하루 종일로 — 여유 있게 즐기는 하루가 됩니다' },
      { head: '부스 12개로\n확대', text: '체험 부스를 두 배로 늘려 연령별 프로그램을 준비했습니다' },
      { head: '연령별 맞춤\n기념품', text: '공통 1종에서 연령별 맞춤 구성으로 바뀝니다' }
    ], footnote: '작년 참여 가족 설문을 반영한 변화입니다' },
    board: { type: 'board', title: '두 가지 축으로\n준비합니다', cards: [
      { tag: 'Family', head: '가족이 주인공인\n하루', text: '체험 부스와 기념 선물, 일터 소개까지 — 가족 중심의 프로그램' },
      { tag: 'Safety', head: '안심하고 즐기는\n공간', text: '안전 요원 상주와 연령별 보호자 동반 안내' }
    ], side: { title: '한눈에 보기', items: ['5월 22일 금요일 13시', '판교 사옥 1층 로비·대강당', '전 임직원 및 가족'], pills: ['사전 신청', '주차 지원', '기념 선물'] } },
    list: { type: 'list', title: '참여 방법\n네 단계', rows: [
      { label: '사전 신청', sub: '사내 공지 링크에서 가족 인원 입력' },
      { label: '확정 안내', sub: '문자로 확정·주차 안내 수신' },
      { label: '당일 등록', sub: '로비 등록 데스크에서 웰컴 키트 수령' },
      { label: '체험·추첨', sub: '부스 체험 후 경품 추첨 참여' }
    ] },
    word: { type: 'word', text: '고마워요', caption: '함께해 준 모든 가족에게 전하는 마음' },
    statement: { type: 'statement', title: '하루의 즐거움이\n일 년의 힘이 됩니다', sub: '가족과 함께하는 해피 패밀리 데이' },
    hero: { type: 'hero', title: 'HAPPY\nFAMILY DAY', sub: '2026. 05. 22 FRI · 판교 사옥' },
    quote: { type: 'quote', text: '일하는 자리가\n**가족의 자랑**이 되도록.', by: 'Happy Family Day' },
    agenda: { type: 'agenda', title: 'AGENDA', rows: [{ part: '1부', head: '환영 인사와 행사 안내', who: '피플팀' }, { part: '2부', head: '가족과 함께하는 체험 프로그램', who: '운영 스태프' }, { part: '3부', head: '경품 추첨과 마무리', who: '피플팀' }] },
    sidebar: { type: 'sidebar', title: '함께하는\n하루의 의미', lead: '가족이 일터를 만나면,\n회사는 더 가까운 곳이 됩니다.', text: '해피 패밀리 데이는 임직원 가족을 회사로 초대하는 날입니다.\n아이들에게는 부모의 일터를 보여주고,\n가족에게는 회사의 감사를 전합니다.' },
    screen: { type: 'screen', year: '2026년', title: '행사장\n미리 보기', points: ['1층 로비 — 등록·웰컴 키트', '대강당 — 환영 인사·경품 추첨', '체험존 — 만들기·놀이 부스'] },
    note: { type: 'note', title: '운영 안내', head: '참여 전에\n확인해 주세요', text: '행사 당일 로비 등록 데스크에서 가족 확인 후 입장합니다.\n어린이는 보호자와 동반해 주세요.\n주차권은 등록 시 함께 배부됩니다.' },
    circles: { type: 'circles', title: '작년, 이만큼 함께했어요', sub: '2025 해피 패밀리 데이 결과', items: [{ tag: 'A. 참여 가족', value: '106', label: '가족' }, { tag: 'B. 만족도', value: '4.8', label: '5점 만점' }, { tag: 'C. 재참여 의사', value: '92%', label: '설문 기준' }] },
    closing: { type: 'closing', title: '5월 22일,\n가족과 함께 만나요', sub: '마이다스 해피패밀리데이', contact: '문의 · 피플팀' }
  };

  var SCHEMA_DOC = CATALOG.map(function (c) { return c.type + '(' + c.label + '): ' + c.use; }).join('\n');
  var FIELD_DOC =
    'cover:{title(행사명, \\n 2줄),sub?(국문 부제),date?(일시),variant?:"pill"(2026 필 기하 — kicker?=좌상 라벨, 타이틀 좌중 대형)|"pill2"(타이틀 좌상)} | ' +
    'greeting:{label?,text(인사 문장, **강조**, \\n 줄바꿈),by?(주최명)} | ' +
    'toc:{title?,items:[{no?,label(파트명),desc?(한 줄),pages?}](2~4개),variant?:"panel"(좌 컬러면+우 라운드 패널 목차 — 최대 6개, foot?=좌하 문서명 \\n)} | ' +
    'divider:{no?:"01",title(파트 제목),lead?(한 문장),variant?:"pill"(2026 필 기하 — 딥 지면+상하 2필, 타이틀 \\n 3~4줄)|"pill2"(3필 스택)} | ' +
    'section:{title(\\n 2줄 가능),points:[{no?,head,text}](2~4개),sub?} | ' +
    'cards:{title,cards:[{tag?,head,text?,tone?:"dark"(딥 셀)}](2~4개),sub?} | ' +
    'timeline:{title,items:[{when:"13:00",head,text?,on?:true(틴트 강조)}](3~6개),sub?} | ' +
    'table:{title,columns:[str],rows:[{cells:[str]}],sub?} | ' +
    'checklist:{title,items:[str],cols?:1~2,sub?} | ' +
    'media:{title,specs:[{label(짧은 영문),text,on?:true(딥 강조 행)}](3~5개),image?:{label},caption?,sub?} | ' +
    'photos:{variant?:"wide|grid|frame|side|quad|frame3"(기본 wide — quad=좌 사이드바+2×2 도트 캡션, frame3=딥 지면+화이트 프레임 3),year?(연도 칩 "2026년"),title(캡션 밴드 타이틀 \\n 2줄),caption?(우측 캡션 \\n 2~3줄),foot?(우하단 소라벨),items:[{label,caption?(quad 셀 캡션)}](wide·frame 1개, grid·frame3 3개, quad 4개)} | ' +
    'stats:{title,donut?:{pct:0~100,label?,caption?},bars?:[{label,pct:0~100,value?,on?:true(틴트 강조 행),text?}](2~4개),sub?} | ' +
    'kpi:{title,items:[{value,label,desc?,tone?:"on"(딥 카드)}](2~4개),variant?:"badge"(넘버 뱃지+대형 수치 센터 카드),sub?} | ' +
    'process:{title,steps:[{tag:"STEP 1"류,head,text?}](3~4개),accent?:강조 인덱스(기본 중앙),sub?} | ' +
    'compare:{title,items:[{head:"작년|올해"류,items:[str]}](2개),sub?} | ' +
    'roadmap:{title,steps:[{when:"Now|Next|Then",head,items:[str],state?:"now"}](3개),sub?} | ' +
    'milestone:{title,phases?:[{tag,head,text?,on?:true}](2~3),bars:[{label,sub?,start:1~축개수,span:칸수}](3~5 시간순 계단),axis:[구간 라벨 4~6]} | ' +
    'split:{title?,left:{kicker,items:[str]},right:{kicker,items:[str]},sub?} — 좌 흐림/우 강조 | ' +
    'bigstat:{title,value,caption?(**강조**)} | ' +
    'duo:{title,items:[{value(대형 수치/문구),label,text?,chips?:[str],tone?:"on"(딥)}](2개),sub?} | ' +
    'flow:{title,from:{head,items:[{k,v}|str]},to:[{head,items:[{k,v}|str],tone?:"on"}](1~2개),foot?,sub?} | ' +
    'hsteps:{title,steps:[{when(날짜/시각),head,text?}](4~6개),sub?} | ' +
    'profile:{title,cards:[{badge?,kicker?(짧은 영문),head,points:[str],focus?:{label,items:[str]},foot?}](2~3개),sub?} | ' +
    'band:{title,lead(밴드 선언 \\n 2줄),points?:[{head,text}](2~3개),cards:[{head,text?,tone?:"on"}](3~5개),sub?} | ' +
    'halfimg:{head(\\n 2줄),lead?,text?(\\n\\n 문단)}(이미지는 사용자 업로드 — 창작 금지) | ' +
    'chart:{title,bars:[{x(축 라벨),v(숫자),label?(표시값),on?:true}](3~8개, 브리프에 있는 수치만·창작 금지),notes?:[{head,text}](2~4개),badge?,unit?,sub?,variant?:"waterfall"(계단 누적 — total:{x,v,label?} 합계 딥 바, vs:{x,v,label?,gap?(GAP 칩)} 비교 컬럼)} | ' +
    'cycle:{center(중앙 허브 \\n 2줄),top:{head,text?},bottom:{head,text?},left?:{head,text?}|str(짧은 라벨),right?:{head,text?}|str,topLabel?,bottomLabel?,title?} | ' +
    'matrix:{title,rows:[{tag(대형 이니셜/2자 키워드),label(보조 라벨),sub?,groups:[{head,items:[str 2~4개]}](1~3개)}](2~3개),sub?} | ' +
    'triple:{title,cols:[{head(헤더 밴드),lead?(중앙 리드 \\n·**강조**),items?:[str],foot?(**강조** 결론),tone?:"on"(강조 열)}](3개),sub?} | ' +
    'quad:{center:{label(중앙 원 라벨 \\n),head(강조 키워드)},cells:[{head,items:[str 2~3개]}](4개),title?} | ' +
    'org:{top:{head,cap?("(신설)"류),label?(구분 소라벨),band?(풀폭 딥 밴드명),items:[str 2~4 칩]},bottom:{head,items:[str 2~4 박스]},title?} | ' +
    'lineup:{title,items:[{tag?(짧은 영문),head(이름),text?,badge?(상태 라벨),state?:"dim"(후보 흐림)|"on"}](3~5개, 첫 항목 자동 강조),sub?} | ' +
    'branch:{title,lead:{label?,text(중앙 리드)},branches:[{label?(짧은 영문),head,text?}](2~4개),sub?} | ' +
    'highlight:{title,items:[{no?,head(\\n 2줄 임팩트),text?}](2~3개),footnote?(우하단 각주),sub?} | ' +
    'board:{title,cards:[{tag?,head(\\n 2줄),text?}](2개),side?:{title?,items:[str],pills?:[str]},sub?} | ' +
    'list:{title,rows:[{label,sub?}](2~5개),accent?:강조 행 인덱스(기본 0),sub?} | ' +
    'dash:{title,cards:[{label,value(수치),unit?,chart?:{kind:"bars"|"donut"|"area"|"gauge",v?:[숫자],pct?:숫자},text?}](3~4개, 수치는 브리프에 있는 것만),strip?:[{label,value}](1~3개),sub?} | ' +
    'word:{text(2~6자 대형 단어),caption?(한 줄)} | ' +
    'statement:{title(중앙 대형 문장, \\n 2줄),sub?(한 줄),variant?:"frame"(그린 프레임 보더 — text?=센터 문단 \\n 여러 줄)} | ' +
    'agenda:{title?(기본 AGENDA),rows:[{part?("1부"류 뱃지),head(발표 제목),who?(발표자 | 소속, \\n 여러 명)}](2~4개)} | ' +
    'sidebar:{title(사이드바 제목 \\n 2줄),lead?(볼드 리드 \\n 2줄),text(문단 \\n 줄바꿈),variant?:"num"(절반 사이드바+대형 숫자),no?("1")} | ' +
    'screen:{title(좌 타이틀 \\n 2줄),year?(뱃지 "2025년"),points?:[str](리스트 2~5개)}(우측 대형 패널 이미지는 사용자 업로드 — 창작 금지) | ' +
    'note:{title(한 줄 제목),head?(좌 소제목 \\n),text(우 문단 \\n 줄바꿈),variant?:"band"(상단 밴드형)} | ' +
    'circles:{title,sub?,items:[{tag?("A. 목표"류),value(대형 수치 — 브리프에 있는 것만·창작 금지),label?}](2~3개)} | ' +
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
