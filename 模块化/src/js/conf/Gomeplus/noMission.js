/**
 * Created by lishengyong on 2016/7/12.
 */
define('conf/Gomeplus/noMission.js', function(require, exports, module){
    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var base64 = require('utils/base64.js');
    require('utils/appInterface.js');    // 跳转圈子广场
    require('mods/Gomeplus/jumpCircle.js');
    var handleParam = require('mods/Gomeplus/handleParam.js');
    var message =  require('mods/Gomeplus/message.js');
    // 查询并展示消息
    message.queryMessage();

    // 跳转个人主页
    require('mods/Gomeplus/mineInfo.js');

    window.onRefresh = function() {
        // 如果当前任务状态为领取， 则跳转任务进行中页面。
        if(handleParam.getFormPage() == 'taskIndex') {
            location.reload(true);
        } else {
            location.replace('index');
        }
    }
    console.log('fromPage : ' + handleParam.getFormPage());

    gt.gotoPage('getAllLeaderboard', 'jumpNoHistory',  message, message.clearTT);
    //  跳转历史记录页面
    gt.gotoPage('historyList', 'jumpNoHistory', message, message.clearTT);
    // 跳转任务说明
    gt.gotoPage('description', 'jumpNoHistory', message, message.clearTT);
    // 做任务
    $('#startMission').on('click', function(){
        var url = $('#startMission').attr('data-value');
        var tempUrl = location.protocol + '//' + location.hostname + '/' + url;
        var fromPage = handleParam.getFormPage();
        // 清除消息定时任务， 再做页面跳转
        message.clearTT.apply(message);

        if(fromPage == 'taskIndex') {
            // 如果是从“容我先看看”跳转过来， 则不走协议跳转
            if($('#startMission').attr('data-local')) {
                url = $('#startMission').attr('data-local');
            }
            location.replace(url);
        } else {
            AppInterface.call('/common/localJump', {url: encodeURIComponent(base64.encode(tempUrl)), noHistory:encodeURIComponent('1')});
        }
    });

});