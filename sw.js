const C='jarbas-202611012107';
const A=['./','index.html','giro.html','manifest.webmanifest','icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
// alerta de parcial/fechamento (Web Push): aparece mesmo com o app fechado; ao tocar, abre o app com o popup e o alarme
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){}
  e.waitUntil(self.registration.showNotification(d.titulo||'Jarbas',{body:d.corpo||'',tag:'alerta-'+(d.alerta||''),renotify:true,requireInteraction:true,
    vibrate:[700,250,700,250,1000],icon:'icons/icon-192.png',badge:'icons/icon-192.png',data:{alerta:d.alerta||''}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url='./#alerta-'+String(e.notification.data?.alerta||'').replace(':','');
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{for(const w of ws){if('focus' in w){w.navigate(url).catch(()=>{});return w.focus()}}return clients.openWindow(url)}))});
