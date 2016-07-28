---
layout:     post
title:      "Objective-C语言相关"
subtitle:   "《Effective Objective-C 2.0》OC语言部分笔记"
date:       2016-03-08 12:00:00
author:     "George"
header-img: "img/post-bg-2015.jpg"
tags:
    - iOS
    - 技术
    - Objective-C
---

最近正好在看*《Effective Objective-C 2.0》*，简单记录一下每一章节的内容吧，也算是复习了一下。

那首先我们从语言本身开始说起。Objective-C是使用消息结构而非函数调用的，因此其运行时所执行的代码是由运行的环境来决定，而并非由编译器决定。这样的特性使得Objective-C非常之灵活，因为运行时确定，所以我们可以在写代码的时候展现一些黑科技，比如说运行时的代码替换，Swizzling等。相比而言Swift就更加严谨了，现在常见的一些运行时效果也是通过Objective-C的那一套来实现的。因为Objective-C的这样的特性，因此所有的Foundation中的对象都是保存在堆上而不是栈上，所以我们写代码的时候都使用指针，如下：

```
NSString *someString = @\"the string\";
```

当然，非Foundation对象，例如CGRect等，都是保存在栈上的。

本书给我们的第一条建议是“在类的头文件中尽量少引入其他头文件”。道理很简单，头文件a中引入了头文件b，相当于把头文件b的接口信息都暴露给了头文件a，这些信息是无用的。写代码的时候我们要确保其低耦合，因此这么做是非常值得的。那如果我们要使用b中的某个类呢？这时候可以用向前声明：

```
@class SomeClass;
```

这样我们可以直接使用类名，而把头文件的引入放在实现文件中了。除此之外，在头文件中引入其他头文件也容易产生循环引用，这与内存管理中的循环引用是类似的，不再重复了。

关于对象，我们需要多用字面量语法，就像我们平时在c++，swift中做的那样。不同的是，我们需要把字面量转换成一个Foundation对象，只需要在字面量前加上@就可以了。例如：

```
NSNumber *someNum = [NSNumber numberWithInt: 1];
NSNumber *someNum = @1;
```

上面两句话是等效的。所有的Foundation对象都可以这么定义，不过有几点需要注意：

1. 不能出现nil

2. 字典与数组中的元素/键值必须都是Foundation对象

3. 用字面量创建出的对象都是不可变的

此外，很多人喜欢用#define定义宏来表示某些常量，其实在OC中，完全可以用static const来取代。在编译器的处理上说，两者几乎没有区别，而常量增加了一个类型的信息，对于程序员更加友好。如果要定义一个全局的常量，可以使用extern关键字，头文件：

```
extern NSString *const someStr;
```

实现文件中：

```
NSString *const someStr = @\"fuck\";
```

最后，聊一下枚举。我们可以使用enum来定义一个枚举类型，枚举类型的默认值也可以指定，因此我们可以将不同的值进行或运算，产生某种选项的效果。但是OC给我们提供了两个更加优雅的宏来定义枚举和选项：

```
typedef NS_ENUM(NSUIngeter, ConnectionState) {
	Connected,
	NotConnected,
};
typedef NS_OPTION(NSUIngeter, PermittedDirection) {
	Left,
	Right,
	Up,
	Down,
};
```

从名字就可以看出这两个宏是表示什么意思了吧，宏的第一个参数表示底层的存储类型，第二个参数表示枚举/选项类型的名字。注意一点，我们在switch语句中，如果判断的是枚举类型，则不要加default，否则如果之后新增一种情况的话，很容易增加case语句，编译器也不会给我们任何的警告。
