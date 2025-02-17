(module
 (func $main (export "main") (result i32)
  (local $count i32)
  (local $total i32)
  (local $index i32)
  ;;@ fixture/for-loop-break.ts:2:14
  (local.set $count
   (i32.const 7)
  )
  ;;@ fixture/for-loop-break.ts:3:14
  (local.set $total
   (i32.const 100)
  )
  ;;@ fixture/for-loop-break.ts:4:19
  (local.set $index
   (i32.const 0)
  )
  (block $label$1
   (loop $label$2
    ;;@ fixture/for-loop-break.ts:4:30
    (if
     (i32.lt_s
      ;;@ fixture/for-loop-break.ts:4:22
      (local.get $index)
      ;;@ fixture/for-loop-break.ts:4:30
      (local.get $count)
     )
     (block
      ;;@ fixture/for-loop-break.ts:5:16
      (if
       (i32.gt_s
        ;;@ fixture/for-loop-break.ts:5:8
        (local.get $index)
        ;;@ fixture/for-loop-break.ts:5:16
        (i32.const 5)
       )
       ;;@ fixture/for-loop-break.ts:5:19
       (br $label$1)
      )
      ;;@ fixture/for-loop-break.ts:6:13
      (local.set $total
       (i32.add
        ;;@ fixture/for-loop-break.ts:6:4
        (local.get $total)
        ;;@ fixture/for-loop-break.ts:6:13
        (local.get $index)
       )
      )
      ;;@ fixture/for-loop-break.ts:4:37
      (local.set $index
       (i32.add
        (local.get $index)
        (i32.const 1)
       )
      )
      (br $label$2)
     )
    )
   )
  )
  ;;@ fixture/for-loop-break.ts:8:9
  (return
   (local.get $total)
  )
 )
)