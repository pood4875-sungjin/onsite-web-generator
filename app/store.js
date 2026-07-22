/* ============================================================
   store.js — 프로젝트 저장 (localStorage, 프로젝트-그릇 모델)
   Project{ id, name, kind(single|multi), stylePack, motion, createdAt, pages[] }
   Page{ id, name, pageType, volume, data(SiteData) }
   대시보드·페이지관리·스튜디오 공용.
   ============================================================ */
const KEY = 'onsite-projects-v2';

export const PT_LABEL = { main:'메인홈', features:'제품 기능소개', pricing:'요금 비교', landing:'랜딩', notice:'공지' };
export const emptyData = () => ({ productName:'', tagline:'', subcopy:'', primaryCta:'', features:[], stats:[], bannerText:'', bannerCta:'' });

export function getProjects(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch{ return []; } }
export function saveProjects(a){ localStorage.setItem(KEY, JSON.stringify(a)); }
export function getProject(id){ return getProjects().find(p => p.id === id) || null; }

export function upsertProject(p){
  const a = getProjects();
  const i = a.findIndex(x => x.id === p.id);
  if(i >= 0) a[i] = p; else a.unshift(p);
  saveProjects(a);
  return p;
}

export function deleteProject(id){ saveProjects(getProjects().filter(p => p.id !== id)); }

let seq = 0;
const uid = (pre) => pre + Date.now().toString(36) + (seq++).toString(36);

export function newPage(pageType='main'){
  return { id: uid('pg'), name: PT_LABEL[pageType] || '페이지', pageType, volume:'heavy', data: emptyData() };
}

export function createProject({ name, kind='single', pageType='main', stylePack='aether' } = {}){
  const p = {
    id: uid('pr'),
    name: name || '무제 프로젝트',
    kind,
    stylePack,
    motion: 'subtle',
    createdAt: Date.now(),
    pages: [ newPage(pageType) ],
  };
  return upsertProject(p);
}
