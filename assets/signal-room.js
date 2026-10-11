(()=>{
'use strict';
const room=document.querySelector('[data-signal-room]');
if(!room)return;
const buttons=[...room.querySelectorAll('[data-signal]')];
const title=room.querySelector('[data-signal-title]');
const text=room.querySelector('[data-signal-body]');
const label=room.querySelector('[data-signal-label]');
const counter=room.querySelector('[data-signal-counter]');
const stage=room.querySelector('.signal-stage');
const states=[
 {label:'01 / SERVICE CLIENT',title:'Un client attend. Et compte les minutes.',body:"Je prends le relais, clarifie la situation et maintiens une communication utile jusqu’à la résolution."},
 {label:'02 / E-RÉPUTATION',title:'Votre réputation se joue dans les détails.',body:"Chaque retour mérite une écoute. Une invitation honnête à laisser un avis, sans sélection ni pression."},
 {label:'03 / DÉVELOPPEMENT',title:'Un prospect hésite. Le temps passe.',body:"Je qualifie le besoin, reprends le contexte et prépare une relance personnalisée, sans forcer la décision."},
 {label:'04 / SITE SIGNATURE',title:'Votre visiteur est là. Convainquez-le.',body:"Une narration mémorable, des preuves crédibles et un chemin simple vers l'échange. Pas un template générique."}
];
let current=0;
let frame=0;
function set(index){
 if(!Number.isInteger(index)||index<0||index>=states.length||index===current)return;
 current=index;
 const item=states[index];
 buttons.forEach((button,i)=>{
   const active=i===index;
   button.setAttribute('aria-pressed',String(active));
   button.classList.toggle('is-active',active);
 });
 if(frame)clearTimeout(frame);
 stage.classList.add('is-changing');
 frame=setTimeout(()=>{
   label.textContent=item.label;
   title.textContent=item.title;
   text.textContent=item.body;
   counter.textContent=String(index+1).padStart(2,'0')+' / 04';
   stage.classList.remove('is-changing');
 },110);
}
buttons.forEach((b,i)=>b.addEventListener('click',()=>set(i)));
})();
