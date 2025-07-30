---
title: hexo本地搜索无法使用解决办法
published: 2017-02-05 14:41:49
tags: 
  - Hexo
toc: true
lang: zh
---

![2017020575690serch1.jpeg](../_images/hexo本地搜索无法使用解决办法/1.png)

<!--more-->

突然发现博客的本地搜索不能用了，这样就不能搜索学习笔记里面的内容了，这可是大事，得解决。

查找了github上的issues，发现[local search](https://github.com/iissnan/hexo-theme-next/pull/694)这个issue下面有人提到博客搜索无法使用，显示链接是`javascript:;`，这不就是我的问题吗，但是这个问题有点蛋疼，需要在文章里面一个个找。


最后在[hexo文章添加版权声明及一些特效](http://tc9011.com/2017/02/02/hexo%E6%96%87%E7%AB%A0%E6%B7%BB%E5%8A%A0%E7%89%88%E6%9D%83%E5%A3%B0%E6%98%8E%E5%8F%8A%E4%B8%80%E4%BA%9B%E7%89%B9%E6%95%88/)中第二节中找到了这句话，删除后，搜索就可以用啦。


