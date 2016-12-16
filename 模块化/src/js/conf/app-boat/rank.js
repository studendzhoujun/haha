define('conf/app-boat/rank.js', function(require, exports, module) {
  require('$');
  require('utils/appInterface.js');
  require('vendors/zepto-fx.js');
  require('mods/buried.js');
  var common = require('lib/common.js');
  var base64 = require('utils/base64.js');
  var Ajax = require('utils/ajax.js');
  var check = require('mods/check.js');
  var storage = require('mods/storage.js');
  var appEvent = require('mods/appEvent');
  var dropload = require('vendors/dropload.js');
  var returnTop = require('mods/returnTop.js');
  returnTop.returnTop();

  $('.hxjl-title-box a').click(function() {
    $('.hxjl-title-box a').addClass("tab-active");
    $('.top-title-box a').removeClass("tab-active");
    $('.table-footer div').show();
    $('.table-footer img').hide();
    $('#move-record').show();
    $('#rank-hundred').hide();
  });

  $('.top-title-box a').click(function() {
    $('.hxjl-title-box a').removeClass("tab-active");
    $('.top-title-box a').addClass("tab-active");
    var trs = document.getElementById('rank-hundred').getElementsByTagName('tr');
    $('.table-footer div').hide();
    $('#move-record').hide();
    $('#rank-hundred').show();
    if(trs.length > 11){
      for(var i=11;i<trs.length;i++){
        trs[i].style.display = "none";
      }
      $('.table-footer img').show();
    }
  });

  $('.table-footer img').click(function() {
    var trs = document.getElementById('rank-hundred').getElementsByTagName('tr');
    for(var i=0;i<trs.length;i++){
      trs[i].style.display = "";
    }
    $('.table-footer img').hide();
  });

});