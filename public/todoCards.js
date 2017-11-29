//Mark Item as done 
$(document).ready (function(){
$("input[type= 'checkbox']").click(function (){
  var titlenum = this.id[this.id.length -1]
  $('#itemtitle'+titlenum).toggleClass('done')
  var itemtext = this.id[this.id.length -1]
  $('#itemtext'+titlenum).toggleClass('done')
  $("#itemtitle").parent().css({"color": "red", "border": "2px solid red"});
})



})



