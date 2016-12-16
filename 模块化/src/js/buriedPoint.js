/*
 * @author fuqiang
 * @date 20151202
 * @fileoverview 统计代码 buried point
 */
(function(win, doc) {
  /**
   * bp.js 代码目标要求：
   * 1，无依赖。
   * 2，不影响页面其他性能，有对外事件广播
   * 3，收集包括，客户端信息，用户信息，前端性能信息，行为统计信息
   *  版本控制使用php静态方法,模板页面也是[初订]
   */

  var scr = win.screen,
    nav = navigator,
    ua = nav.userAgent,
    isGomeWebView = (/gomeplus/i).test(ua),
    pageHost = win.location.host,
    isOnline = (pageHost === 'm.gomeplus.com' || pageHost === 'h5.gomeplus.com' || pageHost === 'm-pre.gomeplus.com' || pageHost === 'h5-pre.gomeplus.com'),
    ref = doc.referrer.toLowerCase(),
    prtl = 'https:' === win.location.protocol ? 'https://' : 'http://',
    //host = '10.125.31.56/',
    host = 'beacon.gomeplus.com/',
    errorHost = 'm.gomeplus.com/',
    path = 'log?',
    gifurl = prtl + host + path,
    sudaMeta = 'bp-data';

  var cookie_phpsid = 'mx_wap_gomeplusid',
    cookie_new = 'isnew',
    cookie_ssid = 'ssid';

  var utils = {
    //惰性函数addEvent
    JSONParse: function() {
      if (win.JSON) {
        return JSON.parse;
      } else {
        return function(jsonstr) {
          return (new Function("return" + jsonstr))();
        };
      }
    }(),
    addEvent: function() {
      if (doc.attachEvent) {
        return function(ele, type, func) {
          ele.attachEvent('on' + type, func);
        };
      } else if (doc.addEventListener) {
        return function(ele, type, func) {
          ele.addEventListener(type, func, false);
        };
      }
    }(),
    //惰性函数trim
    trim: function() {
      if (String.prototype.trim) {
        return function(str) {
          return str.trim();
        };
      } else {
        return function(str) {
          str = str.replace(/^\s+/, '');
          for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
              str = str.substring(0, i + 1);
              break;
            }
          }
          return str;
        };
      }
    }(),
    isMobile: function() {
      try {
        doc.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    }(),
    // 从字符串 src 中查找 k+sp 和  e 之间的字符串，如果 k==e 且 k 只有一个，或者 e 不存在，从 k+sp 截取到字符串结束
    // abcd=1&b=1&c=3;
    // abdc=1;b=1;a=3;
    stringSplice: function(src, k, e, sp) {
      if (src === "") {
        return "";
      }
      sp = (sp === "") ? "=" : sp;
      k += sp;
      var ps = src.indexOf(k);
      if (ps < 0) {
        return "";
      }
      ps += k.length;
      var pe = src.indexOf(e, ps);
      if (pe < ps) {
        pe = src.length;
      }
      return src.substring(ps, pe);
    },
    jsonToQuery: function(json) {
      var query = '';
      for (var i in json) {
        if (json.hasOwnProperty(i)) {
          query += i + '=' + json[i] + '&';
        }
      }
      return query.substr(0, query.length - 1);
    },
    //读Cookie
    getCookie: function(ckName) {
      if (undefined === ckName || "" === ckName) {
        return "";
      }
      return utils.stringSplice(doc.cookie, ckName, ";", "");
    },
    //写Cookie
    setCookie: function(ckName, ckValue, ckDays, ckDomain) {
      if (ckValue !== null) {
        if ((undefined === ckDomain) || (null === ckDomain)) {
          ckDomain = location.host;
        }
        if ((undefined === ckDays) || (null === ckDays) || ('' === ckDays)) {
          doc.cookie = ckName + "=" + ckValue + ";domain=" + ckDomain + ";path=/";
        } else {
          var now = new Date();
          var time = now.getTime();
          time = time + 86400000 * ckDays;
          now.setTime(time);
          time = now.getTime();
          doc.cookie = ckName + "=" + ckValue + ";domain=" + ckDomain + ";expires=" + now.toUTCString() + ";path=/";
        }
      }
    },
    //删cookie
    delCookie: function(m) {
      doc.cookie = m + "=;expires=Fri, 31 Dec 1999 23:59:59 GMT;path=/;domain=" + location.host;
    },
    sendRequest: function(url) {
      var img = new Image();
      img.src = url;
    },
    isReady: false,
    domReadyCbs: [],
    ready: function() {
      if (utils.isReady) {
        return;
      } else {
        utils.isReady = true;
        //dom ready
        for (var i = 0; i < utils.domReadyCbs.length; i++) {
          utils.domReadyCbs[i]();
        }
      }
    },
    domReady: function(cb) {
      utils.domReadyCbs.push(cb);
      if (doc.readyState === "complete") {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout(utils.ready, 1);
      } else if (doc.addEventListener) {
        doc.addEventListener("DOMContentLoaded", utils.ready, false);
        // A fallback to window.onload, that will always work
        win.addEventListener("load", utils.ready, false);
        // If IE event model is used
      } else {
        doc.attachEvent("onreadystatechange", utils.ready);
        // A fallback to window.onload, that will always work
        win.attachEvent("onload", utils.ready);
        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;
        try {
          top = window.frameElement === null && document.documentElement;
        } catch (e) {}
        // 如果是非iframe的情况，并且支持doScroll方法
        if (top && top.doScroll) {
          (function doScrollCheck() {
            if (!utils.isReady) {
              try {
                top.doScroll("left");
              } catch (e) {
                return setTimeout(doScrollCheck, 50);
              }
              // and execute any waiting functions
              utils.ready();
            }
          })();
        }
      }
    },
    collects: function(Type, pre) {
      var data = [];
      for (var i in Type) {
        if (Type.hasOwnProperty(i)) {
          data.push(i + ':' + Type[i]());
        }
      }
      return pre + data.join('|');
    },
    getSource: function() {
      return 'source=' + encodeURIComponent(utils.stringSplice(win.location.href, "source", "&", ""));
    },
    getWm: function() {
      return 'wm=' + (utils.isMobile ? 'm' : 'www');
    },
    getRandom: function() {
      var now = new Date();
      return Math.ceil(Math.random() * 1000000000000) + "." + now.getTime();
    }
  };

  //客户端信息
  var CI = {
    // 取得屏幕尺寸
    screenSize: function() {
      return scr.width + "x" + scr.height;
    },
    // 取得屏幕色深
    colorDepth: function() {
      return scr.colorDepth || '';
    },
    // 取得 appCode
    appCode: function() {
      return nav.appCodeName || '';
    },
    // 取得 appName
    appName: function() {
      return (nav.appName.indexOf('Microsoft Internet Explorer') > -1) ? 'MSIE' : nav.appName;
    },
    // 取得 cpu
    cpu: function() {
      return nav.cpuClass || nav.oscpu || "";
    },
    // 取得 platform
    platform: function() {
      return nav.platform || '';
    },
    // 取得网络连接类型
    network: function() {
      var ct = "";
      // android 2.2 webkit 新 API
      ct = (nav.connection && nav.connection.type) ? nav.connection.type : ct;
      try {
        doc.body.addBehavior("#default#clientCaps");
        ct = doc.body.connectionType;
      } catch (e) {
        ct = "unkown";
      }
      return ct;
    },
    // 取得系统语言
    language: function() {
      return nav.systemLanguage || nav.language || '';
    },
    // 取得时区
    timezone: function() {
      return new Date().getTimezoneOffset() / 60 || "";
    },
    // 取得 Flash 版本
    flashVer: function() {
      var f = "-",
        n = navigator,
        ii;
      if (n.plugins && n.plugins.length) {
        for (ii = 0; ii < n.plugins.length; ii++) {
          if (n.plugins[ii].name.indexOf('Shockwave Flash') !== -1) {
            f = n.plugins[ii].description.split('Shockwave Flash ')[1];
            break;
          }
        }
      } else if (win.ActiveXObject) {
        for (ii = 10; ii >= 2; ii--) {
          try {
            var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + ii + "');");
            if (fl) {
              f = ii + '.0';
              break;
            }
          } catch (e) {}
        }
      }
      return f;
    },
    ua: function() {
      return encodeURIComponent(ua);
    }
  };

  // 页面信息
  var PI = {
    pagename:function(){
      return encodeURIComponent(document.title || '-');
    },
    // 获取页面 document.referer
    referrer: function() {
      var re = /^[^\?&#]*.swf([\?#])?/;
      // 如果页面 Referer 为空，从 URL 中获取
      if ((ref === "") || (ref.match(re))) {
        ref = utils.stringSplice(win.location.href, "ref", "&", "");
        if (ref !== "") {
          return encodeURIComponent(ref);
        }
      }
      return encodeURIComponent(ref);
    },
    // 获取当前页是否为浏览器默认首页
    isHomepage: function() {
      var isHome = "";
      try {
        doc.body.addBehavior("#default#homePage");
        isHome = doc.body.isHomePage(win.location.href) ? "Y" : "N";
      } catch (e) {
        isHome = "unkown";
      }
      return isHome;
    },
    // 获取页面 DOM 数
    domCount: function() {
      return doc.getElementsByTagName("*").length || "";
    },
    // 获取页面 iframe 数
    iframeCount: function() {
      return doc.getElementsByTagName("iframe").length;
    },
    url: function() {
      return encodeURIComponent(win.location.href);
    }
  };


  //用户信息
  var UI = {
    phpsid: function() {
      var phpsid = utils.getCookie(cookie_phpsid);
      return phpsid;
    },
    ssid: function() {
      var sid = utils.getCookie(cookie_ssid);
      if (sid === "") {
        //长期保存，默认为1年（365天）
        sid = utils.getRandom();
        utils.setCookie(cookie_ssid, sid, 365);
      }
      return sid;
    },
    isNew: function() {
      //7天是否访问过此页面
      var nid = utils.getCookie(cookie_new);
      if (nid === "") {
        nid = utils.getRandom();
        utils.setCookie(cookie_new, nid, 7);
        return 1;
      } else {
        return 0;
      }
    },
    // 用户信息
    uid: function() {
      return window.userId || '';
    },
    shop_id: function() {
      var shopid = win.BPConfig.shop_id;
      return shopid ? shopid : '';
    },
    produce_id: function() {
      var produceid = win.BPConfig.produce_id;
      return produceid ? produceid : '';
    },
    channel: function() {
      var channel = win.BPConfig.channel;
      return channel ? channel : '';
    }
  };

  //性能信息 -> 需要页面header部署startTime,headEndTime
  //如果没有则不统计
  var startTime = win.BPConfig.startTime,
    headEndTime = win.BPConfig.headEndTime,
    loadTime,
    readyTime;

  var P = {
    sdate: function() {
      if (win.BPConfig.serverTime) {
        return win.BPConfig.serverTime;
      }
      return '-';
    },
    loadTime: function() {
      if (startTime && loadTime) {
        return loadTime - startTime;
      }
      return '-';
    },
    readyTime: function() {
      if (startTime && readyTime) {
        return readyTime - startTime;
      }
      return '-';
    },
    firstScreenTime: function() {
      if (headEndTime && startTime) {
        return headEndTime - startTime;
      }
      return '-';
    },
    version: function() {
      return '0.0.1';
    }
  };


  var BP = {
    getPvData: function() {
      //页面进入的全局统计->算一次pv
      var CIDATA = utils.collects(CI, 'CI=');
      var PIDATA = utils.collects(PI, 'PI=');
      var UIDATA = utils.collects(UI, 'UI=');
      var PDATA = utils.collects(P, 'P=');
      var urlDATA = [CIDATA, PIDATA, UIDATA, PDATA].join('&') + '&' + utils.getSource();
      return urlDATA;
    },
    pvLog: function() {
      var url = gifurl + utils.getWm() + '&' + this.getPvData();
      utils.sendRequest(url);
    },
    getExt: function() {
      var ext = [utils.collects(P, 'P='), utils.getWm(), utils.collects(UI, 'UI=')].join('&');
      return ext;
    },
    send: function(data) {
      var urlDATA = utils.jsonToQuery(data);
      var url = gifurl + this.getExt() + '&' + urlDATA;
      utils.sendRequest(url);
    }
  };

  //处理超时和ios9下href改变不触发window.load的问题
  var bpOnce = false;

  utils.domReady(function() {
    readyTime = new Date().valueOf();
    //3秒不触发onload，主动触发onload
    setTimeout(function(){
      setPV();
    },3000);
  });

  utils.addEvent(window, 'load', function() {
    loadTime = new Date().valueOf();
    if (!readyTime) {
      readyTime = loadTime;
    }
    setPV();
  });

  function setPV(){
    if (!bpOnce && !isGomeWebView && isOnline) {
      BP.pvLog();
      bpOnce = true;
    }
  }

  utils.addEvent(window, 'error', function(msg, url, line, col, error) {
    //没有URL不上报！上报也不知道错误
    if (msg !== "Script error." && !url) {
      return;
    }

    setTimeout(function(){
      var errorLog = "";
      //不一定所有浏览器都支持col参数
      col = col || (window.event && window.event.errorCharacter) || 0;

      if (!!error && !!error.stack){
        //如果浏览器有堆栈信息
        //直接使用
        errorLog = '异常信息：' + encodeURIComponent(error.stack.toString());
      }else if (!!arguments.callee){
        //尝试通过callee拿堆栈信息
        var ext = [];
        var f = arguments.callee.caller, c = 3;
        //这里只拿三层堆栈信息
        while (f && (--c>0)) {
          ext.push(f.toString());
          if (f  === f.caller) {
            break;//如果有环
          }
          f = f.caller;
        }
        ext = ext.join(",");
        errorLog = '异常信息：' + encodeURIComponent(ext);
      }
      //把data上报到后台！
      errorLog += '\n' + '错误文件：' + encodeURIComponent(url);
      errorLog += '\n' + '错误行数：' + line;
      errorLog += '\n' + '错误列数：' + col;

      var errorPath = prtl + errorHost;
      var errorUrl = errorPath + 'Log?err_msg=' + errorLog;
      utils.sendRequest(errorUrl);
    },0);

  });

  if (!isGomeWebView && isOnline) {
    var eventType = utils.isMobile ? 'touchstart' : 'click';

    utils.addEvent(doc, eventType, function(e) {
      //委派BP布点
      var target = e.srcElement || e.target;
      while (target && target.parentNode) {
        if (target.hasAttribute(sudaMeta)) {
          var metaData = target.getAttribute(sudaMeta); //json格式
          var data = utils.JSONParse(metaData);
          if (target.tagName.toLowerCase() === 'a') {
            data.href = encodeURIComponent(target.href);
          }
          BP.send(data);
          break;
        }
        target = target.parentNode;
      }
    });
  }

  window.BP = BP;

})(window, document);
