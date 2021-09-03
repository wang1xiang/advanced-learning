// 测试次数：一百万次
// const times = 1000000;
// 缓存 body 元素
// console.time("object");
// let body = document.body;
// // 循环赋值对象作为对照参考
// for (let i = 0; i < times; i++) {
//   let tmp = body;
// }
// console.timeEnd("object"); // object: 1.8681640625ms

// console.time("dom");
// // 循环读取 body 元素引发线程切换
// for (let i = 0; i < times; i++) {
//   let tmp = document.body;
// }
// console.timeEnd("dom"); // dom: 15.851806640625ms

// 测试DOM耗时
const times = 100000
let html = ''
for (let i = 0; i < times; i++) {
  html += `<div>${i}</div>`
}
document.body.innerHTML += html
const divs = document.querySelectorAll('div')
// 重排
// Array.prototype.forEach.call(divs, (div, i) => {
//   div.style.margin = i % 2 ? '10px' : 0;
// })
// 重绘
Array.prototype.forEach.call(divs, (div, i) => {
  div.style.color = i % 2 ? 'red' : 'green';
})
