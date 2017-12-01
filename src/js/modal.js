$(document).ready(() => {
    
    // change edit modal content based on the task that was clicked
    let modal = $('#edit-modal');

     // check if creating or editing an item
    let saveBtn = $('#edit-modal button.btn-primary');
    let editMode = saveBtn.data('editmode');

    saveBtn.click(() => {
        if (editMode == 'edit') {
            let todoItemId = parseInt(saveBtn.data('todoid'));
            let cardSelector = '.card[data-todoid="' + todoItemId + '"]';

            // ajax call to update task
            let d = new Date( $('#item-date').val() );
            let todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: parseBoolean( $(cardSelector + ' input[type="checkbox"]').is(':checked') ),
                description: $('#item-description').val()
            };

            $.ajax({
                url: '/item/' + todoItemId,
                type: 'PUT',
                data: todoItemData,
                success: editSuccess
            });

        } else if (editMode == 'new') {
            // ajax call to add new task
            let d = new Date( $('#item-date').val() );
            let todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: false,
                description: $('#item-description').val()
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

        } else {
            console.error('No edit mode specified!');
        }
    });
});


function editSuccess(result, status, response) {
    if (response.status == 200) { updateCards(); } 
    else { console.error('Could not edit to-do item!'); }
}