(() => {
  'use strict';
  const group = document.getElementById('details-offres');
  if (!group) return;
  const panels = [...group.querySelectorAll('.offer-detail')];
  const cards = [...document.querySelectorAll('[data-offer-link]')];
  const ids = new Set(panels.map(panel => panel.id));
  function sync(focus = false) {
    const id = location.hash.slice(1);
    panels.forEach(panel => {
      const selected = panel.id === id;
      panel.classList.toggle('is-active', selected);
      panel.setAttribute('aria-hidden', String(!selected));
    });
    cards.forEach(card => {
      if (card.hash === '#' + id) card.setAttribute('aria-current', 'location');
      else card.removeAttribute('aria-current');
    });
    if (!focus) return;
    const target = ids.has(id) ? document.getElementById(id) :
      id === 'offres' ? document.getElementById('offers-five-title') : null;
    if (target) {
      target.tabIndex = -1;
      target.scrollIntoView({behavior: 'instant', block: 'start'});
      target.focus({preventScroll: true});
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname ||
        url.search !== location.search) return;
    const id = url.hash.slice(1);
    if (!ids.has(id) && id !== 'offres') return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    sync(true);
  });
  window.addEventListener('popstate', () => sync(true));
  window.addEventListener('hashchange', () => sync(true));
  sync(ids.has(location.hash.slice(1)));
})();
