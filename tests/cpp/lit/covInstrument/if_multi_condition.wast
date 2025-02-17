(module
 (func $main (export "main") (result i32)
  (local $mode i32)
  (local $result i32)
  ;;@ fixture/if-multi-condition.ts:2:13
  (local.set $mode
   (i32.const 10)
  )
  ;;@ fixture/if-multi-condition.ts:3:15
  (local.set $result
   (i32.const 0)
  )
  ;;@ fixture/if-multi-condition.ts:4:41
  (if
   ;;@ fixture/if-multi-condition.ts:4:27
   (if (result i32)
    ;;@ fixture/if-multi-condition.ts:4:14
    (if (result i32)
     (i32.eq
      ;;@ fixture/if-multi-condition.ts:4:6
      (local.get $mode)
      ;;@ fixture/if-multi-condition.ts:4:14
      (i32.const 5)
     )
     (i32.const 1)
     ;;@ fixture/if-multi-condition.ts:4:27
     (i32.eq
      ;;@ fixture/if-multi-condition.ts:4:19
      (local.get $mode)
      ;;@ fixture/if-multi-condition.ts:4:27
      (i32.const 10)
     )
    )
    (i32.const 1)
    ;;@ fixture/if-multi-condition.ts:4:41
    (i32.eq
     ;;@ fixture/if-multi-condition.ts:4:33
     (local.get $mode)
     ;;@ fixture/if-multi-condition.ts:4:41
     (i32.const 15)
    )
   )
   ;;@ fixture/if-multi-condition.ts:5:13
   (local.set $result
    (i32.const 100)
   )
   ;;@ fixture/if-multi-condition.ts:7:13
   (local.set $result
    (i32.const 300)
   )
  )
  ;;@ fixture/if-multi-condition.ts:9:9
  (return
   (local.get $result)
  )
 )
)