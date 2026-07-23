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
  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>';
  var ITEMS = [['home', 'dashboard.html', HOME], ['projects', 'projects.html', FOLDER], ['resources', 'resources.html', GRID], ['settings', '#', GEAR]];

  function tt(k) { return (window.t ? window.t(k) : k); }
  function curCode() { var l = (window.I18N ? I18N.getLang() : 'ko'); var m = { ko: 'KO', en: 'EN', ja: 'JA', zh: 'ZH' }; return m[l] || l.toUpperCase(); }

  function snbHTML(active) {
    var nav = ITEMS.map(function (it) {
      var on = it[0] === active ? ' on' : '';
      var noop = it[1] === '#' ? ' onclick="return false"' : '';
      return '<a class="item' + on + '" href="' + it[1] + '"' + noop + '>' + it[2] + '<span data-i18n="menu.' + it[0] + '">' + tt('menu.' + it[0]) + '</span></a>';
    }).join('');
    return '<aside class="snb"><b class="ds-wordmark">MIDAS <span>WEB AX</span></b>'
      + '<nav class="grp"><div class="gl" data-i18n="menu.menu">' + tt('menu.menu') + '</div>' + nav + '</nav>'
      + footHTML() + '</aside>';
  }
  function footHTML() {
    var langs = (window.I18N ? I18N.LANGS : [['ko', '한국어']]).map(function (L) {
      var on = (window.I18N && L[0] === I18N.getLang()) ? ' on' : '';
      return '<button class="lang-opt' + on + '" data-lang="' + L[0] + '">' + L[1] + '</button>';
    }).join('');
    return '<div class="snb-foot">'
      + '<button id="themeBtn" class="foot-ic" title="Theme" aria-label="Theme"></button>'
      + '<div class="lang-wrap"><button id="langBtn" class="foot-ic" title="' + tt('foot.lang') + '" aria-haspopup="true">' + GLOBE + '<span class="lang-cur">' + curCode() + '</span></button>'
      + '<div class="lang-pop" id="langPop">' + langs + '</div></div>'
      + '</div>';
  }
  function gnbHTML(searchValue) {
    return '<div class="gnb-bar"><div class="search">' + SEARCH
      + '<input id="shellSearch" data-i18n-ph="search.ph" placeholder="' + tt('search.ph') + '" value="' + (searchValue || '').replace(/"/g, '&quot;') + '"></div>'
      + '<a class="ds-btn primary" href="index.html" style="padding:9px 16px;font-size:14px"><span data-i18n="gnb.new">' + tt('gnb.new') + '</span></a></div>';
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
