(module
 (func $main (export "main") (result i32)
  (local $mode i32)
  (local $result i32)
  ;;@ fixture/if-elseif-empty-else.ts:2:13
  (local.set $mode
   (i32.const 100)
  )
  ;;@ fixture/if-elseif-empty-else.ts:3:20
  (local.set $result
   (i32.const 100)
  )
  ;;@ fixture/if-elseif-empty-else.ts:4:13
  (if
   (i32.gt_s
    ;;@ fixture/if-elseif-empty-else.ts:4:6
    (local.get $mode)
    ;;@ fixture/if-elseif-empty-else.ts:4:13
    (i32.const 100)
   )
   ;;@ fixture/if-elseif-empty-else.ts:5:14
   (local.set $result
    (i32.add
     ;;@ fixture/if-elseif-empty-else.ts:5:4
     (local.get $result)
     ;;@ fixture/if-elseif-empty-else.ts:5:14
     (local.get $mode)
    )
   )
   ;;@ fixture/if-elseif-empty-else.ts:6:20
   (if
    (i32.lt_s
     ;;@ fixture/if-elseif-empty-else.ts:6:13
     (local.get $mode)
     ;;@ fixture/if-elseif-empty-else.ts:6:20
     (i32.const 100)
    )
    ;;@ fixture/if-elseif-empty-else.ts:7:14
    (local.set $result
     (i32.sub
      ;;@ fixture/if-elseif-empty-else.ts:7:4
      (local.get $result)
      ;;@ fixture/if-elseif-empty-else.ts:7:14
      (local.get $mode)
     )
    )
   )
  )
  ;;@ fixture/if-elseif-empty-else.ts:9:9
  (return
   (local.get $result)
  )
 )
)