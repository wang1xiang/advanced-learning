export var a = 'a';
var b = {
  b: 'b'
};
setTimeout(() => a = 'aa', 500);
setTimeout(() => b = {
  b: 'bb'
}, 500);
export default b
