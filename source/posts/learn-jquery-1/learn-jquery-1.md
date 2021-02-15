---
title: jQuery源码学习-构造函数
categories:
  - 技术
color: '#111'
thumbnail: ./cover.jpg
date: 2019-10-23 17:42:56
tags:
  - jquery
  - 源码
  - javascript
  - 前端
keywords:
  - jquery源码学习
  - javascript
  - 深入理解构造函数
  - 继承
  - 原型链
---

jQuery 是一个快速、简洁的 JavaScript 框架，是继 Prototype 之后又一个优秀的 JavaScript 代码库（或 JavaScript 框架）。jQuery 设计的宗旨是“write Less，Do More”，即倡导写更少的代码，做更多的事情。它封装 JavaScript 常用的功能代码，提供一种简便的 JavaScript 设计模式，优化 HTML 文档操作、事件处理、动画设计和 Ajax 交互。

如此优秀的一个代码库，即便没有以前流行，也是有很多地方值得学习的。

<!-- more -->

_本文并非讲解`jquery`源码，而是记录从源码学习到的思想、技术等_

## 构造函数与继承

`JavaScript`是一门面向对象的编程语言，但是与传统面向对象语言不同的是，`JavaScript`没有提供`class`关键字，并且`JavaScript`的是基于原型继承的面向对象语言。那么，在`JavaScript`中编写类的过程，必定与传统的面向对象语言有所区别。

### 传统的类与继承

在`ES6`之前，都是通过创建构造函数的方式来创建一个类，比如：

```javascript
// Book类的原型
const BookPrototype = {
  getName() {
    return this.name
  },
}

// Book类
function Book(name, author, content) {
  this.name = name
  this.author = author
  this.content = content
}

// Book类继承自 BookPrototype
Book.prototype = BookPrototype

const book = new Book('金瓶梅', '佚名', '此处省略999999999字')
console.log(book.getName())
```

`BookPrototype`为`Book`类的原型（基类），使用`new`关键字创建的`Book`实例，都会包含`BookPrototype`里面的属性和方法。这里刚开始然我有些迷惑，参考经典的面向对象语言，基类应该也是一个类，这里却是一个对象字面量。首先，需要深刻明白一点: JavaScript 中，一切皆是对象。比如一个函数，我们可以给它加上任何的属性

```javascript
function bar() {}
bar.sayHi = function() {
  console.log('hi~')
}
bar.sayHi()
// hi~
```

其次，也是这里的迷惑点，**`JavaScript`是基于原型的继承**，意思就是，一个构造函数要继承某些属性方法，只需要将这些方法放到一个容器（对象）里，再赋值给`prototype`属性就可以在实例中访问。当我们需要创建静态方法/变量的时候，可以直接在构造函数上绑定（一切皆对象）。在 JavaScript 中，静态方法不会被继承。

```javascript
function Book(name, author, content) {
  this.name = name
  this.author = author
  this.content = content
}
Book.prototype.getName = function() {
  return this.name
}
// 静态方法
Book.foo = function() {
  console.log('foo')
}

Book.foo()
```

### ES6 中的类与继承

在`ES6`标准中，提出了`class`关键字，我们可以使用类似于`Java`创建类的语法来创建一个`JavaScript`类。

```javascript
class Book {
  constructor(title, author, content) {
    this.title = title
    this.author = author
    this.content = content
  }

  getName() {
    return this.title
  }
}

const book = new Book('金瓶梅', '佚名', '此处省略999999999字')
console.log(book.getName()) // 金瓶梅
```

我们可以直接通过`extends`关键字进行类的继承

```javascript
class StoryBook extends Book {
  constructor(title, author, content, storyType) {
    super(title, author, content)
    this.storyType = storyType
  }

  getStoryType() {
    return this.storyType
  }
}
book = new StoryBook('金瓶梅', '佚名', '此处省略999999999字', 'fairyTale')
book.getName() // 金瓶梅
book.getStoryType() // fairyTale
```

