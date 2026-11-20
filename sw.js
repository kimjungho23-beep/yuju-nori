// 유주 놀이터 오프라인 저장소. 앱을 고치면 VERSION 숫자를 올려주세요 (index.html의 APP_VERSION도 같이).
const VERSION = 'yuju-v19';
const CORE = ['./', './index.html', './manifest.json', './chars/chars.js',
  './chars/shark_closed.webp', './chars/shark_open.webp',
  './chars/fish0.webp', './chars/fish1.webp', './chars/fish2.webp', './chars/fish4.webp', './chars/fish5.webp', './chars/fish6.webp',
  './chars/p_rock.webp', './chars/p_shell.webp', './chars/p_coral.webp', './chars/p_weed.webp', './chars/p_chest.webp', './chars/p_star.webp', './chars/p_pearl.webp',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  // cache:'reload' = 브라우저에 남은 옛 파일 말고 서버에서 새로 받기
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 글씨체(Google Fonts): 한 번 받으면 계속 저장본 사용
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // 앱 화면(index.html): 인터넷이 되면 항상 최신으로, 안 되면(3.5초) 저장본으로
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3500);
        const res = await fetch('./index.html', { cache: 'no-cache', signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error(res.status);
        c.put('./index.html', res.clone());
        return res;
      } catch (_) {
        return (await c.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // 아이콘 등 나머지: 저장본 먼저, 뒤에서 새로 받아두기
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok) c.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
