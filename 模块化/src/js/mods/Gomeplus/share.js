/**
 * Created by lishengyong on 2016/7/13.
 */
define('mods/Gomeplus/share',function(require,exports,module){
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');
    module.exports = {
        shareTo: function(id ,param) {
            // 戳我炫一下 分享
            $('#' + id).on('click', function(){
                // 分享
                var p = {
                    type: encodeURIComponent('default'),
                    title: encodeURIComponent(param.title),
                    desc: encodeURIComponent(param.desc)
                };
                if(param.imgUrl) {
                    p.imgUrl = encodeURIComponent(base64.encode(param.imgUrl));
                }
                if(param.link) {
                    p.link = encodeURIComponent(base64.encode(param.link));
                }
                if(param.shareAppUrl) {
                    p.shareAppUrl = encodeURIComponent(base64.encode(param.shareAppUrl));
                }
                AppInterface.call('/common/share', p, function(data) {
                    if (data.success) {
                        $('.window-share').animate({
                            bottom: '-4rem'
                        }, 200);
                        $('.window-bg').hide();
                    }
                });
            });
        }
    }
});