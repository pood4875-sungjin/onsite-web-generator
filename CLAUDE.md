# MIDAS DRS / AX Design Generator — 프로젝트 규칙

buildless 정적 SPA. 빌드 도구·번들러·프레임워크 없음 — 클래식 `<script src>` + window 전역.
팩(스타일팩) = 파운데이션부터 모션까지 **완전 자기완결** 파일 1개. 생성기는 얇은 오케스트레이터.

## 구조

- `app/` — 전 화면(index=홈·인테이크, studio/=편집 스튜디오, dashboard, projects, resources, settings) + `llm.js`(AI 클라이언트) + `export-pptx.js` + `charts.js`
- `packs/`(레포 루트) — **독립 디자인 자산**: ppt/·web/·edm/ 스타일팩(자기완결 단일 파일 — 그대로 추출해 다른 도구·세션에 첨부 가능). 인벤토리·팩별 규칙 = `docs/packs/README.md`
- 팩 로드 지점 7페이지(index·studio·dashboard·projects·resources·settings·icons) — 경로 바꾸면 전부 수정 + currentScript BASE strip 확인
- `proxy/worker.js` — Cloudflare Worker. 프롬프트 조립·모델·토큰 전부 서버 통제. **API 키는 여기(secret)에만**
- `app/bg/` — 이미지 자산. 프로드 경로 `https://midas-drs.pages.dev/app/bg/...`
- `core/`+`scripts/build.cjs` → `app/bundle.js` 생성(직접 편집 금지 이유). `scripts/` = 빌드·점검 CLI(check-i18n 등)
- `sources/` — 팩 실측 원본·참고 자료(로컬 전용, gitignore)
- 새 팩 추가 → `.claude/skills/new-ppt-pack` 또는 `new-web-pack` 스킬 참조

## 배포 (푸시 ≠ 배포)

```bash
# 사이트(수동 — GitHub 연동 없음, 레포 루트에서)
npx wrangler pages deploy . --project-name=midas-drs --commit-dirty=true
# 워커
cd proxy && npx wrangler deploy
```
- 커밋은 로컬까지만. **push는 사용자가 명시로 요청할 때만**
- `git add -A` 금지 — 파일 지정
- `bundle.js` 직접 편집 금지(소스 편집 후 역동기화)
- 사용자는 스튜디오를 **file://** 로도 연다 — 로컬 디스크 수정이 곧 반영이지만 탭 강력 새로고침 필요

## 워커 계약 (proxy/worker.js)

- 라우트: `/compose`(PPT) `/compose-web` `/edit` `/edit-web` `/translate` `/intake` — 전부 `POST`, 응답 `{text}`
- 모델: compose·edit = sonnet(품질) / **intake·translate = haiku(속도)**. 라우트별 분기 유지
- 팩별 잠금 프롬프트: `X_SYSTEM`(잠금본) / `X_SYSTEM_FREE`(자유 구성 원본 보존). 해제 = 이름 되돌리기
- 잠금 덱(naver·rams·machine)은 **정확히 10장** — 클라(llm.js·studio)가 10장 미만이면 잘린 스트림으로 판정해 재시도
- 스트리밍 = Anthropic raw SSE 패스스루(compose 계열만)

## 언어(_clang) 규칙 — 사고 다발 지역

- 덱/사이트 데이터의 `_clang` = 산출물 언어 기록. 생성·번역 시 갱신
- **잠금 문구·폴백의 언어는 기록보다 "내용"이 진실** — 비율 기반 판정(EN 덱의 한국어 인명 몇 자에 속지 말 것)
- 렌더 경로(본문·썸네일·라이브·뷰어)에 `_clang` 반드시 동봉 — 빼먹으면 리스트/본문 언어가 어긋난다
- **렌더러에 `|| '한국어문구'` 하드코딩 폴백 금지** — 로컬라이징 지뢰. 검수: `grep -r "|| '[가-힣]" packs/`
- CJK(zh·ja): **Noto Sans SC/JP를 폰트 1순위로**(Pretendard가 흔한 한자를 일부 갖고 있어 글자별 혼합됨) + 라이트 300은 한자에서 실낱 — 랜딩 500·PPT 400으로 상향

## 잠금(시연 고정) 우선순위

**AI 생성·번역 < 고정 문구 < 사용자 직접 편집**
- 채팅 수정 = `data._userTouched`(덱 전체 양보), 인라인 편집 = 장/필드 단위 `_touched`
- 재생성(startLiveCompose) 시 플래그 리셋 → 잠금 원복

## 번역 파이프라인 (llm.js)

- `_noHeavy`(dataURI·images 키 제거) → 3장 청크 병렬 → `_mergeBack`(원본에 텍스트만 재결합) → `_fixBrand`
- 청크·통짜 각 1회 자동 재시도. 응답은 `{payload:{...}}` 래핑/비래핑 **양쪽 수용**(haiku가 래핑 지시 무시)
- 실패 전과 3건: ①업로드 dataURI 토큰 초과 ②translate max_tokens 축소로 웹 통짜 잘림 ③payload 래핑 불일치

## 표기 (fixBrand가 자가치유하지만 소스에서도 준수)

- **MIDAS GEN NX** (GEN NX 단독 금지) · 신해경화(신제경화 X) · 라강림(뤄장린 X) · 인명·고유명사는 첨부 원문 그대로
- fixBrand는 파일명·img·src 필드는 건드리지 않는다(`_FB_SKIP`)

## 검증 문화

- 추측 금지. 워커는 **curl 실호출**, 렌더는 **브라우저 하네스**(레포 루트에 `_verify*.html` 임시 생성 → 검증 → 삭제)로 실측
- JS 수정 후 `node --check`. 이미지 관련은 눈검증
- **커밋 자동 검수**: `.githooks/pre-commit` → `node scripts/check.cjs`(문법 전수·활성 팩 한국어 폴백·core 테스트). 불합격=커밋 차단. 새로 클론하면 `git config core.hooksPath .githooks` 1회 필요
- 타이틀 강약: 첫 줄 라이트 → 둘째 줄부터 볼드(mixT). `**마커**` 우선, CJK는 글자 기준 분할
