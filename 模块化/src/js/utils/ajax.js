define("utils/ajax",function(require,exports,module) {
	var com = require('lib/common'),
		$ = require('vendors/zepto'),
		ck = require('mods/check'),
		alert = require('UI/alert'),
		gck=require('mods/storage.js'),
		dp = require('vendors/dropload'),
		devId = Date.now();
	function Ajax(){
		var self = this,domain = lithe?lithe.basepath:loation.href,
				com_vm = {pageNum:2,isend:0,arrName:'',numPerPage:10};
		domain = domain.match(/^(http[s]?:\/\/(?:[^\/]*))\/.*$/)[1];
		this.postData = function(url,params,callback,pageNum,numPerPage,isAsyn,beforePost){
			if(!com.onLine()){return false;};
			var edited = editUrl(url,params,pageNum,numPerPage);
			beforePost && beforePost();
			requestAjax(edited.url,edited.params,callback,isAsyn,edited.isImg);
		};
		this.loadPage = function(urls,callbacks,paramsArray,numPerPage){
			if(!com.onLine()){return false;};
			if(urls && urls.length > 0)	{
				com.addLoading();
				requestAjax(urls,paramsArray,callbacks);
			}else{
				console.log('loadPage error');
			}
		};
		this.downReLoad = function(){
			var dropload = $('body').dropload({
				domUp : {
					domClass   : 'dropload-up',
					domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
					domUpdate  : '<div class="dropload-update">↑释放更新</div>',
					domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
				},
				loadUpFn : function(me){
					setTimeout(function(){
						me.resetload();
						location.reload(true);
					},500);
				}
			});
		};
		this.upload = function(parent,url,callback,params,numPerPage){
		    var parent = parent || 'body';
		    $(parent).dropload({
		        scrollArea : window,
		        loadDownFn : function(me){
		            if(com_vm.isend && com_vm.isend == 1){
						alert.alertSecond('已经没有内容了~');
						me.resetload();
					}else{
	    				loadMoreFun(url,callback,params,numPerPage);
	    				me.resetload();
					}	
		        }
		    });
		};
		this.isNum = function(val){
			return !isNaN(val);
		};
		this.setArrName = function(name){
		    com_vm.arrName = name;
		};
		this.setIsEnd = function(end){
		    com_vm.isend = end;
		};
		this.setPageNum = function(pageNum){
		    com_vm.pageNum = pageNum;
		};
		this.getCom_vm = function(pageNum){
		    return com_vm;
		};
		this.getJSON=function(url,callback,obj){
           var pageNum=obj==undefined?1:obj.pageNum,
            numPerPage=obj==undefined?10:obj.numPerPage;
            var params = createURL(url);
    
           requestAjax((domain+url+params),{pageNum:pageNum,numPerPage:numPerPage},callback,true);
    
		};

		function editUrl(url,params,pageNum,numPerPage){
			var other = getCommonParams('');
			var params = !isEmpty(params)?params : getParams();
			params.pageNum = pageNum || 1;
			params.numPerPage = numPerPage || 10;
			if(url.indexOf('http') > -1){
				return {url:url,params:params,isImg:true};
			}
			return {url:(domain+url+other),params:params};
		};
		function isEmpty(obj){
			if(!obj)
				return true;
			var empty = true;
			for(var key in obj){
				empty = false;
				break;
			}
			return empty;
		}
		function getCommonParams(url){
			return createURL(url);
		};
		function getParams(url){  //获取url传递的参数*/
			var params = {};
			var search = url?url.substr(url.indexOf('?')+1):location.search.substr(1);
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
		    return params;
		};
		function loadMoreFun(url,callback,params,numPerPage){
			var isend = com_vm.isend;
			if(isend == 0){
				var pageNum = com_vm.pageNum;
				self.postData(url,params,callback,pageNum,numPerPage);
			}else{
				if(isend == 1){
					alert.alertSecond('已经没有内容了~');
				}
			}
		};
    function createURL(url){
       var userId=(gck.getCookie("userId")!=''?gck.getCookie("userId"):0);
       return url.indexOf('?') > 0?'userId='+userId+'&clientOs=4&clientOsVersion=4.3&appType=1&appVersion=1.0&mac=ac+as+23+3d&devId='+devId:'?userId='+userId+'&clientOs=4&clientOsVersion=4.3&appType=1&appVersion=1.0&mac=ac+as+23+3d&devId='+devId;
     }

		function requestAjax(url,params,callback,isAsync,isImg){
			var data = {url:url,params:params},isArr = ck.isArray(url);
			if(isArr){
				data = [];
				for(var i=0;i<url.length;i++){
					var obj = editUrl(url[i],params[i]);
					data.push(obj);
				}
			}
			var isasync = true;
		    var ua = window.navigator.userAgent.toLowerCase();
		    if(!ua.match(/MicroMessenger/i)){
		        isasync = !!isAsync;
		    }
		    if(isImg){
		    	$.getJSON(url,function(data){
			        callback(data);
			        com.removeLoading();
			    });
			    return false;
		    };
			$.ajax({
				type:'post',
				url:url,
				data:params,
				dataType:'json',
				async:isasync,
				success:function(res){

					if(isArr){
						com.removeLoading();
						callback(res);
					}else if(res.code == 0 || res.code == 200){
						removeDiv(res.data,params.pageNum,params.numPerPage);
						com.removeLoading();
						callback(res);
					}else{
						removeDiv(res.data,params.pageNum,params.numPerPage);
						com.removeLoading();
						callback(res);
						//modify 杨浪 错误的情况外部也是需要拿到结果的。
					}
				},
				error:function(error){
					// alerter('网络请求错误！');
				}
			});
		};
		function removeDiv(data,pageNum,numPerPage){
		    var arrName = com_vm.arrName;
		    if(arrName){
		    	datas = data.data?data.data:data;
		        for(var item in datas){
		            if(item == arrName){
		                data = datas[item];
		                break;
		            }
		        }
		    }
	        if(ck.isArray(data)){
	            if(!data || data.length < numPerPage){
	                com_vm.isend = 1;
	            }else{
	                com_vm.pageNum++;
	            }
	        }
		}
	}

	/**
	 * 扩展Ajax的方法
	 * 杨浪
	 * @type {{query: Function, querySync: Function, _doPostJson: Function}}
	 */
	Ajax.prototype = {

		/**
		 * post查询，异步执行，<br>
		 * 返回json。<br>
		 * @method query
		 * @async
		 * @param {String} url 查询地址
		 * @param _param 参数对象 可选
		 * @param {Function} _callback 回调方法 可选
		 */
		query: function (url, _param, _callback) {
			var that = this, aLen = arguments.length, callback, param;
			if (aLen == 2) {
				if ($.isFunction(_param)) {
					callback = _param;
				}
			} else if (aLen == 3) {
				param = _param, callback = _callback;
			}
			return this._doPostJson(url, param, callback, true);
		},
		/**
		 * post更新数据，异步执行
		 * @param url
		 * @param param
		 * @param _callback
		 */
		update: function (url, param ,_callback) {
			this.query.apply(this,arguments);
		},

		/**
		 * post查询 同步执行<br>
		 * 返回json<br>
		 * @method querySync
		 * @param {String} url 查询地址
		 * @param _param 参数对象 可选
		 * @param {Function} _callback 回调方法 可选
		 */
		querySync: function (url, _param, _callback) {
			var that = this, aLen = arguments.length, callback, param;
			if (aLen == 2) {
				if ($.isFunction(_param)) {
					callback = _param;
				}
			} else if (aLen == 3) {
				param = _param, callback = _callback;
			}
			return this._doPostJson(url, param, callback, false);
		},

		/**
		 * 执行post查询<br>
		 * 返回json<br>
		 * 内部使用<br>
		 * @method _doPostJson
		 * @private
		 * @param {String} url 查询地址
		 * @param param 参数对象
		 * @param {Function} callback 回调方法
		 * @param {Boolean} async 是否异步
		 */
		_doPostJson: function (url, param, callback, async) {
			var ajax = $.ajax({
				url: url,
				type: 'post',
				dataType: 'json',
				async: async,
				data: param,
				success: function (json) {
					if (callback)
						callback(json);
				},
				error:function(error){
					if (callback)
						callback(false);
				}
			});
			return ajax;
		}
	};
	module.exports = new Ajax();
});