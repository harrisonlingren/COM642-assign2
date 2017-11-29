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
        });
    });

    $('#edit-modal button.btn-primary').click(() => {
        // ajax call to update task
        $.ajax({
            
        });
    });
});