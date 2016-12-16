define("mods/addressFun",function(require,exports,module) {
	var com = require('utils/ajax.js'),$ = require('vendors/zepto.js');
	module.exports = {
		//获取select 选中的文本
		Gettext:function(id){
		    var element = document.getElementById(id);
		    var txt= element.options[element.options.selectedIndex].text;
		    return txt;
		},
		//通过地址ID选中给出的地址
		selectedOption:function(ids,vals){
		    if(ids&&vals&&(ids.length = vals.length) && ids.length>0){
		        var len = ids.length;
		        for(var i=0;i<len;i++){
		            var id = ids[i],val = vals[i];
		            var selector = '#'+id+' option[value="'+val+'"]';
		            $(selector).attr("selected","selected");
		        }
		    }
		},
		//选择地址
		changeAddress:function(id,parentId){
		    var element = document.getElementById(id);
		    com.postData('user/query_region_division.json',{parentId:parentId},function(data){
		        if(data.data && data.data.length>0){
		            var addresses = "";
		            for(var i=0;i<data.data.length;i++){
		                var address = data.data[i];
		                addresses += '<option value="'+address.id+'">'+address.name+'</option>';
		            }
		            element.innerHTML = addresses;
		        }else{
		            alerter("数据出错");
		        }
		    });
		},
		//获取地址
		getAddress:function(ids,parentId,index,len,vals){
			var callee = arguments.callee;
		    if(index < len){
		        var id = ids[index];
		        var element = document.getElementById(id);
		        com.postData('/address/regiondivision',{parentId:parentId},function(data){
		            if(data.data && data.data.length>0){
		                var provinces = "";
		                for(var i=0;i<data.data.length;i++){
		                    var province = data.data[i];
		                    provinces += '<option value="'+province.id+'">'+province.name+'</option>';
		                }
		                element.innerHTML = provinces;
		                if(vals && vals.length > 0){
		                    var val = vals[index];
		                    var selector = "#"+id+" option[value='"+val+"']";
		                    $("#"+id+" option[value='"+val+"']").attr("selected","selected");
		                }
		                callee(ids,element.value,index+1,len,vals);
		            }else{
		                element.innerHTML ='<option >暂无数据</option>';
		            }
		        });
		    }
		},
		bindData:function(id,str){
		    var element = document.getElementById(id);
		    if(element){
		        'value' in element?element.value = str:element.innerHTML = str;
		    }
		}
	}
});