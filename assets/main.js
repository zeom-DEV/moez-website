(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CALENDLY = 'https://calendly.com/moez-thabet-881988/30min';
  const EMAIL = 'Contact@moezthabet.com';

  // Accessible navigation
  const menu = $('#menu-button');
  const nav = $('#mobile-nav');
  if (menu && nav) {
    const toggle = (open) => {
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.textContent = open ? '×' : '☰';
      nav.classList.toggle('open', open);
    };
    menu.addEventListener('click', () => toggle(menu.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach(link => link.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  // Scroll progress + sticky conversion action; passive for responsive performance.
  const progress = $('#site-progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Reveal on scroll; only enable visual hiding when IntersectionObserver is available.
  if ('IntersectionObserver' in window && !prefersReduced) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {entry.target.classList.add('revealed'); observer.unobserve(entry.target);}
      });
    }, {threshold:.07, rootMargin:'0px 0px -30px 0px'});
    $$('[data-reveal]').forEach(el => observer.observe(el));
  }

  // Hero portrait: subtle depth/parallax, no synthetic talking face and no motion on touch.
  const art = $('#hero-art');
  const stage = $('#portrait-stage');
  if (art && stage && !prefersReduced && matchMedia('(pointer:fine)').matches) {
    let raf = 0, x = 0, y = 0;
    const update = () => {
      stage.style.transform = `rotateY(${x * 4}deg) rotateX(${y * -3}deg) translate3d(${x * 6}px,${y * 6}px,0)`;
      raf = 0;
    };
    art.addEventListener('pointermove', e => {
      const rect = art.getBoundingClientRect();
      x = (e.clientX - rect.left) / rect.width * 2 - 1;
      y = (e.clientY - rect.top) / rect.height * 2 - 1;
      if (!raf) raf = requestAnimationFrame(update);
    }, {passive:true});
    art.addEventListener('pointerleave', () => {x=0;y=0;if(!raf) raf=requestAnimationFrame(update);});
  }

  // Interactive operations lab. Demonstrations are fictional and explicitly labelled.
  const scenarios = [
    {
      name:'Une réclamation SAV',title:'Une livraison qui inquiète.',kind:'SAV / E-COMMERCE',
      message:'« Bonjour, ma commande devait arriver il y a cinq jours et je n’ai aucune nouvelle. Pouvez-vous m’aider ? »',
      stages:['Écoute','Diagnostic','Action','Suivi'],
      results:[
        'Accusé de réception personnalisé, reformulation claire du problème et prise en charge du dossier.',
        'Vérification des informations de commande et du suivi transporteur dans les outils autorisés.',
        'Explication transparente de la situation, proposition adaptée et escalade si nécessaire.',
        'Suivi jusqu’à la résolution, mise à jour du CRM et clôture documentée.'
      ]
    },
    {
      name:'Une opportunité d’avis',title:'Un client satisfait à écouter.',kind:'E-RÉPUTATION / TRUSTPILOT',
      message:'« Merci pour votre aide ! Le problème est résolu et le produit me convient très bien. »',
      stages:['Validation','Invitation','Neutralité','Analyse'],
      results:[
        'Vérification que la situation a été résolue et que le client est éligible à une invitation selon les règles applicables.',
        'Envoi d’une invitation neutre à laisser un avis honnête, sans imposer de note ni proposer d’avantage.',
        'Aucune sélection discriminatoire : les avis positifs comme négatifs sont accueillis.',
        'Suivi agrégé des retours afin de repérer les irritants et les opportunités d’amélioration.'
      ]
    },
    {
      name:'Un lead à qualifier',title:'Une demande commerciale entrante.',kind:'TÉLÉVENTE / CRM',
      message:'« Nous cherchons une solution, mais nous devons d’abord comparer les options et valider le budget. »',
      stages:['Contexte','Besoin','Qualification','Relance'],
      results:[
        'Identification du contexte du prospect et écoute active de ses priorités.',
        'Clarification de son problème, des critères de choix et du calendrier envisagé.',
        'Qualification objective des prochaines étapes et inscription des informations utiles dans le CRM.',
        'Relance personnalisée au bon moment, avec trace des échanges et respect du consentement.'
      ]
    }
  ];
  let scenarioIndex = 0, stageIndex = 0;
  const labButtons = $$('[data-scenario]');
  const stageBack = $('#stage-back');
  const stageNext = $('#stage-next');
  const updateLab = () => {
    const data = scenarios[scenarioIndex];
    if (!$('#screen-title')) return;
    $('#screen-title').textContent = data.title;
    $('#screen-tag').textContent = data.kind;
    $('#screen-message').textContent = data.message;
    $('#screen-result').textContent = data.results[stageIndex];
    $('#stage-count').textContent = `${stageIndex+1} / 4`;
    $$('.flow-step').forEach((el, i) => {
      el.classList.toggle('active', i <= stageIndex);
      $('.circle', el).textContent = i < stageIndex ? '✓' : (i+1);
      $('small',el).textContent = data.stages[i];
    });
    labButtons.forEach((el,i) => el.setAttribute('aria-pressed',String(i===scenarioIndex)));
    if(stageBack) stageBack.disabled=stageIndex===0;
    if(stageNext) stageNext.textContent=stageIndex===3?'Recommencer ↺':'Étape suivante →';
  };
  labButtons.forEach((button,i) => button.addEventListener('click',() => {scenarioIndex=i;stageIndex=0;updateLab();}));
  if(stageBack)stageBack.addEventListener('click',()=>{stageIndex=Math.max(0,stageIndex-1);updateLab();});
  if(stageNext)stageNext.addEventListener('click',()=>{stageIndex=stageIndex===3?0:stageIndex+1;updateLab();});
  updateLab();

  // Booking: original external link remains functional without JS; iframe is lazy on desktop only.
  const dialog=$('#booking-dialog');
  let lastFocus;
  $$('a[data-book]').forEach(link=>link.addEventListener('click', e=>{
    if(!dialog || typeof dialog.showModal!=='function' || matchMedia('(max-width:800px)').matches) return;
    e.preventDefault();
    lastFocus=document.activeElement;
    const slot=$('#calendly-slot');
    if(slot && !slot.querySelector('iframe')){
      const frame=document.createElement('iframe');
      frame.title='Calendly — réserver un appel de 30 minutes avec Moez';
      frame.src=CALENDLY+'?hide_gdpr_banner=0';
      frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
      frame.setAttribute('allow','payment *');
      slot.append(frame);
    }
    dialog.showModal();document.body.style.overflow='hidden';
    window.dispatchEvent(new CustomEvent('mt:booking_open',{detail:{placement:link.dataset.placement||'unknown'}}));
  }));
  if(dialog){
    const close=()=>dialog.close();
    $('#booking-close')?.addEventListener('click',close);
    dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
    dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus();});
  }

  // Prospect brief: local-only generation. No collection, no fake send.
  const briefForm=$('#brief-form'),resultBox=$('#brief-result');
  if(briefForm && resultBox){
    briefForm.addEventListener('submit',e=>{
      e.preventDefault();
      if(!briefForm.reportValidity())return;
      const data=new FormData(briefForm);
      const lines=[
        'Bonjour Moez,',
        '',
        `Je souhaite échanger concernant : ${String(data.get('service')||'à préciser')}.`,
        `Format envisagé : ${String(data.get('format')||'à définir')}.`,
        `Entreprise : ${String(data.get('company')||'Non renseignée')}.`,
        `Mon besoin : ${String(data.get('message')||'Je souhaiterais en discuter avec vous.')}.`,
        '',
        'Pouvez-vous me proposer un premier échange ?',
        'Bien cordialement'
      ];
      const message=lines.join('\n');
      $('#brief-output').value=message;
      const subject='Demande de mission — '+String(data.get('service')||'Relation client');
      $('#brief-send').href='mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
      resultBox.hidden=false;
      resultBox.scrollIntoView({behavior:prefersReduced?'auto':'smooth',block:'nearest'});
      window.dispatchEvent(new CustomEvent('mt:brief_generated',{detail:{service:String(data.get('service')||'')}}));
    });
    $('#brief-copy')?.addEventListener('click',async e=>{
      const text=$('#brief-output').value;
      try{await navigator.clipboard.writeText(text);e.currentTarget.textContent='Copié ✓';}
      catch{const output=$('#brief-output');output.focus();output.select();e.currentTarget.textContent='Sélectionné — copier';}
    });
  }
})();
