---
title: Nestjs入门（一）
published: 2019-07-14 14:12:19
tags: 
  - node
  - Nestjs
toc: true
lang: zh
---

![68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f5f746578742e737667](../_images/nest入门/68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f5f746578742e737667.svg)

<!--more-->

[Nestjs](https://nestjs.com/) 是 Node 渐进式框架，底层默认使用 express（可以通过 Adapter 转换到 fastify），可以使用 express 或者 fastify 所有中间件，完美支持 TypeScript。熟悉 Spring 和 Angular 的同学可以很快上手 Nestjs，它大量借鉴了 Spring 和 Angular 中的设计思想。

在开始写`hello world`之前，我们先来看看 Nestjs 中比较重要的设计思想和概念。

## 依赖注入

依赖注入（Dependency Injection，简称**DI**）是面向对象中**控制反转**（Inversion of Control，简称 **IoC**）最常见的实现方式，主要用来降低代码的耦合度。我们用一个例子来说明什么是控制反转。

假设你要造一辆车，你需要引擎和轮子：

```typescript
import { Engine } from './engine'
import { Tire } from './tire'

class Car {
  private engine;
  private wheel;
  
  constructor() {
    this.engine = new Engine();
    this.tire = new Tire();
  }
}
```

这时候 `Car` 这个类依赖于`Engine`和`Tire`，构造器不仅需要把依赖赋值到当前类内部属性上还需要把依赖实例化。假设，有很多种类的`Car`都用了`Engine`，这时候需要把`Engine`替换为`ElectricEngine`，就会陷入牵一发而动全身的尴尬。

那么用 IoC 来改造一下：

```typescript
import { Engine } from './engine'
import { Tire } from './tire'

class Container {
  private constructorPool;

  constructor() {
    this.constructorPool = new Map();
  }

  register(name, constructor) {
    this.constructorPool.set(name, constructor);
  }

  get(name) {
    const target = this.constructorPool.get(name);
    return new target();
  }
}

const container = new Container();
container.bind('engine', Engine);
container.bind('tire', Tire);

class Car {
  private engine;
  private tire;
  
  constructor() {
    this.engine = container.get('engine');
    this.tire = container.get('tire');
  }
}
```

此时，`container`相当于`Car`和`Engine`、`Tire`之间的中转站，`Car`不需要自己去实例化一个`Engine`或者`Tire`，`Car`和`Engine`、`Tire`之间也就没有了强耦合的关系。

从上面例子看出，在使用 IoC 之前，`Car`需要`Engine`或者`Tire`时需要自己主动去创建`Engine`或者`Tire`，此时对`Engine`或者`Tire`的创建和使用的控制权都在`Car`手上。

在使用 IoC 之后，`Car`和`Engine`或者`Tire`之间的联系就切断了，当`Car`需要`Engine`或者`Tire`时，`IoC Container`会主动创建这个对象给`Car`使用，此时`Car`获取`Engine`或者`Tire`的行为由主动获取变成了被动获取，控制权就颠倒过来。当`Engine`或者`Tire`有任何变动，`Car`不会受到影响，它们之间就完成了解耦。

当我们需要测试`Car`时，我们不需要把`Engine`或者`Tire`全部`new`一遍来构造`Car`，只需要把 mock 的`Engine`或者`Tire`， 注入到 IoC 容器中就行。

IoC 有很多实现，比如 Java 的 Spring ，PHP 的 Laravel ，前端的 Angular2+ 以及 Node 的 Nestjs等。

在 Nestjs 中，通过`@Injectable`装饰器向 IoC 容器注册：

```typescript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

在构造函数中注入`CatsService`的实例：

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`CatsService`作为一个`privider`，需要在`module`中注册，这样在该`module`启动时，会解析`module`中所有的依赖，当`module`销毁时，`provider`也会一起销毁。

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class ApplicationModule {}
```

## 模块化

Nestjs 提供了一个模块化结构，用于将同一领域内的代码组织成单独的模块。模块化的作用就是可以清晰地组织你的应用，并使用外部库扩展应用。

`Module` 把`controller`、`service`和`pipe`等打包成内聚的功能块，每个模块聚焦于一个特性区域、业务领域、工作流或通用工具。

在 Nestjs 中通过`@Module`装饰器声明一个模块，`@Module`接受一个描述模块属性的对象:

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

每个属于这个模块的`controller`、`service`等都需要在这个模块中注册，如果需要引入其他模块或者第三方模块，需要将它注册到`imports`，通过`exports`可以将相应的`service`、`module`等共享出去。

## 面向切面编程

面向切面编程（Aspect Oriented Programming，简称AOP）主要是针对业务处理过程中的切面进行提取，在某个步骤和阶段进行一些操作，从而达到 DRY（Don't Repeat Yourself） 的目的。AOP 对 OOP 来说，是一种补充，比如可以在某一切面中对全局的 Log、错误进行处理，这种一刀切的方式，也就意味着，AOP 的处理方式相对比较粗粒度。

在 Nestjs 中，AOP 分为下面几个部分（按顺序排列）：

* Middlewares
* Guards
* Interceptors (在流被操纵之前)
* Pipes
* Interceptors (在流被操纵之后)
* Exception filters (如果发现任何异常)

### Middlewares

Middleware 和 express 的中间件一样，你可以直接使用 express 中的中间件：

```typescript
import * as helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: false,
  })

  app.use(helmet())

  await app.listen(config.port, config.hostName, () => {
    Logger.log(
      `Flash API server has been started on http://${config.hostName}:${config.port}`,
    )
  })
}
```

### Guards

Guards 和前端路由中的路由守卫一样，主要确定请求是否应该由路由处理程序处理。通过守卫可以知道将要执行的上下文信息，所以和 middleware 相比，守卫可以确切知道将要执行什么。

守卫在每个中间件之后执行的，但在拦截器和管道之前。

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);			// validateRequest 函数实现 Request 的验证
  }
}
```

