(()=>{
if(window.__QC_ORDER_EDIT_11821)return;window.__QC_ORDER_EDIT_11821=true;
const EDITABLE_STATUSES=new Set(['nuevo','preparando']);
QC.editOrder=null;
QC.orderForPeople=(()=>{try{return JSON.parse(localStorage.getItem('qc_order_for_people_v1')||'[]')}catch{return[]}})();
QC.currentOrderFor=String(localStorage.getItem('qc_current_order_for_v1')||'').trim();

const style=document.createElement('style');style.textContent=`
.named-order-box{margin:0 0 12px;padding:12px;border:1px solid #e4e7ec;border-radius:14px;background:#fff}.named-order-title{font-size:12px;font-weight:900;color:#344054;margin-bottom:7px}.named-order-row{display:flex;gap:7px}.named-order-row input{flex:1;min-width:0;border:1px solid #d0d5dd;border-radius:10px;padding:9px 10px}.named-order-row button{border:0;border-radius:10px;padding:9px 11px;background:#101828;color:#fff;font-weight:850}.named-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.named-chip{border:1px solid #d0d5dd;background:#fff;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:850;color:#475467}.named-chip.active{background:#101828;color:#fff;border-color:#101828}.cart-for{display:inline-block;margin-top:5px;border-radius:999px;background:#eff8ff;color:#175cd3;padding:4px 7px;font-size:10px;font-weight:900}.edit-order-banner{margin:0 0 12px;padding:11px 12px;border:1px solid #b2ddff;background:#eff8ff;border-radius:13px;color:#175cd3;font-size:11px;line-height:1.45}.edit-order-banner b{display:block;font-size:12px;margin-bottom:3px}.locked-order-items{margin-top:8px;border-top:1px dashed #84caff;padding-top:7px}.locked-order-item{display:flex;justify-content:space-between;gap:8px;margin-top:5px;color:#344054}.locked-tag{font-weight:900;color:#667085}.order-edit-btn{width:100%;margin-top:10px;border:1px solid #84caff;background:#eff8ff;color:#175cd3;border-radius:11px;padding:9px 10px;font-weight:900}.order-edit-note{margin-top:6px;font-size:10px;color:#667085}.business-order-for{display:inline-block;margin-left:7px;border-radius:999px;background:#ecfdf3;color:#067647;padding:3px 6px;font-size:9px;font-weight:900}.customer-edit-alert{margin:8px 0;padding:8px 10px;border-radius:10px;background:#fffaeb;border:1px solid #fedf89;color:#93370d;font-size:11px;font-weight:800}
@media(max-width:560px){.named-order-row{flex-direction:column}.named-order-row button{width:100%}}
`;
document.head.appendChild(style);

function cleanPerson(v){return String(v||'').trim().replace(/\s+/g,' ').slice(0,60)}
function savePeople(){localStorage.setItem('qc_order_for_people_v1',JSON.stringify(QC.orderForPeople.slice(0,30)));localStorage.setItem('qc_current_order_for_v1',QC.currentOrderFor||'')}
function ensureNamedOrderUI(){
  if(document.getElementById('namedOrderBox'))return;
  const list=document.getElementById('cartList');if(!list)return;
  const box=document.createElement('div');box.id='namedOrderBox';box.className='named-order-box';box.innerHTML=`<div class="named-order-title">👥 Pedido por nombre <span style="font-weight:500;color:#667085">(opcional)</span></div><div class="named-order-row"><input id="orderForName" maxlength="60" placeholder="Ej. Juan, María, Oficina 2"><button id="addOrderFor" type="button">Usar nombre</button></div><div class="named-chips" id="namedChips"></div>`;
  list.parentNode.insertBefore(box,list);
  document.getElementById('addOrderFor').onclick=()=>{const value=cleanPerson(document.getElementById('orderForName').value);if(!value){setCurrentPerson('');return}if(!QC.orderForPeople.includes(value))QC.orderForPeople.push(value);setCurrentPerson(value);document.getElementById('orderForName').value=''};
  document.getElementById('orderForName').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('addOrderFor').click()}};
  renderPeople();
}
function setCurrentPerson(name){QC.currentOrderFor=cleanPerson(name);savePeople();renderPeople();toast(QC.currentOrderFor?'Ahora agregas productos para '+QC.currentOrderFor:'Pedido general seleccionado')}
function renderPeople(){const el=document.getElementById('namedChips');if(!el)return;const names=[...new Set(QC.orderForPeople.concat(QC.cart.map(x=>cleanPerson(x.orderFor)).filter(Boolean)))];el.innerHTML=`<button class="named-chip ${!QC.currentOrderFor?'active':''}" type="button" data-person="">General</button>`+names.map(n=>`<button class="named-chip ${QC.currentOrderFor===n?'active':''}" type="button" data-person="${esc(n)}">${esc(n)}</button>`).join('');el.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>setCurrentPerson(b.dataset.person||''))}

