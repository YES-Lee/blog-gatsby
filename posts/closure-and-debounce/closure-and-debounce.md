---
title: 闭包与防抖函数
date: 2019-09-18 20:12:44
categories:
- 技术
tags:
- javascript
- 前端

thumbnail: ./cover.jpg
# 设置缩略图底色
color: '#111'
keywords:
  - javascript闭包
  - javascript
  - 闭包的应用
  - 防抖函数
---

最近在开发过程中频繁用到防抖函数（提交表单、页面滚动等），比较low的解决方案一般都是定义一个全局变量作为控制函数执行的锁，这样的确能解决问题，但是一点都不优雅。于是仔细琢磨了一下防抖函数，其中涉及到了闭包，顺便复习一下。
<!-- more -->

## 什么是闭包

简单的讲闭包就是在函数里面定义的函数。在开发过程中我们经常会写。

```javascript
function a () {
  let i = 0;
  console.log(i);
  function b () {
    i++;
    console.log(i);
  }
  return b;
}

let fb = a();
fb();
// 0
// 1
```

上面代码中，函数b就是一个闭包。根据执行结果我们可以验证闭包的一个特性，即闭包中引用了父级作用域中的变量，当父级函数执行完毕之后，被引用的内部变量不会被回收。很容易理解，将上面的执行过程拆开来看：

```javascript
let fb = a();
// a函数中声明变量i = 0，并且将i的值打印出来
// a函数中声明b函数，在b函数中将i的值增加1
// 将b函数返回，a函数执行完毕
fb();
// i的值增加1，并将其打印出来
```

神奇的地方就在与，我们通过将b函数返回，实现了在a函数执行完毕后对其内部的局部变量进行访问和修改。因此闭包也被看作是连接一个函数内部和外部的桥梁。

## 防抖函数

从另一个角度思考闭包，可以看作父级函数为闭包创建了一个临时的作用域，其中的变量可以和外部隔绝。这样的话我们就可以把一些在特定位置才会使用的全局变量通过闭包的方式使用，使代码更加优雅。

以防抖函数为例，前面提到的解决方案是定义一个全局变量来控制函数的执行：

```javascript
let lock = false;

function submit () {
  if (!lock) {
    lock = true;
    setTimeout(() => {
      console.log('提交完毕');
      lock = false;
    }, 100); // 100毫秒内不允许再次执行
  }
}
function invoke () {
  let i = 0;
  const timer = setInterval(() => {
    if (i > 1) {
      clearInterval(timer);
      return
    }
    submit();
    i++;
  }, 60);
}

invoke();
// 提交完毕
```

上面的代码使用了一个全局变量lock来控制函数是否可以执行，当异步请求已经发起尚未结束的时候，一般是不允许再次请求的，否则有可能会造成数据混乱。上面的代码有个很大的缺点就是存在全局变量污染，同时也会使得代码不易于维护。而我们可以写一个防抖函数，将提交函数进行一次封装，得到一个可控制函数执行的闭包：

```javascript
function debounce (func, delay) {
  let timer;
  let lock = false;
  return function (params) {
    if (lock) {
      // 触发间隔未结束，重新设定计时器
      clearTimeout(timer);
      timer = setTimeout(() => {
        lock = false;
        clearTimeout(timer);
        timer = null;
      }, delay);
    } else {
      lock = true;
      func(params);
    }
  };
}
```

在上面的防抖函数中，加了一个限制，即每当计时未结束的时候有新的执行到来，就刷新计时器，这样就可以控制函数在一定频率的触发内只执行一次。
使用测试

```javascript
function submit () {
  console.log('提交完毕');
}

const debouncedSubmit = debounce(submit, 100);

function invoke () {
  let i = 0;
  const timer = setInterval(() => {
    if (i > 1) {
      clearInterval(timer);
      return
    }
    debouncedSubmit();
    i++;
  }, 100);
}

invoke();
// 提交完毕
```

有时候，我们需要执行最后一次触发，而不是第一次，将上面的函数进行如下修改，可支持配置是否立即执行第一次触发

```javascript
function debounce (func, delay, immediate = true) {
  let timer;
  let lock = !immediate;
  return function (params) {
    if (lock) {
      // 触发间隔未结束，重新设定计时器
      clearTimeout(timer);
      timer = setTimeout(() => {
        lock = false;
        clearTimeout(timer);
        timer = null;
        if (!immediate) {
          func(params);
        }
      }, delay);
    } else {
      lock = true;
      func(params);
    }
  };
}
```

## 思考

上面的防抖函数只能支持同步函数使用，如果要在异步函数中使用还需要对异步函数进行封装，修改等。所以我们还可以继续改进防抖函数，让它支持异步函数。还有上面的防抖函数不能接收到函数的返回值，我们也可以通过返回`promise`来返回函数返回值，或者是使用更好的实现方法。
