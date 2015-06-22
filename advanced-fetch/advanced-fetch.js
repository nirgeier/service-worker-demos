/**
 * This file contains sample code for advanced fetch options
 *
 * @author Nir Geier nirgeier@gmail.com
 */

//
// The page has made a request
//
self.addEventListener("fetch", function(event) {

    // Store the request url so we have access it later on
    var requestURL = new URL(event.request.url);

    // the event will wait until all the inner Promises will exit
    event.respondWith(
        // Check to see if the request is managed in any of the caches that this
        // server worker store in ternally
        caches.match(event.request)
            .then(function(response) {

                // We found a response in the cache - return it to the user
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response
                var fetchRequest = event.request.clone();

                // Fetch the request from the network
                return fetch(fetchRequest).then(
                    // Handle the fetch response
                    function(response) {

                        // Set the cache flag to false so we will not cache all the responses -
                        // Only the ones that we want to cache
                        var storedCacheName = undefined;

                        //
                        // (response.type   === "basic") - Indicates that it's a request from our origin.
                        // (response.status === 200)     - Indicates that it's a completed and OK response.
                        //                                 [The request has succeeded]
                        //
                        if (response.type === "basic" && response.status === 200) {

                            // Since the url is a resource from our domain/app we want to cache it
                            // set the cache that we want to store the date in
                            // We can have as many caches as we wish as
                            storedCacheName = "<The name of the cache we want to use>";

                            // if response isn"t from our origin or doesn't support CORS,
                            // "opaque" means that we dont get any information about the requests

                            //
                            // https://fetch.spec.whatwg.org/#concept-filtered-response-opaque
                            //
                            // "An opaque filtered response is a filtered response whose type is "opaque",
                            // status is 0, status message is the empty byte sequence,
                            // header list is the empty list, body is null, and cache state is "none"
                            //
                        } else if (response.type === "opaque") {

                            // Redirect the requests to different cache
                            if (requestURL.hostname.indexOf(".git-tips.com") > -1) {

                                // Store the response in any choose cache that ou wish to
                                storedCacheName = "git-tips";

                            } else if (requestURL.hostname.indexOf(".codewizard.experts") > -1) {
                                storedCacheName = "codewizard.experts";
                            } else {
                                //
                                // don't cache the response,
                                //
                            }
                        }

                        //
                        // We can also choose to filter based upon other values like headers
                        // For example: in this sample we want to cache all fonts
                        //
                        if (response.status < 400 &&
                            response.headers.has('content-type') &&
                            response.headers.get('content-type').match(/^font\//i)) {

                            // Set the name of the cache to store the response in
                            storedCacheName = "fonts";
                        }

                        //
                        // Filter the response based upon the request URL
                        //
                        if (event.request.url.match(/https:\/\/www.mysite.com/)) {
                            // Do your stuff here
                        }

                        //
                        // Check to see if we want to store the response
                        //
                        if (storedCacheName) {

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have at least 2 stream.
                            var responseToCache = response.clone();

                            // Open the desired cache
                            caches.open(storedCacheName)
                                .then(function(cache) {

                                    // As above - clone the request,
                                    // one first copy is for the cache and the
                                    // second copy is for the application to consume
                                    var cacheRequest = event.request.clone();

                                    // Store the response under the cache
                                    cache.put(cacheRequest, responseToCache);
                                });
                        }

                        // return the response to the application
                        return response;
                    }
                );
            })
    );
});
