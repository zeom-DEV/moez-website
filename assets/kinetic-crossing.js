(() => {
  'use strict';
  const root=document.querySelector('[data-kinetic-showcase]');
  if(!root)return;
  const stage=root.querySelector('[data-kinetic-stage]');
  const cards=[...root.querySelectorAll('[data-kinetic-card]')];
  const directChoices=[...root.querySelectorAll('[data-kinetic-choice]')];
  const title=root.querySelector('[data-kinetic-title]');
  const pitch=root.querySelector('[data-kinetic-pitch]');
  const indexLabel=root.querySelector('[data-kinetic-counter]');
  const link=root.querySelector('[data-kinetic-cta]');
  const live=root.querySelector('[data-kinetic-live]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const carousel=document.getElementById('services-carousel');
  const offers=[
    {id:'web',title:'Sites internet',pitch:'Votre activité mérite un site clair, personnalisé et conçu pour faciliter le contact.'},
    {id:'automation',title:'Automatisation',pitch:'Moins de tâches répétitives. Plus de temps pour développer votre activité.'},
    {id:'sav',title:'Service client',pitch:'Chaque demande reçoit une réponse et un suivi organisé.'},
    {id:'avis',title:'Avis clients',pitch:'Une réputation suivie grâce à des réponses professionnelles et des problèmes identifiés.'},
    {id:'prospects',title:'Appels et relances',pitch:'Vos contacts sont qualifiés et les prochaines actions sont suivies.'},
    {id:'crm',title:'Dossiers clients',pitch:'Les informations sont organisées et les priorités deviennent visibles.'}
  ];
  const count=offers.length;
  const key=location.hash.slice(1).replace(/^solution-/,'');
  let active=Math.max(0,offers.findIndex(o=>o.id===key));
  let direction=1,visible=false,hover=false,focused=false,moving=false,timer=0,manualUntil=0;
  let queued=null;
  const mod=n=>(n%count+count)%count;
  function slot(index,center){
    let delta=mod(index-center);
    if(delta>3)delta-=count;
    if(delta===0)return {x:0,y:0,z:180,ry:0,rz:0,scale:1.06,alpha:1};
    const w=stage.clientWidth;
    const x1=Math.min(205,w*.41),x2=Math.min(285,w*.48),y1=Math.min(70,w*.14);
    if(Math.abs(delta)===1)return {x:Math.sign(delta)*x1,y:-Math.sign(delta)*y1,z:0,ry:-Math.sign(delta)*24,rz:Math.sign(delta)*11,scale:.84,alpha:.87};
    if(Math.abs(delta)===2)return {x:Math.sign(delta)*x2,y:Math.sign(delta)*95,z:-160,ry:-Math.sign(delta)*45,rz:-Math.sign(delta)*13,scale:.68,alpha:.52};
    return {x:0,y:-126,z:-245,ry:0,rz:0,scale:.53,alpha:.17};
  }
  const interpolate=(a,b,n)=>Object.fromEntries(Object.keys(a).map(k=>[k,a[k]+(b[k]-a[k])*n]));
  function transform(p){return 'translate(-50%, -50%) translate3d('+p.x+'px, '+p.y+'px, '+p.z+'px) rotateY('+p.ry+'deg) rotateZ('+p.rz+'deg) scale('+p.scale+')';}
  function apply(card,pos,index){
    card.style.transform=transform(pos);
    card.style.opacity=String(pos.alpha);
    card.style.zIndex=String(index===active?20:Math.round(pos.alpha*10));
    card.dataset.active=String(index===active);
    card.setAttribute('aria-pressed',String(index===active));
  }
  function copy(announce){
    const item=offers[active];
    title.textContent=item.title;
    pitch.textContent=item.pitch;
    indexLabel.textContent=String(active+1).padStart(2,'0')+' / 06';
    link.href='#solution-'+item.id;
    link.setAttribute('aria-label','Voir les détails du service : '+item.title);
    directChoices.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.kineticChoice===item.id)));
    if(announce)live.textContent=item.title+', offre '+(active+1)+' sur six';
  }
  function render(){
    cards.forEach((card,i)=>apply(card,slot(i,active),i));
  }
  function canAuto(){return visible&&!hover&&!focused&&!document.hidden&&!reduce.matches&&!connection?.saveData&&Date.now()>=manualUntil;}
  function schedule(){
    clearTimeout(timer);
    if(!visible||reduce.matches||connection?.saveData||document.hidden)return;
    timer=setTimeout(()=>{
      if(canAuto()&&!moving){
        if(active===count-1)direction=-1;
        else if(active===0)direction=1;
        select(active+direction,false,direction);
      }
      schedule();
    },4200);
  }
  function select(newIndex,manual=false,dir=1){
    newIndex=mod(newIndex);
    if(manual){manualUntil=Date.now()+8000;live.textContent='';}
    if(newIndex===active){if(manual)copy(true);schedule();return;}
    if(moving){queued={newIndex,manual,dir};return;}
    const previous=active;
    const old=cards.map((_,i)=>slot(i,previous));
    const next=cards.map((_,i)=>slot(i,newIndex));
    active=newIndex;copy(manual);
    cards.forEach((card,i)=>apply(card,next[i],i));
    if(manual&&carousel){
      const choice=[...carousel.querySelectorAll('[data-offer-link]')].findIndex(el=>el.dataset.offerLink===offers[active].id);
      if(choice!==-1)carousel.dispatchEvent(new CustomEvent('mt:kinetic-select',{detail:{index:choice}}));
    }
    if(reduce.matches||connection?.saveData||!visible){schedule();return;}
    moving=true;root.dataset.kineticBusy='true';
    const all=cards.map((card,i)=>{
      let mid=interpolate(old[i],next[i],.5);
      if(i===previous)mid={x:dir*76,y:-dir*60,z:240,ry:dir*24,rz:dir*9,scale:1.12,alpha:.52};
      if(i===newIndex)mid={x:-dir*68,y:dir*66,z:270,ry:-dir*26,rz:-dir*9,scale:1.16,alpha:1};
      const anim=card.animate([
        {transform:transform(old[i]),opacity:old[i].alpha,offset:0},
        {transform:transform(mid),opacity:mid.alpha,offset:.52},
        {transform:transform(next[i]),opacity:next[i].alpha,offset:1}
      ],{duration:960,easing:'cubic-bezier(.24,.72,.22,1)',fill:'both'});
      return anim.finished.catch(()=>{}).then(()=>anim.cancel());
    });
    Promise.all(all).then(()=>{
      moving=false;root.dataset.kineticBusy='false';render();
      if(queued){const q=queued;queued=null;select(q.newIndex,q.manual,q.dir);}
      schedule();
    });
  }
  function manualSelect(index){
    const forward=mod(index-active),backward=mod(active-index);
    select(index,true,forward<=backward?1:-1);
  }
  cards.forEach((card,i)=>card.addEventListener('click',()=>{
    if(i!==active){manualSelect(i);return;}
    // Clicking the focused card opens its full service description.
    location.hash='#solution-'+offers[active].id;
  }));
  directChoices.forEach(button=>button.addEventListener('click',()=>manualSelect(offers.findIndex(offer=>offer.id===button.dataset.kineticChoice))));
  root.querySelector('[data-kinetic-prev]').addEventListener('click',()=>manualSelect(active-1));
  root.querySelector('[data-kinetic-next]').addEventListener('click',()=>manualSelect(active+1));
  stage.addEventListener('keydown',e=>{
    const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1}[e.key];
    if(delta===undefined||e.altKey||e.metaKey||e.ctrlKey)return;
    e.preventDefault();manualSelect(active+delta);
    cards[active].focus({preventScroll:true});
  });
  let touch=null;
  stage.addEventListener('touchstart',e=>{
    const t=e.changedTouches[0];touch={x:t.clientX,y:t.clientY};manualUntil=Date.now()+8000;
  },{passive:true});
  stage.addEventListener('touchend',e=>{
    if(!touch)return;
    const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)manualSelect(active+(dx<0?1:-1));
  },{passive:true});
  root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;clearTimeout(timer);}});
  root.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hover=false;schedule();}});
  root.addEventListener('focusin',()=>{focused=true;clearTimeout(timer);});
  root.addEventListener('focusout',()=>{queueMicrotask(()=>{focused=root.contains(document.activeElement);schedule();});});
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      visible=entries.some(entry=>entry.isIntersecting);
      if(!visible)clearTimeout(timer);else schedule();
    },{threshold:.12});
    observer.observe(root);
  }else{visible=true;schedule();}
  window.addEventListener('resize',render,{passive:true});
  document.addEventListener('visibilitychange',schedule);
  reduce.addEventListener?.('change',()=>{render();schedule();});
  connection?.addEventListener?.('change',schedule);
  // Reuse the established six-offer selection when the visitor navigates by URL or the wheel.
  carousel?.addEventListener('mt:offer-select',e=>{
    const option=carousel.querySelectorAll('[data-offer-link]')[e.detail.index];
    const idx=offers.findIndex(o=>o.id===option?.dataset.offerLink);
    if(idx>=0&&idx!==active)select(idx,false,idx>active?1:-1);
  });
  root.dataset.kineticBusy='false';copy(false);render();
})();
