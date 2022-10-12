//Babel Types imports allow for passing in the types to helper functions and continue benefiting from auto complete and type protection.
import {
  JSXElement,
  BlockStatement,
  CallExpression,
  IfStatement,
} from '@babel/types';

import { AstToken, AstBody, RenderedComp } from './types/types';

//FileNode class is constructed from each individual file traversed
//Helper functions build out the rest of the class by extracting from the AST
class FileNode {
  fileName!: string;
  filePath: string;
  astBody: AstBody;
  astTokens: AstToken; 
  imports: { [key: string]: string }[];
  renderedComponents!: { [key: string]: any }[];
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
   * RenderedComponents Structure
   * -> Component Name
   * ->->Prop Label {propLabel}
   * ->->->Prop Value {propValue}
   * @params none
   * @return none
   * 
   */
  getRenderComponents(): void {
    this.renderedComponents = [];
    
    //iterate through the astBody looking for the return statement
    this.astBody.forEach((rootBodyNode) => {
      //This if block is for a functional react component using an arrow function that is exported separate from the function definition
      if (rootBodyNode.type === 'VariableDeclaration') {
        rootBodyNode.declarations.forEach((variableDeclaration) => {
          if (variableDeclaration.type === 'VariableDeclarator') {
            
            if (variableDeclaration.init?.type === 'ArrowFunctionExpression') {
              //inside of the component function
              if (variableDeclaration.init.body.type === 'BlockStatement') {
                variableDeclaration.init.body.body.forEach(
                  (arrowFuncBlockElement) => {
                    if (
                      arrowFuncBlockElement.type === 'ReturnStatement' &&
                      arrowFuncBlockElement.argument &&
                      arrowFuncBlockElement.argument.type === 'JSXElement'
                    ) {
                      //inside of the return statement and found a JSXElement as the argument returned to pass into renders helper
                      const listOfRenders: JSXElement[] = this.getRendersList(
                        arrowFuncBlockElement.argument
                      );
                      //list of renders used to pull all rendered components as an array of JSXElements
                      //renders passed into getProps which returns an aray of rendered components and info on their props
                      this.renderedComponents.push(
                        this.getProps(listOfRenders)
                      );
                    }
                    //This block is for the situation that rendered components are in a JSXElement Expression outside of the return statement
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
                            //inside of the for loop and pulling out the rendered components to pass into getProps
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
      //This block is for functional components defined using the function declaration that are exported in place
      if (rootBodyNode.type === 'ExportNamedDeclaration') {
        if (rootBodyNode.declaration?.type === 'FunctionDeclaration') {
          if (rootBodyNode.declaration.body.type === 'BlockStatement') {
            rootBodyNode.declaration.body.body.forEach((blockElement) => {
              if (blockElement.type === 'ReturnStatement') {
                //in the return statement and passing any rendered components from renders list into get prop 
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
        //This block is for functional components defined using a function definition inside of a React.memo top level API call that is exported in place
        if (rootBodyNode.declaration?.type === 'VariableDeclaration') {
          rootBodyNode.declaration.declarations.forEach((varDeclaration) => {
            if (varDeclaration.type === 'VariableDeclarator') {
              if (varDeclaration.init?.type === 'CallExpression') {
                varDeclaration.init.arguments.forEach((arg) => {
                  if (arg.type === 'FunctionExpression') {
                    if (arg.body.type === 'BlockStatement') {
                      arg.body.body.forEach((blockElement) => {
                        if (blockElement.type === 'ReturnStatement') {
                          //inside return statement and pulls JSXElement argument for helper functions
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
  /**
   * 
   * @param elementName 
   * @returns boolean dependent on if the element name passed in is in the imported list
   * The code assumes that if a componenet is named in the JSXElement and it is imported into the file it is a rendered component
   */
  checkImports(elementName: string): Boolean {
    for (let importItem of this.imports) {
      const importName = Object.keys(importItem)[0];
      if (importName === elementName) {
        return true;
      }
    }
    return false;
  }
  /**
   * 
   * @param jsxElement 
   * @returns array of JSXElements to pass into the get props functions
   */

  getRendersList(jsxElement: JSXElement): JSXElement[] {
    let result: JSXElement[] = [];
    /**
     * 
     * @param child 
     * @returns Array of JSXElements 
     * Helper function that gets passed a child from a JSXElement to search recursively to check if any components include an imported component, meaning it is rendered
     */
    const extractFromChild = (child: JSXElement): JSXElement[] => {
      let res: JSXElement[] = [];
      //If the child element is not nested then we can check if the name of the element is in imports and push if it is a rendered component
      if (
        child.openingElement.name.type === 'JSXIdentifier' &&
        this.checkImports(child.openingElement.name.name)
      ) {
        res.push(child);
      }
      //if the child has children of its own of length more than 0 then we have to iterate the nested components
      if (child.children.length > 0) {
        child.children.forEach((cChild) => {
          if (cChild.type === 'JSXExpressionContainer') {
            //if the nested child component is a JSXElement recursively call the helper to find the rendered
            if (cChild.expression.type === 'JSXElement') {
              res = [...res, ...extractFromChild(cChild.expression)];
            }
            //if the nested child component is a function expression need to dig deeper to find the JSXelement and recursively call to pull
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
          //if the child is not nested pass recursive call to get list of renders
          if (cChild.type === 'JSXElement') {
            res = [...res, ...extractFromChild(cChild)];
          }
        });
      }
      return res;
    };
    //This is now the main function that accepts the first JSXElement in the return statement or forLoop
    //If the element has no children then opening element would be the only place a rendered component could be
    if (jsxElement.children.length === 0) {
      if (
        jsxElement.openingElement.type === 'JSXOpeningElement' &&
        jsxElement.openingElement.name.type === 'JSXIdentifier' &&
        this.checkImports(jsxElement.openingElement.name.name)
      ) {
        result.push(jsxElement);
      }
    } else {
      //if children exist iterate through and extract out JSX Element(s) using 
      jsxElement.children.forEach((child) => {
        let extracted: JSXElement | JSXElement[];

        if (child.type === 'JSXExpressionContainer') {
          //if child is expression container that is holding a jsxelement
          if (child.expression.type === 'JSXElement') {

            extracted = extractFromChild(child.expression);
            result = [...result, ...extracted];
          }
          //if jsx expression container is holding a function
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
        //if the child is not in an expression but just a JSXElement extract render info
        if (child.type === 'JSXElement') {
          extracted = extractFromChild(child);
          result = [...result, ...extracted];
        }
      });
    }
    return result;
  }
  /**
   * 
   * @param renders : An array of JSX Elements that consist of rendered components
   * @returns An object  of type RenderedComp which holds the name of the rendered component and any prop info
   */
  getProps(renders: JSXElement[]): RenderedComp {
    const res: RenderedComp = {};
    let compName: string;
    //loop through the list of rendered components to extract the relevant  information
    renders.forEach((render) => {
      //pull the component name out of the opening element property
      if (render.openingElement.name.type === 'JSXIdentifier') {
        compName = render.openingElement.name.name;
      }
      //the result object now sets the component name as a key to allow for adding prop info in 
      res[compName] = [];
      let propLabel: string;
      let propValue: string;
      render.openingElement.attributes.forEach((attr) => {
        //loop over each attribute looking for props information
        if (attr.type === 'JSXAttribute') {
          if (attr.name.type === 'JSXIdentifier') {
            //store the label for prop
            propLabel = attr.name.name;
          }
          //the prop value is nested inside an expression container
          if (attr.value?.type === 'JSXExpressionContainer') {
            //if the prop is directly  in the container
            if (attr.value.expression.type === 'Identifier') {
              propValue = attr.value.expression.name;
            }
            //if the prop is inside a function expression
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
          //react keys for react op under the hood and therefore just gets a value of unique identifier
          if (propLabel === 'key') {
            propValue = 'unique identifier';
          }
        }
        res[compName].push({ propLabel, propValue });
      });
    });
    return res;
  }
  /**
   * 
   * @param astBody 
   * Loops through file to find component and then loops through that for finding the use of useSelector to identify state pulled from the data store
   */
  getSelectedState(astBody: AstBody): void {
    this.selected = [];
    /**
     * 
     * @param blockStatement 
     * Helper function that accepts a blockstatement and finds the instance of useSelector or useappSelector and pushes the state variables
     */
    const getSelectedBlockStatement = (
      blockStatement: BlockStatement
    ): void => {
      //given a block element iterate to find a function call that uses selector keyword
      blockStatement.body.forEach((blockElement) => {
        if (blockElement.type === 'VariableDeclaration') {
          const declarationsArray = blockElement.declarations;

          declarationsArray?.forEach((element) => {

            if (element.init?.type === 'CallExpression') {
              if (element.init.callee.type === 'Identifier') {
                //useSelector is official method for grabbing state
                //useAppSelector is best practice method if you need to grab types along with state
                if (
                  element.init.callee.name === 'useSelector' ||
                  element.init.callee.name === 'useAppSelector'
                ) {
                  //once the callee with the keyword is found the reducer and state names can be found
                  let variableLabel: string;
                  let reducerName: string;
                  let stateName: string;
                  if (element.id.type === 'Identifier') {
                    variableLabel = element.id.name;
                  }
                  const useSelectorArguments = element.init.arguments;
                  useSelectorArguments.forEach((argument) => {
                    //the use selector is called inside an arrow function
                    if (argument.type === 'ArrowFunctionExpression') {
                      if (argument.body.type === 'MemberExpression') {
                        if (argument.body.object.type === 'MemberExpression') {
                          //searching through for the object name and property names
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
                      //the use selector is called inside a function definition
                      if (argument.body.type === 'CallExpression') {
                        if (argument.body.callee.type === 'MemberExpression') {
                          //searching through for the object name and property names
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
                      //once the label and names are found push to the selected array
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

    //main body of the function with goal of getting through the beginning of the file
    //dependent on type of function definition for the react function component their is a different path to getting to block statement
    astBody.forEach((node) => {
      //if functional component defined using arrow function exported sepearately
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
      //functional component using function declartion exported in place

        if (node.declaration?.type === 'FunctionDeclaration') {
          if (node.declaration.body.type === 'BlockStatement') {
            getSelectedBlockStatement(node.declaration.body);
          }
        }
        //Function declaration using function def inside of React.memo exported in place.
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
  /**
   * 
   * @param astBody 
   * Iterates through different react structures to get the variable label for the useDispatch function call
   * then the remainder of the file is iterated over to find the dispatched items from reducers
   */
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
            //iterates over declarations looking for invokation of dispatch keyword
            if (variableDec.type === 'VariableDeclarator') {
              if (
                variableDec.init?.type === 'CallExpression' &&
                variableDec.init.callee.type === 'Identifier'
              ) {
                if (
                  variableDec.init.callee.name === 'useAppDispatch' ||
                  variableDec.init.callee.name === 'useDispatch'
                ) {
                  //useDispatch and useAppDispatch are same but useAppDispatch passes types
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
      //iterate through the block body to find the useDispatchLabel and store relevant data
      blockBody.body.forEach((expression) => {
        if (
          expression.type === 'ExpressionStatement' &&
          expression.expression.type === 'CallExpression' &&
          expression.expression.callee.type === 'Identifier' &&
          expression.expression.callee.name === useDispatchLabel
        ) {
          //inside a block element that has the useDispatchLabel
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
              //after going through we only want to push if objectName and propertyName exist
              if (objectName && propertyName) {
                this.dispatched.push(`${objectName}.${propertyName}`);
              }
            }
          }
        }
        //if in an if statement use the ifStatement helper
        if (expression.type === 'IfStatement') {
          getDispatchedIfStatement(expression, useDispatchLabel);
        }
      });
    };
    /**
     * 
     * @param statement : IfStatement type 
     * @param useDispatchLabel 
     */
    const getDispatchedIfStatement = (
      statement: IfStatement,
      useDispatchLabel: string
    ): void => {
      if (statement.consequent.type === 'BlockStatement') {
        statement.consequent.body.forEach((consequentBlock) => {
          //looking through all code on if the if statement is true
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
      //look through all code if if statement is false
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
      //gets the dispatches if a call expression is reached meaning the dispatch function is called on one line of a variable defined function
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
    /**
     * 
     * @param blockStatement 
     * //helper for getting dispatch once reaching a block statement to dry out code
     */
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
                        //only want to enter this block when we useDispatchLabel is unknown
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
                                    //useDispatchLabel is what useDispatch gets saved to
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
                          //now that useDispatchLabel is known we can look for where it is implemented
                          if (element.type === 'VariableDeclarator') {
                            if (element.init) {
                              if (
                                element.init.type === 'ArrowFunctionExpression'
                              ) {
                                //innerArrowFuncBlock is everything after the arrow within an ArrowFunctionExpression variable declaration 

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
                      //dispatched directly in the react component and not nested in another function definition
                      useDispatchLabel !== undefined &&
                      blockElement.type === 'ExpressionStatement' &&
                      blockElement.expression.type === 'CallExpression' &&
                      blockElement.expression.callee.type === 'Identifier' &&
                      blockElement.expression.callee.name === useDispatchLabel
                    ) {
                      if (
                        //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                        blockElement.expression.arguments[0].type ===
                          'CallExpression' &&
                        blockElement.expression.arguments[0].callee.type ===
                          'Identifier'
                      ) {
                        this.dispatched.push(
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
      //
      if (node.type === 'ExportNamedDeclaration') {
      //functional component using function declartion exported in place

        if (node.declaration?.type === 'FunctionDeclaration') {
          if (node.declaration.body.type === 'BlockStatement') {
            dispatchHelper(node.declaration.body);
          }
        }
        //Function declaration using function def inside of React.memo exported in place.
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
