// 유주 놀이터 오프라인 저장소. 앱을 고치면 VERSION 숫자를 올려주세요 (index.html의 APP_VERSION도 같이).
const MUSIC_CACHE = 'yuju-music-1';
const VERSION = 'yuju-v46';
const CORE = ['./', './index.html', './manifest.json', './chars/chars.js', './voice/list.js',
  './chars/bg_land.webp', './chars/bg_sea.webp',
  './chars/ck_pot.webp', './chars/ck_stove.webp', './chars/ck_ladle.webp', './chars/ck_bowl_empty.webp', './chars/ck_bowl_carrot.webp', './chars/ck_bowl_miyeok.webp', './chars/ck_carrot.webp', './chars/ck_potato.webp', './chars/ck_broccoli.webp', './chars/ck_seaweed.webp', './chars/ck_tofu.webp', './chars/ck_mushroom.webp', './chars/bg_sea_peek.webp', './chars/bg_land_peek.webp', './chars/crab.webp', './chars/deer.webp', './chars/dolphin.webp',
  './chars/dress_blue.webp', './chars/dress_pink.webp', './chars/dress_yellow.webp', './chars/fish.webp', './chars/fish0.webp',
  './chars/fish1.webp', './chars/fish2.webp', './chars/fish4.webp', './chars/fish5.webp', './chars/fish6.webp',
  './chars/fr_apple.webp', './chars/fr_banana.webp', './chars/fr_blueberry.webp', './chars/fr_grape.webp', './chars/fr_orange.webp',
  './chars/fr_peach.webp', './chars/giraffe.webp', './chars/ic_bubble.webp', './chars/ic_draw.webp', './chars/ic_dress.webp',
  './chars/ic_peek.webp', './chars/ic_puzzle.webp',
  './chars/ic_music.webp', './chars/ic_shadow.webp', './chars/ic_train.webp', './chars/ic_fruit.webp', './chars/ic_cake.webp', './chars/ic_bath.webp', './chars/ba_mud1.webp', './chars/ba_mud2.webp', './chars/ba_mud3.webp',
  './chars/mu_bar0.webp', './chars/mu_bar1.webp', './chars/mu_bar2.webp', './chars/mu_bar3.webp', './chars/mu_bar4.webp', './chars/mu_bar5.webp', './chars/mu_bar6.webp', './chars/mu_bar7.webp', './chars/l_bush.webp', './chars/l_flowers.webp', './chars/l_hay.webp',
  './chars/l_mushroom.webp', './chars/l_rock.webp', './chars/l_stump.webp', './chars/octo.webp', './chars/p_chest.webp',
  './chars/p_coral.webp', './chars/p_pearl.webp', './chars/p_rock.webp', './chars/p_shell.webp', './chars/p_star.webp',
  './chars/p_weed.webp', './chars/penguin.webp', './chars/puppy.webp', './chars/rabbit.webp', './chars/rabbit_closed.webp',
  './chars/rabbit_open.webp', './chars/raccoon.webp', './chars/shark.webp', './chars/shark_closed.webp', './chars/shark_open.webp',
  './chars/sleep_shark.webp', './chars/st_apple.webp', './chars/st_butterfly.webp', './chars/st_carrot.webp', './chars/st_cloud.webp',
  './chars/st_crown.webp', './chars/st_flower.webp', './chars/st_heart.webp', './chars/st_mushroom.webp', './chars/st_rainbow.webp',
  './chars/st_sun.webp', './chars/tiger.webp', './chars/turtle.webp', './chars/whale.webp', './chars/yuju.webp',
  './chars/tr_engine.webp', './chars/tr_car.webp', './chars/tree.webp', './chars/basket.webp', './chars/cake.webp', './chars/candle.webp',
  './chars/fr_strawberry.webp', './chars/gift.webp', './chars/tub.webp', './chars/sponge.webp', './chars/shower.webp', './chars/duck.webp',
  './chars/tr_signal.webp', './chars/tr_tunnel.webp', './chars/tr_station.webp',
  './chars/fr_basin.webp', './chars/ba_towel.webp', './chars/ba_bed.webp',
  './chars/fd_brush.webp', './chars/fd_cup.webp', './chars/pk_camera.webp',
  './chars/zz_turtle.webp', './chars/zz_shark.webp', './chars/zz_fish.webp', './chars/zz_whale.webp', './chars/zz_penguin.webp', './chars/zz_octo.webp', './chars/zz_crab.webp', './chars/zz_dolphin.webp', './chars/zz_rabbit.webp', './chars/zz_deer.webp', './chars/zz_raccoon.webp', './chars/zz_tiger.webp', './chars/zz_puppy.webp', './chars/zz_giraffe.webp', './chars/zz_yuju.webp', './chars/zz_yuju_play.webp', './chars/zz_cat.webp', './chars/zz_bear.webp', './chars/zz_panda.webp', './chars/zz_elephant.webp', './chars/zz_lion.webp', './chars/zz_monkey.webp', './chars/zz_fox.webp', './chars/zz_squirrel.webp', './chars/zz_chick.webp', './chars/zz_pig.webp', './chars/zz_sheep.webp', './chars/zz_koala.webp', './chars/acc_crown.webp', './chars/acc_bow.webp', './chars/acc_flower.webp', './chars/acc_ears.webp', './chars/acc_hat.webp', './chars/acc_hglass.webp', './chars/acc_rglass.webp', './chars/acc_pearl.webp', './chars/acc_heartn.webp', './chars/acc_bowtie.webp', './chars/acc_tutu.webp', './chars/acc_tutup.webp', './chars/acc_wings.webp', './chars/acc_wand.webp', './chars/acc_bag.webp', './chars/acc_balloon.webp', './chars/note_pink.webp', './chars/note_blue.webp', './chars/note_yellow.webp', './chars/note_purple.webp', './chars/ic_star.webp', './chars/ba_paint1.webp', './chars/ba_paint2.webp', './chars/ba_paint3.webp', './chars/ba_paint4.webp', './chars/ba_paint5.webp', './chars/teeth_sea.webp', './chars/teeth_land.webp', './chars/fd_dirt1.webp', './chars/fd_dirt2.webp', './chars/fd_dirt3.webp', './chars/fd_dirt4.webp',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  // cache:'reload' = 브라우저에 남은 옛 파일 말고 서버에서 새로 받기
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== MUSIC_CACHE && !k.startsWith('yuju-voice-')).map(k => caches.delete(k))))
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

  // 배경음악: 한 번 받으면 계속 저장본으로 (음악 재생은 일부분씩 요청해서 전체 파일로 받아 저장)
  if (url.pathname.includes('/music/')) {
    e.respondWith(caches.open(MUSIC_CACHE).then(async c => {
      const key = new Request(url.href);
      const hit = await c.match(key);
      if (hit) return hit;
      const res = await fetch(url.href);
      if (res.status === 200) c.put(key, res.clone());
      return res;
    }));
    return;
  }

  // 녹음 목소리(voice/<목소리>/<번호>.mp3): 파일 이름이 문장마다 달라서 한 번 받으면 계속 저장본으로.
  // 목소리마다 저장소가 따로라서 앱 버전이 바뀌어도 다시 받지 않아요 (목록 voice/list.js는 아래 '나머지'로)
  const vm = url.pathname.match(/\/voice\/([^/]+)\/[^/]+$/);
  if (vm) {
    e.respondWith(caches.open('yuju-voice-' + vm[1]).then(async c => {
      const key = new Request(url.href);
      const hit = await c.match(key);
      if (hit) return hit;
      const res = await fetch(url.href);
      if (res.status === 200) c.put(key, res.clone());
      return res;
    }));
    return;
  }

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
