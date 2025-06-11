import { Transform } from "assemblyscript/transform";
import assert from "node:assert";
class SourceFunctionTransform extends Transform {
    constructor() {
        super(...arguments);
        this.testNames = [];
        this.currentTestDescriptions = [];
    }
    afterInitialize(program) {
        // There will be two sources with SourceKind.UserEntry, ~lib/rt/index-incremental.ts should be filtered
        const entrySource = program.sources.find((source) => source.sourceKind === 1 /* SourceKind.UserEntry */ && !source.normalizedPath.startsWith("~lib/"));
        this.testFileName = entrySource.normalizedPath;
        this.visitNode(entrySource);
        globalThis.testNames = this.testNames;
    }
    visitNode(node) {
        // eslint-disable-next-line sonarjs/max-switch-cases
        switch (node.kind) {
            case 0 /* NodeKind.Source */: {
                this.visitSource(node);
                break;
            }
            // types
            case 1 /* NodeKind.NamedType */:
            case 2 /* NodeKind.FunctionType */:
            case 3 /* NodeKind.TypeName */:
            case 4 /* NodeKind.TypeParameter */: {
                break;
            }
            case 5 /* NodeKind.Parameter */: {
                this.visitParameterNode(node);
                break;
            }
            // Expressions
            case 6 /* NodeKind.Identifier */:
            case 13 /* NodeKind.False */:
            case 16 /* NodeKind.Literal */:
            case 18 /* NodeKind.Null */:
            case 19 /* NodeKind.Omitted */:
            case 23 /* NodeKind.Super */:
            case 24 /* NodeKind.This */:
            case 25 /* NodeKind.True */:
            case 26 /* NodeKind.Constructor */:
            case 29 /* NodeKind.Compiled */: {
                break;
            }
            case 7 /* NodeKind.Assertion */: {
                this.visitAssertionExpression(node);
                break;
            }
            case 8 /* NodeKind.Binary */: {
                this.visitBinaryExpression(node);
                break;
            }
            case 9 /* NodeKind.Call */: {
                this.visitCallExpression(node);
                break;
            }
            case 10 /* NodeKind.Class */: {
                this.visitClassExpression(node);
                break;
            }
            case 11 /* NodeKind.Comma */: {
                this.visitCommaExpression(node);
                break;
            }
            case 12 /* NodeKind.ElementAccess */: {
                this.visitElementAccessExpression(node);
                break;
            }
            case 14 /* NodeKind.Function */: {
                this.visitFunctionExpression(node);
                break;
            }
            case 15 /* NodeKind.InstanceOf */: {
                this.visitInstanceOfExpression(node);
                break;
            }
            case 17 /* NodeKind.New */: {
                this.visitNewExpression(node);
                break;
            }
            case 20 /* NodeKind.Parenthesized */: {
                this.visitParenthesizedExpression(node);
                break;
            }
            case 21 /* NodeKind.PropertyAccess */: {
                this.visitPropertyAccessExpression(node);
                break;
            }
            case 22 /* NodeKind.Ternary */: {
                this.visitTernaryExpression(node);
                break;
            }
            case 27 /* NodeKind.UnaryPostfix */: {
                this.visitUnaryPostfixExpression(node);
                break;
            }
            case 28 /* NodeKind.UnaryPrefix */: {
                this.visitUnaryPrefixExpression(node);
                break;
            }
            // statements:
            case 31 /* NodeKind.Break */:
            case 34 /* NodeKind.Empty */:
            case 35 /* NodeKind.Export */:
            case 36 /* NodeKind.ExportDefault */:
            case 37 /* NodeKind.ExportImport */:
            case 32 /* NodeKind.Continue */:
            case 42 /* NodeKind.Import */:
            case 50 /* NodeKind.Module */: {
                break;
            }
            case 30 /* NodeKind.Block */: {
                this.visitBlockStatement(node);
                break;
            }
            case 33 /* NodeKind.Do */: {
                this.visitDoStatement(node);
                break;
            }
            case 38 /* NodeKind.Expression */: {
                this.visitExpressionStatement(node);
                break;
            }
            case 39 /* NodeKind.For */: {
                this.visitForStatement(node);
                break;
            }
            case 40 /* NodeKind.ForOf */: {
                this.visitForOfStatement(node);
                break;
            }
            case 41 /* NodeKind.If */: {
                this.visitIfStatement(node);
                break;
            }
            case 43 /* NodeKind.Return */: {
                this.visitReturnStatement(node);
                break;
            }
            case 44 /* NodeKind.Switch */: {
                this.visitSwitchStatement(node);
                break;
            }
            case 45 /* NodeKind.Throw */: {
                this.visitThrowStatement(node);
                break;
            }
            case 46 /* NodeKind.Try */: {
                this.visitTryStatement(node);
                break;
            }
            case 47 /* NodeKind.Variable */: {
                this.visitVariableStatement(node);
                break;
            }
            case 48 /* NodeKind.Void */: {
                this.visitVoidStatement(node);
                break;
            }
            case 49 /* NodeKind.While */: {
                this.visitWhileStatement(node);
                break;
            }
            // declaration statements
            case 56 /* NodeKind.ImportDeclaration */:
            case 60 /* NodeKind.TypeDeclaration */: {
                break;
            }
            case 51 /* NodeKind.ClassDeclaration */: {
                this.visitClassDeclaration(node);
                break;
            }
            case 52 /* NodeKind.EnumDeclaration */: {
                this.visitEnumDeclaration(node);
                break;
            }
            case 53 /* NodeKind.EnumValueDeclaration */: {
                this.visitEnumValueDeclaration(node);
                break;
            }
            case 54 /* NodeKind.FieldDeclaration */: {
                this.visitFieldDeclaration(node);
                break;
            }
            case 55 /* NodeKind.FunctionDeclaration */: {
                this.visitFunctionDeclaration(node);
                break;
            }
            case 57 /* NodeKind.InterfaceDeclaration */: {
                this.visitInterfaceDeclaration(node);
                break;
            }
            case 58 /* NodeKind.MethodDeclaration */: {
                this.visitMethodDeclaration(node);
                break;
            }
            case 59 /* NodeKind.NamespaceDeclaration */: {
                this.visitNamespaceDeclaration(node);
                break;
            }
            case 61 /* NodeKind.VariableDeclaration */: {
                this.visitVariableDeclaration(node);
                break;
            }
            // special
            case 63 /* NodeKind.ExportMember */:
            case 65 /* NodeKind.IndexSignature */:
            case 66 /* NodeKind.Comment */:
            case 62 /* NodeKind.Decorator */: {
                break;
            }
            case 64 /* NodeKind.SwitchCase */: {
                this.visitSwitchCase(node);
                break;
            }
        }
    }
    visitSource(node) {
        for (const statement of node.statements) {
            this.visitNode(statement);
        }
    }
    visitParameterNode(node) {
        if (node.initializer) {
            this.visitNode(node.initializer);
        }
    }
    visitAssertionExpression(node) {
        this.visitNode(node.expression);
    }
    visitBinaryExpression(node) {
        this.visitNode(node.left);
        this.visitNode(node.right);
    }
    visitCallExpression(node) {
        if (node.expression.kind === 6 /* NodeKind.Identifier */) {
            const fncName = node.expression.text;
            if (fncName === "describe" || fncName === "test") {
                assert(node.args.length === 2);
                assert(node.args[0].kind === 16 /* NodeKind.Literal */ &&
                    node.args[0].literalKind === 2 /* LiteralKind.String */);
                const testName = node.args[0].value;
                this.currentTestDescriptions.push(testName);
                if (fncName === "test") {
                    this.testNames.push(this.currentTestDescriptions.join(""));
                }
                this.visitNode(node.expression);
                for (const arg of node.args) {
                    this.visitNode(arg);
                }
                this.currentTestDescriptions.pop();
            }
        }
        else {
            this.visitNode(node.expression);
            for (const arg of node.args) {
                this.visitNode(arg);
            }
        }
    }
    visitClassExpression(node) {
        this.visitClassDeclaration(node.declaration);
    }
    visitCommaExpression(node) {
        for (const expr of node.expressions) {
            this.visitNode(expr);
        }
    }
    visitElementAccessExpression(node) {
        this.visitNode(node.expression);
        this.visitNode(node.elementExpression);
    }
    visitFunctionExpression(node) {
        this.visitFunctionDeclaration(node.declaration);
    }
    visitInstanceOfExpression(node) {
        this.visitNode(node.expression);
    }
    visitNewExpression(node) {
        for (const arg of node.args) {
            this.visitNode(arg);
        }
    }
    visitParenthesizedExpression(node) {
        this.visitNode(node.expression);
    }
    visitPropertyAccessExpression(node) {
        this.visitNode(node.expression);
    }
    visitTernaryExpression(node) {
        this.visitNode(node.condition);
        this.visitNode(node.ifThen);
        this.visitNode(node.ifElse);
    }
    visitUnaryPostfixExpression(node) {
        this.visitNode(node.operand);
    }
    visitUnaryPrefixExpression(node) {
        this.visitNode(node.operand);
    }
    // eslint-disable-next-line sonarjs/no-identical-functions
    visitBlockStatement(node) {
        for (const statement of node.statements) {
            this.visitNode(statement);
        }
    }
    visitDoStatement(node) {
        this.visitNode(node.body);
        this.visitNode(node.condition);
    }
    visitExpressionStatement(node) {
        this.visitNode(node.expression);
    }
    visitForStatement(node) {
        if (node.initializer) {
            this.visitNode(node.initializer);
        }
        if (node.condition) {
            this.visitNode(node.condition);
        }
        if (node.incrementor) {
            this.visitNode(node.incrementor);
        }
        this.visitNode(node.body);
    }
    visitForOfStatement(node) {
        this.visitNode(node.variable);
        this.visitNode(node.iterable);
        this.visitNode(node.body);
    }
    visitIfStatement(node) {
        this.visitNode(node.condition);
        this.visitNode(node.ifTrue);
        if (node.ifFalse) {
            this.visitNode(node.ifFalse);
        }
    }
    visitReturnStatement(node) {
        if (node.value) {
            this.visitNode(node.value);
        }
    }
    visitSwitchStatement(node) {
        this.visitNode(node.condition);
        for (const switchCase of node.cases) {
            this.visitSwitchCase(switchCase);
        }
    }
    visitThrowStatement(node) {
        this.visitNode(node.value);
    }
    visitTryStatement(node) {
        for (const stat of node.bodyStatements) {
            this.visitNode(stat);
        }
        if (node.catchStatements) {
            for (const stat of node.catchStatements) {
                this.visitNode(stat);
            }
        }
        if (node.finallyStatements) {
            for (const stat of node.finallyStatements) {
                this.visitNode(stat);
            }
        }
    }
    visitVariableStatement(node) {
        for (const declaration of node.declarations) {
            this.visitVariableDeclaration(declaration);
        }
    }
    visitVoidStatement(node) {
        this.visitNode(node.expression);
    }
    visitWhileStatement(node) {
        this.visitNode(node.condition);
        this.visitNode(node.body);
    }
    visitClassDeclaration(node) {
        for (const member of node.members) {
            this.visitNode(member);
        }
    }
    visitEnumDeclaration(node) {
        for (const value of node.values) {
            this.visitEnumValueDeclaration(value);
        }
    }
    // eslint-disable-next-line sonarjs/no-identical-functions
    visitEnumValueDeclaration(node) {
        if (node.initializer) {
            this.visitNode(node.initializer);
        }
    }
    // eslint-disable-next-line sonarjs/no-identical-functions
    visitFieldDeclaration(node) {
        if (node.initializer) {
            this.visitNode(node.initializer);
        }
    }
    visitFunctionDeclaration(node) {
        if (node.body) {
            this.visitNode(node.body);
        }
    }
    visitInterfaceDeclaration(node) {
        this.visitClassDeclaration(node);
    }
    visitMethodDeclaration(node) {
        this.visitFunctionDeclaration(node);
    }
    // eslint-disable-next-line sonarjs/no-identical-functions
    visitNamespaceDeclaration(node) {
        for (const member of node.members) {
            this.visitNode(member);
        }
    }
    // eslint-disable-next-line sonarjs/no-identical-functions
    visitVariableDeclaration(node) {
        if (node.initializer) {
            this.visitNode(node.initializer);
        }
    }
    visitSwitchCase(node) {
        if (node.label) {
            this.visitNode(node.label);
        }
        for (const stat of node.statements) {
            this.visitNode(stat);
        }
    }
}
export default SourceFunctionTransform;
