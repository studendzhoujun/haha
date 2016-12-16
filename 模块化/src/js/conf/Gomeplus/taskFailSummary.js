/**
 * Created by lishengyong on 2016/7/16.
 */
define('conf/Gomeplus/taskFailSummary.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    require('utils/appInterface.js');
    var tipMsg = '申请成为商家就不能再做分销任务！';
    // 重新开始
    // gt.gotoPage('restartMission', 'href');
    // 任务失败的时候点击去判断当前用户是否可以重新开始。 比如开通xpop店铺的用户就不能再重玩
    $('#restartMission').on('click',  function() {
        $.ajax({
            type:'GET',
            url: 'checkDistributionPlayAgain',
            data:{},
            success: function(data) {
                console.log('请求用户是否能够重玩儿接口： ');
                if(data) {
                    console.log(data.toString());
                    // info 为true 时可以重玩
                    if(data.info) {
                        var url = $('#restartMission').attr('data-value');
                        if($('#restartMission').attr('data-local')) {
                            url = $('#restartMission').attr('data-local');
                        }
                        location.href = url;
                    } else {
                        AppInterface.toast(tipMsg);
                    }
                }
            },
            error: function(xhr) {
                console.log('Ajax 请求错误' + xhr);
            }
        })
    })

    // 下一步
    gt.gotoPage('nextStep', 'href');

});
