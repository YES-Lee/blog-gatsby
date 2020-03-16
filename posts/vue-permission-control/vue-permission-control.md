---
title: vue权限控制
thumbnail: ./cover.jpeg
color: '#111'
date: 2019-6-24 21:16:25
categories:
- 技术
tags:
- javascript
- 前端
- vue
- vue-router
---

在SPA（单页面应用）中，前端需要根据用户的权限来控制用户菜单以及路由表，`vue-router`提供了几个路由生命周期钩子，叫做`路由守卫`，我们可以利用路由守卫在路由以及路由元信息进行权限控制，同时搭配vuex将会更美味，**文末有完整示例地址**。
<!-- more -->

## 登录权限

登录验证是最常见的一种路由权限验证，使用`vuex` + 路由守卫可以实现比较清晰流畅的鉴权流，能轻松应对页面刷新、清除缓存等场景。

### 路由元信息

`vue-router`在构建路由时提供了元信息`meta`配置接口，我们可以在元信息中添加路由对应的权限，然后在路由守卫中检查相关权限，控制其路由跳转。

```javascript
// router.js
// 路由表元信息
[
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    meta: {
      title: 'Home',
      icon: 'home'
    }
  },
  {
    path: '/userCenter',
    meta: {
      title: '个人中心',
      requireAuth: true // 在需要登录的路由的meta中添加响应的权限标识
    }
  }
]

// 在守卫中访问元信息
function gaurd (to, from, next) {
  // to.matched.some(record => record.meta.requireAuth)
  // 可在此处
}
```

### vuex

一般的，用户登录后会在本地持久化存储用户的认证信息，本文以`JWT`的`token`为例。将用户的token持久化到localStorage里，而用户信息则存在内存(store)中。这样可以在vuex中存储一个标记用户登录状态的属性`auth`，方便用语权限控制。

```javascript
// store.js
{
  state: {
    token: window.localStorage.getItem('token'),
    auth: false,
    userInfo: {}
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    },
    clearToken (state) {
      state.token = ''
      window.localStorage.setItem('token', '')
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      state.auth = true // 获取到用户信息的同时将auth标记为true，当然也可以直接判断userInfo
    }
  },
  actions: {
    async getUserInfo (ctx, token) {
      return fetchUserInfo(token).then(response => {
        if (response.code === 200) {
          ctx.commit('setUserInfo', response.data)
        }
        return response
      })
    },
    async login (ctx, account) {
      return login(account).then(response => {
        if (response.code === 200) {
          ctx.commit('setUserInfo', response.data.userInfo)
          ctx.commit('setToken', response.data.token)
        }
      })
    }
  }
}
```

### 路由守卫

写好路由表和vuex之后，给所有路由设置一个全局守卫，在进入路由之前进行权限检查，并导航到对应的路由。

```javascript
// router.js
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) { // 检查是否需要登录权限
    if (!store.state.auth) { // 检查是否已登录
      if (store.state.token) { // 未登录，但是有token，获取用户信息
        try {
          const data = await store.dispatch('getUserInfo', store.state.token)
          if (data.code === 200) {
            next()
          } else {
            window.alert('请登录')
            store.commit('clearToken')
            next({ name: 'Login' })
          }
        } catch (err) {
          window.alert('请登录')
          store.commit('clearToken')
          next({ name: 'Login' })
        }
      } else {
        window.alert('请登录')
        next({ name: 'Login' })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})
```

### 后记

上述的方法是基于`jwt`认证方式，本地不持久化用户信息，只保存`token`，当用户刷新或者重新打开网页时，进入需要登录的页面都会尝试去请求用户信息，该操作在整个访问过程中只进行一次，直到刷新或者重新打开，对于应用后期的开发维护和扩展支持都很好。

## 动态加载菜单和路由

有时候为了安全，我们需要根据用户权限或者是用户属性去动态的添加菜单和路由表，可以实现对用户的功能进行定制。`vue-router`提供了`addRoutes()`方法，可以动态注册路由，**需要注意的是，动态添加路由是在路由表中`push`路由，由于路由是按顺序匹配的，因此需要将诸如`404`页面这样的路由放在动态添加的最后**。

### 路由元信息

```javascript
// store.js
// 将需要动态注册的路由提取到vuex中
const dynamicRoutes = [
  {
    path: '/manage',
    name: 'Manage',
    meta: {
      requireAuth: true
    },
    component: () => import('./views/Manage')
  },
  {
    path: '/userCenter',
    name: 'UserCenter',
    meta: {
      requireAuth: true
    },
    component: () => import('./views/UserCenter')
  }
]
```

### vuex

在`vuex`中添加`userRoutes`数组用于存储用户的定制菜单。在`setUserInfo`中根据后端返回的菜单生成用户的路由表。

```javascript
// store.js
setUserInfo (state, userInfo) {
  state.userInfo = userInfo
  state.auth = true // 获取到用户信息的同时将auth标记为true，当然也可以直接判断userInfo
  // 生成用户路由表
  state.userRoutes = dynamicRoutes.filter(route => {
    return userInfo.menus.some(menu => menu.name === route.name)
  })
  router.addRoutes(state.userRoutes) // 注册路由
}
```

### 修改菜单渲染

```html
// App.vue
<div id="nav">
  <router-link to="/">主页</router-link>|
  <router-link to="/login">登录</router-link>
  <template v-for="(menu, index) of $store.state.userInfo.menus">
    |<router-link :to="{ name: menu.name }" :key="index">{{menu.title}}</router-link>
  </template>
</div>
```

### 结束语

上述为前端控制菜单和路由权限的两种实现思路，经过本人实践效果令人满意，如果有更好的想法欢迎交流，附上完整示例地址：[https://github.com/YES-Lee/vue-permission-demo](https://github.com/YES-Lee/vue-permission-demo)
