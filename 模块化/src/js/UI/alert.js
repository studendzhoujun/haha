define("UI/alert",function(require,exports,module) {
	var $ = require('vendors/zepto');
	module.exports = {
		self:this,
		alerter:function(str,btn,callback){
		    if(str=='用户未登录'){
				this.alertBox('您的账户已经在客户端登录，账户已退出。','提示',function(){
		            location.assign('/login/index');
		        },'去登录','知道了',true,function(){
					location.reload();
				});
		        return false;
		    }
		    var div = document.querySelector('.cover_bg');
		    btn=btn?btn:'确定';
		    if(div){
		        return false;
		    }
		    var cover_bg = document.createElement('div');
		    cover_bg.innerHTML = '<div class="btnBox1"><h3>提示:'+str+'</h3><div class="btnbox"><button id="remove_bg">确定</button></div></div>';
		    cover_bg.className = 'cover_bg';
		    if($('.cover_bg').length==0){
		        document.body.appendChild(cover_bg);
		    }
		    $('#remove_bg').on('click',function(){
		        document.body.removeChild(cover_bg);
		        callback&&callback();
		    });
		},
		alertBox:function(text,title,callBack,btn,btn1,flog,cancelCallback){
		    if(text=='用户未登录'){
		        this.alertBox('您的账户已经在客户端登录，账户已退出。','提示',function(){
		            location.assign('/login/index');
		        },'去登录','知道了',true,function(){
					location.reload();
				});
		        return false;
		    }
		    var str="";
		    title=title?title:"提示";
		    text=text?text:"确定下架吗？";
		    btn=btn?btn:"确定";
		    btn1=btn1?btn1:"取消";
		    if(flog){
		        str="<div class='deleteBox' id='deleteBox'><h2>"+title+"</h2><div><p>"+text+"</p><button  class='cancel' id='confirm'>"+btn+"</button><button  class='confirm' id='cancel'>"+btn1+"</button></div></div>";
		    }else{
		        str="<div class='deleteBox' id='deleteBox'><h2>"+title+"</h2><div><p>"+text+"</p><button class='cancel' id='cancel'>"+btn1+"</button><button class='confirm' id='confirm'>"+btn+"</button></div></div>";
		    }
		    if($('#deleteBox').length===0){
		        $(str).appendTo($('body'));
		        $('<div class="mark" id="mark"></div>').appendTo($('body'));
		    }
		    var h=$('#deleteBox').height();
		    $('#deleteBox').css('margin-top',-h/2);
		    $('#cancel').on("click",function(e){
		        e.stopPropagation();
		        $('#mark').remove();
		        $('#deleteBox').remove();
				cancelCallback && cancelCallback();
		    }),
		    $('#confirm').on("click",function(e) {
		        e.stopPropagation();
		        $('#mark').remove();
		        $('#deleteBox').remove();
		        callBack();
		    });
		},
		alertr1:function(str,btn,callback){
			var that = this;
		    var div = document.querySelector('.mark_content');
		    if(div){
		        return false;
		    }
		    var cover_bg = document.createElement('div');
		    cover_bg.innerHTML='<p><span>'+str+'</span></p>'+
		    '<div class="g_adput clearfix"><div class="g_adput1 clearfix">'+
		    '<div></div>'+
		    '<div></div>'+
		    '<div></div>'+
		    '<div></div>'+
		    '<div></div>'+
		    '<div></div></div>'+
		    '<input type="tel" id="password2" maxlength="6" autocomplete="off"  pattern="\d*" />'+
		    '<input type="hidden" id="j_hidden">'+
		    '</div><p class="mark_content_btn clearfix"><button id="btnCel">取消</button><button id="btnSub">'+btn+'</button></p>';
		    cover_bg.className = 'mark_content';
		    if($('.cover_bg').length==0){
		        document.body.appendChild(cover_bg);
		        $("#cover_bj").show();
		        $("#password2").focus();
		    }
		    var isInputEvent = "oninput" in document ? true : false;
		    var inputEvent = isInputEvent ? "input" : 'keyup';
		    var pwd = $('#password2');
		    var encryptpwd = $('#j_hidden');
		    var isPaste = false;
		    pwd.on('paste',function(e){
		        isPaste = true;
		    });
		    var clean = function () {
		        pwd.val('');
		        encryptpwd.val('');
		        $(".g_adput1").find('div').html("");
		    }
		    encryptpwd.val('');
		    var isInputEvent = "oninput" in document ? true : false;
		    var inputEvent = isInputEvent ? "input" : 'keyup';
		    pwd.on(inputEvent, function(e) {
		        var el = e.target;
		        if (isPaste) clean();
		        isPaste = false;
		        var currentPW =  el.value.split('*').slice(-1).toString();
		        var encryptPW =  encryptpwd[0].value;
		        $(".g_adput1 div").eq($(el).val().length).html("");
		        //删除（触发input事件，未获取删除keycode）
		        if(currentPW.length === 0) {
		            encryptpwd[0].value = encryptpwd[0].value.split(',').slice(0, el.value.length).toString();
		        } else {
		            //新增
		            for (var i=0;i < currentPW.length;i++) {
		                var outkey =currentPW[i];
		                if(encryptpwd.val() === ''){
		                    encryptpwd.val(outkey);
		                } else {
		                    encryptpwd[0].value +=outkey;
		                }
		            }
		            el.value = el.value.replace(/\S/g,"*")
		            $(".g_adput1 div").eq($(el).val().length-1).html("*");
		        }
		    });
		    $('#btnCel').on('click',function(){
		        document.body.removeChild(cover_bg);
		        $("#cover_bj").hide();
		    });
		    $("#btnSub").on('click',function(){
		        if($("#password2").val().length==6){
		            callback();
		            document.body.removeChild(cover_bg);
		            $("#cover_bj").hide();
		        }else{
		            that.alerter("请输入密码！");
		        }
		    });
		},
		alertSecond:function(str){
		    this.remliste();
		    var div = document.createElement('div');
		    div.innerHTML = str;
		    div.id = 'alertSecond';
		    if($('#alertSecond').length==0){
		        document.body.appendChild(div);
		    }
		    setTimeout(function(){
		        if(div){
					try{
		            	document.body.removeChild(div);
					}catch(e){}
		        }
		    },1500);
		},
		//提示2
		alertSecond2:function(str,element,str2){
		    var div = document.createElement('div');
		    div.innerHTML = str;
		    div.id = 'alertSecond2';
		    this.remliste();
		    if($('#alertSecond2').length==0){
		        document.body.appendChild(div);
		    }
		    setTimeout(function(){
		        if(div){
		            document.body.removeChild(div);
		            if(element){
		                if(str2!="true"){
		                    element.hide();
		                }
		            }
		        }
		    },1000);
		},
		//取消禁止滚动
		remliste:function() {
		    window.removeEventListener('touchmove', this.move);
		    window.onmousewheel=function(){return true};//禁止鼠标滚轴滚动
		},
		//禁止滚动
		addliste:function() {
		    window.addEventListener('touchmove', this.move);
		    window.onmousewheel=function(){return false};//禁止鼠标滚轴滚动
		},
		move:function(e) {
		    e.preventDefault && e.preventDefault();
		    e.returnValue = false;
		    e.stopPropagation && e.stopPropagation();
		    return false;
		}
	}
});