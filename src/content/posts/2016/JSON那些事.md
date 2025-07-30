---
title: JSON那些事
tags: 
  - json
published: 2016-12-18 14:24:53
toc: true
lang: zh
---

![2016121852516json-logo1-400x321.png](../_images/JSON那些事/2016121852516json-logo1-400x321.png)

<!--more-->

最近用echarts时和json打交道比较多，在此记录一下关于json的一些事情。

## 什么是JSON

w3school上给出的描述是：

>- JSON 指的是 JavaScript 对象表示法（*J*ava*S*cript *O*bject *N*otation）
>- JSON 是轻量级的文本数据交换格式
>- JSON 独立于语言 *
>- JSON 具有自我描述性，更易理解
>
>\* JSON 使用 JavaScript 语法来描述数据对象，但是 JSON 仍然独立于语言和平台。JSON 解析器和 JSON 库支持许多不同的编程语言。

JSON数据书写格式是：

```json
name : value
```

其中value的值可以是

- 数字（整数或浮点数）
- 字符串（在双引号中）
- 逻辑值（true 或 false）
- 数组（在方括号中）
- 对象（在花括号中）
- null

## JSON对象与JSON数组

### JSON对象

JSON对象在`{}`中书写，对象可以包含多个键值对；

```json
{"firstName":"John" , "lastName":"Doe"}
```

一般JSON对象中有多个键值对时，用`,`隔开，最后一个键值对结束时可以不写`,`。

### JSON数组

JSON数组在`[]`中书写，数组可以包含多个对象。

举个栗子：

```json
{
  "employees": [
      { "firstName":"John" , "lastName":"Doe" },
      { "firstName":"Anna" , "lastName":"Smith" },
      { "firstName":"Peter" , "lastName":"Jones" }
  ]
}
```

`"employees"`这个json对象包含了三个json对象的数组。

## JSON的操作

### 获取value

举个例子:

``` javascript
var employees = [
{ "firstName":"Bill" , "lastName":"Gates" },
{ "firstName":"George" , "lastName":"Bush" },
{ "firstName":"Thomas" , "lastName": "Carter" }
];
```

如果要得到Bill的firstName，可以这样写：

```javascript
employees[0].firstName;
```

因为`employees`是数组，首先通过`employees[0]`来获取第一个对象，然后用`.`加要访问的字段名称，就可以获取该字段对应的值。

### 添加和删除

#### JSON对象

```javascript
var json = {};                      //空json对像  
json['firstname'] = "cheng";       //添加二个元素  
json['lastname'] = "tang";  
console.log(json);              

delete json['lastname'];        //删除json中的某个元素  
console.log(json);  
```

#### JSON数组

```javascript
var json1 = [{"name":"tang","total":"1"},{"name":"zhou","total":"2"},{"name":"he","total":"3"}]; 

var  add = {"name":"may"};  
  
json1.push(add);              //添加一个元素  
console.log(json1);    
  
delete json1[2];              //删除一个元素  
console.log(json1); 
```

### 遍历

#### JSON对象

假设有一个JSON对象：

```javascript
var data={'a':10,'b':20,'c':30,'d':40};
```

怎么遍历这个对象呢，可以用for-in:

```javascript
for(var n in data){
  console.log(n); 
  //输出 a，b，c，d
  
  console.log(data[n]); 
  //输出 10，20，30，40
}
```

在JavaScript中`[]`等同于`.` ，所以 `data[n]`可以理解为`data.n`，只不过`n`是变量，用`.`获取不到对应的值。

#### JSON数组

假设有一个JSON数组：

```javascript
var data=[{name:"a",age:1},{name:"b",age:2},{name:"c",age:3},{name:"d",age:4}];  
```

遍历这个数组：

```javascript
for(var n in data){  
  console.log(n);  				
  //输出：0，1，2，3
  
  console.log(data[n]);  			
  //输出：{name:"a",age:1},{name:"b",age:2},{name:"c",age:3},{name:"d",age:4}			
  
  console.log("text:"+data[n].name+" value:"+data[n].age );  
  //输出：text:a value:1，text:b value:2，text:c value:3，text:d value:4
}  
```

或者：

```javascript
for (var n = 0;n < data.length; n++){
  console.log(data[n]);  			
  //输出：{name:"a",age:1},{name:"b",age:2},{name:"c",age:3},{name:"d",age:4}			
  
  console.log("text:"+data[n].name+" value:"+data[n].age );  
  //输出：text:a value:1，text:b value:2，text:c value:3，text:d value:4
}
```

## eval()与JSON.parse()

eval()可以将字符串转换为 JavaScript 对象：

```javascript
var key = 'tangcheng';
var test = '{"'+ key +'": ""}';		//定义了一个叫test的字符串
var json = eval('('+test+')');		//用eval()函数解析test
console.log(json)
//输出： Object {tangcheng: ""}
```

通过这个方法我们就可以动态设置key的值。但是使用这个方法会存在潜在的安全问题，所以可以用JSON.parse()，这个方法需要较高版本的浏览器支持。

```javascript
var key = 'tangcheng';
var test = '{"'+ key +'": ""}';		//定义了一个叫test的字符串
var json = JSON.parse(test);		//用eval()函数解析test
console.log(json)
//输出： Object {tangcheng: ""}
```

接下来就可以通过`json[key] = value`来设置key对应的value值。

## Object.keys()

> Object.keys() 方法会返回一个由给定对象的所有可枚举自身属性的属性名组成的数组，数组中属性名的排列顺序和使用for-in循环遍历该对象时返回的顺序一致（两者的主要区别是 for-in 还会遍历出一个对象从其原型链上继承到的可枚举属性）。

```javascript
	var bookAuthors = {
	    "Farmer Giles of Ham": "J.R.R. Tolkien",
	    "Out of the Silent Planet": "C.S. Lewis",
	    "The Place of the Lion": "Charles Williams",
	    "Poetic Diction": "Owen Barfield"
	};
	var arr = Object.keys(bookAuthors);
	console.log(arr);
	//输出: Array [ "Farmer Giles of Ham", "Out of the Silent Planet", "The Place of the Lion", "Poetic Diction" ]
	
	console.log(arr.length);
	//输出: 4
```

用这个方法可以把json对象转换成数组，这样可以方便的对这个数组进行一些操作。

```javascript
var test = {
  "name ": "tangcheng",
  "value": [1,2,3,4,5]
}
var arr = Object.keys(test);
console.log(arr.length); 	//输出： 2
console.log(test.length)	//输出：undefined
```

Object.keys()方法，只能使用在高版本浏览器，IE8及以下是不支持的，如果想支持IE低版本，可以参考[Javascript 计算Object的长度](http://www.zuojj.com/archives/707.html)中提供的方法。



参考文章：

[JSON中让key作为参数传入的方法](http://blog.csdn.net/zpf336/article/details/9418525)；

[Javascript 计算Object的长度](http://www.zuojj.com/archives/707.html)



