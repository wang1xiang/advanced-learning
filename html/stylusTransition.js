function tokenize(text) {
  text = text.trim().split(/\n|\r\n/)
  return text.reduce((tokens, line, idx) => {
    // ('  a sdsad'.match(/^\s+/)); [ '  ', index: 0, input: '  a sdsad', groups: undefined ]
    // match使用g时返回数组包含所有匹配到的数据，未使用g全局查找时返回第一个匹配及index开始位置、input搜索的字符串、groups一个捕获数组或undefined
    // 正则表达式不包含 g 标志，str.match() 将返回与 RegExp.exec(). 相同的结果。
    const spaces = line.match(/^\s+/) || [""];
    const indent = spaces[0].length;
    const input = line.trim();
    const words = input.split(/\s/);
    let value = words.shift();
    // 选择器（去除前后空格、中间不存在空格则为选择器）
    if (words.length === 0) {
      tokens.push({
        type: "selector",
        value,
        indent,
      });
    } else {
      let type = "";
      // 以$开头时定义变量
      if (/^\$/.test(value)) {
        type = "variableDef";
      } else if (/^[a-zA-Z-]+$/.test(value)) {
        type = "property";
      } else {
        throw new Error(
          `Tokenize error:Line ${idx} "${value}" is not a vairable or property!`
        );
      }
      tokens.push({
        type,
        value,
        indent,
      });
      while ((value = words.shift())) {
        tokens.push({
          type: /^\$/.test(value) ? "variableRef" : "value",
          value,
          indent: 0,
        });
      }
    }
    return tokens;
  }, []);
}

// 转换AST语法树
/*
语法分析代码如下所示。首先定义一个根节点，然后按照先进先出的方式遍历令牌数组，遇到变量定义时，将变量名和对应的值存入到缓存对象中；当遇到属性时，插入到当前选择器节点的 rules 属性中，遇到值和变量引用时都将插入到当前选择器节点 rules 属性数组最后一个对象的 value 数组中，但是变量引用在插入之前需要借助缓存对象的变量值进行替换。当遇到选择器节点时，则需要往对应的父选择器节点 children 属性中插入，并将指针指向被插入的节点，同时记得将被插入的节点添加到用于存储遍历路径的数组中：
*/
function parse(tokens) {
  var ast = {
    type: 'root',
    children: [],
    indent: -1
  };
  let path = [ast]
  let preNode = ast
  let node
  let vDict = {}
  while (node = tokens.shift()) {
    if (node.type === 'variableDef') {
      if (tokens[0] && tokens[0].type === 'value') {
        const vNode = tokens.shift()
        vDict[node.value] = vNode.value
      } else {
        preNode.rules[preNode.rules.length - 1].value = vDict[node.value]
      }
      continue;
    }
    if (node.type === 'property') {
      if (node.indent > preNode.indent) {
        preNode.rules.push({
          property: node.value,
          value: []
        })
      } else {
        let parent = path.pop()
        while (node.indent <= parent.indent) {
          parent = path.pop()
        }
        parent.rules.push({
          property: node.value,
          value: []
        })
        preNode = parent
        path.push(parent)
      }
      continue;
    }
    if (node.type === 'value') {
      try {
        preNode.rules[preNode.rules.length - 1].value.push(node.value);
      } catch (e) {
        console.error(preNode)
      }
      continue;
    }
    if (node.type === 'variableRef') {
      preNode.rules[preNode.rules.length - 1].value.push(vDict[node.value]);
      continue;
    }
    if (node.type === 'selector') {
      const item = {
        type: 'selector',
        value: node.value,
        indent: node.indent,
        rules: [],
        children: []
      }
      if (node.indent > preNode.indent) {
        path[path.length - 1].indent === node.indent && path.pop()
        path.push(item)
        preNode.children.push(item);
        preNode = item;
      } else {
        let parent = path.pop()
        while (node.indent <= parent.indent) {
          parent = path.pop()
        }
        parent.children.push(item)
        path.push(item)
      }
    }
  }
  return ast;
}

/*
在转换之前我们先来看看要生成的目标代码结构，其更像是一个由一条条样式规则组成的数组，所以我们考虑将抽象语法树转换成“抽象语法数组”。
在遍历树节点时，需要记录当前遍历路径，以方便选择器的拼接；同时可以考虑将“值”类型的节点拼接在一起。最后形成下面的数组结构，数组中每个元素对象包括两个属性，selector 属性值为当前规则的选择器，rules 属性为数组，数组中每个元素对象包含 property 和 value 属性：
 */
function transform(ast) {
  let newAst = [];
  function traverse(node, result, prefix) {
    let selector = ''
    if (node.type === 'selector') {
      selector = [...prefix, node.value];
      result.push({
        selector: selector.join(' '),
        rules: node.rules.reduce((acc, rule) => {
          acc.push({
            property: rule.property,
            value: rule.value.join(' ')
          })
          return acc;
        }, [])
      })
    }
    for (let i = 0; i < node.children.length; i++) {
      traverse(node.children[i], result, selector)
    }
  }
  traverse(ast, newAst, [])
  return newAst;
}
/*
有了新的“抽象语法数组”，生成目标代码就只需要通过 map 操作对数组进行遍历，然后将选择器、属性、值拼接成字符串返回即可。
*/
function generate(nodes) {
  return nodes.map(n => {
    let rules = n.rules.reduce((acc, item) => acc += `${item.property}:${item.value};`, '')
    return `${n.selector} {${rules}}`
  }).join('\n')
}
const text = `
.logoutMask
  position absolute
  z-index 99
  left 0
  top 0
  width 100%
  height 100%
  background-color #f5f5f5
  display flex
  align-items center
  justify-content center
  .logoutBtns
    display flex
    justify-content flex-end
    padding-top 30px
  .logoutModal
    box-shadow 0 8px 17px 0 rgba(0, 0, 0, 0.18), 0 6px 20px 0 rgba(0, 0, 0, 0.12)
    position relative
    border-radius 4px
    display block
    font-size 17px
    width 480px
    padding 20px
    background-color $main
`

let result = tokenize(text)
console.log(JSON.parse(JSON.stringify(result)));

let result1 = parse(result)
console.log(JSON.parse(JSON.stringify(result1)));

let result2 = transform(result1)
console.log(JSON.parse(JSON.stringify(result2)));

let result3 = generate(result2)
console.log(result3);