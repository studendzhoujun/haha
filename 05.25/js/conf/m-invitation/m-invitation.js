define('conf/m-invitation/m-invitation',function(require,exports,module) {
	require('$');
	require('utils/appInterface.js');	
    require('mods/buried.js');
	var base64 = require('utils/base64.js');

    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body); 
    

    
    // 埋点
    AppInterface.buried( 'P000W005','邀请好友页');   
    var oIvitArr = [
        {type:'out-QQ'},
        {type:'out-Qqzone'},
        {type:'out-weixin'},
        {type:'out-pyq'},
        {type:'out-xlwb'}
    ];
   // 分享
	$('.liwx').on('click',function(){
	    AppInterface.call('/common/share',{
            type:'weixin',
            title:'加入国美+，一起赚丰厚返利佣金！',
            desc:'这里有志同道合的伙伴，有优质商品，还有分享的返利哦',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)            
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
            title:'加入国美+，一起赚丰厚返利佣金！ ',
            desc:'这里有志同道合的伙伴，有优质商品，还有分享的返利哦',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str) 
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
            title:'加入国美+，一起赚丰厚返利佣金！ ',
            desc:'这里有志同道合的伙伴，有优质商品，还有分享的返利哦',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)

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
            title:'加入国美+，一起赚丰厚返利佣金！ ',
            desc:'这里有志同道合的伙伴，有优质商品，还有分享的返利哦',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)
            

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
            title:'加入国美+，一起赚丰厚返利佣金！ ',
            desc:'这里有志同道合的伙伴，有优质商品，还有分享的返利哦',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(str)

        },function(data){
            if(data.success){
                AppInterface.toast('分享成功');
                AppInterface.buried( 'B000W003','微博邀请',oIvitArr[4]);

            }
        });
	});	
});


