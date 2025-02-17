(module
 (func $main (export "main")
   (local $mode i32)
  (local $result i32)
  ;;@ fixture/multi-if-else.ts:2:13
  (local.set $mode
   (i32.const 100)
  )
  ;;@ fixture/multi-if-else.ts:3:15
  (local.set $result
   (i32.const 100)
  )
  ;;@ fixture/multi-if-else.ts:4:13
  (if
   (i32.gt_s
    ;;@ fixture/multi-if-else.ts:4:6
    (local.get $mode)
    ;;@ fixture/multi-if-else.ts:4:13
    (i32.const 100)
   )
   ;;@ fixture/multi-if-else.ts:5:14
   (local.set $result
    (i32.add
     ;;@ fixture/multi-if-else.ts:5:4
     (local.get $result)
     ;;@ fixture/multi-if-else.ts:5:14
     (local.get $mode)
    )
   )
   ;;@ fixture/multi-if-else.ts:7:15
   (if
    (i32.gt_s
     ;;@ fixture/multi-if-else.ts:7:8
     (local.get $mode)
     ;;@ fixture/multi-if-else.ts:7:15
     (i32.const 80)
    )
    ;;@ fixture/multi-if-else.ts:8:16
    (local.set $result
     (i32.add
      ;;@ fixture/multi-if-else.ts:8:6
      (local.get $result)
      ;;@ fixture/multi-if-else.ts:8:16
      (local.get $mode)
     )
    )
    ;;@ fixture/multi-if-else.ts:9:22
    (if
     (i32.lt_s
      ;;@ fixture/multi-if-else.ts:9:15
      (local.get $mode)
      ;;@ fixture/multi-if-else.ts:9:22
      (i32.const 90)
     )
     ;;@ fixture/multi-if-else.ts:10:16
     (local.set $result
      (i32.sub
       ;;@ fixture/multi-if-else.ts:10:6
       (local.get $result)
       ;;@ fixture/multi-if-else.ts:10:16
       (local.get $mode)
      )
     )
    )
   )
  )
 )
)