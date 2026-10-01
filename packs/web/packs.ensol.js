/* packs.ensol.js — "Ensol MBM" 릴리즈 이벤트 랜딩 팩 (CIVIL NX 2026 씨드의 팩화). classic <script src>.
   소스: packs.ensol.sample.html 씨드 실측 — resource.midasuser.com CIVIL NX 2026 릴리즈 이벤트 기반.
   구성(고정 TEMPLATE): GNB(글래스→솔리드) → KV 핀 320vh(영상 풀블리드 → 글자 스태거 타이포 →
   스케일다운 아웃 → 다크닝+블러 → 미션 멘트 스케일업 인) → [movable] answer(키비주얼 카드 3·배지 추종)
   → skill(탭 5 자동 프로그레스·크로스페이드) → feature(좌 sticky + 혜택 카드 3) → agenda(리스트+드로어)
   → faq(라인 아코디언) → free(데이터 지형 웨이브 CTA) → 고정 register(오로라 폼) → footer → dock.
   실측 토큰: 제미나이 블루 그라(--btng/--txtg/--txtgB) · 잉크 #222 · 다크 #040308 · radius 0 ·
   타이틀 clamp(40,4.2vw,72) lw500/hw700 · 컨테이너 1320.
   매핑: h1=tagline · klead=subcopy · answer=features(0-2) · skill탭=zigs(cap=탭·title/desc=패널) ·
   feature=benefits(cap캡션+title+link) · agenda=sessions · faq=faq · free=ctaTitle/Sub · 미션=TT 4언어+productName.
   모든 슬롯은 필드 단위 DEMO 폴백 — 빈 섹션·빈 텍스트가 나오지 않는다.
   opts.motion===false 또는 prefers-reduced-motion → 정적 폴백(nomo). */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  /* **구절** 마커 → 그라데이션 하이라이트 */
  function gt(s) { return ml(s).replace(/\*\*(.+?)\*\*/g, '<span class="gt">$1</span>'); }

  var BASE = (function () { try { var sc = document.currentScript && document.currentScript.src || ''; return sc ? sc.slice(0, sc.lastIndexOf('/') + 1) : ''; } catch (e) { return ''; } })();
  BASE = BASE.replace(/packs\/(ppt|web|edm)\/$/, 'app/');
  if (!/^https?:/.test(BASE)) BASE = 'https://midas-drs.pages.dev/app/';
  var PROD = 'https://midas-drs.pages.dev/app/';
  function att(rel) { return BASE + 'bg/' + rel; }
  function imFall(rel) { return 'onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'' + PROD + 'bg/' + rel + '\';}else{this.style.display=\'none\';}"'; }
  /* data-img 슬롯 — 스튜디오 이미지 교체. 교체값 있으면 그걸, 없으면 팩 기본 이미지 */
  function imSlot(d, key, rel, extra) {
    var ov = d.images && d.images[key];
    var src = ov || att(rel);
    return '<img src="' + esc(src) + '" alt="" data-img="images.' + key + '" ' + (ov ? '' : imFall(rel)) + (extra || '') + '>';
  }

  var KV_ROT = ['ensol-kv4.avif', 'ensol-kv3.avif', 'ensol-kv2.avif', 'ensol-kv1.avif'];
  var SKILL_ROT = ['ensol-skill1.jpg', 'ensol-skill2.jpg', 'ensol-skill3.jpg', 'ensol-skill4.jpg', 'ensol-skill5.jpg'];
  var FEAT_ROT = ['mbmtoss-hero3.jpg', 'mbmtoss-session.jpg', 'mbmtoss-network.jpg'];

  /* 템플릿 고정 라벨 — 번역 파이프라인을 안 타므로 팩이 4언어 직접 처리. {p}=productName */
  var TT = {
    ko: { msnEb: 'Why {p}', msn1: '엔지니어에게는 늘 **더 빠른 해석**과\n**끊김 없는 워크플로우**, **안정적인 대규모 해석**이 필요했습니다.', msn2: '{p}는 그 고민의 **다음 단계**를 제시합니다.',
          ansPre: 'The Answer,', sklPre: 'Boundless Capabilities', sklPost: 'of {p}',
          featT: '지금 쓰시는 {p},\n더 많은 일을 할 수 있습니다.', featS: '전문가와 함께 새 기능을 바로 적용해 보세요.',
          agdT: 'Webinar Agenda', regPre: '{p}', regPass: 'All-Access Pass',
          fName: '성함', fEmail: '이메일', fCompany: '회사명', fJob: '직책', fPhone: '휴대전화번호', fCountry: '국가/지역', fIndustry: '산업 분야 (예: 교량, 철도, 플랜트)',
          done1: '신청이 완료되었습니다.', done2: '자료를 메일로 보내드렸어요!\n캘린더에 웨비나 일정을 추가하고 특별 자료도 받아보세요.',
          dockTag: '사전 신청' },
    en: { msnEb: 'Why {p}', msn1: 'Engineers have always needed **faster analysis**,\na **seamless workflow**, and **stable large-scale runs**.', msn2: '{p} goes beyond\nyour engineering struggles.',
          ansPre: 'The Answer,', sklPre: 'Boundless Capabilities', sklPost: 'of {p}',
          featT: 'See How Your Current\n{p} Can Do More.', featS: 'Let our experts help you apply the new features instantly. Book a quick chat today!',
          agdT: 'Webinar Agenda', regPre: '{p}', regPass: 'All-Access Pass',
          fName: 'Name', fEmail: 'Email', fCompany: 'Company', fJob: 'Job Title', fPhone: 'Phone Number', fCountry: 'Country / Region', fIndustry: 'Industry (e.g. Bridge, Rail, Plant)',
          done1: 'Thank you for registering.', done2: 'Your materials are in your inbox!\nAdd the webinar to your calendar to unlock an exclusive White Paper.',
          dockTag: 'Register' },
    ja: { msnEb: 'Why {p}', msn1: 'エンジニアには常に**より速い解析**と\n**途切れないワークフロー**、**安定した大規模解析**が必要でした。', msn2: '{p}は、その悩みの**次の段階**を示します。',
          ansPre: 'The Answer,', sklPre: 'Boundless Capabilities', sklPost: 'of {p}',
          featT: 'いまお使いの{p}、\nもっと多くのことができます。', featS: '専門家と一緒に新機能をすぐに適用してみましょう。',
          agdT: 'Webinar Agenda', regPre: '{p}', regPass: 'All-Access Pass',
          fName: 'お名前', fEmail: 'メール', fCompany: '会社名', fJob: '役職', fPhone: '電話番号', fCountry: '国・地域', fIndustry: '業種（例：橋梁・鉄道・プラント）',
          done1: 'お申し込みありがとうございます。', done2: '資料をメールでお送りしました！\nカレンダーにウェビナーを追加して特典資料も受け取りましょう。',
          dockTag: '事前登録' },
    zh: { msnEb: 'Why {p}', msn1: '工程师始终需要**更快的分析**、\n**顺畅的工作流**与**稳定的大规模计算**。', msn2: '{p}为这些难题\n给出**下一步答案**。',
          ansPre: 'The Answer,', sklPre: 'Boundless Capabilities', sklPost: 'of {p}',
          featT: '您现在使用的{p}，\n可以做得更多。', featS: '与专家一起立即应用新功能。',
          agdT: 'Webinar Agenda', regPre: '{p}', regPass: 'All-Access Pass',
          fName: '姓名', fEmail: '邮箱', fCompany: '公司', fJob: '职位', fPhone: '电话', fCountry: '国家/地区', fIndustry: '行业（如桥梁、铁路、工厂）',
          done1: '报名成功。', done2: '资料已发送至您的邮箱！\n将直播日程加入日历，还可获得专属白皮书。',
          dockTag: '报名' },
  };

  /* 데모 데이터 — 씨드 실카피. 모든 키가 폴백으로 쓰여 빈 슬롯이 없다. */
  var DEMO_EN = {
    productName: 'CIVIL NX 2026',
    navTitle: 'MIDAS CIVIL NX',
    tagline: 'HYPER-S',
    subcopy: 'Insanely Fast. Boundlessly Capable.',
    primaryCta: 'Register Now',
    navLinks: ['CIVIL NX 2026', 'Features', 'Agenda', 'Webinar'],
    eventDate: '3.18 (Wed) — 9:00 - 10:00 (GMT)',
    eventPlace: 'Online Live',
    deadline: 'Mar 18',
    bannerText: 'LIVE WEBINAR & ON-DEMAND',
    bannerCta: 'New Release: Master CIVIL NX 2026 Updates Live on March 18',
    features: [
      { title: 'Incomparable\nSpeed', desc: 'With analysis speeds up to 6× faster than conventional solutions, project turnaround times are dramatically reduced, boosting overall productivity by more than twofold.' },
      { title: 'User-driven\nWorkflow', desc: 'Selective analysis and independent control by load case enable engineers to work exactly the way they want, delivering a truly flexible and engineer-centric workflow.' },
      { title: 'Unrivaled\nAnalysis', desc: 'Advanced features such as buffeting analysis and simultaneous analysis systems, unavailable in other software, establish a new benchmark for construction FEM.' },
    ],
    zigs: [
      { cap: 'Virtual Beam Design', title: 'Virtual Beam Design', desc: 'Combine plate and beam behavior into one composite girder model. Virtual Beam Design lets you review and design girders without rebuilding your structure, while preserving accurate load distribution and irregular geometry representation.' },
      { cap: 'Curved RSI', title: 'Curved Rail Structure Interaction', desc: 'Automatically generate a 3D track–structure coupling model that accounts for curvature, alignment, and multi-track layouts. CIVIL NX captures the nonlinear interaction between rail and structure, delivering more accurate rail stress predictions than linear approximations.' },
      { cap: 'CS Buckling Analysis', title: 'Buckling Analysis\nwith Construction Stage', desc: 'Evaluate structural stability at every construction stage without creating separate models. CIVIL NX applies buckling analysis directly within staged construction, helping you detect instability risks earlier and reduce modeling effort.' },
      { cap: 'Fiber Pushover', title: 'Pushover Analysis\nUsing Fiber Hinge Type', desc: 'Simulate nonlinear structural behavior using fiber-based hinge modeling. CIVIL NX captures distributed plasticity and post-yield response more realistically than concentrated hinge methods, giving you more reliable performance assessments.' },
      { cap: 'Advanced Analysis +', title: 'Advanced Analysis +', desc: 'CIVIL NX powered by the HYPER-S engine enables high-end features such as Multi P-delta and Buffeting analysis, global localization design standards, and an AI Assistant. Coming this September.' },
    ],
    benefits: [
      { cap: 'BENEFIT 01', title: 'Faster Analysis Solver\n— up to 6×', link: 'See it live' },
      { cap: 'BENEFIT 02', title: 'Localized Features &\nGlobal Design Codes', link: 'Explore coverage' },
      { cap: 'BENEFIT 03', title: 'Unrivaled Analysis,\nUnmatched Precision', link: 'Meet the engine' },
    ],
    sessions: [
      { time: '9:00 ~ 9:10', title: 'Opening — CIVIL NX 2026 with HYPER-S', by: 'MIDAS CIVIL Product Team' },
      { time: '9:10 ~ 9:25', title: 'Incomparable Speed — up to 6× Faster', by: 'HYPER-S Engine Team' },
      { time: '9:25 ~ 9:45', title: 'Boundless Capabilities Deep-Dive', by: 'Structural Solution Engineer' },
      { time: '9:45 ~ 9:55', title: 'Roadmap — Advanced Analysis +', by: 'MIDAS CIVIL Product Team' },
      { time: '9:55 ~ 10:00', title: 'Q&A & Closing', by: 'All Speakers' },
    ],
    faq: [
      { q: 'What’s new in CIVIL NX 2026?', a: 'The HYPER-S engine brings up to 6× faster analysis, a user-driven workflow, and advanced features such as buffeting analysis and simultaneous analysis systems.' },
      { q: 'Is the webinar free to attend?', a: 'Yes — the live webinar and on-demand replay are both free. Register once and we will send the access link to your email.' },
      { q: 'Can I watch the replay later?', a: 'Registrants receive on-demand access after the live session, together with the leaflet and release materials.' },
      { q: 'How do I activate the new features?', a: 'CIVIL NX 2026 features are activated through your existing license channel. Join the webinar to see the activation walkthrough.' },
    ],
    ctaTitle: 'The Best Time to\nMove Forward',
    ctaSub: 'The next generation of structural analysis is here.\nExperience up to 6× faster performance today.',
    formTitle: 'All-Access Pass',
    footerCopyright: '© MIDAS IT. All rights reserved.',
    footerBrand: 'MIDAS Group',
  };
  var DEMO = {
    productName: 'CIVIL NX 2026',
    navTitle: 'MIDAS CIVIL NX',
    tagline: 'HYPER-S',
    subcopy: '압도적으로 빠르게. 한계 없이 유연하게.',
    primaryCta: '사전 등록하기',
    navLinks: ['CIVIL NX 2026', '핵심 기능', '아젠다', '웨비나'],
    eventDate: '3.18 (수) — 9:00 - 10:00 (KST)',
    eventPlace: '온라인 라이브',
    deadline: '3월 18일',
    bannerText: 'LIVE WEBINAR & ON-DEMAND',
    bannerCta: '새 릴리즈: CIVIL NX 2026 업데이트, 3월 18일 라이브로 만나보세요',
    features: [
      { title: '압도적인\n해석 속도', desc: '기존 대비 최대 6배 빠른 해석 속도로 프로젝트 소요 시간을 크게 줄이고, 전체 생산성을 두 배 이상 끌어올립니다.' },
      { title: '엔지니어 중심\n워크플로우', desc: '하중 케이스별 선택 해석과 독립 제어로, 엔지니어가 원하는 방식 그대로 유연하게 작업할 수 있습니다.' },
      { title: '독보적인\n해석 기능', desc: '버페팅 해석, 동시 해석 시스템 등 타 소프트웨어에 없는 고급 기능으로 건설 FEM의 새로운 기준을 제시합니다.' },
    ],
    zigs: [
      { cap: 'Virtual Beam Design', title: 'Virtual Beam Design', desc: '플레이트와 빔 거동을 하나의 합성 거더 모델로 통합합니다. 구조를 다시 만들지 않고도 거더 검토·설계가 가능하며, 하중 분배와 비정형 형상을 정확히 유지합니다.' },
      { cap: 'Curved RSI', title: '곡선 궤도-구조 상호작용', desc: '곡률·선형·복수 궤도를 반영한 3D 궤도-구조 연성 모델을 자동 생성합니다. 선형 근사보다 정확한 레일 응력 예측을 제공합니다.' },
      { cap: 'CS 좌굴 해석', title: '시공단계 좌굴 해석', desc: '별도 모델 없이 모든 시공단계에서 구조 안정성을 평가합니다. 시공단계 안에서 좌굴 해석을 바로 수행해 불안정 위험을 더 일찍 발견합니다.' },
      { cap: 'Fiber Pushover', title: '파이버 힌지 푸시오버', desc: '파이버 기반 힌지 모델로 비선형 거동을 시뮬레이션합니다. 집중 힌지보다 사실적인 소성 분포와 항복 후 거동을 포착합니다.' },
      { cap: 'Advanced Analysis +', title: 'Advanced Analysis +', desc: 'HYPER-S 엔진 기반의 Multi P-delta·버페팅 해석, 글로벌 설계기준, AI 어시스턴트까지. 오는 9월 공개됩니다.' },
    ],
    benefits: [
      { cap: '혜택 01', title: '최대 6배 빨라진\n해석 솔버', link: '라이브로 확인하기' },
      { cap: '혜택 02', title: '글로벌 설계기준과\n로컬라이즈 기능', link: '지원 범위 보기' },
      { cap: '혜택 03', title: '독보적인 해석,\n압도적인 정밀도', link: '엔진 소개 보기' },
    ],
    sessions: [
      { time: '9:00 ~ 9:10', title: '오프닝 — CIVIL NX 2026 with HYPER-S', by: 'MIDAS CIVIL 프로덕트팀' },
      { time: '9:10 ~ 9:25', title: '압도적인 속도 — 최대 6배 빠르게', by: 'HYPER-S 엔진팀' },
      { time: '9:25 ~ 9:45', title: '핵심 기능 딥다이브', by: '구조 솔루션 엔지니어' },
      { time: '9:45 ~ 9:55', title: '로드맵 — Advanced Analysis +', by: 'MIDAS CIVIL 프로덕트팀' },
      { time: '9:55 ~ 10:00', title: 'Q&A & 클로징', by: '전체 연사' },
    ],
    faq: [
      { q: 'CIVIL NX 2026에서 무엇이 달라지나요?', a: 'HYPER-S 엔진으로 최대 6배 빠른 해석, 엔지니어 중심 워크플로우, 버페팅 해석·동시 해석 시스템 같은 고급 기능이 더해집니다.' },
      { q: '웨비나는 무료인가요?', a: '네, 라이브와 다시보기 모두 무료입니다. 등록하시면 접속 링크를 메일로 보내드립니다.' },
      { q: '라이브를 놓치면 다시 볼 수 있나요?', a: '등록자에게는 라이브 종료 후 온디맨드 링크와 릴리즈 자료를 함께 보내드립니다.' },
      { q: '새 기능은 어떻게 활성화하나요?', a: '기존 라이선스 채널을 통해 활성화됩니다. 웨비나에서 활성화 과정을 직접 보여드립니다.' },
    ],
    ctaTitle: '앞서가기 가장 좋은\n바로 지금',
    ctaSub: '차세대 구조해석이 도착했습니다.\n최대 6배 빠른 퍼포먼스를 오늘 경험해 보세요.',
    formTitle: 'All-Access Pass',
    footerCopyright: '© MIDAS IT. All rights reserved.',
    footerBrand: 'MIDAS Group',
  };

  /* 베리에이션 전용 CSS — 카탈로그(sections-ensol) 시안 이식 */
  var EXT =
    '.eg-bento{display:grid;grid-template-columns:1fr 1fr;gap:0}' +
    '.eg-bento .bcard{position:relative;height:340px;overflow:hidden;background:var(--dark)}' +
    '.eg-bento .bcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}' +
    '.eg-bento .bcard:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,3,8,.45) 0%,rgba(4,3,8,0) 45%)}' +
    '.eg-bento .bcard .bt{position:absolute;left:30px;top:28px;color:#fff;font-size:24px;font-weight:600;line-height:1.3;z-index:2}' +
    '.eg-bento .bcard .bt p{margin-top:12px;font-size:14.5px;font-weight:400;line-height:1.55;color:rgba(255,255,255,.72);max-width:300px}' +
    '.eg-vskill{display:grid;grid-template-columns:380px 1fr;gap:48px;max-width:1160px;margin:64px auto 0;align-items:stretch}' +
    '.eg-vskill ul{list-style:none;display:flex;flex-direction:column;justify-content:center;gap:4px}' +
    '.eg-vskill li{padding:18px 22px;font-size:19px;font-weight:600;color:#9AA3AE;border-left:2px solid var(--line);cursor:pointer;transition:color .25s,border-color .25s,background .25s}' +
    '.eg-vskill li.on{color:var(--ink);border-color:var(--lime);background:linear-gradient(90deg,rgba(49,134,255,.07),transparent)}' +
    '.eg-vskill .vis{height:420px;overflow:hidden}' +
    '.eg-vskill .vis img{width:100%;height:100%;object-fit:cover}' +
    '.eg-vsdesc{max-width:1160px;margin:22px auto 0;color:var(--g2);font-size:16px;line-height:1.65}' +
    '.eg-tt2{display:grid;grid-template-columns:150px 1fr 220px;gap:24px;align-items:center;padding:22px 18px;border-bottom:1px solid rgba(255,255,255,.12);color:#fff;max-width:1060px;margin:0 auto}' +
    '.eg-tt2:first-of-type{border-top:1px solid rgba(255,255,255,.12)}' +
    '.eg-tt2 .t{font-weight:600;opacity:.75}' +
    '.eg-tt2 b{font-size:19px;font-weight:600}' +
    '.eg-tt2 .s{color:rgba(255,255,255,.55);font-size:14px;text-align:right}' +
    '.eg-faq2{max-width:1160px;margin:56px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:0 56px;align-items:start}' +
    '.eg-faq2>div>.item:first-child{border-top:1px solid var(--line)}' +
    '.eg-fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1160px;margin:64px auto 0}' +
    '.eg-fgrid .fc{background:#fff}' +
    '.eg-fgrid .fc img{width:100%;height:220px;object-fit:cover;display:block}' +
    '.eg-fgrid .fc .bd{padding:22px 4px}' +
    '.eg-fgrid .fc b{font-size:20px;font-weight:600;line-height:1.35}' +
    '.eg-fgrid .fc p{margin-top:10px;font-size:15px;line-height:1.6;color:var(--g2)}' +
    '.eg-band{padding:140px 0;text-align:center;background:linear-gradient(89.58deg,#3186ff 0%,#1257ff 45%,#346bf0 100%);color:#fff}' +
    '.eg-band p{margin:18px 0 34px;font-size:19px;opacity:.85}' +
    '.eg-band .gbtn{justify-content:center}' +
    '.eg-band .gbtn a.white{background:#fff;color:#1257ff}' +
    '@media (max-width:900px){.eg-bento{grid-template-columns:1fr}.eg-vskill{grid-template-columns:1fr;gap:20px}.eg-faq2{grid-template-columns:1fr}.eg-fgrid{grid-template-columns:1fr}.eg-tt2{grid-template-columns:90px 1fr;gap:12px}.eg-tt2 .s{display:none}}';

  var CSS = '\n'+
    ':root{\n'+
    '  --lime:#3186ff; --lime2:#346bf0; --onp:#fff; --sub:#4ea0ff; --onsub:#fff;\n'+
    '  --btng:linear-gradient(89.58deg,#3186ff 0%,#346bf0 30%,#4ea0ff 55%,#346bf0 78%,#3186ff 100%);\n'+
    '  --txtg:linear-gradient(89.58deg,#3186ff .28%,#346bf0 44.45%,#4ea0ff 99.55%);\n'+
    '  --txtgB:linear-gradient(89.58deg,#5AA7FF 0%,#4E8FF5 45%,#8FC6FF 100%);\n'+
    '  --blue1:#2CADD5; --blue2:#00479E; --navy:#00054D;\n'+
    '  --dark:#040308; --ink:#222; --bgray:#4E5968; --g:#444; --g2:#666; --g3:#999; --line:#DEDEDE; --bgsoft:#F6F9FE;\n'+
    '}\n'+
    '*{margin:0;padding:0;box-sizing:border-box}\n'+
    'html{scroll-behavior:smooth}\n'+
    'body{font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased;letter-spacing:-.01em;overflow-x:clip}\n'+
    'img,video{display:block;max-width:100%}\n'+
    'a{text-decoration:none;color:inherit}\n'+
    'ul{list-style:none}\n'+
    '.df{font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif}\n'+
    '.wrap{max-width:1320px;margin:0 auto;padding:0 28px}\n'+
    'h2.tt{font-size:clamp(40px,4.2vw,72px);line-height:1.2;letter-spacing:-.02em}\n'+
    'h2 .lw{font-weight:500}\n'+
    'h2 .hw{font-weight:700}\n'+
    '/* 공용 버튼 — 원본 group_btn a: 225~286×64, 각진, 라임/아웃라인 */\n'+
    '.gbtn{display:flex;gap:20px}\n'+
    '.gbtn a{border-radius:0;display:flex;align-items:center;justify-content:center;gap:8px;width:auto;height:56px;padding:0 34px;font-size:18px;font-weight:600;letter-spacing:-.36px;transition:.3s;cursor:pointer}\n'+
    '.gbtn a .arr{font-weight:700;transition:transform .3s}\n'+
    '.gbtn a:hover .arr{transform:translateX(4px)}\n'+
    '.gbtn .lime{background:var(--btng);background-size:220% 100%;background-position:0% 50%;color:#fff;transition:background-position .6s ease}\n'+
    '.gbtn .lime:hover{background-position:100% 50%}\n'+
    '.gbtn .ghost{border:1px solid var(--ink);color:var(--ink)}\n'+
    '.gbtn .ghost:hover{background:var(--ink);color:#fff}\n'+
    '.gbtn .white{background:#fff;color:var(--ink)}\n'+
    '.gbtn .white:hover{background:var(--btng);background-size:220% 100%;color:#fff}\n'+
    '.gbtn .wghost{border:1px solid #fff;color:#fff}\n'+
    '.gbtn .wghost:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.7)}\n'+
    '/* 리빌 */\n'+
    '.rv{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}\n'+
    '.rv.on{opacity:1;transform:none}\n'+
    '/* 그라데이션 강조 어구 — 여러 단어가 하나의 그라로 연결 */\n'+
    '.gt{background:var(--txtg);-webkit-background-clip:text;background-clip:text;color:transparent}\n'+
    '.agenda .gt,.register .gt,.free .gt,.kv .gt{background-image:var(--txtgB)}\n'+
    '/* gt는 단어 분해 없이 통째로 등장 — 자식 레이어 승격 시 그라 클립이 안 그려지는 문제 회피 */\n'+
    'h2.wt .gt{display:inline-block;opacity:0;transform:translate3d(0,14px,0);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}\n'+
    'h2.wt.active .gt{opacity:1;transform:translate3d(0,0,0)}\n'+
    '/* 타이틀 단어 스태거 등장(toss.im 참고) */\n'+
    'h2.wt .w{display:inline-block;opacity:0;transform:translate3d(0,14px,0);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}\n'+
    'h2.wt.active .w{opacity:1;transform:translate3d(0,0,0)}\n'+
    '\n'+
    '/* ── 좌측 섹션 인디케이터(toss.im 대시 내비) ── */\n'+
    '.snav{position:fixed;left:26px;top:50%;transform:translateY(-50%);z-index:80;display:flex;flex-direction:column;gap:10px;opacity:0;pointer-events:none;transition:opacity .4s}\n'+
    '.snav.vis{opacity:1;pointer-events:auto}\n'+
    '.snav a{display:block;width:14px;height:2px;background:rgba(4,3,8,.25);transition:width .3s,background .3s}\n'+
    '.snav a.on{width:26px;background:var(--ink)}\n'+
    '.snav.ondark a{background:rgba(255,255,255,.4)}\n'+
    '.snav.ondark a.on{background:#fff}\n'+
    '\n'+
    '/* ── GNB ─────────────────────────────── */\n'+
    '.gnb{position:fixed;top:0;left:0;right:0;z-index:100;transition:background .35s,box-shadow .35s}\n'+
    '.gnb .in{max-width:none;margin:0;padding:0 56px;height:72px;display:flex;align-items:center;gap:24px}\n'+
    '.gnb .logo{font-size:21px;font-weight:700;color:#fff;letter-spacing:-.01em}\n'+
    '.gnb nav{display:flex;gap:6px;margin-left:auto}\n'+
    '.gnb nav a{padding:9px 14px;font-size:16px;font-weight:600;color:rgba(255,255,255,.85);transition:background .2s,color .2s}\n'+
    '.gnb nav a:hover{color:var(--lime)}\n'+
    '.gnb .cta{border-radius:0;background:var(--btng);background-size:220% 100%;background-position:0% 50%;color:#fff;font-size:16px;font-weight:700;padding:16px 22px;transition:background-position .6s ease}\n'+
    '.gnb .cta:hover{background-position:100% 50%}\n'+
    '.gnb.solid{background:rgba(255,255,255,.72);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4)}\n'+
    '.gnb.solid .logo{color:var(--ink)}\n'+
    '.gnb.solid nav a{color:var(--g)}\n'+
    '.gnb.solid nav a:hover{color:var(--lime2)}\n'+
    '\n'+
    '/* ── 1. 히어로 KV — 풀블리드 영상 스크럽(원본 invite + 씨드 KV) ── */\n'+
    '.kv{position:relative;height:320vh}\n'+
    '.kv .stick{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--dark)}\n'+
    '.kv .ph{position:absolute;inset:0}\n'+
    '.kv .ph video{width:100%;height:100%;object-fit:cover}\n'+
    '.kv .ov{position:absolute;inset:0;background:rgba(4,3,8,.66)}\n'+
    '/* 라이트 스윕 — 프라이머리(라임·시안) 광선이 이따금 은은하게 지나감 */\n'+
    '.kv .sheen{position:absolute;inset:0;overflow:hidden;pointer-events:none;mix-blend-mode:screen}\n'+
    '.kv .sheen i{position:absolute;top:-20%;bottom:-20%;left:0;width:44%;background:linear-gradient(100deg,transparent 0%,color-mix(in srgb,var(--lime) 6%,transparent) 35%,color-mix(in srgb,var(--sub) 10%,transparent) 50%,color-mix(in srgb,var(--lime) 5%,transparent) 65%,transparent 100%);filter:blur(36px);transform:translateX(-160%) skewX(-14deg);animation:sheenSweep 7.5s ease-in-out infinite;will-change:transform}\n'+
    '.kv .sheen i.s2{width:24%;opacity:.7;animation-delay:3.8s}\n'+
    '@keyframes sheenSweep{0%{transform:translateX(-160%) skewX(-14deg)}34%{transform:translateX(440%) skewX(-14deg)}100%{transform:translateX(440%) skewX(-14deg)}}\n'+
    '.kv .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;padding:0 24px;transform:translateY(-50px)}\n'+
    '.kv h1{margin:0 0 34px;font-size:11.5vw;font-weight:700;line-height:1.02;letter-spacing:-.02em;text-shadow:0 1px 10px rgba(0,0,0,.15)}\n'+
    '.kv .klead{margin-bottom:56px;font-size:clamp(19px,2.4vw,40px);font-weight:500;color:rgba(255,255,255,.95);text-shadow:0 1px 6px rgba(0,0,0,.2)}\n'+
    '.kv h1 .l{display:block}\n'+
    '.kv .ent{opacity:0;transform:translateY(16px);transition:opacity .8s cubic-bezier(.2,.6,.2,1),transform .8s cubic-bezier(.2,.6,.2,1)}\n'+
    '.kv.ready .ent{opacity:1;transform:none}\n'+
    '.kv.ready .kvmeta{opacity:.7}\n'+
    '.kv.ready .klead{opacity:.8}\n'+
    '.kv.ready .d2{transition-delay:.35s}\n'+
    '.kv.ready .d4{transition-delay:.6s}\n'+
    '.kv h1 .w{display:inline-block;opacity:0;transform:translate3d(0,14px,0);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}\n'+
    '.kv.ready h1 .w{opacity:1;transform:translate3d(0,0,0)}\n'+
    '.kv .gbtn{justify-content:center}\n'+
    '.kv .kvmeta{position:absolute;left:0;right:0;bottom:32px;display:flex;justify-content:space-between;align-items:center;padding:0 56px;color:rgba(255,255,255,.85);font-size:18px;font-weight:500;letter-spacing:.01em}\n'+
    '.kv .kvmeta .mid{position:absolute;left:50%;transform:translateX(-50%)}\n'+
    '.kv .sub2{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff;opacity:0;pointer-events:none;padding:0 24px}\n'+
    '\n'+
    '/* ── 1.5 KV 후반 — 어두워지며 미션 멘트 툭(toss insurance 미션 스테이지 참고) ── */\n'+
    '.kv .sub2 .tx{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center;height:100%}\n'+
    '.kv .sub2 .eb{font-size:clamp(20px,1.2vw,26px);font-weight:600}\n'+
    '.kv .sub2 p{color:#fff;font-size:clamp(36px,2.5vw,52px);font-weight:600;line-height:1.55;text-shadow:0 1px 10px rgba(0,0,0,.15)}\n'+
    '\n'+
    '/* ── 3. 앤서 — 흰 배경·그래픽 카드 3 + 하단 텍스트(토스증권 카드 리스트 스타일) ── */\n'+
    '.answer{position:relative;z-index:2;margin-top:-100vh;padding:160px 0;background:#fff}\n'+
    '.answer h2{text-align:center;color:var(--ink);margin-bottom:60px}\n'+
    '.answer .cards{display:flex;gap:0}\n'+
    '.answer .card{position:relative;flex:1;height:520px;overflow:hidden;cursor:pointer;background:var(--dark);opacity:0;transform:translateY(90px);transition:opacity .7s cubic-bezier(.2,.6,.2,1),transform .7s cubic-bezier(.2,.6,.2,1)}\n'+
    '.answer .cards.active .card{opacity:1;transform:none}\n'+
    '.answer .cards.active .card:nth-child(2){transition-delay:.45s}\n'+
    '.answer .cards.active .card:nth-child(3){transition-delay:.9s}\n'+
    '.answer .card > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:filter .5s,transform .7s cubic-bezier(.2,.6,.2,1);animation:kvIdle 14s ease-in-out infinite alternate;will-change:transform}\n'+
    '.answer .card:nth-child(2) > img{animation-duration:18s;animation-delay:-6s}\n'+
    '.answer .card:nth-child(3) > img{animation-duration:22s;animation-delay:-11s}\n'+
    '.answer .card:hover > img{filter:brightness(1.15);animation-play-state:paused;transform:scale(1.08)}\n'+
    '@keyframes kvIdle{from{transform:scale(1.06) translate(1.2%,1%)}to{transform:scale(1.13) translate(-1.5%,-1.5%)}}\n'+
    '.answer .go{position:absolute;right:26px;bottom:26px;width:52px;height:52px;display:grid;place-items:center;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(10px) saturate(1.4);-webkit-backdrop-filter:blur(10px) saturate(1.4);color:#fff;font-size:19px;font-weight:700;transition:background .25s;z-index:2;will-change:transform;pointer-events:none}\n'+
    '.answer .card:hover .go{background:rgba(255,255,255,.26)}\n'+
    '.answer .ctx{position:absolute;left:40px;right:96px;top:40px;z-index:1;text-align:left}\n'+
    '.answer .ctx b{display:block;margin-bottom:14px;color:#fff;font-size:32px;font-weight:600;line-height:1.3}\n'+
    '.answer .ctx p{color:rgba(255,255,255,.72);font-size:15px;line-height:1.6}\n'+
    '\n'+
    '/* ── 6. 스킬 탭 5종(원본 이식: 좌 텍스트 500px 소프트 + 우 이미지) ── */\n'+
    '.skill{padding:160px 0;background:linear-gradient(180deg,#fff 0%,#F2F7FF 55%,#EDF4FF 100%)}\n'+
    '.skill h2{text-align:center}\n'+
    '.skill .tabs{display:flex;margin:4.5vw 0 30px;width:100%}\n'+
    '.skill .tabs button{position:relative;flex:1;padding-bottom:14px;border:0;border-bottom:2px solid #DCE2EB;background:none;color:#C6CCD4;font-family:inherit;font-size:18px;font-weight:500;cursor:pointer;transition:color .2s,border-color .2s}\n'+
    '.skill .tabs button.active{border-color:#DCE2EB;color:var(--ink);font-weight:600}\n'+
    '.skill .tabs button .prog{position:absolute;left:0;bottom:-2px;height:2px;width:0;background:var(--bgray)}\n'+
    '#skillPanes{position:relative;height:400px}\n'+
    '.skill .pane{position:absolute;inset:0;display:flex;height:400px;opacity:0;transform:translateY(10px);transition:opacity .45s cubic-bezier(.2,.6,.2,1),transform .45s cubic-bezier(.2,.6,.2,1);pointer-events:none}\n'+
    '.skill .pane.onv{opacity:1;transform:none;pointer-events:auto}\n'+
    '.skill .tb{display:flex;flex-direction:column;justify-content:center;width:500px;flex:none;padding:0 48px 0 60px;background:#fff}\n'+
    '.skill .tb .badge{width:max-content;margin-bottom:12px;padding:0 8px;background:var(--lime);color:var(--onp);font-size:14px;font-weight:600;height:25px;line-height:25px;letter-spacing:-.28px}\n'+
    '.skill .tb strong{margin-bottom:26px;font-size:30px;font-weight:600;line-height:40px}\n'+
    '.skill .tb p{color:var(--g);font-size:16px;line-height:26px;letter-spacing:-.32px}\n'+
    '.skill .pane img{width:calc(100% - 500px);height:100%;object-fit:cover}\n'+
    '\n'+
    '/* ── 7. 피처 — 좌 고정 타이틀 + 우 카드 3 스크롤(toss insurance 패턴) ── */\n'+
    '.feature{padding:180px 0 200px;background:linear-gradient(180deg,#EDF4FF 0%,#E8F1FF 50%,#F4F9FF 100%)}\n'+
    '.feature .fgrid{display:flex;gap:110px;align-items:flex-start}\n'+
    '.feature .fleft{width:430px;flex:none;position:sticky;top:130px}\n'+
    '.feature .fleft h2{font-size:36px}\n'+
    '.feature .fleft p.sub{margin:20px 0 0;color:var(--g2);font-size:18px;line-height:1.6}\n'+
    '.feature .fright{flex:1;display:flex;flex-direction:column;gap:96px;min-width:0}\n'+
    '.feature .fitem{border-top:1px solid #d9e4f3;padding-top:30px}\n'+
    '.feature .fitem b{display:block;font-size:25px;font-weight:600;line-height:1.4}\n'+
    '.feature .fitem > p{margin:12px 0 38px;color:var(--g2);font-size:17px;line-height:1.65}\n'+
    '.feature .fcard{overflow:hidden;background:var(--bgsoft)}\n'+
    '.feature .fcard img{width:100%;height:360px;object-fit:cover;display:block}\n'+
    '\n'+
    '/* ── 7.5 어젠다 — 다크 리스트 + 클릭 시 우측 상세 드로어 ── */\n'+
    '.agenda{padding:160px 0;background:var(--dark)}\n'+
    '.agenda h2{color:#fff;text-align:center}\n'+
    '.agenda .asub{margin:16px 0 56px;text-align:center;color:rgba(255,255,255,.55);font-size:17px}\n'+
    '.agenda .alist{max-width:1060px;margin:0 auto}\n'+
    '.agenda .alist li{display:flex;align-items:center;gap:28px;padding:26px 18px;border-bottom:1px solid rgba(255,255,255,.12);cursor:pointer;transition:background .25s,padding .25s}\n'+
    '.agenda .alist.rv li{opacity:0;transform:translateY(26px);transition:opacity .6s cubic-bezier(.2,.6,.2,1),transform .6s cubic-bezier(.2,.6,.2,1),background .25s,padding .25s}\n'+
    '.agenda .alist.rv.on li{opacity:1;transform:none}\n'+
    '.agenda .alist.rv.on li:nth-child(2){transition-delay:.08s}\n'+
    '.agenda .alist.rv.on li:nth-child(3){transition-delay:.16s}\n'+
    '.agenda .alist.rv.on li:nth-child(4){transition-delay:.24s}\n'+
    '.agenda .alist.rv.on li:nth-child(5){transition-delay:.32s}\n'+
    '.agenda .alist li:first-child{border-top:1px solid rgba(255,255,255,.12)}\n'+
    '.agenda .alist li:hover{background:rgba(255,255,255,.06);padding-left:26px}\n'+
    '.agenda .at{flex:none;width:128px;color:rgba(255,255,255,.75);font-size:17px;font-weight:600;white-space:nowrap}\n'+
    '.agenda .am{flex:1}\n'+
    '.agenda .am b{display:block;color:#fff;font-size:19px;font-weight:600;line-height:1.4;transition:color .25s}\n'+
    '.agenda .am span{display:block;margin-top:4px;color:rgba(255,255,255,.5);font-size:14px}\n'+
    '.agenda .chev{color:rgba(255,255,255,.45);font-size:18px;font-weight:700;transition:transform .25s,color .25s}\n'+
    '.agenda .alist li:hover .am b{color:var(--sub)}\n'+
    '.agenda .alist li:hover .chev{transform:translateX(4px);color:var(--sub)}\n'+
    '/* 드로어 */\n'+
    '.adim{position:fixed;inset:0;z-index:190;background:rgba(4,3,8,.55);opacity:0;pointer-events:none;transition:opacity .35s}\n'+
    '.adim.on{opacity:1;pointer-events:auto}\n'+
    '.adrawer{position:fixed;top:0;right:0;bottom:0;z-index:200;width:min(480px,92vw);background:#fff;padding:56px 44px 0;overflow-y:auto;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .45s cubic-bezier(.22,1,.36,1)}\n'+
    '.adrawer.on{transform:none}\n'+
    '.adrawer .dclose{position:absolute;top:18px;right:18px;width:40px;height:40px;border:0;background:none;color:var(--g3);font-size:26px;line-height:1;cursor:pointer;transition:color .2s}\n'+
    '.adrawer .dclose:hover{color:var(--ink)}\n'+
    '.adrawer .dtime{display:inline-block;align-self:flex-start;background:var(--lime);color:var(--onp);font-size:14px;font-weight:700;padding:5px 10px}\n'+
    '.adrawer h4{margin:18px 0 6px;font-size:26px;font-weight:600;line-height:1.35;color:var(--ink)}\n'+
    '.adrawer .dspk{display:block;color:var(--g3);font-size:14px;margin-bottom:22px}\n'+
    '.adrawer .dmedia{flex:none;height:220px;margin-bottom:24px;background:var(--bgsoft);overflow:hidden}\n'+
    '.adrawer .dmedia img,.adrawer .dmedia video{width:100%;height:100%;object-fit:cover;display:block}\n'+
    '.adrawer .dtxt{color:var(--g);font-size:16px;line-height:1.65;margin-bottom:26px}\n'+
    '.adrawer .dpoints li{position:relative;padding:12px 0 12px 22px;border-bottom:1px solid var(--line);color:var(--ink);font-size:15px;line-height:1.5}\n'+
    '.adrawer .dpoints li:before{content:"";position:absolute;left:0;top:19px;width:8px;height:8px;background:var(--lime)}\n'+
    '.adrawer .dnav{display:flex;align-items:center;justify-content:space-between;margin-top:auto;position:sticky;bottom:0;background:#fff;padding:20px 0 24px}\n'+
    '.adrawer .dn{border:0;background:none;padding:10px 6px;color:var(--ink);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:color .2s}\n'+
    '.adrawer .dn:hover:not(:disabled){color:var(--lime2)}\n'+
    '.adrawer .dn:disabled{opacity:.3;cursor:default}\n'+
    '.adrawer #adidx{color:var(--g3);font-size:14px;font-variant-numeric:tabular-nums}\n'+
    '.adrawer.swap .dtime,.adrawer.swap h4,.adrawer.swap .dspk,.adrawer.swap .dmedia,.adrawer.swap .dtxt,.adrawer.swap .dpoints{animation:dfade .35s ease}\n'+
    '@keyframes dfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n'+
    '\n'+
    '/* ── 8. 레지스터 — All-Access Pass + 신청 폼(원본 카피 복원) ── */\n'+
    '.register{position:relative;padding:160px 0;background:radial-gradient(90% 45% at 50% 108%,rgba(120,190,255,.5) 0%,rgba(120,190,255,0) 62%),radial-gradient(150% 75% at 50% 115%,rgba(49,134,255,.65) 0%,rgba(49,134,255,0) 72%),linear-gradient(180deg,#040308 0%,#060D24 34%,#0C2470 66%,#1257ff 100%);overflow:hidden}\n'+
    '.register .wrap{position:relative;z-index:1}\n'+
    '.register h2{text-align:center;color:#fff}\n'+
    '.register .time{display:flex;align-items:center;justify-content:center;gap:16px;margin:34px 0 56px;font-size:22px;font-weight:600;color:#fff}\n'+
    '.register .bar{width:1px;height:18px;background:rgba(255,255,255,.25)}\n'+
    '.register form{max-width:760px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:14px}\n'+
    '.register .fld{position:relative}\n'+
    '.register .fld.full{grid-column:1/-1}\n'+
    '.register input{width:100%;height:60px;padding:24px 18px 8px;border-radius:0;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:16px;font-family:inherit}\n'+
    '.register input:focus{outline:2px solid #fff;outline-offset:-1px;border-color:#fff}\n'+
    '.register .fld label{position:absolute;left:19px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.75);font-size:16px;pointer-events:none;transition:top .18s ease,transform .18s ease,font-size .18s ease,color .18s ease;white-space:nowrap;max-width:calc(100% - 38px);overflow:hidden;text-overflow:ellipsis}\n'+
    '.register input:focus + label,.register input:not(:placeholder-shown) + label{top:10px;transform:none;font-size:12px;color:#fff}\n'+
    '.register input:not(:placeholder-shown):not(:focus) + label{color:rgba(255,255,255,.75)}\n'+
    '.register button{grid-column:1/-1;height:58px;border:0;border-radius:0;background:linear-gradient(89.58deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.72) 45%,rgba(255,255,255,.95) 100%);background-size:220% 100%;background-position:0% 50%;color:#1257ff;font-size:18px;font-weight:700;font-family:inherit;cursor:pointer;transition:background-position .6s ease}\n'+
    '.register button:hover{background-position:100% 50%}\n'+
    '.register button .bt{background:var(--txtg);-webkit-background-clip:text;background-clip:text;color:transparent}\n'+
    '.register .done{display:none;max-width:760px;margin:0 auto;text-align:center}\n'+
    '.register .done h4{font-size:34px;font-weight:600;margin-bottom:18px;color:#fff}\n'+
    '.register .done p{color:rgba(255,255,255,.7);font-size:17px;line-height:1.65}\n'+
    '.register.submitted form{display:none}\n'+
    '.register.submitted .done{display:block}\n'+
    '\n'+
    '/* ── 9. FAQ 아코디언 ── */\n'+
    '.faq{padding:160px 0;background:#fff}\n'+
    '.faq .in{max-width:1060px;margin:0 auto;padding:0 28px}\n'+
    '.faq h2{text-align:center;margin-bottom:26px}\n'+
    '.faq .item{border-bottom:1px solid var(--line)}\n'+
    '#faqList.rv .item{opacity:0;transform:translateY(24px);transition:opacity .6s cubic-bezier(.2,.6,.2,1),transform .6s cubic-bezier(.2,.6,.2,1)}\n'+
    '#faqList.rv.on .item{opacity:1;transform:none}\n'+
    '#faqList.rv.on .item:nth-child(2){transition-delay:.06s}\n'+
    '#faqList.rv.on .item:nth-child(3){transition-delay:.12s}\n'+
    '#faqList.rv.on .item:nth-child(4){transition-delay:.18s}\n'+
    '#faqList.rv.on .item:nth-child(5){transition-delay:.24s}\n'+
    '#faqList.rv.on .item:nth-child(6){transition-delay:.3s}\n'+
    '.faq .item:first-child{border-top:1px solid var(--line)}\n'+
    '.faq .q{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;min-height:88px;padding:0;border:0;background:none;color:var(--ink);font-family:inherit;font-size:20px;font-weight:600;line-height:28px;text-align:left;cursor:pointer;transition:color .25s}\n'+
    '.faq .q:hover,.faq .item.open .q{color:var(--lime)}\n'+
    '.faq .q .ar{flex:none;display:grid;place-items:center;color:var(--g2);transition:transform .3s,color .25s}\n'+
    '.faq .q:hover .ar,.faq .item.open .ar{color:var(--lime)}\n'+
    '.faq .item.open .q .ar{transform:rotate(180deg)}\n'+
    '.faq .a{height:0;overflow:hidden;color:var(--g2);font-size:16px;line-height:26px;text-align:left;transition:height .3s ease,padding .3s ease}\n'+
    '\n'+
    '/* ── 10. 프리 CTA — 데이터 지형 웨이브 캔버스(점 그리드 시뮬레이션·마우스 반응) ── */\n'+
    '.free{position:relative;padding:200px 0 220px;background:var(--dark);text-align:center;overflow:hidden}\n'+
    '.free canvas{position:absolute;inset:0;display:block;opacity:.9}\n'+
    '.free .wrap{position:relative;z-index:1}\n'+
    '.free h2{color:#fff}\n'+
    '.free p{margin:22px 0 56px;color:rgba(255,255,255,.72);font-size:22px;line-height:1.55}\n'+
    '.free .gbtn{justify-content:center}\n'+
    '\n'+
    '/* ── 푸터 ── */\n'+
    'footer{background:var(--dark);color:#fff;padding:34px 0}\n'+
    'footer .row{display:flex;align-items:center;justify-content:space-between;gap:20px}\n'+
    'footer .row b{font-size:19px;font-weight:700}\n'+
    'footer .row span{color:rgba(255,255,255,.45);font-size:13px}\n'+
    'footer .wrap{max-width:none;margin:0;padding:0 56px}\n'+
    '\n'+
    '/* ── 플로팅 독(원본 registerToast 번안) ── */\n'+
    '.dock{position:fixed;left:50%;bottom:28px;z-index:60;border-radius:0;display:flex;align-items:center;gap:22px;width:720px;padding:20px 14px 20px 26px;background:rgba(255,255,255,.6);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border:1px solid rgba(255,255,255,.55);box-shadow:0 10px 30px rgba(4,3,8,.12),0 1px 4px rgba(4,3,8,.05);opacity:0;transform:translate(-50%,140%);pointer-events:none;transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease}\n'+
    '.dock.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}\n'+
    '.dock .tx b{display:block;font-size:17px;font-weight:700}\n'+
    '.dock .tx i{display:block;margin-top:7px;font-style:normal;color:var(--g2);font-size:13px}\n'+
    '.dock .go{margin-left:auto;flex:none;border-radius:0;background:var(--btng);background-size:220% 100%;background-position:0% 50%;color:#fff;font-size:15px;font-weight:700;padding:13px 24px;transition:background-position .6s ease}\n'+
    '.dock .go:hover{background-position:100% 50%}\n'+
    '\n'+
    '/* ── 모바일 ── */\n'+
    '@media (max-width:900px){\n'+
    '  .gnb nav{display:none}\n'+
    '  .snav{display:none}\n'+
    '  h2.tt{font-size:36px}\n'+
    '  .kv h1{font-size:18vw}\n'+
    '  .kv .klead{font-size:17px}\n'+
    '  .kv .gbtn{flex-direction:column;align-items:center;gap:12px}\n'+
    '  .kv .kvmeta{font-size:11px;padding:0 20px}\n'+
    '  .kv .sub2 p{font-size:20px}\n'+
    '  .answer .cards{flex-direction:column;gap:28px}\n'+
    '  .answer .card{flex:none;height:110vw}\n'+
    '  .answer .ctx{left:24px;right:80px;bottom:26px}\n'+
    '  .answer .ctx b{font-size:24px}\n'+
    '  .skill .tabs{flex-wrap:wrap;gap:10px}\n'+
    '  .skill .tabs button{flex:none;width:calc(50% - 5px)}\n'+
    '  #skillPanes{height:auto}\n'+
    '  .skill .pane{position:static;display:none;height:auto;flex-direction:column;opacity:1;transform:none;pointer-events:auto;transition:none}\n'+
    '  .skill .pane.onv{display:flex}\n'+
    '  .skill .tb{width:100%;padding:32px 24px}\n'+
    '  .skill .pane img{width:100%;height:56vw}\n'+
    '  .feature .fgrid{flex-direction:column;gap:56px}\n'+
    '  .feature .fleft{width:100%;position:static}\n'+
    '  .feature .fcard img{height:54vw}\n'+
    '  .free .gbtn{flex-direction:column;align-items:center}\n'+
    '  .agenda .alist li{gap:14px;padding:20px 6px}\n'+
    '  .agenda .at{width:92px;font-size:13px}\n'+
    '  .agenda .am b{font-size:16px}\n'+
    '  .adrawer{padding:48px 26px}\n'+
    '  .register form{grid-template-columns:1fr}\n'+
    '  footer .wrap{padding:0 20px}\n'+
    '  .dock{display:none}\n'+
    '}\n'+
    '@media (prefers-reduced-motion:reduce){\n'+
    '  .kv .sheen i{animation:none;opacity:0}\n'+
    '  .answer .card > img{animation:none;transform:none}\n'+
    '  .rv,.kv .ent,.kv h1 .w,.answer .card,h2.wt .w,h2.wt .gt,.agenda .alist.rv li,#faqList.rv .item{opacity:1 !important;transform:none !important;transition:none !important;filter:none !important}\n'+
    '}\n'+
    '' + EXT;

  var FNJS = '\n'+
    '  \'use strict\';\n'+
    '  var reduce = matchMedia(\'(prefers-reduced-motion: reduce)\').matches || document.documentElement.classList.contains(\'nomo\');\n'+
    '  var vh = innerHeight;\n'+
    '  // 오버랩 정밀화: 덮는 섹션(.answer) 실높이만큼만 KV 꼬리를 겹침 — 화면 세로가 커도 영상 안 샘, 여백 안 늘어남\n'+
    '  // rect.height(소수)로 측정 + KV 꼬리 1px 언더 — offsetHeight 정수 반올림 시 0.x px 다크 헤어라인 노출 방지\n'+
    '  var answerSec = document.querySelector(\'.answer\');\n'+
    '  function fitOverlap(){\n'+
    '    if (!answerSec) { kv.style.height = \'\'; return; }\n'+
    '    var ah = answerSec.getBoundingClientRect().height;\n'+
    '    kv.style.height = \'calc(220vh + \' + (Math.floor(ah) - 1) + \'px)\';\n'+
    '    answerSec.style.marginTop = -ah + \'px\';\n'+
    '  }\n'+
    '  addEventListener(\'load\', fitOverlap);\n'+
    '  addEventListener(\'resize\', function(){ vh = innerHeight; fitOverlap(); });\n'+
    '\n'+
    '  var gnb = document.getElementById(\'gnb\');\n'+
    '\n'+
    '  // 좌측 섹션 인디케이터\n'+
    '  var SNAV_IDS = [\'top\', \'answer\', \'skill\', \'feature\', \'agenda\', \'register\', \'faq\', \'free\'];\n'+
    '  var snav = document.getElementById(\'snav\');\n'+
    '  SNAV_IDS = SNAV_IDS.filter(function(id){ return document.getElementById(id); });\n'+
    '  SNAV_IDS.forEach(function(id){\n'+
    '    var a = document.createElement(\'a\');\n'+
    '    a.href = \'#\' + id;\n'+
    '    a.setAttribute(\'aria-label\', id);\n'+
    '    snav.appendChild(a);\n'+
    '  });\n'+
    '  var snavLinks = snav.children;\n'+
    '  function snavTick(){\n'+
    '    var cur = 0, mid = scrollY + vh * 0.5;\n'+
    '    for (var i = 0; i < SNAV_IDS.length; i++){\n'+
    '      var sec = document.getElementById(SNAV_IDS[i]);\n'+
    '      if (sec && sec.offsetTop <= mid) cur = i;\n'+
    '    }\n'+
    '    for (var j = 0; j < snavLinks.length; j++) snavLinks[j].classList.toggle(\'on\', j === cur);\n'+
    '    var DARK = { top: 1, agenda: 1, register: 1, free: 1 };\n'+
    '    snav.classList.toggle(\'ondark\', !!DARK[SNAV_IDS[cur]]);\n'+
    '    snav.classList.toggle(\'vis\', cur > 0); /* 히어로에선 숨김 */\n'+
    '  }\n'+
    '\n'+
    '  // 1. KV 스크럽 — 타이포 페이드(38~60%) → 서브 카피(58~80%) + 카드 축소(45~80%, radius 0 유지)\n'+
    '  var kv = document.querySelector(\'.kv\');\n'+
    '  fitOverlap();\n'+
    '  // 히어로 타이틀 글자 분해 — 섹션 타이틀 스태거와 동일한 결(글자당 .05s)\n'+
    '  (function(){\n'+
    '    var wi = 0;\n'+
    '    kv.querySelectorAll(\'h1 .l\').forEach(function(line){\n'+
    '      var chars = line.textContent.split(\'\');\n'+
    '      line.textContent = \'\';\n'+
    '      chars.forEach(function(ch){\n'+
    '        if (ch === \' \') { line.appendChild(document.createTextNode(\' \')); return; }\n'+
    '        var sp = document.createElement(\'span\');\n'+
    '        sp.className = \'w\';\n'+
    '        sp.textContent = ch;\n'+
    '        sp.style.transitionDelay = (0.12 + wi * 0.05).toFixed(2) + \'s\';\n'+
    '        line.appendChild(sp);\n'+
    '        wi++;\n'+
    '      });\n'+
    '    });\n'+
    '  })();\n'+
    '  requestAnimationFrame(function(){ requestAnimationFrame(function(){ kv.classList.add(\'ready\'); }); });\n'+
    '  var kvIn = document.getElementById(\'kvIn\');\n'+
    '  var kvSub = document.getElementById(\'kvSub\');\n'+
    '  var kvOv = document.getElementById(\'kvOv\');\n'+
    '  var kvVid = kv.querySelector(\'.ph video\');\n'+
    '  var kvMeta = kv.querySelector(\'.kvmeta\');\n'+
    '\n'+
    '  function clamp01(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }\n'+
    '  function kvScrub(){\n'+
    '    var p = clamp01(scrollY / (kv.offsetHeight - vh));\n'+
    '    var t = clamp01((p - 0.22) / 0.16);\n'+
    '    kvIn.style.opacity = String(1 - t);\n'+
    '    kvIn.style.transform = \'translateY(-20px) scale(\' + (1 - 0.22 * t).toFixed(4) + \')\';\n'+
    '    kvIn.style.pointerEvents = t > 0.6 ? \'none\' : \'auto\';\n'+
    '    var q = clamp01((p - 0.28) / 0.24);\n'+
    '    var e = 1 - Math.pow(1 - q, 3);\n'+
    '    kvOv.style.opacity = String(0.66 + 0.26 * e); /* 축소 없이 풀블리드 유지, 어두워지며 멘트 무대 준비 */\n'+
    '    if (kvVid) kvVid.style.filter = \'blur(\' + (12 * e).toFixed(1) + \'px)\'; /* 멘트 가독 — 배경 블러 */\n'+
    '    var s = clamp01((p - 0.4) / 0.14), se = 1 - Math.pow(1 - s, 3);\n'+
    '    kvSub.style.opacity = String(se);\n'+
    '    kvSub.style.transform = \'scale(\' + (0.75 + 0.25 * se).toFixed(4) + \')\';\n'+
    '    kvMeta.style.transition = \'none\';\n'+
    '    kvMeta.style.opacity = String(.7 * (1 - se));\n'+
    '  }\n'+
    '\n'+
    '  // 독: KV 지난 뒤 등장, 레지스터 도달 시 퇴장\n'+
    '  var dock = document.getElementById(\'dock\');\n'+
    '  var reg = document.getElementById(\'register\');\n'+
    '  function dockTick(){\n'+
    '    var past = scrollY > kv.offsetHeight - vh * 0.5;\n'+
    '    var nearReg = reg.getBoundingClientRect().top < vh * 0.85;\n'+
    '    dock.classList.toggle(\'on\', past && !nearReg);\n'+
    '  }\n'+
    '\n'+
    '  var ticking = false;\n'+
    '  function onScroll(){\n'+
    '    if (ticking) return;\n'+
    '    ticking = true;\n'+
    '    requestAnimationFrame(function(){\n'+
    '      ticking = false;\n'+
    '      gnb.classList.toggle(\'solid\', scrollY > vh * 0.9);\n'+
    '      snavTick();\n'+
    '      if (!reduce) kvScrub();\n'+
    '      dockTick();\n'+
    '    });\n'+
    '  }\n'+
    '  addEventListener(\'scroll\', onScroll, { passive: true });\n'+
    '  onScroll();\n'+
    '\n'+
    '  // 섹션 타이틀 — 단어 단위 스태거 등장(toss.im 참고): rv 제거 → wt + 단어 span 분해\n'+
    '  document.querySelectorAll(\'h2.tt.rv, .answer h2.rv\').forEach(function(h2){\n'+
    '    h2.classList.remove(\'rv\');\n'+
    '    h2.classList.add(\'wt\');\n'+
    '    var wi = 0;\n'+
    '    function splitIn(host){\n'+
    '      Array.prototype.slice.call(host.childNodes).forEach(function(nd){\n'+
    '        if (nd.nodeType === 1 && nd.classList.contains(\'gt\')) {\n'+
    '          /* 그라 어구는 통째로 하나의 유닛으로 등장(클립 유지) */\n'+
    '          nd.style.transitionDelay = (wi * 0.07) + \'s\';\n'+
    '          wi += (nd.textContent.trim().split(/\\s+/).length || 1);\n'+
    '          return;\n'+
    '        }\n'+
    '        if (nd.nodeType === 1 && nd.tagName === \'SPAN\') { splitIn(nd); return; } /* 줄 웨이트 래퍼 내부도 분해 */\n'+
    '        if (nd.nodeType !== 3) return; /* <br> 등 요소는 그대로 유지 */\n'+
    '        var frag = document.createDocumentFragment();\n'+
    '        var parts = nd.textContent.split(/\\s+/);\n'+
    '        var added = false;\n'+
    '        parts.forEach(function(word){\n'+
    '          if (!word) return;\n'+
    '          if (added) frag.appendChild(document.createTextNode(\' \'));\n'+
    '          var sp = document.createElement(\'span\');\n'+
    '          sp.className = \'w\';\n'+
    '          sp.textContent = word;\n'+
    '          sp.style.transitionDelay = (wi * 0.07) + \'s\';\n'+
    '          wi++;\n'+
    '          frag.appendChild(sp);\n'+
    '          added = true;\n'+
    '        });\n'+
    '        host.replaceChild(frag, nd);\n'+
    '      });\n'+
    '    }\n'+
    '    splitIn(h2);\n'+
    '  });\n'+
    '\n'+
    '  // 리빌 + 말풍선 + 벤토 IO\n'+
    '  var io = new IntersectionObserver(function(es){\n'+
    '    es.forEach(function(en){\n'+
    '      if (!en.isIntersecting) return;\n'+
    '      en.target.classList.add(en.target.classList.contains(\'rv\') ? \'on\' : \'active\');\n'+
    '      io.unobserve(en.target);\n'+
    '    });\n'+
    '  }, { threshold: 0.12 });\n'+
    '  document.querySelectorAll(\'.rv\').forEach(function(el){ io.observe(el); });\n'+
    '  document.querySelectorAll(\'h2.wt\').forEach(function(el){ io.observe(el); });\n'+
    '  var acardsEl = document.getElementById(\'acards\');\n'+
    '  if (acardsEl) io.observe(acardsEl);\n'+
    '\n'+
    '  // 앤서 카드 — 우하단 배지가 마우스를 부드럽게 따라옴(이탈 시 원위치)\n'+
    '  (function(){\n'+
    '    var cards = document.querySelectorAll(\'.answer .card\');\n'+
    '    if (!cards.length || reduce) return;\n'+
    '    Array.prototype.forEach.call(cards, function(card){\n'+
    '      var go = card.querySelector(\'.go\');\n'+
    '      if (!go) return;\n'+
    '      var tx = 0, ty = 0, cx = 0, cy = 0, raf = false;\n'+
    '      function step(){\n'+
    '        cx += (tx - cx) * .05; cy += (ty - cy) * .05;\n'+
    '        go.style.transform = \'translate3d(\' + cx.toFixed(1) + \'px,\' + cy.toFixed(1) + \'px,0)\';\n'+
    '        if (Math.abs(tx - cx) > .4 || Math.abs(ty - cy) > .4) requestAnimationFrame(step);\n'+
    '        else raf = false;\n'+
    '      }\n'+
    '      function kick(){ if (!raf) { raf = true; requestAnimationFrame(step); } }\n'+
    '      card.addEventListener(\'mousemove\', function(e){\n'+
    '        var r = card.getBoundingClientRect();\n'+
    '        /* 커서를 덮지 않게 커서 우측아래(+14px)에 배지가 위치하도록 델타 계산 */\n'+
    '        tx = (e.clientX - r.left) + 14 - (r.width - 26 - 52);\n'+
    '        ty = (e.clientY - r.top) + 14 - (r.height - 26 - 52);\n'+
    '        kick();\n'+
    '      });\n'+
    '      card.addEventListener(\'mouseleave\', function(){ tx = 0; ty = 0; kick(); });\n'+
    '    });\n'+
    '  })();\n'+
    '\n'+
    '  // 7.5 어젠다 — 리스트 렌더 + 클릭 시 우측 드로어(내용은 실측 카피 재구성)\n'+
    '  var AGENDA = window.__ensolAgenda || [];\n'+
    '  var alist = document.getElementById(\'alist\');\n'+
    '  if (alist) {\n'+
    '  AGENDA.forEach(function(a, i){\n'+
    '    var li = document.createElement(\'li\');\n'+
    '    li.innerHTML = \'<span class="at df">\' + a.t + \'</span><div class="am"><b>\' + a.title + \'</b><span>\' + a.spk + \'</span></div><span class="chev">→</span>\';\n'+
    '    li.addEventListener(\'click\', function(){ openDrawer(i); });\n'+
    '    alist.appendChild(li);\n'+
    '  });\n'+
    '  var adrawer = document.getElementById(\'adrawer\'), adim = document.getElementById(\'adim\');\n'+
    '  function openDrawer(i){\n'+
    '    var a = AGENDA[i];\n'+
    '    document.getElementById(\'adtime\').textContent = a.t + \' (GMT)\';\n'+
    '    document.getElementById(\'adtitle\').textContent = a.title;\n'+
    '    document.getElementById(\'adspk\').textContent = a.spk;\n'+
    '    var dm = document.getElementById(\'admedia\');\n'+
    '    dm.innerHTML = a.vid\n'+
    '      ? \'<video src="\' + a.vid + \'" muted autoplay loop playsinline></video>\'\n'+
    '      : \'<img src="\' + a.img + \'" alt="">\';\n'+
    '    document.getElementById(\'adtxt\').textContent = a.txt;\n'+
    '    document.getElementById(\'adpoints\').innerHTML = a.pts.map(function(p){ return \'<li>\' + p + \'</li>\'; }).join(\'\');\n'+
    '    adCur = i;\n'+
    '    document.getElementById(\'adidx\').textContent = (i + 1) + \' / \' + AGENDA.length;\n'+
    '    document.getElementById(\'adprev\').disabled = i === 0;\n'+
    '    document.getElementById(\'adnext\').disabled = i === AGENDA.length - 1;\n'+
    '    if (adrawer.classList.contains(\'on\')) { /* 열린 채 넘길 때 콘텐츠 페이드 */\n'+
    '      adrawer.classList.remove(\'swap\');\n'+
    '      void adrawer.offsetWidth;\n'+
    '      adrawer.classList.add(\'swap\');\n'+
    '    }\n'+
    '    adrawer.classList.add(\'on\'); adim.classList.add(\'on\');\n'+
    '    adrawer.setAttribute(\'aria-hidden\', \'false\');\n'+
    '  }\n'+
    '  var adCur = 0;\n'+
    '  document.getElementById(\'adprev\').addEventListener(\'click\', function(){ if (adCur > 0) openDrawer(adCur - 1); });\n'+
    '  document.getElementById(\'adnext\').addEventListener(\'click\', function(){ if (adCur < AGENDA.length - 1) openDrawer(adCur + 1); });\n'+
    '  function closeDrawer(){\n'+
    '    adrawer.classList.remove(\'on\'); adim.classList.remove(\'on\');\n'+
    '    adrawer.setAttribute(\'aria-hidden\', \'true\');\n'+
    '  }\n'+
    '  adim.addEventListener(\'click\', closeDrawer);\n'+
    '  document.getElementById(\'adclose\').addEventListener(\'click\', closeDrawer);\n'+
    '  addEventListener(\'keydown\', function(e){ if (e.key === \'Escape\') closeDrawer(); });\n'+
    '  }\n'+
    '\n'+
    '  // 6. 스킬 탭 — 하단 프로그레스가 차면 자동으로 다음 탭\n'+
    '  var skillTabsEl = document.getElementById(\'skillTabs\');\n'+
    '  if (skillTabsEl) {\n'+
    '  var tabs = skillTabsEl.children;\n'+
    '  var panes = document.getElementById(\'skillPanes\').children;\n'+
    '  var TAB_MS = 6000, curTab = 0, tabStart = performance.now(), skillVisible = false;\n'+
    '  var progs = [];\n'+
    '  Array.prototype.forEach.call(tabs, function(btn, i){\n'+
    '    var pr = document.createElement(\'i\');\n'+
    '    pr.className = \'prog\';\n'+
    '    btn.appendChild(pr);\n'+
    '    progs.push(pr);\n'+
    '    btn.addEventListener(\'click\', function(){ setTab(i); });\n'+
    '  });\n'+
    '  function setTab(i){\n'+
    '    curTab = i;\n'+
    '    tabStart = performance.now();\n'+
    '    for (var j = 0; j < tabs.length; j++){\n'+
    '      tabs[j].classList.toggle(\'active\', j === i);\n'+
    '      panes[j].classList.toggle(\'onv\', j === i);\n'+
    '      progs[j].style.width = \'0\';\n'+
    '    }\n'+
    '  }\n'+
    '  var skillSec = document.getElementById(\'skill\');\n'+
    '  new IntersectionObserver(function(es){\n'+
    '    es.forEach(function(en){\n'+
    '      skillVisible = en.isIntersecting;\n'+
    '      if (skillVisible) tabStart = performance.now();\n'+
    '    });\n'+
    '  }, { threshold: 0.35 }).observe(skillSec);\n'+
    '  if (!reduce) {\n'+
    '    (function tabLoop(){\n'+
    '      if (skillVisible) {\n'+
    '        var r = (performance.now() - tabStart) / TAB_MS;\n'+
    '        if (r >= 1) setTab((curTab + 1) % tabs.length);\n'+
    '        else progs[curTab].style.width = (r * 100).toFixed(2) + \'%\';\n'+
    '      }\n'+
    '      requestAnimationFrame(tabLoop);\n'+
    '    })();\n'+
    '  } else {\n'+
    '    progs[0].style.width = \'100%\';\n'+
    '  }\n'+
    '  }\n'+
    '\n'+
    '  // 데이터 웨이브 팔레트(프라이머리 그린 + 서브 블루)\n'+
    '  var WAVE_COLS = [\'#C4D8F0\', \'#4ea0ff\', \'#3186ff\', \'#346bf0\'];\n'+
    '\n'+
    '  // 8. 폼 → 감사 메시지 (정적 시안: 전송 없음)\n'+
    '  var regFormEl = document.getElementById(\'regForm\');\n'+
    '  if (regFormEl) regFormEl.addEventListener(\'submit\', function(e){\n'+
    '    e.preventDefault();\n'+
    '    document.getElementById(\'register\').classList.add(\'submitted\');\n'+
    '  });\n'+
    '\n'+
    '  // 10. 데이터 지형 웨이브(퍼스펙티브 점 그리드 + 마우스 융기 + 무빙 그라데이션) — 공용\n'+
    '  function initWave(cv, sec, horizonRatio){\n'+
    '    if (!cv) return;\n'+
    '    var ctx2 = cv.getContext(\'2d\');\n'+
    '    var dpr = Math.min(window.devicePixelRatio || 1, 2);\n'+
    '    var W = 0, H = 0, running = false;\n'+
    '    function wResize(){\n'+
    '      W = sec.clientWidth; H = sec.clientHeight;\n'+
    '      cv.width = W * dpr; cv.height = H * dpr;\n'+
    '      cv.style.width = W + \'px\'; cv.style.height = H + \'px\';\n'+
    '      ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);\n'+
    '    }\n'+
    '    wResize(); addEventListener(\'resize\', wResize);\n'+
    '    var mx = -1e4, my = -1e4, smx = -1e4, smy = -1e4;\n'+
    '    sec.addEventListener(\'mousemove\', function(e){\n'+
    '      var r = cv.getBoundingClientRect();\n'+
    '      mx = e.clientX - r.left; my = e.clientY - r.top;\n'+
    '    });\n'+
    '    sec.addEventListener(\'mouseleave\', function(){ mx = -1e4; my = -1e4; });\n'+
    '    var ROWS = 44, COLS = 130;\n'+
    '    var acc = [];\n'+
    '    for (var i = 0; i < ROWS * COLS; i++){\n'+
    '      var rr = Math.random();\n'+
    '      acc.push(rr < 0.013 ? 1 : rr < 0.033 ? 2 : 0);\n'+
    '    }\n'+
    '    function fld(u, d, t){\n'+
    '      var x = u * 6.283;\n'+
    '      return Math.sin(x * 1.7 + t * .55 + d * 5.2) * .45\n'+
    '           + Math.sin(x * 3.9 - t * .38 + d * 9.5) * .25\n'+
    '           + Math.sin(x * 8.3 + t * .22 + Math.sin(d * 7 + t * .3) * 2) * .14\n'+
    '           + Math.sin((x + d * 12) * 2.6 - t * .3) * .16;\n'+
    '    }\n'+
    '    function rowY(d){ return H * horizonRatio + Math.pow(d, 1.35) * (H - H * horizonRatio - 30); }\n'+
    '    function rowAmp(d){ return 18 + 150 * Math.pow(d, 1.6); }\n'+
    '    function colX(u, d){ return W / 2 + (u - .5) * W * (0.72 + (.25 + Math.pow(d, 1.55) * .75) * 0.6); }\n'+
    '    var t0 = performance.now();\n'+
    '    function wDraw(now){\n'+
    '      if (!running) return;\n'+
    '      var t = (now - t0) / 1000;\n'+
    '      smx += (mx - smx) * .08; smy += (my - smy) * .08;\n'+
    '      ctx2.clearRect(0, 0, W, H);\n'+
    '      for (var ri = 0; ri < ROWS; ri++){\n'+
    '        var d = ri / (ROWS - 1);\n'+
    '        var y0 = rowY(d), amp = rowAmp(d);\n'+
    '        var alpha = .15 + d * .5;\n'+
    '        var size = .8 + d * 1.7;\n'+
    '        for (var ci = 0; ci < COLS; ci++){\n'+
    '          var u = ci / (COLS - 1);\n'+
    '          var px = colX(u, d);\n'+
    '          if (px < -8 || px > W + 8) continue;\n'+
    '          var h = fld(u, d, t) * amp;\n'+
    '          var dx = px - smx, dy = y0 - smy;\n'+
    '          var dist2 = dx * dx + dy * dy;\n'+
    '          if (dist2 < 170000) h -= Math.exp(-dist2 / 36000) * 90 * (0.4 + d);\n'+
    '          var a = acc[ri * COLS + ci];\n'+
    '          ctx2.fillStyle = \'rgba(255,255,255,\' + (a ? Math.min(1, alpha + .3) : alpha) + \')\';\n'+
    '          ctx2.fillRect(px, y0 - h, size, size);\n'+
    '        }\n'+
    '      }\n'+
    '      /* 무빙 그라데이션 착색 — 점 픽셀에만(source-in) */\n'+
    '      var gx = Math.cos(t * .18) * W * .4, gy = Math.sin(t * .14) * H * .3;\n'+
    '      var grad = ctx2.createLinearGradient(W * .5 - gx, H * .5 - gy, W * .5 + gx + W * .5, H * .5 + gy);\n'+
    '      var sh = (t * .06) % 1;\n'+
    '      grad.addColorStop(0, WAVE_COLS[0]);\n'+
    '      grad.addColorStop(Math.max(0, Math.min(1, (.25 + sh * .5))), WAVE_COLS[1]);\n'+
    '      grad.addColorStop(Math.max(0, Math.min(1, (.55 + sh * .4))), WAVE_COLS[2]);\n'+
    '      grad.addColorStop(1, WAVE_COLS[3]);\n'+
    '      ctx2.globalCompositeOperation = \'source-in\';\n'+
    '      ctx2.fillStyle = grad;\n'+
    '      ctx2.fillRect(0, 0, W, H);\n'+
    '      ctx2.globalCompositeOperation = \'source-over\';\n'+
    '      requestAnimationFrame(wDraw);\n'+
    '    }\n'+
    '    if (reduce) {\n'+
    '      running = true;\n'+
    '      requestAnimationFrame(function(n){ wDraw(n); running = false; });\n'+
    '    } else {\n'+
    '      new IntersectionObserver(function(es){\n'+
    '        es.forEach(function(en){\n'+
    '          var was = running;\n'+
    '          running = en.isIntersecting;\n'+
    '          if (running && !was) requestAnimationFrame(wDraw);\n'+
    '        });\n'+
    '      }, { threshold: .05 }).observe(sec);\n'+
    '    }\n'+
    '  }\n'+
    '  var waveEl = document.getElementById(\'wave\'), freeEl = document.getElementById(\'free\');\n'+
    '  if (waveEl && freeEl) initWave(waveEl, freeEl, .16);\n'+
    '\n'+
    '  // 9. FAQ 아코디언\n'+
    '  document.querySelectorAll(\'#faqList .item\').forEach(function(item){\n'+
    '    var q = item.querySelector(\'.q\'), a = item.querySelector(\'.a\');\n'+
    '    q.addEventListener(\'click\', function(){\n'+
    '      var open = item.classList.toggle(\'open\');\n'+
    '      a.style.height = open ? (a.scrollHeight + 30) + \'px\' : \'0\';\n'+
    '    });\n'+
    '  });\n'+
    '';

  window.renderEnsolPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    d.images = shared.images || {};
    var motion = opts.motion !== false;
    var T = TT[LANG] || TT.ko;
    function tp(s) { return String(s || '').replace(/\{p\}/g, d.productName); }
    /* 타이틀 2줄 강약: 첫 줄 lw(500) + 마지막 줄 hw(700) */
    function twoLine(s, dePath) {
      var lines = String(s || '').split('\n');
      if (lines.length === 1) return '<span class="hw"' + de(dePath) + '>' + esc(s) + '</span>';
      var last = lines.pop();
      return '<span class="lw"' + (dePath ? ' data-edit="' + dePath + '"' : '') + '>' + lines.map(esc).join('<br>') + '</span><br><span class="hw">' + esc(last) + '</span>';
    }

    /* 섹션 베리에이션 — 팩 키(shared.variants.answer 등) 우선, compose-web 공용 enum 번역 보조 */
    var V0 = shared.variants || {};
    var V = {
      answer: V0.answer || (V0.feature === 'bento' ? 'bento' : 'cards'),
      skill: V0.skill || (V0.feature === 'list' ? 'list' : 'tabs'),
      agenda: V0.agenda === 'table' ? 'table' : 'list',
      faq: V0.faq === 'twocol' ? 'twocol' : 'accordion',
      feature: V0.feature === 'cards' || V0.feature === 'icons' ? 'grid' : (V0.featureGrid ? 'grid' : (V0.feature === 'grid' ? 'grid' : 'sticky')),
      free: (V0.cta === 'banner' || V0.free === 'band') ? 'band' : 'wave',
    };
    if (V0.answer) V.answer = V0.answer;
    if (V0.skill) V.skill = V0.skill;
    if (V0.feature === 'sticky' || V0.feature === 'grid') V.feature = V0.feature;

    var SEC = {};

    /* ── answer — 키비주얼 카드(features 0-2) ── */
    var feats = (Array.isArray(d.features) && d.features.length ? d.features : BD.features).slice(0, 3);
    var feats4 = (Array.isArray(d.features) && d.features.length ? d.features : BD.features).slice(0, 4);
    var ansTitle = '<h2 class="tt df rv"><span class="lw">' + esc(T.ansPre) + '</span><br><span class="hw"' + de('productName') + '>' + esc(d.productName) + '</span></h2>';
    if (V.answer === 'bento') {
      SEC.answer = '<section class="answer" id="answer" data-section="answer" style="margin-top:0"><div class="wrap">' + ansTitle +
        '<div class="eg-bento">' + feats4.map(function (f, i) {
          return '<div class="bcard">' + imSlot(d, 'answer' + i, KV_ROT[i % KV_ROT.length]) +
            '<div class="bt"><span' + de('features.' + i + '.title') + '>' + ml(f.title) + '</span>' +
            '<p' + de('features.' + i + '.desc') + '>' + ml(f.desc) + '</p></div></div>';
        }).join('') + '</div></div></section>';
    }
    else SEC.answer = '<section class="answer" id="answer" data-section="answer"><div class="wrap">' + ansTitle +
      '<ul class="cards" id="acards">' + feats.map(function (f, i) {
        return '<li class="card">' + imSlot(d, 'answer' + i, KV_ROT[i % KV_ROT.length]) +
          '<div class="ctx"><b class="df"' + de('features.' + i + '.title') + '>' + ml(f.title) + '</b>' +
          '<p' + de('features.' + i + '.desc') + '>' + ml(f.desc) + '</p></div><span class="go">→</span></li>';
      }).join('') + '</ul></div></section>';

    /* ── skill — 탭(zigs) ── */
    var zz = (Array.isArray(d.zigs) && d.zigs.length ? d.zigs : BD.zigs).slice(0, 5);
    var sklTitle = '<h2 class="tt df rv"><span class="lw">' + esc(T.sklPre) + '</span><br><span class="hw">' + esc(tp(T.sklPost)) + '</span></h2>';
    if (V.skill === 'list') {
      SEC.skill = '<section class="skill" id="skill" data-section="skill"><div class="wrap">' + sklTitle +
        '<div class="eg-vskill rv"><ul id="vsList">' + zz.map(function (z, i) {
          return '<li class="' + (i === 0 ? 'on' : '') + '"' + de('zigs.' + i + '.cap') + '>' + esc(z.cap || z.title) + '</li>';
        }).join('') + '</ul><div class="vis">' + imSlot(d, 'skill0', SKILL_ROT[0], ' id="vsImg"') + '</div></div>' +
        zz.map(function (z, i) {
          return '<p class="eg-vsdesc" data-vsd="' + i + '"' + (i === 0 ? '' : ' style="display:none"') + de('zigs.' + i + '.desc') + '>' + ml(z.desc) + '</p>';
        }).join('') + '</div></section>';
    }
    else SEC.skill = '<section class="skill" id="skill" data-section="skill"><div class="wrap">' + sklTitle +
      '<div class="tabs rv" id="skillTabs">' + zz.map(function (z, i) {
        return '<button class="' + (i === 0 ? 'active' : '') + '"' + de('zigs.' + i + '.cap') + '>' + esc(z.cap || z.title) + '</button>';
      }).join('') + '</div>' +
      '<div id="skillPanes" class="rv">' + zz.map(function (z, i) {
        return '<div class="pane' + (i === 0 ? ' onv' : '') + '"><div class="tb">' +
          '<strong class="df"' + de('zigs.' + i + '.title') + '>' + ml(z.title) + '</strong>' +
          '<p' + de('zigs.' + i + '.desc') + '>' + ml(z.desc) + '</p></div>' +
          imSlot(d, 'skill' + i, SKILL_ROT[i % SKILL_ROT.length]) + '</div>';
      }).join('') + '</div></div></section>';

    /* ── feature — 좌 sticky + 혜택(benefits) ── */
    var bens = (Array.isArray(d.benefits) && d.benefits.length ? d.benefits : BD.benefits).slice(0, 3);
    if (V.feature === 'grid') {
      SEC.feature = '<section class="feature" id="feature" data-section="feature"><div class="wrap">' +
        '<h2 class="tt df rv" style="text-align:center">' + ml(tp(T.featT)) + '</h2>' +
        '<div class="eg-fgrid">' + bens.map(function (b, i) {
          return '<div class="fc rv">' + imSlot(d, 'feature' + i, FEAT_ROT[i % FEAT_ROT.length]) +
            '<div class="bd"><b' + de('benefits.' + i + '.title') + '>' + ml(b.title) + '</b>' +
            '<p' + de('benefits.' + i + '.link') + '>' + esc(b.cap ? b.cap + ' · ' : '') + esc(b.link || '') + '</p></div></div>';
        }).join('') + '</div></div></section>';
    }
    else SEC.feature = '<section class="feature" id="feature" data-section="feature"><div class="wrap"><div class="fgrid">' +
      '<div class="fleft"><h2 class="tt df rv">' + ml(tp(T.featT)) + '</h2><p class="sub rv">' + esc(T.featS) + '</p></div>' +
      '<div class="fright">' + bens.map(function (b, i) {
        return '<div class="fitem rv"><b class="df"' + de('benefits.' + i + '.title') + '>' + ml(b.title) + '</b>' +
          '<p' + de('benefits.' + i + '.link') + '>' + esc(b.cap ? b.cap + ' · ' : '') + esc(b.link || '') + '</p>' +
          '<div class="fcard">' + imSlot(d, 'feature' + i, FEAT_ROT[i % FEAT_ROT.length]) + '</div></div>';
      }).join('') + '</div></div></div></section>';

    /* ── agenda — 리스트+드로어 | 시간표(sessions) ── */
    var ses = (Array.isArray(d.sessions) && d.sessions.length ? d.sessions : BD.sessions).slice(0, 8);
    var agdHead = '<h2 class="tt df rv">' + esc(T.agdT) + '</h2>' +
      '<p class="asub rv"' + de('eventDate') + '>' + esc(d.eventDate) + '</p>';
    if (V.agenda === 'table') {
      SEC.agenda = '<section class="agenda" id="agenda" data-section="agenda"><div class="wrap">' + agdHead +
        ses.map(function (s0, i) {
          return '<div class="eg-tt2"><span class="t df"' + de('sessions.' + i + '.time') + '>' + esc(s0.time) + '</span>' +
            '<b' + de('sessions.' + i + '.title') + '>' + esc(s0.title) + '</b>' +
            '<span class="s"' + de('sessions.' + i + '.by') + '>' + esc(s0.by) + '</span></div>';
        }).join('') + '</div></section>';
    }
    else SEC.agenda = '<section class="agenda" id="agenda" data-section="agenda"><div class="wrap">' + agdHead +
      '<ul class="alist rv" id="alist"></ul></div></section>';

    /* ── faq ── */
    var fq = (Array.isArray(d.faq) && d.faq.length ? d.faq : BD.faq).slice(0, 8);
    var chev = '<span class="ar"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    function faqItem(f, i) {
      return '<div class="item"><button class="q"><span' + de('faq.' + i + '.q') + '>' + esc(f.q) + '</span>' + chev + '</button>' +
        '<div class="a"><span' + de('faq.' + i + '.a') + '>' + ml(f.a) + '</span></div></div>';
    }
    if (V.faq === 'twocol') {
      var half = Math.ceil(fq.length / 2);
      SEC.faq = '<section class="faq" id="faq" data-section="faq"><div class="wrap">' +
        '<h2 class="tt df rv">FAQ</h2><div class="eg-faq2" id="faqList">' +
        '<div>' + fq.slice(0, half).map(function (f, i) { return faqItem(f, i); }).join('') + '</div>' +
        '<div>' + fq.slice(half).map(function (f, i) { return faqItem(f, half + i); }).join('') + '</div>' +
        '</div></div></section>';
    }
    else SEC.faq = '<section class="faq" id="faq" data-section="faq"><div class="wrap">' +
      '<h2 class="tt df rv">FAQ</h2><div id="faqList" class="rv">' + fq.map(function (f, i) {
        return '<div class="item"><button class="q"><span' + de('faq.' + i + '.q') + '>' + esc(f.q) + '</span>' + chev + '</button>' +
          '<div class="a"><span' + de('faq.' + i + '.a') + '>' + ml(f.a) + '</span></div></div>';
      }).join('') + '</div></div></section>';

    /* ── free — 웨이브 CTA ── */
    var freeTitle = (function () {
      var lines = String(d.ctaTitle || '').split('\n');
      if (lines.length === 1) return '<span class="gt"' + de('ctaTitle') + '>' + esc(d.ctaTitle) + '</span>';
      var last = lines.pop();
      return '<span data-edit="ctaTitle">' + lines.map(esc).join('<br>') + '</span><br><span class="gt">' + esc(last) + '</span>';
    })();
    if (V.free === 'band') {
      SEC.free = '<section class="free eg-band" id="free" data-section="free"><div class="wrap">' +
        '<h2 class="tt df rv" style="color:#fff">' + ml(d.ctaTitle) + '</h2>' +
        '<p class="rv"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
        '<div class="gbtn rv"><a class="white" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>' +
        '</div></section>';
    }
    else SEC.free = '<section class="free" id="free" data-section="free"><canvas id="wave" aria-hidden="true"></canvas><div class="wrap">' +
      '<h2 class="tt df rv">' + (function () {
        var lines = String(d.ctaTitle || '').split('\n');
        if (lines.length === 1) return '<span class="gt"' + de('ctaTitle') + '>' + esc(d.ctaTitle) + '</span>';
        var last = lines.pop();
        return '<span data-edit="ctaTitle">' + lines.map(esc).join('<br>') + '</span><br><span class="gt">' + esc(last) + '</span>';
      })() + '</h2>' +
      '<p class="rv"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
      '<div class="gbtn rv"><a class="lime" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + ' <span class="arr">→</span></a></div>' +
      '</div></section>';

    /* ── 섹션 조립 ── */
    var ORDER = ['answer', 'skill', 'feature', 'agenda', 'faq', 'free'];
    var savedOrd = (Array.isArray(shared.sectionOrder) ? shared.sectionOrder : []).filter(function (k) { return SEC[k]; });
    var ordAll = savedOrd.concat(ORDER.filter(function (k) { return savedOrd.indexOf(k) < 0 && SEC[k]; }));
    var hidden = shared.hiddenSections || [];
    var bodySecs = ordAll.filter(function (k) { return hidden.indexOf(k) < 0; }).map(function (k) { return SEC[k]; }).join('');

    /* ── 고정 프레임 — GNB·KV(+미션)·register·footer·dock·드로어 ── */
    var navAnchors = ['#answer', '#skill', '#agenda', '#register'];
    var gnbHtml = '<nav class="snav" id="snav" aria-label="Sections"></nav>' +
      '<header class="gnb" id="gnb"><div class="in">' +
      '<a class="logo df" href="#top"' + de('navTitle') + '>' + esc(d.navTitle) + '</a>' +
      '<nav>' + (d.navLinks || []).slice(0, 4).map(function (l, i) { return '<a href="' + navAnchors[i % 4] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</nav>' +
      '<a class="cta" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></header>';

    var h1lines = String(d.tagline || '').split('\n').map(function (ln) { return '<span class="l">' + esc(ln) + '</span>'; }).join('');
    var kvHtml = '<section class="kv" id="top">' +
      '<div class="stick">' +
      '<div class="ph" id="kvPhoto"><video src="https://resource.midasuser.com/hubfs/midasSquare24/vod/vod_invite.mp4" autoplay muted loop playsinline onerror="this.onerror=null;this.src=\'' + att('ensol-hero.mp4') + '\'"></video></div>' +
      '<div class="ov" id="kvOv"></div>' +
      '<div class="sheen" aria-hidden="true"><i></i><i class="s2"></i></div>' +
      '<div class="in" id="kvIn">' +
      '<h1 class="df" id="kvTitle"' + de('tagline') + '>' + h1lines + '</h1>' +
      '<p class="klead ent d2"' + de('subcopy') + '>' + ml(d.subcopy) + '</p>' +
      '<div class="gbtn ent d4"><a class="white" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></div>' +
      '<div class="kvmeta ent d4">' +
      '<span' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<span class="mid"' + de('eventDate') + '>' + esc(d.eventDate) + '</span>' +
      '<span' + de('bannerText') + '>' + esc(d.bannerText) + '</span></div>' +
      '<div class="sub2" id="kvSub"><div class="tx">' +
      '<span class="eb">' + esc(tp(T.msnEb)) + '</span>' +
      '<p>' + gt(T.msn1) + '</p><p>' + gt(tp(T.msn2)) + '</p>' +
      '</div></div></div></section>';

    var regHtml = '<section class="register" id="register"><div class="wrap">' +
      '<h2 class="tt df rv"><span' + de('productName') + '>' + esc(d.productName) + '</span><br><span class="gt"' + de('formTitle') + '>' + esc(d.formTitle) + '</span></h2>' +
      '<div class="time rv"><span class="df"' + de('deadline') + '>' + esc(d.deadline) + '</span><span class="bar"></span><span' + de('eventDate') + '>' + esc(d.eventDate) + '</span></div>' +
      '<form id="regForm" class="rv" autocomplete="off">' +
      [['rf-name', T.fName, 'text', 1], ['rf-email', T.fEmail, 'email', 1], ['rf-company', T.fCompany, 'text', 1], ['rf-job', T.fJob, 'text', 0], ['rf-phone', T.fPhone, 'tel', 0], ['rf-country', T.fCountry, 'text', 1]].map(function (f) {
        return '<div class="fld"><input type="' + f[2] + '" id="' + f[0] + '" placeholder=" "' + (f[3] ? ' required' : '') + '><label for="' + f[0] + '">' + esc(f[1]) + '</label></div>';
      }).join('') +
      '<div class="fld full"><input type="text" id="rf-industry" placeholder=" "><label for="rf-industry">' + esc(T.fIndustry) + '</label></div>' +
      '<button type="submit"><span class="bt"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</span></button></form>' +
      '<div class="done"><h4 class="df">' + esc(T.done1) + '</h4><p>' + ml(T.done2) + '</p></div>' +
      '</div></section>';

    var footHtml = '<footer><div class="wrap"><div class="row">' +
      '<b class="df"' + de('footerBrand') + '>' + esc(d.footerBrand) + '</b>' +
      '<span' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span></div></div></footer>';

    var dockHtml = (shared.hiddenSections || []).indexOf('dock') >= 0 ? '' :
      '<div class="dock" id="dock" data-section="dock"><div class="tx">' +
      '<b' + de('bannerCta') + '>' + esc(d.bannerCta) + '</b>' +
      '<i' + de('eventDate') + '>' + esc(d.eventDate) + '</i></div>' +
      '<a class="go" href="#register"' + de('primaryCta') + '>' + esc(d.primaryCta) + ' →</a></div>';

    var drawerHtml = (hidden.indexOf('agenda') >= 0 || V.agenda === 'table') ? '' :
      '<div class="adim" id="adim"></div>' +
      '<aside class="adrawer" id="adrawer" aria-hidden="true">' +
      '<button class="dclose" id="adclose" aria-label="Close">×</button>' +
      '<span class="dtime df" id="adtime"></span><h4 class="df" id="adtitle"></h4><span class="dspk" id="adspk"></span>' +
      '<div class="dmedia" id="admedia"></div><p class="dtxt" id="adtxt"></p><ul class="dpoints" id="adpoints"></ul>' +
      '<div class="dnav"><button type="button" class="dn" id="adprev">← Prev</button><span id="adidx"></span><button type="button" class="dn" id="adnext">Next →</button></div></aside>';

    /* 드로어 데이터 주입 — 세션 + 이미지 로테이션 */
    var agData = ses.map(function (s0, i) {
      return { t: s0.time || '', title: s0.title || '', spk: s0.by || '', img: att(SKILL_ROT[i % SKILL_ROT.length]), txt: s0.desc || '', pts: [] };
    });
    var agJson = JSON.stringify(agData).replace(/</g, '\\u003c').replace(/<\/script/gi, '<\\/script');

    var title = (d.productName || 'Ensol MBM') + ' — ' + (d.formTitle || 'Webinar');
    return '<!doctype html><html lang="' + LANG + '"' + (motion ? '' : ' class="nomo"') + '><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' + esc(title) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      '<style>' + CSS + (motion ? '' : '\n.nomo .rv,.nomo .kv .ent,.nomo h2.wt .w,.nomo h2.wt .gt,.nomo .answer .card{opacity:1 !important;transform:none !important;transition:none !important}') + '</style></head>' +
      '<body>' + gnbHtml + kvHtml + bodySecs + regHtml + footHtml + dockHtml + drawerHtml +
      '<script>window.__ensolAgenda=' + agJson + ';<\/script>' +
      (V.skill === 'list' ? '<script>(function(){var l=document.getElementById("vsList");if(!l)return;var im=document.getElementById("vsImg");var imgs=' + JSON.stringify(zz.map(function (z, i) { return (d.images && d.images['skill' + i]) || att(SKILL_ROT[i % SKILL_ROT.length]); })) + ';Array.prototype.forEach.call(l.children,function(li,i){li.addEventListener("click",function(){Array.prototype.forEach.call(l.children,function(x){x.classList.remove("on")});li.classList.add("on");if(im)im.src=imgs[i];document.querySelectorAll(".eg-vsdesc").forEach(function(p){p.style.display=p.getAttribute("data-vsd")==String(i)?"":"none"});});});})();<\/script>' : '') +
      '<script>(function(){' + FNJS + '})();<\/script>' +
      '</body></html>';
  };

  window.ENSOL_SECTION_SPEC = {
    template: [
      { type: 'answer', tier: 'core' }, { type: 'skill', tier: 'core' }, { type: 'feature', tier: 'mid' },
      { type: 'agenda', tier: 'core' }, { type: 'faq', tier: 'core' }, { type: 'free', tier: 'core' },
    ],
    fixed: ['dock'],
    labels: { answer: '키비주얼 카드', skill: '기능 탭', feature: '혜택 카드', agenda: '아젠다', faq: 'FAQ', free: '웨이브 CTA', dock: '플로팅 CTA' },
  };
  window.ENSOL_STYLE = { id: 'ensol', name: 'Ensol MBM', desc: '제미나이 블루 그라 · 영상 히어로 핀 스크럽 · 키비주얼 카드 · 탭 자동 프로그레스 · 오로라 폼 · 데이터 웨이브', swatch: 'linear-gradient(135deg,#3186ff 0%,#1257ff 50%,#040308 100%)' };
})();
