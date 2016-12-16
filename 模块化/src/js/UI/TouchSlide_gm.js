define('UI/TouchSlide_gm.js',
    function(require, exports, module) {
        var TouchSlide = function(a) {
            a = a || {};
            var b = {
                    slideCell: a.slideCell || "#touchSlide",
                    titCell: a.titCell || ".hd li",
                    mainCell: a.mainCell || ".bd",
                    effect: a.effect || "left",
                    autoPlay: a.autoPlay || !1,
                    delayTime: a.delayTime || 200,
                    interTime: a.interTime || 2500,
                    defaultIndex: a.defaultIndex || 0,
                    titOnClassName: a.titOnClassName || "on",
                    autoPage: a.autoPage || !1,
                    prevCell: a.prevCell || ".prev",
                    nextCell: a.nextCell || ".next",
                    pageStateCell: a.pageStateCell || ".pageState",
                    pnLoop: "undefined " == a.pnLoop ? !0 : a.pnLoop,
                    startFun: a.startFun || null,
                    endFun: a.endFun || null,
                    switchLoad: a.switchLoad || null,
                    switchLoadN: a.switchLoadN || 0
                },
                c = document.getElementById(b.slideCell.replace("#", ""));
            if (!c) return ! 1;
            var d = function(a, b) {
                    a = a.split(" ");
                    var c = [];
                    b = b || document;
                    var d = [b];
                    for (var e in a) 0 != a[e].length && c.push(a[e]);
                    for (var e in c) {
                        if (0 == d.length) return ! 1;
                        var f = [];
                        for (var g in d) if ("#" == c[e][0]) f.push(document.getElementById(c[e].replace("#", "")));
                        else if ("." == c[e][0]) for (var h = d[g].getElementsByTagName("*"), i = 0; i < h.length; i++) {
                            var j = h[i].className;
                            j && -1 != j.search(new RegExp("\\b" + c[e].replace(".", "") + "\\b")) && f.push(h[i])
                        } else for (var h = d[g].getElementsByTagName(c[e]), i = 0; i < h.length; i++) f.push(h[i]);
                        d = f
                    }
                    return 0 == d.length || d[0] == b ? !1 : d
                },
                e = function(a, b) {
                    var c = document.createElement("div");
                    c.innerHTML = b,
                        c = c.children[0];
                    var d = a.cloneNode(!0);
                    return c.appendChild(d),
                        a.parentNode.replaceChild(c, a),
                        m = d,
                        c
                },
                g = function(a, b) { ! a || !b || a.className && -1 != a.className.search(new RegExp("\\b" + b + "\\b")) || (a.className += (a.className ? " ": "") + b)
                },
                h = function(a, b) { ! a || !b || a.className && -1 == a.className.search(new RegExp("\\b" + b + "\\b")) || (a.className = a.className.replace(new RegExp("\\s*\\b" + b + "\\b", "g"), ""))
                },
                i = b.effect,
                j = d(b.prevCell, c)[0],
                k = d(b.nextCell, c)[0],
                l = d(b.pageStateCell)[0],
                m = d(b.mainCell, c)[0];
            if (!m) return ! 1;
            var O, P, n = m.children.length,
                o = d(b.titCell, c),
                p = o ? o.length: n,
                q = b.switchLoad,
                r = b.switchLoadN,
                s = parseInt(b.defaultIndex),
                t = parseInt(b.delayTime),
                u = parseInt(b.interTime),
                v = "false" == b.autoPlay || 0 == b.autoPlay ? !1 : !0,
                w = "false" == b.autoPage || 0 == b.autoPage ? !1 : !0,
                x = "false" == b.pnLoop || 0 == b.pnLoop ? !1 : !0,
                y = s,
                z = null,
                A = null,
                B = null,
                C = 0,
                D = 0,
                E = 0,
                F = 0,
                H = /hp-tablet/gi.test(navigator.appVersion),
                I = "ontouchstart" in window && !H,
                J = I ? "touchstart": "mousedown",
                K = I ? "touchmove": "",
                L = I ? "touchend": "mouseup",
                N = m.parentNode.clientWidth,
                Q = n;
            if (0 == p && (p = n), w) {
                p = n,
                    o = o[0],
                    o.innerHTML = "";
                var R = "";
                if (1 == b.autoPage || "true" == b.autoPage) for (var S = 0; p > S; S++) R += "<li>" + (S + 1) + "</li>";
                else for (var S = 0; p > S; S++) R += b.autoPage.replace("$", S + 1);
                o.innerHTML = R,
                    o = o.children
            }
            "leftLoop" == i && (Q += 2, m.appendChild(m.children[0].cloneNode(!0)), m.insertBefore(m.children[n - 1].cloneNode(!0), m.children[0])),
                O = e(m, '<div class="tempWrap" style="overflow:hidden;"></div>'),
                m.style.cssText = "width:" + Q * N + "px;overflow:hidden;padding:0;margin:0;";
            for (var S = 0; Q > S; S++) m.children[S].style.cssText = "display:table-cell;vertical-align:top;width:" + N + "px";
            var T = function() {
                    "function" == typeof b.startFun && b.startFun(s, p)
                },
                U = function() {
                    "function" == typeof b.endFun && b.endFun(s, p)
                },
                V = function(a) {
                    var b = ("leftLoop" == i ? s + 1 : s) + a,
                        c = function(a) {
                            var b;
                            if (m.children[a] && (b = m.children[a].getElementsByTagName("img")), b) for (var d = 0; d < b.length; d++) r > 0 ? b[d].getAttribute(q) ? (b[d].setAttribute("src", b[d].getAttribute(q)), b[d].removeAttribute(q)) : c(a + 1) : b[d].getAttribute(q) && (b[d].setAttribute("src", b[d].getAttribute(q)), b[d].removeAttribute(q))
                        };
                    if (c(b), "leftLoop" == i) switch (b) {
                        case 0:
                            c(n);
                            break;
                        case 1:
                            c(n + 1);
                            break;
                        case n:
                            c(0);
                            break;
                        case n + 1 : c(1)
                    }
                },
                W = function() {
                    N = O.clientWidth,
                        m.style.width = Q * N + "px";
                    for (var a = 0; Q > a; a++) m.children[a].style.width = N + "px";
                    var b = "leftLoop" == i ? s + 1 : s;
                    X( - b * N, 0)
                };
            window.addEventListener("resize", W, !1);
            var X = function(a, b, c) {
                    c = c ? c.style: m.style,
                        c.webkitTransitionDuration = b + "ms",
                        c.webkitTransform = "translateX(" + a + "px)"
                },
                Y = function() {
                    if (r > 0) {
                        var a = 0;
                        "leftLoop" == i && (a = 1, r += 1);
                        for (var b = a; r > b; b++) for (var c = m.children[b].getElementsByTagName("img"), d = 0; d < c.length; d++) c[d].getAttribute(q) && (c[d].setAttribute("src", c[d].getAttribute(q)), c[d].removeAttribute(q))
                    }
                };
            Y();
            var Z = function(a) {
                switch (i) {
                    case "left":
                        s >= p ? s = a ? s - 1 : 0 : 0 > s && (s = a ? 0 : p - 1),
                        null != q && V(0),
                            X( - s * N, t),
                            y = s;
                        break;
                    case "leftLoop":
                        null != q && V(0),
                            X( - (s + 1) * N, t),
                            -1 == s ? (A = setTimeout(function() {
                                    X( - p * N, 0)
                                },
                                t), s = p - 1) : s == p && (A = setTimeout(function() {
                                    X( - N, 0)
                                },
                                t), s = 0),
                            y = s
                }
                T(),
                    B = setTimeout(function() {
                            U()
                        },
                        t);
                for (var c = 0; p > c; c++) h(o[c], b.titOnClassName),
                c == s && g(o[c], b.titOnClassName);
                0 == x && (h(k, "nextStop"), h(j, "prevStop"), 0 == s ? g(j, "prevStop") : s == p - 1 && g(k, "nextStop")),
                l && (l.innerHTML = "<span>" + (s + 1) + "</span>/" + p)
            };
            if (Z(), v && (z = setInterval(function() {
                        s++,
                            Z()
                    },
                    u)), o) for (var S = 0; p > S; S++) !
                function() {
                    var a = S;
                    o[a].addEventListener("click",
                        function(b) {
                            clearTimeout(A),
                                clearTimeout(B),
                                s = a,
                                Z()
                        })
                } ();
            k && k.addEventListener("click",
                function(a) { (1 == x || s != p - 1) && (clearTimeout(A), clearTimeout(B), s++, Z())
                }),
            j && j.addEventListener("click",
                function(a) { (1 == x || 0 != s) && (clearTimeout(A), clearTimeout(B), s--, Z())
                });
            var $ = function(a) {
                    clearTimeout(A),
                        clearTimeout(B),
                        P = void 0,
                        E = 0;
                    var b = I ? a.touches[0] : a;
                    C = b.pageX,
                        D = b.pageY,
                        m.addEventListener(K, _, !1),
                        m.addEventListener(L, aa, !1)
                },
                _ = function(a) {
                    if (!I || !(a.touches.length > 1 || a.scale && 1 !== a.scale)) {
                        var b = I ? a.touches[0] : a;
                        if (E = b.pageX - C, F = b.pageY - D, "undefined" == typeof P && (P = !!(P || Math.abs(E) < Math.abs(F))), !P) {
                            switch (a.preventDefault(), v && clearInterval(z), i) {
                                case "left":
                                    (0 == s && E > 0 || s >= p - 1 && 0 > E) && (E = .4 * E),
                                        X( - s * N + E, 0);
                                    break;
                                case "leftLoop":
                                    X( - (s + 1) * N + E, 0)
                            }
                            null != q && Math.abs(E) > N / 3 && V(E > -0 ? -1 : 1)
                        }
                    }
                },
                aa = function(a) {
                    0 != E && (a.preventDefault(), P || (Math.abs(E) > N / 10 && (E > 0 ? s--:s++), Z(!0), v && (z = setInterval(function() {
                            s++,
                                Z()
                        },
                        u))), m.removeEventListener(K, _, !1), m.removeEventListener(L, aa, !1))
                };
            m.addEventListener(J, $, !1)
        };
        exports.TouchSlide = TouchSlide;
    });