/**
 *
 * @Author: Nir Geier nirgeier@gmail.com
 *
 * Service worker - This file contains the service worker business logic
 */

// Import required missing polyfills in chrome
importScripts('../serviceworker-cache-polyfill.js');

self.addEventListener('install',
    function(event) {
        console.log('Install successfully');
    });

self.addEventListener('activate',
    function(event) {
        console.log('activate successfully');
    });


self.addEventListener('fetch',
    function(event) {
        console.log(event.request);
    });