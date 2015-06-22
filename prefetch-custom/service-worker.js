// This polyfill provides Cache.add(), Cache.addAll(), and CacheStorage.match(),
importScripts('../serviceworker-cache-polyfill.js');

var CACHE_NAME = {
    prefetch: 'prefetch-custom'
};

self.addEventListener('install', function(event) {
    var resourcesToPrefetch = [
        '../bootstrap/bootstrap.min.css',
        '../bootstrap/bootstrap.min.js',
        'https://c2.staticflickr.com/2/1432/5104204268_44a6121f32_b.jpg',
        'https://c2.staticflickr.com/6/5144/5616269560_17aff6f21f_z.jpg'
    ];

    console.log('Inside install event. Resources to pre-fetch:', resourcesToPrefetch);

    // Pre-cache all the desired images
    event.waitUntil(
        caches.open(CACHE_NAME['prefetch'])
            .then(function(cache) {

                // Add all needed resources (images in our case)
                // The Cache is not yet implemented and we use polyfill for this purpose.
                return cache.addAll(resourcesToPrefetch.map(function(imgUrl) {
                    console.log('Processing: ', imgUrl);

                    //
                    // !!! Important
                    // ----------------------------------------------------------------------------------------------
                    //
                    // Non-CORS Fail by Default
                    // By default, fetching a resource from a third party URL will fail if it doesn't support CORS.
                    // You can add a non-CORS option to the Request to overcome this, although this will cause an
                    // 'opaque' response, which means you won't be able to tell if the response was successful or not.
                    //
                    // It's very important to use {mode: 'no-cors'} if there is any chance that the resources being
                    // fetched are served off of a server that doesn't support CORS
                    // (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
                    // In this example, www.chromium.org doesn't support CORS, and the fetch() would fail if
                    // the default mode of 'cors' was used for the fetch() request.
                    //
                    // The drawback of hardcoding {mode: 'no-cors'} is that the response from all cross-origin hosts
                    // will always be opaque
                    // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
                    // and it is not possible to determine whether an opaque response represents a success or failure
                    // (https://github.com/whatwg/fetch/issues/14).
                    //
                    return new Request(imgUrl, {mode: 'no-cors'});

                })).then(function() {
                    console.log('All resources have been fetched and cached.');
                });
            }).catch(function(error) {
                // This catch() will handle any exceptions from the caches.open()/cache.addAll() steps.
                console.error('Pre-fetching failed:', error);
            })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('Handling fetch event for: ', event.request.url);

    var url = event.request.url;
    event.respondWith(
        // caches.match() will look for a cache entry in all of the caches available to the service worker.
        // It's an alternative to first opening a specific named cache and then matching on that.
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    console.log('Found response in cache:', response);
                    return response;
                }

                console.log('No response found in cache, fetching from network ... [' + url + ']');

                // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
                // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.

                // Try to connect to the network and load the non-cached image
                return fetch(event.request)
                    .then(function(response) {
                        console.log('Response from network is:', response);
                        return response;
                    }).catch(function(error) {
                        // This catch() will handle exceptions thrown from the fetch() operation.
                        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                        // It will return a normal response object that has the appropriate error code set.
                        console.error('Fetching failed for url: [' + url + ']:', error);

                        // Return any other resource we want.
                        // In our case its the no-wifi image
                        return fetch('no-wifi.png');

                    });
            })
    );
});


