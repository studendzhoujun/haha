/**
 * 店铺优惠券列表模块脚本
 * @author yanglang
 * @date 20160115
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
 data-config="config.js"
 data-debug="true"
 data-main="conf/Redpacket/redpacketlist.js">
 </script>
 */
define('conf/Redpacket/redpacketlist.js', function (require, exports, module) {
    require('$');
    var Ajax = require('utils/ajax');
    var common = require('lib/common');
    var storage = require('mods/storage');
    var share = require('mods/share.js');
    var base64 = require('utils/base64');
    var replace = require('mods/replace');
    var appEvent=require('mods/appEvent');
    var UI = require('UI/alert');
    var Vue = require('vendors/vue.js');
    require('vendors/dropload.js');
    require('utils/calendar.js');
    common.init();
    init();
    bindEvent();
    var pageNum=1,vueObj;
    function init() {
        Vue.filter('dateFormat', function (date) {
            return Calendar.getInstance(date).format('yyyy-MM-dd');
        });
        vueObj = new Vue({
            el: '#shopRedPacketList-item-template',    //id
            data: {
                items: [],
                dateItems: []
            }
        });
    }

    function bindEvent() {
        var dropload = $('#quanlist').dropload({
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domUpdate: '<div class="dropload-update">↓释放加载</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
            },
            loadDownFn: function (me) {
                setTimeout(function () {
                    me.resetload();
                    fetchData(++pageNum, 0,couponChannel);              
                    
                }, 500);
            }
        });
        
    }

    function fetchData(pageNum, shopId,couponChannel) {
        Ajax.query('/activity/redpacket/getredpacketlist', {shopId: shopId,  pageNum: pageNum,couponChannel:couponChannel}, function (data) {
            if(!data.data) return;
            var i = 0, itemList = data.data.redPackList; len = itemList.length;
            for (; i < len; i++) {
                vueObj.items.push(itemList[i]);
            }
        });
    }


    /*领取优惠券*/
    $('#quanlist').on('click','li',function(){
        if (common.isLogin()) {
            var redPackId=$(this).attr('id');
            Ajax.query('/activity/redpacket/getredpacket', {redPackId: redPackId,couponChannel:couponChannel}, function (data) {
                if (data.success) {
                    UI.alerter('优惠券领取成功');
                } else {
                    UI.alerter(data.message);
                    return false;
                }
            })
        }else{
            var href=base64.encode(location.href);
            window.location.href="/login/index?redirect="+href;
        }
    })



});