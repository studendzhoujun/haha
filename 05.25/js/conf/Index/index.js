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

    //图片懒加载
    require('vendors/lazyload.js');
    $("img").picLazyLoad({effect: "fadeIn"});
    var common = require('lib/common.js');
    var base64 = require('utils/base64.js');
    var Vue = require('vendors/vue.js');
    var dropload = require('vendors/dropload.js');
    var touchSlide = require('vendors/TouchSlide.js');
    var Ajax = require('utils/ajax.js');
    var shopId = common.getParams()['shopId'];
    var Replace = require('mods/replace.js');
    Replace.wordLimit($('p.foryou-shop-font1'));
    var FastClick = require('vendors/fastclick.js');
    var storage=require('mods/storage.js');
    FastClick.attach(document.body);

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
        AppInterface.call('/common/statistics', {
            code: 'M000W000',
            desc: '顶部通栏广告位',
            param: base64.encode(JSON.stringify({data: topBannerS[dataType], id: dataValue}))
        });

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
        AppInterface.call('/common/statistics', {
            code: 'M000W003',
            desc: '国美+精选',
            param: base64.encode(JSON.stringify(testType(dataType, dataValue)))
        });

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
        AppInterface.call('/common/statistics', {
            code: 'M000W004',
            desc: '特色市场',
            param: base64.encode(JSON.stringify(testType(dataType, dataValue)))
        });
    });
    //查看为你推荐
    $('body').on('click', '.Index-foryou a.foryou-product', function () {
        var datashopid = $(this).attr('data-shopid');
        var dataproductid = $(this).attr('data-productid');
        var dataValue = $(this).attr('data-value');
        var dataType = '0';
        console.log(dataType, dataValue, datashopid, dataproductid);
        gotoWhere(dataType, dataValue, datashopid, dataproductid);
        AppInterface.call('/common/statistics', {
            code: 'M000W005',
            desc: '为你推荐',
            param: base64.encode(JSON.stringify({shopId: datashopid, productId: dataproductid}))
        });

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
    $('.Index-nav a').eq(0).on('click', function () {
        AppInterface.call('/list/couponcenter');
        AppInterface.call('/common/statistics', {
            code: 'M000W001',
            desc: '综合入口位',
            param: base64.encode(JSON.stringify({shopId: navNames[0]}))
        });
    });

     
    function isLogin(dataValue){
            if(userId==0){  //未登录,先注销再调登录
                AppInterface.call('/common/logout',function(data){
                     if(data.success){
                         AppInterface.call('/common/login',function(data){
                              if(data.success){
                                    userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                    storage.setCookie('userId',data.data.userId);
                                    storage.setCookie('token',data.data.token);
                                    if(dataValue && dataValue != '#'){           
                                          gotoWhere('2', dataValue);
                                     }
                                    
                                }
                         })
                     }
                })
            }else{  //userId 有值
                if(dataValue && dataValue != '#'){           
                   gotoWhere('2', dataValue);
                }
            }
    }

   /* function goJump(){
        if(dataValue && dataValue != '#'){           
            gotoWhere(2, dataValue);
        }
    }   */
     
    $('.Index-nav a').eq(1).on('click', function () {
        var dataValue = $(this).attr('data-href');
        isLogin(dataValue);            
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
        var dataValue = $(this).attr('data-href');
        if(dataValue && dataValue != '#'){
            gotoWhere('2', dataValue);
        }else{
            AppInterface.call('/promotion/event');
        }
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