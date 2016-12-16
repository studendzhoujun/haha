define('conf/Circle/circle.js', function(require, exports, module) {
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
  returnTop.returnTop();
  //author zhoujun 
  //date  2016/04/11 
  //页面埋点参数
    AppInterface.call('/common/statistics', {
            code: 'CP425A01',
            desc: '页面信息',
            param: base64.encode(JSON.stringify({userId: userId}))
        });
  //分享参数
  var title = '天天福利DAY 好礼送不停！';
  var desc = '加入圈子参与活动，每天200份限量福利大放送，小伙伴们快来一起玩儿！';
  var imgUrl=shareImgUrlPrefix+'/images/op/app-circle/circleshare.png';
  var link = shareUrl;
  console.log('cirle 活动'+userId);
  //先判断登录状态
  $('.Qz-shareBtn').click(function(){
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
  //关闭弹层
  $('.change-btn').click(function() {
    $('.window-share').animate({
      bottom: '-4rem'
    }, 200);
    $('.window-bg').hide();
  });
  //分享到威信
  $('.window-share li').eq(0).click(function() {
    AppInterface.call('/common/share', {
      type: 'weixin',
      title: title,
      desc: desc,
      imgUrl: base64.encode(imgUrl),
      link: base64.encode(link)
    }, function(data) {
      if (data.success) {
        $('.window-share').animate({
          bottom: '-4rem'
        }, 200);
        $('.window-bg').hide();
      }
    });
    AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
            code: 'CB425A05',
            desc: '分享',
            param: base64.encode(JSON.stringify({userId: userId,sharetype:'weixin-F'}))
            });
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
        $('.window-share').animate({
          bottom: '-4rem'
        }, 200);
        $('.window-bg').hide();
      }
    });
     AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
            code: 'CB425A05',
            desc: '分享',
            param: base64.encode(JSON.stringify({userId: userId,sharetype:'weixin-FC'}))
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
  //距下次活动开始的时间
 /* function toDouble(num) {
    return num < 10 ? '0' + num : num;
  }
  var s = $('.time-over span').attr('difftimes');
  setInterval(function() {
    s--;
    if(s==0){
      location.reload(true)
    }
    var h = parseInt(s / 3600);
    var s1 = s % 3600;
    var m = parseInt(s1 / 60);
    var s2 = s1 % 60;
    var str = toDouble(h) + '时' + toDouble(m) + '分' + toDouble(s2)+'秒';
    $('.time-over span').html(str);
  }, 1000);*/
  //与app的通信;
  //.btn1 提醒
  //.btn2 取消取消提醒
  //.btn4 加入圈子赢好礼
  function warnMe(obj,groupId){
     AppInterface.call('/promotion/remindme', function(data) {
          if (data.success) {
            //告诉php提醒成功
            Ajax.query('/op/circle/addRemind', {
              groupId: groupId
            }, function(data) {
              if (data.success) {
                 AppInterface.toast('已成功设置提醒，app会在活动开始前5分钟通知您!');
                obj.removeClass('btn1').addClass('btn2').html('取消提醒');
              }
            });
          }else{
            AppInterface.toast('亲,设置失败,请检查网络');
          }
        });
  }
  $('.Qz-foryou p').on('click', function() {
    var _this = $(this);
    var attr =_this.attr('class');
    var groupId = _this.parent().attr('groupid');
    switch (attr) {
      case 'btn1':
          if(userId==0){  //未登录,先注销再调登录
                AppInterface.call('/common/logout',function(data){
                     if(data.success){
                         AppInterface.call('/common/login',function(data){
                              if(data.success){
                                    userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                    storage.setCookie('userId',data.data.userId);
                                    storage.setCookie('token',data.data.token);
                                    //warnMe(_this,groupId);
                                    location.reload(true);
                                }
                         })
                     }
                })
            }else{
               warnMe(_this,groupId)
            }
         AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
            code: 'CB425A02',
            desc: '提醒',
            param: base64.encode(JSON.stringify({userId: userId,groupId:groupId}))
            });
         });
        break;
      case 'btn2':
          Ajax.query('/op/circle/removeRemind', {groupId: groupId}, function (data) {
             if(data.success){
                 _this.removeClass('btn2').addClass('btn1').html('提醒我');
                 AppInterface.toast('取消提醒成功');
             }else{
                 AppInterface.toast('取消提醒失败');
             }
         });
        break;
      case 'btn4':
           if(userId==0){  //未登录,先注销再调登录
                AppInterface.call('/common/logout',function(data){
                     if(data.success){
                         AppInterface.call('/common/login',function(data){
                              if(data.success){
                                    userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                    storage.setCookie('userId',data.data.userId);
                                    storage.setCookie('token',data.data.token);
               AppInterface.call('/circle/home', {groupId: groupId,activityId:activityId});  
                                }
                         })
                     }
                })
            }else{
               AppInterface.call('/circle/home', {groupId: groupId,activityId:activityId});
            }
         AppInterface.queue(function(){
            AppInterface.call('/common/statistics', {
            code: 'CB425A01',
            desc: '加入圈子',
            param: base64.encode(JSON.stringify({userId: userId,groupId:groupId}))
            });
         });
        break;
    }
  });
  //user-scroll
  var oUl = document.querySelector('ul');
  oUl.innerHTML += oUl.innerHTML;
  var len = oUl.children.length - 1;
  var i = 1;
  oUl.style.WebkitTransition = '1s all ease';

  function move() {
    oUl.style.WebkitTransform = 'translateY(' + (-23 * i) + 'px)';
    i++;
    // console.log(i+'clientLeft='+oUl.clientLeft)
    if (i == len) {
      i = 2;
      oUl.style.WebkitTransition = '';
      oUl.style.WebkitTransform = 'translateY(0px)';
      //console.log(oUl.clientLeft+'=1')
      var left = oUl.clientLeft;
      //console.log(oUl.clientLeft+'=2')
      oUl.style.WebkitTransition = '1s all ease';
      oUl.style.WebkitTransform = 'translateY(-23px)';

    } else {
      oUl.style.WebkitTransition = '1s all ease';
    }
  }

  setInterval(move, 1000);

  //向下滑动
  var hhh = document.body.offsetHeight;
  $('.Qz-ruleBtn').click(function() {
    document.body.scrollTop = hhh;
  });

});