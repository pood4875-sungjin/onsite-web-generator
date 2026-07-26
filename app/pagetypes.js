/* pagetypes.js — 페이지 유형 × 섹션 구성 공용 레지스트리 (전 디자인팩 공통 계약).
   근거: SaaS 제품 사이트 표준 IA(메인/제품/기능/요금/FAQ/문의/가이드/블로그) + 이벤트 랜딩 패턴
   (히어로→개요→소개→아젠다→스피커→안내→신청). ux-patterns.md의 폼 인라인 검증·빈 상태 원칙 반영:
   폼은 정적 데모(제출 비활성), 모든 섹션은 스캐폴드 기본값으로 "빈 화면 없이" 완성 렌더.

   계약:
   - PAGE_TYPES[id] = { label, use, sections:[{type,tier,lead?}] } — tier: core(항상)/mid(중간+)/rich(헤비만).
     lead=1: 페이지의 대표 콘텐츠 섹션 — pagehero(타이틀+서브)가 표제를 대신하므로 **섹션 자체 표제(아이브로·헤딩·서브) 생략**하고 바로 콘텐츠부터 렌더(중복 방지, 사용자 규칙)
   - 섹션 타입은 아래 "정식 어휘". 각 팩은 자기 DS로 이 어휘의 렌더러를 구비한다.
     팩에 아직 없는 타입은 SECTION_FALLBACK 순서로 대체(끝까지 없으면 생략) — 깨지지 않는 게 우선.
   - window.pageScaffold(pageTypeId, shared) → 그 유형의 기본 콘텐츠(data 패치). 페이지 생성 시 채워
     AI 없이도 완성 페이지가 나온다(문구는 이후 편집/AI로 교체).
   - AI(worker compose-web)용 스키마 조각은 PAGE_SECTION_DOC. */
