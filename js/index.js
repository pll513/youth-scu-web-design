// 川大团委介绍的滑动效果
(function(doc){
  var btnLeft = doc.getElementById('yl-left');
  var btnRight = doc.getElementById('yl-right');
  var introList = doc.getElementById('intro-list');
  var itemCnt = 10;   // 条目个数
  var handler = null;
  var direction = -1;  // 滑动方向 左: -1 右: 1

  var getMove = function (ele, direction, time) {
    var INTERVAL = 15;                                  // 动画间隔
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
  };
  setTimeout(autoSlide, 5000);
})(document);








(function(doc, w){
  var newsList = doc.getElementById('news-list');               // 要滚动的新闻列表
  var newsWrap = newsList.getElementsByClassName('news-wrap');  // 所有新闻
  var newsListWrap = doc.getElementById('news-list-wrap');      // 滚动列表容器
  var newsCnt = newsWrap.length;  // 新闻总条数
  var pageSize;                   // 一个新闻页面的新闻条数
  var initializeNewsList;         // 函数: 初始化新闻列表
  var getPageSize;                // 函数: 计算一个新闻页面的新闻条数

  getPageSize = function() {
    var clientWidth = M.getPageWidth(); // 视窗宽度
    var pageSize;
    if (clientWidth >= 1200) {
      pageSize = 4;
    } else if (clientWidth >= 992) {
      pageSize = 3;
    } else if (clientWidth >= 768) {
      pageSize = 3;
    } else {
      pageSize = 2;
    }
    return pageSize;
  };

  initializeNewsList = function(pageSize) {
    var pageCnt;                    // 新闻页面个数
    var pagination;
    var page;
    var i;
    var slideNews;    // 手动滑动新闻
    var autoSlide;    // 自动滑动新闻
    var destArr = [];
    var pages;
    var currIndex;    // 当前新闻列表最左边条目的索引
    var headNewsIndexArr = [];  // 所有新闻列表最左边的条目的集合
    var handler = null;

    var getMove = function (ele, startIndex, endIndex, time) {
      var INTERVAL = 15;
      var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
      var step;                                           // 每次移动的步长
      var start = parseFloat(ele.style.left);             // 起点
      var end = destArr[endIndex];                        // 终点

      step = Math.abs(endIndex - startIndex) * 100 / moveCnt;

      if (step === 0) {
        step = 100 / moveCnt;
      }

      if (start < end) {
        // 向右滑动
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
        return function move() {
          var left = parseFloat(ele.style.left);
          left -= step;
          if (left - step < end) {
            left = end;
          }
          ele.style.left = left + '%';
          if (left > end) {
            handler = setTimeout(move, INTERVAL);
          }
        }
      }
    };

    var getMove2 = function (ele, direction, time) {
      var INTERVAL = 15;
      var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
      var step;                                           // 每次移动的步长
      var start = parseFloat(ele.style.left);             // 起点
      var end;                                            // 终点

      if (start < end) {
        // 向右滑动
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
        return function move() {
          var left = parseFloat(ele.style.left);
          left -= step;
          if (left - step < end) {
            left = end;
          }
          ele.style.left = left + '%';
          if (left > end) {
            handler = setTimeout(move, INTERVAL);
          }
        }
      }
    };

    pagination = doc.createElement('div');
    pagination.className = 'news-pagination pa tc w';
    pagination.id = 'pagination';
    pageCnt = Math.ceil(newsCnt / pageSize);
    newsList.style.width = newsCnt * 100 / pageSize + '%';
    newsList.style.left = '0';


    // 计算headNewsIndexArr
    for (i = 0; i < newsCnt; i += pageSize) {
      headNewsIndexArr.push(i);
    }
    while (headNewsIndexArr[pageCnt - 1] + pageSize > newsCnt) {
      headNewsIndexArr[pageCnt - 1] -= 1;
    }

    for (i = 0; i < pageCnt - 1; ++i) {
      destArr[i] = - i * 100;
    }
    destArr[i] = (pageSize - newsCnt) * 100 / pageSize;

    slideNews = function(event, endIndex) {
      var startIndex;
      for (i = 0; i < pageCnt; ++i) {
        if (M.containClass(pages[i], 'active')) {
          startIndex = i;
          break;
        }
      }
      M.removeClass(pages[startIndex], 'active');
      M.addClass(pages[endIndex], 'active');
      clearTimeout(handler);
      var move = getMove(newsList, startIndex, endIndex, 1000);
      handler = setTimeout(move, 0);
    };

    autoSlide = function() {

    };

    for (i = 0; i < pageCnt; ++i) {
      page = doc.createElement('div');
      page.className = 'page';
      pagination.appendChild(page);
    }

    newsListWrap.appendChild(pagination);

    pages = pagination.getElementsByClassName('page');
    M.addClass(pages[0], 'active');

    for (i = 0; i < pageCnt; ++i) {

      // 添加点击事件
      (function(i){
        M.addListener(pages[i], 'click', function(event){
          slideNews(event, i);
        });
      })(i);

    }
  };

  pageSize = getPageSize();
  initializeNewsList(pageSize);

  w.onresize = function() {
    var pagination;
    var pageSizeNew = getPageSize();

    if (pageSizeNew !== pageSize) {
      pageSize = pageSizeNew;
      pagination = doc.getElementById('pagination');
      newsListWrap.removeChild(pagination);
      initializeNewsList(pageSizeNew);
    }
  };



  
  
})(document, window);
