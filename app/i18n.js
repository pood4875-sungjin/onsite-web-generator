/* i18n.js — 앱 UI 전역 로컬라이징 (KO/EN/JA/ZH). classic script.
   전역 언어는 localStorage('midas-lang'). 전환 시 페이지 리로드 → 모든 페이지 반영.
   사용: [data-i18n="key"] 텍스트 / [data-i18n-ph="key"] placeholder → I18N.apply(root).
         JS 생성물은 t('key')로 직접. */
(function () {
  var LANGS = [['ko', '한국어', 'KO'], ['en', 'English', 'EN'], ['ja', '日本語', 'JA'], ['zh', '中文', 'ZH']];
  var DICT = {
    ko: {
      'menu.menu': '메뉴', 'menu.home': '홈', 'menu.projects': '프로젝트', 'menu.resources': '템플릿', 'menu.settings': '설정',
      'search.ph': '프로젝트 검색', 'gnb.new': '＋ 새 프로젝트 생성',
      'foot.lang': '언어',
      'dash.status': '프로젝트 현황', 'dash.recent': '최근 프로젝트',
      'dash.total': '전체 프로젝트', 'dash.month': '이번 달 생성', 'dash.deploy': '배포 완료', 'dash.html': 'HTML 내보내기',
      'dash.total.sub': '진행 중 · 완료', 'dash.month.sub': '이번 달 기준', 'dash.deploy.sub': '배포 기능 준비 중', 'dash.html.sub': '생성 완료 시 가능',
      'proj.title': '내 프로젝트', 'filter.all': '전체', 'filter.single': '단일 페이지', 'filter.multi': '다중 페이지',
      'proj.empty': '아직 프로젝트가 없어요.', 'proj.selectAll': '전체 선택', 'proj.delSel': '선택 삭제',
      'res.title': '템플릿', 'res.lead': '템플릿으로 시작해 다음 프로젝트를 빠르게 만들어보세요.',
      'create.lang': '사이트 언어', 'create.lang.hint': '생성될 페이지의 언어'
    },
    en: {
      'menu.menu': 'Menu', 'menu.home': 'Home', 'menu.projects': 'Projects', 'menu.resources': 'Templates', 'menu.settings': 'Settings',
      'search.ph': 'Search projects', 'gnb.new': '＋ New project',
      'foot.lang': 'Language',
      'dash.status': 'Project status', 'dash.recent': 'Recent projects',
      'dash.total': 'Total projects', 'dash.month': 'Created this month', 'dash.deploy': 'Deployed', 'dash.html': 'HTML export',
      'dash.total.sub': 'in progress · done', 'dash.month.sub': 'this month', 'dash.deploy.sub': 'deploy coming soon', 'dash.html.sub': 'available once generated',
      'proj.title': 'My projects', 'filter.all': 'All', 'filter.single': 'Single page', 'filter.multi': 'Multi page',
      'proj.empty': 'No projects yet.', 'proj.selectAll': 'Select all', 'proj.delSel': 'Delete selected',
      'res.title': 'Templates', 'res.lead': 'Start from a template and build your next project fast.',
      'create.lang': 'Site language', 'create.lang.hint': 'Language of the generated page'
    },
    ja: {
      'menu.menu': 'メニュー', 'menu.home': 'ホーム', 'menu.projects': 'プロジェクト', 'menu.resources': 'テンプレート', 'menu.settings': '設定',
      'search.ph': 'プロジェクト検索', 'gnb.new': '＋ 新規プロジェクト',
      'foot.lang': '言語',
      'dash.status': 'プロジェクト状況', 'dash.recent': '最近のプロジェクト',
      'dash.total': '全プロジェクト', 'dash.month': '今月の作成', 'dash.deploy': 'デプロイ完了', 'dash.html': 'HTML書き出し',
      'dash.total.sub': '進行中 · 完了', 'dash.month.sub': '今月分', 'dash.deploy.sub': 'デプロイ機能は準備中', 'dash.html.sub': '生成完了後に可能',
      'proj.title': 'マイプロジェクト', 'filter.all': 'すべて', 'filter.single': '単一ページ', 'filter.multi': '複数ページ',
      'proj.empty': 'プロジェクトがまだありません。', 'proj.selectAll': 'すべて選択', 'proj.delSel': '選択を削除',
      'res.title': 'テンプレート', 'res.lead': 'テンプレートから始めて、次のプロジェクトを素早く作りましょう。',
      'create.lang': 'サイト言語', 'create.lang.hint': '生成ページの言語'
    },
    zh: {
      'menu.menu': '菜单', 'menu.home': '首页', 'menu.projects': '项目', 'menu.resources': '模板', 'menu.settings': '设置',
      'search.ph': '搜索项目', 'gnb.new': '＋ 新建项目',
      'foot.lang': '语言',
      'dash.status': '项目概况', 'dash.recent': '最近项目',
      'dash.total': '全部项目', 'dash.month': '本月创建', 'dash.deploy': '已部署', 'dash.html': 'HTML 导出',
      'dash.total.sub': '进行中 · 已完成', 'dash.month.sub': '本月', 'dash.deploy.sub': '部署功能准备中', 'dash.html.sub': '生成后可用',
      'proj.title': '我的项目', 'filter.all': '全部', 'filter.single': '单页', 'filter.multi': '多页',
      'proj.empty': '还没有项目。', 'proj.selectAll': '全选', 'proj.delSel': '删除所选',
      'res.title': '模板', 'res.lead': '从模板开始，快速构建下一个项目。',
      'create.lang': '网站语言', 'create.lang.hint': '生成页面的语言'
    }
  };
  var KEY = 'midas-lang';
  function getLang() { return localStorage.getItem(KEY) || 'ko'; }
  function setLang(l) { localStorage.setItem(KEY, l); try { document.documentElement.setAttribute('lang', l); } catch (e) {} }
  function t(k) { var l = getLang(); return (DICT[l] && DICT[l][k]) || DICT.ko[k] || k; }
  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
  }
  // 최초 로드 시 <html lang> 반영
  try { document.documentElement.setAttribute('lang', getLang()); } catch (e) {}
  window.I18N = { getLang: getLang, setLang: setLang, t: t, apply: apply, LANGS: LANGS };
  window.t = t;
})();
