(function(window){
    var melon = (function(){
        var melon = {};
        if (typeof window.addEventListener === 'function') {
            melon.addListener = function(el, type, fn) {
                el.addEventListener(type, fn, false);
            }
            melon.removeListener = function(el, type, fn) {
                el.removeEventListener(type, fn, false);
            }
        } else if (typeof attachEvent === 'function') {
            melon.addListener = function(el, type, fn) {
                el.attachEvent('on' + type, fn);
            }
            melon.removeListener = function(el, type, fn) {
                el.detachEvent('on' + type, fn);
            }
        } else {
            melon.addListener = function(el, type, fn) {
                el['on' + type] = fn;
            }
            melon.removeListener = function(el, type, fn) {
                el['on' + type] = null;
            }
        }
        return melon;
    })();
    window.M = melon;
})(window);