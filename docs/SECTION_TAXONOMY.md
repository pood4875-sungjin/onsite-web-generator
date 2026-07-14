# SECTION_TAXONOMY.md — 제품소개 웹사이트 섹션 전수 유형화

> 목적: 제너레이터가 조합할 **섹션 단위** 사례를 폭넓게 조사·유형화. 페이지가 아니라 **섹션의 기능·구성요소** 기준.
> 근거: ux-patterns.md · industry-examples.md(토스·네이버·카카오·원티드) + 실물 조사(네이버웍스·채널톡·두레이) + B2B/SaaS 관행.
> 다음 전환: [`sections/registry.js`](../sections/registry.js) · `sections.json` · `CONTENT_SCHEMA.md` · Figma 컴포넌트 · 생성 로직.

## 읽는 법
- **Category**(대분류) → **Section Type**(기능 단위, ID 부여) → **Variant**(표현/구조 변형) → **Layout**(배치 속성).
- 규칙: 2·3·4단 차이는 Section Type이 아니라 **Layout 속성**. 이미지 좌/우도 **Layout Variant**. 목적이 다르면 외형 같아도 분리.
- 우선순위 `P0`(MVP 필수) / `P1`(확장 중요) / `P2`(고도화 선택). 적합도 `적합(제품소개/매뉴얼/블로그)` = H/M/L. 재사용·난이도 = H/M/L.

---

## A. 대분류 체계 (33 → 25 통합)

| No | Category | 역할 | 대표 Section Type | Pri |
|----|----------|------|-------------------|-----|
| 01 | **Navigation** | 사이트 이동·전역 탐색 | GNB, Local Nav, Breadcrumb | P0 |
| 02 | **Hero** | 첫 화면 핵심 메시지·전환 진입 | Split Hero, Product Detail Hero | P0 |
| 03 | **Introduction** | 제품 한 줄~개요·가치 제안 | One-liner, Value Prop, Problem | P0 |
| 04 | **Feature** | 기능 나열·설명 | Icon/Card/Tab/Bento Feature | P0 |
| 05 | **Benefit** | 도입 효과·가치(감성/정량) | 3-up Value, Before/After | P0 |
| 06 | **Content Block** | 이미지+텍스트 등 서사 블록 | Image&Text, Alternating | P0 |
| 07 | **Product Showcase** | 제품/화면/제품군 전시 | Screenshot, Product Cards | P1 |
| 08 | **Use Case** | 활용 시나리오(산업/역할/업무) | Use Case Grid/Tab | P1 |
| 09 | **Process** | 절차·작동방식(How It Works 통합) | Step, Timeline, Flow | P0 |
| 10 | **Architecture** | 기술 구조·데이터흐름·스택 | System Diagram, Tech Stack | P1 |
| 11 | **Integration** | 외부 도구 연동 | Logo Grid, Integration Map | P1 |
| 12 | **Statistics** | 성과 수치·KPI | Counter Row, KPI Card | P1 |
| 13 | **Comparison** | 비교·사양(Specification 통합) | Plan Table, Feature Matrix, Spec | P1 |
| 14 | **Media** | 갤러리·영상·데모(Gallery/Video/Demo 통합) | Screenshot Grid, Video, Demo | P1 |
| 15 | **Case Study** | 실제 도입 사례(문제/해결/결과) | Case Card, Case Detail | P1 |
| 16 | **Testimonial** | 후기·고객 로고(Customer Logo 통합) | Quote, Logo Wall, Review Card | P0 |
| 17 | **Pricing** | 요금·도입 안내 | Plan Cards, Contact Pricing | P1 |
| 18 | **Manual** | 매뉴얼·가이드(Guide 통합, type 구분) | TOC, Step Guide, Callout | P0(매뉴얼) |
| 19 | **Blog / Resource** | 콘텐츠 목록·상세·탐색 | Post Grid, Post Detail, Filter | P1 |
| 20 | **FAQ** | 자주 묻는 질문 | Accordion, Categorized FAQ | P0 |
| 21 | **Download** | 자료·소프트웨어 다운로드 | Resource Card, Gated Download | P1 |
| 22 | **Form / Contact** | 문의·데모·상담·연락처 | Inquiry Form, Contact Info | P0 |
| 23 | **CTA** | 전환 유도 배너/블록 | Banner CTA, Card CTA | P0 |
| 24 | **Footer** | 사이트맵·법적·연락 | Multi-column, Minimal Footer | P0 |
| 25 | **Notice / Utility** | 공지·쿠키·유틸 띠 | Announcement Bar, Cookie, Toast | P1 |

---

## B. 통합·제외 결정 (dedup)

