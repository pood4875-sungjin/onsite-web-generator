# 화면 비율 계약 v1 (PPT 슬라이드 캔버스)

PPT 덱의 **지면 비율**을 3종 중에서 고르는 기능의 규격서.
앱(생성기)과 팩(스타일팩)이 각각 무엇을 책임지는지, 배선 지점이 어디인지 기록한다.
**새 PPT 팩은 이 문서를 따라야 한다.**

---

## 1. 계약 (임의 변경 금지)

### 값

```
data._ratio = '16:9' | '4:3' | '3.8:1'
```

- **필드가 없으면 `'16:9'`으로 간주** — 기존 프로젝트 하위호환. 이 규칙을 어기면 옛 덱이 깨진다.
- 미지값(예: `'21:9'`)도 `'16:9'`으로 정규화한다.

### 캔버스

| 비율 | px | 인치(px÷96) | 슬러그 |
|------|-----|------------|--------|
| `16:9` | 1280 × 720 | 13.3333 × 7.5 | `r169` |
| `4:3` | 1280 × 960 | 13.3333 × 10 | `r43` |
| `3.8:1` | 2736 × 720 | 28.5 × 7.5 | `r381` |

**제약: px = 인치 × 96.** `app/export-pptx.js:6` 의 `IN = 1/96` 이 px→인치 환산의 유일한 상수라,
96의 배수가 아닌 px를 쓰면 PPTX 슬라이드 규격이 소수점으로 어긋난다. 새 비율을 추가할 때도 이 제약을 지킬 것.

### 슬러그

CSS 속성 셀렉터용. 팩은 문서 루트에 `data-ratio="r169|r43|r381"` 을 부여하고
`[data-ratio="r43"] .xx { ... }` 형태로 비율별 오버라이드를 건다.

---

## 2. 책임 분리

### 앱 (생성기) — `app/**`, `proxy/worker.js`

`_ratio` 값의 **저장·전달·선택 UI·사후 변경·PPTX 규격·AI 프롬프트 주입**만 담당한다.
지면 안쪽 레이아웃은 일절 건드리지 않는다.

- 인테이크에서 비율을 고르게 하고 `data._ratio`에 저장
- 모든 렌더 payload에 `_ratio` **정규화된 값**을 동봉 (본문·썸네일·라이브·뷰어 전부)
- 액자(프리뷰 폭·썸네일 aspect-ratio·PDF @page·PPTX 레이아웃)를 캔버스 표에서 파생
- 워커: 비율에 따른 **콘텐츠 분량 지시만** 시스템 프롬프트에 덧붙임

### 팩 — `packs/ppt/**`

지면 안쪽 전부. 팩은 "완전 자기완결"이므로 캔버스 표를 **자체 보유**한다.

- `data._ratio`를 읽어 문서 루트에 `data-ratio="<슬러그>"` 부여
- `--slide-w` / `--slide-h` CSS 변수를 캔버스 px로 세팅
- `[data-ratio=...]` 스코프 오버라이드로 레이아웃·타이포·그리드 조정
- **필드가 없으면 16:9로 동작해야 한다** (앱이 정규화해 보내주지만, 팩 단독 사용도 가능해야 함)

---

## 3. 단일 진실 헬퍼

```js
window.RATIO.canvas('4:3')
// → { ratio:'4:3', w:1280, h:960, slug:'r43', inW:13.333…, inH:10, ar:'1280/960' }
window.RATIO.of(data)   // data._ratio 기준 (없으면 16:9)
window.RATIO.norm(r)    // 정규화만
window.RATIO.LIST       // ['16:9','4:3','3.8:1']
```

정의 위치: **`app/llm.js` 최상단** (파일 앞머리의 독립 IIFE).
버들리스(번들러 없음) 구조라 공용 유틸 모듈이 없고, `llm.js`가 index·studio 양쪽이 모두 로드하는
유일한 공용 스크립트다(`LLM.fixBrand`가 여기 있는 것과 같은 이유).
**리터럴 1280/720/2736/960을 코드에 흩뿌리지 말 것** — 전부 이 헬퍼에서 파생시킨다.

---

## 4. 배선 지점 (파일:행 — 2026-08-11 기준)

### `app/llm.js`
| 위치 | 내용 |
|------|------|
| `:6-31` | `window.RATIO` 계약 표·정규화·캔버스 헬퍼 (단일 진실) |
| `composeDeck` 프록시 body | `ratio: RATIO.norm(brief.ratio)` 전송 |

