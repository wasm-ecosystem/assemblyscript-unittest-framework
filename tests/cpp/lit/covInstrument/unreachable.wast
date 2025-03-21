(module
 (type $0 (func (param i32 i32 i32 i32)))
 (type $1 (func (param i32)))
 (type $2 (func))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~lib/memory/__data_end i32 (i32.const 76))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 32844))
 (global $~lib/memory/__heap_base i32 (i32.const 32844))
 (memory $0 1)
 (data $0 (i32.const 12) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00")
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "main" (func $assembly/index/main))
 (export "memory" (memory $0))
 (func $assembly/index/f (param $a i32)
  ;;@ assembly/index.ts:5:2
  (if
   ;;@
   (i32.eqz
    ;;@ assembly/index.ts:5:9
    (i32.ge_s
     (local.get $a)
     ;;@ assembly/index.ts:5:14
     (i32.const 10)
    )
   )
   (then
    ;;@
    (call $~lib/builtins/abort
     (i32.const 0)
     (i32.const 32)
     (i32.const 5)
     (i32.const 3)
    )
    ;;@
    (unreachable)
   )
  )
 )
 (func $assembly/index/main
  ;;@ assembly/index.ts:2:2
  (call $assembly/index/f
   ;;@ assembly/index.ts:2:4
   (i32.const 10)
  )
  ;;@ assembly/index.ts:2:2
 )
 ;; custom section "sourceMappingURL", size 17
)
