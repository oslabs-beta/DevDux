import { AstToken, AstBody } from './types/types';



class FileNode {
  
    filePath: string;
    astBody: AstBody;
    astTokens: AstToken;//to resolve the errors in getRenderedComponents, maybe the type of astTokens has to be specified as deeply rested array of strings, so that there won't be an error when accessing properties on the astTokens stringified objects. I already tried making the type string[] instead of object[] and the errors are the same. 
    imports: string[];
    type!: string;    //does this need to be in the constructor? I didn't put it there because I thought it'd be more likely to break something if I added it as a parameter for the constructor. I added "type" here because this.type within getType was throwing an error. I added "undefined" as a possible type here because the "Quick Fix" option suggested it and it made an error go away.
    renderedComponents!: string[]; // //does this need to be in the constructor? I didn't add it for the same reason as described next to astTokens. I also added the type "undefined" for the same reason. 
    selected!: {}[];
    props!: object;
    dispatched!: string[];

  constructor(filePath: string, astBody: AstBody, astTokens: AstToken) {
    this.filePath = filePath;
    this.astBody = astBody;
    this.astTokens = astTokens; 
    this.imports = [];
  }
  /**
   * TODO: Build out getType to classify what type of file was imported
   */
  // getType(ast: string): void {
  //   this.type = 'slice file';
  // }

  getRenderComponents(): void {
    const arr = this.imports.map((obj) => {
      if (Object.values(obj)[0].includes('.jsx')) {
        return Object.keys(obj)[0];
      }
    });
    const keyArray = arr.filter(e => e);
    if (this.astTokens) {
      const result = this.astTokens?.slice().filter((token) => {
        if (token.type.label === 'jsxName') {
          if (keyArray.includes(token.value)) {
            return true;
          }
        }
        return false;
      });
    
    this.renderedComponents = result.map(token => token.value);
    }
  }


