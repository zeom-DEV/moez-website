(()=>{
'use strict';
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const demos=[...document.querySelectorAll('.service-demo')];
if(!demos.length)return;
for(const demo of demos){
  const steps=[...demo.querySelectorAll('[data-demo-step]')];
  const scene=demo.querySelector('.service-demo__scene');
  const headline=demo.querySelector('[data-demo-title]');
  const body=demo.querySelector('[data-demo-description]');
  const status=demo.querySelector('[data-demo-status]');
  const live=demo.querySelector('[data-demo-live]');
  let current=0,timer=null,isVisible=false,paused=false;
  const values=steps.map(b=>({title:b.dataset.title,body:b.dataset.body,status:b.dataset.status}));
  const clear=()=>{if(timer!==null){clearInterval(timer);timer=null;}};
  function render(index,announce=false){
    if(index<0||index>=steps.length)return;
    current=index;
    demo.dataset.stage=String(index);
    steps.forEach((button,i)=>{
      button.setAttribute('aria-pressed',String(i===index));
      button.classList.toggle('is-current',i===index);
    });
    if(headline)headline.textContent=values[index].title;
    if(body)body.textContent=values[index].body;
    if(status)status.textContent=values[index].status;
    if(announce&&live)live.textContent=values[index].title+'. '+values[index].body;
    scene?.style.setProperty('--stage',String(index));
  }
  function autoplay(){
    clear();
    if(prefersReduced||!isVisible||paused||document.hidden)return;
    timer=setInterval(()=>render((current+1)%values.length,false),4200);
  }
  steps.forEach((button,i)=>button.addEventListener('click',()=>{render(i,true);paused=true;clear();}));
  demo.addEventListener('pointerenter',()=>{paused=true;clear();},{passive:true});
  demo.addEventListener('focusin',()=>{paused=true;clear();});
  document.addEventListener('visibilitychange',autoplay);
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{isVisible=entries.some(e=>e.isIntersecting);autoplay();},{threshold:.35});
    observer.observe(demo);
  }
  render(0,false);
}
})();