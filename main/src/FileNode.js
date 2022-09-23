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

            ArrowFuncBlock.forEach((blockElement) => {
              if (blockElement.type === 'VariableDeclaration') {
                const declarationsArray = blockElement.declarations;

                declarationsArray.forEach((element) => {
                  if (element.init.callee?.name === 'useSelector') {
                    const variableLabel = element.id.name;
                    const useSelectorArguments = element.init.arguments;

                    useSelectorArguments.forEach((argument) => {
                      if (argument.type === 'ArrowFunctionExpression') {
                        const reducerName = argument.body.object.property.name;
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
        });
      }
    });
  }
  getDispatched(ast) {}
}

export default FileNode;
