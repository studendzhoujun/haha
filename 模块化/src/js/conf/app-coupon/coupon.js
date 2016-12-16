
define('conf/app-coupon/coupon.js', function (require, exports, module) {
	require('$');
	// require('conf/app-coupon/vconsole.min.js')
  	var AppInterface = require('utils/appInterface.js');
  	var base64 = require('utils/base64.js');
  	var storage = require('mods/storage.js');
  	var Ajax = require('utils/ajax.js');
  	var params={};
  	var imgPre =  cssPre.replace('https','http'),
  	oImgUrl = imgPre+'/images/app-coupon/gomeplus-logo.png',
  	oTitle = '国美+，一大波优惠劵为您奉上',
	oDesc = '【国美+】，把最超值的优惠带给您，还有海量优惠劵等您来抢',
  	oUrl = h5CouponUrl ,
	oWurl = mCouponUrl ,
	oRedpacketid = $('#drawR').attr('redpacketid'),
	oCouponbatchsn = $('#drawR').attr('couponbatchsn'),
	oAction = '/coupon/draw?redPacketId='+oRedpacketid+'&couponBatchSn='+oCouponbatchsn;
	params['url'] = location.href;
	params['userid'] = window.userId || 0;
	params['cookid'] = storage.getCookie('PHPSESSID') || 0;      
	init();
	try{
       var isRec = isReceived;
	}catch(e){
       // console.log('222222');
	}
	// var isRec = isReceived||'';
	if(isRec == 1){
		AppInterface.toast('您已经领取过该优惠券了');
		// alert(1);
	}
	function init(){
		AppInterface.call('/common/updateShareContents',{
			title: encodeURIComponent(oTitle),
			desc: encodeURIComponent(oDesc),
			imgUrl: base64.encode(oImgUrl),
			shareUrl: base64.encode(oWurl),
			shareAppUrl: base64.encode(oUrl)
		});
		rLogin(Rcallback);
		oSumClick();
	};
	// 埋点
	AppInterface.call('/common/statistics', {
		code: encodeURIComponent('PA0909H01'),               
		desc: encodeURIComponent(JSON.stringify({
		  name:'优惠卷',
		  user_id: params.userid,
		  url:params.url,
		  cook_id:params.cookid}
		))
	});
	// 登录函数
	function rLogin(callback){
		AppInterface.call('/common/getLoginStatus', function (data) {
	        if (data.success) {
	        	//登录状态
	            // alert('denglu');
	            storage.setCookie('userId', data.data.userId);
	            storage.setCookie('token', data.data.token);
	            callback();
	        } else {
	            AppInterface.call('/common/logout', function (data) {
	                if (data.success) {
	                	// alert('logout');
	                    AppInterface.call('/common/login', function (data) {
	                        if (data.success) {
	                        	// 登录
	                            storage.setCookie('userId', data.data.userId);
	                            storage.setCookie('token', data.data.token);
	                            callback();
	                        }
	                    });
	                }
	            });
	        }
		});
	}
	// callback函数返回
	function Rcallback(){
		return;
	};
	// 点击函数
	function oSumClick(){
		// 去领取
		$('#drawR').on('click',function(){
			AppInterface.call('/common/statistics', {
				code: encodeURIComponent('BA0909H02'),               
				desc: encodeURIComponent(JSON.stringify({
				  name:'马上领取',
				  user_id: params.userid,
				  url:params.url,
				  cook_id:params.cookid}
				))
			});	
    		rLogin(oDraw);
    		// oDraw();
        });
        $('#useR').on('click',function(){
        	AppInterface.call('/common/statistics', {
				code: encodeURIComponent('BA0909H01'),               
				desc: encodeURIComponent(JSON.stringify({
				  name:'去使用',
				  user_id: params.userid,
				  url:params.url,
				  cook_id:params.cookid}
				))
			});	
        	rLogin(oUseR);
        });
	};
	// 跳到我的账户
	function oUseR(){
		AppInterface.call('/mine/account');
	};
	// 提交表单
	function oDraw(){
		Ajax.query('/coupon/draw',{
			redPacketId:oRedpacketid,
			couponBatchSn:oCouponbatchsn
		},function(data){
			console.log(data);
			if(data.code == 200 && data != ""){
				window.location.reload();
			}else if(data.code == 422){
				$('.coupon-no').html('您来晚了，优惠劵抢完了');
				$('#drawForm').css('display','none');
				$('.coupon-no').css('display','block');
			}else{
				$('.coupon-no').html('领取失败了，重来一次吧');
				$('.coupon-no').css('display','block');	
			}
		})
		// AppInterface.toast(oLingqu);
	};
	// 判断版本号
	// console.log(storage.getCookie('commonParams'));
	// var oAppVersion = storage.getCookie('commonParams')?JSON.parse(storage.getCookie('commonParams')):'';
	// var oAppVersion = storage.getCookie('commonParams')||'';
	// console.log(oAppVersion.toString());
	// if(oAppVersion > '1.10'){

	// }
});