/**
 * Created by lishengyong on 2016/7/12.
 */
define('mods/Gomeplus/giveItUp', function(require, exports, module) {
    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var base64 = require('utils/base64.js');
    require('utils/appInterface.js');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    function giveUpCallback() {
        console.log('callback success...');
        // 隐藏弹层
        $('#maskPrompt').hide();
        var url = $('#loseBtn').attr('data-value');
        var tempUrl = location.protocol + '//' + location.hostname + '/' + url;
        AppInterface.call('/common/localJump', {url:encodeURIComponent(base64.encode(tempUrl)), noHistory:encodeURIComponent('1')});
        //location.href = tempUrl;
    }
    // 显示弹层
    $('#giveItUp').on('click', function(){
        $('#maskPrompt').show();
    });
    // 隐藏弹层
    $('#regretBtn').on('click', function(){
        $('#maskPrompt').hide();
    });
    // 点击“就怂咋地”跳转页面
    $('#loseBtn').on('click', function(){
        updateMission.update(qid, '2', giveUpCallback);
    });
});