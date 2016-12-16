/**
 * Created by lishengyong on 2016/7/13.
 */
define('conf/Gomeplus/taskSuccessSummary.js', function(require, exports, module){

    require('$');
    var gt = require('mods/Gomeplus/gotoPage.js');
    var share = require('mods/Gomeplus/share.js');

    // 截取字符串，保留10个字节
    var strCut = require('mods/Gomeplus/strCut.js');
    var res = strCut.autoAddEllipsis(userName, 10);
    $('#userName').text(res + "：");

    // var logo =  shareImgPathPre + '/images/gomeplus/gomeplus-logo.png';
    // var logo = 'https://css-pre.meixincdn.com/CDN8036/src/images/gomeplus/gomeplus-logo.png';
    var gomePlusRrl = location.protocol + '//' + location.hostname + '/playgomeplus/index';
    // 分享参数
    // 处理用户名
    if(!userName) {
        userName = $('#userName').text();
    }
    var shareParam = {

        title:'这是'+ userName +'从国美+获得的奖牌，特地来此一炫',
        desc:'最快乐的事莫过于玩着就把钱赚了。不信？来看！',
        // 国美+  logo
        imgUrl:'' + logo,
        // 玩转国美+ 路径
        link:'' + linkUrl,
        shareAppUrl: gomePlusRrl
    };
    share.shareTo('share', shareParam);
    gt.gotoPage('endThisMission', 'href');



});