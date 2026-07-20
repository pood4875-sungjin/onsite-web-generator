/* ============================================================
   registry.js v2 — 구현된 섹션 레지스트리 (빌더·갤러리 공용 단일 소스)
   유형화 v2(20 대분류) 기준. 각 섹션 = 구현된 실물 render.
   전 하위유형 도식은 taxonomy-visual.html, 여기는 "구현된 subset"(성장).
   각 섹션: {type,label,pageTypes,variants:[{id,label}], render(variantId)->HTML}
   render 결과는 .sx 스코프에서 렌더 (styles/sections.css).
   전역: SECTIONS, CAT_LABEL, findSection, sectionList
   ============================================================ */
const H = { sample:'설명 텍스트가 들어갑니다. 기획 내용에 맞춰 교체됩니다.' };
const eb=(t)=>`<div class="eyebrow">${t}</div>`;
function head(eyebrow,title,sub,center=true){
  return `<div class="${center?'center':''}">${eb(eyebrow)}<h2 class="h-sec">${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div>`;
}
const cardEl=(inner,cls='')=>`<div class="card ${cls}">${inner}</div>`;
const B='제품소개', M='매뉴얼', BM=['product','manual'];

/* 미니 UI 목업 (회색 박스 대신 디자인된 스켈레톤) */
function mock(kind='app',tint=false){
  const barTop=`<div class="bar"><i></i><i></i><i></i><span class="u"></span></div>`;
  const cls=`mock${tint?' tint':''}`;
  if(kind==='dashboard')return `<div class="${cls}">${barTop}<div class="mcontent"><span class="ln t"></span><div class="kpirow">${'<div class="kp"><b></b><i></i></div>'.repeat(3)}</div><div class="mbars">${[52,74,60,88,66,82].map(h=>`<i style="height:${h}%"></i>`).join('')}</div></div></div>`;
  if(kind==='chat')return `<div class="${cls}">${barTop}<div class="mcontent" style="gap:7px"><span class="bub"></span><span class="bub me"></span><span class="bub" style="max-width:55%"></span><span class="bub me" style="max-width:60%"></span></div></div>`;
  if(kind==='plain')return `<div class="${cls}">${barTop}<div class="mcontent"><span class="ln t"></span><span class="ln"></span><span class="ln"></span><span class="ln" style="width:70%"></span><div class="cardrow"><div class="mc"></div><div class="mc"></div></div></div></div>`;
  return `<div class="${cls}">${barTop}<div class="mbody"><div class="side"><b class="on"></b><b></b><b></b><b></b></div><div class="mcontent"><span class="ln t"></span><span class="ln"></span><div class="cardrow"><div class="mc"></div><div class="mc"></div></div><span class="ln"></span><span class="ln" style="width:66%"></span></div></div></div>`;
}
/* 라인 아이콘 (Wanted 계열 2px stroke, currentColor) */
const P24='<svg class="ico" viewBox="0 0 24 24">';
const ICON={
  message:`${P24}<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z"/></svg>`,
  tasks:`${P24}<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>`,
  folder:`${P24}<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>`,
  calendar:`${P24}<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>`,
  shield:`${P24}<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z"/><path d="M9.5 12l2 2 3.5-3.5"/></svg>`,
  bolt:`${P24}<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/></svg>`,
  chart:`${P24}<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>`,
  users:`${P24}<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5"/></svg>`,
  plug:`${P24}<path d="M9 3v6M15 3v6M6 9h12v2a6 6 0 0 1-12 0Z"/><path d="M12 17v4"/></svg>`,
  cloud:`${P24}<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4 4 0 0 1 17 18Z"/></svg>`,
  cog:`${P24}<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>`,
  check:`${P24}<path d="M20 6 9 17l-5-5"/></svg>`,
};
const ICO_LIST=['message','tasks','folder','calendar','shield','bolt','chart','users','plug','cloud','cog','check'];
const ico=(i)=>ICON[ICO_LIST[i%ICO_LIST.length]];

