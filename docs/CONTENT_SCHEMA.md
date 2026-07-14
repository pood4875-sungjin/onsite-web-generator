# CONTENT_SCHEMA.md — 기획 입력 구조

> 기획 내용을 어떤 구조로 입력받는지 정의. 폼(MVP)·AI(고도화)가 공통으로 채우는 `PageDoc`. ⬜ 작성 중.

## PageDoc
```jsonc
{
  "pageType": "product" | "manual",
  "meta": { "title": "", "description": "", "lang": "ko" },
  "sections": [
    { "type": "hero", "variant": "split", "slots": { ... }, "visible": true }
  ]
}
```

- `sections[]` 순서 = 렌더 순서.
- 각 `slots`는 해당 섹션의 `slotSchema`(SECTION_PATTERN.md)를 따른다.
- 렌더러 계약: `render(pageDoc, sectionDefs) -> HTML(string)` — 순수·결정론.

## TODO
- [ ] 섹션별 slotSchema 를 JSON Schema 로 정식화
- [ ] 필수/선택·기본값·타입(text/richtext/image/list/link) 정의
- [ ] 폼 자동생성 규칙 (slotSchema -> 입력 폼)
