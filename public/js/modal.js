$(document).ready(() => {
    
    // change edit modal content based on the task that was clicked
    let modal = $('#edit-modal');
    modal.on('show.bs.modal', (event) => {
        let btn = $(event.relatedTarget);
        let todoItemId = btn.data('todoid');

        // if editing, get card details from cached data
        console.log(todoItemId);
        if (todoItemId) {
            let todoItem = todoItemsData[todoItemId];
            console.log(todoItem);
            let d = new Date(todoItem.date)
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

        let editMode = saveBtn.data('editmode');
        let todoItemId = saveBtn.data('todoid');

        if (editMode == 'edit') {
            // ajax call to update task

            let d = new Date( $('#item-date').val() );
            let todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: ( $('#todo'+todoItemId+' input[type="checkbox"]').is(':checked') ),
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
                done: ( $('#todo'+todoItemId+' input[type="checkbox"]').is(':checked') ),
                description: $('#item-description').val()
            };

            $.ajax({
                url: '/item/new',
                type: 'POST',
                data: todoItemData,
                success: (result, status, response) => {
                    if (response.status == 201) {
                        createNewCard(result.data);
                    } else {
                        console.error('Could not edit to-do item!');
                    }
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
        $('#todo'+todoItemId+' .card-title').text(result.data.title);
        $('#todo'+todoItemId+' .card-text').text(result.data.description);
        $('#todo'+todoItemId+' input[type="checkbox"]').attr('checked', result.data.done);
    } else {
        console.error('Could not edit to-do item!');
    }
}