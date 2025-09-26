import { Transform } from "assemblyscript/transform";
import {
  NodeKind,
  SourceKind,
  Node,
  Source,
  ParameterNode,
  AssertionExpression,
  BinaryExpression,
  CallExpression,
  ClassExpression,
  CommaExpression,
  ElementAccessExpression,
  FunctionExpression,
  InstanceOfExpression,
  NewExpression,
  ParenthesizedExpression,
  PropertyAccessExpression,
  TernaryExpression,
  UnaryPostfixExpression,
  UnaryPrefixExpression,
  BlockStatement,
  DoStatement,
  ExpressionStatement,
  ForStatement,
  ForOfStatement,
  IfStatement,
  ReturnStatement,
  SwitchStatement,
  ThrowStatement,
  TryStatement,
  VariableStatement,
  VoidStatement,
  WhileStatement,
  ClassDeclaration,
  EnumDeclaration,
  EnumValueDeclaration,
  FieldDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  MethodDeclaration,
  NamespaceDeclaration,
  VariableDeclaration,
  SwitchCase,
  IdentifierExpression,
  LiteralExpression,
  LiteralKind,
  StringLiteralExpression,
  Parser,
} from "assemblyscript";
import assert from "node:assert";

class SourceFunctionTransform extends Transform {
  testNames: string[] = [];
  currentTestDescriptions: string[] = [];
  testFileName: string;

  afterParse(parser: Parser) {
    // There will be two sources with SourceKind.UserEntry, ~lib/rt/index-incremental.ts should be filtered
    const entrySource = parser.sources.find(
      (source) => source.sourceKind === SourceKind.UserEntry && !source.normalizedPath.startsWith("~lib/")
    );
    this.testFileName = entrySource.normalizedPath;
    this.visitNode(entrySource);
    globalThis.testNames = this.testNames;
    throw new Error("TransformDone");
  }

