/*   抽红包
 *   by：zhoujun
 *   date:2016/11/23
*/
define('conf/redbag/redpacket', function (require, exports, module) {
  var $=require('vendors/zepto.js');
  var AppInterface = require('utils/appInterface.js');
  require('UI/lazyload-gm.js');
  var returnTop = require('mods/returnTop.js');
   var utils=require('conf/redbag/miutils.js');
  returnTop.returnTop();
//获取当前页面的url里的参数

  $("img").picLazyLoad({threshold: 400,effect: "fadeIn"});

  $('.open01').click(function(){
      $(this).removeClass('block');
      $('.open02').addClass('block');
      /*$.ajax({
        url:'https://h5-pre.gomeplus.com/redpacket/doOpen',
        type:'GET',
        data:{},
        dataType:'json',
        success:function(data) {
            if(data.data){ 
                var time=utils.convertTime(data.data.createTime,'.');
                var amount=data.data.amount;
                $('.open02').removeClass('block');
                $('.open03').addClass('block');
                $('.open04 .gome-b').html(amount.toFixed(2));
                $('.open04 .time').html(time);
                var timer=setTimeout(function(){
                   $('.open03').removeClass('block');
                   $('.open04').addClass('block');
                },1000);
            }
        },
        error: function(data) {
             $('.open02').removeClass('block');
             $('.open01').addClass('block');
              AppInterface.toast('服务君开了个小差，小主儿再等等~');
        }
      });*/
      setTimeout(function(){
                var time='2016.11.24';
                var amount=50;
                $('.open02').removeClass('block');
                $('.open03').addClass('block');
                $('.open04 .gome-b').html(amount.toFixed(2));
                $('.open04 .time').html(time);
                var timer=setTimeout(function(){
                   $('.open03').removeClass('block');
                   $('.open04').addClass('block');
                },1000);

      },1000)
  })

/*商品点击进行相应页面跳转*/
   $('.goods-list a').on('click',function(){
      var shopId=$(this).attr('shopid'),
          productId=$(this).attr('productid');
       AppInterface.call('/product/detail', {shopId: shopId, productId: productId});
   });

});