addToCart=function(id){
  const p=QC.products.find(x=>String(x.id)===String(id));if(!p)return;
  if(QC.editOrder){const existing=QC.editOrder.branches?.[p.businessId];if(existing&&!EDITABLE_STATUSES.has(String(existing.status||'nuevo'))){toast('Ese negocio ya no permite agregar productos a este pedido');return}}
  const biz=QC.businesses?.[p.businessId]||{},fee=Number.isFinite(Number(biz.commissionPct))?Number(biz.commissionPct):QC.defaultFee,person=cleanPerson(QC.currentOrderFor);
  const item=QC.cart.find(x=>String(x.productId)===String(id)&&cleanPerson(x.orderFor)===person);
  if(item){item.qty++;item.commissionPct=fee;item.businessName=biz.name||p.businessName||item.businessName||'Establecimiento'}else QC.cart.push({productId:p.id,businessId:p.businessId||'sin-negocio',businessName:biz.name||p.businessName||'Establecimiento',name:p.name,price:Number(p.price||0),commissionPct:fee,qty:1,orderFor:person});
  saveCart();renderCart();toast(person?'Agregado para '+person:'Agregado al carrito')
};

const baseRenderCart11821=renderCart;
renderCart=function(){const result=baseRenderCart11821.apply(this,arguments);ensureNamedOrderUI();decorateCartPersons();renderEditBanner();renderPeople();return result};
function decorateCartPersons(){document.querySelectorAll('#cartList .cart-item').forEach((row,idx)=>{const item=QC.cart[idx];if(!item)return;row.querySelector('.cart-for')?.remove();const person=cleanPerson(item.orderFor);if(person){const tag=document.createElement('div');tag.className='cart-for';tag.textContent='Para: '+person;const left=row.firstElementChild;left?.appendChild(tag)}})}
function renderEditBanner(){
  let banner=document.getElementById('editOrderBanner');
  if(!QC.editOrder){banner?.remove();const btn=document.getElementById('sendOrder');if(btn)btn.textContent='Enviar pedido';const wallet=document.getElementById('useWallet');if(wallet)wallet.disabled=false;return}
  if(!banner){banner=document.createElement('div');banner.id='editOrderBanner';banner.className='edit-order-banner';const named=document.getElementById('namedOrderBox');named?.parentNode.insertBefore(banner,named)}
  const locked=Array.isArray(QC.editOrder.master?.items)?QC.editOrder.master.items:[];
  banner.innerHTML=`<b>➕ Agregando productos al pedido ${esc(String(QC.editOrder.orderId).slice(-8).toUpperCase())}</b>Los productos que ya están en preparación están bloqueados: solo puedes agregar productos nuevos.<div class="locked-order-items">${locked.slice(0,12).map(i=>`<div class="locked-order-item"><span>${Number(i.qty||1)} × ${esc(i.name||'Producto')}${i.orderFor?` <span class="locked-tag">· Para ${esc(i.orderFor)}</span>`:''}</span><span>🔒</span></div>`).join('')}</div><button type="button" class="btn" id="cancelEditOrder" style="margin-top:8px">Cancelar edición</button>`;
  document.getElementById('cancelEditOrder').onclick=cancelEditOrder;
  const btn=document.getElementById('sendOrder');if(btn)btn.textContent='Actualizar pedido';const wallet=document.getElementById('useWallet');if(wallet){wallet.checked=false;wallet.disabled=true}
}
function cancelEditOrder(){QC.editOrder=null;QC.cart=[];saveCart();QC.currentOrderFor='';savePeople();renderCart();closeCart();toast('Edición cancelada')}

