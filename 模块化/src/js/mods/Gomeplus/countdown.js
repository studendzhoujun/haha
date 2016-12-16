/**
 * Created by lishengyong on 2016/7/25.
 */
define('mods/Gomeplus/countdown',function(require,exports,module) {
    require('$');
    var updateMission = require('mods/Gomeplus/updateMissionState.js');
    // module.exports = {
    //     init:function() {
    //
    //     }
    // }
    var day = $('#gome-day').text();
    var hour = $('#gome-hour').text();
    var minute = $('#gome-minute').text();
    var second = $('#gome-second').text();
    var stId = 0;
    function countdown() {
        if((Number(second) + Number(minute) + Number(hour) + Number(day)) <= 0) {
            // 倒计时结束修改任务状态
            updateMission.updateMission(qid, '3', function(){
                location.replace('index');
            });
        }
        if(second > 0) {
            second = second - 1;
            $('#gome-second').text(second);
        } else if(second == 0 && (minute > 0 || hour > 0 || day > 0)) {
            second = 59;
            $('#gome-second').text(second);
            if(minute > 0) {
                minute = minute - 1;
                $('#gome-minute').text(minute);
            }
            if(minute == 0 && (hour > 0 || day > 0)) {
                minute = 59;
                $('#gome-minute').text(minute);
                if(hour > 0) {
                    hour = hour - 1;
                    $('#gome-hour').text(hour);
                }
                if(hour == 0 && (day > 0)) {
                    hour = 23;
                    $('#gome-hour').text(hour);
                    if(day > 0) {
                        day = day - 1;
                        $('#gome-day').text(day);
                    }
                }
            }
        } else {
            clearTimeout(stId);
        }
        stId = setTimeout(countdown, 1000);
    }
    stId = setTimeout(countdown, 1000);

});