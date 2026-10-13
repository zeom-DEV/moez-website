(()=>{
'use strict';
const intro=document.getElementById('inversion-intro');
const trigger=document.getElementById('intro-flip');
if(!trigger)return;
const node=document.createElement('section');
node.className='moez-film';
node.setAttribute('role','dialog');
node.setAttribute('aria-modal','true');
node.setAttribute('aria-label','Film Signature de Moez');
node.setAttribute('aria-hidden','true');
node.innerHTML="<div class=\"moez-film__controls\"><span class=\"moez-film__label\">FILM SIGNATURE / MOEZ</span><button type=\"button\" data-film-sound aria-label=\"Couper le son\">Couper le son ✕</button></div>\n<video preload=\"none\" playsinline webkit-playsinline disablepictureinpicture poster=\"./assets/moez-portrait-480.webp\" aria-label=\"Film de présentation de Moez\"><source src=\"./assets/moez-signature-teaser-12s.mp4\" type=\"video/mp4\"></video>\n<div class=\"moez-film__loading\" data-film-loading aria-live=\"polite\"><span class=\"moez-film__loading-index\">M / 001</span><strong>PRENDRE LE RELAIS.</strong><span class=\"moez-film__loading-track\" aria-hidden=\"true\"><i></i></span></div>\n<div class=\"moez-film__progress\" aria-hidden=\"true\"><i data-film-progress></i></div>\n<div class=\"moez-film__finished\" data-film-end aria-hidden=\"true\"><span class=\"moez-film__eyebrow\">MOEZ / CRÉATION DE SITES INTERNET</span><h2>UN SITE CLAIR.<br>UNE ACTION ÉVIDENTE.</h2><p>Découvrez les six services proposés et choisissez celui qui correspond à votre projet.</p><div class=\"moez-film__buttons\"><a href=\"#offres\" data-film-discover>VOIR LES SIX OFFRES ↘</a></div></div>";
document.body.append(node);
const skip=document.createElement('button');skip.type='button';skip.className='moez-film__skip';skip.textContent='Passer le film →';node.querySelector('.moez-film__controls').append(skip);
const video=node.querySelector('video'),sound=node.querySelector('[data-film-sound]'),end=node.querySelector('[data-film-end]'),loading=node.querySelector('[data-film-loading]'),progress=node.querySelector('[data-film-progress]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let open=false,previousFocus=null,watchdog=0,started=false,replayed=false,observer=null;
let background=[];
const clearWatch=()=>{clearTimeout(watchdog);watchdog=0;};
const busy=on=>{loading.classList.toggle('is-hidden',!on);loading.setAttribute('aria-hidden',String(!on));};
const setSound=()=>{sound.textContent=video.muted?'Activer le son ♫':'Couper le son ✕';sound.setAttribute('aria-label',video.muted?'Activer le son':'Couper le son');};
function close(toDiagnosis=false){
 if(!open)return;
 clearWatch();observer?.disconnect();video.pause();open=false;
 node.classList.remove('is-active');node.setAttribute('aria-hidden','true');
 document.body.classList.remove('moez-film-open');
 background.forEach(([element,wasInert])=>{element.inert=wasInert;});background=[];
 end.classList.remove('is-visible');end.setAttribute('aria-hidden','true');busy(false);
 if(toDiagnosis){
   const section=document.getElementById('diagnostic');
   section?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
   const heading=document.getElementById('diagnostic-title');
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 }else{
   const focus=previousFocus?.isConnected?previousFocus:document.getElementById('hero-title');
   if(focus){if(focus.tagName==='H1')focus.tabIndex=-1;focus.focus({preventScroll:true});}
 }
}
function showFinal(error=false){
 if(!open)return;
 clearWatch();busy(false);
 if(error){
   end.querySelector('h2').textContent='DÉCOUVREZ MES SOLUTIONS.';
   end.querySelector('p').textContent="Le film n'a pas pu être chargé. Vous pouvez découvrir mes services et mon approche sans interruption.";
 }else{
   end.querySelector('h2').innerHTML='UN SITE CLAIR.<br>UNE ACTION ÉVIDENTE.';
   end.querySelector('p').textContent='La création de sites internet est mon offre phare. Découvrez aussi mes cinq autres services, dont l’automatisation de vos tâches répétitives.';
 }
 end.classList.add('is-visible');end.setAttribute('aria-hidden','false');
 end.querySelector('a')?.focus({preventScroll:true});
}
function fail(){
 if(!open||end.classList.contains('is-visible'))return;
 showFinal(true);
}
function play(fromIntro){
 if(open)return;
 clearWatch();previousFocus=document.activeElement;open=true;started=false;replayed=!fromIntro;
 end.classList.remove('is-visible');end.setAttribute('aria-hidden','true');
 progress.style.width='0%';
 node.classList.add('is-active');node.setAttribute('aria-hidden','false');
 document.body.classList.add('moez-film-open');
 background=[...document.body.children].filter(el=>el!==node&& !['SCRIPT','STYLE'].includes(el.tagName)).map(el=>[el,el.inert]);
 background.forEach(([el])=>{el.inert=true;});
 sound.focus({preventScroll:true});
 busy(true);video.pause();
 try{video.currentTime=0;}catch(e){}
 video.muted=false;setSound();
 // Must run synchronously in visitor click to satisfy browser sound policies.
 try{
   const promise=video.play();
   promise?.catch?.(()=>{
     if(!open)return;
     // Mobile browsers may decline sound on first play. Retry silently without blocking the journey.
     video.muted=true;setSound();
     try{
       const fallback=video.play();
       fallback?.catch?.(()=>{if(open){busy(false);sound.textContent='Lire le film ▶';sound.setAttribute('aria-label','Lire le film');}});
     }catch(e){busy(false);sound.textContent='Lire le film ▶';}
   });
 }catch(e){busy(false);sound.textContent='DÉMARRER LE FILM ▶';}
 watchdog=setTimeout(()=>{if(open&&!started)fail();},12000);
}
// Main visitor action must start the film immediately inside the click gesture.
trigger.addEventListener('click', () => play(true));
document.querySelectorAll('[data-replay-film]').forEach(b => b.addEventListener('click', () => play(false)));
video.addEventListener('playing',()=>{
 started=true;clearWatch();busy(false);
 if(!replayed&&intro&&!intro.classList.contains('is-hidden')){
   observer?.disconnect();
   observer=new MutationObserver(()=>{
     if(intro.classList.contains('is-hidden')){
       observer.disconnect();
       if(open&&!video.paused){try{video.currentTime=0;}catch(e){}}
     }
   });
   observer.observe(intro,{attributes:true,attributeFilter:['class']});
   setTimeout(()=>observer?.disconnect(),5000);
 }
});
video.addEventListener('timeupdate',()=>{
 const ratio=video.duration>0?Math.min(100,video.currentTime/video.duration*100):0;
 progress.style.width=ratio+'%';
});
video.addEventListener('ended',()=>showFinal(false));
video.addEventListener('error',fail);
video.addEventListener('stalled',()=>{if(!started)busy(true);});
video.addEventListener('pause',()=>{if(open&&!video.ended){sound.textContent='Reprendre le film ▶';sound.setAttribute('aria-label','Reprendre le film');}});
sound.addEventListener('click',()=>{
 if(video.paused&&!video.ended){
   video.muted=false;setSound();busy(true);
   const promise=video.play();
   promise?.catch?.(fail);
 }else{video.muted=!video.muted;setSound();}
});

function discover(){
 close(false);
 if(intro&&!intro.classList.contains('is-hidden')){intro.classList.add('is-hidden');intro.setAttribute('aria-hidden','true');document.body.classList.remove('intro-active','intro-righting');document.getElementById('intro-cinema-video')?.pause();}
 const shell=document.getElementById('site-shell');if(shell)shell.inert=false;
 if(location.hash!=='#offres')history.pushState(null,'','#offres');
 // The offer overview is the destination; do not invoke the old carousel shortcut.
 document.getElementById('offres')?.scrollIntoView({behavior:'instant',block:'start'});
 const title=document.getElementById('offers-five-title');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
}
node.querySelector('[data-film-discover]').addEventListener('click',e=>{e.preventDefault();discover();});skip.addEventListener('click',discover);

document.addEventListener('visibilitychange',()=>{if(document.hidden&&open)video.pause();});
document.addEventListener('keydown',e=>{
 if(!open)return;
 if(e.key==='Escape'){e.preventDefault();discover();}
 if(e.key==='Tab'){
   const controls=[...node.querySelectorAll('button,a[href]')].filter(el=>el.getClientRects().length&&!el.disabled);
   const index=controls.indexOf(document.activeElement);
   if((e.shiftKey&&index<=0)||(!e.shiftKey&&(index===controls.length-1||index===-1))){e.preventDefault();controls[e.shiftKey?controls.length-1:0]?.focus();}
 }
});
})();