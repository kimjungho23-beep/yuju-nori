// 유주 놀이터 오프라인 저장소. 앱을 고치면 VERSION 숫자를 올려주세요 (index.html의 APP_VERSION도 같이).
const VERSION = 'yuju-v22';
const CORE = ['./', './index.html', './manifest.json', './chars/chars.js',
  './chars/bg_land.webp', './chars/bg_sea.webp', './chars/crab.webp', './chars/deer.webp', './chars/dolphin.webp',
  './chars/dress_blue.webp', './chars/dress_pink.webp', './chars/dress_yellow.webp', './chars/fish.webp', './chars/fish0.webp',
  './chars/fish1.webp', './chars/fish2.webp', './chars/fish4.webp', './chars/fish5.webp', './chars/fish6.webp',
  './chars/fr_apple.webp', './chars/fr_banana.webp', './chars/fr_blueberry.webp', './chars/fr_grape.webp', './chars/fr_orange.webp',
  './chars/fr_peach.webp', './chars/giraffe.webp', './chars/ic_bubble.webp', './chars/ic_draw.webp', './chars/ic_dress.webp',
  './chars/ic_peek.webp', './chars/ic_puzzle.webp', './chars/l_bush.webp', './chars/l_flowers.webp', './chars/l_hay.webp',
  './chars/l_mushroom.webp', './chars/l_rock.webp', './chars/l_stump.webp', './chars/octo.webp', './chars/p_chest.webp',
  './chars/p_coral.webp', './chars/p_pearl.webp', './chars/p_rock.webp', './chars/p_shell.webp', './chars/p_star.webp',
  './chars/p_weed.webp', './chars/penguin.webp', './chars/puppy.webp', './chars/rabbit.webp', './chars/rabbit_closed.webp',
  './chars/rabbit_open.webp', './chars/raccoon.webp', './chars/shark.webp', './chars/shark_closed.webp', './chars/shark_open.webp',
  './chars/sleep_shark.webp', './chars/st_apple.webp', './chars/st_butterfly.webp', './chars/st_carrot.webp', './chars/st_cloud.webp',
  './chars/st_crown.webp', './chars/st_flower.webp', './chars/st_heart.webp', './chars/st_mushroom.webp', './chars/st_rainbow.webp',
  './chars/st_sun.webp', './chars/tiger.webp', './chars/turtle.webp', './chars/whale.webp', './chars/yuju.webp',
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
