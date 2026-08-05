/* packs.mbm.js — "세미나 집객 블루" 랜딩 팩 (MBM). classic <script src>.
   소스: Figma Y5BuxrmQwXHIDfOgPknPVr 236:54126 (1920×7952) 실측.
   구성(고정 TEMPLATE): nav → hero(다크 포토+화이트 그라데이션) → 챕터 지그재그 ×3(블루/틸/그린 그라데이션 타이틀)
   → 다크 선언(2톤) → FAQ 아코디언 → 다크틸 CTA → footer.
   실측 토큰: 챕터 bg #E4EBF4/#F0F7F7/#EBF2E6 · 타이틀 그라데이션 #165FCE→#448EFE / #007DA0→#00BDDE / #54BA0A→#6BE016
   · 캡션 #7A808D 24 · 선언 bg #0C0D0D(딤 #6B7280) · CTA #065454→#071E21 · FAQ 카드 #F7F7F8 r8, 열린 Q #1BB9CD
   · 히어로 타이틀 72/-3.19/128.6% · 카드 r12. 폰트 Pretendard, 큰 마이너스 자간. */
(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function de(p) { return p ? ' data-edit="' + p + '"' : ''; }
  var CH = [
    { cap: 'MONITORING', bg: '#E4EBF4', g1: '#165FCE', g2: '#448EFE', tint: '#699EF0' },
    { cap: 'PREDICTION', bg: '#F0F7F7', g1: '#007DA0', g2: '#00BDDE', tint: '#39BFD8' },
    { cap: 'FEEDBACK',   bg: '#EBF2E6', g1: '#54BA0A', g2: '#6BE016', tint: '#7BCE4A' },
  ];

  /* 데모 기본 콘텐츠 — 시안 원문(ONSITE). AI 초안(compose-web)이 오면 전부 교체된다 */
  var DEMO = {
    productName: 'MIDAS ONSITE',
    tagline: '실시간 데이터 기반\n가시설 현장 안전 예측 솔루션',
    subcopy: '굴착 현장의 실시간 계측 데이터를 분석해 가시설의 거동과 위험을 예측하고,\n이상 징후 알림과 최적 보완설계로 안전한 현장 대응을 지원합니다.',
    primaryCta: '세미나 신청하기',
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
    ctaTitle: '현장에 MIDAS ONSITE를\n도입해 보세요',
    ctaSub: '현장 규모와 계측 항목에 맞춰 도입 방안을 안내해 드립니다.\n부담 없이 문의해 주세요.',
    footerLinks: ['솔루션', '도입 문의', '회사 소개'],
    footerCopyright: '© 2026 MIDAS IT',
  };

  function ml(s) { return esc(s).replace(/\n/g, '<br>'); }
  /* desc 한 덩어리 → 체크 불릿 — 문장 단위 분해(마침표), 최대 3개 */
  function bullets(desc, P) {
    var parts = String(desc || '').split(/(?<=다\.)\s+|(?<=요\.)\s+|(?<=\.)\s+(?=[A-Z가-힣])/).filter(function (s) { return s.trim(); }).slice(0, 3);
    if (!parts.length) parts = [desc || ''];
    return parts.map(function (t, i) {
      return '<li><svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="10" fill="currentColor" opacity=".14"/><path d="M6 10.2l2.6 2.6L14 7.4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span' + de(P) + '>' + esc(t.trim()) + '</span></li>';
    }).join('');
  }
  /* 챕터 비주얼 — 추상 대시보드 모형(팩 그래픽, CSS만) */
  function visual(c, flip) {
    return '<div class="mb-vis" style="--tint:' + c.tint + ';--g1:' + c.g1 + ';--g2:' + c.g2 + '">' +
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
      /* nav */
      '.mb-nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.86);backdrop-filter:blur(10px);border-bottom:1px solid rgba(10,11,11,.07)}',
      '.mb-nav .wrap{display:flex;align-items:center;justify-content:space-between;height:66px}',
      '.mb-brand{font-weight:800;font-size:19px;letter-spacing:-.02em}',
      '.mb-navcta{background:#0A0B0B;color:#fff;font-size:14.5px;font-weight:600;padding:10px 20px;border-radius:999px;cursor:pointer;border:0;font-family:inherit}',
      /* hero — 다크 포토 무드 + 화이트 그라데이션 하단 */
      '.mb-hero{position:relative;min-height:760px;display:flex;align-items:flex-start;overflow:hidden;background:linear-gradient(118deg,#0E2A55 0%,#1E56A8 46%,#5D93D9 78%,#BFD7EF 100%)}',
      '.mb-hero:after{content:"";position:absolute;inset:auto 0 0 0;height:34%;background:linear-gradient(180deg,rgba(255,255,255,0) 0%,#fff 96%)}',
      '.mb-hero .bgart{position:absolute;right:-6%;top:-12%;width:58%;height:120%;background:radial-gradient(closest-side,rgba(255,255,255,.34),rgba(255,255,255,0) 70%),linear-gradient(200deg,rgba(255,255,255,.22),rgba(255,255,255,0) 60%);transform:rotate(8deg)}',
      '.mb-hero .bgcable{position:absolute;right:4%;top:0;width:44%;height:100%;background:repeating-linear-gradient(112deg,rgba(255,255,255,.28) 0 2px,transparent 2px 74px);mask-image:linear-gradient(180deg,#000 55%,transparent 95%);-webkit-mask-image:linear-gradient(180deg,#000 55%,transparent 95%)}',
      '.mb-hero .bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:72% 30%;opacity:.5;mix-blend-mode:luminosity}',
      '.mb-hero .wrap{position:relative;z-index:2;padding-top:132px;padding-bottom:200px}',
      '.mb-ht{font-size:66px;line-height:1.286;letter-spacing:-.044em;font-weight:700;color:#FDFDFE;text-wrap:balance}',
      '.mb-hs{margin-top:26px;font-size:20px;line-height:1.445;color:#E7EDF4;max-width:640px}',
      '.mb-hcta{display:inline-block;margin-top:38px;background:#fff;color:#4B5563;font-size:17.5px;font-weight:600;padding:15px 30px;border-radius:12px;border:0;cursor:pointer;font-family:inherit;box-shadow:0 10px 30px rgba(8,20,40,.22)}',
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
      '.mb-vis{border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--tint) 26%,#fff),color-mix(in srgb,var(--tint) 62%,#fff));padding:26px;display:flex;flex-direction:column;min-height:420px;box-shadow:inset 0 0 0 1px rgba(10,11,11,.05)}',
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
      '.mb-st .tx{font-size:54px;line-height:1.286;letter-spacing:-.045em;font-weight:600;color:#fff;text-wrap:balance}',
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
      /* CTA */
      '.mb-cta{position:relative;background:linear-gradient(135deg,#065454 0%,#071E21 100%);padding:130px 0;text-align:center;overflow:hidden}',
      '.mb-cta:before{content:"";position:absolute;inset:0;background:radial-gradient(60% 90% at 80% 10%,rgba(27,185,205,.24),transparent 70%)}',
      '.mb-cta .tt{position:relative;font-size:50px;line-height:1.286;letter-spacing:-.045em;font-weight:700;color:#fff;text-wrap:balance}',
      '.mb-cta .sub{position:relative;margin-top:20px;font-size:17.5px;line-height:1.445;color:rgba(255,255,255,.86)}',
      '.mb-cta .btn{position:relative;display:inline-block;margin-top:36px;background:#fff;color:#4B5563;font-size:17.5px;font-weight:600;padding:15px 32px;border-radius:12px;border:0;cursor:pointer;font-family:inherit}',
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
      '.mb-imap{position:relative;background:linear-gradient(135deg,#E4EBF4,#D3DEEC);min-height:220px}',
      '.mb-imap .pin{position:absolute;left:48%;top:38%;width:32px;height:32px;border-radius:50% 50% 50% 0;background:#165FCE;transform:rotate(-45deg);box-shadow:0 10px 24px rgba(22,95,206,.35)}',
      '.mb-imap .pin:after{content:"";position:absolute;inset:9px;border-radius:50%;background:#fff}',
      '.mb-imap .rd{position:absolute;left:0;right:0;top:58%;height:12px;background:rgba(10,11,11,.07);transform:rotate(-6deg)}',
      /* 카드·버튼 호버 */
      '.mb-card,.mb-vis{transition:transform .3s ease,box-shadow .3s ease}',
      '.mb-card:hover{transform:translateY(-4px);box-shadow:0 22px 54px rgba(15,30,60,.1)}',
      '.mb-hcta,.mb-cta .btn,.mb-navcta{transition:transform .2s ease,box-shadow .2s ease}',
      '.mb-hcta:hover,.mb-cta .btn:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(8,20,40,.3)}',
      /* 히어로 진입 스태거 */
      '.mb-hero .mb-ht,.mb-hero .mb-hs,.mb-hero .mb-hcta{opacity:0;transform:translateY(22px);animation:mbUp .8s cubic-bezier(.2,.7,.2,1) forwards}',
      '.mb-hero .mb-hs{animation-delay:.14s}.mb-hero .mb-hcta{animation-delay:.28s}',
      '@keyframes mbUp{to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion:reduce){.rv,.mb-hero .mb-ht,.mb-hero .mb-hs,.mb-hero .mb-hcta{opacity:1;transform:none;animation:none;transition:none}}',
      /* 모션 */
      '.rv{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}',
      '.rv.in{opacity:1;transform:none}',
      '@media (max-width:960px){.mb-zig,.mb-zig.flip{grid-template-columns:1fr}.mb-ht{font-size:44px}.mb-ch .tt,.mb-faq .tt{font-size:33px}.mb-st .tx{font-size:36px}.mb-cta .tt{font-size:36px}}',
      '[data-edit]{white-space:pre-wrap}',
    ].join('\n');
  }

  window.renderMbmPage = function (shared, opts) {
    shared = shared || {}; opts = opts || {};
    var d = {};
    for (var k in DEMO) d[k] = shared[k] != null && shared[k] !== '' && !(Array.isArray(shared[k]) && !shared[k].length) ? shared[k] : DEMO[k];
    var feats = (d.features && d.features.length ? d.features : DEMO.features).slice(0, 3);
    var faq = (shared.faq && shared.faq.length ? shared.faq : DEMO.faq).slice(0, 6);
    var ctaTitle = shared.bannerText && shared.bannerCta ? shared.bannerText : d.ctaTitle;   // 배너 텍스트를 CTA로 쓰는 초안 대응
    var stTx = (function () {   // 선언 2톤 — 마지막 줄을 딤 처리
      var lines = String(d.bannerText || '').split('\n');
      if (lines.length < 2) return ml(d.bannerText);
      var last = lines.pop();
      return ml(lines.join('\n')) + '<br><span class="dim">' + esc(last) + '</span>';
    })();
    var stats = (d.stats || []).slice(0, 3);
    var chapters = feats.map(function (f, i) {
      var c = CH[i % CH.length], flip = i % 2 === 1, P = 'features.' + i;
      var text = '<div class="mb-card rv" style="--g1:' + c.g1 + '"><h3 class="ct"' + de(P + '.title') + '>' + ml(f.title || '') + '</h3><ul>' + bullets(f.desc, P + '.desc') + '</ul></div>';
      var vis = '<div class="rv">' + visual(c, flip) + '</div>';
      return '<section class="mb-ch" style="background:' + c.bg + ';--g1:' + c.g1 + ';--g2:' + c.g2 + '">' +
        '<div class="wrap"><span class="cap rv">' + c.cap + '</span>' +
        '<h2 class="tt rv"' + de(P + '.title') + '>' + ml(f.title || '') + '</h2>' +
        '<div class="mb-zig' + (flip ? ' flip' : '') + '">' + (flip ? vis + text : text + vis) + '</div></div></section>';
    }).join('');
    var qs = faq.map(function (f, i) {
      return '<div class="mb-q' + (i === 0 ? ' open' : '') + '"><div class="qh"><span' + de('faq.' + i + '.q') + '>Q. ' + esc(f.q || '') + '</span><i>+</i></div>' +
        '<div class="qa"' + de('faq.' + i + '.a') + '>' + ml(f.a || '') + '</div></div>';
    }).join('');
    var mot = opts.motion === false ? '' :
      '<script>(function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.14});document.querySelectorAll(".rv").forEach(function(e){io.observe(e);});' +
      'document.querySelectorAll(".mb-q").forEach(function(q){q.addEventListener("click",function(ev){if(ev.target.closest("[contenteditable=true]"))return;q.classList.toggle("open");});});' +
      'var cd=document.querySelector(".mb-count");if(cd){var end=new Date(cd.getAttribute("data-deadline")||"").getTime();' +
      'if(isFinite(end)){var q=function(s){return cd.querySelector(s);};var t=function(){var ms=Math.max(0,end-Date.now());' +
      'var d2=Math.floor(ms/86400000),h=Math.floor(ms/3600000)%24,m=Math.floor(ms/60000)%60,s2=Math.floor(ms/1000)%60;' +
      'q("[data-cd=d]").textContent=String(d2).padStart(2,"0");q("[data-cd=h]").textContent=String(h).padStart(2,"0");' +
      'q("[data-cd=m]").textContent=String(m).padStart(2,"0");q("[data-cd=s]").textContent=String(s2).padStart(2,"0");};t();setInterval(t,1000);}else{cd.style.display="none";}}' +
      '})();<\/script>';
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.productName) + '</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">' +
      '<style>' + css() + '</style></head><body data-pack="mbm">' +
      '<nav class="mb-nav"><div class="wrap"><span class="mb-brand"' + de('productName') + '>' + esc(d.productName) + '</span>' +
      '<button class="mb-navcta"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></div></nav>' +
      '<header class="mb-hero"><img class="bgimg" loading="lazy" alt="" src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1600&h=800&q=78&auto=format&fit=crop" onerror="this.remove()"><div class="bgart"></div><div class="bgcable"></div><div class="wrap">' +
      '<h1 class="mb-ht"' + de('tagline') + '>' + ml(d.tagline) + '</h1>' +
      '<p class="mb-hs"' + de('subcopy') + '>' + ml(d.subcopy) + '</p>' +
      '<button class="mb-hcta"' + de('primaryCta') + '>' + esc(d.primaryCta) + '</button></div></header>' +
      '<div class="mb-count" data-deadline="' + esc(d.deadline || '') + '"><div class="wrap"><span class="lb"' + de('primaryCta') + '>' + esc(d.primaryCta) + ' \uB9C8\uAC10\uAE4C\uC9C0</span>' +
      '<span class="seg"><b data-cd="d">00</b><span>DAYS</span></span><span class="seg"><b data-cd="h">00</b><span>HRS</span></span><span class="seg"><b data-cd="m">00</b><span>MIN</span></span><span class="seg"><b data-cd="s">00</b><span>SEC</span></span></div></div>' +
      chapters +
      '<section class="mb-ses"><div class="wrap"><h2 class="tt rv">SESSIONS</h2><div class="mb-slist">' +
      (d.sessions || []).slice(0, 5).map(function (s, i) {
        var P = 'sessions.' + i;
        return '<div class="mb-srow rv"><span class="tm"' + de(P + '.time') + '>' + esc(s.time || '') + '</span>' +
          '<span class="st"' + de(P + '.title') + '>' + esc(s.title || '') + '</span>' +
          '<span class="by"' + de(P + '.by') + '>' + esc(s.by || '') + '</span></div>';
      }).join('') + '</div></div></section>' +
      '<section class="mb-info"><div class="wrap"><div class="mb-ibox rv"><div class="l">' +
      '<table><tr><th>\uC77C\uC2DC</th><td' + de('eventDate') + '>' + esc(d.eventDate || '') + '</td></tr>' +
      '<tr><th>\uC7A5\uC18C</th><td' + de('eventPlace') + '>' + ml(d.eventPlace || '') + '</td></tr></table></div>' +
      '<div class="mb-imap"><span class="rd"></span><span class="pin"></span></div></div></div></section>' +
      '<section class="mb-st"><div class="wrap"><p class="tx rv"' + de('bannerText') + '>' + stTx + '</p>' +
      (stats.length ? '<div class="nums rv">' + stats.map(function (s, i) { return '<div class="n"><b' + de('stats.' + i + '.value') + '>' + esc(s.value || '') + '</b><span' + de('stats.' + i + '.label') + '>' + esc(s.label || '') + '</span></div>'; }).join('') + '</div>' : '') +
      '</div></section>' +
      '<section class="mb-faq"><div class="wrap"><h2 class="tt rv">도입 전,<br>이런 점이 궁금하신가요?</h2>' +
      '<p class="sub rv">가장 많이 묻는 질문을 모았습니다. 더 궁금한 점은 부담 없이 문의해 주세요.</p>' +
      '<div class="mb-qs rv">' + qs + '</div></div></section>' +
      '<section class="mb-cta"><div class="wrap"><h2 class="tt rv">' + ml(ctaTitle) + '</h2>' +
      '<p class="sub rv"' + de('ctaSub') + '>' + ml(d.ctaSub) + '</p>' +
      '<button class="btn rv"' + de('bannerCta') + '>' + esc(d.bannerCta || d.primaryCta) + '</button></div></section>' +
      '<footer class="mb-foot"><div class="wrap"><span class="mb-brand" style="color:#fff">' + esc(d.productName) + '</span>' +
      '<div class="lks">' + (d.footerLinks || []).map(function (l, i) { return '<a' + de('footerLinks.' + i) + '>' + esc(l) + '</a>'; }).join('') + '</div>' +
      '<span class="cp"' + de('footerCopyright') + '>' + esc(d.footerCopyright) + '</span></div></footer>' +
      mot + '</body></html>';
  };

  window.MBM_STYLE = { id: 'mbm', name: '세미나 집객 블루', desc: '다크블루 히어로 · 챕터 그라데이션 · FAQ 아코디언', swatch: 'linear-gradient(135deg,#1E56A8 0%,#00BDDE 55%,#6BE016 100%)' };
})();
