import * as vscode from 'vscode';
import * as parser from './parse';


export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
  data: TreeItem[];
  filePath: string;
  constructor(filePath: string) {
    this.data = [];
    this.filePath = filePath;
  }

 
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  //getTreeItem gets fed the display of treeitems from getChildren
  getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }
  //getChildren calls helper to go through the fileData object and extract the data as tree items
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
    //builds out treeView array of tree items to display the desired data
    for (const [key, value] of Object.entries(obj)) {
      treeView.push(new TreeItem(value.fileName, [
        new TreeItem('filePath', this.getFilePath(value.filePath)),
        new TreeItem('imports', this.getImports(value.imports)),
        new TreeItem('selected', this.getSelected(value.selected)),
        new TreeItem('dispatched', this.getDispatched(value.dispatched)),
        new TreeItem('renderedComponents', this.getRendered(value.renderedComponents)),]));
          
      
    }
    return treeView;

  }
  getFilePath(fPath: string): TreeItem[] | undefined { 
    return [new TreeItem(fPath)];
  };

  getImports(importList: {}[]): TreeItem[] | undefined {
    //iterate through the import list objects and store as 
    //name
    //->filePath
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
    //iterate through selected list and store as 
    //selected Label
    //->selected value (reducerName.stateVariable)
    selectedList.forEach((selected: {[key: string]: string}) => {
      const selectedKey = Object.keys(selected)[0];
      treeSelectedListItems.push(new TreeItem(selectedKey, [new TreeItem(selected[selectedKey])]));

    });
    return treeSelectedListItems;
  }
  getDispatched(dispatchedList: string[]): TreeItem[] | undefined {
    //dispatches are just strings so we can just iterate and push each string
    const treeDispatchedList: TreeItem[] = [];
    dispatchedList.forEach((disp) => {
      treeDispatchedList.push(new TreeItem(disp));
    });
    return treeDispatchedList;
  }
  getRendered(renderedComponentsList: { [key: string]: {[key: string]: string}[]}[]): TreeItem[] | undefined {
    const treeRenderedListItems: TreeItem[] = [];
    renderedComponentsList.forEach((compObject) => {
      //the parsing algorithm sometimes produces compObjects of [{}] or [] this prevents those from being displayed
      if (!(compObject === undefined || JSON.stringify(compObject) === JSON.stringify({}))) {
        for (const [component, val] of Object.entries(compObject)) {
          if (val.length === 0) {
            //if the component doesn't have any props only push the component name
            treeRenderedListItems.push(new TreeItem(component));
          } else {
            //val.length > 0 means that props are being passed
            const props: TreeItem[] = [];
            val.forEach((propObj) => {
              props.push(new TreeItem(`Prop Label: ${propObj.propLabel}`, [new TreeItem(`Prop Value: ${propObj.propValue}`)]));
            });
            treeRenderedListItems.push(new TreeItem(component, props));
          }
        }
      }
    });
    return treeRenderedListItems;
  }



}
class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(label: string, children?: TreeItem[]) {
    //super looks to set collapsed or not based on if children exist
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Collapsed);
    this.children = children;
  }
}


