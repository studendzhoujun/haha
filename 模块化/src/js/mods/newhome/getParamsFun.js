/**
 * Created by tianguangyu on 2016/7/23.
 */
define("mods/newhome/getParamsFun", function(require,exports,module) {

    function Params(){
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
    }
    module.exports = new Params();
});