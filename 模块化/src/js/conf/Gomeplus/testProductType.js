/**
 * Created by lishengyong on 2016/7/5.
 */
define('conf/Gomeplus/testProductType.js', function(require, exports, module){
    require('$');
    var Vue = require('../js/vendors/vue.js');
    require('utils/appInterface.js');
    var Animation = require('UI/animation.js');
    var chooseItem = 0;
    var vueObj = new Vue({
        el: '#plist',
        replace: true,
        template: "#product_list_template",
        data: {
            items: [],
            showEdit: false,
            nodes:[]
        },
        methods: {
            // 页面商品类型选择出发方法
            choose: function (event) {
                // 方法内 `this` 指向 vm
                //alert('Hello ' + this.name + '!')
                // `event` 是原生 DOM 事件
                //alert(event.target.tagName);
                var catalogid = event.target.getAttribute('data-catalogid');
                if(event.target.classList.contains('active')) {
                    event.target.classList.remove('active');
                    this.nodes = this.nodes.filter(function (item) {
                        return item !== catalogid;
                    });
                } else {
                    if(this.nodes.length >= 3) {
                        AppInterface.toast('最多选择3个');
                    } else {
                        event.target.classList.add('active');
                        this.nodes.push(catalogid);
                    }
                }
                /*if(this.nodes.length > 0) {
                    $("#nextQuestion").toggleClass('hidden' , false);
                } else {
                    $("#nextQuestion").toggleClass('hidden' , true);
                }*/
                chooseItem = this.nodes.length;
            }
        }
    });

    // 商品类型样式数组
    var classObjs = [
        {
            "fir-one":true,
            "w182":true,
            "green":true
        },{
            "fir-two":true,
            "w148":true
        },{
            "fir-three":true,
            "w148":true
        },{
            "fir-four":true,
            "w131":true
        },{
            "sec-one":true,
            "w135":true
        },{
            "sec-two":true,
            "w141":true
        },{
            "sec-three":true,
            "w131":true
        },{
            "sec-four":true,
            "w141":true
        },{
            "third-one":true,
            "w146":true
        },{
            "third-two":true,
            "w135":true
        },{
            "third-three":true
        },{
            "third-four":true,
            "fdd6f7":true
        },{
            "fourth-one":true,
            "w135":true
        },{
            "fourth-two":true,
            "w182":true,
            "afd6fb":true
        },{
            "fourth-three":true,
            "w162":true
        },{
            "fifth-one":true,
            "fdd6f7":true
        },{
            "fifth-two":true,
            "w155":true
        },{
            "fifth-three":true,
            "w146":true,
            "green":true
        },{
            "sixth-one":true,
            "w155":true
        },{
            "sixth-two":true
        },{
            "sixth-three":true,
            "w162":true,
            "afd6fb":true
        }
    ];

    // productTypeList php查询bs接口获取到的数据
    try{
        if(productTypeList && productTypeList.length > 0) {
            for(var p in classObjs) {
                vueObj.items.push(
                    {
                        catalogId:productTypeList[p].catalogId,
                        catalogName:productTypeList[p].catalogName,
                        classObj:classObjs[p]
                    }
                );
            }
        } else {
            console.log('没有获取到产品类型数据...');
        }
    } catch(e) {
        console.log('没有获取到产品类型数据...');
    }

    // 页面动画
    Animation.fadeIn($('.product-list'), 50);

    // 点击下一题跳转
    $('#nextQuestion').on('click',function(){
        if(!chooseItem) {
            AppInterface.toast('请至少选择1个类型');
            return false;
        }
        var url = $('#nextQuestion').attr('data-value');
        var param = vueObj.nodes.toString();
        url += '?itemList=' + param;
        location.replace(url);
    });

});
