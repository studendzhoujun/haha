/**
 * 商品销售中批量管理模块脚本
 * @author yanglang
 * @date 20160129
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
         data-config="config.js"
         data-debug="true"
         data-main="conf/ProductManage/batchSaleList.js">
    </script>
 */
define('conf/ProductManage/batchSaleList.js',function(require,exports,module) {
    require('$');
    require('UI/tab.js');
    var Ajax = require('utils/ajax.js');
    var Vue = require('vendors/vue.js');
    require('utils/calendar.js');
    require('utils/appInterface.js');
    require('mods/tokenCheck.js');
    var common = require('lib/common.js');
    var shopId = common.getParams()['shopId'],vueObj,pageNum = 1;


    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    init();
    bindEvents();


    function init(){
        Vue.filter('dateFormat',function(date){
            return Calendar.getInstance(date).format('yyyy-MM-dd');
        });
        vueObj = new Vue({
            el:'#selling-item-template',
            data:{
                items:window.sellingItems?window.sellingItems:[]
            }
        });
        $('#selling-item-template').show();
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

        $('.mshop-manageSale').on('click','ul.common-prolist>li.set',function(){
            var $check = $(this).find('div.common-prosel>a');
            $check.hasClass('checked') ? function(){
                $check.removeClass('checked');
                $('#selectAllBtn').removeClass('checked');
            }() : function () {
	            $check.addClass('checked');

	            var ckLen = $('div.common-prosel>a').size();
	            var ckedLen = $('div.common-prosel>a.checked').size();

	            if (ckLen == ckedLen && !$('#selectAllBtn').hasClass()) {
		            $('#selectAllBtn').addClass('checked');
	            }
            }();
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
                            fetchData(1);
                            $('#selectAllBtn').removeClass('checked');
                            return;
                        }
                        AppInterface.toast('商品已删除');
                        fetchData(1);
                        $('#selectAllBtn').removeClass('checked');
                        for (var i = 0; i < ids.length; i++) {
                            var items = findItems(vueObj.items, 'id', ids[i]);
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
                if(data.success){
                    fetchData(1);
                    $('#selectAllBtn').removeClass('checked');
                }
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
        Ajax.query('/products/indextab',{type:1,shopId:shopId,pageNum:pageNum},function(data){
            if(pageNum == 1)
                vueObj.items = [];
            var i = 0, itemList = data.data.itemList, len = itemList.length;
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