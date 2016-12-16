/**
 * 原型方法扩展模块
 */
define("base/class.js",function(require,exports,module) {
    /**
     * 扩展字符串format方法，可实现占位符替换
     * alert("http://{0}/{1}".format("www.gomeplus.com", "index"));
     * @mthod format
     * @returns {String}
     */
    String.prototype.format = function () {
        if (arguments.length == 0) return this;
        for (var s = this, i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    };

});