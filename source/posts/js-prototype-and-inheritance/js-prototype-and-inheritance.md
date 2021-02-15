---
title: 原型、原型链、继承
slug: js-prototype-and-inheritance
thumbnail: ./cover.jpg
date: 2018-02-01T06:42:08.775Z
tags:
  - 原型链
  - 继承
categories:
  - JS基础
  - 技术
keywords:
  - javascript
  - 原型
  - 继承
---

JavaScript 是一个基于原型链继承的面向对象编程语言。在继承的实现上和 Java 的等经典面向对象编程语言有很大的区别，在 ES6 中也加入了`class`关键字的支持，但是本质上就是一个语法糖。基于原型链的继承让 JavaScript 的继承实现更加灵活，这也是 JavaScript 必须掌握的基础知识。

<!-- more -->

## 原型

JavaScript 中每一个对象都有原型（也可以创建一个没有任何原型的对象），当使用`new`关键字实例化一个对象，该对象的原型也就指向了构造器的`prototype`属性。访问对象的属性的时候，首先会查找对象自身，如果该属性不存在，则会去查找对象的原型。这样，就可以将需要继承的属性放到原型对象中，让其所有子类都能够访问。

```javascript
function Book(name) {
  this.name = name
}
Book.prototype.getName = function() {
  return this.name
}
const book = new Book('JavaScript')
book.getName()
// JavaScript
```

### 显式原型和隐式原型

JavaScript 的原型分为显式原型和隐式原型，两者之间最直观的区别是：显式原型是函数（构造器）的原型属性`prototype`，而隐式原型是所有对象实例的原型属性`__proto__`，即`new Book().__proto__ === Book.prototype`。

## 原型链

当访问对象属性的时候，首先回去查找对象自身是否包含该属性，如果没有，则会去`__proto__`中查找，如果`__proto__`中也不存在，则会继续去`__proto__.__proto__`中查找，直到访问到最顶层`__proto__`也就是`Object.prototype`。这一个过程就是通过原型链进行访问，一层一层的原型串成了一条链。

`Object`的原型对象没有原型，`Object.prototype.__proto__`为 null。

## hasOwnProperty 和 in

如果要判断一个对象是否拥有某个属性的时候，可以使用`Object.prototype.hasOwnProperty`方法和`in`关键字。两者的区别在于，`hasOwnProperty`只会去查找对象自身是，不会去查找原型链，而`in`关键字会去查找原型链。

```javascript
const book = new Book('JavaScript')

book.hasOwnProperty('name') // true
book.hasOwnProperty('getName') // false
'getName' in book // true
```

## 继承

JavaScript 的继承是通过原型实现的，可以通过给原型设置特定的属性，让其实例能够访问到（继承）

```javascript
const Book = {
  getName() {
    return this.name
  },
}
function JsBook(name) {
  this.name = name
}
JsBook.prototype = Book

const book = new JsBook('JavaScript')
book.getName() // JavaScript
```

**注意：JavaScript 的继承是直接通过原型对象引用，并不是复制了原型对象**

下面是几种 JavaScript 继承的实现方式，不要纠结具体名字。

### 原型链继承

直接将父类的实例作为子类的原型

```javascript
function Book() {
  this.getName = function() {
    return this.name
  }
}

function JsBook(name) {
  this.name = name
}
JsBook.prototype = new Book()
const jsbook = new JsBook('JavaScript')
jsbook.getName() // JavaScript
jsbook.getAuthor() // Johnson
```

缺点：无法向父类构造函数传参，不能继承多个父类（也可以将多个父类对象合并来解决这个问题）

### 经典继承

假设我们的父类如下

```javascript
function Book(name) {
  this.name = name
  this.getName = function() {
    return this.name
  }
}
```

使用上面的继承方式会很难优雅的完成目标，因此可以使用下面的方式

```javascript
function Book(name) {
  this.name = name
  this.getName = function() {
    return this.name
  }
}
function JsBook(name, author) {
  // 在子类构造函数中执行父类给构造函数
  Book.call(this, ...arguments)
  this.author = author
  this.getAuthor = function() {
    return this.author
  }
}
const jsbook = new JsBook('JavaScript', 'Author')
jsbook.getName() // JavaScript
jsbook.getAuthor() // Johnson
```

缺点：所有属性都必须定义在构造函数中，不能继承父类的原型

如将父类改为

```javascript
function Book(name) {
  this.name = name
}
Book.prototype.getName = function() {
  return this.name
}
```

这种情况下使用经典继承无法继承`getName`方法。

### 组合式继承

结合原型链继承和经典继承

```javascript
function Book(name) {
  this.name = name
}
Book.prototype.getName = function() {
  return this.name
}
function JsBook(name, author) {
  // 在子类构造函数中执行父类给构造函数
  Book.call(this, ...arguments)
  this.author = author
  this.getAuthor = function() {
    return this.author
  }
}
JsBook.prototype = new Book() // 如果父类构造器有必传参数，则会出问题
JsBook.prototype.constructor = JsBook
const jsbook = new JsBook('JavaScript', 'Author')
jsbook.getName() // JavaScript
jsbook.getAuthor() // Johnson
```

### 寄生组合式继承

寄生组合式继承实际上是组合继承的改进版，由于组合继承中，子类原型直接指向了父类原型，并没有体现到继承的感觉。但是又不能指向父类实例，因为父类构造器可能有必传的参数，因此可以构造一个空的父类，来继承父类原型。

```javascript
function Book(name) {
  this.name = name
}
Book.prototype.getName = function() {
  return this.name
}
function JsBook(name, author) {
  // 在子类构造函数中执行父类给构造函数
  Book.call(this, ...arguments)
  this.author = author
  this.getAuthor = function() {
    return this.author
  }
}
function TempleSuper() {}
TempleSuper.prototype = Book.prototype
JsBook.prototype = new TempleSuper()
JsBook.prototype.constructor = JsBook
const jsbook = new JsBook('JavaScript', 'Author')
jsbook.getName() // JavaScript
jsbook.getAuthor() // Johnson
```

### 实例继承

实例继承是利用了构造函数返回值的特性来实现的继承，先创建父类实例，然后可以对其进行任意操作，再返回

```javascript
function Book(name) {
  this.name = name
}
Book.prototype.getName = function() {
  return this.name
}
function JsBook(name, author) {
  const instance = new Book(name)
  instance.author = author
  instance.getAuthor = function() {
    return this.author
  }
  return instance
}
const jsbook = new JsBook('JavaScript', 'Johnson')
jsbook.getName() // JavaScript
jsbook.getAuthor() // Johnson
```

### ES6 继承

ES6 继使用 class 关键字

```javascript
class Book {
  name = null
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
class JsBook {
  author = null
  constructor(name, author) {
    super(name)
    this.author = author
  }
  getAuthor() {
    return this.author
  }
}
const jsbook = new JsBook('JavaScript', 'Johnson')
jsbook.getName() // JavaScript
jsbook.getAuthor() // Johnson
```
