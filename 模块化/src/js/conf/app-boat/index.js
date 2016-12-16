define('conf/app-boat/index.js', function(require, exports, module) {
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

    //分享内容
    var title = '端午赛龙舟，千元礼金“划”到手';
    var desc = '我与豪礼只差一个你的距离，快来帮划龙舟吧！';
    var imgUrl=shareImgUrlPrefix+'/images/op/app-boat/weixin-share.jpg';
    var link = shareUrl;

    //埋点js
    var params={};
    params['url'] = location.href;
    params['userid'] = window.userId || 0;
    // 页面埋点
    AppInterface.call('/common/statistics', {
        code: 'P606H001',
        desc: '欢迎页面',
        param: base64.encode(JSON.stringify({url:params.url, device_id: 0,uid: userId}))
    });

    // 图片预加载
    var images = new Array();
    preloadImages(shareImgUrlPrefix + "/images/op/app-boat/mid.jpg",
        shareImgUrlPrefix + "/images/op/app-boat/movestart.gif",
        shareImgUrlPrefix + "/images/op/app-boat/movemid.gif",
        shareImgUrlPrefix + "/images/op/app-boat/end.jpg",
        shareImgUrlPrefix + "/images/op/app-boat/moveend.gif");

    // 点击 “我要参赛” 隐藏欢迎页，展示游戏开始蒙层手势页面
    $('#game-bg-box').hide();


    //监听手势页面，滑动后进入游戏
    var startFingerObj = document.getElementById('black-back');
    startFingerObj.addEventListener('touchend' ,cancleBlack ,false);

    function cancleBlack() {
        $('.finger-right').hide();
        $('#black-back').hide();
        playGame();
    }

    //先判断登录状态
    $('.join-btn').click(function(){
        // 开始游戏埋点
        AppInterface.call('/common/statistics', {
            code: 'B606H001',
            desc: '开始游戏',
            param: base64.encode(JSON.stringify({url:params.url, device_id: 0,uid: userId}))
        });
        if(userId==0){  //未登录,先注销再调登录
            AppInterface.call('/common/logout',function(data){
                if(data.success){
                    AppInterface.call('/common/login',function(data){
                        if(data.success){
                            userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                            storage.setCookie('userId',data.data.userId);
                            storage.setCookie('token',data.data.token);
                            location.reload(true);
                        }
                    })
                }
            })
        }else{  //userId 有值
            //if(joinGameStatus != 0){
            //    $('#welcome-page').hide();
            //    $('#game-bg-box').show();
            //    $('#black-back').addClass('opa-background');
            //    $('.finger-right').show();
            //}else{
            //    AppInterface.toast("您的游戏机会已用尽！");
            //}
            if(joinGameStatus == 1){
                $('#welcome-page').hide();
                $('#game-bg-box').show();
                $('#black-back').addClass('opa-background');
                $('.finger-right').show();
            }else if(joinGameStatus == -1){
                startFingerObj.removeEventListener('touchend', cancleBlack ,false);
                $('#black-back').addClass('opa-background');
                $('#distance-div').html('距离是' + doneMM + '米，');
                $('.replay-btn').hide();
                $('#black-back').show();
                $('.con-popup-menu').show();
            }else{
                AppInterface.toast("请您退出重试！");
            }
        }
    });


    // 玩游戏
    function playGame(){
        /*去掉iphone手机滑动默认行为*/
        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });
        // 进入游戏页面埋点
        AppInterface.call('/common/statistics', {
            code: 'P606H002',
            desc: '进入游戏页面',
            param: base64.encode(JSON.stringify({url:params.url, device_id: 0,uid: userId}))
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

    // 再玩一次
    function playAgain(){
        $('.con-popup-menu').hide();
        $('#black-back').hide();
        $('#game-page').show();
        $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/start.jpg');
        gameTime = 20;
        count = 0;
        state = 0;
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
        //if(count > 12000){
        //    score = 100 + Math.ceil(Math.random()*5);
        //}else{
        //    score = Math.floor(count / 100);
        //}
        score = Math.floor(count / 400);
        $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/moveend.gif');
        setTimeout(function(){
            $('#game-page img').attr('src',shareImgUrlPrefix + '/images/op/app-boat/end.jpg');
//				alert("得分："+score);
            Ajax.query("/op/duanwu/addresult",{
                donemm: score
            },function(data){
                if(data.success){
                    var distance = data.data.distance;
                    var joinGameStatus = data.data.joinGameStatus;
                    gameEnd(distance,joinGameStatus);
                }else{
                    AppInterface.toast(data.data.message);
                }
            });
        },1200);
    }

    // 游戏结束
    function gameEnd(distance, joinGameStatus){
        $('#distance-div').html('距离是' + distance + '米，');
        if(joinGameStatus == 1){
            $('.replay-btn').show();
        }else{
            $('.replay-btn').hide();
        }
        $('#black-back').show();
        $('.con-popup-menu').show();
    }

    // 再玩一次
    $('.con-popup-menu .replay-btn').click(function(){
        // 在玩一次埋点
        AppInterface.call('/common/statistics', {
            code: 'B606H002',
            desc: '点击在玩一次',
            param: base64.encode(JSON.stringify({url:params.url, device_id: 0,uid: userId}))
        });
        playAgain();
    });

    // 邀请好友
    $('.con-popup-menu .invitation-friends-btn').click(function(){
        // 邀请好友埋点
        AppInterface.call('/common/statistics', {
            code: 'B606H003',
            desc: '点击邀请好友',
            param: base64.encode(JSON.stringify({url:params.url, device_id: 0,uid: userId}))
        });
        $('.window-share').show();
        $('.window-share').animate({ bottom: '0rem'}, 200);
    });

    // 查看滑行明细
    $('.con-popup-menu .move-detail-btn').click(function(){
        AppInterface.call('/common/localJump', {type:'0',url: base64.encode(toplistUrl)});
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
                $('.window-share').animate({
                    bottom: '-4rem'
                }, 200);

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
                $('.window-share').animate({
                    bottom: '-4rem'
                }, 200);

            }
        });
    });

    // 取消分享浮层
    $('.change-btn').click(function(){
        $('.window-share').animate({
            bottom: '-4rem'
        }, 200);
    });

    //图片预加载
    function preloadImages(){
        for (var i=0; i < preloadImages.arguments.length; i++){
            images[i] = new Image();
            images[i].src = preloadImages.arguments[i];
        }
    }

});