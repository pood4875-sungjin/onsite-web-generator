# KRDS 스타일 팩 + 팩 인스펙터 — 설계 (Design Spec)

- **날짜**: 2026-07-22
- **범위**: 테스트용 새 출력 스타일 팩 `krds` 1종 + 재사용 팩 충실도 인스펙터 HTML
- **출처(SSOT)**: KRDS v1.0.0 (Community) Figma — fileKey `OILUy443EILgdjCdB0nIDY`
- **비유**: 생성기 = 붕어빵 틀(모양 고정). 팩 = 반죽/색. KRDS 반죽을 새로 만들어 틀에 붓고, "제대로 부어졌나" 눈으로 볼 확인용 HTML을 붙인다.

## 1. 목표 / 배경

`onsite-web-generator`는 **스타일 중립 멀티팩** 구조다. 섹션 렌더러는 고정이고 **팩만 교체**하면 전체가 즉시 리스킨된다. 현재 팩:

- **Wanted 하우스 DS** — `styles/sections.css`의 `:root`에 하드코딩된 라이트 토큰. `.sx` 스코프 섹션(registry.js)이 이 변수 계약을 소비.
- **darkglow** — 별도 인라인 렌더(`core/darkglow/*`, `core/site-render.js`). 이번 작업과 무관.

이번 작업은 **정부·공공(KRDS) 스타일 팩**을 추가해 멀티팩 스타일 중립성을 검증하고, 앞으로 팩이 늘어날 때 **탑재 충실도를 눈으로 확인**할 재사용 도구를 세운다.

**성공 기준**
1. `krds` 팩을 껐다 켜면 동일 섹션 5종(nav/hero/feature/cta/footer)이 KRDS 룩으로 리스킨된다.
2. 인스펙터 HTML에서 드롭다운으로 팩을 골라 토큰(색/타입/스페이싱/radius)과 섹션 프리뷰를 자동으로 본다.
3. 포팅한 섹션 옆에 KRDS Figma 원본 스크린샷이 나란히 떠서 "진짜와 같은가"를 즉시 판단한다.

## 2. 아키텍처

### 2.1 섹션 변수 계약 (KRDS 팩이 채울 대상)

`styles/sections.css`의 `:root`가 섹션이 소비하는 CSS 변수 계약이다. 팩 = **이 `:root`를 팩 값으로 덮어쓰는 오버라이드 블록**. 채울 변수:

```
색:   --brand --brand-hover --ink --ink-2 --muted --soft
      --line --line-2 --bg --bg-2
신호: --info --info-bg --warn --warn-bg --danger --danger-bg --ok --ok-bg
형태: --radius --radius-sm
폰트: --font-sans --font-display --font-mono
```

`--fs-*`(타입 스텝), `--s-*`(스페이싱 스텝)은 구조값 — KRDS와 근접하므로 팩에서 건드리지 않는다(필요 시 후속 조정). 스타일 정체성은 **색·폰트·radius**에서 나온다.

### 2.2 KRDS 토큰 매핑 (Figma 실측 → 계약)

Figma 바인딩 실측값 기반. 파운데이션 페이지(`🎨 Design style`, node 4869:181080)에서 전체 색/타입 스케일을 구현 1단계에서 마저 추출·검증한다. 현재 확정 시드:

