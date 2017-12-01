$(document).ready(() => {
  $(".save-template").click(function(e){
       e.preventDefault();
       var template = $("#template").val();
       switch (template) {
         case 'Red':
             $(".navbar").removeClass('red dark navy cake retro');
             $(".navbar").addClass("red");

             $(".nav-side").removeClass('red-side dark-side navy-side cake-side retro-side');
             $(".nav-side").addClass("red-side");

             $(".sidebar-search").removeClass('red-search dark-search navy-search cake-search retro-search');
             $(".sidebar-search").addClass("red-search");

             $("#new-item").removeClass('red-icon dark-icon navy-icon cake-icon retro-icon');
             $("#new-item").addClass("red-icon");
             break;
         case 'Dark':
             $(".navbar").removeClass('red dark navy cake retro');
             $(".navbar").addClass("dark");

             $(".nav-side").removeClass('red-side dark-side navy-side cake-side retro-side');
             $(".nav-side").addClass("dark-side");

             $(".sidebar-search").removeClass('red-search dark-search navy-search cake-search retro-search');
             $(".sidebar-search").addClass("dark-search");

             $("#new-item").removeClass('red-icon dark-icon navy-icon cake-icon retro-icon');
             $("#new-item").addClass("dark-icon");
             break;
         case 'Navy':
             $(".navbar").removeClass('red dark navy cake retro');
             $(".navbar").addClass("navy");

             $(".nav-side").removeClass('red-side dark-side navy-side cake-side retro-side');
             $(".nav-side").addClass("navy-side");

             $(".sidebar-search").removeClass('red-search dark-search navy-search cake-search retro-search');
             $(".sidebar-search").addClass("navy-search");

             $("#new-item").removeClass('red-icon dark-icon navy-icon cake-icon retro-icon');
             $("#new-item").addClass("navy-icon");
             break;
         case 'Cake':
             $(".navbar").removeClass('red dark navy cake retro');
             $(".navbar").addClass("cake");

             $(".nav-side").removeClass('red-side dark-side navy-side cake-side retro-side');
             $(".nav-side").addClass("cake-side");

             $(".sidebar-search").removeClass('red-search dark-search navy-search cake-search retro-search');
             $(".sidebar-search").addClass("cake-search");

             $("#new-item").removeClass('red-icon dark-icon navy-icon cake-icon retro-icon');
             $("#new-item").addClass("cake-icon");
             break;
         case 'Retro':
             $(".navbar").removeClass('red dark navy cake retro');
             $(".navbar").addClass("retro");

             $(".nav-side").removeClass('red-side dark-side navy-side cake-side retro-side');
             $(".nav-side").addClass("retro-side");

             $(".sidebar-search").removeClass('red-search dark-search navy-search cake-search retro-search');
             $(".sidebar-search").addClass("retro-search");

             $("#new-item").removeClass('red-icon dark-icon navy-icon cake-icon retro-icon');
             $("#new-item").addClass("retro-icon");
             break;
        }
  });
});
