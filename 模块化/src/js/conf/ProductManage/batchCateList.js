/**
 * 商品分类批量管理模块脚本
 * @author yanglang
 * @date 20160129
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
         data-config="config.js"
         data-debug="true"
         data-main="conf/ProductManage/batchCateList.js">
    </script>
 */
define('conf/ProductManage/batchCateList.js',function(require,exports,module) {
    require('$');
    require('UI/tab.js');
    var Ajax = require('utils/ajax.js');
    var Vue = require('vendors/vue.js');
    require('utils/calendar.js');
    require('utils/appInterface.js');
    var common = require('lib/common.js');
    require('mods/tokenCheck.js');

    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    var shopId = common.getParams()['shopId'],vueObj,pageNum = 1;
    var categoryId = common.getParams()['categoryId'];
    var categoryName = common.getParams()['categoryName'];
    var roleId = common.getParams()['roleId'];
    init();
    bindEvents();


    function init(){
        Vue.filter('dateFormat',function(date){
            return Calendar.getInstance(date).format('yyyy-MM-dd');
        });
        vueObj = new Vue({
            el:'#cate-item-template',
            data:{
                items:window.items?window.items:[]
            }
        });
        $('#cate-item-template').show();
    }

    function bindEvents(){
        $('#selectAllBtn').on('click',function(){
            var that = this;
            $(this).hasClass('checked')? function(){
                $(that).removeClass('checked');
                $('div.common-prosel>a').removeClass('checked');
            }() : function(){
                $(that).addClass('checked');
                $('div.common-prosel>a').addClass('checked');
            }() ;
        });

        $('.manageSort-shoping').on('click','ul.common-prolist>li.set',function(){
            var $check = $(this).find('div.common-prosel>a');
            $check.hasClass('checked') ? function(){
                $check.removeClass('checked');
                $('#selectAllBtn').removeClass('checked');
            }() : $check.addClass('checked');
        });

        /**
         * 批量删除商品
         */
        $('#deleteBtn').on('click',function(){
            var ids = getSelectItemIds();
            if(!ids)
                return;
            AppInterface.confirm('删除后，商品将会彻底消失～',function(data) {
                if (data.success && !data.data.isCancel) {
                    Ajax.update('/products/delbatch', {shopId: shopId, ids: ids.join(',')}, function (data) {
                        if (data && !data.success) {
                            AppInterface.toast(data.message);
                            return;
                        }
                        AppInterface.toast('商品已删除');
                        for (var i = 0; i < ids.length; i++) {
                            var items = findItems(vueObj.items, 'productId', ids[i]);
                            items.length > 0 && vueObj.items.$remove(items[0]);
                        }
                    });
                }
            });
        });

        $('#classifyBtn').on('click',function(){
            var ids = getSelectItemIds();
            if(!ids)
                return;
            AppInterface.call('/shop/classify',{productIds:ids},function(data){
                data.success ? AppInterface.toast('分类成功') : AppInterface.toast(data.message);
            });
        });
        var dropload = $('body').dropload({
            loadDownFn : function(me){
                setTimeout(function(){
                    me.resetload();
                    fetchData(++pageNum);
                    $('#selectAllBtn').removeClass('checked');
                },500);
            },
            loadUpFn : function(me){
                setTimeout(function(){
                    me.resetload();
                    fetchData(pageNum = 1);
                    $('#selectAllBtn').removeClass('checked');
                },500);
            }
        });
    }

    function getSelectItemIds(){
        var items = $('div.common-prosel>a.checked'), ids;
        if(items.length == 0){
            AppInterface.toast('请先选择商品');
            return;
        }
        ids = [];
        items.each(function(){
            ids.push($(this).parent().parent().attr('data-prdid'));
        });
        return ids;
    }

    function fetchData(pageNum){
        Ajax.query('/products/cateprolistmore', {
            shopId: shopId,
            categoryId:categoryId,
            categoryName:categoryName,
            roleId:roleId,
            pageNum: pageNum
        },function(data){
            if(pageNum == 1)
                vueObj.items = [];
            var i = 0, itemList = data.data, len = itemList.length;
            if(len === 0) {
                AppInterface.toast('没有更多商品！');
            }
            for(;i < len;i++){
                vueObj.items.push(itemList[i]);
            }
        });
    }

    function findItems(items,key,value){
        var len = items.length,i= 0,result=[];
        for(;i<len;i++){
            if(items[i][key] == value)
                result.push(items[i]);
        }
        return result;
    }

});