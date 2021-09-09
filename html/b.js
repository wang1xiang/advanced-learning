import b, { a } from './a.js'
console.log(a, b) // 'a, b'
setTimeout(() => console.log(a, b), 1000) // 'aa, b'