**통합**
- **How It Works → Process**: 절차 시각화로 구조 동일. `flow`/`journey` variant로 흡수.
- **Guide → Manual**: 콘텐츠 성격 유사. Section Type 레벨에서 `guide-step`/`tutorial`로 구분.
- **Specification → Comparison**: 표 기반 동일 골격. `spec-table`/`requirements` type으로.
- **Video·Demo·Gallery → Media**: 미디어 전시로 통합, type으로 분리.
- **Customer Logo → Testimonial**: 사회적 증거 카테고리로 통합.
- **Contact → Form**: 폼+연락정보 함께 운영.
- **Product Overview ↔ Introduction**: 제품 설명 수준으로 type 분리(one-liner/overview/value-prop), 카테고리는 Introduction으로 통합.

**제외/최소화** (제품소개 관련성 낮음): 장바구니·결제·배송, 커뮤니티 게시판·SNS 피드, 포트폴리오, 엔터 콘텐츠, 대규모 어드민 대시보드, 일반 회원가입/계정관리. (도입 문의·데모 신청 폼은 포함, 계정관리는 제외.)

---

## C. 카테고리별 Section Type 상세

> 열: ID · Type · Variants · Layout · Purpose · Content(핵심) · UI · Req(필수) · Opt(선택) · AI Tags · Pri · Fit(제품/매뉴얼/블로그)

### 01. Navigation
사이트 전역/지역 이동. 전 페이지 상단·측면 상주.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit(P/M/B) |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|------|
| NAV-001 | Global Nav(GNB) | Basic, Sticky, Transparent, With-CTA | Full Width, Sticky | 주 메뉴 이동 | logo, menu[], cta | Link, Button, Menu | logo, menu[] | cta, login, search | #nav #gnb #global | P0 | H/H/H |
| NAV-002 | Mega Menu | Product-grouped, Column | Full Width, Overlay | 대량 메뉴 그룹 노출 | groups[{title,links[]}] | Dropdown, Panel | groups[] | promo, icon | #nav #megamenu | P2 | M/L/L |
| NAV-003 | Utility Nav | Top-bar | Full Width, Right Aligned | 로그인·언어·문의 보조 | items[], lang, login | Link, Selector | items[] | lang, contact | #nav #utility | P1 | M/M/M |
| NAV-004 | Local Nav / Tab | Tab, Anchor, Sub-page | Horizontal, Sticky | 페이지 내/하위 이동 | tabs[]/anchors[] | Tab, Anchor | items[] | active | #nav #tab #anchor | P1 | M/H/M |
| NAV-005 | Breadcrumb | Inline | Left Aligned | 현재 위치 경로 | path[] | Link, Divider | path[] | — | #nav #breadcrumb | P1 | L/H/M |
| NAV-006 | Sidebar Nav | Doc-tree, Collapsible | Sidebar, Sticky Vertical | 문서/매뉴얼 좌측 탐색 | tree[] | Tree, Accordion | tree[] | search, version | #nav #sidebar #docs | P0(매뉴얼) | L/H/L |
| NAV-007 | Mobile Nav | Hamburger, Drawer | Overlay | 모바일 메뉴 | menu[], cta | Drawer, Button | menu[] | search, lang | #nav #mobile | P0 | H/H/H |

구성요소 지원표(요소→여부): Logo●·Main Menu●·Submenu(002/006)·Product Switcher(002)·Search(001/006)·Language(003)·Login(001/003)·Contact CTA(001)·Download CTA(옵션)·Mobile Menu Btn(007).

### 02. Hero
첫 화면. 목적별로 강하게 분리.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| HERO-001 | Standard Hero | Split, Centered, Minimal, Left-aligned | Split / Centered | 핵심 메시지+전환 | eyebrow,title,desc,cta,visual | Button, Badge | title, cta | eyebrow, sub-cta, badge | #hero #abovefold #conversion | P0 | H/M/M |
| HERO-002 | Product Visual Hero | Screenshot, Mockup, Dashboard Preview | Split, Full Width | 제품 화면으로 신뢰 | title,desc,cta,screenshot | Image, Frame | title, image | video, badge, stats | #hero #product #screenshot | P0 | H/L/L |
| HERO-003 | Media Hero | Background Image, Video, Illustration | Full Width Overlay | 무드·임팩트 | title,desc,cta,media | Video, Overlay | title, media | overlay-cta | #hero #video #bg | P1 | M/L/M |
| HERO-004 | Action Hero | Form, Search | Split, Centered | 즉시 리드/검색 | title,form/search | Form, Input | title, form | trust, note | #hero #form #search #lead | P1 | M/L/L |
| HERO-005 | Announcement Hero | Case-study, Announcement, Carousel | Full Width, Carousel | 소식/사례 순환 노출 | slides[{title,cta,visual}] | Carousel, Pager | slides[] | autoplay | #hero #carousel #news | P1 | H/L/L |
| HERO-006 | Page Hero | Product Detail, Manual, Blog | Contained, Left Aligned | 하위 페이지 진입 헤더 | breadcrumb,title,meta | Breadcrumb, Tag | title | breadcrumb, anchor-nav, meta | #hero #page #detail | P0 | H/H/H |

Hero 요소 인벤토리: Eyebrow·Title●·Description·Primary CTA·Secondary CTA·Product Image·Screenshot·Video·Badge·Customer Logo·Statistics·Form·Breadcrumb·Anchor Nav.

