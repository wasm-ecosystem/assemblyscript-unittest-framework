(module
 (func $main (export "main") (result i32)
  (local $count i32)
  (local $total i32)
  (local $index i32)
  ;;@ fixture/do-while.ts:2:14
  (local.set $count
   (i32.const 8)
  )
  ;;@ fixture/do-while.ts:3:14
  (local.set $total
   (i32.const 0)
  )
  ;;@ fixture/do-while.ts:3:25
  (local.set $index
   (i32.const 1)
  )
  ;;@ fixture/do-while.ts:4:2
  (loop $label$1
   ;;@ fixture/do-while.ts:5:4
   (local.set $index
    (i32.add
     (local.get $index)
     (i32.const 1)
    )
   )
   ;;@ fixture/do-while.ts:6:18
   (br_if $label$1
    (i32.lt_s
     ;;@ fixture/do-while.ts:6:10
     (local.get $index)
     ;;@ fixture/do-while.ts:6:18
     (local.get $count)
    )
   )
  )
  ;;@ fixture/do-while.ts:7:9
  (return
   (local.get $total)
  )
 )
)