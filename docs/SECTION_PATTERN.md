# SECTION_PATTERN.md — 섹션 카탈로그

> 웹 구성 섹션 분류 + variant(케이스) + slot 정의. AI가 읽을 기준 문서.
> 실물 프리뷰: [`catalog/product-intro.html`](../catalog/product-intro.html)
> 근거: 실물 3사 교차검증 — 네이버웍스 · 채널톡 · 두레이 (2026-07).

## 기준
- 섹션 = **하나의 목적** (힉의 법칙). 같은 목적의 표현 차이는 `variant`로 분리.
- 각 섹션은 `slotSchema`(입력 필드)를 가지며, 폼/AI 둘 다 이걸 채운다.
- 페이지타입: `common` / `product`(제품소개) / `manual`(매뉴얼).

---

## 공통 (common) — 7
| type | variants | 핵심 slots |
|---|---|---|
| announce | strip | message, link |
| gnb | solid / transparent / cta포함 | logo, navItems[], actions[] |
| faq | accordion / 2col / categorized | items[{q,a}] |
| supportNav | links | items[{label,href,icon}] |
| footer | simple / sitemap / minimal | columns[], copy |
| breadcrumb | inline | items[] *(주로 manual)* |
| cta | banner / card / form결합 | heading, sub, buttons[] |

## 제품소개 (product) — 13  ★실물 검증 완료
| # | type | variants | 핵심 slots |
|---|---|---|---|
| 1 | hero | centered / split / 캐러셀 / 고객사례형 | eyebrow, heading, lead, buttons[], visual, slides[] |
| 2 | productLineup | 2·3·4열 / 아이콘형 / 설명형 | title, sub, items[{name,desc}] |
| 3 | feature | grid / 좌우교차 / 아이콘 / 탭전환 / 멀티디바이스 | title, tabs[{label,heading,body,points[],shot}] |
| 4 | benefit | 3-up / 교차강조 / 풀블리드 | title, items[{n,heading,body}] |
| 5 | process | 가로번호 / 세로타임라인 / 스테퍼 | title, steps[{n,heading,body}] |
| 6 | industry ★ | 그리드 / 탭 / 캐러셀 | title, items[{name,desc}] |
| 7 | integration | 로고그리드 / 카테고리별 | title, logos[] |
| 8 | trust | 밴드 / 인증마크그리드 / 통계결합 | heading, body, certs[] |
| 9 | stats | 롤링카운터 / 카드 | title, items[{value,suffix,label}], source |
| 10 | testimonial | 단일인용 / 캐러셀 | quotes[{text,who,org}] |
| 11 | logoWall | 로고월 / 업종탭 | title, logos[] |
| 12 | newsroom | 3열카드 / 탭 | title, items[{tag,title,date,thumb}] |
| 13 | ctaFinal | 배너 / 폼결합 / 지원링크형 | heading, sub, buttons[], supportLinks[] |

## 매뉴얼 (manual) — 7  ⬜ 실물 검증 예정 (추정)
| type | variants(초안) | 핵심 slots |
|---|---|---|
| toc | sticky사이드 / 인라인앵커 | items[{label,anchor}] |
| prerequisite | 체크리스트 / 콜아웃 | title, items[] |
| step | 세로번호 / 스샷+텍스트 / 아코디언 | steps[{n,heading,body,media}] |
| callout | info / warning / tip / danger | type, title, body |
| specTable | key-value / 비교표 | rows[{key,value}] |
| troubleshooting | 아코디언 / 증상-원인-해결 표 | items[{symptom,cause,solution}] |
| media | 캡션이미지 / 비디오 / 코드블록 | kind, src, caption |

---

## TODO
- [ ] 매뉴얼 실물 검증(헬프센터 레퍼런스) → variants 확정
- [ ] 각 섹션 slotSchema 를 JSON 스키마로 정식화 (`CONTENT_SCHEMA.md` 연동)
- [ ] 9월 MVP 핵심셋 선별 (공통7 + 제품소개 6~7)
