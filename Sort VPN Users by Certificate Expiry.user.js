// ==UserScript==
// @name         Sort VPN Users by Certificate Expiry
// @namespace    https://zuescho.de
// @version      0.6
// @description  Sorts VPN users by certificate expiry date and highlights overdue ones.
// @author       Zuescho
// @match        https://itis.regioit.intern/vua/index.php?content=vpnuser&customer=0&&rowsPerPage=400
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const tableSelector = '#content > table'; // The selector for the table
    const dateColumnIndex = 5; // The index of the date column

    // Parses a date string in DD.MM.YYYY format.
    function parseDate(dateStr) {
        if (!dateStr) {
            return null;
        }
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            return new Date(year, month - 1, day);
        }
        return null;
    }

    // Highlights rows with dates that are expired or expiring within 14 days.
    function highlightDates(row, date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
        const upcomingDate = new Date(today);
        upcomingDate.setDate(today.getDate() + 14); // Set to 14 days from now

        if (date < today || (date >= today && date <= upcomingDate)) {
            row.cells[dateColumnIndex].style.backgroundColor = 'red'; // Highlight in red
        }
    }

    // Sorts the table rows by the date in the specified column.
    function sortByDate(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.error('Tbody not found in table!');
            return;
        }

        const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => {
            if (row.cells.length <= dateColumnIndex) {
                return false;
            }
            const cellText = row.cells[dateColumnIndex].textContent.trim();
            const date = parseDate(cellText);
            if (date instanceof Date && !isNaN(date.getTime())) {
                highlightDates(row, date);
                return true;
            }
            return false;
        });

        rows.sort((rowA, rowB) => {
            const dateStrA = rowA.cells[dateColumnIndex].textContent.trim();
            const dateStrB = rowB.cells[dateColumnIndex].textContent.trim();
            const dateA = parseDate(dateStrA);
            const dateB = parseDate(dateStrB);
            return dateA - dateB;
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    // Use a MutationObserver to wait for the table to be added to the DOM.
    const observer = new MutationObserver((mutations, obs) => {
        const table = document.querySelector(tableSelector);
        if (table) {
            sortByDate(table);
            obs.disconnect(); // Disconnect the observer once the table is found and sorted.
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();