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
    var FastClick = require('vendors/fastclick.js');
    var storage=require('mods/storage.js');
    FastClick.attach(document.body);
    console.log('%cstudentzhoujun', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;'); 
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
        if($('#bd ul>li').length >= 2)
            banner();
    }catch(e){}

    function gotoWhere(dataType, dataValue, datashopid, dataproductid,dataActivitytitle,dataActivitydesc,dataActivityimg,dataActivitylink) {
        dataType += '';
        switch (dataType) {
            case '1':
                AppInterface.call('/shop/detail', {shopId: datashopid});
                break;
            case '0':
                AppInterface.call('/product/detail', {shopId: datashopid, productId: dataproductid});
                break;
            case '2':
                AppInterface.call('/common/localJump', {url: base64.encode(dataValue)});
                break;
            case '3':
                AppInterface.call('/list/category', {categoryId: dataValue});
                break;
            case '4':
                AppInterface.call('/search/search', {keyWord: dataValue});
                break;
             case '6':
                AppInterface.call('/common/localJump', {type:'2', url: base64.encode(dataValue), title: dataActivitytitle
                    , desc: dataActivitydesc, imgUrl: base64.encode(dataActivityimg),shareUrl:base64.encode(dataActivitylink)});
                break;
        }
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
        var dataType = $(this).attr('data-type');
        var dataValue = $(this).attr('data-value');
        var dataActivitytitle = $(this).attr('data-activitytitle');
        var dataActivitydesc = $(this).attr('data-activitydesc');
        var dataActivityimg = $(this).attr('data-activityimg');
        var dataActivitylink = $(this).attr('data-activitylink');
        if(dataType==1){
            console.log(dataType,dataValue)
            gotoWhere(dataType,null ,dataValue,null);
        }else if(dataType==0){
            console.log(dataType,dataValue)
            gotoWhere(dataType, null,0,dataValue)
        }else if(dataType==6){
            gotoWhere(dataType, dataValue, null, null, dataActivitytitle,dataActivitydesc,dataActivityimg,dataActivitylink)
        }
        else{
            gotoWhere(dataType,dataValue);
        }
    });
    //查看国美＋精选
    $('body').on('click', '.Index-gome a', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = $(this).attr('data-type');
        if(dataType==0){
            gotoWhere(dataType, null,0,dataValue);
            console.log(dataType,null,0,dataValue);
        }else if(dataType==1){
            gotoWhere(dataType,null ,dataValue,null);
            console.log(dataType,null ,dataValue,null);
        }else{
            gotoWhere(dataType,dataValue);
            console.log(dataType,dataValue);
        }
    });
    //查看特色市场
    $('body').on('click', '.Index-market a', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = $(this).attr('data-type');
        if(dataType==0){
            gotoWhere(dataType, null,0,dataValue);
            console.log(dataType,null,0,dataValue);
        }else if(dataType==1){
            gotoWhere(dataType,null ,dataValue,null);
            console.log(dataType,null ,dataValue,null);
        }else{
            gotoWhere(dataType,dataValue);
            console.log(dataType,dataValue);
        }   
    });
    //查看为你推荐
    $('body').on('click', '.Index-foryou a.foryou-product', function () {
        var datashopid = $(this).attr('data-shopid');
        var dataproductid = $(this).attr('data-productid');
        var dataValue = $(this).attr('data-value');
        var dataType = '0';
        console.log(dataType, dataValue, datashopid, dataproductid);
        gotoWhere(dataType, dataValue, datashopid, dataproductid);
    });
    //查看ad店铺
    $('body').on('click', '.Index-adshop a.adshop-shopdetail', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = '1';
        var datashopid=$(this).parent().find('a').eq(0).attr('data-shopid');
        var dataproductid=$(this).attr('data-id');
        console.log(dataType+','+dataValue+','+datashopid+','+dataproductid)
        gotoWhere(dataType, dataValue, datashopid, dataproductid);

        if(dataType == '0'){
            dataValue = datashopid;
            AppInterface.call('/common/statistics', {
                code: 'M000W005',
                desc: '为你推荐',
                param: base64.encode(JSON.stringify({productId: dataValue}))
            })
        }else if(dataType == '1'){
            dataValue = dataproductid;
            AppInterface.call('/common/statistics', {
                code: 'M000W005',
                desc: '为你推荐',
                param: base64.encode(JSON.stringify({shopId: dataValue}))
            })
        }


    }).on('click', '.Index-adshop a.adshop-shop-product', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = 0;
        var datashopid=$(this).parent().find('a').eq(0).attr('data-shopid');
        var dataproductid=$(this).attr('data-id');
        console.log(dataType+','+dataValue+','+datashopid+','+dataproductid)
        gotoWhere(dataType, dataValue, datashopid, dataproductid);

        if(dataType == '0'){
            dataValue = datashopid;
            AppInterface.call('/common/statistics', {
                code: 'M000W005',
                desc: '为你推荐',
                param: base64.encode(JSON.stringify({productId: dataValue}))
            })
        }else if(dataType == '1'){
            dataValue = dataproductid;
            AppInterface.call('/common/statistics', {
                code: 'M000W005',
                desc: '为你推荐',
                param: base64.encode(JSON.stringify({shopId: dataValue}))
            })
        }


    }).on('click', '.gomeIndex>a.ad', function () {
        var dataValue = $(this).attr('data-href');
        var dataType = $(this).attr('data-type');
        gotoWhere(dataType, dataValue);
    });


    //nav综合入口位
    var navNames = ['ce-qiangjuan', 'ce-licai', 'ce-xiaodian', 'ce-haohuo', 'ce-fanli', 'ce-cuxiao', 'ce-kaidian', 'ce-shangpin'];
    $('.Index-nav a').click(function(){
        var index=$(this).index();
        switch(index){
            case 0:
               AppInterface.call('/list/couponcenter');
            break;
            case 1:
               console.log(1)
            break;
            case 2:
                AppInterface.call('/list/shopping');
            break;
            case 3:
                AppInterface.call('/list/kindpro');
            break;
            case 4:
               AppInterface.call('/list/lookcheap');
            break;
            case 5:
               console.log(5)
            break;
            case 6:
              AppInterface.call('/mine/shop');
            break;
            case 7:
               AppInterface.call('/list/category', {categoryId: 1});
            break;

        }
    });
    //给Index-adshop下面的第三，第四个a改class
    function changeClass() {
        $('.Index-adshop a').eq(10).addClass('adshop-products1');
        $('.Index-adshop a').eq(11).addClass('adshop-products2');
    }

    //vue渲染
    var vueObj = new Vue({
        el: '#vue-tmp',
        replace: true,
        template: "#recommand_list_template",
        data: {
            items: [],
            showEdit: false
        }
    });
    /* Vue.nextTick(function(){
     changeClass();
     });*/
    var firstNoData = true;
    function fetchData(flag) {
        if(!firstNoData){
            loading = false;
            flag && AppInterface.toast('没有更多数据了');
            return;
        }
        Ajax.query('/index/recomends', {pageNum: pageNum}, function (data) {
            if (data.success) {
                var dataAll = data.data.productList;  //[{},{},{}]//所有的两组12个商品，分6个一组
                //data.data不存在或者  （（商品列表不存在或长度为0）且（推荐店铺不存在或长度为0））
                if(!data.data || ( (!dataAll || dataAll.length == 0) && (!data.data.shopList || data.data.shopList.length == 0 )) ){
                    //AppInterface.toast('没有更多数据了');
                    pageNum--;
                    firstNoData = false;
                    loading = false;
                    return;
                }
                var item = {
                    shopItemsOne: {
                        frontshop: function(){
                            var tmp = [];
                            for (var i = 0; i < (dataAll.length>6?6:dataAll.length); i++) {
                                tmp.push(dataAll[i]);
                            }
                            return tmp;
                        }(),
                        backshop: {
                            shop: data.data.shopList[0],
                            product: function(){
                                var tmp = [];
                                if(data.data.shopList[0] && data.data.shopList[0].product){
                                    var dataArray = data.data.shopList[0].product;
                                    for (var i = 0; i < (dataArray.length > 3 ? 3 : dataArray.length); i++) {
                                        tmp.push(dataArray[i]);
                                    }
                                }
                                return tmp;
                            }()
                        }
                    },
                    shopItemsTwo: {
                        frontshop: function(){
                            var tmp = [];
                            for (var i = 6; i < (dataAll.length>6?dataAll.length:6); i++) {
                                tmp.push(dataAll[i]);
                            }
                            return tmp;
                        }(),
                        backshop: {
                            shop: data.data.shopList[1],
                            product: function(){
                                var tmp = [];
                                if(data.data.shopList[1] && data.data.shopList[1].product){
                                    var dataArray = data.data.shopList[1].product;
                                    for (var i = 0; i < (dataArray.length>3 ? 3 : dataArray.length); i++) {
                                        tmp.push(dataArray[i]);
                                    }
                                }
                                return tmp;
                            }()
                        }
                    }
                };
            }
            vueObj.items.push(item);
            loading = false;
        });
    }
    var loading = false;
    var pageNum = 0;
    var droploadDown = $('body').dropload({
        loadDownFn: function (me) {
            setTimeout(function () {
                me.resetload();
                pageNum++;
                loading = true;
                fetchData(true);
            }, 500);
        }
    });
    $(window).scroll(function(){
        if(($(window).scrollTop()+$(window).height()/2)>=$(document).height()-($(window).height()) && !loading){
            pageNum++;
            loading = true;
            fetchData();

        }
    });
    var droploadUp = $('body').dropload({
        loadUpFn: function (me) {
            setTimeout(function () {
                me.resetload();
                location.reload(true);
            }, 500);
        }
    });

    AppInterface.subscribe('onPullDown', function () {
        location.reload(true);
    }).subscribe('onPullUp', function () {
        pageNum++;
        fetchData(true);
    });

});