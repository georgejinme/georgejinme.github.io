---
layout:     post
title:      "Objective-C中的系统框架"
subtitle:   "《Effective Objective-C 2.0》系统框架部分笔记"
date:       2016-04-13 12:00:00
author:     "George"
header-img: "img/post-bg-2015.jpg"
tags:
    - iOS
    - 技术
    - Objective-C
---

iOS开发中有两个最重要的系统框架: Foundation和CoreFoundation，前者定义了OC对象，后者是C语言的API和数据结构。对于Foundation中的每一个OC对象，我们都有一个对应的CoreFoundation数据结构，使用__bridge可以进行无缝桥接：

__bridge: ARC仍然具备这个OC对象的所有权

__bridge_retained: ARC交出这个OC对象的所有权，我们需要手动Release

__bridge_transfer: ARC获得对象的所有权

在OC中，我们遍历一个Collection有以下几种方法：

1. 常规的for循环，和C语言一样

2. NSEnumerator来遍历：nextObject方法来返回枚举里的下个对象，最后一个对象则返回nil

3. 快速遍历：for...in

4. 块遍历：enumerateObjectsUsingBlock, enumerateKeysAndObjectsUsingBlock

块遍历可以提供对象，下标和指向是否终止的布尔值的指针。

在进行网络请求下载资源的时候，我们通常会把内容缓存下来。这时候应该采用NSCache。NSCache会在系统资源将要耗尽的时候，自动删减缓存。我们可以设置NSCache的对象的上线和总成本，来定义缓存删减其中对象的时机。

initialize和load方法是OC对象两个比较特殊的初始化方法。前者在第一次使用对象的时候调用，后者在APP启动的时候调用。需要注意的是，这两个方法都是阻塞的，因此我们不能放太多的操作在这两个方法之中。在load方法中我们不能调用其他类中的方法，因为初始化的顺序和时机是程序员不能确定的。