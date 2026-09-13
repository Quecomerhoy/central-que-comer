(()=>{
if(window.__QC_BUSINESS_FEATURES_11817)return;window.__QC_BUSINESS_FEATURES_11817=true;
const style=document.createElement('style');style.textContent=`
.order-message-box{margin:12px 0 4px;padding:12px;border:1px solid var(--line);border-radius:13px;background:#fafafa}.order-message-title{font-size:12px;font-weight:900;color:#475467;margin-bottom:7px}.order-message-quick{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.order-message-quick .btn{padding:7px 9px;font-size:11px}.order-message-row{display:flex;gap:7px}.order-message-row input{flex:1;min-width:0;border:1px solid #d0d5dd;border-radius:10px;padding:9px 10px;background:#fff}.order-message-last{margin-top:7px;padding:8px 10px;border-radius:10px;background:#eff8ff;color:#175cd3;font-size:11px;line-height:1.35}.min-order-setting{grid-column:1/-1;border:1px solid #fedf89;background:#fffaeb;border-radius:13px;padding:12px;margin-top:4px}.min-order-setting .small{margin-top:5px}@media(max-width:560px){.order-message-row{flex-direction:column}.order-message-row .btn{width:100%}}`;
document.head.appendChild(style);

function qcSpeakBusinessAlert(text){
  try{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const u=new SpeechSynthesisUtterance(String(text||''));
    u.lang='es-MX';u.rate=.92;u.pitch=1;u.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(x=>String(x.lang||'').toLowerCase().startsWith('es-mx'))||
            voices.find(x=>String(x.lang||'').toLowerCase().startsWith('es'));
    if(v)u.voice=v;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
window.speakBusiness=qcSpeakBusinessAlert;
['pointerdown','touchstart','click'].forEach(ev=>document.addEventListener(ev,()=>{try{window.speechSynthesis?.resume()}catch(e){}},{passive:true}));


A.minOrderAmount=Math.max(0,Number(A.minOrderAmount||0));
const configBody=document.querySelector('#configModal .modalbody .formgrid');
if(configBody&&!document.getElementById('minOrderAmount')){
  const box=document.createElement('div');box.className='min-order-setting';box.innerHTML=`<div class="field" style="margin:0"><label>Monto mínimo de compra</label><input id="minOrderAmount" type="number" min="0" step="1" inputmode="decimal" placeholder="0"><div class="small">Se muestra al cliente en el menú. Escribe 0 para no exigir compra mínima.</div></div><div class="actions"><button class="btn primary" id="saveMinOrder" type="button">Guardar monto mínimo</button></div>`;configBody.appendChild(box);
}
async function syncMinOrder(){if(!A.dbUrl||!A.businessId||A.accessStatus!=='active')return;try{const b=await get('quecomer/businesses/'+A.businessId);A.minOrderAmount=Math.max(0,Number(b?.minOrderAmount||0));const el=document.getElementById('minOrderAmount');if(el)el.value=A.minOrderAmount}catch(e){}}
const minInput=document.getElementById('minOrderAmount');if(minInput)minInput.value=A.minOrderAmount;
const saveMin=document.getElementById('saveMinOrder');if(saveMin)saveMin.onclick=async()=>{if(A.accessStatus!=='active'||!A.dbUrl||!A.businessId){toast('El visor debe estar activado');return}const value=Math.max(0,Number(minInput?.value||0));if(!Number.isFinite(value)){toast('Escribe un monto válido');return}try{await patch('quecomer/businesses/'+A.businessId,{minOrderAmount:value,updatedAt:new Date().toISOString()});A.minOrderAmount=value;if(minInput)minInput.value=value;toast(value>0?'Compra mínima guardada: '+money(value):'Compra mínima desactivada')}catch(e){toast(e.message)}};
const configButton=document.getElementById('configBtn'),oldConfigClick=configButton?.onclick;if(configButton)configButton.onclick=async function(e){await syncMinOrder();if(oldConfigClick)return oldConfigClick.call(this,e)};
syncMinOrder().catch(()=>{});

function messagesOf(order){return order?.messages&&typeof order.messages==='object'?Object.entries(order.messages).map(([id,v])=>({id,...(v||{})})).sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))):[]}
async function sendMessage(orderId,text){if(A.accessStatus!=='active'||A.platformBlocked)return;const clean=String(text||'').trim().slice(0,300);if(!clean){toast('Escribe el mensaje para el cliente');return}const order=A.orders.find(x=>String(x.id)===String(orderId));if(!order)return;const now=new Date().toISOString(),id=makeId('msg'),data={id,text:clean,sender:'business',businessId:A.businessId,businessName:A.businessName,createdAt:now};try{await put('quecomer/businessOrders/'+A.businessId+'/'+orderId+'/messages/'+id,data);await patch('quecomer/businessOrders/'+A.businessId+'/'+orderId,{lastMessage:clean,lastMessageAt:now,updatedAt:now});order.messages=order.messages||{};order.messages[id]=data;order.lastMessage=clean;order.lastMessageAt=now;renderOrders();toast('Mensaje enviado al cliente')}catch(e){toast(e.message)}}
function decorateOrders(){document.querySelectorAll('#orders .order').forEach(card=>{if(card.querySelector('.order-message-box'))return;const finalize=card.querySelector('[data-finalize]'),orderId=finalize?.dataset.finalize;if(!orderId)return;const order=A.orders.find(x=>String(x.id)===String(orderId));if(!order)return;const msgs=messagesOf(order),last=msgs[msgs.length-1];const box=document.createElement('div');box.className='order-message-box';box.innerHTML=`<div class="order-message-title">💬 Mensaje para el cliente</div><div class="order-message-quick"><button class="btn" type="button" data-qm="preparing">👨‍🍳 Preparando pedido</button><button class="btn" type="button" data-qm="way">🛵 Ya va en camino</button><button class="btn" type="button" data-qm="outside">📍 Ya estamos afuera</button></div><div class="order-message-row"><input maxlength="300" placeholder="Escribe un mensaje editable para el cliente"><button class="btn primary" type="button">Enviar mensaje</button></div>${last?`<div class="order-message-last"><b>Último mensaje:</b> ${esc(last.text||'')}</div>`:''}`;const input=box.querySelector('input'),send=box.querySelector('.order-message-row .btn');box.querySelector('[data-qm="preparing"]').onclick=()=>{input.value='👨‍🍳 Estamos preparando tu pedido';input.focus()};box.querySelector('[data-qm="way"]').onclick=()=>{input.value='🛵 Tu pedido ya va en camino';input.focus()};box.querySelector('[data-qm="outside"]').onclick=()=>{input.value='📍 Ya estamos afuera con tu pedido';input.focus()};send.onclick=()=>sendMessage(orderId,input.value);const bottom=card.querySelector('.order-bottom');card.insertBefore(box,bottom||null)})}
const originalRenderOrders=renderOrders;renderOrders=function(){const result=originalRenderOrders.apply(this,arguments);decorateOrders();return result};decorateOrders();

// Sincronización en vivo del porcentaje de uso/comisión definido por Control Central.
// El core ya consulta Firebase periódicamente; aquí refrescamos la interfaz cuando ese valor cambia.
if(typeof loadBusinessStatus==='function'&&!window.__QC_LIVE_COMMISSION_1191){
  window.__QC_LIVE_COMMISSION_1191=true;
  const qcBaseLoadBusinessStatus1191=loadBusinessStatus;
  loadBusinessStatus=async function(){
    const before=Number(A.defaultFee);
    const result=await qcBaseLoadBusinessStatus1191.apply(this,arguments);
    const after=Number(A.defaultFee);
    if(Number.isFinite(after)&&Math.abs(after-before)>0.000001){
      (A.products||[]).forEach(p=>p.commissionPct=after);
      if(typeof renderProducts==='function')renderProducts();
      const feeLabel=document.getElementById('productBranchFee');
      if(feeLabel)feeLabel.textContent=after.toFixed(2)+'% · definida por Control central';
      if(typeof toast==='function')toast('Uso de app actualizado a '+after.toFixed(2)+'%');
    }
    return result;
  };
}
})();