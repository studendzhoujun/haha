/**
 * ԭ�ͷ�����չģ��
 */
define("base/class.js",function(require,exports,module) {
    /**
     * ��չ�ַ���format��������ʵ��ռλ���滻
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