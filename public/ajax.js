$(document).ready( () => {
    // load cards
    loadTodoCards();

});


function loadTodoCards() {
    let container = $('.itemsView');

    // GET endpoint for all to-do items
    $.getJSON('/item/all', (res) => {
        //console.log(res, res.data);

        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, (idx, item) => {
            let cardTitle = $('<h4 class="card-title"></h4>').text(item.title);
            let cardText = $('<p class"card-text"></p>').text(item.description);
            let cardBox = $('<input type="checkbox" />').attr('checked', item.done);
            let card = $('<div class="card"></div>').append('<div class="card-block"></div>').append(cardTitle);
            card.append(cardText); card.append(cardBox);
            container.append(card);
        });
    });
}