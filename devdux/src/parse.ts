import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import * as path from 'path';
import { node } from 'webpack';
import FileNode from './FileNode';
import { FileNodeType, FileDataType, AST } from './types/types';

const getImports = (filePath: string): FileDataType => {
  const fileData: FileDataType = {};
  const importList: string[] = [];
  importList.push(filePath);

  while (importList.length > 0) {
    //ask michael why this could be undefined
    const currentFile: string | undefined = importList.shift();

    if (currentFile !== undefined) {
      const readFile = fs.readFileSync(currentFile, 'utf-8');

      const ast: AST = babelParser.parse(readFile, {
        tokens: true,
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });



      const astBody = ast.program.body;
      let astTokens;
      if (ast.tokens !== null && ast.tokens !== undefined) {
        astTokens = ast.tokens;
      }


      const baseName = path.parse(currentFile).base;
      fileData[currentFile] = new FileNode(currentFile, astBody, astTokens);

      fileData[currentFile].fileName = currentFile.split('/').slice(currentFile.split('/').length - 2).join('/');
      ast.program.body.forEach((node) => {
        if (node.type === 'ImportDeclaration') {
          if (node.source.value[0] === '.') {
            let importFile: string = path.resolve(
              path.parse(currentFile).dir,
              node.source.value
            );
            let fileName: string | undefined = path.parse(importFile).base;
            if (!path.extname(importFile)) {
              const fileArray = fs.readdirSync(path.dirname(importFile));
              const regEx = new RegExp(`${fileName}.(j|t)sx?$`);
              fileName = fileArray.find((fileStr) => fileStr.match(regEx));
              if (fileName !== undefined) {
                importFile = path.resolve(path.dirname(importFile), fileName);
              }
            }
            if (
              path.extname(importFile) === '.ts' ||
              path.extname(importFile) === '.tsx' ||
              path.extname(importFile) === '.js' ||
              path.extname(importFile) === '.jsx'
            ) {
              node.specifiers.forEach((specifier) => {
                //console.log(specifier);
                if (specifier.local.name !== undefined) {
                  fileData[currentFile].imports.push({
                    [specifier.local.name]: importFile,
                  });
                }
              });
            

            const importListBaseName = path.parse(importFile).base;
            if (fileData[importFile] === undefined) {
              importList.push(importFile);
            }}
          }
        }
      });
    }
  }
  return fileData;
};

//
const buildClasses = (fD: FileDataType): FileDataType => {
  for (const [file, node] of Object.entries(fD)) {
    node.getSelectedState(node.astBody);
    node.getDispatched(node.astBody);
    node.getRenderComponents();
  }
  return fD;
};

function printClasses(fD: FileDataType) {
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
function buildClassesForExport(fD: FileDataType) {
  const fileDataToExt: FileNodeType = {};
  for (const [file, node] of Object.entries(fD)) {
    fileDataToExt[file] = {};
    fileDataToExt[file].fileName = node.fileName;
    fileDataToExt[file].filePath = node.filePath;
    fileDataToExt[file].imports = node.imports;
    fileDataToExt[file].selected = node.selected;
    fileDataToExt[file].dispatched = node.dispatched;
    fileDataToExt[file].renderedComponents = node.renderedComponents;
    // fileDataToExt[file].props = node.props;
  }
  return fileDataToExt;
}
// buildClassesForExport(fileData);
export function getData(filePath: string): FileNodeType {
  let data = getImports(filePath);
  data = buildClasses(data);
  // console.log(data['Market.jsx'].astTokens[1]);
  let dataForExp = buildClassesForExport(data);
  return dataForExp;
}
const fp = path.resolve(

  '/Users/karachisholm/Documents/Codesmith Cohort 35/DevDux/Demo/client/App.jsx'



);
// getData(fp);
fs.writeFile(
  '../../devdux/data/data.json',
  JSON.stringify(getData(fp)),
  (err) => {
    if (err) {
      throw err;
    }
    console.log('Wrote data to JSON');
  }
);

// console.log(getImports('/Users/mgarza/Documents/LearnProgramming/CodeSmith/OSP/DevDux/Demo/client/App.jsx'));
