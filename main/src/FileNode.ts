import * as babelParser from '@babel/parser';
import { Console } from 'console';
import * as fs from 'fs';
// import path from 'path'; //doesn't appear we're using this


type Type = {
  label: string
};

type AstToken = [{
  type: Type,
  value: string,
  end: number,
  location: object,
}];

type AstBody = [{
  type?: string,
  declarations?: undefined | {
    init?: {
      type?: string,
      body?: {
        body?: [{
          type?: string,
          declarations?: [{
            init?: {
              callee?: {
                name?: string
              },
              type: string,
              body?: {
                body?: [{
                  type: string,
                  expression: {
                    callee?: {
                      name?: string
                    },
                    arguments: [{
                      callee?: {
                        name?: string
                      }
                    }]
                  }
                }]
              }
            }
          }]
        }]
      }
    }
  }
}];

class FileNode {
  
    filePath: string;
    astBody: AstBody;
    astTokens: AstToken;//to resolve the errors in getRenderedComponents, maybe the type of astTokens has to be specified as deeply rested array of strings, so that there won't be an error when accessing properties on the astTokens stringified objects. I already tried making the type string[] instead of object[] and the errors are the same. 
    imports: string[];
    type!: string;    //does this need to be in the constructor? I didn't put it there because I thought it'd be more likely to break something if I added it as a parameter for the constructor. I added "type" here because this.type within getType was throwing an error. I added "undefined" as a possible type here because the "Quick Fix" option suggested it and it made an error go away.
    renderedComponents!: string[]; // //does this need to be in the constructor? I didn't add it for the same reason as described next to astTokens. I also added the type "undefined" for the same reason. 
    selected!: string[];
    props!: object;
    dispatched!: string[];

  constructor(filePath: string, astBody: AstBody, astTokens: AstToken) {
    this.filePath = filePath;
    this.astBody = astBody;
    this.astTokens = astTokens;
    this.imports = [];
  }
  getType(ast: string): void {
    this.type = 'slice file';
  }

  getRenderComponents(): void {
    const arr = this.imports.map((obj) => {
      if (Object.values(obj)[0].includes('.jsx')) return Object.keys(obj)[0];
    });
    const keyArray = arr.filter(e => e)
    const result = this.astTokens.slice().filter((token) => {
      if (token.type.label === 'jsxName') {
        if (keyArray.includes(token.value)) {
          return true;
        }
      }
      return false;
    })
    this.renderedComponents = result.map(token => token.value);
  }


  // getProps function
  getProps(): void {
    const arr = this.imports.map((obj) => {
      if (!Object.values(obj)[0].includes('.jsx')) return Object.keys(obj)[0];
    });
    const keyArray = arr.filter(e => e)
    if (this.selected) {//added this check for whether this.selected is not undefined because there was a type error being thrown in the below for loop indicating that we had to account for the possibility that there is no "selected."
        for (let i = 0; i < this.selected.length; i++) {
            keyArray.push(Object.keys(this.selected[i])[0])
        }
    }
    this.astTokens.forEach((token, i, arr) => {
      if (token.type.label === 'const') {
        keyArray.push(arr[i + 1].value)
      }
    });

    const propObj: {key?: string, token?: {value: string}} = {};

    this.astTokens.forEach((token, i, arr) => {
      if (token.type.label === 'jsxName') {
        if (this.renderedComponents[0]) {
          if (token.value === 'key') propObj['key'] = 'unique identifier'
          if (arr[i + 3].value === 'props') propObj[token.value] = "props." + arr[i + 5].value
          else if (keyArray.includes(arr[i + 3].value) && arr[i + 3].value !== undefined) {
            //console.log(token.value + " = " + arr[i + 3].value)
            propObj[token.value] = arr[i + 3].value
          }
        }
      }
      this.props = propObj;
    });
  }
  

  getSelectedState(astBody: AstBody): void {
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
  getDispatched(astBody: any): void {
    this.dispatched = [];
    astBody.forEach((node: any) => {
      if (node.type === 'VariableDeclaration') {
        const declarations = node.declarations;
        //declarations is the entire MarketContainer function, including "const MarketsContainer"
        declarations.forEach((declaration: any) => {
          if (declaration.init.type === 'ArrowFunctionExpression') {
            //ArrowFunctionExpression is the body of MarketsContainer (everything after the equals sign after MarketsContainer)
            const ArrowFuncBlock = declaration.init.body.body;
            //ArrowFuncBlock is the array of blocks (?) within MarketsContainer
            if (ArrowFuncBlock) {
              let useDispatchLabel!: string;
              ArrowFuncBlock.forEach((blockElement: any) => {
                if (blockElement.type === 'VariableDeclaration') {
                  //declarationsArray is all code/data about one variable declaration within MarketsContainer
                  const declarationsArray = blockElement.declarations;
                  declarationsArray.forEach((element: any) => {
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
                        innerArrowFuncBlock.forEach((element: any) => {
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
