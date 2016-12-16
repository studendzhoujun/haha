/**
 *  金融理财迁移
 *  by zhoujun
 *  2016/11/28
 */
define('conf/financial/index.js', function (require, exports, module) {
    var $=require('vendors/zepto.js');
    var AppInterface = require('utils/appInterface.js');
    var touchSlide = require('vendors/TouchSlide_gm.js');
    var base64 = require('utils/base64.js');
    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    if($('.bd ul').find('li').length>1){
        touchSlide.TouchSlide({
            slideCell: "#slider",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "leftLoop",
            timeout:5000,
            autoPage: true, //自动分页
            autoPlay: true //自动播放
        });
    }
    //通过协议跳转
    $('body a').click(function(){
      var href=$(this).attr('_href');
        if(href.indexOf('javascript:;')){
         AppInterface.call('/common/localJump', {url: base64.encode(href)});
        }
    });
});
