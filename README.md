​

#### HTML 标签

编码简约

##### meta 标签使用

- 页面定时刷新（如果你只是想实现页面的定时刷新或跳转（比如某些页面缺乏访问权限，在 x 秒后跳回首页这样的场景）建议你可以实践下 meta 标签的用法。）

```html
<!-- 5s后跳转到同源下的table.html页面 -->
<meta http-equiv="Refresh" content="5; URL=table.html" />
```

- 设置 keywords 关键字和页面描述，用于搜索引擎查询

```html
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3" />
<meta http-equiv="description" content="This is my page" />
```

##### 消息提醒

HTML5 标准发布之前，浏览器没有开放图标闪烁、弹出系统消息之类的接口，只能借助一些 Hack 的手段，比如修改 title 标签来达到类似的效果（HTML5 下可使用 Web Notifications API 弹出系统消息）。

```js
let msgNum = 1; // 消息条数
let cnt = 0; // 计数器
const inerval = setInterval(() => {
  cnt = (cnt + 1) % 2;
  if (msgNum === 0) {
    // 通过DOM修改title
    document.title += `聊天页面`;
    clearInterval(interval);
    return;
  }
  const prefix = cnt % 2 ? `新消息(${msgNum})` : "";
  document.title = `${prefix}聊天页面`;
}, 1000);
```

通过模拟消息闪烁，可以让用户在浏览其他页面的时候，及时得知服务端返回的消息。

HTML5 Notifications API

允许网页或应用程序在系统级别发送在页面外部显示的通知，Notification 生成的消息不依附于某个页面，仅仅依附于浏览器，避免传统本页面内接收消息的方式无法跨页面的问题。

##### 性能问题

针对经常出现的问题，如渲染速度慢，请求时间长等，可以通过合理的使用标签解决

- script 标签：调整加载顺序提升渲染速度
  浏览器渲染引擎在遇到`<script>`标签时，通过网络加载，加载完成后会切换到 JavaScript 引擎去执行相应代码，执行完成后再次切换回渲染引擎继续渲染。script 出现会中断 HTML 加载，且 script 会顺序的加载、执行，所有 script 执行完成后再解析 HTML。

  ![script](./images/script.png)
  通过设置 script 标签属性解决

  - async：立即请求文件，但不阻塞渲染引擎，而是文件加载完毕后阻塞渲染引擎并立即执行文件内容。HTML 解析和 script 下载同步进行，script 执行会中断 HTML 解析；script 执行顺序和 tag 出现顺序不一定相同；script 可能会在 document loaded 之后执行。

  ![async](./images/async.jpg)

  - defer：立即请求文件，但不阻塞渲染引擎，等到解析完 HTML 之后再执行文件内容。HTML 解析和 script 下载同步进行；script 会在 HTML 解析完成后和 document loaded 之前执行，且执行顺序和 tag 出现顺序一致。

  ![defer](./images/defer.jpg)

  - HTML5 标准 type 属性，对应值为“module”。让浏览器按照 ECMA Script 6 标准将文件当作模块进行解析，默认阻塞效果同 defer，也可以配合 async 在请求完成后立即执行

- link 标签

#### DOM

操作耗时：

1. 线程切换
2. 重新渲染

可行方法：

#### DOM 事件

防抖

节流

代理（事件代理或事件委托）

DOM 事件标准

代码如何抽象成公共函数？

#### 布局

版心：内容所在的区域

单列布局

两列布局

三列布局

共同步骤

垂直布局

栅格布局的列数

#### css 代码管理

全局样式、公共样式

组件样式

样式文件管理模式

避免样式冲突

BEM block element modify

高效复用样式

CSS in JavaScript

#### 手写 css 预处理

#### 浏览器如何渲染页面

1. 字节流解码
2. 输入流预处理
3. 令牌化
4. 构造 DOM 树
5. 构建渲染树
6. 布局
7. 绘制

#### JavaScript 数据类型

undefined
Null
Boolean
Number NaN infinity
String
Symbol

类型转换
装箱操作和拆箱操作

Object 键值对集合
深浅拷贝

#### 函数 javaScript 一等公民

this 关键字
函数的转换
原型和原型链
new 操作符实现了什么
怎么实现原型链实现多层继承
typeof 和 instanceof
作用域
全局、块级、函数
命名提升
闭包

#### 代码没有按照编写的顺序执行

异步 非阻塞
同步 阻塞
事件循环 宏任务和微任务
处理异步
promise async...await...

<!-- [].reduce(item => {

}) -->

Promise.all([...])
Promise.allSelected([...])
Promise.race([...])

#### 代码复用

ES6 模块

import 动态模块

CommonJS
AMD 异步加载
CMD 懒加载 整合 Commonjs 和 AMD
UMD 模块封装工具

ES5 标准下如何编写模块
