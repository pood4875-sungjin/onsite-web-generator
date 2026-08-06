# machine — AX Machine (PPT)

1. **정체** — 네이버스타일(3).pdf 19장 실측. 다크·포인트 **주황 #FF5500**(원래 그린 — 시연 스왑)·영문 빅타이포·포토 커버·게이지.
2. **상태** — 활성, PPT 피커 노출. **시연 잠금**: GEN NX 제품소개 10장(cover·statement·toc·twocol·shot×2(실스크린샷)·bignum·refcards(공식사례)·beforeafter·closing).
3. **구성 어휘** — 독자 18+타입(nx- 접두). `shot`=좌 rows(첫 행 다크 강조)+우 실스크린샷 `<figure class="nx-shimg">`.
4. **데이터 계약** — `shot:{title,sub?,img("gennx-*.jpg"),rows:[{tag,text}],caption?}`. bignum·refcards title 필수. 서버 `MACHINE_SYSTEM`/`_FREE`.
5. **고정 요소** — `lockDemo` 표지·선언·클로징 언어별 사전. 커버 64px+오버플로 축소 가드. shot img 기본 gennx-1/4. 그린→주황 전면 스왑 상태. 해제=`demo-lock` 스킬.
6. **특이 규칙·함정**
   - `aurl`: BASE가 file://면 프로드 강제 + shot onerror 2단(프로드 재시도→제거) — "완료 순간 이미지 실종" 방지
   - img 필드는 sanitize + fixBrand `_FB_SKIP`(파일명 오염 금지)
   - 뷰어 커버 축소 가드는 **숨김 장 스킵**(rect=0 오판 전과)
   - bignum·refcards 그리드 세로 중앙(`margin:auto 0`)
7. **배선** — 로드 7페이지 / PPT_VISIBLE / studio 분기 / export-pptx `.nx-shrow`·figcaption TEXT_SEL / worker `MACHINE_SYSTEM`(+GENNX_FACTS) / llm.js `MACHINE_ALLOWED`(shot 포함) / **LOCK10**


**실물 표본**: [`packs.machine.sample.html`](./packs.machine.sample.html) — 기본 데이터 렌더 + 전체 CSS 내장(자동 생성 `node scripts/pack-spec.cjs`). **스타일 이식·외부 AI 첨부는 이 파일이 정답** — 브라우저로 열면 실물, 소스를 읽으면 전체 스타일 명세.

## 디자인 DNA (스타일 이식용)

- **무드**: 다크 테크 + 영문 빅타이포. 제품 실스크린샷이 주인공.
- **팔레트**: 잉크 #14181F(다크 지면·텍스트) · 화이트 지면 교차 · 포인트 #FF5500(시연 스왑 상태 — 원판은 그린 #40C057) · 보조 회색 #6D6F74.
- **타이포**: 커버 64px·헤드라인 44px, 영문 3톤(**800 볼드** + __딤 34%__ + 300 라이트). 러닝헤더 12px 대문자 자간 .2em. CJK 라이트는 400.
- **모티프**: 풀블리드 포토 커버(딤 오버레이), 좌 rows/우 스크린샷(shot), 대형 넘버 01~04, 게이지.
- **금지**: 이모지, 번호 재기입(자동 부여), 포인트색 남용(장당 소량).