### 03. Introduction / Product Overview
제품 설명 수준으로 type 분리.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| INTRO-001 | One-liner | Text Only, Big Type | Centered, 1 Column | 한 문장 정의 | statement | — | statement | eyebrow | #intro #tagline | P0 | H/M/L |
| INTRO-002 | Product Overview | Text+Visual, Lead+Body | Split, 2 Columns | 제품 개요 설명 | title,body,visual | Image | title, body | visual, cta | #intro #overview | P0 | H/M/L |
| INTRO-003 | Value Proposition | Key Message, Pillars | Centered, 3 Columns | 가치 제안 요약 | title,pillars[] | Icon | title, pillars[] | icon, sub | #intro #value #message | P0 | H/L/L |
| INTRO-004 | Problem Definition | Problem/Solution, As-is/To-be | Split, Alternating | 문제 공감→전환 | problem,solution | Icon | problem, solution | visual | #intro #problem #solution | P1 | H/L/L |
| INTRO-005 | Product Family | Line-up Cards | Grid, 3/4 Columns | 제품군 소개 | items[{name,desc}] | Card | items[] | icon, link | #intro #lineup #family | P1 | H/L/L |
| INTRO-006 | Section Lead / Key Takeaway | Eyebrow+Title+Sub | Centered | 섹션 도입 리드 | eyebrow,title,sub | — | title | eyebrow, sub | #intro #lead #eyebrow | P1 | H/M/M |

### 04. Feature (최다 세분)
표현 방식이 Variant, 배치가 Layout.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| FEAT-001 | Feature Grid | Icon, Image, Card, Screenshot | Grid 2/3/4 Col | 기능 병렬 나열 | items[{icon,title,desc}] | Card, Icon | items[] | link, cta, tag | #feature #grid #icon | P0 | H/M/L |
| FEAT-002 | Feature List | Text, Icon, Checklist | Vertical/Horizontal List | 기능 목록형 | items[{title,desc}] | List, Icon | items[] | link | #feature #list | P0 | H/M/L |
| FEAT-003 | Feature Detail | Image Left/Right, Screenshot | Alternating, Split | 기능 심화 서사 | title,desc,points[],visual | Image, Check | title, visual | points[], cta | #feature #detail #alternating | P0 | H/L/L |
| FEAT-004 | Interactive Feature | Tab, Accordion, Carousel | Tab, 2 Columns | 다기능 전환 탐색 | tabs[{label,body,visual}] | Tab, Accordion | tabs[] | shot, icon | #feature #tab #interactive | P1 | H/L/L |
| FEAT-005 | Bento Feature | Bento Grid, Mixed-size | Bento Grid | 밀도·리듬 있는 하이라이트 | cells[{size,title,visual}] | Card | cells[] | media | #feature #bento #highlight | P2 | H/L/L |
| FEAT-006 | Sticky-scroll Feature | Sticky Visual + Scroll Text | Sticky, Split | 스크롤 연동 설명 | steps[], stickyVisual | Sticky, Scroll | steps[] | anim | #feature #scrollytelling | P2 | M/L/L |
| FEAT-007 | Comparison Feature | vs Old-way, With/Without | 2 Columns | 대비로 가치 강조 | left,right | Table, Icon | left, right | header | #feature #comparison | P1 | H/L/L |

카드 구성 옵션(FEAT-001/002 공용): title-only · icon+title · icon+title+desc · image+title+desc · image+tag+title · number+title+desc · link-card · cta-card · status-card.

### 05. Benefit / Value Proposition
Feature=무엇을 하나, Benefit=왜 좋은가. 목적 다르므로 분리.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| BEN-001 | Value 3-up | Icon, Number, Text | Grid 3 Col | 핵심 효과 3~4 요약 | items[{title,desc}] | Icon | items[] | icon, stat | #benefit #value #3up | P0 | H/L/L |
| BEN-002 | Before / After | As-is/To-be, Split | Split, Alternating | 도입 전후 대비 | before,after | Table, Icon | before, after | visual, metric | #benefit #beforeafter | P1 | H/L/L |
| BEN-003 | Outcome Metrics | Efficiency, Cost, Time, Risk | Grid, Row | 정량 도입 효과 | metrics[{value,label}] | Counter | metrics[] | source | #benefit #roi #metric | P1 | H/L/L |
| BEN-004 | Emotional Value | Narrative, Full-bleed | Centered, Full Width | 감성적 가치 서사 | statement,sub | — | statement | visual | #benefit #emotional | P2 | M/L/M |

