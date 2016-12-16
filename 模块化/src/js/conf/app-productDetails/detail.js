/*   商品详情
 *   by：zhoujun
 *   date:2016/7/13
*/
define('conf/app-productDetails/detail', function (require, exports, module) {
  var $=require('vendors/zepto.js');
	/*var swiper=require('vendors/swiper.min.js');*/
	var AppInterface = require('utils/appInterface.js');
	var storage = require('mods/storage');
  var utils=require('conf/app-productDetails/miutils.js');
  var Slide=require('UI/slide.js');
  var pinchzoom=require('conf/app-productDetails/pinchzoom.js');
  utils.console('sssss');
  /*new pinchzoom.PinchZoom($('div.pinch-zoom'), {});*/
//获取当前页面的url里的参数
  require('UI/lazyload-gm.js');

  $("img").picLazyLoad({threshold: 10,effect: "fadeIn"});

  $('.open1').click(function(){
      $(this).removeClass('on');
      $('.open2').addClass('on');
      setTimeout(function(){
        $('.open2').removeClass('on');
        $('.open3').addClass('on');
        setTimeout(function(){
          $('.open3').removeClass('on');
          $('.open4').addClass('on');
        },2000)
      },2000)
  })

/*商品点击进行相应页面跳转*/
   $('.recommend').on('click',function(){
      var shopId=$(this).attr('sid'),
          productId=$(this).attr('pid');
       AppInterface.call('/product/detail', {shopId: shopId, productId: productId});
   });


























   $('body').on('doubleTap',function(){
      return false;
   });
    var params = utils.getParams();
     params['url'] = location.href;
     params['userid'] = window.userId || 0;
     params['cookid'] = storage.getCookie('PHPSESSID') || 0;
    var pro_Id = params.proId;
    var shop_Id=params.shopId;
    var locId = params.locId ? params.locId : 1;
//点击收起or展开
  var flag=true;
 $('.collapse').click(function(){
 	  if(flag){
           $(this).html('收起<em class="icon icon-up"></em>');
           flag=false;
       }else{
           $(this).html('展开<em class="icon icon-down"></em>');
           flag=true;
       }
      $('.parameter-box').toggle();
 });
//商品的滑动
var opp=document.querySelector('.recommend-product');
var slide=new Slide({ele:opp,BOXCLS:'rolling-box',ITEMCLS:'recommend'});
/*var mySwiper = new swiper('.recommend-product', {
    slideClass : 'recommend',
    slidesPerView:'auto',
    freeMode : true,
    freeModeFluid : true
});*/
/*商品点击进行相应页面跳转*/
   $('.recommend').on('click',function(){
      var index=$(this).index();
      var len=$(this).parent().children().length-1;
      var shopId=$(this).attr('sid'),
          productId=$(this).attr('pid'),
          icSource=$(this).attr('icsource'),
          orderSource=$(this).attr('data-ordersource');
      console.log(shopId+'----'+productId);
      if(index==len){
            AppInterface.call('/product/seeMore', {
                productId: pro_Id,
                shopId: shop_Id
            });
            //埋点
            AppInterface.queue(function(){
                     AppInterface.call('/common/statistics', {
                         code: encodeURIComponent('B000W001'),               
                         desc: encodeURIComponent(JSON.stringify({name:'为你推荐按钮',user_id: params.userid,url:params.url,cook_id:params.cookid}))
                     }); 
            });
      }else{
           AppInterface.call('/product/detail', {shopId: shopId, productId: productId,orderSource:orderSource});
           //埋点
            AppInterface.queue(function(){
                     AppInterface.call('/common/statistics', {
                         code: encodeURIComponent('P000W003'),               
                         desc: encodeURIComponent(JSON.stringify({name:'商品详情页',user_id: params.userid,url:params.url,cook_id:params.cookid,shop_id:shopId,product_id:productId,icSource:icSource}))
                     }); 
            });
      }
   })
});
