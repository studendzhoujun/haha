define('conf/app-purchase/purchase.js', function (require, exports, module) {
      require('$');
      require('utils/appInterface.js');
      require('vendors/zepto-fx.js');
      require('mods/buried.js');
      var common = require('lib/common.js');
      var base64 = require('utils/base64.js');
      var Ajax = require('utils/ajax.js');
      var check = require('mods/check.js');
      var storage = require('mods/storage.js');
      var appEvent = require('mods/appEvent');
      var dropload = require('vendors/dropload.js');
      var returnTop = require('mods/returnTop.js');

      var params={};
      params['url'] = location.href;
      params['userid'] = window.userId || 0;
      params['cookid'] = storage.getCookie('PHPSESSID') || 0;      
      AppInterface.call('/common/statistics', {
          code: encodeURIComponent('YP518H01'),               
          desc: encodeURIComponent(JSON.stringify(
              {name:'一元购',user_id: params.userid,url:params.url,cook_id:params.cookid}
          ))
      }); 
	   
      //回到顶部
     returnTop.returnTop();

      //分享内容
      var title = '1元居然可以买这些东西，快奔走相告，拯救友谊小船！';
      var desc = '国美+1元超值活动大放送，小伙伴儿们都来围观了！';
      var imgUrl=shareImgUrlPrefix+'/images/op/app-purchase/purchase-share.jpg';
      var link = shareUrl;     
      if(directCallApp.qualification == 1 ){
          var shopId=directCallApp.shopId;
          var skuId=directCallApp.skuId;
          var kid=directCallApp.kid;
          var couponId=directCallApp.couponId;
          var couponMoney=directCallApp.couponMoney;
          var isOneYuan='';
          AppInterface.call('/order/confirmOrder', {
                shopId: shopId,
                skuId: skuId,
                kid: kid,
                isOneYuan:1,
                couponId:couponId,
                couponMoney:couponMoney
          });  
      }   
      
      var merger_Id = null;
      //点击购买，先判断登录状态
      $('.btn').click(function(){                    
              if($(this).hasClass('out')){
                AppInterface.toast('此商品已售罄，看看其他吧！');                 
                return false;                
              }             
             //获取点击的商品信息
            var proMsg =  productListInfo[$(this).attr("id")];
            var shopId =  proMsg.shopId,
                productId = proMsg.productId;           
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('YB518H01'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'立即购买',user_id: params.userid,url:params.url,cook_id:params.cookid,shop_id:shopId,product_id:productId}
                ))
            });            
             if(userId==0){  //未登录,先注销再调登录
                    AppInterface.call('/common/logout',function(data){
                         if(data.success){
                             AppInterface.call('/common/login',function(data){
                                  if(data.success){
                                        userId=data.data.userId;//登录成功                                                                                                                  
                                        storage.setCookie('userId',data.data.userId);
                                        storage.setCookie('token',data.data.token);
                                        window.location.reload();//登陆后刷新页面，获取按钮状态                                                                        
                                        Ajax.query('/op/easybuy/buy', {
                                                  productId:proMsg.productId,
                                                  skuId:proMsg.skuId,
                                                  shopId:proMsg.shopId,
                                                  price:proMsg.financialPrice,
                                                  originPrice:proMsg.originPrice,
                                                  couponBatchSN:proMsg.couponBatchSn
                                              }, function(data) {                                                                                        
                                              if(data.success){
                                                  if(data.data.qualification == 1){//有购买资格，跳转订单页
                                                      AppInterface.call('/order/confirmOrder', {
                                                          shopId: data.data.shopId,
                                                          skuId: data.data.skuId,
                                                          kid: data.data.kid,
                                                          isOneYuan:1,
                                                          couponId:data.data.couponId,
                                                          couponMoney:data.data.couponMoney
                                                      }); 
                                                  }else if(data.data.qualification == 2){//有购买资格，但有未付款订单                                                     
                                                      $('.pay-pro').show(); 
                                                      merger_Id  = data.data.mergerId ;                                                       
                                                  }else if(data.data.qualification == 3){//商品下架或者售罄
                                                       AppInterface.toast('此商品已售罄，看看其他吧！');
                                                       return false;
                                                  }else{//没有购买资格,跳转美易
                                                      AppInterface.call('/common/localJump', {type:'1',url: base64.encode(data.data.location+'?from='+encodeURIComponent(data.data.params.from)+'&userId='+encodeURIComponent(data.data.params.userId)+'&mobile='+encodeURIComponent(data.data.params.mobile)+'&token='+encodeURIComponent(data.data.params.token)+'&nickName='+encodeURIComponent(data.data.params.nickName)+'&loginName='+encodeURIComponent(data.data.params.loginName)+'&goodsId='+encodeURIComponent(data.data.params.goodsId)+'&goodsAmount='+encodeURIComponent(data.data.params.goodsAmount)+'&investAmount='+encodeURIComponent(data.data.params.investAmount)+'&orderId='+encodeURIComponent(data.data.params.orderId)+'&couponBatchsn='+encodeURIComponent(data.data.params.couponBatchsn)+'&notifyUrl='+encodeURIComponent(data.data.params.notifyUrl)+'&retUrl='+encodeURIComponent(data.data.params.retUrl)+'&timeStamp='+encodeURIComponent(data.data.params.timeStamp)+'&sign='+encodeURIComponent(data.data.params.sign))});
                                                  };                                                 
                                              }else{
                                                  //请求参数失败，因为接口数据不稳定，所以这个toas没做
                                                  // AppInterface.toast('服务异常，请稍后再试！');  
                                              }                      
                                        });                                                                    
                                  }
                             })
                         }
                    })
                }else{//登陆成功          
                      Ajax.query('/op/easybuy/buy', {
                              productId:proMsg.productId,
                              skuId:proMsg.skuId,
                              shopId:proMsg.shopId,
                              price:proMsg.financialPrice,
                              originPrice:proMsg.originPrice,
                              couponBatchSN:proMsg.couponBatchSn
                          }, function(data) {                                                                                        
                          if(data.success){
                              if(data.data.qualification == 1){//有购买资格，跳转订单页                                
                                  AppInterface.call('/order/confirmOrder', {
                                      shopId: data.data.shopId,
                                      skuId: data.data.skuId,
                                      kid: data.data.kid,
                                      isOneYuan:1,
                                      couponId:data.data.couponId,
                                      couponMoney:data.data.couponMoney
                                  }); 
                              }else if(data.data.qualification == 2){//有购买资格，但有未付款订单                                    
                                  $('.pay-pro').show(); 
                                  merger_Id  = data.data.mergerId ;                                  
                              }else if(data.data.qualification == 3){//商品下架或者售罄
                                  AppInterface.toast('此商品已售罄，看看其他吧！'); 
                                  return false;                                                                    
                              }else{//没有购买资格                                
                                    AppInterface.call('/common/localJump', {type:'1',url: base64.encode(data.data.location+'?from='+encodeURIComponent(data.data.params.from)+'&userId='+encodeURIComponent(data.data.params.userId)+'&mobile='+encodeURIComponent(data.data.params.mobile)+'&token='+encodeURIComponent(data.data.params.token)+'&nickName='+encodeURIComponent(data.data.params.nickName)+'&loginName='+encodeURIComponent(data.data.params.loginName)+'&goodsId='+encodeURIComponent(data.data.params.goodsId)+'&goodsAmount='+encodeURIComponent(data.data.params.goodsAmount)+'&investAmount='+encodeURIComponent(data.data.params.investAmount)+'&orderId='+encodeURIComponent(data.data.params.orderId)+'&couponBatchsn='+encodeURIComponent(data.data.params.couponBatchsn)+'&notifyUrl='+encodeURIComponent(data.data.params.notifyUrl)+'&retUrl='+encodeURIComponent(data.data.params.retUrl)+'&timeStamp='+encodeURIComponent(data.data.params.timeStamp)+'&sign='+encodeURIComponent(data.data.params.sign))});
                              }
                          }else{
                               AppInterface.toast('服务异常，请稍后再试！');   
                          }                      
                    });     
                }
      });

      //先判断登录状态
      $('.share').click(function(){             
            //分享按钮埋点
           AppInterface.call('/common/statistics', {
                code: encodeURIComponent('YB518H02'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'分享按钮',user_id: params.userid,url:params.url,cook_id:params.cookid}
                ))
            });            
            if(userId==0){  //未登录,先注销再调登录
                    AppInterface.call('/common/logout',function(data){
                         if(data.success){
                             AppInterface.call('/common/login',function(data){
                                  if(data.success){
                                        userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态                                        
                                        storage.setCookie('userId',data.data.userId);
                                        storage.setCookie('token',data.data.token);
                                        window.location.reload();
                                        // $('.window-share').animate({ bottom: '0rem'}, 200);
                                        // $('.window-bg').show();
                                  }                                  
                             })                           
                         }
                    })
            }else{  //userId 有值
                  $('.window-share').animate({ bottom: '0rem'}, 200);
                  $('.window-bg').show();
            }
      });

      //关闭弹层
      $('.change-btn').click(function() {
          $('.window-share').animate({
              bottom: '-4rem'
          }, 200);
          $('.window-bg').hide();
      });

      //分享到微信
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
              }
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

     //调订单页
      $('.payment').click(function(){
            $('.pay-pro').hide();                                                        
            AppInterface.call('/order/waitingPayOrderDetail', {
               mergerId: merger_Id                                               
            });                                                                                   
      });
      $('.close').click(function(){
            $('.pay-pro').hide();                                                              
      });         
});
