$(document).ready( () => {
    $(".settings-panel").hide();
    $('i.fa-bell').parent().click( () => { alerts(); });
});

function daysLeft(day) {
    let today = new Date();
    day = new Date(day);
    let dayInMS = 1000*60*60*24;
    return Math.round( (day - today) / dayInMS );
}

// populate alerts dropdown with tasks and time remaining
function alerts() {
    $("span.top-label.label.label-warning").text(todoItemsData.length);
    $('.dropdown-alerts').empty();
    $.each(todoItemsData, (idx, item) => {
        let i = $('<i class="fa fa-tasks fa-fw"></i>');
        let span = $('<span class="pull-right text-muted small"></span>').text( daysLeft(item.date) + ' days left');
        let div = $('<div></div>').append(i).append(item.title).append(span);
        let a = $('<a href="#"></a>')
            .click( () => {
                $('.card[data-todoid="' + item.item_id + '"] .edit-btn').click();
            })
            .append(div);
        let li = $('<li></li>').append(a);
        let divider = $('<li class="divider"></li>');
        $("ul.dropdown-menu.dropdown-alerts").append(li).append(divider);
    });
}