### 06. Content Block (서사 블록)
범용 이미지/영상+텍스트. 목적은 "설명·서사".

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| CONT-001 | Image & Text | Screenshot, Illustration, Diagram | Image Left/Right, Split | 시각+설명 결합 | title,body,image | Image | title, image | cta, points | #content #imagetext #alternating | P0 | H/M/M |
| CONT-002 | Media & Text | Video, Animation | Split | 영상+설명 | title,body,video | Video | title, video | cta | #content #video | P1 | M/L/M |
| CONT-003 | Full-bleed Media | Image, Video | Full Width | 임팩트 전환 브릿지 | media,caption | Image/Video | media | caption, overlay-text | #content #fullbleed | P1 | M/L/M |
| CONT-004 | Quote Block | Pull-quote | Centered | 인용으로 강조 | quote,attribution | — | quote | author | #content #quote | P1 | M/L/H |
| CONT-005 | Long-form / Editorial | Article, Scrollytelling | 1 Column Contained | 심층 서사/에디토리얼 | body(rich) | TOC | body | toc, media | #content #longform #editorial | P2 | L/M/H |

### 07. Product Showcase
제품/화면 자체 전시(설득의 증거).

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| SHOW-001 | Screenshot Showcase | Single, Device Mockup | Centered, Full Width | 실제 화면 신뢰 | screenshot,caption | Frame | screenshot | caption, hotspot | #showcase #screenshot #mockup | P1 | H/L/L |
| SHOW-002 | Product Cards | Line-up, Related | Grid 3/4 Col | 제품군/관련 전시 | items[{name,thumb,desc}] | Card | items[] | badge, link | #showcase #product #cards | P1 | H/L/L |
| SHOW-003 | UI Preview Carousel | Carousel, Tab-by-feature | Carousel, Tab | 기능별 화면 순환 | slides[{shot,label}] | Carousel, Tab | slides[] | caption | #showcase #carousel #ui | P1 | H/L/L |
| SHOW-004 | Feature Highlight Screen | Annotated | Split | 화면 위 기능 주석 | screenshot,markers[] | Tooltip | screenshot | markers[] | #showcase #annotated | P2 | M/L/L |

### 08. Use Case
활용 시나리오(누가/어떤 상황). Case Study(실증)와 구분.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| USE-001 | Use Case Grid | Industry, Role, Task, Scenario | Grid 3/4 Col | 활용처 분류 노출 | items[{title,desc}] | Card, Icon | items[] | link, icon | #usecase #industry #role | P1 | H/L/L |
| USE-002 | Use Case Tab | Tab-by-segment | Tab, Split | 세그먼트별 전환 탐색 | tabs[{seg,body,visual}] | Tab | tabs[] | shot | #usecase #tab #segment | P1 | H/L/L |
| USE-003 | Use Case Detail | Scenario, Problem-based | Split, Vertical | 시나리오 상세 | scenario,steps,result | — | scenario | linkedFeatures | #usecase #scenario #detail | P2 | M/L/L |

### 09. Process / How It Works
절차·작동방식. 단계 수는 Layout, 표현은 Variant.

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| PROC-001 | Step Process | Numbered, Icon, Image | Horizontal/Vertical 3-5 Step | 사용/도입 절차 | steps[{n,title,desc}] | Step, Icon | steps[] | visual, cta | #process #howitworks #step | P0 | H/H/L |
| PROC-002 | Timeline | Vertical, Horizontal | Timeline | 시간/단계 흐름 | items[{time,title}] | Timeline | items[] | milestone | #process #timeline | P1 | M/M/L |
| PROC-003 | Flow Diagram | Workflow, User Journey, Before/After Flow | Horizontal, Diagram | 흐름 시각화 | nodes[],edges[] | Diagram | nodes[] | legend | #process #flow #journey | P1 | M/M/L |
| PROC-004 | Interactive Process | Animated, Stepper | Interactive | 단계 인터랙션 | steps[], activeState | Stepper | steps[] | anim | #process #interactive | P2 | M/L/L |

### 10. Architecture / Technology (B2B·SaaS 핵심)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| ARCH-001 | System Architecture | Diagram, Layered | Centered, Full Width | 시스템 구조 설명 | diagram,legend | Diagram | diagram | legend, note | #architecture #system #diagram | P1 | H/M/L |
| ARCH-002 | Data / AI Flow | Data Flow, AI Pipeline | Horizontal Diagram | 데이터·AI 처리 흐름 | stages[] | Diagram | stages[] | icon | #architecture #dataflow #ai | P2 | M/L/L |
| ARCH-003 | Tech Stack | Logo Grid, Categorized | Grid | 기술 스택 노출 | items[]/groups[] | Logo Grid | items[] | category | #architecture #stack #tech | P1 | M/L/L |
| ARCH-004 | Security / Compliance | Cert Grid, Trust Band | Split, Grid | 보안·인증 신뢰 | certs[],desc | Badge Grid | certs[] | desc | #trust #security #compliance | P1 | H/L/L |
| ARCH-005 | Platform Support | Device/OS Matrix | Grid, Table | 지원 환경 | items[] | Icon, Table | items[] | note | #architecture #support #platform | P2 | M/M/L |

