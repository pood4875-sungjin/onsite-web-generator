/* charts.js — 공통 차트 자산. classic <script src>. PPT·웹·eDM 어느 팩에서든 같은 함수로 호출한다.
   출처: Figma "웹 제너레이터" > Infographic slides 20장(31:4034~31:4477) + 스탯 카드 모음(31:2771 — gauge·ring).
   ※ 새 차트를 쌓는 곳은 여기 하나 — T에 렌더러, CATALOG에 "언제 쓰나", chart-inspector.html의 SAMPLES에 샘플 데이터,
     그리고 AI 스키마 3곳(worker.js chart 문서 2줄 · packs.pitch.js FIELD_DOC)에 타입을 등록하면 끝. 열람은 chart-inspector.html.

   설계 원칙
   1) 출력은 **순수 SVG**(스크립트·캔버스 없음) — PPTX 내보내기·PDF 인쇄·새창 미리보기에서 그대로 살아남는다.
   2) 색은 **호출한 팩의 토큰을 상속** — var(--pg,...) 폴백 체인. 차트가 자기 색을 고집하면 팩마다 이물감이 생긴다.
   3) 값 → 길이는 **비례로 계산**한다. 원본 시안은 막대 높이와 라벨 값이 비례하지 않는 목업이었고(예: 2M→203px, 37M→654px),
      축·눈금·그리드·범례도 20장 전부 없었다. 축/그리드는 옵션으로 두되 기본은 원본대로 끈다.
   4) 편집 훅 data-edit — 값/라벨은 studio에서 클릭 수정 가능(경로: <path>.series.0.values.2 / <path>.categories.1).

   데이터 계약
   { type:'bar'|'area'|'line'|'donut'|'pie'|'bubble'|'concentric'|'arc'|'pyramid'|'venn',
     categories:[문자열...], series:[{name, values:[숫자...]}],
     emphasis:정수|null,        // 강조할 인덱스 (원본은 항상 파랑 #4677FF가 "최댓값/주목" 역할)
     format:{prefix,suffix,decimals}, axis:false, grid:false, legend:false, size:{w,h} } */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function fmt(v, f) {
    f = f || {};
    if (typeof v === 'string' && /[^0-9.\-\s]/.test(v)) return v;      // 이미 "1.2M"처럼 서식이 있으면 그대로
    var n = num(v), d = f.decimals == null ? 0 : f.decimals;
    return (f.prefix || '') + n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (f.suffix || '');
  }
  // 계열/항목 색 — 팩 토큰 우선, 없으면 원본 팔레트. 강조 인덱스만 파랑.
  var BASE = ['var(--pg,#39B966)', 'var(--pg2,#52B788)', 'var(--pg4,#498467)', 'var(--pg3,#9CDCB2)'];
  function color(i, emph) { return (emph != null && i === emph) ? 'var(--pblue,#4677FF)' : BASE[i % BASE.length]; }
  function vals(spec) { return ((spec.series && spec.series[0] && spec.series[0].values) || []).map(num); }
  function size(spec, dw, dh) { var s = spec.size || {}; return { w: +s.w || dw, h: +s.h || dh }; }
  function svg(w, h, inner, cls) {
    return '<svg class="cht ' + (cls || '') + '" viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" ' +
      'preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">' + inner + '</svg>';
  }
  function txt(x, y, s, cls, path, anchor) {
    return '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="' + (anchor || 'middle') + '"' + de(path) + '>' + esc(s) + '</text>';
  }
  // 극좌표 → 직교 (12시 기준 시계방향)
  function pol(cx, cy, r, deg) { var a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arcPath(cx, cy, rOut, rIn, a0, a1) {
    var large = (a1 - a0) > 180 ? 1 : 0;
    var p0 = pol(cx, cy, rOut, a0), p1 = pol(cx, cy, rOut, a1), p2 = pol(cx, cy, rIn, a1), p3 = pol(cx, cy, rIn, a0);
    return 'M' + p0[0] + ' ' + p0[1] + 'A' + rOut + ' ' + rOut + ' 0 ' + large + ' 1 ' + p1[0] + ' ' + p1[1] +
      'L' + p2[0] + ' ' + p2[1] + 'A' + rIn + ' ' + rIn + ' 0 ' + large + ' 0 ' + p3[0] + ' ' + p3[1] + 'Z';
  }

  var T = {
    /* 세로 막대 — 항목별 값 비교. 원본 31:4203/31:4445 */
    bar: function (sp, P) {
      var d = size(sp, 800, 380), v = vals(sp), cats = sp.categories || [];
      var max = Math.max.apply(null, v.concat([1])), padB = cats.length ? 46 : 12, padT = 34;
      var n = v.length || 1, gap = 26, bw = Math.max(18, (d.w - gap * (n - 1)) / n), r = 13;
      var base = d.h - padB, plot = base - padT;
      var g = v.map(function (val, i) {
        var hgt = Math.max(6, (val / max) * plot), x = i * (bw + gap), y = base - hgt;
        var inBar = hgt > 64;                                  // 막대가 짧으면 값이 안 들어가니 위로 뺀다
        return '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + hgt + '" rx="' + r + '" fill="' + color(i, sp.emphasis) + '"/>' +
          txt(x + bw / 2, inBar ? y + 44 : y - 12, fmt(val, sp.format), 'cht-v' + (inBar ? ' on' : ''), P && P + '.series.0.values.' + i) +
          (cats[i] ? txt(x + bw / 2, d.h - 12, cats[i], 'cht-c', P && P + '.categories.' + i) : '');
      }).join('');
      return svg(d.w, d.h, (sp.axis ? '<line x1="0" y1="' + base + '" x2="' + d.w + '" y2="' + base + '" class="cht-ax"/>' : '') + g, 'cht-bar');
    },
    /* 에어리어/라인 — 시간에 따른 추이. 원본 31:4369(축·그리드 없음, 값 라벨만) */
    area: function (sp, P) { return lineLike(sp, P, true); },
    line: function (sp, P) { return lineLike(sp, P, false); },
    /* 반원 게이지 — 목표 대비 수준 하나를 크게(점수·달성률). 원본 31:2771 스탯 카드 모음.
       값 = series.0.values.0, 상한 = max(기본 100). 라벨 = categories.0 */
    gauge: function (sp, P) {
      var d = size(sp, 460, 300), v = vals(sp);
      var val = v[0] || 0, max = num(sp.max) || Math.max(100, val);
      var ratio = Math.max(0, Math.min(1, val / max));
      var cx = d.w / 2, cy = d.h - 56, r = Math.min(d.w / 2 - 40, d.h - 96), sw = 26;
      var main = sp.emphasis != null ? 'var(--pblue,#4677FF)' : 'var(--pg,#39B966)';
      var pL = pol(cx, cy, r, 270), pR = pol(cx, cy, r, 90), pV = pol(cx, cy, r, 270 + 180 * ratio);
      var track = '<path d="M' + pL[0] + ' ' + pL[1] + ' A' + r + ' ' + r + ' 0 0 1 ' + pR[0] + ' ' + pR[1] + '" fill="none" stroke="var(--grey,#F1F1F1)" stroke-width="' + sw + '" stroke-linecap="round"/>';
      var arc = ratio <= 0 ? '' : '<path d="M' + pL[0] + ' ' + pL[1] + ' A' + r + ' ' + r + ' 0 0 1 ' + pV[0] + ' ' + pV[1] + '" fill="none" stroke="' + main + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
      var lab = (sp.categories && sp.categories[0]) ? txt(cx, cy + 6, sp.categories[0], 'cht-c', P && P + '.categories.0') : '';
      return svg(d.w, d.h, track + arc + txt(cx, cy - 28, fmt(val, sp.format), 'cht-v g', P && P + '.series.0.values.0') + lab, 'cht-gauge');
    },
    /* 진행 링 — 진행률·비중 하나를 %로 크게. 원본 31:2771 스탯 카드 모음 */
    ring: function (sp, P) {
      var d = size(sp, 380, 380), v = vals(sp);
      var val = v[0] || 0, max = num(sp.max) || 100;
      var ratio = Math.max(0, Math.min(1, val / max));
      var cx = d.w / 2, cy = d.h / 2, r = Math.min(d.w, d.h) / 2 - 36, sw = 30;
      var main = sp.emphasis != null ? 'var(--pblue,#4677FF)' : 'var(--pg,#39B966)';
      var track = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--grey,#F1F1F1)" stroke-width="' + sw + '"/>';
      var arc = '';
      if (ratio >= 1) arc = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + main + '" stroke-width="' + sw + '"/>';
      else if (ratio > 0) {
        var p0 = pol(cx, cy, r, 0), p1 = pol(cx, cy, r, 360 * ratio);
        arc = '<path d="M' + p0[0] + ' ' + p0[1] + ' A' + r + ' ' + r + ' 0 ' + (ratio > 0.5 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1] + '" fill="none" stroke="' + main + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
      }
      var lab = (sp.categories && sp.categories[0]) ? txt(cx, cy + 52, sp.categories[0], 'cht-c', P && P + '.categories.0') : '';
      return svg(d.w, d.h, track + arc + txt(cx, cy + (lab ? 10 : 22), fmt(val, sp.format), 'cht-v gx', P && P + '.series.0.values.0') + lab, 'cht-ring');
    },
    /* 도넛 — 구성비. 원본 31:4148 (외350/내140 → hole 0.4, 세그먼트 사이 #EEE 갭) */
    donut: function (sp, P) {
      var d = size(sp, 460, 380), v = vals(sp), cats = sp.categories || [];
      var cx = d.w / 2, cy = d.h / 2, rO = Math.min(d.w, d.h) / 2 - 12, rI = rO * 0.4;
      var tot = v.reduce(function (a, b) { return a + b; }, 0) || 1, acc = 0;
      var segs = v.map(function (val, i) {
        var a0 = acc / tot * 360, a1 = (acc + val) / tot * 360; acc += val;
        var mid = (a0 + a1) / 2, lp = pol(cx, cy, (rO + rI) / 2, mid);
        return '<path d="' + arcPath(cx, cy, rO, rI, a0, a1) + '" fill="' + color(i, sp.emphasis) + '" class="cht-seg"/>' +
          txt(lp[0], lp[1] + 8, Math.round(val / tot * 100) + '%', 'cht-v on', P && P + '.series.0.values.' + i);
      }).join('');
      var leg = cats.length ? cats.map(function (c, i) {
        return '<g transform="translate(0,' + (i * 26) + ')"><rect x="0" y="0" width="14" height="14" rx="4" fill="' + color(i, sp.emphasis) + '"/>' +
          txt(22, 12, c, 'cht-c', P && P + '.categories.' + i, 'start') + '</g>';
      }).join('') : '';
      return svg(d.w + (leg ? 200 : 0), d.h, segs + (leg ? '<g transform="translate(' + (d.w + 20) + ',' + (d.h / 2 - cats.length * 13) + ')">' + leg + '</g>' : ''), 'cht-donut');
    },
    /* 파이 — 한 조각만 강조해 돌출. 원본 31:4123 */
    pie: function (sp, P) {
      var d = size(sp, 420, 380), v = vals(sp);
      var cx = d.w / 2, cy = d.h / 2, r = Math.min(d.w, d.h) / 2 - 24;
      var tot = v.reduce(function (a, b) { return a + b; }, 0) || 1, acc = 0, em = sp.emphasis == null ? 0 : sp.emphasis;
      var segs = v.map(function (val, i) {
        var a0 = acc / tot * 360, a1 = (acc + val) / tot * 360; acc += val;
        var mid = (a0 + a1) / 2, out = (i === em) ? 14 : 0, off = pol(0, 0, out, mid);
        var rr = (i === em) ? r + 12 : r, lp = pol(cx + off[0], cy + off[1], rr * 0.62, mid);
        return '<g transform="translate(' + off[0] + ',' + off[1] + ')"><path d="' + arcPath(cx, cy, rr, 0, a0, a1) + '" fill="' + color(i, sp.emphasis) + '"/></g>' +
          txt(lp[0], lp[1] + 8, fmt(val, sp.format), 'cht-v on', P && P + '.series.0.values.' + i);
      }).join('');
      return svg(d.w, d.h, segs, 'cht-pie');
    },
    /* 버블 — 면적으로 규모 비교(반지름은 √값). 원본 31:4076/31:4131 */
    bubble: function (sp, P) {
      var d = size(sp, 800, 380), v = vals(sp), cats = sp.categories || [];
      var max = Math.max.apply(null, v.concat([1])), n = v.length || 1;
      var slot = d.w / n, rMax = Math.min(slot / 2 - 12, d.h / 2 - 44);
      var g = v.map(function (val, i) {
        var r = Math.max(18, Math.sqrt(val / max) * rMax), cx = slot * i + slot / 2, cy = d.h / 2 - 16;
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color(i, sp.emphasis) + '" class="cht-bub"/>' +
          txt(cx, cy + 12, fmt(val, sp.format), 'cht-v on lg', P && P + '.series.0.values.' + i) +
          (cats[i] ? txt(cx, d.h - 10, cats[i], 'cht-c', P && P + '.categories.' + i) : '');
      }).join('');
      return svg(d.w, d.h, g, 'cht-bubble');
    },
    /* 동심원 — 전체 대비 부분(중첩 비율). 바닥선을 공유해 쌓인 것처럼 보인다. 원본 31:4034 */
    concentric: function (sp, P) {
      var d = size(sp, 460, 380), v = vals(sp).slice().sort(function (a, b) { return b - a; });
      var max = Math.max.apply(null, v.concat([1])), cx = d.w / 2, base = d.h - 16, rMax = Math.min(d.w, d.h * 2) / 2 - 20;
      var g = v.map(function (val, i) {
        var r = Math.max(20, Math.sqrt(val / max) * rMax);
        // 라벨은 각 원의 정수리 바로 아래 — 큰 원이 작은 원을 덮으므로 이 위치라야 전부 읽힌다
        return '<circle cx="' + cx + '" cy="' + (base - r) + '" r="' + r + '" fill="' + color(i, sp.emphasis) + '" opacity="' + (1 - i * 0.18) + '"/>' +
          txt(cx, base - r * 2 + 30, fmt(val, sp.format), 'cht-v on', P && P + '.series.0.values.' + i);
      }).join('');
      return svg(d.w, d.h, g, 'cht-conc');
    },
    /* 반원 아치 — 누적 규모를 아치 굵기로. 원본 31:4056 (링 두께 45 고정) */
    arc: function (sp, P) {
      var d = size(sp, 640, 380), v = vals(sp), cats = sp.categories || [];
      var max = Math.max.apply(null, v.concat([1])), cx = d.w / 2, base = d.h - (cats.length ? 44 : 12);
      var th = 44, rMax = Math.min(cx - 12, base - 40);
      // 값 내림차순으로 바깥→안쪽. 비례 반지름이 겹치면 최소 간격(th+12)을 강제해 라벨이 붙어버리는 걸 막는다
      var order = v.map(function (x, i) { return { v: x, i: i }; }).sort(function (a, b) { return b.v - a.v; });
      var prev = Infinity;
      var g = order.map(function (o, k) {
        var val = o.v, i = o.i;
        var rO = Math.max(th + 8, (val / max) * rMax);
        if (rO > prev - (th + 12)) rO = Math.max(th + 8, prev - (th + 12));
        prev = rO;
        var rI = rO - th;
        return '<path d="' + arcPath(cx, base, rO, rI, -90, 90) + '" fill="' + color(i, sp.emphasis) + '" opacity=".82"/>' +
          txt(cx, base - rO + 21, fmt(val, sp.format), 'cht-v on', P && P + '.series.0.values.' + i) +
          (cats[i] ? txt(cx, base - rO + 21 + 15, cats[i], 'cht-c inv', P && P + '.categories.' + i) : '');
      }).join('');
      return svg(d.w, d.h, g, 'cht-arc');
    },
    /* 피라미드/퍼널 — 단계별 감소(전환). 원본 31:4097 */
    pyramid: function (sp, P) {
      var d = size(sp, 560, 380), cats0 = sp.categories || [];
      // 퍼널은 위에서 아래로 줄어드는 흐름 — 값이 오름차순으로 들어와도 내림차순으로 세운다(라벨도 함께 이동)
      var pair = vals(sp).map(function (x, i) { return { v: x, c: cats0[i], i: i }; }).sort(function (a, b) { return b.v - a.v; });
      var v = pair.map(function (x) { return x.v; }), cats = pair.map(function (x) { return x.c; });
      var idx = pair.map(function (x) { return x.i; });
      var n = v.length || 1, gap = 10, bh = (d.h - gap * (n - 1)) / n, max = Math.max.apply(null, v.concat([1]));
      var g = v.map(function (val, i) {
        // 퍼널: 위가 넓고(가장 큰 값) 아래로 갈수록 좁아진다 — 값 내림차순과 폭이 같은 방향이어야 읽힌다
        var wTop = (n - i) / n * d.w * 0.98, wBot = (n - i - 1) / n * d.w * 0.98 + d.w * 0.12;
        wTop = Math.min(wTop, d.w); wBot = Math.min(wBot, d.w);
        var y = i * (bh + gap), cx = d.w / 2;
        var pts = [cx - wTop / 2, y, cx + wTop / 2, y, cx + wBot / 2, y + bh, cx - wBot / 2, y + bh];
        return '<polygon points="' + pts.join(' ') + '" fill="' + color(i, sp.emphasis) + '" opacity="' + (1 - i * 0.18) + '"/>' +
          txt(cx, y + bh / 2 + 8, fmt(val, sp.format), 'cht-v on', P && P + '.series.0.values.' + idx[i]) +
          (cats[i] ? txt(cx + wBot / 2 + 12, y + bh / 2 + 6, cats[i], 'cht-c', P && P + '.categories.' + idx[i], 'start') : '');
      }).join('');
      return svg(d.w + 180, d.h, g, 'cht-pyr');
    },
    /* 벤 — 두 집합의 겹침. 원본 31:4162 (교집합만 진한 색) */
    venn: function (sp, P) {
      var d = size(sp, 620, 380), v = vals(sp), cats = sp.categories || [];
      var r = Math.min(d.h / 2 - 10, d.w / 3.2), cy = d.h / 2, cx1 = d.w / 2 - r * 0.55, cx2 = d.w / 2 + r * 0.55;
      var inner = '<defs><clipPath id="vnA"><circle cx="' + cx1 + '" cy="' + cy + '" r="' + r + '"/></clipPath></defs>' +
        '<circle cx="' + cx1 + '" cy="' + cy + '" r="' + r + '" fill="' + color(0) + '" opacity=".96"/>' +
        '<circle cx="' + cx2 + '" cy="' + cy + '" r="' + r + '" fill="' + color(1) + '" opacity=".85"/>' +
        '<g clip-path="url(#vnA)"><circle cx="' + cx2 + '" cy="' + cy + '" r="' + r + '" fill="var(--pg4,#498467)"/></g>' +
        txt(cx1 - r * 0.42, cy + 12, fmt(v[0], sp.format), 'cht-v on lg', P && P + '.series.0.values.0') +
        txt(cx2 + r * 0.42, cy + 12, fmt(v[1], sp.format), 'cht-v on lg', P && P + '.series.0.values.1') +
        (v.length > 2 ? txt(d.w / 2, cy + 12, fmt(v[2], sp.format), 'cht-v on lg', P && P + '.series.0.values.2') : '') +
        (cats[0] ? txt(cx1 - r * 0.42, cy + 38, cats[0], 'cht-c inv', P && P + '.categories.0') : '') +
        (cats[1] ? txt(cx2 + r * 0.42, cy + 38, cats[1], 'cht-c inv', P && P + '.categories.1') : '');
      return svg(d.w, d.h, inner, 'cht-venn');
    },
  };

  function lineLike(sp, P, fill) {
    var d = size(sp, 800, 340), v = vals(sp), cats = sp.categories || [];
    var max = Math.max.apply(null, v.concat([1])), min = Math.min.apply(null, v.concat([0]));
    var padB = cats.length ? 40 : 10, padT = 34, base = d.h - padB, plot = base - padT;
    var n = v.length || 1, step = n > 1 ? d.w / (n - 1) : d.w;
    var pts = v.map(function (val, i) { return [i * step, base - ((val - min) / (max - min || 1)) * plot]; });
    var poly = pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ');
    var stroke = '<path d="M ' + poly + '" fill="none" stroke="var(--pg,#39B966)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>';
    var areaP = fill ? '<path d="M 0 ' + base + ' L ' + poly + ' L ' + (pts[pts.length - 1] || [0, 0])[0] + ' ' + base + ' Z" fill="url(#chGrad)"/>' : '';
    var defs = fill ? '<defs><linearGradient id="chGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="var(--pg2,#52B788)" stop-opacity=".55"/><stop offset="100%" stop-color="var(--pg,#39B966)" stop-opacity=".05"/></linearGradient></defs>' : '';
    var dots = pts.map(function (p, i) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="var(--pg,#39B966)" stroke="#fff" stroke-width="2"/>' +
        txt(p[0], p[1] - 16, fmt(v[i], sp.format), 'cht-v', P && P + '.series.0.values.' + i) +
        (cats[i] ? txt(p[0], d.h - 10, cats[i], 'cht-c', P && P + '.categories.' + i) : '');
    }).join('');
    return svg(d.w, d.h, defs + areaP + stroke + dots, fill ? 'cht-area' : 'cht-line');
  }

  /* 차트 카탈로그 — "언제 쓰나"가 계약의 일부. AI가 브리프를 읽고 차트 종류를 고를 때 이 설명을 그대로 쓴다. */
  var CATALOG = [
    { type: 'bar', label: '세로 막대', use: '항목끼리 값을 비교할 때(매출·건수·점수). 카테고리 3~6개', needs: ['categories', 'series'] },
    { type: 'area', label: '에어리어', use: '시간에 따른 성장·추이를 면적으로 강조할 때', needs: ['categories', 'series'] },
    { type: 'line', label: '라인', use: '시간에 따른 변화를 선으로만 담백하게 보여줄 때', needs: ['categories', 'series'] },
    { type: 'donut', label: '도넛', use: '전체를 100%로 두고 구성비를 나눌 때(2~4조각)', needs: ['categories', 'series'] },
    { type: 'pie', label: '파이', use: '한 조각을 돌출시켜 점유율 하나를 강조할 때', needs: ['series'] },
    { type: 'bubble', label: '버블', use: '규모 차이를 면적으로 직관적으로 비교할 때(시장·투자금)', needs: ['series'] },
    { type: 'concentric', label: '동심원', use: 'TAM·SAM·SOM처럼 큰 것 안에 작은 것이 들어가는 포함 관계', needs: ['series'] },
    { type: 'arc', label: '반원 아치', use: '누적 규모를 아치 크기로 비교할 때(연도별 누적)', needs: ['series'] },
    { type: 'pyramid', label: '피라미드·퍼널', use: '단계별로 줄어드는 전환 흐름(유입→가입→결제)', needs: ['series'] },
    { type: 'venn', label: '벤 다이어그램', use: '두 집단의 겹치는 영역을 보여줄 때', needs: ['series'] },
    { type: 'gauge', label: '반원 게이지', use: '목표 대비 달성 수준·점수 하나를 강조할 때(달성률·만족도). max로 상한 지정', needs: ['series'] },
    { type: 'ring', label: '진행 링', use: '진행률·비중 하나를 %로 크게 보여줄 때(진척도·완료율). max 기본 100', needs: ['series'] },
  ];

  function css() {
    return '.cht{display:block;max-width:100%}' +
      '.cht text{font-family:var(--font,"Pretendard",system-ui,sans-serif);fill:var(--ink,#181918)}' +
      '.cht-v{font-size:24px;font-weight:600;letter-spacing:-.02em}' +
      '.cht-v.on{fill:#fff}.cht-v.lg{font-size:34px}.cht-v.g{font-size:58px;font-weight:700;letter-spacing:-.03em;text-anchor:middle}' +
      '.cht-v.gx{font-size:76px;font-weight:700;letter-spacing:-.03em;text-anchor:middle}' +
      '.cht-c{font-size:14px;fill:var(--ink,#181918);opacity:.75}.cht-c.inv{fill:#fff;opacity:.9}' +
      '.cht-ax{stroke:var(--pg2,#52B788);stroke-width:2}' +
      '.cht-seg{stroke:var(--line,#EEEEEE);stroke-width:6}';
  }

  function render(spec, opts) {
    if (!spec || !spec.type) return '';
    opts = opts || {};
    var fn = T[spec.type] || T.bar;
    try { return fn(spec, opts.path || ''); } catch (e) { return ''; }
  }

  window.Charts = { render: render, css: css, CATALOG: CATALOG, TYPES: Object.keys(T) };
})();
