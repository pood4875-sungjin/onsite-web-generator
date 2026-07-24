# 디자인 팩 저작 표준 (PACK_AUTHORING)

> 앞으로 **모든 디자인 팩**은 이 표준을 따른다. KRDS = 이 표준의 **레퍼런스 구현**(`core/packs/krds/`).
> 기계 검사: [`core/packs/spec.js`](../core/packs/spec.js) `validatePack()`. 스캐폴드: [`core/packs/_template/`](../core/packs/_template/).

## 0. 큰 그림 (쉽게)
생성기 = **붕어빵 틀**(고정). 팩 = **반죽**(무한 다양). 이 문서 = **반죽 만드는 표준 레시피 양식**.
표준을 지키면 반죽 100개를 만들어도 다 같은 틀에 들어가고, 확인창(인스펙터)이 알아서 펼쳐 보여준다.

**두 개의 약속(계약)이 표준의 뼈대:**
1. **부품 이름 통일** — 모든 팩이 색·글자·선 같은 토큰을 **같은 이름**으로 쓴다(①).
2. **칸 내용 고정** — 섹션마다 넣는 콘텐츠 항목을 **고정**한다(②). → 콘텐츠 한 번 쓰면 어떤 팩에도 부어짐.

## 1. 팩 = 6층 자산 (파일 구조)
`core/packs/<id>/` (스캐폴드 복사). 큰 팩은 아래처럼 파일 분리, 작으면 한 파일도 가능.

| 층 | 파일 | 내용 |
|---|---|---|
| ① 파운데이션 | `foundation.js` | **표준 토큰 키셋** 전부 + 인스펙터 docs |
| ② 레이아웃 | `layout.js` | container · gutter · **breakpoints** · 반응형 유틸 CSS |
| ③ 모션 | `motion.js` | `motion(level)` → static/subtle/rich |
| ④ 컴포넌트 | `components.js` | button·link·badge·card(+α) · CSS · gallery |
| ⑤ 섹션 | `sections.js` | **6 섹션 타입** 렌더러(슬롯 읽어 조립) · CSS |
| — | `pack.js` | 위를 묶어 계약 구현체 export |

## 2. ① 표준 토큰 키셋 (필수 — 전부 채운다)
`spec.ALL_TOKEN_KEYS`. semantic CSS 변수. 팩 컴포넌트/섹션은 **오직 이 변수만** 참조(raw 값 금지).

- **color**: `--brand --brand-hover --brand-weak --on-brand · --ink --ink-2 --muted --soft · --bg --bg-2 --line --line-2 · --info(-bg) --warn(-bg) --danger(-bg) --ok(-bg)`
- **radius**: `--radius-xs --radius-sm --radius --radius-lg`
- **border**: `--bw`
- **type**: `--fs-display --fs-h1 --fs-h2 --fs-h3 --fs-body --fs-body-sm --fs-label --fs-cap --lh --lh-tight`
- **font**: `--font --font-mono`
- **shadow**: `--shadow-1 --shadow-2`

> 팩만의 추가 토큰(그라디언트·글로우 등)은 자유롭게 더해도 됨. 단 **표준 키셋은 반드시 다 채운다.**

## 3. ② 섹션 타입별 표준 콘텐츠 슬롯 (생성기 ↔ 팩 계약)
`spec.SECTION_SLOTS`. 생성기가 이 모양으로 콘텐츠를 넣고, 팩은 이 슬롯을 읽는다. 6타입 전부 구현 필수.

| 섹션 | 슬롯 |
|---|---|
| `nav` | `links[]`, `primaryCta`, `secondaryCta` |
| `hero` | `eyebrow`, `title`, `subcopy`, `primaryCta`, `secondaryCta` |
| `feature` | `eyebrow`, `title`, `items[{icon,title,desc}]` |
| `stat` | `items[{value,label}]` |
| `cta` | `title`, `subcopy`, `primaryCta`, `secondaryCta` |
| `footer` | `columns[{h,items[]}]` |

> 슬롯 미지정 시 팩은 플레이스홀더로 폴백(빈 화면 금지).

## 4. ③ 필수 컴포넌트 킷
`spec.REQUIRED_COMPONENTS` = `button · link · badge · card` (최소). 상태(hover 등) 포함.
섹션은 반드시 이 컴포넌트로 조립 — 섹션에서 즉석 스타일 남발 금지(일관성).

## 5. 충실도 규칙 (필수)
- **소스(Figma/브랜드) 실측값만.** 없는 값은 **추측 금지** — 표시하고 멈춰서 물어본다.
- 팩 완성 후 인스펙터 **원본 대조(side-by-side)**로 육안 검증.

## 6. 저작 워크플로 (새 팩 만들 때)
1. `core/packs/_template/` → `core/packs/<id>/` 복사.
2. **소스 실측** → `foundation.js` 표준 키셋 채움(색/타입/radius/폰트/shadow).
3. `layout.js` — container·breakpoints·그리드.
4. `motion.js` — 팩 모션 성격(절제/화려).
5. `components.js` — 표준 컴포넌트 + 팩 고유.
6. `sections.js` — 6타입, 슬롯 읽어 컴포넌트로 조립, 반응형.
7. `pack.js` 묶고 `core/packs/index.js`에 등록.
8. **검증**: `validatePack(pack)` 통과 + 인스펙터에서 파운데이션·컴포넌트·섹션·반응형·원본대조 확인.

## 7. 체크리스트 (머지 전)
- [ ] `validatePack` errors 0
- [ ] 표준 토큰 키셋 전부 채움(실측)
- [ ] 6 섹션 타입 전부 렌더 + 슬롯 준수
- [ ] 필수 컴포넌트 4종 + 상태
- [ ] breakpoints 반응형 동작(390/768/1280)
- [ ] 모션 3레벨 + reduced-motion
- [ ] 인스펙터 원본 대조 육안 부합
- [ ] 추측값 0 (실측 or 보류)

## 8. 현재 팩 상태
| 팩 | 상태 |
|---|---|
| `krds` | 표준 **레퍼런스 구현**. 토큰 실측 시드 + 규약. Figma 리밋 풀리면 컴포넌트 정밀 보정. |
| `darkglow` | **레거시 어댑터**(표준 이전 · 자체 토큰키). 신규 팩은 표준 따를 것. 후속 정규화 대상. |
| `_template` | 스캐폴드(표준 통과하는 빈 뼈대). |
