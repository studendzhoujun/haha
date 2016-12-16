/*   商品详情
 *   by：zhoujun
 *   date:2016/7/13
*/
define('conf/app-productDetails/redpacket', function (require, exports, module) {
  var $=require('vendors/zepto.js');
  var AppInterface = require('utils/appInterface.js');
  require('UI/lazyload-gm.js');
  var vue=require('vendors/vue.js')
  var utils=require('conf/app-productDetails/miutils.js');
  var dropload = require('vendors/dropload.js');
  var returnTop = require('mods/returnTop.js');
  returnTop.returnTop();
//获取当前页面的url里的参数
  $("img").picLazyLoad({threshold: 10,effect: "fadeIn"});
//test
var app = new vue({
  el: '#wrapper',
  data: {
    message: 'Hello Vue!'
  }
})

/*商品点击进行相应页面跳转*/
   $('.recommend').on('click',function(){
      var shopId=$(this).attr('sid'),
          productId=$(this).attr('pid');
       AppInterface.call('/product/detail', {shopId: shopId, productId: productId});
   });

  var aImg=$('#wrapper img');
  aImg.forEach(function(item,index){
      item.setAttribute('src',item.getAttribute('gome-src'));
      item.style.width='100%';
      item.style.height='auto';
  })
  $('#wrapper table').css({width:'100%'});
  $('#wrapper').dropload({
        distance:50,
        loadUpFn: function (me) {
            setTimeout(function () {
                me.resetload();
                console.log(1);
            }, 500);
        }
    });
  var aLi=$('#wrapper li');
  aLi.forEach(function(item,index){
    index<3?console.log(item):'';
  })
  $('#abox').click(function(){
    console.log(1);
  })

  ///
  var basepath;
  var url='www.baidu.com';
  basepath=basepath?basepath:url;
  console.log(basepath)
});
