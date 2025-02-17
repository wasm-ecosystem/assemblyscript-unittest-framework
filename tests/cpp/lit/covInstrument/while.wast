(module
 (func $main (export "main") (result i32)
  (local $count i32)
  (local $total i32)
  (local $index i32)
  ;;@ fixture/while.ts:2:14
  (local.set $count
   (i32.const 8)
  )
  ;;@ fixture/while.ts:3:14
  (local.set $total
   (i32.const 0)
  )
  ;;@ fixture/while.ts:3:25
  (local.set $index
   (i32.const 1)
  )
  ;;@ fixture/while.ts:4:2
  (block $label$1
   (loop $label$2
    ;;@ fixture/while.ts:4:17
    (if
     (i32.lt_s
      ;;@ fixture/while.ts:4:9
      (local.get $index)
      ;;@ fixture/while.ts:4:17
      (local.get $count)
     )
     (block
      ;;@ fixture/while.ts:5:4
      (local.set $index
       (i32.add
        (local.get $index)
        (i32.const 1)
       )
      )
      ;;@ fixture/while.ts:6:13
      (local.set $total
       (i32.add
        ;;@ fixture/while.ts:6:4
        (local.get $total)
        ;;@ fixture/while.ts:6:13
        (local.get $index)
       )
      )
      (br $label$2)
     )
    )
   )
  )
  ;;@ fixture/while.ts:8:9
  (return
   (local.get $total)
  )
 )
)