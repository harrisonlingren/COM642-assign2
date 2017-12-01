$(document).ready(() => {
  $(".save-template").click(function(e){
       e.preventDefault();
       var template = $("#template").val();
       switch (template) {
         case Red:
             $(".navbar").removeClass("original");
             $(".navbar").addClass("read");
             break;
       }
  });
});
