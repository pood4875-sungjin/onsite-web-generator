/* shell.js — 대시보드·프로젝트 공용 SNB + GNB. 단일 소스라 항상 동일.
   사용: 페이지에 <div data-snb></div> 와 <div data-gnb></div> 두고
   mountShell('home'|'projects', {onSearch, searchValue}) 호출. classic script. */
(function () {
  var HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/></svg>';
  var FOLDER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h3.4l2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>';
  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/></svg>';
  var SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>';

  var ITEMS = [['home', 'dashboard.html', '홈', HOME], ['projects', 'projects.html', '프로젝트', FOLDER], ['settings', '#', '설정', GEAR]];

  function snbHTML(active) {
    var nav = ITEMS.map(function (it) {
      var on = it[0] === active ? ' on' : '';
      var noop = it[1] === '#' ? ' onclick="return false"' : '';
      return '<a class="item' + on + '" href="' + it[1] + '"' + noop + '>' + it[3] + it[2] + '</a>';
    }).join('');
    return '<aside class="snb"><b class="ds-wordmark">MIDAS <span>WEB AX</span></b>'
      + '<nav class="grp"><div class="gl">메뉴</div>' + nav + '</nav>'
      + '<div class="snb-foot"><button id="themeBtn"></button><span class="tl">테마 전환</span></div></aside>';
  }
  function gnbHTML(searchValue) {
    return '<div class="gnb-bar"><div class="search">' + SEARCH
      + '<input id="shellSearch" placeholder="프로젝트 검색" value="' + (searchValue || '').replace(/"/g, '&quot;') + '"></div>'
      + '<a class="ds-btn primary" href="index.html" style="padding:9px 16px;font-size:14px">＋ 새 프로젝트 생성</a></div>';
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
  };
})();
