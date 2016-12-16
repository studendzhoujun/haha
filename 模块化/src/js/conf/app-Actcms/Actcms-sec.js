define("conf/app-Actcms/Actcms-sec.js",function (require , exports , module){
    require('$');
    require('utils/appInterface.js');
    require('mods/buried.js');
    require('vendors/dropload.js');
    require('conf/app-Actcms/Actcms-cont.js');
    require('vendors/lazyload.js');
    // $("img").picLazyLoad({effect: "fadeIn"});
    // var storage = require('mods/storage.js');
    var base64 = require('utils/base64.js');
    var Ajax = require('utils/ajax.js');
    var domaincom = location.href.match(/^(http[s]?:\/\/(?:[^\/]*))\/.*$/)[1];
    var domain = location.href.match(/^(http[s]?:\/\/(?:[^\/]*))\/.*$/)[1]+'/product/index?';
    // 内嵌
    // var params={};
    // params['url'] = location.href;
    // params['userid'] = window.userId || 0;
    // params['cookid'] = storage.getCookie('PHPSESSID') || 0;
    // AppInterface.call('/common/statistics', {
    //             code: 'P000W006',
    //             desc: '商品管理页',
    //             param: base64.encode(JSON.stringify({user_id: params.userid,url:params.url,cook_id:params.cookid}))
    // });      
    function oAppClick(mhd,str1,str2){
        $(str1).on("click",str2,function(e){
            var $self = $(this),
                shopid = $self.attr("shopid"),
                productid = $self.attr("productid");
            AppInterface.call('/common/productDetail', {shopId: shopid, productId: productid});
            AppInterface.buried(mhd,'功能模块', {shop_id: shopid, produce_id: productid});
            console.log(shopid,productid);  
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    }
    // 给每个商品埋点跳转
    (function oAppInter(){
        oAppClick('Mhd0A009','.oSection5','.section5-cont-li-div');
        oAppClick('Mhd0A008','.oSection6','.section5-cont-li-div');
        oAppClick('Mhd0A007','.oSection7','.section5-cont-li-div');
        oAppClick('Mhd0A006','.oSection8','.section5-cont-li-div');
        oAppClick('Mhd0A005','.section4','.section4-cont-div');
        oAppClick('Mhd0A004','.section3','.section3-cont-top');
        oAppClick('Mhd0A004','.section3','.section3-cont-bottom li');
        oAppClick('Mhd0A003','.section2','.section2-cont-div');
        oAppClick('Mhd0A002','.section1','.section1-cont-left');
        oAppClick('Mhd0A002','.section1','.section1-cont-right-bottom');
    })();

    // 刷新组件
    var oTabLi = $('.section5-box-ul li');
    var oTabDiv = $('.section5-cont .tabdiv');
    var oPage6 = $('div.oSection5').attr('page');
    var oPage7 = $('div.oSection6').attr('page');
    var oPage8 = $('div.oSection7').attr('page');
    var oPage9 = $('div.oSection8').attr('page');
    var metaId = $('.section5-box-ul li').eq(0).attr('metaidx');
    var metaIda = $('li.oSection5').attr('metaidx');
    var metaIdb = $('li.oSection6').attr('metaidx');
    var metaIdc = $('li.oSection7').attr('metaidx');
    var metaIdd = $('li.oSection8').attr('metaidx');
    var oCLickMore = $('.click-more').eq(0);
    //tab切换
    oTabLi.on('click',function(){
        var obj=oTabDiv.eq($(this).index());
        numLi=obj.find('li').length;
        // 商品数位基数时高度要100%
        if(numLi>4){
            $('div.tabdiv').eq($(this).index()).height('');
        }else{
            $('div.tabdiv').height($(window).height());
        }
        // 判断当前这个固定定位到头部
        var index=$(this).index();
        $(this).addClass('section5-boxul-li').siblings().removeClass('section5-boxul-li');
        obj.show().siblings().hide();
        oCLickMore = $('.click-more').eq($(this).index());
        oCLickMore.show().siblings().hide();
        metaId = oTabDiv.eq($(this).index()).attr('metaidx');
        console.log(oCLickMore)
    });
     // 上啦刷新
    var droploadUp = $('body').dropload({
        loadUpFn: function (me){
            setTimeout(function(){
                me.resetload();
                location.reload(true);
            },500);
        }
    });
    var droploadDown = $('body').dropload({
        loadDownFn: function (me){
            setTimeout(function(){
                addNew();
                me.resetload();
                loading = true;
            },500)
        }
    });
    // 没有更多数据
    function fetchData(flag) {
        loading = false;
        flag && AppInterface.toast('没有更多数据了');
        console.log('111111111111');
        return;  
    }
    // 添加更多商品
    function addNew(){
        switch (metaId) {
            case metaIda:
                oPage6++;
                addSections(oPage6,$('div.oSection5 ul'));
                break;
            case metaIdb:
                oPage7++;
                addSections(oPage7,$('div.oSection6 ul'));
                console.log(oPage7);
                break;
            case metaIdc:
                oPage8++;
                addSections(oPage8,$('div.oSection7 ul'));
                break;
            case metaIdd:
                oPage9++;
                addSections(oPage9,$('div.oSection8 ul'));
                break;          
        }
    }
    var page = 1;   
    function addSections (page,str){
        console.log(page);
        Ajax.query('/op/actcms/getdatabypage', {metaId: metaId,pageNum: page}, function (data) {
            flag = false;
            if (data.success) {
                if(data.data.list.length == 0){
                    flag = true;
                    fetchData(true);
                    console.log('没有更多数据了啊')
                    // return;
                }else{
                    // resetload();
                    var oData = data.data.list[0].itemData;
                    console.log(data.data.list);
                    for(var i=0;i<oData.length;i++){
                        var addSection =                                        
                            '<li class="fl section5-cont1-li" id="oS5ContLiL">'+                                    
                                '<div class="section5-cont-li-div" shopId="'+oData[i].shopId+'" productId="'+oData[i].productId+'" sn="'+oData[i].sn+'" icon="'+data.icon+'">'+
                                    '<a data-href="'+domain+'?shopId='+oData[i].shopId+'&productId='+oData[i].productId+'">'+
                                        '<img src="'+oData[i].productPicUrl+'" alt="国美+">'+
                                        '<p>'+oData[i].productName+'</p>'+
                                    '<div class="clearfix section5-bottom">'+
                                        '<div class="amount fl">'+
                                            '<p class="amount-div"><i>￥</i>'+oData[i].productPrice+'</p>'+
                                        '</div>'+
                                            '<span class="snapUp fr">立即抢购</span>'+
                                    '</div>'+
                                    '</a>'+
                                    '<a data-href="'+domain+'?shopId='+oData[i].shopId+'&productId='+oData[i].productId+'" class="couponsa" style="color:#ee2f2f;">'+
                                        '<div class="coupons">'+
                                                '<div class="fl buy"></div>'+
                                                '<div class="fr"><i>￥</i><span>'+oData[i].coupon+'</span></div>'+
                                        '</div>'+
                                    '</a>'+ 
                                '</div>'+
                            '</li>'; 
                           
                        str.append(addSection);
                        $('div.tabdiv').height('');
                    }
                    var oCouponCont = $('.coupons span');
                    for(var i=0,l=oCouponCont.length;i<l;i++){
                        if(oCouponCont[i].innerHTML ==='' || oCouponCont[i].innerHTML ===' '|| oCouponCont[i].innerHTML ==='undefined'){
                            oCouponCont.eq(i).parents(".coupons").hide();
                        }
                    }       
                }       
            }   
        });
    }  
});

























