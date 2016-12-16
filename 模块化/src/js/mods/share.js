//sharetype 1-qqzone 2-sina
//pageType 1-商品详情页 2-店铺详情页面 3-店铺优惠券 4-优惠券列表
define('mods/share.js',function(require,exports,module){
    var com = require('lib/common')
        $ = require('vendors/zepto');
    module.exports = {
        getShareParams:function(sharetype,pageType,imgsrc,shopName,uri){
            var url = '';
            if(pageType == 1){
                var urlObj=com.getParams(location.href),
                    nowUrl=location.href.substr(0,location.href.indexOf('?'));
                if(urlObj['kId']!='0' && urlObj['kId']!=undefined){
                    url=nowUrl+'?kId='+$('.tanchufenxi').attr('kId')+'&productId='+urlObj['productId']+'&shopId='+urlObj['shopId'];
                }else{
                    url=uri?uri + '&kId='+$('.tanchufenxi').attr('kId'):nowUrl + '?kId='+$('.tanchufenxi').attr('kId')+'&productId='+urlObj['productId']+'&shopId='+urlObj['shopId'];
                }
                desc = '我在“国美+”发现了一个不错的商品快来看看吧亲';
            }else if(pageType == 2){
                url = location.href;
                desc = '我在“国美+”发现了一个不错的店铺快来看看吧亲';
            }else if(pageType == 3){
                url = location.href+'&k='+0;
                desc = '把最超值的优惠信息带到您的身边，国美+领券中心等你来抢....';
            }else if(pageType == 4){
                url = location.href;
                desc = '把最超值的优惠信息带到您的身边，国美+领券中心等你来抢....';
            }
            var params = {
                bdText : shopName,
                bdDesc : desc,
                bdUrl : url,
                bdPic : imgsrc,
                k:0
            }    
            if(sharetype==1){
                params.bdUrl=url.substr(7);
            }
            var search = '?url='+encodeURIComponent(params.bdUrl)+'&title='+encodeURIComponent(params.bdText)+'&pics='+encodeURIComponent(params.bdPic)+'&desc='+encodeURIComponent(params.bdDesc);
            
            switch(sharetype){
                case 1:
                    $('.tanchufenxi').hide();
                    window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'+search,"","_blank");break;
                case 2:
                    search += '&appkey=1343713053&searchPic=true'
                    location.assign('http://service.weibo.com/share/mobile.php'+search);
                    break;
            }
        }
    }
});