  visitNode(node: Node) {
    // eslint-disable-next-line sonarjs/max-switch-cases
    switch (node.kind) {
      case NodeKind.Source: {
        this.visitSource(node as Source);
        break;
      }

      // types
      case NodeKind.NamedType:
      case NodeKind.FunctionType:
      case NodeKind.TypeName:
      case NodeKind.TypeParameter: {
        break;
      }
      case NodeKind.Parameter: {
        this.visitParameterNode(node as ParameterNode);
        break;
      }

      // Expressions
      case NodeKind.Identifier:
      case NodeKind.False:
      case NodeKind.Literal:
      case NodeKind.Null:
      case NodeKind.Omitted:
      case NodeKind.Super:
      case NodeKind.This:
      case NodeKind.True:
      case NodeKind.Constructor:
      case NodeKind.Compiled: {
        break;
      }
      case NodeKind.Assertion: {
        this.visitAssertionExpression(node as AssertionExpression);
        break;
      }
      case NodeKind.Binary: {
        this.visitBinaryExpression(node as BinaryExpression);
        break;
      }
      case NodeKind.Call: {
        this.visitCallExpression(node as CallExpression);
        break;
      }
      case NodeKind.Class: {
        this.visitClassExpression(node as ClassExpression);
        break;
      }
      case NodeKind.Comma: {
        this.visitCommaExpression(node as CommaExpression);
        break;
      }
      case NodeKind.ElementAccess: {
        this.visitElementAccessExpression(node as ElementAccessExpression);
        break;
      }
      case NodeKind.Function: {
        this.visitFunctionExpression(node as FunctionExpression);
        break;
      }
      case NodeKind.InstanceOf: {
        this.visitInstanceOfExpression(node as InstanceOfExpression);
        break;
      }
      case NodeKind.New: {
        this.visitNewExpression(node as NewExpression);
        break;
      }
      case NodeKind.Parenthesized: {
        this.visitParenthesizedExpression(node as ParenthesizedExpression);
        break;
      }
      case NodeKind.PropertyAccess: {
        this.visitPropertyAccessExpression(node as PropertyAccessExpression);
        break;
      }
      case NodeKind.Ternary: {
        this.visitTernaryExpression(node as TernaryExpression);
        break;
      }
      case NodeKind.UnaryPostfix: {
        this.visitUnaryPostfixExpression(node as UnaryPostfixExpression);
        break;
      }
      case NodeKind.UnaryPrefix: {
        this.visitUnaryPrefixExpression(node as UnaryPrefixExpression);
        break;
      }

      // statements:

      case NodeKind.Break:
      case NodeKind.Empty:
      case NodeKind.Export:
      case NodeKind.ExportDefault:
      case NodeKind.ExportImport:
      case NodeKind.Continue:
      case NodeKind.Import:
      case NodeKind.Module: {
        break;
      }
      case NodeKind.Block: {
        this.visitBlockStatement(node as BlockStatement);
        break;
      }
      case NodeKind.Do: {
        this.visitDoStatement(node as DoStatement);
        break;
      }
      case NodeKind.Expression: {
        this.visitExpressionStatement(node as ExpressionStatement);
        break;
      }
      case NodeKind.For: {
        this.visitForStatement(node as ForStatement);
        break;
      }
      case NodeKind.ForOf: {
        this.visitForOfStatement(node as ForOfStatement);
        break;
      }
      case NodeKind.If: {
        this.visitIfStatement(node as IfStatement);
        break;
      }
      case NodeKind.Return: {
        this.visitReturnStatement(node as ReturnStatement);
        break;
      }
      case NodeKind.Switch: {
        this.visitSwitchStatement(node as SwitchStatement);
        break;
      }
      case NodeKind.Throw: {
        this.visitThrowStatement(node as ThrowStatement);
        break;
      }
      case NodeKind.Try: {
        this.visitTryStatement(node as TryStatement);
        break;
      }
      case NodeKind.Variable: {
        this.visitVariableStatement(node as VariableStatement);
        break;
      }
      case NodeKind.Void: {
        this.visitVoidStatement(node as VoidStatement);
        break;
      }
      case NodeKind.While: {
        this.visitWhileStatement(node as WhileStatement);
        break;
      }

      // declaration statements
      case NodeKind.ImportDeclaration:
      case NodeKind.TypeDeclaration: {
        break;
      }
      case NodeKind.ClassDeclaration: {
        this.visitClassDeclaration(node as ClassDeclaration);
        break;
      }
      case NodeKind.EnumDeclaration: {
        this.visitEnumDeclaration(node as EnumDeclaration);
        break;
      }
      case NodeKind.EnumValueDeclaration: {
        this.visitEnumValueDeclaration(node as EnumValueDeclaration);
        break;
      }
      case NodeKind.FieldDeclaration: {
        this.visitFieldDeclaration(node as FieldDeclaration);
        break;
      }
      case NodeKind.FunctionDeclaration: {
        this.visitFunctionDeclaration(node as FunctionDeclaration);
        break;
      }
      case NodeKind.InterfaceDeclaration: {
        this.visitInterfaceDeclaration(node as InterfaceDeclaration);
        break;
      }
      case NodeKind.MethodDeclaration: {
        this.visitMethodDeclaration(node as MethodDeclaration);
        break;
      }
      case NodeKind.NamespaceDeclaration: {
        this.visitNamespaceDeclaration(node as NamespaceDeclaration);
        break;
      }
      case NodeKind.VariableDeclaration: {
        this.visitVariableDeclaration(node as VariableDeclaration);
        break;
      }

      // special
      case NodeKind.ExportMember:
      case NodeKind.IndexSignature:
      case NodeKind.Comment:
      case NodeKind.Decorator: {
        break;
      }
      case NodeKind.SwitchCase: {
        this.visitSwitchCase(node as SwitchCase);
        break;
      }
    }
  }

  visitSource(node: Source) {
    for (const statement of node.statements) {
      this.visitNode(statement);
    }
  }

  visitParameterNode(node: ParameterNode) {
    if (node.initializer) {
      this.visitNode(node.initializer);
    }
  }

  visitAssertionExpression(node: AssertionExpression) {
    this.visitNode(node.expression);
  }

  visitBinaryExpression(node: BinaryExpression) {
    this.visitNode(node.left);
    this.visitNode(node.right);
  }

  visitCallExpression(node: CallExpression) {
    if (node.expression.kind === NodeKind.Identifier) {
      const fncName = (node.expression as IdentifierExpression).text;
      if (fncName === "describe" || fncName === "test") {
        assert(node.args.length === 2);
        assert(
          node.args[0].kind === NodeKind.Literal &&
            (node.args[0] as LiteralExpression).literalKind === LiteralKind.String
        );
        const testName = (node.args[0] as StringLiteralExpression).value;
        this.currentTestDescriptions.push(testName);
        if (fncName === "test") {
          this.testNames.push(this.currentTestDescriptions.join(" "));
        }
        this.visitNode(node.expression);
        for (const arg of node.args) {
          this.visitNode(arg);
        }
        this.currentTestDescriptions.pop();
      }
    } else {
      this.visitNode(node.expression);
      for (const arg of node.args) {
        this.visitNode(arg);
      }
    }
  }

  visitClassExpression(node: ClassExpression) {
    this.visitClassDeclaration(node.declaration);
  }

  visitCommaExpression(node: CommaExpression) {
    for (const expr of node.expressions) {
      this.visitNode(expr);
    }
  }

