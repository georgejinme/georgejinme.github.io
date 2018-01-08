---
layout:     post
title:      "2018-01-09-使用GoogleClosureLibrary来制作MessageIndicator"
subtitle:   "认真工作，养(xiao)家(sa)糊(ren)口(sheng)"
date:       2018-01-09 00:55:00
author:     "George"
header-img: "img/post-bg-wap.jpg"
tags:
    - Works Applications
    - Web
    - 技术
---

## 概述

在做项目的时候遇到了一个需求，大概是这样的：

在Sidemenu中，如果有太多用户未读的信息不能显示在页面中，就添加两个indicator，来提示用户。同时如果点击indicator，能够直接scroll到相应的未读信息。

用文字说明很难解释清楚，直接放一张Slack的图吧，看了就能理解了。

![img](slack.png)

当然最终的实现和Slack不完全一样。由于是机密信息所以就不放图了，下面的代码也是经过一些处理的。知道方法后自己实现一个还是非常简单的。

## HTML

首先在HTML中添加相关的代码

```
// 上方有未读消息的indicator
<div class="indicator indicator-top" id="top-indicator">
    <span class="indicator-name" th:text="More unread" />
    <span class="indicator-icon icon-arrow-up " />
</div>
//下方有未读消息的indicator
<div class="indicator indicator-bottom" id="bottom-indicator">
    <span class="indicator-name" th:text="More unread" />
    <span class="indicator-icon icon-arrow-down" />
</div>
```

代码很好理解，不做过多解释了。接下去我们需要修改相应的样式。

## LESS

```
indicator {
    position:absolute;
    left: 4px;
    right: 4px;
    text-align: center;
    background-color: blue;
    cursor: pointer;
    transition: all 0.4s ease;
    color: white;
    padding: 4px;
    height: 26px;

    &-top {
        top: -26px;
        border-radius: 0 0 3px 3px;
    }

    &-bottom {
        bottom: -26px;
        border-radius: 3px 3px 0 0;
    }

    &-name {
        padding-right: 8px;
    }
```

需要注意的地方是，我们需要判断是否有未读的信息没有显示在window内，再来决定要不要显示indicator。因此，在scroll的过程中，indicator的状态可能会发生改变（显示->隐藏或者隐藏->显示）。状态的改变需要平滑的过度，这里就使用CSS3的transition属性来实现，通过移动indicator的位置，来隐藏或者显示它。


## Javascript

下面是核心部分。我们需要用JS在做几件事情：

1. scroll的过程中判断是否要显示indicator
2. 点击indicator跳转

首先是第一点。我们需要先找到第一个和最后一个未读的信息，代码如下：

```
var findFirstNewItem = function() {
    return goog.array.find(this.children_, function(child) {
      if (child.isNew()) {
          return child;
      }
    });
};

var findLastNewItem = function() {
    return goog.array.findRight(this.children_, function(child) {
      if (child.isNew()) {
          return child;
      }
    });
};
```

两个函数比较类似，一个是从数组头开始找，一个是从数组尾开始找。

找到以后，我们判断他们的位置，并且设置indicator的状态：

```
var renderNewIndicator = function() {
    var container = getItemsContainer();
    var currentScrollTop = container.scrollTop;

    var firstItem = findFirstNewItem();
    if (goog.isDefAndNotNull(firstItem)) {
      var pos = goog.style.getPosition(firstItem);
      var size = goog.style.getSize(firstItem);
      if (pos.y + size.height <= currentScrollTop) {
        goog.style.setStyle(topIndicator, 'top', '0px');
      } else {
        goog.style.setStyle(topIndicator, 'top', '-26px');
      }
    } else {
      goog.style.setStyle(topIndicator, 'top', '-26px');
    }

    var lastItem = findLastNewItem();
    if (goog.isDefAndNotNull(lastItem)) {
      var pos = goog.style.getPosition(lastItem);
      var containerSize = goog.style.getSize(container);
      if (pos.y > currentScrollTop + containerSize.height) {
        goog.style.setStyle(bottomIndicator, 'bottom', '0px');
      } else {
        goog.style.setStyle(bottomIndicator, 'bottom', '-26px');
      }
    } else {
      goog.style.setStyle(bottomIndicator, 'bottom', '-26px');
    }
};
```

上述代码大致就是在计算第一个和最后一个item是否出现在window之中，并且改变indicator的状态。

有几点需要注意，```scrollTop```是指某元素垂直方向scroll的距离，```getPosition```得到的位置是相对于其父元素的。简单的计算就能得到正确的判断结果了。

现在如何显示indicator已经实现，接下去我们要思考一下点击之后如何让页面scroll到相应的位置。

首先我们绑定点击事件：
```
handler.listen(topIndicator, goog.events.EventType.CLICK, function() {
    var firstItem = findFirstNewItem;
    scrollToNode(firstItem, 'top');
});
handler.listen(bottomIndicator, goog.events.EventType.CLICK, function() {
    var lastItem = findLastNewItem;
    scrollToNode(lastItem, 'bottom');
});
```
可以看到，我们在点击indicator之后，会直接scroll到相应方向最靠外侧的item。比如说如果我们点击了topIndicator，那么页面就会scroll到第一个未读消息的上方。反之如果点击bottomIndicator，就会scroll到最后一个。这样在点击某一方向的indicator之后，该方向上就不会再有屏幕外的未读消息了。

具体scroll的代码如下：

```
var scrollToNode = function(node, direction) {
    var container = getItemsContainer();
    var containerSize = goog.style.getSize(container);
    var nodePos = goog.style.getPosition(node);
    var nodeSize = goog.style.getSize(node);

    var oldPosY = container.scrollTop;
    var newPosY = oldPosY;
    if (direction === 'top') {
        newPosY = nodePos.y;
    } else if (direction === 'bottom') {
        newPosY = nodePos.y - containerSize.height + nodeSize.height;
    }
    var fxScroll = new goog.fx.dom.Scroll(container, [
        0, oldPosY
    ], [
        0, newPosY
    ], 500);

    fxScroll.play();
};
```
其中，```getPosition```等方法已经解释过了，做一些数学的计算就可以。

值得一提的是， [goog.fx.dom.Scroll](https://google.github.io/closure-library/api/goog.fx.dom.Scroll.html)是Google为我们封装好的，自动scroll到某位置的库。给定要scroll的容器，初始位置末位置，以及scroll的时间，就能够自动实现相应的功能。

现在，MessageIndicator的功能已经大致实现了。之后考虑将其封装成一个js库，以便之后使用吧。
