/**
 * @module Tab
 * 页签插件
 * @author yanglang
 * 使用方法
 * $('#tabContainer').tab({
 *      items:[
 *          {
 *              title:'上架中',
 *              url:'http://',
 *              params:{key:'花'}, //params:{} or function 参数，可以定死参数，也可以使用一个动态返回参数的方法
 *              render:function(data,i ,$dom){
 *                  $dom.html( template(data) );
 *              } //渲染模板方法，外部提供，$dom为页签面板，data为接口返回的数据
 *          }
 *      ],
 *      loadMoreSelector:'.loadmore', //加载更多元素选择器
 *      isServerFlush:true,//是否服务端渲染首屏数据
 *      isSameFresh:false,//点击同一个页签是否刷新数据
 *      isSwitchFresh:true,//切换页签是否刷新数据
 *      isDropLoad:true,//是否上拉加载数据
 *      index:0 //默认选中哪个页签
 * })
 */
define('UI/tab.js',function(require,exports,module) {
    require('vendors/zepto.js');
    var Ajax = require('utils/ajax.js');
    var dropload = require('vendors/dropload.js');

    var html = '<nav class="tab_header"></nav><div class="tab_body"></div>';

    var defaults = {
        items:[],
        index:0,
        isServerFlush:true,
        isSameFresh:false,
        isSwitchFresh:true,
        isDropLoad:true
    };

    $.fn.tab = function(options){
        return new Tab(this, options);
    };

    /**
     * Tab插件
     * @param element 容器元素
     * @param options 选项
     * @desc init4Client尚未完善，目前应该是服务端渲染的需求
     * @constructor
     */
    var Tab = function(element, options){
        this.$el = $(element);
        this.$tab = $(html);
        this.options = $.extend({}, defaults, options);
        this.items = this.options.items;
        this.init();
    };

    Tab.prototype = {
        constructor:Tab,
        init:function(){
            this.bindEvents();
            //兼容服务端渲染数据的情况
            this.options.isServerFlush ? this.init4Server():this.init4Cliend();
            if(this.options.isDropLoad){
                this.initDropLoad();
            }
            this.index = this.options.index;
        },
        init4Server:function(){
            this.$tab = this.$el.children();
            var i = 0, len = this.items.length;
            for(;i<len;i++){
                this.items[i].pageNum =  this.options.index == i ? 2 : 1;
            }
            return;
        },
        init4Cliend:function(){
            var i = 0,items = this.options.items, len = items.length,headHtml = [],bodyHtml = [];
            for(;i<len ;i++){
                headHtml.push('<a '+(this.options.index == i && 'class="cur"')+' href="javascript:void(0);">'+items[i].title+'</a>');
                bodyHtml.push('<section class="tab_body_page" '+(this.options.index == i && 'style="display:block;"')+'></section>');
                this.options.index == i && this.fetchData(i);
                this.items[i].pageNum = 1;
            }
            this.$el.find('.tab_header').html(headHtml.join(''))
                .find('.tab_body').html(bodyHtml.join(''));
            this.$el.append(this.$tab);
        },
        initDropLoad:function(){
            var that = this;
            var droploadDown = $('body').dropload({
                loadDownFn : function(me){
                    setTimeout(function(){
                        me.resetload();
                        var index = that.getSelectIndex();
                        //that.items[index].pageNum++;
                        that.fetchData(index,true);
                    },500);
                }
            });
            var droploadUp = $('.tab_body',this.$el).dropload({
                loadUpFn : function(me){
                    setTimeout(function(){
                        me.resetload();
                        var index = that.getSelectIndex();
                        that.refresh(index);
                    },500);
                }
            });
        },
        /**
         * 绑定页签点击事件，并加载刷新相应页签下数据
         */
        bindEvents:function(){
            var that = this;
            this.$el.on('click','.tab_header>a',function(){//绑定页签头切换事件
                var index = $(this).index();
                that.options.isSwitchFresh && (that.items[index].pageNum = 1);
                that.select(index);
            }).on('click',that.options.loadMoreSelector,function(){//绑定加载更多元素的点击事件
                var $section = $(this).parents('.tab_body_page'), index = $section.index();
                that.fetchData(index,true);
            });
        },
        /**
         * 设置页签选中
         * @param i index
         * @param force 强制刷新（无视isSwitchFresh属性） 可选
         */
        select:function(i, force){
            var $el = this.$el.find('.tab_header>a').eq(i),index = i;
            if($el.hasClass('cur') && !(this.options.isSameFresh || force))
                return;
            $el.siblings().removeClass('cur');
            $el.addClass('cur');
            this.$el.find('.tab_body>.tab_body_page').hide().eq(index).show();
            this.index = index;
            if((this.options.isSwitchFresh || force) || this.items[index].pageNum == 1){
                this.fetchData(index);
            }
        },
        /**
         * 刷新并切换到某页签下的数据
         * @param i
         */
        refresh:function(i){
            this.items[i].pageNum = 1;
            this.select(i, true);
        },
        getSelectIndex:function(){
            return this.index;
        },
        /**
         * 查询数据
         * @param i 页签序号
         * @param isLoadMore 是否为加载更多
         */
        fetchData:function(i, isLoadMore){
            var that = this,items = that.options.items, url = items[i].url;
            items[i].params ? items[i].params : items[i].params={};
            var paramObj = $.isFunction(items[i].params) ? items[i].params() : items[i].params;
            paramObj.pageNum = that.items[i].pageNum;
            Ajax.query(url, paramObj,function(data){
                if(!data || !data.success)
                    return;
                var render = items[i].render;
                if(render && $.isFunction(render)){
                    //缓存tab某面板
                    var $tabBox = that.$tab.find('.tab_body_page').eq(i);
                    //调用渲染方法
                    render.apply(that,[data.data, i, $tabBox,isLoadMore]);
                }
                that.items[i].pageNum++;
            });
        }
    };

});