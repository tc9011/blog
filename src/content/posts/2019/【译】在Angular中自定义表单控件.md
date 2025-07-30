---
title: 【译】在Angular中自定义表单控件
published: 2019-12-12 02:06:13
tags: 
  - Angular
toc: true
lang: zh
---

![custom-form-controls-in-angular-2](../_images/在Angular中自定义表单控件/custom-form-controls-in-angular-2.jpg)

<!--more-->

> 原文链接：[Custom Form Controls in Angular](https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html)

在创建表单时，Angular可以帮助我们完成很多事情。我们已经介绍了有关[Angular中的Forms](https://blog.thoughtram.io/forms-in-angular-2)的几个主题，例如模型驱动的表单和模板驱动的表单。如果您还没有阅读这些文章，我们强烈建议您先去阅读这些文章，因为这篇文章是基于它们的。[Almero Steyn](https://twitter.com/kryptos_rsa)是我们的培训学生之一，后来作为Angular的文档编写团队的一员为正式文档做出了贡献，他还为创建自定义控件撰写了非常不错的[介绍](http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel)。

他的文章启发了我们，我们想更进一步，探讨如何创建与Angular的 form API很好地集成的自定义表单控件。

## 自定义表单控件注意事项

在开始并构建自己的自定义表单控件之前，我们要确保我们对创建自定义表单控件时所起的作用有所了解。

首先，重要的是要认识到，如果有一个原生元素（如`<input type="number">`）可以完美地完成工作，那么我们不应该立即创建自定义表单控件。似乎原生表单元素的功能常常被低估了。尽管我们经常看到可以输入的文本框，但它为我们带来了更多工作。**每个原生表单元素都是可访问的**，有些输入具有内置的验证，有些甚至在不同平台（例如移动浏览器）上提供了改进的用户体验。

因此，每当考虑创建自定义表单控件时，我们都应该问自己：

- 是否存在具有相同语义的原生元素？
- 如果是，我们是否可以仅依靠该元素并使用CSS和/或渐进式增强功能来更改其外观/行为以满足我们的需求？
- 如果不是，自定义控件将是什么样？
- 我们如何使其可访问？
- 在不同平台上的行为是否不同？
- 如何验证？

可能还有更多要考虑的事情，但这是最重要的。如果确实要创建一个自定义表单控件（在Angular中），则应确保：

- 它将更改正确传播到DOM / View
- 它将更改正确传播到Model
- 如果需要，它带有自定义验证
- 它将有效性状态添加到DOM，以便可以设置样式
- **可访问**
- 它适用于模板驱动的表单
- 它适用于响应式的表单
- 它需要响应灵敏

在本文中，我们将讨论不同的场景，以演示如何实现这些功能。不过，**本文将不涉及可访问性**，因为将有后续文章对此进行深入讨论。

## 创建一个自定义计数器

让我们从一个非常简单的计数器组件开始。这个想法是要有一个组件，让我们可以对 model 值递增和递减。是的，如果我们考虑[要考虑的事情](https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html#things-to-consider)，我们可能会意识到一个 `<input type="number">`可以解决问题。

但是，在本文中，我们要演示如何实现自定义表单控件，而自定义计数器组件似乎微不足道，以至于使事情看起来不太复杂。此外，我们的计数器组件将具有不同的外观，该外观在所有浏览器中均应相同，无论如何我们都可能会受到原生input元素的限制。

我们从原始组件开始。我们需要的是一个可以更改的 model 值和两个触发更改的按钮。

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'counter-input',
  template: `
    <button (click)="increment()">+</button>
    {{counterValue}}
    <button (click)="decrement()">-</button>
  `
})
class CounterInputComponent {

  @Input()
  counterValue = 0;

  increment() {
    this.counterValue++;
  }

  decrement() {
    this.counterValue--;
  }
}
```

这里没什么特别的。`CounterInputComponent`有一个`counterValue`，它被插入到模板中，可以分别通过`increment()`和`decrement()`方法对其进行递增或递减。这个组件工作得很好，一旦在应用程序模块上声明了这个组件，我们就可以使用它，比如像这样将它放入另一个组件中：

**app.module.ts**

```typescript
@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, CounterInputComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**app.component.ts**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: `
    <counter-input></counter-input>
  `,
})
class AppComponent {}
```

很好，但是现在我们想使其与Angular的 Form API一起使用。理想情况下，我们最终得到的是一个自定义控件，该控件可与模板驱动的表单和响应式驱动的表单一起使用。例如，在最简单的情况下，我们应该能够创建一个模板驱动的表单，如下所示：

```typescript
<!-- this doesn't work YET -->
<form #form="ngForm" (ngSubmit)="submit(form.value)">
  <counter-input name="counter" ngModel></counter-input>
  <button type="submit">Submit</button>
