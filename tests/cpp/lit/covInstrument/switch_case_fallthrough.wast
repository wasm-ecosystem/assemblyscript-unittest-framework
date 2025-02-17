(module
 (global $fixture/switch-case-fallthrough/Mode.FIRST i32 (i32.const 1))
 (global $fixture/switch-case-fallthrough/Mode.SECOND i32 (i32.const 2))
 (global $fixture/switch-case-fallthrough/Mode.THIRD i32 (i32.const 3))
 (func $main (export "main") (result i32)
  (local $mode i32)
  (local $total i32)
  (local $2 i32)
  ;;@ fixture/switch-case-fallthrough.ts:8:13
  (local.set $mode
   (i32.const 2)
  )
  ;;@ fixture/switch-case-fallthrough.ts:9:14
  (local.set $total
   (i32.const 100)
  )
  ;;@ fixture/switch-case-fallthrough.ts:10:2
  (block $label$1
   (block $label$2
    (block $label$3
     (block $label$4
      ;;@ fixture/switch-case-fallthrough.ts:10:10
      (local.set $2
       (local.get $mode)
      )
      ;;@ fixture/switch-case-fallthrough.ts:11:9
      (br_if $label$4
       (i32.eq
        ;;@ fixture/switch-case-fallthrough.ts:10:10
        (local.get $2)
        ;;@ fixture/switch-case-fallthrough.ts:11:9
        (global.get $fixture/switch-case-fallthrough/Mode.FIRST)
       )
      )
      ;;@ fixture/switch-case-fallthrough.ts:15:9
      (br_if $label$3
       (i32.eq
        ;;@ fixture/switch-case-fallthrough.ts:11:9
        (local.get $2)
        ;;@ fixture/switch-case-fallthrough.ts:15:9
        (global.get $fixture/switch-case-fallthrough/Mode.SECOND)
       )
      )
      ;;@ fixture/switch-case-fallthrough.ts:16:9
      (br_if $label$2
       (i32.eq
        ;;@ fixture/switch-case-fallthrough.ts:15:9
        (local.get $2)
        ;;@ fixture/switch-case-fallthrough.ts:16:9
        (global.get $fixture/switch-case-fallthrough/Mode.THIRD)
       )
      )
      (br $label$1)
     )
     ;;@ fixture/switch-case-fallthrough.ts:12:15
     (local.set $total
      (i32.add
       ;;@ fixture/switch-case-fallthrough.ts:12:6
       (local.get $total)
       ;;@ fixture/switch-case-fallthrough.ts:12:15
       (i32.const 100)
      )
     )
     ;;@ fixture/switch-case-fallthrough.ts:13:6
     (br $label$1)
    )
   )
   ;;@ fixture/switch-case-fallthrough.ts:17:15
   (local.set $total
    (i32.add
     ;;@ fixture/switch-case-fallthrough.ts:17:6
     (local.get $total)
     ;;@ fixture/switch-case-fallthrough.ts:17:15
     (i32.const 300)
    )
   )
   ;;@ fixture/switch-case-fallthrough.ts:18:6
   (br $label$1)
  )
  ;;@ fixture/switch-case-fallthrough.ts:21:9
  (return
   (local.get $total)
  )
 )
)