/* MOEZ / Journey orchestra. Every interruption follows a real visitor action.
   Zero autoplay, zero fabricated activity, no network calls or trackers. */
(() => {
  'use strict';
  const showcase=document.querySelector('[data-kinetic-showcase]');
  const rail=document.querySelector('[data-journey-rail]');
  const form=document.getElementById('brief-form');
  const select=document.getElementById('brief-service');
  const details=document.getElementById('details-offres');
  if(!showcase||!rail||!form||!select||!details)return;
  document.documentElement.classList.add('mt-journey-enabled');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const names={
    web:{name:'Sites internet',promise:'Pages claires, design personnalisé et contact testé.',label:'Création de sites web'},
    sav:{name:'Service client',promise:'Demandes traitées et dossiers suivis.',label:'Gestion du service client'},
    avis:{name:'Avis clients',promise:'Réponses adaptées et sujets à améliorer.',label:'Gestion des avis clients'},
    prospects:{name:'Appels et relances',promise:'Contacts qualifiés et prochaines relances organisées.',label:'Appels et relances commerciales'},
    crm:{name:'Dossiers clients',promise:'Informations structurées et échéances visibles.',label:'Organisation des dossiers clients'},
    automation:{name:'Automatisation',promise:'Un workflow testé et documenté.',label:'Automatisation des workflows'}
  };
  let selected='web',signalTimeout=0,signalKey='',lastDetail='',introReady=false;
  const progress=[...rail.querySelectorAll('[data-journey-progress]')];
  const notify=document.createElement('aside');
  notify.className='mt-signal';
  notify.setAttribute('aria-label','Aide contextuelle');
  notify.setAttribute('aria-live','polite');
  notify.setAttribute('aria-atomic','true');
  notify.hidden=true;
  notify.innerHTML='<span class="mt-signal__orb" aria-hidden="true">✦</span><div class="mt-signal__content"><span class="mt-signal__eyebrow" data-signal-eyebrow></span><strong data-signal-title></strong><p data-signal-copy></p><a data-signal-action href="#details-offres">Continuer <span aria-hidden="true">↗</span></a></div><button type="button" class="mt-signal__close" aria-label="Fermer cette indication">×</button><div class="mt-signal__timeline" aria-hidden="true"></div>';
  document.body.append(notify);
  const action=notify.querySelector('[data-signal-action]');
  const dismiss=()=>{clearTimeout(signalTimeout);notify.classList.remove('is-visible');notify.hidden=true;};
  notify.querySelector('.mt-signal__close').addEventListener('click',dismiss);
  function step(n){
    progress.forEach((el,i)=>{
      el.classList.toggle('is-current',i===n);
      el.classList.toggle('is-done',i<n);
      el.setAttribute('aria-current',i===n?'step':'false');
    });
    rail.dataset.step=String(n+1);
  }
  function inform(type,title,copy,actionText,url,key){
    if(!introReady||document.body.classList.contains('moez-film-open'))return;
    clearTimeout(signalTimeout);
    signalKey=key;
    dismiss();
    notify.dataset.type=type;
    notify.querySelector('[data-signal-eyebrow]').textContent=
      type==='choice'?'01 / SOLUTION SÉLECTIONNÉE':
      type==='detail'?'02 / VOICI LE RÉSULTAT':
      type==='brief'?'03 / PASSER À L’ACTION':'MESSAGE PRÉPARÉ';
    notify.querySelector('[data-signal-title]').textContent=title;
    notify.querySelector('[data-signal-copy]').textContent=copy;
    action.textContent=actionText+' ↗';
    action.href=url;
    notify.hidden=false;
    // Force an intentional entrance, not a notification that silently remains.
    void notify.offsetWidth;
    notify.classList.add('is-visible');
    signalTimeout=setTimeout(dismiss,10500);
  }
  const selectService=id=>{
    if(!names[id])return;
    selected=id;
    select.value=names[id].label;
    step(0);
  };
  function getId(){
    const id=location.hash.replace('#solution-','');
    return names[id]?id:selected;
  }
  function goBrief(){
    if(names[selected])select.value=names[selected].label;
    step(2);
    history.replaceState(null,'','#contact');
    const contact=document.getElementById('contact');
    contact?.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'start'});
    const message=document.getElementById('brief-message');
    if(message)setTimeout(()=>{message.focus({preventScroll:true});},reduce.matches?0:600);
    inform('brief','Votre demande est prête à être précisée.',
      'Le service '+names[selected].name+' est déjà sélectionné. Décrivez votre situation avant de préparer votre e-mail.',
      'Compléter mon message','#brief-form','brief-'+selected);
  }
  action.addEventListener('click',event=>{
    if(action.getAttribute('href')==='#contact'||action.getAttribute('href')==='#brief-form'){
      event.preventDefault();
      dismiss();
      goBrief();
    }else{dismiss();}
  });
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-journey-brief]');
    if(!el)return;
    event.preventDefault();
    const panel=el.closest('.offer-detail');
    if(panel&&names[panel.id.replace('solution-','')])selectService(panel.id.replace('solution-',''));
    dismiss();
    goBrief();
  });
  window.addEventListener('mt:journey-select',event=>{
    const id=event.detail?.id;
    if(!names[id])return;
    selectService(id);
    showcase.dataset.selectedOffer=id;
    inform('choice',names[id].name+' : découvrons le concret.',
      names[id].promise,
      'Voir les tâches et le résultat','#solution-'+id,'choice-'+id);
  });
  window.addEventListener('mt:journey-detail',event=>{
    const id=event.detail?.id||getId();
    if(!names[id])return;
    selectService(id);
    step(1);
    const panel=document.getElementById('solution-'+id);
    panel?.classList.remove('mt-detail-visible');
    if(panel){void panel.offsetWidth;panel.classList.add('mt-detail-visible');}
    if(lastDetail!==id){
      lastDetail=id;
      inform('detail','Vous savez ce que je peux livrer.',
        names[id].promise+' Vous pouvez maintenant préparer une demande adaptée.',
        'Préparer ma demande','#contact','detail-'+id);
    }
  });
  window.addEventListener('mt:brief_generated',()=>{
    step(2);
    inform('complete','Votre texte est généré, pas envoyé.',
      'Relisez-le, puis choisissez « Envoyer par e-mail » ou « Copier le texte ».',
      'Voir le message','#brief-result','complete');
  });
  // A direct link or an existing visitor choice must retain its context.
  const initial=location.hash.slice(1).replace('solution-','');
  if(names[initial])selected=initial;
  if(names[selected])select.value=names[selected].label;
  step(0);
  const intro=document.getElementById('inversion-intro');
  introReady=!intro||intro.classList.contains('is-hidden');
  if(!introReady&&intro){
    const observer=new MutationObserver(()=>{
      introReady=intro.classList.contains('is-hidden');
      if(introReady)observer.disconnect();
    });
    observer.observe(intro,{attributes:true,attributeFilter:['class']});
  }
  // Keep the service coherent if a deep link or back/forward navigation is used.
  window.addEventListener('popstate',()=>{const id=getId();if(names[id])selected=id;});
})();
