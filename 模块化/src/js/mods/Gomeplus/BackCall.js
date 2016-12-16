/**
 * Created by lishengyong on 2016/7/8.
 * 手机端返回按钮返回之后回调的方法
 *
 */
define('mods/Gomeplus/BackCall.js',function(require,exports,module){
    require('utils/appInterface.js');
    var onRefresh = window.onRefresh = function(url) {
            location.reload(true);
    }
    module.exports.onRefresh = onRefresh;
});