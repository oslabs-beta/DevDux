import {
  ArrowFunctionExpression,
  JSXElement,
  ReturnStatement,
  variableDeclaration,
  JSXAttribute,
  JSXSpreadAttribute,
  isReturnStatement,
  isJSXElement,
  JSX,
} from '@babel/types';
import { AstToken, AstBody, RenderedComp } from './types/types';

class FileNode {
  filePath: string;
  astBody: AstBody;
  astTokens: AstToken; //to resolve the errors in getRenderedComponents, maybe the type of astTokens has to be specified as deeply rested array of strings, so that there won't be an error when accessing properties on the astTokens stringified objects. I already tried making the type string[] instead of object[] and the errors are the same.
  imports: { [key: string]: string }[];
  type!: string; //does this need to be in the constructor? I didn't put it there because I thought it'd be more likely to break something if I added it as a parameter for the constructor. I added "type" here because this.type within getType was throwing an error. I added "undefined" as a possible type here because the "Quick Fix" option suggested it and it made an error go away.
  renderedComponents!: { [key: string]: any }[]; // //does this need to be in the constructor? I didn't add it for the same reason as described next to astTokens. I also added the type "undefined" for the same reason.
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

  // getRenderComponents(): void {
  //   const arr = this.imports.map((obj) => {
  //     if (Object.values(obj)[0].includes(".jsx")) {
  //       return Object.keys(obj)[0];
  //     }
  //   });
  //   const keyArray = arr.filter((e) => e);
  //   if (this.astTokens) {
  //     const result = this.astTokens?.slice().filter((token) => {
  //       if (token.type.label === "jsxName") {
  //         if (keyArray.includes(token.value)) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     });

  //     this.renderedComponents = result.map((token) => token.value);
  //   }
  // }

  // // getProps function
  // getProps(): void {
  //   const arr = this.imports.map((obj) => {
  //     if (!Object.values(obj)[0].includes(".jsx")) {
  //       return Object.keys(obj)[0];
  //     }
  //   });
  //   const keyArray = arr.filter((e) => e);
  //   if (this.selected) {
  //     //added this check for whether this.selected is not undefined because there was a type error being thrown in the below for loop indicating that we had to account for the possibility that there is no "selected."
  //     for (let i = 0; i < this.selected.length; i++) {
  //       keyArray.push(Object.keys(this.selected[i])[0]);
  //     }
  //   }
  //   this.astTokens?.forEach((token, i, arr) => {
  //     if (token.type.label === "const") {
  //       keyArray.push(arr[i + 1].value);
  //     }
  //   });

  //   const propObj: { key?: string; token?: { value: string } } = {};
  //   // const propObj: { [key: string]: [value: string] } = {};
  //   if (this.astTokens) {
  //     this.astTokens.forEach((token, i, arr) => {
  //     if (token.type.label === "jsxName") {
  //       if (this.renderedComponents[0]) {
  //         if (token.value === "key") {
  //           propObj["key"] = "unique identifier";
  //         }
  //         if (arr[i + 3].value === "props") {
  //           if (propObj.token !== undefined) {
  //             propObj.token.value = "props." + arr[i + 5].value;
  //           }
  //         } else if (
  //           keyArray.includes(arr[i + 3].value) &&
  //           arr[i + 3].value !== undefined
  //         ) {
  //           //console.log(token.value + " = " + arr[i + 3].value)
  //           if (propObj.token !== undefined) {
  //             propObj.token.value = arr[i + 3].value;
  //           }
  //         }
  //       }
  //     }

  //     this.props = propObj;
  //     });
  //   }

