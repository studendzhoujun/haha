define('lib/commonOld', function (require, exports, module) {
    // var domain = 'https://10.125.31.23/api/';
    var domainAddress = location.href.match(/.*mime\//);
    var $ = require('$'),
        vue = require('vendors/vue'),
        appInterface = require('utils/appInterface'),
        alert = require('UI/alert');

    var global_vm = new vue({
        el: '.pageNum',
        data: {
            isend: 0,
            pageNum: 2,
            arrName: '',
            numPerPage: 10
        }
    });

    module.exports = {
        vm: global_vm,
        trimVal: function (id) {
            var element = document.getElementById(id);
            return element.value ? element.value.replace(/(^\s*)|(\s*$)/g, "") : element.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
        },
        getParams: function () {
            var params = {};
            var search = location.search.substr(1);
            if (search) {
                var key_values = search.split('&');
                if (key_values && key_values.length > 0) {
                    for (var i = 0; i < key_values.length; i++) {
                        var key = key_values[i].split('=')[0];
                        var val = key_values[i].split('=')[1];
                        params[key] = val;
                    }
                }
            }
            return params;
        },
        getCommonParams: function () {
            var params = this.getParams();
            if (params) {
                var url = "";
                for (var param in params) {
                    if (param == "userId") {
                        url += ('userId=' + (params[param] || 0) + '&');
                    }
                    if (param == "clientOs") {
                        url += ('clientOs=' + params[param] + '&');
                    }
                    if (param == "clientOsVersion") {
                        url += ('clientOsVersion=' + params[param] + '&');
                    }
                    if (param == "appType") {
                        url += ('appType=' + params[param] + '&');
                    }
                    if (param == "appVersion") {
                        url += ('appVersion=' + params[param] + '&');
                    }
                    if (param == "mac") {
                        url += ('mac=' + params[param] + '&');
                    }
                    if (param == "devId") {
                        url += ('devId=' + params[param] + '&');
                    }
                    if (param == "loginToken") {
                        url += ('loginToken=' + (params[param] || 0) + '&');
                    }
                }
                var lastUrl = '?' + url;
                return lastUrl.substr(0, lastUrl.length - 1);
            }
        },
        sendParams: function (skipType, htmlName, params) {
            if (!this.onLine()) {
                return false
            }
            ;
            if (skipType != 1 && skipType != 2) {
                alert.alerter("skipType 参数错误");
                return false;
            }
            var oldsearch = location.search, search = '';
            if (oldsearch.indexOf('skipType') >= 0) {
                search = oldsearch.replace(/skipType=\d/, "skipType=" + skipType);
            } else {
                search = "?skipType=" + skipType + '&' + oldsearch.substr(1);
            }
            if (params != null && params != undefined) {
                for (var key in params) {
                    if (params[key] !== null && params[key] !== undefined) {
                        search += "&" + encodeURIComponent(key.toString()) + "=" + encodeURIComponent(params[key].toString());
                    }
                }
            }
            location.assign(domainAddress + htmlName + search);
            return;
        },
        editUrl: function (url, params, pageNum, numPerPage) {
            var other = '';
            if (params) {
                other = this.getCommonParams();
            } else {
                params = this.getParams();
            }
            params.pageNum = pageNum ? pageNum : 1;
            params.numPerPage = numPerPage ? numPerPage : 10;
            return {url: (url + other), params: params};
        },
        postData: function (url, params, callback, pageNum, numPerPage, isAsync) {
            if (!this.onLine()) {
                return false
            }
            addLoading();
            var other = '', submit_params = {}, callback = callback;
            if (params && typeof params !== 'function') {
                submit_params = params;
                other = this.getCommonParams();
            } else {
                callback = params;
                submit_params = this.getParams();
            }
            submit_params.pageNum = pageNum ? pageNum : 1;
            submit_params.numPerPage = numPerPage ? numPerPage : 10;
            this.requestAjax((url + other), submit_params, callback, isAsync);
        },
        loadPage: function (urls, paramsArray, callback, numPerPage) {
            if (!this.onLine()) {
                return false;
            }
            ;
            if (urls && urls.length > 0) {
                addLoading();
                var data = [];
                for (var i = 0; i < urls.length; i++) {
                    var obj = this.editUrl(urls[i], paramsArray[i]);
                    data.push(obj);
                }
                this.requestAjax(urls, data, callback);
            } else {
                console.log('loadPage error');
            }
        },
        upload: function (parent, url, params, callback, numPerPage) {
            var parent = parent || 'body', self = this;
            $(parent).dropload({
                scrollArea: window,
                loadDownFn: function (me) {
                    if (self.vm.isend && self.vm.isend == 1) {
                        alert.alertSecond('已经没有内容了~');
                        me.resetload();
                    } else {
                        self.loadMoreFun(url, callback, params, numPerPage);
                        me.resetload();
                    }
                }
            });
        },
        loadMoreFun: function (url, callback, params, numPerPage) {
            var isend = this.vm.isend;
            if (isNum(isend) && isend == 0) {
                var pageNum = this.vm.pageNum;
                this.postData(url, params, callback, pageNum, numPerPage);
            } else {
                if (isNum(isend) && isend == 1) {
                    alert.alertSecond('已经没有内容了~');
                }
            }
        },
        data: function (data) {
            if (data.code == 0 || data.code === 200) {
                return data.data;
            } else {
                alert.alerter(data.message);
                return false;
            }
        },
        /*		isLogin:function(callback){
         var params = this.getParams();
         var userId = params.userId,loginToken = params.loginToken;
         if(userId && userId != 0){
         this.postData('user/check_token.json',function(){});
         }else{
         this.sendParams(2,'login.html');
         }
         },*/
        replaceX: function (str) {
            var newstr = '';
            if (str.length == 11) {
                newstr = str.substr(0, 3) + "*****" + str.substr(8);
            }
            return newstr;
        },
        replaceName: function (str) {
            // var newstr = '';
            // if (str.length > 2) {
            //     newstr = str.substr(0, 1) + "**" + str.substr(str.length - 1);
            // } else {
            //     newstr = str;
            // }
            // return newstr;

            return str.substr(0, 1) + "**" + str.substr(str.length - 1);
        },
        fixedTwo: function (money) {
            var m = parseFloat(money);
            if (m >= 0) {
                return m.toFixed(2);
            }
            return '0.00';
        },
        onLine: function () {
            if ('onLine' in navigator && !navigator.onLine) {
                alert.alerter('网络连接已断开，请检查您的网络连接提示', function () {
                    location.reload(true);
                });
                return false;
            }
            return true;
        },
        receiveTime: function () {
            var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            (year % 4 == 0 && year % 400 != 0) && (months[1] = 29);
            var fullDay = months[month];
            if (day + 3 > fullDay) {
                month++;
                day = day + 3 - fullDay;
            } else {
                day += 3;
            }
            month++;
            if (month > 12) {
                year++;
                month -= 12;
            }
            return (year + '-' + (month > 9 ? month : ('0' + month)) + '-' + (day > 9 ? day : '0' + day) + ' 23:59:59');
        },
        convertTime: function (timestamp, sp, hasTime) {
            var date = new Date(), now = new Date(), returnTime = '';
            date.setTime(timestamp);
            var year = date.getFullYear() || now.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate() || now.getDate();
            var sp = sp || '-';
            returnTime = year + sp + (month > 9 ? month : '0' + month) + sp + (day > 9 ? day : '0' + day);
            if (hasTime) {
                var hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds();
                returnTime += ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
            }
            return returnTime;
        },
        //0 两天前，1今天，2昨天
        checkTime: function (timestamp) {
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var duration = today.getTime() - timestamp;
            if (duration < 0) {
                return 1;
            } else if (duration < 3600000 * 24) {
                return 2;
            } else {
                return 0;
            }
        },
        setArrName: function (name) {
            this.vm.arrName = name;
        },
        removeDiv: function (data, pageNum, numPerPage) {
            var arrName = this.vm.arrName;
            if (arrName) {
                var arrData = data.data || data;
                for (var item in arrData) {
                    if (item == arrName) {
                        data = data[item];
                        break;
                    }
                }
            }

            if (Array.isArray(data) || (data instanceof Array)) {

                if (!data || data.length < numPerPage) {
                    this.vm.isend = 1;
                } else {
                    this.vm.pageNum = pageNum + 1;
                }
            }
            console.log(this.vm.isend);
        },
        requestAjax: function (url, params, callback, isAsync, isImg) {
            //var data = {url: url, params: params},
            var data = params;

            var isArr = Array.isArray(url) || url instanceof Array;

            var self = this;

            if (isArr) {
                data = params;
            }

            var isasync = true;
            var ua = window.navigator.userAgent.toLowerCase();
            if (!ua.match(/MicroMessenger/i)) {
                isasync = !!isAsync;
            }
            if (!this.onLine()) {
                return false;
            }
            $.ajax({
                type: 'post',
                // url: '../httpsServer.php',
                url: url,
                data: data,
                dataType: 'json',
                async: isasync,
                timeout: 3000,
                success: function (res, status, xhr) {

                    if (!res) {
                        alert.alerter('网络错误');
                        return;
                    }
                    if (res.data) {
                        res.data.serverDate = xhr.getResponseHeader('Date');//服务器取回来的时间数据比北京时间慢8个小时。
                    }

                    if (isArr) {
                        removeLoading();
                        if (res.data.code === 0 || data.code === 200) {
                            callback(res);
                        } else {
                            if (res.code == 881011 || res.code == 401) {
                                // appInterface.call('/common/login');
                                appInterface.call('/common/logout', function (data) {
                                    if (data.success) {
                                        appInterface.call('/common/login');
                                    }
                                });
                            } else {
                                alert.alerter(res.message);
                            }
                        }
                    } else if (res.code == 0 || res.code == 200) {

                        self.removeDiv(res.data, params.pageNum, params.numPerPage);
                        removeLoading();
                        callback(res.data);
                    } else {
                        self.removeDiv(res.data, params.pageNum, params.numPerPage);
                        removeLoading();
                        if (res.code == 881011 || res.code == 401) {
                            // appInterface.call('/common/login');
                            appInterface.call('/common/logout', function (data) {
                                if (data.success) {
                                    appInterface.call('/common/login');
                                }
                            });
                        } else {
                            console.log(res);
                            callback(res);
                            //alert.alerter(res.message);
                        }

                    }
                },
                error: function (xhr, errorType, error) {
                    if (errorType === 'timeout') {
                        alert.alerter('网络连接已断开，请检查您的网络连接提示');
                    }
                }
            });
        }
    };
    function isNum(val) {
        return !isNaN(val);
    }
    function addLoading() {
        var div = document.getElementById('w_loadPage');
        if (!div) {
            var load = document.createElement('div');
            load.id = 'w_loadPage';
            load.innerHTML = '<div><img src="data:image/gif;base64,R0lGODlhNgA2AOZ/APrBC/GLB/apB8UyTPvPQ9s1Q+UGOc46S9tER/arBulGQPOYCvCIafCGA9Y8SLoaTepRRPGMarseTelHP9Y5Rr4kTOYROfGObutWRsAnTOYXOfq/ArgUTvq+Afq/BOYeOf/9+fm6APq9AOcxO+YcOucyOf/++vKVCfCDAf/66/vQRfCJCPrDFfrCEfzSUPrDE/WkCP712f701P3uvvKTCfvPRPCEAv/8+uUAOfvRS/CIBv723Pq+Av/++/m7APrDFPGTcv707uMAOv7zz/WnCPaqC/WkCvKTDfWjCfWmB/asDPOWD/KUD/734POWEfaqDPCHBfq+BPvQR/zSTfrBDPShCvSiCvq9AfzST/atDvrDEvvRSuYYOuYOOetYRsw4TOcgOeQDOvCKaf/9/Prbyv/8+//9+8EuTcQ0Tvzq4etVRdo/SMs2TNg3RfGRb/zp285DT85EUOcyOv3u5cs/UP3t4etTRPzl1/zm3Ms4TMs9TsMyTPCDAOYAOfq+AP///yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyOWQwNmVmZS02MDNhLTQ1ZmEtOGFkYy04NzVmOGIyZDMxZDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEM2NkM0NzBERDI1MTFFNTlCRTBGNDYxQkNEMUUwQzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEM2NkM0NkZERDI1MTFFNTlCRTBGNDYxQkNEMUUwQzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTllZTU1M2EtOTYwNS00NTFmLWE2NzMtZDUxZjFkNDMxNzA3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjI5ZDA2ZWZlLTYwM2EtNDVmYS04YWRjLTg3NWY4YjJkMzFkMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAUUAH8ALAAAAAA2ADYAAAf/gH+Cg4SFhoeIiYqLjI2Oj5CRkpOUlZaXjjFYLR0ehSMfEEBpmI0gW36pfp6EI32vGhc3pYkpP6qprIOur69qQbSGIC+4uZ+9vWqzwYMExcatyL0MzIJDz9C70q8Wd9XO2LqCvNvUzADYq8fbfQrMIOnq0ewGy5g9MyHp4n/k0kJkxliKoYKKnxB8+ARA4gMXP39hHAx4wEFIlwliSEECIQWXiIQJUSRR9bAXBQkcUj7A0ctCBHuLbD0LADLhCRHytOH4krLngG0YgC3qwQJblZoJF+Qc1+dAz54O2HkRqGhKuhAokPJJ8LDA05QSDLDr40ZRkw7xYGhtEOVThq8c/yiM7cNlTiIX8VLR0JqlEAK4bOa+ApJIS14/Ik4gdVIoztcvLAXbSYT2sB8BNkCuKISmZ4U2gnuBodyhtOnTp68UOQJlMyE0Z/Ss+UC7tu3bH6rp3s27t+/fwCehHp56detCK6AcKXKFuHPKli9nTuh60AqQNgRE71D4cOLFhZwgvXlYy93De5H2JZRFK43DLhKdTbu2LaEoDbTCiNehSdWrWSHFVSEeJKAVCvpgM8VQRT1zFFJK8eOBHwtoVQU2LPTAiEzF0FQTeRIiplhNATzzQwqOcORRTSKRRKAqSQSYEE6qSAFCJAQZhJBCDDn0oio+IOGhPlSoEIMl+CT4TFiI2IQwg4alwLPPj9jcGAw64VBZDADfTEnIhNgQUM01WX6ZzhC6gVMMk8WIqdswS2qZygtW6sahi2bicqJvp/iYZypb1OmbJpxI2EELWBwZ3KKMNuooo4EAACH5BAUUAH8ALAUABQAtAC0AAAf/gH+Cg4SFOy6CG4UbHS0uO4WRkpOCJjkdg4qEG36dHTkmlKKSLIuLnagsKaOsk5qZqKgvIK2UKpKvibGot7WRMq6nu53AvoQ1wZvDncjGrLl/nMsAzpWU0NLLocbbIrjCuyIhM9ujMjXUhFYhm+B+IVYBfHwhfgA1xZK9gn6FMJngYKCYN2+XClqFXrCikeiUCBoE5wUY9mKVNUlGIp2IdupExHlGlrHYlmOSD0kCsAn4yAeFj2V+SkKiRCSSDR6FeNhgSQSmnw4zRW0s9IQoyxM+O7lowWpBISZPPy4QkdQP01YJGgzSUUgHwQYJqnraQLas2bM8lCzhWmiFjiVK/3icnWu2mt27ePPq3cu3r1+6gNOujYRmDxwEckooXsy4ca2sWwud4UA5Q4E+mDNrzvzhqiinhKASokO59AEcm1NDYDWUUFFCa0qX/pJ6M5CgkmoWulnoQwXZlNvUxqwhzZ+Skk5GSlmIRBvgHCSEGX7hYqSMhTZCI9HnC3QHtTGUIaRwFEOOhLjjyAN8QGo1QSLt+9OP0L+G6TNTkFD6gWYLDNwwyTnpDLJOO/llZoADAzzAgRAGKMAAHq10802Cm+EgBBnjcXNNc8N1YYZf6A3CXW0T3NVMJNsNJ8Zd+ZiC4X9v4DUfQDNmFgGJ+JmYGgYC6lUKgj5q5kV8e1mCSRePgpzYBxdujOjXIUz+QQIYdgBRhy+BAAAh+QQFFAB/ACwFAAUALQAtAAAH/4B/goOEhTFYgh6Fin9YMYWQkZKCIFt+g4yYg35bIJOfkT+Lo4SioKeSmYmorIMEkap/sYKvrYVDqaSQuLauuYSztL2nscHDg56/mpLJrT2Cl5DFkdHPpzEqVIVIPsC6fz5IhVQqj5JShCKFScvt7OmE6JCmnyer3n/2oPR/1pBVkBbIGiWwEMBI1qZIChEpQbEEkRhGUtjkEwxIDaIUitIA0sVJFUHRgJSlUMlCI0FpOaVvkJNCLwm1nLQSlQAbg1YU0inIhgBWHYIKHUr0SpEjUCJBOVLkCtGnQ49JnUq1qtWrWLMO+8C1q9evH9boOYNm59KmUNOC6cO2rdu2bf8qcJhbltAKPnh9+tnLty/fDnbeCsbxZa7hODDxKj4hwq9jLUAEv2Vj2DACk4oV03Ds18UcLpLZUqg8N8OIjQ0y44XBeW+Him5CG5BAmkOB08ASqOaDIkRrhX/GeJHsoPaBPrgx+VmwuwpnFv6CYBA8gPQXHMgX+RFxQnUAxz9SFLoRwUJbHA8MS6DQNnkivklQZG7MV0qzQmnETOgihMODAQ6E4ZZ7svQVTgB4+UaOOaCMQYYQoRHoQWshzOAPKzcYEKF2rd3XigIbAtMaAFIxEKJynNUyzB3mCSZha7wcY6KLHPql4jE3qEGjiH694OEwQeg4YI17hXfVDRdo0B4QkZ1olQYQEHwgYQctONJKIAAh+QQFFAB/ACwFAAUALQAtAAAH/4B/goOEhXVAdmAkhRuCLjuFkZKTgmZuXH2Zi4SNgh05JpSikUFemaebg52DLKOufzcYp6iMr7aDEbO0nJIqt5FvFrqatZIyv4Riw8S8kjXIgxPLfamCq9CSZl3T1X/XhaG/ZWRCOMvd34IiguGjeAwKBkIcDwMOBrPohCFWhQA1xyTdYCDs1AMOCCVQ2KVqEIxCfgj5KhREzbABCDPmMafvDw1XLwiVkTXMQcaMX6jVOhHJyKRwF6aFkXASYRt0AiT5mJTjTxoN0/q0qcmhwodCPGxEIiJqB5Cgmb4QXVPoSSSWoyBA7YPjQE06hZgUWuCqxYetmQpkyHimkI5BDf8S2CpBt67du3IQwNmDJpKOJUp4bBhMuLBhbIgTK17MuLHjx9AMSy7MQ8kSHSv8AhY8eXIHP6BDiw6doAGf028Jpf4T11aL0bBFLDhNWywh24PIjmrhAvboE7RpWyU0nBDWpp99+yES/LQNHkiVFmJKCVIO5T5QNOcj4NuGnJF2Sur5xwQL30a2n/Dj/c/xQS4ltUvxAnaA5jREsC/2cVTIQiCoMFpwKMAQWnuCPERIRINMZEwNAPgRwmkBWBGCaAgKwo8/AL1iwgwh6AdbhoSsUx4yJii3XzPyYROhbyQ2VoNyMQ7yDDYy0FhMJAFhI+CIO0qkGAj1jVZjYymch2EZkH+00pgJOSS3YkOegALZDi600AGCj9wSCAAh+QQFFAB/ACwFAAUALQAtAAAH/4B/goOEhTFYLR0ehSMfEEBphZKTlIIgW36ZfouEI32fGhc3laSSKT+amZyDnp+fakGlsiAvqaqMrq5qo7KVBLa3nbmuDL2UQ8DBrMOfFnfGkr/Jq4KtzMXQhADJm7jMfQrZgyDc3cLfBrzQPTMh3NR/1sNCZGO9MSpUfiF8fAFIPlLBkxfGwYAHHIR0mSAm0iQQUlKJ6NcPRRJNA11RkMCh4wMcrixEUCfoFLAAFPudEGFuGY4vHWMOYIYhlqAeLJJVSdlvQctqfQ7EjOngmxd7f6ZwC4GCJ58EAwsM7SjBwLc+bv406VAOhtMGURhlmMqBwtU+XOa4KJeJhtMshf8QkGVz9hMQLWz9iDjB00mhOFO/gKxrh2tePwJsUFxRCE3MCm3qugLTobLly5ivFDkChTEhNGf0rPlAurTp0x/EqV7NurXr17BjyyaFufZlzZwnQTlS5Irt38YSD/I8fJANAca0yDpRyC8h54OYl1JeioYkuISwE7JeqgkpGJLAForSQBL4St6nUAoxCWohDwkmsZ+k/k8PSlUkLfgDb9H+QvlNct8gPywnSH+CSEdKgZJIQYgIhSQxCIKCSPggIQ5Sgg8VhQBECIWC+IBEIVSoEEMvA/oxCYiEqGifOCBUwmIhMc42I2wEUHKjIDmuNoSO7x3TWo9BfjgJkTYWORscgUoeWAiDsF3iIn9K+rFFjbId4qSRf2BxojGBAAAh+QQFFAB/ACwFAAUALQAtAAAH/4B/goOEhTsughuFGx0tLjuFkZKTgiY5HYOKhBt+nR05JpSikiyLi52oLCmjrJOamaioLyCtlCqSr4mxqLe1kTKup7udwL6ENcGbw53Ixqy5f5zLAM6VlNDSy6HG2yK4wrsiITPbozI11IRWIZvgfiFWAXx8IX4ANcWSvYJ+hTCZ4GCgmDdvlwpahV6wopHolAgaBOcFGPZilTVJRiKdiHbqRMR5Rpax2JZjkg9JArAJ+MgHhY9lfkpCokQkkg0ehXjYYEkEpp8OM0VtLPSEKMsTPju5aMFqQSEmTz8uEJHUD9NWCRoM0lFIB8EGCap62kC2rNmzPJQs4VpohY4lSv94nJ1rtprdu3jz6t3Lt69fuoDTro2EZg8cBHJKKF7MuHGtrFsLneFAOUOBPpgza8784aoop4SgEqJDufQBHJtTQ2A1lFBRQmtKl/6SejOQoJJqFrpZ6EMF2ZTb1MasIc2fkpJORkpZiEQb4BwkhBl+4WKkjIU2QiPR5wt0B7UxlCGkcBRDjoS448gDfEBqNUEi7fvTj9C/hukzU5BQ+oFmCwzcMMk56QyyTjv5ZWaAAwM8wIEQBijAAB6tdPNNgpvhIAQZ43FzTXPDdWGGX+gNwl1tE9zVTCTbDSfGXfmYguF/b+A1H0AzZhYBifiZmBoGAupVCoI+auZFfHtZgkkXj4Kc2AcXbozo1yFM/kECGHYAUYcvgQAAIfkEBRQAfwAsBQAFAC0ALQAAB/+Af4KDhIUxWIIehYp/WDGFkJGSgiBbfoOMmIN+WyCTn5E/i6OEoqCnkpmJqKyDBJGqf7GCr62FQ6mkkLi2rrmEs7S9p7HBw4Oev5qSya09gpeQxZHRz6cxKlSFSD7Aun8+SIVUKo+SUoQihUnL7ezphOiQpp8nq95/9qD0f9aQVZAWyBolsBDASNamSAoRKUGxBJEYRlLY5BMMSA2iFIrSANLFSRVB0YCUpVDJQiNBaTmlb5CTQi8JtZy0EpUAG4NWFNIpyIYAVh2CCh1K9EqRI1AiQTlS5ArRp0OPSZ1KtarVq1izDvvAtavXrx/W6DmDZufSplDTgunDtq3btm3/KnCYW5bQCj54ffrZy7cv3w523grG8WWu4Tgw8So+IcKvYy1ABL9lY9gwApOKFdNw7NfFHC6S2VKoPDfDiI0NMuOFwXlvh4puQhuQQJpDgdPAEqjmgyJEa4V/xniR7KD2gT64MflZsLsKZxb+gmAQPID0FxzIF/kRcUJ1AMc/UhS6EcFCWxwPDEug0DZ5Ir5JUGRuzFdKs0JpxEzoIoTDgwEOhOGWe7L0FU4AePlGjjmgjEGGEKER6EFrIczgDys3GBChdq3d14oCGwLTGgBSMRCicpzVMswd5gkmYWu8HGOiixz6peIxN6hBo4h+veDhMEHoOGCNe4V31Q0XaNAeEJGdaJUGEBB8IGEHLTjSSiAAIfkEBRQAfwAsBQAFAC0ALQAAB/+Af4KDhIV1QHZgJIUbgi47hZGSk4Jmblx9mYuEjYIdOSaUopFBXpmnm4Odgyyjrn83GKeojK+2gxGztJySKreRbxa6mrWSMr+EYsPEvJI1yIMTy32pgqvQkmZd09V/14Whv2VkQjjL3d+CIoLho3gMCgZCHA8DDgaz6IQhVoUANcck3WAg7NQDDgglUNilahCMQn4I+SoURM2wAQgz5jGn7w8NVy8IlZE1zEHGjF+o1ToRycikcBemhZFwEmEbdAIk+ZiU408aDdP6tKnJocKHQjxsRCIiageQoJm+EF1T6EkklqMgQO2D40BNOoWYFFrgqsWHrZkKZMh4ppCOQQ3/EtgqQbeu3btyEMDZgyaSjiVKeGwYTLiwYWyIEytezLix48fQDEsuzEPJEh0r/AIWPHlyBz+gQ4sOnaABn9NvCaX+E9dWi9GwRSw4TVssIduDyI5q4QL26BO0aVslNJwQ1qafffshEvy0DR5IlRZiSglSDuU+UDTnI+DbhpyRdkrq+ccEC99Gtp/w4/3P8UEuJbVL8QJ2gOY0RLAv9nFUyEIgqDBacCjAEFp7gjxESESDTGRMDQD4EcJpAVgRgmgICsKPPwC9YsIMIegHW4aErFMeMiYot18z8mEToW8kNlaDcjEO8gw2MtBYTCQBYSPgiDtKpBgI9Y1WY2MpnIdhGZB/tNKYCTkkt2JDnoAC2Q4utNABgo/cEggAOw==" /><br/>正在加载</div>';
            document.body.appendChild(load);
        }
    };
    function removeLoading() {
        var loadDiv = document.getElementById('w_loadPage');
        if (loadDiv) {
            document.body.removeChild(loadDiv);
        }
    };
});
