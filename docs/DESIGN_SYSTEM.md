# DESIGN_SYSTEM.md — DS v0

> 온사이트 Web Generator 전용 디자인 시스템. 미니멀(거의 흑백, 여백·위계 중심).
> 구현: [`styles/tokens.css`](../styles/tokens.css). 이 문서는 근거·규칙.

## 원칙
1. **컬러 최소화** — 흑백 + 회색 톤. 브랜드 강조도 잉크색(추후 브랜드 컬러 도입 시 semantic 레이어만 교체).
2. **위계는 크기·굵기·여백으로.** 장식(그라디언트·그림자·컬러밴드) 지양.
3. **raw 값 금지** — 섹션/컴포넌트는 semantic 토큰만 참조.
4. **2계층** — primitive(원시값) → semantic(역할). 다크모드는 semantic만 교체.

## 토큰

### 색 (primitive)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--c-ink-900` | `#111318` | 본문·제목 |
| `--c-ink-700` | `#3d414a` | 부제 |
| `--c-ink-500` | `#6b7078` | muted |
| `--c-ink-300` | `#a6abb4` | soft/placeholder |
| `--c-line` | `#e8e9ec` | 보더 |
| `--c-line-2` | `#f1f2f4` | 옅은 구분선 |
| `--c-white` | `#ffffff` | 배경 |
| `--c-paper` | `#fafafb` | alt 배경 |

상태색(매뉴얼 Callout 등 최소): info `#2563eb` / warn `#b45309` / danger `#b91c1c` / ok `#15803d` (+ 각 bg).

### 타이포 (모듈러 스케일)
13 · 14 · 15 · 16 · 18 · 22 · 28 · 34 · 44 px.
line-height: tight 1.25(제목) / base 1.6(본문). weight: 400/500/600/700.
폰트: system-ui 스택 (Pretendard·Apple SD Gothic Neo 우선).

### 스페이싱 (8pt + 4pt 보조)
4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 104 px.

### 형태
radius: sm 8 / base 10 / pill 100. border-width 1px.

### semantic (역할 토큰)
`--bg` `--bg-alt` `--surface` `--text` `--text-muted` `--text-soft` `--border` `--border-soft` `--brand` `--brand-contrast`.

## 갱신 규칙
섹션이 늘 때마다 필요한 토큰만 누적. 빅뱅 정의 금지. 다크 값은 후순위(훅만 유지).
