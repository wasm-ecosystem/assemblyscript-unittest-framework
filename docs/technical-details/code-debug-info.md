#### WASM-INSTRUMENTATION codeDebugInfo

```json
{
    "debugFiles": ["assembly/output.ts"],
    "debugInfos": {
        "assembly/output/output": {
            "index": 0,
            "branchInfo": [
                [1, 2], [1, 3]
            ],
            "lineInfo": [
                [[0, 2, 1], [0, 3, 1]],
                [[0, 5, 1]],
                [[0, 8, 1], [0, 9, 1]]
            ]
        }
    }
}
```

```ts
interface CodeDebugInfo {
    debugFiles: string[];
    debugInfos: Record<string, FunctionDebugInfo>;
}

interface FunctionDebugInfo {
    index: number;
    branchInfo: Branch[];
    lineInfo: LineInfos;
}

type LineRange = [FileIndex, LineIndex, ColumnIndex][][];
type LineInfos = LineRange[][];
type FileIndex = number;
type LineIndex = number;
type ColumnIndex = number;
type Branch = [number, number];
```
