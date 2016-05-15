# Service worker - Code snippets

>    _**Nir geier**_
nirgeier@gmail.com

###Code snippets
----------------------

Some of demos printing output to the service worker inspect panel.

To view this panel open the following url in chrome:
**`chrome://inspect/#service-workers`**

- <a href="https://nirgeier.github.io/service-worker-demos/life-cycle/index.html" target="_blank">life-cycle<a/>
=======

 > The very basic life cycle of the service worker

- <a href="https://nirgeier.github.io/service-worker-demos/prefetch-custom/index.html" target="_blank">prefetch-custom</a>
=======

 > Load several images from the web and store them in cache. One of the images is not processed by the service worker
 and once we cant find the image in the cache we display a default image instead.

- advanced-fetch
=======

 > Some more advanced fetch options like filtering responses based upon the URL or caching responses to different caches
    <br/>
    For example:

    ```
    if (response.status < 400 &&
        response.headers.has('content-type') &&
        response.headers.get('content-type').match(/^font\//i)) {
            ...
    }
    ```
Or

    ```
    // Filter the response based upon the request URL
    if (event.request.url.match(/https:\/\/www.mysite.com/)) {
        // Do your stuff here
    }
    ```

- <a href="https://github.com/lamplightdev/r3search" target="_blank">r3search</a>
=======

A simple app that makes use of Service Workers to enable offline access. It's a search interface to
[wikipedia](http://en.wikipedia.org/) that shows a snippet of an article along with an image if available.

The articles and images are cached using a service worker so you can then view them at a later date without
needing network access. Granted it's not terribly useful but it should help explore the basic concepts of
service workers.

[Blog post](http://blog.lamplightdev.com/2015/01/06/A-Simple-ServiceWorker-App/)
