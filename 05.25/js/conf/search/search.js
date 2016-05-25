/**
 * 商品管理模块脚本
 * @author yanglang
 * @date 20160129
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
         data-config="config.js"
         data-debug="true"
         data-main="conf/ProductManage/productManage.js">
     </script>
 */
define('conf/search/search.js',function(require,exports,module){
  require('$');
    require('UI/tab.js');
    //require('searchtab.js');
    var Vue = require('vendors/vue.js');
    var sellingVue = new Vue({
        el:'#tab_body_page1',
        data:{
            items:[]
        }
    });
    var offlineVue = new Vue({
        el:'#tab_body_page2',
        data:{
            items:[]
        }
    });
    var classVue = new Vue({
        el:'#tab_body_page3',
        data:{
            items:[]
        }
    });
     var classVue = new Vue({
        el:'#tab_body_page4',
        data:{
            items:[]
        }
    });
    $('.mshop-box').tab({
        items: [
            {
                title: '销售中',
                url: 'http://localhost:63342/app_mshop_20160125_shilong/js/conf/ProductManage/selling.json',
                render: function (data, index, $dom, isLoadMore) {
                    if(!isLoadMore){
                        $dom.find('[data-type=server]').remove();
                        sellingVue.items = [];
                    }
                    if(data.code != 0)
                        return;
                    for(var i = 0;i<data.data.length;i++){
                        sellingVue.items.push(data.data[i]);
                    }
                },
                params:function(){
                    return {
                        sortType:22,
                        sortColumn:33
                    };
                }
            },{
                title: '已下架',
                url: 'http://localhost:63342/app_mshop_20160125_shilong/js/conf/ProductManage/offline.json',
                render: function (data, index, $dom, isLoadMore) {
                    if(!isLoadMore){
                        $dom.find('[data-type=server]').remove();
                        offlineVue.items = [];
                    }
                    if(data.code != 0)
                        return;
                    for(var i = 0;i<data.data.length;i++){
                        offlineVue.items.push(data.data[i]);
                    }
                }
            },{
                title: '分类',
                url: 'http://localhost:63342/app_mshop_20160125_shilong/js/conf/ProductManage/class.json',
                render: function (data, index, $dom, isLoadMore) {
                    if(!isLoadMore){
                        $dom.find('[data-type=server]').remove();
                        classVue.items = [];
                    }
                    if(data.code != 0)
                        return;
                    for(var i = 0;i<data.data.length;i++){
                        classVue.items.push(data.data[i]);
                    }
                }
            },{
                title: '已下架',
                url: 'http://localhost:63342/app_mshop_20160125_shilong/js/conf/ProductManage/offline.json',
                render: function (data, index, $dom, isLoadMore) {
                    if(!isLoadMore){
                        $dom.find('[data-type=server]').remove();
                        offlineVue.items = [];
                    }
                    if(data.code != 0)
                        return;
                    for(var i = 0;i<data.data.length;i++){
                        offlineVue.items.push(data.data[i]);
                    }
                }
            }
        ],
        loadMoreSelector: '.loadmore', //加载更多元素选择器
        serverFlush:true,
        index: 0 //默认选中哪个页签
    });
});





    
