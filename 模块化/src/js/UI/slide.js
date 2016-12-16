/*
 *   by:  zhoujun
 *   date:2016/7/29
 */
define('UI/slide.js', function(require, exports, module) {
  var win = window,
    doc = document;

var Events = function() {
    this.map = {};
  };

  Events.prototype = {
    constructor: Events,
    trigger: function(name, args) {
      var self = this,
        cbs = this.map[name];
      if (cbs) {
        cbs.forEach(function(fn) {
          fn.apply(self, args);
        });
      }
    },
    on: function(name, cb) {
      if (this.map[name]) {
        this.map[name].push(cb);
      } else {
        this.map[name] = [cb];
      }
    }
  };

  var utils = {
    deviceW: (function() {
      return doc.body.clientWidth;
    })(),
    getStyle: function(obj, sName) {
      return obj.currentStyle || getComputedStyle(obj, false)[sName];
    },
    addEvent: function(obj, sEv, fn) {
      obj.addEventListener(sEv, fn, false);
    },
    removeEvent: function(obj, sEv, fn) {
      obj.removeEventListener(sEv, fn, false);
    },
    ceilNum: function(str) {
      var num=parseFloat(str,10);
      return Math.round(num)-num>0?Math.round(num):num;
    }
  };

  /* var ATTRS = {
     BOXCLS: 'J_slide_box',
     ITEMCLS: 'J_slide_item'
   };*/

  function Slide(param) {
    this.$element = param.ele;
    this.listX = 0;
    this.events = new Events();
    this.scroll_min = 0;
    this.ATTRS = {
      BOXCLS: param.BOXCLS || 'J_slide_box',
      ITEMCLS: param.ITEMCLS || 'J_slide_item'
    };
    this.init(param.ele);
  }

  Slide.prototype = {
    constructor: Slide,
    start: function(ev) {
      var transform = getComputedStyle(this.$box).webkitTransform;
      var x = transform.replace(/[^\d-.,]/g, '').split(',')[4];//获取当前的translateX;
      this.$box.style.webkitTransitionDuration = '0ms';
      this.$box.style.webkitTransform = 'translateX(' + x + 'px)';
      this.dir='';
      this.startX = ev.touches[0].clientX - this.boxLeft;
      this.sX=ev.touches[0].pageX;
      this.sY=ev.touches[0].pageY;
      this.startY = ev.touches[0].clientY;
      this.drag_before_x = this.listX = parseInt(x) || 0;
      this.startTime = new Date();
    },
    move: function(ev) {
        if (Math.abs(ev.touches[0].pageX - this.sX) > 20) {
           var d = ev.touches[0].clientX - this.startX;
            this.listX = this.drag_before_x + d;
            if (this.listX > 0) {
              this.listX = this.drag_before_x + d / 2;
            } else if (this.listX < -this.scroll_max) {
              this.listX = this.drag_before_x + d / 2;
            }
            this.$box.style.webkitTransform = 'translateX(' + this.listX + 'px)';
            ev.preventDefault();
        }
        if (Math.abs(ev.touches[0].pageY - this.sY) > 5) {

        }
      
    },
    end: function() {
      var duration = new Date() - this.startTime;
      var dist = this.listX - this.drag_before_x;
      this.listX = this.doInertia(dist, duration, this.listX, this.$box);
      this.events.trigger('end');
    },
    bindEvent: function() {
      var $box = this.$box;
      utils.addEvent($box, 'touchstart', this.start.bind(this));
      utils.addEvent($box, 'touchmove', this.move.bind(this));
      utils.addEvent($box, 'touchend', this.end.bind(this));
      utils.addEvent($box, 'webkitTransitionEnd', this.reback.bind(this));
    },
    momentum: function(dist, time, maxDist) {
      var deceleration = 0.001,
        speed = Math.abs(dist) / time,
        newDist = (speed * speed) / (2 * deceleration),
        newTime = 0;

      if (Math.abs(newDist) > maxDist) {
        newDist = maxDist;
        speed = speed / 6;
      }
      newDist = newDist * (dist < 0 ? -1 : 1);
      newTime = speed / deceleration;
      return {
        'dist': newDist,
        'time': newTime
      };
    },
    doInertia: function(dist, duration, currectX, elem) {
      var v = dist / duration;
      if (Math.abs(v) > 0.2 && duration < 200 && currectX < 0 && currectX > -this.scroll_max) {
        // < 0 向下滑动，检查下边界, >0 向上滑动，检查上边界
        var c = dist < 0 ? currectX + this.scroll_max : -currectX;
        var maxDist = c + this.$element.clientWidth / 6;
        var param = this.momentum(dist, duration, maxDist);
        elem.style.webkitTransitionDuration = param.time + 'ms';
        var toX = currectX + param.dist;
        elem.style.webkitTransform = 'translateX(' + toX + 'px)';
        return toX;
      }
      this.reback();
      return currectX;
    },

    reback: function() {
      if (this.listX > 0) {
        this.listX = 0;
      } else if (this.listX < -this.scroll_max) {
        this.listX = -this.scroll_max;
      }
      this.$box.style.webkitTransitionDuration = '100ms';
      this.$box.style.webkitTransform = 'translateX(' + this.listX+ 'px)';
    },

    setBoxStyle: function($element) {
      var $box = $element.getElementsByClassName(this.ATTRS.BOXCLS)[0];
      var $items = $element.getElementsByClassName(this.ATTRS.ITEMCLS);
      var boxwidth = 0;
     /* Array.from($items).forEach(function($item) {
        boxwidth += $item.offsetWidth + utils.ceilNum(utils.getStyle($item, 'margin-left')) + utils.ceilNum(utils.getStyle($item, 'margin-right'));
      });*/
      for(var i=0;i<$items.length;i++){
        boxwidth += $items[i].offsetWidth + utils.ceilNum(utils.getStyle($items[i], 'margin-left')) + utils.ceilNum(utils.getStyle($items[i], 'margin-right'));
      }
      /*console.log(parseFloat(utils.getStyle($items[0], 'margin-left'), 10).toFixed(2));*/
      $box.style.width = boxwidth + 'px';
      $box.style.height = $items[0].offsetHeight + 'px';
      $element.style.width = $element.offsetWidth + 'px';
      $element.style.overflow = 'hidden';
      this.boxWidth = boxwidth;
      this.boxLeft = $box.offsetLeft;
      this.boxTop = $box.offsetTop;
      this.$box = $box;
      this.scroll_max = this.boxWidth - this.$element.clientWidth;
    },
    init: function(element) {
      this.setBoxStyle(element);
      this.bindEvent();
    }
  };
  win.touchSlide = Slide;
  module.exports = win.touchSlide;

});

