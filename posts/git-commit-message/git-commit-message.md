---
title: 规范化Git提交日志
categories:
  - 技术
thumbnail: ./cover.jpeg
color: '#111'
copyright: true
date: 2019-07-1 21:55:07
tags:
  - git
keywords:
  - git规范化
  - git commit message
  - git提交
---

把项目的`git commit message`规范化，对于项目的合作开发、发布等都有很大帮助。同时还能自动生成语义化的`CHANGE-LOG`。我们可以参考具体的标准规范化自己的提交，也可以使用辅助工具进行强制性规范。
<!-- more -->

文中使用到的工具清单：

* **commitizen**: 替代`git commit`
* **cz-conventional-changelog**: 符合`angular`规范的`adapter`
* **commitlint**: 校验`git message`
* **husky**: git hook工具

## [Angular团队规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

**message格式如下：**

```bash
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Message主要分为三个部分：

* 标题行: 必填, 描述主要修改类型和内容
* 主题内容: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等
* 页脚注释: 放 Breaking Changes 或 Closed Issues
分别由如下部分构成：
* type: commit 的类型
* feat: 新特性
* fix: 修改问题
* refactor: 代码重构
* docs: 文档修改
* style: 代码格式修改, 注意不是 css 修改
* test: 测试用例修改
* chore: 其他修改, 比如构建流程, 依赖管理.
* scope: commit 影响的范围, 比如: route, component, utils, build…
* subject: commit 的概述, 建议符合  50/72 formatting
* body: commit 具体修改内容, 可以分为多行, 建议符合 50/72 formatting
* footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

**git commit 模板**
我们通过修改git配置，指定message模板具体配置参考[https://www.git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-%E9%85%8D%E7%BD%AE-Git](https://www.git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-%E9%85%8D%E7%BD%AE-Git)

message模板：

```bash
# head: <type>(<scope>): <subject>
# - type: feat, fix, docs, style, refactor, test, chore
# - scope: can be empty (eg. if the change is a global or difficult to assign to a single component)
# - subject: start with verb (such as 'change'), 50-character line
#
# body: 72-character wrapped. This should answer:
# * Why was this change necessary?
# * How does it address the problem?
# * Are there any side effects?
#
# footer: 
# - Include a link to the ticket, if any.
# - BREAKING CHANGE
#
```

## 使用`Commitizen`

下面介绍使用工具规范化commit的详细步骤。

**提交工具**
使用`commitzen`工具替代`git commit`，它能通过简单的交互操作，将message从文本编辑方式转换成简单的交互操作

> 名称：`Commitizen`  
> 安装：npm install —save-dev commitizen  
> 仓库地址：https://github.com/commitizen/cz-cli  

**Adapter**
Adapter是具体的规范标准配置，我们可以使用一个符合angular规范的adapter：[cz-conventional-changelog](https://link.juejin.im/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2Fcommitizen%2Fcz-conventional-changelog)，也可以自定义自己的规范

> 名称：`cz-conventional-changelog`  
> 安装：npm install —save-dev cz-conventional-changelog  
> 仓库地址：https://link.juejin.im/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2Fcommitizen%2Fcz-conventional-changelog  

**配置**
安装好`commitzen`和`cz-conventional-changelog`之后，还需要添加一些配置：

package.json中添加：

```json
"scripts": {
  "commit": "git-cz"
},
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
}
```

在配置中，我们需要指定Adapter，否则在执行`git-cz`的时候，不会出现选择的交互界面，而是直接弹出vim编辑器编辑message。

配置好之后使用`npm run commit`替代`git commit`提交。

## 对提交进行验证

`commitzen`只是帮助我们规范化`commit message`，但是如果没有按规范提交，也是会成功的。所以我们需要一个工具进行检测，不安规范的提交全部终止。

我们可以使用`commitlint`对提交进行验证，同时配合`git hook`，可以在提交的时候验证，验证不通过会自动终止提交操作。同时，我们需要一份校验的配置，告诉commitlint校验规则，我们使用符合angular规范的一份配置： [@commitlint/config-conventional](https://link.juejin.im/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fgithub.com%2Fmarionebl%2Fcommitlint%2Ftree%2Fmaster%2F%2540commitlint%2Fconfig-conventional) 。`git hook`可以使用`Husky`来进行边便捷的配置。

安装插件： `npm install --save-dev commitlint @commitlint/config-conventional husky`

配置：
在项目目录添加配置文件`commitlint.config.js`，配置内容如下：

```javascript
module.exports = {
  extends: [
  '@commitlint/config-conventional'
  ]
}
```

然后在`package.json`中添加配置：

```json
"husky": {
  "hooks": {
  "commit-msg": "commitlint -e $GIT_PARAMS"
  }
}
```

配置完成后即可。

## 生成CHANGELOG

我们可以使用[standard-version](https://github.com/conventional-changelog/standard-version)来自动生成CHANGELOG，使用方法很简单，安装插件后，执行`npx standard-version`即可在项目目录下生成`CHANGELOG.md`文件。

参考文章：

1. [优雅的提交你的 Git Commit Message](https://juejin.im/post/5afc5242f265da0b7f44bee4)
2. [Git - 配置 Git](https://www.git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-%E9%85%8D%E7%BD%AE-Git)
