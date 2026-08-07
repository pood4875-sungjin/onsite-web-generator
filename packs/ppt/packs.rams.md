# rams — Modern (PPT)

1. **정체** — Rams Report 포크. 웜그레이·라운드 카드·버밀리언(주황 계열) 단일 액센트·다크/라이트 리듬·큐브 인디케이터.
2. **상태** — 활성, PPT 피커 노출. **시연 잠금**: 클릭=무조건 MIDAS GEN NX 제품소개 10장(cover·statement·toc·divider·section(기능4)·media(실화면)·divider·stats(도넛)·process·closing).
3. **구성 어휘** — naver와 동일 24타입 계열 + milestone 간트. media 장은 실사진(`bg/gennx-1.jpg` 프로드 URL).
4. **데이터 계약** — 서버 `RAMS_SYSTEM`(잠금본)/`RAMS_SYSTEM_FREE`(자유 원본). toc title 필수(빈 값 금지 — '보고 순서' 폴백 사고의 근원).
5. **고정 요소** — `lockDemo`: 표지(**MIDAS GEN NX** 3톤)+선언(MIDAS GEN NX × API × AI)+클로징, 언어별 사전. 해제=`demo-lock` 스킬.
6. **특이 규칙·함정**
   - toc 렌더러 폴백은 `lf()` 언어인지(ko 보고 순서/en Contents/ja 目次/zh 目录) — **하드코딩 한국어 폴백 금지**
   - `CLANG = data._clang` 렌더 진입 시 갱신(deck·viewer 둘 다)
   - zh/ja `cjkHead` — 라이트 클래스 35종 400 상향
7. **배선** — 로드 7페이지 / PPT_VISIBLE / studio 분기 / export-pptx / worker `RAMS_SYSTEM`(+GENNX_FACTS 부착) / llm.js ALLOWED / **LOCK10**


**실물 표본**: [`packs.rams.sample.html`](./packs.rams.sample.html) — 기본 데이터 렌더 + 전체 CSS 내장(자동 생성 `node scripts/pack-spec.cjs`). **스타일 이식·외부 AI 첨부는 이 파일이 정답** — 브라우저로 열면 실물, 소스를 읽으면 전체 스타일 명세.

## 디자인 DNA (스타일 이식용)

- **무드**: Rams식 절제 — 웜 그레이 페이퍼에 잉크, 액센트는 단 하나.
- **팔레트**: 페이퍼 #F5F5F3 · 잉크 #0A0A0A · 액센트 버밀리언 #FF4D00 **단일**(장당 1~2곳만) · 다크 장은 잉크 반전.
- **타이포**: Pretendard. 타이틀 3톤(**볼드**+__딤__+라이트), 다크/라이트 장 리듬 교차.
- **모티프**: 라운드 카드(큰 radius), 큐브 인디케이터, 아이소 그리드 큐브(커버), 도넛 차트.
- **금지**: 두 번째 액센트 컬러, 그라데이션.
