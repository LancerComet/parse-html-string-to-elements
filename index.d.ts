/**
 * AST Node.
 * 
 * @class ASTNode
 */
declare class ASTNode {
  _id: string
  attributes: Array<Object>
  children: Array<ASTNode>
  tagName: string
  constructor (param: IASTNode)
}

/**
 * ASTNode constructor param.
 * 
 * @interface IASTNode
 */
declare interface IASTNode {
  _id: string
  attributes?: Array<Object>
  children?: Arrary<ASTNode>
  tagName: string
}

/**
 * Parse HTML string to AST.
 * 
 * @param {string} htmlString 
 * @returns {Array<ASTNode>} 
 */
declare function tokenizer (htmlString: string) : Array<ASTNode>

/**
 * Get attributes of html element string.
 * 
 * @param {string} str 
 * @returns {Array<Object>} 
 */
declare function parseElementStr (str: string) : Array<Object>

/**
 * Create HTML elements.
 * 
 * @param {ASTNode} ast 
 */
declare function createElement (ast: ASTNode, parentElement?: HTMLElement) : void

/**
 * Generate an ID string randomly.
 * 
 * @returns {string}
 */
declare function generateID () : string
