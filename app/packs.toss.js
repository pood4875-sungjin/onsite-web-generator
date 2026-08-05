/* packs.toss.js — "챌린지 화이트" 랜딩 팩. classic <script src>.
   소스: toss.im/career/designer-challenge-2026 구조 실측(WebFetch — 히어로 초대형 타이틀+카운트다운,
   퀵링크 앵커, 타임라인, 챌린지 안내, 평가 기준, FAQ 13문, 참가 CTA 반복) + 토스 디자인 언어
   (화이트 · 잉크 #191F28 · 토스블루 #0064FF · 그레이 밴드 #F2F4F6 · pill 버튼 · 큰 자간 마이너스).
   콘텐츠는 자체 데모(카피 복제 안 함). 계약: renderTossPage(shared,{volume,motion}) → 완성 HTML,
   compose-web 평면 스키마 + DEMO 폴백, 전 텍스트 data-edit, 이미지 없음(타이포 중심). */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  var INK = '#191F28', BLUE = '#0064FF', SUB = '#4E5968', BAND = '#F2F4F6', LINE = '#E5E8EB';

  var DEMO = {
    productName: 'MIDAS Design Challenge 2026',
    navTitle: 'MIDAS Design Challenge',
    tagline: 'From problem\nto product',
    subcopy: '포트폴리오가 아니라 문제 해결로 증명하세요.\n제출한 솔루션만으로 잠재력을 평가합니다.',
    primaryCta: '참가하기',
    navLinks: ['일정', '챌린지 안내', '평가 기준', 'FAQ'],
    deadline: '2026-09-30T23:59:00+09:00',
    sessions: [
      { time: '9.1 (화)', title: '접수 시작 — 챌린지 브리프 공개', by: 'STEP 1' },
      { time: '9.30 (수) 23:59', title: '솔루션 제출 마감', by: 'STEP 2' },
      { time: '10.12 (월)', title: '결과 발표 · 인터뷰 안내', by: 'STEP 3' },
      { time: '10월 말', title: '최종 합류 제안', by: 'STEP 4' },
    ],
    features: [
      { title: '실무와 같은 문제', desc: '실제 제품에서 출발한 과제 하나를 깊게 풉니다. 정답이 아니라 사고 과정을 봅니다.' },
      { title: '링크로 제출', desc: 'Figma·웹사이트·영상 등 링크 기반 제출물이면 충분합니다. 형식 제한이 없습니다.' },
      { title: '전원 피드백', desc: '제출자 전원에게 리뷰 코멘트를 드립니다. 탈락도 성장의 기록이 됩니다.' },
    ],
    stats: [
      { value: '문제 정의', label: '올바른 문제를 찾았는가' },
      { value: '해결 설계', label: '흐름과 구조가 설득력 있는가' },
      { value: '비주얼 완성도', label: '디테일까지 끝까지 갔는가' },
    ],
    bannerText: '여섯 명이 회의 일정을 잡는 경험을\n다시 설계해 주세요',
    bannerCta: '',
    eventDate: '2026.9.1 (화) — 9.30 (수) 23:59',
    eventPlace: '온라인 제출 · 결과는 이메일로 안내',
    faq: [
      { q: '누구나 참가할 수 있나요?', a: '경력·학력 제한이 없습니다. 프로덕트 디자인에 진심이라면 누구든 환영합니다.' },
      { q: '팀으로 참가해도 되나요?', a: '이번 챌린지는 개인 단위로만 진행합니다. 본인의 사고 과정을 보고 싶기 때문이에요.' },
      { q: '제출물 형식이 정해져 있나요?', a: '접근 가능한 링크면 됩니다. Figma, 배포된 웹, 영상 모두 좋습니다. 드라이브 링크는 권한 문제로 받지 않아요.' },
      { q: '결과는 언제 알 수 있나요?', a: '제출 마감 후 2주 안에 전원에게 이메일로 안내합니다.' },
    ],
    ctaTitle: '문제를 푸는 디자이너를\n기다립니다',
    ctaSub: '지금 브리프를 확인하고 챌린지에 참가하세요.',
    footerLinks: ['챌린지 브리프', '자주 묻는 질문', '문의하기'],
    footerCopyright: '© 2026 MIDAS IT',
  };

  // 영문 폴백 데모 — _clang이 ko가 아니면 누락 필드가 이걸로 채워진다(KO 예시 누수 방지)
  var DEMO_EN = {
    productName: 'MIDAS Design Challenge 2026',
    navTitle: 'MIDAS Design Challenge',
    tagline: 'From problem\nto product',
    subcopy: 'Prove yourself with problem-solving, not a portfolio.\nWe evaluate potential from your submitted solution alone.',
    primaryCta: 'Enter now',
    navLinks: ['Timeline', 'About', 'Criteria', 'FAQ'],
    deadline: '2026-09-30T23:59:00+09:00',
    sessions: [
      { time: 'Sep 1 (Tue)', title: 'Entries open — challenge brief released', by: 'STEP 1' },
      { time: 'Sep 30 (Wed) 23:59', title: 'Submission deadline', by: 'STEP 2' },
      { time: 'Oct 12 (Mon)', title: 'Results & interview invitations', by: 'STEP 3' },
      { time: 'Late Oct', title: 'Final offers', by: 'STEP 4' },
    ],
    features: [
      { title: 'A real-work problem', desc: 'Go deep on one task drawn from a real product. We look at how you think, not a “right answer.”' },
      { title: 'Submit by link', desc: 'Figma, a website, or a video — any accessible link works. No format restrictions.' },
      { title: 'Feedback for everyone', desc: 'Every participant gets review comments. Even a miss becomes a record of growth.' },
    ],
    stats: [
      { value: 'Problem framing', label: 'Did you find the right problem?' },
      { value: 'Solution design', label: 'Is the flow and structure convincing?' },
      { value: 'Visual polish', label: 'Did you carry the details through?' },
    ],
    bannerText: 'Redesign how six people\nschedule a meeting',
    bannerCta: '',
    eventDate: 'Sep 1 (Tue) — Sep 30 (Wed) 23:59, 2026',
    eventPlace: 'Submit online · results by email',
    faq: [
      { q: 'Can anyone enter?', a: 'No limits on experience or education. If you\u2019re serious about product design, you\u2019re welcome.' },
      { q: 'Can I enter as a team?', a: 'This challenge is individual only — we want to see your own thinking.' },
      { q: 'Is there a required format?', a: 'Any accessible link: Figma, a deployed site, or a video. Drive links aren\u2019t accepted due to permissions.' },
      { q: 'When will I hear back?', a: 'Everyone gets an email within two weeks after the deadline.' },
    ],
    ctaTitle: 'We\u2019re waiting for designers\nwho solve problems',
    ctaSub: 'Check the brief and enter the challenge now.',
    footerLinks: ['Challenge Brief', 'FAQ', 'Contact'],
    footerCopyright: '\u00a9 2026 MIDAS IT',
  };

  function css() {
    return [
      '*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}',
      'body{font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:' + INK + ';background:#fff;-webkit-font-smoothing:antialiased}',
      'img{max-width:100%}ul{list-style:none}a{text-decoration:none;color:inherit}',
      '.wrap{max-width:1080px;margin:0 auto;padding:0 28px}',
      /* GNB — 화이트 · 워드마크 · 앵커 · 블루 pill */
      '.ts-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(25,31,40,.06)}',
      '.ts-nav .wrap{display:flex;align-items:center;gap:36px;height:64px}',
      '.ts-logo{font-weight:800;font-size:17.5px;letter-spacing:-.02em;white-space:nowrap}',
      '.ts-menu{display:flex;gap:28px;font-size:15px;font-weight:600;color:' + SUB + ';margin-left:auto}',
      '.ts-menu a{transition:color .15s}.ts-menu a:hover{color:' + INK + '}',
      '.ts-navcta{display:inline-block;background:' + BLUE + ';color:#fff;font-size:14.5px;font-weight:700;padding:10px 20px;border-radius:999px;white-space:nowrap;transition:background .15s,transform .15s}',
      '.ts-navcta:hover{background:#0050C8;transform:translateY(-1px)}',
      /* 히어로 — 센터 초대형 타이포 + 카운트다운 */
      '.ts-hero{padding:110px 0 96px;text-align:center}',
      '.ts-eb{display:inline-block;font-size:16px;font-weight:800;color:' + BLUE + ';letter-spacing:-.01em}',
      '.ts-ht{margin-top:16px;font-size:76px;font-weight:300;line-height:1.12;letter-spacing:-.035em;word-break:keep-all;text-wrap:balance}',
      '.ts-ht b{font-weight:700}',
      '.ts-hs{margin:26px auto 0;font-size:19px;line-height:1.6;color:' + SUB + ';max-width:560px;word-break:keep-all}',
      '.ts-hcta{display:inline-block;margin-top:36px;background:' + BLUE + ';color:#fff;font-size:17.5px;font-weight:700;padding:16px 42px;border-radius:999px;box-shadow:0 12px 30px rgba(0,100,255,.28);transition:transform .18s,box-shadow .18s}',
      '.ts-hcta:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(0,100,255,.36)}',
      '.ts-count{margin:34px auto 0;display:inline-flex;align-items:baseline;gap:10px;background:' + BAND + ';border-radius:14px;padding:13px 22px;font-variant-numeric:tabular-nums}',
      '.ts-count .lb{font-size:14px;font-weight:600;color:' + SUB + '}',
      '.ts-count b{font-size:20px;font-weight:800;letter-spacing:.01em}',
      /* 타임라인(일정) — 세로 스텝 */
      '.ts-tl{padding:96px 0}',
      '.ts-sec-tt{font-size:38px;font-weight:800;letter-spacing:-.03em;text-align:center;word-break:keep-all}',
      '.ts-steps{margin:52px auto 0;max-width:720px;display:flex;flex-direction:column}',
      '.ts-step{position:relative;display:grid;grid-template-columns:150px 1fr;gap:26px;padding:22px 0 26px 0}',
      '.ts-step:before{content:"";position:absolute;left:161px;top:34px;bottom:-8px;width:2px;background:' + LINE + '}',
      '.ts-step:last-child:before{display:none}',
      '.ts-step:after{content:"";position:absolute;left:156px;top:24px;width:12px;height:12px;border-radius:50%;background:' + BLUE + ';box-shadow:0 0 0 4px rgba(0,100,255,.14)}',
      '.ts-step .tm{font-size:15px;font-weight:700;color:' + BLUE + ';text-align:right;padding-right:26px;padding-top:2px}',
      '.ts-step .bd{padding-left:26px}',
      '.ts-step .st{font-size:19px;font-weight:700;letter-spacing:-.02em;word-break:keep-all}',
      '.ts-step .by{margin-top:5px;font-size:13.5px;color:#8B95A1;font-weight:600;letter-spacing:.04em}',
      /* 챌린지 안내 카드 — 그레이 밴드 r20 */
      '.ts-ft{background:' + BAND + ';padding:104px 0}',
      '.ts-cards{margin-top:52px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}',
      '.ts-card{background:#fff;border-radius:20px;padding:34px 30px;transition:transform .25s ease,box-shadow .25s ease}',
      '.ts-card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(25,31,40,.08)}',
      '.ts-card .no{font-size:14px;font-weight:800;color:' + BLUE + '}',
      '.ts-card h3{margin-top:12px;font-size:21px;font-weight:800;letter-spacing:-.02em;word-break:keep-all}',
      '.ts-card p{margin-top:10px;font-size:15.5px;line-height:1.6;color:' + SUB + ';word-break:keep-all}',
      /* 브리프 인용 — 블루 풀블리드 */
      '.ts-brief{background:' + BLUE + ';padding:120px 0;text-align:center}',
      '.ts-brief .q{font-size:15px;font-weight:800;color:rgba(255,255,255,.7);letter-spacing:.14em}',
      '.ts-brief .tx{margin-top:18px;font-size:44px;font-weight:800;line-height:1.32;letter-spacing:-.03em;color:#fff;word-break:keep-all;text-wrap:balance}',
      /* 평가 기준 — 3col */
      '.ts-ev{padding:104px 0}',
      '.ts-crit{margin-top:52px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:center}',
      '.ts-crit .c{padding:30px 18px;border-top:3px solid ' + BLUE + ';background:#fff;box-shadow:0 1px 0 ' + LINE + ' inset}',
      '.ts-crit b{display:block;font-size:23px;font-weight:800;letter-spacing:-.02em;word-break:keep-all}',
      '.ts-crit span{display:block;margin-top:10px;font-size:15px;color:' + SUB + ';word-break:keep-all}',
      /* 일시·방법 안내 라인 */
      '.ts-info{max-width:720px;margin:60px auto 0;background:' + BAND + ';border-radius:16px;padding:26px 32px;display:flex;gap:40px;justify-content:center;flex-wrap:wrap}',
      '.ts-info .i b{font-size:14px;color:#8B95A1;font-weight:700;display:block}',
      '.ts-info .i span{display:block;margin-top:5px;font-size:16.5px;font-weight:700;word-break:keep-all}',
      /* FAQ — 라인 아코디언 */
      '.ts-faq{padding:96px 0 110px}',
      '.ts-qs{margin:44px auto 0;max-width:760px}',
      '.ts-q{border-bottom:1px solid ' + LINE + ';padding:22px 4px;cursor:pointer}',
      '.ts-q .qh{display:flex;justify-content:space-between;gap:16px;font-size:18px;font-weight:700;letter-spacing:-.02em;word-break:keep-all}',
      '.ts-q .qh i{font-style:normal;color:#B0B8C1;transition:transform .2s}',
      '.ts-q .qa{max-height:0;overflow:hidden;transition:max-height .28s ease;font-size:16px;line-height:1.6;color:' + SUB + ';word-break:keep-all}',
      '.ts-q.open .qh{color:' + BLUE + '}.ts-q.open .qh i{transform:rotate(45deg);color:' + BLUE + '}',
      '.ts-q.open .qa{max-height:200px;margin-top:12px}',
      /* CTA — 잉크 다크 */
      '.ts-cta{background:' + INK + ';padding:110px 0;text-align:center}',
      '.ts-cta .tt{font-size:44px;font-weight:800;line-height:1.28;letter-spacing:-.03em;color:#fff;word-break:keep-all;text-wrap:balance}',
      '.ts-cta .sub{margin-top:16px;font-size:17px;color:rgba(255,255,255,.66)}',
      '.ts-cta .btn{display:inline-block;margin-top:34px;background:' + BLUE + ';color:#fff;font-size:17.5px;font-weight:700;padding:16px 44px;border-radius:999px;transition:transform .18s}',
      '.ts-cta .btn:hover{transform:translateY(-2px)}',
      /* 푸터 */
      '.ts-foot{padding:38px 0;border-top:1px solid ' + LINE + '}',
      '.ts-foot .wrap{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}',
      '.ts-foot .lg{font-weight:800;font-size:15.5px}',
      '.ts-foot .lks{display:flex;gap:22px;font-size:14px;color:' + SUB + '}',
      '.ts-foot .cp{font-size:13px;color:#8B95A1}',
      /* 앵커 보정 + 모션 */
      '.ts-tl,.ts-ft,.ts-ev,.ts-faq,.ts-cta{scroll-margin-top:70px}',
      '.rv{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}',
      '.rv.in{opacity:1;transform:none}',
      '.ts-hero .ts-eb,.ts-hero .ts-ht,.ts-hero .ts-hs,.ts-hero .ts-hcta,.ts-hero .ts-count{opacity:0;transform:translateY(20px);animation:tsUp .7s cubic-bezier(.2,.7,.2,1) forwards}',
      '.ts-hero .ts-ht{animation-delay:.08s}.ts-hero .ts-hs{animation-delay:.16s}.ts-hero .ts-hcta{animation-delay:.24s}.ts-hero .ts-count{animation-delay:.32s}',
      '@keyframes tsUp{to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){.rv,.ts-hero .ts-eb,.ts-hero .ts-ht,.ts-hero .ts-hs,.ts-hero .ts-hcta,.ts-hero .ts-count{opacity:1;transform:none;animation:none;transition:none}}',
      '@media (max-width:960px){.ts-cards,.ts-crit{grid-template-columns:1fr}.ts-ht{font-size:52px}}',
      '@media (max-width:600px){.ts-nav .wrap{gap:12px;height:56px}.ts-menu{display:none}.ts-logo{font-size:15px}.ts-navcta{padding:8px 15px;font-size:13px}',
      '.ts-hero{padding:74px 0 66px}.ts-ht{font-size:38px}.ts-hs{font-size:16px}.ts-sec-tt{font-size:27px}',
      '.ts-step{grid-template-columns:100px 1fr;gap:18px}.ts-step:before{left:111px}.ts-step:after{left:106px}.ts-step .tm{padding-right:18px;font-size:13px}',
      '.ts-brief .tx{font-size:28px}.ts-cta .tt{font-size:30px}.ts-info{gap:18px;padding:22px 24px}}',
      '[data-edit]{white-space:pre-wrap}',
    ].join('\n');
  }

  window.renderTossPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    // 템플릿 고정 라벨 — 산출물 언어(_clang) 기준 + 타이틀 강약(첫 줄 볼드/다음 라이트, **마커** 우선)
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
    var TT = {
      ko: { tl: '진행 일정', ab: '이런 챌린지예요', ev: '이렇게 평가해요', faq: '자주 묻는 질문', sch: '일정', how: '참여 방법', cd: '마감까지' },
      en: { tl: 'Timeline', ab: 'About the challenge', ev: 'How we evaluate', faq: 'FAQ', sch: 'Schedule', how: 'How to enter', cd: 'Deadline' },
      ja: { tl: 'スケジュール', ab: 'チャレンジ概要', ev: '評価基準', faq: 'よくある質問', sch: '日程', how: '参加方法', cd: '締切まで' },
      zh: { tl: '日程安排', ab: '挑战介绍', ev: '评审标准', faq: '常见问题', sch: '日程', how: '参与方式', cd: '截止倒计时' },
    }[LANG];

    var feats = (d.features && d.features.length ? d.features : BD.features).slice(0, 3);
    var faq = (shared.faq && shared.faq.length ? shared.faq : BD.faq).slice(0, 8);
    var stats = (d.stats && d.stats.length ? d.stats : BD.stats).slice(0, 3);
    var sess = (d.sessions && d.sessions.length ? d.sessions : BD.sessions).slice(0, 6);
    var anchors = ['#timeline', '#about', '#criteria', '#faq'];
    var menu = (d.navLinks || []).slice(0, 4).map(function (l, i) {
      return '<a href="' + anchors[i % anchors.length] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>';
    }).join('');
    var steps = sess.map(function (s, i) {
      var P = 'sessions.' + i;
      return '<div class="ts-step rv"><span class="tm"' + de(P + '.time') + '>' + esc(s.time || '') + '</span>' +
        '<div class="bd"><div class="st"' + de(P + '.title') + '>' + esc(s.title || '') + '</div>' +
        (s.by ? '<div class="by"' + de(P + '.by') + '>' + esc(s.by) + '</div>' : '') + '</div></div>';
    }).join('');
    var cards = feats.map(function (f, i) {
      var P = 'features.' + i;
      return '<div class="ts-card rv"><span class="no">0' + (i + 1) + '</span><h3' + de(P + '.title') + '>' + ml(f.title || '') + '</h3><p' + de(P + '.desc') + '>' + ml(f.desc || '') + '</p></div>';
    }).join('');
    var crit = stats.map(function (s, i) {
      return '<div class="c rv"><b' + de('stats.' + i + '.value') + '>' + esc(s.value || '') + '</b><span' + de('stats.' + i + '.label') + '>' + esc(s.label || '') + '</span></div>';
    }).join('');
    var qs = faq.map(function (f, i) {
      return '<div class="ts-q' + (i === 0 ? ' open' : '') + '"><div class="qh"><span' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</span><i>+</i></div>' +
        '<div class="qa"' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</div></div>';
    }).join('');
    var fnjs = '<script>(function(){' +
      'document.querySelectorAll(".ts-q").forEach(function(q){q.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;q.classList.toggle("open");});});' +
      'var cd=document.querySelector(".ts-count");if(cd){var end=new Date(cd.getAttribute("data-deadline")||"").getTime();' +
      'if(isFinite(end)){var t=function(){var ms=Math.max(0,end-Date.now());var dd=Math.floor(ms/86400000),h=String(Math.floor(ms/3600000)%24).padStart(2,"0"),m=String(Math.floor(ms/60000)%60).padStart(2,"0"),s=String(Math.floor(ms/1000)%60).padStart(2,"0");' +
      'cd.querySelector("b").textContent="D-"+dd+" "+h+":"+m+":"+s;};t();setInterval(t,1000);}else{cd.style.display="none";}}' +
      '})();<\/script>';
    var mot = opts.motion === false ? '' :
      '<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.14});document.querySelectorAll(".rv").forEach(function(e){io.observe(e);});})();<\/script>';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      '<style>' + css() + '</style></head><body data-pack="toss">' +
      '<nav class="ts-nav"><div class="wrap"><span class="ts-logo"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="ts-menu">' + menu + '</div>' +
      '<a class="ts-navcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></nav>' +
      '<header class="ts-hero"><div class="wrap">' +
      '<span class="ts-eb"' + de('productName') + '>' + esc(d.productName) + '</span>' +
      '<h1 class="ts-ht"' + de('tagline') + '>' + mixT(d.tagline) + '</h1>' +
      '<p class="ts-hs"' + de('subcopy') + '>' + ml(d.subcopy) + '</p>' +
      '<div><a class="ts-hcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>' +
      '<div class="ts-count" data-deadline="' + esc(d.deadline || '') + '"><span class="lb">' + esc(TT.cd) + '</span><b>D-00 00:00:00</b></div>' +
      '</div></header>' +
      (function () {
        // 섹션 조립 — sectionOrder·hiddenSections + data-section
        var SEC = {
          timeline: '<section class="ts-tl" id="timeline" data-section="timeline"><div class="wrap"><h2 class="ts-sec-tt rv">' + esc(TT.tl) + '</h2><div class="ts-steps">' + steps + '</div></div></section>',
          about: '<section class="ts-ft" id="about" data-section="about"><div class="wrap"><h2 class="ts-sec-tt rv">' + esc(TT.ab) + '</h2><div class="ts-cards">' + cards + '</div></div></section>',
          brief: '<section class="ts-brief" data-section="brief"><div class="wrap rv"><div class="q">CHALLENGE BRIEF</div><p class="tx"' + de('bannerText') + '>' + ml(d.bannerText) + '</p></div></section>',
          criteria: '<section class="ts-ev" id="criteria" data-section="criteria"><div class="wrap"><h2 class="ts-sec-tt rv">' + esc(TT.ev) + '</h2><div class="ts-crit">' + crit + '</div>' +
            '<div class="ts-info rv"><div class="i"><b>' + esc(TT.sch) + '</b><span' + de('eventDate') + '>' + esc(d.eventDate || '') + '</span></div>' +
            '<div class="i"><b>' + esc(TT.how) + '</b><span' + de('eventPlace') + '>' + ml(d.eventPlace || '') + '</span></div></div></div></section>',
          faq: '<section class="ts-faq" id="faq" data-section="faq"><div class="wrap"><h2 class="ts-sec-tt rv">' + esc(TT.faq) + '</h2><div class="ts-qs rv">' + qs + '</div></div></section>',
        };
        var ORDER = ['timeline', 'about', 'brief', 'criteria', 'faq'];
        var saved = (Array.isArray(shared.sectionOrder) ? shared.sectionOrder : []).filter(function (k) { return SEC[k]; });
        var order = saved.concat(ORDER.filter(function (k) { return saved.indexOf(k) < 0; }));
        var hid = shared.hiddenSections || [];
        return order.filter(function (k) { return hid.indexOf(k) < 0; }).map(function (k) { return SEC[k]; }).join('');
      })() +
      '<section class="ts-cta" id="apply"><div class="wrap rv"><h2 class="tt"' + de('ctaTitle') + '>' + ml(d.ctaTitle) + '</h2>' +
      '<p class="sub"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
      '<a class="btn"' + de('bannerCta') + '>' + esc(d.bannerCta || d.primaryCta) + '</a></div></section>' +
      '<footer class="ts-foot"><div class="wrap"><span class="lg"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="lks">' + (d.footerLinks || []).map(function (l, i) { return '<a' + de('footerLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div>' +
      '<span class="cp"' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span></div></footer>' +
      fnjs + mot + '</body></html>';
  };


  window.TOSS_SECTION_SPEC = {
    template: [{ type: 'timeline', tier: 'core' }, { type: 'about', tier: 'core' }, { type: 'brief', tier: 'core' }, { type: 'criteria', tier: 'core' }, { type: 'faq', tier: 'core' }],
    fixed: [],
    labels: { timeline: '일정', about: '소개', brief: '브리프 밴드', criteria: '평가 기준', faq: 'FAQ' },
  };
  window.TOSS_STYLE = { id: 'toss', name: '챌린지 화이트', desc: '초대형 타이포 히어로 · 타임라인 · 블루 브리프 밴드 · 카운트다운', swatch: 'linear-gradient(135deg,#fff 0%,#fff 46%,#0064FF 46%,#0064FF 100%)' };
})();
