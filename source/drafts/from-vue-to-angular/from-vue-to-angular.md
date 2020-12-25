---
title: 从VUE到Angular
thumbnail: ./cover.png
date: 2020-10-31T06:19:13.924Z
tags:
  - angular
  - vue
  - 前端框架
categories:
  - 技术
keywords:
  - angular
  - vue
  - 前端框架
---

[Angular](https://angular.io/)是三大前端框架中最“稳重”的一个，虽然在国内占有率不及Vue和React，但是非常值得我们我学习和使用。本文就从Vue的视角出发，对比学习Angular。

<!-- more -->

## 前言

vue是目前国内应用非常广泛的一个前端框架，具有轻量级、高性能、简单易学等优势。vue几乎是前端工程师必备技能，国内很多企业都在广泛使用vue来开发应用。相比之下Angular这个不怎么“受欢迎”的框架，似乎很多人都不知道有这么个存在，或者只是道听途说，没有去实际了解。

Angular是一个非常优秀的前端框架，可能是因为其学习曲线陡峭、打包代码体积以及性能等方面的因素，导致在国内的应用程度均低于react和vue。但是这并不代表angular不优秀，我们不应该满足于会使用vue和react，更应该花些时间去学习angular，探索一些未曾涉足的知识。同时为了让自己保持竞争力，也需要时刻保持学习。

本文也是我在学习和实践Angular的过程中，与Vue的类似特性进行的对比和总结。

## Angular简介

Angular是一个相对完整的前端框架，它包含了最基础的模板绑定和组件化，同时内置了路由、表单、HTTP客户端、动画、国际化等技术。我们可以使用Angular在不依赖于任何第三方库的情况下开发一个应用（理论上任何一个框架都可以）。它提供了完整的前端应用开发解决方案，Angular架构有`模块`, `组件`, `服务和依赖注入`三个核心概念。`模块`和`组件`系统让我们可以清晰的对应用进行组织和划分，而`依赖注入`系统，可以为应用提供局部或全局的共享状态、配置、类（也可称之为服务）。

和Vue一样，Angular也有一套强大的CLI工具[Angular CLI](https://cli.angular.io/)。我们可以通过指令`ng new my-project`来创建一个项目。下面总结中只包含开发应用必须的一些特性，对于非必需的如动画、国际化等暂时不包含在内。

## 共有特性

* [模板与绑定](#模板与绑定)
* [事件处理](#事件处理)
* [自定义组件](#自定义组件)
* [指令](#指令)
* [管道（过滤器）](#管道（过滤器）)
* [路由](#路由)
* [状态管理](#状态管理)

## Angular的特性

* [表单](#表单)
* [Http客户端](#Http客户端)

## 模板与绑定

Angular和Vue一样都是有模板的，实际上模板更有利于编译时对代码进行优化，像React那一类的jsx框架，需要把大量优化工作交给开发人员。这也是模板的一个优势。

回到正题，Angular的模板和Vue的模板语法上大同小异，都可以通过两个花括弧`{{variable}}`的语法进行绑定。