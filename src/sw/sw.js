
'use strict';
/* global caches, Request, fetch, require, console, importScripts, Response */
var staticCacheName = 'pta-static-v5';
var allCaches = [
  staticCacheName
];
importScripts("/idb/lib/idb.js");

var urlsToPrefetch = [
  '/css/style.css',
  '/bundle.js',
  '/img/slice3.jpg',
  '/idb/lib/idb.js'
];
var urlUse = '';
var stnUrlUse = '';
/**
* @return - a promise that resolves to a DB
*/
function openDatabase() {
  return self.idb.open('ptadb', 1, function(upgradeDb) {
    console.log('openDatabase');
    upgradeDb.createObjectStore('trans', {
      keyPath: 'url'
    });
  });
}

/**
*/
function _storeBartData(data) {
  console.log('db open');
  openDatabase().then(function(db) {
    if (!db) {
      return;
    }

    var tx = db.transaction('trans', 'readwrite');
    var store = tx.objectStore('trans');
    store.put(data);
    return tx.complete;
  });
}

function _checkIdb(url) {
  return openDatabase().then(function(db) {
    if (!db) {
      return;
    }
    var tx = db.transaction('trans');
    var store = tx.objectStore('trans');
    return store.get(url);
  });
}

self.addEventListener('install', function(event) {
  console.log('install event');
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
        console.log('urlToPrefetch', urlToPrefetch);
        return new Request(urlToPrefetch, {mode: 'no-cors'});
      })).then(function() {
        console.log('All resources have been fetched and cached.');
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    openDatabase(),
    // self._dbPromise = openDatabase(),
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('pta-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch');
  // var requestUrl = new URL(event.request.url);
  console.log(event.request.url);

  if (event.request.url.startsWith('http://api.bart.gov/api/sched')) {
    console.log('requested:', event.request);
    event.respondWith(serveBartData(event.request));
    return;
  }

  if (event.request.url.startsWith('http://api.bart.gov/api/stn')) {
    console.log('requested:', event.request);
    event.respondWith(serveBartStnData(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

function serveBartData(request) {
  return _checkIdb(request.url)
  .then(function(data) {
    console.log('data', data);
    return new Response(data.text);
  })
  .catch(function() {
    // console.log(error);
    return fetchTrips(request);
  });
}

function serveBartStnData(request) {
  return _checkIdb(request.url)
  .then(function(data) {
    console.log('data', data);
    return new Response(data.text);
  })
  .catch(function() {
    // console.log(error);
    return fetchStn(request);
  });
}

function fetchTrips(request) {
  urlUse = '';
  urlUse = request.url;
  return fetch(request)
  .then(status)
  // .then(text)
  .catch(function(error) {
    console.log('Request failed', error);
  });
}

function fetchStn(request) {
  stnUrlUse = '';
  stnUrlUse = request.url;
  return fetch(request)
  .then(status)
  // .then(text)
  .catch(function(error) {
    console.log('Request failed', error);
  });
}

function status(response) {
  var response2 = response.clone();
  response2.text()
  .then(function(text) {
    console.log('text', text);
    _storeBartData({url: response2.url, text: text});
  });
  // console.log('data2', data2);
  console.log('response', response);
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}
