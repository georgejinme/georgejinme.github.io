---
layout:     post
title:      "关于Grand Central Dispatch的一些知识"
subtitle:   "《Objective-C高级编程 iOS与OS X多线程和内存管理》GCD部分笔记"
date:       2016-03-01 12:00:00
author:     "George"
header-img: "img/post-bg-2015.jpg"
tags:
    - iOS
    - 技术
    - 多线程
---

GCD是什么，其实就是一堆控制线程的API，高度封装，而且性能优秀。

为什么要有多线程呢？实际上我们打开一个app之后，主线程也就是我们看到的线程只有一个，但是我们会有很多后台的操作，比如下载图片，计算一个很复杂的公式等，如果在主线程中运行，那么用户就不能执行其他的操作。所以一般而言主线程用来更新UI和响应事件，其他的高负荷运算放在另一个线程中。

GCD有两种queue，一种是serial dispatch queue，另外一种是concurrent dispatch queue。顾名思义，前者单线程，后者多线程。他们都是FIFO来执行任务的。我们有五个系统自带的dispatch queue，一个main dispatch queue，是serial的，四个global dispatch queue，是concurrent的，以优先级来区分。

简单讲讲各个API的作用吧：

- dispatchQueueCreate: 创建一个线程，此线程由程序员负责释放

- dispatchSetTargetQueue: 设置线程的优先级

- dispatchAfter: 在某个时间点的某个队列中执行某操作

- dispatchAsync: 异步的将某个操作放入某个队列中执行

- dispatchBarrierAsync: 完成此代码之前的操作再执行此代码，最后执行此代码之后的操作

- dispatchSync: 将某个操作放入某个队列中执行，队列销毁后才能继续执行

- dispatchApply: 按指定的次序将操作放入队列中执行

- dispatchSuspend: 暂停某队列

- dispatchResume: 恢复某队列

简单说说GCD的实现吧，执行线程上操作的步骤如下：

1. Block加入dispatch continuation

2. 调用pthreadWorkqueueAdditemUp，将队列和continuation信息传回

3. 调用pthreadWorkqueue，执行Block操作\n\n4. 如果队列中还有操作，则回到2

差不多就是这些，具体的也要看项目的需求。

