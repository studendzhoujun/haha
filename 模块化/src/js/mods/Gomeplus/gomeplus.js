/**
 * Created by lishengyong on 2016/7/22.
 * 玩赚国美+  模块
 *
 */

define('mods/Gomeplus/gomeplus.js', function(require, exports , module) {
    require('$');
    require('utils/appInterface.js');
    var storage = require('mods/storage.js');
    var base64 = require('utils/base64.js');
    var Login = require('mods/isLogin.js');
    // 查询用户玩赚国美+  角色信息
    // var userOpt = require('mods/Gomeplus/getUserState.js');

    module.exports = {
        clickFlag:false,
        cookieDomain: '.gomeplus.com',
        urlPre: location.protocol + '//' + location.hostname,
        dataUrl : location.protocol + '//' + location.hostname + '/index/playgomeplus',
        defaultImg: imgUrlPrefix + '/images/newindex/gg-img002.jpg',
        /**
         * app从逛逛首页切换走之后，再回到逛逛首页，调用改方法。
         * 判断当前用户是否登录， 如果登陆了，调用接口查询用户任务状态，在玩赚国美+横切显示位置显示已登录入口。
         * 没有登录，则在玩赚国美+横切显示位置显示未登录入口。
         */
        initGomeplus:function(){
            var me = this;
            $('#gotoGomeplus').off();
            /**
             * 获取登录状态的协议
             */
            AppInterface.call('/common/getLoginStatus', function (data) {
                console.log(data);
                if (data.success) {
                    storage.setCookieDomain('userId', data.data.userId, me.cookieDomain);
                    storage.setCookieDomain('token', data.data.token, me.cookieDomain);
                    // 请求玩赚国美+任务接口数据*/
                    $.ajax({
                        type:'GET',
                        url: me.dataUrl,
                        data:{},
                        success: function (data) {
                            // 测试用
                            // data.data = null;
                            if(data.data && Object.keys(data.data).length > 0) {
                                me.loginEntry(data.data);
                            } else {
                                me.notLoginEntry();
                            }
                        },
                        error: function (data) {
                            console.log(data);
                            me.notLoginEntry();
                        }
                    });
                } else {
                    me.notLoginEntry();
                }
            });
        },
        /**
         * 登录模板处理
         * data: {
                test: 1,
                title: "邀请好友蛤蛤蛤蛤",
                desc: "邀请好友得返利",
                button: "去邀请",
                gold: 154000,
                userImg: "https://i-pre.meixincdn.com/T1IFYTB4ZT1R4cSCrK.png"
            }
         */
        loginEntry:function(data){
            // 默认图片位置：  /images/newindex/gg-img002.jpg
            // 拼装模板
            var me = this;
            var content = '<div class="gg-gome-left"><div class="gg-gome-img"></div>';
            content += '<h4 class="gg-h4">' + data.title + '</h4>';
            content += '<div class="gg-con">'+ data.desc + '<br>';
            content += '<p>当前进度：累计赚取<span>' + data.gold + '</span>国美币</p>';
            content += '</div></div>';
            content += '<div class="gg-gome-right">';
            if(data.userImg) {
                content += '<img src="' + data.userImg +'" class="gg-gome-img1"/>';
            } else {
                content += '<img src="' +  me.defaultImg + '" class="gg-gome-img1"/>';
            }
            content += '<a href="javascript:;" class="gg-invite-btn">' + data.button + '<em class="icon icon07"></em></a>';
            content += '</div>';
            $('.gg-gomeadd')[0].innerHTML = '';
            $('.gg-gomeadd')[0].innerHTML = content;
            me.toGomeplus('gotoGomeplus');
        },
        /**
         * 未登录模板处理
         */
        notLoginEntry:function() {
            var me = this;
            var preUrl = location.protocol + '//' + location.hostname;
            var content = '<div class="gg-gome-left">' +
                '<div class="gg-gome-img"></div>' +
                '<h4 class="gg-p1">闯关任务，疯狂赚取国美币</h4><a href="javascript:;" id="gotoGomeplus" class="gg-invite-btn">去闯关<em class="icon icon07"></em></a>'
                + '</div>'
                + '<div class="gg-gome-right">'
                + '<img src="' + me.defaultImg + '"  class="gg-gome-img2"/>'
                + '</div>';
            $('.gg-gomeadd')[0].innerHTML = '';
            $('.gg-gomeadd')[0].innerHTML = content;
            me.toGomeplus('gotoGomeplus');
        },
        toGomeplus: function(id) {
            var me = this;
                $('#' + id).on('click', function(){
                    Login.goLogin(function () {
                        // userOpt.userTaskInfo(me, me.getUserTaskCallB);
                        if(!me.clickFlag) {
                            me.clickFlag = true;
                            $.ajax({
                                type:'get',
                                url: '/playgomeplus/userTaskInfoApi',
                                data: {},
                                dataType: 'json',
                                success: function(data){
                                    me.getUserTaskCallB(data);
                                },
                                error: function(xhr, type){
                                    console.log('Ajax error!');
                                    me.clickFlag = false;
                                }
                            });
                        }
                    });
                });
        },
        getUserTaskCallB: function(data) {
            var me = this;
            // 查询当前用户角色， 如果有角色，跳转之后要做分享。
            var url = location.protocol + '//' + location.hostname + '/playgomeplus/index';
            var shareUrl = '';
            if(data && data.data && data.data.userCharacter && data.data.userCharacter.character
                && Object.keys(data.data.userCharacter.character).length > 0) {
                // var uid = data.data.userCharacter.uid;
                shareUrl = data.shareUrl;
                var param = {
                    url: encodeURIComponent(base64.encode(url)),
                    noHistory:1,
                    type:2,
                    title:encodeURIComponent('在国美+，我是' + data.data.userCharacter.character.name),
                    desc:encodeURIComponent('在不同地点总会扮演不同的角色，你在这里会有什么样的角色？'), //data.data.userCharacter.character.description
                    imgUrl:base64.encode(data.data.userCharacter.character.imgUrl),
                    shareUrl:base64.encode(shareUrl),
                    shareAppUrl:base64.encode(url)
                }
                me.clickFlag = false;
                AppInterface.call('/common/localJump', param);
            } else {
                me.clickFlag = false;
                AppInterface.call('/common/localJump', {url: encodeURIComponent(base64.encode(url)), noHistory:1});
            }
        }
    }

});