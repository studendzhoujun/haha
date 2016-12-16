/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/gotoWhereFun", function(require,exports,module) {
    require('utils/appInterface.js');
    var base64 = require('utils/base64.js');

    function goto(){
        this.gotoWhere = function(data){
            //获取url传递的参数*/
            var type = {
                0:['/product/detail',{shopId: data.datashopid, productId: data.dataproductid, orderSource: data.dataOrderSource}],
                1:['/shop/detail', {shopId:data.dataValue, orderSource: data.dataOrderSource}],
                2:['/common/localJump', {url: base64.encode(data.dataValue)}],
                3:['/list/category',{categoryId: data.dataValue}],
                4:['/search/search',{keyWord: data.dataValue}],
                6:['/common/localJump', {
                    type: '2',
                    url: base64.encode(data.dataValue),
                    shareAppUrl: base64.encode(data.dataValue),
                    title: data.dataActivitytitle,
                    desc: data.dataActivitydesc,
                    imgUrl: base64.encode(data.dataActivityimg),
                    shareUrl: base64.encode(data.dataActivitylink)
                }],
                7:['/circle/topicDetail',{topicId: data.dataValue}],
                8:['/circle/home',{groupId: data.dataValue}]
            };
            var params = type[data.dataType];
            if(!params){
                params
            }
            AppInterface.call(params[0],params[1]);
        }

        this.gotoWhereValue = function(data){

            if(data.dataType == 0){
                data.dataproductid = data.dataValue;
            }else if(data.dataType == 1){
                data.datashopid = data.dataValue;
            }
            //获取url传递的参数*/
            var type = {
                0:['/product/detail',{shopId: data.datashopid, productId: data.dataproductid, orderSource: data.dataOrderSource}],
                1:['/shop/detail', {shopId:data.dataValue, orderSource: data.dataOrderSource}],
                2:['/common/localJump', {url: base64.encode(data.dataValue)}],
                3:['/list/category',{categoryId: data.dataValue}],
                4:['/search/search',{keyWord: data.dataValue}],
                6:['/common/localJump', {
                    type: '2',
                    url: base64.encode(data.dataValue),
                    shareAppUrl: base64.encode(data.dataValue),
                    title: data.dataActivitytitle,
                    desc: data.dataActivitydesc,
                    imgUrl: base64.encode(data.dataActivityimg),
                    shareUrl: base64.encode(data.dataActivitylink)
                }],
                7:['/circle/topicDetail',{topicId: data.dataValue}],
                8:['/circle/home',{groupId: data.dataValue}]
            };
            var params = type[data.dataType];
            if(!params){
                params
            }
            AppInterface.call(params[0],params[1]);
        }

    }
    module.exports = new goto();
});