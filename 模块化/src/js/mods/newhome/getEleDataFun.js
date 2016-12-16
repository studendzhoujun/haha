/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/getEleDataFun", function(require,exports,module) {
    var $ = require('vendors/zepto');
    require('utils/appInterface.js');

    function GetEles(){
        //获取url传递的参数*/
        this.getEleData = function(ele){
            return {
                dataValue:ele.attr('data-datavalue')?ele.attr('data-datavalue'):'',
                dataType:ele.attr('data-type')?ele.attr('data-type'):0,
                dataproductid:ele.attr('data-productid')?ele.attr('data-productid'):0,
                datashopid:ele.attr('data-shopid')?ele.attr('data-shopid'):0,
                datasn:ele.attr('data-sn')?ele.attr('data-sn'):0,
                datasectionid:ele.attr('data-sectionid')?ele.attr('data-sectionid'):0,
                dataOrderSource:ele.attr('data-ordersource')?ele.attr('data-ordersource'):'',
                dataIcSource:ele.attr('data-icsource')?ele.attr('data-icsource'):'',
                dataActivitytitle:ele.attr('data-activitytitle')?ele.attr('data-activitytitle'):'',
                dataActivitydesc:ele.attr('data-activitydesc')?ele.attr('data-activitydesc'):'',
                dataActivityimg:ele.attr('data-activityimg')?ele.attr('data-activityimg'):'',
                dataActivitylink:ele.attr('data-activitylink')?ele.attr('data-activitylink'):''
            };
        };
    }
    module.exports = new GetEles();
});