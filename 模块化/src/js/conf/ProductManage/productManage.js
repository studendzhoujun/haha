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
define('conf/ProductManage/productManage.js',function(require,exports,module){
    var vueObj, tab;
    require('$');
    require('vendors/zepto-fx.js');
    require('UI/tab.js');
    require('utils/appInterface.js');
    require('utils/calendar.js');
    require('mods/tokenCheck.js');
    require('mods/buried.js')
    var base64 = require('utils/base64.js');
    var storage = require('mods/storage.js');
    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);
    var params={};
    var noMoreData = false;
    params['url'] = location.href;
    params['userid'] = window.userId || 0;
    params['cookid'] = storage.getCookie('PHPSESSID') || 0;
    // AppInterface.call('/common/statistics', {
    //             code: 'P000W006',
    //             name: '商品管理页',
    //             user_id: base64.encode(params.userid),
    //             url: base64.encode(params.url),
    //             cook_id: base64.encode(params.cookid)
    //             // param: base64.encode(JSON.stringify({user_id: params.userid,url:params.url,cook_id:params.cookid}))
    // });
    AppInterface.call('/common/statistics', {
        code: encodeURIComponent('P000W006'),               
        desc: encodeURIComponent(JSON.stringify(
            {name:'商品管理页',user_id: params.userid,url:params.url,cook_id:params.cookid}
        ))
    });
    var base64 = require('utils/base64.js');
    var Ajax = require('utils/ajax.js');
    var Vue = require('vendors/vue.js');
    var common = require('lib/common.js');
    var wapHost = 'http://m.gomeplus.com';
    var basepath = location.href.match(/^(http[s]?:\/\/(?:[^\/]*))\/.*$/)[1];
    try{
        wapHost = WAP_HOST;
        wapHost = /^.*\/$/.test(wapHost)?wapHost.substr(0,wapHost.length-1):wapHost;
    }catch(e){
        console.log('获取不到WAP_HOST参数');
    }

    /**========= 初始调用 ==========**/
    // AppInterface.buried( 'P000W006','商品管理页');
    setTimeout(function(){
        initControl();
        initEvents();
        Manage.init();
    },0);
    var shopId = common.getParams()['shopId'];

    /**========= 初始调用 ==========**/

    /**
     * 初始化控制
     * @method initControl
     */
    var oProductArr = [
        {type:'MP-sale',user_id: params.userid,url:params.url,cook_id:params.cookid},
        {type:'MP-Sold Out',user_id: params.userid,url:params.url,cook_id:params.cookid},
        {type:'MP-classify',user_id: params.userid,url:params.url,cook_id:params.cookid}
    ];
    function initControl(){
        Vue.filter('dateFormat',function(date){
            return Calendar.getInstance(date).format('yyyy-MM-dd');
        });
        vueObj = new Vue({
            el:'#vue-tmplateid',
            replace: false,
            template: "#tab_content_template",
            data:{
                sellingItems:window.sellingItems?window.sellingItems:[],
                offlineItems:[],
                classifyItems:[],
                showEdit:false
            }
        });
        $('.tab_body_page').eq(0).show();
        tab = $('.mshop-manage').tab({
            items: [
                {
                    title: '销售中',
                    url: '/products/indextab',
                    render: function (data, index, $dom, isLoadMore) {
                        loading = false;
                        render(data, index , $dom, isLoadMore, 'sellingItems', 1);
                        // AppInterface.buried( 'B000W004','销售中',oProductArr[0]);
                        // AppInterface.call('/common/statistics', {
                        //     code: 'B000W004',
                        //     name: '销售中',
                        //     type:'MP-Sold Out',
                        //     user_id: base64.encode(params.userid),
                        //     url:base64.encode(params.url),
                        //     cook_id:base64.encode(params.cookid)
                        // });
                        AppInterface.call('/common/statistics', {
                            code: encodeURIComponent('B000W004'),               
                            desc: encodeURIComponent(JSON.stringify(
                                {name:'销售中',type:'MP-sale',user_id: params.userid,url:params.url,cook_id:params.cookid}
                            ))
                        });    
                    },
                    params:{
                        type:1,
                        shopId:shopId
                    }
                },{
                    title: '已下架',
                    url: '/products/indextab',
                    render: function (data, index, $dom, isLoadMore) {
                        loading = false;
                        var sateState =  -1;
                        render(data, index , $dom, isLoadMore, 'offlineItems', sateState);
                        // AppInterface.buried( 'B000W004','已下架',oProductArr[1]);
                        // AppInterface.call('/common/statistics', {
                        //     code: 'B000W004',
                        //     name: '已下架',
                        //     type:'MP-Sold Out',
                        //     user_id: base64.encode(params.userid),
                        //     url:base64.encode(params.url),
                        //     cook_id:base64.encode(params.cookid)
                        // });
                        AppInterface.call('/common/statistics', {
                            code: encodeURIComponent('B000W004'),               
                            desc: encodeURIComponent(JSON.stringify(
                                {name:'已下架',type:'MP-Sold Out',user_id: params.userid,url:params.url,cook_id:params.cookid}
                            ))
                        });     
                    },
                    params:{
                        type:0,
                        shopId:shopId
                    }
                },{
                    title: '分类',
                    url: '/products/catelist',
                    render: function (data, index, $dom, isLoadMore) {
                        loading = false;
                        if(isLoadMore)
                            return;
                        render(data, index , $dom, isLoadMore, 'classifyItems', 1);
                        // AppInterface.buried( 'B000W004','分类',oProductArr[2]);
                        // AppInterface.call('/common/statistics', {
                        //     code: 'B000W004',
                        //     name: '分类',
                        //     type:'MP-classify',
                        //     user_id: base64.encode(params.userid),
                        //     url:base64.encode(params.url),
                        //     cook_id:base64.encode(params.cookid)
                        // });
                        AppInterface.call('/common/statistics', {
                            code: encodeURIComponent('B000W004'),               
                            desc: encodeURIComponent(JSON.stringify(
                                {name:'分类',type:'MP-classify',user_id: params.userid,url:params.url,cook_id:params.cookid}
                            ))
                        });     
                    },
                    params:{
                        vshopId:shopId
                    }
                }
            ],
            loadMoreSelector: '.loadmore', //加载更多元素选择器
            isServerFlush:true,
            isSwitchFresh:true,
            isSameFresh:false,
            index: 0 //默认选中哪个页签
        });
        tab.fetchData(1);
    }

    /**
     * 初始化事件
     * @method initEvents
     */
    function initEvents(){
        $('.mshop-manage').on('click','li>span.sort',function(){
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
        }).on('click','a.offlineDeleteBtn',function(){
            AppInterface.notify('onOfflineDelete',$(this).parent().attr('data-prdid'));
        }).on('click','a#createClassBtn',function(){
            AppInterface.notify('onCreateClass');
        }).on('click','a#modifyClassStartBtn',function(){
            AppInterface.notify('onModifyStartClass');
        }).on('click','#classifyDoneBtn',function(){
            AppInterface.notify('onClassifyDone');
        }).on('click','.modifyClassBtn',function(){
            var $li = $(this).parent().parent();
            AppInterface.notify('onModifyClass',$li.attr('data-classid'),$('h3',$li).html());
        }).on('click','.deleteClassBtn',function(){
            AppInterface.notify('onDeleteClass',$(this).parent().parent().attr('data-classid'));
        }).on('click','ul.mshop-sort-ul>li',function(){
            AppInterface.notify('onIntoClass',$(this).attr('data-classid'),$(this).attr('data-classname'));
        }).on('click','.tab_body>section:nth-child(1)>ul.common-prolist>li>dl',function(){
            AppInterface.notify('onProductClick',$(this).parent().attr('data-prdid'), shopId);
        });
        /*.on('click','.addProductBtn',function(){
            AppInterface.open(base64.encode(basepath+$(this).attr('data-href')));
        })*/

        /* 添加新协议. */
        // $('.mshop-manage').on('click', '.addProductBtn', function(e) {
        //     e.preventDefault();

        //     var origin = location.protocol + '//' + location.host;
            
        //     AppInterface.call('/product/addProduct', {url: base64.encode(origin + '/distribution/index')});
        // });
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
    function render(data, index , $dom, isLoadMore, dataListKey, sateState){
        var i = 0, itemList = dataListKey=='classifyItems'?data: data.itemList, len = itemList.length;
        if(!isLoadMore){
            $dom.find('[data-type=server]').remove();
            vueObj[dataListKey] = [];
        }
        if(len > 0) {
            noMoreData = false;
        }
        if(len === 0 &&  sateState != -1 && !noMoreData) {
            AppInterface.toast('没有更多商品！');
            noMoreData = true;
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
            AppInterface.subscribe('onClassify',function(id){
                that.classify(id);
            }).subscribe('onDelete',function(id){
                that.delete(id);
            }).subscribe('onCopyLink',function(id,title){
                that.copyLink(id,title);
            }).subscribe('onShare',function(id,price,title,imgUrl){
                that.share(id,price,title,imgUrl);
            }).subscribe('onOfflineDelete',function(id){
                that.offlineDelete(id);
            }).subscribe('onCreateClass',function(){
                that.createClass();
            }).subscribe('onModifyStartClass',function(){
                that.modifyStartClass();
            }).subscribe('onClassifyDone',function(){
                that.classifyDone();
            }).subscribe('onModifyClass',function(id, name){
                that.modifyClass(id, name);
            }).subscribe('onDeleteClass',function(id){
                that.deleteClass(id);
            }).subscribe('onIntoClass',function(id,name){
                that.intoClass(id,name);
            }).subscribe('onProductClick',function(productId, shopId){
                //此处跳XPOP商品详情页
                AppInterface.call('/product/detail', {productId: productId,shopId: shopId});
            }).subscribe('onRefresh',function(){
                tab.select(0,true);
            });
        },
        /**
         * 分类至
         * @param id
         */
        classify:function(id){
            Ajax.query('/products/shopcategory',{itemId:id,shopId:shopId},function(json){
               if(json.success){
                   AppInterface.call('/shop/classify',{productIds:[id],categoryId:json.data.categoryId},function(data){
                       if(data.success)
                           tab.refresh(0);
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
            var that = this;;
            AppInterface.confirm('删除后，商品将会彻底消失～',function(data) {
                if (data.success && !data.data.isCancel) {
                    Ajax.update('/products/del', {vshopId: shopId, productId: id}, function (data) {
                        if (data && !data.success) {
                            AppInterface.toast(data.message);
                            return;
                        }
                        var items = that.findItems(vueObj.sellingItems, 'id', id);
                        AppInterface.toast('商品已删除');
                        items.length > 0 && vueObj.sellingItems.$remove(items[0]);
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
                    skuser_id:'',
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
         * 删除下架商品
         * @param id
         */
        offlineDelete: function (id) {
            var that = this;
            AppInterface.confirm('删除后，商品将会彻底消失～',function(data){
                if(data.success && !data.data.isCancel) {
                    Ajax.update('/products/del', {vshopId: shopId, productId: id}, function (data) {
                        if (data && !data.success) {
                            AppInterface.toast(data.message);
                            return;
                        }
                        var items = that.findItems(vueObj.offlineItems, 'id', id);
                        AppInterface.toast('商品已删除');
                        items.length > 0 && vueObj.offlineItems.$remove(items[0]);
                    });
                }
            });

            return this;
        },
        /**
         * 新建分类
         */
        createClass: function () {
            var sortLength = $('.mshop-sort-ul > li').size();

            if(sortLength >= 31) {
                AppInterface.toast('分类最多创建30个！');
                return;
            }

            AppInterface.prompt('新建分类名称', name, function(data){
                if(data.success && !data.data.isCancel){
                    Ajax.update('/products/addcate',{vshopId:shopId, vcategoryName:data.data.content},function(json){
                        if(!json.success){
                            AppInterface.toast(json.message);
                            return;
                        }
                        AppInterface.toast('新建分类成功');
                        vueObj.classifyItems.push({
                            'vcategoryName':data.data.content,
                            'vcategoryId':json.data.vcategoryId,
                            'countByVcategory':0
                        });
                    });
                }
            });
        },
        /**
         * 进入编辑分类模式
         * @param id
         */
        modifyStartClass: function () {
            $('#shop_btn').animate({bottom:'-1rem'},200).siblings().animate({bottom:0},200);
            vueObj.showEdit = true;
        },
        /**
         * 编辑分类名称
         * @param id
         */
        modifyClass:function(id , name){
            var that = this;
            AppInterface.prompt('编辑分类名称', name, function(data){
                if(data.success && !data.data.isCancel){
                   Ajax.update('/products/editcate',{vshopId:shopId, vcategoryId:id, vcategoryName:data.data.content},function(json){
                       if(!json.success){
                           AppInterface.toast(json.message);
                           return;
                       }
                       AppInterface.toast('修改分类成功');
                       var items = that.findItems(vueObj.classifyItems,'vcategoryId',id);
                       items[0].vcategoryName = data.data.content;
                   });
               }
            });
        },
        /**
         * 删除分类
         * @param id
         */
        deleteClass:function(id){
            var that = this;
            AppInterface.confirm('请确认是否删除','该分类下的商品将会移动到未分类中',function(data){
               if(data.success && !data.data.isCancel){
                   Ajax.update('/products/delcate',{vshopId:shopId, vcategoryId:id},function(data){
                       if(data && !data.success){
                           AppInterface.toast(data.message);
                           return;
                       }
                       var items = that.findItems(vueObj.classifyItems,'vcategoryId',id);
                       AppInterface.toast('删除成功');
                       items.length>0 && vueObj.classifyItems.$remove(items[0]);
                       tab.refresh(2);
                   });
               }
            });

            return this;
        },
        /**
         * 编辑分类完成
         */
        classifyDone: function () {
            $('#classifyDoneBtn').animate({bottom:'-1rem'},200).siblings().animate({bottom:0},200);
            vueObj.showEdit = false;
        },
        /**
         * 进入分类列表页
         */
        intoClass:function(id,name){
            !vueObj.showEdit && (location.href = '/products/cateprolist?roleId=1&shopId='+shopId+'&categoryId='+id+'&categoryName='+name);
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

    //增加滚动预加载
    var loading = false;
    $(window).scroll(function(){
        if(($(window).scrollTop()+$(window).height()/2)>=$(document).height()-($(window).height()) && !loading){
            loading = true;
            tab.fetchData(tab.getSelectIndex(),true);
        }
    });
});