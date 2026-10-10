(() => {
"use strict";
const intro=document.getElementById("inversion-intro"),flip=document.getElementById("intro-flip"),skip=document.getElementById("intro-skip");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const key="mt-intro-v3";let ended=false,stageTimer,hideTimer;
const remember=()=>{try{sessionStorage.setItem(key,"done")}catch(e){}};
const close=(instant=false)=>{
 if(!intro||ended)return;
 ended=true;remember();clearTimeout(stageTimer);clearTimeout(hideTimer);
 if(instant){intro.classList.add("is-hidden");intro.setAttribute("aria-hidden","true");document.body.classList.remove("intro-active");return}
 intro.classList.add("is-exiting");
 hideTimer=setTimeout(()=>{intro.classList.add("is-hidden");intro.setAttribute("aria-hidden","true");document.body.classList.remove("intro-active");document.querySelector(".hero-actions .button")?.focus({preventScroll:true})},650);
};
const rotate=()=>{
 if(!intro||ended||intro.classList.contains("is-righted"))return;
 if(reduce){close();return}
 intro.classList.add("is-righted");stageTimer=setTimeout(()=>close(),2250);
};
const replay=()=>{
 if(!intro)return;
 ended=false;clearTimeout(stageTimer);clearTimeout(hideTimer);
 intro.classList.remove("is-hidden","is-exiting","is-righted");intro.removeAttribute("aria-hidden");
 document.body.classList.add("intro-active");scrollTo({top:0,behavior:"instant"});flip?.focus({preventScroll:true});
};
if(intro&&flip&&skip){
 let seen=false;try{seen=sessionStorage.getItem(key)==="done"}catch(e){}
 if(seen)close(true);else{document.body.classList.add("intro-active");requestAnimationFrame(()=>flip.focus({preventScroll:true}))}
 flip.addEventListener("click",rotate);skip.addEventListener("click",()=>close(true));
 intro.addEventListener("keydown",e=>{
 if(e.key==="Escape"){e.preventDefault();close(true)}
 if(e.key==="Tab"){const buttons=[skip,flip],i=buttons.indexOf(document.activeElement);if((e.shiftKey&&i===0)||(!e.shiftKey&&i===1)){e.preventDefault();buttons[e.shiftKey?1:0].focus()}}
 });
 document.querySelectorAll("[data-replay-flip]").forEach(b=>b.addEventListener("click",replay));
}
const diag={
 sav:{pager:"01 / 04",micro:"SAV & RELATION CLIENT",problem:"Tickets sans suivi",answer:"Prise en charge claire",title:"On n’apaise pas un client avec un ticket ouvert.",body:"On l’écoute, on vérifie, on agit et on le tient informé. Je peux prendre le relais sur les conversations importantes et organiser le suivi.",link:"./sav-ecommerce.html",cta:"Voir la méthode SAV",placement:"diagnostic-sav"},
 avis:{pager:"02 / 04",micro:"E-RÉPUTATION & FIDÉLISATION",problem:"Retours dispersés",answer:"Écoute et réponses utiles",title:"Votre réputation mérite un vrai dialogue.",body:"Des sollicitations d’avis conformes aux règles des plateformes, une écoute sincère et un suivi des retours pour améliorer l’expérience client.",link:"./e-reputation.html",cta:"Découvrir l’e-réputation",placement:"diagnostic-avis"},
 ventes:{pager:"03 / 04",micro:"TÉLÉVENTE & QUALIFICATION",problem:"Prospects oubliés",answer:"Relances structurées",title:"Un prospect qui attend se refroidit.",body:"Qualification, relances contextualisées, mises à jour CRM : une continuité commerciale sans scripts impersonnels ni promesses intenables.",link:"./televente.html",cta:"Voir l’approche commerciale",placement:"diagnostic-ventes"},
 web:{pager:"04 / 04",micro:"SITES SIGNATURE & CONVERSION",problem:"Visites sans rendez-vous",answer:"Parcours mémorable",title:"Votre site peut devenir votre meilleur commercial.",body:"Une expérience à votre image : direction artistique distinctive, narration interactive, SEO, preuve de valeur et rendez-vous à portée de clic. Ce site est une démonstration de l’approche.",link:"./site-signature.html",cta:"Découvrir les sites Signature",placement:"diagnostic-web"}
};
const by=id=>document.getElementById(id);
document.querySelectorAll("[data-diagnostic]").forEach(button=>button.addEventListener("click",()=>{
 const key=button.dataset.diagnostic,d=diag[key];if(!d)return;
 for(const [id,value]of Object.entries({"diag-pager":d.pager,"diag-micro":d.micro,"diag-problem-short":d.problem,"diag-answer-short":d.answer,"diag-result-title":d.title,"diag-result-body":d.body})){if(by(id))by(id).textContent=value}
 const detail=by("diag-detail");if(detail){detail.href=d.link;detail.firstChild.textContent=d.cta+" "}
 const action=document.querySelector("#diag-result [data-book]");if(action)action.dataset.placement=d.placement;
 document.querySelectorAll("[data-diagnostic]").forEach(b=>{const active=b.dataset.diagnostic===key;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});
}));
})();