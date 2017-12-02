$(document).ready( () => {
    // if search button clicked, filter by search term
    $('.addCategory').click( () => {
        var category = $("#category").val();
        var button = $("<button>" + category + "</button>");
        var option = $("<option>" + category + "</option>");
        $(".categories").prepend(button);
        $('#item-category').append('<option value="foo" selected="selected">' + category + '</option>');
    });
});