</form>
```

如果您不熟悉该语法，请查看[Angular中](https://blog.thoughtram.io/angular/2016/03/21/template-driven-forms-in-angular-2.html)有关[模板驱动表单的](https://blog.thoughtram.io/angular/2016/03/21/template-driven-forms-in-angular-2.html)文章。好的，但是我们怎么实现？我们需要学习`ControlValueAccessor`是什么，因为Angular就是使用它来建立表单模型和DOM元素之间的联系。

## 了解ControlValueAccessor

虽然我们的计数器组件有效，但目前尚无法将其连接到外部表单。实际上，如果我们尝试将任何形式的表单模型绑定到我们的自定义控件，则会收到错误消息，提示缺少`ControlValueAccessor`。而这正是我们实现与Angular中的表单进行正确集成所需要的。

那么，什么是`ControlValueAccessor`？好吧，还记得我们之前谈到的实现自定义表单控件所需的内容吗？我们需要确保的一件事是，更改从模型传播到视图/ DOM，也从视图传播回模型。**这是`ControlValueAccessor`目的。**

 `ControlValueAccessor`是用于处理以下内容的接口：

- 将表单模型中的值写入视图/ DOM
- 当视图/ DOM更改时通知其他表单指令和控件

Angular之所以具有这样的界面，是因为DOM元素需要更新的方式可能因input类型而异。例如，普通文本输入框具有`value`属性，这个是一个需要被写入的属性，而复选框带有`checked`属性，这是一个需要更新的属性。如果我们深入了解，我们意识到，**每个input类型都有一个`ControlValueAccessor`** ，它知道如何更新其视图/ DOM。

`DefaultValueAccessor`用于处理文本输入和文本区域，`SelectControlValueAccessor`用于处理选择输入，`CheckboxControlValueAccessor`用于处理复选框等等。

我们的计数组件需要一个`ControlValueAccessor`，它知道如何更新`counterValue`并告知外部变化的信息。一旦实现该接口，便可以与Angular表单进行对话。

## 实现ControlValueAccessor

该`ControlValueAccessor`接口如下所示：

```typescript
export interface ControlValueAccessor {
  writeValue(obj: any) : void
  registerOnChange(fn: any) : void
  registerOnTouched(fn: any) : void
}
```

**writeValue（obj：any）**是将表单模型中的新值写入视图或DOM属性（如果需要）的方法。这是我们要更新`counterValue`的地方，因为这就是视图中使用的东西。

**registerOnChange（fn：any）**是一种注册处理程序的方法，当视图中的某些内容发生更改时会调用该处理程序。它具有一个告诉其他表单指令和表单控件以更新其值的函数。换句话说，这就是我们希望`counterValue`在视图中进行更改时调用的处理程序函数。

与`registerOnChange()`相似的**registerOnTouched（fn：any）**会注册一个专门用于当控件收到触摸事件时的处理程序。在我们的自定义控件中不需要用到它。

 `ControlValueAccessor`需要访问其控件的视图和模型，这意味着自定义表单控件本身必须实现该接口。让我们从`writeValue()`开始。首先，我们实现接口并更新类签名。

```typescript
import { ControlValueAccessor } from '@angular/forms';

