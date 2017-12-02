$(document).ready( () => {

    // show modal
    $('.section-name').modal('show');
    $('.nameButton').click(() => {
        var itemAppend = '';
        if (readCookie('userName') === null) {
            var userName = " "+$(".inName").val();
            createCookie("userName",userName,1);
            itemAppend = $('<span style="font-weight: bold; color:rgb(0, 153, 0);">'+userName+'</span>!').hide().fadeIn(600);
            $('.section-name').modal('hide');
            $("#title").append(itemAppend);
            $("#searchForm").delay(1000).fadeIn(500);
        } else { 
            $("#nameForm").hide();
            $("#searchForm").show();
            var un = readCookie("userName");
            itemAppend = $('<span style="font-weight: bold; color:rgb(0, 153, 0);">'+' '+un+'</span>!').hide().fadeIn(600);
            $("#title").append(itemAppend);
        }

    });

    $(".inName").focus(function(){
        $(".inName").keypress(function(e) {
            if(e.which == 13) {
                $('.nameButton').click();
            }
        });
    });    
});