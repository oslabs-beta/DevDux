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

// const ast = babelParser.parse(test, {
//   sourceType: 'module',
//   tokens: true,
//   plugins: ['jsx', 'typescript'],
// });

// ast.program.body.forEach((node) => {
//   if (node.type === 'VariableDeclaration') {
//     const declarations = node.declarations;

//     declarations.forEach((declaration) => {
//       if (declaration.init.type === 'ArrowFunctionExpression') {
//         const ArrowFuncBlock = declaration.init.body.body;

//         ArrowFuncBlock.forEach((blockElement) => {
//           if (blockElement.type === 'VariableDeclaration') {
//             const declarationsArray = blockElement.declarations;

//             declarationsArray.forEach((element) => {
//               if (element?.init?.callee?.name === 'useSelector') {
//                 const variableLabel = element.id.name;
//                 const useSelectorArguments = element.init.arguments;

//                 useSelectorArguments.forEach((argument) => {
//                   if (argument.type === 'ArrowFunctionExpression'){
//                     const reducerName = argument.body.object.property.name;
//                     const stateName = argument.body.property.name;

//                   }
//                 })
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });

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
    // console.log(file);
    console.log(file);
    node.getSelectedState(node.astBody);
    console.log(node.selected);
  }
};
buildClasses(fileData);
