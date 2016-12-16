/**
 * Created by lishengyong on 2016/8/6.
 */

define('mods/Gomeplus/handleParam',function(require,exports,module){
    module.exports = {
        /**
         * 获取来源页面
         * @returns {string}
         */
        getFormPage: function() {
            // 获取查询参数。根据参数判断来源页面
            var param = location.search;
            var params = null,
                fromPage = '';
            if(param) {
                params = param.split('=');
            }
            if(params && params.length > 0) {
                fromPage = params[1]?params[1]:'';
            }
            return fromPage;
        }
    }
});