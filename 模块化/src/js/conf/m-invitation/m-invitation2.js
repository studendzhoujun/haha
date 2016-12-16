// haoyou
define('conf/m-invitation/m-invitation2',function(require,exports,module) {
	require('$');
	require('utils/appInterface.js');	
    require('mods/buried.js');
    var storage = require('mods/storage.js');
	var base64 = require('utils/base64.js');
    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body); 
    var params={};
    params['url'] = location.href;
    params['userid'] = window.userId || 0;
    params['cookid'] = storage.getCookie('PHPSESSID') || 0;
   // var qcode = "http://mxpic.gome.cn/v1/img/T1Ny_TBmYT1RXrhCrK.jpg";
    // 埋点
    // AppInterface.buried( 'P000W005','邀请好友页');  
    //  AppInterface.call('/common/statistics', {
    //             code: 'P000W005',
    //             name: '邀请好友页',
    //             uid: base64.encode(params.userid),
    //             url: base64.encode(params.url),
    //             cook_id: base64.encode(params.cookid)
    //             // param: base64.encode(JSON.stringify({uid: params.userid,url:params.url,cook_id:params.cookid}))
    // });
    AppInterface.call('/common/statistics', {
                code: encodeURIComponent('P000W005'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'邀请好友页',user_id: params.userid,url:params.url,cook_id:params.cookid}
                ))
    });          
    var oIvitArr = [
        {type:'out-QQ'},
        {type:'out-Qqzone'},
        {type:'out-weixin'},
        {type:'out-pyq'},
        {type:'out-xlwb'}
    ];
    $('.save').click(function(){
    	AppInterface.call('/common/savePicture',{ picUrl:Base64.encode(qcode)  });
    });
    $('.m-part_th dl .m-list-fl').click(function(){
    	var iUserId = $(this).attr('data-userid');
    	console.log(iUserId);
    	AppInterface.call('/im/userDetail',{ userId:iUserId });
    });


    function gotoTop(obj,time){
        if(time>30){
            var s = Math.round(time/30);
        }else{
            var s = 1;
        }
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            var t = obj.scrollTop;
            var speed = (0-t)/(s/2);
            speed = speed>0?Math.ceil(speed):Math.floor(speed);
            obj.scrollTop = t + speed;
            var bOk = true;
            if(obj.scrollTop!=0){
                bOk = false;
            }
            if(bOk){
                clearInterval(obj.timer);
            }
        },30);
    }

    /* 二维码点击事件. */
    // $('#qrcode').click(function () {
    //  gotoTop(document.body, 100);
    //  $('body').css('overflow', 'hidden');
    //  $(this).addClass('scan');
    //  $('.m-invitation .mask, .m-part_t .save , .canvas-box .close').css('display', 'block');
    //  AppInterface.call('common/updateTitleStatus', {type: '0'});
    // });
    $('#qrcode').longTap(function () {
        console.log('save');
        AppInterface.call('/common/savePicture', {picUrl: encodeURIComponent(Base64.encode(qcode)) });
    });
    
    $('.m-invitation .mask').click(function(){
        $('body').css('overflow','auto');
        $(this).css('display','none');
        $('.m-part_t .save').css('display','none');
        $('.canvas-box .close').css('display','none');
        $('#qrcode').removeClass('scan');
        AppInterface.call('common/updateTitleStatus',{type:'1'}); 
    });
    $('.canvas-box .close').click(function(){
        $('body').css('overflow','auto');
        $(this).css('display','none');
        $('#qrcode').removeClass('scan');
        $('.m-part_t .save').css('display','none');
        $('.m-invitation .mask').css('display','none');
        AppInterface.call('common/updateTitleStatus',{type:'1'}); 

    });

    // 加载更多
    $('.more').click(function(){
    	$('.invite-div2').css('display','block');
        $('.invite-morep').css('display','none');
        $('.invite-top').css('display','block');
    });
    // 缩小
    $('.invite-top .top').click(function(){
        $('.invite-div2').css('display','none');
         $('.invite-morep').css('display','block');
        $('.invite-top').css('display','none');
    });

   // 分享
	$('.liwx').on('click',function(){
	    AppInterface.call('/common/share',{
            type:'weixin',
            title:'加入国美+，一起赚丰厚返利佣金',
            desc:'这有耍贱卖萌的大神，有带着丰厚返利的国美精选好货，还有我。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)            
        },function(data){
            if(data.success){
                // AppInterface.toast('分享成功');
               AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('B000W003'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,type:oIvitArr[2]}
                    ))
                }); 

            }
        });      
	});

	$('.lipyq').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'pengyouquan',
            title:'加入国美+，一起赚丰厚返利佣金',
            desc:'这有耍贱卖萌的大神，有带着丰厚返利的国美精选好货，还有我。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str) 
        },function(data){
            if(data.success){
                // AppInterface.toast('分享成功');
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('B000W003'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,type:oIvitArr[3]}
                    ))
                });  
            }
        });
	});

	$('.liqq').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'qq',
            title:'加入国美+，一起赚丰厚返利佣金',
            desc:'这有耍贱卖萌的大神，有带着丰厚返利的国美精选好货，还有我。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)

        },function(data){
            if(data.success){
                // AppInterface.toast('分享成功');
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('B000W003'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,type:oIvitArr[0]}
                    ))
                });  
            }
        });
	});

	$('.lizone').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'qqzone',
            title:'加入国美+，一起赚丰厚返利佣金',
            desc:'这有耍贱卖萌的大神，有带着丰厚返利的国美精选好货，还有我。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)        

        },function(data){
            if(data.success){
                // AppInterface.toast('分享成功');
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('B000W003'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,type:oIvitArr[1]}
                    ))
                });  
            }
        });
	});
	$('.liwb').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'weibo',
            title:'加入国美+，一起赚丰厚返利佣金',
            desc:'这有耍贱卖萌的大神，有带着丰厚返利的国美精选好货，还有我。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)

        },function(data){
            if(data.success){
                // AppInterface.toast('分享成功');
               AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('B000W003'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,type:oIvitArr[4]}
                    ))
                });  

            }
        });
	});	







    
});





























