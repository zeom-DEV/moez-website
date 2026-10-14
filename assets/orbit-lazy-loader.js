/* Load the exact React photo-carousel only when the visitor approaches it.
   This keeps the cinematic intro, hero and first interaction responsive on mobile. */
(()=>{
 'use strict';
 const mount=document.getElementById('moez-orbit-root');
 const section=document.getElementById('kinetic-showcase');
 if(!mount||!section)return;
 const html=document.documentElement;
 const intro=document.getElementById('inversion-intro');
 html.classList.add('mt-orbit-pending');
 let started=false,finished=false;
 const timeout=()=>setTimeout(()=>{if(!finished)fallback()},18000);
 function fallback(){
   if(finished)return;
   html.classList.remove('mt-orbit-pending');
   section.classList.add('mt-orbit-load-error');
   mount.setAttribute('aria-label','Le carrousel est indisponible. Choisissez une offre dans la liste de services.');
 }
 function start(){
   if(started)return;
   started=true;
   const firstImage=section.querySelector('[data-orbit-poster-image]');
   if(firstImage&&!firstImage.getAttribute('src')){const source=firstImage.dataset.src;firstImage.src=matchMedia('(max-width: 650px)').matches?source.replace('web-desktop.webp','web-mobile.webp'):source;}
   const script=document.createElement('script');
   script.type='module';
   script.src='./assets/orbit-native.js?v=20261014-desktop-motion1';
   script.addEventListener('error',fallback,{once:true});
   document.body.append(script);
   timeout();
 }
 window.addEventListener('mt:orbit-ready',()=>{finished=true;section.classList.add('mt-orbit-ready')},{once:true});
 // A film covers the homepage on the first visit. Avoid loading six remote
 // images and React behind that film until visitors choose to proceed.
 let waitingForIntro=false;
 let mobileStartPending=false;
 function relevant(){
   // The new direct-entry homepage keeps the old cinema markup hidden rather than
   // setting .is-hidden. Only wait for a cinema that actually blocks the visitor.
   const introBlocks = intro &&
     !intro.classList.contains('is-hidden') &&
     !document.body.classList.contains('mt-direct-entry') &&
     getComputedStyle(intro).display !== 'none';
   if(introBlocks && !location.hash){waitingForIntro=true;return;}
   // The preloaded first photograph renders immediately. Defer parsing the
   // cinematic 3D engine until after the first mobile paint (not desktop).
   // The poster remains interactive while the 3D module is warming up.
   if(matchMedia('(max-width:800px)').matches){
     if(mobileStartPending||started)return;
     mobileStartPending=true;
     // Allow the preloaded photographic poster to paint before mounting the 3D engine.
     setTimeout(start, location.hash ? 1050 : 1800);
     return;
   }
   start();
 }
 document.getElementById('intro-flip')?.addEventListener('click',start,{once:true});
 document.querySelector('.intro-direct')?.addEventListener('click',start,{once:true});
 if(intro){
   const observe=new MutationObserver(()=>{
     if(waitingForIntro && intro.classList.contains('is-hidden')){observe.disconnect();start();}
   });
   observe.observe(intro,{attributes:true,attributeFilter:['class']});
 }

 if('IntersectionObserver' in window){
   const watcher=new IntersectionObserver(entries=>{
     if(entries.some(e=>e.isIntersecting)){watcher.disconnect();relevant()}
   },{rootMargin:'350px 0px',threshold:0.01});
   watcher.observe(section);
 }else{
   addEventListener('scroll',()=>{if(section.getBoundingClientRect().top<innerHeight+350)relevant()},{passive:true,once:true});
 }
 if(location.hash==='#kinetic-showcase'||location.hash==='#offres'||location.hash==='#services-carousel')relevant();
})();