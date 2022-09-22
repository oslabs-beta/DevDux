import * as babelParser from '@babel/parser';
import * as fs from 'fs';
import path from 'path';

class FileNode {
  constructor(filePath, astBody, astTokens) {
    this.filePath = filePath;
    this.astBody = astBody;
    this.astTokens = astTokens;
    // this.type = getType(this.ast); // component, slice file
    // this.componentsRendered = getComponentsRendered(this.ast);
    // this.fileImports = getFileImports(this.ast);
    // this.selectedState = getSelectedState(this.ast);
    // this.dispatchedReducers = getDispatched(this.ast);
  }
  getType(ast) {
    
    this.type = 'slice file';

  }

  getRenders() {

  }
  getSelectedState(ast) {
    
  };
  getDispatched(ast) {

  };
}

export default FileNode;
