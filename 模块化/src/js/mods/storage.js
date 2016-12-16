define("mods/storage",function(require,exports,module){
	module.exports = {
		setItem:function(name,val){
			var isLocal = true;
			var value = val;
			if(val && val instanceof Object){
				value = JSON.stringify(val);
			}
			isLocal?window.localStorage.setItem(name,value):window.sessionStorage.setItem(name,value);
		},
		getItem:function(name){
			var isLocal = true;
			var val = isLocal?localStorage.getItem(name):sessionStorage.getItem(name);
			return val;
		},
		removeItem:function(name){
			var isLocal = true;
			var item = this.getItem(name);
			item?(isLocal?window.localStorage.removeItem(name):window.sessionStorage.removeItem(name)):console.log(item + 'is none');
		},
		setItems:function(names,vals){
			var isLocal = true;
			for(var i=0;i<names.length;i++){
				var name = names[i],val = vals[i]?vals[i]:'';
				this.setItem(name,val,isLocal);
			}
		},
		getItems:function(names){
			var isLocal = true;
			var items = new Array();
			for(var i=0;i<names.length;i++){
				var item = this.getItem(name,isLocal);
				items.push(item);
			}
			return items;
		},
		removeItems:function(names){
			var isLocal = true;
			for(var i=0;i<names.length;i++){
				var name = names[i];
				this.removeItem(name,isLocal);
			}
		},
		setCookie:function(name,value,expiresHours){       //设置存储键值对        
		    var cookieString = name+"="+escape(value);
			//判断是否设置过期时间
		    if(expiresHours>0){
		        var date=new Date();
		        date.setTime(date.getTime()+expiresHours*3600*24*1000);
		        cookieString=cookieString+"; expires="+date.toGMTString()+";path=/";
		    }
		    document.cookie=cookieString+";path=/";
		},
		getCookie:function(name){                  //获取键对应的值
		    var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		    if(arr!=null)return unescape(arr[2]); return "";
		},
		removeCookie:function(name){              //删除键值对（通过设置过期时间）
		   var date=new Date().getTime()-1;
		    document.cookie=name+"="+escape(getCookie(name))+";expires="+new Date(date).toUTCString();
		},
		/* 临时写入.gomeplus.com */
		setCookieDomain: function(name, value, domain, expiresHours) {
			var cookieString = name + "=" + escape(value);
			//判断是否设置过期时间
			if(expiresHours > 0){
				var date = new Date();
				date.setTime(date.getTime() + expiresHours * 3600 * 24 * 1000);
				cookieString=cookieString+"; expires="+date.toGMTString()+";path=/;domain=" + domain;
			}
			document.cookie = cookieString + ";path=/;domain=" + domain;
		},
		clear:function(){
			var isLocal = true;
			isLocal?window.localStorage.clear():window.sessionStorage.clear();
		}
	}
});