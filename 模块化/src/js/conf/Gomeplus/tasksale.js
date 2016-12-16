/**
 * Created by lishengyong on 2016/7/8.
 */

define('conf/Gomeplus/tasksale.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    // 点击“容我先看看”本地跳转
    gt.gotoPage('toNoMission', 'href', '');

    function updateMissionCallb() {
        var url = '';
        try{
            url = $('#startMission').attr('data-local') + '?qid=' + qid;
        } catch (e) {
            console.log(e);
        }
        location.replace(url);
    }

    $('#startMission').on('click', function(){
        updateMission.update(qid , '1', updateMissionCallb);
    });

});