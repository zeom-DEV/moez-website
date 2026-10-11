
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
 const start=async(fromIntro)=>{
   // Graceful fallback until the MP4 has been uploaded to the GitHub branch.
   try{
     if(location.protocol!=='file:'){
       const response=await fetch(VIDEO,{method:'HEAD',cache:'no-store'});
       if(!response.ok)throw new Error('Film MP4 not yet deployed');
     }
   }catch(_){if(fromIntro)diagnose();return;}
   focusBefore=document.activeElement;
   node.classList.add('is-active');node.setAttribute('aria-hidden','false');
   document.body.classList.add('moez-film-open');
   end.classList.remove('is-visible');vid.currentTime=0;vid.muted=false;
   sound.textContent='Couper le son ✕';sound.focus();
   try{await vid.play();}catch(_){sound.textContent='Démarrer le film ▶';}
 };
 document.getElementById('intro-flip')?.addEventListener('click',()=>start(true));
 document.querySelectorAll('[data-replay-film]').forEach(b=>b.addEventListener('click',()=>start(false)));
 sound.addEventListener('click',()=>{if(vid.paused){vid.muted=false;vid.play().catch(()=>{});sound.textContent='Couper le son ✕';return;}vid.muted=!vid.muted;sound.textContent=vid.muted?'Activer le son ♫':'Couper le son ✕';});
 node.querySelector('[data-film-diagnose]').addEventListener('click',()=>close(true));
 node.querySelector('[data-film-replay]').addEventListener('click',()=>{end.classList.remove('is-visible');vid.currentTime=0;vid.play().catch(()=>{});});
 vid.addEventListener('ended',reveal);
 vid.addEventListener('error',()=>close(true));
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&node.classList.contains('is-active'))vid.pause();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&node.classList.contains('is-active')){e.preventDefault();vid.pause();}});
})();
