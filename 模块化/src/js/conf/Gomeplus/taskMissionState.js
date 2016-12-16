/**
 * Created by lishengyong on 2016/7/14.
 */
define('conf/Gomeplus/taskMissionState.js', function(require, exports, module){
    // 跳转圈子广场
    require('mods/Gomeplus/jumpCircle.js');
    // 页面刷新   app端调用 onRefresh()，引入即可。
    require('mods/Gomeplus/BackCall.js');
    // 消息提醒
    var message =  require('mods/Gomeplus/message.js');
    message.queryMessage();
    var gt = require('mods/Gomeplus/gotoPage.js');
    gt.gotoPage('missionState', 'jumpNoHistory', message, message.clearTT);
    gt.gotoPage('getAllLeaderboard', 'jumpNoHistory', message, message.clearTT);
    //  跳转历史记录页面
    gt.gotoPage('historyList', 'jumpNoHistory', message, message.clearTT);
    // 跳转任务说明
    gt.gotoPage('description', 'jumpNoHistory', message, message.clearTT);
    // 跳转个人主页
    require('mods/Gomeplus/mineInfo.js');
});