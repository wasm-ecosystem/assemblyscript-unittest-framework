(module
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $none_=>_none (func))
 (memory $0 0)
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "main" (func $assembly/add/main))
 (export "memory" (memory $0))
 (func $assembly/add/genA (result i32)
  ;;@ assembly/add.ts:11:11
  (return
   (i32.const 1)
  )
 )
 (func $assembly/add/min (param $a i32) (result i32)
  (local $1 i32)
  ;;@ assembly/add.ts:7:11
  (local.set $a
   (i32.sub
    (local.tee $1
     (local.get $a)
    )
    (i32.const 1)
   )
  )
  (return
   (local.get $1)
  )
 )
 (func $assembly/add/add (param $a i32) (result i32)
  (local $1 i32)
  ;;@ assembly/add.ts:3:11
  (local.set $a
   (i32.add
    (local.tee $1
     (local.get $a)
    )
    (i32.const 1)
   )
  )
  (return
   (local.get $1)
  )
 )
 (func $assembly/add/main
  (local $a i32)
  ;;@ assembly/add.ts:15:12
  (local.set $a
   (call $assembly/add/genA)
  )
  ;;@ assembly/add.ts:16:12
  (if
   (i32.gt_s
    ;;@ assembly/add.ts:16:8
    (local.get $a)
    ;;@ assembly/add.ts:16:12
    (i32.const 0)
   )
   ;;@ assembly/add.ts:17:12
   (drop
    (call $assembly/add/min
     (local.get $a)
    )
   )
   ;;@ assembly/add.ts:19:12
   (drop
    (call $assembly/add/add
     (local.get $a)
    )
   )
  )
 )
 ;; custom section "sourceMappingURL", size 17
)