  visitElementAccessExpression(node: ElementAccessExpression) {
    this.visitNode(node.expression);
    this.visitNode(node.elementExpression);
  }

  visitFunctionExpression(node: FunctionExpression) {
    this.visitFunctionDeclaration(node.declaration);
  }

  visitInstanceOfExpression(node: InstanceOfExpression) {
    this.visitNode(node.expression);
  }

  visitNewExpression(node: NewExpression) {
    for (const arg of node.args) {
      this.visitNode(arg);
    }
  }

  visitParenthesizedExpression(node: ParenthesizedExpression) {
    this.visitNode(node.expression);
  }

  visitPropertyAccessExpression(node: PropertyAccessExpression) {
    this.visitNode(node.expression);
  }

  visitTernaryExpression(node: TernaryExpression) {
    this.visitNode(node.condition);
    this.visitNode(node.ifThen);
    this.visitNode(node.ifElse);
  }

  visitUnaryPostfixExpression(node: UnaryPostfixExpression) {
    this.visitNode(node.operand);
  }

  visitUnaryPrefixExpression(node: UnaryPrefixExpression) {
    this.visitNode(node.operand);
  }
  // eslint-disable-next-line sonarjs/no-identical-functions
  visitBlockStatement(node: BlockStatement) {
    for (const statement of node.statements) {
      this.visitNode(statement);
    }
  }

  visitDoStatement(node: DoStatement) {
    this.visitNode(node.body);
    this.visitNode(node.condition);
  }

  visitExpressionStatement(node: ExpressionStatement) {
    this.visitNode(node.expression);
  }

  visitForStatement(node: ForStatement) {
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

  visitForOfStatement(node: ForOfStatement) {
    this.visitNode(node.variable);
    this.visitNode(node.iterable);
    this.visitNode(node.body);
  }

  visitIfStatement(node: IfStatement) {
    this.visitNode(node.condition);
    this.visitNode(node.ifTrue);
    if (node.ifFalse) {
      this.visitNode(node.ifFalse);
    }
  }

  visitReturnStatement(node: ReturnStatement) {
    if (node.value) {
      this.visitNode(node.value);
    }
  }

  visitSwitchStatement(node: SwitchStatement) {
    this.visitNode(node.condition);
    for (const switchCase of node.cases) {
      this.visitSwitchCase(switchCase);
    }
  }

  visitThrowStatement(node: ThrowStatement) {
    this.visitNode(node.value);
  }

  visitTryStatement(node: TryStatement) {
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

  visitVariableStatement(node: VariableStatement) {
    for (const declaration of node.declarations) {
      this.visitVariableDeclaration(declaration);
    }
  }

  visitVoidStatement(node: VoidStatement) {
    this.visitNode(node.expression);
  }

  visitWhileStatement(node: WhileStatement) {
    this.visitNode(node.condition);
    this.visitNode(node.body);
  }

  visitClassDeclaration(node: ClassDeclaration) {
    for (const member of node.members) {
      this.visitNode(member);
    }
  }

  visitEnumDeclaration(node: EnumDeclaration) {
    for (const value of node.values) {
      this.visitEnumValueDeclaration(value);
    }
  }
  // eslint-disable-next-line sonarjs/no-identical-functions
  visitEnumValueDeclaration(node: EnumValueDeclaration) {
    if (node.initializer) {
      this.visitNode(node.initializer);
    }
  }
  // eslint-disable-next-line sonarjs/no-identical-functions
  visitFieldDeclaration(node: FieldDeclaration) {
    if (node.initializer) {
      this.visitNode(node.initializer);
    }
  }

  visitFunctionDeclaration(node: FunctionDeclaration) {
    if (node.body) {
      this.visitNode(node.body);
    }
  }

  visitInterfaceDeclaration(node: InterfaceDeclaration) {
    this.visitClassDeclaration(node);
  }

  visitMethodDeclaration(node: MethodDeclaration) {
    this.visitFunctionDeclaration(node);
  }
  // eslint-disable-next-line sonarjs/no-identical-functions
  visitNamespaceDeclaration(node: NamespaceDeclaration) {
    for (const member of node.members) {
      this.visitNode(member);
    }
  }
  // eslint-disable-next-line sonarjs/no-identical-functions
  visitVariableDeclaration(node: VariableDeclaration) {
    if (node.initializer) {
      this.visitNode(node.initializer);
    }
  }

  visitSwitchCase(node: SwitchCase) {
    if (node.label) {
      this.visitNode(node.label);
    }
    for (const stat of node.statements) {
      this.visitNode(stat);
    }
  }
}

export default SourceFunctionTransform;
