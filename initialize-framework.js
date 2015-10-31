/**
 * initialize-framework JavaScript v1.0.0
 * zhangjinglin
 * http://www.wefashional.com/
 */
(function( window, undefined ) {
        var win = window,
            doc = win.document,
        // Save a reference to some core methods
        core_push = Array.prototype.push,
        core_slice = Array.prototype.slice,
        core_indexOf = Array.prototype.indexOf,
        core_toString = Object.prototype.toString,
        core_hasOwn = Object.prototype.hasOwnProperty,
        core_trim = String.prototype.trim,
        //
        reg_html = /^\s*<(\w+|!)[^>]*>/,
        reg_selector = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/;
        //

       var fwInit = function(params){
              if(!params){
                  return this;
              }
              if(params.nodeType){
                  this[0] = params;
                  this.length = 1;
                  return this;
              }
              if(typeof(params) === "object" && params !== window){
                  return params;
              }
              if(typeof params === "string" && reg_html.test(params)){
                  //HTML elements
                   var divElement = doc.createElement("div");
                  divElement.className = "c-d-r-p";
                  var docFrag = doc.createDocumentFragment();
                  docFrag.appendChild(divElement);
                  var queryDiv = docFrag.getElementsByTagName("div");
                  queryDiv.innerHTML = params;
                  var children_number = queryDiv.children.length;
                  for (var i = 0; i< children_number;i++){
                      this[i] = queryDiv.children[z];
                  }
                  this.length = children_number;
                  //
                  return this;
              }
              if(typeof params === "string"){
                  //css styles "# or . and element"
                  var match,elem,ret,doc;
                  match = reg_selector.exec(params);
                  if(match[0].charAt(0) === "#"){
                      elem = document.getElementById(match[1]);
                      this[0] = elem;
                      this.length = 1;
                      //
                      return this;
                  }else if(match[0].charAt(0) === "."){
                      if(document.getElementsByClassName){
                          elem = document.getElementsByClassName(match[3]);
                      }else{
                          elem = getElementsByClassName(document,"*",match[3]);
                      }
                      return makeArray(elem,this);
                  }else{
                      elem = document.getElementsByTagName(match[2]);
                      return makeArray(elem,this);
                  }
              }
             //
             if(selector === window){
                 this[0] = window;
                 return this;
             }

       }

    //
    var fw = function(params){
        return new fwInit(params);
    }
    //
    fw.extend = function(){


    }
    fw.extend({
        ready:function(){

        },
        each:function(object,fn){},
        parseJSON:function(){},
        trim:function(){},
        param:function(){},
        error:function(){},
        isFunction:function(){},
        isEmptyObject:function(){},
        isPlainObject:function(){},
        isArray:function(){},
        ajax:function(){},
        get:function(){},
        getJSON:function(){},
        getScript:function(){},
        post:function(){}

    })
    // fn.prototype extend function
    fwInit.fn = fwInit.prototype = {
        constructure:fwInit,
        find:function(selector){},
        eq:function(index){
            var that = this;
            return that[index];
        },
        first:function(){
            var that = this;
            return that[0];
        },
        last:function(){
            var that = this;
            var lastIndex = that.length - 1;
            return that[lastIndex];
        },
        hasClass:function(className){},
        filter:function(expr){},
        children:function(){},
        closest:function(){},
        find:function(){},
        next:function(){
            var that = this;
            var array = [];
            array.push(that[0].nextSibling);
            makeArray(array,that);
            return that;
        },
        nextAll:function(){},
        nextUntil:function(){},
        offsetParent:function(){},
        parent:function(){},
        parents:function(){},
        parentsUntil:function(){},
        prev:function(){},
        prevall:function(){},
        prevUntil:function(){},
        siblings:function(){},
        attr:function(){},
        removeAttr:function(){},
        addClass:function(){},
        removeClass:function(){},
        data:function(){},
        removeDate:function(){},
        html:function(){},
        text:function(){},
        val:function(){},
        show:function(){},
        hide:function(){},
        slideDown:function(){},
        slideUp:function(){},
        fadeIn:function(){},
        fadeOut:function(){},
        animate:function(){},
        stop:function(){},
        css:function(){},
        offset:function(){},
        position:function(){},
        scrollTop:function(){},
        scrollLeft:function(){},
        height:function(){},
        width:function(){},
        innerHeight:function(){},
        innerWidth:function(){},
        outerHeight:function(){},
        outerWidth:function(){},
        append:function(){},
        appendTo:function(){},
        prepend:function(){},
        prependTo:function(){},
        after:function(){},
        before:function(){},
        insertAfter:function(){},
        insertBefore:function(){},
        wrap:function(){},
        unwrap:function(){},
        wrapAll:function(){},
        wrapInner:function(){},
        replaceWith:function(){},
        replaceAll:function(){},
        empty:function(){},
        remove:function(){},
        clone:function(){},
        on:function(){},
        off:function(){},
        bind:function(){},
        unbind:function(){},
        one:function(){},
        live:function(){},
        die:function(){},
        blur:function(){},
        change:function(){},
        click:function(){},
        dbclick:function(){},
        error:function(){},
        focus:function(){},
        focusin:function(){},
        focusout:function(){},
        keydown:function(){},
        keypress:function(){},
        keyup:function(){},
        mousedown:function(){},
        mouseenter:function(){},
        mouseleave:function(){},
        mousemove:function(){},
        mouseout:function(){},
        mouseover:function(){},
        mouseup:function(){},
        resize:function(){},
        scroll:function(){},
        select:function(){},
        submit:function(){},
        unload:function(){}
    }



    //common method
    function makeArray(array,_this){
        for(var i = 0; i<array.length;i++){
            _this[i] = array[i];
        }
        _this.length = array.length;
        return (_this);
    }
    //

    //
      win.fw = fw;

})( window );