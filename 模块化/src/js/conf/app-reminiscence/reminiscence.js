define('conf/app-reminiscence/reminiscence', function(require, exports, module) {
       require('$');
      require('utils/appInterface.js');
      require('vendors/zepto-fx.js');
      require('vendors/swiper.min.js');
      var common = require('lib/common.js');
      var base64 = require('utils/base64.js');
      var Ajax = require('utils/ajax.js');
      var dropload = require('vendors/dropload.js');
      var returnTop = require('mods/returnTop.js');
      var storage = require('mods/storage.js');
      //埋点js
      var params={};
      params['url'] = location.href;
      params['userid'] = window.userId || 0;
      params['cookid'] = storage.getCookie('PHPSESSID') || 0;  
      params['productid'] = window.productid || 0;
      params['shopid'] = window.shopid || 0;

      AppInterface.call('/common/statistics', {
            code: 'P601H001',
            desc: '六一促销页面',
            param: base64.encode(JSON.stringify({uid:params.userid,url:params.url,cook_id:params.cookid}))
      }); 
      //回到顶部
     
      returnTop.returnTop();
      //图片图片路径为空时为取默认图片
      function defaultUrl(){
        var defaultUrl=$(".reminiscence-part1-picture img").attr("src");
        if(defaultUrl==""){
            defaultUrl.attr("src",shareImgUrlPrefix+'/images/op/reminiscence/default.png')
        }
      }
      defaultUrl();
      // 图片滑动
       var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 30
       });
      //先判断登录状态
      $('#share').click(function(){               
             //分享按钮埋点
            AppInterface.queue(function(){
                  AppInterface.call('/common/statistics', {
                    code: 'B601H001',
                    desc: '分享按钮',
                    param: base64.encode(JSON.stringify({uid:params.userid,url:params.url,cook_id:params.cookid}))
                  });
            });
             if(userId==0){  //未登录,先注销再调登录
                    AppInterface.call('/common/logout',function(data){
                         if(data.success){
                             AppInterface.call('/common/login',function(data){
                                  if(data.success){
                                        userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态                                        
                                        storage.setCookie('userId',data.data.userId);
                                        storage.setCookie('token',data.data.token);                                        
                                        $('.window-share').animate({ bottom: '0rem'}, 200);
                                        $('.window-bg').show();
                                  }                                  
                             })                           
                         }
                    })
                }else{  //userId 有值
                   $('.window-share').animate({ bottom: '0rem'}, 200);
                   $('.window-bg').show();
                }
      });
      //关闭弹层 reminiscence-banner-share
      $('.change-btn').click(function() {
          $('.window-share').animate({
              bottom: '-4rem'
          }, 200);
          $('.window-bg').hide();
      });
      //分享内容
      var title = '国美+ 大龄儿童欢乐趴火热开启，一起来过儿童节啦！';
      var desc = '多款6.1“大龄儿童”好货限时优惠，总有你最爱的一款！今年六一，国美+陪你一起欢乐趴~';
      var imgUrl=shareImgUrlPrefix+'/images/op/reminiscence/activity-share.jpg';
      var link = shareUrl;      
    
      $('.window-share li').eq(0).click(function() {
            AppInterface.call('/common/share', {
                type: 'weixin',
                title: title,
                desc: desc,
                imgUrl: base64.encode(imgUrl),
                link: base64.encode(link)
            }, function(data) {
              if (data.success) {
                  $('.window-share').animate({bottom: '-4rem'}, 200);
                  $('.window-bg').hide();                
                  // $('#bgCoupon').show();
                  // $('#alertCoupon').show();                  
                  // $('#closeActivity').click(function(){
                  //       $('#bgCoupon').hide();
                  //       $('#alertCoupon').hide();  
                  // });
              }
            });    
      });
      //分享到朋友 
      $('.window-share li').eq(1).click(function() {           
          AppInterface.call('/common/share', {
              type: 'pengyouquan',
              title: title,
              desc: desc,
              imgUrl: base64.encode(imgUrl),
              link: base64.encode(link)
          }, function(data) {
              if (data.success) {                                                    
                  $('.window-share').animate({bottom: '-4rem'}, 200);
                  $('.window-bg').hide();
                  // $('#bgCoupon').show();
                  // $('#alertCoupon').show();                   
                  // $('#closeActivity').click(function(){
                  //       $('#bgCoupon').hide();
                  //       $('#alertCoupon').hide();  
                  // });
              }
          });    
      }); 
      //领券按钮
      // $('#ticket').click(function(){
      //       AppInterface.queue(function(){
      //             AppInterface.call('/common/statistics', {
      //               code: 'B601H004',
      //               desc: '分享按钮',
      //               param: base64.encode(JSON.stringify({uid:params.userid,url:params.url,cook_id:params.cookid}))
      //             });
      //       });

      //       $('#bgCoupon').show();
      //       $('#alertCoupon').show();                  
      //       $('#closeActivity').click(function(){
      //             $('#bgCoupon').hide();
      //             $('#alertCoupon').hide();  
      //       });
      // })
       //点击领券
      $('body').on('click', '#ticket',function(){ 
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
                code: 'B601H004',
                desc: '点击领券',
                param: base64.encode(JSON.stringify({uid:params.userid,url:params.url,cook_id:params.cookid,shop_id:params.shopid,produce_id:params.productid}))
            });
        });
        var url=couponChannelUrl;
        AppInterface.call('/common/localJump', {type:'0',url: base64.encode(url)});
    });

      //点击商品跳商品详情 productur
      $('body').on('click', '.reminiscence-part1-picture-figure',function(){
       
        var productid=$(this).attr('productid');
        var shopid=$(this).attr('shopid');
        // var producturl=$(this).attr('producturl');
        // window.location.href=producturl; 
        AppInterface.call('/common/productDetail', {shopId: shopid, productId: productid});
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
                code: 'B601H002',
                desc: '商品点击',
                param: base64.encode(JSON.stringify({uid:params.userid,url:params.url,cook_id:params.cookid,shop_id:params.shopid,produce_id:params.productid}))
            });
        });
    });
       //点击圈子跳转
      $('body').on('click', '.swiper-wrapper figure',function(){        
        var groupid=$(this).attr('groupid');        
        AppInterface.call('/circle/home', {groupId: groupid});
        AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
                code: 'B601H003',
                desc: '跳转圈子',
                param: base64.encode(JSON.stringify({groupId: groupid}))
            });
        });
    });
      //下拉刷新
     var droploadUp = $('body').dropload({
          loadUpFn: function(me) {
              setTimeout(function() {
                  me.resetload();
                  location.reload(true);
              }, 500);
          }
      });    
      

});
