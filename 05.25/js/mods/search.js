/**
 * @module mods/search
 * @desc 搜索功能模块，抽取自hscript.js
 * @author yanglang
 * @date 20160114
 */
define('mods/search', function (require, exports, module) {
    require('$');
    var common = require('lib/common');
    var storage = require('mods/storage');
    var UI = require('UI/alert');
    
    /*设置历史记录*/
    $('#search_ms').on('click', function () {
        var input = $('#history input'),
            val = $.trim(input.val()),
            type = input.prev().prev().html(),
            arr = [],
            arr1 = [];
        if (val) {
            if (type == "商品") {
                storage.setItem("pId", "");
                storage.setItem("prId", "");
                storage.setItem("test", "");
                storage.setItem("pinId", "");
                storage.setItem("parId", "");
                storage.setItem("test1", "");
                storage.setItem("fail1", []);
                if (!storage.getItem('shopNum',true)) storage.setItem('shopNum',0,true);
                for (var i in localStorage) {
                    if (i.charAt(0) == "a" && localStorage[i] != "null") {
                        arr.push(decodeURI(localStorage[i]))
                    }
                }
                if ($.inArray(val, arr) == -1) {
                    //ls['a' + storage.getItem('shopNum',true)] = encodeURI(val);
                    storage.setItem('a' + storage.getItem('shopNum',true),encodeURI(val),true);
                   // ls.shopNum = parseInt(storage.getItem("shopNum",true)) + 1;//ls.getItem
                    storage.setItem('shopNum',parseInt(storage.getItem("shopNum",true)) + 1,true)
                }
                location.href = "/Cate/detail?val=" + encodeURI(val) + "&type=" + 0;
            } else {
                if (!storage.getItem('storeNum',true)) storage.setItem('storeNum',0,true);//ls.storeNum = 0;
                for (var i in localStorage) {
                    if (i.charAt(0) == "b" && localStorage[i] != "null") {
                        arr1.push(decodeURI(localStorage[i]));
                        arr1.push(decodeURI(localStorage[i]));
                    }
                }
                if ($.inArray(val, arr1) == -1) {
                    // ls['b' + storage.getItem('storeNum',true)] = encodeURI(val);
                    storage.setItem('b' + storage.getItem('storeNum',true),encodeURI(val),true);
                    // ls.storeNum = parseInt(storage.getItem("storeNum",true)) + 1;//ls.getItem
                    storage.setItem('storeNum',parseInt(storage.getItem("storeNum",true)) + 1,true);
                }
                location.href = "/Cate/detail?val=" + encodeURI(val) + "&type=" + 1;
            }
        } else {
            UI.alerter("请输入搜索词")
        }
    });
    /*历史记录*/

    $('#img_left').on('click', function () {
        var params = common.getParams();
        if(params.catalogId!=undefined){
            return false;
        }
        $(this).next().show();
        $('.arrow1').show();
    });
    /*点击切换店铺商品*/
    $('#img_left_box li').on('click', function () {
        var val = $.trim($("#history input").val());
        $('#img_left').html($(this).html());
        $(this).parent('ul').hide();
        $('.arrow1').hide();
        var text = $('#img_left').html();
        if (text == "商品") {
            if (val != "") {
                $("#snav1").addClass('hide');
                $("#snav").show();
            }
            if (storage.getItem("shopNum",true) != null) {//lgetItem
                $("#search_history").show();
                $("#search_ms").show().removeClass('hide');
                $("#filtrate").hide();
                init();
            } else {
                $("#search_history").hide();
            }
        } else {
            $("#search_ms").show().removeClass('hide');
            $("#filtrate").hide();
            if (val != "") {
                $("#snav1").removeClass('hide');
                $("#snav").hide();
            }
            if (storage.getItem("storeNum",true) != null) {//lgetItem
                $("#search_history").show();
                init('storeNum', 'b');
            } else {
                $("#search_history").hide();
            }
        }
    });
    /*点击清除input内容*/
    $('#img_delete').on('click', function () {
        $(this).prev().val('');
        $("#search_list,#filtrate").hide();
        if ($('#search_history').find('p').length > 0) {
            $('#search_history').show();
        }
        $('#search_con').show();
        $("#search_ms").show().removeClass('hide');
        $(this).hide();
    });
    /*清除历史记录*/
    $('#delete_history').on('click', function () {
        var type = $('#img_left').html();
        UI.alertBox("确认要清除历史记录？", "提示", function () {
            $('#historyBox').empty().parent('#search_history').hide();
            for (var i in localStorage) {
                if (type == "商品") {
                    if (i.charAt(0) == "a") {
                        storage.removeItem(i,true);//lremoveItem
                        storage.removeItem('shopNum',true);//lremoveItem
                    }
                } else {
                    if (i.charAt(0) == "b") {
                        storage.removeItem(i,true);//lremoveItem
                        storage.removeItem('storeNum',true);//lremoveItem
                    }
                }
            }
        })
    });

    function init(isShop, isA) {
        isShop = isShop ? isShop : "shopNum";
        isA = isA ? isA : "a";
        var type = $('#img_left').html();
        //hotWordrender();
        var num = storage.getItem(isShop,true);//lgetItem
        if (num != '' && num != null) {
            var str1 = "", arr = [], len, arr1;
            for (var i in localStorage) {
                if((new RegExp('^'+isA+'[\\d]+$')).test(i)){
                    arr.push(decodeURI(localStorage[i]));
                }
            }
            if (arr.length > 10) {
                len = 10;
            } else {
                len = arr.length;
            }
            arr1 = arr.reverse();
            if (type == "商品") {
                for (var i = 0; i < len; i++) {
                    str1 += "<a href='/Cate/detail?type=0&history=1&val=" + arr1[i] + "'><p>" + arr1[i] + "</p></a>";
                }
            } else {
                for (var i = 0; i < len; i++) {
                    str1 += "<a href='/Cate/detail?type=1&val=" + arr1[i] + "'><p>" + arr1[i] + "</p></a>";
                }
            }
            $('#historyBox').html(str1);
        } else {
            $("#search_history").hide();
        }
    }
    init();
    module.exports = {init:init};
});