(function () {
  var PAGE_TYPES = {
    /* ---- 웹사이트(멀티페이지) ---- */
    main:     { label: '메인홈',    use: '첫 화면 — 핵심 가치 한 방 + 전체 요약',
      sections: [{ type: 'hero', tier: 'core' }, { type: 'feature', tier: 'core' }, { type: 'stats', tier: 'mid' }, { type: 'showcase', tier: 'rich' }, { type: 'testimonial', tier: 'mid' }, { type: 'cta', tier: 'core' }] },
    product:  { label: '제품소개',  use: '제품 하나를 깊게 — 개요, 상세 기능 교차, 화면, 비교',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'overview', tier: 'core' }, { type: 'featurerows', tier: 'core' }, { type: 'gallery', tier: 'mid' }, { type: 'compare', tier: 'rich' }, { type: 'cta', tier: 'core' }] },
    features: { label: '기능소개',  use: '기능 카탈로그 — 그리드 + 핵심 2~3개 상세',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'feature', tier: 'core', lead: 1 }, { type: 'featurerows', tier: 'mid' }, { type: 'faq', tier: 'rich' }, { type: 'cta', tier: 'core' }] },
    pricing:  { label: '요금',      use: '플랜 비교와 결제 전 궁금증 해소',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'pricing', tier: 'core', lead: 1 }, { type: 'faq', tier: 'mid' }, { type: 'cta', tier: 'core' }] },
    faq:      { label: 'FAQ',       use: '자주 묻는 질문 + 추가 문의 유도',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'faq', tier: 'core', lead: 1 }, { type: 'infocards', tier: 'mid' }, { type: 'cta', tier: 'core' }] },
    contact:  { label: '도입문의',  use: '문의 폼(정적) + 연락처/절차 안내',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'form', tier: 'core', lead: 1 }, { type: 'infocards', tier: 'mid' }] },
    manual:   { label: '메뉴얼',    use: '가이드 문서 입구 — 카테고리 + 시작 절차',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'doclist', tier: 'core', lead: 1 }, { type: 'steps', tier: 'mid' }, { type: 'cta', tier: 'core' }] },
    blog:     { label: '블로그',    use: '소식/아티클 카드 목록',
      sections: [{ type: 'pagehero', tier: 'core' }, { type: 'bloglist', tier: 'core', lead: 1 }, { type: 'cta', tier: 'rich' }] },
    /* ---- 랜딩(단장) ---- */
    landing:  { label: '제품 랜딩', use: '전환 하나에 집중한 한 장짜리',
      sections: [{ type: 'hero', tier: 'core' }, { type: 'feature', tier: 'mid' }, { type: 'stats', tier: 'mid' }, { type: 'testimonial', tier: 'rich' }, { type: 'cta', tier: 'core' }] },
    event:    { label: '이벤트',    use: '행사 랜딩 — 개요→소개→아젠다→스피커→안내→신청',
      sections: [{ type: 'hero', tier: 'core' }, { type: 'overview', tier: 'core' }, { type: 'intro', tier: 'mid' }, { type: 'agenda', tier: 'core' }, { type: 'speakers', tier: 'core' }, { type: 'notice', tier: 'mid' }, { type: 'cta', tier: 'core' }] },
  };

  /* 팩에 해당 타입 렌더러가 없을 때 가까운 것으로 대체(왼쪽부터 시도). nav/footer는 팩이 항상 자체 처리. */
  var SECTION_FALLBACK = {
    pagehero: ['hero'],
    overview: ['intro', 'feature'],
    intro: ['overview', 'feature'],
    featurerows: ['feature'],
    gallery: ['showcase', 'feature'],
    compare: ['feature'],
    testimonial: ['quote', 'stats'],
    form: ['cta'],
    infocards: ['feature'],
    doclist: ['feature'],
    steps: ['feature'],
    bloglist: ['feature'],
    agenda: ['steps', 'feature'],
    speakers: ['feature'],
    notice: ['feature'],
    stats: ['metrics'],
    cta: ['banner'],
  };

  /* 유형별 스캐폴드 — AI 없이도 완성 렌더되는 기본 콘텐츠(문구는 편집/AI로 교체 전제).
     shared(프로젝트 공용: productName 등)를 받아 문구에 반영. 반환값은 페이지 data에 얕은 병합. */
  function pageScaffold(pt, shared) {
    shared = shared || {};
    var prod = shared.productName || '제품명';
    var base = { pageType: pt };
    var S = {
      main: {},
      product: {
        overview: { title: prod + '는 이렇게 다릅니다', text: '무엇을 해결하는 제품인지 두세 문장으로 소개하세요.', points: ['핵심 가치 1', '핵심 가치 2', '핵심 가치 3'] },
        featureRows: [
          { title: '대표 기능 하나', desc: '이 기능이 사용자의 어떤 문제를 어떻게 푸는지 설명하세요.', points: ['포인트 1', '포인트 2'] },
          { title: '대표 기능 둘', desc: '두 번째 상세 기능 설명.', points: ['포인트 1', '포인트 2'] },
        ],
        gallery: [{ label: 'SCREEN 1' }, { label: 'SCREEN 2' }, { label: 'SCREEN 3' }],
        compare: { them: '기존 방식', rows: [{ k: '구축 시간', us: '몇 분', them: '몇 주' }, { k: '비용', us: '구독형', them: '고정 인건비' }, { k: '수정', us: '즉시 반영', them: '외주 왕복' }] },
      },
      features: {},
      pricing: {},
      faq: { faq: [{ q: '어떤 서비스인가요?', a: '서비스를 한 문장으로 설명해주세요.' }, { q: '도입까지 얼마나 걸리나요?', a: '보통 걸리는 기간과 절차를 안내하세요.' }, { q: '요금은 어떻게 되나요?', a: '과금 방식을 안내하세요.' }] },
      contact: {
        form: { title: '도입 문의', sub: '남겨주시면 1영업일 안에 연락드립니다.', fields: ['회사명', '담당자 이름', '이메일', '문의 내용'], submit: '문의 보내기' },
        infoCards: [{ title: '이메일', text: 'contact@example.com' }, { title: '전화', text: '02-000-0000' }, { title: '도입 절차', text: '문의 → 상담 → 견적 → 도입' }],
      },
      manual: {
        docs: [{ title: '시작하기', desc: '설치와 첫 설정' }, { title: '핵심 기능', desc: '주요 기능 사용법' }, { title: '관리자 가이드', desc: '권한·설정 관리' }, { title: '자주 묻는 질문', desc: '문제 해결 모음' }],
        steps: [{ title: '가입', text: '계정을 만듭니다.' }, { title: '설정', text: '기본 정보를 입력합니다.' }, { title: '시작', text: '첫 결과물을 만듭니다.' }],
      },
      blog: { posts: [{ title: '첫 번째 소식', desc: '요약을 입력하세요.', date: '2026.07', tag: 'NEWS' }, { title: '두 번째 소식', desc: '요약을 입력하세요.', date: '2026.06', tag: 'UPDATE' }, { title: '세 번째 소식', desc: '요약을 입력하세요.', date: '2026.05', tag: 'TIP' }] },
      landing: {},
      event: {
        overview: { title: '행사 개요', text: '어떤 행사인지 두세 문장으로.', points: ['일시: 2026. 00. 00 (토) 14:00', '장소: 행사장 이름', '대상: 누구나'] },
        intro: { title: '이런 분들을 위해 준비했어요', text: '행사의 목적과 기대효과를 소개하세요.' },
        agenda: [{ time: '14:00', title: '오프닝', desc: '환영 인사' }, { time: '14:30', title: '세션 1', desc: '주제 발표' }, { time: '15:30', title: '세션 2', desc: '사례 공유' }, { time: '16:30', title: '네트워킹', desc: '자유 교류' }],
        speakers: [{ name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }, { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }, { name: '연사 이름', role: '소속 · 직함', desc: '한 줄 소개' }],
        notices: [{ title: '참가 안내', text: '사전 등록 필수, 선착순 마감.' }, { title: '주차 안내', text: '행사장 주차 지원 여부를 안내하세요.' }, { title: '문의', text: 'event@example.com' }],
      },
    };
    return Object.assign(base, S[pt] || {});
  }

  /* ---- 섹션 표현 변형(variant) — section_library.xlsx 598종에서 큐레이션(정적 렌더 가능 + AI 선택 가치 기준).
     데이터 계약: data.variants = { hero:'split', feature:'bento', ... } (없으면 팩 기본형).
     각 팩은 자기 DS로 변형을 해석해 구현 — 미구현 변형은 기본형으로 렌더(깨짐 금지). ---- */
  var SECTION_VARIANTS = {
    hero:        { center: '중앙 정렬 타이포', split: '텍스트 좌 / 이미지 우 분할', screenshot: '하단 대형 제품 화면 강조', stat: '숫자·성과 강조 타이포' },
    pagehero:    { banner: '제목+설명 배너(기본)', breadcrumb: '제목+Breadcrumb 경로' },
    overview:    { split: '좌 제목 / 우 설명(기본)', center: '중앙 대형 문장', problem: 'Problem/Solution 대비' },
    intro:       { center: '중앙(기본)', quote: '인용문형' },
    featurerows: { zigzag: '이미지 좌우 교차(기본)', numbered: '번호+제목 교차', checks: '체크리스트 교차' },
    feature:     { icons: '아이콘 그리드(기본)', cards: '카드형', bento: '벤토 그리드(대표 1+보조)', list: '아이콘 리스트(밀도형)' },
    gallery:     { grid: '균등 그리드(기본)', mosaic: '대표 1장 크게+보조' },
    stats:       { numbers: '숫자 나열(기본)', kpi: 'KPI 카드', big: '대형 숫자 하나 강조' },
    compare:     { table: '비교표(기본)', beforeafter: '좌우 Before/After 패널', cards: '카드 비교' },
    testimonial: { cards: '후기 카드(기본)', single: '단일 대형 인용', logos: '고객사 로고 그리드+수치' },
    steps:       { horizontal: '가로 번호 스텝(기본)', vertical: '세로 타임라인', cards: '카드 스텝' },
    agenda:      { timeline: '타임라인(기본)', table: '시간표 행' },
    faq:         { accordion: '아코디언(기본)', twocol: '2단 그리드', category: '카테고리 묶음' },
    form:        { center: '중앙 단일 폼(기본)', split: '좌 설명 / 우 폼' },
    cta:         { banner: '풀 배너(기본)', simple: '제목+버튼 미니멀', cards: '2단 카드 CTA(문의/자료 분리)' },
    bloglist:    { cards: '카드 그리드(기본)', list: '썸네일 리스트', featured: '대표 1+일반' },
    doclist:     { cards: '카드(기본)', list: '컴팩트 리스트' },
    pricing:     { cards: '플랜 카드(기본)', table: '요금 비교표' },
  };
  var VARIANT_DOC = 'variants(섹션 표현 변형, 선택): {' + Object.keys(SECTION_VARIANTS).map(function (k) {
    return k + ':"' + Object.keys(SECTION_VARIANTS[k]).join('|') + '"';
  }).join(', ') + '} — 콘텐츠 성격에 맞게 골라라(예: 수치 강조 브리프면 hero:stat, 기능 많으면 feature:bento).';

  /* AI(compose-web) 프롬프트용 — 페이지 유형과 신규 섹션 필드 스키마 */
  var PAGE_SECTION_DOC =
    '페이지 유형: ' + Object.keys(PAGE_TYPES).map(function (k) { return k + '(' + PAGE_TYPES[k].label + ')'; }).join(', ') + '\n' +
    '유형별 추가 필드(있는 유형만): ' +
    'product:{overview:{title,text,points:[str]},featureRows:[{title,desc,points:[str]}],compare:{them,rows:[{k,us,them}]}} | ' +
    'faq페이지·pricing·features:{faq:[{q,a}]} | ' +
    'contact:{form:{title,sub,fields:[str],submit},infoCards:[{title,text}]} | ' +
    'manual:{docs:[{title,desc}],steps:[{title,text}]} | ' +
    'blog:{posts:[{title,desc,date,tag}]} | ' +
    'event:{overview:{title,text,points:[str]},intro:{title,text},agenda:[{time,title,desc}],speakers:[{name,role,desc}],notices:[{title,text}]} | ' +
    '공통:{testimonials:[{text,by}]}';

  window.PAGE_TYPES = PAGE_TYPES;
  window.SECTION_FALLBACK = SECTION_FALLBACK;
  window.SECTION_VARIANTS = SECTION_VARIANTS;
  window.VARIANT_DOC = VARIANT_DOC;
  window.pageScaffold = pageScaffold;
  window.PAGE_SECTION_DOC = PAGE_SECTION_DOC;
})();
