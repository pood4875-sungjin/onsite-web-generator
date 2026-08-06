---
name: new-web-pack
description: 새 웹/랜딩 스타일팩(packs.X.js) 추가 절차. 고정 TEMPLATE 자기조립, DEMO/DEMO_EN, 4언어 라벨, 섹션 컨트롤, 배선 7곳, 검증. "새 랜딩 팩", "웹 스타일 추가", "세미나 팩" 요청 시 사용.
---

# 새 웹/랜딩 스타일팩 추가

PPT 팩과 다름: 웹 팩은 **고정 TEMPLATE 자기조립** — `renderXPage(shared, {volume, motion})`이 완성 HTML 반환. PAGE_TYPES 라우팅 안 씀(랜딩 전용 정체성). mbm·axday·orbit 포크가 기본.

## 1. 팩 파일 계약 (`app/packs.X.js`)

- `renderXPage(shared, opts)` + `X_SECTION_SPEC` export
- 데이터: compose-web 평면 스키마(features·stats·sessions·eventDate/Place·deadline·faq·ctaTitle·formTitle…) + `DEMO`(KO)/`DEMO_EN` 폴백 쌍 — `LANG==='ko'?DEMO:DEMO_EN`(KO 예시가 EN 페이지에 새는 것 방지)
- 템플릿 고정 라벨(폼·FAQ 헤더·일시/장소 등)은 `TT` 사전 **ko/en/ja/zh 4언어** — 번역 파이프라인을 안 타므로 팩이 직접
- `LANG = shared._clang` 기준. CJK(ja/zh)면 Noto Sans JP/SC **1순위** 폰트 링크 + 히어로 라이트 500(300은 한자에서 실낱)
- 타이틀 강약 `mixT()`: `**마커**` 우선 → 여러 줄=첫 줄 라이트+이후 `<b>` → 한 줄 공백有=앞 50% 라이트 → CJK는 글자 45%+구두점 스냅
- 전 텍스트 `data-edit`, 버튼은 텍스트+링크 편집 계약
- 섹션: movable 섹션에 `data-section` + `sectionOrder`/`hiddenSections` 조립. **tier 명칭은 core/mid/rich**('compact'는 volume명 — 섞으면 섹션 추가 바가 전 섹션을 나열함)
- 이미지: onerror 2단 폴백(로컬→프로드→제거), 공유 스냅샷은 studio `absAssets`가 절대화
- 잠금 필드(시연 고정)는 `shared._touched` 필드 단위로 양보

## 2. 배선 7곳

1. 스크립트 로드: `index.html` + `studio.html`(라인 10 배열)
2. `index.html` 웹 `STYLES` 배열(피커 카드)
3. `index.html` `recStyles`(추천 정규식 매핑)
4. `studio.html` 팩 해석 체인
5. `studio.html` `renderWith` 분기
6. `index.html` `styleThumb`(스타일 카드 실렌더 썸네일 — 미배선이면 try/catch가 삼켜 빈 카드)
7. `dashboard/projects` `renderForStyle`/`styleName`(썸네일)

## 3. 함정

- 스튜디오에 데모 심을 땐 `chat.log`에 봇 한 줄 + `chat.generated:true` — 로그 비면 빈 인테이크 오버레이가 덮음
- `.ob-tt+*` 같은 마진이 뒤따르는 `margin:0 auto` **쇼트핸드에 죽는다**(동특이도 후행 승) — 쇼트핸드 자체에 값을 넣을 것
- canvas는 absolute+inset으로 크기 안 잡힘(replaced) — width/height 명시
- GNB 앵커는 실제 섹션 id와 일치, 빈 링크 필터
- 반응형: `word-break:keep-all` + ≤960/≤600 티어, 모바일 CTA 우측 정렬 관례

## 4. 검증

```bash
node --check app/packs.X.js
# compose-web 실호출 — 첨부 필드(sessions·eventDate·faq)가 실제 반영되는지
curl -sS -X POST https://webgen-ppt-proxy.ksj0225.workers.dev/compose-web -H 'Content-Type: application/json' \
  -d '{"plan":"...","kind":"single","lang":"en"}'
```
- 브라우저 하네스(`_verify.html` — 검증 후 삭제): KO/EN/JA/ZH 렌더, 데스크탑/모바일, 모션 on/off, 이미지 폴백
- 편집 모드에서 텍스트 클릭 저장·섹션 이동 실동작 확인
