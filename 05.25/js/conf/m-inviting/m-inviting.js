// shangjia
define('conf/m-inviting/m-inviting.js',function(require,exports,module) {
	require('$');
	require('utils/appInterface.js');
	// require('utils/qrcode.js');
    require('mods/buried.js');
	var base64 = require('utils/base64.js');

    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);

    AppInterface.buried( 'P000W005','邀请商家页');

 //    $('#qrcode').qrcode({
	// 	data:sellerEnterUrl	
 //        // data:encodeURI(str)
	// });
    var oIvitArr = [
        {type:'out-QQ'},
        {type:'out-Qqzone'},
        {type:'out-weixin'},
        {type:'out-pyq'},
        {type:'out-xlwb'},
        // 'out-QQ','out-QQ','out-QQ','out-QQ','out-QQ'
    ];
   
	$('.liwx').on('click',function(){
	    AppInterface.call('/common/share',{
            type:'weixin',
            title:'邀请您入驻国美+',
            desc:'新平台，新机遇，期待你的加入。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(sellerEnterUrl)
            
        },function(data){
            if(data.success){
                AppInterface.toast('分享成功');
                AppInterface.buried( 'B000W003','微信邀请',oIvitArr[2]);
            }
        });      
	});

	$('.lipyq').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'pengyouquan',
            title:'邀请您入驻国美+ ',
            desc:'新平台，新机遇，期待你的加入。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(sellerEnterUrl)
        },function(data){
            if(data.success){
                AppInterface.toast('分享成功');
                AppInterface.buried( 'B000W003','微信朋友圈邀请',oIvitArr[3]);

            }
        });
	});

	$('.liqq').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'qq',
            title:'邀请您入驻国美+ ',
            desc:'新平台，新机遇，期待你的加入。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(sellerEnterUrl)
        },function(data){
            if(data.success){
                AppInterface.toast('分享成功');
                AppInterface.buried( 'B000W003','qq邀请',oIvitArr[0]);
            }
        });
	});

	$('.lizone').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'qqzone',
            title:'邀请您入驻国美+ ',
            desc:'新平台，新机遇，期待你的加入。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(sellerEnterUrl)
        },function(data){
            if(data.success){
                AppInterface.toast('分享成功');
                AppInterface.buried( 'B000W003','qq空间邀请',oIvitArr[1]);

            }
        });
	});

	$('.liwb').on('click',function(){
	     AppInterface.call('/common/share',{
            type:'weibo',
            title:'邀请您入驻国美+ ',
            desc:'新平台，新机遇，期待你的加入。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(sellerEnterUrl)

        },function(data){
            if(data.success){
                AppInterface.toast('分享成功');
                AppInterface.buried( 'B000W003','微博邀请',oIvitArr[4]);
            }
        });
	});

	
});


