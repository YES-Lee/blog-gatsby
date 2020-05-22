---
title: GraphQL 接口设计
categories:
  - 技术
thumbnail: ./cover.jpg
color: '#111'
copyright: true
date: 2020-03-25 17:16:00
tags:
- graphql
- 后端
- nodejs
---

`GraphQL` 是一种为 API 接口和查询已有数据运行时环境的查询语言。它提供了一套完整的和易于理解的 API 接口数据描述，给客户端权力去精准查询他们需要的数据，而不用再去实现其他更多的代码，使 API 接口开发变得更简单高效，支持强大的开发者工具。

<!-- more -->

**本文主要讲解如何理解`GraphQL`以及基于关系型数据库设计`GraphQL`的思路。如果需要学习`GraphQL`基础知识，请移步[官方文档](https://graphql.js.cool/learn/)**

本文包含`Nestjs` + `GraphQL`的示例项目：[https://github.com/YES-Lee/nestjs-graphql-starter](https://github.com/YES-Lee/nestjs-graphql-starter)

## 理解`GraphQL`

`GraphQL`是一个用于描述数据及其关系的查询语言，官方文档中描述了`GraphQL`的标准，具体的实现可以使用`Apollo`。

`GraphQL`并不关心具体我们是怎么获取数据的，我们只需要提供获取数据的方法（resolver）以及如何组装数据（schema）。比如我们要获取如下数据：

```graphql
type Role {
  name: String
  note: String
}
type User {
  name: String
  gender: Int
  role: Role
}
```

上面代码描述了`Role`和`User`的数据结构以及两者的关系，那么我们可以分别写如下`resolver`去获取这些数据:

```javascript
function userResolver () {
  // ...
  // return User
}

function roleResolver (userId) {
  // ...
  // return Role
}
```

### Schema

`Schema`是`GraphQL`用来描述数据结构以及数据间关系的语言，在`Schema`的`type`定义中，可以使用`GraphQL`中的基本类型，也可以引用另一个`type`。如上面代码`User`中引用了`Role`。

### Resolver

`Resolver`是`GraphQL`中用来获取数据的方法。`GraphQL`不关心`Resolver`的具体实现，我们可以从数据库, HTTP接口, 服务器资源等渠道获取数据。

`GraphQL`会根据前端发送的请求决定是否执行某个`Resolver`，如前面的代码中，如果用户的查询如下：

```graphql
{
  User {
    name
    role
  }
}
```

此时，查询请求中包含了`role`字段，`GraphQL`将会去执行`roleResolver`方法获取角色数据。如果查询是：

```graphql
{
  User {
    name
  }
}
```

此时，`GraphQL`不回去调用`roleResolver`方法获取角色。

## `GraphQL`存在的问题

### N+1问题

前面讲到了`Resolver`的执行时机，会存在一个性能问题，当我们请求的数据是长度为N的`User`的列表，其中每一个都包含了`role`，`GraphQL`就会进行一次`UserList`的查询，以及针对每个`User`的`Role`查询，总共会进行N+1次查询。这个问题叫做`N+1`问题。

为了解决`N+1`问题，`GraphQL`官方提供了一个`dataloader`的库来解决这个问题。`dataloader`的解决方案是使用缓存和合并多次相同（类似）的请求。其次，我们可以通过控制`Resolver`的粒度来减少查询次数。比如前面的示例中，不写`roleResolver`，而是直接通过关联查询，用一次查询获取到`User`和`Role`。当然，这样做的话，无论前端是否查询`role`字段，服务都会进行关联查询，这里需要根据具体场景取舍。

### HTTP缓存问题

由于`GraphQL`接口请求只有一个统一的入口，会导致我们无法使用`HTTP`缓存。目前一些前端框架如`Apollo`，实现了`inMemeryCache`，而个人觉得并不是很好用。

## 关系型数据库`GraphQL`接口设计

讲完了`GraphQL`的一些概念和存在的问题，如果读者还不能对`GraphQL`有一个清晰的认知，那可能是我写的还不够通俗易懂，可以通过我的联系方式进行交流。

### 编写Schema

对于`schema`的设计，首先忽略表之间的关系，之间建立起于数据表的对应模型。如`User`表和`Role`表，分别建立如下`schema`

```graphql
type User {
  name: String
  gender: Int
  # password: String // 敏感信息不应该出现
}
type Role {
  name: String
  note: String
}
```

其中需要注意的是，敏感数据不应该出现在敏感信息（用户密码等），即使`Resolver`的结果包含这些敏感信息，只要`schema`中没有包含，`GraphQL`会自动过滤这些字段。

建立好所有的表对应的`schema`之后，再来考虑表之间的关系。

### 表关系的处理

`GraphQL`对于关系的处理于`Restful API`有一些区别，在`Restful API`中，我们一般只在有需求的接口中建立关系查询，我们会针对接口做一些`SQL`优化，以求在一条`SQL`中能够查询出所需要的一切信息。

但是在`GraphQL`中，我们应当把所有表的关系描述为一个图结构，保证所有有关系（一对多或多对多）的表对应的`schema`都是连同的，这样我们在请求的时候，才能够从一个表到达任意一个与之有关系的表。

这里就要使用到前文提到的`Resolver`特性，同时也会存在前文提到的`N+1`问题。

### 一对多关系

一对多关系的建立很简单，我们只需要编写对应的`Resolver`，然后在主表的`schema`中添加字段即可

```graphql
type Role {
  name: String
  note: String
}
type User {
  name: String
  gender: Int
  role: Role
}
```

```javascript
function userResolver () {
  // ...
  // return User
}

function roleResolver (userId) {
  // ...
  // return Role
}
```

我们写了`roleResolver`之后，在`User`中添加了`role`字段，当请求该字段时，`GraphQL`会去执行`roleResolver`来获取数据，下面来看多对多关系的处理。

### 多对多关系

通常，在`Restful API`中，我们会通过一条`SQL`关联查询，获取多对多的关联数据，但是在`GraphQL`中，如果只使用关联查询，显然是没有充分发挥期特性的。我们来看如下示例

```graphql
# schema
type User {
  name: String
  gender: Int
  role: Role
  groups: [Group] # 用户组
  userGroups: [UserGroups] # 用户组关系表
}

type Group {
  id: Int
  name: String
  note: String
  users: [User]
  userGroups: [UserGroups]
}

type UserGroup {
  id: Int
  userId: Int
  groupId: Int
  note: String # 关系表中存储一些关联信息
  user: User
  group: Group
}
```

对于上面的`schema`，可以看到，在`User`中包含了`groups`和`userGroups`，同样的，在`Group`中也包含`users`和`userGroups`。而在`UserGroup`中同时包含了`User`和`Group`，于是，我们可以进行如下查询

```graphql
{
  user (id: 1) {
    name
    groups {
      id
      name
      note
      userGroups {
        id
        userId
        groupId
        note
        user {
          name
          groups {
            # ...
          }
        }
      }
    }
  }
}
```

可能有人会问，上面的操作无限循环了。没错，确实无限循环了，这并不是bug，而是我前面提到的建立起了连同关系。对于不同的场景，我们可以进行不同方式查询，比如当我需要对用户的用户组进行搜索的时候，我可以在`groups`中添加一些参数

```graphql
{
  user (id: 1) {
    name
    groups (name: "admin") {
      id
      name
      note
      userGroups (userId: 1) {
        id
        note
      }
    }
  }
}
```

上面的查询，如果我们只想对`UserGroup`关系表中的额外信息进行搜索时，上面的查询方式可见是行不通的。那么我们可以从另一个方向进行查询

```graphql
{
  user (id: 1) {
    name
    userGroups (note: "新用户") {
      id
      userId
      groupId
      note
      group {
        id
        name
        note
      }
    }
  }
}
```

可以发现，通过建立了对应关系的连通图之后，我们可以从一个表查询到任意一个与之关系的表，同时可以无限嵌套查询。

对于无限循环问题无需担心，因为我们需要指定关联字段后，`GraphQL`才会去执行对应的`Resolver`，要想出现死循环，除非我们的查询也无限循环的写下去，显然这是不可能的。

## 结束语

本文也是我在学习和使用`GraphQL`中的经验和思考，如有错误或意见欢迎联系我指正和探讨。
