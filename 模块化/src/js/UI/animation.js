/**
 * Created by lishengyong on 2016/6/30.
 */

define('UI/animation.js', function(require, exports, module) {

    var Animation = {
        //设置元素透明度,透明度值按IE规则计,即0~100
        setOpacity: function(ev, v) {
            ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
        },
        //淡入效果(含淡入到指定透明度)
        fadeIn: function(elem, speed, opacity){
            /*
             * 参数说明
             * elem==>需要淡入的元素
             * speed==>淡入速度,正整数(可选)
             * opacity==>淡入到指定的透明度,0~100(可选)
             */
            var me = this;
            if(elem[0]) {
                elem = elem[0];
            }
            speed = speed || 20;
            opacity = opacity || 100;
            //显示元素,并将元素值为0透明度(不可见)
            elem.style.display = 'block';
            me.setOpacity(elem, 0);
            //初始化透明度变化值为0
            var val = 0;
            //循环将透明值以5递增,即淡入效果
            (function(){
                me.setOpacity(elem, val);
                val += 5;
                if (val <= opacity) {
                    setTimeout(arguments.callee, speed)
                }
            })();
        },
        //淡出效果(含淡出到指定透明度)
        fadeOut: function(elem, speed, opacity) {
            /*
             * 参数说明
             * elem==>需要淡入的元素
             * speed==>淡入速度,正整数(可选)
             * opacity==>淡入到指定的透明度,0~100(可选)
             */
            if(elem[0]) {
                elem = elem[0];
            }
            var me = this;
            speed = speed || 20;
            opacity = opacity || 0;
            //初始化透明度变化值为0
            var val = 100;
            //循环将透明值以5递减,即淡出效果
            (function(){
                me.setOpacity(elem, val);
                val -= 5;
                if (val >= opacity) {
                    setTimeout(arguments.callee, speed);
                }else if (val < 0) {
                    //元素透明度为0后隐藏元素
                    elem.style.display = 'none';
                }
            })();
        }

    };
    module.exports = Animation;

});