define('mods/returnTop',function(require,exports,module){
    module.exports = {
        moving:0,
        returnTop : function(){
            var self = this;
            var returntop = document.getElementById('returntop');
            if(returntop){
                returntop.style.display = 'none';
                window.onscroll=function(){
                    var h = document.body.scrollTop;
                    if (h > 500) {
                        returntop.style.display = 'block';
                    }else{
                        returntop.style.display = 'none';
                    }
                };
                document.addEventListener('touchstart',function(){
                    if(self.moving)
                        event.preventDefault();
                });
                returntop.onclick = function(){
                    var doc = document.body ;
                    self.topMove(doc,300)
                }
            }
        },
        //向上滑动动态效果
        topMove :function(obj,time) {
            var that = this;
            this.moving = 1;
            if (time>30) var s = Math.round(time/30)
            else var s = 1;
            obj.timer=setInterval(function (){
                var bStop=true;
                var t = obj.scrollTop;
                var speed=(0-t)/(s/2);
                speed=speed>0?Math.ceil(speed):Math.floor(speed);
                if(0!=obj.scrollTop){
                    bStop=false;
                }
                obj.scrollTop = t+speed;
                if(bStop) {
                    clearInterval(obj.timer);
                    that.moving = 0
                }
            }, 30);
        }
    }
});
    