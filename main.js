"use strict";

var cards = {};
var worker = new Worker('search.js');
var start;
var workerTimes = [];
var useWebWorkers = false;
var useTransferableObjects = false;

$(document).ready(function(){
    initializeCheckboxListeners();

    $.getJSON("all_cards.json",
        function(data){
            cards = data;
            data.forEach(function(cardSet) {
                cardSet['cards'].forEach(function (card) {
                    $('#search_results').append('<div>'+ card["name"] +'</div>');
                });
            });
        })

    worker.addEventListener('message', function(e) {
        filterCards(e.data);
    }, false);

    $('#search').bind('input', function() {
        start = new Date().getTime();
        if (useWebWorkers) {
            if (useTransferableObjects) {
                worker.postMessage()

                throw Error("Not implemented");
            } else {
                 worker.postMessage({ 'search': $(this).val(), 'cards':cards}); // Send data to our worker
            }
        } else {
            doLocalSearch($(this).val(), cards);
        }
   });
});

function initializeCheckboxListeners() {
    $('#webworkers').click(function() {
       useWebWorkers = $(this).is(':checked');
    });

    $('#transferableObjects').click(function() {
       useTransferableObjects = $(this).is(':checked');
    });
}

function calculateFilterTimes() {
    var time = new Date().getTime() - start;
    console.log(time);
    workerTimes.push(time);

    $("#last_run").text("Last filter: " + time + " ms.");

    var avg = 0;
    for (var i = 0; i < workerTimes.length; i++) {
        avg += workerTimes[i] / workerTimes.length;
    }

    $("#avg_run").text("Average: " + avg + " ms.");
}

function doLocalSearch(val, cards) {
    console.log("Local search");
    var cards = cards;
    var searchValue = val;
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

    filterCards(result);
}

function filterCards(cards) {
    calculateFilterTimes();
    $('#search_results').empty();
    cards.forEach(function(card) {
        $('#search_results').append('<div>'+ card["name"] +'</div>');
    });
}
