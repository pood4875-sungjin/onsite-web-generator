# Ensol MBM 랜딩 팩 (packs.ensol.js)

## 1. 정체
CIVIL NX 2026 릴리즈 이벤트 씨드(packs.ensol.sample.html)의 팩화. 릴리즈·웨비나·행사 집객 랜딩 전용.
제미나이 블루 그라(--btng/--txtg/--txtgB) · 잉크 #222 · 다크 #040308 · radius 0 · 컨테이너 1320.

## 2. export
`renderEnsolPage(shared, {volume, motion})` · `ENSOL_SECTION_SPEC` · `ENSOL_STYLE`(id 'ensol', 표시명 "Ensol MBM").

## 3. 구성(고정 TEMPLATE)
GNB(글래스→솔리드) → KV 핀 320vh(영상 풀블리드 → 글자 스태거 → 스케일다운 아웃 → 다크닝+블러 → 미션 멘트 스케일업 인)
→ [movable] answer → skill → feature → agenda → faq → free → 고정 register(오로라 폼) → footer → dock → 드로어.

## 4. 데이터 매핑 (compose-web 평면 스키마)
| 섹션 | 필드 |
|---|---|
| GNB | navTitle(로고)·navLinks(4)·primaryCta |
| KV | tagline(h1, \n 줄분해+글자 스태거, 글자폭 추정 연속 자동 스케일 --h1s/--h1sm·마지막 줄만 볼드)·subcopy(klead)·eventDate·메타 스트립 3번째=eventPlace 1행(기획)/bannerText(데모) |
| 미션 멘트 | TT 4언어 고정 카피(주제 불문 범용 — 도메인 용어 금지) + productName 치환(**마커**→.gt 그라) |
| answer | features 0-2 (title 2줄 권장·desc) + 키비주얼 ensol-kv4/3/2 로테이션 |
| skill 탭 | zigs 0-4 (cap=탭 라벨·title=소제목·desc=본문) + ensol-skill1~5 |
| feature | benefits 0-2 (cap 캡션·title 2줄·link 행동 문구) + mbmtoss 실사 3종 |
| agenda | sessions (time·title·by) — 드로어 주입(window.__ensolAgenda) |
| register | 고정 폼 7필드(TT 라벨) + productName·formTitle·deadline(ISO8601이면 언어별 'M월 D일 HH:MM 마감' 자동 포맷)·eventDate |
| faq | faq (q·a) |
| free | ctaTitle(\n 마지막 줄 .gt)·ctaSub·primaryCta + 데이터 웨이브 |
| dock | 기획 데이터면 bannerText/bannerCta 중 긴 쪽(짧은 CTA는 go 버튼과 중복)·eventDate·primaryCta |

모든 슬롯 필드 단위 DEMO(KO)/DEMO_EN 폴백 — 빈 섹션·빈 텍스트 없음. 기획 데이터(hasBrief)면 데모 전용 요소를 범용 전환: 토목 실사→추상 키비주얼, footerBrand→productName, GNB 라벨→TT nav.
이미지 전부 data-img 슬롯(images.answerN/skillN/featureN) — 스튜디오 교체·AI 생성·되돌리기 지원.

## 5. 섹션 컨트롤
movable: answer/skill/feature/agenda/faq/free (tier core/mid). fixed: dock. sectionOrder·hiddenSections 계약.
숨김 조합 안전: 씨드 JS에 섹션별 존재 가드(스킬·어젠다 블록 래핑, answer 오버랩, snav 필터, 웨이브).

## 6. 언어
LANG=shared._clang(ko/en/ja/zh). 템플릿 고정 라벨(TT)·미션 멘트 4언어. 데모 KO/EN 쌍.

## 7. 재생성
씨드 수정 → 스크래치패드 build-ensol-pack.py 재실행(씨드 CSS/JS 추출·가드 가공·팩 재조립).
주의: 씨드의 해당 앵커 문자열이 바뀌면 어셈블러 assert가 멈춘다(의도된 동기화 장치).
