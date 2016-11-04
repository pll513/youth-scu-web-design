// 川大团委介绍的滑动效果
(function(doc){
  var btnLeft = doc.getElementById('yl-left');
  var btnRight = doc.getElementById('yl-right');
  var introList = doc.getElementById('intro-list');
  var INTERVAL = 20;  // 动画间隔
  var itemCnt = 10;   // 条目个数
  var handler = null;
  var direction = -1;  // 滑动方向 左: -1 右: 1
  var getMove = function (ele, direction, time) {
    var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
    var step = 100 / moveCnt * direction;               // 每次移动的步长
    var start = parseFloat(ele.style.left);             // 起点
    var end;                                            // 终点

    if (direction > 0) {
      // 向右滑动
      end = (Math.floor(start / 100) + 1) * 100;
      if (start === 0) {
        end = 0;
      }
      return function move() {
        var left = parseFloat(ele.style.left);
        left += step;
        if (left + step > end) {
          left = end;
        }
        ele.style.left = left + '%';
        if (left < end) {
          handler = setTimeout(move, INTERVAL);
        }
      }
    } else {
      // 向左滑动
      end = (Math.ceil(start / 100) - 1) * 100;
      if (start === - (itemCnt - 1) * 100) {
        end = start;
      }
      return function move() {
        var left = parseFloat(ele.style.left);
        left += step;
        if (left + step < end) {
          left = end;
        }
        ele.style.left = left + '%';
        if (left > end) {
          handler = setTimeout(move, INTERVAL);
        }
      }
    }
  };

  var slideLeft = function() {
    clearTimeout(handler);
    var move = getMove(introList, -1, 500);
    handler = setTimeout(move, 0);
  };
  var slideRight = function() {
    clearTimeout(handler);
    var move = getMove(introList, 1, 500);
    handler = setTimeout(move, 0);
  };

  M.addListener(btnLeft, 'click', slideLeft);
  M.addListener(btnRight, 'click', slideRight);

  var autoSlide = function autoSlide() {
    var start = parseFloat(introList.style.left);
    // 转方向的判定
    if (direction < 0) {
      slideLeft();
      if (start === - (itemCnt - 1) * 100) {
        direction *= -1;
      }

    } else {
      slideRight();
      if (start === 0) {
        direction *= -1;
      }
    }
    setTimeout(autoSlide, 5000);
  }
  setTimeout(autoSlide, 5000);
})(document);
