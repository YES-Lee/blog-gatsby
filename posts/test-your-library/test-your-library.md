---
title: 给你的库集成单元测试和CI/CD
thumbnail: ./cover.jpg
date: 2020-09-02T01:37:18.897Z
tags:
  - javascript
  - 单元测试
  - CI/CD
categories:
  - 技术
keywords:
  - 单元测试
  - CI/CD
  - javascript
---

在开发库的时候，为保证代码的稳定性和健壮性，我们需要编写测试程序。同时也会使用CI/CD等工具优化工作流，提高开发效率。
<!-- more -->

[[tip | 提示]]
| 如果你还不清楚如何开发一个js库，请阅读[《typescript开发工具库入门》](/develop-a-library-based-typescript/)

对于一个成熟的JavaScript库，单元测试可以说是必要的。现有的JavaScript测试框架有很多，`karma`, `mocha`, `sinon`, `jasmine`, `jest`等，其中`jest`是Facebook开源的一个开箱即用的测试框架，使用起来非常简单方便。本文将为[《typescript开发工具库入门》](/develop-a-library-based-typescript/)中的示例库[natulu](https://github.com/YES-Lee/natulu)集成jest单元测试。

## 安装测试框架

我们的项目使用的是typescript，所以需要配置jest以支持typescript。幸运的是已经有提供了`ts-jest`库来解决这个事情，我们只需要简单的配置就能使用。

```bash
yarn add -D jest ts-jest @types/jest
```

## 创建配置文件

执行以下命令自动创建一个jest配置文件

```bash
yarn ts-jest config:init
```

生成的配置文件如下

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // 如果是浏览器环境，可以设置为jest-environment-jsdom或删除该配置项
};
```

也可以使用jest来创建配置文件

```bash
yarn jest --init
```

按照步骤选择合适的选项后，将`preset`设置为`ts-jest`

```javascript
module.exports = {
  coverageDirectory: "coverage", // 单元测试覆盖率生成目录
  preset: 'ts-jest',
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
};
```

然后我们在package.json的scripts中添加或修改`test`命令和`dev`命令

```json
{
  "scripts": {
    "dev": "jest --watch",
    "test": "jest --coverage"
  }
}
```

`dev`命令为开发模式下使用，其中的`--watch`选项可以监听文件变化，重新执行单元测试脚本。`test`命令中的`--coverage`选项为指定是否生成测试覆盖率报告。

## 使用GitHub Action集成CI/CD

我们在发布代码库的时候，需要进行手动编译、执行单元测试、发布。这个流程手动进行对于团队协作效率和质量有一定的影响，我们可以利用Github Action来进行持续集成，在提交代码的时候自动跑测试、编译等任务。

点击GitHub仓库首页中的Actions按钮后选择推荐的workflow中的Node.js

![Suggested Workflow](./workflow-1.png)

将配置文件修改为

```yml
name: Node.js CI

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm i
    - run: npm run build --if-present
    - run: npm test
```

然后点击右上角绿色按钮`Start commit`，便会执行第一次workflow，在之后master分支的push和merge pull request操作都会触发自动执行action任务。

[[tip | 扩展]]
| 可以自己尝试在action中自动发布npm包
