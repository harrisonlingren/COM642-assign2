$(document).ready( () => {
    // load cards
    loadTodoCards();

});

function loadTodoCards() {
    let container = $('.cardContainer');

    // GET endpoint for all to-do items
    $.getJSON('/item/all', (res) => {
        //console.log(res, res.data);

        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, (idx, item) => {
            let cardTitle = $('<h4 class="card-title"></h4>').text(item.title);
            let cardText = $('<p class="card-text"></p>').text(item.description);
            let cardLabel = $('<label>Completed</label>')
                .attr('for', 'todo'+item.item_id) ;
            let cardBox = $('<input type="checkbox" />').attr('checked', parseBoolean(item.done));
            if (parseBoolean(item.done)) {
                cardTitle.addClass('done'); cardText.addClass('done');
            }
            let cardClose = $('<button class="btn btn-circle btn-danger" type="button"></button>')
                .append('<i class="fa fa-times"></i>');

            let cardEdit = $('<button class="btn btn-circle btn-info" type="button"></button>')
                .attr('data-toggle', 'modal')
                .attr('data-target', '#edit-modal')
                .attr('data-todoid', item.item_id)
                .append('<i class="fa fa-pencil"></i>');

            let card = $('<div class="card"></div>')
                .attr('id', 'todo'+item.item_id)
                .append(cardTitle)
                .append(cardClose)
                .append(cardEdit)
                .append(cardText)
                .append(cardLabel)
                .append(cardBox);

            container.append(card);
        });

        initCardEvents();
    });
}

function initCardEvents() {
    let container = $('.cardContainer');

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
        
        let todoItemId = $(e.currentTarget).parent().attr('id');
        todoItemId = parseInt( todoItemId[ todoItemId.length-1] );
        
        let itemDone = $('#todo'+todoItemId+' input[type="checkbox"]').is(':checked');
        $.ajax({
            url: '/item/'+todoItemId,
            type: 'PUT',
            data: { done: itemDone },
            success: editSuccess,
            error: () => {
                console.error('Could not change to-do item status to ' + itemDone);
                $('#todo'+todoItemId+' .card-title, #todo'+todoItemId+' .card-text').toggleClass('done');
                $(this).attr('checked', this.checked);
            }
        });

        $('#todo'+todoItemId+' .card-title, #todo'+todoItemId+' .card-text').toggleClass('done');
    });

    $('.card button.btn-danger').click((e) => {
        let thisCard = $(e.currentTarget).parent();
        let todoItemId = thisCard.attr('id')
        todoItemId = parseInt( todoItemId[ todoItemId.length-1] );

        $.ajax({
            url: '/item/' + todoItemId,
            type: 'DELETE',
            success: (result, status, response) => {
                thisCard.remove();
            },
            error: (result, status, response) => {
                console.error(response);
            }
        });
    });
}

function parseBoolean(b) {
    return b == 'true';
}