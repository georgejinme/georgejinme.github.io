---
layout:     post
title:      "Objective-C中的Block"
subtitle:   "《Objective-C高级编程 iOS与OS X多线程和内存管理》Block部分笔记"
date:       2016-02-28 12:00:00
author:     "George"
header-img: "img/post-bg-2015.jpg"
tags:
    - iOS
    - 技术
    - Objective-C
---

Block是什么呢？

其实就是C++中的Lambda表达式，js中的匿名函数，swift中的闭包等。

Block能截取自动变量值，本质上来说，Block就是一个struct，我们截取到的变量值会存储在这个struct中，这个存储是拷贝存储，也就是说，值是不会随着之后的代码而改变的。更重要的一点是，我们无法对这样捕获到的值进行修改，除非我们增加block修饰符：

```
__block id tmp;
```

这个block修饰符本质也是一个struct，其中有一个指向自己的指针forwarding，这个指针的作用稍后会说明。

作为一个struct，结合之前的ARC，我们知道会有一个retainCount，当一个Block被声明之后，是存在于栈上的，超出作用域就会废弃。但是，如果我们将Block复制到堆，就可以在之后的作用域中继续使用这个Block，而其block修饰符也会复制到堆中。复制的情况发生于以下：

- 调用Block的copy方法

- Block作为函数返回值返回时

- 将Block赋值给有strong修饰符id类型的类

- 在方法名中含有usingBlock的Cocoa框架方法

那么，forwarding到底是用来干嘛的呢？因为Block可以在栈和堆两个地方，所以无论是栈中的Block还是堆中的Block，其内部的forwarding指针会始终指向堆的Block。

还有的可能就是Block中的循环引用问题，但是这个问题真的不是问题，所以也就不多说了吧。


