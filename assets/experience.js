/* Diagnostic interactif ; l'introduction critique est initialisée dans index.html, sans dépendance externe. */
(()=>{
  'use strict';
  const diag = {
    sav: {pager:'01 / 04',micro:'SAV & RELATION CLIENT',problem:'Tickets sans suivi',answer:'Prise en charge claire',title:'On n’apaise pas un client avec un ticket ouvert.',body:'On l’écoute, on vérifie, on agit et on le tient informé. Je peux prendre le relais sur les conversations importantes et organiser le suivi.',link:'./sav-ecommerce.html',cta:'Voir la méthode SAV',placement:'diagnostic-sav'},
    avis:{pager:'02 / 04',micro:'E-RÉPUTATION & FIDÉLISATION',problem:'Retours dispersés',answer:'Écoute et réponses utiles',title:'Votre réputation mérite un vrai dialogue.',body:'Des sollicitations d’avis conformes aux règles des plateformes, une écoute sincère et un suivi des retours pour améliorer l’expérience client.',link:'./e-reputation.html',cta:'Découvrir l’e-réputation',placement:'diagnostic-avis'},
    ventes:{pager:'03 / 04',micro:'TÉLÉVENTE & QUALIFICATION',problem:'Prospects oubliés',answer:'Relances structurées',title:'Un prospect qui attend se refroidit.',body:'Qualification, relances contextualisées, mises à jour CRM : une continuité commerciale sans scripts impersonnels ni promesses intenables.',link:'./televente.html',cta:'Voir l’approche commerciale',placement:'diagnostic-ventes'},
    web:{pager:'04 / 04',micro:'SITES SIGNATURE & CONVERSION',problem:'Visites sans rendez-vous',answer:'Parcours mémorable',title:'Votre site peut devenir votre meilleur commercial.',body:'Une expérience à votre image : direction artistique distinctive, narration interactive, SEO, preuve de valeur et rendez-vous à portée de clic. Ce site est une démonstration de l’approche.',link:'./site-signature.html',cta:'Découvrir les sites Signature',placement:'diagnostic-web'}
  };
  const lookup = id => document.getElementById(id);
  const buttons = [...document.querySelectorAll('[data-diagnostic]')];
  const setScene = key => {
    const d = diag[key]; if (!d) return;
    for(const [id,v] of Object.entries({'diag-pager':d.pager,'diag-micro':d.micro,'diag-problem-short':d.problem,'diag-answer-short':d.answer,'diag-result-title':d.title,'diag-result-body':d.body})) { if (lookup(id)) lookup(id).textContent=v; }
    const detail=lookup('diag-detail'); if(detail){detail.href=d.link; detail.firstChild.textContent=d.cta+' ';}
    const cta=document.querySelector('#diag-result [data-book]'); if(cta)cta.dataset.placement=d.placement;
    buttons.forEach(b=>{const a=b.dataset.diagnostic===key;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a));});
  };
  buttons.forEach(button => button.addEventListener('click',()=>setScene(button.dataset.diagnostic)));
})();
