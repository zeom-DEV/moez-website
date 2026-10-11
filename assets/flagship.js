(() => {
  'use strict';
  const captions = ['Un visiteur comprend vos services et à qui ils s’adressent.', 'Je crée les pages, le design et les animations pour mobile et ordinateur.', 'Le visiteur trouve comment vous contacter. Je teste ce parcours avant publication.'];
  document.querySelectorAll('[data-web-demo]').forEach(demo => {
    demo.querySelectorAll('[data-web-stage]').forEach(button => {
      button.addEventListener('click', () => {
        const stage = Number(button.dataset.webStage);
        demo.dataset.stage = String(stage);
        demo.querySelectorAll('[data-web-stage]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        demo.querySelector('[data-web-caption]').textContent = captions[stage];
        demo.querySelector('[data-web-live]').textContent = captions[stage];
      });
    });
  });
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
