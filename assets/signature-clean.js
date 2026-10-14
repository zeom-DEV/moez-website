(() => {
  'use strict';
  const $=(s,base=document)=>base.querySelector(s);
  const $$=(s,base=document)=>Array.from(base.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const services=[
   {id:'web',name:'Sites internet',tag:'OFFRE PHARE',title:'Une présence qui donne envie.',lede:'Un site internet sur mesure, aussi remarquable que votre activité et pensé pour transformer l’intérêt en prise de contact.',tasks:['Conception de la structure et rédaction des messages essentiels','Design personnalisé et animations cohérentes','Adaptation mobile, optimisation du chargement et référencement technique de base','Mise en ligne et vérification des formulaires et liens de contact'],result:'Un site personnalisé, publié et facile à utiliser.',contact:'Parlons de votre futur site'},
   {id:'sav',name:'Service client',tag:'RELATION CLIENT',title:'Chaque client compte.',lede:'Une prise en charge humaine et structurée pour répondre à vos clients et suivre leurs demandes.',tasks:['Réponses aux questions et demandes clients','Gestion et suivi des dossiers après-vente','Coordination des escalades et résolutions','Suivi des indicateurs utiles à l’expérience client'],result:'Des demandes mieux suivies et des réponses plus claires.',contact:'Organisons votre service client'},
   {id:'avis',name:'Avis clients',tag:'E-RÉPUTATION',title:'La confiance se cultive.',lede:'Collecte conforme, suivi et réponses aux avis pour mieux comprendre votre clientèle et renforcer votre réputation.',tasks:['Suivi des retours et avis publiés','Réponses personnalisées aux avis positifs et négatifs','Organisation d’invitations à donner un avis selon les règles applicables','Synthèse des irritants et axes d’amélioration'],result:'Une gestion d’avis régulière, transparente et utile.',contact:'Parlons de votre réputation'},
   {id:'prospects',name:'Appels et relances',tag:'DÉVELOPPEMENT COMMERCIAL',title:'Des échanges qui avancent.',lede:'Une prospection structurée et des relances personnalisées pour faire progresser vos opportunités commerciales.',tasks:['Qualification des contacts et préparation des échanges','Appels et relances adaptés au contexte','Compte rendu et mise à jour des informations','Suivi des rendez-vous et prochaines actions'],result:'Un pipeline commercial mieux organisé.',contact:'Développons vos opportunités'},
   {id:'crm',name:'Dossiers clients',tag:'ORGANISATION',title:'Tout est à sa place.',lede:'Une organisation claire des informations et des tâches pour que chaque client bénéficie d’un suivi cohérent.',tasks:['Mise à jour et structuration des informations CRM','Création des étapes de suivi','Classement des demandes et priorités','Tableaux de suivi et processus de travail'],result:'Des informations fiables et des priorités visibles.',contact:'Organisons vos opérations'},
   {id:'automation',name:'Automatisation',tag:'WORKFLOWS',title:'Laissez les tâches répétitives derrière vous.',lede:'Je connecte vos outils et conçois des automatisations utiles pour réduire les manipulations manuelles.',tasks:['Audit des tâches répétitives','Conception du scénario d’automatisation','Connexion des outils et tests de fonctionnement','Documentation et suivi des résultats'],result:'Des workflows plus simples et du temps dégagé pour l’essentiel.',contact:'Automatisons vos tâches'}
  ];
  const motionState={intro:true,flipping:false,film:false,active:0,timer:null,seen:false,hover:false,focused:false,dragging:false,touchStart:null,swiped:false};
  const root=$('#site'),intro=$('#intro'),turn=$('#intro-turn'),film=$('#film'),video=$('#signature-video'),
    filmLoading=$('#film-loading'),filmEnd=$('#film-end'),filmProgress=$('#film-progress span'),sound=$('#film-sound'),
    filmMessage=$('#film-end-message'),stage=$('#collection-stage'),cards=$('#cards'),count=$('#stage-count'),
    detail=$('#detail'),detailTitle=$('#detail-title'),detailNumber=$('#detail-number'),detailLede=$('#detail-lede'),
    detailList=$('#detail-list'),detailImage=$('#detail-image'),detailResult=$('#detail-result'),
    detailAction=$('#detail-action'),detailTag=$('#detail-tag');
  root.inert=true; // Trap keyboard focus in the intended opening experience.
  const initialOffer=/^#solution-(web|sav|avis|prospects|crm|automation)$/.test(location.hash)
    ? location.hash.slice(10) : null;
  const escape=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const picture=id=>'<picture><source srcset="./assets/orbit-photos/'+id+'-mobile.webp" media="(max-width:680px)"><img src="./assets/orbit-photos/'+id+'-desktop.webp" alt="" width="640" height="860" loading="lazy" decoding="async"></picture>';
  cards.innerHTML=services.map((s,i)=>'<button class="offer-card" type="button" data-index="'+i+'" aria-label="Découvrir l’offre '+escape(s.name)+'">'+
    picture(s.id)+'<span class="offer-card__head"><span>MOEZ / '+String(i+1).padStart(2,'0')+' — 06</span>'+
    (i===0?'<span class="offer-card__flag">OFFRE PHARE</span>':'')+'</span>'+
    '<span class="offer-card__foot"><small>'+escape(s.tag)+'</small><strong>'+escape(s.name)+'</strong>'+
    '<span class="offer-card__action">Explorer cette offre <b aria-hidden="true">↗</b></span></span></button>').join('');
  const allCards=$$('.offer-card',cards);
  stage.addEventListener('mt:tilted-grid-ready',()=>schedule());
  const timerFill=$('#stage-timer-fill'),stageLede=$('#stage-lede'),
    stageSelectedNumber=$('#stage-selected-number'),stageExplore=$('#stage-explore');
  const serviceTabs=$$('.service-tab'),backdrops=$$('.stage-backdrop'),
        nextPreview=$('#stage-next-preview'),nextPreviewName=$('#stage-next-name'),
        autoplayInterval=4900;
  let activeBackdrop=0,backdropVersion=0,lastBackdropOffer=0;
  const mod=n=>(n+services.length)%services.length;
  function swapBackdrop(index){
    if(!backdrops.length||index===lastBackdropOffer)return;
    const version=++backdropVersion;
    const nextIndex=1-activeBackdrop;
    const next=backdrops[nextIndex],image=$('img',next);
    const mobileSource=$('source',next);
    const source='./assets/orbit-photos/'+services[index].id+'-desktop.webp';
    const mobile='./assets/orbit-photos/'+services[index].id+'-mobile.webp';
    lastBackdropOffer=index;
    if(mobileSource)mobileSource.srcset=mobile;
    image.src=source;
    const reveal=()=>{
      if(version!==backdropVersion)return;
      next.classList.add('is-active');
      backdrops[activeBackdrop].classList.remove('is-active');
      activeBackdrop=nextIndex;
    };
    if(image.decode)image.decode().catch(()=>{}).then(reveal);
    else if(image.complete)requestAnimationFrame(reveal);
    else image.addEventListener('load',reveal,{once:true});
  }
  let previousCard=-1,usingKeyboard=false,tiltRaf=0,tiltCard=null;
  document.addEventListener('keydown',e=>{if(e.key==='Tab'||e.key==='ArrowLeft'||e.key==='ArrowRight')usingKeyboard=true;});
  document.addEventListener('pointerdown',()=>{usingKeyboard=false;},{passive:true});
  function showCard(index,fromUser=false){
    motionState.active=mod(index);
    if(previousCard!==motionState.active){
      allCards.forEach(card=>{
        card.style.removeProperty('--card-tilt-x');card.style.removeProperty('--card-tilt-y');
        card.style.removeProperty('--glare-x');card.style.removeProperty('--glare-y');
      });
      previousCard=motionState.active;
    }
    allCards.forEach((card,i)=>{
      const delta=mod(i-motionState.active);
      const loc=delta===0?'center':delta===1?'right':delta===5?'left':delta===2?'far-right':delta===4?'far-left':'hidden';
      card.dataset.position=loc;
      const accessible=delta<=1||delta===5;
      card.inert=!accessible;
      card.tabIndex=accessible?0:-1;
      card.setAttribute('aria-hidden',String(!accessible));
      card.setAttribute('aria-label', (delta===0?'Explorer l’offre ':'Afficher l’offre ')+services[i].name);
      if(accessible){const img=$('img',card); if(img)img.loading='eager';}
    });
    count.textContent=String(motionState.active+1).padStart(2,'0')+' / 06';
    $('#stage-current').textContent=services[motionState.active].name.toUpperCase();
    swapBackdrop(motionState.active);
    serviceTabs.forEach((button,i)=>{
      const selected=i===motionState.active;
      button.classList.toggle('is-current',selected);
      button.setAttribute('aria-pressed',String(selected));
      const line=$('.service-tab__track span',button);
      if(line){line.style.animation='none';line.style.transform='scaleX(0)';}
    });
    stageLede.textContent=services[motionState.active].result;
    stageSelectedNumber.textContent=String(motionState.active+1).padStart(2,'0')+' / 06';
    stageExplore.setAttribute('aria-label','Découvrir l’offre '+services[motionState.active].name);
    const nextName=services[mod(motionState.active+1)].name;
    if(nextPreviewName)nextPreviewName.textContent=nextName;
    if(nextPreview)nextPreview.setAttribute('aria-label','Afficher le service suivant : '+nextName);
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
    detailAction.href='https://calendly.com/moez-thabet-881988/30min';
    const hash='#solution-'+s.id;
    if(location.hash!==hash)history.pushState({offer:s.id},'',hash);
    detail.hidden=false;
    if(focus){
      detail.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
      setTimeout(()=>detailTitle.focus({preventScroll:true}),reduced.matches?0:650);
    }
  }
  function autoBlocked(){
    // React grid has its own uninterrupted cylinder animation.
    // Do not also auto-cycle the service selectors when it is mounted.
    return stage.classList.contains('has-tilted-grid')||
      motionState.intro||motionState.flipping||motionState.film||!motionState.seen||
      motionState.dragging||motionState.focused||document.hidden||reduced.matches;
  }
  function schedule(){
    clearTimeout(motionState.timer);motionState.timer=null;
    if(!timerFill)return;
    timerFill.style.animation='none';
    const selectedTab=serviceTabs[motionState.active];
    const tabFill=selectedTab?$('.service-tab__track span',selectedTab):null;
    if(tabFill)tabFill.style.animation='none';
    if(autoBlocked()){timerFill.style.transform='scaleX(0)';return;}
    // Both the service tile and the stage indicate time to the next transition.
    void timerFill.offsetWidth;
    timerFill.style.transform='';
    timerFill.style.animation='premium-progress '+autoplayInterval+'ms linear forwards';
    if(tabFill){
      tabFill.style.transform='';
      tabFill.style.animation='premium-progress '+autoplayInterval+'ms linear forwards';
    }
    motionState.timer=setTimeout(()=>showCard(motionState.active+1),autoplayInterval);
  }
  serviceTabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>{
      showCard(i,true);
      // Keep the six category buttons visible after a direct selection.
    });
  });
  allCards.forEach((card,i)=>{
    card.addEventListener('click',()=>{
      if(motionState.swiped)return;
      // First bring a neighbouring photograph into focus; then explore.
      if(i!==motionState.active){showCard(i,true);return;}
      choose(i,true);
    });
  });
  stageExplore.addEventListener('click',()=>choose(motionState.active,true));
  $('#stage-prev').addEventListener('click',()=>showCard(motionState.active-1,true));
  $('#stage-next').addEventListener('click',()=>showCard(motionState.active+1,true));
  nextPreview?.addEventListener('click',()=>showCard(motionState.active+1,true));
  stage.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('.stage-controls'))return;
    motionState.touchStart={id:e.pointerId,x:e.clientX,y:e.clientY};
    motionState.dragging=true;schedule();
  });
  stage.addEventListener('pointerup',e=>{
    const t=motionState.touchStart;motionState.touchStart=null;
    motionState.dragging=false;
    if(!t||e.pointerId!==t.id){schedule();return;}
    const dx=e.clientX-t.x,dy=e.clientY-t.y;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25){
      motionState.swiped=true;
      showCard(motionState.active+(dx<0?1:-1),true);
      setTimeout(()=>{motionState.swiped=false;},300);
    }
    schedule();
  });
  stage.addEventListener('pointercancel',()=>{
    motionState.touchStart=null;motionState.dragging=false;schedule();
  });
  stage.addEventListener('click',e=>{
    if(motionState.swiped){e.preventDefault();e.stopPropagation();}
  },true);
  // Passive pointer hover does not freeze the carousel on desktop.
  stage.addEventListener('focusin',()=>{
    motionState.focused=usingKeyboard;schedule();
  });
  stage.addEventListener('focusout',()=>{
    motionState.focused=usingKeyboard&&stage.contains(document.activeElement);schedule();
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

  // Gently responsive cards: 3-degree maximum, limited to a fine pointer.
  const precision=matchMedia('(hover:hover) and (pointer:fine)');
  if(precision.matches&&!reduced.matches){
    allCards.forEach(card=>{
      card.addEventListener('pointermove',event=>{
        if(card.dataset.position!=='center')return;
        const rect=card.getBoundingClientRect();
        const px=Math.min(1,Math.max(0,(event.clientX-rect.left)/rect.width));
        const py=Math.min(1,Math.max(0,(event.clientY-rect.top)/rect.height));
        tiltCard=card;
        if(tiltRaf)return;
        tiltRaf=requestAnimationFrame(()=>{
          tiltRaf=0;
          if(tiltCard!==card||card.dataset.position!=='center')return;
          card.style.setProperty('--card-tilt-y',((px-.5)*5).toFixed(2)+'deg');
          card.style.setProperty('--card-tilt-x',((.5-py)*4).toFixed(2)+'deg');
          card.style.setProperty('--glare-x',(px*100).toFixed(1)+'%');
          card.style.setProperty('--glare-y',(py*100).toFixed(1)+'%');
        });
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        tiltCard=null;
        card.style.removeProperty('--card-tilt-y');
        card.style.removeProperty('--card-tilt-x');
      });
    });
  }

  // Minimal optical depth in the hero; rAF only while pointer is moving.
  const hero=$('.hero');
  if(hero&&'IntersectionObserver' in window){
    const heroObserver=new IntersectionObserver(entries=>{
      hero.classList.toggle('is-in-view',entries.some(e=>e.isIntersecting));
    },{threshold:.08});
    heroObserver.observe(hero);
  }else hero?.classList.add('is-in-view');
  if(hero&&precision.matches&&!reduced.matches){
    let targetX=0,targetY=0,x=0,y=0,raf=0;
    const tick=()=>{
      x+=(targetX-x)*.15;y+=(targetY-y)*.15;
      hero.style.setProperty('--scene-x',(-x*9).toFixed(2)+'px');
      hero.style.setProperty('--scene-y',(-y*7).toFixed(2)+'px');
      hero.style.setProperty('--depth-x',(x*19).toFixed(2)+'px');
      hero.style.setProperty('--depth-y',(y*15).toFixed(2)+'px');
      hero.style.setProperty('--depth-x-reverse',(-x*8).toFixed(2)+'px');
      hero.style.setProperty('--depth-y-reverse',(-y*7).toFixed(2)+'px');
      if(Math.abs(targetX-x)+Math.abs(targetY-y)>.005)raf=requestAnimationFrame(tick);
      else raf=0;
    };
    const wake=()=>{if(!raf)raf=requestAnimationFrame(tick);};
    hero.addEventListener('pointermove',event=>{
      const rect=hero.getBoundingClientRect();
      targetX=((event.clientX-rect.left)/rect.width-.5)*2;
      targetY=((event.clientY-rect.top)/rect.height-.5)*2;
      hero.style.setProperty('--light-x',((targetX+1)*50).toFixed(1)+'%');
      hero.style.setProperty('--light-y',((targetY+1)*50).toFixed(1)+'%');
      wake();
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{targetX=0;targetY=0;wake();});
  }

  // Scrolling reveals meaningful steps and keeps the contact navigation nearby.
  const siteHeader=$('.header'),heroElement=$('.hero');
  let scrollRaf=0;
  const updateHeader=()=>{
    scrollRaf=0;
    siteHeader?.classList.toggle('is-floating',
      !motionState.intro&&!motionState.film&&!motionState.flipping&&
      window.scrollY>Math.max(150,heroElement.offsetHeight-94));
  };
  window.addEventListener('scroll',()=>{
    if(!scrollRaf)scrollRaf=requestAnimationFrame(updateHeader);
  },{passive:true});
  if('IntersectionObserver' in window&&!reduced.matches){
    const motionElements=$$('.method-intro,.method-step,.section-head,.contact-inner');
    motionElements.forEach(el=>el.classList.add('motion-reveal'));
    document.documentElement.classList.add('has-motion');
    const ioMotion=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');ioMotion.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    motionElements.forEach(el=>ioMotion.observe(el));
  }
  updateHeader();
  const setSound=()=>{
    sound.textContent=video.muted?'Activer le son ♫':'Couper le son ✕';
    sound.setAttribute('aria-label',video.muted?'Activer le son':'Couper le son');
  };
  let fallbackTimer=null,filmReady=false;
  function cancelFallback(){clearTimeout(fallbackTimer);fallbackTimer=null;}
  function showFilmEnd(failed=false){
    if(!motionState.film)return;
    cancelFallback();
    filmLoading.classList.add('is-hidden');
    filmEnd.classList.add('is-active');
    $('#film-end-head').textContent=failed?'Découvrez mes solutions.':'Votre projet mérite mieux.';
    filmMessage.textContent=failed?'Le film n’a pas pu être chargé. Les six solutions restent accessibles immédiatement.':
      'Six expertises, un interlocuteur. Découvrez le service qui correspond à votre projet.';
    $('#film-discover').focus({preventScroll:true});
  }
  function startFilm(){
    if(motionState.flipping||motionState.film)return;
    motionState.flipping=true;motionState.film=true;motionState.intro=false;
    filmReady=false;
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
    fallbackTimer=setTimeout(()=>{if(!filmReady)showFilmEnd(true);},11000);
    setTimeout(()=>{
      film.classList.add('is-visible');
      document.body.classList.remove('is-righting');
      document.body.classList.add('is-film');
      intro.hidden=true;
      intro.inert=true;
      sound.focus({preventScroll:true});
      motionState.flipping=false;
      try{video.currentTime=0}catch{}
      if(filmReady&&!video.ended&&video.paused)video.play().catch(()=>showFilmEnd(true));
      if(!filmReady&&video.error)showFilmEnd(true);
    },reduced.matches?0:1390);
    schedule();
  }
  turn.addEventListener('click',startFilm);
  video.addEventListener('playing',()=>{filmReady=true;cancelFallback();filmLoading.classList.add('is-hidden');});
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
  // First paint keeps the true homepage upside down. Notification arrives at 1.7s.
  showCard(0);
  if(reduced.matches){intro.classList.add('is-ready');turn.focus({preventScroll:true});}
  else setTimeout(()=>{if(motionState.intro){intro.classList.add('is-ready');turn.focus({preventScroll:true});}},1700);
  window.addEventListener('load',()=>{
    // Direct offer links must still present the cinematic first impression.
    if(location.hash)window.scrollTo({top:0,behavior:'instant'});
  },{once:true});
})();