(module
 (func $main (export "main") (result i32)
  (local $count i32)
  (local $total i32)
  (local $index i32)
  ;;@ fixture/for-loop-continue.ts:2:14
  (local.set $count
   (i32.const 2)
  )
  ;;@ fixture/for-loop-continue.ts:3:14
  (local.set $total
   (i32.const 100)
  )
  ;;@ fixture/for-loop-continue.ts:4:19
  (local.set $index
   (i32.const 0)
  )
  (loop $label$1
   ;;@ fixture/for-loop-continue.ts:4:30
   (if
    (i32.lt_s
     ;;@ fixture/for-loop-continue.ts:4:22
     (local.get $index)
     ;;@ fixture/for-loop-continue.ts:4:30
     (local.get $count)
    )
    (block
     (block $label$3
      ;;@ fixture/for-loop-continue.ts:5:21
      (if
       (i32.eq
        ;;@ fixture/for-loop-continue.ts:5:16
        (i32.rem_s
         ;;@ fixture/for-loop-continue.ts:5:8
         (local.get $index)
         ;;@ fixture/for-loop-continue.ts:5:16
         (i32.const 2)
        )
        ;;@ fixture/for-loop-continue.ts:5:21
        (i32.const 0)
       )
       ;;@ fixture/for-loop-continue.ts:5:24
       (br $label$3)
      )
      ;;@ fixture/for-loop-continue.ts:6:13
      (local.set $total
       (i32.add
        ;;@ fixture/for-loop-continue.ts:6:4
        (local.get $total)
        ;;@ fixture/for-loop-continue.ts:6:13
        (local.get $index)
       )
      )
     )
     ;;@ fixture/for-loop-continue.ts:4:37
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
  ;;@ fixture/for-loop-continue.ts:8:9
  (return
   (local.get $total)
  )
 )
)