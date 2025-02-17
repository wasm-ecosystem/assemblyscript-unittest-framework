(module
 (global $fixture/switch-case-rdefault/Mode.FIRST i32 (i32.const 1))
 (global $fixture/switch-case-rdefault/Mode.SECOND i32 (i32.const 2))
 (global $fixture/switch-case-rdefault/Mode.THIRD i32 (i32.const 3))
 (func $main (export "main") (result i32)
  (local $mode i32)
  (local $total i32)
  (local $2 i32)
  ;;@ fixture/switch-case-rdefault.ts:8:13
  (local.set $mode
   (i32.const 2)
  )
  ;;@ fixture/switch-case-rdefault.ts:9:14
  (local.set $total
   (i32.const 100)
  )
  ;;@ fixture/switch-case-rdefault.ts:10:2
  (block $label$1
   (block $label$2
    (block $label$3
     (block $label$4
      (block $label$5
       ;;@ fixture/switch-case-rdefault.ts:10:10
       (local.set $2
        (local.get $mode)
       )
       ;;@ fixture/switch-case-rdefault.ts:14:9
       (br_if $label$4
        (i32.eq
         ;;@ fixture/switch-case-rdefault.ts:10:10
         (local.get $2)
         ;;@ fixture/switch-case-rdefault.ts:14:9
         (global.get $fixture/switch-case-rdefault/Mode.FIRST)
        )
       )
       ;;@ fixture/switch-case-rdefault.ts:18:9
       (br_if $label$3
        (i32.eq
         ;;@ fixture/switch-case-rdefault.ts:14:9
         (local.get $2)
         ;;@ fixture/switch-case-rdefault.ts:18:9
         (global.get $fixture/switch-case-rdefault/Mode.SECOND)
        )
       )
       ;;@ fixture/switch-case-rdefault.ts:22:9
       (br_if $label$2
        (i32.eq
         ;;@ fixture/switch-case-rdefault.ts:18:9
         (local.get $2)
         ;;@ fixture/switch-case-rdefault.ts:22:9
         (global.get $fixture/switch-case-rdefault/Mode.THIRD)
        )
       )
       (br $label$5)
      )
      ;;@ fixture/switch-case-rdefault.ts:12:21
      (return
       (i32.add
        ;;@ fixture/switch-case-rdefault.ts:12:13
        (local.get $total)
        ;;@ fixture/switch-case-rdefault.ts:12:21
        (i32.const 10)
       )
      )
     )
     ;;@ fixture/switch-case-rdefault.ts:15:15
     (local.set $total
      (i32.add
       ;;@ fixture/switch-case-rdefault.ts:15:6
       (local.get $total)
       ;;@ fixture/switch-case-rdefault.ts:15:15
       (i32.const 100)
      )
     )
     ;;@ fixture/switch-case-rdefault.ts:16:6
     (br $label$1)
    )
    ;;@ fixture/switch-case-rdefault.ts:19:15
    (local.set $total
     (i32.add
      ;;@ fixture/switch-case-rdefault.ts:19:6
      (local.get $total)
      ;;@ fixture/switch-case-rdefault.ts:19:15
      (i32.const 200)
     )
    )
    ;;@ fixture/switch-case-rdefault.ts:20:6
    (br $label$1)
   )
   ;;@ fixture/switch-case-rdefault.ts:23:15
   (local.set $total
    (i32.add
     ;;@ fixture/switch-case-rdefault.ts:23:6
     (local.get $total)
     ;;@ fixture/switch-case-rdefault.ts:23:15
     (i32.const 300)
    )
   )
   ;;@ fixture/switch-case-rdefault.ts:24:6
   (br $label$1)
  )
  ;;@ fixture/switch-case-rdefault.ts:27:9
  (return
   (local.get $total)
  )
 )
)