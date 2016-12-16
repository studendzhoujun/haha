/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/loadHtmlFun", function(require,exports,module) {
    var $ = require('vendors/zepto');
    require('UI/lazyload-gm.js');

    function Html(){
        //获取url传递的参数*/
        this.loadHtml = function(selecter, html){
            $(selecter).append(html);
            $('img').on('error', function(){
                $(this).css('visibility','hidden');
            });
            $("img").picLazyLoad({effect: "fadeIn", speed: 50});
        };
    }
    module.exports = new Html();
});