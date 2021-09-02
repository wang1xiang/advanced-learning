const text2 = `
  // 超长文本
`
for (let i = 0; i < 10000; i++) {
  console.log(i);
}
text2.split(' ');
console.timeLog('timer', '--- 2.js excuted');