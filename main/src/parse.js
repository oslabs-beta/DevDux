import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
import FileNode from './FileNode.js';
console.log('test');

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

// console.log(test);
const ast = babelParser.parse(test, {
  sourceType: 'module',
  tokens: true,
  plugins: ['jsx', 'typescript'],
});
ast.program.body.forEach((node) => {
  if (node.type === 'VariableDeclaration') {
    const declarations = node.declarations;
    declarations.forEach((declaration) => {
      if (declaration.init.type === 'ArrowFunctionExpression') {
        const ArrowFuncBlock = declaration.init.body.body;
        console.log(ArrowFuncBlock);
        ArrowFuncBlock.forEach((blockElement) => {
          if (blockElement.type === 'VariableDeclaration') {
            const declarationsArray = blockElement.declarations;
            declarationsArray.forEach((element) => {
              if (element?.init?.name === 'useSelector') {
                console.log(element.init);
              }
            });
          }
        });
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
    //console.log(currentFile);

    const readFile = fs.readFileSync(currentFile, 'utf-8');
    const ast = babelParser.parse(readFile, {
      tokens: true,
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    ast.program.body.forEach((node) => {
      if (node.type === 'ImportDeclaration') {
        if (node.source.value[0] === '.') {
          const importFile = path.resolve(
            path.parse(currentFile).dir,
            node.source.value
          );
          if (fileData[importFile] === undefined) {
            importList.push(importFile);
            // fileData[importFile] = {};
            const astBody = ast.program.body;
            const astTokens = ast.tokens;
            fileData[node.source.value] = new FileNode(
              importFile,
              astBody,
              astTokens
            );
          }
        }
      }
    });
    // console.log('fileData:', fileData);
  }
};

const fp = path.resolve('../../Demo/client/index.js');
// getImports(fp);
// console.log(fileData);
const buildClasses = (fD) => {
  for (const [file, node] of Object.entries(fD)) {
    node.getSelectedState(ast);
  }
};
// buildClasses(fileData);
console.log(fileData);
// const filesToVisit = [];

// console.log(
//   ast.program.body.filter((node) => {
//     if (node.type === 'ImportDeclaration') {
//       console.log(node.source.value);
//       return node.source.value === './containers/MainContainer.jsx';
//     }
//   })
// );
