(module
 (func $main (export "main") (result i32)
  (local $mode i32)
  (local $result i32)
  ;;@ fixture/if-elseif-else.ts:2:13
  (local.set $mode
   (i32.const 100)
  )
  ;;@ fixture/if-elseif-else.ts:3:15
  (local.set $result
   (i32.const 100)
  )
  ;;@ fixture/if-elseif-else.ts:4:13
  (if
   (i32.gt_s
    ;;@ fixture/if-elseif-else.ts:4:6
    (local.get $mode)
    ;;@ fixture/if-elseif-else.ts:4:13
    (i32.const 100)
   )
   ;;@ fixture/if-elseif-else.ts:5:14
   (local.set $result
    (i32.add
     ;;@ fixture/if-elseif-else.ts:5:4
     (local.get $result)
     ;;@ fixture/if-elseif-else.ts:5:14
     (local.get $mode)
    )
   )
   ;;@ fixture/if-elseif-else.ts:6:20
   (if
    (i32.lt_s
     ;;@ fixture/if-elseif-else.ts:6:13
     (local.get $mode)
     ;;@ fixture/if-elseif-else.ts:6:20
     (i32.const 60)
    )
    ;;@ fixture/if-elseif-else.ts:7:14
    (local.set $result
     (i32.sub
      ;;@ fixture/if-elseif-else.ts:7:4
      (local.get $result)
      ;;@ fixture/if-elseif-else.ts:7:14
      (local.get $mode)
     )
    )
    ;;@ fixture/if-elseif-else.ts:9:14
    (local.set $result
     (i32.add
      ;;@ fixture/if-elseif-else.ts:9:4
      (local.get $result)
      ;;@ fixture/if-elseif-else.ts:9:14
      (i32.const 60)
     )
    )
   )
  )
  ;;@ fixture/if-elseif-else.ts:11:9
  (return
   (local.get $result)
  )
 )
)