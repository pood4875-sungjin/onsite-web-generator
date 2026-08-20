/* packs.mbmtoss.js — "Toss Green" 세미나·이벤트 랜딩 팩 (MBM × toss.im 번안). classic <script src>.
   소스: packs.mbmtoss.sample.html 시안 (SK MBM Figma 412-46110 콘텐츠 × toss.im 실측 스케일/모션).
   구성(고정 TEMPLATE): GNB(투명→화이트) → KV 핀 280vh(영상/실사 풀블리드 → 타이포 페이드 → 카드 축소+블러 → 슬로건)
   → [movable] about(수치 3열 카운트업) → chips(인라인 칩 슬로건) → areas(스텝 스크럽 340vh + 파스텔 글래스 패널)
   → narrative(다크 블러 리빌 250vh) → session(다크그린 존 카드) → zig(지그재그 3) → typeline(타이핑 스크럽 220vh)
   → event(혜택 카드 3) → location(지도 SVG+주소 바) → faq(아코디언) → ctaband(그라데이션 모션 밴드)
   → 고정 apply(라이트 폼) → footer → dock(플로팅 CTA 바).
   실측 토큰: 그린 #05D16E/#04B863/민트 #96F2C4 · 잉크 #191F28 · 그레이 4단 · 면 #F9FAFB/#F2F4F6
   · 다크 #121419 · 세션 존 #0E241A · 히어로 88px w700 · 장면 타이틀 48px · 컨테이너 1200 · pill r100 · 카드 r26.
   모션: 핀 스크럽 4종(히어로·스텝·내러티브·타이핑) + 배경 존 전환(h.place 문법) + 리빌·카운트업·칩 팝 + 독.
   opts.motion===false 또는 prefers-reduced-motion → 전부 정적 폴백(핀 해제·완성 상태 출고). */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }

  var BASE = (function () { try { var sc = document.currentScript && document.currentScript.src || ''; return sc ? sc.slice(0, sc.lastIndexOf('/') + 1) : ''; } catch (e) { return ''; } })();
  BASE = BASE.replace(/packs\/(ppt|web|edm)\/$/, 'app/');
  var PROD = 'https://midas-drs.pages.dev/app/';
  function att(rel) { return BASE + 'bg/' + rel; }
  /* 이미지 onerror 2단 폴백: 로컬 → 프로드 → 회색 ph */
  function imFall(rel, phGlyph) {
    return 'onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + PROD + 'bg/' + rel + '\';}else{this.parentNode.className=\'ph\';this.remove();}"';
  }

  /* 컬러 테마 5종 — shared.theme으로 선택 (기본 green). brand/deep/mint(연 틴트)/ink(진한 텍스트)/zone(세션 존)/card(세션 카드) */
  var THEMES = {
    green:  { brand: '#05D16E', deep: '#04B863', mint: '#96F2C4', bink: '#067A43', zone: '#0E241A', card: '#142A1E', ph: '#1C3A29' },
    blue:   { brand: '#3182F6', deep: '#1B64DA', mint: '#A9CCFB', bink: '#1957C2', zone: '#0D1B2E', card: '#12263F', ph: '#1B3557' },
    purple: { brand: '#6735E6', deep: '#5B28CE', mint: '#C6B2F5', bink: '#4B2AAF', zone: '#191233', card: '#241B47', ph: '#2F2458' },
    orange: { brand: '#FF5500', deep: '#E64A00', mint: '#FFC9A8', bink: '#B23B00', zone: '#2A160A', card: '#3A1E0E', ph: '#4A2812' },
    red:    { brand: '#F04452', deep: '#D63340', mint: '#FBB6BC', bink: '#B22833', zone: '#2B1013', card: '#3D171C', ph: '#4D1D23' },
  };

  var HERO_MP4 = 'mbmtoss-hero.mp4', HERO_POSTER = 'mbmtoss-hero3.jpg';
  var IMG_SES = ['mbmtoss-session.jpg', 'mbmtoss-mic.jpg', 'mbmtoss-company.jpg'];
  var IMG_ZIG = ['mbmtoss-insight.jpg', 'mbmtoss-experience.jpg', 'mbmtoss-network.jpg'];
  var IMG_EV = ['mbmtoss-ev1.jpg', 'mbmtoss-ev2.jpg', 'mbmtoss-ev3.jpg'];

  /* 스텝 우측 파스텔 글래스 패널 4로테이션 — toss 파스텔 카드 실측 문법 (팩 고정 그래픽) */
  var PV_BG = [
    'radial-gradient(120% 100% at 15% 0%,#C7D8FA 0%,rgba(199,216,250,0) 60%),radial-gradient(110% 90% at 85% 100%,#E8D8F6 0%,rgba(232,216,246,0) 55%),linear-gradient(160deg,#E7EEFA,#F0EDF8)',
    'radial-gradient(120% 100% at 20% 0%,#C4E0F8 0%,rgba(196,224,248,0) 60%),radial-gradient(110% 90% at 85% 100%,#CFF0E2 0%,rgba(207,240,226,0) 55%),linear-gradient(160deg,#E4F0FA,#EAF6F0)',
    'radial-gradient(120% 100% at 18% 0%,#FAD9C6 0%,rgba(250,217,198,0) 60%),radial-gradient(110% 90% at 85% 100%,#CBDCF8 0%,rgba(203,220,248,0) 55%),linear-gradient(160deg,#FAEDE4,#EDF1FA)',
    'radial-gradient(120% 100% at 18% 0%,#C8EEDC 0%,rgba(200,238,220,0) 60%),radial-gradient(110% 90% at 85% 100%,#DCD8F8 0%,rgba(220,216,248,0) 55%),linear-gradient(160deg,#E8F6EE,#ECEAF9)',
  ];
  function pvMini(i, TT) {
    var M = TT.pv[i % 4];
    if (i % 4 === 2) {
      return '<div class="mini"><div class="mt">' + esc(M.mt) + '</div><div class="mb">' + esc(M.mb) + '</div>' +
        '<div class="mbar"><i style="height:38%"></i><i style="height:56%"></i><i style="height:47%"></i><i class="hot" style="height:88%"></i></div></div>';
    }
    var rows = M.rows.map(function (r) {
      return '<div class="mrow' + (r.hl ? ' hl' : '') + '"><span class="dot">' + r.ic + '</span>' + esc(r.t) + '<span class="val">' + esc(r.v) + '</span></div>';
    }).join('');
    return '<div class="mini"><div class="mt">' + esc(M.mt) + '</div><div class="mb">' + esc(M.mb) + (i % 4 === 3 ? ' <span class="chipA">A+</span>' : '') + '</div>' +
      (i % 4 !== 3 ? '<div class="grow"><i style="width:' + (i % 4 === 0 ? 78 : 62) + '%"></i></div>' : '') + rows + '</div>';
  }

  /* 데모 기본 콘텐츠 — 시안 원문(HR Growth 2026). AI 초안(compose-web)이 오면 전부 교체된다 */
  var DEMO = {
    productName: 'HR Growth 2026',
    tagline: 'The New Era of\nHR x AI Performance',
    subcopy: 'HR의 다음 10년을\n먼저 만나는 날',
    primaryCta: '신청하기',
    navTitle: 'H.',
    navLinks: ['ABOUT', 'SESSION', 'EVENT', 'LOCATION'],
    features: [
      { title: '진단', desc: 'AI 데이터 진단으로 조직의 현재를 객관적으로 읽어냅니다.\n감이 아닌 데이터로 올바른 성장 방향을 정립합니다.' },
      { title: '교육', desc: '진단 데이터를 바탕으로 구성원 맞춤 성장 가이드를 제시합니다.\nAI 롤플레잉 훈련으로 실무 적용력까지 체계적으로 끌어올립니다.' },
      { title: '성과', desc: 'AI 기술을 접목해 성과관리의 패러다임을 전환합니다.\n목표 수립부터 리뷰까지, 현장에서 검증된 실전 사례로 다룹니다.' },
      { title: '평가', desc: '조직에 꼭 맞는 평가 프로세스로 정교한 평가를 완성합니다.\n구성원이 납득하는 공정한 평가 경험을 설계합니다.' },
    ],
    stats: [
      { value: '90%', label: '기업 90%가\nHR에 AI를 도입했어요' },
      { value: '75%', label: '글로벌 기업 75%는\n업무 절반을 AI로 처리해요' },
      { value: '91%', label: '고용주의 91%가\nHR 업무에 AI를 활용해요' },
    ],
    sessions: [
      { time: 'Session 01', title: 'AI 시대를 위한\nHR 성과&평가 Re:boot', by: '에이치닷 ㅣ 시니어 컨설턴트' },
      { time: 'Session 02', title: 'AI로 연결하는\n진단부터 실전 교육까지', by: '에이치닷 ㅣ 시니어 컨설턴트' },
      { time: 'Session 03', title: 'SK케미칼\n성과관리&평가 혁신 사례', by: 'SK케미칼 ㅣ 매니저' },
    ],
    eventDate: '2026. 09. 10 (목) 13:30 - 16:30',
    eventPlace: 'GS타워 아모리스홀\n역삼역 도보 1분',
    deadline: '',
    bannerText: '26년 누적 1,300명이 증명한 실전 인사이트,\n기준도 방법도 매일 바뀌는 AI 시대에\n먼저 경험한 HRer들이 다음 기준을 씁니다.\n이제, 우리 조직의 차례입니다.',
    bannerCta: '',
    faq: [
      { q: '세미나에 참가비가 있나요?', a: '아니요, 본 세미나는 무료로 진행됩니다. 사전 신청 후 확정 안내를 받으시면 참석하실 수 있습니다.' },
      { q: '참가 대상은 어떻게 되나요?', a: 'HR 리더·담당자, 대표 및 임원 등 조직의 성장과 평가를 고민하는 분이라면 누구나 참여하실 수 있습니다.' },
      { q: '참가 신청은 언제까지 할 수 있나요?', a: '행사 전일까지 신청 가능하며, 좌석이 선착순으로 마감될 수 있어 빠른 신청을 권장드립니다.' },
      { q: '주차 지원이 가능한가요?', a: '행사장 사정으로 주차 지원은 어렵습니다. 대중교통 이용을 권장드립니다.' },
      { q: '이벤트 혜택은 언제 받을 수 있나요?', a: '참석 혜택은 행사 당일 현장에서 받으실 수 있으며, 발표 자료는 행사 후 이메일로 보내드립니다.' },
    ],
    ctaTitle: '올바른 성과관리와 인사평가의 시작,\nH.성과에 대해 더 알고싶다면',
    ctaSub: '막막했던 HR x AI의 실용적 해답을 확인하세요.',
    footerLinks: ['지난 세미나', '발표 자료', '브랜드 리소스'],
    footerCopyright: 'ⓒ 2026 MIDAS Group.',
    /* 팩 전용 필드(스키마 밖 — 편집으로만 수정, AI 왕복 시 DEMO 유지) */
    zigs: [
      { cap: 'Insight', title: 'AI 시대, HR의 답을 찾다', desc: '기준도, 방법도 빠르게 바뀌고 있습니다. 새롭게 마주한 과제를 짚어보고\n즉시 활용할 수 있는 전략과 인사이트를 얻어가세요.' },
      { cap: 'Experience', title: 'HR이 바뀌는 순간', desc: 'AI가 만드는 변화를 우리 조직의 시나리오에 맞춰 직접 체험해 보세요.\n데모 부스에서 실제 업무 데이터를 얹어 그 자리에서 확인할 수 있습니다.' },
      { cap: 'Networking', title: '함께 즐기는 네트워킹', desc: '같은 고민을 가진 HR 동료들을 만나 인사이트를 나누고 노하우를 공유해 보세요.\n현장의 시행착오와 해법을 가장 가까이에서 들을 수 있는 시간입니다.' },
    ],
    benefits: [
      { cap: '참석 혜택 01', title: '채용 홍보\n무료 지원', link: '혜택 자세히 보기' },
      { cap: '참석 혜택 02', title: '참석자 전원\n스페셜 기프트', link: '기프트 미리 보기' },
      { cap: '참석 혜택 03', title: '구조화 면접\n질문지 키트', link: '질문지 받아보기' },
    ],
  };
  var DEMO_EN = {
    productName: 'HR Growth 2026',
    tagline: 'The New Era of\nHR x AI Performance',
    subcopy: 'The day you meet\nthe next decade of HR first',
    primaryCta: 'Register',
    navTitle: 'H.',
    navLinks: ['ABOUT', 'SESSION', 'EVENT', 'LOCATION'],
    features: [
      { title: 'Diagnose', desc: 'Read your organization objectively with AI-driven diagnostics.\nSet the right direction with data, not intuition.' },
      { title: 'Educate', desc: 'Personalized growth guides built on diagnostic data.\nAI role-play training raises real-world readiness.' },
      { title: 'Perform', desc: 'Shift the performance-management paradigm with AI.\nFrom goal setting to reviews — field-proven cases.' },
      { title: 'Evaluate', desc: 'Complete precise evaluation with a process fit to your org.\nDesign a fair experience your people can trust.' },
    ],
    stats: [
      { value: '90%', label: '90% of enterprises\nhave adopted AI in HR' },
      { value: '75%', label: '75% of global firms handle\nhalf their work with AI' },
      { value: '91%', label: '91% of employers\nuse AI for HR work' },
    ],
    sessions: [
      { time: 'Session 01', title: 'HR Performance & Evaluation\nRe:boot for the AI era', by: 'H. | Senior Consultant' },
      { time: 'Session 02', title: 'From diagnostics to training,\nconnected by AI', by: 'H. | Senior Consultant' },
      { time: 'Session 03', title: 'SK Chemical\nperformance innovation case', by: 'SK Chemical | Manager' },
    ],
    eventDate: 'Sep 10 (Thu), 2026 · 13:30 - 16:30',
    eventPlace: 'Amoris Hall, GS Tower\n1 min from Yeoksam Stn.',
    deadline: '',
    bannerText: 'Insights proven by 1,300 HRers over 26 years,\nin an AI era where the rules change daily,\nthose who moved first are writing the next standard.\nNow it is your organization’s turn.',
    bannerCta: '',
    faq: [
      { q: 'Is there an admission fee?', a: 'No — the seminar is free. Register in advance and you’ll receive a confirmation.' },
      { q: 'Who can attend?', a: 'HR leaders and managers, executives — anyone thinking about organizational growth and evaluation.' },
      { q: 'When does registration close?', a: 'Until the day before the event. Seats are first-come, first-served.' },
      { q: 'Is parking available?', a: 'Parking is not supported at the venue. Public transportation is recommended.' },
      { q: 'When do I receive the event benefits?', a: 'Benefits are handed out on site. Slides are emailed after the event.' },
    ],
    ctaTitle: 'The start of proper performance management —\nwant to know more?',
    ctaSub: 'Find practical answers to HR x AI.',
    footerLinks: ['Past Seminars', 'Slides', 'Brand Resources'],
    footerCopyright: '© 2026 MIDAS Group.',
    zigs: [
      { cap: 'Insight', title: 'Finding HR’s answer in the AI era', desc: 'Rules and methods are changing fast. Review the challenges ahead\nand take home strategies you can use right away.' },
      { cap: 'Experience', title: 'The moment HR changes', desc: 'Experience the change AI brings, mapped to your own scenarios.\nSee it live at the demo booth with real work data.' },
      { cap: 'Networking', title: 'Networking to enjoy together', desc: 'Meet HR peers with the same concerns, share insights and know-how.\nHear real trial-and-error stories up close.' },
    ],
    benefits: [
      { cap: 'Benefit 01', title: 'Free support for\nrecruitment ads', link: 'See details' },
      { cap: 'Benefit 02', title: 'Special gift for\nevery attendee', link: 'Preview the gift' },
      { cap: 'Benefit 03', title: 'Structured interview\nquestion kit', link: 'Get the kit' },
    ],
  };

  function css(LANG, TH) {
    return [
      ':root{--brand:' + TH.brand + ';--brand-deep:' + TH.deep + ';--mint:' + TH.mint + ';--brand-ink:' + TH.bink + ';--zone-card:' + TH.card + ';--ink:#191F28;--g1:#333D4B;--g2:#4E5968;--g3:#6B7684;--g4:#8B95A1;--bg1:#F9FAFB;--bg2:#F2F4F6;--dark:#121419;--dark-card:#1E2026}',
      '*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}',
      'body{transition:background-color .8s ease;font-family:' + (LANG === 'ja' ? '"Noto Sans JP",' : LANG === 'zh' ? '"Noto Sans SC",' : '') + '"Toss Product Sans OTF","Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased;letter-spacing:-.01em;overflow-x:clip}',
      'img{max-width:100%}a{text-decoration:none;color:inherit}',
      '.wrap{max-width:1200px;margin:0 auto;padding:0 24px}',
      '.sec{padding:120px 0}',
      'h2.tt{font-size:48px;font-weight:700;letter-spacing:-.02em;line-height:1.3;word-break:keep-all}',
      'p.sub{margin-top:16px;font-size:20px;line-height:1.6;color:var(--g3);word-break:keep-all}',
      '.center{text-align:center}',
      '.pill{display:inline-block;background:var(--brand);color:#fff;font-size:17px;font-weight:600;padding:16px 34px;border-radius:100px;text-decoration:none;transition:transform .2s,box-shadow .2s;cursor:pointer;border:0;font-family:inherit}',
      '.pill:hover{transform:translateY(-2px);box-shadow:0 12px 28px color-mix(in srgb,var(--brand) 30%,transparent)}',
      '.cta2{display:inline-flex;align-items:center;gap:10px;background:rgba(7,25,76,.05);color:var(--ink);font-size:17px;font-weight:600;padding:16px 26px;border-radius:100px;text-decoration:none;cursor:pointer;transition:background .2s,transform .2s,box-shadow .2s}',
      '.cta2 .arr{font-size:18px;font-weight:700;line-height:1}',
      '.cta2:hover{background:rgba(7,25,76,.09);transform:translateY(-2px)}',
      '.cta2.w{background:#fff;box-shadow:0 12px 28px rgba(10,5,40,.22)}.cta2.w:hover{background:#fff;box-shadow:0 16px 34px rgba(10,5,40,.3)}',
      /* 하단 고정 CTA 독 — toss 플로팅 상담 바 */
      '.dock{position:fixed;left:50%;bottom:28px;z-index:60;display:flex;align-items:center;gap:18px;width:min(620px,calc(100vw - 48px));padding:10px 10px 10px 24px;background:#fff;border-radius:100px;box-shadow:0 18px 50px rgba(10,5,40,.25),0 2px 8px rgba(10,5,40,.08);opacity:0;transform:translate(-50%,140%);pointer-events:none;transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease}',
      '.dock.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}',
      '.dock .tag{flex:none;background:color-mix(in srgb,var(--brand) 10%,transparent);color:var(--brand);font-size:13px;font-weight:700;padding:7px 13px;border-radius:100px}',
      '.dock p{flex:1;font-size:16px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.dock .go{flex:none;background:var(--brand);color:#fff;font-size:15px;font-weight:600;padding:14px 28px;border-radius:100px;text-decoration:none;transition:background .2s}.dock .go:hover{background:var(--brand-deep)}',
      /* 리빌 */
      '.rv{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}',
      '.rv.on{opacity:1;transform:none}',
      '.rv.d1{transition-delay:.08s}.rv.d2{transition-delay:.16s}.rv.d3{transition-delay:.24s}.rv.d4{transition-delay:.32s}',
      /* 핀 트랙 */
      '.track{position:relative}',
      '.stage{position:sticky;top:0;height:100vh;min-height:640px;overflow:hidden}',
      '.kv-track{height:280vh}.areas-track{height:340vh}.nar-track{height:250vh}.type-track{height:220vh}',
      /* 스텝 아코디언 */
      '.srow{padding:18px 0;border-bottom:1px solid var(--bg2)}',
      '.srow b{display:block;font-size:21px;font-weight:700;letter-spacing:-.02em;color:var(--g4);transition:color .35s,font-size .35s cubic-bezier(.22,1,.36,1)}',
      '.srow.on b{font-size:30px;color:var(--ink)}',
      '.srow .n{color:var(--g4);font-weight:700;margin-right:12px;font-size:15px;transition:color .35s}.srow.on .n{color:var(--brand)}',
      '.srow .more{max-height:0;overflow:hidden;transition:max-height .5s cubic-bezier(.22,1,.36,1)}.srow.on .more{max-height:220px}',
      '.srow .more p{margin-top:10px;font-size:17px;line-height:1.6;color:var(--g3);word-break:keep-all}',
      '.srow .go{display:inline-block;margin:14px 0 6px;background:rgba(7,25,76,.05);color:var(--g1);font-size:15px;font-weight:600;padding:15px 18px;border-radius:100px;cursor:pointer;transition:background .2s}.srow .go:hover{background:rgba(7,25,76,.09)}',
      '.spanel{position:relative;height:520px;border-radius:24px;background:var(--bg2);overflow:hidden}',
      '.spanel .pv{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transition:opacity .45s;background:var(--pvbg,var(--bg2))}',
      '.spanel .pv.on{opacity:1}',
      '.pv .goarr,.acard .goarr{position:absolute;right:26px;bottom:26px;width:46px;height:46px;border-radius:50%;background:rgba(3,7,18,.08);display:grid;place-items:center;font-size:19px;font-weight:700;color:var(--ink)}',
      /* GNB */
      '.gnb{position:fixed;inset:0 0 auto;z-index:50;backdrop-filter:blur(12px);background:rgba(18,20,25,.35);transition:background .4s ease}',
      '.gnb.solid{background:rgba(255,255,255,.92);border-bottom:1px solid rgba(3,7,18,.06)}',
      '.gnb .in{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;gap:36px}',
      '.gnb .logo{font-size:27px;font-weight:800;color:#fff;letter-spacing:-.02em}.gnb.solid .logo{color:var(--ink)}',
      '.gnb nav{display:flex;gap:28px;margin-left:auto}',
      '.gnb nav a{font-size:15px;font-weight:600;color:rgba(255,255,255,.85);text-decoration:none;transition:color .2s}',
      '.gnb.solid nav a{color:var(--g2)}.gnb nav a:hover{color:#fff}.gnb.solid nav a:hover{color:var(--ink)}',
      '.gnb .cta{background:var(--brand);color:#fff;font-size:14px;font-weight:700;padding:10px 20px;border-radius:100px;text-decoration:none;transition:background .2s}.gnb .cta:hover{background:var(--brand-deep)}',
      /* KV */
      '.kv{height:100vh;min-height:640px;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;background:#fff}',
      '.kv-photo{position:absolute;inset:0;overflow:hidden;background:linear-gradient(150deg,#1E2026,#121419);will-change:transform,border-radius}',
      '.kv-photo .kimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.kv-photo .ov{position:absolute;inset:0;background:linear-gradient(160deg,rgba(12,20,16,.82),rgba(22,32,26,.52))}',
      '.kv-sub{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;opacity:0;text-align:center;will-change:opacity,transform}',
      '.kv-sub h3{font-size:72px;font-weight:700;line-height:1.25;letter-spacing:-.02em}',
      '.kv .in{position:relative;z-index:2}',
      '.kv .eb{font-size:18px;font-weight:600;color:rgba(255,255,255,.72);letter-spacing:.02em}',
      '.kv h1{margin-top:22px;font-size:88px;font-weight:700;line-height:1.2;color:#fff;letter-spacing:-.02em}',
      '.kv .meta{margin-top:30px;font-size:18px;color:rgba(255,255,255,.72)}.kv .meta b{color:#fff;font-weight:600}',
      '.kv .act{margin-top:42px}',
      '.kv .line{display:block;overflow:hidden}',
      '.kv .line span{display:inline-block;transform:translateY(110%);animation:mtRise 1s cubic-bezier(.22,1,.36,1) forwards}',
      '.kv .line:nth-child(2) span{animation-delay:.12s}',
      '@keyframes mtRise{to{transform:none}}',
      /* about 3열 수치 */
      '.tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:64px 48px}',
      '.tgrid .num{font-size:56px;font-weight:700;letter-spacing:-.03em;color:var(--brand);font-variant-numeric:tabular-nums}',
      '.tgrid .num small{font-size:.5em;font-weight:600;vertical-align:.14em}',
      '.tgrid b{display:block;margin-top:14px;font-size:22px;font-weight:700;line-height:1.45;letter-spacing:-.02em;word-break:keep-all}',
      /* 슬로건/칩/타이핑 */
      '.slogan{min-height:80vh;display:flex;align-items:center;justify-content:center;padding:120px 0}',
      '.oneline{font-size:64px;font-weight:700;letter-spacing:-.02em;line-height:1.4;word-break:keep-all}',
      '.chip{display:inline-block;background:var(--bg2);color:var(--g1);border-radius:100px;font-size:.72em;font-weight:700;line-height:1.25;padding:.26em .6em;margin:0 .07em;vertical-align:.1em}',
      '.chipline .chip{opacity:0;transform:scale(.6);transition:opacity .5s cubic-bezier(.34,1.56,.64,1),transform .5s cubic-bezier(.34,1.56,.64,1)}',
      '.chipline.on .chip{opacity:1;transform:scale(1)}',
      '.chipline .cd1{transition-delay:.08s}.chipline .cd2{transition-delay:.2s}.chipline .cd3{transition-delay:.32s}.chipline .cd4{transition-delay:.44s}',
      '.slogan.stage{display:flex;align-items:center;min-height:0;padding:0}',
      '.typeline{will-change:transform;transform-origin:center center}',
      '.typeline .tw{position:relative;display:inline-block;white-space:nowrap}',
      '.typeline .ghost{color:#E0E3E8}',
      '.typeline .fillw{position:absolute;left:0;top:0;white-space:nowrap}',
      '.typeline .done{color:var(--ink)}',
      '.typeline .caret{display:inline-block;width:3px;height:.8em;background:var(--brand);margin-left:2px;vertical-align:-.05em;animation:mtBlink 1.1s steps(1) infinite}',
      '@keyframes mtBlink{0%,54%{opacity:1}55%,100%{opacity:0}}',
      /* 다크 내러티브 */
      '.nrstage{display:flex;align-items:center}',
      '.nline{max-width:920px;font-size:40px;font-weight:700;line-height:1.5;letter-spacing:-.02em;color:#fff;opacity:.15;filter:blur(7px);word-break:keep-all;will-change:opacity,filter}',
      '.nline .hl{color:var(--mint)}',
      /* 세션 */
      '.dark{background:transparent;color:#fff}',
      '.scard{background:var(--zone-card);border-radius:20px;padding:36px 28px 36px 48px;display:grid;grid-template-columns:1.3fr 1fr;gap:32px;align-items:center}',
      '.scard+.scard{margin-top:20px}',
      '.scard .cap{font-size:14px;font-weight:600;color:var(--mint)}',
      '.scard h3{margin-top:12px;font-size:30px;font-weight:700;line-height:1.35;letter-spacing:-.02em}',
      '.scard .who{margin-top:22px;font-size:13.5px;color:rgba(255,255,255,.45)}',
      '.scard .ph{height:200px;border-radius:14px;background:linear-gradient(160deg,var(--zone-card),var(--dark));display:grid;place-items:center;color:rgba(255,255,255,.18);font-size:26px}',
      /* 지그재그 */
      '.zig{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}',
      '.zig+.zig{margin-top:120px}',
      '.zig .cap{font-size:15px;font-weight:600;color:var(--brand)}',
      '.zig h3{margin-top:10px;font-size:34px;font-weight:700;letter-spacing:-.02em;line-height:1.35;word-break:keep-all}',
      '.zig p{margin-top:14px;font-size:17px;line-height:1.7;color:var(--g3);word-break:keep-all}',
      '.ph{background:var(--bg2);border-radius:20px;position:relative;overflow:hidden}',
      '.ph:after{content:"▦";position:absolute;inset:0;display:grid;place-items:center;color:#D5DAE0;font-size:28px}',
      '.zcard{border-radius:26px;overflow:hidden;box-shadow:0 12px 36px rgba(3,7,18,.08),0 2px 8px rgba(3,7,18,.04);padding:0}',
      '.zcard .ph,.zcard .photo{height:100%;border-radius:26px}',
      '.photo{position:relative;overflow:hidden;border-radius:18px}',
      '.photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.photo .tint{position:absolute;inset:0;background:linear-gradient(160deg,rgba(3,7,18,.16),rgba(3,7,18,.04))}',
      /* 파스텔 글래스 패널 미니 UI */
      '.mini{width:min(350px,82%);background:rgba(255,255,255,.62);backdrop-filter:blur(22px);border-radius:26px;padding:26px 24px 24px;box-shadow:0 30px 70px rgba(30,40,60,.18);text-align:left}',
      '.mini .mt{font-size:13px;font-weight:600;color:var(--g4)}',
      '.mini .mb{margin-top:4px;font-size:20px;font-weight:700;letter-spacing:-.02em}',
      '.mini .grow{margin-top:14px;height:10px;border-radius:100px;background:rgba(3,7,18,.07);overflow:hidden}',
      '.mini .grow i{display:block;height:100%;border-radius:100px;background:var(--brand)}',
      '.mini .mrow{margin-top:10px;display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:600;color:var(--g1);background:rgba(255,255,255,.85);border-radius:14px;padding:13px 14px;border:1.5px solid transparent}',
      '.mini .grow+.mrow,.mini .mb+.mrow{margin-top:16px}',
      '.mini .mrow.hl{border-color:var(--brand);background:color-mix(in srgb,var(--brand) 7%,transparent)}',
      '.mini .mrow .dot{width:22px;height:22px;border-radius:50%;background:color-mix(in srgb,var(--brand) 12%,transparent);color:var(--brand);display:grid;place-items:center;font-size:11px;font-weight:900;flex:none}',
      '.mini .mrow .val{margin-left:auto;font-size:12.5px;color:var(--g3);font-weight:700;background:rgba(3,7,18,.05);border-radius:100px;padding:5px 10px;flex:none}',
      '.mini .mrow.hl .val{background:color-mix(in srgb,var(--brand) 14%,transparent);color:var(--brand-ink)}',
      '.mini .mbar{display:flex;gap:14px;align-items:flex-end;height:96px;margin-top:16px;padding:0 4px}',
      '.mini .mbar>i{flex:1;border-radius:6px 6px 0 0;background:#E3E6EB}.mini .mbar>i.hot{background:var(--brand)}',
      '.mini .chipA{display:inline-block;margin-top:2px;background:color-mix(in srgb,var(--brand) 10%,transparent);color:var(--brand);font-size:13px;font-weight:800;border-radius:8px;padding:4px 10px}',
      /* EVENT 카드 — 이미지 상단 풀블리드 */
      '.egrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}',
      '.ecard{background:#fff;border-radius:26px;border:0;box-shadow:0 10px 30px rgba(3,7,18,.06),0 2px 8px rgba(3,7,18,.04);padding:0 0 30px;overflow:hidden;display:flex;flex-direction:column;text-align:left}',
      '.ecard .photo{border-radius:0}',
      '.ecard .ph{height:190px;border-radius:0;background:var(--bg2);display:grid;place-items:center}',
      '.ecard .cap{margin:24px 28px 0;font-size:15px;font-weight:500;color:var(--g4)}',
      '.ecard b{margin:6px 28px 26px;font-size:24px;font-weight:700;letter-spacing:-.02em;line-height:1.4;word-break:keep-all}',
      '.ecard .lnk{margin:0 28px;margin-top:auto;align-self:flex-start;background:rgba(7,25,76,.05);color:var(--g1);font-size:15px;font-weight:600;padding:14px 20px;border-radius:100px;cursor:pointer;transition:background .2s}.ecard .lnk:hover{background:rgba(7,25,76,.09)}',
      /* 일정·장소 */
      '.mapsvg{position:absolute;inset:0;width:100%;height:100%}',
      '.place{margin-top:56px;background:#fff;border-radius:20px;box-shadow:0 10px 30px rgba(3,7,18,.05);overflow:hidden;display:grid;grid-template-columns:0.9fr 1.4fr}',
      '.place .info{padding:44px 40px;text-align:left}',
      '.place .info b{font-size:24px;font-weight:700;letter-spacing:-.02em}',
      '.place .row{margin-top:16px;display:flex;gap:16px;font-size:15px}',
      '.place .row .k{color:var(--g4);font-weight:600;width:3.2em;flex:none}',
      '.place .row .v{font-weight:500;color:var(--g1);line-height:1.5}',
      '.place .row .v small{display:block;color:var(--g4);font-size:13.5px}',
      '.place .map{display:flex;flex-direction:column;background:#EDF1F6}',
      '.place .mapbody{position:relative;flex:1;min-height:300px;overflow:hidden}',
      '.place .foot{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:15px 22px;background:#fff;border-top:1px solid var(--bg2);font-size:13.5px}',
      '.place .foot .addr{display:flex;align-items:center;gap:8px;color:var(--g2);font-weight:600}',
      '.place .foot .cpy{cursor:pointer;color:var(--g4);font-size:15px;transition:color .2s}.place .foot .cpy:hover{color:var(--ink)}',
      '.place .foot .mlink{color:var(--g4);font-weight:600;cursor:pointer;transition:color .2s}.place .foot .mlink:hover{color:var(--ink)}',
      /* ── 디자인 베리에이션 ── */
      /* hero:light — 밝은 타이포 온리 (핀 없음) */
      '.hero-light{padding:200px 0 150px;text-align:center;background:#fff}',
      '.hero-light .eb{font-size:18px;font-weight:700;color:var(--brand)}',
      '.hero-light h1{margin-top:22px;font-size:88px;font-weight:700;line-height:1.2;letter-spacing:-.02em;word-break:keep-all}',
      '.hero-light .meta{margin-top:28px;font-size:18px;color:var(--g3)}.hero-light .meta b{color:var(--ink);font-weight:600}',
      '.hero-light .act{margin-top:42px;display:flex;gap:12px;justify-content:center}',
      /* about:dark — 잉크 밴드 대형 수치 */
      '.about-dark{background:var(--dark);color:#fff;padding:130px 0;text-align:center}',
      '.about-dark .nums{margin-top:70px;display:grid;grid-template-columns:repeat(3,1fr);gap:48px}',
      '.about-dark .num{font-size:64px;font-weight:700;color:var(--brand);letter-spacing:-.03em;font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.about-dark .num small{font-size:.45em;vertical-align:.2em;font-weight:600}',
      '.about-dark .nums b{display:block;margin-top:12px;font-size:18px;font-weight:600;line-height:1.5;color:rgba(255,255,255,.82);word-break:keep-all}',
      /* about:chart — 좌 카피 + 우 바 차트 카드 */
      '.chart-card{background:var(--bg1);border-radius:20px;padding:44px 48px;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;text-align:left;margin-top:64px}',
      '.chart-card .ct{font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1.4;word-break:keep-all}',
      '.chart-card .cs{margin-top:12px;font-size:16px;line-height:1.65;color:var(--g3);word-break:keep-all}',
      '.bars{display:flex;gap:36px;align-items:flex-end;height:190px;padding:0 8px}',
      '.bars>div{flex:1;text-align:center}',
      '.bars .v{font-size:15px;font-weight:700;margin-bottom:8px}',
      '.bars .bar{border-radius:8px 8px 0 0;background:#E3E6EB}',
      '.bars .hot .v{color:var(--brand)}.bars .hot .bar{background:var(--brand)}',
      '.bars .l{margin-top:10px;font-size:13px;color:var(--g3)}',
      /* areas:grid — 정적 2×2 파스텔 카드 */
      '.agrid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:64px}',
      '.acard{border-radius:24px;padding:34px 32px;position:relative;min-height:250px;text-align:left;background:var(--pvbg,var(--bg2))}',
      '.acard .n{font-size:15px;font-weight:700;color:var(--brand-ink)}',
      '.acard b{display:block;margin-top:8px;font-size:26px;font-weight:700;letter-spacing:-.02em}',
      '.acard p{margin-top:12px;font-size:15.5px;line-height:1.65;color:var(--g2);word-break:keep-all;max-width:88%}',
      /* session:timetable — 라이트 타임테이블 */
      '.stt{max-width:1000px;margin:64px auto 0;display:grid;gap:14px}',
      '.strow{display:grid;grid-template-columns:150px 1fr auto;gap:22px;align-items:center;background:#fff;border-radius:16px;padding:24px 30px;box-shadow:0 8px 24px rgba(3,7,18,.05);text-align:left;transition:transform .25s,box-shadow .25s}',
      '.strow:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(3,7,18,.09)}',
      '.strow .tm{font-size:15px;font-weight:700;color:var(--brand);font-variant-numeric:tabular-nums}',
      '.strow .st{font-size:19px;font-weight:700;letter-spacing:-.01em;word-break:keep-all}',
      '.strow .by{font-size:14px;color:var(--g4);white-space:nowrap}',
      /* event:list — 아이콘 리스트 2열 */
      '.elist{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:64px;text-align:left}',
      '.eli{display:flex;gap:16px;align-items:flex-start;background:#fff;border-radius:18px;padding:24px 26px;box-shadow:0 8px 24px rgba(3,7,18,.05)}',
      '.eli .ic{flex:none;width:44px;height:44px;border-radius:50%;background:color-mix(in srgb,var(--brand) 12%,transparent);color:var(--brand);display:grid;place-items:center;font-size:17px;font-weight:800}',
      '.eli .cap{font-size:13px;font-weight:600;color:var(--g4)}',
      '.eli b{display:block;margin-top:3px;font-size:18px;font-weight:700;letter-spacing:-.01em;word-break:keep-all}',
      /* faq:cards — 2열 상시 노출 */
      '.faqcards{max-width:1000px;margin:64px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:18px}',
      '.fqc{background:#fff;border-radius:16px;padding:28px 30px;text-align:left;box-shadow:0 8px 24px rgba(3,7,18,.04)}',
      '.fqc b{font-size:17px;font-weight:700}.fqc b i{font-style:normal;color:var(--brand);font-weight:800}',
      '.fqc p{margin-top:12px;font-size:14.5px;line-height:1.7;color:var(--g3);word-break:keep-all}',
      /* ctaband:dark — 잉크 밴드 */
      '.cta-band.dark2{background:var(--dark);animation:none}',
      '.cta-band.dark2 .deco,.cta-band.dark2 .deco2{display:none}',
      '.cta-band.dark2 p{color:rgba(255,255,255,.55)}',
      /* location:simple — 지도 없는 센터 정보 카드 */
      '.place.simple{grid-template-columns:1fr;max-width:720px;margin-left:auto;margin-right:auto}',
      '.place.simple .info{text-align:center;padding:52px 40px}',
      '.place.simple .row{justify-content:center}',
      /* narrative:statement — 정적 다크 선언 */
      '.nstate{padding:170px 0;text-align:center}',
      '.nstate .tx{font-size:48px;font-weight:700;line-height:1.5;letter-spacing:-.02em;color:#fff;word-break:keep-all}',
      '.nstate .tx .hl{color:var(--mint)}',
      /* 폼 (라이트) */
      '.form{max-width:820px;margin:0 auto}',
      '.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:24px 24px;text-align:left}',
      '.fl{font-size:14px;font-weight:600;color:var(--g2)}.fl em{color:var(--brand);font-style:normal}',
      '.fi{display:block;width:100%;margin-top:8px;background:var(--bg2);border:1.5px solid transparent;border-radius:12px;padding:16px 18px;font-size:15px;color:var(--ink);font-family:inherit;outline:0;transition:background .2s,border-color .2s}',
      '.fi::placeholder{color:var(--g4)}.fi:hover{background:#ECEEF1}.fi:focus{background:#fff;border-color:var(--brand)}',
      '.chkrow{margin-top:8px;background:var(--bg2);border-radius:12px;padding:14px 18px;display:flex;gap:18px;flex-wrap:wrap}',
      '.chk{display:inline-flex;gap:8px;align-items:center;font-size:14px;font-weight:500;color:var(--g1);cursor:pointer;user-select:none}',
      '.chk .box{width:18px;height:18px;border-radius:5px;display:grid;place-items:center;font-size:11px;font-weight:900}',
      '.chk .box.on{background:var(--brand);color:#fff}.chk .box.off{border:1.5px solid #D1D6DB;color:transparent}',
      '.agree{margin-top:24px;display:grid;gap:9px;font-size:13.5px;color:var(--g3);text-align:left}.agree u{cursor:pointer}',
      /* FAQ */
      '.faq{max-width:900px;margin:0 auto;display:grid;gap:12px}',
      '.fitem{background:#fff;border-radius:14px;overflow:hidden}',
      '.frow{padding:0 28px;height:76px;display:flex;align-items:center;justify-content:space-between;text-align:left;cursor:pointer;transition:background .2s}',
      '.frow:hover{background:#ECEEF1}.fitem.open .frow,.fitem.open .frow:hover{background:#fff}',
      '.frow b{font-size:16.5px;font-weight:600}.frow b i{font-style:normal;color:var(--brand);font-weight:700}',
      '.frow span{color:var(--g4);font-size:22px;transition:transform .3s}.fitem.open .frow span{transform:rotate(45deg)}',
      '.fans{max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.22,1,.36,1)}.fitem.open .fans{max-height:220px}',
      '.fans p{padding:2px 28px 26px;font-size:15.5px;line-height:1.7;color:var(--g3);text-align:left;word-break:keep-all}',
      /* CTA 밴드 — 흐르는 그라데이션 + 블롭 */
      '.cta-band{background:linear-gradient(115deg,var(--brand),var(--brand-deep) 34%,color-mix(in srgb,var(--brand) 86%,#fff) 62%,color-mix(in srgb,var(--brand) 90%,#000));background-size:220% 220%;animation:mtBandGrad 11s ease-in-out infinite alternate;color:#fff;padding:120px 0;text-align:center;position:relative;overflow:hidden}',
      '@keyframes mtBandGrad{from{background-position:0% 30%}to{background-position:100% 70%}}',
      '.cta-band .deco{position:absolute;width:560px;height:560px;border-radius:50%;background:var(--brand-deep);filter:blur(90px);opacity:.8;right:-140px;top:-180px;animation:mtBandFloat 16s ease-in-out infinite alternate}',
      '.cta-band .deco2{position:absolute;width:460px;height:460px;border-radius:50%;background:var(--mint);filter:blur(110px);opacity:.26;left:-160px;bottom:-220px;animation:mtBandFloat2 21s ease-in-out infinite alternate}',
      '@keyframes mtBandFloat{from{transform:translate(0,0) scale(1)}to{transform:translate(-180px,100px) scale(1.28)}}',
      '@keyframes mtBandFloat2{from{transform:translate(0,0) scale(1)}to{transform:translate(200px,-80px) scale(1.18)}}',
      '.cta-band h2{position:relative;font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:1.35;word-break:keep-all}',
      '.cta-band p{position:relative;margin-top:14px;font-size:18px;color:rgba(255,255,255,.75)}',
      '.cta-band .act{position:relative;margin-top:36px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}',
      /* 푸터 */
      '.dawnfoot{position:relative;background:var(--dark);color:#fff;padding:80px 0 44px}',
      '.dawnfoot .in{position:relative;max-width:1200px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:40px;align-items:start}',
      '.dawnfoot .slog{font-size:30px;font-weight:700;line-height:1.45;letter-spacing:-.02em;word-break:keep-all}',
      '.dawnfoot .col i{display:block;font-style:normal;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.5);margin-bottom:16px}',
      '.dawnfoot .col a{display:block;font-size:15px;font-weight:600;color:rgba(255,255,255,.88);text-decoration:none;margin-top:11px}.dawnfoot .col a:hover{color:#fff}',
      '.dawnfoot .copy{position:relative;max-width:1200px;margin:56px auto 0;padding:22px 24px 0;border-top:1px solid rgba(255,255,255,.16);font-size:13px;color:rgba(255,255,255,.55);display:flex;justify-content:space-between}',
      /* 정적 폴백(reduced-motion + motion off) — 핀 해제·완성 상태 표시 */
      mkStatic('@media (prefers-reduced-motion:reduce){', '}'),
      mkStatic('html.nomo ', ''),
      /* 앵커 보정 + 편집 개행 */
      '.sec,.track{scroll-margin-top:72px}',
      '[data-edit]{white-space:pre-wrap}',
      '@media (max-width:900px){.kv h1{font-size:44px}.hero-light h1{font-size:44px}.agrid2,.elist,.faqcards,.about-dark .nums,.chart-card{grid-template-columns:1fr}.strow{grid-template-columns:1fr;gap:8px}.nstate .tx{font-size:28px}h2.tt{font-size:32px}.oneline{font-size:34px}.slogan{min-height:60vh}.nline{font-size:26px}.srow b{font-size:18px}.srow.on b{font-size:24px}.kv-sub h3{font-size:32px}.tgrid,.egrid,.zig,.fgrid{grid-template-columns:1fr}.scard{grid-template-columns:1fr}.place{grid-template-columns:1fr}.dawnfoot .in{grid-template-columns:1fr;gap:28px}.mini{width:min(300px,86%)}.sec{padding:90px 0}.gnb nav{display:none}}',
    ].join('\n');
  }
  /* 정적 폴백 규칙 — media(reduce)와 html.nomo(모션 off) 두 컨텍스트로 동일 출력 */
  function mkStatic(pre, post) {
    var R = [
      '.kv-track,.areas-track,.nar-track,.type-track{height:auto!important}',
      '.stage{position:static;height:auto;min-height:0;padding:120px 0}',
      '.kv{display:block;background:linear-gradient(150deg,#1E2026,#121419);padding:150px 0 90px}',
      '.kv .in{margin:0 auto}',
      '.kv-photo{position:relative;inset:auto;width:min(1200px,92vw);height:520px;margin:72px auto 0;border-radius:32px}',
      '.kv-photo .ov{opacity:.45}',
      '.kv-sub{opacity:1!important}',
      '.kv .line span{transform:none;animation:none}',
      '.srow b{font-size:26px;color:var(--ink)}',
      '.srow .n{color:var(--brand)}',
      '.srow .more{max-height:none}',
      '.spanel{height:auto;display:grid;gap:16px;background:transparent;overflow:visible}',
      '.spanel .pv{position:static;opacity:1;height:300px;border-radius:24px;overflow:hidden}',
      '.chipline .chip{opacity:1;transform:none;transition:none}',
      '.typeline .caret{display:none}',
      '.typeline{transform:none!important}',
      '.nline{opacity:1!important;filter:none!important}',
      '.rv{opacity:1;transform:none;transition:none}',
      '.dock{transition:opacity .2s ease}',
      '.cta-band,.cta-band .deco,.cta-band .deco2{animation:none}',
    ];
    if (post) return pre + R.join('') + post;                       /* media 블록 */
    return R.map(function (r) { return pre + r; }).join('\n');      /* html.nomo 접두 */
  }

  window.renderMbmtossPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    var motion = opts.motion !== false;
    var TH = THEMES[shared.theme] || THEMES.green;

    /* 템플릿 고정 라벨 — 번역 파이프라인을 안 타므로 팩이 4언어 직접 처리 */
    var TT = {
      ko: { aboutT: '숫자로 보는\n지금 이 흐름', chipsPre: '수많은 ', chipsPost: ' 앞에서', chipsTail: '막막함은 사라지고, ', chipsHl: '실전 해답', chipsEnd: '만 남도록.',
            areasT: '핵심 분야의\n실전 활용법을 다룹니다', learn: ' 알아보기 →', sesT: 'SESSION', sesS: '현장에서 만나는 실전 세션.', zigT: '놓치면\n안되는 이유',
            slog1: '막막했던 고민의 해답,', slog2p: '이것마저도 ', slog2s: '에서', evT: 'EVENT', evS: '참석 고객을 위해 준비한 특별한 혜택.',
            locT: '일정 및 장소', dt: '일시', pl: '장소', note: '*신청자가 많은 경우 조기 마감될 수 있습니다.', cpy: '주소 복사', mlink: '지도로 보기',
            applyT: ' 신청하기', faqT: '도입 전,\n이런 점이 궁금하신가요?', dockTag: '사전 신청',
            fName: '성함', fPhone: '휴대전화번호', fCompany: '회사명', fEmail: '이메일', fSize: '임직원 수', fRole: '직책 혹은 직위',
            fRoles: ['대표/ 임원', 'HR 리더', 'HR 담당자', '기타'], fPh: '입력해주세요.', fPhTel: '입력해주세요. (ex.010-0000-0000)',
            agr1: '개인정보 수집 및 이용 약관 동의', agr1s: ' (필수)', agr2: '홍보 및 마케팅 이용 약관 동의', agr2s: ' (선택)',
            fCols: ['행사', '참여', '문의'], fDone: '신청이 접수되었습니다!' },
      en: { aboutT: 'The shift,\nin numbers', chipsPre: 'Facing countless ', chipsPost: ',', chipsTail: 'confusion fades — only ', chipsHl: 'real answers', chipsEnd: ' remain.',
            areasT: 'Practical playbooks\nfor every core area', learn: ' →', sesT: 'SESSION', sesS: 'Hands-on sessions, live on stage.', zigT: 'Why you can’t\nmiss this',
            slog1: 'The answer to what felt impossible,', slog2p: 'even this — with ', slog2s: '', evT: 'EVENT', evS: 'Special benefits for attendees.',
            locT: 'Schedule & Venue', dt: 'Date', pl: 'Venue', note: '*Registration may close early if seats run out.', cpy: 'Copy address', mlink: 'Open map',
            applyT: ' — Register', faqT: 'Before you decide —\ncommon questions', dockTag: 'Register',
            fName: 'Name', fPhone: 'Phone', fCompany: 'Company', fEmail: 'Email', fSize: 'Company size', fRole: 'Role',
            fRoles: ['Executive', 'HR Leader', 'HR Manager', 'Other'], fPh: 'Type here.', fPhTel: 'Type here. (ex. 010-0000-0000)',
            agr1: 'I agree to the privacy policy', agr1s: ' (required)', agr2: 'I agree to marketing communications', agr2s: ' (optional)',
            fCols: ['Event', 'Join', 'Contact'], fDone: 'You’re registered!' },
      ja: { aboutT: '数字で見る\n今の流れ', chipsPre: '数多くの', chipsPost: 'を前に', chipsTail: '迷いは消え、', chipsHl: '実践の答え', chipsEnd: 'だけが残るように。',
            areasT: '主要分野の\n実践活用法を扱います', learn: ' →', sesT: 'SESSION', sesS: '現場で出会う実践セッション。', zigT: '見逃せない\n理由',
            slog1: '悩みの答え、', slog2p: 'これさえも ', slog2s: 'で', evT: 'EVENT', evS: 'ご参加の皆さまへの特典。',
            locT: '日程・会場', dt: '日時', pl: '会場', note: '※応募多数の場合、早期に締め切ることがあります。', cpy: '住所をコピー', mlink: '地図で見る',
            applyT: ' 申し込み', faqT: '導入前に、\nよくあるご質問', dockTag: '事前申込',
            fName: 'お名前', fPhone: '電話番号', fCompany: '会社名', fEmail: 'メール', fSize: '従業員数', fRole: '役職',
            fRoles: ['代表/役員', 'HRリーダー', 'HR担当者', 'その他'], fPh: 'ご入力ください。', fPhTel: 'ご入力ください。(例 010-0000-0000)',
            agr1: '個人情報の収集・利用に同意します', agr1s: '（必須）', agr2: 'マーケティング目的の利用に同意します', agr2s: '（任意）',
            fCols: ['イベント', '参加', 'お問い合わせ'], fDone: 'お申込みが完了しました！' },
      zh: { aboutT: '用数字看\n当下趋势', chipsPre: '面对无数', chipsPost: '，', chipsTail: '迷茫消失，只留下', chipsHl: '实战答案', chipsEnd: '。',
            areasT: '核心领域的\n实战应用方法', learn: ' →', sesT: 'SESSION', sesS: '现场实战分享。', zigT: '不容错过的\n理由',
            slog1: '难题的答案，', slog2p: '连这个也交给 ', slog2s: '', evT: 'EVENT', evS: '为参会者准备的专属福利。',
            locT: '日程与地点', dt: '日期', pl: '地点', note: '*报名人数较多时可能提前截止。', cpy: '复制地址', mlink: '查看地图',
            applyT: ' 报名', faqT: '在决定之前——\n常见问题', dockTag: '提前报名',
            fName: '姓名', fPhone: '手机号', fCompany: '公司', fEmail: '邮箱', fSize: '员工人数', fRole: '职位',
            fRoles: ['高管', 'HR负责人', 'HR专员', '其他'], fPh: '请输入。', fPhTel: '请输入。(例 010-0000-0000)',
            agr1: '同意收集和使用个人信息', agr1s: '（必填）', agr2: '同意用于推广营销', agr2s: '（可选）',
            fCols: ['活动', '参与', '联系'], fDone: '报名成功！' },
    }[LANG];
    /* 스텝 패널 미니 UI 문구 — 팩 고정 그래픽 (4언어) */
    TT.pv = ({
      ko: [
        { mt: '분석 완료', mb: '진단 리포트', rows: [{ ic: '✓', t: '몰입도 진단', v: '상위 22%', hl: 1 }, { ic: '✓', t: '방향 정렬', v: '78점' }, { ic: '…', t: '신뢰 지표', v: '분석 중' }] },
        { mt: '구성원 맞춤', mb: '트레이닝 코스', rows: [{ ic: '✓', t: '실습 세션', v: '완료' }, { ic: '▶', t: '심화 코칭', v: '진행 중', hl: 1 }] },
        { mt: '분기 성과', mb: '목표 달성률', rows: [] },
        { mt: '리뷰 시즌', mb: '역량 평가 요약', rows: [{ ic: '✓', t: '목표 기여도', v: '탁월', hl: 1 }, { ic: '✓', t: '협업·소통', v: '우수' }, { ic: '✓', t: '성장 속도', v: '탁월' }] },
      ],
      en: [
        { mt: 'Analysis done', mb: 'Diagnostic report', rows: [{ ic: '✓', t: 'Engagement', v: 'Top 22%', hl: 1 }, { ic: '✓', t: 'Alignment', v: '78 pts' }, { ic: '…', t: 'Trust index', v: 'Analyzing' }] },
        { mt: 'Personalized', mb: 'Training course', rows: [{ ic: '✓', t: 'Practice session', v: 'Done' }, { ic: '▶', t: 'Deep coaching', v: 'Ongoing', hl: 1 }] },
        { mt: 'Quarterly', mb: 'Goal attainment', rows: [] },
        { mt: 'Review season', mb: 'Evaluation summary', rows: [{ ic: '✓', t: 'Goal contribution', v: 'Excellent', hl: 1 }, { ic: '✓', t: 'Collaboration', v: 'Great' }, { ic: '✓', t: 'Growth pace', v: 'Excellent' }] },
      ],
    })[LANG === 'ko' ? 'ko' : 'en'];

    var imgs = shared.images || {};
    var V = shared.variants || {};   /* 섹션별 디자인 변형 — {hero:'light', about:'dark'|'chart', areas:'grid', session:'timetable', event:'list', faq:'cards', ctaband:'dark', location:'simple', narrative:'statement'} */
    var feats = (d.features && d.features.length ? d.features : BD.features).slice(0, 4);
    var faq = (shared.faq && shared.faq.length ? shared.faq : BD.faq).slice(0, 6);
    var sessions = (d.sessions && d.sessions.length ? d.sessions : BD.sessions).slice(0, 5);
    var stats = (d.stats || []).slice(0, 3);
    var zigs = (Array.isArray(shared.zigs) && shared.zigs.length ? shared.zigs : BD.zigs).slice(0, 3);
    var benefits = (Array.isArray(shared.benefits) && shared.benefits.length ? shared.benefits : BD.benefits).slice(0, 3);
    var placeLines = String(d.eventPlace || '').split('\n');
    var placeMain = (placeLines[0] || '').trim(), placeSub = placeLines.slice(1).join(' ').trim();
    var stationWord = (placeSub.match(/^(\S+)/) || [])[1] || '';

    /* 숫자 감지 — 카운트업 + 민트 하이라이트 */
    function numHl(line, P) {
      var m = String(line).match(/([0-9][0-9,\.]*)/);
      var body = m
        ? esc(line).replace(m[1], '<span class="hl"><span data-count="' + esc(m[1]) + '">' + esc(m[1]) + '</span></span>')
        : esc(line);
      return '<p class="nline"' + de(P) + '>' + body + '</p>';
    }

    /* ── GNB / KV ── */
    var anchors = ['#about', '#session', '#event', '#location'];
    var menu = (d.navLinks || []).slice(0, 4).map(function (l, i) {
      return '<a href="' + anchors[i % anchors.length] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>';
    }).join('');
    var tagLines = String(d.tagline || '').split('\n').map(function (ln) {
      return '<span class="line"><span>' + esc(ln) + '</span></span>';
    }).join('');
    var heroSrc = imgs.hero || '';
    var isVid = heroSrc ? /\.(mp4|webm)(\?|$)/i.test(heroSrc) : true;
    var heroMedia = isVid
      ? '<video class="kimg" src="' + esc(heroSrc || att(HERO_MP4)) + '" poster="' + esc(att(HERO_POSTER)) + '" autoplay muted loop playsinline data-img="hero"></video>'
      : '<img class="kimg" alt="" data-img="hero" src="' + esc(heroSrc) + '" onerror="this.remove()">';
    var gnbLight = V.hero === 'light';
    var gnbHtml = '<div class="gnb' + (gnbLight ? ' solid lock' : '') + '" id="gnb"><div class="in"><span class="logo"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<nav>' + menu + '</nav><a class="cta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></div>';
    var kv = gnbLight
      ? gnbHtml + '<section class="hero-light"><div class="wrap">' +
        '<div class="eb"' + de('productName') + '>' + esc(d.productName) + '</div>' +
        '<h1' + de('tagline') + '>' + ml(d.tagline) + '</h1>' +
        '<div class="meta"><b' + de('eventDate') + '>' + esc(d.eventDate) + '</b> ㅣ <span' + de('eventPlace') + '>' + esc(placeMain + (placeSub ? ' (' + placeSub + ')' : '')) + '</span></div>' +
        '<div class="act"><a class="pill" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a><a class="cta2" href="#session">' + esc((d.navLinks || [])[1] || 'SESSION') + ' <span class="arr">→</span></a></div>' +
        '</div></section>'
      : gnbHtml +
      '<div class="track kv-track" id="kvtrack"><section class="kv stage" id="kv"><div class="kv-photo">' +
      heroMedia + '<div class="ov"></div>' +
      '<div class="kv-sub"><h3' + de('subcopy') + '>' + ml(d.subcopy) + '</h3></div></div>' +
      '<div class="in wrap"><div class="eb"' + de('productName') + '>' + esc(d.productName) + '</div>' +
      '<h1' + de('tagline') + '>' + tagLines + '</h1>' +
      '<div class="meta"><b' + de('eventDate') + '>' + esc(d.eventDate) + '</b> ㅣ <span' + de('eventPlace') + '>' + esc(placeMain + (placeSub ? ' (' + placeSub + ')' : '')) + '</span></div>' +
      '<div class="act"><a class="cta2 w" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + ' <span class="arr">→</span></a></div>' +
      '</div></section></div>';

    /* ── movable 섹션들 ── */
    var SEC = {};

    function statNum(sv) {
      var m = String(sv || '').match(/^([0-9][0-9,\.]*)(.*)$/);
      return m ? '<span data-count="' + esc(m[1]) + '">' + esc(m[1]) + '</span><small>' + esc(m[2]) + '</small>' : esc(sv || '');
    }
    if (stats.length) {
      if (V.about === 'dark') {
        SEC.about = '<section class="about-dark" id="about" data-section="about"><div class="wrap center">' +
          '<h2 class="tt rv" style="color:#fff">' + ml(TT.aboutT) + '</h2>' +
          '<div class="nums rv d1">' + stats.map(function (s, i) {
            return '<div><div class="num"' + de('stats.' + i + '.value') + '>' + statNum(s.value) + '</div><b' + de('stats.' + i + '.label') + '>' + ml(s.label || '') + '</b></div>';
          }).join('') + '</div></div></section>';
      } else if (V.about === 'chart') {
        var mx = Math.max.apply(null, stats.map(function (s) { return parseFloat(String(s.value).replace(/[^0-9.]/g, '')) || 1; }));
        SEC.about = '<section class="sec" id="about" data-section="about"><div class="wrap center">' +
          '<h2 class="tt rv">' + ml(TT.aboutT) + '</h2>' +
          '<div class="chart-card rv d1"><div>' +
          '<div class="ct"' + de('stats.0.label') + '>' + ml((stats[0] || {}).label || '') + '</div>' +
          '<div class="cs">' + esc(TT.evS) + '</div></div>' +
          '<div class="bars">' + stats.map(function (s, i) {
            var n = parseFloat(String(s.value).replace(/[^0-9.]/g, '')) || 0;
            var h = Math.max(12, Math.round(160 * n / mx));
            return '<div' + (i === stats.length - 1 ? ' class="hot"' : '') + '><div class="v"' + de('stats.' + i + '.value') + '>' + esc(s.value || '') + '</div><div class="bar" style="height:' + h + 'px"></div><div class="l"' + de('stats.' + i + '.label') + '>' + esc(String(s.label || '').split('\n')[0]) + '</div></div>';
          }).join('') + '</div></div></div></section>';
      } else {
        SEC.about = '<section class="sec" id="about" data-section="about"><div class="wrap center">' +
          '<h2 class="tt rv">' + ml(TT.aboutT) + '</h2>' +
          '<div class="tgrid" style="margin-top:90px;text-align:left">' + stats.map(function (s, i) {
            return '<div class="rv' + (i ? ' d' + i : '') + '"><div class="num"' + de('stats.' + i + '.value') + '>' + statNum(s.value) + '</div><b' + de('stats.' + i + '.label') + '>' + ml(s.label || '') + '</b></div>';
          }).join('') + '</div></div></section>';
      }
    }

    if (feats.length >= 2) {
      var chips = feats.map(function (f, i) {
        var w = String(f.title || '').split(/\s|\n/)[0];
        return '<span class="chip cd' + (i + 1) + '"' + de('features.' + i + '.title') + '>' + esc(w) + '</span>';
      }).join('');
      SEC.chips = '<section class="slogan" data-section="chips"><div class="wrap center">' +
        '<p class="oneline rv chipline">' + esc(TT.chipsPre) + chips + esc(TT.chipsPost) + '<br>' +
        esc(TT.chipsTail) + '<span style="color:var(--brand)">' + esc(TT.chipsHl) + '</span>' + esc(TT.chipsEnd) + '</p></div></section>';
    }

    if (V.areas === 'grid') {
      SEC.areas = '<section class="sec" data-section="areas"><div class="wrap center">' +
        '<h2 class="tt rv">' + ml(TT.areasT) + '</h2>' +
        '<div class="agrid2">' + feats.map(function (f, i) {
          var P = 'features.' + i;
          return '<div class="acard rv' + (i ? ' d' + Math.min(i, 4) : '') + '" style="--pvbg:' + PV_BG[i % 4] + '">' +
            '<div class="n">0' + (i + 1) + '</div><b' + de(P + '.title') + '>' + esc(String(f.title || '').split('\n')[0]) + '</b>' +
            '<p' + de(P + '.desc') + '>' + ml(f.desc || '') + '</p><span class="goarr">→</span></div>';
        }).join('') + '</div></div></section>';
    } else
    SEC.areas = '<div class="track areas-track" id="areas" data-section="areas"><section class="stage" style="display:flex;align-items:center;background:#fff">' +
      '<div class="wrap" style="display:grid;grid-template-columns:0.95fr 1.05fr;gap:80px;align-items:center;width:100%"><div>' +
      '<h2 class="tt">' + ml(TT.areasT) + '</h2><div style="margin-top:44px">' +
      feats.map(function (f, i) {
        var P = 'features.' + i;
        return '<div class="srow' + (i === 0 ? ' on' : '') + '"><b><span class="n">0' + (i + 1) + '</span><span' + de(P + '.title') + '>' + esc(String(f.title || '').split('\n')[0]) + '</span></b>' +
          '<div class="more"><p' + de(P + '.desc') + '>' + ml(f.desc || '') + '</p><span class="go">' + esc(String(f.title || '').split('\n')[0] + TT.learn) + '</span></div></div>';
      }).join('') + '</div></div>' +
      '<div class="spanel">' + feats.map(function (f, i) {
        return '<div class="pv' + (i === 0 ? ' on' : '') + '" style="--pvbg:' + PV_BG[i % 4] + '">' + pvMini(i, TT) + '<span class="goarr">→</span></div>';
      }).join('') + '</div></div></section></div>';

    if (d.bannerText) {
      var nlines = String(d.bannerText).split('\n').filter(function (s) { return s.trim(); });
      if (V.narrative === 'statement') {
        SEC.narrative = '<section class="nstate dark" id="nar" data-bg="#121419" data-section="narrative"><div class="wrap center">' +
          '<p class="tx rv"' + de('bannerText') + '>' + nlines.map(function (ln) {
            var m = String(ln).match(/([0-9][0-9,\.]*)/);
            return m ? esc(ln).replace(m[1], '<span class="hl"><span data-count="' + esc(m[1]) + '">' + esc(m[1]) + '</span></span>') : esc(ln);
          }).join('<br>') + '</p></div></section>';
      } else {
        SEC.narrative = '<div class="track nar-track" id="nar" data-bg="#121419" data-section="narrative"><section class="stage dark nrstage"><div class="wrap">' +
          nlines.map(function (ln, i) { return numHl(ln, i === 0 ? 'bannerText' : ''); }).join('') +
          '</div></section></div>';
      }
    }

    if (V.session === 'timetable') {
      SEC.session = '<section class="sec" id="session" style="background:var(--bg1)" data-section="session"><div class="wrap center">' +
        '<h2 class="tt rv">' + esc(TT.sesT) + '</h2><p class="sub rv d1">' + esc(TT.sesS) + '</p>' +
        '<div class="stt rv d2">' + sessions.map(function (s, i) {
          var P = 'sessions.' + i;
          return '<div class="strow"><span class="tm"' + de(P + '.time') + '>' + esc(s.time || '') + '</span>' +
            '<span class="st"' + de(P + '.title') + '>' + esc(String(s.title || '').replace(/\n/g, ' ')) + '</span>' +
            '<span class="by"' + de(P + '.by') + '>' + esc(s.by || '') + '</span></div>';
        }).join('') + '</div></div></section>';
    } else
    SEC.session = '<section class="sec dark" id="session" data-bg="' + TH.zone + '" data-section="session"><div class="wrap">' +
      '<div class="center"><h2 class="tt rv">' + esc(TT.sesT) + '</h2><p class="sub rv d1">' + esc(TT.sesS) + '</p></div>' +
      '<div style="margin-top:80px">' + sessions.map(function (s, i) {
        var P = 'sessions.' + i, slot = 'session.' + i, rel = IMG_SES[i % IMG_SES.length];
        return '<div class="scard rv"><div><div class="cap"' + de(P + '.time') + '>' + esc(s.time || '') + '</div>' +
          '<h3' + de(P + '.title') + '>' + ml(s.title || '') + '</h3>' +
          '<div class="who"' + de(P + '.by') + '>' + esc(s.by || '') + '</div></div>' +
          '<div class="photo" style="height:248px;border-radius:14px"><img loading="lazy" alt="" data-img="' + slot + '" src="' + esc(imgs[slot] || att(rel)) + '" ' + imFall(rel) + '><div class="tint"></div></div></div>';
      }).join('') + '</div></div></section>';

    SEC.zig = '<section class="sec" data-section="zig"><div class="wrap">' +
      '<div class="center"><h2 class="tt rv">' + ml(TT.zigT) + '</h2></div><div style="margin-top:100px">' +
      zigs.map(function (z, i) {
        var P = 'zigs.' + i, slot = 'zig.' + i, rel = IMG_ZIG[i % IMG_ZIG.length];
        var txt = '<div class="rv' + (i % 2 ? ' d1' : '') + '"><div class="cap"' + de(P + '.cap') + '>' + esc(z.cap || '') + '</div><h3' + de(P + '.title') + '>' + ml(z.title || '') + '</h3>' +
          '<p' + de(P + '.desc') + '>' + ml(z.desc || '') + '</p></div>';
        var vis = '<div class="zcard rv' + (i % 2 ? '' : ' d1') + '" style="height:340px"><div class="photo" style="height:100%"><img loading="lazy" alt="" data-img="' + slot + '" src="' + esc(imgs[slot] || att(rel)) + '" ' + imFall(rel) + '><div class="tint"></div></div></div>';
        return '<div class="zig">' + (i % 2 ? vis + txt : txt + vis) + '</div>';
      }).join('') + '</div></div></section>';

    /* 타이핑 스크럽 슬로건 — 마크업은 완성 상태 출고(무JS/정적 폴백 대비) */
    var slog2 = TT.slog2p + d.productName + TT.slog2s;
    function tw(txt) {
      return '<span class="tw"><span class="ghost">' + esc(txt) + '</span><span class="fillw"><span class="done">' + esc(txt) + '</span><i class="caret"></i></span></span>';
    }
    SEC.typeline = '<div class="track type-track" id="typetrack" data-section="typeline"><section class="slogan stage"><div class="wrap center" style="width:100%">' +
      '<p class="oneline typeline">' + tw(TT.slog1) + '<br>' + tw(slog2) + '</p></div></section></div>';

    if (V.event === 'list') {
      SEC.event = '<section class="sec" id="event" style="background:var(--bg1)" data-section="event"><div class="wrap center">' +
        '<h2 class="tt rv">' + esc(TT.evT) + '</h2><p class="sub rv d1">' + esc(TT.evS) + '</p>' +
        '<div class="elist rv d2">' + benefits.map(function (b, i) {
          var P = 'benefits.' + i;
          return '<div class="eli"><span class="ic">✓</span><div>' +
            '<div class="cap"' + de(P + '.cap') + '>' + esc(b.cap || '') + '</div>' +
            '<b' + de(P + '.title') + '>' + esc(String(b.title || '').replace(/\n/g, ' ')) + '</b></div></div>';
        }).join('') + '</div></div></section>';
    } else
    SEC.event = '<section class="sec" style="padding-top:0" id="event" data-section="event"><div class="wrap center">' +
      '<h2 class="tt rv">' + esc(TT.evT) + '</h2><p class="sub rv d1">' + esc(TT.evS) + '</p>' +
      '<div class="egrid" style="margin-top:70px">' + benefits.map(function (b, i) {
        var P = 'benefits.' + i, slot = 'event.' + i, rel = IMG_EV[i % IMG_EV.length];
        return '<div class="ecard rv' + (i ? ' d' + i : '') + '"><div class="photo" style="height:190px"><img loading="lazy" alt="" data-img="' + slot + '" src="' + esc(imgs[slot] || att(rel)) + '" ' + imFall(rel) + '></div>' +
          '<span class="cap"' + de(P + '.cap') + '>' + esc(b.cap || '') + '</span><b' + de(P + '.title') + '>' + ml(b.title || '') + '</b>' +
          '<span class="lnk"' + de(P + '.link') + '>' + esc(b.link || '') + '</span></div>';
      }).join('') + '</div></div></section>';

    /* 지도 SVG — 역 밴드 텍스트는 eventPlace 둘째 줄 첫 어절(없으면 밴드 숨김) */
    var mapSvg = '<svg class="mapsvg" viewBox="0 0 700 340" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="700" height="340" fill="#EDF1F6"/>' +
      '<path d="M0 250 C140 210 240 300 420 262 C540 236 620 260 700 236 L700 340 L0 340 Z" fill="#DCE8F2"/>' +
      '<g fill="#E2E7EE"><rect x="40" y="40" width="120" height="74" rx="10"/><rect x="180" y="28" width="96" height="60" rx="10"/><rect x="60" y="140" width="90" height="66" rx="10"/><rect x="470" y="30" width="110" height="70" rx="10"/><rect x="460" y="128" width="150" height="76" rx="10"/><rect x="184" y="112" width="88" height="88" rx="10"/><rect x="612" y="40" width="70" height="120" rx="10"/></g>' +
      '<g stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none"><path d="M20 120 H690"/><path d="M170 10 V330"/><path d="M290 10 V220"/><path d="M448 10 V330"/><path d="M20 218 H660"/></g>' +
      '<g stroke="#C9D4E2" stroke-width="3" fill="none"><path d="M20 120 H690"/><path d="M448 10 V330"/></g>' +
      (stationWord ? '<path d="M462 148 L332 186" stroke="' + TH.brand + '" stroke-width="3.5" stroke-dasharray="7 7" fill="none"/>' +
        '<rect x="497" y="86" width="150" height="52" rx="14" fill="' + TH.brand + '"/>' +
        '<text x="572" y="119" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" font-family="inherit">' + esc(stationWord) + '</text>' : '') +
      '<rect x="272" y="186" width="66" height="48" rx="9" fill="#191F28" stroke="' + TH.brand + '" stroke-width="3"/>' +
      '<path d="M305 128c-14 0-24 10-24 23 0 16 24 34 24 34s24-18 24-34c0-13-10-23-24-23z" fill="' + TH.brand + '"/>' +
      '<circle cx="305" cy="152" r="7.5" fill="#fff"/>' +
      '<text x="305" y="102" text-anchor="middle" font-size="18" font-weight="800" fill="' + TH.bink + '" font-family="inherit">' + esc(placeMain.slice(0, 14)) + '</text>' +
      '</svg>';
    SEC.location = '<section class="sec" style="background:var(--bg1)" id="location" data-section="location"><div class="wrap center">' +
      '<h2 class="tt rv">' + esc(TT.locT) + '</h2>' +
      '<div class="place' + (V.location === 'simple' ? ' simple' : '') + ' rv d1"><div class="info">' +
      '<b' + de('productName') + '>' + esc(d.productName) + '</b>' +
      '<div class="row" style="margin-top:26px"><span class="k">' + esc(TT.dt) + '</span><span class="v"' + de('eventDate') + '>' + esc(d.eventDate) + '</span></div>' +
      '<div class="row"><span class="k">' + esc(TT.pl) + '</span><span class="v"' + de('eventPlace') + '>' + esc(placeMain) + (placeSub ? '<small>' + esc(placeSub) + '</small>' : '') + '</span></div>' +
      '<a class="pill" href="#apply" style="display:inline-block;margin-top:30px;padding:15px 32px;font-size:15px"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a>' +
      '<p style="margin-top:14px;font-size:12.5px;color:var(--g4)">' + esc(TT.note) + '</p>' +
      '</div>' + (V.location === 'simple' ? '' : '<div class="map"><div class="mapbody">' + mapSvg + '</div>' +
      '<div class="foot"><span class="addr">' + esc(placeMain) + ' <span class="cpy" id="addrcpy" data-addr="' + esc(placeMain) + '" title="' + esc(TT.cpy) + '">⧉</span></span>' +
      '<a class="mlink" href="https://maps.google.com/maps?q=' + encodeURIComponent(placeMain) + '" target="_blank" rel="noopener">' + esc(TT.mlink) + '</a></div></div>') + '</div></div></section>';

    if (V.faq === 'cards') {
      SEC.faq = '<section class="sec" style="background:var(--bg1)" data-section="faq"><div class="wrap center">' +
        '<h2 class="tt rv">' + ml(TT.faqT) + '</h2>' +
        '<div class="faqcards rv d1">' + faq.map(function (f, i) {
          return '<div class="fqc"><b><i>Q.</i> <span' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</span></b>' +
            '<p' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</p></div>';
        }).join('') + '</div></div></section>';
    } else
    SEC.faq = '<section class="sec" style="background:var(--bg1)" data-section="faq"><div class="wrap center">' +
      '<h2 class="tt rv">' + ml(TT.faqT) + '</h2>' +
      '<div class="faq rv d1" style="margin-top:64px">' + faq.map(function (f, i) {
        return '<div class="fitem"><div class="frow"><b><i>Q.</i> <span' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</span></b><span>+</span></div>' +
          '<div class="fans"><p' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</p></div></div>';
      }).join('') + '</div></div></section>';

    SEC.ctaband = '<section class="cta-band' + (V.ctaband === 'dark' ? ' dark2' : '') + '" data-section="ctaband"><div class="deco"></div><div class="deco2"></div><div class="wrap">' +
      '<h2 class="rv"' + de('ctaTitle') + '>' + ml(d.ctaTitle) + '</h2>' +
      '<p class="rv d1"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
      '<div class="act rv d2">' + (d.bannerCta ? '<span class="cta2 w"' + de('bannerCta') + '>' + esc(d.bannerCta) + ' <span class="arr">→</span></span>' : '') +
      '<a class="cta2 w" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + ' <span class="arr">→</span></a></div></div></section>';

    /* ── 섹션 조립 ── */
    var ORDER = ['about', 'chips', 'areas', 'narrative', 'session', 'zig', 'typeline', 'event', 'location', 'faq', 'ctaband'];
    var savedOrd = (Array.isArray(shared.sectionOrder) ? shared.sectionOrder : []).filter(function (k) { return SEC[k]; });
    var ordAll = savedOrd.concat(ORDER.filter(function (k) { return savedOrd.indexOf(k) < 0 && SEC[k]; }));
    var hidden = shared.hiddenSections || [];
    var bodySecs = ordAll.filter(function (k) { return hidden.indexOf(k) < 0; }).map(function (k) { return SEC[k]; }).join('');

    /* ── 고정 apply 폼 + 푸터 + 독 ── */
    var apply = '<section class="sec" id="apply"><div class="wrap center form">' +
      '<h2 class="tt rv"><span' + de('productName') + '>' + esc(d.productName) + '</span>' + esc(TT.applyT) + '</h2>' +
      '<p class="sub rv d1"><span' + de('eventDate') + '>' + esc(d.eventDate) + '</span> ㅣ <span>' + esc(placeMain) + '</span></p>' +
      '<div class="fgrid rv d2" style="margin-top:64px">' +
      '<div><div class="fl">' + esc(TT.fName) + ' <em>*</em></div><input class="fi" type="text" placeholder="' + esc(TT.fPh) + '"></div>' +
      '<div><div class="fl">' + esc(TT.fPhone) + ' <em>*</em></div><input class="fi" type="tel" placeholder="' + esc(TT.fPhTel) + '"></div>' +
      '<div><div class="fl">' + esc(TT.fCompany) + ' <em>*</em></div><input class="fi" type="text" placeholder="' + esc(TT.fPh) + '"></div>' +
      '<div><div class="fl">' + esc(TT.fEmail) + ' <em>*</em></div><input class="fi" type="email" placeholder="' + esc(TT.fPh) + '"></div>' +
      '<div><div class="fl">' + esc(TT.fSize) + ' <em>*</em></div><input class="fi" type="text" placeholder="' + esc(TT.fPh) + '"></div>' +
      '<div><div class="fl">' + esc(TT.fRole) + ' <em>*</em></div><div class="chkrow">' + TT.fRoles.map(function (r, i) {
        return '<span class="chk"><span class="box ' + (i < 2 ? 'on' : 'off') + '">✓</span>' + esc(r) + '</span>';
      }).join('') + '</div></div></div>' +
      '<div class="agree rv d3">' +
      '<span><span class="chk"><span class="box off">✓</span></span> <u>' + esc(TT.agr1) + '</u>' + esc(TT.agr1s) + '</span>' +
      '<span><span class="chk"><span class="box on">✓</span></span> <u>' + esc(TT.agr2) + '</u>' + esc(TT.agr2s) + '</span></div>' +
      '<div class="rv d4" style="margin-top:44px"><button class="pill sbm" type="button" style="padding:18px 80px;font-size:17px" data-fdone="' + esc(TT.fDone) + '"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></div>' +
      '</div></section>';

    var footAnchors = ['#about', '#session', '#event', '#location'];
    var footer = '<footer class="dawnfoot"><div class="in">' +
      '<div class="slog"' + de('tagline') + '>' + ml(d.tagline) + '</div>' +
      '<div class="col"><i>' + esc(TT.fCols[0]) + '</i>' + (d.navLinks || []).slice(0, 4).map(function (l, i) { return '<a href="' + footAnchors[i % 4] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div>' +
      '<div class="col"><i>' + esc(TT.fCols[1]) + '</i><a href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>' +
      '<div class="col"><i>' + esc(TT.fCols[2]) + '</i>' + (d.footerLinks || []).slice(0, 4).map(function (l, i) { return '<a' + de('footerLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div>' +
      '</div><div class="copy"><span' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span><span' + de('productName') + '>' + esc(d.productName) + '</span></div></footer>';

    var dock = hidden.indexOf('dock') >= 0 ? '' :
      '<div class="dock" id="dock" data-section="dock"><span class="tag">' + esc(TT.dockTag) + '</span>' +
      '<p><span' + de('productName') + '>' + esc(d.productName) + '</span> · <span' + de('eventDate') + '>' + esc(d.eventDate) + '</span></p>' +
      '<a class="go" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>';

    /* ── 스크립트: 기능(항상) + 모션(스크럽·리빌·존 전환) ── */
    var fnjs = '<script>(function(){' +
      'document.querySelectorAll(".fitem .frow").forEach(function(rw){rw.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;rw.parentNode.classList.toggle("open");});});' +
      'document.querySelectorAll(".chk").forEach(function(c){c.addEventListener("click",function(){var bx=c.querySelector(".box");bx.classList.toggle("on");bx.classList.toggle("off");});});' +
      'var cp=document.getElementById("addrcpy");if(cp)cp.addEventListener("click",function(){if(navigator.clipboard)navigator.clipboard.writeText(cp.getAttribute("data-addr")||"");cp.textContent="✓";setTimeout(function(){cp.textContent="⧉";},1400);});' +
      'var sb=document.querySelector(".sbm");if(sb)sb.addEventListener("click",function(){sb.textContent=sb.getAttribute("data-fdone")||sb.textContent;sb.style.background="var(--brand-deep)";});' +
      'var gnb=document.getElementById("gnb");if(!gnb.classList.contains("lock"))addEventListener("scroll",function(){gnb.classList.toggle("solid",scrollY>innerHeight-70);},{passive:true});' +
      '})();<\/script>';

    var mot = !motion ? '' : '<script>(function(){' +
      'var reduce=(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)||document.documentElement.classList.contains("nomo");' +
      'function clamp01(v){return Math.min(Math.max(v,0),1);}' +
      /* 리빌 */
      'if("IntersectionObserver" in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target);}});},{threshold:.18});document.querySelectorAll(".rv").forEach(function(el){io.observe(el);});}' +
      'else{document.querySelectorAll(".rv").forEach(function(el){el.classList.add("on");});}' +
      /* 카운트업 */
      'if("IntersectionObserver" in window&&!reduce){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io2.unobserve(e.target);' +
      'var el=e.target,raw=el.getAttribute("data-count")||"0",target=parseFloat(raw.replace(/,/g,"")),comma=raw.indexOf(",")!==-1,t0=null;' +
      'function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1400,1),ease=1-Math.pow(1-p,3),v=Math.round(target*ease);' +
      'el.textContent=comma?v.toLocaleString("en-US"):String(v);if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);});},{threshold:.5});' +
      'document.querySelectorAll("[data-count]").forEach(function(el){io2.observe(el);});}' +
      /* 히어로 스크럽 */
      'var kvTrack=document.getElementById("kvtrack"),kvIn=document.querySelector(".kv .in"),kvPhoto=document.querySelector(".kv-photo"),kvOv=document.querySelector(".kv-photo .ov"),kvSub=document.querySelector(".kv-sub"),kvImg=document.querySelector(".kv-photo .kimg");' +
      'if(reduce&&kvImg&&kvImg.tagName==="VIDEO"){kvImg.autoplay=false;kvImg.pause();}' +
      'function heroScrub(){if(!kvTrack)return;var vh=innerHeight,p=clamp01((scrollY-kvTrack.offsetTop)/(kvTrack.offsetHeight-vh));' +
      'var t=clamp01((p-0.38)/0.22);kvIn.style.opacity=String(1-t);' +
      'kvIn.style.transform="translateY("+(-80*t)+"px) scale("+(1-0.05*t)+")";kvIn.style.pointerEvents=t>0.6?"none":"auto";' +
      'var q=clamp01((p-0.45)/0.35),e=1-Math.pow(1-q,3);' +
      'if(kvImg)kvImg.style.filter="blur("+(12*e).toFixed(1)+"px)";' +
      'kvPhoto.style.transform="scale("+(1-0.14*e)+")";kvPhoto.style.borderRadius=(32*e).toFixed(1)+"px";' +
      'kvOv.style.opacity=(0.72-0.3*e).toFixed(3);' +
      'var s=clamp01((p-0.58)/0.22),se=1-Math.pow(1-s,3);' +
      'kvSub.style.opacity=String(se);kvSub.style.transform="translateY("+(36*(1-se))+"px)";kvSub.style.pointerEvents=se>0.5?"auto":"none";}' +
      /* 스텝 스크럽 */
      'var areas=document.getElementById("areas");' +
      'function areasScrub(){if(!areas)return;var vh=innerHeight,p=clamp01((scrollY-areas.offsetTop)/(areas.offsetHeight-vh));' +
      'var srows=areas.querySelectorAll(".srow"),pvs=areas.querySelectorAll(".pv"),idx=Math.min(srows.length-1,Math.floor(p*srows.length));' +
      'srows.forEach(function(r,i){r.classList.toggle("on",i===idx);});pvs.forEach(function(v,i){v.classList.toggle("on",i===idx);});}' +
      /* 내러티브 블러 리빌 */
      'var nar=document.getElementById("nar");' +
      'function narScrub(){if(!nar)return;var vh=innerHeight,p=clamp01((scrollY-nar.offsetTop)/(nar.offsetHeight-vh)),nl=nar.querySelectorAll(".nline");' +
      'nl.forEach(function(el,i){var t=clamp01(((p-0.12)/0.76)*nl.length-i);el.style.opacity=String(0.15+0.85*t);el.style.filter=t>=1?"none":"blur("+(7*(1-t)).toFixed(2)+"px)";});}' +
      /* 타이핑 스크럽 */
      'var typeTrack=document.getElementById("typetrack"),tline=document.querySelector(".typeline"),tws=tline?tline.querySelectorAll(".tw"):[],tFulls=[],tDones=[],tCarets=[];' +
      'tws.forEach(function(w){tDones.push(w.querySelector(".done"));tCarets.push(w.querySelector(".caret"));tFulls.push(w.querySelector(".done").textContent);});' +
      'function typeScrub(){if(!typeTrack||tws.length<2)return;var vh=innerHeight,p=clamp01((scrollY-typeTrack.offsetTop)/(typeTrack.offsetHeight-vh));' +
      'tline.style.transform="scale("+(1.5-0.5*clamp01(p/0.75))+")";' +
      'var total=tFulls[0].length+tFulls[1].length,idx=Math.round(total*clamp01((p-0.12)/0.72));' +
      'var i1=Math.min(idx,tFulls[0].length),i2=Math.max(0,idx-tFulls[0].length);' +
      'tDones[0].textContent=tFulls[0].slice(0,i1);tDones[1].textContent=tFulls[1].slice(0,i2);' +
      'tCarets[0].style.display=(idx<=tFulls[0].length&&idx>0)?"":"none";tCarets[1].style.display=(idx>tFulls[0].length&&idx<total)?"":"none";}' +
      'if(!reduce){addEventListener("scroll",function(){heroScrub();areasScrub();narScrub();typeScrub();},{passive:true});heroScrub();areasScrub();narScrub();typeScrub();}' +
      /* 배경 존 전환 — 판정선 78% (다음 섹션이 보이기 시작하면 선행 전환) */
      'var zones=Array.prototype.slice.call(document.querySelectorAll("[data-bg]"));' +
      'if(reduce)document.body.style.transition="none";' +
      'function bgZone(){var mid=scrollY+innerHeight*0.78,bg="#fff";' +
      'for(var zi=0;zi<zones.length;zi++){var z=zones[zi],top=z.offsetTop,bot=top+z.offsetHeight;if(mid>=top&&mid<bot){bg=z.getAttribute("data-bg");break;}}' +
      'if(document.body.style.backgroundColor!==bg)document.body.style.backgroundColor=bg;}' +
      'addEventListener("scroll",bgZone,{passive:true});bgZone();' +
      /* 플로팅 독 */
      'var dock=document.getElementById("dock"),applySec=document.getElementById("apply");' +
      'function dockTick(){if(!dock)return;var show=scrollY>innerHeight;if(applySec&&scrollY+innerHeight>applySec.offsetTop+200)show=false;dock.classList.toggle("on",show);}' +
      'addEventListener("scroll",dockTick,{passive:true});dockTick();' +
      '})();<\/script>';
    /* motion off — 정적 조립: 존 배경을 섹션에 직접 박고, 독은 숨김 유지 */
    var staticFix = motion ? '' : '<script>(function(){' +
      'document.querySelectorAll("[data-bg]").forEach(function(z){z.style.background=z.getAttribute("data-bg");});' +
      'document.querySelectorAll(".rv").forEach(function(el){el.classList.add("on");});' +
      'var d=document.getElementById("dock");if(d)d.remove();' +
      'var v=document.querySelector(".kv-photo video");if(v){v.autoplay=false;v.pause();}' +
      '})();<\/script>';

    return '<!doctype html><html lang="' + LANG + '"' + (motion ? '' : ' class="nomo"') + '><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      (LANG === 'ja' || LANG === 'zh' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + (LANG === 'ja' ? 'Noto+Sans+JP' : 'Noto+Sans+SC') + ':wght@400;500;600;700;800&display=swap">' : '') +
      '<style>' + css(LANG, TH) + '</style></head><body data-pack="mbmtoss">' +
      kv + bodySecs + apply + footer + dock + fnjs + mot + staticFix + '</body></html>';
  };

  window.MBMTOSS_SECTION_SPEC = {
    template: [
      { type: 'about', tier: 'mid' }, { type: 'chips', tier: 'mid' }, { type: 'areas', tier: 'core' },
      { type: 'narrative', tier: 'mid' }, { type: 'session', tier: 'core' }, { type: 'zig', tier: 'mid' },
      { type: 'typeline', tier: 'mid' }, { type: 'event', tier: 'mid' }, { type: 'location', tier: 'core' },
      { type: 'faq', tier: 'core' }, { type: 'ctaband', tier: 'core' },
    ],
    fixed: ['dock'],
    labels: { about: '수치 하이라이트', chips: '칩 슬로건', areas: '핵심 분야 스텝', narrative: '다크 내러티브', session: '세션', zig: '지그재그', typeline: '타이핑 슬로건', event: '이벤트 혜택', location: '일정·장소', faq: 'FAQ', ctaband: 'CTA 밴드', dock: '플로팅 CTA' },
  };
  window.MBMTOSS_STYLE = { id: 'mbmtoss', name: 'Toss Green', desc: '그린 포인트 · 영상 히어로 핀 스크럽 · 스텝/타이핑/블러 스크럽 · 배경 존 전환 · 플로팅 CTA', swatch: 'linear-gradient(135deg,#05D16E 0%,#04B863 50%,#121419 100%)' };
})();
