import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
//import parser from parse.json

export class DevDuxSidebarProvider implements vscode.TreeDataProvider<Dependency> {
    constructor(private workspaceRoot: string) {}
  
    //getTreeItem returns the UI representation of the element that gets displayed in the tree view. 
    //vscode.TreeItem is something built into the VSCode extensions API (pretty sure)
    getTreeItem(element: Dependency): vscode.TreeItem {
      return element;
    }
  
    //getChildren returns the children of the given element, or root if no element is passed in.

    //workSpaceRoot is passed into the DevDuxSidebarProvider constructor. This might be what Sapling requires users to input before they use the Sapling extension.
    getChildren(element?: Dependency): Thenable<Dependency[]> {
      //this if statement checks if there's a workSpaceRoot and shows an error message if not. 
      //showInformationMessage is a built-in method that VSCode provides (pretty sure)
      if (!this.workspaceRoot) {
        vscode.window.showInformationMessage('No dependency in empty workspace');
        return Promise.resolve([]);
      }
  //this if statement seems to be irrelevant to us. It seems like we're doing this part in parse.js. 
      if (element) {
        return Promise.resolve(
          this.getDepsInPackageJson(
            path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
          )
        );
      } else {
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        if (this.pathExists(packageJsonPath)) {
          return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
        } else {
          vscode.window.showInformationMessage('Workspace has no package.json');
          return Promise.resolve([]);
        }
      }
    }
  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
   private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const toDep = (moduleName: string, version: string): Dependency => {
        if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Dependency(
            moduleName,
            version,
            vscode.TreeItemCollapsibleState.Collapsed
          );
        } else {
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
        }
      };

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map(dep =>
            toDep(dep, packageJson.dependencies[dep])
          )
        : [];
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep =>
            toDep(dep, packageJson.devDependencies[dep])
          )
        : [];
      return deps.concat(devDeps);
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  };
}