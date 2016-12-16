/**
 * Created by lishengyong on 2016/7/14.
 */
define('conf/Gomeplus/taskGoDistribution.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    // 跳转未领取任务页面
    gt.gotoPage('toNoMission', 'replace', '');

    var shopUrl = 'https://h5-pre.gomeplus.com/shop/index';
    
    $('#startMission').on('click', function(){
        var shopId = $('#startMission').attr('data-shopId');
        var tempUrl = '';
        if(shopId) {
            tempUrl = shopUrl + '?shopId=' + shopId;
        } else {
            console.log('没有获取店铺id');
        }
        AppInterface.call('/common/localJump', {url:encodeURIComponent(base64.encode(tempUrl))});
        // AppInterface.call('mine/shop');
    });

    // 页面刷新   app端调用 onRefresh()，引入即可。
    require('mods/Gomeplus/BackCall.js');

});