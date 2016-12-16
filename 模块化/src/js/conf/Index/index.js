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
    var touchSlide = require('vendors/TouchSlide_gm.js');
    var Ajax = require('utils/ajax.js');
    var shopId = common.getParams()['shopId'];
    var Replace = require('mods/replace.js');
    Replace.wordLimit($('p.foryou-shop-font1'));
    var FastClick = require('vendors/fastclick.js');
    var storage = require('mods/storage.js');
    FastClick.attach(document.body);

    /* cookie临时写入此域名. */
    var cookieDomain = '.gomeplus.com';

    /* 取得当前版本号. */
    function getVersion() {
        // var commonParams = storage.getCookie('CommonParams') || storage.getCookie('commonParams') || storage.getCookie('commonParam');
        var commonParams;

        if(storage.getCookie('CommonParams')) {
            commonParams = storage.getCookie('CommonParams');
        } else if(storage.getCookie('commonParams')) {
            commonParams = storage.getCookie('commonParams');
        } else {
            commonParams = storage.getCookie('commonParam');
        }


        var appVersion = '1.0.5';

        // storage.setCookieDomain('scrd', commonParams, cookieDomain);

        if(commonParams) {
            try {
                appVersion = JSON.parse(commonParams).appVersion.replace('v', '');
            } catch (e) {
                appVersion = commonParams.match(/appVersion:v(\d+\.\d+\.\d+)/)[1];
            }
            // if(isAndroid()) {
            //     appVersion = JSON.parse(commonParams).appVersion.replace('v', '');
            // } else {
            //     appVersion = commonParams.match(/appVersion:v(\d+\.\d+\.\d+)/)[1];
            // }
        }

        var appVersionArr = appVersion.split('.');
        var i, appNum = 0;

        for(i = 0; i < 3; i++) {
            appNum += parseInt(appVersionArr[i]);
        }

        return appNum;
    }

    /* 判断设备. */
    function isAndroid() {
        var commonParams = storage.getCookie('commonParams') || storage.getCookie('commonParam');

        try {
            return JSON.parse(commonParams).device.indexOf('Android') > -1;
        } catch (e) {
            return false;
        }
    }
    
    var isLogin = (function () {
        if(getVersion() < 6) {
            return function (callback) {
                if (userId == 0) {  //未登录,先注销再调登录
                    AppInterface.call('/common/logout', function (data) {
                        if (data.success) {
                            AppInterface.call('/common/login', function (data) {
                                if (data.success) {
                                    userId = data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                    storage.setCookieDomain('userId', data.data.userId, cookieDomain);
                                    storage.setCookieDomain('token', data.data.token, cookieDomain);

                                    callback();
                                }
                            })
                        }
                    })
                } else {  //userId 有值
                    callback()
                }
            }
        } else {
            return function (callback) {
                AppInterface.call('/common/getLoginStatus', function (data) {
                    console.log(data);

                    if (data.success) {
                        storage.setCookieDomain('userId', data.data.userId, cookieDomain);
                        storage.setCookieDomain('token', data.data.token, cookieDomain);

                        callback();
                    } else {
                        AppInterface.call('/common/logout', function (data) {
                            if (data.success) {
                                AppInterface.call('/common/login', function (data) {
                                    if (data.success) {
                                        storage.setCookieDomain('userId', data.data.userId, cookieDomain);
                                        storage.setCookieDomain('token', data.data.token, cookieDomain);

                                        callback();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    })();

    //埋点js
    var params = {};
    params['url'] = location.href;
    params['userid'] = window.userId || 0;
    params['cookid'] = storage.getCookie('PHPSESSID') || 0;
    AppInterface.call('/common/statistics', {
        code: encodeURIComponent('P000W000'),               
        desc: encodeURIComponent(JSON.stringify(
            {name:'国美+首页',user_id: params.userid,url:params.url,cook_id:params.cookid}
        ))
    }); 

    var $btnEntrances = $('.Index-nav a');

    /* 轮播相关. */
    var rotate = document.getElementsByClassName('rotate')[0];
    var curPage = document.getElementsByClassName('cur-page')[0];
    var totalPage = document.getElementsByClassName('total-page')[0];
    var first = true;

    function banner() {
        var sliderSize = $('#bd ul > li').size();

        touchSlide.TouchSlide({
            slideCell: '#slider',
            //titCell: '#hd ul',
            mainCell: '#bd ul',
            effect: 'leftLoop',
            timeout: 5000,
            switchLoad: '_src',
            switchLoadN: 1,
            delayTime: 0,
            //autoPage: true,
            autoPlay: true,
            endFun: function (i, c) {
                if (first) {
                    first = false;
                    return;
                }

                i++;

                var showPage = curPage.innerHTML;
                var deg;

                if (rotate.style.transform) {
                    deg = rotate.style.transform.match(/-\d+|\d+/)[0] - 0;
                } else {
                    deg = rotate.style.webkitTransform.match(/-\d+|\d+/)[0] - 0;
                }

                if (showPage == c && i != (sliderSize - 1)) {
                    showPage = 0;
                }

                if (showPage > i || (showPage == 1 && i == sliderSize)) {
                    if (rotate.style.transform) {
                        rotate.style.transform = 'rotateZ(' + (deg - 60) + 'deg)';
                    } else {
                        rotate.style.webkitTransform = 'rotateZ(' + (deg - 60) + 'deg)';
                    }
                } else {
                    if (rotate.style.transform) {
                        rotate.style.transform = 'rotateZ(' + (deg + 60) + 'deg)';
                    } else {
                        rotate.style.webkitTransform = 'rotateZ(' + (deg + 60) + 'deg)';
                    }
                }

                curPage.innerHTML = i;
                totalPage.innerHTML = c;
            }
        });

        $('.heilogin li img').show();
    }

    try {
        if ($('#bd ul>li').length >= 2)
            banner();
    } catch (e) {
    }

    function gotoWhere(dataType, dataValue, datashopid, dataproductid, dataActivitytitle, dataActivitydesc, dataActivityimg, dataActivitylink) {
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
                AppInterface.call('/common/localJump', {
                    type: '2',
                    url: base64.encode(dataValue),
                    title: dataActivitytitle,
                    desc: dataActivitydesc,
                    imgUrl: base64.encode(dataActivityimg),
                    shareUrl: base64.encode(dataActivitylink)
                });
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
        var index = $(this).index();
        var dataType = $(this).attr('data-type');
        var dataValue = $(this).attr('data-value');
        var dataActivitytitle = $(this).attr('data-activitytitle');
        var dataActivitydesc = $(this).attr('data-activitydesc');
        var dataActivityimg = $(this).attr('data-activityimg');
        var dataActivitylink = $(this).attr('data-activitylink');
        if (dataType == 1) {
            console.log(dataType, dataValue)
            gotoWhere(dataType, null, dataValue, null);
        } else if (dataType == 0) {
            console.log(dataType, dataValue)
            gotoWhere(dataType, null, 0, dataValue)
        } else if (dataType == 6) {
            gotoWhere(dataType, dataValue, null, null, dataActivitytitle, dataActivitydesc, dataActivityimg, dataActivitylink)
        }
        else {
            gotoWhere(dataType, dataValue);
        }       

        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W000'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'顶部通栏广告位',user_id: params.userid,url:params.url,cook_id:params.cookid,banner_type:dataType,banner_value:dataValue}
            ))
        }); 

    });
    //查看国美＋精选
    $('body').on('click', '.Index-gome a', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = $(this).attr('data-type');
        if (dataType == 0) {
            gotoWhere(dataType, null, 0, dataValue);         
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W003'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'国美+精选',user_id: params.userid,url:params.url,cook_id:params.cookid,shop_id:dataValue}
                ))
            });
        } else if (dataType == 1) {
            gotoWhere(dataType, null, dataValue, null);         
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W003'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'国美+精选',user_id: params.userid,url:params.url,cook_id:params.cookid,product_id:dataValue}
                ))
            });
        } else {
            gotoWhere(dataType, dataValue);
            // console.log(dataType, dataValue);
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W003'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'国美+精选',url:params.url}
                ))
            });
        }

    });
    //查看特色市场
    $('body').on('click', '.Index-market a', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = $(this).attr('data-type');
        if (dataType == 0) {
            gotoWhere(dataType, null, 0, dataValue);
            // console.log(dataType, null, 0, dataValue);          
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W004'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'特色市场',user_id:params.userid,url:params.url,cook_id:params.cookid,shop_id:dataValue}
                ))
            });
        } else if (dataType == 1) {
            gotoWhere(dataType, null, dataValue, null);
            // console.log(dataType, null, dataValue, null);          
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W004'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'特色市场',user_id:params.userid,url:params.url,cook_id:params.cookid,product_id:dataValue}
                ))
            });
        } else {
            gotoWhere(dataType, dataValue);
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W004'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'特色市场',url:params.url}
                ))
            });
            // console.log(dataType, dataValue);
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
        // AppInterface.call('/common/statistics', {
        //     code: 'M000W005',
        //     name: '为你推荐',
        //     shop_id: base64.encode(datashopid),
        //     product_id: base64.encode(dataproductid),
        //     user_id: base64.encode(params.userid),
        //     url: base64.encode(params.url),
        //     cook_id: base64.encode(params.cookid)
        //     // param: base64.encode(JSON.stringify({shopId: datashopid, productId: dataproductid,userId: params.userid,url:params.url,cookId:params.cookid}))
        // });

        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W005'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'为你推荐',user_id:params.userid,url:params.url,cook_id:params.cookid,shop_id:datashopid,product_id:dataproductid}
            ))
        });

    });
    //查看ad店铺
    $('body').on('click', '.Index-adshop a.adshop-shopdetail', function () {
        var dataValue = $(this).attr('data-value');
        var dataType = '1';
        var datashopid = $(this).parent().find('a').eq(0).attr('data-shopid');
        var dataproductid = $(this).attr('data-id');
        console.log(dataType + ',' + dataValue + ',' + datashopid + ',' + dataproductid)
        gotoWhere(dataType, dataValue, datashopid, dataproductid);

        if (dataType == '0') {
            dataValue = datashopid;
            // AppInterface.call('/common/statistics', {
            //     code: 'M000W005',
            //     name: '为你推荐',
            //     product_id: base64.encode(dataValue),
            //     user_id: base64.encode(params.userid),
            //     url: base64.encode(params.url),
            //     cook_id: base64.encode(params.cookid)
            //     // param: base64.encode(JSON.stringify({product_id: dataValue,user_id: params.userid,url:params.url,cook_id:params.cookid}))
            // });
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W005'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'为你推荐',user_id:params.userid,url:params.url,cook_id:params.cookid,shop_id:dataValue}
                ))
            });
        } else if (dataType == '1') {
            dataValue = dataproductid;
            // AppInterface.call('/common/statistics', {
            //     code: 'M000W005',
            //     name: '为你推荐',
            //     shop_id: base64.encode(dataValue),
            //     user_id: base64.encode(params.userid),
            //     url: base64.encode(params.url),
            //     cook_id: base64.encode(params.cookid)
            //     // param: base64.encode(JSON.stringify({shop_id: dataValue,user_id: params.userid,url:params.url,cook_id:params.cookid}))
            // })
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W005'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'为你推荐',user_id:params.userid,url:params.url,cook_id:params.cookid,product_id:dataValue}
                ))
            });
        }


    }).on('click', '.Index-adshop a.adshop-shop-product', function () {                    
        var dataValue = $(this).attr('data-value');
        var dataType = 0;
        var datashopid = $(this).parent().find('a').eq(0).attr('data-shopid');
        var dataproductid = $(this).attr('data-id');
        console.log(dataType + ',' + dataValue + ',' + datashopid + ',' + dataproductid)
        gotoWhere(dataType, dataValue, datashopid, dataproductid);

        if (dataType == '0') {
            dataValue = datashopid;
            // AppInterface.call('/common/statistics', {
            //     code: 'M000W005',
            //     name: '为你推荐',
            //     product_id: base64.encode(dataValue),
            //     user_id: base64.encode(params.userid),
            //     url: base64.encode(params.url),
            //     cook_id: base64.encode(params.cookid)
            //     // param: base64.encode(JSON.stringify({product_id: dataValue,user_id: params.userid,url:params.url,cook_id:params.cookid}))
            // })
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W005'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'为你推荐',user_id:params.userid,url:params.url,cook_id:params.cookid,product_id:dataValue}
                ))
            });
        } else if (dataType == '1') {
            dataValue = dataproductid;
            // AppInterface.call('/common/statistics', {
            //     code: 'M000W005',
            //     name: '为你推荐',
            //     shop_id: base64.encode(dataValue),
            //     user_id: base64.encode(params.userid),
            //     url: base64.encode(params.url),
            //     cook_id: base64.encode(params.cookid)
            //     // param: base64.encode(JSON.stringify({shop_id: dataValue,user_id: params.userid,url:params.url,cook_id:params.cookid}))
            // })
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W005'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'为你推荐',user_id:params.userid,url:params.url,cook_id:params.cookid,shop_id:dataValue}
                ))
            });
        }


    }).on('click', '.gomeIndex>a.ad', function () {
        var dataValue = $(this).attr('data-href');
        var dataType = $(this).attr('data-type');
        gotoWhere(dataType, dataValue);
    });

    /* 添加微票 */
    function gotoWeipiao() {
        $.ajax({
            type: 'post',
            url: '/index/getUserMovieTicketUrl',
            dataType: 'json',
            success: function (data) {
                console.log(data);

                if (data.data) {
                    console.log(data.data.url);
                    AppInterface.call('/common/localJump', {
                        url: encodeURIComponent(base64.encode(data.data.url)),
                        type: encodeURIComponent(3),
                        rightText: encodeURIComponent('电影订单')
                    });
                } else {
                    console.log(data.message);
                    AppInterface.toast(data.message || '请求失败!');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // AppInterface.toast(data.message || '网络错误,请稍后再试!');
                /*弹出jqXHR对象的信息*/
                console.log(jqXHR.responseText);
                console.log(jqXHR.status);
                console.log(jqXHR.readyState);
                console.log(jqXHR.statusText);
                /*弹出其他两个参数的信息*/
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    $btnEntrances.eq(7).tap(function () {
        if(getVersion() < 6) {
            if(isAndroid()) {
                AppInterface.toast('人生如戏，从你的第一场开始，购买电影票请升级版本哦！');
            } else {
                AppInterface.toast('人生如戏，从你的第一场开始，购买电影票请去AppStore升级哦！');
            }

            return false;
        }
        
        isLogin(gotoWeipiao);
    });


//nav综合入口位
    var navNames = ['ce-qiangjuan', 'ce-licai', 'ce-xiaodian', 'ce-haohuo', 'ce-fanli', 'ce-cuxiao', 'ce-kaidian', 'ce-shangpin'];
    $('.Index-nav a').eq(0).on('click', function () {
        AppInterface.call('/list/couponcenter');
        AppInterface.queue(function () {            
            AppInterface.call('/common/statistics', {
                code: encodeURIComponent('M000W001'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[0]}
                ))
            }); 
        })
    });


    // function isLogin(dataValue) {
    //     if (userId == 0) {  //未登录,先注销再调登录
    //         AppInterface.call('/common/logout', function (data) {
    //             if (data.success) {
    //                 AppInterface.call('/common/login', function (data) {
    //                     if (data.success) {
    //                         userId = data.data.userId;//登录成功返回userId，重写userId此时为登录状态
    //                         storage.setCookie('userId', data.data.userId);
    //                         storage.setCookie('token', data.data.token);
    //                         if (dataValue && dataValue != '#') {
    //                             gotoWhere('2', dataValue);
    //                         }
    //                     }
    //                 })
    //             }
    //         })
    //     } else {  //userId 有值
    //         if (dataValue && dataValue != '#') {
    //             gotoWhere('2', dataValue);
    //         }
    //     }
    // }

    /* function goJump(){
     if(dataValue && dataValue != '#'){
     gotoWhere(2, dataValue);
     }
     }   */

    $('.Index-nav a').eq(1).on('click', function () {
        var dataValue = $(this).attr('data-href');
        // isLogin(dataValue);

        isLogin(function () {
            if (dataValue && dataValue != '#') {
                gotoWhere('2', dataValue);
            }
        });

        // if (userId == 0) {  //未登录,先注销再调登录
        //     AppInterface.call('/common/logout', function (data) {
        //         if (data.success) {
        //             AppInterface.call('/common/login', function (data) {
        //                 if (data.success) {
        //                     userId = data.data.userId;//登录成功返回userId，重写userId此时为登录状态
        //                     storage.setCookie('userId', data.data.userId);
        //                     storage.setCookie('token', data.data.token);
        //                     if (dataValue && dataValue != '#') {
        //                         gotoWhere('2', dataValue);
        //                     }
        //                 }
        //             })
        //         }
        //     })
        // } else {  //userId 有值
        //     if (dataValue && dataValue != '#') {
        //         gotoWhere('2', dataValue);
        //     }
        // }

        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W001'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[1]}
            ))
        }); 

    });


    $('.Index-nav a').eq(2).on('click', function () {
        AppInterface.call('/list/shopping');
        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W001'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[2]}
            ))
        }); 

    });

    $('.Index-nav a').eq(3).on('click', function () {
        AppInterface.call('/list/kindpro');
        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W001'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[3]}
            ))
        }); 
    });
    $('.Index-nav a').eq(4).on('click', function () {
        AppInterface.call('/list/lookcheap');
        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W001'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[4]}
            ))
        }); 
    });
    $('.Index-nav a').eq(5).on('click', function () {
        var dataValue = $(this).attr('data-href');
        if (dataValue && dataValue != '#') {
            gotoWhere('2', dataValue);
        } else {
            AppInterface.call('/promotion/event');
        }
        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W001'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[5]}
            ))
        }); 

    });
    $('.Index-nav a').eq(6).on('click', function () {
        // if (userId == 0) {  //未登录,先注销再调登录
        //     AppInterface.call('/common/logout', function (data) {
        //         if (data.success) {
        //             AppInterface.call('/common/login', function (data) {
        //                 if (data.success) {
        //                     userId = data.data.userId;//登录成功返回userId，重写userId此时为登录状态
        //                     storage.setCookie('userId', data.data.userId);
        //                     storage.setCookie('token', data.data.token);
        //                     AppInterface.call('/mine/shop');
        //                 }
        //             })
        //         }
        //     })
        // } else {  //userId 有值
        //     AppInterface.call('/mine/shop');
        // }

        isLogin(function () {
            AppInterface.call('/mine/shop');
        });

        AppInterface.call('/common/statistics', {
            code: encodeURIComponent('M000W001'),               
            desc: encodeURIComponent(JSON.stringify(
                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[6]}
            ))
        }); 

    });