### 11. Integration

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| INTEG-001 | Integration Logos | Grid, Categorized, Marquee | Grid, Horizontal | 연동 생태계 노출 | logos[] | Logo Grid | logos[] | category, link | #integration #logo #ecosystem | P1 | H/L/L |
| INTEG-002 | Integration Map | Hub-spoke, Diagram | Centered | 연동 관계 시각화 | nodes[] | Diagram | nodes[] | legend | #integration #map | P2 | M/L/L |
| INTEG-003 | Integration Directory | Searchable Grid, Filter | Grid + Filter | 연동 앱 탐색 | items[{name,logo,cat}] | Card, Filter | items[] | search | #integration #directory | P2 | M/L/L |

### 12. Statistics / KPI

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| STAT-001 | Counter Row | Animated Counter, Static | Row 3/4 Col | 핵심 지표 임팩트 | items[{value,label}] | Counter | items[] | suffix, source | #stat #kpi #counter | P1 | H/L/L |
| STAT-002 | KPI Card | Card, With-icon | Grid | 지표 카드화 | items[{value,label,delta}] | Card | items[] | icon, trend | #stat #kpi #card | P1 | H/L/L |
| STAT-003 | Progress / Gauge | Bar, Circular | Row | 비율·달성률 | items[{value,max}] | Progress | items[] | label | #stat #progress | P2 | M/L/L |
| STAT-004 | Chart Stat | Bar, Line | Contained | 추세·성과 시각화 | series[] | Chart | series[] | legend | #stat #chart | P2 | M/L/L |

### 13. Comparison / Specification (통합)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| COMP-001 | Plan Comparison | Table, Cards, Toggle(월/년) | Table, Grid | 플랜/기능 비교 | plans[],rows[] | Table, Toggle | plans[], rows[] | highlight, cta | #comparison #plan #pricing | P1 | H/L/L |
| COMP-002 | Feature Matrix | Check Matrix | Table | 기능 지원 매트릭스 | features[],cols[] | Table, Check | features[] | legend | #comparison #matrix #feature | P1 | H/M/L |
| COMP-003 | Competitor Comparison | vs Others, Old-way | Table, 2 Col | 경쟁/기존 대비 | rows[] | Table | rows[] | note | #comparison #competitor | P1 | H/L/L |
| COMP-004 | Spec Table | Key-Value, Requirements | Table 2 Col | 기술 사양·요구사항 | rows[{key,value}] | Table | rows[] | group | #spec #requirements | P1 | M/H/L |
| COMP-005 | Compatibility Matrix | OS/Device/Version | Table | 호환성 매트릭스 | matrix[][] | Table | matrix | legend | #spec #compatibility | P2 | L/H/L |

### 14. Media (Gallery / Video / Demo 통합)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| MEDIA-001 | Image Gallery | Grid, Masonry, Lightbox | Grid | 이미지 모음 | images[] | Grid, Lightbox | images[] | caption | #media #gallery #image | P1 | M/M/M |
| MEDIA-002 | Carousel / Slider | Carousel, Before/After Slider | Carousel | 순환/비교 슬라이드 | slides[] | Carousel, Slider | slides[] | pager | #media #carousel #slider | P1 | M/L/M |
| MEDIA-003 | Video Block | Inline, Modal, Full-bleed | Centered, Full Width | 영상 재생 | video,thumb | Video, Modal | video | caption, transcript | #media #video | P1 | M/M/M |
| MEDIA-004 | Demo Embed | Interactive Demo, Sandbox | Full Width, Contained | 라이브 데모 체험 | embed | Iframe | embed | instructions | #media #demo #interactive | P2 | M/L/L |
| MEDIA-005 | Device Mockup | Phone, Laptop, Multi-device | Centered | 기기 목업 전시 | screenshot,device | Frame | screenshot | multi | #media #mockup #device | P1 | H/L/L |

### 15. Case Study (실증 사례)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| CASE-001 | Case Card List | Grid, Industry/Customer | Grid 2/3 Col | 사례 목록 | items[{logo,title,metric}] | Card | items[] | tag, link | #casestudy #card #proof | P1 | H/L/M |
| CASE-002 | Featured Case | Hero-case, Highlight | Split | 대표 사례 강조 | logo,quote,metric,link | — | logo, metric | quote, image | #casestudy #featured | P1 | H/L/M |
| CASE-003 | Case Detail | Problem/Solution/Result, KPI, Interview | 1 Column, Vertical | 사례 상세 서사 | context,solution,result[] | Metric, Quote | context, result | interview, media | #casestudy #detail #result | P2 | M/L/H |
| CASE-004 | Case Carousel | Carousel | Carousel | 사례 순환 | slides[] | Carousel | slides[] | pager | #casestudy #carousel | P2 | M/L/L |

