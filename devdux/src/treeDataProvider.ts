import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
//import parser from parse.json
import * as fileDataToExt from '../../main/src/parse';
/**
 * STACK OVERFLOW CAR EXAMPLE https://stackoverflow.com/questions/56534723/simple-example-to-implement-vs-code-treedataprovider-with-json-data
 */


// export function activate(context: vscode.ExtensionContext) {
//   vscode.window.registerTreeDataProvider('devdux-sidebar', new TreeDataProvider());
// }

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;

  data: TreeItem[];

  constructor() {
    // this.data = [new TreeItem('cars', [
    //   new TreeItem(
    //       'Ford', [new TreeItem('Fiesta'), new TreeItem('Focus'), new TreeItem('Mustang')]),
    //   new TreeItem(
    //       'BMW', [new TreeItem('320'), new TreeItem('X3'), new TreeItem('X5')])
    // ])];
    console.log('fileDataToExt: ', fileDataToExt.fileDataToExt);
    // const fileDataToExt = JSON.parse(fs.readFileSync(path.resolve(path.join(process.cwd() , 'devdux/data/data.json')), 'utf-8'));
    this.data = [];
    for (const [file, node] of Object.entries(fileDataToExt.fileDataToExt)) {
      console.log('in for/of in constructor');
      console.log(node.imports[0]);
      this.data.push(new TreeItem(file), new TreeItem(JSON.stringify(node.imports[0])));
      
    }
  }

  getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
  }
}


/**
 * VSCODE TREE VIEW API Example https://code.visualstudio.com/api/extension-guides/tree-view
 */
// export class DevDuxSidebarProvider implements vscode.TreeDataProvider<Dependency> {
//     constructor(private workspaceRoot: string) {}
  
//     //getTreeItem returns the UI representation of the element that gets displayed in the tree view. 
//     //vscode.TreeItem is something built into the VSCode extensions API (pretty sure)
//     getTreeItem(element: Dependency): vscode.TreeItem {
//       return element;
//     }
  
//     //getChildren returns the children of the given element, or root if no element is passed in.

//     //workSpaceRoot is passed into the DevDuxSidebarProvider constructor. This might be what Sapling requires users to input before they use the Sapling extension.
//     getChildren(element?: Dependency): Thenable<Dependency[]> {
//       //this if statement checks if there's a workSpaceRoot and shows an error message if not. 
//       //showInformationMessage is a built-in method that VSCode provides (pretty sure)
//       if (!this.workspaceRoot) {
//         vscode.window.showInformationMessage('No dependency in empty workspace');
//         return Promise.resolve([]);
//       }
//   //this if statement seems to be irrelevant to us. It seems like we're doing this part in parse.js. 
//       if (element) {
//         return Promise.resolve(
//           this.getDepsInPackageJson(
//             path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
//           )
//         );
//       } else {
//         const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
//         if (this.pathExists(packageJsonPath)) {
//           return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
//         } else {
//           vscode.window.showInformationMessage('Workspace has no package.json');
//           return Promise.resolve([]);
//         }
//       }
//     }
//   /**
//    * Given the path to package.json, read all its dependencies and devDependencies.
//    */
//    private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
//     if (this.pathExists(packageJsonPath)) {
//       const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

//       const toDep = (moduleName: string, version: string): Dependency => {
//         if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
//           return new Dependency(
//             moduleName,
//             version,
//             vscode.TreeItemCollapsibleState.Collapsed
//           );
//         } else {
//           return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
//         }
//       };

//       const deps = packageJson.dependencies
//         ? Object.keys(packageJson.dependencies).map(dep =>
//             toDep(dep, packageJson.dependencies[dep])
//           )
//         : [];
//       const devDeps = packageJson.devDependencies
//         ? Object.keys(packageJson.devDependencies).map(dep =>
//             toDep(dep, packageJson.devDependencies[dep])
//           )
//         : [];
//       return deps.concat(devDeps);
//     } else {
//       return [];
//     }
//   }

//   private pathExists(p: string): boolean {
//     try {
//       fs.accessSync(p);
//     } catch (err) {
//       return false;
//     }
//     return true;
//   }
// }

// class Dependency extends vscode.TreeItem {
//   constructor(
//     public readonly label: string,
//     private version: string,
//     public readonly collapsibleState: vscode.TreeItemCollapsibleState
//   ) {
//     super(label, collapsibleState);
//     this.tooltip = `${this.label}-${this.version}`;
//     this.description = this.version;
//   }

//   iconPath = {
//     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
//     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
//   };
// }
