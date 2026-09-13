(()=>{
if(window.__QC_MENU_FIXES_11819)return;window.__QC_MENU_FIXES_11819=true;
const style=document.createElement('style');
style.textContent=`
#openCart.cartbtn.qc-floating-cart{position:fixed!important;right:14px!important;bottom:calc(16px + env(safe-area-inset-bottom))!important;top:auto!important;left:auto!important;inset:auto 14px calc(16px + env(safe-area-inset-bottom)) auto!important;margin:0!important;transform:none!important;z-index:9999!important;width:62px!important;height:62px!important;min-width:62px!important;min-height:62px!important;max-width:62px!important;max-height:62px!important;padding:0!important;border-radius:50%!important;display:grid!important;place-items:center!important;box-shadow:0 14px 34px rgba(17,24,39,.32)!important;font-size:27px!important}
#openCart.cartbtn.qc-floating-cart .badge{position:absolute!important;right:-3px!important;top:-5px!important;min-width:23px!important;height:23px!important;display:grid!important;place-items:center!important;font-size:12px!important;padding:0 5px!important}
@media(max-width:600px){body{padding-bottom:92px!important}#openCart.cartbtn.qc-floating-cart{right:12px!important;bottom:calc(14px + env(safe-area-inset-bottom))!important;inset:auto 12px calc(14px + env(safe-area-inset-bottom)) auto!important;width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;max-width:58px!important;max-height:58px!important;font-size:25px!important}}
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