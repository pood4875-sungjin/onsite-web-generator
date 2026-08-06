---
name: add-slide-type
description: 기존 PPT 팩에 슬라이드 타입 추가(예: machine의 shot). 렌더러+CSS+계약 문서+AI 스키마+PPTX 추출 배선. "슬라이드 타입 추가", "이런 장표 넣어줘", "차트/이미지 장 추가" 요청 시 사용.
---

# 기존 PPT 팩에 슬라이드 타입 추가

새 팩 전체가 아니라 **타입 하나** 추가할 때. 배선 누락 = AI가 그 타입을 모르거나, 렌더는 되는데 PPTX 추출이 빈다.

## 절차 (7단계 전부)

1. **렌더러**: 팩의 `R = { ... }`에 `newtype: function (s, P, ctx) {...}` — 모든 텍스트에 `de(P + '.필드경로')`(data-edit), `esc()`/`mb()` 이스케이프, 이미지는 `aurl()` + onerror 폴백. 파일명 필드는 sanitize(`replace(/[^a-zA-Z0-9._-]/g,'')`)
2. **CSS**: 같은 파일 CSS 배열에 `.slide.접두` 스코프로. 콘텐츠가 짧을 수 있는 타입은 세로 중앙(`margin:auto 0`)
3. **CATALOG**: `{ type, label(한글), use(언제 쓰나) }` 항목 추가 — 스튜디오 '+ Add' 바가 이걸 읽음
4. **FIELD_DOC / USE_DOC**: 팩 상수에 필드 계약 추가 — 이게 곧 AI 스키마. 필수 필드는 "필수·빈 값 금지"
5. **llm.js**: 해당 팩 `X_ALLOWED`에 `newtype: 1`(없으면 _parseEdit가 걸러버림)
6. **worker.js**: `X_FIELD_DOC`/`X_USE_DOC` 문자열에 동일 계약 반영(클라와 서버 문서는 별도 사본!) + 배포
7. **export-pptx.js**: `TEXT_SEL`에 텍스트 셀렉터, 도형·이미지는 `SHAPE_SEL` — 안 하면 PPTX에서 그 장이 빔

## 검증

```bash
node --check app/packs.X.js
# 타입을 강제 포함한 브리프로 실호출 → 해당 타입 반환·필드 확인
```
- 하네스 렌더(KO+EN) → 레이아웃·이미지·data-edit 클릭 편집 확인 → 하네스 삭제
- PPTX 내보내기 1회 — 새 타입 장이 텍스트/도형으로 추출되는지

## 함정

- USE_DOC에 쓴 한국어 예시 구절을 AI가 타이틀로 복사한다 — 언어 중립으로
- `kind(s,'라벨')` 기본 라벨은 영문으로(로컬라이징 지뢰)
- 이미지 타입은 file:// 환경 고려 — aurl의 프로드 폴백 확인
- 잠금 팩(naver·rams·machine)이면 `X_SYSTEM` 잠금본에도 타입 반영해야 실제로 나옴
