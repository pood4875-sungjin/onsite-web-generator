---
name: demo-lock
description: 시연(데모) 잠금 걸기/풀기 절차. 팩 출력 고정(누가 뽑아도 동일), 잠금 지점 지도(워커·PPT 팩·랜딩 팩), 우선순위 규칙, 해제 체크리스트. "시연 잠금", "고정해줘", "잠금 풀어" 요청 시 사용.
---

# 시연 잠금 / 해제

목표: **AI 생성·번역이 몇 번을 돌아도 동일 출력**. 단 사용자 직접 편집은 반영.

## 우선순위 (절대 규칙)

**AI 생성·번역 < 고정 문구 < 사용자 직접 편집**
- 채팅 수정 → `data._userTouched=true`(덱 전체 양보)
- 인라인 편집 → `setField`가 장/필드 단위 `_touched` 마킹
- 재생성(`startLiveCompose`) → 플래그 리셋 = 잠금 원복

## 잠금 지점 지도

### 워커 (proxy/worker.js) — 구성·내용 고정
- `X_SYSTEM`을 "정확히 N장, 이 순서·타입, 텍스트만" 지시로 교체. 원본은 `X_SYSTEM_FREE`로 보존(해제=이름 되돌리기)
- 제품 팩트는 `GENNX_FACTS`류 상수를 시스템 끝에 부착 — "공식 정보만, 지어내기 금지"
- pack 유실 방어: `/compose`의 `_pk` 폴백(브리프 정규식 매칭) + 스튜디오 라이브 브리프 pack 보충
- title류 "필수·빈 값 금지", 사례 "창작 금지" 명시
- 배포: `cd proxy && npx wrangler deploy` (전파 ~30초 — 직후 테스트 실패는 전파 창일 수 있음)

### PPT 팩 (packs.naver/rams/machine.js) — 문구 글자 단위 고정
- `lockDemo(slides, clang, touched)` — 표지·선언·클로징을 **언어별 사전(ko/en/ja/zh)** 문구로 교체
- 언어는 **내용 비율 판정**(기록 _clang은 보조) — EN 덱의 한국어 인명에 속지 않음
- null 슬라이드 가드(`if (!s || s._touched) return s`) — 라이브 스트림 중 터짐 방지
- 잘린 스트림 방어: 잠금 팩 10장 미만 = 실패 처리 → 재시도. **새 잠금 팩은 llm.js와 studio.html의 LOCK10 두 곳에 추가**

### 랜딩 팩 (packs.axday/mbm/orbit.js) — 필드 고정
- 데이터 병합 직후 강제: `d.navTitle` `d.eyebrow` `d.tagline`(언어별 사전) — 단 `shared._touched.필드`면 양보
- 이미지 고정: `PIN_MID`(중간 사진 시퀀스), 히어로 기본 자산(`DUBAI` 등)

## 해제 체크리스트 (시연 끝나면)

1. 워커: `X_SYSTEM` ← `X_SYSTEM_FREE` 이름 복원 + 배포
2. PPT 팩: `lockDemo` 호출 제거(함수는 남겨도 무해)
3. 랜딩 팩: 강제 3줄(navTitle/eyebrow/tagline) 제거
4. `PPT_VISIBLE`·웹 STYLES 원복(피커에서 뺀 팩 복원 — index.html 주석 참조)
5. E2E: 자유 브리프로 생성해 잠금 문구가 안 나오는지 확인
