# MIDAS Web Generator — 앱 디자인 시스템 (v2, Webflow-inspired)

> **개정**: 2026-07-22
> 앱(제너레이터 도구) 셸 크롬 DS. **생성 출력 스타일 팩(에테르/바이올렛/엠버)과 별개.**
> 구현: `app/ds.css` + `app/theme.js` — 진입·프로젝트·워크스페이스 공유.

## 원칙

1. **near-black + 화이트 캔버스.** 주 CTA·헤딩·워드마크 = `#080808`(라이트). 배경 = 화이트. 절제된 엔지니어링 무드(Webflow 참고).
2. **하나의 시스템, 라이트/다크 두 테마.** `<html data-theme="light|dark">`. 컴포넌트는 제네릭 토큰(`--canvas`,`--ink`,`--primary`,`--hairline`,`--accent`)만 참조 → 진입~생성 채팅까지 한 제품. 토글 = `theme.js`(localStorage `midas-theme`).
3. **타이포 = Inter**(WF Visual Sans 대체) 400/500/600. **weight 상한 600**(700+ 금지). 디스플레이 네거티브 트래킹. 대문자 eyebrow.
4. **shape 절제.** 버튼·인풋·칩·배지 = **4px**(`--r-sm`). 카드 = **8px**(`--r-md`). pill은 아이콘 컨테이너·진행점만.
5. **5색 크로매틱 액센트**(purple/pink/blue/orange/green) = 표면 채우기·카테고리용. 주 CTA엔 안 씀(near-black 유지).
6. 출력물(생성 페이지)은 이 크롬 DS 안 따름 — 선택 스타일 팩이 지배.

## 토큰 (`app/ds.css`)

**타이포:** `--font`(Inter+Pretendard), mono(Inconsolata). display-xxl 64 / xl 52 / lg 44 / md 32 / sm 24 / xs 20, eyebrow 13(대문자·트래킹 .12em), body-lg 20 / body 16 / body-sm 14, caption 12.8/550, button. weight reg400·med500·semi600.
**스페이싱:** 4·8·12·16·20·24·32·40·48·64.
**라디우스:** xs2·sm4(버튼)·md8(카드)·pill.
**크로매틱:** `--a-purple #7a3dff · a-pink #ed52cb · a-blue #3b89ff · a-orange #ff6b00 · a-green #00d722` + info #146ef5 / yellow #ffae13 / red #ee1d36.
**섀도우:** `--shadow-2`(카드 리프트), `--shadow-3`(강조).

### 테마별 색

| 토큰 | light | dark |
|---|---|---|
| `--canvas` / `--canvas-2` | #fff / #fafafa | #080808 / #101010 |
| `--surface` | #fff | #111 |
| `--hairline` / `-strong` | #e2e2e2 / #d0d0d0 | white/.14 / .24 |
| `--ink` / `--body` / `--mute` | #080808 / #363636 / #898989 | #fff / white.74 / white.42 |
| `--primary` / `--on-primary` (주 CTA) | #080808 / #fff | #fff / #080808 |
| `--accent` (포커스·링크) | #146ef5 | #4d92ff |

## 컴포넌트 (`ds-*` 클래스)

`.ds-body` · `.ds-wordmark`(MIDAS 볼드 + Web Generator 뮤트) · `.ds-eyebrow`(대문자) · `.ds-btn`(`.primary`=near-black/화이트, `.ghost`, 4px) · `.ds-input`(4px, 포커스 accent 링) · `.ds-card`(8px, hairline) · `.ds-chip`(`.on`=primary) · `.ds-badge`(`.soft`) · `.ds-dots` · `.ds-theme`(테마 토글).

## 적용

| 화면 | 파일 | 비고 |
|---|---|---|
| 온보딩(종류→정보→스타일) | `app/index.html` | 카드 썸네일(단일=1장/다중=팬), 사업군(전사·SK·엔솔·개인), 사업군별 스타일 추천 배지 |
| 내 프로젝트 | `app/projects.html` | **실제 페이지 라이브 렌더 썸네일** · 이름변경 · 삭제 |
| 워크스페이스·제너레이터 | `app/studio/studio.html` | 좌 페이지레일 + 챗 + 프리뷰. 크롬 flat near-black, 프리뷰만 다크글로우 출력 |

라이트/다크 토글은 세 화면 모두 상단에 있고 상태 공유.

## 후속

- 스튜디오 프리뷰의 pack 스와치/출력은 스타일 팩 영역(별개 유지).
- 크로매틱 5색을 사업군/카테고리에 더 매핑(현재 진입 카드 tint에만).
- 배포·클라우드 저장.
