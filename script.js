
$("body").fadeIn(700);




var elem = document.getElementsByTagName("td");

for(var i =0;i<elem.length;i++){
  if(i%3==0){
    elem[i].className ="modal-class";
    elem[i].id = i;
  }
}

var area = document.getElementsByClassName("modal-area");
for(var i=0;i<area.length;i++){
  area[i].id = "modal"+i*3;
}

// $(".modal-class").each(function(){
//   $(this).on("click",function(event){
//
//     $("#modal"+$(this).attr("id")).iziModal();
//
//     console.log($('#modal'+$(this).attr("id")));
//   })
// });

var test =document.getElementsByClassName("modal-class");
var c = test[0].textContent.slice(1);


$(".modal-class").each(function(){
  //jqueryだとうまくできないからjsでやる
  title = document.getElementsByClassName("modal-class")[$(this).attr("id")/3].textContent.slice(1);
  //モーダルを設定 addするイメージ
  $("#modal"+$(this).attr("id")).iziModal(
    {
      title:title,
      headerColor: '#005ab3', //ヘッダー部分の色
      overlayColor: 'rgba(0, 0, 0, 0.5)', //モーダルの背景色
      transitionIn:"fadeInUp",
      transitionOut:"fadeOutDown"
    }
  );
  $(this).on("click",function(event){
    //クリックしたモーダルを表示
      $("#modal"+$(this).attr("id")).iziModal("open");
  })
});
