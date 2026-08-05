/* packs.orbit.js — "글로벌 오르빗" 랜딩 팩. classic <script src>.
   소스: event.wanted.co.kr/global-company 톤 추론(SPA라 실측 제한 — 추출 컬러 #0091FF·#717EFF·#FF8EBD·#2AB8FF)
   + 사용자 명세 "상단에 지구가 돌아가는" 히어로. 지구본 = CSS 전용(캔버스·외부 라이브러리 없음):
   구체(라디얼 셰이딩) 안에서 점 격자+경도선 레이어가 가로로 무한 패닝 → 자전 연출, 둘레에 멀티컬러 궤도 링.
   구성: 다크 GNB → 지구 히어로(+카운트다운) → 스탯 → 글래스 카드 ×3 → 세션 → 일정·장소 → FAQ → 그라데이션 CTA → 푸터.
   계약: renderOrbitPage(shared,{volume,motion}) → 완성 HTML, compose-web 평면 스키마 + DEMO 폴백, 전 텍스트 data-edit. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  var BG = '#050B1A', INK = '#EAF1FB', SUB = '#93A3BC', BLUE = '#0091FF', VIOLET = '#717EFF', PINK = '#FF8EBD', CYAN = '#2AB8FF';
  var GRAD = 'linear-gradient(93deg,' + BLUE + ',' + VIOLET + ' 55%,' + PINK + ')';

  var DEMO = {
    productName: 'GLOBAL AX SUMMIT 2026',
    navTitle: 'Global AX Summit',
    tagline: '세계로 가는 팀을 위한\n단 하루의 서밋',
    subcopy: '해외 진출을 준비하는 팀이 가장 먼저 만나야 할 인사이트.\n글로벌 시장 전략부터 현지 채용까지 하루에 압축했습니다.',
    primaryCta: '무료로 참가 신청',
    navLinks: ['소개', '세션', '일정·장소', 'FAQ'],
    deadline: '2026-10-20T18:00:00+09:00',
    features: [
      { title: '시장을 먼저 읽는 법', desc: '북미·동남아·유럽 진출 팀의 실제 데이터로 시장별 진입 전략을 비교합니다.' },
      { title: '글로벌 팀 빌딩', desc: '현지 채용과 원격 협업 체계를 먼저 만든 팀들의 노하우를 공유합니다.' },
      { title: '나에게 맞는 로드맵', desc: '현장 부스에서 우리 팀의 단계에 맞는 진출 로드맵을 1:1로 상담합니다.' },
    ],
    stats: [
      { value: '24', label: '글로벌 연사' },
      { value: '12', label: '국가별 세션' },
      { value: '1,000+', label: '참가 정원' },
    ],
    sessions: [
      { time: '10:00 - 11:00', title: '오프닝 키노트 — 국경 없는 제품의 시대', by: '키노트' },
      { time: '11:20 - 12:30', title: '북미 진출, 처음 90일의 기록', by: '트랙 A' },
      { time: '14:00 - 15:10', title: '글로벌 채용 — 시차를 이기는 팀', by: '트랙 B' },
      { time: '15:30 - 17:00', title: '패널 토크 · 네트워킹 라운지', by: '공통' },
    ],
    eventDate: '2026.10.24 (토) 10:00 - 17:00',
    eventPlace: '코엑스 그랜드볼룸\n삼성역 5·6번 출구 직결',
    bannerText: '가장 빠른 길은,\n먼저 가본 사람에게 묻는 것',
    bannerCta: '',
    faq: [
      { q: '참가비가 있나요?', a: '사전 신청 시 전 세션 무료입니다. 현장 등록은 좌석이 남는 경우에만 가능합니다.' },
      { q: '누구에게 맞는 행사인가요?', a: '해외 진출을 검토 중이거나 이미 시작한 팀의 창업자·리더·실무자 모두 환영합니다.' },
      { q: '세션 자료를 받을 수 있나요?', a: '행사 후 신청자 전원에게 발표 자료와 다시보기 링크를 이메일로 보내드립니다.' },
      { q: '주차 지원이 되나요?', a: '대중교통 이용을 권장합니다. 현장 주차는 유료이며 지원되지 않습니다.' },
    ],
    ctaTitle: '자리는 한정되어 있습니다',
    ctaSub: '지금 신청하고 글로벌 진출의 첫 지도를 받아 가세요.',
    footerLinks: ['행사 소개', '지난 서밋', '문의하기'],
    footerCopyright: '© 2026 MIDAS IT',
  };

  // 영문 폴백 데모 — _clang이 ko가 아니면 누락 필드가 이걸로 채워진다(KO 예시 누수 방지)
  var DEMO_EN = {
    productName: 'GLOBAL AX SUMMIT 2026',
    navTitle: 'Global AX Summit',
    tagline: 'One day of summit\nfor teams going global',
    subcopy: 'The insights every team preparing to expand abroad should meet first.\nGlobal market strategy to local hiring — compressed into one day.',
    primaryCta: 'Register free',
    navLinks: ['About', 'Sessions', 'Schedule', 'FAQ'],
    deadline: '2026-10-20T18:00:00+09:00',
    features: [
      { title: 'Read the market first', desc: 'Compare entry strategies with real data from teams expanding to North America, SEA, and Europe.' },
      { title: 'Global team building', desc: 'Learn from teams that built local hiring and remote collaboration first.' },
      { title: 'A roadmap for you', desc: 'Get a 1:1 consultation at the venue booth, matched to your team\u2019s stage.' },
    ],
    stats: [
      { value: '24', label: 'Global speakers' },
      { value: '12', label: 'Country sessions' },
      { value: '1,000+', label: 'Seats' },
    ],
    sessions: [
      { time: '10:00 - 11:00', title: 'Opening keynote — products without borders', by: 'Keynote' },
      { time: '11:20 - 12:30', title: 'North America: the first 90 days', by: 'Track A' },
      { time: '14:00 - 15:10', title: 'Global hiring — teams that beat time zones', by: 'Track B' },
      { time: '15:30 - 17:00', title: 'Panel talk · networking lounge', by: 'All' },
    ],
    eventDate: 'Oct 24 (Sat), 2026 · 10:00 - 17:00',
    eventPlace: 'COEX Grand Ballroom\nDirect from Samseong Stn. Exit 5·6',
    bannerText: 'The fastest route is asking\nsomeone who\u2019s been there',
    bannerCta: '',
    faq: [
      { q: 'Is there an entry fee?', a: 'All sessions are free with advance registration. Walk-ins only if seats remain.' },
      { q: 'Who is this event for?', a: 'Founders, leaders, and practitioners of teams considering or already expanding abroad.' },
      { q: 'Will session materials be shared?', a: 'All registrants receive slides and replay links by email after the event.' },
      { q: 'Is parking supported?', a: 'Public transit is recommended. On-site parking is paid and not supported.' },
    ],
    ctaTitle: 'Seats are limited',
    ctaSub: 'Register now and take home your first map to going global.',
    footerLinks: ['About', 'Past Summits', 'Contact'],
    footerCopyright: '\u00a9 2026 MIDAS IT',
  };

  function css() {
    return [
      '*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}',
      'body{font-family:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;color:' + INK + ';background:' + BG + ';-webkit-font-smoothing:antialiased}',
      'img{max-width:100%}ul{list-style:none}a{text-decoration:none;color:inherit}',
      '.wrap{max-width:1140px;margin:0 auto;padding:0 28px}',
      /* GNB — 다크 반투명 */
      '.ob-nav{position:sticky;top:0;z-index:50;background:rgba(5,11,26,.78);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,.07)}',
      '.ob-nav .wrap{display:flex;align-items:center;gap:36px;height:64px}',
      '.ob-logo{font-weight:800;font-size:17px;letter-spacing:-.01em;white-space:nowrap}',
      '.ob-menu{display:flex;gap:28px;font-size:14.5px;font-weight:600;color:' + SUB + ';margin-left:auto}',
      '.ob-menu a{transition:color .15s}.ob-menu a:hover{color:#fff}',
      '.ob-navcta{display:inline-block;background:' + GRAD + ';color:#fff;font-size:14px;font-weight:700;padding:10px 20px;border-radius:999px;white-space:nowrap;transition:transform .15s,box-shadow .15s}',
      '.ob-navcta:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(0,145,255,.35)}',
      /* 히어로 — 회전 지구 */
      '.ob-hero{position:relative;padding:96px 0 0;text-align:center;overflow:hidden}',
      '.ob-eb{display:inline-block;font-size:15px;font-weight:800;letter-spacing:.16em;background:' + GRAD + ';-webkit-background-clip:text;background-clip:text;color:transparent}',
      '.ob-ht{margin-top:18px;font-size:64px;font-weight:300;line-height:1.16;letter-spacing:-.03em;word-break:keep-all;text-wrap:balance;color:#fff}',
      '.ob-ht b{font-weight:700}',
      '.ob-hs{margin:22px auto 0;font-size:18.5px;line-height:1.65;color:' + SUB + ';max-width:560px;word-break:keep-all}',
      '.ob-hcta{display:inline-block;margin-top:34px;background:' + GRAD + ';color:#fff;font-size:17px;font-weight:700;padding:16px 40px;border-radius:999px;box-shadow:0 14px 40px rgba(0,145,255,.34);transition:transform .18s,box-shadow .18s}',
      '.ob-hcta:hover{transform:translateY(-2px);box-shadow:0 20px 52px rgba(113,126,255,.44)}',
      '.ob-count{margin:26px auto 0;display:inline-flex;align-items:baseline;gap:9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:11px 20px;font-variant-numeric:tabular-nums}',
      '.ob-count .lb{font-size:13px;font-weight:600;color:' + SUB + '}',
      '.ob-count b{font-size:18px;font-weight:800;color:#fff;letter-spacing:.02em}',
      /* 지구본 — CSS 자전: 구체 마스크 안에서 점·경도선 레이어가 가로 패닝 */
      '.ob-earth{position:relative;width:min(560px,86vw);height:min(560px,86vw);margin:64px auto -240px}',
      '.ob-globe{position:absolute;inset:6%;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 32% 28%,#12305E 0%,#0A1C3E 44%,#040B1D 78%)}',
      '.ob-globe .sky{position:absolute;inset:0;left:-100%;width:300%;' +
        'background-image:radial-gradient(rgba(120,190,255,.55) 1.1px,transparent 1.6px),repeating-linear-gradient(90deg,rgba(60,140,255,.28) 0 1.6px,transparent 1.6px 64px),repeating-linear-gradient(0deg,rgba(60,140,255,.16) 0 1.2px,transparent 1.2px 58px);' +
        'background-size:30px 30px,auto,auto;animation:obSpin 16s linear infinite}',
      '.ob-globe .shade{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 26%,rgba(255,255,255,.2),transparent 42%),radial-gradient(circle at 78% 66%,rgba(2,6,16,.72),transparent 62%);box-shadow:inset 0 0 60px rgba(0,40,110,.55)}',
      '.ob-ring{position:absolute;inset:-2%;border-radius:50%;padding:2px;background:conic-gradient(from 210deg,' + CYAN + ',' + VIOLET + ' 30%,' + PINK + ' 55%,transparent 70%,transparent 100%);' +
        '-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;' +
        'animation:obOrbit 12s linear infinite;opacity:.85}',
      '.ob-sat{position:absolute;left:50%;top:-2%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#fff;box-shadow:0 0 18px 4px rgba(120,190,255,.8);transform-origin:6px calc(min(560px,86vw)/2 + 2%);animation:obOrbit 12s linear infinite}',
      '.ob-glow{position:absolute;inset:-14%;border-radius:50%;background:radial-gradient(circle,rgba(0,145,255,.22) 30%,rgba(113,126,255,.1) 55%,transparent 70%);filter:blur(4px)}',
      '@keyframes obSpin{to{transform:translateX(33.333%)}}',
      '@keyframes obOrbit{to{transform:rotate(360deg)}}',
      /* 히어로 하단 페이드 → 다음 섹션과 자연 연결 */
      '.ob-hero:after{content:"";position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(180deg,transparent,' + BG + ' 82%);pointer-events:none}',
      /* 스탯 */
      '.ob-stats{position:relative;padding:120px 0 8px}',
      '.ob-stats .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;text-align:center}',
      '.ob-stats b{display:block;font-size:80px;font-weight:900;letter-spacing:-.02em;background:' + GRAD + ';-webkit-background-clip:text;background-clip:text;color:transparent;font-variant-numeric:tabular-nums}',
      '.ob-stats span{display:block;margin-top:8px;font-size:15px;color:' + SUB + ';font-weight:600}',
      /* 섹션 공통 + 지브라(미세 톤 차) */
      '.ob-sec{padding:104px 0}',
      '.ob-sec.alt{background:#081226}',
      '.ob-tt{text-align:center;font-size:38px;font-weight:800;letter-spacing:-.03em;color:#fff;word-break:keep-all}',
      '.ob-tt+*{margin-top:70px}',
      /* 글래스 카드 */
      '.ob-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}',
      '.ob-card{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:32px 28px;backdrop-filter:blur(8px);transition:transform .25s ease,border-color .25s ease}',
      '.ob-card:hover{transform:translateY(-4px);border-color:rgba(120,190,255,.4)}',
      '.ob-card:before{content:"";display:block;width:44px;height:4px;border-radius:2px;margin-bottom:20px}',
      '.ob-card:nth-child(1):before{background:' + BLUE + '}.ob-card:nth-child(2):before{background:' + VIOLET + '}.ob-card:nth-child(3):before{background:' + PINK + '}',
      '.ob-card h3{font-size:21px;font-weight:800;letter-spacing:-.02em;color:#fff;word-break:keep-all}',
      '.ob-card p{margin-top:10px;font-size:15.5px;line-height:1.62;color:' + SUB + ';word-break:keep-all}',
      /* 세션 */
      '.ob-slist{max-width:860px;margin:0 auto;display:flex;flex-direction:column;gap:12px}',
      '.ob-srow{display:grid;grid-template-columns:170px 1fr auto;gap:20px;align-items:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px 26px;transition:transform .22s ease,border-color .22s ease}',
      '.ob-srow:hover{transform:translateY(-2px);border-color:rgba(120,190,255,.35)}',
      '.ob-srow .tm{font-size:14.5px;font-weight:700;color:' + CYAN + ';font-variant-numeric:tabular-nums}',
      '.ob-srow .st{font-size:18px;font-weight:700;color:#fff;letter-spacing:-.02em;word-break:keep-all}',
      '.ob-srow .by{font-size:13px;color:' + SUB + ';white-space:nowrap;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 12px}',
      '.ob-srow .by:empty{display:none}',
      /* 일정·장소 */
      '.ob-info{max-width:860px;margin:0 auto;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden}',
      '.ob-info .l{padding:36px 38px}',
      '.ob-info th{color:' + SUB + ';font-weight:600;text-align:left;padding:8px 22px 8px 0;vertical-align:top;white-space:nowrap;font-size:15px}',
      '.ob-info td{padding:8px 0;line-height:1.55;font-weight:600;color:#fff;font-size:16px}',
      '.ob-map{position:relative;background:radial-gradient(circle at 60% 40%,#0E2247,#071228);min-height:210px}',
      '.ob-map .pin{position:absolute;left:52%;top:40%;width:30px;height:30px;border-radius:50% 50% 50% 0;background:' + GRAD + ';transform:rotate(-45deg);box-shadow:0 10px 26px rgba(0,145,255,.5)}',
      '.ob-map .pin:after{content:"";position:absolute;inset:8px;border-radius:50%;background:#fff}',
      /* 선언 */
      '.ob-st{padding:130px 0;text-align:center}',
      '.ob-st .tx{font-size:44px;line-height:1.32;font-weight:800;letter-spacing:-.03em;color:#fff;word-break:keep-all;text-wrap:balance}',
      /* FAQ */
      '.ob-qs{max-width:760px;margin:0 auto}',
      '.ob-q{border-bottom:1px solid rgba(255,255,255,.1);padding:22px 4px;cursor:pointer}',
      '.ob-q .qh{display:flex;justify-content:space-between;gap:16px;font-size:17.5px;font-weight:700;color:#fff;word-break:keep-all}',
      '.ob-q .qh i{font-style:normal;color:' + SUB + ';transition:transform .2s}',
      '.ob-q .qa{max-height:0;overflow:hidden;transition:max-height .28s ease;font-size:15.5px;line-height:1.62;color:' + SUB + ';word-break:keep-all}',
      '.ob-q.open .qh{color:' + CYAN + '}.ob-q.open .qh i{transform:rotate(45deg);color:' + CYAN + '}',
      '.ob-q.open .qa{max-height:200px;margin-top:12px}',
      /* CTA */
      '.ob-cta{position:relative;background:' + GRAD + ';background-size:220% 220%;animation:obGradPan 9s ease-in-out infinite alternate;padding:104px 0;text-align:center;overflow:hidden}',
      '@keyframes obGradPan{from{background-position:0% 50%}to{background-position:100% 50%}}',
      '.ob-cta:before{content:"";position:absolute;inset:0;background:radial-gradient(70% 120% at 50% -20%,rgba(255,255,255,.25),transparent 60%)}',
      '.ob-cta .tt{position:relative;font-size:42px;font-weight:900;letter-spacing:-.03em;color:#fff;word-break:keep-all}',
      '.ob-cta .sub{position:relative;margin-top:14px;font-size:17px;color:rgba(255,255,255,.88)}',
      '.ob-cta .btn{position:relative;display:inline-block;margin-top:32px;background:#fff;color:#1B2B4B;font-size:17px;font-weight:800;padding:16px 42px;border-radius:999px;transition:transform .18s}',
      '.ob-cta .btn:hover{transform:translateY(-2px)}',
      /* 푸터 */
      '.ob-foot{padding:36px 0;border-top:1px solid rgba(255,255,255,.08)}',
      '.ob-foot .wrap{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap}',
      '.ob-foot .lg{font-weight:800;font-size:15px}',
      '.ob-foot .lks{display:flex;gap:22px;font-size:13.5px;color:' + SUB + '}',
      '.ob-foot .cp{font-size:12.5px;color:#5B6B85}',
      /* 앵커 + 모션 */
      '.ob-sec,.ob-st,.ob-cta{scroll-margin-top:70px}',
      '.rv{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}',
      '.rv.in{opacity:1;transform:none}',
      '.ob-hero .ob-eb,.ob-hero .ob-ht,.ob-hero .ob-hs,.ob-hero .ob-hcta,.ob-hero .ob-count{opacity:0;transform:translateY(20px);animation:obUp .7s cubic-bezier(.2,.7,.2,1) forwards}',
      '.ob-hero .ob-ht{animation-delay:.08s}.ob-hero .ob-hs{animation-delay:.16s}.ob-hero .ob-hcta{animation-delay:.24s}.ob-hero .ob-count{animation-delay:.32s}',
      '@keyframes obUp{to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){.rv,.ob-hero .ob-eb,.ob-hero .ob-ht,.ob-hero .ob-hs,.ob-hero .ob-hcta,.ob-hero .ob-count{opacity:1;transform:none;animation:none;transition:none}.ob-globe .sky,.ob-ring,.ob-sat,.ob-cta{animation:none}}',
      '@media (max-width:960px){.ob-cards{grid-template-columns:1fr}.ob-stats .grid{grid-template-columns:1fr;gap:34px}.ob-info{grid-template-columns:1fr}.ob-ht{font-size:46px}}',
      '@media (max-width:600px){.ob-nav .wrap{gap:12px;height:56px}.ob-menu{display:none}.ob-logo{font-size:14.5px}.ob-navcta{padding:8px 14px;font-size:12.5px}',
      '.ob-hero{padding:64px 0 0}.ob-ht{font-size:34px}.ob-hs{font-size:15.5px}.ob-earth{margin:44px auto -170px}',
      '.ob-stats{padding:96px 0 0}.ob-stats b{font-size:52px}.ob-sec{padding:64px 0}.ob-tt{font-size:26px}.ob-tt+*{margin-top:44px}',
      '.ob-srow{grid-template-columns:1fr;gap:8px}.ob-srow .by{justify-self:start}.ob-st .tx{font-size:27px}.ob-cta .tt{font-size:28px}}',
      '[data-edit]{white-space:pre-wrap}',
    ].join('\n');
  }

  window.renderOrbitPage = function (shared, opts) {
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
      ko: { why: '하루면 충분한 이유', sv: '일정 및 장소', faq: '자주 묻는 질문', cd: '신청 마감까지', dt: '일시', pl: '장소' },
      en: { why: 'Why one day is enough', sv: 'Schedule & Venue', faq: 'FAQ', cd: 'Registration closes in', dt: 'Date', pl: 'Venue' },
      ja: { why: '1日で十分な理由', sv: '日程・会場', faq: 'よくある質問', cd: '申込締切まで', dt: '日時', pl: '会場' },
      zh: { why: '一天足矣的理由', sv: '日程与场地', faq: '常见问题', cd: '距报名截止', dt: '日期', pl: '地点' },
    }[LANG];

    var feats = (d.features && d.features.length ? d.features : BD.features).slice(0, 3);
    var faq = (shared.faq && shared.faq.length ? shared.faq : BD.faq).slice(0, 8);
    var stats = (d.stats && d.stats.length ? d.stats : BD.stats).slice(0, 3);
    var sess = (d.sessions && d.sessions.length ? d.sessions : BD.sessions).slice(0, 6);
    var anchors = ['#about', '#program', '#info', '#faq'];
    var menu = (d.navLinks || []).slice(0, 4).map(function (l, i) {
      return '<a href="' + anchors[i % anchors.length] + '"' + de('navLinks.' + i) + '>' + esc(l) + '</a>';
    }).join('');
    var cards = feats.map(function (f, i) {
      var P = 'features.' + i;
      return '<div class="ob-card rv"><h3' + de(P + '.title') + '>' + ml(f.title || '') + '</h3><p' + de(P + '.desc') + '>' + ml(f.desc || '') + '</p></div>';
    }).join('');
    var st = stats.map(function (s, i) {
      return '<div class="rv"><b' + de('stats.' + i + '.value') + '>' + esc(s.value || '') + '</b><span' + de('stats.' + i + '.label') + '>' + esc(s.label || '') + '</span></div>';
    }).join('');
    var rows = sess.map(function (s, i) {
      var P = 'sessions.' + i;
      return '<div class="ob-srow rv"><span class="tm"' + de(P + '.time') + '>' + esc(s.time || '') + '</span>' +
        '<span class="st"' + de(P + '.title') + '>' + esc(s.title || '') + '</span>' +
        '<span class="by"' + de(P + '.by') + '>' + esc(s.by || '') + '</span></div>';
    }).join('');
    var qs = faq.map(function (f, i) {
      return '<div class="ob-q' + (i === 0 ? ' open' : '') + '"><div class="qh"><span' + de('faq.' + i + '.q') + '>' + esc(f.q || '') + '</span><i>+</i></div>' +
        '<div class="qa"' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</div></div>';
    }).join('');
    var fnjs = '<script>(function(){' +
      'document.querySelectorAll(".ob-q").forEach(function(q){q.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;q.classList.toggle("open");});});' +
      'var cd=document.querySelector(".ob-count");if(cd){var end=new Date(cd.getAttribute("data-deadline")||"").getTime();' +
      'if(!isFinite(end)||end-Date.now()<36e5){end=Date.now()+12*864e5+7*36e5+23*6e4+41e3;}' +
      'var t=function(){var ms=Math.max(0,end-Date.now());var dd=Math.floor(ms/86400000),h=String(Math.floor(ms/3600000)%24).padStart(2,"0"),m=String(Math.floor(ms/60000)%60).padStart(2,"0"),s=String(Math.floor(ms/1000)%60).padStart(2,"0");' +
      'cd.querySelector("b").textContent="D-"+dd+" "+h+":"+m+":"+s;};t();setInterval(t,1000);}' +
      '})();<\/script>';
    var mot = opts.motion === false ? '' :
      '<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.14});document.querySelectorAll(".rv").forEach(function(e){io.observe(e);});' +
      // 스탯 카운트업 — 원문에서 숫자만 뽑아 0→N 이징, 접두·접미(+, 콤마, 소수점) 보존, 종료 시 원문 복원
      'var nio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;nio.unobserve(e.target);var el=e.target,raw=el.textContent,m=raw.match(/[\\d][\\d,\\.]*/);if(!m)return;' +
      'var num=parseFloat(m[0].replace(/,/g,""));if(!isFinite(num))return;var pre=raw.slice(0,m.index),suf=raw.slice(m.index+m[0].length),cm=m[0].indexOf(",")>-1,dec=(m[0].split(".")[1]||"").length,t0=null;' +
      'var fmt=function(v){var s=dec?v.toFixed(dec):String(Math.round(v));if(cm)s=s.replace(/\\B(?=(\\d{3})+(?!\\d))/g,",");return s;};' +
      'var step=function(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1400),ez=1-Math.pow(1-p,3);el.textContent=pre+fmt(num*ez)+suf;if(p<1)requestAnimationFrame(step);else el.textContent=raw;};requestAnimationFrame(step);});},{threshold:.5});' +
      'document.querySelectorAll(".ob-stats b").forEach(function(e){nio.observe(e);});})();<\/script>';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      '<style>' + css() + '</style></head><body data-pack="orbit">' +
      '<nav class="ob-nav"><div class="wrap"><span class="ob-logo"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="ob-menu">' + menu + '</div>' +
      '<a class="ob-navcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></nav>' +
      '<header class="ob-hero"><div class="wrap">' +
      '<span class="ob-eb"' + de('productName') + '>' + esc(d.productName) + '</span>' +
      '<h1 class="ob-ht"' + de('tagline') + '>' + mixT(d.tagline) + '</h1>' +
      '<p class="ob-hs"' + de('subcopy') + '>' + ml(d.subcopy) + '</p>' +
      '<div><a class="ob-hcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>' +
      '<div class="ob-count" data-deadline="' + esc(d.deadline || '') + '"><span class="lb">' + esc(TT.cd) + '</span><b>D-00 00:00:00</b></div>' +
      '<div class="ob-earth"><div class="ob-glow"></div><div class="ob-globe"><div class="sky"></div><div class="shade"></div></div><div class="ob-ring"></div></div>' +
      '</div></header>' +
      (function () {
        var SEC = {
          stats: '<section class="ob-stats" data-section="stats"><div class="wrap"><div class="grid">' + st + '</div></div></section>',
          about: '<section class="ob-sec" id="about" data-section="about"><div class="wrap"><h2 class="ob-tt rv">' + esc(TT.why) + '</h2><div class="ob-cards">' + cards + '</div></div></section>',
          program: '<section class="ob-sec alt" id="program" data-section="program"><div class="wrap"><h2 class="ob-tt rv">SESSIONS</h2><div class="ob-slist">' + rows + '</div></div></section>',
          info: '<section class="ob-sec" id="info" data-section="info"><div class="wrap"><h2 class="ob-tt rv">' + esc(TT.sv) + '</h2>' +
            '<div class="ob-info rv"><div class="l"><table><tr><th>' + esc(TT.dt) + '</th><td' + de('eventDate') + '>' + esc(d.eventDate || '') + '</td></tr>' +
            '<tr><th>' + esc(TT.pl) + '</th><td' + de('eventPlace') + '>' + ml(d.eventPlace || '') + '</td></tr></table></div>' +
            '<div class="ob-map"><span class="pin"></span></div></div></div></section>',
          statement: '<section class="ob-st" data-section="statement"><div class="wrap"><p class="tx rv"' + de('bannerText') + '>' + ml(d.bannerText) + '</p></div></section>',
          faq: '<section class="ob-sec alt" id="faq" data-section="faq"><div class="wrap"><h2 class="ob-tt rv">' + esc(TT.faq) + '</h2><div class="ob-qs rv">' + qs + '</div></div></section>',
        };
        var ORDER = ['stats', 'about', 'program', 'info', 'statement', 'faq'];
        var saved = (Array.isArray(shared.sectionOrder) ? shared.sectionOrder : []).filter(function (k) { return SEC[k]; });
        var order = saved.concat(ORDER.filter(function (k) { return saved.indexOf(k) < 0; }));
        var hid = shared.hiddenSections || [];
        return order.filter(function (k) { return hid.indexOf(k) < 0; }).map(function (k) { return SEC[k]; }).join('');
      })() +
      '<section class="ob-cta" id="apply"><div class="wrap rv"><h2 class="tt"' + de('ctaTitle') + '>' + ml(d.ctaTitle) + '</h2>' +
      '<p class="sub"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
      '<a class="btn"' + de('bannerCta') + '>' + esc(d.bannerCta || d.primaryCta) + '</a></div></section>' +
      '<footer class="ob-foot"><div class="wrap"><span class="lg"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="lks">' + (d.footerLinks || []).map(function (l, i) { return '<a' + de('footerLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div>' +
      '<span class="cp"' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span></div></footer>' +
      fnjs + mot + '</body></html>';
  };


  window.ORBIT_SECTION_SPEC = {
    template: [{ type: 'stats', tier: 'core' }, { type: 'about', tier: 'core' }, { type: 'program', tier: 'core' }, { type: 'info', tier: 'core' }, { type: 'statement', tier: 'core' }, { type: 'faq', tier: 'core' }],
    fixed: [],
    labels: { stats: '지표', about: '소개', program: '세션', info: '일정·장소', statement: '선언', faq: 'FAQ' },
  };
  window.ORBIT_STYLE = { id: 'orbit', name: '글로벌 오르빗', desc: '회전 지구 히어로 · 다크 네이비 · 멀티컬러 그라데이션 · 글래스 카드', swatch: 'linear-gradient(135deg,#050B1A 0%,#0A1C3E 45%,#0091FF 75%,#FF8EBD 100%)' };
})();
