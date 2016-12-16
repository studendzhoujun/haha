/**
 * Created by lishengyong on 2016/7/5.
 */
define('conf/Gomeplus/result.js', function(require, exports, module){
    require('$');
    /*var gt = require('mods/Gomeplus/gotoPage.js');*/
    var share = require('mods/Gomeplus/share.js');
    var base64 = require('utils/base64.js');
    var userOpt = require('mods/Gomeplus/getUserState.js');
    var shareParam = {};
    var gomePlusRrl = location.protocol + '//' + location.hostname + '/playgomeplus/index';
    try{
        shareParam.title = '在国美+，我是' + roleName;
        shareParam.desc = '在不同地点总会扮演不同的角色，你在这里会有什么样的角色？';
        shareParam.imgUrl = '' + roleImgUrl;
        shareParam.link = '' + linkUrl;
        shareParam.shareAppUrl = gomePlusRrl;
    } catch(e) {
        console.log(e);
    }

    share.shareTo('share', shareParam);

    // 点击  点我去赚钱
    var url = $('#startTask').attr('data-value');
    $('#startTask').on('click', function(){
        userOpt.userTaskInfo(getUserTaskCallB);
    });

    function getUserTaskCallB(data) {
        var param = {
            url: encodeURIComponent(base64.encode(url)),
            noHistory:1,
            type:2,
            title:encodeURIComponent('在国美+，我是' + roleName),
            desc:encodeURIComponent('在不同地点总会扮演不同的角色，你在这里会有什么样的角色？'),
            imgUrl:base64.encode(roleImgUrl),
            shareUrl:base64.encode(linkUrl),
            shareAppUrl:base64.encode(gomePlusRrl)
        }

        // 查询当前用户状态， 不为0时就做刷新。
        var tempUrl = '';
        if(data && data.data && data.data.status != 0) {
            // location.replace('index');
            tempUrl = location.protocol + '//' + location.hostname + '/playgomeplus/index';
            param.url = encodeURIComponent(base64.encode(tempUrl));
            AppInterface.call('/common/localJump', param);
        } else if(data && data.data && data.data.status == 0){
            tempUrl = location.protocol + '//' + location.hostname + '/' + url;
            param.url = encodeURIComponent(base64.encode(tempUrl));
            AppInterface.call('/common/localJump', param);
        } else {
            console.log('查询用户任务信息失败！');
        }
    }

});
