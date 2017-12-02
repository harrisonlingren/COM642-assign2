$(document).ready( () => {
    // load cards
    updateCards();
});

// array to hold cards as cached data
var todoItemsData = [];

// Refresh cards container by getting all cards via AJAX
function updateCards() {
    // GET endpoint for all to-do items
    $.getJSON('/item/all', (res) => {
        todoItemsData = [];
        $('.cardContainer').empty();
        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, (idx, item) => {
            todoItemsData.push(item);
            createNewCard(item);
        }); alerts(); initCardEvents();
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
        let thisCard = $(e.currentTarget).parent();
        let todoItemId = thisCard.data('todoid');

        let cardSelector = '.card[data-todoid="' +todoItemId + '"]';
        let itemDone = $(cardSelector + ' input[type="checkbox"]').is(':checked');
        
        $.ajax({
            url: '/item/'+todoItemId,
            type: 'PUT',
            data: { done: itemDone },
            success: editSuccess,
            error: () => {
                console.error('Could not change to-do item status to ' + itemDone);
                $(cardSelector + ' .card-title, ' + cardSelector + ' .card-text').toggleClass('done');
                $(this).attr('checked', this.checked);
            }
        });

        $(cardSelector + ' .card-title, ' + cardSelector + ' .card-text').toggleClass('done');
    });

    // Card delete button
    $('.card .btn.btn-danger').click((e) => {
        let thisCard = $(e.currentTarget).parent();
        let todoItemId = parseInt(thisCard.data('todoid'));

        $.ajax({
            url: '/item/' + todoItemId,
            type: 'DELETE',
            success: (result, status, response) => {
                thisCard.remove();
                todoItemsData.splice(todoItemId, 1);
                updateCards();
            },
            error: (result, status, response) => {
                console.error(response);
            }
        });
    });

    // FAB for creating new to-do item
    $('#new-item').click(() => {
        // reset modal form inputs
        $('#item-title').val('');
        $('#item-category').val('');
        $('#item-date').val('');
        $('#item-description').val('');
    });

    // edit buttons on cards
    $('.edit-btn').click((e) => {
        let thisCard = $(e.currentTarget).parent();
        let todoItemId = parseInt(thisCard.data('todoid'));

        $('.edit-save-btn').attr('data-todoid', todoItemId);

        let todoItem = todoItemsData[todoItemId];
        let d = new Date(todoItem.date).toISOString().substring(0,10);
        $('#edit-item-title').val(todoItem.title);
        $('#edit-item-category').val(todoItem.category);
        $('#edit-item-date').val( d );
        $('#edit-item-description').val(todoItem.description);
    });

    // tooltips
    $('[data-toggle=tooltip]').tooltip();
}

function createNewCard(item) {
    // push item to cache
    let container = $('.cardContainer');
    
    let cardTitle = $('<h4 class="card-title"></h4>').text(item.title);
    let cardText = $('<p class="card-text"></p>').text(item.description);
    let cardLabel = $('<label>Completed</label>');
    let cardBox = $('<input type="checkbox" />').attr('checked', parseBoolean(item.done));
    if (parseBoolean(item.done)) {
        cardTitle.addClass('done'); cardText.addClass('done');
    }
    let cardClose = $('<button class="btn btn-circle btn-danger" type="button"></button>')
        .append('<i class="fa fa-times"></i>');

    let cardEdit = $('<button class="btn btn-circle btn-info edit-btn" type="button"></button>')
        .attr('data-toggle', 'modal')
        .attr('data-target', '#edit-modal')
        .attr('data-todoid', item.item_id)
        .append('<i class="fa fa-pencil"></i>');

    let card = $('<div class="card w-25 p-3"></div>')
        .attr('data-todoid', item.item_id)
        .attr('data-toggle', 'tooltip')
        .attr('data-html', 'true')
        .attr('data-placement', 'top')
        .attr('title', '<b>Date:</b> ' + (new Date(item.date).toISOString().substring(0,10)))
        .append(cardTitle)
        .append(cardClose)
        .append(cardEdit)
        .append(cardText)
        .append(cardLabel)
        .append(cardBox);

    container.append(card);
}

function parseBoolean(b) {
    return (b == 'true' || b == true);
}