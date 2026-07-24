/* ============================================================
   store.js — 프로젝트 저장 (localStorage, 프로젝트-그릇 모델)
   Project{ id, name, kind(single|multi), stylePack, motion, createdAt, pages[] }
   Page{ id, name, pageType, volume, data(SiteData) }
   대시보드·페이지관리·스튜디오 공용.
   ============================================================ */
const PROJECTS_KEY = 'onsite-projects-v2';
/* 저장소: IndexedDB(대용량) + 메모리 캐시로 기존 동기 API 유지.
   최초 실행 시 localStorage 데이터를 IndexedDB로 이사(마이그레이션) 후 LS 키 제거.
   IndexedDB 불가(사생활 모드 등) 시 localStorage로 폴백. */
const IDB_NAME = 'onsite-webgen', IDB_STORE = 'projects';
let _cache = null;      // ready 후 프로젝트 배열(단일 진실)
let _useLS = false;     // IDB 불가 → localStorage 폴백
let _readyP = null;

function _openDB(){
  return new Promise((res, rej) => {
    let r; try{ r = indexedDB.open(IDB_NAME, 1); }catch(e){ return rej(e); }
    r.onupgradeneeded = () => { try{ if(!r.result.objectStoreNames.contains(IDB_STORE)) r.result.createObjectStore(IDB_STORE, { keyPath:'id' }); }catch(e){} };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function _idbAll(){ return _openDB().then(db => new Promise((res, rej) => { const rq = db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).getAll(); rq.onsuccess = () => res(rq.result || []); rq.onerror = () => rej(rq.error); })); }
function _idbReplace(list){ return _openDB().then(db => new Promise((res, rej) => { const tx = db.transaction(IDB_STORE,'readwrite'); const os = tx.objectStore(IDB_STORE); os.clear(); (list||[]).forEach(p => { try{ os.put(p); }catch(e){} }); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); })); }

// 페이지 초기 렌더/쓰기 전에 await 할 것. 이후 get/saveProjects는 동기.
export function storeReady(){
  if(_readyP) return _readyP;
  _readyP = (async () => {
    let ls = []; try{ ls = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []; }catch(e){}
    try{
      let idb = await _idbAll();
      if(!idb.length && ls.length){ await _idbReplace(ls); idb = ls; try{ localStorage.removeItem(PROJECTS_KEY); }catch(e){} } // 최초 이사
      _cache = idb;
    }catch(e){ _useLS = true; _cache = ls; }   // IDB 불가 → LS 폴백
  })();
  return _readyP;
}

export const PT_LABEL = { main:'메인홈', features:'제품 기능소개', pricing:'요금 비교', landing:'랜딩', notice:'공지' };
export const emptyData = () => ({ productName:'', tagline:'', subcopy:'', primaryCta:'', features:[], stats:[], bannerText:'', bannerCta:'', footerLinks:[], footerCopyright:'', images:{}, sectionOrder:[], hiddenSections:[], shownSections:[] });

export function getProjects(){ if(_cache) return _cache; try{ return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []; }catch{ return []; } }
let _writeP = Promise.resolve();
export function saveProjects(a){ _cache = a; if(_useLS){ try{ localStorage.setItem(PROJECTS_KEY, JSON.stringify(a)); }catch(e){ console.error('[store] LS save', e); } } else { _writeP = _idbReplace(a).catch(e => console.error('[store] idb save', e)); } }
// 저장(IDB 비동기) 완료 대기 — 생성 직후 페이지 이동 전에 await 할 것(경합 방지)
export function storeFlush(){ return _writeP; }
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
// parentId: 메뉴 트리 부모. null = 최상위(루트)
export function newPage(pageType='main', shared={}, parentId=null){
  const data = emptyData();
  if(shared.productName) data.productName = shared.productName;
  if(shared.tagline) data.tagline = shared.tagline;
  if(shared.primaryCta) data.primaryCta = shared.primaryCta;
  return { id: uid('pg'), name: PT_LABEL[pageType] || '페이지', pageType, volume:'heavy', parentId, data };
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

export function addPage(projectId, pageType='main', parentId=null, name=null){
  const p = getProject(projectId); if(!p) return null;
  const pg = newPage(pageType, p.shared || {}, parentId);
  if(name && name.trim()) pg.name = name.trim();
  p.pages.push(pg); upsertProject(p);
  return pg;
}

export function renamePage(projectId, pageId, name){
  const p = getProject(projectId); if(!p) return;
  const pg = p.pages.find(x => x.id === pageId); if(!pg) return;
  const t = (name || '').trim(); if(!t) return;
  pg.name = t; upsertProject(p);
}

// 한 페이지 + 모든 하위 자손 id 집합
function descendantIds(pages, rootId){
  const out = new Set([rootId]);
  let grew = true;
  while(grew){
    grew = false;
    for(const pg of pages){ if(pg.parentId && out.has(pg.parentId) && !out.has(pg.id)){ out.add(pg.id); grew = true; } }
  }
  return out;
}

// 삭제 = 해당 페이지와 그 하위 트리 전체 제거
// 템플릿 → 프로젝트 복사 (전 페이지 생성완료 상태). 스튜디오 편집모드로 바로 진입.
export function createProjectFromTemplate(tpl){
  if(!tpl) return null;
  const p = createProject({ kind: tpl.kind||'single', name: tpl.name||'무제 프로젝트', shared:{ productName: (tpl.pages && tpl.pages[0] && tpl.pages[0].data && tpl.pages[0].data.productName) || '' }, stylePack: tpl.stylePack });
  const full = getProject(p.id);
  full.pages = (tpl.pages||[]).map(pg => ({
    id: uid('pg'), name: pg.name||'페이지', pageType: pg.pageType||'main', volume: pg.volume||'heavy', parentId: pg.parentId||null,
    data: Object.assign(emptyData(), JSON.parse(JSON.stringify(pg.data||{}))),
    chat: { log:[{r:'bot',t:'📂 템플릿에서 시작했어요. 편집 모드에서 바로 수정하세요.'}], idx:8, generated:true },
  }));
  upsertProject(full);
  return full;
}

export function deletePage(projectId, pageId){
  const p = getProject(projectId); if(!p) return;
  const kill = descendantIds(p.pages, pageId);
  p.pages = p.pages.filter(x => !kill.has(x.id)); upsertProject(p);
}

// 트리 이동 = 부모 변경(reparent) + 형제 내 위치 변경(reorder)
// parentId: 새 부모 id (null=루트). index: 새 형제들 중 삽입 위치(null=맨 끝)
// 형제 순서는 pages[] 배열 순서로 표현.
export function movePage(projectId, pageId, parentId=null, index=null){
  const p = getProject(projectId); if(!p) return;
  const pg = p.pages.find(x => x.id === pageId); if(!pg) return;
  parentId = parentId || null;
  // 순환 방지: 자기 자신·자손 밑으로는 못 감
  if(parentId){
    if(descendantIds(p.pages, pageId).has(parentId)) return;
  }
  pg.parentId = parentId;
  // 배열에서 빼고, 새 형제들 기준으로 다시 삽입
  p.pages = p.pages.filter(x => x.id !== pageId);
  const siblings = p.pages.filter(x => (x.parentId || null) === parentId);
  let at;
  if(index == null || index >= siblings.length){
    if(siblings.length) at = p.pages.indexOf(siblings[siblings.length - 1]) + 1;
    else if(parentId) at = p.pages.indexOf(p.pages.find(x => x.id === parentId)) + 1;
    else at = p.pages.length;
  } else {
    at = p.pages.indexOf(siblings[index]);
  }
  p.pages.splice(at, 0, pg);
  upsertProject(p);
}

// pages[] → 중첩 트리 [{...page, children:[...]}] (배열 순서 = 형제 순서)
export function pageTree(pages){
  const byParent = new Map();
  pages.forEach(pg => { const k = pg.parentId || null; if(!byParent.has(k)) byParent.set(k, []); byParent.get(k).push(pg); });
  const build = (parentId) => (byParent.get(parentId) || []).map(pg => ({ ...pg, children: build(pg.id) }));
  return build(null);
}

// 모든 페이지 로드 시 즉시 캐시 준비 시작(마이그레이션 포함). 페이지는 storeReady()를 await.
storeReady();
