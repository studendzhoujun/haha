define("mods/carsFun", function (require, exports, module) {
    //判断购物车商品数量
    var sg = require('mods/storage'),
        com = require('lib/common'),
        ajax = require('utils/ajax'),
        alert = require('UI/alert'),
        $ = require('vendors/zepto.js');
    module.exports = {
        /**
         * 合并购物车内的商品
         * @method mergeCars
         * @param callback 回并完成之后回调
         */
        mergeCars: function (callback) {
            var arr = [], carsStr, flag = false;
            //判断是否本地购物车有商品
            if (carsStr = sg.getItem("cars", true)) {//from:lgetItem
                var cars = JSON.parse(carsStr);
                var token = sg.getCookie('token');
                if (cars && cars.length > 0) {
                    flag = true;
                    for (var i = 0; i < cars.length; i++) {
                        var car = {
                            shopId: cars[i].shopId,
                            kId: cars[i].kId,
                            skuId: cars[i].skuId,
                            proNum: cars[i].productNum
                        };
                        arr.push(car);
                    }
                    arr = JSON.stringify(arr);
                    /**此处的逻辑是合并购物车内的商品 客户端与服务器端的数据合并**/
                    ajax.postData('/car/merge', {cartJson: arr, loginToken: token}, function (data) {
                        if (data.success) {
                            sg.setItem("cars", '', true);//from:lsetItem
                            sg.setItem("carArr", [], true);//from:lsetItem
                        } else {
                            alert.alertSecond(data.message);
                            sg.removeItem('cars', true);//from:lremoveItem
                        }
                        callback && callback(data);
                    });
                }
            }
            !flag?(callback && callback()):'';
        },
        carShopNum: function () {
            var num = 0, cars;
            if (com.isLogin()) {
                ajax.postData('/car/shopnum', null,function (data) {
                    if (data.code == 0) {
                        var num = data.data;
                        if (num > 0) {
                            $('.star_goods1 span').show().html(num);
                            if (num > 999) {
                                $('.star_goods1 span').html("···").css({'font-size': '20px', 'line-height': '20px'});
                            }
                        }
                    } else {
                        alert.alerter(data.message);
                    }
                });
            } else {
                var cars = sg.getItem('cars', true);
                cars = JSON.parse(cars?cars:null);
                if (cars) {
                    for (var i = 0; i < cars.length; i++) {
                        num += parseInt(cars[i].productNum);
                    }
                    if (num > 0) {
                        $('.star_goods1 span').show().html(num);
                        if (num > 999) {
                            $('.star_goods1 span').html("···").css({'font-size': '30px', 'line-height': '18px'});
                        }
                    }
                }
            }
        }
    }
});