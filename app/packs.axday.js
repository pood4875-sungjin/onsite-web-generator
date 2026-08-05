/* packs.axday.js — "AX Day 오렌지" 세미나 집객 랜딩 팩. classic <script src>.
   소스: https://contents.h.place/seminar/ax-day 실측(2026-08-05).
   톤앤매너: 화이트 베이스 + 잉크 #030712 · 임팩트 오렌지 밴드 #FF5500 · 블루 CTA #00A3FE ·
   pill 버튼(r999, 블랙/화이트) · 센터 블랙 섹션 타이틀 · 포토 카드(캡션+태그 칩) ·
   다크 포토 세션 카드 · 일정/장소 정보 카드 · 미니멀 FAQ(보더 라인 + '+'). 폰트 Pretendard. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  var ORANGE = '#FF5500', BLUE = '#00A3FE', INK = '#030712';

  var DEMO = {
    productName: 'AX DAY',
    eyebrow: '채용, 에이전트로 완성하다',
    tagline: 'AX DAY',
    subcopy: '채용 에이전트로 완전히 달라질 HR의 변화, AX DAY에서 확인하세요!\nAI 에이전트 시대, HR의 업무 방식도 이제 달라져야 합니다.',
    primaryCta: '신청하기',
    features: [
      { tag: 'Experience', title: '채용이 바뀌는 순간', desc: '에이전트가 공개하는 최신 기능을 만나보세요. 우리 기업만의 특화된 채용 시나리오에 맞춰 채용 과정이 어떻게 바뀌는지 확인해 보세요.', chips: ['실시간 시연', '에이전트 활용법', '1:1 컨설팅'] },
      { tag: 'Insight', title: 'AI가 바꾸는 2026', desc: 'AI 시대, HR 담당자의 역할과 업무 방식은 어떻게 달라질까요? 현장에서 즉시 활용할 수 있는 전략과 인사이트를 얻어갑니다.', chips: ['키노트', '인사이트', '활용사례'] },
      { tag: 'Activity', title: '함께 즐기는 액티비티', desc: 'HR 동료들을 만나 인사이트를 나누고, 담당자만을 위해 준비된 특별한 액티비티를 즐겨보세요. 다양한 이벤트와 풍성한 선물까지 모두 준비되어 있어요.', chips: ['이벤트', '네트워킹', '플레이그라운드'] },
    ],
    sessions: [
      { time: '14:10 - 14:50', title: '채용,\n에이전트로 완성하다', by: '마이다스그룹 기획자' },
      { time: '14:50 - 15:30', title: '경험을 넘어 실행까지:\n체험/컨설팅', by: '마이다스 컨설턴트' },
      { time: '15:30 - 16:00', title: '에이전트 200% 활용한\n마이다스 사례', by: '마이다스그룹 HR 담당자' },
    ],
    eventDate: '2026.10.15 (목) 13:30 - 16:00',
    deadline: '2026-10-13T18:00:00+09:00',
    eventPlace: '섬유센터빌딩 Tex Fa Hall (강남)\n삼성역 4번 출구에서 도보 4분',
    faq: [
      { q: '세미나에 참가비가 있나요?', a: '무료로 진행됩니다. 사전 신청 후 참석 확정 안내를 받으시면 됩니다.' },
      { q: '세미나 신청은 언제까지 할 수 있나요?', a: '좌석이 마감되기 전까지 신청할 수 있습니다. 조기 마감될 수 있어요.' },
      { q: '주차 지원이 가능한가요?', a: '행사장 주차 공간이 제한적입니다. 대중교통 이용을 권장드립니다.' },
      { q: '현장 등록이 가능한가요?', a: '사전 신청자 우선으로 운영되며, 잔여석이 있는 경우 현장 등록이 가능합니다.' },
    ],
    ctaTitle: 'AX DAY를 신청하세요',
    footerLinks: ['채용 에이전트', '사용 가이드', 'AX DAY'],
    footerCopyright: '© 2026. JAINWON Inc. All rights reserved.',
  };

  // 영문 폴백 데모 — _clang이 ko가 아니면 누락 필드가 이걸로 채워진다(KO 예시 누수 방지). ja/zh도 EN 폴백(데이터 번역은 번역 버튼 소관).
  var DEMO_EN = {
    productName: 'AX DAY',
    eyebrow: 'Hiring, completed by agents',
    tagline: 'AX DAY',
    subcopy: 'See how HR changes with hiring agents — at AX DAY!\nIn the age of AI agents, the way HR works must change too.',
    primaryCta: 'Register',
    features: [
      { tag: 'Experience', title: 'The moment hiring changes', desc: 'Meet the latest agent features live and see how your hiring flow transforms for your company\u2019s own scenarios.', chips: ['Live demo', 'Agent playbook', '1:1 consulting'] },
      { tag: 'Insight', title: 'AI reshapes 2026', desc: 'How will HR roles and workflows change in the AI era? Take home strategies and insights you can use right away.', chips: ['Keynote', 'Insights', 'Case studies'] },
      { tag: 'Activity', title: 'Activities to enjoy together', desc: 'Meet fellow HR professionals, share insights, and enjoy special activities prepared just for you — with plenty of gifts.', chips: ['Events', 'Networking', 'Playground'] },
    ],
    sessions: [
      { time: '14:10 - 14:50', title: 'Hiring,\ncompleted by agents', by: 'MIDAS Group Planner' },
      { time: '14:50 - 15:30', title: 'Beyond experience:\nhands-on & consulting', by: 'MIDAS Consultant' },
      { time: '15:30 - 16:00', title: 'How MIDAS uses agents\nat 200%', by: 'MIDAS Group HR' },
    ],
    eventDate: 'Oct 15 (Thu), 2026 · 13:30 - 16:00',
    deadline: '2026-10-13T18:00:00+09:00',
    eventPlace: 'Tex Fa Hall, Textile Center (Gangnam)\n4 min from Samseong Stn. Exit 4',
    faq: [
      { q: 'Is there an entry fee?', a: 'It\u2019s free. Register in advance and you\u2019ll receive a confirmation.' },
      { q: 'Until when can I register?', a: 'Until seats run out — early closing is possible.' },
      { q: 'Is parking available?', a: 'On-site parking is limited. Public transit is recommended.' },
      { q: 'Can I register on site?', a: 'Pre-registered guests come first; walk-ins are accepted if seats remain.' },
    ],
    ctaTitle: 'Register for AX DAY',
    footerLinks: ['Hiring Agent', 'User Guide', 'AX DAY'],
    footerCopyright: '\u00a9 2026. JAINWON Inc. All rights reserved.',
  };

  /* 포토 자리 — Unsplash 실사진(키 불필요 직링크, 전수 실검증) + 로드 실패 시 추상 모형 폴백.
     출처: unsplash.com — 청중/스피커 무대/행사장/마이크/홀 와이드 */
  var UIMG = {
    crowd:   '1540575467063-178a50c2df87',   // 컨퍼런스 청중
    stage:   '1505373877841-8d25f7d46678',   // 스피커 + 대형 스크린
    venue:   '1511578314322-379afb476865',   // 행사장 테이블 세팅
    mic:     '1475721027785-f74eccf877e2',   // 마이크 클로즈업
    hall:    '1587825140708-dfaf72ae4b04',   // 대형 홀 와이드
  };
  function stockUrl(key, w, h) {
    return 'https://images.unsplash.com/photo-' + (UIMG[key] || UIMG.crowd) + '?w=' + (w || 800) + '&h=' + (h || 520) + '&q=78&auto=format&fit=crop';
  }
  var IMGS = {};   // renderAxdayPage 진입 시 shared.images로 채움 — 편집(피커)에서 바꾼 이미지 우선
  // 히어로 기본 = 첨부 원본 교량(mbm과 공유, bg/mbm-hero.jpg) — currentScript 기준 절대경로
  var BASE = (function () { try { var sc = document.currentScript && document.currentScript.src || ''; return sc ? sc.slice(0, sc.lastIndexOf('/') + 1) : ''; } catch (e) { return ''; } })();
  var BRIDGE = BASE + 'bg/mbm-hero.jpg';
  function photo(mode, key, w, h, slot) {
    var src = (slot && IMGS[slot]) || (key === 'bridge' ? BRIDGE : key ? stockUrl(key, w, h) : '');
    return '<div class="ax-ph ph ' + (mode || '') + '"' + (slot ? ' data-img="' + slot + '"' : '') + '><span class="sp s1"></span><span class="sp s2"></span><span class="sp s3"></span>' +
      (src ? '<img class="ai" loading="lazy" alt="" src="' + esc(src) + '" onerror="this.remove()">' : '') + '</div>';
  }

  function css() {
    return [
      '*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}',
      'body{font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:' + INK + ';background:#fff;-webkit-font-smoothing:antialiased}',
      'ul{list-style:none}a{text-decoration:none;color:inherit}button{font-family:inherit;cursor:pointer}',
      '.wrap{max-width:1180px;margin:0 auto;padding:0 30px}',
      /* nav */
      '.ax-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.9);backdrop-filter:blur(10px)}',
      '.ax-nav .wrap{display:flex;align-items:center;justify-content:center;gap:34px;height:60px;font-size:14.5px;color:#6B7280}',
      '.ax-nav .brand{position:absolute;left:30px;font-weight:900;font-size:19px;color:' + INK + '}',
      '.ax-nav .on{color:' + INK + ';font-weight:700}',
      /* hero */
      '.ax-hero{padding:84px 0 0;text-align:center}',
      /* 아이브로 = 오렌지 소제(타이틀과 강약 대비 — 사용자 피드백) */
      '.ax-eb{font-size:19px;font-weight:800;letter-spacing:-.01em;color:' + ORANGE + '}',
      /* 타이틀 강약 의무 — 베이스 라이트 300, <b>=900 (첫 줄 볼드/다음 줄 라이트, 사용자 레퍼런스) */
      '.ax-ht{margin-top:16px;font-size:82px;font-weight:300;letter-spacing:-.02em;line-height:1.08;word-break:keep-all}',
      '.ax-ht b{font-weight:900}',
      '.ax-hsub{margin:26px auto 0;font-size:19px;line-height:1.6;color:#4B5563;max-width:600px;word-break:keep-all}',
      '.ax-hero .ph-wide{margin-top:56px;height:460px;border-radius:0}',
      /* 오렌지 임팩트 밴드 */
      '.ax-band{background:' + ORANGE + ';color:#fff;padding:44px 0}',
      '.ax-band .wrap{display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;text-align:left}',
      '.ax-band .bt{font-size:23px;font-weight:800;letter-spacing:-.03em}',
      '.ax-band .bs{margin-top:10px;font-size:15.5px;line-height:1.5;opacity:.92;font-weight:400}',
      '.ax-pill{background:#fff;color:' + INK + ';font-size:16px;font-weight:700;padding:14px 30px;border-radius:999px;border:0;flex:none}',
      /* 섹션 공통 */
      /* 섹션 지브라 — 미세한 배경으로 섹션 경계 구분(사용자 피드백) + 넉넉한 여백 */
      '.ax-sec{padding:104px 0}',
      '.ax-sec.alt{background:#F7F9FB}',
      '.ax-tt{text-align:center;font-size:38px;font-weight:800;letter-spacing:-.035em;word-break:keep-all}',
      '.ax-tt+*{margin-top:52px}',
      /* 이유 3카드 */
      '.ax-cards{margin-top:54px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}',
      '.ax-card{border:1px solid rgba(3,7,18,.09);border-radius:14px;overflow:hidden;background:#fff}',
      '.ax-card .ph{height:190px}','.ax-hero .ph-wide .ph{height:100%}',
      '.ax-card .bd{padding:24px 24px 26px}',
      '.ax-card .cap{font-size:13.5px;color:#9AA0A6;font-weight:600}',
      '.ax-card .ct{margin-top:8px;font-size:22px;font-weight:800;letter-spacing:-.03em}',
      '.ax-card .ds{margin-top:12px;font-size:15px;line-height:1.6;color:#4B5563}',
      '.ax-chips{margin-top:18px;display:flex;gap:8px;flex-wrap:wrap}',
      '.ax-chips span{font-size:12.5px;color:#6B7280;border:1px solid rgba(3,7,18,.12);border-radius:999px;padding:6px 12px}',
      /* 세션 다크 카드 */
      '.ax-ses{margin-top:54px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}',
      '.ax-s{position:relative;border-radius:14px;overflow:hidden;min-height:400px;display:flex;flex-direction:column;justify-content:flex-end;padding:26px;color:#fff}',
      '.ax-s .ph{position:absolute;inset:0}',
      '.ax-s:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,7,18,0) 30%,rgba(3,7,18,.82) 88%)}',
      '.ax-s .tm{position:relative;z-index:2;font-size:14px;opacity:.85}',
      '.ax-s .st{position:relative;z-index:2;margin-top:8px;font-size:24px;font-weight:800;letter-spacing:-.03em;line-height:1.32}',
      '.ax-s .by{position:relative;z-index:2;margin-top:12px;font-size:14px;opacity:.85}',
      '.ax-s .plus{position:absolute;z-index:2;top:18px;right:18px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.16);backdrop-filter:blur(4px);display:grid;place-items:center;font-size:20px}',
      /* 일정·장소 */
      '.ax-info{margin-top:54px;background:#F5F6F7;border-radius:16px;display:grid;grid-template-columns:1fr 1.4fr;overflow:hidden}',
      '.ax-info .l{padding:40px}',
      '.ax-info .l .nm{font-size:30px;font-weight:900;letter-spacing:-.02em}',
      '.ax-info table{margin-top:26px;border-collapse:collapse;font-size:16px}',
      '.ax-info th{color:#9AA0A6;font-weight:600;text-align:left;padding:9px 26px 9px 0;vertical-align:top;white-space:nowrap}',
      '.ax-info td{color:' + INK + ';padding:9px 0;line-height:1.5;font-weight:600}',
      '.ax-info .pill-dark{margin-top:30px;background:' + INK + ';color:#fff;font-size:15px;font-weight:700;padding:13px 28px;border-radius:999px;border:0}',
      '.ax-map{position:relative;background:linear-gradient(135deg,#EDEFF2,#E1E5EA)}',
      '.ax-map .pin{position:absolute;left:44%;top:40%;width:34px;height:34px;border-radius:50% 50% 50% 0;background:' + ORANGE + ';transform:rotate(-45deg);box-shadow:0 10px 24px rgba(255,85,0,.4)}',
      '.ax-map .pin:after{content:"";position:absolute;inset:10px;border-radius:50%;background:#fff}',
      '.ax-map .rd1,.ax-map .rd2{position:absolute;background:rgba(3,7,18,.08)}',
      '.ax-map .rd1{left:0;right:0;top:56%;height:14px;transform:rotate(-7deg)}',
      '.ax-map .rd2{top:0;bottom:0;left:62%;width:14px;transform:rotate(9deg)}',
      /* FAQ 미니멀 */
      '.ax-faq{max-width:900px;margin:54px auto 0}',
      '.ax-q{border-bottom:1px solid rgba(3,7,18,.1);padding:24px 6px;cursor:pointer}',
      '.ax-q .qh{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:18.5px;font-weight:600;letter-spacing:-.02em}',
      '.ax-q .qh i{font-style:normal;font-size:22px;color:#9AA0A6;transition:transform .2s}',
      '.ax-q .qa{max-height:0;overflow:hidden;transition:max-height .26s ease;font-size:16px;line-height:1.6;color:#4B5563}',
      '.ax-q.open .qh i{transform:rotate(45deg);color:' + INK + '}',
      '.ax-q.open .qa{max-height:200px;margin-top:12px}',
      /* CTA 블루 */
      /* 마지막 배너 = 그라데이션(사용자 지정) — 시안블루→딥블루 + 오렌지 글로우 */
      '.ax-cta{position:relative;overflow:hidden;background:linear-gradient(118deg,' + BLUE + ' 0%,#2E5BFF 100%);padding:110px 0;text-align:center;color:#fff}',
      '.ax-cta:before{content:"";position:absolute;inset:0;background:radial-gradient(52% 90% at 84% 8%,rgba(255,85,0,.34),transparent 68%);pointer-events:none}',
      '.ax-cta>.wrap{position:relative}',
      '.ax-cta .tt{font-size:42px;font-weight:900;letter-spacing:-.03em}',
      '.ax-cta .pill-dark{margin-top:32px;background:' + INK + ';color:#fff;font-size:16px;font-weight:700;padding:14px 34px;border-radius:999px;border:0}',
      /* footer */
      '.ax-foot{background:#F5F6F7;padding:30px 0;font-size:13px;color:#9AA0A6}',
      '.ax-foot .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}',
      /* 카운트다운 스트립 */
      '.ax-count{background:' + INK + ';color:#fff;padding:16px 0}',
      '.ax-count .wrap{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap}',
      '.ax-count .lb{font-size:14.5px;color:#9AA0A6;font-weight:600}',
      '.ax-count .seg{display:flex;align-items:baseline;gap:5px}',
      '.ax-count .seg b{font-size:24px;font-weight:800;font-variant-numeric:tabular-nums;background:rgba(255,255,255,.1);border-radius:8px;padding:2px 7px;min-width:36px;text-align:center}',
      '.ax-count .seg span{font-size:12px;color:#9AA0A6}',
      /* 호버 모션 */
      '.ax-card,.ax-s{transition:transform .28s ease,box-shadow .28s ease}',
      '.ax-card:hover{transform:translateY(-4px);box-shadow:0 20px 46px rgba(3,7,18,.12)}',
      '.ax-s:hover{transform:translateY(-4px);box-shadow:0 22px 50px rgba(3,7,18,.28)}',
      '.ax-pill,.pill-dark{transition:transform .18s ease}',
      '.ax-pill:hover,.pill-dark:hover{transform:translateY(-2px)}',
      /* 히어로 진입 스태거 */
      '.ax-eb,.ax-ht{opacity:0;transform:translateY(18px);animation:axUp .7s cubic-bezier(.2,.7,.2,1) forwards}',
      '.ax-ht{animation-delay:.12s}',
      '.ax-hero .ph-wide{opacity:0;animation:axUp .8s cubic-bezier(.2,.7,.2,1) .24s forwards}',
      '@keyframes axUp{to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){.rv,.ax-eb,.ax-ht,.ax-hero .ph-wide{opacity:1;transform:none;animation:none;transition:none}}',
      /* photo placeholder */
      '.ax-ph{position:relative;background:linear-gradient(130deg,#FF7A33 0%,' + ORANGE + ' 42%,#C63B00 100%);overflow:hidden}',
      '.ax-ph.dark{background:linear-gradient(150deg,#20242E 0%,#0B0E16 70%)}',
      '.ax-ph.cool{background:linear-gradient(130deg,#3B4252 0%,#12151D 80%)}',
      '.ax-ph .sp{position:absolute;border-radius:50%;background:rgba(255,255,255,.16)}',
      '.ax-ph .s1{width:42%;padding-top:42%;left:-8%;bottom:-24%}',
      '.ax-ph .s2{width:26%;padding-top:26%;right:6%;top:-10%;background:rgba(255,255,255,.1)}',
      '.ax-ph .s3{width:14%;padding-top:14%;right:30%;bottom:12%;background:rgba(3,7,18,.18)}',
      '.ax-ph .ai{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.rv{opacity:0;transform:translateY(24px);transition:opacity .65s cubic-bezier(.2,.7,.2,1),transform .65s cubic-bezier(.2,.7,.2,1)}',
      '.rv.in{opacity:1;transform:none}',
      '@media (max-width:960px){.ax-cards,.ax-ses{grid-template-columns:1fr}.ax-info{grid-template-columns:1fr}.ax-map{min-height:260px}.ax-ht{font-size:52px}.ax-tt{font-size:29px}.ax-cta .tt{font-size:31px}}',
      /* 모바일(≤600) — 내비 축약·타이포 축소·카운트다운 정리 */
      '@media (max-width:600px){.ax-nav .wrap{height:56px;gap:14px}.ax-nav .wrap a:not(.on){display:none}.ax-nav .brand{font-size:15.5px}',
      '.ax-hero{padding:56px 0 0}.ax-eb{font-size:15px}.ax-ht{font-size:42px}.ax-hsub{font-size:15.5px;margin-top:18px}.ax-hero .ph-wide{height:300px;margin-top:36px}',
      '.ax-band{padding:32px 0}.ax-band .bt{font-size:18px}.ax-band .bs{font-size:14px}',
      '.ax-count .wrap{gap:12px}.ax-count .lb{width:100%;text-align:center}.ax-count .seg b{font-size:19px}',
      '.ax-sec{padding:66px 0}.ax-tt{font-size:25px}.ax-tt+*{margin-top:36px}.ax-cta .tt{font-size:27px}}',
      '[data-edit]{white-space:pre-wrap}',
    ].join('\n');
  }

  window.renderAxdayPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    IMGS = shared.images || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    // eyebrow — AI 초안(tagline 있음)인데 eyebrow가 없으면 DEMO 예시("채용…") 대신 productName으로.
    // 첨부와 무관한 데모 카피가 실초안에 새는 것 방지. 과거 저장분에 KO 데모값이 박혀 있어도 자가치유.
    if (shared.tagline && (shared.eyebrow == null || shared.eyebrow === '' || shared.eyebrow === DEMO.eyebrow)) d.eyebrow = d.productName;
    // 템플릿 고정 라벨 — 산출물 언어(_clang)를 따른다. 데이터가 아니라 번역 파이프라인을 안 타므로 팩이 직접 처리.
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var TT = {
      ko: { why: '를 놓치면 안되는 이유', sv: '일정 및 장소', cd: '신청 마감까지', dt: '일시', pl: '장소' },
      en: { why: ' — why you can’t miss it', sv: 'Schedule & Venue', cd: 'Registration closes in', dt: 'Date', pl: 'Venue' },
      ja: { why: 'を見逃せない理由', sv: '日程・会場', cd: '申込締切まで', dt: '日時', pl: '会場' },
      zh: { why: ' — 不容错过的理由', sv: '日程与场地', cd: '距报名截止', dt: '日期', pl: '地点' },
    }[LANG];
    // 타이틀 강약 의무 — **마커** 있으면 그대로, 없으면 첫 줄 <b>볼드</b> + 다음 줄 라이트(한 줄이면 앞 단어 볼드)
    function mixT(s) {
      s = String(s == null ? '' : s);
      if (/\*\*/.test(s)) return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
      var lines = esc(s).split('\n');
      if (lines.length > 1) return lines.map(function (ln, i) { return i === 0 ? '<b>' + ln + '</b>' : ln; }).join('<br>');
      var w = lines[0].split(' ');
      if (w.length < 2) return '<b>' + lines[0] + '</b>';
      var n = Math.max(1, Math.round(w.length * 0.4));
      return '<b>' + w.slice(0, n).join(' ') + '</b> ' + w.slice(n).join(' ');
    }
    var feats = (d.features && d.features.length ? d.features : BD.features).slice(0, 3);
    var ses = (shared.sessions && shared.sessions.length ? shared.sessions
      : (shared.agenda && shared.agenda.length ? shared.agenda.map(function (a) { return { time: a.time, title: a.title, by: a.desc }; }) : BD.sessions)).slice(0, 3);
    var faq = (shared.faq && shared.faq.length ? shared.faq : BD.faq).slice(0, 6);
    var cards = feats.map(function (f, i) {
      var P = 'features.' + i;
      var chips = (f.chips || (!shared.tagline && BD.features[i] && BD.features[i].chips) || []).slice(0, 4).map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('');
      var IMGK = ['crowd', 'stage', 'venue'][i] || 'crowd';
      return '<div class="ax-card rv">' + photo(i === 1 ? 'dark' : i === 2 ? '' : 'cool', IMGK, 800, 480, 'feature.' + i) +
        '<div class="bd"><span class="cap">' + esc(f.tag || (BD.features[i] && BD.features[i].tag) || 'POINT 0' + (i + 1)) + '</span>' +
        '<h3 class="ct"' + de(P + '.title') + '>' + esc(f.title || '') + '</h3>' +
        '<p class="ds"' + de(P + '.desc') + '>' + ml(f.desc || '') + '</p>' +
        (chips ? '<div class="ax-chips">' + chips + '</div>' : '') + '</div></div>';
    }).join('');
    var sess = ses.map(function (s, i) {
      var P = 'sessions.' + i;
      return '<div class="ax-s rv">' + photo(i === 2 ? 'cool' : 'dark', ['stage', 'mic', 'crowd'][i] || 'stage', 700, 900, 'session.' + i) + '<span class="plus">+</span>' +
        '<span class="tm"' + de(P + '.time') + '>' + esc(s.time || '') + '</span>' +
        '<h3 class="st"' + de(P + '.title') + '>' + ml(s.title || '') + '</h3>' +
        '<span class="by"' + de(P + '.by') + '>' + esc(s.by || '') + '</span></div>';
    }).join('');
    var qs = faq.map(function (f, i) {
      return '<div class="ax-q' + (i === 0 ? ' open' : '') + '"><div class="qh"><span' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</span><i>+</i></div>' +
        '<div class="qa"' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</div></div>';
    }).join('');
    var mot = opts.motion === false ? '' :
      '<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.14});document.querySelectorAll(".rv").forEach(function(e){io.observe(e);});' +
      'document.querySelectorAll(".ax-q").forEach(function(q){q.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;q.classList.toggle("open");});});' +
      'var cd=document.querySelector(".ax-count");if(cd){var end=new Date(cd.getAttribute("data-deadline")||"").getTime();' +
      'if(isFinite(end)){var q=function(s){return cd.querySelector(s);};var t=function(){var ms=Math.max(0,end-Date.now());' +
      'var d2=Math.floor(ms/86400000),h=Math.floor(ms/3600000)%24,m=Math.floor(ms/60000)%60,s2=Math.floor(ms/1000)%60;' +
      'q("[data-cd=d]").textContent=String(d2).padStart(2,"0");q("[data-cd=h]").textContent=String(h).padStart(2,"0");' +
      'q("[data-cd=m]").textContent=String(m).padStart(2,"0");q("[data-cd=s]").textContent=String(s2).padStart(2,"0");};t();setInterval(t,1000);}else{cd.style.display="none";}}' +
      '})();<\/script>';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      '<style>' + css() + '</style></head><body data-pack="axday">' +
      '<nav class="ax-nav"><div class="wrap"><span class="brand"' + de('productName') + '>' + esc(d.productName) + '</span>' +
      (d.footerLinks || []).map(function (l, i) { return '<a' + (i === (d.footerLinks.length - 1) ? ' class="on"' : '') + de('footerLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div></nav>' +
      '<header class="ax-hero"><div class="wrap">' +
      '<p class="ax-eb"' + de('eyebrow') + '>' + esc(d.eyebrow) + '</p>' +
      '<h1 class="ax-ht"' + de('tagline') + '>' + mixT(d.tagline) + '</h1>' +
      '<p class="ax-hsub"' + de('subcopy') + '>' + ml(String(d.subcopy).split('\n')[0] || '') + '</p></div>' +
      '<div class="ph-wide">' + photo('', 'bridge', 1600, 620, 'hero') + '</div></header>' +
      '<section class="ax-band"><div class="wrap"><div><p class="bt"' + de('subcopy') + '>' + ml(String(d.subcopy).split('\n')[0] || '') + '</p>' +
      '<p class="bs">' + ml(String(d.subcopy).split('\n').slice(1).join('\n')) + '</p></div>' +
      '<button class="ax-pill"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></div></section>' +
      '<div class="ax-count" data-deadline="' + esc(d.deadline || '') + '"><div class="wrap"><span class="lb">' + esc(TT.cd) + '</span>' +
      '<span class="seg"><b data-cd="d">00</b><span>DAYS</span></span><span class="seg"><b data-cd="h">00</b><span>HRS</span></span><span class="seg"><b data-cd="m">00</b><span>MIN</span></span><span class="seg"><b data-cd="s">00</b><span>SEC</span></span></div></div>' +
      '<section class="ax-sec alt"><div class="wrap"><h2 class="ax-tt rv">' + esc(d.productName) + esc(TT.why) + '</h2>' +
      '<div class="ax-cards">' + cards + '</div></div></section>' +
      '<section class="ax-sec"><div class="wrap"><h2 class="ax-tt rv">SESSIONS</h2>' +
      '<div class="ax-ses">' + sess + '</div></div></section>' +
      '<section class="ax-sec alt"><div class="wrap"><h2 class="ax-tt rv">' + esc(TT.sv) + '</h2>' +
      '<div class="ax-info rv"><div class="l"><div class="nm"' + de('productName') + '>' + esc(d.productName) + '</div>' +
      '<table><tr><th>' + esc(TT.dt) + '</th><td' + de('eventDate') + '>' + esc(d.eventDate) + '</td></tr>' +
      '<tr><th>' + esc(TT.pl) + '</th><td' + de('eventPlace') + '>' + ml(d.eventPlace) + '</td></tr></table>' +
      '<button class="pill-dark"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></div>' +
      '<div class="ax-map"><span class="rd1"></span><span class="rd2"></span><span class="pin"></span></div></div></div></section>' +
      '<section class="ax-sec"><div class="wrap"><h2 class="ax-tt rv">FAQ</h2>' +
      '<div class="ax-faq rv">' + qs + '</div></div></section>' +
      '<section class="ax-cta"><div class="wrap"><h2 class="tt rv"' + de('ctaTitle') + '>' + ml(d.ctaTitle) + '</h2>' +
      '<button class="pill-dark rv"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></div></section>' +
      '<footer class="ax-foot"><div class="wrap"><span' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span>' +
      '<span>' + esc(d.productName) + '</span></div></footer>' +
      mot + '</body></html>';
  };

  window.AXDAY_STYLE = { id: 'axday', name: 'AX Day 오렌지', desc: '화이트·블랙 미니멀 · 오렌지 임팩트 밴드 · 포토 카드 · 블루 CTA', swatch: 'linear-gradient(115deg,#FFFFFF 0%,#FFFFFF 34%,#FF5500 34%,#FF5500 70%,#00A3FE 70%)' };
})();
