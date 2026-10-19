(() => {
  'use strict';
   const $=(s,base=document)=>base.querySelector(s);
  const $$=(s,base=document)=>Array.from(base.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const services=[{"id": "sav", "path": "sav-ecommerce.html", "name": "Service client & SAV", "tag": "RELATION CLIENT", "title": "Vos clients ont une réponse. Leurs dossiers ont un suivi.", "short": "Un renfort pour votre service client.", "lede": "Je prends en charge les demandes après achat et le suivi des dossiers, dans vos outils et selon vos procédures.", "audience": "Pour les boutiques en ligne et les entreprises de services qui cherchent un interlocuteur francophone pour leurs clients.", "tasks": ["Répondre aux demandes sur les commandes, livraisons et retours", "Vérifier les informations et tenir le client au courant", "Suivre les réclamations et transmettre les décisions à valider", "Mettre à jour les dossiers et leurs prochaines actions"], "result": "Un récapitulatif des demandes traitées, des dossiers ouverts et des décisions attendues.", "contact": "Parlons de votre service client", "example": "Un client attend des nouvelles de sa livraison.", "steps": ["Vérifier la commande et le suivi disponible", "Répondre avec les informations confirmées", "Noter la prochaine action et reprendre le dossier"], "evidence": "Mon parcours comprend la relation client chez Teleperformance, le suivi de prestations chez Movinga, le support chez NETY et une mission actuelle en service client e-commerce.", "tools": "Shopify · Gorgias · Zendesk · Suivi CRM", "question": "Puis-je vous confier seulement une partie du SAV ?", "answer": "Oui. Nous pouvons commencer par un canal, des créneaux et des types de demandes convenus ensemble."}, {"id": "prospects", "path": "televente.html", "name": "Devis & relances", "tag": "SUIVI COMMERCIAL ENTRANT", "title": "Vos demandes entrantes méritent une suite.", "short": "De la demande au prochain échange.", "lede": "Je qualifie les demandes de vos prospects, prépare les éléments du devis et assure les relances convenues.", "audience": "Pour les entreprises qui reçoivent des demandes de devis et manquent de temps pour les qualifier et les suivre.", "tasks": ["Contacter les personnes ayant demandé des informations ou un devis", "Clarifier le besoin, le calendrier et les informations manquantes", "Préparer et suivre les propositions selon votre cadre commercial", "Renseigner le CRM, les objections et la prochaine relance"], "result": "Des opportunités renseignées, des devis suivis et des prochaines actions visibles.", "contact": "Organisons le suivi de vos devis", "example": "Une personne a demandé un devis et attend un échange.", "steps": ["Préciser le besoin et les informations manquantes", "Préparer la proposition avec votre cadre tarifaire", "Relancer au moment convenu et consigner la réponse"], "evidence": "Chez Movinga, mon rôle commercial comprenait la qualification de demandes entrantes, la préparation de devis, la négociation et la conversion. Chez NETY, j’ai aussi exercé en conseil commercial et ventes complémentaires.", "tools": "Demandes entrantes · Devis · Négociation · Salesforce", "question": "S’agit-il de démarchage téléphonique à froid ?", "answer": "Cette prestation porte sur vos demandes entrantes, vos devis et vos contacts déjà engagés. Nous définissons les critères et les relances avant la mission."}, {"id": "crm", "path": "crm-reporting.html", "name": "Suivi des dossiers", "tag": "COORDINATION CLIENTS", "title": "La prochaine étape reste visible.", "short": "Un dossier clair. Une action définie.", "lede": "Je centralise les informations utiles et coordonne le suivi entre le client et les personnes qui interviennent sur son dossier.", "audience": "Pour les entreprises de services, de livraison ou de coordination qui gèrent plusieurs dossiers en parallèle.", "tasks": ["Rassembler les informations, pièces et échanges utiles", "Mettre à jour les étapes et les échéances dans vos outils", "Coordonner les échanges avec les intervenants concernés", "Signaler les blocages et préparer un point de suivi"], "result": "Un suivi de dossiers avec les actions réalisées, les échéances et les points à décider.", "contact": "Parlons de vos dossiers clients", "example": "Un dossier attend une pièce et la réponse d’un intervenant.", "steps": ["Repérer ce qui manque et qui doit intervenir", "Relancer les bonnes personnes et informer le client", "Actualiser le dossier et signaler les blocages"], "evidence": "Mon expérience de chargé de clientèle chez Movinga associait relation client, coordination logistique et gestion des imprévus dans l’exécution des prestations.", "tools": "CRM · Tableaux de suivi · Coordination · Comptes rendus", "question": "Faut-il changer de CRM ?", "answer": "Nous commençons par vos outils existants. L’objectif est d’organiser le suivi ; une migration ou une configuration technique avancée ferait l’objet d’un projet distinct."}, {"id": "avis", "path": "e-reputation.html", "name": "Satisfaction & avis", "tag": "APRÈS-ACHAT", "title": "Écouter vos clients. Faire remonter ce qui compte.", "short": "Des retours clients utiles à votre équipe.", "lede": "Je réalise des contacts après achat, recueille les retours et organise les invitations à partager un avis authentique.", "audience": "Pour les marques qui veulent assurer un suivi régulier après achat et comprendre les difficultés rencontrées par leurs clients.", "tasks": ["Contacter les clients dans le cadre convenu après achat", "Recueillir les retours et les rattacher au bon dossier", "Adresser des invitations neutres à laisser un avis authentique", "Faire remonter les réclamations et les sujets récurrents"], "result": "Un relevé des retours recueillis, des invitations réalisées et des problèmes transmis à votre équipe.", "contact": "Organisons votre suivi après achat", "example": "Un client partage son expérience après réception.", "steps": ["Écouter le retour sans orienter sa réponse", "Transmettre un problème au service concerné", "Proposer une invitation neutre à partager son avis"], "evidence": "Ma mission actuelle via Essentiel-Outsourcing comprend le service client d’une marque e-commerce française et les contacts pour recueillir des avis clients.", "tools": "Contacts post-achat · Retours clients · Suivi de satisfaction", "question": "Pouvez-vous garantir une note ou des avis positifs ?", "answer": "Les avis appartiennent aux clients. La prestation porte sur des invitations neutres, des retours authentiques et leur suivi ; aucune note n’est promise."}, {"id": "web", "path": "site-signature.html", "name": "Sites & prise de contact", "tag": "PROJET COMPLÉMENTAIRE", "title": "Votre offre, facile à comprendre et à contacter.", "short": "Un site au service de votre activité.", "lede": "Je conçois un site de présentation avec des offres lisibles, une adaptation mobile et un parcours de prise de contact.", "audience": "Pour les indépendants et petites entreprises qui souhaitent présenter leurs prestations sur un site personnalisé.", "tasks": ["Organiser les pages autour de vos prestations et de vos visiteurs", "Rédiger les messages essentiels et concevoir une identité cohérente", "Adapter les pages au mobile et prévoir des animations utiles", "Mettre en ligne et vérifier les liens et les parcours de contact"], "result": "Un site de présentation publié, avec un périmètre et des vérifications convenus avant réalisation.", "contact": "Parlons de votre site", "example": "Un visiteur cherche ce que vous proposez et comment vous joindre.", "steps": ["Présenter une offre et son destinataire", "Montrer le déroulement et les éléments vérifiables", "Proposer une prise de contact simple"], "evidence": "Le site que vous consultez est une réalisation personnelle : il permet d’examiner la présentation des prestations, les interactions et le parcours de contact. Il n’est pas présenté comme une mission réalisée pour un client.", "tools": "Structure · Design · Responsive · Mise en ligne", "question": "Que comprend la réalisation ?", "answer": "Le devis précise les pages, les contenus, les interactions, l’hébergement et les vérifications. Les besoins de boutique en ligne, de paiement ou de développement complexe sont étudiés séparément."}, {"id": "automation", "path": "automatisation-workflows.html", "name": "Automatisation du suivi", "tag": "PROJET COMPLÉMENTAIRE", "title": "Moins de ressaisies. Un suivi organisé.", "short": "Des automatismes pour les tâches répétitives.", "lede": "Nous identifions une tâche répétitive, définissons un scénario et testons les échanges entre les outils concernés.", "audience": "Pour les équipes qui ressaisissent les mêmes informations ou suivent leurs demandes dans plusieurs outils.", "tasks": ["Décrire le processus et les informations nécessaires", "Définir les étapes, les autorisations et les exceptions", "Configurer un scénario compatible avec vos outils", "Tester sur des exemples, documenter et prévoir le traitement des erreurs"], "result": "Un scénario documenté et testé sur le périmètre convenu, avec ses limites et ses conditions de fonctionnement.", "contact": "Étudions votre scénario", "example": "Une demande reçue doit être ajoutée au suivi de l’équipe.", "steps": ["Identifier les données nécessaires et la destination", "Tester le scénario sur un exemple défini", "Vérifier le résultat et documenter les cas d’erreur"], "evidence": "Mes projets personnels comprennent ce site et Talent Scanner Pro, un outil de recherche booléenne présenté sur mon profil LinkedIn. Le choix d’un scénario dépend de vos outils et doit être validé par des tests.", "tools": "Processus · Scénarios · Tests · Documentation", "question": "Faut-il souscrire de nouveaux outils ?", "answer": "Nous vérifions d’abord ce qui est possible avec vos outils actuels. Tout abonnement, crédit ou coût récurrent est identifié dans le cadrage et soumis à votre accord."}];
  const motionState={intro:false,flipping:false,film:false,active:0,timer:null,seen:false,hover:false,focused:false,touchStart:null,swiped:false};
  const root=$('#site'),intro=$('#intro'),turn=$('#intro-turn'),film=$('#film'),video=$('#signature-video'),
    filmLoading=$('#film-loading'),filmEnd=$('#film-end'),filmProgress=$('#film-progress span'),sound=$('#film-sound'),
    filmMessage=$('#film-end-message'),stage=$('#collection-stage'),cards=$('#cards'),count=$('#stage-count'),
    detail=$('#detail'),detailTitle=$('#detail-title'),detailNumber=$('#detail-number'),detailLede=$('#detail-lede'),
    detailList=$('#detail-list'),detailImage=$('#detail-image'),detailResult=$('#detail-result'),
    detailAction=$('#detail-action'),detailTag=$('#detail-tag');
  root.inert=false; // The offer and contact are available on arrival.
  const initialOffer=/^#solution-(web|sav|avis|prospects|crm|automation)$/.test(location.hash)
    ? location.hash.slice(10) : null;
  const directEntry=true; // Signature film is an optional, visitor-triggered experience.
  const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const picture=id=>'<picture><source srcset="./assets/orbit-photos/'+id+'-mobile.webp" media="(max-width:680px)"><img src="./assets/orbit-photos/'+id+'-desktop.webp" alt="" width="640" height="860" loading="lazy" decoding="async"></picture>';
  cards.innerHTML=services.map((s,i)=>'<button class="offer-card" type="button" data-index="'+i+'" aria-label="Découvrir l’offre '+escape(s.name)+'">'+
    picture(s.id)+'<span class="offer-card__head"><span>MOEZ / '+String(i+1).padStart(2,'0')+' — 06</span>'+
    (i===0?'<span class="offer-card__flag">MISSION PRINCIPALE</span>':'')+'</span>'+
    '<span class="offer-card__foot"><small>'+escape(s.tag)+'</small><strong>'+escape(s.name)+'</strong>'+
    '<span class="offer-card__action">Explorer cette offre <b aria-hidden="true">↗</b></span></span></button>').join('');
  const allCards=$$('.offer-card',cards);
  const mod=n=>(n+services.length)%services.length;
  function showCard(index,fromUser=false){
    motionState.active=mod(index);
    allCards.forEach((card,i)=>{
      const delta=mod(i-motionState.active);
      const loc=delta===0?'center':delta===1?'right':delta===5?'left':delta===2?'far-right':delta===4?'far-left':'hidden';
      card.dataset.position=loc;
      const accessible=delta<=1||delta===5;
      card.inert=!accessible;
      card.tabIndex=accessible?0:-1;
      card.setAttribute('aria-hidden',String(!accessible));
      if(accessible){const img=$('img',card); if(img)img.loading='eager';}
    });
    count.textContent=String(motionState.active+1).padStart(2,'0')+' / 06';
    $('#stage-current').textContent=services[motionState.active].name.toUpperCase();
    if(fromUser)motionState.userInteracted=true;
    schedule();
  }
  function choose(index,focus=false){
    const s=services[mod(index)],n=mod(index);
    showCard(n,true);
    detailNumber.textContent=String(n+1).padStart(2,'0')+' / 06 — '+s.tag;
    detailTitle.textContent=s.title;
    detailLede.textContent=s.lede;
    detailTag.textContent=s.tag;
    detailList.replaceChildren(...s.tasks.map(t=>{
      const li=document.createElement('li');li.textContent=t;return li;
    }));
    detailImage.src='./assets/orbit-photos/'+s.id+'-desktop.webp';
    detailImage.alt='Illustration de l’offre '+s.name;
    detailResult.textContent=s.result;
    detailAction.textContent=s.contact+' ↗';
    detailAction.href='./?mission='+s.id+'#contact';
    $('#detail-page').href='./'+s.path;
    const hash='#solution-'+s.id;
    if(location.hash!==hash)history.pushState({offer:s.id},'',hash);
    detail.hidden=false;
    if(focus){
      detail.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
      setTimeout(()=>detailTitle.focus({preventScroll:true}),reduced.matches?0:650);
    }
  }
  function autoBlocked(){
    return motionState.intro||motionState.flipping||motionState.film||!motionState.seen||
      motionState.hover||motionState.focused||motionState.paused||document.hidden||reduced.matches;
  }
  function schedule(){
    clearTimeout(motionState.timer);motionState.timer=null;
    if(!autoBlocked()){
      motionState.timer=setTimeout(()=>showCard(motionState.active+1),6500);
    }
  }
  allCards.forEach((card,i)=>{
    card.addEventListener('click',()=>{
      if(motionState.swiped)return;
      choose(i,true);
    });
  });
  $('#stage-prev').addEventListener('click',()=>showCard(motionState.active-1,true));
  $('#stage-next').addEventListener('click',()=>showCard(motionState.active+1,true));
  stage.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('.stage-controls'))return;
    motionState.touchStart={id:e.pointerId,x:e.clientX,y:e.clientY};
  });
  stage.addEventListener('pointerup',e=>{
    const t=motionState.touchStart;motionState.touchStart=null;
    if(!t||e.pointerId!==t.id)return;
    const dx=e.clientX-t.x,dy=e.clientY-t.y;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25){
      motionState.swiped=true;
      showCard(motionState.active+(dx<0?1:-1),true);
      setTimeout(()=>{motionState.swiped=false;},300);
    }
  });
  stage.addEventListener('pointercancel',()=>{motionState.touchStart=null;});
  stage.addEventListener('click',e=>{
    if(motionState.swiped){e.preventDefault();e.stopPropagation();}
  },true);
  stage.addEventListener('pointerenter',()=>{motionState.hover=true;schedule();});
  stage.addEventListener('pointerleave',()=>{motionState.hover=false;schedule();});
  stage.addEventListener('focusin',()=>{motionState.focused=true;schedule();});
  stage.addEventListener('focusout',()=>{
    motionState.focused=stage.contains(document.activeElement);schedule();
  });
  stage.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
      e.preventDefault();showCard(motionState.active+(e.key==='ArrowLeft'?-1:1),true);
    }
  });
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{
      motionState.seen=entries.some(e=>e.isIntersecting);
      schedule();
    },{threshold:.19});
    io.observe(stage);
  }else motionState.seen=true;
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&motionState.film&&!video.paused)video.pause();
    schedule();
  });
  reduced.addEventListener?.('change',schedule);
  const setSound=()=>{
    sound.textContent=video.muted?'Activer le son ♫':'Couper le son ✕';
    sound.setAttribute('aria-label',video.muted?'Activer le son':'Couper le son');
  };
  let fallbackTimer=null,filmReady=false,filmFailed=false;
  function cancelFallback(){clearTimeout(fallbackTimer);fallbackTimer=null;}
  function showFilmEnd(failed=false){
    if(!motionState.film)return;
    cancelFallback();
    filmFailed=failed;
    filmLoading.classList.add('is-hidden');
    filmEnd.classList.add('is-active');
    $('#film-end-head').textContent=failed?'Découvrez mes solutions.':'Je prends le relais.';
    filmMessage.textContent=failed?'Le film n’a pas pu être chargé. Les six solutions restent accessibles immédiatement.':
      'Six prestations, un interlocuteur. Découvrez le périmètre qui correspond à votre besoin.';
    $('#film-discover').focus({preventScroll:true});
  }
  function startFilm(){
    if(motionState.flipping||motionState.film)return;
    motionState.flipping=true;motionState.film=true;motionState.intro=false;root.inert=true;
    filmReady=false;filmFailed=false;
    document.body.classList.remove('is-intro');
    document.body.classList.add('is-righting');
    intro.classList.add('is-reversing');
    film.classList.add('is-loaded');
    film.inert=false;
    film.setAttribute('aria-hidden','false');
    filmEnd.classList.remove('is-active');
    filmLoading.classList.remove('is-hidden');
    filmProgress.style.width='0%';
    video.pause();try{video.currentTime=0}catch{}
    // Start loading only after the user asks for the film, keeping the home page light.
    video.preload='auto';video.load();
    video.muted=false;setSound();
    // Start playback synchronously inside visitor gesture to permit sound.
    try{
      const promise=video.play();
      promise?.catch?.(()=>{
        if(!motionState.film)return;
        video.muted=true;setSound();
        video.play().catch(()=>{showFilmEnd(true);});
      });
    }catch{showFilmEnd(true);}
    fallbackTimer=setTimeout(()=>{if(!filmReady)showFilmEnd(true);},10000);
    setTimeout(()=>{
      film.classList.add('is-visible');
      document.body.classList.remove('is-righting');
      document.body.classList.add('is-film');
      intro.hidden=true;
      intro.inert=true;
      sound.focus({preventScroll:true});
      motionState.flipping=false;
      if(filmReady&&!video.ended&&video.paused)video.play().catch(()=>showFilmEnd(true));
      if(!filmReady&&video.error)showFilmEnd(true);
    },reduced.matches?0:1390);
    schedule();
  }
  turn.addEventListener('click',startFilm);
  video.addEventListener('playing',()=>{
    if(!motionState.film)return;
    filmReady=true;cancelFallback();filmLoading.classList.add('is-hidden');
    // A slow connection can start playing after the startup timeout: hide the stale error overlay.
    if(filmFailed){filmEnd.classList.remove('is-active');filmFailed=false;}
  });
  video.addEventListener('timeupdate',()=>{
    const d=video.duration;
    if(d>0)filmProgress.style.width=Math.min(100,(video.currentTime/d)*100)+'%';
  });
  video.addEventListener('ended',()=>showFilmEnd(false));
  video.addEventListener('error',()=>showFilmEnd(true));
  sound.addEventListener('click',()=>{
    if(video.paused&&!video.ended){
      video.muted=false;setSound();video.play().catch(()=>showFilmEnd(true));
    }else{video.muted=!video.muted;setSound();}
  });
  function leaveFilm(){
    cancelFallback();video.pause();
    motionState.film=false;motionState.intro=false;motionState.flipping=false;
    film.classList.remove('is-visible','is-loaded');
    film.setAttribute('aria-hidden','true');
    film.inert=true;
    root.inert=false;
    document.body.classList.remove('is-film','is-righting','is-intro');
    root.style.transform='none';
    if(initialOffer){
      const index=services.findIndex(s=>s.id===initialOffer);
      if(index>=0){choose(index,true);schedule();return;}
    }
    if(location.hash!=='#solutions')history.replaceState({},'','#solutions');
    $('#solutions').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
    $('#solutions-heading').focus({preventScroll:true});
    schedule();
  }
  $('#film-discover').addEventListener('click',e=>{e.preventDefault();leaveFilm();});
  $('#film-exit').addEventListener('click',leaveFilm);
  function revealDirect(target=location.hash){
    cancelFallback();
    motionState.intro=false;motionState.film=false;motionState.flipping=false;
    video.pause();film.classList.remove('is-visible','is-loaded');
    film.setAttribute('aria-hidden','true');film.inert=true;
    intro.hidden=true;intro.inert=true;
    root.inert=false;root.style.transform='none';
    document.body.classList.remove('is-intro','is-film','is-righting');
    if(initialOffer){
      const idx=services.findIndex(s=>s.id===initialOffer);
      if(idx>=0){choose(idx,false);setTimeout(()=>detail.scrollIntoView({behavior:'instant',block:'start'}),0);}
    }else if(target==='#solutions'||target==='#contact'){
      setTimeout(()=>$(target)?.scrollIntoView({behavior:'instant',block:'start'}),0);
    }
    schedule();
  }
  $('#intro-direct').addEventListener('click',e=>{
    e.preventDefault();history.replaceState({},'','#solutions');revealDirect('#solutions');
  });
  // Only the intro is keyboard-accessible before the flip.
  film.inert=true;
  // Preserve a single main conversion CTA before the services.
  $$('.to-solutions').forEach(a=>a.addEventListener('click',e=>{
    if(motionState.intro||motionState.film)return;
    e.preventDefault();location.hash='solutions';
    $('#solutions').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
  }));
  $('#other-offers').addEventListener('click',()=>{
    $('#solutions').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
  });
  window.addEventListener('popstate',()=>{
    if(motionState.intro||motionState.film)return;
    const match=/^#solution-(web|sav|avis|prospects|crm|automation)$/.exec(location.hash);
    if(match){const idx=services.findIndex(s=>s.id===match[1]);if(idx>=0)choose(idx,false);}
  });
  // The initial page is usable immediately. The signature experience is optional.
  showCard(0);
  if(directEntry){
    revealDirect(location.hash);
  }else if(reduced.matches){intro.classList.add('is-ready');turn.focus({preventScroll:true});}
  else setTimeout(()=>{if(motionState.intro){intro.classList.add('is-ready');turn.focus({preventScroll:true});}},1700);
  window.addEventListener('load',()=>{
    if(!directEntry&&location.hash)window.scrollTo({top:0,behavior:'instant'});
  },{once:true});

  $('#signature-open').addEventListener('click',()=>{
    motionState.intro=true; root.inert=true;
    root.style.removeProperty('transform');
    intro.classList.remove('is-reversing');
    intro.hidden=false;intro.inert=false;
    document.body.classList.add('is-intro');
    intro.classList.add('is-ready');
    turn.focus({preventScroll:true});schedule();
  });
  $('#stage-pause').addEventListener('click',()=>{
    motionState.paused=!motionState.paused;
    $('#stage-pause').setAttribute('aria-pressed',String(motionState.paused));
    $('#stage-pause').setAttribute('aria-label',motionState.paused?'Reprendre le carrousel':'Mettre le carrousel en pause');
    $('#stage-pause').textContent=motionState.paused?'▷':'Ⅱ';schedule();
  });
  document.addEventListener('keydown',e=>{
    if(!motionState.intro&&!motionState.film)return;
    if(e.key==='Escape'){e.preventDefault();revealDirect();$('#signature-open').focus();return;}
    if(e.key!=='Tab')return;
    const modal=motionState.film?film:intro;
    const controls=$$('button,a[href]',modal).filter(el=>el.getClientRects().length&&!el.disabled);
    if(!controls.length)return;
    const first=controls[0],last=controls[controls.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  window.__signatureReady=true;
})();