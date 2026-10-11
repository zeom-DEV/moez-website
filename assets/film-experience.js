
(()=>{
 'use strict';
 const VIDEO='./assets/moez-signature-teaser-12s.mp4';
 const CAL='https://calendly.com/moez-thabet-881988/30min';
 const node=document.createElement('div');
 node.className='moez-film';
 node.setAttribute('role','dialog');
 node.setAttribute('aria-modal','true');
 node.setAttribute('aria-label','Film Signature de Moez');
 node.setAttribute('aria-hidden','true');
 node.innerHTML=`
  <div class="moez-film__controls">
    <button type="button" data-film-sound>Couper le son ✕</button>
  </div>
  <video preload="none" playsinline webkit-playsinline disablepictureinpicture poster="./assets/moez-portrait-900.webp"><source type="video/mp4" src="${VIDEO}"></video>
  <div class="moez-film__finished" data-film-end>
    <span class="moez-film__eyebrow">Moez / Relation client & conversion</span>
    <h2>PARLONS DE<br>VOTRE PROJET.</h2>
    <p>Une conversation suffit pour identifier votre priorité et voir comment avancer.</p>
    <div class="moez-film__buttons">
      <a href="${CAL}" target="_blank" rel="noopener noreferrer">Réserver 30 minutes ↗</a>
      <button type="button" data-film-diagnose>Voir le diagnostic</button>
      <button type="button" data-film-replay>Revoir le film ↻</button>
    </div>
  </div>`;
 document.body.append(node);
 const vid=node.querySelector('video'),end=node.querySelector('[data-film-end]');
 const sound=node.querySelector('[data-film-sound]');
 let focusBefore=null;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const diagnose=()=>{ const target=document.getElementById('diagnostic');if(target)target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}); };
 const close=(toDiagnosis=false)=>{vid.pause();node.classList.remove('is-active');node.setAttribute('aria-hidden','true');document.body.classList.remove('moez-film-open');end.classList.remove('is-visible'); if(toDiagnosis)diagnose();focusBefore?.focus?.({preventScroll:true});};
 const reveal=()=>{end.classList.add('is-visible');end.querySelector('a')?.focus();};
 const fallback=()=>{end.querySelector('h2').textContent='PARLONS DE VOTRE PROJET.';end.querySelector('p').textContent='La vidéo est indisponible pour le moment. Retrouvez les services et réservez directement un échange.';reveal();};
 const start=(fromIntro)=>{
   // Start playback synchronously from the visitor's click, to preserve
   // the browser's audio-playback gesture permission.
   focusBefore=document.activeElement;
   node.classList.add('is-active');node.setAttribute('aria-hidden','false');
   document.body.classList.add('moez-film-open');
   end.classList.remove('is-visible');vid.currentTime=0;vid.muted=false;
   sound.textContent='Couper le son ✕';
   const playResult=vid.play();
   if(playResult&&typeof playResult.catch==='function'){
     playResult.catch(()=>{sound.textContent='Démarrer le film ▶'; fallback();});
   }
 };
 document.getElementById('intro-flip')?.addEventListener('click',()=>start(true));
 document.querySelectorAll('[data-replay-film]').forEach(b=>b.addEventListener('click',()=>start(false)));
 sound.addEventListener('click',()=>{if(vid.paused){vid.muted=false;vid.play().catch(()=>{});sound.textContent='Couper le son ✕';return;}vid.muted=!vid.muted;sound.textContent=vid.muted?'Activer le son ♫':'Couper le son ✕';});
 node.querySelector('[data-film-diagnose]').addEventListener('click',()=>close(true));
 node.querySelector('[data-film-replay]').addEventListener('click',()=>{end.classList.remove('is-visible');vid.currentTime=0;vid.play().catch(()=>{});});
 vid.addEventListener('ended',reveal);
 vid.addEventListener('error',fallback);
 vid.addEventListener('stalled',()=>{if(vid.readyState<2&&!end.classList.contains('is-visible')) fallback();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&node.classList.contains('is-active'))vid.pause();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&node.classList.contains('is-active')){e.preventDefault();vid.pause();}});
})();
