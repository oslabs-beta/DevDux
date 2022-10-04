import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
//import parser from parse.json
import * as parser from './parse';
import { ChildProcess } from 'child_process';


export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;

  data: TreeItem[];
  filePath: string;
  // fileDataT: {};
  constructor(filePath: string) {

    console.log('current directory', process.cwd());

    this.data = [];
    this.filePath = filePath;
  
  }

  getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {

      return this.getChildrenItems(parser.getData(this.filePath));
    }
    return element.children;
  }
  getChildrenItems(obj: Object): vscode.ProviderResult<TreeItem[]> | undefined {
    const treeView: TreeItem[] | undefined = [];
    if (obj === undefined) {
      return;
    }
    for (const [key, value] of Object.entries(obj)) {
      // const childrenLabels: TreeItem[] = this.getChildrenLabels(value);
      console.log(value);
      // treeView.push(new TreeItem(key));
      treeView.push(new TreeItem(key, [
        new TreeItem('filePath', this.getFilePath(value.filePath)),
        new TreeItem('imports', this.getImports(value.imports)),
        new TreeItem('selected', this.getSelected(value.selected)),
        new TreeItem('dispatched', this.getDispatched(value.dispatched)),
        new TreeItem('renderedComponents', this.getRendered(value.renderedComponents)),
        new TreeItem('props', this.getProps(value.props))]));
          
      
    }
    return treeView;

  }
  getFilePath(fPath: string): TreeItem[] | undefined { 
    return [new TreeItem(fPath)];
  };
  getImports(importList: {}[]): TreeItem[] | undefined {

    const treeImportListItems: TreeItem[] = [];
    importList.forEach((item: {[key: string]: string}) => {
      if (Object.keys(item).length > 0) {
        const itemKey: string = Object.keys(item)[0];
        treeImportListItems.push(new TreeItem(itemKey, [new TreeItem(item[itemKey])]));
      }
      });
    return treeImportListItems;
  }
  getSelected(selectedList: {}[]): TreeItem[] | undefined {
    const treeSelectedListItems: TreeItem[] = [];
    selectedList.forEach((selected: {[key: string]: string}) => {
      const selectedKey = Object.keys(selected)[0];
      treeSelectedListItems.push(new TreeItem(selectedKey, [new TreeItem(selected[selectedKey])]));

    });
    return treeSelectedListItems;
  }
  getDispatched(dispatchedList: string[]): TreeItem[] | undefined {
    const treeDispatchedList: TreeItem[] = [];
    dispatchedList.forEach((disp) => {
      treeDispatchedList.push(new TreeItem(disp));
    });
    return treeDispatchedList;
  }
  getRendered(renderedComponentsList: string[]): TreeItem[] | undefined {
    const treeRenderedListItems: TreeItem[] = [];
    renderedComponentsList.forEach((rendered) => {
      treeRenderedListItems.push(new TreeItem(rendered));
    });
    return treeRenderedListItems;
  }
  getProps(propsList: {}): TreeItem[] | undefined {
    const treePropsListItems: TreeItem[] = [];
    console.log('props: ', Object.keys(propsList));
    // const propsKeys = Object.keys(propsList);
    // propsKeys.forEach((key) => {
    //   treePropsListItems.push(new TreeItem(`Props Label: ${key}`, [new TreeItem(`Props Value: ${propsList[key]}`)]));
    // });
    for (const [key, value] of Object.entries(propsList)) {
      treePropsListItems.push(new TreeItem(`Props Label: ${key}`, [new TreeItem(`Props Value: ${value}`)]));
    };
    return treePropsListItems;
  }

}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Collapsed);
    this.children = children;
  }
}


