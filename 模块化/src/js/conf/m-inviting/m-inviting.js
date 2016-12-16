// shangjia
define('conf/m-inviting/m-inviting.js',function(require,exports,module) {
    require('$');
    require('utils/appInterface.js');
    // require('utils/qrcode.js');
    require('mods/buried.js');
    var base64 = require('utils/base64.js');
    var storage = require('mods/storage.js');
    var FastClick = require('vendors/fastclick.js');
    FastClick.attach(document.body);
    var params={};
    params['url'] = location.href;
    params['userid'] = window.userId || 0;
    params['cookid'] = storage.getCookie('PHPSESSID') || 0;
    AppInterface.call('/common/statistics', {
                code: encodeURIComponent('P000W007'),               
                desc: encodeURIComponent(JSON.stringify(
                    {name:'邀请商家页',user_id: params.userid,url:params.url,cook_id:params.cookid}
                ))
    });  
      
    var oIvitArr = ['out-QQ','out-Qqzone','out-weixin','out-pyq','out-xlwb'];        
   
    $('.liwx').on('click',function(){
        AppInterface.call('/common/share',{
            type:'weixin',
            title:'邀请您入驻国美+',
            desc:'新平台，新机遇，期待你的加入。',
            imgUrl:base64.encode(imagePath),
            link:base64.encode(sellerEnterUrl)            
        },function(data){
            if(data.success){
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('M000W017'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,channel_id:oIvitArr[2]}
                    ))
                });  
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
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('M000W017'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,channel_id:oIvitArr[3]}
                    ))
                }); 
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
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('M000W017'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,channel_id:oIvitArr[0]}
                    ))
                }); 
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
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('M000W017'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,channel_id:oIvitArr[1]}
                    ))
                }); 
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
                AppInterface.call('/common/statistics', {
                    code: encodeURIComponent('M000W017'),               
                    desc: encodeURIComponent(JSON.stringify(
                        {name:'按钮点击',user_id: params.userid,url:params.url,cook_id:params.cookid,channel_id:oIvitArr[4]}
                    ))
                }); 
            }
        });
    });

    
});

