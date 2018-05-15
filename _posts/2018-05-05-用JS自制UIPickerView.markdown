---
layout:     post
title:      "用JS自制UIPickerView"
subtitle:   "认真工作，养(xiao)家(sa)糊(ren)口(sheng)"
date:       2018-05-05 23:55:00
author:     "George"
header-img: "img/post-bg-wap.jpg"
tags:
    - Works Applications
    - Web
    - 技术
---

## 前言

这个UIPickerView其实制作的难度还是相当之大的，主要是利用到了一些数学方面的知识和需要考虑性能方面的问题。下面我们就一步一步来讲我的思路和如何去实现的。

## 正文

#### 整体结构

首先我们要划分清楚，这个data-picker是一个单独的组件还是由几个小组件构成。这里因为在手机上可能会有几个不同的独立的滚轮，所以我们把一个data-picker拆分成多个不同的data-picker-column。那么所有的滚动实现的细节都在data-picker-column中实现，我们现在来具体思考一下这个column需要哪些操作。

- 建模，把3D模型投射到2D平面中
- 滑动时的行为
- 滑动结束后惯性行为
- 滑动速度小于某值时自动滚动到最近的item

大概正常的column实现的步骤就是上述几个。这个其实也很好想，实际在手机上使用时看看干了哪些事就知道了。但是这里我们多增加一个“规范化”的步骤。什么意思呢，实际上我们左右的数学计算都是使用double类型的，而double类型在计算机中会有一部分的精度损失，最终导致在界面上会有微小的位置偏移。所以我们在滚动完之后重新计算一次所有item应该在的位置，然后直接将他们移动过去。这部分时候也会解释。

#### 建模
建模过程并不难，首先我们要确定在组件中需要哪些成员变量。实际上我们所看到的column是由“可见item”组成的，仅仅是180°的视角。而那些不可见的item，会被隐藏起来，具体怎么隐藏可以根据不同的开发者自己设定，但是这部分不可见的，应当在某些条件下（滚动的时候）能够出现在屏幕中，而那些可见的item也能够隐藏起来。

现在我们来想一下item应该有哪些要素，首先是dom元素，然后是当前item位置的角度，这里我们规定y负方向为0°，z正方向为90°。此外还需要给每一个item增加一个id和这个item的值。

```
this.shownItems_.push({
    'id': index,
    'currentDegree': itemDegree,
    'item': $item,
    'value': v
});
```

在实际滚动的过程中，真正改变的只有每一个item的`currentDegree`。这里我们规定，如果一个item是不可见的，那么他的`currentDegree`就是0。也就是在滚轮的最上面。

```
this.hiddenItems_.push({
    'id': index,
    'currentDegree': 0,
    'item': $item,
    'value': v
});
```

如果我们知道了item当前的`currentDegree`，规定了整个column的半径大小，就能够通过数学三角公式计算出这个item的位置。同时补充一点，为了计算方便，这里我们规定相邻的item的间隔为30°。除了位置以外，本身item也需要绕着屏幕x轴进行一定的旋转，这样做的话会使得文字看上去是贴在这个column上面的，目前手机实现的picker也都是如此。最后，我们需要给所有的item规定opacity。当前选中的item的opacity为1，隐藏的为0，然后其他的根据`currentDegree`依次计算得到。

```
/**
* @private
* @param {Element} item
* @param {Number} degree
*/
Column.prototype.setShownItemStyle_ = function(item, degree) {
    var newPosY = Column.Const_.COLUMN_HEIGHT / 2 - Column.Const_.RADIUS * Math.cos(goog.math.toRadians(degree)) -
        Column.Const_.ITEM_HEIGHT / 2;
    var opacity = this.getOpacityByDegree_(degree);
    var rotate = Column.Const_.DEGREE_90 - degree;
    goog.style.setStyle(item, {
        'top': newPosY + 'px',
        'opacity': opacity,
        'transform': 'rotateX(' + rotate + 'deg) translateX(-50%)',
        '-ms-transform': 'rotateX(' + rotate + 'deg) translateX(-50%)',
        '-moz-transform': 'rotateX(' + rotate + 'deg) translateX(-50%)',
        '-webkit-transform': 'rotateX(' + rotate + 'deg) translateX(-50%)',
        '-o-transform': 'rotateX(' + rotate + 'deg) translateX(-50%)'
    });
};

/**
* @private
* @param {Number} degree
* @return {Number}
*/
Column.prototype.getOpacityByDegree_ = function(degree) {
    var opacity = 1;
    if (degree <= Column.Const_.DEGREE_90) {
        opacity = 1 - 1 / Column.Const_.DEGREE_90 * (Column.Const_.DEGREE_90 - degree);
    } else if (degree > Column.Const_.DEGREE_90 && degree < Column.Const_.DEGREE_180) {
        opacity = 1 - 1 / Column.Const_.DEGREE_90 * (degree - Column.Const_.DEGREE_90);
    } else {
        opacity = 0;
    }
    return opacity;
};
```