  // }
  /**
   * RenderedComponents
   * -> MarketCreator
   * ->->Prop Label addMarket passes handleAddMarket
   * -> MarketDisplay
   * ->->Prop Label marketlist passes marketlist
   * ->->Prop Label deleteCard passes handleDeleteCard
   * And So ON
   */
  getRenderComponents(): void {
    this.renderedComponents = [];
    //get into return statement of the variable declaration that is rendering the components on this page
    
    this.astBody.forEach((rootBodyNode) => {
      if (rootBodyNode.type === 'VariableDeclaration') {
        rootBodyNode.declarations.forEach((variableDeclaration) => {
          if (variableDeclaration.type === 'VariableDeclarator') {
            if (variableDeclaration.init?.type === 'ArrowFunctionExpression') {
              if (variableDeclaration.init.body.type === 'BlockStatement') {
                variableDeclaration.init.body.body.forEach(
                  (arrowFuncBlockElement) => {
                    if (arrowFuncBlockElement.type === 'ReturnStatement' &&
                      arrowFuncBlockElement.argument &&
                      arrowFuncBlockElement.argument.type === 'JSXElement') {
                      // if (arrowFuncBlockElement.argument?.type === 'JSXElement') {
                      //   //inside a return statement that is returning a JSX Element
                      //   //need to check if it has children to determine if component rendered is
                      //   //only item in return statement or if rendered components are nested)
                      //   if (arrowFuncBlockElement.argument.children.length === 0) {
                      //     //check if JSX Element being returned was imported to confirm it is a new react component
                      //     if (arrowFuncBlockElement.argument.openingElement.type === 'JSXOpeningElement' && arrowFuncBlockElement.argument.openingElement.name.type === 'JSXIdentifier' && arrowFuncBlockElement.argument.openingElement.name.name) {
                      //       let elementName = arrowFuncBlockElement.argument.openingElement.name.name;
                      //       if (this.checkImports(elementName)) {
                      //         const renderedComp: RenderedComp = { [elementName]: [] };
                      //         const propsList = arrowFuncBlockElement.argument.openingElement.attributes;
                      //         this.generateProps(renderedComp, propsList, elementName);
                      //         this.renderedComponents.push(renderedComp);

                      //       }
                      //     }
                      //   } else {
                      //     //JSXElement has children meaning the rendered components are nested
                      //     const jsxChildren = arrowFuncBlockElement.argument.children;
                      //     let jsxElement: JSXElement;
                      //     jsxChildren.forEach((jsxChild) => {

                      //       if (jsxChild.type === 'JSXExpressionContainer' &&
                      //       jsxChild.expression.type === 'JSXElement') {
                      //         jsxElement = jsxChild.expression;
                      //       } else if (jsxChild.type === 'JSXElement') {
                      //         jsxElement = jsxChild;
                      //       }
                      //       if (jsxElement &&
                      //         jsxElement.openingElement.type === 'JSXOpeningElement' &&
                      //         jsxElement.openingElement.name.type === 'JSXIdentifier') {
                      //         const elementName = jsxElement.openingElement.name.name;
                      //         if (this.checkImports(jsxElement.openingElement.name.name)) {
                      //           const renderedComp: RenderedComp = { [elementName]: [] };
                      //           const propsList = jsxElement.openingElement.attributes;
                      //           this.generateProps(renderedComp, propsList, elementName);
                      //           this.renderedComponents.push(renderedComp);

                      //         }
                      //       }
                      //     });
                      //   }
                      // }
                      const listOfRenders: JSXElement[] = this.getRendersList(
                        arrowFuncBlockElement.argument
                      );
                      this.renderedComponents.push(this.getProps(listOfRenders));
                    }
                    if (arrowFuncBlockElement.type === 'ForStatement') {
                      if (arrowFuncBlockElement.body.type === 'BlockStatement') {
                        const forBlock = arrowFuncBlockElement.body.body;
                        forBlock.forEach((subStatement) => {
                          if (subStatement.type === 'ExpressionStatement' &&
                            subStatement.expression.type === 'CallExpression' &&
                            subStatement.expression.arguments) {
                            subStatement.expression.arguments.forEach((arg) => { 
                              if (arg.type === 'JSXElement') {
                                const listOfRenders: JSXElement[] = this.getRendersList(arg);
                                this.renderedComponents.push(this.getProps(listOfRenders));
                              }
                            });
                          }
                        });
                      }
                    }
                  }
                );
              }
            }
          }
        });
      }
    });
  }
  checkImports(elementName: string): Boolean {
    for (let importItem of this.imports) {
      const importName = Object.keys(importItem)[0];
      if (importName === elementName) {
        return true;
      }
    }
    return false;
  }
  getProps(renders: JSXElement[]): RenderedComp {
    const res: RenderedComp = {};
    let compName: string;
    renders.forEach((render) => {
      
      if (render.openingElement.name.type === 'JSXIdentifier') {
        compName = render.openingElement.name.name;
      }
      res[compName] = [];
      let propLabel: string;
      let propValue: string;
      render.openingElement.attributes.forEach((attr) => {
        if (attr.type === 'JSXAttribute') {
          if (attr.name.type === 'JSXIdentifier') {
            propLabel = attr.name.name;
          }
          if (attr.value?.type === 'JSXExpressionContainer') {
            if (attr.value.expression.type === 'Identifier') {
            propValue = attr.value.expression.name;
            }
            if (attr.value.expression.type === 'MemberExpression') {
              if (attr.value.expression.object.type === 'MemberExpression') {
                if (attr.value.expression.object.property.type === 'Identifier') {
                  propValue = attr.value.expression.object.property.name;
                }
              } else if (attr.value.expression.property.type === 'Identifier') {
                propValue = attr.value.expression.property.name;
              }
            }
          }
          if (propLabel === 'key') {
            propValue = 'unique identifier';
          }
          
          
        }
        res[compName].push({ propLabel, propValue });
      });
    });
    return res;
  }
  // generateProps(
  //   renderedComp: RenderedComp,
  //   propsList: (JSXAttribute | JSXSpreadAttribute)[],
  //   elementName: string
  // ): void {
  //   if (propsList.length >= 0) {
  //     propsList.forEach((prop) => {
  //       if (
  //         prop.type === 'JSXAttribute' &&
  //         prop.name.type === 'JSXIdentifier'
  //       ) {
  //         const propLabel = prop.name.name;
  //         if (
  //           prop.value?.type === 'JSXExpressionContainer' &&
  //           prop.value.expression.type === 'Identifier'
  //         ) {
  //           const propValue = prop.value.expression.name;
  //           renderedComp[elementName].push({
  //             propLabel: propLabel,
  //             propValue: propValue,
  //           });
  //         }
  //       }
  //     });
  //   }
  // }
  getRendersList(jsxElement: JSXElement): JSXElement[] {
    let result: JSXElement[] = [];
    const extractFromChild = (child: JSXElement): JSXElement[] => {

      let res: JSXElement[]= [];
      if (
        child.openingElement.name.type === 'JSXIdentifier' &&
        this.checkImports(child.openingElement.name.name)
      ) {

        res.push(child);
        // if (this.filePath === "/Users/mgarza/Documents/LearnProgramming/CodeSmith/OSP/DevDux/Demo/client/containers/MainContainer.jsx") {
        // console.log(res);
        // }
      }
      if (child.children.length > 0) {
        child.children.forEach((cChild) => {
          if (cChild.type === 'JSXExpressionContainer') {
            if (cChild.expression.type === 'JSXElement') {
              res = [...res, ...extractFromChild(cChild.expression)];
            }
          }
          if (cChild.type === 'JSXElement') {
            res = [...res, ...extractFromChild(cChild)];
          }
        });
      }
      return res;
    };
      if (jsxElement.children.length === 0) {
        if (
          jsxElement.openingElement.type ===
            'JSXOpeningElement' &&
          jsxElement.openingElement.name.type ===
            'JSXIdentifier' &&
          this.checkImports(jsxElement.openingElement.name.name)
        ) {
          result.push(jsxElement);
        }
      } else {
        jsxElement.children.forEach((child) => {
          let extracted: JSXElement | JSXElement[];
          if (child.type === 'JSXExpressionContainer') {
            if (child.expression.type === 'JSXElement') {
              extracted = extractFromChild(child.expression);
                result = [...result, ...extracted];
            }
          }
          if (child.type === 'JSXElement') {
            extracted = extractFromChild(child);
              result = [...result, ...extracted];
          }
        });
      }
    return result;
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

                    if (element.init?.type === 'CallExpression') {
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
                                if (
                                  argument.body.object.type ===
                                  'MemberExpression'
                                ) {
                                  if (
                                    argument.body.object.property.type ===
                                    'Identifier'
                                  ) {
                                    reducerName =
                                      argument.body.object.property.name;
                                  }
                                }
                                if (
                                  argument.body.property.type === 'Identifier'
                                ) {
                                  stateName = argument.body.property.name;
                                }
                              }
                            }
                            this.selected.push({
                              [variableLabel]: `${reducerName}.${stateName}`,
                            });
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
                let useDispatchLabel: string;