@Component(...)
class CounterInputComponent implements ControlValueAccessor {
  ...
}
```

接下来，我们实现`writeValue()`。如前所述，它从表单模型中获取一个新值并将其写入视图中。在我们的例子中，我们所需要做的只是更新的`counterValue`属性，因为它是自动插入的。

```typescript
@Component(...)
class CounterInputComponent implements ControlValueAccessor {
  ...
  writeValue(value: any) {
    this.counterValue = value;
  }
}
```

初始化表单时，将使用表单模型的初始值调用此方法。这意味着它将覆盖默认值`0`，这很好，但是如果我们考虑前面提到的简单表单设置，我们会意识到表单模型中没有初始值：

```html
<counter-input name="counter" ngModel></counter-input>
```

这将导致我们的组件呈现一个空字符串。为了快速解决，我们仅在不是`undefined`时设置该值：

```typescript
writeValue(value: any) {
  if (value !== undefined) {
    this.counterValue = value;
  }
}
```

现在，仅当有实际值写入控件时，它才会覆盖默认值。接下来，我们实现`registerOnChange()`和`registerOnTouched()`。`registerOnChange()`可以通知外界组件内的变化。只要我们愿意，每当在此处传播变更，就可以在这里做一些特殊的工作。`registerOnTouched()`注册了一个回调函数，只要表单控件是“touched”，该回调便会执行。例如，当 input 元素失去焦点时，它将触发 touch 事件。我们不想在此事件上做任何事情，因此我们可以使用一个空函数来实现该接口。

```typescript
@Component(...)
class CounterInputComponent implements ControlValueAccessor {
  ...
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
```

很好，我们的计数器现在实现了该`ControlValueAccessor`接口。我们需要做的下一件事是，只要`counterValue`在视图中进行更改，就调用`propagateChange()`。换句话说，如果单击`increment()`或`decrement()`按钮，我们希望将新值传播到外界。

让我们相应地更新这些方法。

```typescript
@Component(...)
class CounterInputComponent implements ControlValueAccessor {
  ...
  increment() {
    this.counterValue++;
    this.propagateChange(this.counterValue);
  }

  decrement() {
    this.counterValue--;
    this.propagateChange(this.counterValue);
  }
}
```

我们可以使用属性访问器使此代码更好一些。`increment()`和`decrement()`这两种方法，每当`counterValue`变化时都会调用`propagateChange()`。让我们使用 getter 和 setter 摆脱多余的代码：

```typescript
@Component(...)
class CounterInputComponent implements ControlValueAccessor {
  ...
  @Input()
  _counterValue = 0; // 注意'_'

  get counterValue() {
    return this._counterValue;
  }

  set counterValue(val) {
    this._counterValue = val;
    this.propagateChange(this._counterValue);
  }

  increment() {
    this.counterValue++;
  }

