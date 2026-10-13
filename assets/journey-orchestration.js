/* Six-offer journey integration: navigation and inline conversion, never floating notices. */
(()=>{
 "use strict";
 const island=document.getElementById("moez-orbit-root");
 const select=document.getElementById("brief-service");
 const form=document.getElementById("brief-form");
 const details=document.getElementById("details-offres");
 if(!island||!select||!form||!details)return;
 const reduce=matchMedia("(prefers-reduced-motion: reduce)");
 const names={
  web:"Création de sites web",
  sav:"Gestion du service client",
  avis:"Gestion des avis clients",
  prospects:"Appels et relances commerciales",
  crm:"Organisation des dossiers clients",
  automation:"Automatisation des workflows"
 };
 let selected=names[location.hash.replace("#solution-","")]?location.hash.replace("#solution-",""):"web";
 select.value=names[selected];
 function track(id){
  if(!Object.prototype.hasOwnProperty.call(names,id))return false;
  selected=id;
  select.value=names[id];
  return true;
 }
 function toBrief(){
  track(selected);
  if(location.hash!=="#contact")history.replaceState(null,"","#contact");
  document.getElementById("contact")?.scrollIntoView({behavior:reduce.matches?"auto":"smooth",block:"start"});
  const input=document.getElementById("brief-message");
  setTimeout(()=>input?.focus({preventScroll:true}),reduce.matches?0:650);
 }
 document.addEventListener("click",event=>{
  const target=event.target.closest?.("[data-journey-brief]");
  if(!target)return;
  event.preventDefault();
  const parent=target.closest(".offer-detail");
  if(parent)track(parent.id.replace("solution-",""));
  toBrief();
 });
 // Changing a card only updates the selected service. Its EXPLORER control
 // already opens the matching detailed offer: no duplicate overlay is needed.
 window.addEventListener("mt:journey-select",event=>{track(event.detail?.id);});
 window.addEventListener("mt:journey-detail",event=>{
  const id=event.detail?.id||location.hash.replace("#solution-","");
  if(!track(id))return;
  const panel=document.getElementById("solution-"+id);
  // Keep the meaningful inline detail animation, not a toast over the text.
  if(panel){
   panel.classList.remove("mt-detail-visible");
   void panel.offsetWidth;
   panel.classList.add("mt-detail-visible");
  }
 });
 // A direct, contextual CTA stays inside every service's own details.
 details.querySelectorAll(".offer-detail").forEach(panel=>{
  const target=panel.querySelector(".offer-detail__conversion");
  if(!target||target.querySelector("[data-journey-brief]"))return;
  const button=document.createElement("button");
  button.type="button";
  button.className="mt-journey-brief";
  button.dataset.journeyBrief="";
  button.textContent="Préparer une demande pour cette offre ↗";
  target.append(button);
 });
 window.addEventListener("popstate",()=>{
  const id=location.hash.replace("#solution-","");
  if(names[id])track(id);
 });
})();