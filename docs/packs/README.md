# 스타일팩 인벤토리 & 문서 포맷

팩 소스 위치(2026-08-06 재구성):

```
packs/
  ppt/   PPT 팩  — packs.naver.js rams machine pastel sfmi pitch honors ppt
  web/   웹/랜딩 팩 — packs.mbm.js axday toss orbit saturn aether krds midas
  edm/   eDM 팩  — packs.edm.js
```

로드 지점(경로 바꾸면 전부 수정): `index` `studio/studio` `dashboard` `projects` `resources` `settings` `icons` 7페이지의 스크립트 배열.
팩이 하위 폴더로 가면서 currentScript 기반 BASE는 `replace(/packs\/(ppt|web|edm)\/$/,'')`로 app/ 기준 복원(axday·mbm·machine·honors).

## 인벤토리

| 팩 | 종류 | 표시명 | 상태 | 문서 |
|---|---|---|---|---|
| naver | PPT | Design AX Line | **활성·시연 잠금**(아너스데이 10장) | [ppt-naver.md](ppt-naver.md) |
| rams | PPT | Structure style | **활성·시연 잠금**(GEN NX 10장) | [ppt-rams.md](ppt-rams.md) |
| machine | PPT | AX Machine | **활성·시연 잠금**(GEN NX 10장·주황) | [ppt-machine.md](ppt-machine.md) |
| pastel | PPT | Pastel Gradient | 활성(피커 숨김 — 시연 중 machine으로 교체) | 표 참조 |
| sfmi | PPT | SFMI Report | 활성(피커 밖) | 표 참조 |
| pitch | PPT | Creatable Pitch | 활성(피커 밖) | 표 참조 |
| honors | PPT | MIDAS Honors | 활성(피커 밖) | 표 참조 |
| ppt | PPT | 기본(ax) | 레거시 폴백 | — |
| mbm | 웹 | Civil Blue | **활성·시연 잠금**(GNB·히어로) | [web-mbm.md](web-mbm.md) |
| axday | 웹 | Ensol MBM | **활성·시연 잠금**(GNB·eyebrow·히어로·사진) | [web-axday.md](web-axday.md) |
| orbit | 웹 | Global MBM | **활성·시연 잠금**(GNB·히어로) | [web-orbit.md](web-orbit.md) |
| toss | 웹 | 챌린지 화이트 | 유지(피커 제외) | — |
| saturn | 웹 | Saturn 블루 | 레거시(기존 프로젝트 열람용) | — |
| aether/krds/midas | 웹 | — | 레거시(기존 프로젝트 열람용) | — |
| edm | eDM | — | 활성(eDM 플로우) | — |

시연 잠금의 원리·해제는 `.claude/skills/demo-lock/SKILL.md`.

## 팩 문서 공통 포맷 (신규 문서는 이 순서 고정)

1. **정체** — 실측 소스, 룩앤필 한 줄
2. **상태** — 활성/피커 노출/잠금 여부
3. **구성 어휘** — 슬라이드 타입 or 섹션 목록
4. **데이터 계약** — 필드 스키마 요점
5. **고정 요소** — 잠금·핀 자산(해제 방법 포함)
6. **특이 규칙·함정** — 이 팩에서만 밟는 지뢰
7. **배선** — 이 팩이 걸려 있는 파일 지점

새 팩 추가 절차는 `.claude/skills/new-ppt-pack` / `new-web-pack` 스킬.
