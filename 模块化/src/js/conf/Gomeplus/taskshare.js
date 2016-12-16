/**
 * Created by lishengyong on 2016/7/8.
 */

define('conf/Gomeplus/taskshare.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    // 点击“容我先看看”本地跳转
    gt.gotoPage('toNoMission', 'href', '');
    // gt.gotoPage('startMission', 'replace', '');
    function updateMissionCallb() {
        console.log('修改任务状态成功');
        var url = $('#startMission').attr('data-value');
        location.href = url;
    }
    $('#startMission').on('click', function(){
        var e = event || window.event;
        e.preventDefault();
        // 修改任务状态， 成功之后做跳转。
        updateMission.update(qid , '1', updateMissionCallb);
    });

});