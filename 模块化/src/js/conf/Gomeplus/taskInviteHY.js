/**
 * Created by lishengyong on 2016/7/7.
 */

define('conf/Gomeplus/taskInviteHY.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var handleParam = require('mods/Gomeplus/handleParam.js');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    var base64 = require('utils/base64.js');
    var userOpt = require('mods/Gomeplus/getUserState.js');
    // 点击“容我先看看”本地跳转
    gt.gotoPage('toNoMission', 'href', '');
    // 修改任务状态回调
    function updateMissionCallb() {
        console.log('修改任务状态成功');
        var url = $('#startMission').attr('data-value');
        if(handleParam.getFormPage() == 'testResult') {
            var tempUrl = location.protocol + '//' + location.hostname + '/' + url;
            AppInterface.call('/common/localJump', {url: base64.encode(tempUrl), noHistory:1});
        } else {
            //url = $('#startMission').attr('data-local');
            location.href = url;
        }
    }
    // 页面刷新   app端调用 onRefresh()，引入即可。
    require('mods/Gomeplus/BackCall.js')
    // 跳转分享好友页面
    $('#startMission').on('click', function(){
        // 修改任务状态， 成功之后做跳转。
        updateMission.update(qid , '1', updateMissionCallb);
    });

    window.onRefresh = function() {
        // 查询当前用户状态， 不为0时就做刷新。
        userOpt.userTaskInfo(getUserTaskCallB);
    }

    /**
     * 查询当前用户状态 回调
     * @param data
     */
    function getUserTaskCallB(data) {
        // 查询当前用户状态， 不为0时就做刷新。
        if(data && data.data && data.data.status != 0) {
            location.replace('index');
        } else {
            console.log('查询用户任务信息失败！');
        }
    }

});