const P=[['palha','classicos','Palhas Italianas','O clássico reinventado com embalagem inclusa.','assets/images/palha-italiana.webp',['Chocolate Belga','Coco Queimado','Limão Siciliano','Churros','Vanilla','Café','Caramelo Salgado','Chocolate Belga e Flor de Sal','Chocolate Belga e Lascas de Amêndoas','Chocolate Belga com Laranja','Crème Brûlée','Nutella','Oreo','Cheesecake com Speculos','Biscoff','Pistache'],[['Tradicional · 32g',9],['Especial · 32g',10]]],['cremosa','classicos','Palha Italiana Cremosa','Potes, kits e experiência para servir.','assets/images/palha-cremosa.webp',['Chocolate Belga'],[['Pote 20g',18],['Pote 210g',100],['Kit 210g + toppings',160],['Experiência 1kg',500]]],['palhas','classicos','Palhas','Palhas italianas para presentes e eventos.','assets/images/chocolates-artesanais.webp',['Chocolate Belga'],[['Unidade · mínimo 50',4],['Latinha · 14 unidades',85]]],['brigadeiro','classicos','Brigadeiros','Alta chocolateria em pequenos formatos.','assets/images/brigadeiros.webp',['Dark','Meio Amargo','Ao Leite','Palha Italiana','Happy','Pistache','Crème Brûlée','Amêndoas Caramelizadas'],[['Clássico',7],['Happy',7.5],['Palha Italiana',8],['Especial',10]]],['bombom','classicos','Bombons','Joias de chocolate belga com ganaches autorais.','assets/images/chocolates-artesanais.webp',['Whisky','Coco','Flor de Sal','Blueberry','Gojiberry e Champagne','Framboesa','Pistache','Laranja e Cointreau','Caramelo Salgado','Limão Siciliano','Caipirinha','Vanilla'],[['Unidade',9]]],['trufa','classicos','Trufas','Chocolate belga e acabamento refinado.','assets/images/palha-cremosa.webp',['Chocolate 54%','Flor de Sal','Café','Whisky','Pistache','Blueberry','Palha Italiana','Champagne e Gojiberry','Vanilla','Vanilla com Limão'],[['Unidade',8]]],['lascas','classicos','Lascas de Chocolate','Personalizáveis com letras, monogramas e logotipos.','assets/images/chocolates-artesanais.webp',['Clássico','Branco Velvet','Flor de Sal','Frutas Secas','Nuts','Granola'],[['Clássico/Branco · 1kg',800],['Ruby ou Vegano Malchoc · 1kg',1000]]],['palha-fit','fit','Palhas Italianas Fit','Sem glúten, lactose e açúcar; veganas.','assets/images/fit-vegano.webp',['Cacau','Cacau e Nuts','Vanilla','BEFIT Cacau e Vanilla de Madagascar','Cacau e Flor de Sal','Vanilla e Flor de Sal','Café','Limão','Granola e Cacau'],[['Unidade',10]]],['trufa-fit','fit','Trufas Fit','Linha Fit & Vegana.','assets/images/palha-cremosa.webp',['Cacau','Cacau e Flor de Sal','Café','Vanilla','Vanilla com Flor de Sal','Limão'],[['Unidade',8]]],['brigadeiro-fit','fit','Brigadeiros Fit','Versão Fit & Vegana.','assets/images/brigadeiros.webp',['Cacau'],[['Unidade',10]]],['palhas-fit','fit','Palhas Fit','Palhas italianas Fit.','assets/images/fit-vegano.webp',['Cacau'],[['Unidade · mínimo 50',4]]],['cremosa-fit','fit','Palha Cremosa Fit','Potes e formatos para celebrações.','assets/images/palha-cremosa.webp',['Chocolate Belga Malchoc'],[['Pote 20g · mínimo 10',20],['Pote 210g',100],['1kg',500]]],['gifts','gifts','Caixas de Luxo & Gifts','Caixas prontas e composições personalizadas.','assets/images/presentes-gifts.webp',['Trufas','Bombons','Brigadeiros','Palhas Italianas','Palhas Fit','Lascas'],[['Caixa personalizada',null],['Gift Box Bandeja',null]]],['evento','eventos','Estações & Carrinho Oba','Estações de chocolate, ganache e Fit & Vegana.','assets/images/eventos-assinaturas.webp',['Casamento','Aniversário','Corporativo','Jantar','Bar ou Bat Mitzvah','Outros'],[['Solicitar projeto',null]]],['assinatura','eventos','Assinaturas Oba','Combinações semanais ou mensais para espaços e empresas.','assets/images/eventos-assinaturas.webp',['Consultório','Clínica','Loja','Recepção','Espaço corporativo'],[['Solicitar proposta',null]]]];
'use strict';
const $=s=>document.querySelector(s);
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories={classicos:'Clássicos',fit:'Fit & Vegano',gifts:'Presentes',eventos:'Experiências'};
const products=P.map(([id,category,name,description,image,flavors,variants])=>({id,category,name,description,image,flavors,variants}));
const productById=id=>products.find(p=>p.id===id);
const cleanQuantity=(n,min=1)=>Math.max(min,Math.min(99999,Math.floor(Number(n)||min)));
const minimum=(id,variant)=>variant===0&&(id==='palhas'||id==='palhas-fit')?50:id==='cremosa-fit'&&variant===0?10:1;
let state={items:[],note:''},filter='all',search='',selected=null;
function restore(){
 try{
  const current=localStorage.getItem('oba-order-v5');
  const saved=JSON.parse(current||localStorage.getItem('oba-order-v4')||'null');
  if(saved){state={items:Array.isArray(saved.items)?saved.items:[],note:typeof saved.note==='string'?saved.note.slice(0,1000):''};if(!current)state.items=state.items.map(i=>({...i,quantity:(i.id==='palhas'||i.id==='palhas-fit')&&i.variant===0?Number(i.quantity)*50:i.quantity}))}
  else{
   const old=JSON.parse(localStorage.getItem('oba-cart-v3')||'{}');
   state.items=Object.values(old).map(i=>({id:i.id,flavor:i.fl,variant:i.vr==='50 unidades · mínimo'?0:productById(i.id)?.variants.findIndex(v=>v[0]===i.vr),quantity:i.vr==='50 unidades · mínimo'?Number(i.q)*50:i.q}));
  }
 }catch{state={items:[],note:''}}
 state.items=state.items.filter(i=>{const p=productById(i.id);return p&&p.flavors.includes(i.flavor)&&Number.isInteger(i.variant)&&p.variants[i.variant]}).map(i=>({...i,quantity:cleanQuantity(i.quantity,minimum(i.id,i.variant))}));
}
function persist(){try{localStorage.setItem('oba-order-v5',JSON.stringify(state))}catch{}}
const mobileMotion=matchMedia('(prefers-reduced-motion:no-preference)');
let observer;
function watchMotion(){
 observer?.disconnect();
 document.documentElement.classList.toggle('motion-enabled',mobileMotion.matches);
 document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.remove('awaiting'));
 if(!mobileMotion.matches||!('IntersectionObserver' in window))return;
 observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('awaiting');e.target.dataset.revealed='true';observer.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -20px 0px'});
 document.querySelectorAll('[data-reveal]').forEach(e=>{if(e.dataset.revealed)return;if(e.getBoundingClientRect().top>innerHeight*.9){e.classList.add('awaiting');observer.observe(e)}else{e.dataset.revealed='true'}});
}
mobileMotion.addEventListener('change',watchMotion);
const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderProducts(){
 const visible=products.filter(p=>(filter==='all'||p.category===filter)&&normalized(p.name+' '+p.flavors.join(' ')).includes(normalized(search)));
 $('#result-count').textContent=visible.length+' criações';
 $('#shop-grid').innerHTML=visible.length?visible.map(p=>{
 const prices=p.variants.map(v=>v[1]).filter(v=>v!==null);
 return `<article class="product-card" data-reveal><div class="product-photo"><button class="image-open" data-image="${p.id}" aria-label="Ver foto de ${esc(p.name)} em tela cheia"><img class="product-image product-image-${p.id}" loading="lazy" decoding="async" src="${p.image}" alt="${esc(p.name)}"></button><span class="product-badge">${categories[p.category]}</span><button class="product-plus" data-product="${p.id}" aria-label="Escolher ${esc(p.name)}">+</button></div><div class="product-copy"><h3><button data-product="${p.id}">${p.name}</button></h3><div class="product-meta"><span>${p.flavors.length} ${p.category==='eventos'?'ocasiões':p.flavors.length===1?'opção':'opções'}</span><strong>${prices.length?'A partir de '+money(Math.min(...prices)):'Sob consulta'}</strong></div></div></article>`;
 }).join(''):'<div class="no-results"><h3>Vamos tentar outro sabor?</h3><p>Nenhuma criação encontrada nesta seleção.</p><button class="text-button" id="clear-search">Ver toda a coleção</button></div>';
 document.querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>openProduct(b.dataset.product));
 document.querySelectorAll('[data-image]').forEach(b=>b.onclick=()=>openImage(b.dataset.image));
 $('#clear-search')?.addEventListener('click',()=>{search='';$('#search').value='';setFilter('all')});
 watchMotion();
}
function setFilter(value){filter=value;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===value);b.setAttribute('aria-pressed',String(b.dataset.filter===value))});renderProducts()}
function openProduct(id){
 selected=productById(id);
 if(!selected)return;
 $('#detail-image').src=selected.image;$('#detail-image').alt=selected.name;
 $('#detail-category').textContent=categories[selected.category];$('#product-title').textContent=selected.name;$('#detail-description').textContent=selected.description;
 $('#flavor-label').textContent=selected.category==='eventos'?'Qual é a ocasião?':selected.category==='gifts'?'Escolha a composição':'Escolha o sabor';
 $('#flavor').innerHTML=selected.flavors.map(f=>'<option>'+esc(f)+'</option>').join('');
 $('#variant').innerHTML=selected.variants.map((v,i)=>'<option value="'+i+'">'+esc(v[0])+' · '+(v[1]===null?'Sob consulta':money(v[1]))+'</option>').join('');
 $('#quantity').value=minimum(id,0);updateProduct();
 $('#product-dialog').showModal();
}
function openQuestion(){
 if(!selected)return;
 $('#question-text').value='';
 $('#question-error').hidden=true;
 $('#question-intro').textContent='Sobre '+selected.name+'. Escreva a dúvida abaixo; o nome do produto já vai na mensagem.';
 updateQuestionLink();
 $('#question-dialog').showModal();
 setTimeout(()=>$('#question-text').focus(),50);
}
let imageZoom=1,imagePanX=0,imagePanY=0;
function applyImageTransform(){
 $('#image-preview').style.transform='translate3d('+imagePanX+'px,'+imagePanY+'px,0) scale('+imageZoom+')';
 $('#zoom-reset').textContent=Math.round(imageZoom*100)+'%';
}
function setImageZoom(value,anchor){
 const old=imageZoom,next=Math.max(1,Math.min(8,value));
 if(anchor&&next!==old){const r=$('.image-viewer').getBoundingClientRect(),x=anchor.x-(r.left+r.width/2)-imagePanX,y=anchor.y-(r.top+r.height/2)-imagePanY,ratio=next/old;imagePanX-=x*(ratio-1);imagePanY-=y*(ratio-1)}
 imageZoom=next;if(imageZoom===1){imagePanX=0;imagePanY=0}applyImageTransform();
}
function openImage(id){
 const p=productById(id);
 $('#image-preview').src=p.image;$('#image-preview').alt=p.name;$('#image-title').textContent=p.name;
 setImageZoom(1);
 $('#image-dialog').showModal();
}
const imagePreview=$('#image-preview');
const imageSurface=$('.image-viewer'),imagePointers=new Map();
let imageGesture=null;
function captureImageGesture(){const pts=[...imagePointers.values()];imageGesture=pts.length>1?{x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2,d:Math.hypot(pts[1].x-pts[0].x,pts[1].y-pts[0].y)}:pts[0]||null}
imageSurface.addEventListener('pointerdown',e=>{if(e.target.closest('button,.image-controls')||e.button!==0)return;e.preventDefault();imagePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});imageSurface.setPointerCapture(e.pointerId);captureImageGesture();imagePreview.classList.add('is-dragging')});
imageSurface.addEventListener('pointermove',e=>{if(!imagePointers.has(e.pointerId))return;e.preventDefault();const previous=imageGesture;imagePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});captureImageGesture();if(!previous||!imageGesture)return;if(previous.d&&imageGesture.d){setImageZoom(imageZoom*imageGesture.d/previous.d,previous)}if(imageZoom>1){imagePanX+=imageGesture.x-previous.x;imagePanY+=imageGesture.y-previous.y;applyImageTransform()}});
function releaseImagePointer(e){imagePointers.delete(e.pointerId);captureImageGesture();if(!imagePointers.size)imagePreview.classList.remove('is-dragging')}
imageSurface.addEventListener('pointerup',releaseImagePointer);imageSurface.addEventListener('pointercancel',releaseImagePointer);imageSurface.addEventListener('lostpointercapture',releaseImagePointer);
imageSurface.addEventListener('wheel',e=>{if(e.target.closest('button,.image-controls'))return;e.preventDefault();setImageZoom(imageZoom*Math.exp(-e.deltaY*(e.deltaMode===1?.035:.002)),{x:e.clientX,y:e.clientY})},{passive:false});
imagePreview.addEventListener('dragstart',e=>e.preventDefault());
$('#image-dialog').addEventListener('close',()=>{imagePointers.clear();imageGesture=null;imagePreview.classList.remove('is-dragging')});
function updateProduct(){
 if(!selected)return;
 const vi=Number($('#variant').value),min=minimum(selected.id,vi),price=selected.variants[vi][1];
 $('#quantity').min=min;$('#minimum-note').textContent=min>1?'A partir de '+min+' unidades; acrescente de 1 em 1':'';
 const quantity=cleanQuantity($('#quantity').value,min);
 $('#item-total').textContent=price===null?'Sob consulta':money(price*quantity);
 $('#decrease').disabled=quantity<=min;
}
$('#variant').onchange=()=>{$('#quantity').value=cleanQuantity($('#quantity').value,minimum(selected.id,Number($('#variant').value)));updateProduct()};
$('#quantity').oninput=updateProduct;
$('#quantity').onchange=()=>{$('#quantity').value=cleanQuantity($('#quantity').value,minimum(selected.id,Number($('#variant').value)));updateProduct()};
for(const [id,delta] of [['decrease',-1],['increase',1]])$('#'+id).onclick=()=>{$('#quantity').value=cleanQuantity(Number($('#quantity').value)+delta,minimum(selected.id,Number($('#variant').value)));updateProduct()};
$('#product-form').onsubmit=e=>{
 e.preventDefault();const variant=Number($('#variant').value),flavor=$('#flavor').value,quantity=cleanQuantity($('#quantity').value,minimum(selected.id,variant));
 const existing=state.items.find(i=>i.id===selected.id&&i.variant===variant&&i.flavor===flavor);
 if(existing)existing.quantity=cleanQuantity(existing.quantity+quantity);else state.items.push({id:selected.id,variant,flavor,quantity});
 persist();renderCart();$('#product-dialog').close();if(!existing)requestAnimationFrame(playBagDrop);notify(selected.name+' na sua sacola');
};
$('#question-button').onclick=openQuestion;
function questionMessage(){return 'Olá! Tenho uma dúvida sobre o produto '+selected.name+'.\n\nMinha dúvida: '+$('#question-text').value.trim()}
function updateQuestionLink(){if(selected)$('#question-web').href='https://wa.me/5521999297818?text='+encodeURIComponent(questionMessage())}
$('#question-text').oninput=()=>{$('#question-error').hidden=true;updateQuestionLink()};
$('#question-web').onclick=e=>{if(!$('#question-text').value.trim()){e.preventDefault();$('#question-error').hidden=false;$('#question-text').focus()}};
$('#send-question').onclick=()=>{
 if(!selected)return;
 const doubt=$('#question-text').value.trim();
 if(!doubt){$('#question-error').hidden=false;$('#question-text').focus();return}
 const text=questionMessage();
 const href='whatsapp://send?phone=5521999297818&text='+encodeURIComponent(text);
 window.location.href=href;
};
function totals(){return {count:state.items.reduce((n,i)=>n+i.quantity,0),total:state.items.reduce((n,i)=>n+(productById(i.id).variants[i.variant][1]||0)*i.quantity,0),pending:state.items.some(i=>productById(i.id).variants[i.variant][1]===null)}}
function renderCart(){
 const {count,total,pending}=totals();document.querySelectorAll('[data-count]').forEach(e=>e.textContent=count);
 $('#cart-total').textContent=money(total);
 $('#cart-note').textContent=pending?'Itens sob consulta não estão incluídos neste subtotal.':'Valores do catálogo. Entrega calculada pelo atelier.';
 $('#cart-items').innerHTML=state.items.length?state.items.map((item,index)=>{
 const p=productById(item.id),v=p.variants[item.variant];
 return `<article class="cart-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${esc(item.flavor)} · ${esc(v[0])}</p><strong>${v[1]===null?'Sob consulta':money(v[1]*item.quantity)}</strong><div class="cart-item-bottom"><div class="stepper"><button data-index="${index}" data-delta="-1" aria-label="Diminuir ${esc(p.name)}">−</button><input aria-label="Quantidade de ${esc(p.name)}" type="number" inputmode="numeric" min="${minimum(item.id,item.variant)}" max="99999" step="1" value="${item.quantity}" data-index="${index}"><button data-index="${index}" data-delta="1" aria-label="Aumentar ${esc(p.name)}">+</button></div><button class="remove" data-remove="${index}" aria-label="Remover ${esc(p.name)}">Remover</button></div></div></article>`;
 }).join(''):'<div class="empty-cart"><span>✳</span><h3>Ainda cabe um oba.</h3><p>Explore a coleção e escolha<br>o seu primeiro favorito.</p><button class="text-button" id="back-collection">Voltar à coleção ↗</button></div>';
 $('#back-collection')?.addEventListener('click',()=>{$('#cart-dialog').close();$('#produtos').scrollIntoView()});
 document.querySelectorAll('[data-delta]').forEach(b=>b.onclick=()=>{const i=state.items[Number(b.dataset.index)];i.quantity=cleanQuantity(i.quantity+Number(b.dataset.delta),minimum(i.id,i.variant));persist();renderCart()});
 document.querySelectorAll('.cart-item input').forEach(input=>input.onchange=()=>{const i=state.items[Number(input.dataset.index)];i.quantity=cleanQuantity(input.value,minimum(i.id,i.variant));persist();renderCart()});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.items.splice(Number(b.dataset.remove),1);persist();renderCart()});
 $('.order-notes').hidden=!state.items.length;
 $('#whatsapp-order').classList.toggle('disabled',!state.items.length);$('#whatsapp-order').setAttribute('aria-disabled',String(!state.items.length));$('#whatsapp-order').tabIndex=state.items.length?0:-1;
 $('#web-whatsapp').disabled=!state.items.length;
 updateMessage();
}
function message(){
 const {total,pending}=totals();
 const lines=state.items.map(i=>{const p=productById(i.id),v=p.variants[i.variant];return '• '+p.name+'\n  '+i.flavor+' · '+v[0]+'\n  Quantidade: '+i.quantity+' · '+(v[1]===null?'Sob consulta':money(v[1]*i.quantity))});
 return 'Olá, equipe Oba! Gostaria de encomendar esta seleção:\n\n'+lines.join('\n\n')+'\n\nSubtotal dos itens com preço: '+money(total)+(pending?'\nHá itens com valor a confirmar.':'')+(state.note.trim()?'\n\nDetalhes do pedido: '+state.note.trim():'')+'\n\nPodem confirmar disponibilidade, prazo e valor final com entrega? Obrigado!';
}
function updateMessage(){$('#whatsapp-order').href=state.items.length?'whatsapp://send?phone=5521999297818&text='+encodeURIComponent(message()):'#'}
$('#order-note').oninput=e=>{state.note=e.target.value.slice(0,1000);persist();updateMessage()};
$('#web-whatsapp').onclick=()=>{if(state.items.length)window.open('https://wa.me/5521999297818?text='+encodeURIComponent(message()),'_blank','noopener')};
document.querySelectorAll('[data-cart]').forEach(b=>b.onclick=()=>{$('#cart-dialog').showModal()});
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#zoom-in').onclick=()=>setImageZoom(imageZoom+.25);
$('#zoom-out').onclick=()=>setImageZoom(imageZoom-.25);
$('#zoom-reset').onclick=()=>setImageZoom(1);
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}}));
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>setFilter(b.dataset.filter));
document.querySelectorAll('[data-category-link]').forEach(b=>b.onclick=()=>{search='';$('#search').value='';setFilter(b.dataset.categoryLink);$('#produtos').scrollIntoView()});
$('#search').oninput=e=>{search=e.target.value;renderProducts()};
function playBagDrop(){
 if(!matchMedia('(max-width:700px) and (prefers-reduced-motion:no-preference)').matches)return;
 const mark=document.querySelector('.mobile-nav .bag-mark');if(!mark)return;
 const box=mark.getBoundingClientRect(),drop=document.createElement('i');
 drop.className='bag-drop';drop.setAttribute('aria-hidden','true');drop.style.left=(box.left+box.width/2)+'px';document.body.append(drop);
 const distance=Math.max(90,box.top+box.height/2+16);
 const fall=drop.animate([{transform:'translate(-50%,-24px) scale(.45)',opacity:0},{offset:.13,transform:'translate(calc(-50% - 3px),0) scale(.8)',opacity:1},{offset:.82,transform:'translate(calc(-50% + 4px),'+(distance-14)+'px) scale(1)',opacity:1},{transform:'translate(-50%,'+distance+'px) scale(.35)',opacity:0}],{duration:720,easing:'cubic-bezier(.18,.75,.36,1)'});
 setTimeout(()=>{mark.animate([{transform:'scale(1) rotate(0deg)'},{offset:.35,transform:'scale(1.22) rotate(-10deg)'},{transform:'scale(1) rotate(0deg)'}],{duration:390,easing:'cubic-bezier(.2,.8,.2,1)'});document.querySelectorAll('.mobile-nav [data-count]').forEach(count=>count.animate([{transform:'scale(1)'},{offset:.35,transform:'scale(1.5)'},{transform:'scale(1)'}],{duration:390,easing:'cubic-bezier(.2,.8,.2,1)'}))},520);
 fall.finished.finally(()=>drop.remove());
}
let timer;function notify(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('visible'),2800)}
restore();persist();$('#order-note').value=state.note;renderProducts();renderCart();
