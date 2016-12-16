/**
 * Created by lishengyong on 2016/8/3.
 */
define("mods/newhome/goTop", function(require,exports,module) {
    require('$');
    $('.to-top')[0].style.display = 'none';
    
    window.onscroll = function() {
        if($(window).scrollTop() > window.screen.height) {
            $('.to-top')[0].style.display = 'block';
        } else {
            $('.to-top')[0].style.display = 'none';
        }
    };
    
    $($('.to-top')[0]).on('click', function() {
        // Get the scroll pos
        var pos= $(window).scrollTop();
        // Set the body top margin
        $( "body" ).css({ "margin-top" : -pos+ "px" , "overflow-y" : "scroll"});
        // This property is posed for fix the blink of the window width change
        // Make the scroll handle on the position 0
        $(window).scrollTop( 0 );
        // Add the transition property to the body element
        $( "body" ).css( "transition" , "all 1s ease" );
        // Apply the scroll effects
        $( "body" ).css( "margin-top" , "0" );
        // Wait until the transition end $( "body" ).on( "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd" , function (){
        // Remove the transition property
        setTimeout(function(){
            $( "body" ).css( "transition" , "none" );
        },500)

        //$('.to-top')[0].style.display = 'none';
    });
})

