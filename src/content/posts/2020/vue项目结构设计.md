---
title: vue项目结构设计
published: 2020-09-20 23:20:07
tags: 
  - vue
  - 前端
  - 架构
toc: true
lang: zh
---

![5e2160d3a0a60530](../_images/vue项目架构设计/5e2160d3a0a60530.jpg)

<!--more-->

书接上回，这次我们来聊一下，我之前项目中关于 vue 的架构实践，也欢迎大佬们指出不足。

我们先看一下整体的目录结构：

```tex
.
├── dev-tools						            // 开发工具，比如自定义的 stylelint 规则之类的
│   └── ...   		
├── dist
│   └── ...   
├── public
│   └── index.html
├── src
│   ├── api												  // 抽取出API请求，所有 API 
│   │   └── ...
│   ├── assets											// 静态文件目录（图片、字体）
│   │   └── ...
│   ├── components									// 公共组件
│   │   └── ...
│   ├── constants										// 项目中的常量
│   │   └── ...
│   ├── lang												// 多语言文件
│   │   ├── en-US.json
│   │   └── zh-CN.json
│   ├── lib													// 第三方 js 代码
│   │   └── ...
│   ├── layouts											// 布局层相关的 vue 组件
│   │   ├── BasicLayout.vue					// 基础 layout vue 组件
│   │   ├── BlankLayout.vue					// 空白 layout vue 组件
│   │   └── index.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   ├── actions.js							// 根级别的 action
│   │   ├── getters.js							// 根级别的 getter
│   │   ├── index.js								// 组装模块并导出 store 的地方
│   │   ├── mutations.js						// 根级别的 mutation
│   │   ├── state.js								// 根级别的 state
│   │   └── modules
│   │       └── A										// 模块级别的 store
│   │       │   ├── actions.js
│   │       │   ├── getters.js
│   │       │   ├── index.js
│   │       │   ├── mutations.js
│   │       │   └── state.js
│   │   		└── ...
│   ├── styles
│   │   ├── app.less								// 通用的less
│   │   ├── mixin.less							// 通用的mixin
│   │   ├── variables.less					// 通用的变量
│   │   └── ...
│   ├── utils
│   │   ├── http										// 封装 axios
│   │   │   ├── axios.js
│   │   │   └── http.js
│   │   └── ...
│   ├── views												// 页面组件
│   │   └── ...
│ 	├── App.vue
│   ├── i18n.js											
│   ├── initData.js
│   └── main.js
├── tests														// 测试
│   ├── e2e   											// e2e 测试
│   │		└── ...   
│   └── unit												// 单元测试
│   		└── ...   
├── .browserslistrc
├── .commitlintrc.js								// commit 规范校验
├── .editorconfig										// 编辑器配置文件
├── .env.development								// 开发环境的环境变量
├── .env.production									// 生产环境的环境变量
├── .eslintignore                   // eslint 的忽略规则
├── .eslintrc.js										// eslint 的配置
├── .gitignore											// git 的忽略规则
├── .prettierrc											// prettier 的配置
├── .stylelintrc.json								// stylelint 的配置
├── babel.config.js									// 开发环境的环境变量
├── Dockerfile 											// 构建 Docker 镜像的文本文件
├── docker-compose.yml							// Docker compose 配置
├── README.md
├── build.sh												// Docker 镜像中执行的构件脚本
├── default.conf										// ngnix 配置
├── jest.config.js									// jest 配置
├── jsconfig.json										// VSCode js 配置
├── package-lock.json
├── package.json
├── start-nginx.sh									// docker 镜像中运行 nginx 的脚本
└── vue.config.js										// vue 配置文件
```

首先对于视图层分成了三块：`components`、 `layouts` 和 `views`：

`components` 为公共组件，主要包括原子组件（比如 Button、Modal等）和业务公用组件，从深度上，此处的目录层级结构应该尽量扁平，不应该有很深的层级；

`layouts` 主要用来负责基本的布局，每个页面都会是 layout 组件的子集，`BasicLayout`是页面基本布局，会是用得最多的布局，`BlankLayout`是空白页面，方便处理一些特殊页面；

`views` 主要是路由页面组件，。

`router`中是页面路由，最上层的路由的 Component 会是` layout` 中的 Component，其 children 则是 `views` 中的 Component :

```javascript
[
  {
    path: '/',
    component: BasicLayout,
    redirect: '/homepage',
    children: [
      {
        path: 'homepage',
        name: 'homepage',
        component: () => import('../views/homepage/Homepage')
      },
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/exception/404')
  },
  {
    path: '/500',
    name: '500',
    component: () => import('../views/exception/500')
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
```

`styles` 下会是所有全局的样式，比如全局的变量、mixin 以及修改的`ant-design`的样式等。

所有的接口都会放在`Api`目录下，做统一管理。`utils`下面的`http` 目录是对 axios 的二次封装，集成了拦截器、统一错误处理、 token 处理等功能。

```javascript
const handleError = (message) => {
  Vue.prototype.$warning({
      title: 'Warning',
      content: message
    })
  store.commit('setGlobalLoading', {
    loading: false
  })
}

const makeRequest = axios.create({
  baseURL: host.BACK_END_URL,
  timeout: 60000
})

const requestRetryInfo = {}
const MaxRetry = 5

const handleRefreshToken = config => {
  const url = config.url
  if (!requestRetryInfo[url]) {
    requestRetryInfo[url] = 0
  }
  if (requestRetryInfo[url] > MaxRetry) {
    requestRetryInfo[url] = 0
    return
  }
  requestRetryInfo[url]++

  return getNewToken()
    .then(res => {
      const { token } = res
      setToken(res.token)
      config.headers.Authorization = `Bearer ${token}`
      config.baseURL = host.BACK_END_URL
      return makeRequest(config)
    })
    .catch(() => {
      clearToken()
    })
}

const error = error => {
  let parsedError = { ...error }
  const response = _.get(parsedError, 'response')
  const url = _.get(parsedError, 'response.config.url') || _.get(parsedError, 'config.url')
  if (_.isEmpty(response)) {
    parsedError = {
      ...error,
      response: {
        data: { message: i18n.t('timeout') },
        status: 500
      }
    }
  }
  const errorCode = _.get(parsedError, 'response.status')
  const message = _.get(parsedError, 'response.data.message')
  const config = error.config
  if (errorCode === 401) {
    return handleRefreshToken(config)
  }
  if (!NOT_SHOW_ERROR_URL.some(value => url.includes(value))) {
    switch (errorCode) {
      case 403:
        ...
        handleError(message)
        break
      case 406:
        handleError(message)
        clearToken()
        break
      default:
        handleError(message)
    }
  }
  return Promise.reject(parsedError)
}

// request interceptor
makeRequest.interceptors.request.use(
  config => {
    const token = getToken()
    if (token && !config.url.includes('token')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
    }
    return config
  },
  error =>
    Promise.reject(error)
)

// response interceptor
makeRequest.interceptors.response.use(response => {
  const token = _.get(response, 'headers.authorization')
  if (token) {
    setToken(token)
  }
  return response.data
}, error)
```

`store`的管理按照`modules`进行拆分，根级别的只放类似`globalLoading`这种状态管理，其他的状态管理按照业务拆分成 modules。

```javascript
// root store
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    homepage
  }
})

// homepage
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
```

`constants`主要存放常量，用于 store 的常量放在单独文件内，其他常量的管理也按业务进行拆分。

`assets`主要存放代码以外的静态资源，比如图片、视频等，资源需要按业务进行分类，方便管理这些静态资源。
