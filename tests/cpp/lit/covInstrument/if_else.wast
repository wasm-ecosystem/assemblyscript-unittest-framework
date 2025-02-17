(module
 (func $main (export "main")
  (local $mode i32)
  (local $result i32)
  ;;@ fixture/if-else.ts:2:13
  (local.set $mode
   (i32.const 1)
  )
  ;;@ fixture/if-else.ts:3:15
  (local.set $result
   (i32.const 0)
  )
  ;;@ fixture/if-else.ts:4:6
  (if
   (local.get $mode)
   ;;@ fixture/if-else.ts:5:13
   (local.set $result
    (i32.const 100)
   )
   ;;@ fixture/if-else.ts:7:13
   (local.set $result
    (i32.const 200)
   )
  )
  ;;@ fixture/if-else.ts:9:2
  (return)
 )
)