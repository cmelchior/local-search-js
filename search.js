'use strict';
/**
 * Search module for doing advanced search in the card database
 */
var DECKBUILDER = (function () {

    /**
     * Check if the match string is contained within the value.
     */
    function checkString(match, value) {
        if (value == null || value == undefined) return false; // A non-string never matches.
        if (match == null || match == undefined || match == '') return true; // Empty search always match

        var regexp = new RegExp(".*?" + match + ".*?" ,"gi");
        return value.match(regexp);
    };

    /**
     * Check if a integer value fullfill the predicate
     */
    function checkInteger(predicate, cardValue) {
        if (predicate == null) return true;     // Always match the empty predicate
        if (cardValue == null || cardValue == undefined) return false;    // Never match if the value doesn't exists

        var int = parseInt(cardValue, 10);
        if (int == NaN) return false;
        predicate = predicate.replace(/\$\{1\}/g, int);
        if (!eval(predicate)) {
            return false;
        } else {
            return true;
        }
    }

    function parse(expression) {
        try {
            return PEGJS.parse(expression);
        } catch (err) {
            return null;
        }
    }

    var publicMethods = {

    /**
     * Return all cards that match the search object
     */
    search : function(search, cards) {

            var result = [];
            var costSearch = parse(search['cost']);

            cards.forEach(function(cardSet) {
                cardSet['cards'].forEach(function (card) {
                    if (!checkString(search['name'], card['name'])) return; // Check name
                    if (!checkInteger(costSearch, card['cost'])) return; // Check cost
                    result.push(card);
                });
            });

            return result;
        }
    }

    return publicMethods;
})();
