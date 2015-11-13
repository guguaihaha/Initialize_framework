define(function(require, exports, module) {
    //
    var $ = require("../jquery/1.10.1/jquery");
    //
    var common = {
        //cookie
        cookie: function (key, value, time) {
            if (typeof(value) == "undefined" && typeof(key) != "undefined" && typeof(value) != "boolean") {

                var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
                if (arr != null) return (unescape(arr[2]));
                return null;
            } else if (typeof(key) == "string" && typeof(value) == "string") {
                //默认30天
                if (typeof(time) == "undefined" || typeof(time) != "number") time = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + time * 24 * 60 * 60 * 1000);
                document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;";
            } else if (typeof(value) == "boolean") {
                if (value == true) {
                    var exp = new Date();
                    exp.setTime(exp.getTime() - 1);
                    var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
                    if (arr[2] != null) document.cookie = key + "=" + arr[2] + ";expires=" + exp.toGMTString() + ";path=/";
                }
            }
        },
        //第三个参数是否使用临时会话默认不使用
        storage: function (key, value) {
            if (typeof(value) == "object") {
                value = JSON.stringify(value);
            }
            var arg = arguments[2],
                local = arg ? sessionStorage : localStorage;
            if (key && !value) {
                //读取相关信息
                return local.getItem(key);
            } else if (key && value && typeof(value) != "boolean") {
                //存储信息
                local.setItem(key, value);
            } else if (key && value && typeof(value) == "boolean") {
                local.removeItem(key);
            }
            if (arguments[3] == true) {
                local.clear();
            }
        },
        browser: {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion, ua = u.toLowerCase(), s;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    ieVersion: parseInt((s = ua.match(/msie ([\d.]+)/)) ? s[1] : "0"),
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    isSupportTouch: "ontouchend" in document ? true : false,//是否支持touch
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        },
        isPlaceholder: function () {
            var input = document.createElement('input');
            return 'placeholder' in input;
        },
        placeholder: function () {
            var _this = this;
            if (!_this.isPlaceholder()) {
                //
                $("input").not("input[type='password']").each(function () {
                    if ($(this).val() == "" && $(this).attr("placeholder") != "") {
                        $(this).val($(this).attr("placeholder"));
                        $(this).focus(function () {
                            if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
                        });
                        $(this).blur(function () {
                            if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
                        });
                    }
                });
                $("textarea").each(function () {
                    if ($(this).val() == "" && $(this).attr("placeholder") != "") {
                        $(this).val($(this).attr("placeholder"));
                        $(this).focus(function () {
                            if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
                        });
                        $(this).blur(function () {
                            if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
                        });
                    }
                });
                //creat input area and you will get task switch
                var pwdField = $("input[type=password]");
                var pwdVal = pwdField.attr('placeholder');
                pwdField.after('<input id="pwdPlaceholder" type="text" value=' + pwdVal + ' autocomplete="off" />');
                var pwdPlaceholder = $('#pwdPlaceholder');
                pwdPlaceholder.show();
                pwdField.hide();
                pwdPlaceholder.focus(function () {
                    pwdPlaceholder.hide();
                    pwdField.show();
                    pwdField.focus();
                });
                pwdField.blur(function () {
                    if (pwdField.val() == '') {
                        pwdPlaceholder.show();
                        pwdField.hide();
                    }
                });
            }
        },
        ajax: function (options) {
            var _this = this;
            var defaults = {
                type: "POST",
                url: "",
                data: "",
                dataType: "json",
                success: function (data) {
                },
                statusCode: {
                    403: function () {
                        //
                        $.alert(GL.message[4104]);
                        //跳转至登录界面
                        var status = $(".informationArea").length;
                        if (status) {
                            _this.loginStatus.relogin();
                        } else {
                            setTimeout(function () {
                                var returnUrl = window.location.href;
                                window.location.href = "/login?from=" + returnUrl;
                            }, 2000);
                        }

                    },
                    404: function () {
                        $.alert(GL.message[4200]);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                },
                timeout: 20000
            };
            var options = $.extend(defaults, options);

            var ajaxName = $.ajax({
                type: options.type,
                url: options.url,
                statusCode: options.statusCode,
                data: options.data,
                dataType: options.dataType,
                success: function (data, textStatus, jqXHR) {

                    //alert(11111111);
                    options.success.call(this, data, textStatus, jqXHR);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    //alert(XMLHttpRequest+"__"+textStatus+"__"+errorThrown);
                    options.error.call(this, XMLHttpRequest, textStatus, errorThrown);
                },
                timeout: options.timeout
            });
            return ajaxName;
        },
        animateScrollTop: function (targetTop) {
            var callback = arguments[1] || function () {
                };
            var _this = this;
            var time = 400;
            var ptime = 20;
            var nowtop = $(window).scrollTop();
            var fixTop = parseInt(targetTop) - parseInt(nowtop);
            if (fixTop == 0)return false;
            //fix
            var fixTopNum = 20;

            //
            var number = time / ptime;
            var total = 1;
            var scrollMove = fixTop / number;

            var mayeer = setInterval(function () {

                var nowMove = total * scrollMove + parseInt(nowtop) + fixTopNum;

                $(window).scrollTop(nowMove);
                total++;
                if (total > number) {
                    clearInterval(mayeer);
                    setTimeout(function () {
                        callback.call(this);
                    }, 100);
                }
            }, ptime);
        },
        resizeQueen: [],//方法队列
        resizeStorage: function () {
            var _this = this;
            $(window).resize(function () {
                //var wt = parseInt($(window).scrollTop());
                var _wthis = this;
                $.each(_this.resizeQueen, function (i, n) {
                    //param 当前window高度
                    n.call(_wthis);
                });
            });
        },
        scrollQueen: [],
        scrollStorage: function () {
            var _this = this;
            $(window).bind("scroll", function () {
                var wt = parseInt($(window).scrollTop());
                var _wthis = this;
                $.each(_this.scrollQueen, function (i, n) {
                    //param 当前window高度
                    n.call(_wthis, wt);
                });
            })
        }
    }
    //
    module.exports = common;
    module.id = "common";
    //
    //原型拓展
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})




