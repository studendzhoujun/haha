/**
 * gome+首页
 * @zhoujun
 * @2016.02.26
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
 data-config="config.js"
 data-debug="true"
 data-main="conf/Index/index.js">
 </script>
 */
define('conf/Index/index.js', function (require, exports, module) {
    require('$');
    require('utils/appInterface.js');
    require('mods/buried.js');
    var common = require('lib/common.js');
    var base64 = require('utils/base64.js');
    var Vue = require('vendors/vue.js');
    var dropload = require('vendors/dropload.js');
    var touchSlide = require('vendors/TouchSlide.js');
    var Ajax = require('utils/ajax.js');
    var shopId = common.getParams()['shopId'];
    AppInterface.buried('P000W000','国美+');
    function banner() {
        touchSlide.TouchSlide({
            slideCell: "#slider",
            titCell: "#hd ul",
            mainCell: "#bd ul",
            effect: "leftLoop",
            timeout: 5000,
            autoPage: true,
            autoPlay: true
        });
        $('.heilogin li img').show();
    }
    try{
        banner();
    }catch(e){}


   function getEleData(ele){
        return {
            dataValue:ele.attr('data-value'),
            dataType:ele.attr('data-type'),
            dataproductid:ele.attr('data-productid'),
            datashopid:ele.attr('data-shopid')
        };
   }

    //function gotoWhere(dataType,dataValue,datashopid,dataproductid) {
    function gotoWhere(data) {
        var type = {
            0:['/product/detail',{shopId: data.datashopid, productId: data.dataproductid}],
            1:['/shop/detail', {shopId:data.dataValue}],
            2:['/common/localJump', {url: base64.encode(data.dataValue)}],
            3:['/list/category',{categoryId: data.dataValue}],
            4:['/search/search',{keyWord: data.dataValue}]
        };
        var params = type[data.dataType];
        if(!params){
            params
        }
        AppInterface.call(params[0],params[1]);
    }

    //页面所有imgonerr
    /* var aImg=document.querySelectorAll('img');
     for(var i=0;i<aImg.length;i++){
     aImg[i].onerror=function(){
     this.src='__PUBLIC__/images/default_product.png';
     }
     }*/

    function testType(dataType, dataValue) {
        if (dataType == 0) {
            return {shopId: dataValue};
        } else if (dataType == 1) {
            return {productId: dataValue};
        } else {
            return {};
        }
    }

    //tab切换
    var topBannerS = ['ad-shop', 'ad-Product', 'ad-marketing', 'ad-other'];
    $('#bd').on('click', 'li', function () {
        var data = getEleData($(this));
        gotowhere(data);
        AppInterface.call('/common/statistics', {
            code: 'M000W000',
            desc: '顶部通栏广告位',
            param: base64.encode(JSON.stringify({data: topBannerS[data.dataType], id: data.dataValue}))
        });

    });
    //查看国美＋精选
    $('body').on('click', '.Index-gome a', function () {
        //var dataValue = $(this).attr('data-value');
        //var dataType = $(this).attr('data-type');
        var data = getEleData($(this));
        gotowhere(data);
        //gotoWhere(dataType, {shopid:dataValue});
        AppInterface.call('/common/statistics', {
            code: 'M000W003',
            desc: '国美+精选',
            param: base64.encode(JSON.stringify(testType(dataType, dataValue)))
        });

    });
    //查看特色市场
    $('body').on('click', '.Index-market a', function () {
        //var dataValue = $(this).attr('data-value');
        //var dataType = $(this).attr('data-type');
        var data = getEleData($(this));
        gotowhere(data);
        //gotoWhere(dataType,dataValue,datashopid,dataproductid)
        AppInterface.call('/common/statistics', {
            code: 'M000W004',
            desc: '特色市场',
            param: base64.encode(JSON.stringify(testType(dataType, dataValue)))
        });
    });
    //查看为你推荐
    $('body').on('click', '.Index-foryou a', function () {
      /*  var datashopid = $(this).attr('data-shopid');
        var dataproductid = $(this).attr('data-productid');
        var dataValue = $(this).attr('data-value');
        var dataType = '1';*/
        var data = getEleData($(this));
         gotowhere(data);
        //gotoWhere(dataType, {shopId: datashopid, productId: dataproductid});
        AppInterface.call('/common/statistics', {
            code: 'M000W005',
            desc: '为你推荐',
            param: base64.encode(JSON.stringify({shopId: datashopid, productId: dataproductid}))
        });

    });
    //查看ad店铺
    $('body').on('click', '.Index-adshop a', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = $(this).attr('data-shopid')?'0':'1';
       /* var parent=this.parentNode();
        var firstNode=this.parentNode.firstNode;*/
        var datashopid=$(this).parent().find('a').eq(0).attr('data-shopid');
        var dataproductid=$(this).attr('data-id');
        gotoWhere(dataType, {shopId: datashopid, productId: dataproductid});
    })

    $('a').each(function () {
        var $a = $(this), href = $a.attr('href');
        $a.attr('data-href', href).attr('href', 'javascript:void(0)');
    });

    //nav综合入口位
    var navNames = ['ce-qiangjuan', 'ce-licai', 'ce-xiaodian', 'ce-haohuo', 'ce-fanli', 'ce-cuxiao', 'ce-kaidian', 'ce-shangpin'];
    $('.Index-nav a').eq(0).on('click', function () {
        AppInterface.call('/list/couponcenter');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[0]}))
        });
    });
    $('.Index-nav a').eq(1).on('click', function () {
        AppInterface.call('/list/financial');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[1]}))
        });

    });
    $('.Index-nav a').eq(2).on('click', function () {
        AppInterface.call('/list/shopping');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[2]}))
        });

    });
    $('.Index-nav a').eq(3).on('click', function () {
        AppInterface.call('/list/kindpro');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[3]}))
        });

    });
    $('.Index-nav a').eq(4).on('click', function () {
        AppInterface.call('/list/lookcheap');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[4]}))
        });

    });
    $('.Index-nav a').eq(5).on('click', function () {
        AppInterface.call('/promotion/event');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[5]}))
        });

    });
    $('.Index-nav a').eq(6).on('click', function () {
        AppInterface.call('/mine/shop');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[6]}))
        });

    });
    $('.Index-nav a').eq(7).on('click', function () {
        AppInterface.call('/list/category', {categoryId: 1});
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[7]}))
        });

    });

    //给Index-adshop下面的第三，第四个a改class
    function changeClass() {
        $('.Index-adshop a').eq(10).addClass('adshop-products1');
        $('.Index-adshop a').eq(11).addClass('adshop-products2');
    }

    //vue渲染
    var vueObj = new Vue({
        el: '#vue-tmp',
        data: {
            items: [],
            showEdit: false
        }
    });
    /* Vue.nextTick(function(){
     changeClass();
     });*/
    function fetchData(pageNum) {
        Ajax.query('/index/recomends', {pageNum: pageNum}, function (data) {
            if (data.success) {
                var item = {
                    shopItemsOne: {
                        frontshop: [],
                        backshop: {
                            shop: [],
                            product: []
                        }
                    },
                    shopItemsTwo: {
                        frontshop: [],
                        backshop: {
                            shop: [],
                            product: []
                        }
                    }
                };
                var dataAll = data.data.productList;  //[{},{},{}]
                var dataS = data.data.shopList[0].product;//[{},{}]
                var dataS2 = data.data.shopList[1].product;
                var dataP = data.data.shopList[0];   //{product:[{},{}],sn:'',}
                var dataP2 = data.data.shopList[1];  //{}
                var frontshop = [];
                var frontshop2 = [];
                var backshop = [];
                var backshop2 = [];
                for (var i = 0; i < 6; i++) {
                    frontshop.push(dataAll[i]);
                }
                for (var i = 6; i < 12; i++) {
                    frontshop2.push(dataAll[i]);
                }
                for (var i = 0; i < dataS.length; i++) {
                    backshop.push(dataS[i]);
                    backshop2.push(dataS2[i]);
                }
                item.shopItemsOne.frontshop = frontshop;
                item.shopItemsOne.backshop.product = backshop;
                item.shopItemsOne.backshop.shop = dataP;
                item.shopItemsTwo.frontshop = frontshop2;
                item.shopItemsTwo.backshop.product = backshop2;
                item.shopItemsTwo.backshop.shop = dataP2;
            }
            vueObj.items.push(item);
            /* vueObj.nextTick(function(){
             changeClass();
             });*/
        });
    }

    var pageNum = 0;
    var droploadDown = $('body').dropload({
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domUpdate: '<div class="dropload-update">↓释放加载</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        loadDownFn: function (me) {
            setTimeout(function () {
                me.resetload();
                pageNum++;
                fetchData(pageNum);
            }, 500);
        }
    });
    var droploadUp = $('body').dropload({
        domUp: {
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
            domUpdate: '<div class="dropload-update">↑释放更新</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        loadUpFn: function (me) {
            setTimeout(function () {
                me.resetload();
                location = location;
            }, 500);
        }
    });
    /*     AppInterface.subscribe('onRefresh',function(){
     location = location;
     }).subscribe('onLoadMore',function(){
     pageNum++;
     fetchData(pageNum);
     });*/

    //广告位埋点
    $('.ab a ').click(function(){
        AppInterface.call('/common/statistics', {
            code: 'M000W002',
            desc: '广告位',
            param: base64.encode(JSON.stringify({shopId: 'ad-marketing'}))
        });
    });

    // 为你推荐
    $('.adshop-shopdetail a ').click(function(){
        var datashopid = $(this).attr('data-shopid');
        AppInterface.call('/common/statistics', {
            code: 'M000W005',
            desc: '为你推荐',
            param: base64.encode(JSON.stringify({shopId: datashopid}))
        });
    });
     $('.adshop-products a ').click(function(){
        var dataproductid = $(this).attr('data-productid');
        AppInterface.call('/common/statistics', {
            code: 'M000W005',
            desc: '为你推荐',
            param: base64.encode(JSON.stringify({ productId: dataproductid}))
        });
    });

});