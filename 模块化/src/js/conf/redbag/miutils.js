/*
*  by zhoujun
*/
define('conf/redbag/miutils', function (require, exports, module) {
	module.exports={
         getParams: function () {
            var params = {};
            var search = location.search.substr(1);
            if (search) {
                var key_values = search.split('&');
                if (key_values && key_values.length > 0) {
                    for (var i = 0; i < key_values.length; i++) {
                        var key = key_values[i].split('=')[0];
                        var val = key_values[i].split('=')[1];
                        params[key] = val;
                    }
                }
            }
            return params;
        },
        convertTime: function (timestamp, sp, hasTime) {
            var date = new Date(), now = new Date(), returnTime = '';
            date.setTime(timestamp);
            var year = date.getFullYear() || now.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate() || now.getDate();
            var sp = sp || '-';
            returnTime = year + sp + (month > 9 ? month : '0' + month) + sp + (day > 9 ? day : '0' + day);
            if (hasTime) {
                var hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds();
                returnTime += ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
            }
            return returnTime;
        },
        noTouchmove:function(ev){
            ev.preventDefault();
        },
        replaceName:function(str){
            return str.substr(0, 1) + "**" + str.substr(str.length - 1);
        },
        console:function(str){
     		  var str=str||'meichuangqiuku';
             console.log('%c'+str, 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:2em;');
     	}
	}
});