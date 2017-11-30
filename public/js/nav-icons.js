$(document).ready( () => {
    getCards();
});

function getCards() {
    // GET endpoint for all to-do items
    $.getJSON('/item/all', (res) => {
        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, (idx, item) => {
            buildArray(item);
        });

        alerts();
    });
}
function alerts(){
    $.each(cardsArray, (idx, item) => {
        var i = $('<i class="fa fa-comment fa-fw"></i>').text(item.title);
        var li = $('<li></li>').append(i):
        $("ul.dropdown-menu.dropdown-alerts").append(li);
    });
}

var cardsArray = [];
function buildArray(item){
    cardsArray.push(item);
}