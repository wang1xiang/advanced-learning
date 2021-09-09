const a = require('./a1')
console.log(a) // 'a'
setTimeout(() => console.log(a), 1000) // 'aa, b'