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
keywords:
  - graphql接口设计
  - graphql
  - graphql思想
  - 如何设计graphql接口
---

graphql 是一种用于 API 的查询语言。它提供了一套完整的和易于理解的 API 接口数据描述，给客户端权力去精准查询他们需要的数据，而不用再去实现其他更多的代码，使 API 接口开发变得更简单高效。

<!-- more -->

最近在用`Gatsby`开发一版静态博客，感觉和这个框架真是相见恨晚。因为这个框架使用到了 graphql 技术，所以我花了点时间去学习了一下，并且记录了一下学习和思考过程。

**本文主要讲解如何理解 graphql 以及基于关系型数据库设计 graphql 的思路。如果需要学习 graphql 基础知识，请移步[官方文档](https://graphql.js.cool/learn/)**

本文包含`Nestjs` + graphql 的示例项目：[https://github.com/YES-Lee/nestjs-graphql-starter](https://github.com/YES-Lee/nestjs-graphql-starter)

## 理解 graphql

graphql 是一个用于描述数据及其关系的查询语言，官方文档中描述了 graphql 的标准，具体的实现依靠第三方，目前主流的是`Apollo`提供的解决方案。

graphql 并不关心具体我们是怎么获取数据的，我们只需要提供获取数据的方法（resolver）以及如何组装数据（schema）。类似于 Java 开发过程中的接口设计模式，Graphql 定义了一套标准，我们按照标准实现接口。下面以用户-角色模型举例。

下面的代码定义了两个数据结构，与 JSON 类似，应该很容易理解。它描述了每个类型（type）的名称，以及其包含的属性。属性除了可以是基本类型外，也可以是数组、其他引用类型，从而建立起所有数据模型及相互的关系图。

```graphql
type Role {
  name: String
  note: String
}
type User {
  id: Int
  name: String
  gender: Int
  role: Role
}
```

上面代码用于描述`Role`和`User`的数据结构，那么我们具体要怎么使用这个东西呢？先从前端的角度来看，可以从官方文档学习到前端的基本使用，请求体中的数据描述和上面定义类型的代码有些许差别，比如我们要查询用户数据：

```graphql
query userInfo {
  user(id: Int) {
    id
    name
    gender
    role {
      name
      note
    }
  }
}
```

从上面的代码可以大概猜测出，如果我们不需要查询`role`数据是，只需要将其从请求中去掉

```graphql
query userInfo {
  user(id: Int) {
    id
    name
    gender
  }
}
```

当请求到达服务端时，graphql 会对请求体进行解析，当解析到`user`时，会执行我们定义好的获取`user`数据的逻辑，解析到`role`也是同样的道理。那么我们得在服务端定义好获取数据的逻辑，在 graphql 中叫做`resolver`。

之前的代码只定义了数据的结构，我们还需要为其创建一个`resolver`来获取对应的数据，类似于下面的代码

```javascript
function userResolver(id) {
  // ...
  // return User
}

function roleResolver(userId) {
  // ...
  // return Role
}
```

我们可以在 resolver 中执行 sql、http 请求、rpc 通信等任何能够获取到所需数据的逻辑。最终只需要按照预定义的结构将数据返回即可。

### Schema

前面用来定义不同类型数据结构的代码，称做`Schema`。它是 graphql 用来描述数据结构和关系的语言，在 Schema 的 type 定义中，可以使用`Int`, `Float`, `String`，`Boolean`, `ID`等 graphql 定义的标量类型（Scalar Types），也可以使用联合类型，引用另一个 type 等，如上面代码`User`中引用了`Role`。

### Resolver

`Resolver`是 GraphQL 中用来获取数据的方法。它不关心`Resolver`的具体实现，我们可以从数据库, HTTP 接口, 服务器资源等渠道获取数据。

graphql 会根据请求中声明的字段来执行 resolver，一定程度上可以减少查询次数。下面的代码中，会执行`UserResolver`，结束后再继续执行`RoleResolver`

```graphql
{
  User {
    name
    role
  }
}
```

如果我们把 role 字段去掉，那么服务器将不会再执行`RoleResolver`

```graphql
{
  User {
    name
  }
}
```

`UserResolver`执行结束后，就会将数据返回给前端。

可见 graphql 可以动态的执行数据查询，减少不必要的资源消耗。但是，凡事都有双面性，从另一个角度来思考，我们该如何控制 Resolver 的粒度？假设我们的 Resolver 是进行数据库查询，在 restful API 中，通常我们会使用一个关联查询同时获取到`User`和`Role`两个数据。但是在 graphql 中，我们为每个关联对象都创建一个 Resolver，当我们在查询一个用户列表，并且需要包含用户相关的角色时，就会发现一个问题，一次请求需要执行 N+1 次 sql 查询：1 次 UserResolver 获取 N 个用户列表，N 次查询获取每个用户的角色。这就是后面需要讲的 N+1 问题。

## graphql 存在的问题

### N+1 问题

`N+1`问题并不是只存在于 graphql 中，我们在写 sql 的时候，也会存在类似的情况，只不过我们会通过关联查询来避免这个问题。

为了解决 N+1 问题，graphql 官方提供了一个`dataloader`解决方案。dataloader 使用了缓存技术，同时也会合并多次相同（类似）的请求，将前面讲到的 N 次查询合并成一次。基本原理就是先执行查询列表的操作，然后将每条记录的关联字段作为参数列表，通过一次查询拿到所有的关联数据后，再合并到上级数据中。dataloader 是目前解决 N+1 问题比较有效的方法，在使用上也没有太多困难。

其次，我们可以通过控制 Resolver 的粒度来减少查询次数。比如前面的示例中，不写`roleResolver`，而是直接通过关联查询，用一次查询获取到`User`和`Role`。当然，这样做的话，无论前端是否查询`role`字段，服务都会进行关联查询，这里需要根据具体场景取舍。

### HTTP 缓存问题

由于 graphql 接口请求只有一个统一 endpoint，会导致我们无法使用`HTTP`缓存。目前买一些前端实现中，如 Apollo，提供了`inMemeryCache`解决方案，但在使用上体验不是很友好。

## 关系型数据库+graphql 接口设计

大概了解了 graphql 之后，我们来开始进行关系型数据库（Mysql）+ graphql 的 API 设计

### 编写 Schema

对于`schema`的设计，首先忽略表之间的关系，优先建立与数据表对应的模型。如`User`表和`Role`表，分别建立如下`schema`

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

其中需要注意的是，敏感数据不应该出现在敏感信息（用户密码等），即使 Resolver 的结果包含这些敏感信息，只要`schema`中没有包含，graphql 会自动过滤这些字段。

建立好所有的表对应的`schema`之后，再来考虑表之间的关系。

### 表关系的处理

graphql 对于关系的处理与 Restful API 有一些区别，在 Restful API 中，我们一般只在有需求的接口中建立关系查询，我们会针对接口做一些 SQL 优化，以求在一条 SQL 中快速查询出所需要的一切信息。

但是在 graphql 中，我们应当把所有表的关系描述为一个图结构，保证所有有关系（一对多或多对多）的表对应的 schema 都是连同的，这样我们在请求的时候，就能够从一个节点到达任意一个与之有关系的节点。

这也是我觉得 graphql 的一大魅力，当我们建立起完整的关系图后，前端可以自由的查询、组合数据。从理论上来讲，前端可以无限递归查询一组数据，如：小明->小明的朋友->小明的朋友的朋友->...，我们只需要选定好一个起点，便能到达任何地方。

### 一对多关系

一对多关系的建立很简单，我们只需要编写对应的 Resolver，然后在主表对应的 schema 中添加字段即可

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
function userResolver() {
  // ...
  // return User
}

function roleResolver(userId) {
  // ...
  // return Role
}
```

我们写了`roleResolver`之后，在`User`中添加了`role`字段，当请求该字段时，graphql 会去执行`roleResolver`来获取数据，下面来看多对多关系的处理。

### 多对多关系

通常，在 Restful API 中，我们会通过一条 SQL 关联查询，获取多对多的关联数据，但是在 graphql 中，如果只使用关联查询，显然是没有充分发挥其特性的。我们来看如下示例

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

对于上面的 schema，可以看到，在`User`中包含了`groups`和`userGroups`，同样的，在`Group`中也包含`users`和`userGroups`。而在`UserGroup`中同时包含了`User`和`Group`，于是，我们可以进行如下查询

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

可能有人会问，上面的操作无限循环了。没错，确实无限循环了，这并不是 bug，而是我前面提到的建立起了连同关系。对于不同的场景，我们可以进行不同方式查询，比如当我需要对用户的用户组进行搜索的时候，我可以在`groups`中添加一些参数

```graphql
{
  user(id: 1) {
    name
    groups(name: "admin") {
      id
      name
      note
      userGroups(userId: 1) {
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
  user(id: 1) {
    name
    userGroups(note: "新用户") {
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

对于无限循环问题无需担心，因为我们需要指定关联字段后，graphql 才会去执行对应的`Resolver`，要想出现死循环，除非我们的查询也无限循环的写下去，显然这是不可能的。

关系处理基本就讲这些内容，如有更好的想法欢迎骚扰。

## 结束语

本文是我在学习和使用 graphql 中的实践和思考，如有错误或建议欢迎联系我指正和探讨。另在在实践之前应当着重思考是否需要使用 graphql，因为 restful api 已经能满足大部分的场景需求，盲目的去使用 graphql 可能会带来一些意料之外的问题。
