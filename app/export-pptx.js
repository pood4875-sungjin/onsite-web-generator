/* export-pptx.js — PPT 덱(iframe 내 .ppt-stack > .slide)을 PowerPoint(.pptx)로 내보내기.
   출처: ~/ppt-template/js/export-pptx.js 포팅. iframe 문서 대상으로 동작하게 수정.
   window.exportPptx(doc, onProgress?) — doc = 덱이 렌더된 document(스튜디오 frame.contentDocument).
   PptxGenJS로 각 요소 좌표/폰트/색 읽어 편집 가능한 텍스트 상자·도형 생성. CDN 지연 로드. */
(function () {
  var PT = 0.75, IN = 1 / 96;
  /* 화면 비율 계약 v1(docs/RATIO_CONTRACT.md) — 슬라이드 규격은 "실측 rect × IN"으로 파생한다.
     px = 인치 × 96 이 계약의 제약(IN=1/96)이라 1280×720(16:9)·1280×960(4:3)·2736×720(3.8:1) 전부
     정수 인치 좌표로 떨어진다. FALLBACK_W/H는 rect를 못 잴 때만 쓰는 16:9 기본값. */
  var FALLBACK_W = 1280, FALLBACK_H = 720;
  function loadScript(src) {
    return new Promise(function (res, rej) {
      if ([].slice.call(document.scripts).some(function (s) { return s.src === src; })) return res();
      var el = document.createElement('script'); el.src = src; el.onload = function () { res(); }; el.onerror = function () { rej(new Error('script load fail: ' + src)); }; document.head.appendChild(el);
    });
  }
  function parseColor(str) {
    if (!str || str === 'transparent' || str === 'none') return { r: 0, g: 0, b: 0, a: 0 };
    var m = str.match(/rgba?\(([^)]+)\)/);
    if (m) { var p = m[1].split(',').map(function (x) { return parseFloat(x.trim()); }); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    /* color(srgb r g b / a) — 크롬이 color-mix() 계산값을 이 형태로 직렬화한다(마일스톤 바 등).
       못 읽으면 검정으로 굳어 바가 전부 까맣게 나가는 사고 → 0~1 채널을 255로 환산 */
    var c = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/);
    if (c) {
      var a = c[4] == null ? 1 : (String(c[4]).indexOf('%') >= 0 ? parseFloat(c[4]) / 100 : parseFloat(c[4]));
      return { r: Math.round(parseFloat(c[1]) * 255), g: Math.round(parseFloat(c[2]) * 255), b: Math.round(parseFloat(c[3]) * 255), a: a };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  function blend(fg, bg) { var a = fg.a; return { r: Math.round(fg.r * a + bg.r * (1 - a)), g: Math.round(fg.g * a + bg.g * (1 - a)), b: Math.round(fg.b * a + bg.b * (1 - a)), a: 1 }; }
  function hex(c) { function h(n) { return ('0' + Math.max(0, Math.min(255, n)).toString(16)).slice(-2).toUpperCase(); } return h(c.r) + h(c.g) + h(c.b); }
  function fontFamily(cs) { var f = (cs.fontFamily || '').split(',')[0].replace(/["']/g, '').trim(); return f || 'Pretendard'; }
  /* 폰트 이식성 — Pretendard는 수신 환경에 Bold 페이스가 없는 경우가 흔해(사용자 실측:
     SemiBold·Regular만 안전) 합성 bold 대신 "실존 페이스명"으로 굵기를 싣는다.
     bold:true를 함께 보내면 SemiBold 위에 또 가짜 볼드가 얹히므로 Pretendard 계열은 항상 bold:false. */
  function faceOf(cs) {
    var fam = fontFamily(cs), w = parseInt(cs.fontWeight, 10) || 400;
    if (/pretendard/i.test(fam)) return { face: w >= 600 ? 'Pretendard SemiBold' : 'Pretendard', bold: false };
    return { face: fam, bold: w >= 600 };
  }

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
    /* hfd 팩(Happy Family Day) */ '.hf-runl', '.hf-hl', '.hf-sub', '.hf-lab', '.hf-cap', '.hf-body', '.hf-klab', '.hf-ktx',
    '.hf-cvtitle', '.hf-cvsub', '.hf-cvdate', '.hf-logo', '.hf-dvno', '.hf-dvtitle', '.hf-dvlead', '.hf-grtx', '.hf-grby',
    '.hf-tocno', '.hf-toclab', '.hf-tocdesc', '.hf-tocpg', '.hf-tocarr', '.hf-numno', '.hf-numhead', '.hf-numtx', '.hf-cellhead', '.hf-celltx',
    '.hf-trow > span', '.hf-tbrow > span', '.hf-srow .k', '.hf-srow .t', '.hf-list li span', '.hf-qtx', '.hf-qby', '.hf-imgph span',
    '.hf-abyear', '.hf-abtitle', '.hf-abcap', '.hf-abfoot', '.hf-abptitle', '.hf-sdtitle', '.hf-sdtx', '.hf-sdfoot',
    '.hf-stnum', '.hf-stcap', '.hf-brow .l', '.hf-brow .v', '.hf-brow .tx', '.hf-kpval', '.hf-phead', '.hf-ptx', '.hf-parr',
    '.hf-cmp ul li', '.hf-rmhead', '.hf-rmlist li', '.hf-half ul li span', '.hf-bsval', '.hf-bscap',
    '.hf-word', '.hf-wdcap', '.hf-sttitle', '.hf-stsub', '.hf-herotitle', '.hf-herosub',
    /* hfd 2026 필 기하(hp-) */ '.hp-wm b', '.hp-wm span', '.hp-cvkick', '.hp-cvtitle', '.hp-dvtitle',
    '.hp-aglab', '.hp-agbdg b', '.hp-aghead', '.hp-agwho', '.hp-sbtitle', '.hp-sbno', '.hp-sblead', '.hp-sbtx',
    '.hp-pqcap span', '.hp-sttitle', '.hp-stsub', '.hp-sttx', '.hp-pill', '.hp-scrtitle', '.hp-scrlist li',
    '.hp-nttitle', '.hp-nthead', '.hp-nttx', '.hp-cctitle', '.hp-ccsub', '.hp-cc .tg', '.hp-cc .vl', '.hp-cc .lb',
    '.hp-f3title', '.hp-f3cap p',
    '.hf-duoval', '.hf-duotx', '.hf-duochip', '.hf-flowhead', '.hf-flowrow b', '.hf-flowrow span', '.hf-flowft', '.hf-flowarr', '.hf-flowfoot',
    '.hf-hswhen', '.hf-hshead', '.hf-hstx', '.hf-pfbadge', '.hf-pfkick', '.hf-pfname', '.hf-pfbody li span', '.hf-pffocus .fl', '.hf-pffocus li', '.hf-pffoot',
    '.hf-bdtitle', '.hf-bdpt .h', '.hf-bdpt .t', '.hf-bdcard .h', '.hf-bdcard .t',
    '.hf-hihead', '.hf-hilead', '.hf-hitx', '.hf-hiimg .ph span',
    '.hf-cnbadge', '.hf-cnbar .v', '.hf-cnbar .x', '.hf-cnunit', '.hf-cnnote .h', '.hf-cnnote .t',
    '.hf-cylab', '.hf-cyblk .h', '.hf-cyblk .t', '.hf-cyside', '.hf-cycore',
    '.hf-dval i', '.hf-dval em', '.hf-dtx', '.hf-dmini.dn span', '.hf-dstat .l', '.hf-dstat .v',
    '.hf-tcbig', '.hf-tcdeck', '.hf-tcprow .no', '.hf-tcprow .lb', '.hf-tcprow .ds',
    '.hf-kbno', '.hf-kblab', '.hf-kbval i', '.hf-kbval em',
    '.hf-wfcol .v', '.hf-wfcol .x', '.hf-wfcol .gap',
    '.hf-mxtag', '.hf-mxlab', '.hf-mxsub', '.hf-mxgroup .h', '.hf-mxgroup li',
    '.hf-t3head', '.hf-t3lead', '.hf-t3body li', '.hf-t3foot',
    '.hf-qdcell .h', '.hf-qdcell li', '.hf-qdcore .l', '.hf-qdcore .h',
    '.hf-oghead', '.hf-oglab', '.hf-ogband', '.hf-ogchip',
    '.hf-lntag', '.hf-lnhead', '.hf-lntx', '.hf-lnbadge', '.hf-bnlead .l', '.hf-bnlead .t', '.hf-bncard .l', '.hf-bncard .h', '.hf-bncard .t',
    '.hf-hlno', '.hf-hlhead', '.hf-hltx', '.hf-hlfn', '.hf-bocard .tg', '.hf-bocard .h', '.hf-bocard .t',
    '.hf-boside .st', '.hf-boside li span', '.hf-boside .pill', '.hf-lsno', '.hf-lslabel', '.hf-lssub',
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
    /* machine 팩(AX Machine, nx-) — 러닝헤더·타이틀·리스트·카드·게이지 텍스트 */
    '.nx-runl', '.nx-runr', '.nx-hl', '.nx-sub', '.nx-foot .nx-ftx', '.nx-foot .nx-ftr',
    '.nx-cvtitle', '.nx-cvlead span', '.nx-cvfoot span', '.nx-cltitle', '.nx-clfoot .l', '.nx-clfoot .r',
    '.nx-sttitle', '.nx-stcol .tg', '.nx-stcol .tx', '.nx-tctitle', '.nx-tocrow .no', '.nx-tocrow .ch', '.nx-tocrow .ds', '.nx-tocrow .pg',
    '.nx-2col .hd', '.nx-2col li i', '.nx-2col li span', '.nx-qlist .hd', '.nx-qlist li', '.nx-qtx',
    '.nx-ref .tt', '.nx-ref .cp', '.nx-ref .ds', '.nx-src', '.nx-lc .cp', '.nx-lc .tt', '.nx-lc .ds', '.nx-band .bt', '.nx-band .bx',
    '.nx-bn .no', '.nx-bn .tt', '.nx-bn .ds', '.nx-ag .cp', '.nx-ag .tt', '.nx-ag .stt', '.nx-ag .ds',
    '.nx-prlab .cp', '.nx-prlab .cr', '.nx-pc .cp', '.nx-pc .tt', '.nx-pc .ds',
    '.nx-dhtitle', '.nx-dhl .cp', '.nx-dhl .ld', '.nx-dhmini .cp', '.nx-dhmini .tt', '.nx-dhmini .ds', '.nx-dhr .cp', '.nx-dhr li',
    '.nx-dktitle', '.nx-dksub', '.nx-sprow .rl', '.nx-sprow .tx', '.nx-ba .cp', '.nx-ba li',
    '.nx-dmtitle', '.nx-dmcol .hd i', '.nx-dmcol .hd b', '.nx-dmcol .tx',
    '.nx-pgl .cp', '.nx-pgl .big b', '.nx-pgl .big i', '.nx-prow .tt', '.nx-prow .pc', '.nx-prow .cp', '.nx-prow .cp2',
    '.nx-rm .cp', '.nx-rm .tt', '.nx-rm li', '.nx-tlc b', '.nx-tlc span', '.nx-chk b', '.nx-chk span', '.nx-shrow i', '.nx-shrow span', '.nx-shimg figcaption', '.ms-m', '.ms-lab', '.ms-bar i', '.ms-phase b', '.ms-phase span',
    /* 마일스톤(전 팩 공통) */ '.ms-ptag', '.ms-phead', '.ms-ptext', '.ms-cap', '.ms-bar b', '.ms-bar span', '.ms-axis span', '.ms-note'].join(',');
  var LIST_SEL = '.block-list li, .p-bullets li, .pr-feats li';
  var SHAPE_SEL = '.row, .cols2 > div, .cols3 > div, .agenda-badge, .cover-arrow, .contact-cell.fill, .ag-div, ' +
    /* pitch 팩(honors 포함 — pitch 포크라 .ch-ph 동일 정의) — 카드·패널·플레이스홀더·라인 장식 */ '.g-cell.card, .g-cell.person, .g-cell.num, .l-cardrow, .pr-card, .t-panel, .sp-panel, .p-media.ph, .tl-dot, .mx-dot, .p-tick, .tl-axis, .tl-lead, .pr-div, .mx-ax, .ps-step, .ps-tag, .ch-ph, ' +
    /* naver 팩 — 카드(보더탑 위계)·패널·밴드·바·게이지 */ '.cv-l, .nv-card, .nv-panel, .cv-band, .dv-panel, .cv-bar, .nv-gauge, .nv-gauge i, .nv-mark i, .sp-tick, .nv-row, .tc-row, .pc-step, .tl-cell, .tl-mark, .tl-axis, .ps-panel, .qt-bar, .tb-row, ' +
    '.nl-cap, .nv-hlbar, .sc-bleed, .cd-band, .ln-rule, .br-rule, .ln-bx, .bd-rule2, .bd-hr, .ps-rule, .ck-li, .ck-icon, .hl-row, .ps-hr, ' +
    /* naver — 행 규칙선(사이드별 보더로 추출) */ '.dv-item, .as-row, .nl-row, .st-col, .bd-foot, ' +
    /* naver — 텍스트만 TEXT_SEL에 있고 배경 도형이 빠져 있던 것 + 의사요소→span 전환(tl-line, 2026-08-24) */ '.rm-lbl, .dv-gfx, .sp-li, .stt-hole, .tl-line, ' +
    /* machine 팩 — 사진·셰이드·라인·바·밴드·게이지 */ '.nx-photo, .nx-shrow, .nx-shade, .nx-dash, .nx-run, .nx-2col li, .nx-qbar, .nx-ref .ln, .nx-lc .ln, .nx-band, .nx-bn .ln, .nx-ag .ln, .nx-pc.on, .nx-prlab .ln, .nx-dhl .ln, .nx-sprow, .nx-ba .ln, .nx-dmcol .ln, .nx-track, .nx-fill, .nx-prow.on, .nx-rm .ln, .nx-tl, .nx-foot, .nx-toclist, .nx-tocrow, .nx-clfoot, .ms-head, .nx-stcol .ln, ' +
    /* rams 팩 — 라운드 카드·행·칩·게이지·원형 */ '.rs-card, .rs-trow, .rs-row, .rs-srow, .rs-spec, .rs-chip, .rs-gauge, .rs-gauge i, .rs-mbar, .rs-hlrow, .rs-play, .rs-ckic, .rs-badge, .rs-hole, .rs-imgph, .rs-qbar, .rs-logo i, .rs-tbrow, .rs-half, ' +
    /* sfmi 팩 — 원·벤·대시·chevron·풋라인 */ '.sf-dash, .sf-numc, .sf-crc, .sf-kpc, .sf-pcc, .sf-cmpc, .sf-lnc, .sf-venn, .sf-bocrc, .sf-bscrc, .sf-chev, .sf-srow, .sf-trow, .sf-tbrow, .sf-list li, .sf-numhead, .sf-tochead, .sf-foot, .sf-bar, .sf-fdash, .sf-needbox, .sf-hlrow, .sf-hlrow .no, .sf-imgph, .sf-qbox, .sf-boside, .sf-lnbadge, ' +
    /* pastel 팩 — 그라데이션 셀·키밴드·바·규칙선 */ '.pg-cell, .pg-stcard, .pg-toccol, .pg-key, .pg-srow, .pg-trow, .pg-tbrow, .pg-brow .tr, .pg-brow .tr i, .pg-rmcol, .pg-step, .pg-cmp, .pg-cvbars span, .pg-dash, .pg-imgph, .pg-leadbox, .pg-hlrow, .pg-list li, .pg-numhead, .pg-lab.bd, .pg-lab.bd0, .pg-clfoot, .pg-side, ' +
    /* hfd 팩 — 밴드·원 기하·셀·카드류(srow·trow는 플레인 행이라 제외) */ '.hf-bandT, .hf-bandB, .hf-circ, .hf-arc, .hf-deco, .hf-abarc, .hf-cell, .hf-toccol, .hf-key, .hf-imgph, .hf-dot, .hf-pstep, .hf-cmp, .hf-rmcol, .hf-half, .hf-brow .tr, .hf-brow .tr i, .hf-tocrow, .hf-herobg, .hf-heroov, ' +
    /* section 카드(.hf-num)·틴트/화이트 필 뱃지류 — 텍스트만 TEXT_SEL에 있고 배경 도형이 빠져 있던 것(2026-08-24 실사고) */
    '.hf-num, .hf-cnbadge, .hf-cylab, .hf-duochip, .hf-kbno, .hf-lnbadge, .hf-oghead, .hf-pfbadge, ' +
    /* border-bottom/top/left 행 규칙선류 — background:만 훑어 놓친 것(2026-08-24, 테이블·스펙 행 라인 실사고) */
    '.hf-tbrow, .hf-trow, .hf-srow, .hf-hlrow, .hf-tcprow, .hf-cnnote, .hf-abcap, .hf-abyear, .hf-sdtx, .hf-bdpt, .hf-pffoot, .hf-t3grid, ' +
    /* 화이트 패널 계열 — 이게 빠지면 기하 위에 텍스트만 떠서 "추출이 안 된" 덱이 된다 */
    '.hf-frpanel, .hf-abpanel, .hf-sdcap, .hf-sdpanel, .hf-abframe, .hf-abband, ' +
    '.hf-duo, .hf-flowcol, .hf-flowhead, .hf-flowrow, .hf-hstep, .hf-hsln, .hf-hsdot, .hf-pfcard, .hf-pfhead, .hf-pffocus, .hf-bdband, .hf-bdcard, .hf-hipanel, .hf-hiimg .ph, .hf-cnchart, .hf-cnbar i, ' +
    '.hf-cyring, .hf-cycore, .hf-dcard, .hf-dstrip, .hf-dmini.br i, .hf-dmini.dn i, .hf-dmini.ar i, ' +
    '.hf-tcblob, .hf-kbcard, .hf-wfcol .tr i, .hf-wfcol .vsbg, .hf-wfcol .gap, .hf-mxpanel, .hf-t3col, .hf-t3head, .hf-qdring, .hf-qdcore, .hf-qdx, .hf-qdy, .hf-ogbox, .hf-ogband, .hf-ogchip, .hf-ogline, .hf-ogdot, ' +
    '.hf-lnrow, .hf-bnlead, .hf-bnstem, .hf-bnbar, .hf-bncard, .hf-bocard, .hf-boside, .hf-lsrow, .hf-lsno, .hf-dmini.gg i, ' +
    /* hfd 2026 필 기하(hp-) — 커버·간지 필/존, 아젠다 패널·뱃지, 사이드바, 노트, 원형, 프레임 */
    '.hp-cvb2, .hp-cvband, .hp-cvsg, .hp-cvdt, .hp-cva, .hp-dvp1, .hp-dvp2, .hp-dv2a, .hp-dv2b, .hp-dv2c, .hp-dv2o, ' +
    '.hp-agpanel, .hp-agbdg b, .hp-agrow, .hp-sbbar, .hp-pqv, .hp-pqh, .hp-pqcap i, .hp-strule, ' +
    '.hp-scrbg1, .hp-scrbg2, .hp-scrrule, .hp-scrpanel, .hp-ntedge, .hp-ntrule, .hp-cc, .hp-f3sg, .hp-f3fr, .hp-f3rule, .hp-pill, .hp-stframe, ' +
    /* 마일스톤(전 팩 공통) */ '.ms-phase, .ms-ptag, .ms-bar, .ms-glines i, .ms-axis, .ms-note';

  function rel(el, origin) { var r = el.getBoundingClientRect(); return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height }; }

  /* 인라인 강약 → pptx 텍스트 런 — 타이틀의 <b>(볼드)·톤 스팬(.mut 등)이 통짜로 뭉개지던 문제.
     스타일이 전부 같으면 null(기존 단일 텍스트 경로 유지). */
  function runsOf(win, el, slideBg) {
    if (!el.querySelector('b,strong,i,em,span')) return null;
    var runs = [];
    function push(t, cs) {
      if (!t) return;
      runs.push({ text: t.replace(/ /g, ' '), options: {
        bold: faceOf(cs).bold,
        fontFace: faceOf(cs).face,
        italic: cs.fontStyle === 'italic',
        color: hex(blend(parseColor(cs.color), slideBg)),
      } });
    }
    function walk(node, cs) {
      if (node.nodeType === 3) { push(node.textContent, cs); return; }
      if (node.nodeType !== 1) return;
      if (node.tagName === 'BR') { if (runs.length) runs[runs.length - 1].options.breakLine = true; return; }
      var c2 = win.getComputedStyle(node);
      if (c2.display === 'none' || parseColor(c2.color).a <= 0.01) return;
      for (var c = node.firstChild; c; c = c.nextSibling) walk(c, c2);
    }
    var base = win.getComputedStyle(el);
    for (var c = el.firstChild; c; c = c.nextSibling) walk(c, base);
    while (runs.length && !runs[runs.length - 1].text.trim()) runs.pop();
    var f = runs[0]; if (!f || runs.length < 2) return null;
    var same = runs.every(function (r) { return r.options.bold === f.options.bold && r.options.fontFace === f.options.fontFace && r.options.color === f.options.color && r.options.italic === f.options.italic; });
    return same ? null : runs;
  }

  function addTextBox(win, s, el, origin, slideBg) {
    var cs = win.getComputedStyle(el);
    var txt = (el.innerText || el.textContent || '').replace(/ /g, ' ').trimEnd();
    if (!txt.trim()) return;
    var r = rel(el, origin); if (r.w < 2 || r.h < 2) return;
    /* 텍스트 상자 = 요소 박스가 아니라 글자가 실제 그려진 라인박스 사각형(Range 실측).
       flex 세로 중앙(원형 번호·허브 라벨)·패딩이 있어도 렌더 위치와 일치한다. 실패 시 요소 박스 유지. */
    try {
      var rg = el.ownerDocument.createRange(); rg.selectNodeContents(el);
      var rb = rg.getBoundingClientRect();
      if (rb && rb.width > 1 && rb.height > 1) r = { x: rb.left - origin.left, y: rb.top - origin.top, w: rb.width, h: rb.height };
    } catch (e) {}
    var fs = parseFloat(cs.fontSize) || 16;
    var col = blend(parseColor(cs.color), slideBg);
    /* 투명 글자 = 그라데이션 클립 텍스트(-webkit-background-clip:text) 또는 아웃라인 스트로크.
       PPT 텍스트는 그라데이션 채우기가 없다 → 그라데이션 중간 스톱 색(또는 스트로크 색)의
       단색 텍스트로 근사해 "보이고 편집 가능한" 글자로 내보낸다. */
    if (parseColor(cs.color).a <= 0.01) {
      var bclip = cs.webkitBackgroundClip || cs.backgroundClip || '';
      var stops = bclip === 'text' ? String(cs.backgroundImage || '').match(/rgba?\([^)]+\)/g) : null;
      var strokeW = parseFloat(cs.webkitTextStrokeWidth) || 0;
      if (stops && stops.length) col = blend(parseColor(stops[Math.floor(stops.length / 2)]), slideBg);
      else if (strokeW > 0) col = blend(parseColor(cs.webkitTextStrokeColor || ''), slideBg);
      else return;   // 진짜 투명(장식)은 스킵
    }
    /* 줄간격 — CSS line-height(px)를 "정확히" 포인트로. 예전의 lineSpacingMultiple(배수)은
       PPT에서 폰트 고유 줄높이(≈1.2em)에 다시 곱해져 렌더보다 줄이 벌어졌다(2줄 타이틀 어긋남).
       pptxgenjs lineSpacing = spcPts(정확값, 포인트) → 브라우저 라인박스와 1:1. */
    var lh = cs.lineHeight, lhExact = (lh && lh !== 'normal') ? parseFloat(lh) : 0;
    var ls = (cs.letterSpacing && cs.letterSpacing !== 'normal') ? parseFloat(cs.letterSpacing) * PT : 0;
    var align = cs.textAlign === 'right' ? 'right' : cs.textAlign === 'center' ? 'center' : 'left';
    var vertical = (cs.writingMode || '').indexOf('vertical') >= 0;
    /* 줄바꿈 방어 — 상자 폭을 브라우저에서 잰 값 그대로 쓰면, 파워포인트에 Pretendard가 없어
       더 넓은 대체 폰트로 그려질 때 텍스트가 상자를 넘는다. 한글은 파워포인트에서 글자 단위로
       줄바꿈되므로 단어가 쪼개져 "띄어쓴 것처럼" 보인다.
       → 브라우저에서 한 줄로 렌더된 요소는 wrap을 끄고(절대 줄바꿈 안 함),
         여러 줄 요소는 폭에 여유를 준다. 늘어난 폭은 정렬 방향에 맞춰 흡수(우/중앙 정렬 밀림 방지). */
    var lhPx = lhExact || fs * 1.2;
    // 브라우저에서 자동 줄바꿈이 일어났는지 = 렌더된 줄 수가 <br>로 만든 줄 수보다 많은지
    var explicitLines = txt.split('\n').length, renderedLines = Math.max(1, Math.round(r.h / lhPx));
    var oneLine = renderedLines <= explicitLines;
    var baseW = Math.max(r.w, 6);
    // 여유 폭 상한 = 슬라이드 오른쪽 끝까지. origin은 그 장의 실측 rect라 비율(16:9·4:3·3.8:1)이 뭐든 정확하다.
    // rect를 못 재는 예외 상황에서만 기본 캔버스 폭(16:9=1280)으로 폴백
    var slackW = Math.min(baseW * (oneLine ? 0.16 : 0.06), Math.max(0, (origin.width || FALLBACK_W) - r.x - baseW));
    var boxW = baseW + slackW, boxX = r.x;
    if (align === 'right') boxX = r.x - slackW;
    else if (align === 'center') boxX = r.x - slackW / 2;
    var fc = faceOf(cs);
    var opts = { x: boxX * IN, y: r.y * IN, w: boxW * IN, h: Math.max(r.h, 8) * IN, fontSize: fs * PT, color: hex(col), bold: fc.bold, italic: cs.fontStyle === 'italic', fontFace: fc.face, align: align, valign: 'top', margin: 0, charSpacing: ls || undefined, lineSpacing: lhExact ? lhExact * PT : undefined, wrap: !oneLine };
    if (vertical) { var cx = r.x + r.w / 2, cy = r.y + r.h / 2; opts.w = Math.max(r.h, 6) * IN; opts.h = Math.max(r.w, 8) * IN; opts.x = cx * IN - opts.w / 2; opts.y = cy * IN - opts.h / 2; opts.rotate = 270; opts.align = 'center'; opts.valign = 'middle'; }
    var runs = parseColor(cs.color).a > 0.01 && !vertical ? runsOf(win, el, slideBg) : null;
    if (runs) s.addText(runs, opts); else s.addText(txt, opts);
  }
  /* 채움 — 반투명(rgba)은 슬라이드 배경과 섞지 말고 진짜 투명도로 내보낸다.
     예전 blend(slideBg 합성)는 "흰 슬라이드 위 흰 14% 원"을 불투명 흰색으로 만들어
     표지 밴드를 통째로 덮었다(좌측 절반 흰색 사고). PPT z-스택 어디에 얹혀도 원본과 같게. */
  function fillOf(c, slideBg) {
    if (c.a >= 0.99) return { color: hex(blend(c, slideBg)) };
    return { color: hex(c), transparency: Math.round((1 - c.a) * 100) };
  }
  function addShapeBox(win, pptx, s, el, origin, slideBg) {
    var cs = win.getComputedStyle(el); var r = rel(el, origin); if (r.w < 3 && r.h < 3) return;   // 한 축만 얇은 것(라인)은 허용
    var fill = parseColor(cs.backgroundColor);
    /* border-radius 50% 같은 %값은 computed에도 %로 남는다 — px로 오독하면(50px 취급)
       1350px 원이 라운드 사각형으로 나간다(표지 원 기하 사고) → 짧은 변 기준 환산 */
    var radS = String(cs.borderTopLeftRadius || ''), rad = parseFloat(radS) || 0;
    if (radS.indexOf('%') >= 0) rad = rad / 100 * Math.min(r.w, r.h);
    var sides = ['Top', 'Right', 'Bottom', 'Left'].map(function (k) {
      return { w: parseFloat(cs['border' + k + 'Width']) || 0, c: parseColor(cs['border' + k + 'Color']), k: k };
    }).map(function (b) { if (b.c.a <= 0.01) b.w = 0; return b; });
    var on = sides.filter(function (b) { return b.w > 0; });
    if (fill.a <= 0.01 && !on.length) return;
    var uniform = on.length === 4 && on.every(function (b) { return b.w === on[0].w && hex(b.c) === hex(on[0].c); });
    if (uniform || !on.length) {
      var opts = { x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN, fill: fill.a > 0.01 ? fillOf(fill, slideBg) : { type: 'none' }, line: uniform ? { color: hex(blend(on[0].c, slideBg)), width: Math.max(0.5, on[0].w * PT) } : { type: 'none' } };
      var minWH = Math.min(r.w, r.h);
      if (rad >= minWH / 2 - 0.5) {
        // 정원(가로세로 비슷)만 타원 — 길쭉한 필(pill)을 타원으로 내면 럭비공이 된다
        if (Math.abs(r.w - r.h) <= Math.max(3, minWH * 0.08)) { s.addShape(pptx.ShapeType.ellipse, opts); return; }
        // 필(스타디움) — pptxgenjs adj = rectRadius/min(w,h)이므로 min/2가 정확한 최대 라운드
        opts.rectRadius = (minWH / 2) * IN;
        s.addShape(pptx.ShapeType.roundRect, opts); return;
      }
      if (rad > 0) opts.rectRadius = Math.min(rad, minWH / 2) * IN;   // 예전 0.2in 상한 제거 — adj 환산이 정확해 그대로 신뢰
      s.addShape(rad > 0 ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, opts);
      return;
    }
    /* 사이드별 보더 — 위계선(카드 border-top, 행 규칙선)은 그 변에만 얇은 선을 그린다.
       예전엔 borderTop을 4면 테두리로 둘러버려 원본과 다르게 나갔다. */
    if (fill.a > 0.01) s.addShape(pptx.ShapeType.rect, { x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN, fill: fillOf(fill, slideBg), line: { type: 'none' } });
    on.forEach(function (b) {
      var o = { fill: fillOf(b.c, slideBg), line: { type: 'none' } };
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
    /* 슬라이드 규격 = 첫 장의 실측 rect(= 팩이 --slide-w/h로 그린 캔버스) → 커스텀 레이아웃.
       defineLayout은 addSlide보다 먼저 1회만 가능하므로 루프 밖에서 첫 장을 미리 잰다.
       LAYOUT_WIDE(13.333×7.5) 고정이던 것을 이걸로 대체 — 16:9는 값이 같아 결과 동일(하위호환). */
    var first = slides[0].getBoundingClientRect();
    var layW = (first.width > 10 ? first.width : FALLBACK_W) * IN;
    var layH = (first.height > 10 ? first.height : FALLBACK_H) * IN;
    var pptx = new PptxGenJS();
    try { pptx.defineLayout({ name: 'CUSTOM', width: layW, height: layH }); pptx.layout = 'CUSTOM'; }
    catch (e) { pptx.layout = 'LAYOUT_WIDE'; }
    for (var i = 0; i < slides.length; i++) {
      if (onProgress) onProgress(i + 1, slides.length);
      var slide = slides[i], origin = slide.getBoundingClientRect();
      var slideBg = parseColor(win.getComputedStyle(slide).backgroundColor); if (slideBg.a < 1) slideBg = blend(slideBg, { r: 255, g: 255, b: 255, a: 1 });
      var s = pptx.addSlide(); s.background = { color: hex(slideBg) };
      if (win.html2canvas) { var bgData = await slideBgImage(win, slide); if (bgData) s.background = { data: bgData }; }
      /* ---- 개체 수집 → DOM 문서 순서로 정렬해 z-순서 보존 ----
         예전엔 이미지→SVG→캔버스→도형 "패스 순서"로 얹어서, 밴드 위 로고·카드 안 사진이
         뒤에 나온 도형에 덮였다(표지 로고 실종). PPT z-순서 = 삽입 순서이므로
         DOM 순서(부모가 아래, 뒤 요소가 위)로 넣는다. 텍스트는 여전히 마지막(항상 최상단). */
      var tasks = [];
      function addTask(el, run) { tasks.push({ el: el, run: run }); }
      // 슬라이드 이미지(.s-img 등 data-URI <img>) → 편집 가능한 이미지 개체로
      [].slice.call(slide.querySelectorAll('img')).forEach(function (iel) {
        addTask(iel, async function () {
          var r = rel(iel, origin); if (r.w < 3 || r.h < 3) return;
          var src = iel.currentSrc || iel.src || '';
          if (src.indexOf('data:') !== 0 && /^https?:/.test(src)) {
            // 외부 사진(건축 이미지 등) — CORS 허용 소스는 데이터로 변환해 싣는다. 실패 시 스킵
            try {
              var rsp = await win.fetch(src, { mode: 'cors' }); var bl2 = await rsp.blob();
              src = await new Promise(function (res3, rej3) { var fr2 = new FileReader(); fr2.onload = function () { res3(fr2.result); }; fr2.onerror = rej3; fr2.readAsDataURL(bl2); });
            } catch (e) { return; }
          }
          if (String(src).indexOf('data:') !== 0) return;
          try { s.addImage({ data: src, x: r.x * IN, y: r.y * IN, w: r.w * IN, h: r.h * IN, sizing: { type: 'crop', w: r.w * IN, h: r.h * IN } }); } catch (e) {}
        });
      });
      // SVG 전부 → PNG로 래스터화해 이미지 개체로(차트·나침반·궤도·로드맵 라인·부챗살 등 팩 그래픽 포함).
      // 특정 클래스만 골라내면 새 팩 그래픽이 조용히 누락된다 — 화면에 보이는 svg는 전부 내보낸다.
      [].slice.call(slide.querySelectorAll('svg')).forEach(function (el2) {
        addTask(el2, async function () {
          var r2 = rel(el2, origin); if (r2.w < 3 || r2.h < 3) return;
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
        });
      });
      // 도넛(conic-gradient) — SVG도 도형도 아니라서 추출에 안 걸린다 → 캔버스로 링을 직접 그려 이미지로
      [].slice.call(slide.querySelectorAll('.nv-donut, .rs-donut')).forEach(function (el) { addTask(el, function () {
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
      }); });
      /* hfd 원형 그래픽 — conic·마스크는 html2canvas가 못 그린다 → 캔버스로 직접.
         색은 computed backgroundImage에 브라우저가 var()를 치환해 넣은 rgb를 그대로 쓴다. */
      function hfArc(el, opts) {
        var r6 = rel(el, origin); if (r6.w < 6) return;
        var cs6 = win.getComputedStyle(el);
        var cols = String(cs6.backgroundImage || '').match(/rgba?\([^)]+\)/g) || [];
        var accent = cols[0] || '#309479', track = opts.track ? (cols[1] || '#E3E8E5') : null;
        var pm = String(el.getAttribute('style') || '').match(/0 ([\d.]+)%/);
        var pct = pm ? Math.min(100, parseFloat(pm[1]) * (opts.half ? 2 : 1)) : 100;
        var W6 = r6.w, H6 = opts.half ? r6.w / 2 : r6.h;
        var c6 = doc.createElement('canvas'); c6.width = W6 * 2; c6.height = H6 * 2;
        var g6 = c6.getContext('2d'); g6.scale(2, 2);
        var outR = W6 / 2, holeR = opts.hole, midR = (outR + holeR) / 2;
        g6.lineWidth = outR - holeR;
        var a0 = opts.half ? Math.PI : -Math.PI / 2;
        var span = opts.half ? Math.PI : Math.PI * 2;
        if (track) { g6.strokeStyle = track; g6.beginPath(); g6.arc(outR, outR * (opts.half ? 1 : (r6.h / r6.w)), midR, a0, a0 + span); g6.stroke(); }
        g6.strokeStyle = accent; g6.beginPath(); g6.arc(outR, outR, midR, a0, a0 + span * pct / 100); g6.stroke();
        try { s.addImage({ data: c6.toDataURL('image/png'), x: r6.x * IN, y: r6.y * IN, w: W6 * IN, h: H6 * IN }); } catch (e) {}
      }
      [].slice.call(slide.querySelectorAll('.hf-dmini.dn i')).forEach(function (el) { addTask(el, function () { hfArc(el, { hole: 35, track: true }); }); });
      [].slice.call(slide.querySelectorAll('.hf-dmini.gg i')).forEach(function (el) { addTask(el, function () { hfArc(el, { hole: 41, track: true, half: true }); }); });
      [].slice.call(slide.querySelectorAll('.hf-qdring')).forEach(function (el) { addTask(el, function () { hfArc(el, { hole: 117 }); }); });
      /* 반원 아크(hfd cycle) — 보더 원 + inset 클립이라 도형으론 반원이 안 된다 → 캔버스 스트로크 */
      [].slice.call(slide.querySelectorAll('.hf-cyarc')).forEach(function (el) {
        addTask(el, function () {
          var r7 = rel(el, origin); if (r7.w < 6 || r7.h < 6) return;
          var cs7 = win.getComputedStyle(el);
          var bw7 = parseFloat(cs7.borderTopWidth) || 2, col7 = parseColor(cs7.borderTopColor);
          var im7 = String(cs7.clipPath || '').match(/inset\(([^)]+)\)/);
          var tks = im7 ? im7[1].trim().split(/\s+/) : ['0%'];
          var t4 = [tks[0], tks[1] != null ? tks[1] : tks[0], tks[2] != null ? tks[2] : tks[0], tks[3] != null ? tks[3] : (tks[1] != null ? tks[1] : tks[0])];
          function uv(tok, base) { var v = parseFloat(tok) || 0; return String(tok).indexOf('%') >= 0 ? v / 100 * base : v; }
          var ct = uv(t4[0], r7.h), cr = uv(t4[1], r7.w), cb = uv(t4[2], r7.h), cl = uv(t4[3], r7.w);
          var c7 = doc.createElement('canvas'); c7.width = r7.w * 2; c7.height = r7.h * 2;
          var g7 = c7.getContext('2d'); g7.scale(2, 2);
          g7.beginPath(); g7.rect(cl, ct, Math.max(0, r7.w - cl - cr), Math.max(0, r7.h - ct - cb)); g7.clip();
          g7.lineWidth = bw7; g7.strokeStyle = 'rgba(' + col7.r + ',' + col7.g + ',' + col7.b + ',' + col7.a + ')';
          g7.beginPath(); g7.ellipse(r7.w / 2, r7.h / 2, (r7.w - bw7) / 2, (r7.h - bw7) / 2, 0, 0, Math.PI * 2); g7.stroke();
          try { s.addImage({ data: c7.toDataURL('image/png'), x: r7.x * IN, y: r7.y * IN, w: r7.w * IN, h: r7.h * IN }); } catch (e) {}
        });
      });
      /* clip-path 폴리곤(미니 에어리어 차트·chevron 등) — html2canvas는 clip-path를 무시하고
         네모로 굽는다 → 캔버스에 폴리곤을 직접 그린다. 색은 그라디언트 스톱(없으면 배경색).
         calc(P% ± Npx)까지 지원, 그 외 못 읽는 좌표면 false(기존 경로 폴백). */
      function polyShape(el, cs6) {
        var r6 = rel(el, origin); if (r6.w < 3 || r6.h < 3) return false;
        var pm = String(cs6.clipPath || '').match(/polygon\(([^)]+)\)/); if (!pm) return false;
        function pv(tok, base) {
          tok = String(tok).trim();
          var c = tok.match(/^calc\(\s*([-\d.]+)%\s*([+-])\s*([-\d.]+)px\s*\)$/);
          if (c) return parseFloat(c[1]) / 100 * base + (c[2] === '-' ? -1 : 1) * parseFloat(c[3]);
          if (/^calc\(/.test(tok)) return NaN;
          var v = parseFloat(tok); if (isNaN(v)) return NaN;
          return tok.indexOf('%') >= 0 ? v / 100 * base : v;
        }
        var bad = false;
        var pts = pm[1].split(',').map(function (pair) {
          var t = pair.trim().match(/calc\([^)]*\)|[-\d.]+(?:px|%)?/g) || [];
          var x = pv(t[0], r6.w), y = pv(t[1] != null ? t[1] : t[0], r6.h);
          if (!isFinite(x) || !isFinite(y)) bad = true;
          return [x, y];
        });
        if (bad || pts.length < 3) return false;
        var c6 = doc.createElement('canvas'); c6.width = Math.max(2, r6.w * 2); c6.height = Math.max(2, r6.h * 2);
        var g6 = c6.getContext('2d'); g6.scale(2, 2);
        var stops = String(cs6.backgroundImage || '').match(/rgba?\([^)]+\)|color\(srgb[^)]+\)/g) || [];
        if (stops.length) {
          var lg = g6.createLinearGradient(0, 0, 0, r6.h);
          var c0 = parseColor(stops[0]), c1 = parseColor(stops[stops.length - 1]);
          lg.addColorStop(0, 'rgba(' + c0.r + ',' + c0.g + ',' + c0.b + ',' + c0.a + ')');
          lg.addColorStop(1, 'rgba(' + c1.r + ',' + c1.g + ',' + c1.b + ',' + (stops.length > 1 ? c1.a : 0) + ')');
          g6.fillStyle = lg;
        } else {
          var bc6 = parseColor(cs6.backgroundColor); if (bc6.a <= 0.01) return false;
          g6.fillStyle = 'rgba(' + bc6.r + ',' + bc6.g + ',' + bc6.b + ',' + bc6.a + ')';
        }
        g6.beginPath(); g6.moveTo(pts[0][0], pts[0][1]);
        for (var pi = 1; pi < pts.length; pi++) g6.lineTo(pts[pi][0], pts[pi][1]);
        g6.closePath(); g6.fill();
        try { s.addImage({ data: c6.toDataURL('image/png'), x: r6.x * IN, y: r6.y * IN, w: r6.w * IN, h: r6.h * IN }); } catch (e) { return false; }
        return true;
      }
      /* 그라디언트 폴백 — html2canvas 실패(색 함수 미지원 등)·부재 시 캔버스로 직접.
         스톱 색만 실측(균등 배치 근사) + 각도 + 라운드 클립. 카드가 통째로 사라지는 것 방지. */
      function gradCanvas(el, cs6) {
        var r6 = rel(el, origin); if (r6.w < 3 || r6.h < 3) return;
        var stops = String(cs6.backgroundImage || '').match(/rgba?\([^)]+\)|color\(srgb[^)]+\)/g) || [];
        if (!stops.length) return;
        var am = String(cs6.backgroundImage).match(/linear-gradient\(\s*(-?[\d.]+)deg/);
        var ang = (am ? parseFloat(am[1]) : 180) * Math.PI / 180;   // CSS 기본 180deg(위→아래)
        var vx = Math.sin(ang), vy = -Math.cos(ang);
        var L = Math.abs(r6.w * vx) + Math.abs(r6.h * vy) || r6.h;
        var c6 = doc.createElement('canvas'); c6.width = Math.max(2, r6.w * 2); c6.height = Math.max(2, r6.h * 2);
        var g6 = c6.getContext('2d'); g6.scale(2, 2);
        var lg = g6.createLinearGradient(r6.w / 2 - vx * L / 2, r6.h / 2 - vy * L / 2, r6.w / 2 + vx * L / 2, r6.h / 2 + vy * L / 2);
        stops.forEach(function (st, si) {
          var c = parseColor(st);
          lg.addColorStop(stops.length > 1 ? si / (stops.length - 1) : 0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')');
        });
        var radS6 = String(cs6.borderTopLeftRadius || ''), rad6 = parseFloat(radS6) || 0;
        if (radS6.indexOf('%') >= 0) rad6 = rad6 / 100 * Math.min(r6.w, r6.h);
        rad6 = Math.min(rad6, Math.min(r6.w, r6.h) / 2);
        g6.beginPath();
        if (g6.roundRect) g6.roundRect(0, 0, r6.w, r6.h, rad6); else g6.rect(0, 0, r6.w, r6.h);
        g6.fillStyle = lg; g6.fill();
        try { s.addImage({ data: c6.toDataURL('image/png'), x: r6.x * IN, y: r6.y * IN, w: r6.w * IN, h: r6.h * IN }); } catch (e) {}
      }
      /* 도형·그라데이션 요소 — DOM 순서 그대로 태스크로. 그라데이션 배경(backgroundColor 없음)은
         html2canvas 래스터(자식 잠시 숨김), 실패 시 gradCanvas 폴백. 텍스트는 아래 TEXT 패스가 얹는다. */
      [].slice.call(slide.querySelectorAll(SHAPE_SEL)).forEach(function (gel) {
        addTask(gel, async function () {
          var cs4 = win.getComputedStyle(gel);
          // hfd 원형(도넛·게이지·링·반원 아크)은 전용 캔버스 핸들러가 그림 — 이중 추출 방지
          if (gel.matches && gel.matches('.hf-dmini.dn i,.hf-dmini.gg i,.hf-qdring,.hf-cyarc')) return;
          if (String(cs4.clipPath || '').indexOf('polygon(') >= 0 && polyShape(gel, cs4)) return;
          if (cs4.backgroundImage && cs4.backgroundImage.indexOf('gradient') >= 0) {
            var gr = rel(gel, origin);
            var drawn = false;
            if (win.html2canvas && gr.w >= 3 && gr.h >= 3) {
              var gkids = [].slice.call(gel.children), gprev = gkids.map(function (k) { return k.style.visibility; });
              gkids.forEach(function (k) { k.style.visibility = 'hidden'; });
              try {
                var gcv = await win.html2canvas(gel, { backgroundColor: null, scale: 1, logging: false });
                s.addImage({ data: gcv.toDataURL('image/png'), x: gr.x * IN, y: gr.y * IN, w: gr.w * IN, h: gr.h * IN });
                drawn = true;
              } catch (e) {}
              finally { gkids.forEach(function (k, j) { k.style.visibility = gprev[j]; }); }
            }
            if (!drawn) gradCanvas(gel, cs4);
            /* 그라데이션은 이미지로 나감 — 보더만 남았으면 보더용으로 계속 */
            var hasB = ['Top', 'Right', 'Bottom', 'Left'].some(function (k) { return (parseFloat(cs4['border' + k + 'Width']) || 0) > 0; });
            if (!hasB) return;
          }
          addShapeBox(win, pptx, s, gel, origin, slideBg);
        });
      });
      /* DOM 문서 순서로 정렬 후 순차 실행 — compareDocumentPosition FOLLOWING(4)=앞선 요소 먼저 */
      tasks.sort(function (a, b) {
        if (a.el === b.el) return 0;
        var p = a.el.compareDocumentPosition(b.el);
        return (p & 4) ? -1 : (p & 2) ? 1 : 0;
      });
      for (var tk = 0; tk < tasks.length; tk++) await tasks[tk].run();
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
