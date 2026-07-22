/* file:// 가드 — 파일 직접 열면 ES 모듈이 CORS로 막혀 페이지가 죽음.
   죽은 화면 대신 "서버로 열어라" 안내를 띄운다. classic script라 file://서도 로드됨. */
(function () {
  if (location.protocol !== 'file:') return;
  var URL = 'http://localhost:4788/app/index.html';
  function mount() {
    var t = (localStorage.getItem('midas-theme') || 'light') === 'dark';
    var bg = t ? '#080808' : '#ffffff', fg = t ? '#ffffff' : '#080808';
    var mute = t ? 'rgba(255,255,255,.55)' : '#666', line = t ? 'rgba(255,255,255,.12)' : '#e2e2e2';
    var o = document.createElement('div');
    o.style.cssText = 'position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;'
      + 'background:' + bg + ';color:' + fg + ';font-family:Inter,Pretendard,system-ui,sans-serif;text-align:center';
    o.innerHTML =
      '<div style="max-width:440px">'
      + '<div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:' + mute + ';margin-bottom:14px">MIDAS Web Generator</div>'
      + '<h2 style="font-weight:600;font-size:24px;margin:0 0 12px">서버로 열어주세요</h2>'
      + '<p style="color:' + mute + ';line-height:1.7;font-size:15px;margin:0 0 20px">'
      + '파일을 직접 열면 <code style="background:' + line + ';padding:2px 6px;border-radius:4px">file://</code> 라서 클릭이 동작하지 않아요.<br>'
      + '터미널에서 아래 실행 후 링크로 여세요.</p>'
      + '<pre style="background:' + line + ';border-radius:8px;padding:14px 16px;font-size:13px;text-align:left;overflow:auto;margin:0 0 18px">'
      + 'cd ~/onsite-web-generator\npython3 serve.py</pre>'
      + '<a href="' + URL + '" style="display:inline-block;background:' + fg + ';color:' + bg
      + ';text-decoration:none;font-weight:500;font-size:14px;padding:10px 20px;border-radius:4px">localhost:4788 로 열기 →</a>'
      + '</div>';
    document.body.appendChild(o);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
