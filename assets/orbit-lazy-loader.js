/* Load the exact React photo-carousel only when the visitor approaches it.
   This keeps the cinematic intro, hero and first interaction responsive on mobile. */
(()=>{
 'use strict';
 const mount=document.getElementById('moez-orbit-root');
 const section=document.getElementById('kinetic-showcase');
 if(!mount||!section)return;
 const html=document.documentElement;
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
   const script=document.createElement('script');
   script.type='module';
   script.src='./assets/orbit-island.js?v=20261012-original';
   script.addEventListener('error',fallback,{once:true});
   document.body.append(script);
   timeout();
 }
 window.addEventListener('mt:orbit-ready',()=>{finished=true;section.classList.add('mt-orbit-ready')},{once:true});
 if('IntersectionObserver' in window){
   const watcher=new IntersectionObserver(entries=>{
     if(entries.some(e=>e.isIntersecting)){watcher.disconnect();start()}
   },{rootMargin:'350px 0px',threshold:0.01});
   watcher.observe(section);
 }else{
   addEventListener('scroll',()=>{if(section.getBoundingClientRect().top<innerHeight+350)start()},{passive:true,once:true});
 }
 if(location.hash==='#kinetic-showcase')start();
})();