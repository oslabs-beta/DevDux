import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
import FileNode from './FileNode.js';
console.log('test');

// const test = fs.readFileSync(
//   '/Users/joshuamiller/Codesmith/DevDux/Demo/client/containers/MainContainer.jsx',
//   'utf-8',
//   (err, data) => {
//     if (err) console.log(err);
//   }
// );
// console.log('working');
// //console.log(data);
// const ast = babelParser.parse(data);
// console.log(ast);
// return ast;
//   }
// );

// console.log(test);
// const ast = babelParser.parse(test, {
//   sourceType: 'module',
//   tokens: true,
//   plugins: ['jsx', 'typescript'],
// });
// // console.log(ast);
// ast.tokens.forEach((token, i) => {
//   console.log(`token number ${i}`);
//   console.log('token label:', token.type.label);
//   console.log('token value:', token.value || 'no value');
//   console.log('\n');
// });
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
          //console.log({currentFile}, node.source.value)
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
// fp prints ---> /Users/joshuamiller/Codesmith/DevDux/Demo/client/index.js
getImports(fp);

// console.log(fileData);
const buildClasses = (fD) => {
  for (const [file, node] of Object.entries(fD)) {
    node.getType(node.ast);
  }
};
buildClasses(fileData);
// console.log(fileData);
// const filesToVisit = [];

const MarketsContainerNode = fileData['./MarketsContainer.jsx'];


//console.log(fileData)
console.log(fileData['./MarketsContainer.jsx'].astTokens === fileData['./Market.jsx'].astTokens);
//console.log(fileData['../components/TotalsDisplay.jsx'].astTokens)

const getRenders = (fileNode) => {
  //console.log('in getRenders')
  //console.log("--->", fileNode.astTokens)
  fileNode.astTokens.forEach( (token, i) => {
    //console.log("token type:", token.type);DY
    // const currentToken = token
    //console.log(i, token.value)
    //if (token.type.label.includes('JSX')) console.log(token);
  })
}
//getRenders(MarketContainerNode);

// console.log(
//   ast.program.body.filter((node) => {
//     if (node.type === 'ImportDeclaration') {
//       console.log(node.source.value);
//       return node.source.value === './containers/MainContainer.jsx';
//     }
//   })
// );
