(()=>{
if(window.__QC_MENU_UI_11826)return;window.__QC_MENU_UI_11826=true;
const wait=()=>{
  if(typeof QC==='undefined'){setTimeout(wait,60);return}
  init();
};
function init(){
  const style=document.createElement('style');
  style.textContent=`
  #namedOrderBox{display:none!important}
  .assemblebtn.qc-header-armar{border:1px solid var(--line);background:#fff;border-radius:999px;padding:10px 13px;font-weight:900;color:#374151;white-space:nowrap;display:inline-flex;align-items:center;gap:5px}
  .qc-order-data-box{margin-top:16px;border-top:1px solid var(--line,#e5e7eb);padding-top:14px}.qc-order-data-box h4{margin:0 0 9px;font-size:14px;color:#101828}.qc-order-data-grid{display:grid;gap:7px}.qc-order-data-row{background:#f8fafc;border:1px solid #e4e7ec;border-radius:10px;padding:9px 10px}.qc-order-data-row small{display:block;color:#667085;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}.qc-order-data-row b{display:block;margin-top:2px;color:#344054;font-size:13px;word-break:break-word}.qc-order-data-empty{color:#667085;font-size:12px}
  @media(max-width:600px){.assemblebtn.qc-header-armar{padding:9px 10px;font-size:12px}.header-inner .logo{max-width:calc(100vw - 176px)!important}.assemblebtn.qc-header-armar .qc-armar-text{display:inline}}
  @media(max-width:390px){.assemblebtn.qc-header-armar{padding:9px 8px;font-size:11px}.assemblebtn.qc-header-armar .qc-armar-text{max-width:72px;overflow:hidden;text-overflow:ellipsis}.header-inner .logo{max-width:calc(100vw - 164px)!important}}
  `;
  document.head.appendChild(style);

  function removeCartNameBox(){const box=document.getElementById('namedOrderBox');if(box)box.remove()}

  function ensureHeaderArmar(){
    const header=document.querySelector('.header .header-inner');if(!header)return;
    const spacer=header.querySelector('.spacer');
    const messages=document.getElementById('openMessages');
    let btn=document.getElementById('assembleOrder');
    const old=document.getElementById('editProfile');
    if(old&&old!==btn)old.remove();
    if(!btn){btn=document.createElement('button');btn.id='assembleOrder';btn.type='button'}
    btn.className='assemblebtn qc-header-armar';
    btn.innerHTML='👥 <span class="qc-armar-text">Armar pedido</span>';
    btn.title='Armar pedido por nombres';
    btn.onclick=()=>{if(typeof window.qcOpenAssembler==='function')window.qcOpenAssembler();else if(typeof toast==='function')toast('Preparando el armador de pedidos...')};
    if(messages&&messages.parentElement===header)header.insertBefore(btn,messages);
    else if(spacer)spacer.after(btn);
    else if(btn.parentElement!==header)header.appendChild(btn);
  }

  function enforceLayout(){removeCartNameBox();ensureHeaderArmar()}
  enforceLayout();
  setTimeout(enforceLayout,100);setTimeout(enforceLayout,500);setTimeout(enforceLayout,1200);
  const cartBoxObserver=new MutationObserver(()=>removeCartNameBox());
  cartBoxObserver.observe(document.body,{childList:true,subtree:true});

  if(typeof renderCart==='function'){
    const baseRenderCart11826=renderCart;
    renderCart=function(){const r=baseRenderCart11826.apply(this,arguments);setTimeout(enforceLayout,0);return r};
  }

  function getProfile(){try{return typeof getCustomerProfile==='function'?getCustomerProfile():JSON.parse(localStorage.getItem('qc_customer_profile_v1')||'null')}catch(e){return null}}
  function dataHtml(){const p=getProfile();if(!p)return '<div class="qc-order-data-empty">Los datos para tu pedido se solicitarán automáticamente antes de realizar la primera compra.</div>';return `<div class="qc-order-data-grid"><div class="qc-order-data-row"><small>Nombre</small><b>${esc(p.name||'—')}</b></div><div class="qc-order-data-row"><small>Teléfono</small><b>${esc(p.phone||'—')}</b></div><div class="qc-order-data-row"><small>Dirección de envío</small><b>${esc(p.address||'—')}</b></div></div>`}
  function ensureOrderDataInLogo(){
    const body=document.querySelector('#qcInfoOverlay .qc-info-body');if(!body)return;
    const oldShipping=document.getElementById('qcShippingInfo');if(oldShipping)oldShipping.remove();
    let box=document.getElementById('qcOrderDataInfo');
    if(!box){box=document.createElement('div');box.id='qcOrderDataInfo';box.className='qc-order-data-box';box.innerHTML='<h4>📋 Datos para pedidos</h4><div id="qcOrderDataContent"></div>';body.appendChild(box)}
    const content=document.getElementById('qcOrderDataContent');if(content){const next=dataHtml();if(content.innerHTML!==next)content.innerHTML=next}
  }
  ensureOrderDataInLogo();
  const logo=document.querySelector('.header .logo');
  if(logo){
    logo.addEventListener('click',()=>setTimeout(ensureOrderDataInLogo,0));
    logo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')setTimeout(ensureOrderDataInLogo,0)});
  }

  if(typeof saveCustomerProfile==='function'){
    const baseSaveCustomerProfile11826=saveCustomerProfile;
    saveCustomerProfile=function(){const r=baseSaveCustomerProfile11826.apply(this,arguments);setTimeout(ensureOrderDataInLogo,0);return r};
  }

  const profileModal=document.getElementById('profileModal');if(profileModal)profileModal.setAttribute('data-access','logo-info');
}
wait();
})();