  decrement() {
    this.counterValue--;
  }
}
```

`CounterInputComponent`已经接近完成。即使它实现了`ControlValueAccessor`接口，也没有任何东西告诉Angular应该怎样做。我们需要注册。

## 注册ControlValueAccessor

实现接口仅仅才完成了一半。众所周知，ES5中不存在接口，这意味着一旦代码被编译，该信息就消失了。因此，虽然我们的组件实现了该接口，但是我们仍然需要使 Angular 接受它。

在关于[Angular中的多注册提供商](https://blog.thoughtram.io/angular2/2015/11/23/multi-providers-in-angular-2.html)的文章中，我们了解到 Angular 使用了一些 DI 令牌来注入多个值，以便对它们进行某些处理。例如，有一个`NG_VALIDATORS`令牌为 Angular 提供了表单控件上所有已注册的验证器，我们可以在其中添加自己的验证器。

为了让`ControlValueAccessor`控制表单控件，Angular内部注入了在`NG_VALUE_ACCESSOR`令牌上注册的所有值。因此，我们需要做的就是扩展`NG_VALUE_ACCESSOR`的多注册提供商，让`NG_VALUE_ACCESSOR`使用我们自己的值访问器实例（也就是我们的组件）。

让我们马上试一下：

```typescript
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  ...
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterInputComponent),
      multi: true
    }
  ]
})
class CounterInputComponent {
  ...
}
```

如果这段代码对您没有任何意义，您绝对应该查看那篇[Angular中的多注册提供商](https://blog.thoughtram.io/angular2/2015/11/23/multi-providers-in-angular-2.html)的文章，但最重要的是，我们正在将自定义的值访问器添加到 DI 系统，以便 Angular 可以拿到该值访问器的实例。我们还必须使用`useExisting`，因为`CounterInputComponent`将在使用它的组件中，作为指令依赖创建。如果不这样做，则会得到一个新实例，因为这是 Angular 中 DI 的工作方式。`forwardRef()`回调函数将在[这篇文章](https://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html)中进行解释。

太棒了，我们的自定义表单控件现在可以使用了！

## 在模板驱动的表单中使用它

我们已经看到计数器组件可以按预期工作，但是现在我们希望将其放入实际表单中，并确保它在所有常见情况下都可以工作。

### 激活 Form API

正如我们[在Angular中模板驱动的表单](https://blog.thoughtram.io/angular/2016/03/21/template-driven-forms-in-angular-2.html#activating-new-form-apis)文章中所讨论的那样，我们需要像这样激活 Form API：

```typescript
import { FormsModule} from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule], // 在这里添加 FormsModule
  ...
})
export class AppModule {}
```

### 没有模型初始化

差不多了！还记得我们之前的`AppComponent`吗？让我们在其中创建一个模板驱动的表单，看看它是否有效。这是一个使用计数器控件而不用值初始化的示例（它将使用自己的内部默认值：`0`）：

```js
@Component({
  selector: 'app-component',
  template: `
    <form #form="ngForm">
      <counter-input name="counter" ngModel></counter-input>
    </form>

    <pre>{{ form.value | json }}</pre>
  `
})
class AppComponent {}
```

> **特别提示：**使用json管道是调试表单值的好技巧。

`form.value`返回以JSON结构映射到其名称的所有表单控件的值。这就是为什么`JsonPipe`会输出一个带有`counter`计数器值的对象字面量。

### 具有属性绑定的模型初始化

这是另一个使用属性绑定将值绑定到自定义控件的示例：

```typescript
@Component({
  selector: 'app-component',
  template: `
    <form #form="ngForm">
      <counter-input name="counter" [ngModel]="outerCounterValue"></counter-input>
    </form>

    <pre>{{ form.value | json }}</pre>
  `
})
class AppComponent {
  outerCounterValue = 5;  
}
```

### 使用ngModel进行双向数据绑定

当然，我们可以利用`ngModel`的双向数据绑定即可实现，只需将语法更改为此：

```html
<p>ngModel value: {{outerCounterValue}}</p>
<counter-input name="counter" [(ngModel)]="outerCounterValue"></counter-input>
```

多么酷啊？我们的自定义表单控件可与模板驱动的表单API无缝配合！让我们看看使用响应式表单时的表现。

## 在响应式表单中使用它

下面的示例使用 Angular 的响应式表单指令，所以不要忘记添加`ReactiveFormsModule`到`AppModule`，就像[这篇文章](https://blog.thoughtram.io/angular/2016/06/22/model-driven-forms-in-angular-2.html)中讨论的。

### 通过formControlName绑定值

一旦设置了代表表单模型的`FormGroup`，就可以将其绑定到表单元素，并使用`formControlName`关联每个控件。此示例将值绑定到表单模型中的自定义表单控件：

```typescript
@Component({
  selector: 'app-component',
  template: `
    <form [formGroup]="form">
      <counter-input formControlName="counter"></counter-input>
    </form>

    <pre>{{ form.value | json }}</pre>
  `
})
class AppComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      counter: 5
    });
  }
}
```

## 添加自定义验证

我们要看的最后一件事是如何向我们的自定义控件添加验证。实际上，我们已经写了一篇关于[Angular 中的自定义验证器](https://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html)的文章，所有需要了解的内容都写在这里。但是，为了使事情更清楚，我们将通过示例向自定义表单控件中添加一个自定义验证器。

假设我们要让控件在`counterValue`大于`10`或小于`0`时变为无效。如下所示：

```typescript
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Component({
  ...
  providers: [
    { 
      provide: NG_VALIDATORS,
      useValue: (c: FormControl) => {
        let err = {
          rangeError: {
            given: c.value,
            max: 10,
            min: 0
          }
        };

        return (c.value > 10 || c.value < 0) ? err : null;
      },
      multi: true
    }
  ]
})
class CounterInputComponent implements ControlValueAccessor {
  ...
}
```

我们注册了一个验证器函数，如果控制值有效返回`null`，则返回该函数；否则，返回一个错误对象。这已经很好用了，我们可以像这样显示错误消息：

```html
<form [formGroup]="form">
  <counter-input
    formControlName="counter"
    ></counter-input>
</form>

<p *ngIf="!form.valid">Counter is invalid!</p>
<pre>{{ form.value | json }}</pre>
```

## 使验证器可测试

不过，我们可以做得更好。使用响应式表单时，我们可能要在具有该表单功能但没有DOM的情况下测试组件。在这种情况下，验证器将不存在，因为它是由计数器组件提供的。通过将验证器函数提取到其自己的声明中并将其导出，可以轻松解决此问题，以便其他模块可以在需要时导入它。

让我们将代码更改为：

```typescript
export function validateCounterRange(c: FormControl) {
  let err = {
    rangeError: {
      given: c.value,
      max: 10,
      min: 0
    }
  };

  return (c.value > 10 || c.value < 0) ? err : null;
}

@Component({
  ...
  providers: [
    { 
      provide: NG_VALIDATORS,
      useValue: validateCounterRange,
      multi: true
    }
  ]
})
class CounterInputComponent implements ControlValueAccessor {
  ...
}
```

> **特别提示：**在构建响应式表单时，为了使验证器功能可用于其他模块，优良作法是先声明它们并在注册提供商的配置中引用它们。

现在，可以将验证器导入并添加到我们的表单模型中，如下所示：

```js
import { validateCounterRange } from './counter-input';

