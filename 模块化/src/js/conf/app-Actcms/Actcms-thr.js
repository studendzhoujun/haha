define("conf/app-Actcms/Actcms-thr.js",function (require , exports , module){
    require('$');
    require('utils/appInterface.js');
    require('mods/buried.js');
    require('vendors/dropload.js');
    require('conf/app-Actcms/Actcms-cont.js');
        require('vendors/lazyload.js');
    $("img").picLazyLoad({effect: "fadeIn"});
    var base64 = require('utils/base64.js');
    var Ajax = require('utils/ajax.js');
    var domain = location.href.match(/^(http[s]?:\/\/(?:[^\/]*))\/.*$/)[1]+'/product/index?';
    // 内嵌
    AppInterface.buried( 'P000W006','商品管理页');
    function oAppClick(mhd,str1,str2){
        $(str1).on("click",str2,function(e){
            var $self = $(this),
                shopid = $self.attr("shopid"),
                productid = $self.attr("productid");
            AppInterface.call('/common/productDetail', {shopId: shopid, productId: productid});
            AppInterface.buried(mhd,'功能模块', {shopId: shopid, productId: productid});
            console.log(shopid,productid);  
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    }
    (function oAppInter(){
        oAppClick('Mhd0A009','.section5-cont4','.section5-cont-li-div');
        oAppClick('Mhd0A008','.section5-cont3','.section5-cont-li-div');
        oAppClick('Mhd0A007','.section5-cont2','.section5-cont-li-div');
        oAppClick('Mhd0A006','.section5-cont1','.section5-cont-li-div');
        oAppClick('Mhd0A005','.section4','.section4-cont-div');
        oAppClick('Mhd0A004','.section3','.section3-cont-top div');
        oAppClick('Mhd0A004','.section3','.section3-cont-bottom li');
        oAppClick('Mhd0A003','.section2','.section2-cont-left');
        oAppClick('Mhd0A002','.section1','.section1-cont-left div');
        oAppClick('Mhd0A002','.section1','.section1-cont-right-bottom');
    })();

    var metaId = '11348';
    var oTabLi = $('.section5-box-ul li');
    var oTabDiv = $('.section5-cont .tabdiv');
    var oPage6 = $('div.oSection5').attr('page');
    var oPage7 = $('div.oSection6').attr('page');
    var oPage8 = $('div.oSection7').attr('page');
    var oPage9 = $('div.oSection8').attr('page');
    oTabLi.on('click',function(){
        $(this).addClass('section5-boxul-li').siblings().removeClass('section5-boxul-li');
        oTabDiv.eq($(this).index()).show().siblings().hide();
        metaId = oTabDiv.eq($(this).index()).attr('metaidx');
    });
    function addNew(){  
        switch (metaId) {
            case '11348':
                oPage6++;
                addSections(oPage6,$('div.oSection5 ul'));
                // flag = true; 
                break;
            case '59877':
                oPage7++;
                addSections(oPage7,$('div.oSection6 ul'));
                // flag = true;  
                console.log(oPage7);

                break;
            case '61592':
                oPage8++;
                addSections(oPage8,$('div.oSection7 ul'));
                // flag = true;  
                break;
            case '31111':
                oPage9++;
                addSections(oPage9,$('div.oSection8 ul'));
                // flag = true;  
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
                                    '<a href="'+domain+'?shopId='+oData[i].shopId+'&productId='+oData[i].productId+'" class="couponsa" style="color:#ee2f2f;">'+
                                        '<div class="coupons">'+
                                                '<div class="fl buy"></div>'+
                                                '<div class="fr"><i>￥</i><span>'+oData[i].coupon+'</span></div>'+
                                        '</div>'+
                                    '</a>'+ 
                                '</div>'+
                            '</li>'; 
                        str.append(addSection);
                    }

                }       
            }   
        });
    }
    var droploadUp = $('body').dropload({
        loadUpFn: function (me){
            setTimeout(function(){
                me.resetload();
                location.reload(true);
            },500);
        }
    });

    var loading = false;
    var droploadDown = $('body').dropload({
        loadDownFn: function (me){
            setTimeout(function(){
                addNew();
                me.resetload();
                fetchData(true);
                loading = true;
            },500)
        }
    });
     // 没有更多数据
    var firstNoData = true;
    function fetchData(flag) {
        if(!firstNoData){
            loading = false;
            flag && AppInterface.toast('没有更多数据了');
            return;
        }
       
    }

});

























