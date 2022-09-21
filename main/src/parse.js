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

// ast.program.body.forEach((node) => {
//   console.log('newnode', node);
// })
const filesToVisit = [];
console.log(
  ast.program.body.filter((node) => {
    if (node.type === 'ImportDeclaration') {
      console.log(node.source.value);
      return node.source.value === './containers/MainContainer.jsx';
    }
  })
);
