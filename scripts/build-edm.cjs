#!/usr/bin/env node
/* build-edm.cjs — eDM 템플릿의 Figma 추출 에셋을 data URI로 인라인해
   자기완결 HTML 프래그먼트로 만든다(srcdoc/이메일 양쪽서 동작).
   결과: app/edm/<tpl>.js → window.EDM_<TPL> = { <section>: '<html>' }.
   소스: 프로모션01 = Figma node 1455:2590 (Hero/Overview×2/Promotion/Step/Contact/BTN).
   좌표/색/타이포는 각 노드 get_design_context 실측값 그대로. */
const fs = require('fs');
const path = require('path');
const ROOT = require('path').join(__dirname, '..');   /* scripts/ 하위 이동 — 루트 기준 유지 */

function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
  return 'data:' + mime + ';base64,' + fs.readFileSync(file).toString('base64');
}
function loadAssets(dir) {
  const out = {};
  for (const f of fs.readdirSync(dir)) out[path.basename(f, path.extname(f))] = dataUri(path.join(dir, f));
  return out;
}
const IMG = (src, style) => `<img src="${src}" alt="" style="${style}">`;
const ABS = 'position:absolute;display:block;';
const ROW = (inner, tdStyle) => `<tr><td style="padding:0;${tdStyle || ''}">${inner}</td></tr>`;
const INTER = "'Inter','Pretendard',sans-serif";
const PRE = "'Pretendard',sans-serif";

/* ===================== 프로모션01 ===================== */

// Hero_edm (node 1455:2592, 760×380)
function heroPromo(A) {
  function chip(kind, left, top) {
    const base = A[kind + '-base'], label = A[kind + '-label'], e1 = A[kind + '-e1'], e2 = A[kind + '-e2'], e3 = A[kind + '-e3'];
    const box = kind === 'fea' ? 'top:11.13%;left:12.44%;right:10.6%;bottom:10.92%' : 'top:11.2%;left:12.63%;right:10.41%;bottom:10.84%';
    const lbl = kind === 'fea' ? 'top:32.86%;left:28.77%;right:27.3%;bottom:49.83%' : 'top:33.33%;left:27.66%;right:25.53%;bottom:48.89%';
    const lblIn = kind === 'fea' ? 'top:-3.97%;left:-3.84%;right:-2.31%;bottom:-11.92%' : 'top:-3.87%;left:-3.6%;right:-2.16%;bottom:-11.6%';
    const el = kind === 'fea'
      ? [`left:133.05px;top:132.45px;width:76.122px;height:76.122px`, `top:-1.55%;left:0;right:62.29%;bottom:63.14%`, `top:6.76%;left:9.44%;right:79.64%;bottom:82.12%`]
      : [`top:0;left:0;right:62.29%;bottom:61.6%`, `top:73.78%;left:74.26%;right:0;bottom:0`, `top:7.85%;left:8.52%;right:77.32%;bottom:77.73%`];
    const dodge = 'mix-blend-mode:color-dodge;';
    return `<div style="${ABS}left:${left}px;top:${top}px;width:200.92px;height:197.288px">`
      + `<div style="${ABS}${box}">${IMG(base, ABS + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${ABS}${el[0]};${dodge}">${IMG(e1, ABS + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${ABS}${el[1]};${dodge}">${IMG(e2, ABS + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${ABS}${el[2]};${dodge}">${IMG(e3, ABS + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${ABS}${lbl}"><div style="${ABS}${lblIn}">${IMG(label, 'display:block;width:100%;height:100%')}</div></div></div>`;
  }
  const text =
    `<div style="${ABS}left:47.05px;top:68px;width:378px;display:flex;flex-direction:column;gap:36px;align-items:center">`
    + `<div style="display:flex;gap:10px;align-items:center;width:100%"><div style="position:relative;width:70.625px;height:20px">${IMG(A.logo, ABS + 'inset:0;width:100%;height:100%')}</div></div>`
    + `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:100%">`
    + `<div style="display:flex;flex-direction:column;align-items:flex-start;font-family:'Gmarket Sans','Pretendard',sans-serif;font-weight:700">`
    + `<p data-edit style="margin:0;font-size:20px;line-height:1.4;letter-spacing:-0.8px;color:#fff;width:376px">패키지 구매시</p>`
    + `<div data-edit style="font-size:48px;letter-spacing:-1.92px;width:376px;background:linear-gradient(128.273deg,#91C6F2 8.4975%,#DBFFFB 58.908%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">`
    + `<p style="margin:0 0 0;line-height:1.2">MODS 무료,</p><p style="margin:0;line-height:1.2">30%할인까지</p></div></div>`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:500;font-size:16px;line-height:1.5;letter-spacing:-0.48px;color:#fff;width:100%">FEA NX와 CIVIL NX를 함께 만나보세요.</p></div></div>`;
  const badge =
    `<div style="${ABS}left:402px;top:28px;width:108.492px;height:108.492px;display:flex;align-items:center;justify-content:center">`
    + `<div style="transform:rotate(-7.91deg);width:96.167px;height:96.167px;position:relative">`
    + `<div style="${ABS}top:-6.46%;left:-6.46%;right:-10.23%;bottom:-10.23%">${IMG(A.star, 'display:block;width:100%;height:100%')}</div></div></div>`
    + `<div style="${ABS}left:456.4px;top:59.42px;transform:translateX(-50%);width:58.993px;height:47.054px;display:flex;align-items:center;justify-content:center">`
    + `<p style="margin:0;transform:rotate(-7.91deg);font-family:${PRE};font-weight:900;font-size:33.216px;line-height:normal;letter-spacing:-0.6643px;color:#434349;text-align:center;white-space:nowrap">1+1</p></div>`;
  return ROW(`<div style="position:relative;width:760px;height:380px;overflow:hidden">`
    + IMG(A['bg-blue'], ABS + 'inset:0;width:760px;height:380px;object-fit:cover')
    + `<div style="${ABS}left:449.5px;top:100px;width:228.5px;height:230px"><div style="${ABS}top:-34.78%;left:-35.01%;right:-35.01%;bottom:-34.78%">${IMG(A.glow, 'display:block;width:100%;height:100%')}</div></div>`
    + chip('fea', 424, 74) + chip('cvl', 504, 156) + badge + text + `</div>`);
}

