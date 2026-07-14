/* ============================================================
   registry.js — 섹션 레지스트리 (빌더·갤러리 공용 단일 소스)
   각 섹션: {type,label,variants:[{id,label}], render(variantId)->HTML}
   render 결과는 항상 .sx 스코프 안에서 렌더된다 (styles/sections.css).
   전역: SECTIONS, CAT_LABEL, findSection, sectionMeta
   ============================================================ */
const H = {
  eyebrow:(t)=>`<div class="eyebrow">${t}</div>`,
  sample:'설명 텍스트가 들어갑니다. 기획 내용에 맞춰 교체됩니다.',
};
function head(eyebrow,title,sub,center=true){
  return `<div class="${center?'center':''}">${H.eyebrow(eyebrow)}<h2 class="h-sec">${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}</div>`;
}
const SECTIONS = {
  common:[
    {type:'gnb',label:'Header / GNB',variants:[{id:'solid',label:'솔리드'},{id:'trans',label:'투명오버'},{id:'cta',label:'CTA포함'}],
     render:v=>`<div class="gnb ${v==='trans'?'trans':''}"><div class="logo">ONSITE</div><nav><span>제품</span><span>기능</span><span>요금</span><span>고객사례</span></nav>${v==='cta'?'<a class="btn primary">무료로 시작</a>':'<a class="btn">로그인</a>'}</div>`},
    {type:'hero',label:'Hero',variants:[{id:'split',label:'split'},{id:'center',label:'centered'},{id:'min',label:'minimal'},{id:'bg',label:'bg-image'}],
     render:v=>{const cta=`<div class="row" style="${v==='split'?'':'justify-content:center'}"><a class="btn primary">무료로 시작하기</a><a class="btn">도입 문의 →</a></div>`;
       const txt=`<div>${H.eyebrow('현장 업무 플랫폼')}<h1>현장의 모든 일,<br>하나로 연결됩니다</h1><p class="lead">${H.sample}</p>${cta}</div>`;
       if(v==='split')return `<div class="container"><div class="hero">${txt}<div class="visual">비주얼</div></div></div>`;
       if(v==='bg')return `<div class="hero bg" style="padding:80px 32px"><div class="container">${txt}</div></div>`;
       return `<div class="container"><div class="hero min">${txt}</div></div>`;}},
    {type:'cta',label:'CTA',variants:[{id:'banner',label:'배너'},{id:'card',label:'카드센터'},{id:'form',label:'폼결합'}],
     render:v=>{const inner=`<h2 class="h-sec">지금 시작해보세요</h2><p class="sub" style="margin:10px auto 0">${H.sample}</p>${v==='form'?'<div class="row" style="justify-content:center;margin-top:20px"><input class="btn" style="min-width:220px" placeholder="이메일 입력"><a class="btn primary">시작</a></div>':'<div class="row" style="justify-content:center;margin-top:20px"><a class="btn primary">무료로 시작</a><a class="btn">문의</a></div>'}`;
       if(v==='card')return `<div class="band"><div class="container"><div class="card center" style="padding:48px">${inner}</div></div></div>`;
       return `<div class="band alt center"><div class="container">${inner}</div></div>`;}},
    {type:'faq',label:'FAQ',variants:[{id:'acc',label:'아코디언'},{id:'2col',label:'2열'},{id:'cat',label:'카테고리형'}],
     render:v=>{const q=(t)=>`<div class="card" style="padding:16px 18px"><b>Q. ${t}</b><p class="muted" style="margin:8px 0 0">${H.sample}</p></div>`;
       const items=[q('도입은 어떻게 하나요?'),q('요금제가 궁금해요'),q('보안은 안전한가요?'),q('무료 체험이 있나요?')];
       const g=v==='2col'?'grid cols-2':'grid';
       return `<div class="band"><div class="container">${head('FAQ','자주 묻는 질문','',true)}<div class="${g}" style="margin-top:32px;gap:10px">${items.join('')}</div></div></div>`;}},
    {type:'footer',label:'Footer',variants:[{id:'sitemap',label:'사이트맵'},{id:'simple',label:'심플'},{id:'min',label:'미니멀'}],
     render:v=>{if(v==='min')return `<div style="padding:28px 32px;border-top:1px solid var(--line);text-align:center;color:var(--muted);font-size:13px">© 2026 ONSITE</div>`;
       const col=(h,a)=>`<div><div style="font-weight:600;margin-bottom:12px;font-size:14px">${h}</div>${a.map(x=>`<div class="muted" style="margin:7px 0">${x}</div>`).join('')}</div>`;
       if(v==='simple')return `<div style="padding:40px 0;border-top:1px solid var(--line)"><div class="container" style="display:flex;justify-content:space-between"><div class="logo" style="font-weight:700">ONSITE</div><div class="muted">© 2026 ONSITE</div></div></div>`;
       return `<div style="padding:56px 0;border-top:1px solid var(--line)"><div class="container" style="display:flex;justify-content:space-between;gap:32px;flex-wrap:wrap"><div class="logo" style="font-weight:700">ONSITE</div>${col('제품',['메신저','업무관리','드라이브'])}${col('리소스',['블로그','고객사례','헬프센터'])}${col('회사',['소개','채용','약관'])}</div></div>`;}},
  ],
  product:[
    {type:'productLineup',label:'제품 라인업',variants:[{id:'c3',label:'3열'},{id:'c4',label:'4열'},{id:'ico',label:'아이콘형'}],
     render:v=>{const n=v==='c4'?4:3;const card=(i)=>`<div class="card"><div class="k">0${i}</div><h3>제품 ${i}</h3><p class="muted" style="margin-top:6px">${H.sample}</p></div>`;
       return `<div class="band"><div class="container">${head('Products','다양한 제품','현장 업무에 필요한 모든 기능')}<div class="grid cols-${n}" style="margin-top:32px">${[1,2,3,4,5,6].map(card).join('')}</div></div></div>`;}},
    {type:'feature',label:'Feature',variants:[{id:'grid',label:'grid'},{id:'alt',label:'좌우교차'},{id:'ico',label:'아이콘형'},{id:'tab',label:'탭형'}],
     render:v=>{if(v==='alt')return `<div class="band"><div class="container"><div class="hero"><div><h2 class="h-sec">핵심 기능</h2><p class="sub">${H.sample}</p></div><div class="visual">스크린샷</div></div></div></div>`;
       const card=(i)=>`<div class="card"><h3>기능 ${i}</h3><p class="muted" style="margin-top:6px">${H.sample}</p></div>`;
       return `<div class="band alt"><div class="container">${head('Features','일의 시작부터 끝까지','')}<div class="grid cols-3" style="margin-top:32px">${[1,2,3].map(card).join('')}</div></div></div>`;}},
    {type:'benefit',label:'Benefit (가치)',variants:[{id:'3up',label:'3-up'},{id:'cross',label:'교차강조'}],
     render:v=>{const it=(i)=>`<div><div class="k">0${i}</div><h3 style="font-size:22px">가치 ${i}</h3><p class="muted" style="margin-top:8px">${H.sample}</p></div>`;
       return `<div class="band"><div class="container">${head('Why Onsite','분산을 줄일수록 본질에 집중','')}<div class="grid cols-3" style="margin-top:40px;gap:40px">${[1,2,3].map(it).join('')}</div></div></div>`;}},
    {type:'process',label:'Process',variants:[{id:'hstep',label:'가로번호'},{id:'timeline',label:'세로타임라인'},{id:'stepper',label:'스테퍼'}],
     render:v=>{const st=(i,t)=>`<div class="center"><div class="num" style="font-size:20px;width:44px;height:44px;border:1px solid var(--line);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">${i}</div><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin-top:4px">${H.sample}</p></div>`;
       return `<div class="band alt"><div class="container">${head('How it works','3분이면 시작','')}<div class="grid cols-4" style="margin-top:40px">${st(1,'가입')}${st(2,'초대')}${st(3,'설정')}${st(4,'사용')}</div></div></div>`;}},
    {type:'stats',label:'Stats (지표)',variants:[{id:'row',label:'카운터 행'},{id:'card',label:'카드'}],
     render:v=>{const s=(n,l)=>`<div class="center"><div class="num">${n}</div><div class="muted" style="margin-top:8px">${l}</div></div>`;
       return `<div class="band"><div class="container">${head('By the numbers','숫자로 증명','')}<div class="grid cols-4" style="margin-top:40px">${s('1위','국내 순위')}${s('180만+','이용자')}${s('42만+','고객사')}${s('99%','만족도')}</div><p class="muted center" style="margin-top:24px;font-size:13px">출처: 예시</p></div></div>`;}},
    {type:'testimonial',label:'Testimonial',variants:[{id:'single',label:'단일인용'},{id:'carousel',label:'캐러셀'},{id:'wall',label:'로고월'}],
     render:v=>{if(v==='wall'){const c=Array(10).fill('<div class="cell">LOGO</div>').join('');
       return `<div class="band alt"><div class="container center"><p class="sub" style="margin:0 auto 24px">고객사</p><div class="grid" style="grid-template-columns:repeat(5,1fr);gap:8px">${c}</div></div></div>`;}
       return `<div class="band"><div class="container"><p class="quote">“${H.sample}”</p><div class="who"><b>정보화기획조정관</b> · 공공기관</div></div></div>`;}},
    {type:'comparison',label:'Comparison / 요금',variants:[{id:'table',label:'표'},{id:'cards',label:'카드'},{id:'toggle',label:'월년토글'}],
     render:v=>{if(v==='table')return `<div class="band alt"><div class="container">${head('Pricing','요금제 비교','')}<table class="spec" style="margin-top:32px"><tr><td>플랜</td><td>Basic</td><td>Pro</td></tr><tr><td>가격</td><td>무료</td><td>₩9,900</td></tr><tr><td>멤버</td><td>10명</td><td>무제한</td></tr></table></div></div>`;
       const p=(t,pr)=>`<div class="card center"><h3>${t}</h3><div class="num" style="font-size:34px;margin:12px 0">${pr}</div><a class="btn primary">선택</a></div>`;
       return `<div class="band alt"><div class="container">${head('Pricing','요금제','')}<div class="grid cols-3" style="margin-top:32px">${p('Basic','무료')}${p('Pro','₩9,900')}${p('Enterprise','문의')}</div></div></div>`;}},
    {type:'showcase',label:'Showcase',variants:[{id:'shot',label:'스크린샷'},{id:'video',label:'비디오'},{id:'gallery',label:'갤러리'}],
     render:v=>{if(v==='gallery')return `<div class="band"><div class="container">${head('Showcase','제품 화면','')}<div class="grid cols-3" style="margin-top:32px">${Array(3).fill('<div class="visual">이미지</div>').join('')}</div></div></div>`;
       return `<div class="band"><div class="container">${head('Showcase','제품을 직접 확인하세요','')}<div class="visual" style="margin-top:32px;aspect-ratio:16/9">${v==='video'?'동영상':'스크린샷'}</div></div></div>`;}},
    {type:'industry',label:'업종별 활용 ★',variants:[{id:'grid',label:'그리드'},{id:'tab',label:'탭'}],
     render:v=>{const it=(t)=>`<div class="card"><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin-top:4px">${H.sample}</p></div>`;
       return `<div class="band alt"><div class="container">${head('By industry','다양한 업종에서','')}<div class="grid cols-4" style="margin-top:32px;gap:12px">${['제조','IT','서비스','의료','공공','교육','금융','엔터프라이즈'].map(it).join('')}</div></div></div>`;}},
    {type:'integration',label:'Integration',variants:[{id:'grid',label:'로고그리드'},{id:'cat',label:'카테고리별'}],
     render:v=>`<div class="band"><div class="container center">${head('Integrations','쓰던 도구와 연동','')}<div class="row" style="justify-content:center;flex-wrap:wrap;margin-top:32px">${['Slack','GitHub','Jira','Google','Notion'].map(t=>`<div class="cell" style="min-width:120px;height:52px">${t}</div>`).join('')}</div></div></div>`},
    {type:'trust',label:'Trust / 보안',variants:[{id:'cert',label:'인증마크'},{id:'band',label:'밴드'}],
     render:v=>`<div class="band alt"><div class="container hero"><div><div class="eyebrow">Security</div><h2 class="h-sec">글로벌 최고 수준 보안</h2><p class="sub">${H.sample}</p></div><div class="grid cols-3" style="gap:8px">${['ISO 27001','ISMS-P','CSAP','ISO 27701','CSA STAR','ISO 27017'].map(t=>`<div class="cell" style="height:52px">${t}</div>`).join('')}</div></div></div>`},
    {type:'newsroom',label:'뉴스룸',variants:[{id:'c3',label:'3열 카드'},{id:'tab',label:'탭'}],
     render:v=>{const c=(t)=>`<div class="card" style="padding:0;overflow:hidden"><div class="visual" style="aspect-ratio:16/9;border-radius:0;border:none;border-bottom:1px solid var(--line)"></div><div style="padding:16px"><div class="muted" style="font-size:13px;font-weight:600">${t}</div><h3 style="font-size:16px;margin:6px 0">소식 제목이 들어갑니다</h3><div class="muted" style="font-size:13px">2026. 07. 03</div></div></div>`;
       return `<div class="band"><div class="container">${head('Newsroom','새로운 소식','')}<div class="grid cols-3" style="margin-top:32px">${c('공지사항')}${c('활용팁')}${c('이벤트')}</div></div></div>`;}},
  ],
  manual:[
    {type:'toc',label:'TOC / 목차',variants:[{id:'sticky',label:'sticky 사이드'},{id:'inline',label:'인라인 앵커'}],
     render:v=>`<div class="band"><div class="container"><div class="toc" style="max-width:${v==='sticky'?'280px':'100%'}"><div style="font-weight:600;margin-bottom:8px">목차</div><a>1. 시작하기</a><a>2. 기본 설정</a><a>3. 사용 방법</a><a>4. 문제 해결</a></div></div></div>`},
    {type:'prerequisite',label:'Prerequisite / 준비',variants:[{id:'chk',label:'체크리스트'},{id:'callout',label:'콜아웃'}],
     render:v=>{if(v==='callout')return `<div class="band"><div class="container"><div class="callout info"><b>시작하기 전에</b><p class="muted" style="margin:6px 0 0">${H.sample}</p></div></div></div>`;
       return `<div class="band"><div class="container">${head('준비사항','시작 전 확인하세요','',false)}<ul class="chk" style="margin-top:16px"><li>계정이 생성되어 있어야 합니다</li><li>관리자 권한이 필요합니다</li><li>최신 버전으로 업데이트하세요</li></ul></div></div>`;}},
    {type:'step',label:'Step / 절차',variants:[{id:'num',label:'세로번호'},{id:'shot',label:'스샷+텍스트'},{id:'acc',label:'아코디언'}],
     render:v=>{const s=(i,t)=>`<div class="step"><div class="n">${i}</div><div><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin-top:4px">${H.sample}</p>${v==='shot'?'<div class="visual" style="margin-top:12px;aspect-ratio:16/6">스크린샷</div>':''}</div></div>`;
       return `<div class="band"><div class="container">${head('절차','따라 하기','',false)}<div style="margin-top:16px">${s(1,'첫 번째 단계')}${s(2,'두 번째 단계')}${s(3,'세 번째 단계')}</div></div></div>`;}},
    {type:'callout',label:'Callout / 노트',variants:[{id:'info',label:'info'},{id:'warn',label:'warning'},{id:'tip',label:'tip'},{id:'danger',label:'danger'}],
     render:v=>{const map={info:['참고','info'],warn:['주의','warn'],tip:['팁','tip'],danger:['경고','danger']};const[t,c]=map[v]||map.info;
       return `<div class="band"><div class="container"><div class="callout ${c}"><b>${t}</b><p class="muted" style="margin:6px 0 0">${H.sample}</p></div></div></div>`;}},
    {type:'specTable',label:'Spec Table / 사양',variants:[{id:'kv',label:'key-value'},{id:'compare',label:'비교표'}],
     render:v=>`<div class="band"><div class="container">${head('사양','상세 정보','',false)}<table class="spec" style="margin-top:16px"><tr><td>항목 A</td><td>값이 들어갑니다</td></tr><tr><td>항목 B</td><td>값이 들어갑니다</td></tr><tr><td>항목 C</td><td>값이 들어갑니다</td></tr></table></div></div>`},
    {type:'troubleshooting',label:'Troubleshooting',variants:[{id:'acc',label:'아코디언'},{id:'table',label:'증상-원인-해결'}],
     render:v=>{if(v==='table')return `<div class="band"><div class="container">${head('문제 해결','증상별 해결','',false)}<table class="spec" style="margin-top:16px"><tr><td style="background:var(--bg-2);font-weight:600">증상</td><td style="background:var(--bg-2);font-weight:600">해결</td></tr><tr><td>로그인이 안 돼요</td><td>${H.sample}</td></tr><tr><td>알림이 안 와요</td><td>${H.sample}</td></tr></table></div></div>`;
       const q=(t)=>`<div class="card" style="padding:16px 18px"><b>${t}</b><p class="muted" style="margin:8px 0 0">${H.sample}</p></div>`;
       return `<div class="band"><div class="container">${head('문제 해결','자주 있는 문제','',false)}<div class="grid" style="margin-top:16px;gap:10px">${q('로그인이 안 돼요')}${q('알림이 안 와요')}</div></div></div>`;}},
    {type:'media',label:'Media',variants:[{id:'img',label:'캡션이미지'},{id:'video',label:'비디오'},{id:'code',label:'코드블록'}],
     render:v=>{if(v==='code')return `<div class="band"><div class="container"><pre style="background:var(--ink);color:#e8e8e8;padding:18px;border-radius:10px;font-family:var(--font-mono);font-size:13px;overflow:auto">$ onsite init\n$ onsite deploy</pre></div></div>`;
       return `<div class="band"><div class="container"><div class="visual" style="aspect-ratio:16/9">${v==='video'?'동영상':'이미지'}</div><p class="muted center" style="margin-top:10px;font-size:13px">그림 1. 캡션이 들어갑니다</p></div></div>`;}},
  ],
};
const CAT_LABEL={common:'공통',product:'제품소개',manual:'매뉴얼'};
function findSection(cat,type){return SECTIONS[cat].find(s=>s.type===type);}
/* 편의: 전 섹션 평탄화 [{cat,...section}] */
function sectionList(cat){return SECTIONS[cat].map(s=>({cat,...s}));}
