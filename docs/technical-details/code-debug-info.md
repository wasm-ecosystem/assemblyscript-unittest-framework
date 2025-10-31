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

The schema corresponding to json can be found in interface `DebugInfo` in `src/interface.ts`.
