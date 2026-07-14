# COMPONENT_RULE.md — 컴포넌트 규칙

> 섹션을 구성하는 기본 UI 컴포넌트. 8월 코드화 대상. ⬜ 작성 중.

## 기준
- 컴포넌트는 `styles/tokens.css` 토큰만 사용. raw 값 금지.
- 전 상태(default/hover/focus/disabled) 정의. 접근성(포커스링·대비·키보드) 필수.
- 섹션은 컴포넌트를 조합할 뿐, 새 스타일을 만들지 않는다.

## 목록 (초안)
| 컴포넌트 | 상태/변형 | 비고 |
|---|---|---|
| Button | primary / default / lg · hover | `.btn` (global.css 구현됨) |
| Card | default · hover | 보더+radius, 그림자 없음 |
| Badge / Eyebrow | — | `.eyebrow` (구현됨) |
| Tab | on/off | Feature 섹션 |
| Accordion | open/closed | FAQ·Troubleshooting |
| Callout | info/warn/danger/ok | 매뉴얼 |

## TODO
- [ ] 각 컴포넌트 HTML/CSS/JS 단위 구현 (`components/`)
- [ ] 상태·접근성 명세
