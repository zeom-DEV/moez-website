(() => {
  'use strict';
  const group = document.getElementById('details-offres'), carousel = document.getElementById('services-carousel');
  if (!group || !carousel) return;
  const panels = [...group.querySelectorAll('.offer-detail')];
  const choices = [...carousel.querySelectorAll('[data-offer-link]')];
  const ids = panels.map(panel => panel.id), names = choices.map(choice => choice.querySelector('strong').textContent);
  let current = 0;
  function sync(focus = false, announce = false) {
    const id = location.hash.slice(1);
    const index = ids.indexOf(id);
    if (index !== -1) current = index;
    else if (id === 'offres' || id === 'services-carousel' || !id) current = 0;
    panels.forEach((panel, index) => {
      const selected = index === current;
      panel.classList.toggle('is-active', selected);
      panel.setAttribute('aria-hidden', String(!selected));
      panel.inert = !selected;
    });
    choices.forEach((choice, index) => {
      if (index === current) choice.setAttribute('aria-current', 'location');
      else choice.removeAttribute('aria-current');
    });
    // When a visitor follows a direct link or the browser Back button, keep
    // the photographic hero synchronized with the actual detailed service.
    if (index !== -1) window.dispatchEvent(new CustomEvent('mt:orbit-go', {detail:{id:ids[current].replace('solution-', '')}}));
    carousel.querySelector('[data-carousel-count]').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(ids.length).padStart(2, '0');
    if (index !== -1 || id === 'offres' || id === 'services-carousel' || !id) {
      const brief = document.getElementById('brief-service');
      if (brief && choices[current].dataset.serviceValue) brief.value = choices[current].dataset.serviceValue;
      carousel.dispatchEvent(new CustomEvent('mt:offer-select', {detail: {index: current, open: index !== -1 || id === 'services-carousel'}}));
    }
    if (announce && (index !== -1 || id === 'offres' || id === 'services-carousel')) carousel.querySelector('[data-carousel-live]').textContent = names[current] + ', service ' + (current + 1) + ' sur ' + ids.length + '.';
    if (!focus || (!ids.includes(id) && id !== 'offres' && id !== 'services-carousel')) return;
    const home = id === 'offres';
    const detail = index !== -1;
    const destination = home ? document.getElementById('offers-five-title') : detail ? panels[current] : carousel;
    destination.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    const target = home ? document.getElementById('offers-five-title') : detail ? panels[current].querySelector('h2') : document.getElementById('services-carousel-title');
    if (target) { target.tabIndex = -1; target.focus({preventScroll: true}); }
    if (detail) window.dispatchEvent(new CustomEvent('mt:journey-detail', {detail:{id:ids[current].replace('solution-', ''),index:current}}));
  }
  function select(index, focus = false) {
    const selected = (index + ids.length) % ids.length, hash = '#' + ids[selected];
    if (location.hash !== hash) history.pushState(null, '', hash);
    sync(focus, true);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    const id = url.hash.slice(1);
    if (!ids.includes(id) && id !== 'offres' && id !== 'services-carousel') return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    sync(true, true);
  });
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => select(current - 1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => select(current + 1));
  carousel.addEventListener('mt:wheel-select', event => select(event.detail.index));
  carousel.addEventListener('mt:kinetic-select', event => select(event.detail.index));
  carousel.addEventListener('mt:wheel-details', () => {
    select(current);
    const target = panels[current].querySelector('h2');
    target.tabIndex = -1;
    target.scrollIntoView({behavior: 'instant', block: 'start'});
    target.focus({preventScroll: true});
  });
  choices.forEach((choice, index) => choice.addEventListener('keydown', event => {
    const target = {ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: ids.length - 1}[event.key];
    if (target === undefined || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    select(target);
    choices[current].focus({preventScroll: true});
  }));
  group.querySelectorAll('.offer-graphic').forEach(graphic => {
    let start = null;
    graphic.addEventListener('pointerdown', event => {if (event.pointerType === 'touch') start = {x: event.clientX, y: event.clientY, id: event.pointerId};});
    graphic.addEventListener('pointercancel', () => {start = null;});
    graphic.addEventListener('pointerup', event => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.3) select(current + (dx < 0 ? 1 : -1));
    });
  });
  window.addEventListener('popstate', () => sync(true, true));
  window.addEventListener('hashchange', () => sync(true, true));
  window.addEventListener('mt:discover-solutions', () => {
    if (location.hash !== '#services-carousel') history.pushState(null, '', '#services-carousel');
    sync(true, true);
  });
  carousel.dataset.ready = 'true';
  sync(ids.includes(location.hash.slice(1)) || location.hash === '#services-carousel');
})();
