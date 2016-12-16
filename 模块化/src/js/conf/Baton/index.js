/**
 * 接利棒
 * @yanglang
 * @2016.03.01
 * 页面引用
 *  <script src="__PUBLIC__/js/lithe.js"
 data-config="config.js"
 data-debug="true"
 data-main="conf/Baton/index.js">
 </script>
 */
define('conf/Baton/index.js', function (require, exports, module) {
    require('$');
    require('utils/appInterface.js');
    require('vendors/zepto-fx.js');
    require('mods/buried.js');
    var common = require('lib/common.js');
    var base64 = require('utils/base64.js');
    var Ajax = require('utils/ajax.js');
    var check=require('mods/check.js');
    var storage = require('mods/storage.js');
    var appEvent=require('mods/appEvent')
    //by zhoujun  2016.03.04
    //测试用
    console.log('userId='+userId+'shareUrl='+shareUrl);
    //要分享的参数配置
    var title='出发吧！全民接“利”赛，一起参赛赢豪礼';
    var link=shareUrl;
    var desc='我与壕礼只差一个你的距离，快来与我一起赢取壕礼！';
    var imgUrl='http://m.dev.gomeplus.com/Public/src/images/banner.jpg';
    //页面的埋点js
    AppInterface.call('/common/statistics', {
            code: 'JLS00W01',
            desc: '接力首页'
    });
    $('.index-header .a-btn').click(function(){
        $('.window-bg').show();
        $('.window-message').show();
        $('.window-close').click(function(){
            $('.window-bg').hide();
            $('.window-message').hide();
        });
        AppInterface.call('/common/statistics', {
            code: 'JLS00W02',
            desc: '接力全攻略'
        });
    });
    $('.list-more').click(function(){
         AppInterface.call('/common/statistics', {
            code: 'JLS00W04',
            desc: '更多商品'
        });
    });
    $('.down-btn').click(function(){         //立即体验和下载客户端
       // appEvent.appDownload();              //下载app
        location.href=downloadUrl;
        AppInterface.call('/common/statistics', {
            code: 'JLS00W07',
            desc: '立即体验'
        });
    });
    $('.share-btn').click(function(){        //未登录状态分享
        AppInterface.call('/common/statistics', {
            code: 'JLS00W05',
            desc: '分享'
        });
        if(userId==0){
           $('.window-share').animate({bottom:'0rem'},200);
           $('.change-btn').click(function(){
             $('.window-share').animate({bottom:'-4rem'},200);
           });
            //分享到威信
           $('.window-share li').eq(0).click(function(){
                console.log('分享到微信')
                AppInterface.call('/common/share',{
                        type:'weixin',
                        title:title,
                        desc:desc,
                        imgUrl:base64.encode(imgUrl),
                        link:base64.encode(link)
                    },function(data){
                        if(data.success){
                            AppInterface.toast('分享成功');
                            $('.window-share').animate({bottom:'-4rem'},200);
                            $('.window-bg').hide();
                        }
                 });
           });
           //分享到朋友
          $('.window-share li').eq(1).click(function(){
                 console.log('分享到朋友圈')
                 AppInterface.call('/common/share',{
                        type:'pengyouquan',
                        title:title,
                        desc:desc,
                        imgUrl:base64.encode(imgUrl),
                        link:base64.encode(link)
                    },function(data){
                        if(data.success){
                            AppInterface.toast('分享成功');
                           $('.window-share').animate({bottom:'-4rem'},200);
                           $('.window-bg').hide();
                        }
                   });
            })
        }
    });

    $('#more').click(function(){
        //跳到专题页
    });
    //中间的商品点击跳转
    $('.index-main-list li a').click(function(){
        var productid=$(this).attr('productid');
        var shopid=$(this).attr('shopid');
        var producturl=$(this).attr('producturl');
        AppInterface.call('/product/detail', {shopId: shopid, productId: productid});
        AppInterface.call('/common/statistics', {
            code: 'JLS00W08',
            desc: '爆品',
            param: base64.encode(JSON.stringify({shopId: shopid, productId: productid}))
        });
    });
    //H5内嵌环境下我要参赛或者我要分享点击
    $('.submit-btn').click(function(){
          appH5();
          AppInterface.call('/common/statistics', {
            code: 'JLS00W03',
            desc: '参赛'
         });
    });
    //appH5
    function appH5(){
            if(userId==0){  //未登录,先注销再调登录
                AppInterface.call('/common/logout',function(data){
                     if(data.success){
                         AppInterface.call('/common/login',function(data){
                              if(data.success){
                                    userId=data.data.userId;//登录成功返回userId，重写userId此时为登录状态
                                    storage.setCookie('userId',data.data.userId);
                                    storage.setCookie('token',data.data.token);
                                    appH5Share() //进行分享
                                }
                         })
                     }
                })
            }else{  //userId 有值 (登录状态)>>>加积分
                addScore(userId,0,1,1)//  非本次活动产生的邀请关系不给推荐人加分；
                appH5Share();    //进行分享
            }
    }
    //appH5Share
    function appH5Share(){
         $('.window-share').animate({bottom:'0rem'},200);
         $('.window-bg').show();
         $('.change-btn').click(function(){
            $('.window-share').animate({bottom:'-4rem'},200);
            $('.window-bg').hide();
         });
         //分享到威信
         $('.window-share li').eq(0).click(function(){
            console.log('分享到微信')
            AppInterface.call('/common/share',{
                    type:'weixin',
                    title:title,
                    desc:desc,
                    imgUrl:base64.encode(imgUrl),
                    link:base64.encode(link)
                },function(data){
                    if(data.success){
                        AppInterface.toast('分享成功');
                        $('.window-share').animate({bottom:'-4rem'},200);
                        $('.window-bg').hide();
                        scoreRank(userId);
                    }
             });
        });
        //分享到朋友
         $('.window-share li').eq(1).click(function(){
             console.log('分享到朋友圈')
             AppInterface.call('/common/share',{
                    type:'pengyouquan',
                    title:title,
                    desc:desc,
                    imgUrl:base64.encode(imgUrl),
                    link:base64.encode(link)
                },function(data){
                    if(data.success){
                        AppInterface.toast('分享成功');
                       $('.window-share').animate({bottom:'-4rem'},200);
                       $('.window-bg').hide();
                       scoreRank(userId)
                    }
             });
         })
    }
    //userId:用户id
    //recomUserId:上一级推荐用户Id或者新用户注册Id
    //type行为类型:1:主动分享：2:用户注册  //判断不出（干掉）
    //source:调用来源：1：app,2:h5
    //type:1手动分享；2：自动分享
    function addScore(userId,shareUserId,source,type){   //加积分;
        Ajax.query('/baton/addScore',{userId:userId,recomUserId:shareUserId,source:source,type:type},function(data){
                if(data.success){
                    console.log(data.data);
                }
        })
    }
    function scoreRank(userId){
         Ajax.query('/baton/scoreRank',{userId:userId},function(data){
                if(data.success){
                   console.log(data.data);
                    var scoreObj=data.data;
                    var scoreHtml='<p>我的排名:NO.'+scoreObj.rank+'</p><p>魅力值：'+scoreObj.score+'</p>';
                    $('.text-share').html(scoreHtml);
                    $('.submit-btn').addClass('submit-btn2');
                }
        })
    };
   
     $('.window-bg').hide();
    //tab 切换
    tabChange();
    function tabChange(){
        $('#top-tab span').click(function(){
            $('#top-tab span').removeClass('active');
            $(this).toggleClass('active');
            var index=$(this).index();
            /*if(index==1){
                index=2;
            }else{
                index=0;
            }*/
            $('.index-main-top100 div').hide();
            $('.index-main-top100 div').eq(index).show();
        });
    }

       /* $('#influence').click(function(){
                var html=$('#list1 table tbody').html();
                $('#list1 table tbody')[0].innerHTML+=html;
            });*/
        //top100加载更多
        var oTop100=document.querySelector('.tabTop100 tbody');
        var aTr=oTop100.children;
        var aTrNum=aTr.length;
        var num=null;
        if(aTrNum<20){
            num=aTrNum;
        }else{
            num=20;
        }
        showList(num);
        function showList(num){
            for(var i=0;i<num;i++){
                aTr[i].style.display='inline';
            }
        }
        $('#topNum').click(function(){ //点击显示更多
                num+=20;
              if(num>aTrNum){
                num=aTrNum;
              }
              showList(num);
        });

});