### `app/index.html` — 생성 전 선택
| 위치 | 내용 |
|------|------|
| `PPT_RATIOS` 상수 | 비율 3종 라벨 (분량 `PPT_LENGTHS`와 같은 어휘) |
| `FIXED_QS.ppt` | `{key:'__ratio'}` 옵션 카드 — **스타일 카드보다 먼저** 물어야 썸네일이 그 비율로 그려진다 |
| `S.ratio` | 상태 기본값 `'16:9'` / `curCanvas()` 헬퍼 |
| `askOptionCards` 응답 처리 | `x.key==='__ratio'` → `S.ratio` |
| `askSummary()` | 요약 카드의 "화면 비율" 칩 행 (언어 칩과 같은 패턴 — 생성 직전 변경 가능) |
| `buildStyleCards()` | `--sw-ar` 세팅 + 썸네일 덱에 `_ratio` 동봉. 3.8:1은 그리드 1열 |
| CSS `.scards.ppt .sc .sw` / `.styles.ppt .sc .sw` | `aspect-ratio:var(--sw-ar,16/9)` |
| `generate()` | `brief.ratio=S.ratio` / `pg0.data._ratio` (AI 경로) / `deck._ratio` (템플릿 경로) |

### `app/studio/studio.html` — 생성 후 변경
| 위치 | 내용 |
|------|------|
| `canvasOf()` (`fitPreview` 위) | `RATIO.of(data)` — 스튜디오 전 지점의 캔버스 출처. 폴백 `RATIO_FB` |
| `fitPreview()` | 고정 포맷(PPT)은 `targetW = canvasOf().w` — 3.8:1(2736px) 가로 스크롤 방지 |
| `renderWith()` | 슬라이드 팩이면 `rd._ratio` 정규화 주입 (본문·미리보기·HTML 내보내기) |
| `renderDeckFor()` | **payload에 `_ratio` 동봉 필수** — 빼먹으면 썸네일만 16:9로 떨어진다(`_clang`이 겪은 사고) |
| `applyRailCanvas(rail)` | `#thumbRail`에 `--thumb-ar/-w/-h` 세팅 (자식 `.thumb`이 상속) |
| `rebuildThumbRail()` / `paintLiveRail()` | 스케일 `(W-4)/cv.w` |
| CSS `.thumb` / `.thumb iframe` | `aspect-ratio:var(--thumb-ar)` / `width:var(--thumb-w)`·`height:var(--thumb-h)` |
| `skeletonSlideHtml()` | 라이브 초기 스켈레톤 카드 폭·`aspect-ratio` |
| `appendSkelCard()` | `var(--slide-w, <cv.w>px)` 폴백 |
| `revealSlideTyping()` | 커서 좌표 스케일 기준폭 폴백 |
| `startLiveCompose()` | `data._ratio` 확정 → `brief.ratio` 동봉 (워커 분량 지시용) |
| `doPdf()` | `@page{size:<inW>in <inH>in}` + 인쇄용 iframe 크기 |
| 상단바 `#stRatioWrap` / `switchRatio()` / `syncRatioUI()` | 비율 스위처 — `data._ratio` 갱신 → `persist()` → `render()` + `refreshPptPanel()` |

### `app/export-pptx.js`
| 위치 | 내용 |
|------|------|
| `FALLBACK_W/H` | rect 실측 실패 시에만 쓰는 16:9 기본값 |
| `exportPptx()` 루프 직전 | 첫 장 rect → `pptx.defineLayout({name:'CUSTOM', width, height})` + `pptx.layout='CUSTOM'` (구 `LAYOUT_WIDE` 대체, 16:9는 값 동일) |
| `addTextBox()` slackW | 여유 폭 상한을 `origin.width`(그 장의 실측)에서 계산 |

**주의**: `defineLayout`은 `addSlide`보다 먼저 1회만 가능하다. 그래서 첫 장 rect를 루프 밖에서 미리 잰다.

### `proxy/worker.js` — `/compose`
| 위치 | 내용 |
|------|------|
| `clip(body.ratio, 8)` | 입력 검증 |
| 팩 선택 + 언어 주입 직후 | 비율별 **분량 지시만** 조건부 append. `16:9`는 no-op |

**절대 금지**: 비율 프롬프트에서 장수·슬라이드 타입·잠금 문구를 언급하거나 바꾸는 것(시연 잠금 유지).

---

## 5. 새 팩 체크리스트

1. 캔버스 표(위 §1) 복사 — 팩 내부 상수로
2. `data._ratio` → 슬러그 → 루트 요소 `data-ratio` 속성
3. `--slide-w` / `--slide-h` 를 캔버스 px로
4. `[data-ratio="r43"]`, `[data-ratio="r381"]` 스코프 오버라이드 작성
5. `_ratio` 없이 호출해도 16:9로 그려지는지 확인 (팩 단독 사용 경로)

## 6. 검증

브라우저 하네스(레포 루트 `_verify*.html` 임시 생성 → 검증 → 삭제)로 3비율 각각
① 프리뷰 액자 폭 ② 썸네일 스케일·액자 비율 ③ 렌더 payload의 `_ratio` ④ 라이브 스켈레톤
⑤ 스위처 전환 후 재렌더·`persist()` ⑥ `_ratio` 없는 옛 프로젝트가 16:9로 동작하는지 를 실측한다.
