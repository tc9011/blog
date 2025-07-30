---
title: Echarts改造之数据分离
tags:
  - Echarts
  - Angular
published: 2017-01-08 20:47:48
toc: true
lang: zh
---

![2017012422826banner2.png](../_images/Echarts改造之数据分离/echarts.jpg)

<!--more-->

Echarts官网中的数据都是写死的，如何让Echarts根据后台传过来的数据进行变化呢？下面介绍一下Angular2中嵌入Echarts，并实现数据分离。

先创建一个`line.component.ts`文件，`component`装饰器中这样写：

```typescript
@Component({
  moduleId: module.id,
  selector: 'line',
  templateUrl: 'line.html',
  styleUrls: ['line.component.css'],
})
```

class中实现AfterViewInit接口，用于初始化组件视图后调用：

```typescript
export class LineComponent implements AfterViewInit {
  ngAfterViewInit(){
    
  }
}
```

在class中首先定义一些变量：

```typescript
 lineData:Line;
  id:string;
  option:any = {
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {show: true, type: ['bar']},
        dataZoom: {show: true},
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    legend: {
      selectedMode: true,
      selected: {},
      right: '0px',
      top: '80px',
      orient: 'vertical',
      textStyle: {
        fontSize: 12,
      },
      show: true,
      data: []
    },
    xAxis: {
      data: [],
      axisLabel: {
        interval: 0,
      }
    },
    grid: {
      left: '9%',
      x2: 150,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
      }
    ],
    series: []
  };
```

在需要调用`line.component.ts`的父组件html中添加下面代码，把父组件中的myOption中的数据传递给data属性：

```html
<line [data]='myOption'></line>
```

在父组件的ts文件中，从后端读取数据，并把数据写入myOption（这里其实对原始数据进行了一次处理，让传给`line.component.ts`的数据更加容易处理）：

```typescript
myOption:any;  
constructor(){
	this.myOption = {
     	 "data": []
    	};
}
setMyOption(){
  let that = this;
  let obj = {
              "name": fieldkey,
              "value": [],
              "systime": []
            };
  that.myOption.data = [];
  //先往obj中写入数据，再往data数组中写入对象
}
getUrlData(){
  //从后端读取数据
}
```

再回到`line.component.ts`中，引入myOption中的数据：

```typescript
 @Input() data:any;  
```

实现AfterViewInit接口：

```typescript
ngAfterViewInit() {
    let that = this;
    that.lineData = that.data;  //data赋值给linedata
  
    //清空原始数组
    that.option.legend.data = [];
    that.option.series.data = [];
    that.option.xAxis.data = [];
    that.option.series = [];
  
    //配置option
    that.setDataToOption();
  
    //调用echarts画图
    that.createCharts();
  }
```

往echarts中写入从后端读取的数据：

```typescript
  setDataToOption() {
    let that = this;
    let dataLength = 		      this.lineData.data.length;
    let xAxisData = that.option.xAxis.data;
    let legend = that.option.legend;
 
    for (let n = 0; n < dataLength; n++) {
      let item = that.lineData.data[n];
      legend.selected[item.name] = false; //往legend的selected中推送数据
      let seriesData = {
        name: item.name,
        type: 'line',
        showAllSymbol: true,
        data: []
      };
      let legendData = {
        name: item.name,
        icon: 'square'
      };
      let arr = Object.keys(item.value);
      for (let t = 0; t < arr.length; t++) {
        seriesData.data.push(item.value[t]);
        if (n === 0) {
          xAxisData.push(item.systime[t]); //往x轴推送数据
        }
      }
      legend.data.push(legendData);   //往legend的data中推送数据
      that.option.series.push(seriesData);    //往series中推送数据
    }
 
    //设置x轴间隔
    if (xAxisData.length > 10) {
      that.option.xAxis.axisLabel.interval = Math.ceil(xAxisData.length/10);
    }
  }
```

创建echarts：

```typescript
 createCharts() {
    let that = this;
    let dom:any = document.getElementById(that.id);
    let myChart:any = echarts.init(dom, 'macarons');
    myChart.setOption(that.option);
  }
```

这样就实现了从后端读取数据，然后echarts显示在界面上。
