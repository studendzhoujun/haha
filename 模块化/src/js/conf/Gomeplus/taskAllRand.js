/**
 * Created by lishengyong on 2016/7/27.
 */
define('conf/Gomeplus/taskAllRand.js', function(require, exports, module){
    require('$');
    // 跳转个人主页
    require('mods/Gomeplus/mineInfo.js');
    var dropload = require('vendors/dropload.js');

    /**
     * 加载数据url
     * /playgomeplus/getLeaderboardApi
        参数pageNum
     * @type {number}
     */
    var pageNum = 1;
    var loading = false;
    var firstNoData = true;
    // 上拉刷新
    $('body').dropload({
        loadDownFn: function (me) {
            setTimeout(function () {
                me.resetload();
                pageNum++;
                loading = true;
                fetchData(true);
            }, 500);
        }
    });
    $(window).scroll(function () {
        if (($(window).scrollTop() + $(window).height() / 2) >= $(document).height() - ($(window).height()) && !loading) {
            pageNum++;
            loading = true;
            fetchData();
        }
    });

    AppInterface.subscribe('onPullDown', function () {
        location.reload(true);
    }).subscribe('onPullUp', function () {
        pageNum++;
        fetchData(true);
    });

    $(document.body).append('<script>function gotoMineInfo(obj) {var uid = $(obj).attr("data-uid");AppInterface.call("/mine/userInfo", {userId:uid});}</script>');

    function fetchData(flag) {
        if (!firstNoData) {
            loading = false;
            flag && AppInterface.toast('没有更多数据了');
            return;
        }
        $.ajax({
            type: 'GET',
            url: '/playgomeplus/getLeaderboardApi',
            data:{pageNum:pageNum},
            dataType: 'json',
            success: function (data) {
                if(!data || !data.leaderboard ||
                    data.leaderboard.length === 0) {
                    // 没有更多数据
                    pageNum--;
                    firstNoData = false;
                    loading = false;
                    return;
                }
                console.log(data.leaderboard);
                // 后台渲染前10条数据。
                var indexNum = ((pageNum - 1) * 10);
                var htmlContent = '',i = 0;
                for(i; i < data.leaderboard.length; i++) {
                    htmlContent += '<dl class="list"><dt><em>'+ (indexNum + 1 + i) +'</em>';
                    htmlContent += '<figure class="user-head"><img data-uid="1105" onclick="gotoMineInfo(this)" src="'+ (data.leaderboard)[i].portUrl +'"></figure></dt>';
                    htmlContent += '<dd><div class="name"><h3><span class="user-name">' + ((data.leaderboard)[i].name?(data.leaderboard)[i].name:'') + '</span>';
                    if((data.leaderboard)[i].fellowshipType == 1) {
                        htmlContent += '<span class="user-tag">关注的人<em class="triangle"></em></span>';
                    } else if((data.leaderboard)[i].fellowshipType == 2){
                        '<span class="user-tag">粉丝<em class="triangle"></em></span>';
                    }
                    htmlContent += '</h3>';
                    htmlContent += '<span class="dd-b-txt">' + (data.leaderboard)[i].characterName + '</span></div>';
                    htmlContent += '<div class="count"><span class="points">' + (data.leaderboard)[i].account + '</span><span class="dd-b-txt">国美币</span></div></dd></dl>';
                }

                // 设置当前用户的背景色
                $($('div.list-body')[0]).append(htmlContent);
                var list = $($('div.list-body')[0]).find('dl');
                if(list) {
                    for(var index = 0; index < list.length; index ++) {
                        if((index) === data.myRank) {
                            list[index].className = 'list user-list';
                        }
                    }
                }

                /*{
                    message: "",
                    data: {
                        myRank: 5,
                        leaderboard: [
                        {
                            account: 8049,
                            characterName: "舞动风骚客325",
                            fellowshipType: 0,
                            fellowshipTypeLabel: "粉丝",
                            name: "code325",
                            portUrl: "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
                            uid: 325
                        }]
                    }
                   }
                 */


                loading = false;
            },
            error: function () {
                loading = false;
            }
        });
    }

});