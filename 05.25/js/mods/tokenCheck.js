/**
 * 内嵌项目token有效检测
 * @author yanglang
 * @date 2016/3/5
 */
define('mods/tokenCheck', function (require, exports, module) {
    require('utils/appInterface.js');
    var storage = require('mods/storage.js');
    try{
        if(userId == 0 && !AppInterface.isBrowser){
            //token过期或用户未登录
            AppInterface.confirm('用户未登录，现在登录吗？',function(data){
                if (data.success && !data.data.isCancel) {
                    AppInterface.call('/common/logout',function(data){
                        if(data.success){
                            AppInterface.call('/common/login',function(data){
                                if(data.success){  //登录成功
                                    storage.setCookie('userId',data.data.userId);
                                    storage.setCookie('token',data.data.token);
                                    location = location;
                                }
                            });
                        }
                    });
                }
            });
        }
    }catch(e){
        console.warn('tokenCheck warn:'+e);
    }
});