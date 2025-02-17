(module
 (func $main (export "main") (result i32)
  (local $count i32)
  (local $total i32)
  (local $index i32)
  ;;@ fixture/do-while-break.ts:2:14
  (local.set $count
   (i32.const 8)
  )
  ;;@ fixture/do-while-break.ts:3:14
  (local.set $total
   (i32.const 0)
  )
  ;;@ fixture/do-while-break.ts:3:25
  (local.set $index
   (i32.const 1)
  )
  ;;@ fixture/do-while-break.ts:4:2
  (block $label$1
   (loop $label$2
    ;;@ fixture/do-while-break.ts:5:4
    (local.set $index
     (i32.add
      (local.get $index)
      (i32.const 1)
     )
    )
    ;;@ fixture/do-while-break.ts:6:16
    (if
     (i32.gt_s
      ;;@ fixture/do-while-break.ts:6:8
      (local.get $index)
      ;;@ fixture/do-while-break.ts:6:16
      (i32.const 5)
     )
     ;;@ fixture/do-while-break.ts:6:19
     (br $label$1)
    )
    ;;@ fixture/do-while-break.ts:7:18
    (br_if $label$2
     (i32.lt_s
      ;;@ fixture/do-while-break.ts:7:10
      (local.get $index)
      ;;@ fixture/do-while-break.ts:7:18
      (local.get $count)
     )
    )
   )
  )
  ;;@ fixture/do-while-break.ts:8:9
  (return
   (local.get $total)
  )
 )
)