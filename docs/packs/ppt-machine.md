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