function orderActiveForEdit(watch){const parts=watch?.parts||[];return parts.some(p=>EDITABLE_STATUSES.has(String(p.status||'nuevo')))}
async function beginEditOrder(orderId){
  if(QC.cart.length&&!confirm('Tienes productos en el carrito. ¿Quieres vaciarlos para agregar productos al pedido existente?'))return;
  if(!QC.dbUrl)return toast('No hay conexión');
  try{
    const master=await dbGet('quecomer/orders/'+orderId);if(!master)throw new Error('No se encontró el pedido');
    const branches={};for(const bid of [...new Set((master.items||[]).map(i=>i.businessId).filter(Boolean))]){const branch=await dbGet('quecomer/businessOrders/'+bid+'/'+orderId).catch(()=>null);if(branch)branches[bid]=branch}
    const editable=Object.values(branches).some(o=>EDITABLE_STATUSES.has(String(o.status||'nuevo')));if(!editable)throw new Error('Este pedido ya no está en preparación y no admite productos adicionales');
    QC.editOrder={orderId,master,branches,startedAt:new Date().toISOString()};QC.cart=[];saveCart();QC.currentOrderFor='';savePeople();renderCart();document.getElementById('closeMessages')?.click();openCart();toast('Agrega únicamente los productos nuevos')
  }catch(e){toast(e.message||'No se pudo editar el pedido')}
}
function decorateMessageCards(){
  const el=document.getElementById('messagesList');if(!el)return;const watches=[...QC.orderWatches].sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).slice(0,20),cards=[...el.querySelectorAll('.watch-card')];
  cards.forEach((card,idx)=>{card.querySelector('.order-edit-btn')?.remove();card.querySelector('.order-edit-note')?.remove();const watch=watches[idx];if(!watch||!orderActiveForEdit(watch))return;const btn=document.createElement('button');btn.className='order-edit-btn';btn.type='button';btn.textContent='➕ Agregar productos a este pedido';btn.onclick=()=>beginEditOrder(watch.orderId);card.appendChild(btn);const note=document.createElement('div');note.className='order-edit-note';note.textContent='Los productos originales no se pueden quitar ni modificar.';card.appendChild(note)})
}
const messageList=document.getElementById('messagesList');if(messageList)new MutationObserver(()=>decorateMessageCards()).observe(messageList,{childList:true,subtree:true});setTimeout(decorateMessageCards,300);

