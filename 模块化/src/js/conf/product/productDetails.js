/**
 * 老版商品详情.
 * @author shenchao
 * @description
 * 页面引用
 * <script src="__PUBLIC__/js/lithe.js"
 * data-config="config.js"
 * data-debug="true"
 * data-main="conf/product/productDetail.js"></script>
 */

define('conf/product/productDetails', function (require, exports, module) {
	var Vue = require('vendors/vue.js');
	var zp= require('$');
	/* 暂时先引用老的common. */
	var com = require('lib/commonOld');
	var bp = require('mods/buried.js');
	var AppInterface = require('utils/appInterface.js');
	var $ = require('vendors/droploadOld');
	var storage = require('mods/storage');
	var base64 = require('utils/base64.js');

    var params = com.getParams();
    var proId = params.proId;
    var locId = params.locId ? params.locId : 1;
    var evaluate = params.evaluate;

	var paramsMaidian={};
	paramsMaidian['url'] = location.href;
	paramsMaidian['userid'] = window.userId || 0;
	paramsMaidian['productid'] = window.productid || 0;
	paramsMaidian['shopid'] = window.shopid || 0;
	paramsMaidian['cookid'] = storage.getCookie('PHPSESSID') || 0;

	var vm = new Vue({
        el:'.page',
        data:{
        	params: [],
            isOne: true,
            isTwo: false,
            isThree: false,
            evtorList: [],
            index: 0,
            bigImgList: []
        },
        methods:{
            change:function(index){
                switch(index){
                    case 1:
                        this.isOne = true;
                        this.isTwo = false;
                        this.isThree = false;
                        break;
                    case 2:
                        this.isOne = false;
                        this.isTwo = true;
                        this.isThree = false;
                        break;
                    case 3:
                        this.isOne = false;
                        this.isTwo = false;
                        this.isThree = true;
                        addDrop();
                        break;
                    default:
                        this.isOne = true;
                        this.isTwo = false;
                        this.isThree = false;
                        break;
                }
            },
            productDetail: function (proId, shopId) {
                // AppInterface.buried('M000W005', '为你推荐', {proId: proId, shopId: shopId});

	            // AppInterface.call('/common/statistics', {
		           //  code: 'M000W007',
		           //  name: '猜你喜欢',
		           //  param: base64.encode(JSON.stringify({produce_id:paramsMaidian.productid,shop_id:paramsMaidian.shopid,uid: paramsMaidian.userid,url:paramsMaidian.url,cook_id:paramsMaidian.cookid}))
	            // });

                // AppInterface.call('/common/statistics', {
                //             code: 'P000W003',
                //             name: '为你推荐页',
                //             user_id: base64.encode(paramsMaidian.userid),
                //             url: base64.encode(paramsMaidian.url),
                //             cook_id: base64.encode(paramsMaidian.cookid),
                //             product_id:base64.encode(paramsMaidian.productid),
                //             shop_id:base64.encode(paramsMaidian.shopid),
                //             // param: base64.encode(JSON.stringify({user_id: params.userid,url:params.url,cook_id:params.cookid}))
                // });
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('P000W003'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'为你推荐页',user_id: paramsMaidian.userid,url:paramsMaidian.url,cook_id:paramsMaidian.cookid,product_id:paramsMaidian.productid,shop_id:paramsMaidian.shopid}
                    ))
                });

                /* 旧协议. */
                com.sendParams(2, 'productDetail.html', {
                    proId: proId,
                    shopId: shopId
                });
            },
            linkMore:function(){
                // AppInterface.call('/product/seeMore', {
                //     productId: proId,
                //     shopId: params.shopId
                // });
                // AppInterface.call('/common/statistics', {
                //     code: 'B000W001',
                //     name: '为你推荐更多按钮',
                //     user_id: base64.encode(paramsMaidian.userid),
                //     url: base64.encode(paramsMaidian.url),
                //     cook_id: base64.encode(paramsMaidian.cookid)
                //     // shop_id:base64.encode(paramsMaidian.shopid),
                //     // product_id:base64.encode(paramsMaidian.productid)
                // });
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('B000W001'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'为你推荐更多按钮',user_id:paramsMaidian.userid,url:paramsMaidian.url,cook_id:paramsMaidian.cookid,shop_id:paramsMaidian.productid}
                    ))
                });
                com.sendParams(2, 'likemore.html', {
                    proId: proId,
                    shopId: params.shopId
                });
            },
            bigImg:function(images,index){
				console.log(images, index);
                this.index = index;
                this.bigImgList = images;
                w_preview(this.bigImgList[index]);
                zp('body').bind('touchmove', ontouchmove);
            }
        }
    });

    com.postData('/goods/evaluates', {
        proId: proId
    }, function (res){
        if(res && res.length < 10){
            com.vm.isend = 1;
        }

        if(res && res.length > 0){
            vm.evtorList = res.map(function(item){
                item.score = Math.floor(item.score);
                item.evtTime = com.convertTime(item.evtTime);
                item.evtorName = com.replaceName(item.evtorName);
                return item;
            });
        }

        if(evaluate){
            vm.isOne = false;
            vm.isTwo = false;
            vm.isThree = true;
        }
    });

    function addDrop() {
        $.upload('.tab_body','/goods/evaluates',{
            proId: proId
        }, function (res) {
            var newEvtorList = [];
            var len, i;

            if(res && res.length < 10){
                com.vm.isend = 1;
            }

            if(res && res.length > 0){
                newEvtorList = res.map(function(item){
                    item.score = Math.floor(item.score);
                    item.evtTime = com.convertTime(item.evtTime);
                    item.evtorName = com.replaceName(item.evtorName);
                    return item;
                });

                for(len = newEvtorList.length, i = 0; i < len; i++) {
                    vm.evtorList.push(newEvtorList[i]);
                }
            }
        });
    }


    if(evaluate){
        vm.isOne = false;
        vm.isTwo = false;
        vm.isThree = true;
        addDrop();
    }

    function ontouchmove(event){
        event.preventDefault();
    }

    function w_preview(src){
        if(document.getElementById('w_preview')){
            return;
        }

        var div = document.createElement('div');

        div.id = 'w_preview';
        div.innerHTML = '<img src="'+src+'">';

        document.body.appendChild(div);

        zp('#w_preview').tap(function(){
            vm.index = 0;
            vm.bigImgList = [];
            if(document.getElementById('w_preview')){
                document.body.removeChild(div);
            }
            zp('body').unbind('touchmove',ontouchmove);
        });

        zp('#w_preview').swipeLeft(function(){
            if(vm.index < vm.bigImgList.length - 1){
                div.innerHTML = '<img src="' + vm.bigImgList[vm.index + 1] + '">';
                vm.index++;
            }
        });

         zp('#w_preview').swipeRight(function(){
            if(vm.index > 0){
                div.innerHTML = '<img src="' + vm.bigImgList[vm.index - 1] + '">';
                vm.index--;
            }
        });
    }
});
