define('conf/app-redpacket/redpacketlist.js', function (require, exports, module) {
    require('$');
    require('utils/appInterface.js');
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
        Ajax.query('/op/redpacket/getredpacketlist', {shopId: shopId,  pageNum: pageNum,couponChannel:couponChannel}, function (data) {
            if(!data.data) return;
            var i = 0, itemList = data.data.redPackList; len = itemList.length;
            for (; i < len; i++) {
                vueObj.items.push(itemList[i]);
            }
        });
    }


    /*领取优惠券*/
    $('#quanlist').on('click','li',function(){       
        if(userId==0){  //未登录,先注销再调登录
                AppInterface.call('/common/logout',function(data){
                     if(data.success){
                         AppInterface.call('/common/login',function(data){
                              if(data.success){
                                    userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态                                        
                                    storage.setCookie('userId',data.data.userId);
                                    storage.setCookie('token',data.data.token);
                                    var redPackId=$(this).attr('id');
                                    Ajax.query('/op/redpacket/getredpacket', {redPackId: redPackId,couponChannel:couponChannel}, function (data) {
                                        if (data.success) {                                             
                                            AppInterface.toast('优惠券领取成功');
                                        } else {                                            
                                            AppInterface.toast(data.message);
                                            return false;
                                        }
                                    }) 
                              }                                  
                         })                           
                     }
                })
        }else{  //userId 有值  
             var redPackId=$(this).attr('id');          
             Ajax.query('/op/redpacket/getredpacket', {redPackId: redPackId,couponChannel:couponChannel}, function (data) {
                if (data.success) {                    
                    AppInterface.toast('优惠券领取成功');
                } else {                    
                    AppInterface.toast(data.message);
                    return false;
                }
            }) 
        }        
    })



});