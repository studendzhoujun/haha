/**
 * 商品管理搜索
 * @author zhoujun
 * @date 20160129
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
 *        data-config="config.js"
 *        data-debug="true"
 *        data-main="conf/ProductSearch/productSearch.js">
 *    </script>
 */
 define('conf/ProductSearch/ProductSearch.js',function(require,exports,module){
	require('$');
    require('UI/tab.js');

  //测试代码
    $('#box_tab a').on('click',function(){
    	var index=$(this).index();
    	$(this).addClass('cur');
    	$(this).siblings().removeClass('cur');
    	$('section').hide();
    	$('section').eq(index).show();
    });
    $('#searchBtn a').on('click',function(){
    	var val=$(this).html();
    	var oParentNode=$(this).parent().parent();
        switch(val){
        	case '分类至':
        	  fenlie();
        	break;
        	case '删除':
        	   removeNode(oParentNode);
        	break;
        	case '复制链接':
        	   copyurl();
        	break;
        	case '分享':
        	   share();
        	break;
        	default:
        	   return;
        	break;
        };
    });

    function removeNode(oParentNode){
         oParentNode.remove();
    }
 });