  // getProps function
  getProps(): void {
    const arr = this.imports.map((obj) => {
      if (!Object.values(obj)[0].includes('.jsx')) {
        return Object.keys(obj)[0];
      }
    });
    const keyArray = arr.filter(e => e);
    if (this.selected) {//added this check for whether this.selected is not undefined because there was a type error being thrown in the below for loop indicating that we had to account for the possibility that there is no "selected."
        for (let i = 0; i < this.selected.length; i++) {
          keyArray.push(Object.keys(this.selected[i])[0]);
        }
    }
    this.astTokens?.forEach((token, i, arr) => {
      if (token.type.label === 'const') {
        keyArray.push(arr[i + 1].value);
      }
    });

    const propObj: {key?: string, token?: {value: string}} = {};

    this.astTokens?.forEach((token, i, arr) => {
      if (token.type.label === 'jsxName') {
        if (this.renderedComponents[0]) {
          if (token.value === 'key') {
            propObj['key'] = 'unique identifier';
          }
          if (arr[i + 3].value === 'props') {
            if (propObj.token !== undefined) {
              propObj.token.value = "props." + arr[i + 5].value;
            }
          }
          else if (keyArray.includes(arr[i + 3].value) && arr[i + 3].value !== undefined) {
            //console.log(token.value + " = " + arr[i + 3].value)
            if (propObj.token !== undefined) {
              propObj.token.value = arr[i + 3].value;
            }            
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
          if (declaration?.init?.type === 'ArrowFunctionExpression') {
            
            // eslint-disable-next-line @typescript-eslint/naming-convention
            // console.log('---Declaration.init.body---', declaration.init.body);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            let ArrowFuncBlock;
            if (declaration.init.body.type === 'BlockStatement') {
              ArrowFuncBlock = declaration.init.body.body;
            }
            
            if (ArrowFuncBlock) {
              ArrowFuncBlock.forEach((blockElement) => {
                if (blockElement.type === 'VariableDeclaration') {
                  const declarationsArray = blockElement.declarations;
                  
                  declarationsArray?.forEach((element) => {
                    // console.log('---element.init---', element?.init);
              
                    if (element.init?.type === "CallExpression") {
                      if (element.init.callee.type === 'Identifier') {
                        if (element.init.callee.name === 'useSelector') {
                          let variableLabel: string;
                          let reducerName: string;
                          let stateName: string;
                          if (element.id.type === 'Identifier') {
                            variableLabel = element.id.name;
                          }
                          const useSelectorArguments = element.init.arguments;
                          useSelectorArguments.forEach((argument) => {
                            
                            if (argument.type === 'ArrowFunctionExpression') {
                              if (argument.body.type === 'MemberExpression') {

                                if (argument.body.object.type === 'MemberExpression') {
                                  if (argument.body.object.property.type === 'Identifier') {
                                    reducerName = argument.body.object.property.name;
                                  }
                                }
                                if (argument.body.property.type === 'Identifier') {
                                  stateName = argument.body.property.name;
                                }                              
                              }
                            }
                            this.selected.push({[variableLabel]:`${reducerName}.${stateName}`})
                          });
                        }
                      }
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
  getDispatched(astBody: AstBody): void {
    this.dispatched = [];
    astBody.forEach((node) => {
      if (node.type === 'VariableDeclaration') {
        const declarations = node.declarations;
        //declarations is the entire MarketContainer function, including "const MarketsContainer"
        // console.log('---declarations---', declarations);
        declarations.forEach((declaration) => {
          if (declaration.type === 'VariableDeclarator') {
            if (declaration?.init?.type === 'ArrowFunctionExpression') {
            //ArrowFunctionExpression is the body of MarketsContainer (everything after the equals sign after MarketsContainer)
            
              // console.log('---declaration.init.body---', declaration.init.body);
              if (declaration.init.body.type === 'BlockStatement') {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const ArrowFuncBlock = declaration.init.body.body;
                //ArrowFuncBlock is the array of blocks (?) within MarketsContainer
                if (ArrowFuncBlock) {
                  let useDispatchLabel!: string;
                  ArrowFuncBlock.forEach((blockElement) => {
                    if (blockElement.type === 'VariableDeclaration') {
                      // console.log('---variableDeclarations---', blockElement.declarations)
                      //declarationsArray is all code/data about one variable declaration within MarketsContainer
                      const declarationsArray = blockElement.declarations;
                      declarationsArray.forEach((element) => {
                        // console.log('---element---', element)
                        if (useDispatchLabel === undefined) {
                          if (element.init) {
                            if (element.init.type === 'CallExpression') {
                              if (element.init.callee) {
                                // console.log('----element.init.callee----', element.init.callee)
                                if (element.init.callee.type === 'Identifier') {
                                  if (element.init.callee.name === 'useDispatch') {
                                    //useDispatchLabel is what useDispatch gets saved to, so for us it's "dispatch"
                                    if (element.id.type === 'Identifier') {
                                      if (element.id.name) {
                                        useDispatchLabel = element.id.name;
                                      }
                                    }
                                  }
                                }
                              }
                            }
                            else {
                              if (element.type === 'VariableDeclarator') {
                                if (element.init.type === 'ArrowFunctionExpression') {
                                  //innerArrowFuncBlock is everything after the arrow within an ArrowFunctionExpression variable declaration within MarketsContainer - for example, within handleDeleteCard, it's everything after the arrow.
                                  // console.log('---element.init.body---', element.init.body);
                                  if (element.init.body) {
                                    if (element.init.body.type === 'BlockStatement') {
                                      if (element.init.body.body) {
                                        const innerArrowFuncBlock = element.init.body.body;
                                        innerArrowFuncBlock.forEach((element) => {
                                          if (
                                            useDispatchLabel !== undefined &&
                                            element.type === 'ExpressionStatement' &&
                                            element.expression.type === 'CallExpression' &&
                                            element.expression.callee.type === 'Identifier' &&
                                            element.expression.callee.name === useDispatchLabel
                                          ) {
                                            //   //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                                            // );
                                            if (element.expression.arguments[0].type === 'CallExpression' &&
                                              element.expression.arguments[0].callee.type === 'Identifier') {
                                              this.dispatched.push(
                                                element.expression.arguments[0].callee.name)
                                            }
                                          };
                                        });
                                      }
                                    }
                                  };

                                }
                              }
                            }
                          }
                        }
                      
                      }
                  }
                        
                    if (
                          useDispatchLabel !== undefined &&
                          blockElement.type === 'ExpressionStatement' &&
                          blockElement.expression.callee.name === useDispatchLabel
                        ) {
                          this.dispatched.push(
                          //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                          blockElement.expression.arguments[0].callee.name)
                        }
              
            }
          }
        }
        });
      }
    });
  }
}


export default FileNode;
