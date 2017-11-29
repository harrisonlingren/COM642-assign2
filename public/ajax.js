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
            let cardText = $('<p class="card-text"></p>').text(item.description);
            let cardLabel = $('<label>Completed</label>')
                .attr('for', 'todo'+item.item_id) ;
            let cardBox = $('<input type="checkbox" />').attr('checked', item.done);
            let card = $('<div class="card"></div>')
                .attr('id', 'todo'+item.item_id)
                .append(cardTitle)
                .append(cardText)
                .append(cardLabel)
                .append(cardBox);

            container.append(card);
        });

        // make cards draggable
        container.sortable({
            handle: '.card-title',
            update: () => {
                $('.card', container).each((index, elem) => {
                    let cardItem = $(elem),
                        newIndex = cardItem.index();
                });
            }
        });

        // clicking checkbox crosses out text/title
        $('.card input[type="checkbox"]').click((e) => {
            let cardnum = $(e.target).parent().attr('id');
            cardnum = cardnum[ cardnum.length-1 ];
            $('#todo'+cardnum+' h4.card-title, #todo'+cardnum+' p.card-text')
                .toggleClass('done');
        });
    });
}