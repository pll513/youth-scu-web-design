(function (window, doc) {
  var melon = (function () {
    
    var melon = {};
    
    melon.method = function (ele, funcName, func) {
      if (!ele.prototype[funcName]) {
        ele.prototype[funcName] = func;
      }
      return this;
    };
    
    melon.method(Array, 'indexOf', function(ele) {
      var i;
      var len = this.length;
      for (i = 0; i < len; ++i) {
        if (this[i] === ele) {
          return i;
        }
      }
      return -1;
    });
    
    if (typeof window.addEventListener === 'function') {
      melon.addListener = function (el, type, fn) {
        el.addEventListener(type, fn, false);
      };
      melon.removeListener = function (el, type, fn) {
        el.removeEventListener(type, fn, false);
      };
    } else if (typeof attachEvent === 'function') {
      melon.addListener = function (el, type, fn) {
        el.attachEvent('on' + type, fn);
      };
      melon.removeListener = function (el, type, fn) {
        el.detachEvent('on' + type, fn);
      }
    } else {
      melon.addListener = function (el, type, fn) {
        el['on' + type] = fn;
      };
      melon.removeListener = function (el, type) {
        el['on' + type] = null;
      };
    }
    melon.getPageWidth = function () {
      var pageWidth = window.innerWidth;
      if (typeof pageWidth !== 'number') {
        if (doc.compatMode === 'CSS1Compat') {
          pageWidth = doc.documentElement.clientWidth;
        } else {
          pageWidth = doc.body.clientWidth;
        }
      }
      return pageWidth;
    };
    melon.getPageHeight = function () {
      var pageHeight = window.innerHeight;
      if (typeof pageHeight !== 'number') {
        if (doc.compatMode === 'CSS1Compat') {
          pageHeight = doc.documentElement.clientHeight;
        } else {
          pageHeight = doc.body.clientHeight;
        }
      }
      return pageHeight;
    };
    melon.setScrollTop = function (top) {
      doc.documentElement.scrollTop = top;
      doc.body.scrollTop = top;
    };
    if (typeof window.pageYOffset === 'number') {
      melon.getScrollTop = function () {
        return window.pageYOffset;
      };
    } else {
      melon.getScrollTop = function () {
        if (doc.documentElement.scrollTop > 0) {
          melon.getScrollTop = function () {
            return doc.documentElement.scrollTop;
          };
          melon.setScrollTop = function (top) {
            doc.documentElement.scrollTop = top;
          };
          return doc.documentElement.scrollTop;
        } else if (doc.body.scrollTop > 0) {
          melon.getScrollTop = function () {
            return doc.body.scrollTop;
          };
          melon.setScrollTop = function (top) {
            doc.body.scrollTop = top;
          };
          return doc.body.scrollTop;
        }
        return doc.documentElement.scrollTop || doc.body.scrollTop;
      };
    }
    melon.scrollTo = function (end, time) {
      var tScroll;
      var INTERVAL = 15;
      var currTop = M.getScrollTop();
      var moveCnt = Math.floor(time / INTERVAL);
      var step = (end - currTop) / moveCnt;
      var move;
      var pageHeight = M.getPageHeight();       // 视窗高度
      var docHeight = doc.documentElement.offsetHeight; // 文档实际高度
      var maxOffset = docHeight > pageHeight ? docHeight - pageHeight : docHeight;  // 离顶部的最大偏移值
    
      end = end > maxOffset ? maxOffset : end;
    
      if (end < 0) {
        end = 0;
      }
      if (currTop > end) {
        move = function () {
          currTop = M.getScrollTop();
          currTop += step;
          if (currTop < end) {
            currTop = end;
          }
          M.setScrollTop(currTop);
          if (currTop > end) {
            tScroll = setTimeout(move, INTERVAL);
          }
        }
      } else if (currTop < end) {
        move = function () {
          currTop = M.getScrollTop();
          console.log(currTop);
          currTop += step;
          if (currTop > end) {
            currTop = end;
          }
          M.setScrollTop(currTop);
          if (currTop < end) {
            tScroll = setTimeout(move, INTERVAL);
          }
        }
      
      } else {
        return;
      }
      tScroll = setTimeout(move, 0);
      return tScroll;
    };
    // melon.scrollTop = function() {
    //   return doc.documentElement.scrollTop || window.pageYOffset || doc.body.scrollTop;
    // };
    melon.containClass = function (ele, c) {
      
      var classes = ele.className;
      
      if (c.length === 0 || c.indexOf(' ') != -1) {
        throw new Error('Invalid class name: "' + c + '"');
      }
      
      if (!classes) {
        return false;
      }
      if (classes === c) {
        return true;
      }
      return classes.search('\\b' + c + '\\b') !== -1;
      
    };
    melon.addClass = function (ele, c) {
      
      var classes = ele.className;
      
      if (melon.containClass(ele, c)) {
        return;
      }
      
      if (classes && classes[classes.length - 1] !== ' ') {
        c = ' ' + c;
      }
      ele.className = classes + c;
    };
    melon.removeClass = function (ele, c) {
      
      var pattern = new RegExp('\\b' + c + '\\b\\s*', 'g');
      ele.className = ele.className.replace(pattern, "");
      
      if (c.length === 0 || c.indexOf(' ') != -1) {
        throw new Error('Invalid class name: "' + c + '"');
      }
      
    };
    melon.toggleClass = function (ele, c) {
      if (melon.containClass(ele, c)) {
        melon.removeClass(ele, c);
        return false;
      } else {
        melon.addClass(ele, c);
        return true;
      }
    };
    melon.getElementsByClassName = function (className, root, tag) {
      
      var elementList = [];
      var elements;
      var element;
      var i;
      var j;
      var lenElements;
      var lenClassList;
      var classList;
      
      root = typeof root === 'string' ? doc.getElementById(root) : root;
      if (!root) {
        root = doc.body;
      }
  
      if ( typeof root.getElementsByClassName === 'function') {
        return root.getElementsByClassName(className);
      }
      
      tag = tag || '*';
      elements = root.getElementsByTagName(tag);
      
      for (i = 0, lenElements = elements.length; i < lenElements; ++i) {
        element = elements[i];
        classList = element.className.split(' ');
        lenClassList = classList.length;
        for (j = 0; j < lenClassList; ++j) {
          if (classList[j] === className) {
            elementList.push(element);
            break;
          }
        }
      }
      
      return elementList;
      
    };
    return melon;
  })();
  window.M = melon;
})(window, document);