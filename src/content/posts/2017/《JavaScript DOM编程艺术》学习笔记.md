---
title: 《JavaScript DOM编程艺术》学习笔记
published: 2017-02-25 23:55:49
tags: 
  - JavaScript
toc: true
lang: zh
---

![20170213248375099247.jpg](../_images/JavaScript_DOM/20170213248375099247.jpg)

<!--more-->

> 本书大部分demo参见[DOM Scripting Demo](https://github.com/tc9011/DOM-Scripting-Demo)，本人手敲，如有错误欢迎提交pr

## JavaScript语法

### 准备工作

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <meta charset="UTF-8">
</head>
<body>
<script src="example.js"></script>
</body>
</html>
```

把`<script>`标签放在HTML文档最后，`</body>`标签之前，这样即使加载脚本时，Windows对象的load事件依然可以执行对文档进行的各种操作。

<p id="div-border-left-green">因为位于`<head>`中的脚本会导致浏览器不能并行加载其他文件。一般来说，根据HTTP规范，浏览器每次从同一个域名中最多只能同时下载两个文件。</p>

### 操作

#### 算术操作符

字符串和数值拼接在一起结果是更长的**字符串**。

```javascript
alert("10"+20)； //输出1020
```

#### 比较操作符

JavaScript中，`==`并不表示严格相等，例如：

```javascript
var a = false;
var b = "";
if (a == b){			//true
  alert("a = b");
}
```

<p id="div-border-left-red">这个语句求值结果是ture，因为`==`认为空字符串与false的含义相同。要进行严格比较，就要使用另一种等号：`===`。这个全等操作符会执行严格的比较，不仅比较值，而且会比较变量的类型：</p>

```javascript
var a = false;
var b = "";
if (a === b){			//flase
  alert("a = b");
}
```

### 函数

<p id="div-border-left-red">如果在某个函数中使用var，那个变量就被看做局部变量，它只存在这个函数上下文中；如果没有使用var，这个变量就被看做是全局变量，如果脚本里面出现一个与之同名的全局变量，这个函数就会改变这个全局变量的值。</p>

```javascript
function square(num){
  total = num * num;
  return total
}

var total = 50;
var number = square(20);
alert(total);	//输出400
-------------我是分割线-------------
function square(num){
  var total = num * num;
  return total
}

var total = 50;
var number = square(20);
alert(total);	//输出50
```

### 对象

假设有个Person的对象，为了使用Person来描述人，需要创建一个Person对象的实例。<span id="inline-red">实例是对象的具体个体</span>。例如，你和我都是人，都可以用person对象来描述；但你和我是两个不同的个体，和可能有着不同的属性。因此对应着不同的Person对象--虽然都是Person对象，但是它们是两个不同的实例。

new关键字为对象创建一个新的实例：

```javascript
var tangcheng = new Person;
```

#### 内建对象

Array对象、Math对象、Date对象都是内建对象。

#### 宿主对象

有些已经预定义的对象是由运行环境提供，具体到web就是浏览器提供的，这些对象被称为宿主对象。不仅包括Form、Image、Element等，还包括document对象。

## DOM

window对象对应浏览器窗口本身，这个对象的属性和方法通常称为BOM（浏览器对象模型）。

DOM的节点树和家谱类似。

### 节点

节点分为元素节点、文本节点、属性节点。

![20170219637762017-02-19_15-08-01.png](../_images/《JavaScript DOM编程艺术》学习笔记/20170219637762017-02-19_15-08-01.png)

### 获取元素

#### getElementById

`getElementById`返回的是一个对象。

#### getElementsByTagName

`getElementsByTagName`返回的是一个对象数组，<span id="inline-red">即使整个文档只有一个元素，`getElementsByTagName`返回的也是数组，数组长度为1</span>。

`getElementsByTagName`允许把一个通配符作为参数，返回文档中所有元素，`*`必须放在引号中（为了与乘法操作符区别）。

```javascript
document.getElementsByTagName("*");
```

`getElementsByTagName`可以和`getElementById`结合起来使用：

```javascript
var shopping = document.getElementById("purchase");
var items = shopping.getElementsByTagName("*");
//返回shopping下面所有的标签
```

#### getElementsByClassName

`getElementsByClassName`返回的是一个具有同类名元素的数组。

可以指定多个类名，只要在字符串参数中用空格分隔类名，匹配时类名顺序不重要，就算类名还带有其他类名也可以匹配：

```javascript
document.getElementsByClassName("tc zj");
```

`getElementsByClassName`兼容性可以使用下面的脚本实现：

```javascript
function getElementsByClassName(node, classname){
  if (node.getElementsByClassName){
    //使用现有方法
    return node.getElementsByClassName(classname);
  }else{
    var results = new Array();
    var elems = node.getElementsByTagName("*");
    for (var i = 0; i<elems.length; i++){
      if (elems[i].className.indexOf(classname)!=-1){
        results[results.length] = elems[i];
      }
    }
    return results;
  }
}
```

### 获取和设置属性

#### getAttribute

`getAttribute`方法不属于document对象，只能通过元素节点对象调用。属性不存在时返回`null`。

如果something是`null`，`if (something)`和`if (something != null)`等价。

#### setAttribute

`setAttribute`方法也只能通过元素节点对象调用。

```javascript
object.setAttribute(attribute,value);
```

通过`setAttribute`对文档做出的修改后，再通过浏览器的view source（查看源码）选项去查看文档的源码时看到的仍将是改变前的值，也就是说<span id="inline-red">`setAttribute`做出的修改不会反映在文档本身的源码中</span>。这是因为：

<p id="div-border-left-red">DOM的工作模式是：先加载文档的静态内容，再动态刷新，动态刷新不影响文档的静态内容。这正是DOM的真正威力：对页面进行刷新不需要再浏览器里刷新页面。</p>

## 案例研究：JavaScript图片库

### JavaScript

DOM是一种适用于多种环境和多种程序设计语言的通用型API。如果想把从本书学到的DOM技巧运用在web浏览器以外的应用环境里，严格遵守”第1级DOM“能够让你避免与兼容性有关的任何问题。

### 应用这个JavaScript函数

#### 事件处理函数

<p id="div-border-left-green">事件处理函数的工作机制：在给某个元素添加事件处理函数后，一旦事件发生，相应的JavaScript代码就会得到执行。被调用的JavaScript代码可以返回一个值，这个值将被传递给那个事件处理函数。</p>

例如：给某个链接添加一个`onclick`事件处理函数，`onclick`事件处理函数所触发的JavaScript代码会返回`false`或者`true`。当这个链接被点击时，如果那段JavaScript代码返回的是`true`，`onclick`事件处理函数就认为”这个链接被点击了“；反之，如果返回值是`false`,`onclick`事件处理函数就认为”这个链接没有被点击“。

```html
<!--当点击时，返回的是false，链接的默认行为没有被触发-->
<a href="http://tc9011.com" onclick="return false"></a>
```

### 对这个函数进行扩展

#### childNodes属性

在一颗节点树上，`childNodes`属性可以获取任何一个元素的所有子元素，它是一个包含这个元素全部子元素的数组。

#### nodeType属性

每个节点都有`nodeType`属性，`nodeType`的值是一个数字：

* 元素节点的`nodeType`属性值是1
* 属性节点的`nodeType`属性值是2
* 文本节点的`nodeType`属性值是3

#### nodeValue属性

`nodeValue`属性用来获取或者设置一个节点的值。

`<p>`元素里的文本是另一种节点，`<p>`元素本身的`nodeValue`是一个空值：

```html
<p id="description">Choose an image</p> 
```

```javascript
var description = document.getElementById("description");
alert(description.nodeValue);//输出null
alert(description.childNodes[0].nodeValue);//输出"Choose an image"
alert(description.firstChild.nodeValue);//输出"Choose an image"
```

## 最佳实践

### 平稳退化

JavaScript使用`window`对象的`open()`方法来创建新的浏览器窗口。这个方法有三个参数：

```javascript
window.open(url,name,feature)
```

这三个参数都是可选的：

* 第一个参数是想在新窗口打开的URL地址。省略则弹出空白窗口。
* 第二个参数是新窗口的名字。可以在代码中通过这个名字与新窗口进行通信。
* 第三个参数是一个以逗号分隔的字符串，其内容是新窗口的各种属性。

#### ”javascript:“伪协议

”javascript:“伪协议让我们通过一个链接来调用JavaScript函数。

```html
<a href="javascript:popUp("http://tc9011.com");">tc9011.com</a>
```

<span id="inline- red">在HTML文档中通过”javascript:“伪协议调用JavaScript代码的做法非常不好。</span>

### 分离JavaScript

```html
<a href="http://tc9011.com" onclick="popUp(this.href);return false"></a>
```

JavaScript语言不要求事件必须在HTML文档里处理（如上面的`onclick`事件可以分离到外部JavaScript文件中。），可以在外部的JavaScript文件里面把一个事件添加到HTML文档中某个元素上。

```javascript
getElementById(id).event = active
```

如果涉及多个元素，可以用`getElementsByTagName`和`getAttribute`把事件添加到有着特定属性的一组元素上：

```javascript
var links = document.getElementsByTagName("a");
for (var i=0; i<links.length; i++){
  if (links[i].getAttribute("class") == "popup"){
    links[i].onclick = function(){
      popUp(this.getAttribute("href"));
      return false;
    }
  }
}
```

以上代码把click操作从HTML文档中分离出来。

当HTML文档全部加载完毕将触发`window.onload`事件，这个事件触发时document对象已经存在，这样可以避免HTML没有加载完全时，JavaScript代码获取不到相应的id或者class。

### 性能考虑

#### 尽量减少访问DOM和尽量减少标记

<p id="div-border-left-red">访问DOM对脚本性能会产生非常大的影响。多次访问相同的DOM，可以先把第一次搜索的结果保存在一个变量中。</p>

```javascript
if (document.getElementsByTagName("a").length > 0){
  var links = document.getElementsByTagName("a");
  for (var i=0; i<links.length; i++){
    //对每个链接节点做处理
  }
}
------------优化后------------
var links = document.getElementsByTagName("a");
if (links.length > 0){
  for (var i=0; i<links.length; i++){
    //对每个链接节点做处理
  }
}
```

## 案例研究：图片库改进版

### 它支持平稳退化吗

`href`设置为真实值，在JavaScript被禁用的情况下，链接也能跳转。

```html
<a href="images/1.jpg" title="A" onclick="showPic(this);return false"></a>
```

### 它的JavaScript与HTML标记是分离的吗

出现多个`window.onload`时，只会执行最后一个。可以使用自定义的addLoadEvent函数完成多个函数绑定到`window.onload`。

```javascript
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != "function"){
        window.onload = func;
    }else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}
