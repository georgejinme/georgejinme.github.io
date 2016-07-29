---
layout:     post
title:      "Objective-C中的协议和分类"
subtitle:   "《Effective Objective-C 2.0》协议和分类部分笔记"
date:       2016-04-04 12:00:00
author:     "George"
header-img: "img/post-bg-ios.jpg"
tags:
    - iOS
    - 技术
    - Objective-C
---

delegate也是iOS编程中的一个重点，他定义了一套接口，如果一个对象想接受另一个对象的委托，则需要遵从此接口，以便成为其委托对象。这个委托的意思，实际上就是把函数的实现写在另一个类中，这个函数可以使用那个类的方法和数据成员。看上去就像是这个类帮别人做了写事情，成为委托的对象。委托的协议用@protocal来定义，在存放委托对象的类中，可以这么写：

```
@property (nonatomic, weak) id <SomeProtocal> delegate;
```

我们必须用weak修饰符来避免循环引用。上述代码的id指向遵循这个协议的类，表示我们不关心这个类具体是什么，我们只注意到这个类遵循了这个协议。当然，对于可选的方法，我们在前面加上@optional即可。

下面来说说分类这个东西。OC中的分类对应swift就是其extension。我们可以通过分类把类实现代码按照逻辑分散到几个文件中:

```
@interface SomeClass (AboutSomething)
...
@end
```

分类中的方法是直接添加在类里面的，就好比是这个类的固有方法，因此会有覆写的可能性。需要注意的一点是，我们不要在分类中声明属性，因为在分类中是不能添加实例变量的。那不代表不能声明属性，通过@dynamic关键字，或者关联对象，都能够解决这个问题。但是保险起见，还是不要声明属性。当然，不是说所有的分类都不能，有一种分类叫做class-continuation就是例外，他有如下的特点：

- 必须定义在其所接续的那个类的实现文件里

- 唯一能够声明实例变量的分类

- 分类没有名字

- 分类中的所有属性和方法都是隐藏的，只能在本类中使用

- 可以修改某属性的读写性，只读的属性可以在此分类中扩展为可读写

比如这样：

```
@interface SomeClass()
...
@end
```

当然，协议也可以隐藏在class-continuation中：

```
@interface SomeClass() <SomeProtocal>
...
@end
```
