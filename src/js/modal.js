$(document).ready(() => {
    
    // change edit modal content based on the task that was clicked
    let modal = $('#edit-modal');

    $('.edit-save-btn').click(() => {
        let todoItemId = parseInt($('.edit-save-btn').data('todoid'));
        let cardSelector = '.card[data-todoid="' + todoItemId + '"]';

        // ajax call to update task
        let d = new Date( $('#edit-item-date').val() );
        let todoItemData = {
            title: $('#edit-item-title').val(),
            category: $('#edit-item-category').val(),
            date: d,
            done: parseBoolean( $(cardSelector + ' input[type="checkbox"]').is(':checked') ),
            description: $('#edit-item-description').val()
        };

        $.ajax({
            url: '/item/' + todoItemId,
            type: 'PUT',
            data: todoItemData,
            success: editSuccess
        });
    });


    // create new task
    $('.new-save-btn').click(() => {
        // ajax call to add new task
        let d = new Date( $('#new-item-date').val() );
        let todoItemData = {
            title: $('#new-item-title').val(),
            category: $('#new-item-category').val(),
            date: d,
            done: false,
            description: $('#new-item-description').val()
        };

        $.ajax({
            url: '/item/new',
            type: 'POST',
            data: todoItemData,
            success: (result, status, response) => {
                if (response.status == 201) { updateCards(); }
                else { console.error('Could not edit to-do item!'); }
            }
        });
    });
});




function editSuccess(result, status, response) {
    if (response.status == 200) { updateCards(); } 
    else { console.error('Could not edit to-do item!'); }
}