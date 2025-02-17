(module
 (global $fixture/switch-case/Mode.FIRST i32 (i32.const 1))
 (global $fixture/switch-case/Mode.SECOND i32 (i32.const 2))
 (global $fixture/switch-case/Mode.THIRD i32 (i32.const 3))
 (func $main (export "main") (result i32)
  (local $mode i32)
  (local $total i32)
  (local $2 i32)
  ;;@ fixture/switch-case.ts:8:13
  (local.set $mode
   (i32.const 3)
  )
  ;;@ fixture/switch-case.ts:9:14
  (local.set $total
   (i32.const 100)
  )
  ;;@ fixture/switch-case.ts:10:2
  (block $label$1
   (block $label$2
    (block $label$3
     (block $label$4
      (block $label$5
       ;;@ fixture/switch-case.ts:10:10
       (local.set $2
        (local.get $mode)
       )
       ;;@ fixture/switch-case.ts:11:9
       (br_if $label$5
        (i32.eq
         ;;@ fixture/switch-case.ts:10:10
         (local.get $2)
         ;;@ fixture/switch-case.ts:11:9
         (global.get $fixture/switch-case/Mode.FIRST)
        )
       )
       ;;@ fixture/switch-case.ts:15:9
       (br_if $label$4
        (i32.eq
         ;;@ fixture/switch-case.ts:11:9
         (local.get $2)
         ;;@ fixture/switch-case.ts:15:9
         (global.get $fixture/switch-case/Mode.SECOND)
        )
       )
       ;;@ fixture/switch-case.ts:18:9
       (br_if $label$3
        (i32.eq
         ;;@ fixture/switch-case.ts:15:9
         (local.get $2)
         ;;@ fixture/switch-case.ts:18:9
         (global.get $fixture/switch-case/Mode.THIRD)
        )
       )
       (br $label$2)
      )
      ;;@ fixture/switch-case.ts:12:15
      (local.set $total
       (i32.add
        ;;@ fixture/switch-case.ts:12:6
        (local.get $total)
        ;;@ fixture/switch-case.ts:12:15
        (i32.const 100)
       )
      )
      ;;@ fixture/switch-case.ts:13:6
      (br $label$1)
     )
     ;;@ fixture/switch-case.ts:16:21
     (return
      (i32.add
       ;;@ fixture/switch-case.ts:16:13
       (local.get $total)
       ;;@ fixture/switch-case.ts:16:21
       (i32.const 200)
      )
     )
    )
    ;;@ fixture/switch-case.ts:19:15
    (local.set $total
     (i32.add
      ;;@ fixture/switch-case.ts:19:6
      (local.get $total)
      ;;@ fixture/switch-case.ts:19:15
      (i32.const 300)
     )
    )
    ;;@ fixture/switch-case.ts:20:6
    (br $label$1)
   )
   ;;@ fixture/switch-case.ts:23:13
   (return
    (i32.const 0)
   )
  )
  ;;@ fixture/switch-case.ts:26:9
  (return
   (local.get $total)
  )
 )
)