### Interceptors

Interceptors 可以给每一个需要执行的函数绑定，拦截器将在该函数执行前或者执行后运行。可以转换函数执行后返回的结果，扩展基本函数行为等。

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { getFormatResponse } from '../../shared/utils/response'

export interface Response<T> {
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map(getFormatResponse))
  }
}
```

### Pipes

Pipe 是具有 `@Injectable()` 装饰器的类，并实现了 `PipeTransform` 接口。通常 pipe 用来将输入数据**转换**为所需的输出或者处理**验证**。

下面就是一个`ValidationPipe`，配合`class-validator` 和 `class-transformer` ，可以更方便地对参数进行校验。

```typescript
import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed')
    }
    return value
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find(type => metatype === type)
  }
}
```

### Exception filters

内置的 Exception filters 负责处理整个应用程序中的所有抛出的异常，也是 Nestjs 中在 response 前，最后能捕获异常的机会。

```typescript
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response
      .status(status)
      .json({
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

## DTO

数据访问对象简称DTO（Data Transfer Object）， 是一组需要跨进程或网络边界传输的聚合数据的简单容器。它不应该包含业务逻辑，并将其行为限制为诸如内部一致性检查和基本验证之类的活动。

在 Nestjs 中，可以使用 TypeScript 接口或简单的类来完成。配合 `class-validator`和`class-transformer` 可以很方便地验证前端传过来的参数：

```typescript
import { IsString, IsInt, MinLength, MaxLength } from "class-validator";
import { ApiModelProperty } from '@nestjs/swagger'

export class CreateCatDto {
  @ApiModelProperty()
  @IsString()
  @MinLength(10, {
    message: "Name is too short"
  })
  @MaxLength(50, {
    message: "Name is too long"
  })
  readonly name: string;
  
  @ApiModelProperty()
  @IsInt()
  readonly age: number;
  
  @ApiModelProperty()
  @IsString()
  readonly breed: string;
}
```

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }
}
```

如果 Body 中的参数不符合要求，会直接报 `Validation failed` 错误。

## ORM

ORM 是"对象-关系映射"（Object/Relational Mapping） 的缩写，通过实例对象的语法，完成关系型数据库的操作。通过 ORM 就可以用面向对象编程的方式去操作关系型数据库。

在 Java 中，通常会有 DAO（Data Access Object， 数据访问对象）层，DAO 中包含了各种数据库的操作方法。通过它的方法，对数据库进行相关的操作。DAO 主要作用是分离业务层与数据层，避免业务层与数据层耦合。

在 Nestjs 中，可以用 TypeORM 作为你的 DAO 层，它支持 MySQL / MariaDB / Postgres / CockroachDB / SQLite / Microsoft SQL Server / Oracle / MongoDB / NoSQL。

在 typeORM 中数据库的表对应的就是一个类，通过定义一个类来创建实体。实体（Entity）是一个映射到数据库表（或使用 MongoDB 时的集合）的类，通过`@Entity()`来标记。

```typescript
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
```

上面代码将创建以下数据库表：

```tex
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| firstName   | varchar(255) |                            |
| lastName    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

使用 `@InjectRepository()` 修饰器注入 对应的`Repository`，就可以在这个`Repository`对象上进行数据库的一些操作。

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
```

## 参考

[Nestjs](https://docs.nestjs.com/providers)

[浅析控制反转](https://zhuanlan.zhihu.com/p/60995312)

[依赖注入和控制反转的理解](https://blog.csdn.net/bestone0213/article/details/47424255)

[从Express到Nestjs，谈谈Nestjs的设计思想和使用方法](https://github.com/forthealllight/blog/issues/35)
