# 스타일팩 인벤토리 & 문서 포맷

팩 소스 위치(2026-08-06 재구성):

```
packs/
  ppt/   PPT 팩  — packs.naver.js rams machine pastel sfmi pitch honors ppt
  web/   웹/랜딩 팩 — packs.mbm.js axday toss orbit saturn aether krds midas
  edm/   eDM 팩  — packs.edm.js
```

로드 지점(경로 바꾸면 전부 수정): `index` `studio/studio` `dashboard` `projects` `resources` `settings` `icons` 7페이지의 스크립트 배열.
팩은 레포 루트 — currentScript 기반 BASE는 `replace(/packs\/(ppt|web|edm)\/$/,'app/')`로 자산(app/bg) 기준 복원(axday·mbm·machine·honors).

## 인벤토리

| 팩 | 종류 | 표시명 | 상태 | 문서 |
|---|---|---|---|---|
| naver | PPT | Minimal | **활성·시연 잠금**(아너스데이 10장) | [packs.naver.md](../../packs/ppt/packs.naver.md) |
| rams | PPT | Modern | **활성·시연 잠금**(GEN NX 10장) | [packs.rams.md](../../packs/ppt/packs.rams.md) |
| machine | PPT | Premium Dark | **활성·시연 잠금**(GEN NX 10장·주황) | [packs.machine.md](../../packs/ppt/packs.machine.md) |
| pastel | PPT | Pastel Gradient | 활성(피커 숨김 — 시연 중 machine으로 교체) | 팩 옆 .md |
| sfmi | PPT | SFMI Report | 활성(피커 밖) | 팩 옆 .md |
| pitch | PPT | Creatable Pitch | 활성(피커 밖) | 팩 옆 .md |
| honors | PPT | MIDAS Honors | 활성(피커 밖) | 팩 옆 .md |
| ppt | PPT | 기본(ax) | 레거시 폴백 | 팩 옆 .md |
| mbm | 웹 | Civil Blue | **활성·시연 잠금**(GNB·히어로) | [packs.mbm.md](../../packs/web/packs.mbm.md) |
| axday | 웹 | Ensol MBM | **활성·시연 잠금**(GNB·eyebrow·히어로·사진) | [packs.axday.md](../../packs/web/packs.axday.md) |
| orbit | 웹 | Global MBM | **활성·시연 잠금**(GNB·히어로) | [packs.orbit.md](../../packs/web/packs.orbit.md) |
| toss | 웹 | 챌린지 화이트 | 유지(피커 제외) | 팩 옆 .md |
| saturn | 웹 | Saturn 블루 | 레거시(기존 프로젝트 열람용) | 팩 옆 .md |
| aether/krds/midas | 웹 | 팩 옆 .md | 레거시(기존 프로젝트 열람용) | 팩 옆 .md |
| edm | eDM | 팩 옆 .md | 활성(eDM 플로우) | 팩 옆 .md |

시연 잠금의 원리·해제는 `.claude/skills/demo-lock/SKILL.md`.

**문서 위치 규칙: 팩 = JS(실행) + MD(규칙·디자인 DNA) + sample.html(실물 표본, 자동 생성)** — 팩 JS 옆에 같은 이름으로 둔다(packs.X.js ↔ packs.X.md — 팩을 추출·공유할 때 쌍으로 집어가면 됨). 이 README는 인벤토리 인덱스만.

## 팩 문서 공통 포맷 (신규 문서는 이 순서 고정)

1. **정체** — 실측 소스, 룩앤필 한 줄
2. **상태** — 활성/피커 노출/잠금 여부
3. **구성 어휘** — 슬라이드 타입 or 섹션 목록
4. **데이터 계약** — 필드 스키마 요점
5. **고정 요소** — 잠금·핀 자산(해제 방법 포함)
6. **특이 규칙·함정** — 이 팩에서만 밟는 지뢰
7. **배선** — 이 팩이 걸려 있는 파일 지점

새 팩 추가 절차는 `.claude/skills/new-ppt-pack` / `new-web-pack` 스킬.
