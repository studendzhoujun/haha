/*
 *   getVersion
 *  
 */
define('UI/getVersion.js', function(require, exports, module) {
  var storage = require('mods/storage.js');
  module.exports = {
    getVersion:function(){
      if(storage.getCookie('commonParams')){
       var commonParams = JSON.parse(storage.getCookie('commonParams'));
       return commonParams.appVersion.replace(/\./g,'').substring(0,3);
      }
    }
  };
});