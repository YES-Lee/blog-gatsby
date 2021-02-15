---
title: Apollo-Client 文件上传
categories:
  - 技术
color: '#111'
thumbnail: ./cover.jpg
date: 2019-09-19 14:14:13
tags:
  - graphql
  - 前端
  - javascript
keywords:
  - apollo文件上传
  - apollo
  - 文件上传
  - javascript
---

使用`apollo-client`上传文件

<!-- more -->

# apollo 文件上传

## 依赖

- apollo-client
- apollo-link
- apollo-upload-client
- apollo-cache-inmemory

## 客户端创建

apolloClient.js

```javascript
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'

const authLink = new ApolloLink((operation: Operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: getToken(),
    },
  })
  return forward(operation)
})

const uploadLink = createUploadLink({
  uri: `${API_URL}`,
})

export const apolloClient = new ApolloClient({
  link: from([authLink, uploadLink]), // uploadLink一定要放最后
  cache: new InMemoryCache(),
})
```

## 使用

uploadFile.js

```javascript
import gql from 'graphql-tag'
import { apolloClient } from 'apolloClient'

export function uploadFile(file) {
  const query = gql`
    mutation($file: Upload!) {
      uploadFile(file: $file) {
        id
        attachname
        filename
      }
    }
  `

  return apolloClient.mutation({
    mutation,
    variables: {
      file,
    },
  })
}
```
