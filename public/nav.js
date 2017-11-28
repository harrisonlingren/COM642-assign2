$(document).ready(function() {
  $(".open").click(){
    $("#mySidenav").animate({width = "250px";});
    $("main").animate({margin-left = "250px";});
  }
  $(".close").click(){
    $("#mySidenav").animate({width = "0"});
    $("main").animate({margin-left = "0"});
  }
});