// Overview_edm #1 (node 1455:2593, 760×496) — 텍스트, gradient bg
function overview1() {
  const P = (t) => `<p style="margin:0;line-height:26px">${t}</p>`;
  return ROW(`<div style="background:linear-gradient(222.231deg,#D6E8F3 14.516%,#FFFFFF 112.44%);padding:50px">`
    + `<div style="display:flex;flex-direction:column;gap:33px;align-items:flex-start">`
    + `<div data-edit style="font-family:${INTER};font-weight:700;font-size:36px;color:#0073ff;letter-spacing:-1.08px;width:660px">`
    + `<p style="margin:0;line-height:1.2">🎉</p><p style="margin:0;line-height:1.2">새로운 프로모션으로</p><p style="margin:0;line-height:1.2">돌아왔습니다.</p></div>`
    + `<div data-edit style="font-family:${PRE};font-size:16px;color:#4E5968;letter-spacing:-0.48px;width:100%">`
    + P('안녕하세요, 마이다스아이티입니다.') + P('FEA NX와 CIVIL NX 기능을 보다 부담 없이 실무에 적용하실 수 있도록&nbsp;')
    + P('FEA NX 및 CIVIL NX 연간 사용료 계약을 진행합니다.') + P('&nbsp;')
    + P('본 사용료 계약을 통해 초기 도입 부담 없이 연 500만원의 비용으로 대여 하실 수 있으며,')
    + P('대여 제품은 모두 Full Version을 제공합니다.') + P('&nbsp;')
    + P('이번 기회를 통해 실제 업무 환경에서 직접 활용해 보시고,')
    + P('설계·해석·검증 전 과정에서 업무 효율과 적용 가능성을 체감해 보시기 바랍니다.')
    + `</div></div></div>`);
}

