---
title: Angular官方文档学习笔记之Webpack简介
published: 2017-02-11 20:42:28
tags: 
  - Angular
  - Webpack
toc: true
lang: zh
---

![201702049298Angularandwebpack.png](../_images/Angular官方文档学习笔记之Webpack简介/1.png)

<!--more-->

## 什么是Webpack

Webpack是一个强力的模块打包器。 所谓*包(bundle)*就是一个JavaScript文件，它把一堆*资源(assets)*合并在一起，以便它们可以在同一个文件请求中发回给客户端。 包中可以包含JavaScript、CSS样式、HTML以及很多其它类型的文件。

Webpack会遍历你应用中的所有源码，查找`import`语句，构建出依赖图谱，并产出一个(或多个)*包*。 通过“加载器(loaders)”插件，Webpack可以对各种非JavaScript文件进行预处理和最小化(Minify)，比如TypeScript、SASS和LESS文件等。

我们通过一个JavaScript配置文件`webpack.config.js`来决定Webpack做什么以及如何做。

### 入口与输出

给webpack提供一个或多个*入口*文件，通过入口来让它查找与合并那些从这些入口点发散出去的依赖。

```javascript
entry: {
  app: 'src/app.ts'
}
```



`app.js`输出包是个单一的JavaScript文件，它包含程序的源码及其所有依赖。 

```javascript
output: {
  filename: 'app.js'
}
```

### 多重包

Webpack会构造出两个独立的依赖图谱，并产出*两个*包文件：一个叫做`app.js`，它只包含我们的应用代码；另一个叫做`vendor.js`，它包含所有的提供商依赖。

```javascript
entry: {
  app: 'src/app.ts',
  vendor: 'src/vendor.ts'
},

output: {
  filename: '[name].js'
}
//在输出文件名中出现的[name]是一个Webpack的占位符，它将被替换为入口点的名字，分别是app和vendor。
```

### 加载器

我们要通过**加载器**来告诉它如何把JavaScript、TypeScript、CSS、SASS、LESS、图片、HTML以及字体文件等处理成JavaScript文件。 

```typescript
import { AppComponent } from './app.component.ts';
import 'uiframework/dist/uiframework.css';
```

```javascript
loaders: [
  {
    test: /\.ts$/
    loaders: 'ts'
  },
  {
    test: /\.css$/
    loaders: 'style!css'
  }
]
```

第一个`import`文件匹配上了`.ts`模式，于是Webpack就用`awesome-typescript-loader`加载器处理它。 导入的文件没有匹配上第二个模式，于是它的加载器就被忽略了。

第二个`import`匹配上了第二个`.css`模式，它有两个用叹号字符(`!`)串联起来的加载器。 Webpack会*从右到左*逐个应用串联的加载器，于是它先应用了`css`加载器(用来平面化CSS的`@import`和`url(...)`语句)， 然后应用了`style`加载器(用来把css追加到页面上的`<style>`元素中)。

### 插件

Webpack有一条构建流水线，它被划分成多个经过精心定义的阶段(phase)。 我们可以把插件(比如`uglify`代码最小化插件)挂到流水线上：

```typescript
plugins: [
  new webpack.optimize.UglifyJsPlugin()
]
```



## 配置Webpack

### 公共配置

```javascript
config/webpack.common.js

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  
  //把应用拆成三个包：1.polyfills：我们在大多数现代浏览器中运行Angular程序时需要的标准填充物；2.vendor：提供商文件；3.app：应用代码。
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  //告诉Webpack如何通过查找匹配的文件来解析模块文件的加载请求
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.ts', '.js'] 
  },

  //指定指定加载器
  module: {
    loaders: [
      {
        test: /\.ts$/,
        //awesome-typescript-loader - 一个用于把TypeScript代码转译成ES5的加载器，它会由tsconfig.json文件提供指导;angular2-template-loader - 用于加载Angular组件的模板和样式
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']//多重加载器也能使用数组形式串联起来。
      },
      {
        test: /\.html$/,
        //html - 为组件模板准备的加载器
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        //匹配应用级样式,它只包含了那些位于/src及其上级目录的.css文件
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        //匹配组件局部样式(就是在组件元数据的styleUrls属性中指定的那些),通过raw加载器把组件局部样式加载成字符串
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ]
  },

  plugins: [
    //这里标记出了三个块之间的等级体系：app -> vendor -> polyfills。 当Webpack发现app与vendor有共享依赖时，就把它们从app中移除。 在vendor和polyfills之间有共享依赖时也同样如此，把提供商代码排除在app.js包之外
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    //Webpack可以通过HtmlWebpackPlugin自动为我们注入js和css文件的script和link标签。
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
```

### 开发环境配置

```javascript
config/webpack.dev.js

var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  //HtmlWebpackPlugin(由webpack.common.js引入)插件使用了publicPath和filename设置， 来向index.html中插入适当的<script>和<link>标签。
  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  //ExtractTextPlugin会把CSS提取成外部.css文件， 这样HtmlWebpackPlugin插件就会转而把一个<link>标签写进index.html了
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
```

### 产品环境配置

```javascript
config/webpack.prod.js

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false // workaround for ng2
  },

  plugins: [
    //NoErrorsPlugin - 如果出现任何错误，就终止构建。
    new webpack.NoErrorsPlugin(),
    //DedupePlugin - 检测完全相同(以及几乎完全相同)的文件，并把它们从输出中移除。
    new webpack.optimize.DedupePlugin(),
    //UglifyJsPlugin - 最小化(minify)生成的包。
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    //ExtractTextPlugin - 把内嵌的css抽取成外部文件，并为其文件名添加“缓存无效哈希”。当这些哈希值变化时，自动更新index.html。
    new ExtractTextPlugin('[name].[hash].css'),
    //DefinePlugin - 用来定义环境变量，以便我们在自己的程序中引用它。
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});
```

### 测试环境配置

```javascript
config/webpack.test.js

var helpers = require('./helpers');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: 'null'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ]
  }
}

```

如果有可能拖慢执行速度，甚至都不需要在单元测试中加载和处理应用全局样式文件，所以我们用一个`null`加载器来处理所有CSS。

```javascript
config/karma.conf.js

var webpackConfig = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],

    preprocessors: {
      './config/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  };

  config.set(_config);
};
```

```javascript
config/karma-test-shim.js

//karma-test-shim告诉Karma哪些文件需要预加载，首要的是：带有“测试版提供商”的Angular测试框架是每个应用都希望预加载的。
Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

var appContext = require.context('../src', true, /\.spec\.ts/);

appContext.keys().forEach(appContext);

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
```

