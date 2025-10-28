// ==UserScript==
// @name         Redirect Button for ITIS
// @namespace    https://zuescho.de
// @version      0.4
// @description  Adds a button to redirect to the VPN users page.
// @author       Zuescho
// @match        https://itis.regioit.intern/vua/index.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const buttonId = 'redirect-to-vpn-users-button';

    // Function to create and add the button to the page
    function addButton() {
        // Check if the button already exists
        if (document.getElementById(buttonId)) {
            return;
        }

        // Create a new button element
        const button = document.createElement('button');
        button.id = buttonId;
        button.innerHTML = 'Go to VPN Users'; // Text on the button
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';

        // Add the click event to the button
        button.addEventListener('click', function() {
            // Redirect to the desired URL
            window.location.href = 'https://itis.regioit.intern/vua/index.php?content=vpnuser&customer=0&&rowsPerPage=400';
        });

        // Add the button to the body of the page
        document.body.appendChild(button);
    }

    // Call the function to add the button when the script loads
    addButton();
})();