// Overview_edm #2 (node 1455:2594, 760×410) — 헤더 + 스펙 표
function overview2() {
  const rows = [
    ['계약 방식', '1년 단위 사용 계약 방식'], ['계약 기간', '최소 1년'],
    ['계약 종류', '계약 기간 만료 시 소프트웨어 사용 불가'], ['대상 프로그램', 'FEA NX / CIVIL NX'],
  ];
  const table = rows.map(([k, v], i) =>
    `<div style="display:flex;align-items:stretch;border-bottom:1px solid #DEE5EF">`
    + `<div style="width:120px;background:#E7EAF0;display:flex;align-items:center;justify-content:center;padding:18px 8px"><span data-edit style="font-family:${PRE};font-weight:500;font-size:14px;color:#6B7684;letter-spacing:-0.42px;text-align:center">${k}</span></div>`
    + `<div style="flex:1;background:#fff;display:flex;align-items:center;padding:16px 24px"><span data-edit style="font-family:${PRE};font-weight:500;font-size:16px;color:#191F28;letter-spacing:-0.48px;line-height:26px">${v}</span></div></div>`
  ).join('');
  return ROW(`<div style="background:#fff;padding:50px;display:flex;flex-direction:column;gap:24px;align-items:center">`
    + `<div style="display:flex;flex-direction:column;gap:4px;width:660px">`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:20px;color:#030712;letter-spacing:-0.6px;line-height:1.3">프로모션 안내</p>`
    + `<p data-edit style="margin:0;font-family:${INTER};font-size:14px;color:#606672;letter-spacing:-0.42px;line-height:1.5">FEA NX / CIVIL NX 사용료 계약을 통해 부담없이 만나세요.</p></div>`
    + `<div style="width:660px;border-top:1px solid #DEE5EF">${table}</div></div>`);
}

// Promotion_eDM (node 1455:2595, 760×407.9) — 다크 그라디언트, 티켓 카드×2
function promotion(A) {
  function ticket(name, price, unitColor, star, caption) {
    const badge = `<div style="${ABS}right:0;top:0.38px;width:85px;height:84px">`
      + `<div style="${ABS}left:calc(50% + 0.57px);top:calc(50% - 0.37px);transform:translate(-50%,-50%);width:73.748px;height:73.748px"><div style="${ABS}inset:4.29%">${IMG(star, 'display:block;width:100%;height:100%')}</div></div>`
      + `<div style="${ABS}left:calc(50% + 0.19px);top:calc(50% - 0.25px);transform:translate(-50%,-50%);font-family:${INTER};font-weight:600;font-size:13px;color:#fff;text-align:center;letter-spacing:-0.39px;white-space:nowrap"><p style="margin:0;line-height:1.2">유상대여</p><p style="margin:0;line-height:1.2">ver.</p></div></div>`;
    const ticketInner =
      `<div style="position:relative;width:290px;height:155.928px;padding:16px 23px;box-sizing:border-box">`
      + IMG(A['pr-subtract'], ABS + 'inset:0;width:100%;height:100%')
      + `<div style="position:relative;height:123px;display:flex;flex-direction:column;justify-content:space-between">`
      + `<div style="width:192px;line-height:1.5">`
      + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:18px;color:#2C3138;letter-spacing:-0.54px">${name}</p>`
      + `<p data-edit style="margin:0;font-family:${INTER};font-size:14px;color:#606672;letter-spacing:-0.42px">Professional 모듈 (Full Opiton)</p></div>`
      + `<div style="display:flex;align-items:flex-end">`
      + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:32px;color:${unitColor};letter-spacing:-0.96px;line-height:1.3;white-space:nowrap">${price}</p>`
      + `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:4px;width:23px"><p style="margin:0;font-family:${INTER};font-weight:600;font-size:24px;color:${unitColor};letter-spacing:-0.72px;line-height:1.3">원</p></div>`
      + `</div></div></div>`;
    return `<div style="width:330px;display:flex;flex-direction:column;align-items:center">`
      + `<div style="position:relative;padding:24px 20px 12px;display:flex;flex-direction:column;gap:10px;align-items:flex-start">${ticketInner}${badge}</div>`
      + `<p data-edit style="margin:0;font-family:${INTER};font-weight:500;font-size:16px;color:#E5E7EB;text-align:center;letter-spacing:-0.48px;line-height:1.5;width:290px">${caption}</p></div>`;
  }
  return ROW(`<div style="background:linear-gradient(90deg,#333B4C,#1D222B);padding:50px;display:flex;flex-direction:column;gap:40px;align-items:center">`
    + `<div style="display:flex;flex-direction:column;gap:30px;align-items:flex-start;width:660px">`
    + `<div style="display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;width:100%">`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:24px;color:#fff;letter-spacing:-0.72px;line-height:1.3">프로모션 가격 안내</p>`
    + `<p data-edit style="margin:0;font-family:${INTER};font-size:15px;color:#9CA3AF;letter-spacing:-0.45px;line-height:1.5">* VAT 별도</p></div>`
    + `<div style="display:flex;align-items:flex-start;justify-content:space-between;width:100%">`
    + ticket('FEA NX', '5,000,000', '#39B6A0', A['pr-star-green'], 'FEA NX Professional 모듈')
    + ticket('CIVIL NX', '500,000', '#0F8CFA', A['pr-star-blue'], 'CIVIL NX Professional 모듈')
    + `</div></div></div>`);
}

