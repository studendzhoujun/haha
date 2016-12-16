/**
 * Created by lishengyong on 2016/7/8.
 */
define('conf/Gomeplus/teststart.js', function(require, exports, module){

    require('$');
    // var gt = require('mods/Gomeplus/gotoPage.js');
    var Login = require('mods/isLogin.js');
    // gt.gotoPage('startTest', 'replace');

    $('#startTest').on('click', function() {
        if (!Login.commpareVersioon(Login.getVersion())) {
            if (userId == 0) {
                // 弹层提示
                showLayer();
            } else {  //userId 有值，已经登录
                goNext('startTest');
            }
        } else {
            AppInterface.call('/common/getLoginStatus', function (data) {
                console.log(data);

                if (data.success) {
                    // 已登录
                    goNext('startTest');
                } else {
                    // 未登录，弹层提示
                    showLayer();
                }
            });
        }
    });

    /**
     * 跳转下一步
     * @param id
     */
    function goNext(id) {
        var url = $('#' + id).attr('data-value');
        if($('#' + id).attr('data-local')) {
            url = $('#' + id).attr('data-local');
        }
        location.replace(url);
    }

    /**
     * 显示弹层
     */
    function showLayer() {
        $('.mask')[0].style.display = 'block';
    }
    
})