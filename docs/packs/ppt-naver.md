# naver — Design AX Line (PPT)

1. **정체** — 네이버 스타일 실측(PDF "PPT 템플릿 제작 요청" 1~10장). 화이트·그린 포인트·챕터컬러 5종 자동상속·아이소 SVG(나침반 커버).
2. **상태** — 활성, PPT 피커 노출. **시연 잠금**: 아너스데이 10장 템플릿(cover·statement·section2열·toc·divider×2·table·process·cards(5열,title필수)·stats) — 텍스트만 교체.
3. **구성 어휘** — 독자 11+타입(cover statement section toc divider table process cards stats …). 챕터컬러는 간지 순서 자동.
4. **데이터 계약** — `**굵게**` 마크업, cards는 title 필수 4~5개, stats=도넛+바. 서버 `NAVER_SYSTEM`(잠금본)/원본 보존.
5. **고정 요소** — `lockDemo`: 표지 타이틀만 언어별 고정(아너스데이/Honors Day/オナーズデイ/荣誉日). 본문은 첨부 기반. 해제=`demo-lock` 스킬.
6. **특이 규칙·함정**
   - `__fitSlide` 자동축소: **넘친 장만** 래핑 + 원본 flex 레이아웃 복제(무조건 래핑=커버 2단 붕괴)
   - CJK 잘림은 `overflow-wrap:anywhere`, zh/ja는 `cjkHead`(Noto 1순위+라이트 400)
   - 표지 언어 = 내용 비율 판정(EN 덱의 한국어 인명에 안 속게)
7. **배선** — 로드 7페이지 / index `PPT_VISIBLE` / studio packMode·renderDeckFor·뷰어 / dashboard·projects renderForStyle / export-pptx `.cv-l` SHAPE_SEL / worker `NAVER_SYSTEM` / llm.js `NAVER_ALLOWED`·_parseEdit / **LOCK10**(llm.js·studio 잘린 스트림 방어 목록)
