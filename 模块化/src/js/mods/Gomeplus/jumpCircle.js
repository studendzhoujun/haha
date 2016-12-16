/**
 * Created by lishengyong on 2016/7/12.
 */
define('mods/Gomeplus/jumpCircle', function(require, exports, module){
    require('$');
    require('utils/appInterface.js');
    var message =  require('mods/Gomeplus/message.js');
    
    // 点击  “点我去认识更多好友”
    $('#moreFriends').on('click', function(){

        if(message && message.clearTT) {
            // 清除消息定时任务， 再做页面跳转
            message.clearTT.apply(message);
        }

        // 跳转圈子广场
        console.log('跳转圈子广场...');
        AppInterface.call('circle/square');
    });
});