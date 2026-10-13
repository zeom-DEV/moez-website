/* Signal moments on the original website: no fake activity or autoplay notifications. */
(()=>{
 "use strict";
 const island=document.getElementById("moez-orbit-root");
 const select=document.getElementById("brief-service");
 const form=document.getElementById("brief-form");
 const details=document.getElementById("details-offres");
 if(!island||!select||!form||!details)return;
 const reduce=matchMedia("(prefers-reduced-motion: reduce)");
 const names={
   web:{name:"Sites internet",result:"Un site publié, avec vos services expliqués et un contact testé.",label:"Création de sites web"},
   sav:{name:"Service client",result:"Des demandes traitées et les dossiers restants suivis.",label:"Gestion du service client"},
   avis:{name:"Avis clients",result:"Des réponses préparées et les points à améliorer identifiés.",label:"Gestion des avis clients"},
   prospects:{name:"Appels et relances",result:"Des contacts qualifiés et les prochaines relances planifiées.",label:"Appels et relances commerciales"},
   crm:{name:"Dossiers clients",result:"Des dossiers structurés et des tâches faciles à retrouver.",label:"Organisation des dossiers clients"},
   automation:{name:"Automatisation",result:"Un premier workflow testé avec un suivi des erreurs.",label:"Automatisation des workflows"}
 };
 let selected=names[location.hash.replace("#solution-","")]?location.hash.replace("#solution-",""):"web";
 let timer=0,visibleKey="",introReady=false;
 select.value=names[selected].label;
 const signal=document.createElement("aside");
 signal.className="mt-signal";
 signal.setAttribute("aria-label","Prochaine étape proposée");
 signal.setAttribute("aria-live","polite");
 signal.setAttribute("aria-atomic","true");
 signal.hidden=true;
 signal.innerHTML='<span class="mt-signal__orb" aria-hidden="true">✦</span><div class="mt-signal__content"><span class="mt-signal__eyebrow" data-signal-eyebrow></span><strong data-signal-title></strong><p data-signal-copy></p><a data-signal-action href="#details-offres">Continuer ↗</a></div><button type="button" class="mt-signal__close" aria-label="Fermer cette indication">×</button><div class="mt-signal__timeline" aria-hidden="true"></div>';
 document.body.append(signal);
 const action=signal.querySelector("[data-signal-action]");
 function close(){clearTimeout(timer);signal.classList.remove("is-visible");signal.hidden=true}
 signal.querySelector(".mt-signal__close").addEventListener("click",close);
 function canShow(){return introReady&&!document.querySelector(".moez-film.is-active")&&!document.hidden}
 function notify(type,tag,title,copy,callToAction,url,key){
   if(!canShow()||visibleKey===key&&signal.classList.contains("is-visible"))return;
   close();visibleKey=key;
   signal.dataset.type=type;
   signal.querySelector("[data-signal-eyebrow]").textContent=tag;
   signal.querySelector("[data-signal-title]").textContent=title;
   signal.querySelector("[data-signal-copy]").textContent=copy;
   action.textContent=callToAction+" ↗";
   action.href=url;
   signal.hidden=false;
   void signal.offsetWidth;
   signal.classList.add("is-visible");
   timer=setTimeout(close,9100);
 }
 function track(id){if(!names[id])return false;selected=id;select.value=names[id].label;return true}
 function chooseDetails(id){
   if(!track(id))return;
   close();
   const el=document.querySelector('[data-offer-link="'+id+'"]');
   if(el)el.click();
   else {location.hash="#solution-"+id;document.getElementById("solution-"+id)?.scrollIntoView({behavior:reduce.matches?"auto":"smooth"})}
 }
 function toBrief(){
   track(selected);
   close();
   if(location.hash!=="#contact")history.replaceState(null,"","#contact");
   document.getElementById("contact")?.scrollIntoView({behavior:reduce.matches?"auto":"smooth",block:"start"});
   const input=document.getElementById("brief-message");
   setTimeout(()=>input?.focus({preventScroll:true}),reduce.matches?0:650);
   notify("brief","03 / PASSER À L'ACTION","Votre besoin est déjà sélectionné.",
     "Décrivez votre situation : votre e-mail sera préparé mais jamais envoyé sans votre action.",
     "Rédiger ma demande","#brief-form","brief-"+selected);
 }
 action.addEventListener("click",event=>{
   const href=action.getAttribute("href");
   if(href?.startsWith("#solution-")){
     event.preventDefault();chooseDetails(href.replace("#solution-",""));return;
   }
   if(href==="#contact"||href==="#brief-form"){
     event.preventDefault();toBrief();return;
   }
   close();
 });
 document.addEventListener("click",event=>{
   const target=event.target.closest?.("[data-journey-brief]");
   if(!target)return;
   event.preventDefault();
   const parent=target.closest(".offer-detail");
   if(parent)track(parent.id.replace("solution-",""));
   toBrief();
 });
 // Carousel selection updates the chosen offer silently. The card's own
 // EXPLORER button is the direct path to its detail; no floating notification.
 window.addEventListener("mt:journey-select",event=>{
   if(track(event.detail?.id)) close();
 });
 window.addEventListener("mt:journey-detail",event=>{
   const id=event.detail?.id||location.hash.replace("#solution-","");
   if(!track(id))return;
   const panel=document.getElementById("solution-"+id);
   panel?.classList.remove("mt-detail-visible");
   if(panel){void panel.offsetWidth;panel.classList.add("mt-detail-visible")}
   notify("detail","02 / LE RÉSULTAT","Voici ce que je réalise pour vous.",
      names[id].result+" Votre demande peut être préparée en quelques secondes.",
      "Préparer ma demande","#contact","detail-"+id);
 });
 form.addEventListener("submit",()=>setTimeout(()=>{
   if(!document.getElementById("brief-result")?.hidden){
     notify("complete","03 / MESSAGE PRÊT","Votre message est préparé, pas envoyé.",
       "Relisez puis envoyez par e-mail, ou copiez le texte.","Voir mon message","#brief-result","brief-complete");
   }
 },120));
 // Keep the original booking and service pages, but add a second useful route
 // to a *prefilled* request instead of a new repeated services section.
 details.querySelectorAll(".offer-detail").forEach(panel=>{
   const target=panel.querySelector(".offer-detail__conversion");
   if(!target||target.querySelector("[data-journey-brief]"))return;
   const button=document.createElement("button");
   button.type="button";button.className="mt-journey-brief";button.dataset.journeyBrief="";
   button.textContent="Préparer une demande pour cette offre ↗";
   target.append(button);
 });
 const intro=document.getElementById("inversion-intro");
 introReady=!intro||intro.classList.contains("is-hidden");
 if(!introReady&&intro){
   const watcher=new MutationObserver(()=>{
     introReady=intro.classList.contains("is-hidden");
     if(introReady)watcher.disconnect();
   });
   watcher.observe(intro,{attributes:true,attributeFilter:["class"]});
 }
 window.addEventListener("popstate",()=>{
   const id=location.hash.replace("#solution-","");
   if(names[id])track(id);
 });
})();