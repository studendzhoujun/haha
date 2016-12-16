/**
 * Created by lishengyong on 2016/6/20.
 */

define('conf/Darentequan/darentequan.js', function (require, exports, module) {
    require('utils/appInterface.js');
    // 给body加背景颜色
    document.body.style.background = '#032242';
    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);
    //创建圈子
    document.getElementById("createCircle").addEventListener('click', function(event){
        AppInterface.call('/circle/create');
    });
});
