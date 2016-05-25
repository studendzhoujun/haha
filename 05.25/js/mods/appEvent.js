define("mods/appEvent",function(require,exports,module) {
	var common_ui = require("UI/alert"),
		ck = require("mods/check"),
		$ = require('vendors/zepto');

	module.exports = {
		redirect_to_native:{
	        init: function(config) {
	            var self = this;
	            self.platform = self._UA();
	            if(!self.platform) return;
	            if (self.platform == 'ios') {
	                self.installUrl = config.iosInstallUrl;
	                self.nativeUrl = config.iosNativeUrl;
	                self.openTime = config.iosOpenTime || 2000;
	            } else {
	                self.installUrl = config.androidInstallUrl;
	                self.nativeUrl = config.andriodNativeUrl;
	                self.openTime = config.androidOpenTime || 2000;
	                self.packages = config.packages || 'com.gome.eshopnew';
	            }
	            //只有android下的chrome要用intent协议唤起native
	            if (self.platform != 'ios' && !!navigator.userAgent.match(/Chrome/i)) {
	                self._gotoNative(config.isShare);
	            } else {
	                if(ck.ios9()){
	                    location.href=self.nativeUrl;
	                }else{
	                    self._gotoNative(config.isShare);
	                }
	            }
	        },
	        _hackChrome: function() {
	            var self = this;
	            var startTime = Date.now();
	            var paramUrlarr = self.nativeUrl.split('://'),
	                scheme = paramUrlarr[0],
	                schemeUrl = paramUrlarr[1];
	            window.location = 'intent://' + schemeUrl + '#Intent;scheme=' + scheme + ';package=' + self.packages + ';end';
	            setTimeout(function() {
	                self._gotoDownload(startTime);
	            }, self.openTime);
	        },
	        _gotoNative: function(isShare) {
	            var self = this;
	            var startTime = Date.now(),
	                doc = document,
	                body = doc.body,
	                iframe = doc.createElement('iframe'),
	                flog=true;
	            iframe.id = 'J_redirectNativeFrame';
	            iframe.style.display = 'none';
	            iframe.src = self.nativeUrl;
	            //运行在head中
	            if(!body) {
	                setTimeout(function(){
	                    doc.body.appendChild(iframe);
	                    flog=false;
	                }, 0);
	            } else {
	                body.appendChild(iframe);
	                flog=false;
		    }
		    if(isShare){
                	return false;
	            }
	            setTimeout(function() {
	                doc.body.removeChild(iframe);
	                if(!flog){
	                    self._gotoDownload(startTime);
	                }
	            }, self.openTime);
	        },
	        _gotoDownload: function(startTime) {
	            var self = this;
	            var endTime = Date.now();
	            if (endTime - startTime < self.openTime + 500) {
	                window.location = self.installUrl;
	            }
	        },
	        _UA: function() {
	            var ua = navigator.userAgent;
	            // ios
	            if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
	                return 'ios';
	            } else if (!!ua.match(/Android/i)) {
	                return 'android';
	            } else {
	                return '';
	            }
	        }
	    },
	    appStart:function(obj,isShare){
	        if(ck.isWeiXin()){
	            if(ck.isIOS()){
	                common_ui.alerter('请点击右上角“更多”，选择在“Safari中打开”');
	            }else{
	                common_ui.alerter('请点击右上角“更多”，选择在“浏览器中打开”');
	            }
	        }else{
	            var search = location.search,
	                ios_native_url =ios_native_url?'gomeo2o://'+obj:'gomeo2o://',
	                andriod_native_url =andriod_native_url?'gomeo2ob://'+obj:'gomeo2ob://',
	                andriod_download_url ="../mime/download.php",
	                ios_download_url='../mime/download.php';
	            config_obj = {
	                iosInstallUrl: ios_download_url,
	                androidInstallUrl: andriod_download_url,
	                iosNativeUrl: ios_native_url,
	                andriodNativeUrl: andriod_native_url,
	                packages: '',
                	isShare:isShare
	            };
	            this.redirect_to_native.init(config_obj);
	        }
	    },
	    appDownloadIdxTop:function(href){
	        var spt_close=$id('spt_close'),
	            spt=$id('spt');
	        if(href==undefined){
	            spt.addEventListener("click",function (e){
	                if(e.target!=spt_close){
	                    this.appStart();
	                }
	            },false);
	            spt_close.addEventListener("click",function (){
	                spt.style.display='none';
	                var isfloat = $('#float_id').val();
	//                    appEvent.setCookie(isfloat,'1');
	            },false);
	        }else{
	            spt.addEventListener("click",function (e){
	                if(href!=undefined&&e.target!=spt_close){
	                    window.location.href=href;
	                }
	            },false);
	            spt_close.addEventListener("click",function (){
	                spt.style.display='none';
	                var isfloat = $('#float_id').val();
	//                    appEvent.setCookie(isfloat,'1');
	            },false);
	        }
	    },
	    appDownload:function(dom){
	        this.appStart();
	    }
	}
});