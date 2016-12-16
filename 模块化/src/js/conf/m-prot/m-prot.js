define('conf/m-prot/m-prot.js',function(require,exports,module) {
	require('$');
    require('utils/appInterface.js');
    require('mods/buried.js');    
    require('vendors/lazyload.js');
    $("img").picLazyLoad({effect: "fadeIn"});
    var common = require('lib/common.js');
    var base64 = require('utils/base64.js');
    var Vue = require('vendors/vue.js');
    var dropload = require('vendors/dropload.js');
    var touchSlide = require('vendors/TouchSlide.js');
    var Ajax = require('utils/ajax.js');
    var shopId = common.getParams()['shopId'];
    var Replace = require('mods/replace.js');
    Replace.wordLimit($('p.foryou-shop-font1'));
    var FastClick = require('vendors/fastclick.js');
    var storage=require('mods/storage.js');
	var params={};
    params['url'] = location.href;
    params['userid'] = window.userId || 0;
    params['cookid'] = storage.getCookie('PHPSESSID') || 0;
    // AppInterface.call('/common/statistics', {
    //     code: 'P000W002',
    //     name: '促销活动页',
    //     user_id: base64.encode(params.userid),
    //     url: base64.encode(params.url),
    //     cook_id: base64.encode(params.cookid)
    //             // param: base64.encode(JSON.stringify({uid: params.userid,url:params.url,cook_id:params.cookid}))
    // });
    
    AppInterface.call('/common/statistics', {
        code: encodeURIComponent('P000W002'),               
        desc: encodeURIComponent(JSON.stringify(
            {name:'促销活动页',user_id: params.userid,url:params.url,cook_id:params.cookid}
        ))
    });

	//No network	
	if('onLine' in navigator && !navigator.onLine){		
		$('#prot-noact').css('display','none');	
		$('#prot-nonet').css('display','block');		
	};
	//No activity
	if (!($("ul > li").length < 0))  {			
		$('#prot-noact').css('display','block');		
	};
	// reload
	$('#prot-reload').on('click',function(){
		document.location.reload();
	});
});


	








