/* packs.mbm.js — "세미나 집객 블루" 랜딩 팩 (MBM). classic <script src>.
   소스: Figma Y5BuxrmQwXHIDfOgPknPVr 236:54126 (1920×7952) 실측. v2 = 상단을 Figma 그대로.
   구성(고정 TEMPLATE): GNB(화이트 #FAFCFE·로고·앵커 메뉴·다크 CTA #515866) → hero(블루 #006BDE→#1E90F0 + 우측 사장교 실사)
   → 카운트다운 → 챕터 지그재그 ×3(그라데이션 타이틀 + 이미지 비주얼, 실패 시 대시보드 모형 폴백)
   → 세션(#program) → 일정·장소(#info) → 다크 선언 → FAQ(#faq) → 참가 신청 폼(#apply) → footer.
   실측 토큰: GNB h72 · 히어로 타이틀 72/-4.4%/129% · 챕터 bg #E4EBF4/#F0F7F7/#EBF2E6
   · 타이틀 그라데이션 #165FCE→#448EFE / #007DA0→#00BDDE / #54BA0A→#6BE016 · 선언 bg #0C0D0D
   · CTA #065454→#071E21 · FAQ 열린 Q #1BB9CD · 카드 r12. 폰트 Pretendard, 큰 마이너스 자간. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  var CH = [
    { cap: 'MONITORING', bg: '#E4EBF4', g1: '#165FCE', g2: '#448EFE', tint: '#699EF0' },
    { cap: 'PREDICTION', bg: '#F0F7F7', g1: '#007DA0', g2: '#00BDDE', tint: '#39BFD8' },
    { cap: 'FEEDBACK',   bg: '#EBF2E6', g1: '#54BA0A', g2: '#6BE016', tint: '#7BCE4A' },
  ];
  /* 기본 실사 — 히어로는 사용자 첨부 원본(Figma 239:107443 → bg/mbm-hero.jpg), 챕터는 눈검증 큐레이션.
     죽은 링크는 onerror로 제거되고 모형 폴백 */
  var BASE = (function () { try { var sc = document.currentScript && document.currentScript.src || ''; return sc ? sc.slice(0, sc.lastIndexOf('/') + 1) : ''; } catch (e) { return ''; } })();
  var IMG_HERO = BASE + 'bg/mbm-hero.jpg';
  var IMG_FEAT = [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1100&q=78&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1100&q=78&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1100&q=78&auto=format&fit=crop',
  ];

  /* 데모 기본 콘텐츠 — 시안 원문(ONSITE). AI 초안(compose-web)이 오면 전부 교체된다 */
  var DEMO = {
    productName: 'MIDAS ONSITE',
    tagline: '실시간 데이터 기반\n가시설 현장 안전 예측 솔루션',
    subcopy: '굴착 현장의 실시간 계측 데이터를 분석해 가시설의 거동과 위험을 예측하고,\n이상 징후 알림과 최적 보완설계로 안전한 현장 대응을 지원합니다.',
    primaryCta: '세미나 신청하기',
    navTitle: 'Civil NX Seminar 2026',
    navLinks: ['소개', '프로그램', '일정·장소', 'FAQ'],
    features: [
      { title: '본사는 현장을 우선순위별로 한눈에,\n현장은 대시보드로 위험에 더 빠르게 대응합니다.', desc: '전국 현장의 계측 상태와 위험도를 한 화면에서 확인합니다. 이상 센서는 즉시 알림으로 받아봅니다. 현장별 점검 리스트가 자동으로 만들어집니다.' },
      { title: '향후 시공단계의 위험을\n선제적으로 예측합니다.', desc: '계측값 패턴으로 가시설 이상 징후를 조기 판단합니다. 최적 보완설계 제시로 리스크를 사전에 제거합니다. 관리기준 초과 전에 골든타임을 확보합니다.' },
      { title: '주간·월간 보고서를\n자동으로 생성합니다.', desc: 'AI 경향 분석과 위험 단계별 행동 가이드를 제공합니다. 보고 업무 시간을 크게 줄입니다. 기록이 자동으로 축적되어 이력 관리가 쉬워집니다.' },
    ],
    stats: [],
    sessions: [
      { time: '13:30 - 14:10', title: '왜 지금 예측인가 — 가시설 안전의 골든타임', by: 'MIDAS ONSITE 기획' },
      { time: '14:10 - 15:00', title: '통합 관제 대시보드 라이브 데모', by: '프로덕트 리드' },
      { time: '15:00 - 15:40', title: '도입 현장 사례 — 4주 온보딩의 실제', by: '현장 엔지니어' },
    ],
    eventDate: '2026.09.12 (목) 13:30 - 16:00',
    eventPlace: '섬유센터빌딩 컨퍼런스홀 (강남)\n삼성역 4번 출구 도보 4분',
    deadline: '2026-09-10T18:00:00+09:00',
    bannerText: '현장 운영 데이터와\n학계 검증을 바탕으로,\n온사이트의 신뢰를 쌓아가고 있습니다',
    bannerCta: '',
    faq: [
      { q: '우리 현장에도 적용할 수 있나요?', a: '굴착 · 가시설 현장이면 계측 항목과 관계없이 연동할 수 있습니다. 현장 조건은 상담으로 확인해 드립니다.' },
      { q: '기존 계측기나 수동계측 방식도 그대로 사용할 수 있나요?', a: '이미 설치된 계측기 종류에 맞춰 구성합니다. 재설치 없이 시작할 수 있습니다.' },
      { q: '도입이 복잡하거나 오래 걸리지 않나요?', a: '현장 진단부터 대시보드 오픈까지 4주면 충분합니다.' },
      { q: '예측 결과를 믿어도 되나요?', a: '현장 운영 데이터와 학계 검증을 바탕으로 정확도를 계속 높여가고 있습니다.' },
      { q: '비용이 부담되거나, 우리 현장에 안 맞으면 어쩌죠?', a: '현장 규모와 계측 항목에 맞춰 도입 방안과 견적을 안내해 드립니다. 부담 없이 문의해 주세요.' },
    ],
    ctaTitle: '지금 세미나에\n참가 신청하세요',
    ctaSub: '좌석이 한정되어 있습니다. 신청 후 참가 안내 메일을 보내드려요.\n현장 규모와 계측 항목에 맞는 상담도 함께 신청할 수 있습니다.',
    formTitle: '참가 신청',
    formName: '이름',
    formCompany: '회사명 / 소속',
    formEmail: '이메일',
    formPhone: '연락처',
    formAgree: '개인정보 수집·이용에 동의합니다',
    formDone: '신청이 완료되었습니다!\n입력하신 이메일로 참가 안내를 보내드릴게요.',
    footerLinks: ['솔루션', '도입 문의', '회사 소개'],
    footerCopyright: '© 2026 MIDAS IT',
  };

  // 영문 폴백 데모 — _clang이 ko가 아니면 누락 필드가 이걸로 채워진다(KO 예시 누수 방지)
  var DEMO_EN = {
    productName: 'MIDAS ONSITE',
    tagline: 'Real-time, data-driven\nsafety prediction for temporary works',
    subcopy: 'We analyze live sensor data from excavation sites to predict behavior and risk,\nsupporting safe response with anomaly alerts and optimal remedial design.',
    primaryCta: 'Register for the Seminar',
    navTitle: 'Civil NX Seminar 2026',
    navLinks: ['About', 'Program', 'Schedule', 'FAQ'],
    features: [
      { title: 'HQ sees every site at a glance,\nsites respond faster with dashboards.', desc: 'Check sensor status and risk across sites on one screen. Get instant alerts on abnormal sensors. Per-site checklists are generated automatically.' },
      { title: 'Predict risks of upcoming\nconstruction stages in advance.', desc: 'Detect early anomalies from sensor patterns. Remove risk beforehand with optimal remedial designs. Secure the golden hour before limits are exceeded.' },
      { title: 'Weekly and monthly reports,\ngenerated automatically.', desc: 'AI trend analysis with action guides per risk level. Cut reporting time dramatically. Records accumulate automatically for easy history management.' },
    ],
    stats: [],
    sessions: [
      { time: '13:30 - 14:10', title: 'Why prediction, why now — the golden hour of site safety', by: 'MIDAS ONSITE Planning' },
      { time: '14:10 - 15:00', title: 'Live demo: the central monitoring dashboard', by: 'Product Lead' },
      { time: '15:00 - 15:40', title: 'Field case study — 4-week onboarding in practice', by: 'Field Engineer' },
    ],
    eventDate: 'Sep 12 (Thu), 2026 · 13:30 - 16:00',
    eventPlace: 'Conference Hall, Textile Center (Gangnam)\n4 min from Samseong Stn. Exit 4',
    deadline: '2026-09-10T18:00:00+09:00',
    bannerText: 'On field data\nand academic validation,\nwe build ONSITE\u2019s credibility',
    bannerCta: '',
    faq: [
      { q: 'Will it work on our site?', a: 'Any excavation or temporary-works site can connect, regardless of sensor types. We\u2019ll confirm site conditions in a consultation.' },
      { q: 'Can we keep existing sensors or manual readings?', a: 'We configure around the sensors you already have. No reinstallation needed.' },
      { q: 'Is adoption complicated or slow?', a: 'From site assessment to dashboard launch, four weeks is enough.' },
      { q: 'Can we trust the predictions?', a: 'Accuracy keeps improving, grounded in field data and academic validation.' },
      { q: 'What if it\u2019s too costly or doesn\u2019t fit?', a: 'We\u2019ll tailor a plan and quote to your site scale and sensors. Feel free to ask.' },
    ],
    ctaTitle: 'Register for the seminar\ntoday',
    ctaSub: 'Seats are limited. You\u2019ll receive details by email after registering.\nYou can also request a consultation tailored to your site.',
    formTitle: 'Register',
    formName: 'Name',
    formCompany: 'Company / Team',
    formEmail: 'Email',
    formPhone: 'Phone',
    formAgree: 'I agree to the collection and use of my information',
    formDone: 'You\u2019re registered!\nWe\u2019ll send details to your email.',
    footerLinks: ['Solution', 'Contact Sales', 'About Us'],
    footerCopyright: '\u00a9 2026 MIDAS IT',
  };

  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  // 타이틀 강약 — **마커** 우선, 여러 줄이면 첫 줄 볼드+나머지 라이트, 한 줄이면 앞 40% 볼드
  function mixT(s) {
    s = String(s == null ? '' : s);
    if (/\*\*/.test(s)) return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    var lines = esc(s).split('\n');
    if (lines.length > 1) return lines.map(function (ln, i) { return i === 0 ? ln : '<b>' + ln + '</b>'; }).join('<br>');
    var w = lines[0].split(' ');
    if (w.length < 2) {
      var ln0 = lines[0];
      if (ln0.length < 4) return '<b>' + ln0 + '</b>';
      var n2 = Math.max(1, Math.round(ln0.length * 0.4));
      var head = ln0.slice(0, Math.min(ln0.length - 1, n2 + 2));
      var pi = Math.max(head.lastIndexOf('、'), head.lastIndexOf('，'), head.lastIndexOf('。'), head.lastIndexOf(','));
      if (pi > 0) n2 = pi + 1;
      return ln0.slice(0, n2) + '<b>' + ln0.slice(n2) + '</b>';
    }
    var n = Math.max(1, Math.round(w.length * 0.5));
    return w.slice(0, n).join(' ') + ' <b>' + w.slice(n).join(' ') + '</b>';
  }
  /* desc 한 덩어리 → 체크 불릿 — 문장 단위 분해(마침표), 최대 3개 */
  function bullets(desc, P) {
    var parts = String(desc || '').split(/(?<=다\.)\s+|(?<=요\.)\s+|(?<=\.)\s+(?=[A-Z가-힣])/).filter(function (s) { return s.trim(); }).slice(0, 3);
    if (!parts.length) parts = [desc || ''];
    return parts.map(function (t, i) {
      return '<li><svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="10" fill="currentColor" opacity=".14"/><path d="M6 10.2l2.6 2.6L14 7.4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span' + de(P) + '>' + esc(t.trim()) + '</span></li>';
    }).join('');
  }
  /* 챕터 비주얼 — 실사 이미지(피커 슬롯 feature.N) 위, 로드 실패 시 추상 대시보드 모형이 드러남 */
  function visual(c, flip, imgSrc, slot) {
    return '<div class="mb-vis" style="--tint:' + c.tint + ';--g1:' + c.g1 + ';--g2:' + c.g2 + '">' +
      (imgSrc ? '<img class="vimg" loading="lazy" alt="" data-img="' + esc(slot) + '" src="' + esc(imgSrc) + '" onerror="this.remove()">' : '') +
      '<div class="mb-win"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>' +
      '<div class="mb-scr">' +
      '<div class="mb-kpis"><div class="k"><i style="height:56%"></i></div><div class="k"><i style="height:78%"></i></div><div class="k on"><i style="height:92%"></i></div><div class="k"><i style="height:64%"></i></div></div>' +
      '<div class="mb-rows"><span style="width:82%"></span><span style="width:64%"></span><span style="width:71%"></span></div>' +
      '<svg class="mb-line" viewBox="0 0 300 80" preserveAspectRatio="none"><path d="M0 66 L50 58 L100 60 L150 44 L200 38 L250 22 L300 12" fill="none" stroke="url(#mbg' + (flip ? 'b' : 'a') + ')" stroke-width="3.5" stroke-linecap="round"/><defs><linearGradient id="mbg' + (flip ? 'b' : 'a') + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + c.g1 + '"/><stop offset="1" stop-color="' + c.g2 + '"/></linearGradient></defs></svg>' +
      '</div></div>';
  }

  function css() {
    return [
      '*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}',
      'body{font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:#0A0B0B;background:#fff;-webkit-font-smoothing:antialiased}',
      'img{max-width:100%}ul{list-style:none}a{text-decoration:none;color:inherit}',
      '.wrap{max-width:1372px;margin:0 auto;padding:0 34px}',
      /* GNB — Figma MainHome-GNB 실측: h72 · bg #FAFCFE · 로고 좌 · 다크 버튼 #515866 우 */
      '.mb-nav{position:sticky;top:0;z-index:50;background:rgba(250,252,254,.92);backdrop-filter:blur(10px);border-bottom:1px solid rgba(10,11,11,.06)}',
      '.mb-nav .wrap{display:flex;align-items:center;gap:40px;height:72px}',
      /* GNB 타이틀 — 로고 심볼 없이 영문 워드마크만 (사용자 지정) */
      '.mb-logo{font-weight:700;font-size:20px;letter-spacing:-.02em;white-space:nowrap;color:#0A0B0B}',
      '.mb-menu{display:flex;gap:34px;font-size:15.5px;font-weight:600;color:#3E4450;margin-left:auto}',
      '.mb-menu a{transition:color .15s}.mb-menu a:hover{color:#006BDE}',
      '.mb-navcta{display:inline-block;background:#515866;color:#fff;font-size:15px;font-weight:600;padding:12px 22px;border-radius:8px;cursor:pointer;border:0;font-family:inherit;white-space:nowrap}',
      /* hero — Figma 실측: 블루 #006BDE→#1E90F0 + 우측 사장교 실사, 화이트 CTA. h726 */
      '.mb-hero{position:relative;min-height:726px;display:flex;align-items:flex-start;overflow:hidden;background:linear-gradient(90deg,#006BDE 0%,#1E90F0 100%)}',
      '.mb-hero .bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:74% 50%}',
      /* 첨부 원본에 좌측 블루가 이미 있음 — 오버레이는 좁은 화면 가독성 보강용으로만 얇게 */
      '.mb-hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,107,222,.55) 0%,rgba(0,107,222,.22) 38%,rgba(0,107,222,0) 62%)}',
      '.mb-hero .wrap{position:relative;z-index:2;width:100%;padding-top:168px;padding-bottom:150px}',
      '.mb-ht{font-size:72px;line-height:1.29;letter-spacing:-.044em;font-weight:300;color:#FDFDFE;text-wrap:balance}',
      '.mb-ht b,.mb-st .tx b,.mb-cta .tt b{font-weight:700}',
      '.mb-hs{margin-top:18px;font-size:20px;line-height:1.5;color:#EAF3FD;max-width:660px}',
      '.mb-hcta{display:inline-block;margin-top:40px;background:#fff;color:#374151;font-size:17.5px;font-weight:600;padding:17px 34px;border-radius:8px;border:0;cursor:pointer;font-family:inherit;box-shadow:0 10px 30px rgba(3,40,90,.28)}',
      /* 챕터 */
      '.mb-ch{padding:110px 0 130px}',
      '.mb-ch .cap{display:block;text-align:center;font-size:21px;font-weight:700;letter-spacing:.02em;color:#7A808D}',
      '.mb-ch .tt{margin-top:14px;text-align:center;font-size:44px;line-height:1.286;letter-spacing:-.045em;font-weight:600;background:linear-gradient(93deg,var(--g1),var(--g2));-webkit-background-clip:text;background-clip:text;color:transparent;text-wrap:balance}',
      '.mb-zig{margin-top:64px;display:grid;grid-template-columns:436fr 904fr;gap:32px;align-items:stretch}',
      '.mb-zig.flip{grid-template-columns:904fr 436fr}',
      '.mb-card{background:#fff;border:1px solid rgba(10,11,11,.08);border-radius:12px;padding:44px 40px;display:flex;flex-direction:column;justify-content:center;box-shadow:0 14px 40px rgba(15,30,60,.06)}',
      '.mb-card .ct{font-size:29px;line-height:1.334;letter-spacing:-.045em;font-weight:600;color:#0A0B0B}',
      '.mb-card ul{margin-top:26px;display:flex;flex-direction:column;gap:13px}',
      '.mb-card li{display:flex;gap:10px;align-items:flex-start;font-size:18.5px;line-height:1.5;color:#4B5563;letter-spacing:-.03em}',
      '.mb-card li svg{flex:none;margin-top:3px;color:var(--g1)}',
      '.mb-vis{position:relative;overflow:hidden;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--tint) 26%,#fff),color-mix(in srgb,var(--tint) 62%,#fff));padding:26px;display:flex;flex-direction:column;min-height:420px;box-shadow:inset 0 0 0 1px rgba(10,11,11,.05)}',
      '.mb-vis .vimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2}',
      '.mb-win{display:flex;gap:6px;margin-bottom:14px}.mb-win .dot{width:9px;height:9px;border-radius:50%;background:rgba(10,11,11,.18)}',
      '.mb-scr{flex:1;background:rgba(255,255,255,.88);border-radius:10px;padding:22px;display:flex;flex-direction:column;gap:16px}',
      '.mb-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;height:96px;align-items:end}',
      '.mb-kpis .k{background:rgba(10,11,11,.05);border-radius:8px;height:100%;display:flex;align-items:flex-end;padding:6px}',
      '.mb-kpis .k i{display:block;width:100%;border-radius:5px;background:linear-gradient(180deg,var(--g2),var(--g1))}',
      '.mb-kpis .k.on{outline:2px solid var(--g1);outline-offset:2px}',
      '.mb-rows{display:flex;flex-direction:column;gap:9px}.mb-rows span{display:block;height:10px;border-radius:5px;background:rgba(10,11,11,.09)}',
      '.mb-line{width:100%;height:76px}',
      /* 다크 선언 */
      '.mb-st{background:#0C0D0D;padding:150px 0;text-align:center}',
      '.mb-st .tx{font-size:54px;line-height:1.286;letter-spacing:-.045em;font-weight:300;color:#fff;text-wrap:balance}',
      '.mb-st .tx .dim{color:#6B7280}',
      '.mb-st .nums{margin-top:56px;display:flex;justify-content:center;gap:72px}',
      '.mb-st .n b{font-size:44px;font-weight:800;color:#fff;letter-spacing:-.03em}.mb-st .n span{display:block;margin-top:6px;font-size:15px;color:#6B7280}',
      /* FAQ */
      '.mb-faq{padding:120px 0 130px}',
      '.mb-faq .tt{text-align:center;font-size:44px;line-height:1.286;letter-spacing:-.045em;font-weight:600;color:#0A0B0B}',
      '.mb-faq .sub{margin-top:14px;text-align:center;font-size:17.5px;color:#4B5563}',
      '.mb-qs{margin-top:52px;max-width:1000px;margin-left:auto;margin-right:auto;display:flex;flex-direction:column;gap:14px}',
      '.mb-q{background:#F7F7F8;border-radius:8px;padding:24px 28px;cursor:pointer}',
      '.mb-q .qh{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:21px;font-weight:700;letter-spacing:-.04em;color:#4B5563}',
      '.mb-q .qh i{font-style:normal;font-size:22px;color:#9AA0A6;transition:transform .2s}',
      '.mb-q .qa{max-height:0;overflow:hidden;transition:max-height .28s ease;font-size:18px;line-height:1.5;color:#262729;letter-spacing:-.03em}',
      '.mb-q.open{background:#fff;box-shadow:0 12px 34px rgba(15,30,60,.09)}',
      '.mb-q.open .qh{color:#1BB9CD}.mb-q.open .qh i{transform:rotate(45deg);color:#1BB9CD}',
      '.mb-q.open .qa{max-height:220px;margin-top:14px}',
      /* 신청 폼 섹션 — 다크틸 그라데이션 위 화이트 폼 카드 */
      '.mb-cta{position:relative;background:linear-gradient(135deg,#065454 0%,#071E21 100%);padding:120px 0;overflow:hidden}',
      '.mb-cta:before{content:"";position:absolute;inset:0;background:radial-gradient(60% 90% at 80% 10%,rgba(27,185,205,.24),transparent 70%)}',
      '.mb-cta .agrid{position:relative;display:grid;grid-template-columns:1fr 520px;gap:64px;align-items:center}',
      '.mb-cta .tt{font-size:50px;line-height:1.286;letter-spacing:-.045em;font-weight:300;color:#fff;text-wrap:balance}',
      '.mb-cta .sub{margin-top:20px;font-size:17.5px;line-height:1.55;color:rgba(255,255,255,.86)}',
      '.mb-form{background:#fff;border-radius:16px;padding:38px 36px;box-shadow:0 30px 80px rgba(0,0,0,.35)}',
      '.mb-form .ft{display:block;font-size:24px;font-weight:800;letter-spacing:-.03em;color:#0A0B0B}',
      '.mb-form label{display:block;font-size:13.5px;font-weight:700;color:#6B7280;margin:18px 0 7px}',
      '.mb-form input[type=text],.mb-form input[type=email],.mb-form input[type=tel]{width:100%;border:1.5px solid #E5E7EB;border-radius:10px;padding:13px 15px;font-size:16px;font-family:inherit;color:#0A0B0B;outline:0;transition:border-color .15s,box-shadow .15s}',
      '.mb-form input:focus{border-color:#165FCE;box-shadow:0 0 0 3px rgba(22,95,206,.14)}',
      '.mb-form .agr{display:flex;align-items:flex-start;gap:9px;margin-top:20px;font-size:14px;color:#4B5563;font-weight:500;cursor:pointer}',
      '.mb-form .agr input{margin-top:2.5px;width:16px;height:16px;accent-color:#165FCE}',
      '.mb-form .sbm{width:100%;margin-top:22px;background:linear-gradient(93deg,#165FCE,#448EFE);color:#fff;border:0;border-radius:10px;padding:16px;font-size:17px;font-weight:700;font-family:inherit;cursor:pointer;transition:transform .2s,box-shadow .2s}',
      '.mb-form .sbm:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(22,95,206,.35)}',
      '.mb-form .done{text-align:center;padding:34px 6px}',
      '.mb-form .done svg{color:#165FCE}',
      '.mb-form .done p{margin-top:16px;font-size:18px;line-height:1.55;font-weight:600;color:#0A0B0B}',
      /* footer */
      '.mb-foot{background:#0A0B0B;color:#9AA0A6;padding:44px 0}',
      '.mb-foot .wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}',
      '.mb-foot .lks{display:flex;gap:26px;font-size:14.5px}.mb-foot .cp{font-size:13.5px;color:#6B7280}',
      /* 카운트다운 바 — 마감 긴급성 */
      '.mb-count{background:#0A0B0B;color:#fff;padding:18px 0}',
      '.mb-count .wrap{display:flex;align-items:center;justify-content:center;gap:26px;flex-wrap:wrap}',
      '.mb-count .lb{font-size:15px;color:#9AA0A6;font-weight:600}',
      '.mb-count .seg{display:flex;align-items:baseline;gap:5px}',
      '.mb-count .seg b{font-size:26px;font-weight:800;font-variant-numeric:tabular-nums;color:#fff;min-width:38px;text-align:center;background:rgba(255,255,255,.08);border-radius:8px;padding:3px 6px}',
      '.mb-count .seg span{font-size:12.5px;color:#9AA0A6}',
      /* 세션 타임테이블 */
      '.mb-ses{padding:110px 0 20px}',
      '.mb-ses .tt{text-align:center;font-size:44px;line-height:1.286;letter-spacing:-.045em;font-weight:600}',
      '.mb-slist{margin:52px auto 0;max-width:1000px;display:flex;flex-direction:column;gap:14px}',
      '.mb-srow{display:grid;grid-template-columns:170px 1fr auto;gap:22px;align-items:center;background:#fff;border:1px solid rgba(10,11,11,.08);border-radius:12px;padding:22px 28px;transition:transform .25s ease,box-shadow .25s ease}',
      '.mb-srow:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(15,30,60,.1)}',
      '.mb-srow .tm{font-size:15.5px;font-weight:700;color:#165FCE;font-variant-numeric:tabular-nums}',
      '.mb-srow .st{font-size:20px;font-weight:700;letter-spacing:-.03em}',
      '.mb-srow .by{font-size:14.5px;color:#6B7280;white-space:nowrap}',
      /* 일정·장소 */
      '.mb-info{padding:40px 0 120px}',
      '.mb-ibox{max-width:1000px;margin:0 auto;background:#F5F7FA;border-radius:16px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden}',
      '.mb-ibox .l{padding:38px 40px}',
      '.mb-ibox table{border-collapse:collapse;font-size:16.5px}',
      '.mb-ibox th{color:#9AA0A6;font-weight:600;text-align:left;padding:8px 24px 8px 0;vertical-align:top;white-space:nowrap}',
      '.mb-ibox td{padding:8px 0;line-height:1.5;font-weight:600;color:#0A0B0B}',
      '.mb-imap{position:relative;background:linear-gradient(135deg,#E4EBF4,#D3DEEC);min-height:220px;border:0;width:100%;height:100%;display:block}',
      '.mb-imap .pin{position:absolute;left:48%;top:38%;width:32px;height:32px;border-radius:50% 50% 50% 0;background:#165FCE;transform:rotate(-45deg);box-shadow:0 10px 24px rgba(22,95,206,.35)}',
      '.mb-imap .pin:after{content:"";position:absolute;inset:9px;border-radius:50%;background:#fff}',
      '.mb-imap .rd{position:absolute;left:0;right:0;top:58%;height:12px;background:rgba(10,11,11,.07);transform:rotate(-6deg)}',
      /* 앵커 스크롤 — sticky GNB 높이 보정 */
      '.mb-ch,.mb-ses,.mb-info,.mb-faq,.mb-st,.mb-cta{scroll-margin-top:76px}',
      /* 카드·버튼 호버 */
      '.mb-card,.mb-vis{transition:transform .3s ease,box-shadow .3s ease}',
      '.mb-card:hover{transform:translateY(-4px);box-shadow:0 22px 54px rgba(15,30,60,.1)}',
      '.mb-hcta,.mb-navcta{transition:transform .2s ease,box-shadow .2s ease}',
      '.mb-hcta:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(8,20,40,.3)}',
      '.mb-navcta:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(20,26,34,.25)}',
      /* 히어로 진입 스태거 */
      '.mb-hero .mb-ht,.mb-hero .mb-hs,.mb-hero .mb-hcta{opacity:0;transform:translateY(22px);animation:mbUp .8s cubic-bezier(.2,.7,.2,1) forwards}',
      '.mb-hero .mb-hs{animation-delay:.14s}.mb-hero .mb-hcta{animation-delay:.28s}',
      '@keyframes mbUp{to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){.rv,.mb-hero .mb-ht,.mb-hero .mb-hs,.mb-hero .mb-hcta{opacity:1;transform:none;animation:none;transition:none}}',
      /* 모션 */
      '.rv{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}',
      '.rv.in{opacity:1;transform:none}',
      /* 한국어 제목 중간 꺾임 방지 */
      '.mb-ht,.mb-ch .tt,.mb-faq .tt,.mb-st .tx,.mb-cta .tt,.mb-card .ct{word-break:keep-all}',
      '@media (max-width:960px){.mb-menu{display:none}.mb-navcta{margin-left:auto}.mb-zig,.mb-zig.flip{grid-template-columns:1fr}.mb-ht{font-size:44px}.mb-ch .tt,.mb-faq .tt{font-size:33px}.mb-st .tx{font-size:36px}.mb-cta .tt{font-size:36px}.mb-cta .agrid{grid-template-columns:1fr;gap:44px}}',
      /* 모바일(≤600) — GNB 한 줄 유지·히어로 가독 오버레이·카운트다운 축소·폼 여백 */
      '@media (max-width:600px){',
      '.mb-nav .wrap{gap:12px;height:60px}.mb-logo{font-size:15px}.mb-navcta{padding:9px 14px;font-size:13px}',
      '.mb-hero{min-height:640px}.mb-hero .wrap{padding-top:120px;padding-bottom:110px}',
      '.mb-hero .shade{background:linear-gradient(180deg,rgba(0,86,190,.78) 0%,rgba(0,96,205,.55) 55%,rgba(0,107,222,.3) 100%)}',
      '.mb-ht{font-size:34px}.mb-hs{font-size:16.5px}.mb-hcta{font-size:16px;padding:14px 26px}',
      '.mb-count .wrap{gap:12px}.mb-count .lb{width:100%;text-align:center}.mb-count .seg b{font-size:20px;min-width:30px}',
      '.mb-ch{padding:72px 0 84px}.mb-ch .tt{font-size:27px}.mb-card{padding:30px 24px}.mb-card .ct{font-size:23px}',
      '.mb-srow{grid-template-columns:1fr;gap:8px;padding:18px 20px}.mb-srow .by{white-space:normal}',
      '.mb-ibox{grid-template-columns:1fr}.mb-st{padding:90px 0}.mb-st .tx{font-size:27px}',
      '.mb-faq .tt{font-size:27px}.mb-q .qh{font-size:17.5px}.mb-qs{margin-top:36px}',
      '.mb-cta{padding:80px 0}.mb-cta .tt{font-size:29px}.mb-form{padding:26px 20px}',
      '.mb-foot .wrap{flex-direction:column;align-items:flex-start}',
      '}',
      '[data-edit]{white-space:pre-wrap}',
    ].join('\n');
  }

  window.renderMbmPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    /* [시연 잠금] GNB·히어로 고정 — 단 사용자가 직접 편집한 필드(_touched)는 양보 */
    var TCH = shared._touched || {};
    if (!TCH.navTitle) d.navTitle = 'MIDAS GEN NX Seminar 2026';
    if (!TCH.tagline) d.tagline = ({
      ko: '지금 만나보세요\n차세대 구조설계 워크플로우',
      en: 'Meet the Next Generation of\nStructural Design Workflow',
      ja: 'いま、出会う\n次世代の構造設計ワークフロー',
      zh: '即刻遇见\n新一代结构设计工作流',
    })[LANG] || d.tagline;
    // 템플릿 고정 라벨 + 폼 기본 라벨 — 산출물 언어(_clang) 기준. 데이터가 아니라 번역 파이프라인을 안 타므로 팩이 직접 처리.
    var TT = {
      ko: { faqT: '도입 전,<br>이런 점이 궁금하신가요?', faqS: '가장 많이 묻는 질문을 모았습니다. 더 궁금한 점은 부담 없이 문의해 주세요.', dt: '일시', pl: '장소', cd: ' 마감까지',
            fT: '참가 신청', fN: '이름', fC: '회사명 / 소속', fE: '이메일', fP: '연락처', fA: '개인정보 수집·이용에 동의합니다', fD: '신청이 완료되었습니다!\n입력하신 이메일로 참가 안내를 보내드릴게요.' },
      en: { faqT: 'Before you decide —<br>common questions', faqS: 'The questions we hear most. For anything else, just ask.', dt: 'Date', pl: 'Venue', cd: ' — closes in',
            fT: 'Register', fN: 'Name', fC: 'Company / Team', fE: 'Email', fP: 'Phone', fA: 'I agree to the collection and use of my information', fD: 'You’re registered!\nWe’ll send details to your email.' },
      ja: { faqT: '導入前に、<br>よくあるご質問', faqS: 'よくいただく質問をまとめました。お気軽にお問い合わせください。', dt: '日時', pl: '会場', cd: ' 締切まで',
            fT: '参加申込', fN: 'お名前', fC: '会社名 / 所属', fE: 'メール', fP: '電話番号', fA: '個人情報の収集・利用に同意します', fD: 'お申込みが完了しました！\nご案内をメールでお送りします。' },
      zh: { faqT: '在决定之前——<br>常见问题', faqS: '汇总了最常见的问题，欢迎随时咨询。', dt: '日期', pl: '地点', cd: ' 报名截止倒计时',
            fT: '报名', fN: '姓名', fC: '公司 / 团队', fE: '邮箱', fP: '电话', fA: '同意收集和使用个人信息', fD: '报名成功！\n详情将发送至您的邮箱。' },
    }[LANG];
    // 폼 라벨 — 데이터에 없으면(AI 초안엔 항상 없음) 언어별 기본값으로. KO 예시가 EN 페이지에 새는 것 방지.
    if (LANG !== 'ko') ['formTitle','formName','formCompany','formEmail','formPhone','formAgree','formDone'].forEach(function (k, i) {
      if (shared[k] == null || shared[k] === '') d[k] = [TT.fT, TT.fN, TT.fC, TT.fE, TT.fP, TT.fA, TT.fD][i];
    });
    var feats = (d.features && d.features.length ? d.features : BD.features).slice(0, 3);
    var faq = (shared.faq && shared.faq.length ? shared.faq : BD.faq).slice(0, 6);
    var imgs = shared.images || {};
    var ctaTitle = shared.bannerText && shared.bannerCta ? shared.bannerText : d.ctaTitle;   // 배너 텍스트를 CTA로 쓰는 초안 대응
    var stTx = (function () {   // 선언 2톤 — 마지막 줄을 딤 처리
      var lines = String(d.bannerText || '').split('\n');
      if (lines.length < 2) return mixT(d.bannerText);
      var last = lines.pop();
      return '<b>' + esc(lines[0]) + '</b>' + (lines.length > 1 ? '<br>' + ml(lines.slice(1).join('\n')) : '') + '<br><span class="dim">' + esc(last) + '</span>';
    })();
    var stats = (d.stats || []).slice(0, 3);
    var chapters = feats.map(function (f, i) {
      var c = CH[i % CH.length], flip = i % 2 === 1, P = 'features.' + i;
      var text = '<div class="mb-card rv" style="--g1:' + c.g1 + '"><h3 class="ct"' + de(P + '.title') + '>' + ml(f.title || '') + '</h3><ul>' + bullets(f.desc, P + '.desc') + '</ul></div>';
      var vis = '<div class="rv">' + visual(c, flip, imgs['feature.' + i] || IMG_FEAT[i % IMG_FEAT.length], 'feature.' + i) + '</div>';
      return '<section class="mb-ch"' + (i === 0 ? ' id="about"' : '') + ' style="background:' + c.bg + ';--g1:' + c.g1 + ';--g2:' + c.g2 + '">' +
        '<div class="wrap"><span class="cap rv">' + c.cap + '</span>' +
        '<h2 class="tt rv"' + de(P + '.title') + '>' + ml(f.title || '') + '</h2>' +
        '<div class="mb-zig' + (flip ? ' flip' : '') + '">' + (flip ? vis + text : text + vis) + '</div></div></section>';
    }).join('');
    var qs = faq.map(function (f, i) {
      return '<div class="mb-q' + (i === 0 ? ' open' : '') + '"><div class="qh"><span' + de('faq.' + i + '.q') + '>Q. ' + esc(f.q || '') + '</span><i>+</i></div>' +
        '<div class="qa"' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</div></div>';
    }).join('');
    var anchors = ['#about', '#program', '#info', '#faq'];
    var menu = (d.navLinks || []).slice(0, 4).map(function (l, i) {
      return '<a href="' + anchors[i % anchors.length] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>';
    }).join('');
    /* 폼 제출 — 모션 옵션과 무관한 기능 스크립트 (성공 연출 + FAQ 토글 + 카운트다운은 아래 mot) */
    var fnjs = '<script>(function(){var f=document.querySelector(".mb-form");if(!f)return;' +
      'f.addEventListener("submit",function(e){e.preventDefault();' +
      'var m=(f.getAttribute("data-fdone")||"").replace(/\\n/g,"<br>");' +
      'f.innerHTML=\'<div class="done"><svg viewBox="0 0 48 48" width="52" height="52"><circle cx="24" cy="24" r="22" fill="currentColor" opacity=".12"/><path d="M14 24.5l7 7L34 18" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><p>\'+m+"</p></div>";});' +
      '})();<\/script>';
    var mot = opts.motion === false ? '' :
      '<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.14});document.querySelectorAll(".rv").forEach(function(e){io.observe(e);});' +
      'document.querySelectorAll(".mb-q").forEach(function(q){q.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;q.classList.toggle("open");});});' +
      'var cd=document.querySelector(".mb-count");if(cd){var end=new Date(cd.getAttribute("data-deadline")||"").getTime();' +
      'if(isFinite(end)){var q=function(s){return cd.querySelector(s);};var t=function(){var ms=Math.max(0,end-Date.now());' +
      'var d2=Math.floor(ms/86400000),h=Math.floor(ms/3600000)%24,m=Math.floor(ms/60000)%60,s2=Math.floor(ms/1000)%60;' +
      'q("[data-cd=d]").textContent=String(d2).padStart(2,"0");q("[data-cd=h]").textContent=String(h).padStart(2,"0");' +
      'q("[data-cd=m]").textContent=String(m).padStart(2,"0");q("[data-cd=s]").textContent=String(s2).padStart(2,"0");};t();setInterval(t,1000);}else{cd.style.display="none";}}' +
      '})();<\/script>';
    var sess = (d.sessions || []).slice(0, 5).map(function (s, i) {
      var P = 'sessions.' + i;
      return '<div class="mb-srow rv"><span class="tm"' + de(P + '.time') + '>' + esc(s.time || '') + '</span>' +
        '<span class="st"' + de(P + '.title') + '>' + esc(s.title || '') + '</span>' +
        '<span class="by"' + de(P + '.by') + '>' + esc(s.by || '') + '</span></div>';
    }).join('');
    // 섹션 조립 — sectionOrder·hiddenSections 반영 + 편집모드 핸들용 data-section
    var SEC = {
      count: '<div class="mb-count" data-section="count" data-deadline="' + esc(d.deadline || '') + '"><div class="wrap"><span class="lb"' + de('primaryCta') + '>' + esc(d.primaryCta) + esc(TT.cd) + '</span>' +
        '<span class="seg"><b data-cd="d">00</b><span>DAYS</span></span><span class="seg"><b data-cd="h">00</b><span>HRS</span></span><span class="seg"><b data-cd="m">00</b><span>MIN</span></span><span class="seg"><b data-cd="s">00</b><span>SEC</span></span></div></div>',
      about: '<div data-section="about">' + chapters + '</div>',
      program: '<section class="mb-ses" id="program" data-section="program"><div class="wrap"><h2 class="tt rv">SESSIONS</h2><div class="mb-slist">' + sess + '</div></div></section>',
      info: '<section class="mb-info" id="info" data-section="info"><div class="wrap"><div class="mb-ibox rv"><div class="l">' +
        '<table><tr><th>' + esc(TT.dt) + '</th><td' + de('eventDate') + '>' + esc(d.eventDate || '') + '</td></tr>' +
        '<tr><th>' + esc(TT.pl) + '</th><td' + de('eventPlace') + '>' + ml(d.eventPlace || '') + '</td></tr></table></div>' +
        (function(){var q=String(d.eventPlace||'').split('\n')[0].trim();return q?'<iframe class="mb-imap" src="https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=15&output=embed" loading="lazy" title="map"></iframe>':'<div class="mb-imap"><span class="rd"></span><span class="pin"></span></div>';})()+'</div></div></section>',
      statement: '<section class="mb-st" data-section="statement"><div class="wrap"><p class="tx rv"' + de('bannerText') + '>' + stTx + '</p>' +
        (stats.length ? '<div class="nums rv">' + stats.map(function (s, i) { return '<div class="n"><b' + de('stats.' + i + '.value') + '>' + esc(s.value || '') + '</b><span' + de('stats.' + i + '.label') + '>' + esc(s.label || '') + '</span></div>'; }).join('') + '</div>' : '') +
        '</div></section>',
      faq: '<section class="mb-faq" id="faq" data-section="faq"><div class="wrap"><h2 class="tt rv">' + TT.faqT + '</h2>' +
        '<p class="sub rv">' + esc(TT.faqS) + '</p>' +
        '<div class="mb-qs rv">' + qs + '</div></div></section>',
    };
    var ORDER = ['count', 'about', 'program', 'info', 'statement', 'faq'];
    var savedOrd = (Array.isArray(shared.sectionOrder) ? shared.sectionOrder : []).filter(function (k) { return SEC[k]; });
    var ordAll = savedOrd.concat(ORDER.filter(function (k) { return savedOrd.indexOf(k) < 0; }));
    var hidden = shared.hiddenSections || [];
    var bodySecs = ordAll.filter(function (k) { return hidden.indexOf(k) < 0; }).map(function (k) { return SEC[k]; }).join('');
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      (LANG === 'ja' || LANG === 'zh' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + (LANG === 'ja' ? 'Noto+Sans+JP' : 'Noto+Sans+SC') + ':wght@300;400;500;700;800;900&display=swap">' +
        '<style>body,button,input,textarea{font-family:"' + (LANG === 'ja' ? 'Noto Sans JP' : 'Noto Sans SC') + '","Pretendard Variable",Pretendard,-apple-system,sans-serif}.mb-ht{font-weight:500}</style>' : '') +
      '<style>' + css() + '</style></head><body data-pack="mbm">' +
      '<nav class="mb-nav"><div class="wrap"><span class="mb-logo"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="mb-menu">' + menu + '</div>' +
      '<a class="mb-navcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></nav>' +
      '<header class="mb-hero"><img class="bgimg" alt="" data-img="hero" src="' + esc(imgs.hero || IMG_HERO) + '" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=\'https://midas-drs.pages.dev/app/bg/mbm-hero.jpg\';}else{this.remove();}"><div class="shade"></div><div class="wrap">' +
      '<h1 class="mb-ht"' + de('tagline') + '>' + mixT(d.tagline) + '</h1>' +
      '<p class="mb-hs"' + de('subcopy') + '>' + ml(d.subcopy) + '</p>' +
      '<a class="mb-hcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></header>' +
      bodySecs +
      '<section class="mb-cta" id="apply"><div class="wrap"><div class="agrid"><div class="l rv">' +
      '<h2 class="tt">' + mixT(ctaTitle) + '</h2>' +
      '<p class="sub"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p></div>' +
      '<form class="mb-form rv" data-fdone="' + esc(d.formDone) + '">' +
      '<b class="ft"' + de('formTitle') + '>' + esc(d.formTitle) + '</b>' +
      '<label' + de('formName') + '>' + esc(d.formName) + '</label><input type="text" name="name" required autocomplete="name">' +
      '<label' + de('formCompany') + '>' + esc(d.formCompany) + '</label><input type="text" name="company" autocomplete="organization">' +
      '<label' + de('formEmail') + '>' + esc(d.formEmail) + '</label><input type="email" name="email" required autocomplete="email">' +
      '<label' + de('formPhone') + '>' + esc(d.formPhone) + '</label><input type="tel" name="phone" autocomplete="tel">' +
      '<label class="agr"><input type="checkbox" required><span' + de('formAgree') + '>' + esc(d.formAgree) + '</span></label>' +
      '<button class="sbm" type="submit"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></form>' +
      '</div></div></section>' +
      '<footer class="mb-foot"><div class="wrap"><span class="mb-logo" style="color:#fff"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="lks">' + (d.footerLinks || []).map(function (l, i) { return '<a' + de('footerLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div>' +
      '<span class="cp"' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span></div></footer>' +
      fnjs + mot + '</body></html>';
  };


  window.MBM_SECTION_SPEC = {
    template: [{ type: 'count', tier: 'core' }, { type: 'about', tier: 'core' }, { type: 'program', tier: 'core' }, { type: 'info', tier: 'core' }, { type: 'statement', tier: 'core' }, { type: 'faq', tier: 'core' }],
    fixed: [],
    labels: { count: '카운트다운', about: '소개', program: '세션', info: '일정·장소', statement: '선언', faq: 'FAQ' },
  };
  window.MBM_STYLE = { id: 'mbm', name: 'Civil Blue', desc: '블루 히어로(교량 실사) · 앵커 GNB · 신청 폼 · FAQ 아코디언', swatch: 'linear-gradient(135deg,#006BDE 0%,#00BDDE 55%,#6BE016 100%)' };
})();
