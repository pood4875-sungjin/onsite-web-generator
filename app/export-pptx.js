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

  var TEXT_SEL = ['.meta-k', '.meta-v', '.eyebrow', '.cover-title', '.cover-sub', '.s-title', '.s-index', '.row-num', '.row-label', '.row-desc', '.block-sub', '.block-p', '.bignum', '.agenda-title', '.agenda-label', '.agenda-badge', '.contact-k', '.contact-v', '.contact-email', '.contact-title'].join(',');
  var LIST_SEL = '.block-list li';
  var SHAPE_SEL = '.row, .cols2 > div, .cols3 > div, .agenda-badge, .cover-arrow, .contact-cell.fill';

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
    var cs = win.getComputedStyle(el); var r = rel(el, origin); if (r.w < 3 || r.h < 3) return;
    var fill = parseColor(cs.backgroundColor), bw = parseFloat(cs.borderTopWidth) || 0, bcol = parseColor(cs.borderTopColor), rad = parseFloat(cs.borderTopLeftRadius) || 0;
    if (fill.a <= 0.01 && !(bw > 0 && bcol.a > 0)) return;
    var opts = { x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN, fill: fill.a > 0.01 ? { color: hex(blend(fill, slideBg)) } : { type: 'none' }, line: (bw > 0 && bcol.a > 0) ? { color: hex(blend(bcol, slideBg)), width: Math.max(0.5, bw * PT) } : { type: 'none' } };
    if (rad > 0) opts.rectRadius = Math.min(0.2, rad * IN);
    s.addShape(rad > 0 ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, opts);
  }

  /* 배경 래스터화 — 그라디언트·글로우(background-image)는 색만으론 못 살림.
     자식을 잠시 숨기고 html2canvas로 배경만 캡처 → 슬라이드 배경 이미지. 텍스트·도형은 편집 가능한 개체 유지. */
  async function slideBgImage(win, slide) {
    var cs = win.getComputedStyle(slide);
    if (!cs.backgroundImage || cs.backgroundImage === 'none') return null;
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
      [].slice.call(slide.querySelectorAll(SHAPE_SEL)).forEach(function (el) { addShapeBox(win, pptx, s, el, origin, slideBg); });
      [].slice.call(slide.querySelectorAll(TEXT_SEL)).forEach(function (el) { addTextBox(win, s, el, origin, slideBg); });
      [].slice.call(slide.querySelectorAll(LIST_SEL)).forEach(function (el) { addTextBox(win, s, el, origin, slideBg); });
    }
    var name = (doc.title || 'deck').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'deck';
    await pptx.writeFile({ fileName: name + '.pptx' });
  };
})();
