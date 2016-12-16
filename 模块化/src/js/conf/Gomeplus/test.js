/**
 * Created by lishengyong on 2016/7/5.
 */
define('conf/Gomeplus/test.js', function(require, exports, module){
    require('$');
    require('utils/appInterface.js');

    // 微信好友个数校验
    var tempNum = '';
    $('#numOfWXFriend input').on('input', function(){
        var val = $('#numOfWXFriend input').val();
        if(val) {
            val = val.trim();
        }
        var reg = /^[1-9]*[1-9][0-9]*$/;
        if(val && !reg.test(val.trim())) {
            $('#numOfWXFriend input').val(tempNum);
        } else {
            tempNum = val;
        }
        /*var flag = showNextQuestion();
        $('#getResult').toggleClass('hidden', flag);*/
        if($('#numOfWXFriend input').val()) {
            $('#numOfWXFriend h4')[0].style.color = '';
        } else {
            $('#numOfWXFriend h4')[0].style.color = 'red';
        }
    });

    $('#numOfWXFriend input').on('blur', function(){
        var val = $('#numOfWXFriend input').val();
        if(val > 200 && val <= 500) {
            AppInterface.toast('哟！你的好友数量超过全国平均值啦！');
        }
        if(val > 500) {
            AppInterface.toast('嗯...你一定是一个交际明星');
        }
        var flag = showNextQuestion();
    });

    /**
     * 数据校验
     * @returns {boolean}
     */
    function validate() {
        var res = false;
        res = tips(['question01', 'question02', 'question04']);
        return res;
    }

    function tips(idArrs) {
        var res = true;
        var numOfWXFriend = $('#numOfWXFriend input').val();
        for(var temp in idArrs) {
            var id = idArrs[temp];
            if($('#'+ id +' input[type="radio"]:checked').length === 0) {
                $('#'+ id +' h4')[0].style.color = 'red';
                res = false;
            }
        }
        if(!numOfWXFriend) {
            $('#numOfWXFriend h4')[0].style.color = 'red';
            res = false;
        }
        if(!res){
            AppInterface.toast('答完题才能查看结果喔～');
        }
        return res;
    }

    $('#getResult').on('click',  function(){
        if(validate()) {
            var form = $('form').get(0);
            var url = $(form).attr('action');
            var param = $(form).serialize();
            url += "?" + param;
            location.replace(url);
        }
    })

    /**
     * 显示隐藏下一题按钮
     */
    function showNextQuestion() {
        var numOfWXFriend = $('#numOfWXFriend').val(),
            flag = false;
        if($('input[name="question01"]:checked').length &&
            $('input[name="question02"]:checked').length &&
            $('input[name="question04"]:checked').length &&
            numOfWXFriend && numOfWXFriend > 0) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;

    }

    $('#question01 input[type="radio"],#question02 input[type="radio"],#question04 input[type="radio"]').on('click', function(){
        // var flag = showNextQuestion();
        // $('#getResult').toggleClass('hidden', flag);
        if($($(this).parents('li')[0]).get(0)
        && $($(this).parents('li')[0]).get(0).children[0]) {
            $($(this).parents('li')[0]).get(0).children[0].style.color = '';
        }
        if($(this)[0].style.color == 'red') {
            $(this)[0].style.color == '';
        }
    });

});
