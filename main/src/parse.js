import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
import FileNode from './FileNode.js';
// console.log('test');

const test = fs.readFileSync(
  '/Users/mgarza/Documents/LearnProgramming/CodeSmith/OSP/DevDux/Demo/client/containers/MarketsContainer.jsx',
  'utf-8',
  (err, data) => {
    if (err) console.log(err);
  }
);
// console.log('working');
// //console.log(data);
// const ast = babelParser.parse(data);
// console.log(ast);
// return ast;
//   }
// );

const ast = babelParser.parse(test, {
  sourceType: 'module',
  tokens: true,
  plugins: ['jsx', 'typescript'],
});

/////////Get useSelectors
// ast.program.body.forEach((node) => {
//   if (node.type === 'VariableDeclaration') {
//     const declarations = node.declarations;

//     declarations.forEach((declaration) => {
//       if (declaration.init.type === 'ArrowFunctionExpression') {
//         const ArrowFuncBlock = declaration.init.body.body;
//         if (ArrowFuncBlock) {
//           ArrowFuncBlock.forEach((blockElement) => {
//             if (blockElement.type === 'VariableDeclaration') {
//               const declarationsArray = blockElement.declarations;

//               declarationsArray.forEach((element) => {
//                 if (element?.init?.callee?.name === 'useSelector') {
//                   const variableLabel = element.id.name;
//                   const useSelectorArguments = element.init.arguments;
//                   console.log(variableLabel);
//                   useSelectorArguments.forEach((argument) => {
//                     if (argument.type === 'ArrowFunctionExpression') {
//                       const reducerName = argument.body.object.property.name;
//                       const stateName = argument.body.property.name;
//                       console.log(reducerName, stateName);
//                     }
//                   });
//                 }
//               });
//             }
//           });
//         }
//       }
//     });
//   }
// });
/////////Get useDispatch
ast.program.body.forEach((node) => {
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
                        element.type === 'ExpressionStatement' &&
                        element.expression.callee.name === useDispatchLabel
                      ) {
                        console.log(
                          'args name',
                          //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                          element.expression.arguments[0].callee.name
                        );
                      }
                    });
                  }
                }
              });
            }
            if (
              blockElement.type === 'ExpressionStatement' &&
              blockElement.expression.callee.name === useDispatchLabel
            ) {
              console.log(
                'args name',
                //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                blockElement.expression.arguments[0].callee.name
              );
            }
          });
        }
      }
    });
  }
});

const fileData = {};

const getImports = (filePath) => {
  const importList = [];
  importList.push(filePath);

  while (importList.length > 0) {
    const currentFile = importList.shift();

    const readFile = fs.readFileSync(currentFile, 'utf-8');
    const ast = babelParser.parse(readFile, {
      tokens: true,
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    const astBody = ast.program.body;
    const astTokens = ast.tokens;
    const baseName = path.parse(currentFile).base;
    fileData[baseName] = new FileNode(currentFile, astBody, astTokens);
    ast.program.body.forEach((node) => {
      if (node.type === 'ImportDeclaration') {
        if (node.source.value[0] === '.') {
          const importFile = path.resolve(
            path.parse(currentFile).dir,
            node.source.value
          );
          const baseName = path.parse(importFile).base;
          if (fileData[baseName] === undefined) {
            importList.push(importFile);
          }
        }
      }
    });
  }
};

const fp = path.resolve('../../Demo/client/App.jsx');
getImports(fp);
// console.log(fileData);
const buildClasses = (fD) => {
  for (const [file, node] of Object.entries(fD)) {
    console.log('file within buildClasses:', file);
    node.getSelectedState(node.astBody);
    node.getDispatched(node.astBody);
    console.log('node.dispatched within buildClasses:', node.dispatched);
    // console.log(node.astTokens[0]);
  }
};
buildClasses(fileData);
// console.log(fileData);
