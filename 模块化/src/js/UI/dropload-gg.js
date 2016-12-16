define('UI/dropload-gg',function(require,exports,module){
    var $ = require('vendors/zepto');
    require('utils/appInterface.js');
    (function($){
        'use strict';
        var $win = $(window);
        var $doc = $(document);
        $.fn.dropload = function(options){
            return new MyDropLoad(this, options);
        };
        var MyDropLoad = function(element, options){
            var me = this;
            me.$element = $(element);
            me.insertDOM = false;
            me.loading = false;
            me.isLock = false;
            me.init(options);
        };

        var timer;

        function cbsQueue(){
            this.cbs = [];
            this.timer = null;
        }

        cbsQueue.prototype = {
          fire:function(){
            var fn = this.cbs[this.cbs.length - 1];
            if(fn) fn();
            this.clear();
          },
          put:function(cb){
            var self = this;
            if(this.timer) clearTimeout(timer);
            this.timer = setTimeout(function(){
                self.cbs.push(cb);
            },5);
          },
          clear:function(){
            this.cbs = [];
          }
        };

        var appdrag = new cbsQueue();

        var dragdowncbs = [];

        // 初始化
        MyDropLoad.prototype.init = function(options){
            var me = this;
            me.opts = $.extend({}, {
                scrollArea : me.$element,                                            // 滑动区域
                domUp : {                                                            // 上方DOM
                    domClass   : 'dropload-up',
                    domRefresh : '<div class="dropload-refresh"><span class="loading"></span>下拉刷新</div>',
                    domUpdate  : '<div class="dropload-update"><span class="loading"></span>释放更新</div>',
                    domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
                },
                domDown : {                                                          // 下方DOM
                    domClass   : 'dropload-down',
                    domRefresh : '<div class="dropload-refresh"><span class="loading"></span>上拉加载更多</div>',
                    domUpdate  : '<div class="dropload-update"><span class="loading"></span>释放加载</div>',
                    domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
                },
                distance : 50,                                                       // 拉动距离
                loadUpFn : '',                                                       // 上方function
                loadDownFn : ''                                                      // 下方function
            }, options);

            // 判断滚动区域
            if(me.opts.scrollArea == window){
                me.$scrollArea = $win;
            }else{
                me.$scrollArea = me.opts.scrollArea;
            }

            // 绑定触摸
            me.$element.on('touchstart',function(e){
                if(!me.loading && !me.isLock){
                    fnTouches(e);
                    fnTouchstart(e, me);
                }
            });
            me.$element.on('touchmove',function(e){
                if(!me.loading && !me.isLock){
                    fnTouches(e, me);
                    fnTouchmove(e, me);
                }
            });
            me.$element.on('touchend',function(){
                if(!me.loading && !me.isLock){
                    fnTouchend(me);
                }
            });
        };

        // touches
        function fnTouches(e){
            if(!e.touches){
                e.touches = e.originalEvent.touches;
            }
        }

        // touchstart
        function fnTouchstart(e, me){
            me._startY = e.touches[0].pageY;
            me._startX = e.touches[0].pageX;
            // 判断滚动区域
            if(me.opts.scrollArea == window){
                me._meHeight = $win.height();
                me._childrenHeight = $doc.height();
            }else{
                me._meHeight = $(window).height();
                me._childrenHeight = me.$element.height();
            }
            var overflow = me.$scrollArea.parent().css('overflow');
            if(overflow && (overflow == 'scroll' || overflow == 'auto'))
                me._scrollTop = me.$scrollArea.scrollTop();
            else
                me._scrollTop = $(window).scrollTop();
        }

        // touchmove      100
        function fnTouchmove(e, me){
            me._curY = e.touches[0].pageY;
            me._curX = e.touches[0].pageX;
            me._moveY = me._curY - me._startY;
            me._moveX = me._curX - me._startX;

            //if(me._moveY > 0 && Math.abs(me._moveX) < 30){
            if(me._moveY > 0){
                me.direction = 'down';
            }else if(me._moveY < 0){
                me.direction = 'up';
            }else{
                me.direction = null;
            }

            //$(".gg-nav p").text(me._curY);
            var _absMoveY = Math.abs(me._moveY);

            // 加载上方
            if(me.opts.loadUpFn != '' && me._scrollTop <= 10 && me.direction == 'down'){
                e.preventDefault();
                if(!me.insertDOM){
                    me.$element.prepend('<div class="'+me.opts.domUp.domClass+'"></div>');
                    me.insertDOM = true;
                }
                clearInterval(timer);

                me.$domUp = $('.'+me.opts.domUp.domClass);
                fnTransition.call(me,me.$domUp,0);

                // 下拉
                if(_absMoveY <= me.opts.distance){
                    me._offsetY = _absMoveY;
                    // 待解决：move时会不断清空、增加dom，有可能影响性能，下同
                    me.$domUp.html('').append(me.opts.domUp.domRefresh);
                    // 指定距离 < 下拉距离 < 指定距离*2
                }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                    me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                    me.$domUp.html('').append(me.opts.domUp.domUpdate);
                    // 下拉距离 > 指定距离*2
                }else{
                    me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
                }
                var oY=me._offsetY;

                //console.log(_absMoveY <= me.opts.distance,_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2,oY)
                if(oY<=5){

                    appdrag.put(function(){
                        AppInterface.call('/common/updateTitleStatus',{type:1});
                    })
                }else{
                    appdrag.put(function(){
                        AppInterface.call('/common/updateTitleStatus',{type:0});
                    });
                }

                me.$domUp.css({'height':me._offsetY});

                appdrag.fire();

            }

            // 加载下方
            if(me.opts.loadDownFn != '' && me._childrenHeight <= (me._meHeight+me._scrollTop) && me.direction == 'up'){
                e.preventDefault();
                if(!me.insertDOM){
                    me.$element.append('<div class="'+me.opts.domDown.domClass+'"></div>');
                    me.insertDOM = true;
                }

                me.$domDown = $('.'+me.opts.domDown.domClass);

                // 上拉
                if(_absMoveY <= me.opts.distance){
                    me._offsetY = _absMoveY;
                    me.$domDown.html('').append(me.opts.domDown.domRefresh);
                    // 指定距离 < 上拉距离 < 指定距离*2
                }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                    me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                    me.$domDown.html('').append(me.opts.domDown.domUpdate);
                    // 上拉距离 > 指定距离*2
                }else{
                    me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
                }
                me.$domDown.css({'height': me._offsetY});
                me.$scrollArea.scrollTop(me._offsetY+me._scrollTop);

            }
        }

        var endtimer;

        // touchend
        function fnTouchend(me){
            if(me.insertDOM){
                    dragdowncbs = [];
                    if(endtimer) clearTimeout(endtimer);
                    endtimer = setTimeout(function () {
                        timer = setInterval(function(){
                            if($('.dropload-up').length < 1){
                                AppInterface.call('/common/updateTitleStatus',{type:1});
                                clearInterval(timer);
                            }
                        },10);
                    },100);
            }
            var _absMoveY = Math.abs(me._moveY);

            if(me.insertDOM){
                if(me.direction == 'down'){
                    me.$domResult = me.$domUp;
                    me.domLoad = me.opts.domUp.domLoad;
                }else if(me.direction == 'up'){
                    me.$domResult = me.$domDown;
                    me.domLoad = me.opts.domDown.domLoad;
                }


                var hasDOM = fnTransition.call(me,me.$domResult,300);

                if(!hasDOM) return;
                if(_absMoveY > me.opts.distance){
                    me.$domResult.css({'height':me.$domResult.children().height()});
                    me.$domResult.html('').append(me.domLoad);
                    fnCallback(me);
                }else{
                    AppInterface.call('/common/updateTitleStatus',{type:1});
                    me.$domResult.css({'height':'0'}).on('webkitTransitionEnd',function(){
                        me.insertDOM = false;
                        $(this).remove();

                    });
                }
                me._moveY = 0;
                me._moveX = 0;

            }
            me.direction = null;
        }

        // 回调
        function fnCallback(me){
            me.loading = true;
            if(me.opts.loadUpFn != '' && (me.direction == 'down' || me.direction == null)){
                clearInterval(timer);
                clearTimeout(endtimer);
                appdrag.clear();
                me.opts.loadUpFn(me);
            }else if(me.opts.loadDownFn != '' && me.direction == 'up'){
                me.opts.loadDownFn(me);
            }
        }

        // 锁定
        MyDropLoad.prototype.lock = function(){
            var me = this;
            me.isLock = true;
        };

        // 解锁
        MyDropLoad.prototype.unlock = function(){
            var me = this;
            me.isLock = false;
        };

        // 重置
        MyDropLoad.prototype.resetload = function(){
            var me = this;
            if(!!me.$domResult){
                me.$domResult.css({'height':'0'}).on('webkitTransitionEnd',function(){
                    me.loading = false;
                    me.insertDOM = false;
                    $(this).remove();
                });
            }
        };

        // css过渡
        function fnTransition(dom,num){
            if(!dom){
                this.loading = false;
                this.insertDOM = false;
                if(this.$domDown) this.$domDown.remove();
                if(this.$domUp) this.$domUp.remove();
                this._moveY = 0;
                return false;
            }

            dom.css({
                '-webkit-transition':'all '+num+'ms'
            });
            return true;
        }
    })($);
    module.exports = $;
});