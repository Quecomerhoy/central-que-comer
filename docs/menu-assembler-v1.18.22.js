(()=>{
if(window.__QC_MENU_ASSEMBLER_11822)return;window.__QC_MENU_ASSEMBLER_11822=true;
const wait=()=>{
  if(!window.QC||!Array.isArray(QC.cart)||!('orderForPeople' in QC)){setTimeout(wait,60);return}
  init();
};
function init(){
  const style=document.createElement('style');
  style.textContent=`
  #namedOrderBox{display:none!important}
  .assemblebtn{border:1px solid var(--line);background:#fff;border-radius:999px;padding:10px 13px;font-weight:900;color:#374151;white-space:nowrap}
  .assemble-overlay{position:fixed;inset:0;background:rgba(17,24,39,.58);z-index:10120;display:none;padding:16px;overflow:auto}.assemble-overlay.show{display:block}
  .assemble-card{width:min(620px,100%);margin:max(45px,env(safe-area-inset-top)) auto 30px;background:#fff;border-radius:22px;box-shadow:0 28px 70px rgba(0,0,0,.28);overflow:hidden}
  .assemble-head{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid var(--line)}.assemble-head h3{margin:0;flex:1;font-size:20px}.assemble-close{border:0;background:#f2f4f7;width:36px;height:36px;border-radius:10px;font-size:20px;font-weight:900}
  .assemble-body{padding:18px}.assemble-note{background:#eff8ff;border:1px solid #b2ddff;color:#175cd3;border-radius:12px;padding:11px 12px;font-size:12px;line-height:1.45;margin-bottom:12px}
  .assemble-row{display:flex;gap:8px}.assemble-row input{flex:1;min-width:0;border:1px solid #d0d5dd;border-radius:11px;padding:10px 11px}.assemble-row button{border:0;border-radius:11px;background:#101828;color:#fff;padding:10px 12px;font-weight:900}
  .assemble-people{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.assemble-person{border:1px solid #d0d5dd;background:#fff;border-radius:999px;padding:7px 10px;font-size:12px;font-weight:850;color:#475467}.assemble-person.active{background:#101828;color:#fff;border-color:#101828}
  .assemble-current{margin-top:12px;border:1px solid #fedf89;background:#fffaeb;color:#93370d;border-radius:12px;padding:10px 11px;font-size:12px;font-weight:850}
  .assemble-summary{margin-top:14px;border-top:1px solid var(--line);padding-top:12px}.assemble-summary h4{margin:0 0 8px;font-size:14px}.assemble-group{border:1px solid var(--line);border-radius:12px;padding:9px 10px;margin-top:7px}.assemble-group b{display:block;font-size:12px}.assemble-group small{display:block;color:var(--muted);margin-top:3px;line-height:1.35}
  .assemble-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:15px}.assemble-done{border:0;border-radius:12px;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff;padding:11px 14px;font-weight:900}
  .qc-shipping-box{margin-top:16px;border-top:1px solid var(--line,#e5e7eb);padding-top:14px}.qc-shipping-box h4{margin:0 0 9px;font-size:14px;color:#101828}.qc-shipping-grid{display:grid;gap:7px}.qc-shipping-row{background:#f8fafc;border:1px solid #e4e7ec;border-radius:10px;padding:9px 10px}.qc-shipping-row small{display:block;color:#667085;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}.qc-shipping-row b{display:block;margin-top:2px;color:#344054;font-size:13px;word-break:break-word}.qc-shipping-empty{color:#667085;font-size:12px}
  .arm-active{box-shadow:0 0 0 2px #fedf89 inset!important;color:#93370d!important}
  @media(max-width:600px){.assemblebtn{padding:9px 10px;font-size:12px}.assemble-row{flex-direction:column}.assemble-row button{width:100%}.assemble-card{margin-top:max(22px,env(safe-area-inset-top))}}
  `;
  document.head.appendChild(style);

  function clean(v){return String(v||'').trim().replace(/\s+/g,' ').slice(0,60)}
  function persist(){localStorage.setItem('qc_order_for_people_v1',JSON.stringify((QC.orderForPeople||[]).slice(0,30)));localStorage.setItem('qc_current_order_for_v1',QC.currentOrderFor||'')}
  function setPerson(name){QC.currentOrderFor=clean(name);if(QC.currentOrderFor&&!QC.orderForPeople.includes(QC.currentOrderFor))QC.orderForPeople.push(QC.currentOrderFor);persist();renderAssembler();updateArmarButton();try{renderCart()}catch(e){};toast(QC.currentOrderFor?'Ahora agregas productos para '+QC.currentOrderFor:'Pedido general seleccionado')}
  function people(){return [...new Set((QC.orderForPeople||[]).concat(QC.cart.map(i=>clean(i.orderFor)).filter(Boolean)))]}
  function groupedCart(){const map=new Map();for(const item of QC.cart){const key=clean(item.orderFor)||'General';if(!map.has(key))map.set(key,[]);map.get(key).push(item)}return map}

  function ensureAssembler(){
    if(document.getElementById('assembleOverlay'))return;
    const overlay=document.createElement('div');overlay.id='assembleOverlay';overlay.className='assemble-overlay';overlay.innerHTML=`<div class="assemble-card" role="dialog" aria-modal="true"><div class="assemble-head"><h3>👥 Armar pedido por nombres</h3><button class="assemble-close" id="assembleClose" type="button">×</button></div><div class="assemble-body"><div class="assemble-note">Una sola persona puede pedir para varias. Escribe un nombre, selecciónalo y luego agrega sus productos desde el menú. Regresa a <b>Armar</b> para cambiar de nombre y continuar. Todo se enviará dentro del mismo pedido.</div><div class="assemble-row"><input id="assembleName" maxlength="60" placeholder="Ej. Juan, María, Oficina 2"><button id="assembleAdd" type="button">Agregar nombre</button></div><div class="assemble-people" id="assemblePeople"></div><div class="assemble-current" id="assembleCurrent"></div><div class="assemble-summary"><h4>Pedido armado hasta ahora</h4><div id="assembleSummary"></div></div><div class="assemble-actions"><button class="assemble-done" id="assembleDone" type="button">Listo · elegir productos</button></div></div></div>`;document.body.appendChild(overlay);
    document.getElementById('assembleClose').onclick=closeAssembler;document.getElementById('assembleDone').onclick=closeAssembler;overlay.addEventListener('click',e=>{if(e.target===overlay)closeAssembler()});
    document.getElementById('assembleAdd').onclick=()=>{const input=document.getElementById('assembleName'),name=clean(input.value);if(!name){setPerson('');return}setPerson(name);input.value=''};
    document.getElementById('assembleName').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('assembleAdd').click()}};
  }
  function renderAssembler(){
    ensureAssembler();const p=document.getElementById('assemblePeople'),names=people();p.innerHTML=`<button class="assemble-person ${!QC.currentOrderFor?'active':''}" type="button" data-person="">General</button>`+names.map(n=>`<button class="assemble-person ${clean(QC.currentOrderFor)===n?'active':''}" type="button" data-person="${esc(n)}">${esc(n)}</button>`).join('');p.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>setPerson(b.dataset.person||''));
    const active=clean(QC.currentOrderFor);document.getElementById('assembleCurrent').innerHTML=active?`Ahora los productos que agregues serán para: <b>${esc(active)}</b>`:'Ahora los productos que agregues serán para el <b>pedido general</b>.';
    const groups=groupedCart(),summary=document.getElementById('assembleSummary');summary.innerHTML=groups.size?[...groups.entries()].map(([name,items])=>`<div class="assemble-group"><b>${esc(name)}</b><small>${items.map(i=>`${Number(i.qty||1)} × ${esc(i.name||'Producto')}`).join(' · ')}</small></div>`).join(''):'<div class="qc-shipping-empty">Todavía no hay productos agregados.</div>';
  }
  function openAssembler(){ensureAssembler();renderAssembler();document.getElementById('assembleOverlay').classList.add('show');setTimeout(()=>document.getElementById('assembleName')?.focus(),80)}
  function closeAssembler(){document.getElementById('assembleOverlay')?.classList.remove('show')}
  window.qcOpenAssembler=openAssembler;

  function updateArmarButton(){const b=document.getElementById('assembleOrder');if(!b)return;const name=clean(QC.currentOrderFor);b.innerHTML=name?`👥 Armar · ${esc(name)}`:'👥 Armar';b.classList.toggle('arm-active',!!name)}
  const old=document.getElementById('editProfile');if(old){old.id='assembleOrder';old.classList.add('assemblebtn');old.classList.remove('profilebtn');old.innerHTML='👥 Armar';old.onclick=openAssembler;old.removeAttribute('title')}else if(!document.getElementById('assembleOrder')){const msg=document.getElementById('openMessages'),b=document.createElement('button');b.id='assembleOrder';b.className='assemblebtn';b.type='button';b.innerHTML='👥 Armar';b.onclick=openAssembler;msg?.parentNode.insertBefore(b,msg)}
  updateArmarButton();

  function shippingHtml(){
    let profile=null;try{profile=typeof getCustomerProfile==='function'?getCustomerProfile():JSON.parse(localStorage.getItem('qc_customer_profile_v1')||'null')}catch(e){}
    if(!profile)return '<div class="qc-shipping-empty">Los datos de envío se solicitarán automáticamente antes de realizar el primer pedido.</div>';
    return `<div class="qc-shipping-grid"><div class="qc-shipping-row"><small>Nombre</small><b>${esc(profile.name||'—')}</b></div><div class="qc-shipping-row"><small>Teléfono</small><b>${esc(profile.phone||'—')}</b></div><div class="qc-shipping-row"><small>Dirección de envío</small><b>${esc(profile.address||'—')}</b></div></div>`;
  }
  function ensureShippingInfo(){const body=document.querySelector('#qcInfoOverlay .qc-info-body');if(!body)return;let box=document.getElementById('qcShippingInfo');if(!box){box=document.createElement('div');box.id='qcShippingInfo';box.className='qc-shipping-box';box.innerHTML='<h4>📍 Datos de envío</h4><div id="qcShippingContent"></div>';body.appendChild(box)}const content=document.getElementById('qcShippingContent');if(content)content.innerHTML=shippingHtml()}
  ensureShippingInfo();const logo=document.querySelector('.header .logo');if(logo){const oldClick=logo.onclick;logo.onclick=function(e){if(oldClick)oldClick.call(this,e);setTimeout(ensureShippingInfo,0)}}

  function improveEditButtons(){document.querySelectorAll('.order-edit-btn').forEach(btn=>btn.textContent='✏️ Editar pedido · agregar productos');document.querySelectorAll('.order-edit-note').forEach(n=>n.textContent='Solo puedes agregar productos. Los productos ya enviados o en preparación permanecen bloqueados y no se pueden cambiar ni quitar.')}
  const messages=document.getElementById('messagesList');if(messages)new MutationObserver(improveEditButtons).observe(messages,{childList:true,subtree:true});setTimeout(improveEditButtons,200);

  const send=document.getElementById('sendOrder');if(send)send.addEventListener('click',()=>setTimeout(()=>{if(!QC.cart.length&&!QC.editOrder){QC.currentOrderFor='';QC.orderForPeople=[];persist();updateArmarButton();renderAssembler()}},1800));
  const baseRender=renderCart;renderCart=function(){const r=baseRender.apply(this,arguments);updateArmarButton();if(document.getElementById('assembleOverlay')?.classList.contains('show'))renderAssembler();return r};
  updateArmarButton();
}
wait();
})();