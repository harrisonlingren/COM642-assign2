$(document).ready( () => {
    $('.sidebar-search .btn.btn-default').click( () => {
        let cardsToDisplay = [];
        
        // check that the search bar has text
        let search = $('.sidebar-search input[type="text"]').val();
        if (search != '' && search) {
            
            // add todo items that match the search term to the result
            $.each(todoItemsData, (idx, todoItem) => {
                if (todoItem.title.includes(search) || todoItem.description.includes(search)) {
                    cardsToDisplay.push(todoItem);
                }
            });

            // clear cards and re-build from search results
            $('.cardContainer').empty();
            $.each(cardsToDisplay, (idx, card) => {
                createNewCard(card);
            });

        // if search empty, show all
        } else if (search == '') {
            $('.cardContainer').empty();
            $.each(todoItemsData, (idx, card) => {
                createNewCard(card);
            });
        }
    });



    // if Enter key pressed in search box, do search
    $('.sidebar-search input[type="text"]').keypress((e) => {
        let code = (e.keyCode ? e.keyCode : e.which);        
        if (code == 13) {
            $('.sidebar-search .btn.btn-default').click();
        }
    });

});