// Step_eDM (node 1455:2596, 760×312) — 3 혜택 카드
function step() {
  const cards = [
    ['Benefit 1.', 'Low Cost'], ['Benefit 2.', 'Flexibility'], ['Benefit 3.', 'Accessibility'],
  ].map(([n, t]) =>
    `<div style="flex:1;background:#E7EAF0;border-radius:4px;padding:24px;display:flex;flex-direction:column;gap:8px;min-height:180px;box-sizing:border-box">`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:13px;color:#A1A2A6;letter-spacing:-0.39px;line-height:1.5">${n}</p>`
    + `<div style="display:flex;flex-direction:column;gap:4px">`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:18px;color:#3E3E3E;letter-spacing:-0.54px;line-height:1.5">${t}</p>`
    + `<div data-edit style="font-family:${INTER};font-size:13px;color:#606672;letter-spacing:-0.39px"><p style="margin:0;line-height:1.5">영구 Lic.</p><p style="margin:0;line-height:1.5">도입과 같이 한 번에 큰 금액을 지불하지 않으셔도 됩니다.</p></div></div></div>`
  ).join('');
  return ROW(`<div style="background:#fff;padding:45px 50px;display:flex;flex-direction:column;gap:16px;align-items:flex-start">`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:20px;color:#030712;letter-spacing:-0.6px;line-height:1.3">사용료 계약 혜택</p>`
    + `<div style="display:flex;gap:12px;width:660px">${cards}</div></div>`);
}

// Contact_eDM (node 1455:2597, 760×178)
function contact() {
  const people = ['홍길동', '나수민', '민의진'].map((nm) =>
    `<div style="display:flex;gap:12px;align-items:center;width:100%;color:#191F28;font-size:16px;letter-spacing:-0.48px">`
    + `<p data-edit style="margin:0;font-family:${PRE};font-weight:700;line-height:normal;white-space:nowrap">${nm}</p>`
    + `<p data-edit style="margin:0;font-family:${PRE};line-height:26px;white-space:pre">C. 010-1234-5678&nbsp;&nbsp;E. address@midasit.com</p></div>`
  ).join('');
  return ROW(`<div style="background:#fff;padding:0 50px 50px;display:flex;flex-direction:column;align-items:center">`
    + `<div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;width:660px">`
    + `<p data-edit style="margin:0;font-family:${INTER};font-weight:700;font-size:20px;color:#191F28;letter-spacing:-0.6px;line-height:1.3">Contact</p>`
    + `<div style="display:flex;flex-direction:column;gap:4px;width:660px">${people}</div></div></div>`);
}

// BTN_eDM (node 1455:2598, 760×66)
function btn(A) {
  return ROW(`<div style="background:linear-gradient(90deg,#2D3340,#121928);padding:16px 38px;display:flex;align-items:center;justify-content:center;gap:4px">`
    + `<p data-edit style="margin:0;font-family:${PRE};font-weight:600;font-size:18px;color:#fff;letter-spacing:-0.36px;line-height:1.4;white-space:nowrap;text-align:center">자세히 보기</p>`
    + `<div style="position:relative;width:34px;height:34px"><div style="${ABS}left:50%;top:50%;transform:translate(-50%,-50%);width:22.667px;height:22.667px">${IMG(A['btn-arrow'], ABS + 'inset:0;width:100%;height:100%')}</div></div></div>`);
}

function build() {
  const A = loadAssets(path.join(ROOT, 'assets/edm/promo01'));
  const out = {
    hero: heroPromo(A), overview1: overview1(), overview2: overview2(),
    promotion: promotion(A), step: step(), contact: contact(), btn: btn(A),
  };
  const outDir = path.join(ROOT, 'app/edm');
  fs.mkdirSync(outDir, { recursive: true });
  const js = '/* AUTO-GENERATED by build-edm.cjs — 편집금지. 소스: Figma node 1455:2590 (프로모션01). */\n'
    + 'window.EDM_PROMO01 = ' + JSON.stringify(out) + ';\n';
  fs.writeFileSync(path.join(outDir, 'promo01.js'), js);
  console.log('wrote app/edm/promo01.js  (' + (js.length / 1024).toFixed(0) + ' KB)  sections: ' + Object.keys(out).join(', '));
}
build();
