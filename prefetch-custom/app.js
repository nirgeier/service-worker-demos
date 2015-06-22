/**
 * This is the main js file for our application.
 * This file will include the registration of the service worker along
 * with some other helper methods
 *
 * @author: Nir Geier nirgeier@gmail.com
 */

//
// Helper method to mark if we are online or offline
//
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Enable/disable search functionality based on network availability
function updateOnlineStatus() {
    document.querySelector('body').className = ( navigator.onLine ? 'online' : 'offline');
}

updateOnlineStatus();

// Helper function which returns a promise which resolves once the service worker registration
// is past the "installing" state.
function waitUntilInstalled(registration) {

    SWUtils.updateProgress("Waiting inside: waitUntilInstalled");

    // Check to see if this page is controlled
    // The page wil not be tracked on its first load and we must refresh it
    // so it will be tracked
    if (navigator.serviceWorker.controller) {
        SWUtils.updateProgress('Page is tracked...');
    } else {
        // If .controller isn't set, then prompt the user to reload the page so that the Service Worker can take control.
        SWUtils.updateError('Please reload this page to allow the service worker to take control.');
    }

    // "Wrap" the install process with promise to track its progress
    return new Promise(function(resolve, reject) {

        // The installation will take place during the first time we register this worker.
        // From this point on it should already be registered so the 'registration.installing'
        // should be null (Install occurs during registration if its not installed yet).

        SWUtils.updateProgress("waitUntilInstalled [registration.installing] = " + JSON.stringify(registration));

        if (registration.installing) {
            // If the current registration represents the "installing" service worker,
            // then wait until the installation step (during which the resources are pre-fetched)
            // completes to display the images.

            // We "ride" on the statechange determine the state of the install progress
            registration.installing.addEventListener('statechange',
                function(e) {

                    SWUtils.updateProgress("waitUntilInstalled [registration.installing - statechange] = " + e.target.state);

                    // If the registration returned installed - All images are pre-fetched by now
                    if (e.target.state == 'installed') {
                        resolve();
                    } else if (e.target.state == 'redundant') {
                        reject();
                    }
                });
        } else {
            // Resources are already pre-fetched since we passed the installation phase during the first registred
            resolve();
        }
    });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', {scope: './'})
        .then(waitUntilInstalled)
        .catch(function(error) {
            // Something went wrong during registration. The service-worker.js file
            // might be unavailable or contain a syntax error.
            //document.querySelector('#status').textContent = error;
            SWUtils.updateError(error);
            console.error(error);
        });
}