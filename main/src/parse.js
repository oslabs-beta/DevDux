import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';
//import Market from '../../Demo/client/components/Market.jsx';
import FileNode from './FileNode.js';
// console.log('test');

// const test = fs.readFileSync(
//   '/Users/hinakhalid/CodeSmith/OSP/ospDemo/DevDux/Demo/client/containers/MarketsContainer.jsx',
//   'utf-8',
//   (err, data) => {
//     if (err) console.log(err);
//   }
// );

const getImports = (filePath) => {
  const fileData = {};
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

    // console.log('----AST TOKENS---',astTokens)

    const baseName = path.parse(currentFile).base;
    fileData[baseName] = new FileNode(currentFile, astBody, astTokens);
    ast.program.body.forEach((node) => {
      if (node.type === 'ImportDeclaration') {
        if (node.source.value[0] === '.') {
          const importFile = path.resolve(
            path.parse(currentFile).dir,
            node.source.value
          );
          node.specifiers.forEach((specifier) => {
            //console.log(specifier);
            fileData[baseName].imports.push({
              [specifier.local.name]: importFile,
            });
          });

          const importListBaseName = path.parse(importFile).base;
          if (fileData[importListBaseName] === undefined) {
            importList.push(importFile);
          }
        }
      }
    });
  }
  return fileData;
};

// const fp = path.resolve(
//   '/Users/mgarza/Documents/LearnProgramming/CodeSmith/OSP/DevDux/Demo/client/App.jsx'
// );
// const fp = path.resolve('../../Demo/client/App.jsx');
// getImports(fp);
// console.log(fileData);
const buildClasses = (fD) => {
  for (const [file, node] of Object.entries(fD)) {
    //console.log('file within buildClasses:', file);
    node.getSelectedState(node.astBody);
    node.getDispatched(node.astBody);
    node.getRenderComponents();
    node.getProps();
    //console.log('node.dispatched within buildClasses:', node.dispatched);
    // console.log(node.astTokens[0]);
  }
  return fD;
};

function printClasses(fD) {
  for (const [file, node] of Object.entries(fD)) {
    console.log(file);
    console.log('filepath: ', node.filePath);
    console.log('Imports: ', node.imports);
    console.log('Selected: ', node.selected);
    console.log('Dispatched: ', node.dispatched);
    console.log('Rendered: ', node.renderedComponents);
    console.log('Props: ', node.props);
    console.log('\n');
  }
}

// printClasses(fileData);
function buildClassesForExport(fD) {
  const fileDataToExt = {};
  for (const [file, node] of Object.entries(fD)) {
    fileDataToExt[[file]] = {};
    fileDataToExt[[file]].filePath = node.filePath;
    fileDataToExt[[file]].imports = node.imports;
    fileDataToExt[[file]].selected = node.selected;
    fileDataToExt[[file]].dispatched = node.dispatched;
    fileDataToExt[[file]].renderedComponents = node.renderedComponents;
    fileDataToExt[[file]].props = node.props;
  }
  return fileDataToExt;
}
// buildClassesForExport(fileData);
export function getData(filePath) {
  let data = getImports(filePath);
  data = buildClasses(data);
  console.log(data['Market.jsx'].astTokens[1]);
  let dataForExp = buildClassesForExport(data);
  return dataForExp;
}
const fp = path.resolve(
  '/Users/karachisholm/Documents/Codesmith Cohort 35/DevDux/Demo/client/App.jsx'
);
// console.log(getData(fp));
fs.writeFile(
  '../../devdux/data/data.json',
  JSON.stringify(getData(fp)),
  (err) => {
    if (err) throw err;
    console.log('Wrote data to JSON');
  }
);
