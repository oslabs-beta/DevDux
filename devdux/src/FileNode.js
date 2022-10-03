"use strict";
exports.__esModule = true;
var FileNode = /** @class */ (function () {
    function FileNode(filePath, astBody, astTokens) {
        this.filePath = filePath;
        this.astBody = astBody;
        this.astTokens = astTokens;
        this.imports = [];
    }
    /**
     * TODO: Build out getType to classify what type of file was imported
     */
    // getType(ast: string): void {
    //   this.type = 'slice file';
    // }
    FileNode.prototype.getRenderComponents = function () {
        var _a;
        var arr = this.imports.map(function (obj) {
            if (Object.values(obj)[0].includes('.jsx')) {
                return Object.keys(obj)[0];
            }
        });
        var keyArray = arr.filter(function (e) { return e; });
        if (this.astTokens) {
            var result = (_a = this.astTokens) === null || _a === void 0 ? void 0 : _a.slice().filter(function (token) {
                if (token.type.label === 'jsxName') {
                    if (keyArray.includes(token.value)) {
                        return true;
                    }
                }
                return false;
            });
            this.renderedComponents = result.map(function (token) { return token.value; });
        }
    };
    // getProps function
    FileNode.prototype.getProps = function () {
        var _this = this;
        var _a, _b;
        var arr = this.imports.map(function (obj) {
            if (!Object.values(obj)[0].includes('.jsx')) {
                return Object.keys(obj)[0];
            }
        });
        var keyArray = arr.filter(function (e) { return e; });
        if (this.selected) { //added this check for whether this.selected is not undefined because there was a type error being thrown in the below for loop indicating that we had to account for the possibility that there is no "selected."
            for (var i = 0; i < this.selected.length; i++) {
                keyArray.push(Object.keys(this.selected[i])[0]);
            }
        }
        (_a = this.astTokens) === null || _a === void 0 ? void 0 : _a.forEach(function (token, i, arr) {
            if (token.type.label === 'const') {
                keyArray.push(arr[i + 1].value);
            }
        });
        var propObj = {};
        (_b = this.astTokens) === null || _b === void 0 ? void 0 : _b.forEach(function (token, i, arr) {
            if (token.type.label === 'jsxName') {
                if (_this.renderedComponents[0]) {
                    if (token.value === 'key') {
                        propObj['key'] = 'unique identifier';
                    }
                    if (arr[i + 3].value === 'props') {
                        if (propObj.token !== undefined) {
                            propObj.token.value = "props." + arr[i + 5].value;
                        }
                    }
                    else if (keyArray.includes(arr[i + 3].value) && arr[i + 3].value !== undefined) {
                        //console.log(token.value + " = " + arr[i + 3].value)
                        if (propObj.token !== undefined) {
                            propObj.token.value = arr[i + 3].value;
                        }
                    }
                }
            }
            _this.props = propObj;
        });
    };
    FileNode.prototype.getSelectedState = function (astBody) {
        var _this = this;
        this.selected = [];
        astBody.forEach(function (node) {
            if (node.type === 'VariableDeclaration') {
                var declarations = node.declarations;
                declarations.forEach(function (declaration) {
                    var _a;
                    if (((_a = declaration === null || declaration === void 0 ? void 0 : declaration.init) === null || _a === void 0 ? void 0 : _a.type) === 'ArrowFunctionExpression') {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        // console.log('---Declaration.init.body---', declaration.init.body);
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        var ArrowFuncBlock = void 0;
                        if (declaration.init.body.type === 'BlockStatement') {
                            ArrowFuncBlock = declaration.init.body.body;
                        }
                        if (ArrowFuncBlock) {
                            ArrowFuncBlock.forEach(function (blockElement) {
                                if (blockElement.type === 'VariableDeclaration') {
                                    var declarationsArray = blockElement.declarations;
                                    declarationsArray === null || declarationsArray === void 0 ? void 0 : declarationsArray.forEach(function (element) {
                                        // console.log('---element.init---', element?.init);
                                        var _a;
                                        if (((_a = element.init) === null || _a === void 0 ? void 0 : _a.type) === "CallExpression") {
                                            if (element.init.callee.type === 'Identifier') {
                                                if (element.init.callee.name === 'useSelector') {
                                                    var variableLabel_1;
                                                    var reducerName_1;
                                                    var stateName_1;
                                                    if (element.id.type === 'Identifier') {
                                                        variableLabel_1 = element.id.name;
                                                    }
                                                    var useSelectorArguments = element.init.arguments;
                                                    useSelectorArguments.forEach(function (argument) {
                                                        var _a;
                                                        if (argument.type === 'ArrowFunctionExpression') {
                                                            if (argument.body.type === 'MemberExpression') {
                                                                if (argument.body.object.type === 'MemberExpression') {
                                                                    if (argument.body.object.property.type === 'Identifier') {
                                                                        reducerName_1 = argument.body.object.property.name;
                                                                    }
                                                                }
                                                                if (argument.body.property.type === 'Identifier') {
                                                                    stateName_1 = argument.body.property.name;
                                                                }
                                                            }
                                                        }
                                                        _this.selected.push((_a = {}, _a[variableLabel_1] = "".concat(reducerName_1, ".").concat(stateName_1), _a));
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    };
    FileNode.prototype.getDispatched = function (astBody) {
        var _this = this;
        this.dispatched = [];
        astBody.forEach(function (node) {
            if (node.type === 'VariableDeclaration') {
                var declarations = node.declarations;
                //declarations is the entire MarketContainer function, including "const MarketsContainer"
                // console.log('---declarations---', declarations);
                declarations.forEach(function (declaration) {
                    var _a;
                    if (declaration.type === 'VariableDeclarator') {
                        if (((_a = declaration === null || declaration === void 0 ? void 0 : declaration.init) === null || _a === void 0 ? void 0 : _a.type) === 'ArrowFunctionExpression') {
                            //ArrowFunctionExpression is the body of MarketsContainer (everything after the equals sign after MarketsContainer)
                            // console.log('---declaration.init.body---', declaration.init.body);
                            if (declaration.init.body.type === 'BlockStatement') {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                var ArrowFuncBlock = declaration.init.body.body;
                                //ArrowFuncBlock is the array of blocks (?) within MarketsContainer
                                if (ArrowFuncBlock) {
                                    var useDispatchLabel_1;
                                    ArrowFuncBlock.forEach(function (blockElement) {
                                        if (blockElement.type === 'VariableDeclaration') {
                                            console.log('---variableDeclarations---', blockElement.declarations);
                                            //declarationsArray is all code/data about one variable declaration within MarketsContainer
                                            var declarationsArray = blockElement.declarations;
                                            declarationsArray.forEach(function (element) {
                                                console.log('---element---', element);
                                                if (useDispatchLabel_1 === undefined) {
                                                    if (element.init) {
                                                        if (element.init.type === 'CallExpression') {
                                                            if (element.init.callee) {
                                                                // console.log('----element.init.callee----', element.init.callee)
                                                                if (element.init.callee.type === 'Identifier') {
                                                                    if (element.init.callee.name === 'useDispatch') {
                                                                        //useDispatchLabel is what useDispatch gets saved to, so for us it's "dispatch"
                                                                        if (element.id) {
                                                                            if (element.id.name) {
                                                                                useDispatchLabel_1 = element.id.name;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (element.init) {
                                                            if (element.init.type === 'ArrowFunctionExpression')
                                                                ;
                                                        }
                                                        {
                                                            //innerArrowFuncBlock is everything after the arrow within an ArrowFunctionExpression variable declaration within MarketsContainer - for example, within handleDeleteCard, it's everything after the arrow.
                                                            // console.log('---element.init.body---', element.init.body);
                                                            if (element.init.body) {
                                                                if (element.init.body.body) {
                                                                    var innerArrowFuncBlock = element.init.body.body;
                                                                    innerArrowFuncBlock.forEach(function (element) {
                                                                        if (useDispatchLabel_1 !== undefined &&
                                                                            element.type === 'ExpressionStatement' &&
                                                                            element.expression.callee.name === useDispatchLabel_1) {
                                                                            //  console.log(
                                                                            //   'args name',
                                                                            //   //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                                                                            //   element.expression.arguments[0].callee.name
                                                                            // );
                                                                            _this.dispatched.push(element.expression.arguments[0].callee.name);
                                                                        }
                                                                        ;
                                                                    });
                                                                }
                                                            }
                                                            ;
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        if (useDispatchLabel_1 !== undefined &&
                                            blockElement.type === 'ExpressionStatement' &&
                                            blockElement.expression.callee.name === useDispatchLabel_1) {
                                            // console.log(
                                            // 'args name',
                                            //we can just grab arguments[0] because we know that there will only ever be one argument to useDispatch
                                            // blockElement.expression.arguments[0].callee.name
                                            // );
                                            _this.dispatched.push(blockElement.expression.arguments[0].callee.name);
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
        });
    };
    return FileNode;
}());
exports["default"] = FileNode;
