/**
 * 模块脚本
 * @author yanglang
 * @date 2016/2/17
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
         data-config="config.js"
         data-debug="true"
         data-main="conf/ProductManage/cateDetails.js">
 </script>
 */
define('conf/ProductManage/cateDetails.js', function (require, exports, module) {
    require('$');
    require('UI/tab.js');
    var Ajax = require('utils/ajax.js');
    var Vue = require('vendors/vue.js');
    require('utils/calendar.js');
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    var common = require('lib/common.js');
    require('mods/tokenCheck.js');

    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    var shopId = common.getParams()['shopId'], vueObj, pageNum = 1;
    var categoryId = common.getParams()['categoryId'];
    var categoryName = common.getParams()['categoryName'];
    var roleId = common.getParams()['roleId'];

    var wapHost = 'http://m.gomeplus.com';
    try{
        wapHost = WAP_HOST;
        wapHost = /^.*\/$/.test(wapHost)?wapHost.substr(0,wapHost.length-1):wapHost;
    }catch(e){
        console.log('获取不到WAP_HOST参数');
    }

    setTimeout(function(){
        init();
        bindEvents();
        Manage.init();
    },0);


    function init() {
        Vue.filter('dateFormat', function (date) {
            return Calendar.getInstance(date).format('yyyy-MM-dd');
        });
        vueObj = new Vue({
            el: '#cate-item-template',
            data: {
                items: window.items?window.items:[]
            }
        });
        $('#cate-item-template').show();
    }

    function bindEvents() {
        var dropload = $('body').dropload({
            loadDownFn: function (me) {
                setTimeout(function () {
                    me.resetload();
                    Manage.fetchData(++pageNum);
                }, 500);
            },
            loadUpFn : function(me){
                setTimeout(function(){
                    me.resetload();
                    Manage.fetchData(pageNum = 1);
                },500);
            }
        });
        $('#cate-item-template').on('click','li>span.sort',function(){
            AppInterface.notify('onClassify',$(this).parent().parent().parent().attr('data-prdid'));
        }).on('click','li>span.del',function(){
            AppInterface.notify('onDelete',$(this).parent().parent().parent().attr('data-prdid'));
        }).on('click','li>span.copy',function(){
            AppInterface.notify('onCopyLink',$(this).parent().parent().parent().attr('data-prdid'),$(this).attr('data-val'));
        }).on('click','li>span.share',function(){
            AppInterface.notify('onShare',
                $(this).parent().parent().parent().attr('data-prdid'),
                $(this).attr('data-price'),
                $(this).attr('data-title'),
                $(this).attr('data-img'));
        }).on('click','ul.common-prolist>li>dl',function(){
            AppInterface.notify('onProductClick',$(this).parent().attr('data-prdid'));
        });
    }


    /**
     * 功能处理器
     * @type {{classify: Function, delete: Function, copyLink: Function, share: Function, findItems: Function}}
     */
    var Manage = {
        init:function(){
            var that = this;
            AppInterface.subscribe('onClassify',function(id){
                that.classify(id);
            }).subscribe('onDelete',function(id){
                that.delete(id);
            }).subscribe('onCopyLink',function(id,title){
                that.copyLink(id,title);
            }).subscribe('onShare',function(id,price,title,imgUrl){
                that.share(id,price,title,imgUrl);
            }).subscribe('onProductClick',function(productId){
                //此处跳XPOP商品详情页
                AppInterface.call('/product/detail', {productId: productId,shopId:0});
            });
        },
        /**
         * 分类至
         * @param id
         */
        classify:function(id){
            var that = this;
            Ajax.query('/products/shopcategory',{itemId:id,shopId:shopId},function(json) {
                if (json.success) {
                    AppInterface.call('/shop/classify', {productIds: [id],categoryId: json.data.categoryId}, function (data) {
                        if (data.success)
                            that.fetchData(1);
                    });
                }
            });
            return this;
        },
        /**
         * 删除
         * @param id
         */
        delete:function(id){
            var that = this;
            AppInterface.confirm('删除后，商品将会彻底消失～',function(data) {
                if (data.success && !data.data.isCancel) {
                    Ajax.update('/products/del', {vshopId: shopId, productId: id}, function (data) {
                        if (data && !data.success) {
                            AppInterface.toast(data.message);
                            return;
                        }
                        var items = that.findItems(vueObj.items, 'productId', id);
                        AppInterface.toast('商品已删除');
                        items.length > 0 && vueObj.items.$remove(items[0]);
                    });
                }
            });
            return this;
        },
        /**
         * 复制链接
         * @param id
         */
        copyLink:function(id,title){
            var link = wapHost+'/product/index?productId='+id+'&shopId='+shopId;
            AppInterface.call('/copy/product',{msg:base64.encode(link),title:title},function(data){
                data.success ? AppInterface.toast('复制成功') : AppInterface.toast(data.message);
            });
            return this;
        },
        /**
         * 分享
         * @param id
         */
        share: function (id,price,title,imgUrl) {
            //暂时区别处理，安卓APP的分享组件会去自己获取kid而ios不会
            if(AppInterface.isIOS){
                Ajax.query('/products/sharerebate',{
                    callform:10,
                    url:'',
                    shareKey:'',
                    skuId:'',
                    itemId:id,
                    flow:1,
                    shopId:shopId
                },function(json){
                    if(json.success){
                        doShare(json.data);
                    }
                });
            }else{
                doShare('');
            }

            function doShare(kId){
                AppInterface.call('/share/product',{
                    productId:id,
                    shopId:shopId,
                    kId:kId,
                    price:price,
                    productName:title,
                    imageUrl:base64.encode(imgUrl)
                },function(data){
                    //安卓要求不弹提示，
                    //data.success ? AppInterface.toast('分享成功') : AppInterface.toast(data.message);
                });
            }
            return this;
        },
        /**
         * 加载下一页数据
         * @param pageNum
         */
        fetchData: function(pageNum) {
            Ajax.query('/products/cateprolistmore', {
                shopId: shopId,
                categoryId:categoryId,
                categoryName:categoryName,
                roleId:roleId,
                pageNum: pageNum
            }, function (data) {
                if (pageNum == 1)
                    vueObj.items = [];
                var i = 0, itemList = data.data, len = itemList.length;
                for (; i < len; i++) {
                    vueObj.items.push(itemList[i]);
                }
            });
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
});