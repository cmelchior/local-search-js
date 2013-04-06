'use strict';

var cards = {};
var worker = new Worker('search_worker.js');
var start;
var workerTimes = [];
var useWebWorkers = false;
var useTransferableObjects = false;

$(document).ready(function(){
    initializeEventListeners();

    $.getJSON("all_cards.json",
        function(data){
            cards = data;
            data.forEach(function(cardSet) {
                cardSet['cards'].forEach(function (card) {
                    $('#search_results').append('<div>'+ card["name"] +'</div>');
                });
            });
        })

    // Response from worker
    worker.addEventListener('message', function(e) {
        filterCards(e.data);
    }, false);
});

function initializeEventListeners() {
    $('#webworkers').click(function() {
       useWebWorkers = $(this).is(':checked');
    });

    $('#transferableObjects').click(function() {
       useTransferableObjects = $(this).is(':checked');
    });

    $('#search').bind('input', function() {
        doSearch();
    });

    $('#cost').bind('input', function() {
        doSearch();
    });
}

function calculateFilterTimes() {
    var time = new Date().getTime() - start;
    workerTimes.push(time);

    $("#last_run").text("Last filter: " + time + " ms.");

    var avg = 0;
    for (var i = 0; i < workerTimes.length; i++) {
        avg += workerTimes[i] / workerTimes.length;
    }

    $("#avg_run").text("Average: " + avg + " ms.");
}

/**
 * Find all search strings
 */
function doSearch() {

    var search = {};
    search['name'] = $('#search').val();
    search['cost'] = $('#cost').val();

    start = new Date().getTime();
    if (useWebWorkers) {
        if (useTransferableObjects) {
            throw Error("Not implemented");
        } else {
            worker.postMessage({ 'search': search, 'cards':cards}); // Send data to our worker
        }
    } else {
        filterCards(DECKBUILDER.search(search, cards));
    }
}

function filterCards(cards) {
    calculateFilterTimes();
    $('#search_results').empty();
    cards.forEach(function(card) {
        $('#search_results').append('<div>'+ card["name"] + ':' + card['cost'] + '</div>');
    });
}
