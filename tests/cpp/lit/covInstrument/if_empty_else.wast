(module
 (func $main (export "main")
  (local $mode i32)
  (local $result i32)
  ;;@ fixture/if-empty-else.ts:2:13
  (local.set $mode
   (i32.const 1)
  )
  ;;@ fixture/if-empty-else.ts:3:16
  (local.set $result
   (i32.const 100)
  )
  ;;@ fixture/if-empty-else.ts:4:6
  (if
   (local.get $mode)
   ;;@ fixture/if-empty-else.ts:5:13
   (local.set $result
    (i32.const 200)
   )
  )
  ;;@ fixture/if-empty-else.ts:7:2
  (return)
 )
)