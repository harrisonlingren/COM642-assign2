$(document).ready( () => {
    // if search button clicked, filter by search term
    $('.sidebar-search .btn.btn-default').click( () => {
        let search = $('.sidebar-search input[type="text"]').val();
        filterCards(search, 'search');
    });

    // if Enter key pressed in search box, do search
    $('.sidebar-search input[type="text"]').keypress((e) => {
        let code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            $('.sidebar-search .btn.btn-default').click();
        }
    });

    // if category button clicked, filter by category
    $('.categories button').click((e) => {
        let category = $(e.target).text();
        if (category == 'All tasks') { filterCards('', 'all'); return; }
        filterCards(category, 'category');
    });
});

function filterCards(filterTerm, mode) {
    // add todo items that match the search term to the result
    let results = [];
    $.each(todoItemsData, (idx, todoItem) => {
        // search based on term
        if (mode == 'search') {
            if (todoItem.title.includes(filterTerm) || todoItem.description.includes(filterTerm)) {
                results.push(todoItem);
            }

        // filter based on category
        } else if (mode == 'category') {
            if (todoItem.category == filterTerm) {
                results.push(todoItem);
            }
        } else if (mode == 'all') {
            results.push(todoItem);
        }
    });

    // clear cards and re-build from filtered results
    $('.cardContainer').empty();
    $.each(results, (idx, card) => {
        createNewCard(card);
    });
}
