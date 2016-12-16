/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/getLikeDataFun", function(require,exports,module) {
    var $ = require('vendors/zepto');
    require('UI/lazyload-gm.js');

    function toText(html){
        return $('<div>').text(html).html();
    }


    function GetData(){
        //获取url传递的参数*/
        this.getLikeData = function(loadParams){
            if (!loadParams.firstNoData) {
                loadParams.loading = false;
                loadParams.flag && AppInterface.toast('没有更多数据了');
                return;
            }
            $.ajax({
                type: 'get',
                url: '/index/recomends',
                data: {pageNum: loadParams.pageNum},
                dataType: 'json',
                success: function (data) {
                    if(loadParams.pageNum == 1){
                        var html = '<section class="gg-kitchen"><h3 class="minor-title"><em class="icon icon05"></em>猜你喜欢</h3><section class="like"><ul id="you-like-list" class="like-list"></ul><a href="javascript:;" class="loading-more">更多内容，敬请期待</a></section></section>';
                        //$('body').append(html);
                        $('#index-container').append(html);
                    }
                    var goodData = data.data.peas;
                    if (!data.data || (!goodData || goodData.length == 0) || data.data.length == 0) {
                        loadParams.flag = true;
                        return;
                    }
                    if(goodData.length < data.data.total){
                        loadParams.flag = true;
                    }
                    //if(goodData && goodData.length > 0){
                    //    for(var i=0;i < goodData.length;i++){
                    //        var html = '<li><a href="javascript:;" class="like-item" data-sn="'+ goodData[i].sn +'" data-shopid="'+ goodData[i].shopId +'" data-productid="'+ goodData[i].productId +'" data-ordersource="'+ data.data.orderSource +'" data-icSource="'+ goodData[i].icSource +'">'+
                    //            '<div class="like-img"><img src="'+ imgUrlPrefix +'/images/newindex/dot.png" data-original="'+ goodData[i].showPic +'"></div>'+
                    //            '<h4 class="like-title">'+ toText(goodData[i].productName) +'</h4><span class="like-price">￥'+ goodData[i].price +'</span>';
                    //            if(goodData[i].price != goodData[i].originPrice){
                    //                html += '<del class="kit-pre-price">原价￥'+ goodData[i].originPrice +'</del>';
                    //            }
                    //            html += '</a></li>';
                    //        $('#you-like-list').append(html);
                    //    }
                    //}
                    if(goodData && goodData.length > 0){
                        for(var i=0;i < goodData.length;i++){
                            var html = '<li><a href="javascript:;" class="like-item" data-sn="'+ goodData[i].sn +'" data-shopid="'+ goodData[i].shopId +'" data-productid="'+ goodData[i].productId +'" data-ordersource="'+ data.data.orderSource +'" data-icSource="'+ goodData[i].icSource +'">'+
                                '<div class="like-img img-default"><img src="'+ imgUrlPrefix +'/images/newindex/dot.png" data-original="'+ goodData[i].mainImage +'"></div>'+
                                '<h4 class="like-title">'+toText(goodData[i].name) +'</h4><span class="like-price">￥'+ (goodData[i].salePrice/100).toFixed(2) +'</span>';
                            if(goodData[i].salePrice != goodData[i].price){
                                html += '<del class="kit-pre-price">原价￥'+ (goodData[i].price/100).toFixed(2) +'</del>';
                            }
                            html += '</a></li>';
                            $('#you-like-list').append(html);
                        }
                    }
                    loadParams.loading = false;
                    $('img').on('error', function(){
                        $(this).css('visibility','hidden');
                    });
                    $("img").picLazyLoad({effect: "fadeIn", speed: 50});
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    AppInterface.toast('没有更多数据了');
                }
            });
            return loadParams;
        };
    }
    module.exports = new GetData();
});