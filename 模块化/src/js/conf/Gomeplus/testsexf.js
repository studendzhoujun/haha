/**
 * Created by lishengyong on 2016/7/7.
 */
define('conf/Gomeplus/testsexf.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var Animation = require('UI/animation.js');
    // 页面动画
    Animation.fadeIn($('.female-bg'), 50);
    // 页面跳转
    gt.gotoPage('nextStep','replace');

})

