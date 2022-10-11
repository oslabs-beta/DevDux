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
  Statement,
  expressionStatement,
  blockStatement,
  BlockStatement,
  callExpression,
  CallExpression,
  Block,
  IfStatement,
} from '@babel/types';
import { stat } from 'fs';

import { AstToken, AstBody, RenderedComp } from './types/types';

class FileNode {
  fileName!: string;
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
                    if (
                      arrowFuncBlockElement.type === 'ReturnStatement' &&
                      arrowFuncBlockElement.argument &&
                      arrowFuncBlockElement.argument.type === 'JSXElement'
                    ) {
                      const listOfRenders: JSXElement[] = this.getRendersList(
                        arrowFuncBlockElement.argument
                      );
                      this.renderedComponents.push(
                        this.getProps(listOfRenders)
                      );
                    }
                    if (arrowFuncBlockElement.type === 'ForStatement') {
                      if (
                        arrowFuncBlockElement.body.type === 'BlockStatement'
                      ) {
                        const forBlock = arrowFuncBlockElement.body.body;
                        forBlock.forEach((subStatement) => {
                          if (
                            subStatement.type === 'ExpressionStatement' &&
                            subStatement.expression.type === 'CallExpression' &&
                            subStatement.expression.arguments
                          ) {
                            subStatement.expression.arguments.forEach((arg) => {
                              if (arg.type === 'JSXElement') {
                                const listOfRenders: JSXElement[] =
                                  this.getRendersList(arg);
                                this.renderedComponents.push(
                                  this.getProps(listOfRenders)
                                );
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
      if (rootBodyNode.type === 'ExportNamedDeclaration') {
        if (rootBodyNode.declaration?.type === 'FunctionDeclaration') {
          if (rootBodyNode.declaration.body.type === 'BlockStatement') {
            rootBodyNode.declaration.body.body.forEach((blockElement) => {
              if (blockElement.type === 'ReturnStatement') {
                if (blockElement.argument?.type === 'JSXElement') {
                  const listOfRenders: JSXElement[] = this.getRendersList(
                    blockElement.argument
                  );
                  this.renderedComponents.push(this.getProps(listOfRenders));
                }
              }
            });
          }
        }
        if (rootBodyNode.declaration?.type === 'VariableDeclaration') {
          rootBodyNode.declaration.declarations.forEach((varDeclaration) => {
            if (varDeclaration.type === 'VariableDeclarator') {
              if (varDeclaration.init?.type === 'CallExpression') {
                varDeclaration.init.arguments.forEach((arg) => {
                  if (arg.type === 'FunctionExpression') {
                    if (arg.body.type === 'BlockStatement') {
                      arg.body.body.forEach((blockElement) => {
                        if (blockElement.type === 'ReturnStatement') {
                          if (blockElement.argument?.type === 'JSXElement') {
                            if (blockElement.argument?.type === 'JSXElement') {
                              const listOfRenders: JSXElement[] =
                                this.getRendersList(blockElement.argument);
                              this.renderedComponents.push(
                                this.getProps(listOfRenders)
                              );
                            }
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
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
                if (
                  attr.value.expression.object.property.type === 'Identifier'
                ) {
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

  getRendersList(jsxElement: JSXElement): JSXElement[] {
    let result: JSXElement[] = [];
    const extractFromChild = (child: JSXElement): JSXElement[] => {
      let res: JSXElement[] = [];
      if (
        child.openingElement.name.type === 'JSXIdentifier' &&
        this.checkImports(child.openingElement.name.name)
      ) {
        res.push(child);
      }
      if (child.children.length > 0) {
        child.children.forEach((cChild) => {
          if (cChild.type === 'JSXExpressionContainer') {
            if (cChild.expression.type === 'JSXElement') {
              res = [...res, ...extractFromChild(cChild.expression)];
            }
            if (cChild.expression.type === 'CallExpression') {
              if (cChild.expression.callee.type === 'MemberExpression') {
                if (cChild.expression.arguments) {
                  cChild.expression.arguments.forEach((arg) => {
                    if (arg.type === 'ArrowFunctionExpression') {
                      if (arg.body.type === 'JSXElement') {
                        res = [...res, ...extractFromChild(arg.body)];
                      }
                    }
                  });
                }
              }
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
        jsxElement.openingElement.type === 'JSXOpeningElement' &&
        jsxElement.openingElement.name.type === 'JSXIdentifier' &&
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
          if (child.expression.type === 'CallExpression') {
            if (child.expression.callee.type === 'MemberExpression') {
              child.expression.arguments.forEach((arg) => {
                if (arg.type === 'ArrowFunctionExpression') {
                  if (arg.body.type === 'JSXElement') {
                    result = [...result, ...extractFromChild(arg.body)];
                  }
                }
              });
            }
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
    //helpers
    const getSelectedBlockStatement = (
      blockStatement: BlockStatement
    ): void => {
      blockStatement.body.forEach((blockElement) => {
        if (blockElement.type === 'VariableDeclaration') {
          const declarationsArray = blockElement.declarations;

          declarationsArray?.forEach((element) => {

            if (element.init?.type === 'CallExpression') {
              if (element.init.callee.type === 'Identifier') {
                if (
                  element.init.callee.name === 'useSelector' ||
                  element.init.callee.name === 'useAppSelector'
                ) {
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
                          if (
                            argument.body.object.property.type === 'Identifier'
                          ) {
                            reducerName = argument.body.object.property.name;
                          }
                        }
                        if (argument.body.object.type === 'Identifier') {
                          reducerName = argument.body.object.name;
                        }
                        if (argument.body.property.type === 'Identifier') {
                          stateName = argument.body.property.name;
                        }
                      }

                      if (argument.body.type === 'CallExpression') {
                        if (argument.body.callee.type === 'MemberExpression') {
                          if (
                            argument.body.callee.object.type === 'Identifier'
                          ) {
                            reducerName = argument.body.callee.object.name;
                          }
                          if (
                            argument.body.callee.property.type === 'Identifier'
                          ) {
                            stateName = argument.body.callee.property.name;
                          }
                        }
                      }
                      this.selected.push({
                        [variableLabel]: `${reducerName}.${stateName}`,
                      });
                    }
                  });
                }
              }
            }
          });
        }
      });
    };
    astBody.forEach((node) => {
      if (node.type === 'VariableDeclaration') {
        const declarations = node.declarations;
        declarations.forEach((declaration) => {
          if (declaration?.init?.type === 'ArrowFunctionExpression') {
            if (declaration.init.body.type === 'BlockStatement') {
              getSelectedBlockStatement(declaration.init.body);
            }
          }
        });
      }
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration?.type === 'FunctionDeclaration') {
          if (node.declaration.body.type === 'BlockStatement') {
            getSelectedBlockStatement(node.declaration.body);
          }
        }
        if (node.declaration?.type === 'VariableDeclaration') {
          node.declaration.declarations.forEach((varDeclaration) => {
            if (
              varDeclaration.type === 'VariableDeclarator' &&
              varDeclaration.init?.type === 'CallExpression'
            ) {
              varDeclaration.init.arguments.forEach((arg) => {
                if (
                  arg.type === 'FunctionExpression' &&
                  arg.body.type === 'BlockStatement'
                ) {
                  getSelectedBlockStatement(arg.body);
                }
              });
            }
          });
        }
      }
    });
  }
  getDispatched(astBody: AstBody): void {
    //initialize dispatched array which extracts will be pushed in
    this.dispatched = [];
    //helpers for drying out code
    /**
     *
     * @param blockStatement
     * @returns string or undefined of the label storing the useDispatch
     * Starts at blockStatement and searches for useDispatch or useAppDispatch
     * to return the label
     */
    const getUseDispatchLabel = (
      blockStatement: BlockStatement
    ): string | undefined => {
      let useDispatchLabel: string | undefined;
      blockStatement.body.forEach((blockBody) => {
        if (blockBody.type === 'VariableDeclaration') {
          blockBody.declarations.forEach((variableDec) => {
            if (variableDec.type === 'VariableDeclarator') {
              if (
                variableDec.init?.type === 'CallExpression' &&
                variableDec.init.callee.type === 'Identifier'
              ) {
                if (
                  variableDec.init.callee.name === 'useAppDispatch' ||
                  variableDec.init.callee.name === 'useDispatch'
                ) {
                  if (variableDec.id.type === 'Identifier') {
                    useDispatchLabel = variableDec.id.name;
                  }
                }
              }
            }
          });
        }
      });
      return useDispatchLabel;
    };
    /**
     *
     * @param blockBody
     * @param useDispatchLabel
     * Takes in a blockstatement and searches for the useDispatchLabel
     * once found it pushes the object name and parameter name to
     * this.dispatched array
     */
    const getDispatchesBlockStatement = (
      blockBody: BlockStatement,
      useDispatchLabel: string
    ): void => {
      let objectName: string;
      let propertyName: string;
      blockBody.body.forEach((expression) => {
        if (
          expression.type === 'ExpressionStatement' &&
          expression.expression.type === 'CallExpression' &&
          expression.expression.callee.type === 'Identifier' &&
          expression.expression.callee.name === useDispatchLabel
        ) {
          if (expression.expression.arguments[0].type === 'CallExpression') {
            if (
              expression.expression.arguments[0].callee.type ===
              'MemberExpression'
            ) {
              if (
                expression.expression.arguments[0].callee.object.type ===
                'Identifier'
              ) {
                objectName =
                  expression.expression.arguments[0].callee.object.name;
              }
              if (
                expression.expression.arguments[0].callee.property.type ===
                'Identifier'
              ) {
                propertyName =
                  expression.expression.arguments[0].callee.property.name;
              }
              if (objectName && propertyName) {
                this.dispatched.push(`${objectName}.${propertyName}`);
              }
            }
          }
        }
        if (expression.type === 'IfStatement') {
          getDispatchedIfStatement(expression, useDispatchLabel);
        }
      });
    };
    const getDispatchedIfStatement = (
      statement: IfStatement,
      useDispatchLabel: string
    ): void => {
      if (statement.consequent.type === 'BlockStatement') {
        statement.consequent.body.forEach((consequentBlock) => {
          if (consequentBlock.type === 'ExpressionStatement') {
            if (consequentBlock.expression.type === 'CallExpression') {
              if (
                consequentBlock.expression.callee.type === 'Identifier' &&
                consequentBlock.expression.callee.name === useDispatchLabel
              ) {
                consequentBlock.expression.arguments.forEach((expressArgs) => {
                  if (
                    expressArgs.type === 'CallExpression' &&
                    expressArgs.callee.type === 'MemberExpression'
                  ) {
                    if (
                      expressArgs.callee.object.type === 'Identifier' &&
                      expressArgs.callee.property.type === 'Identifier'
                    ) {
                      this.dispatched.push(
                        `${expressArgs.callee.object.name}.${expressArgs.callee.property.name}`
                      );
                    }
                  }
                });
              }
            }
          }
        });
      }
      if (statement.alternate?.type === 'BlockStatement') {
        statement.alternate.body.forEach((bodyElement) => {
          if (
            bodyElement.type === 'ExpressionStatement' &&
            bodyElement.expression.type === 'CallExpression' &&
            bodyElement.expression.callee.type === 'Identifier' &&
            bodyElement.expression.callee.name === useDispatchLabel
          ) {
            bodyElement.expression.arguments.forEach((expressArgs) => {
              if (
                expressArgs.type === 'CallExpression' &&
                expressArgs.callee.type === 'MemberExpression' &&
                expressArgs.callee.object.type === 'Identifier' &&
                expressArgs.callee.property.type === 'Identifier'
              ) {
                this.dispatched.push(
                  `${expressArgs.callee.object.name}.${expressArgs.callee.property.name}`
                );
              }
            });
          }
        });
      }
    };
    /**
     *
     * @param callExpression
     * @param useDispatchLabel
     */
    const getDispatchesCallExpression = (
      callExpression: CallExpression,
      useDispatchLabel: string
    ): void => {
      if (
        callExpression.callee.type === 'Identifier' &&
        callExpression.callee.name === useDispatchLabel
      ) {
        if (callExpression.arguments[0].type === 'CallExpression') {
          if (callExpression.arguments[0].callee.type === 'MemberExpression') {
            const object = callExpression.arguments[0].callee.object;
            const property = callExpression.arguments[0].callee.property;
            if (
              object.type === 'Identifier' &&
              property.type === 'Identifier'
            ) {
              this.dispatched.push(`${object.name}.${property.name}`);
            }
          }
        }
      }
    };
    const dispatchHelper = (blockStatement: BlockStatement): void => {
      let useDispatchLabel: string | undefined =
        getUseDispatchLabel(blockStatement);
      blockStatement.body.forEach((blockBody) => {
        if (blockBody.type === 'VariableDeclaration') {
          blockBody.declarations.forEach((variableDec) => {
            if (
              variableDec.init &&
              variableDec.init.type === 'ArrowFunctionExpression'
            ) {
              if (
                variableDec.init.body.type === 'BlockStatement' &&
                useDispatchLabel !== undefined
              ) {
                getDispatchesBlockStatement(
                  variableDec.init.body,
                  useDispatchLabel
                );
              }
              if (
                variableDec.init.body.type === 'CallExpression' &&
                useDispatchLabel !== undefined
              ) {
                getDispatchesCallExpression(
                  variableDec.init.body,
                  useDispatchLabel
                );
              }
            }
          });
        }
      });
    };
    /**
     * Main Section of Function
     * Iterates through first to find the useDispatchLabel
     * Then iterates through remainder to search for where the useDispatchLabel
     * is used
     */
    astBody.forEach((node) => {
      if (node.type === 'VariableDeclaration') {
        const declarations = node.declarations;
        //declarations is the entire MarketContainer function, including "const MarketsContainer"
        declarations.forEach((declaration) => {
          if (declaration.type === 'VariableDeclarator') {
            if (declaration?.init?.type === 'ArrowFunctionExpression') {
              //ArrowFunctionExpression is the body of MarketsContainer (everything after the equals sign after MarketsContainer)
              if (declaration.init.body.type === 'BlockStatement') {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const ArrowFuncBlock = declaration.init.body.body;
                //ArrowFuncBlock is the array of blocks (?) within MarketsContainer
                let useDispatchLabel: string;

                if (ArrowFuncBlock) {
                  ArrowFuncBlock.forEach((blockElement) => {
                    if (blockElement.type === 'VariableDeclaration') {
                      //declarationsArray is all code/data about one variable declaration within MarketsContainer
                      const declarationsArray = blockElement.declarations;
                      declarationsArray.forEach((element) => {
                        if (useDispatchLabel === undefined) {
                          if (element.init) {
                            if (element.init.type === 'CallExpression') {
                              if (element.init.callee) {
                                if (element.init.callee.type === 'Identifier') {
                                  if (
                                    element.init.callee.name ===
                                      'useDispatch' ||
                                    element.init.callee.name ===
                                      'useAppDispatch'
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
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration?.type === 'FunctionDeclaration') {
          if (node.declaration.body.type === 'BlockStatement') {
            dispatchHelper(node.declaration.body);
          }
        }
        if (node.declaration?.type === 'VariableDeclaration') {
          node.declaration.declarations.forEach((declarations) => {
            if (declarations.init?.type === 'CallExpression') {
              if (declarations.init.arguments) {
                declarations.init.arguments.forEach((arg) => {
                  if (arg.type === 'FunctionExpression') {
                    if (arg.body.type === 'BlockStatement') {
                      dispatchHelper(arg.body);
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }
}

export default FileNode;
