'use strict';

$(document).ready(function () {
    // load cards
    loadTodoCards();
});

var todoItemsData = [];

function loadTodoCards() {
    // GET endpoint for all to-do items
    $.getJSON('/item/all', function (res) {
        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, function (idx, item) {
            createNewCard(item);
            todoItemsData.push(item);
        });

        initCardEvents();
    });
}

function initCardEvents() {
    var _this = this;

    var container = $('.cardContainer');

    // make cards draggable
    container.sortable({
        handle: '.card-title',
        update: function update() {
            $('.card', container).each(function (index, elem) {
                var cardItem = $(elem),
                    newIndex = cardItem.index();
            });
        }
    });

    // clicking checkbox crosses out text/title
    $('.card input[type="checkbox"]').click(function (e) {

        var todoItemId = $(e.currentTarget).parent().attr('id');
        todoItemId = parseInt(todoItemId[todoItemId.length - 1]);

        var itemDone = $('#todo' + todoItemId + ' input[type="checkbox"]').is(':checked');
        $.ajax({
            url: '/item/' + todoItemId,
            type: 'PUT',
            data: { done: itemDone },
            success: editSuccess,
            error: function error() {
                console.error('Could not change to-do item status to ' + itemDone);
                $('#todo' + todoItemId + ' .card-title, #todo' + todoItemId + ' .card-text').toggleClass('done');
                $(_this).attr('checked', _this.checked);
            }
        });

        $('#todo' + todoItemId + ' .card-title, #todo' + todoItemId + ' .card-text').toggleClass('done');
    });

    // Card delete button
    $('.card .btn.btn-danger').click(function (e) {
        var thisCard = $(e.currentTarget).parent();
        var todoItemId = thisCard.attr('id');
        todoItemId = parseInt(todoItemId[todoItemId.length - 1]);

        $.ajax({
            url: '/item/' + todoItemId,
            type: 'DELETE',
            success: function success(result, status, response) {
                thisCard.remove();
                todoItemsData.splice(todoItemId, 1);
                alerts();
            },
            error: function error(result, status, response) {
                console.error(response);
            }
        });
    });

    // FAB for creating new to-do item
    $('#new-item').click(function () {
        $('#edit-modal button.btn-primary').attr('data-editmode', 'new');

        // reset modal form inputs
        $('#item-title').val('');
        $('#item-category').val('');
        $('#item-date').val('');
        $('#item-description').val('');
        $('#edit-modal button.btn-primary').attr('');
    });

    // edit buttons on cards
    $('.edit-btn').click(function () {
        $('#edit-modal button.btn-primary').attr('data-editmode', 'edit');
    });
}

function createNewCard(item) {
    var container = $('.cardContainer');

    var cardTitle = $('<h4 class="card-title"></h4>').text(item.title);
    var cardText = $('<p class="card-text"></p>').text(item.description);
    var cardLabel = $('<label>Completed</label>').attr('for', 'todo' + item.item_id);
    var cardBox = $('<input type="checkbox" />').attr('checked', parseBoolean(item.done));
    if (parseBoolean(item.done)) {
        cardTitle.addClass('done');cardText.addClass('done');
    }
    var cardClose = $('<button class="btn btn-circle btn-danger" type="button"></button>').append('<i class="fa fa-times"></i>');

    var cardEdit = $('<button class="btn btn-circle btn-info edit-btn" type="button"></button>').attr('data-toggle', 'modal').attr('data-target', '#edit-modal').attr('data-todoid', item.item_id).append('<i class="fa fa-pencil"></i>');

    var card = $('<div class="card"></div>').attr('id', 'todo' + item.item_id).append(cardTitle).append(cardClose).append(cardEdit).append(cardText).append(cardLabel).append(cardBox);

    container.append(card);
}

function parseBoolean(b) {
    return b == 'true';
}

