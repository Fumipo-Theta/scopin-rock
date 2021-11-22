const VERSION = "@VERSION@";
const ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;


const STATIC_CACHE_KEY = 'static-' + VERSION;
const STATIC_FILES = [
    ORIGIN + '/',
    ORIGIN + '/index.html',
    ORIGIN + '/js/app.js',
    ORIGIN + '/css/main.css',
    ORIGIN + '/js/lib/jsinflate.js',
    ORIGIN + '/images/SCOPin_image.svg',
    ORIGIN + '/images/ProfilePhoto.jpg',
    ORIGIN + '/images/facebook-brands.svg',
    ORIGIN + '/images/twitter-square-brands.svg',
    ORIGIN + '/images/line-brands.svg',
    ORIGIN + '/images/SCOPin_favicon.png',
    ORIGIN + '/images/tune.svg',

    ORIGIN + "/js/lib/axios/dist/axios.standalone.js",
    ORIGIN + "/js/lib/CryptoJS/rollups/hmac-sha256.js",
    ORIGIN + "/js/lib/CryptoJS/rollups/sha256.js",
    ORIGIN + "/js/lib/CryptoJS/components/hmac.js",
    ORIGIN + "/js/lib/CryptoJS/components/enc-base64.js",
    ORIGIN + "/js/lib/url-template/url-template.js",
    ORIGIN + "/js/lib/apiGatewayCore/sigV4Client.js",
    ORIGIN + "/js/lib/apiGatewayCore/apiGatewayClient.js",
    ORIGIN + "/js/lib/apiGatewayCore/simpleHttpClient.js",
    ORIGIN + "/js/lib/apiGatewayCore/utils.js",
    ORIGIN + "/js/lib/apigClient.js",
    ORIGIN + "/js/lib/app_social_connection.js",

];

const CACHE_KEYS = [
    STATIC_CACHE_KEY
];

self.addEventListener("message", (event) => {
    if (event.data.action === "skipWaiting") {
        console.log("Skip waiting")
        self.skipWaiting()
    }
})


self.addEventListener('install', event => {
    //console.log("Skip waiting !")
    //event.waitUntil()
    console.log("Store static files")
    event.waitUntil(
        caches.open(STATIC_CACHE_KEY).then(cache => {
            return Promise.all(
                STATIC_FILES.map(url => {
                    return fetch(new Request(url, { cache: 'no-cache', mode: 'no-cors' })).then(response => {
                        return cache.put(url, response);
                    });
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {


    event.respondWith(
        caches.match(event.request).then(async response => {
            if (response) {
                return response
            } else {
                try {
                    var r = await fetch(event.request)
                } catch (e) {
                    console.warn(`${event.request} cannot be fetched.`)

                }
                return r
            }
        })
    );
});


self.addEventListener('activate', event => {
    console.log("Delete previous caches !")
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => {
                    return !CACHE_KEYS.includes(key);
                }).map(key => {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('push', event => {
    const options = event.data.json();
    event.waitUntil(
        caches.open(STATIC_CACHE_KEY).then(cache => {
            fetch(new Request(options.data.url, { mode: 'no-cors' })).then(response => {
                cache.put(options.data.url, response);
            }).then(() => {
                self.registration.showNotification(options.title, options);
            });
        })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
