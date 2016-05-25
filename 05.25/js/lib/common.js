define("lib/common",function(require,exports,module) {
	var sg = require('mods/storage'),
		$ = require('vendors/zepto'),
		ck = require('mods/check'),
		alert = require('UI/alert'),
		appEvent=require('mods/appEvent'),
		//ajax = require('utils/ajax'),
		storage = require('mods/storage');
	function Common(){
		var self = this;
		this.init = function(){
			var href=location.href;
			String.prototype.len = function(){return this.replace(/^[^x00-xff]$/g,"aa").length;}
			if (ck.isPC()) {
			  alert.alerter("在手机浏览器打开我会更好看哦!");
			     $('.btnBox1 h3').html("在手机浏览器打开我会更好看哦!");
			     $(".cover_bg h3").css('border','none');
			}
		    if(href.indexOf('/regist/index')<0
				&& href.indexOf('/forgetpwd/index')<0
				&& href.indexOf('/forgetpwd/repwdphone')<0
				&& href.indexOf('/forgetpwd/set')<0
				&& href.indexOf('/address/index')<0
				&& href.indexOf('/car/invoice')<0
				&& href.indexOf('/car/distribution')<0
				&& href.indexOf('/car/checkstand')<0
				&& href.indexOf('/car/usecoupons')<0
				&& href.indexOf('/address/add')<0
				&& href.indexOf('/order/index')<0
				&& href.indexOf('/order/detail')<0){
		        history();
		    }
		    //非商品详情和地址也清除addressid
		  /*  if(href.indexOf('/productDetails/index')<0 && href.indexOf('/address/index')<0){
		        sg.setItem('parentsId','');
		    }*/
		    //非订单页面去除
		   /* if(href.indexOf('/order/index')<0 && href.indexOf('/car/usecoupons')<0){
		        sg.setItem('parentsId','');
		    }*/
		    $('.changecode').tap(function(){
			    $("#identify_code").attr('src','/login/identifycode?r='+Math.random());
			});
			$(".autologin span").on("click",function(){
			    var autologin = self.trimVal('autologin');
			    if(!autologin){
			        gId('autologin').value = '1';
			        $(".autologin span").css('backgroundPosition','2px 0px');
			    }else{
			        gId('autologin').value = '';
			        $(".autologin span").css('backgroundPosition','2px -16px');
			    }
			});
			$('#goback').on('click',function(){
		        var ref=location.href;
		        getHistory(ref);
		    });
		    $('#wodeye').on('click',function () {
			    $(this).addClass('high');
			    var href=location.href;
			    if (self.isLogin()) {
			       window.location.href = "/user/index";
			    } else {
			        window.location.href = "/login/index";
			        sg.setItem("myHref","1",true);
			    }
			})
			$('#shouye').on('click',function(){
			    $(this).addClass('high');
			    var href=location.href;
			    sg.removeItem("myHref",true);
			    window.location.href="/";
			});
			$('#fenleiye').on('click',function(){
			    $(this).addClass('high');
			    var href=location.href;
			    sg.removeItem("myHref",true);
			    window.location.href="/cate/index";
			});
			$('#gouwucheye').on('click',function(){
			    $(this).addClass('high');
			    var href=location.href;
			    sg.removeItem("myHref",true);
			    window.location.href="/car/index";
			});
			//关闭顶页客户端下载
             $('.dl_close').on('click', function () {
                 $(this).parent().remove();
                 $('.g_sp_list').css({'margin-bottom': '0'})
             });
			displayDiv();
			var html='<ul class="clearfix menu"><li id="fankui"><a class="menu-each" href="javascript:void(0)"><span id="download">反馈</span></a></li><li><a class="menu-each" href="javascript:void(0)">触屏版</a></li><li id="gokhd"><a class="menu-each" href="javascript:void(0)">客户端</a></li></ul>';
			$('#yejiao').html(html);
			$('#fankui').on('click',function(){
				appEvent.appDownload();
			});
			$('#gokhd').on('click',function(){
				appEvent.appDownload();
			});

		};
		this.isLogin = function(){
			//userId是国家宁在head头部里加的一个全局变量，未登录状态为0，登录状态会有一个用户id
			return !!userId;
		};
		this.getUserId = function(){
			return sg.getCookie('userId') || 0;
		};
		this.onLine = function(){
			if('onLine' in navigator && !navigator.onLine){
				alert.alerter('网络连接失败，请重试');
				return false;
			}
			return true;
		};
		this.addLoading = function(){
			var div = document.getElementById('w_loadPage');
			if(!div){
				var load = document.createElement('div');
				load.id = 'w_loadPage';
				load.innerHTML = '<div><img src="../images/loading.gif" />正在加载...</div>';
				document.body.appendChild(load);
			}
		};
		this.removeLoading = function(){
			var loadDiv = document.getElementById('w_loadPage');
			if(loadDiv){
				document.body.removeChild(loadDiv);
			}
		};
		this.fixedTwo = function(money){
		    var m = parseFloat(money);
		    if(m >= 0){
		        return m.toFixed(2);
		    }
		    return '0.00';
		};
		this.meta = function(title,keywords,description){
		    $('title').html(title);
		    $('meta[name="keywords"]').attr('content',keywords);
		    $('meta[name="description"]').attr('content',description);
		};
		this.trimVal = function(id){
		    var element = document.getElementById(id);
		    return element.value?element.value.replace(/(^\s*)|(\s*$)/g,""):element.innerHTML.replace(/(^\s*)|(\s*$)/g,"");
		};
		this.checkPwd = function(str){
		    var strReg=/^[a-zA-Z]{6,20}$/;
		    var numReg=/^\d{6,20}$/;
		    if(str.length<6 || str.length>20){
		        alert.alerter('密码位数错误');
		        return false;
		    }
		    if(strReg.test(str)){
		        alert.alerter('密码不能为纯字母');
		        return false;
		    }
		    if(numReg.test(str)){
		        alert.alerter('密码不能为纯数字');
		        return false;
		    }
		    var reg= /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,20}$/;
		    if(reg.test(str)){
		        return true;
		    }
		};
		//隐藏显示密码
		this.showOrhide = function(showpwd,pwd,repwd,node){
		    var ty = this.trimVal(showpwd);
		    if(!ty){
		        $('#'+showpwd).val('1');
		        $('#'+pwd).attr('type','password');
		        if(repwd != null){
		            $('#'+repwd).attr('type','password');
		        }
		        $(node).find('span').css('backgroundPosition','0 0');
		    }else{
		        $('#'+showpwd).val('');
		        $('#'+pwd).attr('type','text');
		        if(repwd != null){
		            $('#'+repwd).attr('type','text');
		        }
		        $(node).find('span').css('backgroundPosition','0 -15px');
		    }
		};

		this.route = function(ref){
			var arr=[],carsStr;
			if(carsStr = storage.getItem("cars",true)){//from:lgetItem
				var cars = JSON.parse(carsStr);
				var token=storage.getCookie('token');
				if(cars && cars.length > 0){
					for(var i=0;i<cars.length;i++){
						var car = {
							shopId : cars[i].shopId,
							kId : cars[i].kId,
							skuId : cars[i].skuId,
							proNum : cars[i].productNum
						};
						arr.push(car);
					}
					arr = JSON.stringify(arr);
					/**此处的逻辑是合并购物车内的商品 客户端与服务器端的数据合并**/
					/*ajax.postData('cart/join_shopcart.json',{cartJson:arr,loginToken:token},function(data){
						if(data.success){
							storage.setItem("cars",'',true);//from:lsetItem
							storage.setItem("carArr",[],true);//from:lsetItem
							if(storage.getItem("myHref",true)){//from:lgetItem
								location.assign('/user/index')
							}else{
								getHistory(ref);
							}
						}else{
							alert.alertSecond(data.message);
							storage.removeItem('cars',true);//from:lremoveItem
							setTimeout(function(){
								if(storage.getItem("myHref",true)){//from:lgetItem
									location.assign('/user/index')
								}else{
									getHistory(ref);
								}
							},1500);
						}
					});*/
				}
			}else{
				if(storage.getItem("myHref",true)){//from:lgetItem
					location.assign('/user/index')
				}else{
					getHistory(ref);
				}
			}
		};
		this.nextUrl = function(url,option,isThis){
		    var link = url;
		    if(!isThis){
		        if(option){
		            link += '?';
		            for(var k in option){
		                link += k.toString() + "="+option[k].toString()+'&';
		            }
		            link.length = link.length - 1;
		        }
		    }
		    sg.setItem("route",link);
		};
		this.noSlide = function(j){
		    document.addEventListener("touchmove",function(e){
		        if(j==0){
		            //移动端禁止页面滑动
		            e.preventDefault();
		            e.stopPropagation();

		        }else if(j==1){
		            //取消event绑定的默认事件
		            if(e&&e.preventDefault && e&&e.stopPropagation){
		                window.event.returnValue = true;
		            }
		        }
		    },false);
		};
		this.getByteLen = function(val) {
		    var len = 0;
		    for (var i = 0; i < val.length; i++) {
		        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
		            len += 2;
		        else
		            len += 1;
		    };
		    return len;
		};
		//搜索排序
		this.sortType = function(val){
		    switch(val){
		        case "综合":return 0;
		        case "价格":return 9;
		        case "商品销量":return 10;
		        case "新品":return 6;
		        case "人气":return 3;
		        case "店铺销量":return 7;
		    }
		};
		this.nullHtml = function(url,test){
		    var str='<div class="null" id="null"><p><img src="'+url+'" alt=""/></p><span>'+test+'</span></div>';
		    return str;
		}
		//拆单的时候按照金额从小到大
		this.orderSort = function(res){
		    var data=res.providerList,
		        len=data.length,
		        arr=[],
		        oldData;
		    for(var i=0;i<len;i++){
		        var  price=0;
		        for(var j= 0,len1=data[i].productList.length;j<len1;j++){
		            var productList=data[i].productList;
		            price+=parseFloat(parseFloat(productList[j].price)*parseInt(productList[j].productNum));

		        }
		        arr.push(price);
		    }
		    for(var k=0;k<arr.length;k++){
		        for(var n=arr.length;n>k;n--){
		            if(arr[k]>arr[n]){
		                oldData=data[k];
		                data[k]=data[n];
		                data[n]=oldData;
		            }
		        }
		    }
		    return data;
		};
		//获取url传递的参数*/
		this.getParams = function(url){
			var params = {};
			if(!url){
				var search = location.search.substr(1);
				if(search){
					var key_values = search.split('&');
					if(key_values && key_values.length > 0){
						for(var i=0;i<key_values.length;i++){
							var key = key_values[i].split('=')[0];
							var val = key_values[i].split('=')[1];
							params[key] = val;
						}
					}
				}
			}else{
				var search1 = url.substr(url.indexOf('?')+1);
				if(search1){
					var key_values1 = search1.split('&');
					if(key_values1 && key_values1.length > 0){
						for(var i=0;i<key_values1.length;i++){
							var key = key_values1[i].split('=')[0];
							var val = parseInt(key_values1[i].split('=')[1]);
							params[key] = val;
						}
					}
				}
			}
			return params;
		};
		function gId(id){
		    return document.getElementById(id);
		};
		function displayDiv(){
		    $('.zhezhao1').css('display','none');
		    $('.dianjianniu1').css('display','none');
		    $('#dianjianniu').on('click',function(){
		        if(!$(this).hasClass('round')){
		            $(this).addClass('round');
		            $('.zhezhao1').css('display','block');
		            $('.dianjianniu1').css('display','block');
		        } else {
		            $(this).removeClass('round');
		            $('.zhezhao1').css('display','none');
		            $('.dianjianniu1').css('display','none');
		        }
		    })
		    $(document).on('touchstart click',function(e){
		        var e = e || window.event; //浏览器兼容性
		        var elem = e.target || e.srcElement;
		        if($(elem).attr('id')!='dianjianniu' && $(elem).attr('class')=='zhezhao1'){
		            if($(elem).parent('div').attr('class')!='dianjianniu1'){
		                $('#dianjianniu').removeClass('round');
		                $('.zhezhao1').css('display','none');
		                $('.dianjianniu1').css('display','none');
		                return false;
		            }
		        }
		    })
		};
		function getHistory(str){
		    var arr = sg.getCookie('history')!=''? JSON.parse(sg.getCookie('history')):[],
		        len=arr.length,
		        flog,flog1,
		        index=$.inArray(str,arr);
		    if(index!=-1){
		        if(index!=0){
		            if(index!=1){
		                if(arr[index-1].indexOf('login/index')>0){
		                    flog1=arr;
		                    arr=[];
		                    arr=flog1.slice(0,index);
		                    flog=flog1.slice(index+1,len);
		                    arr=arr.concat(flog);
		                    sg.setCookie('history',JSON.stringify(arr),0);
		                    location.assign(arr[index-2]);
		                }else{
		                    flog1=arr;
		                    arr=flog1.slice(0,index);
		                    sg.setCookie('history',JSON.stringify(arr),0);
		                    location.assign(arr[index-1]);
		                }
		            }else{
		                flog1=arr;
		                arr=[];
		                arr=flog1.slice(0,index);
		                sg.setCookie('history',JSON.stringify(arr),0);
		                location.assign(arr[index-1]);
		            }
		        }else{
		            location.assign('/');
		        }
		    }else{
		        location.assign('/');
		    }
		};
		function history(){
		    var href=location.href,
		        arr=sg.getCookie('history')!=''?JSON.parse(sg.getCookie('history')):[],
		        len=arr.length,
		        flog,flog1,
		        index=$.inArray(href,arr);
		    if(len>9){
		        arr.shift();
		    }
		    if(index==-1){
		        arr.push(href);
		    }else{
		        if(index==0){
		            arr=arr.slice(1,len);
		        }else{
		            flog1=arr;
		            arr=[];
		            arr=flog1.slice(0,index);
		            flog=flog1.slice(index+1,len);
		            arr=arr.concat(flog);
		        }
		        if(arr[len-1]!=href){
		            arr.push(href);
		        }
		    }
		    console.log(JSON.stringify(arr))
		    sg.setCookie('history',JSON.stringify(arr),0);
		};
	}
	module.exports = new Common();
});