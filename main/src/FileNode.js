import * as babelParser from '@babel/parser';
import { Console } from 'console';
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


  // getRenderComponents() {
  //   //console.log("----> checking the body for each node: ", this.astBody);
  //   const jsxElements = [];
  //   console.log('CHECKING THE TOKENS.', this.astTokens);
  //   this.astBody.forEach((node) => {
  //     if (node.type === 'VariableDeclaration') {
  //       const declaration = node.declarations;
  //       //console.log("DECLARATION -------->", declaration);

  //       declaration.forEach((declaration) => {
  //         if (declaration.init.type === 'ArrowFunctionExpression') {
  //           // after ArrowFunctionExpression node, go into the body
  //           const initBody = declaration.init.body;
  //           console.log("----initBody--->", initBody.body)

  //           initBody.body.forEach((node) => {
  //             if (node.type === 'ReturnStatement') {

  //               const arg = node.argument;
  //               //console.log("ARG: ", arg);
  //               // console.log(arg.children[1]);
  //               arg.children[1].children.forEach((child) => {
  //                 if (child.type === 'JSXElement') {
  //                   console.log('child ---------->', child);
  //                 }
  //               })
  //               // arg.forEach((node) => {
  //               //   if (node.type === 'JSXOpeningElement') {
  //               //     console.log('JSXOpeningElement node -->', node)
  //               //   }
  //               //})
  //             }
  //           })

  //         }
  //       })
  //     }
  //   })
  // }

  getRenderComponents() {
    //console.log("--IMPORTS-->", this.imports)
    const keyArray = this.imports.map((obj) => {
      return Object.keys(obj)[0];
    })
    //console.log(keyArray);

    const result = this.astTokens.slice().filter((token) => {
      if (token.type.label === 'jsxName' && (token.value[0] === token.value[0].toUpperCase())) {
        if (keyArray.includes(token.value)) {
          return true;
        }
      }
      return false;
    })
    //console.log(result); <--------------------------
  }

  getProps() {
    console.log(this.astTokens);
  }
  //console.log("array------>", this.imports);

  //this.astTokens.filter(token => {
  // const arr = this.imports;
  // if (arr.includes(token.value)) {
  //   console.log('hi')
  // }
  //if (this.imports.includes) {

  //}
  //})

  // this.astTokens.forEach((token) => {
  //console.log("------CHECKING TOKEN--->", token);
  //console.log("imports?", this.imports);
  //if (token.type.label === 'jsxName') {
  //console.log("------CHECKING TOKEN--->", token); // token.value 
  //console.log("------CHECKING TOKEN VALUE--->", token.value);
  //console.log("imports?", this.imports);
  // this.imports.forEach((element) => { // element is each obj in the import array
  //   if (element[token.value]) {

  //   }
  // })

  //jsxList.push(token);
  //console.log("VALUE --> ", token.value[0])
  //if (token.value[0] === token.value[0].toUpperCase()) {
  //console.log('Token value', token.value);
  //}
  //console.log("printing first letter??", token.type.label[0]);
  // check to see if the first letter in the label is uppercase
  //}
  // })
  //console.log('array--->', jsxList);
  // this.astBody.forEach((node) => {
  //   console.log("checking the NODE--->", node);
  // })
}


export default FileNode;
