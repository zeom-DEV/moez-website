(() => {
  'use strict';
  const reel = document.querySelector('[data-tilted-grid]');
  if (!reel) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  let visible = false;
  const update = () => reel.classList.toggle('is-visible', visible && !document.hidden && !reduced.matches && !connection?.saveData);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      update();
    }, {threshold: .12});
    observer.observe(reel);
  } else { visible = true; update(); }
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener?.('change', update);
  connection?.addEventListener?.('change', update);
})();
