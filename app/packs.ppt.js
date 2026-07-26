/* packs.ppt.js — PPT(슬라이드) 팩. classic <script src>.
   출처: ~/ppt-template (render.js·tokens.css·deck.css) 포팅. 16:9(1280×720) 장표.
   데이터: { slides:[{type, ...}], style:'ax'|'grey'|'navy'|'ember'|'slidy', accent:'blue'|'orange'|'emerald' }
   슬라이드 타입: cover·agenda·rows·cols·bigstat·divider·statement·closing.
   window.renderPptDeck(data, opts) → 자가완결 HTML(스튜디오 프리뷰용 세로 스택). window.PPT_STYLE 메타. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  function kind(s, fb) { return esc((s.title || fb || s.type || 'Slide').replace(/\n/g, ' ')); }
  function de(path) { return ' data-edit="' + path + '"'; }   // slides.i.<path> 편집 훅
  function head(s, P) { return '<div class="s-head"><h2 class="s-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</h2><span class="s-index"' + de(P + '.index') + '>' + esc(s.index || '') + '</span></div>'; }
  function colsBlock(cols, P) {
    var n = cols.length, cls = n <= 2 ? 'cols2' : 'cols3';
    return '<div class="' + cls + '">' + cols.map(function (c, j) {
      var CP = P + '.' + j;
      var inner = '<h3 class="block-sub"' + de(CP + '.sub') + '>' + esc(c.sub || '') + '</h3>';
      if (c.items && c.items.length) inner += '<ul class="block-list">' + c.items.map(function (li, k) { return '<li' + de(CP + '.items.' + k) + '>' + ml(li) + '</li>'; }).join('') + '</ul>';
      if (c.text) inner += '<p class="block-p"' + de(CP + '.text') + '>' + ml(c.text) + '</p>';
      return '<div>' + inner + '</div>';
    }).join('') + '</div>';
  }
  var R = {
    cover: function (s, P) {
      var meta = (s.meta || []);
      var cells = meta.map(function (m, i) { var sp = (meta.length > 1 && i === meta.length - 1) ? ' class="spacer"' : ''; return '<div' + sp + '><p class="meta-k"' + de(P + '.meta.' + i + '.k') + '>' + esc(m.k) + '</p><p class="meta-v"' + de(P + '.meta.' + i + '.v') + '>' + esc(m.v) + '</p></div>'; }).join('');
      return '<section class="slide dark cover" data-kind="Cover"><div class="cover-meta">' + cells + '</div><div class="cover-foot"><div>' +
        (s.eyebrow ? '<p class="meta-k"' + de(P + '.eyebrow') + ' style="margin-bottom:18px;letter-spacing:.14em">' + esc(s.eyebrow) + '</p>' : '') +
        '<h1 class="cover-title"' + de(P + '.title') + '>' + ml(s.title || '') + '</h1>' +
        (s.subtitle ? '<p class="block-p"' + de(P + '.subtitle') + ' style="color:var(--muted-alt);margin-top:24px;max-width:600px">' + esc(s.subtitle) + '</p>' : '') +
        '</div><div class="cover-arrow">→</div></div></section>';
    },
    agenda: function (s, P) {
      var items = s.items || [];
      return '<section class="slide" data-kind="Agenda"><div class="agenda"><div class="agenda-title"' + de(P + '.title') + '>' + esc(s.title || 'Agenda') + '</div><div class="agenda-list">' +
        items.map(function (it, i) { return '<div class="agenda-row"><span class="ag-div"></span><p class="agenda-label"' + de(P + '.items.' + i) + '>' + esc(it) + '</p><span class="agenda-badge">' + pad2(i + 1) + '</span></div>'; }).join('') +
        '<span class="ag-div ag-last"></span></div></div></section>';
    },
    rows: function (s, P) {
      var rows = (s.rows || []).map(function (r, j) { return '<div class="row"><span class="row-num"' + de(P + '.rows.' + j + '.num') + '>' + esc(r.num || '') + '</span><h3 class="row-label"' + de(P + '.rows.' + j + '.label') + '>' + esc(r.label || '') + '</h3><p class="row-desc"' + de(P + '.rows.' + j + '.desc') + '>' + ml(r.desc || '') + '</p></div>'; }).join('');
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body"><div class="rows">' + rows + '</div></div></section>';
    },
    cols: function (s, P) { return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body">' + colsBlock(s.cols || [], P + '.cols') + '</div></section>'; },
    bigstat: function (s, P) {
      var sides = (s.sides || []).map(function (x, j) { return '<div><h3 class="block-sub"' + de(P + '.sides.' + j + '.sub') + '>' + esc(x.sub || '') + '</h3><p class="block-p"' + de(P + '.sides.' + j + '.text') + '>' + ml(x.text || '') + '</p></div>'; }).join('');
      return '<section class="slide bs ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body"><div class="bigstat"><p class="bignum"' + de(P + '.big') + '>' + ml(s.big || '') + '</p><div class="bigstat-side">' + sides + '</div></div></div></section>';
    },
    divider: function (s, P) {
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '"><div class="s-head"><h2 class="s-title"' + de(P + '.title') + ' style="font-size:128px;line-height:.9">' + ml(s.title || '') + '</h2><span class="s-index">' + esc(s.index || '') + '</span></div><div class="s-body" style="margin-top:40px"><p class="block-p"' + de(P + '.sub') + ' style="font-size:22px;' + (s.dark ? 'color:var(--on-alt-soft)' : '') + '">' + ml(s.sub || '') + '</p></div></section>';
    },
    statement: function (s, P) {
      var c = (s.cols && s.cols.length) ? colsBlock(s.cols, P + '.cols') : '';
      return '<section class="slide ' + (s.dark ? 'dark' : '') + '" data-kind="' + kind(s) + '">' + head(s, P) + '<div class="s-body"><p class="block-p"' + de(P + '.text') + ' style="font-size:26px;line-height:1.5;max-width:900px;margin-bottom:36px;' + (s.dark ? 'color:var(--on-alt-soft)' : '') + '">' + ml(s.text || '') + '</p>' + c + '</div></section>';
    },
    closing: function (s, P) {
      var contacts = s.contacts || [], fills = [0, 2, 4], cells = '';
      for (var i = 0; i < 6; i++) { var ci = fills.indexOf(i); if (ci > -1 && contacts[ci]) cells += '<div class="contact-cell fill"><p class="contact-k"' + de(P + '.contacts.' + ci + '.k') + '>' + esc(contacts[ci].k) + '</p><p class="contact-v"' + de(P + '.contacts.' + ci + '.v') + '>' + esc(contacts[ci].v) + '</p></div>'; else cells += '<div class="contact-cell"></div>'; }
      return '<section class="slide dark contact" data-kind="Closing"><div class="contact-grid">' + cells + '</div><div class="contact-foot">' + (s.sub ? '<p class="contact-email"' + de(P + '.sub') + '>' + esc(s.sub) + '</p>' : '') + '<h2 class="contact-title"' + de(P + '.title') + '>' + ml(s.title || 'Thank you') + '</h2></div></section>';
    },
  };
  function renderSlides(slides) {
    return (slides || []).map(function (s, i) {
      var fn = R[s.type] || R.rows; var html = '';
      try { html = fn(s, 'slides.' + i); } catch (e) { return ''; }
      // 슬라이드 이미지 여러 장(s.imgs[], 구버전 s.img 단일도 수용)
      // 각 장이 개별 이동/숨김/리사이즈 블록(.s-imgwrap ∈ MV_SEL), PPTX에도 추출됨
      var imgs = (s.imgs && s.imgs.length) ? s.imgs : ((s.img && s.img.src) ? [s.img] : []);
      if (imgs.length) {
        var ih = imgs.map(function (im, k) {
          if (!im || !im.src) return '';
          var ist = '';
          if (im.w) ist += 'width:' + (+im.w) + 'px;max-width:none;';
          if (im.h) ist += 'height:' + (+im.h) + 'px;max-height:none;';
          // 계단 배치로 겹침 방지(이후 드래그로 자유 이동). 리사이즈하면 좌상단 고정(l/t 저장)으로 전환
          var pos = 'top:' + (im.t != null ? +im.t : (150 + k * 34)) + 'px;' +
            (im.l != null ? 'left:' + (+im.l) + 'px;right:auto' : 'right:' + (60 + k * 34) + 'px');
          return '<div class="s-imgwrap" data-imgi="' + k + '" style="' + pos + '"><img class="s-img" src="' + esc(im.src) + '"' + (ist ? ' style="' + ist + '"' : '') + ' alt=""></div>';
        }).join('');
        html = html.replace(/<\/section>\s*$/, ih + '</section>');
      }
      return html;
    }).join('\n');
  }

  /* ---- 편집 상태 적용 — 슬라이드별 _pos(블록 오프셋)/_hide(블록 숨김)/_fmt(텍스트 굵기, 상대경로 키).
     블록 키 = MV_SEL 매칭 순서 m0,m1… (deck·viewer·PPTX 좌표까지 일관 반영) ---- */
  /* 개별 편집 단위 = 모든 텍스트([data-edit]) + 이미지(.s-imgwrap). 그룹핑 없이 낱개로 이동/숨김.
     함께 옮기려면 스튜디오에서 여러 개 선택 후 '그룹'. DOM 순서 = 키 순서(m0…) */
  var MV_SEL = '[data-edit], .s-imgwrap, .cover-arrow, .agenda-badge, .ag-div, .row-num';   // 텍스트·이미지·화살표·뱃지·구분선·번호까지 전부 개별
  function stateScript(slides) {
    var st = (slides || []).map(function (s) { return { p: s._pos || {}, h: s._hide || {}, f: s._fmt || {}, z: s._z || {}, a: s._ta || {} }; });
    var js = '(function(){var ST=' + JSON.stringify(st) + ';var SEL=' + JSON.stringify(MV_SEL) + ';' +
      'var sl=document.querySelectorAll(".ppt-stack > .slide, .vscale > .slide");' +
      'for(var i=0;i<sl.length;i++){var c=ST[i];if(!c)continue;var s=sl[i];' +
      'var mv=s.querySelectorAll(SEL);' +
      'for(var k=0;k<mv.length;k++){var key="m"+k;mv[k].setAttribute("data-mvkey",key);' +
      'var p=c.p[key];if(p)mv[k].style.transform="translate("+p[0]+"px,"+p[1]+"px)";' +
      'var z=c.z[key];if(z!=null){mv[k].style.zIndex=z;if(getComputedStyle(mv[k]).position==="static")mv[k].style.position="relative";}' +
      'if(c.h[key])mv[k].style.display="none";}' +
      'var ed=s.querySelectorAll("[data-edit]");' +
      'for(var e2=0;e2<ed.length;e2++){var path=ed[e2].getAttribute("data-edit")||"";var rel=path.replace(/^slides\\.\\d+\\./,"");' +
      'var f=c.f[rel];if(f==="b")ed[e2].style.fontWeight=700;else if(f==="l")ed[e2].style.fontWeight=300;' +
      'var ta=c.a?c.a[rel]:0;if(ta)ed[e2].style.textAlign=ta==="c"?"center":ta==="r"?"right":"left";}' +   // 텍스트 정렬(_ta) 적용
      '}' +
      // 저장된 이동값(_pos)이 텍스트를 슬라이드 위/왼쪽 밖으로 밀면 안쪽으로 클램프 — "타이틀 잘림" 방지.
      // 숨겨진 장은 rect가 0이라 측정 불가 → 보이는 장만, 뷰어는 show() 시점에 __clampSlide 호출.
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

  /* ---- CSS: ppt-template tokens+deck 포팅 (뷰어 크롬 제거, 세로 스택) ---- */
  function css() {
    return '@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");' +
      "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Anonymous+Pro:wght@400;700&display=swap');" +
      /* 스타일 토큰 (기본 GREY) */
      ':root{--surf:#fff;--on-surf:#020212;--muted:#8a8a93;--line:rgba(2,2,18,.14);--surf-alt:#020212;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.82);--muted-alt:rgba(255,255,255,.62);--line-alt:rgba(255,255,255,.16);--font-disp:"Bricolage Grotesque","Pretendard",system-ui,sans-serif;--font-num:"Anonymous Pro",ui-monospace,monospace;--rad:0px;--card-bg:transparent;--card-bd:transparent;--card-pad:0px;--card-bg-alt:transparent;--card-bd-alt:transparent;--title-weight:400;--cover-weight:600;--label-weight:400;--slide-w:1280px;--slide-h:720px;--margin:60px;--ease:cubic-bezier(.22,1,.36,1)}' +
      '[data-style="ax"]{--surf:#fff;--on-surf:#0b0b0f;--muted:#5b5b62;--line:rgba(11,11,20,.10);--surf-alt:#0b1f3a;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.86);--muted-alt:rgba(255,255,255,.66);--line-alt:rgba(255,255,255,.18);--font-disp:"Pretendard",system-ui,sans-serif;--font-num:"Pretendard",system-ui,sans-serif;--rad:18px;--card-bg:#f7f8fa;--card-bd:rgba(11,11,20,.08);--card-pad:20px 26px;--card-bg-alt:rgba(255,255,255,.05);--card-bd-alt:rgba(255,255,255,.14);--title-weight:800;--cover-weight:800;--label-weight:700;--accent:#2f93e3}' +
      '[data-style="navy"]{--surf:#141a28;--on-surf:#fff;--muted:#6e7885;--line:rgba(255,255,255,.12);--surf-alt:#0f1420;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.72);--muted-alt:#6e7885;--line-alt:rgba(255,255,255,.12);--font-disp:"Helvetica Neue",Arial,"Pretendard",system-ui,sans-serif;--font-num:"Anonymous Pro",ui-monospace,monospace;--rad:14px;--card-bg:rgba(255,255,255,.04);--card-bd:rgba(255,255,255,.10);--card-pad:24px 26px;--card-bg-alt:rgba(255,255,255,.05);--card-bd-alt:rgba(255,255,255,.12);--title-weight:800;--cover-weight:800;--label-weight:700;--accent:#2f6dff}' +
      '[data-style="navy"] .slide,[data-style="navy"] .slide.dark{background-color:var(--surf-alt);background-image:radial-gradient(820px 540px at 86% 14%,rgba(47,109,255,.34) 0%,transparent 60%)}[data-style="navy"] .s-index{color:var(--accent)}' +
      '[data-style="ember"]{--surf:#fff;--on-surf:#141414;--muted:#8a8a8a;--line:rgba(20,20,20,.12);--surf-alt:#171311;--on-alt:#fff;--on-alt-soft:rgba(255,255,255,.8);--muted-alt:rgba(255,255,255,.66);--line-alt:rgba(255,255,255,.16);--font-disp:"Helvetica Neue",Arial,"Pretendard",system-ui,sans-serif;--font-num:"Anonymous Pro",ui-monospace,monospace;--rad:0px;--title-weight:800;--cover-weight:800;--label-weight:700;--accent:#ff4327}' +
      '[data-style="ember"] .slide.dark{background-color:var(--surf-alt);background-image:radial-gradient(900px 600px at 80% 30%,rgba(255,67,39,.45) 0%,transparent 60%)}[data-style="ember"] .slide.cover{background:linear-gradient(135deg,#ff4d12 0%,#e23a0f 55%,#c22e0c 100%);color:#fff}[data-style="ember"] .s-index,[data-style="ember"] .row-num,[data-style="ember"] .bignum{color:var(--accent)}' +
      '[data-accent="orange"]{--accent:#f2682a}[data-accent="emerald"]{--accent:#15b8c4}[data-accent="blue"]{--accent:#2f93e3}' +
      /* 세로 스택 레이아웃 (뷰어 대신) */
      '*{box-sizing:border-box}body{margin:0;background:#0a0a0e;font-family:var(--font-disp);-webkit-font-smoothing:antialiased}' +
      '.ppt-stack{display:flex;flex-direction:column;align-items:center;gap:20px;padding:24px 0}' +
      '.slide{position:relative;width:var(--slide-w);height:var(--slide-h);flex:none;background:var(--surf);color:var(--on-surf);padding:var(--margin);word-break:keep-all;overflow-wrap:break-word;box-shadow:0 12px 40px rgba(0,0,0,.4);overflow:hidden}' +
      /* 편집에서 친 연속 공백·줄바꿈 보존 — HTML 공백 접기 방지(사용자: 띄어쓰기 반영) */
      '.slide [data-edit]{white-space:pre-wrap}' +
      '.s-imgwrap{position:absolute;right:60px;top:150px;z-index:5}' +
      '.s-imgwrap img{display:block;max-width:420px;max-height:440px;border-radius:14px;object-fit:cover;-webkit-user-drag:none;user-select:none;pointer-events:none}' +
      '.slide.dark{background:var(--surf-alt);color:var(--on-alt)}.slide.dark .s-index{color:var(--accent,var(--on-alt))}.slide.dark .row-desc,.slide.dark .muted,.slide.dark .meta-k,.slide.dark .contact-email{color:var(--muted-alt)}.slide.dark .block-list li,.slide.dark .block-p{color:var(--on-alt-soft)}.slide.dark .agenda-row{border-color:var(--line-alt)}.slide.dark .row{background:var(--card-bg-alt);border-color:var(--card-bd-alt)}' +
      '.s-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px}.s-title{font-family:var(--font-disp);font-weight:var(--title-weight);font-size:72px;line-height:.98;letter-spacing:-.02em;margin:0;max-width:70%}.s-index{font-family:var(--font-num);font-size:54px;line-height:1;letter-spacing:-.02em;color:var(--accent,currentColor);white-space:nowrap;margin-top:6px}.s-body{margin-top:64px}' +
      '.rows{display:flex;flex-direction:column;gap:40px}.row{display:grid;grid-template-columns:150px 1fr 340px;gap:40px;align-items:start;background:var(--card-bg);border:1px solid var(--card-bd);border-radius:var(--rad);padding:var(--card-pad)}.row-num{font-family:var(--font-num);font-size:34px;color:var(--accent,currentColor)}.row-label{font-family:var(--font-disp);font-weight:var(--label-weight);font-size:34px;line-height:1;margin:0}.row-desc{font-weight:300;font-size:16px;line-height:1.55;color:var(--muted);margin:0}' +
      '.cols2{display:grid;grid-template-columns:1fr 1fr;gap:56px}.cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}.cols2>div,.cols3>div{background:var(--card-bg);border:1px solid var(--card-bd);border-radius:var(--rad);padding:var(--card-pad)}.block-sub{font-family:var(--font-disp);font-weight:500;font-size:26px;margin:0 0 18px}.block-list{display:flex;flex-direction:column;gap:14px;margin:0;padding:0}.block-list li{list-style:none;font-weight:300;font-size:16px;line-height:1.55;color:var(--on-surf)}.block-p{font-weight:300;font-size:16px;line-height:1.6;color:var(--on-surf);margin:0;max-width:540px}' +
      '.cover{display:flex;flex-direction:column;justify-content:space-between}.cover-meta{display:flex;gap:56px}.cover-meta .spacer{margin-left:auto;text-align:right}.meta-k{font-size:13px;color:var(--muted-alt);margin:0 0 6px}.meta-v{font-size:14px;font-weight:600;color:var(--on-alt);margin:0}.cover-foot{display:flex;align-items:flex-end;justify-content:space-between}.cover-title{font-family:var(--font-disp);font-weight:var(--cover-weight);font-size:118px;line-height:.9;letter-spacing:-.02em;margin:0}.cover-arrow{width:84px;height:84px;flex:none;display:grid;place-items:center;background:#fff;color:var(--surf-alt);font-size:30px;border-radius:var(--rad)}' +
      '.agenda{display:grid;grid-template-columns:130px 1fr;gap:24px;height:100%}.agenda-title{font-family:var(--font-disp);font-weight:var(--cover-weight);font-size:64px;writing-mode:vertical-rl;transform:rotate(180deg);align-self:center}.agenda-list{display:flex;flex-direction:column;justify-content:center}.agenda-row{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:22px 6px}.ag-div{position:absolute;left:0;right:0;top:0;height:1px;background:var(--line)}.ag-div.ag-last{position:relative;display:block;margin-top:0}.agenda-label{font-family:var(--font-disp);font-weight:600;font-size:28px;margin:0}.agenda-badge{width:64px;height:64px;flex:none;display:grid;place-items:center;background:var(--accent,var(--surf-alt));color:#fff;font-family:var(--font-num);font-size:22px;border-radius:var(--rad)}' +
      '.slide.bs{display:flex;flex-direction:column}.slide.bs .s-body{flex:1;display:flex;align-items:center}' +   /* 대형 수치 세로 중앙(사용자 지시) */
      '.bigstat{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;width:100%}.bignum{font-family:var(--font-disp);font-weight:var(--title-weight);font-size:136px;line-height:.92;letter-spacing:-.02em;margin:0;color:var(--accent,currentColor)}.bigstat-side{display:flex;flex-direction:column;gap:44px}' +
      '.contact{display:flex;flex-direction:column;justify-content:space-between}.contact-grid{position:absolute;top:0;right:0;width:600px;height:420px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr)}.contact-cell{display:grid;place-content:center;padding:28px}.contact-cell.fill{background:var(--surf);color:var(--on-surf)}.contact-k{font-size:13px;color:var(--muted);margin:0 0 6px}.contact-v{font-size:15px;font-weight:600;margin:0}.contact-foot{margin-top:auto}.contact-email{font-size:14px;color:var(--muted-alt);margin:0 0 14px}.contact-title{font-family:var(--font-disp);font-weight:var(--cover-weight);font-size:92px;line-height:.92;letter-spacing:-.02em;margin:0}';
  }

  function renderPptDeck(data, opts) {
    data = data || {}; opts = opts || {};
    var style = data.style || 'ax', accent = data.accent || '';
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + '</style></head><body data-style="' + esc(style) + '"' + (accent ? ' data-accent="' + esc(accent) + '"' : '') + '>' +
      '<div class="ppt-stack">' + renderSlides(slides) + '</div>' + stateScript(slides) + '</body></html>';
  }

  /* ---- 스타터 덱 (결정론적 · 슬롯 채움) ---- */
  var DEFAULT_DECK = { style: 'ax', accent: 'blue', slides: [
    { type: 'cover', eyebrow: 'MIDAS AX', title: '제안 발표\n프로젝트 개요', subtitle: '핵심 메시지를 한 줄로.', meta: [{ k: 'DATE', v: '2026' }, { k: 'TEAM', v: 'AX' }] },
    { type: 'agenda', title: 'Agenda', items: ['배경과 문제', '해결 방향', '핵심 기능', '기대 효과', '다음 단계'] },
    { type: 'rows', title: '핵심 방향', index: '01', rows: [
      { num: '01', label: '문제 정의', desc: '지금 무엇이 불편한가.' },
      { num: '02', label: '해결 접근', desc: '어떻게 풀 것인가.' },
      { num: '03', label: '차별점', desc: '왜 우리가 더 낫나.' } ] },
    { type: 'bigstat', title: '기대 효과', index: '02', big: '40%', sides: [{ sub: '생산성', text: '반복 작업 자동화로 시간 절감.' }, { sub: '일관성', text: '토큰 기반으로 품질 균일.' }] },
    { type: 'closing', title: 'Thank you', sub: 'contact@midasit.com', contacts: [{ k: 'EMAIL', v: 'contact@midasit.com' }, { k: 'WEB', v: 'midasit.com' }, { k: 'TEAM', v: 'MIDAS AX' }] },
  ] };

  /* ---- 발표 뷰어 — 한 장씩, ←→/클릭/버튼 넘김. 미리보기 오버레이 iframe용 자가완결 문서 ---- */
  function renderPptViewer(data, opts) {
    data = data || {}; opts = opts || {};
    var style = data.style || 'ax', accent = data.accent || '';
    var slides = (data.slides && data.slides.length) ? data.slides : DEFAULT_DECK.slides;
    var vcss =
      'html,body{height:100%}body{background:#0a0a0e;overflow:hidden}' +
      '.vwrap{position:fixed;inset:0;display:flex;justify-content:center;align-items:flex-start}' +   // 세로 배치는 fit()이 translateY로 결정(그리드 센터링 오차 회피)
      '.vscale{width:var(--slide-w);height:var(--slide-h);position:relative;flex:none;transform-origin:top center}' +
      '.vscale .slide{position:absolute;inset:0;display:none;box-shadow:0 24px 80px rgba(0,0,0,.55)}' +
      '.vscale .slide.cur{display:flex}.vscale .slide.cur:not(.cover):not(.contact):not(.bs){display:block}' +
      '.vbar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:9px 16px;border-radius:999px;background:rgba(10,10,14,.72);backdrop-filter:blur(10px);color:#fff;font-family:Pretendard,system-ui,sans-serif;font-size:13px;z-index:9;user-select:none}' +
      '.vbtn{border:none;background:rgba(255,255,255,.12);color:#fff;width:34px;height:34px;border-radius:999px;font-size:15px;cursor:pointer;line-height:1}' +
      '.vbtn:hover{background:rgba(255,255,255,.24)}.vbtn:disabled{opacity:.3;cursor:default}' +
      '.vcount{min-width:52px;text-align:center;font-variant-numeric:tabular-nums;opacity:.9}' +
      /* 발표 모션 — 장 자체는 즉시 표시, 내용 요소만 순차 등장(요소는 opacity만 — 블록 _pos 오프셋 보존) */
      '@keyframes vfu{from{opacity:0}to{opacity:1}}' +
      'body.pfs .vbar{display:none!important}';
    var vjs =
      '(function(){var s=[].slice.call(document.querySelectorAll(".vscale .slide")),n=-1;' +
      'var c=document.querySelector(".vcount"),pb=document.querySelector(".vprev"),nb=document.querySelector(".vnext");' +
      // 전체화면: 네이티브 시도 → 권한 거부 시 유사 전체화면(pfs — 바 숨기고 꽉 채움) 폴백
      'var pseudo=false;' +
      'function fs(){return !!document.fullscreenElement||pseudo}' +
      'function setPseudo(v){pseudo=v;document.body.classList.toggle("pfs",v);fit();try{parent.postMessage({pptViewerPseudoFs:v?1:0},"*")}catch(x){}}' +
      'function toggleFs(){if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen();return}' +
      'if(pseudo){setPseudo(false);return}' +
      'var de2=document.documentElement,rq=de2.requestFullscreen||de2.webkitRequestFullscreen;' +
      'var p=null;try{p=rq&&rq.call(de2)}catch(e){}' +
      'if(p&&p.then)p.then(null,function(){});' +
      // 일부 환경은 프라미스가 영영 안 끝난다(성공도 거부도 없음) — 600ms 안에 전체화면이 안 잡히면 유사 전체화면 폴백
      'setTimeout(function(){if(!document.fullscreenElement&&!pseudo)setPseudo(true);},600);}' +
      'function fit(){var bh=fs()?0:84;var area=innerHeight-bh;var sc=Math.min(innerWidth*0.97/1280,area/720)*(fs()?1:0.97);' +
      'var ty=Math.max(0,(area-720*sc)/2);' +
      'document.querySelector(".vbar").style.display=fs()?"none":"flex";' +
      'var v=document.querySelector(".vscale");v.style.transform="translateY("+ty+"px) scale("+sc+")";}' +
      'function show(i){var prev=n;n=Math.max(0,Math.min(s.length-1,i));if(n===prev)return;' +
      's.forEach(function(x,k){x.classList.toggle("cur",k===n)});' +
      'var cur=s[n];if(cur){' +
      // 요소 순차 등장 — 편집 단위(data-mvkey)별 60ms 스태거, 최대 0.76s에서 수렴
      // 타이틀·아이브로·리드 같은 헤딩 블록(slides.N.title 등 최상위 텍스트)은 즉시 표시 — 하위 내용·그래프만 순차 등장
      // 발표 모션 축소(사용자 지시): 텍스트는 즉시, 차트 요소·카드 블록만 순차 등장
      'var us=cur.querySelectorAll(".row,.cols2 > div,.cols3 > div,.agenda-badge,.contact-cell");var q2=0;for(var q=0;q<us.length;q++){var u=us[q];if(u.style.display==="none")continue;' +
      'u.style.animation="none";void u.offsetWidth;u.style.animation="vfu .5s both";u.style.animationDelay=Math.min(140+(q2++)*90,900)+"ms";}' +
      'if(window.__clampSlide)window.__clampSlide(cur);' +
      // 숫자 카운트업 — 대형 수치(.bs-num/.bignum)와 수치 그리드(.s-num)가 0→값으로 빠르게 상승(사용자 지시)
      'var cu=cur.querySelectorAll(".bs-num,.s-num,.bignum");for(var w=0;w<cu.length;w++){(function(el){' +
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
      'addEventListener("resize",fit);fit();show(' + (Math.max(0, Math.min(+opts.start || 0, slides.length - 1))) + ');' +   // 스튜디오에서 보고 있던 장부터 시작(사용자 지시)
      'pb.onclick=function(e){e.stopPropagation();show(n-1)};nb.onclick=function(e){e.stopPropagation();show(n+1)};' +
      'var fbn=document.querySelector(".vfs");if(fbn)fbn.onclick=function(e){e.stopPropagation();toggleFs();};' +   // 버튼 클릭=확실한 사용자 제스처 → 네이티브 전체화면 보장

      'document.addEventListener("click",function(e){if(e.target.closest(".vbar"))return;show(n+1)});' +
      'document.addEventListener("keydown",function(e){' +
      'if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" ")show(n+1);' +
      'else if(e.key==="ArrowLeft"||e.key==="PageUp")show(n-1);' +
      'else if(e.key==="f"||e.key==="F")toggleFs();' +
      'else if(e.key==="Escape"){if(document.fullscreenElement)return;if(pseudo){setPseudo(false);return}try{parent.postMessage({pptViewerClose:1},"*")}catch(x){}}});' +
      '})();';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + css() + vcss + '</style></head><body data-style="' + esc(style) + '"' + (accent ? ' data-accent="' + esc(accent) + '"' : '') + '>' +
      '<div class="vwrap"><div class="vscale">' + renderSlides(slides) + '</div></div>' + stateScript(slides) +
      '<div class="vbar"><button class="vbtn vprev">‹</button><span class="vcount">1 / ' + slides.length + '</span><button class="vbtn vnext">›</button><button class="vbtn vfs" title="\uc804\uccb4\ud654\uba74 (F)">\u26f6</button></div>' +
      '<scr' + 'ipt>' + vjs + '</scr' + 'ipt></body></html>';
  }

  window.renderPptViewer = renderPptViewer;
  window.PPT_MV_SEL = MV_SEL;
  window.renderPptDeck = renderPptDeck;
  window.PPT_DEFAULT_DECK = DEFAULT_DECK;
  window.PPT_STYLE = { id: 'ppt', name: 'PPT', desc: '슬라이드 · 16:9 · MIDAS AX', swatch: 'linear-gradient(135deg,#0b1f3a,#2f93e3)' };
  window.PPT_STYLES = [
    { id: 'ax', name: 'MIDAS AX', swatch: 'linear-gradient(135deg,#0b1f3a,#2f93e3)' },
    { id: 'grey', name: 'Grey', swatch: 'linear-gradient(135deg,#f2f2f2,#020212)' },
    { id: 'navy', name: 'Navy Glow', swatch: 'linear-gradient(135deg,#0f1420,#2f6dff)' },
    { id: 'ember', name: 'Ember', swatch: 'linear-gradient(135deg,#171311,#ff4327)' },
  ];

  /* ---- 슬라이드 추가용: 타입 목록 + 기본 슬라이드 팩토리 (스튜디오 슬라이드 패널에서 사용) ---- */
  window.PPT_SLIDE_TYPES = [
    { type: 'cover', label: '표지' },
    { type: 'agenda', label: '목차' },
    { type: 'rows', label: '목록형' },
    { type: 'cols', label: '단 비교' },
    { type: 'bigstat', label: '핵심 수치' },
    { type: 'statement', label: '선언·메시지' },
    { type: 'divider', label: '구분·섹션' },
    { type: 'closing', label: '마무리' },
  ];
  window.PPT_TYPE_LABEL = window.PPT_SLIDE_TYPES.reduce(function (m, x) { m[x.type] = x.label; return m; }, {});
  var _SLIDE_STARTERS = {
    cover: { type: 'cover', eyebrow: '', title: '제목을 입력', subtitle: '부제목을 입력', meta: [{ k: 'DATE', v: '2026' }, { k: 'TEAM', v: '' }] },
    agenda: { type: 'agenda', title: 'Agenda', items: ['항목 1', '항목 2', '항목 3'] },
    rows: { type: 'rows', title: '제목', index: '', rows: [{ num: '01', label: '항목', desc: '설명' }, { num: '02', label: '항목', desc: '설명' }] },
    cols: { type: 'cols', title: '제목', index: '', cols: [{ sub: '소제목', items: ['내용'] }, { sub: '소제목', items: ['내용'] }] },
    bigstat: { type: 'bigstat', title: '제목', index: '', big: '00%', sides: [{ sub: '라벨', text: '설명' }, { sub: '라벨', text: '설명' }] },
    statement: { type: 'statement', title: '제목', index: '', text: '핵심 메시지를 입력하세요.', cols: [] },
    divider: { type: 'divider', title: '섹션', index: '', sub: '부연 설명' },
    closing: { type: 'closing', title: 'Thank you', sub: 'contact@example.com', contacts: [{ k: 'EMAIL', v: '' }, { k: 'WEB', v: '' }] },
  };
  window.pptNewSlide = function (type) { return JSON.parse(JSON.stringify(_SLIDE_STARTERS[type] || _SLIDE_STARTERS.rows)); };

  /* 빈 브리프 → 전 타입 쇼케이스 덱 — 템플릿 라이브러리를 한 장씩 훑어보고 골라 쓰게 */
  window.pptTemplateDeck = function (style) {
    var slides = window.PPT_SLIDE_TYPES.map(function (t) {
      var s = window.pptNewSlide(t.type);
      if (s.title != null && t.type !== 'cover' && t.type !== 'closing') s.title = t.label;   // 장마다 타입 이름을 제목으로
      return s;
    });
    if (slides[0]) { slides[0].title = '전체 템플릿'; slides[0].subtitle = '필요 없는 장은 지우고, 내용을 채워보세요'; }
    return { slides: slides, style: style || 'ax' };
  };

  /* ---- 브리프 → 결정론적 덱 조립 (백엔드 없이). 생성 흐름에서 사용.
     brief = { title, message, audience, outline:[문자열...], style, accent }
     제목·핵심메시지·목차 항목을 슬롯에 채우고 본문 레이아웃을 rows/cols/bigstat로 순환.
     세부 문구는 스캐폴드(플레이스홀더) — 사용자가 스튜디오에서 채움(웹 생성기와 동일 철학). ---- */
  window.pptComposeDeck = function (brief) {
    brief = brief || {};
    var title = (brief.title || '').trim() || '제안 발표';
    var msg = (brief.message || '').trim();
    var audience = (brief.audience || '').trim();
    var outline = (brief.outline || []).map(function (s) { return (s || '').trim(); }).filter(Boolean).slice(0, 8);
    var slides = [];
    // 표지 — 제목 + 핵심 메시지 + 대상
    slides.push({ type: 'cover', eyebrow: 'MIDAS AX', title: title, subtitle: msg,
      meta: audience ? [{ k: 'AUDIENCE', v: audience }, { k: 'TEAM', v: 'MIDAS AX' }] : [{ k: 'TEAM', v: 'MIDAS AX' }] });
    // 목차 — 항목이 2개 이상일 때만
    if (outline.length >= 2) slides.push({ type: 'agenda', title: 'Agenda', items: outline.slice(0, 6) });
    // 본문 — 목차 항목마다 한 장, 레이아웃 순환(rows→cols→bigstat)
    (outline.length ? outline : ['핵심 내용']).forEach(function (sec, i) {
      var idx = String(i + 1).padStart(2, '0'), mod = i % 3;
      if (mod === 0) slides.push({ type: 'rows', title: sec, index: idx, rows: [
        { num: '01', label: '항목', desc: '설명을 입력하세요.' },
        { num: '02', label: '항목', desc: '설명을 입력하세요.' },
        { num: '03', label: '항목', desc: '설명을 입력하세요.' } ] });
      else if (mod === 1) slides.push({ type: 'cols', title: sec, index: idx, cols: [
        { sub: '포인트 A', items: ['내용을 입력하세요.', '내용을 입력하세요.'] },
        { sub: '포인트 B', items: ['내용을 입력하세요.', '내용을 입력하세요.'] } ] });
      else slides.push({ type: 'bigstat', title: sec, index: idx, big: '00%', sides: [
        { sub: '지표', text: '설명을 입력하세요.' },
        { sub: '효과', text: '설명을 입력하세요.' } ] });
    });
    // 마무리
    slides.push({ type: 'closing', title: 'Thank you', sub: '', contacts: [{ k: 'TEAM', v: audience || 'MIDAS AX' }] });
    return { style: brief.style || 'ax', accent: brief.accent || 'blue', slides: slides };
  };
})();
