/**
 * Created by lishengyong on 2016/7/8.
 * 邀请好友进行时
 *
 */
define('conf/Gomeplus/taskDoing.js', function(require, exports, module){
    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    require('mods/Gomeplus/giveItUp.js');
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    // 跳转圈子广场
    require('mods/Gomeplus/jumpCircle.js');
    // 页面刷新   app端调用 onRefresh()，引入即可。
    require('mods/Gomeplus/BackCall.js');
    // 消息提醒
    var message =  require('mods/Gomeplus/message.js');
    message.queryMessage();
    // 倒计时
    require('mods/Gomeplus/countdown.js');
    // 跳转个人主页
    require('mods/Gomeplus/mineInfo.js');

    gt.gotoPage('historyList', 'jumpNoHistory', message, message.clearTT);
    gt.gotoPage('description', 'jumpNoHistory',  message, message.clearTT);
    gt.gotoPage('getAllLeaderboard', 'jumpNoHistory',  message, message.clearTT);

    var shopUrl = 'https://h5-pre.gomeplus.com/shop/index';

    // $('#startMission').on('click', function(){
    $($('.time-mission')[0]).on('click', function(){
        var url = $('#startMission').attr('data-value');
        // dataType用于判断是直接跳转还是需要走协议。 1： 直接跳转。 2：走协议
        var tempUrl = location.protocol + '//' + location.hostname + '/' + url;
        var dataType = $('#startMission').attr('data-type');
        // 清除消息定时任务， 再做页面跳转
        message.clearTT.apply(message);

        if(dataType === '1') {
            AppInterface.call('/common/localJump', {url:encodeURIComponent(base64.encode(tempUrl)), noHistory:encodeURIComponent('1')});
        }
        if(dataType === '2') {
            var shopId = $('#startMission').attr('data-shopId');
            if(shopId) {
                tempUrl = shopUrl + '?shopId=' + shopId;
                AppInterface.call('/common/localJump', {url:encodeURIComponent(base64.encode(tempUrl))});
            } else {
                console.log('没有获取店铺id');
                /*if(url.indexOf('?') > 0) {
                    // 直接走协议 有参数， 处理参数
                    var tempRes = url.split('?');
                    if(tempRes && tempRes.length > 1) {
                        var param = tempRes[1];
                        var paramName = param.split('=');
                        AppInterface.call(tempRes[0], {type:paramName[1]});
                    }
                } else {
                    // 直接走协议
                    AppInterface.call(url);
                }*/
                // 直接走协议
                AppInterface.call(url);
            }

        }
    });

});
