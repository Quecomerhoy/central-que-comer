const CACHE='que-comer-central-v1.17.2';
const ASSETS=[
  './',
  './index.html',
  './control-sistema-que-comer.html',
  './que-comer-pedidos.html',
  './que-comer-principal-negocio.html',
  './manifest-pedidos.webmanifest',
  './manifest-negocio.webmanifest',
  './manifest-control.webmanifest',
  './assets/que-comer-icon-180.png',
  './assets/que-comer-icon-192.png',
  './assets/que-comer-icon-512.png',
  './assets/favicon.png'
];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(ASSETS.map(a=>cache.add(a)))));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(fetch(event.request).then(response=>{
    const clone=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,clone)).catch(()=>{});
    return response;
  }).catch(()=>caches.match(event.request)));
});