$(document).ready(function () {

    // change edit modal content based on the task that was clicked
    var modal = $('#edit-modal');
    modal.on('show.bs.modal', function (event) {
        var btn = $(event.relatedTarget);
        var todoItemId = btn.data('todoid');

        // if editing, get card details from cached data
        if (todoItemId) {
            var todoItem = todoItemsData[todoItemId];
            var d = new Date(todoItem.date);
            d = d.toISOString().substring(0, 10);
            $('#item-title').val(todoItem.title);
            $('#item-category').val(todoItem.category);
            $('#item-date').val(d);
            $('#item-description').val(todoItem.description);
            $('#edit-modal button.btn-primary').attr('data-todoid', todoItemId);
        }
    });

    var saveBtn = $('#edit-modal button.btn-primary');
    saveBtn.click(function () {

        var editMode = saveBtn.data('editmode');
        var todoItemId = saveBtn.data('todoid');

        if (editMode == 'edit') {
            // ajax call to update task

            var d = new Date($('#item-date').val());
            var todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: $('#todo' + todoItemId + ' input[type="checkbox"]').is(':checked'),
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

            var _d = new Date($('#item-date').val());
            var _todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: _d,
                done: $('#todo' + todoItemId + ' input[type="checkbox"]').is(':checked'),
                description: $('#item-description').val()
            };

            $.ajax({
                url: '/item/new',
                type: 'POST',
                data: _todoItemData,
                success: function success(result, status, response) {
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
        var todoItemId = result.data.item_id;
        $('#todo' + todoItemId + ' .card-title').text(result.data.title);
        $('#todo' + todoItemId + ' .card-text').text(result.data.description);
        $('#todo' + todoItemId + ' input[type="checkbox"]').attr('checked', result.data.done);
    } else {
        console.error('Could not edit to-do item!');
    }
}
$(document).ready(function () {
    getCards();
    $(".settings-panel").hide();
    $('i.fa-bell').parent().click(function () {
        alerts();
    });
    $("button.btn.btn-primary.save-template").parent().click(function () {
        setTemplate();
    });
});

function getCards() {
    // GET endpoint for all to-do items
    $.getJSON('/item/all', function (res) {
        // iterate over array of to-do items and insert '.card' elements
        $.each(res.data, function (idx, item) {
            buildArray(item);
        });number();alerts();
    });
}

function number() {
    var length = cardsArray.length;
    $("span.top-label.label.label-warning").text(length);
}

function daysLeft(day) {
    var today = new Date();
    day = new Date(day);
    var dayInMS = 1000 * 60 * 60 * 24;
    return Math.round((day - today) / dayInMS);
}

function alerts() {
    $('.dropdown-alerts').empty();
    $.each(cardsArray, function (idx, item) {
        var i = $('<i class="fa fa-tasks fa-fw"></i>');
        console.log(item.date);
        var span = $('<span class="pull-right text-muted small"></span>').text(daysLeft(item.date) + ' days left');
        var div = $('<div></div>').append(i).append(item.title).append(span);
        var a = $('<a href="#"></a>').append(div);
        var li = $('<li></li>').append(a);
        var divider = $('<li class="divider"></li>');
        $("ul.dropdown-menu.dropdown-alerts").append(li).append(divider);
    });
}

var cardsArray = [];
function buildArray(item) {
    cardsArray.push(item);
}
$(document).ready(function () {
    $(".navbar-toggle").click(function () {

        // hide if expanded
        if ($('.nav-side').attr('data-collapsed') == 'false') {
            $(".nav-side").animate({ 'width': '0' });
            $("#page-wrapper").animate({ 'margin-left': '0px' });
            $('.sidebar-collapse').hide();
            $('.nav-side').attr('data-collapsed', 'true');

            // show if collapsed
        } else {
            $(".nav-side").animate({ 'width': '278px' });
            $("#page-wrapper").animate({ 'margin-left': '278px' });
            $('.sidebar-collapse').show();
            $('.nav-side').attr('data-collapsed', 'false');
        }
    });
});
$(document).ready(function () {
    // if search button clicked, filter by search term
    $('.sidebar-search .btn.btn-default').click(function () {
        var search = $('.sidebar-search input[type="text"]').val();
        filterCards(search, 'search');
    });

    // if Enter key pressed in search box, do search
    $('.sidebar-search input[type="text"]').keypress(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
            $('.sidebar-search .btn.btn-default').click();
        }
    });

    // if category button clicked, filter by category
    $('.categories button').click(function (e) {
        var category = $(e.target).text();
        if (category == 'All tasks') {
            filterCards('', 'all');return;
        }
        filterCards(category, 'category');
    });
});

function filterCards(filterTerm, mode) {
    // add todo items that match the search term to the result
    var results = [];
    $.each(todoItemsData, function (idx, todoItem) {
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
    $.each(results, function (idx, card) {
        createNewCard(card);
    });
}
$(document).ready(function () {

    // change edit modal content based on the task that was clicked
    var modal = $('#edit-modal');
    modal.on('show.bs.modal', function (event) {
        var btn = $(event.relatedTarget);
        var todoItemId = btn.data('todoid');
        $.getJSON('/item/' + todoItemId, function (res) {
            var todoItem = res.data;
            $('#item-title').val(todoItem.title);
            $('#item-category').val(todoItem.category);
            $('#item-date').val(Date.parse(todoItem.date));
            $('#item-description').val(todoItem.description);
            $('#edit-modal button.btn-primary').attr('data-todoid', todoItemId);
        });
    });

    var saveBtn = $('#edit-modal button.btn-primary');
    saveBtn.click(function () {

        var editMode = saveBtn.data('editmode');
        var todoItemId = saveBtn.data('todoid');

        if (editMode == 'edit') {
            // ajax call to update task

            var d = new Date($('#item-date').val());
            var todoItemData = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: d,
                done: $('#todo' + todoItemId + ' input[type="checkbox"]').is(':checked'),
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

            var _d2 = new Date($('#item-date').val());
            var _todoItemData2 = {
                title: $('#item-title').val(),
                category: $('#item-category').val(),
                date: _d2,
                done: $('#todo' + todoItemId + ' input[type="checkbox"]').is(':checked'),
                description: $('#item-description').val()
            };

            $.ajax({
                url: '/item/new',
                type: 'POST',
                data: _todoItemData2,
                success: function success(result, status, response) {
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
        var todoItemId = result.data.item_id;
        $('#todo' + todoItemId + ' .card-title').text(result.data.title);
        $('#todo' + todoItemId + ' .card-text').text(result.data.description);
        $('#todo' + todoItemId + ' input[type="checkbox"]').attr('checked', result.data.done);
    } else {
        console.error('Could not edit to-do item!');
    }
}