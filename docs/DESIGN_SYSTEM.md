# DESIGN_SYSTEM.md — DS v1

> 온사이트 Web Generator 디자인 시스템. **스타일 소스 = Wanted Design System (비주얼 언어만 차용, 채용 도메인 개념 제외).**
> 구현: [`styles/tokens.css`](../styles/tokens.css). 이 문서는 근거·규칙.

## 차용 원칙 (Wanted 비주얼 언어)
1. **dual neutral** — cool blue-tinted `neutral-*`를 UI 표면 워크호스로. (순수 흑백 `gray-*`는 utility)
2. **단일 강조** — brand `blue-800`(#0066FF) 하나. primary CTA·링크·포커스링·핵심 데이터에만. chrome 배경엔 안 씀.
3. **헤어라인 구조** — 카드는 1px `border-subtle`. **카드에 그림자 금지.** 그림자는 popover/modal/toast 등 elevated에만.
4. **텍스트 위계 = alpha multiplier** — `neutral-875/825` 위에 알파(88/61/43/28). 별도 gray hex 안 만듦.
5. **네거티브 트래킹** — 17px+ 헤딩에 음수 자간 (display1 -3.19% ~ heading2 -1.20%).
6. **이산 radius ladder** — 8/12 디폴트, pill은 full. 6·10·14 임의값 금지(버튼 로컬 예외).
7. **넉넉한 수직 리듬** — 섹션 간 64~96px.
8. **무이모지 · chrome 그라디언트 금지** — 그라디언트는 심볼/아바타/썸네일/마케팅 hero 4자리만(온사이트는 아직 미사용).

> ⚠️ **도메인은 차용 안 함** — 잡카드·채용보상금·해시태그 등 원티드 채용 개념은 이식하지 않는다. 시각 언어만.

## 토큰 (semantic alias — 컴포넌트/섹션은 여기부터)

### 색 (OKLCH 직접 표기)
| alias | light | 용도 |
|---|---|---|
| `--bg-canvas/surface` | `oklch(1 0 0)` | 기본 표면 |
| `--bg-subtle` | neutral-50 | page bg / alt band |
| `--bg-muted` | neutral-75 | hover fill |
| `--bg-brand` | blue-800 | primary CTA |
| `--bg-brand-subtle` | blue-100 | 배지/알림 배경 |
| `--fg-strong` | neutral-960 | 제목 |
| `--fg-default` | neutral-875 / .88 | 본문 |
| `--fg-secondary` | neutral-825 / .61 | 라벨·캡션 |
| `--fg-tertiary` | neutral-825 / .43 | placeholder |
| `--fg-brand/link` | blue-800 | 링크·강조 |
| `--border-subtle` | neutral-700 / .08 | 카드 헤어라인 |
| `--border-default` | neutral-700 / .22 | 입력·secondary |

signal: `--fg-danger`(red-700) `--fg-success`(green-600) `--fg-warning`(orange-700) + 각 `*-subtle` bg.
**다크모드**: semantic alias만 교체(alpha 베이스 흰색으로 반전). `:root[data-theme="dark"]`.

### 타이포
- 본문/UI = **Pretendard JP**, display(헤드라인) = **Wanted Sans**. mono = SF Mono.
- 램프(size/tracking): display1 56/-3.19% · title1 32/-2.53% · title2 28/-2.36% · title3 24/-2.30% · heading1 22 · heading2 20 · headline1 18 · body1 16/+0.57% · body2 15 · label 14/13 · caption 12.
- line-height: tight 1.3(헤딩) · base 1.5(UI) · read 1.625(산문).
- `font-feature-settings:"ss20","calt","kern"` + antialiased.

### 스페이싱 (4px base)
2·4·8·12·16·20·24·32·40·48·64·96·128. 비4배수 금지.

### radius
2·4·8·12·16·20·full. 디폴트 8/12, pill full.

### elevation
`--shadow-1`(미세) · `--shadow-3`(elevated) · `--shadow-pop`(popover). 카드엔 미적용.

## 갱신 규칙
섹션 늘 때 필요한 토큰만 누적. raw 값 금지 — semantic alias만 참조. atomic ramp 직접 참조는 새 alias 정의 시에만.
