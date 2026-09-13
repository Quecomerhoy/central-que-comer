const CACHE='que-comer-central-v1.18.17';
const CORE=[
  './',
  './index.html',
  './control-sistema-que-comer.html',
  './control-sistema-que-comer-core.html',
  './que-comer-pedidos.html',
  './que-comer-principal-negocio.html',
  './manifest-pedidos.webmanifest',
  './manifest-negocio.webmanifest',
  './manifest-control.webmanifest'
];
const STATIC=[
  './assets/que-comer-icon-180.png',
  './assets/que-comer-icon-192.png',
  './assets/que-comer-icon-512.png',
  './assets/favicon.png'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache=>Promise.allSettled(STATIC.map(a=>cache.add(a))))
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING') self.skipWaiting();
});

async function networkFresh(request){
  try{
    const response=await fetch(request,{cache:'no-store'});
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(request,response.clone()).catch(()=>{});
    }
    return response;
  }catch(err){
    const cached=await caches.match(request,{ignoreSearch:true});
    if(cached)return cached;
    throw err;
  }
}

async function mergedMenuFeatures(request){
  const [base,fix]=await Promise.all([
    fetch(request,{cache:'no-store'}),
    fetch('./menu-fixes-v1.18.17.js',{cache:'no-store'})
  ]);
  if(!base.ok)return base;
  const code=(await base.text())+'\n'+(fix.ok?await fix.text():'');
  return new Response(code,{status:200,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  const path=url.pathname.toLowerCase();

  if(path.endsWith('/business-features-v1.18.16.js')){
    event.respondWith(fetch('./business-features-v1.18.17.js',{cache:'no-store'}));
    return;
  }
  if(path.endsWith('/menu-features-v1.18.16.js')){
    event.respondWith(mergedMenuFeatures(event.request));
    return;
  }

  const fresh = event.request.mode==='navigate' ||
    event.request.destination==='document' ||
    path.endsWith('.html') ||
    path.endsWith('.webmanifest') ||
    path.endsWith('/service-worker.js')||path.endsWith('.js');

  if(fresh){
    event.respondWith(networkFresh(event.request));
    return;
  }

  if(event.request.destination==='image'){
    event.respondWith(
      caches.match(event.request).then(cached=>cached||fetch(event.request,{cache:'no-cache'}).then(response=>{
        if(response&&response.ok)caches.open(CACHE).then(c=>c.put(event.request,response.clone())).catch(()=>{});
        return response;
      }))
    );
    return;
  }

  event.respondWith(networkFresh(event.request));
});
