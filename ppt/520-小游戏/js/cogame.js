'use strict';
//share
   $('.Qz-shareBtn').click(function(){
          $('.window-share').animate({bottom:'0rem'},200);
          $('.window-bg').show();
   });
   $('.change-btn').click(function(){
          $('.window-share').animate({bottom:'-4rem'},200);
          $('.window-bg').hide();
   });
    
   //分享到威信
   $('.window-share li').eq(0).click(function(){
        console.log('分享到微信');
   });
    //分享到朋友
   $('.window-share li').eq(1).click(function(){
        console.log('分享到朋友圈');
    });
   function toDouble(num){
      return num<10?'0'+num:num;
   }

$('.cogame-btn').click(function(){
  // $('.window-bg').show();
  //  $('.window-message').show();
  window.location.href='file:///E:/work/log/17.05/githaha/haha/ppt/520-%E5%B0%8F%E6%B8%B8%E6%88%8F/index2.html'
});
$('.cogame-pos-tab li').click(function(){
   
});
$('.window-close').click(function(){
   $('.window-bg').hide();
   $('.window-message').hide();
});
$('.window-btn').click(function(){
  $('.window-bg').hide();
   $('.window-message').hide();
});