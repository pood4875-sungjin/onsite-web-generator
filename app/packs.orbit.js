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
      '.ob-gl,.ob-pin{position:absolute;inset:2.5%;border-radius:50%;display:block;pointer-events:none}',
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
      var px = Math.min(Math.round(side * dpr), 1024);
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
      fnjs + mot + '<script>(' + obEarthGL.toString() + ')();<\/script></body></html>';
  };


  window.ORBIT_SECTION_SPEC = {
    template: [{ type: 'stats', tier: 'core' }, { type: 'about', tier: 'core' }, { type: 'program', tier: 'core' }, { type: 'info', tier: 'core' }, { type: 'statement', tier: 'core' }, { type: 'faq', tier: 'core' }],
    fixed: [],
    labels: { stats: '지표', about: '소개', program: '세션', info: '일정·장소', statement: '선언', faq: 'FAQ' },
  };
  window.ORBIT_STYLE = { id: 'orbit', name: 'Global MBM', desc: '회전 지구 히어로 · 다크 네이비 · 멀티컬러 그라데이션 · 글래스 카드', swatch: 'linear-gradient(135deg,#050B1A 0%,#0A1C3E 45%,#0091FF 75%,#FF8EBD 100%)' };
})();
