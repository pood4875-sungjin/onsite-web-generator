# 스타일팩 계약 + KRDS 풀팩 + 팩 인스펙터 — 설계 (Design Spec, rev2)

- **날짜**: 2026-07-22 (rev2 — 아키텍처 재설계)
- **결정**: 팩 = **완전한 자기완결 DS**(파운데이션·레이아웃·브레이크포인트·컴포넌트·섹션·모션 전부). 생성기 = **얇은 콘텐츠 오케스트레이터**. 경계 = 의미(semantic) 콘텐츠 스키마.
- **출처**: KRDS v1.0.0 (Community) Figma — fileKey `OILUy443EILgdjCdB0nIDY`

## 1. 왜 이 구조인가

모든 스타일팩이 전 층(파운데이션→레이아웃→브레이크포인트→컴포넌트→섹션→모션)에서 다르다. 따라서 생성기에 고정으로 남는 유일한 불변 = **콘텐츠 구조**(무엇을 말하는가), 스타일 아님.

- **생성기**: "이 페이지 = 섹션 순서, 각 섹션 = {타입, 콘텐츠 슬롯}". 픽셀 0.
- **팩**: "각 섹션 타입을 내 컴포넌트·토큰·그리드로 반응형 렌더". 픽셀 전부.
- 팩 추가 = **계약 하나 구현**. 경계 명확 → 팩끼리 안 샌다.

**KRDS 마케팅 논란 해소**: 섹션 타입(taxonomy)은 생성기 것(의미 단위). 팩이 자기 컴포넌트로 그리므로 "KRDS hero"는 KRDS 버튼·타입·그리드로 조립 → 컴포넌트 레벨에서 진짜 KRDS(멀티브랜드 표준). 없는 패턴 지어내는 게 아님.

## 2. 아키텍처

### 2.1 생성기 측 (고정 · 이미 존재)
- `core/volume.js` — `includesTier(volume, tier)` (compact/mid/heavy × core/mid/rich).
- `core/template.js` — `buildPageDoc({template, volume, content, sharedFacts})` → 의미 페이지doc `{meta, sharedFacts, sections:[{type, slotValues}]}`.
- 템플릿 = pageType → `[{type, tier}]` (섹션 순서). **의미 타입 사용**(darkglow 전용 명칭 아님).

### 2.2 팩 계약 (신규 — 키스톤)
`core/packs/contract.js` — JSDoc 타입 + 오케스트레이터.

```js
/** @typedef Pack
 * @property meta        {id,name,desc,source}
 * @property foundation  토큰 객체 (색·타입·space·radius·shadow)
 * @property layout      { container, grid, breakpoints:{sm,md,lg} }
 * @property motion      (level:'static'|'subtle'|'rich') => { css, js }
 * @property components  { button, link, badge, card, nav, ... } 렌더/CSS 헬퍼
 * @property sections    { [type]: (content, ctx) => htmlFragment }  // 반응형
 * @property globalCss   (ctx) => string  // 파운데이션+레이아웃+브레이크포인트 base CSS
 */
// ctx = { f:foundation, layout, motion, components, C:cssVarScope }
export function renderPage(pageDoc, pack, { motion='subtle' } = {}) { ... }
// 각 섹션: pack.sections[type](content, ctx); 없으면 skip + 경고 로그.
// 래핑: <html><style>globalCss + motion.css</style><body>…sections…motion.js</body>
```

**정식 섹션 타입(의미)**: `nav · hero · feature · stat · cta · footer` (MVP). 확장 시 taxonomy에 추가.

### 2.3 팩들
- **darkglow** — 기존 `core/darkglow/*`(자기 섹션 렌더+토큰+모션)를 계약으로 **리프트**(어댑터). 계약 검증용 레퍼런스 1.
- **wanted (하우스)** — 기존 sections.css/registry 범용 모델은 약함 → wanted 팩 내부로 흡수하거나 후속. 레퍼런스 2(경량).
- **KRDS 풀팩** — 신규, 계약 전 층 구현.

### 2.4 KRDS 풀팩 구성 (`core/packs/krds/`)
```
foundation.js  색 램프·타입·space·radius·shadow·모션값 (Figma 실측 + KRDS 규약)
layout.js      container 폭 · 그리드 · 브레이크포인트 (KRDS 반응형)
motion.js      절제된 기능적 모션 (짧은 duration, ease-out)
components.js   button·link·badge·card·nav·chip … (1px 헤어라인·radius 8·정부블루)
sections.js     nav·hero·feature·stat·cta·footer → components 조립, 반응형
pack.js         계약 구현체 (foundation/layout/motion/components/sections/globalCss)
```

**KRDS 토큰 시드(Figma 실측)**: brand `#256ef4` / hover `#0b50d0` · ink `#131416`/`#1e2124`/subtle `#464c53` · line `#cdd1d5`/`#b1b8be` · bg `#fff`/`#f4f5f6` · danger `#e53535`·ok `#00875a`·warn `#ff9200`·info `#256ef4` · radius 4/6/8/12 · Pretendard GOV · lineHeight 1.5 · type 44/24/19/17.

## 3. 팩 인스펙터 = 팩별 풀 DS 문서

`tools/pack-inspector.html` (재사용, 드롭다운). 팩 하나를 전 층으로 전개·검증:
1. **파운데이션** — 색 스와치·타입 램프·스페이싱·radius·shadow.
2. **컴포넌트 갤러리** — button/link/badge/card/nav 등 상태별.
3. **섹션 프리뷰** — `renderPage`로 실제 조립된 섹션들(선택 팩).
4. **반응형** — sm/md/lg 뷰포트 토글(브레이크포인트 검증).
5. **KRDS 원본 대조** — Figma 스크린샷 side-by-side.

## 4. 범위 밖 (YAGNI)
- KRDS 14 컴포넌트 1:1 전량 — 생성기 섹션에 필요한 컴포넌트 우선. 나머지 후속.
- 다크모드 — KRDS 라이트 우선.
- 생성기 앱 UI(스튜디오) 변경 — 출력 파이프라인만.

## 5. 제약
- **Figma MCP 레이트리밋(Starter)** — KRDS 전체 컴포넌트 실측 지금 막힘. 알려진 토큰+KRDS 규약으로 선구현, 리밋 풀리면 정밀 보정.

## 6. 순서
1. **팩 계약** `contract.js` (타입+`renderPage`) — 키스톤.
2. darkglow를 계약으로 리프트(어댑터) → 2팩으로 계약 검증.
3. **KRDS 풀팩**: foundation→layout→motion→components→sections→pack.
4. 인스펙터를 계약 기반 풀 DS 문서로 승격(+반응형+Figma 대조).
5. 검증: `renderPage` 페이지 산출 · 인스펙터 육안 · 팩 전환 리스킨 · 반응형.
