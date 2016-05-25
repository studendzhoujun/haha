define("conf/app-Actcms/Actcms-sec.js",function (require , exports , module){

	require('$');
	require('');
	require('utils/appInterface.js');
	// require('utils/qrcode.js');
    require('mods/buried.js');
	require('vendors/dropload.js');
	require('conf/app-Actcms/Actcms-cont.js');
	var base64 = require('utils/base64.js');
	var Ajax = require('utils/ajax.js');

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

	var firstNoData = true;
    function fetchData(flag) {
        if(!firstNoData){
            loading = false;
            flag && AppInterface.toast('没有更多数据了');
            return;
        }
        // Ajax.query('/index/recomends', {pageNum: pageNum}, function (data) {
        //     if (data.success) {
        //         var dataAll = data.data.productList;  //[{},{},{}]//所有的两组12个商品，分6个一组
        //         //data.data不存在或者  （（商品列表不存在或长度为0）且（推荐店铺不存在或长度为0））
        //         if(!data.data || ( (!dataAll || dataAll.length == 0) && (!data.data.shopList || data.data.shopList.length == 0 )) ){
        //             //AppInterface.toast('没有更多数据了');
        //             pageNum--;
        //             firstNoData = false;
        //             loading = false;
        //             return;
        //         }
        //         var item = {
        //             shopItemsOne: {
        //                 frontshop: function(){
        //                     var tmp = [];
        //                     for (var i = 0; i < (dataAll.length>6?6:dataAll.length); i++) {
        //                         tmp.push(dataAll[i]);
        //                     }
        //                     return tmp;
        //                 }(),
        //                 backshop: {
        //                     shop: data.data.shopList[0],
        //                     product: function(){
        //                         var tmp = [];
        //                         if(data.data.shopList[0] && data.data.shopList[0].product){
        //                             var dataArray = data.data.shopList[0].product;
        //                             for (var i = 0; i < (dataArray.length > 3 ? 3 : dataArray.length); i++) {
        //                                 tmp.push(dataArray[i]);
        //                             }
        //                         }
        //                         return tmp;
        //                     }()
        //                 }
        //             },
        //             shopItemsTwo: {
        //                 frontshop: function(){
        //                     var tmp = [];
        //                     for (var i = 6; i < (dataAll.length>6?dataAll.length:6); i++) {
        //                         tmp.push(dataAll[i]);
        //                     }
        //                     return tmp;
        //                 }(),
        //                 backshop: {
        //                     shop: data.data.shopList[1],
        //                     product: function(){
        //                         var tmp = [];
        //                         if(data.data.shopList[1] && data.data.shopList[1].product){
        //                             var dataArray = data.data.shopList[1].product;
        //                             for (var i = 0; i < (dataArray.length>3 ? 3 : dataArray.length); i++) {
        //                                 tmp.push(dataArray[i]);
        //                             }
        //                         }
        //                         return tmp;
        //                     }()
        //                 }
        //             }
        //         };
        //     }
        //     vueObj.items.push(item);
        //     loading = false;
        // });
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
				me.resetload();
				fetchData(true);
				loading = true;
			},500)
		}
	});

});

























