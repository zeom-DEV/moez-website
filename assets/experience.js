(() => {
  'use strict';
  const intro = document.getElementById('inversion-intro');
  const flip = document.getElementById('intro-flip');
  const skip = document.getElementById('intro-skip');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introKey = 'mt-signature-intro-2026-v4';
  let completed = false;
  let stageTimer = 0;
  let hideTimer = 0;
  const shouldSkip = () => { try { return sessionStorage.getItem(introKey) === 'done'; } catch { return false; } };
  const remember = () => { try { sessionStorage.setItem(introKey,'done'); } catch { /* Storage may be unavailable. */ } };
  const closeIntro = (instant = false, toDiagnostic = false) => {
    if (!intro || completed) return;
    completed = true; remember();
    clearTimeout(stageTimer); clearTimeout(hideTimer);
    if (instant) { intro.classList.add('is-hidden'); intro.setAttribute('aria-hidden','true'); document.body.classList.remove('intro-active'); return; }
    intro.classList.add('is-exiting');
    hideTimer = setTimeout(() => { intro.classList.add('is-hidden'); intro.setAttribute('aria-hidden','true'); document.body.classList.remove('intro-active'); if(toDiagnostic){ const section=document.getElementById('diagnostic'); if(section){ section.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'}); setTimeout(()=>document.getElementById('diagnostic-title')?.setAttribute('tabindex','-1'),60); setTimeout(()=>document.getElementById('diagnostic-title')?.focus({preventScroll:true}),450); }} else { document.querySelector('.hero-actions .button')?.focus({preventScroll:true}); } }, 480);
  };
  const rightSite = () => {
    if (!intro || completed || intro.classList.contains('is-righted')) return;
    if (reduce) { closeIntro(false,true); return; }
    intro.classList.add('is-righted');
    stageTimer = setTimeout(() => {
      closeIntro(false,false);
      setTimeout(() => window.dispatchEvent(new CustomEvent('moez:film-play-request')), 520);
    }, 1100);
  };
  const replay = () => {
    if (!intro) return;
    completed = false;
    clearTimeout(stageTimer); clearTimeout(hideTimer);
    intro.classList.remove('is-hidden','is-exiting','is-righted');
    intro.removeAttribute('aria-hidden'); document.body.classList.add('intro-active');
    scrollTo({top:0,behavior:'instant'});
    flip?.focus({preventScroll:true});
  };
  if (intro && flip && skip) {
    if (shouldSkip()) closeIntro(true);
    else { document.body.classList.add('intro-active'); requestAnimationFrame(() => document.getElementById('intro-dialog')?.focus({preventScroll:true})); }
    flip.addEventListener('click', rightSite);
    skip.addEventListener('click', () => closeIntro(true));
    intro.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); closeIntro(true); }
      if (e.key === 'Tab') {
        const buttons = [skip,flip];
        const i = buttons.indexOf(document.activeElement);
        if ((e.shiftKey && i===0) || (!e.shiftKey && i===1)) { e.preventDefault(); buttons[e.shiftKey?1:0].focus(); }
      }
    });
    document.querySelectorAll('[data-replay-flip]').forEach(b => b.addEventListener('click', replay));
    document.addEventListener('visibilitychange', () => { if (document.hidden && intro.classList.contains('is-righted')) closeIntro(true); });
  }
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