`ES6`中的`class`和`extends`实际上都是语法糖，根本上还是通过前一节中的方法来创建类和继承类。`JavaScript`基于原型的继承方式，赋予了更多的灵活性，`jQuery`的构造函数就是一个非常好的实例。

## jQuery 入口

从`jQuery`最基本的使用出发，会发现`jQuery`好像不是一个构造函数。确实是这样，当我们获取一个元素`const box = $('.box1')`，将 box 打印出来看看。

![](./1.png)

从打印结果可以看出几个东西：

- `box`对象是`jQuery.fn.init`的一个实例
- 改实例是一个包含类数组集合对象
- 改对象有一个`prevObject`属性，指向了两一个对象的引用

接下来就分别从这几点出发来分析`jQuery`源码。

### jQuery 构造函数

通常情况下，我们会以函数调用方式（\$('selector')）获取一个`jQuery`对象，同时，我们也可以使用`new $('selector')`来获取`jQuery`实例，我们先来思考这一个问题：如何同时满足函数调用和构造函数调用。实际上不需要太多思考就能想到如下代码：

```javascript
function myQuery(selector) {
  if (!(this instanceof myQuery)) {
    return new myQuery(selector)
  }
  // ...
  return this
}
```

但是我们发现`jQuery`并没有这样写，通过观察发现我们得到的是一个`jQuery.fn.init`的实例，下面就开始进入源码看看`jQuery.fn`和`jQuery.fn.init`是个什么东西。

```javascript
// 源码
jQuery = function(selector, context) {
  // The jQuery object is actually just the init constructor 'enhanced'
  // Need init if jQuery is called (just allow error to be thrown if not included)
  return new jQuery.fn.init(selector, context)
}
```

这是`jQuery`的大门，所有故事从这里开始，至此我们知道了`jQuery`构造函数实际上是个工厂函数，它返回了另一个类的实例。接下来继续看看`jQuery.fn`

```javascript
jQuery.fn = jQuery.prototype = {
  // The current version of jQuery being used
  jquery: version,

  constructor: jQuery,

  // The default length of a jQuery object is 0
  length: 0,
  // ...
}

init = jQuery.fn.init = function(selector, context, root) {
  // ...
  return this
}

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn
```

可以看出`jQuery.fn`就是`jQuery.prototype`的一个引用，而`init`是原型上的一个构造函数。里面有非常核心的一行代码`init.prototype = jQuery.fn`。这行代码将`jQuery`的原型共享给了`init`构造函数，`jQuery`和`init`的原型是同一个，这样`jQuery`对象就能访问`jQuery`原型上的方法和变量。

到这里基本清楚了`jQuery`创建实例到底是怎么一回事，至于和我们刚开始想的不一样，主要原因是更方便的进行对象的初始化操作。

## jQuery 插件

说到了原型顺便再看一下`jQuery`的插件，`jQuery`的插件开发基本上使用过`jQuery`的人都知道怎么操作，分为两种方式，一种方式是直接在`$.fn`上面添加方法，另一种是调用`$.fn.extend()`方法。前面这两种方法都是对`jQuery`的原型进行扩展，在其实例中才能使用，还有一个`$.extend()`方法，是用来扩展`jQuery`的静态方法。

```javascript
// 源码
jQuery.extend = jQuery.fn.extend = function() {}
```

源码中，`jQuery.extend`和`fn.extend`引用的是同一个方法，但是作用的上下文却不同。这里是非常巧妙的一个点，当我们直接使用`$.extend()`时添加的是静态方法，而是用来`$.fn.extend()`时添加的是实例方法。

## 小结

`jQuery`并没有非常高级的技术，内部原理都是非常简单的逻辑封装，但是整个内部架构设计的非常好，有许多值得学习的巧妙设计。

## 参考文章

- [https://www.cnblogs.com/SheilaSun/p/4779895.html](https://www.cnblogs.com/SheilaSun/p/4779895.html)
