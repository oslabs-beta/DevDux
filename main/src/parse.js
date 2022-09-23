import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
import FileNode from './FileNode.js';
// console.log('test');

<<<<<<< HEAD

// const test = fs.readFileSync(
//   '/Users/joshuamiller/Codesmith/DevDux/Demo/client/containers/MainContainer.jsx',
//   'utf-8',
//   (err, data) => {
//     if (err) console.log(err);
//   }
// );

const test = fs.readFileSync(
=======
>>>>>>> 7f7094f8 (Co-authored-by: hina-khalid <hina-khalid@users.noreply.github.com>)

const test = fs.readFileSync(

  '/Users/joshuamiller/Codesmith/DevDux/Demo/client/containers/MainContainer.jsx',
  'utf-8',
  (err, data) => {
    if (err) console.log(err);
  }
);

<<<<<<< HEAD
=======
// const test = fs.readFileSync(
//   '/Users/joshuamiller/Codesmith/DevDux/Demo/client/containers/MainContainer.jsx',
//   'utf-8',
//   (err, data) => {
//     if (err) console.log(err);
//   }
// );

>>>>>>> 7f7094f8 (Co-authored-by: hina-khalid <hina-khalid@users.noreply.github.com>)
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

<<<<<<< HEAD
          //console.log({currentFile}, node.source.value)
          if (fileData[importFile] === undefined) {

          const baseName = path.parse(importFile).base;
          if (fileData[baseName] === undefined) {

=======
          const baseName = path.parse(importFile).base;
          if (fileData[baseName] === undefined) {

          //console.log({currentFile}, node.source.value)
          if (fileData[importFile] === undefined) {

>>>>>>> 7f7094f8 (Co-authored-by: hina-khalid <hina-khalid@users.noreply.github.com>)
            importList.push(importFile);
          }
        }
      }
    });
  }
};


<<<<<<< HEAD
const fp = path.resolve('../../Demo/client/index.js');


// fp prints ---> /Users/joshuamiller/Codesmith/DevDux/Demo/client/index.js

const fp = path.resolve('../../Demo/client/App.jsx');

getImports(fp);


// getImports(fp);


getImports(fp);

=======
const fp = path.resolve('../../Demo/client/App.jsx');

const fp = path.resolve('../../Demo/client/index.js');
// fp prints ---> /Users/joshuamiller/Codesmith/DevDux/Demo/client/index.js

getImports(fp);

>>>>>>> 7f7094f8 (Co-authored-by: hina-khalid <hina-khalid@users.noreply.github.com>)
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

<<<<<<< HEAD
// console.log(fileData['MarketCreator.jsx'].filePath);

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
=======
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
<<<<<<< HEAD

getRenders(MarketsContainerNode);
>>>>>>> fb4ea6b8 (Co-authored-by: hina-khalid <hina-khalid@users.noreply.github.com>)
=======
//getRenders(MarketContainerNode);
>>>>>>> 7f7094f8 (Co-authored-by: hina-khalid <hina-khalid@users.noreply.github.com>)

// console.log(
//   ast.program.body.filter((node) => {
//     if (node.type === 'ImportDeclaration') {
//       console.log(node.source.value);
//       return node.source.value === './containers/MainContainer.jsx';
//     }
//   })
// );

