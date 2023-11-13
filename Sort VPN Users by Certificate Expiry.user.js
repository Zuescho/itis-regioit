// ==UserScript==
// @name         Sort VPN Users by Certificate Expiry
// @namespace    https://zuescho.de
// @version      0.5
// @description  Add a button to sort VPN users by certificate expiry date.
// @author       Zuescho
// @match        https://itis.regioit.intern/vua/index.php?content=vpnuser&customer=0&&rowsPerPage=400
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const tableSelector = '#content > table'; // The selector for the table

    function parseDate(dateStr) {
        if (!dateStr) {
            return null;
        }
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            return new Date(year, month - 1, day);
        } else {
            return null;
        }
    }

    function highlightDates(row, date, dateColumnIndex) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
        const upcomingDate = new Date(today);
        upcomingDate.setDate(today.getDate() + 14); // Set to 14 days from now

        if (date < today || (date >= today && date <= upcomingDate)) {
            row.cells[dateColumnIndex].style.backgroundColor = 'red'; // Highlight in red
        }
    }

    function sortByDate() {
        const dateColumnIndex = 5;

        const table = document.querySelector(tableSelector);
        if (!table) {
            console.error('Table not found!');
            return;
        }

        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr')).filter(row => {
            if (row.cells.length <= dateColumnIndex) {
                return false;
            }
            const cellText = row.cells[dateColumnIndex].textContent.trim();
            const date = parseDate(cellText);
            if (date instanceof Date && !isNaN(date.getTime())) {
                highlightDates(row, date, dateColumnIndex);
            }
            return date instanceof Date && !isNaN(date.getTime());
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

    const intervalId = setInterval(() => {
        if (document.querySelector(tableSelector)) {
            sortByDate();
            clearInterval(intervalId);
        }
    }, 500);
})();