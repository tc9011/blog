---
title: 创建你自己的 vue cli preset
published: 2020-09-07 21:23:05
tags: 
  - Vue
  - 前端
toc: true
lang: zh
---

![1_Bgft1jE3SrNlllxL0IJKYg](../_images/创建你自己的vueclipreset/1_Bgft1jE3SrNlllxL0IJKYg.png)

<!--more-->

前一阵子从0到1做了一个 vue的项目，为了下次使用方便，写了一个`preset`，也顺便聊聊这个项目中的一些东西。

根据官网的文档：

> 你可以通过发布 git repo 将一个 preset 分享给其他开发者。这个 repo 应该包含以下文件：
>
> * `preset.json`: 包含 preset 数据的主要文件（必需）。
> * `generator.js`: 一个可以注入或是修改项目中文件的 [Generator](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#generator)。
> * `prompts.js` 一个可以通过命令行对话为 generator 收集选项的 [prompts 文件](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#第三方插件的对话)。
>
> 发布 repo 后，你就可以在创建项目的时候通过 `--preset` 选项使用这个远程的 preset 了

我们先在 GitHub 新建一个 repo，在这个 repo 中增加三个文件：`preset.json`、`generator.js`、`prompts.js`。

`prompt.js` 是允许用户通过命令行对话的方式进行项目的配置，这次没有涉及到，所以直接 `export`空数组就行：

```js
module.exports = []
```

`generator.js`这个文件负责的就是注入或是修改项目中文件。这里主要用到的两个 API 是:

* `api.extendPackage`：用来会扩展项目中的`package.json`中的参数，包括依赖、`scripts`以及其他在`package.json`中用到的配置
* `api.render`：用来将模板项目中的文件拷贝到初始化的项目中（当你需要创建一个以 `.` 开头的文件时，模板项目中需要用 `_` 替代 `.`）

需要注意的是`aoi.render`在拷贝文件的时候是用`EJS`去实现，所以在处理比如`index.html`中的`<%= BASE_URL %>`时，需要转义成`<%%= BASE_URL %%>`。当然，你也可以使用`EJS`对文件中的代码进行更细粒度的控制。

```json
module.exports = (api, options, rootOptions) => {
    api.extendPackage({
        'dependencies': {
            'axios': '^0.19.0',
            'lodash': '^4.17.15',
            'normalize.css': '^8.0.1',
        },
        'devDependencies': {
            '@babel/plugin-proposal-optional-chaining': '^7.9.0',
            '@commitlint/cli': '^8.3.5',
            '@commitlint/config-conventional': '^8.3.4',
            '@leo-tools/eslint-config-vue': '^0.0.9',
            '@vue/eslint-config-standard': '^5.1.2',
            'babel-plugin-lodash': '^3.3.4',
            'commitizen': '^4.0.4',
            'compression-webpack-plugin': '^3.1.0',
            'cross-env': '^7.0.2',
            'cz-conventional-changelog': '^3.1.0',
            'lodash-webpack-plugin': '^0.11.5',
            'vue-cli-plugin-webpack-bundle-analyzer': '~2.0.0',
            'vue-svg-loader': '^0.16.0',
        },
        'scripts': {
            'build:dev': 'vue-cli-service build --mode development',
            'build:prod': 'vue-cli-service build --mode production',
            'test:unit': 'cross-env NODE_ENV=test vue-cli-service test:unit',
            'test:e2e': 'cross-env NODE_ENV=test vue-cli-service test:e2e',
            'lint': 'vue-cli-service lint src/**/*.{js,vue} tests/**/*.js --fix'
        },
        'config': {
            'commitizen': {
                'path': 'node_modules/cz-conventional-changelog'
            }
        },
        'gitHooks': {
            'pre-commit': 'lint-staged',
            'commit-msg': 'commitlint -e $GIT_PARAMS'
        },
        'lint-staged': {
            'src/**/*.{js,jsx,vue}': [
                'vue-cli-service lint --fix',
                'git add'
            ],
            'tests/**/*.js': [
                'vue-cli-service lint --fix',
                'git add'
            ]
        }
    })

    api.render('./template')
}
```

`preset.json`主要是 vue 的配置，这个配置内容可以在用 `vue create xxx` 初始化项目并保存为本地模板后，`~/.vuerc` 文件中找到对应的配置内容，比如：

```json
{
  "useTaobaoRegistry": false,
  "packageManager": "yarn",
  "useConfigFiles": true,
  "router": true,
  "vuex": true,
  "cssPreprocessor": "node-sass",
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-pwa": {},
    "@vue/cli-plugin-router": {
      "historyMode": true
    },
    "@vue/cli-plugin-vuex": {},
    "@vue/cli-plugin-eslint": {
      "config": "prettier",
      "lintOn": [
        "save"
      ]
    },
    "@vue/cli-plugin-e2e-cypress": {},
    "@vue/cli-plugin-unit-jest": {}
  }
}
```

这些都弄好后，就可以直接用`vue create --preset leo-tools/vue-cli-preset <YOUR PROJECT NAME>`生成新的项目了。上面 `--preset` 后跟的参数就是 GitHub 的 `username/repo` ，比如这个项目就是`leo-tools/vue-cli-preset`。

今天先写这么多吧，下一期来聊一聊这个项目中的架构以及一些优化。

## 参考文章

* [preset](https://cli.vuejs.org/zh/guide/plugins-and-presets.html#preset)

* [如何使用 vue-cli 3 的 preset 打造基于 git repo 的前端项目模板](https://segmentfault.com/a/1190000016389996)

  

