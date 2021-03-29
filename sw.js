importScripts("js/sw-utils.js")

const STATIC_CACHE = "static-v2";
const DYNAMIC_CACHE = "dynamic-v2";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    "js/libs/jquery.js",
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css"
];

self.addEventListener("install", e => {
    const cache = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL));

    const cache_inmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cache, cache_inmutable]));
});

self.addEventListener("activate", e => {
    const respuesta = caches
        .keys()
        .then(keys => {
            keys.forEach(key => {
                if (key.includes("static") && key !== STATIC_CACHE) {
                    caches.delete(key);
                }

                if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                    caches.delete(key);
                }
            })
        })

    e.waitUntil(respuesta);
});


self.addEventListener("fetch", e => {

    const respuesta = caches.match(e.request)
        .then(res => {
            if (res) return res;

            return fetch(e.request)
                .then(newResponse => {
                    return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResponse);
                })
        })

    e.respondWith(respuesta);
});