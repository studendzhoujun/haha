/**
 * Created by lishengyong on 2016/7/14.
 * 本地协议跳转，清空页面历史记录
 */
define('mods/Gomeplus/jumpNoHistory', function(require, exports, module){
    require('$');
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    module.exports = {
        jump: function(id, jumpURL) {
            $('#' + id).on('click', function(){
                var url = $('#' + id).attr('data-value');
                if(!url) {
                    url = jumpURL;
                } else {
                    url = location.protocol + '//' + location.hostname + '/' + url;
                }
                AppInterface.call('/common/localJump', {url: base64.encode(url), noHistory:1});
            });
        }
    }

});