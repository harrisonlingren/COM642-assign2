$(document).ready( function() {
  $(".btn-close").click( function() {
    $(".nav-side").animate({'width': '0'});
    $("main").animate({'margin-left': '0'});
  });
});