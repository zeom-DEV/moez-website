/* MOEZ — clean editorial image carousel. No play/pause or demo controls. */
(() => {
  'use strict';
  const root = document.getElementById('kinetic-showcase');
  if (!root || !root.classList.contains('mt-editorial')) return;
  const stage = root.querySelector('.mt-editorial__stage');
  const slides = Array.from(root.querySelectorAll('.mt-editorial__slide'));
  const progress = Array.from(root.querySelectorAll('.mt-editorial__progress button'));
  const counter = root.querySelector('.mt-editorial__counter');
  const backwards = root.querySelector('[data-editorial-previous]');
  const forwards = root.querySelector('[data-editorial-next]');
  if (!stage || slides.length !== 6 || progress.length !== 6 || !counter || !backwards || !forwards) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = Math.max(0,slides.findIndex(slide=>slide.dataset.active==='true'));
  let viewable = false, pointer = null, timer = 0;
  let hovering = false, focused = false;
  const interval = 5800;
  const wrap = n => (n + slides.length) % slides.length;
  function blocked() {
    const intro = document.getElementById('inversion-intro');
    return document.hidden || reduced.matches || !viewable || hovering || focused ||
      document.body.classList.contains('intro-active') ||
      document.body.classList.contains('moez-film-open') ||
      (intro && !intro.classList.contains('is-hidden') &&
         getComputedStyle(intro).display !== 'none');
  }
  function schedule() {
    clearTimeout(timer);
    timer = 0;
    if (!blocked()) timer = setTimeout(() => go(current + 1), interval);
  }
  function go(index) {
    current = wrap(index);
    slides.forEach((slide,i) => {
      const visible = i === current;
      slide.dataset.active = String(visible);
      slide.setAttribute('aria-hidden',String(!visible));
      slide.inert = !visible;
      if (visible) {
        const img = slide.querySelector('img');
        if (img && img.loading === 'lazy') img.loading = 'eager';
      }
    });
    progress.forEach((button,i) => {
      button.setAttribute('aria-current',String(i === current));
      button.setAttribute('aria-label','Voir l’offre ' + (i+1) + ' sur ' + slides.length);
    });
    counter.textContent = String(current + 1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
    schedule();
  }
  backwards.addEventListener('click', () => go(current - 1));
  forwards.addEventListener('click', () => go(current + 1));
  progress.forEach((button,i) => button.addEventListener('click',() => go(i)));
  root.querySelectorAll('.mt-editorial__tile[data-service]').forEach(tile => {
    tile.addEventListener('pointerenter',()=>{const i=slides.findIndex(slide=>slide.dataset.service===tile.dataset.service);if(i>=0)go(i);});
  });
  stage.addEventListener('pointerenter',()=>{hovering=true;schedule();});
  stage.addEventListener('pointerleave',()=>{hovering=false;schedule();});
  stage.addEventListener('focusin',()=>{focused=true;schedule();});
  stage.addEventListener('focusout',()=>{focused=stage.contains(document.activeElement);schedule();});
  stage.addEventListener('pointerdown',event=>{
    if (event.button !== 0 || event.target.closest('button')) return;
    pointer={id:event.pointerId,x:event.clientX,y:event.clientY};
  });
  stage.addEventListener('pointerup',event=>{
    if (!pointer || pointer.id!==event.pointerId) return;
    const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
    pointer=null;
    if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.3) go(current+(dx<0?1:-1));
  });
  stage.addEventListener('pointercancel',()=>{pointer=null;});
  stage.addEventListener('keydown',event=>{
    if (event.key==='ArrowRight'||event.key==='ArrowLeft') {
      event.preventDefault();go(current+(event.key==='ArrowRight'?1:-1));
    }
  });
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener?.('change',schedule);
  window.addEventListener('mt:film-discover',()=>{go(0);schedule();});
  window.addEventListener('popstate',schedule);
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{
      viewable=entries.some(entry=>entry.isIntersecting);
      schedule();
    },{threshold:0.12});
    observer.observe(stage);
  } else viewable=true;
  // Pauses autoplay behind the introduction until the visitor reaches the offers.
  const intro=document.getElementById('inversion-intro');
  if(intro) new MutationObserver(schedule).observe(intro,{attributes:true,attributeFilter:['class']});
  go(current);
})();