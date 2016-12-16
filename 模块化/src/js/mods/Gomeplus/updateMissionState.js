/**
 * Created by lishengyong on 2016/7/12.
 */
define('mods/Gomeplus/updateMissionState', function(require, exports, module){
    require('$');
    require('utils/appInterface.js');
    module.exports = {
        /**
         * 修改任务状态
         * @param missionId  要修改的任务id
         * @param state   要修改到的状态
         * @param callb 成功之后的回调函数
         */
        updateMission:function(missionId, state, callb) {
            var param = {
                qid: missionId,
                status:state
            };
            $.ajax({
                type:'get',
                url: location.protocol + '//' + location.hostname + '/playgomeplus/doTask',
                data: param,
                dataType: 'json',
                //jsonp:'callback',
                success: function(data){
                        callb();
                },
                error: function(xhr, type){
                    console.log('Ajax error!');
                    return;
                }
            });
        },
        update: function(missionId, state, callb) {
            var param = {
                qid: missionId,
                status:state
            };
            $.ajax({
                type:'get',
                url: location.protocol + '//' + location.hostname + '/playgomeplus/doTask',
                data: param,
                dataType: 'json',
                //jsonp:'callback',
                success: function(data){
                    if(data.info && data.info === 'success') {
                        callb();
                    } else {
                        if(data.code == -1001) {
                            // 当前任务领取时间小于3天， 不可以认怂。
                            AppInterface.toast('别急，开始任务3天后才能认怂呢！');
                            $('#maskPrompt').hide();
                        } else {
                            AppInterface.toast('修改状态失败，请退出再进');
                            console.log(data);
                        }
                        return;
                    }
                },
                error: function(xhr, type){
                    console.log('Ajax error!');
                    AppInterface.toast('修改状态失败,Ajax error!');
                    return;
                }
            });
        }
    }
});