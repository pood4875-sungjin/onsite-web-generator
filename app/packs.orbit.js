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
      '.ob-gl,.ob-pin{position:absolute;left:2.5%;top:2.5%;width:95%;height:95%;border-radius:50%;display:block;pointer-events:none}',
      '.ob-earth.gl-on .ob-globe{visibility:hidden}',
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
      '.ob-tt+*{margin-top:60px}',
      /* 글래스 카드 */
      '.ob-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}',
      '.ob-card{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:32px 28px;backdrop-filter:blur(8px);transition:transform .25s ease,border-color .25s ease}',
      '.ob-card:hover{transform:translateY(-4px);border-color:rgba(120,190,255,.4)}',
      '.ob-card:before{content:"";display:block;width:44px;height:4px;border-radius:2px;margin-bottom:20px}',
      '.ob-card:nth-child(1):before{background:' + BLUE + '}.ob-card:nth-child(2):before{background:' + VIOLET + '}.ob-card:nth-child(3):before{background:' + PINK + '}',
      '.ob-card h3{font-size:21px;font-weight:800;letter-spacing:-.02em;color:#fff;word-break:keep-all}',
      '.ob-card p{margin-top:10px;font-size:15.5px;line-height:1.62;color:' + SUB + ';word-break:keep-all}',
      /* 세션 */
      '.ob-slist{max-width:860px;margin:60px auto;display:flex;flex-direction:column;gap:12px}',
      '.ob-srow{display:grid;grid-template-columns:170px 1fr auto;gap:20px;align-items:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px 26px;transition:transform .22s ease,border-color .22s ease}',
      '.ob-srow:hover{transform:translateY(-2px);border-color:rgba(120,190,255,.35)}',
      '.ob-srow .tm{font-size:14.5px;font-weight:700;color:' + CYAN + ';font-variant-numeric:tabular-nums}',
      '.ob-srow .st{font-size:18px;font-weight:700;color:#fff;letter-spacing:-.02em;word-break:keep-all}',
      '.ob-srow .by{font-size:13px;color:' + SUB + ';white-space:nowrap;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:5px 12px}',
      '.ob-srow .by:empty{display:none}',
      /* 일정·장소 */
      '.ob-info{max-width:860px;margin:60px auto;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden}',
      '.ob-info .l{padding:36px 38px}',
      '.ob-info th{color:' + SUB + ';font-weight:600;text-align:left;padding:8px 22px 8px 0;vertical-align:top;white-space:nowrap;font-size:15px}',
      '.ob-info td{padding:8px 0;line-height:1.55;font-weight:600;color:#fff;font-size:16px}',
      '.ob-map{position:relative;background:radial-gradient(circle at 60% 40%,#0E2247,#071228);min-height:210px;border:0;width:100%;height:100%;display:block}',
      '.ob-map .pin{position:absolute;left:52%;top:40%;width:30px;height:30px;border-radius:50% 50% 50% 0;background:' + GRAD + ';transform:rotate(-45deg);box-shadow:0 10px 26px rgba(0,145,255,.5)}',
      '.ob-map .pin:after{content:"";position:absolute;inset:8px;border-radius:50%;background:#fff}',
      /* 선언 */
      '.ob-st{padding:130px 0;text-align:center}',
      '.ob-st .tx{font-size:44px;line-height:1.32;font-weight:800;letter-spacing:-.03em;color:#fff;word-break:keep-all;text-wrap:balance}',
      /* FAQ */
      '.ob-qs{max-width:760px;margin:60px auto}',
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
      '.ob-stats{padding:96px 0 0}.ob-stats b{font-size:52px}.ob-sec{padding:64px 0}.ob-tt{font-size:26px}.ob-tt+*{margin-top:44px}.ob-slist,.ob-info,.ob-qs{margin:44px auto}',
      '.ob-srow{grid-template-columns:1fr;gap:8px}.ob-srow .by{justify-self:start}.ob-st .tx{font-size:27px}.ob-cta .tt{font-size:28px}}',
      '[data-edit]{white-space:pre-wrap}',
    ].join('\n');
  }

  /* WebGL 지구본 — event.wanted.co.kr/global-company 참고: 실측 대륙(Natural Earth 110m 래스터,
     내장 data URI PNG. R=대륙, G=경위선 30°)을 텍스처 스피어로 감고 천천히 자전 + 도시 핑 리플(2D 오버레이).
     toString() 직렬화로 산출물에 주입되므로 외부 변수 참조 금지. 실패 시 CSS 지구본 폴백. */
  function obEarthGL() {
    var host = document.querySelector('.ob-earth'); if (!host) return;
    var cv = host.querySelector('.ob-gl'), pc = host.querySelector('.ob-pin'); if (!cv || !pc) return;
    var bail = function () {
      host.classList.remove('gl-on');
      if (cv.parentNode) cv.parentNode.removeChild(cv);
      if (pc.parentNode) pc.parentNode.removeChild(pc);
    };
    var gl; try { gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true }); } catch (e) {}
    if (!gl) { bail(); return; }
    var VS = 'attribute vec2 aP;varying vec2 vUV;void main(){vUV=aP*0.5+0.5;gl_Position=vec4(aP,0.0,1.0);}';
    var FS = [
      'precision highp float;varying vec2 vUV;uniform sampler2D uMap;uniform float uRot;uniform float uTilt;',
      'void main(){',
      '  vec2 p=vUV*2.0-1.0;float r=length(p);',
      '  float edge=1.0-smoothstep(0.985,1.0,r);',
      '  if(edge<=0.0){gl_FragColor=vec4(0.0);return;}',
      '  float rr=min(r,0.9995);float z=sqrt(1.0-rr*rr);vec3 V=vec3(p.x,p.y,z);',
      '  float ct=cos(uTilt),st=sin(uTilt);',
      '  vec3 N=vec3(V.x,ct*V.y-st*V.z,st*V.y+ct*V.z);',
      '  float lon=atan(N.x,N.z)+uRot;float lat=asin(clamp(N.y,-1.0,1.0));',
      '  vec2 uv=vec2(fract(lon/6.28318+0.5),0.5-lat/3.14159);',
      '  vec4 t=texture2D(uMap,uv);',
      '  vec3 L=normalize(vec3(-0.5,0.55,0.68));float df=0.55+0.6*max(dot(V,L),0.0);',
      '  vec3 ocean=mix(vec3(0.016,0.055,0.14),vec3(0.075,0.2,0.44),df);',
      '  vec3 land=mix(vec3(0.24,0.55,1.0),vec3(0.45,0.75,1.0),df*0.6);',
      '  vec3 col=mix(ocean,land,t.r);',
      '  col+=vec3(0.35,0.6,1.0)*t.g*0.30;',
      '  float fres=pow(1.0-z,2.2);',
      '  col+=vec3(0.15,0.45,1.0)*fres*0.5+vec3(0.35,0.3,0.9)*fres*fres*0.35;',
      '  float limb=smoothstep(0.93,1.0,rr);col*=1.0-limb*0.25;',
      '  gl_FragColor=vec4(col,1.0)*edge;',
      '}'].join('\n');
    function sh(ty, src) { var s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { bail(); return; }
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs);
    gl.bindAttribLocation(pr, 0, 'aP');
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { bail(); return; }
    var uMap = gl.getUniformLocation(pr, 'uMap'), uRot = gl.getUniformLocation(pr, 'uRot'), uTilt = gl.getUniformLocation(pr, 'uTilt');
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    var TILT = 0.32, SPIN = 0.15, ROT0 = 2.2;
    var ctx = pc.getContext('2d');
    var CITY = [[126.98, 37.57], [139.69, 35.68], [103.85, 1.29], [151.2, -33.87], [55.27, 25.2], [-0.13, 51.5], [-74.0, 40.7], [-118.24, 34.05], [77.2, 28.6], [-46.63, -23.55]];
    function resize() {
      var side = Math.max(1, cv.clientWidth || 320);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var px = Math.min(Math.round(side * dpr), 1536);
      if (cv.width !== px) { cv.width = px; cv.height = px; }
      if (pc.width !== px) { pc.width = px; pc.height = px; }
    }
    function draw(t) {
      resize();
      var rot = ROT0 + t * SPIN;
      gl.useProgram(pr);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(uMap, 0);
      gl.uniform1f(uRot, rot);
      gl.uniform1f(uTilt, TILT);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // 핑 오버레이 — 셰이더와 같은 회전·틸트로 도시 투영, 앞면만
      var S = pc.width, R = S / 2 * 0.985, cx = S / 2, cy = S / 2;
      var ct = Math.cos(TILT), st = Math.sin(TILT);
      ctx.clearRect(0, 0, S, S);
      for (var i = 0; i < CITY.length; i++) {
        var lam = CITY[i][0] * Math.PI / 180 - rot, phi = CITY[i][1] * Math.PI / 180;
        var x = Math.cos(phi) * Math.sin(lam), y = Math.sin(phi), zz = Math.cos(phi) * Math.cos(lam);
        var y2 = ct * y + st * zz, z2 = -st * y + ct * zz;
        if (z2 < 0.12) continue;
        var sx = cx + x * R, sy = cy - y2 * R;
        var vis = Math.min(1, z2 * 2.2);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.95 * vis).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(sx, sy, S * 0.006, 0, 7); ctx.fill();
        var ph = (t * 0.55 + i * 0.37) % 1;
        ctx.strokeStyle = 'rgba(180,220,255,' + ((1 - ph) * 0.55 * vis).toFixed(3) + ')';
        ctx.lineWidth = S * 0.0022;
        ctx.beginPath(); ctx.arc(sx, sy, S * 0.006 + ph * S * 0.03, 0, 7); ctx.stroke();
      }
    }
    var img = new Image();
    img.onerror = bail;
    img.onload = function () {
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      host.classList.add('gl-on');
      cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); bail(); });
      var still = document.body.getAttribute('data-motion') === 'off' ||
        (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (still) { requestAnimationFrame(function () { draw(0); }); return; }
      var run = true, start = performance.now();
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { run = es[0].isIntersecting; }).observe(host);
      }
      (function tick() {
        requestAnimationFrame(tick);
        if (!run) return;
        draw((performance.now() - start) / 1000);
      })();
    };
    img.src = 'data:image/png;base64,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';
  }

  window.renderOrbitPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var LANG = ({ en: 1, ja: 1, zh: 1 })[shared._clang] ? shared._clang : 'ko';
    var BD = LANG === 'ko' ? DEMO : DEMO_EN;
    var d = {};
    for (var k in BD) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : BD[k];
    /* [시연 잠금] GNB·히어로 타이틀 고정 — 누가 언제 뽑아도 동일(생성·번역·편집값보다 우선) */
    d.navTitle = 'MIDAS GEN NX Seminar 2026';
    d.tagline = ({
      ko: '지금 만나보세요\n차세대 구조설계 워크플로우',
      en: 'Meet the Next Generation of\nStructural Design Workflow',
      ja: 'いま、出会う\n次世代の構造設計ワークフロー',
      zh: '即刻遇见\n新一代结构设计工作流',
    })[LANG];
    // 템플릿 고정 라벨 — 산출물 언어(_clang) 기준 + 타이틀 강약(첫 줄 볼드/다음 라이트, **마커** 우선)
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
      (LANG === 'ja' || LANG === 'zh' ? '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + (LANG === 'ja' ? 'Noto+Sans+JP' : 'Noto+Sans+SC') + ':wght@300;400;500;700;800;900&display=swap">' +
        '<style>body,button,input,textarea{font-family:"Pretendard Variable",Pretendard,"' + (LANG === 'ja' ? 'Noto Sans JP' : 'Noto Sans SC') + '",-apple-system,sans-serif}</style>' : '') +
      '<style>' + css() + '</style></head><body data-pack="orbit" data-motion="' + (opts.motion === false ? 'off' : 'on') + '">' +
      '<nav class="ob-nav"><div class="wrap"><span class="ob-logo"' + de('navTitle') + '>' + esc(d.navTitle) + '</span>' +
      '<div class="ob-menu">' + menu + '</div>' +
      '<a class="ob-navcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div></nav>' +
      '<header class="ob-hero"><div class="wrap">' +
      '<span class="ob-eb"' + de('productName') + '>' + esc(d.productName) + '</span>' +
      '<h1 class="ob-ht"' + de('tagline') + '>' + mixT(d.tagline) + '</h1>' +
      '<p class="ob-hs"' + de('subcopy') + '>' + ml(d.subcopy) + '</p>' +
      '<div><a class="ob-hcta" href="#apply"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</a></div>' +
      '<div class="ob-count" data-deadline="' + esc(d.deadline || '') + '"><span class="lb">' + esc(TT.cd) + '</span><b>D-00 00:00:00</b></div>' +
      '<div class="ob-earth"><div class="ob-glow"></div><div class="ob-globe"><div class="sky"></div><div class="shade"></div></div><canvas class="ob-gl"></canvas><canvas class="ob-pin"></canvas><div class="ob-ring"></div></div>' +
      '</div></header>' +
      (function () {
        var SEC = {
          stats: '<section class="ob-stats" data-section="stats"><div class="wrap"><div class="grid">' + st + '</div></div></section>',
          about: '<section class="ob-sec" id="about" data-section="about"><div class="wrap"><h2 class="ob-tt rv">' + esc(TT.why) + '</h2><div class="ob-cards">' + cards + '</div></div></section>',
          program: '<section class="ob-sec alt" id="program" data-section="program"><div class="wrap"><h2 class="ob-tt rv">SESSIONS</h2><div class="ob-slist">' + rows + '</div></div></section>',
          info: '<section class="ob-sec" id="info" data-section="info"><div class="wrap"><h2 class="ob-tt rv">' + esc(TT.sv) + '</h2>' +
            '<div class="ob-info rv"><div class="l"><table><tr><th>' + esc(TT.dt) + '</th><td' + de('eventDate') + '>' + esc(d.eventDate || '') + '</td></tr>' +
            '<tr><th>' + esc(TT.pl) + '</th><td' + de('eventPlace') + '>' + ml(d.eventPlace || '') + '</td></tr></table></div>' +
            (function(){var q=String(d.eventPlace||'').split('\n')[0].trim();return q?'<iframe class="ob-map" src="https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=15&output=embed" loading="lazy" title="map"></iframe>':'<div class="ob-map"><span class="pin"></span></div>';})()+'</div></div></section>',
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
      fnjs + mot + '<script>(' + obEarthGL.toString() + ')();<\/script></body></html>';
  };


  window.ORBIT_SECTION_SPEC = {
    template: [{ type: 'stats', tier: 'core' }, { type: 'about', tier: 'core' }, { type: 'program', tier: 'core' }, { type: 'info', tier: 'core' }, { type: 'statement', tier: 'core' }, { type: 'faq', tier: 'core' }],
    fixed: [],
    labels: { stats: '지표', about: '소개', program: '세션', info: '일정·장소', statement: '선언', faq: 'FAQ' },
  };
  window.ORBIT_STYLE = { id: 'orbit', name: 'Global MBM', desc: '회전 지구 히어로 · 다크 네이비 · 멀티컬러 그라데이션 · 글래스 카드', swatch: 'linear-gradient(135deg,#050B1A 0%,#0A1C3E 45%,#0091FF 75%,#FF8EBD 100%)' };
})();
