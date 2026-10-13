/* Lightweight DOM renderer of the existing photographic 3D orbit.
 * Preserves six original images, physics, touch, keyboard and service events.
 * React/framer-motion source remains in orbit-island.js for safe rollback. */
(() => {
  "use strict";
  const mount = document.getElementById("moez-orbit-root");
  if (!mount) return;
  const html = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = [
    {id:"web",name:"Sites internet",title:"Votre activité.\nUne présence remarquable.",credit:"CRÉATION DE SITES WEB — OFFRE PHARE",tag:"UN SITE PENSÉ POUR CONVAINCRE",accent:"#e6b288"},
    {id:"sav",name:"Service client",title:"Une vraie réponse.\nÀ chaque demande.",credit:"ASSISTANCE & RELATION CLIENT",tag:"UN CLIENT BIEN ACCOMPAGNÉ",accent:"#9bcbbb"},
    {id:"avis",name:"Avis clients",title:"Les avis parlent.\nJe vous aide à écouter.",credit:"E-RÉPUTATION & AMÉLIORATION",tag:"DES RETOURS QUI COMPTENT",accent:"#ddbc8b"},
    {id:"prospects",name:"Appels et relances",title:"Chaque contact.\nUne prochaine action.",credit:"PROSPECTION & SUIVI",tag:"UNE RELANCE AU BON MOMENT",accent:"#c3add6"},
    {id:"crm",name:"Dossiers clients",title:"Moins de désordre.\nPlus de maîtrise.",credit:"CRM & ORGANISATION",tag:"DES DOSSIERS SOUS CONTRÔLE",accent:"#abc7de"},
    {id:"automation",name:"Automatisation",title:"Vos outils connectés.\nVotre temps retrouvé.",credit:"WORKFLOWS & PRODUCTIVITÉ",tag:"DES TÂCHES QUI AVANCENT",accent:"#9cccca"}
  ];
  const image = id => "./assets/orbit-photos/" + id + "-" + (matchMedia("(max-width: 650px)").matches ? "mobile" : "desktop") + ".webp";
  const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fromHash = items.findIndex(item => location.hash === "#solution-" + item.id);
  let selected = fromHash >= 0 ? fromHash : 0;
  let paused = false, dragging = false, activePointer = null;
  let offset = selected, destination = selected, previousTime = 0, holdUntil = performance.now();
  let lastX = 0, dragOrigin = selected, dragStart = 0, dragTime = 0, pointerVelocity = 0;
  let dragDistance = 0, suppressClick = false, sceneVisible = true;
  let pointerX = 0, pointerY = 0, parallaxX = 0, parallaxY = 0;
  const mod = i => ((i % items.length) + items.length) % items.length;
  const clamp = (v, low, high) => Math.max(low, Math.min(high, v));
  const announce = name => window.dispatchEvent(new CustomEvent(name,{detail:{id:items[selected].id}}));

  function card(item, i) {
    const exposed = i === selected || i === mod(selected+1) || i === mod(selected-1);
    return "<button class='orbit-hero__card' type='button' data-hero-card='" + i +
      "' aria-pressed='" + (i === selected) + "' aria-hidden='" + (i !== selected && i !== mod(selected+1) && i !== mod(selected-1)) +
      "' tabindex='" + (i === selected ? "0" : "-1") + "' style='--card-accent:" + item.accent + ";pointer-events:" +
      (i === selected || i === mod(selected+1) || i === mod(selected-1) ? "auto" : "none") + "'>" +
      "<img class='orbit-hero__card-image' " + (i === selected ? "src" : "data-src") + "='" + image(item.id) + "' alt='' loading='eager' decoding='async' fetchpriority='" +
      (i === selected ? "high" : "low") + "' draggable='false'>" +
      "<div class='orbit-hero__card-tint'></div><div class='orbit-hero__card-top'><span>" +
      String(i+1).padStart(2,"0") + " / 06</span><span>↗</span></div>" +
      "<div class='orbit-hero__card-footer'><span>" + escape(item.tag) + "</span><strong>" +
      escape(item.name) + "</strong><div class='orbit-hero__card-line'><i></i><b>EXPLORER</b></div></div>" +
      "<div class='orbit-hero__card-sheen'></div></button>";
  }
  mount.innerHTML =
    "<div class='mt-orbit__viewport' aria-label='Les six offres en images et en mouvement 3D'>" +
      "<section class='orbit-hero' role='region' tabindex='0' aria-roledescription='carrousel' aria-label='Six offres de Moez Thabet, défilement tridimensionnel' style='--orbit-tone:" + items[selected].accent + "'>" +
        "<div class='orbit-hero__backdrop' aria-hidden='true'><img class='orbit-hero__background-photo' src='" + image(items[selected].id) + "' alt='' draggable='false'><div class='orbit-hero__background-wash'></div><div class='orbit-hero__grid'></div></div>" +
        "<div class='orbit-hero__top'><div></div><strong>MOEZ THABET · SIGNATURE MOTION</strong><div></div></div>" +
        "<div class='orbit-hero__narrative' aria-live='off'><span class='orbit-hero__eyebrow'><i></i> 01 — 06 / DES EXPERTISES QUI PRENNENT VIE</span><div class='orbit-hero__narrative-content'><h2></h2><p></p></div></div>" +
        "<div class='orbit-hero__world' style='touch-action:pan-y'><div class='orbit-hero__ring'>" + items.map(card).join("") + "</div></div>" +
        "<div class='orbit-hero__floor' aria-hidden='true'><div class='orbit-hero__floor-line'></div><div class='orbit-hero__floor-light'></div></div>" +
        "<div class='orbit-hero__bottom'><div class='orbit-hero__count'><strong>01</strong><span class='orbit-hero__progress'>" +
          items.map((_,i) => "<i" + (i === selected ? " class='active'" : "") + "></i>").join("") +
          "</span><small>06</small></div><div class='orbit-hero__legend'><span class='orbit-hero__legend-status'>MOUVEMENT CONTINU</span> <i></i> GLISSER · EXPLORER <b>↔</b></div></div>" +
      "</section>" +
    "</div>" +
    "<div class='mt-orbit__actionbar'><div class='mt-orbit__current' aria-live='polite'><small>OFFRE 01 / 06</small><strong>Sites internet</strong></div>" +
      "<div class='mt-orbit__actions'><button type='button' class='mt-orbit__nav' aria-label='Offre précédente'>←</button><button type='button' class='mt-orbit__nav' aria-label='Offre suivante'>→</button><button type='button' class='mt-orbit__pause' aria-pressed='false'>Ⅱ Pause</button></div>" +
      "<button type='button' class='mt-orbit__explore' data-orbit-explore>Voir ce que je peux faire pour vous <span aria-hidden='true'>↗</span></button></div>" +
    "<nav class='mt-orbit__quicknav' aria-label='Accéder directement à une des six offres'>" +
      items.map((item,i) => "<button type='button' aria-pressed='" + (i === selected) + "'><span>" +
        String(i+1).padStart(2,"0") + "</span><strong>" + escape(item.name) + "</strong></button>").join("") + "</nav>";

  const stage = mount.querySelector(".orbit-hero");
  const world = mount.querySelector(".orbit-hero__world");
  const ring = mount.querySelector(".orbit-hero__ring");
  const cards = [...mount.querySelectorAll(".orbit-hero__card")];
  const photos = [...mount.querySelectorAll(".orbit-hero__card-image")];
  const quicknav = [...mount.querySelectorAll(".mt-orbit__quicknav button")];
  const count = mount.querySelector(".orbit-hero__count strong");
  const progress = [...mount.querySelectorAll(".orbit-hero__progress i")];
  const currentSmall = mount.querySelector(".mt-orbit__current small");
  const currentName = mount.querySelector(".mt-orbit__current strong");
  const title = mount.querySelector(".orbit-hero__narrative h2");
  const subtitle = mount.querySelector(".orbit-hero__narrative p");
  const backdrop = mount.querySelector(".orbit-hero__background-photo");
  const legend = mount.querySelector(".orbit-hero__legend-status");
  const pause = mount.querySelector(".mt-orbit__pause");
  const viewport = mount.querySelector(".mt-orbit__viewport");
  let dimensions = {width:390,height:600,cardWidth:215,cardHeight:312};

  function size() {
    const rect = viewport.getBoundingClientRect();
    const w = Math.max(300,rect.width), h = Math.max(380,rect.height), small = w < 650;
    dimensions = {width:w,height:h,cardWidth:clamp(small?w*.55:w*.285,205,385),
      cardHeight:clamp(h*.52,small?245:300,small?360:460)};
    world.style.perspective = (small ? 830 : 1450) + "px";
    cards.forEach(card => {
      card.style.width = dimensions.cardWidth + "px";
      card.style.height = dimensions.cardHeight + "px";
    });
  }

  function displaySelection() {
    const item = items[selected];
    stage.style.setProperty("--orbit-tone",item.accent);
    title.innerHTML = item.title.split("\n").map(line => "<span>" + escape(line) + "</span>").join("");
    subtitle.textContent = item.credit;
    currentSmall.textContent = "OFFRE " + String(selected+1).padStart(2,"0") + " / 06";
    currentName.textContent = item.name;
    count.textContent = String(selected+1).padStart(2,"0");
    if (backdrop.getAttribute("src") !== image(item.id)) backdrop.src = image(item.id);
    cards.forEach((card,i) => {
      const active = i === selected;
      const exposed = active || i === mod(selected+1) || i === mod(selected-1);
      card.classList.toggle("orbit-hero__card--active",active);
      card.setAttribute("aria-pressed",String(active));
      card.setAttribute("aria-hidden",String(!exposed));
      card.tabIndex = active ? 0 : -1;
      card.style.pointerEvents = exposed ? "auto" : "none";
      photos[i].fetchPriority = active ? "high" : "low";
      if (active && !photos[i].getAttribute("src")) photos[i].src = photos[i].dataset.src;
    });
    quicknav.forEach((button,i) => button.setAttribute("aria-pressed",String(i === selected)));
    progress.forEach((dot,i) => dot.classList.toggle("active",i === selected));
    // On slow mobile connections, avoid racing the focused LCP photograph
    // against two nonessential neighbours. They appear as soon as it settles.
    const center = selected, featured = photos[center];
    const loadNeighbours = () => {
      if (center !== selected) return;
      for (const delta of [-1,1]) {
        const neighbour = photos[mod(center+delta)];
        if (!neighbour.getAttribute("src") && neighbour.dataset.src) {
          neighbour.src = neighbour.dataset.src;
        }
      }
    };
    if (featured.complete && featured.naturalWidth) setTimeout(loadNeighbours,250);
    else {
      featured.addEventListener("load",() => setTimeout(loadNeighbours,250),{once:true});
      featured.addEventListener("error",loadNeighbours,{once:true});
    }
  }

  // Hidden back-facing photographs are not needed for first paint.
  // Load them after the focused photograph, without dropping any of the six.
  let remainingStarted = false;
  function loadRemainingPhotos() {
    if (remainingStarted) return;
    remainingStarted = true;
    const run = () => photos.forEach(photo => {
      if (!photo.getAttribute("src") && photo.dataset.src) photo.src = photo.dataset.src;
    });
    if ("requestIdleCallback" in window) requestIdleCallback(run,{timeout:1200});
    else setTimeout(run,160);
  }
  const focusedPhoto = photos[selected];
  if (focusedPhoto.complete && focusedPhoto.naturalWidth) setTimeout(loadRemainingPhotos,4800);
  else focusedPhoto.addEventListener("load",()=>setTimeout(loadRemainingPhotos,4800),{once:true});
  setTimeout(loadRemainingPhotos,8400);

  function choice(index, notify = false, resetHold = true) {
    index = mod(index);
    const didChange = index !== selected;
    selected = index;
    destination = index + 6*Math.round((offset-index)/6);
    if (resetHold) holdUntil = performance.now() + 2100;
    if (didChange) displaySelection();
    if (notify) announce("mt:journey-select");
  }

  function explore(index = selected) {
    const service = items[mod(index)].id;
    const link = document.querySelector('[data-offer-link="' + service + '"]');
    if (link) link.click();
    else {
      location.hash = "#solution-" + service;
      document.getElementById("solution-" + service)?.scrollIntoView({behavior:reduced?"auto":"smooth"});
      window.dispatchEvent(new CustomEvent("mt:journey-detail",{detail:{id:service}}));
    }
    holdUntil = performance.now() + 2500;
  }

  function physics() {
    const {width:w} = dimensions, small = w < 650;
    const span = small ? Math.max(190,w*.48) : Math.min(w*.42,560);
    const depth = small ? 250 : 375, drop = small ? 18 : 28;
    const px = clamp(parallaxX,-1,1), py = clamp(parallaxY,-1,1);
    ring.style.transform = "translate3d(" + (px*(small?4:13)).toFixed(2) + "px," +
      (py*(small?3:8)).toFixed(2) + "px,0) rotateX(" + (-py*(small?.5:2)).toFixed(2) + "deg)";
    cards.forEach((card,i) => {
      const a = (i-offset)*Math.PI*2/items.length;
      const sine = Math.sin(a), cosine = Math.cos(a);
      const x = sine*span, y = (1-cosine)*drop+sine*12, z = (cosine-1)*depth;
      const rotateY = -sine*(small?38:48), rotateZ = sine*3.2;
      const scale = .67+.33*((cosine+1)/2);
      card.style.transform = "translate3d(calc(-50% + " + x.toFixed(2) + "px)," +
        y.toFixed(2) + "px," + z.toFixed(2) + "px) rotateY(" +
        rotateY.toFixed(2) + "deg) rotateZ(" + rotateZ.toFixed(2) +
        "deg) scale(" + scale.toFixed(4) + ")";
      card.style.opacity = String(clamp(.14+.86*(cosine+1)/2,.14,1));
      card.style.zIndex = String(100+Math.round(cosine*30));
    });
  }

  function animate(now) {
    const elapsed = previousTime ? clamp(now-previousTime,0,50) : 16;
    previousTime = now;
    const usable = !document.hidden && sceneVisible;
    if (!dragging) {
      if (reduced) {
        offset = destination;
      } else {
        const diff = destination-offset;
        if (Math.abs(diff) > .004) {
          offset += diff*(1-Math.exp(-elapsed/175));
        } else if (!paused && usable && now >= holdUntil) {
          offset += elapsed/5900;
          destination = offset;
          const focus = mod(Math.round(offset));
          if (focus !== selected) {
            selected = focus;
            displaySelection();
          }
        }
      }
      parallaxX *= .96;
      parallaxY *= .96;
    }
    if (usable || dragging) physics();
    requestAnimationFrame(animate);
  }

  // Browser hit-testing can target the 3D world rather than the visible
  // photograph. Resolve only truly exposed card rectangles, front to back.
  let tapCandidate = null;
  function hitCard(x,y) {
    const hits = cards.filter(card => {
      if (card.getAttribute("aria-hidden") === "true" || card.style.pointerEvents === "none") return false;
      const rect = card.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
    hits.sort((a,b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0));
    return hits.length ? Number(hits[0].dataset.heroCard) : null;
  }
  world.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const ownCard = event.target instanceof Element ? event.target.closest("[data-hero-card]") : null;
    tapCandidate = ownCard ? Number(ownCard.dataset.heroCard) : hitCard(event.clientX,event.clientY);
    activePointer = event.pointerId;
    dragging = true;
    dragStart = lastX = event.clientX;
    dragOrigin = offset;
    dragTime = performance.now();
    dragDistance = pointerVelocity = 0;
    world.classList.add("orbit-hero__world--dragging");
  });
  world.addEventListener("pointermove", event => {
    if (!dragging || event.pointerId !== activePointer) {
      if (event.pointerType === "mouse" && !reduced) {
        const bounds = world.getBoundingClientRect();
        parallaxX = clamp(((event.clientX-bounds.left)/bounds.width-.5)*2,-1,1);
        parallaxY = clamp(((event.clientY-bounds.top)/bounds.height-.5)*2,-1,1);
      }
      return;
    }
    const deltaX = event.clientX-dragStart;
    dragDistance = Math.max(dragDistance,Math.abs(deltaX));
    if (dragDistance > 9 && !world.hasPointerCapture(event.pointerId)) {
      try {world.setPointerCapture(event.pointerId);} catch {}
    }
    const unit = Math.max(120,dimensions.width*(dimensions.width<650?.48:.27));
    offset = dragOrigin-deltaX/unit;
    const now=performance.now(),dt=Math.max(16,now-dragTime);
    pointerVelocity = clamp(-(event.clientX-lastX)*1000/(dt*unit),-2.7,2.7);
    lastX=event.clientX;dragTime=now;
    const focus=mod(Math.round(offset));
    if (focus !== selected) {selected=focus;displaySelection();}
    physics();
  },{passive:true});
  function release(event) {
    if (!dragging || event.pointerId !== activePointer) return;
    dragging = false; activePointer = null;
    world.classList.remove("orbit-hero__world--dragging");
    if (world.hasPointerCapture(event.pointerId)) {
      try {world.releasePointerCapture(event.pointerId);} catch {}
    }
    if (dragDistance>9) {
      suppressClick = true;
      setTimeout(() => {suppressClick=false;dragDistance=0;},220);
      const next= Math.round(offset + pointerVelocity*.11);
      selected=mod(next);
      destination=next;
      displaySelection();
      announce("mt:journey-select");
      holdUntil=performance.now()+2100;
    } else {
      destination = Math.round(offset);
      holdUntil = performance.now()+1900;
    }
  }
  world.addEventListener("pointerup",release);
  world.addEventListener("pointercancel",release);
  world.addEventListener("pointerleave",() => {if(!dragging){parallaxX=0;parallaxY=0;}});
  world.addEventListener("click",event => {
    if (suppressClick || dragDistance > 9) return;
    if (event.target instanceof Element && event.target.closest("[data-hero-card]")) return;
    const index = tapCandidate === null ? hitCard(event.clientX,event.clientY) : tapCandidate;
    tapCandidate = null;
    if (index !== null) explore(index);
  });
  cards.forEach((card,i) => card.addEventListener("click",event => {
    if (suppressClick || dragDistance>9) {event.preventDefault();return;}
    tapCandidate = null;
    explore(i);
  }));
  quicknav.forEach((button,i)=>button.addEventListener("click",()=>choice(i,true)));
  const arrows=[...mount.querySelectorAll(".mt-orbit__nav")];
  arrows[0].addEventListener("click",()=>choice(selected-1,true));
  arrows[1].addEventListener("click",()=>choice(selected+1,true));
  mount.querySelector(".mt-orbit__explore").addEventListener("click",()=>explore());
  pause.addEventListener("click",()=>{
    paused=!paused;
    pause.setAttribute("aria-pressed",String(paused));
    pause.textContent=paused?"▷ Animer":"Ⅱ Pause";
    destination=Math.round(offset);
    const focus=mod(destination);
    if(focus!==selected){selected=focus;displaySelection();}
    holdUntil=performance.now()+1700;
    legend.textContent=paused || reduced?"MODE MANUEL":"MOUVEMENT CONTINU";
  });
  stage.addEventListener("keydown",event=>{
    const actions={ArrowRight:()=>choice(selected+1,true),ArrowLeft:()=>choice(selected-1,true),
      Home:()=>choice(0,true),End:()=>choice(5,true)};
    if(actions[event.key]){event.preventDefault();actions[event.key]();}
  });
  world.addEventListener("wheel",event=>{
    if(Math.abs(event.deltaX) < Math.abs(event.deltaY)*1.15)return;
    event.preventDefault();
    choice(selected+(event.deltaX>0?1:-1),true);
  },{passive:false});
  window.addEventListener("mt:orbit-go",event=>{
    const id=event.detail?.id;
    const index=items.findIndex(item=>item.id===id);
    if(index>=0)choice(index,false);
  });
  addEventListener("resize",()=>{size();physics();},{passive:true});
  addEventListener("visibilitychange",()=>{if(!document.hidden)holdUntil=performance.now()+350;});
  if("IntersectionObserver" in window) {
    const observer=new IntersectionObserver(entries=>{
      sceneVisible=entries.some(entry=>entry.isIntersecting);
    },{rootMargin:"100px",threshold:.01});
    observer.observe(viewport);
  }
  size();
  displaySelection();
  physics();
  if(reduced)legend.textContent="MODE MANUEL";
  requestAnimationFrame(animate);
  html.classList.add("mt-orbit-mounted");
  mount.closest(".mt-orbit-showcase")?.classList.add("mt-orbit-ready");
  window.dispatchEvent(new CustomEvent("mt:orbit-ready"));
})();