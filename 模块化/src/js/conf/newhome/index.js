/**
 * Created by tianguangyu on 2016/7/14.
 */
define('conf/newhome/index.js', function(require, exports, module) {
  require('$');
  var AppInterface = require('utils/appInterface.js');
  require('mods/newhome/goTop.js');
  //var Swiper = require('UI/swiper.js');
  var slide = require('UI/slide.js');

  //图片懒加载
  require('UI/lazyload-gm.js');
  $("img").picLazyLoad({
    effect: "fadeIn",
    speed: 50
  });

  var getParamsFun = require('mods/newhome/getParamsFun');
  var gotoWhereFun = require('mods/newhome/gotoWhereFun');
  var loadHtmlFun = require('mods/newhome/loadHtmlFun');
  var getEleDataFun = require('mods/newhome/getEleDataFun');
  var getLikeDataFun = require('mods/newhome/getLikeDataFun');
  var goWeiPiaoFun = require('mods/newhome/goWeiPiaoFun');
  var isLoginFun = require('mods/newhome/isLoginFun');
  var gomeplus = require('mods/Gomeplus/gomeplus.js');
  var base64 = require('utils/base64.js');
  //var dropload = require('UI/dropload-gg.js');

  /**
   * 测试android使用js ios使用原生刷新
   * @type {null}
     */
  var dropload = null;

  var touchSlide = require('UI/TouchSlide_gm.js');
  var shopId = getParamsFun.getParams().shopId;
  var Replace = require('mods/replace.js');
  Replace.wordLimit($('p.foryou-shop-font1'));
  var FastClick = require('vendors/fastclick.js');
  var storage = require('mods/storage.js');
  FastClick.attach(document.body);


  // 测试android使用js ios使用原生刷新
  /* 判断设备. */
  function isAndroid() {
    var commonParams = storage.getCookie('commonParams') || storage.getCookie('commonParam');

    try {
      return JSON.parse(commonParams).device.indexOf('Android') > -1;
    } catch (e) {
      return false;
    }
  }

// 测试android使用js ios使用原生刷新
  if(isAndroid()) {
    /*dropload = require('UI/dropload-gg.js');
    AppInterface.call('/common/updateTitleStatus',{type:1});
    $('body').dropload({
     loadUpFn: function(me) {
       me.resetload();
       setTimeout(function() {
         location.reload(false);
       }, 100);
     }
    });*/
  }

      /**
     * 客户端切换回逛逛首页调用方法
     * open_pgl 玩赚国美+ 的入口开关
     * @constructor
     */
    if(open_pgl) {
        // 首次加载页面的时候初始化玩转国美+点击
        gomeplus.toGomeplus('gotoGomeplus');
        window.onRefresh = function(){
            gomeplus.initGomeplus();
        };
    }


  //埋点js
  var params = {};
  params.url = location.href;
  params.userid = window.userId || 0;
  params.cookid = storage.getCookie('PHPSESSID') || 0;
  AppInterface.call('/common/statistics', {
    code: encodeURIComponent('P000W000'),
    desc: encodeURIComponent(JSON.stringify({
      name: '逛逛首页',
      user_id: params.userid,
      url: params.url,
      cook_id: params.cookid
    }))
  });

  //AppInterface.call('/common/updateTitleStatus',{type:1});
  /* 轮播相关. */
  var rotate = document.getElementsByClassName('rotate')[0];
  var curPage = document.getElementsByClassName('cur-page')[0];
  var totalPage = document.getElementsByClassName('total-page')[0];
  var first = true;

  try {
    if ($('#bd ul>li').length >= 2) {
      banner();
    } else {
      var imgs = $('#bd ul>li>a>img');
      for (var index in imgs) {
        if (imgs[index].getAttribute('_src')) {
          imgs[index].setAttribute('src', imgs[index].getAttribute('_src'));
          imgs[index].removeAttribute('_src');
        }
      }
    }

  } catch (e) {}

  var isLoad = false;

  //loadHtmlFun.loadHtml('body',otherHtml);
  loadHtmlFun.loadHtml('#index-container', window.otherHtml);
  $('img').picLazyLoad();
  createAdScript();

  /*        // 由于下半段HTML是在loadHtmlFun.loadHtml('body',otherHtml); 渲染的，所以这两个滑动放在这里
          var swiperRecommendZone = new Swiper('#gg-recommend-wrap', {
              slidesPerView: 'auto',
              slideClass: 'recommend',
              freeMode : true,
              freeModeFluid : true
          });

          var swiperGoods = new Swiper('#gg-goods-wrap', {
              slidesPerView: 'auto',
              slideClass: 'recommendGoods',
              freeMode : true,
              freeModeFluid : true
          });*/


  if ($('#gg-recommend-wrap').length) {
    var recommendDIV = document.querySelector('#gg-recommend-wrap');
    var recommendSlide = new slide({
      ele: recommendDIV,
      BOXCLS: 'choose-list',
      ITEMCLS: 'recommend'
    });
  }

  if ($('#gg-goods-wrap').length) {
    var goodsDIV = document.querySelector('#gg-goods-wrap');
    var goodsSlide = new slide({
      ele: goodsDIV,
      BOXCLS: 'choose-list',
      ITEMCLS: 'recommendGoods'
    });
  }

  isLoad = true;

  var timer;
  //var droploadUp = $('body').dropload({
  //  loadUpFn: function(me) {
  //    me.resetload();
  //    setTimeout(function() {
  //      location.reload(false);
  //    }, 100);
  //  }
  //});

  //isHaveAd();
  //
  //function isHaveAd() {
  //  if ($('.gg-adg a').length > 0) {
  //    var href = $('.gg-adg a').attr('href');
  //    $('.gg-adg a').attr('data-datavalue', href);
  //    $('.gg-adg a').attr('data-type', 2);
  //  }
  //}

  function banner() {
    var sliderSize = $('.gg-baner-list > li').size();

    touchSlide.TouchSlide({
      slideCell: '#bd',
      //titCell: '#gg-banner-nav ul',
      mainCell: '.gg-baner-list',
      effect: 'leftLoop',
      timeout: 5000,
      switchLoad: '_src',
      switchLoadN: 1,
      delayTime: 0,
      //autoPage: '<li></li>',
      autoPlay: true,
      endFun: function(i, c) {
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
    $('.gg-baner-list li a img').show();
  }

  /*    var swiperCoupons = new Swiper('#gg-coupons', {
          slidesPerView: 'auto',
          slideClass: 'coupon',
          freeMode : true,
          freeModeFluid : true
      });

      var swiperRebateZone = new Swiper('#gg-rebateZone-wrap', {
          slidesPerView: 'auto',
          slideClass: 'rebate',
          freeMode : true,
          freeModeFluid : true
      });

      var swiperDiscountZone = new Swiper('#gg-discount-wrap', {
          slidesPerView: 'auto',
          slideClass: 'discount',
          freeMode : true,
          freeModeFluid : true
      });*/

  if ($('#gg-coupons').length) {
    var couponsDIV = document.querySelector('#gg-coupons');
    var couponsSlide = new slide({
      ele: couponsDIV,
      BOXCLS: 'gg-coupons-list',
      ITEMCLS: 'coupon'
    });
  }

  if ($('#gg-rebateZone-wrap').length) {
    var rebateZoneDIV = document.querySelector('#gg-rebateZone-wrap');
    var rebateZoneSlide = new slide({
      ele: rebateZoneDIV,
      BOXCLS: 'product-list',
      ITEMCLS: 'rebate'
    });
  }

  if ($('#gg-discount-wrap').length) {
    var discountDIV = document.querySelector('#gg-discount-wrap');
    var discountSlide = new slide({
      ele: discountDIV,
      BOXCLS: 'product-list',
      ITEMCLS: 'discount'
    });
  }

  // banner
  $('#bd').on('click', 'ul.gg-baner-list li a', function() {
    var data = getEleDataFun.getEleData($(this));
    gotoWhereFun.gotoWhereValue(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W000'),
      desc: encodeURIComponent(JSON.stringify({
        name: '逛逛页轮播图',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_type: data.dataType,
        banner_value: data.dataValue,
        banner_eq: data.datasn
      }))
    });
  });

  //nav综合入口位
  var navNames = ['ce-zhuanwaikuai', 'ce-haodian', 'ce-dianying', 'ce-fenlei'];
  // 赚外快
  $('.gg-nav a').eq(0).on('click', function() {
    AppInterface.call('/promotion/earnMoney');
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W007'),
      desc: encodeURIComponent(JSON.stringify({
        name: '综合入口位',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: 1,
        type: navNames[0]
      }))
    });
  });
  $('.gg-nav a').eq(1).on('click', function() {
    AppInterface.call('/list/shopping');
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W007'),
      desc: encodeURIComponent(JSON.stringify({
        name: '综合入口位',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: 2,
        type: navNames[1]
      }))
    });
  });
  $('.gg-nav a').eq(2).on('click', function() {
    isLoginFun.isLogined(goWeiPiaoFun.gotoWeipiao);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W007'),
      desc: encodeURIComponent(JSON.stringify({
        name: '综合入口位',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: 3,
        type: navNames[2]
      }))
    });
  });
  $('.gg-nav a').eq(3).on('click', function() {
    AppInterface.call('/list/category', {
      categoryId: 1
    });
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W007'),
      desc: encodeURIComponent(JSON.stringify({
        name: '综合入口位',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: 4,
        type: navNames[3]
      }))
    });
  });

  // 购物券更多推荐和上方标题栏 &&  购物券
  $('body').on('click', '.gg-coupons div.gg-coupons-img', function() {
    AppInterface.call('/list/couponcenter');
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W008'),
      desc: encodeURIComponent(JSON.stringify({
        name: '领券中心模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: -1
      }))
    });
  }).on('click', '#gg-coupons ul>li', function() {
    if ($(this).index() == ($(this).parents('ul').children().length - 1)) {
      AppInterface.call('/list/couponcenter');
      AppInterface.call('/common/statistics', {
        code: encodeURIComponent('B000W005'),
        desc: encodeURIComponent(JSON.stringify({
          name: '优惠券更多按钮',
          user_id: params.userid,
          url: params.url,
          cook_id: params.cookid
        }))
      });
    } else {
      var that = this;
      isLoginFun.isLogined(function() {
        var couponSn = $(that).attr('data-batchsn');
        var pData = {
          sn: couponSn
        };
        $.ajax({
          type: 'get',
          url: '/coupon/receiveCoupon',
          data: pData,
          dataType: 'json',
          success: function(data) {
            if ((typeof(data.data) != 'undefined') && (typeof(data.data.userRemainingAvailableQuantity) != 'undefined')) {
              AppInterface.toast('领取成功!');
            } else {
              AppInterface.toast('已达领取上限!');
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            AppInterface.toast('领取失败!');
          }
        });
      });
      var type = $(that).attr('data-batchtype');
      var data = getEleDataFun.getEleData($(this));
      if (type == 1) {
        AppInterface.call('/common/statistics', {
          code: encodeURIComponent('M000W008'),
          desc: encodeURIComponent(JSON.stringify({
            name: '领券中心模块',
            user_id: params.userid,
            url: params.url,
            cook_id: params.cookid,
            banner_eq: data.datasn,
            shop_id: data.datashopid,
            coupon_type: type
          }))
        });
      } else if (type == 2) {
        AppInterface.call('/common/statistics', {
          code: encodeURIComponent('M000W008'),
          desc: encodeURIComponent(JSON.stringify({
            name: '领券中心模块',
            user_id: params.userid,
            url: params.url,
            cook_id: params.cookid,
            banner_eq: data.datasn,
            coupon_type: type
          }))
        });
      }
    }
  });

  // 玩转国美+
  $('body').on('click', '.gg-gomeadd', function() {
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W009'),
      desc: encodeURIComponent(JSON.stringify({
        name: '玩转国美+模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid
      }))
    });
  });

  // 专题 && 专题更多推荐
  $('body').on('click', '.gg-images-box a.gg-images-bx', function() {
    var data = getEleDataFun.getEleData($(this));
    gotoWhereFun.gotoWhereValue(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W010'),
      desc: encodeURIComponent(JSON.stringify({
        name: '运营活动模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: data.datasn
      }))
    });
  }).on('click', '.gg-images-box .gg-more-bx a.gg-more-wonderful', function() {
    var dataHref = $(this).attr('data-href');
    AppInterface.call('/common/localJump', {
      url: base64.encode(dataHref)
    });
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('B000W006'),
      desc: encodeURIComponent(JSON.stringify({
        name: '运营活动模块更多精彩按钮',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid
      }))
    });
  });

  // 返利专区里面的商品 && 上方标题栏
  $('body').on('click', '#gg-rebateZone-wrap ul>li>a.product-it', function() {
    if ($(this).parents().index() == ($(this).parents('ul').children().length - 1)) {
      AppInterface.call('/list/lookcheap');
      AppInterface.call('/common/statistics', {
        code: encodeURIComponent('B000W007'),
        desc: encodeURIComponent(JSON.stringify({
          name: '返利专区更多按钮',
          user_id: params.userid,
          url: params.url,
          cook_id: params.cookid
        }))
      });
    } else {
      var data = getEleDataFun.getEleData($(this));
      data.dataType = 0;
      gotoWhereFun.gotoWhere(data);
      AppInterface.call('/common/statistics', {
        code: encodeURIComponent('M000W011'),
        desc: encodeURIComponent(JSON.stringify({
          name: '返利专区模块',
          user_id: params.userid,
          url: params.url,
          cook_id: params.cookid,
          shop_id: data.datashopid,
          produce_id: data.dataproductid,
          banner_eq: data.datasn
        }))
      });
    }
  }).on('click', '#rebateZone .gg-images-bx2', function() {
    AppInterface.call('/list/lookcheap');
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W012'),
      desc: encodeURIComponent(JSON.stringify({
        name: '返利专区模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: -1
      }))
    });
  });

  // 折扣专区里面的商品 && 上方标题栏与返利专区更多公用代码
  $('body').on('click', '#gg-discount-wrap ul>li>a.product-it', function() {
    if ($(this).parents().index() == ($(this).parents('ul').children().length - 1)) {
      AppInterface.call('/list/kindpro');
      AppInterface.call('/common/statistics', {
        code: encodeURIComponent('B000W008'),
        desc: encodeURIComponent(JSON.stringify({
          name: '折扣专区更多按钮',
          user_id: params.userid,
          url: params.url,
          cook_id: params.cookid
        }))
      });
    } else {
      var data = getEleDataFun.getEleData($(this));
      data.dataType = 0;
      gotoWhereFun.gotoWhere(data);
      AppInterface.call('/common/statistics', {
        code: encodeURIComponent('M000W012'),
        desc: encodeURIComponent(JSON.stringify({
          name: '折扣专区模块',
          user_id: params.userid,
          url: params.url,
          cook_id: params.cookid,
          shop_id: data.datashopid,
          produce_id: data.dataproductid,
          banner_eq: data.datasn
        }))
      });
    }
  }).on('click', '#discountZone .gg-images-bx2', function() {
    var dataHref = $(this).attr('data-href');
    AppInterface.call('/list/kindpro');
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W012'),
      desc: encodeURIComponent(JSON.stringify({
        name: '折扣专区模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: -1
      }))
    });
  });

  // 推荐店铺里面的商品
  $('body').on('click', '.gg-recommend-store div.gg-goods>a', function() {
    var data = getEleDataFun.getEleData($(this));
    data.dataType = 0;
    if (data.dataproductid != 0) {
      gotoWhereFun.gotoWhere(data);
      AppInterface.call('/common/statistics', {
        code: encodeURIComponent('M000W013'),
        desc: encodeURIComponent(JSON.stringify({
          name: '推荐店铺模块',
          user_id: params.userid,
          url: params.url,
          cook_id: params.cookid,
          shop_id: data.datashopid,
          produce_id: data.dataproductid,
          banner_eq: data.datasn
        }))
      });
    }
  });

  // 推荐店铺里面的店铺
  $('body').on('click', '.gg-recommend-store div.gg-focus-bx>a', function() {
    var data = getEleDataFun.getEleData($(this));
    data.dataType = 1;
    data.dataValue = data.datashopid;
    gotoWhereFun.gotoWhere(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W013'),
      desc: encodeURIComponent(JSON.stringify({
        name: '推荐店铺模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        shop_id: data.datashopid,
        banner_eq: data.datasn
      }))
    });
  });

  // 精品小店更多精彩
  $('body').on('click', '.gg-recommend-store a.gg-more-wonderful', function() {
    AppInterface.call('/list/shopping');
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('B000W009'),
      desc: encodeURIComponent(JSON.stringify({
        name: '推荐店铺模块更多精彩按钮',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid
      }))
    });
  });

  // 精选推荐里面的商品
  $('body').on('click', '#gg-recommend-wrap ul>li>a.choose-it', function() {
    var data = getEleDataFun.getEleData($(this));
    gotoWhereFun.gotoWhereValue(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W014'),
      desc: encodeURIComponent(JSON.stringify({
        name: '精选推荐模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: data.datasn,
        shop_id: data.datashopid,
        product_id: data.dataproductid
      }))
    });
  });

  // 好物期刊里面的商品
  $('body').on('click', '#gg-goods-wrap ul>li>a.choose-it', function() {
    var data = getEleDataFun.getEleData($(this));
    gotoWhereFun.gotoWhereValue(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W015'),
      desc: encodeURIComponent(JSON.stringify({
        name: '好物期刊模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: data.datasn,
        shop_id: data.datashopid,
        product_id: data.dataproductid
      }))
    });
  });

  // 推荐单品里面的商品
  $('body').on('click', '.kitchen ul>li>a.kitchen-item', function() {
    var data = getEleDataFun.getEleData($(this));
    data.dataType = 0;
    gotoWhereFun.gotoWhere(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W016'),
      desc: encodeURIComponent(JSON.stringify({
        name: '爱，囿于厨房模块',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: data.datasn,
        shop_id: data.datashopid,
        product_id: data.dataproductid,
        section_id: data.datasectionid
      }))
    });
  });

  // 点击猜你喜欢商品事件
  $('body').on('click', '.gg-kitchen a.like-item', function() {
    var data = getEleDataFun.getEleData($(this));
    data.dataType = 0;
    gotoWhereFun.gotoWhere(data);
    AppInterface.call('/common/statistics', {
      code: encodeURIComponent('M000W005'),
      desc: encodeURIComponent(JSON.stringify({
        name: '为你推荐',
        user_id: params.userid,
        url: params.url,
        cook_id: params.cookid,
        banner_eq: data.datasn,
        shop_id: data.datashopid,
        product_id: data.dataproductid,
        icSource: data.dataIcSource
      }))
    });
  });

  // 动态生成广告的JS
  function createAdScript() {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = adadEmbedUrl;
    head.appendChild(script);
  }

  // 对广告暴露的接口
  window.adJumpApp = function(type, data) {
    if (type == 0) {
      AppInterface.call('/product/detail', {
        shopId: data.shopId,
        productId: data.productId
      });
    } else if (type == 1) {
      AppInterface.call('/shop/detail', {
        shopId: data.shopId
      });
    } else if (type == 'H5') {
      AppInterface.call('/common/localJump', {
        url: base64.encode(data.url)
      });
    }
  };

  var loadParams = {
    loading: false,
    pageNum: 0,
    flag: false,
    firstNoData: true
  };

  $(window).scroll(function() {
    if (isLoad) {
      if (($(window).scrollTop() + $(window).height() / 2) >= $(document).height() - ($(window).height()) && !loadParams.loading) {
        loadParams.pageNum++;
        loadParams.loading = true;
        if (loadParams.flag == false) {
          loadParams = getLikeDataFun.getLikeData(loadParams);
        }
      }
    }
  });


});
