import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
console.log('test');

const test = fs.readFileSync(
  '../../Demo/client/App.jsx',
  'utf-8',
  (err, data) => {
    if (err) console.log(err);

    // console.log('working');
    // //console.log(data);
    // const ast = babelParser.parse(data);
    // console.log(ast);
    // return ast;
  }
);

// console.log(test);
const ast = babelParser.parse(test, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
});
// console.log(ast);
// ast.program.body.forEach((node) => {
//   console.log('newnode', node);
// })
const fileData = {};

const getImports = (filePath) => {
  const importList = [];
  importList.push(filePath);
  while (importList.length > 0) {
    const currentFile = importList.shift();
    console.log(currentFile);

    const readFile = fs.readFileSync(currentFile, 'utf-8');
    const ast = babelParser.parse(readFile, {
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
            console.log('in if statement');
            importList.push(importFile);
            fileData[importFile] = {};
          }
        }
      }
    });
    console.log('fileData:', fileData);
  }
};

const fp = '../../Demo/client/index.js';
getImports(fp);
// console.log(fileData);
// const filesToVisit = [];

// console.log(
//   ast.program.body.filter((node) => {
//     if (node.type === 'ImportDeclaration') {
//       console.log(node.source.value);
//       return node.source.value === './containers/MainContainer.jsx';
//     }
//   })
// );
