/**
 * Created by lishengyong on 2016/7/20.
 */

define('mods/Gomeplus/gotoIndex', function(require, exports, module){
    module.exports = {
        gotoIndex: function(){
            return function() {
                //var url = location.protocol + '//' + location.hostname + '/playgomeplus/taskindex.html';
                //history.go(url);
                history.go(-history.length + 1);
            };
        }
    }
});