(function (window) {
  var melon = (function () {
    var melon = {};
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
      melon.removeListener = function (el, type, fn) {
        el['on' + type] = null;
      };
    }
    melon.getPageWidth = function () {
      var pageWidth = window.innerWidth;
      if (typeof pageWidth !== 'number') {
        if (window.document.compatMode === 'CSS1Compat') {
          pageWidth = window.document.documentElement.clientWidth;
        } else {
          pageWidth = window.document.body.clientWidth;
        }
      }
      return pageWidth;
    };
    melon.getPageHeight = function () {
      var pageHeight = window.innerHeight;
      if (typeof pageHeight !== 'number') {
        if (window.document.compatMode === 'CSS1Compat') {
          pageHeight = window.document.documentElement.clientHeight;
        } else {
          pageHeight = window.document.body.clientHeight;
        }
      }
      return pageHeight;
    };
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
    
    return melon;
  })();
  window.M = melon;
})(window);