(module
 (func $main (export "main") (result i32)
  (local $count i32)
  (local $total i32)
  (local $index i32)
  ;;@ fixture/for-loop-return.ts:2:14
  (local.set $count
   (i32.const 8)
  )
  ;;@ fixture/for-loop-return.ts:3:14
  (local.set $total
   (i32.const 100)
  )
  ;;@ fixture/for-loop-return.ts:4:19
  (local.set $index
   (i32.const 0)
  )
  (loop $label$1
   ;;@ fixture/for-loop-return.ts:4:30
   (if
    (i32.lt_s
     ;;@ fixture/for-loop-return.ts:4:22
     (local.get $index)
     ;;@ fixture/for-loop-return.ts:4:30
     (local.get $count)
    )
    (block
     ;;@ fixture/for-loop-return.ts:5:16
     (if
      (i32.gt_s
       ;;@ fixture/for-loop-return.ts:5:8
       (local.get $index)
       ;;@ fixture/for-loop-return.ts:5:16
       (i32.const 5)
      )
      ;;@ fixture/for-loop-return.ts:5:26
      (return
       (i32.const 0)
      )
     )
     ;;@ fixture/for-loop-return.ts:6:13
     (local.set $total
      (i32.add
       ;;@ fixture/for-loop-return.ts:6:4
       (local.get $total)
       ;;@ fixture/for-loop-return.ts:6:13
       (local.get $index)
      )
     )
     ;;@ fixture/for-loop-return.ts:4:37
     (local.set $index
      (i32.add
       (local.get $index)
       (i32.const 1)
      )
     )
     (br $label$1)
    )
   )
  )
  ;;@ fixture/for-loop-return.ts:8:9
  (return
   (local.get $total)
  )
 )
)