import * as babelParser from '@babel/parser';
import { Console } from 'console';
import * as fs from 'fs';
import path from 'path';

export class FileNode {
  constructor(filePath, astBody, astTokens) {
    this.filePath = filePath;
    this.astBody = astBody;
    this.astTokens = astTokens;
    this.imports = [];
  }
  getType(ast) {
    this.type = 'slice file';
  }

  getRenderComponents() {
    const arr = this.imports.map((obj) => {
      if (Object.values(obj)[0].includes('.jsx')) return Object.keys(obj)[0];
    });
    const keyArray = arr.filter((e) => e);
    const result = this.astTokens.slice().filter((token) => {
      if (token.type.label === 'jsxName') {
        if (keyArray.includes(token.value)) {
          return true;
        }
      }
      return false;
    });
    this.renderedComponents = result.map((token) => token.value);
  }

  // getProps function
  getProps() {
    const arr = this.imports.map((obj) => {
      if (!Object.values(obj)[0].includes('.jsx')) return Object.keys(obj)[0];
    });
    const keyArray = arr.filter((e) => e);
    for (let i = 0; i < this.selected.length; i++) {
      keyArray.push(Object.keys(this.selected[i])[0]);
    }

    this.astTokens.forEach((token, i, arr) => {
      if (token.type.label === 'const') {
        keyArray.push(arr[i + 1].value);
      }
    });

    const propObj = {};
    this.astTokens.forEach((token, i, arr) => {
      if (token.type.label === 'jsxName') {
        if (this.renderedComponents[0]) {
          if (token.value === 'key') propObj['key'] = 'unique identifier';
          if (arr[i + 3].value === 'props')
            propObj[token.value] = 'props.' + arr[i + 5].value;
          else if (
            keyArray.includes(arr[i + 3].value) &&
            arr[i + 3].value !== undefined
          ) {
            //console.log(token.value + " = " + arr[i + 3].value)
            propObj[token.value] = arr[i + 3].value;
          }
        }
      }
      this.props = propObj;
    });
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
      }
    });
  }
  getDispatched(astBody) {
    this.dispatched = [];
    astBody.forEach((node) => {
      if (node.type === 'VariableDeclaration') {
        const declarations = node.declarations;
        //declarations is the entire MarketContainer function, including "const MarketsContainer"
        declarations.forEach((declaration) => {
          if (declaration.init.type === 'ArrowFunctionExpression') {
            //ArrowFunctionExpression is the body of MarketsContainer (everything after the equals sign after MarketsContainer)
            const ArrowFuncBlock = declaration.init.body.body;
            //ArrowFuncBlock is the array of blocks (?) within MarketsContainer
            if (ArrowFuncBlock) {
              let useDispatchLabel;
              ArrowFuncBlock.forEach((blockElement) => {
                if (blockElement.type === 'VariableDeclaration') {
                  //declarationsArray is all code/data about one variable declaration within MarketsContainer
                  const declarationsArray = blockElement.declarations;
                  declarationsArray.forEach((element) => {
                    if (
                      useDispatchLabel === undefined &&
                      element?.init?.callee?.name === 'useDispatch'
                    ) {
                      //useDispatchLabel is what useDispatch gets saved to, so for us it's "dispatch"
                      useDispatchLabel = element.id.name;
                    } else {
                      if (element.init.type === 'ArrowFunctionExpression') {
                        //innerArrowFuncBlock is everything after the arrow within an ArrowFunctionExpression variable declaration within MarketsContainer - for example, within handleDeleteCard, it's everything after the arrow.
                        const innerArrowFuncBlock = element.init.body.body;
                        innerArrowFuncBlock.forEach((element) => {
                          if (
                            useDispatchLabel !== undefined &&
                            element.type === 'ExpressionStatement' &&
                            element.expression.callee.name === useDispatchLabel
                          ) {
                            //  console.log(
                            //   'args name',
                            //   //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                            //   element.expression.arguments[0].callee.name
                            // );
                            this.dispatched.push(
                              element.expression.arguments[0].callee.name
                            );
                          }
                        });
                      }
                    }
                  });
                }
                if (
                  useDispatchLabel !== undefined &&
                  blockElement.type === 'ExpressionStatement' &&
                  blockElement.expression.callee.name === useDispatchLabel
                ) {
                  // console.log(
                  // 'args name',
                  //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                  // blockElement.expression.arguments[0].callee.name
                  // );
                  this.dispatched.push(
                    blockElement.expression.arguments[0].callee.name
                  );
                }
              });
            }
          }
        });
      }
    });
  }
}
