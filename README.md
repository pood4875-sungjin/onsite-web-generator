# ONSITE Web Generator

기획 내용을 섹션 단위로 입력하면, 사전 정의된 디자인 시스템·컴포넌트·섹션 패턴을 기준으로
**온사이트 제품소개·매뉴얼 웹페이지를 조립·생성**하는 빌드리스 웹앱.

> KR4 — AX 디자인 제너레이터 구축 · 7~12월 로드맵
> 상세: [docs/SPEC.md](docs/SPEC.md) · 과제 원문: [docs/BRIEF.html](docs/BRIEF.html)

---

## 원칙 (비타협)

**콘텐츠 모델(JSON) ↔ 렌더러(결정론 템플릿) 분리.**
MVP = 사람이 폼으로 `PageDoc` 채움 · 고도화 = AI가 같은 `PageDoc` 채움 · 렌더러는 동일.
→ 섹션/컴포넌트 CSS는 `styles/tokens.css`의 토큰만 참조. raw 값 금지.

## 폴더 구조

```
onsite-web-generator/
├─ docs/                  기준 문서 (7월 TASK1 산출물)
│  ├─ BRIEF.html          과제 원문
│  ├─ SPEC.md / .html     설계 스펙
│  ├─ DESIGN_SYSTEM.md    DS 기준 (토큰 근거)
│  ├─ SECTION_PATTERN.md  섹션 카탈로그 (variant·slot 정의)  ← 작성 중
│  ├─ COMPONENT_RULE.md   컴포넌트 규칙
│  ├─ CONTENT_SCHEMA.md   기획 입력 구조
│  └─ TEMPLATE_STRUCTURE.md  템플릿 프리셋 구조
├─ styles/
│  ├─ tokens.css          DS v0 토큰 (primitive → semantic)
│  └─ global.css          리셋 + 기본 타입 + 버튼
├─ components/            기본 UI (Button·Card·Badge·Accordion …)   ← 8월
├─ sections/             섹션 패턴 구현 (HeroSection·FeatureSection …) ← 8월
├─ templates/            페이지 프리셋 (productIntro·manual .json)   ← 8월
├─ sample/               샘플 콘텐츠 (onsite-product-intro.json …)
└─ catalog/
   └─ product-intro.html 제품소개 13섹션 실물 카탈로그 (미니멀 v0)
```

## 진행 상태

| 시기 | 진척률 | 상태 |
|---|---|---|
| 7월 | 10% | 🟡 진행 — 섹션 분류(제품소개 13 확정), DS v0 토큰, 카탈로그 프리뷰 |
| 8월 | 25% | ⚪ 렌더러 + 섹션 라이브러리 코드화 |
| 9월 | 45% | ⚪ 웹앱 MVP + 매뉴얼 섹션 |

### 지금까지 (7월)
- ✅ 제품소개 섹션 분류 — 실물 3사 교차검증(네이버웍스·채널톡·두레이) → **13섹션**
- ✅ DS v0 토큰 (`styles/tokens.css`) — 미니멀 흑백
- ✅ 제품소개 카탈로그 실물 (`catalog/product-intro.html`)
- ⬜ 매뉴얼 섹션 분류 (실물 검증 예정)
- ⬜ `docs/SECTION_PATTERN.md` 풀스펙 (variant·slot)

## 미리보기

```bash
# 정적 파일 — 서버 불필요. 브라우저로 바로 열기
open catalog/product-intro.html
```
