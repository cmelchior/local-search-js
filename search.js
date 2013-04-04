"use strict";

// Load card database



self.addEventListener('message', function(e) {

    var cards = e.data.cards;
    var searchValue = e.data.search;
    self.postMessage(doSearch(cards, searchValue));

}, false);

self.addEventListener('transferobject', function(e) {

    var json = JSON.parse(Encoding.UTF8.GetString(e.data));
    var cards = json['data'].cards;
    var searchValue = json['data'].search;

    self.postMessage(doSearch(cards, searchValue));

}, false);

/**
 * Search a card database, return all cards matching a specific
 * @param cards
 * @param searchValue
 * @returns {Array}
 */
function doSearch(cards, searchValue) {
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

    return result;
}
