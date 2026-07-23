/* templates.js — 미리 만들어둔 샘플 프로젝트(다중페이지·이미지 포함).
   '이 템플릿으로 시작' → 프로젝트로 복사 후 스튜디오 편집모드로 진입. classic script. */
(function () {
  var IMG = function (seed) { return 'https://picsum.photos/seed/' + seed + '/760/440'; };
  function page(name, pageType, data) { return { name: name, pageType: pageType, volume: 'heavy', parentId: null, data: data }; }

  window.APP_TEMPLATES = [
    {
      key: 'midas-nova', name: 'Nova · AX 플랫폼', desc: 'MIDAS AX · 모노크롬 · 웹사이트', tag: 'website',
      stylePack: 'midas', kind: 'multi',
      pages: [
        page('메인홈', 'main', {
          productName: 'Nova', tagline: 'Design Once.\nScale with AX.', subcopy: '사람과 AX가 함께 쓰는 패턴·정책·구조까지 연결된 제품 시스템.',
          primaryCta: '무료로 시작', bannerText: '지금 Nova로 팀의 생산성을 끌어올리세요', bannerCta: '데모 신청',
          features: [{ title: '아토믹 컴포넌트', desc: '토큰부터 페이지까지 하나의 규칙으로 연결.' }, { title: 'AX 자동화', desc: '반복 작업을 에이전트가 대신 조립합니다.' }, { title: '실시간 동기화', desc: '스타일을 바꾸면 전 제품이 즉시 리스킨.' }],
          stats: [{ value: '2.4ms', label: '렌더 지연' }, { value: '8종', label: '페이지 타입' }, { value: '99.9%', label: '일관성' }],
          footerLinks: ['소개', '문서', '고객사례', '문의'], footerCopyright: '© 2026 Nova Labs', images: { hero: IMG('novadash') },
        }),
        page('제품', 'features', { productName: 'Nova', tagline: '제품의 모든 흐름을 하나로', subcopy: '기획·디자인·개발이 같은 언어로.', features: [{ title: '컴포넌트 라이브러리', desc: '검증된 UI 부품 모음.' }, { title: '토큰 파이프라인', desc: 'Figma↔코드 무손실 동기화.' }, { title: '패턴 가이드', desc: '상황별 베스트 패턴 제공.' }], stats: [{ value: '120+', label: '컴포넌트' }, { value: '46', label: '토큰' }], bannerText: '제품을 더 빠르게', images: { hero: IMG('novafeat') } }),
        page('요금', 'pricing', { productName: 'Nova', tagline: '팀 규모에 맞는 요금', subcopy: '작게 시작해 크게 확장하세요.', stats: [{ value: '₩0', label: 'Free' }, { value: '₩29k', label: 'Pro' }, { value: '맞춤', label: 'Enterprise' }], bannerText: '지금 시작하기', images: {} }),
      ],
    },
    {
      key: 'krds-gov', name: '공공서비스 포털', desc: 'KRDS · 밝은 신뢰 블루 · 웹사이트', tag: 'website',
      stylePack: 'krds', kind: 'multi',
      pages: [
        page('메인홈', 'main', {
          productName: '온서비스', tagline: '필요한 서비스를\n한 곳에서 간편하게', subcopy: '복잡한 절차 없이, 온라인에서 바로 신청하고 처리하세요.',
          primaryCta: '서비스 신청', bannerText: '지금 바로 온라인으로 신청하세요', bannerCta: '신청 바로가기',
          features: [{ title: '빠른 처리', desc: '평균 2.4초 내 접수 완료.' }, { title: '안전한 인증', desc: '공동인증·간편인증 지원.' }, { title: '실시간 연동', desc: '기관 간 정보 자동 연계.' }],
          stats: [{ value: '2.4초', label: '평균 처리' }, { value: '99.9%', label: '가용성' }, { value: '120만', label: '누적 이용자' }],
          footerLinks: ['이용약관', '개인정보처리방침', '문의'], footerCopyright: '© 2026 온서비스', images: { hero: IMG('govportal') },
        }),
        page('이용안내', 'features', { productName: '온서비스', tagline: '이용 방법 안내', subcopy: '세 단계로 끝나는 신청.', features: [{ title: '1. 로그인', desc: '간편인증으로 접속.' }, { title: '2. 신청서 작성', desc: '자동 채움으로 빠르게.' }, { title: '3. 제출·확인', desc: '처리 현황 실시간 조회.' }], stats: [{ value: '3단계', label: '간편 절차' }], bannerText: '지금 이용해 보세요', images: { hero: IMG('govguide') } }),
      ],
    },
    {
      key: 'aether-product', name: '제품 랜딩 · 에테르', desc: '다크 글로우 · 시안 · 웹사이트', tag: 'website',
      stylePack: 'aether', kind: 'multi',
      pages: [
        page('메인홈', 'main', {
          productName: 'Onsite', tagline: '대화만으로 완성되는 인터페이스', subcopy: '기획을 대화로 입력하면, 선택한 스타일로 온브랜드 웹페이지를 즉시 합성합니다.',
          primaryCta: '무료로 시작하기', bannerText: '워크플로우를 진화시킬 준비가 되셨나요?', bannerCta: '무료로 시작하기',
          features: [{ title: '아토믹 생성', desc: '정해진 부품을 규칙대로 조립.' }, { title: '시맨틱 인텔리전스', desc: '슬롯에 값만 채우면 온브랜드로 합성.' }, { title: '실시간 리스킨', desc: '스타일 팩 교체 시 전체 즉시 반영.' }],
          stats: [{ value: '3분', label: '평균 생성' }, { value: '8종', label: '페이지 타입' }, { value: '99.9%', label: '온브랜드' }],
          footerLinks: ['이용약관', '개인정보처리방침', '문의'], footerCopyright: '© 2026 Onsite Labs', images: { hero: IMG('onsitehero') },
        }),
        page('기능', 'features', { productName: 'Onsite', tagline: '명료함과 성능을 위해 설계됨', subcopy: '결정론적 생성으로 일관된 결과.', features: [{ title: '결정론 렌더', desc: '추론 없는 안정적 출력.' }, { title: '스타일 팩', desc: '브랜드별 룩앤필 교체.' }, { title: '섹션 조립', desc: '볼륨·순서 자유 편집.' }], stats: [{ value: '0ms', label: '추론 비용' }], bannerText: '지금 만들어보세요', images: { hero: IMG('onsitefeat') } }),
        page('요금', 'pricing', { productName: 'Onsite', tagline: '합리적인 요금제', subcopy: '필요한 만큼만.', stats: [{ value: 'Free', label: '무료' }, { value: 'Pro', label: '전문가' }, { value: 'Team', label: '팀' }], bannerText: '시작하기', images: {} }),
      ],
    },
    {
      key: 'midas-promo', name: '프로모션 랜딩 · SoilWorks', desc: 'MIDAS AX · 프로모션 · 랜딩페이지', tag: 'landing',
      stylePack: 'midas', kind: 'single',
      pages: [
        page('랜딩', 'landing', {
          productName: 'SoilWorks', tagline: '온라인 세미나 기념\n프로모션 혜택 안내', subcopy: '지반 안전 진단 솔루션을 지금 특별가로 만나보세요.',
          primaryCta: '혜택 신청하기', bannerText: '2026 상반기 이내 신청 시 무상 교육 지원', bannerCta: '지금 신청하기',
          features: [{ title: '최대 10% OFF', desc: '비탈면 및 수리시설 안전 진단 패키지' }, { title: '모듈 추가 할인', desc: '암반·보강토·연약지반 등 추가 모듈 구매 시' }, { title: '신규 고객 혜택', desc: '프로그램 시작일 지정 + 무상 교육 지원' }],
          stats: [{ value: '10%', label: '최대 할인' }, { value: '500만원', label: '프로모션가' }, { value: '상반기', label: '신청 기한' }],
          footerLinks: ['문의', '이용안내'], footerCopyright: '© 2026 MIDAS', images: { hero: IMG('soilworks') },
        }),
      ],
    },
    {
      key: 'krds-webinar', name: '온라인 세미나 · 웨비나', desc: '밝은 신뢰 블루 · 이벤트 · 랜딩페이지', tag: 'event',
      stylePack: 'krds', kind: 'single',
      pages: [
        page('이벤트', 'landing', {
          productName: 'MIDAS 웨비나', tagline: '온라인 세미나\n지금 등록하세요', subcopy: '실무 전문가와 함께하는 라이브 교육 세션에 무료로 참여하세요.',
          primaryCta: '무료 등록', bannerText: '선착순 마감 · 지금 등록하세요', bannerCta: '등록하기',
          features: [{ title: '라이브 Q&A', desc: '전문가에게 실시간으로 질문하세요.' }, { title: '실습 자료 제공', desc: '세미나 후 자료·다시보기 영상 제공.' }, { title: '수료증 발급', desc: '참여 완료 시 수료증을 드립니다.' }],
          stats: [{ value: '90분', label: '세션 시간' }, { value: '무료', label: '참가비' }, { value: '선착순', label: '모집 방식' }],
          footerLinks: ['문의', '안내'], footerCopyright: '© 2026 MIDAS', images: { hero: IMG('webinar') },
        }),
      ],
    },
  ];
})();