### 16. Testimonial / Customer Logo (통합)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| TEST-001 | Single Quote | Big Quote | Centered | 대표 후기 강조 | quote,author,org | — | quote, author | photo, logo | #testimonial #quote #proof | P0 | H/L/M |
| TEST-002 | Review Cards | Grid, Carousel | Grid 2/3 Col, Carousel | 다수 후기 | items[{quote,author}] | Card, Carousel | items[] | rating, logo | #testimonial #reviews | P1 | H/L/M |
| TEST-003 | Logo Wall | Grid, Marquee, By-industry Tab | Grid, Horizontal | 고객사 사회적 증거 | logos[] | Logo Grid, Marquee | logos[] | tab, link | #testimonial #logo #customers | P0 | H/L/L |
| TEST-004 | Video Testimonial | Inline, Modal | Split, Grid | 영상 인터뷰 후기 | video,author | Video | video, author | quote | #testimonial #video | P2 | M/L/M |
| TEST-005 | Rating Summary | Aggregate, Stars | Row | 평점 요약 | score,count,source | — | score | source, badge | #testimonial #rating | P2 | M/L/L |

### 17. Pricing / Adoption

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| PRICE-001 | Plan Cards | 3/4 Tier, Featured, Toggle(월/년) | Grid, Toggle | 요금제 선택 | plans[{name,price,features[]}] | Card, Toggle | plans[] | badge, cta | #pricing #plan #tier | P1 | H/L/L |
| PRICE-002 | Contact Pricing | Quote, Enterprise | Centered, Split | 문의형 요금 | message,cta | Button | cta | note | #pricing #contact #enterprise | P1 | H/L/L |
| PRICE-003 | Adoption Steps | Onboarding, License | Step, List | 도입 절차·라이선스 | steps[]/terms[] | Step | steps[] | cta | #pricing #adoption #onboarding | P2 | M/L/L |
| PRICE-004 | Trial CTA | Free Trial | Banner | 무료 체험 유도 | title,cta | Button | cta | note | #pricing #trial #cta | P1 | H/L/L |

### 18. Manual / Guide (매뉴얼 핵심)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| MAN-001 | Doc TOC | Sticky Side, Inline Anchor | Sidebar, Contained | 문서 목차 | items[{label,anchor}] | Anchor, Tree | items[] | active | #manual #toc #nav | P0(M) | L/H/L |
| MAN-002 | Getting Started | Intro, Prerequisite | 1 Column | 시작 안내·사전준비 | intro,prereq[] | Checklist, Callout | intro | prereq[] | #manual #gettingstarted #prereq | P0(M) | L/H/L |
| MAN-003 | Step Guide | Numbered, Screenshot+Text, Accordion | Vertical Step | 단계별 절차 | steps[{title,body,media}] | Step, Accordion | steps[] | media, code | #manual #step #guide | P0(M) | L/H/L |
| MAN-004 | Callout / Note | Info, Tip, Warning, Danger | Inline | 주의·팁 강조 | type,title,body | Callout | type, body | icon | #manual #callout #note | P0(M) | L/H/L |
| MAN-005 | Code / Media Guide | Code Block, Image, Video | Contained | 코드/미디어 예시 | kind,content,caption | Code, Image, Video | content | caption | #manual #code #media | P1 | L/H/L |
| MAN-006 | Troubleshooting | Accordion, Symptom-Cause-Fix Table | Accordion, Table | 문제 해결 | items[{symptom,fix}] | Accordion, Table | items[] | cause | #manual #troubleshooting #faq | P1 | L/H/L |
| MAN-007 | Doc Meta / Version | Version, Update Log, Prev/Next | Inline, Footer | 버전·이력·문서이동 | version,updates[],prevNext | Link, Tag | version | updates, prevNext | #manual #version #changelog | P1 | L/H/L |
| MAN-008 | Doc List / Category | Doc Grid, Category List, Search | Grid, List | 문서 카탈로그·검색 | docs[]/cats[] | Card, Search, Filter | docs[] | search, filter | #manual #doclist #search | P1(M) | L/H/L |
| MAN-009 | Related Docs / Next Steps | Related, Next Step | List, Cards | 관련·다음 문서 | items[] | Card, Link | items[] | — | #manual #related #next | P1 | L/H/M |
| MAN-010 | Support Contact | Help CTA | Banner | 지원 문의 연결 | title,cta | Button | cta | channels | #manual #support #contact | P1 | L/H/L |

### 19. Blog / Resource (구성요소 세분)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| BLOG-001 | Post List/Grid | Card Grid 2/3/4, Basic List, Horizontal Thumb, Compact, Masonry, Carousel | Grid, List | 게시글 목록 | posts[{thumb,title,date,cat}] | Card, List | posts[] | tag, author, readtime | #blog #postlist #grid | P1 | L/L/H |
| BLOG-002 | Featured/Highlight Post | Featured, Latest, Popular, Editor's Pick, Pinned | Split, Hero-card | 대표 콘텐츠 강조 | post(main) | Card | post | badge | #blog #featured | P1 | L/L/H |
| BLOG-003 | Content Filter | Category, Tag, Search, Sort, By product/industry/year | Sidebar, Toolbar | 콘텐츠 탐색 | filters[] | Filter, Search, Tabs | filters[] | count | #blog #filter #search | P1 | L/L/H |
| BLOG-004 | Post Detail Body | Article, With-TOC | 1 Column, Sticky TOC | 본문 읽기 | title,meta,body,toc | TOC, Quote | title, body | toc, media, share | #blog #postdetail #article | P2 | L/M/H |
| BLOG-005 | Post Meta / Author | Meta bar, Author card | Inline, Card | 메타·작성자 정보 | date,author,readtime,cat,tags | Avatar, Tag | date, author | readtime, tags | #blog #meta #author | P2 | L/L/H |
| BLOG-006 | Related / Prev-Next | Related grid, Prev/Next | Grid, Inline | 관련·이동 | items[], prevNext | Card, Link | items[] | — | #blog #related #navlink | P2 | L/M/H |
| BLOG-007 | Resource Library | Whitepaper/Report/Webinar/Guide/Release cards | Grid + Filter | 자료 라이브러리 | items[{type,title,thumb}] | Card, Filter | items[] | gated, download | #resource #library #whitepaper | P1 | L/M/H |

