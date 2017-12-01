$(document).ready(() => {
    
    // change edit modal content based on the task that was clicked
    let modal = $('#edit-modal');
    modal.on('show.bs.modal', (event) => {
        let btn = $(event.relatedTarget);
        let todoItemId = btn.data('todoid');

        // if editing, get card details from cached data
        if (todoItemId) {
            let todoItem = todoItemsData[todoItemId];
            let d = new Date(todoItem.date);
            d = d.toISOString().substring(0,10);
            $('#item-title').val(todoItem.title);
            $('#item-category').val(todoItem.category);
            $('#item-date').val( d );
            $('#item-description').val(todoItem.description);
            $('#edit-modal button.btn-primary').attr('data-todoid', todoItemId);
        }        
    });

    let saveBtn = $('#edit-modal button.btn-primary');
    saveBtn.click(() => {
        // check if creating or editing an item
        let editMode = saveBtn.data('editmode');
        if (editMode == 'edit') {
            let todoItemId = parseInt(saveBtn.data('todoid'));
            let cardSelector = '.card[data-todoid="' + todoItemId + '"]';

            console.log('editing: ' + cardSelector + ' ' + todoItemId);

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
                    if (response.status == 201) { createNewCard(result.data); }
                    else { console.error('Could not edit to-do item!'); }
                }
            });

        } else {
            console.error('No edit mode specified!');
        }
    });
});


function editSuccess(result, status, response) {
    if (response.status == 200) {
        let todoItemId = result.data.item_id;
        let cardSelector = '.card[data-todoid="' + todoItemId + '"]';
        $(cardSelector + ' .card-title').text(result.data.title);
        $(cardSelector + ' .card-text').text(result.data.description);
        $(cardSelector + ' input[type="checkbox"]').attr('checked', result.data.done);

        updateCards();
    } else {
        console.error('Could not edit to-do item!');
    }
}