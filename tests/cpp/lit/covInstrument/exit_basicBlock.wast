(module
 (global $fixture/exit-basicBlock/mode i32 (i32.const 100))
 (func $main (export "main")
  (local $result i32)
  ;;@ fixture/exit-basicBlock.ts:4:27
  (if
   ;;@ fixture/exit-basicBlock.ts:4:14
   (if (result i32)
    (i32.eq
     ;;@ fixture/exit-basicBlock.ts:4:6
     (global.get $fixture/exit-basicBlock/mode)
     ;;@ fixture/exit-basicBlock.ts:4:14
     (i32.const 5)
    )
    (i32.const 1)
    ;;@ fixture/exit-basicBlock.ts:4:27
    (i32.eq
     ;;@ fixture/exit-basicBlock.ts:4:19
     (global.get $fixture/exit-basicBlock/mode)
     ;;@ fixture/exit-basicBlock.ts:4:27
     (i32.const 10)
    )
   )
   ;;@ fixture/exit-basicBlock.ts:5:17
   (local.set $result
    (i32.const 100)
   )
  )
 )
)