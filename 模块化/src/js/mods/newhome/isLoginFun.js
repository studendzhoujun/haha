/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/isLoginFun", function(require,exports,module) {
    require('utils/appInterface.js');
    var storage = require('mods/storage.js');
    /* cookie临时写入此域名. */
    var cookieDomain = '.gomeplus.com';

    function IsLogin(){
        //获取url传递的参数*/
        this.isLogined = function(callback){
            AppInterface.call('/common/getLoginStatus', function (data) {
                console.log(data);

                if (data.success) {
                    storage.setCookieDomain('userId', data.data.userId, cookieDomain);
                    storage.setCookieDomain('token', data.data.token, cookieDomain);
                    callback();
                } else {
                    AppInterface.call('/common/logout', function (data) {
                        if (data.success) {
                            AppInterface.call('/common/login', function (data) {
                                if (data.success) {
                                    storage.setCookieDomain('userId', data.data.userId, cookieDomain);
                                    storage.setCookieDomain('token', data.data.token, cookieDomain);
                                    callback();
                                }
                            });
                        }
                    });
                }
            });
        };
    }
    module.exports = new IsLogin();
});