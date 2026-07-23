#!/usr/bin/env node
/* build-edm.cjs — eDM 템플릿의 Figma 추출 에셋을 data URI로 인라인해
   자기완결 HTML 프래그먼트로 만든다(srcdoc/이메일 양쪽서 동작).
   결과: app/edm/<tpl>.js → window.EDM_<TPL> = { <section>: '<html>' }.
   에셋 소스: assets/edm/<tpl>/*.  좌표/스타일은 Figma 실측(node 1455:2592 Hero_edm). */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

function dataUri(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
  const buf = fs.readFileSync(file);
  return 'data:' + mime + ';base64,' + buf.toString('base64');
}
function loadAssets(dir) {
  const out = {};
  for (const f of fs.readdirSync(dir)) {
    const key = path.basename(f, path.extname(f));
    out[key] = dataUri(path.join(dir, f));
  }
  return out;
}

/* ---------- promo01 : Hero_edm (node 1455:2592, 760×380) ---------- */
function promo01Hero(A) {
  const img = (src, style) => `<img src="${src}" alt="" style="${style}">`;
  const abs = 'position:absolute;display:block;';
  // 3D 제품 칩 (Product3DM) — 컨테이너 200.92×197.288 기준 Figma inset 그대로
  function chip(kind, left, top) {
    const base = A[kind + '-base'], label = A[kind + '-label'], e1 = A[kind + '-e1'], e2 = A[kind + '-e2'], e3 = A[kind + '-e3'];
    // box inset (fea/cvl 각각 실측)
    const box = kind === 'fea' ? 'top:11.13%;left:12.44%;right:10.6%;bottom:10.92%' : 'top:11.2%;left:12.63%;right:10.41%;bottom:10.84%';
    const lbl = kind === 'fea' ? 'top:32.86%;left:28.77%;right:27.3%;bottom:49.83%' : 'top:33.33%;left:27.66%;right:25.53%;bottom:48.89%';
    const lblIn = kind === 'fea' ? 'top:-3.97%;left:-3.84%;right:-2.31%;bottom:-11.92%' : 'top:-3.87%;left:-3.6%;right:-2.16%;bottom:-11.6%';
    // 글로우 엘립스 (mix-blend-mode:color-dodge)
    const el = kind === 'fea'
      ? [`left:133.05px;top:132.45px;width:76.122px;height:76.122px`, `top:-1.55%;left:0;right:62.29%;bottom:63.14%`, `top:6.76%;left:9.44%;right:79.64%;bottom:82.12%`]
      : [`top:0;left:0;right:62.29%;bottom:61.6%`, `top:73.78%;left:74.26%;right:0;bottom:0`, `top:7.85%;left:8.52%;right:77.32%;bottom:77.73%`];
    const dodge = 'mix-blend-mode:color-dodge;';
    return `<div style="${abs}left:${left}px;top:${top}px;width:200.92px;height:197.288px">`
      + `<div style="${abs}${box}">${img(base, abs + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${abs}${el[0]};${dodge}">${img(e1, abs + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${abs}${el[1]};${dodge}">${img(e2, abs + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${abs}${el[2]};${dodge}">${img(e3, abs + 'inset:0;width:100%;height:100%')}</div>`
      + `<div style="${abs}${lbl}"><div style="${abs}${lblIn}">${img(label, 'display:block;width:100%;height:100%')}</div></div>`
      + `</div>`;
  }

  const text =
    `<div style="${abs}left:47.05px;top:68px;width:378px;display:flex;flex-direction:column;gap:36px;align-items:center">`
    + `<div style="display:flex;gap:10px;align-items:center;width:100%"><div style="position:relative;width:70.625px;height:20px">${img(A.logo, abs + 'inset:0;width:100%;height:100%')}</div></div>`
    + `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:100%">`
    + `<div style="display:flex;flex-direction:column;align-items:flex-start;font-family:'Gmarket Sans','Pretendard',sans-serif;font-weight:700">`
    + `<p data-edit style="margin:0;font-size:20px;line-height:1.4;letter-spacing:-0.8px;color:#fff;width:376px">패키지 구매시</p>`
    + `<div data-edit style="font-size:48px;letter-spacing:-1.92px;width:376px;background:linear-gradient(128.273deg,#91C6F2 8.4975%,#DBFFFB 58.908%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">`
    + `<p style="margin:0 0 0;line-height:1.2">MODS 무료,</p><p style="margin:0;line-height:1.2">30%할인까지</p></div>`
    + `</div>`
    + `<p data-edit style="margin:0;font-family:'Inter',sans-serif;font-weight:500;font-size:16px;line-height:1.5;letter-spacing:-0.48px;color:#fff;width:100%">FEA NX와 CIVIL NX를 함께 만나보세요.</p>`
    + `</div></div>`;

  // 1+1 배지
  const badge =
    `<div style="${abs}left:402px;top:28px;width:108.492px;height:108.492px;display:flex;align-items:center;justify-content:center">`
    + `<div style="transform:rotate(-7.91deg);width:96.167px;height:96.167px;position:relative">`
    + `<div style="${abs}top:-6.46%;left:-6.46%;right:-10.23%;bottom:-10.23%">${img(A.star, 'display:block;width:100%;height:100%')}</div></div></div>`
    + `<div style="${abs}left:456.4px;top:59.42px;transform:translateX(-50%);width:58.993px;height:47.054px;display:flex;align-items:center;justify-content:center">`
    + `<p style="margin:0;transform:rotate(-7.91deg);font-family:'Pretendard',sans-serif;font-weight:900;font-size:33.216px;line-height:normal;letter-spacing:-0.6643px;color:#434349;text-align:center;white-space:nowrap">1+1</p></div>`;

  return `<tr><td style="padding:0"><div style="position:relative;width:760px;height:380px;overflow:hidden">`
    + img(A['bg-blue'], abs + 'inset:0;width:760px;height:380px;object-fit:cover')
    // 뒤 글로우 (Vector2798) left449.5 top100 228.5×230, inner inset -34.78/-35.01
    + `<div style="${abs}left:449.5px;top:100px;width:228.5px;height:230px"><div style="${abs}top:-34.78%;left:-35.01%;right:-35.01%;bottom:-34.78%">${img(A.glow, 'display:block;width:100%;height:100%')}</div></div>`
    + chip('fea', 424, 74)
    + chip('cvl', 504, 156)
    + badge
    + text
    + `</div></td></tr>`;
}

function build() {
  const dir = path.join(ROOT, 'assets/edm/promo01');
  const A = loadAssets(dir);
  const hero = promo01Hero(A);
  const outDir = path.join(ROOT, 'app/edm');
  fs.mkdirSync(outDir, { recursive: true });
  const js = '/* AUTO-GENERATED by build-edm.cjs — 편집금지. 소스: assets/edm/promo01 (Figma node 1455:2592). */\n'
    + 'window.EDM_PROMO01 = ' + JSON.stringify({ hero }) + ';\n';
  fs.writeFileSync(path.join(outDir, 'promo01.js'), js);
  console.log('wrote app/edm/promo01.js  (' + (js.length / 1024).toFixed(0) + ' KB)');
}
build();
