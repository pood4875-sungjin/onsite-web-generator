# SECTION_TAXONOMY.md — 제품소개 웹사이트 섹션 유형 분류 (v2 · canonical)

> 페이지 유형이 아니라 **실제 화면의 구성 방식·표현 형태** 기준으로 분류.
> 관리 구조: `대분류 → 섹션 유형 → 표현 방식 → 레이아웃 → 구성 요소`
> 시각 맵: [`taxonomy.html`](taxonomy.html) · 기계가독: [`sections/sections.json`](../sections/sections.json)(재정합 예정)
>
> **v2 변경**: 표현 형태 중심으로 재편 — **Card·List를 최상위 대분류로 승격**, 20 대분류로 확정. (이전 v1 기능중심 25분류 대체.)

## 관리 구조 예시
```
대분류: Card
섹션 유형: 기능 소개 카드
표현 방식: 아이콘 카드
레이아웃: 3단
구성 요소: 아이콘 / 제목 / 설명 / 링크
```

## 명명 규칙
```
[대분류]-[콘텐츠 목적]-[표현 방식]-[레이아웃]
```
예: `HERO-PRODUCT-VIDEO-FULL` · `HERO-PRODUCT-SPLIT-IMAGE-RIGHT` · `FEATURE-ICON-GRID-3COL` · `FEATURE-SCREENSHOT-TAB` · `FEATURE-CARD-BENTO` · `PRODUCT-CARD-GRID-3COL` · `BLOG-CARD-GRID-3COL` · `BLOG-THUMBNAIL-LIST` · `PROCESS-STEP-HORIZONTAL-4` · `CTA-BANNER-FULL`

**원칙:** 2단·3단·4단은 목적이 아니라 **레이아웃 속성** → 별도 대분류/유형으로 만들지 않는다. (`카드 3단`은 유형이 아니라 `Card > Feature Card > 3 Columns`.) 표현형(이미지·아이콘·카드·리스트·캐러셀·영상 등)은 **Variant**로 확장.

---

## 최종 분류 구조 (20)
`01 Navigation · 02 Hero · 03 Text/Introduction · 04 Image+Text · 05 Card · 06 List · 07 Feature Showcase · 08 Product Showcase · 09 Process/Step · 10 Diagram/Architecture · 11 Media · 12 Statistics/Data · 13 Comparison · 14 Case Study/Testimonial · 15 Blog/Resource · 16 FAQ/Accordion · 17 Form · 18 CTA · 19 Notice/Banner · 20 Footer`

## 우선 제작 순서
- **P0 (필수)**: GNB · Hero · Text/Introduction · Image+Text · Card · List · Feature Showcase · Product Showcase · Process/Step · Diagram/Architecture · Statistics/Data · Comparison · Case Study/Testimonial · Blog/Resource · FAQ · Form · CTA · Footer
- **P1 (표현 확장)**: Media · Carousel · Tab · Accordion · Sticky Scroll · Interactive Diagram · Before/After · Download · Notice/Banner

---

## 01. Navigation
웹사이트 전체/현재 페이지의 이동 구조.

**1.1 기본 GNB (구성)** — 로고+메뉴 · +CTA · +검색 · +언어선택 · +로그인 · +CTA+유틸리티
**1.2 GNB 표현 유형** — 흰색 배경 · 컬러 배경 · 투명 배경 · Hero 위 Overlay · 스크롤 시 배경전환 · Sticky 고정 · 숨김 후 스크롤 노출
**1.3 메뉴 유형** — 단일 · Dropdown · Mega Menu · 제품군 메뉴 · 이미지 포함 Mega · 설명 포함 Mega · 제품 카드 포함 Mega
**1.4 페이지 내부 Nav** — Breadcrumb · Anchor · Tab · Sticky Tab · Sidebar · 이전·다음 · 카테고리

## 02. Hero
가장 먼저 노출되는 대표 메시지 영역.

**2.1 타이포 강조형** — 중앙정렬 · 좌측정렬 · 대형 전면 · 한 문장 · 키워드 강조 · 숫자·성과 강조 · 타이포 애니메이션 · (요소: Eyebrow/제목/강조키워드/설명/CTA/Badge/보조정보)
**2.2 배경 이미지형** — 전면 · +중앙타이포 · +좌측타이포 · +하단타이포 · Gradient Overlay · Card Overlay · 이미지 Carousel
**2.3 배경 영상형** — 전면 · +중앙 · +좌측 · +최소 UI · +CTA · +Scroll Indicator · 영상 Carousel
**2.4 이미지·콘텐츠 분할형** — 텍스트좌/이미지우 · 이미지좌/텍스트우 · 텍스트좌/제품UI우 · +디바이스Mockup우 · +영상우 · +Form우 · (레이아웃: 50:50 / 40:60 / 60:40)
**2.5 제품 화면 강조형** — Screenshot · Dashboard Preview · Browser Mockup · Mobile Mockup · 다중화면 Layer · +Floating Card · +주요지표 · 화면 Carousel
**2.6 배너형** — 낮은 높이 Page Banner · 제목만 · 제목+설명 · +Breadcrumb · 배경이미지 · 컬러배경 · 제품별 Key Visual · 공지 포함
**2.7 인터랙션형** — 마우스 반응 · 스크롤 반응 · Parallax · 3D Object · 인터랙티브 Demo · 숫자/키워드 전환 · 카드 자동전환

