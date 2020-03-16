---
title: CovComment-简单强大的评论插件
categories:
  - 技术
tags:
  - web components
  - 评论插件
thumbnail: ./cover.jpeg
color: '#111'
date: 2020-02-28 12:09:40
---


`CovComment`是一个基于`web compoennts`技术和`leancloud`引擎开发的免登录静态博客评论插件，`web compoennts`赋予插件极其简单的使用体验和集成。可以在任何类型的博客中轻松集成。

<!-- more -->

<!-- ![issues](https://img.shields.io/github/issues/YES-Lee/cov-comment) ![license](https://img.shields.io/github/license/YES-Lee/cov-comment) ![stars](https://img.shields.io/github/stars/YES-Lee/cov-comment) ![release](https://img.shields.io/github/v/release/YES-Lee/cov-comment) ![david](https://img.shields.io/david/YES-Lee/cov-comment) -->

<p><img src="https://img.shields.io/github/issues/YES-Lee/cov-comment"> <img src="https://img.shields.io/github/license/YES-Lee/cov-comment"> <img src="https://img.shields.io/github/stars/YES-Lee/cov-comment"> <img src="https://img.shields.io/github/v/release/YES-Lee/cov-comment"> <img src="https://img.shields.io/david/YES-Lee/cov-comment"></p>

> 仓库地址：[https://github.com/YES-Lee/cov-comment](https://github.com/YES-Lee/cov-comment)

## 特性

* 无需登录即可评论
* 集成简单，可集成任何类型网站
* 支持`markdown`
* 使用[gravatar](https://en.gravatar.com/)头像

## 使用

### 引入插件

* 下载[releases](https://github.com/YES-Lee/cov-comment/releases)中的`cov-comment-{version}.min.js`文件

* 在项目中使用`script`标签引入，如：`<script src="path/to/cov-comment-1.0.0.min.js"`

### 注册leancloud

进入[leancloud](https://leancloud.cn/)，注册账户登录后，创建应用，选择开发版。

创建成功之后进入应用设置面板，找到“应用keys”，复制里面的`appId`和`appKey`。

### 添加插件代码

在需要放置评论插件的地方，加入如下代码：

```html
<cov-comment
  appid="leancloud的appId"
  appkey="leancloud的appKey"
  pageSize="10"
  placeholder="来两句吧～"
></cov-comment>
```

## 插件参数

|名称|类型|是否必填|默认值|说明|
|---|---|---|---|---|
|appid|string|是||leancloud的应用appId|
|appKey|string|是||leancloud的应用appKey|
|pageSize|number|否|10|每页评论数量|
|placeholder|string|否|评论一下～|评论框占位符|

## License

The MIT License (MIT)

Copyright (c) 2020 Johnson