Resource 유형 태그: blog·news·insight·case-study·whitepaper·report·webinar·guide·brochure·release-note·download.

### 20. FAQ

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| FAQ-001 | Accordion FAQ | Basic, Two-column | Accordion, 1/2 Col | 질문 접이식 | items[{q,a}] | Accordion | items[] | — | #faq #accordion | P0 | H/H/M |
| FAQ-002 | Categorized FAQ | Tab/Group by topic | Tab + Accordion | 주제별 FAQ | groups[{cat,items[]}] | Tab, Accordion | groups[] | — | #faq #categorized | P1 | H/H/L |
| FAQ-003 | Searchable FAQ | Search + List | Search, List | 검색형 FAQ | items[], search | Search | items[] | popular | #faq #search #support | P1 | M/H/L |
| FAQ-004 | FAQ with CTA/Contact | With CTA, Contact link | Split | 미해결→문의 연결 | items[], cta | Accordion, Button | items[], cta | — | #faq #cta #contact | P1 | H/H/L |

### 21. Download

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| DL-001 | Resource Download Cards | Brochure, Datasheet, Whitepaper, Manual | Grid, List | 자료 다운로드 | items[{title,type,size,date}] | Card, Button | items[] | icon, thumb | #download #resource #brochure | P1 | H/M/M |
| DL-002 | Software Download | Version, OS-based, SDK | List, Table | SW/SDK 배포 | builds[{os,version,size}] | Table, Button | builds[] | checksum, notes | #download #software #version | P1 | M/H/L |
| DL-003 | Gated Download | Form-before-download | Split, Modal | 리드 확보형 다운로드 | file, form | Form | file, form | consent | #download #gated #lead | P2 | H/L/M |

### 22. Form / Contact (통합)

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| FORM-001 | Inquiry Form | Simple, Detailed | Split, Centered | 문의 접수 | fields[], submit | Input, Select, Button | fields[], submit | consent, note | #form #inquiry #contact | P0 | H/M/M |
| FORM-002 | Demo / Trial Request | Demo, Trial, Consult | Split | 데모·상담 신청 | fields[], submit | Form | fields[] | product-select | #form #demo #lead | P0 | H/L/L |
| FORM-003 | Quote / Partner | Quote, Partner, Support | Detailed Form | 견적·파트너·지원 | fields[] | Form | fields[] | attachment | #form #quote #partner | P1 | H/L/L |
| FORM-004 | Newsletter | Inline, Footer | Inline, 1 Column | 구독 수집 | email, submit | Input, Button | email | consent | #form #newsletter #subscribe | P1 | M/L/H |
| FORM-005 | Contact Information | Info Card, Map, Offices | Split, Grid | 연락 수단 노출 | phone,email,address,map | Card, Map | contact | map, hours, persons | #contact #info #map | P1 | H/M/L |

폼 필드 인벤토리: 이름·회사·부서·직책·이메일·연락처·문의유형·제품선택·메시지·개인정보동의·제출·완료메시지.

### 23. CTA

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| CTA-001 | Banner CTA | Full-width, Inline, Bottom | Full Width, Centered | 전환 유도 | title,sub,buttons[] | Button | title, cta | sub, secondary | #cta #banner #conversion | P0 | H/M/M |
| CTA-002 | Card CTA | Card, Split, Image | Contained, Split | 카드형 강조 CTA | title,sub,cta,visual | Card, Button | title, cta | image | #cta #card | P1 | H/L/L |
| CTA-003 | Form CTA | Inline form | Split | CTA+즉시 입력 | title,form | Form | title, form | note | #cta #form #lead | P1 | H/L/L |
| CTA-004 | Sticky / Floating CTA | Sticky bar, Floating btn | Sticky, Overlay | 상시 전환 노출 | cta | Button | cta | dismiss | #cta #sticky #floating | P2 | M/M/L |
| CTA-005 | Support Links CTA | Multi-link (소개서/가이드/문의/헬프) | Row | 지원 경로 묶음 | links[] | Link | links[] | icon | #cta #support #links | P1 | H/H/L |

