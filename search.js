"use strict";

// Load card database



self.addEventListener('message', function(e) {

    var cards = e.data.cards;
    var searchValue = e.data.search;
    var result = [];

    var i = 0;
    cards.forEach(function(cardSet) {
        cardSet['cards'].forEach(function (card) {
            var regexp = new RegExp(".*?" + searchValue + ".*?" ,"gi");

            if (card['name'].match(regexp)) {
                result[i] = card;
                i++;
            }
        });
    });

    self.postMessage(result);

}, false);