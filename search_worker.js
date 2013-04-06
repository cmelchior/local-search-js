"use strict";

importScripts('parser.js', 'search.js');

self.addEventListener('message', function(e) {

    var cards = e.data.cards;
    var search = e.data.search;
    self.postMessage(DECKBUILDER.search(search, cards));

}, false);


self.addEventListener('transferobject', function(e) {

    var json = JSON.parse(Encoding.UTF8.GetString(e.data));
    var cards = json['data'].cards;
    var searchValue = json['data'].search;

    self.postMessage(doSearch(cards, searchValue));

}, false);