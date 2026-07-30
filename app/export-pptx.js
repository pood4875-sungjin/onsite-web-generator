/* export-pptx.js — PPT 덱(iframe 내 .ppt-stack > .slide)을 PowerPoint(.pptx)로 내보내기.
   출처: ~/ppt-template/js/export-pptx.js 포팅. iframe 문서 대상으로 동작하게 수정.
   window.exportPptx(doc, onProgress?) — doc = 덱이 렌더된 document(스튜디오 frame.contentDocument).
   PptxGenJS로 각 요소 좌표/폰트/색 읽어 편집 가능한 텍스트 상자·도형 생성. CDN 지연 로드. */
(function () {
  var PT = 0.75, IN = 1 / 96;
  function loadScript(src) {
    return new Promise(function (res, rej) {
      if ([].slice.call(document.scripts).some(function (s) { return s.src === src; })) return res();
      var el = document.createElement('script'); el.src = src; el.onload = function () { res(); }; el.onerror = function () { rej(new Error('script load fail: ' + src)); }; document.head.appendChild(el);
    });
  }
  function parseColor(str) { if (!str || str === 'transparent' || str === 'none') return { r: 0, g: 0, b: 0, a: 0 }; var m = str.match(/rgba?\(([^)]+)\)/); if (!m) return { r: 0, g: 0, b: 0, a: 1 }; var p = m[1].split(',').map(function (x) { return parseFloat(x.trim()); }); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
  function blend(fg, bg) { var a = fg.a; return { r: Math.round(fg.r * a + bg.r * (1 - a)), g: Math.round(fg.g * a + bg.g * (1 - a)), b: Math.round(fg.b * a + bg.b * (1 - a)), a: 1 }; }
  function hex(c) { function h(n) { return ('0' + Math.max(0, Math.min(255, n)).toString(16)).slice(-2).toUpperCase(); } return h(c.r) + h(c.g) + h(c.b); }
  function fontFamily(cs) { var f = (cs.fontFamily || '').split(',')[0].replace(/["']/g, '').trim(); return f || 'Pretendard'; }

  var TEXT_SEL = ['.meta-k', '.meta-v', '.eyebrow', '.cover-title', '.cover-sub', '.s-title', '.s-index', '.row-num', '.row-label', '.row-desc', '.block-sub', '.block-p', '.bignum', '.agenda-title', '.agenda-label', '.agenda-badge', '.contact-k', '.contact-v', '.contact-email', '.contact-title',
    /* pitch 팩 */ '.p-eyebrow', '.p-title', '.p-lead', '.p-body', '.p-note', '.st-title', '.st-sub', '.qt-text', '.qt-by', '.qt-num', '.qt-lab', '.qt-stars', '.g-head', '.g-role', '.g-text', '.s-num', '.s-lab', '.sp-num', '.sp-lab', '.bs-num', '.bs-cap', '.l-num', '.l-body', '.st-badge', '.g-arrow', '.pr-name', '.pr-price', '.pr-per', '.tl-when', '.p-c-head', '.p-c-text', '.mx-lab', '.mx-axl', '.cl-k', '.cl-v', '.t-row > span', '.p-media.ph span', '.ps-who', '.ps-head', '.ps-text', '.ps-tag', '.ps-arrow',
    /* honors 팩(목차·간지·세리프 캡션) */ '.tc-num', '.tc-label', '.dv-no',
    /* naver 팩(Design AX Line) */ '.nv-hl', '.nv-label', '.nv-nav-it', '.nv-nav-pg', '.nv-rhead', '.nv-rtext', '.nv-chead', '.nv-ctext', '.nv-body', '.nv-big', '.nv-sum p',
    '.tc-no', '.tc-desc', '.tc-head', '.dv-title', '.dv-lead', '.dv-text', '.cv-title', '.cv-sub', '.cv-mv', '.cv-bandtx',
    '.stt-blab', '.stt-blabel', '.stt-bval', '.stt-dlab', '.md-cap', '.sp-li span:last-child',
    '.kp-val', '.bs-cap', '.qt-text', '.qt-by', '.tb-row > span', '.pc-arrow', '.cmp-vs',
    '.nl-no', '.nl-head', '.nl-text', '.nl-cap span', '.as-val', '.sp-qtx', '.bd-head',
    '.ln-head', '.ln-tag', '.ln-text', '.ln-bx', '.ln-bname', '.br-leadtx', '.br-head',
    '.hlx-title', '.hl-no', '.hl-head', '.hl-text', '.hlx-note p', '.hlx-fn', '.bd-lead', '.bd-stit', '.bd-it', '.bd-fi',
    '.ps-no', '.ps-tag', '.ps-head', '.ps-text', '.ps-cap', '.ck-tx', '.ln-note',
    '.dv-ino', '.dv-ihead', '.dv-itext', '.dv-note', '.rm-lbl', '.cd-fn', '.sp-qm b',
    /* rams 팩(Rams Report) */ '.rs-hl', '.rs-note', '.rs-tag', '.rs-runl', '.rs-runr', '.rs-cvtitle', '.rs-eyebrow', '.rs-cvdate', '.rs-cvfoot span', '.rs-logo em',
    '.rs-sttitle', '.rs-stsub', '.rs-sttx', '.rs-tchead', '.rs-tno', '.rs-tlabel', '.rs-tdesc', '.rs-tpages', '.rs-dvtitle', '.rs-dvlead',
    '.rs-no', '.rs-rhead', '.rs-rtext', '.rs-body', '.rs-cdhead', '.rs-cdtext', '.rs-chip', '.rs-pntx', '.rs-hhl', '.rs-srow', '.rs-hfoot',
    '.rs-bhead', '.rs-bval', '.rs-btext', '.rs-hole b', '.rs-hole i', '.rs-hole em', '.rs-spec i', '.rs-spec span', '.rs-cap',
    '.rs-mlab', '.rs-mtx', '.rs-mhead', '.rs-rmhead', '.rs-rmitems span', '.rs-bscap', '.rs-bsnum', '.rs-kpval', '.rs-tbrow > span',
    '.rs-pchead', '.rs-cmrows span', '.rs-qtx', '.rs-qby', '.rs-cktx', '.rs-lnkick', '.rs-badge', '.rs-lnhead',
    '.rs-brltx', '.rs-brfoot', '.rs-brname', '.rs-brhead', '.rs-brtext', '.rs-hlno', '.rs-hlhead', '.rs-hlsub', '.rs-hlfoot span', '.rs-hlfn',
    '.rs-bdhead', '.rs-bdrows span', '.rs-cltitle', '.rs-clsub', '.rs-clmeta span', '.rs-imgph span',
    /* pastel 팩(Pastel Gradient) */ '.pg-runl', '.pg-runr', '.pg-hl', '.pg-sub', '.pg-body', '.pg-lab', '.pg-klab', '.pg-ktx', '.pg-cap', '.pg-foot',
    '.pg-cvnum', '.pg-cvtitle', '.pg-cvlead', '.pg-cvfoot span', '.pg-sttitle', '.pg-stsub', '.pg-sttx', '.pg-tocno', '.pg-tocdesc', '.pg-tocpg',
    '.pg-dvtitle', '.pg-dvlead', '.pg-numno', '.pg-numhead', '.pg-numtx', '.pg-list li span', '.pg-cellhead', '.pg-celltx', '.pg-badge', '.pg-kpval',
    '.pg-bignum', '.pg-bigcap', '.pg-brow .l', '.pg-brow .v', '.pg-brow .tx', '.pg-srow .k', '.pg-srow .t', '.pg-trow > span', '.pg-tbrow > span',
    '.pg-rmhead', '.pg-rmlist li', '.pg-bsval', '.pg-bscap', '.pg-stephead', '.pg-steptx', '.pg-cmp ul li', '.pg-qmark', '.pg-qtx',
    '.pg-hlrow .no', '.pg-hlrow .h', '.pg-hlrow .t', '.pg-hlfn', '.pg-hltitle', '.pg-bdtitle', '.pg-side li', '.pg-side .pl span', '.pg-leadbox .tx',
    '.pg-cltitle', '.pg-clsub', '.pg-clfoot .big', '.pg-clfoot .ct i', '.pg-key.tb .mi b', '.pg-key.tb .mi i', '.pg-imgph span',
    /* sfmi 팩(SFMI Report) */ '.sf-runl i', '.sf-runr', '.sf-hl', '.sf-sub', '.sf-body', '.sf-lab', '.sf-ftx', '.sf-cap', '.sf-hfoot',
    '.sf-cvlogo i', '.sf-cvlogo em', '.sf-cvpg', '.sf-cvtitle', '.sf-cvlead', '.sf-cvfoot span', '.sf-cvfoot .ct i', '.sf-cltitle',
    '.sf-stlead', '.sf-sttitle', '.sf-sttx', '.sf-tctitle', '.sf-tochead i', '.sf-tocrow span', '.sf-dvno b', '.sf-dvno i', '.sf-dvlead', '.sf-dvtx',
    '.sf-numc i', '.sf-numhead', '.sf-numtx', '.sf-crc .hd', '.sf-crc .tg', '.sf-crctx', '.sf-list li span', '.sf-ring .lb', '.sf-ring .tx',
    '.sf-srow .k', '.sf-srow .t', '.sf-chev .mi b', '.sf-chev .mi i', '.sf-rmhead', '.sf-rmlist li', '.sf-bscrc .v', '.sf-bscap',
    '.sf-kpc i', '.sf-kp .lb', '.sf-kp .ds', '.sf-tbrow > span', '.sf-trow > span', '.sf-pcc .hd', '.sf-pcc .tx', '.sf-pctx', '.sf-arr',
    '.sf-cmpc ul li', '.sf-qtx', '.sf-lnc .hd', '.sf-lnbadge', '.sf-venn .hd', '.sf-venn .tx', '.sf-needbox .tx',
    '.sf-hltitle', '.sf-hlrow .no', '.sf-hlrow .h', '.sf-hlrow .t', '.sf-hlfn', '.sf-botitle', '.sf-bocrc .hd', '.sf-boside li', '.sf-boside .pl span', '.sf-imgph span',
    /* 마일스톤(전 팩 공통) */ '.ms-ptag', '.ms-phead', '.ms-ptext', '.ms-cap', '.ms-bar b', '.ms-bar span', '.ms-axis span', '.ms-note'].join(',');
  var LIST_SEL = '.block-list li, .p-bullets li, .pr-feats li';
  var SHAPE_SEL = '.row, .cols2 > div, .cols3 > div, .agenda-badge, .cover-arrow, .contact-cell.fill, ' +
    /* pitch 팩 — 카드·패널·플레이스홀더·라인 장식 */ '.g-cell.card, .g-cell.person, .g-cell.num, .l-cardrow, .pr-card, .t-panel, .sp-panel, .p-media.ph, .tl-dot, .mx-dot, .p-tick, .tl-axis, .tl-lead, .pr-div, .mx-ax, .ps-step, .ps-tag, ' +
    /* naver 팩 — 카드(보더탑 위계)·패널·밴드·바·게이지 */ '.nv-card, .nv-panel, .cv-band, .dv-panel, .cv-bar, .nv-gauge, .nv-gauge i, .nv-mark i, .sp-tick, .nv-row, .tc-row, .pc-step, .tl-cell, .tl-mark, .tl-axis, .ps-panel, .qt-bar, .tb-row, ' +
    '.nl-cap, .nv-hlbar, .sc-bleed, .cd-band, .ln-rule, .br-rule, .ln-bx, .bd-rule2, .bd-hr, .ps-rule, .ck-li, .ck-icon, .hl-row, .ps-hr, ' +
    /* naver — 행 규칙선(사이드별 보더로 추출) */ '.dv-item, .as-row, .nl-row, .st-col, .bd-foot, ' +
    /* rams 팩 — 라운드 카드·행·칩·게이지·원형 */ '.rs-card, .rs-trow, .rs-row, .rs-srow, .rs-spec, .rs-chip, .rs-gauge, .rs-gauge i, .rs-mbar, .rs-hlrow, .rs-play, .rs-ckic, .rs-badge, .rs-hole, .rs-imgph, .rs-qbar, .rs-logo i, .rs-tbrow, .rs-half, ' +
    /* sfmi 팩 — 원·벤·대시·chevron·풋라인 */ '.sf-dash, .sf-numc, .sf-crc, .sf-kpc, .sf-pcc, .sf-cmpc, .sf-lnc, .sf-venn, .sf-bocrc, .sf-bscrc, .sf-chev, .sf-srow, .sf-trow, .sf-tbrow, .sf-list li, .sf-numhead, .sf-tochead, .sf-foot, .sf-bar, .sf-fdash, .sf-needbox, .sf-hlrow, .sf-hlrow .no, .sf-imgph, .sf-qbox, .sf-boside, ' +
    /* pastel 팩 — 그라데이션 셀·키밴드·바·규칙선 */ '.pg-cell, .pg-stcard, .pg-toccol, .pg-key, .pg-srow, .pg-trow, .pg-tbrow, .pg-brow .tr, .pg-brow .tr i, .pg-rmcol, .pg-step, .pg-cmp, .pg-cvbars span, .pg-dash, .pg-imgph, .pg-leadbox, .pg-hlrow, .pg-list li, .pg-numhead, .pg-lab.bd, .pg-lab.bd0, .pg-clfoot, .pg-side, ' +
    /* 마일스톤(전 팩 공통) */ '.ms-phase, .ms-ptag, .ms-bar, .ms-glines i, .ms-axis, .ms-note';

  function rel(el, origin) { var r = el.getBoundingClientRect(); return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height }; }

  function addTextBox(win, s, el, origin, slideBg) {
    var cs = win.getComputedStyle(el);
    var txt = (el.innerText || el.textContent || '').replace(/ /g, ' ').trimEnd();
    if (!txt.trim()) return;
    var r = rel(el, origin); if (r.w < 2 || r.h < 2) return;
    var fs = parseFloat(cs.fontSize) || 16;
    var col = blend(parseColor(cs.color), slideBg);
    var lh = cs.lineHeight, lsm = (lh && lh !== 'normal') ? Math.max(0.6, parseFloat(lh) / fs) : null;
    var ls = (cs.letterSpacing && cs.letterSpacing !== 'normal') ? parseFloat(cs.letterSpacing) * PT : 0;
    var align = cs.textAlign === 'right' ? 'right' : cs.textAlign === 'center' ? 'center' : 'left';
    var vertical = (cs.writingMode || '').indexOf('vertical') >= 0;
    /* 줄바꿈 방어 — 상자 폭을 브라우저에서 잰 값 그대로 쓰면, 파워포인트에 Pretendard가 없어
       더 넓은 대체 폰트로 그려질 때 텍스트가 상자를 넘는다. 한글은 파워포인트에서 글자 단위로
       줄바꿈되므로 단어가 쪼개져 "띄어쓴 것처럼" 보인다.
       → 브라우저에서 한 줄로 렌더된 요소는 wrap을 끄고(절대 줄바꿈 안 함),
         여러 줄 요소는 폭에 여유를 준다. 늘어난 폭은 정렬 방향에 맞춰 흡수(우/중앙 정렬 밀림 방지). */
    var lhPx = (lh && lh !== 'normal') ? parseFloat(lh) : fs * 1.2;
    // 브라우저에서 자동 줄바꿈이 일어났는지 = 렌더된 줄 수가 <br>로 만든 줄 수보다 많은지
    var explicitLines = txt.split('\n').length, renderedLines = Math.max(1, Math.round(r.h / lhPx));
    var oneLine = renderedLines <= explicitLines;
    var baseW = Math.max(r.w, 6);
    var slackW = Math.min(baseW * (oneLine ? 0.16 : 0.06), Math.max(0, (origin.width || 1280) - r.x - baseW));
    var boxW = baseW + slackW, boxX = r.x;
    if (align === 'right') boxX = r.x - slackW;
    else if (align === 'center') boxX = r.x - slackW / 2;
    var opts = { x: boxX * IN, y: r.y * IN, w: boxW * IN, h: Math.max(r.h, 8) * IN, fontSize: fs * PT, color: hex(col), bold: (parseInt(cs.fontWeight, 10) || 400) >= 600, italic: cs.fontStyle === 'italic', fontFace: fontFamily(cs), align: align, valign: 'top', margin: 0, charSpacing: ls || undefined, lineSpacingMultiple: lsm || undefined, wrap: !oneLine };
    if (vertical) { var cx = r.x + r.w / 2, cy = r.y + r.h / 2; opts.w = Math.max(r.h, 6) * IN; opts.h = Math.max(r.w, 8) * IN; opts.x = cx * IN - opts.w / 2; opts.y = cy * IN - opts.h / 2; opts.rotate = 270; opts.align = 'center'; opts.valign = 'middle'; }
    s.addText(txt, opts);
  }
  function addShapeBox(win, pptx, s, el, origin, slideBg) {
    var cs = win.getComputedStyle(el); var r = rel(el, origin); if (r.w < 3 && r.h < 3) return;   // 한 축만 얇은 것(라인)은 허용
    var fill = parseColor(cs.backgroundColor), rad = parseFloat(cs.borderTopLeftRadius) || 0;
    var sides = ['Top', 'Right', 'Bottom', 'Left'].map(function (k) {
      return { w: parseFloat(cs['border' + k + 'Width']) || 0, c: parseColor(cs['border' + k + 'Color']), k: k };
    }).map(function (b) { if (b.c.a <= 0.01) b.w = 0; return b; });
    var on = sides.filter(function (b) { return b.w > 0; });
    if (fill.a <= 0.01 && !on.length) return;
    var uniform = on.length === 4 && on.every(function (b) { return b.w === on[0].w && hex(b.c) === hex(on[0].c); });
    if (uniform || !on.length) {
      var opts = { x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN, fill: fill.a > 0.01 ? { color: hex(blend(fill, slideBg)) } : { type: 'none' }, line: uniform ? { color: hex(blend(on[0].c, slideBg)), width: Math.max(0.5, on[0].w * PT) } : { type: 'none' } };
      // 라운드가 짧은 변의 절반 이상(원·필)이면 타원으로 — roundRect 상한(0.2in)에 눌려 각져 보이는 문제
      if (rad >= Math.min(r.w, r.h) / 2 - 0.5) { s.addShape(pptx.ShapeType.ellipse, opts); return; }
      if (rad > 0) opts.rectRadius = Math.min(0.2, rad * IN);
      s.addShape(rad > 0 ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, opts);
      return;
    }
    /* 사이드별 보더 — 위계선(카드 border-top, 행 규칙선)은 그 변에만 얇은 선을 그린다.
       예전엔 borderTop을 4면 테두리로 둘러버려 원본과 다르게 나갔다. */
    if (fill.a > 0.01) s.addShape(pptx.ShapeType.rect, { x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN, fill: { color: hex(blend(fill, slideBg)) }, line: { type: 'none' } });
    on.forEach(function (b) {
      var o = { fill: { color: hex(blend(b.c, slideBg)) }, line: { type: 'none' } };
      if (b.k === 'Top') { o.x = r.x; o.y = r.y; o.w = r.w; o.h = b.w; }
      else if (b.k === 'Bottom') { o.x = r.x; o.y = r.y + r.h - b.w; o.w = r.w; o.h = b.w; }
      else if (b.k === 'Left') { o.x = r.x; o.y = r.y; o.w = b.w; o.h = r.h; }
      else { o.x = r.x + r.w - b.w; o.y = r.y; o.w = b.w; o.h = r.h; }
      s.addShape(pptx.ShapeType.rect, { x: o.x * IN, y: o.y * IN, w: Math.max(o.w, 1) * IN, h: Math.max(o.h, 1) * IN, fill: o.fill, line: o.line });
    });
  }

  /* 배경 래스터화 — 그라디언트·글로우(background-image)는 색만으론 못 살림.
     자식을 잠시 숨기고 html2canvas로 배경만 캡처 → 슬라이드 배경 이미지. 텍스트·도형은 편집 가능한 개체 유지. */
  async function slideBgImage(win, slide) {
    var cs = win.getComputedStyle(slide);
    if (!cs.backgroundImage || cs.backgroundImage === 'none') return null;
    // 이미지 배경(표지·간지 등)은 원본 파일을 직접 데이터로 — html2canvas의 background 축약형 해석 실패(검정) 회피
    var um = cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (um) {
      try {
        var resp = await win.fetch(um[1]); var bl = await resp.blob();
        var dataUrl = await new Promise(function (res2, rej2) { var fr = new FileReader(); fr.onload = function () { res2(fr.result); }; fr.onerror = rej2; fr.readAsDataURL(bl); });
        if (dataUrl) return dataUrl;
      } catch (e) {}
    }
    var kids = [].slice.call(slide.children), prev = kids.map(function (k) { return k.style.visibility; });
    kids.forEach(function (k) { k.style.visibility = 'hidden'; });
    try {
      var canvas = await win.html2canvas(slide, { backgroundColor: null, scale: 1, logging: false });
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (e) { return null; }
    finally { kids.forEach(function (k, j) { k.style.visibility = prev[j]; }); }
  }

  window.exportPptx = async function (doc, onProgress, indices) {
    doc = doc || document;
    var win = doc.defaultView || window;
    await loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js');
    var slides = [].slice.call(doc.querySelectorAll('.ppt-stack > .slide, .deck > .slide'));
    if (indices && indices.length) slides = slides.filter(function (_, i) { return indices.indexOf(i) >= 0; });   // 페이지 범위
    if (!slides.length) throw new Error('슬라이드를 찾을 수 없습니다.');
    try { await doc.fonts.ready; } catch (e) {}
    // html2canvas는 iframe 문서 컨텍스트에 로드(배경 캡처용). 실패해도 색 배경으로 진행.
    if (!win.html2canvas) {
      try {
        await new Promise(function (res, rej) { var el = doc.createElement('script'); el.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'; el.onload = res; el.onerror = rej; doc.head.appendChild(el); });
      } catch (e) {}
    }
    var pptx = new PptxGenJS(); pptx.layout = 'LAYOUT_WIDE';
    for (var i = 0; i < slides.length; i++) {
      if (onProgress) onProgress(i + 1, slides.length);
      var slide = slides[i], origin = slide.getBoundingClientRect();
      var slideBg = parseColor(win.getComputedStyle(slide).backgroundColor); if (slideBg.a < 1) slideBg = blend(slideBg, { r: 255, g: 255, b: 255, a: 1 });
      var s = pptx.addSlide(); s.background = { color: hex(slideBg) };
      if (win.html2canvas) { var bgData = await slideBgImage(win, slide); if (bgData) s.background = { data: bgData }; }
      // 슬라이드 이미지(.s-img 등 data-URI <img>) → 편집 가능한 이미지 개체로
      [].slice.call(slide.querySelectorAll('img')).forEach(function (el) {
        var r = rel(el, origin); if (r.w < 3 || r.h < 3) return;
        var src = el.currentSrc || el.src || ''; if (src.indexOf('data:') !== 0) return;
        try { s.addImage({ data: src, x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN }); } catch (e) {}
      });
      // SVG 전부 → PNG로 래스터화해 이미지 개체로(차트·나침반·궤도·로드맵 라인·부챗살 등 팩 그래픽 포함).
      // 특정 클래스만 골라내면 새 팩 그래픽이 조용히 누락된다 — 화면에 보이는 svg는 전부 내보낸다.
      var svgs = [].slice.call(slide.querySelectorAll('svg'));
      for (var sv = 0; sv < svgs.length; sv++) {
        var el2 = svgs[sv], r2 = rel(el2, origin); if (r2.w < 3 || r2.h < 3) continue;
        try {
          var clone = el2.cloneNode(true);
          // CSS 변수·클래스 스타일은 직렬화에 안 실린다 → computed 값을 인라인으로 굽는다
          var srcN = el2.querySelectorAll('*'), dstN = clone.querySelectorAll('*');
          for (var ni = 0; ni < srcN.length; ni++) {
            var cs2 = win.getComputedStyle(srcN[ni]);
            if (srcN[ni].tagName === 'text') dstN[ni].setAttribute('style', 'font-family:' + cs2.fontFamily + ';font-size:' + cs2.fontSize + ';font-weight:' + cs2.fontWeight + ';fill:' + cs2.fill + ';letter-spacing:' + cs2.letterSpacing);
            else if (srcN[ni].tagName === 'stop') { dstN[ni].setAttribute('stop-color', cs2.stopColor); dstN[ni].setAttribute('stop-opacity', cs2.stopOpacity); }   // 그라디언트 스탑 — var() 폴백(그린)으로 굳는 문제
            else { var fl = cs2.fill; if (fl && fl.indexOf('var(') < 0) dstN[ni].setAttribute('fill', fl); var st2 = cs2.stroke; if (st2 && st2 !== 'none') { dstN[ni].setAttribute('stroke', st2); dstN[ni].setAttribute('stroke-width', cs2.strokeWidth); } }
          }
          clone.setAttribute('width', r2.w); clone.setAttribute('height', r2.h);
          var xml = new XMLSerializer().serializeToString(clone);
          var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
          var png = await new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () { var c = doc.createElement('canvas'); c.width = r2.w * 2; c.height = r2.h * 2;
              c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); resolve(c.toDataURL('image/png')); };
            img.onerror = function () { resolve(null); };
            img.src = url;
          });
          if (png) s.addImage({ data: png, x: r2.x * IN, y: r2.y * IN, w: r2.w * IN, h: r2.h * IN });
        } catch (e) {}
      }
      // 도넛(conic-gradient) — SVG도 도형도 아니라서 추출에 안 걸린다 → 캔버스로 링을 직접 그려 이미지로
      [].slice.call(slide.querySelectorAll('.nv-donut, .rs-donut')).forEach(function (el) {
        var r5 = rel(el, origin); if (r5.w < 6) return;
        var pct = Math.max(0, Math.min(100, parseFloat(el.style.getPropertyValue('--gp')) || 0));
        var col5 = (el.style.getPropertyValue('--gcol') || '').trim() || '#00DE5A';
        var hole = el.querySelector('.stt-hole, .rs-hole');
        var holeR = hole ? hole.getBoundingClientRect().width / 2 : r5.w * 0.35;
        var outerR = r5.w / 2, midR = (outerR + holeR) / 2, thick = outerR - holeR;
        var c5 = doc.createElement('canvas'); c5.width = r5.w * 2; c5.height = r5.h * 2;
        var g = c5.getContext('2d'); g.scale(2, 2); g.lineWidth = thick;
        var trk = (el.style.getPropertyValue('--gtrack') || '').trim() || '#E4E5E7';
        g.strokeStyle = trk; g.beginPath(); g.arc(outerR, outerR, midR, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = col5; g.beginPath(); g.arc(outerR, outerR, midR, -Math.PI / 2, -Math.PI / 2 + pct / 100 * Math.PI * 2); g.stroke();
        try { s.addImage({ data: c5.toDataURL('image/png'), x: r5.x * IN, y: r5.y * IN, w: r5.w * IN, h: r5.h * IN }); } catch (e) {}
      });
      /* 그라데이션 배경 요소(pastel 셀·키밴드·5색 바 등) — backgroundColor가 없어 addShapeBox가 못 낸다.
         자식을 잠시 숨기고 그 요소만 래스터 → 배경 이미지로. 텍스트는 아래 TEXT 패스가 개체로 얹는다. */
      var shapeEls = [].slice.call(slide.querySelectorAll(SHAPE_SEL));
      for (var ge = 0; ge < shapeEls.length; ge++) {
        var gel = shapeEls[ge], gcs = win.getComputedStyle(gel);
        if (!gcs.backgroundImage || gcs.backgroundImage.indexOf('gradient') < 0 || !win.html2canvas) continue;
        var gr = rel(gel, origin); if (gr.w < 3 || gr.h < 3) continue;
        var gkids = [].slice.call(gel.children), gprev = gkids.map(function (k) { return k.style.visibility; });
        gkids.forEach(function (k) { k.style.visibility = 'hidden'; });
        try {
          var gcv = await win.html2canvas(gel, { backgroundColor: null, scale: 1, logging: false });
          s.addImage({ data: gcv.toDataURL('image/png'), x: gr.x * IN, y: gr.y * IN, w: gr.w * IN, h: gr.h * IN });
        } catch (e) {}
        finally { gkids.forEach(function (k, j) { k.style.visibility = gprev[j]; }); }
      }
      shapeEls.forEach(function (el) {
        var cs4 = win.getComputedStyle(el);
        if (cs4.backgroundImage && cs4.backgroundImage.indexOf('gradient') >= 0) {
          /* 그라데이션은 위에서 이미지로 나감 — 보더만 남았으면 보더용으로 계속 */
          var hasB = ['Top', 'Right', 'Bottom', 'Left'].some(function (k) { return (parseFloat(cs4['border' + k + 'Width']) || 0) > 0; });
          if (!hasB) return;
        }
        addShapeBox(win, pptx, s, el, origin, slideBg);
      });
      // 체크 아이콘 — 원(도형)은 위에서 나갔고, ::after 체크는 텍스트 '✓'로 얹는다(가상요소는 직렬화 불가)
      [].slice.call(slide.querySelectorAll('.p-tick')).forEach(function (el) {
        var r3 = rel(el, origin); if (r3.w < 3) return;
        s.addText('✓', { x: r3.x * IN, y: r3.y * IN, w: r3.w * IN, h: r3.h * IN, align: 'center', valign: 'middle', color: 'FFFFFF', bold: true, fontSize: Math.max(8, r3.h * 0.5 * PT), margin: 0 });
      });
      // 표 행 밑줄(pitch .t-row — SHAPE_SEL 밖) — 얇은 선으로 직접. 나머지 행 규칙선은 addShapeBox의 사이드별 보더가 처리
      [].slice.call(slide.querySelectorAll('.t-row')).forEach(function (el) {
        var cs3 = win.getComputedStyle(el); var bw3 = parseFloat(cs3.borderBottomWidth) || 0; var bc3 = parseColor(cs3.borderBottomColor);
        if (bw3 <= 0 || bc3.a <= 0.01) return; var r4 = rel(el, origin);
        s.addShape(pptx.ShapeType.rect, { x: r4.x * IN, y: (r4.y + r4.h - bw3) * IN, w: r4.w * IN, h: Math.max(bw3, 1) * IN, fill: { color: hex(blend(bc3, slideBg)) }, line: { type: 'none' } });
      });
      [].slice.call(slide.querySelectorAll(TEXT_SEL)).forEach(function (el) { if (el.closest && el.closest('svg')) return; addTextBox(win, s, el, origin, slideBg); });
      [].slice.call(slide.querySelectorAll(LIST_SEL)).forEach(function (el) { var t2 = el.querySelector('[data-edit]'); addTextBox(win, s, t2 || el, origin, slideBg); });   // 불릿은 텍스트 스팬 기준(체크 원과 겹침 방지)
    }
    var name = (doc.title || 'deck').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'deck';
    await pptx.writeFile({ fileName: name + '.pptx' });
  };
})();
