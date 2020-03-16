---
title: C语言编译基础知识
categories:
  - 技术
thumbnail: ./cover.jpeg
color: '#111'
date: 2019-07-1 21:59:11
tags:
- c
---

## 编译过程

> 源代码->预处理->汇编->编译->链接->可执行程序

### 预编译

* 指令：`gcc -E`
* 产出：xxx.i（预编译文件）
* 工作：处理源代码中`#`开头的部分，将头文件拷贝至源码中，对`#define`宏定义进行文本替换，去掉注释

### 汇编

* 指令：`gcc -S`
* 产出：xxx.s（汇编源文件）
* 工作：将预编译文件翻译成汇编语言

### 编译

* 指令：`gcc -c`
* 产出：xxx.o（目标文件）
* 工作：将汇编代码翻译成机器语言（二进制）

### 链接

* 指令：`gcc -o`
* 产出：可执行文件（.out）
* 工作：将目标文件链接在一起合成可执行文件，如有多个源文件，需要指定链接文件

## 编译指令

> * 编译环境：macOS 10.14.5
> * 编译器：Apple LLVM version 10.0.1 (clang-1001.0.46.4), Target: x86_64-apple-darwin18.6.0

### 常用指令

* `gcc -I dirname`：搜索`dirname`目录下的头文件，在预编译阶段使用
* `gcc -L dirname`: 搜索`dirname`目录下的目标（库）文件，在链接阶段使用

源代码：

```C
// 头文件 ./lib/mymath.h
#ifndef _MYMATH_H
#define _MYMATH_H

int sum(int a, int b);

#endif
```

```C
// 实现文件 ./lib/mymath.c
#include "mymath.h"

int sum(int a, int b) {
  return a + b;
}

```

```C
// main.c

#include <stdio.h>
#include <stdlib.h>

#include "mymath.h"

int main() {
   printf("%d\n", sum(1,2));
  return 1;
}

```

1. 预处理：`gcc -I ./lib/ -E main.c -o main.i`，产生`main.i`预处理文件
2. 汇编：`gcc -S main.i`产生`main.s`汇编文件
3. 编译：`gcc -c main.s`产生`main.o`目标文件
4. 通过相同的步骤编译`mymath.c`得到`mymath.o`目标文件
5. 链接：`gcc main.o mymath.o -o main`产生可执行文件`main`

整个过程需要在预处理阶段指定头文件搜索路径，在链接阶段指定所有目标文件，所有步骤可以简化为一行gcc指令: `gcc -I ./lib main.c ./lib/mymath.c -o main`

> 当项目比较庞大，有很多源文件的时候，通过一行gcc指令编译项目是非常困难的，比如我们只修改了其中一个源文件，却要重新编译所有文件。又是还要根据特定情况来进行编译链接。这个时候，可以选用`make`工具进行管理。