| 계약 변수 | KRDS 값 | KRDS 토큰명 |
|---|---|---|
| `--brand` | `#0b50d0` | color/text/primary |
| `--brand-hover` | `#256ef4` 계열 darken (추출확정) | color/border/primary |
| `--ink` | `#131416` | color/text/bolder |
| `--ink-2` | `#1e2124` | color/text/basic |
| `--muted` | `#33363d` / secondary gray (추출확정) | color/icon/gray |
| `--soft` | `#5b6270` 계열 (추출확정) | — |
| `--line` | `#cdd1d5` | color/divider/gray-light |
| `--line-2` | `#b1b8be` | color/border/gray |
| `--bg` | `#ffffff` | color/background/white |
| `--bg-2` | `#eef2f7` | color/action/secondary-hover |
| 신호(info/warn/danger/ok) | KRDS system color 세트 (추출확정) | color/status/* |
| `--radius` | `8px` | radius/medium4 |
| `--radius-sm` | `4px` | radius/small2 |
| `--font-sans`/`--font-display` | `"Pretendard GOV"` + 폴백 | typo/font/type |

> 주의: KRDS는 flat hex 텍스트 토큰(#1e2124 등), Wanted 하우스는 OKLCH+알파. 팩 오버라이드는 **베이스 변수만** KRDS hex로 재정의 — 토큰 레벨 충실도로 충분.

### 2.3 팩 계약 형태

기존 `sample` 팩 형태를 따른다. **KRDS 팩은 자기완결**(다른 팩·하우스 DS에 의존 안 함) → 포팅 가능.

```
core/packs/krds/
  tokens.js          // KRDS 토큰 = 단일 객체(SSOT)
  tokens.css.js      // 토큰 → :root 오버라이드 CSS 문자열 파생 (tokensCss())
  pack.js            // { meta, tokens, tokensCss, variantMap }
```

`variantMap` — 섹션 5종에 KRDS 정부·정식 톤에 맞는 variant 지정(예: nav solid, hero split, feature grid, cta band, footer full). 구현 시 registry의 실제 variant id로 확정.

> ⚠️ `mda-onsite-ds-sync` 스킬(하우스 DS 스냅)은 **적용 안 함** — KRDS는 의도적으로 독립 팩. 스냅하면 멀티팩 목적이 깨진다.

### 2.4 팩 레지스트리 (개별 관리)

팩 목록을 한 곳에서 관리하도록 `core/packs/index.js`(경량 레지스트리)에 `krds`를 등록. 인스펙터·생성기가 이 목록을 단일 소스로 참조. sample/darkglow와 나란히.

## 3. 팩 충실도 인스펙터 (HTML)

**단일 정적 HTML** (`tools/pack-inspector.html`), 빌드 없음. 팩 레지스트리를 읽어 임의 팩을 자동 전개.

**레이아웃**
1. **상단 바** — 팩 선택 드롭다운(krds/sample/…) + 팩 meta(이름·설명).
2. **토큰 패널 (자동 렌더)**
   - 컬러 스와치: 역할별 그룹(brand/ink/surface/line/signal), hex + 변수명 표기.
   - 타입 램프: display→caption 각 스텝 실렌더(폰트·크기·트래킹).
   - 스페이싱 사다리·radius 사다리 시각 바.
3. **섹션 프리뷰** — 선택 팩의 `:root` 오버라이드를 스코프에 적용한 상태로 섹션 5종을 실제 registry 렌더로 표시.
4. **원본 대조 (side-by-side)** — 포팅 섹션/컴포넌트 옆에 KRDS Figma 스크린샷 나란히. 스크린샷은 `tools/refs/krds/*.png`로 저장(get_screenshot로 캡처).

**충실도 판정법**: 토큰 스와치 hex가 KRDS 실측과 일치 + 섹션 프리뷰가 원본 스크린샷과 시각적으로 부합 → "탑재 성공". 불일치 토큰은 패널에 경고 표시(구현 시 옵션).

## 4. 범위 밖 (YAGNI)

- KRDS 자체 14종 컴포넌트(배지/탭/얼럿 등) 풀 포팅 — 생성기는 5 섹션만 씀. **안 함.**
- darkglow 렌더 경로 수정 — 무관.
- 다크모드 KRDS — KRDS 라이트 우선, 후속.
- 인스펙터의 토큰 편집/저장 — 읽기 전용 확인 도구.

## 5. 검증

- `krds` 팩 on/off로 섹션 5종 리스킨 육안 확인(인스펙터).
- 스와치 hex === Figma 실측(2.2 표) 대조.
- side-by-side 원본 스크린샷과 부합.
- 기존 sample/darkglow 팩 렌더 회귀 없음(인스펙터 드롭다운 전환).

## 6. 구현 순서(개요 — 상세는 plan 단계)

1. KRDS 파운데이션 페이지에서 전체 색/타입/신호 토큰 추출·확정.
2. `core/packs/krds/{tokens,tokens.css,pack}.js` 작성 + variantMap 확정.
3. `core/packs/index.js` 팩 레지스트리 + krds 등록.
4. `tools/pack-inspector.html` — 토큰 자동 전개 + 섹션 프리뷰 + 드롭다운.
5. KRDS 원본 스크린샷 캡처 → `tools/refs/krds/`, side-by-side 결합.
6. 검증(§5).