到这里我们就已经可以把模型建立起来了，可以在屏幕上画出一个静止的column来。

#### 滑动时的行为

我们把整个滑动时的行为分解成三个部分，分别对应浏览器的 `touchstart`, `touchmove` 和 `touchend` 事件。

首先是`touchstart`，这个事件被触发时，表示准备开始滑动了。这里不需要什么特别做的操作，只是对一些变量进行初始化，得到用户手指滑动的初始位置。这里我们设置了几个相对比较奇怪的变量。

```
var speedCalculator = new goog.structs.Queue();
speedCalculator.clear();
currentTouchMoveTime = this.getCurrentTime_();
lastTouchMoveTime = currentTouchMoveTime;
```

在 `speedCalculator` 中，我们规定只能存储五个队列元素。每一个元素中包含一个`distance`和一个`time`，`distance`是两次`touchmove`被触发时所滑动的距离，`time`就是这两次触发所间隔的时间。这些变量都是为之后模拟惯性行为所服务的。因为队列中的最后五个元素是手指触碰滑动的最后五个元素，是即将开始惯性运动前的五个元素，所以能够通过该变量计算出匀变速运动开始的初速度。

接下来就是非常关键的函数之一 `touchmove`。该方法被触发时，我们需要计算出手指滑动的距离，这个距离也就是column的边所滑动的距离（一段弧长）。需要注意的是，有些情况下手指滑动的距离并不是实际column需要滚动的距离。我们暂时先不考虑这种情况，之后会慢慢解释。

现在得到了column需要滚动的距离之后，我们就可以计算出每一个item的新的`currentDegree`，然后更新他们的style，并且显示在屏幕上。有一点需要注意，因为我们一共维护了`shownItems`和`hiddenItems`两个变量，所以我们每一次滑动之后，都需要更新这两个变量中的元素。如果一个元素的`currentDegree`超出了一定的范围，就要把他放到`hiddenItems`中，并且设置`currentDegree`为0。如果有一个item需要显示在屏幕上，那就把他从`hiddenItems`中取出，放进`shownItems`中。

#### 滑动结束后的惯性行为

触碰结束后，系统会自动触发`touchend`方法。在该方法中主要就是来模拟一下惯性行为（需要牵涉到一部分的物理知识）。为了方便，我们暂时只考虑匀减速运动，匀减速运动的公式为

```
S = Vt - at ^ 2 / 2
```

计算出S后，就知道了column需要滚动的距离，之后的操作和`touchmove`中的类似。为了得到S，我们需要知道V（初速度），a（加速度）和t（时间间隔）。V和t都能够通过`speedCalculator`得到，a我们自己规定一下，就能够计算出一段时间间隔中column所滚动的距离了。

#### 滑动速度小于某值时自动滚动到最近的item

当匀减速运动的速度小于某一个值时，column会自动滑动到最近的一个item。这也是非常合理的，总不能在两个item之间停下对吧。

判断方法也非常简单，遍历所有的`shownItems`，然后选择其中离column中间最短的一个，计算出它到column中间位置的弧长，这部分就是最后需要自动滚动的长度。

```
/**
* @private
*/
Column.prototype.updateSelected_ = function() {
    var minDistance = goog.math.toRadians(Column.Const_.DEGREE_360) * Column.Const_.RADIUS;
    var minIndex = -1;
    goog.array.forEach(this.shownItems_, function(v, index) {
        var itemDegree = v['currentDegree'];
        var distance = goog.math.toRadians(Column.Const_.DEGREE_90 - itemDegree) * Column.Const_.RADIUS;
        if (Math.abs(distance) < Math.abs(minDistance)) {
            minDistance = distance;
            minIndex = index;
        }
    }, this);
    this.selectedId_ = this.shownItems_[minIndex]['id'];
    this.dispatchColumnEvent_(Column.EventType.VALUE_CHANGE, null);
    this.autoScrollToSelectedItem_(minDistance);
};
```

