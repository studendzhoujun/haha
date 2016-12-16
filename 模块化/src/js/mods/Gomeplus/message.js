/**
 * Created by lishengyong on 2016/7/13.
 * 用于操作存储玩赚国美+ 里的消息通知。从后台接口里取值增量存储。
 * 取消息的时候取出来就删掉
 */

define('mods/Gomeplus/message', function(require, exports, module){
    require('$');
    var storage = require('mods/storage.js');
    var Animation = require('UI/animation.js');
    module.exports = {
        key:'GOMEPLUS_MESSAGE_KEY',
        task:0,
        getMessage: function(){
            return storage.getItem(this.key);
        },
        setMessage: function(msg){
            // 根据key值获取原来存储的值， 拼接上现在的值再更新
            var msgs = storage.getItem(this.key);
            var res;
            if(msgs){
                if(!(msgs instanceof Array)) {
                    msgs = JSON.parse(msgs);
                }
                if(!(msg instanceof  Array)){
                    msg = JSON.parse(msg);
                }
                res = JSON.stringify(msgs.concat(msg));
            } else {
                res = msg;
            }
            storage.setItem(this.key, res);
        },
        getAndRemove: function(){
            // 获取到相应的值， 并取出一条数据，然后删除， 再更新storage
            var msgs = storage.getItem(this.key);
            if(!msgs){
                return;
            }
            var res = '';
            if(!(msgs instanceof Array)) {
                msgs = JSON.parse(msgs);
            }
            res = msgs.shift();
            storage.setItem(this.key, JSON.stringify(msgs));
            return res;
        },
        startMessage: function(){
            var that = this;
            var storageMsg = that.getMessage();
            if(storageMsg && JSON.parse(storageMsg).length > 0) {
                // 获取一条消息并删除在storage里的值，然后在页面显示出来
                var msg = that.getAndRemove();
                if(msg) {
                    $('#tipMessage span').text(msg);
                    Animation.fadeIn($('#tipMessage'), 50);
                }
                that.task = setTimeout(function(){
                    that.startMessage();
                }, 2000);
            } else {
                // 清除定时任务
                that.clearTT();
            }
        },
        // 从接口获取消息
        queryMessage: function(){
            var that = this;
            $.ajax({
                type:'get',
                url:'getNotification',
                data: '',
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    if(data　&& data.length > 0) {
                        that.setMessage(JSON.stringify(data));
                    }
                    that.startMessage();
                },
                error: function(xhr, type){
                    console.log('Ajax error!');
                }
            });
        },
        clearTT: function() {
            var that = this;
            clearTimeout(that.task);
            $('#tipMessage').hide();
        }
    };

});
