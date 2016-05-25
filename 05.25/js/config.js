/**
* @author xiaojue
* @fileoverview 配置文件，nodejs和web公用
**/

(function(global, undef) {
  var isBrowser = !!(typeof window !== undef && global.navigator && global.document);
  var debug;
  var basepath;
  if (isBrowser) {
    debug = (/debug/).test(location.search);
    //debug = true;
    // var maps = {
    //   'h5-pre.gomeplus.com':'js-pre.meixincdn.com',
    //   'h5.test.gomeplus.com':'js.test.meixincdn.com',
    //   'h5.dev.gomeplus.com':'js.dev.meixincdn.com',
    //   'h5.gomeplus.com':'js.meixincdn.com',
    //   'guojianing.h5.gomeplus.com':'js.dev.meixincdn.com',
    //   'wujing.h5.gomeplus.com':'js.dev.meixincdn.com',
    //   'handong.h5.gomeplus.com':'js.test.meixincdn.com'
    // };
    // basepath = location.href.match(/^(http[s]?):\/\/(?:[^\/]*)\/.*$/)[1]+'://'+maps[location.host]+'/m/app';
  }
  var mod = {
    // basepath: debug ? basepath + '/src/js/' : basepath + '/dist/js/',
    alias: {
      '$':'vendors/zepto.js',
      'vue':'vendors/vue.js'
    },
    timestamp:'0.0.42'
  };
  if (global.define && isBrowser) {
    define('config', function() {
      return mod;
    });
  } else {
    module.exports = mod;
  }
  if (isBrowser) {
    (/debug/).test(location.search) && (window.onerror = function (msg, url, line) {
      alert('异常信息：' + msg + '\n' + '错误文件：' + url + '\n' + '错误行数：' + line);
    });
  }
})(this);
