$(document).ready(function(){    
    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,null,-1);
    }


    if (readCookie('userName') === null) {
        $(".inName").focus(function(){
               $(".inName").keypress(function(e) {
                   if(e.which == 13) {
                       userName = " "+$(".inName").val();
                       createCookie("userName",userName,1);
                       var itemAppend = $('<span style="font-weight: bold; color:rgb(0, 153, 0);">'+userName+'</span>!').hide().fadeIn(600);
                       $("#nameForm").fadeOut(500);
                       $("#title").append(itemAppend);
                       $("#searchForm").delay(1000).fadeIn(500);
                   }
               });
        });     
    }else{ 
       $("#nameForm").hide();
       $("#searchForm").show();
       var un = readCookie("userName");
       var itemAppend = $('<span style="font-weight: bold; color:rgb(0, 153, 0);">'+' '+un+'</span>!').hide().fadeIn(600);
       $("#title").append(itemAppend);
    }
});
