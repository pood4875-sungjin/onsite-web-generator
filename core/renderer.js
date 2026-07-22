import { esc } from './esc.js';
import { byId } from './sections/index.js';

export function resolveVariant(section, def, pack) {
  if (section.variant) return section.variant;
  const mapped = pack?.variantMap?.[section.type];
  if (mapped) return mapped;
  return def.variants[0];
}

export function renderSections(pageDoc, pack) {
  const shared = pageDoc.sharedFacts || {};
  const ctx = { esc, shared };
  return (pageDoc.sections || [])
    .map((s) => {
      const def = byId[s.type];
      if (!def) return ''; // unknown type → skip (no runtime invention)
      const variant = resolveVariant(s, def, pack);
      const data = s.slotValues || {};
      return `<section class="sx" data-sec="${esc(s.type)}">${def.render(data, variant, ctx)}</section>`;
    })
    .filter(Boolean)
    .join('\n');
}

export function renderDocument(pageDoc, pack) {
  const title = esc(pageDoc.meta?.title || pack?.meta?.name || 'Untitled');
  const motion = esc(pack?.meta?.motionDefault || 'subtle');
  const tokens = pack?.tokensCss ? pack.tokensCss() : '';
  const body = renderSections(pageDoc, pack);
  return `<!doctype html>
<html lang="ko" data-motion="${motion}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${tokens}
/* base scaffold — pack-agnostic minimal layout so probe is viewable */
*{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,"Apple SD Gothic Neo",sans-serif}
.container{max-width:var(--container);margin:0 auto;padding:0 24px}
.band{padding:64px 0} .band.alt{background:var(--bg-2)}
.center{text-align:center} h1{font-size:var(--fs-h1);margin:0 0 16px} .h-sec{font-size:var(--fs-h2)}
.btn{display:inline-block;padding:10px 18px;border:1px solid var(--line);border-radius:var(--radius);text-decoration:none;color:var(--ink)}
.btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;margin-top:32px}
.card{border:1px solid var(--line);border-radius:var(--radius);padding:24px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:64px 0}
.hero.center{grid-template-columns:1fr;text-align:center}
.hero-media{width:100%;aspect-ratio:4/3;background:var(--bg-2);border-radius:var(--radius)}
.gnb{display:flex;align-items:center;gap:24px;padding:16px 24px;border-bottom:1px solid var(--line)}
.gnb nav{display:flex;gap:16px;flex:1} .gnb a{text-decoration:none;color:var(--ink-2)}
.footer{background:var(--bg-2);padding:48px 0;margin-top:48px} .row{display:flex;gap:12px}
</style>
</head>
<body>
${body}
</body>
</html>`;
}
