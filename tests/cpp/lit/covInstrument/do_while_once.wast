(module
 (func $main (export "main") (result i32)
   (local $count i32)
  (local $total i32)
  ;;@ fixture/do-while-once.ts:2:14
  (local.set $count
   (i32.const 50)
  )
  ;;@ fixture/do-while-once.ts:3:14
  (local.set $total
   (i32.const 30)
  )
  ;;@ fixture/do-while-once.ts:4:2
  (block $label$1
   (loop $label$2
    (block $label$3
     ;;@ fixture/do-while-once.ts:5:13
     (local.set $count
      (i32.mul
       ;;@ fixture/do-while-once.ts:5:4
       (local.get $count)
       ;;@ fixture/do-while-once.ts:5:13
       (i32.const 2)
      )
     )
     ;;@ fixture/do-while-once.ts:6:16
     (if
      (i32.gt_s
       ;;@ fixture/do-while-once.ts:6:8
       (local.get $count)
       ;;@ fixture/do-while-once.ts:6:16
       (i32.const 1000)
      )
      ;;@ fixture/do-while-once.ts:6:22
      (br $label$1)
     )
     ;;@ fixture/do-while-once.ts:7:4
     (local.set $count
      (i32.sub
       (local.get $count)
       (i32.const 1)
      )
     )
     ;;@ fixture/do-while-once.ts:8:16
     (if
      (i32.gt_s
       ;;@ fixture/do-while-once.ts:8:8
       (local.get $count)
       ;;@ fixture/do-while-once.ts:8:16
       (i32.const 30)
      )
      ;;@ fixture/do-while-once.ts:8:20
      (br $label$3)
     )
     ;;@ fixture/do-while-once.ts:9:4
     (local.set $count
      (i32.add
       (local.get $count)
       (i32.const 1)
      )
     )
    )
    ;;@ fixture/do-while-once.ts:10:11
    (br_if $label$2
     (i32.const 0)
    )
   )
  )
  ;;@ fixture/do-while-once.ts:11:17
  (return
   (i32.add
    ;;@ fixture/do-while-once.ts:11:9
    (local.get $count)
    ;;@ fixture/do-while-once.ts:11:17
    (local.get $total)
   )
  )
 )
)