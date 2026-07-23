/* modal.js — 디자인된 센터 딤 모달. 시스템 prompt/confirm/alert 대체. classic script.
   window.uiConfirm(msg,{title,okText,danger}) -> Promise<bool>
   window.uiPrompt(msg,{title,value,placeholder,okText}) -> Promise<string|null>
   window.uiAlert(msg,{title}) -> Promise */
(function () {
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function L(k){ return window.L ? window.L(k) : k; }
  function open(opts) {
    return new Promise(function (resolve) {
      var scrim = document.createElement('div'); scrim.className = 'modal-scrim';
      var m = document.createElement('div'); m.className = 'modal';
      m.innerHTML =
        '<div class="modal-h">' + esc(opts.title || '') + '</div>' +
        (opts.message ? '<div class="modal-b">' + esc(opts.message) + '</div>' : '') +
        (opts.input ? '<input class="ds-input modal-i" placeholder="' + esc(opts.placeholder || '') + '">' : '') +
        '<div class="modal-f">' +
          (opts.cancel === false ? '' : '<button class="ds-btn ghost modal-cancel">' + esc(opts.cancelText || L('취소')) + '</button>') +
          '<button class="ds-btn primary modal-ok' + (opts.danger ? ' danger' : '') + '">' + esc(opts.okText || L('확인')) + '</button>' +
        '</div>';
      scrim.appendChild(m); document.body.appendChild(scrim);
      var inp = m.querySelector('.modal-i');
      if (inp) { inp.value = opts.value || ''; setTimeout(function () { inp.focus(); inp.select(); }, 30); }
      var done = false;
      function close(val) { if (done) return; done = true; scrim.classList.remove('on'); setTimeout(function () { scrim.remove(); }, 170); document.removeEventListener('keydown', onKey); resolve(val); }
      function onKey(e) { if (e.key === 'Escape') close(opts.input ? null : false); else if (e.key === 'Enter' && (opts.input || opts.cancel === false)) { e.preventDefault(); close(opts.input ? inp.value : true); } }
      m.querySelector('.modal-ok').onclick = function () { close(opts.input ? inp.value : true); };
      var c = m.querySelector('.modal-cancel'); if (c) c.onclick = function () { close(opts.input ? null : false); };
      scrim.onclick = function (e) { if (e.target === scrim) close(opts.input ? null : false); };
      document.addEventListener('keydown', onKey);
      requestAnimationFrame(function () { scrim.classList.add('on'); });
    });
  }
  window.uiConfirm = function (message, opts) { opts = opts || {}; return open({ title: opts.title || L('확인'), message: message, okText: opts.okText || L('확인'), cancelText: opts.cancelText, danger: opts.danger }); };
  window.uiPrompt = function (message, opts) { opts = opts || {}; return open({ title: opts.title || message, message: opts.title ? message : '', input: true, value: opts.value, placeholder: opts.placeholder, okText: opts.okText || L('저장') }); };
  window.uiAlert = function (message, opts) { opts = opts || {}; return open({ title: opts.title || L('알림'), message: message, cancel: false, okText: L('확인') }); };
})();
