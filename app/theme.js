/* 라이트/다크 테마 토글 — localStorage 'midas-theme' */
const THEME_KEY = 'midas-theme';
const SUN = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';

export function currentTheme(){ return document.documentElement.getAttribute('data-theme') || 'light'; }
export function setTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem(THEME_KEY, t); refresh(); }
export function toggleTheme(){ setTheme(currentTheme() === 'dark' ? 'light' : 'dark'); }

function refresh(){ document.querySelectorAll('[data-theme-toggle]').forEach(b => { b.innerHTML = currentTheme() === 'dark' ? SUN : MOON; b.title = currentTheme()==='dark'?'라이트 모드':'다크 모드'; }); }

export function mountThemeToggle(el){ el.classList.add('ds-theme'); el.setAttribute('data-theme-toggle',''); el.onclick = toggleTheme; refresh(); }

/* FOUC 방지: <head>에서 즉시 호출용 */
export function applySavedTheme(){ document.documentElement.setAttribute('data-theme', localStorage.getItem(THEME_KEY) || 'light'); }
