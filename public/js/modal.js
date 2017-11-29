$(document).ready(() => {

    // change edit modal content based on the task that was clicked
    let modal = $('#edit-modal');
    modal.on('show.bs.modal', (event) => {
        let btn = $(event.relatedTarget);
        let todoItemId = btn.data('todoid');
        $.getJSON('/item/'+todoItemId, (res) => {
            console.log()
            let todoItem = res.data;
            $('#item-title').val(todoItem.title);
            $('#item-category').val(todoItem.category);
            $('#item-date').val( Date.parse(todoItem.date) );
            $('#item-description').val(todoItem.description);
            $('#edit-modal button.btn-primary').attr('data-editmode', 'edit');
            $('#edit-modal button.btn-primary').attr('data-todoid', todoItemId);
        });
    });

    let saveBtn = $('#edit-modal button.btn-primary');
    saveBtn.click(() => {

        let editMode = saveBtn.data('editmode');
        let todoItemId = saveBtn.data('todoid');

        if (editMode == 'edit') {
            console.log('editing!');
            // ajax call to update task

            let d = new Date( $('#item-date').val() );
            let todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: ( $('#todo'+todoItemId+' input[type="checkbox"]').attr('checked') ? true : false ),
                description: $('#item-description').val()
            };

            $.ajax({
                url: '/item/' + todoItemId,
                type: 'PUT',
                data: todoItemData,
                success: editSuccess
            });

        } else if (editMode == 'new') {
            console.log('creating!');
            // ajax call to add new task

            let d = new Date( $('#item-date').val() );
            let todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: ( $('#todo'+todoItemId+' input[type="checkbox"]').attr('checked') ? true : false ),
                description: $('#item-description').val()
            };

            $.ajax({
                url: '/item/new',
                type: 'POST',
                data: todoItemData,
                success: editSuccess
            });

        } else {
            console.error('No edit mode specified!');
        }
    });
});


function editSuccess(result, status, response) {
    console.log('edited successfully!', result);
    if (response.status == 200) {
        let todoItemId = result.data.item_id;
        $('#todo'+todoItemId+' .card-title').text(result.data.title);
        $('#todo'+todoItemId+' .cart-text').text(result.data.description);
        $('#todo'+todoItemId+' input[type="checkbox"]').attr('checked', result.data.done);
    } else {
        console.error('Could not edit to-do item!');
    }
}