## 03. Text / Introduction
핵심 메시지를 텍스트 중심으로 설명.

**3.1 기본 텍스트형** — 제목+설명 · Eyebrow+제목+설명 · 대형 문장 · 한 문장 선언 · 인용문 · 키워드 강조 · 좌측정렬 · 중앙정렬
**3.2 분할 텍스트형** — 좌제목/우설명 · 좌설명/우핵심문장 · 제목/본문 2단 · 본문 2단 · 본문 3단 · 메시지+숫자 · 메시지+CTA
**3.3 문제·가치 설명형** — 문제 정의 · Solution 소개 · Problem/Solution · As-is/To-be · Before/After · 가치 제안 · 도입 효과

## 04. Image + Text
이미지·제품화면·그래픽 + 텍스트 결합 대표 콘텐츠.

**4.1 기본 좌우 분할형** — 이미지좌/텍스트우 · 텍스트좌/이미지우 · 이미지상/텍스트하 · 텍스트상/이미지하 · 이미지크게 · 텍스트크게
**4.2 반복 교차형** — 좌우 Zigzag · 기능별 Zigzag · 연속 교차 · Sticky 이미지+스크롤 텍스트 · Sticky 텍스트+이미지 전환
**4.3 이미지 종류(Variant)** — 실제 제품 · Screenshot · UI 화면 · 디바이스 Mockup · 아이소메트릭 · 일러스트 · Diagram · Infographic · 현장 사진 · 고객 사례 · Before/After
**4.4 텍스트 구성** — 제목+설명 · +CTA · 번호+제목+설명 · 아이콘+제목+설명 · Badge+제목+설명 · +Bullet List · +Check List · +수치

## 05. Card ★신규 최상위
동일 수준 콘텐츠를 반복 노출.

**5.1 카드 레이아웃** — 2/3/4/5/6단 · 비대칭 Grid · Bento · 가로 스크롤 · Carousel · Masonry · 대표+보조 · 1대형+여러소형
**5.2 기본 카드** — 제목 · +설명 · +설명+링크 · 번호+제목 · Badge+제목 · 태그+제목+설명
**5.3 아이콘 카드** — 아이콘+제목 · +설명 · +설명+링크 · 원형 · 사각 · 일러스트 · 강조 컬러
**5.4 이미지 카드** — 이미지+제목 · +설명 · 이미지+태그+제목 · +CTA · 전체 Overlay · 이미지 상단 · 이미지 좌측 가로 · 이미지 배경
**5.5 제품 카드** — 이미지+제품명 · +설명 · +특징 · +CTA · 제품군 · Category · 관련제품 · 비교선택 · 상태·버전 포함
**5.6 기능 카드** — 아이콘 · Screenshot · 설명 · 영상 · 기능별 CTA · 주요기능 강조 · 기능 Group
**5.7 수치 카드** — 숫자+설명 · KPI · 증가율 · 성과수치 · Icon+숫자 · Chart 포함 · Progress 포함
**5.8 후기·사례 카드** — 고객 후기 · 인용문 · 고객정보 포함 · 고객사 Logo · 적용사례 · 산업별 사례 · 결과수치 포함
**5.9 자료 카드** — 블로그 · 뉴스 · 리포트 · 매뉴얼 · 다운로드 · 영상 콘텐츠 · 웨비나 · 업데이트

## 06. List ★신규 최상위
카드보다 간결·고밀도 반복 노출.

**6.1 기본 리스트** — 텍스트 · 번호 · Bullet · Check · 아이콘 · 설명 포함 · 링크
**6.2 리스트 카드형** — 가로 이미지 카드 · 썸네일+제목 · +설명 · 아이콘+제목+설명 · 번호+제목+설명 · 날짜+제목 · Category+제목 · Download 정보
**6.3 게시글 리스트** — 블로그 · 뉴스 · 공지 · 업데이트 · 자료 · 매뉴얼 · 관련 · 인기 · 최신
**6.4 기능 리스트** — 기능명+설명 · +Check · +아이콘 · +Screenshot · +상세링크 · 핵심/세부 구조 · 기능 Accordion
**6.5 제품 리스트** — 제품명+설명 · +이미지 · +주요기능 · +Category · +사양 · +상세링크 · 제품군 Accordion

