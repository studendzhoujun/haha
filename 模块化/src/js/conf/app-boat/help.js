define('conf/app-boat/help.js', function(require, exports, module) {
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

  var state = 0; // 0状态为页面没有触发touch事件，1状态反之。
  var gameTime = 20; // 游戏时间
  var startY = 0;  //每次触发时开始的Y坐标
  var disY = 0; // 每次手指滑动的距离
  var count = 0; // 滑动距离的总数

  // 图片预加载
  var images = new Array();
  preloadImages(shareImgUrlPrefix + "/images/op/app-boat/mid.jpg",
      shareImgUrlPrefix + "/images/op/app-boat/movestart.gif",
      shareImgUrlPrefix + "/images/op/app-boat/movemid.gif",
      shareImgUrlPrefix + "/images/op/app-boat/end.jpg",
      shareImgUrlPrefix + "/images/op/app-boat/moveend.gif");

  // 点击 “我要参赛” 隐藏欢迎页，展示游戏开始蒙层手势页面
  $('#game-bg-box').hide();

  //先判断登录状态
  $('.join-btn').click(function(){
      if(userId==0){  //未登录,先注销再调登录
          AppInterface.call('/common/logout',function(data){
              if(data.success){
                  AppInterface.call('/common/login',function(data){
                      if(data.success){
                          userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                          storage.setCookie('userId',data.data.userId);
                          storage.setCookie('token',data.data.token);
                      }
                  })
              }
          })
      }else{  //userId 有值
          if(joinGameStatus == 1){
              $('#welcome-page').hide();
              $('#game-bg-box').show();
              $('#black-back').addClass('opa-background');
              $('.finger-right').show();
          }else{
              AppInterface.toast("您的游戏机会已用尽！");
          }
      }
  });

  //$('.help-btn').click(function(){
  //  $('#welcome-page').hide();
  //  $('#game-bg-box').show();
  //  $('#black-back').addClass('opa-background');
  //  $('.finger-right').show();
  //});

  //监听手势页面，滑动后进入游戏
  var startFingerObj = document.getElementById('black-back');
  startFingerObj.addEventListener('touchend' ,cancleBlack ,false);

  function cancleBlack() {
    $('.finger-right').hide();
    $('#black-back').hide();
    playGame();
  }

  // 玩游戏
  function playGame(){
    /*去掉iphone手机滑动默认行为*/
    $('body').on('touchmove', function (event) {
      event.preventDefault();
    });
    startFingerObj.removeEventListener('touchend', cancleBlack ,false);
    $('.count-down').html(gameTime + '"');
    $('.count-down').show();

    var boatObj = document.getElementById('game-page');
    boatObj.addEventListener('touchstart', function(event) {

      startY = event.touches[0].pageY;

      if(state == 0){
        state = 1;
        CountDown();
        $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/movestart.gif');
        setTimeout(function(){
          $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/movemid.gif');
        },1200);
      }

    }, false);

    boatObj.addEventListener('touchmove', function(event) {
      disY = startY - event.touches[0].pageY;
    }, false);

    boatObj.addEventListener('touchend', function(event) {
      if(disY > 0){
        count += disY;
      }
      startY = 0;
      disY = 0;
    }, false);

  }


  //倒计时
  function CountDown(){
    var timer = setInterval(function(){
      gameTime--;
      $('.count-down').html(gameTime + '"');
      if(gameTime == 0){
        clearInterval(timer);
//				cdNum.parentNode.removeChild(cdNum);
        CalculateScore(count);
      }
    },1000);
  }

  // 计算分数
  function CalculateScore(count){
    var score = 0;
    if(count > 12000){
      score = 100 + Math.ceil(Math.random()*5);
    }else{
      score = Math.floor(count / 100);
    }
    $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/moveend.gif');
    setTimeout(function(){
      $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/end.jpg');
//				alert("得分："+score);
      Ajax.query("/op/duanwu/addresult",{
        donemm: score,
        onlineuserid:friendUid
      },function(data){
        if(data.success){
          var distance = data.data.distance;
          gameEnd(distance);
        }else{
          AppInterface.toast(data.data.message);
        }
      });
    },1200);
  }

  // 游戏结束
  function gameEnd(distance){
    $('.zlcg-meter-box').html('您的好友又移动了' + distance + '米啦！');
    $('#black-back').show();
    $('.zlcg-popup-menu').show();
  }

  // 我也要玩
  $('.zlcg-wantplay-btn').click(function(){
    AppInterface.call('/common/localJump', {type:'1',url: base64.encode(gameUrl)});
  });

  // 领取优惠券
  $('.zlcg-lqyhq-btn').click(function(){
    AppInterface.call('/common/localJump', {type:'1',url: base64.encode(redpacketUrl)});
  });

  //图片预加载
  function preloadImages(){
    for (var i=0; i < preloadImages.arguments.length; i++){
      images[i] = new Image();
      images[i].src = preloadImages.arguments[i];
    }
  }

});