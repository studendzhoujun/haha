/**
 * Created by lishengyong on 2016/7/18.
 */
define('conf/Gomeplus/taskGoShop.js', function(require, exports, module){
    require('$');
    require('utils/appInterface.js');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    // 跳转店铺协议 type为1 跳转去开店, 默认跳转我的店铺
    var base64 = require('utils/base64.js');
   
    $('#startMission').on('click', function(){
        AppInterface.call('mine/shop',{type:encodeURIComponent('1')});
    });

    // 页面刷新   app端调用 onRefresh()，引入即可。
    require('mods/Gomeplus/BackCall.js');

});