## 07. Feature Showcase
핵심 기능을 시각적으로 설명.

**7.1 기능 이미지 강조형** — 대형 Screenshot+설명 · 대형 제품이미지+설명 · UI 확대 · 이미지 교체 · Annotation · +Floating 설명 카드 · Hover 설명 · 확대 Viewer
**7.2 기능 카드형** — 2/3/4단 · 주요1+보조 · Bento · 가로형 · Carousel
**7.3 기능 아이콘형** — 2/3/4단 · 리스트 · +한 줄 설명 · +상세설명 · 연결선 구조 · Carousel
**7.4 기능 Tab형** — Tab→이미지 변경 · →영상 변경 · →설명 변경 · 세로Tab+우측화면 · 가로Tab+하단화면 · 제품별 · 역할별 · Category별
**7.5 기능 Accordion형** — 제목+설명 · +이미지 · 선택 시 화면 변경 · Category · FAQ 혼합
**7.6 기능 Carousel형** — 카드 · Screenshot · 제품기능 · 전체화면 Slide · 중앙 강조 · 썸네일 Nav · 텍스트+이미지 동기화
**7.7 스크롤 인터랙션형** — Sticky 이미지+설명전환 · Sticky 텍스트+화면전환 · Scroll Snap · 단계별 확대 · 화면 위 Highlight · Scrollytelling

## 08. Product Showcase
단일 제품/여러 제품군 전시.

**8.1 단일 제품 소개** — 이미지+설명 · 화면+설명 · 핵심기능 요약 · 상세사양 · CTA · 데모 연결 · 자료 연결
**8.2 제품군 카드형** — 2/3/4단 · Bento · 대표+관련 · Category별 · 산업별 · 역할별
**8.3 제품군 리스트형** — 이미지+설명 리스트 · Category 리스트 · Accordion · Tab · 비교 리스트 · 선택 가이드 · 관련 제품
**8.4 제품군 Carousel형** — 카드 · 이미지 · Category · 중앙 강조 · 썸네일 Nav
**8.5 제품 비교형** — 비교표 · 기능별 · 사양별 · Check Matrix · 질문형 · 장점 비교 · 추천 Highlight

## 09. Process / Step
작동 방식·사용/도입 과정.

**9.1 Step형** — 3/4/5단 · 번호 · 아이콘 · 이미지 · 카드 · 세로 · 가로
**9.2 Timeline형** — 수평 · 수직 · 연혁 · 도입절차 · 운영과정 · 프로젝트 진행
**9.3 Flow형** — Arrow · Card · Diagram · Input/Process/Output · 사용자 흐름 · 데이터 흐름 · 작동 흐름 · 순환 · 분기
**9.4 단계별 이미지형** — Screenshot · 제품 이미지 · 이미지+번호 · 이미지+설명 · Carousel · Tab · Sticky

## 10. Diagram / Architecture
기술 구조·복잡한 관계 시각화. (B2B·SaaS 핵심)

**10.1 구조도형** — 시스템 · 서비스 · 제품 생태계 · 데이터 · 플랫폼 · 모듈 · 계층 · 제품 연결
**10.2 흐름도형** — 데이터 · 사용자 · 업무 · AI 처리 · 센서 데이터 · 분석·결과 · 외부 연동
**10.3 연결 관계형** — Integration Map · API 연결 · 제품 간 · 기기 간 · 서비스 간 · Partner Ecosystem · Cloud
**10.4 Diagram 표현형** — 아이콘 · 라인 · 카드 · 원형 · 방사형 · 단계 · Isometric · 인터랙티브

## 11. Media
이미지·영상 중심 제품 경험 전달.

**11.1 이미지형** — Full Width · Full Bleed · Grid 2/3/4 · Masonry · Carousel · Before/After · 확대 가능 · Lightbox
**11.2 영상형** — Full Width · 배경 · +텍스트 · 카드 · Grid · Carousel · Demo · Tutorial · 고객 인터뷰 · Modal
**11.3 Device Mockup형** — Desktop · Mobile · Tablet · Multi · Browser Frame · Carousel · Layer

## 12. Statistics / Data
성과·효율·신뢰도 데이터 전달.

**12.1 숫자형** — 2/3/4단 · 대형 강조 · +설명 · +아이콘 · +비교값 · +출처
**12.2 Chart형** — Bar · Line · Donut · Progress · Gauge · Before/After · 비교 · Dashboard Preview
**12.3 KPI 카드형** — 3/4단 · 성과수치 · Icon · Chart · 증감률

