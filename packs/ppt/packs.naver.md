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

## 디자인 DNA (스타일 이식용 — 이 절만 다른 AI에 넘겨도 됨)

- **무드**: 네이버식 클린 화이트 + 챕터별 파스텔 틴트 지면. 정보 밀도 높지만 여백 넉넉.
- **팔레트**: 베이스 #FFFFFF · 시그니처 그린 #00DE5A · 챕터컬러 5종(보라 #A97BDE / 블루 #4FB4E9 / 틸 #63C6C0 / 그린 #00DE5A / 코랄 #FF6B4A) — 간지 순서대로 자동 순환, 각 챕터는 포인트+틴트 배경(bg) 세트로 적용.
- **타이포**: Pretendard(CJK는 Noto Sans SC/JP 1순위). 타이틀 = 라이트+**볼드** 강약, 헤드라인 좌측 컬러 바. 러닝헤더 12px 대문자 자간 넓게.
- **모티프**: 아이소메트릭 라인 SVG(커버 나침반 등), 얇은 룰 라인, 페이지 번호 우상단.
- **금지**: 이모지, 무배경 원색 덩어리, 챕터컬러 혼용(한 장 = 한 챕터색).
