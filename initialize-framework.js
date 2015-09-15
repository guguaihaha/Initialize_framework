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
       var fw = function(params){
           return new fwInit(params);
       }
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
    //common method
    function makeArray(array,_this){
        for(var i = 0; i<array.length;i++){
            _this[i] = array[i];
        }
        _this.length = array.length;
        return (_this);
    }

    //
      win.fw = fw;
      fw.fn = fwInit.prototype;
})( window );