------------使用------------
addLoadEvent(firstFunction);
addLoadEvent(secondFunction);
```

### 优化

`nodeName`属性总是返回一个大写字母的值，即使元素在HTML文档里面是小写字母。

### 键盘访问

用`Tab`键移动到某个链接然后按下回车键的动作也会出发`onclick`事件。

### DOM Core和HTML-DOM

* getElementById
* getElementsByTagName
* getAttribute
* setAttribute

这些方法都是DOM Core的组成部分。它们并不专属于JavaScript，支持DOM和任何一种程序设计语言都可以使用它们。

`onclick`属性属于HTML-DOM，HTML-DOM只能用来处理web文档。HTML-DOM书写更简短：

```javascript
document.getElementsByTagName("form")	-->
document.forms
--------分割线--------
element.getAttribute("src")	-->
element.src
--------分割线--------
var source = whichpic.getAttribute("href")	-->
var source = whichpic.href
--------分割线--------
placeholder.setAttribute("src",source)	-->
placeholder.src = source
```

## 动态创建标记

### 一些传统的方法

#### document.write

`document.write`最大的缺点是违背了“行为应该和表现分离”的原则，应该避免使用。

#### innerHTML属性

`innerHTML`无法区分“插入一段HTML内容”和“替换一段HTML内容”，一旦使用这个属性，里面全部内容都将被替换。

### DOM方法

浏览器实际显示的是DOM节点树，不是物理文档的内容。

#### createElement方法

createElement方法只能创建元素节点。

```javascript
document.createElement(nodeName);
```

#### appendChild方法

```javascript
parent.appendChild(child);
```

#### createTextNode方法

createTextNode方法用来创建文本节点。

### 重返图片库

> 如果元素存在只是为让DOM方法处理，用DOM方法来创建它们才是最合适的。

<p id="div-border-left-yellow">这样是不是太极端了，增加了对DOM的操作，会不会影响性能？</p>

#### 在已有元素前插入一个新元素

`insertBefore()`方法把一个新元素插入到现有元素的前面。

```javascript
parentElement.insertBefore(newElement,targetElement);
parentElement 等于 targetElement.parentNode
```

#### 在现有元素后插入一个新元素

##### 编写insertAfter函数

DOM本身没有提供insertAfter函数，可以利用已有DOM方法和属性编写一个：

```javascript
function insertAfter(newElement,targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else {
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}
```

### Ajax

#### XMLHttpRequest对象

XMLHttpRequest对象充当浏览器中的脚本（客户端）与服务器之间的中间人的角色。

`onreadystatechange`是一个事件处理函数，它会在服务器给XMLHttpRequest对象送回响应的时候被触发执行。在这个处理函数中，可以根据服务器的具体响应做相应的处理。

服务器在向XMLHttpRequest对象发回响应时，浏览器会在不同阶段更新`readyState`属性的值：

* 0表示未初始化
* 1表示正在加载
* 2表示加载完毕
* 3表示正在交互
* 4表示完成

访问服务器发送回来的数据要通过两个属性完成。一个是`responseText`属性，这个属性用于保存文本字符串形式的数据。另一个属性是`responseXML`属性，用于保存`content-Type`头部中指定为`text/xml`的数据，其实是一个`DocumentFragment`对象。

## 充实文档的内容

### 不应该做什么

<p id="div-border-left-red">遵循下面两个原则：

1、渐进增强。应该在最开始根据内容使用标记实现良好的结构，然后再逐步加强这些内容。这些增强工作可以是通过css改进呈现效果，也可以通过DOM添加各种行为。

2、平稳退化。渐进增强的实现必然支持平稳退化。缺乏必要css和DOM支持的访问者仍然可以访问到核心内容。</p>

## CSS-DOM

### 三位一体的网页

#### 结构层

结构层由HTML或XHTML之类的标记语言负责创建。

#### 表示层

表示层由css负责完成。css描述页面内容应该如何呈现。

#### 行为层

行为层负责内容应该如何响应事件这一问题。这是JavaScript和DOM主宰的领域。

### style属性

每个元素的`style`属性是都是一个对象。

引用中间带减号的css属性时，DOM要求用驼峰命名法。例如：`font-family`变成`element.style.fontFamily`。

### 何时该用DOM脚本设置样式

为有类似属性的多个元素声明样式：

```css
input[type*="text"] {
  font-size: 1em;
}
```

根据元素位置声明样式：

```css
p:first-of-type {
  font-of-size: 1em;
}
```



需要决定是采用纯粹的CSS来解决，还是利用DOM来设置样式，需要考虑以下因素：

* 这个问题最简单的解决方案是什么；
* 哪种解决方案会得到更多浏览器的支持。

### className属性

通过className属性直接赋值来设置某个元素的class属性将替换该元素的原有class属性。如要追加class属性，可以这样写：

```javascript
elem.className += " intro";
```

## 用JavaScript实现动画效果

### 动画基础知识

#### 位置

`position`属性的合法值有`static`、`fixed`、`relative`和`absolute`四种。`static`是`position`属性的默认值，意思是有关元素将按照它们在标记里出现的先后顺序出现在浏览器窗口里。`relative`含义和`static`相似，区别在于`position`属性等于`relative`的元素还可以（通过应用`float`属性）从文档的正常显示顺序里脱离出来。

如果把某个元素的`position`属性设置为`absolute`，我们就可以把它摆放到容纳它的”容器“的任何位置。这个容器要么是文档本身，要么是一个有着`fixed`或者`absolute`属性的父元素。这个元素原始标记里出现的位置与它的显示位置无关，因为它的显示位置由`top`、`left`、`right`和`bottom`等属性决定。

#### 时间递增量

JavaScript函数`parseInt`可以把字符串里的数值信息提取出来。例如：

```javascript
parseInt("18 forbidden");//返回数值18
```

### 实用的动画

W3C在web内容可访问性指南（Web Content Accessibility Guidelines）7.2节里给出这样的建议：

> 除非浏览器允许用户”冻结“移动着的内容，否则就应该避免让内容在页面中移动。（优先级2）。如果页面上有移动着的内容，就应该用脚本或插件的机制允许用户”冻结“这种移动或动态更新行为。

#### CSS

CSS的`overflow`属性用来处理一个元素的尺寸超出其容器尺寸的情况。`overflow`属性有四个可取值：

* visible：不剪裁溢出的内容。浏览器将把溢出的内容呈现在其容器元素的显示区域以外，全部内容都可见。
* hidden：隐藏溢出的内容。内容只显示在其容器元素的显示区域里，这意味着只有一部分内容可见。
* scroll：类似于hidden，浏览器将对溢出的内容进行隐藏，但是显示一个滚动条以便让用户能够滚动看到内容的其他的地方。
* auto：类似于scroll，但浏览器只在确实发生溢出时才显示滚动条。如果内容没有溢出，就不显示滚动条。

父元素的`position`设置为`relative`，子元素的（0，0）坐标将固定在父元素的左上角。

#### 变量作用域问题

属性是只与某个特定元素有关的变量。JavaScript允许我们为元素创建属性：

```javascript
element.property = value;
```

这和创建变量很像，但是区别在于这是属于某个特定元素的变量。

<p id="div-border-left-red">下面是我自己改写的时候碰到的for循环中的闭包问题，按照错误的改写，for循环中i的值始终为2，要使得for循环每次正常输出，需要先把i的值赋给每个links的i属性，调用时候用this表示当前links来调用i属性。参考资料[浅谈JavaScript for循环 闭包](http://www.jb51.net/article/87084.htm)</p>

```javascript
   //把下面改写成for循环。
	links[0].onmousemove = function () {
        moveElement("preview",-110,0,10);
    };
    links[1].onmousemove = function () {
        moveElement("preview",-220,0,10);
    };
    links[2].onmousemove = function () {
        moveElement("preview",-330,0,10);
    };
--------------错误改写--------------
     for (var i=0; i<links.length; i++){
        links[i].onmousemove = function () {
            var x = (i+1)*-110;
            moveElement("preview",x,0,10);
        };
    }
--------------正确改写--------------
     for (var i=0; i<links.length; i++){
        links[i].i = i;
        links[i].onmousemove = function () {
            var x = (this.i+1)*-110;
            moveElement("preview",x,0,10);
        };
    }
```

## HTML5

XHTML语法比HTML严格，如：标签一定要闭合、标签一定要是小写、所有属性都要赋值等。

### 几个示例

#### 音频和视频

为了保证HTML5的最大兼容性，至少要包含下列三个版本：

* 基于H.264和AAC的MP4
* WebM（VP8+Vorbis）
* 基于Theora视频和Vorbis音频的Ogg文件

为了最大程度兼容不支持HTML5的浏览器，一般还要准备一个flash或者QuickTime插件版的视频。

<p id="div-border-left-green">不同视频格式排序的时候应该把MP4放在第一位，因为IOS4之前版本中的Mobile Safari只能解析一个`<video>`元素，故把针对IOS格式的放在最前面</p>

##### 自定义控件

`<video>`元素自定义控件可以通过一些DOM属性来实现，主要包括：

* currentTime，返回当前播放的位置，以秒表示；
* duration，返回媒体的总时长，以秒表示，对流媒体返回无穷大；
* pause，表示媒体是否处于暂停状态；

此外，还有一些与特定媒体相关的事件，可以用来触发你的脚本。主要事件有：

* play，在媒体播放开始时发生；
* pause，在媒体暂停时发生；
* loadeddata，在媒体可以从当前播放位置开始播放时发生；
* ended，在媒体已播放完成而停止时发生。

不管创建什么控件，都不要忘了在`<video>`元素中添加`control`属性：

```html
<video src="movie.ogv" controls></video>
```

#### 表单

新的输入控件类型包括：

* email
* url
* date
* number
* range，用于生成滑动条
* search
* tel
* color，用于选择颜色

新的属性：

* autocomplete，用于文本输入框添加一组建议的输入项；
* autofocus，用于让表单元素自动获得焦点；
* form，用于对`<form>`标签外部的表单元素分组；
* min、max和step，用在范围（range）和数值（number）输入框中；
* pattern，用于定义一个正则表达式，以便验证输入的值；
* placeholder
* required，表示必填

## 综合示例

### css

把css可以拆成几个模块，然后用`@import`导入到一个基本的样式表`basic.css`中，如果要添加或者删除一个样式，只要编辑`basic.css`就可以。在html中也只要引入`basic.css`就行。

#### 颜色

不管哪个元素应用什么颜色，都要同时给它一个背景颜色。

### JavaScript

取到当前页面的URL可以使用`window.location.href`。

#### 表单

每一个form对象都有一个`elements.length`属性，这个属性返回表单中包含的表单元素的个数：

```javascript
form.elements.length
```

这个返回值与`childNodes.length`不一样，后者返回的是元素中包含的所有节点的个数。而form对象的`elements.length`属性只关注那些属于表单元素的元素，如：input、textarea等。

`form.elements`是包含了所有表单元素的数组。

`elements`数组中的每个表单元素都有自己的一组属性。

`elements.value`保存了表单元素的当前值。

`onfocus`事件会在用户通过按Tab键或者单击表单字段时被触发。

`onblur`事件会在用户把焦点移除表单字段时触发。

`encodeURIComponent`函数把有歧义的字符串转换成对应的ASCⅡ编码。

![20170331149096012698856.png](../_images/《JavaScript DOM编程艺术》学习笔记/20170331149096012698856.png)

<iframe src="https://www.xmind.net/embed/nh6f" width="620px" height="540px"></iframe>
