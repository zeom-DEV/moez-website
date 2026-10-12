(() => {
  'use strict';
  const carousel = document.getElementById('services-carousel');
  const wheel = carousel?.querySelector('[data-works-wheel]');
  if (!wheel) return;
  const canvas = wheel.querySelector('[data-wheel-canvas]');
  const cards = [...wheel.querySelectorAll('[data-wheel-card]')];
  const choices = [...carousel.querySelectorAll('[data-offer-link]')];
  const count = cards.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mod = value => ((value % count) + count) % count;
  const activeChoice = () => Math.max(0, choices.findIndex(choice => choice.hasAttribute('aria-current')));
  let active = activeChoice(), turn = active, targetTurn = active;
  let progress = reduce.matches ? 1 : 0, targetProgress = progress;
  let radius = 220, frame = 0, lastTime = 0, wheelDelta = 0, lastWheel = 0;
  let drag = null, suppressClickUntil = 0;
  const hint = carousel.querySelector('[data-wheel-hint]');
  const center = wheel.querySelector('.works-wheel__center');

  function measure() {
    const gutter = canvas.clientWidth < 460 ? 12 : 20;
    radius = Math.max(60, (canvas.clientWidth - cards[0].offsetWidth) / 2 - gutter);
    canvas.style.setProperty('--wheel-radius', radius + 'px');
    render();
  }
  function render() {
    const full = progress > .995;
    wheel.dataset.wheelMode = progress < .005 ? 'circle' : full ? 'carousel' : 'opening';
    wheel.dataset.wheelSettled = String(Math.abs(targetTurn - turn) < .003 && Math.abs(targetProgress - progress) < .003);
    center.style.opacity = String(Math.max(0, 1 - progress * 2));
    const selected = wheel.querySelector('[data-wheel-selected]');
    const small = canvas.clientWidth < 625 && innerWidth <= 980;
    selected.style.opacity = small ? '1' : String(Math.min(1, progress * 2));
    cards.forEach((card, index) => {
      const ring = index * Math.PI * 2 / count;
      const phase = (index - turn) * Math.PI * 2 / count;
      const degrees = ((phase * 180 / Math.PI + 180) % 360 + 360) % 360 - 180;
      const x = Math.sin(ring) * radius * (1 - progress);
      const y = -Math.cos(ring) * radius * (1 - progress) - Math.sin(phase) * radius * progress;
      const z = (Math.cos(phase) - 1) * radius * progress;
      card.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,' + z.toFixed(2) + 'px) rotateX(' + (degrees * progress).toFixed(2) + 'deg) rotateZ(' + (index * 360 / count * (1 - progress)).toFixed(2) + 'deg) scale(' + (1 + progress * .5).toFixed(3) + ')';
      const chosen = index === active;
      card.dataset.active = String(chosen);
      card.setAttribute('aria-pressed', String(chosen));
      card.setAttribute('aria-label', (chosen && full ? 'Voir les tâches pour : ' : 'Sélectionner : ') + choices[index].querySelector('strong').textContent);
      card.tabIndex = chosen ? 0 : -1;
      card.inert = progress > .85 && Math.abs(degrees) > 90;
    });
    if (hint) hint.textContent = full ? 'Faites défiler ou glissez dans le carrousel pour changer de service.' : 'Faites défiler ou glissez dans la roue pour l’ouvrir.';
  }
  function tick(time) {
    frame = 0;
    const ease = reduce.matches ? 1 : 1 - Math.exp(-Math.min(50, time - (lastTime || time - 16)) / 85);
    lastTime = time;
    progress += (targetProgress - progress) * ease;
    turn += (targetTurn - turn) * ease;
    if (Math.abs(targetProgress - progress) < .002) progress = targetProgress;
    if (Math.abs(targetTurn - turn) < .002) turn = targetTurn;
    render();
    if (progress !== targetProgress || turn !== targetTurn) start();
    else lastTime = 0;
  }
  function start() {
    if (progress !== targetProgress || turn !== targetTurn) wheel.dataset.wheelSettled = 'false';
    if (frame || document.hidden) return;
    if (reduce.matches) {
      progress = targetProgress;
      turn = targetTurn;
      render();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function change(index, open = true) {
    active = mod(index);
    const distance = mod(active - mod(targetTurn) + count / 2) - count / 2;
    targetTurn += distance;
    targetProgress = open || reduce.matches ? 1 : 0;
    wheel.querySelector('[data-wheel-title]').textContent = choices[active].querySelector('strong').textContent;
    wheel.querySelector('[data-wheel-pitch]').textContent = choices[active].dataset.servicePitch;
    wheel.querySelector('[data-wheel-badge]').textContent = active === 0 ? 'OFFRE PHARE' : 'SERVICE ' + String(active + 1).padStart(2, '0') + ' / ' + count;
    start();
  }
  function choose(index) {
    carousel.dispatchEvent(new CustomEvent('mt:wheel-select', {detail: {index: mod(index)}}));
  }
  function details() {
    carousel.dispatchEvent(new CustomEvent('mt:wheel-details'));
  }
  carousel.addEventListener('mt:offer-select', event => change(event.detail.index, event.detail.open));
  carousel.querySelector('[data-wheel-reset]').addEventListener('click', () => {
    targetProgress = reduce.matches ? 1 : 0;
    wheelDelta = 0;
    start();
  });
  wheel.querySelector('[data-wheel-details]').addEventListener('click', details);
  cards.forEach((card, index) => card.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    if (index === active && progress > .995) details();
    else choose(index);
  }));
  canvas.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const index = {ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: count - 1}[event.key];
    if (index === undefined) return;
    event.preventDefault();
    choose(index);
    choices[mod(index)].focus({preventScroll: true});
  });
  // Capture only the wheel area. Page scrolling remains free outside it.
  canvas.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) + Math.abs(event.deltaX) < 2) return;
    event.preventDefault();
    let delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (event.deltaMode === 1) delta *= 16;
    if (event.deltaMode === 2) delta *= canvas.clientHeight;
    delta = Math.max(-180, Math.min(180, delta));
    if (targetProgress < .999) {
      targetProgress = Math.max(0, Math.min(1, targetProgress + delta / 260));
      start();
      wheelDelta = 0;
      return;
    }
    const now = performance.now();
    if (now - lastWheel > 240) wheelDelta = 0;
    wheelDelta += delta;
    if (Math.abs(wheelDelta) >= 90 && now - lastWheel > 230) {
      choose(active + Math.sign(wheelDelta));
      wheelDelta = 0;
      lastWheel = now;
    }
  }, {passive: false});
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false) return;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, startTurn: targetTurn, startProgress: targetProgress, active: false, touch: event.pointerType === 'touch'};
  });
  canvas.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (drag.touch && drag.startProgress < .9 && Math.abs(dy) > Math.abs(dx) * 1.1) { drag = null; return; }
      drag.active = true;
      canvas.setPointerCapture(event.pointerId);
      canvas.dataset.dragging = 'true';
    }
    if (drag.touch) {
      targetProgress = 1;
      const delta = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      targetTurn = drag.startTurn - delta / Math.max(85, canvas.clientWidth * .3);
    } else if (drag.startProgress < .9) {
      targetProgress = Math.max(0, Math.min(1, drag.startProgress + (Math.abs(dx) + Math.abs(dy)) / 130));
    } else {
      const delta = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      targetTurn = drag.startTurn - delta / 120;
    }
    start();
  });
  function release(event, cancelled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.active, startProgress = drag.startProgress;
    drag = null;
    canvas.dataset.dragging = 'false';
    if (!moved) return;
    suppressClickUntil = performance.now() + 350;
    if (cancelled) { targetTurn = active; start(); return; }
    if (startProgress < .9 && targetProgress < .95) { targetProgress = targetProgress > .25 ? 1 : 0; start(); }
    else choose(Math.round(targetTurn));
  }
  canvas.addEventListener('pointerup', event => release(event));
  canvas.addEventListener('pointercancel', event => release(event, true));
  window.addEventListener('resize', measure, {passive: true});
  reduce.addEventListener('change', () => {
    if (reduce.matches) targetProgress = 1;
    start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else start();
  });
  measure();
  change(active, location.hash.startsWith('#solution-') || location.hash === '#services-carousel');
})();
