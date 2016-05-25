/**
 * 我的店铺页
 * @zhoujun
 * @20160204
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
     data-config="config.js"
     data-debug="true"
     data-main="conf/Shop/shop.js">
     </script>
 */
define('conf/Shop/shop.js', function (require, exports, module) {
    require('$');
    require('utils/appInterface.js');
    var common = require('lib/common.js');
    var base64 = require('utils/base64.js');
    require('mods/tokenCheck.js');
    require('mods/buried.js');
    var shopId = common.getParams()['shopId'];
    var wapHost = 'http://m.gomeplus.com';

    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    AppInterface.delegateHyperlink();
    var basepath = location.href.match(/^(http[s]?:\/\/(?:[^\/]*))\/.*$/)[1];
    try{
        wapHost = WAP_HOST;
        wapHost = /^.*\/$/.test(wapHost)?wapHost.substr(0,wapHost.length-1):wapHost;
    }catch(e){
        console.log('获取不到WAP_HOST参数');
    }

    bindEvents();
    var oShopArr = [
        {type:'M-Product'},
        {type:'M-order'},
        {type:'M-data'},
        {type:'M-shop'},
        {type:'M-share'}
    ];

    var oShopTopArr = [
        {type:'T-check'},
        {type:'T-copy'},
        {type:'T-share'}
    ];

    // 商品管理、订单管理、数据分析、店铺设置、分享店铺
    // M-Product、M-order、M-data、   M-shop、 M-share 

    // 查看店铺、复制链接、分享店铺
    // T-check、  T-copy、   T-share
    
    function bindEvents(){
        //查看店铺
        $('#viewShopBtn').on('click',function(){
            AppInterface.call('/shop/detail',{shopId:shopId});
            AppInterface.buried( 'B000W002','查看店铺',oShopTopArr[0]);

        });

        $('#productManageBtn').on('click',function(){
            AppInterface.buried( 'P000W004','商品管理',oShopArr[0]);
            window.setTimeout(function(){
                var debug = '';
                (/debug/).test(location.search)&&(debug = '&debug');
                location.href = '/products/index?shopId='+shopId+debug;
            },0);
        });
        //复制链接
        $('#copyLinkBtn').on('click',function(){
            var link = wapHost+'/shop/index?shopId=' + shopId;
            AppInterface.call('/copy/shop',{msg:base64.encode(link),title:$(this).attr('data-val')},function(data){
                data.success ? AppInterface.toast('复制成功！') : AppInterface.toast(data.message);
            });
            AppInterface.buried( 'B000W002','复制链接',oShopTopArr[1]);
        });
        //分享店铺
        $('#shareShopBtn').on('click',function(){
            var shopName = $(this).attr('data-val'),
                imgUrl = $(this).attr('data-img');
            AppInterface.call('/share/shop',{shopId:shopId,shopName:shopName,imageUrl:base64.encode(imgUrl)},function(data){
                //data.success ? AppInterface.toast('分享成功！') : AppInterface.toast(data.message);
            });
            AppInterface.buried( 'B000W002','分享店铺',oShopTopArr[2]);
        });


        //订单管理
        $('#orderManageBtn').on('click',function(){
            AppInterface.call('/mine/order_manage',{shopId:shopId});
            AppInterface.buried( 'P000W004','订单管理',oShopArr[1]);

        });
        //店铺设置
        $('#shopConfigBtn').on('click',function(){
            AppInterface.call('/shop/setting',{shopId:shopId});
            AppInterface.buried( 'P000W004','店铺设置',oShopArr[3]);

        });

        // 数据分析
        $('a.shopBtn-back3').on('click',function(){
            AppInterface.buried( 'P000W004','数据分析',oShopArr[2]);
        });

        //重新计算店铺头像尺寸
        (function(){
            var $img = $('.myHome-messl>img');
            var imgWidth = $img.width(),imgHeight = $img.height();
            if(imgWidth>imgHeight){
                $img.css({
                    opacity:1,
                    width:'auto',
                    height:'1.01rem',
                    transform:'translate3D(-50%,-50%,0)',
                    '-webkit-transform':'translate3D(-50%,-50%,0)',
                    position:'absolute',
                    left:'50%',
                    top:'50%'
                });
            }else if(imgWidth<imgHeight){
                $img.css({
                    opacity:1,
                    width:'1.01rem',
                    height:'auto',
                    transform:'translate3D(-50%,-50%,0)',
                    '-webkit-transform':'translate3D(-50%,-50%,0)',
                    position:'absolute',
                    left:'50%',
                    top:'50%'
                });
            }else{
                $img.css({
                    opacity:1,
                    width:'1.01rem',
                    height:'1.01rem',
                    transform:'translate3D(-50%,-50%,0)',
                    '-webkit-transform':'translate3D(-50%,-50%,0)',
                    position:'absolute',
                    left:'50%',
                    top:'50%'
                });
            }
        })();


    }
});