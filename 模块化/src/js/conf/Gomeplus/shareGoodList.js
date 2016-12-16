/**
 * Created by shenchao on 2016/7/14.
 */
define('conf/Gomeplus/shareGoodList.js', function(require, exports, module){
    var $ = require('$');
    var appInterface = require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    var dropload = require('vendors/dropload');
    var doT = require('vendors/doT.js');

    var canLoad = true;
    var pageNum = 1;

    var goodsListTpl = $('#goodslist').text();

    var wapHosts;
    var curUrl = location.href;

    var canShare = true;

    /* 分享手机站环境host. */
    if(curUrl.match(/h5\-pre/)) {
        wapHosts = 'https://m-pre.gomeplus.com/';
    } else if(curUrl.match(/h5\.test/)) {
        wapHosts = 'http://m.test.gomeplus.com/';
    } else if(curUrl.match(/h5\.dev/)) {
        wapHosts = 'http://m.dev.gomeplus.com/';
    } else {
        wapHosts = 'https://m.gomeplus.com/'
    }

    /* 更多(跳到更多挣外快). */
    $('.more').tap(function () {
        appInterface.call('/promotion/earnMoney');
    });

    /* 详情. */
    $(document).on('tap', '.goods-img-cont, .goods-main-tl', function () {
        var $iconShares = $(this).closest('li').find('.icon-shares');
        var productId = $iconShares.data('id');
        var shopId = $iconShares.data('shopid');

        appInterface.call('/common/productDetail', {
            productId: encodeURIComponent(productId),
            shopId:encodeURIComponent(shopId)
        });
    });

    /* 分享返利. */
    $(document).on('tap', '.icon-shares', function () {
        if(canShare) {
            canShare = false;

            var title = $(this).data('title');
            var imgurl = $(this).data('img');
            var productId = $(this).data('id');
            var shopId = $(this).data('shopid');
            var curPrice = $(this).data('curprice');
            var proPrice = $(this).data('proprice');
            // var link;
            var kid;

            /* 取得kid. */
            $.ajax({
                type: 'post',
                url: '/playgomeplus/getShareKid',
                dataType: 'json',
                data: {
                    itemId: productId,
                    shopId: shopId
                },
                success: function (data) {
                    canShare = true;

                    if(data) {
                        kid = data;
                        // link = wapHosts + 'product/index?productId=' + productId + '&shopId=' + shopId + '&kid=' + kid;
                        //
                        // console.log(link);

                        appInterface.call('/share/product', {
                            productId: encodeURIComponent(productId),
                            shopId: encodeURIComponent(shopId),
                            kId: encodeURIComponent(kid),
                            productName: encodeURIComponent(title),
                            imageUrl: encodeURIComponent(base64.encode(imgurl)),
                            price: encodeURIComponent(proPrice),
                            rebatePrice: encodeURIComponent(curPrice)
                        });
                    } else {
                        appInterface.toast('取得返利id失败！');
                    }
                },
                error: function () {
                    canShare = true;
                    appInterface.toast('取得返利id失败！');
                }
            });
        }
    });

    /* 下来加载. */
    $('body').dropload({
        loadDownFn: function(me) {
            var lastRecordId;
            if(canLoad) {
                canLoad = false;

                lastRecordId = $('.icon-shares:last-child').data('id');

                $.ajax({
                    type: 'get',
                    url: '/playgomeplus/morGoodList',
                    dataType: 'json',
                    data: {
                        pageNum: ++pageNum,
                        lastRecordId: lastRecordId
                    },
                    success: function(data) {
                        console.log(data);

                        if(data  && data.length > 0) {
                            var $goodsList = $('.goods-list');
                            var pagefn = doT.template(goodsListTpl, undefined);
                            var oldData = $goodsList.html();

                            $goodsList.html(oldData + pagefn(data));
                        } else {
                            appInterface.toast('没有数据了！');
                        }

                        canLoad = true;
                    },
                    error: function (xhr, errorType, error) {
                        appInterface.toast('请求失败！');
                        canLoad = true;
                    }
                });
            }

            me.resetload();
        }
    });
});