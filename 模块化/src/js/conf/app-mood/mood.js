define('conf/app-mood/mood.js', function (require, exports, module) {
    require('$');
    require('utils/appInterface.js');
    require('vendors/zepto-fx.js');
    require('mods/buried.js');
    var common = require('lib/common.js');
    var base64 = require('utils/base64.js');
    var Ajax = require('utils/ajax.js');
    var check=require('mods/check.js');
    var storage = require('mods/storage.js');
    var appEvent=require('mods/appEvent');
    var dropload = require('vendors/dropload.js');
    var returnTop = require('mods/returnTop.js');
    returnTop.returnTop();
    //页面埋点js
    //console.log('%cstudentzhoujun', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
    AppInterface.call('/common/statistics', {
        code:'P605H001',
        name:'促销页面',
        device_id:'',
        uid:''
    });
    //分享参数
  var title = '猴年马月悄悄的来了,任性低价也跟着悄悄的来了';
  var desc = '在这”不可描述”的二十八天里,国美+看”天”放”价”,带你放肆一把！';
  var imgUrl=shareImgUrlPrefix+'/images/op/app-mood/share.jpg';
  var link = shareUrl;
    //判断登录状态
   // var userId = 12;
    //console.log('userId='+userId);
    function isLogin(fn){
        if(userId==0){  //未登录,先注销再调登录
            AppInterface.call('/common/logout',function(data){
                 if(data.success){
                     AppInterface.call('/common/login',function(data){
                          if(data.success){
                                userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                storage.setCookie('userId',data.data.userId);
                                storage.setCookie('token',data.data.token);
                                fn&&fn();
                            }
                     })
                 }
            })
        }else{  //userId 有值
           fn&&fn();
        }
    }
    //显示弹层
    function showShare(){
        $('.window-share').animate({bottom:'0rem'},200);
        $("#totop").hide();
        $('.window-bg').show();
        $('.change-btn').click(function(){
            $('.window-share').animate({bottom:'-4rem'},200);
            $('.window-bg').hide();
            $("#totop").show();
        });
    }
    //分享到威信
    $('.window-share li').eq(0).click(function(){
        AppInterface.call('/common/share',{
                type:'weixin',
                title:title,
                desc:desc,
                imgUrl:base64.encode(imgUrl),
                link:base64.encode(link)
            },function(data){
                if(data.success){
                    //AppInterface.toast('分享成功');
                    $('.window-share').animate({bottom:'-4rem'},200);
                    $('.window-bg').hide();
                }
         });
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
              code: 'B605H001',
              name: '分享微信'
            });
        });
    });
    //分享到朋友
    $('.window-share li').eq(1).click(function(){
         AppInterface.call('/common/share',{
                type:'pengyouquan',
                title:title,
                desc:desc,
                imgUrl:base64.encode(imgUrl),
                link:base64.encode(link)
            },function(data){
                if(data.success){
                    //AppInterface.toast('分享成功');
                   $('.window-share').animate({bottom:'-4rem'},200);
                   $('.window-bg').hide();
                }
           });
         AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
              code: 'B605H001',
              name: '分享朋友圈'
            });
        });
    });
    //分享按钮点击登录直接分享；未登录调app登录;
    $('.Index-shareBtn').click(function(){
        isLogin(showShare);
         AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
              code: 'B605H001',
              name: '分享按钮',
              device_id: '',
              uid: ''
            });
         });
    });
    //中间商品的点击调app内的商品详情页;
     $('body').on('click', '.mood-box a',function(){
        var productid=$(this).attr('productid');
        var shopid=$(this).attr('shopid');
        var producturl=$(this).attr('producturl');
        AppInterface.call('/common/productDetail', {shopId: shopid, productId: productid});
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
                code: 'B605H002',
                name: '商品点击',
                shop_id: base64.encode(shopid),
                produce_id: base64.encode(productid),
                device_id: ''
                //param: base64.encode(JSON.stringify({shopId: shopid, productId: productid,device_id :''}))
            });
        });
    });
    
     //下拉刷新
     var droploadUp = $('body').dropload({
        loadUpFn: function (me) {
            setTimeout(function () {
                me.resetload();
                location.reload(true);
            }, 500);
        }
     });
     //返回顶部
     var oTotop = $('.totop')[0];
         if(oTotop){
             oTotop.style.display='none';
             window.onscroll = function(){
                 if(document.body.scrollTop>50 && $(".window-bg").css("display") == "none"){
                     oTotop.style.display='block';
                 }else{
                     oTotop.style.display='none';
                 }
             };
             oTotop.onclick=function(){
                 // var docBody =;
                 gotoTop( document.body,300)
             };
         }
         function gotoTop(obj,time){
             if(time>30){
                 var s = Math.round(time/30);
             }else{
                 var s = 1;
             }
             clearInterval(obj.timer);
             obj.timer = setInterval(function(){
                 var t = obj.scrollTop;
                 var speed = (0-t)/(s/2);
                 speed = speed>0?Math.ceil(speed):Math.floor(speed);
                 obj.scrollTop = t + speed;
                 var bOk = true;
                 if(obj.scrollTop!=0){
                     bOk = false;
                 }
                 if(bOk){
                     clearInterval(obj.timer);
                 }
             },30)
         }

});