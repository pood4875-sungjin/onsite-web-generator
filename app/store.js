/* ============================================================
   store.js — 프로젝트 저장 (localStorage, 프로젝트-그릇 모델)
   Project{ id, name, kind(single|multi), stylePack, motion, createdAt, pages[] }
   Page{ id, name, pageType, volume, data(SiteData) }
   대시보드·페이지관리·스튜디오 공용.
   ============================================================ */
const PROJECTS_KEY = 'onsite-projects-v2';

export const PT_LABEL = { main:'메인홈', features:'제품 기능소개', pricing:'요금 비교', landing:'랜딩', notice:'공지' };
export const emptyData = () => ({ productName:'', tagline:'', subcopy:'', primaryCta:'', features:[], stats:[], bannerText:'', bannerCta:'' });

export function getProjects(){ try{ return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []; }catch{ return []; } }
export function saveProjects(a){ localStorage.setItem(PROJECTS_KEY, JSON.stringify(a)); }
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

// 페이지 생성 — 프로젝트 공유 사실(제품명·태그라인·주CTA)을 초기값으로 시드
export function newPage(pageType='main', shared={}){
  const data = emptyData();
  if(shared.productName) data.productName = shared.productName;
  if(shared.tagline) data.tagline = shared.tagline;
  if(shared.primaryCta) data.primaryCta = shared.primaryCta;
  return { id: uid('pg'), name: PT_LABEL[pageType] || '페이지', pageType, volume:'heavy', data };
}

export function createProject({ name, kind='single', shared={}, stylePack='aether', org='' } = {}){
  const p = {
    id: uid('pr'),
    name: name || shared.productName || '무제 프로젝트',
    kind,
    org,
    shared,
    stylePack,
    motion: 'subtle',
    createdAt: Date.now(),
    // 단일 = 페이지 1개 자동, 다중 = 워크스페이스에서 추가
    pages: kind === 'single' ? [ newPage('main', shared) ] : [],
  };
  return upsertProject(p);
}

export function addPage(projectId, pageType='main'){
  const p = getProject(projectId); if(!p) return null;
  const pg = newPage(pageType, p.shared || {});
  p.pages.push(pg); upsertProject(p);
  return pg;
}

export function deletePage(projectId, pageId){
  const p = getProject(projectId); if(!p) return;
  p.pages = p.pages.filter(x => x.id !== pageId); upsertProject(p);
}
