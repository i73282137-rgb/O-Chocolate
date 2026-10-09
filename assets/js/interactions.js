'use strict';
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const intro = document.querySelector('#brand-intro');
  const page = [...document.querySelectorAll('[data-page]')];
  const swarm = intro.querySelector('.leaf-swarm');
  const skip = document.querySelector('#skip-intro');
  let introTimers = [], leafAnimations = [], returnFocus = null;
  function later(fn, time) { introTimers.push(setTimeout(fn, time)); }
  function finishIntro() {
    clearTimeout(window.obaIntroFailsafe);
    introTimers.forEach(clearTimeout); introTimers = [];
    leafAnimations.forEach(a => a.cancel()); leafAnimations = [];
    root.classList.remove('intro-pending');
    intro.classList.remove('is-playing', 'is-leaving');
    swarm.replaceChildren(); page.forEach(el => el.inert = false);
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
    returnFocus = null;
  }
  function leaves() {
    // Sixteen larger leaves create the same botanical wipe with far less layout and paint work.
    const width = innerWidth, height = innerHeight;
    const size = Math.max(width * .52, height * .58);
    const colors = ['#394c30','#64774b','#8d9e69','#b3c38b','#485d3b','#74865a'];
    const fragment = document.createDocumentFragment();
    const leavesToAnimate = [];
    for (let row=0; row<4; row++) for (let col=0; col<4; col++) {
      const index=row*4+col, leaf=document.createElement('i');
      const rotation=-32+(index*31%92);
      const x=col*width/3-size*.5, y=row*height/3-size*.24;
      leaf.className='intro-leaf';
      leaf.style.cssText=`left:${x}px;top:${y}px;--size:${size}px;--rotation:${rotation}deg;--leaf-color:${colors[index%colors.length]}`;
      fragment.append(leaf);
      leavesToAnimate.push({leaf,rotation,col,row});
    }
    swarm.append(fragment);
    leavesToAnimate.forEach(({leaf,rotation,col,row})=>{
      const delay=col*32+row*24;
      const animation=leaf.animate([
        {transform:`translate3d(${-width-size}px,${height*.22}px,0) rotate(${rotation-92}deg) scale(.72)`,opacity:1},
        {offset:.44,transform:`translate3d(0,0,0) rotate(${rotation}deg) scale(1.42)`,opacity:1},
        {offset:.58,transform:`translate3d(0,0,0) rotate(${rotation+7}deg) scale(1.42)`,opacity:1},
        {transform:`translate3d(${width+size}px,${-height*.34}px,0) rotate(${rotation+118}deg) scale(.92)`,opacity:1}
      ],{duration:980,delay,easing:'cubic-bezier(.45,0,.2,1)',fill:'both'});
      leafAnimations.push(animation);
    });
    later(()=>intro.classList.add('is-leaving'),430);
    later(finishIntro,1320);
  }
  function startIntro(replay=false) {
    finishIntro();
    if(reduce.matches)return;
    returnFocus=replay?document.activeElement:null;
    root.classList.add('intro-pending');
    page.forEach(el=>el.inert=true);
    void intro.offsetWidth;
    intro.classList.add('is-playing');
    skip.focus({preventScroll:true});
    later(leaves,2500);
    later(finishIntro,5200);
  }
  skip.addEventListener('click',finishIntro);
  intro.addEventListener('keydown',e=>{if(e.key==='Escape')finishIntro();if(e.key==='Tab'){e.preventDefault();skip.focus()}});
  document.querySelectorAll('[data-replay]').forEach(b=>b.addEventListener('click',()=>startIntro(true)));
  reduce.addEventListener('change',()=>{if(reduce.matches)finishIntro()});
  addEventListener('pagehide',finishIntro);
  if(root.classList.contains('intro-pending'))startIntro();

  const deck=document.querySelector('#chocolate-deck');
  const cards=[...deck.querySelectorAll('.deck-card')];
  let current=0,drag=null,busy=false;
  function restack() {
    cards.forEach((card,i)=>{
      const rank=(i-current+cards.length)%cards.length;
      card.style.zIndex=String(cards.length-rank);
      card.style.transform=`translate(${rank*7}px,${-rank*6}px) rotate(${rank%2?rank*2.5:-rank*1.5}deg) scale(${1-rank*.035})`;
      card.style.opacity=rank<3?'1':'0';
      card.setAttribute('aria-hidden',String(rank!==0));
    });
    document.querySelector('#deck-status').textContent=cards[current].querySelector('span').textContent;
  }
  async function advance(direction=1) {
    if(busy)return; busy=true;
    const card=cards[current];
    if(!reduce.matches){
      const starting=card.style.transform;
      const movement=card.animate([{transform:starting,opacity:1},{transform:`translate(${direction*deck.clientWidth*1.2}px,-35px) rotate(${direction*22}deg) scale(1.02)`,opacity:0}],{duration:390,easing:'cubic-bezier(.32,0,.65,1)'});
      await movement.finished.catch(()=>{});movement.cancel();
    }
    current=(current+direction+cards.length)%cards.length;restack();busy=false;
  }
  document.querySelector('#deck-next').onclick=()=>advance(1);
  document.querySelector('#deck-prev').onclick=()=>advance(-1);
  document.querySelector('#deck-explore').onclick=()=>openProduct(cards[current].dataset.deckProduct);
  deck.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();advance(e.key==='ArrowRight'?1:-1)}});
  deck.addEventListener('pointerdown',e=>{
    if(e.button!==0||busy)return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,horizontal:false};
    deck.setPointerCapture(e.pointerId);cards[current].style.transition='none';
  });
  deck.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    drag.dx=e.clientX-drag.x;drag.dy=e.clientY-drag.y;
    if(!drag.horizontal&&Math.abs(drag.dx)>8&&Math.abs(drag.dx)>Math.abs(drag.dy))drag.horizontal=true;
    if(!drag.horizontal)return;
    deck.classList.add('dragging');
    cards[current].style.transform=`translate(${drag.dx}px,${drag.dy*.2}px) rotate(${drag.dx/deck.clientWidth*16}deg) scale(1.015)`;
  });
  function release(e) {
    if(!drag||drag.id!==e.pointerId)return;
    const passed=e.type!=='pointercancel'&&drag.horizontal&&Math.abs(drag.dx)>deck.clientWidth*.1;
    const direction=drag.dx<0?1:-1;drag=null;deck.classList.remove('dragging');cards[current].style.transition='';
    if(passed)advance(direction);else restack();
  }
  deck.addEventListener('pointerup',release);deck.addEventListener('pointercancel',release);
  deck.addEventListener('dragstart',e=>e.preventDefault());restack();
  // Dynamic catalogue totals are sourced from the same product records as the store.
  document.querySelectorAll('[data-filter]').forEach(button=>{const kind=button.dataset.filter;button.querySelector('span').textContent=products.filter(p=>kind==='all'||p.category===kind).length});
})();
