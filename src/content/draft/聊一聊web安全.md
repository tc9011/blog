---
title: 聊一聊web安全
date: 2017-10-25 22:25:19
tags: WEB安全
categories: 技术类
password:
---

![20171025150894193153669.png](http://ofx4ie5iq.bkt.clouddn.com/20171025150894193153669.png)

<!--more-->

后端的同学要参加安全大赛，王博顺便就把我这前端也喊上，主要帮他们整理了一下web安全常见攻击及防御。文章是东拼西凑的，不严谨的地方请大神指正。

# 跨站脚本攻击

跨站脚本攻击（Cross Site Script）缩写是XSS，这是为了和层叠样式表（Cascading Style Sheet）区分开来。

XSS就是攻击者在Web页面中插入恶意脚本，当用户浏览页面时，促使脚本执行，从而达到攻击目的。

<a href="http://tc9011.com/?target=javascript%3Dalert('%E8%BF%99%E6%98%AF%E4%BD%A0%E7%9A%84cookie%E4%BF%A1%E6%81%AF%3A%5Cn'%2Bdocument.cookie)" style="color:#fff;background:#f00;font-size:20px;padding:10px 0;line-height:2em;" target="_blank" rel="nofollow noopener noreferrer">如果你点击我依然能看见你的cookie，说明本站点存在 XSS 风险</a>
