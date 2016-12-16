/**
 * Created by lishengyong on 2016/7/27.
 */
define('mods/Gomeplus/mineInfo',function(require,exports,module){
    require('$');
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    /**
     * 点击头像跳转个人主页
     */
    $('dl.list>dt>figure>img').on('click', function(){
        var userid = $(this).attr('data-uid');
        AppInterface.call('/mine/userInfo', {userId:userid});
    });
});