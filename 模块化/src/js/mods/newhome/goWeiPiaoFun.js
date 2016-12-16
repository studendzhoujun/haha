/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/goWeiPiaoFun", function(require,exports,module) {
    require('utils/appInterface.js');
    var $ = require('vendors/zepto');
    var base64 = require('utils/base64.js');


    function GetWeiPiao(){
        this.gotoWeipiao = function(){
            $.ajax({
                type: 'post',
                url: '/index/getUserMovieTicketUrl',
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    if(data.code === 401) {
                        console.log(data.message);
                        AppInterface.toast(data.message || '请求失败!');
                        return;
                    }
                    if (data.data) {
                        console.log(data.data.url);
                        AppInterface.call('/common/localJump', {
                            url: encodeURIComponent(base64.encode(data.data.url)),
                            type: encodeURIComponent(3),
                            rightText: encodeURIComponent('电影订单')
                        });
                    } else {
                        console.log(data.message);
                        AppInterface.toast(data.message || '请求失败!');

                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // AppInterface.toast(data.message || '网络错误,请稍后再试!');
                    /*弹出jqXHR对象的信息*/
                    console.log(jqXHR.responseText);
                    console.log(jqXHR.status);
                    console.log(jqXHR.readyState);
                    console.log(jqXHR.statusText);
                    /*弹出其他两个参数的信息*/
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        };
    };
    module.exports = new GetWeiPiao();
});