---
title: Angular2中的base标签
published: 2016-12-31 16:40:44
tags: 
  - Angular
toc: true
lang: zh
---

![2016123166228base.png](../_images/Angular2中的base标签/2016123166228base.png)

<!--more-->

Angular2官方hero教程中，提到了`<base href="/">`，写的很简单，当时我也没有留意，今天写自己的开源项目的时候，突然遇到这个问题，正好讲一下。

我的路由是这样的：

```typescript
const routes: Routes = [
    { path: '', redirectTo: '/line', pathMatch: 'full' },
    { path: 'line',  component: LineComponent },
    { path: 'bar', component: BarComponent },
];
```

第一次加载页面的时候，url是：`http://localhost:3000/line`，

如果在`<head>`里没写`<base href="/">`，那么当你浏览器自动刷新的时候，url会变成：`http://localhost:3000/line/line`，也就是说，浏览器的前缀没有清空，这样会导致加载时出现404错误。这时候只要在`<head>`里加上`<base href="/">`，就可以了，或者加上：

```html
<script>document.write('<base href="' + document.location + '" />');</script>
```

来保护当前的URL，保证当我们导航到深层次的url时候，资源可以被正确加载。
