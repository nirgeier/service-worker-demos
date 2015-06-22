/**
 * Service worker demo Utils.
 * This module contains the Utils method for the demos.
 *
 * @author: Nir Geier
 */
var SWUtils = (function() {

    var
    // The domElement which display the messages we posting to page
        statusElm = document.querySelector('#status');

    /**
     * This method will print the status information to the page
     *
     * @param message
     * @param className
     */
    function updateStatus(message, className) {
        var fragment = document.createDocumentFragment(),
            li = document.createElement('li');

        console.log(message);

        li.innerHTML = message;
        li.className = className;

        fragment.appendChild(li);
        statusElm.appendChild(fragment);
    }

    return {

        updateProgress: function(message) {
            updateStatus(message, "alert alert-success");
        },

        updateError: function(message) {
            updateStatus(message, "alert alert-danger");
        }


    }
})();
