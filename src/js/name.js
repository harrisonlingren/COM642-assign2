$(document).ready( () => {

    // show modal
    $('.section-name').modal('show');
    $('.nameButton').click(() => {
        var itemAppend = ''; var userName = '';
        if (readCookie('userName') === null) {
            userName = " "+$(".inName").val();
            createCookie("userName",userName,1);
            $('.name').text(userName);
        } else { 
            $("#nameForm").hide();
            $("#searchForm").show();
            userName = readCookie("userName");
            $('.name').text(userName);
            $("#title").append(itemAppend);
        } $('.section-name').modal('hide');
    });

    $(".inName").focus(function(){
        $(".inName").keypress(function(e) {
            if(e.which == 13) {
                $('.nameButton').click();
            }
        });
    });    
});