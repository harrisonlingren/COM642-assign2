$(document).ready( function() {
  $(".open").click( function() {
    $("#mySidenav").animate({'width': '250px'});
    $("main").animate({'margin-left': '250px'});
  });
  $(".close").click( function() {
    $("#mySidenav").animate({'width': '0'});
    $("main").animate({'margin-left': '0'});
  });
});