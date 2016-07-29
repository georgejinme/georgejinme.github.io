---
layout:     post
title:      "Objective-C中的消息"
subtitle:   "《Effective Objective-C 2.0》Message部分笔记"
date:       2016-03-22 12:00:00
author:     "George"
header-img: "img/post-bg-ios.jpg"
tags:
    - iOS
    - 技术
    - Objective-C
---

我们先来介绍一下OC中属性的用法。属性就是我们在实际工程中运用的最多的形式，以@property开头。用属性有什么好处呢？简单来说，属性有利于我们对内存的管理，系统会自动生成一套setter和getter来处理对属性的读取和写入操作，同时满足用户指定的strong，week等修饰符。当然，只要在属性头加上@dynamic，系统就不会自动去生成setter和getter。同时，系统会为每一个属性增加一个实例的变量，在属性名前加上下划线作为实例变量的名字。实际上，系统的setter和getter都是对其实例变量进行操作。我们可以理解成属性把实例变量封装了起来。需要说明的是，我们在一个对象/类中，最好直接访问实例变量。如果用的是属性，那么会经过setter和getter方法，这是通过OC的方法派发来完成的，所以效率会比较低，而实例变量会绕过内存管理的语义，在速度上有优势。

接下来说明一下对象等同性。在OC中，==比较的是指针，isEqual(或其类似方法)比较的是其内容。这个应该很好理解，我们应当使用isEqual。当然，我们可以对自己写的类写一个isEqual方法。

如果我们想临时给一个类增加一个变量，有什么好用的方法呢？OC给我们提供了一种叫做关联对象的方法。有如下函数：

```
void objc_setAssociatedObject(id object, void* key, id value, objc_AssociationPolicy policy)
id objc_getAssociatedObject(id object, void* key)
```

我们可以把关联对象想想成一个字典，需要存放时就增加一个键值对，取出增加的东西时也可以根据键进行选择。但是，此方法慎用，因为滥用的话我们会对一个对象失去可控性。

我们都知道，OC是一种动态语言，对于一些方法的调用，都是在运行时才去使用。这种方法叫做传递消息，而传递消息最关键的方法就是objc_msgSend。

```
id returnVal = objc_msgSend(someObject, @selector(msg:), parameter)
```

其中，someObject为消息的接受者(调用函数方)， msg为选择子(函数名)。对于每一个类，我们有一个快速的映射表，如果我们第一次发送一个消息成功后，我们会把匹配的方法名和方法实现放在这个表中作为缓存。那么如果我们找不到一个方法呢？这时候我们就会调用OC的消息转发，具体来说，有三步：

- 寻找是否有新增加的选择子。这个方法要求我们提前写好代码，等着运行的时候动态插在类里面。常见于@dynamic属性。寻找选择子时，会调用的方法为:

```
+ (Bool)resolveInstanceMethod: (SEL)selector
```

selector即为我们所没有找到的选择子。class_addMethod方法会为类增加一个方法实现，而这个实现的新方法名就是我们没有找到的选择子。

- 寻找备援接受者，这限于在对象内的其他对象

- 完整的消息转发，也就是改变调用目标。

后两个在开发中其实非常的少见。

接下来要介绍一个黑科技，叫做方法调配Method Swizzling。由于OC的方法调用是在运行时才确定的，因此我们可以在运行时替换方法的实现。
替换方法实现的方法为

```
void method_exchangeImplementations(Method m1, Method m2)
```

而根据方法名，得到其实现的方法为：

```
Method class_getInstanceMethod(Class aClass, SEL aSelector)
```

我们只需要根据方法名，取出其实现然后交换就好啦！

最后，介绍一下OC中的类。对于一个id类型的实例，其本质为一个struct：

```
typedef struct objc_object {
	Class isa;
} *id;
```

isa指向其所属的类。而对于一个类，其也为一个struct，保存了一些类的数据。在这个struct中，也有一个Class类型的isa，指向这个类的元类。这个元类保存了这个类的一些元数据。而这个struct的super_class指针指向了这个类的父类。那么我们需要查询一个id实例的类型时，可以用如下方法：

1. isMemberOfClass，查询实例是否为某个类

2. isKindOfClass，查询实例是否为一个类或其子类

当然，在比较类型时，我们可以用==运算符，因为每一个类在OC中都是单例的，只有一个类对象，也就没有地址不同这样的说法了。例如：

```
if ([object class] == [SomeClass class]) {
	...
}
```

关于OC的语言特性，其实还有很多，但是其消息和动态的特性是最为关键的。