                if (ArrowFuncBlock) {
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
                                  if (
                                    element.init.callee.name === 'useDispatch'
                                  ) {
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
                          }
                        } else {
                          if (element.type === 'VariableDeclarator') {
                            if (element.init) {
                              if (
                                element.init.type === 'ArrowFunctionExpression'
                              ) {
                                //innerArrowFuncBlock is everything after the arrow within an ArrowFunctionExpression variable declaration within MarketsContainer - for example, within handleDeleteCard, it's everything after the arrow.
                                // console.log('---element.init.body---', element.init.body);

                                if (element.init.body) {
                                  if (
                                    element.init.body.type === 'BlockStatement'
                                  ) {
                                    if (element.init.body.body) {
                                      const innerArrowFuncBlock =
                                        element.init.body.body;
                                      innerArrowFuncBlock.forEach((element) => {
                                        if (
                                          useDispatchLabel !== undefined &&
                                          element.type ===
                                            'ExpressionStatement' &&
                                          element.expression.type ===
                                            'CallExpression' &&
                                          element.expression.callee.type ===
                                            'Identifier' &&
                                          element.expression.callee.name ===
                                            useDispatchLabel
                                        ) {
                                          //   //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                                          // );
                                          if (
                                            element.expression.arguments[0]
                                              .type === 'CallExpression' &&
                                            element.expression.arguments[0]
                                              .callee.type === 'Identifier'
                                          ) {
                                            this.dispatched.push(
                                              element.expression.arguments[0]
                                                .callee.name
                                            );
                                          }
                                        }
                                      });
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      });
                    }
                    if (
                      useDispatchLabel !== undefined &&
                      blockElement.type === 'ExpressionStatement' &&
                      blockElement.expression.type === 'CallExpression' &&
                      blockElement.expression.callee.type === 'Identifier' &&
                      blockElement.expression.callee.name === useDispatchLabel
                    ) {
                      if (
                        blockElement.expression.arguments[0].type ===
                          'CallExpression' &&
                        blockElement.expression.arguments[0].callee.type ===
                          'Identifier'
                      ) {
                        // console.log('pushing to dispatched', blockElement.expression.arguments[0].callee.name);
                        this.dispatched.push(
                          //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch

                          blockElement.expression.arguments[0].callee.name
                        );
                      }
                    }
                  });
                }
              }
            }
          }
        });
      }
    });
    // console.log('this.dispatched', this.dispatched);
  }
}

export default FileNode;
