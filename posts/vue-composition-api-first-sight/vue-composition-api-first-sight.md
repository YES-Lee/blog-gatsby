---
title: Vue Composition API 初探
categories:
  - 技术
thumbnail: ./cover.jpg
date: 2020-08-12 16:16:00
status: post
tags:
  - vue
  - javascript
  - composition api
keywords:
  - vue
  - composition api
  - hooks
---

`Composition API`是vue-next中的逻辑复用解决方案，它是一组基于函数式编程的组合式API。与之前的逻辑复用方案`mixin`相比，带来了更友好的类型检查，更方便的测试等优点。
<!-- more -->

`Composition API`的详细用法和API可以参考[官方文档](https://composition-api.vuejs.org/)，这里我们做一个简单的初步的上手体验。

## 安装

`Composition API`被单独抽离为一个库，让我们可以在vue2.x中体验该特性。

```bash
npm install @vue/composition-api
# or
yarn add @vue/composition-api
```

在`Vue`中注册`@vue/composition-api`

```javascript
// main.js
import Vue from 'vue'
import CompositionApi from '@vue/composition-api'

Vue.use(CompositionApi)
```

得益于vue的插件机制，通过一行简单的代码，我们就给项目添加了`Composition API`特性。

## 开始

`Composition API`给vue组件增加了一个名为`setup`的生命周期函数，它要早于`befororeCreate`执行，在vue-next中是最早执行的生命周期钩子。

**注意**: 和`befororeCreate`一样，`setup`实例还没创建，因此无法使用`this`。

```html
<template>
  <!-- 自动展开 -->
  <div>{{message}}<div>
  <!-- 也可以手动取值 -->
  <div>{{message.value}}</div>
</template>
<script>
  import { ref } from '@vue/composition-api'

  export default {
    setup () {
      const message = ref('hello vue')
      return {
        message,
        setMessage: (msg) => initialMessage.value = msg
      }
    }
  }
</script>
```

`ref`是一个响应式API，它返回一个只有value的单属性响应对象，在模板中引用`ref`对象，会自动展开。但是在javascript代码中，除了在响应式对象中，都需要手动展开。

```javascript
import { ref, reactive } from '@vue/composition-api'

export default {
  setup () {
    const message = ref('hello vue')
    const data1 = reactive({
      message // 自动展开
    })
    const data2 = {
      message: message.value // 需要手动展开
    }
  }
}
```

## 扩展

上面是非常基础的，也是最常用的两个API。使用组合API可以让我们像使用react hooks一样的方式去组织/复用逻辑代码。比如我们可以使用组合封装一个`useMouseState`的函数来监控鼠标位置信息。

```javascript
import { useMouseState } from 'beautiful-vue-hooks'

export default {
  setup() {
    const { clientX, clientY } = useMouseState()
    return {
      clientX,
      clientY
    }
  }
}
```

更多的示例可以参考我开发的一个hook集合[Beautiful-Vue-Hooks](https://beautiful-vue-hooks.johnsonlee.site/)。

## 小结

`Composition API`很大程度上借鉴了`react hooks`，但是两者在用法的功能上还是有一定的差异。对于vue来说，组合提供了比`mixin`更好的逻辑复用方案。同时也能提供更完善的类型检查。

但是同时也存在与hooks相同的问题，就是会带来一定的心智负担，容易滥用导致后期项目过于凌乱，难以维护。
