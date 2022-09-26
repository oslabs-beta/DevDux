import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
import FileNode from './FileNode.js';
// console.log('test');

// const test = fs.readFileSync(
//   '/Users/hinakhalid/CodeSmith/OSP/ospDemo/DevDux/Demo/client/containers/MarketsContainer.jsx',
//   'utf-8',
//   (err, data) => {
//     if (err) console.log(err);
//   }
// );

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
          let importName;
          node.specifiers.forEach((specifier) => {
            //console.log(specifier);
            fileData[baseName].imports.push({ [specifier.local.name]: importFile })
          })

          const importListBaseName = path.parse(importFile).base;
          if (fileData[importListBaseName] === undefined) {
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
    //console.log(file);
    node.getSelectedState(node.astBody);
    //console.log(node.selected);
    // console.log(file);
    //console.log(file, ': imports --->', node.imports);
    // console.log("--->", node.imports[0])
  }
};
// console.log(fileData);
// console.log(buildClasses(fileData));
buildClasses(fileData)
const node = fileData['MarketsContainer.jsx'];
//console.log(node.getRenderComponents());
node.getProps();
node.getRenderComponents();

// const getRenders = (fileNode) => {
//   //console.log('in getRenders')
//   //console.log("--->", fileNode.astTokens)
//   fileNode.astTokens.forEach((token, i) => {
//     //console.log("token type:", token.type);DY
//     // const currentToken = token
//     //console.log(i, token.value)
//     //if (token.type.label.includes('JSX')) console.log(token);
//   })
// }


// figure out which components are being rendered in each file
// and which props are being passed in each file

//buildClasses(fileData);