// 川大团委介绍的滑动效果
// (function(doc){
//   var btnLeft = doc.getElementById('yl-left');
//   var btnRight = doc.getElementById('yl-right');
//   var introList = doc.getElementById('intro-list');
//   var itemCnt = 10;   // 条目个数
//   var handler = null;
//   var direction = -1;  // 滑动方向 左: -1 右: 1
//
//   var getMove = function (ele, direction, time) {
//     var INTERVAL = 10;                                  // 动画间隔
//     var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
//     var step = 100 / moveCnt * direction;               // 每次移动的步长
//     var start = parseFloat(ele.style.left);             // 起点
//     var end;                                            // 终点
//
//     if (direction > 0) {
//       // 向右滑动
//       end = (Math.floor(start / 100) + 1) * 100;
//       if (start === 0) {
//         end = 0;
//       }
//       return function move() {
//         var left = parseFloat(ele.style.left);
//         left += step;
//         if (left + step > end) {
//           left = end;
//         }
//         ele.style.left = left + '%';
//         if (left < end) {
//           handler = setTimeout(move, INTERVAL);
//         }
//       }
//     } else {
//       // 向左滑动
//       end = (Math.ceil(start / 100) - 1) * 100;
//       if (start === - (itemCnt - 1) * 100) {
//         end = start;
//       }
//       return function move() {
//         var left = parseFloat(ele.style.left);
//         left += step;
//         if (left + step < end) {
//           left = end;
//         }
//         ele.style.left = left + '%';
//         if (left > end) {
//           handler = setTimeout(move, INTERVAL);
//         }
//       }
//     }
//   };
//
//   var slideLeft = function() {
//     clearTimeout(handler);
//     var move = getMove(introList, -1, 500);
//     handler = setTimeout(move, 0);
//   };
//   var slideRight = function() {
//     clearTimeout(handler);
//     var move = getMove(introList, 1, 500);
//     handler = setTimeout(move, 0);
//   };
//
//   M.addListener(btnLeft, 'click', slideLeft);
//   M.addListener(btnRight, 'click', slideRight);
//
//   var autoSlide = function autoSlide() {
//     var start = parseFloat(introList.style.left);
//     // 转方向的判定
//     if (direction < 0) {
//       slideLeft();
//       if (start === - (itemCnt - 1) * 100) {
//         direction *= -1;
//       }
//
//     } else {
//       slideRight();
//       if (start === 0) {
//         direction *= -1;
//       }
//     }
//     setTimeout(autoSlide, 5000);
//   };
//   setTimeout(autoSlide, 5000);
// })(document);


(function (doc, w) {
  var newsList = doc.getElementById('news-list');               // 要滚动的新闻列表
  var newsWrap = newsList.getElementsByClassName('news-wrap');  // 所有新闻
  var newsListWrap = doc.getElementById('news-list-wrap');      // 滚动列表容器
  var newsCnt = newsWrap.length;  // 新闻总条数
  var pageSize;                   // 一个新闻页面的新闻条数
  var initializeNewsList;         // 函数: 初始化新闻列表
  var getPageSize;                // 函数: 计算一个新闻页面的新闻条数
  var handler = null;
  var autoSlideHandler = null;
  var handlerSlide = null;

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

  initializeNewsList = function (pageSize) {
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


    var getMove = function (ele, startIndex, endIndex, time) {
      var INTERVAL = 10;
      var moveCnt = (time - time % INTERVAL) / INTERVAL;  // 移动次数
      var step;                                           // 每次移动的步长
      var start = parseFloat(ele.style.left);             // 起点
      var end = destArr[endIndex];                        // 终点

      step = w.Math.abs(endIndex - startIndex) * 100 / moveCnt;

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
            setTimeout(move, INTERVAL);
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
            setTimeout(move, INTERVAL);
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
        step *= (pageCnt - 1);
        step *= pageSize;
        return function move() {
          var left = parseFloat(ele.style.left);
          left += step;
          if (left + step > end) {
            left = end;
          }
          ele.style.left = left + '%';
          if (left < end) {
            handlerSlide = setTimeout(move, INTERVAL);
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
            handlerSlide = setTimeout(move, INTERVAL);
          }
        }
      }
    };

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

    slideNews = function (event, endIndex) {

      var move;

      M.removeClass(pages[currPageIndex], 'active');
      M.addClass(pages[endIndex], 'active');

      move = getMove(newsList, currIndex, endIndex, 500);
      currIndex = destIndexArr[endIndex];
      currPageIndex = endIndex;

      clearTimeout(handler);
      clearTimeout(handlerSlide);
      clearTimeout(autoSlideHandler);
      handler = setTimeout(move, 0);
      autoSlideHandler = setTimeout(autoSlide, 4000);
    };

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


      handlerSlide = setTimeout(slide, 0);
      autoSlideHandler = setTimeout(autoSlide, 4000);
    };

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
    pages = pagination.getElementsByClassName('page');
    M.addClass(pages[0], 'active');


    // 添加分页标签点击事件
    for (i = 0; i < pageCnt; ++i) {

      // 闭包绑定i
      (function (i) {
        M.addListener(pages[i], 'click', function (event) {
          slideNews(event, i);
        });
      })(i);

    }

    autoSlideHandler = setTimeout(autoSlide, 4000);

    // M.addListener(newsList, 'mouseover', function () {
    //   clearTimeout(autoSlideHandler);
    // });
    // M.addListener(newsList, 'mouseout', function () {
    //   clearTimeout(handlerSlide);
    //   setTimeout(autoSlide, 4000);
    // });

  };

  pageSize = getPageSize();
  initializeNewsList(pageSize);

  w.onresize = function () {
    var pagination;
    var pageSizeNew = getPageSize();

    if (pageSizeNew !== pageSize) {
      clearTimeout(handler);
      clearTimeout(handlerSlide);
      clearTimeout(autoSlideHandler);
      pageSize = pageSizeNew;
      pagination = doc.getElementById('pagination');
      newsListWrap.removeChild(pagination);
      initializeNewsList(pageSizeNew);
    }
  };

  
})(document, window);


// console.log('pageCnt: ' + pageCnt);
// console.log('pageSize: ' + pageSize);
// console.log('newsCnt: ' + newsCnt);
// console.log('destIndexArr: ' + destIndexArr);
// console.log('destIndexArr2: ' + destIndexArr2);
// console.log('destArr: ' + destArr);
// console.log('destArr2: ' + destArr2);
// console.log('currLeftIndex: ' + currLeftIndex);
// console.log('currIndex: ' + currIndex);
// console.log('currPageIndex: ' + currPageIndex);


