/* ============================================================
   core/packs/krds/motion.js — KRDS 모션 (⑤층)
   정부·공공 = 절제·기능적. 짧은 duration, ease-out, 은은한 등장.
   과한 글로우/패럴랙스 없음. reduced-motion 존중.
   ============================================================ */
export function motion(level = 'subtle') {
  if (level === 'static') return { css: '', js: '' };
  const dist = level === 'rich' ? 16 : 10;
  const dur = level === 'rich' ? '.5s' : '.4s';
  return {
    css: `
    .krds .rise{opacity:0;transform:translateY(${dist}px);transition:opacity ${dur} ease-out,transform ${dur} ease-out}
    .krds .rise.in{opacity:1;transform:none}
    .krds .btn{transition:background .15s ease-out,border-color .15s ease-out}
    .krds .card{transition:border-color .15s ease-out,box-shadow .15s ease-out}
    @media (prefers-reduced-motion:reduce){.krds .rise{opacity:1;transform:none}}`,
    js: `<script>
    (function(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'-32px'});
    document.querySelectorAll('.krds .rise').forEach(function(el){io.observe(el)});})();
    <\/script>`,
  };
}
