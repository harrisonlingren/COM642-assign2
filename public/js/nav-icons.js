$(document).ready( () => {
    getCards();

    $('i.fa-bell').parent().click( () => { alerts();
    });
});

function getCards() {
    // GET endpoint for all to-do items
    $.getJSON('/item/all', (res) => {
        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, (idx, item) => {
            buildArray(item);
        }); alerts();
    });
}
function alerts() {
    $('.dropdown-alerts').empty();
    $.each(cardsArray, (idx, item) => {
        var i = $('<i class="fa fa-comment fa-fw"></i>');
        var span = $('<span class="pull-right text-muted small"></span>').text('# minutes ago');
        var div = $('<div></div>').append(i).append(item.title).append(span);
        var a = $('<a href="#"></a>').append(div);
        var li = $('<li></li>').append(a);
        var divider = $('<li class="divider"></li>');
        $("ul.dropdown-menu.dropdown-alerts").append(li).append(divider);
    });
}

var cardsArray = [];
function buildArray(item){
    cardsArray.push(item);
}