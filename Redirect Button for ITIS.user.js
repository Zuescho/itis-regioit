// ==UserScript==
// @name         Redirect Button for ITIS
// @namespace    https://zuescho.de
// @version      0.3
// @description  Add a button to redirect to a specific URL on ITIS page visit
// @author       Zuescho
// @match        https://itis.regioit.intern/vua/index.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the button to the page
    function addButton() {
        // Create a new button element
        var button = document.createElement('button');
        button.innerHTML = 'Go to VPN Users'; // Text on the button
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;

        // Add the click event to the button
        button.addEventListener('click', function(){
            // Redirect to the desired URL
            window.location.href = 'https://itis.regioit.intern/vua/index.php?content=vpnuser&customer=0&&rowsPerPage=400';
        });

        // Add the button to the body of the page
        document.body.appendChild(button);
    }

    // Call the function to add the button when the script loads
    addButton();
})();
