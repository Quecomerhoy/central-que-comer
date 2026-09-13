(()=>{
if(window.__QC_MENU_FIXES_11817)return;window.__QC_MENU_FIXES_11817=true;
const style=document.createElement('style');
style.textContent=`#openCart.cartbtn{position:fixed!important;right:14px!important;bottom:calc(14px + env(safe-area-inset-bottom))!important;top:auto!important;left:auto!important;z-index:135!important;box-shadow:0 14px 34px rgba(17,24,39,.30)!important}@media(max-width:600px){body{padding-bottom:96px!important}#openCart.cartbtn{right:12px!important;bottom:calc(12px + env(safe-area-inset-bottom))!important}}`;
document.head.appendChild(style);
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