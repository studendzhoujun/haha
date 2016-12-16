/**
 * Created by lishengyong on 2016/8/1.
 */
define('mods/Gomeplus/strCut.js', function(require, exports, module){
    module.exports = {
        autoAddEllipsis: function (pStr, pLen) {
            var me = this;
            var ret = me.cutString(pStr, pLen);
            var cutFlag = ret.cutflag;
            var cutStringn = ret.cutstring;
            if ("1" == cutFlag) {
                return cutStringn + "...";
            } else {
                return cutStringn;
            }
        },
        cutString: function (pStr, pLen) {
            var me = this;
            if(!pStr) {
                return {"cutstring": '', "cutflag": ''};
            }
            // 原字符串长度
            var strLen = pStr.length;
            var cutString;
            // 默认情况下，返回的字符串是原字符串的一部分
            var cutFlag = "1";
            var lenCount = 0;
            var ret = false;
            if (strLen <= pLen / 2) {
                cutString = pStr;
                ret = true;
            }
            if (!ret) {
                for (var i = 0; i < strLen; i++) {
                    if (me.isFull(pStr.charAt(i))) {
                        lenCount += 2;
                    } else {
                        lenCount += 1;
                    }
                    if (lenCount > pLen) {
                        cutString = pStr.substring(0, i);
                        ret = true;
                        break;
                    } else if (lenCount == pLen) {
                        cutString = pStr.substring(0, i + 1);
                        ret = true;
                        break;
                    }
                }
            }
            if (!ret) {
                cutString = pStr;
                ret = true;
            }
            if (cutString.length == strLen) {
                cutFlag = "0";
            }
            return {"cutstring": cutString, "cutflag": cutFlag};
        },
        isFull: function (pChar) {
            if(!pChar) {
                return false;
            }
            if ((pChar.charCodeAt(0) > 128)) {
                return true;
            } else {
                return false;
            }
        }
    }
});