@Component(...)
class AppComponent implements OnInit {
  ...
  ngOnInit() {
    this.form = this.fb.group({
      counter: [5, validateCounterRange]
    });
  }
}
```

这个自定义控件越来越好了，但是如果验证器是可配置的，那不是**真的**很酷吗！这样自定义表单控件的使用者可以决定最大和最小值是什么。

## 使验证可配置

理想情况下，我们的自定义控件的使用者应该能够执行以下操作：

```html
<counter-input
  formControlName="counter"
  counterRangeMax="10"
  counterRangeMin="0"
  ></counter-input>
```

由于Angular的依赖项注入和属性绑定系统，这非常容易实现。基本上，我们想要做的是让我们的[验证器具有依赖项](https://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html#custom-validators-with-dependencies)。

让我们从添加输入属性开始。

```js
import { Input } from '@angular/core';
...

@Component(...)
class CounterInputComponent implements ControlValueAccessor {
  ...
  @Input()
  counterRangeMax;

  @Input()
  counterRangeMin;
  ...
}
```

接下来，我们必须以某种方式将这些值传递给我们的`validateCounterRange(c: FormControl)`，但是对于每个API，它们需要共用一个`FormControl`。这意味着我们需要使用工厂模式来创建该验证器函数，该工厂创建一个如下所示的闭包：

```js
export function createCounterRangeValidator(maxValue, minValue) {
  return function validateCounterRange(c: FormControl) {
    let err = {
      rangeError: {
        given: c.value,
        max: maxValue,
        min: minValue
      }
    };

    return (c.value > +maxValue || c.value < +minValue) ? err: null;
  }
}
```

太好了，我们现在可以使用从组件内部的输入属性获得的动态值来创建验证器函数，并实现 Angular 中用于执行验证的`validate()`方法：

```js
import { Input, OnInit } from '@angular/core';
...

@Component(...)
class CounterInputComponent implements ControlValueAccessor, OnInit {
  ...

  validateFn:Function;

  ngOnInit() {
    this.validateFn = createCounterRangeValidator(this.counterRangeMax, this.counterRangeMin);
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}
```

这可行，但引入了一个新问题：`validateFn`仅在`ngOnInit()`中设置。如果`counterRangeMax`或`counterRangeMin`通过绑定更改，该怎么办？我们需要根据这些更改创建一个新的验证器函数。幸运的是，有一个`ngOnChanges()`生命周期挂钩可以使我们做到这一点。我们要做的就是检查输入属性之一是否发生更改，然后重新创建我们的验证函数。我们甚至可以摆脱`ngOnInit()`，因为无论如何`ngOnChanges()`都会在`ngOnInit()`之前被调用：

```js
import { Input, OnChanges } from '@angular/core';
...

@Component(...)
class CounterInputComponent implements ControlValueAccessor, OnChanges {
  ...

  validateFn:Function;

  ngOnChanges(changes) {
    if (changes.counterRangeMin || changes.counterRangeMax) {
      this.validateFn = createCounterRangeValidator(this.counterRangeMax, this.counterRangeMin);
    }
  }
  ...
}
```

最后一点是，我们需要更新验证器的提供商，因为它不再只是一个函数，而是执行验证的组件本身：

```js
@Component({
  ...
  providers: [
    ...
    { 
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CounterInputComponent),
      multi: true
    }
  ]
})
class CounterInputComponent implements ControlValueAccessor, OnInit {
  ...
}
```

信不信由你，我们现在可以为自定义表单控件配置最大值和最小值！如果我们要构建模板驱动的表单，则看起来就像这样：

```html
<counter-input
  ngModel
  name="counter"
  counterRangeMax="10"
  counterRangeMin="0"
  ></counter-input>
```

这也适用于表达式：

```html
<counter-input
  ngModel
  name="counter"
  [counterRangeMax]="maxValue"
  [counterRangeMin]="minValue"
  ></counter-input>
```

如果要构建响应式表单，则可以简单地使用验证器工厂将验证器添加到表单控件中，如下所示：

```js
import { createCounterRangeValidator } from './counter-input';

@Component(...)
class AppComponent implements OnInit {
  ...
  ngOnInit() {
    this.form = this.fb.group({
      counter: [5, createCounterRangeValidator(10, 0)]
    });
  }
}
```