### 24. Footer

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| FOOT-001 | Multi-column Footer | Sitemap, Product, Corporate | Multi-column | 전역 링크맵 | columns[], logo | Link Grid | columns[] | social, lang, family | #footer #sitemap | P0 | H/H/M |
| FOOT-002 | Minimal Footer | Simple, One-line | 1 Row | 최소 법적/저작권 | logo,copyright | Link | copyright | social | #footer #minimal | P1 | H/H/H |
| FOOT-003 | Newsletter Footer | With subscribe | Split | 구독+링크 | columns[], form | Form | columns[] | form | #footer #newsletter | P2 | M/L/H |

Footer 요소: Logo·Description·Product/Company/Resource Links·Contact·Address·Phone·Email·Social·Privacy·Terms·Copyright·Family Site·Language.

### 25. Notice / Utility

| ID | Type | Variants | Layout | Purpose | Content | UI | Req | Opt | AI Tags | Pri | Fit |
|----|------|----------|--------|---------|---------|----|-----|-----|---------|-----|-----|
| UTIL-001 | Announcement Bar | Promo, Notice | Full Width Top | 공지·프로모 띠 | message,link | Bar, Link | message | dismiss | #utility #announcement #promo | P1 | H/H/M |
| UTIL-002 | Cookie / Consent | Banner | Bottom, Overlay | 쿠키 동의 | message,actions | Banner, Button | message | prefs | #utility #cookie #consent | P1 | H/H/H |
| UTIL-003 | Toast / Alert | Toast, Inline Alert | Overlay, Inline | 상태 피드백 | type,message | Toast, Alert | message | action | #utility #toast #alert | P2 | M/M/L |
| UTIL-004 | Back-to-top / Utility | Scroll-top, Floating util | Floating | 보조 유틸 | icon | Button | — | — | #utility #scrolltop | P2 | M/M/M |

---

## D. 우선순위 요약 — P0 (MVP 필수)
NAV-001, NAV-007, HERO-001, HERO-002, HERO-006, INTRO-001, INTRO-002, INTRO-003, FEAT-001, FEAT-002, FEAT-003, BEN-001, CONT-001, PROC-001, TEST-001, TEST-003, FAQ-001, FORM-001, FORM-002, CTA-001, FOOT-001 · 매뉴얼: NAV-006, MAN-001~004.

## E. MVP 먼저 제작할 섹션 20 (제작 순서)
1. HERO-001 Standard Hero · 2. HERO-002 Product Visual Hero · 3. NAV-001 GNB · 4. FOOT-001 Footer · 5. INTRO-002 Product Overview · 6. FEAT-001 Feature Grid · 7. FEAT-003 Feature Detail · 8. BEN-001 Value 3-up · 9. PROC-001 Step Process · 10. TEST-003 Logo Wall · 11. TEST-001 Single Quote · 12. STAT-001 Counter Row · 13. USE-001 Use Case Grid · 14. CTA-001 Banner CTA · 15. FAQ-001 Accordion FAQ · 16. FORM-002 Demo/Trial Request · 17. HERO-006 Page Hero(하위/매뉴얼 진입) · 18. MAN-001 Doc TOC · 19. MAN-003 Step Guide · 20. MAN-004 Callout.

## F. 온사이트 제품소개 추천 조합
`UTIL-001 → NAV-001 → HERO-002 → INTRO-002 → FEAT-001 → FEAT-003 → BEN-001 → PROC-001 → USE-001 → INTEG-001 → ARCH-004(보안) → STAT-001 → TEST-001 → TEST-003 → CASE-001 → FAQ-001 → CTA-001(+CTA-005) → FOOT-001`

## G. 온사이트 매뉴얼 추천 조합
`NAV-001 → HERO-006(Manual) → NAV-005(Breadcrumb) → NAV-006(Sidebar TOC) → MAN-002(Getting Started) → MAN-003(Step Guide) → MAN-004(Callout) → MAN-005(Code/Media) → COMP-004(Spec) → MAN-006(Troubleshooting) → FAQ-001 → MAN-009(Related) → MAN-010(Support) → FOOT-002`

## H. 다음 산출물 전환 매핑
- **sections.json** — 본 표를 기계가독 스키마로. (P0/P1 우선 적재 → [`sections/sections.json`])
- **registry.js** — 각 Section Type의 render(variant). 현재 27→본 체계로 확장(ID 정합).
- **CONTENT_SCHEMA.md** — Required/Optional/UI Components 열 → slotSchema(JSON Schema).
- **Figma 컴포넌트** — Section Type = 컴포넌트, Variant/Layout = variant property.
- **생성 로직** — AI Tags + Fit + Pri로 기획 텍스트 → 섹션 선택·정렬(11월 고도화).

## I. 통합/제외 로그 (재확인)
통합: HowItWorks→Process · Guide→Manual · Spec→Comparison · Video/Demo/Gallery→Media · CustomerLogo→Testimonial · Contact→Form · ProductOverview→Introduction. 제외: 쇼핑/결제/배송·커뮤니티·SNS피드·포트폴리오·엔터·대형 어드민·계정관리.
