/**
 * 搜索结果页
 * @author renqingyue
 * @date 20160215
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
         data-config="config.js"
         data-debug="true"
         data-main="conf/plist/index.js">
     </script>
 */
define('conf/plist/index.js',function(require,exports,module){
    var vueObj, tab;
    require('$');
    require('utils/appInterface.js');
    var common = require('lib/common.js');
    require('mods/tokenCheck.js');


    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    /**========= 初始调用 ==========**/

    var shopId = common.getParams()['shopId'];


    $('a.classItem').on('click',function(){
        var $this = $(this);
        var categoryId = $this.attr('data-val1'),categoryName = $this.attr('data-val2');
        AppInterface.call('/product/search',{categoryId:categoryId,categoryName:categoryName});
    });
});