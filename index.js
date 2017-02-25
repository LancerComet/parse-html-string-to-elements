/// <reference path="./index.d.ts" />

class ASTNode {
  constructor (params) {
    this._id = params._id
    this.attributes = params.attributes || []
    this.children = this.children || []
    this.tagName = params.tagName
  }
}

const ast = tokenizer(
  `<div class="test-div" data-type="test">
    This is a testing element.
    <h2>Title is here.</h2>
    F@♂
    <br class="this-is-a-br"/>
    <input class="test-input" data-value="none" type="text"/>
    <hr/>
    F@♂
    <p class="my-name" id="lancer">
      <div class="name-value">LancerComet</div>
    </p>
  </div>
  <h1>Greeting, LancerComet!</h1>
  `
)

ast.forEach(ast => {
  const element = createElement(ast)
  console.log(element)
  document.body.appendChild(element)
})

function tokenizer (htmlString = '') {
  if (!htmlString) {
    throw new Error('[Tokenizer] Please provide valid html string.')
  }

  const ast = []
  const tokens = htmlString
    .split(/(<|>)/)
    .filter(item => item !== '')

  let scopeStack = []
  let lastParseElement = null

  while (tokens.length) {
    const currentToken = tokens.shift()

    switch (currentToken) {
      case '<':
        let htmlElementStr = tokens.shift()
        const _id = generateID()

        // Closing tag.
        if (htmlElementStr.indexOf('/') === 0) {
          scopeStack.pop()
          continue
        }

        // Get attributes and tag name
        let { attributes, tagName, isSelfClosed } = parseElementStr(htmlElementStr)

        // Create new element.
        const newElement = new ASTNode({
          tagName,
          attributes,
          _id
        })

        // Find parent element.
        if (scopeStack.length) {
          const parentElement = scopeStack[scopeStack.length - 1]
          parentElement.children.push(newElement)
        } else {
          ast.push(newElement)
        }

        !isSelfClosed && scopeStack.push(newElement)
        lastParseElement = newElement
      continue

      case '>':
        // Do nothing here.
      continue

      // textContent.
      default:
        // Vaild textContent.
        // Push to children.
        const textContent = currentToken.trim()
        if (/^\S+/.test(textContent)) {
          const target = scopeStack[scopeStack.length - 1]
          target.children.push(textContent)
        }
      continue
    }
  }

  return ast
}

function parseElementStr (str = '') {
  if (!str) {
    throw new Error('[Parse Element Attr] Please provide valid html string.')
  }

  const words = str.split(' ')
  let isSelfClosed = false

  // Check and deal-with self-clsoed.
  for (let i = 0, length = words.length; i < length; i++) {
    if (/\/$/.test(words[i])) {
      isSelfClosed = true
      words[i] = words[i].replace('/', '')
    }
  }
  
  const tagName = words.shift()
  const attributes = {}

  for (let i = 0, length = words.length; i < length; i++) {
    const item = words[i]
    const _words = item.split('=')
    const attrName = _words[0]
    const attrValue = _words[1].replace(/("|')/g, '')  // Remove " and ' in attribute value.
    attributes[attrName] = attrValue
  }
  
  return {
    tagName,
    attributes,
    isSelfClosed
  }
}

function createElement (astNode, parentElement) {
  let element = null

  if (typeof astNode === 'string') {
    element = document.createTextNode(astNode)
    if (parentElement) {
      parentElement.appendChild(element)
    }
  } else {
    element = document.createElement(astNode.tagName)

    // Set attributes.
    for (let attrName in astNode.attributes) {
      element.setAttribute(attrName, astNode.attributes[attrName])
    }

    parentElement && parentElement.appendChild(element)

    if (astNode.children.length) {
      for (let i = 0, length = astNode.children.length; i < length; i++) {
        const childAst = astNode.children[i]
        createElement(childAst, element)
      }
    }
  }

  return element
}

function generateID () {
  return Math.floor(Math.random() * 10000 * Date.now()).toString(16)
}

const demo2 = `
  <div>
    <h4>awfwefew</h4>
  </div>
  <div>
    <h2>wlfkjsidofews</h2>
  </div>
`

console.log(createElementFromString(demo2))

function createElementFromString (htmlString) {
  const ctnr = document.createElement('div')
  ctnr.innerHTML = htmlString
  console.log(ctnr)
}