// $('.Index-nav a').eq(7).on('click', function () {
//         AppInterface.call('/list/category', {categoryId: 1});
//         AppInterface.call('/common/statistics', {
//            code: encodeURIComponent('M000W001'),               
//            desc: encodeURIComponent(JSON.stringify(
//                {name:'综合入口位',user_id: params.userid,url:params.url,cook_id:params.cookid,type:navNames[7]}
//            ))
//         }); 
//
// });

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

    /* 取得店铺等级. */
    function getShopLevel(shopLevel) {
        var levels = [];

        switch (shopLevel) {
            case 1:
                levels.push('bronze');
                break;
            case 2:
                levels.push('bronze', 'bronze');
                break;
            case 3:
                levels.push('bronze', 'bronze', 'bronze');
                break;
            case 4:
                levels.push('bronze', 'bronze', 'bronze', 'bronze');
                break;
            case 5:
                levels.push('silver');
                break;
            case 6:
                levels.push('silver', 'silver');
                break;
            case 7:
                levels.push('silver', 'silver', 'silver');
                break;
            case 8:
                levels.push('silver', 'silver', 'silver', 'silver');
                break;
            case 9:
                levels.push('gold');
                break;
            case 10:
                levels.push('gold', 'gold');
                break;
            case 11:
                levels.push('gold', 'gold', 'gold');
                break;
        }

        return levels;
    }

    function fetchData(flag) {
        if (!firstNoData) {
            loading = false;
            flag && AppInterface.toast('没有更多数据了');
            return;
        }
        Ajax.query('/index/recomends', {pageNum: pageNum}, function (data) {
            console.log(data);
            if (data.success) {
                var dataAll = data.data.productList;  //[{},{},{}]//所有的两组12个商品，分6个一组
                //data.data不存在或者  （（商品列表不存在或长度为0）且（推荐店铺不存在或长度为0））
                if (!data.data || ( (!dataAll || dataAll.length == 0) && (!data.data.shopList || data.data.shopList.length == 0 ))) {
                    //AppInterface.toast('没有更多数据了');
                    pageNum--;
                    firstNoData = false;
                    loading = false;
                    return;
                }
                var item = {
                    shopItemsOne: {
                        frontshop: function () {
                            var tmp = [];
                            for (var i = 0; i < (dataAll.length > 6 ? 6 : dataAll.length); i++) {
                                tmp.push(dataAll[i]);
                            }
                            return tmp;
                        }(),
                        backshop: {
                            shop: data.data.shopList[0],
                            shopLevel: function () {
                                var shopLevel = data.data.shopList[0].shopLevel;
                                return getShopLevel(shopLevel);
                            }(),
                            hasLevel: function () {
                                return data.data.shopList[0].shopLevel > 0;
                            }(),
                            product: function () {
                                var tmp = [];
                                if (data.data.shopList[0] && data.data.shopList[0].product) {
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
                        frontshop: function () {
                            var tmp = [];
                            for (var i = 6; i < (dataAll.length > 6 ? dataAll.length : 6); i++) {
                                tmp.push(dataAll[i]);
                            }
                            return tmp;
                        }(),
                        backshop: {
                            shop: data.data.shopList[1],
                            shopLevel: function () {
                                var shopLevel = data.data.shopList[1].shopLevel;
                                return getShopLevel(shopLevel);
                            }(),
                            hasLevel: function () {
                                return data.data.shopList[1].shopLevel > 0;
                            }(),
                            product: function () {
                                var tmp = [];
                                if (data.data.shopList[1] && data.data.shopList[1].product) {
                                    var dataArray = data.data.shopList[1].product;
                                    for (var i = 0; i < (dataArray.length > 3 ? 3 : dataArray.length); i++) {
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
    $(window).scroll(function () {
        if (($(window).scrollTop() + $(window).height() / 2) >= $(document).height() - ($(window).height()) && !loading) {
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
