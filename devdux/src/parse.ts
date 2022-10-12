import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import * as path from 'path';
import FileNode from './FileNode';
import { FileNodeType, FileDataType, AST } from './types/types';

const getImports = (filePath: string): FileDataType => {
  const fileData: FileDataType = {};
  //importList will act like a queue to use for visiting all files in an app
  const importList: string[] = [];
  importList.push(filePath);
  //continue looping until import list is empty meaning we hit all the files
  while (importList.length > 0) {
    //setting current file as next in the queue
    const currentFile: string | undefined = importList.shift();

    if (currentFile !== undefined) {
      //stores the file and then converts to an ast 
      const readFile = fs.readFileSync(currentFile, 'utf-8');

      const ast: AST = babelParser.parse(readFile, {
        tokens: true,
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });
      //stores the astBody and astTokens
      const astBody = ast.program.body;
      let astTokens;
      if (ast.tokens !== null && ast.tokens !== undefined) {
        astTokens = ast.tokens;
      }
      //adds a new instance of the FileNode class to the fileData object and set the key to the complete file path
      fileData[currentFile] = new FileNode(currentFile, astBody, astTokens);
      //stores the fileName property as the folder the file lives in and the file name
      fileData[currentFile].fileName = currentFile.split('/').slice(currentFile.split('/').length - 2).join('/');
      //loops through ast body to look for import statements
      ast.program.body.forEach((node) => {
        if (node.type === 'ImportDeclaration') {
          //assumes that if the imported file starts with '.' it is a file in the app and not a module
          if (node.source.value[0] === '.') {
            //stores the import file as the complete file path
            let importFile: string = path.resolve(
              path.parse(currentFile).dir,
              node.source.value
            );
            //file name of this import
            let fileName: string | undefined = path.parse(importFile).base;
            //checks if the import included the file extension and if not it finds the extension type
            if (!path.extname(importFile)) {
              //creates an array of all files in the directory that the import lives
              const fileArray = fs.readdirSync(path.dirname(importFile));
              //regex for finding js, jsx, ts, tsx
              const regEx = new RegExp(`${fileName}.(j|t)sx?$`);
              fileName = fileArray.find((fileStr) => fileStr.match(regEx));
              //fileName exists then change importFile to include the extension
              if (fileName !== undefined) {
                importFile = path.resolve(path.dirname(importFile), fileName);
              }
            }
            //only want to visit a file if it is a js,jsx,ts,tsx
            if (
              path.extname(importFile) === '.ts' ||
              path.extname(importFile) === '.tsx' ||
              path.extname(importFile) === '.js' ||
              path.extname(importFile) === '.jsx'
            ) {
              node.specifiers.forEach((specifier) => {
                //storing in the imports property of file node class to be the filename as key and file path as value
                if (specifier.local.name !== undefined) {
                  fileData[currentFile].imports.push({
                    [specifier.local.name]: importFile,
                  });
                }
              });
            //check that this file isn't in the fileData object already
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

//helper function to iterate through all the files in fileData and build out the required data
const buildClasses = (fD: FileDataType): FileDataType => {
  for (const [file, node] of Object.entries(fD)) {
    node.getSelectedState(node.astBody);
    node.getDispatched(node.astBody);
    node.getRenderComponents();
  }
  return fD;
};
//printClasses was used in development if needing to observe the files extracted data, not used in production
// function printClasses(fD: FileDataType) {
//   for (const [file, node] of Object.entries(fD)) {
//     console.log(file);
//     console.log('filepath: ', node.filePath);
//     console.log('Imports: ', node.imports);
//     console.log('Selected: ', node.selected);
//     console.log('Dispatched: ', node.dispatched);
//     console.log('Rendered: ', node.renderedComponents);
//     console.log('Props: ', node.props);
//     console.log('\n');
//   }
// }
//The ast data is not needed for building out the treeView this function extracts all properties except the ast data
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
  }
  return fileDataToExt;
}
//exported function that invokes all the other helpers to build the classes and strip out desired data
export function getData(filePath: string): FileNodeType {
  let data = getImports(filePath);
  data = buildClasses(data);
  let dataForExp = buildClassesForExport(data);
  return dataForExp;
}


//Future versions will build a D3 graph from a JSON file this commented out code was used for writing to JSON file, will be used in future
// const fp = path.resolve(
// filePathOfRoot
// );
// // getData(fp);
// fs.writeFile(
//   '../../devdux/data/data.json',
//   JSON.stringify(getData(fp)),
//   (err) => {
//     if (err) {
//       throw err;
//     }
//     console.log('Wrote data to JSON');
//   }
// );

