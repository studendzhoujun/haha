define('conf/Purchase/purchase.js', function (require, exports, module) {
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
    //页面埋点js
    AppInterface.call('/common/statistics', {
            code: 'THG00A01',
            desc: '页面信息'
    });
    //分享参数
    var title='买买买星人，低价买好货的机会到了！!';
    var desc='多款人气商品抄底价限时抢购，更有神秘爆品买完还能赚!';
    var imgUrl='http://css.meixincdn.com/m/app/src/images/hg-fx.png';
    var link=shareUrl;
	//判断登录状态
    console.log('userId='+userId);
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
        $('.window-bg').show();
        $('.change-btn').click(function(){
            $('.window-share').animate({bottom:'-4rem'},200);
            $('.window-bg').hide();
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
                            AppInterface.toast('分享成功');
                            $('.window-share').animate({bottom:'-4rem'},200);
                            $('.window-bg').hide();
                        }else{
                           AppInterface.toast(data.message);
                        }
                 });
                AppInterface.queue(function(){
                    AppInterface.call('/common/statistics', {
                      code: 'THG00A06',
                      desc: '分享微信'
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
                            AppInterface.toast('分享成功');
                           $('.window-share').animate({bottom:'-4rem'},200);
                           $('.window-bg').hide();
                        }else{
                            AppInterface.toast(data.message)
                        }
                   });
                 AppInterface.queue(function(){
                    AppInterface.call('/common/statistics', {
                      code: 'THG00A05',
                      desc: '分享朋友圈'
                    });
                });
            });
    //分享按钮点击登录直接分享；未登录调app登录;
    $('.Index-shareBtn').click(function(){
        isLogin(showShare);
         AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
              code: 'THG00A04',
              desc: '分享'
            });
         });
    });
    //中间商品的点击调app内的商品详情页;
     $('body').on('click', '.Index-foryou a',function(){
        var productid=$(this).attr('productid');
        var shopid=$(this).attr('shopid');
        var producturl=$(this).attr('producturl');
        AppInterface.call('/common/productDetail', {shopId: shopid, productId: productid});
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
                code: 'THG00A03',
                desc: '商品点击',
                param: base64.encode(JSON.stringify({shopId: shopid, productId: productid}))
            });
        });
    });
     //美易理财活动页
     $('.Index-meiyi').click(function(){
        var url=$(this).attr('advertisement-url');
        AppInterface.call('/common/localJump', {url: base64.encode(url)});
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
                code: 'THG00A02',
                desc: '美易点击',
                param: base64.encode(JSON.stringify({userId: userId}))
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


});