async function patchJson(path,data){const r=await fetch(QC.dbUrl+'/'+path+'.json',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!r.ok)throw new Error('No se pudo actualizar el pedido ('+r.status+')');return r.json()}
function externalPayment(method){const v=String(method||'').trim();if(!v)return'';if(v==='Saldo Qué Comer Hoy')return'';if(v.includes(' + '))return v.split(' + ').pop().trim();return v}
async function updateExistingOrder(){
  if(!QC.editOrder||!QC.cart.length){toast('Agrega al menos un producto nuevo');return}
  const btn=document.getElementById('sendOrder');btn.disabled=true;btn.textContent='Actualizando...';
  try{
    const orderId=QC.editOrder.orderId,master=await dbGet('quecomer/orders/'+orderId);if(!master)throw new Error('El pedido ya no existe');
    const [products,businesses]=await Promise.all([dbGet('quecomer/products'),dbGet('quecomer/businesses')]);QC.businesses=businesses||{};
    const additions=[];for(const src of QC.cart){const p=products?.[src.productId],biz=businesses?.[src.businessId];if(!p||!biz||p.active===false||p.paused===true||biz.active===false||biz.platformBlocked===true||biz.businessPaused===true)throw new Error('Un producto nuevo ya no está disponible: '+src.name);const branch=await dbGet('quecomer/businessOrders/'+src.businessId+'/'+orderId).catch(()=>null);if(branch&&!EDITABLE_STATUSES.has(String(branch.status||'nuevo')))throw new Error((biz.name||'El negocio')+' ya terminó la preparación y no admite más productos');const price=Number(p.price||src.price||0),qty=Number(src.qty||1),commissionPct=Number.isFinite(Number(biz.commissionPct))?Number(biz.commissionPct):QC.defaultFee,lineTotal=price*qty;additions.push({...src,name:p.name,price,qty,commissionPct,businessName:biz.name||src.businessName||'Establecimiento',orderFor:cleanPerson(src.orderFor),lineTotal,lineCommission:lineTotal*commissionPct/100,addedToExistingOrder:true,addedAt:new Date().toISOString()})}
    const groups={};additions.forEach(i=>(groups[i.businessId]??=[]).push(i));
    for(const [bid,items] of Object.entries(groups)){const branch=await dbGet('quecomer/businessOrders/'+bid+'/'+orderId).catch(()=>null),biz=businesses?.[bid]||{},addedSubtotal=items.reduce((n,i)=>n+Number(i.lineTotal||0),0),min=Math.max(0,Number(biz.minOrderAmount||0));if(!branch&&min>0&&addedSubtotal<min)throw new Error((biz.name||'Este negocio')+' requiere compra mínima de '+money(min))}
    let pay=externalPayment(master.paymentMethod);if(!pay){pay=document.getElementById('paymentMethod')?.value||'';if(!pay)throw new Error('Selecciona el medio de pago para los productos adicionales')}
    const now=new Date().toISOString(),editId='edit_'+Date.now().toString(36),addedTotals=cartTotals(additions),mergedItems=[...(master.items||[]),...additions];
    for(const [bid,items] of Object.entries(groups)){
      const current=await dbGet('quecomer/businessOrders/'+bid+'/'+orderId).catch(()=>null),bt=cartTotals(items),biz=businesses?.[bid]||{},branchName=biz.name||items[0]?.businessName||'Establecimiento';
      if(current){const currentItems=Array.isArray(current.items)?current.items:[];await patchJson('quecomer/businessOrders/'+bid+'/'+orderId,{items:[...currentItems,...items],subtotal:roundMoney(Number(current.subtotal||0)+bt.subtotal),platformFee:roundMoney(Number(current.platformFee||0)+bt.fee),total:roundMoney(Number(current.total||0)+bt.total),sellerNet:roundMoney(Number(current.sellerNet||0)+bt.sellerNet),externalAmount:roundMoney(Number(current.externalAmount||0)+bt.total),cashbackEligibleAmount:roundMoney(Number(current.cashbackEligibleAmount||0)+bt.total),paymentMethod:current.paymentMethod==='Saldo Qué Comer Hoy'?'Saldo Qué Comer Hoy + '+pay:(current.paymentMethod||pay),customerEditedAt:now,lastCustomerAdditionAt:now,lastCustomerAdditionTotal:roundMoney(bt.total),updatedAt:now,editCount:Number(current.editCount||0)+1})}
      else{await dbPut('quecomer/businessOrders/'+bid+'/'+orderId,{id:orderId,parentOrderId:orderId,businessId:bid,businessName:branchName,createdAt:master.createdAt||now,status:'nuevo',customer:master.customer,paymentMethod:pay,walletUsed:0,externalAmount:roundMoney(bt.total),loyaltyPct:Number(master.loyaltyPct||QC.loyaltyPct||0),loyaltyCustomerKey:master.loyaltyCustomerKey||'',cashbackEligibleAmount:roundMoney(bt.total),items,subtotal:roundMoney(bt.subtotal),platformFee:roundMoney(bt.fee),total:roundMoney(bt.total),sellerNet:roundMoney(bt.sellerNet),source:'web-pedidos-edicion',customerEditedAt:now,lastCustomerAdditionAt:now,lastCustomerAdditionTotal:roundMoney(bt.total),updatedAt:now})}
    }
    const businessIds=[...new Set(mergedItems.map(i=>i.businessId).filter(Boolean))];await patchJson('quecomer/orders/'+orderId,{items:mergedItems,subtotal:roundMoney(Number(master.subtotal||0)+addedTotals.subtotal),platformFee:roundMoney(Number(master.platformFee||0)+addedTotals.fee),total:roundMoney(Number(master.total||0)+addedTotals.total),sellerNet:roundMoney(Number(master.sellerNet||0)+addedTotals.sellerNet),externalAmount:roundMoney(Number(master.externalAmount||0)+addedTotals.total),paymentMethod:master.paymentMethod==='Saldo Qué Comer Hoy'?'Saldo Qué Comer Hoy + '+pay:(master.paymentMethod||pay),businessCount:businessIds.length,lastEditedAt:now,lastCustomerAdditionAt:now,lastCustomerAdditionTotal:roundMoney(addedTotals.total),editCount:Number(master.editCount||0)+1,updatedAt:now});
    await patchJson('quecomer/orders/'+orderId+'/editHistory/'+editId,{id:editId,createdAt:now,addedTotal:roundMoney(addedTotals.total),items:additions.map(i=>({productId:i.productId,businessId:i.businessId,name:i.name,qty:i.qty,price:i.price,orderFor:i.orderFor||''}))});
    const watch=QC.orderWatches.find(w=>String(w.orderId)===String(orderId));if(watch){for(const [bid,items] of Object.entries(groups)){let part=(watch.parts||[]).find(p=>String(p.businessId)===String(bid));if(!part){part={businessId:bid,businessName:businesses?.[bid]?.name||items[0]?.businessName||'Establecimiento',status:'nuevo',notifiedReady:false,unreadMessages:0,knownMessageIds:[],messages:[],items:[]};watch.parts.push(part)}part.items=[...(part.items||[]),...items.map(i=>({name:i.name,qty:i.qty,orderFor:i.orderFor||''}))]}saveOrderWatches()}
    QC.editOrder=null;QC.cart=[];saveCart();QC.currentOrderFor='';savePeople();renderCart();document.getElementById('useWallet').disabled=false;document.getElementById('paymentMethod').value='';closeCart();toast('Pedido actualizado. Se agregaron los productos nuevos.');
  }catch(e){toast(e.message||'No se pudo actualizar el pedido')}
  finally{btn.disabled=false;btn.textContent=QC.editOrder?'Actualizar pedido':'Enviar pedido'}
}
const sendButton=document.getElementById('sendOrder'),normalSendHandler=sendButton?.onclick;if(sendButton)sendButton.onclick=function(e){if(QC.editOrder)return updateExistingOrder();if(normalSendHandler)return normalSendHandler.call(this,e)};

ensureNamedOrderUI();renderCart();
})();