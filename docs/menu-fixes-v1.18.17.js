(()=>{
if(window.__QC_MENU_FIXES_11820)return;window.__QC_MENU_FIXES_11820=true;
const style=document.createElement('style');
style.textContent=`
#openCart.cartbtn.qc-floating-cart{position:fixed!important;right:14px!important;bottom:calc(16px + env(safe-area-inset-bottom))!important;top:auto!important;left:auto!important;inset:auto 14px calc(16px + env(safe-area-inset-bottom)) auto!important;margin:0!important;transform:none!important;z-index:9999!important;width:62px!important;height:62px!important;min-width:62px!important;min-height:62px!important;max-width:62px!important;max-height:62px!important;padding:0!important;border-radius:50%!important;display:grid!important;place-items:center!important;box-shadow:0 14px 34px rgba(17,24,39,.32)!important;font-size:27px!important}
#openCart.cartbtn.qc-floating-cart .badge{position:absolute!important;right:-3px!important;top:-5px!important;min-width:23px!important;height:23px!important;display:grid!important;place-items:center!important;font-size:12px!important;padding:0 5px!important}
.hero{display:none!important}
.header .logo{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent}
.qc-info-overlay{position:fixed;inset:0;background:rgba(17,24,39,.58);z-index:10050;display:none;padding:18px;overflow:auto}
.qc-info-overlay.show{display:block}
.qc-info-card{width:min(620px,100%);margin:max(70px,env(safe-area-inset-top)) auto 28px;background:#fff;border-radius:22px;box-shadow:0 28px 70px rgba(0,0,0,.28);overflow:hidden}
.qc-info-head{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line,#e5e7eb)}
.qc-info-head h3{margin:0;flex:1;font-size:18px}.qc-info-close{border:0;background:#f2f4f7;width:36px;height:36px;border-radius:10px;font-size:20px;font-weight:900}
.qc-info-body{padding:20px}.qc-info-body h2{margin:0 0 10px;font-size:30px;line-height:1.08;color:#101828}.qc-info-body p{margin:0;color:#475467;line-height:1.5;font-size:15px}
.qc-info-status{display:flex;align-items:center;gap:9px;margin-top:16px;background:#f2f4f7;border-radius:999px;padding:10px 12px;width:max-content;max-width:100%;font-weight:850;color:#344054;font-size:13px}.qc-info-dot{width:11px;height:11px;border-radius:50%;background:#f04438;flex:0 0 11px}.qc-info-dot.ok{background:#12b76a}
@media(max-width:600px){body{padding-bottom:92px!important}#openCart.cartbtn.qc-floating-cart{right:12px!important;bottom:calc(14px + env(safe-area-inset-bottom))!important;inset:auto 12px calc(14px + env(safe-area-inset-bottom)) auto!important;width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;max-width:58px!important;max-height:58px!important;font-size:25px!important}.qc-info-body h2{font-size:25px}.qc-info-card{margin-top:max(28px,env(safe-area-inset-top))}}
`;
document.head.appendChild(style);

function placeFloatingCart(){
  const cart=document.getElementById('openCart');
  if(!cart)return;
  if(cart.parentElement!==document.body)document.body.appendChild(cart);
  cart.classList.add('qc-floating-cart');
  cart.setAttribute('aria-label','Abrir carrito');
  cart.setAttribute('title','Carrito');
  cart.style.setProperty('position','fixed','important');
  cart.style.setProperty('right','14px','important');
  cart.style.setProperty('bottom','calc(16px + env(safe-area-inset-bottom))','important');
  cart.style.setProperty('top','auto','important');
  cart.style.setProperty('left','auto','important');
  cart.style.setProperty('margin','0','important');
  cart.style.setProperty('transform','none','important');
  cart.style.setProperty('z-index','9999','important');
}
placeFloatingCart();
setTimeout(placeFloatingCart,100);
setTimeout(placeFloatingCart,500);
setTimeout(placeFloatingCart,1500);
new MutationObserver(placeFloatingCart).observe(document.body,{childList:true,subtree:true});

function ensureInfoModal(){
  if(document.getElementById('qcInfoOverlay'))return;
  const overlay=document.createElement('div');
  overlay.id='qcInfoOverlay';overlay.className='qc-info-overlay';
  overlay.innerHTML=`<div class="qc-info-card" role="dialog" aria-modal="true" aria-labelledby="qcInfoTitle"><div class="qc-info-head"><h3>Qué Comer Hoy</h3><button class="qc-info-close" id="qcInfoClose" type="button" aria-label="Cerrar">×</button></div><div class="qc-info-body"><h2 id="qcInfoTitle">¿Qué se te antoja hoy?</h2><p>Compra en distintos establecimientos desde un solo menú. Cada producto indica claramente qué negocio lo prepara.</p><div class="qc-info-status"><span class="qc-info-dot" id="qcInfoDot"></span><span id="qcInfoStatus">Conectando...</span></div></div></div>`;
  document.body.appendChild(overlay);
  document.getElementById('qcInfoClose').onclick=()=>overlay.classList.remove('show');
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('show')});
}
function syncInfoStatus(){
  const text=document.getElementById('statusText')?.textContent||'Conectando...';
  const ok=document.getElementById('dot')?.classList.contains('ok')||false;
  const out=document.getElementById('qcInfoStatus'),dot=document.getElementById('qcInfoDot');
  if(out)out.textContent=text;if(dot)dot.classList.toggle('ok',ok);
}
function openInfo(){ensureInfoModal();syncInfoStatus();document.getElementById('qcInfoOverlay')?.classList.add('show')}
ensureInfoModal();
const logo=document.querySelector('.header .logo');
if(logo){
  logo.setAttribute('role','button');logo.setAttribute('tabindex','0');logo.setAttribute('aria-label','Ver información del menú');
  logo.onclick=openInfo;
  logo.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInfo()}};
}
const statusText=document.getElementById('statusText'),statusDot=document.getElementById('dot');
if(statusText)new MutationObserver(syncInfoStatus).observe(statusText,{childList:true,subtree:true,characterData:true});
if(statusDot)new MutationObserver(syncInfoStatus).observe(statusDot,{attributes:true,attributeFilter:['class']});
syncInfoStatus();

function qcSpeakClientAlert(text){
  try{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    const u=new SpeechSynthesisUtterance(String(text||''));
    u.lang='es-MX';u.rate=.94;u.pitch=1;u.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(x=>String(x.lang||'').toLowerCase().startsWith('es-mx'))||voices.find(x=>String(x.lang||'').toLowerCase().startsWith('es'));
    if(v)u.voice=v;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
window.speakClient=qcSpeakClientAlert;
['pointerdown','touchstart','click'].forEach(ev=>document.addEventListener(ev,()=>{try{window.speechSynthesis?.resume()}catch(e){}},{passive:true}));
})();