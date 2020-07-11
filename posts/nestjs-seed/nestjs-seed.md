---
title: nestjs快速开发项目
categories:
  - 技术
tags:
  - javascript
  - typescript
  - nodejs
  - nestjs
thumbnail: ./cover.jpeg
color: '#111'
date: 2020-02-15 00:57:10
keywords:
  - nestjs快速开始项目
  - nestjs基础教程
---


整合了`nestjs`项目通用架构、常用功能集成的一个快速开发项目。

<!-- more -->

> 项目地址：https://github.com/YES-Lee/nest-seed-proj

## 集成功能

* [x] ORM: `sequelize`
* [x] API: `restful api`, `graphql`
* [x] 认证：`passport`
* [x] 文档：`swagger`
* [x] 安全：`helmet`
* [x] 日志：`nest-pino`

功能不断完善，将来或提供可插拔的开发体验

## 快速开始

```bash
# 拉取代码
git clone https://github.com/YES-Lee/nest-seed-proj.git

cd nest-seed-proj
yarn install # or npm intall
yarn start:dev # or npm run start:dev
```

## 项目结构

```bash
src
├─ config // 配置模块
├─ database // 数据库模块
│  └─ models // 存放sequelize/graphql数据库模型
├─ decorators // 自定义装饰器目录
├─ dto // restful 接口模型目录
├─ graphql // graphql 模块
├─ enums // 枚举目录
├─ filters // error filters
├─ interceptors // interceptors
├─ pipes // pipes
└─ modules // 业务逻辑模块目录，所有业务相关逻辑都放到该目录对应的模块
```

## 接口格式

```typescript
{
  error_code: number; // 错误码，只在异常时返回
  error_message: string; // 错误信息，只在异常时返回
  data: any;
  timestamp: any; // 时间戳
  path: string; // 请求路径
}
```

`dtc/support`中提供了`ApiResponse`类，提供了`success`, `error`两个静态方法。

## Config模块

`Config`模块是提供项目配置的模块，提供全局的项目配置，以依赖注入的方式使用配置项。`src/config`目录下，配置文件以`config.{env}.ts`命名，`config.default.ts`作为项目的默认配置，默认都会加载，其它配置会自动和`config.default.ts`合并。

### 使用Config

`Config`模块是全局模块，可以通过注入的方式使用，如在数据库模块中使用配置

```typescript{6-11}
{
  provide: 'SEQUELIZE',
  inject: [ConfigService, Logger],
  useFactory: (configService: ConfigService, logger: Logger) => {
    const sequelize = new Sequelize({
      dialect: configService.get('database.dialect'),
      host: configService.get('database.host'),
      port: configService.get('database.port'),
      username: configService.get('database.username'),
      password: configService.get('database.password'),
      database: configService.get('database.database'),
      // ...
    });
    return sequelize;
  }
}
```

## 日志

项目使用了`nest-pino`作为日志工具，提供了友好地`pretty`等功能，可以直接在`config`中配置日志级别、输出路径等。

```typescript
// main.module.ts
LoggerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      enabled: configService.get('log.enabled'),
      timestamp: configService.get('log.timestamp'),
      level: configService.get('log.level'),
      useLevelLabels: configService.get('log.useLevelLabels'),
      prettyPrint: configService.get('log.prettyPrint'),
      stream: pino.destination(configService.get('log.path')),
    };
  }
})
```

## 文档

项目集成了`swagger`文档工具，项目启动后访问`http://localhost:3001/swagger`访问，`swagger`用法参考[官方文档](https://docs.nestjs.com/recipes/swagger)。

## Graphql

`Graphql`模块使用`code first`方式开发，所有的接口类型定义在`src/graphql/schemas`目录下，`graphql/schemas/support`中也提供了全局统一的类型处理如分页接口等抽象类。

### 请求参数

请求参数分为两种类型，一种为`args`，另一种为`input`，区别在于两种方式在请求的时候传输的参数不同，`args`类型里的字段会展开为`resolver`方法的参数列表，而`input`类型定义的是`resolver`中的一个参数，如下面的列子：（[文档（https://typegraphql.ml/docs/faq.html#is-inputtype-different-from-argstype）](https://typegraphql.ml/docs/faq.html#is-inputtype-different-from-argstype)）

* `args`类型

  ```typescript
  @ArgsType()
  class UserListArgs {
    @Field(type => Int)
    page: number;
    @Field(type => Int)
    pageSize: number;
  }

  @Query()
  userList(@Args() args: UserListArgs) {}

  // 实际请求时传输的参数是

  {
    page: 1,
    pageSize: 10
  }

  ```

* `input`类型

  ```typescript
  @ArgsType()
    class UserListArgs {
      @Field(type => Int)
      page: number;
      @Field(type => Int)
      pageSize: number;
    }

    @Query()
    userList(@Args('userListArgs') args: UserListArgs) {}

    // 实际请求时传输的参数是

    {
      userListArgs: {
        page: 1,
        pageSize: 10
      }
    }

  ```

### 响应

响应类型统一为`ObjectType`，`support`中定义了分页接口统一返回格式`IPageResult`，由于`graphql`不具有泛型，因此在实现`IPageResult`时，必须显示指定`rows`的类型，如：

```typescript
@ObjectType({
  implements: IPageResult,
  description: '用户列表'
})
export class UserListResult implements IPageResult<User> {
  count: number;
  @Field(type => [User])
  rows: User[];
}
```

### Playground

启动项目后访问`http://localhost:3001/graphql`，`playground`是目前主流的`graphql`文档和测试工具。

## 相关技术

* [nodejs] [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
* [typescript] [https://www.tslang.cn/docs/home.html](https://www.tslang.cn/docs/home.html)
* [nestjs] [https://docs.nestjs.com/](https://docs.nestjs.com/)
* [express] [https://expressjs.com/](https://expressjs.com/)
* [sequelize] [https://sequelize.org/v5/](https://sequelize.org/v5/)
* [sequelize-typescript] [https://github.com/RobinBuschmann/sequelize-typescript](https://sequelize.org/v5/)
* [Passport.js] [http://www.passportjs.org/](http://www.passportjs.org/)
* [GraphQl] [https://graphql.cn/](https://graphql.cn/)
* [type-graphql] [https://typegraphql.ml/](https://typegraphql.ml/)
* [swagger-ui-express] [https://www.npmjs.com/package/swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [socket.io] [https://socket.io](https://socket.io)
