import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';

class FileNode {
  constructor(filePath, astBody, astTokens) {
    this.filePath = filePath;
    this.astBody = astBody;
    this.astTokens = astTokens;
    // this.type = getType(this.ast); // component, slice file
    // this.componentsRendered = getComponentsRendered(this.ast);
    // this.fileImports = getFileImports(this.ast);
    // this.selectedState = getSelectedState(this.ast);
    // this.dispatchedReducers = getDispatched(this.ast);
  }
  getType(ast) {
    this.type = 'slice file';
  }

  getRenders() {}

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

export default FileNode;