const SECTIONS = {
  /* 01 Navigation */
  nav:[
    {type:'gnb',label:'Header / GNB',pageTypes:BM,variants:[{id:'solid',label:'솔리드'},{id:'trans',label:'투명오버'},{id:'cta',label:'CTA포함'}],
     render:v=>`<div class="gnb ${v==='trans'?'trans':''}"><div class="logo">ONSITE</div><nav><span>제품</span><span>기능</span><span>업종별</span><span>요금</span><span>고객사례</span></nav>${v==='cta'?'<a class="btn primary">무료로 시작</a>':'<a class="btn">로그인</a>'}</div>`},
    {type:'breadcrumb',label:'Breadcrumb',pageTypes:BM,variants:[{id:'inline',label:'인라인'}],
     render:v=>`<div class="band" style="padding:20px 0"><div class="container"><div class="breadcrumb"><span>홈</span><span class="sep">›</span><span>제품</span><span class="sep">›</span><span style="color:var(--ink)">현장 메신저</span></div></div></div>`},
    {type:'toc',label:'문서 목차 (TOC)',pageTypes:['manual'],variants:[{id:'side',label:'사이드'},{id:'inline',label:'인라인'}],
     render:v=>`<div class="band"><div class="container"><div class="toc" style="max-width:${v==='side'?'300px':'100%'}"><div style="font-weight:600;margin-bottom:8px">목차</div><a>1. 시작하기</a><a>2. 기본 설정</a><a>3. 사용 방법</a><a>4. 문제 해결</a></div></div></div>`},
  ],
  /* 02 Hero */
  hero:[
    {type:'standard',label:'Standard Hero',pageTypes:['product'],variants:[{id:'split',label:'split'},{id:'center',label:'centered'},{id:'min',label:'minimal'},{id:'bg',label:'bg-image'}],
     render:v=>{const cta=`<div class="row" style="${v==='split'?'':'justify-content:center'}"><a class="btn primary">무료로 시작하기</a><a class="btn">도입 문의 →</a></div>`;
       const txt=`<div>${eb('현장 업무 플랫폼')}<h1>현장의 모든 일,<br>하나로 연결됩니다</h1><p class="lead">${H.sample}</p>${cta}</div>`;
       if(v==='split')return `<div class="container"><div class="hero">${txt}${mock('app',true)}</div></div>`;
       if(v==='bg')return `<div class="hero bg" style="padding:80px 32px"><div class="container">${txt}</div></div>`;
       return `<div class="container"><div class="hero min">${txt}</div></div>`;}},
    {type:'productVisual',label:'Product Visual Hero',pageTypes:['product'],variants:[{id:'screenshot',label:'스크린샷'},{id:'dashboard',label:'대시보드'}],
     render:v=>`<div class="container"><div class="hero"><div>${eb('제품 소개')}<h1>직접 보면<br>더 확실합니다</h1><p class="lead">${H.sample}</p><div class="row"><a class="btn primary">데모 보기</a></div></div>${mock(v==='dashboard'?'dashboard':'app')}</div></div>`},
    {type:'pageHero',label:'Page Hero (배너)',pageTypes:BM,variants:[{id:'detail',label:'상세'},{id:'manual',label:'매뉴얼'}],
     render:v=>`<div class="band alt" style="padding:56px 0"><div class="container">${v==='manual'?'<div class="breadcrumb" style="margin-bottom:16px"><span>매뉴얼</span><span class="sep">›</span><span style="color:var(--ink)">시작하기</span></div>':eb('제품 상세')}<h1 style="font-size:38px">${v==='manual'?'현장 메신저 시작 가이드':'현장 메신저'}</h1><p class="sub">${H.sample}</p></div></div>`},
    {type:'video',label:'Video / BG Hero',pageTypes:['product'],variants:[{id:'video',label:'영상'},{id:'carousel',label:'캐러셀'}],
     render:v=>`<div class="hero bg" style="padding:100px 32px;position:relative"><div class="container center"><h1>${v==='carousel'?'2만 명이 온사이트로 일합니다':'현장을 움직이는 힘'}</h1><p class="lead" style="margin-left:auto;margin-right:auto">${H.sample}</p><div class="row" style="justify-content:center"><a class="btn primary">${v==='video'?'▶ 영상 보기':'시작하기'}</a></div></div></div>`},
  ],
  /* 03 Text / Introduction */
  text:[
    {type:'overview',label:'Product Overview',pageTypes:['product'],variants:[{id:'split',label:'분할'},{id:'lead',label:'리드+본문'}],
     render:v=>v==='split'?`<div class="band"><div class="container"><div class="hero" style="padding:0"><div>${eb('Overview')}<h2 class="h-sec">흩어진 업무를<br>하나의 흐름으로</h2></div><div><p class="sub" style="max-width:none">${H.sample}</p><p class="sub" style="max-width:none;margin-top:12px">${H.sample}</p></div></div></div></div>`
       :`<div class="band"><div class="container center">${eb('Overview')}<h2 class="h-sec">일의 시작부터 끝까지</h2><p class="sub">${H.sample}</p></div></div>`},
    {type:'value',label:'Value Proposition',pageTypes:['product'],variants:[{id:'pillars',label:'3 기둥'}],
     render:v=>`<div class="band"><div class="container">${head('Why Onsite','분산을 줄일수록 본질에 집중','')}<div class="grid cols-3" style="margin-top:40px;gap:40px">${[1,2,3].map(i=>`<div><div class="k">0${i}</div><h3 style="font-size:22px">가치 ${i}</h3><p class="muted" style="margin-top:8px">${H.sample}</p></div>`).join('')}</div></div></div>`},
    {type:'problem',label:'Problem / Solution',pageTypes:['product'],variants:[{id:'ps',label:'문제/해결'},{id:'ab',label:'As-is/To-be'}],
     render:v=>`<div class="band alt"><div class="container"><div class="grid cols-2" style="gap:20px">${cardEl(`<div class="k" style="color:var(--danger)">${v==='ab'?'As-is':'Problem'}</div><h3 style="font-size:20px">지금의 문제</h3><p class="muted" style="margin-top:8px">${H.sample}</p>`)}${cardEl(`<div class="k" style="color:var(--ok)">${v==='ab'?'To-be':'Solution'}</div><h3 style="font-size:20px">온사이트의 해결</h3><p class="muted" style="margin-top:8px">${H.sample}</p>`)}</div></div></div>`},
    {type:'prerequisite',label:'준비사항 (매뉴얼)',pageTypes:['manual'],variants:[{id:'chk',label:'체크리스트'},{id:'callout',label:'콜아웃'}],
     render:v=>v==='callout'?`<div class="band"><div class="container"><div class="callout info"><b>시작하기 전에</b><p class="muted" style="margin:6px 0 0">${H.sample}</p></div></div></div>`
       :`<div class="band"><div class="container">${head('준비사항','시작 전 확인하세요','',false)}<ul class="chk" style="margin-top:16px"><li>계정이 생성되어 있어야 합니다</li><li>관리자 권한이 필요합니다</li><li>최신 버전으로 업데이트하세요</li></ul></div></div>`},
  ],
  /* 04 Image + Text */
  imgtext:[
    {type:'imageText',label:'Image & Text',pageTypes:BM,variants:[{id:'left',label:'이미지 좌'},{id:'right',label:'이미지 우'}],
     render:v=>{const img=mock('chat');const txt=`<div>${eb('기능')}<h2 class="h-sec">현장과 본사가<br>실시간으로</h2><p class="sub">${H.sample}</p><ul class="chk" style="margin-top:16px"><li>실시간 메시지</li><li>읽음 확인</li></ul></div>`;
       return `<div class="band"><div class="container"><div class="hero" style="padding:0">${v==='left'?img+txt:txt+img}</div></div></div>`;}},
    {type:'zigzag',label:'교차 (Zigzag)',pageTypes:['product'],variants:[{id:'alt',label:'좌우 교차'}],
     render:v=>{const block=(rev,i)=>`<div class="hero" style="padding:24px 0">${rev?`${mock('plain')}<div><h3 style="font-size:24px">기능 ${i}</h3><p class="muted" style="margin-top:8px">${H.sample}</p></div>`:`<div><h3 style="font-size:24px">기능 ${i}</h3><p class="muted" style="margin-top:8px">${H.sample}</p></div>${mock('plain')}`}</div>`;
       return `<div class="band"><div class="container">${block(false,1)}${block(true,2)}</div></div>`;}},
  ],
  /* 05 Card */
  card:[
    {type:'iconCard',label:'아이콘 카드',pageTypes:['product'],variants:[{id:'c3',label:'3열'},{id:'c4',label:'4열'}],
     render:v=>{const n=v==='c4'?4:3;return `<div class="band"><div class="container">${head('Features','핵심 기능','')}<div class="grid cols-${n}" style="margin-top:32px">${Array.from({length:n*2},(_,i)=>cardEl(`<div class="ic">${ico(i)}</div><h3 style="margin-top:12px">기능 ${i+1}</h3><p class="muted" style="margin-top:6px">${H.sample}</p>`)).join('')}</div></div></div>`}},
    {type:'imageCard',label:'이미지 카드',pageTypes:['product'],variants:[{id:'c3',label:'3열'}],
     render:v=>`<div class="band alt"><div class="container">${head('Products','다양한 제품','')}<div class="grid cols-3" style="margin-top:32px">${[1,2,3].map(i=>cardEl(`<div class="visual" style="aspect-ratio:16/10;margin:-22px -22px 14px;border-radius:10px 10px 0 0;border:none">이미지</div><h3>제품 ${i}</h3><p class="muted" style="margin-top:6px">${H.sample}</p>`,'')).join('')}</div></div></div>`},
    {type:'statCard',label:'수치 카드',pageTypes:['product'],variants:[{id:'kpi',label:'KPI'}],
     render:v=>`<div class="band"><div class="container">${head('By the numbers','성과','')}<div class="grid cols-3" style="margin-top:32px">${[['180만+','누적 이용자'],['42만+','도입 고객사'],['99%','고객 만족도']].map(([n,l])=>`<div class="kpi"><div class="n">${n}</div><div class="muted" style="margin-top:6px">${l}</div></div>`).join('')}</div></div></div>`},
  ],
  /* 06 List */
  list:[
    {type:'basicList',label:'기본 리스트',pageTypes:BM,variants:[{id:'check',label:'체크'},{id:'icon',label:'아이콘'}],
     render:v=>`<div class="band"><div class="container">${head('상세 기능','무엇이 되나요','',false)}<ul class="chk" style="margin-top:16px">${Array(5).fill(`<li>${H.sample}</li>`).join('')}</ul></div></div>`},
    {type:'thumbList',label:'썸네일 리스트',pageTypes:['product'],variants:[{id:'thumb',label:'썸네일'}],
     render:v=>`<div class="band"><div class="container"><ul class="list">${[1,2,3,4].map(i=>`<li><span class="th"></span><div><h3 style="font-size:16px">항목 제목 ${i}</h3><p class="muted" style="margin-top:2px">${H.sample}</p></div></li>`).join('')}</ul></div></div>`},
  ],
  /* 07 Feature Showcase */
  feature:[
    {type:'grid',label:'Feature Grid',pageTypes:['product'],variants:[{id:'grid',label:'그리드'},{id:'alt',label:'좌우교차'}],
     render:v=>v==='alt'?`<div class="band"><div class="container"><div class="hero" style="padding:0"><div><h2 class="h-sec">핵심 기능</h2><p class="sub">${H.sample}</p></div>${mock('app')}</div></div></div>`
       :`<div class="band alt"><div class="container">${head('Features','일의 시작부터 끝까지','')}<div class="grid cols-3" style="margin-top:32px">${[1,2,3].map(i=>cardEl(`<div class="ic" style="margin-bottom:12px">${ico(i)}</div><h3>기능 ${i}</h3><p class="muted" style="margin-top:6px">${H.sample}</p>`)).join('')}</div></div></div>`},
    {type:'tab',label:'Feature Tab',pageTypes:['product'],variants:[{id:'tab',label:'탭'}],
     render:v=>`<div class="band"><div class="container">${head('Features','기능별로 살펴보기','')}<div class="tabs" style="margin-top:24px"><span class="tab on">소통</span><span class="tab">관리</span><span class="tab">기록</span></div><div class="hero" style="padding:0"><div><h3 style="font-size:24px">현장과 본사가 실시간으로</h3><p class="muted" style="margin-top:8px">${H.sample}</p></div>${mock('app')}</div></div></div>`},
    {type:'bento',label:'Bento Feature',pageTypes:['product'],variants:[{id:'bento',label:'Bento'}],
     render:v=>`<div class="band"><div class="container">${head('Features','한눈에 보는 강점','')}<div class="grid" style="grid-template-columns:2fr 1fr;margin-top:32px">${cardEl(`<h3 style="font-size:22px">대표 기능</h3><p class="muted" style="margin-top:8px">${H.sample}</p><div style="margin-top:16px">${mock('dashboard')}</div>`)}<div class="grid" style="gap:16px">${cardEl(`<div class="ic" style="margin-bottom:8px">${ico(0)}</div><h3>기능 A</h3>`)}${cardEl(`<div class="ic" style="margin-bottom:8px">${ico(1)}</div><h3>기능 B</h3>`)}</div></div></div></div>`},
  ],
  /* 08 Product Showcase */
  product:[
    {type:'lineup',label:'제품 라인업',pageTypes:['product'],variants:[{id:'c3',label:'3열'},{id:'c4',label:'4열'}],
     render:v=>{const n=v==='c4'?4:3;return `<div class="band"><div class="container">${head('Products','온사이트의 다양한 제품','현장 업무에 필요한 모든 기능')}<div class="grid cols-${n}" style="margin-top:32px">${Array.from({length:n*2},(_,i)=>cardEl(`<div class="ic">${ico(i)}</div><h3 style="margin-top:12px">제품 ${i+1}</h3><p class="muted" style="margin-top:6px">${H.sample}</p>`)).join('')}</div></div></div>`}},
    {type:'showcase',label:'제품 화면 전시',pageTypes:['product'],variants:[{id:'shot',label:'스크린샷'},{id:'device',label:'디바이스'}],
     render:v=>`<div class="band alt"><div class="container center">${head('Showcase','제품을 직접 확인하세요','')}<div style="margin-top:32px">${v==='device'?`<div class="device">${mock('chat')}</div>`:mock('dashboard')}</div></div></div>`},
  ],
  /* 09 Process / Step */
  process:[
    {type:'step',label:'Step Process',pageTypes:['product'],variants:[{id:'h',label:'가로'},{id:'v',label:'세로'}],
     render:v=>{const st=(i,t)=>`<div class="center"><div class="num" style="font-size:20px;width:44px;height:44px;border:1px solid var(--line);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">${i}</div><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin-top:4px">${H.sample}</p></div>`;
       return `<div class="band"><div class="container">${head('How it works','3분이면 시작','')}<div class="grid cols-4" style="margin-top:40px">${st(1,'가입')}${st(2,'초대')}${st(3,'설정')}${st(4,'사용')}</div></div></div>`;}},
    {type:'stepGuide',label:'단계별 가이드 (매뉴얼)',pageTypes:['manual'],variants:[{id:'num',label:'번호'},{id:'shot',label:'스샷'}],
     render:v=>{const s=(i,t)=>`<div class="step"><div class="n">${i}</div><div><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin-top:4px">${H.sample}</p>${v==='shot'?'<div class="visual" style="margin-top:12px;aspect-ratio:16/6">스크린샷</div>':''}</div></div>`;
       return `<div class="band"><div class="container">${head('절차','따라 하기','',false)}<div style="margin-top:16px">${s(1,'첫 번째 단계')}${s(2,'두 번째 단계')}${s(3,'세 번째 단계')}</div></div></div>`;}},
    {type:'timeline',label:'Timeline',pageTypes:['product'],variants:[{id:'v',label:'세로'}],
     render:v=>`<div class="band alt"><div class="container">${head('Roadmap','도입 여정','',false)}<div class="timeline" style="margin-top:24px">${['도입 문의','환경 설정','팀 온보딩','운영 안정화'].map(t=>`<div class="ti"><h3 style="font-size:17px">${t}</h3><p class="muted" style="margin-top:4px">${H.sample}</p></div>`).join('')}</div></div></div>`},
    {type:'flow',label:'Flow',pageTypes:['product'],variants:[{id:'arrow',label:'화살표'}],
     render:v=>`<div class="band"><div class="container">${head('How it works','작동 흐름','')}<div class="flow" style="margin-top:32px"><div class="node">입력</div><span class="arw">→</span><div class="node">처리</div><span class="arw">→</span><div class="node">결과</div></div></div></div>`},
  ],
  /* 10 Diagram / Architecture */
  diagram:[
    {type:'architecture',label:'System Architecture',pageTypes:['product'],variants:[{id:'diagram',label:'구조도'}],
     render:v=>`<div class="band alt"><div class="container">${head('Architecture','시스템 구조','')}<div class="diagram" style="margin-top:32px"><div class="node">클라이언트</div><div class="hub">온사이트 코어</div><div class="node">외부 연동</div><div class="node">모바일</div><div style="grid-column:2" class="node">데이터 저장소</div><div class="node">관리 콘솔</div></div></div></div>`},
    {type:'security',label:'보안 / 인증',pageTypes:['product'],variants:[{id:'cert',label:'인증마크'}],
     render:v=>`<div class="band"><div class="container hero" style="padding:64px 32px"><div>${eb('Security')}<h2 class="h-sec">글로벌 최고 수준 보안</h2><p class="sub">${H.sample}</p></div><div class="grid cols-3" style="gap:8px">${['ISO 27001','ISMS-P','CSAP','ISO 27701','CSA STAR','ISO 27017'].map(t=>`<div class="cell" style="height:52px">${t}</div>`).join('')}</div></div></div>`},
    {type:'integration',label:'Integration',pageTypes:['product'],variants:[{id:'logos',label:'로고'},{id:'map',label:'연결맵'}],
     render:v=>`<div class="band alt"><div class="container center">${head('Integrations','쓰던 도구와 연동','')}<div class="row" style="justify-content:center;flex-wrap:wrap;margin-top:32px">${['Slack','GitHub','Jira','Google','Notion'].map(t=>`<div class="cell" style="min-width:120px;height:52px">${t}</div>`).join('')}</div></div></div>`},
  ],
  /* 11 Media */
  media:[
    {type:'gallery',label:'이미지 갤러리',pageTypes:BM,variants:[{id:'grid',label:'그리드'}],
     render:v=>`<div class="band"><div class="container">${head('Gallery','제품 화면','')}<div class="grid cols-3" style="margin-top:32px">${Array(6).fill('<div class="visual">이미지</div>').join('')}</div></div></div>`},
    {type:'video',label:'Video Block',pageTypes:BM,variants:[{id:'inline',label:'인라인'},{id:'code',label:'코드'}],
     render:v=>v==='code'?`<div class="band"><div class="container"><pre style="background:var(--ink);color:#e8e8e8;padding:18px;border-radius:10px;font-family:var(--font-mono);font-size:13px;overflow:auto">$ onsite init\n$ onsite deploy</pre></div></div>`
       :`<div class="band"><div class="container"><div class="visual" style="aspect-ratio:16/9">▶ 동영상</div><p class="muted center" style="margin-top:10px;font-size:13px">그림 1. 캡션</p></div></div>`},
  ],
  /* 12 Statistics / Data */
  stat:[
    {type:'counter',label:'Counter Row',pageTypes:['product'],variants:[{id:'row',label:'행'}],
     render:v=>`<div class="band"><div class="container">${head('By the numbers','숫자로 증명','')}<div class="grid cols-4" style="margin-top:40px">${[['1위','국내 순위'],['180만+','이용자'],['42만+','고객사'],['99%','만족도']].map(([n,l])=>`<div class="center"><div class="num">${n}</div><div class="muted" style="margin-top:8px">${l}</div></div>`).join('')}</div><p class="muted center" style="margin-top:24px;font-size:13px">출처: 예시</p></div></div>`},
    {type:'chart',label:'Chart',pageTypes:['product'],variants:[{id:'bar',label:'막대'}],
     render:v=>`<div class="band alt"><div class="container">${head('Performance','성과 추이','')}<div class="bars" style="margin-top:32px">${[45,62,55,78,90].map(h=>`<div class="bar" style="height:${h}%"></div>`).join('')}</div></div></div>`},
  ],
  /* 13 Comparison */
  comparison:[
    {type:'planTable',label:'플랜 비교표',pageTypes:['product'],variants:[{id:'table',label:'표'},{id:'cards',label:'카드'}],
     render:v=>v==='cards'?`<div class="band"><div class="container">${head('Pricing','요금제','')}<div class="grid cols-3" style="margin-top:32px">${[['Basic','무료',''],['Pro','₩9,900','feat'],['Enterprise','문의','']].map(([t,p,f])=>`<div class="price ${f}"><h3>${t}</h3><div class="num" style="font-size:32px;margin:12px 0">${p}</div><a class="btn primary">선택</a></div>`).join('')}</div></div></div>`
       :`<div class="band"><div class="container">${head('Pricing','요금제 비교','')}<table class="spec" style="margin-top:32px"><tr><td>플랜</td><td>Basic</td><td>Pro</td></tr><tr><td>가격</td><td>무료</td><td>₩9,900</td></tr><tr><td>멤버</td><td>10명</td><td>무제한</td></tr></table></div></div>`},
    {type:'beforeAfter',label:'Before / After',pageTypes:['product'],variants:[{id:'ba',label:'전/후'}],
     render:v=>`<div class="band alt"><div class="container"><div class="grid cols-2" style="gap:20px">${cardEl(`<div class="k">Before</div><h3 style="font-size:20px">도입 전</h3><ul class="chk" style="margin-top:10px"><li>${H.sample}</li><li>${H.sample}</li></ul>`)}${cardEl(`<div class="k" style="color:var(--brand)">After</div><h3 style="font-size:20px">도입 후</h3><ul class="chk" style="margin-top:10px"><li>${H.sample}</li><li>${H.sample}</li></ul>`,'')}</div></div></div>`},
    {type:'specTable',label:'사양표 (매뉴얼)',pageTypes:['manual'],variants:[{id:'kv',label:'key-value'}],
     render:v=>`<div class="band"><div class="container">${head('사양','상세 정보','',false)}<table class="spec" style="margin-top:16px"><tr><td>항목 A</td><td>값</td></tr><tr><td>항목 B</td><td>값</td></tr><tr><td>항목 C</td><td>값</td></tr></table></div></div>`},
  ],
  /* 14 Case Study / Testimonial */
  case:[
    {type:'caseCards',label:'사례 카드',pageTypes:['product'],variants:[{id:'grid',label:'그리드'}],
     render:v=>`<div class="band"><div class="container">${head('Case Study','도입 사례','')}<div class="grid cols-3" style="margin-top:32px">${[1,2,3].map(i=>cardEl(`<div class="cell" style="height:32px;width:80px;margin-bottom:12px">LOGO</div><h3 style="font-size:17px">고객사 ${i}</h3><p class="muted" style="margin-top:6px">${H.sample}</p><div class="num" style="font-size:22px;color:var(--brand);margin-top:10px">+40%</div>`)).join('')}</div></div></div>`},
    {type:'quote',label:'후기 (Testimonial)',pageTypes:['product'],variants:[{id:'single',label:'단일'},{id:'cards',label:'카드'}],
     render:v=>v==='cards'?`<div class="band alt"><div class="container">${head('Reviews','고객의 목소리','')}<div class="grid cols-3" style="margin-top:32px">${[1,2,3].map(i=>cardEl(`<p class="muted">"${H.sample}"</p><div class="who" style="text-align:left;margin-top:12px"><b>담당자 ${i}</b> · 기업</div>`)).join('')}</div></div></div>`
       :`<div class="band"><div class="container"><p class="quote">"${H.sample}"</p><div class="who"><b>정보화기획조정관</b> · 공공기관</div></div></div>`},
    {type:'logoWall',label:'고객사 로고월',pageTypes:['product'],variants:[{id:'grid',label:'그리드'}],
     render:v=>`<div class="band"><div class="container center"><p class="sub" style="margin:0 auto 24px">수많은 고객사가 함께합니다</p><div class="logos">${Array(10).fill('<div class="cell">LOGO</div>').join('')}</div></div></div>`},
  ],
  /* 15 Blog / Resource */
  blog:[
    {type:'postGrid',label:'게시글 카드',pageTypes:['product'],variants:[{id:'c3',label:'3열'}],
     render:v=>`<div class="band"><div class="container">${head('Newsroom','새로운 소식','')}<div class="grid cols-3" style="margin-top:32px">${['공지사항','활용팁','이벤트'].map(t=>cardEl(`<div class="visual" style="aspect-ratio:16/9;margin:-22px -22px 14px;border-radius:10px 10px 0 0;border:none"></div><div class="muted" style="font-size:13px;font-weight:600">${t}</div><h3 style="font-size:16px;margin:6px 0">소식 제목이 들어갑니다</h3><div class="muted" style="font-size:13px">2026. 07. 03</div>`)).join('')}</div></div></div>`},
    {type:'resource',label:'자료 다운로드',pageTypes:['product'],variants:[{id:'cards',label:'카드'}],
     render:v=>`<div class="band alt"><div class="container">${head('Resources','자료실','')}<div class="grid cols-3" style="margin-top:32px">${['제품 소개서','도입 사례집','기술 백서'].map(t=>cardEl(`<h3 style="font-size:16px">${t}</h3><p class="muted" style="margin-top:6px;font-size:13px">PDF · 2.4MB</p><a class="btn" style="margin-top:12px">다운로드 ↓</a>`)).join('')}</div></div></div>`},
  ],
  /* 16 FAQ / Accordion */
  faq:[
    {type:'accordion',label:'Accordion FAQ',pageTypes:BM,variants:[{id:'basic',label:'기본'},{id:'2col',label:'2열'}],
     render:v=>{const items=['도입은 어떻게 하나요?','요금제가 궁금해요','보안은 안전한가요?','무료 체험이 있나요?'];
       return `<div class="band"><div class="container">${head('FAQ','자주 묻는 질문','')}<div class="acc" style="margin-top:32px;${v==='2col'?'column-count:2;column-gap:16px':''}">${items.map(q=>`<div class="item"><span>${q}</span><span style="color:var(--soft)">＋</span></div>`).join('')}</div></div></div>`}},
    {type:'troubleshooting',label:'Troubleshooting (매뉴얼)',pageTypes:['manual'],variants:[{id:'acc',label:'아코디언'},{id:'table',label:'증상-해결'}],
     render:v=>v==='table'?`<div class="band"><div class="container">${head('문제 해결','증상별 해결','',false)}<table class="spec" style="margin-top:16px"><tr><td style="background:var(--bg-2);font-weight:600">증상</td><td style="background:var(--bg-2);font-weight:600">해결</td></tr><tr><td>로그인이 안 돼요</td><td>${H.sample}</td></tr><tr><td>알림이 안 와요</td><td>${H.sample}</td></tr></table></div></div>`
       :`<div class="band"><div class="container">${head('문제 해결','자주 있는 문제','',false)}<div class="acc" style="margin-top:16px">${['로그인이 안 돼요','알림이 안 와요'].map(q=>`<div class="item"><span>${q}</span><span style="color:var(--soft)">＋</span></div>`).join('')}</div></div></div>`},
  ],
  /* 17 Form */
  form:[
    {type:'inquiry',label:'문의 Form',pageTypes:BM,variants:[{id:'split',label:'좌설명/우폼'},{id:'center',label:'중앙'}],
     render:v=>{const form=`<div>${['이름','회사','이메일'].map(l=>`<div class="field"><label>${l}</label><input placeholder="${l} 입력"></div>`).join('')}<div class="field"><label>문의 내용</label><textarea rows="3" placeholder="내용"></textarea></div><a class="btn primary">문의하기</a></div>`;
       if(v==='center')return `<div class="band"><div class="container" style="max-width:520px">${head('Contact','도입 문의','',true)}<div style="margin-top:24px">${form}</div></div></div>`;
       return `<div class="band alt"><div class="container"><div class="hero" style="padding:0;align-items:start"><div>${eb('Contact')}<h2 class="h-sec">도입을<br>문의하세요</h2><p class="sub">${H.sample}</p></div>${form}</div></div></div>`;}},
    {type:'demo',label:'데모/체험 신청',pageTypes:['product'],variants:[{id:'trial',label:'체험'}],
     render:v=>`<div class="band"><div class="container center" style="max-width:520px">${head('Free Trial','무료로 시작하기','')}<div class="row" style="justify-content:center;margin-top:24px"><input class="btn" style="min-width:240px" placeholder="회사 이메일"><a class="btn primary">시작</a></div></div></div>`},
  ],
  /* 18 CTA */
  cta:[
    {type:'banner',label:'Banner CTA',pageTypes:BM,variants:[{id:'banner',label:'배너'},{id:'card',label:'카드'},{id:'support',label:'지원링크'}],
     render:v=>{const inner=`<h2 class="h-sec">온사이트를 지금 시작해보세요</h2><p class="sub" style="margin:10px auto 0">${H.sample}</p><div class="row" style="justify-content:center;margin-top:20px"><a class="btn primary">무료로 시작</a><a class="btn">문의</a></div>`;
       if(v==='card')return `<div class="band"><div class="container"><div class="card center" style="padding:48px">${inner}</div></div></div>`;
       if(v==='support')return `<div class="band alt center"><div class="container">${inner}<div class="row" style="justify-content:center;gap:24px;margin-top:24px;flex-wrap:wrap">${['서비스 소개서','시작 가이드','도입 문의','헬프센터'].map(t=>`<span class="muted">${t}</span>`).join('')}</div></div></div>`;
       return `<div class="band alt center"><div class="container">${inner}</div></div>`;}},
  ],
  /* 19 Notice / Banner */
  notice:[
    {type:'announce',label:'공지 띠배너',pageTypes:BM,variants:[{id:'promo',label:'프로모'},{id:'notice',label:'공지'}],
     render:v=>`<div class="announce">${v==='promo'?'온사이트 3.0 출시 — 새로워진 워크스페이스':'[안내] 정기 점검 예정'} <a style="font-weight:600;margin-left:6px">자세히 →</a></div>`},
    {type:'callout',label:'Callout / 노트',pageTypes:['manual'],variants:[{id:'info',label:'info'},{id:'warn',label:'warning'},{id:'tip',label:'tip'},{id:'danger',label:'danger'}],
     render:v=>{const map={info:['참고','info'],warn:['주의','warn'],tip:['팁','tip'],danger:['경고','danger']};const[t,c]=map[v]||map.info;
       return `<div class="band"><div class="container"><div class="callout ${c}"><b>${t}</b><p class="muted" style="margin:6px 0 0">${H.sample}</p></div></div></div>`;}},
  ],
  /* 20 Footer */
  footer:[
    {type:'footer',label:'Footer',pageTypes:BM,variants:[{id:'sitemap',label:'사이트맵'},{id:'simple',label:'심플'},{id:'min',label:'미니멀'}],
     render:v=>{if(v==='min')return `<div style="padding:28px 32px;border-top:1px solid var(--line);text-align:center;color:var(--muted);font-size:13px">© 2026 ONSITE</div>`;
       const col=(h,a)=>`<div><div style="font-weight:600;margin-bottom:12px;font-size:14px">${h}</div>${a.map(x=>`<div class="muted" style="margin:7px 0">${x}</div>`).join('')}</div>`;
       if(v==='simple')return `<div style="padding:40px 0;border-top:1px solid var(--line)"><div class="container" style="display:flex;justify-content:space-between"><div class="logo" style="font-weight:700">ONSITE</div><div class="muted">© 2026 ONSITE</div></div></div>`;
       return `<div style="padding:56px 0;border-top:1px solid var(--line)"><div class="container" style="display:flex;justify-content:space-between;gap:32px;flex-wrap:wrap"><div class="logo" style="font-weight:700">ONSITE</div>${col('제품',['메신저','업무관리','드라이브'])}${col('리소스',['블로그','고객사례','헬프센터'])}${col('회사',['소개','채용','약관'])}</div></div>`;}},
  ],
};

const CAT_LABEL={nav:'Navigation',hero:'Hero',text:'Text / Introduction',imgtext:'Image + Text',card:'Card',list:'List',
  feature:'Feature',product:'Product Showcase',process:'Process / Step',diagram:'Diagram / Architecture',media:'Media',
  stat:'Statistics',comparison:'Comparison',case:'Case / Testimonial',blog:'Blog / Resource',faq:'FAQ',form:'Form',
  cta:'CTA',notice:'Notice',footer:'Footer'};
const CAT_ORDER=Object.keys(SECTIONS);
function findSection(cat,type){return (SECTIONS[cat]||[]).find(s=>s.type===type);}
function sectionList(cat){return SECTIONS[cat].map(s=>({cat,...s}));}
