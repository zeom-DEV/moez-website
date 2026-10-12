import * as React from "react"
import { createRoot } from "react-dom/client"
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel"
import "./hero-carousel.css"

type Service = {id:string;name:string;title:string;credit:string;accent:string;image:string}
const asset = (photo:string) => "https://images.unsplash.com/" + photo + "?auto=format&fit=crop&w=720&h=1000&q=76"
// The six licensed illustrative photographs and original 3D physics come from
// the exact preview requested. They are illustrative, never client projects.
const services:Service[] = [
 {id:"web",name:"Sites internet",title:"Votre activité.\nUne présence remarquable.",credit:"CRÉATION DE SITES WEB — OFFRE PHARE",accent:"#e6b288",image:asset("photo-1778146476147-5f8d4bd03c79")},
 {id:"sav",name:"Service client",title:"Une vraie réponse.\nÀ chaque demande.",credit:"ASSISTANCE & RELATION CLIENT",accent:"#9bcbbb",image:asset("photo-1712159018726-4564d92f3ec2")},
 {id:"avis",name:"Avis clients",title:"Les avis parlent.\nJe vous aide à écouter.",credit:"E-RÉPUTATION & AMÉLIORATION",accent:"#ddbc8b",image:asset("photo-1633613286991-611fe299c4be")},
 {id:"prospects",name:"Appels et relances",title:"Chaque contact.\nUne prochaine action.",credit:"PROSPECTION & SUIVI",accent:"#c3add6",image:asset("photo-1758876204242-787309002a8f")},
 {id:"crm",name:"Dossiers clients",title:"Moins de désordre.\nPlus de maîtrise.",credit:"CRM & ORGANISATION",accent:"#abc7de",image:asset("photo-1770681381576-f1fdceb2ea01")},
 {id:"automation",name:"Automatisation",title:"Vos outils connectés.\nVotre temps retrouvé.",credit:"WORKFLOWS & PRODUCTIVITÉ",accent:"#9cccca",image:asset("photo-1773966071293-bea3d7646fd1")}
]
const items:HeroCarouselItem[]=services.map(s=>({id:s.id,title:s.title,credit:s.credit,accent:s.accent,image:s.image,meta:[s.credit]}))
const root=document.getElementById("moez-orbit-root")
function safeEvent(type:string,id:string){window.dispatchEvent(new CustomEvent(type,{detail:{id}}))}
function App(){
  const [index,setIndex]=React.useState(()=>{
    const id=location.hash.replace(/^#solution-/,"")
    return Math.max(0,services.findIndex(s=>s.id===id))
  })
  const [playing,setPlaying]=React.useState(true)
  const intentAt=React.useRef(0)
  const indexRef=React.useRef(index)
  const reduce=typeof matchMedia!=="undefined"&&matchMedia("(prefers-reduced-motion: reduce)").matches
  const current=services[index]
  const intent=()=>{intentAt.current=performance.now()}
  React.useEffect(()=>{
    const navigate=(e:Event)=>{
      const id=(e as CustomEvent).detail?.id as string
      const found=services.findIndex(s=>s.id===id)
      if(found>=0&&found!==indexRef.current){setIndex(found);indexRef.current=found}
    }
    window.addEventListener("mt:orbit-go",navigate)
    return()=>window.removeEventListener("mt:orbit-go",navigate)
  },[])
  function chosen(next:number){
    indexRef.current=next
    setIndex(next)
    // Auto-rotation is cinematic, not navigation; never change the visitor's
    // detail panel or spawn notifications from passive autoplay.
    if(performance.now()-intentAt.current<2000){
      safeEvent("mt:journey-select",services[next].id)
      intentAt.current=0
    }
  }
  function stepBy(delta:number){
    intent()
    const next=(indexRef.current+delta+6)%6
    indexRef.current=next
    setIndex(next)
    safeEvent("mt:journey-select",services[next].id)
  }
  function pick(i:number){
    intent()
    indexRef.current=i
    setIndex(i)
    safeEvent("mt:journey-select",services[i].id)
  }
  function openDetail(){
    intent()
    const id=current.id
    // Reuse the existing native six-service selector to keep the existing
    // history, panels, form, keyboard and direct links working.
    const chooser=document.querySelector<HTMLAnchorElement>('[data-offer-link="'+id+'"]')
    if(chooser)chooser.click()
    else{location.hash="#solution-"+id;document.getElementById("solution-"+id)?.scrollIntoView({behavior:reduce?"auto":"smooth"});safeEvent("mt:journey-detail",id)}
  }
  return <>
    <div className="mt-orbit__viewport"
       onPointerUpCapture={intent}
       onClickCapture={intent}
       onKeyDownCapture={e=>{if(["ArrowLeft","ArrowRight","Home","End","Enter"," "].includes(e.key))intent()}}
       aria-label="Les six offres en images et en mouvement 3D">
      <HeroCarousel items={items} index={index} onIndexChange={chosen}
          brand="MOEZ THABET — SIGNATURE MOTION"
          autoplay={playing&&!reduce} autoplayDelay={5900}/>
    </div>
    <div className="mt-orbit__actionbar">
      <div className="mt-orbit__current" aria-live="polite">
        <small>OFFRE {String(index+1).padStart(2,"0")} / 06</small>
        <strong>{current.name}</strong>
      </div>
      <div className="mt-orbit__actions">
        <button type="button" className="mt-orbit__nav" onClick={()=>stepBy(-1)} aria-label="Offre précédente">←</button>
        <button type="button" className="mt-orbit__nav" onClick={()=>stepBy(1)} aria-label="Offre suivante">→</button>
        <button type="button" className="mt-orbit__pause" onClick={()=>setPlaying(p=>!p)}
          aria-pressed={!playing}>{playing&&!reduce?"Ⅱ Pause":"▷ Animer"}</button>
      </div>
      <button className="mt-orbit__explore" type="button" onClick={openDetail}
        data-orbit-explore aria-label={"Découvrir les tâches et le résultat du service "+current.name}>
        Voir ce que je peux faire pour vous <span aria-hidden="true">↗</span>
      </button>
    </div>
    <nav className="mt-orbit__quicknav" aria-label="Accéder directement à l'une des six offres">
      {services.map((s,i)=><button type="button" key={s.id} aria-pressed={i===index}
          onClick={()=>pick(i)}>
        <span>{String(i+1).padStart(2,"0")}</span><strong>{s.name}</strong>
      </button>)}
    </nav>
  </>
}
if(root) {
  createRoot(root).render(<App/>)
  document.documentElement.classList.add("mt-orbit-mounted")
  root.closest(".mt-orbit-showcase")?.classList.add("mt-orbit-ready")
  window.dispatchEvent(new CustomEvent("mt:orbit-ready"))
}
