"use strict";

var worker = new Worker('search.js');
var cards = {};

$(document).ready(function(){
    $.getJSON("all_cards.json",
        function(data){
            cards = data;
            data.forEach(function(cardSet) {
                cardSet['cards'].forEach(function (card) {
                    $('#search_results').append('<div>'+ card["name"] +'</div>');
                });
            });
        })

    $('#search').bind('input', function() {
        worker.addEventListener('message', function(e) {
            $('#search_results').empty();
            e.data.forEach(function(card) {
                $('#search_results').append('<div>'+ card["name"] +'</div>');
            });
        }, false);

        worker.postMessage({ 'search': $(this).val(), 'cards':cards}); // Send data to our worker.
   });
});

