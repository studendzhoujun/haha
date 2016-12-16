/**
 * Created by lishengyong on 2016/8/8.
 */

define('mods/Gomeplus/getUserState', function(require, exports, module) {
    require('$');
    module.exports = {
        userTaskInfo : function(callb) {
            // 查询当前用户状态， 不为0时就做刷新。
            $.ajax({
                type:'get',
                url: '/playgomeplus/userTaskInfoApi',
                data: {},
                dataType: 'json',
                success: function(data){
                    callb(data);
                },
                error: function(xhr, type){
                    console.log('Ajax error!');
                }
            });
        }
    }
});

