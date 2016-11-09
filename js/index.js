/*
 ** 川大团委介绍的滑动效果
 */

(function (doc) {
  var btnLeft = doc.getElementById('yl-left');
  var btnRight = doc.getElementById('yl-right');
  var introList = doc.getElementById('intro-list');
  var itemCnt = 10;   // 条目个数
  var tMove = null;
  var direction = -1;  // 滑动方向 左: -1 右: 1

  var getMove = function (ele, direction, time) {
    var INTERVAL = 10;                                  // 动画间隔
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
          tMove = setTimeout(move, INTERVAL);
        }
      }
    } else {
      // 向左滑动
      end = (Math.ceil(start / 100) - 1) * 100;
      if (start === -(itemCnt - 1) * 100) {
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
          tMove = setTimeout(move, INTERVAL);
        }
      }
    }
  };

  var slideLeft = function () {
    clearTimeout(tMove);
    var move = getMove(introList, -1, 500);
    tMove = setTimeout(move, 0);
  };
  var slideRight = function () {
    clearTimeout(tMove);
    var move = getMove(introList, 1, 500);
    tMove = setTimeout(move, 0);
  };

  M.addListener(btnLeft, 'click', slideLeft);
  M.addListener(btnRight, 'click', slideRight);

  var autoSlide = function autoSlide() {
    var start = parseFloat(introList.style.left);
    // 转方向的判定
    if (direction < 0) {
      slideLeft();
      if (start === -(itemCnt - 1) * 100) {
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


/*
 ** 新闻滑动效果
 */

(function (doc, w) {
  var newsList = doc.getElementById('news-list');               // 要滚动的新闻列表
  var newsWrap = M.getElementsByClassName('news-wrap', newsList); // 所有新闻
  var newsListWrap = doc.getElementById('news-list-wrap');      // 滚动列表容器
  var newsCnt = newsWrap.length;  // 新闻总条数
  var pageSize;                   // 一个新闻页面的新闻条数
  var initializeNewsList;         // 函数: 初始化新闻列表
  var getPageSize;                // 函数: 计算一个新闻页面的新闻条数
  var tMove = null;
  var tAutoSlide = null;
  var tEachSlide = null;

  var pageCnt;      // 新闻页面个数
  var pagination;   // 分页按钮容器
  var page;         // 分页按钮
  var pages;        // 所有分页按钮对象

  var i;
  var slideNews;        // 函数: 手动滑动新闻
  var autoSlide;        // 函数: 自动滑动新闻
  var destIndexArr = [];   // 所有新闻列表最左边的条目的位置集合: [0,4] | [0,3,5] | [0,2,4,6] (pageCnt=8)
  var destIndexArr2 = [];  // 所有新闻的位置: [0,1,2,3,4,5,6,7]
  var destArr = [];     // 根据百分比计算destIndexArr的位置
  var destArr2 = [];    // 根据百分比计算destIndexArr2的位置
  var currLeftIndex = 0;    // 当前新闻列表最左边条目的位置
  var currPageIndex = 0;    // 当前页面位置: 0,1,2,3 | 0,1,2 | 0,1
  var currIndex = 0;        // 当前新闻条目位置: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  var AUTO_SLIDE_INTERVAL = 6000;

  getPageSize = function () {
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

  var getMove = function (ele, startIndex, endIndex, time) {
    var INTERVAL = 10;
    var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
    var step;                                           // 每次移动的步长
    var start = parseFloat(ele.style.left);             // 起点
    var end = destArr[endIndex];                        // 终点
    
    step = 100 / moveCnt;

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
          tMove = setTimeout(move, INTERVAL);
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
          tMove = setTimeout(move, INTERVAL);
        }
      }
    }
  };

  var getMove2 = function (ele, startIndex, endIndex, time) {

    var INTERVAL = 10;
    var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
    var step = 100 / (pageSize * moveCnt);              // 每次移动的步长
    var start = destArr2[startIndex];             // 起点
    var end = destArr2[endIndex];                 // 终点

    if (start < end) {
      // 向右滑动
      step *= 2;
      return function move() {
        var left = parseFloat(ele.style.left);
        left += step;
        if (left + step > end) {
          left = end;
        }
        ele.style.left = left + '%';
        if (left < end) {
          tEachSlide = setTimeout(move, INTERVAL);
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
          tEachSlide = setTimeout(move, INTERVAL);
        }
      }
    }
  };

  var stopAutoSlide;
  var restartAutoSlide;

  autoSlide = function autoSlide() {
    var nextIndex = (currIndex + 1) % (newsCnt - pageSize + 1);    // 下一条新闻的位置
    var index = destIndexArr.indexOf(nextIndex);  // 下一条新闻是否是最左边的
    var slide = getMove2(newsList, currIndex, nextIndex, 500);

    if (index !== -1) {
      M.removeClass(pages[currPageIndex], 'active');
      M.addClass(pages[index], 'active');
      currPageIndex = index;
    }
    currIndex = nextIndex;


    tEachSlide = setTimeout(slide, 0);
    tAutoSlide = setTimeout(autoSlide, AUTO_SLIDE_INTERVAL);
  };

  slideNews = function (endIndex) {

    var move;

    M.removeClass(pages[currPageIndex], 'active');
    M.addClass(pages[endIndex], 'active');

    move = getMove(newsList, currIndex, endIndex, 1000);
    currIndex = destIndexArr[endIndex];
    currPageIndex = endIndex;

    clearTimeout(tEachSlide);
    clearTimeout(tAutoSlide);
    tMove = setTimeout(move, 0);
    tAutoSlide = setTimeout(autoSlide, AUTO_SLIDE_INTERVAL);
  };

  stopAutoSlide = function () {
    clearTimeout(tAutoSlide);
  };

  restartAutoSlide = function () {
    tAutoSlide = setTimeout(autoSlide, AUTO_SLIDE_INTERVAL);
  };

  initializeNewsList = function () {
    currLeftIndex = 0;
    currPageIndex = 0;
    currIndex = 0;
    destIndexArr = [];
    destIndexArr2 = [];
    destArr = [];
    destArr2 = [];

    pageSize = getPageSize();
    pageCnt = Math.ceil(newsCnt / pageSize);
    newsList.style.width = newsCnt * 100 / pageSize + '%';
    newsList.style.left = '0';

    // 计算4个Arr
    for (i = 0; i < newsCnt; i += pageSize) {
      destIndexArr.push(i);
    }
    while (destIndexArr[pageCnt - 1] + pageSize > newsCnt) {
      destIndexArr[pageCnt - 1] -= 1;
    }

    for (i = 0; i < newsCnt; ++i) {
      destIndexArr2[i] = i;
      destArr2[i] = -i * 100 / pageSize;
    }

    for (i = 0; i < pageCnt; ++i) {
      destArr[i] = destArr2[destIndexArr[i]];
    }

    // 添加分页标签
    pagination = doc.createElement('div');
    pagination.className = 'news-pagination pa tc w';
    pagination.id = 'pagination';
    for (i = 0; i < pageCnt; ++i) {
      page = doc.createElement('div');
      page.className = 'page';
      pagination.appendChild(page);
    }
    newsListWrap.appendChild(pagination);
    pages = M.getElementsByClassName('page', pagination);
    M.addClass(pages[0], 'active');


    // 添加分页标签点击事件
    for (i = 0; i < pageCnt; ++i) {

      // 闭包绑定i
      (function (i) {
        M.addListener(pages[i], 'click', function () {
          clearTimeout(tMove);
          tMove = setTimeout(function(){slideNews(i)}, 0);
        });
      })(i);

    }

    tAutoSlide = setTimeout(autoSlide, AUTO_SLIDE_INTERVAL);

    M.addListener(newsList, 'mouseover', stopAutoSlide);
    M.addListener(newsList, 'mouseout', restartAutoSlide);

  };

  pageSize = getPageSize();
  initializeNewsList(pageSize);

  w.onresize = function () {
    var pagination;
    var pageSizeNew = getPageSize();

    if (pageSizeNew !== pageSize) {
      clearTimeout(tMove);
      clearTimeout(tEachSlide);
      clearTimeout(tAutoSlide);
      M.removeListener(newsList, 'mouseover', stopAutoSlide);
      M.removeListener(newsList, 'mouseout', restartAutoSlide);
      pageSize = pageSizeNew;
      pagination = doc.getElementById('pagination');
      newsListWrap.removeChild(pagination);
      initializeNewsList(pageSizeNew);
    }
  };

})(document, window);

(function (doc, w) {
  var header = doc.getElementById('header');
  var special = doc.getElementById('special');
  var news = doc.getElementById('news');
  var notice = doc.getElementById('notice');
  var youthLeague = doc.getElementById('youth-league');
  var studentGround = doc.getElementById('student-ground');
  var greenChannel = doc.getElementById('green-channel');
  var returnTop = doc.getElementById('return-top');
  var navBar = doc.getElementById('navbar');
  var returnToTop;    // 函数：返回顶部
  var toggleBtn;      // 函数：交替按钮透明度
  var scrollToSection;  // 函数：跳转到对应部分
  var tScroll;

  returnToTop = function (e) {
    var event = e || w.event;

    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    
    // 是否需要滑动
    if (M.getScrollTop() > 0) {
      clearTimeout(tScroll);
      M.scrollTo(0, 800);
    }

  };

  scrollToSection = function (e) {
    var event;
    var target;
    var targetClass;

    event = e || w.event;
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    
    target = event.target || event.srcElement;
    targetClass = target.className;
    if (targetClass === 'link-spec') {
      M.scrollTo(special.offsetTop, 800);
    } else if (targetClass === 'link-news') {
      M.scrollTo(news.offsetTop, 800);
    } else if (targetClass === 'link-nt') {
      M.scrollTo(notice.offsetTop, 800);
    } else if (targetClass === 'link-yl') {
      M.scrollTo(youthLeague.offsetTop, 800);
    } else if (targetClass === 'link-sg') {
      M.scrollTo(studentGround.offsetTop, 800);
    } else if (targetClass === 'link-gc') {
      M.scrollTo(greenChannel.offsetTop, 800);
    }
  };

  toggleBtn = function () {
    
    if (M.getScrollTop() > header.offsetHeight) {
      returnTop.style.display = 'block';
    } else {
      returnTop.style.display = 'none';
    }
  };
  
  setInterval(toggleBtn, 30);

  M.addListener(returnTop, 'click', returnToTop);
  M.addListener(navBar, 'click', scrollToSection);

})(document, window);



