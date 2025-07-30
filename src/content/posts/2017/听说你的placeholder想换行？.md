---
title: 听说你的placeholder想换行？
published: 2017-02-18 17:31:11
tags: 
  - html
toc: true
lang: zh
---

![2017021885090placeholder2.png](../_images/听说你的placeholder想换行/2017021885090placeholder2.png)

<!--more-->

这是同事遇到的一个问题，在`<textarea>`标签里面不仅要加上placeholder属性，还要换行。[在stackoverflow](http://stackoverflow.com/questions/7312623/insert-line-break-inside-placeholder-attribute-of-a-textarea)上有相关的讨论，主要有下面几种做法：

## 官方说明

[官方说明：](http://www.w3.org/TR/html5/forms.html#the-placeholder-attribute)

> The placeholder attribute represents a *short* hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format. **The attribute, if specified, must have a value that contains no U+000A LINE FEED (LF) or U+000D CARRIAGE RETURN (CR) characters.**
>
> The `placeholder` attribute should not be used as a replacement for a `label`. For a longer hint or other advisory text, place the text next to the control.

翻译过来就是：

<p id="div-border-left-red">placeholder属性是用来帮助用户输入的简短提示（一个字或者一个短语），这个提示应该是简单的数值或者简短的描述。placeholder属性不应该作为`label`的替代者。对于较长或者复杂的提示，将文本置于控件旁边。</p>

## 解决办法

### 使用`&#10;`

```html
<textarea name="foo" placeholder"hello you&#10;Second line&#10;Third line"></textarea>
```

这个不能跨浏览器，在ie、chrome下是可以的，但是在firefox和safari中不行。

### css解决办法

```css
::-webkit-input-placeholder::before {
  content: "FIRST\000ASECOND\000ATHIRD";
}

::-moz-placeholder::before {
  content: "FIRST\000ASECOND\000ATHIRD";
}

:-ms-input-placeholder::before {
  content: "FIRST\000ASECOND\000ATHIRD";
}
```

只适用于webkit内核的浏览器（chrome、safari），对firefox和ie没有效果。

### 使用jQuery的watermark控件

通过[watermark](https://github.com/marioestrada/jQuery-Watermark)可以全平台兼容。下载控件后，引入到项目，然后在`<textarea>`中定义`jq_watermark`的class。

```html
<script type="text/javascript" src="jquery.watermark.js"></script>

<label for="comments">Comments:</label><br />
<textarea id="comments" placeholder="Tell Us<br/>What do you think...<br/>We are here" class="jq_watermark" rows="3" cols="80"></textarea>
```







