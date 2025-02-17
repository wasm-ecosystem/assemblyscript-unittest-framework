(module
 (export "main" (func $main))
 (export "shouldExcludeFun" (func $shouldExcludeFun))
 (func $main (param $a i32)
        ;;@ index.ts:1:1 
        (if
            ;;@ index.ts:1:1 
            (i32.lt_s
                ;;@ index.ts:2:1 
                (local.get $a)
                ;;@ index.ts:3:1 
                (i32.const 0)
            )
            ;;@ index.ts:4:1 
            (local.set $a
                ;;@ index.ts:5:1 
                (i32.const 0)
            )
            ;;@ index.ts:6:1 
            (local.set $a
                ;;@ index.ts:7:1 
                (i32.const 1)
            )
        )
        ;;@ index.ts:8:1 
        (call $shouldExcludeFun
            (i32.const 1)
            (i32.const 2)
        )
    )
    (func $shouldExcludeFun (param $a i32)(param $b i32)
        ;;@ index.ts:9:1 
        (drop
            ;;@ index.ts:10:1 
            (i32.add
                (local.get $a)
                (local.get $b)
            )
        )
    )
    ;; custom section "sourceMappingURL", size 17
)