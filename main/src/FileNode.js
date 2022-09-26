import * as babelParser from '@babel/parser';
import { Console } from 'console';
import * as fs from 'fs';
import path from 'path';

class FileNode {
  constructor(filePath, astBody, astTokens) {
    this.filePath = filePath;
    this.astBody = astBody;
    this.astTokens = astTokens;
    this.imports = [];
  }
  getType(ast) {
    this.type = 'slice file';
  }

  getSelectedState(astBody) {
    this.selected = [];
    astBody.forEach((node) => {
      if (node.type === 'VariableDeclaration') {
        const declarations = node.declarations;

        declarations.forEach((declaration) => {
          if (declaration.init.type === 'ArrowFunctionExpression') {
            const ArrowFuncBlock = declaration.init.body.body;
            if (ArrowFuncBlock) {
              ArrowFuncBlock.forEach((blockElement) => {
                if (blockElement.type === 'VariableDeclaration') {
                  const declarationsArray = blockElement.declarations;

                  declarationsArray.forEach((element) => {
                    if (element.init.callee?.name === 'useSelector') {
                      const variableLabel = element.id.name;
                      const useSelectorArguments = element.init.arguments;

                      useSelectorArguments.forEach((argument) => {
                        if (argument.type === 'ArrowFunctionExpression') {
                          const reducerName =
                            argument.body.object.property.name;
                          const stateName = argument.body.property.name;
                          this.selected.push({
                            [variableLabel]: `${reducerName}.${stateName}`,
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          }
        });
        //console.log('declaration ------->', declarations)
      }
    });
  }

  getDispatched(ast) { }


  getRenderComponents() {
    const arr = this.imports.map((obj) => {
      if (Object.values(obj)[0].includes('.jsx')) return Object.keys(obj)[0];
    })
    const keyArray = arr.filter(e => e)
    const result = this.astTokens.slice().filter((token) => {
      if (token.type.label === 'jsxName') {
        if (keyArray.includes(token.value)) {
          return true;
        }
      }
      return false;
    })
    this.renderedComponents = result.map(token => token.value)
  }


  // getProps function
  getProps() {
    const arr = this.imports.map((obj) => {
      if (!Object.values(obj)[0].includes('.jsx')) return Object.keys(obj)[0];
    })
    const keyArray = arr.filter(e => e)
    for (let i = 0; i < this.selected.length; i++) {
      keyArray.push(Object.keys(this.selected[i])[0])
    }
    this.astTokens.forEach((token, i, arr) => {
      if (token.type.label === 'const') {
        keyArray.push(arr[i + 1].value)
      }
    })
    const propObj = {};
    this.astTokens.forEach((token, i, arr) => {
      if (token.type.label === 'jsxName') {
        if (keyArray.includes(arr[i + 3].value)) {
          //console.log(token.value + " = " + arr[i + 3].value)
          propObj[token.value] = arr[i + 3].value
        }
      }
      this.props = propObj
    })
    console.log(this.props)
  }
}


export default FileNode;
