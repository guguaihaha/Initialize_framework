(function($){
    //namespace function
    GL={};
    function GLOBAL(type){

        if(typeof(type)=="string"){

            var arr=type.split("."),o=GL ;
            for(var i=(arr[0]=="GL")?1:0;i<arr.length;i++){
                o[arr[i]]=o[arr[i]] || {};
                o=o[arr[i]];
            }
        }

    }
    //Register name
    GLOBAL("common");
    //public common method
    //your method tools you can choose by yourself
    GL.common = {
        //cookie
        cookie:function(key,value,time){
            if(typeof(value)=="undefined"&&typeof(key)!="undefined"&&typeof(value)!="boolean"){

                var arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
                if(arr != null) return (unescape(arr[2])); return null;
            }else if(typeof(key)=="string"&&typeof(value)=="string"){
                //默认30天
                if(typeof(time)=="undefined"||typeof(time)!="number") time=30;
                var exp = new Date();
                exp.setTime(exp.getTime() + time*24*60*60*1000);
                document.cookie = key + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/;";
            }else if(typeof(value)=="boolean"){
                if(value==true){
                    var exp = new Date();
                    exp.setTime(exp.getTime() - 1);
                    var arr = document.cookie.match(new RegExp("(^| )"+key+"=([^;]*)(;|$)"));
                    if(arr[2]!=null) document.cookie= key + "="+arr[2]+";expires="+exp.toGMTString()+";path=/";
                }
            }
        },
        //第三个参数是否使用临时会话默认不使用
        storage:function(key,value){
            if(typeof(value) == "object"){
                value = JSON.stringify(value);
            }
            var arg = arguments[2],
                local = arg?sessionStorage:localStorage;
            if(key&&!value){
                //读取相关信息
                return local.getItem(key);
            }else if(key&&value&&typeof(value)!="boolean"){
                //存储信息
                local.setItem(key,value);
            }else if(key&&value&&typeof(value)=="boolean"){
                local.removeItem(key);
            }
            if(arguments[3] == true){
                local.clear();
            }
        },
        browser:{
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion, ua = u.toLowerCase(),s;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    ieVersion: parseInt((s = ua.match(/msie ([\d.]+)/)) ? s[1] : "0"),
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    isSupportTouch : "ontouchend" in document ? true : false,//是否支持touch
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        },
        isPlaceholder:function(){
            var input = document.createElement('input');
            return 'placeholder' in input;
        },
        placeholder:function(){
            var _this = this;
            if (!_this.isPlaceholder()) {
                //
                $("input").not("input[type='password']").each(function(){
                    if($(this).val()=="" && $(this).attr("placeholder")!=""){
                        $(this).val($(this).attr("placeholder"));
                        $(this).focus(function(){
                            if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                        });
                        $(this).blur(function(){
                            if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                        });
                    }
                });
                $("textarea").each(function(){
                    if($(this).val()=="" && $(this).attr("placeholder")!=""){
                        $(this).val($(this).attr("placeholder"));
                        $(this).focus(function(){
                            if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                        });
                        $(this).blur(function(){
                            if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                        });
                    }
                });
                //creat input area and you will get task switch
                var pwdField = $("input[type=password]");
                var pwdVal = pwdField.attr('placeholder');
                pwdField.after('<input id="pwdPlaceholder" type="text" value='+pwdVal+' autocomplete="off" />');
                var pwdPlaceholder = $('#pwdPlaceholder');
                pwdPlaceholder.show();
                pwdField.hide();
                pwdPlaceholder.focus(function(){
                    pwdPlaceholder.hide();
                    pwdField.show();
                    pwdField.focus();
                });
                pwdField.blur(function(){
                    if(pwdField.val() == '') {
                        pwdPlaceholder.show();
                        pwdField.hide();
                    }
                });
            }
        },
        ajax:function(options){
            var _this = this;
            var defaults = {
                type: "POST",
                url: "",
                data: "",
                dataType:"json",
                success: function(data){
                },
                statusCode:{
                    403:function(){
                        //
                        $.alert(GL.message[4104]);
                        //跳转至登录界面
                        var status = $(".informationArea").length;
                        if(status){
                            _this.loginStatus.relogin();
                        }else{
                            setTimeout(function(){
                                var returnUrl = window.location.href;
                                window.location.href="/login?from="+returnUrl;
                            },2000);
                        }

                    },
                    404:function(){
                        $.alert(GL.message[4200]);
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                },
                timeout:20000
            };
            var options = $.extend(defaults,options);

            var ajaxName = $.ajax({
                type: options.type,
                url: options.url,
                statusCode:options.statusCode,
                data: options.data,
                dataType: options.dataType,
                success: function(data, textStatus, jqXHR){

                    //alert(11111111);
                    options.success.call(this,data, textStatus, jqXHR);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){

                    //alert(XMLHttpRequest+"__"+textStatus+"__"+errorThrown);
                    options.error.call(this,XMLHttpRequest, textStatus, errorThrown);
                },
                timeout:options.timeout
            });
            return ajaxName;
        },
        animateScrollTop:function(targetTop){
            var callback = arguments[1] || function(){};
            var _this = this;
            var time = 400;
            var ptime = 20;
            var nowtop = $(window).scrollTop();
            var fixTop = parseInt(targetTop) - parseInt(nowtop);
            if(fixTop == 0)return false;
            //fix
            var fixTopNum = 20;

            //
            var number = time / ptime;
            var total = 1;
            var scrollMove = fixTop / number;

            var mayeer = setInterval(function(){

                var nowMove = total * scrollMove + parseInt(nowtop) + fixTopNum;

                $(window).scrollTop(nowMove);
                total ++;
                if(total>number){
                    clearInterval(mayeer);
                    setTimeout(function(){callback.call(this);},100);
                }
            },ptime);
        },
        resizeQueen:[],//方法队列
        resizeStorage:function(){
            var _this = this;
            $(window).resize(function(){
                //var wt = parseInt($(window).scrollTop());
                var _wthis = this;
                $.each(_this.resizeQueen,function(i,n){
                    //param 当前window高度
                    n.call(_wthis);
                });
            });
        },
        scrollQueen:[],
        scrollStorage:function(){
            var _this = this;
            $(window).bind("scroll",function(){
                var wt = parseInt($(window).scrollTop());
                var _wthis = this;
                $.each(_this.scrollQueen,function(i,n){
                    //param 当前window高度
                    n.call(_wthis,wt);
                });
            })
        }
    }
    //ready

    /*
     *jquery method plugin here
     *method loading
     *property method show and hide
     *param ***
     *---------------------------
     *method alert
     *property method ****
     *
     *each property hasown check exist
     */
    /***$.fn***/

    GL.common["checkMove"] = {}
    //
    $.fn.drag = function(options){
        var defaults = {
            dragHand:[],
            mousedown:function(ev){
            },
            mousemove:function(ev){

            },
            realmousemove:function(ev){

            },
            mouseup:function(ev){

            },
            drag:function(ev){

            },
            dragend:function(ev){

            },
            dragover:function(ev){

            },
            dragleave:function(ev){

            },
            drop:function(ev){

            }
        };
        /**********/
        /*data存储
         * key=options  初始化对象
         * */
        /*********/
        var options = $.extend(defaults,options);
        var _this = this,
            $this = $(_this);
        var readyClass = +(new Date())+"jq_normalClass";
        options["readyClass"] = readyClass;
        //准备工作
        $this.addClass(readyClass);
        $this.attr({
            "move":"no",
            "ondragstart":"return false;"
        });
        //move
        //
        var dragHand = options.dragHand.length;
        if(!dragHand){
            $.alert(GL.message[4400]);
            return false;
        }else{
            $.each(options.dragHand,function(i,n){
                //预存数据
                $this.find(n).closest("."+readyClass).data("options",options);
                //mousedown
                $this.find(n).unbind("mousedown").bind("mousedown",function(ev){
                    var $p_this = $(this).closest("."+readyClass);
                    var $options = $p_this.data("options");
                    //全局拖拽检测环境
                    GL.common.checkMove = {
                        $obj:$p_this,
                        index: $("."+options.readyClass).index($p_this),
                        modelHtml:"",
                        moveStatus:"static",//static、movestart、move、moveend
                        moveDirectArray:[ev.pageY],
                        x:ev.pageX,
                        y:ev.pageY,
                        psLeft:0,
                        psTop:0,
                        fixX:0,
                        fixY:0,
                        ht_move:{},
                        ht_drag:{},
                        hide:false,
                        destroyArray:[]

                    }
                    //更换鼠标指针

                    //
                    var ps = $p_this.offset(),
                        pst = parseInt(ps.top),
                        psl = parseInt(ps.left);
                    GL.common.checkMove.psLeft = psl;
                    GL.common.checkMove.psTop = pst;
                    GL.common.checkMove.fixX = parseInt(ev.pageX) - psl;
                    GL.common.checkMove.fixY = parseInt(ev.pageY) - pst;
                    //替代模块
                    var w = parseInt($p_this.width()),
                        h = parseInt($p_this.height());
                    var ht_move = "<li  class=\"jq_model "+$options.readyClass+"\" style=\"width:"+w+"px;height:"+h+"px;\"></li>";
                    GL.common.checkMove.modelHtml = ht_move;
                    //$p_this.before(ht_move);
                    GL.common.checkMove["ht_move"] = {
                        "status":false,
                        "html":ht_move
                    }
                    GL.common.checkMove.destroyArray.push(".jq_model");
                    //移动模块
                    var xclass = $p_this.parent().attr("class");
                    var ht_drag = $p_this[0].outerHTML;
                    ht_drag = "<div class=\"jq_drag_move\" style=\"display:none;width:"+w+"px;height:"+h+"px;\"><ul class=\""+xclass+"\">"+ht_drag+"</ul></div>"
                    //$("body").append(ht_drag);
                    GL.common.checkMove["ht_drag"] = {
                        "status":false,
                        "html":ht_drag
                    }
                    GL.common.checkMove.destroyArray.push(".jq_drag_move");
                    GL.common.checkMove["hide"] = false;
                    //
                    //$p_this.hide();

                    GL.common.checkMove.moveStatus = "movestart";
                    $options.mousedown.call($p_this,ev);


                });

            });
        }

        //
        $(window).unbind("mousemove").bind("mousemove",function(ev){
            var op =  GL.common.checkMove,
                $moveObj = op.$obj,
                x = op.x,
                y = op.y;
            var nowPage = {
                x:ev.pageX,
                y:ev.pageY

            }
            if($moveObj){
                //$(".jq_drag_move").css({
                //  left:ev.pageX,
                //  top:ev.pageY
                //});

                var status = $moveObj.attr("move");
                if(status == "ok"){
                    moveDoSomething(ev);
                }
                if(Math.abs(parseInt(nowPage.y) - parseInt(y)) > 10){
                    $moveObj.attr("move","ok");
                }
                // console.log(x+"=="+y+"_____"+ev.pageX+"=="+ev.pageY);

                GL.common.checkMove.moveStatus = "move";
                options.mousemove.call($moveObj,ev);
            }

        })
        /////////////////////////////////////////
        $(window).unbind("mouseup").bind("mouseup",function(ev){
            //延迟取消选中
            setTimeout(function(){
                $("body").removeClass("noSelect");
            },300);
            //
            var op =  GL.common.checkMove,
                $moveObj = op.$obj;
            if($moveObj){
                var options = $moveObj.data("options");
                if($moveObj){
                    $moveObj.attr("move","no");
                }
                //
                //
                //
                $.each(op.destroyArray,function(i,n){
                    $(n).remove();
                });
                $moveObj.show();
                //
                //
                if(GL.common.checkMove.moveStatus == "move"){
                    options.mouseup.call($moveObj,ev);
                    GL.common.checkMove.moveStatus = "mouseend"
                }

                //

                GL.common.checkMove = {};
            }

            //
        })
        //

        /////////////////////////////////////////
        function moveDoSomething(ev){
            //
            $("body").addClass("noSelect");
            //
            var op =  GL.common.checkMove,
                $moveObj = op.$obj,
                x = parseInt(op.x),
                y = parseInt(op.y),
                nowX = parseInt(ev.pageX),
                nowY = parseInt(ev.pageY);
            var options = $moveObj.data("options");
            //
            options.realmousemove.call($moveObj,options);
            //
            GL.common.checkMove.moveDirectArray.push(nowY);
            if(GL.common.checkMove.moveDirectArray.length>2){
                GL.common.checkMove.moveDirectArray.shift();
            }
            var direct = GL.common.checkMove.moveDirectArray[1] - GL.common.checkMove.moveDirectArray[0];
            if(direct>0){
                direct = "down";
            }else if(direct<0){
                direct = "up";
            }
            //if(direct>0){
            //	direct = "down";
            //	//-webkit-transform: rotate(3deg);-moz-transform: rotate(3deg);-ms-transform: rotate(3deg);
            //	$(".jq_drag_move").css({
            //		"-webkit-transform":"rotate(3deg)",
            //		"-moz-transform":"rotate(3deg)",
            //		"-ms-transform":"rotate(3deg)"
            //	});
            //}else{
            //	direct = "up";
            //	$(".jq_drag_move").css({
            //		"-webkit-transform":"rotate(-3deg)",
            //		"-moz-transform":"rotate(-3deg)",
            //		"-ms-transform":"rotate(-3deg)"
            //	});
            //}
            //$(".jq_drag_move").css({
            //	"-webkit-transform":"rotate(3deg)",
            //	"-moz-transform":"rotate(3deg)",
            //	"-ms-transform":"rotate(3deg)"
            //});

            //
            var ht_move = GL.common.checkMove.ht_move,
                ht_drag = GL.common.checkMove.ht_drag,
                hideStatus = GL.common.checkMove.hide;
            if(!ht_move.status){
                $moveObj.before(ht_move.html);
                ht_move.status = true;
            }
            if(!ht_drag.status){
                $("body").append(ht_drag.html);
                ht_drag.status = true;
            }
            if(!hideStatus){
                $moveObj.hide();
                GL.common.checkMove.hide = true;
            }
            //////
            //动态拖动物块
            var moveX = nowX - GL.common.checkMove.fixX,
                moveY = nowY - GL.common.checkMove.fixY;
//console.log(moveX+"__"+moveY);
            $(".jq_drag_move").css({
                "left":moveX,
                "top":moveY,
                "display":"block"
            });
            //动态比较并置换位置
            var $bt_obj = $moveObj.parent().find("."+options.readyClass+":visible");
            $bt_obj.each(function(i){
                var status = $(this).css("display");
                if(status!="none"){
                    var height = parseInt($(this).height()),
                        ps = $(this).offset(),
                        pst = parseInt(ps.top),
                        pst_max = pst + height;


                    //////
                    //  $(".person_right").text(nowY+"__"+pst+"__"+status);
                    if(nowY>pst&& nowY<pst_max){
                        var index = $bt_obj.index($(this));
                        if(GL.common.checkMove.index != index){
                            if(direct == "down"){
                                $bt_obj.eq(index).after($(".jq_model"));
                            }else{
                                $bt_obj.eq(index).before($(".jq_model"));
                            }
                            $(".jq_model").after($moveObj);
                            GL.common.checkMove.index = index;
                        }
                    }

                }




            });



        }

    }
    ///////////************************/////////////
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

})(jQuery)


