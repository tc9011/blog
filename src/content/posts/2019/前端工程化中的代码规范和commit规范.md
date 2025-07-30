---
title: 前端工程化中的代码规范和commit规范
published: 2019-06-26 22:28:35
tags: 
  - 前端
  - 工程化
  - commit
  - 代码规范
toc: true
lang: zh
---

![preview_git-php-cs-fixer-cover](../_images/前端代码规范和commit规范的工程化/preview_git-php-cs-fixer-cover.png)

<!--more-->

每个人都有自己的代码书写风格，当团队协作的时候，如果每个人都坚持自己的风格书写，代码将是灾难性的。所以我们需要统一风格，不仅可以减少出 bug 的几率，而且能增加代码的可读性。

## 代码规范

对前端而言，通常我们会配置 [eslint](https://eslint.org/docs/rules/)、[tslint](https://palantir.github.io/tslint/rules/)、[stylelint](https://stylelint.io/user-guide/rules/)等代码检查工具，来帮我们制定代码校验规则。这里拿`tslint`和`stylelint`举例，分别对`typescript`和`scss`进行代码检查。

```bash
npm install tslint stylelint --save-dev
```

在项目根目录下面分别创建`tslint.json`和`.stylelintrc`文件。然后你就可以像下面这样去定义规则。

```json
// tslint.json
{
  "rules": {
    "arrow-return-shorthand": true,
    "indent": [
      true,
      "spaces"
    ],
    "max-line-length": [
      true,
      140
    ],
    "no-trailing-whitespace": true,
    "no-unnecessary-initializer": true,
    "no-unused-expression": true,
    "no-use-before-declare": true,
    "no-var-keyword": true,
    "prefer-const": true,
    "quotemark": [
      true,
      "single"
    ],
    "semicolon": [
      true,
      "never"
    ],
    "triple-equals": [
      true,
      "allow-null-check"
    ],
    "typedef-whitespace": [
      true,
      {
        "call-signature": "nospace",
        "index-signature": "nospace",
        "parameter": "nospace",
        "property-declaration": "nospace",
        "variable-declaration": "nospace"
      }
    ],
    "unified-signatures": true,
    "variable-name": false,
    "whitespace": [
      true,
      "check-branch",
      "check-decl",
      "check-operator",
      "check-separator",
      "check-type"
    ],
  }
}

```

```json
// .stylelintrc
{
  "rules": {
    "no-empty-source": null,
    "selector-pseudo-element-no-unknown": [
      true,
      {
        "ignorePseudoElements": ["ng-deep"]
      }
    ]
  }
}
```

lint 检查工具一般会有一些通用的配置，下载后就可以使用，比较有名的像 AirBnb 的 lint 检查规范。在 `tslint` 和`stylelint`中也可以直接使用官方推荐的规范：

```bash
npm install stylelint-config-standard --save-dev
```

```json
// tslint.json
{
  "extends": ["tslint:recommended"],
	"rules": {
    // ...rules
  }
}
```

```json
// .stylelintrc
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    // ...rules 
  }
}
```

针对代码风格问题，还可以引入 `prettier` 来帮助格式化代码，`prettier`主要优点是对几乎所有前端的代码都可以优化，比如`html`、`css`、`scss`、`jsx`、`ts`等。所以所有的代码风格的校验可以都交给`prettier`，让它完成代码风格的格式化，而 lint 工具主要专注在代码质量的检查。

```bash
npm install prettier --save-dev
```

```json
// .prettierrc
{
  "singleQuote": true,
  "printWidth": 120,
  "semi": false,
  "tabWidth": 2,
  "useTabs": false,
  "overrides": [
    {
      "files": ".prettierrc",
      "options": {
        "parser": "json"
      }
    }
  ]
}
```

因为`prettier`内置了一套代码风格，而且只暴露很少的可配置项，所以为了防止 lint 工具和`prettier`冲突，还需要安装相应的 library：

```bash
npm prettier-stylelint tslint-config-prettier --save-dev
```

```json
// tslint.json
{
  "extends": ["tslint-config-prettier"],
   "rules": {
    // ...rules 
  }
}
```

```json
// .stylelintrc
{
  "extends": ["stylelint-config-standard", "prettier-stylelint"],
  "rules": {
    // ...rules 
  }
}
```

配置完后，我们可以通过`scripts` 帮我们快速格式化代码：

```json
// package.json
{
  "scripts": {
    "format": "npm run prettier && npm run lint:ts && npm run lint:style",
    "prettier": "prettier --config ./.prettierrc --write 'src/**/!(polyfills).{ts,scss}'",
    "lint:ts": "tslint -c tslint.json 'src/app/**/!(demo|testing)/!(polyfills).ts' --fix",
    "lint:style": "stylelint \"src/app/**/*.scss\" --fix",
  }
}
```

这时候只要每次提交代码之前，运行`npm run format`就可以帮我们进行代码检查。

但是，这时候有个问题，如果你忘了运行这个命令，你还是可以提交，流程之中就存在漏洞。此时就可以请出`husky`和`lint-staged`，利用 git 的 hook 来帮我们在 commit 前自动进行代码检查。

```bash
npm install husky lint-staged --save-dev
```

```json
// package.json
{
  // ...
  "lint-staged": {
    "src/app/**/!(demo|testing)/!(polyfills).{ts,scss}": [
      "prettier --config ./.prettierrc --write",
      "git add"
    ],
    "src/app/**/!(demo|testing)/!(polyfills).ts": [
      "tslint -c tslint.json --fix",
      "git add"
    ],
    "src/app/**/*.scss": [
      "stylelint \"src/app/**/*.scss\" --fix",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
    }
  },
}
```

`husky`会在`.git/hooks`中写入`pre-commit`的钩子，这个钩子会在`git commit`执行的时候触发，而 `lint-staged`会对此时在暂存区的文件进行 lint 和 prettier 检查，并且会自动修复一些能修复的问题，并重新添加到暂存区。这时候如果检查通过，会把暂存区中的文件提交；检查不过关，则会终止 `commit` 操作。

## commit 规范

git 可以帮我们很好地管理代码，但是在多人合作的时候，经常会碰到各种随意的 commit message，当你需要会看 commit message 的时候，就会很头疼。

首先来看一下被业界广泛认可的 [Angular commit message规范](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)。

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

一个 commit message 由三部分构成：

- 标题行: 必填, 描述主要修改类型和内容
- 主题内容: 描述为什么修改, 做了什么样的修改, 以及开发的思路等等
- 页脚注释: 放 Breaking Changes 或 Closed Issues

在这三部分中，`<>`中的内容分别表示：

- type: commit 的类型
  - feat: 新特性
  - fix: 修改问题
  - refactor: 代码重构
  - docs: 文档修改
  - style: 代码格式修改, 注意不是 css 修改
  - test: 测试用例修改
  - chore: 其他修改, 比如构建流程, 依赖管理.
  - pref: 性能提升的修改
  - build: 对项目构建或者依赖的改动
  - ci: CI 的修改
  - revert: revert 前一个 commit
- scope: commit 影响的范围, 比如: route, component, utils, build...
- subject: commit 的概述, 建议符合  [50/72 formatting](https://link.juejin.im?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fstackoverflow.com%2Fquestions%2F2290016%2Fgit-commit-messages-50-72-formatting)
- body: commit 具体修改内容, 可以分为多行, 建议符合 [50/72 formatting](https://link.juejin.im?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fstackoverflow.com%2Fquestions%2F2290016%2Fgit-commit-messages-50-72-formatting)
- footer: 一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.


这时候我们需要工具像 lint 检查一样来帮我们约束 commit message 的书写。

```bash
npm install commitizen cz-conventional-changelog @commitlint/config-conventional @commitlint/cli --save-dev
```

`commitizen` 会代替你的`git commit`，`cz-conventional-changelog`是一个符合Angular commit message规范的 preset，`@commitlint/config-conventional`则是校验规则。

这里同样需要借助 `husky` 和 `lint-staged`：

```json
// package.json
{
  "scripts": {
    // ...
    "commit": "git-cz"
  }
  // ...
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -e $GIT_PARAMS"
    }
  },
}
```

```js
// .commitlintrc.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
      'type-enum': [
        2,
        'always',
        ["feat", "fix", "docs", "style", "refactor", "chore", "publish"]
      ],
      'subject-case': [0, 'never'],
  },
}
```

这时候你就可以用`git cz` 代替`git commit`，当然如果习惯了 commit message 规范后，可以直接用`git commit`，如果 message 不符合规范，是不会 commit 的。

## 总结

代码规范和 commit 规范是前端工程化中的重要一环，工程化可以保证在多人协作的情况下，项目质量的下限。
