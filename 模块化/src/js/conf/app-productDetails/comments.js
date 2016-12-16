/*   评价二级页面
 *   by：zhoujun
 *   date:2016/7/12
*/
define('conf/app-productDetails/comments', function (require, exports, module) {
    require('$');
    var AppInterface = require('utils/appInterface.js');
    var dropload = require('vendors/dropload.js');
    var Ajax = require('utils/ajax.js');
    var FastClick = require('vendors/fastclick.js');
    var utils=require('conf/app-productDetails/miutils.js');
     FastClick.attach(document.body);
//获取当前页面的url里的参数
    utils.console('国美＋');
    var params = utils.getParams();
    var proId = params.proId;
    var locId = params.locId ? params.locId : 1;
    var body=document.querySelector('body');
    var ff=true;
//点击图片放大
    $('body').on('click', '.buyers-show img', function() {
        var index = $(this).index();
        var arr = [];
        var str='';
        var aImg = $(this).parent().children();
        var len = aImg.length;
        for (var i = 0; i < len; i++) {
            arr.push(aImg[i].getAttribute('mysrc'));
        };
        str=arr.join(',');
        AppInterface.call('/common/viewLargerPicture',{imgUrl:str,position:index});
    });
  //createHtml(type,param)
  /*  
  *  type:类型   0-content,1-score;2-obj,3-string
  *  param:参数
  */
  function createHtml(type,param){
      var html='';
        switch(type){
            case 0:
                  var len=param.length;
                  if(len){
                    html=param;
                  }else{
                    html='该用户未填写评价内容';
                  }
            break;
            case 1:
                  var num=parseInt(param)
                  for(var i=0;i<num;i++){
                    html+='<em class="icon icon-star"></em>';
                  }
            break;
            case 2:
                  var arr=param;
                  for(var i=0;i<arr.length;i++){
                    html+='<img src="'+arr[i].yasuo+'" mysrc="'+arr[i].yuantu+'">';
                  }
            break;
            case 3:
                  var str=param?param:'';
                  var len=str.length;
                  if(len){
                    html='<p class="owner-reply">店主回复:'+str+'</p>';
                  }
            break;
            default:
                   html='';
            break;
        }
      return html;
  }
  //getData();
  var flag=false;
  var pageNum=1;
  function getData(proId,pageNum){
    var html='';
    Ajax.query('/goods/getcomments', {proId:proId,pageNum:pageNum}, function (data) {
            console.log(data);
            var data=data.data.itemComments;
            if(data.length<10){
                flag=true;
            }
        for(var i=0;i<data.length;i++){
          html+='<div class="comment-box"><dl class="user-head"><dt class="user-head-l"><img src="'+data[i].creater.facePicUrl+'"></dt><dd class="user-head-r"><h2>'+data[i].creater.nickname+'</h2><span>'+utils.convertTime(data[i].createTime,'.')+'</span></dd></dl><p class="comment-txt">'+createHtml(0,data[i].content)+'</p><div class="grade-star">'+createHtml(1,data[i].score)+'</div><div class="buyers-show">'+createHtml(2,data[i].imagesList)+'</div>'+createHtml(3,data[i].replyContent)+'</div>';
        }
         $('.bg-white').append(html);
    });
  }
  //dropload的方法
  var droploadDown = $('body').dropload({
        loadDownFn: function (me) {
            setTimeout(function () {
                me.resetload();
                if(flag){
                     if(ff){
                        AppInterface.toast('没有更多内容');
                     }
                }else{
                    pageNum++;
                    getData(proId,pageNum);
                }
            }, 500);
        }
    });
});
