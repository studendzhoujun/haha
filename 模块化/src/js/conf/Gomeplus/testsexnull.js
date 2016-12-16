/**
 * Created by lishengyong on 2016/7/8.
 */
define('conf/Gomeplus/testsexnull.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    gt.gotoPage('select_boy','replace');
    gt.gotoPage('select_girl','replace');

})