/* shell.js — 대시보드·프로젝트·템플릿 공용 SNB + GNB. 단일 소스라 항상 동일.
   사용: 페이지에 <div data-snb></div> 와 <div data-gnb></div> 두고
   mountShell('home'|'projects'|'resources', {onSearch, searchValue}) 호출. classic script.
   문자열은 i18n.js(t())로 로컬라이징 — 언어 전환은 SNB 하단 스위처(전역·리로드). */
(function () {
  var HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/></svg>';
  var FOLDER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h3.4l2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>';
  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/></svg>';
  var SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>';
  var GRID = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>';
  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><ellipse cx="12" cy="12" rx="4.1" ry="9"/><path d="M5.6 7.2c3.9 1.7 9 1.7 12.9 0"/><path d="M5.6 16.8c3.9-1.7 9-1.7 12.9 0"/></svg>';
  var SHAPES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="3.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><path d="M8 14l4 6H4z"/><rect x="13.5" y="14" width="6.5" height="6.5" rx="1.5"/></svg>';
  // 아이콘 레지스트리(icons.js)가 있으면 거기서, 없으면 인라인 폴백
  function ic(name, fb) { return (window.icon && window.ICON && window.ICON[name]) ? window.icon(name, {}) : fb; }
  // 아이콘은 SNB 메뉴로 노출하지 않음 — 레지스트리(icons.js)는 백그라운드에서 플랫폼 아이콘 소스로만 사용.
  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>';
  var ITEMS = [['home', 'dashboard.html', '홈', ic('home', HOME)], ['projects', 'projects.html', '프로젝트', ic('folder', FOLDER)], ['resources', 'resources.html', '템플릿', ic('grid', GRID)], ['assets', 'assets.html', '리소스', SHAPES], ['settings', 'settings.html', '설정', GEAR]];

  function tt(ko) { return (window.L ? window.L(ko) : ko); }
  function curCode() { var l = (window.I18N ? I18N.getLang() : 'ko'); var m = { ko: 'KO', en: 'EN', ja: 'JA', zh: 'ZH' }; return m[l] || l.toUpperCase(); }

  function snbHTML(active) {
    var nav = ITEMS.map(function (it) {
      var on = it[0] === active ? ' on' : '';
      var noop = it[1] === '#' ? ' onclick="return false"' : '';
      return '<a class="item' + on + '" href="' + it[1] + '"' + noop + '>' + it[3] + '<span data-i18n="' + it[2] + '">' + tt(it[2]) + '</span></a>';
    }).join('');
    return '<aside class="snb"><b class="ds-wordmark">MIDAS <span>DRS</span><sup class="ds-beta">beta</sup></b>'
      + '<nav class="grp"><div class="gl" data-i18n="메뉴">' + tt('메뉴') + '</div>' + nav + '</nav>'
      + footHTML() + '</aside>';
  }
  function footHTML() {
    var langs = (window.I18N ? I18N.LANGS : [['ko', '한국어']]).map(function (L) {
      var on = (window.I18N && L[0] === I18N.getLang()) ? ' on' : '';
      return '<button class="lang-opt' + on + '" data-lang="' + L[0] + '">' + L[1] + '</button>';
    }).join('');
    return '<div class="snb-foot">'
      + '<button id="themeBtn" class="foot-ic" title="Theme" aria-label="Theme"></button>'
      + '<div class="lang-wrap"><button id="langBtn" class="foot-ic" title="' + tt('언어') + '" aria-haspopup="true">' + ic('globe', GLOBE) + '<span class="lang-cur">' + curCode() + '</span></button>'
      + '<div class="lang-pop" id="langPop">' + langs + '</div></div>'
      + '</div>';
  }
  function gnbHTML(searchValue) {
    return '<div class="gnb-bar"><div class="search">' + ic('search', SEARCH)
      + '<input id="shellSearch" data-i18n-ph="프로젝트 검색" placeholder="' + tt('프로젝트 검색') + '" value="' + (searchValue || '').replace(/"/g, '&quot;') + '"></div>'
      + '<a class="ds-btn primary" href="index.html" style="padding:9px 16px;font-size:14px"><span data-i18n="＋ 새 프로젝트 생성">' + tt('＋ 새 프로젝트 생성') + '</span></a></div>';
  }

  window.mountShell = function (active, opts) {
    opts = opts || {};
    var snbSlot = document.querySelector('[data-snb]');
    var gnbSlot = document.querySelector('[data-gnb]');
    if (snbSlot) snbSlot.outerHTML = snbHTML(active);
    if (gnbSlot) gnbSlot.outerHTML = gnbHTML(opts.searchValue);
    // 재배선 (outerHTML 교체 후)
    var tb = document.getElementById('themeBtn');
    if (tb && window.mountThemeToggle) mountThemeToggle(tb);
    var si = document.getElementById('shellSearch');
    if (si && opts.onSearch) { si.oninput = function () { opts.onSearch(si.value); }; if (opts.searchValue) si.focus(); }
    // 언어 스위처
    var lb = document.getElementById('langBtn'), pop = document.getElementById('langPop');
    if (lb && pop) {
      lb.onclick = function (e) { e.stopPropagation(); pop.classList.toggle('open'); };
      document.addEventListener('click', function () { pop.classList.remove('open'); });
      pop.querySelectorAll('.lang-opt').forEach(function (b) {
        b.onclick = function () { if (window.I18N) { I18N.setLang(b.getAttribute('data-lang')); location.reload(); } };
      });
    }
    // 페이지 내 [data-i18n] 번역 적용
    if (window.I18N) I18N.apply(document);
  };
})();
