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

  - dns-prefetch：设置 rel 属性值为“dns-prefetch”时，会对某个域名进行解析并缓存，并请求同域名资源时，可省去 DNS 查询 IP 的过程，减少时间损耗。
  - preconnect：让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。
  - prefetch/preload：两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。
  - prerender：浏览器不仅会加载资源，还会解析执行页面，进行预渲染。

  设置 dns-prefetch 可减少域名解析时间，设置 preconnect 可减少 TCP 连接等时间消耗，通过 prefetch/preload 可以让资源提前下载，使用的时候直接使用，而 prerender 可以加载资源同时预渲染，省去渲染页面的时间。

#### DOM

DOM 主要由三部分构成：DOM 节点、DOM 事件、选择区域（一般用于富文本编辑类业务）

##### DOM 节点

- 标签
  标签是 HTML 的基本单位，比如 p、div、input
- 元素
  节点是 DOM 树的基本单位，有多种类型，比如注释节点、文本节点
  元素是节点中的一种，与 HTML 标签相对应，比如 p 标签会对应 p 元素。

  ```html
  <p>亚里士多德</p>
  ```

  “p” 是标签， 生成 DOM 树的时候会产生两个节点，一个是元素节点 p，另一个是字符串为“亚里士朱德”的文本节点。

##### DOM 操作耗时

1. 线程切换
   浏览器包括渲染引擎（浏览器内核）和 JavaScript 引擎，他们都是单线程运行。因此开发方便，避免了多线程下的死锁、竞争等问题，但同时失去了并发能力。

   浏览器为避免两个引擎同时操作页面导致冲突问题，增加了一个机制，同一时间只有一个引擎在运行，另一个被阻塞。操作系统进行线程切换时需要保存上一个线程执行时的状态信息并读取下一个线程的状态信息，也就是上下文切换，这个操作相对而言比较耗时。

   每次 DOM 操作就会引发线程的上下文切换——从 JavaScript 引擎切换到渲染引擎执行对应操作，然后再切换回 JavaScript 引擎继续执行，这就带来了性能损耗。单次切换消耗的时间是非常少的，但是如果频繁地大量切换，那么就会产生性能问题。

   比如下面的测试代码，循环读取一百万次 DOM 中的 body 元素的耗时是读取 JSON 对象耗时的 10 倍。

   ```js
   // 测试次数：一百万次
   const times = 1000000;
   // 缓存 body 元素
   console.time("object");
   let body = document.body;
   // 循环赋值对象作为对照参考
   for (let i = 0; i < times; i++) {
     let tmp = body;
   }
   console.timeEnd("object"); // object: 1.8681640625ms

   console.time("dom");
   // 循环读取 body 元素引发线程切换
   for (let i = 0; i < times; i++) {
     let tmp = document.body;
   }
   console.timeEnd("dom"); // dom: 15.851806640625ms
   ```

   ![timeConsuming]('./images/timeConsuming.jpg')
   虽然这个例子比较极端，循环次数有些夸张，但如果在循环中包含一些复杂的逻辑或者说涉及到多个元素时，就会造成不可忽视的性能损耗。

2. 重新渲染

   网页生成过程

   1. 解析 HTML 文档为 DOM 树
   2. 解析 css 文件为 CSSOM 树
   3. 结合 DOM 树和 CSSOM 树，生成一棵渲染树(Render Tree)
   4. 生成布局（flow），即将所有渲染树的所有节点进行平面合成
   5. 将布局绘制（paint）在屏幕上

   重排 reflow 和重绘 repaint 是页面渲染过程中最耗时的两步骤，DOM 操作涉及改变元素的几何信息（位置和大小），浏览器需要重新计算元素的位置，并重新排列，这个过程称为重排；改变元素的外观，但没有改变布局，重新把元素外观绘制出来的过程，叫做重绘。

   可能会影响到其他元素排布的操作就会引起重排，继而引发重绘，比如：

   - 修改元素边距、大小
   - 添加、删除元素
   - 改变窗口大小

   与之相反的操作则只会引起重绘，比如：

   - 设置背景图片
   - 修改字体颜色
   - 改变 visibility 属性值

#### DOM 事件

种类：键盘事件、鼠标事件、表单事件等

- 防抖
  函数防抖是函数短时间内连续触发时，在规定时间内，函数只会执行一次

  ```js
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, ...args);
      }, delay);
    };
  }
  ```

- 节流
  函数节流是短时间内大量触发同一时间，在函数执行一次之后，在指定的时间内不再被执行，直到过了这段时间才重新生效

  ```js
  function throttle(fn, delay) {
    let lastTime = 0;
    return function (...args) {
      const currentTime = new Date().getTime();
      if (currentTime - lastTime > delay) {
        fn.apply(this, ...args);
        lastTime = currentTime;
      }
    };
  }
  ```

  区别：防抖函数限制多长时间才能执行一次，节流函数限制多长时间必须执行一次，一个限制上限，一个限制下限，与防抖相比，节流函数最主要的不同在于它保证在指定时间内至少执行一次函数

- 代理（事件代理或事件委托）

  - DOM 事件流

    - 捕获阶段：从 window 进入事件目标阶段
    - 目标阶段：目标阶段
    - 冒泡阶段：从事件目标回到 window

  - 事件捕获
    事件发生时，在捕获阶段，事件会从最外层元素逐级往下执行响应函数
  - 事件冒泡
    事件发生时，先触发目标元素的事件响应函数，再逐级向上执行父元素的事件响应函数，直到 window 停止

    事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。
    事件委托：不监听元素 C 自身，而是监听其祖先元素 P，然后判断 e.target 是不是该元素 C（或该元素的子元素）

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

#### js 不适合大型项目

typeScript

#### 浏览器如何执行 JS 代码

- 解析
  词法分析、语法分析
- 解释
- 优化

##### 内存管理

栈和堆

新生代、老生代

#### 区分浏览器的进程与线程

Process、Thread

浏览器进程
GPU 进程
Network Service 进程
V8 代理解析工具进程
渲染进程
扩展程序进程

#### 深入理解网络协议

- HTTP/0.9
- HTTP/1.0
- HTTP/1.1
- HTTP/2
  二进制分帧、多路复用
- HTTP/3

HTTPS
证书机制

#### 如何让浏览器更快的加载网络资源

- gzip
- HTTP 缓存
  强制缓存和协商缓存
- ServiceWorker
  实现离线缓存

#### 浏览器同源策略与跨域方案

- CORS
- JSONP
- WebSocket
- 代理转发
- 页面跨域解决方案
  postMessage
  改域
