/**
 * Created by lishengyong on 2016/7/8.
 */
define('mods/Gomeplus/gotoPage',function(require,exports,module){
    require('$');
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    module.exports = {
        gotoPage: function(id, type, obj, callb) {
            var url = $('#' + id).attr('data-value');
            $('#' + id).on('click', function () {
                if(obj && callb) {
                    // 做一个回调， 执行相应的方法
                    callb.apply(obj);
                }
                if(location[type]) {
                    if($('#' + id).attr('data-local')) {
                        url = $('#' + id).attr('data-local');
                    }
                    if(typeof location[type] === "function"){
                        location[type](url);
                    } else {
                        location[type] = url;
                    }
                } else {
                    var tempUrl = location.protocol + '//' + location.hostname + '/' + url;
                    if(type === 'localJump'){
                        AppInterface.call('/common/localJump', {url:encodeURIComponent(base64.encode(tempUrl))});
                    }
                    if(type === 'jumpNoHistory') {
                        AppInterface.call('/common/localJump', {url: encodeURIComponent(base64.encode(tempUrl)), noHistory:encodeURIComponent('1')});
                    }
                }
            });
        }
    }
});