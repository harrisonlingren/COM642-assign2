$(document).ready( function() {
  $(".navbar-toggle").click( function() {

    // hide if expanded
    if ( $('.nav-side').attr('data-collapsed') == 'false') {
      $(".nav-side").animate({'width': '0'});
      $("#page-wrapper").animate({'margin-left': '0px'});
      $('.sidebar-collapse').hide();
      $('.nav-side').attr('data-collapsed', 'true');

    // show if collapsed
    } else {
      $(".nav-side").animate({'width': '278px'});
      $("#page-wrapper").animate({'margin-left': '278px'});
      $('.sidebar-collapse').show();
      $('.nav-side').attr('data-collapsed', 'false');
    }
  });
});