其中，`this.autoScrollToSelectedItem_(minDistance);`就是我们真正自动滚动的函数。这个函数中，由于我们知道总距离，规定了自动滑动的时间，因此我们能够算出其加速度。再根据初速度，加速度和时间间隔，来计算出每一个时间片所滑动的距离即可。也没有什么难度。

#### 规范化

什么是规范化呢？我们在实际计算滑动距离时间的时候，使用的都是double变量。这些变量在计算机中进行计算是有精度的损失的，因为计算机是没有分数的概念，所有的分数都会被转换成小数。例如，如果从数学理论上计算出的结果是150°，那么可能计算机给我们的结果就是149.99993°。这样的精度损失是会累加的，当我们进行数以千次的计算之后，可能最后的结果就变成了149°。1°的差距在屏幕上是很容易被发现的，尤其是这样的具有强烈对称性的滚轮组件。因此，每一次滑动结束后，我们都需要重新计算一下每一个item的位置，并且将他们移动到相应的位置上去。

```
/**
* @private
*/
Column.prototype.itemPositionNormalization_ = function() {
    var selectedIndex = this.getSelectedIndexInShownItems_();
    goog.array.forEach(this.shownItems_, function(v, index) {
        var $item = v['item'];
        var normalizedDegree = Column.Const_.DEGREE_90 - (selectedIndex - index) * Column.Const_.PER_DEGREE;
        v['currentDegree'] = normalizedDegree;
        this.setShownItemStyle_($item, normalizedDegree);
    }, this);
    goog.array.forEach(this.hiddenItems_, function(v) {
        var $item = v['item'];
        v['currentDegree'] = 0;
        this.setShownItemStyle_($item, 0);
    }, this);
};
```

#### 真的随时都能滚动吗？

我们需要思考一点：如果相邻的item的距离是30°，那么column上最多同时显示的item数量是5个。如果本身item就少于5个怎么办？

实际上现在手机的实现是这样的：如果item的数量过少，那么这个column是无法旋转到360°的。旋转到最上面或者最下面的时候，就不能在继续转下去了，同时松手就直接自动滚动到最近的那一个item。

我们在代码中模拟的方法是，column实际滚动的距离是手指滚动的距离乘上一个系数。如果column可以360°滚动，那么这个系数就是1。反之，当用户滚动到最上面或者最下面的item的时候，系数会逐渐减小最终趋近于0.01。这样从效果上来看，就是column无法被滑动了。

```
/**
* @private
* @param {Number} exceed
* @return {Number}
*/
Column.prototype.itemExceedMoveCoefficient_ = function(exceed) {
    var coefficient = 1;
    var exceedLimit = Column.Const_.RADIUS * goog.math.toRadians(Column.Const_.PER_DEGREE);
    if (exceed >= exceedLimit) {
        coefficient = 0.01;
    } else {
        coefficient = 1 - ((1 - 0.01) / exceedLimit * exceed);
    }
    return coefficient;
};
```

#### 公共接口

文章一开始提到过，data-picker是和其他component沟通的接口，在里面控制着data-picker-column的行为。column开放的接口大部分都是比较基础简单的，这里我就介绍一个可能会有一些实现难度的接口`setSelectedIndex`。

该接口在实现时，需要做几点：

1. 根据传入的index，重新计算`shownItems`和`hiddenItems`
2. 根据`shownItems`和`hiddenItems`来重新绘制column

需要注意的是，该函数并不会有动画发生，而是直接重新绘制整个column。

#### 性能

性能是data-picker一个非常重要的指标。针对性能已经做的优化有：

1. 设置item的style： `display: absolute`。这样在repaint和reflow的时候仅仅影响其column本身。
2. 对于`hiddenItems`中的元素，我们在滑动时不改变他们的style。

但是我个人认为还有一些其他的地方可以改进：

1. 滑动时一次性修改`shownItems`中所有元素的style。现在我们会遍历其中的元素，然后一个一个调用`setStyle`方法，这个方法会导致repaint和reflow。实际上可以在遍历完之后，讲相应的计算得到的数据存储起来，然后进行一次性的绘制。
2. 能否更好的建模。这个可能需要重构大部分的代码，但是我并不确定目前的实现是否是最合理的。把3D的模型转换成2D来处理需要大量的数学计算，能否直接建立成3D模型呢？


## 后文

这个data-picker应该是我加入WAP之后做的最有挑战性的工作了。并没有谁让我去做这个东西，只是觉得现在mobile的组件还是比较匮乏的，如果能够实现出来，应该对其他产品也能有所帮助。当然，对我自己的提升也是巨大的。
