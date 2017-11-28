$(document).ready (function(){
$("input[type= 'checkbox']").click(function (){
  var titlenum = this.id[this.id.length -1]
  $('#itemtitle'+titlenum).toggleClass('titledone')
})
});