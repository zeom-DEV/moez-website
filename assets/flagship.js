(() => {
  'use strict';
  const scenes = [...document.querySelectorAll('.motion-scene')], visible = new Set();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  function update() {scenes.forEach(scene => scene.classList.toggle('is-in-view', visible.has(scene) && !document.hidden && !motion.matches));}
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      update();
    }, {threshold: .15});
    scenes.forEach(scene => observer.observe(scene));
  }
  document.addEventListener('visibilitychange', update);
  motion.addEventListener('change', update);
})();
