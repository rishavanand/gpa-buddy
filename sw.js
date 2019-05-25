var CACHE_NAME = 'v06';

var filesToCache = [
    './',
    './index.html',
    './viewer.html',
    './developers.html',
    './estimator.html',
    './css/developers.css',
    './css/estimator.css',
    './css/font-awesome.css',
    './css/font-awesome.min.css',
    './css/index.css',
    './css/style.css',
    './css/viewer.css',
    './css/bootstrap.min.css',
    './css/mont.css',
    './js/bootstrap.min.js',
    './js/CSSPlugin.min.js',
    './js/EasePack.min.js',
    './js/jquery.animateNumber.min.js',
    './js/jquery.min.js',
    './js/popper.min.js',
    './js/TweenLite.min.js',
    './js/index.js',
    './js/viewer.js',
    './js/estimator.js',
    './js/developer.js',
    './img/analytics.png',
    'img/calculator.png',
    './img/programmer.png',
    './img/right-arrow.png',
    './img/rishav.jpg',
    './img/apple-touch-ipad.png',
    './img/apple-touch-ipad-retina.png',
    './img/apple-touch-iphone.png',
    './img/apple-touch-iphone4.png',
    './img/rohan.jpg',
    './img/loader.gif',
    './img/three-dots.png',
    './img/safari-action.png',
    './fonts/FontAwesome.otf',
    './fonts/fontawesome-webfont.eot',
    './fonts/fontawesome-webfont.svg',
    './fonts/fontawesome-webfont.ttf',
    './fonts/fontawesome-webfont.woff',
    './fonts/fontawesome-webfont.woff2',
    './fonts/JTURjIg1_i6t8kCHKm45_dJE3gnD_vx3rCs.woff2',
    './fonts/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
    './results/33.json',
    './results/35.json',
    './results/41.json',
    './results/45.json',
    './manifest.json'

];

self.addEventListener('install', async (e) => {
    console.log('- Installing Service Worker');
    var cache = await caches.open(CACHE_NAME);
    await cache.addAll(filesToCache);
    await skipWaiting();
});

self.addEventListener('activate', async (event) => {
    console.log('- Activating Service Worker');
    await self.clients.claim();
    var cacheNames = await caches.keys();
    cacheNames.map(function(cacheName) {
        if (CACHE_NAME !== cacheName) {
        	caches.delete(cacheName);
        }
    })
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
    );
});;