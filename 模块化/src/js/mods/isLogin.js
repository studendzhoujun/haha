/**
 * Created by lishengyong on 2016/7/29.
 */


define('mods/isLogin', function(require, exports, module) {
    require('utils/appInterface.js');
    var storage = require('mods/storage.js');
    module.exports = {
        /* cookie临时写入此域名. */
        cookieDomain: '.gomeplus.com',
        /* 取得当前版本号. */
        getVersion: function() {
            var commonParams;
            if(storage.getCookie('CommonParams')) {
                commonParams = storage.getCookie('CommonParams');
            } else if(storage.getCookie('commonParams')) {
                commonParams = storage.getCookie('commonParams');
            } else {
                commonParams = storage.getCookie('commonParam');
            }

            var appVersion = '1.0.5';
            // storage.setCookieDomain('scrd', commonParams, cookieDomain);

            if(commonParams) {
                try {
                    appVersion = JSON.parse(commonParams).appVersion.replace('v', '');
                } catch (e) {
                    appVersion = commonParams.match(/appVersion:v(\d+\.\d+\.\d+)/)[1];
                }
                // if(isAndroid()) {
                //     appVersion = JSON.parse(commonParams).appVersion.replace('v', '');
                // } else {
                //     appVersion = commonParams.match(/appVersion:v(\d+\.\d+\.\d+)/)[1];
                // }
            }
            /*var appVersionArr = appVersion.split('.');
            var i, appNum = 0;

            for(i = 0; i < 3; i++) {
                appNum += parseInt(appVersionArr[i]);
            }
            return appNum;*/
            return appVersion;
        },
        commpareVersioon: function(v) {
            var version = '1.0.5';
            var flag = false;
            if(v) {
                var v_arr = v.split('.');
                var version_arr = version.split('.');
                if(v_arr.length >= 3) {
                    if(v_arr[0] > version_arr[0] ||
                        (v_arr[0] == version_arr[0] && v_arr[1] > version_arr[1]) ||
                        (v_arr[0] == version_arr[0] && v_arr[1] == version_arr[1] && v_arr[2] > version_arr[2])) {
                        flag = true;
                    }
                }
            }
            return flag;
        },
        /* 判断设备. */
        isAndroid: function() {
            var commonParams = storage.getCookie('commonParams') || storage.getCookie('commonParam');

            try {
                return JSON.parse(commonParams).device.indexOf('Android') > -1;
            } catch (e) {
                return false;
            }
        },
        goLogin: function (callback) {
            var me = this;
            if(!me.commpareVersioon(me.getVersion())) {
                    if (userId == 0) {  //未登录,先注销再调登录
                        AppInterface.call('/common/logout', function (data) {
                            if (data.success) {
                                AppInterface.call('/common/login', function (data) {
                                    if (data.success) {
                                        userId = data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                        storage.setCookieDomain('userId', data.data.userId, cookieDomain);
                                        storage.setCookieDomain('token', data.data.token, cookieDomain);

                                        callback();
                                    }
                                })
                            }
                        })
                    } else {  //userId 有值
                        callback()
                    }
            } else {
                    AppInterface.call('/common/getLoginStatus', function (data) {
                        console.log(data);

                        if (data.success) {
                            storage.setCookieDomain('userId', data.data.userId, me.cookieDomain);
                            storage.setCookieDomain('token', data.data.token, me.cookieDomain);

                            callback();
                        } else {
                            AppInterface.call('/common/logout', function (data) {
                                if (data.success) {
                                    AppInterface.call('/common/login', function (data) {
                                        if (data.success) {
                                            storage.setCookieDomain('userId', data.data.userId, me.cookieDomain);
                                            storage.setCookieDomain('token', data.data.token, me.cookieDomain);
                                            callback();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
    }
});

