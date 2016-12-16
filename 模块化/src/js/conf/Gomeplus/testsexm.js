/**
 * Created by lishengyong on 2016/7/7.
 */
define('conf/Gomeplus/testsexm.js', function(require, exports, module){

    require('$');
    var Animation = require('UI/animation.js');
    var gt = require('mods/Gomeplus/gotoPage.js');
    Animation.fadeIn($('.male-bg'), 50);
    // 跳转页面
    gt.gotoPage('nextStep','replace');

})

