# MIDAS Web Generator — 앱 디자인 시스템 (v3, Glass Inspired)

> **개정**: 2026-07-22
> 앱(제너레이터 도구) 셸 크롬 DS. **생성 출력 스타일 팩(에테르/바이올렛/엠버)과 별개.**
> 구현: `app/ds.css` + `app/theme.js` — 진입·프로젝트·워크스페이스 공유.
> 근거: `references/ui-trends.md > Glassmorphism 2.0`. 이전 Webflow-flat 버전은 `app/ds-legacy.css` 백업.

## 원칙

1. **글래스모피즘 2.0.** 그라디언트 워시 배경 위에 **반투명 프로스트 패널**(backdrop-blur) + 얇은 보더 + 상단 인셋 하이라이트 + 은은한 소프트 섀도. 1세대 과블러 대신 정제된 깊이감.
2. **하나의 시스템, 라이트/다크 두 테마.** `<html data-theme="light|dark">`. 컴포넌트는 제네릭 토큰(`--canvas`,`--ink`,`--surface`,`--hairline`,`--accent`,`--scrim`,`--grad-cta`)만 참조. 토글 = `theme.js`(localStorage `midas-theme`).
3. **그라디언트 워시.** 배경은 퍼플·블루·핑크 라디얼 워시(`--scrim`) + 솔리드 캔버스(`--canvas`). 고정 레이어는 `html`(캔버스) + `.ds-body::before`(워시) — `background-attachment:fixed`는 테마 토글 시 리페인트 버그가 있어 의사요소 사용.
4. **타이포 = Inter** 400/500/600, weight 상한 600. 디스플레이 네거티브 트래킹, 대문자 eyebrow.
5. **부드러운 shape.** 버튼·인풋·칩 = **12px**(`--r-sm`), 카드 = **20px**(`--r-md`), 토글·배지·진행점 = pill.
6. **그라디언트 액센트.** 주 CTA·선택 칩·진행점·브랜드 로고 = `--grad-cta`(퍼플→블루) / `--grad-brand`. near-black 솔리드(`--primary`)는 대비가 필요한 자리에만.
7. **접근성.** 프로스트 위 텍스트 대비 확보(라이트 ink `#13173a`, 다크 `#f4f6ff`). 블러 미지원 환경은 `@supports`로 솔리드 폴백, `prefers-reduced-motion`은 트랜지션 제거.
8. 출력물(생성 페이지)은 이 크롬 DS 안 따름 — 선택 스타일 팩이 지배.

## 토큰 (`app/ds.css`)

**타이포:** `--font`(Inter+Pretendard), mono(Inconsolata). display-xxl 64…xs 20, eyebrow 13(대문자·.12em), body-lg 20/body 16/sm 14, caption 12.8. weight reg400·med500·semi600.
**스페이싱:** 4·8·12·16·20·24·32·40·48·64.
**라디우스:** xs6·sm12(버튼)·md20(카드)·lg28·pill.
**글래스:** `--blur 20px`·`--blur-strong 32px`, `--grad-cta`(#7a3dff→#5b6bff→#3b89ff), `--grad-brand`, `--glass-hi`(상단 하이라이트), `--cta-glow`.
**크로매틱:** `--a-purple #7a3dff · a-pink #ed52cb · a-blue #3b89ff · a-orange #ff6b00 · a-green #00d722` + info/yellow/red.

### 테마별 색

| 토큰 | light | dark |
|---|---|---|
| `--canvas` | #eef1f8 | #0a0b18 |
| `--surface` (프로스트) | rgba(255,255,255,.58) | rgba(255,255,255,.065) |
| `--surface-solid` | #ffffff | #14162a |
| `--canvas-2` | rgba(255,255,255,.45) | rgba(255,255,255,.04) |
| `--hairline` / `-strong` | rgba(24,28,64,.10)/.18 | white/.12 / .20 |
| `--ink` / `--body` / `--mute` | #13173a / #3a3f63 / #7f84a6 | #f4f6ff / white.76 / white.44 |
| `--primary` / `--on-primary` | #171a3d / #fff | #fff / #0a0b18 |
| `--accent` | #5b5bff | #8ea2ff |
| `--scrim` | 퍼플·블루·핑크 라디얼(라이트) | 동일 hue, 고채도(다크) |

## 컴포넌트 (`ds-*` 클래스)

`.ds-body`(+`::before` 워시) · `.ds-wordmark` · `.ds-eyebrow`(대문자) · `.ds-btn`(`.primary`=그라디언트 CTA, `.ghost`=투명, 프로스트, 12px) · `.ds-input`(프로스트+포커스 링) · `.ds-card`(20px 프로스트 패널) · `.ds-chip`(`.on`=그라디언트) · `.ds-badge`(pill, `.soft`) · `.ds-dots`(`.on`=그라디언트 바) · `.ds-theme`(pill 프로스트 토글).

## 적용

| 화면 | 파일 | 비고 |
|---|---|---|
| 온보딩(종류→정보→스타일) | `app/index.html` | 카드 썸네일, 사업군, 사업군별 스타일 추천 배지 |
| 내 프로젝트 | `app/projects.html` | 실제 페이지 라이브 렌더 썸네일 · 이름변경 · 삭제 |
| 워크스페이스·제너레이터 | `app/studio/studio.html` | 좌 페이지레일 + 챗 + 프리뷰. 셸=글래스, 프리뷰만 다크글로우 출력 |

라이트/다크 토글은 세 화면 상단에 있고 상태 공유. `file://` 더블클릭 지원 위해 모듈은 `app/bundle.js`(classic)로 번들(`node build.cjs`).

## 후속

- 스튜디오 프리뷰 pack 스와치/출력은 스타일 팩 영역(별개 유지).
- 실제 "Glass Inspired (Community)" 파일 실측값 확보 시 토큰 미세조정(현재 references 글래스모피즘 2.0 기반).
- 배포·클라우드 저장.
