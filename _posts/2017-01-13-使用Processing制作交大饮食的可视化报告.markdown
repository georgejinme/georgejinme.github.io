---
layout:     post
title:      "使用Processing制作交大饮食的可视化报告"
subtitle:   "学弟大作业系列"
date:       2017-01-13 21:30:00
author:     "George"
header-img: "img/post-bg-processing.jpg"
tags:
    - Processing
    - 技术
    - 可视化
---

## 序言

突然发现自己已经很久没有更新过博客了。主要原因是自己太闲了，大四上学期没有找什么实习，也没有课，在宿舍就是dota和日语的日子，所以就没有什么可以记录的啦。不过12月的时候，有个学弟让我帮他用Processing做一个可视化报告，我一口就答应了下来，因为有钱拿。

其实我之前没有用过Processing，所以也是半学半用的在写代码。令人欣慰的是，Processing出奇的简单，学弟的这个大作业，我用了两天就做完了，惬意惬意。

## 正文

### Processing介绍

我就不搬运什么网上的内容了，自己简单介绍一下Processing吧。

Processing是一种可视化框架，也可以理解成一个Java框架。其所用的语言就是Java，有自己完善的生命周期以及基础接口函数。用起来非常简单直接暴力，所有文件中的变量和函数都是通用的，不需要什么MVC，MVVM这样的架构，一个页面就是一个文件，清晰明了。

在我的理解中，Processing并不是写软件的框架，而仅仅是将数据用图像化的方式呈现出来。当然，PPT之类的软件可以做到这一点，但是从交互性和可控性来说，肯定没有Processing出色。

### Processing的生命周期

其实Processing的生命周期，好听点叫生命周期，难听点就是一个启动函数和一个刷新函数。怎么样，是不是很简单。

页面加载时，调用：

```
void setup(){}
```

页面刷新时，调用：

```
void draw(){}
```
这里有一点要注意，draw()函数在每一帧都会调用，而且不会清除上一帧的图像。即使是静止的页面，也可能是无数层相同图像的叠加。因此在draw()函数的第一行，我们通常会手动清除页面上的内容。

### 实现时的一些编码细节

这次我们做的是2014-2015秋季学期交大闵行校区食堂的报告（1%取样），包括消费人群性别统计，学历统计。也有所有食堂在不同月份的总共的消费额。同时，调查了人均的挑费次数和消费额度，以及在交大二餐中最受欢迎的几种菜系。

在使用Processing绘图的时候，可以设置一些模式，这些设置是可以被之后的设置所覆盖的。

```
imageMode(CORNER);
image(back, 20, 20);
```

这样我们就设置了image的绘制模式。如果在之后再次调用了imageMode但是传入了不同的参数，那么原来的CORNER模式会被覆盖掉。

此外，由于所有的函数和变量是在不同文件中共享的，因此我在第一次加载的时候就想所有的数据都处理完毕，这样在之后的使用过程会流畅很多。

所有使用到的变量如下：

```
//all the data we need
float[] genderPortions = new float[2];
float[] educationPortions = new float[3];
int[][] volumnInMonths = new int[5][7];
int[][][] volumnInTime = new int[5][7][17];
int[][] volumnInPerson = new int[198][3];
String[][] topName = new String[3][3];
int[][] topValue = new int[3][3];
```

### 成果

下面放出几张最终效果图。

![img](/img/in-post/Processing/1.png)

![img](/img/in-post/Processing/2.png)

![img](/img/in-post/Processing/3.png)


## 后记

虽然很久没有写代码了，但是每次接触到代码还是会很投入。接下来的目标是做好毕设，写好小程序外包，然后参加wwdc！



