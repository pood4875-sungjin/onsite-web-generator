import { writeFileSync } from 'node:fs';
import { renderDocument } from '../renderer.js';
import { validatePageDoc } from '../pagedoc.js';
import { samplePack } from '../packs/sample/pack.js';
import { samplePage } from './sample-page.js';

const v = validatePageDoc(samplePage);
if (!v.ok) { console.error('Invalid PageDoc:', v.errors); process.exit(1); }

const html = renderDocument(samplePage, samplePack);
writeFileSync(new URL('./out.html', import.meta.url), html);
console.log('wrote core/probe/out.html —', html.length, 'bytes');
