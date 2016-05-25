/**
 * 搜索结果页
 * @author renqingyue
 * @date 20160215
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
         data-config="config.js"
         data-debug="true"
         data-main="conf/plist/plist.js">
     </script>
 */
define('conf/plist/plist.js',function(require,exports,module){
    var vueObj, tab;
    require('$');
    require('vendors/zepto-fx.js');
    require('UI/tab.js');
    require('utils/appInterface.js');
    require('utils/calendar.js');
    require('mods/tokenCheck.js');
    var Ajax = require('utils/ajax.js');
    var Vue = require('vendors/vue.js');
    var common = require('lib/common.js');


    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    /**========= 初始调用 ==========**/

    setTimeout(function(){
        initControl();
        initEvents();
        Manage.init();
    },0);
    var shopId = common.getParams()['shopId'];
    var keyWord = common.getParams()['keyWord'];
    var categoryId = common.getParams()['categoryId'];
    var pageNum = 1;
    var sort = 0, sequence = 0;
    /**========= 初始调用 ==========**/


    /**
     * 初始化控制
     * @method initControl
     */
    function initControl(){ 
        vueObj = new Vue({
            el:'#vue-plist',
            data:{
                distributionItems:window.distributionItems||[]
            }
        });
        $('.common-prolist').show();
    }

    /**
     * 初始化事件
     * @method initEvents
     */
    function initEvents(){
        $('#vue-plist').on('click','a.sale-btn-common',function(e){
            if($(this).hasClass('sale-btn')){  
                AppInterface.notify('onSale',$(this).parent().attr('data-prdid'));
            }else{              
                AppInterface.notify('onNoSale',$(this).parent().attr('data-prdid'));
            }
            e.stopPropagation();
            e.preventDefault();
            return false;
        }).on('click','a#commonSort',function(){
            AppInterface.notify('onCommonSort');
            $(this).addClass('cur').siblings().removeClass('cur');
            $("#priceSort em").attr("class","sort-no");
        }).on('click','a#volumnSort',function(){
            AppInterface.notify('onVolumnSort');
            $(this).addClass('cur').siblings().removeClass('cur');
            $("#priceSort em").attr("class","sort-no");
        }).on('click','a#priceSort',function(){
            AppInterface.notify('onPriceSort');
            $(this).addClass('cur').siblings().removeClass('cur');
            var $em = $(this).find("em");
            if($em.hasClass("sort-no")){
                $em.attr("class","sort-down");
            }
        }).on('click','a#commissionSort',function(){
            AppInterface.notify('onCommissionSort');
            $(this).addClass('cur').siblings().removeClass('cur');
            $("#priceSort em").attr("class","sort-no");
        }).on('click','ul.common-prolist>li>dl',function(){
            AppInterface.notify('onProductClick',$(this).parent().attr('data-prdid'));
        });
    }

    /**
     * 数据渲染
     * @method render
     * @param data tab插件查询的数据
     * @param index 页签序号
     * @param $dom 页签body的dom对象
     * @param isLoadMore 是否为加载更多事件
     * @param dataListKey vue数据列表对象key
     */
    function render(data, index , $dom, isLoadMore, dataListKey){
        var i = 0, itemList = dataListKey=='classifyItems'?data: data.itemList, len = itemList.length;
        if(!isLoadMore){
            $dom.find('[data-type=server]').remove();
            vueObj[dataListKey] = [];
        }
        for(;i < len;i++){
            vueObj[dataListKey].push(itemList[i]);
        }
    }

    /**
     * 功能处理器
     * @type {{classify: Function, delete: Function, copyLink: Function, share: Function, findItems: Function}}
     */
    var Manage = {
        init:function(){
            var that = this;
            AppInterface.subscribe('onSale',function(id){
                that.sale(id);
            }).subscribe('onNoSale',function(id){
                that.nosale(id);
            }).subscribe('onCommonSort',function(id){
                sort = 0;
                sequence = 0;
                that.doSort();
            }).subscribe('onVolumnSort',function(id){
                sort = 1;
                sequence = 1;
                that.doSort();
            }).subscribe('onPriceSort',function(id){
                //todo
                if($("#priceSort em").hasClass("sort-down")){
                     $("#priceSort em").attr("class","sort-up");
                     sort = 2;
                     sequence = 1;
                     that.doSort();
                }else{
                     $("#priceSort em").attr("class","sort-down");
                     sort = 2;
                     sequence = 0;
                     that.doSort();
                }
            }).subscribe('onCommissionSort',function(id){
                     sort =3;
                     sequence = 1;
                     that.doSort();
            }).subscribe('onProductClick',function(productId){
                AppInterface.call('/product/detail', {productId: productId,shopId:0});
            });
        },
        calling:false,
        /**
         * 我要分销
         * @param id
         */
        sale:function(id){
            var that = this;
            if(that.calling)
                return;
            that.calling = true;
            Ajax.update('/distribution/adddistribution',{vshopId:shopId,itemId:id},function(data){
                that.calling = false;
                data.success ? AppInterface.toast('分销成功！') : AppInterface.toast(data.message);
                if(data.success){
                    var arr = that.findItems(vueObj.distributionItems,'id',id);
                    arr[0].isSale = true;
                }
            });
            return this;
        },
        /**
         * 取消分销
         * @param id
         * @returns {Manage}
         */
        nosale:function(id){
            var that = this;
            if(that.calling)
                return;
            that.calling = true;
            Ajax.update('/distribution/deldistribution',{vshopId:shopId,itemId:id},function(data){
                that.calling = false;
                data.success ? AppInterface.toast('取消分销！') : AppInterface.toast(data.message);
                if(data.success) {
                    var arr = that.findItems(vueObj.distributionItems,'id',id);
                    arr[0].isSale = false;
                }
            });
            return this;
        },
        /**
         * 综合排序
         */
        doSort:function(){
            var that = this;
            var pageNum =1;
            Ajax.query('/distribution/getplist',{shopId:shopId,sort:sort,sequence:sequence,pageNum:pageNum,keyWord:keyWord,categoryId:categoryId},function(data){
                if(data && data.success){
                    var i = 0, itemList = data.data.itemList, len = itemList.length;
                     vueObj['distributionItems'] = [];
                    for(;i < len;i++){
                        vueObj['distributionItems'].push(itemList[i]);
                    }
                }
            });
            return this;
        },
        /**
         * 从vue对象数组中查找符合条件的item
         * @param items vue数据列表对象
         * @param key 查找属性key
         * @param value 匹配属性值
         * @returns {Array} 符合条件的item数组
         */
        findItems: function(items,key,value){
            var len = items.length,i= 0,result=[];
            for(;i<len;i++){
                if(items[i][key] == value)
                    result.push(items[i]);
            }
            return result;
        }
    };

    // 下拉刷新
    var droploadUp = $('.tab_body', this.$el).dropload({
        loadUpFn: function (me) {
            setTimeout(function () {
                me.resetload();
                Ajax.query('/distribution/getplist', {
                    shopId: shopId,
                    sort: sort,
                    sequence: sequence,
                    pageNum: 1,
                    keyWord: keyWord,
                    categoryId: categoryId
                }, function (data) {
                    if (data && data.success) {
                        var i = 0, itemList = data.data.itemList, len = itemList.length;
                        vueObj['distributionItems'] = [];
                        for (; i < len; i++) {
                            vueObj['distributionItems'].push(itemList[i]);
                        }
                    }
                });
            }, 500);
        }
    });

    var dropload = $('body').dropload({
        loadDownFn: function (me) {
            setTimeout(function () {
                me.resetload();
                Ajax.query('/distribution/getplist', {
                    shopId: shopId,
                    sort: sort,
                    sequence: sequence,
                    pageNum: ++pageNum,
                    keyWord: keyWord,
                    categoryId: categoryId
                }, function (data) {
                    if (data && data.success) {
                        var i = 0, itemList = data.data.itemList, len = itemList.length;
                        for (; i < len; i++) {
                            vueObj['distributionItems'].push(itemList[i]);
                        }
                    }
                });
            }, 500);
        }
    });

});