## 13. Comparison
제품·기능·기존방식 비교.

**13.1 비교표형** — 제품 · 기능 · 요금 · 사양 · 지원환경 · Check Matrix · 경쟁방식
**13.2 좌우 비교형** — Before/After · As-is/To-be · 기존/개선 · 자사/타사 · 사용 전/후 · 문제/해결
**13.3 카드 비교형** — 제품 카드 · 플랜 카드 · 기능 카드 · 추천 제품 강조 · 대표 플랜 강조

## 14. Case Study / Testimonial
실제 사용 사례·고객 신뢰.

**14.1 사례형** — 카드 2/3단 · Carousel · 대표 대형 · 이미지+설명 · 문제/해결/결과 · KPI 중심 · 산업별 · 고객사별
**14.2 후기형** — 단일 인용문 · 카드 · 2/3단 · Carousel · 영상 · 고객 프로필 포함 · 고객사 Logo 포함
**14.3 고객사 Logo형** — Grid · Marquee · Carousel · 대표 강조 · 산업별 · 수치+Logo

## 15. Blog / Resource
콘텐츠·자료 탐색.

**15.1 카드형 리스트** — 2/3/4단 · 이미지 Grid · 텍스트 Grid · Featured 1+일반 · Bento · Carousel
**15.2 리스트형** — 썸네일 · 가로 카드 · 제목 중심 · 날짜+제목 · Category+제목 · Compact · 최신 · 인기
**15.3 대표 콘텐츠형** — Featured Post · 대표 리포트/뉴스/사례 · 이미지 대형+설명 · 좌우 분할 Featured · 배경 이미지 Featured
**15.4 탐색형** — Category Tab · Filter Chip · Tag Filter · Search · 정렬 · 제품별 · 산업별 · 유형별
**15.5 다운로드 자료형** — 자료 카드 · 파일 리스트 · 브로슈어 · 매뉴얼 · 리포트 · 다운로드 CTA · Form 포함

## 16. FAQ / Accordion
질문·세부 정보를 접고 펼침.

**16.1 FAQ형** — 기본 Accordion · 2단 · Category · Tab · Search · +CTA · +Contact
**16.2 콘텐츠 Accordion형** — 기능 · 제품 · 제품군 · 사양 · 매뉴얼 · 단계 · 이미지 연동

## 17. Form
문의·상담·신청 완료.

**17.1 기본 Form형** — 문의 · 상담 신청 · 데모 신청 · 견적 요청 · 자료 다운로드 · 뉴스레터 · 기술 지원
**17.2 Form 레이아웃** — 중앙 단일 · 좌설명/우Form · 좌Form/우연락처 · 배경이미지+Form Card · Hero 내부 · Modal · 다단계

## 18. CTA
다음 행동 유도 전환.

**18.1 기본 CTA** — 제목+버튼 · 제목+설명+버튼 · Primary/Secondary · 텍스트 링크 · 버튼 1개 · 버튼 2개
**18.2 배너 CTA** — 컬러 배경 · 이미지 배경 · Gradient · 제품 이미지 포함 · 좌우 분할 · Full Width · 좁은 높이
**18.3 카드 CTA** — 단일 · 2단 · 문의/다운로드 분리 · 제품별 · 역할별
**18.4 고정 CTA** — Floating · Sticky Bottom · Sticky Side · 모바일 하단 · 문의 Button · 다운로드 Button

## 19. Notice / Banner
공지·주요 정보 보조 전달.

상단 Announcement Bar · 이벤트 · 업데이트 · 프로모션 · 점검 안내 · 새 기능 안내 · 제품 출시 · Cookie Notice · Warning · Info

## 20. Footer
하단 정보·보조 Navigation.

**20.1 Footer 유형** — Minimal · 기본 · 다단 · Sitemap · 제품 중심 · 회사 정보 중심 · Newsletter · CTA 포함 · 다운로드 CTA
**20.2 구성 요소** — Logo · 회사 설명 · 제품 링크 · 회사 링크 · Resource 링크 · 연락처 · 주소 · SNS · 개인정보처리방침 · 이용약관 · Copyright · Family Site · 언어 선택

---

## 확장 규칙
20 대분류를 기준으로, 각 섹션의 **레이아웃(2/3/4단 등)** 과 **표현형(이미지·아이콘·카드·리스트·캐러셀·영상)** 을 Variant로 확장한다. `sections.json`·`registry.js`는 이 20-대분류 + 명명 규칙으로 재정합한다(다음 단계).
