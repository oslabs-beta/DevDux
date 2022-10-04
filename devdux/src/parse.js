"use strict";
exports.__esModule = true;
exports.getData = void 0;
var babelParser = require("@babel/parser");
var fs = require("fs");
var path = require("path");
var FileNode_1 = require("./FileNode");
var getImports = function (filePath) {
    var fileData = {};
    var importList = [];
    importList.push(filePath);
    var _loop_1 = function () {
        //ask michael why this could be undefined
        var currentFile = importList.shift();
        if (currentFile !== undefined) {
            var readFile = fs.readFileSync(currentFile, 'utf-8');
            var ast = babelParser.parse(readFile, {
                tokens: true,
                sourceType: 'module',
                plugins: ['jsx', 'typescript']
            });
            // console.log('---the AST from ParseResult---', ast);
            var astBody = ast.program.body;
            var astTokens = void 0;
            if (ast.tokens !== null && ast.tokens !== undefined) {
                astTokens = ast.tokens;
            }
            // ast.program.body.forEach((node) => {
            //   if (node.type === 'VariableDeclaration') {
            //     node.declarations.forEach((declaration) => {
            //       if (declaration.init) {
            //         if (declaration.init.type === 'ArrowFunctionExpression') {
            //           if (declaration.init.body) {
            //             if (declaration.init.body.type === 'BlockStatement') {
            //               declaration.init.body.body;
            //             }
            //           }
            //         }
            //       }
            //     })
            //   }
            // })
            var baseName_1 = path.parse(currentFile).base;
            fileData[baseName_1] = new FileNode_1["default"](currentFile, astBody, astTokens);
            ast.program.body.forEach(function (node) {
                if (node.type === 'ImportDeclaration') {
                    if (node.source.value[0] === '.') {
                        var importFile_1 = path.resolve(path.parse(currentFile).dir, node.source.value);
                        node.specifiers.forEach(function (specifier) {
                            var _a;
                            //console.log(specifier);
                            if (specifier.local.name !== undefined) {
                                fileData[baseName_1].imports.push((_a = {},
                                    _a[specifier.local.name] = importFile_1,
                                    _a));
                            }
                        });
                        var importListBaseName = path.parse(importFile_1).base;
                        if (fileData[importListBaseName] === undefined) {
                            importList.push(importFile_1);
                        }
                    }
                }
            });
        }
    };
    while (importList.length > 0) {
        _loop_1();
    }
    return fileData;
};
//
var buildClasses = function (fD) {
    for (var _i = 0, _a = Object.entries(fD); _i < _a.length; _i++) {
        var _b = _a[_i], file = _b[0], node_1 = _b[1];
        //console.log('file within buildClasses:', file);
        node_1.getSelectedState(node_1.astBody);
        node_1.getDispatched(node_1.astBody);
        node_1.getRenderComponents();
        node_1.getProps();
        //console.log('node.dispatched within buildClasses:', node.dispatched);
        // console.log(node.astTokens[0]);
    }
    return fD;
};
function printClasses(fD) {
    for (var _i = 0, _a = Object.entries(fD); _i < _a.length; _i++) {
        var _b = _a[_i], file = _b[0], node_2 = _b[1];
        console.log(file);
        console.log('filepath: ', node_2.filePath);
        console.log('Imports: ', node_2.imports);
        console.log('Selected: ', node_2.selected);
        console.log('Dispatched: ', node_2.dispatched);
        console.log('Rendered: ', node_2.renderedComponents);
        console.log('Props: ', node_2.props);
        console.log('\n');
    }
}
// printClasses(fileData);
function buildClassesForExport(fD) {
    var fileDataToExt = {};
    for (var _i = 0, _a = Object.entries(fD); _i < _a.length; _i++) {
        var _b = _a[_i], file = _b[0], node_3 = _b[1];
        fileDataToExt[file] = {};
        fileDataToExt[file].filePath = node_3.filePath;
        fileDataToExt[file].imports = node_3.imports;
        fileDataToExt[file].selected = node_3.selected;
        fileDataToExt[file].dispatched = node_3.dispatched;
        fileDataToExt[file].renderedComponents = node_3.renderedComponents;
        fileDataToExt[file].props = node_3.props;
    }
    return fileDataToExt;
}
// buildClassesForExport(fileData);
function getData(filePath) {
    var data = getImports(filePath);
    data = buildClasses(data);
    // console.log(data['Market.jsx'].astTokens[1]);
    var dataForExp = buildClassesForExport(data);
    return dataForExp;
}
exports.getData = getData;
var fp = path.resolve('/Users/karachisholm/Documents/Codesmith Cohort 35/DevDux/Demo/client/App.jsx');
// console.log(getData(fp));
fs.writeFile('../../devdux/data/data.json', JSON.stringify(getData(fp)), function (err) {
    if (err) {
        throw err;
    }
    console.log('Wrote data to JSON');
});
// console.log(getImports('/Users/mgarza/Documents/LearnProgramming/CodeSmith/OSP/DevDux/Demo/client/App.jsx'));
