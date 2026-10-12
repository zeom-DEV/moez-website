(() => {
  'use strict';
  const cards = [...document.querySelectorAll('[data-profile-fact]')];
  if (!cards.length || !('IntersectionObserver' in window)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-seen');
      observer.unobserve(entry.target);
    }
  }, {rootMargin: '0px 0px -36px 0px', threshold: .2});
  cards.forEach((card, index) => {
    card.style.setProperty('--fact-order', String(index));
    observer.observe(card);
  });
})();