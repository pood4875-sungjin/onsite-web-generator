/* packs.ensol.js — "Ensol Release" 제품 릴리즈 이벤트 랜딩 팩. classic <script src>.
   소스: packs.ensol.sample.html 씨드 (CIVIL NX 2026 릴리즈 웨비나 — 영상 히어로 핀 스크럽).
   구성(고정 TEMPLATE): GNB(투명→글래스) → KV 핀(220vh 스크럽+answer 실높이 오버랩: 영상 풀블리드 → 타이포 페이드 → 블러+미션 멘트)
   → [movable] answer(그래픽 카드 3, 오버랩 등장) → skill(자동재생 탭 5) → feature(좌 고정 타이틀+카드 3)
   → agenda(다크 리스트+우측 드로어) → register(블루 그라 신청 폼) → faq(아코디언) → free(데이터 웨이브 캔버스 CTA)
   → footer → dock(플로팅 바) + 좌측 snav 도트.
   실측 토큰: 블루 #3186ff/#346bf0/#4ea0ff · 다크 #040308 · 잉크 #222 · 블루그레이 #4E5968 · 라운드 0(각짐) · 컨테이너 1320 · GNB/footer 내용 1920 컨테인.
   타이틀: 줄 단위 라이트(lw)→볼드(hw) + **마커**=블루 그라데이션(gt). 섹션 타이틀 clamp(44~84px) 반응.
   opts.motion===false → nomo: 핀 해제·오버랩 해제·전부 표시·독/웨이브 제거(썸네일 안전). */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }

  var BASE = (function () { try { var sc = document.currentScript && document.currentScript.src || ''; return sc ? sc.slice(0, sc.lastIndexOf('/') + 1) : ''; } catch (e) { return ''; } })();
  BASE = BASE.replace(/packs\/(ppt|web|edm)\/$/, 'app/');
  var PROD = 'https://midas-drs.pages.dev/app/';
  function att(rel) { return BASE + 'bg/' + rel; }
  function imFall(rel) {
    return 'onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + PROD + 'bg/' + rel + '\';}else{this.style.display=\'none\';}"';
  }

  var IMG_ANSWER = ['ensol-kv4.avif', 'ensol-kv3.avif', 'ensol-kv2.avif'];
  var IMG_SKILL = ['ensol-skill1.jpg', 'ensol-skill2.jpg', 'ensol-skill3.jpg', 'ensol-skill4.jpg', 'ensol-skill5.jpg'];
  var IMG_FEAT = ['mbmtoss-hero3.jpg', 'mbmtoss-session.jpg', 'mbmtoss-network.jpg'];
  var HERO_MP4 = 'ensol-hero.mp4';

  /* 데모 기본 콘텐츠(EN이 시안 원문 — 릴리즈 웨비나). AI 초안(compose-web)이 오면 교체된다 */
  var DEMO_EN = {
    productName: 'HYPER-S',
    tagline: 'Insanely Fast. Boundlessly Capable.',
    navTitle: 'MIDAS CIVIL NX',
    navLinks: ['CIVIL NX 2026', 'Features', 'Agenda', 'Webinar'],
    primaryCta: 'Register Now',
    eventDate: '2026.03.18, 9:00 - 10:00 (GMT)',
    kvNote: 'LIVE WEBINAR & ON-DEMAND',
    whyEyebrow: 'Why CIVIL NX 2026',
    bannerText: 'Engineers have always needed **faster analysis**, a **seamless workflow**, and **stable large-scale runs**.\nCIVIL NX 2026, powered by the **HYPER-S engine**, goes beyond your engineering struggles.',
    answerTitle: 'The Answer,\nCIVIL NX 2026',
    features: [
      { title: 'Incomparable\nSpeed', desc: 'With analysis speeds up to 6× faster than conventional solutions, project turnaround times are dramatically reduced, boosting overall productivity by more than twofold.' },
      { title: 'User-driven\nWorkflow', desc: 'Selective analysis and independent control by load case enable engineers to work exactly the way they want, delivering a truly flexible and engineer-centric workflow.' },
      { title: 'Unrivaled\nAnalysis', desc: 'Advanced features such as buffeting analysis and simultaneous analysis systems, unavailable in other software, establish a new benchmark for construction FEM.' },
    ],
    skillTitle: 'Boundless Capabilities\nof CIVIL NX 2026',
    skills: [
      { tab: 'Virtual Beam Design', title: 'Virtual Beam Design', desc: 'Combine plate and beam behavior into one composite girder model. Virtual Beam Design lets you review and design girders without rebuilding your structure, while preserving accurate load distribution and irregular geometry representation.' },
      { tab: 'Curved RSI', title: 'Curved Rail Structure Interaction', desc: 'Automatically generate a 3D track–structure coupling model that accounts for curvature, alignment, and multi-track layouts. CIVIL NX captures the nonlinear interaction between rail and structure, delivering more accurate rail stress predictions than linear approximations.' },
      { tab: 'CS Buckling Analysis', title: 'Buckling Analysis\nwith Construction Stage', desc: 'Evaluate structural stability at every construction stage without creating separate models. CIVIL NX applies buckling analysis directly within staged construction, helping you detect instability risks earlier and reduce modeling effort.' },
      { tab: 'Fiber Pushover', title: 'Pushover Analysis\nUsing Fiber Hinge Type', desc: 'Simulate nonlinear structural behavior using fiber-based hinge modeling. CIVIL NX captures distributed plasticity and post-yield response more realistically than concentrated hinge methods, giving you more reliable performance assessments.' },
      { tab: 'Advanced Analysis +', title: 'Advanced Analysis +', badge: 'Coming Sep 2026', desc: 'CIVIL NX powered by the HYPER-S engine, advances your analysis and design capabilities. It enables high-end features such as Multi P-delta and Buffeting analysis, global localization design standards, and an AI Assistant, setting a new standard in engineering.' },
    ],
    featureTitle: 'See How Your Current\nCIVIL NX Can Do More.',
    featureSub: 'Let our experts help you apply the new features instantly. Book a quick chat today!',
    fitems: [
      { title: 'Faster Analysis Solver — up to 6×', desc: 'CIVIL NX powered by the HYPER-S engine keeps your workflow moving and ensures faster results.' },
      { title: 'Localized Features & Global Design Codes', desc: 'Global design code coverage and localized features, with multi-language support for worldwide projects.' },
      { title: 'Unrivaled Analysis, Unmatched Precision', desc: 'Advanced features unavailable in other software establish a new benchmark for construction FEM.' },
    ],
    agendaTitle: 'Webinar Agenda',
    agenda: [
      { time: '9:00 ~ 9:10', title: 'Opening — CIVIL NX 2026 with HYPER-S', by: 'MIDAS CIVIL Product Team', txt: 'The next generation of structural analysis: what changes with the CIVIL NX 2026 release and the HYPER-S analysis engine.', pts: ['Release overview & webinar guide', 'HYPER-S engine at a glance', 'All-Access Pass benefits'] },
      { time: '9:10 ~ 9:25', title: 'Incomparable Speed — up to 6× Faster', by: 'HYPER-S Engine Team', txt: 'By focusing on only the modified components, CIVIL NX keeps your workflow moving and ensures faster results — the usual 14-hour analysis time reduced by 70% with selective re-analysis.', pts: ['Up to 6× faster analysis speed', 'Selective re-analysis by load case', 'Simultaneous parallel processing'] },
      { time: '9:25 ~ 9:45', title: 'Boundless Capabilities Deep-Dive', by: 'Structural Solution Engineer', txt: 'Four advanced features that establish a new benchmark for construction FEM, demonstrated on real project models.', pts: ['Virtual Beam Design', 'Curved Rail Structure Interaction', 'Buckling Analysis with Construction Stage', 'Pushover Analysis Using Fiber Hinge Type'] },
      { time: '9:45 ~ 9:55', title: 'Roadmap — Advanced Analysis +', by: 'MIDAS CIVIL Product Team', txt: 'Coming this September: high-end features setting a new standard in engineering. Be part of the evolution toward a more powerful CIVIL NX.', pts: ['Multi P-delta analysis', 'Buffeting analysis', 'Global localization design standards', 'AI Assistant'] },
      { time: '9:55 ~ 10:00', title: 'Q&A & Closing', by: 'All Speakers', txt: 'Live questions from attendees, plus how to get the Release Note and Technical White Paper with your attendance.', pts: ['Live Q&A', 'Release Note · Technical White Paper guide'] },
    ],
    regTitle: 'CIVIL NX 2026\n**All-Access Pass**',
    formCta: 'Register now — get the CIVIL NX 2026 Leaflet',
    doneTitle: 'Thank you for registering.',
    doneText: 'Your Leaflet is in your inbox!\nAdd the March 18 webinar to your calendar to unlock an exclusive White Paper.\nWant to see how CIVIL NX 2026 transforms your projects? Book a quick chat with our experts today!',
    faq: [
      { q: 'What’s new in CIVIL NX 2026?', a: 'The HYPER-S analysis engine brings up to 6× faster analysis, selective re-analysis by load case, and advanced features such as Virtual Beam Design and Curved RSI.' },
      { q: 'Is the webinar free?', a: 'Yes — registration is free, and every registrant receives the CIVIL NX 2026 Leaflet by email.' },
      { q: 'Can I watch on-demand?', a: 'Yes. Register once and you get both the live session and the on-demand recording afterward.' },
      { q: 'How do I activate the new features?', a: 'Existing CIVIL NX users receive the 2026 update through the license server — our experts can help you apply the new features instantly.' },
      { q: 'Which languages are supported?', a: 'The CIVIL NX interface supports multiple languages, with localized features and global design codes for worldwide projects.' },
    ],
    ctaTitle: 'The Best Time to\n**Move Forward**',
    ctaSub: 'The next generation of structural analysis is here.\nExperience up to 6× faster performance today.',
    secondaryCta: '1:1 Consultation',
    dockText: 'New Release: Master CIVIL NX 2026 Updates Live on March 18',
    footerBrand: 'MIDAS Group',
    footerCopyright: '© MIDAS IT. All rights reserved.',
  };
  var DEMO = {
    productName: 'HYPER-S',
    tagline: '압도적으로 빠르게. 한계 없이 강력하게.',
    navTitle: 'MIDAS CIVIL NX',
    navLinks: ['CIVIL NX 2026', '신기능', '아젠다', '웨비나'],
    primaryCta: '사전 등록',
    eventDate: '2026.03.18, 9:00 - 10:00 (GMT)',
    kvNote: '라이브 웨비나 & 온디맨드',
    whyEyebrow: 'Why CIVIL NX 2026',
    bannerText: '엔지니어에게는 늘 **더 빠른 해석**, **끊김 없는 워크플로우**, **안정적인 대규모 해석**이 필요했습니다.\n**HYPER-S 엔진**을 탑재한 CIVIL NX 2026이 그 고민 너머로 안내합니다.',
    answerTitle: '그 해답,\nCIVIL NX 2026',
    features: [
      { title: '압도적인\n해석 속도', desc: '기존 대비 최대 6배 빠른 해석 속도로 프로젝트 턴어라운드를 획기적으로 줄이고, 전체 생산성을 두 배 이상 끌어올립니다.' },
      { title: '엔지니어 중심\n워크플로우', desc: '하중 케이스별 선택 해석과 독립 제어로, 엔지니어가 원하는 방식 그대로 유연하게 일할 수 있습니다.' },
      { title: '견줄 수 없는\n해석 기능', desc: '버페팅 해석·동시 해석 시스템 등 타 소프트웨어에 없는 고급 기능으로 건설 FEM의 새로운 기준을 제시합니다.' },
    ],
    skillTitle: 'CIVIL NX 2026의\n무한한 가능성',
    skills: [
      { tab: 'Virtual Beam Design', title: 'Virtual Beam Design', desc: '플레이트와 빔 거동을 하나의 합성 거더 모델로 통합합니다. 구조를 다시 만들지 않고도 거더를 검토·설계하면서 정확한 하중 분배와 비정형 형상 표현을 유지합니다.' },
      { tab: 'Curved RSI', title: '곡선 궤도-구조 상호작용', desc: '곡률·선형·복수 궤도를 반영한 3D 궤도-구조 연성 모델을 자동 생성합니다. 선형 근사보다 정확한 레일 응력 예측을 제공합니다.' },
      { tab: '시공단계 좌굴', title: '시공단계 연동\n좌굴 해석', desc: '별도 모델 없이 모든 시공단계에서 구조 안정성을 평가합니다. 시공단계 안에서 좌굴 해석을 바로 적용해 불안정 리스크를 조기에 발견합니다.' },
      { tab: 'Fiber Pushover', title: '파이버 힌지\n푸시오버 해석', desc: '파이버 기반 힌지 모델링으로 비선형 거동을 시뮬레이션합니다. 집중 힌지 방식보다 현실적인 소성 분포·항복 후 응답을 제공합니다.' },
      { tab: 'Advanced Analysis +', title: 'Advanced Analysis +', badge: 'Coming Sep 2026', desc: 'HYPER-S 엔진 기반의 하이엔드 기능 — Multi P-delta·버페팅 해석·글로벌 설계기준 로컬라이징·AI 어시스턴트가 엔지니어링의 새 기준을 만듭니다.' },
    ],
    featureTitle: '지금 쓰는 CIVIL NX로\n더 많은 것이 가능합니다.',
    featureSub: '전문가가 신기능 적용을 바로 도와드립니다. 지금 상담을 예약하세요!',
    fitems: [
      { title: '최대 6배 빠른 해석 솔버', desc: 'HYPER-S 엔진을 탑재한 CIVIL NX가 워크플로우를 멈추지 않게 하고, 더 빠른 결과를 보장합니다.' },
      { title: '로컬라이징 기능 & 글로벌 설계기준', desc: '글로벌 설계기준 커버리지와 로컬라이징, 다국어 지원으로 전 세계 프로젝트에 대응합니다.' },
      { title: '견줄 수 없는 해석, 비교 불가한 정밀도', desc: '타 소프트웨어에 없는 고급 기능이 건설 FEM의 새로운 기준을 제시합니다.' },
    ],
    agendaTitle: '웨비나 아젠다',
    agenda: [
      { time: '9:00 ~ 9:10', title: '오프닝 — HYPER-S와 함께하는 CIVIL NX 2026', by: 'MIDAS CIVIL 제품팀', txt: '구조 해석의 다음 세대: CIVIL NX 2026 릴리즈와 HYPER-S 해석 엔진이 바꾸는 것들.', pts: ['릴리즈 개요 & 웨비나 안내', 'HYPER-S 엔진 한눈에 보기', 'All-Access Pass 혜택'] },
      { time: '9:10 ~ 9:25', title: '압도적인 속도 — 최대 6배 빠르게', by: 'HYPER-S 엔진팀', txt: '변경된 부분만 다시 해석하는 선택적 재해석으로, 14시간 걸리던 해석을 70% 단축한 사례를 시연합니다.', pts: ['최대 6배 빠른 해석 속도', '하중 케이스별 선택 재해석', '동시 병렬 처리'] },
      { time: '9:25 ~ 9:45', title: '무한한 가능성 딥다이브', by: '구조 솔루션 엔지니어', txt: '건설 FEM의 새 기준을 만드는 고급 기능 4종을 실제 프로젝트 모델로 시연합니다.', pts: ['Virtual Beam Design', '곡선 궤도-구조 상호작용', '시공단계 연동 좌굴 해석', '파이버 힌지 푸시오버'] },
      { time: '9:45 ~ 9:55', title: '로드맵 — Advanced Analysis +', by: 'MIDAS CIVIL 제품팀', txt: '오는 9월 공개: 엔지니어링의 새 기준을 만드는 하이엔드 기능들을 미리 만나보세요.', pts: ['Multi P-delta 해석', '버페팅 해석', '글로벌 설계기준 로컬라이징', 'AI 어시스턴트'] },
      { time: '9:55 ~ 10:00', title: 'Q&A & 클로징', by: '전체 연사', txt: '실시간 질의응답과 함께, 참석자에게 제공되는 릴리즈 노트·기술 백서 수령 방법을 안내합니다.', pts: ['라이브 Q&A', '릴리즈 노트 · 기술 백서 안내'] },
    ],
    regTitle: 'CIVIL NX 2026\n**All-Access Pass**',
    formCta: '지금 등록하고 CIVIL NX 2026 리플릿 받기',
    doneTitle: '등록이 완료되었습니다.',
    doneText: '리플릿이 메일함으로 발송되었습니다!\n3월 18일 웨비나를 캘린더에 추가하면 스페셜 백서를 드립니다.\nCIVIL NX 2026이 프로젝트를 어떻게 바꾸는지 궁금하다면, 지금 전문가 상담을 예약하세요!',
    faq: [
      { q: 'CIVIL NX 2026의 새로운 점은 무엇인가요?', a: 'HYPER-S 해석 엔진으로 최대 6배 빠른 해석, 하중 케이스별 선택 재해석, Virtual Beam Design·곡선 RSI 등 고급 기능이 추가됩니다.' },
      { q: '웨비나는 무료인가요?', a: '네, 등록은 무료이며 등록자 전원에게 CIVIL NX 2026 리플릿을 이메일로 보내드립니다.' },
      { q: '다시보기가 제공되나요?', a: '네. 한 번 등록하면 라이브 세션과 종료 후 온디맨드 다시보기를 모두 이용할 수 있습니다.' },
      { q: '신기능은 어떻게 활성화하나요?', a: '기존 CIVIL NX 사용자는 라이선스 서버를 통해 2026 업데이트를 받게 되며, 전문가가 신기능 적용을 바로 도와드립니다.' },
      { q: '어떤 언어를 지원하나요?', a: 'CIVIL NX 인터페이스는 다국어를 지원하며, 로컬라이징 기능과 글로벌 설계기준으로 전 세계 프로젝트에 대응합니다.' },
    ],
    ctaTitle: '지금이 가장 좋은\n**전진의 순간**',
    ctaSub: '구조 해석의 다음 세대가 도착했습니다.\n최대 6배 빠른 성능을 오늘 경험하세요.',
    secondaryCta: '1:1 상담',
    dockText: '신규 릴리즈: 3월 18일 라이브에서 CIVIL NX 2026 업데이트를 만나보세요',
    footerBrand: 'MIDAS Group',
    footerCopyright: '© MIDAS IT. All rights reserved.',
  };

  /* 템플릿 고정 라벨 — 4언어 (번역 파이프라인을 안 타므로 팩이 직접) */
  var TTALL = {
    ko: { fName: '성함', fEmail: '이메일', fCompany: '회사명', fJob: '직함', fPhone: '연락처', fCountry: '국가/지역', fIndustry: '산업 분야 (예: 교량, 철도, 플랜트)', faqT: 'FAQ', prev: '← 이전', next: '다음 →', close: '닫기' },
    en: { fName: 'Name', fEmail: 'Email', fCompany: 'Company', fJob: 'Job Title', fPhone: 'Phone Number', fCountry: 'Country / Region', fIndustry: 'Industry (e.g. Bridge, Rail, Plant)', faqT: 'FAQ', prev: '← Prev', next: 'Next →', close: 'Close' },
    ja: { fName: 'お名前', fEmail: 'メール', fCompany: '会社名', fJob: '役職', fPhone: '電話番号', fCountry: '国・地域', fIndustry: '業種（例：橋梁、鉄道、プラント）', faqT: 'FAQ', prev: '← 前へ', next: '次へ →', close: '閉じる' },
    zh: { fName: '姓名', fEmail: '邮箱', fCompany: '公司', fJob: '职位', fPhone: '电话', fCountry: '国家/地区', fIndustry: '行业（例：桥梁、铁路、工厂）', faqT: 'FAQ', prev: '← 上一个', next: '下一个 →', close: '关闭' },
  };

  /* 타이틀: 줄 단위 라이트(lw)→볼드(hw), **마커**=그라데이션(gt) */
  function gtml(line) {
    return esc(line).replace(/\*\*(.+?)\*\*/g, '<span class="gt">$1</span>');
  }
  function titleHtml(text) {
    var lines = String(text || '').split('\n');
    if (lines.length === 1) return gtml(lines[0]);
    return lines.map(function (ln, i) {
      return '<span class="' + (i === 0 ? 'lw' : 'hw') + '">' + gtml(ln) + '</span>';
    }).join('<br>');
  }

  function css(LANG) {
    return [
      ':root{--lime:#3186ff;--lime2:#346bf0;--onp:#fff;--sub:#4ea0ff;--onsub:#fff;',
      '--btng:linear-gradient(89.58deg,#3186ff 0%,#346bf0 30%,#4ea0ff 55%,#346bf0 78%,#3186ff 100%);',
      '--txtg:linear-gradient(89.58deg,#3186ff .28%,#346bf0 44.45%,#4ea0ff 99.55%);',
      '--dark:#040308;--ink:#222;--g:#444;--g2:#666;--g3:#999;--line:#DEDEDE;--bgsoft:#F6F9FE;--bgray:#4E5968}',
      '*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}',
      'body{font-family:' + (LANG === 'ja' ? '"Noto Sans JP",' : LANG === 'zh' ? '"Noto Sans SC",' : '') + '"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased;letter-spacing:-.01em;overflow-x:clip;word-break:keep-all}',
      'img,video{display:block;max-width:100%}a{text-decoration:none;color:inherit}ul{list-style:none}',
      '.wrap{max-width:1320px;margin:0 auto;padding:0 28px}',
      'h2.tt{font-size:clamp(40px,4.2vw,72px);line-height:1.2;letter-spacing:-.02em}',
      'h2 .lw{font-weight:500}h2 .hw{font-weight:700}',
      '.gt{background:var(--txtg);-webkit-background-clip:text;background-clip:text;color:transparent}',
      '[data-edit]{white-space:pre-wrap}',
      /* 공용 버튼 — 각진 그라 */
      '.gbtn{display:flex;gap:20px}',
      '.gbtn a{border-radius:0;display:flex;align-items:center;justify-content:center;gap:8px;height:56px;padding:0 34px;font-size:18px;font-weight:600;letter-spacing:-.36px;transition:.3s;cursor:pointer}',
      '.gbtn a .arr{font-weight:700;transition:transform .3s}.gbtn a:hover .arr{transform:translateX(4px)}',
      '.gbtn .lime{background:var(--btng);background-size:220% 100%;background-position:0% 50%;color:#fff;transition:background-position .6s ease}.gbtn .lime:hover{background-position:100% 50%}',
      '.gbtn .white{background:rgba(255,255,255,.92);color:var(--ink)}.gbtn .white:hover{background:#fff}',
      /* 리빌 */
      '.rv{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}',
      '.rv.on{opacity:1;transform:none}',
      'h2.wt .w,h2.wt .gt{display:inline-block;opacity:0;transform:translate3d(0,14px,0);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}',
      'h2.wt.on .w,h2.wt.on .gt{opacity:1;transform:none}',
      /* 좌측 섹션 도트 */
      '.snav{position:fixed;left:22px;top:50%;transform:translateY(-50%);z-index:80;display:flex;flex-direction:column;gap:12px;opacity:0;pointer-events:none;transition:opacity .4s}',
      '.snav.vis{opacity:1;pointer-events:auto}',
      '.snav a{width:7px;height:7px;border-radius:50%;background:rgba(4,3,8,.22);transition:background .25s,transform .25s}',
      '.snav a.on{background:var(--lime);transform:scale(1.35)}',
      '.snav.ondark a{background:rgba(255,255,255,.3)}.snav.ondark a.on{background:#fff}',
      /* GNB — 배경 풀블리드, 내용 1920 컨테인 */
      '.gnb{position:fixed;top:0;left:0;right:0;z-index:100;transition:background .35s,box-shadow .35s}',
      '.gnb .in{max-width:none;margin:0;padding:0 56px;height:72px;display:flex;align-items:center;gap:24px}',
      '.gnb .logo{font-size:21px;font-weight:700;color:#fff;letter-spacing:-.01em}',
      '.gnb nav{display:flex;gap:6px;margin-left:auto}',
      '.gnb nav a{padding:9px 14px;font-size:16px;font-weight:600;color:rgba(255,255,255,.85);transition:color .2s}',
      '.gnb nav a:hover{color:var(--sub)}',
      '.gnb .cta{border-radius:0;background:var(--btng);background-size:220% 100%;background-position:0% 50%;color:#fff;font-size:16px;font-weight:700;padding:16px 22px;transition:background-position .6s ease}.gnb .cta:hover{background-position:100% 50%}',
      '.gnb.solid{background:rgba(255,255,255,.72);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4)}',
      '.gnb.solid .logo{color:var(--ink)}.gnb.solid nav a{color:var(--g)}.gnb.solid nav a:hover{color:var(--lime2)}',
      /* KV — 핀 스크럽 */
      '.kv{position:relative;height:320vh}',
      '.kv .stick{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--dark)}',
      '.kv .ph{position:absolute;inset:0}.kv .ph video,.kv .ph img{width:100%;height:100%;object-fit:cover}',
      '.kv .ov{position:absolute;inset:0;background:rgba(4,3,8,.66)}',
      '.kv .sheen{position:absolute;inset:0;overflow:hidden;pointer-events:none;mix-blend-mode:screen}',
      '.kv .sheen i{position:absolute;top:-20%;bottom:-20%;left:0;width:44%;background:linear-gradient(100deg,transparent 0%,rgba(49,134,255,.06) 35%,rgba(78,160,255,.1) 50%,rgba(49,134,255,.05) 65%,transparent 100%);filter:blur(36px);transform:translateX(-160%) skewX(-14deg);animation:enSheen 7.5s ease-in-out infinite;will-change:transform}',
      '.kv .sheen i.s2{width:24%;opacity:.7;animation-delay:3.8s}',
      '@keyframes enSheen{0%{transform:translateX(-160%) skewX(-14deg)}34%{transform:translateX(440%) skewX(-14deg)}100%{transform:translateX(440%) skewX(-14deg)}}',
      '.kv .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;padding:0 24px;transform:translateY(-50px)}',
      '.kv h1{margin:0 0 34px;font-size:13vw;font-weight:700;line-height:1.02;letter-spacing:-.02em;text-shadow:0 1px 10px rgba(0,0,0,.15)}',
      '.kv h1 .l{display:block}',
      '.kv .klead{margin-bottom:56px;font-size:clamp(19px,2.4vw,40px);font-weight:500;color:rgba(255,255,255,.95);text-shadow:0 1px 6px rgba(0,0,0,.2)}',
      '.kv .ent{opacity:0;transform:translateY(16px);transition:opacity .8s cubic-bezier(.2,.6,.2,1),transform .8s cubic-bezier(.2,.6,.2,1)}',
      '.kv.ready .ent{opacity:1;transform:none}.kv.ready .kvmeta{opacity:.7}.kv.ready .klead{opacity:.8}',
      '.kv.ready .d2{transition-delay:.35s}.kv.ready .d4{transition-delay:.6s}',
      '.kv h1 .w{display:inline-block;opacity:0;transform:translate3d(0,14px,0);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}',
      '.kv.ready h1 .w{opacity:1;transform:translate3d(0,0,0)}',
      '.kv .gbtn{justify-content:center}',
      '.kv .kvmeta{position:absolute;left:0;right:0;bottom:32px;display:flex;justify-content:space-between;align-items:center;padding:0 56px;color:rgba(255,255,255,.85);font-size:18px;font-weight:500;letter-spacing:.01em}',
      '.kv .kvmeta .mid{position:absolute;left:50%;transform:translateX(-50%)}',
      '.kv .sub2{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;opacity:0;pointer-events:none;padding:0 24px}',
      '.kv .sub2 .tx{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center;height:100%}',
      '.kv .sub2 .eb{font-size:clamp(20px,1.2vw,26px);font-weight:600}',
      '.kv .sub2 p{color:#fff;font-size:clamp(36px,2.5vw,52px);font-weight:600;line-height:1.55;text-shadow:0 1px 10px rgba(0,0,0,.15)}',
      /* answer — 오버랩 카드 3 */
      '.answer{position:relative;z-index:2;margin-top:-100vh;padding:160px 0;background:#fff}',
      '.answer h2{text-align:center;color:var(--ink);margin-bottom:60px}',
      '.answer .cards{display:flex;gap:0}',
      '.answer .card{position:relative;flex:1;height:520px;overflow:hidden;cursor:pointer;background:var(--dark);opacity:0;transform:translateY(90px);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}',
      '.answer .cards.active .card{opacity:1;transform:none}',
      '.answer .cards.active .card:nth-child(2){transition-delay:.45s}',
      '.answer .cards.active .card:nth-child(3){transition-delay:.9s}',
      '.answer .card > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:filter .5s,transform .7s cubic-bezier(.2,.6,.2,1);animation:enIdle 14s ease-in-out infinite alternate;will-change:transform}',
      '.answer .card:nth-child(2) > img{animation-duration:18s;animation-delay:-6s}',
      '.answer .card:nth-child(3) > img{animation-duration:22s;animation-delay:-11s}',
      '.answer .card:hover > img{filter:brightness(1.15);animation-play-state:paused;transform:scale(1.08)}',
      '@keyframes enIdle{from{transform:scale(1.06) translate(1.2%,1%)}to{transform:scale(1.13) translate(-1.5%,-1.5%)}}',
      '.answer .go{position:absolute;right:26px;bottom:26px;width:52px;height:52px;display:grid;place-items:center;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(10px) saturate(1.4);-webkit-backdrop-filter:blur(10px) saturate(1.4);color:#fff;font-size:19px;font-weight:700;transition:background .25s;z-index:2;will-change:transform;pointer-events:none}',
      '.answer .card:hover .go{background:rgba(255,255,255,.26)}',
      '.answer .ctx{position:absolute;left:40px;right:96px;top:40px;z-index:1;text-align:left}',
      '.answer .ctx b{display:block;margin-bottom:14px;color:#fff;font-size:32px;font-weight:600;line-height:1.3}',
      '.answer .ctx p{color:rgba(255,255,255,.72);font-size:15px;line-height:1.6}',
      /* skill 탭 */
      '.skill{padding:160px 0;background:linear-gradient(180deg,#fff 0%,#F2F7FF 55%,#EDF4FF 100%)}',
      '.skill h2{text-align:center}',
      '.skill .tabs{display:flex;margin:4.5vw 0 30px;width:100%}',
      '.skill .tabs button{position:relative;flex:1;padding-bottom:14px;border:0;border-bottom:2px solid #DCE2EB;background:none;color:#C6CCD4;font-family:inherit;font-size:18px;font-weight:500;cursor:pointer;transition:color .2s,border-color .2s}',
      '.skill .tabs button.active{border-color:#DCE2EB;color:var(--ink);font-weight:600}',
      '.skill .tabs button .prog{position:absolute;left:0;bottom:-2px;height:2px;width:0;background:var(--bgray)}',
      '.skill .panes{position:relative;height:400px}',
      '.skill .pane{position:absolute;inset:0;display:flex;height:400px;opacity:0;transform:translateY(10px);transition:opacity .45s cubic-bezier(.2,.6,.2,1),transform .45s cubic-bezier(.2,.6,.2,1);pointer-events:none}',
      '.skill .pane.onv{opacity:1;transform:none;pointer-events:auto}',
      '.skill .tb{display:flex;flex-direction:column;justify-content:center;width:500px;flex:none;padding:0 48px 0 60px;background:#fff}',
      '.skill .tb .badge{width:max-content;margin-bottom:12px;padding:0 8px;background:var(--lime);color:var(--onp);font-size:14px;font-weight:600;height:25px;line-height:25px;letter-spacing:-.28px}',
      '.skill .tb strong{margin-bottom:26px;font-size:30px;font-weight:600;line-height:40px}',
      '.skill .tb p{color:var(--g);font-size:16px;line-height:26px;letter-spacing:-.32px}',
      '.skill .pane img{width:calc(100% - 500px);height:100%;object-fit:cover}',
      /* feature */
      '.feature{padding:180px 0 200px;background:linear-gradient(180deg,#EDF4FF 0%,#E8F1FF 50%,#F4F9FF 100%)}',
      '.feature .fgrid{display:flex;gap:110px;align-items:flex-start}',
      '.feature .fleft{width:430px;flex:none;position:sticky;top:130px}',
      '.feature .fleft h2{font-size:36px}',
      '.feature .fleft p.sub{margin:20px 0 0;color:var(--g2);font-size:18px;line-height:1.6}',
      '.feature .fright{flex:1;display:flex;flex-direction:column;gap:96px;min-width:0}',
      '.feature .fitem{border-top:1px solid #d9e4f3;padding-top:30px}',
      '.feature .fitem b{display:block;font-size:25px;font-weight:600;line-height:1.4}',
      '.feature .fitem > p{margin:12px 0 38px;color:var(--g2);font-size:17px;line-height:1.65}',
      '.feature .fcard{overflow:hidden;background:var(--bgsoft)}',
      '.feature .fcard img{width:100%;height:360px;object-fit:cover;display:block}',
      /* agenda */
      '.agenda{padding:160px 0;background:var(--dark)}',
      '.agenda h2{color:#fff;text-align:center}',
      '.agenda .asub{margin:16px 0 56px;text-align:center;color:rgba(255,255,255,.55);font-size:17px}',
      '.agenda .alist{max-width:1060px;margin:0 auto}',
      '.agenda .alist li{display:flex;align-items:center;gap:28px;padding:26px 18px;border-bottom:1px solid rgba(255,255,255,.12);cursor:pointer;transition:background .25s,padding .25s}',
      '.agenda .alist.rv li{opacity:0;transform:translateY(26px);transition:opacity .6s cubic-bezier(.2,.6,.2,1),transform .6s cubic-bezier(.2,.6,.2,1),background .25s,padding .25s}',
      '.agenda .alist.rv.on li{opacity:1;transform:none}',
      '.agenda .alist.rv.on li:nth-child(2){transition-delay:.08s}.agenda .alist.rv.on li:nth-child(3){transition-delay:.16s}',
      '.agenda .alist.rv.on li:nth-child(4){transition-delay:.24s}.agenda .alist.rv.on li:nth-child(5){transition-delay:.32s}',
      '.agenda .alist li:first-child{border-top:1px solid rgba(255,255,255,.12)}',
      '.agenda .alist li:hover{background:rgba(255,255,255,.06);padding-left:26px}',
      '.agenda .at{flex:none;width:128px;color:rgba(255,255,255,.75);font-size:17px;font-weight:600;white-space:nowrap}',
      '.agenda .am{flex:1}',
      '.agenda .am b{display:block;color:#fff;font-size:19px;font-weight:600;line-height:1.4;transition:color .25s}',
      '.agenda .am span{display:block;margin-top:4px;color:rgba(255,255,255,.5);font-size:14px}',
      '.agenda .chev{color:rgba(255,255,255,.45);font-size:18px;font-weight:700;transition:transform .25s,color .25s}',
      '.agenda .alist li:hover .am b{color:var(--sub)}.agenda .alist li:hover .chev{transform:translateX(4px);color:var(--sub)}',
      /* 드로어 */
      '.adim{position:fixed;inset:0;z-index:190;background:rgba(4,3,8,.55);opacity:0;pointer-events:none;transition:opacity .35s}.adim.on{opacity:1;pointer-events:auto}',
      '.adrawer{position:fixed;top:0;right:0;bottom:0;z-index:200;width:min(480px,92vw);background:#fff;padding:56px 44px 0;overflow-y:auto;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .45s cubic-bezier(.22,1,.36,1)}',
      '.adrawer.on{transform:none}',
      '.adrawer .dclose{position:absolute;top:18px;right:18px;width:40px;height:40px;border:0;background:none;color:var(--g3);font-size:26px;line-height:1;cursor:pointer;transition:color .2s}.adrawer .dclose:hover{color:var(--ink)}',
      '.adrawer .dtime{display:inline-block;align-self:flex-start;background:var(--lime);color:var(--onp);font-size:14px;font-weight:700;padding:5px 10px}',
      '.adrawer h4{margin:18px 0 6px;font-size:26px;font-weight:600;line-height:1.35;color:var(--ink)}',
      '.adrawer .dspk{display:block;color:var(--g3);font-size:14px;margin-bottom:22px}',
      '.adrawer .dmedia{flex:none;height:220px;margin-bottom:24px;background:var(--bgsoft);overflow:hidden}',
      '.adrawer .dmedia img,.adrawer .dmedia video{width:100%;height:100%;object-fit:cover;display:block}',
      '.adrawer .dtxt{color:var(--g);font-size:16px;line-height:1.65;margin-bottom:26px}',
      '.adrawer .dpoints li{position:relative;padding:12px 0 12px 22px;border-bottom:1px solid var(--line);color:var(--ink);font-size:15px;line-height:1.5}',
      '.adrawer .dpoints li:before{content:"";position:absolute;left:0;top:19px;width:8px;height:8px;background:var(--lime)}',
      '.adrawer .dnav{display:flex;align-items:center;justify-content:space-between;margin-top:auto;position:sticky;bottom:0;background:#fff;padding:20px 0 24px}',
      '.adrawer .dn{border:0;background:none;padding:10px 6px;color:var(--ink);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:color .2s}',
      '.adrawer .dn:hover:not(:disabled){color:var(--lime2)}.adrawer .dn:disabled{opacity:.3;cursor:default}',
      '.adrawer .didx{color:var(--g3);font-size:14px;font-variant-numeric:tabular-nums}',
      '.adrawer.swap .dtime,.adrawer.swap h4,.adrawer.swap .dspk,.adrawer.swap .dmedia,.adrawer.swap .dtxt,.adrawer.swap .dpoints{animation:enDfade .35s ease}',
      '@keyframes enDfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
      /* register */
      '.register{position:relative;padding:160px 0;background:radial-gradient(90% 45% at 50% 108%,rgba(120,190,255,.5) 0%,rgba(120,190,255,0) 62%),radial-gradient(150% 75% at 50% 115%,rgba(49,134,255,.65) 0%,rgba(49,134,255,0) 72%),linear-gradient(180deg,#040308 0%,#060D24 34%,#0C2470 66%,#1257ff 100%);overflow:hidden}',
      '.register .wrap{position:relative;z-index:1}',
      '.register h2{text-align:center;color:#fff}',
      '.register .time{display:flex;align-items:center;justify-content:center;gap:16px;margin:34px 0 56px;font-size:22px;font-weight:600;color:#fff}',
      '.register .bar{width:1px;height:18px;background:rgba(255,255,255,.25)}',
      '.register form{max-width:760px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:14px}',
      '.register .fld{position:relative}.register .fld.full{grid-column:1/-1}',
      '.register input{width:100%;height:60px;padding:24px 18px 8px;border-radius:0;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:16px;font-family:inherit}',
      '.register input:focus{outline:2px solid #fff;outline-offset:-1px}',
      '.register .fld label{position:absolute;left:19px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.75);font-size:16px;pointer-events:none;transition:top .18s ease,transform .18s ease,font-size .18s ease,color .18s ease;white-space:nowrap;max-width:calc(100% - 38px);overflow:hidden;text-overflow:ellipsis}',
      '.register input:focus + label,.register input:not(:placeholder-shown) + label{top:10px;transform:none;font-size:12px;color:#fff}',
      '.register button{grid-column:1/-1;height:58px;border:0;border-radius:0;background:linear-gradient(89.58deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.72) 45%,rgba(255,255,255,.95) 100%);background-size:220% 100%;background-position:0% 50%;color:#1257ff;font-size:18px;font-weight:700;font-family:inherit;cursor:pointer;transition:background-position .6s ease}',
      '.register button:hover{background-position:100% 50%}',
      '.register button .bt{background:var(--txtg);-webkit-background-clip:text;background-clip:text;color:transparent}',
      '.register .done{display:none;max-width:760px;margin:0 auto;text-align:center}',
      '.register .done h4{font-size:34px;font-weight:600;margin-bottom:18px;color:#fff}',
      '.register .done p{color:rgba(255,255,255,.7);font-size:17px;line-height:1.65}',
      '.register.submitted form{display:none}.register.submitted .done{display:block}',
      /* faq */
      '.faq{padding:160px 0;background:#fff}',
      '.faq .in{max-width:1060px;margin:0 auto;padding:0 28px}',
      '.faq h2{text-align:center;margin-bottom:26px}',
      '.faq .item{border-bottom:1px solid var(--line)}',
      '.faq .flist.rv .item{opacity:0;transform:translateY(24px);transition:opacity .6s cubic-bezier(.2,.6,.2,1),transform .6s cubic-bezier(.2,.6,.2,1)}',
      '.faq .flist.rv.on .item{opacity:1;transform:none}',
      '.faq .flist.rv.on .item:nth-child(2){transition-delay:.06s}.faq .flist.rv.on .item:nth-child(3){transition-delay:.12s}',
      '.faq .flist.rv.on .item:nth-child(4){transition-delay:.18s}.faq .flist.rv.on .item:nth-child(5){transition-delay:.24s}.faq .flist.rv.on .item:nth-child(6){transition-delay:.3s}',
      '.faq .item:first-child{border-top:1px solid var(--line)}',
      '.faq .q{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;min-height:88px;padding:0;border:0;background:none;color:var(--ink);font-family:inherit;font-size:20px;font-weight:600;line-height:28px;text-align:left;cursor:pointer;transition:color .25s}',
      '.faq .q:hover,.faq .item.open .q{color:var(--lime)}',
      '.faq .q .ar{flex:none;display:grid;place-items:center;color:var(--g2);transition:transform .3s,color .25s}',
      '.faq .q:hover .ar,.faq .item.open .ar{color:var(--lime)}.faq .item.open .q .ar{transform:rotate(180deg)}',
      '.faq .a{height:0;overflow:hidden;color:var(--g2);font-size:16px;line-height:26px;text-align:left;transition:height .3s ease,padding .3s ease}',
      /* free — 웨이브 CTA */
      '.free{position:relative;padding:200px 0 220px;background:var(--dark);text-align:center;overflow:hidden}',
      '.free canvas{position:absolute;inset:0;display:block;opacity:.9}',
      '.free .wrap{position:relative;z-index:1}',
      '.free h2{color:#fff}',
      '.free p{margin:22px 0 56px;color:rgba(255,255,255,.72);font-size:22px;line-height:1.55}',
      '.free .gbtn{justify-content:center}',
      /* footer — 내용 1920 컨테인 */
      '.enfoot{background:var(--dark);color:#fff;padding:34px 0}',
      '.enfoot .row{display:flex;align-items:center;justify-content:space-between;gap:20px}',
      '.enfoot .row b{font-size:19px;font-weight:700}',
      '.enfoot .row span{color:rgba(255,255,255,.45);font-size:13px}',
      '.enfoot .wrap{max-width:none;margin:0;padding:0 56px}',
      /* dock */
      '.dock{position:fixed;left:50%;bottom:28px;z-index:60;border-radius:0;display:flex;align-items:center;gap:22px;width:min(720px,calc(100vw - 40px));padding:20px 14px 20px 26px;background:rgba(255,255,255,.6);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border:1px solid rgba(255,255,255,.55);box-shadow:0 10px 30px rgba(4,3,8,.12),0 1px 4px rgba(4,3,8,.05);opacity:0;transform:translate(-50%,140%);pointer-events:none;transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease}',
      '.dock.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}',
      '.dock .tx{min-width:0}.dock .tx b{display:block;font-size:17px;font-weight:700}',
      '.dock .tx i{display:block;margin-top:7px;font-style:normal;color:var(--g2);font-size:13px}',
      '.dock .go{margin-left:auto;flex:none;border-radius:0;background:var(--btng);background-size:220% 100%;background-position:0% 50%;color:#fff;font-size:15px;font-weight:700;padding:13px 24px;transition:background-position .6s ease}.dock .go:hover{background-position:100% 50%}',
      /* 모바일 */
      '@media (max-width:900px){',
      '.gnb nav{display:none}.snav{display:none}',
      'h2.tt{font-size:36px}',
      '.kv h1{font-size:18vw}.kv .klead{font-size:17px}',
      '.kv .gbtn{flex-direction:column;align-items:center;gap:12px}',
      '.kv .kvmeta{font-size:11px;padding:0 20px}.kv .sub2 p{font-size:20px}',
      '.answer .cards{flex-direction:column;gap:28px}.answer .card{flex:none;height:110vw}',
      '.answer .ctx{left:24px;right:80px;bottom:26px;top:auto}.answer .ctx b{font-size:24px}',
      '.skill .tabs{flex-wrap:wrap;gap:10px}.skill .tabs button{flex:none;width:calc(50% - 5px)}',
      '.skill .panes{height:auto}',
      '.skill .pane{position:static;display:none;height:auto;flex-direction:column;opacity:1;transform:none;pointer-events:auto;transition:none}',
      '.skill .pane.onv{display:flex}',
      '.skill .tb{width:100%;padding:32px 24px}.skill .pane img{width:100%;height:56vw}',
      '.feature .fgrid{flex-direction:column;gap:56px}.feature .fleft{width:100%;position:static}',
      '.feature .fcard img{height:54vw}',
      '.free .gbtn{flex-direction:column;align-items:center}',
      '.agenda .alist li{gap:14px;padding:20px 6px}.agenda .at{width:92px;font-size:13px}.agenda .am b{font-size:16px}',
      '.adrawer{padding:48px 26px}',
      '.register form{grid-template-columns:1fr}',
      '.enfoot .wrap{padding:0 20px}.gnb .in{padding:0 20px}',
      '.dock{display:none}',
      '}',
      '@media (max-width:600px){',
      'h2.tt{font-size:30px}.kv .sub2 p{font-size:17px}',
      '.feature .fleft h2{font-size:28px}.skill .tb strong{font-size:24px;line-height:1.35}',
      '}',
      /* 커스텀 커서 — 글래스 사각, 파인 포인터 전용(부트가 body.curon 부여 시에만 발동) */
      '@media (hover:hover) and (pointer:fine){',
      'body.curon,body.curon a,body.curon button,body.curon input,body.curon select,body.curon textarea,body.curon label,body.curon summary{cursor:none}',
      '#cur{position:fixed;left:0;top:0;width:16px;height:16px;margin:-8px 0 0 -8px;z-index:2147483000;pointer-events:none;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.42);box-shadow:0 0 0 1px rgba(24,32,44,.25),0 6px 18px rgba(4,3,8,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);will-change:transform}',
      '}',
      '@media (prefers-reduced-motion:reduce){',
      '.kv .sheen i{animation:none;opacity:0}',
      '.answer .card > img{animation:none;transform:none}',
      '.rv,.kv .ent,.kv h1 .w,.answer .card,h2.wt .w,h2.wt .gt,.agenda .alist.rv li,.faq .flist.rv .item{opacity:1 !important;transform:none !important;transition:none !important;filter:none !important}',
      '}',
      /* nomo(정적 출고) — 핀·오버랩 해제, 전부 표시 */
      'html.nomo .kv{height:100vh}html.nomo .kv .stick{position:static}',
      'html.nomo .kv .sub2,html.nomo .dock,html.nomo .snav{display:none}',
      'html.nomo .answer{margin-top:0}',
      'html.nomo .rv,html.nomo .kv .ent,html.nomo .kv h1,html.nomo .answer .card,html.nomo .agenda .alist li,html.nomo .faq .flist .item{opacity:1 !important;transform:none !important;transition:none !important}',
      'html.nomo .kv .sheen,html.nomo .free canvas{display:none}',
      'html.nomo .skill .tabs button .prog{display:none}',
    ].join('\n');
  }

  /* ── 브라우저 부트 — toString 직렬화로 문서에 주입 (window.__ENSOL 데이터 참조) ── */
  function ensolBoot() {
    'use strict';
    var nomo = document.documentElement.classList.contains('nomo');
    if (nomo) return;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vh = innerHeight;
    var kv = document.querySelector('.kv');
    var answerSec = document.querySelector('.answer');
    var gnb = document.getElementById('gnb');

    /* overlap fit: cover exactly the answer height.
       fractional rect.height + 1px under on the KV tail —
       integer offsetHeight rounding leaked a sub-pixel dark hairline */
    function fitOverlap() {
      if (!kv || !answerSec) return;
      var ah = answerSec.getBoundingClientRect().height;
      kv.style.height = 'calc(220vh + ' + (Math.floor(ah) - 1) + 'px)';
      answerSec.style.marginTop = -ah + 'px';
    }
    fitOverlap();
    addEventListener('load', fitOverlap);
    addEventListener('resize', function () { vh = innerHeight; fitOverlap(); });

    /* custom cursor: glass square, grows over interactive elements (lerp follow) */
    if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var cur = document.createElement('div');
      cur.id = 'cur';
      document.body.appendChild(cur);
      document.body.classList.add('curon');
      var ccx = -100, ccy = -100, ctx = -100, cty = -100, ccs = 1, cts = 1;
      addEventListener('pointermove', function (e) {
        ctx = e.clientX; cty = e.clientY;
        var t = e.target && e.target.closest ? e.target.closest('a,button,input,select,textarea,label,summary') : null;
        cts = t ? 1.7 : 1;
      }, { passive: true });
      (function curLoop() {
        ccx += (ctx - ccx) * 0.22; ccy += (cty - ccy) * 0.22; ccs += (cts - ccs) * 0.18;
        cur.style.transform = 'translate3d(' + ccx + 'px,' + ccy + 'px,0) scale(' + ccs + ')';
        requestAnimationFrame(curLoop);
      })();
    }

    /* side dots */
    var SNAV_IDS = [];
    document.querySelectorAll('[data-snav]').forEach(function (s) { SNAV_IDS.push(s.id); });
    var snav = document.getElementById('snav');
    if (snav) SNAV_IDS.forEach(function (id) {
      var a = document.createElement('a');
      a.href = '#' + id; a.setAttribute('aria-label', id);
      snav.appendChild(a);
    });
    function snavTick() {
      if (!snav) return;
      var cur = 0, mid = scrollY + vh * 0.5;
      for (var i = 0; i < SNAV_IDS.length; i++) {
        var sec = document.getElementById(SNAV_IDS[i]);
        if (sec && sec.offsetTop <= mid) cur = i;
      }
      for (var j = 0; j < snav.children.length; j++) snav.children[j].classList.toggle('on', j === cur);
      var el = document.getElementById(SNAV_IDS[cur]);
      snav.classList.toggle('ondark', !!(el && el.getAttribute('data-dark')));
      snav.classList.toggle('vis', cur > 0);
    }

    /* KV: split title chars + ready */
    if (kv) {
      kv.querySelectorAll('h1 .l').forEach(function (line) {
        var chars = line.textContent.split('');
        line.textContent = '';
        var wi = 0;
        chars.forEach(function (ch) {
          if (ch === ' ') { line.appendChild(document.createTextNode(' ')); return; }
          var sp = document.createElement('span');
          sp.className = 'w'; sp.textContent = ch;
          sp.style.transitionDelay = (0.12 + wi * 0.05).toFixed(2) + 's';
          line.appendChild(sp); wi++;
        });
      });
      requestAnimationFrame(function () { requestAnimationFrame(function () { kv.classList.add('ready'); }); });
    }
    var kvIn = document.getElementById('kvIn'), kvSub = document.getElementById('kvSub'),
      kvOv = document.getElementById('kvOv'), kvVid = kv && kv.querySelector('.ph video, .ph img'),
      kvMeta = kv && kv.querySelector('.kvmeta');
    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function kvScrub() {
      if (!kv || !kvIn) return;
      var p = clamp01(scrollY / (kv.offsetHeight - vh));
      var t = clamp01((p - 0.22) / 0.16);
      kvIn.style.opacity = String(1 - t);
      kvIn.style.transform = 'translateY(-20px) scale(' + (1 - 0.22 * t).toFixed(4) + ')';
      kvIn.style.pointerEvents = t > 0.6 ? 'none' : 'auto';
      var q = clamp01((p - 0.28) / 0.24), e = 1 - Math.pow(1 - q, 3);
      if (kvOv) kvOv.style.opacity = String(0.66 + 0.26 * e);
      if (kvVid) kvVid.style.filter = 'blur(' + (12 * e).toFixed(1) + 'px)';
      var s = clamp01((p - 0.4) / 0.14), se = 1 - Math.pow(1 - s, 3);
      if (kvSub) { kvSub.style.opacity = String(se); kvSub.style.transform = 'scale(' + (0.75 + 0.25 * se).toFixed(4) + ')'; }
      if (kvMeta) { kvMeta.style.transition = 'none'; kvMeta.style.opacity = String(.7 * (1 - se)); }
    }

    /* dock */
    var dock = document.getElementById('dock'), reg = document.getElementById('register');
    function dockTick() {
      if (!dock || !kv) return;
      var past = scrollY > kv.offsetHeight - vh * 0.5;
      var nearReg = reg ? reg.getBoundingClientRect().top < vh * 0.85 : false;
      dock.classList.toggle('on', past && !nearReg);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (gnb) gnb.classList.toggle('solid', scrollY > vh * 0.9);
        snavTick();
        if (!reduce) kvScrub();
        dockTick();
      });
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* section titles: word stagger */
    document.querySelectorAll('h2.tt.rv').forEach(function (h2) {
      h2.classList.remove('rv'); h2.classList.add('wt');
      var wi = 0;
      (function splitIn(host) {
        Array.prototype.slice.call(host.childNodes).forEach(function (nd) {
          if (nd.nodeType === 1 && nd.classList && nd.classList.contains('gt')) {
            nd.style.transitionDelay = (wi * 0.07) + 's';
            wi += (nd.textContent.trim().split(/\s+/).length || 1);
            return;
          }
          if (nd.nodeType === 1 && nd.tagName === 'SPAN') { splitIn(nd); return; }
          if (nd.nodeType !== 3) return;
          var frag = document.createDocumentFragment();
          var parts = nd.textContent.split(/\s+/), added = false;
          parts.forEach(function (word) {
            if (!word) return;
            if (added) frag.appendChild(document.createTextNode(' '));
            var sp = document.createElement('span');
            sp.className = 'w'; sp.textContent = word;
            sp.style.transitionDelay = (wi * 0.07) + 's';
            wi++; frag.appendChild(sp); added = true;
          });
          host.replaceChild(frag, nd);
        });
      })(h2);
    });

    /* reveal IO */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add(en.target.classList.contains('rv') ? 'on' : 'active');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.rv, h2.wt').forEach(function (el) { io.observe(el); });
    var acards = document.querySelector('.answer .cards');
    if (acards) io.observe(acards);

    /* answer cards: badge follows cursor */
    if (!reduce) document.querySelectorAll('.answer .card').forEach(function (card) {
      var go = card.querySelector('.go');
      if (!go) return;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = false;
      function step() {
        cx += (tx - cx) * .05; cy += (ty - cy) * .05;
        go.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
        if (Math.abs(tx - cx) > .4 || Math.abs(ty - cy) > .4) requestAnimationFrame(step);
        else raf = false;
      }
      function kick() { if (!raf) { raf = true; requestAnimationFrame(step); } }
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        tx = (e.clientX - r.left) + 14 - (r.width - 26 - 52);
        ty = (e.clientY - r.top) + 14 - (r.height - 26 - 52);
        kick();
      });
      card.addEventListener('mouseleave', function () { tx = 0; ty = 0; kick(); });
    });

    /* skill tabs autoplay */
    var tabsHost = document.querySelector('.skill .tabs');
    if (tabsHost) {
      var tabs = tabsHost.children, panes = document.querySelector('.skill .panes').children;
      var TAB_MS = 6000, curTab = 0, tabStart = performance.now(), skillVisible = false, progs = [];
      Array.prototype.forEach.call(tabs, function (btn, i) {
        var pr = btn.querySelector('.prog'); progs.push(pr);
      });
      window.__ensolSetTab = function (i) {
        curTab = i; tabStart = performance.now();
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.toggle('active', j === i);
          panes[j].classList.toggle('onv', j === i);
          if (progs[j]) progs[j].style.width = '0';
        }
      };
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { skillVisible = en.isIntersecting; if (skillVisible) tabStart = performance.now(); });
      }, { threshold: 0.35 }).observe(document.querySelector('.skill'));
      if (!reduce) {
        (function tabLoop() {
          if (skillVisible) {
            var r = (performance.now() - tabStart) / TAB_MS;
            if (r >= 1) window.__ensolSetTab((curTab + 1) % tabs.length);
            else if (progs[curTab]) progs[curTab].style.width = (r * 100).toFixed(2) + '%';
          }
          requestAnimationFrame(tabLoop);
        })();
      } else if (progs[0]) progs[0].style.width = '100%';
    }

    /* data wave */
    var WAVE_COLS = ['#C4D8F0', '#4ea0ff', '#3186ff', '#346bf0'];
    (function initWave() {
      var cv = document.getElementById('enWave'), sec = document.getElementById('free');
      if (!cv || !sec) return;
      var ctx2 = cv.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0, running = false, horizonRatio = .16;
      function wResize() {
        W = sec.clientWidth; H = sec.clientHeight;
        cv.width = W * dpr; cv.height = H * dpr;
        cv.style.width = W + 'px'; cv.style.height = H + 'px';
        ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      wResize(); addEventListener('resize', wResize);
      var mx = -1e4, my = -1e4, smx = -1e4, smy = -1e4;
      sec.addEventListener('mousemove', function (e) {
        var r = cv.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      });
      sec.addEventListener('mouseleave', function () { mx = -1e4; my = -1e4; });
      var ROWS = 44, COLS = 130, acc = [];
      for (var i = 0; i < ROWS * COLS; i++) { var rr = Math.random(); acc.push(rr < 0.013 ? 1 : rr < 0.033 ? 2 : 0); }
      function fld(u, d, t) {
        var x = u * 6.283;
        return Math.sin(x * 1.7 + t * .55 + d * 5.2) * .45 + Math.sin(x * 3.9 - t * .38 + d * 9.5) * .25 +
          Math.sin(x * 8.3 + t * .22 + Math.sin(d * 7 + t * .3) * 2) * .14 + Math.sin((x + d * 12) * 2.6 - t * .3) * .16;
      }
      function rowY(d) { return H * horizonRatio + Math.pow(d, 1.35) * (H - H * horizonRatio - 30); }
      function rowAmp(d) { return 18 + 150 * Math.pow(d, 1.6); }
      function colX(u, d) { return W / 2 + (u - .5) * W * (0.72 + (.25 + Math.pow(d, 1.55) * .75) * 0.6); }
      var t0 = performance.now();
      function wDraw(now) {
        if (!running) return;
        var t = (now - t0) / 1000;
        smx += (mx - smx) * .08; smy += (my - smy) * .08;
        ctx2.clearRect(0, 0, W, H);
        for (var ri = 0; ri < ROWS; ri++) {
          var d = ri / (ROWS - 1);
          var y0 = rowY(d), amp = rowAmp(d);
          var alpha = .15 + d * .5, size = .8 + d * 1.7;
          for (var ci = 0; ci < COLS; ci++) {
            var u = ci / (COLS - 1), px = colX(u, d);
            if (px < -8 || px > W + 8) continue;
            var h = fld(u, d, t) * amp;
            var dx = px - smx, dy = y0 - smy, dist2 = dx * dx + dy * dy;
            if (dist2 < 170000) h -= Math.exp(-dist2 / 36000) * 90 * (0.4 + d);
            var a = acc[ri * COLS + ci];
            ctx2.fillStyle = 'rgba(255,255,255,' + (a ? Math.min(1, alpha + .3) : alpha) + ')';
            ctx2.fillRect(px, y0 - h, size, size);
          }
        }
        var gx = Math.cos(t * .18) * W * .4, gy = Math.sin(t * .14) * H * .3;
        var grad = ctx2.createLinearGradient(W * .5 - gx, H * .5 - gy, W * .5 + gx + W * .5, H * .5 + gy);
        var sh = (t * .06) % 1;
        grad.addColorStop(0, WAVE_COLS[0]);
        grad.addColorStop(Math.max(0, Math.min(1, .25 + sh * .5)), WAVE_COLS[1]);
        grad.addColorStop(Math.max(0, Math.min(1, .55 + sh * .4)), WAVE_COLS[2]);
        grad.addColorStop(1, WAVE_COLS[3]);
        ctx2.globalCompositeOperation = 'source-in';
        ctx2.fillStyle = grad;
        ctx2.fillRect(0, 0, W, H);
        ctx2.globalCompositeOperation = 'source-over';
        requestAnimationFrame(wDraw);
      }
      if (reduce) {
        running = true;
        requestAnimationFrame(function (n) { wDraw(n); running = false; });
      } else {
        new IntersectionObserver(function (es) {
          es.forEach(function (en) {
            var was = running;
            running = en.isIntersecting;
            if (running && !was) requestAnimationFrame(wDraw);
          });
        }, { threshold: .05 }).observe(sec);
      }
    })();
  }

  window.renderEnsolPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    var motion = opts.motion !== false;
    var TT = TTALL[LANG];
    var imgs = shared.images || {};

    var feats = (Array.isArray(d.features) && d.features.length ? d.features : BD.features).slice(0, 3);
    var skills = (Array.isArray(shared.skills) && shared.skills.length ? shared.skills : BD.skills).slice(0, 5);
    var fitems = (Array.isArray(shared.fitems) && shared.fitems.length ? shared.fitems : BD.fitems).slice(0, 3);
    var agenda = (Array.isArray(d.agenda) && d.agenda.length ? d.agenda : BD.agenda).slice(0, 5);
    var faq = (Array.isArray(d.faq) && d.faq.length ? d.faq : BD.faq).slice(0, 6);

    /* ── GNB ── */
    var anchors = ['#answer', '#skill', '#agenda', '#register'];
    var menu = (d.navLinks || []).slice(0, 4).filter(function (l) { return String(l).trim(); }).map(function (l, i) {
      return '<a href="' + anchors[i % anchors.length] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>';
    }).join('');
    var gnbHtml = '<header class="gnb" id="gnb"><div class="in">' +
      '<a class="logo" href="#top"' + de('navTitle') + '>' + esc(d.navTitle) + '</a>' +
      '<nav>' + menu + '</nav>' +
      '<a class="cta" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></header>';

    /* ── KV ── */
    var heroSrc = imgs.hero || '';
    var isVid = heroSrc ? /\.(mp4|webm)(\?|$)/i.test(heroSrc) : true;
    var heroMedia = isVid
      ? '<video src="' + esc(heroSrc || att(HERO_MP4)) + '" autoplay muted loop playsinline data-img="hero"></video>'
      : '<img src="' + esc(heroSrc) + '" alt="" data-img="hero" onerror="this.remove()">';
    var kvTitleLines = String(d.productName || '').split('\n').map(function (ln) {
      return '<span class="l">' + esc(ln) + '</span>';
    }).join('');
    var subLines = String(d.bannerText || '').split('\n').filter(function (s) { return s.trim(); }).map(function (ln) {
      return '<p>' + gtml(ln) + '</p>';
    }).join('');
    var kv = '<section class="kv" id="top" data-snav data-dark="1">' +
      '<div class="stick">' +
      '<div class="ph">' + heroMedia + '</div>' +
      '<div class="ov" id="kvOv"></div>' +
      '<div class="sheen" aria-hidden="true"><i></i><i class="s2"></i></div>' +
      '<div class="in" id="kvIn">' +
      '<h1' + de('productName') + '>' + kvTitleLines + '</h1>' +
      '<p class="klead ent d2"' + de('tagline') + '>' + esc(d.tagline) + '</p>' +
      '<div class="gbtn ent d4"><a class="white" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>' +
      '</div>' +
      '<div class="kvmeta ent d4"><span' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<span class="mid"' + de('eventDate') + '>' + esc(d.eventDate) + '</span>' +
      '<span' + de('kvNote') + '>' + esc(d.kvNote) + '</span></div>' +
      '<div class="sub2" id="kvSub"><div class="tx">' +
      '<span class="eb"' + de('whyEyebrow') + '>' + esc(d.whyEyebrow) + '</span>' +
      subLines + '</div></div>' +
      '</div></section>';

    /* ── movable 섹션들 ── */
    var SEC = {};

    SEC.answer = '<section class="answer" id="answer" data-snav data-section="answer"><div class="wrap">' +
      '<h2 class="tt rv"' + de('answerTitle') + '>' + titleHtml(d.answerTitle) + '</h2>' +
      '<ul class="cards">' + feats.map(function (f, i) {
        var src = imgs['answer' + (i + 1)] || att(IMG_ANSWER[i % 3]);
        return '<li class="card"><img src="' + esc(src) + '" alt="" data-img="answer' + (i + 1) + '" ' + (imgs['answer' + (i + 1)] ? '' : imFall(IMG_ANSWER[i % 3])) + '>' +
          '<div class="ctx"><b' + de('features.' + i + '.title') + '>' + ml(f.title || '') + '</b>' +
          '<p' + de('features.' + i + '.desc') + '>' + ml(f.desc || '') + '</p></div>' +
          '<span class="go">→</span></li>';
      }).join('') + '</ul></div></section>';

    SEC.skill = '<section class="skill" id="skill" data-snav data-section="skill"><div class="wrap">' +
      '<h2 class="tt rv"' + de('skillTitle') + '>' + titleHtml(d.skillTitle) + '</h2>' +
      '<div class="tabs">' + skills.map(function (s, i) {
        return '<button class="' + (i === 0 ? 'active' : '') + '" type="button" onclick="if(window.__ensolSetTab)__ensolSetTab(' + i + ');else{var ps=this.closest(\'.skill\').querySelectorAll(\'.pane\'),bs=this.parentNode.children;for(var j=0;j<bs.length;j++){bs[j].classList.toggle(\'active\',j===' + i + ');ps[j].classList.toggle(\'onv\',j===' + i + ');}}"' + de('skills.' + i + '.tab') + '>' + esc(s.tab || '') + '<i class="prog"></i></button>';
      }).join('') + '</div>' +
      '<div class="panes">' + skills.map(function (s, i) {
        var src = imgs['skill' + (i + 1)] || att(IMG_SKILL[i % 5]);
        return '<div class="pane' + (i === 0 ? ' onv' : '') + '"><div class="tb">' +
          (s.badge ? '<span class="badge"' + de('skills.' + i + '.badge') + '>' + esc(s.badge) + '</span>' : '') +
          '<strong' + de('skills.' + i + '.title') + '>' + ml(s.title || '') + '</strong>' +
          '<p' + de('skills.' + i + '.desc') + '>' + ml(s.desc || '') + '</p></div>' +
          '<img src="' + esc(src) + '" alt="" data-img="skill' + (i + 1) + '" ' + (imgs['skill' + (i + 1)] ? '' : imFall(IMG_SKILL[i % 5])) + '></div>';
      }).join('') + '</div></div></section>';

    SEC.feature = '<section class="feature" id="feature" data-snav data-section="feature"><div class="wrap"><div class="fgrid">' +
      '<div class="fleft"><h2 class="tt rv"' + de('featureTitle') + '>' + titleHtml(d.featureTitle) + '</h2>' +
      '<p class="sub rv"' + de('featureSub') + '>' + ml(d.featureSub) + '</p></div>' +
      '<div class="fright">' + fitems.map(function (f, i) {
        var src = imgs['feat' + (i + 1)] || att(IMG_FEAT[i % 3]);
        return '<div class="fitem rv"><b' + de('fitems.' + i + '.title') + '>' + esc(f.title || '') + '</b>' +
          '<p' + de('fitems.' + i + '.desc') + '>' + ml(f.desc || '') + '</p>' +
          '<div class="fcard"><img src="' + esc(src) + '" alt="" data-img="feat' + (i + 1) + '" ' + (imgs['feat' + (i + 1)] ? '' : imFall(IMG_FEAT[i % 3])) + '></div></div>';
      }).join('') + '</div></div></div></section>';

    SEC.agenda = '<section class="agenda" id="agenda" data-snav data-dark="1" data-section="agenda"><div class="wrap">' +
      '<h2 class="tt rv"' + de('agendaTitle') + '>' + titleHtml(d.agendaTitle) + '</h2>' +
      '<p class="asub rv"' + de('eventDate') + '>' + esc(d.eventDate) + '</p>' +
      '<ul class="alist rv">' + agenda.map(function (a, i) {
        var media = a.vid ? 'v:' + a.vid : (a.img ? 'i:' + a.img : 'i:' + att(IMG_SKILL[i % 5]));
        return '<li data-ag="' + i + '" data-media="' + esc(media) + '" data-txt="' + esc(a.txt || '') + '" data-pts="' + esc((a.pts || []).join('|')) + '">' +
          '<span class="at"' + de('agenda.' + i + '.time') + '>' + esc(a.time || '') + '</span>' +
          '<div class="am"><b' + de('agenda.' + i + '.title') + '>' + esc(a.title || '') + '</b>' +
          '<span' + de('agenda.' + i + '.by') + '>' + esc(a.by || '') + '</span></div>' +
          '<span class="chev">→</span></li>';
      }).join('') + '</ul></div></section>';

    SEC.register = '<section class="register" id="register" data-snav data-dark="1" data-section="register"><div class="wrap">' +
      '<h2 class="tt rv"' + de('regTitle') + '>' + titleHtml(d.regTitle) + '</h2>' +
      '<div class="time rv"><span' + de('eventDate') + '>' + esc(d.eventDate) + '</span></div>' +
      '<form class="rv" autocomplete="off">' +
      '<div class="fld"><input type="text" id="en-name" placeholder=" " required><label for="en-name">' + esc(TT.fName) + '</label></div>' +
      '<div class="fld"><input type="email" id="en-email" placeholder=" " required><label for="en-email">' + esc(TT.fEmail) + '</label></div>' +
      '<div class="fld"><input type="text" id="en-company" placeholder=" " required><label for="en-company">' + esc(TT.fCompany) + '</label></div>' +
      '<div class="fld"><input type="text" id="en-job" placeholder=" "><label for="en-job">' + esc(TT.fJob) + '</label></div>' +
      '<div class="fld"><input type="tel" id="en-phone" placeholder=" "><label for="en-phone">' + esc(TT.fPhone) + '</label></div>' +
      '<div class="fld"><input type="text" id="en-country" placeholder=" " required><label for="en-country">' + esc(TT.fCountry) + '</label></div>' +
      '<div class="fld full"><input type="text" id="en-industry" placeholder=" "><label for="en-industry">' + esc(TT.fIndustry) + '</label></div>' +
      '<button type="submit"><span class="bt"' + de('formCta') + '>' + esc(d.formCta) + '</span></button>' +
      '</form>' +
      '<div class="done"><h4' + de('doneTitle') + '>' + esc(d.doneTitle) + '</h4><p' + de('doneText') + '>' + ml(d.doneText) + '</p></div>' +
      '</div></section>';

    SEC.faq = '<section class="faq" id="faq" data-snav data-section="faq"><div class="in">' +
      '<h2 class="tt rv">' + esc(TT.faqT) + '</h2>' +
      '<div class="flist rv">' + faq.map(function (f, i) {
        return '<div class="item"><button class="q" type="button"><span' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</span>' +
          '<span class="ar"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>' +
          '<div class="a"' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</div></div>';
      }).join('') + '</div></div></section>';

    SEC.free = '<section class="free" id="free" data-snav data-dark="1" data-section="free">' +
      (motion ? '<canvas id="enWave" aria-hidden="true"></canvas>' : '') +
      '<div class="wrap">' +
      '<h2 class="tt rv"' + de('ctaTitle') + '>' + titleHtml(d.ctaTitle) + '</h2>' +
      '<p class="rv"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
      '<div class="gbtn rv"><a class="lime" href="#register"' + de('secondaryCta') + '>' + esc(d.secondaryCta) + ' <span class="arr">→</span></a></div>' +
      '</div></section>';

    var ORDER = ['answer', 'skill', 'feature', 'agenda', 'register', 'faq', 'free'];
    var savedOrd = (Array.isArray(shared.sectionOrder) ? shared.sectionOrder : []).filter(function (k) { return SEC[k]; });
    var ordAll = savedOrd.concat(ORDER.filter(function (k) { return savedOrd.indexOf(k) < 0 && SEC[k]; }));
    var hidden = shared.hiddenSections || [];
    var bodySecs = ordAll.filter(function (k) { return hidden.indexOf(k) < 0; }).map(function (k) { return SEC[k]; }).join('');
    var answerHidden = hidden.indexOf('answer') >= 0;

    /* ── 드로어 + 푸터 + 독 ── */
    var drawer = '<div class="adim" id="adim"></div>' +
      '<aside class="adrawer" id="adrawer" aria-hidden="true">' +
      '<button class="dclose" type="button" aria-label="' + esc(TT.close) + '">×</button>' +
      '<span class="dtime"></span><h4></h4><span class="dspk"></span>' +
      '<div class="dmedia"></div><p class="dtxt"></p><ul class="dpoints"></ul>' +
      '<div class="dnav"><button type="button" class="dn dprev">' + esc(TT.prev) + '</button>' +
      '<span class="didx"></span>' +
      '<button type="button" class="dn dnext">' + esc(TT.next) + '</button></div></aside>';

    var footer = '<footer class="enfoot"><div class="wrap"><div class="row">' +
      '<b' + de('footerBrand') + '>' + esc(d.footerBrand) + '</b>' +
      '<span' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span>' +
      '</div></div></footer>';

    var dock = (!motion || hidden.indexOf('dock') >= 0) ? '' :
      '<div class="dock" id="dock" data-section="dock"><div class="tx">' +
      '<b' + de('dockText') + '>' + esc(d.dockText) + '</b>' +
      '<i' + de('eventDate') + '>' + esc(d.eventDate) + '</i></div>' +
      '<a class="go" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + ' →</a></div>';

    /* ── 스크립트: 기능(항상) + 모션(부트) ── */
    var fnjs = '<script>(function(){' +
      /* FAQ 아코디언 */
      'document.querySelectorAll(".faq .item").forEach(function(item){var q=item.querySelector(".q"),a=item.querySelector(".a");q.addEventListener("click",function(){var open=item.classList.toggle("open");a.style.height=open?(a.scrollHeight+30)+"px":"0";});});' +
      /* 폼 → 감사 메시지 */
      'var rf=document.querySelector(".register form");if(rf)rf.addEventListener("submit",function(e){e.preventDefault();document.getElementById("register").classList.add("submitted");});' +
      /* 어젠다 드로어 — 데이터는 li data-속성에서 */
      'var lis=document.querySelectorAll(".agenda .alist li"),dr=document.getElementById("adrawer"),dim=document.getElementById("adim"),cur=0;' +
      'function openD(i){var li=lis[i];if(!li)return;cur=i;' +
      'dr.querySelector(".dtime").textContent=li.querySelector(".at").textContent;' +
      'dr.querySelector("h4").textContent=li.querySelector(".am b").textContent;' +
      'dr.querySelector(".dspk").textContent=li.querySelector(".am span").textContent;' +
      'var m=li.getAttribute("data-media")||"",dm=dr.querySelector(".dmedia");' +
      'dm.innerHTML=m.indexOf("v:")===0?\'<video src="\'+m.slice(2)+\'" muted autoplay loop playsinline></video>\':(m?\'<img src="\'+m.slice(2)+\'" alt="">\':"");' +
      'dr.querySelector(".dtxt").textContent=li.getAttribute("data-txt")||"";' +
      'dr.querySelector(".dpoints").innerHTML=(li.getAttribute("data-pts")||"").split("|").filter(Boolean).map(function(p){return "<li>"+p+"</li>";}).join("");' +
      'dr.querySelector(".didx").textContent=(i+1)+" / "+lis.length;' +
      'dr.querySelector(".dprev").disabled=i===0;dr.querySelector(".dnext").disabled=i===lis.length-1;' +
      'if(dr.classList.contains("on")){dr.classList.remove("swap");void dr.offsetWidth;dr.classList.add("swap");}' +
      'dr.classList.add("on");dim.classList.add("on");dr.setAttribute("aria-hidden","false");}' +
      'function closeD(){dr.classList.remove("on");dim.classList.remove("on");dr.setAttribute("aria-hidden","true");}' +
      'if(dr&&lis.length){lis.forEach(function(li,i){li.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;openD(i);});});' +
      'dr.querySelector(".dprev").addEventListener("click",function(){if(cur>0)openD(cur-1);});' +
      'dr.querySelector(".dnext").addEventListener("click",function(){if(cur<lis.length-1)openD(cur+1);});' +
      'dim.addEventListener("click",closeD);dr.querySelector(".dclose").addEventListener("click",closeD);' +
      'addEventListener("keydown",function(e){if(e.key==="Escape")closeD();});}' +
      '})();<\/script>';

    var mot = motion ? '<script>(' + ensolBoot.toString() + ')();<\/script>' : '';

    return '<!doctype html><html lang="' + LANG + '"' + (motion ? '' : ' class="nomo"') + '><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      (LANG === 'ja' || LANG === 'zh' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + (LANG === 'ja' ? 'Noto+Sans+JP' : 'Noto+Sans+SC') + ':wght@400;500;600;700;800&display=swap">' : '') +
      '<style>' + css(LANG) + (answerHidden ? '\nhtml:not(.nomo) .kv{height:100vh}' : '') + '</style></head>' +
      '<body data-pack="ensol">' +
      '<nav class="snav" id="snav" aria-label="Sections"></nav>' +
      gnbHtml + kv + bodySecs + drawer + footer + dock + fnjs + mot +
      '</body></html>';
  };

  window.ENSOL_SECTION_SPEC = {
    template: [
      { type: 'answer', tier: 'core' }, { type: 'skill', tier: 'core' }, { type: 'feature', tier: 'mid' },
      { type: 'agenda', tier: 'core' }, { type: 'register', tier: 'core' }, { type: 'faq', tier: 'mid' },
      { type: 'free', tier: 'mid' },
    ],
    fixed: ['dock'],
    labels: { answer: '핵심 카드 3', skill: '기능 탭', feature: '하이라이트 카드', agenda: '아젠다·드로어', register: '신청 폼', faq: 'FAQ', free: '웨이브 CTA', dock: '플로팅 CTA' },
  };
  window.ENSOL_STYLE = { id: 'ensol', name: 'Ensol Release', desc: '블루 그라데이션 · 영상 히어로 핀 스크럽 · 오버랩 카드 · 자동재생 탭 · 아젠다 드로어 · 데이터 웨이브 CTA', swatch: 'linear-gradient(135deg,#040308 0%,#0C2470 45%,#3186ff 100%)' };
})();
