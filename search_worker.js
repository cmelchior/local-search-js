"use strict";

importScripts('search.js');

// Load cards when starting worker
var cards = [];
fetchData('all_cards.json', function(jsonStr) {
    cards = JSON.parse(jsonStr);
});

function fetchData(src, fn) {
    var req = new XMLHttpRequest();
    req.open('GET', src, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if(req.status == 200) {
                fn(req.responseText);
            } else {
                fn('');
            }
        }
    };
    req.send();
}

self.addEventListener('message', function(e) {
    var search = e.data.search;
    self.postMessage(DECKBUILDER.search(search, cards));
}, false);


