# 아이콘 리소스

플랫폼 공용 아이콘 소스. 여기 있는 `*.svg` → `node build-icons.cjs` → `app/icons.js`(레지스트리) 생성.

## 추가/교체 방법
1. SVG 파일을 이 폴더에 넣는다. **파일명(케밥) = 아이콘 이름** (예: `arrow-down.svg` → `icon('arrow-down')`).
   - 하위폴더도 가능: `arrows/down.svg` → `icon('arrows/down')`.
   - Figma 등에서 **Export as SVG** 로 뽑아 그대로 드롭하면 됨.
2. 저장소 루트에서 `node build-icons.cjs` 실행.
3. `app/icons.js`가 다시 생성되고, 갤러리(`app/icons.html`)·플랫폼에 즉시 반영.

## 사용
```js
icon('home', { size: 18, cls: 'nav-ic', stroke: 1.7 })  // -> "<svg ...>...</svg>"
iconNames()                                              // -> 전체 이름 배열
window.ICON['home']                                      // 원본 SVG 문자열
```
- 색은 `currentColor`로 정규화됨 → CSS `color`/`stroke`로 제어.
- 빌드 시 루트 `<svg>`의 width/height는 제거되고 `icon()`이 `size`로 주입 (child rect 등의 크기는 보존).

## 현재
초기 시드 = 앱이 쓰던 인라인 아이콘 18종. Iconex 등 대량 세트는 SVG를 이 폴더에 넣고 재빌드하면 누적됨.
